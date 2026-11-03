/* =========================================================
   "Ürün sahnesi" (qrmo-apple) şablonu — diğer modüllerin sunum verisi.
   Şablon: Restoran Menü (module-data.js). Burada yalnızca içerik vardır; düzen ve
   hareket module-apple.css / module-apple.js'tedir. Her metin module-data.js'teki
   (groups, notes, faq) bilgilerle birebir uyumludur; yeni iddia eklenmez.

   Alanlar (modül başına):
     hero    : { kicker, accent, points[{ico,t}], screenChips[ekran][2] }  — ekran sırası = vitrindeki sıra
     steps   : flow adımlarına eklenir  { who, points[3] }
     gaps    : { title, rows[{now,next}] }  (ilk 3 satır görünür)
     groups  : featureGrid kartları (groups ile aynı sırada) { ico, lead }
     stats   : [[sayı, etiket]]
     chips   : kapanış CTA yüzen etiketleri (4)
========================================================= */
"use strict";

module.exports = {
  "qr-masa": {
    hero: {
      kicker: "MASA QR YÖNETİMİ", accent: "kendi QR’ı.",
      points: [{ ico: "qr", t: "Her masaya özel QR kodu" }, { ico: "grid", t: "Masaları tek seferde toplu açın" }, { ico: "download", t: "PNG, PDF ya da tek dosyada tüm masalar" }],
      screenChips: [["Her masaya özel kod", "PNG ya da PDF indirme"], ["Yazdırıp masaya koyun", "Tüm masalar tek dosyada"], ["Toplu oluşturma", "Gruba göre listeleme"], ["Ad değişse de kod aynı", "Masa bilgisi servise taşınır"]]
    },
    steps: [
      { who: "SİZ · YÖNETİM PANELİ", points: ["Ön ek ve numara aralığı yazın (ic-masa, 1–10)", "Var olan masalar atlanır", "Tek seferde en fazla 200 masa"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Her masa için ayrı QR kodu", "PNG ya da PDF olarak indirin", "QR üretimi tarayıcıda yapılır"] },
      { who: "SİZ · MASADA", points: ["Tüm masalar için tek PDF indirilir", "Masa başına bir sayfa: masa adı ve QR kod", "Çıktıyı masaya yerleştirin"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Masa adını değiştirmek QR kodun adresini değiştirmez", "Basılı kod aynı masayı göstermeye devam eder", "Masa silinirse açık oturumlar da kapanır"] }
    ],
    gaps: {
      title: "Masa QR’larında bunlar yaşanıyorsa, eksik olan bir masa yönetimi.",
      rows: [
        { now: "Her masa için QR kodu tek tek üretiyorsunuz.", next: "Ön ek ve numara aralığını yazarsınız; masalar tek seferde açılır (en fazla 200)." },
        { now: "Masa adı değişince basılı QR kodlar çöpe gidiyor.", next: "Masa adını değiştirmek QR kodun hedef adresini değiştirmez; basılı kod aynı masayı göstermeye devam eder." },
        { now: "Kodları tek tek indirip sayfa sayfa düzenliyorsunuz.", next: "Her masa için PNG ya da PDF indirir veya masa başına bir sayfalık tek bir PDF alırsınız." }
      ]
    },
    groups: [
      { ico: "grid", lead: "Masaları tek tek ya da toplu açar, gruplar ve düzenlersiniz." },
      { ico: "qr", lead: "Kodu PNG, PDF ya da tek dosyada indirirsiniz." },
      { ico: "tag", lead: "Müşteri hangi masada olduğunu görür; masa bilgisi servis özelliklerine taşınır." }
    ],
    stats: [["200", "masa tek seferde"], ["2", "indirme biçimi"], ["1", "dosyada tüm masalar"]],
    chips: [["Masa QR hazır", "PNG ya da PDF indirin"], ["Toplu masa", "Tek seferde 200’e kadar"], ["Kod değişmez", "Masa adı değişse de"], ["Tüm masalar", "Tek PDF dosyasında"]]
  },

  "coklu-dil": {
    hero: {
      kicker: "ÇOKLU DİL MENÜ", accent: "misafirin dilinde.",
      points: [{ ico: "globe", t: "30 dil, sağdan sola diller dahil" }, { ico: "download", t: "Çeviriler tek CSV dosyasında" }, { ico: "check", t: "Çevirisi eksik alan Türkçe görünür" }],
      screenChips: [["Dil seçiciyle anında geçiş", "Menü seçilen dilde açılır"], ["Çeviriler tek dosyada", "İndir, doldur, geri yükle"]]
    },
    steps: [
      { who: "MİSAFİR · TELEFONDA", points: ["Seçtiğiniz dillerden biri açılır", "Ürün, kategori ve alerjenler çevrilir", "Arapça, İbranice, Farsça sağdan sola yazılır"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["CSV’yi indirin, yalnızca dil sütunlarını doldurun", "Dosyayı yükleyin; ayraç otomatik algılanır", "Kaç çeviri yazıldığı ve eskiyenler görünür"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Çevirisi girilmeyen alan Türkçe görünür", "Otomatik makine çevirisi yapılmaz", "Çeviri kalitesi girdiğiniz metne bağlıdır"] }
    ],
    gaps: {
      title: "Menünüzde bunlar yaşanıyorsa, eksik olan bir dil yönetimi.",
      rows: [
        { now: "Yabancı misafir menüyü anlamak için garsona soruyor.", next: "Misafir, sizin seçtiğiniz dillerden birine geçer; ürün, kategori ve alerjenler o dilde görünür." },
        { now: "Çeviriler farklı dosya ve mesajlara dağılıyor.", next: "Çeviri dosyasını CSV olarak indirir, yalnızca dil sütunlarını doldurup geri yüklersiniz." },
        { now: "Çevirisi eksik alan karışıklık yaratıyor.", next: "Çevirisi girilmemiş alan Türkçe (orijinal) haliyle görünür; hangi dilde kaç çeviri olduğu panelde izlenir." }
      ]
    },
    groups: [
      { ico: "globe", lead: "Menüde göstereceğiniz dilleri seçersiniz; müşteri dil seçiciyle geçer." },
      { ico: "list", lead: "Menü içeriği ve sabit arayüz metinleri çevrilir." },
      { ico: "download", lead: "Çevirileri tek dosyada yönetirsiniz." },
      { ico: "search", lead: "Seçilen dil adreste görünür." }
    ],
    stats: [["30", "dil"], ["3", "sağdan sola dil"], ["2", "dil seçici türü"]],
    chips: [["30 dil", "Menüde seçtikleriniz"], ["Dil seçici", "Misafir kendi dilini seçer"], ["CSV çeviri", "Tek dosyada yönetin"], ["Sağdan sola", "Arapça, İbranice, Farsça"]]
  },

  "akilli-filtreleme": {
    hero: {
      kicker: "AKILLI FİLTRELEME", accent: "daha hızlı bulur.",
      points: [{ ico: "shield", t: "14 alerjeni hariç tutma" }, { ico: "sliders", t: "Kalori ve fiyat aralığı" }, { ico: "filter", t: "8 sıralama ve ürün özelliği filtreleri" }],
      screenChips: [["Alerjeni hariç tut", "Fiyat ve kalori aralığı"], ["14 alerjen kartı", "Seçilen alerjen elenir"], ["Uygulanan filtre etiketi", "Tek dokunuşla sıfırla"]]
    },
    steps: [
      { who: "MİSAFİR · MENÜDE", points: ["Alerjen, kalori, fiyat ve ürün özelliği", "Menünün üstünde arama kutusu", "8 sıralama seçeneği"] },
      { who: "MİSAFİR · MENÜDE", points: ["14 alerjen için ayrı kart", "Seçilen alerjeni içeren ürünler sonuçtan çıkar", "Sonuç sizin girdiğiniz alerjen bilgisine dayanır"] },
      { who: "MİSAFİR · MENÜDE", points: ["Seçimler “Uygula” ile menüye işlenir", "Uygulanan filtreler etiket olarak görünür", "“Sıfırla” ile hepsi temizlenir"] }
    ],
    gaps: {
      title: "Menünüzde bunlar yaşanıyorsa, eksik olan bir filtre.",
      rows: [
        { now: "Alerjisi olan misafir tüm menüyü tek tek okuyor.", next: "Alerjen kartından seçtiği alerjeni içeren ürünler sonuçtan çıkar." },
        { now: "Bütçeye ya da kaloriye göre ürün bulmak zor.", next: "En az ve en çok fiyat ile kalori aralığını girer; menü bu aralığa göre daralır." },
        { now: "Aradığı ürünü bulamayan misafir garsona soruyor.", next: "Arama kutusu, 8 sıralama seçeneği ve ürün özelliği filtreleri menüyle birlikte gelir." }
      ]
    },
    groups: [
      { ico: "filter", lead: "Müşteri menüyü kendi ihtiyacına göre daraltır." },
      { ico: "search", lead: "Arama kutusu ve 8 sıralama menüyle birlikte gelir." },
      { ico: "list", lead: "Girdiğiniz bilgi ürün detayında etiket olarak durur." }
    ],
    stats: [["14", "alerjen kartı"], ["8", "sıralama seçeneği"], ["4", "ürün özelliği filtresi"]],
    chips: [["Alerjeni hariç tut", "14 alerjen kartı"], ["Kalori ve fiyat", "Aralık filtreleri"], ["8 sıralama", "Fiyat, protein, acılık"], ["Tek dokunuşla sıfırla", "Etiketler menüde görünür"]]
  },

  "menu-asistani": {
    hero: {
      kicker: "MENÜ ASİSTANI", accent: "garson beklenmez.",
      points: [{ ico: "chat", t: "Yanıtlar menü verinize dayanır" }, { ico: "list", t: "Cevaplanamayan sorular listede" }, { ico: "users", t: "Ekibiniz sohbeti devralabilir" }],
      screenChips: [["Menüye dayalı yanıt", "Ürün önerisi"], ["Cevaplanamayan sorular", "Sohbet geçmişi"], ["Garson ve hesap", "Adım adım sipariş"]]
    },
    steps: [
      { who: "MİSAFİR · TELEFONDA", points: ["Ürün, fiyat ve açıklamalara dayanır", "Menüdeki ürünleri önerir", "Tükendi işaretli ürün için sipariş oluşturmaz"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Cevaplanamayan Sorular listesi", "Sohbet geçmişi ve canlı sohbet", "Asistanın adı, karşılaması ve renkleri"] },
      { who: "EKİBİNİZ · SERVİS PANELİ", points: ["Garson çağırma ve hesap isteme tetiklenir", "Talepler Servis Paneli’ne düşer", "Sipariş müşterinin açık onayıyla ilerler"] }
    ],
    gaps: {
      title: "Menünüzde bunlar yaşanıyorsa, eksik olan bir menü asistanı.",
      rows: [
        { now: "Menüyle ilgili sorular garsona düşüyor.", next: "Asistan menünüzdeki ürün, fiyat ve açıklamalara dayanarak yanıt verir." },
        { now: "Misafirin sorduğu ama menüde karşılığı olmayan soruları görmüyorsunuz.", next: "Asistan bilmediğini söyler; bu sorular Cevaplanamayan Sorular listesine düşer, eksik bilgiyi siz eklersiniz." },
        { now: "İnsan desteği gereken görüşmeler yanıtsız kalıyor.", next: "Geçmiş görüşmeleri inceler, insan desteği gereken görüşmeyi devralıp müşteriyle doğrudan yazışırsınız." }
      ]
    },
    groups: [
      { ico: "chat", lead: "Yalnızca menü ve restoran bilginize dayanır." },
      { ico: "bell", lead: "Garson, hesap ve sipariş aynı sohbetten ilerler." },
      { ico: "sliders", lead: "Görünüm, görünürlük ve sınırları siz belirlersiniz." },
      { ico: "spark", lead: "Bağlantı, sizin girdiğiniz API anahtarıyla kurulur." }
    ],
    stats: [["25", "varsayılan oturum mesaj limiti"], ["3", "servis akışı: garson, hesap, sipariş"]],
    chips: [["Menüye dayanır", "Ürün ve fiyat menünüzden"], ["Cevaplanamayan sorular", "Listede size kalır"], ["Canlı sohbet", "Ekibiniz devralır"], ["Garson ve hesap", "Servis Paneli’ne düşer"]]
  },

  "servis-paneli": {
    hero: {
      accent: "doğru ekibin önünde.",
      points: [{ ico: "bell", t: "Talepler tek panelde" }, { ico: "clock", t: "Bekleyen kart sarıya, sonra kırmızıya döner" }, { ico: "lock", t: "Personel erişimi görevine göre sınırlı" }],
      screenChips: [["Üç kayıt tipi tek ekranda", "Durum sütunları"], ["Garson çağır", "Hesap iste"], ["Bekleme uyarısı", "Sarı, sonra kırmızı"]]
    },
    steps: [
      { who: "MİSAFİR · TELEFONDA", points: ["Tek dokunuşla garson çağırır", "Hesabın masaya getirilmesini ister", "Menüden sepete ekleyip sipariş gönderir"] },
      { who: "EKİBİNİZ · SERVİS PANELİ", points: ["Sipariş, garson çağrısı ve hesap isteği", "Bekliyor’dan Tamamlandı’ya beş durum sütunu", "Talep türüne ve masa adına göre süzün"] },
      { who: "EKİBİNİZ · SERVİS PANELİ", points: ["Varsayılan eşikler 3 ve 7 dakika", "İsteğe bağlı sesli uyarı ve bildirim", "Uyarı için panelin açık olması gerekir"] }
    ],
    gaps: {
      title: "Servisinizde bunlar yaşanıyorsa, eksik olan bir servis paneli.",
      rows: [
        { now: "Garson çağrısı ve hesap isteği masalardan dağınık geliyor.", next: "Müşteri tek dokunuşla garson çağırır ya da hesabı ister; talep masa bilgisiyle panele düşer." },
        { now: "Hangi masanın ne kadar beklediği belli olmuyor.", next: "Tamamlanmamış kart belirlediğiniz süreyi aşınca sarıya, sonra kırmızıya döner (varsayılan 3 ve 7 dakika)." },
        { now: "Salon ve mutfak aynı bilgiyi farklı yerlerden takip ediyor.", next: "Sipariş, garson çağrısı ve hesap isteği aynı panelde toplanır; garson ve mutfak için menüyü ve ayarları göstermeyen sınırlı bir servis rolü vardır." }
      ]
    },
    groups: [
      { ico: "kanban", lead: "Sipariş, garson çağrısı ve hesap isteği aynı panelde toplanır." },
      { ico: "bell", lead: "Yeni kayıtta sesli uyarı ve tarayıcı bildirimi açılabilir." },
      { ico: "users", lead: "Müşteri talebini telefonundan tek dokunuşla gönderir." },
      { ico: "lock", lead: "Garson ve mutfak için sınırlı bir servis rolü vardır." }
    ],
    stats: [["3", "kayıt tipi"], ["5", "durum sütunu"], ["5 sn", "varsayılan yenileme"]],
    chips: [["Garson çağrısı", "Panele kart olarak düşer"], ["Hesap isteği", "Ödeme almaz"], ["Bekleme uyarısı", "Sarı, sonra kırmızı"], ["Servis rolü", "Menüyü ve ayarları göstermez"]],
    replaceClosing: true
  },

  "qr-analytics": {
    hero: {
      kicker: "KULLANIM RAPORU", accent: "nasıl kullanıldığını görün.",
      points: [{ ico: "chart", t: "Görüntüleme, tıklama ve masa hareketi" }, { ico: "trend", t: "Önceki dönemle karşılaştırma" }, { ico: "download", t: "CSV olarak dışa aktarma" }],
      screenChips: [["Menü görüntüleme", "Ürün tıklama"], ["Masaya göre hareket", "Okutulmayan masalar"], ["Sepet hunisi", "Terk edilen sipariş"]]
    },
    steps: [
      { who: "SİZ · İSTATİSTİKLER", points: ["Görüntüleme, tıklama, tekil ziyaretçi", "Bugün, son 7 gün, bu ay ya da özel aralık", "Önceki eşit dönemle karşılaştırma"] },
      { who: "SİZ · İSTATİSTİKLER", points: ["Hangi masadan kaç hareket geldiği", "Hiç okutulmayan masalar ayrı listelenir", "Masasız erişim ayrı görünür"] },
      { who: "SİZ · İSTATİSTİKLER", points: ["Sepete eklenen, gönderilen, terk edilen", "Tükendi olduğu için engellenen siparişler", "Sipariş özelliği (Pro) gerekir"] }
    ],
    gaps: {
      title: "Menünüzde bunlar yaşanıyorsa, eksik olan bir kullanım raporu.",
      rows: [
        { now: "Menünün gerçekten açılıp açılmadığını bilmiyorsunuz.", next: "Menü görüntüleme, ürün tıklama ve tekil ziyaretçi sayısı önceki eşit uzunluktaki dönemle karşılaştırılır." },
        { now: "Hangi masanın QR’ının hiç okutulmadığını göremiyorsunuz.", next: "Masalara göre hareket listelenir; hiç okutulmayan masalar ayrı görünür." },
        { now: "Sepete eklenen ürünün neden siparişe dönmediğini bilmiyorsunuz.", next: "Sipariş özelliğiyle sepet hunisi eklenen, gönderilen ve terk edilen siparişleri gösterir." }
      ]
    },
    groups: [
      { ico: "chart", lead: "Görüntüleme, tıklama ve en çok ilgi gören ürünler." },
      { ico: "grid", lead: "Hangi masa hareketli, hangisi sessiz." },
      { ico: "cart", lead: "Sepetten siparişe giden yol." },
      { ico: "chat", lead: "Chatbot, yorum, form ve dil seçimi raporlanır." },
      { ico: "download", lead: "CSV indirir, saklama süresini ayarlarsınız." }
    ],
    stats: [["31", "gün en uzun özel aralık"], ["CSV", "rapor dışa aktarma"]],
    chips: [["Genel bakış", "Görüntüleme ve tıklama"], ["Masa hareketi", "Okutulmayan masalar ayrı"], ["Sepet hunisi", "Eklenen, gönderilen, terk"], ["CSV dışa aktarma", "Rapor sayfaları"]]
  },

  "masa-oturum-guvenligi": {
    hero: {
      kicker: "MASA OTURUM GÜVENLİĞİ", accent: "kontrollü kalsın.",
      points: [{ ico: "lock", t: "İmzalı masa oturumu" }, { ico: "clock", t: "Süre ve hareketsizlik limiti" }, { ico: "qr", t: "Menü herkese açık kalır" }],
      screenChips: [["İmzalı oturum", "Garson ve sipariş açık"], ["Kilit ekranı", "Menü herkese açık"], ["Oturum durumu panelde", "Süre ve son işlem"], ["Maksimum süre", "Hareketsizlik limiti"]]
    },
    steps: [
      { who: "MİSAFİR · KAYITLI MASADA", points: ["Masa adı imzalı oturumdan okunur", "Garson çağırma, sipariş ve sohbet çalışır", "Menü Asistanı ve sepet oturuma bağlıdır"] },
      { who: "MİSAFİR · KAYITSIZ ADRESTE", points: ["Kayıtlı olmayan masada kilit ekranı", "Menü herkese açık kalır", "Kilit ekranı aktif dilde açılır"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Masa adı, veriliş ve son işlem zamanı", "Oturumun durumu panelde yer alır", "Masa silinince açık oturumlar da kapanır"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Maksimum oturum süresi varsayılan 90 dakika", "Hareketsizlik limiti varsayılan 30 dakika", "Oturum başına mesaj limiti varsayılan 25"] }
    ],
    gaps: {
      title: "Masalarınızda bunlar yaşanıyorsa, eksik olan bir oturum kontrolü.",
      rows: [
        { now: "Masa bilgisi adreste duruyor, başkası değiştirebilir.", next: "Masa adı, veriliş ve son işlem zamanı HMAC-SHA256 ile imzalanır; müşteri başka bir masa adına oturum oluşturamaz." },
        { now: "Bir kez açılan oturum süresiz açık kalıyor.", next: "Toplam süre (varsayılan 90 dakika) ya da hareketsizlik limiti (varsayılan 30 dakika) dolunca oturum kilitlenir." },
        { now: "Kayıtlı olmayan bir adresten masa özelliklerine girilebiliyor.", next: "Kayıtlı olmayan masa adresinde kilit ekranı gösterilir; menü herkese açık kalır." }
      ]
    },
    groups: [
      { ico: "lock", lead: "Masa bilgisi imzalı oturumda taşınır." },
      { ico: "clock", lead: "Süre, hareketsizlik ve mesaj sınırları." },
      { ico: "shield", lead: "Hangi özelliklerin oturuma bağlı olduğu." }
    ],
    stats: [["90", "dk varsayılan oturum süresi"], ["30", "dk varsayılan hareketsizlik"], ["25", "varsayılan mesaj limiti"]],
    chips: [["İmzalı oturum", "Masa adı imzalanır"], ["90 dk", "Varsayılan oturum süresi"], ["30 dk", "Varsayılan hareketsizlik"], ["Kilit ekranı", "Kayıtsız adreste"]]
  },

  "yorum-geri-bildirim": {
    hero: {
      kicker: "YORUM VE GERİ BİLDİRİM", accent: "sistemli öğrenin.",
      points: [{ ico: "star", t: "Beş kriterli puanlama" }, { ico: "form", t: "Kendi geri bildirim formlarınız" }, { ico: "chart", t: "Kriter, masa ve saate göre rapor" }],
      screenChips: [["Beş kriterli puan", "Yorum yazma"], ["Yayın kararı sizde", "Olumlu ve olumsuz sekmesi"], ["Kriter bazlı ortalama", "Masa ve saate göre"]]
    },
    steps: [
      { who: "MİSAFİR · TELEFONDA", points: ["Beş kriterle puan verir", "Puanın yanında yorum yazar", "Görsel yükleme isteğe bağlı açılır"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Yayınlar, yayından kaldırır ya da silersiniz", "Olumlu ve olumsuz sekmeleri (eşik varsayılan 3,0)", "Basit doğrulama sorusuyla spam koruması"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Kriter bazlı puan ortalamaları", "Masaya göre dağılım", "Saat dilimine göre yorum sayısı"] }
    ],
    gaps: {
      title: "Geri bildirimde bunlar yaşanıyorsa, eksik olan bir yorum yönetimi.",
      rows: [
        { now: "Geri bildirim sözlü ve dağınık kalıyor.", next: "Müşteri menünün içinden beş kriterle puanlar ve yorum yazar; kriter adlarını siz belirlersiniz." },
        { now: "Hangi yorumun yayında görüneceğine karar veremiyorsunuz.", next: "Yorumları okur, yayınlar, yayından kaldırır ya da silersiniz; yayına alınma biçimini ayarlarsınız." },
        { now: "Sorunun nerede olduğunu görmek zor.", next: "Kriter bazlı ortalamalar, masaya göre dağılım ve saat dilimine göre yorum sayısı raporlanır." }
      ]
    },
    groups: [
      { ico: "star", lead: "Beş kriterli puan ve yorum." },
      { ico: "list", lead: "Yayın kararı sizde." },
      { ico: "form", lead: "İletişim formu ve kendi formlarınız." },
      { ico: "tag", lead: "Google yorum bağlantısı ve indirim kodu isteğe bağlıdır." },
      { ico: "chart", lead: "Rapor, CSV ve kişisel veri araçları." }
    ],
    stats: [["5", "puanlama kriteri"], ["9", "form alanı türü"], ["3,0", "varsayılan olumlu eşiği"]],
    chips: [["5 kriter", "Adlarını siz belirlersiniz"], ["Yayın kararı", "Sizde"], ["Form oluşturucu", "Kendi formlarınız"], ["Raporlar", "Kriter, masa, saat"]]
  },

  "menu-muhendisligi": {
    hero: {
      kicker: "MENÜ MÜHENDİSLİĞİ", accent: "gerçekten kazandırıyor?",
      points: [{ ico: "calc", t: "Reçeteden maliyet hesabı" }, { ico: "chart", t: "Popülerlik ve kârlılık matrisi" }, { ico: "spark", t: "Her gruba bir aksiyon cümlesi" }],
      screenChips: [["Dört grup matrisi", "Aksiyon cümlesi"], ["Reçeteden maliyet", "Fire yüzdesi"]]
    },
    steps: [
      { who: "SİZ · YÖNETİM PANELİ", points: ["Malzeme ve miktar satırlarını girin", "Fire yüzdesi (0–50) maliyete eklenir", "Ya da birim maliyeti doğrudan girin"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Popülerlik: satış adedinin menüdeki payı", "Kârlılık: fiyat − maliyet", "Maliyeti girilmeyen ürün matrise alınmaz"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Malzeme fiyatı kg, litre ya da adet girilir", "Reçeteli ürünlerin maliyeti yeniden hesaplanır", "Eksik maliyetler ayrı listelenir"] }
    ],
    gaps: {
      title: "Menü kararlarında bunlar yaşanıyorsa, eksik olan bir maliyet matrisi.",
      rows: [
        { now: "En çok satan ürünün gerçekten kazandırıp kazandırmadığını bilmiyorsunuz.", next: "Her ürün popülerlik ve kârlılığa göre Yıldız, Çok Satan, Gizli Fırsat ya da Zayıf Performans grubuna yerleşir." },
        { now: "Ürün maliyeti elle hesaplanıyor; malzeme fiyatı değişince eskiyor.", next: "Reçeteye malzeme ve miktar girersiniz; malzeme fiyatı değişince reçeteli ürünlerin maliyeti yeniden hesaplanır." },
        { now: "Hangi ürüne ne yapılacağı belirsiz.", next: "Her grup için genel bir aksiyon cümlesi yazılır; karar sizindir." }
      ]
    },
    groups: [
      { ico: "calc", lead: "Maliyeti elle girer ya da reçeteden hesaplatırsınız." },
      { ico: "chart", lead: "Ürünler dört gruptan birine yerleşir." },
      { ico: "trend", lead: "Dönem ve kategoriye göre süzülen rapor." }
    ],
    stats: [["4", "menü grubu"], ["%50", "en yüksek fire yüzdesi"], ["%70", "varsayılan popülerlik eşiği"]],
    chips: [["Dört grup", "Yıldız’dan Zayıf’a"], ["Reçete maliyeti", "Malzeme fiyatından"], ["Aksiyon cümlesi", "Her grup için"], ["Eksik maliyet", "Ayrı listede"]]
  }
};
