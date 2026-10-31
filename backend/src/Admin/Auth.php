<?php
/**
 * Yönetici girişi, oturum ve CSRF.
 * Oturum belirteci çerezde taşınır; veritabanında yalnız SHA-256 özeti durur.
 */
declare(strict_types=1);

namespace QRLicense\Admin;

use DateTimeImmutable;
use DateTimeZone;
use PDO;
use PDOException;

final class Auth
{
	private PDO $pdo;

	private bool $requireHttps;

	private int $sessionTtl;

	private string $cookieName;

	/** @var callable():DateTimeImmutable */
	private $now;

	private int $loginLimit;

	private int $sessionLimit;

	private int $rateWindow;

	private string $dummyHash;

	/**
	 * @param callable():DateTimeImmutable|null $now
	 */
	public function __construct(
		PDO $pdo,
		bool $requireHttps = true,
		int $sessionTtl = 43200,
		string $cookieName = 'qrl_session',
		?callable $now = null,
		int $loginLimit = 5,
		int $sessionLimit = 60,
		int $rateWindow = 60
	) {
		$this->pdo = $pdo;
		$this->requireHttps = $requireHttps;
		$this->sessionTtl = $sessionTtl > 0 ? $sessionTtl : 43200;
		$this->cookieName = self::validCookieName($cookieName);
		$this->now = $now ?? static function (): DateTimeImmutable {
			return new DateTimeImmutable('now', new DateTimeZone('UTC'));
		};
		$this->loginLimit = $loginLimit > 0 ? $loginLimit : 5;
		$this->sessionLimit = $sessionLimit > 0 ? $sessionLimit : 60;
		$this->rateWindow = $rateWindow > 0 ? $rateWindow : 60;
		$this->dummyHash = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
		if (!is_string($this->dummyHash) || $this->dummyHash === '') {
			throw new \RuntimeException('Parola doğrulama hazır değil.');
		}
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function login(string $username, string $password, string $ip, bool $https): array
	{
		$limited = $this->consumeRateLimit('login:', $ip, $this->loginLimit);
		if (!$limited['allowed']) {
			return $this->rateLimited($limited['retry_after']);
		}

		if ($this->requireHttps && !$https) {
			return $this->error(403, 'https_required');
		}

		if ($username === '' || strlen($username) > 64 || $password === '' || strlen($password) > 128) {
			return $this->error(400, 'missing_field');
		}

		$admin = $this->findAdmin($username);
		$hash = $admin !== null ? $admin['password_hash'] : $this->dummyHash;
		$valid = password_verify($password, $hash);
		if ($admin === null || !$valid) {
			return $this->error(401, 'invalid_credentials');
		}

		if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
			$this->updatePasswordHash($admin['id'], password_hash($password, PASSWORD_DEFAULT));
		}

		$issued = $this->issueSession($admin['id']);

		return array(
			'status' => 200,
			'body' => array(
				'status' => 'ok',
				'username' => $admin['username'],
				'csrf_token' => $issued['csrf'],
			),
			'headers' => array(
				'Set-Cookie' => $this->cookie($issued['token'], $this->sessionTtl, $https || $this->requireHttps),
				'Cache-Control' => 'no-store',
			),
		);
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function logout(string $cookieHeader, string $csrfHeader, string $ip, bool $https): array
	{
		$decision = $this->authorize($cookieHeader, $csrfHeader, 'POST', $ip, $https);
		if (!$decision['ok']) {
			return $this->error($decision['status'], $decision['error'], $decision['retry_after']);
		}

		$this->beginWrite();
		try {
			$delete = $this->pdo->prepare('DELETE FROM admin_sessions WHERE id = :id');
			$delete->execute(array('id' => $decision['session_id']));
			$this->commitWrite();
		} catch (PDOException $e) {
			$this->rollbackWrite();
			throw $e;
		}

		return array(
			'status' => 200,
			'body' => array('status' => 'ok'),
			'headers' => array(
				'Set-Cookie' => $this->cookie('', 0, $https || $this->requireHttps),
				'Cache-Control' => 'no-store',
			),
		);
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function session(string $cookieHeader, string $ip, bool $https = false): array
	{
		$limited = $this->consumeRateLimit('session:', $ip, $this->sessionLimit);
		if (!$limited['allowed']) {
			return $this->rateLimited($limited['retry_after']);
		}

		$row = $this->loadSession($this->tokenFromCookie($cookieHeader, $https || $this->requireHttps));
		if ($row === null) {
			return array(
				'status' => 200,
				'body' => array('authenticated' => false),
				'headers' => array('Cache-Control' => 'no-store'),
			);
		}

		return array(
			'status' => 200,
			'body' => array(
				'authenticated' => true,
				'username' => $row['username'],
				'csrf_token' => $row['csrf_secret'],
			),
			'headers' => array('Cache-Control' => 'no-store'),
		);
	}

	/**
	 * Durum değiştiren yönetim istekleri CSRF ister. GET yalnız oturum ister.
	 *
	 * @return array{ok:true,session_id:int,admin_id:int,username:string}|array{ok:false,status:int,error:string,retry_after:int}
	 */
	public function authorize(string $cookieHeader, string $csrfHeader, string $method, string $ip, bool $https = false): array
	{
		$limited = $this->consumeRateLimit('session:', $ip, $this->sessionLimit);
		if (!$limited['allowed']) {
			return array(
				'ok' => false,
				'status' => 429,
				'error' => 'rate_limited',
				'retry_after' => $limited['retry_after'],
			);
		}

		$row = $this->loadSession($this->tokenFromCookie($cookieHeader, $https || $this->requireHttps));
		if ($row === null) {
			return array(
				'ok' => false,
				'status' => 401,
				'error' => 'unauthenticated',
				'retry_after' => 0,
			);
		}

		if ($this->isMutating($method) && !hash_equals($row['csrf_secret'], $csrfHeader)) {
			return array(
				'ok' => false,
				'status' => 403,
				'error' => 'invalid_csrf',
				'retry_after' => 0,
			);
		}

		return array(
			'ok' => true,
			'session_id' => $row['id'],
			'admin_id' => $row['admin_id'],
			'username' => $row['username'],
		);
	}

	public function createAdmin(string $username, string $password): void
	{
		if (!preg_match('/^[A-Za-z0-9._-]{1,64}$/', $username)) {
			throw new \RuntimeException('rejected');
		}
		if (strlen($password) < 12 || strlen($password) > 128) {
			throw new \RuntimeException('rejected');
		}

		$now = ($this->now)()->format('Y-m-d H:i:s');
		$hash = password_hash($password, PASSWORD_DEFAULT);
		if (!is_string($hash) || $hash === '') {
			throw new \RuntimeException('rejected');
		}

		$insert = $this->pdo->prepare(
			'INSERT INTO admins (username, password_hash, created_at, updated_at)
			 VALUES (:username, :password_hash, :created_at, :updated_at)'
		);
		try {
			$insert->execute(array(
				'username' => $username,
				'password_hash' => $hash,
				'created_at' => $now,
				'updated_at' => $now,
			));
		} catch (PDOException $e) {
			if ($this->isDuplicate($e)) {
				throw new \RuntimeException('rejected');
			}
			throw $e;
		}
	}

	/**
	 * @return array{id:int,username:string,password_hash:string}|null
	 */
	private function findAdmin(string $username): ?array
	{
		$statement = $this->pdo->prepare(
			'SELECT id, username, password_hash FROM admins WHERE username = :username LIMIT 1'
		);
		$statement->execute(array('username' => $username));
		$row = $statement->fetch();
		if (!is_array($row)) {
			return null;
		}

		return array(
			'id' => (int) $row['id'],
			'username' => (string) $row['username'],
			'password_hash' => (string) $row['password_hash'],
		);
	}

	private function updatePasswordHash(int $adminId, mixed $hash): void
	{
		if (!is_string($hash) || $hash === '') {
			return;
		}
		$now = ($this->now)()->format('Y-m-d H:i:s');
		$statement = $this->pdo->prepare(
			'UPDATE admins SET password_hash = :password_hash, updated_at = :updated_at WHERE id = :id'
		);
		$statement->execute(array(
			'password_hash' => $hash,
			'updated_at' => $now,
			'id' => $adminId,
		));
	}

	/**
	 * Eski oturumları siler ve yeni belirteç üretir.
	 *
	 * @return array{token:string,csrf:string}
	 */
	private function issueSession(int $adminId): array
	{
		$token = bin2hex(random_bytes(32));
		$csrf = bin2hex(random_bytes(32));
		$expires = ($this->now)()->modify('+' . $this->sessionTtl . ' seconds')->format('Y-m-d H:i:s');

		$this->beginWrite();
		try {
			$delete = $this->pdo->prepare('DELETE FROM admin_sessions WHERE admin_id = :admin_id');
			$delete->execute(array('admin_id' => $adminId));
			$insert = $this->pdo->prepare(
				'INSERT INTO admin_sessions (admin_id, token_hash, csrf_secret, expires_at)
				 VALUES (:admin_id, :token_hash, :csrf_secret, :expires_at)'
			);
			$insert->execute(array(
				'admin_id' => $adminId,
				'token_hash' => hash('sha256', $token),
				'csrf_secret' => $csrf,
				'expires_at' => $expires,
			));
			$this->commitWrite();
		} catch (PDOException $e) {
			$this->rollbackWrite();
			throw $e;
		}

		return array('token' => $token, 'csrf' => $csrf);
	}

	/**
	 * @return array{id:int,admin_id:int,username:string,csrf_secret:string}|null
	 */
	private function loadSession(string $token): ?array
	{
		if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
			return null;
		}

		$statement = $this->pdo->prepare(
			'SELECT s.id, s.admin_id, s.csrf_secret, s.expires_at, a.username
			 FROM admin_sessions s
			 INNER JOIN admins a ON a.id = s.admin_id
			 WHERE s.token_hash = :token_hash
			 LIMIT 1'
		);
		$statement->execute(array('token_hash' => hash('sha256', $token)));
		$row = $statement->fetch();
		if (!is_array($row)) {
			return null;
		}

		$now = ($this->now)()->format('Y-m-d H:i:s');
		if ((string) $row['expires_at'] <= $now) {
			$delete = $this->pdo->prepare('DELETE FROM admin_sessions WHERE id = :id');
			$delete->execute(array('id' => (int) $row['id']));
			return null;
		}

		return array(
			'id' => (int) $row['id'],
			'admin_id' => (int) $row['admin_id'],
			'username' => (string) $row['username'],
			'csrf_secret' => (string) $row['csrf_secret'],
		);
	}

	private function tokenFromCookie(string $cookieHeader, bool $secure): string
	{
		if ($cookieHeader === '') {
			return '';
		}
		$wanted = $this->cookieLabel($secure);
		$parts = explode(';', $cookieHeader);
		foreach ($parts as $part) {
			$pair = explode('=', trim($part), 2);
			if (count($pair) !== 2) {
				continue;
			}
			if ($pair[0] !== $wanted) {
				continue;
			}
			return rawurldecode($pair[1]);
		}

		return '';
	}

	private function cookieLabel(bool $secure): string
	{
		if ($secure) {
			return '__Host-' . $this->cookieName;
		}

		return $this->cookieName;
	}

	private function cookie(string $token, int $maxAge, bool $secure): string
	{
		$parts = array(
			$this->cookieLabel($secure) . '=' . $token,
			'Path=/',
			'Max-Age=' . $maxAge,
			'HttpOnly',
			'SameSite=Lax',
		);
		if ($secure) {
			$parts[] = 'Secure';
		}

		return implode('; ', $parts);
	}

	private function isMutating(string $method): bool
	{
		return in_array(strtoupper($method), array('POST', 'PUT', 'PATCH', 'DELETE'), true);
	}

	/**
	 * @return array{allowed:bool,retry_after:int}
	 */
	private function consumeRateLimit(string $prefix, string $ip, int $max): array
	{
		$identity = $ip !== '' ? $ip : 'unknown';
		$bucket = $prefix . hash('sha256', $identity);
		$now = ($this->now)();
		$reset = $now->modify('+' . $this->rateWindow . ' seconds');
		$nowSql = $now->format('Y-m-d H:i:s');
		$resetSql = $reset->format('Y-m-d H:i:s');

		for ($attempt = 0; $attempt < 3; $attempt++) {
			try {
				return $this->writeRateLimit($bucket, $max, $now, $nowSql, $resetSql);
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
	 * @return array{allowed:bool,retry_after:int}
	 */
	private function writeRateLimit(string $bucket, int $max, DateTimeImmutable $now, string $nowSql, string $resetSql): array
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

			if ($hits >= $max) {
				$this->commitWrite();
				return array('allowed' => false, 'retry_after' => $this->secondsUntil($resetAt, $now));
			}

			$update = $this->pdo->prepare(
				'UPDATE rate_buckets SET hits = hits + 1 WHERE bucket = :bucket AND hits < :max AND reset_at > :now'
			);
			$update->execute(array(
				'bucket' => $bucket,
				'max' => $max,
				'now' => $nowSql,
			));
			if ($update->rowCount() !== 1) {
				$this->commitWrite();
				return array('allowed' => false, 'retry_after' => $this->secondsUntil($resetAt, $now));
			}

			$this->commitWrite();
			return array('allowed' => true, 'retry_after' => 0);
		} catch (PDOException $e) {
			$this->rollbackWrite();
			throw $e;
		}
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

	private function isDuplicate(PDOException $e): bool
	{
		$code = (string) $e->getCode();
		$message = $e->getMessage();
		$driver = isset($e->errorInfo[1]) ? (int) $e->errorInfo[1] : 0;
		if ($code === '23000' || $driver === 1062 || str_contains($message, 'UNIQUE') || str_contains($message, '1062')) {
			return true;
		}

		return false;
	}

	private function isRetryableLock(PDOException $e): bool
	{
		$driver = isset($e->errorInfo[1]) ? (int) $e->errorInfo[1] : 0;

		return (string) $e->getCode() === '40001' || $driver === 1213 || $driver === 1205;
	}

	private static function validCookieName(string $name): string
	{
		if (preg_match('/^[A-Za-z0-9_-]{1,64}$/', $name)) {
			return $name;
		}

		return 'qrl_session';
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function error(int $status, string $error, int $retryAfter = 0): array
	{
		$headers = array('Cache-Control' => 'no-store');
		if ($retryAfter > 0) {
			$headers['Retry-After'] = (string) $retryAfter;
		}

		return array(
			'status' => $status,
			'body' => array('status' => 'error', 'error' => $error),
			'headers' => $headers,
		);
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function rateLimited(int $retryAfter): array
	{
		return $this->error(429, 'rate_limited', $retryAfter > 0 ? $retryAfter : 1);
	}
}
