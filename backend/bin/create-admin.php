<?php
/**
 * Tek seferlik yönetici oluşturur.
 * Parola komut satırından değil, standart girdiden okunur.
 * Kullanım: php bin/create-admin.php <kullanici>
 */
declare(strict_types=1);

use QRLicense\Admin\Auth;
use QRLicense\Store\Database;

if (PHP_SAPI !== 'cli') {
	http_response_code(404);
	fwrite(STDERR, "Yönetici oluşturulamadı.\n");
	exit(1);
}

require_once dirname(__DIR__) . '/src/Store/Database.php';
require_once dirname(__DIR__) . '/src/Admin/Auth.php';

if ($argc !== 2) {
	fwrite(STDERR, "Kullanım: php bin/create-admin.php <kullanici>\nParola standart girdiden okunur.\n");
	exit(1);
}

$username = $argv[1];
$password = stream_get_contents(STDIN);
if ($password === false) {
	fwrite(STDERR, "Yönetici oluşturulamadı.\n");
	exit(1);
}
$password = rtrim($password, "\r\n");

$configPath = getenv('QR_LICENSE_CONFIG');
if (!is_string($configPath) || $configPath === '') {
	$configPath = dirname(__DIR__) . '/config.php';
}

try {
	if (!is_file($configPath)) {
		throw new RuntimeException('missing');
	}
	$config = require $configPath;
	if (!is_array($config)) {
		throw new RuntimeException('invalid');
	}
	$requireHttps = !array_key_exists('require_https', $config) || $config['require_https'] !== false;
	$auth = new Auth(Database::connect($config), $requireHttps);
	$auth->createAdmin($username, $password);
} catch (Throwable $e) {
	error_log('qr-license-admin ' . $e::class);
	fwrite(STDERR, "Yönetici oluşturulamadı.\n");
	exit(1);
}

fwrite(STDOUT, "Yönetici oluşturuldu.\n");
