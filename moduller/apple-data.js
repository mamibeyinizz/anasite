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
    shots: {"alt": "Gerçek ekranlar: QR Kodlar listesi, masa için indirilen QR çıktısı, toplu masa oluşturma formu ve masa adı düzenleme satırı.", "devices": [{"kind": "window", "src": "panel-qr-kodlar.webp", "w": 1600, "h": 1180, "alt": "QR Kodlar ekranı: masa adları, URL parametresi, her masanın QR kodu ve PNG/PDF indirme düğmeleri", "title": "QR Kodlar"}, {"kind": "card", "src": "basili-kart.webp", "w": 780, "h": 1043, "alt": "Bir masa için indirilen QR çıktısı: üstte masa adı, ortada QR kod", "label": "İndirilen QR çıktısı"}, {"kind": "window", "src": "panel-toplu.webp", "w": 1600, "h": 1120, "alt": "Tek masa ve toplu masa oluşturma formları: slug öneki, başlangıç ve bitiş numarası", "title": "QR Kodlar › Masa oluştur"}, {"kind": "window", "src": "panel-masa-adi.webp", "w": 2040, "h": 1140, "alt": "Masa listesinde ad düzenleme: masa adı Teras 1 yazılırken URL parametresi masa-7 olarak kalıyor", "title": "QR Kodlar › Masa adı"}], "steps": [{"img": "adim-1.webp", "w": 800, "h": 640}, {"img": "adim-2.webp", "w": 1050, "h": 840}, {"img": "adim-3.webp", "w": 780, "h": 624}, {"img": "adim-4.webp", "w": 1050, "h": 840}], "tile": {"src": "panel-qr-kodlar.webp", "w": 1600, "h": 1180, "alt": ""}},
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
    shots: {"alt": "Gerçek ekranlar: misafir menüsünde dil seçici, çeviri CSV dışa aktarma, Diller & Çeviriler özeti, İngilizce menü ve dil listesi.", "devices": [{"kind": "phone", "src": "dil-secici.webp", "w": 780, "h": 1560, "alt": "dil seçici açık: Türkçe, English, Deutsch, Français ve diğer diller"}, {"kind": "window", "src": "panel-csv.webp", "w": 1600, "h": 1400, "alt": "CSV Dışa Aktar ekranı: sütun ayracı ve CSV’ye eklenecek sayfalar", "title": "Diller & Çeviriler › CSV Dışa Aktar"}, {"kind": "window", "src": "panel-durum.webp", "w": 1600, "h": 840, "alt": "Diller & Çeviriler özeti: eskimiş çeviri uyarısı, etkin dil sayısı, CSV içe ve dışa aktarma, sistem durumu", "title": "Diller & Çeviriler"}, {"kind": "phone", "src": "menu-ingilizce.webp", "w": 780, "h": 1560, "alt": "İngilizce menü: Suggestions, Main Courses ve ürün adları İngilizce"}, {"kind": "window", "src": "panel-diller.webp", "w": 2040, "h": 1480, "alt": "Diller ekranı: menüde gösterilecek diller ve her dildeki çeviri sayısı", "title": "Diller & Çeviriler › Diller"}], "steps": [{"img": "adim-1.webp", "w": 780, "h": 624}, {"img": "adim-2.webp", "w": 1050, "h": 840}, {"img": "adim-3.webp", "w": 1050, "h": 840, "screen": 2}], "tile": {"src": "dil-secici.webp", "w": 780, "h": 1560, "alt": ""}},
    hero: {
      kicker: "ÇOKLU DİL MENÜ", accent: "misafirin dilinde.",
      points: [{ ico: "globe", t: "30 dil, sağdan sola diller dahil" }, { ico: "download", t: "Çeviriler tek CSV dosyasında" }, { ico: "check", t: "Çevirisi eksik alan Türkçe görünür" }],
      screenChips: [["Dil seçiciyle anında geçiş", "Menü seçilen dilde açılır"], ["Çeviriler tek dosyada", "İndir, doldur, geri yükle"], ["Eskimiş çeviri uyarısı", "Çeviri durumu tek ekranda"], ["Ürün ve kategori adları", "Seçilen dilde"], ["Menüde gösterilecek diller", "Dil başına çeviri sayısı"]]
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
    shots: {"alt": "Gerçek ekranlar: misafir menüsünde Filtrele & Sırala paneli, alerjen kartları ve uygulanmış filtre etiketleri.", "devices": [{"kind": "phone", "src": "filtre-siralama.webp", "w": 780, "h": 1560, "alt": "Filtrele & Sırala paneli: sıralama seçenekleri ve alerjen kartları"}, {"kind": "phone", "src": "filtre-alerjen.webp", "w": 780, "h": 1560, "alt": "Glüten ve Süt / Laktoz seçili alerjen kartları, kalori ve fiyat aralığı alanları"}, {"kind": "phone", "src": "filtre-sonuc.webp", "w": 780, "h": 1560, "alt": "filtre uygulanmış menü: Glüten ve Süt / Laktoz etiketleri ve Tümünü temizle"}], "steps": [{"img": "adim-1.webp", "w": 780, "h": 624}, {"img": "adim-2.webp", "w": 780, "h": 624}, {"img": "adim-3.webp", "w": 780, "h": 624}], "tile": {"src": "filtre-alerjen.webp", "w": 780, "h": 1560, "alt": ""}},
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
    shots: {"alt": "Gerçek ekranlar: misafirin Menü Asistanı sohbeti, Cevaplanamayan Sorular listesi, garson çağırma önerisi ve Canlı Sohbetler.", "devices": [{"kind": "phone", "src": "sohbet-oneri.webp", "w": 780, "h": 1560, "alt": "Menü Asistanı sohbeti: menüdeki ürünler fiyatı ve Sepete Ekle düğmesiyle önerilir"}, {"kind": "window", "src": "panel-cevaplanamayan.webp", "w": 2040, "h": 680, "alt": "Cevaplanamayan Sorular: soru, tekrar sayısı, Çözüldü olarak işaretle ve Hazır Sorulara ekle", "title": "AI Menü Asistanı › Cevaplanamayan Sorular"}, {"kind": "phone", "src": "sohbet-garson.webp", "w": 780, "h": 1560, "alt": "asistan emin olmadığı alerjen sorusunda yanıt uydurmaz, Garson Çağır önerir"}, {"kind": "window", "src": "panel-canli-sohbet.webp", "w": 2040, "h": 640, "alt": "Canlı Sohbetler: masa, son müşteri mesajı ve bekleyen görüşmeler", "title": "AI Menü Asistanı › Canlı Sohbetler"}], "steps": [{"img": "adim-1.webp", "w": 780, "h": 624}, {"img": "adim-2.webp", "w": 850, "h": 680}, {"img": "adim-3.webp", "w": 780, "h": 624}], "tile": {"src": "sohbet-garson.webp", "w": 780, "h": 1560, "alt": ""}},
    hero: {
      kicker: "MENÜ ASİSTANI", accent: "garson beklenmez.",
      points: [{ ico: "chat", t: "Yanıtlar menü verinize dayanır" }, { ico: "list", t: "Cevaplanamayan sorular listede" }, { ico: "users", t: "Ekibiniz sohbeti devralabilir" }],
      screenChips: [["Menüye dayalı yanıt", "Ürün kartı ve Sepete Ekle"], ["Cevaplanamayan sorular", "Hazır Sorular’a ekle"], ["Emin değilse söyler", "Garson çağırmayı önerir"], ["Canlı sohbet", "Ekibiniz devralır"]]
    },
    steps: [
      { who: "MİSAFİR · TELEFONDA", points: ["Ürün, fiyat ve açıklamalara dayanır", "Menüdeki ürünleri önerir", "Tükendi işaretli ürün için sipariş oluşturmaz"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Cevaplanamayan Sorular listesi ve tekrar sayısı", "Soruyu tek tıkla Hazır Sorular’a ekleyin", "Sohbet geçmişi ve canlı sohbet"] },
      { who: "MİSAFİR · TELEFONDA", points: ["Bilgisi olmayan soruda yanıt uydurmaz", "Garson çağırmayı önerir; talep Servis Paneli’ne düşer", "Sipariş müşterinin açık onayıyla ilerler"] }
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
    shots: {"alt": "Gerçek ekranlar: Servis Paneli ayarları ve misafir menüsündeki Garson Çağır, Hesap İste düğmeleri.", "devices": [{"kind": "window", "src": "panel-ayar-uyari.webp", "w": 1600, "h": 1276, "alt": "Servis Paneli ayarları: sesli uyarı, sarı uyarı 180 saniye, kırmızı uyarı 420 saniye, yenileme aralığı ve gösterilecek tipler", "title": "Servis Paneli › Ayarlar"}, {"kind": "phone", "src": "menu-garson-hesap.webp", "w": 780, "h": 1560, "alt": "menünün altında Garson Çağır ve Hesap İste düğmeleri"}, {"kind": "window", "src": "panel-ayar-personel.webp", "w": 1600, "h": 360, "alt": "Personel Erişimi: Servis Personeli rolüyle yalnızca Servis Paneli görünür", "title": "Servis Paneli › Ayarlar"}], "steps": [{"img": "adim-1.webp", "w": 780, "h": 624}, {"img": "adim-2.webp", "w": 1000, "h": 800}, {"img": "adim-3.webp", "w": 1000, "h": 800, "screen": 0}], "tile": {"src": "menu-garson-hesap.webp", "w": 780, "h": 1560, "alt": ""}},
    hero: {
      accent: "doğru ekibin önünde.",
      points: [{ ico: "bell", t: "Talepler tek panelde" }, { ico: "clock", t: "Bekleyen kart sarıya, sonra kırmızıya döner" }, { ico: "lock", t: "Personel erişimi görevine göre sınırlı" }],
      screenChips: [["Sarı uyarı 180 sn", "Kırmızı uyarı 420 sn"], ["Garson çağır", "Hesap iste"], ["Servis Personeli rolü", "Yalnızca panel görünür"]]
    },
    steps: [
      { who: "MİSAFİR · TELEFONDA", points: ["Tek dokunuşla garson çağırır", "Hesabın masaya getirilmesini ister", "Menüden sepete ekleyip sipariş gönderir"] },
      { who: "EKİBİNİZ · SERVİS PANELİ", points: ["Sipariş, garson çağrısı ve hesap isteği", "Bekliyor’dan Tamamlandı’ya beş durum sütunu", "Talep türüne ve masa adına göre süzün"] },
      { who: "SİZ · SERVİS PANELİ AYARLARI", points: ["Varsayılan eşikler 180 ve 420 saniye (3 ve 7 dakika)", "İsteğe bağlı sesli uyarı ve bildirim", "Uyarı için panelin açık olması gerekir"] }
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
    shots: {"alt": "Gerçek ekranlar: Menü Analizleri genel bakış, masalara göre hareket, ürün tıklamaları ve rapor kategorileri.", "devices": [{"kind": "window", "src": "panel-genel.webp", "w": 1600, "h": 1400, "alt": "Genel Bakış: Bu ay seçili; menü görüntüleme, ürün tıklama, tekil ziyaretçi, aktif masa ve günlük grafik", "title": "Menü Analizleri › Genel Bakış"}, {"kind": "window", "src": "panel-masalar.webp", "w": 2040, "h": 940, "alt": "Masalar: masa başına menü okutma, ürün tıklama, tekil ziyaretçi ve son hareket", "title": "Menü Analizleri › Masalar"}, {"kind": "window", "src": "panel-urunler.webp", "w": 2040, "h": 1080, "alt": "Ürünler: en çok ve en az tıklanan ürünler", "title": "Menü Analizleri › Ürünler"}, {"kind": "window", "src": "panel-kategoriler.webp", "w": 1600, "h": 900, "alt": "Menü Analizleri: bugünkü okutma, tekil ziyaretçi, aktif masa ve rapor kategorileri", "title": "Menü Analizleri"}], "steps": [{"img": "adim-1.webp", "w": 1050, "h": 840}, {"img": "adim-2.webp", "w": 1050, "h": 840}, {"img": "adim-3.webp", "w": 1050, "h": 840}], "tile": {"src": "panel-genel.webp", "w": 1600, "h": 1400, "alt": ""}},
    hero: {
      kicker: "KULLANIM RAPORU", accent: "nasıl kullanıldığını görün.",
      points: [{ ico: "chart", t: "Görüntüleme, tıklama ve masa hareketi" }, { ico: "trend", t: "Önceki dönemle karşılaştırma" }, { ico: "download", t: "CSV olarak dışa aktarma" }],
      screenChips: [["Menü görüntüleme", "Ürün tıklama"], ["Masaya göre hareket", "Okutulmayan masalar"], ["En çok tıklanan", "Hiç tıklanmamış ürün"], ["7 rapor kategorisi", "Sepet, etkileşim, açılış"]]
    },
    steps: [
      { who: "SİZ · MENÜ ANALİZLERİ", points: ["Görüntüleme, tıklama, tekil ziyaretçi", "Bugün, son 7 gün, bu ay ya da özel aralık", "Önceki eşit dönemle karşılaştırma"] },
      { who: "SİZ · MENÜ ANALİZLERİ", points: ["Hangi masadan kaç hareket geldiği", "Hiç okutulmayan masalar ayrı listelenir", "Masasız erişim ayrı görünür"] },
      { who: "SİZ · MENÜ ANALİZLERİ", points: ["En çok ve en az tıklanan ürünler", "Hiç tıklanmamış ürünler de listede", "Tükendi işaretli ürünler ayrıca belirtilir"] }
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
    shots: {"alt": "Gerçek ekranlar: kayıtlı masada açılan menü, kayıtsız masa adresinde Oturum Gerekli ekranı, Oturum Limitleri ve Sayfa Kilidi ayarları.", "devices": [{"kind": "phone", "src": "kayitli-masa.webp", "w": 780, "h": 1560, "alt": "kayıtlı masada menü: Garson Çağır ve Hesap İste düğmeleri açık", "label": "Kayıtlı masa"}, {"kind": "phone", "src": "kilit-ekrani.webp", "w": 780, "h": 1560, "alt": "kayıtlı olmayan masa adresinde Oturum Gerekli ekranı", "label": "Kayıtsız masa adresi"}, {"kind": "window", "src": "panel-oturum-limitleri.webp", "w": 1600, "h": 1040, "alt": "Oturum Limitleri: maksimum oturum süresi 90, hareketsizlik limiti 30, oturum başına chatbot mesajı 25", "title": "Masa Oturumu Güvenliği › Oturum Limitleri"}, {"kind": "window", "src": "panel-sayfa-kilidi.webp", "w": 1600, "h": 640, "alt": "Sayfa Kilidi (isteğe bağlı): korunacak sayfa slug’ları boş, kilit kapalı", "title": "Masa Oturumu Güvenliği › Oturum Limitleri"}], "steps": [{"img": "adim-1.webp", "w": 780, "h": 624}, {"img": "adim-2.webp", "w": 780, "h": 624}, {"img": "adim-3.webp", "w": 1050, "h": 840}, {"img": "adim-4.webp", "w": 1000, "h": 800}], "tile": {"src": "panel-oturum-limitleri.webp", "w": 1600, "h": 1040, "alt": ""}},
    hero: {
      kicker: "MASA OTURUM GÜVENLİĞİ", accent: "kontrollü kalsın.",
      points: [{ ico: "lock", t: "İmzalı masa oturumu" }, { ico: "clock", t: "Süre ve hareketsizlik limiti" }, { ico: "qr", t: "Menü herkese açık kalır" }],
      screenChips: [["İmzalı oturum", "Garson ve hesap açık"], ["Kayıtsız masa adresi", "Oturum Gerekli ekranı"], ["Maksimum süre", "Hareketsizlik limiti"], ["Sayfa kilidi", "İsteğe bağlı"]]
    },
    steps: [
      { who: "MİSAFİR · KAYITLI MASADA", points: ["Masa adı imzalı oturumdan okunur", "Garson çağırma, sipariş ve sohbet çalışır", "Menü Asistanı ve sepet oturuma bağlıdır"] },
      { who: "MİSAFİR · KAYITSIZ ADRESTE", points: ["Kayıtlı olmayan masa adresinde “Oturum Gerekli” ekranı", "Masa parametresi olmayan menü herkese açık", "Kilit ekranı aktif dilde açılır"] },
      { who: "SİZ · OTURUM LİMİTLERİ", points: ["Maksimum oturum süresi varsayılan 90 dakika", "Hareketsizlik limiti varsayılan 30 dakika", "Oturum başına asistan mesajı varsayılan 25"] },
      { who: "SİZ · OTURUM LİMİTLERİ", points: ["Korunacak sayfa adreslerini virgülle yazın", "Boş bırakılırsa sayfa kilidi kapalıdır", "Sayfa kilidi ana sayfaya uygulanmaz"] }
    ],
    gaps: {
      title: "Masalarınızda bunlar yaşanıyorsa, eksik olan bir oturum kontrolü.",
      rows: [
        { now: "Masa bilgisi adreste duruyor, başkası değiştirebilir.", next: "Masa adı, veriliş ve son işlem zamanı HMAC-SHA256 ile imzalanır; müşteri başka bir masa adına oturum oluşturamaz." },
        { now: "Bir kez açılan oturum süresiz açık kalıyor.", next: "Toplam süre (varsayılan 90 dakika) ya da hareketsizlik limiti (varsayılan 30 dakika) dolunca oturum kilitlenir." },
        { now: "Kayıtlı olmayan bir adresten masa özelliklerine girilebiliyor.", next: "Kayıtlı olmayan masa adresinde “Oturum Gerekli” ekranı açılır; aynı bağlantıdan dakikada 20’den fazla deneme de kilitlenir." }
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
    shots: {"alt": "Gerçek ekranlar: misafirin beş kriterli değerlendirme formu, Yorumlar & Geri Bildirim özeti ve puanlama kriterleri.", "devices": [{"kind": "phone", "src": "yorum-formu.webp", "w": 780, "h": 1560, "alt": "Bizi Değerlendirin formu: Yemek Lezzeti, Hizmet Hızı, Temizlik, Atmosfer ve Fiyat / Performans yıldızları"}, {"kind": "window", "src": "panel-yorumlar.webp", "w": 1600, "h": 860, "alt": "Yorumlar & Geri Bildirim: onay bekleyen, toplam yorum, genel ortalama ve okunmamış form gönderimi", "title": "Yorumlar & Geri Bildirim"}, {"kind": "window", "src": "panel-kriterler.webp", "w": 1600, "h": 990, "alt": "Puanlama Kriterleri: beş kriterin adı ve aktif/pasif seçimi", "title": "Yorumlar & Geri Bildirim › Puanlama & Ayarlar"}], "steps": [{"img": "adim-1.webp", "w": 780, "h": 624}, {"img": "adim-2.webp", "w": 1000, "h": 800}, {"img": "adim-3.webp", "w": 1000, "h": 800}], "tile": {"src": "panel-kriterler.webp", "w": 1600, "h": 990, "alt": ""}},
    hero: {
      kicker: "YORUM VE GERİ BİLDİRİM", accent: "sistemli öğrenin.",
      points: [{ ico: "star", t: "Beş kriterli puanlama" }, { ico: "form", t: "Kendi geri bildirim formlarınız" }, { ico: "chart", t: "Kriter, masa ve saate göre rapor" }],
      screenChips: [["Beş kriterli puan", "Adım adım form"], ["Onay bekleyen yorumlar", "Genel ortalama"], ["Kriter adlarını siz yazarsınız", "İstemediğinizi kapatın"]]
    },
    steps: [
      { who: "MİSAFİR · TELEFONDA", points: ["Beş kriterle puan verir", "Puanın yanında yorum yazar", "Görsel yükleme isteğe bağlı açılır"] },
      { who: "SİZ · YÖNETİM PANELİ", points: ["Yayınlar, yayından kaldırır ya da silersiniz", "Olumlu ve olumsuz sekmeleri (eşik varsayılan 3,0)", "Basit doğrulama sorusuyla spam koruması"] },
      { who: "SİZ · PUANLAMA & AYARLAR", points: ["Beş kriterin adını siz yazarsınız", "İstemediğiniz kriteri kapatırsınız", "Otomatik onay: kapalı ya da ortalama 4 ve üzeri"] }
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
    shots: {"alt": "Gerçek ekranlar: Menü Performansı Raporu (dört grup), Ürün Maliyetleri ve Malzeme Fiyatları.", "devices": [{"kind": "window", "src": "panel-matris.webp", "w": 1440, "h": 1180, "alt": "Menü Performansı Raporu: ciro, katkı payı, marj, kayıp fırsat ve Yıldız, Çok Satan, Gizli Fırsat, Zayıf Performans kutuları", "title": "Menü Performansı › Rapor"}, {"kind": "window", "src": "panel-maliyet.webp", "w": 1440, "h": 1280, "alt": "Ürün Maliyetleri: ürün, fiyat, maliyet, katkı payı, marj ve reçete", "title": "Menü Performansı › Ürün Maliyetleri"}, {"kind": "window", "src": "panel-malzeme.webp", "w": 1440, "h": 1280, "alt": "Malzeme Fiyatları: malzeme, birim ve birim fiyatı", "title": "Menü Performansı › Malzeme Fiyatları"}], "steps": [{"img": "adim-1.webp", "w": 1000, "h": 800}, {"img": "adim-2.webp", "w": 1000, "h": 800}, {"img": "adim-3.webp", "w": 1000, "h": 800, "screen": 2}], "tile": {"src": "panel-matris.webp", "w": 1440, "h": 1180, "alt": ""}},
    hero: {
      kicker: "MENÜ MÜHENDİSLİĞİ", accent: "gerçekten kazandırıyor?",
      points: [{ ico: "calc", t: "Reçeteden maliyet hesabı" }, { ico: "chart", t: "Popülerlik ve kârlılık matrisi" }, { ico: "spark", t: "Her gruba bir aksiyon cümlesi" }],
      screenChips: [["Dört grup matrisi", "Aksiyon cümlesi"], ["Reçeteden maliyet", "Katkı payı ve marj"], ["Malzeme birim fiyatı", "Reçete ölçüsü"]]
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
