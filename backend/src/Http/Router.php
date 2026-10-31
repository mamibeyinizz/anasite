<?php
/**
 * Lisans doğrulama ve yönetici kimlik doğrulama yolları.
 * /wp-json/qmls/v1/validate geçici olarak /v1/validate ile aynı işleyiciye gider.
 * Yönlendirme yoktur.
 */
declare(strict_types=1);

namespace QRLicense\Http;

use QRLicense\Admin\Auth;
use QRLicense\License\LicenseAdmin;
use QRLicense\License\Validator;

final class Router
{
	private const MAX_BODY = 8192;

	private const ADMIN_MAX_BODY = 32768;

	private Validator $validator;

	private ?Auth $auth;

	private ?LicenseAdmin $licenses;

	public function __construct(Validator $validator, ?Auth $auth = null, ?LicenseAdmin $licenses = null)
	{
		$this->validator = $validator;
		$this->auth = $auth;
		$this->licenses = $licenses;
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function dispatch(
		string $method,
		string $uri,
		string $rawBody,
		string $ip,
		bool $https = true,
		string $cookieHeader = '',
		string $csrfHeader = '',
		?string $contentType = null
	): array {
		$path = parse_url($uri, PHP_URL_PATH);
		$path = is_string($path) ? $path : '/';
		if ($path !== '/' && str_ends_with($path, '/')) {
			$path = rtrim($path, '/');
		}

		if ($path === '/api/admin/login' || $path === '/api/admin/logout' || $path === '/api/admin/session') {
			return $this->admin($path, $method, $rawBody, $ip, $https, $cookieHeader, $csrfHeader, $contentType);
		}

		if ($this->isLicensePath($path)) {
			return $this->licenses($path, $method, $uri, $rawBody, $ip, $https, $cookieHeader, $csrfHeader, $contentType);
		}

		if ($path !== '/v1/validate' && $path !== '/wp-json/qmls/v1/validate') {
			return array(
				'status' => 404,
				'body' => array('status' => 'not_found'),
				'headers' => array(),
			);
		}

		if (strtoupper($method) !== 'POST') {
			return array(
				'status' => 405,
				'body' => array('status' => 'method_not_allowed'),
				'headers' => array('Allow' => 'POST'),
			);
		}

		$media = $this->requireJson($contentType, $rawBody);
		if ($media !== null) {
			return $media;
		}

		if (strlen($rawBody) > self::MAX_BODY) {
			return $this->badRequest('invalid_json');
		}

		try {
			$payload = json_decode($rawBody, true, 8, JSON_THROW_ON_ERROR);
		} catch (\JsonException $e) {
			return $this->badRequest('invalid_json');
		}

		if (!is_array($payload)) {
			return $this->badRequest('invalid_json');
		}

		if (!array_key_exists('api_key', $payload) || !is_string($payload['api_key']) || trim($payload['api_key']) === '') {
			return $this->badRequest('missing_field');
		}
		if (!array_key_exists('domain', $payload) || !is_string($payload['domain'])) {
			return $this->badRequest('missing_field');
		}
		if (strlen($payload['api_key']) > 128 || strlen($payload['domain']) > 512) {
			return $this->badRequest('missing_field');
		}

		$version = '';
		if (array_key_exists('version', $payload)) {
			if (!is_string($payload['version'])) {
				return $this->badRequest('missing_field');
			}
			$version = $payload['version'];
		}

		return $this->validator->validate($payload['api_key'], $payload['domain'], $version, $ip);
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function admin(
		string $path,
		string $method,
		string $rawBody,
		string $ip,
		bool $https,
		string $cookieHeader,
		string $csrfHeader,
		?string $contentType
	): array {
		if ($this->auth === null) {
			return array(
				'status' => 404,
				'body' => array('status' => 'not_found'),
				'headers' => array(),
			);
		}

		$method = strtoupper($method);
		if ($path === '/api/admin/session') {
			if ($method !== 'GET') {
				return array(
					'status' => 405,
					'body' => array('status' => 'method_not_allowed'),
					'headers' => array('Allow' => 'GET'),
				);
			}

			return $this->auth->session($cookieHeader, $ip, $https);
		}

		if ($method !== 'POST') {
			return array(
				'status' => 405,
				'body' => array('status' => 'method_not_allowed'),
				'headers' => array('Allow' => 'POST'),
			);
		}

		if ($path === '/api/admin/logout') {
			return $this->auth->logout($cookieHeader, $csrfHeader, $ip, $https);
		}

		$media = $this->requireJson($contentType, $rawBody);
		if ($media !== null) {
			return $media;
		}

		if (strlen($rawBody) > self::MAX_BODY) {
			return $this->badRequest('invalid_json');
		}

		try {
			$payload = json_decode($rawBody, true, 8, JSON_THROW_ON_ERROR);
		} catch (\JsonException $e) {
			return $this->badRequest('invalid_json');
		}
		if (!is_array($payload)) {
			return $this->badRequest('invalid_json');
		}

		$username = $payload['username'] ?? null;
		$password = $payload['password'] ?? null;
		if (!is_string($username) || !is_string($password)) {
			return $this->badRequest('missing_field');
		}

		return $this->auth->login($username, $password, $ip, $https);
	}

	private function isLicensePath(string $path): bool
	{
		if ($path === '/api/admin/summary' || $path === '/api/admin/licenses' || $path === '/api/admin/audit' || $path === '/api/admin/tiers') {
			return true;
		}

		return preg_match('#^/api/admin/licenses/[0-9]+(?:/(?:reveal-key|regenerate-key|unlock-domain|archive))?$#', $path) === 1;
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function licenses(
		string $path,
		string $method,
		string $uri,
		string $rawBody,
		string $ip,
		bool $https,
		string $cookieHeader,
		string $csrfHeader,
		?string $contentType
	): array {
		if ($this->auth === null || $this->licenses === null) {
			return array(
				'status' => 404,
				'body' => array('status' => 'not_found'),
				'headers' => array(),
			);
		}

		$method = strtoupper($method);
		$allowed = $this->licenseMethods($path);
		if (!in_array($method, $allowed, true)) {
			return array(
				'status' => 405,
				'body' => array('status' => 'method_not_allowed'),
				'headers' => array('Allow' => implode(', ', $allowed)),
			);
		}

		$decision = $this->auth->authorize($cookieHeader, $csrfHeader, $method, $ip, $https);
		if (!$decision['ok']) {
			$headers = array('Cache-Control' => 'no-store');
			if ($decision['retry_after'] > 0) {
				$headers['Retry-After'] = (string) $decision['retry_after'];
			}

			return array(
				'status' => $decision['status'],
				'body' => array('status' => 'error', 'error' => $decision['error']),
				'headers' => $headers,
			);
		}

		$actor = $decision['username'];
		if ($path === '/api/admin/summary') {
			return $this->licenses->summary();
		}
		if ($path === '/api/admin/tiers') {
			return $this->licenses->tiers();
		}
		if ($path === '/api/admin/licenses' && $method === 'GET') {
			return $this->licenses->listLicenses($this->query($uri));
		}
		if ($path === '/api/admin/audit') {
			return $this->licenses->auditLog($this->query($uri));
		}

		$payload = array();
		if ($method === 'POST' || $method === 'PATCH') {
			$media = $this->requireJson($contentType, $rawBody);
			if ($media !== null) {
				return $media;
			}
			if (strlen($rawBody) > self::ADMIN_MAX_BODY) {
				return $this->badRequest('invalid_json');
			}
			if ($rawBody !== '') {
				try {
					$decoded = json_decode($rawBody, true, 8, JSON_THROW_ON_ERROR);
				} catch (\JsonException $e) {
					return $this->badRequest('invalid_json');
				}
				if (!is_array($decoded) || (array_is_list($decoded) && $decoded !== array())) {
					return $this->badRequest('invalid_json');
				}
				$payload = $decoded;
			}
		}

		if ($path === '/api/admin/licenses') {
			return $this->licenses->create($payload, $actor);
		}

		if (!preg_match('#^/api/admin/licenses/([0-9]+)(?:/([a-z-]+))?$#', $path, $match)) {
			return array(
				'status' => 404,
				'body' => array('status' => 'not_found'),
				'headers' => array(),
			);
		}
		if (preg_match('/^[1-9][0-9]{0,17}$/', $match[1]) !== 1 || (string) (int) $match[1] !== $match[1]) {
			return $this->badRequest('invalid_id');
		}
		$id = (int) $match[1];
		$action = $match[2] ?? '';
		if ($action === '' && $method === 'GET') {
			return $this->licenses->detail($id);
		}
		if ($action === '' && $method === 'PATCH') {
			return $this->licenses->update($id, $payload, $actor);
		}
		if ($action === 'reveal-key') {
			return $this->licenses->reveal($id, $actor);
		}
		if ($action === 'regenerate-key') {
			return $this->licenses->regenerate($id, $payload, $actor);
		}
		if ($action === 'unlock-domain') {
			return $this->licenses->unlockDomain($id, $payload, $actor);
		}
		if ($action === 'archive') {
			return $this->licenses->archive($id, $actor);
		}

		return array(
			'status' => 404,
			'body' => array('status' => 'not_found'),
			'headers' => array(),
		);
	}

	/**
	 * @return list<string>
	 */
	private function licenseMethods(string $path): array
	{
		if ($path === '/api/admin/summary' || $path === '/api/admin/audit' || $path === '/api/admin/tiers') {
			return array('GET');
		}
		if ($path === '/api/admin/licenses') {
			return array('GET', 'POST');
		}
		if (preg_match('#^/api/admin/licenses/[0-9]+$#', $path) === 1) {
			return array('GET', 'PATCH');
		}

		return array('POST');
	}

	/**
	 * @return array<string, mixed>
	 */
	private function query(string $uri): array
	{
		$raw = parse_url($uri, PHP_URL_QUERY);
		if (!is_string($raw) || $raw === '') {
			return array();
		}
		$parsed = array();
		parse_str($raw, $parsed);

		return $parsed;
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}|null
	 */
	private function requireJson(?string $contentType, string $rawBody): ?array
	{
		if ($contentType === null || $rawBody === '') {
			return null;
		}
		$media = strtolower(trim(explode(';', $contentType, 2)[0]));
		if ($media === 'application/json') {
			return null;
		}

		return array(
			'status' => 415,
			'body' => array('status' => 'error', 'error' => 'unsupported_media_type'),
			'headers' => array(
				'Accept' => 'application/json',
				'Cache-Control' => 'no-store',
			),
		);
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function badRequest(string $error): array
	{
		return array(
			'status' => 400,
			'body' => array('status' => 'error', 'error' => $error),
			'headers' => array(),
		);
	}
}
