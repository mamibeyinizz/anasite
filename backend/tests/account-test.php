<?php
/**
 * Müşteri hesabı, lisans bağlama ve güvenlik regresyon testi (sqlite bellek veritabanı, ağ/MySQL gerekmez).
 *   php backend/tests/account-test.php
 * Çıkış kodu 0: hepsi geçti. Yalnızca test içindir; üretimde çalıştırmayın.
 * Not: MySQL'e özgü davranış (kilitler, gerçek mail()) burada denenmez.
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
	http_response_code(404);
	exit(1);
}

spl_autoload_register(static function (string $c): void {
	if (str_starts_with($c, 'QRLicense\\')) {
		require dirname(__DIR__) . '/src/' . str_replace('\\', '/', substr($c, 10)) . '.php';
	}
});

use QRLicense\Account\Accounts;
use QRLicense\License\Keys;
use QRLicense\License\LicenseAdmin;

ini_set('error_log', '/dev/null');
$pdo = new PDO('sqlite::memory:', null, null, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC));
foreach (array(
	'CREATE TABLE rate_buckets (bucket TEXT PRIMARY KEY, hits INT, reset_at TEXT)',
	"CREATE TABLE customers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password_hash TEXT, name TEXT, business TEXT DEFAULT '', phone TEXT DEFAULT '', domain TEXT DEFAULT '', terms_accepted_at TEXT, created_at TEXT, updated_at TEXT, last_login_at TEXT, email_verified_at TEXT)",
	'CREATE TABLE customer_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INT, token_hash TEXT UNIQUE, csrf_secret TEXT, created_at TEXT, expires_at TEXT)',
	"CREATE TABLE customer_orders (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INT, ref TEXT UNIQUE, plan TEXT, period TEXT, status TEXT DEFAULT 'test', created_at TEXT)",
	'CREATE TABLE customer_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INT, kind TEXT, token_hash TEXT UNIQUE, new_email TEXT, created_at TEXT, expires_at TEXT)',
	'CREATE TABLE customer_licenses (license_id INTEGER PRIMARY KEY, customer_id INT, linked_at TEXT)',
	'CREATE TABLE tiers (slug TEXT PRIMARY KEY, label TEXT, sort_order INT)',
	"INSERT INTO tiers VALUES ('pro','Pro',2)",
	"CREATE TABLE licenses (id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT, api_key_hmac TEXT UNIQUE, api_key_encrypted BLOB, domain TEXT, status TEXT DEFAULT 'aktif', starts_on TEXT, expires_on TEXT, amount_paid TEXT DEFAULT '', notes TEXT, tier_slug TEXT, last_seen_at TEXT, client_version TEXT DEFAULT '', archived_at TEXT, created_at TEXT, updated_at TEXT)",
	'CREATE TABLE license_modules (license_id INT, module_slug TEXT, PRIMARY KEY(license_id,module_slug))',
	"CREATE TABLE audit_events (id INTEGER PRIMARY KEY AUTOINCREMENT, license_id INT, occurred_at TEXT, actor TEXT, action TEXT, detail TEXT DEFAULT '')",
) as $q) {
	$pdo->exec($q);
}

$keys = new Keys(str_repeat('p', 40), str_repeat('ab', 32));
$mails = array();
$mailer = static function (string $to, string $sub, string $body) use (&$mails): bool {
	$mails[] = array($to, $sub, $body);

	return true;
};
$acc = new Accounts($pdo, false, 2592000, 'qrc_session', true, null, 'https://x.test', $mailer, $keys);
$admin = new LicenseAdmin($pdo, $keys, null, $mailer, 'https://x.test');

$fail = 0;
$ip = 0;
function t(string $name, bool $ok): void
{
	global $fail;
	echo ($ok ? 'ok   ' : 'FAIL ') . $name . "\n";
	if (!$ok) {
		$fail = 1;
	}
}
function cookie(array $r): string
{
	return explode(';', $r['headers']['Set-Cookie'])[0];
}
function token(array $m): string
{
	preg_match('/=([a-f0-9]{64})/', $m[2], $x);

	return $x[1];
}
/** Her çağrı kendi IP'sinden gelir (aksi halde hız sınırları testleri birbirine karışır). */
function call(string $m, string $p, array $d = array(), string $c = '', string $cs = '', ?string $from = null): array
{
	global $acc, $ip;
	$from ??= '10.0.' . intdiv(++$ip, 250) . '.' . ($ip % 250);

	return $acc->handle($m, $p, $d, $from, false, $c, $cs);
}
/** Kayıt isteği (202); ertelenmiş e-postalar hemen gönderilir. */
function register(string $email, array $extra = array()): array
{
	global $acc;
	$r = call('POST', '/api/account/register', array_merge(array('email' => $email, 'name' => 'Test Kisi', 'terms' => true), $extra));
	$acc->flushDeferred();

	return $r;
}
/** Etkinleştirme e-postasındaki bağlantıyla parola belirler; oturum açılmış yanıtı döner. */
function activate(string $email, string $pass = 'uzun-parola-123'): array
{
	global $mails;
	for ($i = count($mails) - 1; $i >= 0; $i--) {
		if ($mails[$i][0] === $email && str_contains($mails[$i][2], 'dogrula=')) {
			return call('POST', '/api/account/activate', array('token' => token($mails[$i]), 'password' => $pass));
		}
	}
	throw new RuntimeException('etkinleştirme e-postası yok: ' . $email);
}
/** Doğrulanmış, oturumu açık yeni hesap (kayıt + e-postadaki bağlantı). */
function signup(string $email, string $pass = 'uzun-parola-123'): array
{
	register($email);

	return activate($email, $pass);
}
/** Önceki sürümdeki gibi parolalı ama e-postası doğrulanmamış hesap (eski kayıtlar / ön-ele geçirme senaryosu). */
function signupLegacy(string $email, string $pass = 'uzun-parola-123'): array
{
	global $pdo;
	$r = signup($email, $pass);
	$pdo->exec("UPDATE customers SET email_verified_at = NULL WHERE email = '" . $email . "'");

	return $r;
}
function login(string $email, string $pass = 'uzun-parola-123'): array
{
	return call('POST', '/api/account/login', array('email' => $email, 'password' => $pass));
}
function verified(string $email): void
{
	global $pdo;
	$pdo->exec("UPDATE customers SET email_verified_at = '2026-01-01 00:00:00' WHERE email = '" . $email . "'");
}

echo "-- çekirdek\n";
t('me anonim', call('GET', '/api/account/me')['body']['authenticated'] === false);
t('bilinmeyen yol 404 / yanlış metot 405', call('GET', '/api/account/x')['status'] === 404 && call('GET', '/api/account/login')['status'] === 405);
echo "-- kayıt akışı (e-posta numaralandırma yok)\n";
$mails = array();
$new = register(' Ayse@Example.COM ', array('next' => 'odeme/?paket=pro&donem=annual'));
t('kayıt 202, oturum çerezi yok, parola alınmaz', $new['status'] === 202 && !isset($new['headers']['Set-Cookie']) && $new['body'] === array('status' => 'ok', 'pending' => true));
t('adres küçük harfe çevrilir, parola henüz yok', $pdo->query("SELECT password_hash FROM customers WHERE email='ayse@example.com'")->fetchColumn() === '!');
t('etkinleştirme e-postası + next bağlantıda', count($mails) === 1 && $mails[0][0] === 'ayse@example.com' && str_contains($mails[0][2], '/giris/?dogrula=') && str_contains($mails[0][2], '&next=odeme%2F'));
$ayseMail = $mails[0];
t('parola belirlenmeden giriş olmaz', login('ayse@example.com', 'herhangi-parola-1')['status'] === 401);
$mails = array();
register('nx1@example.com', array('next' => 'https://evil.test/'));
register('nx2@example.com', array('next' => '//evil.test'));
t('geçersiz next yok sayılır (açık yönlendirme yok)', count($mails) === 2 && !str_contains($mails[0][2], 'next=') && !str_contains($mails[1][2], 'next='));
t('kayıt doğrulaması 422', call('POST', '/api/account/register', array('email' => 'x', 'name' => 'a', 'terms' => false))['status'] === 422);
t('verify: parolasız kayıt bağlantısı tüketilmez, parola ister', ($v = call('POST', '/api/account/verify', array('token' => token($ayseMail))))['status'] === 200 && ($v['body']['needs_password'] ?? false) === true);
t('activate: kısa parola 422, geçersiz bağlantı 410', call('POST', '/api/account/activate', array('token' => token($ayseMail), 'password' => 'kisa'))['status'] === 422 && call('POST', '/api/account/activate', array('token' => str_repeat('a', 64), 'password' => 'uzun-parola-123'))['status'] === 410);
$r = call('POST', '/api/account/activate', array('token' => token($ayseMail), 'password' => 'uzun-parola-123'));
t('activate: oturum açılır, e-posta doğrulanmış, e-posta küçük harf', $r['status'] === 200 && $r['body']['customer']['email_verified'] === true && $r['body']['customer']['email'] === 'ayse@example.com' && isset($r['headers']['Set-Cookie']));
t('activate bağlantısı tek kullanımlık', call('POST', '/api/account/activate', array('token' => token($ayseMail), 'password' => 'baska-parola-12345'))['status'] === 410);
$mails = array();
$dupe = register('ayse@example.com');
$fresh = register('yeni-kisi@example.com');
t('409 YOK: kayıtlı ve kayıtsız adrese birebir aynı yanıt', $dupe['status'] === 202 && $dupe['status'] === $fresh['status'] && $dupe['body'] === $fresh['body'] && $dupe['headers'] === $fresh['headers']);
$notice = null;
foreach ($mails as $m) {
	if ($m[0] === 'ayse@example.com') {
		$notice = $m;
	}
}
t('kayıtlı adrese yalnız bilgilendirme gider (doğrulama bağlantısı yok)', $notice !== null && str_contains($notice[2], 'zaten bir hesabınız') && !str_contains($notice[2], 'dogrula='));
$mails = array();
register('bek@example.com');
$oldTok = token($mails[0]);
register('bek@example.com');
t('bekleyen kayıt yeniden gönderilir; eski bağlantı geçersiz', count($mails) === 2 && call('POST', '/api/account/activate', array('token' => $oldTok, 'password' => 'uzun-parola-123'))['status'] === 410 && activate('bek@example.com')['status'] === 200);
$mails = array();
$statuses = array();
for ($i = 0; $i < 5; $i++) {
	$statuses[] = register('cap@example.com')['status'];
}
t('aynı adrese saatte en fazla 3 e-posta, yanıt hep aynı', count($mails) === 3 && count(array_unique($statuses)) === 1);
$c = cookie($r);
$cs = $r['body']['csrf_token'];

t('çerez HttpOnly + parola/oturum düz saklanmaz', str_contains($r['headers']['Set-Cookie'], 'HttpOnly') && $pdo->query("SELECT password_hash FROM customers WHERE email='ayse@example.com'")->fetchColumn() !== 'uzun-parola-123' && !str_contains($c, (string) $pdo->query('SELECT token_hash FROM customer_sessions LIMIT 1')->fetchColumn()));
t('csrf yok 403 / oturum yok 401', call('PATCH', '/api/account/profile', array('name' => 'Ayse Yilmaz'), $c, '')['status'] === 403 && call('PATCH', '/api/account/profile', array('name' => 'Ayse Yilmaz'))['status'] === 401);
$r = call('PATCH', '/api/account/profile', array('name' => 'Ayse Demir', 'business' => '<b>X</b>', 'domain' => 'https://Ornek.com/yol?x=1'), $c, $cs);
t('profil güncelleme + alan adı normalleşir', $r['status'] === 200 && $r['body']['customer']['domain'] === 'ornek.com');
t('sipariş: geçersiz 422, geçerli 201', call('POST', '/api/account/orders', array('plan' => 'x', 'period' => 'monthly'), $c, $cs)['status'] === 422 && call('POST', '/api/account/orders', array('plan' => 'pro', 'period' => 'annual'), $c, $cs)['status'] === 201);
t('yanlış parola 401', login('ayse@example.com', 'yanlis-parola-1')['status'] === 401);
$r2 = login('ayse@example.com');
t('giriş 200', $r2['status'] === 200);
$c2 = cookie($r2);
t('parola değiştirme: diğer oturum kapanır, bu açık', call('POST', '/api/account/password', array('current' => 'uzun-parola-123', 'password' => 'yeni-parola-45678'), $c, $cs)['status'] === 200 && call('GET', '/api/account/me', array(), $c2)['body']['authenticated'] === false && call('GET', '/api/account/me', array(), $c)['body']['authenticated'] === true);
t('çıkış', call('POST', '/api/account/logout', array(), $c, $cs)['status'] === 200 && call('GET', '/api/account/me', array(), $c)['body']['authenticated'] === false);
$r = login('ayse@example.com', 'yeni-parola-45678');
$c = cookie($r);
$cs = $r['body']['csrf_token'];
t('silme: yanlış parola 422, doğru 200, kayıt kalmaz', call('DELETE', '/api/account', array('password' => 'x'), $c, $cs)['status'] === 422 && call('DELETE', '/api/account', array('password' => 'yeni-parola-45678'), $c, $cs)['status'] === 200 && (int) $pdo->query("SELECT COUNT(*) FROM customers WHERE email='ayse@example.com'")->fetchColumn() === 0 && (int) $pdo->query('SELECT COUNT(*) FROM customer_orders')->fetchColumn() === 0);

echo "-- kurtarma / doğrulama\n";
$r = signupLegacy('k@example.com');
$c = cookie($r);
$cs = $r['body']['csrf_token'];
$mails = array();
call('POST', '/api/account/verify/resend', array(), $c, $cs);
t('doğrulama: geçersiz 410, geçerli 200, tek kullanımlık', call('POST', '/api/account/verify', array('token' => str_repeat('a', 64)))['status'] === 410 && call('POST', '/api/account/verify', array('token' => token($mails[0])))['status'] === 200 && call('POST', '/api/account/verify', array('token' => token($mails[0])))['status'] === 410);
$mails = array();
$r = call('POST', '/api/account/forgot', array('email' => 'yok@example.com'));
t('forgot kayıtsız: aynı yanıt, e-posta yok', $r['status'] === 200 && $acc->flushDeferred() === null && count($mails) === 0);
$r = call('POST', '/api/account/forgot', array('email' => 'K@example.com'));
t('forgot: yanıt e-postadan ÖNCE döner (ertelenmiş)', $r['status'] === 200 && count($mails) === 0);
$acc->flushDeferred();
t('forgot: ertelenmiş e-posta gitti', count($mails) === 1 && str_contains($mails[0][2], '?sifirla='));
$tok = token($mails[0]);
t('reset: kısa parola 422, geçersiz token 410', call('POST', '/api/account/reset', array('token' => $tok, 'password' => 'kisa'))['status'] === 422 && call('POST', '/api/account/reset', array('token' => str_repeat('b', 64), 'password' => 'yeni-parola-98765'))['status'] === 410);
t('reset 200, oturumlar kapanır, token tek kullanımlık', call('POST', '/api/account/reset', array('token' => $tok, 'password' => 'yeni-parola-98765'))['status'] === 200 && call('GET', '/api/account/me', array(), $c)['body']['authenticated'] === false && call('POST', '/api/account/reset', array('token' => $tok, 'password' => 'baska-parola-11111'))['status'] === 410);
$r = login('k@example.com', 'yeni-parola-98765');
t('yeni parolayla giriş', $r['status'] === 200);
$c = cookie($r);
$cs = $r['body']['csrf_token'];
$mails = array();
call('POST', '/api/account/forgot', array('email' => 'k@example.com'));
$acc->flushDeferred();
$pdo->exec("UPDATE customer_tokens SET expires_at='2000-01-01 00:00:00'");
t('süresi dolan reset 410', call('POST', '/api/account/reset', array('token' => token($mails[0]), 'password' => 'yeni-parola-77777'))['status'] === 410);
$mails = array();
$r = call('POST', '/api/account/email', array('email' => 'k2@example.com', 'password' => 'yeni-parola-98765'), $c, $cs);
t('e-posta değiştirme: bekleyen adres, eski adres geçerli', $r['status'] === 200 && $r['body']['customer']['pending_email'] === 'k2@example.com' && $r['body']['customer']['email'] === 'k@example.com');
t('e-posta değiştirme onayı', call('POST', '/api/account/verify', array('token' => token($mails[0])))['status'] === 200 && call('GET', '/api/account/me', array(), $c)['body']['customer']['email'] === 'k2@example.com');

echo "-- güvenlik regresyonları\n";
// 2) reset önceden başlatılmış e-posta değiştirmeyi iptal eder; reset e-postayı doğrulanmış yapar
$mails = array();
$r = signupLegacy('mag@example.com', 'saldirgan-parola-1');
$ac = cookie($r);
$acs = $r['body']['csrf_token'];
$mails = array();
call('POST', '/api/account/email', array('email' => 'saldirgan@evil.test', 'password' => 'saldirgan-parola-1'), $ac, $acs);
$evil = token($mails[0]);
$mails = array();
call('POST', '/api/account/forgot', array('email' => 'mag@example.com'));
$acc->flushDeferred();
call('POST', '/api/account/reset', array('token' => token($mails[0]), 'password' => 'magdur-yeni-parola-9'));
t('reset sonrası saldırganın bekleyen e-posta token\'ı geçersiz', call('POST', '/api/account/verify', array('token' => $evil))['status'] === 410 && $pdo->query("SELECT email FROM customers WHERE email LIKE 'mag@%'")->fetchColumn() === 'mag@example.com');
t('reset e-postayı doğrulanmış yapar', $pdo->query("SELECT email_verified_at FROM customers WHERE email='mag@example.com'")->fetchColumn() !== null);
t('önceki saldırgan oturumu kapalı', call('GET', '/api/account/me', array(), $ac)['body']['authenticated'] === false);

// 4) giriş kilitlenmesi: başkasının 10 yanlış denemesi kurbanı engellemez
signup('hedef@example.com', 'dogru-parola-12345');
for ($i = 0; $i < 12; $i++) {
	call('POST', '/api/account/login', array('email' => 'hedef@example.com', 'password' => 'yanlis' . $i . 'xxxxx'), '', '', '66.66.66.66');
}
t('saldırganın IP\'si kilitlenir', call('POST', '/api/account/login', array('email' => 'hedef@example.com', 'password' => 'yanlis-x-xxxx'), '', '', '66.66.66.66')['status'] === 429);
t('kurban başka IP\'den doğru parolayla girebilir', login('hedef@example.com', 'dogru-parola-12345')['status'] === 200);

// 5) istek başına bcrypt yok
$t0 = microtime(true);
for ($i = 0; $i < 5; $i++) {
	new Accounts($pdo, false);
}
t('Accounts yapıcısı bcrypt üretmez (<5 ms)', ((microtime(true) - $t0) / 5 * 1000) < 5);

// 7) hesap başına ortak parola deneme sınırı (farklı IP'ler, farklı uç noktalar)
$r = signup('sizdi@example.com', 'dogru-parola-12345');
$sc = cookie($r);
$scs = $r['body']['csrf_token'];
$blocked = false;
for ($i = 0; $i < 14; $i++) {
	$ep = array('/api/account/password', '/api/account/license-key', '/api/account/email', '/api/account/password')[$i % 4];
	$res = call('POST', $ep, array('current' => 'yanlis-xxxx-' . $i, 'password' => 'yeni-parola-12345', 'id' => 1, 'email' => 'z@example.com'), $sc, $scs);
	if ($res['status'] === 429) {
		$blocked = true;
	}
}
t('çalınmış oturumla parola tahmini: hesap başına sınır (uç noktalar birleşik)', $blocked);

// 9) bcrypt 72 bayt kırpması yok
$long = str_repeat('a', 72);
signup('uzun@example.com', $long . 'SONEK-1');
t('72 baytı aşan parolanın farkı korunur', login('uzun@example.com', $long . 'BASKA-2')['status'] === 401 && login('uzun@example.com', $long . 'SONEK-1')['status'] === 200);

// 8) numaralandırma: e-posta değiştirmede alıcı başına sınır (posta kutusu doldurma)
$r = signup('bomb@example.com');
$bc = cookie($r);
$bcs = $r['body']['csrf_token'];
$limited = 0;
for ($i = 0; $i < 5; $i++) {
	if (call('POST', '/api/account/email', array('email' => 'kurban-kutu@example.com', 'password' => 'uzun-parola-123'), $bc, $bcs)['status'] === 429) {
		$limited++;
	}
}
t('aynı adrese art arda onay e-postası sınırlanır', $limited >= 1);
$mails = array();
$r = signupLegacy('dogrulanmamis@example.com');
$uc = cookie($r);
$ucs = $r['body']['csrf_token'];
$mails = array();
$sent = 0;
for ($i = 0; $i < 5; $i++) {
	$x = call('POST', '/api/account/verify/resend', array(), $uc, $ucs);
	if ($x['status'] === 200) {
		$sent++;
	}
}
t('doğrulama e-postası yeniden gönderimi hesap başına sınırlı', $sent === 3);

echo "-- lisans\n";
$r = signupLegacy('lis@example.com');
$lc = cookie($r);
$lcs = $r['body']['csrf_token'];
t('lisanssız: boş liste', $r['body']['licenses'] === array());
$L = $admin->create(array('company_name' => 'Lokanta', 'status' => 'aktif', 'tier' => 'pro', 'modules' => array('restoran-menu', 'qr-masa'), 'expires_on' => '2099-01-01'), 'admin');
$lid = $L['body']['license']['id'];
$key = $L['body']['api_key'];
t('bağlama: olmayan müşteri 404, geçersiz alan 422', $admin->assignCustomer($lid, array('email' => 'yok@example.com'), 'admin')['status'] === 404 && $admin->assignCustomer($lid, array('email' => 'x', 'foo' => 1), 'admin')['status'] === 422);
$mails = array();
$res = $admin->assignCustomer($lid, array('email' => 'lis@example.com'), 'admin');
t('1) DOĞRULANMAMIŞ hesaba lisans bağlanamaz (e-posta kapma)', $res['status'] === 409 && $res['body']['error'] === 'email_not_verified' && count($mails) === 0);
t('1) bağlanmadığı için saldırgan anahtarı alamaz', call('POST', '/api/account/license-key', array('id' => $lid, 'password' => 'uzun-parola-123'), $lc, $lcs)['status'] === 404);
verified('lis@example.com');
$res = $admin->assignCustomer($lid, array('email' => ' LIS@Example.com '), 'admin');
t('doğrulanmış hesaba bağlanır + bildirim e-postası (anahtarsız)', $res['status'] === 200 && $res['body']['notified'] === true && count($mails) === 1 && !str_contains($mails[0][2], $key) && str_contains($mails[0][2], '/hesabim/#lisans'));
t('aynı müşteriye tekrar: e-posta yok', $admin->assignCustomer($lid, array('email' => 'lis@example.com'), 'admin')['body']['notified'] === null && count($mails) === 1);
$me = call('GET', '/api/account/me', array(), $lc)['body'];
$l = $me['licenses'][0] ?? array();
t('hesabımda lisans: durum/paket/modüller/ipucu, düz anahtar yok', ($l['state'] ?? '') === 'kullanilabilir' && $l['tier'] === 'Pro' && $l['modules'] === array('qr-masa', 'restoran-menu') && $l['key_hint'] === '••••' . substr($key, -4) && !str_contains(json_encode($me), $key));
t('anahtar: yanlış parola 422, csrf yok 403, başkasının lisansı 404', call('POST', '/api/account/license-key', array('id' => $lid, 'password' => 'x'), $lc, $lcs)['status'] === 422 && call('POST', '/api/account/license-key', array('id' => $lid, 'password' => 'uzun-parola-123'), $lc, '')['status'] === 403 && call('POST', '/api/account/license-key', array('id' => 9999, 'password' => 'uzun-parola-123'), $lc, $lcs)['status'] === 404);
$g = call('POST', '/api/account/license-key', array('id' => $lid, 'password' => 'uzun-parola-123'), $lc, $lcs);
t('anahtar doğru parolayla döner', $g['status'] === 200 && $g['body']['api_key'] === $key);
t('10) denetim aktörü e-posta içermez (KVKK)', $pdo->query("SELECT actor FROM audit_events WHERE action='anahtar_musteri_goruntuledi' LIMIT 1")->fetchColumn() === 'musteri:#' . $pdo->query("SELECT id FROM customers WHERE email='lis@example.com'")->fetchColumn());
$r3 = signup('baska@example.com');
t('başka müşteri lisansı görmez / anahtarı alamaz', $r3['body']['licenses'] === array() && call('POST', '/api/account/license-key', array('id' => $lid, 'password' => 'uzun-parola-123'), cookie($r3), $r3['body']['csrf_token'])['status'] === 404);
$pdo->exec("UPDATE licenses SET status='pasif' WHERE id=$lid");
$s1 = call('GET', '/api/account/me', array(), $lc)['body']['licenses'][0]['state'];
$pdo->exec("UPDATE licenses SET status='aktif', expires_on='2000-01-01' WHERE id=$lid");
$s2 = call('GET', '/api/account/me', array(), $lc)['body']['licenses'][0]['state'];
t('durumlar: pasif / süresi dolmuş', $s1 === 'pasif' && $s2 === 'suresi_dolmus');
$pdo->exec("UPDATE licenses SET archived_at='2026-01-01 00:00:00' WHERE id=$lid");
t('arşivlenen gizlenir, anahtar 404', call('GET', '/api/account/me', array(), $lc)['body']['licenses'] === array() && call('POST', '/api/account/license-key', array('id' => $lid, 'password' => 'uzun-parola-123'), $lc, $lcs)['status'] === 404);
$pdo->exec("UPDATE licenses SET archived_at=NULL WHERE id=$lid");
t('bağlantıyı kaldır', $admin->assignCustomer($lid, array('email' => null), 'admin')['status'] === 200 && call('GET', '/api/account/me', array(), $lc)['body']['licenses'] === array());
$admin->assignCustomer($lid, array('email' => 'lis@example.com'), 'admin');
t('hesap silinince bağlantı silinir, lisans kalır', call('DELETE', '/api/account', array('password' => 'uzun-parola-123'), $lc, $lcs)['status'] === 200 && (int) $pdo->query('SELECT COUNT(*) FROM customer_licenses')->fetchColumn() === 0 && (int) $pdo->query("SELECT COUNT(*) FROM licenses WHERE id=$lid")->fetchColumn() === 1);

echo "-- istemci IP'si\n";
$srv = array('REMOTE_ADDR' => '172.16.0.5', 'HTTP_CF_CONNECTING_IP' => '203.0.113.9');
t('varsayılan: başlık yok sayılır', \QRLicense\Http\RequestContext::clientIp($srv) === '172.16.0.5');
t('güvenilen vekil + başlık: gerçek IP', \QRLicense\Http\RequestContext::clientIp($srv, array('172.16.0.5'), 'HTTP_CF_CONNECTING_IP') === '203.0.113.9');
t('güvenilmeyen eş başlığı sahteleyemez', \QRLicense\Http\RequestContext::clientIp(array('REMOTE_ADDR' => '198.51.100.1', 'HTTP_CF_CONNECTING_IP' => '1.2.3.4'), array('172.16.0.5'), 'HTTP_CF_CONNECTING_IP') === '198.51.100.1');
t('geçersiz başlık değeri yok sayılır', \QRLicense\Http\RequestContext::clientIp(array('REMOTE_ADDR' => '172.16.0.5', 'HTTP_CF_CONNECTING_IP' => 'bozuk'), array('172.16.0.5'), 'HTTP_CF_CONNECTING_IP') === '172.16.0.5');

exit($fail);
