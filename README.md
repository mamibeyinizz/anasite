# QR Menu Official — Ana Site

QR Menu Official'ın ana satış sitesi için çalışma alanı.

## Branch ve kod durumu

- **Güncel çalışma branch'i:** `claude/qr-menu-section-9-strategy-eircho`. Homepage kodu (Section 1–10) bu branch'te `dcaeec9` commit'ine kadar uygulanmıştır (`dcaeec9` = Section 10). Sonraki commit'ler yalnızca doküman güncellemesidir.
- **`main`:** Eski, Hero-only durumdadır (`aabf2f0`). `main`'de yalnızca Section 1 (Hero) vardır; Section 2–10 `main`'e merge **edilmemiştir**. Merge planı **TBD**.
- Section 2–8'i getiren geçmiş, `claude/section-6-chatbot-audit-5aah0t` branch'inden gelir (`a622f08`); güncel branch bu geçmişin üzerine kurulmuştur.

## Yapı

- `index.html` — Ana sayfa. Section 1–10 bu dosyada entegredir.
- `HOMEPAGE_ARCHITECTURE.md` — Section mimarisi ve güncel section sırası (**kaynak doküman**)
- `HOMEPAGE_BLUEPRINT.md` — Section bazlı içerik ve görsel blueprint
- `PRODUCT_SCREEN_ASSETS.md` — Gerçek ürün ekranı asset kaynakları ve durumu
- `DESIGN_SYSTEM.md` — Tasarım sistemi dokümantasyonu
- `CONTENT_STRATEGY.md` — İçerik/copy stratejisi ve ürün gerçekliği sınırları
- `sections/` — Sayfa bölümlerinin ayrı kaynak dosyaları
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
| `section-9-security.html` | **Arşiv / yetim kaynak.** Güvenlik artık homepage section'ı değildir; `index.html` bu dosyayı kullanmaz |

## Güncel section sırası

| # | Section | Durum |
|---|---|---|
| 1 | Hero | Uygulanmış |
| 2 | Ürün Haritası / Neler Sunuyoruz | Uygulanmış |
| 3 | Dil Çeviri Modülü | Uygulanmış |
| 4 | QR Masa | Uygulanmış |
| 5 | Akıllı Filtre | Uygulanmış |
| 6 | Chatbot / Menü Asistanı | Uygulanmış |
| 7 | Garson + Hesap + Servis Paneli | Uygulanmış |
| 8 | Analytics | Uygulanmış (Menü Mühendisliği uygulanmadı) |
| 9 | Geçiş Kararı | Uygulanmış |
| 10 | Kurulum | Uygulanmış |
| 11 | FAQ / İtirazlar | **Planlı** — uygulanmadı |
| 12 | Son CTA | **Planlı** — uygulanmadı |

## Homepage akışı dışındaki kayıtlar

- **Yorum / Feedback:** **Planlı — mevcut akıştaki yeri henüz belirlenmedi.** Hiç kodlanmamıştır ve "çıkarıldı" olarak işaretlenmemiştir. Ürün modülü mevcuttur; ayrıntılar `HOMEPAGE_ARCHITECTURE.md` (Ek A).
- **Güvenlik:** Aktif homepage section'ı **değildir.** Section 9 olarak `1f87b17`'de eklenmiş, `3fc368e`'de yerine Geçiş Kararı konmuştur. Kaynak `sections/section-9-security.html` arşivdir; masa oturumu güvenliği içeriği FAQ (Section 11) için referans olarak kalır. Ayrıntılar `HOMEPAGE_ARCHITECTURE.md` (Ek B).

## Bilinçli olarak açık kalan konular

- Section 9 CTA'sının ("Geçiş İçin Bilgi Alın") hedefi **TBD**; kodda `href` yoktur.
- Kurulum ayrıntıları (kimin kurduğu, süre, WordPress ön koşulu, hesap/lisans/paket, Menü Asistanı API anahtarı, toplu ürün içe aktarma, personelin panele erişimi) **TBD**.
- Section 3–8 "… İncele" CTA'ları `href="#"` durumundadır (ayrı iş).
- Hero'daki "Teknik bilgi gerekmez" satırı `CONTENT_STRATEGY.md` madde 6.6 ile çelişir (ayrı copy audit maddesi).

Ayrıntılar: `HOMEPAGE_ARCHITECTURE.md` madde 13.
