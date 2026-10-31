<?php
/**
 * Eski lisans kayıtlarının aktarım uygunluğunu sayar.
 * Yazma, anahtar üretme ve hassas değer basma yoktur.
 */
declare(strict_types=1);

namespace QRLicense\License;

use DateTimeImmutable;
use DateTimeZone;
use PDO;

final class TransferAudit
{
	public const REASONS = array(
		'post_status',
		'status',
		'source_key',
		'target_hmac_mismatch',
		'target_hmac_duplicate',
		'domain_meta_missing',
		'domain_normalize',
		'invalid_date',
		'date_order',
		'modules',
		'field_length',
		'snapshot',
		'grants',
	);

	/**
	 * @param list<array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>}> $posts
	 * @param list<array{hmac:string,company_name:string,domain:?string,status:string,starts_on:?string,expires_on:?string,amount_paid:string,notes:string,tier_slug:?string,client_version:string,archived:bool,modules:list<string>}> $targets
	 * @return array{total:int,eklenebilir:int,zaten_mevcut:int,manuel_inceleme:int,neden:array<string,int>}
	 */
	public function classify(array $posts, array $targets, string $pepper): array
	{
		if (strlen($pepper) < 32) {
			throw new \InvalidArgumentException('pepper');
		}

		$byHmac = array();
		$duplicateHmacs = array();
		foreach ($targets as $target) {
			$hmac = $target['hmac'];
			if (isset($duplicateHmacs[$hmac])) {
				continue;
			}
			if (isset($byHmac[$hmac])) {
				unset($byHmac[$hmac]);
				$duplicateHmacs[$hmac] = true;
				continue;
			}
			$byHmac[$hmac] = $target;
		}

		$plainGroups = array();
		foreach ($posts as $index => $post) {
			$plain = $this->singleMeta($post, 'api_key');
			if (is_string($plain) && $this->usableKey($plain)) {
				$plainGroups[$plain][] = $index;
			}
		}

		$counts = array(
			'total' => count($posts),
			'eklenebilir' => 0,
			'zaten_mevcut' => 0,
			'manuel_inceleme' => 0,
			'neden' => array(),
		);
		foreach (self::REASONS as $reason) {
			$counts['neden'][$reason] = 0;
		}

		foreach ($posts as $index => $post) {
			$reasons = $this->reasonsFor($post);
			$plain = $this->singleMeta($post, 'api_key');
			if (is_string($plain) && $this->usableKey($plain) && count($plainGroups[$plain]) > 1) {
				$reasons[] = 'source_key';
			}
			if (is_string($plain) && $this->usableKey($plain)) {
				$hmac = hash_hmac('sha256', $plain, $pepper);
				if (isset($duplicateHmacs[$hmac])) {
					$reasons[] = 'target_hmac_duplicate';
				} elseif (isset($byHmac[$hmac])) {
					$target = $byHmac[$hmac];
					$mapped = $this->mappedFields($post);
					$matches = $mapped !== null && !$target['archived'] && $this->sameFields($mapped, $target);
					if (!$matches) {
						$reasons[] = 'target_hmac_mismatch';
					} elseif ($reasons === array()) {
						$counts['zaten_mevcut']++;
						continue;
					}
				}
			}
			$reasons = array_values(array_unique($reasons));
			if ($reasons !== array()) {
				$counts['manuel_inceleme']++;
				foreach ($reasons as $reason) {
					$counts['neden'][$reason]++;
				}
				continue;
			}
			$counts['eklenebilir']++;
		}

		return $counts;
	}

	/**
	 * @param array{total:int,eklenebilir:int,zaten_mevcut:int,manuel_inceleme:int,neden:array<string,int>} $counts
	 * @param array{source_engine:string,source_version:string,target_engine:string,target_version:string,snapshot:string,grants:string,error:string} $meta
	 */
	public function format(array $counts, array $meta): string
	{
		$lines = array(
			'kaynak_kayit: ' . $counts['total'],
			'eklenebilir: ' . $counts['eklenebilir'],
			'zaten_mevcut: ' . $counts['zaten_mevcut'],
			'manuel_inceleme: ' . $counts['manuel_inceleme'],
		);
		foreach (self::REASONS as $reason) {
			$lines[] = 'neden.' . $reason . ': ' . $counts['neden'][$reason];
		}
		$lines[] = 'hata_sinifi: ' . $meta['error'];
		$lines[] = 'kaynak_motor: ' . $meta['source_engine'];
		$lines[] = 'kaynak_surum: ' . $meta['source_version'];
		$lines[] = 'hedef_motor: ' . $meta['target_engine'];
		$lines[] = 'hedef_surum: ' . $meta['target_version'];
		$lines[] = 'tutarli_okuma: ' . $meta['snapshot'];
		$lines[] = 'salt_okunur_yetki: ' . $meta['grants'];
		$lines[] = 'saat_dilimi_onayi: verilmedi';

		return implode("\n", $lines) . "\n";
	}

	/**
	 * @param list<string> $lines
	 * @param list<string> $tables
	 */
	public static function grantsAreReadOnly(array $lines, string $database, array $tables): bool
	{
		if ($lines === array() || $database === '' || $tables === array()) {
			return false;
		}
		$covered = array();
		foreach ($lines as $line) {
			if (!is_string($line)) {
				return false;
			}
			$parsed = self::parseGrant($line);
			if ($parsed === null) {
				return false;
			}
			$scope = self::grantScope($parsed['database'], $parsed['table'], $database, $tables);
			if ($scope === array()) {
				continue;
			}
			if ($parsed['write'] || $parsed['grant_option']) {
				return false;
			}
			if ($parsed['select']) {
				foreach ($scope as $table) {
					$covered[$table] = true;
				}
			}
		}
		foreach ($tables as $table) {
			if (!isset($covered[$table])) {
				return false;
			}
		}

		return true;
	}

	public static function sameDatabase(string $leftDsn, string $rightDsn): ?bool
	{
		$left = self::databaseIdentity($leftDsn);
		$right = self::databaseIdentity($rightDsn);
		if ($left === null || $right === null) {
			return null;
		}

		return $left === $right;
	}

	public static function legacyNormalizeDomain(string $domain): string
	{
		$domain = self::legacySanitizeText($domain);
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
		$domain = preg_replace('#^www\.#', '', $domain) ?? $domain;
		$domain = preg_replace('~[/:?#].*$~', '', $domain) ?? $domain;

		return trim($domain, '.');
	}

	public function beginReadOnly(PDO $pdo): bool
	{
		try {
			$pdo->exec('SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ');
			$pdo->exec('START TRANSACTION READ ONLY');
		} catch (\Throwable $e) {
			return false;
		}

		return true;
	}

	/**
	 * @return array{posts:list<array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>}>,targets:list<array{hmac:string,company_name:string,domain:?string,status:string,starts_on:?string,expires_on:?string,amount_paid:string,notes:string,tier_slug:?string,client_version:string,archived:bool,modules:list<string>}>,pepper:string}
	 */
	public static function demonstration(): array
	{
		$pepper = str_repeat('s', 32);
		$posts = array(
			self::cleanPost('k1'),
			self::cleanPost('k2', array('durum' => 'pasif', 'domain' => 'https://www.Ornek.com/yol', 'expires_at' => '2026-12-31', 'start_date' => '2026-01-01', 'modules' => array('qr-masa', 'restoran-menu'))),
			self::cleanPost('k3', array('expires_at' => '2020-01-01')),
			self::cleanPost('k4', array('modules' => array('qr-masa', 'qr-masa'))),
			self::cleanPost('k5', array('durum' => null)),
			self::cleanPost('k6', array('durum' => 'active')),
			self::cleanPost('k7', array('post_status' => 'draft')),
			self::cleanPost('k8', array('post_status' => 'trash')),
			self::cleanPost('k9', array('domain' => null)),
			self::cleanPost('k10', array('expires_at' => '2026-02-31')),
			self::cleanPost('k11', array('modules' => array('qr-masa', 'sahte'))),
			self::cleanPost('k12', array('modules' => null)),
			self::cleanPost('k13', array('api_key' => null)),
			self::cleanPost('dup'),
			self::cleanPost('dup'),
			self::cleanPost('k16'),
			self::cleanPost('k17'),
			self::cleanPost('k18', array('title' => str_repeat('A', 192))),
			self::cleanPost('k19', array('amount_paid' => str_repeat('9', 65))),
			self::cleanPost('k20', array('notlar' => str_repeat('n', 4001))),
			self::cleanPost('k21', array('client_version' => str_repeat('v', 33))),
			self::cleanPost('k22', array('start_date' => '2026-05-02', 'expires_at' => '2026-05-01')),
			self::cleanPost('k23', array('domain' => 'bad%20host')),
			self::cleanPost('k24', array('post_status' => 'private')),
		);
		$same = self::cleanPost('k16');
		$mapped = (new self())->mappedFields($same);
		$targets = array();
		if ($mapped !== null) {
			$targets[] = array(
				'hmac' => hash_hmac('sha256', 'k16', $pepper),
				'company_name' => $mapped['company_name'],
				'domain' => $mapped['domain'],
				'status' => $mapped['status'],
				'starts_on' => $mapped['starts_on'],
				'expires_on' => $mapped['expires_on'],
				'amount_paid' => $mapped['amount_paid'],
				'notes' => $mapped['notes'],
				'tier_slug' => null,
				'client_version' => $mapped['client_version'],
				'archived' => false,
				'modules' => $mapped['modules'],
			);
		}
		$targets[] = array(
			'hmac' => hash_hmac('sha256', 'k17', $pepper),
			'company_name' => 'Baska',
			'domain' => null,
			'status' => 'aktif',
			'starts_on' => null,
			'expires_on' => null,
			'amount_paid' => '',
			'notes' => '',
			'tier_slug' => null,
			'client_version' => '1.0.0',
			'archived' => false,
			'modules' => array('qr-masa'),
		);

		return array('posts' => $posts, 'targets' => $targets, 'pepper' => $pepper);
	}

	/**
	 * @param array<string, mixed> $overrides
	 * @return array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>}
	 */
	public static function cleanPost(string $apiKey, array $overrides = array()): array
	{
		$modules = array_key_exists('modules', $overrides) ? $overrides['modules'] : array('qr-masa');
		$meta = array(
			'api_key' => array('rows' => array($apiKey)),
			'durum' => array('rows' => array('aktif')),
			'domain' => array('rows' => array('')),
			'allowed_modules' => array('rows' => array(serialize(is_array($modules) ? $modules : array()))),
			'expires_at' => array('rows' => array('')),
			'start_date' => array('rows' => array('')),
			'amount_paid' => array('rows' => array('')),
			'notlar' => array('rows' => array('')),
			'client_version' => array('rows' => array('1.0.0')),
		);
		if ($modules === null) {
			unset($meta['allowed_modules']);
		}
		foreach (array('durum', 'domain', 'expires_at', 'start_date', 'amount_paid', 'notlar', 'client_version', 'api_key') as $key) {
			if (!array_key_exists($key, $overrides)) {
				continue;
			}
			if ($overrides[$key] === null) {
				unset($meta[$key]);
				continue;
			}
			$meta[$key] = array('rows' => array((string) $overrides[$key]));
		}
		$post = array(
			'post_status' => isset($overrides['post_status']) ? (string) $overrides['post_status'] : 'publish',
			'post_title' => isset($overrides['title']) ? (string) $overrides['title'] : 'Firma',
			'meta' => $meta,
		);

		return $post;
	}

	/**
	 * @param array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>} $post
	 * @return list<string>
	 */
	private function reasonsFor(array $post): array
	{
		$reasons = array();
		if ($post['post_status'] !== 'publish') {
			$reasons[] = 'post_status';
		}
		if (!$this->metaPresent($post, 'durum') || $this->singleMeta($post, 'durum') === null || !in_array($this->singleMeta($post, 'durum'), array('aktif', 'pasif'), true)) {
			$reasons[] = 'status';
		}
		$plain = $this->singleMeta($post, 'api_key');
		if (!$this->metaPresent($post, 'api_key') || !$this->usableKey($plain)) {
			$reasons[] = 'source_key';
		}
		if (!$this->metaPresent($post, 'domain')) {
			$reasons[] = 'domain_meta_missing';
		} else {
			$domain = $this->singleMeta($post, 'domain');
			if ($domain === null) {
				$reasons[] = 'domain_normalize';
			} else {
				$legacy = self::legacyNormalizeDomain($domain);
				$current = Validator::normalizeDomain($domain);
				if ($legacy !== $current || strlen($current) > 191) {
					$reasons[] = 'domain_normalize';
				}
			}
		}
		$start = $this->dateMeta($post, 'start_date');
		$expires = $this->dateMeta($post, 'expires_at');
		if ($start === false || $expires === false) {
			$reasons[] = 'invalid_date';
		} elseif (is_string($start) && is_string($expires) && $expires < $start) {
			$reasons[] = 'date_order';
		}
		if ($this->moduleSlugs($post) === null) {
			$reasons[] = 'modules';
		}
		if ($this->textField($post['post_title'], 191, false) === null) {
			$reasons[] = 'field_length';
		}
		$amount = $this->metaPresent($post, 'amount_paid') ? $this->singleMeta($post, 'amount_paid') : '';
		$notes = $this->metaPresent($post, 'notlar') ? $this->singleMeta($post, 'notlar') : '';
		$version = $this->metaPresent($post, 'client_version') ? $this->singleMeta($post, 'client_version') : '';
		if ($amount === null || $this->textField((string) $amount, 64, true) === null) {
			$reasons[] = 'field_length';
		}
		if ($notes === null || $this->notesField($notes) === null) {
			$reasons[] = 'field_length';
		}
		if ($version === null || $this->versionUnsafe($version)) {
			$reasons[] = 'field_length';
		}

		return $reasons;
	}

	/**
	 * @param array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>} $post
	 * @return array{company_name:string,domain:?string,status:string,starts_on:?string,expires_on:?string,amount_paid:string,notes:string,client_version:string,modules:list<string>}|null
	 */
	private function mappedFields(array $post): ?array
	{
		if (!$this->metaPresent($post, 'domain')) {
			return null;
		}
		$domain = $this->singleMeta($post, 'domain');
		$normalized = $domain === null ? '' : Validator::normalizeDomain($domain);
		$modules = $this->moduleSlugs($post);
		$start = $this->dateMeta($post, 'start_date');
		$expires = $this->dateMeta($post, 'expires_at');
		$status = $this->singleMeta($post, 'durum');
		$company = $this->textField($post['post_title'], 191, false);
		$amount = $this->textField((string) ($this->singleMeta($post, 'amount_paid') ?? ''), 64, true);
		$notes = $this->notesField($this->singleMeta($post, 'notlar') ?? '');
		if ($modules === null || !is_string($status) || $company === null || $amount === null || $notes === null || $start === false || $expires === false) {
			return null;
		}

		return array(
			'company_name' => $company,
			'domain' => $normalized === '' ? null : $normalized,
			'status' => $status,
			'starts_on' => $start,
			'expires_on' => $expires,
			'amount_paid' => $amount,
			'notes' => $notes,
			'client_version' => (string) ($this->singleMeta($post, 'client_version') ?? ''),
			'modules' => $modules,
		);
	}

	/**
	 * @param array{company_name:string,domain:?string,status:string,starts_on:?string,expires_on:?string,amount_paid:string,notes:string,client_version:string,modules:list<string>} $mapped
	 * @param array{hmac:string,company_name:string,domain:?string,status:string,starts_on:?string,expires_on:?string,amount_paid:string,notes:string,tier_slug:?string,client_version:string,archived:bool,modules:list<string>} $target
	 */
	private function sameFields(array $mapped, array $target): bool
	{
		if ($target['tier_slug'] !== null && $target['tier_slug'] !== '') {
			return false;
		}
		$targetDomain = $target['domain'];
		if ($targetDomain !== null) {
			$targetDomain = Validator::normalizeDomain($targetDomain);
			if ($targetDomain === '') {
				$targetDomain = null;
			}
		}

		return $mapped['company_name'] === $target['company_name']
			&& $mapped['domain'] === $targetDomain
			&& $mapped['status'] === $target['status']
			&& $mapped['starts_on'] === $this->dateOnly($target['starts_on'])
			&& $mapped['expires_on'] === $this->dateOnly($target['expires_on'])
			&& $mapped['amount_paid'] === $target['amount_paid']
			&& $mapped['notes'] === $target['notes']
			&& $mapped['client_version'] === $target['client_version']
			&& $mapped['modules'] === $this->orderModules($target['modules']);
	}

	/**
	 * @param array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>} $post
	 */
	private function metaPresent(array $post, string $key): bool
	{
		return isset($post['meta'][$key]);
	}

	/**
	 * @param array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>} $post
	 */
	private function singleMeta(array $post, string $key): ?string
	{
		if (!isset($post['meta'][$key]['rows']) || $post['meta'][$key]['rows'] === array()) {
			return null;
		}
		$unique = array_values(array_unique($post['meta'][$key]['rows']));
		if (count($unique) !== 1) {
			return null;
		}

		return $unique[0];
	}

	/**
	 * @param array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>} $post
	 * @return string|null|false
	 */
	private function dateMeta(array $post, string $key)
	{
		if (!isset($post['meta'][$key])) {
			return null;
		}
		$value = $this->singleMeta($post, $key);
		if ($value === null) {
			return false;
		}
		if ($value === '') {
			return null;
		}
		if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) !== 1) {
			return false;
		}
		$parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $value, new DateTimeZone('UTC'));
		if (!$parsed || $parsed->format('Y-m-d') !== $value) {
			return false;
		}

		return $value;
	}

	private function dateOnly(?string $value): ?string
	{
		if ($value === null || $value === '') {
			return null;
		}
		if (preg_match('/^(\d{4}-\d{2}-\d{2})/', $value, $match) !== 1) {
			return $value;
		}

		return $match[1];
	}

	/**
	 * @param array{post_status:string,post_title:string,meta:array<string,array{rows:list<string>}>} $post
	 * @return list<string>|null
	 */
	private function moduleSlugs(array $post): ?array
	{
		if (!isset($post['meta']['allowed_modules']['rows']) || count($post['meta']['allowed_modules']['rows']) !== 1) {
			return null;
		}
		$raw = $post['meta']['allowed_modules']['rows'][0];
		if (preg_match('/(^|[;}])O:\d+:/', $raw) === 1 || strpos($raw, 'C:') !== false) {
			return null;
		}
		$decoded = @unserialize($raw, array('allowed_classes' => false));
		if (!is_array($decoded) || !array_is_list($decoded)) {
			return null;
		}
		$seen = array();
		foreach ($decoded as $slug) {
			if (!is_string($slug) || !in_array($slug, Validator::MODULE_SLUGS, true)) {
				return null;
			}
			$seen[$slug] = true;
		}

		return $this->orderModules(array_keys($seen));
	}

	/**
	 * @param list<string> $slugs
	 * @return list<string>
	 */
	private function orderModules(array $slugs): array
	{
		$set = array_fill_keys($slugs, true);
		$ordered = array();
		foreach (Validator::MODULE_SLUGS as $slug) {
			if (isset($set[$slug])) {
				$ordered[] = $slug;
			}
		}

		return $ordered;
	}

	private function blankKey(?string $plain): bool
	{
		if ($plain === null || $plain === '') {
			return true;
		}

		return preg_match('/^\s*$/u', $plain) === 1;
	}

	private function usableKey(?string $plain): bool
	{
		if (!is_string($plain) || $this->blankKey($plain)) {
			return false;
		}

		return preg_match('//u', $plain) === 1;
	}

	private function versionUnsafe(string $version): bool
	{
		if ($version === '') {
			return false;
		}
		if (strlen($version) > 32 || preg_match('/[\x00-\x1F\x7F]/', $version) === 1) {
			return true;
		}
		if (preg_match('//u', $version) !== 1) {
			return true;
		}

		return preg_match('/^\s|\s$/u', $version) === 1;
	}

	private function textField(string $value, int $max, bool $allowEmpty): ?string
	{
		if (preg_match('//u', $value) !== 1) {
			return null;
		}
		$value = trim($value);
		$length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
		if ((!$allowEmpty && $value === '') || $length > $max || preg_match('/[\x00-\x1F\x7F]/', $value) === 1) {
			return null;
		}

		return $value;
	}

	private function notesField(string $value): ?string
	{
		if (preg_match('//u', $value) !== 1) {
			return null;
		}
		$length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
		if ($length > 4000 || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value) === 1) {
			return null;
		}

		return $value;
	}

	private static function legacySanitizeText(string $value): string
	{
		if (function_exists('mb_convert_encoding')) {
			$converted = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
			if (is_string($converted)) {
				$value = $converted;
			}
		}
		if (strpos($value, '<') !== false) {
			$value = strip_tags($value);
		}
		$value = preg_replace('/[\r\n\t ]+/', ' ', $value) ?? $value;
		$value = trim($value);
		$found = false;
		while (preg_match('/%[a-f0-9]{2}/i', $value, $match) === 1) {
			$value = str_replace($match[0], '', $value);
			$found = true;
		}
		if ($found) {
			$value = trim(preg_replace('/ +/', ' ', $value) ?? $value);
		}

		return $value;
	}

	/**
	 * @return array{database:string,table:string,select:bool,write:bool,grant_option:bool}|null
	 */
	private static function parseGrant(string $line): ?array
	{
		$line = trim($line);
		if (preg_match('/^GRANT\s+(.+?)\s+ON\s+(.+?)\s+TO\s+/i', $line, $match) !== 1) {
			return null;
		}
		$target = $match[2];
		if (preg_match('/^(\*|[`A-Za-z0-9_]+)\.(\*|[`A-Za-z0-9_]+)$/', $target, $scope) !== 1) {
			return null;
		}
		$privs = strtoupper($match[1]);
		$tokens = preg_split('/\s*,\s*/', $privs);
		if (!is_array($tokens) || $tokens === array()) {
			return null;
		}
		$select = false;
		$write = false;
		foreach ($tokens as $token) {
			$token = trim($token);
			if ($token === 'USAGE') {
				continue;
			}
			if ($token === 'SELECT') {
				$select = true;
				continue;
			}
			$write = true;
		}

		return array(
			'database' => trim($scope[1], '`'),
			'table' => trim($scope[2], '`'),
			'select' => $select,
			'write' => $write,
			'grant_option' => stripos($line, 'GRANT OPTION') !== false,
		);
	}

	/**
	 * @param list<string> $tables
	 * @return list<string>
	 */
	private static function grantScope(string $database, string $table, string $expectedDatabase, array $tables): array
	{
		if ($database !== '*' && strcasecmp($database, $expectedDatabase) !== 0) {
			return array();
		}
		if ($table === '*') {
			return $tables;
		}
		if (in_array($table, $tables, true)) {
			return array($table);
		}

		return array();
	}

	/**
	 * @return array{0:string,1:string,2:string,3:string}|null
	 */
	private static function databaseIdentity(string $dsn): ?array
	{
		if (strncmp($dsn, 'mysql:', 6) !== 0) {
			return null;
		}
		$parts = array();
		foreach (explode(';', substr($dsn, 6)) as $piece) {
			if (strpos($piece, '=') === false) {
				continue;
			}
			$pair = explode('=', $piece, 2);
			$parts[strtolower($pair[0])] = $pair[1];
		}
		$database = $parts['dbname'] ?? '';
		if ($database === '') {
			return null;
		}
		$socket = $parts['unix_socket'] ?? '';
		if ($socket !== '') {
			return array('socket', $socket, '', $database);
		}
		$host = strtolower($parts['host'] ?? '');
		if ($host === '') {
			return null;
		}
		if ($host === 'localhost' || $host === '127.0.0.1' || $host === '::1') {
			$host = 'loopback';
		}

		return array('tcp', $host, $parts['port'] ?? '3306', $database);
	}
}
