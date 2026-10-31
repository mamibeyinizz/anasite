<?php
/**
 * backend/data/posts.json (node backend/bin/export-posts.mjs çıktısı) → blog_posts.
 * Var olan slug'lar atlanır (yönetimden yapılan düzenleme ezilmez). Kullanım: php backend/bin/import-posts.php
 */
declare(strict_types=1);

use QRLicense\Store\Database;

if (PHP_SAPI !== 'cli') {
	http_response_code(404);
	exit(1);
}
$root = dirname(__DIR__);
require_once $root . '/src/Store/Database.php';

$configPath = getenv('QR_LICENSE_CONFIG');
if (!is_string($configPath) || $configPath === '') {
	$configPath = $root . '/config.php';
}
$config = require $configPath;
$pdo = Database::connect($config);

$data = json_decode((string) file_get_contents($root . '/data/posts.json'), true, 16, JSON_THROW_ON_ERROR);
$sort = 0;
foreach ($data['categories'] as $c) {
	++$sort;
	$pdo->prepare('INSERT IGNORE INTO blog_categories (slug, name, lead, sort_order) VALUES (:s, :n, :l, :o)')
		->execute(array('s' => $c['id'], 'n' => $c['name'], 'l' => $c['lead'], 'o' => $sort));
}

$insert = $pdo->prepare(
	'INSERT IGNORE INTO blog_posts (slug, status, category, title, seo_title, description, excerpt, answer, body, cover, cover_alt, read_min,
	   featured, published_on, updated_on, faq, sources, products, related, created_at, updated_at)
	 VALUES (:slug, \'yayinda\', :category, :title, :seo_title, :description, :excerpt, :answer, :body, :cover, :cover_alt, :read_min,
	   :featured, :published_on, :updated_on, :faq, :sources, :products, :related, :now1, :now2)'
);
$added = 0;
$now = gmdate('Y-m-d H:i:s');
$json = static fn ($v): string => json_encode($v ?? array(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
foreach (array_reverse($data["posts"]) as $p) {
	$insert->execute(array(
		'slug' => $p['slug'], 'category' => $p['category'], 'title' => $p['title'], 'seo_title' => $p['seoTitle'],
		'description' => $p['description'], 'excerpt' => $p['excerpt'], 'answer' => $p['answer'], 'body' => $p['body'],
		'cover' => $p['cover'], 'cover_alt' => $p['coverAlt'], 'read_min' => (int) $p['readMin'], 'featured' => !empty($p['featured']) ? 1 : 0,
		'published_on' => $p['date'], 'updated_on' => $p['updated'] ?? null, 'faq' => $json($p['faq'] ?? null),
		'sources' => $json($p['sources'] ?? null), 'products' => $json($p['products'] ?? null), 'related' => $json($p['related'] ?? null),
		'now1' => $now, 'now2' => $now,
	));
	$added += $insert->rowCount();
}
fwrite(STDOUT, $added . ' yazı eklendi, ' . (count($data['posts']) - $added) . " atlandı (zaten var).\n");
