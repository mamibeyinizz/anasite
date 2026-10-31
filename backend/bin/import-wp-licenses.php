<?php
/**
 * Eski WordPress lisans sunucusundan (qr-menu-license-server eklentisi) alınan JSON'u içe aktarır.
 * Anahtarlar AYNEN korunur: müşteri sitelerindeki eklentiler değişiklik yapmadan çalışmaya devam eder.
 *
 *   php backend/bin/import-wp-licenses.php lisanslar.json --dry-run   (yalnızca sayar, yazmaz)
 *   php backend/bin/import-wp-licenses.php lisanslar.json             (yazar; yeniden çalıştırılabilir)
 *
 * Dosya düz API anahtarı içerir: import bitince silin, depoya veya belge köküne koymayın.
 * Zaten var olan anahtarlar atlanır (tekrar çalıştırmak çiftlemez, mevcut kaydı ezmez).
 */
declare(strict_types=1);

use QRLicense\License\Keys;
use QRLicense\License\Validator;
use QRLicense\Store\Database;

if (PHP_SAPI !== 'cli') {
	http_response_code(404);
	exit(1);
}
$root = dirname(__DIR__);
foreach (array('Store/Database', 'License/Keys', 'License/Validator') as $f) {
	require_once $root . '/src/' . $f . '.php';
}
$file = $argv[1] ?? '';
$dry = in_array('--dry-run', $argv, true);
if ($file === '' || !is_file($file)) {
	fwrite(STDERR, "Kullanım: php backend/bin/import-wp-licenses.php <dosya.json> [--dry-run]\n");
	exit(1);
}
$configPath = getenv('QR_LICENSE_CONFIG');
$config = require (is_string($configPath) && $configPath !== '' ? $configPath : $root . '/config.php');
$pdo = Database::connect($config);
$keys = new Keys((string) ($config['key_pepper'] ?? ''), (string) ($config['encryption_key'] ?? ''));

$rows = json_decode((string) file_get_contents($file), true, 8, JSON_THROW_ON_ERROR);
if (!is_array($rows)) {
	fwrite(STDERR, "Geçersiz dosya.\n");
	exit(1);
}

$date = static function ($v): ?string {
	if (!is_string($v) || preg_match('/^\d{4}-\d{2}-\d{2}$/', $v) !== 1 || !checkdate((int) substr($v, 5, 2), (int) substr($v, 8, 2), (int) substr($v, 0, 4))) {
		return null;
	}

	return $v;
};
$stats = array('eklendi' => 0, 'mevcut' => 0, 'atlandi' => 0);
$problems = array();
$exists = $pdo->prepare('SELECT 1 FROM licenses WHERE api_key_hmac = :h');
$insert = $pdo->prepare(
	'INSERT INTO licenses (company_name, api_key_hmac, api_key_encrypted, domain, status, starts_on, expires_on, amount_paid, notes,
	   tier_slug, last_seen_at, client_version, archived_at, created_at, updated_at)
	 VALUES (:company, :hmac, :enc, :domain, :status, :starts, :expires, :amount, :notes, NULL, :seen, :version, NULL, :c1, :c2)'
);
$mod = $pdo->prepare('INSERT IGNORE INTO license_modules (license_id, module_slug) VALUES (:id, :m)');
$audit = $pdo->prepare('INSERT INTO audit_events (license_id, occurred_at, actor, action, detail) VALUES (:id, :t, :a, :x, :d)');
$now = gmdate('Y-m-d H:i:s');

foreach ($rows as $i => $r) {
	$key = is_array($r) && isset($r['api_key']) && is_string($r['api_key']) ? strtolower(trim($r['api_key'])) : '';
	if (preg_match('/^[a-f0-9]{40}$/', $key) !== 1) {
		++$stats['atlandi'];
		$problems[] = '#' . $i . ': geçersiz api_key (40 hex değil)';
		continue;
	}
	$hmac = $keys->hmac($key);
	$exists->execute(array('h' => $hmac));
	if ($exists->fetchColumn() !== false) {
		++$stats['mevcut'];
		continue;
	}
	$company = mb_substr(trim((string) ($r['company_name'] ?? '')), 0, 191);
	if ($company === '') {
		$company = '(adsız #' . $i . ')';
	}
	$domain = Validator::normalizeDomain((string) ($r['domain'] ?? ''));
	$modules = array_values(array_intersect(Validator::MODULE_SLUGS, array_map('strval', is_array($r['allowed_modules'] ?? null) ? $r['allowed_modules'] : array())));
	$seen = isset($r['last_seen']) && is_numeric($r['last_seen']) && (int) $r['last_seen'] > 0 ? gmdate('Y-m-d H:i:s', (int) $r['last_seen']) : null;
	if ($dry) {
		++$stats['eklendi'];
		continue;
	}
	$pdo->beginTransaction();
	try {
		$insert->execute(array(
			'company' => $company, 'hmac' => $hmac, 'enc' => $keys->encrypt($key), 'domain' => $domain === '' ? null : mb_substr($domain, 0, 191),
			'status' => ($r['durum'] ?? 'aktif') === 'pasif' ? 'pasif' : 'aktif', 'starts' => $date($r['start_date'] ?? null), 'expires' => $date($r['expires_at'] ?? null),
			'amount' => mb_substr(trim((string) ($r['amount_paid'] ?? '')), 0, 64), 'notes' => (string) ($r['notlar'] ?? ''), 'seen' => $seen,
			'version' => mb_substr(trim((string) ($r['client_version'] ?? '')), 0, 32), 'c1' => $now, 'c2' => $now,
		));
		$id = (int) $pdo->lastInsertId();
		foreach ($modules as $m) {
			$mod->execute(array('id' => $id, 'm' => $m));
		}
		$audit->execute(array('id' => $id, 't' => $now, 'a' => 'aktarim', 'x' => 'wp_aktarimi', 'd' => 'WordPress eklentisinden aktarıldı' . ($domain !== '' ? '; domain: ' . $domain : '')));
		$pdo->commit();
		++$stats['eklendi'];
	} catch (Throwable $e) {
		$pdo->rollBack();
		++$stats['atlandi'];
		$problems[] = '#' . $i . ' (' . $company . '): yazılamadı';
	}
}
fwrite(STDOUT, ($dry ? "[DENEME] " : '') . "eklendi: {$stats['eklendi']}, zaten vardı: {$stats['mevcut']}, atlandı: {$stats['atlandi']}\n");
foreach ($problems as $p) {
	fwrite(STDOUT, ' - ' . $p . "\n");
}
