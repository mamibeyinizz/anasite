#!/usr/bin/env node
/* =========================================================
   QR MENU OFFICIAL — BLOG ÜRETİCİSİ
   Kullanım: node blog/build.mjs   (kapaklar: node blog/covers.mjs)
   Çıktı: blog/index.html · blog/<slug>/index.html · sitemap-blog.xml
   Header/footer global/inject.mjs → applyGlobal() ile yazılır.
========================================================= */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { applyGlobal } from "../global/inject.mjs";
import { POSTS, CATEGORIES, AUTHOR } from "./posts.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const ORIGIN = "https://qrmenuofficial.com";
const SITE = "QR Menu Official";
const LOGO = `${ORIGIN}/assets/brand/apple-touch-icon.png`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
const cat = (id) => CATEGORIES.find((c) => c.id === id);
const bySlug = (s) => POSTS.find((p) => p.slug === s);
const fmtDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const plain = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/* Doğrulama: zorunlu alanlar, benzersiz slug, ilişkili yazılar mevcut */
const seen = new Set();
for (const p of POSTS) {
  for (const k of ["slug", "title", "seoTitle", "description", "category", "date", "cover", "coverAlt", "answer", "body"]) if (!p[k]) throw new Error(`${p.slug}: ${k} eksik`);
  if (seen.has(p.slug)) throw new Error(`slug tekrar: ${p.slug}`);
  seen.add(p.slug);
  if (!cat(p.category)) throw new Error(`${p.slug}: kategori yok`);
  if (p.description.length > 165) throw new Error(`${p.slug}: meta açıklama ${p.description.length} karakter`);
  if (p.seoTitle.length + SITE.length + 3 > 75) console.warn(`uyarı: ${p.slug} başlık uzun (${p.seoTitle.length})`);
  for (const r of p.related || []) if (!bySlug(r)) throw new Error(`${p.slug}: ilişkili yazı yok: ${r}`);
}

/* "@/yol/" → sayfa derinliğine göre göreli */
const rel = (html, r) => html.replace(/href="@\/([^"]*)"/g, (_, p) => `href="${r}${p}"`);
const toc = (body) => [...body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({ id: m[1], text: plain(m[2]) }));

function head({ title, description, canonical, ogType, image, imageAlt, r, extra = "", jsonld = [] }) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#0D2B22">
<meta name="color-scheme" content="light">
<link rel="canonical" href="${canonical}">
<link rel="alternate" type="application/rss+xml" title="${SITE} Blog" href="${ORIGIN}/blog/feed.xml">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${SITE}">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
${extra}<link rel="stylesheet" href="${r}blog/blog.css">
${jsonld.map((o) => `<script type="application/ld+json">${json(o)}</script>`).join("\n")}
</head>`;
}

const crumbs = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item }))
});

function cardHtml(p, r, { large = false, eager = false } = {}) {
  const c = cat(p.category);
  return `<article class="qb-card${large ? " qb-card--featured" : ""}" data-cat="${p.category}">
  <a class="qb-card__link" href="${r}blog/${p.slug}/">
    <span class="qb-card__media"><img src="${r}assets/blog/${p.cover}-720.webp" srcset="${r}assets/blog/${p.cover}-720.webp 720w, ${r}assets/blog/${p.cover}-1200.webp 1200w" sizes="${large ? "(min-width: 900px) 52vw, 90vw" : "(min-width: 1024px) 30vw, (min-width: 600px) 45vw, 90vw"}" width="720" height="378" alt="${esc(p.coverAlt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></span>
    <span class="qb-card__body">
      <span class="qb-meta"><span class="qb-chip">${esc(c.name)}</span><span>${p.readMin} dk okuma</span></span>
      <${large ? "h2" : "h3"} class="qb-card__title">${esc(p.title)}</${large ? "h2" : "h3"}>
      <span class="qb-card__excerpt">${esc(p.excerpt)}</span>
      <span class="qb-card__more">Yazıyı oku <span aria-hidden="true">→</span></span>
    </span>
  </a>
</article>`;
}

const PRODUCT_CARDS = [
  { t: "Restoran Menü", d: "Fiyat ve ürünleri tek panelden güncelleyin; menü baskısız güncel kalsın.", p: "moduller/restoran-menu/" },
  { t: "Servis Paneli", d: "Garson çağrısı, hesap isteği ve siparişleri tek ekranda izleyin.", p: "moduller/servis-paneli/" },
  { t: "Menü Mühendisliği", d: "Maliyet ve satışla popülerlik ile kârlılığı yan yana görün.", p: "moduller/menu-muhendisligi/" }
];

function cta(r) {
  return `<section class="qb-wrap qb-cta-wrap" aria-labelledby="qb-cta-title">
  <div class="qb-cta">
    <p class="qb-eyebrow">Demo</p>
    <h2 id="qb-cta-title">Okuduklarınızı kendi menünüzde düşünün.</h2>
    <p>Temel, Pro ve Plus paketlerinin demo menülerini telefonunuzda açın; sorularınız için bize ulaşın.</p>
    <div class="qb-cta__actions"><a class="qb-btn qb-btn--gold" href="${r}canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a><a class="qb-btn qb-btn--ghost" href="${r}iletisim/">İletişime Geçin</a></div>
  </div>
</section>`;
}

/* ------------------------------------------------------------ BLOG ANA SAYFA */
function renderIndex() {
  const r = "../";
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const featured = sorted.find((p) => p.featured) || sorted[0];
  const rest = sorted.filter((p) => p !== featured);
  const url = `${ORIGIN}/blog/`;
  const title = "Restoran ve Kafe Blogu: QR Menü, Menü Yönetimi ve Servis | QR Menu Official";
  const description = "Restoran ve kafe sahipleri için QR menü, dijital menü, menü mühendisliği, servis akışı ve mevzuat rehberleri. Rakam uydurmadan, uygulanabilir içerik.";
  const jsonld = [
    crumbs([["Ana Sayfa", `${ORIGIN}/`], ["Blog", url]]),
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${SITE} Blog`,
      url,
      inLanguage: "tr-TR",
      publisher: { "@type": "Organization", name: SITE, url: `${ORIGIN}/`, logo: { "@type": "ImageObject", url: LOGO } },
      blogPost: sorted.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${ORIGIN}/blog/${p.slug}/`, datePublished: p.date }))
    }
  ];
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, POSTS.filter((p) => p.category === c.id).length]));
  return `${head({ title, description, canonical: url, ogType: "website", image: `${ORIGIN}/assets/blog/${featured.cover}-og.jpg`, imageAlt: featured.coverAlt, r, jsonld })}
<body class="qb-page qb-page--index">
<main id="icerik" class="qb">
  <section class="qb-hero" aria-labelledby="qb-hero-title">
    <div class="qb-wrap">
      <nav class="qb-crumbs" aria-label="Sayfa yolu"><ol><li><a href="${r}">Ana Sayfa</a></li><li aria-current="page">Blog</li></ol></nav>
      <p class="qb-eyebrow">QR Menu Official Blog</p>
      <h1 id="qb-hero-title">Restoranınızı yöneten kararlar için <span>net rehberler.</span></h1>
      <p class="qb-hero__lead">QR menüden menü mühendisliğine, garson çağrısından fiyat listesi kurallarına: restoran ve kafe sahipleri için doğrudan cevaplar ve uygulanabilir kontrol listeleri.</p>
      <ul class="qb-cats" aria-label="Kategoriler">
        <li><button type="button" class="qb-cat" data-filter="all" aria-pressed="true">Tümü <span>${POSTS.length}</span></button></li>
        ${CATEGORIES.map((c) => `<li><button type="button" class="qb-cat" data-filter="${c.id}" aria-pressed="false">${esc(c.name)} <span>${counts[c.id]}</span></button></li>`).join("\n        ")}
      </ul>
    </div>
  </section>

  <section class="qb-wrap qb-featured" aria-label="Öne çıkan yazı">
    ${cardHtml(featured, r, { large: true, eager: true })}
  </section>

  <section class="qb-wrap qb-list" aria-labelledby="qb-list-title">
    <h2 id="qb-list-title" class="qb-section-title">Son yazılar</h2>
    <div class="qb-grid" data-qb-grid>
      ${rest.map((p) => cardHtml(p, r)).join("\n      ")}
    </div>
    <p class="qb-empty" data-qb-empty hidden>Bu kategoride henüz başka yazı yok.</p>
  </section>

  <section class="qb-wrap qb-products" aria-labelledby="qb-products-title">
    <div class="qb-products__head"><p class="qb-eyebrow">Çözümler</p><h2 id="qb-products-title" class="qb-section-title">Yazılardaki işleri panelden yapın</h2></div>
    <ul class="qb-products__grid">
      ${PRODUCT_CARDS.map((x) => `<li><a class="qb-product" href="${r}${x.p}"><strong>${esc(x.t)}</strong><span>${esc(x.d)}</span><em>İncele <span aria-hidden="true">→</span></em></a></li>`).join("\n      ")}
    </ul>
  </section>

  ${cta(r)}
</main>
<script src="${r}blog/blog.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------ YAZI SAYFASI */
function renderPost(p) {
  const r = "../../";
  const c = cat(p.category);
  const url = `${ORIGIN}/blog/${p.slug}/`;
  const items = toc(p.body);
  const words = plain(p.body).split(" ").length;
  const jsonld = [
    crumbs([["Ana Sayfa", `${ORIGIN}/`], ["Blog", `${ORIGIN}/blog/`], [p.title, url]]),
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      image: [`${ORIGIN}/assets/blog/${p.cover}-1200.webp`, `${ORIGIN}/assets/blog/${p.cover}-og.jpg`],
      datePublished: p.date,
      dateModified: p.updated || p.date,
      inLanguage: "tr-TR",
      wordCount: words,
      articleSection: c.name,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Organization", name: AUTHOR.name, url: AUTHOR.url },
      publisher: { "@type": "Organization", name: SITE, url: `${ORIGIN}/`, logo: { "@type": "ImageObject", url: LOGO } },
      citation: p.sources.map((s) => s.url)
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
    }
  ];
  const extra = `<meta property="article:published_time" content="${p.date}">\n<meta property="article:section" content="${esc(c.name)}">\n`;
  return `${head({ title: `${p.seoTitle} | ${SITE}`, description: p.description, canonical: url, ogType: "article", image: `${ORIGIN}/assets/blog/${p.cover}-og.jpg`, imageAlt: p.coverAlt, r, extra, jsonld })}
<body class="qb-page qb-page--post">
<main id="icerik" class="qb">
  <article class="qb-article">
    <header class="qb-article__head qb-wrap">
      <nav class="qb-crumbs" aria-label="Sayfa yolu"><ol><li><a href="${r}">Ana Sayfa</a></li><li><a href="${r}blog/">Blog</a></li><li aria-current="page">${esc(p.title)}</li></ol></nav>
      <div class="qb-article__intro">
        <p class="qb-meta"><span class="qb-chip">${esc(c.name)}</span><time datetime="${p.date}">${fmtDate(p.date)}</time><span>${p.readMin} dk okuma</span></p>
        <h1>${esc(p.title)}</h1>
        <p class="qb-article__lead">${esc(p.excerpt)}</p>
      </div>
      <figure class="qb-article__cover"><img src="${r}assets/blog/${p.cover}-1200.webp" srcset="${r}assets/blog/${p.cover}-720.webp 720w, ${r}assets/blog/${p.cover}-1200.webp 1200w" sizes="(min-width: 1024px) 45vw, 90vw" width="1200" height="630" alt="${esc(p.coverAlt)}" fetchpriority="high" decoding="async"></figure>
    </header>

    <div class="qb-wrap qb-article__layout">
      <aside class="qb-toc" aria-labelledby="qb-toc-title">
        <details open data-qb-toc>
          <summary id="qb-toc-title">İçindekiler</summary>
          <ol>${items.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}<li><a href="#sss">Sık sorulan sorular</a></li></ol>
        </details>
      </aside>

      <div class="qb-prose">
        <section class="qb-answer" aria-label="Kısa cevap"><p class="qb-answer__label">Kısa cevap</p><p>${esc(p.answer)}</p></section>
        ${rel(p.body, r).trim()}

        <section class="qb-faq" aria-labelledby="sss">
          <h2 id="sss">Sık sorulan sorular</h2>
          ${p.faq.map((f) => `<details><summary><h3>${esc(f.q)}</h3></summary><p>${esc(f.a)}</p></details>`).join("\n          ")}
        </section>

        <section class="qb-sources" aria-labelledby="kaynaklar">
          <h2 id="kaynaklar">Kaynaklar</h2>
          <ol>${p.sources.map((s) => `<li><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a></li>`).join("")}</ol>
          <p class="qb-sources__note">Son kontrol: ${fmtDate(p.updated || p.date)}. Yazıda yer alan ürün özellikleri QR Menu Official'ın mevcut paket içeriğiyle sınırlıdır.</p>
        </section>

        <aside class="qb-product-box" aria-label="İlgili çözümler">
          <p class="qb-eyebrow">İlgili çözümler</p>
          <ul>${(p.products || []).map((x) => `<li><a href="${r}${x.path}">${esc(x.label)} <span aria-hidden="true">→</span></a></li>`).join("")}</ul>
        </aside>
      </div>
    </div>
  </article>

  <section class="qb-wrap qb-related" aria-labelledby="qb-related-title">
    <h2 id="qb-related-title" class="qb-section-title">İlgili yazılar</h2>
    <div class="qb-grid">${p.related.map((s) => cardHtml(bySlug(s), r)).join("\n")}</div>
  </section>

  ${cta(r)}
</main>
</body>
</html>
`;
}

/* ------------------------------------------------------------ YAZ */
const writeHtml = (rp, html, opts) => {
  const f = path.join(root, rp);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, applyGlobal(html, opts));
  console.log("yazıldı", rp);
};
writeHtml("blog/index.html", renderIndex(), { rel: "../", current: "blog", skip: "icerik" });
for (const p of POSTS) writeHtml(`blog/${p.slug}/index.html`, renderPost(p), { rel: "../../", current: "blog", skip: "icerik" });

const urls = [{ loc: `${ORIGIN}/blog/`, lastmod: POSTS.map((p) => p.updated || p.date).sort().at(-1) }, ...POSTS.map((p) => ({ loc: `${ORIGIN}/blog/${p.slug}/`, lastmod: p.updated || p.date, img: `${ORIGIN}/assets/blog/${p.cover}-1200.webp` }))];
fs.writeFileSync(
  path.join(root, "sitemap-blog.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod>${u.img ? `<image:image><image:loc>${u.img}</image:loc></image:image>` : ""}</url>`).join("\n")}
</urlset>
`
);
fs.writeFileSync(
  path.join(root, "blog/feed.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${SITE} Blog</title><link>${ORIGIN}/blog/</link><description>Restoran ve kafe sahipleri için QR menü, menü yönetimi ve servis rehberleri.</description><language>tr-TR</language>
<atom:link href="${ORIGIN}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${[...POSTS].sort((a, b) => b.date.localeCompare(a.date)).map((p) => `<item><title>${esc(p.title)}</title><link>${ORIGIN}/blog/${p.slug}/</link><guid>${ORIGIN}/blog/${p.slug}/</guid><pubDate>${new Date(p.date + "T09:00:00Z").toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join("\n")}
</channel></rss>
`
);
console.log("sitemap-blog.xml + blog/feed.xml yazıldı");
