<?php
/**
 * İstek adresi ve HTTPS kararı.
 * X-Forwarded-For hiç okunmaz.
 * X-Forwarded-Proto yalnızca güvenilen vekil listesindeki doğrudan eşten kabul edilir.
 */
declare(strict_types=1);

namespace QRLicense\Http;

final class RequestContext
{
	/**
	 * @param array<string, mixed> $server
	 * @param array<int, string> $trustedProxies
	 */
	public static function isHttps(array $server, array $trustedProxies): bool
	{
		$https = isset($server['HTTPS']) ? (string) $server['HTTPS'] : '';
		if ($https === 'on' || $https === '1') {
			return true;
		}

		$remote = isset($server['REMOTE_ADDR']) ? (string) $server['REMOTE_ADDR'] : '';
		if ($remote === '' || !in_array($remote, $trustedProxies, true)) {
			return false;
		}

		$proto = isset($server['HTTP_X_FORWARDED_PROTO']) ? strtolower((string) $server['HTTP_X_FORWARDED_PROTO']) : '';
		$first = trim(explode(',', $proto)[0]);

		return $first === 'https';
	}

	/**
	 * Hız sınırı, doğrudan bağlantı adresini kullanır.
	 *
	 * @param array<string, mixed> $server
	 */
	public static function clientIp(array $server): string
	{
		return isset($server['REMOTE_ADDR']) ? (string) $server['REMOTE_ADDR'] : '';
	}
}
