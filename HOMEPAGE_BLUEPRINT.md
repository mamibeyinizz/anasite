# Homepage Content + Visual Blueprint — QR Menu Official

Bu doküman, `HOMEPAGE_ARCHITECTURE.md`'deki 13 section'ı (güncel homepage akışı) temel alarak her section için **içerik yapısı** ve **görsel/UI blueprint**'i tanımlar.

Bu dosya:
- Nihai pazarlama metni **değildir** — yalnızca içerik hiyerarşisi (kicker/H2/açıklama/destekleyici nokta/CTA amacı) tanımlar.
- HTML/CSS/JS içermez.
- `DESIGN_SYSTEM.md`, `CONTENT_STRATEGY.md`, `HOMEPAGE_ARCHITECTURE.md` dosyalarını değiştirmez; onlara aykırı hiçbir karar içermez.
- Etiket sistemi: **[Kesin]**, **[Muhtemel]**, **[Tahmin]**, **TBD**.

**Section sırası notu**: Section 1–7 homepage'de uygulanmıştır (entegre hâli `claude/section-6-chatbot-audit-5aah0t` branch'indedir; `main`'de yalnızca Hero vardır). Section 8–13 henüz uygulanmamıştır. Önceki 12 section'lık sürümdeki Problem ve Çözüm section'ları mevcut homepage akışında yer almaz (bkz. HOMEPAGE_ARCHITECTURE.md madde 0.1, 0.2).

**Genel not — gerçek ürün ekranı asset durumu**: Bu repodaki `assets/product/` klasörlerinde henüz section'lara eşlenmiş gerçek ekran görüntüsü yoktur (yalnızca `.gitkeep` ve `menu/` altında eşlenmemiş tek bir `.webp` dosyası). Aşağıda "gerçek ürün ekranı zorunlu" denen her yerde, özelliğin kendisi ürün gerçeği olarak **[Kesin]** olsa bile, o ekranın **görsel asset'i bu repoda henüz mevcut değildir** — bu, ilgili section'ın görsel kısmı için ayrıca **[TBD]** olarak işaretlenmiştir. Gerçek ekran görüntüsü sağlanmadan hayali/sahte bir dashboard **üretilmeyecektir**.

---

## SECTION 1 — Hero

**1. Satış amacı**: Ziyaretçi "bu sadece bir QR kod menüsü değil, restoranımın müşteri etkileşimini ve operasyonunu tek yerde toplayan bir sistem" düşüncesine ulaşmalı.

**2. Problem**: Doğrudan işlenmez; Hero bir problem sahnesi değil, konumlandırma anıdır. Problemler ilgili modül section'larında (3–10) ele alınır.

**3. Ürün gerçeği**: QR ile menüye anında erişim; ürünün QR→MENÜ→SEÇ→SOR→ÇAĞIR→SERVİS→ÖĞREN akışının giriş noktası olduğu (CONTENT_STRATEGY.md madde 3) — **[Kesin]**.

**4. Ana mesaj**: Ürün "yalnızca QR menü" olarak değil, uçtan uca bir etkileşim/operasyon katmanı olarak çerçevelenir. Mesaj iddiasız ve rakamsızdır; "devrim", abartı dili kullanılmaz.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: Ürünün kategori/rol tanımını veren kısa bir etiket (ör. konumlandırmayı özetleyen 2-4 kelimelik bir çerçeve; nihai metin değil).
- **H2 (display)**: Ürünün "sadece QR menü değil" konumlandırmasını taşıyan tek cümlelik ana başlık.
- **Kısa açıklama**: 7 adımlı akışın (QR→MENÜ→...→ÖĞREN) özünü tek cümlede özetleyen alt satır.
- **2–4 destekleyici nokta**: Hero V3'te zaten var olan feature-row yapısı (kısa etiket + ikon) — chatbot, çoklu dil, servis paneli gibi 3-4 kısa başlık; bunlar tam cümle açıklama değil, kısa etiketlerdir (DESIGN_SYSTEM.md madde 10'daki feature-icon yapısıyla uyumlu).
- **CTA amacı**: Ziyaretçiyi sayfanın geri kalanını okumaya veya doğrudan bir sonraki adıma (talep/inceleme) yönlendirmek; kesin hedef TBD (bkz. madde 8).

**6. Görsel/UI**: Hero V3 production kodu zaten gerçek bir ürün mockup'ı içeriyor (DESIGN_SYSTEM.md madde 11: max-width 480px, radius 20px, gold outline). Bu section'da **yeni bir görsel üretilmez**; mevcut Hero V3 görsel yapısı referans alınır. Görselin hangi spesifik ekranı (menü mü, genel arayüz mü) gösterdiği bu dosyanın kapsamı dışındadır — mevcut production kodundaki görsel aynen kullanılır.

**7. Layout**: Hero V3'ün kendi doğrulanmış grid'i (1.08fr/0.92fr, sol/sağ padding 5vw, gap `clamp(24px,4vw,56px)` — DESIGN_SYSTEM.md madde 5) bağlayıcıdır; bu section yeniden tasarlanmaz, yalnızca içerik/metin bu yapıya oturtulur.

**8. CTA**: Gerekiyor. Amacı: ziyaretçiyi net, dürüst bir sonraki adıma yönlendirmek. Hedef (demo talebi / canlı örnek / satış görüşmesi) **TBD** (CONTENT_STRATEGY.md madde 9) — buton metni bu aşamada kilitlenmez.

**9. Güven/kanıt**: Gerekmez; Hero bir konumlandırma anıdır, kanıt sonraki section'larda (gerçek ekranlar, mekanizma açıklamaları) gelir.

**10. Bir sonraki section bağlantısı**: Hero "ne olduğunu" genel olarak anlatır; Section 2 (Ürün Haritası) bunu ürün alanlarına ayırır.

**11. Riskler**: Abartı dili ("devrim", "kusursuz"); feature-row'un 4'ten fazla öğeye çıkıp feature-card kalabalığına dönüşmesi (DESIGN_SYSTEM.md madde 1 yasağı); genel SaaS/ajans tonuna kayma.

**Durum: [Kesin]** (Hero V3 zaten mevcut production kodu ve akışla uyumlu; CTA hedefi ayrıca **TBD**)

---

## SECTION 2 — Ürün Haritası / Neler Sunuyoruz

**1. Satış amacı**: Ziyaretçi "bu sistem restoranımın hangi alanlarını kapsıyor" sorusuna tek bakışta cevap bulmalı.

**2. Problem**: Doğrudan tek bir problem işlenmez; ürün kapsamının dağınık algılanması önlenir.

**3. Ürün gerçeği**: Uygulanan içerik 4 alan altında 8 özellik gruplar (Menü Yönetimi, Akıllı Deneyim, Sipariş & Servis, Müşteri Deneyimi) — **[Kesin]** (entegre kod, commit `63b1d97`). Her özellik iddiası CONTENT_STRATEGY.md madde 1 sınırlarına bağlıdır.

**4. Ana mesaj**: Özellikler bağlamsız bir liste değil, günlük kullanım alanlarına göre gruplanmış bir haritadır.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Neler Sunuyoruz" düzeyinde bir etiket.
- **H2**: Ürün alanlarını özetleyen tek cümlelik başlık.
- **Kısa açıklama**: Özelliklerin kullanım noktalarına göre gruplandığını söyleyen alt satır.
- **Destekleyici içerik**: 4 alan × 2 özellik; her özellik kısa başlık + tek cümle.
- **CTA amacı**: Yok.

**6. Görsel/UI**: Editorial 2x2 kategori haritası; kart/gölge kullanılmaz — **[Kesin]** (uygulama). Gerçek ürün ekranı gerekmez.

**7. Layout**: Hero V3 ile aynı yatay hat (5vw / 20px / 16px) — **[Kesin]** (uygulama).

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Gerekmiyor; kanıt ilgili modül section'larında gelir.

**10. Bir sonraki section bağlantısı**: Haritadaki alanlar sonraki modül section'larında (3–8) tek tek açılır; ilk açılan Dil Çeviri'dir (Section 3).

**11. Riskler**: Haritanın kart yığınına dönüşmesi (DESIGN_SYSTEM.md madde 9); haritada ürünün sunmadığı bir özelliğin yer alması. Haritada Section 8'in (Analytics + Menü Mühendisliği) karşılığı şu an yoktur — **[Kesin]**.

**Durum: [Kesin]** (entegre)

---

## SECTION 3 — Dil Çeviri Modülü

**1. Satış amacı**: "Yabancı müşterim menümü kendi dilinde okuyabilir" düşüncesi.

**2. Problem**: Çok dilli müşteriye hizmet vermek manuel çeviri yükü doğurur (CONTENT_STRATEGY.md madde 2).

**3. Ürün gerçeği**: Çoklu dil CSV/veritabanı/manuel çeviri girişiyle çalışır (madde 1.1, madde 6.3) — **[Kesin]**.

**4. Ana mesaj**: Dilleri işletme tanımlar, sistem bunları düzenli şekilde sunar; müşteri dilini seçer.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: Modül etiketi.
- **H2**: Modül adını taşıyan başlık.
- **Kısa açıklama**: Menünün müşterinin dilinde sunulduğunu anlatan alt satır.
- **2–3 destekleyici nokta**: Dil seçimi, ürün/kategori bilgisinin seçilen dile uyarlanması.
- **CTA amacı**: Yalnızca düşük vurgulu keşif eylemi; birincil CTA değildir.

**6. Görsel/UI**: Uygulamada kod içi animasyonlu dil seçimi demosu kullanılır — **[Kesin]**. Gerçek müşteri menüsü ekran görüntüsü **[SCREENSHOT_NEEDED]** (PRODUCT_SCREEN_ASSETS.md).

**7. Layout**: İçerik + demo iki kolon; mobilde tek kolon — **[Kesin]** (uygulama).

**8. CTA**: Birincil CTA değildir.

**9. Güven/kanıt**: Sayısal kanıt ("X dil otomatik") kullanılmaz.

**10. Bir sonraki section bağlantısı**: Menünün müşteriye ulaştığı fiziksel nokta — Section 4 (QR Masa).

**11. Riskler**: Çeviriyi "otomatik/AI/kusursuz çeviri" olarak sunmak (**kesin yasak**, CONTENT_STRATEGY.md madde 1.1, 7).

**Durum: [Kesin]** (özellik ve uygulama) / **[SCREENSHOT_NEEDED]** (gerçek ekran)

---

## SECTION 4 — QR Masa

**1. Satış amacı**: "Masalarımı ve QR kodlarımı kendim kolayca hazırlarım" düşüncesi.

**2. Problem**: Masa bazlı QR hazırlığının işletme için operasyonel bir yük olması.

**3. Ürün gerçeği**: Tekli/toplu masa oluşturma ve masa başına QR kodu uygulanan copy'de yer alır; ürün modülü `qr-menu-suite/modules/qr-masa` — **[Kesin]** (modülün varlığı) / **[Muhtemel]** (copy ayrıntılarının modül davranışıyla birebir doğrulanması bu dosyada yapılmamıştır).

**4. Ana mesaj**: Masa ve QR hazırlığı işletmenin yönettiği bir adımdır.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: Modül etiketi.
- **H2**: "Sınırsız QR Masa" düzeyinde başlık — **[Kesin]** (uygulama).
- **Kısa açıklama**: Masa oluşturma ve QR hazırlama akışının kısa tarifi.
- **2–3 destekleyici nokta**: Tekli/toplu oluşturma ve ilgili adımlar.
- **CTA amacı**: Birincil CTA değildir.

**6. Görsel/UI**: Uygulamada kod içi animasyonlu demo — **[Kesin]**. Gerçek ekran asset'i PRODUCT_SCREEN_ASSETS.md'de tanımlı değildir.

**7. Layout**: Demo + içerik iki kolon; mobilde tek kolon — **[Kesin]** (uygulama).

**8. CTA**: Birincil CTA değildir.

**9. Güven/kanıt**: Masa oturumu güvenliği bu section'da değil, Section 9'da (Güvenlik) ele alınır.

**10. Bir sonraki section bağlantısı**: Müşteri QR'ı okutup menüye geldiğinde aradığını bulma ihtiyacı — Section 5 (Akıllı Filtre).

**11. Riskler**: Güvenlik veya süre ("saniyeler içinde") iddiası kurmak (CONTENT_STRATEGY.md madde 6.4, madde 7).

**Durum: [Kesin]** (uygulama) / **[Muhtemel]** (ürün davranışıyla ayrıntılı eşleşme)

---

## SECTION 5 — Akıllı Filtre

**1. Satış amacı**: "Müşterim aradığı ürünü kendi tercihine göre hızlıca bulur" düşüncesi.

**2. Problem**: Diyet/alerjen kısıtlaması olan müşteriye doğru ürünü göstermek zordur (CONTENT_STRATEGY.md madde 2).

**3. Ürün gerçeği**: Filtreler ilgili ürün bilgisinin girilmesine bağlıdır (madde 1.5) — **[Kesin]**.

**4. Ana mesaj**: Sıralama ve filtreler işletmenin girdiği ürün bilgileriyle çalışır; müşteri menüyü kendi tercihine göre daraltır.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: Modül etiketi.
- **H2**: "Aradığına Göre Filtrelenen Menü" düzeyinde başlık — **[Kesin]** (uygulama).
- **Kısa açıklama**: Filtrelerin girilen bilgiye dayandığını açıkça belirten alt satır — **[Kesin]** (uygulama).
- **2–3 destekleyici nokta**: Sıralama, alerjen hariç tutma, tek panelde filtre.
- **CTA amacı**: Birincil CTA değildir.

**6. Görsel/UI**: Uygulamada kod içi animasyonlu filtre demosu — **[Kesin]**. Gerçek müşteri menüsü ekran görüntüsü **[SCREENSHOT_NEEDED]**.

**7. Layout**: İçerik + demo iki kolon; mobilde tek kolon — **[Kesin]** (uygulama).

**8. CTA**: Birincil CTA değildir.

**9. Güven/kanıt**: Kanıt, filtrelerin veri girişine bağlı olduğunun dürüstçe söylenmesidir.

**10. Bir sonraki section bağlantısı**: Müşteri menüde gezinirken soru sorma ihtiyacı doğar — Section 6 (Chatbot).

**11. Riskler**: Filtreleri "otomatik algılama" gibi sunmak (madde 1.5).

**Durum: [Kesin]** (özellik ve uygulama) / **[SCREENSHOT_NEEDED]** (gerçek ekran)

---

## SECTION 6 — Chatbot / Menü Asistanı

**1. Satış amacı**: "Müşterimin sorusu cevapsız kalmaz, personelim de her soruya tekrar tekrar cevap vermek zorunda kalmaz" düşüncesi.

**2. Problem**: Müşteri soruları personeli sürekli meşgul eder (CONTENT_STRATEGY.md madde 2).

**3. Ürün gerçeği**: Chatbot yaygın soruları yanıtlar, cevaplayamadığını raporlar (madde 1.6); personel gerektiğinde görüşmeyi devralabilir (madde 1.7) — **[Kesin]**.

**4. Ana mesaj**: Dürüst hibrit model — bot her şeyi bilmez, bilmediğini söyler; personel gerektiğinde devralır.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Soru-Cevap" düzeyinde bir etiket.
- **H2**: Hibrit model (bot + insan) başlığı.
- **Kısa açıklama**: "Bot bilmediğini söyler, personel devralır" çerçevesi.
- **2–3 destekleyici nokta**: (a) yaygın soruları yanıtlama, (b) cevaplanamayan soruları raporlama, (c) personelin görüşmeyi devralması.
- **CTA amacı**: Yok.

**6. Görsel/UI**: **Gerçek ürün ekranı hedeflenir** — gerçek chatbot konuşma arayüzü (soru + cevap + "personel devraldı" durumu). Bu repoda mevcut değil → **[TBD]**. Uygulamada kod içi animasyonlu sohbet demosu kullanılmaktadır — **[Kesin]**.

**7. Layout**: Tek odaklı, dikey sohbet balonu görünümü; metin/görsel yan yana (split) düzen önerilir, Hero'nun grid oranı buraya kopyalanmaz.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Kanıt = gerçek konuşma ekran görüntüsü (sağlandığında). "Sorularınızın %X'ini çözer" gibi sayısal kanıt kullanılmaz (doğrulanmadı).

**10. Bir sonraki section bağlantısı**: Chatbot'un devredemediği veya müşterinin doğrudan istediği bir aksiyon (garson çağırma, hesap isteme) — Section 7'ye (Garson+Hesap+Servis) doğal geçiştir; akışta SOR'dan sonra ÇAĞIR gelir (madde 3).

**11. Riskler**: "Her soruyu bilir", "%100 doğru cevap", "personelsiz çalışır" iddiaları (**kesin yasak**, CONTENT_STRATEGY.md madde 6.1).

**Durum: [Kesin]** (özellik) / **[TBD]** (gerçek ekran görseli)

---

## SECTION 7 — Garson + Hesap + Servis Paneli

**1. Satış amacı**: "Çağrılar kaybolmaz, hepsini tek ekrandan takip ederim" düşüncesi.

**2. Problem**: Garson/hesap çağrıları gözden kaçar veya geç fark edilir (CONTENT_STRATEGY.md madde 2).

**3. Ürün gerçeği**: Çağrılar Servis Paneli'ne düşer (madde 1.8); Servis Paneli sesli uyarı + masaüstü bildirim sağlar (madde 1.9) — **[Kesin]**.

**4. Ana mesaj**: Müşteri tarafındaki çağrı anı ile işletme tarafındaki panel eşleştirilir; "anında servis garantisi" verilmez — yanıt işletmenin operasyonuna bağlıdır.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Servis Paneli" düzeyinde bir etiket.
- **H2**: "Çağrılar tek ekranda toplanır" başlığı.
- **Kısa açıklama**: Sesli uyarı + masaüstü bildirim mekanizmasının kısa tarifi.
- **2–3 destekleyici nokta**: (a) garson çağrısı, (b) hesap isteği, (c) sesli/masaüstü bildirim.
- **CTA amacı**: Yok.

**6. Görsel/UI**: **Gerçek ürün ekranı hedeflenir** — müşteri tarafı (çağrı butonuna basma anı) + işletme tarafı (gerçek Servis Paneli ekranı, bildirim göstergesi). Bu repoda mevcut değil → **[TBD]**. Uygulamada kod içi animasyonlu servis akışı demosu kullanılmaktadır — **[Kesin]**.

**7. Layout**: İki-panel karşılaştırma (müşteri eylemi → işletme ekranı), aralarında nedensellik hissi veren ince bir bağlantı/ok öğesi; ayrık kart yığını değil.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Kanıt = gerçek panel ekran görüntüsü. Yanıt süresi/oranı gibi sayısal kanıt kullanılmaz (doğrulanmadı, madde 1.8).

**10. Bir sonraki section bağlantısı**: Bu etkileşimlerin ürettiği kullanım verisi doğal olarak Section 8'deki (Analytics) veri temasına bağlanır.

**11. Riskler**: "Anında servis garantisi", "asla kaçırmazsınız" gibi mutlak ifadeler (madde 1.8'e aykırı, çünkü yanıt hızı işletmeye bağlıdır).

**Durum: [Kesin]** (özellik) / **[TBD]** (gerçek ekran görseli)

---

## SECTION 8 — Analytics + Menü Mühendisliği

Bu section **iki parçadan** oluşur ve tek section olarak kalır; Menü Mühendisliği için ayrı section açılmaz.
- **8A — Analytics (İstatistikler)**: Kod taslağı mevcuttur (`qrmo-analytics-v3`), henüz `index.html`'e entegre edilmemiştir.
- **8B — Menü Mühendisliği**: **Henüz uygulanmamıştır.** Gerçek ürün kanıtı olmadan dashboard/mockup üretilmez.

**1. Satış amacı**: "Kendi verimle menümde neyin ilgi gördüğünü ve hangi ürünün gerçekten kazandırdığını görebilirim" düşüncesi.

**2. Problem**: İşletme ürün kârlılığını ve menüdeki ilgiyi net göremiyor (CONTENT_STRATEGY.md madde 2).

**3. Ürün gerçeği**:
- **8A**: `qr-menu-suite/modules/qr-analiz` — **[Kesin]**: menü görüntüleme, ürün tıklama, tekil ziyaretçi (IP bazlı), aktif masa sayısı (seçili aralıkta hareket görmüş masa), önceki döneme göre değişim, en çok / en az tıklanan ürünler (hiç tıklanmayanlar dahil), kategori dağılımı, masa bazlı kırılım. Dönem filtresi: Bugün (varsayılan) / Son 7 gün / Bu ay / Özel (en fazla 31 gün). Grafik kırılımı aralığa bağlıdır (saatlik yalnızca tek günlük aralıkta). Sepet & Sipariş verisi chatbot modülüne bağlıdır. Panel sayfa açılışında yüklenir; canlı/otomatik yenilenen bir ekran değildir. Otomatik içgörü/"sinyal" üretmez; tepe saat etiketi hesaplamaz.
- **8B**: Menü Mühendisliği işletmenin girdiği maliyet verisine dayanır (madde 1.4) — **[Kesin]**; ürün modülü `qr-menu-suite/modules/qr-menu-muhendisligi`.

**4. Ana mesaj**: "Kendi verinizle görün" — veri girişi gerektirir, veri girmeden otomatik bir sihir değildir.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Analitik" / "Veriyle Karar Verin" düzeyinde bir etiket.
- **H2**: Kendi veri + görünürlük başlığı.
- **Kısa açıklama**: Yalnızca 8A'nın doğrulanmış metriklerine dayanan alt satır; 8B uygulandığında maliyet verisi girişi şartı dürüstçe belirtilir.
- **2–3 destekleyici nokta**: (a) kullanım istatistikleri (8A), (b) ürün ve kategori ilgisi (8A), (c) menü mühendisliği görünümü ve veri girişi gerekliliği (8B — uygulanana kadar copy'de yer almaz).
- **CTA amacı**: Birincil CTA değildir.

**6. Görsel/UI**: Gerçek istatistik ekranı ve gerçek menü mühendisliği ekranı hedeflenir; bu repoda mevcut değil → **[SCREENSHOT_NEEDED]**. Yalnızca 8A'da doğrulanmış metrikler gösterilir; ürünün üretmediği metrik, içgörü veya "canlı" davranış gösterilmez. 8B için gerçek ürün kanıtı olmadan görsel üretilmez.

**7. Layout**: Tek, baskın görsel + yanında açıklama sütunu. Bu section, DESIGN_SYSTEM.md madde 1'deki "WordPress admin görünümüne benzememe" kuralı açısından **en riskli section**dır.

**8. CTA**: Birincil CTA değildir.

**9. Güven/kanıt**: Kanıt = gerçek ekran görüntüsü. Gelir/satış artışı yüzdesi **kesinlikle kullanılmaz** (madde 1.11).

**10. Bir sonraki section bağlantısı**: Veri/görünürlük teması, doğal olarak Section 9'daki (Güvenlik) "bu verinin/oturumun nasıl korunduğu" sorusuna bağlanır.

**11. Riskler**: "Otomatik kârlılık analizi" iddiası (madde 1.4'e aykırı); doğrulanmamış metrik, sahte içgörü veya "canlı veri" iddiası; 8B uygulanmadan Menü Mühendisliği'ni copy'de vaat etmek; ekran görüntüsünün WP-admin/tablo yığını hissi vermesi.

**Durum: [Kesin]** (8A metrik seti, `qr-analiz` kodundan doğrulandı) / **[Kesin]** (8B uygulanmadı) / **[SCREENSHOT_NEEDED]** (gerçek ekranlar) / **TBD** (8B sunum biçimi)

---

## SECTION 9 — Güvenlik

**Uygulama**: `sections/section-9-security.html` — statik bölüm (JS/animasyon yok). Aşağıdaki çerçeve bu uygulamanın copy'siyle birebir aynıdır.

**1. Satış amacı**: "Masa talepleri, süresi sınırlı ve dışarıdan değiştirilemeyen bir masa oturumu üzerinden işleniyor" düşüncesi. Gerçek QR bağlantısına sahip bir kişinin erişimini tamamen engellediği iddia edilmez.

**2. Problem**: Doğrudan bir günlük operasyon problemi değil; güven/itiraz giderme amaçlıdır (CONTENT_STRATEGY.md madde 10 — "masa linkim başkası tarafından kullanılabilir mi?").

**3. Ürün gerçeği** — **[Kesin]** (`qr-menu-suite`):
- **İmzalı masa oturumu**: oturum imzalıdır, dışarıdan değiştirilemez; yalnızca işletmede kayıtlı masalar için açılır (`_qmo-ortak/class-qmo-oturum.php`, `qmo_masa_gecerli_mi`).
- **Süreli oturum**: varsayılan 90 dakika toplam süre ve 30 dakika hareketsizlik süresi; işletme tarafından ayarlanabilir ("Oturum Limitleri" ekranı). Hesap talebi tamamlandığında o masanın oturumu sona erer (`qr-servis-paneli/includes/class-qrms-sp-veri.php`).
- **Talep koruması**: garson ve hesap çağrılarında bekleme süresi; siparişlerde adet ve kalem sınırı; aynı siparişin tekrar gönderilerek ikinci kez oluşması idempotency ile engellenir (`qr-chatbot/ajax-waiter-bill.php`, `qr-chatbot/rest-order.php`).
- **Yönetim tarafı**: yönetim ve personel işlemleri yetki ve doğrulama kontrollerinden geçer.

**4. Ana mesaj**: Mekanizma sade dille açıklanır: imzalı, kayıtlı masaya bağlı, süresi sınırlı oturum ve talep korumaları. Mutlak güvenlik iddiası kurulmaz.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: `QR MENU OFFICIAL • GÜVENLİK`.
- **H2**: Mekanizma temelli, sakin bir başlık ("Masa Oturumu Kontrol Altında").
- **Kısa açıklama**: Sipariş, garson ve hesap taleplerinin masaya bağlı, süresi sınırlı bir oturum üzerinden iletildiği.
- **4 destekleyici nokta**: (a) imzalı masa oturumu, (b) süreli oturum, (c) talep koruması, (d) yönetim tarafı — madde 3'teki kapsamın dışına çıkılmaz.
- **CTA amacı**: Yok.

**6. Görsel/UI**: Görsel **zorunlu değildir**; uygulamada madde başına ikon + metin kullanılır. Güvenlik dashboard'u veya sahte ekran üretilmez. Gerçek ürün ekranları vardır ancak ekran görüntüleri henüz alınmamıştır (bkz. PRODUCT_SCREEN_ASSETS.md): müşteri tarafı "Oturum Gerekli" ekranı ve yönetim tarafı "Oturum Limitleri" ekranı.

**7. Layout**: Kompakt section — ikon+metin maddeleri, dar ölçülü metin bloğu; desktop'ta başlık + 2×2 madde, ≤767'de tek kolon.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Kanıt = mekanizmanın kendisinin açıklanması (madde 3). Mutlak veya doğrulanmamış ifadeler **kesin yasak** (madde 6.4): "hacklenemez", "%100 güvenli", "sıfır risk", "başkası kullanamaz", "verileriniz güvende", "şifreli", "KVKK uyumlu", "SSL", "güvenli ödeme".

**10. Bir sonraki section bağlantısı**: Güven ve şeffaflık teması, doğal olarak Section 10'daki (Yorum/Feedback) "işletme müşteri memnuniyetsizliğini erken duyar" şeffaflığına bağlanır.

**11. Riskler**: Madde 9'daki mutlak/doğrulanmamış ifadeler; QR bağlantısına sahip birinin erişiminin tamamen engellendiğini ima etmek; sayfa kilidini (varsayılan olarak kapalı) genel bir erişim koruması gibi anlatmak; varsayılan süreleri (90/30 dakika) değiştirilemez sabitler gibi sunmak.

**Durum: [Kesin]** (özellikler ve uygulama) / **[SCREENSHOT_NEEDED]** (gerçek ekranlar, opsiyonel)

---

## SECTION 10 — Yorum / Feedback

**1. Satış amacı**: "Bir sorun olursa bunu müşteri Google'a yazmadan önce ben duyarım" düşüncesi.

**2. Problem**: Olumsuz bir deneyim, işletme haberdar olmadan doğrudan Google'a taşar (CONTENT_STRATEGY.md madde 2).

**3. Ürün gerçeği**: Feedback/yorum toplama mekanizması var; teknik detay ZIP analizinde madde 1'de ayrı bir madde olarak yer almadığından **[Tahmin]** kabul edilir. Kullanılacak çerçeve CONTENT_STRATEGY.md madde 8'de onaylanmıştır.

**4. Ana mesaj**: **"Şikâyeti Google'dan önce siz duyun."** çerçevesi; review-gating/puan manipülasyonu dili kullanılmaz.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Geri Bildirim" düzeyinde bir etiket.
- **H2**: Erken duyma çerçevesini taşıyan başlık.
- **Kısa açıklama**: Madde 8'deki onaylı çerçevenin özeti.
- **1–2 destekleyici nokta**: Section bilerek kısa/sade tutulur.
- **CTA amacı**: Yok.

**6. Görsel/UI**: Mümkünse gerçek feedback formu/akış ekranı; **zorunlu değildir**. Bu repoda mevcut değil → **[TBD]**. Yoksa sade bir form önizlemesi/soyut gösterim tercih edilir, büyük mockup gerekmez.

**7. Layout**: Kompakt, tek sütun, form-benzeri sade görünüm.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Yıldız/puan sayısı, "X işletme kullanıyor" gibi sayısal kanıt **kullanılmaz** (doğrulanmamış).

**10. Bir sonraki section bağlantısı**: Güven teması tamamlandıktan sonra, "peki bu sisteme nasıl geçerim" sorusuna — Section 11 (Kurulum).

**11. Riskler**: "Google puanınızı yükseltin", "olumsuz yorumları engelleyin", "yalnızca mutlu müşterileri gönderin" (**kesin yasak**, madde 8).

**Durum: [Muhtemel]** (çerçeve onaylı) / **[TBD]** (teknik mekanizma detayı, gerçek ekran)

---

## SECTION 11 — Kurulum / Kullanım Kolaylığı

**1. Satış amacı**: Minimal ve dürüst bir güvence — "bu sisteme geçiş karmaşık görünmüyor" (abartısız, ölçülü).

**2. Problem**: Dolaylı bir kurulum/geçiş tereddüdü; madde 2'de doğrudan bir madde olarak yer almaz.

**3. Ürün gerçeği**: **Yok / TBD.** ZIP analizinde kurulum süresi, teknik ön koşul veya onboarding akışına dair doğrulanmış bir veri bulunmuyor (CONTENT_STRATEGY.md madde 1 TBD notu, madde 6.6).

**4. Ana mesaj**: **TBD.** Hiçbir süre ("5 dakikada"), kolaylık ("kod yazmadan") veya otomasyon iddiası yazılamaz. Bu netleşene kadar yalnızca nötr bir yönlendirme ("ekibimizle görüşün" düzeyinde) kullanılabilir.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: TBD.
- **H2**: TBD — nötr bir yönlendirme başlığı (ör. "Başlamak ister misiniz?" düzeyinde, süre/kolaylık iddiası içermeyen bir çerçeve; nihai değil).
- **Kısa açıklama**: Yok/minimal.
- **Destekleyici nokta**: Yok — section bilinçli olarak hafif tutulur.
- **CTA amacı**: Yönlendirme (iletişim/görüşme); hedef TBD.

**6. Görsel/UI**: Yok, veya en fazla çok küçük bir ikon. Doğrulanmamış içerik üzerine görsel yatırımı yapılmaz.

**7. Layout**: Minimal, kısa/tek bloklu; tam section ağırlığında **değildir** (HOMEPAGE_ARCHITECTURE.md madde 11 ile uyumlu).

**8. CTA**: Amacı, kuruluma nasıl başlanacağı bilgisine yönlendirmektir; kesin hedef ve buton metni **TBD** olduğundan burada kilitlenmez/uydurulmaz.

**9. Güven/kanıt**: Yok.

**10. Bir sonraki section bağlantısı**: Kalan tereddütlerle birlikte FAQ section'ına (Section 12) geçilir.

**11. Riskler**: Herhangi bir süre/kolaylık/otomasyon iddiası (**kesin yasak**, madde 6.6); section'ı doldurmak için doğrulanmamış bir "3 adımda kurulum" gibi akış uydurmak.

**Durum: TBD**

---

## SECTION 12 — FAQ / İtirazlar

**1. Satış amacı**: CTA'ya gitmeden önce kalan itirazları dürüstçe gidermek.

**2. Problem**: Önceki tüm section'lara dair kalan şüpheler (çeviri, ödeme, chatbot kapsamı, filtreler, kârlılık analizi, güvenlik, yorum gizleme, kurulum).

**3. Ürün gerçeği**: CONTENT_STRATEGY.md madde 10'daki 8 itiraz kalıbının tamamı — **[Kesin]** (kurulum itirazı hariç, o **TBD**).

**4. Ana mesaj**: Her soru, madde 1'deki gerçeğe dürüstçe bağlanır; gerçeği yumuşatan belirsiz cevaplar verilmez.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Sıkça Sorulanlar" düzeyinde bir etiket.
- **H2**: Basit, iddiasız bir başlık.
- **Kısa açıklama**: Yok/gerekmiyor.
- **Destekleyici içerik**: Madde 10'daki 8 soru-cevap çiftinin accordion yapısı (bu "destekleyici nokta" değil, section'ın kendisidir).
- **CTA amacı**: Yok (accordion içindeki mikro-yönlendirmeler section'ın birincil CTA'sı sayılmaz).

**6. Görsel/UI**: Yok; standart liste/accordion yeterlidir, görsel gerekmez.

**7. Layout**: Tek sütun, dar ölçülü (narrow measure), yüksek okunabilirlik; büyük görsel/mockup yok.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Her cevabın kendisi dürüstlük/şeffaflık kanıtıdır.

**10. Bir sonraki section bağlantısı**: Tüm tereddütler giderildikten sonra tek kalan adım Section 13'teki (Son CTA) nihai eylemdir.

**11. Riskler**: Belirsiz/kaçamak cevaplar vermek; kurulum sorusuna doğrulanmamış bir süre/kolaylık cevabı uydurmak (madde 6.6'ya aykırı olur).

**Durum: [Kesin]** (çerçeve) / **TBD** (kurulum itirazının cevabı)

---

## SECTION 13 — Son CTA

**1. Satış amacı**: Sayfa boyunca kurulan güveni tek, net bir sonraki adıma yönlendirmek.

**2. Problem**: Yok — bu bir aksiyon/karar anıdır, kararsızlığı gidermeye yöneliktir.

**3. Ürün gerçeği**: Yok — bu bir özellik section'ı değildir.

**4. Ana mesaj**: Net, dürüst, tek eylem; sahte aciliyet yok. Hedef **TBD**.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: Opsiyonel, kısa bir kapanış etiketi.
- **H2**: Kapanış cümlesi (yer tutucu, nihai değil).
- **Kısa açıklama**: Kısa bir güven hatırlatması (ör. akışın/gerçek ürünün bir kez daha kısaca anılması).
- **Destekleyici nokta**: Yok / en fazla 1.
- **CTA amacı**: Ziyaretçiyi tek, net bir sonraki adıma (demo talebi / canlı örnek / satış görüşmesi) yönlendirmek; kesin hedef **TBD**.

**6. Görsel/UI**: Opsiyonel, hafif bir kapanış görseli veya salt tipografik kapanış; Hero'nun tekrarı değildir ama aynı marka dilini (DESIGN_SYSTEM.md madde 1) taşır.

**7. Layout**: Kompakt, ortalanmış, güçlü kontrast; büyük bir grid'e ihtiyaç duymaz.

**8. CTA**: Gerekiyor — sayfanın birincil, tek CTA'sı burada en güçlü haliyle tekrarlanır (DESIGN_SYSTEM.md madde 8: section başına 1 primary buton). Kesin hedef/buton metni **TBD** (CONTENT_STRATEGY.md madde 9) — bu netleşmeden final metin yazılmaz.

**9. Güven/kanıt**: Gerekmiyor; kanıtlar önceki section'larda zaten sunuldu.

**10. Bir sonraki section bağlantısı**: Yok — sayfanın son section'ıdır (footer bu dosyanın kapsamı dışındadır).

**11. Riskler**: Sahte aciliyet ("sınırlı süre", "bugün kaydolun" gibi); CTA hedefi netleşmeden kesin bir self-servis akış varsayımıyla buton metni yazmak.

**Durum: [Muhtemel]** (section'ın varlığı ve tekilliği) / **TBD** (CTA'nın kesin hedefi)

---

## Genel Uygulama Notu

Bu 13 section blueprint'i, HTML/CSS/JS üretimine geçildiğinde şu sırayla kontrol edilir: önce bu dosyadaki içerik hiyerarşisi ve görsel gereksinim, sonra `CONTENT_STRATEGY.md`'deki ilgili madde (gerçeklik/copy sınırı), sonra `DESIGN_SYSTEM.md`'deki ilgili görsel token/kural. **[TBD]** olarak işaretli gerçek ürün ekranı asset'leri sağlanmadan ilgili section'ların görsel kısmı kodlanmaz; yerine geçici/sahte bir ekran görüntüsü üretilmez.
