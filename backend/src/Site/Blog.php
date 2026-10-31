<?php
/**
 * Blog yazıları: depo (CRUD), doğrulama, gövde HTML temizliği ve kapak yükleme.
 * Yayın kuralları blog/build.mjs ile aynıdır (zorunlu alanlar, meta açıklama ≤165, h2 kimlikleri).
 */
declare(strict_types=1);

namespace QRLicense\Site;

use DateTimeImmutable;
use DateTimeZone;
use PDO;

final class Blog
{
	public const STATUSES = array('taslak', 'yayinda');

	private const PAGE_SIZES = array(10, 20, 50);

	private const LIST_COLUMNS = 'id, slug, status, category, title, cover, read_min, featured, published_on, updated_on, updated_at';

	private const TAGS = array(
		'h2' => array('id'), 'h3' => array('id'), 'h4' => array('id'), 'p' => array(), 'ul' => array(), 'ol' => array(), 'li' => array(),
		'strong' => array(), 'em' => array(), 'b' => array(), 'i' => array(), 'br' => array(), 'blockquote' => array(), 'hr' => array(),
		'a' => array('href', 'title', 'target', 'rel'), 'img' => array('src', 'alt', 'width', 'height', 'loading'),
		'table' => array(), 'thead' => array(), 'tbody' => array(), 'tr' => array(), 'th' => array('scope', 'colspan', 'rowspan'),
		'td' => array('colspan', 'rowspan'), 'div' => array(), 'span' => array(), 'figure' => array(), 'figcaption' => array(),
		'code' => array(), 'pre' => array(), 'small' => array(), 'sup' => array(), 'sub' => array(),
	);

	private const DROP = array('script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta', 'svg', 'math', 'noscript', 'template');

	private PDO $pdo;

	private string $root;

	/** @var callable(): DateTimeImmutable */
	private $now;

	/**
	 * @param string $root Site kök dizini (assets/blog altına kapak yazılır).
	 * @param callable(): DateTimeImmutable|null $now
	 */
	public function __construct(PDO $pdo, string $root, ?callable $now = null)
	{
		$this->pdo = $pdo;
		$this->root = rtrim($root, '/');
		$this->now = $now ?? static function (): DateTimeImmutable {
			return new DateTimeImmutable('now', new DateTimeZone('UTC'));
		};
	}

	/* ------------------------------------------------------------ okuma */

	/**
	 * @return list<array{slug:string,name:string,lead:string}>
	 */
	public function categories(): array
	{
		$rows = $this->pdo->query('SELECT slug, name, lead FROM blog_categories ORDER BY sort_order, slug');
		$out = array();
		foreach ($rows === false ? array() : $rows->fetchAll() as $r) {
			$out[] = array('slug' => (string) $r['slug'], 'name' => (string) $r['name'], 'lead' => (string) $r['lead']);
		}

		return $out;
	}

	/**
	 * Yayındaki yazılar (tarihe göre yeni → eski), tam kayıtlarla.
	 *
	 * @return list<array<string, mixed>>
	 */
	public function published(): array
	{
		$today = ($this->now)()->modify('+3 hours')->format('Y-m-d');
		$s = $this->pdo->prepare("SELECT * FROM blog_posts WHERE status = 'yayinda' AND published_on <= :today ORDER BY published_on DESC, id DESC");
		$s->execute(array('today' => $today));

		return array_map(fn (array $r): array => $this->hydrate($r), $s->fetchAll());
	}

	/**
	 * @return array<string, mixed>|null
	 */
	public function publishedBySlug(string $slug): ?array
	{
		foreach ($this->published() as $p) {
			if ($p['slug'] === $slug) {
				return $p;
			}
		}

		return null;
	}

	/**
	 * @param array<string, mixed> $q
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function listPosts(array $q): array
	{
		$where = array('1 = 1');
		$params = array();
		if (isset($q['status']) && is_string($q['status']) && $q['status'] !== '') {
			if (!in_array($q['status'], self::STATUSES, true)) {
				return $this->fail(422, 'invalid_status');
			}
			$where[] = 'status = :status';
			$params['status'] = $q['status'];
		}
		if (isset($q['q']) && is_string($q['q']) && trim($q['q']) !== '') {
			$where[] = '(title LIKE :q1 OR slug LIKE :q2)';
			$like = '%' . addcslashes(mb_substr(trim($q['q']), 0, 80), '%_\\') . '%';
			$params['q1'] = $like;
			$params['q2'] = $like;
		}
		$page = isset($q['page']) && is_string($q['page']) && ctype_digit($q['page']) ? max(1, (int) $q['page']) : 1;
		$per = isset($q['per_page']) && is_string($q['per_page']) && ctype_digit($q['per_page']) ? (int) $q['per_page'] : 20;
		if (!in_array($per, self::PAGE_SIZES, true)) {
			$per = 20;
		}
		$sqlWhere = implode(' AND ', $where);
		$count = $this->pdo->prepare("SELECT COUNT(*) FROM blog_posts WHERE $sqlWhere");
		$count->execute($params);
		$list = $this->pdo->prepare('SELECT ' . self::LIST_COLUMNS . " FROM blog_posts WHERE $sqlWhere ORDER BY published_on DESC, id DESC LIMIT :limit OFFSET :offset");
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
			'posts' => array_map(static function (array $r): array {
				return array(
					'id' => (int) $r['id'], 'slug' => (string) $r['slug'], 'status' => (string) $r['status'], 'category' => (string) $r['category'],
					'title' => (string) $r['title'], 'cover' => (string) $r['cover'], 'read_min' => (int) $r['read_min'],
					'featured' => (bool) $r['featured'], 'published_on' => (string) $r['published_on'], 'updated_on' => $r['updated_on'] === null ? null : (string) $r['updated_on'],
					'updated_at' => (string) $r['updated_at'],
				);
			}, $list->fetchAll()),
			'categories' => $this->categories(),
			'covers' => $this->covers(),
		));
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function detail(int $id): array
	{
		$s = $this->pdo->prepare('SELECT * FROM blog_posts WHERE id = :id');
		$s->execute(array('id' => $id));
		$row = $s->fetch();
		if (!is_array($row)) {
			return $this->fail(404, 'not_found');
		}

		return $this->ok(array('post' => $this->hydrate($row), 'categories' => $this->categories(), 'covers' => $this->covers()));
	}

	/* ------------------------------------------------------------ yazma */

	/**
	 * @param array<string, mixed> $payload
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function create(array $payload): array
	{
		$clean = $this->validate($payload, null);
		if (isset($clean['errors'])) {
			return $this->fail(422, 'invalid_field', $clean['errors']);
		}
		$now = gmdate('Y-m-d H:i:s');
		try {
			$this->pdo->beginTransaction();
			$insert = $this->pdo->prepare($this->insertSql());
			$this->bindPost($insert, $clean['post']);
			$insert->bindValue(':created_at', $now);
			$insert->bindValue(':updated_at', $now);
			$insert->execute();
			$id = (int) $this->pdo->lastInsertId();
			$this->afterSave($id, $clean['post']);
			$this->pdo->commit();
		} catch (\PDOException $e) {
			if ($this->pdo->inTransaction()) {
				$this->pdo->rollBack();
			}

			return $this->fail($e->getCode() === '23000' ? 409 : 500, $e->getCode() === '23000' ? 'slug_taken' : 'server_error');
		}

		return $this->detail($id) + array();
	}

	/**
	 * @param array<string, mixed> $payload
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function update(int $id, array $payload): array
	{
		$exists = $this->pdo->prepare('SELECT id FROM blog_posts WHERE id = :id');
		$exists->execute(array('id' => $id));
		if ($exists->fetchColumn() === false) {
			return $this->fail(404, 'not_found');
		}
		$clean = $this->validate($payload, $id);
		if (isset($clean['errors'])) {
			return $this->fail(422, 'invalid_field', $clean['errors']);
		}
		try {
			$this->pdo->beginTransaction();
			$update = $this->pdo->prepare(
				'UPDATE blog_posts SET slug = :slug, status = :status, category = :category, title = :title, seo_title = :seo_title,
				   description = :description, excerpt = :excerpt, answer = :answer, body = :body, cover = :cover, cover_alt = :cover_alt,
				   read_min = :read_min, featured = :featured, published_on = :published_on, updated_on = :updated_on, faq = :faq,
				   sources = :sources, products = :products, related = :related, updated_at = :updated_at WHERE id = :id'
			);
			$this->bindPost($update, $clean['post']);
			$update->bindValue(':updated_at', gmdate('Y-m-d H:i:s'));
			$update->bindValue(':id', $id, PDO::PARAM_INT);
			$update->execute();
			$this->afterSave($id, $clean['post']);
			$this->pdo->commit();
		} catch (\PDOException $e) {
			if ($this->pdo->inTransaction()) {
				$this->pdo->rollBack();
			}

			return $this->fail($e->getCode() === '23000' ? 409 : 500, $e->getCode() === '23000' ? 'slug_taken' : 'server_error');
		}

		return $this->detail($id);
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function delete(int $id): array
	{
		$s = $this->pdo->prepare('DELETE FROM blog_posts WHERE id = :id');
		$s->execute(array('id' => $id));

		return $s->rowCount() > 0 ? $this->ok(array('deleted' => true)) : $this->fail(404, 'not_found');
	}

	/**
	 * Kapak/içerik görseli yükler (GD ile yeniden boyutlandırır).
	 *
	 * @param array{tmp_name?:string,size?:int,error?:int} $file $_FILES girdisi
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	public function upload(array $file, string $kind, string $name): array
	{
		if (!function_exists('imagecreatefromstring') || !function_exists('imagewebp')) {
			return $this->fail(501, 'gd_missing');
		}
		if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name']) && !defined('QR_TESTING')) {
			return $this->fail(400, 'upload_failed');
		}
		if (($file['size'] ?? 0) > 8 * 1024 * 1024 || ($file['size'] ?? 0) < 1) {
			return $this->fail(413, 'file_too_large');
		}
		$bytes = file_get_contents($file['tmp_name']);
		$info = is_string($bytes) ? @getimagesizefromstring($bytes) : false;
		if ($info === false || !in_array($info[2], array(IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP), true)) {
			return $this->fail(415, 'unsupported_image');
		}
		if ($info[0] < 600 || $info[1] < 300 || $info[0] * $info[1] > 40000000) {
			return $this->fail(422, 'image_dimensions');
		}
		$src = @imagecreatefromstring((string) $bytes);
		if ($src === false) {
			return $this->fail(415, 'unsupported_image');
		}

		$dir = $this->root . '/assets/blog';
		$slug = trim((string) preg_replace('/[^a-z0-9]+/', '-', strtolower($name)), '-');
		$slug = $slug === '' ? 'gorsel' : substr($slug, 0, 60);

		if ($kind === 'inline') {
			if (!is_dir($dir . '/inline') && !@mkdir($dir . '/inline', 0755, true)) {
				return $this->fail(500, 'storage_unavailable');
			}
			$base = $slug . '-' . substr(hash('sha256', (string) $bytes), 0, 8);
			$img = $this->scale($src, min(1200, $info[0]), (int) round($info[1] * min(1200, $info[0]) / $info[0]));
			if (!@imagewebp($img, $dir . '/inline/' . $base . '.webp', 82)) {
				return $this->fail(500, 'storage_unavailable');
			}

			return $this->ok(array('path' => 'assets/blog/inline/' . $base . '.webp', 'width' => imagesx($img), 'height' => imagesy($img)));
		}

		if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
			return $this->fail(500, 'storage_unavailable');
		}
		$base = $slug;
		for ($i = 2; is_file($dir . '/' . $base . '-1200.webp') && $i < 50; ++$i) {
			$base = $slug . '-' . $i;
		}
		$full = $this->cover($src, 1200, 630);
		$small = $this->cover($src, 720, 378);
		$ok = @imagewebp($full, $dir . '/' . $base . '-1200.webp', 82)
			&& @imagewebp($small, $dir . '/' . $base . '-720.webp', 80)
			&& @imagejpeg($full, $dir . '/' . $base . '-og.jpg', 85);
		if (!$ok) {
			return $this->fail(500, 'storage_unavailable');
		}

		return $this->ok(array('cover' => $base));
	}

	/**
	 * @return list<string> Diskte üç boyutu da bulunan kapak adları.
	 */
	public function covers(): array
	{
		$out = array();
		foreach (glob($this->root . '/assets/blog/*-1200.webp') ?: array() as $f) {
			$base = basename($f, '-1200.webp');
			if (is_file($this->root . '/assets/blog/' . $base . '-720.webp') && is_file($this->root . '/assets/blog/' . $base . '-og.jpg')) {
				$out[] = $base;
			}
		}
		sort($out);

		return $out;
	}

	/**
	 * Gövde HTML'ini izinli etiket/öznitelik kümesine indirger ve h2/h3'lere kimlik ekler.
	 */
	public static function sanitizeBody(string $html): string
	{
		$html = trim($html);
		if ($html === '') {
			return '';
		}
		$doc = new \DOMDocument('1.0', 'UTF-8');
		$prev = libxml_use_internal_errors(true);
		$doc->loadHTML('<?xml encoding="UTF-8"><div id="qr-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
		libxml_clear_errors();
		libxml_use_internal_errors($prev);
		$root = $doc->getElementById('qr-root');
		if ($root === null) {
			return '';
		}
		self::clean($root, $doc);
		$ids = array();
		foreach (array('h2', 'h3') as $tag) {
			foreach (iterator_to_array($root->getElementsByTagName($tag)) as $h) {
				$id = $h->getAttribute('id');
				if ($id === '' || preg_match('/^[a-z0-9-]+$/', $id) !== 1) {
					$id = self::slugify($h->textContent);
				}
				$base = $id;
				for ($i = 2; isset($ids[$id]); ++$i) {
					$id = $base . '-' . $i;
				}
				$ids[$id] = true;
				$h->setAttribute('id', $id);
			}
		}
		$out = '';
		foreach ($root->childNodes as $child) {
			$out .= $doc->saveHTML($child);
		}

		return trim($out);
	}

	public static function slugify(string $text): string
	{
		$map = array('ç' => 'c', 'ğ' => 'g', 'ı' => 'i', 'ö' => 'o', 'ş' => 's', 'ü' => 'u', 'â' => 'a', 'î' => 'i', 'û' => 'u', 'İ' => 'i', 'Ç' => 'c', 'Ğ' => 'g', 'Ö' => 'o', 'Ş' => 's', 'Ü' => 'u');
		$text = strtolower(strtr($text, $map));
		$text = trim((string) preg_replace('/[^a-z0-9]+/', '-', $text), '-');

		return $text === '' ? 'bolum' : substr($text, 0, 80);
	}

	/* --------------------------------------------------------- iç yöntemler */

	private static function clean(\DOMNode $node, \DOMDocument $doc): void
	{
		foreach (iterator_to_array($node->childNodes) as $child) {
			if ($child instanceof \DOMComment || $child instanceof \DOMProcessingInstruction) {
				$node->removeChild($child);
				continue;
			}
			if (!($child instanceof \DOMElement)) {
				continue;
			}
			$tag = strtolower($child->tagName);
			if (in_array($tag, self::DROP, true)) {
				$node->removeChild($child);
				continue;
			}
			self::clean($child, $doc);
			if (!isset(self::TAGS[$tag])) {
				while ($child->firstChild !== null) {
					$node->insertBefore($child->firstChild, $child);
				}
				$node->removeChild($child);
				continue;
			}
			$allowed = self::TAGS[$tag];
			foreach (iterator_to_array($child->attributes) as $attr) {
				$name = strtolower($attr->name);
				$value = $attr->value;
				$keep = $name === 'class' || in_array($name, $allowed, true);
				if ($keep && $name === 'class') {
					$classes = array_filter(preg_split('/\s+/', trim($value)) ?: array(), static fn (string $c): bool => preg_match('/^qb-[a-z0-9_-]+$/', $c) === 1);
					$keep = $classes !== array();
					$value = implode(' ', $classes);
				} elseif ($keep && ($name === 'href' || $name === 'src')) {
					$keep = preg_match('#^(@/|/|\#|https?://|mailto:|tel:)#i', trim($value)) === 1 && preg_match('/^\s*javascript:/i', $value) !== 1;
					if ($keep && $name === 'src' && preg_match('#^(@/|/|https://)#i', trim($value)) !== 1) {
						$keep = false;
					}
				} elseif ($keep && $name === 'target') {
					$keep = $value === '_blank';
				} elseif ($keep && ($name === 'width' || $name === 'height' || $name === 'colspan' || $name === 'rowspan')) {
					$keep = ctype_digit($value);
				} elseif ($keep && $name === 'loading') {
					$keep = $value === 'lazy' || $value === 'eager';
				}
				if (!$keep) {
					$child->removeAttribute($attr->name);
				} elseif ($name === 'class') {
					$child->setAttribute('class', $value);
				}
			}
			if ($tag === 'a' && $child->getAttribute('target') === '_blank') {
				$child->setAttribute('rel', 'noopener');
			}
			if ($tag === 'img') {
				if ($child->getAttribute('src') === '') {
					$node->removeChild($child);
					continue;
				}
				if (!$child->hasAttribute('alt')) {
					$child->setAttribute('alt', '');
				}
				if (!$child->hasAttribute('loading')) {
					$child->setAttribute('loading', 'lazy');
				}
			}
		}
	}

	/**
	 * @param array<string, mixed> $p
	 * @return array{post:array<string,mixed>}|array{errors:list<string>}
	 */
	private function validate(array $p, ?int $selfId): array
	{
		$err = array();
		$str = static function (string $k, int $max) use ($p, &$err): string {
			$v = $p[$k] ?? '';
			if (!is_string($v)) {
				$err[] = $k;

				return '';
			}
			$v = trim($v);
			if (mb_strlen($v) > $max) {
				$err[] = $k;
			}

			return $v;
		};

		$title = $str('title', 200);
		$slug = $str('slug', 100);
		if ($slug === '' && $title !== '') {
			$slug = self::slugify($title);
		}
		if (preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug) !== 1) {
			$err[] = 'slug';
		}
		if ($title === '') {
			$err[] = 'title';
		}
		$status = $p['status'] ?? 'taslak';
		if (!is_string($status) || !in_array($status, self::STATUSES, true)) {
			$err[] = 'status';
			$status = 'taslak';
		}
		$category = $str('category', 32);
		$cats = array_column($this->categories(), 'slug');
		if (!in_array($category, $cats, true)) {
			$err[] = 'category';
		}
		$seo = $str('seo_title', 120);
		$desc = $str('description', 165);
		$excerpt = $str('excerpt', 500);
		$answer = $str('answer', 2000);
		$coverAlt = $str('cover_alt', 255);
		$cover = $str('cover', 160);
		$bodyRaw = isset($p['body']) && is_string($p['body']) ? $p['body'] : '';
		if (strlen($bodyRaw) > 400000) {
			$err[] = 'body';
		}
		$body = self::sanitizeBody($bodyRaw);

		$date = $p['published_on'] ?? '';
		if (!is_string($date) || preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) !== 1 || !checkdate((int) substr($date, 5, 2), (int) substr($date, 8, 2), (int) substr($date, 0, 4))) {
			$err[] = 'published_on';
			$date = ($this->now)()->format('Y-m-d');
		}
		$updated = $p['updated_on'] ?? null;
		if ($updated === '' || $updated === null) {
			$updated = null;
		} elseif (!is_string($updated) || preg_match('/^\d{4}-\d{2}-\d{2}$/', $updated) !== 1 || !checkdate((int) substr($updated, 5, 2), (int) substr($updated, 8, 2), (int) substr($updated, 0, 4))) {
			$err[] = 'updated_on';
			$updated = null;
		}

		$words = str_word_count(strip_tags($body . ' ' . $answer), 0, 'çğıöşüÇĞİÖŞÜ');
		$readMin = isset($p['read_min']) && is_numeric($p['read_min']) && (int) $p['read_min'] > 0 ? min(120, (int) $p['read_min']) : max(1, (int) ceil($words / 200));

		$faq = $this->pairs($p['faq'] ?? array(), array('q', 'a'), 20, $err, 'faq');
		$sources = $this->pairs($p['sources'] ?? array(), array('label', 'url'), 20, $err, 'sources');
		foreach ($sources as $s) {
			if (preg_match('#^https?://#i', $s['url']) !== 1) {
				$err[] = 'sources';
				break;
			}
		}
		$products = $this->pairs($p['products'] ?? array(), array('label', 'path'), 10, $err, 'products');
		foreach ($products as $s) {
			if (preg_match('#^[a-z0-9][a-z0-9/_-]*/?$#i', $s['path']) !== 1) {
				$err[] = 'products';
				break;
			}
		}
		$related = array();
		if (isset($p['related']) && is_array($p['related'])) {
			foreach (array_slice($p['related'], 0, 6) as $r) {
				if (is_string($r) && preg_match('/^[a-z0-9-]+$/', $r) === 1 && $r !== $slug) {
					$related[] = $r;
				}
			}
		}
		if ($related !== array()) {
			$in = implode(',', array_fill(0, count($related), '?'));
			$q = $this->pdo->prepare("SELECT slug FROM blog_posts WHERE slug IN ($in)");
			$q->execute($related);
			$found = $q->fetchAll(PDO::FETCH_COLUMN);
			if (count(array_diff($related, $found)) > 0) {
				$err[] = 'related';
			}
		}

		if ($cover !== '') {
			if (preg_match('/^[a-z0-9-]+$/', $cover) !== 1 || !in_array($cover, $this->covers(), true)) {
				$err[] = 'cover';
			}
		}

		if ($status === 'yayinda') {
			foreach (array('seo_title' => $seo, 'description' => $desc, 'excerpt' => $excerpt, 'answer' => $answer, 'body' => $body, 'cover' => $cover, 'cover_alt' => $coverAlt) as $k => $v) {
				if ($v === '') {
					$err[] = $k;
				}
			}
			if ($body !== '' && preg_match('/<h2\b/i', $body) !== 1) {
				$err[] = 'body';
			}
		}

		$featured = !empty($p['featured']);

		if (isset($slug) && preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug) === 1) {
			$dupe = $this->pdo->prepare('SELECT id FROM blog_posts WHERE slug = :slug AND id <> :id');
			$dupe->execute(array('slug' => $slug, 'id' => $selfId ?? 0));
			if ($dupe->fetchColumn() !== false) {
				$err[] = 'slug_taken';
			}
		}

		if ($err !== array()) {
			return array('errors' => array_values(array_unique($err)));
		}

		return array('post' => array(
			'slug' => $slug, 'status' => $status, 'category' => $category, 'title' => $title, 'seo_title' => $seo, 'description' => $desc,
			'excerpt' => $excerpt, 'answer' => $answer, 'body' => $body, 'cover' => $cover, 'cover_alt' => $coverAlt, 'read_min' => $readMin,
			'featured' => $featured ? 1 : 0, 'published_on' => $date, 'updated_on' => $updated,
			'faq' => json_encode($faq, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
			'sources' => json_encode($sources, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
			'products' => json_encode($products, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
			'related' => json_encode($related, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
		));
	}

	/**
	 * @param mixed $value
	 * @param list<string> $keys
	 * @param list<string> $err
	 * @return list<array<string,string>>
	 */
	private function pairs($value, array $keys, int $max, array &$err, string $field): array
	{
		if (!is_array($value)) {
			$err[] = $field;

			return array();
		}
		$out = array();
		foreach (array_slice(array_values($value), 0, $max) as $row) {
			if (!is_array($row)) {
				$err[] = $field;
				continue;
			}
			$item = array();
			$empty = true;
			foreach ($keys as $k) {
				$v = isset($row[$k]) && is_string($row[$k]) ? trim($row[$k]) : '';
				if (mb_strlen($v) > 2000) {
					$err[] = $field;
				}
				$item[$k] = $v;
				$empty = $empty && $v === '';
			}
			if ($empty) {
				continue;
			}
			if (in_array('', $item, true)) {
				$err[] = $field;
				continue;
			}
			$out[] = $item;
		}

		return $out;
	}

	/**
	 * Aynı yazı öne çıkan işaretliyse diğerlerinin işaretini kaldırır (tek öne çıkan).
	 *
	 * @param array<string, mixed> $post
	 */
	private function afterSave(int $id, array $post): void
	{
		if ((int) $post['featured'] === 1) {
			$this->pdo->prepare('UPDATE blog_posts SET featured = 0 WHERE id <> :id')->execute(array('id' => $id));
		}
	}

	private function insertSql(): string
	{
		return 'INSERT INTO blog_posts (slug, status, category, title, seo_title, description, excerpt, answer, body, cover, cover_alt, read_min,
			   featured, published_on, updated_on, faq, sources, products, related, created_at, updated_at)
			 VALUES (:slug, :status, :category, :title, :seo_title, :description, :excerpt, :answer, :body, :cover, :cover_alt, :read_min,
			   :featured, :published_on, :updated_on, :faq, :sources, :products, :related, :created_at, :updated_at)';
	}

	/**
	 * @param array<string, mixed> $post
	 */
	private function bindPost(\PDOStatement $st, array $post): void
	{
		foreach (array('slug', 'status', 'category', 'title', 'seo_title', 'description', 'excerpt', 'answer', 'body', 'cover', 'cover_alt', 'published_on', 'faq', 'sources', 'products', 'related') as $k) {
			$st->bindValue(':' . $k, (string) $post[$k]);
		}
		$st->bindValue(':read_min', (int) $post['read_min'], PDO::PARAM_INT);
		$st->bindValue(':featured', (int) $post['featured'], PDO::PARAM_INT);
		$st->bindValue(':updated_on', $post['updated_on'], $post['updated_on'] === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
	}

	/**
	 * @param array<string, mixed> $r
	 * @return array<string, mixed>
	 */
	private function hydrate(array $r): array
	{
		$list = static function ($json): array {
			$d = is_string($json) ? json_decode($json, true) : null;

			return is_array($d) ? $d : array();
		};

		return array(
			'id' => (int) $r['id'], 'slug' => (string) $r['slug'], 'status' => (string) $r['status'], 'category' => (string) $r['category'],
			'title' => (string) $r['title'], 'seo_title' => (string) $r['seo_title'], 'description' => (string) $r['description'],
			'excerpt' => (string) $r['excerpt'], 'answer' => (string) $r['answer'], 'body' => (string) $r['body'], 'cover' => (string) $r['cover'],
			'cover_alt' => (string) $r['cover_alt'], 'read_min' => (int) $r['read_min'], 'featured' => (bool) $r['featured'],
			'published_on' => (string) $r['published_on'], 'updated_on' => $r['updated_on'] === null ? null : (string) $r['updated_on'],
			'faq' => $list($r['faq']), 'sources' => $list($r['sources']), 'products' => $list($r['products']), 'related' => $list($r['related']),
		);
	}

	/**
	 * @param \GdImage $src
	 * @return \GdImage
	 */
	private function cover($src, int $w, int $h)
	{
		$sw = imagesx($src);
		$sh = imagesy($src);
		$ratio = max($w / $sw, $h / $sh);
		$cw = (int) round($w / $ratio);
		$ch = (int) round($h / $ratio);
		$x = (int) floor(($sw - $cw) / 2);
		$y = (int) floor(($sh - $ch) / 2);
		$dst = imagecreatetruecolor($w, $h);
		imagealphablending($dst, true);
		imagefill($dst, 0, 0, (int) imagecolorallocate($dst, 255, 255, 255));
		imagecopyresampled($dst, $src, 0, 0, $x, $y, $w, $h, $cw, $ch);

		return $dst;
	}

	/**
	 * @param \GdImage $src
	 * @return \GdImage
	 */
	private function scale($src, int $w, int $h)
	{
		$dst = imagecreatetruecolor(max(1, $w), max(1, $h));
		imagealphablending($dst, false);
		imagesavealpha($dst, true);
		imagecopyresampled($dst, $src, 0, 0, 0, 0, max(1, $w), max(1, $h), imagesx($src), imagesy($src));

		return $dst;
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
	 * @param list<string>|null $fields
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function fail(int $status, string $error, ?array $fields = null): array
	{
		$body = array('status' => 'error', 'error' => $error);
		if ($fields !== null) {
			$body['fields'] = $fields;
		}

		return array('status' => $status, 'body' => $body, 'headers' => array('Cache-Control' => 'no-store'));
	}
}
