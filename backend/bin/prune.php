<?php
/**
 * Saklama süresini (config: retention_days) aşan analitik kayıtlarını siler. Günlük cron ile çalıştırın:
 *   17 3 * * *  php /yol/backend/bin/prune.php
 */
declare(strict_types=1);

use QRLicense\Site\Analytics;
use QRLicense\Store\Database;

if (PHP_SAPI !== 'cli') {
	http_response_code(404);
	exit(1);
}
$root = dirname(__DIR__);
require_once $root . '/src/Store/Database.php';
require_once $root . '/src/Site/Analytics.php';

$configPath = getenv('QR_LICENSE_CONFIG');
if (!is_string($configPath) || $configPath === '') {
	$configPath = $root . '/config.php';
}
$config = require $configPath;
$analytics = new Analytics(Database::connect($config), (int) ($config['tz_offset_hours'] ?? 3));
$r = $analytics->prune((int) ($config['retention_days'] ?? 180));
fwrite(STDOUT, "Silindi: {$r['events']} olay, {$r['sessions']} oturum, {$r['visitors']} ziyaretçi.\n");
