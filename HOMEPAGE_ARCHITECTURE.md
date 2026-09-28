# Homepage Architecture — QR Menu Official

Bu doküman, ana sayfanın **section mimarisi** referansıdır. `DESIGN_SYSTEM.md` (görsel kurallar) ve `CONTENT_STRATEGY.md` (içerik/copy kuralları) temel alınarak hazırlanmıştır ve bu iki dosyaya aykırı hiçbir karar içermez.

Bu dosya:
- Nihai section metni **değildir**.
- HTML/CSS/JS üretimi için **kaynak dokümandır**: her section kodlanırken önce bu dosyadaki tanım, sonra CONTENT_STRATEGY.md'deki ilgili madde, sonra DESIGN_SYSTEM.md'deki ilgili görsel kural kontrol edilir.
- Etiket sistemi CONTENT_STRATEGY.md ile aynıdır: **[Kesin]** (ürün/kod ile doğrulanmış), **[Muhtemel]** (güçlü strateji çıkarımı, doğrulanmamış), **[Tahmin]** (yer tutucu, netleşmemiş).

---

## 0. Güncel Section Sırası (Özet)

Bu sıra, homepage'in **gerçekte uygulanmış akışına** göre güncellenmiştir. Section 1–7 kodlanmış ve entegre edilmiştir; Section 8–13 henüz ana sayfada yoktur. Sonuç: **13 section**.

| # | Section | Uygulama durumu | Kök sınıf / kaynak |
|---|---|---|---|
| 1 | Hero | Entegre | `qrmo-hero-v3-wrap` |
| 2 | Ürün Haritası / Neler Sunuyoruz | Entegre | `qrmo-features-v3-wrap` |
| 3 | Dil Çeviri Modülü | Entegre | `qrmo-translation-v3-wrap` |
| 4 | QR Masa | Entegre | `qrmo-tables-v5` |
| 5 | Akıllı Filtre | Entegre | `qrmo-smart-filter-showcase` |
| 6 | Chatbot / Menü Asistanı | Entegre | `qrmo-chatbot-feature` — `sections/section-6-chatbot.html` |
| 7 | Garson + Hesap + Servis Paneli | Entegre | `qrmo-service-v2` — `sections/section-7-service.html` |
| 8 | Analytics + Menü Mühendisliği | Analytics kod taslağı var, **entegre değil**; Menü Mühendisliği **uygulanmadı** | `qrmo-analytics-v3` (taslak) |
| 9 | Güvenlik | Uygulanmadı | — |
| 10 | Yorum / Feedback | Uygulanmadı | — |
| 11 | Kurulum / Kullanım Kolaylığı (hafif ağırlıklı) | Uygulanmadı | — |
| 12 | FAQ / İtirazlar | Uygulanmadı | — |
| 13 | Son CTA | Uygulanmadı | — |

**Entegrasyon konumu — [Kesin]**: Section 1–7'nin entegre hâli `claude/section-6-chatbot-audit-5aah0t` branch'indeki `index.html`'dedir (son commit `5320e2b`). `main` branch'indeki `index.html` şu an yalnızca Hero'yu içerir; Section 2–7 henüz `main`'e merge edilmemiştir.

### 0.1 Önceki (12 section) mimariden farklar

Bu dosyanın önceki sürümü 12 section tanımlıyordu (1 Hero, 2 Problem, 3 Çözüm, 4 Menü Yönetimi & Akıllı Menü, 5 Chatbot, 6 Garson+Hesap+Servis, 7 İstatistikler + Menü Mühendisliği, 8 Güvenlik, 9 Yorum/Feedback, 10 Kurulum, 11 FAQ, 12 Son CTA). Uygulanan akış bu sıradan şu noktalarda ayrılmıştır:

1. **Problem ve Çözüm section'ları mevcut homepage akışında yer almaz.** Bu section'lar güncel mimarinin parçası değildir ve bu dosyada artık zorunlu section olarak tanımlanmaz. Kalıcı olarak çıkarıldıklarına dair repoda belgelenmiş bir karar **yoktur**; yalnızca mevcut akışa eklenmemişlerdir (bkz. madde 0.2).
2. **Çeviri, Menü Yönetimi'nin alt-vurgusu olarak değil, ayrı bir section (3) olarak uygulanmıştır.** Önceki sürümdeki "çeviri Menü Yönetimi içinde ele alınır" kararı güncel akışta geçerli değildir.
3. **QR Masa (4) ve Akıllı Filtre (5) ayrı section'lar olarak uygulanmıştır.** Önceki sürümde QR Masa'nın ayrı bir section'ı yoktu; filtreler Menü Yönetimi section'ının parçasıydı.
4. **Ürün Haritası (2)**, önceki sürümde tanımlı olmayan, ürün alanlarını gruplayan bir genel bakış section'ı olarak uygulanmıştır.
5. **Chatbot'un Servis'ten önce gelmesi korunmuştur** (önceki sürümdeki gerekçe geçerliliğini korur: CONTENT_STRATEGY.md madde 3'teki akış SOR → ÇAĞIR → SERVİS'tir — **[Kesin]**).
6. **Analytics + Menü Mühendisliği** 7'den 8'e; Güvenlik, Yorum/Feedback, Kurulum, FAQ ve Son CTA birer sıra kaymıştır (9–13).
7. **Kurulum section'ının hafif/kısa tutulması kararı korunmuştur** (CONTENT_STRATEGY.md madde 6.6 ve madde 9 — kurulum/onboarding verisi **TBD**).

### 0.2 Mimari geçmişi (commit kayıtları)

Aşağıdaki kayıtlar tarihsel bilgi olarak korunur; güncel sırayı belirlemez.

- `7f37710`, `f6bfeeb` — "Section 2 (Restoranın Günlük Sorunu)" (`.qrmo-problem`) kodlandı. Yalnızca `claude/qr-menu-site-structure-0oxcst` branch'inde bulunur; mevcut homepage akışının geçmişinde yoktur.
- `8f29cd2` — "Section 3 (Çözüm / Akış Özeti)" (`.qrmo-flow`) kodlandı. Aynı branch'te bulunur; mevcut akışın geçmişinde yoktur.
- `63b1d97` — Mevcut akışta Section 2 olarak Ürün Haritası (features v3) eklendi (doğrudan `main` / `aabf2f0` üzerinden).
- `11a5034` — Mevcut akışta Section 3 olarak "Nasıl İşler" (flow v1) akışı eklendi; problem cümlesini de içeriyordu.
- `b660495` — flow v1 Section 3 slotundan kaldırıldı, yerine Dil Çeviri Modülü (translation v3) entegre edildi. Commit mesajı: "Önceki flow-v1 stepper Section 3 slotundan kaldırıldı (11a5034'te duruyor)". Kaldırmanın gerekçesi commit'te belirtilmemiştir.
- `9c0d904` (QR Masa, Section 4), `c91e5c3` (Akıllı Filtre, Section 5), `1e68839` / `2649d90` (Chatbot, Section 6), `3067f37` / `5320e2b` (Servis, Section 7).

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
9. **Etiket**: **[Kesin]** (uygulama) / **[Muhtemel]** (haritanın Section 8'deki Analytics + Menü Mühendisliği alanını henüz içermemesi, bkz. madde 14).

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
5. **Ana mesaj / copy açısı**: Masa ve QR hazırlığının işletme tarafından yönetilen bir adım olduğu; güvenlik iddiası bu section'da değil Section 9'da ele alınır.
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

## 8. ANALYTICS + MENÜ MÜHENDİSLİĞİ

Bu section **iki parçadan** oluşur. Tek section olarak kalır; Menü Mühendisliği için ayrı bir section açılmaz.

- **8A — Analytics (İstatistikler)**: Kod taslağı mevcuttur (`qrmo-analytics-v3`), henüz `index.html`'e entegre edilmemiştir.
- **8B — Menü Mühendisliği**: **Henüz uygulanmamıştır.** Gerçek ürün ekranı/kanıtı olmadan dashboard veya mockup üretilmez.

1. **Section adı**: Analytics & Menü Mühendisliği
2. **Section amacı**: İşletmenin, ürünü kullandıkça elde ettiği veriyle (kullanım istatistikleri + kendi maliyet verisiyle menü mühendisliği) nasıl daha bilinçli kararlar alabileceğini göstermek.
3. **Hangi problemi ele alıyor**: "İşletme, ürün kârlılığını net göremez" (CONTENT_STRATEGY.md madde 2) ve menüde neyin ilgi gördüğünün bilinmemesi.
4. **Kullanılacak gerçek ürün özelliği**:
   - **8A — Analytics**: `qr-menu-suite/modules/qr-analiz` — **[Kesin]**: menü görüntüleme, ürün tıklama, tekil ziyaretçi (IP bazlı), aktif masa sayısı (seçili aralıkta hareket görmüş masa), önceki döneme göre değişim, en çok / en az tıklanan ürünler, kategori dağılımı, masa bazlı kırılım; dönem filtresi Bugün / Son 7 gün / Bu ay / Özel (en fazla 31 gün). Sepet & Sipariş verisi chatbot modülüne bağlıdır. Panel sayfa açılışında yüklenir; canlı/otomatik yenilenen bir ekran değildir.
   - **8B — Menü Mühendisliği**: işletmenin girdiği maliyet verisine dayanır (madde 1.4) — **[Kesin]** (özelliğin varlığı ve veri girişi şartı); ürün modülü `qr-menu-suite/modules/qr-menu-muhendisligi`.
5. **Ana mesaj / copy açısı**: "Kendi verinizle görün" çerçevesi — "otomatik kârlılık analizi" veya veri girişi gerektirmeyen bir sihir olarak sunulmaz (madde 1.4). Gelir/satış artış yüzdesi **kesinlikle** kullanılmaz (madde 1.11, madde 7). Ürünün üretmediği metrik, içgörü veya "canlı" davranış iddia edilmez.
6. **Görsel/UI gösterimi**: Gerçek istatistik ve gerçek menü mühendisliği ekranı hedeflenir; yalnızca doğrulanmış metrikler gösterilir. 8B için gerçek ürün kanıtı olmadan görsel üretilmez.
7. **CTA gerekiyor mu**: Birincil CTA değildir.
8. **Sonraki section'a bağlanışı**: Veri/güven teması, Section 9'daki (Güvenlik) "işletmenin ve müşterinin verisi/oturumu nasıl korunuyor" sorusuna bağlanır.
9. **Etiket**: **[Kesin]** (8A metrik seti, `qr-analiz` kodundan doğrulandı) / **[Kesin]** (8B henüz uygulanmadı) / **TBD** (8B'nin section içindeki sunum biçimi).

---

## 9. GÜVENLİK

1. **Section adı**: Güvenlik (QR Masa Güvenliği)
2. **Section amacı**: Müşterinin masa oturumunun teknik olarak nasıl korunduğunu, işletmeye ve müşteriye güven vermek amacıyla açıklamak.
3. **Hangi problemi ele alıyor**: Doğrudan bir "günlük operasyon" problemi değil, güven/itiraz gidermeye yöneliktir (CONTENT_STRATEGY.md madde 10 — "masa linkim başkası tarafından kullanılabilir mi?" itirazı).
4. **Kullanılacak gerçek ürün özelliği**: İmzalı masa oturumu / kilit mekanizması (madde 1.10) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: Mekanizma açıklanır (imzalı oturum/kilit); "hacklenemez", "%100 güvenli" gibi mutlak ifadeler kullanılmaz (madde 6.4).
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — teknik bir diyagram yerine sade bir güven rozeti/ikon + kısa açıklama yeterli olabilir (DESIGN_SYSTEM.md madde 1: dekoratif abartı yasağı). **[Tahmin]** (görsel biçimi netleşmedi).
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Güvenden sonra, işletmenin müşteri memnuniyetsizliğini nasıl erken yakaladığı (Section 10 — Yorum/Feedback) doğal bir "güven + şeffaflık" temasının devamıdır.
9. **Etiket**: **[Kesin]** (özellik) / **[Tahmin]** (görsel sunum biçimi).

---

## 10. YORUM / FEEDBACK

1. **Section adı**: Yorum / Feedback
2. **Section amacı**: İşletmenin müşteri memnuniyetsizliğini halka açık olmadan önce öğrenebildiğini anlatmak.
3. **Hangi problemi ele alıyor**: "Olumsuz bir deneyim, işletme haberdar olmadan doğrudan Google'a taşar" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Feedback/yorum toplama mekanizması — CONTENT_STRATEGY.md madde 8'de tanımlı çerçeve; teknik detay ZIP analizinde madde 1 listesinde ayrı bir madde olarak yer almıyor, bu nedenle mekanizmanın tam davranışı **[Tahmin]** kabul edilir, yalnızca CONTENT_STRATEGY.md madde 8'deki onaylı çerçeve kullanılır.
5. **Ana mesaj / copy açısı**: **"Şikâyeti Google'dan önce siz duyun."** çerçevesi (CONTENT_STRATEGY.md madde 8). "Google puanınızı yükseltin", "olumsuz yorumları engelleyin" gibi review-gating ifadeleri **kesinlikle kullanılmaz**.
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — basit bir feedback formu/akış önizlemesi yeterli, büyük bir mockup gerekmeyebilir. **[Tahmin]**.
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Güven ve şeffaflık teması tamamlandıktan sonra, "peki bu sistemi işletmeme nasıl alırım" sorusuna geçiş — Section 11 (Kurulum).
9. **Etiket**: **[Muhtemel]** (çerçeve doğrulanmış, teknik mekanizma detayı TBD).

---

## 11. KURULUM / KULLANIM KOLAYLIĞI (Hafif Ağırlıklı Geçiş Bloğu)

1. **Section adı**: Kurulum & Kullanım Kolaylığı
2. **Section amacı**: FAQ ve Son CTA'ya geçmeden önce kısa bir "bu sisteme nasıl geçilir" güvencesi vermek — **tam ağırlıklı bir section değil**, kısa bir geçiş bloğu.
3. **Hangi problemi ele alıyor**: Potansiyel "kurulumu zor/uzun mudur" tereddüdü (dolaylı; madde 2'de doğrudan bir madde olarak yer almıyor).
4. **Kullanılacak gerçek ürün özelliği**: Yok — bu alanda ZIP analizinde doğrulanmış bir veri **bulunmuyor** (CONTENT_STRATEGY.md madde 1 TBD notu, madde 6.6).
5. **Ana mesaj / copy açısı**: **TBD** — hiçbir süre ("5 dakikada"), kolaylık ("kod yazmadan") veya otomasyon iddiası kullanılamaz. Bu netleşene kadar bu blokta yalnızca nötr bir yönlendirme ("ekibimizle görüşün" türü) kullanılabilir (CONTENT_STRATEGY.md madde 6.6, madde 10).
6. **Görsel/UI gösterimi**: Hayır (veya en fazla çok küçük bir simge) — görsel yatırımı, içerik doğrulanmadan yapılmamalı.
7. **CTA gerekiyor mu**: Hayır — birincil CTA Section 13'te toplanır; burada CTA tekrarı section'ı gereksiz ağırlıklandırır.
8. **Sonraki section'a bağlanışı**: "Nasıl başlarım" sorusunun kısmen açık kalması, doğal olarak Section 12'deki (FAQ) diğer tereddütlerle birlikte ele alınmasına zemin hazırlar.
9. **Etiket**: **TBD** — bu section'ın nihai içeriği, kurulum/onboarding verisi doğrulanmadan yazılamaz. Doğrulama gelene kadar bu section homepage'de **minimal tutulmalı veya FAQ'e bir madde olarak taşınması değerlendirilmelidir** (bkz. madde 0.1/7).

---

## 12. FAQ / İTİRAZLAR

1. **Section adı**: FAQ / İtirazlar
2. **Section amacı**: Potansiyel müşterinin CTA'ya gitmeden önceki son tereddütlerini dürüstçe gidermek.
3. **Hangi problemi ele alıyor**: Tüm önceki section'larda değinilen konulara dair kalan şüpheler (çeviri, ödeme, chatbot kapsamı, filtreler, kârlılık analizi, güvenlik, yorum gizleme, kurulum).
4. **Kullanılacak gerçek ürün özelliği**: CONTENT_STRATEGY.md madde 10'daki 8 itiraz kalıbının tamamı — **[Kesin]** (dayanakları madde 1'e bağlı) / kurulum itirazı **TBD**.
5. **Ana mesaj / copy açısı**: Her soru, madde 1'deki gerçeğe dürüstçe bağlanır; gerçeği yumuşatan belirsiz cevaplar verilmez (madde 10).
6. **Görsel/UI gösterimi**: Hayır — standart accordion/liste yapısı yeterlidir, görsel gerekmez.
7. **CTA gerekiyor mu**: Hayır (FAQ içinde tekrar eden mikro-CTA'lar section'ın kendi CTA'sı sayılmaz; birincil CTA Section 13'tedir).
8. **Sonraki section'a bağlanışı**: Tüm tereddütler giderildikten sonra tek kalan adım, Section 13'teki nihai CTA'dır.
9. **Etiket**: **[Kesin]** (çerçeve) / **TBD** (kurulum itirazının cevabı).

---

## 13. SON CTA

1. **Section adı**: Son CTA
2. **Section amacı**: Sayfa boyunca kurulan güveni tek, net bir sonraki adıma yönlendirmek.
3. **Hangi problemi ele alıyor**: Doğrudan problem değil; kararsızlığı gidermek (CONTENT_STRATEGY.md madde 4'ün son halkası: CTA).
4. **Kullanılacak gerçek ürün özelliği**: Yok — bu bir aksiyon section'ıdır.
5. **Ana mesaj / copy açısı**: Net, dürüst, tek eylem ("Demo iste" / "Canlı örneği incele" türü — CONTENT_STRATEGY.md madde 9). Birincil CTA'nın gerçek hedefi (demo formu / self-servis kayıt / satış görüşmesi) **TBD** olduğundan, hedef kesinleştirilmeden nihai buton metni/akışı burada **kilitlenmez**.
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — büyük bir mockup yerine sade bir kapanış görseli veya salt tipografik kapanış tercih edilebilir.
7. **CTA gerekiyor mu**: Evet — sayfanın birincil, tek CTA'sı burada en güçlü haliyle tekrarlanır (DESIGN_SYSTEM.md madde 8: section başına 1 primary buton).
8. **Sonraki section'a bağlanışı**: Yok — sayfanın son section'ıdır (footer hariç; footer bu dosyanın kapsamı dışındadır).
9. **Etiket**: **[Muhtemel]** (CTA'nın var olması ve tekil olması) / **TBD** (CTA'nın kesin hedefi/metni).

---

## 14. Açık Mimari Konular

1. **Branch durumu — [Kesin]**: Section 2–7 `main`'de değildir; `claude/section-6-chatbot-audit-5aah0t` branch'indedir. Section 8 entegrasyonu bu akışın üzerine yapılmalıdır.
2. **Ürün Haritası (Section 2) — [Kesin]**: Uygulanan 8 özellik arasında Analytics ve Menü Mühendisliği yoktur. Section 8 eklendiğinde haritanın güncellenip güncellenmeyeceği **TBD**.
3. **Menü Mühendisliği (8B) — [Kesin]**: Uygulanmadı; sunum biçimi ve gösterilecek gerçek ekran **TBD**.
4. **Problem/Çözüm — [Kesin]**: Mevcut akışta yok; ileride eklenip eklenmeyeceğine dair karar yok.

---

## 15. Genel Uygulama Kuralı

Bu section mimarisi HTML/CSS/JS'e dökülürken:

1. Her section, CONTENT_STRATEGY.md madde 4'teki PROBLEM → ACI → İŞLETMEYE ETKİ → ÇÖZÜM → ÖZELLİK → FAYDA → KANIT → CTA zincirinin ilgili halkalarını taşır; zincir atlanmaz.
2. Hiçbir section, madde 1'deki (CONTENT_STRATEGY.md) ürün gerçekliği sınırlarını aşan bir iddia içeremez.
3. TBD olarak işaretli alanlar (Kurulum/Kullanım Kolaylığı, Son CTA hedefi, Menü Mühendisliği sunumu, Yorum/Feedback teknik mekanizması) ilgili veri doğrulanmadan **nihai metne dökülmez**.
4. Görsel uygulama DESIGN_SYSTEM.md'deki token ve kurallara (özellikle madde 1, 8, 9, 11, 19) bağlı kalır; bu dosyadaki "görsel gerekiyor mu" kararları o kuralların yerine geçmez, onları tamamlar.
5. Section sırası değiştirilecekse, önce bu dosya güncellenir; sıra doğrudan kodda değiştirilmez.
