# Homepage Content + Visual Blueprint — QR Menu Official

Bu doküman, `HOMEPAGE_ARCHITECTURE.md`'deki 12 section'ı temel alarak her section için **içerik yapısı** ve **görsel/UI blueprint**'i tanımlar.

Bu dosya:
- Nihai pazarlama metni **değildir** — yalnızca içerik hiyerarşisi (kicker/H2/açıklama/destekleyici nokta/CTA amacı) tanımlar.
- HTML/CSS/JS içermez.
- `DESIGN_SYSTEM.md`, `CONTENT_STRATEGY.md`, `HOMEPAGE_ARCHITECTURE.md` dosyalarını değiştirmez; onlara aykırı hiçbir karar içermez.
- Etiket sistemi: **[Kesin]**, **[Muhtemel]**, **[Tahmin]**, **TBD**.

**Genel not — gerçek ürün ekranı asset durumu**: Bu repodaki `assets/` klasörü şu an boştur (yalnızca `.gitkeep`). Aşağıda "gerçek ürün ekranı zorunlu" denen her yerde, özelliğin kendisi ürün gerçeği olarak **[Kesin]** olsa bile, o ekranın **görsel asset'i bu repoda henüz mevcut değildir** — bu, ilgili section'ın görsel kısmı için ayrıca **[TBD]** olarak işaretlenmiştir. Gerçek ekran görüntüsü sağlanmadan hayali/sahte bir dashboard **üretilmeyecektir**.

---

## SECTION 1 — Hero

**1. Satış amacı**: Ziyaretçi "bu sadece bir QR kod menüsü değil, restoranımın müşteri etkileşimini ve operasyonunu tek yerde toplayan bir sistem" düşüncesine ulaşmalı.

**2. Problem**: Doğrudan işlenmez; Hero bir problem sahnesi değil, konumlandırma anıdır. Problem Section 2'ye bırakılır.

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

**10. Bir sonraki section bağlantısı**: Hero "ne olduğunu" anlatır ama "neden ihtiyacım var" sorusunu açık bırakır; bu soru Section 2'deki somut problem sahnesiyle kapanır.

**11. Riskler**: Abartı dili ("devrim", "kusursuz"); feature-row'un 4'ten fazla öğeye çıkıp feature-card kalabalığına dönüşmesi (DESIGN_SYSTEM.md madde 1 yasağı); genel SaaS/ajans tonuna kayma.

**Durum: [Kesin]** (Hero V3 zaten mevcut production kodu ve akışla uyumlu; CTA hedefi ayrıca **TBD**)

---

## SECTION 2 — Problem: Restoranın Günlük Sorunu

**1. Satış amacı**: Ziyaretçi "bu tam olarak benim işletmemde yaşadığım bir gün" demeli.

**2. Problem**: CONTENT_STRATEGY.md madde 2'deki envanterden öncelikli 2-3 tanesi: personel meşguliyeti (soru trafiği), kaçan/geç fark edilen çağrılar, menü güncelleme yükü.

**3. Ürün gerçeği**: Bu section'da özellik tanıtılmaz; yalnızca problem sahnesi kurulur. Dayanak: madde 1.6, 1.7 (chatbot/personel), 1.8 (çağrılar), 1.3 (menü/kampanya güncelleme).

**4. Ana mesaj**: Somut, tanınabilir, günlük bir operasyonel an; dramatize edilmemiş, rakamsız.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: Sahneyi çerçeveleyen kısa bir etiket (ör. "tanıdık bir an" düzeyinde bir çerçeve; nihai değil).
- **H2**: Problemi tek cümlede özetleyen başlık (yer tutucu, final değil).
- **Kısa açıklama**: Sahneyi somutlaştıran 1-2 cümlelik anlatım.
- **2–3 destekleyici nokta**: Madde 2 tablosundan seçilen 2-3 problem satırının kısa ifadeleri.
- **CTA amacı**: Yok — bu section'da CTA erken karar baskısı yaratır.

**6. Görsel/UI**: Gerçek ürün ekranı **zorunlu değildir** — bu bir "önce" sahnesidir, ürün henüz gösterilmez. Sade/editorial bir görsel (ör. soyutlanmış, aşırı detaylandırılmamış bir sahne) veya salt tipografik bir yaklaşım tercih edilebilir. Sahte "kaotik/panik restoran" illüstrasyonu SaaS klişesi sayılır ve kullanılmaz (DESIGN_SYSTEM.md madde 1).

**7. Layout**: Hero'nun koyu/geniş grid yapısının aksine, burada dar ölçülü (narrow measure), tek sütun bir metin bloğu ve bol whitespace uygundur. Zemin tonu Hero'nun koyu (deep forest) zemininden görsel olarak ayrışan, daha sakin/nötr bir yüzey önerilir — kesin renk DESIGN_SYSTEM.md'de TBD olduğundan burada da netleştirilemez, yalnızca kontrast önerisi.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Gerekmiyor — bu bir empati/tanıma anıdır, henüz kanıt sunulmaz.

**10. Bir sonraki section bağlantısı**: Problemin işletmeye etkisi ima edilerek, "bunların hepsi tek bir sistemde toplanıyor" çözüm özetine (Section 3) geçilir.

**11. Riskler**: Korku pazarlaması / abartılı dramatizasyon; rakamsal iddia ("işletmelerin %60'ı..." gibi) kullanmak — kesinlikle yasak.

**Durum: [Muhtemel]** (problem envanteri madde 1'den türetilmiştir, doğrudan anketle doğrulanmamıştır)

---

## SECTION 3 — Çözüm: Akış Özeti

**1. Satış amacı**: "Bu dağınık araçlar değil, tek bir uçtan uca sistem" düşüncesi.

**2. Problem**: Section 2'deki dağınıklık/kontrolsüzlük hissine karşılık verir.

**3. Ürün gerçeği**: CONTENT_STRATEGY.md madde 3'teki 7 adımlı akışın tamamı: QR → MENÜ → SEÇ → SOR → ÇAĞIR → SERVİS → ÖĞREN — **[Kesin]**.

**4. Ana mesaj**: "Bir kere kurulur, uçtan uca işler" çerçevesi; akışın bütünlüğü vurgulanır, tek tek özellik satışı yapılmaz.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Nasıl işler" düzeyinde bir çerçeve etiketi.
- **H2**: Akışın bütünlüğünü vurgulayan tek cümlelik başlık.
- **Kısa açıklama**: 7 adımı tek cümlede özetleyen bağlayıcı ifade.
- **Destekleyici içerik**: Klasik "destekleyici nokta" listesi değil, 7 adımın kendisi (akış diyagramının etiketleri) — madde 3 tablosundaki adlandırma setlerinden biri tutarlı şekilde kullanılır.
- **CTA amacı**: Yok.

**6. Görsel/UI**: Akış diyagramı — bu kavramsal bir süreç görselleştirmesidir, gerçek ürün ekranı zorunlu değildir. Opsiyonel olarak her adımın yanında küçük, gerçek bir UI ipucu (mini ikon/kırpılmış gerçek ekran parçası) kullanılabilir; bu opsiyonel öğeler için de gerçek görsel yoksa uydurulmaz, boş/nötr bırakılır.

**7. Layout**: Yatay/aşamalı bir stepper (7 durak); mobilde tek sütun dikey akışa döner (DESIGN_SYSTEM.md madde 12 genel mobile-first ilkesi — Hero'nun spesifik grid oranı buraya kopyalanmaz).

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Gerekmiyor; kanıt niteliği akışın kendisinin somutluğundan gelir.

**10. Bir sonraki section bağlantısı**: Akıştaki "MENÜ/SEÇ" adımı vurgulanarak Section 4'e (Menü Yönetimi) doğal geçiş sağlanır.

**11. Riskler**: 7 adımı ayrık kartlar halinde dizip klasik feature-grid'e dönüştürmek (DESIGN_SYSTEM.md madde 9 kart yasağı); adım isimlerini (SEÇ/ÇAĞIR/ÖĞREN vs. Keşif/Garson-Hesap/Analiz) aynı section içinde karıştırmak.

**Durum: [Kesin]** (akışın kendisi) / **[Muhtemel]** (bu sunum biçimi)

---

## SECTION 4 — Menü Yönetimi & Akıllı Menü Deneyimi

**1. Satış amacı**: "Menümü kolayca güncelleyebilirim, müşteri de aradığını kolayca bulabilir" düşüncesi.

**2. Problem**: Menü güncelleme yükü, çok dilli müşteriye hizmet, diyet/alerjen kısıtlaması olan müşteriye doğru ürünü gösterme zorluğu (CONTENT_STRATEGY.md madde 2).

**3. Ürün gerçeği**: Filtreler ilgili ürün bilgisinin girilmesine bağlıdır (madde 1.5); çoklu dil CSV/veritabanı/manuel çeviri girişiyle çalışır (madde 1.1, madde 6.3) — **[Kesin]**.

**4. Ana mesaj**: "Siz girersiniz/tanımlarsınız, sistem düzenli ve erişilebilir şekilde sunar" — hem yönetim (işletme) hem deneyim (müşteri) tarafı aynı çerçevede.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Menü Yönetimi" düzeyinde bir etiket.
- **H2**: Yönetim kolaylığı + müşteri deneyimini birleştiren başlık.
- **Kısa açıklama**: Filtrelerin ve çoklu dilin veri girişine dayandığını dürüstçe belirten alt satır.
- **2–4 destekleyici nokta**: (a) fiyat/ürün güncelleme, (b) alerjen/diyet filtreleri, (c) çoklu dil desteği (CSV/manuel), (d) opsiyonel: görsel/menü sunumu.
- **CTA amacı**: Gerekirse yalnızca ikincil/düşük vurgulu ("örnek menüyü incele" düzeyinde); section'ın birincil CTA'sı değildir.

**6. Görsel/UI**: **Gerçek ürün ekranı zorunlu** — (a) gerçek müşteri menü arayüzü (filtre çipleri, dil seçici gibi gerçek UI elemanlarıyla) ve (b) gerçek admin menü düzenleme ekranı. Bu ikisi de bu repoda henüz mevcut değil → **[TBD]** (asset sağlanmalı; sağlanana kadar hayali dashboard/menü ekranı üretilmez).

**7. Layout**: İki taraflı (split) bir düzen — bir yanda işletme/admin tarafı, diğer yanda müşteri deneyimi tarafı; DESIGN_SYSTEM.md madde 5'teki "grid anlam ilişkisini yansıtır" ilkesine uygun ama oran/padding bu section için ayrıca belirlenmelidir (Hero'nun 1.08/0.92 oranı otomatik kopyalanmaz).

**8. CTA**: Section'ın birincil CTA'sı değil; gerekiyorsa yalnızca düşük vurgulu bir keşif eylemi.

**9. Güven/kanıt**: Kanıt, gerçek ekran görüntüsünün kendisidir; ayrıca sayısal kanıt (ör. "%X daha hızlı güncelleme") kullanılmaz.

**10. Bir sonraki section bağlantısı**: Müşteri menüde gezinirken bir soru sorma ihtiyacı doğar — bu, Section 5'teki (Chatbot) doğal geçiş noktasıdır.

**11. Riskler**: Çeviriyi "otomatik/AI/kusursuz çeviri" olarak sunmak (**kesin yasak**, CONTENT_STRATEGY.md madde 1.1, 7); filtreleri "otomatik algılama" gibi sunmak (madde 1.5); bu section'ı tek başına bir "özellik listesi" haline getirmek — tek ana fikir (menüyü siz yönetirsiniz, sistem sunar) korunmalı.

**Durum: [Kesin]** (özellik) / **[TBD]** (gerçek ekran görseli asset'i)

---

## SECTION 5 — Chatbot

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

**6. Görsel/UI**: **Gerçek ürün ekranı zorunlu** — gerçek chatbot konuşma arayüzü (soru + cevap + "personel devraldı" durumu). Bu repoda mevcut değil → **[TBD]**.

**7. Layout**: Tek odaklı, dikey sohbet balonu görünümü; metin/görsel yan yana (split) düzen önerilir, Hero'nun grid oranı buraya kopyalanmaz.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Kanıt = gerçek konuşma ekran görüntüsü (sağlandığında). "Sorularınızın %X'ini çözer" gibi sayısal kanıt kullanılmaz (doğrulanmadı).

**10. Bir sonraki section bağlantısı**: Chatbot'un devredemediği veya müşterinin doğrudan istediği bir aksiyon (garson çağırma, hesap isteme) — Section 6'ya (Garson+Hesap+Servis) doğal geçiştir; akışta SOR'dan sonra ÇAĞIR gelir (madde 3).

**11. Riskler**: "Her soruyu bilir", "%100 doğru cevap", "personelsiz çalışır" iddiaları (**kesin yasak**, CONTENT_STRATEGY.md madde 6.1).

**Durum: [Kesin]** (özellik) / **[TBD]** (gerçek ekran görseli)

---

## SECTION 6 — Garson + Hesap + Servis Paneli

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

**6. Görsel/UI**: **Gerçek ürün ekranı zorunlu** — müşteri tarafı (çağrı butonuna basma anı) + işletme tarafı (gerçek Servis Paneli ekranı, bildirim göstergesi). Bu repoda mevcut değil → **[TBD]**.

**7. Layout**: İki-panel karşılaştırma (müşteri eylemi → işletme ekranı), aralarında nedensellik hissi veren ince bir bağlantı/ok öğesi; ayrık kart yığını değil.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Kanıt = gerçek panel ekran görüntüsü. Yanıt süresi/oranı gibi sayısal kanıt kullanılmaz (doğrulanmadı, madde 1.8).

**10. Bir sonraki section bağlantısı**: Servis Paneli'nin ürettiği kullanım verisi (çağrı sayısı, süreç) doğal olarak Section 7'deki (İstatistikler) veri temasına bağlanır.

**11. Riskler**: "Anında servis garantisi", "asla kaçırmazsınız" gibi mutlak ifadeler (madde 1.8'e aykırı, çünkü yanıt hızı işletmeye bağlıdır).

**Durum: [Kesin]** (özellik) / **[TBD]** (gerçek ekran görseli)

---

## SECTION 7 — İstatistikler + Menü Mühendisliği

**1. Satış amacı**: "Kendi verimle hangi ürünün gerçekten kazandırdığını görebilirim" düşüncesi.

**2. Problem**: İşletme ürün kârlılığını net göremiyor (CONTENT_STRATEGY.md madde 2).

**3. Ürün gerçeği**: Menü Mühendisliği işletmenin girdiği maliyet verisine dayanır (madde 1.4) — **[Kesin]**; istatistikler kullanım verisine dayanır — **[Kesin]** (varlığı) / tam metrik seti **[Tahmin]** (madde 6.2 notu).

**4. Ana mesaj**: "Kendi verinizle görün" — veri girişi gerektirir, veri girmeden otomatik bir sihir değildir.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Veriyle Karar Verin" düzeyinde bir etiket.
- **H2**: Kendi veri + görünürlük başlığı.
- **Kısa açıklama**: Maliyet verisi girişi şartının dürüstçe belirtildiği alt satır.
- **2–3 destekleyici nokta**: (a) kullanım istatistikleri, (b) menü mühendisliği görünümü/matrisi, (c) veri girişi gerekliliği.
- **CTA amacı**: Yok.

**6. Görsel/UI**: **Gerçek ürün ekranı zorunlu** — gerçek istatistik ekranı ve gerçek menü mühendisliği ekranı. Bu repoda mevcut değil → **[TBD]**. Ayrıca gösterilecek metriklerin hangileri olduğu (görüntülenme/tıklama/vb.) da ayrıca **[Tahmin]/TBD**'dir; yalnızca ZIP analizinde doğrulanmış metrikler gösterilecektir, doğrulanmamış bir metrik ("en çok sipariş edilen ürün" gibi, sipariş verisi tutulmuyorsa) uydurulmaz.

**7. Layout**: Tek, baskın bir gerçek ekran görüntüsü + yanında kısa açıklama sütunu. Bu section, DESIGN_SYSTEM.md madde 1'deki "WordPress admin görünümüne benzememe" kuralı açısından **en riskli section**dır; ekran görüntüsü seçilirken/kadrajlanırken bu özellikle gözetilmelidir.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Kanıt = gerçek ekran görüntüsü. Gelir/satış artışı yüzdesi **kesinlikle kullanılmaz** (madde 1.11).

**10. Bir sonraki section bağlantısı**: Veri/görünürlük teması, doğal olarak Section 8'deki (Güvenlik) "bu verinin/oturumun nasıl korunduğu" sorusuna bağlanır.

**11. Riskler**: "Otomatik kârlılık analizi" iddiası (madde 1.4'e aykırı); doğrulanmamış metrik göstermek; ekran görüntüsünün WP-admin/tablo yığını hissi vermesi.

**Durum: [Kesin]** (özelliklerin varlığı) / **[Tahmin]** (gösterilecek metrikler) / **[TBD]** (gerçek ekran görseli)

---

## SECTION 8 — Güvenlik

**1. Satış amacı**: "Masa bağlantım/oturumum güvende, başkası tarafından kötüye kullanılamaz" düşüncesi.

**2. Problem**: Doğrudan bir günlük operasyon problemi değil; güven/itiraz giderme amaçlıdır (CONTENT_STRATEGY.md madde 10 — "masa linkim başkası tarafından kullanılabilir mi?").

**3. Ürün gerçeği**: İmzalı masa oturumu / kilit mekanizması (madde 1.10) — **[Kesin]**.

**4. Ana mesaj**: Mekanizma (imzalı oturum/kilit) açıklanır; mutlak güvenlik iddiası kurulmaz.

**5. Copy hiyerarşisi**
- **Kicker/eyebrow**: "Güvenlik" düzeyinde bir etiket.
- **H2**: Mekanizma temelli, sakin bir başlık.
- **Kısa açıklama**: İmzalı oturum/kilit mekanizmasının kısa, teknik ama anlaşılır tarifi.
- **1–2 destekleyici nokta**: Bu section bilerek kısa tutulur; fazla madde eklenmez.
- **CTA amacı**: Yok.

**6. Görsel/UI**: Mümkünse gerçek "masa oturumu davranışı" gösterimi (ör. QR okutma → oturum kilidi akışının basitleştirilmiş gösterimi) tercih edilir; **zorunlu değildir**. Bu görsel bu repoda mevcut değil → **[TBD]**. Yoksa sade bir güven rozeti/ikon + kısa metin yeterlidir (DESIGN_SYSTEM.md madde 10 ikon kurallarına uygun).

**7. Layout**: Kompakt/küçük section — tam genişlik görsel odağı yerine ikon+metin ikilisi, dar ölçülü (narrow measure) metin bloğu.

**8. CTA**: Gerekmiyor.

**9. Güven/kanıt**: Kanıt = mekanizmanın kendisinin açıklanması (imzalı oturum/kilit). "Hacklenemez", "%100 güvenli" gibi mutlak ifadeler **kesin yasak** (madde 6.4).

**10. Bir sonraki section bağlantısı**: Güven ve şeffaflık teması, doğal olarak Section 9'daki (Yorum/Feedback) "işletme müşteri memnuniyetsizliğini erken duyar" şeffaflığına bağlanır.

**11. Riskler**: "Hacklenemez", "sıfır risk", "%100 güvenli" gibi mutlak iddialar.

**Durum: [Kesin]** (özellik) / **[Tahmin]/[TBD]** (görsel sunum biçimi ve asset'i)

---

## SECTION 9 — Yorum / Feedback

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

**10. Bir sonraki section bağlantısı**: Güven teması tamamlandıktan sonra, "peki bu sisteme nasıl geçerim" sorusuna — Section 10 (Kurulum).

**11. Riskler**: "Google puanınızı yükseltin", "olumsuz yorumları engelleyin", "yalnızca mutlu müşterileri gönderin" (**kesin yasak**, madde 8).

**Durum: [Muhtemel]** (çerçeve onaylı) / **[TBD]** (teknik mekanizma detayı, gerçek ekran)

---

## SECTION 10 — Kurulum / Kullanım Kolaylığı

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

**7. Layout**: Minimal, kısa/tek bloklu; tam section ağırlığında **değildir** (HOMEPAGE_ARCHITECTURE.md madde 10 ile uyumlu).

**8. CTA**: Amacı, kuruluma nasıl başlanacağı bilgisine yönlendirmektir; kesin hedef ve buton metni **TBD** olduğundan burada kilitlenmez/uydurulmaz.

**9. Güven/kanıt**: Yok.

**10. Bir sonraki section bağlantısı**: Kalan tereddütlerle birlikte FAQ section'ına (Section 11) geçilir.

**11. Riskler**: Herhangi bir süre/kolaylık/otomasyon iddiası (**kesin yasak**, madde 6.6); section'ı doldurmak için doğrulanmamış bir "3 adımda kurulum" gibi akış uydurmak.

**Durum: TBD**

---

## SECTION 11 — FAQ / İtirazlar

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

**Durum: [Kesin]** (çerçeve) / **TBD** (kurulum itirazının cevabı)

---

## SECTION 12 — Son CTA

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

Bu 12 section blueprint'i, HTML/CSS/JS üretimine geçildiğinde şu sırayla kontrol edilir: önce bu dosyadaki içerik hiyerarşisi ve görsel gereksinim, sonra `CONTENT_STRATEGY.md`'deki ilgili madde (gerçeklik/copy sınırı), sonra `DESIGN_SYSTEM.md`'deki ilgili görsel token/kural. **[TBD]** olarak işaretli gerçek ürün ekranı asset'leri sağlanmadan ilgili section'ların görsel kısmı kodlanmaz; yerine geçici/sahte bir ekran görüntüsü üretilmez.
