<?php
/**
 * Yönetici kimlik doğrulama testleri. SQLite kullanır.
 * MySQL veya cPanel üzerinde çalıştırılmaz.
 */
declare(strict_types=1);

use QRLicense\Admin\Auth;
use QRLicense\Http\RequestContext;
use QRLicense\Http\Router;
use QRLicense\License\Keys;
use QRLicense\License\Validator;

require_once dirname(__DIR__) . '/src/Store/Database.php';
require_once dirname(__DIR__) . '/src/License/Keys.php';
require_once dirname(__DIR__) . '/src/License/Validator.php';
require_once dirname(__DIR__) . '/src/Admin/Auth.php';
require_once dirname(__DIR__) . '/src/Http/RequestContext.php';
require_once dirname(__DIR__) . '/src/Http/Router.php';

$failures = 0;
$checks = 0;
$logFile = sys_get_temp_dir() . '/qrl-auth-log-' . bin2hex(random_bytes(4)) . '.log';
ini_set('log_errors', '1');
ini_set('error_log', $logFile);

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

function memoryPdo(): PDO
{
	$pdo = new PDO('sqlite::memory:');
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
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
			expires_at TEXT NOT NULL,
			FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
		)'
	);
	$pdo->exec(
		'CREATE TABLE rate_buckets (
			bucket TEXT PRIMARY KEY,
			hits INTEGER NOT NULL,
			reset_at TEXT NOT NULL
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
			last_seen_at TEXT NULL,
			client_version TEXT NOT NULL DEFAULT \'\',
			archived_at TEXT NULL,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		)'
	);
	return $pdo;
}

function routerFor(PDO $pdo, Auth $auth): Router
{
	return new Router(new Validator($pdo, new Keys(str_repeat('p', 32), str_repeat('ab', 32))), $auth);
}

/**
 * @param array{status:int,body:array<string,mixed>,headers:array<string,string>} $result
 */
function sessionToken(array $result): string
{
	$header = $result['headers']['Set-Cookie'] ?? '';
	if (!preg_match('/(?:^|; )(?:__Host-)?qrl_session=([a-f0-9]{64})/', $header, $match)) {
		return '';
	}

	return $match[1];
}

function bodyJson(array $body): string
{
	$json = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

	return is_string($json) ? $json : '';
}

/**
 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
 */
function postLogin(Router $router, string $username, string $password, string $ip, bool $https = true, string $cookie = ''): array
{
	$payload = json_encode(array('username' => $username, 'password' => $password));

	return $router->dispatch(
		'POST',
		'/api/admin/login',
		is_string($payload) ? $payload : '',
		$ip,
		$https,
		$cookie,
		''
	);
}

$pdo = memoryPdo();
$clock = utc('2026-10-22 12:00:00');
$auth = new Auth(
	$pdo,
	true,
	3600,
	'qrl_session',
	static function () use (&$clock): DateTimeImmutable {
		return $clock;
	},
	5,
	30,
	60
);
$router = routerFor($pdo, $auth);
$password = 'Pw-' . bin2hex(random_bytes(8));
$auth->createAdmin('ada', $password);

$stored = $pdo->query('SELECT password_hash FROM admins WHERE username = \'ada\'')->fetch();
check('parola düz metin değil', is_array($stored) && password_verify($password, (string) $stored['password_hash']) && !hash_equals($password, (string) $stored['password_hash']));

$okLogin = postLogin($router, 'ada', $password, '203.0.113.10');
$firstToken = sessionToken($okLogin);
$firstCsrf = isset($okLogin['body']['csrf_token']) ? (string) $okLogin['body']['csrf_token'] : '';
$token = $firstToken;
$csrf = $firstCsrf;
$cookieHeader = 'theme=dark; __Host-qrl_session=' . $token;
check('doğru parola', $okLogin['status'] === 200 && ($okLogin['body']['status'] ?? '') === 'ok' && ($okLogin['body']['username'] ?? '') === 'ada' && $token !== '' && strlen($csrf) === 64);
$cookie = $okLogin['headers']['Set-Cookie'] ?? '';
check(
	'çerez bayrakları',
	str_contains($cookie, '__Host-qrl_session=') && !str_contains($cookie, 'Domain=') && str_contains($cookie, 'HttpOnly') && str_contains($cookie, 'Secure') && str_contains($cookie, 'SameSite=Lax') && str_contains($cookie, 'Max-Age=3600')
);
$hashRow = $pdo->prepare('SELECT token_hash, csrf_secret FROM admin_sessions WHERE token_hash = :hash');
$hashRow->execute(array('hash' => hash('sha256', $token)));
$storedSession = $hashRow->fetch();
check('belirteç yalnız özet', is_array($storedSession) && (string) $storedSession['token_hash'] === hash('sha256', $token) && (string) $storedSession['csrf_secret'] === $csrf);

$wrong = postLogin($router, 'ada', $password . '-no', '203.0.113.11');
$missing = postLogin($router, 'nobody-zz', $password . '-no', '203.0.113.12');
$expectedFail = array('status' => 'error', 'error' => 'invalid_credentials');
check(
	'yanlış ve var olmayan kullanıcı aynı hata',
	$wrong['status'] === 401 && $missing['status'] === 401 && $wrong['body'] === $expectedFail && $missing['body'] === $expectedFail && $wrong['headers'] === $missing['headers']
);
check('yanlış parolada çerez yok', !isset($wrong['headers']['Set-Cookie']) && !isset($missing['headers']['Set-Cookie']));

$still = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.13', true, $cookieHeader, '');
check('yanlış giriş eski oturumu bozmaz', ($still['body']['authenticated'] ?? null) === true);
$legacyOnly = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.73', true, 'qrl_session=' . $firstToken, '');
$tossed = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.74', true, 'qrl_session=' . $firstToken . '; __Host-qrl_session=' . str_repeat('cd', 32), '');
$hostCookie = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.75', true, 'theme=dark; __Host-qrl_session=' . $firstToken, '');
check('düz çerez güvenli oturumu açmaz', ($legacyOnly['body']['authenticated'] ?? null) === false);
check('düz çerez host çerezini ezmez', ($tossed['body']['authenticated'] ?? null) === false);
check('host çerezi oturumu açar', ($hostCookie['body']['authenticated'] ?? null) === true && ($hostCookie['body']['username'] ?? '') === 'ada');

$anon = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.14', true, '', '');
check('oturumsuz erişim', $anon['status'] === 200 && $anon['body'] === array('authenticated' => false));
$authed = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.15', true, $cookieHeader, '');
check(
	'geçerli oturum',
	$authed['status'] === 200
		&& ($authed['body']['authenticated'] ?? null) === true
		&& ($authed['body']['username'] ?? '') === 'ada'
		&& ($authed['body']['csrf_token'] ?? '') === $csrf
		&& !array_key_exists('password_hash', $authed['body'])
		&& !array_key_exists('token', $authed['body'])
);

$clock = utc('2026-10-22 13:00:01');
$expired = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.16', true, $cookieHeader, '');
$left = $pdo->query('SELECT COUNT(*) AS n FROM admin_sessions')->fetch();
check('süresi dolan oturum', ($expired['body']['authenticated'] ?? null) === false && is_array($left) && (int) $left['n'] === 0);
$expiredLogout = $router->dispatch('POST', '/api/admin/logout', '', '203.0.113.17', true, $cookieHeader, $csrf);
check('süresi dolan çıkış', $expiredLogout['status'] === 401 && ($expiredLogout['body']['error'] ?? '') === 'unauthenticated');

$clock = utc('2026-10-22 14:00:00');
$again = postLogin($router, 'ada', $password, '203.0.113.18');
$token = sessionToken($again);
$csrf = (string) $again['body']['csrf_token'];
$cookieHeader = '__Host-qrl_session=' . $token;
$planted = bin2hex(random_bytes(32));
$rotated = postLogin($router, 'ada', $password, '203.0.113.19', true, '__Host-qrl_session=' . $planted);
$newToken = sessionToken($rotated);
$newCsrf = (string) $rotated['body']['csrf_token'];
$oldSession = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.20', true, $cookieHeader, '');
$newSession = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.21', true, '__Host-qrl_session=' . $newToken, '');
$plantedSession = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.22', true, '__Host-qrl_session=' . $planted, '');
check(
	'oturum belirteci yenilenir',
	$newToken !== '' && $newToken !== $token && $newToken !== $planted
		&& ($oldSession['body']['authenticated'] ?? null) === false
		&& ($plantedSession['body']['authenticated'] ?? null) === false
		&& ($newSession['body']['authenticated'] ?? null) === true
		&& $newCsrf !== $csrf
);

$noCsrf = $router->dispatch('POST', '/api/admin/logout', '', '203.0.113.23', true, '__Host-qrl_session=' . $newToken, '');
$badCsrf = $router->dispatch('POST', '/api/admin/logout', '', '203.0.113.24', true, '__Host-qrl_session=' . $newToken, 'not-the-token');
$afterReject = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.25', true, '__Host-qrl_session=' . $newToken, '');
check(
	'CSRF olmadan çıkış reddedilir',
	$noCsrf['status'] === 403 && ($noCsrf['body']['error'] ?? '') === 'invalid_csrf'
		&& $badCsrf['status'] === 403
		&& ($afterReject['body']['authenticated'] ?? null) === true
);
$layer = $auth->authorize('__Host-qrl_session=' . $newToken, '', 'GET', '203.0.113.26');
$layerDeny = $auth->authorize('', $newCsrf, 'POST', '203.0.113.27');
check('yetki katmanı', ($layer['ok'] ?? false) === true && ($layer['username'] ?? '') === 'ada' && ($layerDeny['ok'] ?? true) === false && ($layerDeny['error'] ?? '') === 'unauthenticated');

$logout = $router->dispatch('POST', '/api/admin/logout', '', '203.0.113.28', true, '__Host-qrl_session=' . $newToken, $newCsrf);
$afterLogout = $router->dispatch('GET', '/api/admin/session', '', '203.0.113.29', true, '__Host-qrl_session=' . $newToken, '');
$clear = $logout['headers']['Set-Cookie'] ?? '';
check(
	'çıkış oturumu geçersiz kılar',
	$logout['status'] === 200 && str_contains($clear, '__Host-qrl_session=') && str_contains($clear, 'Max-Age=0') && str_contains($clear, 'HttpOnly') && str_contains($clear, 'Secure')
		&& ($afterLogout['body']['authenticated'] ?? null) === false
);

$limitClock = utc('2026-10-22 15:00:00');
$limitAuth = new Auth(
	$pdo,
	true,
	3600,
	'qrl_session',
	static function () use (&$limitClock): DateTimeImmutable {
		return $limitClock;
	},
	3,
	2,
	60
);
$limitRouter = routerFor($pdo, $limitAuth);
$first = postLogin($limitRouter, 'ada', 'wrong-password-1', '203.0.113.40');
$second = postLogin($limitRouter, 'nobody-zz', 'wrong-password-1', '203.0.113.40');
$third = postLogin($limitRouter, 'ada', 'wrong-password-2', '203.0.113.40');
$blocked = postLogin($limitRouter, 'ada', $password, '203.0.113.40');
check(
	'giriş hız sınırı',
	$first['status'] === 401 && $second['status'] === 401 && $third['status'] === 401
		&& $blocked['status'] === 429 && ($blocked['body']['error'] ?? '') === 'rate_limited'
		&& isset($blocked['headers']['Retry-After']) && !isset($blocked['headers']['Set-Cookie'])
);
$limitClock = utc('2026-10-22 15:01:01');
$afterWindow = postLogin($limitRouter, 'ada', $password, '203.0.113.40');
check('pencere dolunca giriş', $afterWindow['status'] === 200 && sessionToken($afterWindow) !== '');
$sessionHits = 0;
$sessionBlocked = false;
for ($i = 0; $i < 4; $i++) {
	$probe = $limitRouter->dispatch('GET', '/api/admin/session', '', '203.0.113.41', true, '', '');
	if ($probe['status'] === 429) {
		$sessionBlocked = true;
		break;
	}
	if ($probe['status'] === 200) {
		$sessionHits++;
	}
}
check('oturum hız sınırı', $sessionHits === 2 && $sessionBlocked);

$httpsDenied = postLogin($router, 'ada', $password, '203.0.113.50', false);
check('HTTPS zorunlu', $httpsDenied['status'] === 403 && ($httpsDenied['body']['error'] ?? '') === 'https_required' && !isset($httpsDenied['headers']['Set-Cookie']));
$localAuth = new Auth($pdo, false, 3600, 'qrl_session', null, 5, 30, 60);
$local = postLogin(routerFor($pdo, $localAuth), 'ada', $password, '203.0.113.51', false);
$localCookie = $local['headers']['Set-Cookie'] ?? '';
check('yerel çerez HttpOnly', $local['status'] === 200 && str_contains($localCookie, 'HttpOnly') && str_contains($localCookie, 'SameSite=Lax') && !str_contains($localCookie, 'Secure') && !str_contains($localCookie, '__Host-'));
$plainLogin = $router->dispatch('POST', '/api/admin/login', bodyJson(array('username' => 'ada', 'password' => $password)), '203.0.113.76', true, '', '', 'text/plain');
check('JSON olmayan giriş reddedilir', $plainLogin['status'] === 415 && ($plainLogin['body']['error'] ?? '') === 'unsupported_media_type' && !isset($plainLogin['headers']['Set-Cookie']) && !str_contains((string) json_encode($plainLogin['body']), $password));

check('doğrudan HTTPS', RequestContext::isHttps(array('HTTPS' => 'on', 'REMOTE_ADDR' => '203.0.113.60'), array()) === true);
check(
	'güvenilmeyen vekil yok sayılır',
	RequestContext::isHttps(array(
		'REMOTE_ADDR' => '203.0.113.60',
		'HTTP_X_FORWARDED_PROTO' => 'https',
		'HTTP_X_FORWARDED_FOR' => '198.51.100.8',
	), array()) === false
);
check(
	'güvenilen vekil',
	RequestContext::isHttps(array(
		'REMOTE_ADDR' => '10.0.0.5',
		'HTTP_X_FORWARDED_PROTO' => 'https, http',
	), array('10.0.0.5')) === true
);
check(
	'adres başlığı kullanılmaz',
	RequestContext::clientIp(array(
		'REMOTE_ADDR' => '203.0.113.60',
		'HTTP_X_FORWARDED_FOR' => '198.51.100.8',
	)) === '203.0.113.60'
);

$closed = new Router(new Validator($pdo, new Keys(str_repeat('p', 32), str_repeat('ab', 32))));
$closedAdmin = $closed->dispatch('POST', '/api/admin/login', '{}', '203.0.113.70');
$validate = $router->dispatch('POST', '/v1/validate', '{', '203.0.113.71');
$legacy = $router->dispatch('POST', '/wp-json/qrmenu/v1/validate', '{}', '203.0.113.72');
check('yetkisiz kurulumda yönetim kapalı', $closedAdmin['status'] === 404);
check('doğrulama yolu duruyor', $validate['status'] === 400 && ($validate['body']['error'] ?? '') === 'invalid_json');
check('eski yol kapalı', $legacy['status'] === 404 && ($legacy['body']['status'] ?? '') === 'not_found');

$loginBlob = bodyJson($okLogin['body']);
$sessionBlob = bodyJson($authed['body']);
$errorBlob = bodyJson($wrong['body']) . bodyJson($missing['body']) . bodyJson($blocked['body']) . bodyJson($httpsDenied['body']);
$passwordHash = (string) $stored['password_hash'];
check(
	'giriş yanıtında belirteç yok',
	$firstToken !== ''
		&& !str_contains($loginBlob, $firstToken)
		&& !str_contains($loginBlob, $password)
		&& !str_contains($loginBlob, $passwordHash)
		&& str_contains($loginBlob, $firstCsrf)
);
check(
	'oturum yanıtında belirteç yok',
	!str_contains($sessionBlob, $firstToken)
		&& !str_contains($sessionBlob, $password)
		&& !str_contains($sessionBlob, $passwordHash)
		&& str_contains($sessionBlob, $firstCsrf)
);
check(
	'hata yanıtında parola yok',
	!str_contains($errorBlob, $password)
		&& !str_contains($errorBlob, 'nobody-zz')
		&& !str_contains($errorBlob, $passwordHash)
		&& !str_contains($errorBlob, $firstToken)
		&& !str_contains($errorBlob, $newToken)
);

$logText = is_file($logFile) ? (string) file_get_contents($logFile) : '';
$logClean = true;
foreach (array($password, $token, $newToken, (string) $stored['password_hash']) as $secret) {
	if ($secret !== '' && str_contains($logText, $secret)) {
		$logClean = false;
	}
}
check('logda gizli yok', $logClean);

$example = (string) file_get_contents(dirname(__DIR__) . '/config.example.php');
$creator = (string) file_get_contents(dirname(__DIR__) . '/bin/create-admin.php');
check('örnek yapılandırmada sır yok', str_contains($example, "'password' => ''") && str_contains($example, "'key_pepper'      => ''") && str_contains($example, "'encryption_key'  => ''") && !str_contains($example, $password));
check('oluşturucuda sabit parola yok', !str_contains($creator, $password) && !preg_match('/password_hash\\(\\s*[\'"]/', $creator));

$tempDb = sys_get_temp_dir() . '/qrl-admin-' . bin2hex(random_bytes(4)) . '.sqlite';
$tempConfig = sys_get_temp_dir() . '/qrl-admin-' . bin2hex(random_bytes(4)) . '.php';
file_put_contents($tempConfig, "<?php\nreturn array('db'=>array('dsn'=>'sqlite:{$tempDb}','user'=>'','password'=>''),'require_https'=>false);\n");
$setup = new PDO('sqlite:' . $tempDb);
$setup->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$setup->exec(
	'CREATE TABLE admins (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL
	)'
);
$cliPassword = 'Cli-' . bin2hex(random_bytes(8));
$cliUser = 'cliadmin';
$runCli = static function (array $args, string $stdin, string $configPath): array {
	$command = array_merge(array(PHP_BINARY, dirname(__DIR__) . '/bin/create-admin.php'), $args);
	$process = proc_open(
		$command,
		array(0 => array('pipe', 'r'), 1 => array('pipe', 'w'), 2 => array('pipe', 'w')),
		$pipes,
		null,
		array('QR_LICENSE_CONFIG' => $configPath)
	);
	if (!is_resource($process)) {
		return array('code' => 1, 'stdout' => '', 'stderr' => '');
	}
	fwrite($pipes[0], $stdin);
	fclose($pipes[0]);
	$stdout = stream_get_contents($pipes[1]);
	$stderr = stream_get_contents($pipes[2]);
	fclose($pipes[1]);
	fclose($pipes[2]);

	return array(
		'code' => proc_close($process),
		'stdout' => is_string($stdout) ? $stdout : '',
		'stderr' => is_string($stderr) ? $stderr : '',
	);
};
$created = $runCli(array($cliUser), $cliPassword . "\n", $tempConfig);
$cliRow = $setup->query("SELECT password_hash FROM admins WHERE username = 'cliadmin'")->fetch();
check(
	'komutla yönetici',
	$created['code'] === 0
		&& str_contains($created['stdout'], 'Yönetici oluşturuldu')
		&& !str_contains($created['stdout'] . $created['stderr'], $cliPassword)
		&& is_array($cliRow)
		&& password_verify($cliPassword, (string) $cliRow['password_hash'])
);
$duplicate = $runCli(array($cliUser), $cliPassword . "\n", $tempConfig);
check('ikinci oluşturma genel hata', $duplicate['code'] === 1 && str_contains($duplicate['stderr'], 'Yönetici oluşturulamadı') && !str_contains($duplicate['stdout'] . $duplicate['stderr'], $cliPassword));
$fromArg = $runCli(array('other', $cliPassword), '', $tempConfig);
$other = $setup->query("SELECT COUNT(*) AS n FROM admins WHERE username = 'other'")->fetch();
check('parola argüman olarak alınmaz', $fromArg['code'] === 1 && is_array($other) && (int) $other['n'] === 0 && !str_contains($fromArg['stdout'] . $fromArg['stderr'], $cliPassword));
$configText = (string) file_get_contents($tempConfig);
check('geçici ayarda parola yok', !str_contains($configText, $cliPassword) && !str_contains($configText, $password));

$repoHit = false;
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(dirname(__DIR__), FilesystemIterator::SKIP_DOTS));
foreach ($iterator as $file) {
	if (!$file->isFile()) {
		continue;
	}
	$contents = file_get_contents($file->getPathname());
	if (!is_string($contents)) {
		continue;
	}
	if (str_contains($contents, $password) || str_contains($contents, $cliPassword)) {
		$repoHit = true;
		break;
	}
}
check('parola depoda yok', $repoHit === false);

$httpPassword = 'Http-' . bin2hex(random_bytes(8));
$httpDb = sys_get_temp_dir() . '/qrl-http-' . bin2hex(random_bytes(4)) . '.sqlite';
$httpConfig = sys_get_temp_dir() . '/qrl-http-' . bin2hex(random_bytes(4)) . '.php';
$httpRouter = sys_get_temp_dir() . '/qrl-http-router-' . bin2hex(random_bytes(4)) . '.php';
$httpErr = sys_get_temp_dir() . '/qrl-http-err-' . bin2hex(random_bytes(4)) . '.log';
file_put_contents(
	$httpConfig,
	"<?php\nreturn array(\n"
	. "'db'=>array('dsn'=>'sqlite:{$httpDb}','user'=>'','password'=>''),\n"
	. "'key_pepper'=>'" . str_repeat('p', 32) . "',\n"
	. "'encryption_key'=>'" . str_repeat('ab', 32) . "',\n"
	. "'require_https'=>true,\n"
	. "'trusted_proxies'=>array(),\n"
	. ");\n"
);
file_put_contents($httpRouter, "<?php\nrequire " . var_export(dirname(__DIR__) . '/public/index.php', true) . ";\n");
$httpPdo = new PDO('sqlite:' . $httpDb);
$httpPdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$httpPdo->exec('CREATE TABLE admins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)');
$httpPdo->exec('CREATE TABLE admin_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER NOT NULL, token_hash TEXT NOT NULL UNIQUE, csrf_secret TEXT NOT NULL, expires_at TEXT NOT NULL)');
$httpPdo->exec('CREATE TABLE rate_buckets (bucket TEXT PRIMARY KEY, hits INTEGER NOT NULL, reset_at TEXT NOT NULL)');
$httpPdo->exec('CREATE TABLE licenses (id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT NOT NULL, api_key_hmac TEXT NOT NULL UNIQUE, domain TEXT NULL, status TEXT NOT NULL, starts_on TEXT NULL, expires_on TEXT NULL, amount_paid TEXT NOT NULL DEFAULT \'\', notes TEXT NULL, last_seen_at TEXT NULL, client_version TEXT NOT NULL DEFAULT \'\', archived_at TEXT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)');
(new Auth($httpPdo, true))->createAdmin('httpadmin', $httpPassword);
$httpPdo = null;

$httpPort = 8097;
$httpProc = proc_open(
	array(PHP_BINARY, '-S', '127.0.0.1:' . $httpPort, $httpRouter),
	array(1 => array('file', $httpErr, 'a'), 2 => array('file', $httpErr, 'a')),
	$httpPipes,
	null,
	array('QR_LICENSE_CONFIG' => $httpConfig)
);
$httpReady = false;
if (is_resource($httpProc)) {
	for ($i = 0; $i < 50; $i++) {
		$socket = @fsockopen('127.0.0.1', $httpPort, $errno, $errstr, 0.2);
		if (is_resource($socket)) {
			fclose($socket);
			$httpReady = true;
			break;
		}
		usleep(100000);
	}
}
$httpCall = static function (string $method, string $path, string $body, array $headers) use (&$httpPort): array {
	$headerFile = tempnam(sys_get_temp_dir(), 'qrlh');
	if ($headerFile === false) {
		return array('status' => 0, 'body' => '', 'headers' => '');
	}
	$command = array(
		'curl', '-sS', '-D', $headerFile, '-o', '-',
		'-X', $method,
		'http://127.0.0.1:' . $httpPort . $path,
	);
	foreach ($headers as $header) {
		$command[] = '-H';
		$command[] = $header;
	}
	if ($body !== '') {
		$command[] = '--data-binary';
		$command[] = $body;
	}
	$process = proc_open($command, array(1 => array('pipe', 'w'), 2 => array('pipe', 'w')), $pipes);
	$stdout = '';
	if (is_resource($process)) {
		$stdout = stream_get_contents($pipes[1]);
		fclose($pipes[1]);
		fclose($pipes[2]);
		proc_close($process);
	}
	$rawHeaders = (string) file_get_contents($headerFile);
	@unlink($headerFile);
	$status = 0;
	if (preg_match('/HTTP\\/\\d\\.\\d\\s+(\\d+)/', $rawHeaders, $match)) {
		$status = (int) $match[1];
	}

	return array(
		'status' => $status,
		'body' => is_string($stdout) ? $stdout : '',
		'headers' => $rawHeaders,
	);
};
$spoofed = array('status' => 0, 'body' => '', 'headers' => '');
$logged = array('status' => 0, 'body' => '', 'headers' => '');
$seen = array('status' => 0, 'body' => '', 'headers' => '');
$denied = array('status' => 0, 'body' => '', 'headers' => '');
$ended = array('status' => 0, 'body' => '', 'headers' => '');
$gone = array('status' => 0, 'body' => '', 'headers' => '');
if ($httpReady) {
	$payload = json_encode(array('username' => 'httpadmin', 'password' => $httpPassword));
	$spoofed = $httpCall('POST', '/api/admin/login', is_string($payload) ? $payload : '', array(
		'Content-Type: application/json',
		'X-Forwarded-Proto: https',
		'X-Forwarded-For: 198.51.100.20',
	));
	proc_terminate($httpProc);
	proc_close($httpProc);
	$httpProc = null;
	file_put_contents($httpConfig, str_replace("'require_https'=>true", "'require_https'=>false", (string) file_get_contents($httpConfig)));
	$httpPort = 8098;
	$httpProc = proc_open(
		array(PHP_BINARY, '-S', '127.0.0.1:' . $httpPort, $httpRouter),
		array(1 => array('file', $httpErr, 'a'), 2 => array('file', $httpErr, 'a')),
		$httpPipes,
		null,
		array('QR_LICENSE_CONFIG' => $httpConfig)
	);
	$restarted = false;
	if (is_resource($httpProc)) {
		for ($i = 0; $i < 50; $i++) {
			$socket = @fsockopen('127.0.0.1', $httpPort, $errno, $errstr, 0.2);
			if (is_resource($socket)) {
				fclose($socket);
				$restarted = true;
				break;
			}
			usleep(100000);
		}
	}
	if (!$restarted) {
		check('ön yüz sunucusu yeniden', false, 'ikinci sunucu açılmadı');
	}
	$logged = $httpCall('POST', '/api/admin/login', is_string($payload) ? $payload : '', array('Content-Type: application/json'));
	$sessionCookie = '';
	if (preg_match('/set-cookie:\\s*qrl_session=([a-f0-9]{64})/i', $logged['headers'], $match)) {
		$sessionCookie = $match[1];
	}
	$seen = $httpCall('GET', '/api/admin/session', '', array('Cookie: qrl_session=' . $sessionCookie));
	$denied = $httpCall('POST', '/api/admin/logout', '', array('Cookie: qrl_session=' . $sessionCookie));
	$csrfHeader = '';
	$seenBody = json_decode($seen['body'], true);
	if (is_array($seenBody) && isset($seenBody['csrf_token']) && is_string($seenBody['csrf_token'])) {
		$csrfHeader = $seenBody['csrf_token'];
	}
	$ended = $httpCall('POST', '/api/admin/logout', '', array(
		'Cookie: qrl_session=' . $sessionCookie,
		'X-CSRF-Token: ' . $csrfHeader,
	));
	$gone = $httpCall('GET', '/api/admin/session', '', array('Cookie: qrl_session=' . $sessionCookie));
	$serverLog = is_file($httpErr) ? (string) file_get_contents($httpErr) : '';
	check('ön yüz HTTPS başlığına güvenmez', $spoofed['status'] === 403 && str_contains($spoofed['body'], 'https_required') && !str_contains($spoofed['body'], $httpPassword));
	check(
		'ön yüz girişi',
		$logged['status'] === 200
			&& str_contains($logged['headers'], 'HttpOnly')
			&& str_contains($logged['headers'], 'SameSite=Lax')
			&& str_contains($logged['headers'], 'X-Content-Type-Options: nosniff')
			&& str_contains($logged['headers'], 'X-Frame-Options: DENY')
			&& str_contains($logged['headers'], 'Referrer-Policy: no-referrer')
			&& str_contains($logged['headers'], 'Cache-Control: no-store')
			&& !str_contains($logged['headers'], 'Secure')
			&& $sessionCookie !== ''
			&& !str_contains($logged['body'], $sessionCookie)
			&& !str_contains($logged['body'], $httpPassword)
	);
	check('ön yüz oturumu', $seen['status'] === 200 && str_contains($seen['body'], '"authenticated":true') && str_contains($seen['body'], 'httpadmin') && !str_contains($seen['body'], $sessionCookie));
	check('ön yüz CSRF', $denied['status'] === 403 && str_contains($denied['body'], 'invalid_csrf'));
	check('ön yüz çıkışı', $ended['status'] === 200 && $gone['status'] === 200 && str_contains($gone['body'], '"authenticated":false'));
	check('ön yüz logunda gizli yok', !str_contains($serverLog, $httpPassword) && ($sessionCookie === '' || !str_contains($serverLog, $sessionCookie)));
} else {
	check('ön yüz sunucusu', false, 'yerel sunucu açılmadı');
}
if (is_resource($httpProc)) {
	proc_terminate($httpProc);
	proc_close($httpProc);
}

$logText = is_file($logFile) ? (string) file_get_contents($logFile) : '';
$logClean = !str_contains($logText, $password) && !str_contains($logText, $cliPassword) && !str_contains($logText, $httpPassword);
check('logda parola yok', $logClean);
$repoHit = false;
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(dirname(__DIR__), FilesystemIterator::SKIP_DOTS));
foreach ($iterator as $file) {
	if (!$file->isFile()) {
		continue;
	}
	$contents = file_get_contents($file->getPathname());
	if (is_string($contents) && (str_contains($contents, $httpPassword) || str_contains($contents, $cliPassword) || str_contains($contents, $password))) {
		$repoHit = true;
		break;
	}
}
check('çalışma parolaları depoda yok', $repoHit === false);

@unlink($tempDb);
@unlink($tempConfig);
@unlink($logFile);
@unlink($httpDb);
@unlink($httpConfig);
@unlink($httpRouter);
@unlink($httpErr);

fwrite(STDOUT, "\n{$checks} kontrol, {$failures} hata\n");
exit($failures === 0 ? 0 : 1);
