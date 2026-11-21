# coklu-dil-reels_v2.mp4 — UX/UI ve bug analizi

Teknik [Kesin, ffprobe/loudnorm]: 1080×1920, 30 fps, 28,000 sn, H.264, video 6,4 Mbps, ses -14,0 LUFS / -3,9 dBTP, dosya 23 MB. v1'in teknik sorunları (ses, bit hızı) giderildi. Ses içeriğini dinleyemem.

## v1'den düzelenler
Ses kanalı sessiz değil (-14 LUFS) · döngü geçişinde metin çakışması yok (27 sn'de yalnız hook) · 8–10 sn boş kare yok · telefon ekranı ve panel büyüdü · turist figürü krem/altın oldu, "?" balonu misafire bağlı · başlık ile altyazı tekrarı 1–2. sahnede kalktı.

## v2'de kalan / yeni tasarım hataları

| # | Önem | Zaman | Bulgu |
|---|---|---|---|
| 1 | Engelleyici | 10–17 | Telefon ~%97 genişlikte (x≈30–1050) ve y≈250–1740: yan marj 65 px'in altında, alt kenar Reels alt UI bölgesine (y>1248) giriyor. Güvenli bölge ihlali. |
| 2 | Engelleyici | 10–17, 24–28 | Altyazı plakası medyanın üstüne biniyor: 13 sn'de "Ürün adı, açıklama…" plakası "Filtre Kahve" satırını (kanıtın kendisi) kapatıyor; 26,8 sn'de "Bağlantı profilimizde." telefon metnine biniyor (metin üstüne metin). |
| 3 | Yüksek | 12–17 | "Gerçek demo menü" rozeti ve TR/EN/DE/FR çipleri telefonun üst çerçevesine temas ediyor/biniyor; aralarında boşluk yok. |
| 4 | Yüksek | 19–22 | Panel yakınlaştırması tuval kenarından taşıyor: "Kapsa…", "CSV İçe Akta…", "Metin…" kartları ekran kenarında kesik. Kırpma tasarım hatası gibi okunuyor. |
| 5 | Yüksek | 17–23 | Panel bloğu içerik yüksekliği ≈y 520–960; altta ~%50 boş alan. Panel metni hâlâ küçük (≈18 px), kenar marjı ≈52 px (<65). |
| 6 | Yüksek | 13–14 | DE seçildiğinde ekran menü listesi yerine açılış (splash) sayfasını ("Zum Menü") gösteriyor; TR/EN/FR menü listesi. Tutarsız durum. |
| 7 | Orta | 8–12 | Ölçek sıçraması: telefon 9 sn'de ~%24 genişlik, 12 sn'de ~%97 (kamera yakınlaşması değil, nesne boyu değişiyor); gözü zıplatıyor. |
| 8 | Orta | 21–23 | Altyazı geçişinde iki cümle ("Çevirileri elle ya da CSV ile…", "Otuz dile kadar.") aynı anda ve soluk görünüyor; kilit iddia ("30 dile kadar") okunmuyor. |
| 9 | Orta | 24–28 | CTA'da telefon başlık + URL + logo + ok ile aynı bloğa sıkışık; alt yazı plakası telefonun üstünde; tüm sahne sönük (karartma ≈%35), URL altın-yeşil üzerinde düşük kontrast. |
| 10 | Orta | genel | Dikey denge tutarsız: hook sahnesi y 640–1280'de, panel sahnesi y 520–960'ta, telefon sahnesi y 250–1740'ta. Ağırlık merkezi sahneden sahneye kayıyor. |
| 11 | Düşük | 0–4 | Sol/orta masalardaki yarım küre "müşteri" başları gövdesiz topa benziyor; sağ masa figür ve balonla örtüşüyor. |

## Kök neden
Boyutlar ve konumlar sahne bazında elle verilmiş; ortak bir yerleşim sistemi (güvenli dikdörtgen, bant, bileşen kuralları) ve otomatik yerleşim testi yok. Bu yüzden her düzeltme bir yeni çakışma doğuruyor.
