<?php
/**
 * Aktarım denetiminin geçici MySQL/MariaDB testi.
 * Üretim veritabanına bağlanmaz. QR_AUDIT_IT_ADMIN bir JSON dosyasıdır.
 */
declare(strict_types=1);

use QRLicense\License\TransferAudit;
use QRLicense\License\Validator;

require_once dirname(__DIR__) . '/src/License/Validator.php';
require_once dirname(__DIR__) . '/src/License/TransferAudit.php';

$failures = 0;
$checks = 0;

function check(string $name, bool $ok): void
{
	global $failures, $checks;
	$checks++;
	fwrite(STDOUT, ($ok ? 'ok  ' : 'FAIL ') . $name . "\n");
	if (!$ok) {
		$failures++;
	}
}

$adminPath = getenv('QR_AUDIT_IT_ADMIN');
if (!is_string($adminPath) || !is_file($adminPath)) {
	fwrite(STDOUT, "hata_sinifi: ortam_yok\n");
	exit(2);
}
$admin = json_decode((string) file_get_contents($adminPath), true);
if (!is_array($admin) || !isset($admin['dsn'], $admin['user'], $admin['password'])) {
	fwrite(STDOUT, "hata_sinifi: ortam_yok\n");
	exit(2);
}

$pepper = str_repeat('t', 32);
$suffix = bin2hex(random_bytes(3));
$sourceDb = 'qrl_it_src_' . $suffix;
$targetDb = 'qrl_it_dst_' . $suffix;
$users = array(
	'src_ro' => 'qrl_sro_' . $suffix,
	'dst_ro' => 'qrl_dro_' . $suffix,
	'src_rw' => 'qrl_srw_' . $suffix,
	'dst_none' => 'qrl_dno_' . $suffix,
	'dst_gap' => 'qrl_dgp_' . $suffix,
	'role' => 'qrl_rlu_' . $suffix,
);
$roleName = 'qrl_role_' . $suffix;
$passwords = array();
foreach ($users as $name => $user) {
	$passwords[$name] = bin2hex(random_bytes(18));
}
$socket = dsnPart((string) $admin['dsn'], 'unix_socket');
$hostPart = $socket !== '' ? 'unix_socket=' . $socket : 'host=127.0.0.1';

try {
	$root = new PDO((string) $admin['dsn'], (string) $admin['user'], (string) $admin['password'], array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false,
	));
	$version = (string) $root->query('SELECT VERSION()')->fetchColumn();
	$engine = stripos($version, 'MariaDB') !== false ? 'MariaDB' : 'MySQL';
	fwrite(STDOUT, 'motor: ' . $engine . ' ' . $version . "\n");

	$root->exec('CREATE DATABASE `' . $sourceDb . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
	$root->exec('CREATE DATABASE `' . $targetDb . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
	if (!str_contains((string) $admin['dsn'], 'dbname=')) {
		throw new RuntimeException('dsn');
	}
	$targetDsn = preg_replace('/dbname=[^;]*/', 'dbname=' . $targetDb, (string) $admin['dsn']);
	$sourceDsn = preg_replace('/dbname=[^;]*/', 'dbname=' . $sourceDb, (string) $admin['dsn']);
	if (!is_string($targetDsn) || !is_string($sourceDsn)) {
		throw new RuntimeException('dsn');
	}
	$target = new PDO($targetDsn, (string) $admin['user'], (string) $admin['password'], array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false,
	));
	$sourceAdmin = new PDO($sourceDsn, (string) $admin['user'], (string) $admin['password'], array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false,
	));
	applySchema($target, dirname(__DIR__) . '/migrations/001_schema.sql');
	applyTier($target);
	createWordpress($sourceAdmin);
	$fixture = fixtures($pepper);
	insertPosts($sourceAdmin, $fixture['posts']);
	insertTargets($target, $fixture['targets']);
	$beforeSource = (int) $sourceAdmin->query('SELECT COUNT(*) FROM wp_posts')->fetchColumn();
	$beforeTarget = (int) $target->query('SELECT COUNT(*) FROM licenses')->fetchColumn();

	foreach ($users as $name => $user) {
		$root->exec('CREATE USER ' . qi($user) . "@'localhost' IDENTIFIED BY " . $root->quote($passwords[$name]));
	}
	$root->exec('GRANT SELECT ON `' . $sourceDb . '`.wp_posts TO ' . qi($users['src_ro']) . "@'localhost'");
	$root->exec('GRANT SELECT ON `' . $sourceDb . '`.wp_postmeta TO ' . qi($users['src_ro']) . "@'localhost'");
	$root->exec('GRANT SELECT ON `' . $targetDb . '`.licenses TO ' . qi($users['dst_ro']) . "@'localhost'");
	$root->exec('GRANT SELECT ON `' . $targetDb . '`.license_modules TO ' . qi($users['dst_ro']) . "@'localhost'");
	$root->exec('GRANT SELECT, INSERT ON `' . $sourceDb . '`.* TO ' . qi($users['src_rw']) . "@'localhost'");
	$root->exec('GRANT USAGE ON *.* TO ' . qi($users['dst_none']) . "@'localhost'");
	$root->exec('GRANT SELECT ON `' . $targetDb . '`.tiers TO ' . qi($users['dst_gap']) . "@'localhost'");
	$root->exec('CREATE ROLE ' . qi($roleName));
	$root->exec('GRANT SELECT ON `' . $sourceDb . '`.wp_posts TO ' . qi($roleName));
	$root->exec('GRANT SELECT ON `' . $sourceDb . '`.wp_postmeta TO ' . qi($roleName));
	$root->exec('GRANT ' . qi($roleName) . ' TO ' . qi($users['role']) . "@'localhost'");
	if ($engine === 'MariaDB') {
		$root->exec('SET DEFAULT ROLE ' . qi($roleName) . ' FOR ' . qi($users['role']) . "@'localhost'");
	} else {
		$root->exec('SET DEFAULT ROLE ' . qi($roleName) . ' TO ' . qi($users['role']) . "@'localhost'");
	}

	$srcRo = connectUser($hostPart, $sourceDb, $users['src_ro'], $passwords['src_ro']);
	$grantLines = grantText($srcRo);
	$hash = '';
	$identified = false;
	foreach ($grantLines as $line) {
		if (str_contains($line, 'IDENTIFIED BY')) {
			$identified = true;
			if (preg_match("/IDENTIFIED BY PASSWORD '([^']*)'/", $line, $match) === 1) {
				$hash = $match[1];
			}
		}
	}
	check('canlı SELECT yetkisi kabul', TransferAudit::grantsAreReadOnly($grantLines, $sourceDb, array('wp_posts', 'wp_postmeta')));
	if ($engine === 'MariaDB') {
		check('MariaDB yetki satırında parola özeti var', $identified && $hash !== '');
	} else {
		check('MySQL yetki satırında parola özeti yok', !$identified);
	}
	foreach ($grantLines as $line) {
		$safe = preg_replace("/IDENTIFIED BY PASSWORD '[^']*'/", "IDENTIFIED BY PASSWORD '[gizli]'", $line);
		$safe = is_string($safe) ? $safe : $line;
		$safe = preg_replace('/`qrl_[a-z]+_[0-9a-f]+`@`localhost`/', '`kullanici`@`localhost`', $safe) ?? $safe;
		$safe = preg_replace('/`qrl_it_(src|dst)_[0-9a-f]+`/', '`sentetik_db`', $safe) ?? $safe;
		fwrite(STDOUT, 'yetki_satiri: ' . $safe . "\n");
	}

	$audit = new TransferAudit();
	check('salt okunur transaction açılır', $audit->beginReadOnly($srcRo));
	$seen = (int) $srcRo->query('SELECT COUNT(*) FROM wp_posts')->fetchColumn();
	$sourceAdmin->exec("INSERT INTO wp_posts (post_title, post_status, post_type) VALUES ('Geçici', 'publish', 'qmls_license')");
	$seenAfter = (int) $srcRo->query('SELECT COUNT(*) FROM wp_posts')->fetchColumn();
	$srcRo->rollBack();
	$visible = (int) $sourceAdmin->query('SELECT COUNT(*) FROM wp_posts')->fetchColumn();
	$sourceAdmin->exec("DELETE FROM wp_posts WHERE post_title = 'Geçici'");
	check('okuma anlık görüntüsü yazmayı görmez', $seenAfter === $seen && $visible === $seen + 1);
	$writeBlocked = false;
	$srcRo->beginTransaction();
	try {
		$srcRo->exec('START TRANSACTION READ ONLY');
	} catch (Throwable $e) {
		$writeBlocked = true;
	}
	if ($srcRo->inTransaction()) {
		try {
			$srcRo->exec("INSERT INTO wp_posts (post_title, post_status, post_type) VALUES ('Yazilamaz', 'publish', 'qmls_license')");
		} catch (Throwable $e) {
			$writeBlocked = true;
		}
		$srcRo->rollBack();
	}
	check('read only transaction yazmayı reddeder', $writeBlocked);
	check('reddedilen yazma satır bırakmaz', (int) $sourceAdmin->query("SELECT COUNT(*) FROM wp_posts WHERE post_title = 'Yazilamaz'")->fetchColumn() === 0);

	$files = writeConfigs($hostPart, $sourceDb, $targetDb, $users, $passwords, $pepper);
	$first = runAudit($files['source'], $files['target'], $files['pepper']);
	$second = runAudit($files['source'], $files['target'], $files['pepper']);
	$expected = $audit->classify($fixture['posts'], $fixture['targets'], $pepper);
	$parsed = parseCounts($first['out']);
	fwrite(STDOUT, 'sayac_bellek: ' . $expected['total'] . ' ' . $expected['eklenebilir'] . ' ' . $expected['zaten_mevcut'] . ' ' . $expected['manuel_inceleme'] . "\n");
	fwrite(STDOUT, 'sayac_cli: ' . ($parsed['total'] ?? -1) . ' ' . ($parsed['eklenebilir'] ?? -1) . ' ' . ($parsed['zaten_mevcut'] ?? -1) . ' ' . ($parsed['manuel_inceleme'] ?? -1) . "\n");
	check('denetim başarılı', $first['code'] === 0 && ($parsed['total'] ?? -1) === $expected['total']);
	check('kategoriler kayıt sayısına eşit', ($parsed['eklenebilir'] ?? 0) + ($parsed['zaten_mevcut'] ?? 0) + ($parsed['manuel_inceleme'] ?? 0) === ($parsed['total'] ?? -1));
	$reasonOk = true;
	$reasonParts = array();
	foreach (TransferAudit::REASONS as $reason) {
		if (!str_contains($first['out'], 'neden.' . $reason . ': ' . $expected['neden'][$reason] . "\n")) {
			$reasonOk = false;
		}
		if ($expected['neden'][$reason] > 0) {
			$reasonParts[] = $reason . '=' . $expected['neden'][$reason];
		}
	}
	fwrite(STDOUT, 'nedenler: ' . implode(' ', $reasonParts) . "\n");
	check('neden sayaçları aynı', $reasonOk);
	check('nedenler üst üste sayılır', array_sum($expected['neden']) > $expected['manuel_inceleme']);
	check('veritabanı sayacı bellek sayacıyla aynı', $parsed === array(
		'total' => $expected['total'],
		'eklenebilir' => $expected['eklenebilir'],
		'zaten_mevcut' => $expected['zaten_mevcut'],
		'manuel_inceleme' => $expected['manuel_inceleme'],
	) && $expected['neden']['post_status'] > 0 && $expected['neden']['status'] > 0 && $expected['neden']['domain_meta_missing'] > 0 && $expected['neden']['modules'] > 0 && $expected['neden']['source_key'] > 1 && $expected['neden']['target_hmac_mismatch'] > 0);
	check('iki çalıştırma aynı', $first['out'] === $second['out']);
	check('çıktı motoru doğru', str_contains($first['out'], 'kaynak_motor: ' . $engine) && str_contains($first['out'], 'tutarli_okuma: read_only') && str_contains($first['out'], 'salt_okunur_yetki: select') && str_contains($first['out'], 'saat_dilimi_onayi: verilmedi'));
	$leaked = $first['out'] . $first['err'] . $second['out'] . $second['err'];
	$secretHit = false;
	foreach (array_merge($passwords, array($pepper, $hash, 'sentetik-anahtar', 'Sentetik Firma', 'ornek.test')) as $secret) {
		if ($secret !== '' && str_contains($leaked, $secret)) {
			$secretHit = true;
		}
	}
	check('çıktıda gizli değer yok', !$secretHit && !str_contains($leaked, 'IDENTIFIED BY'));
	check('kaynak ve hedef satır sayısı değişmedi', (int) $sourceAdmin->query('SELECT COUNT(*) FROM wp_posts')->fetchColumn() === $beforeSource && (int) $target->query('SELECT COUNT(*) FROM licenses')->fetchColumn() === $beforeTarget);

	$same = runAudit($files['source'], $files['source'], $files['pepper']);
	check('aynı veritabanı reddedilir', $same['code'] === 2 && $same['out'] === "hata_sinifi: same_database\n" && !str_contains($same['out'], $passwords['src_ro']));

	$badFile = tempnam(sys_get_temp_dir(), 'qrl');
	file_put_contents($badFile, json_encode(array('dsn' => 'sqlite:/tmp/qrl-it.sqlite', 'user' => 'ro', 'password' => $passwords['src_ro'], 'prefix' => 'wp_')));
	$bad = runAudit($badFile, $files['target'], $files['pepper']);
	check('anlaşılmayan DSN reddedilir', $bad['code'] === 2 && $bad['out'] === "hata_sinifi: dsn_belirsiz\n");
	unlink($badFile);

	$rwFile = tempnam(sys_get_temp_dir(), 'qrl');
	file_put_contents($rwFile, json_encode(array(
		'dsn' => 'mysql:' . $hostPart . ';dbname=' . $sourceDb . ';charset=utf8mb4',
		'user' => $users['src_rw'],
		'password' => $passwords['src_rw'],
		'prefix' => 'wp_',
	)));
	$rw = runAudit($rwFile, $files['target'], $files['pepper']);
	check('yazma yetkisi reddedilir', $rw['code'] === 2 && $rw['out'] === "hata_sinifi: grants_unverified\n" && !str_contains($rw['out'] . $rw['err'], $passwords['src_rw']));
	unlink($rwFile);

	$noneFile = tempnam(sys_get_temp_dir(), 'qrl');
	file_put_contents($noneFile, json_encode(array(
		'dsn' => 'mysql:' . $hostPart . ';dbname=' . $targetDb . ';charset=utf8mb4',
		'user' => $users['dst_none'],
		'password' => $passwords['dst_none'],
	)));
	$none = runAudit($files['source'], $noneFile, $files['pepper']);
	$noneClass = trim($none['out']);
	fwrite(STDOUT, 'hedef_yetkisiz_sinif: ' . $noneClass . "\n");
	check('hedef okuma yetkisi yoksa reddedilir', $none['code'] === 2 && ($noneClass === 'hata_sinifi: grants_unverified' || $noneClass === 'hata_sinifi: baglanti') && !str_contains($none['out'] . $none['err'], $passwords['dst_none']));
	unlink($noneFile);

	$gapFile = tempnam(sys_get_temp_dir(), 'qrl');
	file_put_contents($gapFile, json_encode(array(
		'dsn' => 'mysql:' . $hostPart . ';dbname=' . $targetDb . ';charset=utf8mb4',
		'user' => $users['dst_gap'],
		'password' => $passwords['dst_gap'],
	)));
	$gap = runAudit($files['source'], $gapFile, $files['pepper']);
	check('eksik hedef tablosu reddedilir', $gap['code'] === 2 && $gap['out'] === "hata_sinifi: grants_unverified\n" && !str_contains($gap['out'] . $gap['err'], $passwords['dst_gap']));
	unlink($gapFile);

	$rwPdo = connectUser($hostPart, $sourceDb, $users['src_rw'], $passwords['src_rw']);
	foreach (grantText($rwPdo) as $line) {
		$safe = preg_replace("/IDENTIFIED BY PASSWORD '[^']*'/", "IDENTIFIED BY PASSWORD '[gizli]'", $line) ?? $line;
		$safe = preg_replace('/`qrl_[a-z]+_[0-9a-f]+`@`localhost`/', '`kullanici`@`localhost`', $safe) ?? $safe;
		$safe = preg_replace('/`qrl_it_(src|dst)_[0-9a-f]+`/', '`sentetik_db`', $safe) ?? $safe;
		fwrite(STDOUT, 'yazma_yetkisi_satiri: ' . $safe . "\n");
	}

	$rolePdo = connectUser($hostPart, $sourceDb, $users['role'], $passwords['role']);
	$roleLines = grantText($rolePdo);
	$roleExpanded = false;
	foreach ($roleLines as $line) {
		$safe = preg_replace("/IDENTIFIED BY PASSWORD '[^']*'/", "IDENTIFIED BY PASSWORD '[gizli]'", $line) ?? $line;
		$safe = preg_replace('/`qrl_[A-Za-z0-9_]+`/', '`ad`', $safe) ?? $safe;
		fwrite(STDOUT, 'rol_satiri: ' . $safe . "\n");
		if (str_contains($line, 'SELECT') && str_contains($line, 'wp_posts')) {
			$roleExpanded = true;
		}
	}
	$roleCount = (int) $rolePdo->query('SELECT COUNT(*) FROM wp_posts')->fetchColumn();
	check('rol kullanıcısı seçebilir', $roleCount === (int) $sourceAdmin->query('SELECT COUNT(*) FROM wp_posts')->fetchColumn() && $roleCount > 0);
	check('rol satırı metin çözümünü düşürür', !TransferAudit::grantsAreReadOnly($roleLines, $sourceDb, array('wp_posts', 'wp_postmeta')));
	if ($engine === 'MariaDB') {
		check('MariaDB rol yetkisi SELECT satırına açılmaz', !$roleExpanded);
	} else {
		check('MySQL rol yetkisi SELECT satırına açılır', $roleExpanded);
	}
	$roleFile = tempnam(sys_get_temp_dir(), 'qrl');
	file_put_contents($roleFile, json_encode(array(
		'dsn' => 'mysql:' . $hostPart . ';dbname=' . $sourceDb . ';charset=utf8mb4',
		'user' => $users['role'],
		'password' => $passwords['role'],
		'prefix' => 'wp_',
	)));
	$roleAudit = runAudit($roleFile, $files['target'], $files['pepper']);
	check('rol ile verilen SELECT reddedilir', $roleAudit['code'] === 2 && $roleAudit['out'] === "hata_sinifi: grants_unverified\n" && !str_contains($roleAudit['out'] . $roleAudit['err'], $passwords['role']) && !str_contains($roleAudit['out'] . $roleAudit['err'], 'IDENTIFIED BY'));
	unlink($roleFile);

	$open = (int) $root->query("SELECT COUNT(*) FROM information_schema.INNODB_TRX t JOIN information_schema.PROCESSLIST p ON p.ID = t.trx_mysql_thread_id WHERE p.USER IN (" . implode(',', array_map(static fn(string $user): string => $root->quote($user), $users)) . ')')->fetchColumn();
	check('transaction kapanmış', $open === 0);

	$previous = date_default_timezone_get();
	date_default_timezone_set('Europe/Istanbul');
	$instant = new DateTimeImmutable('2026-10-23 21:30:00', new DateTimeZone('UTC'));
	$oldCutoff = strtotime('2026-10-23 23:59:59');
	$oldExpired = $oldCutoff !== false && $oldCutoff < $instant->getTimestamp();
	$newExpired = Validator::isExpired('2026-10-23', $instant);
	date_default_timezone_set('UTC');
	$utcOld = strtotime('2026-10-23 23:59:59');
	$utcExpired = $utcOld !== false && $utcOld < $instant->getTimestamp();
	$utcNew = Validator::isExpired('2026-10-23', $instant);
	date_default_timezone_set($previous);
	check('UTC+3 örneğinde eski ve yeni bitiş ayrılır', $oldExpired && !$newExpired);
	check('UTC örneğinde aynı an ikisinde de dolmamış', !$utcExpired && !$utcNew);
	$custody = (string) file_get_contents(dirname(__DIR__) . '/KEY_CUSTODY.md');
	check('saat dilimi koşulu belgede duruyor', str_contains($custody, 'date.timezone') && str_contains($custody, '23:59:59 UTC') && str_contains($custody, 'aktarım onayı verilmez'));
} catch (Throwable $e) {
	$safe = $e->getMessage();
	if (is_string($adminPath) && is_file($adminPath)) {
		$cfg = json_decode((string) file_get_contents($adminPath), true);
		if (is_array($cfg) && isset($cfg['password']) && is_string($cfg['password']) && $cfg['password'] !== '') {
			$safe = str_replace($cfg['password'], '[gizli]', $safe);
		}
	}
	$safe = preg_replace("/IDENTIFIED BY PASSWORD '[^']*'/", "IDENTIFIED BY PASSWORD '[gizli]'", $safe) ?? $safe;
	$safe = preg_replace('/mysql:[^\s]*/', 'mysql:[gizli]', $safe) ?? $safe;
	$safe = preg_replace('/[A-Za-z0-9._-]{24,}/', '[uzun]', $safe) ?? $safe;
	fwrite(STDOUT, "FAIL calisma " . $e::class . " satir=" . $e->getLine() . " kod=" . $e->getCode() . "\n");
	fwrite(STDOUT, "FAIL ayrinti: " . $safe . "\n");
	$failures++;
} finally {
	if (isset($root) && $root instanceof PDO) {
		foreach ($users as $user) {
			try {
				$root->exec('DROP USER IF EXISTS ' . qi($user) . "@'localhost'");
			} catch (Throwable $e) {
				fwrite(STDOUT, "FAIL temizlik_kullanici\n");
				$failures++;
			}
		}
		if (isset($roleName)) {
			try {
				$root->exec('DROP ROLE IF EXISTS ' . qi($roleName));
			} catch (Throwable $e) {
				fwrite(STDOUT, "FAIL temizlik_rol\n");
				$failures++;
			}
		}
		foreach (array($sourceDb, $targetDb) as $database) {
			try {
				$root->exec('DROP DATABASE IF EXISTS `' . $database . '`');
			} catch (Throwable $e) {
				fwrite(STDOUT, "FAIL temizlik_veritabani\n");
				$failures++;
			}
		}
	}
	if (isset($files)) {
		foreach ($files as $path) {
			if (is_string($path) && is_file($path)) {
				unlink($path);
			}
		}
	}
}

fwrite(STDOUT, "\n{$checks} kontrol, {$failures} hata\n");
exit($failures === 0 ? 0 : 1);

function dsnPart(string $dsn, string $key): string
{
	foreach (explode(';', substr($dsn, 6)) as $piece) {
		if (str_starts_with(strtolower($piece), $key . '=')) {
			return substr($piece, strlen($key) + 1);
		}
	}

	return '';
}

function qi(string $name): string
{
	return '`' . str_replace('`', '', $name) . '`';
}

function applySchema(PDO $pdo, string $path): void
{
	$sql = (string) file_get_contents($path);
	$parts = preg_split('/;\s*\n/', $sql);
	if (!is_array($parts)) {
		throw new RuntimeException('schema');
	}
	foreach ($parts as $part) {
		$lines = array();
		foreach (preg_split('/\n/', $part) ?: array() as $line) {
			if (str_starts_with(ltrim($line), '--')) {
				continue;
			}
			$lines[] = $line;
		}
		$statement = trim(implode("\n", $lines));
		if ($statement === '') {
			continue;
		}
		$pdo->exec($statement);
	}
}

function applyTier(PDO $pdo): void
{
	$missing = (int) $pdo->query("SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'licenses' AND COLUMN_NAME = 'tier_slug'")->fetchColumn();
	if ($missing === 1) {
		$pdo->exec('ALTER TABLE licenses ADD COLUMN tier_slug VARCHAR(32) NULL AFTER notes');
	}
}

function createWordpress(PDO $pdo): void
{
	$pdo->exec('CREATE TABLE wp_posts (ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, post_title TEXT NOT NULL, post_status VARCHAR(20) NOT NULL, post_type VARCHAR(20) NOT NULL, PRIMARY KEY (ID)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci');
	$pdo->exec('CREATE TABLE wp_postmeta (meta_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, post_id BIGINT UNSIGNED NOT NULL, meta_key VARCHAR(255) NULL, meta_value LONGTEXT NULL, PRIMARY KEY (meta_id), KEY post_id (post_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci');
}

/**
 * @return array{posts:list<array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>}>,targets:list<array{hmac:string,company_name:string,domain:?string,status:string,starts_on:?string,expires_on:?string,amount_paid:string,notes:string,tier_slug:?string,client_version:string,archived:bool,modules:list<string>}>}
 */
function fixtures(string $pepper): array
{
	$posts = array(
		TransferAudit::cleanPost('sentetik-anahtar-aktif', array('title' => 'Sentetik Firma')),
		TransferAudit::cleanPost('sentetik-anahtar-pasif', array(
			'title' => 'Sentetik Firma',
			'durum' => 'pasif',
			'domain' => 'https://www.Ornek.test/yol',
			'expires_at' => '2026-12-31',
			'start_date' => '2026-01-01',
			'modules' => array('qr-masa', 'restoran-menu'),
		)),
		TransferAudit::cleanPost('sentetik-anahtar-dolmus', array('title' => 'Sentetik Firma', 'expires_at' => '2020-01-01')),
		TransferAudit::cleanPost('sentetik-anahtar-ciftmodul', array('title' => 'Sentetik Firma', 'modules' => array('qr-masa', 'qr-masa'))),
		TransferAudit::cleanPost('sentetik-anahtar-taslak', array('title' => 'Sentetik Firma', 'post_status' => 'draft', 'durum' => 'active')),
		TransferAudit::cleanPost('sentetik-anahtar-cop', array('title' => 'Sentetik Firma', 'post_status' => 'trash')),
		TransferAudit::cleanPost('sentetik-anahtar-durumyok', array('title' => 'Sentetik Firma', 'durum' => null)),
		TransferAudit::cleanPost('sentetik-anahtar-durumyanlis', array('title' => 'Sentetik Firma', 'durum' => 'active')),
		TransferAudit::cleanPost('sentetik-anahtar-domainyok', array('title' => 'Sentetik Firma', 'domain' => null)),
		TransferAudit::cleanPost('sentetik-anahtar-modul', array('title' => 'Sentetik Firma', 'modules' => array('qr-masa', 'sahte-modul'))),
		TransferAudit::cleanPost('sentetik-anahtar-anahtaryok', array('title' => 'Sentetik Firma', 'api_key' => null)),
		TransferAudit::cleanPost('sentetik-anahtar-yinelenen', array('title' => 'Sentetik Firma')),
		TransferAudit::cleanPost('sentetik-anahtar-yinelenen', array('title' => 'Sentetik Firma')),
		TransferAudit::cleanPost('sentetik-anahtar-ayni', array('title' => 'Sentetik Firma')),
		TransferAudit::cleanPost('sentetik-anahtar-farkli', array('title' => 'Sentetik Firma')),
		TransferAudit::cleanPost('sentetik-anahtar-yuzde', array('title' => 'Sentetik Firma', 'domain' => 'bad%20host')),
		TransferAudit::cleanPost('sentetik-anahtar-tarih', array('title' => 'Sentetik Firma', 'expires_at' => '2026-02-31')),
	);
	$same = TransferAudit::cleanPost('sentetik-anahtar-ayni', array('title' => 'Sentetik Firma'));
	$targets = array(
		array(
			'hmac' => hash_hmac('sha256', 'sentetik-anahtar-ayni', $pepper),
			'company_name' => 'Sentetik Firma',
			'domain' => null,
			'status' => 'aktif',
			'starts_on' => null,
			'expires_on' => null,
			'amount_paid' => '',
			'notes' => '',
			'tier_slug' => null,
			'client_version' => '1.0.0',
			'archived' => false,
			'modules' => array('qr-masa'),
		),
		array(
			'hmac' => hash_hmac('sha256', 'sentetik-anahtar-farkli', $pepper),
			'company_name' => 'Farkli Kayit',
			'domain' => null,
			'status' => 'aktif',
			'starts_on' => null,
			'expires_on' => null,
			'amount_paid' => '',
			'notes' => '',
			'tier_slug' => null,
			'client_version' => '1.0.0',
			'archived' => false,
			'modules' => array('qr-masa'),
		),
	);
	unset($same);

	return array('posts' => $posts, 'targets' => $targets);
}

/**
 * @param list<array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>}> $posts
 */
function insertPosts(PDO $pdo, array $posts): void
{
	$post = $pdo->prepare('INSERT INTO wp_posts (post_title, post_status, post_type) VALUES (:title, :status, :type)');
	$meta = $pdo->prepare('INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (:id, :key, :value)');
	foreach ($posts as $record) {
		$post->execute(array(
			'title' => $record['post_title'],
			'status' => $record['post_status'],
			'type' => 'qmls_license',
		));
		$id = (int) $pdo->lastInsertId();
		foreach ($record['meta'] as $key => $item) {
			foreach ($item['rows'] as $value) {
				$meta->execute(array('id' => $id, 'key' => $key, 'value' => $value));
			}
		}
	}
}

/**
 * @param list<array{hmac:string,company_name:string,domain:?string,status:string,starts_on:?string,expires_on:?string,amount_paid:string,notes:string,tier_slug:?string,client_version:string,archived:bool,modules:list<string>}> $targets
 */
function insertTargets(PDO $pdo, array $targets): void
{
	$insert = $pdo->prepare('INSERT INTO licenses (company_name, api_key_hmac, api_key_encrypted, domain, status, starts_on, expires_on, amount_paid, notes, tier_slug, client_version, archived_at, created_at, updated_at) VALUES (:company, :hmac, NULL, :domain, :status, :starts, :expires, :amount, :notes, :tier, :version, :archived, UTC_TIMESTAMP(), UTC_TIMESTAMP())');
	$module = $pdo->prepare('INSERT INTO license_modules (license_id, module_slug) VALUES (:id, :slug)');
	foreach ($targets as $target) {
		$insert->execute(array(
			'company' => $target['company_name'],
			'hmac' => $target['hmac'],
			'domain' => $target['domain'],
			'status' => $target['status'],
			'starts' => $target['starts_on'],
			'expires' => $target['expires_on'],
			'amount' => $target['amount_paid'],
			'notes' => $target['notes'],
			'tier' => $target['tier_slug'],
			'version' => $target['client_version'],
			'archived' => $target['archived'] ? '2026-01-01 00:00:00' : null,
		));
		$id = (int) $pdo->lastInsertId();
		foreach ($target['modules'] as $slug) {
			$module->execute(array('id' => $id, 'slug' => $slug));
		}
	}
}

/**
 * @param array<string, string> $users
 * @param array<string, string> $passwords
 * @return array{source:string,target:string,pepper:string}
 */
function writeConfigs(string $hostPart, string $sourceDb, string $targetDb, array $users, array $passwords, string $pepper): array
{
	$source = tempnam(sys_get_temp_dir(), 'qrl');
	$target = tempnam(sys_get_temp_dir(), 'qrl');
	$pepperFile = tempnam(sys_get_temp_dir(), 'qrl');
	file_put_contents($source, json_encode(array(
		'dsn' => 'mysql:' . $hostPart . ';dbname=' . $sourceDb . ';charset=utf8mb4',
		'user' => $users['src_ro'],
		'password' => $passwords['src_ro'],
		'prefix' => 'wp_',
	)));
	file_put_contents($target, json_encode(array(
		'dsn' => 'mysql:' . $hostPart . ';dbname=' . $targetDb . ';charset=utf8mb4',
		'user' => $users['dst_ro'],
		'password' => $passwords['dst_ro'],
	)));
	file_put_contents($pepperFile, $pepper . "\n");
	chmod($source, 0600);
	chmod($target, 0600);
	chmod($pepperFile, 0600);

	return array('source' => $source, 'target' => $target, 'pepper' => $pepperFile);
}

/**
 * @return array{code:int,out:string,err:string}
 */
function runAudit(string $source, string $target, string $pepper): array
{
	$proc = proc_open(
		array(PHP_BINARY, dirname(__DIR__) . '/bin/license-audit.php', 'audit'),
		array(1 => array('pipe', 'w'), 2 => array('pipe', 'w')),
		$pipes,
		null,
		array(
			'QR_AUDIT_SOURCE' => $source,
			'QR_AUDIT_TARGET' => $target,
			'QR_AUDIT_PEPPER_FILE' => $pepper,
		)
	);
	$stdout = is_resource($proc) ? stream_get_contents($pipes[1]) : '';
	$stderr = is_resource($proc) ? stream_get_contents($pipes[2]) : '';
	if (is_resource($proc)) {
		fclose($pipes[1]);
		fclose($pipes[2]);
		$code = proc_close($proc);
	} else {
		$code = 1;
	}

	return array('code' => $code, 'out' => is_string($stdout) ? $stdout : '', 'err' => is_string($stderr) ? $stderr : '');
}

/**
 * @return list<string>
 */
function grantText(PDO $pdo): array
{
	$rows = $pdo->query('SHOW GRANTS FOR CURRENT_USER()')->fetchAll();
	$lines = array();
	foreach ($rows as $row) {
		if (is_array($row)) {
			$value = reset($row);
			if (is_string($value)) {
				$lines[] = $value;
			}
		}
	}

	return $lines;
}

function connectUser(string $hostPart, string $database, string $user, string $password): PDO
{
	return new PDO('mysql:' . $hostPart . ';dbname=' . $database . ';charset=utf8mb4', $user, $password, array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false,
	));
}

/**
 * @return array{total:int,eklenebilir:int,zaten_mevcut:int,manuel_inceleme:int}
 */
function parseCounts(string $text): array
{
	$counts = array('total' => -1, 'eklenebilir' => -1, 'zaten_mevcut' => -1, 'manuel_inceleme' => -1);
	$map = array(
		'kaynak_kayit' => 'total',
		'eklenebilir' => 'eklenebilir',
		'zaten_mevcut' => 'zaten_mevcut',
		'manuel_inceleme' => 'manuel_inceleme',
	);
	foreach (explode("\n", $text) as $line) {
		$pair = explode(': ', $line, 2);
		if (count($pair) === 2 && isset($map[$pair[0]])) {
			$counts[$map[$pair[0]]] = (int) $pair[1];
		}
	}

	return $counts;
}
