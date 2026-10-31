<?php
/**
 * Yerel geliştirme: php -S 127.0.0.1:8080 -t . backend/tests/dev-router.php
 * .htaccess yönlendirmelerinin aynısını uygular.
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
if (preg_match('#^/(api(/|$)|v1/validate/?$|wp-json/qmls/v1/validate/?$|blog/?$|blog/feed\.xml$|blog/[a-z0-9-]+/?$|sitemap-blog\.xml$)#', $path) === 1) {
	require dirname(__DIR__, 2) . '/api/index.php';
	return true;
}
if (str_starts_with($path, '/yonetim')) {
	header("Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
}
if (preg_match('#^/(backend|tools|seo)(/|$)#', $path) === 1 || preg_match('#\.(sql|env|mjs)$#', $path) === 1) {
	http_response_code(403);
	return true;
}
return false;
