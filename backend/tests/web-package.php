<?php
/**
 * Web paketinin yanlış belge kökünde hassas dosya sunmadığını ölçer.
 * Geçici dizin ve 127.0.0.1 kullanır. Üretim hedefine bağlanmaz.
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/bin/release-preflight.php';

$failures = 0;
$checks = 0;
$servers = array();
$temps = array();

function check(string $name, bool $ok): void
{
	global $failures, $checks;
	$checks++;
	fwrite(STDOUT, ($ok ? 'ok  ' : 'FAIL ') . $name . "\n");
	if (!$ok) {
		$failures++;
	}
}

function relativeFiles(string $root): array
{
	$files = array();
	if (!is_dir($root)) {
		return $files;
	}
	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)
	);
	foreach ($iterator as $file) {
		if (!$file->isFile()) {
			continue;
		}
		$path = substr($file->getPathname(), strlen($root) + 1);
		$files[] = str_replace('\\', '/', $path);
	}
	sort($files);

	return $files;
}

function removeTree(string $root): void
{
	$temp = sys_get_temp_dir();
	$real = realpath($root);
	$realTemp = realpath($temp);
	if ($real === false || $realTemp === false || ($real !== $realTemp && !str_starts_with($real, $realTemp . DIRECTORY_SEPARATOR))) {
		return;
	}
	if (!is_dir($real)) {
		return;
	}
	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator($real, FilesystemIterator::SKIP_DOTS),
		RecursiveIteratorIterator::CHILD_FIRST
	);
	foreach ($iterator as $file) {
		if ($file->isDir()) {
			rmdir($file->getPathname());
		} else {
			unlink($file->getPathname());
		}
	}
	rmdir($real);
}

function freePort(): int
{
	$socket = stream_socket_server('tcp://127.0.0.1:0', $errno, $error);
	if (!is_resource($socket)) {
		throw new RuntimeException('port');
	}
	$name = (string) stream_socket_get_name($socket, false);
	fclose($socket);
	$parts = explode(':', $name);

	return (int) $parts[count($parts) - 1];
}

/**
 * @return resource
 */
function startServer(string $docroot, int $port, string $log)
{
	$path = getenv('PATH');
	$proc = proc_open(
		array(PHP_BINARY, '-S', '127.0.0.1:' . $port, '-t', $docroot),
		array(
			0 => array('file', '/dev/null', 'r'),
			1 => array('file', $log, 'a'),
			2 => array('file', $log, 'a'),
		),
		$pipes,
		$docroot,
		array(
			'PATH' => is_string($path) && $path !== '' ? $path : '/usr/bin',
			'HOME' => sys_get_temp_dir(),
			'LANG' => 'C',
		)
	);
	if (!is_resource($proc)) {
		throw new RuntimeException('sunucu');
	}
	$ready = false;
	for ($i = 0; $i < 50; $i++) {
		$client = @fsockopen('127.0.0.1', $port, $errno, $error, 0.2);
		if (is_resource($client)) {
			fclose($client);
			$ready = true;
			break;
		}
		usleep(100000);
	}
	if (!$ready) {
		proc_terminate($proc);
		proc_close($proc);
		throw new RuntimeException('sunucu');
	}

	return $proc;
}

function stopServer($proc): void
{
	if (is_resource($proc)) {
		proc_terminate($proc);
		proc_close($proc);
	}
}

/**
 * @return array{code:string,body:string}
 */
function http(int $port, string $path): array
{
	$header = tempnam(sys_get_temp_dir(), 'qrlh');
	$body = tempnam(sys_get_temp_dir(), 'qrlb');
	if ($header === false || $body === false) {
		return array('code' => '0', 'body' => '');
	}
	$proc = proc_open(
		array(
			'curl', '-sS', '--max-time', '5',
			'-D', $header,
			'-o', $body,
			'-w', '%{http_code}',
			'http://127.0.0.1:' . $port . $path,
		),
		array(1 => array('pipe', 'w'), 2 => array('pipe', 'w')),
		$pipes
	);
	$code = '';
	if (is_resource($proc)) {
		$code = trim((string) stream_get_contents($pipes[1]));
		fclose($pipes[1]);
		stream_get_contents($pipes[2]);
		fclose($pipes[2]);
		proc_close($proc);
	}
	$text = (string) file_get_contents($body);
	unlink($header);
	unlink($body);

	return array('code' => $code, 'body' => $text);
}

register_shutdown_function(static function () use (&$servers, &$temps): void {
	foreach ($servers as $proc) {
		stopServer($proc);
	}
	foreach ($temps as $dir) {
		removeTree($dir);
	}
});

$root = preflightRepoRoot();
$base = sys_get_temp_dir() . '/qrl-web-package-' . bin2hex(random_bytes(4));
$web = $base . '/web';
$offline = $base . '/offline';
$temps[] = $base;
mkdir($base, 0700);
mkdir($web, 0700);
mkdir($offline, 0700);

check('web agaci kopyalanir', preflightCopyTree($root, $web, PREFLIGHT_WEB));
check('cevrimdisi agac kopyalanir', preflightCopyTree($root, $offline, PREFLIGHT_OFFLINE));
$webFiles = relativeFiles($web);
$offlineFiles = relativeFiles($offline);
$expectedWeb = PREFLIGHT_WEB;
$expectedOffline = PREFLIGHT_OFFLINE;
sort($expectedWeb);
sort($expectedOffline);
check('web paketi 12 dosya', $webFiles === $expectedWeb);
check('cevrimdisi paket 4 dosya', $offlineFiles === $expectedOffline);
check('web paketinde hassas yol yok', array_intersect($webFiles, PREFLIGHT_OFFLINE) === array());

$sensitiveByRoot = array(
	'paket' => array(
		$web,
		array(
			'/backend/migrations/001_schema.sql',
			'/backend/migrations/002_license_tier.sql',
			'/backend/config.example.php',
			'/backend/bin/create-admin.php',
		),
	),
	'backend' => array(
		$web . '/backend',
		array(
			'/migrations/001_schema.sql',
			'/migrations/002_license_tier.sql',
			'/config.example.php',
			'/bin/create-admin.php',
		),
	),
	'public' => array(
		$web . '/backend/public',
		array(
			'/migrations/001_schema.sql',
			'/config.example.php',
			'/bin/create-admin.php',
		),
	),
);

$port = freePort();
$log = $base . '/server.log';
foreach ($sensitiveByRoot as $label => $spec) {
	$proc = startServer($spec[0], $port, $log);
	$servers[] = $proc;
	foreach ($spec[1] as $path) {
		$result = http($port, $path);
		$leaks = str_contains($result['body'], 'CREATE TABLE') || str_contains($result['body'], 'key_pepper');
		check($label . ' ' . $path . ' http=' . $result['code'], $result['code'] !== '200' && $result['code'] !== '' && !$leaks);
	}
	stopServer($proc);
	array_pop($servers);
	usleep(100000);
}

$proc = startServer($web, $port, $log);
$servers[] = $proc;
$panel = http($port, '/lisans/index.html');
$logo = http($port, '/assets/brand/qr-menu-official-logo-compact.svg');
$api = http($port, '/backend/public/index.php');
check('panel yolu duruyor', $panel['code'] === '200' && str_contains($panel['body'], 'Lisans yönetimi') && str_contains($panel['body'], 'href="lisans.css"') && str_contains($panel['body'], 'src="lisans.js"'));
check('logo yolu duruyor', $logo['code'] === '200' && str_contains($logo['body'], '<svg'));
check(
	'api girisi server_error',
	$api['code'] === '500'
		&& str_contains($api['body'], '"error":"server_error"')
		&& !str_contains($api['body'], 'CREATE TABLE')
		&& !str_contains($api['body'], '/tmp/')
		&& !str_contains($api['body'], 'key_pepper')
);
stopServer($proc);
array_pop($servers);

$proc = startServer($web . '/backend', $port, $log);
$servers[] = $proc;
$backendApi = http($port, '/public/index.php');
check('backend kokunde api girisi', $backendApi['code'] === '500' && str_contains($backendApi['body'], '"error":"server_error"'));
stopServer($proc);
array_pop($servers);

$proc = startServer($web . '/backend/public', $port, $log);
$servers[] = $proc;
$publicApi = http($port, '/index.php');
$publicRoot = http($port, '/');
check('public kokunde api girisi', $publicApi['code'] === '500' && str_contains($publicApi['body'], '"error":"server_error"') && $publicRoot['code'] === '500');
stopServer($proc);
array_pop($servers);

$proc = startServer($offline, $port, $log);
$servers[] = $proc;
$offlineSql = http($port, '/backend/migrations/001_schema.sql');
$offlineExample = http($port, '/backend/config.example.php');
$offlineAdmin = http($port, '/backend/bin/create-admin.php');
check('cevrimdisi sql belge kokune konursa http=' . $offlineSql['code'], $offlineSql['code'] === '200' && str_contains($offlineSql['body'], 'CREATE TABLE'));
check('cevrimdisi ornek dogrudan http=' . $offlineExample['code'], $offlineExample['code'] === '404' && !str_contains($offlineExample['body'], 'key_pepper'));
check('cevrimdisi yonetici dogrudan http=' . $offlineAdmin['code'], $offlineAdmin['code'] === '404' && !str_contains($offlineAdmin['body'], 'password'));
stopServer($proc);
array_pop($servers);

fwrite(STDOUT, "\n{$checks} kontrol, {$failures} hata\n");
exit($failures === 0 ? 0 : 1);
