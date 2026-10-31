<?php
/**
 * Onaylı ziyaretçi takibi: istemci betiğinin gönderdiği olay paketlerini kaydeder.
 * Kimlik (vid/sid) istemcide üretilir; sunucu yalnızca biçimini doğrular.
 * Onay vermeyen ziyaretçinin tarayıcısı bu uca hiç istek göndermez.
 */
declare(strict_types=1);

namespace QRLicense\Site;

use PDO;

final class Collector
{
	public const MAX_BODY = 16384;

	public const MAX_EVENTS = 25;

	public const RATE_MAX = 120;

	public const RATE_WINDOW = 60;

	private const TYPES = array('pageview', 'click', 'scroll', 'engage', 'outbound');

	private PDO $pdo;

	/** @var list<string> */
	private array $hosts;

	/**
	 * @param list<string> $allowedHosts Origin kontrolü için izinli alan adları (boşsa kontrol yapılmaz).
	 */
	public function __construct(PDO $pdo, array $allowedHosts = array())
	{
		$this->pdo = $pdo;
		$this->hosts = array_map('strtolower', $allowedHosts);
	}

	/**
	 * @param array<string, mixed> $server
	 * @return array{status:int,body:string|array<string,mixed>,headers:array<string,string>}
	 */
	public function handle(string $method, string $raw, string $ip, array $server): array
	{
		$none = array('status' => 204, 'body' => '', 'headers' => array('Cache-Control' => 'no-store'));
		if (strtoupper($method) !== 'POST') {
			return array('status' => 405, 'body' => array('status' => 'method_not_allowed'), 'headers' => array('Allow' => 'POST'));
		}
		if ($raw === '' || strlen($raw) > self::MAX_BODY) {
			return array('status' => 400, 'body' => array('status' => 'error', 'error' => 'invalid_body'), 'headers' => array());
		}
		if (!$this->originAllowed($server)) {
			return $none;
		}

		$ua = Ua::parse(isset($server['HTTP_USER_AGENT']) ? (string) $server['HTTP_USER_AGENT'] : '');
		if ($ua['bot']) {
			return $none;
		}

		try {
			$data = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
		} catch (\JsonException $e) {
			return array('status' => 400, 'body' => array('status' => 'error', 'error' => 'invalid_json'), 'headers' => array());
		}
		if (!is_array($data)) {
			return array('status' => 400, 'body' => array('status' => 'error', 'error' => 'invalid_json'), 'headers' => array());
		}

		$vid = isset($data['v']) && is_string($data['v']) ? strtolower($data['v']) : '';
		$sid = isset($data['s']) && is_string($data['s']) ? strtolower($data['s']) : '';
		if (preg_match('/^[a-f0-9]{32}$/', $vid) !== 1 || preg_match('/^[a-f0-9]{32}$/', $sid) !== 1) {
			return array('status' => 400, 'body' => array('status' => 'error', 'error' => 'invalid_id'), 'headers' => array());
		}
		$events = isset($data['ev']) && is_array($data['ev']) ? array_slice(array_values($data['ev']), 0, self::MAX_EVENTS) : array();
		if ($events === array()) {
			return $none;
		}

		if ($this->limited($ip)) {
			return array('status' => 429, 'body' => array('status' => 'rate_limited'), 'headers' => array('Retry-After' => (string) self::RATE_WINDOW));
		}

		$ctx = isset($data['ctx']) && is_array($data['ctx']) ? $data['ctx'] : array();
		$country = isset($server['HTTP_CF_IPCOUNTRY']) ? strtoupper((string) $server['HTTP_CF_IPCOUNTRY']) : '';
		if (preg_match('/^[A-Z]{2}$/', $country) !== 1 || $country === 'XX' || $country === 'T1') {
			$country = '';
		}
		$packed = @inet_pton($ip);

		$now = gmdate('Y-m-d H:i:s');
		$this->pdo->beginTransaction();
		try {
			$visitorId = $this->visitor($vid, $now, $ctx, $ua, $country, $packed === false ? null : $packed);
			$session = $this->session($sid, $visitorId, $now, $ctx, $ua, $country, $packed === false ? null : $packed, $events);
			$this->events($session, $visitorId, $now, $events);
			$this->pdo->commit();
		} catch (\Throwable $e) {
			if ($this->pdo->inTransaction()) {
				$this->pdo->rollBack();
			}
			error_log('qr-collect ' . $e::class);

			return array('status' => 500, 'body' => array('status' => 'error', 'error' => 'server_error'), 'headers' => array());
		}

		return $none;
	}

	/**
	 * @param array<string, mixed> $server
	 */
	private function originAllowed(array $server): bool
	{
		if ($this->hosts === array()) {
			return true;
		}
		$origin = isset($server['HTTP_ORIGIN']) ? (string) $server['HTTP_ORIGIN'] : '';
		if ($origin === '') {
			return true;
		}
		$host = parse_url($origin, PHP_URL_HOST);

		return is_string($host) && in_array(strtolower($host), $this->hosts, true);
	}

	private function limited(string $ip): bool
	{
		$bucket = 'collect:' . hash('sha256', $ip);
		$now = gmdate('Y-m-d H:i:s');
		$reset = gmdate('Y-m-d H:i:s', time() + self::RATE_WINDOW);
		$statement = $this->pdo->prepare(
			'INSERT INTO rate_buckets (bucket, hits, reset_at) VALUES (:bucket, 1, :reset)
			 ON DUPLICATE KEY UPDATE
			   hits = IF(reset_at <= :now1, 1, hits + 1),
			   reset_at = IF(reset_at <= :now2, :reset2, reset_at)'
		);
		$statement->execute(array('bucket' => $bucket, 'reset' => $reset, 'now1' => $now, 'now2' => $now, 'reset2' => $reset));
		$hits = $this->pdo->prepare('SELECT hits FROM rate_buckets WHERE bucket = :bucket');
		$hits->execute(array('bucket' => $bucket));

		return (int) $hits->fetchColumn() > self::RATE_MAX;
	}

	/**
	 * @param array<string, mixed> $ctx
	 * @param array{device:string,browser:string,os:string,bot:bool} $ua
	 */
	private function visitor(string $vid, string $now, array $ctx, array $ua, string $country, ?string $packedIp): int
	{
		$find = $this->pdo->prepare('SELECT id FROM an_visitors WHERE vid = :vid');
		$find->execute(array('vid' => $vid));
		$id = $find->fetchColumn();
		if ($id !== false) {
			$update = $this->pdo->prepare(
				'UPDATE an_visitors SET last_seen = :now, device = :device, browser = :browser, os = :os,
				   country = COALESCE(:country, country), last_ip = COALESCE(:ip, last_ip) WHERE id = :id'
			);
			$update->bindValue(':now', $now);
			$update->bindValue(':device', $ua['device']);
			$update->bindValue(':browser', $ua['browser']);
			$update->bindValue(':os', $ua['os']);
			$update->bindValue(':country', $country === '' ? null : $country);
			$update->bindValue(':ip', $packedIp, $packedIp === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
			$update->bindValue(':id', (int) $id, PDO::PARAM_INT);
			$update->execute();

			return (int) $id;
		}

		$utm = isset($ctx['utm']) && is_array($ctx['utm']) ? $ctx['utm'] : array();
		$insert = $this->pdo->prepare(
			'INSERT INTO an_visitors (vid, first_seen, last_seen, first_referrer_host, first_utm_source, first_utm_medium,
			   first_utm_campaign, country, device, browser, os, last_ip)
			 VALUES (:vid, :now1, :now2, :ref, :us, :um, :uc, :country, :device, :browser, :os, :ip)
			 ON DUPLICATE KEY UPDATE last_seen = VALUES(last_seen)'
		);
		$insert->bindValue(':vid', $vid);
		$insert->bindValue(':now1', $now);
		$insert->bindValue(':now2', $now);
		$insert->bindValue(':ref', self::host($ctx['ref'] ?? ''));
		$insert->bindValue(':us', self::clip($utm['source'] ?? '', 100));
		$insert->bindValue(':um', self::clip($utm['medium'] ?? '', 100));
		$insert->bindValue(':uc', self::clip($utm['campaign'] ?? '', 100));
		$insert->bindValue(':country', $country === '' ? null : $country);
		$insert->bindValue(':device', $ua['device']);
		$insert->bindValue(':browser', $ua['browser']);
		$insert->bindValue(':os', $ua['os']);
		$insert->bindValue(':ip', $packedIp, $packedIp === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
		$insert->execute();
		$find->execute(array('vid' => $vid));

		return (int) $find->fetchColumn();
	}

	/**
	 * @param array<string, mixed> $ctx
	 * @param array{device:string,browser:string,os:string,bot:bool} $ua
	 * @param array<int, mixed> $events
	 */
	private function session(string $sid, int $visitorId, string $now, array $ctx, array $ua, string $country, ?string $packedIp, array $events): int
	{
		$find = $this->pdo->prepare('SELECT id, visitor_id FROM an_sessions WHERE sid = :sid');
		$find->execute(array('sid' => $sid));
		$row = $find->fetch();
		if (is_array($row)) {
			if ((int) $row['visitor_id'] !== $visitorId) {
				throw new \RuntimeException('sid_owner');
			}

			return (int) $row['id'];
		}

		$utm = isset($ctx['utm']) && is_array($ctx['utm']) ? $ctx['utm'] : array();
		$landing = '/';
		foreach ($events as $event) {
			if (is_array($event) && isset($event['path']) && is_string($event['path'])) {
				$landing = self::path($event['path']);
				break;
			}
		}
		$refUrl = is_string($ctx['ref'] ?? null) ? $ctx['ref'] : '';
		$insert = $this->pdo->prepare(
			'INSERT INTO an_sessions (sid, visitor_id, started_at, last_activity_at, landing_path, exit_path, referrer_host, referrer_url,
			   utm_source, utm_medium, utm_campaign, device, browser, os, screen, lang, country, ip)
			 VALUES (:sid, :vid, :now1, :now2, :landing, :landing2, :rhost, :rurl, :us, :um, :uc, :device, :browser, :os, :screen, :lang, :country, :ip)
			 ON DUPLICATE KEY UPDATE last_activity_at = VALUES(last_activity_at)'
		);
		$insert->bindValue(':sid', $sid);
		$insert->bindValue(':vid', $visitorId, PDO::PARAM_INT);
		$insert->bindValue(':now1', $now);
		$insert->bindValue(':now2', $now);
		$insert->bindValue(':landing', $landing);
		$insert->bindValue(':landing2', $landing);
		$insert->bindValue(':rhost', self::host($refUrl));
		$insert->bindValue(':rurl', self::clip($refUrl, 255));
		$insert->bindValue(':us', self::clip($utm['source'] ?? '', 100));
		$insert->bindValue(':um', self::clip($utm['medium'] ?? '', 100));
		$insert->bindValue(':uc', self::clip($utm['campaign'] ?? '', 100));
		$insert->bindValue(':device', $ua['device']);
		$insert->bindValue(':browser', $ua['browser']);
		$insert->bindValue(':os', $ua['os']);
		$insert->bindValue(':screen', preg_match('/^\d{2,5}x\d{2,5}$/', (string) ($ctx['scr'] ?? '')) === 1 ? (string) $ctx['scr'] : '');
		$insert->bindValue(':lang', self::clip($ctx['lang'] ?? '', 16));
		$insert->bindValue(':country', $country === '' ? null : $country);
		$insert->bindValue(':ip', $packedIp, $packedIp === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
		$insert->execute();
		$find->execute(array('sid' => $sid));
		$created = $find->fetch();
		if (!is_array($created)) {
			throw new \RuntimeException('session');
		}
		$this->pdo->prepare('UPDATE an_visitors SET sessions = sessions + 1 WHERE id = :id')->execute(array('id' => $visitorId));

		return (int) $created['id'];
	}

	/**
	 * @param array<int, mixed> $events
	 */
	private function events(int $sessionId, int $visitorId, string $now, array $events): void
	{
		$insert = $this->pdo->prepare(
			'INSERT INTO an_events (session_id, visitor_id, occurred_at, type, path, title, label, target, section, value)
			 VALUES (:sid, :vid, :at, :type, :path, :title, :label, :target, :section, :value)'
		);
		$pageviews = 0;
		$clicks = 0;
		$scroll = 0;
		$seconds = 0;
		$exit = null;

		foreach ($events as $event) {
			if (!is_array($event) || !isset($event['type']) || !is_string($event['type']) || !in_array($event['type'], self::TYPES, true)) {
				continue;
			}
			$type = $event['type'];
			$path = self::path(is_string($event['path'] ?? null) ? $event['path'] : '/');
			$value = isset($event['value']) && is_numeric($event['value']) ? (int) $event['value'] : null;
			if ($type === 'scroll') {
				$value = $value === null ? null : max(0, min(100, $value));
			}
			if ($type === 'engage') {
				$value = $value === null ? null : max(0, min(300, $value));
			}

			$insert->bindValue(':sid', $sessionId, PDO::PARAM_INT);
			$insert->bindValue(':vid', $visitorId, PDO::PARAM_INT);
			$insert->bindValue(':at', $now);
			$insert->bindValue(':type', $type);
			$insert->bindValue(':path', $path);
			$insert->bindValue(':title', self::clip($event['title'] ?? '', 160));
			$insert->bindValue(':label', self::clip($event['label'] ?? '', 160));
			$insert->bindValue(':target', self::clip($event['target'] ?? '', 255));
			$insert->bindValue(':section', self::clip($event['section'] ?? '', 80));
			$insert->bindValue(':value', $value, $value === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
			$insert->execute();

			if ($type === 'pageview') {
				++$pageviews;
				$exit = $path;
			} elseif ($type === 'click' || $type === 'outbound') {
				++$clicks;
			} elseif ($type === 'scroll' && $value !== null) {
				$scroll = max($scroll, $value);
			} elseif ($type === 'engage' && $value !== null) {
				$seconds += $value;
			}
		}

		$update = $this->pdo->prepare(
			'UPDATE an_sessions SET last_activity_at = :now, pageviews = pageviews + :pv, clicks = clicks + :ck,
			   max_scroll = GREATEST(max_scroll, :scroll), active_seconds = active_seconds + :secs,
			   exit_path = COALESCE(:exit, exit_path) WHERE id = :id'
		);
		$update->bindValue(':now', $now);
		$update->bindValue(':pv', $pageviews, PDO::PARAM_INT);
		$update->bindValue(':ck', $clicks, PDO::PARAM_INT);
		$update->bindValue(':scroll', $scroll, PDO::PARAM_INT);
		$update->bindValue(':secs', $seconds, PDO::PARAM_INT);
		$update->bindValue(':exit', $exit, $exit === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
		$update->bindValue(':id', $sessionId, PDO::PARAM_INT);
		$update->execute();

		$visitor = $this->pdo->prepare('UPDATE an_visitors SET pageviews = pageviews + :pv, clicks = clicks + :ck WHERE id = :id');
		$visitor->execute(array('pv' => $pageviews, 'ck' => $clicks, 'id' => $visitorId));
	}

	/**
	 * Yol: sorgu ve parça atılır, / ile başlar, 255 karakterle sınırlanır.
	 */
	public static function path(string $path): string
	{
		$path = (string) preg_replace('/[?#].*$/s', '', $path);
		$path = (string) preg_replace('/[\x00-\x1f\x7f]/', '', $path);
		if ($path === '' || $path[0] !== '/') {
			$path = '/' . $path;
		}

		return mb_substr($path, 0, 255);
	}

	/**
	 * @param mixed $value
	 */
	public static function clip($value, int $max): string
	{
		if (!is_string($value) && !is_numeric($value)) {
			return '';
		}
		$text = (string) preg_replace('/[\x00-\x1f\x7f]/u', ' ', (string) $value);

		return trim(mb_substr($text, 0, $max));
	}

	/**
	 * @param mixed $url
	 */
	public static function host($url): string
	{
		if (!is_string($url) || $url === '') {
			return '';
		}
		$host = parse_url($url, PHP_URL_HOST);

		return is_string($host) ? mb_substr(strtolower((string) preg_replace('/^www\./i', '', $host)), 0, 120) : '';
	}
}
