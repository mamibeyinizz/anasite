/* 404.html üretir (kök dizin). Sunucu hata sayfası her derinlikte açılabildiği için
   <base href="/"> kullanılır; global header/footer kök bağlantılarıyla (rel="") çalışır.
   Çalıştır: node global/build404.mjs (sıra: ... && node global/build.mjs && node global/build404.mjs) */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyGlobal } from "./inject.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sayfa bulunamadı | QR Menu Official</title>
<meta name="robots" content="noindex,follow">
<meta name="theme-color" content="#FDFBF5">
<style>
html{background:#FBF7EE}
.qrmo-404{padding:clamp(48px,10vw,120px) 5vw;background:#FBF7EE;color:#0D2B22}
.qrmo-404__in{max-width:640px;margin:0 auto}
.qrmo-404 p{max-width:var(--ts-measure,38em)}
.qrmo-404__eyebrow{color:var(--ts-gold-ink,#7f6419);margin:0 0 12px}
.qrmo-404__h{margin:0 0 16px}
.qrmo-404__lead{margin:0 0 28px;color:var(--ts-ink-soft,#4a5a52)}
.qrmo-404__acts{display:flex;flex-wrap:wrap;gap:12px}
.qrmo-404__btn{display:inline-flex;align-items:center;min-height:48px;padding:0 24px;border-radius:999px;background:#0D2B22;color:#fff;text-decoration:none}
.qrmo-404__btn--alt{background:transparent;color:#0D2B22;box-shadow:inset 0 0 0 2px #0D2B22}
.qrmo-404__btn:focus-visible{outline:3px solid #7f6419;outline-offset:3px}
@media (max-width:560px){.qrmo-404{padding-left:15px;padding-right:15px}}
</style>
</head>
<body>
<main class="qrmo-404" id="icerik">
<div class="qrmo-404__in">
<p class="qrmo-404__eyebrow ts-eyebrow">Hata 404</p>
<h1 class="qrmo-404__h ts-h1">Aradığınız sayfa bulunamadı</h1>
<p class="qrmo-404__lead ts-lead">Adres değişmiş ya da yanlış yazılmış olabilir. Ana sayfadan devam edebilir veya doğrudan bize ulaşabilirsiniz.</p>
<div class="qrmo-404__acts">
<a class="qrmo-404__btn ts-btn" href="./">Ana sayfa</a>
<a class="qrmo-404__btn qrmo-404__btn--alt ts-btn" href="paketler/">Paketler</a>
<a class="qrmo-404__btn qrmo-404__btn--alt ts-btn" href="iletisim/">İletişim</a>
</div>
</div>
</main>
</body>
</html>
`;
const out = applyGlobal(html, { rel: "", current: "", skip: "icerik" });
fs.writeFileSync(path.join(ROOT, "404.html"), out);
console.log("yazıldı 404.html");
