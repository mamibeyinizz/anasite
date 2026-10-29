<?php
/**
 * Yönetici lisans kayıtları.
 * HTTP katmanı önce Auth::authorize() çağırmalıdır.
 * Domain kilidi burada yazılmaz; onu yalnız doğrulama API'si edinir.
 */
declare(strict_types=1);

namespace QRLicense\License;

use DateTimeImmutable;
use DateTimeZone;
use PDO;
use PDOException;
use RuntimeException;

final class LicenseAdmin
{
	/** @var list<int> */
	private const PAGE_SIZES = array(10, 20, 50, 100);

	/** @var array<string, string> */
	private const SORTS = array(
		'created_at' => 'created_at',
		'company_name' => 'company_name',
		'expires_on' => 'expires_on',
		'updated_at' => 'updated_at',
	);

	/** @var array<string, string> */
	private const DIRECTIONS = array(
		'asc' => 'ASC',
		'desc' => 'DESC',
	);

	/** @var list<string> */
	private const WRITE_FIELDS = array(
		'company_name',
		'status',
		'tier',
		'modules',
		'starts_on',
		'expires_on',
		'amount_paid',
		'notes',
	);

	private PDO $pdo;

	private Keys $keys;

	/** @var callable(): DateTimeImmutable */
	private $now;

	/**
	 * @param callable(): DateTimeImmutable|null $now
	 */
	public function __construct(PDO $pdo, Keys $keys, ?callable $now = null)
	{
		$this->pdo = $pdo;
		$this->keys = $keys;
		$this->now = $now ?? static function (): DateTimeImmutable {
			return new DateTimeImmutable('now', new DateTimeZone('UTC'));
		};
		if ($this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
			$this->pdo->exec('PRAGMA busy_timeout = 5000');
		}
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function summary(): array
	{
		$today = ($this->now)()->format('Y-m-d');
		$statement = $this->pdo->prepare(
			'SELECT
				COUNT(*) AS total,
				COALESCE(SUM(CASE
					WHEN status = \'aktif\' AND (expires_on IS NULL OR expires_on >= :today_usable)
					THEN 1 ELSE 0 END), 0) AS usable,
				COALESCE(SUM(CASE WHEN status = \'pasif\' THEN 1 ELSE 0 END), 0) AS inactive,
				COALESCE(SUM(CASE
					WHEN status = \'aktif\' AND expires_on IS NOT NULL AND expires_on < :today_expired
					THEN 1 ELSE 0 END), 0) AS expired
			 FROM licenses
			 WHERE archived_at IS NULL'
		);
		$statement->execute(array(
			'today_usable' => $today,
			'today_expired' => $today,
		));
		$row = $statement->fetch();
		if (!is_array($row)) {
			$row = array('total' => 0, 'usable' => 0, 'inactive' => 0, 'expired' => 0);
		}

		return $this->ok(array(
			'total' => (int) $row['total'],
			'usable' => (int) $row['usable'],
			'inactive' => (int) $row['inactive'],
			'expired' => (int) $row['expired'],
		));
	}

	/**
	 * Seed paketleri ve modül şablonları. Lisans satırına yazmaz.
	 *
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function tiers(): array
	{
		$statement = $this->pdo->query('SELECT slug, label FROM tiers ORDER BY sort_order ASC, slug ASC');
		$rows = $statement === false ? array() : $statement->fetchAll();
		$tiers = array();
		if (is_array($rows)) {
			foreach ($rows as $row) {
				if (!is_array($row) || !isset($row['slug']) || !is_string($row['slug'])) {
					continue;
				}
				$tiers[] = array(
					'slug' => $row['slug'],
					'label' => isset($row['label']) && is_string($row['label']) ? $row['label'] : $row['slug'],
					'modules' => $this->templateModules($row['slug']),
				);
			}
		}

		return $this->ok(array('tiers' => $tiers));
	}

	/**
	 * @param array<string, mixed> $query
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function listLicenses(array $query): array
	{
		$parsed = $this->listQuery($query);
		if (isset($parsed['error'])) {
			return $parsed['error'];
		}

		$where = $parsed['where'];
		$params = $parsed['params'];
		$sqlWhere = implode(' AND ', $where);
		$count = $this->pdo->prepare('SELECT COUNT(*) FROM licenses WHERE ' . $sqlWhere);
		$count->execute($params);
		$total = (int) $count->fetchColumn();

		$list = $this->pdo->prepare(
			'SELECT id, company_name, api_key_encrypted, domain, status, starts_on, expires_on,
			        amount_paid, notes, tier_slug, last_seen_at, client_version, archived_at,
			        created_at, updated_at
			 FROM licenses
			 WHERE ' . $sqlWhere . '
			 ORDER BY ' . $parsed['sort'] . ' ' . $parsed['direction'] . ', id ASC
			 LIMIT :limit OFFSET :offset'
		);
		foreach ($params as $name => $value) {
			$list->bindValue(':' . $name, $value);
		}
		$list->bindValue(':limit', $parsed['per_page'], PDO::PARAM_INT);
		$list->bindValue(':offset', $parsed['offset'], PDO::PARAM_INT);
		$list->execute();

		$licenses = array();
		while (($row = $list->fetch()) !== false) {
			if (!is_array($row)) {
				continue;
			}
			$licenses[] = $this->present($row, $this->modulesFor((int) $row['id']));
		}

		return $this->ok(array(
			'page' => $parsed['page'],
			'per_page' => $parsed['per_page'],
			'total' => $total,
			'licenses' => $licenses,
		));
	}

	/**
	 * @param array<string, mixed> $payload
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function create(array $payload, string $actor): array
	{
		$unknown = $this->unknownFields($payload, self::WRITE_FIELDS);
		if ($unknown !== array()) {
			return $this->fail(422, 'invalid_field', $unknown);
		}

		$fields = $this->creationFields($payload);
		if (isset($fields['error'])) {
			return $fields['error'];
		}

		try {
			$sealed = $this->seal($this->keys->generate());
		} catch (RuntimeException $e) {
			return $this->fail(500, 'key_unavailable');
		}

		$now = $this->nowSql();
		$this->beginWrite();
		try {
			$insert = $this->pdo->prepare(
				'INSERT INTO licenses (
					company_name, api_key_hmac, api_key_encrypted, domain, status, starts_on, expires_on,
					amount_paid, notes, tier_slug, client_version, archived_at, created_at, updated_at
				) VALUES (
					:company_name, :api_key_hmac, :api_key_encrypted, NULL, :status, :starts_on, :expires_on,
					:amount_paid, :notes, :tier_slug, \'\', NULL, :created_at, :updated_at
				)'
			);
			$insert->bindValue(':company_name', $fields['company_name']);
			$insert->bindValue(':api_key_hmac', $sealed['hmac']);
			$insert->bindValue(':api_key_encrypted', $sealed['encrypted'], PDO::PARAM_STR);
			$insert->bindValue(':status', $fields['status']);
			$this->bindNullable($insert, ':starts_on', $fields['starts_on']);
			$this->bindNullable($insert, ':expires_on', $fields['expires_on']);
			$insert->bindValue(':amount_paid', $fields['amount_paid']);
			$insert->bindValue(':notes', $fields['notes']);
			$this->bindNullable($insert, ':tier_slug', $fields['tier']);
			$insert->bindValue(':created_at', $now);
			$insert->bindValue(':updated_at', $now);
			$insert->execute();
			$id = (int) $this->pdo->lastInsertId();
			$this->replaceModules($id, $fields['modules']);
			$this->audit($id, $actor, 'olusturuldu', $fields['tier'] ?? 'ozel');
			$this->commitWrite();
		} catch (PDOException $e) {
			$this->rollbackWrite();
			if ($this->isDuplicate($e)) {
				return $this->fail(500, 'key_unavailable');
			}
			throw $e;
		} catch (RuntimeException $e) {
			$this->rollbackWrite();
			return $this->fail(500, 'key_unavailable');
		}

		$row = $this->readLicense($id);
		if ($row === null) {
			return $this->fail(500, 'key_unavailable');
		}

		return $this->ok(array(
			'license' => $this->present($row, $fields['modules'], $sealed['plain']),
			'api_key' => $sealed['plain'],
		));
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function detail(int $id): array
	{
		$row = $this->readLicense($id);
		if ($row === null) {
			return $this->fail(404, 'not_found');
		}

		return $this->ok(array(
			'license' => $this->present($row, $this->modulesFor($id)),
		));
	}

	/**
	 * @param array<string, mixed> $payload
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function update(int $id, array $payload, string $actor): array
	{
		$unknown = $this->unknownFields($payload, self::WRITE_FIELDS);
		if ($unknown !== array()) {
			return $this->fail(422, 'invalid_field', $unknown);
		}
		if ($payload === array()) {
			return $this->fail(422, 'invalid_field');
		}

		$changes = $this->updateFields($payload);
		if (isset($changes['error'])) {
			return $changes['error'];
		}

		$this->beginWrite();
		try {
			$row = $this->lockLicense($id);
			if ($row === null) {
				$this->rollbackWrite();
				return $this->fail(404, 'not_found');
			}
			if ($this->isArchived($row)) {
				$this->rollbackWrite();
				return $this->fail(409, 'archived');
			}

			$next = $this->mergeUpdate($row, $changes['values']);
			if (isset($next['error'])) {
				$this->rollbackWrite();
				return $next['error'];
			}

			$now = $this->nowSql();
			$update = $this->pdo->prepare(
				'UPDATE licenses
				 SET company_name = :company_name, status = :status, starts_on = :starts_on,
				     expires_on = :expires_on, amount_paid = :amount_paid, notes = :notes,
				     tier_slug = :tier_slug, updated_at = :updated_at
				 WHERE id = :id AND archived_at IS NULL'
			);
			$update->bindValue(':company_name', $next['company_name']);
			$update->bindValue(':status', $next['status']);
			$this->bindNullable($update, ':starts_on', $next['starts_on']);
			$this->bindNullable($update, ':expires_on', $next['expires_on']);
			$update->bindValue(':amount_paid', $next['amount_paid']);
			$update->bindValue(':notes', $next['notes']);
			$this->bindNullable($update, ':tier_slug', $next['tier']);
			$update->bindValue(':updated_at', $now);
			$update->bindValue(':id', $id, PDO::PARAM_INT);
			$update->execute();
			if ($update->rowCount() !== 1 && !$this->stillOpen($id)) {
				$this->rollbackWrite();
				return $this->fail(409, 'conflict');
			}
			if ($next['replace_modules']) {
				$this->replaceModules($id, $next['modules']);
			}
			$this->audit($id, $actor, 'guncellendi', implode(',', $changes['names']));
			$this->commitWrite();
		} catch (PDOException $e) {
			$this->rollbackWrite();
			throw $e;
		} catch (RuntimeException $e) {
			$this->rollbackWrite();
			return $this->fail(500, 'key_unavailable');
		}

		$fresh = $this->readLicense($id);
		if ($fresh === null) {
			return $this->fail(404, 'not_found');
		}

		return $this->ok(array(
			'license' => $this->present($fresh, $this->modulesFor($id)),
		));
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function reveal(int $id, string $actor): array
	{
		$this->beginWrite();
		try {
			$row = $this->lockLicense($id);
			if ($row === null) {
				$this->rollbackWrite();
				return $this->fail(404, 'not_found');
			}
			$plain = $this->keys->decrypt($this->blob($row['api_key_encrypted']));
			if (!$this->ciphertextMatches($row, $plain)) {
				$this->rollbackWrite();
				return $this->fail(500, 'key_unavailable');
			}
			$this->audit($id, $actor, 'anahtar_goruntulendi', '');
			$this->commitWrite();
		} catch (RuntimeException $e) {
			$this->rollbackWrite();
			return $this->fail(500, 'key_unavailable');
		} catch (PDOException $e) {
			$this->rollbackWrite();
			throw $e;
		}

		return $this->ok(array('api_key' => $plain));
	}

	/**
	 * @param array<string, mixed> $payload
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function regenerate(int $id, array $payload, string $actor): array
	{
		$confirmed = $this->confirmed($payload);
		if ($confirmed !== null) {
			return $confirmed;
		}

		$preview = $this->readLicense($id);
		if ($preview === null) {
			return $this->fail(404, 'not_found');
		}
		if ($this->isArchived($preview)) {
			return $this->fail(409, 'archived');
		}
		$seenHmac = (string) $preview['api_key_hmac'];

		try {
			$sealed = $this->seal($this->keys->generate());
		} catch (RuntimeException $e) {
			return $this->fail(500, 'key_unavailable');
		}

		$this->alignRegenRace();
		$this->beginWrite();
		try {
			$row = $this->lockLicense($id);
			if ($row === null) {
				$this->rollbackWrite();
				return $this->fail(404, 'not_found');
			}
			if ($this->isArchived($row)) {
				$this->rollbackWrite();
				return $this->fail(409, 'archived');
			}
			if ((string) $row['api_key_hmac'] !== $seenHmac) {
				$this->rollbackWrite();
				return $this->fail(409, 'conflict');
			}

			$update = $this->pdo->prepare(
				'UPDATE licenses
				 SET api_key_hmac = :hmac, api_key_encrypted = :encrypted, updated_at = :updated
				 WHERE id = :id AND archived_at IS NULL AND api_key_hmac = :previous'
			);
			$update->bindValue(':hmac', $sealed['hmac']);
			$update->bindValue(':encrypted', $sealed['encrypted'], PDO::PARAM_STR);
			$update->bindValue(':updated', $this->nowSql());
			$update->bindValue(':id', $id, PDO::PARAM_INT);
			$update->bindValue(':previous', $seenHmac);
			$update->execute();
			if ($update->rowCount() !== 1) {
				$this->rollbackWrite();
				return $this->fail(409, 'conflict');
			}
			$this->audit($id, $actor, 'anahtar_yenilendi', '');
			$this->commitWrite();
		} catch (PDOException $e) {
			$this->rollbackWrite();
			if ($this->isDuplicate($e)) {
				return $this->fail(409, 'conflict');
			}
			throw $e;
		} catch (RuntimeException $e) {
			$this->rollbackWrite();
			return $this->fail(500, 'key_unavailable');
		}

		$fresh = $this->readLicense($id);
		if ($fresh === null) {
			return $this->fail(404, 'not_found');
		}

		return $this->ok(array(
			'api_key' => $sealed['plain'],
			'license' => $this->present($fresh, $this->modulesFor($id), $sealed['plain']),
		));
	}

	/**
	 * @param array<string, mixed> $payload
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function unlockDomain(int $id, array $payload, string $actor): array
	{
		$confirmed = $this->confirmed($payload);
		if ($confirmed !== null) {
			return $confirmed;
		}

		$this->beginWrite();
		try {
			$row = $this->lockLicense($id);
			if ($row === null) {
				$this->rollbackWrite();
				return $this->fail(404, 'not_found');
			}
			if ($this->isArchived($row)) {
				$this->rollbackWrite();
				return $this->fail(409, 'archived');
			}
			$domain = $this->textOrNull($row['domain']);
			if ($domain === null) {
				$this->rollbackWrite();
				return $this->fail(409, 'not_locked');
			}

			$update = $this->pdo->prepare(
				'UPDATE licenses
				 SET domain = NULL, updated_at = :updated
				 WHERE id = :id AND archived_at IS NULL AND domain = :domain'
			);
			$update->execute(array(
				'updated' => $this->nowSql(),
				'id' => $id,
				'domain' => $domain,
			));
			if ($update->rowCount() !== 1) {
				$this->rollbackWrite();
				return $this->fail(409, 'conflict');
			}
			$this->audit($id, $actor, 'domain_kilidi_kaldirildi', $domain);
			$this->commitWrite();
		} catch (PDOException $e) {
			$this->rollbackWrite();
			throw $e;
		}

		$fresh = $this->readLicense($id);
		if ($fresh === null) {
			return $this->fail(404, 'not_found');
		}

		return $this->ok(array(
			'license' => $this->present($fresh, $this->modulesFor($id)),
		));
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function archive(int $id, string $actor): array
	{
		$this->beginWrite();
		try {
			$row = $this->lockLicense($id);
			if ($row === null) {
				$this->rollbackWrite();
				return $this->fail(404, 'not_found');
			}
			if (!$this->isArchived($row)) {
				$now = $this->nowSql();
				$update = $this->pdo->prepare(
					'UPDATE licenses
					 SET archived_at = :archived, updated_at = :updated
					 WHERE id = :id AND archived_at IS NULL'
				);
				$update->execute(array('archived' => $now, 'updated' => $now, 'id' => $id));
				if ($update->rowCount() !== 1) {
					$this->rollbackWrite();
					return $this->fail(409, 'conflict');
				}
				$this->audit($id, $actor, 'arsivlendi', '');
			}
			$this->commitWrite();
		} catch (PDOException $e) {
			$this->rollbackWrite();
			throw $e;
		}

		$fresh = $this->readLicense($id);
		if ($fresh === null) {
			return $this->fail(404, 'not_found');
		}

		return $this->ok(array(
			'license' => $this->present($fresh, $this->modulesFor($id)),
		));
	}

	/**
	 * @param array<string, mixed> $query
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function auditLog(array $query): array
	{
		$unknown = $this->unknownFields($query, array('license', 'page', 'per_page'));
		if ($unknown !== array()) {
			return $this->fail(422, 'invalid_field', $unknown);
		}
		if (!isset($query['license']) || !is_string($query['license']) || preg_match('/^[1-9][0-9]{0,17}$/', $query['license']) !== 1) {
			return $this->fail(400, 'invalid_id');
		}
		$id = (int) $query['license'];
		if ((string) $id !== $query['license']) {
			return $this->fail(400, 'invalid_id');
		}
		if ($this->readLicense($id) === null) {
			return $this->fail(404, 'not_found');
		}

		$page = $this->pageValue($query['page'] ?? null);
		if ($page === null) {
			return $this->fail(422, 'invalid_field', array('page'));
		}
		$perPage = $this->pageSize($query['per_page'] ?? null);
		if ($perPage === null) {
			return $this->fail(422, 'invalid_field', array('per_page'));
		}
		$offset = ($page - 1) * $perPage;

		$count = $this->pdo->prepare('SELECT COUNT(*) FROM audit_events WHERE license_id = :id');
		$count->execute(array('id' => $id));
		$total = (int) $count->fetchColumn();

		$statement = $this->pdo->prepare(
			'SELECT id, license_id, occurred_at, actor, action, detail
			 FROM audit_events
			 WHERE license_id = :id
			 ORDER BY occurred_at DESC, id DESC
			 LIMIT :limit OFFSET :offset'
		);
		$statement->bindValue(':id', $id, PDO::PARAM_INT);
		$statement->bindValue(':limit', $perPage, PDO::PARAM_INT);
		$statement->bindValue(':offset', $offset, PDO::PARAM_INT);
		$statement->execute();

		$events = array();
		while (($row = $statement->fetch()) !== false) {
			if (!is_array($row)) {
				continue;
			}
			$events[] = array(
				'id' => (int) $row['id'],
				'license_id' => (int) $row['license_id'],
				'occurred_at' => (string) $row['occurred_at'],
				'actor' => (string) $row['actor'],
				'action' => (string) $row['action'],
				'detail' => (string) $row['detail'],
			);
		}

		return $this->ok(array(
			'page' => $page,
			'per_page' => $perPage,
			'total' => $total,
			'events' => $events,
		));
	}

	/**
	 * @param array<string, mixed> $query
	 * @return array{error:array{status:int,body:array<string,mixed>,headers:array<string,string>}}|array{where:list<string>,params:array<string,string>,sort:string,direction:string,page:int,per_page:int,offset:int}
	 */
	private function listQuery(array $query): array
	{
		$unknown = $this->unknownFields($query, array('q', 'status', 'page', 'per_page', 'sort', 'dir'));
		if ($unknown !== array()) {
			return array('error' => $this->fail(422, 'invalid_field', $unknown));
		}

		$where = array('archived_at IS NULL');
		$params = array();
		if (array_key_exists('q', $query)) {
			if (!is_string($query['q'])) {
				return array('error' => $this->fail(422, 'invalid_field', array('q')));
			}
			$q = trim($query['q']);
			if (strlen($q) > 191 || preg_match('//u', $q) !== 1) {
				return array('error' => $this->fail(422, 'invalid_field', array('q')));
			}
			if ($q !== '') {
				$where[] = "(company_name LIKE :q_name ESCAPE '!' OR (domain IS NOT NULL AND domain LIKE :q_domain ESCAPE '!'))";
				$pattern = $this->like($q);
				$params['q_name'] = $pattern;
				$params['q_domain'] = $pattern;
			}
		}

		if (array_key_exists('status', $query)) {
			if (!is_string($query['status'])) {
				return array('error' => $this->fail(422, 'invalid_field', array('status')));
			}
			$today = ($this->now)()->format('Y-m-d');
			if ($query['status'] === 'aktif') {
				$where[] = "status = 'aktif'";
			} elseif ($query['status'] === 'pasif') {
				$where[] = "status = 'pasif'";
			} elseif ($query['status'] === 'suresi_dolmus') {
				$where[] = "status = 'aktif' AND expires_on IS NOT NULL AND expires_on < :today";
				$params['today'] = $today;
			} elseif ($query['status'] === 'kullanilabilir') {
				$where[] = "status = 'aktif' AND (expires_on IS NULL OR expires_on >= :today)";
				$params['today'] = $today;
			} else {
				return array('error' => $this->fail(422, 'invalid_field', array('status')));
			}
		}

		$page = $this->pageValue($query['page'] ?? null);
		if ($page === null) {
			return array('error' => $this->fail(422, 'invalid_field', array('page')));
		}
		$perPage = $this->pageSize($query['per_page'] ?? null);
		if ($perPage === null) {
			return array('error' => $this->fail(422, 'invalid_field', array('per_page')));
		}
		$sort = 'created_at';
		if (array_key_exists('sort', $query)) {
			if (!is_string($query['sort']) || !isset(self::SORTS[$query['sort']])) {
				return array('error' => $this->fail(422, 'invalid_field', array('sort')));
			}
			$sort = self::SORTS[$query['sort']];
		}
		$direction = 'DESC';
		if (array_key_exists('dir', $query)) {
			if (!is_string($query['dir']) || !isset(self::DIRECTIONS[$query['dir']])) {
				return array('error' => $this->fail(422, 'invalid_field', array('dir')));
			}
			$direction = self::DIRECTIONS[$query['dir']];
		}

		return array(
			'where' => $where,
			'params' => $params,
			'sort' => $sort,
			'direction' => $direction,
			'page' => $page,
			'per_page' => $perPage,
			'offset' => ($page - 1) * $perPage,
		);
	}

	/**
	 * @param array<string, mixed> $payload
	 * @return array{error:array{status:int,body:array<string,mixed>,headers:array<string,string>}}|array{company_name:string,status:string,tier:?string,modules:list<string>,starts_on:?string,expires_on:?string,amount_paid:string,notes:string}
	 */
	private function creationFields(array $payload): array
	{
		if (!array_key_exists('company_name', $payload)) {
			return array('error' => $this->fail(422, 'invalid_field', array('company_name')));
		}
		$company = $this->companyName($payload['company_name']);
		if ($company === null) {
			return array('error' => $this->fail(422, 'invalid_field', array('company_name')));
		}

		$status = 'aktif';
		if (array_key_exists('status', $payload)) {
			$status = $this->statusValue($payload['status']);
			if ($status === null) {
				return array('error' => $this->fail(422, 'invalid_field', array('status')));
			}
		}

		$tierResult = $this->tierAndModules($payload, true);
		if (isset($tierResult['error'])) {
			return $tierResult;
		}

		$starts = null;
		if (array_key_exists('starts_on', $payload)) {
			$starts = $this->dateValue($payload['starts_on']);
			if ($starts === false) {
				return array('error' => $this->fail(422, 'invalid_field', array('starts_on')));
			}
		}
		$expires = null;
		if (array_key_exists('expires_on', $payload)) {
			$expires = $this->dateValue($payload['expires_on']);
			if ($expires === false) {
				return array('error' => $this->fail(422, 'invalid_field', array('expires_on')));
			}
		}
		if ($starts !== null && $expires !== null && $expires < $starts) {
			return array('error' => $this->fail(422, 'invalid_field', array('expires_on')));
		}

		$amount = '';
		if (array_key_exists('amount_paid', $payload)) {
			$amount = $this->amountValue($payload['amount_paid']);
			if ($amount === null) {
				return array('error' => $this->fail(422, 'invalid_field', array('amount_paid')));
			}
		}
		$notes = '';
		if (array_key_exists('notes', $payload)) {
			$notes = $this->notesValue($payload['notes']);
			if ($notes === null) {
				return array('error' => $this->fail(422, 'invalid_field', array('notes')));
			}
		}

		return array(
			'company_name' => $company,
			'status' => $status,
			'tier' => $tierResult['tier'],
			'modules' => $tierResult['modules'],
			'starts_on' => $starts,
			'expires_on' => $expires,
			'amount_paid' => $amount,
			'notes' => $notes,
		);
	}

	/**
	 * @param array<string, mixed> $payload
	 * @return array{error:array{status:int,body:array<string,mixed>,headers:array<string,string>}}|array{values:array<string,mixed>,names:list<string>}
	 */
	private function updateFields(array $payload): array
	{
		$values = array();
		$names = array();
		if (array_key_exists('company_name', $payload)) {
			$company = $this->companyName($payload['company_name']);
			if ($company === null) {
				return array('error' => $this->fail(422, 'invalid_field', array('company_name')));
			}
			$values['company_name'] = $company;
			$names[] = 'company_name';
		}
		if (array_key_exists('status', $payload)) {
			$status = $this->statusValue($payload['status']);
			if ($status === null) {
				return array('error' => $this->fail(422, 'invalid_field', array('status')));
			}
			$values['status'] = $status;
			$names[] = 'status';
		}
		if (array_key_exists('tier', $payload) || array_key_exists('modules', $payload)) {
			$tierResult = $this->tierAndModules($payload, false);
			if (isset($tierResult['error'])) {
				return $tierResult;
			}
			if (array_key_exists('tier', $payload)) {
				$values['tier'] = $tierResult['tier'];
				$names[] = 'tier';
			}
			if ($tierResult['replace_modules']) {
				$values['modules'] = $tierResult['modules'];
				$names[] = 'modules';
			}
		}
		if (array_key_exists('starts_on', $payload)) {
			$starts = $this->dateValue($payload['starts_on']);
			if ($starts === false) {
				return array('error' => $this->fail(422, 'invalid_field', array('starts_on')));
			}
			$values['starts_on'] = $starts;
			$names[] = 'starts_on';
		}
		if (array_key_exists('expires_on', $payload)) {
			$expires = $this->dateValue($payload['expires_on']);
			if ($expires === false) {
				return array('error' => $this->fail(422, 'invalid_field', array('expires_on')));
			}
			$values['expires_on'] = $expires;
			$names[] = 'expires_on';
		}
		if (array_key_exists('amount_paid', $payload)) {
			$amount = $this->amountValue($payload['amount_paid']);
			if ($amount === null) {
				return array('error' => $this->fail(422, 'invalid_field', array('amount_paid')));
			}
			$values['amount_paid'] = $amount;
			$names[] = 'amount_paid';
		}
		if (array_key_exists('notes', $payload)) {
			$notes = $this->notesValue($payload['notes']);
			if ($notes === null) {
				return array('error' => $this->fail(422, 'invalid_field', array('notes')));
			}
			$values['notes'] = $notes;
			$names[] = 'notes';
		}

		return array('values' => $values, 'names' => $names);
	}

	/**
	 * @param array<string, mixed> $row
	 * @param array<string, mixed> $values
	 * @return array{error:array{status:int,body:array<string,mixed>,headers:array<string,string>}}|array{company_name:string,status:string,tier:?string,modules:list<string>,replace_modules:bool,starts_on:?string,expires_on:?string,amount_paid:string,notes:string}
	 */
	private function mergeUpdate(array $row, array $values): array
	{
		$starts = array_key_exists('starts_on', $values) ? $values['starts_on'] : $this->textOrNull($row['starts_on']);
		$expires = array_key_exists('expires_on', $values) ? $values['expires_on'] : $this->textOrNull($row['expires_on']);
		if (is_string($starts) && is_string($expires) && $expires < $starts) {
			return array('error' => $this->fail(422, 'invalid_field', array('expires_on')));
		}

		$replace = array_key_exists('modules', $values);
		$modules = $replace ? $values['modules'] : array();

		return array(
			'company_name' => array_key_exists('company_name', $values) ? $values['company_name'] : (string) $row['company_name'],
			'status' => array_key_exists('status', $values) ? $values['status'] : (string) $row['status'],
			'tier' => array_key_exists('tier', $values) ? $values['tier'] : $this->textOrNull($row['tier_slug']),
			'modules' => $modules,
			'replace_modules' => $replace,
			'starts_on' => $starts,
			'expires_on' => $expires,
			'amount_paid' => array_key_exists('amount_paid', $values) ? $values['amount_paid'] : (string) $row['amount_paid'],
			'notes' => array_key_exists('notes', $values) ? $values['notes'] : (string) ($row['notes'] ?? ''),
		);
	}

	/**
	 * @param array<string, mixed> $payload
	 * @return array{error:array{status:int,body:array<string,mixed>,headers:array<string,string>}}|array{tier:?string,modules:list<string>,replace_modules:bool}
	 */
	private function tierAndModules(array $payload, bool $creating): array
	{
		$hasTier = array_key_exists('tier', $payload);
		$hasModules = array_key_exists('modules', $payload);
		if ($creating && !$hasTier && !$hasModules) {
			return array('error' => $this->fail(422, 'invalid_field', array('modules')));
		}

		$tier = null;
		if ($hasTier) {
			if ($payload['tier'] === null) {
				$tier = null;
			} elseif (!is_string($payload['tier']) || preg_match('/^[a-z0-9-]{1,32}$/', $payload['tier']) !== 1) {
				return array('error' => $this->fail(422, 'invalid_field', array('tier')));
			} else {
				$known = $this->pdo->prepare('SELECT slug FROM tiers WHERE slug = :slug');
				$known->execute(array('slug' => $payload['tier']));
				if ($known->fetchColumn() === false) {
					return array('error' => $this->fail(422, 'invalid_field', array('tier')));
				}
				$tier = $payload['tier'];
			}
		}

		if ($hasModules) {
			$modules = $this->moduleList($payload['modules']);
			if ($modules === null) {
				return array('error' => $this->fail(422, 'invalid_field', array('modules')));
			}

			return array('tier' => $tier, 'modules' => $modules, 'replace_modules' => true);
		}

		if ($hasTier && is_string($tier)) {
			return array(
				'tier' => $tier,
				'modules' => $this->templateModules($tier),
				'replace_modules' => true,
			);
		}

		return array('tier' => $tier, 'modules' => array(), 'replace_modules' => false);
	}

	/**
	 * @return list<string>
	 */
	private function templateModules(string $tier): array
	{
		$statement = $this->pdo->prepare(
			'SELECT module_slug FROM tier_modules WHERE tier_slug = :slug'
		);
		$statement->execute(array('slug' => $tier));
		$found = array();
		while (($slug = $statement->fetchColumn()) !== false) {
			if (is_string($slug) && in_array($slug, Validator::MODULE_SLUGS, true)) {
				$found[$slug] = true;
			}
		}

		return $this->orderModules(array_keys($found));
	}

	/**
	 * @param mixed $value
	 * @return list<string>|null
	 */
	private function moduleList(mixed $value): ?array
	{
		if (!is_array($value) || !array_is_list($value) || count($value) > count(Validator::MODULE_SLUGS)) {
			return null;
		}
		$seen = array();
		foreach ($value as $slug) {
			if (!is_string($slug) || !in_array($slug, Validator::MODULE_SLUGS, true) || isset($seen[$slug])) {
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

	/**
	 * @param list<string> $modules
	 */
	private function replaceModules(int $id, array $modules): void
	{
		$delete = $this->pdo->prepare('DELETE FROM license_modules WHERE license_id = :id');
		$delete->execute(array('id' => $id));
		$insert = $this->pdo->prepare(
			'INSERT INTO license_modules (license_id, module_slug) VALUES (:id, :slug)'
		);
		foreach ($modules as $slug) {
			$insert->execute(array('id' => $id, 'slug' => $slug));
		}
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

		return $this->orderModules(array_keys($found));
	}

	/**
	 * @return array<string, mixed>|null
	 */
	private function readLicense(int $id): ?array
	{
		$statement = $this->pdo->prepare(
			'SELECT id, company_name, api_key_hmac, api_key_encrypted, domain, status, starts_on, expires_on,
			        amount_paid, notes, tier_slug, last_seen_at, client_version, archived_at, created_at, updated_at
			 FROM licenses WHERE id = :id'
		);
		$statement->execute(array('id' => $id));
		$row = $statement->fetch();

		return is_array($row) ? $row : null;
	}

	/**
	 * @return array<string, mixed>|null
	 */
	private function lockLicense(int $id): ?array
	{
		$sql = 'SELECT id, company_name, api_key_hmac, api_key_encrypted, domain, status, starts_on, expires_on,
		               amount_paid, notes, tier_slug, last_seen_at, client_version, archived_at, created_at, updated_at
		        FROM licenses WHERE id = :id';
		if ($this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
			$sql .= ' FOR UPDATE';
		}
		$statement = $this->pdo->prepare($sql);
		$statement->execute(array('id' => $id));
		$row = $statement->fetch();

		return is_array($row) ? $row : null;
	}

	/**
	 * @param array<string, mixed> $row
	 * @param list<string> $modules
	 * @return array<string, mixed>
	 */
	private function present(array $row, array $modules, ?string $plain = null): array
	{
		$hint = $plain !== null ? $this->hint($plain) : $this->hintFromCipher($row['api_key_encrypted']);

		return array(
			'id' => (int) $row['id'],
			'company_name' => (string) $row['company_name'],
			'status' => (string) $row['status'],
			'state' => $this->state($row),
			'tier' => $this->textOrNull($row['tier_slug']),
			'modules' => $modules,
			'starts_on' => $this->textOrNull($row['starts_on']),
			'expires_on' => $this->textOrNull($row['expires_on']),
			'amount_paid' => (string) ($row['amount_paid'] ?? ''),
			'notes' => (string) ($row['notes'] ?? ''),
			'domain' => $this->textOrNull($row['domain']),
			'key_hint' => $hint,
			'last_seen_at' => $this->textOrNull($row['last_seen_at']),
			'client_version' => (string) ($row['client_version'] ?? ''),
			'archived_at' => $this->textOrNull($row['archived_at']),
			'created_at' => (string) $row['created_at'],
			'updated_at' => (string) $row['updated_at'],
		);
	}

	/**
	 * @param array<string, mixed> $row
	 */
	private function state(array $row): string
	{
		if ($this->isArchived($row)) {
			return 'arsiv';
		}
		if ((string) $row['status'] !== 'aktif') {
			return 'pasif';
		}
		$expires = $this->textOrNull($row['expires_on']);
		if ($expires !== null && Validator::isExpired($expires, ($this->now)())) {
			return 'suresi_dolmus';
		}

		return 'kullanilabilir';
	}

	/**
	 * @param array<string, mixed> $row
	 */
	private function isArchived(array $row): bool
	{
		return $this->textOrNull($row['archived_at']) !== null;
	}

	/**
	 * @param array<string, mixed> $row
	 */
	private function ciphertextMatches(array $row, string $plain): bool
	{
		return hash_equals((string) $row['api_key_hmac'], $this->keys->hmac($plain));
	}

	/**
	 * @return array{plain:string,hmac:string,encrypted:string}
	 */
	private function seal(string $apiKey): array
	{
		$encrypted = $this->keys->encrypt($apiKey);
		$plain = $this->keys->decrypt($encrypted);
		if (!is_string($plain) || !hash_equals($apiKey, $plain)) {
			throw new RuntimeException('key');
		}

		return array(
			'plain' => $apiKey,
			'hmac' => $this->keys->hmac($apiKey),
			'encrypted' => $encrypted,
		);
	}

	private function hint(string $apiKey): string
	{
		return '••••' . substr($apiKey, -4);
	}

	private function hintFromCipher(mixed $cipher): string
	{
		$raw = $this->blob($cipher);
		if ($raw === '') {
			return '••••';
		}
		try {
			return $this->hint($this->keys->decrypt($raw));
		} catch (RuntimeException $e) {
			return '••••';
		}
	}

	private function blob(mixed $value): string
	{
		if (is_string($value)) {
			return $value;
		}
		if (is_resource($value)) {
			$data = stream_get_contents($value);
			return is_string($data) ? $data : '';
		}

		return '';
	}

	private function companyName(mixed $value): ?string
	{
		if (!is_string($value) || preg_match('//u', $value) !== 1) {
			return null;
		}
		$value = trim($value);
		$length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
		if ($value === '' || $length > 191 || preg_match('/[\x00-\x1F\x7F]/', $value) === 1) {
			return null;
		}

		return $value;
	}

	private function statusValue(mixed $value): ?string
	{
		if ($value === 'aktif' || $value === 'pasif') {
			return $value;
		}

		return null;
	}

	/**
	 * @return string|null|false null geçerli boş değerdir, false geçersizdir
	 */
	private function dateValue(mixed $value): string|null|false
	{
		if ($value === null) {
			return null;
		}
		if (!is_string($value) || preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) !== 1) {
			return false;
		}
		$parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $value, new DateTimeZone('UTC'));
		if (!$parsed || $parsed->format('Y-m-d') !== $value) {
			return false;
		}

		return $value;
	}

	private function amountValue(mixed $value): ?string
	{
		if (!is_string($value) || preg_match('//u', $value) !== 1) {
			return null;
		}
		$length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
		if ($length > 64 || preg_match('/[\x00-\x1F\x7F]/', $value) === 1) {
			return null;
		}

		return $value;
	}

	private function notesValue(mixed $value): ?string
	{
		if ($value === null) {
			return '';
		}
		if (!is_string($value) || preg_match('//u', $value) !== 1) {
			return null;
		}
		$length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
		if ($length > 4000 || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value) === 1) {
			return null;
		}

		return $value;
	}

	/**
	 * @param array<string, mixed> $payload
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}|null
	 */
	private function confirmed(array $payload): ?array
	{
		$unknown = $this->unknownFields($payload, array('confirm'));
		if ($unknown !== array()) {
			return $this->fail(422, 'invalid_field', $unknown);
		}
		if (($payload['confirm'] ?? null) !== true) {
			return $this->fail(422, 'confirmation_required');
		}

		return null;
	}

	/**
	 * @param array<string, mixed> $payload
	 * @param list<string> $allowed
	 * @return list<string>
	 */
	private function unknownFields(array $payload, array $allowed): array
	{
		$unknown = array();
		foreach ($payload as $key => $value) {
			if (!is_string($key) || !in_array($key, $allowed, true)) {
				$unknown[] = is_string($key) ? $key : 'field';
			}
		}

		return $unknown;
	}

	private function pageValue(mixed $value): ?int
	{
		if ($value === null) {
			return 1;
		}
		if (!is_string($value) && !is_int($value)) {
			return null;
		}
		$text = (string) $value;
		if (preg_match('/^[1-9][0-9]{0,4}$/', $text) !== 1) {
			return null;
		}
		$page = (int) $text;
		if ($page < 1 || $page > 10000 || (string) $page !== $text) {
			return null;
		}

		return $page;
	}

	private function pageSize(mixed $value): ?int
	{
		if ($value === null) {
			return 20;
		}
		if (!is_string($value) && !is_int($value)) {
			return null;
		}
		$text = (string) $value;
		if (preg_match('/^[0-9]+$/', $text) !== 1) {
			return null;
		}
		$size = (int) $text;
		if (!in_array($size, self::PAGE_SIZES, true)) {
			return null;
		}

		return $size;
	}

	private function like(string $value): string
	{
		$escaped = str_replace(array('!', '%', '_'), array('!!', '!%', '!_'), $value);

		return '%' . $escaped . '%';
	}

	private function textOrNull(mixed $value): ?string
	{
		if (!is_string($value) || $value === '') {
			return null;
		}

		return $value;
	}

	private function bindNullable(\PDOStatement $statement, string $name, ?string $value): void
	{
		if ($value === null) {
			$statement->bindValue($name, null, PDO::PARAM_NULL);
			return;
		}
		$statement->bindValue($name, $value, PDO::PARAM_STR);
	}

	private function stillOpen(int $id): bool
	{
		$row = $this->readLicense($id);
		return $row !== null && !$this->isArchived($row);
	}

	private function nowSql(): string
	{
		return ($this->now)()->format('Y-m-d H:i:s');
	}

	private function audit(int $id, string $actor, string $action, string $detail): void
	{
		$actor = preg_replace('/[\x00-\x1F\x7F]/', '', $actor) ?? '';
		if (function_exists('mb_substr')) {
			$actor = mb_substr($actor, 0, 64, 'UTF-8');
		} else {
			$actor = substr($actor, 0, 64);
		}
		if ($actor === '') {
			$actor = 'yonetici';
		}
		$detail = preg_replace('/[\x00-\x1F\x7F]/', '', $detail) ?? '';
		$detail = substr($detail, 0, 255);
		$statement = $this->pdo->prepare(
			'INSERT INTO audit_events (license_id, occurred_at, actor, action, detail)
			 VALUES (:license_id, :occurred_at, :actor, :action, :detail)'
		);
		$statement->execute(array(
			'license_id' => $id,
			'occurred_at' => $this->nowSql(),
			'actor' => $actor,
			'action' => $action,
			'detail' => $detail,
		));
	}

	/**
	 * Testler iki yenilemeyi kilitten hemen önce buluşturur.
	 * Üretimde QR_REGEN_BARRIER yoktur; bu metot hemen döner.
	 */
	private function alignRegenRace(): void
	{
		$path = getenv('QR_REGEN_BARRIER');
		if (!is_string($path) || preg_match('#^/tmp/[A-Za-z0-9._/-]{1,120}$#', $path) !== 1 || !is_file($path)) {
			return;
		}
		$handle = fopen($path, 'c+');
		if ($handle === false) {
			return;
		}
		flock($handle, LOCK_EX);
		rewind($handle);
		$count = (int) stream_get_contents($handle);
		$count++;
		rewind($handle);
		ftruncate($handle, 0);
		fwrite($handle, (string) $count);
		fflush($handle);
		flock($handle, LOCK_UN);
		$deadline = microtime(true) + 3;
		while (microtime(true) < $deadline) {
			flock($handle, LOCK_SH);
			rewind($handle);
			$seen = (int) stream_get_contents($handle);
			flock($handle, LOCK_UN);
			if ($seen >= 2) {
				fclose($handle);
				return;
			}
			usleep(20000);
		}
		fclose($handle);
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
		try {
			$this->pdo->exec('ROLLBACK');
		} catch (PDOException $e) {
			return;
		}
	}

	private function isDuplicate(PDOException $e): bool
	{
		$code = (string) $e->getCode();
		$message = $e->getMessage();

		return $code === '23000' || $code === '1062' || str_contains($message, 'UNIQUE');
	}

	/**
	 * @param list<string> $fields
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function fail(int $status, string $error, array $fields = array()): array
	{
		$body = array('status' => 'error', 'error' => $error);
		if ($fields !== array()) {
			$body['fields'] = array_values($fields);
		}

		return array(
			'status' => $status,
			'body' => $body,
			'headers' => array('Cache-Control' => 'no-store'),
		);
	}

	/**
	 * @param array<string, mixed> $body
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function ok(array $body): array
	{
		return array(
			'status' => 200,
			'body' => array_merge(array('status' => 'ok'), $body),
			'headers' => array('Cache-Control' => 'no-store'),
		);
	}
}
