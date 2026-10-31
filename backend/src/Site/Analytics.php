<?php
/**
 * Yönetim paneli için site analitiği sorguları (yalnızca okuma).
 * Veritabanı UTC tutar; günlük gruplama ve aralık sınırları yerel saat dilimine
 * (sabit ofset, varsayılan UTC+3) göre yapılır. Saat dilimi tablosu gerekmez.
 */
declare(strict_types=1);

namespace QRLicense\Site;

use DateTimeImmutable;
use DateTimeZone;
use PDO;

final class Analytics
{
	private const PAGE_SIZES = array(20, 50, 100);

	private const EVENT_TYPES = array('pageview', 'click', 'scroll', 'engage', 'outbound');

	private PDO $pdo;

	private int $offset;

	/** @var callable(): DateTimeImmutable */
	private $now;

	/**
	 * @param callable(): DateTimeImmutable|null $now
	 */
	public function __construct(PDO $pdo, int $tzOffsetHours = 3, ?callable $now = null)
	{
		$this->pdo = $pdo;
		$this->offset = max(-12, min(14, $tzOffsetHours));
		$this->now = $now ?? static function (): DateTimeImmutable {
			return new DateTimeImmutable('now', new DateTimeZone('UTC'));
		};
	}

	/**
	 * @param array<string, mixed> $q
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function overview(array $q): array
	{
		$range = $this->range($q);
		if ($range === null) {
			return $this->fail(422, 'invalid_range');
		}
		[$from, $to, $days] = $range;
		$prevFrom = gmdate('Y-m-d H:i:s', strtotime($from . ' UTC') - $days * 86400);

		$totals = $this->totals($from, $to);
		$prev = $this->totals($prevFrom, $from);

		$off = $this->sqlOffset();
		$series = $this->rows(
			"SELECT DATE($off) AS d, COUNT(*) AS sessions, COUNT(DISTINCT visitor_id) AS visitors,
			   COALESCE(SUM(pageviews),0) AS pageviews, COALESCE(SUM(clicks),0) AS clicks
			 FROM an_sessions WHERE started_at >= :f AND started_at < :t GROUP BY d ORDER BY d",
			array('f' => $from, 't' => $to),
			'started_at'
		);
		$byDay = array();
		foreach ($series as $row) {
			$byDay[(string) $row['d']] = $row;
		}
		$filled = array();
		$cursor = strtotime($from . ' UTC') + $this->offset * 3600;
		for ($i = 0; $i < $days; ++$i) {
			$d = gmdate('Y-m-d', $cursor + $i * 86400);
			$r = $byDay[$d] ?? array();
			$filled[] = array(
				'date' => $d,
				'visitors' => (int) ($r['visitors'] ?? 0),
				'sessions' => (int) ($r['sessions'] ?? 0),
				'pageviews' => (int) ($r['pageviews'] ?? 0),
				'clicks' => (int) ($r['clicks'] ?? 0),
			);
		}

		$window = array('f' => $from, 't' => $to);

		return $this->ok(array(
			'range' => array('from' => $from, 'to' => $to, 'days' => $days),
			'totals' => $totals,
			'previous' => $prev,
			'series' => $filled,
			'live' => $this->liveCount(),
			'top_pages' => $this->rows(
				"SELECT path, COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors FROM an_events
				 WHERE type = 'pageview' AND occurred_at >= :f AND occurred_at < :t GROUP BY path ORDER BY views DESC, path LIMIT 10",
				$window
			),
			'referrers' => $this->rows(
				"SELECT IF(referrer_host = '', '(doğrudan)', referrer_host) AS k, COUNT(*) AS n FROM an_sessions
				 WHERE started_at >= :f AND started_at < :t GROUP BY k ORDER BY n DESC, k LIMIT 10",
				$window
			),
			'top_clicks' => $this->rows(
				"SELECT label, target, path, COUNT(*) AS n FROM an_events
				 WHERE type IN ('click','outbound') AND occurred_at >= :f AND occurred_at < :t
				 GROUP BY label, target, path ORDER BY n DESC, label LIMIT 10",
				$window
			),
			'devices' => $this->breakdown('device', $window),
			'browsers' => $this->breakdown('browser', $window),
			'os' => $this->breakdown('os', $window),
			'countries' => $this->breakdown('country', $window),
			'campaigns' => $this->rows(
				"SELECT utm_source AS source, utm_medium AS medium, utm_campaign AS campaign, COUNT(*) AS n FROM an_sessions
				 WHERE utm_source <> '' AND started_at >= :f AND started_at < :t GROUP BY utm_source, utm_medium, utm_campaign ORDER BY n DESC LIMIT 10",
				$window
			),
		));
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function live(): array
	{
		$since = gmdate('Y-m-d H:i:s', ($this->now)()->getTimestamp() - 300);
		$rows = $this->rows(
			'SELECT s.id, s.visitor_id, s.started_at, s.last_activity_at, s.landing_path, s.exit_path, s.referrer_host,
			   s.device, s.browser, s.os, s.country, s.pageviews, s.clicks, s.ip
			 FROM an_sessions s WHERE s.last_activity_at >= :since ORDER BY s.last_activity_at DESC LIMIT 100',
			array('since' => $since)
		);

		return $this->ok(array('count' => count($rows), 'sessions' => array_map(fn (array $r): array => $this->presentSession($r), $rows)));
	}

	/**
	 * @param array<string, mixed> $q
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function pages(array $q): array
	{
		$range = $this->range($q);
		if ($range === null) {
			return $this->fail(422, 'invalid_range');
		}
		[$from, $to] = $range;
		$w = array('f' => $from, 't' => $to);

		$views = $this->rows(
			"SELECT path, MAX(title) AS title, COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors FROM an_events
			 WHERE type = 'pageview' AND occurred_at >= :f AND occurred_at < :t GROUP BY path ORDER BY views DESC, path LIMIT 200",
			$w
		);
		$engage = $this->rows(
			"SELECT path, SUM(value) AS seconds FROM an_events WHERE type = 'engage' AND occurred_at >= :f AND occurred_at < :t GROUP BY path",
			$w
		);
		$scroll = $this->rows(
			"SELECT path, ROUND(AVG(value)) AS depth FROM an_events WHERE type = 'scroll' AND occurred_at >= :f AND occurred_at < :t GROUP BY path",
			$w
		);
		$clicks = $this->rows(
			"SELECT path, COUNT(*) AS n FROM an_events WHERE type IN ('click','outbound') AND occurred_at >= :f AND occurred_at < :t GROUP BY path",
			$w
		);
		$sec = array_column($engage, 'seconds', 'path');
		$dep = array_column($scroll, 'depth', 'path');
		$clk = array_column($clicks, 'n', 'path');
		$out = array();
		foreach ($views as $r) {
			$v = max(1, (int) $r['views']);
			$out[] = array(
				'path' => (string) $r['path'],
				'title' => (string) $r['title'],
				'views' => (int) $r['views'],
				'visitors' => (int) $r['visitors'],
				'avg_seconds' => (int) round(((int) ($sec[$r['path']] ?? 0)) / $v),
				'avg_scroll' => (int) ($dep[$r['path']] ?? 0),
				'clicks' => (int) ($clk[$r['path']] ?? 0),
			);
		}

		return $this->ok(array('range' => array('from' => $from, 'to' => $to), 'pages' => $out));
	}

	/**
	 * @param array<string, mixed> $q
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function clicks(array $q): array
	{
		$range = $this->range($q);
		if ($range === null) {
			return $this->fail(422, 'invalid_range');
		}
		[$from, $to] = $range;
		$rows = $this->rows(
			"SELECT type, label, target, section, path, COUNT(*) AS n, COUNT(DISTINCT visitor_id) AS visitors, MAX(occurred_at) AS last_at
			 FROM an_events WHERE type IN ('click','outbound') AND occurred_at >= :f AND occurred_at < :t
			 GROUP BY type, label, target, section, path ORDER BY n DESC, label LIMIT 300",
			array('f' => $from, 't' => $to)
		);

		return $this->ok(array('range' => array('from' => $from, 'to' => $to), 'clicks' => array_map(static function (array $r): array {
			return array(
				'type' => (string) $r['type'],
				'label' => (string) $r['label'],
				'target' => (string) $r['target'],
				'section' => (string) $r['section'],
				'path' => (string) $r['path'],
				'count' => (int) $r['n'],
				'visitors' => (int) $r['visitors'],
				'last_at' => (string) $r['last_at'],
			);
		}, $rows)));
	}

	/**
	 * @param array<string, mixed> $q
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function visitors(array $q): array
	{
		[$page, $per] = $this->paging($q);
		$where = array('1 = 1');
		$params = array();
		$search = isset($q['q']) && is_string($q['q']) ? trim($q['q']) : '';
		if ($search !== '') {
			$like = '%' . addcslashes(mb_substr($search, 0, 60), '%_\\') . '%';
			$where[] = '(v.vid LIKE :q1 OR v.country LIKE :q2 OR v.browser LIKE :q3 OR v.first_referrer_host LIKE :q4 OR v.first_utm_source LIKE :q5)';
			foreach (array('q1', 'q2', 'q3', 'q4', 'q5') as $k) {
				$params[$k] = $like;
			}
		}
		if (isset($q['returning']) && $q['returning'] === '1') {
			$where[] = 'v.sessions > 1';
		}
		$sqlWhere = implode(' AND ', $where);

		$count = $this->pdo->prepare("SELECT COUNT(*) FROM an_visitors v WHERE $sqlWhere");
		$count->execute($params);
		$total = (int) $count->fetchColumn();

		$list = $this->pdo->prepare(
			"SELECT v.id, v.vid, v.first_seen, v.last_seen, v.first_referrer_host, v.first_utm_source, v.country, v.device, v.browser, v.os,
			   v.last_ip AS ip, v.sessions, v.pageviews, v.clicks
			 FROM an_visitors v WHERE $sqlWhere ORDER BY v.last_seen DESC, v.id DESC LIMIT :limit OFFSET :offset"
		);
		foreach ($params as $k => $v) {
			$list->bindValue(':' . $k, $v);
		}
		$list->bindValue(':limit', $per, PDO::PARAM_INT);
		$list->bindValue(':offset', ($page - 1) * $per, PDO::PARAM_INT);
		$list->execute();

		return $this->ok(array(
			'page' => $page,
			'per_page' => $per,
			'total' => $total,
			'visitors' => array_map(fn (array $r): array => $this->presentVisitor($r), $list->fetchAll()),
		));
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function visitor(int $id): array
	{
		$row = $this->pdo->prepare(
			'SELECT id, vid, first_seen, last_seen, first_referrer_host, first_utm_source, country, device, browser, os, last_ip AS ip,
			   sessions, pageviews, clicks FROM an_visitors WHERE id = :id'
		);
		$row->execute(array('id' => $id));
		$visitor = $row->fetch();
		if (!is_array($visitor)) {
			return $this->fail(404, 'not_found');
		}
		$sessions = $this->rows(
			'SELECT s.id, s.visitor_id, s.started_at, s.last_activity_at, s.landing_path, s.exit_path, s.referrer_host, s.device, s.browser, s.os,
			   s.country, s.pageviews, s.clicks, s.ip, s.max_scroll, s.active_seconds, s.screen, s.lang, s.utm_source, s.utm_medium, s.utm_campaign
			 FROM an_sessions s WHERE s.visitor_id = :id ORDER BY s.started_at DESC LIMIT 100',
			array('id' => $id)
		);

		return $this->ok(array(
			'visitor' => $this->presentVisitor($visitor),
			'sessions' => array_map(fn (array $r): array => $this->presentSession($r), $sessions),
		));
	}

	/**
	 * @param array<string, mixed> $q
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function sessions(array $q): array
	{
		$range = $this->range($q);
		if ($range === null) {
			return $this->fail(422, 'invalid_range');
		}
		[$from, $to] = $range;
		[$page, $per] = $this->paging($q);

		$total = $this->pdo->prepare('SELECT COUNT(*) FROM an_sessions WHERE started_at >= :f AND started_at < :t');
		$total->execute(array('f' => $from, 't' => $to));
		$list = $this->pdo->prepare(
			'SELECT s.id, s.visitor_id, s.started_at, s.last_activity_at, s.landing_path, s.exit_path, s.referrer_host, s.device, s.browser,
			   s.os, s.country, s.pageviews, s.clicks, s.ip, s.max_scroll, s.active_seconds, s.screen, s.lang,
			   s.utm_source, s.utm_medium, s.utm_campaign
			 FROM an_sessions s WHERE s.started_at >= :f AND s.started_at < :t ORDER BY s.started_at DESC, s.id DESC LIMIT :limit OFFSET :offset'
		);
		$list->bindValue(':f', $from);
		$list->bindValue(':t', $to);
		$list->bindValue(':limit', $per, PDO::PARAM_INT);
		$list->bindValue(':offset', ($page - 1) * $per, PDO::PARAM_INT);
		$list->execute();

		return $this->ok(array(
			'page' => $page,
			'per_page' => $per,
			'total' => (int) $total->fetchColumn(),
			'sessions' => array_map(fn (array $r): array => $this->presentSession($r), $list->fetchAll()),
		));
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function session(int $id): array
	{
		$row = $this->pdo->prepare(
			'SELECT s.id, s.visitor_id, s.started_at, s.last_activity_at, s.landing_path, s.exit_path, s.referrer_host, s.referrer_url, s.device,
			   s.browser, s.os, s.country, s.pageviews, s.clicks, s.ip, s.max_scroll, s.active_seconds, s.screen, s.lang,
			   s.utm_source, s.utm_medium, s.utm_campaign FROM an_sessions s WHERE s.id = :id'
		);
		$row->execute(array('id' => $id));
		$session = $row->fetch();
		if (!is_array($session)) {
			return $this->fail(404, 'not_found');
		}
		$events = $this->rows(
			'SELECT id, occurred_at, type, path, title, label, target, section, value FROM an_events WHERE session_id = :id ORDER BY id ASC LIMIT 1000',
			array('id' => $id)
		);

		return $this->ok(array(
			'session' => $this->presentSession($session) + array('referrer_url' => (string) ($session['referrer_url'] ?? '')),
			'events' => array_map(fn (array $r): array => $this->presentEvent($r), $events),
		));
	}

	/**
	 * @param array<string, mixed> $q
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function events(array $q): array
	{
		$range = $this->range($q);
		if ($range === null) {
			return $this->fail(422, 'invalid_range');
		}
		[$from, $to] = $range;
		[$page, $per] = $this->paging($q);
		$where = array('e.occurred_at >= :f', 'e.occurred_at < :t');
		$params = array('f' => $from, 't' => $to);
		if (isset($q['type']) && is_string($q['type']) && $q['type'] !== '') {
			if (!in_array($q['type'], self::EVENT_TYPES, true)) {
				return $this->fail(422, 'invalid_type');
			}
			$where[] = 'e.type = :type';
			$params['type'] = $q['type'];
		}
		if (isset($q['path']) && is_string($q['path']) && $q['path'] !== '') {
			$where[] = 'e.path LIKE :path';
			$params['path'] = addcslashes(Collector::path($q['path']), '%_\\') . '%';
		}
		$sqlWhere = implode(' AND ', $where);
		$count = $this->pdo->prepare("SELECT COUNT(*) FROM an_events e WHERE $sqlWhere");
		$count->execute($params);
		$list = $this->pdo->prepare(
			"SELECT e.id, e.session_id, e.visitor_id, e.occurred_at, e.type, e.path, e.title, e.label, e.target, e.section, e.value
			 FROM an_events e WHERE $sqlWhere ORDER BY e.id DESC LIMIT :limit OFFSET :offset"
		);
		foreach ($params as $k => $v) {
			$list->bindValue(':' . $k, $v);
		}
		$list->bindValue(':limit', $per, PDO::PARAM_INT);
		$list->bindValue(':offset', ($page - 1) * $per, PDO::PARAM_INT);
		$list->execute();

		return $this->ok(array(
			'page' => $page,
			'per_page' => $per,
			'total' => (int) $count->fetchColumn(),
			'events' => array_map(function (array $r): array {
				return $this->presentEvent($r) + array('session_id' => (int) $r['session_id'], 'visitor_id' => (int) $r['visitor_id']);
			}, $list->fetchAll()),
		));
	}

	/**
	 * Saklama süresini aşan olayları ve boş kalan oturum/ziyaretçileri siler.
	 *
	 * @return array{events:int,sessions:int,visitors:int}
	 */
	public function prune(int $days): array
	{
		$cut = gmdate('Y-m-d H:i:s', ($this->now)()->getTimestamp() - max(30, $days) * 86400);
		$events = $this->pdo->prepare('DELETE FROM an_events WHERE occurred_at < :c');
		$events->execute(array('c' => $cut));
		$sessions = $this->pdo->prepare('DELETE FROM an_sessions WHERE last_activity_at < :c');
		$sessions->execute(array('c' => $cut));
		$visitors = $this->pdo->prepare('DELETE FROM an_visitors WHERE last_seen < :c');
		$visitors->execute(array('c' => $cut));
		$this->pdo->exec('DELETE FROM rate_buckets WHERE reset_at < UTC_TIMESTAMP() - INTERVAL 1 DAY');

		return array('events' => $events->rowCount(), 'sessions' => $sessions->rowCount(), 'visitors' => $visitors->rowCount());
	}

	/**
	 * Bir ziyaretçinin tüm kaydını siler (silme talebi / KVKK madde 11).
	 */
	public function forgetVisitor(int $id): bool
	{
		$statement = $this->pdo->prepare('DELETE FROM an_visitors WHERE id = :id');
		$statement->execute(array('id' => $id));

		return $statement->rowCount() > 0;
	}

	/* ---------------------------------------------------------------- iç */

	/**
	 * @return array<string, int|float>
	 */
	private function totals(string $from, string $to): array
	{
		$s = $this->pdo->prepare(
			'SELECT COUNT(*) AS sessions, COUNT(DISTINCT visitor_id) AS visitors, COALESCE(SUM(pageviews),0) AS pageviews,
			   COALESCE(SUM(clicks),0) AS clicks, COALESCE(SUM(active_seconds),0) AS seconds,
			   COALESCE(SUM(CASE WHEN pageviews <= 1 THEN 1 ELSE 0 END),0) AS bounces
			 FROM an_sessions WHERE started_at >= :f AND started_at < :t'
		);
		$s->execute(array('f' => $from, 't' => $to));
		$r = $s->fetch();
		$r = is_array($r) ? $r : array();
		$sessions = (int) ($r['sessions'] ?? 0);
		$new = $this->pdo->prepare('SELECT COUNT(*) FROM an_visitors WHERE first_seen >= :f AND first_seen < :t');
		$new->execute(array('f' => $from, 't' => $to));

		return array(
			'visitors' => (int) ($r['visitors'] ?? 0),
			'new_visitors' => (int) $new->fetchColumn(),
			'sessions' => $sessions,
			'pageviews' => (int) ($r['pageviews'] ?? 0),
			'clicks' => (int) ($r['clicks'] ?? 0),
			'avg_seconds' => $sessions > 0 ? (int) round(((int) $r['seconds']) / $sessions) : 0,
			'bounce_rate' => $sessions > 0 ? round(((int) $r['bounces']) / $sessions * 100, 1) : 0.0,
			'pages_per_session' => $sessions > 0 ? round(((int) $r['pageviews']) / $sessions, 2) : 0.0,
		);
	}

	private function liveCount(): int
	{
		$s = $this->pdo->prepare('SELECT COUNT(*) FROM an_sessions WHERE last_activity_at >= :since');
		$s->execute(array('since' => gmdate('Y-m-d H:i:s', ($this->now)()->getTimestamp() - 300)));

		return (int) $s->fetchColumn();
	}

	/**
	 * @param array<string, string> $window
	 * @return list<array{key:string,count:int}>
	 */
	private function breakdown(string $column, array $window): array
	{
		$rows = $this->rows(
			"SELECT IF($column IS NULL OR $column = '', '(bilinmiyor)', $column) AS k, COUNT(*) AS n FROM an_sessions
			 WHERE started_at >= :f AND started_at < :t GROUP BY k ORDER BY n DESC, k LIMIT 10",
			$window
		);

		return array_map(static fn (array $r): array => array('key' => (string) $r['k'], 'count' => (int) $r['n']), $rows);
	}

	private function sqlOffset(): string
	{
		return 'DATE_ADD(started_at, INTERVAL ' . $this->offset . ' HOUR)';
	}

	/**
	 * @param array<string, mixed> $params
	 * @return list<array<string, mixed>>
	 */
	private function rows(string $sql, array $params, string $unused = ''): array
	{
		$s = $this->pdo->prepare($sql);
		$s->execute($params);
		$rows = $s->fetchAll();

		return is_array($rows) ? $rows : array();
	}

	/**
	 * Aralık: yerel gün sınırları UTC'ye çevrilir. from/to (YYYY-MM-DD, yerel, to dahil) ya da range=today|7d|30d|90d.
	 *
	 * @param array<string, mixed> $q
	 * @return array{0:string,1:string,2:int}|null
	 */
	private function range(array $q): ?array
	{
		$tz = new DateTimeZone('UTC');
		$localNow = ($this->now)()->modify(($this->offset >= 0 ? '+' : '') . $this->offset . ' hours');
		$today = $localNow->setTime(0, 0, 0);

		if (isset($q['from'], $q['to']) && is_string($q['from']) && is_string($q['to'])) {
			$a = DateTimeImmutable::createFromFormat('!Y-m-d', $q['from'], $tz);
			$b = DateTimeImmutable::createFromFormat('!Y-m-d', $q['to'], $tz);
			if ($a === false || $b === false || $a > $b || $a->format('Y-m-d') !== $q['from'] || $b->format('Y-m-d') !== $q['to']) {
				return null;
			}
			$days = (int) $a->diff($b)->days + 1;
			if ($days > 366) {
				return null;
			}
			$end = $b->modify('+1 day');
		} else {
			$key = isset($q['range']) && is_string($q['range']) ? $q['range'] : '7d';
			$map = array('today' => 1, '7d' => 7, '30d' => 30, '90d' => 90);
			if (!isset($map[$key])) {
				return null;
			}
			$days = $map[$key];
			$end = $today->modify('+1 day');
			$a = $end->modify('-' . $days . ' days');
		}
		$shift = $this->offset * 3600;

		return array(gmdate('Y-m-d H:i:s', $a->getTimestamp() - $shift), gmdate('Y-m-d H:i:s', $end->getTimestamp() - $shift), $days);
	}

	/**
	 * @param array<string, mixed> $q
	 * @return array{0:int,1:int}
	 */
	private function paging(array $q): array
	{
		$page = isset($q['page']) && is_string($q['page']) && ctype_digit($q['page']) ? max(1, min(100000, (int) $q['page'])) : 1;
		$per = isset($q['per_page']) && is_string($q['per_page']) && ctype_digit($q['per_page']) ? (int) $q['per_page'] : 20;
		if (!in_array($per, self::PAGE_SIZES, true)) {
			$per = 20;
		}

		return array($page, $per);
	}

	/**
	 * @param array<string, mixed> $r
	 * @return array<string, mixed>
	 */
	private function presentVisitor(array $r): array
	{
		return array(
			'id' => (int) $r['id'],
			'vid' => substr((string) $r['vid'], 0, 8),
			'first_seen' => (string) $r['first_seen'],
			'last_seen' => (string) $r['last_seen'],
			'referrer' => (string) $r['first_referrer_host'],
			'utm_source' => (string) $r['first_utm_source'],
			'country' => (string) ($r['country'] ?? ''),
			'device' => (string) $r['device'],
			'browser' => (string) $r['browser'],
			'os' => (string) $r['os'],
			'ip' => self::ip($r['ip'] ?? null),
			'sessions' => (int) $r['sessions'],
			'pageviews' => (int) $r['pageviews'],
			'clicks' => (int) $r['clicks'],
		);
	}

	/**
	 * @param array<string, mixed> $r
	 * @return array<string, mixed>
	 */
	private function presentSession(array $r): array
	{
		return array(
			'id' => (int) $r['id'],
			'visitor_id' => (int) $r['visitor_id'],
			'started_at' => (string) $r['started_at'],
			'last_activity_at' => (string) $r['last_activity_at'],
			'landing_path' => (string) $r['landing_path'],
			'exit_path' => (string) $r['exit_path'],
			'referrer' => (string) $r['referrer_host'],
			'device' => (string) $r['device'],
			'browser' => (string) $r['browser'],
			'os' => (string) $r['os'],
			'country' => (string) ($r['country'] ?? ''),
			'ip' => self::ip($r['ip'] ?? null),
			'pageviews' => (int) $r['pageviews'],
			'clicks' => (int) $r['clicks'],
			'max_scroll' => (int) ($r['max_scroll'] ?? 0),
			'active_seconds' => (int) ($r['active_seconds'] ?? 0),
			'screen' => (string) ($r['screen'] ?? ''),
			'lang' => (string) ($r['lang'] ?? ''),
			'utm' => trim(implode(' / ', array_filter(array((string) ($r['utm_source'] ?? ''), (string) ($r['utm_medium'] ?? ''), (string) ($r['utm_campaign'] ?? ''))))),
		);
	}

	/**
	 * @param array<string, mixed> $r
	 * @return array<string, mixed>
	 */
	private function presentEvent(array $r): array
	{
		return array(
			'id' => (int) $r['id'],
			'at' => (string) $r['occurred_at'],
			'type' => (string) $r['type'],
			'path' => (string) $r['path'],
			'title' => (string) $r['title'],
			'label' => (string) $r['label'],
			'target' => (string) $r['target'],
			'section' => (string) $r['section'],
			'value' => $r['value'] === null ? null : (int) $r['value'],
		);
	}

	/**
	 * @param mixed $packed
	 */
	private static function ip($packed): string
	{
		if (!is_string($packed) || $packed === '') {
			return '';
		}
		$ip = @inet_ntop($packed);

		return $ip === false ? '' : $ip;
	}

	/**
	 * @param array<string, mixed> $body
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function ok(array $body): array
	{
		return array('status' => 200, 'body' => array('status' => 'ok') + $body, 'headers' => array('Cache-Control' => 'no-store'));
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function fail(int $status, string $error): array
	{
		return array('status' => $status, 'body' => array('status' => 'error', 'error' => $error), 'headers' => array('Cache-Control' => 'no-store'));
	}
}
