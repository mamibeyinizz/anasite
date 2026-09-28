# Homepage Architecture — QR Menu Official

Bu doküman, ana sayfanın **section mimarisi** referansıdır. `DESIGN_SYSTEM.md` (görsel kurallar) ve `CONTENT_STRATEGY.md` (içerik/copy kuralları) temel alınarak hazırlanmıştır ve bu iki dosyaya aykırı hiçbir karar içermez.

Bu dosya:
- Nihai section metni **değildir**.
- HTML/CSS/JS üretimi için **kaynak dokümandır**: her section kodlanırken önce bu dosyadaki tanım, sonra CONTENT_STRATEGY.md'deki ilgili madde, sonra DESIGN_SYSTEM.md'deki ilgili görsel kural kontrol edilir.
- Etiket sistemi CONTENT_STRATEGY.md ile aynıdır: **[Kesin]** (ürün/kod ile doğrulanmış), **[Muhtemel]** (güçlü strateji çıkarımı, doğrulanmamış), **[Tahmin]** (yer tutucu, netleşmemiş).

---

## 0. Güncel Section Sırası (Özet)

Bu sıra, `index.html`'deki **gerçek homepage akışı** kaynak kabul edilerek yazılmıştır. Section 1–10 kodlanmış ve entegre edilmiştir (kod durumu: `dcaeec9`); Section 11 (FAQ) ve Section 12 (Son CTA) **planlıdır, uygulanmamıştır**. Toplam: **12 section** (10 uygulanmış + 2 planlı).

| # | Section | Uygulama durumu | Kök sınıf / kaynak |
|---|---|---|---|
| 1 | Hero | Entegre | `qrmo-hero-v3-wrap` |
| 2 | Ürün Haritası / Neler Sunuyoruz | Entegre | `qrmo-features-v3-wrap` |
| 3 | Dil Çeviri Modülü | Entegre | `qrmo-translation-v3-wrap` |
| 4 | QR Masa | Entegre | `qrmo-tables-v5` |
| 5 | Akıllı Filtre | Entegre | `qrmo-smart-filter-showcase` |
| 6 | Chatbot / Menü Asistanı | Entegre | `qrmo-chatbot-feature` — `sections/section-6-chatbot.html` |
| 7 | Garson + Hesap + Servis Paneli | Entegre | `qrmo-service-v2` — `sections/section-7-service.html` |
| 8 | Analytics | Entegre (yalnızca 8A Analytics); Menü Mühendisliği (8B) **uygulanmadı** | `qrmo-analytics-v3` — `sections/section-8-analytics.html` |
| 9 | Geçiş Kararı | Entegre | `qrmo-transition-v1` — `sections/section-9-transition.html` |
| 10 | Kurulum | Entegre | `qrmo-setup-v1` — `sections/section-10-installation.html` |
| 11 | FAQ / İtirazlar | **Planlı** — uygulanmadı | — |
| 12 | Son CTA | **Planlı** — uygulanmadı | — |

**Numarasız kayıtlar (akışta sırası yok):**
- **Yorum / Feedback** — **Planlı — mevcut akıştaki yeri henüz belirlenmedi.** Hiç kodlanmamıştır; "çıkarıldı" ya da "ertelendi" yönünde açık bir karar yoktur. Yukarıdaki sıraya zorlanmamıştır (bkz. Ek A).
- **Güvenlik** — **Homepage section'ı değildir (akıştan çıkarılmış / arşivlenmiş).** `sections/section-9-security.html` yetim/arşiv kaynaktır; `index.html` bu dosyayı kullanmaz ve `qrmo-security-v1` sınıfı sayfada yoktur (bkz. Ek B).

**Entegrasyon konumu — [Kesin]**: Section 1–10'un entegre hâli `claude/qr-menu-section-9-strategy-eircho` branch'indeki `index.html`'dedir (kod: `dcaeec9`). `main` branch'i eski Hero-only durumdadır (`aabf2f0`); Section 2–10 henüz `main`'e merge edilmemiştir.

### 0.1 Önceki mimarilerden farklar

Bu dosyanın ilk sürümü 12 section tanımlıyordu (1 Hero, 2 Problem, 3 Çözüm, 4 Menü Yönetimi & Akıllı Menü, 5 Chatbot, 6 Garson+Hesap+Servis, 7 İstatistikler + Menü Mühendisliği, 8 Güvenlik, 9 Yorum/Feedback, 10 Kurulum, 11 FAQ, 12 Son CTA). Ara bir sürüm 13 section tanımlıyordu (Hero, Ürün Haritası, Dil Çeviri, QR Masa, Akıllı Filtre, Chatbot, Servis, Analytics + Menü Mühendisliği, Güvenlik, Yorum/Feedback, Kurulum, FAQ, Son CTA). Uygulanan akış bu sıralardan şu noktalarda ayrılmıştır:

1. **Problem ve Çözüm section'ları mevcut homepage akışında yer almaz.** Kalıcı olarak çıkarıldıklarına dair repoda belgelenmiş bir karar **yoktur**; yalnızca mevcut akışa eklenmemişlerdir (bkz. madde 13).
2. **Çeviri, Menü Yönetimi'nin alt-vurgusu olarak değil, ayrı bir section (3) olarak uygulanmıştır.**
3. **QR Masa (4) ve Akıllı Filtre (5) ayrı section'lar olarak uygulanmıştır.**
4. **Ürün Haritası (2)**, önceki sürümlerde tanımlı olmayan, ürün alanlarını gruplayan bir genel bakış section'ı olarak uygulanmıştır.
5. **Chatbot'un Servis'ten önce gelmesi korunmuştur** (CONTENT_STRATEGY.md madde 3'teki akış SOR → ÇAĞIR → SERVİS'tir — **[Kesin]**).
6. **Analytics, Section 8 olarak uygulanmıştır** (`1eee24a`). Yalnızca 8A (Analytics) kodlanmıştır; Menü Mühendisliği (8B) uygulanmamıştır.
7. **Güvenlik akıştan çıkarılmıştır.** Section 9 olarak eklenmiş (`1f87b17`), sonra yerine Geçiş Kararı konmuştur (`3fc368e`). Proje sahibinin kararıyla satış açısından gerekli görülmemiştir; commit mesajında gerekçe yazılı değildir. Kaynak dosya arşivde tutulur (bkz. Ek B).
8. **Section 9 artık Geçiş Kararı'dır** ("Değiştirmeye değer mi?"). Section 10 artık Kurulum'dur ("Nasıl başlarım?") ve önceki "hafif geçiş bloğu" kararının yerine 4 adımlı, statik bir adım rayı olarak uygulanmıştır; süre, kolaylık ve "kim kurar" bilgisi bilinçli olarak dışarıda bırakılmıştır.
9. **Yorum / Feedback** hiç kodlanmamıştır; akıştaki yeri belirlenmemiş, planlı bir kayıt olarak korunur (bkz. Ek A).
10. **FAQ ve Son CTA**, önceki sıralamalardaki 11–13 numaralarından **Section 11 ve Section 12** olarak yeniden numaralanmıştır; ikisi de planlıdır.

### 0.2 Mimari geçmişi (commit kayıtları)

Aşağıdaki kayıtlar tarihsel bilgi olarak korunur; güncel sırayı belirlemez.

- `7f37710`, `f6bfeeb` — "Section 2 (Restoranın Günlük Sorunu)" (`.qrmo-problem`) kodlandı. Yalnızca `claude/qr-menu-site-structure-0oxcst` branch'inde bulunur; mevcut homepage akışının geçmişinde yoktur.
- `8f29cd2` — "Section 3 (Çözüm / Akış Özeti)" (`.qrmo-flow`) kodlandı. Aynı branch'te bulunur; mevcut akışın geçmişinde yoktur.
- `63b1d97` — Mevcut akışta Section 2 olarak Ürün Haritası (features v3) eklendi (doğrudan `main` / `aabf2f0` üzerinden).
- `11a5034` — Mevcut akışta Section 3 olarak "Nasıl İşler" (flow v1) akışı eklendi; problem cümlesini de içeriyordu.
- `b660495` — flow v1 Section 3 slotundan kaldırıldı, yerine Dil Çeviri Modülü (translation v3) entegre edildi. Commit mesajı: "Önceki flow-v1 stepper Section 3 slotundan kaldırıldı (11a5034'te duruyor)". Kaldırmanın gerekçesi commit'te belirtilmemiştir.
- `9c0d904` (QR Masa, Section 4), `c91e5c3` (Akıllı Filtre, Section 5), `1e68839` / `2649d90` (Chatbot, Section 6), `3067f37` / `5320e2b` (Servis, Section 7).
- `4b0ff94` — Doküman senkronu (13 section'lık ara sıra).
- `1eee24a` — Section 8: Analytics (8A) entegre edildi.
- `1f87b17` — "Section 9: add security section": Güvenlik section'ı (`qrmo-security-v1`) ve `sections/section-9-security.html` eklendi.
- `a622f08` — S2/S4/S5 copy'si qr-menu-suite ile hizalandı, S3 dipnotu netleştirildi.
- `3fc368e` — Section 9: Geçiş Kararı (`qrmo-transition-v1`, `sections/section-9-transition.html`). Güvenlik section'ı `index.html`'de aynı konumda yerine değiştirildi; `sections/section-9-security.html` silinmedi. Commit mesajında çıkarma gerekçesi yoktur.
- `dcaeec9` — Section 10: Kurulum (`qrmo-setup-v1`, `sections/section-10-installation.html`).

---

## 1. HERO

1. **Section adı**: Hero
2. **Section amacı**: Ziyaretçiye ürünün ne olduğunu ("sadece QR menü değil, operasyon/etkileşim katmanı" — CONTENT_STRATEGY.md madde 3) 3 saniyede net anlatmak; sayfanın geri kalanını okumaya devam etme isteği uyandırmak.
3. **Hangi problemi ele alıyor**: Doğrudan bir problem anlatmaz; problemin *zıttı* olan sonucu (düzenli/kontrollü bir işletme deneyimi) ima eder.
4. **Kullanılacak gerçek ürün özelliği**: QR ile menüye erişim + genel akış (madde 3, adım 1–2: QR, MENÜ) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: Konumlandırma "yalnızca QR menü" değil, restoranın uçtan uca müşteri etkileşim/operasyon katmanı olarak kurulur (CONTENT_STRATEGY.md madde 3). Rakamsız, iddiasız, net bir konumlandırma cümlesi + kısa alt başlık.
6. **Görsel/UI gösterimi**: Evet — Hero V3 production görseliyle uyumlu, tek ana görsel/mockup odağı (DESIGN_SYSTEM.md madde 11: max-width 480px, radius 20px, gold outline). Feature-icon satırı (DESIGN_SYSTEM.md madde 10) kısa/öz tutulur, kalabalıklaştırılmaz. **[Kesin]** (Hero V3 bu yapıda mevcut).
7. **CTA gerekiyor mu**: Evet, tek birincil CTA. Hedefi CONTENT_STRATEGY.md madde 9 gereği **TBD** olduğundan yalnızca "demo iste / canlı örneği incele" türü güvenli bir eylem çerçevesi kullanılabilir; kesin bir self-servis akış varsayılmaz.
8. **Sonraki section'a bağlanışı**: Hero "bu ürün ne yapıyor" sorusuna genel cevap verir; Section 2 (Ürün Haritası) bu cevabı ürün alanlarına ayırır.
9. **Etiket**: **[Kesin]** (Hero entegre ve madde 3'teki akışla uyumlu).

---

## 2. ÜRÜN HARİTASI / NELER SUNUYORUZ

1. **Section adı**: Ürün Haritası / Neler Sunuyoruz
2. **Section amacı**: Ürünün kapsadığı alanları tek bakışta, gruplanmış biçimde göstermek; sonraki modül section'larına çerçeve kurmak.
3. **Hangi problemi ele alıyor**: Doğrudan tek bir problem değil; "bu sistem neleri kapsıyor" sorusunu cevaplar.
4. **Kullanılacak gerçek ürün özelliği**: Uygulanan içerik 4 alan altında 8 özellik gruplar (Menü Yönetimi, Akıllı Deneyim, Sipariş & Servis, Müşteri Deneyimi) — **[Kesin]** (entegre kod). Her özellik iddiası CONTENT_STRATEGY.md madde 1 sınırlarına bağlıdır.
5. **Ana mesaj / copy açısı**: Özellikleri bağlamsız bir liste gibi değil, günlük kullanım alanlarına göre gruplanmış bir harita olarak sunmak (CONTENT_STRATEGY.md madde 11 "Yasak yaklaşım").
6. **Görsel/UI gösterimi**: Editorial 2x2 kategori haritası; kart/gölge kullanılmaz (commit `63b1d97`) — **[Kesin]**.
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Haritadaki alanlar sonraki modül section'larında (3–8) tek tek açılır.
9. **Etiket**: **[Kesin]** (uygulama) / **[Muhtemel]** (haritanın Section 8'deki Analytics + Menü Mühendisliği alanını henüz içermemesi, bkz. madde 13).

---

## 3. DİL ÇEVİRİ MODÜLÜ

1. **Section adı**: Dil Çeviri Modülü
2. **Section amacı**: Menünün farklı dillerde sunulabildiğini ve müşterinin dili nasıl seçtiğini göstermek.
3. **Hangi problemi ele alıyor**: "Çok dilli müşteriye hizmet vermek manuel çeviri yükü doğurur" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Çoklu dil — CSV/veritabanı/manuel çeviri girişi (madde 1.1, madde 6.3) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: Çeviri kesinlikle "otomatik/AI/kusursuz çeviri" olarak sunulmaz (CONTENT_STRATEGY.md madde 1.1, madde 7 yasak listesi); dil ekleme/tanımlama işletmenin eylemi olarak anlatılır.
6. **Görsel/UI gösterimi**: Uygulamada kod içi animasyonlu dil seçimi demosu kullanılır — **[Kesin]**. Gerçek menü ekran görüntüsü asset'i henüz yoktur (PRODUCT_SCREEN_ASSETS.md).
7. **CTA gerekiyor mu**: Section'ın birincil CTA'sı değildir; yalnızca düşük vurgulu keşif eylemi.
8. **Sonraki section'a bağlanışı**: Menünün müşteriye ulaştığı fiziksel nokta olan masaya (Section 4 — QR Masa) geçilir.
9. **Etiket**: **[Kesin]** (özellik ve uygulama).

---

## 4. QR MASA

1. **Section adı**: QR Masa
2. **Section amacı**: İşletmenin masaları ve masa QR kodlarını nasıl oluşturduğunu göstermek.
3. **Hangi problemi ele alıyor**: Masa bazlı QR hazırlığının işletme için operasyonel bir yük olması.
4. **Kullanılacak gerçek ürün özelliği**: Tekli veya toplu masa oluşturma ve masa başına QR kodu — uygulanan copy'de yer alır; ürün modülü `qr-menu-suite/modules/qr-masa` — **[Kesin]** (modülün varlığı) / **[Muhtemel]** (copy'deki her ayrıntının modül davranışıyla birebir doğrulanması bu dosyada yapılmamıştır).
5. **Ana mesaj / copy açısı**: Masa ve QR hazırlığının işletme tarafından yönetilen bir adım olduğu; güvenlik iddiası bu section'da kurulmaz; masa oturumu güvenliği konusu FAQ'de (Section 11) ele alınır.
6. **Görsel/UI gösterimi**: Uygulamada kod içi animasyonlu demo — **[Kesin]**. Gerçek ekran asset'i tanımlı değildir.
7. **CTA gerekiyor mu**: Birincil CTA değildir.
8. **Sonraki section'a bağlanışı**: Müşteri QR'ı okutup menüye geldiğinde aradığını bulma ihtiyacı — Section 5 (Akıllı Filtre).
9. **Etiket**: **[Kesin]** (uygulama) / **[Muhtemel]** (ürün davranışıyla ayrıntılı eşleşme).

---

## 5. AKILLI FİLTRE

1. **Section adı**: Akıllı Filtre
2. **Section amacı**: Müşterinin menüyü kendi tercihine göre nasıl daralttığını göstermek.
3. **Hangi problemi ele alıyor**: "Diyet/alerjen kısıtlaması olan müşteriye doğru ürünü göstermek zordur" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Filtreler ilgili ürün bilgisinin girilmesine bağlı çalışır (madde 1.5) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: Filtreler "otomatik algılama" değil, işletmenin girdiği bilgiye dayalı olarak anlatılır (madde 1.5). Uygulanan copy bu çerçeveyi açıkça belirtir.
6. **Görsel/UI gösterimi**: Uygulamada kod içi animasyonlu filtre demosu — **[Kesin]**. Gerçek müşteri menüsü ekran görüntüsü **[SCREENSHOT_NEEDED]**.
7. **CTA gerekiyor mu**: Birincil CTA değildir.
8. **Sonraki section'a bağlanışı**: Müşteri menüde gezinirken soru sorma ihtiyacı doğar — Section 6 (Chatbot/SOR).
9. **Etiket**: **[Kesin]**.

---

## 6. CHATBOT / MENÜ ASİSTANI

1. **Section adı**: Chatbot / Menü Asistanı
2. **Section amacı**: Müşterinin menü/ürün hakkındaki sorularının nasıl karşılandığını, personelin bu süreçte nasıl devreye girdiğini göstermek.
3. **Hangi problemi ele alıyor**: "Müşteri soruları personeli sürekli meşgul eder" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Chatbot yaygın soruları yanıtlar, cevaplayamadığını raporlar (madde 1.6); personel gerektiğinde görüşmeyi devralabilir (madde 1.7) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: "Her soruyu bot bilir" değil, "bot bilmediğini söyler, personel gerektiğinde devralır" — dürüst hibrit model çerçevesi (CONTENT_STRATEGY.md madde 6.1). "%100 doğru cevap" veya "personelsiz çalışır" gibi ifadeler kullanılmaz.
6. **Görsel/UI gösterimi**: Uygulamada kod içi animasyonlu sohbet demosu — **[Kesin]**. Gerçek chatbot ekran görüntüsü **[SCREENSHOT_NEEDED]**.
7. **CTA gerekiyor mu**: Birincil CTA değildir.
8. **Sonraki section'a bağlanışı**: Müşterinin doğrudan istediği bir aksiyon (sipariş, garson çağırma, hesap isteme) — Section 7; akışta SOR'dan sonra ÇAĞIR gelir (madde 3).
9. **Etiket**: **[Kesin]**.

---

## 7. GARSON + HESAP + SERVİS PANELİ

1. **Section adı**: Garson & Hesap Çağrısı / Servis Paneli
2. **Section amacı**: Müşterinin talep anını ve işletmenin bu talebi nasıl karşıladığını (Servis Paneli) birlikte göstermek.
3. **Hangi problemi ele alıyor**: "Garson/hesap çağrıları gözden kaçar veya geç fark edilir" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Garson/hesap çağrıları Servis Paneli'ne düşer (madde 1.8); Servis Paneli sesli uyarı + masaüstü bildirim sağlar (madde 1.9) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: "Talepler tek bir ekranda toplanır" (CONTENT_STRATEGY.md madde 6.1). "Anında servis garantisi" gibi bir vaat kurulmaz — yanıt hızı işletmenin kendi operasyonuna bağlıdır (madde 1.8).
6. **Görsel/UI gösterimi**: Uygulamada kod içi animasyonlu servis akışı demosu — **[Kesin]**. Gerçek Servis Paneli ekran görüntüsü **[SCREENSHOT_NEEDED]**.
7. **CTA gerekiyor mu**: Birincil CTA değildir.
8. **Sonraki section'a bağlanışı**: Bu etkileşimlerin ürettiği kullanım verisi, Section 8'deki (Analytics) veri temasına bağlanır.
9. **Etiket**: **[Kesin]**.

---

## 8. ANALYTICS (+ Menü Mühendisliği — uygulanmadı)

Bu section **iki parçalı** tanımlanmıştır ve tek section olarak kalır; Menü Mühendisliği için ayrı bir section açılmaz.

- **8A — Analytics (İstatistikler)**: **Uygulanmış ve entegre.** `qrmo-analytics-v3`, `sections/section-8-analytics.html` (`1eee24a`). Dashboard maketi kod içi dekoratif bir demodur ve **"Örnek veri"** etiketi taşır; gerçek ekran görüntüsü ya da gerçek işletme verisi değildir.
- **8B — Menü Mühendisliği**: **Henüz uygulanmamıştır.** Gerçek ürün ekranı/kanıtı olmadan dashboard veya mockup üretilmez.

1. **Section adı**: Analytics (Menü Mühendisliği uygulanana kadar yalnızca 8A)
2. **Section amacı**: İşletmenin, ürünü kullandıkça elde ettiği veriyle (kullanım istatistikleri + ileride kendi maliyet verisiyle menü mühendisliği) nasıl daha bilinçli kararlar alabileceğini göstermek.
3. **Hangi problemi ele alıyor**: "İşletme, ürün kârlılığını net göremez" (CONTENT_STRATEGY.md madde 2) ve menüde neyin ilgi gördüğünün bilinmemesi.
4. **Kullanılacak gerçek ürün özelliği**:
   - **8A — Analytics**: `qr-menu-suite/modules/qr-analiz` — **[Kesin]**: menü görüntüleme, ürün tıklama, tekil ziyaretçi (IP bazlı), aktif masa sayısı (seçili aralıkta hareket görmüş masa), önceki döneme göre değişim, en çok / en az tıklanan ürünler, kategori dağılımı, masa bazlı kırılım; dönem filtresi Bugün / Son 7 gün / Bu ay / Özel (en fazla 31 gün). Sepet & Sipariş verisi chatbot modülüne bağlıdır. Panel sayfa açılışında yüklenir; canlı/otomatik yenilenen bir ekran değildir.
   - **8B — Menü Mühendisliği**: işletmenin girdiği maliyet verisine dayanır (madde 1.4) — **[Kesin]** (özelliğin varlığı ve veri girişi şartı); ürün modülü `qr-menu-suite/modules/qr-menu-muhendisligi`. Homepage'de uygulanmamıştır.
5. **Ana mesaj / copy açısı**: "Kendi verinizle görün" çerçevesi — "otomatik kârlılık analizi" veya veri girişi gerektirmeyen bir sihir olarak sunulmaz (madde 1.4). Gelir/satış artış yüzdesi **kesinlikle** kullanılmaz (madde 1.11, madde 7). Ürünün üretmediği metrik, içgörü veya "canlı" davranış iddia edilmez.
6. **Görsel/UI gösterimi**: Uygulamada dekoratif, "Örnek veri" etiketli kod içi dashboard demosu. Gerçek istatistik ekranı görseli ve 8B için gerçek menü mühendisliği ekranı hedeflenir; 8B için gerçek ürün kanıtı olmadan görsel üretilmez.
7. **CTA gerekiyor mu**: Birincil CTA değildir. Bölüm içindeki "Analitik Modülünü İncele" bağlantısı `href="#"` durumundadır (bkz. madde 13).
8. **Sonraki section'a bağlanışı**: Veri teması, Section 9'daki (Geçiş Kararı) "kendi işletmemde ne değişir" sorusuna bağlanır.
9. **Etiket**: **[Kesin]** (8A uygulanmış; metrik seti `qr-analiz` kodundan doğrulandı) / **[Kesin]** (8B uygulanmadı) / **TBD** (8B'nin section içindeki sunum biçimi).

---

## 9. GEÇİŞ KARARI

**Uygulama**: `qrmo-transition-v1` — `sections/section-9-transition.html` (`3fc368e`). Bu section eski Güvenlik section'ının yerini almıştır (bkz. Ek B).

1. **Section adı**: Geçiş Kararı
2. **Section amacı**: "Değiştirmeye değer mi?" sorusunu cevaplamak: S1–S8'de ürünü gören işletme sahibine, mevcut yönteminden geçtiğinde işletmesinde neyin değiştiğini, neyin aynı kaldığını ve geçişin ne gerektirdiğini göstermek.
3. **Hangi problemi ele alıyor**: Özellikleri gören ziyaretçinin "kendi işletmemde ne değişir, personelim ne yapacak, düzenim bozulur mu" belirsizliği.
4. **Kullanılacak gerçek ürün özelliği**: Yeni özellik anlatılmaz; S1–S8'in doğrulanmış davranışları operasyonel anlar olarak yeniden çerçevelenir — **[Kesin]** (CONTENT_STRATEGY.md madde 1.1, 1.2, 1.5–1.9):
   - 5 operasyonel an (sırayla): garson / hesap talebi, fiyat değiştiğinde, ürün tükendiğinde, ürün / alerjen sorusu, yabancı müşteri geldiğinde. (Menü hareketleri/analitik satırı bilinçli olarak yoktur; S8 zaten anlatıyor. Sipariş kelimesi garson/hesap satırında geçmez.)
   - "Neler aynı kalır?" — 4 madde: servisi ekip yapar; menü işletmenin kontrolünde; ödeme bugünkü yöntemle alınır; asistan bilmediğini personele bırakır.
   - "Geçiş için gerekenler" — 3 madde: menünün sisteme aktarılması; QR kodların masalara yerleştirilmesi; ekibin talepleri servis panelinden takip etmesi. (Kimin yaptığı bilinçli olarak belirtilmez — **TBD**.)
5. **Ana mesaj / copy açısı**: H2 "Düzeniniz aynı kalır. İş akışınız değişir." Karşılaştırma birimi özellik değil operasyonel andır (ne oluyor / yük kimde / ne değişiyor). Sosyal kanıt, rakip kıyası, ROI, yüzde/süre, aciliyet dili yoktur.
6. **Görsel/UI gösterimi**: Dönüşüm akışı (Bugün → QR Menu Official ile). Kart, gölge, ikon grid, mockup ve dashboard yoktur. Bir kez çalışan scroll reveal (IntersectionObserver); JS kapalıyken ve `prefers-reduced-motion` altında içerik doğrudan görünür.
7. **CTA gerekiyor mu**: Evet — tek birincil CTA: **"Geçiş İçin Bilgi Alın"**. **Hedef TBD**: kodda `href` yoktur (`data-cta-target="TBD"`); gerçek bir iletişim kanalı doğrulanmadan bağlanmaz ve yayına alınmadan önce bağlanmalıdır. Hedef URL/WhatsApp/form uydurulmaz.
8. **Sonraki section'a bağlanışı**: "Geçiş için gerekenler" → Section 10'da (Kurulum) bunların **nasıl** yapıldığı gösterilir.
9. **Etiket**: **[Kesin]** (uygulama ve ürün davranışları) / **TBD** (CTA hedefi ve CTA alt açıklaması).

---

## 10. KURULUM

**Uygulama**: `qrmo-setup-v1` — `sections/section-10-installation.html` (`dcaeec9`). Statik HTML + CSS; JS ve animasyon yoktur.

1. **Section adı**: Kurulum
2. **Section amacı**: "Nasıl başlarım?" sorusunu cevaplamak: başlangıcın sınırlı sayıda adımdan oluştuğunu, her adımda ne yapıldığını ve sonunda ne elde edildiğini göstermek. Section 9'un "geçiş için gerekenler" maddelerini tekrar etmez; **nasıl** gerçekleştiklerini anlatır.
3. **Hangi problemi ele alıyor**: "Başlamak nereden, ne kadar iş" belirsizliği (kurulum korkusu). Süre ya da kolaylık vaadi vermeden.
4. **Kullanılacak gerçek ürün özelliği**: 4 adım, her biri İşlem → Çıktı:
   - **01 Menü** — ürünler ürün düzenleme ekranında eklenir; çıktı: QR ile açılan menü, fiyat/açıklama/"tükendi" tek yerden güncellenir — **[Kesin]**.
   - **02 Ürün bilgileri ve diller** — besin değeri, acılık, alerjen girilir; diller CSV ile ya da elle eklenir; çıktı: filtreler girilen bilgilerle çalışır, menü eklenen dillerde görüntülenir — **[Kesin]** (madde 1.1, 1.5). "İsteğe bağlı" ifadesi bilinçli olarak kullanılmaz.
   - **03 Masalar ve QR** — masalar tek tek ya da numaralı toplu oluşturulur, masa başına ayrı QR hedefi; çıktı: QR'lar tek tek PNG ya da tüm masalar tek PDF olarak alınır — **[Muhtemel]** (S4 metninden; ürün kodunda birebir doğrulanmadı, genişletilmez).
   - **04 Servis ekranı ve deneme** — Servis Paneli personelin kullanacağı cihazda açık tutulur; bir masanın QR'ı okutularak garson çağrısı ile akış sınanabilir; çıktı: talep masa bilgisiyle panelde görünür, sesli uyarı ve masaüstü bildirimiyle duyurulur — **[Kesin]** (madde 1.8, 1.9).
5. **Ana mesaj / copy açısı**: H2 "Menüden ilk talebe: başlangıç sırası." Alt açıklama: "Kurulum, yönetim panelinde yapılan birkaç işlemden oluşur. Her adımda neyin girildiğini ve sonunda elinizde ne olduğunu aşağıda görebilirsiniz." Süre, "kolay", "zahmetsiz", "otomatik kurulum", "biz kuruyoruz", "teknik bilgi gerekmez" ifadeleri yoktur. Metinler öznesizdir (kimin yaptığı **TBD**).
6. **Görsel/UI gösterimi**: Yatay adım rayı (≥1101px 4 kolon, ≤1100px 2×2, ≤767px tek kolon; mobilde dikey bağlayıcı çizgi). Kart, gölge, mockup, dashboard, sahte ekran yoktur.
7. **CTA gerekiyor mu**: Hayır — birincil CTA Section 9'da ve (planlı) Section 12'dedir.
8. **Sonraki section'a bağlanışı**: Kalan tereddütler Section 11'de (FAQ, planlı) ele alınır.
9. **Etiket**: **[Kesin]** (uygulama; 01, 02, 04) / **[Muhtemel]** (03) / **TBD**: kurulumu kimin yaptığı, süre, WordPress ön koşulu, hesap/lisans/paket aktivasyonu, Menü Asistanı için API anahtarı, toplu ürün içe aktarma, personelin panele erişim yolu. "Başlamadan önce" bloğu bu TBD'ler nedeniyle bilinçli olarak yoktur.

---

## 11. FAQ / İTİRAZLAR

1. **Section adı**: FAQ / İtirazlar
2. **Section amacı**: Potansiyel müşterinin CTA'ya gitmeden önceki son tereddütlerini dürüstçe gidermek.
3. **Hangi problemi ele alıyor**: Tüm önceki section'larda değinilen konulara dair kalan şüpheler (çeviri, ödeme, chatbot kapsamı, filtreler, kârlılık analizi, güvenlik, yorum gizleme, kurulum).
4. **Kullanılacak gerçek ürün özelliği**: CONTENT_STRATEGY.md madde 10'daki 8 itiraz kalıbının tamamı — **[Kesin]** (dayanakları madde 1'e bağlı) / kurulum itirazı **TBD**.
5. **Ana mesaj / copy açısı**: Her soru, madde 1'deki gerçeğe dürüstçe bağlanır; gerçeği yumuşatan belirsiz cevaplar verilmez (madde 10).
6. **Görsel/UI gösterimi**: Hayır — standart accordion/liste yapısı yeterlidir, görsel gerekmez.
7. **CTA gerekiyor mu**: Hayır (FAQ içinde tekrar eden mikro-CTA'lar section'ın kendi CTA'sı sayılmaz; birincil CTA Section 12'dedir).
8. **Sonraki section'a bağlanışı**: Tüm tereddütler giderildikten sonra tek kalan adım, Section 12'deki nihai CTA'dır.
9. **Etiket**: **[Kesin]** (çerçeve) / **TBD** (kurulum itirazının cevabı).
10. **Durum**: **Planlı — uygulanmadı.** Güvenlik section'ı akıştan çıktığı için "masa linkim başkası tarafından kullanılabilir mi?" itirazı (CONTENT_STRATEGY.md madde 10) artık **yalnızca burada** cevaplanır; cevap madde 1.10'daki gerçeğe bağlıdır (Ek B kaynak olarak kullanılır). Section 10'da (Kurulum) doğrulanmamış bırakılan konular (kimin kurduğu, süre, WordPress ön koşulu, hesap/lisans/paket, API anahtarı, toplu ürün içe aktarma, personel erişimi) doğrulanana kadar burada da cevaplanmaz.

---

## 12. SON CTA

1. **Section adı**: Son CTA
2. **Section amacı**: Sayfa boyunca kurulan güveni tek, net bir sonraki adıma yönlendirmek.
3. **Hangi problemi ele alıyor**: Doğrudan problem değil; kararsızlığı gidermek (CONTENT_STRATEGY.md madde 4'ün son halkası: CTA).
4. **Kullanılacak gerçek ürün özelliği**: Yok — bu bir aksiyon section'ıdır.
5. **Ana mesaj / copy açısı**: Net, dürüst, tek eylem ("Demo iste" / "Canlı örneği incele" türü — CONTENT_STRATEGY.md madde 9). Birincil CTA'nın gerçek hedefi (demo formu / self-servis kayıt / satış görüşmesi) **TBD** olduğundan, hedef kesinleştirilmeden nihai buton metni/akışı burada **kilitlenmez**.
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — büyük bir mockup yerine sade bir kapanış görseli veya salt tipografik kapanış tercih edilebilir.
7. **CTA gerekiyor mu**: Evet — sayfanın birincil, tek CTA'sı burada en güçlü haliyle tekrarlanır (DESIGN_SYSTEM.md madde 8: section başına 1 primary buton).
8. **Sonraki section'a bağlanışı**: Yok — sayfanın son section'ıdır (footer hariç; footer bu dosyanın kapsamı dışındadır).
9. **Etiket**: **[Muhtemel]** (CTA'nın var olması ve tekil olması) / **TBD** (CTA'nın kesin hedefi/metni).
10. **Durum**: **Planlı — uygulanmadı.** Section 9'un CTA'sıyla ("Geçiş İçin Bilgi Alın", hedef TBD) aynı hedefe bağlanması **[Muhtemel]** beklenir; hedef doğrulanmadan bağlanmaz.

---

## 13. Açık Mimari Konular

1. **Branch durumu — [Kesin]**: Section 1–10 `claude/qr-menu-section-9-strategy-eircho` branch'indedir (kod: `dcaeec9`). `main` eski Hero-only durumdadır (`aabf2f0`); `main`'e merge planı **TBD**.
2. **Ürün Haritası (Section 2) — [Kesin]**: Uygulanan 8 özellik arasında Analytics ve Menü Mühendisliği yoktur. Section 8 (Analytics) eklendiği hâlde haritanın güncellenip güncellenmeyeceği **TBD**.
3. **Menü Mühendisliği (8B) — [Kesin]**: Uygulanmadı; sunum biçimi ve gösterilecek gerçek ekran **TBD**.
4. **Problem/Çözüm — [Kesin]**: Mevcut akışta yok; ileride eklenip eklenmeyeceğine dair karar yok.
5. **Yorum / Feedback — [Kesin]**: Planlı; mevcut akıştaki yeri henüz belirlenmedi (bkz. Ek A). Ayrıca Section 2'de "Geri Bildirim Yönetimi" adlı bir ürün özelliği kartı vardır (ayrı bir section değildir).
6. **CTA hedefleri — TBD**: Section 9 CTA'sının ("Geçiş İçin Bilgi Alın") hedefi belirlenmemiştir; kodda `href` yoktur ve yayından önce bağlanmalıdır. Section 3–8'deki "… İncele" CTA'ları `href="#"` durumundadır (ayrı iş). Hero CTA'sının metni "Canlı Menüyü Deneyin"dir, `href`'i `https://qrmenuofficial.com/paketler/`'dir; metin ile hedef uyumsuzdur (canlı sayfa içeriği bu repoda doğrulanamamıştır).
7. **Hero copy audit — [Kesin]**: Hero'daki "Teknik bilgi gerekmez" satırı CONTENT_STRATEGY.md madde 6.6 ile çelişir; ayrı bir copy audit maddesidir.
8. **Kurulum (Section 10) doğrulanmamış konular — TBD**: kurulumu kimin yaptığı, süre, WordPress ön koşulu, hesap/lisans/paket aktivasyonu, Menü Asistanı için API anahtarı, toplu ürün içe aktarma, personelin panele erişim yolu.
9. **Güvenlik arşivi — [Kesin]**: `sections/section-9-security.html` arşiv/yetim kaynaktır (bkz. Ek B). Silinip silinmeyeceği kararı **TBD**.

---

## 14. Genel Uygulama Kuralı

Bu section mimarisi HTML/CSS/JS'e dökülürken:

1. Her section, CONTENT_STRATEGY.md madde 4'teki PROBLEM → ACI → İŞLETMEYE ETKİ → ÇÖZÜM → ÖZELLİK → FAYDA → KANIT → CTA zincirinin ilgili halkalarını taşır; zincir atlanmaz.
2. Hiçbir section, madde 1'deki (CONTENT_STRATEGY.md) ürün gerçekliği sınırlarını aşan bir iddia içeremez.
3. TBD olarak işaretli alanlar (Kurulum ayrıntıları, Section 9 ve Son CTA hedefleri, Menü Mühendisliği sunumu, Yorum/Feedback teknik mekanizması) ilgili veri doğrulanmadan **nihai metne dökülmez**.
4. Görsel uygulama DESIGN_SYSTEM.md'deki token ve kurallara (özellikle madde 1, 8, 9, 11, 19) bağlı kalır; bu dosyadaki "görsel gerekiyor mu" kararları o kuralların yerine geçmez, onları tamamlar.
5. Section sırası değiştirilecekse, önce bu dosya güncellenir; sıra doğrudan kodda değiştirilmez.

---

## Ek A. YORUM / FEEDBACK — Planlı, mevcut akıştaki yeri henüz belirlenmedi

**Durum — [Kesin]**: **Planlı — mevcut akıştaki yeri henüz belirlenmedi.** Bu kayıt homepage sırasındaki bir section değildir ve numaralandırılmamıştır.
- Feedback section'ı **hiç kodlanmamıştır**; `index.html`, `sections/`, `css/`, `js/` içinde ona ait kod yoktur.
- Git geçmişinde ve dokümanlarda "çıkarıldı", "ertelendi" ya da "gerekli değil" yönünde açık bir karar yoktur; **"çıkarıldı" olarak işaretlenmemiştir**.
- Ürün modülü mevcuttur (`qr-menu-suite/modules/yorum-feedback`); anlatı çerçevesi CONTENT_STRATEGY.md madde 8'de geçerlidir.
- Section 2'de "Geri Bildirim Yönetimi" ürün özelliği kartı bulunur; bu kart ayrı bir Feedback section'ı yerine geçmez.
- Yerleştirileceği konum belirlendiğinde bu bölüm ana sıraya alınır ve numaralandırılır.

Aşağıdaki tanım planlanan içeriğin kaydıdır:

1. **Section adı**: Yorum / Feedback
2. **Section amacı**: İşletmenin müşteri memnuniyetsizliğini halka açık olmadan önce öğrenebildiğini anlatmak.
3. **Hangi problemi ele alıyor**: "Olumsuz bir deneyim, işletme haberdar olmadan doğrudan Google'a taşar" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Feedback/yorum toplama mekanizması — CONTENT_STRATEGY.md madde 8'de tanımlı çerçeve; teknik detay ZIP analizinde madde 1 listesinde ayrı bir madde olarak yer almıyor, bu nedenle mekanizmanın tam davranışı **[Tahmin]** kabul edilir, yalnızca CONTENT_STRATEGY.md madde 8'deki onaylı çerçeve kullanılır.
5. **Ana mesaj / copy açısı**: **"Şikâyeti Google'dan önce siz duyun."** çerçevesi (CONTENT_STRATEGY.md madde 8). "Google puanınızı yükseltin", "olumsuz yorumları engelleyin" gibi review-gating ifadeleri **kesinlikle kullanılmaz**.
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — basit bir feedback formu/akış önizlemesi yeterli, büyük bir mockup gerekmeyebilir. **[Tahmin]**.
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Akıştaki yeri belirlenmediği için bağlanacağı section de belirlenmemiştir.
9. **Etiket**: **[Muhtemel]** (çerçeve doğrulanmış, teknik mekanizma detayı TBD).

---

## Ek B. GÜVENLİK — Homepage section'ı değil (arşiv)

**Durum — [Kesin]**: **Aktif homepage section'ı değildir (akıştan çıkarılmış / arşivlenmiş).**
- `1f87b17` ile Section 9 olarak eklendi (`qrmo-security-v1`, `sections/section-9-security.html`); `3fc368e` ile `index.html`'de aynı konumda yerine Geçiş Kararı (Section 9) kondu. `dcaeec9` sonrasında da `index.html`'de `qrmo-security-v1` sınıfı yoktur.
- `sections/section-9-security.html` **yetim/arşiv kaynaktır**; homepage'de kullanılmaz ve aktif bir section gibi ele alınmaz. Dosya silinmemiştir.
- Çıkarma proje sahibinin kararıdır (satış açısından gerekli görülmedi); commit mesajlarında gerekçe yazılı değildir.
- Ürün gerçeği (madde 1.10) ve CONTENT_STRATEGY.md madde 6.4'teki iddia sınırları geçerliliğini korur. Masa oturumu güvenliği içeriği artık Section 11'de (FAQ, planlı) cevap kaynağıdır.

Aşağıdaki tanım arşiv kaydıdır (aktif blueprint değildir):

1. **Section adı**: Güvenlik (QR Masa Güvenliği)
2. **Section amacı**: Müşterinin masa oturumunun teknik olarak nasıl korunduğunu, işletmeye ve müşteriye güven vermek amacıyla açıklamak.
3. **Hangi problemi ele alıyor**: Doğrudan bir "günlük operasyon" problemi değil, güven/itiraz gidermeye yöneliktir (CONTENT_STRATEGY.md madde 10 — "masa linkim başkası tarafından kullanılabilir mi?" itirazı).
4. **Kullanılacak gerçek ürün özelliği**: İmzalı masa oturumu (dışarıdan değiştirilemez, yalnızca kayıtlı masalar için açılır), süre sınırı (varsayılan 90 dakika toplam / 30 dakika hareketsizlik, ayarlanabilir), hesap tamamlandığında oturumun sona ermesi, talep korumaları ve yönetim tarafı yetki/doğrulama kontrolleri (madde 1.10) — **[Kesin]**. Kayıtlı olmayan/geçersiz masa adresinde gösterilen "Oturum Gerekli" kilit ekranı bir müşteri ekranıdır; genel bir erişim koruması olarak anlatılmaz.
5. **Ana mesaj / copy açısı**: Mekanizma açıklanır (imzalı ve süresi sınırlı oturum); gerçek QR bağlantısına sahip birinin erişiminin engellendiği iddia edilmez; "hacklenemez", "%100 güvenli" gibi mutlak ifadeler kullanılmaz (madde 6.4).
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — teknik bir diyagram yerine sade bir güven rozeti/ikon + kısa açıklama yeterli olabilir (DESIGN_SYSTEM.md madde 1: dekoratif abartı yasağı). **[Tahmin]** (görsel biçimi netleşmedi).
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Yok — section akıştan çıkarılmıştır.
9. **Etiket**: **[Kesin]** (özellik) / **[Tahmin]** (görsel sunum biçimi).
