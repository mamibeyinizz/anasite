#!/usr/bin/env node
/* =========================================================
   llms.txt üreticisi (https://llmstxt.org): yapay zekâ arama motorları ve
   asistanlar için sitenin özeti ve önemli sayfaları.
   Kaynaklar: paketler/packages-data.js, moduller/module-data.js, blog/posts.mjs.
   Kullanım: node tools/llms-txt.mjs  (blog/build.mjs her üretimde çağırır)
   Not: Canlı blog veritabanındadır; panelden eklenen yazılar bu dosyaya
   ancak blog/posts.mjs'e de eklenip yeniden üretildiğinde girer.
========================================================= */
import fs from "fs";
import path from "path";
import vm from "vm";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://qrmenuofficial.com";

export async function writeLlms() {
  const require = createRequire(import.meta.url);
  const MOD = require(path.join(root, "moduller/module-data.js"));
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, "paketler/packages-data.js"), "utf8"), ctx);
  const P = ctx.window.QRMO_PRICING;
  const { POSTS, CATEGORIES } = await import(path.join(root, "blog/posts.mjs"));

  const tl = (n) => n.toLocaleString("tr-TR");
  const pkgFeatures = (id) => {
    const order = P.packages.map((p) => p.id);
    const idx = order.indexOf(id);
    const own = P.features.filter((f) => order.indexOf(f.from) === idx).map((f) => f.label || f.name);
    return own.join(", ");
  };

  const lines = [];
  lines.push("# QR Menu Official", "");
  lines.push("> Türkiye'deki restoran ve kafeler için dijital QR menü ve masa servis sistemi. Misafir masadaki karekodu okutur, menüyü uygulama indirmeden telefonunda açar; işletme ürün ve fiyatları panelden günceller. Pro paketten itibaren garson çağrısı, hesap talebi ve QR ile sipariş bir servis paneline düşer.", "");
  lines.push("Ürün hakkında kesin bilgiler:", "");
  lines.push("- Sistem online ödeme almaz; sipariş ve hesap talebi servis paneline iletilir, ödeme işletmenin kendi yöntemiyle alınır.");
  lines.push("- Çoklu dil desteği 30 dildir; çeviriler elle ya da CSV ile girilir, otomatik çeviri yapılmaz.");
  lines.push("- Alerjen ve diyet filtreleri, ürünlere girilen bilgiye dayanır; içerik otomatik algılanmaz.");
  lines.push("- Menü mühendisliği ve maliyet hesabı, işletmenin girdiği malzeme fiyatları ve reçetelerle çalışır.");
  lines.push("- Menü asistanı (Google Gemini tabanlı) cevaplayamadığı soruları raporlar; personel görüşmeyi devralabilir.");
  lines.push("- Masa oturumu imzalı ve süresi sınırlıdır (varsayılan 90 dakika toplam, 30 dakika hareketsizlik); yalnızca kayıtlı masalar için açılır.");
  lines.push("- Menü analitiği görüntüleme, ürün tıklaması ve menüde bulunamayan aramaları gösterir; kasa satış verisi değildir.", "");

  lines.push("## Paketler", "");
  for (const p of P.packages) {
    lines.push(`- [${p.name} — aylık ${tl(p.price.monthly)} TL, yıllık ${tl(p.price.annual)} TL](${ORIGIN}/paketler/): ${p.summary} ${p.id === P.packages[0].id ? "İçerik" : "Ek olarak"}: ${pkgFeatures(p.id)}.`);
  }
  lines.push("", `Yıllık ödemede ${P.annual.usedMonths} ay kullanım için ${P.annual.payMonths} aylık ücret ödenir. Güncel fiyat için ${ORIGIN}/paketler/ esas alınır.`, "");

  lines.push("## Modüller", "");
  for (const m of [...MOD.modules].sort((a, b) => (a.order || 0) - (b.order || 0))) {
    lines.push(`- [${m.name}](${ORIGIN}/moduller/${m.slug}/): ${m.tagline}`);
  }
  lines.push("");

  lines.push("## Önemli sayfalar", "");
  lines.push(`- [Ana sayfa](${ORIGIN}/): Ürünün genel tanıtımı.`);
  lines.push(`- [Paketler ve fiyatlar](${ORIGIN}/paketler/): Temel, Pro ve Plus paketlerinin özellik karşılaştırması.`);
  lines.push(`- [Canlı demo menüler](${ORIGIN}/canli-menu/): Paketlere göre çalışan demo menüler.`);
  lines.push(`- [Sıkça sorulan sorular](${ORIGIN}/sss/): Menü, sipariş, analitik ve paketler hakkında sorular.`);
  lines.push(`- [İletişim](${ORIGIN}/iletisim/): Telefon ve e-posta.`, "");

  for (const c of CATEGORIES) {
    const posts = POSTS.filter((p) => p.category === c.id).sort((a, b) => (a.date < b.date ? 1 : -1));
    if (!posts.length) continue;
    lines.push(`## Blog: ${c.name}`, "");
    for (const p of posts) lines.push(`- [${p.title}](${ORIGIN}/blog/${p.slug}/): ${p.answer}`);
    lines.push("");
  }

  lines.push("## Optional", "");
  lines.push(`- [Gizlilik Politikası ve KVKK Aydınlatma Metni](${ORIGIN}/gizlilik/)`);
  lines.push(`- [Çerez Politikası](${ORIGIN}/cerez-politikasi/)`);
  lines.push(`- [Kullanım Şartları](${ORIGIN}/kullanim-sartlari/)`);
  lines.push(`- [Blog RSS](${ORIGIN}/blog/feed.xml)`, "");

  fs.writeFileSync(path.join(root, "llms.txt"), lines.join("\n"));
  return lines.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const n = await writeLlms();
  console.log(`llms.txt yazıldı (${n} satır)`);
}
