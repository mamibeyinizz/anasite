<?php

declare(strict_types=1);

use QRLicense\Admin\Auth;
use QRLicense\Store\Database;

if (PHP_SAPI !== 'cli') {
	http_response_code(404);
	fwrite(STDERR, "Kurulum tamamlanamadı.\n");
	exit(1);
}

if ($argc !== 2) {
	fwrite(STDERR, "Kullanım: php backend/bin/install.php <kullanici>\nParola standart girdiden okunur.\n");
	exit(1);
}

$username = $argv[1];
$password = stream_get_contents(STDIN);
if (!is_string($password)) {
	fwrite(STDERR, "Kurulum tamamlanamadı.\n");
	exit(1);
}
$password = rtrim($password, "\r\n");

$root = dirname(__DIR__);
$configPath = getenv('QR_LICENSE_CONFIG');
if (!is_string($configPath) || $configPath === '') {
	$configPath = $root . '/config.php';
}

require_once $root . '/src/Store/Database.php';
require_once $root . '/src/Admin/Auth.php';

try {
	if (!is_file($configPath)) {
		throw new RuntimeException('missing');
	}
	$realConfig = realpath($configPath);
	if ($realConfig === false || str_contains($realConfig, '/public_html/')) {
		throw new RuntimeException('location');
	}
	$config = require $configPath;
	if (!is_array($config)) {
		throw new RuntimeException('invalid');
	}
	$db = $config['db'] ?? null;
	if (!is_array($db)) {
		throw new RuntimeException('invalid');
	}
	$parsed = parseMysqlDsn((string) ($db['dsn'] ?? ''));
	foreach (array('001_schema.sql', '002_license_tier.sql', '003_site.sql') as $migration) {
		applySql($parsed, (string) ($db['user'] ?? ''), (string) ($db['password'] ?? ''), $root . '/migrations/' . $migration);
	}

	$pdo = Database::connect($config);
	$exists = $pdo->prepare('SELECT 1 FROM admins WHERE username = :username LIMIT 1');
	$exists->execute(array('username' => $username));
	if ($exists->fetchColumn()) {
		fwrite(STDOUT, "Kurulum tamamlandı.\nYönetici zaten var. Parola değişmedi.\n");
		exit(0);
	}
	$requireHttps = !array_key_exists('require_https', $config) || $config['require_https'] !== false;
	$auth = new Auth($pdo, $requireHttps);
	$auth->createAdmin($username, $password);
} catch (Throwable $e) {
	error_log('qr-license-install ' . $e::class);
	fwrite(STDERR, "Kurulum tamamlanamadı.\n");
	exit(1);
}

fwrite(STDOUT, "Kurulum tamamlandı.\nYönetici oluşturuldu.\n");

/**
 * @return array{host:string,port:int,dbname:string,socket:string}
 */
function parseMysqlDsn(string $dsn): array
{
	if (!str_starts_with($dsn, 'mysql:')) {
		throw new RuntimeException('dsn');
	}
	$parts = array();
	foreach (explode(';', substr($dsn, 6)) as $piece) {
		if ($piece === '' || !str_contains($piece, '=')) {
			continue;
		}
		[$key, $value] = explode('=', $piece, 2);
		$parts[strtolower($key)] = $value;
	}
	if (!isset($parts['dbname']) || $parts['dbname'] === '') {
		throw new RuntimeException('dsn');
	}

	return array(
		'host' => $parts['host'] ?? 'localhost',
		'port' => isset($parts['port']) ? (int) $parts['port'] : 3306,
		'dbname' => $parts['dbname'],
		'socket' => $parts['unix_socket'] ?? '',
	);
}

/**
 * @param array{host:string,port:int,dbname:string,socket:string} $db
 */
function applySql(array $db, string $user, string $pass, string $file): void
{
	$sql = file_get_contents($file);
	if (!is_string($sql) || $sql === '') {
		throw new RuntimeException('sql');
	}
	$mysqli = mysqli_init();
	if ($mysqli === false) {
		throw new RuntimeException('sql');
	}
	$mysqli->options(MYSQLI_SET_CHARSET_NAME, 'utf8mb4');
	$connected = $mysqli->real_connect(
		$db['socket'] !== '' ? 'localhost' : $db['host'],
		$user,
		$pass,
		$db['dbname'],
		$db['port'],
		$db['socket'] !== '' ? $db['socket'] : null
	);
	if (!$connected) {
		throw new RuntimeException('sql');
	}
	$mysqli->set_charset('utf8mb4');
	if (!$mysqli->multi_query($sql)) {
		throw new RuntimeException('sql');
	}
	do {
		$result = $mysqli->store_result();
		if ($result instanceof mysqli_result) {
			$result->free();
		}
		if ($mysqli->errno !== 0) {
			throw new RuntimeException('sql');
		}
	} while ($mysqli->more_results() && $mysqli->next_result());
	if ($mysqli->errno !== 0) {
		throw new RuntimeException('sql');
	}
	$mysqli->close();
}
