<?php
/**
 * API giriş noktası. Yapılandırma bu dizinin bir üstündedir.
 * Hata gövdesinde SQL, dosya yolu, parola veya yığın izi yoktur.
 */
declare(strict_types=1);

use QRLicense\Admin\Auth;
use QRLicense\Http\RequestContext;
use QRLicense\Http\Router;
use QRLicense\License\Keys;
use QRLicense\License\LicenseAdmin;
use QRLicense\License\Validator;
use QRLicense\Store\Database;

require_once dirname(__DIR__) . '/src/Store/Database.php';
require_once dirname(__DIR__) . '/src/License/Keys.php';
require_once dirname(__DIR__) . '/src/License/Validator.php';
require_once dirname(__DIR__) . '/src/License/LicenseAdmin.php';
require_once dirname(__DIR__) . '/src/Admin/Auth.php';
require_once dirname(__DIR__) . '/src/Http/RequestContext.php';
require_once dirname(__DIR__) . '/src/Http/Router.php';

ini_set('display_errors', '0');

$configPath = getenv('QR_LICENSE_CONFIG');
if (!is_string($configPath) || $configPath === '') {
	$configPath = dirname(__DIR__) . '/config.php';
}

try {
	if (!is_file($configPath)) {
		throw new RuntimeException('Yapılandırma yok.');
	}
	$config = require $configPath;
	if (!is_array($config)) {
		throw new RuntimeException('Yapılandırma geçersiz.');
	}

	$pepper = isset($config['key_pepper']) ? (string) $config['key_pepper'] : '';
	$encryptionKey = isset($config['encryption_key']) ? (string) $config['encryption_key'] : '';
	$pdo = Database::connect($config);
	$keys = new Keys($pepper, $encryptionKey);
	$router = new Router(
		new Validator($pdo, $keys),
		new Auth(
			$pdo,
			!array_key_exists('require_https', $config) || $config['require_https'] !== false,
			isset($config['session_ttl']) ? (int) $config['session_ttl'] : 43200,
			isset($config['session_cookie']) ? (string) $config['session_cookie'] : 'qrl_session'
		),
		new LicenseAdmin($pdo, $keys)
	);

	$method = isset($_SERVER['REQUEST_METHOD']) ? (string) $_SERVER['REQUEST_METHOD'] : 'GET';
	$uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '/';
	$ip = RequestContext::clientIp($_SERVER);
	$https = RequestContext::isHttps($_SERVER, trustedProxies($config));
	$cookie = isset($_SERVER['HTTP_COOKIE']) ? (string) $_SERVER['HTTP_COOKIE'] : '';
	$csrf = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? (string) $_SERVER['HTTP_X_CSRF_TOKEN'] : '';
	$raw = file_get_contents('php://input');
	if ($raw === false) {
		$raw = '';
	}
	$contentType = isset($_SERVER['CONTENT_TYPE']) ? (string) $_SERVER['CONTENT_TYPE'] : '';

	$result = $router->dispatch($method, $uri, $raw, $ip, $https, $cookie, $csrf, $contentType);
	emit($result['status'], $result['body'], $result['headers']);
} catch (Throwable $e) {
	error_log('qr-license ' . $e::class);
	emit(500, array('status' => 'error', 'error' => 'server_error'), array());
}

/**
 * @param array<string, mixed> $config
 * @return array<int, string>
 */
function trustedProxies(array $config): array
{
	if (!isset($config['trusted_proxies']) || !is_array($config['trusted_proxies'])) {
		return array();
	}
	$list = array();
	foreach ($config['trusted_proxies'] as $proxy) {
		if (is_string($proxy) && $proxy !== '') {
			$list[] = $proxy;
		}
	}

	return $list;
}

/**
 * @param array<string, mixed> $body
 * @param array<string, string> $headers
 */
function emit(int $status, array $body, array $headers): void
{
	if (PHP_SAPI !== 'cli') {
		http_response_code($status);
		header('Content-Type: application/json; charset=utf-8');
		header('X-Content-Type-Options: nosniff');
		header('X-Frame-Options: DENY');
		header('Referrer-Policy: no-referrer');
		header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
		header('Cache-Control: no-store');
		foreach ($headers as $name => $value) {
			if (preg_match('/[\r\n]/', $name . $value) === 1) {
				continue;
			}
			header($name . ': ' . $value);
		}
	} else {
		fwrite(STDERR, 'HTTP ' . $status . "\n");
		foreach ($headers as $name => $value) {
			if (strcasecmp($name, 'Set-Cookie') === 0) {
				fwrite(STDERR, $name . ": (gizli)\n");
				continue;
			}
			fwrite(STDERR, $name . ': ' . $value . "\n");
		}
	}

	echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
