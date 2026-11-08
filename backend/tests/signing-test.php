<?php
/**
 * Lisans cevabı imza testi (sqlite bellek veritabanı). Eklentinin doğrulamasını (Ed25519, "qrms1\n…" mesajı) taklit eder.
 *   php backend/tests/signing-test.php
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

use QRLicense\License\Keys;
use QRLicense\License\Validator;

$pdo = new PDO('sqlite::memory:', null, null, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC));
foreach (array(
	'CREATE TABLE rate_buckets (bucket TEXT PRIMARY KEY, hits INT, reset_at TEXT)',
	"CREATE TABLE licenses (id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT, api_key_hmac TEXT UNIQUE, api_key_encrypted BLOB, domain TEXT, status TEXT DEFAULT 'aktif', starts_on TEXT, expires_on TEXT, amount_paid TEXT DEFAULT '', notes TEXT, tier_slug TEXT, last_seen_at TEXT, client_version TEXT DEFAULT '', archived_at TEXT, created_at TEXT, updated_at TEXT)",
	'CREATE TABLE license_modules (license_id INT, module_slug TEXT, PRIMARY KEY(license_id,module_slug))',
	"CREATE TABLE audit_events (id INTEGER PRIMARY KEY AUTOINCREMENT, license_id INT, occurred_at TEXT, actor TEXT, action TEXT, detail TEXT DEFAULT '')",
) as $q) {
	$pdo->exec($q);
}

$keys = new Keys(str_repeat('p', 40), bin2hex(random_bytes(32)));
$pdo->prepare("INSERT INTO licenses (company_name, api_key_hmac, domain, status) VALUES ('T', :h, '', 'aktif')")->execute(array('h' => $keys->hmac('GOOD')));
$pdo->prepare("INSERT INTO licenses (company_name, api_key_hmac, domain, status) VALUES ('P', :h, '', 'pasif')")->execute(array('h' => $keys->hmac('OFF')));
$pdo->exec("INSERT INTO license_modules VALUES (1,'restoran-menu'),(1,'qr-masa')");

$pair = sodium_crypto_sign_keypair();
$pub = sodium_crypto_sign_publickey($pair);
$fail = 0;
$check = static function (string $name, bool $ok) use (&$fail): void {
	echo ($ok ? 'ok   ' : 'FAIL ') . $name . "\n";
	if (!$ok) {
		$fail++;
	}
};
$verify = static function (array $body, string $domain) use ($pub): bool {
	// Eklentideki verify_signature() ile aynı kontroller.
	if (empty($body['sig']) || !isset($body['status'], $body['domain']) || strtolower($body['domain']) !== $domain) {
		return false;
	}
	$mods = isset($body['modules']) && is_array($body['modules']) ? $body['modules'] : array();
	$sig = base64_decode($body['sig'], true);

	return $sig !== false && sodium_crypto_sign_verify_detached($sig, "qrms1\n" . $body['status'] . "\n" . $domain . "\n" . implode(',', $mods), $pub);
};

foreach (array(
	'64 baytlık gizli anahtar' => base64_encode(sodium_crypto_sign_secretkey($pair)),
	'32 baytlık tohum' => base64_encode(sodium_crypto_sign_secretkey($pair) ? substr(sodium_crypto_sign_secretkey($pair), 0, 32) : ''),
) as $label => $cfg) {
	echo "-- $label\n";
	$v = new Validator($pdo, $keys, null, 100, 60, $cfg);
	$r = $v->validate('GOOD', 'https://www.Site.com/', '1.1.0', '1.1.1.1');
	$check('active: 200', $r['status'] === 200 && $r['body']['status'] === 'active');
	$check('active: imza eklenti kuralıyla doğrulanır', $verify($r['body'], 'site.com'));
	$r2 = $v->validate('GOOD', 'baska.com', '1.1.0', '1.1.1.1');
	$check('domain_mismatch imzalı', $r2['body']['status'] === 'domain_mismatch' && $verify($r2['body'], 'baska.com'));
	$check('imza başka alan adına taşınamaz', !$verify(array_merge($r['body']), 'baska.com'));
	$t = $r['body'];
	$t['modules'][] = 'qr-chatbot';
	$check('modül listesi değiştirilirse imza bozulur', !$verify($t, 'site.com'));
	$r3 = $v->validate('OFF', 'x.com', '1.1.0', '1.1.1.1');
	$check('inactive imzalı', $r3['body']['status'] === 'inactive' && $verify($r3['body'], 'x.com'));
	$r4 = $v->validate('NOPE', 'x.com', '1.1.0', '1.1.1.1');
	$check('invalid: 404 + imzalı', $r4['status'] === 404 && $verify($r4['body'], 'x.com'));
}

echo "-- anahtarsız\n";
$r = (new Validator($pdo, $keys, null, 100, 60))->validate('GOOD', 'site.com', '1.1.0', '1.1.1.1');
$check('anahtar yoksa imza yok (eskisi gibi)', !isset($r['body']['sig']));

echo "-- hız sınırı\n";
$v = new Validator($pdo, $keys, null, 1, 60, base64_encode(sodium_crypto_sign_secretkey($pair)));
$v->validate('GOOD', 'site.com', '1.1.0', '9.9.9.9');
$r = $v->validate('GOOD', 'site.com', '1.1.0', '9.9.9.9');
$check('429 imzalanmaz', $r['status'] === 429 && !isset($r['body']['sig']));

exit($fail === 0 ? 0 : 1);
