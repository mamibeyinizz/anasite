<?php
/**
 * POST /v1/validate iş kuralları.
 *
 * Bitiş anı, expires_on gününün 23:59:59 UTC değeridir. Bu saniye dahildir.
 * Eski eklenti aynı takvim gününün 23:59:59 anını strtotime ile PHP varsayılan
 * saat diliminde hesaplar. Üretim PHP date.timezone, WordPress timezone_string
 * ve gmt_offset okunmadan bu iki anın çakıştığı varsayılmaz.
 *
 * starts_on doğrulamayı etkilemez.
 */
declare(strict_types=1);

namespace QRLicense\License;

use DateTimeImmutable;
use DateTimeZone;
use PDO;
use PDOException;

final class Validator
{
	public const RATE_LIMIT_MAX = 20;

	public const RATE_LIMIT_WINDOW = 60;

	/** @var list<string> */
	public const MODULE_SLUGS = array(
		'restoran-menu',
		'yorum-feedback',
		'qr-masa',
		'qr-analiz',
		'qr-galeri',
		'qr-ceviri',
		'qr-chatbot',
		'qr-calisma-saatleri',
		'qr-masa-oturum-guvenligi',
		'qr-acilis-ekrani',
		'header-footer-builder',
		'qr-menu-muhendisligi',
		'qr-servis-paneli',
	);

	private PDO $pdo;

	private Keys $keys;

	/** @var callable(): DateTimeImmutable */
	private $now;

	private int $rateMax;

	private int $rateWindow;

	/**
	 * @param callable(): DateTimeImmutable|null $now
	 */
	public function __construct(PDO $pdo, Keys $keys, ?callable $now = null, int $rateMax = self::RATE_LIMIT_MAX, int $rateWindow = self::RATE_LIMIT_WINDOW)
	{
		$this->pdo = $pdo;
		$this->keys = $keys;
		$this->now = $now ?? static function (): DateTimeImmutable {
			return new DateTimeImmutable('now', new DateTimeZone('UTC'));
		};
		$this->rateMax = $rateMax;
		$this->rateWindow = $rateWindow;
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function validate(string $apiKey, string $domain, string $version, string $ip): array
	{
		$limit = $this->consumeRateLimit($ip);
		if (!$limit['allowed']) {
			return array(
				'status' => 429,
				'body' => array('status' => 'rate_limited'),
				'headers' => array(
					'Retry-After' => (string) $limit['retry_after'],
					'Cache-Control' => 'no-store',
				),
			);
		}

		$license = $this->findLicense($apiKey);
		if ($license === null) {
			return $this->result(404, array('status' => 'invalid'));
		}

		$now = ($this->now)();
		$nowSql = $now->format('Y-m-d H:i:s');
		$normalized = self::normalizeDomain($domain);

		$this->beginWrite();
		try {
			$this->touch($license['id'], $nowSql);
			$this->recordVersion($license, $version, $nowSql);

			if ($license['status'] !== 'aktif') {
				$this->commitWrite();
				return $this->result(200, array('status' => 'inactive'));
			}

			if (self::isExpired($license['expires_on'], $now)) {
				$this->commitWrite();
				return $this->result(200, array('status' => 'expired', 'modules' => array()));
			}

			$saved = self::normalizeDomain($license['domain']);
			if ($saved === '') {
				if ($normalized === '' || strlen($normalized) > 191) {
					$this->commitWrite();
					return $this->result(200, array('status' => 'domain_mismatch', 'modules' => array()));
				}

				$won = $this->lockDomain($license['id'], $normalized, $nowSql);
				if ($won) {
					$this->audit($license['id'], $nowSql, 'domain_kilitlendi', $normalized);
					$saved = $normalized;
				} else {
					$saved = self::normalizeDomain($this->readDomain($license['id']));
				}
			}

			if ($saved !== $normalized) {
				$this->commitWrite();
				return $this->result(200, array('status' => 'domain_mismatch', 'modules' => array()));
			}

			$modules = $this->modulesFor($license['id']);
			$this->commitWrite();
			return $this->result(200, array('status' => 'active', 'modules' => $modules));
		} catch (PDOException $e) {
			$this->rollbackWrite();
			throw $e;
		}
	}

	public static function normalizeDomain(string $domain): string
	{
		$domain = trim(strip_tags($domain));
		$domain = preg_replace('/[\x00-\x1F\x7F]/', '', $domain) ?? '';
		$domain = trim($domain);
		if ($domain === '') {
			return '';
		}

		if (strpos($domain, '://') !== false) {
			$host = parse_url($domain, PHP_URL_HOST);
			if (is_string($host) && $host !== '') {
				$domain = $host;
			}
		}

		$domain = strtolower($domain);
		$domain = preg_replace('/^www\./', '', $domain) ?? $domain;
		$domain = preg_replace('~[/:?#].*$~', '', $domain) ?? $domain;

		return trim($domain, '.');
	}

	public static function isExpired(?string $expiresOn, DateTimeImmutable $now): bool
	{
		if ($expiresOn === null || $expiresOn === '') {
			return false;
		}

		$end = DateTimeImmutable::createFromFormat('!Y-m-d H:i:s', $expiresOn . ' 23:59:59', new DateTimeZone('UTC'));
		if (!$end || $end->format('Y-m-d') !== $expiresOn) {
			return false;
		}

		return $end < $now;
	}

	/**
	 * @return array{allowed:bool,retry_after:int}
	 */
	private function consumeRateLimit(string $ip): array
	{
		$identity = $ip !== '' ? $ip : 'unknown';
		$bucket = 'validate:' . hash('sha256', $identity);
		$now = ($this->now)();
		$reset = $now->modify('+' . $this->rateWindow . ' seconds');
		$nowSql = $now->format('Y-m-d H:i:s');
		$resetSql = $reset->format('Y-m-d H:i:s');

		for ($attempt = 0; $attempt < 3; $attempt++) {
			try {
				return $this->writeRateLimit($bucket, $now, $nowSql, $resetSql);
			} catch (PDOException $e) {
				if ($this->pdo->inTransaction()) {
					$this->rollbackWrite();
				}
				if ($attempt < 2 && $this->isRetryableLock($e)) {
					continue;
				}
				throw $e;
			}
		}

		return array('allowed' => false, 'retry_after' => $this->rateWindow);
	}

	/**
	 * Başarısız INSERT ile FOR UPDATE aynı transaction'da kalırsa InnoDB deadlock üretir.
	 * Çakışan ekleme geri alınıp kilit ayrı transaction'da alınır.
	 *
	 * @return array{allowed:bool,retry_after:int}
	 */
	private function writeRateLimit(string $bucket, DateTimeImmutable $now, string $nowSql, string $resetSql): array
	{
		$this->beginWrite();
		try {
			$inserted = false;
			$insert = $this->pdo->prepare(
				'INSERT INTO rate_buckets (bucket, hits, reset_at) VALUES (:bucket, 1, :reset_at)'
			);
			try {
				$insert->execute(array('bucket' => $bucket, 'reset_at' => $resetSql));
				$inserted = true;
			} catch (PDOException $e) {
				if (!$this->isDuplicate($e)) {
					throw $e;
				}
				$this->rollbackWrite();
				$this->beginWrite();
			}

			if ($inserted) {
				$this->commitWrite();
				return array('allowed' => true, 'retry_after' => 0);
			}

			$selectSql = 'SELECT hits, reset_at FROM rate_buckets WHERE bucket = :bucket';
			if ($this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
				$selectSql .= ' FOR UPDATE';
			}
			$select = $this->pdo->prepare($selectSql);
			$select->execute(array('bucket' => $bucket));
			$row = $select->fetch();
			if (!is_array($row)) {
				$this->commitWrite();
				return array('allowed' => true, 'retry_after' => 0);
			}

			$hits = (int) $row['hits'];
			$resetAt = (string) $row['reset_at'];
			if ($resetAt <= $nowSql) {
				$update = $this->pdo->prepare(
					'UPDATE rate_buckets SET hits = 1, reset_at = :reset_at WHERE bucket = :bucket'
				);
				$update->execute(array('reset_at' => $resetSql, 'bucket' => $bucket));
				$this->commitWrite();
				return array('allowed' => true, 'retry_after' => 0);
			}

			if ($hits >= $this->rateMax) {
				$this->commitWrite();
				$retry = $this->secondsUntil($resetAt, $now);
				return array('allowed' => false, 'retry_after' => $retry);
			}

			$update = $this->pdo->prepare(
				'UPDATE rate_buckets SET hits = hits + 1 WHERE bucket = :bucket AND hits < :max AND reset_at > :now'
			);
			$update->execute(array(
				'bucket' => $bucket,
				'max' => $this->rateMax,
				'now' => $nowSql,
			));
			if ($update->rowCount() !== 1) {
				$this->commitWrite();
				$retry = $this->secondsUntil($resetAt, $now);
				return array('allowed' => false, 'retry_after' => $retry);
			}

			$this->commitWrite();
			return array('allowed' => true, 'retry_after' => 0);
		} catch (PDOException $e) {
			$this->rollbackWrite();
			throw $e;
		}
	}

	/**
	 * @return array{id:int,domain:string,status:string,expires_on:?string,client_version:string}|null
	 */
	private function findLicense(string $apiKey): ?array
	{
		$statement = $this->pdo->prepare(
			'SELECT id, domain, status, expires_on, client_version
			 FROM licenses
			 WHERE api_key_hmac = :hmac AND archived_at IS NULL
			 LIMIT 1'
		);
		$statement->execute(array('hmac' => $this->keys->hmac($apiKey)));
		$row = $statement->fetch();
		if (!is_array($row)) {
			return null;
		}

		return array(
			'id' => (int) $row['id'],
			'domain' => (string) ($row['domain'] ?? ''),
			'status' => (string) $row['status'],
			'expires_on' => isset($row['expires_on']) && $row['expires_on'] !== null && $row['expires_on'] !== ''
				? (string) $row['expires_on']
				: null,
			'client_version' => (string) ($row['client_version'] ?? ''),
		);
	}

	private function touch(int $id, string $nowSql): void
	{
		$statement = $this->pdo->prepare(
			'UPDATE licenses SET last_seen_at = :seen, updated_at = :updated WHERE id = :id'
		);
		$statement->execute(array('seen' => $nowSql, 'updated' => $nowSql, 'id' => $id));
	}

	/**
	 * @param array{id:int,client_version:string} $license
	 */
	private function recordVersion(array $license, string $version, string $nowSql): void
	{
		$version = trim(preg_replace('/[\x00-\x1F\x7F]/', '', $version) ?? '');
		if ($version === '' || $version === $license['client_version']) {
			return;
		}
		if (strlen($version) > 32) {
			$version = substr($version, 0, 32);
		}

		$statement = $this->pdo->prepare(
			'UPDATE licenses SET client_version = :version, updated_at = :updated WHERE id = :id'
		);
		$statement->execute(array('version' => $version, 'updated' => $nowSql, 'id' => $license['id']));

		$detail = $license['client_version'] !== ''
			? $license['client_version'] . ' → ' . $version
			: $version;
		$this->audit($license['id'], $nowSql, 'surum_guncellendi', $detail);
	}

	private function lockDomain(int $id, string $domain, string $nowSql): bool
	{
		$statement = $this->pdo->prepare(
			'UPDATE licenses
			 SET domain = :domain, updated_at = :updated
			 WHERE id = :id AND archived_at IS NULL AND (domain IS NULL OR domain = \'\')'
		);
		$statement->execute(array('domain' => $domain, 'updated' => $nowSql, 'id' => $id));

		return $statement->rowCount() === 1;
	}

	private function readDomain(int $id): string
	{
		$sql = 'SELECT domain FROM licenses WHERE id = :id';
		if ($this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
			$sql .= ' FOR UPDATE';
		}
		$statement = $this->pdo->prepare($sql);
		$statement->execute(array('id' => $id));
		$value = $statement->fetchColumn();

		return is_string($value) ? $value : '';
	}

	/**
	 * @return list<string>
	 */
	private function modulesFor(int $id): array
	{
		$statement = $this->pdo->prepare(
			'SELECT module_slug FROM license_modules WHERE license_id = :id'
		);
		$statement->execute(array('id' => $id));
		$found = array();
		while (($slug = $statement->fetchColumn()) !== false) {
			if (is_string($slug)) {
				$found[$slug] = true;
			}
		}

		$ordered = array();
		foreach (self::MODULE_SLUGS as $slug) {
			if (isset($found[$slug])) {
				$ordered[] = $slug;
			}
		}

		return $ordered;
	}

	private function audit(int $id, string $nowSql, string $action, string $detail): void
	{
		$detail = preg_replace('/[\x00-\x1F\x7F]/', '', $detail) ?? '';
		$detail = substr($detail, 0, 255);
		$statement = $this->pdo->prepare(
			'INSERT INTO audit_events (license_id, occurred_at, actor, action, detail)
			 VALUES (:license_id, :occurred_at, :actor, :action, :detail)'
		);
		$statement->execute(array(
			'license_id' => $id,
			'occurred_at' => $nowSql,
			'actor' => 'sistem',
			'action' => $action,
			'detail' => $detail,
		));
	}

	private function secondsUntil(string $resetAt, DateTimeImmutable $now): int
	{
		$reset = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $resetAt, new DateTimeZone('UTC'));
		if (!$reset) {
			return $this->rateWindow;
		}
		$delta = $reset->getTimestamp() - $now->getTimestamp();

		return $delta > 0 ? $delta : 1;
	}

	private function isDuplicate(PDOException $e): bool
	{
		$code = (string) $e->getCode();
		$driver = isset($e->errorInfo[1]) ? (int) $e->errorInfo[1] : 0;

		return $code === '23000' || $code === '1062' || $driver === 1062;
	}

	private function isRetryableLock(PDOException $e): bool
	{
		$driver = isset($e->errorInfo[1]) ? (int) $e->errorInfo[1] : 0;

		return (string) $e->getCode() === '40001' || $driver === 1213 || $driver === 1205;
	}

	private function beginWrite(): void
	{
		if ($this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
			$this->pdo->exec('BEGIN IMMEDIATE');
			return;
		}
		$this->pdo->beginTransaction();
	}

	private function commitWrite(): void
	{
		if ($this->pdo->inTransaction()) {
			$this->pdo->commit();
			return;
		}
		$this->pdo->exec('COMMIT');
	}

	private function rollbackWrite(): void
	{
		if ($this->pdo->inTransaction()) {
			$this->pdo->rollBack();
			return;
		}
		$this->pdo->exec('ROLLBACK');
	}

	/**
	 * @param array<string, mixed> $body
	 * @param array<string, string> $headers
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function result(int $status, array $body, array $headers = array()): array
	{
		if (!isset($headers['Cache-Control'])) {
			$headers['Cache-Control'] = 'no-store';
		}

		return array(
			'status' => $status,
			'body' => $body,
			'headers' => $headers,
		);
	}
}
