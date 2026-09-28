# Product Screen Assets — QR Menu Official

Bu doküman, `HOMEPAGE_BLUEPRINT.md`'de **gerçek ürün ekranı zorunlu** olarak işaretlenen section'lar için asset hazırlama altyapısıdır.

Kaynak tespiti, `mamibeyinizz/qr-menu-suite` (public) reposunun bu oturumda salt-okunur olarak klonlanan kopyası üzerinden yapılmıştır (commit `e61da6d`). Bu dosya:
- Görsel üretmez, mockup çizmez, sahte dashboard içermez.
- `qr-menu-suite` koduna dokunmaz (yalnızca okunmuştur).
- `DESIGN_SYSTEM.md`, `CONTENT_STRATEGY.md`, `HOMEPAGE_ARCHITECTURE.md`, `HOMEPAGE_BLUEPRINT.md` dosyalarını değiştirmez.

**Section numaraları** güncel 12 section'lık homepage akışına göredir: Section 1–10 uygulanmıştır, Section 11 (FAQ) ve 12 (Son CTA) planlıdır (HOMEPAGE_ARCHITECTURE.md madde 0). Önceki sürümlerde kullanılan eşlemeler (Menü Yönetimi → 4, Chatbot → 5, Servis → 6, İstatistik+Menü Mühendisliği → 7, Güvenlik → 8 ya da 9, Yorum/Feedback → 9 ya da 10) artık geçerli değildir. **Güvenlik** aktif homepage section'ı değildir (`sections/section-9-security.html` arşiv kaynaktır); **Yorum/Feedback** planlıdır ve mevcut akıştaki yeri henüz belirlenmemiştir. **Section 9 (Geçiş Kararı) ve Section 10 (Kurulum)** bilinçli olarak ekransız, statik bölümlerdir ve gerçek ürün ekranı asset'i gerektirmez.

**Asset durumu tanımları:**
- **[SCREENSHOT_NEEDED]** — Ekranın gerçek kod kaynağı (route/component) tespit edildi, ancak bu bir sunucu tarafında render edilen canlı WordPress admin/frontend ekranıdır; statik kod incelemesinden görsel üretilemez. Ekran görüntüsü, çalışan bir kurulum üzerinden **elle alınmalıdır**.
- **[TBD]** — Ekranın var olup olmadığı veya homepage'de hangi alt görünümün kullanılacağı netleşmemiştir.

---

## Zorunlu Ekranlar

| Section | Gerekli ekran | Repo'daki gerçek kaynak | Route/Component | Asset durumu | Not |
|---|---|---|---|---|---|
| 3 — Dil Çeviri / 5 — Akıllı Filtre | Gerçek müşteri menüsü | `qr-menu-suite/modules/restoran-menu/includes/trait-frontend.php` (`shortcode_menu()`, ~satır 445) — **[Kesin]** | Frontend shortcode `[restaurant_menu]` | **[SCREENSHOT_NEEDED]** | Canlı bir sayfada shortcode render edilmeden görsel alınamaz; filtre/arama UI'ı da bu şablonun parçasıdır. |
| 3 — Dil Çeviri / 5 — Akıllı Filtre | Gerçek admin ürün/menü düzenleme ekranı | `qr-menu-suite/modules/restoran-menu/includes/class-urun-editor.php` (`RMA_Urun_Editor`), `assets/js/urun-editor.js`, `assets/js/admin-ui.js`, `includes/trait-post-types.php` (`rma_menu_item` CPT) — **[Kesin]** | WP admin: `rma_menu_item` post düzenleme ekranı (`wp-admin/post.php?post=…&action=edit`) | **[SCREENSHOT_NEEDED]** | WP admin oturumu gerektirir; ekran WordPress'in kendi kutularını (kategori, öne çıkan görsel) kullanır. |
| 6 — Chatbot / Menü Asistanı | Gerçek chatbot konuşma arayüzü | `qr-menu-suite/modules/qr-chatbot/includes/shortcode-chatbot.php` (`[gemini_chatbot]`), `assets/js/chatbot.js` — **[Kesin]** | Frontend shortcode `[gemini_chatbot]` | **[SCREENSHOT_NEEDED]** | **Oturum koşullu**: yalnızca geçerli bir masa oturumu varken render edilir (QR okutulmadan görüntülenemez); gerçek/simüle bir masa oturumu ile alınmalı. |
| 7 — Garson+Hesap+Servis Paneli | Gerçek müşteri çağrı ekranı | `qr-menu-suite/modules/qr-chatbot/includes/shortcode-buttons.php` (`[garson_butonu]`, `[hesap_iste_butonu]`, `[qr_garson_hesap]`), `assets/js/buttons.js`, `ajax-waiter-bill.php` — **[Kesin]** | Frontend shortcode `[qr_garson_hesap]` / `[ikili_buton]` | **[SCREENSHOT_NEEDED]** | Chatbot ile aynı şekilde masa oturumu koşulludur. |
| 7 — Garson+Hesap+Servis Paneli | Gerçek Servis Paneli ekranı | `qr-menu-suite/modules/qr-servis-paneli/includes/admin/panel-sayfasi.php` (`qrms_sp_panel_sayfasi()`), `assets/js/panel.js` — **[Kesin]** | WP admin: Servis Paneli (canlı kanban ekranı) | **[SCREENSHOT_NEEDED]** | PHP yalnızca iskeleti basar; kartlar `panel.js` tarafından canlı veriyle üretilir — statik koddan görüntü üretilemez, gerçek panelden alınmalı. |
| 8 — Analytics (8A; entegre — dashboard maketi "Örnek veri" etiketli kod içi demodur) | Gerçek İstatistikler ekranı | `qr-menu-suite/modules/qr-analiz/hub-sayfasi.php` + kategori alt sayfaları: `genel-sayfasi.php`, `urunler-sayfasi.php`, `masalar-sayfasi.php`, `sepet-sayfasi.php`, `etkilesim-sayfasi.php`, `sistem-sayfasi.php`, `acilis-sayfasi.php` — **[Kesin]** (dosyaların varlığı) | WP admin: "İstatistikler" hub + alt sayfalar | **[SCREENSHOT_NEEDED]** + **[TBD]** | Kaynak dosyaları kesin, ancak homepage'de **hangi alt sayfanın** (genel / ürünler / masalar / sepet / etkileşim) gösterileceği netleşmedi → alt sayfa seçimi **[TBD]**. |
| 8B — Menü Mühendisliği (**uygulanmadı**; Section 8'in parçası olarak planlı) | Gerçek Menü Mühendisliği ekranı | `qr-menu-suite/modules/qr-menu-muhendisligi/includes/admin/hub-sayfasi.php` (`qrms_mm_hub()`, "4 kart + 3 özet kutusu") + `rapor-sayfasi.php`, `maliyet-sayfasi.php`, `malzeme-sayfasi.php` — **[Kesin]** | WP admin: "Menü Mühendisliği" hub + alt sayfalar | **[SCREENSHOT_NEEDED]** + **[TBD]** | Kaynak dosyaları kesin, ancak hub mu yoksa rapor/maliyet alt sayfası mı gösterilecek **[TBD]**. Section 8'in bu parçası homepage'de henüz uygulanmamıştır; bu ekran sağlanmadan dashboard/mockup üretilmez. |

---

## Referans — Aktif Section Olmayan Kayıtlar (Zorunlu Değil, Klasör Altyapısı Hazır)

Aşağıdaki kayıtlar **aktif homepage section'ı değildir**: Güvenlik akıştan çıkarılmış/arşivlenmiştir, Yorum/Feedback planlıdır ve mevcut akıştaki yeri henüz belirlenmemiştir. `HOMEPAGE_BLUEPRINT.md`'de bu ekranlar **opsiyonel** (zorunlu değil) olarak işaretlenmişti; yine de istenen klasör yapısında (`security/`, `feedback/`) yer aldıkları için kaynakları burada referans olarak not edilmiştir. Güvenlik ekranları ürün kaynakları olarak korunur ve ileride FAQ (Section 11, planlı) için kaynak olabilir:

| Section | Gerekli ekran | Repo'daki gerçek kaynak | Route/Component | Asset durumu | Not |
|---|---|---|---|---|---|
| Güvenlik (arşiv — aktif section değil) | Müşteri tarafı "Oturum Gerekli" ekranı (masa oturumu kilit ekranı) | `qr-menu-suite/modules/qr-masa-oturum-guvenligi/masa-dogrulama.php` (`qmo_kilit_ekrani()`), `assets/css/kilit.css` — **[Kesin]** | Frontend: kayıtlı olmayan masa adresi, çok fazla deneme veya korunan sayfada süresi dolmuş oturum durumunda gösterilir (403) | **[SCREENSHOT_NEEDED]** | Ekran görüntüsü henüz alınmadı; repoda asset yok. Sayfa bazlı koruma varsayılan olarak kapalıdır; ekran genel bir erişim engeli olarak sunulmamalıdır. |
| Güvenlik (arşiv — aktif section değil) | Yönetim tarafı "Oturum Limitleri" ekranı | `qr-menu-suite/modules/qr-masa-oturum-guvenligi/oturum-ayarlari.php` — **[Kesin]** | WP admin: Oturum Limitleri (maksimum oturum süresi, hareketsizlik limiti, oturum başına chatbot mesajı) | **[SCREENSHOT_NEEDED]** | Ekran görüntüsü henüz alınmadı; repoda asset yok. `manage_options` yetkisi gerektirir. |
| Yorum/Feedback (planlı — akıştaki yeri belirlenmedi) | Feedback/yorum formu | `qr-menu-suite/modules/yorum-feedback/includes/frontend/form-render.php`, `shortcode-form.php`, `forms/review-form.php` — **[Kesin]** | Frontend shortcode (yorum/feedback formu) | **[SCREENSHOT_NEEDED]** | Blueprint'te zorunlu değildi; ihtiyaç halinde alınabilir. |

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

Her klasör, ilgili section'ın gerçek ekran görüntüleri sağlandığında doğrudan oraya konulacak şekilde hazırlanmıştır (`menu/` → Section 3 ve 5, `chatbot/` → Section 6, `service/` → Section 7, `analytics/` + `menu-engineering/` → Section 8; `security/` → arşivlenmiş Güvenlik kaydı, aktif section değil; `feedback/` → planlı Yorum/Feedback kaydı, akıştaki yeri belirlenmedi). Section 2 (Ürün Haritası), Section 9 (Geçiş Kararı) ve Section 10 (Kurulum) gerçek ürün ekranı gerektirmez (statik/ekransız bölümler); Section 4 (QR Masa) için asset satırı ve klasörü henüz tanımlı değildir. Klasörlerde şu an yalnızca `.gitkeep` bulunur; tek istisna `menu/` altındaki, herhangi bir section'a eşlenmemiş bir `.webp` dosyasıdır.

---

## Sonraki Adım

Kullanıcı tarafından ilgili WP admin/frontend ekranlarının gerçek screenshot'ları alınıp yukarıdaki klasörlere yerleştirildiğinde, bu dosya güncellenerek "Asset durumu" sütunları **[SCREENSHOT_NEEDED]**'den dosya adına çevrilecek ve `HOMEPAGE_BLUEPRINT.md`'deki ilgili section'lar bu gerçek görsellerle kodlanabilir hale gelecektir. `qr-menu-suite` alt sayfa seçimi gerektiren iki satır (**[TBD]**) için ayrıca hangi alt görünümün kullanılacağına dair bir karar gerekir.
