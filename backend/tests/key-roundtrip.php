<?php
/**
 * Sentetik API anahtarı şifreleme turu.
 * Üretim yapılandırması, üretim lisansı ve veritabanı kullanmaz.
 * Çıktı anahtar, şifreli gövde ve yapılandırma değeri basmaz.
 */
declare(strict_types=1);

use QRLicense\License\Keys;

require_once dirname(__DIR__) . '/src/License/Keys.php';

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

function syntheticKey(): string
{
	return bin2hex(random_bytes(32));
}

function messageHides(Throwable $error, string ...$secrets): bool
{
	$text = $error->getMessage();
	foreach ($secrets as $secret) {
		if ($secret !== '' && str_contains($text, $secret)) {
			return false;
		}
	}

	return $text === 'Şifreli anahtar okunamadı.' || $text === 'Şifreleme anahtarı ayarı geçersiz.' || $text === 'Anahtar pepper ayarı geçersiz.';
}

function refused(Keys $keys, string $payload, string ...$secrets): bool
{
	try {
		$keys->decrypt($payload);
	} catch (RuntimeException $error) {
		return messageHides($error, $payload, bin2hex($payload), ...$secrets);
	} catch (Throwable $error) {
		return false;
	}

	return false;
}

$pepper = bin2hex(random_bytes(24));
$key = syntheticKey();
$otherKey = syntheticKey();
$plain = 'sentetik-' . bin2hex(random_bytes(8));
$keys = new Keys($pepper, $key);
$other = new Keys($pepper, $otherKey);

$sealed = $keys->encrypt($plain);
$again = $keys->encrypt($plain);
check('sentetik tur açılır', $keys->decrypt($sealed) === $plain && strlen($sealed) === 28 + strlen($plain));
check('aynı düz metin yeni gövde üretir', $sealed !== $again && $keys->decrypt($again) === $plain);
check('kenar boşluğu korunur', $keys->decrypt($keys->encrypt(' kenar ')) === ' kenar ');

$wrong = false;
try {
	$other->decrypt($sealed);
} catch (RuntimeException $error) {
	$wrong = messageHides($error, $plain, $key, $otherKey, $sealed, bin2hex($sealed));
}
check('yanlış anahtar açmaz', $wrong);

check('boş gövde reddedilir', refused($keys, '', $plain, $key));
check('kısa gövde reddedilir', refused($keys, random_bytes(28), $plain, $key));
check('kesik gövde reddedilir', refused($keys, substr($sealed, 0, -1), $plain, $key));
check('uzatılmış gövde reddedilir', refused($keys, $sealed . "\x00", $plain, $key));

$flipCipher = $sealed;
$flipCipher[strlen($flipCipher) - 1] = chr(ord($flipCipher[strlen($flipCipher) - 1]) ^ 0x01);
check('gövde biti reddedilir', refused($keys, $flipCipher, $plain, $key));

$flipTag = $sealed;
$flipTag[12] = chr(ord($flipTag[12]) ^ 0x01);
check('etiket biti reddedilir', refused($keys, $flipTag, $plain, $key));

$flipIv = $sealed;
$flipIv[0] = chr(ord($flipIv[0]) ^ 0x01);
check('iv biti reddedilir', refused($keys, $flipIv, $plain, $key));

$emptySealed = $keys->encrypt('');
check('boş düz metin eksik sayılır', strlen($emptySealed) === 28 && refused($keys, $emptySealed, $key));

$badKey = false;
try {
	new Keys($pepper, 'kisa');
} catch (RuntimeException $error) {
	$badKey = messageHides($error, 'kisa', $pepper, $key);
}
check('kısa şifreleme anahtarı reddedilir', $badKey);

$badPepper = false;
try {
	new Keys('kisa', $key);
} catch (RuntimeException $error) {
	$badPepper = messageHides($error, 'kisa', $key, $pepper);
}
check('kısa pepper reddedilir', $badPepper);

fwrite(STDOUT, "\n{$checks} kontrol, {$failures} hata\n");
exit($failures === 0 ? 0 : 1);
