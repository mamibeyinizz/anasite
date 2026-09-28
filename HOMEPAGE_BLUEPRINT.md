# Homepage Content + Visual Blueprint — QR Menu Official

Bu doküman, `HOMEPAGE_ARCHITECTURE.md`'deki 12 section'lık gerçek/planlı homepage akışını (Section 1–10 uygulanmış, 11–12 planlı) temel alarak her section için **içerik yapısı** ve **görsel/UI blueprint**'i tanımlar.

Bu dosya:
- Nihai pazarlama metni **değildir** — yalnızca içerik hiyerarşisi (kicker/H2/açıklama/destekleyici nokta/CTA amacı) tanımlar.
- HTML/CSS/JS içermez.
- `DESIGN_SYSTEM.md`, `CONTENT_STRATEGY.md`, `HOMEPAGE_ARCHITECTURE.md` dosyalarını değiştirmez; onlara aykırı hiçbir karar içermez.
- Etiket sistemi: **[Kesin]**, **[Muhtemel]**, **[Tahmin]**, **TBD**.

**Section sırası notu**: Section 1–10 homepage'de uygulanmıştır (kod: `dcaeec9`, branch `claude/qr-menu-section-9-strategy-eircho`); `main` eski Hero-only durumdadır (`aabf2f0`). Section 11 (FAQ) ve Section 12 (Son CTA) **planlıdır, uygulanmamıştır**. **Yorum / Feedback** akış sırasına zorlanmamıştır: planlı, mevcut akıştaki yeri henüz belirlenmemiştir (dosya sonundaki "Planlı — Yorum / Feedback" notu). **Güvenlik** artık homepage section'ı değildir; eski blueprint'i dosya sonunda arşiv notu olarak tutulur (`sections/section-9-security.html` arşiv kaynaktır). Önceki sürümlerdeki Problem ve Çözüm section'ları mevcut homepage akışında yer almaz (bkz. HOMEPAGE_ARCHITECTURE.md madde 0.1, 0.2).

**Genel not — gerçek ürün ekranı asset durumu**: Bu repodaki `assets/product/` klasörlerinde henüz section'lara eşlenmiş gerçek ekran görüntüsü yoktur (yalnızca `.gitkeep` ve `menu/` altında eşlenmemiş tek bir `.webp` dosyası). Section 9 (Geçiş Kararı) ve Section 10 (Kurulum) bilinçli olarak ekransız, statik bölümlerdir. Aşağıda "gerçek ürün ekranı zorunlu" denen her yerde, özelliğin kendisi ürün gerçeği olarak **[Kesin]** olsa bile, o ekranın **görsel asset'i bu repoda henüz mevcut değildir** — bu, ilgili section'ın görsel kısmı için ayrıca **[TBD]** olarak işaretlenmiştir. Gerçek ekran görüntüsü sağlanmadan hayali/sahte bir dashboard **üretilmeyecektir**.

---

## SECTION 1 — Hero

**1. Satış amacı**: Ziyaretçi "bu sadece bir QR kod menüsü değil, restoranımın müşteri etkileşimini ve operasyonunu tek yerde toplayan bir sistem" düşüncesine ulaşmalı.

**2. Problem**: Doğrudan işlenmez; Hero bir problem sahnesi değil, konumlandırma anıdır. Problemler ilgili modül section'larında (3–8) ele alınır.

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

**9. Güven/kanıt**: Masa oturumu güvenliği bu section'da ele alınmaz; güvenlik konusu FAQ'de (Section 11, planlı) cevaplanır.

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

---

## SECTION 8 — Analytics (+ Menü Mühendisliği — uygulanmadı)

Bu section **iki parçadan** oluşur ve tek section olarak kalır; Menü Mühendisliği için ayrı section açılmaz.
- **8A — Analytics (İstatistikler)**: **Uygulanmış ve entegre** — `qrmo-analytics-v3`, `sections/section-8-analytics.html` (`1eee24a`). Dashboard maketi kod içi dekoratif bir demodur ve **"Örnek veri"** etiketi taşır; gerçek ekran görüntüsü ya da gerçek işletme verisi değildir.
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

**6. Görsel/UI**: Uygulamada dekoratif, "Örnek veri" etiketli kod içi dashboard demosu vardır. Gerçek istatistik ekranı ve gerçek menü mühendisliği ekranı hedeflenir; bu repoda mevcut değil → **[SCREENSHOT_NEEDED]**. Yalnızca 8A'da doğrulanmış metrikler gösterilir; ürünün üretmediği metrik, içgörü veya "canlı" davranış gösterilmez. 8B için gerçek ürün kanıtı olmadan görsel üretilmez.

**7. Layout**: Tek, baskın görsel + yanında açıklama sütunu. Bu section, DESIGN_SYSTEM.md madde 1'deki "WordPress admin görünümüne benzememe" kuralı açısından **en riskli section**dır.

**8. CTA**: Birincil CTA değildir.

**9. Güven/kanıt**: Kanıt = gerçek ekran görüntüsü. Gelir/satış artışı yüzdesi **kesinlikle kullanılmaz** (madde 1.11).

**10. Bir sonraki section bağlantısı**: Veri teması, Section 9'daki (Geçiş Kararı) "kendi işletmemde ne değişir" sorusuna bağlanır.

**11. Riskler**: "Otomatik kârlılık analizi" iddiası (madde 1.4'e aykırı); doğrulanmamış metrik, sahte içgörü veya "canlı veri" iddiası; 8B uygulanmadan Menü Mühendisliği'ni copy'de vaat etmek; ekran görüntüsünün WP-admin/tablo yığını hissi vermesi.

**Durum: [Kesin]** (8A uygulanmış; metrik seti `qr-analiz` kodundan doğrulandı) / **[Kesin]** (8B uygulanmadı) / **[SCREENSHOT_NEEDED]** (gerçek ekranlar) / **TBD** (8B sunum biçimi)

---

## SECTION 9 — Geçiş Kararı

**Uygulama**: `qrmo-transition-v1` — `sections/section-9-transition.html` (`3fc368e`). Aşağıdaki çerçeve **Geçiş Kararı Rev. 2** blueprint'idir ve uygulanan copy ile uyumludur. Bu section eski Güvenlik section'ının yerini almıştır (arşiv notu için dosya sonuna bakın).

**1. Satış amacı**: "Mevcut yöntemimden QR Menu Official'a geçersem işletmemde ne değişecek?" sorusunu cevaplamak; S1–S8'de ürünü gören işletme sahibine "değiştirmeye değer mi?" kararını kendi günlük operasyonu üzerinden verdirmek. S9 = "Değiştirmeye değer mi?", S10 = "Nasıl başlarım?".

**2. Problem**: Özellikleri gören ziyaretçinin "kendi işletmemde ne değişir, personelim ne yapacak, düzenim bozulur mu" belirsizliği.

**3. Ürün gerçeği** — yeni özellik anlatılmaz; doğrulanmış davranışlar operasyonel anlar olarak yeniden çerçevelenir — **[Kesin]** (CONTENT_STRATEGY.md madde 1.1, 1.2, 1.5–1.9): garson/hesap talebi masa bilgisiyle servis akışına iletilir; fiyat panelden güncellenir ve masadaki QR aynı kalabilir; ürün "tükendi" olarak işaretlenebilir; ürün bilgisi/filtreler/Menü Asistanı ile bilgiye ulaşılabilir (girilen veriye bağlı); menü işletmenin girdiği dillerde görüntülenir.

**4. Ana mesaj**: "Düzeniniz aynı kalır. İş akışınız değişir." Karşılaştırma birimi özellik değil **operasyonel andır** (ne oluyor / yük kimde / QR Menu Official ile ne değişiyor). Rakam, ROI, yüzde, süre, sosyal kanıt, rakip kıyası, aciliyet/kıtlık dili yoktur.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: `QR MENU OFFICIAL • GEÇİŞ KARARI`.
- **H2**: "Düzeniniz aynı kalır. İş akışınız değişir."
- **Kısa açıklama**: "Servisi yine ekibiniz yapar, ödemeyi yine bugünkü gibi alırsınız. Değişen, günlük işlerin yapılış biçimi: fiyatı güncellemek, yabancı bir masaya menü sunmak, bir talebi fark etmek."
- **Dönüşüm akışı — 5 operasyonel an (sırayla)**: (1) Garson / hesap talebi, (2) Fiyat değiştiğinde, (3) Ürün tükendiğinde, (4) Ürün / alerjen sorusu, (5) Yabancı müşteri geldiğinde. Her an: **Bugün → QR Menu Official ile**, "Yük:" etiketiyle. Menü hareketleri/analitik satırı **yoktur** (S8 zaten anlatır); garson/hesap satırında "sipariş" kelimesi geçmez.
- **"Neler aynı kalır?" — 4 madde**: servisi yine ekip yapar; menü işletmenin kontrolünde; ödeme bugünkü yöntemle alınır; asistan bilmediğini personele bırakır.
- **"Geçiş için gerekenler" — 3 madde**: menünün sisteme aktarılması; QR kodların masalara yerleştirilmesi; ekibin talepleri servis panelinden takip etmesi (kimin yaptığı belirtilmez — **TBD**).
- **CTA amacı**: Tek birincil CTA (madde 8).

**6. Görsel/UI**: Model B — dönüşüm akışı (Bugün → QR Menu Official ile). Kart, gölge, ikon grid, mockup, dashboard yoktur. "Bugün" tarafı soluk, "ile" tarafı vurgulu tipografi; anlar arası ince ayırıcı, gold ok/çizgi.

**7. Layout**: Desktop: başlık bloğu (max ~720px) → 5 anlık akış (tam genişlik, yatay Bugün → ile) → iki kolonlu alt blok ("Neler aynı kalır?" | "Geçiş için gerekenler") → CTA. Mobil: her an dikey (an etiketi → Bugün → ↓ → QR Menu Official ile); alt bloklar alt alta; CTA tam genişlik. Spacing: padding desktop 70/50, ≤900 60/60, ≤767 45/55 (≤480 aynı); gutter %5 / 20px / 16px; S8→S9 boşluğu 120 / 120 / 100px. Animasyon: bir kez çalışan scroll reveal (IntersectionObserver, hepsi açılınca `disconnect`); JS kapalıyken ve `prefers-reduced-motion` altında içerik doğrudan görünür; scroll listener, loop, carousel yoktur.

**8. CTA**: Gerekiyor — tek birincil CTA: **"Geçiş İçin Bilgi Alın"**. **Hedef TBD**: uygulanan kodda `href` yoktur (`data-cta-target="TBD"`); hedef URL/WhatsApp/form/demo bağlantısı uydurulmaz, `href="#"` ve S10 çapası kullanılmaz. CTA alt açıklaması hedef belli olunca yazılır (yanıt süresi vaadi yazılmaz). **Hedef bağlanmadan yayına alınmamalıdır.**

**9. Güven/kanıt**: Kanıt = ürünün gerçek davranışı ve "neler aynı kalır" güvenceleri. Sosyal kanıt, testimonial, sahte müşteri/istatistik, ROI ve rakip kıyası **kesin yasak**. Yasak ifadeler: "personel ihtiyacını azaltır", "maliyeti düşürür", "her soruya doğru cevap verir", "anında servis".

**10. Bir sonraki section bağlantısı**: "Geçiş için gerekenler" → Section 10 (Kurulum) bunların **nasıl** yapıldığını gösterir; S9 bunları tekrar etmez.

**11. Riskler**: S8'in (analitik) veya S1–S8 özelliklerinin tekrarı; "hiçbir şey değişmiyor" okuması (alt açıklama dengeler); doğrulanmamış süre/kolaylık/tasarruf iddiası; CTA hedefi bağlanmadan yayın.

**Durum: [Kesin]** (uygulama ve ürün davranışları) / **TBD** (CTA hedefi ve CTA alt açıklaması)

---

## SECTION 10 — Kurulum

**Uygulama**: `qrmo-setup-v1` — `sections/section-10-installation.html` (`dcaeec9`). Aşağıdaki çerçeve **Kurulum Rev. 1** blueprint'inin kilitlenmiş halidir. Statik HTML + CSS; JS ve animasyon yoktur.

**1. Satış amacı**: "Nasıl başlarım?" sorusunu cevaplamak: başlangıcın sınırlı sayıda adımdan oluştuğunu, her adımda ne yapıldığını ve sonunda ne elde edildiğini göstermek — süre veya kolaylık vaadi vermeden. Section 9'un "geçiş için gerekenler" maddelerini kelimesi kelimesine tekrar etmez; **nasıl** gerçekleştiklerini anlatır.

**2. Problem**: "Başlamak nereden, ne kadar iş" belirsizliği (kurulum korkusu).

**3. Ürün gerçeği** — 4 adım, her biri İşlem → Çıktı:
- **01 Menü**: ürünler ürün düzenleme ekranında eklenir → QR ile açılan menü; fiyat/açıklama/"tükendi" tek yerden güncellenir — **[Kesin]**.
- **02 Ürün bilgileri ve diller**: besin değeri, acılık, alerjen girilir; diller CSV ile ya da elle eklenir → filtreler girilen bilgilerle çalışır, menü eklenen dillerde görüntülenir — **[Kesin]** (madde 1.1, 1.5). "İsteğe bağlı" ifadesi kullanılmaz (menünün bu bilgiler olmadan çalıştığı tam doğrulanmadı).
- **03 Masalar ve QR**: masalar tek tek ya da numaralı toplu oluşturulur, masa başına ayrı QR hedefi → QR'lar tek tek PNG ya da tüm masalar tek PDF olarak alınır — **[Muhtemel]** (S4 metninden; genişletilmez).
- **04 Servis ekranı ve deneme**: Servis Paneli personelin kullanacağı cihazda açık tutulur; bir masanın QR'ı okutularak garson çağrısı ile akış sınanabilir → talep masa bilgisiyle panelde görünür, sesli uyarı ve masaüstü bildirimiyle duyurulur — **[Kesin]** (madde 1.8, 1.9). "İlk gün" gibi zaman varsayımı yoktur.

**4. Ana mesaj**: "Kurulum, yönetim panelinde yapılan birkaç işlemden oluşur." Süre, "kolay", "zahmetsiz", "tek tık", "otomatik kurulum", "biz kuruyoruz", "teknik bilgi gerekmez" ifadeleri **kesin yasak**. Metinler öznesizdir (kimin yaptığı **TBD**).

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: `QR MENU OFFICIAL • KURULUM`.
- **H2**: "Menüden ilk talebe: başlangıç sırası."
- **Kısa açıklama**: "Kurulum, yönetim panelinde yapılan birkaç işlemden oluşur. Her adımda neyin girildiğini ve sonunda elinizde ne olduğunu aşağıda görebilirsiniz."
- **4 adım**: 01 Menü, 02 Ürün bilgileri ve diller, 03 Masalar ve QR, 04 Servis ekranı ve deneme. Her adımda "İŞLEM" ve "ÇIKTI" ayrımı.
- **"Başlamadan önce" bloğu**: **bilinçli olarak yoktur** (WordPress ön koşulu, hesap açılışı, kimin kurduğu, API anahtarı, lisans/paket aktivasyonu doğrulanmadığı için görsel olarak bile ima edilmez).
- **CTA amacı**: Yok.

**6. Görsel/UI**: Yatay adım rayı: adımları birbirine bağlayan ince gold süreç çizgisi ve noktalar; kart, kutu, gölge, mockup, dashboard, sahte ekran yoktur. Renkler: `#0D2B22` / `#C9A84C` / `#E8C766` / `#303933`.

**7. Layout**: ≥1101px 4 kolon; ≤1100px 2×2; ≤767px tek kolon (çizgi dikey bağlayıcıya döner). Spacing: padding desktop 70/50, ≤900 60/60, ≤767 45/55 (≤480 aynı); gutter %5 / 20px / 16px; S9→S10 boşluğu 120 / 120 / 100px. S10→S11 boşluğu **varsayımdır** (S11 kodlanmadı): S11'in üst padding'i S10'un alt padding'iyle aynı kalıbı izlerse 120 / 120 / 100px.

**8. CTA**: Gerekmiyor — birincil CTA Section 9'da ve (planlı) Section 12'dedir.

**9. Güven/kanıt**: Kanıt = adımların ve çıktıların kendisi. Sosyal kanıt, rakam, ROI, rakip kıyası yoktur. Animasyon yoktur (statik); "progress bar" gibi süre vaadi çağrıştıran öğeler yasak.

**10. Bir sonraki section bağlantısı**: Kalan tereddütler Section 11'de (FAQ, planlı) ele alınır.

**11. Riskler**: Süre/kolaylık/otomasyon iddiası (CONTENT_STRATEGY.md madde 6.6); S9'daki üç "gerekenler" cümlesini tekrar etmek; 03. adımdaki [Muhtemel] ayrıntıları kesin gerçekmiş gibi genişletmek; "Başlamadan önce" bloğunu doğrulanmadan eklemek.

**Durum: [Kesin]** (uygulama; adım 01, 02, 04) / **[Muhtemel]** (adım 03) / **TBD**: kurulumu kimin yaptığı, süre, WordPress ön koşulu, hesap/lisans/paket aktivasyonu, Menü Asistanı için API anahtarı, toplu ürün içe aktarma, personelin panele erişim yolu

---

## SECTION 11 — FAQ / İtirazlar (planlı)

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

**10. Bir sonraki section bağlantısı**: Tüm tereddütler giderildikten sonra tek kalan adım Section 12'deki (Son CTA) nihai eylemdir.

**11. Riskler**: Belirsiz/kaçamak cevaplar vermek; kurulum sorusuna doğrulanmamış bir süre/kolaylık cevabı uydurmak (madde 6.6'ya aykırı olur).

**Not — [Kesin]**: Güvenlik section'ı akıştan çıktığı için "masa linkim başkası tarafından kullanılabilir mi?" itirazı (CONTENT_STRATEGY.md madde 10) artık yalnızca bu section'da cevaplanır; cevap madde 1.10'daki gerçeğe bağlıdır (arşiv notundaki mekanizma listesi kaynak olarak kullanılabilir). Section 10'da doğrulanmamış bırakılan kurulum konuları (kimin kurduğu, süre, WordPress ön koşulu, hesap/lisans/paket, API anahtarı, toplu ürün içe aktarma, personel erişimi) doğrulanana kadar burada da cevaplanmaz.

**Durum: Planlı — uygulanmadı.** **[Kesin]** (çerçeve) / **TBD** (kurulum itirazının cevabı)

---

## SECTION 12 — Son CTA (planlı)

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

**Not**: Section 9'un CTA'sıyla ("Geçiş İçin Bilgi Alın", hedef TBD) aynı hedefe bağlanması **[Muhtemel]** beklenir; hedef doğrulanmadan bağlanmaz.

**Durum: Planlı — uygulanmadı.** **[Muhtemel]** (section'ın varlığı ve tekilliği) / **TBD** (CTA'nın kesin hedefi)

---

## Planlı — Yorum / Feedback (mevcut akıştaki yeri henüz belirlenmedi)

**Durum — [Kesin]**: **Planlı — mevcut akıştaki yeri henüz belirlenmedi.** Bu kayıt homepage sırasında bir section değildir ve numaralandırılmamıştır. Hiç kodlanmamıştır; "çıkarıldı", "ertelendi" ya da "gerekli değil" yönünde açık bir karar yoktur ve **"çıkarıldı" olarak işaretlenmemiştir**. Ürün modülü mevcuttur (`qr-menu-suite/modules/yorum-feedback`); anlatı çerçevesi CONTENT_STRATEGY.md madde 8'dir. Section 2'deki "Geri Bildirim Yönetimi" kartı bir ürün özelliği kartıdır, ayrı bir Feedback section'ı yerine geçmez. Aşağıdaki blueprint planlanan içeriğin kaydıdır.

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

**10. Bir sonraki section bağlantısı**: Akıştaki yeri belirlenmediği için bağlanacağı section de belirlenmemiştir.

**11. Riskler**: "Google puanınızı yükseltin", "olumsuz yorumları engelleyin", "yalnızca mutlu müşterileri gönderin" (**kesin yasak**, madde 8).

**Durum: [Muhtemel]** (çerçeve onaylı) / **[TBD]** (teknik mekanizma detayı, gerçek ekran)

---

## Arşiv — Güvenlik (eski Section 9 blueprint'i; homepage section'ı değil)

**Uygulama (arşiv)**: `sections/section-9-security.html` — statik bölüm (JS/animasyon yok). **Aktif homepage section'ı değildir:** `1f87b17` ile eklenmiş, `3fc368e` ile `index.html`'de yerine Geçiş Kararı konmuştur; dosya yetim/arşiv kaynak olarak durur ve `index.html` onu kullanmaz. Çıkarma proje sahibinin kararıdır (satış açısından gerekli görülmedi); commit mesajlarında gerekçe yazılı değildir. Aşağıdaki çerçeve arşiv kaydıdır; aktif blueprint olarak kullanılmaz. Ürün gerçeği (madde 1.10) ve madde 6.4 iddia sınırları geçerliliğini korur; içerik Section 11'de (FAQ, planlı) cevap kaynağıdır.

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

**10. Bir sonraki section bağlantısı**: Yok — section akıştan çıkarılmıştır.

**11. Riskler**: Madde 9'daki mutlak/doğrulanmamış ifadeler; QR bağlantısına sahip birinin erişiminin tamamen engellendiğini ima etmek; sayfa kilidini (varsayılan olarak kapalı) genel bir erişim koruması gibi anlatmak; varsayılan süreleri (90/30 dakika) değiştirilemez sabitler gibi sunmak.

**Durum: [Kesin]** (özellikler ve uygulama) / **[SCREENSHOT_NEEDED]** (gerçek ekranlar, opsiyonel)

---

## Genel Uygulama Notu

Bu 12 section'lık blueprint (Section 1–10 uygulanmış, 11–12 planlı), HTML/CSS/JS üretimine geçildiğinde şu sırayla kontrol edilir: önce bu dosyadaki içerik hiyerarşisi ve görsel gereksinim, sonra `CONTENT_STRATEGY.md`'deki ilgili madde (gerçeklik/copy sınırı), sonra `DESIGN_SYSTEM.md`'deki ilgili görsel token/kural. **[TBD]** olarak işaretli gerçek ürün ekranı asset'leri sağlanmadan ilgili section'ların görsel kısmı kodlanmaz; yerine geçici/sahte bir ekran görüntüsü üretilmez.
