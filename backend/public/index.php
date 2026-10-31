<?php
/**
 * Tek giriş noktası (api/index.php buraya yönlendirir).
 * Yollar: /api/collect, /blog…, /sitemap-blog.xml, /api/admin/*, /v1/validate, /wp-json/qmls/v1/validate
 * Hata gövdesinde SQL, dosya yolu, parola veya yığın izi yoktur.
 */
declare(strict_types=1);

use QRLicense\Admin\Auth;
use QRLicense\Http\RequestContext;
use QRLicense\Http\Router;
use QRLicense\License\Keys;
use QRLicense\License\LicenseAdmin;
use QRLicense\License\Validator;
use QRLicense\Site\Analytics;
use QRLicense\Site\Blog;
use QRLicense\Site\Collector;
use QRLicense\Site\SiteRouter;
use QRLicense\Store\Database;

$backend = dirname(__DIR__);
spl_autoload_register(static function (string $class) use ($backend): void {
	if (!str_starts_with($class, 'QRLicense\\')) {
		return;
	}
	$file = $backend . '/src/' . str_replace('\\', '/', substr($class, 10)) . '.php';
	if (is_file($file)) {
		require $file;
	}
});

ini_set('display_errors', '0');

$configPath = getenv('QR_LICENSE_CONFIG');
if (!is_string($configPath) || $configPath === '') {
	$configPath = $backend . '/config.php';
}

try {
	if (!is_file($configPath)) {
		throw new RuntimeException('Yapılandırma yok.');
	}
	$config = require $configPath;
	if (!is_array($config)) {
		throw new RuntimeException('Yapılandırma geçersiz.');
	}

	$root = isset($config['site_root']) && is_string($config['site_root']) && $config['site_root'] !== '' ? $config['site_root'] : dirname($backend);
	$pepper = isset($config['key_pepper']) ? (string) $config['key_pepper'] : '';
	$encryptionKey = isset($config['encryption_key']) ? (string) $config['encryption_key'] : '';
	$pdo = Database::connect($config);
	$keys = new Keys($pepper, $encryptionKey);
	$auth = new Auth(
		$pdo,
		!array_key_exists('require_https', $config) || $config['require_https'] !== false,
		isset($config['session_ttl']) ? (int) $config['session_ttl'] : 43200,
		isset($config['session_cookie']) ? (string) $config['session_cookie'] : 'qrl_session'
	);
	$licenseRouter = new Router(new Validator($pdo, $keys), $auth, new LicenseAdmin($pdo, $keys));
	$hosts = isset($config['site_hosts']) && is_array($config['site_hosts']) ? array_values(array_filter($config['site_hosts'], 'is_string')) : array();
	$router = new SiteRouter(
		$auth,
		$licenseRouter,
		new Collector($pdo, $hosts),
		new Analytics($pdo, isset($config['tz_offset_hours']) ? (int) $config['tz_offset_hours'] : 3),
		new Blog($pdo, $root),
		$root
	);

	$method = isset($_SERVER['REQUEST_METHOD']) ? (string) $_SERVER['REQUEST_METHOD'] : 'GET';
	$uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '/';
	$trusted = array();
	if (isset($config['trusted_proxies']) && is_array($config['trusted_proxies'])) {
		foreach ($config['trusted_proxies'] as $proxy) {
			if (is_string($proxy) && $proxy !== '') {
				$trusted[] = $proxy;
			}
		}
	}
	$raw = file_get_contents('php://input');
	$result = $router->dispatch(
		$method,
		$uri,
		$raw === false ? '' : $raw,
		RequestContext::clientIp($_SERVER),
		RequestContext::isHttps($_SERVER, $trusted),
		isset($_SERVER['HTTP_COOKIE']) ? (string) $_SERVER['HTTP_COOKIE'] : '',
		isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? (string) $_SERVER['HTTP_X_CSRF_TOKEN'] : '',
		isset($_SERVER['CONTENT_TYPE']) ? (string) $_SERVER['CONTENT_TYPE'] : '',
		$_SERVER,
		$_FILES,
		$_POST
	);
	emit($result['status'], $result['body'], $result['headers'], $method);
} catch (Throwable $e) {
	error_log('qr-site ' . $e::class);
	emit(500, array('status' => 'error', 'error' => 'server_error'), array(), 'GET');
}

/**
 * @param string|array<string, mixed> $body
 * @param array<string, string> $headers
 */
function emit(int $status, $body, array $headers, string $method): void
{
	$isJson = is_array($body);
	if (PHP_SAPI !== 'cli') {
		http_response_code($status);
		header('X-Content-Type-Options: nosniff');
		if ($isJson) {
			header('Content-Type: application/json; charset=utf-8');
			header('X-Frame-Options: DENY');
			header('Referrer-Policy: no-referrer');
			header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
			header('Cache-Control: no-store');
		}
		foreach ($headers as $name => $value) {
			if (preg_match('/[\r\n]/', $name . $value) === 1) {
				continue;
			}
			header($name . ': ' . $value);
		}
	} else {
		fwrite(STDERR, 'HTTP ' . $status . "\n");
		foreach ($headers as $name => $value) {
			fwrite(STDERR, $name . ': ' . (strcasecmp($name, 'Set-Cookie') === 0 ? '(gizli)' : $value) . "\n");
		}
	}
	if (strtoupper($method) === 'HEAD' || $status === 204) {
		return;
	}
	echo $isJson ? json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : $body;
}
