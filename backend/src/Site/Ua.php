<?php
/**
 * User-Agent'tan cihaz, tarayıcı, işletim sistemi ve bot bilgisi çıkarır.
 * Bağımlılık yok; yalnızca raporlama için yaklaşık sınıflandırma yapar.
 */
declare(strict_types=1);

namespace QRLicense\Site;

final class Ua
{
	/**
	 * @return array{device:string,browser:string,os:string,bot:bool}
	 */
	public static function parse(string $ua): array
	{
		$ua = substr($ua, 0, 400);
		if ($ua === '' || preg_match('/bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|curl|wget|python-requests|httpclient|monitor|uptime/i', $ua) === 1) {
			return array('device' => '', 'browser' => '', 'os' => '', 'bot' => true);
		}

		$os = 'Diğer';
		foreach (array(
			'/Windows NT/i' => 'Windows',
			'/iPhone|iPad|iPod/i' => 'iOS',
			'/Android/i' => 'Android',
			'/Mac OS X|Macintosh/i' => 'macOS',
			'/CrOS/i' => 'ChromeOS',
			'/Linux/i' => 'Linux',
		) as $pattern => $name) {
			if (preg_match($pattern, $ua) === 1) {
				$os = $name;
				break;
			}
		}

		$browser = 'Diğer';
		foreach (array(
			'/Edg(e|A|iOS)?\//' => 'Edge',
			'/OPR\/|Opera/' => 'Opera',
			'/SamsungBrowser/' => 'Samsung Internet',
			'/Firefox\/|FxiOS/' => 'Firefox',
			'/CriOS\/|Chrome\//' => 'Chrome',
			'/Safari\//' => 'Safari',
		) as $pattern => $name) {
			if (preg_match($pattern, $ua) === 1) {
				$browser = $name;
				break;
			}
		}

		$device = 'masaüstü';
		if (preg_match('/iPad|Tablet|PlayBook|Silk/i', $ua) === 1 || (preg_match('/Android/i', $ua) === 1 && preg_match('/Mobile/i', $ua) !== 1)) {
			$device = 'tablet';
		} elseif (preg_match('/Mobi|iPhone|iPod|Android/i', $ua) === 1) {
			$device = 'mobil';
		}

		return array('device' => $device, 'browser' => $browser, 'os' => $os, 'bot' => false);
	}
}
