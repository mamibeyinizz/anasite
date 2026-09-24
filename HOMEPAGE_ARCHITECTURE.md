# Homepage Architecture — QR Menu Official

Bu doküman, ana sayfanın **section mimarisi** referansıdır. `DESIGN_SYSTEM.md` (görsel kurallar) ve `CONTENT_STRATEGY.md` (içerik/copy kuralları) temel alınarak hazırlanmıştır ve bu iki dosyaya aykırı hiçbir karar içermez.

Bu dosya:
- Nihai section metni **değildir**.
- HTML/CSS/JS üretimi için **kaynak dokümandır**: her section kodlanırken önce bu dosyadaki tanım, sonra CONTENT_STRATEGY.md'deki ilgili madde, sonra DESIGN_SYSTEM.md'deki ilgili görsel kural kontrol edilir.
- Etiket sistemi CONTENT_STRATEGY.md ile aynıdır: **[Kesin]** (ürün/kod ile doğrulanmış), **[Muhtemel]** (güçlü strateji çıkarımı, doğrulanmamış), **[Tahmin]** (yer tutucu, netleşmemiş).

---

## 0. Önerilen Section Sırası (Özet)

Kullanıcının verdiği referans sıra **birebir kabul edilmedi**; 3 noktada değişiklik önerildi (gerekçeler madde 0.1'de). Sonuç: **12 section**.

| # | Section | Kullanıcı sırasındaki karşılığı |
|---|---|---|
| 1 | Hero | HERO |
| 2 | Problem — Restoranın Günlük Sorunu | PROBLEM |
| 3 | Çözüm — Akış Özeti | ÜRÜNÜN GENEL ÇÖZÜMÜ |
| 4 | Menü Yönetimi & Akıllı Menü Deneyimi | MENÜ YÖNETİMİ + MÜŞTERİ DENEYİMİ/AKILLI MENÜ + ÇEVİRİ (birleştirildi) |
| 5 | Chatbot | CHATBOT (sırası değişti) |
| 6 | Garson + Hesap + Servis Paneli | GARSON+HESAP+SERVİS PANELİ (sırası değişti) |
| 7 | İstatistikler + Menü Mühendisliği | İSTATİSTİKLER + MENÜ MÜHENDİSLİĞİ |
| 8 | Güvenlik | GÜVENLİK |
| 9 | Yorum / Feedback | YORUM / FEEDBACK |
| 10 | Kurulum / Kullanım Kolaylığı (hafif ağırlıklı) | KURULUM / KULLANIM KOLAYLIĞI |
| 11 | FAQ / İtirazlar | FAQ / İTİRAZLAR |
| 12 | Son CTA | SON CTA |

### 0.1 Yapılan 3 Değişiklik ve Gerekçesi

1. **Yeni: "Çözüm — Akış Özeti" section'ı eklendi (Hero ile Menü Yönetimi arasına).**
   Kullanıcının sırasında "ÜRÜNÜN GENEL ÇÖZÜMÜ" zaten vardı, ancak bunu ayrı ve somut bir section olarak modelledik: CONTENT_STRATEGY.md madde 3'teki **QR → MENÜ → SEÇ → SOR → ÇAĞIR → SERVİS → ÖĞREN** akışının görsel/bütünsel özetini taşıyan tek bir section. Gerekçe **[Muhtemel]**: Problem→Çözüm zincirinde (madde 4) "çözüm" adımı somut bir tanıtım anına ihtiyaç duyar; bu akışı burada bir kere bütün olarak gösterip sonraki her section'ın (4–7) bu akışın hangi adımını detaylandırdığını okuyucuya baştan çerçevelemek, ilerleyen section'ların "neden burada" olduğunu netleştirir ve klasik feature-grid hissini azaltır.

2. **Çeviri (ÇEVİRİ), ayrı bir section olarak değil, "Menü Yönetimi" section'ı içinde bir alt-vurgu olarak ele alındı.**
   Gerekçe **[Muhtemel]**: CONTENT_STRATEGY.md madde 2'deki problem envanterinde "çok dilli müşteri" problemi, diğer maddelere (personel meşguliyeti, çağrı kaçırma, kârlılık görünürlüğü) kıyasla daha **dar kapsamlı ve tekil bir özellik**tir; madde 6.3'te de zaten "menünün bir parçası" olarak tanımlanmıştır. Bunu tam ağırlıklı bir section yapmak, sayfayı gereksiz uzatır ve DESIGN_SYSTEM.md madde 1'deki "gereksiz dekoratif/parça parça hissettirme" yasağına yaklaşır. Menü Yönetimi section'ı zaten "işletme menüyü nasıl yönetir" sorusuna cevap verdiği için çok dillilik bunun doğal bir alt-parçasıdır.

3. **Chatbot, Garson+Hesap+Servis Paneli'nden ÖNCE geldi (kullanıcı sırasında sonrasındaydı).**
   Gerekçe **[Kesin]** (akış sırası) + **[Muhtemel]** (psikolojik gerekçe): CONTENT_STRATEGY.md madde 3'teki doğrulanmış akış **SOR (chatbot) → ÇAĞIR (garson/hesap) → SERVİS**'tir; yani müşteri önce soru sorar, sonra çağrı yapar. Bu sırayı homepage'de tersine çevirmek (önce Servis Paneli'ni, sonra Chatbot'u anlatmak) hem akışla çelişir hem de anlatıyı "önce operasyon ekranı, sonra müşteri etkileşimi" gibi ters bir açıdan başlatır. Chatbot'u önce anlatmak, müşteri tarafından işletme tarafına doğru mantıklı bir geçiş kurar.

4. **"Kurulum / Kullanım Kolaylığı" section'ı, tam ağırlıklı değil, hafif/kısa bir section olarak modellendi.**
   Gerekçe **[Kesin]**: CONTENT_STRATEGY.md madde 6.6 ve madde 9, kurulum süresi/onboarding akışının **TBD** olduğunu ve bu konuda hiçbir süre/kolaylık iddiasının kullanılamayacağını belirtiyor. Doğrulanmış veri olmadan bu section'ı diğerleriyle eşit ağırlıkta (görsel + uzun anlatı + kanıt) kurmak, boş/şişirilmiş bir section'a veya dolaylı yoldan doğrulanmamış bir "kolaylık" iddiasına yol açma riski taşır. Bu yüzden bu section, veri doğrulanana kadar **minimal, tek-mesajlı bir geçiş bloğu** olarak tutulmalıdır (bkz. madde 10).

Kullanıcının sırasındaki diğer tüm adımlar (Hero, Problem, Menü Yönetimi, Müşteri Deneyimi, İstatistik+Menü Mühendisliği, Güvenlik, Yorum/Feedback, FAQ, Son CTA) **stratejik olarak değerlendirildi ve korundu**; mevcut oldukları için değil, madde 4'teki (CONTENT_STRATEGY.md) problem→CTA zincirinde her birinin gerçek bir işlevi olduğu için tutuldu.

---

## 1. HERO

1. **Section adı**: Hero
2. **Section amacı**: Ziyaretçiye ürünün ne olduğunu ("sadece QR menü değil, operasyon/etkileşim katmanı" — CONTENT_STRATEGY.md madde 3) 3 saniyede net anlatmak; sayfanın geri kalanını okumaya devam etme isteği uyandırmak.
3. **Hangi problemi ele alıyor**: Doğrudan bir problem anlatmaz; problemin *zıttı* olan sonucu (düzenli/kontrollü bir işletme deneyimi) ima eder. Problem detayları Section 2'ye bırakılır.
4. **Kullanılacak gerçek ürün özelliği**: QR ile menüye erişim + genel akış (madde 3, adım 1–2: QR, MENÜ) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: Konumlandırma "yalnızca QR menü" değil, restoranın uçtan uca müşteri etkileşim/operasyon katmanı olarak kurulur (CONTENT_STRATEGY.md madde 3). Rakamsız, iddiasız, net bir konumlandırma cümlesi + kısa alt başlık. **[Muhtemel]** (nihai cümle burada yazılmıyor).
6. **Görsel/UI gösterimi**: Evet — Hero V3 production görseliyle uyumlu, tek ana görsel/mockup odağı (DESIGN_SYSTEM.md madde 11: max-width 480px, radius 20px, gold outline). Feature-icon satırı (DESIGN_SYSTEM.md madde 10) kısa/öz tutulur, kalabalıklaştırılmaz. **[Kesin]** (Hero V3 zaten bu yapıda mevcut).
7. **CTA gerekiyor mu**: Evet, tek birincil CTA. Hedefi CONTENT_STRATEGY.md madde 9 gereği **TBD** olduğundan, bu aşamada yalnızca "demo iste / canlı örneği incele" türü güvenli bir eylem çerçevesi kullanılabilir; kesin bir self-servis akış varsayılmaz.
8. **Sonraki section'a bağlanışı**: Hero, "bu ürün ne yapıyor" sorusuna cevap verir ama "neden ihtiyacım var" sorusunu açık bırakır — bu açık soru, Section 2'deki (Problem) somut sahneyle kapatılır.
9. **Etiket**: **[Kesin]** (Hero zaten production'da var, madde 3'teki akışla uyumlu) / **[Muhtemel]** (bu section'ın homepage'de ilk sırada kalması gerektiği).

---

## 2. PROBLEM — Restoranın Günlük Sorunu

1. **Section adı**: Problem / Tanıdık Sahne
2. **Section amacı**: Ziyaretçiye (restoran/kafe sahibine) kendi günlük operasyonundan tanıdık bir sahne göstererek "bu benden bahsediyor" hissi uyandırmak.
3. **Hangi problemi ele alıyor**: CONTENT_STRATEGY.md madde 2'deki problem envanterinden 1–3 tanesi (öncelik: personel meşguliyeti + kaçan çağrılar + menü güncelleme yükü) — **[Muhtemel]** (envanter kendisi doğrulanmış anketle değil, ürün davranışından türetilmiştir).
4. **Kullanılacak gerçek ürün özelliği**: Bu section'da özellik tanıtılmaz; yalnızca problem sahnesi kurulur (madde 4'teki PROBLEM→ACI adımları).
5. **Ana mesaj / copy açısı**: Somut, günlük bir an ("yoğun saatte aynı anda üç masadan çağrı", "menüde fiyat değişti, hepsini tek tek güncellemek gerekiyor" gibi tanınabilir sahneler — nihai metin değil, yön). Rakamsız, dramatize edilmemiş. **[Muhtemel]**.
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — büyük bir mockup yerine, sahneyi destekleyen sade bir görsel veya salt tipografik bir yaklaşım tercih edilebilir (DESIGN_SYSTEM.md madde 1: gereksiz dekoratif eleman yasağı). **[Tahmin]** (tam görsel biçimi netleşmedi).
7. **CTA gerekiyor mu**: Hayır. Bu section'da CTA erken karar baskısı yaratır; anlatı henüz çözüm sunmamıştır (madde 4 zinciri).
8. **Sonraki section'a bağlanışı**: Problem sahnesinin "işletmeye etkisi" (zaman kaybı, kaçan talep) ima edilerek, Section 3'teki genel çözüme geçiş için gerilim bırakılır.
9. **Etiket**: **[Muhtemel]**.

---

## 3. ÇÖZÜM — Akış Özeti

1. **Section adı**: Çözüm / Akış Özeti
2. **Section amacı**: QR Menu Official'ın tek bir uçtan uca akış olduğunu göstermek; bundan sonraki section'ların (4–7) bu akışın hangi parçasını detaylandıracağını okuyucuya baştan çerçevelemek.
3. **Hangi problemi ele alıyor**: Section 2'deki dağınık problem sahnesine karşı, "hepsi tek bir akışta toplanıyor" çözümünü sunar.
4. **Kullanılacak gerçek ürün özelliği**: CONTENT_STRATEGY.md madde 3'teki 7 adımlı akışın tamamı — **[Kesin]**: QR → MENÜ → SEÇ → SOR → ÇAĞIR → SERVİS → ÖĞREN.
5. **Ana mesaj / copy açısı**: "Bu tek bir akış, dağınık araçlar değil" çerçevesi. Akış adımları kısa etiketlerle (madde 3'teki tabloda tanımlı adlandırma seti — SEÇ/ÇAĞIR/ÖĞREN **veya** Keşif/Garson-Hesap/Analiz, ikisi karıştırılmadan) gösterilir. **[Kesin]** (akış), **[Muhtemel]** (sunum biçimi).
6. **Görsel/UI gösterimi**: Evet — 7 adımlık yatay/aşamalı bir akış diyagramı (kart değil, bağlantılı adım göstergesi — DESIGN_SYSTEM.md madde 9'daki "genel özellik listeleme için kart kullanılmaz" kuralına uygun, bu bir süreç görselleştirmesidir, feature-kart değildir). **[Muhtemel]**.
7. **CTA gerekiyor mu**: Hayır. Bu section bir özet/köprüdür; CTA'nın erken gelmesi anlatıyı böler.
8. **Sonraki section'a bağlanışı**: Akıştaki "MENÜ/SEÇ" adımı vurgulanarak Section 4'e (Menü Yönetimi) doğal geçiş sağlanır.
9. **Etiket**: **[Kesin]** (akışın kendisi) / **[Muhtemel]** (ayrı section olarak konumlandırılması, bkz. madde 0.1/1).

---

## 4. MENÜ YÖNETİMİ & AKILLI MENÜ DENEYİMİ

1. **Section adı**: Menü Yönetimi & Akıllı Menü Deneyimi
2. **Section amacı**: İşletmenin menüyü nasıl yönettiğini (güncelleme, filtreler, çoklu dil) ve müşterinin menüyü nasıl deneyimlediğini (filtreleme, görsel inceleme) birlikte anlatmak.
3. **Hangi problemi ele alıyor**: "Menüyü güncellemek zaman alır", "çok dilli müşteriye hizmet manuel çeviri yükü doğurur", "diyet/alerjen kısıtlaması olan müşteriye doğru ürünü göstermek zordur" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**:
   - Filtreler — ürün bilgisi girişine bağlı çalışır (madde 1.5) — **[Kesin]**.
   - Çoklu dil — CSV/veritabanı/manuel çeviri girişi (madde 1.1, madde 6.3) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: "Menünüzü siz yönetirsiniz, sistem bunu düzenli şekilde sunar" çerçevesi. Çeviri kesinlikle "otomatik/AI/kusursuz çeviri" olarak sunulmaz (CONTENT_STRATEGY.md madde 1.1, madde 7 yasak listesi) — dil ekleme/tanımlama işletmenin eylemi olarak anlatılır. Filtreler "otomatik algılama" değil, girilen bilgiye dayalı olarak anlatılır (madde 1.5).
6. **Görsel/UI gösterimi**: Evet — gerçek menü arayüzü ekran görüntüsü (filtre çipleri, dil seçici gibi gerçek UI elemanları), DESIGN_SYSTEM.md madde 11 kurallarına uygun tek ana görsel odağı.
7. **CTA gerekiyor mu**: Hayır (ikincil/text-link düzeyinde "örnek menüyü incele" verilebilir, ama section'ın birincil CTA'sı değildir — DESIGN_SYSTEM.md madde 8: section başına 1 primary CTA kuralı Section 12'ye ayrılmıştır).
8. **Sonraki section'a bağlanışı**: Müşteri menüde gezinirken soru sorma ihtiyacı doğar — bu, Section 5'teki (Chatbot/SOR) doğal geçiş noktasıdır.
9. **Etiket**: **[Kesin]** (özellikler) / **[Muhtemel]** (çeviri ve müşteri deneyiminin tek section'da birleştirilmesi, bkz. madde 0.1/2).

---

## 5. CHATBOT

1. **Section adı**: Chatbot (Soru-Cevap)
2. **Section amacı**: Müşterinin menü/ürün hakkındaki sorularının nasıl karşılandığını, personelin bu süreçte nasıl devreye girdiğini göstermek.
3. **Hangi problemi ele alıyor**: "Müşteri soruları personeli sürekli meşgul eder" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Chatbot yaygın soruları yanıtlar, cevaplayamadığını raporlar (madde 1.6); personel gerektiğinde görüşmeyi devralabilir (madde 1.7) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: "Her soruyu bot bilir" değil, "bot bilmediğini söyler, personel gerektiğinde devralır" — dürüst hibrit model çerçevesi (CONTENT_STRATEGY.md madde 6.1). "%100 doğru cevap" veya "personelsiz çalışır" gibi ifadeler kullanılmaz.
6. **Görsel/UI gösterimi**: Evet — gerçek chatbot konuşma arayüzü örneği (soru + cevap + "personel devraldı" durumu gösterimi), tek odak.
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Chatbot'un devredemediği veya müşterinin doğrudan istediği bir aksiyon (garson çağırma, hesap isteme) — bu, Section 6'ya (Garson+Hesap+Servis) doğal geçiştir; akışta SOR'dan sonra ÇAĞIR gelir (madde 3).
9. **Etiket**: **[Kesin]**.

---

## 6. GARSON + HESAP + SERVİS PANELİ

1. **Section adı**: Garson & Hesap Çağrısı / Servis Paneli
2. **Section amacı**: Müşterinin çağrı yapma anını ve işletmenin bu çağrıyı nasıl karşıladığını (Servis Paneli) birlikte göstermek — müşteri tarafı ile işletme tarafını aynı section'da eşleştirmek.
3. **Hangi problemi ele alıyor**: "Garson/hesap çağrıları gözden kaçar veya geç fark edilir" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Garson/hesap çağrıları Servis Paneli'ne düşer (madde 1.8); Servis Paneli sesli uyarı + masaüstü bildirim sağlar (madde 1.9) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: "Çağrılar tek bir ekranda toplanır, kaybolmaz" (CONTENT_STRATEGY.md madde 6.1). "Anında servis garantisi" gibi bir vaat kurulmaz — yanıt hızı işletmenin kendi operasyonuna bağlıdır (madde 1.8).
6. **Görsel/UI gösterimi**: Evet — müşteri tarafı (çağrı butonu anı) + işletme tarafı (Servis Paneli ekranı, bildirim göstergesi) iki küçük odaklı görsel; DESIGN_SYSTEM.md madde 11 "en fazla 1 baskın görsel, diğerleri destekleyici" kuralına uygun hiyerarşi kurulmalı.
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Servis Paneli'nin ürettiği kullanım verisi (çağrı sayısı, yanıt süreci) doğal olarak Section 7'deki (İstatistikler) veri temasına bağlanır.
9. **Etiket**: **[Kesin]**.

---

## 7. İSTATİSTİKLER + MENÜ MÜHENDİSLİĞİ

1. **Section adı**: İstatistikler & Menü Mühendisliği
2. **Section amacı**: İşletmenin, ürünü kullandıkça elde ettiği veriyle (kullanım istatistikleri + kendi maliyet verisiyle menü mühendisliği) nasıl daha bilinçli kararlar alabileceğini göstermek.
3. **Hangi problemi ele alıyor**: "İşletme, ürün kârlılığını net göremez" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Menü Mühendisliği, işletmenin girdiği maliyet verisine dayanır (madde 1.4); istatistikler kullanım verisine dayanır — **[Kesin]** (varlığı) / **[Tahmin]** (istatistiklerin tam metrik seti, CONTENT_STRATEGY.md madde 6.2 notu).
5. **Ana mesaj / copy açısı**: "Kendi verinizle görün" çerçevesi — "otomatik kârlılık analizi" veya veri girişi gerektirmeyen bir sihir olarak sunulmaz (madde 1.4). Gelir/satış artış yüzdesi **kesinlikle** kullanılmaz (madde 1.11, madde 7).
6. **Görsel/UI gösterimi**: Evet — gerçek istatistik/menü mühendisliği ekranı (grafik, tablo), ancak yalnızca ZIP analizinde doğrulanmış metrikler gösterilir; doğrulanmamış bir metrik uydurulmaz (madde 6.2 notu).
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Veri/güven teması, doğal olarak Section 8'deki (Güvenlik) "işletmenin ve müşterinin verisi/oturumu nasıl korunuyor" sorusuna bağlanır.
9. **Etiket**: **[Kesin]** (özelliklerin varlığı) / **[Tahmin]** (gösterilecek spesifik metrikler netleşmeden bu bölüm netleşmiş sayılmaz).

---

## 8. GÜVENLİK

1. **Section adı**: Güvenlik (QR Masa Güvenliği)
2. **Section amacı**: Müşterinin masa oturumunun teknik olarak nasıl korunduğunu, işletmeye ve müşteriye güven vermek amacıyla açıklamak.
3. **Hangi problemi ele alıyor**: Doğrudan bir "günlük operasyon" problemi değil, güven/itiraz gidermeye yöneliktir (CONTENT_STRATEGY.md madde 10 — "masa linkim başkası tarafından kullanılabilir mi?" itirazı).
4. **Kullanılacak gerçek ürün özelliği**: İmzalı masa oturumu / kilit mekanizması (madde 1.10) — **[Kesin]**.
5. **Ana mesaj / copy açısı**: Mekanizma açıklanır (imzalı oturum/kilit); "hacklenemez", "%100 güvenli" gibi mutlak ifadeler kullanılmaz (madde 6.4).
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — teknik bir diyagram yerine sade bir güven rozeti/ikon + kısa açıklama yeterli olabilir (DESIGN_SYSTEM.md madde 1: dekoratif abartı yasağı). **[Tahmin]** (görsel biçimi netleşmedi).
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Güvenden sonra, işletmenin müşteri memnuniyetsizliğini nasıl erken yakaladığı (Yorum/Feedback) doğal bir "güven + şeffaflık" temasının devamıdır.
9. **Etiket**: **[Kesin]** (özellik) / **[Tahmin]** (görsel sunum biçimi).

---

## 9. YORUM / FEEDBACK

1. **Section adı**: Yorum / Feedback
2. **Section amacı**: İşletmenin müşteri memnuniyetsizliğini halka açık olmadan önce öğrenebildiğini anlatmak.
3. **Hangi problemi ele alıyor**: "Olumsuz bir deneyim, işletme haberdar olmadan doğrudan Google'a taşar" (CONTENT_STRATEGY.md madde 2).
4. **Kullanılacak gerçek ürün özelliği**: Feedback/yorum toplama mekanizması — CONTENT_STRATEGY.md madde 8'de tanımlı çerçeve; teknik detay ZIP analizinde madde 1 listesinde ayrı bir madde olarak yer almıyor, bu nedenle mekanizmanın tam davranışı **[Tahmin]** kabul edilir, yalnızca CONTENT_STRATEGY.md madde 8'deki onaylı çerçeve kullanılır.
5. **Ana mesaj / copy açısı**: **"Şikâyeti Google'dan önce siz duyun."** çerçevesi (CONTENT_STRATEGY.md madde 8). "Google puanınızı yükseltin", "olumsuz yorumları engelleyin" gibi review-gating ifadeleri **kesinlikle kullanılmaz**.
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — basit bir feedback formu/akış önizlemesi yeterli, büyük bir mockup gerekmeyebilir. **[Tahmin]**.
7. **CTA gerekiyor mu**: Hayır.
8. **Sonraki section'a bağlanışı**: Güven ve şeffaflık teması tamamlandıktan sonra, "peki bu sistemi işletmeme nasıl alırım" sorusuna geçiş — Section 10 (Kurulum).
9. **Etiket**: **[Muhtemel]** (çerçeve doğrulanmış, teknik mekanizma detayı TBD).

---

## 10. KURULUM / KULLANIM KOLAYLIĞI (Hafif Ağırlıklı Geçiş Bloğu)

1. **Section adı**: Kurulum & Kullanım Kolaylığı
2. **Section amacı**: FAQ ve Son CTA'ya geçmeden önce kısa bir "bu sisteme nasıl geçilir" güvencesi vermek — **tam ağırlıklı bir section değil**, kısa bir geçiş bloğu.
3. **Hangi problemi ele alıyor**: Potansiyel "kurulumu zor/uzun mudur" tereddüdü (dolaylı; madde 2'de doğrudan bir madde olarak yer almıyor).
4. **Kullanılacak gerçek ürün özelliği**: Yok — bu alanda ZIP analizinde doğrulanmış bir veri **bulunmuyor** (CONTENT_STRATEGY.md madde 1 TBD notu, madde 6.6).
5. **Ana mesaj / copy açısı**: **TBD** — hiçbir süre ("5 dakikada"), kolaylık ("kod yazmadan") veya otomasyon iddiası kullanılamaz. Bu netleşene kadar bu blokta yalnızca nötr bir yönlendirme ("ekibimizle görüşün" türü) kullanılabilir (CONTENT_STRATEGY.md madde 6.6, madde 10).
6. **Görsel/UI gösterimi**: Hayır (veya en fazla çok küçük bir simge) — görsel yatırımı, içerik doğrulanmadan yapılmamalı.
7. **CTA gerekiyor mu**: Hayır — birincil CTA Section 12'de toplanır; burada CTA tekrarı section'ı gereksiz ağırlıklandırır.
8. **Sonraki section'a bağlanışı**: "Nasıl başlarım" sorusunun kısmen açık kalması, doğal olarak Section 11'deki (FAQ) diğer tereddütlerle birlikte ele alınmasına zemin hazırlar.
9. **Etiket**: **TBD** — bu section'ın nihai içeriği, kurulum/onboarding verisi doğrulanmadan yazılamaz. Doğrulama gelene kadar bu section homepage'de **minimal tutulmalı veya FAQ'e bir madde olarak taşınması değerlendirilmelidir** (bkz. madde 0.1/4).

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

---

## 12. SON CTA

1. **Section adı**: Son CTA
2. **Section amacı**: Sayfa boyunca kurulan güveni tek, net bir sonraki adıma yönlendirmek.
3. **Hangi problemi ele alıyor**: Doğrudan problem değil; kararsızlığı gidermek (madde 4'ün son halkası: CTA).
4. **Kullanılacak gerçek ürün özelliği**: Yok — bu bir aksiyon section'ıdır.
5. **Ana mesaj / copy açısı**: Net, dürüst, tek eylem ("Demo iste" / "Canlı örneği incele" türü — CONTENT_STRATEGY.md madde 9). Birincil CTA'nın gerçek hedefi (demo formu / self-servis kayıt / satış görüşmesi) **TBD** olduğundan, hedef kesinleştirilmeden nihai buton metni/akışı burada **kilitlenmez**.
6. **Görsel/UI gösterimi**: Opsiyonel/hafif — büyük bir mockup yerine sade bir kapanış görseli veya salt tipografik kapanış tercih edilebilir.
7. **CTA gerekiyor mu**: Evet — sayfanın birincil, tek CTA'sı burada en güçlü haliyle tekrarlanır (DESIGN_SYSTEM.md madde 8: section başına 1 primary buton).
8. **Sonraki section'a bağlanışı**: Yok — sayfanın son section'ıdır (footer hariç; footer bu dosyanın kapsamı dışındadır).
9. **Etiket**: **[Muhtemel]** (CTA'nın var olması ve tekil olması) / **TBD** (CTA'nın kesin hedefi/metni).

---

## 13. Genel Uygulama Kuralı

Bu section mimarisi HTML/CSS/JS'e dökülürken:

1. Her section, CONTENT_STRATEGY.md madde 4'teki PROBLEM → ACI → İŞLETMEYE ETKİ → ÇÖZÜM → ÖZELLİK → FAYDA → KANIT → CTA zincirinin ilgili halkalarını taşır; zincir atlanmaz.
2. Hiçbir section, madde 1'deki (CONTENT_STRATEGY.md) ürün gerçekliği sınırlarını aşan bir iddia içeremez.
3. TBD olarak işaretli alanlar (Kurulum/Kullanım Kolaylığı, Son CTA hedefi, İstatistik metrik seti, Yorum/Feedback teknik mekanizması) ilgili veri doğrulanmadan **nihai metne dökülmez**.
4. Görsel uygulama DESIGN_SYSTEM.md'deki token ve kurallara (özellikle madde 1, 8, 9, 11, 19) bağlı kalır; bu dosyadaki "görsel gerekiyor mu" kararları o kuralların yerine geçmez, onları tamamlar.
5. Section sırası değiştirilecekse, önce bu dosya güncellenir; sıra doğrudan kodda değiştirilmez.
