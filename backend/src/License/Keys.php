<?php
/**
 * API anahtarı üretimi, arama HMAC'i ve geri açılabilir şifreleme.
 * Doğrulama yalnızca HMAC ile arar. Düz anahtar loglanmaz.
 */
declare(strict_types=1);

namespace QRLicense\License;

use RuntimeException;

final class Keys
{
	private string $pepper;

	private string $encryptionKey;

	public function __construct(string $pepper, string $encryptionKey)
	{
		if (strlen($pepper) < 32) {
			throw new RuntimeException('Anahtar pepper ayarı geçersiz.');
		}

		$decoded = self::decodeKey($encryptionKey);
		if ($decoded === null) {
			throw new RuntimeException('Şifreleme anahtarı ayarı geçersiz.');
		}

		$this->pepper = $pepper;
		$this->encryptionKey = $decoded;
	}

	public function generate(): string
	{
		return bin2hex(random_bytes(20));
	}

	public function hmac(string $apiKey): string
	{
		return hash_hmac('sha256', $apiKey, $this->pepper);
	}

	public function encrypt(string $apiKey): string
	{
		$iv = random_bytes(12);
		$tag = '';
		$cipher = openssl_encrypt($apiKey, 'aes-256-gcm', $this->encryptionKey, OPENSSL_RAW_DATA, $iv, $tag);
		if ($cipher === false || strlen($tag) !== 16) {
			throw new RuntimeException('Anahtar şifrelenemedi.');
		}

		return $iv . $tag . $cipher;
	}

	public function decrypt(string $payload): string
	{
		if (strlen($payload) < 29) {
			throw new RuntimeException('Şifreli anahtar okunamadı.');
		}

		$iv = substr($payload, 0, 12);
		$tag = substr($payload, 12, 16);
		$cipher = substr($payload, 28);
		$plain = openssl_decrypt($cipher, 'aes-256-gcm', $this->encryptionKey, OPENSSL_RAW_DATA, $iv, $tag);
		if ($plain === false) {
			throw new RuntimeException('Şifreli anahtar okunamadı.');
		}

		return $plain;
	}

	private static function decodeKey(string $encoded): ?string
	{
		$encoded = trim($encoded);
		if (preg_match('/^[a-fA-F0-9]{64}$/', $encoded) === 1) {
			$raw = hex2bin($encoded);
			return $raw === false ? null : $raw;
		}

		return null;
	}
}
