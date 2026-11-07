<?php
/**
 * İstek adresi ve HTTPS kararı.
 * X-Forwarded-For hiç okunmaz; gerçek IP başlığı yalnızca yapılandırılırsa ve güvenilen vekilden okunur.
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
	 * Hız sınırı için istemci adresi. Varsayılan: doğrudan bağlantı adresi (REMOTE_ADDR).
	 * Site Cloudflare vb. arkasındaysa tüm kullanıcılar tek uç adresi gibi görünür; bu durumda
	 * config'te trusted_proxies (vekil adresleri) ve real_ip_header (örn. HTTP_CF_CONNECTING_IP) verilir.
	 * Başlık YALNIZCA doğrudan eş güvenilen vekilse okunur; aksi halde istemci başlığı sahteleyebilir.
	 *
	 * @param array<string, mixed> $server
	 * @param array<int, string> $trustedProxies
	 */
	public static function clientIp(array $server, array $trustedProxies = array(), string $realIpHeader = ''): string
	{
		$remote = isset($server['REMOTE_ADDR']) ? (string) $server['REMOTE_ADDR'] : '';
		if ($realIpHeader !== '' && $remote !== '' && in_array($remote, $trustedProxies, true) && preg_match('/^HTTP_[A-Z0-9_]{1,40}$/', $realIpHeader) === 1) {
			$forwarded = isset($server[$realIpHeader]) ? trim(explode(',', (string) $server[$realIpHeader])[0]) : '';
			if ($forwarded !== '' && filter_var($forwarded, FILTER_VALIDATE_IP) !== false) {
				return $forwarded;
			}
		}

		return $remote;
	}
}
