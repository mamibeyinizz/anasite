# Product Screen Assets — QR Menu Official

Bu doküman, `HOMEPAGE_BLUEPRINT.md`'de **gerçek ürün ekranı zorunlu** olarak işaretlenen section'lar için asset hazırlama altyapısıdır.

Kaynak tespiti, `mamibeyinizz/qr-menu-suite` (public) reposunun bu oturumda salt-okunur olarak klonlanan kopyası üzerinden yapılmıştır (commit `e61da6d`). Bu dosya:
- Görsel üretmez, mockup çizmez, sahte dashboard içermez.
- `qr-menu-suite` koduna dokunmaz (yalnızca okunmuştur).
- `DESIGN_SYSTEM.md`, `CONTENT_STRATEGY.md`, `HOMEPAGE_ARCHITECTURE.md`, `HOMEPAGE_BLUEPRINT.md` dosyalarını değiştirmez.

**Asset durumu tanımları:**
- **[SCREENSHOT_NEEDED]** — Ekranın gerçek kod kaynağı (route/component) tespit edildi, ancak bu bir sunucu tarafında render edilen canlı WordPress admin/frontend ekranıdır; statik kod incelemesinden görsel üretilemez. Ekran görüntüsü, çalışan bir kurulum üzerinden **elle alınmalıdır**.
- **[TBD]** — Ekranın var olup olmadığı veya homepage'de hangi alt görünümün kullanılacağı netleşmemiştir.

---

## Zorunlu Ekranlar

| Section | Gerekli ekran | Repo'daki gerçek kaynak | Route/Component | Asset durumu | Not |
|---|---|---|---|---|---|
| 4 — Menü Yönetimi | Gerçek müşteri menüsü | `qr-menu-suite/modules/restoran-menu/includes/trait-frontend.php` (`shortcode_menu()`, ~satır 445) — **[Kesin]** | Frontend shortcode `[restaurant_menu]` | **[SCREENSHOT_NEEDED]** | Canlı bir sayfada shortcode render edilmeden görsel alınamaz; filtre/arama UI'ı da bu şablonun parçasıdır. |
| 4 — Menü Yönetimi | Gerçek admin ürün/menü düzenleme ekranı | `qr-menu-suite/modules/restoran-menu/includes/class-urun-editor.php` (`RMA_Urun_Editor`), `assets/js/urun-editor.js`, `assets/js/admin-ui.js`, `includes/trait-post-types.php` (`rma_menu_item` CPT) — **[Kesin]** | WP admin: `rma_menu_item` post düzenleme ekranı (`wp-admin/post.php?post=…&action=edit`) | **[SCREENSHOT_NEEDED]** | WP admin oturumu gerektirir; ekran WordPress'in kendi kutularını (kategori, öne çıkan görsel) kullanır. |
| 5 — Chatbot | Gerçek chatbot konuşma arayüzü | `qr-menu-suite/modules/qr-chatbot/includes/shortcode-chatbot.php` (`[gemini_chatbot]`), `assets/js/chatbot.js` — **[Kesin]** | Frontend shortcode `[gemini_chatbot]` | **[SCREENSHOT_NEEDED]** | **Oturum koşullu**: yalnızca geçerli bir masa oturumu varken render edilir (QR okutulmadan görüntülenemez); gerçek/simüle bir masa oturumu ile alınmalı. |
| 6 — Garson+Hesap+Servis Paneli | Gerçek müşteri çağrı ekranı | `qr-menu-suite/modules/qr-chatbot/includes/shortcode-buttons.php` (`[garson_butonu]`, `[hesap_iste_butonu]`, `[qr_garson_hesap]`), `assets/js/buttons.js`, `ajax-waiter-bill.php` — **[Kesin]** | Frontend shortcode `[qr_garson_hesap]` / `[ikili_buton]` | **[SCREENSHOT_NEEDED]** | Chatbot ile aynı şekilde masa oturumu koşulludur. |
| 6 — Garson+Hesap+Servis Paneli | Gerçek Servis Paneli ekranı | `qr-menu-suite/modules/qr-servis-paneli/includes/admin/panel-sayfasi.php` (`qrms_sp_panel_sayfasi()`), `assets/js/panel.js` — **[Kesin]** | WP admin: Servis Paneli (canlı kanban ekranı) | **[SCREENSHOT_NEEDED]** | PHP yalnızca iskeleti basar; kartlar `panel.js` tarafından canlı veriyle üretilir — statik koddan görüntü üretilemez, gerçek panelden alınmalı. |
| 7 — İstatistik+Menü Mühendisliği | Gerçek İstatistikler ekranı | `qr-menu-suite/modules/qr-analiz/hub-sayfasi.php` + kategori alt sayfaları: `genel-sayfasi.php`, `urunler-sayfasi.php`, `masalar-sayfasi.php`, `sepet-sayfasi.php`, `etkilesim-sayfasi.php`, `sistem-sayfasi.php`, `acilis-sayfasi.php` — **[Kesin]** (dosyaların varlığı) | WP admin: "İstatistikler" hub + alt sayfalar | **[SCREENSHOT_NEEDED]** + **[TBD]** | Kaynak dosyaları kesin, ancak homepage'de **hangi alt sayfanın** (genel / ürünler / masalar / sepet / etkileşim) gösterileceği netleşmedi → alt sayfa seçimi **[TBD]**. |
| 7 — İstatistik+Menü Mühendisliği | Gerçek Menü Mühendisliği ekranı | `qr-menu-suite/modules/qr-menu-muhendisligi/includes/admin/hub-sayfasi.php` (`qrms_mm_hub()`, "4 kart + 3 özet kutusu") + `rapor-sayfasi.php`, `maliyet-sayfasi.php`, `malzeme-sayfasi.php` — **[Kesin]** | WP admin: "Menü Mühendisliği" hub + alt sayfalar | **[SCREENSHOT_NEEDED]** + **[TBD]** | Kaynak dosyaları kesin, ancak hub mu yoksa rapor/maliyet alt sayfası mı gösterilecek **[TBD]**. |

---

## Referans (Zorunlu Değil, Klasör Altyapısı Hazır)

`HOMEPAGE_BLUEPRINT.md`'de bu iki ekran **opsiyonel** (zorunlu değil) olarak işaretlenmişti; yine de istenen klasör yapısında (`security/`, `feedback/`) yer aldıkları için kaynakları burada referans olarak not edilmiştir:

| Section | Gerekli ekran | Repo'daki gerçek kaynak | Route/Component | Asset durumu | Not |
|---|---|---|---|---|---|
| 8 — Güvenlik | Masa oturumu güvenlik davranışı | `qr-menu-suite/modules/qr-masa-oturum-guvenligi/masa-dogrulama.php`, `oturum-ayarlari.php`, `firebase-ayarlari-sayfasi.php` — **[Kesin]** (mekanizma kodu) | Arka plan doğrulama mantığı + WP admin ayar sayfası | **[TBD]** | Bu mekanizmanın kullanıcıya görünen ayrı bir "ekranı" yok (arka planda çalışır); homepage için gösterilebilir bir görsel olup olmadığı netleşmedi. |
| 9 — Yorum/Feedback | Feedback/yorum formu | `qr-menu-suite/modules/yorum-feedback/includes/frontend/form-render.php`, `shortcode-form.php`, `forms/review-form.php` — **[Kesin]** | Frontend shortcode (yorum/feedback formu) | **[SCREENSHOT_NEEDED]** | Blueprint'te zorunlu değildi; ihtiyaç halinde alınabilir. |

---

## Klasör Yapısı

`assets/product/` altında yalnızca gelecekte kullanılacak klasör iskeleti oluşturuldu (hiçbir görsel eklenmedi):

```
assets/
  product/
    menu/
    chatbot/
    service/
    analytics/
    menu-engineering/
    security/
    feedback/
```

Her klasör, ilgili section'ın gerçek ekran görüntüleri sağlandığında doğrudan oraya konulacak şekilde hazırlanmıştır (`menu/` → Section 4, `chatbot/` → Section 5, `service/` → Section 6, `analytics/` + `menu-engineering/` → Section 7, `security/` → Section 8, `feedback/` → Section 9). Şu an her klasörde yalnızca bir `.gitkeep` bulunur.

---

## Sonraki Adım

Kullanıcı tarafından ilgili WP admin/frontend ekranlarının gerçek screenshot'ları alınıp yukarıdaki klasörlere yerleştirildiğinde, bu dosya güncellenerek "Asset durumu" sütunları **[SCREENSHOT_NEEDED]**'den dosya adına çevrilecek ve `HOMEPAGE_BLUEPRINT.md`'deki ilgili section'lar bu gerçek görsellerle kodlanabilir hale gelecektir. `qr-menu-suite` alt sayfa seçimi gerektiren iki satır (**[TBD]**) için ayrıca hangi alt görünümün kullanılacağına dair bir karar gerekir.
