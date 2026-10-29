<?php
/**
 * Yayın ön kontrolünün sentetik sınaması.
 * Üretim yapılandırmasını ve uzak veritabanını açmaz.
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/bin/release-preflight.php';

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

function runPreflight(array $env, array $args): array
{
	$command = array_merge(array(PHP_BINARY, dirname(__DIR__) . '/bin/release-preflight.php'), $args);
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

function tempConfig(string $json): string
{
	$path = tempnam(sys_get_temp_dir(), 'qrl-preflight-');
	if (!is_string($path)) {
		throw new RuntimeException('temp');
	}
	file_put_contents($path, $json);
	chmod($path, 0600);

	return $path;
}

$secret = 'PREFLIGHT-GIZLI-' . str_repeat('Z', 24);
$pepper = 'PEPPER-GIZLI-' . str_repeat('p', 24);

$self = runPreflight(array('QR_LICENSE_CONFIG' => '/tmp/yok'), array('self-test'));
check('öz sınama başarılı', $self['code'] === 0 && str_contains($self['out'], "self_test: tamam\n") && str_contains($self['out'], "web_kok: backend/public\n") && str_contains($self['out'], "https_zorunlu: evet\n") && str_contains($self['out'], 'web_paket: ' . count(PREFLIGHT_WEB) . "\n") && str_contains($self['out'], 'cevrimdisi_paket: ' . count(PREFLIGHT_OFFLINE) . "\n") && str_contains($self['out'], 'paket_dosya: ' . count(preflightKnownFiles()) . "\n"));
check('web ve çevrimdışı paket ayrık', array_intersect(PREFLIGHT_WEB, PREFLIGHT_OFFLINE) === array() && count(PREFLIGHT_WEB) === 12 && count(PREFLIGHT_OFFLINE) === 4);
check('öz sınama sır basmaz', !str_contains($self['out'] . $self['err'], $secret) && !str_contains($self['out'] . $self['err'], $pepper) && $self['err'] === '');

$remotePath = tempConfig(json_encode(array(
	'dsn' => 'mysql:host=qrmenuofficial.com;dbname=qr_license',
	'user' => 'app',
	'password' => $secret,
	'require_https' => true,
	'key_pepper' => $pepper,
)));
$remote = runPreflight(array('QR_PREFLIGHT_CONFIG' => $remotePath, 'QR_LICENSE_CONFIG' => $remotePath), array('local'));
check('uzak hedef reddedilir', $remote['code'] === 2 && $remote['out'] === "hata_sinifi: yerel_degil\n");
check('uzak rette sır yok', !str_contains($remote['out'] . $remote['err'], $secret) && !str_contains($remote['out'] . $remote['err'], $pepper) && !str_contains($remote['out'], 'qrmenuofficial.com'));

$httpPath = tempConfig(json_encode(array(
	'dsn' => 'mysql:host=127.0.0.1;port=1;dbname=qr_license',
	'user' => 'app',
	'password' => $secret,
	'require_https' => false,
)));
$http = runPreflight(array('QR_PREFLIGHT_CONFIG' => $httpPath), array('local'));
check('https kapalı reddedilir', $http['code'] === 2 && $http['out'] === "hata_sinifi: https\n" && !str_contains($http['out'] . $http['err'], $secret));

$closedPath = tempConfig(json_encode(array(
	'dsn' => 'mysql:host=127.0.0.1;port=1;dbname=qr_license;connect_timeout=1',
	'user' => 'app',
	'password' => $secret,
	'require_https' => true,
)));
$closed = runPreflight(array('QR_PREFLIGHT_CONFIG' => $closedPath), array('local'));
check('yerel bağlantı hatası sır basmaz', $closed['code'] === 2 && $closed['out'] === "hata_sinifi: baglanti\n" && !str_contains($closed['out'] . $closed['err'], $secret));

$open = tempConfig('{"dsn":"mysql:host=127.0.0.1;dbname=qr_license","user":"app","password":"' . $secret . '"}');
chmod($open, 0644);
$loose = runPreflight(array('QR_PREFLIGHT_CONFIG' => $open), array('local'));
check('herkese açık yapılandırma reddedilir', $loose['code'] === 2 && $loose['out'] === "hata_sinifi: izin\n" && !str_contains($loose['out'] . $loose['err'], $secret));

$inside = dirname(__DIR__) . '/preflight-local.json';
file_put_contents($inside, '{"dsn":"mysql:host=127.0.0.1;dbname=qr_license","user":"app","password":"' . $secret . '"}');
chmod($inside, 0600);
$insideRun = runPreflight(array('QR_PREFLIGHT_CONFIG' => $inside), array('local'));
check('depo içi yapılandırma reddedilir', $insideRun['code'] === 2 && $insideRun['out'] === "hata_sinifi: yol\n" && !str_contains($insideRun['out'] . $insideRun['err'], $secret));
unlink($inside);

$missing = runPreflight(array(), array('local'));
check('ayar yolu zorunlu', $missing['code'] === 2 && $missing['out'] === "hata_sinifi: ortam\n");

$refused = runPreflight(array(), array('audit'));
check('bilinmeyen kip reddedilir', $refused['code'] === 2 && $refused['out'] === "hata_sinifi: komut\n");

$good = array(
	"GRANT USAGE ON *.* TO 'app'@'localhost' IDENTIFIED BY PASSWORD '*ABC'",
	"GRANT SELECT, INSERT, UPDATE, DELETE ON `qr_license`.* TO 'app'@'localhost'",
);
$broad = array("GRANT ALL PRIVILEGES ON *.* TO 'app'@'localhost' WITH GRANT OPTION");
$readOnly = array("GRANT SELECT ON `qr_license`.* TO 'app'@'localhost'");
check('uygulama yetkisi yeterli', preflightAppGrants($good, 'qr_license'));
check('geniş yetki reddedilir', !preflightAppGrants($broad, 'qr_license'));
check('salt okuma yetersiz', !preflightAppGrants($readOnly, 'qr_license'));
check('örnek yapılandırma boş', preflightExampleIsEmpty(preflightRepoRoot()));
check('paket listesi temiz', preflightPackageProblems(preflightRepoRoot()) === array());
check(
	'dağıtım belgesi paket dışı',
	in_array('backend/DEPLOY_TEST.md', PREFLIGHT_EXCLUDE, true)
		&& !in_array('backend/DEPLOY_TEST.md', PREFLIGHT_WEB, true)
		&& !in_array('backend/deploy/cpanel-front.php', PREFLIGHT_WEB, true)
		&& preflightExcluded('backend/deploy/cpanel-front.php')
);
check('https örneği zorunlu', preflightHttpsRequired(array('require_https' => true)) && !preflightHttpsRequired(array('require_https' => false)));

unlink($remotePath);
unlink($httpPath);
unlink($closedPath);
unlink($open);

fwrite(STDOUT, "\n{$checks} kontrol, {$failures} hata\n");
exit($failures === 0 ? 0 : 1);
