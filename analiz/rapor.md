# @qrmenuofficial — Instagram Denetimi ve 30 Günlük Plan

Etiketler: **[Kesin]** kanıt var · **[Muhtemel]** güçlü çıkarım · **[Tahmin]** boşluk dolduruyorum.

**Veri kapsamı (en başta):** Girdi: grid ekran görüntüleri (`grid-1/2.jpg`), profil üst kısmı (`profil-ust.jpg`: bio, ad alanı, link, sayaçlar), Dil Çeviri carousel'ının 5 slaytı (`dil-slayt-1..5.jpg`) ve 3 gönderinin caption başlangıcı + tarihi. Insights CSV, diğer 15 gönderinin caption/slayt/tarihleri, Reels sekmesi içeriği ve rakip hesaplar yok: bunlar **"veri yok"**. Rakip bölümü [Tahmin]; profil, Dil Çeviri gönderisi ve grid [Kesin].
Görüntülenme sayıları göz ikonundan (gönderi altındaki "N · İstatistikleri gör" ile grid sayıları birebir eşleşti: 10, 6, 4) [Kesin]. Grid'in 6. satırın altında devam edip etmediği: profil sayacı **18 gönderi** diyor, yani görünen 18 gönderi hesabın tamamı [Kesin].

---

## 1) Yönetici özeti — en rahatsız edici 3 bulgu

0. **Dil Çeviri carousel'ı (#14, 5 slayt) kanıtsız sayısal sonuç iddiaları içeriyor ve aynı iddia web sitenizde de yayında.** [Kesin: görsel + `index.html:841`]
   - Slayt 4: "Sipariş süresi %40 kısaldı", "Yabancı masalardan %60 daha fazla satış alındı", "turistlerin %87'si tekrar geldi". Slayt 5: "Satışlarınızı %150 arttıracak".
   - Hesapta 4 takipçi, 0 müşteri/referans paylaşımı var; repoda bu sayıların hiçbir kaynağı yok (`CONTENT_STRATEGY.md §1.11`: kanıtsız yüzde yasak). Bunlar ölçülmüş sonuçlarsa kaynağını gösterin; değilse yanıltıcı reklam riski (Reklam Kurulu/tüketici mevzuatı) bu gönderiden çıkar. [Muhtemel]
   - Aynı "%87" cümlesi `anasite/index.html:841` (Çoklu Dil bölümü) içinde de duruyor ve `qrmo-gold-underline` ile altı çizili (`CLAUDE.md` kuralı da ihlal). Siteye dokunmadım; karar sizin.
   - Slayt 3: "devrim oldu" (`§7` yasaklı kelime), "20'den fazla dil" (bio/pinned'da "15+", kodda 30: üç farklı sayı), "yapay zekanın gücünü arkamıza aldık" çeviri için yanlış.
1. **Yayınladığınız modül iddialarından en az ikisi ürününüzle çelişiyor ve herkese açık.** [Kesin]
   - "AI Destekli Dil Çeviri Modülü": `qr-ceviri` modülünde harici çeviri API çağrısı yok; çeviriler elle/CSV ile girilir. `llms.txt` ve `CONTENT_STRATEGY.md §1.1/§6.3` bunu açıkça "otomatik çeviri yapılmaz" diye yazıyor.
   - "Google Puanlarınızı Yükseltecek Modül" + "Memnun Müşteri Google'da 5 Yıldız Verir, Şikayetleri Size Yönlendirir": bu, review gating'in kendisi. `CONTENT_STRATEGY.md §8` bu çerçeveyi yasaklıyor; Google politikası riski [Muhtemel], riski kullanan işletme taşır.
   - Bu iki gönderi, restoran sahibine ürünün yapmadığını vaat ediyor. Önce bunlar düzeltilmeli, sonra yeni içerik.
2. **Hesabın sorunu içerik kalitesi değil dağıtım: 4 takipçi, 22 takip, 18 gönderi** [Kesin, profil]. 18 gönderide toplam 279 görüntülenme, ortalama 15,5, medyan 12,5, en yüksek 36 [Kesin, ekran]. Grid'de **sıfır Reels** ve **sıfır ürün ekranı** var [Kesin]. Tasarım güzel, ama algoritmanın ve restoran sahibinin görebileceği hiçbir hareketli ürün kanıtı yok.
3. **Sorun dili üstünlüğü varsayımınız bu veriyle desteklenmiyor.** 5 modülün 5'inde de özellik dili (koyu karo) sorun dilinden (krem sol karo) fazla görüntülendi (ort. 19,8 vs 12,0). Ancak koyu karolar muhtemelen carousel; format ile dil karışmış durumda, n=5 ve mutlak fark ≤27 görüntülenme. Sonuç: "sorun dili daha iyi" demek de, "özellik dili daha iyi" demek de bu veriyle yapılamaz; plan bunu test etmek için tasarlandı.

Ek bulgu: **Akıllı QR Kod** gönderisinin alt satırı AI Chatbot'un metninin kopyası ("Müşterinin Aklındaki Her Soruyu Anında Yanıtlayıp Satış Yapıyor") [Kesin, görsel].

---

## 2) Profil denetimi

Profil başlığı: ad alanı "QR MENÜ | DİJİTAL ÇÖZÜMLER", kategori "Restoran", **18 gönderi · 4 takipçi · 22 takip**, link `qrmenuofficial.com ve 2 diğer`, "Banner ekle" kullanılmamış, 4 highlight (Yeni, Merak Edilenler, Nasıl çalışır?, QR MENÜ). Mevcut bio (136 karakter):
```
QR Menü | Restoran Dijital Menü
✨ AI chatbot & Restoran analizi
✨ AI dil çevirisi & Yorum Feedback
✨ Premium Menü & garson hesap çağırma
```

| Alan | Puan | Gerekçe | Düzeltme |
|---|---|---|---|
| Profil fotoğrafı | 8/10 | Koyu yeşil zeminde altın "QR", küçük boyutta da okunuyor; marka paletiyle uyumlu [Kesin]. | Değiştirme. |
| Kullanıcı adı / ad alanı | 6/10 | `qrmenuofficial` net, ancak "Official" için doğrulanabilir bir dayanak (rozet/site bağlantısı) yok. Ad alanı "QR MENÜ \| DİJİTAL ÇÖZÜMLER": "dijital çözümler" jenerik, arama kelimesi değil; "restoran/kafe" geçmiyor. | "QR Menü Official · Restoran & Kafe" (yalnızca kategori etiketi "Restoran" var, kafe yok). |
| Bio | 4/10 | Satırlar liste, ama: "AI dil çevirisi" yanlış (kodda çeviri yok); "Premium Menü" ne demek belli değil; hedef (restoran/kafe sahibi) ve eylem (demo, DM) yok; "garson hesap çağırma" tek başına anlamsız. 3 saniyede "QR menü + bir şeyler" anlaşılıyor, "neden ben" anlaşılmıyor. | Aşağıdaki 3 alternatif. |
| Link | 5/10 | Ana site + 2 ek; hangileri olduğu görünmüyor. Tek link olmadığı için tıklama dağılıyor, niyetli ziyaretçiye demo yolu belli değil. | İlk link `canli-menu/` (demo) olsun; ikincisi `paketler/`. |
| Highlights | 6/10 | Kapaklar tutarlı ve özenli (soru işareti, kişiler, QR ikonları) [Kesin]. İçerikleri görünmüyor. "Nasıl çalışır?" ve "Merak Edilenler" doğru seçim. | "Canlı Demo", "Servis Paneli", "Paketler/SSS" ekle; her birine gerçek ekran kaydı koy. |
| Sabit gönderiler | 4/10 | 3 karo tek cümleyi bölüyor; tek başına anlamsız. Orta karodaki "ÜCRETSİZ DEMO İÇİN DM" doğrulanmamış bir ücretsiz akış vaat ediyor (`§9`); "Baskı maliyeti sıfır" kanıtsız. | Sabitleri ürün turu Reels, modül haritası, canlı demo ile değiştir. |
| Grid görsel bütünlüğü | 8/10 | Yeşil-altın-krem palet ve çerçeve tutarlı, 3'lü şablon. Zayıf: tek tip, ürün ekranı yok, küçük metinler grid'de okunmuyor. | Şablonu koru, her sete 1 gerçek ekran karosu ekle. |
| Sosyal kanıt / güven | 2/10 | 4 takipçi, müşteri/referans yok, yorum/etkileşim yok; buna karşın gönderilerde %87/%150 gibi sonuçlar. Güvenilirlik **düşürüyor**. | Sayıları kaldır; ilk müşteri alıntısını yazılı izinle ekle. |
| Kurumsal algı | 3/10 | Tasarım düzgün; iddia kalitesi, takipçi sayısı ve kopya/yazım hataları ("Arttıracak", "Her Masayı Tek Tek yöneten qr kod") düşürüyor. | İddia temizliği → ürün ekranı → referans. |

Tipografi notu: gönderilerde serif başlık + sans gövde kullanılıyor [Kesin, görsel]; site `CLAUDE.md` kuralı yalnızca Manrope. Sosyal ve site arasındaki fark bilinçli mi, bilmiyorum; kurumsal bütünlük için karar verilmeli [Muhtemel].

### Bio alternatifleri (≤150 karakter; Python `len` ile sayıldı, emoji 1 sayıldı)

| | Metin | Karakter |
|---|---|---|
| A | `Restoran & kafeler için QR menü. Garson/hesap çağrısı, menü asistanı, 30 dile kadar menü, yorum toplama. Demo için DM 👇` | 119 |
| B | `QR menü + masa servisi: garson çağrısı Servis Paneli'ne düşer, menü asistanı soruları yanıtlar. Demo için DM` | 108 |
| C | `Menüyü baskısız güncelleyin, garson çağrısını tek ekranda görün. Restoran & kafe QR menü sistemi. Demo için DM 👇` | 112 |

Dayanak: 30 dil kodu `qr-ceviri/ceviri.php`'de, garson/hesap çağrısı Servis Paneli'ne `qr-servis-paneli`'nde, asistan `qr-chatbot`'ta [Kesin]. "Ücretsiz demo" bilinçli yazılmadı: demo akışının ücretsiz olduğu doğrulanmamış (`CONTENT_STRATEGY §9`). Sayfada şu an "ÜCRETSİZ DEMO" yazıyorsa teyit edin.

---

## 3) Gönderi × modül matrisi

Numara: grid sırası, soldan sağa, yukarıdan aşağıya (en yeni → eski varsayımı [Tahmin]). Format: krem karo = tek görsel, koyu modül karosu = carousel [Muhtemel; ikon ayırt edilebiliyor, slayt sayısı yok]. Caption, CTA metni, etkileşim (beğeni/kaydet/paylaşım), kanıt: caption/Insights girdisi olmadığından **veri yok**; "CTA" sütunu yalnızca görselin içindekini belirtir.

| # | Başlık | Format | Modül | Hedeflenen sorun | Değer önermesi net mi | CTA (görselde) | Görüntülenme | Kanıt (ekran/müşteri/sayı) | Dil |
|---|---|---|---|---|---|---|---|---|---|
| 1 | MENÜNÜZÜ (sabit) | tek görsel | Genel | — | Hayır, tek başına anlamsız; "Baskı maliyeti sıfır" doğrulanmamış | Yok | 16 | Yok | Fayda |
| 2 | DİJİTALE (sabit) | tek görsel | Genel (çeviri + asistan) | — | Kısmen; "15+ dil · AI menü asistanı" | "Ücretsiz demo için DM" | 27 | Yok | Özellik |
| 3 | TAŞIYIN (sabit) | tek görsel | Garson & masa | — | Kısmen | Yok | 36 | Yok | Özellik |
| 4 | Garsonunuz Her Masaya Öneri Yapamıyor | tek görsel | AI Chatbot | Öneri/satış kaçırma | Evet, net | Yok | 29 | Yok | Sorun |
| 5 | AI CHATBOT | carousel | AI Chatbot | — | Kısmen; "Her soruyu anında yanıtlayıp satış yapıyor" aşırı iddia (`§6.1`) | Yok | 36 | Yok | Özellik |
| 6 | Her Masa Bir Satış Temsilcisi | tek görsel | AI Chatbot | — | Orta; "tesadüf değil, sisteme bırakılır" | Yok | 14 | Yok | Fayda |
| 7 | En Sık Duyulan Şikayet: "Garson Gelmedi" | tek görsel | Garson & Hesap | Garson geç/gelmiyor | Evet, en net sorun cümlesi | Yok | 11 | Yok (şikâyet "en sık" iddiası kanıtsız) | Sorun |
| 8 | GARSON & HESAP BİLDİRİM MODÜLÜ | carousel | Garson & Hesap | — | Kısmen; "anında ulaşıyor" iddiası: çağrı Servis Paneli'ne düşer, ulaşma hızı personele bağlı | Yok | 21 | Yok | Özellik |
| 9 | Aynı Ekiple, Daha Fazla Masa | tek görsel | Garson & Hesap | — | Orta; sonuç vaadi kanıtsız | Yok | 8 | Yok | Fayda |
| 10 | Bir Kötü Yorum, Aylarca Karşınıza Çıkar | tek görsel | Yorum & Feedback | Kötü yorumun görünürlüğü | Evet | Yok | 11 | Yok | Sorun |
| 11 | YORUM & FEEDBACK MODÜLÜ | carousel | Yorum & Feedback | — | Kısmen; "Google puanınızı yükseltecek" ve "5 yıldız Google'a, şikâyet size" = review gating, §8'e aykırı | Yok | 15 | Yok | Özellik |
| 12 | Güven, Yorumlarla İnşa Edilir | tek görsel | Yorum & Feedback | — | Orta | Yok | 9 | Yok | Fayda |
| 13 | Personeliniz Menüyü Kaç Dilde Anlatabiliyor? | tek görsel | Dil/Çeviri | Personel tercümanlığı | Evet, güçlü | Yok (caption: "Yoğun bir akşam. Masaya oturan misafir menüye bakıyor ama hiçbir şey anlamıyor…", 4 Ağustos; CTA bilinmiyor) | 4 | Yok | Sorun |
| 14 | AI DESTEKLİ DİL ÇEVİRİ MODÜLÜ | carousel, 5 slayt, müzikli ("haciproductionsplus · Orijinal ses") | Dil/Çeviri + modül paketi | Turist siparişi, el kol hareketi, düşük Google/TripAdvisor puanı | **Yanlış/kanıtsız**: "AI destekli", %40/%60/%87/%150 (bkz. §3.1) | Son slaytta "iletişime geçin", kanal/link yok; caption: "Turist masası oturdu. Garson menüyü el kol hareketiyle anlatmaya çalışıyor…" (22 Temmuz) | 10 | Sayı var ama kaynaksız | Karışık |
| 15 | Turistin Tercih Ettiği İşletme Olursunuz | tek görsel | Dil/Çeviri | — | Orta; sonuç vaadi kanıtsız | Yok (caption: "Bir turist için yemek seçmek sadece açlık meselesi değildir…", 4 Ağustos) | 6 | Yok | Fayda |
| 16 | Masa Sayınız Artsa da Sistem Sizi Yormaz | tek görsel | Akıllı QR Kod | Masa artınca yönetim yükü | Orta | Yok | 5 | Yok | Sorun |
| 17 | AKILLI QR KOD MODÜLÜ | carousel | Akıllı QR Kod | — | Kısmen; **chatbot metninin kopyası** slaytta | Yok | 17 | Yok | Özellik |
| 18 | Sınırsız Masa, Sınırsız QR Kod | tek görsel | Akıllı QR Kod | — | "Sınırsız" doğrulanmadı: kodda toplu oluşturma azami 200 (`class-qmo-masalar.php: TOPLU_AZAMI`), toplam sınır bilinmiyor; "saniyeler içinde" `§7` yasağı | Yok | 4 | Yok | Fayda |

### 3.1 Gönderi #14 slayt slayt (Dil Çeviri carousel, 22 Temmuz, 10 görüntülenme)

| Slayt | İçerik | Değerlendirme |
|---|---|---|
| 1/5 | "AI DESTEKLİ DİL ÇEVİRİ MODÜLÜ. Turistlerle dil problemini ortadan kaldıran modül." | Hook zayıf: ürün adını söylüyor, gerilim yok. "AI destekli" yanlış, "ortadan kaldıran" mutlak. |
| 2/5 | "Bu 3 soruyu kendinize sorun": yabancı dil bilmeyen garson, el kol hareketi sırasında bekleyen masalar, turistin Google/TripAdvisor'daki düşük puanı | **En güçlü slayt**: somut sahne, işletme sahibine dönük. Caption'ın hook'u ile aynı sahne (güçlü). Sorun dili burada, ama 1. slaytın arkasında kalmış. |
| 3/5 | "Yapay zekanın gücünü arkamıza aldık… 20'den fazla dil… turist müşteriler için de devrim oldu. Peki sonuçlar ne oldu? SONUÇLARI GÖRMEK İÇİN KAYDIR" | Yanlış (yapay zeka), tutarsız (20+ / 15+ / 30), yasaklı kelime ("devrim"). Kaydırma tuzağı: sonuçlar kanıtsız. |
| 4/5 | "Sipariş süresi %40 kısaldı; yanlış anlaşılan sipariş süreci bitti; yabancı masalardan %60 daha fazla satış alındı; garsonların yükü azaldı; turistlerin %87'si tekrar geldi" | Kaynaksız sonuç iddiaları. Çeviri modülü sipariş süresini ölçmez; kodda bu metriklerin hesabı yok (`qr-analiz` "kasa satış verisi değildir"). |
| 5/5 | "Dil çeviri modülü değil, işletmenizin satışlarını %150 arttıracak birden fazla modül barındıran QR menü için iletişime geçin." | Çelişki: gönderi başlığı "dil çeviri modülü", son slayt "dil çeviri modülü değil". Gri arka plan modül listesi (Alerji Bilgisi, Akıllı Analiz, Ürün Görselleri...) okunmuyor. CTA yönlendirmesi yok (DM/link/telefon). "Arttıracak" yazım hatası. |

Kanıt durumu: slayt 4 ve 5'teki rakamların dayanağı bu repoda yok. Gerçek ölçümse kaynak (işletme, dönem, ölçüm yöntemi) belgelenip izinle yayınlanmalı. Aksi halde slaytlar kaldırılmalı.

Diğer: müzik/ses başka bir hesaptan alınmış ("haciproductionsplus · Orijinal ses"). İçeriği kim üretti ve ses izinli mi, sorulmalı [Tahmin: üçüncü taraf prodüksiyon].

### Çıkarımlar

**Modül başına toplam görüntülenme (3 gönderi):** AI Chatbot 79 · Garson & Hesap 40 · Yorum & Feedback 35 · Akıllı QR Kod 26 · Dil/Çeviri 20. Genel sabit set: 79. [Kesin]
- Her modüle eşit (3'er) gönderi ayrılmış; "en çok anlatılan" sayıyla yok, ilgiyle AI Chatbot, "en az" Dil/Çeviri.
- Dil/Çeviri hem en düşük ilgiyi alıyor hem de en yanlış iddiayı taşıyor.

**Kodda var, hiç anlatılmamış** [Kesin, kod + grid]: Servis Paneli (garson çağrısı gönderisi onu adlandırmıyor), Menü Mühendisliği (`qr-menu-muhendisligi`: maliyet + satış → Kasavana–Smith matrisi), İstatistikler (`qr-analiz`), Akıllı Filtreleme/alerjen (`restoran-menu` filtre sınıfı), Kampanya & Kombo, Porsiyon/Ekstra, Tükendi etiketi, Fotoğraf Galerisi, Açılış Ekranı, Çalışma Saatleri, Masa Oturum Güvenliği, personel rolü (yalnızca Servis Paneli görür), QR ile sipariş. En güçlü anlatılmamış üçlü: **Menü Mühendisliği, İstatistikler, Servis Paneli**.
`llms.txt`'e göre Menü Asistanı, Yorum, Analitik, Mühendislik **Plus** paketinde (2.990 TL/ay); Servis Paneli/Garson çağrısı **Pro**'da [Muhtemel, site belgesi]. Hesap en pahalı paketin özelliklerini ön plana çıkarıyor ama ucuz paketin değer önermesini (baskısız güncelleme, alerjen filtresi) hiç kurmuyor.

**Özellik dili vs sorun dili vs fayda dili (ortalama görüntülenme, n=5'er):**

| Dil | Değerler | Ort. | Medyan |
|---|---|---|---|
| Özellik ("MODÜL") | 36, 21, 15, 10, 17 | 19,8 | 17 |
| Sorun | 29, 11, 11, 4, 5 | 12,0 | 11 |
| Fayda/sonuç | 14, 8, 9, 6, 4 | 8,2 | 8 |

5/5 çiftte özellik > sorun; fayda dili en zayıf. Uyarı: format karışmış (carousel vs tek görsel), n küçük, sıralama etkisi (konum, sabit karolara yakınlık) bilinmiyor. [Muhtemel] yön: **fayda/sonuç dili** (kanıtsız vaat) en zayıf halka; en güvenilir bulgu bu.

**Tekrar eden zayıflıklar** [Kesin, görsel]:
1. 18/18 gönderide gerçek ürün ekranı yok; yalnızca tipografi.
2. 0 Reels, 0 video.
3. Aynı şablonun 15 kez tekrarı; grid yatay sütunlarda tutarlı, ama yeni bilgi vermiyor.
4. 18/18'de görselde CTA yok (sabit #2 hariç).
5. Aşırı/doğrulanmamış iddialar: "anında", "sınırsız", "saniyeler içinde", "baskı maliyeti sıfır", "her soruyu", "tercih ettiği işletme olursunuz".
6. Küçük etiket metinleri (modül adı satırı) grid boyutunda okunmuyor.
7. Sosyal kanıt yok: müşteri, işletme adı, gerçek kullanım verisi, yok.
8. Slayt içi kopya hata (QR Kod karosunda chatbot cümlesi).

---

## 4) Rekabet konumlandırması

Rakip hesap adı verilmedi: bu bölüm "diğer QR menü firmalarının tipik gönderisi" varsayımıyla yazıldı **[Tahmin]**. Rakip adlarını gönderirseniz aynı kriterlerle yeniden karşılaştırırım.

**[Tahmin] Tipik rakip gönderisi:** tek görsel, "dijital menü" + QR kod vitrini, fiyat/kampanya, bazen müşteri logosu; ürün-içi derinlik anlatılmaz.

**Bizi ayıran 3 gerçek fark (kodla doğrulanmış) [Kesin]:**
1. **Masa operasyon döngüsü:** garson/hesap/sipariş çağrıları tek Servis Paneli'ne düşer; masaüstü bildirimi (`Notification`, `panel.js`) ve kodda üretilen sesli uyarı tonu (`sesAcik`) var; garson/mutfak için "yalnızca Servis Paneli" rolü (`class-qrms-sp-rol.php`).
2. **İnsan+bot hibrit menü asistanı:** Gemini tabanlı, cevaplayamadığı soruları ayrı ekranda raporlar (`sayfa-cevaplanamayan.php`), personel canlı sohbeti devralabilir (`ajax-canli-sohbet.php`).
3. **Veriden karar:** Menü Mühendisliği, işletmenin girdiği maliyet ve reçeteyi satış/etkileşim verisiyle birleştirip her ürünü Yıldız/Çok Satan/Gizli Fırsat/Zayıf kutusuna koyar ve aksiyon cümlesi üretir (`qr-menu-muhendisligi/module.php`). Yorum modülü ayrıca kriter bazlı puan trendi ve masa/vardiya/saat raporu ile düşüş uyarısı sunar (`qr-menu-reviews.php` 4.2.3/4.2.4).

**Rakiplerin kopyalayamayacağı alan:** işletmenin kendi verisiyle çalışan panel ekranları ve onların kayıtlı kullanımı. Bunu kopyalamak için ürün derinliği gerekir; ama bu ancak **gösterilirse** fark olur: şu an hesapta sıfır panel ekranı var. [Muhtemel]

**Kurumsal güven eksikleri:** müşteri/işletme referansı yok; canlı demo menü bağlantısı grid'de görünmüyor (site `canli-menu/` var); fiyat/paket görünmüyor; ekip/yüz yok; kanıtsız iddialar; iletişim ve link durumu bilinmiyor (bio yok). [Kesin: grid'de yok; bio: veri yok]

---

## 5) 30 günlük takvim

Başlangıç: Pzt 23 Kasım 2026. Haftada 3 içerik: 2 Reels (ürün ekran kaydı) + 1 carousel; carousel haftada 1 kez **sosyal kanıt** slotu olarak kullanılır (Hafta 2 ve 4); 1. ve 3. haftada carousel modül özeti. Sosyal kanıt = gerçek ekran/demo verisi ya da yazılı izinli müşteri alıntısı; müşteri alıntısı yoksa "demo menü gerçek ekran" kullanılır; uydurma müşteri/sayı yok. (Brief'teki "1 sosyal kanıt" ifadesini böyle yorumladım.)

Saatler [Tahmin]: restoran sahibi öğle yoğunluğundan sonra (15:00–17:00) ya da servis öncesi (11:00) telefona bakar; 4 haftada bu iki dilimi dene, Insights'a göre sabitle.

| Hf | Gün | Tarih/saat | Format | Modül | Konu (sorun cümlesi) |
|---|---|---|---|---|---|
| 1 | Pzt | 23.11 15:30 | Reels | Servis Paneli | "Garson gelmedi" şikâyeti |
| 1 | Çar | 25.11 15:30 | Reels | Menü Asistanı | Aynı soruyu 20. kez cevaplamak |
| 1 | Cum | 27.11 11:30 | Carousel | Düzeltme + modül haritası | Ne yapıyoruz, ne yapmıyoruz |
| 2 | Pzt | 30.11 15:30 | Reels | Çoklu Dil | Turist menüyü anlamıyor |
| 2 | Çar | 02.12 15:30 | Reels | Menü Mühendisliği | Hangi ürün gerçekten kazandırıyor? |
| 2 | Cum | 04.12 11:30 | Carousel (kanıt) | Servis Paneli/Asistan | Gerçek ekran dökümü |
| 3 | Pzt | 07.12 15:30 | Reels | Yorum & Feedback | Hangi kriterde puan düşüyor? |
| 3 | Çar | 09.12 15:30 | Reels | Akıllı Filtreleme | Alerjen soran misafir |
| 3 | Cum | 11.12 11:30 | Carousel | QR Masa | Masa sayısı artınca yönetim |
| 4 | Pzt | 14.12 15:30 | Reels | İstatistikler | Menüde aranıp bulunamayanlar |
| 4 | Çar | 16.12 15:30 | Reels | Masa Oturum Güvenliği | Masa linki başkasının eline geçerse |
| 4 | Cum | 18.12 11:30 | Carousel (kanıt) | Canlı demo | Demo menüyü kendiniz deneyin |

> Not: 30 günlük pencere 22.12'ye kadar; kalan günler Insights değerlendirmesi.

### İçerik kartları

Ortak kural: hiçbir içerikte "anında", "saniyeler içinde", "sınırsız", "otomatik çeviri/AI çeviri", "Google puanınızı yükseltin", yüzde/oran, "ücretsiz" geçmez. Hook'lar sorun cümlesiyle açılır (ilk 2 sn), özellik adı ikinci saniyede ekrana gelir; böylece sorun-dili vs özellik-dili testi kontrollü yapılır.

**1. Servis Paneli (Reels)**
- Sorun: "Garson gelmedi" şikâyeti.
- Hook (0-2 sn): masada el sallayan müşteri → metin "Garson gelmedi."
- Senaryo: müşteri masa QR'ından "Garson çağır"a basar → panelde çağrı düşer, masa adı görünür → personel çağrıyı karşılar.
- Ekran: yönetim paneli **QR Menü › MENÜ › Servis Paneli** (canlı sipariş/çağrı panosu) + müşteri tarafı garson/hesap butonları (`qr-chatbot`/menü). Demo masada çek; masa adı gerçek.
- Caption: "Çağrı kaybolmasın diye tek ekran. Garson ve hesap çağrıları Servis Paneli'ne düşer; bildirim ve ses ayarı açıksa personel ekranı sürekli izlemek zorunda kalmaz. Demo için DM."
- CTA: "Demo için DM'e 'panel' yazın."
- Hashtag: #qrmenu #restoran #kafe #restoranyönetimi #dijitalmenü
- Metrik: 3 sn izlenme tutma, kaydetme, DM "panel".

**2. Menü Asistanı (Reels)**
- Sorun: Personelin aynı soruyu tekrar tekrar cevaplaması.
- Hook: "Bu soruyu bu hafta kaç kez cevapladınız?" (alerjen/porsiyon sorusu)
- Senaryo: müşteri asistana soru yazar → menü verisine göre yanıt → bilemediği soru → **Cevaplanamayan Sorular** ekranına düşer → personel görüşmeyi devralır.
- Ekran: **AI Menü Asistanı ayarları**, **Chatbot Geçmişi** ve **Cevaplanamayan Sorular** (`qrms-chatbot-unanswered`).
- Caption: "Asistan menünüzdeki bilgiyle yanıtlar; bilemediğini kaydeder, gerekirse personel devralır. 'Her soruyu bilir' demiyoruz, bilmediğini size söyler."
- CTA: DM "asistan". Hashtag: #qrmenu #restoran #kafe #menüasistanı #işletmeyönetimi
- Metrik: kaydetme/paylaşım oranı, yorumda "nasıl çalışıyor" soruları.

**3. Carousel — Düzeltme + modül haritası (kurumsal güven)**
- Sorun: Müşteri, hangi modülün ne yaptığını bilmiyor.
- Hook (1. slayt): "QR menü sadece menü değildir. 13 modül, 3 paket."
- Slaytlar: sorunun → modül adı → panelde nerede? (gerçek ekran). Çeviri slaytı: "Dilleri siz tanımlarsınız (elle/CSV), 30 dile kadar." Yorum slaytı: "puan ve yorumlar panelde toplanır."
- Ekran: panel sol menü (MENÜ/ANALİZ/MÜŞTERİ DENEYİMİ) ekran görüntüsü.
- Caption: dürüst düzeltme tonu: "Çeviri modülümüz otomatik çeviri yapmaz; dillerinizi siz girersiniz. Bunu net yazmak istedik."
- CTA: "Paketleri görmek için profildeki link." Hashtag: #qrmenu #restoran #kafe #dijitalmenü #restoranteknolojisi
- Metrik: kaydetme, link tıklaması, profil ziyareti.
- Ön koşul (bu takvimden ÖNCE, 23.11'e kadar): #14'ün 3-5. slaytlarını (%40/%60/%87/%150, "AI/yapay zeka", "devrim") ve #11'in review gating ifadesini kaldır ya da gönderiyi arşivle; Instagram'da slayt silinemez, gönderi yeniden yüklenmeli. Sitede `index.html:841` %87 cümlesini aynı gün kaldır.

**4. Çoklu Dil (Reels)**
- Sorun: Personel turiste menüyü anlatmak zorunda.
- Hook: turistin telefona baktığı sahne + "Menüyü anlayamıyorum."
- Senaryo: dil seçici → Türkçe ad + kısa açıklama kendi dilinde; panelde **Diller & Çeviriler** tablosunda girişler (CSV içe aktarma).
- Ekran: **Diller & Çeviriler** tablo ekranı; müşteri menüsünde dil değişimi.
- Caption: "Dilleri siz tanımlarsınız, çeviriyi elle ya da CSV ile girersiniz; müşteri kendi dilinde okur. 30 dile kadar."
- CTA: canlı menüyü telefonunuzda deneyin (profil linki, UTM'li); ikincil DM "menü". Ayrıntı: `analiz/video/ses-metni.md`. Hashtag: #çokludilmenü #turizm #restoran #qrmenu #kafe
- Metrik: izlenme tutma, paylaşım, DM.

**5. Menü Mühendisliği (Reels)**
- Sorun: Hangi ürün gerçekten kazandırıyor?
- Hook: "En çok sattığınız ürün en kârlınız mı?"
- Senaryo: ürüne maliyet girilir (manuel/reçete) → matris açılır → Yıldız/Gizli Fırsat/Zayıf kutuları → aksiyon cümlesi.
- Ekran: **Menü Mühendisliği › Rapor** + **Ürün maliyetleri** (`qrms-mm-rapor`). Demo verisi açıkça "örnek veri" etiketli.
- Caption: "Maliyetinizi siz girersiniz; sistem satış ve etkileşimle birleştirip her ürünü bir kutuya koyar. Maliyet girmezseniz rapor anlamlı olmaz."
- CTA: DM "mühendislik". Hashtag: #menümühendisliği #restoran #kafe #kârlılık #qrmenu
- Metrik: kaydetme, profil ziyareti (en yüksek niyet).

**6. Carousel (sosyal kanıt) — Gerçek ekran dökümü**
- Sorun: "Gerçek mi, mockup mı?"
- Slaytlar: Servis Paneli, Asistan geçmişi, Masalar, Yorum raporu: etiketli gerçek ekran (demo hesap, "demo verisi" notu).
- Müşteri alıntısı varsa: yazılı izin + işletme adı; yoksa slot koyma, uydurma.
- Caption: "Mockup değil, panelden ekran görüntüleri." CTA: "Canlı menüyü inceleyin: profildeki link." Hashtag: #qrmenu #restoran #kafe #dijitalmenü #demo
- Metrik: kaydetme, link tıklaması.

**7. Yorum & Feedback (Reels)**
- Sorun: Hangi kriterde (hizmet, temizlik…) puan düşüyor?
- Hook: "Ortalama puan iyi ama sorun nerede?"
- Senaryo: kriter bazlı puan, trend grafiği, düşüş uyarısı kutusu, masa/saat raporu.
- Ekran: **Yorumlar & Geri Bildirim › Rapor** (`?view=rapor`, kriter trendleri).
- Caption: "Ortalama puan sorunu göstermez. Kriter ve saat bazlı raporla nerede düştüğünü görün." **Review gating anlatılmaz**; ürün/pazarlama kararı (`CONTENT_STRATEGY §8.1`) netleşene kadar.
- CTA: DM "yorum". Hashtag: #müşterigeribildirimi #restoran #kafe #qrmenu #hizmetkalitesi
- Metrik: kaydetme, yorum/DM.

**8. Akıllı Filtreleme (Reels)**
- Sorun: Alerjeni olan misafir hangi ürünü yiyebilir?
- Hook: "Glutenim var, ne yiyebilirim?"
- Senaryo: menüde filtre seçimi → uygun ürünler. Not: filtre, ürüne girilen bilgiye bağlı (`§1.5`).
- Ekran: müşteri menüsü filtre çubuğu + **ürün düzenleme** ekranında alerjen alanı (`class-filtre.php`).
- Caption: "Filtre, ürünlere girdiğiniz bilgiye dayanır; içerik otomatik algılanmaz."
- CTA: DM "filtre". Hashtag: #alerjen #restoran #kafe #qrmenu #dijitalmenü
- Metrik: paylaşım, kaydetme.

**9. QR Masa (Carousel)**
- Sorun: Masa sayısı artınca yönetim yükü.
- Slaytlar: Masalar ekranı → toplu masa oluşturma (tek seferde en fazla 200, `TOPLU_AZAMI`) → masaya özel QR; her masa panelde ayrı görünür.
- Ekran: **QR Kodlar › Masalar**.
- Caption: "Her masa ayrı QR; çağrı ve sipariş masa adıyla gelir." "Sınırsız" yok.
- CTA: profildeki link. Hashtag: #qrkod #restoran #kafe #masayönetimi #qrmenu
- Metrik: kaydetme, link tıklaması.

**10. İstatistikler (Reels)**
- Sorun: Müşteri menüde ne arıyor, ne bulamıyor?
- Hook: "Menünüzde arayıp bulamayanlar ne diyor?"
- Senaryo: arama kelime raporu, ürün tıklamaları, görüntüleme. Not: kasa satış verisi değildir (`llms.txt`).
- Ekran: **Menü Analizleri** (`arama-kelime.php`, `urunler-sayfasi.php`).
- Caption: "Menüde bulunamayan aramalar, yeni ürünün sinyali olabilir."
- CTA: DM "analiz". Hashtag: #menüanalizi #restoran #kafe #qrmenu #işletme
- Metrik: kaydetme, DM.

**11. Masa Oturum Güvenliği (Reels)**
- Sorun: Masa linki başkasının eline geçerse?
- Hook: "Masanın linkini ekran görüntüsüyle paylaşırsa?"
- Senaryo: imzalı, süreli oturum; kayıtlı olmayan masada "Oturum Gerekli" ekranı; süre ve hareketsizlik limiti işletme ayarlı (varsayılan 90/30 dk).
- Ekran: **Masa Oturumu Güvenliği** ayarları + "Oturum Gerekli" müşteri ekranı.
- Caption: mekanizmayı anlat, "hacklenemez/%100" kullanma (`§6.4`).
- CTA: DM "güvenlik". Hashtag: #qrmenu #restoran #kafe #güvenlik #dijitalmenü
- Metrik: kaydetme, yorum.

**12. Carousel (sosyal kanıt) — Canlı demo**
- Sorun: Satın almadan ürünü görmek.
- Slaytlar: `canli-menu/` demo menüleri, hangi paket hangi özelliği içerir (`paketler/`).
- Caption: "Demo menüyü kendiniz deneyin." CTA: profildeki link. Hashtag: #qrmenu #restoran #kafe #canlıdemo #dijitalmenü
- Metrik: link tıklaması, profil ziyareti.

---

## 6) Ölçüm planı

Başlangıç değerleri (ekran): **4 takipçi**, 18 gönderi, görüntülenme medyanı **12,5**, ortalama 15,5, en yüksek 36 [Kesin]. Diğer metrikler (erişim, kaydetme, paylaşım, profil ziyareti, link tıklaması): **veri yok**; 1. hafta sonunda Insights'tan alınıp bu tabloya yazılmalı.

| Metrik | Kaynak | Eşik (karar kuralı) [Tahmin] |
|---|---|---|
| Reels izlenme (ilk 7 gün) | Insights | ≥ 2× mevcut medyan (≥ 25); 3 üst üste altında kalırsa hook'u değiştir |
| 3 sn tutma oranı | Insights › Reels | İlk 4 Reels'in medyanı baz; sonraki Reels'te baz altında kalan hook çıkar |
| Kaydetme + paylaşım / erişim | Insights | Modül Reels'i bazın üstündeyse seri devam; carousel için kaydetme birincil |
| Profil ziyareti / erişim | Insights | Hafta 2'den sonra yükselmiyorsa bio/sabitler gözden geçirilir |
| Link tıklaması | Insights | Sıfırsa link/CTA kuyruğu ya da bio sorunu |
| DM sayısı (anahtar sözcük: panel, asistan, dil…) | Elle sayım | Hangi modül kelimesi en çok DM alıyorsa 2. ay önceliği o |
| Sorun vs özellik dili testi | Haftalık karşılaştırma | 4. hafta sonu: aynı modülün 2 dili arasında fark ≥ 2× ise kazananı yaz; yoksa "ayırt edilemiyor" |
| Takipçi artışı | Profil | Hafta başı sayı yaz; 4 takipçide yüzde değil mutlak artış izle (hedef [Tahmin]: ay sonunda ≥ 25 gerçek işletme hesabı) |
| İddia denetimi | Elle | Yayın öncesi kontrol listesi: yasaklı kelime yok, ekran gerçek, kod dayanağı var |

Sonuç değerlendirme tarihi: 22 Aralık 2026.

---

## Son kontrol

- Grid'den okunan sayılar (görüntülenme) ekranla eşleşiyor; hesaplanan toplam/ortalama/medyan matrisle yeniden toplandı: toplam 279, 18 gönderi, ortalama 15,5, medyan 12,5.
- Koddan doğrulanan iddialar: 30 dil kodu, çeviri API çağrısı yok, Gemini çağrısı, cevaplanamayan soru ve canlı sohbet devralma, Servis Paneli `Notification` ve ses tonu, review gating varsayılan 3,5 ve ödül sistemi varsayılan kapalı, Menü Mühendisliği matrisi, kriter trend/düşüş uyarısı, toplu masa azami 200.
- Doğrulanamayanlar silindi ya da etiketlendi: "sınırsız masa", "baskı maliyeti sıfır", "anında", müşteri/rakip verisi, yayın saati [Tahmin], paket eşlemesi site belgesine dayanır [Muhtemel].
- Planda sayısal iddia yok; gösterilecek her sayı "demo verisi" etiketli olmalı.
