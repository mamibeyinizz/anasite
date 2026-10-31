<?php
/**
 * Blog sayfalarını sunucuda üretir. Şablon blog/build.mjs ile birebir aynıdır;
 * header/footer/head parçaları `node global/build.mjs` ile üretilen
 * global/dist/partials/*-d1|d2.html dosyalarından okunur.
 */
declare(strict_types=1);

namespace QRLicense\Site;

final class BlogView
{
	public const ORIGIN = 'https://qrmenuofficial.com';

	private const SITE = 'QR Menu Official';

	private const AUTHOR = array('name' => 'QR Menu Official Editör Ekibi', 'url' => 'https://qrmenuofficial.com/');

	private const MONTHS = array('', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık');

	private const PRODUCT_CARDS = array(
		array('t' => 'Restoran Menü', 'd' => 'Fiyat ve ürünleri tek panelden güncelleyin; menü baskısız güncel kalsın.', 'p' => 'moduller/restoran-menu/'),
		array('t' => 'Servis Paneli', 'd' => 'Garson çağrısı, hesap isteği ve siparişleri tek ekranda izleyin.', 'p' => 'moduller/servis-paneli/'),
		array('t' => 'Menü Mühendisliği', 'd' => 'Maliyet ve satışla popülerlik ile kârlılığı yan yana görün.', 'p' => 'moduller/menu-muhendisligi/'),
	);

	private string $root;

	/** @var list<array<string,mixed>> */
	private array $posts;

	/** @var array<string, array{slug:string,name:string,lead:string}> */
	private array $cats = array();

	/**
	 * @param list<array<string,mixed>> $posts Yayındaki yazılar (yeni → eski).
	 * @param list<array{slug:string,name:string,lead:string}> $categories
	 */
	public function __construct(string $root, array $posts, array $categories)
	{
		$this->root = rtrim($root, '/');
		$this->posts = $posts;
		foreach ($categories as $c) {
			$this->cats[$c['slug']] = $c;
		}
	}

	public function index(): string
	{
		$r = '../';
		$posts = $this->posts;
		$featured = null;
		foreach ($posts as $p) {
			if (!empty($p['featured'])) {
				$featured = $p;
				break;
			}
		}
		$featured = $featured ?? ($posts[0] ?? null);
		$rest = array_values(array_filter($posts, static fn (array $p): bool => $featured === null || $p['slug'] !== $featured['slug']));
		$url = self::ORIGIN . '/blog/';
		$title = 'Restoran ve Kafe Blogu: QR Menü, Menü Yönetimi ve Servis | QR Menu Official';
		$description = 'Restoran ve kafe sahipleri için QR menü, dijital menü, menü mühendisliği, servis akışı ve mevzuat rehberleri. Rakam uydurmadan, uygulanabilir içerik.';
		$counts = array();
		foreach ($posts as $p) {
			$counts[$p['category']] = ($counts[$p['category']] ?? 0) + 1;
		}

		$jsonld = array(
			$this->crumbs(array(array('Ana Sayfa', self::ORIGIN . '/'), array('Blog', $url))),
			array(
				'@context' => 'https://schema.org', '@type' => 'Blog', 'name' => self::SITE . ' Blog', 'url' => $url, 'inLanguage' => 'tr-TR',
				'publisher' => $this->publisher(),
				'blogPost' => array_map(fn (array $p): array => array('@type' => 'BlogPosting', 'headline' => $p['title'], 'url' => self::ORIGIN . '/blog/' . $p['slug'] . '/', 'datePublished' => $p['published_on']), $posts),
			),
		);
		$image = $featured !== null && $featured['cover'] !== '' ? self::ORIGIN . '/assets/blog/' . $featured['cover'] . '-og.jpg' : self::ORIGIN . '/assets/brand/apple-touch-icon.png';
		$h = $this->head($title, $description, $url, 'website', $image, $featured['cover_alt'] ?? self::SITE, $r, '', $jsonld);

		$cats = '';
		foreach ($this->cats as $c) {
			$cats .= '<li><button type="button" class="qb-cat" data-filter="' . $this->e($c['slug']) . '" aria-pressed="false">' . $this->e($c['name']) . ' <span>' . ($counts[$c['slug']] ?? 0) . '</span></button></li>' . "\n        ";
		}
		$featuredHtml = $featured !== null ? '<section class="qb-wrap qb-featured" aria-label="Öne çıkan yazı">' . "\n    " . $this->card($featured, $r, true, true) . "\n  </section>" : '';
		$cards = implode("\n      ", array_map(fn (array $p): string => $this->card($p, $r), $rest));
		$products = '';
		foreach (self::PRODUCT_CARDS as $x) {
			$products .= '<li><a class="qb-product" href="' . $r . $x['p'] . '"><strong>' . $this->e($x['t']) . '</strong><span>' . $this->e($x['d']) . '</span><em>İncele <span aria-hidden="true">→</span></em></a></li>' . "\n      ";
		}

		$html = $h . '
<body class="qb-page qb-page--index">
<main id="icerik" class="qb">
  <section class="qb-hero" aria-labelledby="qb-hero-title">
    <div class="qb-wrap">
      <nav class="qb-crumbs" aria-label="Sayfa yolu"><ol><li><a href="' . $r . '">Ana Sayfa</a></li><li aria-current="page">Blog</li></ol></nav>
      <p class="qb-eyebrow">QR Menu Official Blog</p>
      <h1 id="qb-hero-title">Restoranınızı yöneten kararlar için <span>net rehberler.</span></h1>
      <p class="qb-hero__lead">QR menüden menü mühendisliğine, garson çağrısından fiyat listesi kurallarına: restoran ve kafe sahipleri için doğrudan cevaplar ve uygulanabilir kontrol listeleri.</p>
      <ul class="qb-cats" aria-label="Kategoriler">
        <li><button type="button" class="qb-cat" data-filter="all" aria-pressed="true">Tümü <span>' . count($posts) . '</span></button></li>
        ' . $cats . '</ul>
    </div>
  </section>

  ' . $featuredHtml . '

  <section class="qb-wrap qb-list" aria-labelledby="qb-list-title">
    <h2 id="qb-list-title" class="qb-section-title">Son yazılar</h2>
    <div class="qb-grid" data-qb-grid>
      ' . $cards . '
    </div>
    <p class="qb-empty" data-qb-empty hidden>Bu kategoride henüz başka yazı yok.</p>
  </section>

  <section class="qb-wrap qb-products" aria-labelledby="qb-products-title">
    <div class="qb-products__head"><p class="qb-eyebrow">Çözümler</p><h2 id="qb-products-title" class="qb-section-title">Yazılardaki işleri panelden yapın</h2></div>
    <ul class="qb-products__grid">
      ' . $products . '</ul>
  </section>

  ' . $this->cta($r) . '
</main>
<script src="' . $r . 'blog/blog.js" defer></script>
</body>
</html>
';

		return $this->wrap($html, 'd1');
	}

	/**
	 * @param array<string,mixed> $p
	 */
	public function post(array $p): string
	{
		$r = '../../';
		$c = $this->cats[$p['category']] ?? array('slug' => $p['category'], 'name' => $p['category'], 'lead' => '');
		$url = self::ORIGIN . '/blog/' . $p['slug'] . '/';
		$body = $this->rel((string) $p['body'], $r);
		$items = array();
		if (preg_match_all('#<h2 id="([^"]+)">(.*?)</h2>#su', (string) $p['body'], $m, PREG_SET_ORDER) > 0) {
			foreach ($m as $x) {
				$items[] = array($x[1], trim((string) preg_replace('/\s+/', ' ', strip_tags($x[2]))));
			}
		}
		$words = count(preg_split('/\s+/u', trim(strip_tags((string) $p['body'])), -1, PREG_SPLIT_NO_EMPTY) ?: array());
		$cover = (string) $p['cover'];
		$ogImage = $cover !== '' ? self::ORIGIN . '/assets/blog/' . $cover . '-og.jpg' : self::ORIGIN . '/assets/brand/apple-touch-icon.png';
		$modified = $p['updated_on'] ?? $p['published_on'];

		$article = array(
			'@context' => 'https://schema.org', '@type' => 'BlogPosting', 'headline' => $p['title'], 'description' => $p['description'],
			'datePublished' => $p['published_on'], 'dateModified' => $modified, 'inLanguage' => 'tr-TR', 'wordCount' => $words,
			'articleSection' => $c['name'], 'mainEntityOfPage' => array('@type' => 'WebPage', '@id' => $url),
			'author' => array('@type' => 'Organization', 'name' => self::AUTHOR['name'], 'url' => self::AUTHOR['url']),
			'publisher' => $this->publisher(),
		);
		if ($cover !== '') {
			$article['image'] = array(self::ORIGIN . '/assets/blog/' . $cover . '-1200.webp', $ogImage);
		}
		if ($p['sources'] !== array()) {
			$article['citation'] = array_map(static fn (array $s): string => (string) $s['url'], $p['sources']);
		}
		$jsonld = array($this->crumbs(array(array('Ana Sayfa', self::ORIGIN . '/'), array('Blog', self::ORIGIN . '/blog/'), array($p['title'], $url))), $article);
		if ($p['faq'] !== array()) {
			$jsonld[] = array(
				'@context' => 'https://schema.org', '@type' => 'FAQPage',
				'mainEntity' => array_map(static fn (array $f): array => array('@type' => 'Question', 'name' => $f['q'], 'acceptedAnswer' => array('@type' => 'Answer', 'text' => $f['a'])), $p['faq']),
			);
		}
		$extra = '<meta property="article:published_time" content="' . $this->e($p['published_on']) . '">' . "\n" . '<meta property="article:section" content="' . $this->e($c['name']) . '">' . "\n";
		$h = $this->head($p['seo_title'] . ' | ' . self::SITE, (string) $p['description'], $url, 'article', $ogImage, (string) $p['cover_alt'], $r, $extra, $jsonld);

		$tocItems = '';
		foreach ($items as $it) {
			$tocItems .= '<li><a href="#' . $this->e($it[0]) . '">' . $this->e($it[1]) . '</a></li>';
		}
		if ($p['faq'] !== array()) {
			$tocItems .= '<li><a href="#sss">Sık sorulan sorular</a></li>';
		}

		$coverHtml = $cover !== '' ? '<figure class="qb-article__cover"><img src="' . $r . 'assets/blog/' . $this->e($cover) . '-1200.webp" srcset="' . $r . 'assets/blog/' . $this->e($cover) . '-720.webp 720w, ' . $r . 'assets/blog/' . $this->e($cover) . '-1200.webp 1200w" sizes="(min-width: 1024px) 45vw, 90vw" width="1200" height="630" alt="' . $this->e($p['cover_alt']) . '" fetchpriority="high" decoding="async"></figure>' : '';

		$faqHtml = '';
		if ($p['faq'] !== array()) {
			$faqHtml = '<section class="qb-faq" aria-labelledby="sss">
          <h2 id="sss">Sık sorulan sorular</h2>
          ' . implode("\n          ", array_map(fn (array $f): string => '<details><summary><h3>' . $this->e($f['q']) . '</h3></summary><p>' . $this->e($f['a']) . '</p></details>', $p['faq'])) . '
        </section>';
		}
		$srcHtml = '';
		if ($p['sources'] !== array()) {
			$srcHtml = '<section class="qb-sources" aria-labelledby="kaynaklar">
          <h2 id="kaynaklar">Kaynaklar</h2>
          <ol>' . implode('', array_map(fn (array $s): string => '<li><a href="' . $this->e($s['url']) . '" rel="noopener" target="_blank">' . $this->e($s['label']) . '</a></li>', $p['sources'])) . '</ol>
          <p class="qb-sources__note">Son kontrol: ' . $this->date((string) $modified) . '. Yazıda yer alan ürün özellikleri QR Menu Official\'ın mevcut paket içeriğiyle sınırlıdır.</p>
        </section>';
		}
		$prodHtml = '';
		if ($p['products'] !== array()) {
			$prodHtml = '<aside class="qb-product-box" aria-label="İlgili çözümler">
          <p class="qb-eyebrow">İlgili çözümler</p>
          <ul>' . implode('', array_map(fn (array $x): string => '<li><a href="' . $r . $this->e($x['path']) . '">' . $this->e($x['label']) . ' <span aria-hidden="true">→</span></a></li>', $p['products'])) . '</ul>
        </aside>';
		}

		$related = array();
		foreach ($p['related'] as $slug) {
			foreach ($this->posts as $q) {
				if ($q['slug'] === $slug) {
					$related[] = $q;
				}
			}
		}
		if ($related === array()) {
			$related = array_slice(array_values(array_filter($this->posts, static fn (array $q): bool => $q['slug'] !== $p['slug'])), 0, 3);
		}
		$relatedHtml = $related === array() ? '' : '<section class="qb-wrap qb-related" aria-labelledby="qb-related-title">
    <h2 id="qb-related-title" class="qb-section-title">İlgili yazılar</h2>
    <div class="qb-grid">' . implode("\n", array_map(fn (array $q): string => $this->card($q, $r), $related)) . '</div>
  </section>';

		$html = $h . '
<body class="qb-page qb-page--post">
<main id="icerik" class="qb">
  <article class="qb-article">
    <header class="qb-article__head qb-wrap">
      <nav class="qb-crumbs" aria-label="Sayfa yolu"><ol><li><a href="' . $r . '">Ana Sayfa</a></li><li><a href="' . $r . 'blog/">Blog</a></li><li aria-current="page">' . $this->e($p['title']) . '</li></ol></nav>
      <div class="qb-article__intro">
        <p class="qb-meta"><span class="qb-chip">' . $this->e($c['name']) . '</span><time datetime="' . $this->e($p['published_on']) . '">' . $this->date((string) $p['published_on']) . '</time><span>' . (int) $p['read_min'] . ' dk okuma</span></p>
        <h1>' . $this->e($p['title']) . '</h1>
        <p class="qb-article__lead">' . $this->e($p['excerpt']) . '</p>
      </div>
      ' . $coverHtml . '
    </header>

    <div class="qb-wrap qb-article__layout">
      <aside class="qb-toc" aria-labelledby="qb-toc-title">
        <details open data-qb-toc>
          <summary id="qb-toc-title">İçindekiler</summary>
          <ol>' . $tocItems . '</ol>
        </details>
      </aside>

      <div class="qb-prose">
        <section class="qb-answer" aria-label="Kısa cevap"><p class="qb-answer__label">Kısa cevap</p><p>' . $this->e($p['answer']) . '</p></section>
        ' . $body . '

        ' . $faqHtml . '

        ' . $srcHtml . '

        ' . $prodHtml . '
      </div>
    </div>
  </article>

  ' . $relatedHtml . '

  ' . $this->cta($r) . '
</main>
</body>
</html>
';

		return $this->wrap($html, 'd2');
	}

	public function sitemap(): string
	{
		$last = '';
		foreach ($this->posts as $p) {
			$last = max($last, (string) ($p['updated_on'] ?? $p['published_on']));
		}
		$urls = '  <url><loc>' . self::ORIGIN . '/blog/</loc><lastmod>' . ($last === '' ? gmdate('Y-m-d') : $last) . '</lastmod></url>' . "\n";
		foreach ($this->posts as $p) {
			$img = $p['cover'] !== '' ? '<image:image><image:loc>' . self::ORIGIN . '/assets/blog/' . $this->e($p['cover']) . '-1200.webp</image:loc></image:image>' : '';
			$urls .= '  <url><loc>' . self::ORIGIN . '/blog/' . $this->e($p['slug']) . '/</loc><lastmod>' . $this->e($p['updated_on'] ?? $p['published_on']) . '</lastmod>' . $img . '</url>' . "\n";
		}

		return '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
' . $urls . '</urlset>
';
	}

	public function feed(): string
	{
		$items = '';
		foreach ($this->posts as $p) {
			$link = self::ORIGIN . '/blog/' . $this->e($p['slug']) . '/';
			$items .= '<item><title>' . $this->e($p['title']) . '</title><link>' . $link . '</link><guid>' . $link . '</guid><pubDate>' . gmdate('D, d M Y H:i:s', (int) strtotime($p['published_on'] . ' 09:00:00 UTC')) . ' GMT</pubDate><description>' . $this->e($p['description']) . '</description></item>' . "\n";
		}

		return '<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>' . self::SITE . ' Blog</title><link>' . self::ORIGIN . '/blog/</link><description>Restoran ve kafe sahipleri için QR menü, menü yönetimi ve servis rehberleri.</description><language>tr-TR</language>
<atom:link href="' . self::ORIGIN . '/blog/feed.xml" rel="self" type="application/rss+xml"/>
' . $items . '</channel></rss>
';
	}

	/* ---------------------------------------------------------------- iç */

	/**
	 * @param array<string,mixed> $p
	 */
	private function card(array $p, string $r, bool $large = false, bool $eager = false): string
	{
		$c = $this->cats[$p['category']] ?? array('name' => (string) $p['category']);
		$tag = $large ? 'h2' : 'h3';
		$cover = (string) $p['cover'];
		$media = $cover === '' ? '' : '<span class="qb-card__media"><img src="' . $r . 'assets/blog/' . $this->e($cover) . '-720.webp" srcset="' . $r . 'assets/blog/' . $this->e($cover) . '-720.webp 720w, ' . $r . 'assets/blog/' . $this->e($cover) . '-1200.webp 1200w" sizes="' . ($large ? '(min-width: 900px) 52vw, 90vw' : '(min-width: 1024px) 30vw, (min-width: 600px) 45vw, 90vw') . '" width="720" height="378" alt="' . $this->e($p['cover_alt']) . '"' . ($eager ? ' fetchpriority="high"' : ' loading="lazy"') . ' decoding="async"></span>';

		return '<article class="qb-card' . ($large ? ' qb-card--featured' : '') . '" data-cat="' . $this->e($p['category']) . '">
  <a class="qb-card__link" href="' . $r . 'blog/' . $this->e($p['slug']) . '/">
    ' . $media . '
    <span class="qb-card__body">
      <span class="qb-meta"><span class="qb-chip">' . $this->e($c['name']) . '</span><span>' . (int) $p['read_min'] . ' dk okuma</span></span>
      <' . $tag . ' class="qb-card__title">' . $this->e($p['title']) . '</' . $tag . '>
      <span class="qb-card__excerpt">' . $this->e($p['excerpt']) . '</span>
      <span class="qb-card__more">Yazıyı oku <span aria-hidden="true">→</span></span>
    </span>
  </a>
</article>';
	}

	private function cta(string $r): string
	{
		return '<section class="qb-wrap qb-cta-wrap" aria-labelledby="qb-cta-title">
  <div class="qb-cta">
    <p class="qb-eyebrow">Demo</p>
    <h2 id="qb-cta-title">Okuduklarınızı kendi menünüzde düşünün.</h2>
    <p>Temel, Pro ve Plus paketlerinin demo menülerini telefonunuzda açın; sorularınız için bize ulaşın.</p>
    <div class="qb-cta__actions"><a class="qb-btn qb-btn--gold" href="' . $r . 'canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a><a class="qb-btn qb-btn--ghost" href="' . $r . 'iletisim/">İletişime Geçin</a></div>
  </div>
</section>';
	}

	/**
	 * @param list<array<string,mixed>> $jsonld
	 */
	private function head(string $title, string $description, string $canonical, string $ogType, string $image, string $imageAlt, string $r, string $extra, array $jsonld): string
	{
		$ld = '';
		foreach ($jsonld as $o) {
			$ld .= '<script type="application/ld+json">' . str_replace('<', '<', (string) json_encode($o, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) . "</script>\n";
		}

		return '<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>' . $this->e($title) . '</title>
<meta name="description" content="' . $this->e($description) . '">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#0D2B22">
<meta name="color-scheme" content="light">
<link rel="canonical" href="' . $this->e($canonical) . '">
<link rel="alternate" type="application/rss+xml" title="' . self::SITE . ' Blog" href="' . self::ORIGIN . '/blog/feed.xml">
<meta property="og:type" content="' . $ogType . '">
<meta property="og:site_name" content="' . self::SITE . '">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="' . $this->e($title) . '">
<meta property="og:description" content="' . $this->e($description) . '">
<meta property="og:url" content="' . $this->e($canonical) . '">
<meta property="og:image" content="' . $this->e($image) . '">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="' . $this->e($imageAlt) . '">
<meta name="twitter:card" content="summary_large_image">
' . $extra . '<link rel="stylesheet" href="' . $r . 'blog/blog.css">
' . $ld . '</head>';
	}

	/** global parçalarını (head/header/footer) işaretçileriyle yerleştirir. */
	private function wrap(string $html, string $depth): string
	{
		$part = fn (string $n): string => rtrim((string) @file_get_contents($this->root . '/global/dist/partials/' . $n . '-' . $depth . '.html'), "\n");
		$block = static fn (string $name, string $body): string => '<!-- QRMO:' . $name . ':START -->' . "\n" . $body . "\n" . '<!-- QRMO:' . $name . ':END -->';
		$html = str_replace('</head>', $block('HEAD', $part('head')) . "\n</head>", $html);
		$html = (string) preg_replace_callback('/<body[^>]*>/', fn (array $m): string => $m[0] . "\n" . $block('HEADER', $part('header')), $html, 1);

		return str_replace('</body>', $block('FOOTER', $part('footer')) . "\n</body>", $html);
	}

	private function rel(string $html, string $r): string
	{
		return (string) preg_replace_callback('/(href|src)="@\/([^"]*)"/', static fn (array $m): string => $m[1] . '="' . $r . $m[2] . '"', $html);
	}

	/**
	 * @param list<array{0:string,1:string}> $items
	 * @return array<string,mixed>
	 */
	private function crumbs(array $items): array
	{
		$list = array();
		foreach ($items as $i => $it) {
			$list[] = array('@type' => 'ListItem', 'position' => $i + 1, 'name' => $it[0], 'item' => $it[1]);
		}

		return array('@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => $list);
	}

	/**
	 * @return array<string,mixed>
	 */
	private function publisher(): array
	{
		return array('@type' => 'Organization', 'name' => self::SITE, 'url' => self::ORIGIN . '/', 'logo' => array('@type' => 'ImageObject', 'url' => self::ORIGIN . '/assets/brand/apple-touch-icon.png'));
	}

	private function date(string $d): string
	{
		$t = strtotime($d . ' 12:00:00 UTC');
		if ($t === false) {
			return $d;
		}

		return (int) gmdate('j', $t) . ' ' . self::MONTHS[(int) gmdate('n', $t)] . ' ' . gmdate('Y', $t);
	}

	/**
	 * @param mixed $s
	 */
	private function e($s): string
	{
		return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
	}
}
