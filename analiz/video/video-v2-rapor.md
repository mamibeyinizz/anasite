# coklu-dil-reels_v2.mp4 — düzeltme raporu (v1 analizindeki 14 bulgu)

Çıktı: `out/coklu-dil-reels_v2.mp4` (v1 `out/coklu-dil-reels.mp4` korundu). Doğrulama verisi: `out/dogrulama-v2.json`, `out/guvenli-bolge.json`.
Önce/sonra kareleri: `out/kontrol-v2/oncesi-sonrasi/NN-*.jpg` (solda v1, sağda v2). Sheet'ler: `out/sheet-v2-1sn-4x7.jpg`, `out/sheet-v2-anahtar-13.jpg`, `out/sheet-v2-dongu-26.5-28.jpg`; kapak: `out/kontrol-v2/kapak-3x4.jpg`.

## Ölçümler (ffprobe / ffmpeg)
| Ölçüt | Sonuç | Eşik |
|---|---|---|
| Biçim | 1080×1920, 30 fps, 28,000 sn, yuv420p, bt709 (tv) | 28,0 ± 0,1 sn |
| Bit hızı | video 6,43 Mbps (toplam 6,60) | ≥ 5 Mbps |
| Ses | AAC 48 kHz stereo; −14,0 LUFS, LRA 0,5 LU, tepe −3,9 dBTP; 1 sn üstü sessizlik: 0 | −14 ± 1 LUFS, ≤ −1 dBTP |
| Boş kare (8–10 sn) | en düşük nesne kaplaması %5,9 | ≥ %3 |
| Misafir kontrastı | 4,4:1 · 4,6:1 · 5,2:1 (t=0, 2, 4,5 sn); v1 ≈ 1,3:1 | ≥ 3:1 |
| Güvenli bölge | 0 ihlal (840 kare, tüm DOM metinleri) ; en küçük yazı 40 px | üst 270 / alt 672 / yan 65; ≥ 40 px |
| Başlık çakışması | 0 kare (aynı anda birden çok başlık / döngüde iki metin bloğu yok) | 0 |
| Altyazı = ses metni | başlıklar + altyazılar birleşik sırayla `ses-metni.md` düz metnine kelime kelime eşit | eşit |

## Madde madde
| # | Durum | Ne yapıldı / neden |
|---|---|---|
| 1 Ses | Düzeltildi | `ses/anlatim.mp3` yok → `render/ses-uret.py` ile ambient bed sentezlendi (pad + yumuşak vurgular, döngüye uygun). İki geçişli loudnorm + limiter. Anlatım gelince `encode-v2.sh` bed'i anlatımın altında bastırıp karıştırır. |
| 2 Döngü | Düzeltildi | CTA katmanları (başlık, URL, altyazı, ok, logo, telefon) 26,6–27,1'de söner; 27,1–27,2 yalnız arka plan; hook 27,2–27,9'da gelir, t=28 durumu t=0 ile aynı. Arka plan gradyanı hiç değişmez. Kareler: `sheet-v2-dongu-26.5-28.jpg`. |
| 3 Boş kare | Düzeltildi | Telefon 8,0'da opak ve hareketle girer. 8–10 sn kaplama %5,9–10,8. **Not:** döngü boşluğunda (26,9–27,2 ≈ 10 kare) kaplama bilerek %3'ün altında (madde 2'nin gereği). |
| 4 CTA telefonu | Düzeltildi | Geçiş 23,1–23,6'da biter, gövde genişliği ≈ %54 (ekran ≈ %50), ön yüz açık, ürün listesi görünür. Telefon içi UI metni ≈ 21 px (madde 5'in 28 px koşulu yalnız 10–23 sn için istenmişti). |
| 5 Okunabilirlik | Düzeltildi | 10–17 sn: kamera 1,9× (ürün adı ≈ 36 px, açıklama ≈ 30 px). 17–23 sn: panel 2,15× (Diller / CSV Dışa Aktar / CSV İçe Aktar başlıkları ≈ 30 px). Değerler doku ölçeğinden hesaplandı (`window.__olcek`), OCR ile doğrulanmadı. Kart alt satırları (12 px) ≈ 22 px kalır. |
| 6 Altyazı çakışması | Düzeltildi | Sahne 2'de plaka yok (söylenen cümle başlık olarak büyük yazılır); figür ayakları ≈ y 1135, masa tabanı ≤ 1245. |
| 7 Tekrar | Düzeltildi (sapma var) | Kural uygulandı: başlıkta olan cümle altyazıda yok. Sahne 2'de v3 başlık ifadesi ("Garson tercümana dönüştü. Masalar bekliyor.") yerine söylenen cümleler başlık oldu. Sahne 5'te "Bu, Çoklu Dil modülü." yalnız başlık; v3'ün üç etiketi ("Elle ya da CSV", "30 dile kadar") yerine söylenen üç cümle sırayla altyazı alanında girer (aynı bilgi ikinci kez yazılmasın diye). |
| 8 Kontrast | Düzeltildi | Misafir altın tonda (4,4:1+); "?" balonu kuyruğuyla misafirin başına bağlı; hook'ta menüyü uzatıyor. |
| 9 Kırpma | Düzeltildi | 10–11,7 sn: doku ekranın tamamı (üst çubuk + logo + açılır liste). Listenin alt kenarındaki yarım satır uygulamanın kendi kaydırma kesimidir (gerçek arayüz). |
| 10 Rozet | Düzeltildi | Tek satır, telefonun üstünde (y 296–358), sol marj 80 px. |
| 11 Flip | Düzeltildi (sapma var) | Kart çevirme yerine çapraz geçiş + hafif yan dönüş; siyah gövde yok. v3'teki "rotateY 180°" kart çevirme bilerek bırakıldı. |
| 12 Kompozisyon | Kısmen | Başlık y 360'tan, nesne bloğu ≈ 360–1245 aralığında, nesneler %12 büyütüldü. 3:4 kapakta alt üçte bir hâlâ boş: güvenli bölge kuralı (alt 672) buna zorluyor; denge ölçülmedi, görsel yargı. |
| 13 CTA hiyerarşisi | Düzeltildi | Tek odak: "Canlı menüyü telefonunuzda deneyin" + URL (54 px). Logo tek ve `assets/brand/qr-menu-official-logo-v4.svg` dosyasından (zaten bir wordmark). Ok tek çizgi. Altyazı yalnızca sesli cümle. |
| 14 Kodlama | Düzeltildi | 6,5 Mbps hedef, luma noise/dither (c0s=3), bt709 etiketli, `+faststart`. |

## v3'e göre değişen süreler (madde 2'nin sonucu)
- Hook başlığı 0–2,6; sahne 6 22,6'da başlar (v3: 23,0); son cümle ("Bağlantı profilimizde.") 25,9–27,0 (v3: 27–28). Anlatım kaydı sahne 6'da ≈ 3,5 kelime/sn gerektirir (15 kelime, 22,6–26,9 sn). Çok hızlıysa cümleyi kısaltmak ya da sahne 5'i 0,4 sn öne çekmek gerekir.
- Anlatım yok: altyazı zamanları tahmindir.
