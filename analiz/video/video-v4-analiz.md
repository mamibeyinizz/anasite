# coklu-dil-reels_v4.mp4 — bağımsız analiz

Teknik [Kesin]: 1080×1920, 30 fps, 28,000 sn, bt709, 6,5 Mbps, -14,0 LUFS / -3,9 dBTP. Başlık bölgesi ölçümü (0,1 sn): metinsiz boşluklar 0,2–0,3 sn (rapordaki 0,2 sn ile uyumlu). Büyüteç bölgesi: dil geçişlerinde yalnız ~0,2 sn söner/gelir (v3'teki boş kalma yok).

## Hüküm
Büyük tasarım hatası yok. Gerçek telefon (≈312×625, oran 0,5), büyüteç kanıtı, bütün kartlı panel, açık dil seçicili CTA ve tek metin katmanı çalışıyor. Yayın öncesi 1 engelleyici + 4 küçük sorun var. Puan: yerleşim 9/10, kompozisyon 8/10, kanıt okunurluğu 8/10.

| # | Önem | Zaman | Bulgu | Düzeltme |
|---|---|---|---|---|
| 1 | Engelleyici | 0–28 | Anlatım sesi yok (yalnız ambient bed). | `ses/anlatim.mp3` ekle, `encode-v2.sh` ile miksle, -14 LUFS. |
| 2 | Düşük | 10–11 | Dil listesi büyüteçte sağ altta kırpık metin parçası ("a Yemek"); liste son satırı ("Русский") kart alt kenarına değiyor. | Büyüteç penceresini arka plandaki kategori metnini içermeyecek biçimde daralt / kırp; alt iç boşluk ≥16 px. |
| 3 | Düşük | 22,3–22,7 | Panel ile telefon 0,4 sn çapraz geçiyor: şeffaf panel metni ("Dille…", "CSV…") telefonun arkasında görünüyor. | Çapraz geçiş yerine 0,2 sn söndür–getir (v3 altyazı kuralıyla aynı). |
| 4 | Düşük | 24–28 | "↖" oku bir yere işaret etmiyor: Reels'te hesap adı altta solda, üst solda profil öğesi yok. Alt UI bölgesi de kullanılamaz. | Oku kaldır; "Bağlantı profilimizde." cümlesi yeter. Gerekirse küçük "Profil › bağlantı" ikonu logo yanında. |
| 5 | Düşük | 17–22 | Panel yalnız iki kart gösteriyor, başlık/yol ("Diller & Çeviriler") yok; yönetim paneli olduğu belli değil. | Pencerenin üstüne sabit ince bir başlık şeridi (ekran görüntüsündeki "Diller & Çeviriler" kısmı) ekle. |
| 6 | Bilgi | 9–28 | Telefon altında "Lütfen QR kodunu okutarak masanızdan erişin" çubuğu görünüyor; izleyici demoyu kilitli sanabilir [Muhtemel]. | Telefon ekranının alt çubuğunu kırp ya da CTA'da "demoyu serbestçe inceleyin" ifadesi ekleme (yeni iddia gerektirmez); canlı menü sayfasında bu çubuğun açıklaması olsun. |

Ek: "Otuz dile kadar" sırasında panelde "28 dil etkin" yazıyor; tutarsızlık değil (kapasite 30, etkin 28), ama izleyici sorarsa cevabı hazır olsun.
