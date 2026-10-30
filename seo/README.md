# SEO çalışması — Blog (2026-10-30)

## Yöntem ve sınırlar
- **Arama hacmi ölçülmedi.** Bu ortamda Ahrefs/Similarweb bağlantısı kurulamadı ve Google Keyword Planner erişimi yok. `keywords.csv` içindeki `arama_hacmi` sütunu bilerek `veri yok`; sayı uydurulmadı. İlk iş: Google Search Console + Keyword Planner ile bu sütunu doldurup önceliği yeniden sıralamak.
- **Rekabet** sütunu ölçüm değil, 2026-10'da yapılan web aramalarındaki SERP gözlemidir ("gözlem" etiketi).
- **Ticari potansiyel** ürünle eşleşme ve satın alma niyetine göre yapılan nitel değerlendirmedir.

## SERP gözlemleri
- "qr menü" kümesi TR'de büyük ölçüde **qrcode-tiger.com/tr** çeviri sayfaları, Jotform/Canva araç sayfaları, uygulama mağazaları ve haber/ekşi sözlük ile dolu. Türkçe, yerel, ürün-gerçekliğine dayalı derin rehber az → fırsat.
- "menü mühendisliği" kümesinde **akademik PDF'ler (DergiPark, üniversite açık erişim)** ve bir POS firması blogu (NarPOS) öne çıkıyor; uygulamalı, örnek hesaplı içerik az.
- "karekod fiyat listesi" kümesi tamamen **haber siteleri** + Ticaret Bakanlığı duyurusu; işletme için kontrol listesi veren içerik az.
- "ek satış / upselling" TR SERP'ünde İngilizce kaynaklar baskın → Türkçe içerik boşluğu.
- "garson çağırma sistemi" SERP'ü App Store uygulamaları ve donanım ilanları; açıklayıcı rehber az.

## Yayımlanan 5 yazı (öncelik gerekçesi)
| URL | Hedef küme | Neden ilk 5 |
|---|---|---|
| /blog/qr-menu-nedir/ | qr menü, qr menü nedir, restoran qr menü | En geniş ticari küme, pillar sayfa |
| /blog/karekod-fiyat-listesi-yonetmeligi/ | yönetmelik, qr menü yasal mı | Güncel (Ekim 2025), her işletmeyi ilgilendiriyor, rekabet haber siteleri |
| /blog/menu-muhendisligi-nedir/ | menü mühendisliği | Plus paket modülüyle doğrudan eşleşme, uygulamalı içerik boşluğu |
| /blog/dijital-menu-nasil-hazirlanir/ | dijital menü nasıl yapılır, kafe dijital menü | Geçiş niyetindeki kullanıcı, demo'ya yakın |
| /blog/garson-cagirma-sistemi/ | garson çağırma sistemi | Pro paket servis paneliyle eşleşme |

## Teknik SEO durumu
- Her yazıda: benzersiz `<title>`/meta açıklama, canonical, Open Graph (+ 1200×630 JPG), Twitter kartı, BlogPosting + FAQPage + BreadcrumbList JSON-LD, tek H1, sıralı H2/H3, içindekiler, FAQ, kaynaklar, iç bağlantılar.
- `sitemap-blog.xml` (görsel uzantılı), `sitemap.xml` (index), `robots.txt`, `blog/feed.xml` (RSS) eklendi.
- **Açık:** `sitemap-paketler-moduller.xml` içinde `/sss/` yok (moduller/build.js çıktısı; bu PR'da dokunulmadı).
- **Doğrulanamayan:** Bu ortamdan ticaret.gov.tr ve resmigazete.gov.tr açılamadı; kaynak bağlantıları arama sonuçlarından alındı, yayın öncesi tıklanıp kontrol edilmeli.
