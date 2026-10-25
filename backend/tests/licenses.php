<?php
/**
 * Lisans yönetimi API testleri. SQLite kullanır.
 * MySQL satır kilidi ve cPanel bu dosyada çalıştırılmaz.
 */
declare(strict_types=1);

use QRLicense\Admin\Auth;
use QRLicense\Http\Router;
use QRLicense\License\Keys;
use QRLicense\License\LicenseAdmin;
use QRLicense\License\Validator;

require_once dirname(__DIR__) . '/src/Store/Database.php';
require_once dirname(__DIR__) . '/src/License/Keys.php';
require_once dirname(__DIR__) . '/src/License/Validator.php';
require_once dirname(__DIR__) . '/src/License/LicenseAdmin.php';
require_once dirname(__DIR__) . '/src/Admin/Auth.php';
require_once dirname(__DIR__) . '/src/Http/RequestContext.php';
require_once dirname(__DIR__) . '/src/Http/Router.php';

if (($argv[1] ?? '') === 'regen-child') {
	exit(regenChild());
}
if (($argv[1] ?? '') === 'unlock-child') {
	exit(unlockChild());
}

$failures = 0;
$checks = 0;

function check(string $name, bool $ok, string $detail = ''): void
{
	global $failures, $checks;
	$checks++;
	if ($ok) {
		fwrite(STDOUT, "ok  {$name}\n");
		return;
	}
	$failures++;
	fwrite(STDOUT, "FAIL {$name}" . ($detail !== '' ? " — {$detail}" : '') . "\n");
}

function utc(string $value): DateTimeImmutable
{
	return new DateTimeImmutable($value, new DateTimeZone('UTC'));
}

function applySchema(PDO $pdo): void
{
	$pdo->exec('PRAGMA foreign_keys = ON');
	$pdo->exec(
		'CREATE TABLE admins (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		)'
	);
	$pdo->exec(
		'CREATE TABLE admin_sessions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			admin_id INTEGER NOT NULL,
			token_hash TEXT NOT NULL UNIQUE,
			csrf_secret TEXT NOT NULL,
			expires_at TEXT NOT NULL
		)'
	);
	$pdo->exec(
		'CREATE TABLE licenses (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			company_name TEXT NOT NULL,
			api_key_hmac TEXT NOT NULL UNIQUE,
			api_key_encrypted BLOB NULL,
			domain TEXT NULL,
			status TEXT NOT NULL,
			starts_on TEXT NULL,
			expires_on TEXT NULL,
			amount_paid TEXT NOT NULL DEFAULT \'\',
			notes TEXT NULL,
			tier_slug TEXT NULL,
			last_seen_at TEXT NULL,
			client_version TEXT NOT NULL DEFAULT \'\',
			archived_at TEXT NULL,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		)'
	);
	$pdo->exec(
		'CREATE TABLE license_modules (
			license_id INTEGER NOT NULL,
			module_slug TEXT NOT NULL,
			PRIMARY KEY (license_id, module_slug)
		)'
	);
	$pdo->exec('CREATE TABLE tiers (slug TEXT PRIMARY KEY, label TEXT NOT NULL, sort_order INTEGER NOT NULL)');
	$pdo->exec(
		'CREATE TABLE tier_modules (
			tier_slug TEXT NOT NULL,
			module_slug TEXT NOT NULL,
			PRIMARY KEY (tier_slug, module_slug)
		)'
	);
	$pdo->exec(
		'CREATE TABLE audit_events (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			license_id INTEGER NOT NULL,
			occurred_at TEXT NOT NULL,
			actor TEXT NOT NULL,
			action TEXT NOT NULL,
			detail TEXT NOT NULL
		)'
	);
	$pdo->exec(
		'CREATE TABLE rate_buckets (
			bucket TEXT PRIMARY KEY,
			hits INTEGER NOT NULL,
			reset_at TEXT NOT NULL
		)'
	);
	$tiers = $pdo->prepare('INSERT INTO tiers (slug, label, sort_order) VALUES (:slug, :label, :sort)');
	foreach (array('baslangic' => array('Başlangıç', 1), 'pro' => array('Pro', 2), 'kurumsal' => array('Kurumsal', 3)) as $slug => $meta) {
		$tiers->execute(array('slug' => $slug, 'label' => $meta[0], 'sort' => $meta[1]));
	}
	$link = $pdo->prepare('INSERT INTO tier_modules (tier_slug, module_slug) VALUES (:tier, :module)');
	$templates = array(
		'baslangic' => array('restoran-menu', 'qr-masa', 'yorum-feedback'),
		'pro' => array(
			'restoran-menu', 'qr-masa', 'yorum-feedback', 'qr-analiz', 'qr-galeri',
			'qr-ceviri', 'qr-calisma-saatleri', 'qr-acilis-ekrani', 'header-footer-builder',
		),
		'kurumsal' => Validator::MODULE_SLUGS,
	);
	foreach ($templates as $tier => $modules) {
		foreach ($modules as $module) {
			$link->execute(array('tier' => $tier, 'module' => $module));
		}
	}
}

function openMemory(): PDO
{
	$pdo = new PDO('sqlite::memory:');
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	applySchema($pdo);

	return $pdo;
}

/**
 * @param array<string, mixed>|null $payload
 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
 */
function call(Router $router, string $method, string $uri, ?array $payload, string $cookie, string $csrf, string $ip = '203.0.113.80'): array
{
	$raw = '';
	if ($payload === array()) {
		$raw = '{}';
	} elseif ($payload !== null) {
		$encoded = json_encode($payload, JSON_UNESCAPED_UNICODE);
		$raw = is_string($encoded) ? $encoded : '';
	}

	return $router->dispatch($method, $uri, $raw, $ip, true, $cookie, $csrf);
}

function tokenFrom(array $result): string
{
	$header = $result['headers']['Set-Cookie'] ?? '';
	if (!preg_match('/qrl_session=([a-f0-9]{64})/', $header, $match)) {
		return '';
	}

	return $match[1];
}

function jsonOf(array $body): string
{
	$json = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

	return is_string($json) ? $json : '';
}

function licenseCount(PDO $pdo): int
{
	return (int) $pdo->query('SELECT COUNT(*) FROM licenses')->fetchColumn();
}

$clock = utc('2026-10-22 12:00:00');
$clockFn = static function () use (&$clock): DateTimeImmutable {
	return $clock;
};
$pdo = openMemory();
$keys = new Keys(str_repeat('p', 32), str_repeat('ab', 32));
$auth = new Auth($pdo, true, 86400 * 5, 'qrl_session', $clockFn, 20, 1000, 60);
$licenses = new LicenseAdmin($pdo, $keys, $clockFn);
$validator = new Validator($pdo, $keys, $clockFn);
$router = new Router($validator, $auth, $licenses);
$password = 'Pw-' . bin2hex(random_bytes(8));
$auth->createAdmin('ada', $password);
$login = $router->dispatch(
	'POST',
	'/api/admin/login',
	(string) json_encode(array('username' => 'ada', 'password' => $password)),
	'203.0.113.10',
	true
);
$cookie = '__Host-qrl_session=' . tokenFrom($login);
$csrf = (string) ($login['body']['csrf_token'] ?? '');
check('yönetici oturumu', $login['status'] === 200 && $csrf !== '' && tokenFrom($login) !== '');

$anon = call($router, 'GET', '/api/admin/summary', null, '', '', '203.0.113.11');
$anonWrite = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'Gizli',
	'tier' => 'baslangic',
), '', '', '203.0.113.12');
check('oturumsuz okuma reddedilir', $anon['status'] === 401 && ($anon['body']['error'] ?? '') === 'unauthenticated');
check('oturumsuz yazma reddedilir', $anonWrite['status'] === 401 && licenseCount($pdo) === 0);

$noCsrf = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'Gizli',
	'tier' => 'baslangic',
), $cookie, '');
check('CSRF olmadan oluşturma reddedilir', $noCsrf['status'] === 403 && ($noCsrf['body']['error'] ?? '') === 'invalid_csrf' && licenseCount($pdo) === 0);
$plainWrite = $router->dispatch(
	'POST',
	'/api/admin/licenses',
	(string) json_encode(array('company_name' => 'Gizli', 'tier' => 'baslangic')),
	'203.0.113.13',
	true,
	$cookie,
	$csrf,
	'text/plain'
);
check('JSON olmayan lisans yazımı reddedilir', $plainWrite['status'] === 415 && ($plainWrite['body']['error'] ?? '') === 'unsupported_media_type' && licenseCount($pdo) === 0);

$emptySummary = call($router, 'GET', '/api/admin/summary', null, $cookie, '');
check(
	'boş özet',
	$emptySummary['status'] === 200
		&& ($emptySummary['body']['total'] ?? null) === 0
		&& ($emptySummary['body']['usable'] ?? null) === 0
		&& ($emptySummary['body']['inactive'] ?? null) === 0
		&& ($emptySummary['body']['expired'] ?? null) === 0
);

$created = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'Mavi Sofra',
	'tier' => 'baslangic',
	'amount_paid' => '1200 TL',
	'notes' => 'İlk kayıt',
	'starts_on' => '2026-10-01',
), $cookie, $csrf);
$createdLicense = is_array($created['body']['license'] ?? null) ? $created['body']['license'] : array();
$apiKey = (string) ($created['body']['api_key'] ?? '');
$licenseId = (int) ($createdLicense['id'] ?? 0);
check(
	'lisans oluşturma',
	$created['status'] === 200
		&& $licenseId > 0
		&& preg_match('/^[a-f0-9]{40}$/', $apiKey) === 1
		&& ($createdLicense['company_name'] ?? '') === 'Mavi Sofra'
		&& ($createdLicense['tier'] ?? '') === 'baslangic'
		&& ($createdLicense['modules'] ?? null) === array('restoran-menu', 'yorum-feedback', 'qr-masa')
		&& array_key_exists('expires_on', $createdLicense) && $createdLicense['expires_on'] === null
		&& array_key_exists('domain', $createdLicense) && $createdLicense['domain'] === null
		&& ($createdLicense['state'] ?? '') === 'kullanilabilir'
		&& ($createdLicense['key_hint'] ?? '') === '••••' . substr($apiKey, -4)
		&& !array_key_exists('api_key', $createdLicense)
);
$stored = $pdo->prepare('SELECT api_key_hmac, api_key_encrypted, domain FROM licenses WHERE id = :id');
$stored->execute(array('id' => $licenseId));
$storedRow = $stored->fetch();
$hmac = is_array($storedRow) ? (string) $storedRow['api_key_hmac'] : '';
check('oluşturma anahtarı özetlenir', is_array($storedRow) && hash_equals($hmac, $keys->hmac($apiKey)) && $keys->decrypt((string) $storedRow['api_key_encrypted']) === $apiKey && ($storedRow['domain'] === null || $storedRow['domain'] === ''));

$today = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'Bugün Biter',
	'tier' => 'pro',
	'expires_on' => '2026-10-22',
), $cookie, $csrf);
$yesterday = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'Dün Bitti',
	'modules' => array('qr-masa'),
	'expires_on' => '2026-10-21',
), $cookie, $csrf);
$passive = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'Pasif Masa',
	'status' => 'pasif',
	'tier' => 'baslangic',
	'expires_on' => '2026-10-21',
), $cookie, $csrf);
$toArchive = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'Arşivlenecek',
	'tier' => 'baslangic',
	'expires_on' => '2026-10-21',
), $cookie, $csrf);
$archivedId = (int) ($toArchive['body']['license']['id'] ?? 0);
$archive = call($router, 'POST', '/api/admin/licenses/' . $archivedId . '/archive', array(), $cookie, $csrf);
$summary = call($router, 'GET', '/api/admin/summary', null, $cookie, '');
check(
	'özet sayıları çakışmaz',
	$archive['status'] === 200
		&& ($summary['body']['total'] ?? null) === 4
		&& ($summary['body']['usable'] ?? null) === 2
		&& ($summary['body']['inactive'] ?? null) === 1
		&& ($summary['body']['expired'] ?? null) === 1
		&& ($summary['body']['usable'] + $summary['body']['inactive'] + $summary['body']['expired']) === $summary['body']['total']
);
check('pasif lisans süresi dolmuş sayılmaz', ($passive['body']['license']['state'] ?? '') === 'pasif');
check('bitiş günü kullanılabilir', ($today['body']['license']['state'] ?? '') === 'kullanilabilir');
check('dünkü lisans süresi dolmuş', ($yesterday['body']['license']['state'] ?? '') === 'suresi_dolmus');

$list = call($router, 'GET', '/api/admin/licenses?sort=company_name&dir=asc', null, $cookie, '');
$listJson = jsonOf($list['body']);
check(
	'liste maskeli anahtar',
	$list['status'] === 200
		&& ($list['body']['total'] ?? null) === 4
		&& !str_contains($listJson, $apiKey)
		&& !str_contains($listJson, $hmac)
		&& !str_contains($listJson, 'api_key')
		&& str_contains($listJson, '••••' . substr($apiKey, -4))
);
$detail = call($router, 'GET', '/api/admin/licenses/' . $licenseId, null, $cookie, '');
$detailJson = jsonOf($detail['body']);
check(
	'ayrıntı maskeli anahtar',
	$detail['status'] === 200
		&& ($detail['body']['license']['key_hint'] ?? '') === '••••' . substr($apiKey, -4)
		&& !str_contains($detailJson, $apiKey)
		&& !array_key_exists('api_key', is_array($detail['body']['license'] ?? null) ? $detail['body']['license'] : array())
);

$missing = call($router, 'GET', '/api/admin/licenses/99999', null, $cookie, '');
check('olmayan lisans 404', $missing['status'] === 404 && ($missing['body']['error'] ?? '') === 'not_found');
$badJson = $router->dispatch('POST', '/api/admin/licenses', '{', '203.0.113.13', true, $cookie, $csrf);
check('bozuk JSON 400', $badJson['status'] === 400 && ($badJson['body']['error'] ?? '') === 'invalid_json');
$badModule = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'Hatalı Modül',
	'modules' => array('restoran-menu', 'olmayan-slug'),
), $cookie, $csrf);
check('geçersiz modül reddedilir', $badModule['status'] === 422 && in_array('modules', $badModule['body']['fields'] ?? array(), true) && licenseCount($pdo) === 5);

$injectedName = "A%' OR '1'='1";
$injected = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => $injectedName,
	'modules' => array("restoran-menu' OR '1'='1"),
), $cookie, $csrf);
check('enjeksiyonlu modül reddedilir', $injected['status'] === 422 && licenseCount($pdo) === 5);
$literal = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => $injectedName,
	'modules' => array('qr-masa'),
), $cookie, $csrf);
$decoy = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'ABZ Lokanta',
	'modules' => array('qr-masa'),
), $cookie, $csrf);
$found = call($router, 'GET', '/api/admin/licenses?q=' . rawurlencode($injectedName), null, $cookie, '');
$foundNames = array();
foreach ($found['body']['licenses'] ?? array() as $item) {
	if (is_array($item)) {
		$foundNames[] = $item['company_name'] ?? '';
	}
}
check('arama enjeksiyonu tek kaydı seçer', $literal['status'] === 200 && $decoy['status'] === 200 && $foundNames === array($injectedName));
$sortAttack = call($router, 'GET', '/api/admin/licenses?sort=created_at;DROP%20TABLE%20licenses&dir=desc', null, $cookie, '');
$statusAttack = call($router, 'GET', '/api/admin/licenses?status=aktif%27%20OR%20%271%27=%271', null, $cookie, '');
$pageAttack = call($router, 'GET', '/api/admin/licenses?per_page=999', null, $cookie, '');
check('sıralama ve filtre izin listesi', $sortAttack['status'] === 422 && $statusAttack['status'] === 422 && $pageAttack['status'] === 422 && licenseCount($pdo) === 7);
$brokenId = call($router, 'GET', '/api/admin/licenses/1%20OR%201=1', null, $cookie, '');
check('kimlik enjeksiyonu sorgu olmaz', $brokenId['status'] === 404 && licenseCount($pdo) === 7);

for ($i = 1; $i <= 25; $i++) {
	$made = call($router, 'POST', '/api/admin/licenses', array(
		'company_name' => sprintf('Sayfa %02d', $i),
		'modules' => array('qr-galeri'),
		'status' => $i % 2 === 0 ? 'pasif' : 'aktif',
	), $cookie, $csrf);
	if ($made['status'] !== 200) {
		check('sayfa kaydı', false, (string) $made['status']);
		break;
	}
}
$page = call($router, 'GET', '/api/admin/licenses?q=Sayfa&sort=company_name&dir=asc&page=2&per_page=10', null, $cookie, '');
$pageNames = array();
foreach ($page['body']['licenses'] ?? array() as $item) {
	if (is_array($item)) {
		$pageNames[] = (string) ($item['company_name'] ?? '');
	}
}
$expectedPage = array();
for ($i = 11; $i <= 20; $i++) {
	$expectedPage[] = sprintf('Sayfa %02d', $i);
}
check(
	'arama ve sayfalama',
	($page['body']['total'] ?? null) === 25
		&& ($page['body']['page'] ?? null) === 2
		&& ($page['body']['per_page'] ?? null) === 10
		&& $pageNames === $expectedPage
);
$passiveFilter = call($router, 'GET', '/api/admin/licenses?q=Sayfa&status=pasif&per_page=50', null, $cookie, '');
$passiveOnly = true;
foreach ($passiveFilter['body']['licenses'] ?? array() as $item) {
	if (!is_array($item) || ($item['status'] ?? '') !== 'pasif') {
		$passiveOnly = false;
	}
}
check('durum filtresi', ($passiveFilter['body']['total'] ?? null) === 12 && $passiveOnly);

$updated = call($router, 'PATCH', '/api/admin/licenses/' . $licenseId, array(
	'company_name' => 'Mavi Sofra Yenilendi',
	'notes' => 'Güncel not',
	'amount_paid' => '1500 TL',
), $cookie, $csrf);
$domainWrite = call($router, 'PATCH', '/api/admin/licenses/' . $licenseId, array(
	'domain' => 'baska.com',
), $cookie, $csrf);
$domainNow = $pdo->prepare('SELECT domain, company_name, last_seen_at FROM licenses WHERE id = :id');
$domainNow->execute(array('id' => $licenseId));
$domainRow = $domainNow->fetch();
check(
	'güncelleme domain yazmaz',
	$updated['status'] === 200
		&& ($updated['body']['license']['company_name'] ?? '') === 'Mavi Sofra Yenilendi'
		&& !array_key_exists('api_key', $updated['body'])
		&& $domainWrite['status'] === 422
		&& is_array($domainRow)
		&& ($domainRow['domain'] === null || $domainRow['domain'] === '')
		&& $domainRow['company_name'] === 'Mavi Sofra Yenilendi'
		&& ($domainRow['last_seen_at'] === null || $domainRow['last_seen_at'] === '')
);
$noCsrfUpdate = call($router, 'PATCH', '/api/admin/licenses/' . $licenseId, array('notes' => 'kaçak'), $cookie, '');
check('CSRF olmadan güncelleme reddedilir', $noCsrfUpdate['status'] === 403);

$pdo->prepare('INSERT INTO tier_modules (tier_slug, module_slug) VALUES (\'baslangic\', \'qr-analiz\')')->execute();
$afterTemplate = call($router, 'GET', '/api/admin/licenses/' . $licenseId, null, $cookie, '');
check(
	'paket şablonu geriye dönük değiştirmez',
	($afterTemplate['body']['license']['modules'] ?? null) === array('restoran-menu', 'yorum-feedback', 'qr-masa')
);
$custom = call($router, 'PATCH', '/api/admin/licenses/' . $licenseId, array(
	'tier' => 'pro',
	'modules' => array('qr-chatbot', 'qr-masa'),
), $cookie, $csrf);
check(
	'özel modül listesi saklanır',
	$custom['status'] === 200
		&& ($custom['body']['license']['tier'] ?? '') === 'pro'
		&& ($custom['body']['license']['modules'] ?? null) === array('qr-masa', 'qr-chatbot')
);
$reset = call($router, 'PATCH', '/api/admin/licenses/' . $licenseId, array('tier' => 'baslangic'), $cookie, $csrf);
check(
	'paket seçimi güncel şablonu kopyalar',
	$reset['status'] === 200
		&& ($reset['body']['license']['modules'] ?? null) === array('restoran-menu', 'yorum-feedback', 'qr-masa', 'qr-analiz')
);

$future = call($router, 'POST', '/api/admin/licenses', array(
	'company_name' => 'Gelecek Başlangıç',
	'tier' => 'baslangic',
	'starts_on' => '2099-01-01',
	'expires_on' => null,
), $cookie, $csrf);
$futureKey = (string) ($future['body']['api_key'] ?? '');
$futureActive = $validator->validate($futureKey, 'gelecek.com', '1.0.0', '203.0.113.40');
$futureLicense = is_array($future['body']['license'] ?? null) ? $future['body']['license'] : array();
check('süresiz lisans ve başlangıç tarihi doğrulamayı bozmaz', array_key_exists('expires_on', $futureLicense) && $futureLicense['expires_on'] === null && ($futureActive['body']['status'] ?? '') === 'active');

$clock = utc('2026-10-22 23:59:59');
$todayId = (int) ($today['body']['license']['id'] ?? 0);
$todayKey = (string) ($today['body']['api_key'] ?? '');
$stillToday = call($router, 'GET', '/api/admin/licenses/' . $todayId, null, $cookie, '');
$todayValidate = $validator->validate($todayKey, 'bugun.com', '1.0.0', '203.0.113.41');
check('bitiş günü 23:59:59 öncesi aktif', ($stillToday['body']['license']['state'] ?? '') === 'kullanilabilir' && ($todayValidate['body']['status'] ?? '') === 'active');
$clock = utc('2026-10-23 00:00:00');
$nextDay = call($router, 'GET', '/api/admin/licenses/' . $todayId, null, $cookie, '');
$expiredValidate = $validator->validate($todayKey, 'bugun.com', '1.0.0', '203.0.113.42');
check('ertesi gün süresi dolmuş', ($nextDay['body']['license']['state'] ?? '') === 'suresi_dolmus' && ($expiredValidate['body']['status'] ?? '') === 'expired');
$clock = utc('2026-10-22 12:00:00');

$yesterdayId = (int) ($yesterday['body']['license']['id'] ?? 0);
$yesterdayKey = (string) ($yesterday['body']['api_key'] ?? '');
$expiredLock = $validator->validate($yesterdayKey, 'eski.com', '1.0.0', '203.0.113.43');
$expiredDomain = $pdo->prepare('SELECT domain FROM licenses WHERE id = :id');
$expiredDomain->execute(array('id' => $yesterdayId));
$expiredDomainValue = $expiredDomain->fetchColumn();
check('süresi dolmuş lisans kilit yazmaz', ($expiredLock['body']['status'] ?? '') === 'expired' && ($expiredDomainValue === null || $expiredDomainValue === ''));
$passiveId = (int) ($passive['body']['license']['id'] ?? 0);
$passiveKey = (string) ($passive['body']['api_key'] ?? '');
$passiveResult = $validator->validate($passiveKey, 'pasif.com', '1.0.0', '203.0.113.44');
$passiveDomain = $pdo->prepare('SELECT domain FROM licenses WHERE id = :id');
$passiveDomain->execute(array('id' => $passiveId));
$passiveDomainValue = $passiveDomain->fetchColumn();
check('pasif lisans kilit yazmaz', ($passiveResult['body']['status'] ?? '') === 'inactive' && ($passiveDomainValue === null || $passiveDomainValue === ''));

$revealDenied = call($router, 'POST', '/api/admin/licenses/' . $licenseId . '/reveal-key', array(), $cookie, '');
$reveal = call($router, 'POST', '/api/admin/licenses/' . $licenseId . '/reveal-key', array(), $cookie, $csrf);
check('CSRF olmadan görüntüleme reddedilir', $revealDenied['status'] === 403);
check('anahtar görüntüleme', $reveal['status'] === 200 && ($reveal['body']['api_key'] ?? '') === $apiKey && !isset($reveal['body']['license']));

$regenDenied = call($router, 'POST', '/api/admin/licenses/' . $licenseId . '/regenerate-key', array(), $cookie, $csrf);
$hmacBefore = (string) $pdo->query('SELECT api_key_hmac FROM licenses WHERE id = ' . $licenseId)->fetchColumn();
check('onaysız yenileme reddedilir', $regenDenied['status'] === 422 && ($regenDenied['body']['error'] ?? '') === 'confirmation_required' && $hmacBefore === $hmac);
$regenerated = call($router, 'POST', '/api/admin/licenses/' . $licenseId . '/regenerate-key', array('confirm' => true), $cookie, $csrf);
$newKey = (string) ($regenerated['body']['api_key'] ?? '');
$oldValidate = $validator->validate($apiKey, 'mavi.com', '1.0.0', '203.0.113.45');
$newValidate = $validator->validate($newKey, 'mavi.com', '1.0.0', '203.0.113.46');
check(
	'yenileme eski anahtarı düşürür',
	$regenerated['status'] === 200
		&& $newKey !== ''
		&& $newKey !== $apiKey
		&& ($regenerated['body']['license']['key_hint'] ?? '') === '••••' . substr($newKey, -4)
		&& ($oldValidate['body']['status'] ?? '') === 'invalid'
		&& $oldValidate['status'] === 404
		&& ($newValidate['body']['status'] ?? '') === 'active'
		&& ($newValidate['body']['modules'] ?? null) === array('restoran-menu', 'yorum-feedback', 'qr-masa', 'qr-analiz')
);

$unlockDenied = call($router, 'POST', '/api/admin/licenses/' . $licenseId . '/unlock-domain', array('confirm' => false), $cookie, $csrf);
$lockedDomain = (string) $pdo->query('SELECT domain FROM licenses WHERE id = ' . $licenseId)->fetchColumn();
check('onaysız kilit açma reddedilir', $unlockDenied['status'] === 422 && $lockedDomain === 'mavi.com');
$unlocked = call($router, 'POST', '/api/admin/licenses/' . $licenseId . '/unlock-domain', array('confirm' => true), $cookie, $csrf);
$cleared = $pdo->query('SELECT domain FROM licenses WHERE id = ' . $licenseId)->fetchColumn();
$unlockedLicense = is_array($unlocked['body']['license'] ?? null) ? $unlocked['body']['license'] : array();
check('domain kilidi kalkar', $unlocked['status'] === 200 && array_key_exists('domain', $unlockedLicense) && $unlockedLicense['domain'] === null && ($cleared === null || $cleared === ''));
$relock = $validator->validate($newKey, 'yeni.com', '1.2.0', '203.0.113.47');
check('kilit yalnız doğrulamada edinilir', ($relock['body']['status'] ?? '') === 'active' && $pdo->query('SELECT domain FROM licenses WHERE id = ' . $licenseId)->fetchColumn() === 'yeni.com');

$mismatch = $validator->validate($newKey, 'baska.com', '1.2.0', '203.0.113.48');
check('domain uyuşmazlığı sürüyor', ($mismatch['body']['status'] ?? '') === 'domain_mismatch' && ($mismatch['body']['modules'] ?? null) === array());
$archivedKey = (string) ($toArchive['body']['api_key'] ?? '');
$archivedValidate = $validator->validate($archivedKey, 'arsiv.com', '1.0.0', '203.0.113.49');
check('arşiv doğrulamada geçersiz', $archivedValidate['status'] === 404 && ($archivedValidate['body']['status'] ?? '') === 'invalid');
$unknownKey = $validator->validate(bin2hex(random_bytes(20)), 'yok.com', '1.0.0', '203.0.113.50');
check('bilinmeyen anahtar geçersiz', $unknownKey['status'] === 404 && ($unknownKey['body']['status'] ?? '') === 'invalid');

$tight = new Router(new Validator($pdo, $keys, $clockFn, 1), $auth, $licenses);
$rateKey = (string) ($decoy['body']['api_key'] ?? '');
$rateFirst = $tight->dispatch('POST', '/v1/validate', (string) json_encode(array('api_key' => $rateKey, 'domain' => 'abz.com')), '203.0.113.60');
$rateSecond = $tight->dispatch('POST', '/v1/validate', (string) json_encode(array('api_key' => $rateKey, 'domain' => 'abz.com')), '203.0.113.60');
check('doğrulama hız sınırı sürüyor', ($rateFirst['body']['status'] ?? '') === 'active' && $rateSecond['status'] === 429 && ($rateSecond['body']['status'] ?? '') === 'rate_limited');

$legacy = $router->dispatch('POST', '/wp-json/qrmenu/v1/validate', '{}', '203.0.113.61');
check('qrmenu yolu kapalı', $legacy['status'] === 404);
$aliasPayload = (string) json_encode(array('api_key' => $newKey, 'domain' => 'yeni.com', 'version' => '1.2.0'));
$aliasNew = $router->dispatch('POST', '/v1/validate', $aliasPayload, '203.0.113.63');
$aliasOld = $router->dispatch('POST', '/wp-json/qmls/v1/validate', $aliasPayload, '203.0.113.64');
check(
	'eski doğrulama yolu aynı gövde',
	$aliasNew['status'] === 200
		&& $aliasOld['status'] === $aliasNew['status']
		&& $aliasOld['body'] === $aliasNew['body']
		&& ($aliasOld['body']['status'] ?? '') === 'active'
		&& ($aliasOld['body']['modules'] ?? null) === array('restoran-menu', 'yorum-feedback', 'qr-masa', 'qr-analiz')
);
$moduleCount = (int) $pdo->query('SELECT COUNT(*) FROM license_modules')->fetchColumn();
$licenseCount = (int) $pdo->query('SELECT COUNT(*) FROM licenses')->fetchColumn();
$tiersAnon = $router->dispatch('GET', '/api/admin/tiers', '', '203.0.113.65');
$tiersPost = $router->dispatch('POST', '/api/admin/tiers', '{}', '203.0.113.66', true, $cookie, $csrf);
$tiersGet = call($router, 'GET', '/api/admin/tiers', null, $cookie, '');
$tierMap = array();
foreach ($tiersGet['body']['tiers'] ?? array() as $tierRow) {
	if (is_array($tierRow) && isset($tierRow['slug'])) {
		$tierMap[(string) $tierRow['slug']] = $tierRow['modules'] ?? null;
	}
}
// Önceki kontrol baslangic şablonuna qr-analiz ekledi. Okuma güncel şablonu döndürmeli.
$proExpected = array(
	'restoran-menu', 'yorum-feedback', 'qr-masa', 'qr-analiz', 'qr-galeri', 'qr-ceviri',
	'qr-calisma-saatleri', 'qr-acilis-ekrani', 'header-footer-builder',
);
check(
	'paket şablonları yalnız oturumla okunur',
	$tiersAnon['status'] === 401
		&& ($tiersAnon['body']['error'] ?? '') === 'unauthenticated'
		&& $tiersPost['status'] === 405
		&& $tiersGet['status'] === 200
		&& ($tierMap['baslangic'] ?? null) === array('restoran-menu', 'yorum-feedback', 'qr-masa', 'qr-analiz')
		&& ($tierMap['pro'] ?? null) === $proExpected
		&& ($tierMap['kurumsal'] ?? null) === Validator::MODULE_SLUGS
		&& (int) $pdo->query('SELECT COUNT(*) FROM license_modules')->fetchColumn() === $moduleCount
		&& (int) $pdo->query('SELECT COUNT(*) FROM licenses')->fetchColumn() === $licenseCount
		&& !str_contains(jsonOf($tiersGet['body']), 'temel')
		&& !str_contains(jsonOf($tiersGet['body']), 'plus')
);

$audit = call($router, 'GET', '/api/admin/audit?license=' . $licenseId . '&per_page=50', null, $cookie, '');
$actions = array();
$auditJson = jsonOf($audit['body']);
foreach ($audit['body']['events'] ?? array() as $event) {
	if (is_array($event)) {
		$actions[] = (string) ($event['action'] ?? '');
	}
}
check(
	'denetim kayıtları',
	$audit['status'] === 200
		&& in_array('olusturuldu', $actions, true)
		&& in_array('guncellendi', $actions, true)
		&& in_array('anahtar_goruntulendi', $actions, true)
		&& in_array('anahtar_yenilendi', $actions, true)
		&& in_array('domain_kilidi_kaldirildi', $actions, true)
		&& !str_contains($auditJson, $apiKey)
		&& !str_contains($auditJson, $newKey)
		&& !str_contains($auditJson, $password)
		&& !str_contains($auditJson, $hmac)
);
$auditRows = $pdo->query('SELECT detail, actor FROM audit_events')->fetchAll();
$auditClean = true;
foreach ($auditRows as $row) {
	if (!is_array($row)) {
		continue;
	}
	$text = (string) $row['detail'] . (string) $row['actor'];
	if (str_contains($text, $apiKey) || str_contains($text, $newKey) || str_contains($text, $password) || str_contains($text, $futureKey)) {
		$auditClean = false;
	}
}
check('denetim metninde gizli yok', $auditClean && is_array($auditRows));
$archivedAudit = call($router, 'GET', '/api/admin/audit?license=' . $archivedId, null, $cookie, '');
$archivedActions = array();
foreach ($archivedAudit['body']['events'] ?? array() as $event) {
	if (is_array($event)) {
		$archivedActions[] = (string) ($event['action'] ?? '');
	}
}
check('arşiv denetimi', in_array('arsivlendi', $archivedActions, true) && ($archive['body']['license']['state'] ?? '') === 'arsiv');

$listed = call($router, 'GET', '/api/admin/licenses?q=Ar%C5%9Fivlenecek', null, $cookie, '');
check('arşiv listede görünmez', ($listed['body']['total'] ?? null) === 0);

$migration = (string) file_get_contents(dirname(__DIR__) . '/migrations/002_license_tier.sql');
check(
	'paket sütunu silmeden eklenir',
	str_contains($migration, 'ADD COLUMN tier_slug')
		&& preg_match('/\bDROP\s/i', $migration) !== 1
		&& preg_match('/\bDELETE\s+FROM\b/i', $migration) !== 1
		&& preg_match('/\bTRUNCATE\b/i', $migration) !== 1
);

check('eşzamanlı anahtar yenileme', concurrentRegen($keys), '');
check('eşzamanlı kilit açma', concurrentUnlock($keys), '');

fwrite(STDOUT, "\n{$checks} kontrol, {$failures} hata\n");
exit($failures === 0 ? 0 : 1);

function concurrentRegen(Keys $keys): bool
{
	$path = tempnam(sys_get_temp_dir(), 'qrlreg');
	if ($path === false) {
		return false;
	}
	unlink($path);
	$pdo = new PDO('sqlite:' . $path);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$pdo->exec('PRAGMA journal_mode = WAL');
	applySchema($pdo);
	$admin = new LicenseAdmin($pdo, $keys);
	$created = $admin->create(array(
		'company_name' => 'Yarış',
		'modules' => array('qr-masa'),
	), 'ada');
	$id = (int) ($created['body']['license']['id'] ?? 0);
	$firstKey = (string) ($created['body']['api_key'] ?? '');
	$pdo = null;
	if ($id < 1 || $firstKey === '') {
		unlink($path);
		return false;
	}

	$children = race($path, 'regen-child', $id, $keys);
	$reader = new PDO('sqlite:' . $path);
	$reader->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$reader->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$row = $reader->query('SELECT api_key_hmac, api_key_encrypted FROM licenses WHERE id = ' . $id)->fetch();
	$details = $reader->query('SELECT detail FROM audit_events')->fetchAll();
	unlink($path);
	if (!is_array($row)) {
		return false;
	}
	$plain = $keys->decrypt((string) $row['api_key_encrypted']);
	if (!hash_equals($keys->hmac($plain), (string) $row['api_key_hmac'])) {
		return false;
	}
	$returned = array();
	$wins = 0;
	$conflicts = 0;
	foreach ($children as $child) {
		$status = (int) ($child['status'] ?? 0);
		$key = (string) ($child['api_key'] ?? '');
		if ($status === 200 && $key !== '') {
			$wins++;
			$returned[] = $key;
		} elseif ($status === 409 && ($child['error'] ?? '') === 'conflict' && $key === '') {
			$conflicts++;
		}
	}
	if ($wins !== 1 || $conflicts !== count($children) - 1 || !in_array($plain, $returned, true)) {
		return false;
	}
	foreach ($returned as $key) {
		if ($key !== $plain && hash_equals($keys->hmac($key), (string) $row['api_key_hmac'])) {
			return false;
		}
	}
	foreach ($details as $detail) {
		if (!is_array($detail)) {
			continue;
		}
		$text = (string) $detail['detail'];
		if (str_contains($text, $plain) || str_contains($text, $firstKey)) {
			return false;
		}
		foreach ($returned as $key) {
			if ($key !== '' && str_contains($text, $key)) {
				return false;
			}
		}
	}

	return count($returned) === 1;
}

function concurrentUnlock(Keys $keys): bool
{
	$path = tempnam(sys_get_temp_dir(), 'qrlun');
	if ($path === false) {
		return false;
	}
	unlink($path);
	$pdo = new PDO('sqlite:' . $path);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$pdo->exec('PRAGMA journal_mode = WAL');
	applySchema($pdo);
	$admin = new LicenseAdmin($pdo, $keys);
	$created = $admin->create(array(
		'company_name' => 'Kilit Yarışı',
		'modules' => array('qr-masa'),
	), 'ada');
	$id = (int) ($created['body']['license']['id'] ?? 0);
	$pdo->prepare('UPDATE licenses SET domain = :domain WHERE id = :id')->execute(array(
		'domain' => 'kilit.com',
		'id' => $id,
	));
	$pdo = null;

	$children = race($path, 'unlock-child', $id, $keys);
	$reader = new PDO('sqlite:' . $path);
	$reader->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$domain = $reader->query('SELECT domain FROM licenses WHERE id = ' . $id)->fetchColumn();
	$wins = 0;
	$blocked = 0;
	foreach ($children as $child) {
		if (($child['status'] ?? 0) === 200) {
			$wins++;
		}
		if (($child['error'] ?? '') === 'not_locked' || ($child['error'] ?? '') === 'conflict') {
			$blocked++;
		}
	}
	unlink($path);

	return $wins === 1 && $blocked === 1 && ($domain === null || $domain === '');
}

/**
 * @return list<array<string, mixed>>
 */
function race(string $path, string $mode, int $id, Keys $keys): array
{
	$children = array();
	$pepper = str_repeat('p', 32);
	$encryption = str_repeat('ab', 32);
	$barrier = '';
	if ($mode === 'regen-child') {
		$created = tempnam(sys_get_temp_dir(), 'qrlbar');
		if (is_string($created)) {
			$barrier = $created;
		}
	}
	for ($i = 0; $i < 2; $i++) {
		$command = array(PHP_BINARY, __FILE__, $mode);
		$env = array(
			'QR_TEST_DB' => $path,
			'QR_TEST_ID' => (string) $id,
			'QR_PEPPER' => $pepper,
			'QR_ENC' => $encryption,
		);
		if ($barrier !== '') {
			$env['QR_REGEN_BARRIER'] = $barrier;
		}
		$proc = proc_open(
			$command,
			array(1 => array('pipe', 'w'), 2 => array('pipe', 'w')),
			$pipes,
			null,
			$env
		);
		if (!is_resource($proc)) {
			if ($barrier !== '') {
				unlink($barrier);
			}
			return array();
		}
		$children[] = array($proc, $pipes[1], $pipes[2]);
	}

	$decoded = array();
	foreach ($children as $child) {
		$stdout = stream_get_contents($child[1]);
		stream_get_contents($child[2]);
		fclose($child[1]);
		fclose($child[2]);
		proc_close($child[0]);
		$parsed = json_decode(is_string($stdout) ? $stdout : '', true);
		$decoded[] = is_array($parsed) ? $parsed : array();
	}
	if ($barrier !== '') {
		unlink($barrier);
	}

	return $decoded;
}

function regenChild(): int
{
	return childAction(static function (LicenseAdmin $admin, int $id): array {
		return $admin->regenerate($id, array('confirm' => true), 'ada');
	});
}

function unlockChild(): int
{
	return childAction(static function (LicenseAdmin $admin, int $id): array {
		return $admin->unlockDomain($id, array('confirm' => true), 'ada');
	});
}

/**
 * @param callable(LicenseAdmin, int): array{status:int,body:array<string,mixed>,headers:array<string,string>} $action
 */
function childAction(callable $action): int
{
	try {
		$pdo = new PDO('sqlite:' . (string) getenv('QR_TEST_DB'));
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->exec('PRAGMA busy_timeout = 5000');
		$admin = new LicenseAdmin($pdo, new Keys((string) getenv('QR_PEPPER'), (string) getenv('QR_ENC')));
		$result = $action($admin, (int) getenv('QR_TEST_ID'));
		fwrite(STDOUT, (string) json_encode(array(
			'status' => $result['status'],
			'error' => $result['body']['error'] ?? '',
			'api_key' => $result['body']['api_key'] ?? '',
		)));

		return 0;
	} catch (Throwable $e) {
		fwrite(STDOUT, (string) json_encode(array('status' => 500, 'error' => $e::class, 'api_key' => '')));

		return 1;
	}
}
