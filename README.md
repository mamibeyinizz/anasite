# QR Menu Official — Ana Site

QR Menu Official'ın ana satış sitesi için çalışma alanı.

## Branch ve kod durumu

- **Güncel çalışma branch'i:** `claude/qr-menu-section-9-strategy-eircho`. Homepage'in 12 section'ının tamamı (Section 1–12) bu branch'te uygulanmıştır: Section 1–10 `dcaeec9` commit'ine kadar, Section 11 (FAQ) ve Section 12 (Son CTA) bu güncellemeyle aynı iş paketinde.
- **`main`:** Eski, Hero-only durumdadır (`aabf2f0`). `main`'de yalnızca Section 1 (Hero) vardır; Section 2–12 `main`'e merge **edilmemiştir**. Merge planı **TBD**.
- Section 2–8'i getiren geçmiş, `claude/section-6-chatbot-audit-5aah0t` branch'inden gelir (`a622f08`); güncel branch bu geçmişin üzerine kurulmuştur.

## Yapı

- `index.html` — Ana sayfa. Section 1–12 bu dosyada entegredir.
- `HOMEPAGE_ARCHITECTURE.md` — Section mimarisi ve güncel section sırası (**kaynak doküman**)
- `HOMEPAGE_BLUEPRINT.md` — Section bazlı içerik ve görsel blueprint
- `PRODUCT_SCREEN_ASSETS.md` — Gerçek ürün ekranı asset kaynakları ve durumu
- `DESIGN_SYSTEM.md` — Tasarım sistemi dokümantasyonu
- `CONTENT_STRATEGY.md` — İçerik/copy stratejisi ve ürün gerçekliği sınırları
- `sections/` — Sayfa bölümlerinin ayrı kaynak dosyaları
- `paketler/` — `/paketler/` fiyat sayfası (içerik: `paketler/packages-data.js`)
- `moduller/` — `/moduller/` modül dizini + 10 modül sayfası (içerik: `moduller/module-data.js`; üretim: `node moduller/build.js`)
- `sitemap-paketler-moduller.xml` — `build.js` çıktısı; repoda başka bir sitemap/robots yoktur, mevcut site haritasıyla birleştirme dağıtım tarafının işidir
- `css/` — Stil dosyaları
- `js/` — JavaScript dosyaları
- `assets/` — Görsel ve statik dosyalar

### `sections/` dosyaları

| Dosya | Durum |
|---|---|
| `section-6-chatbot.html` | Aktif kaynak (Section 6) |
| `section-7-service.html` | Aktif kaynak (Section 7) |
| `section-8-analytics.html` | Aktif kaynak (Section 8) |
| `section-9-transition.html` | **Aktif kaynak** (Section 9 — Geçiş Kararı) |
| `section-10-installation.html` | **Aktif kaynak** (Section 10 — Kurulum) |
| `section-11-faq.html` | **Aktif kaynak** (Section 11 — FAQ / İtirazlar) |
| `section-12-final-cta.html` | **Aktif kaynak** (Section 12 — Son CTA) |
| `section-9-security.html` | **Arşiv / yetim kaynak.** Güvenlik artık homepage section'ı değildir; `index.html` bu dosyayı kullanmaz |

## Güncel section sırası

| # | Section | Durum |
|---|---|---|
| 1 | Hero | Uygulanmış |
| 2 | Ürün Haritası / Neler Sunuyoruz | Uygulanmış |
| 3 | Çoklu Dil (eski ad: Dil Çeviri Modülü) | Uygulanmış |
| 4 | QR Masa | Uygulanmış |
| 5 | Akıllı Filtre | Uygulanmış |
| 6 | Chatbot / Menü Asistanı | Uygulanmış |
| 7 | Garson + Hesap + Servis Paneli | Uygulanmış |
| 8 | Analytics | Uygulanmış (Menü Mühendisliği uygulanmadı) |
| 9 | Geçiş Kararı | Uygulanmış |
| 10 | Kurulum | Uygulanmış |
| 11 | FAQ / İtirazlar | Uygulanmış (kilitli) |
| 12 | Son CTA | Uygulanmış (kilitli) — CTA hedefi TBD |

## Homepage akışı dışındaki kayıtlar

- **Yorum / Feedback:** **Planlı — mevcut akıştaki yeri henüz belirlenmedi.** Hiç kodlanmamıştır ve "çıkarıldı" olarak işaretlenmemiştir. Ürün modülü mevcuttur; ayrıntılar `HOMEPAGE_ARCHITECTURE.md` (Ek A).
- **Güvenlik:** Aktif homepage section'ı **değildir.** Section 9 olarak `1f87b17`'de eklenmiş, `3fc368e`'de yerine Geçiş Kararı konmuştur. Kaynak `sections/section-9-security.html` arşivdir; masa oturumu güvenliği itirazı artık FAQ'de (Section 11) cevaplanır; arşiv dosyası kaynak referansı olarak kalır. Ayrıntılar `HOMEPAGE_ARCHITECTURE.md` (Ek B).

## Bilinçli olarak açık kalan konular

- Section 9 ve Section 12 CTA'larının (ikisi de "Geçiş İçin Bilgi Alın") hedefi **TBD**; kodda `href` yoktur (`data-cta-target="TBD"`). Hedef bağlanmadan yayına alınmamalıdır.
- Section 8B (Menü Mühendisliği) uygulanmamıştır.
- Yorum/Feedback modülünde Google yorum yönlendirmesi (review gating, varsayılan açık, eşik 3.5) ve Google yorumu karşılığı indirim (varsayılan kapalı) bulunur; bu davranış CONTENT_STRATEGY.md madde 8/10 ile çelişir ve ayrı bir karar konusudur.
- Kurulum: ürün kodundan (qr-menu-suite `ed14cb3`) doğrulanan — WordPress eklentisi (WP 6.0+, PHP 7.4+), alan adına bağlı lisans anahtarıyla etkinleştirme, modüllerin lisansa göre açılması, Menü Asistanı için Gemini API anahtarı alanı, Servis Paneli için Firebase ayarları. Hâlâ **TBD**: kurulumu kimin yaptığı, süre, paket/lisans içerikleri, API anahtarını kimin sağladığı, toplu ürün içe aktarma, personelin panele erişim yolu.
- Section 3–8'deki "… İncele" bağlantıları (hepsi `href="#"` idi) kaldırılmıştır; repo içinde gerçek bir hedefleri yoktu. Bu bölümlerde bölüm içi CTA bulunmaz.
- Hero CTA'sı: metin "Paketleri İnceleyin", hedef `https://qrmenuofficial.com/paketler/` (repo geçmişinde Hero'nun orijinal production kodu bu adresi "paketler sayfası" olarak tanımlar; sayfanın içeriği bu ortamdan doğrulanamamıştır). Hero'daki "Teknik bilgi gerekmez" satırı kaldırılmış, yerine doğrulanmış "Müşteri menüyü uygulama indirmeden, tarayıcıdan açar" yazılmıştır.
- Section 3'teki doğrulanmamış "+150% Gelir potansiyeli" / "86% Tekrar ziyaret potansiyeli" istatistikleri kaldırılmış, yerine rakamsız ve doğrulanmış bir not konmuştur.

Ayrıntılar: `HOMEPAGE_ARCHITECTURE.md` madde 13.
