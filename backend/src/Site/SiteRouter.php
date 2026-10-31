<?php
/**
 * Site yolları: ziyaretçi toplama, blog sayfaları ve yönetim API'si (analitik + blog).
 * Eşleşmeyen yollar lisans/oturum yönlendiricisine (QRLicense\Http\Router) bırakılır.
 */
declare(strict_types=1);

namespace QRLicense\Site;

use QRLicense\Admin\Auth;
use QRLicense\Http\Router as LicenseRouter;

final class SiteRouter
{
	private const ADMIN_MAX_BODY = 600000;

	private Auth $auth;

	private LicenseRouter $licenseRouter;

	private Collector $collector;

	private Analytics $analytics;

	private Blog $blog;

	private string $root;

	public function __construct(Auth $auth, LicenseRouter $licenseRouter, Collector $collector, Analytics $analytics, Blog $blog, string $root)
	{
		$this->auth = $auth;
		$this->licenseRouter = $licenseRouter;
		$this->collector = $collector;
		$this->analytics = $analytics;
		$this->blog = $blog;
		$this->root = rtrim($root, '/');
	}

	/**
	 * @param array<string, mixed> $server
	 * @param array<string, mixed> $files
	 * @param array<string, mixed> $post
	 * @return array{status:int,body:string|array<string,mixed>,headers:array<string,string>}
	 */
	public function dispatch(
		string $method,
		string $uri,
		string $rawBody,
		string $ip,
		bool $https,
		string $cookie,
		string $csrf,
		?string $contentType,
		array $server = array(),
		array $files = array(),
		array $post = array()
	): array {
		$method = strtoupper($method);
		$path = parse_url($uri, PHP_URL_PATH);
		$path = is_string($path) ? $path : '/';
		if ($path !== '/' && str_ends_with($path, '/')) {
			$path = rtrim($path, '/');
		}

		if ($path === '/api/collect') {
			return $this->collector->handle($method, $rawBody, $ip, $server);
		}

		if ($path === '/blog' || $path === '/blog/feed.xml' || $path === '/sitemap-blog.xml' || preg_match('#^/blog/[a-z0-9-]+$#', $path) === 1) {
			return $this->blogPage($method, $path);
		}

		$admin = preg_match('#^/api/admin/(analytics|posts|uploads)(?:/|$)#', $path) === 1;
		if (!$admin) {
			return $this->licenseRouter->dispatch($method, $uri, $rawBody, $ip, $https, $cookie, $csrf, $contentType);
		}

		$decision = $this->auth->authorize($cookie, $csrf, $method, $ip, $https);
		if (!$decision['ok']) {
			$headers = array('Cache-Control' => 'no-store');
			if ($decision['retry_after'] > 0) {
				$headers['Retry-After'] = (string) $decision['retry_after'];
			}

			return array('status' => $decision['status'], 'body' => array('status' => 'error', 'error' => $decision['error']), 'headers' => $headers);
		}

		$query = $this->query($uri);

		if (preg_match('#^/api/admin/analytics/([a-z]+)(?:/([1-9][0-9]{0,17}))?$#', $path, $m) === 1) {
			$id = isset($m[2]) ? (int) $m[2] : null;
			if ($method === 'DELETE' && $m[1] === 'visitors' && $id !== null) {
				return $this->analytics->forgetVisitor($id)
					? $this->json(200, array('status' => 'ok', 'deleted' => true))
					: $this->json(404, array('status' => 'error', 'error' => 'not_found'));
			}
			if ($method !== 'GET') {
				return $this->json(405, array('status' => 'method_not_allowed'), array('Allow' => 'GET'));
			}
			switch ($m[1]) {
				case 'overview':
					return $id === null ? $this->analytics->overview($query) : $this->notFound();
				case 'live':
					return $id === null ? $this->analytics->live() : $this->notFound();
				case 'pages':
					return $id === null ? $this->analytics->pages($query) : $this->notFound();
				case 'clicks':
					return $id === null ? $this->analytics->clicks($query) : $this->notFound();
				case 'events':
					return $id === null ? $this->analytics->events($query) : $this->notFound();
				case 'visitors':
					return $id === null ? $this->analytics->visitors($query) : $this->analytics->visitor($id);
				case 'sessions':
					return $id === null ? $this->analytics->sessions($query) : $this->analytics->session($id);
			}

			return $this->notFound();
		}

		if ($path === '/api/admin/uploads') {
			if ($method !== 'POST') {
				return $this->json(405, array('status' => 'method_not_allowed'), array('Allow' => 'POST'));
			}
			$file = isset($files['file']) && is_array($files['file']) ? $files['file'] : array();
			$kind = isset($post['kind']) && $post['kind'] === 'inline' ? 'inline' : 'cover';
			$name = isset($post['name']) && is_string($post['name']) ? $post['name'] : '';

			return $this->blog->upload($file, $kind, $name);
		}

		if (preg_match('#^/api/admin/posts(?:/([1-9][0-9]{0,17}))?$#', $path, $m) === 1) {
			$id = isset($m[1]) ? (int) $m[1] : null;
			if ($id === null) {
				if ($method === 'GET') {
					return $this->blog->listPosts($query);
				}
				if ($method !== 'POST') {
					return $this->json(405, array('status' => 'method_not_allowed'), array('Allow' => 'GET, POST'));
				}

				return $this->created($this->blog->create($this->payload($contentType, $rawBody)));
			}
			if ($method === 'GET') {
				return $this->blog->detail($id);
			}
			if ($method === 'DELETE') {
				return $this->blog->delete($id);
			}
			if ($method !== 'PATCH') {
				return $this->json(405, array('status' => 'method_not_allowed'), array('Allow' => 'GET, PATCH, DELETE'));
			}

			return $this->blog->update($id, $this->payload($contentType, $rawBody));
		}

		return $this->notFound();
	}

	/* ------------------------------------------------------------ iç */

	/**
	 * @return array{status:int,body:string|array<string,mixed>,headers:array<string,string>}
	 */
	private function blogPage(string $method, string $path): array
	{
		if ($method !== 'GET' && $method !== 'HEAD') {
			return $this->json(405, array('status' => 'method_not_allowed'), array('Allow' => 'GET, HEAD'));
		}

		try {
			$view = new BlogView($this->root, $this->blog->published(), $this->blog->categories());
			if ($path === '/blog') {
				return $this->html($view->index(), 'text/html; charset=utf-8');
			}
			if ($path === '/blog/feed.xml') {
				return $this->html($view->feed(), 'application/rss+xml; charset=utf-8');
			}
			if ($path === '/sitemap-blog.xml') {
				return $this->html($view->sitemap(), 'application/xml; charset=utf-8');
			}
			$post = $this->blog->publishedBySlug(substr($path, 6));
			if ($post === null) {
				return $this->staticFallback($path) ?? $this->html($this->notFoundPage(), 'text/html; charset=utf-8', 404);
			}

			return $this->html($view->post($post), 'text/html; charset=utf-8');
		} catch (\Throwable $e) {
			error_log('qr-blog ' . $e::class);

			return $this->staticFallback($path) ?? $this->json(500, array('status' => 'error', 'error' => 'server_error'));
		}
	}

	/**
	 * Veritabanı kullanılamazsa depoda duran statik blog çıktısı sunulur.
	 *
	 * @return array{status:int,body:string,headers:array<string,string>}|null
	 */
	private function staticFallback(string $path): ?array
	{
		$map = array('/blog' => '/blog/index.html', '/blog/feed.xml' => '/blog/feed.xml', '/sitemap-blog.xml' => '/sitemap-blog.xml');
		$rel = $map[$path] ?? ($path . '/index.html');
		$file = $this->root . $rel;
		if (preg_match('#^/blog/[a-z0-9-]+/index\.html$#', $rel) !== 1 && !isset($map[$path])) {
			return null;
		}
		$real = realpath($file);
		if ($real === false || !str_starts_with($real, $this->root . '/') || !is_file($real)) {
			return null;
		}
		$type = str_ends_with($real, '.xml') ? 'application/xml; charset=utf-8' : 'text/html; charset=utf-8';
		$body = file_get_contents($real);

		return $body === false ? null : $this->html($body, $type);
	}

	private function notFoundPage(): string
	{
		return '<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><title>Sayfa bulunamadı</title></head><body><p>Sayfa bulunamadı. <a href="/blog/">Blog</a></p></body></html>';
	}

	/**
	 * @return array{status:int,body:string,headers:array<string,string>}
	 */
	private function html(string $body, string $type, int $status = 200): array
	{
		return array('status' => $status, 'body' => $body, 'headers' => array(
			'Content-Type' => $type,
			'Cache-Control' => $status === 200 ? 'public, max-age=300, stale-while-revalidate=600' : 'no-store',
		));
	}

	/**
	 * Gövdeyi çözer; geçersizse boş dizi yerine 400 üretecek şekilde Blog doğrulamasına boş veri gider.
	 *
	 * @return array<string, mixed>
	 */
	private function payload(?string $contentType, string $raw): array
	{
		if ($raw === '' || strlen($raw) > self::ADMIN_MAX_BODY) {
			return array();
		}
		$media = $contentType === null ? 'application/json' : strtolower(trim(explode(';', $contentType, 2)[0]));
		if ($media !== 'application/json') {
			return array();
		}
		try {
			$data = json_decode($raw, true, 12, JSON_THROW_ON_ERROR);
		} catch (\JsonException $e) {
			return array();
		}

		return is_array($data) && !array_is_list($data) ? $data : array();
	}

	/**
	 * @param array{status:int,body:array<string,mixed>,headers:array<string,string>} $r
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function created(array $r): array
	{
		if ($r['status'] === 200) {
			$r['status'] = 201;
		}

		return $r;
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
	 * @param array<string, mixed> $body
	 * @param array<string, string> $headers
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function json(int $status, array $body, array $headers = array()): array
	{
		return array('status' => $status, 'body' => $body, 'headers' => $headers + array('Cache-Control' => 'no-store'));
	}

	/**
	 * @return array{status:int,body:array<string,mixed>,headers:array<string,string>}
	 */
	private function notFound(): array
	{
		return $this->json(404, array('status' => 'not_found'));
	}
}
