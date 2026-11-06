<?php
/**
 * Müşteri hesapları: üye ol, giriş, çıkış, profil, parola, test siparişi, hesabı silme.
 * Yönetici oturumundan (Admin\Auth) ayrıdır: ayrı tablo, ayrı çerez.
 * Oturum belirteci çerezde taşınır; veritabanında yalnız SHA-256 özeti durur.
 * Durum değiştiren istekler X-CSRF-Token ister (giriş ve üye ol hariç).
 */
declare(strict_types=1);

namespace QRLicense\Account;

use DateTimeImmutable;
use DateTimeZone;
use PDO;
use PDOException;

final class Accounts
{
	public const PLANS = array('temel', 'pro', 'plus');

	public const PERIODS = array('monthly', 'annual');

	private const MAX_SESSIONS = 10;

	private const MAX_ORDERS = 50;

	private PDO $pdo;

	private bool $requireHttps;

	private int $ttl;

	private string $cookieName;

	private bool $testOrders;

	/** @var callable():DateTimeImmutable */
	private $now;

	private string $dummyHash;

	private string $siteUrl;

	/** @var callable(string,string,string):bool */
	private $mailer;

	/**
	 * @param callable():DateTimeImmutable|null $now
	 * @param callable(string,string,string):bool|null $mailer (alıcı, konu, metin) → gönderildi mi
	 */
	public function __construct(
		PDO $pdo,
		bool $requireHttps = true,
		int $ttl = 2592000,
		string $cookieName = 'qrc_session',
		bool $testOrders = true,
		?callable $now = null,
		string $siteUrl = '',
		?callable $mailer = null
	) {
		$this->siteUrl = rtrim($siteUrl, '/');
		$this->mailer = $mailer ?? static function (): bool {
			return false;
		};
		$this->pdo = $pdo;
		$this->requireHttps = $requireHttps;
		$this->ttl = $ttl > 0 ? $ttl : 2592000;
		$this->cookieName = preg_match('/^[A-Za-z0-9_-]{1,64}$/', $cookieName) === 1 ? $cookieName : 'qrc_session';
		$this->testOrders = $testOrders;
		$this->now = $now ?? static function (): DateTimeImmutable {
			return new DateTimeImmutable('now', new DateTimeZone('UTC'));
		};
		$this->dummyHash = (string) password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
	}

	/**
	 * @param array<string, mixed> $data
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function handle(string $method, string $path, array $data, string $ip, bool $https, string $cookie, string $csrf): array
	{
		$method = strtoupper($method);
		$route = array(
			'GET /api/account/me' => 'me',
			'POST /api/account/register' => 'register',
			'POST /api/account/login' => 'login',
			'POST /api/account/logout' => 'logout',
			'PATCH /api/account/profile' => 'profile',
			'POST /api/account/password' => 'password',
			'POST /api/account/orders' => 'order',
			'DELETE /api/account' => 'delete',
			'POST /api/account/forgot' => 'forgot',
			'POST /api/account/reset' => 'reset',
			'POST /api/account/verify' => 'verify',
			'POST /api/account/verify/resend' => 'resend',
			'POST /api/account/email' => 'email',
		);
		$key = ($method === 'HEAD' ? 'GET' : $method) . ' ' . $path;
		if (!isset($route[$key])) {
			$known = false;
			foreach (array_keys($route) as $r) {
				if (str_ends_with($r, ' ' . $path)) {
					$known = true;
				}
			}

			return $known
				? $this->error(405, 'method_not_allowed')
				: $this->error(404, 'not_found');
		}
		$action = $route[$key];

		$limit = $this->limit($action, $ip);
		if ($limit > 0) {
			return $this->error(429, 'rate_limited', array(), $limit);
		}

		if ($action === 'register') {
			return $this->register($data, $https);
		}
		if ($action === 'login') {
			return $this->login($data, $https);
		}
		if ($action === 'forgot') {
			return $this->forgot($data);
		}
		if ($action === 'reset') {
			return $this->reset($data);
		}
		if ($action === 'verify') {
			return $this->verify($data);
		}

		$session = $this->loadSession($this->tokenFromCookie($cookie, $https));
		if ($action === 'me') {
			if ($session === null) {
				return $this->ok(array('authenticated' => false));
			}

			return $this->ok($this->meBody($session));
		}
		if ($session === null) {
			return $this->error(401, 'unauthenticated');
		}
		if (!hash_equals($session['csrf_secret'], $csrf)) {
			return $this->error(403, 'invalid_csrf');
		}

		switch ($action) {
			case 'logout':
				$this->run('DELETE FROM customer_sessions WHERE id = :id', array('id' => $session['id']));

				return $this->ok(array('status' => 'ok'), array('Set-Cookie' => $this->cookie('', 0, $https)));
			case 'profile':
				return $this->updateProfile($session, $data);
			case 'password':
				return $this->changePassword($session, $data);
			case 'order':
				return $this->createOrder($session, $data);
			case 'resend':
				return $this->resend($session);
			case 'email':
				return $this->changeEmail($session, $data);
			default:
				return $this->deleteAccount($session, $data, $https);
		}
	}

	/* ------------------------------------------------------------ eylemler */

	/**
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function register(array $d, bool $https): array
	{
		if ($this->requireHttps && !$https) {
			return $this->error(403, 'https_required');
		}
		$fields = array();
		$email = $this->email($d['email'] ?? null, $fields);
		$name = $this->name($d['name'] ?? null, $fields);
		$password = $this->newPassword($d['password'] ?? null, $fields);
		$business = $this->text($d['business'] ?? '', 120);
		$phone = $this->phone($d['phone'] ?? '', $fields);
		if (($d['terms'] ?? false) !== true) {
			$fields['terms'] = 'Devam etmek için onaylayın.';
		}
		if ($fields !== array()) {
			return $this->error(422, 'validation', $fields);
		}

		$now = $this->nowSql();
		try {
			$this->run(
				'INSERT INTO customers (email, password_hash, name, business, phone, domain, terms_accepted_at, created_at, updated_at, last_login_at)
				 VALUES (:email, :hash, :name, :business, :phone, \'\', :now, :now2, :now3, :now4)',
				array(
					'email' => $email,
					'hash' => password_hash($password, PASSWORD_DEFAULT),
					'name' => $name,
					'business' => $business,
					'phone' => $phone,
					'now' => $now,
					'now2' => $now,
					'now3' => $now,
					'now4' => $now,
				)
			);
		} catch (PDOException $e) {
			if ($this->isDuplicate($e)) {
				return $this->error(409, 'email_taken', array('email' => 'Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.'));
			}
			throw $e;
		}
		$id = (int) $this->pdo->lastInsertId();
		$this->sendToken($id, 'verify', $email, null);

		return $this->startSession($id, $https, 201);
	}

	/**
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function login(array $d, bool $https): array
	{
		if ($this->requireHttps && !$https) {
			return $this->error(403, 'https_required');
		}
		$email = isset($d['email']) && is_string($d['email']) ? strtolower(trim($d['email'])) : '';
		$password = isset($d['password']) && is_string($d['password']) ? $d['password'] : '';
		if ($email === '' || $password === '' || strlen($email) > 191 || strlen($password) > 128) {
			return $this->error(400, 'missing_field');
		}
		$wait = $this->consume('acc-login-mail:', $email, 10, 900);
		if ($wait > 0) {
			return $this->error(429, 'rate_limited', array(), $wait);
		}

		$row = $this->one('SELECT id, password_hash FROM customers WHERE email = :email LIMIT 1', array('email' => $email));
		$hash = $row !== null ? (string) $row['password_hash'] : $this->dummyHash;
		$valid = password_verify($password, $hash);
		if ($row === null || !$valid) {
			return $this->error(401, 'invalid_credentials');
		}
		$id = (int) $row['id'];
		if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
			$this->run('UPDATE customers SET password_hash = :h WHERE id = :id', array('h' => password_hash($password, PASSWORD_DEFAULT), 'id' => $id));
		}
		$this->run('UPDATE customers SET last_login_at = :now WHERE id = :id', array('now' => $this->nowSql(), 'id' => $id));

		return $this->startSession($id, $https, 200);
	}

	/**
	 * @param array{id:int,customer_id:int,csrf_secret:string} $s
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function updateProfile(array $s, array $d): array
	{
		$fields = array();
		$name = $this->name($d['name'] ?? null, $fields);
		$business = $this->text($d['business'] ?? '', 120);
		$phone = $this->phone($d['phone'] ?? '', $fields);
		$domain = $this->domain($d['domain'] ?? '', $fields);
		if ($fields !== array()) {
			return $this->error(422, 'validation', $fields);
		}
		$this->run(
			'UPDATE customers SET name = :name, business = :business, phone = :phone, domain = :domain, updated_at = :now WHERE id = :id',
			array('name' => $name, 'business' => $business, 'phone' => $phone, 'domain' => $domain, 'now' => $this->nowSql(), 'id' => $s['customer_id'])
		);

		return $this->ok($this->meBody($s));
	}

	/**
	 * @param array{id:int,customer_id:int,csrf_secret:string} $s
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function changePassword(array $s, array $d): array
	{
		$current = isset($d['current']) && is_string($d['current']) ? $d['current'] : '';
		$fields = array();
		$new = $this->newPassword($d['password'] ?? null, $fields);
		if ($current === '' || strlen($current) > 128) {
			$fields['current'] = 'Mevcut parolanızı yazın.';
		}
		if ($fields !== array()) {
			return $this->error(422, 'validation', $fields);
		}
		if (!$this->passwordMatches($s['customer_id'], $current)) {
			return $this->error(422, 'validation', array('current' => 'Mevcut parola yanlış.'));
		}
		$this->run(
			'UPDATE customers SET password_hash = :h, updated_at = :now WHERE id = :id',
			array('h' => password_hash($new, PASSWORD_DEFAULT), 'now' => $this->nowSql(), 'id' => $s['customer_id'])
		);
		$this->run('DELETE FROM customer_tokens WHERE customer_id = :c AND kind = \'reset\'', array('c' => $s['customer_id']));
		/* Diğer cihazlardaki oturumlar kapanır; bu oturum açık kalır. */
		$this->run('DELETE FROM customer_sessions WHERE customer_id = :c AND id <> :id', array('c' => $s['customer_id'], 'id' => $s['id']));

		return $this->ok(array('status' => 'ok'));
	}

	/**
	 * @param array{id:int,customer_id:int,csrf_secret:string} $s
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function createOrder(array $s, array $d): array
	{
		if (!$this->testOrders) {
			return $this->error(403, 'orders_closed');
		}
		$plan = $d['plan'] ?? null;
		$period = $d['period'] ?? null;
		if (!is_string($plan) || !in_array($plan, self::PLANS, true) || !is_string($period) || !in_array($period, self::PERIODS, true)) {
			return $this->error(422, 'validation', array('plan' => 'Paket ya da dönem geçersiz.'));
		}
		$count = $this->one('SELECT COUNT(*) AS n FROM customer_orders WHERE customer_id = :c', array('c' => $s['customer_id']));
		if ($count !== null && (int) $count['n'] >= self::MAX_ORDERS) {
			return $this->error(429, 'order_limit');
		}
		$ref = '';
		for ($try = 0; $try < 5; $try++) {
			$ref = 'QMO-' . $this->randomRef(6);
			try {
				$this->run(
					'INSERT INTO customer_orders (customer_id, ref, plan, period, status, created_at) VALUES (:c, :ref, :plan, :period, \'test\', :now)',
					array('c' => $s['customer_id'], 'ref' => $ref, 'plan' => $plan, 'period' => $period, 'now' => $this->nowSql())
				);
				break;
			} catch (PDOException $e) {
				if (!$this->isDuplicate($e) || $try === 4) {
					throw $e;
				}
			}
		}

		return $this->ok(array('status' => 'ok', 'ref' => $ref) + $this->meBody($s), array(), 201);
	}

	/**
	 * @param array{id:int,customer_id:int,csrf_secret:string} $s
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function deleteAccount(array $s, array $d, bool $https): array
	{
		$password = isset($d['password']) && is_string($d['password']) ? $d['password'] : '';
		if ($password === '' || strlen($password) > 128 || !$this->passwordMatches($s['customer_id'], $password)) {
			return $this->error(422, 'validation', array('password' => 'Parola yanlış.'));
		}
		$id = $s['customer_id'];
		$this->run('DELETE FROM customer_tokens WHERE customer_id = :c', array('c' => $id));
		$this->run('DELETE FROM customer_orders WHERE customer_id = :c', array('c' => $id));
		$this->run('DELETE FROM customer_sessions WHERE customer_id = :c', array('c' => $id));
		$this->run('DELETE FROM customers WHERE id = :c', array('c' => $id));

		return $this->ok(array('status' => 'ok'), array('Set-Cookie' => $this->cookie('', 0, $https)));
	}

	/* ------------------------------------------------------------ kurtarma / doğrulama */

	/**
	 * Parola sıfırlama bağlantısı ister. E-posta kayıtlı olsun olmasın aynı yanıtı verir.
	 *
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function forgot(array $d): array
	{
		$email = isset($d['email']) && is_string($d['email']) ? strtolower(trim($d['email'])) : '';
		if ($email === '' || strlen($email) > 191 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
			return $this->error(422, 'validation', array('email' => 'Geçerli bir e-posta adresi yazın.'));
		}
		$wait = $this->consume('acc-forgot-mail:', $email, 3, 3600);
		if ($wait === 0) {
			$row = $this->one('SELECT id FROM customers WHERE email = :e LIMIT 1', array('e' => $email));
			if ($row !== null) {
				$this->sendToken((int) $row['id'], 'reset', $email, null);
			}
		}

		return $this->ok(array('status' => 'ok'));
	}

	/**
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function reset(array $d): array
	{
		$fields = array();
		$password = $this->newPassword($d['password'] ?? null, $fields);
		if ($fields !== array()) {
			return $this->error(422, 'validation', $fields);
		}
		$tok = $this->useToken($d['token'] ?? null, 'reset');
		if ($tok === null) {
			return $this->error(410, 'invalid_token');
		}
		$id = $tok['customer_id'];
		$this->run('UPDATE customers SET password_hash = :h, updated_at = :now WHERE id = :id', array('h' => password_hash($password, PASSWORD_DEFAULT), 'now' => $this->nowSql(), 'id' => $id));
		$this->run('DELETE FROM customer_sessions WHERE customer_id = :c', array('c' => $id));
		$this->run('DELETE FROM customer_tokens WHERE customer_id = :c AND kind = \'reset\'', array('c' => $id));

		return $this->ok(array('status' => 'ok'));
	}

	/**
	 * E-posta doğrulama ve e-posta değiştirme bağlantısı (oturum gerekmez).
	 *
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function verify(array $d): array
	{
		$tok = $this->useToken($d['token'] ?? null, null);
		if ($tok === null || ($tok['kind'] !== 'verify' && $tok['kind'] !== 'email')) {
			return $this->error(410, 'invalid_token');
		}
		$id = $tok['customer_id'];
		if ($tok['kind'] === 'email' && $tok['new_email'] !== null) {
			try {
				$this->run('UPDATE customers SET email = :e, email_verified_at = :now, updated_at = :now2 WHERE id = :id', array('e' => $tok['new_email'], 'now' => $this->nowSql(), 'now2' => $this->nowSql(), 'id' => $id));
			} catch (PDOException $e) {
				if ($this->isDuplicate($e)) {
					return $this->error(409, 'email_taken');
				}
				throw $e;
			}
			$this->run('DELETE FROM customer_tokens WHERE customer_id = :c AND kind = \'email\'', array('c' => $id));
		} else {
			$this->run('UPDATE customers SET email_verified_at = :now WHERE id = :id AND email_verified_at IS NULL', array('now' => $this->nowSql(), 'id' => $id));
			$this->run('DELETE FROM customer_tokens WHERE customer_id = :c AND kind = \'verify\'', array('c' => $id));
		}

		return $this->ok(array('status' => 'ok', 'kind' => $tok['kind']));
	}

	/**
	 * @param array{id:int,customer_id:int,csrf_secret:string} $s
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function resend(array $s): array
	{
		$c = $this->one('SELECT email, email_verified_at FROM customers WHERE id = :id', array('id' => $s['customer_id']));
		if ($c === null || $c['email_verified_at'] !== null) {
			return $this->error(409, 'already_verified');
		}
		if (!$this->sendToken($s['customer_id'], 'verify', (string) $c['email'], null)) {
			return $this->error(503, 'mail_failed');
		}

		return $this->ok(array('status' => 'ok'));
	}

	/**
	 * Yeni adrese doğrulama bağlantısı gönderir; adres bağlantı tıklanınca değişir.
	 *
	 * @param array{id:int,customer_id:int,csrf_secret:string} $s
	 * @param array<string, mixed> $d
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function changeEmail(array $s, array $d): array
	{
		$fields = array();
		$email = $this->email($d['email'] ?? null, $fields);
		$password = isset($d['password']) && is_string($d['password']) ? $d['password'] : '';
		if ($fields !== array()) {
			return $this->error(422, 'validation', $fields);
		}
		if ($password === '' || strlen($password) > 128 || !$this->passwordMatches($s['customer_id'], $password)) {
			return $this->error(422, 'validation', array('password' => 'Parola yanlış.'));
		}
		if ($this->one('SELECT id FROM customers WHERE email = :e', array('e' => $email)) !== null) {
			return $this->error(422, 'validation', array('email' => 'Bu e-posta başka bir hesapta kayıtlı.'));
		}
		if (!$this->sendToken($s['customer_id'], 'email', $email, $email)) {
			return $this->error(503, 'mail_failed');
		}

		return $this->ok($this->meBody($s));
	}

	private function pendingEmail(int $customerId): ?string
	{
		$row = $this->one(
			'SELECT new_email FROM customer_tokens WHERE customer_id = :c AND kind = \'email\' AND expires_at > :now ORDER BY id DESC LIMIT 1',
			array('c' => $customerId, 'now' => $this->nowSql())
		);

		return $row === null ? null : (string) $row['new_email'];
	}

	/** Belirteci üretir, özetini saklar, bağlantıyı e-postayla gönderir. */
	private function sendToken(int $customerId, string $kind, string $to, ?string $newEmail): bool
	{
		$token = bin2hex(random_bytes(32));
		$ttl = $kind === 'reset' ? 3600 : 86400;
		$now = ($this->now)();
		$this->run('DELETE FROM customer_tokens WHERE customer_id = :c AND kind = :k', array('c' => $customerId, 'k' => $kind));
		$this->run(
			'INSERT INTO customer_tokens (customer_id, kind, token_hash, new_email, created_at, expires_at) VALUES (:c, :k, :h, :n, :now, :exp)',
			array('c' => $customerId, 'k' => $kind, 'h' => hash('sha256', $token), 'n' => $newEmail, 'now' => $now->format('Y-m-d H:i:s'), 'exp' => $now->modify('+' . $ttl . ' seconds')->format('Y-m-d H:i:s'))
		);
		$base = $this->siteUrl;
		if ($kind === 'reset') {
			$subject = 'QR Menu Official: parolanızı sıfırlayın';
			$body = "Merhaba,\n\nParolanızı sıfırlamak için aşağıdaki bağlantıyı açın (1 saat geçerlidir):\n\n" . $base . '/giris/?sifirla=' . $token . "\n\nBu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz; parolanız değişmez.\n\nQR Menu Official";
		} else {
			$subject = $kind === 'email' ? 'QR Menu Official: yeni e-posta adresinizi onaylayın' : 'QR Menu Official: e-posta adresinizi doğrulayın';
			$body = "Merhaba,\n\nE-posta adresinizi onaylamak için aşağıdaki bağlantıyı açın (24 saat geçerlidir):\n\n" . $base . '/giris/?dogrula=' . $token . "\n\nBu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz.\n\nQR Menu Official";
		}
		try {
			return ($this->mailer)($to, $subject, $body);
		} catch (\Throwable $e) {
			error_log('qr-account-mail ' . $e::class);

			return false;
		}
	}

	/**
	 * Geçerli (süresi dolmamış) belirteci bulur; kullanım sonrası silme çağıran yönteme aittir.
	 *
	 * @return array{customer_id:int,kind:string,new_email:?string}|null
	 */
	private function useToken(mixed $token, ?string $kind): ?array
	{
		if (!is_string($token) || preg_match('/^[a-f0-9]{64}$/', $token) !== 1) {
			return null;
		}
		$row = $this->one('SELECT customer_id, kind, new_email, expires_at FROM customer_tokens WHERE token_hash = :h', array('h' => hash('sha256', $token)));
		if ($row === null || (string) $row['expires_at'] <= $this->nowSql() || ($kind !== null && $row['kind'] !== $kind)) {
			return null;
		}

		return array('customer_id' => (int) $row['customer_id'], 'kind' => (string) $row['kind'], 'new_email' => $row['new_email'] === null ? null : (string) $row['new_email']);
	}

	/* ------------------------------------------------------------ doğrulama */

	/**
	 * @param array<string, string> $fields
	 */
	private function email(mixed $v, array &$fields): string
	{
		$e = is_string($v) ? strtolower(trim($v)) : '';
		if ($e === '' || strlen($e) > 191 || filter_var($e, FILTER_VALIDATE_EMAIL) === false) {
			$fields['email'] = 'Geçerli bir e-posta adresi yazın.';

			return '';
		}

		return $e;
	}

	/**
	 * @param array<string, string> $fields
	 */
	private function name(mixed $v, array &$fields): string
	{
		$n = $this->text($v, 120);
		if (mb_strlen($n) < 3 || !str_contains($n, ' ')) {
			$fields['name'] = 'Ad ve soyadınızı yazın.';
		}

		return $n;
	}

	/**
	 * @param array<string, string> $fields
	 */
	private function newPassword(mixed $v, array &$fields): string
	{
		$p = is_string($v) ? $v : '';
		if (strlen($p) < 10 || strlen($p) > 128) {
			$fields['password'] = 'Parola en az 10, en çok 128 karakter olmalı.';
		}

		return $p;
	}

	/**
	 * @param array<string, string> $fields
	 */
	private function phone(mixed $v, array &$fields): string
	{
		$p = $this->text($v, 32);
		if ($p !== '' && (preg_match('/^[0-9 +()\-]+$/', $p) !== 1 || strlen((string) preg_replace('/\D/', '', $p)) < 10)) {
			$fields['phone'] = 'Telefonu alan koduyla yazın.';
		}

		return $p;
	}

	/**
	 * @param array<string, string> $fields
	 */
	private function domain(mixed $v, array &$fields): string
	{
		$d = strtolower($this->text($v, 191));
		if ($d === '') {
			return '';
		}
		$d = (string) preg_replace('#^https?://#', '', $d);
		$d = rtrim((string) preg_replace('#[/?\#].*$#', '', $d), '.');
		if (preg_match('/^([a-z0-9-]+\.)+[a-z]{2,}$/', $d) !== 1) {
			$fields['domain'] = 'Alan adını ornek.com biçiminde yazın.';

			return '';
		}

		return $d;
	}

	/** Denetim karakterlerini atar, boşlukları sadeleştirir, uzunluğu keser. */
	private function text(mixed $v, int $max): string
	{
		if (!is_string($v)) {
			return '';
		}
		$t = trim((string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v));
		$t = trim((string) preg_replace('/\s+/u', ' ', $t));

		return mb_substr($t, 0, $max);
	}

	/* ------------------------------------------------------------ oturum */

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function startSession(int $customerId, bool $https, int $status): array
	{
		$token = bin2hex(random_bytes(32));
		$csrf = bin2hex(random_bytes(32));
		$now = $this->now;
		$this->run(
			'INSERT INTO customer_sessions (customer_id, token_hash, csrf_secret, created_at, expires_at) VALUES (:c, :t, :csrf, :now, :exp)',
			array(
				'c' => $customerId,
				't' => hash('sha256', $token),
				'csrf' => $csrf,
				'now' => $now()->format('Y-m-d H:i:s'),
				'exp' => $now()->modify('+' . $this->ttl . ' seconds')->format('Y-m-d H:i:s'),
			)
		);
		/* Süresi dolanlar ve en eski fazla oturumlar silinir. */
		$this->run('DELETE FROM customer_sessions WHERE customer_id = :c AND expires_at <= :now', array('c' => $customerId, 'now' => $this->nowSql()));
		$stmt = $this->pdo->prepare('SELECT id FROM customer_sessions WHERE customer_id = :c ORDER BY id DESC');
		$stmt->execute(array('c' => $customerId));
		$ids = array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN));
		foreach (array_slice($ids, self::MAX_SESSIONS) as $old) {
			$this->run('DELETE FROM customer_sessions WHERE id = :id', array('id' => $old));
		}

		$session = array('id' => 0, 'customer_id' => $customerId, 'csrf_secret' => $csrf);

		return $this->ok($this->meBody($session), array('Set-Cookie' => $this->cookie($token, $this->ttl, $https)), $status);
	}

	/**
	 * @return array{id:int,customer_id:int,csrf_secret:string}|null
	 */
	private function loadSession(string $token): ?array
	{
		if (preg_match('/^[a-f0-9]{64}$/', $token) !== 1) {
			return null;
		}
		$row = $this->one(
			'SELECT id, customer_id, csrf_secret, expires_at FROM customer_sessions WHERE token_hash = :t LIMIT 1',
			array('t' => hash('sha256', $token))
		);
		if ($row === null) {
			return null;
		}
		if ((string) $row['expires_at'] <= $this->nowSql()) {
			$this->run('DELETE FROM customer_sessions WHERE id = :id', array('id' => (int) $row['id']));

			return null;
		}

		return array('id' => (int) $row['id'], 'customer_id' => (int) $row['customer_id'], 'csrf_secret' => (string) $row['csrf_secret']);
	}

	/**
	 * @param array{id:int,customer_id:int,csrf_secret:string} $s
	 * @return array<string, mixed>
	 */
	private function meBody(array $s): array
	{
		$c = $this->one(
			'SELECT email, name, business, phone, domain, created_at, last_login_at, email_verified_at FROM customers WHERE id = :id',
			array('id' => $s['customer_id'])
		);
		if ($c === null) {
			return array('authenticated' => false);
		}
		$stmt = $this->pdo->prepare('SELECT ref, plan, period, status, created_at FROM customer_orders WHERE customer_id = :c ORDER BY id DESC LIMIT 50');
		$stmt->execute(array('c' => $s['customer_id']));
		$orders = array();
		foreach ($stmt->fetchAll() as $o) {
			$orders[] = array(
				'ref' => (string) $o['ref'],
				'plan' => (string) $o['plan'],
				'period' => (string) $o['period'],
				'status' => (string) $o['status'],
				'created_at' => $this->iso((string) $o['created_at']),
			);
		}

		return array(
			'authenticated' => true,
			'csrf_token' => $s['csrf_secret'],
			'test_orders' => $this->testOrders,
			'customer' => array(
				'email' => (string) $c['email'],
				'name' => (string) $c['name'],
				'business' => (string) $c['business'],
				'phone' => (string) $c['phone'],
				'domain' => (string) $c['domain'],
				'created_at' => $this->iso((string) $c['created_at']),
				'last_login_at' => $c['last_login_at'] === null ? null : $this->iso((string) $c['last_login_at']),
				'email_verified' => $c['email_verified_at'] !== null,
				'pending_email' => $this->pendingEmail($s['customer_id']),
			),
			'orders' => $orders,
		);
	}

	private function passwordMatches(int $customerId, string $password): bool
	{
		$row = $this->one('SELECT password_hash FROM customers WHERE id = :id', array('id' => $customerId));

		return $row !== null && password_verify($password, (string) $row['password_hash']);
	}

	private function tokenFromCookie(string $header, bool $https): string
	{
		$wanted = $this->label($https);
		foreach (explode(';', $header) as $part) {
			$pair = explode('=', trim($part), 2);
			if (count($pair) === 2 && $pair[0] === $wanted) {
				return rawurldecode($pair[1]);
			}
		}

		return '';
	}

	private function label(bool $https): string
	{
		return ($https || $this->requireHttps) ? '__Host-' . $this->cookieName : $this->cookieName;
	}

	private function cookie(string $token, int $maxAge, bool $https): string
	{
		$secure = $https || $this->requireHttps;
		$parts = array($this->label($https) . '=' . $token, 'Path=/', 'Max-Age=' . $maxAge, 'HttpOnly', 'SameSite=Lax');
		if ($secure) {
			$parts[] = 'Secure';
		}

		return implode('; ', $parts);
	}

	/* ------------------------------------------------------------ hız sınırı */

	/** Saniye cinsinden bekleme (0: serbest). */
	private function limit(string $action, string $ip): int
	{
		$caps = array('register' => array(5, 600), 'login' => array(10, 60), 'password' => array(5, 300), 'delete' => array(5, 300), 'order' => array(20, 60), 'forgot' => array(5, 600), 'reset' => array(10, 600), 'verify' => array(20, 600), 'resend' => array(3, 600), 'email' => array(5, 600));
		$cap = $caps[$action] ?? array(120, 60);

		return $this->consume('acc-' . $action . ':', $ip !== '' ? $ip : 'unknown', $cap[0], $cap[1]);
	}

	private function consume(string $prefix, string $identity, int $max, int $window): int
	{
		$bucket = $prefix . hash('sha256', $identity);
		$now = ($this->now)();
		$nowSql = $now->format('Y-m-d H:i:s');
		$reset = $now->modify('+' . $window . ' seconds')->format('Y-m-d H:i:s');

		$this->pdo->beginTransaction();
		try {
			$sql = 'SELECT hits, reset_at FROM rate_buckets WHERE bucket = :b';
			if ($this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
				$sql .= ' FOR UPDATE';
			}
			$st = $this->pdo->prepare($sql);
			$st->execute(array('b' => $bucket));
			$row = $st->fetch();
			$wait = 0;
			if (!is_array($row)) {
				$this->pdo->prepare('INSERT INTO rate_buckets (bucket, hits, reset_at) VALUES (:b, 1, :r)')->execute(array('b' => $bucket, 'r' => $reset));
			} elseif ((string) $row['reset_at'] <= $nowSql) {
				$this->pdo->prepare('UPDATE rate_buckets SET hits = 1, reset_at = :r WHERE bucket = :b')->execute(array('b' => $bucket, 'r' => $reset));
			} elseif ((int) $row['hits'] >= $max) {
				$until = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', (string) $row['reset_at'], new DateTimeZone('UTC'));
				$wait = $until ? max(1, $until->getTimestamp() - $now->getTimestamp()) : $window;
			} else {
				$this->pdo->prepare('UPDATE rate_buckets SET hits = hits + 1 WHERE bucket = :b')->execute(array('b' => $bucket));
			}
			$this->pdo->commit();

			return $wait;
		} catch (PDOException $e) {
			if ($this->pdo->inTransaction()) {
				$this->pdo->rollBack();
			}
			/* Eşzamanlı ilk istek (UNIQUE çakışması) ya da kilit: sınırı aşmış sayma, ama sessizce geçirme. */
			if ($this->isDuplicate($e)) {
				return 0;
			}
			throw $e;
		}
	}

	/* ------------------------------------------------------------ yardımcılar */

	private function nowSql(): string
	{
		return ($this->now)()->format('Y-m-d H:i:s');
	}

	private function iso(string $sql): string
	{
		return str_replace(' ', 'T', $sql) . 'Z';
	}

	private function randomRef(int $len): string
	{
		$alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		$out = '';
		for ($i = 0; $i < $len; $i++) {
			$out .= $alphabet[random_int(0, strlen($alphabet) - 1)];
		}

		return $out;
	}

	/**
	 * @param array<string, mixed> $params
	 */
	private function run(string $sql, array $params): void
	{
		$this->pdo->prepare($sql)->execute($params);
	}

	/**
	 * @param array<string, mixed> $params
	 * @return array<string, mixed>|null
	 */
	private function one(string $sql, array $params): ?array
	{
		$st = $this->pdo->prepare($sql);
		$st->execute($params);
		$row = $st->fetch();

		return is_array($row) ? $row : null;
	}

	private function isDuplicate(PDOException $e): bool
	{
		$driver = isset($e->errorInfo[1]) ? (int) $e->errorInfo[1] : 0;

		return (string) $e->getCode() === '23000' || $driver === 1062 || str_contains($e->getMessage(), 'UNIQUE');
	}

	/**
	 * @param array<string, mixed> $body
	 * @param array<string, string> $headers
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function ok(array $body, array $headers = array(), int $status = 200): array
	{
		return array('status' => $status, 'body' => $body, 'headers' => $headers + array('Cache-Control' => 'no-store'));
	}

	/**
	 * @param array<string, string> $fields
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function error(int $status, string $error, array $fields = array(), int $retryAfter = 0): array
	{
		$body = array('status' => 'error', 'error' => $error);
		if ($fields !== array()) {
			$body['fields'] = $fields;
		}
		$headers = array('Cache-Control' => 'no-store');
		if ($retryAfter > 0) {
			$headers['Retry-After'] = (string) $retryAfter;
		}

		return array('status' => $status, 'body' => $body, 'headers' => $headers);
	}
}
