<?php
/**
 * Salt okunur aktarım denetiminin sentetik testleri.
 * Gerçek veritabanına bağlanmaz.
 */
declare(strict_types=1);

use QRLicense\License\Keys;
use QRLicense\License\TransferAudit;
use QRLicense\License\Validator;

require_once dirname(__DIR__) . '/src/License/Keys.php';
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

$audit = new TransferAudit();
$pepper = str_repeat('p', 32);
$otherKey = str_repeat('ab', 32);

function one(TransferAudit $audit, array $post, array $targets, string $pepper): array
{
	return $audit->classify(array($post), $targets, $pepper);
}

function targetFor(string $key, string $pepper, array $overrides = array()): array
{
	$base = array(
		'hmac' => hash_hmac('sha256', $key, $pepper),
		'company_name' => 'Firma',
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
	);
	foreach ($overrides as $name => $value) {
		if ($name === 'title') {
			$base['company_name'] = $value;
		}
		if ($name === 'durum') {
			$base['status'] = $value;
		}
	}

	return $base;
}

$active = one($audit, TransferAudit::cleanPost('aktif-anahtar'), array(), $pepper);
check('geçerli aktif eklenebilir', $active['eklenebilir'] === 1 && $active['manuel_inceleme'] === 0 && $active['total'] === 1);

$passive = one($audit, TransferAudit::cleanPost('pasif-anahtar', array('durum' => 'pasif')), array(), $pepper);
check('geçerli pasif eklenebilir', $passive['eklenebilir'] === 1 && $passive['neden']['status'] === 0);

$open = one($audit, TransferAudit::cleanPost('sure-anahtar', array('expires_at' => '')), array(), $pepper);
check('süresiz lisans eklenebilir', $open['eklenebilir'] === 1);

$expired = one($audit, TransferAudit::cleanPost('dolmus-anahtar', array('expires_at' => '2020-01-01')), array(), $pepper);
check('süresi dolmuş lisans sayılır', $expired['eklenebilir'] === 1 && $expired['neden']['invalid_date'] === 0);

$missingStatus = one($audit, TransferAudit::cleanPost('durum-yok', array('durum' => null)), array(), $pepper);
check('eksik durum manuel', $missingStatus['manuel_inceleme'] === 1 && $missingStatus['neden']['status'] === 1 && $missingStatus['eklenebilir'] === 0);

$unknownStatus = one($audit, TransferAudit::cleanPost('durum-yanlis', array('durum' => 'active')), array(), $pepper);
check('bilinmeyen durum manuel', $unknownStatus['neden']['status'] === 1 && $unknownStatus['eklenebilir'] === 0);

foreach (array('publish' => 'eklenebilir', 'draft' => 'manuel_inceleme', 'trash' => 'manuel_inceleme') as $postStatus => $bucket) {
	$result = one($audit, TransferAudit::cleanPost('durum-' . $postStatus, array('post_status' => $postStatus)), array(), $pepper);
	check('yazı durumu ' . $postStatus, $result[$bucket] === 1 && ($postStatus === 'publish' || $result['neden']['post_status'] === 1));
}

$emptyDomain = one($audit, TransferAudit::cleanPost('bos-domain', array('domain' => '')), array(), $pepper);
$absentDomain = one($audit, TransferAudit::cleanPost('yok-domain', array('domain' => null)), array(), $pepper);
check('boş domain metası eklenebilir', $emptyDomain['eklenebilir'] === 1 && $emptyDomain['neden']['domain_meta_missing'] === 0);
check('olmayan domain metası manuel', $absentDomain['manuel_inceleme'] === 1 && $absentDomain['neden']['domain_meta_missing'] === 1 && $absentDomain['eklenebilir'] === 0);

$badDate = one($audit, TransferAudit::cleanPost('tarih', array('expires_at' => '2026-02-31')), array(), $pepper);
check('geçersiz tarih manuel', $badDate['neden']['invalid_date'] === 1 && $badDate['eklenebilir'] === 0);

$unknownModule = one($audit, TransferAudit::cleanPost('modul', array('modules' => array('qr-masa', 'sahte-modul'))), array(), $pepper);
check('bilinmeyen modül atılmaz', $unknownModule['neden']['modules'] === 1 && $unknownModule['eklenebilir'] === 0);

$duplicateModule = one($audit, TransferAudit::cleanPost('modul-cift', array('modules' => array('qr-masa', 'qr-masa'))), array(), $pepper);
check('yinelenen bilinen modül bir kez sayılır', $duplicateModule['eklenebilir'] === 1 && $duplicateModule['neden']['modules'] === 0);

$missingKey = one($audit, TransferAudit::cleanPost('bos', array('api_key' => null)), array(), $pepper);
check('eksik anahtar manuel', $missingKey['neden']['source_key'] === 1 && $missingKey['eklenebilir'] === 0);

$emptyKey = one($audit, TransferAudit::cleanPost('dolu', array('api_key' => '')), array(), $pepper);
check('boş anahtar manuel', $emptyKey['neden']['source_key'] === 1 && $emptyKey['eklenebilir'] === 0 && $emptyKey['manuel_inceleme'] === 1 && $emptyKey['zaten_mevcut'] === 0);

$duplicate = $audit->classify(array(
	TransferAudit::cleanPost('aynı'),
	TransferAudit::cleanPost('aynı'),
), array(), $pepper);
check('yinelenen kaynak anahtarı grubu manuel', $duplicate['manuel_inceleme'] === 2 && $duplicate['neden']['source_key'] === 2 && $duplicate['eklenebilir'] === 0);

$sameTarget = targetFor('hedef-anahtar', $pepper);
$same = one($audit, TransferAudit::cleanPost('hedef-anahtar'), array($sameTarget), $pepper);
check('aynı HMAC ve aynı alanlar mevcut', $same['zaten_mevcut'] === 1 && $same['eklenebilir'] === 0 && $same['neden']['target_hmac_mismatch'] === 0);

$different = $sameTarget;
$different['company_name'] = 'Baska Firma';
$changed = one($audit, TransferAudit::cleanPost('hedef-anahtar'), array($different), $pepper);
check('aynı HMAC farklı alan manuel', $changed['manuel_inceleme'] === 1 && $changed['neden']['target_hmac_mismatch'] === 1 && $changed['zaten_mevcut'] === 0);

$archived = $sameTarget;
$archived['archived'] = true;
$archivedResult = one($audit, TransferAudit::cleanPost('hedef-anahtar'), array($archived), $pepper);
check('arşivli HMAC üzerine yazılmaz', $archivedResult['neden']['target_hmac_mismatch'] === 1 && $archivedResult['zaten_mevcut'] === 0);

$tiered = $sameTarget;
$tiered['tier_slug'] = 'pro';
$tierResult = one($audit, TransferAudit::cleanPost('hedef-anahtar'), array($tiered), $pepper);
check('dolu paket alanı aynı kayıt sayılmaz', $tierResult['neden']['target_hmac_mismatch'] === 1);

$identicalDup = targetFor('ayni-cift', $pepper);
$identical = one($audit, TransferAudit::cleanPost('ayni-cift'), array($identicalDup, $identicalDup), $pepper);
check('aynı alanlı yinelenen HMAC mevcut sayılmaz', $identical['manuel_inceleme'] === 1 && $identical['zaten_mevcut'] === 0 && $identical['eklenebilir'] === 0 && $identical['neden']['target_hmac_duplicate'] === 1 && $identical['neden']['target_hmac_mismatch'] === 0);

$firstDup = targetFor('cift-hedef', $pepper);
$lastDup = targetFor('cift-hedef', $pepper);
$lastDup['company_name'] = 'Son Satir';
$duplicateTarget = $audit->classify(array(
	TransferAudit::cleanPost('cift-hedef'),
	TransferAudit::cleanPost('baska-anahtar'),
), array($firstDup, $lastDup), $pepper);
check('yinelenen hedef HMAC son satırı seçmez', $duplicateTarget['manuel_inceleme'] === 1 && $duplicateTarget['eklenebilir'] === 1 && $duplicateTarget['zaten_mevcut'] === 0 && $duplicateTarget['neden']['target_hmac_duplicate'] === 1 && $duplicateTarget['total'] === 2);

$winner = targetFor('son-kazanir', $pepper);
$loser = targetFor('son-kazanir', $pepper);
$loser['company_name'] = 'Ilk Satir';
$lastWouldWin = one($audit, TransferAudit::cleanPost('son-kazanir'), array($loser, $winner), $pepper);
check('eşleşen son satır mevcut sayılmaz', $lastWouldWin['zaten_mevcut'] === 0 && $lastWouldWin['manuel_inceleme'] === 1 && $lastWouldWin['neden']['target_hmac_duplicate'] === 1);

$middle = targetFor('uc-satir', $pepper);
$middle['company_name'] = 'Orta Satir';
$end = targetFor('uc-satir', $pepper);
$end['notes'] = 'ucuncu';
$three = $audit->classify(array(
	TransferAudit::cleanPost('uc-satir'),
	TransferAudit::cleanPost('yan-kaynak'),
), array(targetFor('uc-satir', $pepper), $middle, $end), $pepper);
check('üçlü HMAC hiçbir satırı seçmez', $three['neden']['target_hmac_duplicate'] === 1 && $three['neden']['target_hmac_mismatch'] === 0 && $three['zaten_mevcut'] === 0 && $three['eklenebilir'] === 1 && $three['manuel_inceleme'] === 1 && $three['eklenebilir'] + $three['zaten_mevcut'] + $three['manuel_inceleme'] === $three['total']);

$alone = one($audit, TransferAudit::cleanPost('kaynak-anahtar'), array(), $pepper);
$orphan = targetFor('hedefte-kalan', $pepper);
$orphanCopy = targetFor('hedefte-kalan', $pepper);
$orphanCopy['company_name'] = 'Diger Hedef';
$withOrphans = one($audit, TransferAudit::cleanPost('kaynak-anahtar'), array($orphan, $orphanCopy, targetFor('baska-hedef', $pepper)), $pepper);
check('karşılıksız hedef kaynak kararını değiştirmez', $withOrphans === $alone && $alone['eklenebilir'] === 1 && $alone['zaten_mevcut'] === 0 && $alone['manuel_inceleme'] === 0);

$spaces = one($audit, TransferAudit::cleanPost('   '), array(), $pepper);
$tabs = one($audit, TransferAudit::cleanPost("\t\n"), array(), $pepper);
check('boşluk anahtarı manuel', $spaces['neden']['source_key'] === 1 && $spaces['eklenebilir'] === 0 && $spaces['zaten_mevcut'] === 0);
check('beyaz boşluk anahtarı manuel', $tabs['neden']['source_key'] === 1 && $tabs['eklenebilir'] === 0);

$spaceTarget = targetFor('   ', $pepper);
$spaceMatch = one($audit, TransferAudit::cleanPost('   '), array($spaceTarget), $pepper);
check('boşluk anahtarı hedefte mevcut sayılmaz', $spaceMatch['zaten_mevcut'] === 0 && $spaceMatch['neden']['source_key'] === 1 && $spaceMatch['neden']['target_hmac_mismatch'] === 0 && $spaceMatch['neden']['target_hmac_duplicate'] === 0);

$paddedKey = one($audit, TransferAudit::cleanPost(' ab '), array(), $pepper);
check('anahtar kırpılmaz', $paddedKey['eklenebilir'] === 1 && $paddedKey['neden']['source_key'] === 0);

$leadKey = one($audit, TransferAudit::cleanPost(' kenar'), array(), $pepper);
$trailKey = one($audit, TransferAudit::cleanPost('kenar '), array(targetFor('kenar', $pepper)), $pepper);
check('kenar boşluklu anahtar kırpılmaz', $leadKey['eklenebilir'] === 1 && $leadKey['neden']['source_key'] === 0 && $trailKey['eklenebilir'] === 1 && $trailKey['zaten_mevcut'] === 0 && $trailKey['neden']['target_hmac_mismatch'] === 0);

$validKey = one($audit, TransferAudit::cleanPost('k'), array(), $pepper);
check('kısa anahtar biçim zorlamaz', $validKey['eklenebilir'] === 1 && $validKey['manuel_inceleme'] === 0 && $validKey['neden']['source_key'] === 0);

$brokenKey = "anahtar\xFF";
$brokenAlone = one($audit, TransferAudit::cleanPost($brokenKey), array(), $pepper);
$paired = $audit->classify(array(
	TransferAudit::cleanPost('anahtar'),
	TransferAudit::cleanPost($brokenKey),
), array(), $pepper);
$converted = targetFor("anahtar\u{FFFD}", $pepper);
$converted['company_name'] = 'Donusmus';
$notConverted = one($audit, TransferAudit::cleanPost($brokenKey), array($converted), $pepper);
check('geçersiz UTF-8 anahtar manuel', $brokenAlone['manuel_inceleme'] === 1 && $brokenAlone['neden']['source_key'] === 1 && $brokenAlone['eklenebilir'] === 0 && $brokenAlone['zaten_mevcut'] === 0);
check('geçersiz UTF-8 geçerli anahtarla birleşmez', $paired['eklenebilir'] === 1 && $paired['manuel_inceleme'] === 1 && $paired['neden']['source_key'] === 1 && $paired['total'] === 2);
check('geçersiz UTF-8 yeniden kodlanmaz', $notConverted['neden']['source_key'] === 1 && $notConverted['neden']['target_hmac_mismatch'] === 0 && $notConverted['zaten_mevcut'] === 0 && $notConverted['eklenebilir'] === 0);

$blankVersion = one($audit, TransferAudit::cleanPost('surum-bosluk', array('client_version' => '   ')), array(), $pepper);
$edgeVersion = one($audit, TransferAudit::cleanPost('surum-kenar', array('client_version' => '1.0.0 ')), array(), $pepper);
$innerVersion = one($audit, TransferAudit::cleanPost('surum-ara', array('client_version' => '1.0 beta')), array(), $pepper);
$emptyVersion = one($audit, TransferAudit::cleanPost('surum-bos', array('client_version' => '')), array(), $pepper);
check('boşluk sürüm kesilmez', $blankVersion['neden']['field_length'] === 1 && $blankVersion['eklenebilir'] === 0);
check('kenar boşluklu sürüm kesilmez', $edgeVersion['neden']['field_length'] === 1 && $edgeVersion['eklenebilir'] === 0);
check('ara boşluklu sürüm korunur', $innerVersion['eklenebilir'] === 1 && $innerVersion['neden']['field_length'] === 0);
check('boş sürüm aday kalır', $emptyVersion['eklenebilir'] === 1 && $emptyVersion['neden']['field_length'] === 0);

$longTitle = one($audit, TransferAudit::cleanPost('uzun', array('title' => str_repeat('A', 192))), array(), $pepper);
$longAmount = one($audit, TransferAudit::cleanPost('uzun', array('amount_paid' => str_repeat('9', 65))), array(), $pepper);
$longNotes = one($audit, TransferAudit::cleanPost('uzun', array('notlar' => str_repeat('n', 4001))), array(), $pepper);
$longVersion = one($audit, TransferAudit::cleanPost('uzun', array('client_version' => str_repeat('v', 33))), array(), $pepper);
check('alan uzunlukları manuel', $longTitle['neden']['field_length'] === 1 && $longAmount['neden']['field_length'] === 1 && $longNotes['neden']['field_length'] === 1 && $longVersion['neden']['field_length'] === 1);

$controlVersion = one($audit, TransferAudit::cleanPost('kontrol', array('client_version' => "1.0.0\r\n")), array(), $pepper);
check('denetim karakterli sürüm manuel', $controlVersion['neden']['field_length'] === 1 && $controlVersion['eklenebilir'] === 0 && $controlVersion['manuel_inceleme'] === 1);

$mixed = one($audit, TransferAudit::cleanPost('karisik', array('post_status' => 'trash', 'expires_at' => '2026-02-31')), array(), $pepper);
check('birden fazla neden tek kayıt', $mixed['manuel_inceleme'] === 1 && $mixed['total'] === 1 && $mixed['neden']['post_status'] === 1 && $mixed['neden']['invalid_date'] === 1);

$order = one($audit, TransferAudit::cleanPost('sira', array('start_date' => '2026-05-02', 'expires_at' => '2026-05-01')), array(), $pepper);
check('başlangıç bitişten sonra', $order['neden']['date_order'] === 1 && $order['neden']['invalid_date'] === 0);

$demo = TransferAudit::demonstration();
$first = $audit->classify($demo['posts'], $demo['targets'], $demo['pepper']);
$second = $audit->classify($demo['posts'], $demo['targets'], $demo['pepper']);
check('gösterim tekrarında aynı sayaç', $first === $second);
check('gösterim toplamı kayıt sayısına eşit', $first['eklenebilir'] + $first['zaten_mevcut'] + $first['manuel_inceleme'] === $first['total'] && $first['total'] === 24);
check('gösterim sayaçları', $first['eklenebilir'] === 4 && $first['zaten_mevcut'] === 1 && $first['manuel_inceleme'] === 19 && $first['neden']['field_length'] === 4 && $first['neden']['domain_meta_missing'] === 1 && $first['neden']['domain_normalize'] === 1);

$keys = new Keys($pepper, $otherKey);
$other = new Keys($pepper, str_repeat('0', 64));
check('HMAC şifreleme anahtarından bağımsız', hash_equals($keys->hmac('ornek-anahtar'), $other->hmac('ornek-anahtar')));

$sealed = $keys->encrypt('ornek-anahtar');
check('sentetik şifre açılır', $keys->decrypt($sealed) === 'ornek-anahtar' && $sealed !== 'ornek-anahtar');
$wrongKey = false;
try {
	$other->decrypt($sealed);
} catch (RuntimeException $e) {
	$wrongKey = $e->getMessage() !== '';
}
check('yanlış şifreleme anahtarı açmaz', $wrongKey);
check('mevcut sonuç şifre çözümünden bağımsız', $same['zaten_mevcut'] === 1 && $wrongKey);

check('eski ve yeni domain aynı', TransferAudit::legacyNormalizeDomain('https://www.Example.com/yol') === 'example.com' && Validator::normalizeDomain('https://www.Example.com/yol') === 'example.com');
check('portlu domain aynı', TransferAudit::legacyNormalizeDomain('www.Site.com:8080') === 'site.com' && Validator::normalizeDomain('www.Site.com:8080') === 'site.com');
check('yüzde kodlu domain ayrılır', TransferAudit::legacyNormalizeDomain('bad%20host') !== Validator::normalizeDomain('bad%20host'));

check('SELECT yetkisi yeterli', TransferAudit::grantsAreReadOnly(array(
	"GRANT USAGE ON *.* TO 'ro'@'localhost'",
	"GRANT SELECT ON `wordpress`.* TO 'ro'@'localhost'",
), 'wordpress', array('wp_posts', 'wp_postmeta')));
check('yazma yetkisi reddedilir', !TransferAudit::grantsAreReadOnly(array(
	"GRANT SELECT, INSERT ON `wordpress`.* TO 'ro'@'localhost'",
), 'wordpress', array('wp_posts', 'wp_postmeta')));
check('genel ALL reddedilir', !TransferAudit::grantsAreReadOnly(array(
	'GRANT ALL PRIVILEGES ON *.* TO `ro`@`localhost`',
), 'wordpress', array('wp_posts', 'wp_postmeta')));
check('boş yetki güvenli sayılmaz', !TransferAudit::grantsAreReadOnly(array(), 'wordpress', array('wp_posts', 'wp_postmeta')));
check('başka veritabanının SELECT yetkisi yetmez', !TransferAudit::grantsAreReadOnly(array(
	'GRANT SELECT ON `baska`.* TO `ro`@`localhost`',
), 'wordpress', array('wp_posts', 'wp_postmeta')));
check('okunamayan yetki satırı reddedilir', !TransferAudit::grantsAreReadOnly(array(
	'GRANT SELECT (ID) ON `wordpress`.`wp_posts` TO `ro`@`localhost`',
), 'wordpress', array('wp_posts', 'wp_postmeta')));
check('GRANT OPTION reddedilir', !TransferAudit::grantsAreReadOnly(array(
	"GRANT SELECT ON `wordpress`.* TO 'ro'@'localhost' WITH GRANT OPTION",
), 'wordpress', array('wp_posts', 'wp_postmeta')));
check('ilgisiz veritabanındaki yazma engel değil', TransferAudit::grantsAreReadOnly(array(
	'GRANT INSERT ON `baska`.* TO `ro`@`localhost`',
	'GRANT SELECT ON `wordpress`.* TO `ro`@`localhost`',
), 'wordpress', array('wp_posts', 'wp_postmeta')));

check('aynı veritabanı yakalanır', TransferAudit::sameDatabase('mysql:host=127.0.0.1;dbname=wp;charset=utf8mb4', 'mysql:host=localhost;port=3306;dbname=wp') === true);
check('farklı veritabanı ayrılır', TransferAudit::sameDatabase('mysql:host=127.0.0.1;dbname=wp', 'mysql:host=127.0.0.1;dbname=license') === false);
check('belirsiz DSN onaylanmaz', TransferAudit::sameDatabase('sqlite:/tmp/a.sqlite', 'mysql:host=127.0.0.1;dbname=wp') === null);

$sqlite = new PDO('sqlite::memory:');
$sqlite->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
check('anlık görüntü kurulamazsa kabul edilmez', $audit->beginReadOnly($sqlite) === false);

$text = $audit->format($first, array(
	'source_engine' => 'synthetic',
	'source_version' => '-',
	'target_engine' => 'synthetic',
	'target_version' => '-',
	'snapshot' => 'bellek',
	'grants' => 'kapsam_disi',
	'error' => '-',
));
check('çıktı saat dilimi onayını vermez', str_contains($text, 'saat_dilimi_onayi: verilmedi'));
check('çıktıda gizli gösterim değeri yok', !str_contains($text, $demo['pepper']) && !str_contains($text, 'Firma') && !str_contains($text, 'Ornek') && !str_contains($text, 'Baska') && !str_contains($text, 'k16'));

function runCli(array $env, array $args): array
{
	$command = array_merge(array(PHP_BINARY, dirname(__DIR__) . '/bin/license-audit.php'), $args);
	$proc = proc_open($command, array(1 => array('pipe', 'w'), 2 => array('pipe', 'w')), $pipes, null, $env);
	$stdout = is_resource($proc) ? stream_get_contents($pipes[1]) : '';
	$stderr = is_resource($proc) ? stream_get_contents($pipes[2]) : '';
	if (is_resource($proc)) {
		fclose($pipes[1]);
		fclose($pipes[2]);
	}
	$code = is_resource($proc) ? proc_close($proc) : 1;

	return array('code' => $code, 'out' => is_string($stdout) ? $stdout : '', 'err' => is_string($stderr) ? $stderr : '');
}

$cli = runCli(array(), array('synthetic'));
$again = runCli(array(), array('synthetic'));
check('sentetik komut başarılı', $cli['code'] === 0 && $cli['out'] === $again['out'] && $cli['err'] === '');
check('sentetik komut gösterimle aynı', str_contains($cli['out'], 'eklenebilir: 4') && str_contains($cli['out'], 'zaten_mevcut: 1') && str_contains($cli['out'], 'manuel_inceleme: 19') && str_contains($cli['out'], 'kaynak_kayit: 24'));
check('sentetik çıktıda gizli yok', !str_contains($cli['out'] . $cli['err'], $demo['pepper']) && !str_contains($cli['out'], 'Firma') && !str_contains($cli['out'], 'Ornek'));

foreach (array('import', 'apply', 'write', 'migrate') as $command) {
	$refused = runCli(array(), array($command));
	check('yazma komutu yok: ' . $command, $refused['code'] === 2 && $refused['out'] === "hata_sinifi: komut\n");
}

$secret = 'LISANSGIZLI-' . str_repeat('Z', 24);
$configLeak = tempnam(sys_get_temp_dir(), 'qrl');
file_put_contents($configLeak, "<?php return array('password' => '{$secret}');");
$missing = runCli(array('QR_LICENSE_CONFIG' => $configLeak), array('audit'));
check('üretim yapılandırması yüklenmez', $missing['code'] === 2 && $missing['out'] === "hata_sinifi: config_missing\n" && !str_contains($missing['out'] . $missing['err'], $secret));
unlink($configLeak);

$password = 'ParolaGizli999-' . str_repeat('Q', 20);
$pepperSecret = 'PEPPERGIZLI-' . str_repeat('p', 24);
$sourceFile = tempnam(sys_get_temp_dir(), 'qrl');
$targetFile = tempnam(sys_get_temp_dir(), 'qrl');
$pepperFile = tempnam(sys_get_temp_dir(), 'qrl');
$dsn = 'mysql:host=127.0.0.1;port=1;dbname=wp_audit;charset=utf8mb4;connect_timeout=1';
file_put_contents($sourceFile, json_encode(array('dsn' => $dsn, 'user' => 'ro', 'password' => $password, 'prefix' => 'wp_')));
file_put_contents($targetFile, json_encode(array('dsn' => $dsn, 'user' => 'ro', 'password' => $password)));
file_put_contents($pepperFile, $pepperSecret . "\n");
$sameDb = runCli(array(
	'QR_AUDIT_SOURCE' => $sourceFile,
	'QR_AUDIT_TARGET' => $targetFile,
	'QR_AUDIT_PEPPER_FILE' => $pepperFile,
), array('audit'));
check('aynı veritabanı reddedilir', $sameDb['code'] === 2 && $sameDb['out'] === "hata_sinifi: same_database\n");
check('ret metninde parola ve pepper yok', !str_contains($sameDb['out'] . $sameDb['err'], $password) && !str_contains($sameDb['out'] . $sameDb['err'], $pepperSecret) && !str_contains($sameDb['out'], '127.0.0.1'));

$shortPepper = tempnam(sys_get_temp_dir(), 'qrl');
file_put_contents($shortPepper, "kisa-pepper\n");
$targetOther = tempnam(sys_get_temp_dir(), 'qrl');
file_put_contents($targetOther, json_encode(array('dsn' => 'mysql:host=127.0.0.1;port=1;dbname=license_audit;connect_timeout=1', 'user' => 'ro', 'password' => $password)));
$badPepper = runCli(array(
	'QR_AUDIT_SOURCE' => $sourceFile,
	'QR_AUDIT_TARGET' => $targetOther,
	'QR_AUDIT_PEPPER_FILE' => $shortPepper,
), array('audit'));
check('kısa pepper reddedilir', $badPepper['code'] === 2 && $badPepper['out'] === "hata_sinifi: pepper_invalid\n" && !str_contains($badPepper['out'] . $badPepper['err'], 'kisa-pepper') && !str_contains($badPepper['out'] . $badPepper['err'], $password));

$report = tempnam(sys_get_temp_dir(), 'qrl');
unlink($report);
$reported = runCli(array('QR_AUDIT_REPORT' => $report), array('synthetic'));
$reportBody = is_file($report) ? (string) file_get_contents($report) : '';
check('isteğe bağlı rapor depo dışında', $reported['code'] === 0 && $reportBody === $reported['out'] && !str_contains($reportBody, 'Firma') && (fileperms($report) & 0777) === 0600);
unlink($report);

$inside = dirname(__DIR__) . '/audit-report.txt';
$insideRun = runCli(array('QR_AUDIT_REPORT' => $inside), array('synthetic'));
check('depo içi rapor reddedilir', $insideRun['code'] === 2 && $insideRun['out'] === "hata_sinifi: rapor_yolu\n" && !is_file($inside));

unlink($sourceFile);
unlink($targetFile);
unlink($pepperFile);
unlink($shortPepper);
unlink($targetOther);

fwrite(STDOUT, "\n{$checks} kontrol, {$failures} hata\n");
exit($failures === 0 ? 0 : 1);
