<?php
/**
 * Yayın paketi ve yerel yapılandırma ön kontrolü.
 * Sır değerlerini yazdırmaz. Uzak veya üretim veritabanına bağlanmaz.
 *
 * Kullanım:
 *   php bin/release-preflight.php self-test
 *   php bin/release-preflight.php local
 *
 * local kipi QR_PREFLIGHT_CONFIG ister. Bu, QR_LICENSE_CONFIG değildir.
 * Dosya mutlak yol, depo dışında ve 0600 olmalıdır. DSN yalnız yerel soket
 * veya loopback olabilir.
 *
 * Yayın iki parçadır. Web parçası belge köküne girebilir. Çevrimdışı parça
 * migration, örnek yapılandırma ve yönetici oluşturucuyu taşır. Bu parça
 * belge köküne konmaz. .htaccess bu ayrımın yerine geçmez.
 */
declare(strict_types=1);

const PREFLIGHT_WEB = array(
	'backend/public/index.php',
	'backend/src/Admin/Auth.php',
	'backend/src/Http/RequestContext.php',
	'backend/src/Http/Router.php',
	'backend/src/License/Keys.php',
	'backend/src/License/LicenseAdmin.php',
	'backend/src/License/Validator.php',
	'backend/src/Store/Database.php',
	'lisans/index.html',
	'lisans/lisans.js',
	'lisans/lisans.css',
	'assets/brand/qr-menu-official-logo-compact.svg',
);

const PREFLIGHT_OFFLINE = array(
	'backend/migrations/001_schema.sql',
	'backend/migrations/002_license_tier.sql',
	'backend/config.example.php',
	'backend/bin/create-admin.php',
);

const PREFLIGHT_EXCLUDE = array(
	'backend/bin/license-audit.php',
	'backend/bin/release-preflight.php',
	'backend/src/License/TransferAudit.php',
	'backend/.gitignore',
	'backend/GO_LIVE_CHECKLIST.md',
	'backend/INTEGRATION_AUDIT.md',
	'backend/KEY_CUSTODY.md',
	'backend/SECURITY_AUDIT.md',
	'backend/TRANSFER_READINESS.md',
	'backend/DEPLOY_TEST.md',
);

const PREFLIGHT_TABLES = array(
	'admins',
	'admin_sessions',
	'licenses',
	'license_modules',
	'tiers',
	'tier_modules',
	'audit_events',
	'rate_buckets',
);

const PREFLIGHT_DML = array('SELECT', 'INSERT', 'UPDATE', 'DELETE');

/**
 * @return list<string>
 */
function preflightKnownFiles(): array
{
	return array_merge(PREFLIGHT_WEB, PREFLIGHT_OFFLINE);
}

function preflightRepoRoot(): string
{
	return dirname(__DIR__, 2);
}

/**
 * @param list<string> $files
 */
function preflightCopyTree(string $root, string $dest, array $files): bool
{
	foreach ($files as $relative) {
		$from = $root . '/' . $relative;
		$to = $dest . '/' . $relative;
		if (!is_file($from)) {
			return false;
		}
		$dir = dirname($to);
		if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
			return false;
		}
		if (!copy($from, $to)) {
			return false;
		}
	}

	return true;
}

function preflightFail(string $class): void
{
	fwrite(STDOUT, 'hata_sinifi: ' . $class . "\n");
	exit(2);
}

function preflightHttpsRequired(array $config): bool
{
	return !array_key_exists('require_https', $config) || $config['require_https'] !== false;
}

function preflightDsnIsLocal(string $dsn): bool
{
	if (strncmp($dsn, 'mysql:', 6) !== 0) {
		return false;
	}
	$parts = array();
	foreach (explode(';', substr($dsn, 6)) as $piece) {
		if (strpos($piece, '=') === false) {
			continue;
		}
		$pair = explode('=', $piece, 2);
		$parts[strtolower($pair[0])] = $pair[1];
	}
	if (($parts['dbname'] ?? '') === '') {
		return false;
	}
	if (($parts['unix_socket'] ?? '') !== '') {
		return true;
	}
	$host = strtolower($parts['host'] ?? '');

	return $host === 'localhost' || $host === '127.0.0.1' || $host === '::1';
}

/**
 * @param list<string> $lines
 */
function preflightAppGrants(array $lines, string $database): bool
{
	if ($lines === array() || $database === '') {
		return false;
	}
	$covered = array();
	foreach (PREFLIGHT_TABLES as $table) {
		$covered[$table] = array();
	}
	foreach ($lines as $line) {
		if (!is_string($line)) {
			return false;
		}
		$parsed = preflightParseGrant($line);
		if ($parsed === null || $parsed['forbidden'] || $parsed['grant_option']) {
			return false;
		}
		if ($parsed['database'] === '*') {
			if ($parsed['dml'] !== array()) {
				return false;
			}
			continue;
		}
		if (strcasecmp($parsed['database'], $database) !== 0) {
			continue;
		}
		$tables = $parsed['table'] === '*' ? PREFLIGHT_TABLES : array($parsed['table']);
		foreach ($tables as $table) {
			if (!isset($covered[$table])) {
				continue;
			}
			foreach ($parsed['dml'] as $priv) {
				$covered[$table][$priv] = true;
			}
		}
	}
	foreach (PREFLIGHT_TABLES as $table) {
		foreach (PREFLIGHT_DML as $priv) {
			if (!isset($covered[$table][$priv])) {
				return false;
			}
		}
	}

	return true;
}

/**
 * @return array{database:string,table:string,dml:list<string>,forbidden:bool,grant_option:bool}|null
 */
function preflightParseGrant(string $line): ?array
{
	$line = trim($line);
	if (preg_match('/^GRANT\s+(.+?)\s+ON\s+(\*|[`A-Za-z0-9_]+)\.(\*|[`A-Za-z0-9_]+)\s+TO\s+/i', $line, $match) !== 1) {
		return null;
	}
	$tokens = preg_split('/\s*,\s*/', strtoupper($match[1]));
	if (!is_array($tokens) || $tokens === array()) {
		return null;
	}
	$dml = array();
	foreach ($tokens as $token) {
		$token = trim($token);
		if ($token === '' || $token === 'USAGE') {
			continue;
		}
		if (!in_array($token, PREFLIGHT_DML, true)) {
			return array(
				'database' => trim($match[2], '`'),
				'table' => trim($match[3], '`'),
				'dml' => array(),
				'forbidden' => true,
				'grant_option' => true,
			);
		}
		$dml[] = $token;
	}

	return array(
		'database' => trim($match[2], '`'),
		'table' => trim($match[3], '`'),
		'dml' => $dml,
		'forbidden' => false,
		'grant_option' => stripos($line, 'GRANT OPTION') !== false,
	);
}

/**
 * @return list<string>
 */
function preflightRelativeFiles(string $root, string $directory): array
{
	$files = array();
	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS)
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

function preflightExcluded(string $relative): bool
{
	if (str_starts_with($relative, 'backend/tests/') || str_starts_with($relative, 'backend/deploy/')) {
		return true;
	}

	return in_array($relative, PREFLIGHT_EXCLUDE, true);
}

function preflightSecretName(string $relative): bool
{
	$base = basename($relative);
	if ($base === 'config.php' || $base === '.env' || str_starts_with($base, '.env.')) {
		return true;
	}

	return (bool) preg_match('/\.(pem|crt|key|log|sql\.gz|sql\.bak|dump)$/i', $base);
}

/**
 * @return list<string>
 */
function preflightPackageProblems(string $root): array
{
	$problems = array();
	$known = preflightKnownFiles();
	if (array_intersect(PREFLIGHT_WEB, PREFLIGHT_OFFLINE) !== array()) {
		$problems[] = 'paket_ayrimi';
	}
	foreach (PREFLIGHT_WEB as $relative) {
		$base = basename($relative);
		if ($base === 'config.example.php' || $base === 'create-admin.php' || str_ends_with($relative, '.sql')) {
			$problems[] = $relative;
		}
	}
	foreach ($known as $relative) {
		if (!is_file($root . '/' . $relative) || preflightSecretName($relative) || preflightExcluded($relative)) {
			$problems[] = $relative;
		}
	}
	$seen = array();
	foreach (array($root . '/backend', $root . '/lisans') as $directory) {
		foreach (preflightRelativeFiles($root, $directory) as $relative) {
			$seen[$relative] = true;
			if (in_array($relative, $known, true) || preflightExcluded($relative)) {
				continue;
			}
			$problems[] = $relative;
		}
	}
	$public = preflightRelativeFiles($root, $root . '/backend/public');
	if ($public !== array('backend/public/index.php')) {
		$problems[] = 'backend/public';
	}
	if (!is_file($root . '/assets/brand/qr-menu-official-logo-compact.svg')) {
		$problems[] = 'assets/brand/qr-menu-official-logo-compact.svg';
	}

	return $problems;
}

function preflightExampleIsEmpty(string $root): bool
{
	$config = require $root . '/backend/config.example.php';
	if (!is_array($config) || !preflightHttpsRequired($config)) {
		return false;
	}
	$db = isset($config['db']) && is_array($config['db']) ? $config['db'] : array();
	$pepper = isset($config['key_pepper']) ? (string) $config['key_pepper'] : 'dolu';
	$key = isset($config['encryption_key']) ? (string) $config['encryption_key'] : 'dolu';
	$password = isset($db['password']) ? (string) $db['password'] : 'dolu';
	$user = isset($db['user']) ? (string) $db['user'] : 'dolu';

	return $pepper === '' && $key === '' && $password === '' && $user === '';
}

function preflightGitignoreCovers(string $root): bool
{
	$text = file_get_contents($root . '/backend/.gitignore');
	if (!is_string($text)) {
		return false;
	}
	foreach (array('/config.php', '/.env', '/backups/', '*.sql.gz', '*.dump') as $needle) {
		if (!str_contains($text, $needle)) {
			return false;
		}
	}

	return true;
}

function preflightSelfTest(string $root): void
{
	if (preflightPackageProblems($root) !== array()) {
		preflightFail('paket');
	}
	if (!preflightExampleIsEmpty($root) || !preflightGitignoreCovers($root)) {
		preflightFail('ornek_sir');
	}
	$good = array(
		"GRANT USAGE ON *.* TO 'app'@'localhost'",
		"GRANT SELECT, INSERT, UPDATE, DELETE ON `qr_license`.* TO 'app'@'localhost'",
	);
	$broad = array("GRANT ALL PRIVILEGES ON *.* TO 'app'@'localhost' WITH GRANT OPTION");
	$readOnly = array(
		"GRANT USAGE ON *.* TO 'app'@'localhost'",
		"GRANT SELECT ON `qr_license`.* TO 'app'@'localhost'",
	);
	$remote = preflightDsnIsLocal('mysql:host=qrmenuofficial.com;dbname=qr_license');
	$local = preflightDsnIsLocal('mysql:host=127.0.0.1;dbname=qr_license;charset=utf8mb4');
	if (!preflightAppGrants($good, 'qr_license') || preflightAppGrants($broad, 'qr_license') || preflightAppGrants($readOnly, 'qr_license') || $remote || !$local) {
		preflightFail('yetki');
	}
	fwrite(STDOUT, 'web_paket: ' . count(PREFLIGHT_WEB) . "\n");
	fwrite(STDOUT, 'cevrimdisi_paket: ' . count(PREFLIGHT_OFFLINE) . "\n");
	fwrite(STDOUT, 'paket_dosya: ' . count(preflightKnownFiles()) . "\n");
	fwrite(STDOUT, "web_kok: backend/public\n");
	fwrite(STDOUT, "https_zorunlu: evet\n");
	fwrite(STDOUT, "ortam: QR_LICENSE_CONFIG istege_bagli\n");
	fwrite(STDOUT, "self_test: tamam\n");
	exit(0);
}

/**
 * @return array{dsn:string,user:string,password:string,require_https:bool}
 */
function preflightLoadLocal(string $root): array
{
	$path = getenv('QR_PREFLIGHT_CONFIG');
	if (!is_string($path) || $path === '' || $path[0] !== '/' || !is_file($path)) {
		preflightFail('ortam');
	}
	$real = realpath($path);
	$realRoot = realpath($root);
	if ($real === false || $realRoot === false || $real === $realRoot || str_starts_with($real, $realRoot . DIRECTORY_SEPARATOR)) {
		preflightFail('yol');
	}
	$mode = fileperms($path);
	if ($mode === false || ($mode & 0077) !== 0) {
		preflightFail('izin');
	}
	try {
		$data = json_decode((string) file_get_contents($path), true, 8, JSON_THROW_ON_ERROR);
	} catch (JsonException $e) {
		preflightFail('ayar');
	}
	if (!is_array($data) || !isset($data['dsn'], $data['user'], $data['password']) || !is_string($data['dsn']) || !is_string($data['user']) || !is_string($data['password'])) {
		preflightFail('ayar');
	}
	$config = array(
		'require_https' => $data['require_https'] ?? true,
	);
	if (!preflightHttpsRequired($config)) {
		preflightFail('https');
	}
	if (!preflightDsnIsLocal($data['dsn'])) {
		preflightFail('yerel_degil');
	}

	return array(
		'dsn' => $data['dsn'],
		'user' => $data['user'],
		'password' => $data['password'],
		'require_https' => true,
	);
}

function preflightLocal(string $root): void
{
	$config = preflightLoadLocal($root);
	if (preg_match('/(?:^|;)dbname=([^;]+)/i', $config['dsn'], $match) !== 1) {
		preflightFail('ayar');
	}
	try {
		$pdo = new PDO($config['dsn'], $config['user'], $config['password'], array(
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES => false,
		));
		$rows = $pdo->query('SHOW GRANTS FOR CURRENT_USER()')->fetchAll();
	} catch (Throwable $e) {
		preflightFail('baglanti');
	}
	$lines = array();
	foreach ($rows as $row) {
		if (!is_array($row)) {
			preflightFail('yetki');
		}
		$value = reset($row);
		if (!is_string($value)) {
			preflightFail('yetki');
		}
		$lines[] = $value;
	}
	if (!preflightAppGrants($lines, $match[1])) {
		preflightFail('yetki');
	}
	fwrite(STDOUT, "yerel_yetki: yeterli\n");
	fwrite(STDOUT, "https_zorunlu: evet\n");
	exit(0);
}

if (PHP_SAPI === 'cli' && realpath((string) ($_SERVER['argv'][0] ?? '')) === __FILE__) {
	$mode = $argv[1] ?? '';
	if ($argc !== 2 || ($mode !== 'self-test' && $mode !== 'local')) {
		preflightFail('komut');
	}
	if ($mode === 'self-test') {
		preflightSelfTest(preflightRepoRoot());
	}
	preflightLocal(preflightRepoRoot());
}
