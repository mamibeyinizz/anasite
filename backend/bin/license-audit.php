<?php
/**
 * Salt okunur lisans aktarım denetimi.
 * Kullanım: php bin/license-audit.php synthetic|audit
 * Parola, pepper ve bağlantı bilgisi argüman olarak alınmaz.
 */
declare(strict_types=1);

use QRLicense\License\TransferAudit;

if (PHP_SAPI !== 'cli') {
	fwrite(STDOUT, "hata_sinifi: komut\n");
	exit(2);
}

require_once dirname(__DIR__) . '/src/License/Keys.php';
require_once dirname(__DIR__) . '/src/License/Validator.php';
require_once dirname(__DIR__) . '/src/License/TransferAudit.php';

$mode = $argv[1] ?? '';
if ($argc !== 2 || ($mode !== 'synthetic' && $mode !== 'audit')) {
	fwrite(STDOUT, "hata_sinifi: komut\n");
	exit(2);
}

$audit = new TransferAudit();
$repoRoot = dirname(__DIR__, 2);
$report = reportDestination($repoRoot);

if ($mode === 'synthetic') {
	$demo = TransferAudit::demonstration();
	$first = $audit->classify($demo['posts'], $demo['targets'], $demo['pepper']);
	$second = $audit->classify($demo['posts'], $demo['targets'], $demo['pepper']);
	if ($first !== $second) {
		fwrite(STDOUT, "hata_sinifi: tutarsiz\n");
		exit(1);
	}
	$text = $audit->format($first, array(
		'source_engine' => 'synthetic',
		'source_version' => '-',
		'target_engine' => 'synthetic',
		'target_version' => '-',
		'snapshot' => 'bellek',
		'grants' => 'kapsam_disi',
		'error' => '-',
	));
	emit($text, $report);
	exit(0);
}

$sourcePath = getenv('QR_AUDIT_SOURCE');
$targetPath = getenv('QR_AUDIT_TARGET');
$pepperPath = getenv('QR_AUDIT_PEPPER_FILE');
if (!is_string($sourcePath) || $sourcePath === '' || !is_string($targetPath) || $targetPath === '' || !is_string($pepperPath) || $pepperPath === '') {
	fail('config_missing');
}

try {
	$source = loadConfig($sourcePath, true);
	$target = loadConfig($targetPath, false);
	$pepper = loadPepper($pepperPath);
} catch (RuntimeException $e) {
	fail($e->getMessage());
}

$same = TransferAudit::sameDatabase($source['dsn'], $target['dsn']);
if ($same === null) {
	fail('dsn_belirsiz');
}
if ($same) {
	fail('same_database');
}

try {
	$sourcePdo = connect($source);
	$targetPdo = connect($target);
} catch (Throwable $e) {
	fail('baglanti');
}

$sourceName = databaseName($source['dsn']);
$targetName = databaseName($target['dsn']);
if ($sourceName === null || $targetName === null) {
	fail('dsn_belirsiz');
}

try {
	$sourceGrants = grantLines($sourcePdo);
	$targetGrants = grantLines($targetPdo);
} catch (Throwable $e) {
	fail('grants_unverified');
}

if (!$audit->grantsAreReadOnly($sourceGrants, $sourceName, array($source['prefix'] . 'posts', $source['prefix'] . 'postmeta'))
	|| !$audit->grantsAreReadOnly($targetGrants, $targetName, array('licenses', 'license_modules'))) {
	fail('grants_unverified');
}

if (!$audit->beginReadOnly($sourcePdo) || !$audit->beginReadOnly($targetPdo)) {
	rollback($sourcePdo);
	rollback($targetPdo);
	fail('snapshot_unavailable');
}

try {
	$sourceVersion = (string) $sourcePdo->query('SELECT VERSION()')->fetchColumn();
	$targetVersion = (string) $targetPdo->query('SELECT VERSION()')->fetchColumn();
	$posts = readPosts($sourcePdo, $source['prefix']);
	$targets = readTargets($targetPdo);
} catch (Throwable $e) {
	rollback($sourcePdo);
	rollback($targetPdo);
	fail('okuma');
}

rollback($sourcePdo);
rollback($targetPdo);

$counts = $audit->classify($posts, $targets, $pepper);
$text = $audit->format($counts, array(
	'source_engine' => engineName($sourceVersion),
	'source_version' => $sourceVersion,
	'target_engine' => engineName($targetVersion),
	'target_version' => $targetVersion,
	'snapshot' => 'read_only',
	'grants' => 'select',
	'error' => '-',
));
emit($text, $report);
exit(0);

function fail(string $class): void
{
	fwrite(STDOUT, 'hata_sinifi: ' . $class . "\n");
	exit(2);
}

function emit(string $text, ?string $report): void
{
	if ($report !== null) {
		$written = file_put_contents($report, $text, LOCK_EX);
		if ($written === false) {
			fail('rapor_yolu');
		}
		chmod($report, 0600);
	}
	fwrite(STDOUT, $text);
}

function reportDestination(string $repoRoot): ?string
{
	$path = getenv('QR_AUDIT_REPORT');
	if (!is_string($path) || $path === '') {
		return null;
	}
	if ($path[0] !== '/' || str_contains($path, "\0")) {
		fail('rapor_yolu');
	}
	$dir = dirname($path);
	$realDir = realpath($dir);
	$realRoot = realpath($repoRoot);
	if ($realDir === false || $realRoot === false || $realDir === $realRoot || str_starts_with($realDir, $realRoot . DIRECTORY_SEPARATOR)) {
		fail('rapor_yolu');
	}

	return $path;
}

/**
 * @return array{dsn:string,user:string,password:string,prefix:string}
 */
function loadConfig(string $path, bool $source): array
{
	if (!is_file($path)) {
		throw new RuntimeException('config_missing');
	}
	$raw = file_get_contents($path);
	if (!is_string($raw)) {
		throw new RuntimeException('config_missing');
	}
	try {
		$data = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
	} catch (JsonException $e) {
		throw new RuntimeException('config_invalid');
	}
	if (!is_array($data) || !isset($data['dsn'], $data['user'], $data['password']) || !is_string($data['dsn']) || !is_string($data['user']) || !is_string($data['password']) || $data['dsn'] === '' || $data['user'] === '') {
		throw new RuntimeException('config_invalid');
	}
	$prefix = 'wp_';
	if ($source && array_key_exists('prefix', $data)) {
		if (!is_string($data['prefix']) || preg_match('/^[A-Za-z0-9_]+$/', $data['prefix']) !== 1) {
			throw new RuntimeException('config_invalid');
		}
		$prefix = $data['prefix'];
	}

	return array(
		'dsn' => $data['dsn'],
		'user' => $data['user'],
		'password' => $data['password'],
		'prefix' => $prefix,
	);
}

function loadPepper(string $path): string
{
	if (!is_file($path)) {
		throw new RuntimeException('pepper_missing');
	}
	$pepper = file_get_contents($path);
	if (!is_string($pepper) || $pepper === '') {
		throw new RuntimeException('pepper_missing');
	}
	if (str_ends_with($pepper, "\n")) {
		$pepper = substr($pepper, 0, -1);
	}
	if (str_ends_with($pepper, "\r")) {
		$pepper = substr($pepper, 0, -1);
	}
	if (strlen($pepper) < 32) {
		throw new RuntimeException('pepper_invalid');
	}

	return $pepper;
}

/**
 * @param array{dsn:string,user:string,password:string} $config
 */
function connect(array $config): PDO
{
	return new PDO($config['dsn'], $config['user'], $config['password'], array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false,
	));
}

function databaseName(string $dsn): ?string
{
	$identity = TransferAudit::sameDatabase($dsn, $dsn);
	if ($identity !== true) {
		return null;
	}
	if (preg_match('/(?:^|;)dbname=([^;]+)/i', $dsn, $match) !== 1) {
		return null;
	}

	return $match[1];
}

/**
 * @return list<string>
 */
function grantLines(PDO $pdo): array
{
	$rows = $pdo->query('SHOW GRANTS FOR CURRENT_USER()')->fetchAll();
	$lines = array();
	foreach ($rows as $row) {
		if (!is_array($row)) {
			throw new RuntimeException('grants_unverified');
		}
		$value = reset($row);
		if (!is_string($value)) {
			throw new RuntimeException('grants_unverified');
		}
		$lines[] = $value;
	}

	return $lines;
}

function rollback(PDO $pdo): void
{
	try {
		if ($pdo->inTransaction()) {
			$pdo->rollBack();
		}
	} catch (Throwable $e) {
		return;
	}
}

function engineName(string $version): string
{
	if (stripos($version, 'MariaDB') !== false) {
		return 'MariaDB';
	}
	if (preg_match('/^[0-9]/', $version) === 1) {
		return 'MySQL';
	}

	return 'bilinmiyor';
}

/**
 * @return list<array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>}>
 */
function readPosts(PDO $pdo, string $prefix): array
{
	$posts = $pdo->query('SELECT ID, post_status, post_title FROM `' . $prefix . 'posts` WHERE post_type = ' . $pdo->quote('qmls_license'))->fetchAll();
	$records = array();
	$ids = array();
	foreach ($posts as $post) {
		if (!is_array($post)) {
			continue;
		}
		$id = (int) $post['ID'];
		$ids[] = $id;
		$records[$id] = array(
			'post_status' => (string) $post['post_status'],
			'post_title' => (string) $post['post_title'],
			'meta' => array(),
		);
	}
	$keys = array('api_key', 'durum', 'allowed_modules', 'domain', 'expires_at', 'start_date', 'amount_paid', 'notlar', 'client_version');
	foreach (array_chunk($ids, 200) as $chunk) {
		$placeholders = implode(',', array_fill(0, count($chunk), '?'));
		$keyPlaceholders = implode(',', array_fill(0, count($keys), '?'));
		$statement = $pdo->prepare('SELECT post_id, meta_key, meta_value FROM `' . $prefix . 'postmeta` WHERE post_id IN (' . $placeholders . ') AND meta_key IN (' . $keyPlaceholders . ')');
		$statement->execute(array_merge($chunk, $keys));
		while (($row = $statement->fetch()) !== false) {
			$postId = (int) $row['post_id'];
			$metaKey = (string) $row['meta_key'];
			if (!isset($records[$postId])) {
				continue;
			}
			if (!isset($records[$postId]['meta'][$metaKey])) {
				$records[$postId]['meta'][$metaKey] = array('rows' => array());
			}
			$records[$postId]['meta'][$metaKey]['rows'][] = (string) $row['meta_value'];
		}
	}

	return array_values($records);
}

/**
 * @return list<array{hmac:string,company_name:string,domain:?string,status:string,starts_on:?string,expires_on:?string,amount_paid:string,notes:string,tier_slug:?string,client_version:string,archived:bool,modules:list<string>}>
 */
function readTargets(PDO $pdo): array
{
	$rows = $pdo->query('SELECT id, api_key_hmac, company_name, domain, status, starts_on, expires_on, amount_paid, notes, tier_slug, client_version, archived_at FROM licenses')->fetchAll();
	$byId = array();
	foreach ($rows as $row) {
		if (!is_array($row)) {
			continue;
		}
		$byId[(int) $row['id']] = array(
			'hmac' => (string) $row['api_key_hmac'],
			'company_name' => (string) $row['company_name'],
			'domain' => $row['domain'] === null ? null : (string) $row['domain'],
			'status' => (string) $row['status'],
			'starts_on' => $row['starts_on'] === null ? null : (string) $row['starts_on'],
			'expires_on' => $row['expires_on'] === null ? null : (string) $row['expires_on'],
			'amount_paid' => (string) $row['amount_paid'],
			'notes' => (string) ($row['notes'] ?? ''),
			'tier_slug' => $row['tier_slug'] === null || $row['tier_slug'] === '' ? null : (string) $row['tier_slug'],
			'client_version' => (string) $row['client_version'],
			'archived' => $row['archived_at'] !== null && $row['archived_at'] !== '',
			'modules' => array(),
		);
	}
	$modules = $pdo->query('SELECT license_id, module_slug FROM license_modules')->fetchAll();
	foreach ($modules as $module) {
		if (!is_array($module)) {
			continue;
		}
		$id = (int) $module['license_id'];
		if (isset($byId[$id])) {
			$byId[$id]['modules'][] = (string) $module['module_slug'];
		}
	}

	return array_values($byId);
}
