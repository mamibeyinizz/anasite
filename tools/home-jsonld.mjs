#!/usr/bin/env node
/* =========================================================
   Ana sayfa yapılandırılmış verisi (Organization + WebSite + SoftwareApplication).
   Fiyatlar paketler/packages-data.js'ten okunur; iletişim ve sosyal hesaplar iletisim
   sayfasıyla aynıdır. Kullanım: node tools/home-jsonld.mjs  (tekrar çalıştırılabilir;
   <!-- QRMO:JSONLD:START --> … END arasını yeniler). Fiyat değişince yeniden çalıştırın.
========================================================= */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://qrmenuofficial.com";
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "paketler/packages-data.js"), "utf8"), ctx);
const P = ctx.window.QRMO_PRICING;

const org = {
  "@type": "Organization",
  "@id": `${ORIGIN}/#organization`,
  name: "QR Menu Official",
  url: `${ORIGIN}/`,
  logo: { "@type": "ImageObject", url: `${ORIGIN}/assets/brand/apple-touch-icon.png`, width: 180, height: 180 },
  email: "muhammedulusoyresmi@gmail.com",
  telephone: "+905422043587",
  contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", telephone: "+905422043587", email: "muhammedulusoyresmi@gmail.com", areaServed: "TR", availableLanguage: ["Turkish"] }],
  sameAs: ["https://www.instagram.com/qrmenuofficial/", "https://www.facebook.com/qrmenuofficial", "https://x.com/qrmenuofficial", "https://www.tiktok.com/@qrmenuofficial"]
};
const site = { "@type": "WebSite", "@id": `${ORIGIN}/#website`, name: "QR Menu Official", url: `${ORIGIN}/`, inLanguage: "tr-TR", publisher: { "@id": `${ORIGIN}/#organization` } };
const app = {
  "@type": "SoftwareApplication",
  "@id": `${ORIGIN}/#software`,
  name: "QR Menu Official",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Restoran ve kafeler için dijital QR menü, masa QR kodu, garson çağrısı, QR sipariş ve servis paneli.",
  url: `${ORIGIN}/`,
  publisher: { "@id": `${ORIGIN}/#organization` },
  offers: P.packages.map((p) => ({
    "@type": "Offer",
    name: `${p.name} paket (aylık)`,
    price: String(p.price.monthly),
    priceCurrency: "TRY",
    url: `${ORIGIN}/paketler/`,
    category: "subscription"
  }))
};
const json = JSON.stringify({ "@context": "https://schema.org", "@graph": [org, site, app] }).replace(/</g, "\\u003c");
const block = `<!-- QRMO:JSONLD:START -->\n<script type="application/ld+json">${json}</script>\n<!-- QRMO:JSONLD:END -->\n`;

const file = path.join(root, "index.html");
let html = fs.readFileSync(file, "utf8");
const re = /<!-- QRMO:JSONLD:START -->[\s\S]*?<!-- QRMO:JSONLD:END -->\n?/;
html = re.test(html) ? html.replace(re, block) : html.replace("</head>", block + "</head>");
fs.writeFileSync(file, html);
console.log("index.html: JSON-LD yazıldı (" + P.packages.map((p) => p.name + " " + p.price.monthly).join(", ") + ")");
