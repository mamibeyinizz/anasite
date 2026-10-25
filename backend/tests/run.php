<?php
/**
 * Doğrulama API'sinin yerel testleri. SQLite kullanır.
 * MySQL şema dosyası ayrıca metin olarak denetlenir; sunucu yoksa çalıştırılmaz.
 */
declare(strict_types=1);

use QRLicense\Http\Router;
use QRLicense\License\Keys;
use QRLicense\License\Validator;
use QRLicense\Store\Database;

require_once dirname(__DIR__) . '/src/Store/Database.php';
require_once dirname(__DIR__) . '/src/License/Keys.php';
require_once dirname(__DIR__) . '/src/License/Validator.php';
require_once dirname(__DIR__) . '/src/Http/Router.php';

if (($argv[1] ?? '') === 'lock-child') {
	exit(lockChild($argv[2] ?? '', $argv[3] ?? '', (int) ($argv[4] ?? 0)));
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
	$time = new DateTimeImmutable($value, new DateTimeZone('UTC'));
	return $time;
}

function memoryPdo(): PDO
{
	$pdo = new PDO('sqlite::memory:');
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$pdo->exec('PRAGMA foreign_keys = ON');
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
	return $pdo;
}

function keys(): Keys
{
	return new Keys(str_repeat('p', 32), str_repeat('ab', 32));
}

function seed(PDO $pdo, Keys $keys, string $apiKey, array $fields, array $modules): int
{
	$now = '2026-10-22 12:00:00';
	$statement = $pdo->prepare(
		'INSERT INTO licenses (
			company_name, api_key_hmac, api_key_encrypted, domain, status, starts_on, expires_on,
			amount_paid, notes, client_version, archived_at, created_at, updated_at
		) VALUES (
			:company, :hmac, :enc, :domain, :status, :starts, :expires,
			:amount, :notes, :version, :archived, :created, :updated
		)'
	);
	$statement->execute(array(
		'company' => $fields['company'] ?? 'Test',
		'hmac' => $keys->hmac($apiKey),
		'enc' => $keys->encrypt($apiKey),
		'domain' => $fields['domain'] ?? null,
		'status' => $fields['status'] ?? 'aktif',
		'starts' => $fields['starts_on'] ?? null,
		'expires' => $fields['expires_on'] ?? null,
		'amount' => '',
		'notes' => 'not',
		'version' => $fields['client_version'] ?? '',
		'archived' => $fields['archived_at'] ?? null,
		'created' => $now,
		'updated' => $now,
	));
	$id = (int) $pdo->lastInsertId();
	$link = $pdo->prepare('INSERT INTO license_modules (license_id, module_slug) VALUES (:id, :slug)');
	foreach ($modules as $slug) {
		$link->execute(array('id' => $id, 'slug' => $slug));
	}
	return $id;
}

function validator(PDO $pdo, Keys $keys, ?DateTimeImmutable $now = null, int $max = 20): Validator
{
	$clock = $now ?? utc('2026-10-22 12:00:00');
	return new Validator($pdo, $keys, static function () use ($clock): DateTimeImmutable {
		return $clock;
	}, $max, 60);
}

function bodyOf(Validator $validator, string $key, string $domain, string $version = '1.1.0', string $ip = '203.0.113.10'): array
{
	return $validator->validate($key, $domain, $version, $ip);
}

$key = bin2hex(random_bytes(20));
$secret = keys();
$pdo = memoryPdo();
$id = seed($pdo, $secret, $key, array('domain' => null), array('qr-servis-paneli', 'restoran-menu', 'bilinmeyen-slug'));
$validator = validator($pdo, $secret);

$plainPort = Validator::normalizeDomain('WWW.Ornek.com:8443/yol?q=1');
check('protokolsüz port ve yol kırpılır', $plainPort === 'ornek.com', $plainPort);
$active = bodyOf($validator, $key, 'https://www.Site.com/menu');
check('aktif HTTP 200', $active['status'] === 200);
check('doğrulama önbelleğe kapanır', ($active['headers']['Cache-Control'] ?? '') === 'no-store');
check('aktif durum', ($active['body']['status'] ?? '') === 'active');
check('bilinen modüller sabit sırada', ($active['body']['modules'] ?? null) === array('restoran-menu', 'qr-servis-paneli'), json_encode($active['body']['modules'] ?? null));
$domain = $pdo->query('SELECT domain FROM licenses WHERE id = ' . $id)->fetchColumn();
check('ilk domain kilidi normalize edildi', $domain === 'site.com', (string) $domain);
$seen = $pdo->query('SELECT last_seen_at FROM licenses WHERE id = ' . $id)->fetchColumn();
check('son görülme UTC yazıldı', $seen === '2026-10-22 12:00:00', (string) $seen);

$mismatch = bodyOf($validator, $key, 'baska.com');
check('domain uyuşmazlığı HTTP 200', $mismatch['status'] === 200 && ($mismatch['body']['status'] ?? '') === 'domain_mismatch');
check('uyuşmazlıkta modül listesi boş', ($mismatch['body']['modules'] ?? null) === array());
$domain = $pdo->query('SELECT domain FROM licenses WHERE id = ' . $id)->fetchColumn();
check('uyuşmazlık kilidi değiştirmedi', $domain === 'site.com');

$invalid = bodyOf($validator, str_repeat('a', 40), 'site.com');
check('geçersiz anahtar HTTP 404', $invalid['status'] === 404 && ($invalid['body']['status'] ?? '') === 'invalid');
check('geçersiz cevapta modules yok', !array_key_exists('modules', $invalid['body']));

$injection = "' OR 1=1 --";
$injected = bodyOf($validator, $injection, 'site.com');
check('SQL enjeksiyonu kayıt seçmez', $injected['status'] === 404);
check('enjeksiyon sonrası lisans duruyor', (int) $pdo->query('SELECT COUNT(*) FROM licenses')->fetchColumn() === 1);

$passiveKey = bin2hex(random_bytes(20));
$passiveId = seed($pdo, $secret, $passiveKey, array('status' => 'pasif', 'domain' => null, 'starts_on' => '2099-01-01'), array('qr-masa'));
$passive = bodyOf(validator($pdo, $secret), $passiveKey, 'yeni.com', '1.1.0', '203.0.113.11');
check('pasif HTTP 200', $passive['status'] === 200 && ($passive['body']['status'] ?? '') === 'inactive');
check('pasif cevapta modules yok', !array_key_exists('modules', $passive['body']));
$passiveDomain = $pdo->query('SELECT domain FROM licenses WHERE id = ' . $passiveId)->fetchColumn();
check('pasif lisans domain kilitlemez', $passiveDomain === null || $passiveDomain === '');

$expiredKey = bin2hex(random_bytes(20));
$expiredId = seed($pdo, $secret, $expiredKey, array('domain' => null, 'expires_on' => '2026-10-21', 'starts_on' => '2020-01-01'), array('qr-masa'));
$expired = bodyOf(validator($pdo, $secret), $expiredKey, 'sure.com', '1.1.0', '203.0.113.12');
check('süresi dolmuş HTTP 200', $expired['status'] === 200 && ($expired['body']['status'] ?? '') === 'expired');
check('süresi dolmuş modül listesi boş', ($expired['body']['modules'] ?? null) === array());
$expiredDomain = $pdo->query('SELECT domain FROM licenses WHERE id = ' . $expiredId)->fetchColumn();
check('süresi dolmuş lisans domain kilitlemez', $expiredDomain === null || $expiredDomain === '');

$todayKey = bin2hex(random_bytes(20));
seed($pdo, $secret, $todayKey, array('domain' => 'bugun.com', 'expires_on' => '2026-10-22'), array('qr-masa'));
$today = bodyOf(validator($pdo, $secret), $todayKey, 'bugun.com', '1.1.0', '203.0.113.13');
check('bitiş günü 23:59:59 UTC öncesi aktif', ($today['body']['status'] ?? '') === 'active');

$futureStart = bin2hex(random_bytes(20));
seed($pdo, $secret, $futureStart, array('domain' => 'erken.com', 'starts_on' => '2099-01-01'), array('qr-masa'));
$early = bodyOf(validator($pdo, $secret), $futureStart, 'erken.com', '1.1.0', '203.0.113.14');
check('başlangıç tarihi doğrulamayı engellemez', ($early['body']['status'] ?? '') === 'active');

$emptyKey = bin2hex(random_bytes(20));
$emptyId = seed($pdo, $secret, $emptyKey, array('domain' => null), array('qr-masa'));
$empty = bodyOf(validator($pdo, $secret), $emptyKey, '   ', '1.1.0', '203.0.113.15');
check('boş domain kilit yazmaz', ($empty['body']['status'] ?? '') === 'domain_mismatch');
$emptyDomain = $pdo->query('SELECT domain FROM licenses WHERE id = ' . $emptyId)->fetchColumn();
check('boş denemeden sonra domain boş', $emptyDomain === null || $emptyDomain === '');

$versionKey = bin2hex(random_bytes(20));
$versionId = seed($pdo, $secret, $versionKey, array('domain' => 'surum.com', 'client_version' => '1.0.0'), array('qr-masa'));
bodyOf(validator($pdo, $secret), $versionKey, 'surum.com', '1.2.0', '203.0.113.16');
$version = $pdo->query('SELECT client_version FROM licenses WHERE id = ' . $versionId)->fetchColumn();
$audit = $pdo->query('SELECT detail FROM audit_events WHERE license_id = ' . $versionId)->fetchColumn();
check('sürüm güncellendi', $version === '1.2.0');
check('denetim kaydı anahtarı içermez', is_string($audit) && $audit === '1.0.0 → 1.2.0' && strpos($audit, $versionKey) === false);
$controlKey = bin2hex(random_bytes(20));
$controlId = seed($pdo, $secret, $controlKey, array('domain' => 'satir.com', 'client_version' => '1.0.0'), array('qr-masa'));
bodyOf($validator, $controlKey, 'satir.com', "1.4.0\nX-Satir: deneme", '203.0.113.77');
$controlVersion = $pdo->query('SELECT client_version FROM licenses WHERE id = ' . $controlId)->fetchColumn();
$controlAudit = $pdo->query("SELECT detail FROM audit_events WHERE license_id = " . $controlId . " AND action = 'surum_guncellendi'")->fetchColumn();
check(
	'sürüm satır sonu denetimde kalmaz',
	$controlVersion === '1.4.0X-Satir: deneme'
		&& is_string($controlAudit)
		&& !str_contains($controlAudit, "\n")
		&& !str_contains($controlAudit, $controlKey)
		&& str_contains($controlAudit, '1.4.0X-Satir: deneme')
);

$limited = validator(memoryPdo(), $secret, null, 2);
$first = $limited->validate($key, 'site.com', '', '198.51.100.8');
$second = $limited->validate($key, 'site.com', '', '198.51.100.8');
$third = $limited->validate($key, 'site.com', '', '198.51.100.8');
check('limit içindeki istek geçer', $first['status'] !== 429 && $second['status'] !== 429, (string) $first['status'] . '/' . (string) $second['status']);
check('limit aşımı HTTP 429', $third['status'] === 429 && ($third['body']['status'] ?? '') === 'rate_limited');
check('Retry-After var', isset($third['headers']['Retry-After']) && ctype_digit($third['headers']['Retry-After']) && (int) $third['headers']['Retry-After'] >= 1 && ($third['headers']['Cache-Control'] ?? '') === 'no-store');

$router = new Router($validator);
$plainType = $router->dispatch('POST', '/v1/validate', '{"api_key":"abc","domain":"a.test"}', '203.0.113.90', true, '', '', 'text/plain');
check('JSON olmayan doğrulama reddedilir', $plainType['status'] === 415 && ($plainType['body']['error'] ?? '') === 'unsupported_media_type' && ($plainType['body']['status'] ?? '') === 'error' && !array_key_exists('api_key', $plainType['body']));
$typed = $router->dispatch('POST', '/v1/validate', '{"api_key":"abc"}', '203.0.113.91', true, '', '', 'application/json; charset=UTF-8');
check('json içerik türü parametreli kabul', $typed['status'] === 400 && ($typed['body']['error'] ?? '') === 'missing_field');
$badJson = $router->dispatch('POST', '/v1/validate', '{', '203.0.113.20');
check('bozuk JSON 400', $badJson['status'] === 400 && ($badJson['body']['error'] ?? '') === 'invalid_json');
$missing = $router->dispatch('POST', '/v1/validate', '{"api_key":"abc"}', '203.0.113.21');
check('eksik domain 400', $missing['status'] === 400 && ($missing['body']['error'] ?? '') === 'missing_field');
check('hatalı istek anahtarı geri vermez', !array_key_exists('api_key', $badJson['body']) && !array_key_exists('api_key', $missing['body']));
$method = $router->dispatch('GET', '/v1/validate', '', '203.0.113.22');
check('GET kabul edilmez', $method['status'] === 405);
$aliasCases = array(
	array('POST', '{'),
	array('POST', '{"api_key":"abc"}'),
	array('POST', '{}'),
	array('GET', ''),
);
foreach ($aliasCases as $index => $aliasCase) {
	$fresh = $router->dispatch($aliasCase[0], '/v1/validate', $aliasCase[1], '203.0.113.' . (30 + $index));
	$alias = $router->dispatch($aliasCase[0], '/wp-json/qmls/v1/validate', $aliasCase[1], '203.0.113.' . (30 + $index));
	$slash = $router->dispatch($aliasCase[0], '/wp-json/qmls/v1/validate/', $aliasCase[1], '203.0.113.' . (40 + $index));
	check(
		'eski yol aynı yanıt: ' . $aliasCase[0],
		$fresh === $alias && $alias === $slash && !isset($alias['headers']['Location']),
		json_encode($alias['body'])
	);
}
$qrmenu = $router->dispatch('POST', '/wp-json/qrmenu/v1/validate', '{}', '203.0.113.23');
check('qrmenu yolu kapalı', $qrmenu['status'] === 404 && ($qrmenu['body']['status'] ?? '') === 'not_found');
check('eski yol aktif lisansı aynı doğrular', aliasLicense($secret));
check('eski ve yeni yol aynı hız sınırını kullanır', aliasRate($secret));

$round = $secret->decrypt($secret->encrypt($key));
check('anahtar şifreleme turu', $round === $key);
check('üretilen anahtar 40 hex', preg_match('/^[a-f0-9]{40}$/', $secret->generate()) === 1);

$schema = (string) file_get_contents(dirname(__DIR__) . '/migrations/001_schema.sql');
check('şemada DROP yok', preg_match('/\bDROP\s/i', $schema) !== 1);
check('şemada DELETE FROM yok', preg_match('/\bDELETE\s+FROM\b/i', $schema) !== 1);
check('şemada TRUNCATE yok', preg_match('/\bTRUNCATE\b/i', $schema) !== 1);
foreach (array('admins', 'admin_sessions', 'licenses', 'license_modules', 'tiers', 'tier_modules', 'audit_events', 'rate_buckets') as $table) {
	check('tablo var: ' . $table, strpos($schema, 'CREATE TABLE IF NOT EXISTS ' . $table) !== false);
}
check('fabrika paketleri IGNORE ile eklenir', strpos($schema, 'INSERT IGNORE INTO tiers') !== false && strpos($schema, 'INSERT IGNORE INTO tier_modules') !== false);
check('13 slug şemada duruyor', substr_count($schema, 'qr-menu-muhendisligi') >= 2 && strpos($schema, 'qr-servis-paneli') !== false);

$example = require dirname(__DIR__) . '/config.example.php';
check('örnek parolası boş', ($example['db']['password'] ?? 'x') === '' && ($example['key_pepper'] ?? 'x') === '' && ($example['encryption_key'] ?? 'x') === '');

$badConfig = tempnam(sys_get_temp_dir(), 'qrl');
file_put_contents($badConfig, "<?php return array('db'=>array('dsn'=>'mysql:host=127.0.0.1;dbname=yok','user'=>'u','password'=>'gizli-parola'),'key_pepper'=>'" . str_repeat('p', 32) . "','encryption_key'=>'" . str_repeat('ab', 32) . "');");
$command = array(PHP_BINARY, dirname(__DIR__) . '/public/index.php');
$spec = array(0 => array('pipe', 'r'), 1 => array('pipe', 'w'), 2 => array('pipe', 'w'));
$process = proc_open($command, $spec, $pipes, null, array('QR_LICENSE_CONFIG' => $badConfig, 'REQUEST_METHOD' => 'POST', 'REQUEST_URI' => '/v1/validate', 'REMOTE_ADDR' => '127.0.0.1'));
fwrite($pipes[0], '{"api_key":"' . $key . '","domain":"site.com"}');
fclose($pipes[0]);
$stdout = stream_get_contents($pipes[1]);
$stderr = stream_get_contents($pipes[2]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);
unlink($badConfig);
check('bağlantı hatası HTTP 500', strpos($stderr, 'HTTP 500') !== false, trim($stderr));
check('hata gövdesinde parola yok', strpos($stdout . $stderr, 'gizli-parola') === false && strpos($stdout, 'SQLSTATE') === false, $stdout);

$weakConfig = tempnam(sys_get_temp_dir(), 'qrl');
$weakDb = tempnam(sys_get_temp_dir(), 'qrldb');
file_put_contents($weakConfig, "<?php return array('db'=>array('dsn'=>'sqlite:" . $weakDb . "','user'=>'','password'=>''),'key_pepper'=>'','encryption_key'=>'');");
$weak = proc_open(
	array(PHP_BINARY, dirname(__DIR__) . '/public/index.php'),
	array(0 => array('pipe', 'r'), 1 => array('pipe', 'w'), 2 => array('pipe', 'w')),
	$weakPipes,
	null,
	array('QR_LICENSE_CONFIG' => $weakConfig, 'REQUEST_METHOD' => 'POST', 'REQUEST_URI' => '/v1/validate', 'REMOTE_ADDR' => '127.0.0.1')
);
fwrite($weakPipes[0], '{}');
fclose($weakPipes[0]);
$weakOut = stream_get_contents($weakPipes[1]);
$weakErr = stream_get_contents($weakPipes[2]);
fclose($weakPipes[1]);
fclose($weakPipes[2]);
proc_close($weak);
unlink($weakConfig);
unlink($weakDb);
check('eksik gizli anahtar başlatmayı reddeder', strpos($weakErr, 'HTTP 500') !== false && strpos($weakOut, '"error":"server_error"') !== false, trim($weakErr));
check('reddedilen açılış anahtar üretmez', preg_match('/[a-f0-9]{40}/', $weakOut . $weakErr) !== 1 && strpos($weakOut, 'key_pepper') === false);

check('eşzamanlı kilit tek kazanan', concurrentLock(), '');

fwrite(STDOUT, "\n{$checks} kontrol, {$failures} hata\n");
exit($failures > 0 ? 1 : 0);

function aliasLicense(Keys $secret): bool
{
	$pdo = memoryPdo();
	$clock = utc('2026-10-22 15:00:00');
	$validator = new Validator($pdo, $secret, static function () use ($clock): DateTimeImmutable {
		return $clock;
	}, 20, 60);
	$router = new Router($validator);
	$activeKey = bin2hex(random_bytes(20));
	$passiveKey = bin2hex(random_bytes(20));
	$expiredKey = bin2hex(random_bytes(20));
	seed($pdo, $secret, $activeKey, array('domain' => null, 'expires_on' => '2026-10-22'), array('qr-servis-paneli', 'restoran-menu'));
	seed($pdo, $secret, $passiveKey, array('status' => 'pasif', 'domain' => null), array('qr-masa'));
	seed($pdo, $secret, $expiredKey, array('domain' => null, 'expires_on' => '2026-10-21'), array('qr-masa'));
	$activeBody = (string) json_encode(array('api_key' => $activeKey, 'domain' => 'https://www.Alias.test/yol', 'version' => '2.0.0'));
	$oldActive = $router->dispatch('POST', '/wp-json/qmls/v1/validate', $activeBody, '198.51.100.40');
	$newActive = $router->dispatch('POST', '/v1/validate', $activeBody, '198.51.100.41');
	$locked = $pdo->query('SELECT domain FROM licenses WHERE api_key_hmac = ' . $pdo->quote($secret->hmac($activeKey)))->fetchColumn();
	$mismatchBody = (string) json_encode(array('api_key' => $activeKey, 'domain' => 'baska.test'));
	$oldMismatch = $router->dispatch('POST', '/wp-json/qmls/v1/validate', $mismatchBody, '198.51.100.42');
	$newMismatch = $router->dispatch('POST', '/v1/validate', $mismatchBody, '198.51.100.43');
	$passiveBody = (string) json_encode(array('api_key' => $passiveKey, 'domain' => 'pasif.test'));
	$expiredBody = (string) json_encode(array('api_key' => $expiredKey, 'domain' => 'sure.test'));
	$oldPassive = $router->dispatch('POST', '/wp-json/qmls/v1/validate', $passiveBody, '198.51.100.44');
	$newPassive = $router->dispatch('POST', '/v1/validate', $passiveBody, '198.51.100.45');
	$oldExpired = $router->dispatch('POST', '/wp-json/qmls/v1/validate', $expiredBody, '198.51.100.46');
	$newExpired = $router->dispatch('POST', '/v1/validate', $expiredBody, '198.51.100.47');
	$unknown = (string) json_encode(array('api_key' => str_repeat('b', 40), 'domain' => 'yok.test'));
	$oldUnknown = $router->dispatch('POST', '/wp-json/qmls/v1/validate', $unknown, '198.51.100.48');
	$newUnknown = $router->dispatch('POST', '/v1/validate', $unknown, '198.51.100.49');

	return $oldActive['body'] === $newActive['body']
		&& $oldActive['status'] === 200
		&& ($oldActive['body']['status'] ?? '') === 'active'
		&& ($oldActive['body']['modules'] ?? null) === array('restoran-menu', 'qr-servis-paneli')
		&& $locked === 'alias.test'
		&& $oldMismatch['body'] === $newMismatch['body']
		&& ($oldMismatch['body']['status'] ?? '') === 'domain_mismatch'
		&& ($oldMismatch['body']['modules'] ?? null) === array()
		&& $oldPassive['body'] === $newPassive['body']
		&& ($oldPassive['body']['status'] ?? '') === 'inactive'
		&& !array_key_exists('modules', $oldPassive['body'])
		&& $oldExpired['body'] === $newExpired['body']
		&& ($oldExpired['body']['status'] ?? '') === 'expired'
		&& ($oldExpired['body']['modules'] ?? null) === array()
		&& $oldUnknown['body'] === $newUnknown['body']
		&& $oldUnknown['status'] === 404
		&& ($oldUnknown['body']['status'] ?? '') === 'invalid';
}

function aliasRate(Keys $secret): bool
{
	$pdo = memoryPdo();
	$router = new Router(validator($pdo, $secret, null, 2));
	$key = bin2hex(random_bytes(20));
	seed($pdo, $secret, $key, array('domain' => 'site.com'), array('qr-masa'));
	$body = (string) json_encode(array('api_key' => $key, 'domain' => 'site.com'));
	$ip = '198.51.100.77';
	$first = $router->dispatch('POST', '/v1/validate', $body, $ip);
	$second = $router->dispatch('POST', '/wp-json/qmls/v1/validate', $body, $ip);
	$third = $router->dispatch('POST', '/wp-json/qmls/v1/validate', $body, $ip);
	$fourth = $router->dispatch('POST', '/v1/validate', $body, $ip);

	return $first['status'] === 200
		&& ($first['body']['status'] ?? '') === 'active'
		&& $second['status'] === 200
		&& ($second['body']['status'] ?? '') === 'active'
		&& $third['status'] === 429
		&& ($third['body']['status'] ?? '') === 'rate_limited'
		&& isset($third['headers']['Retry-After'])
		&& $fourth['status'] === 429
		&& ($fourth['body']['status'] ?? '') === 'rate_limited';
}

function concurrentLock(): bool
{
	$path = tempnam(sys_get_temp_dir(), 'qrlock');
	if ($path === false) {
		return false;
	}
	unlink($path);
	$pdo = new PDO('sqlite:' . $path);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->exec('PRAGMA journal_mode = WAL');
	$pdo->exec('PRAGMA busy_timeout = 5000');
	$pdo->exec(
		'CREATE TABLE licenses (
			id INTEGER PRIMARY KEY,
			domain TEXT NULL,
			archived_at TEXT NULL,
			updated_at TEXT NULL
		)'
	);
	$pdo->exec("INSERT INTO licenses (id, domain, archived_at, updated_at) VALUES (1, NULL, NULL, '2026-10-22 12:00:00')");
	$pdo = null;

	$children = array();
	foreach (array('bir.com', 'iki.com') as $domain) {
		$command = array(PHP_BINARY, __FILE__, 'lock-child', $path, $domain, '1');
		$spec = array(0 => array('pipe', 'r'), 1 => array('pipe', 'w'), 2 => array('pipe', 'w'));
		$proc = proc_open($command, $spec, $pipes);
		if (!is_resource($proc)) {
			return false;
		}
		fclose($pipes[0]);
		$children[] = array($proc, $pipes[1], $pipes[2]);
	}

	$codes = array();
	foreach ($children as $child) {
		stream_get_contents($child[1]);
		stream_get_contents($child[2]);
		fclose($child[1]);
		fclose($child[2]);
		$codes[] = proc_close($child[0]);
	}

	$reader = new PDO('sqlite:' . $path);
	$reader->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$final = $reader->query('SELECT domain FROM licenses WHERE id = 1')->fetchColumn();
	unlink($path);
	sort($codes);

	return $codes === array(0, 2) && ($final === 'bir.com' || $final === 'iki.com');
}

function lockChild(string $path, string $domain, int $id): int
{
	$pdo = new PDO('sqlite:' . $path);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->exec('PRAGMA busy_timeout = 5000');
	$statement = $pdo->prepare(
		'UPDATE licenses
		 SET domain = :domain, updated_at = :updated
		 WHERE id = :id AND archived_at IS NULL AND (domain IS NULL OR domain = \'\')'
	);
	$statement->execute(array(
		'domain' => $domain,
		'updated' => '2026-10-22 12:00:00',
		'id' => $id,
	));

	return $statement->rowCount() === 1 ? 0 : 2;
}
