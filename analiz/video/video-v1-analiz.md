# coklu-dil-reels.mp4 (v1) — UX/UI ve bug analizi

Teknik [Kesin, ffprobe]: 1080×1920, 30 fps, 28,000 sn, H.264 yuv420p bt709, AAC 48 kHz stereo, 5,4 MB, ~1,5 Mbps.
Yöntem: 1 fps kontrol sheet'i + 13 tam kare + ses analizi (loudnorm, silencedetect). Ses içeriği dinlenemez; zaman damgaları kare örneklerinden.

## Hükümlü bulgular (önem sırasıyla)

| # | Önem | Zaman | Bulgu | Düzeltme |
|---|---|---|---|---|
| 1 | Engelleyici | 0–28 sn | Ses kanalı var ama tamamen sessiz (silencedetect: 28,01 sn sessizlik, LUFS −inf). | Anlatım sesi gelene kadar ambient bed ekle ve -14 LUFS'a normalize et; sesi `ses/anlatim.mp3` ile miksle. |
| 2 | Engelleyici | 27,0–28,0 | Döngü geçişinde CTA metni, URL ve altyazı ile hook metni üst üste biniyor, hiçbiri okunmuyor. | Önce CTA katmanını 26,6–27,1'de söndür; sonra hook'u 27,2–28'de arka plan geçişiyle getir (metinler asla aynı anda görünmez). |
| 3 | Yüksek | 8–10 | ~2 sn neredeyse boş kare: yalnızca başlık ve soluk paralelkenar (telefon henüz görünmüyor). Ritim kırılıyor. | Telefonu 8,0'da zaten opak ve hareketle getir; boş alan oluşmasın. |
| 4 | Yüksek | 23–28 | CTA'daki telefon küçük (~%24 genişlik), flip animasyonunun ortasında takılı: dar, karanlık, ekranı okunmuyor. CTA'nın ana görseli işlevsiz. | Flip 23,6'da bitsin; telefon ≥%45 genişlik, ön yüzü açık, dil seçici/ürün listesi okunur. |
| 5 | Yüksek | 10–23 | Kanıt ekranları mobilde okunmuyor: telefon içi UI ≈12 px, panel yazıları ≈14 px (1080 genişlikte). Çözüm sahnesinin ana argümanı (ürün adı/açıklama değişti) fark edilmiyor. | Kamera yakınlaşması (2–2,5×): ürün satırı, "Diller / CSV Dışa Aktar / CSV İçe Aktar" kartları. Gerekirse ekranı kırp, ham görüntüyü büyüt. |
| 6 | Yüksek | 3,5–8 | Garson figürünün ayakları altyazı plakasının altında kalıyor; plaka figürü kesiyor. | Altyazı plakasını güvenli bölgede aşağı al (y≈1100–1190 yerine nesneler ≤1000) ya da figürü yukarı. |
| 7 | Orta | 0–8 | Tekrar: başlık ile altyazı aynı cümleyi iki kez söylüyor ("Garson tercümana dönüştü" + "Garsonunuz tercümana dönüşüyor…", "Çoklu Dil modülü" + "Bu, Çoklu Dil modülü." vb.). Okuma yükü ikiye katlanıyor. | Tek metin katmanı: büyük başlık yalnızca kilit ifade; altyazı yalnızca başlıkta olmayan söylenen cümle. |
| 8 | Orta | 0–8 | Turist silueti yeşil zemin üstünde yeşil: kontrast ≈1,3:1, neredeyse görünmez; "?" işaretlerinin kime ait olduğu belli değil; hook'taki "yabancı misafir" görsel olarak yok. | Turisti krem/altın tonuna al (kontrast ≥3:1), "?" balonunu misafirin kafasına bağla, menüyü uzatma jestiyle göster. |
| 9 | Orta | 10–11 | Telefon ekranı kırpması hatalı: dil açılır listesi sol kenarda kesik, logo yarım ("Filizler Restoran" kesilmiş). | Ekran görüntüsünü tam çerçevele (üst bar dahil) ya da listeyi bilerek merkezle. |
| 10 | Orta | 10–17 | "Gerçek demo menü" rozeti üç satıra kırılmış ve kenara yakın (yan marj ≈66 px). | Tek satır, telefonun üstünde. |
| 11 | Orta | 11–14 | Kart çevirme sırasında telefon gövdesi siyah, ekran yüzü yok (yalnız kenar). | Crossfade ya da iki yüzlü kart (ön/arka ekran dokusu). |
| 12 | Orta | 0–28 | Kompozisyon üst-ağır: içerik y≈300–1200, altta ~%35 boşluk (güvenli bölge sonucu). Grid'de 3:4 kırpımda dengesiz. | Başlık + nesne bloğunu y≈360–1180 arasında dikey ortala; nesneleri büyüt. |
| 13 | Orta | 23–28 | CTA ekranında 5 öğe üst üste: ok, logo, başlık, URL, altyazı + küçük telefon. Hiyerarşi belirsiz. | Tek odak: büyük başlık + URL; logo alta/üste tek kez; ok sadeleşsin. Logo, `assets/brand` içindeki gerçek dosya mı kontrol et (metin gibi görünüyor). |
| 14 | Düşük | genel | Bit hızı ~1,5 Mbps: düz gradyanlarda banding ve ince yazıda yumuşama riski [Tahmin]. | 6–8 Mbps, CRF 16–18, gradyanlara hafif noise/dither. |

## Güçlü yönler
- Marka paleti (yeşil/altın/krem) ve Manrope tutarlı; hook ilk karede (t=0,3 sn) görünür.
- "Gerçek demo menü" rozeti güven kuruyor; vurgu çerçevesi (ürün satırı, Diller kartı) doğru yere bakıyor.
- Dil çipleri (TR/EN/DE/FR) ile ekran eşleşiyor; EN ekranda ürün adı, açıklama ve rozetlerin çevrildiği net.
- Panel ekranında kişisel veri yok (yalnızca "Restoran Sahibi" rol etiketi); "28 dil etkin", "Diller / CSV Dışa Aktar / CSV İçe Aktar" gerçek öğeler.
- Spec'ler doğru (çözünürlük, fps, süre, renk uzayı).

## Düzeltme (önceki not)
Önceki mesajlarda "demoda yalnızca 4 dil görünür" demiştim: yanlış. Dil seçici kaydırılabilir uzun liste; videoda Español, Italiano, Русский, العربية… görünüyor. Prompt ve metin dosyaları düzeltildi.
