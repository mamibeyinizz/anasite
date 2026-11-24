# Çoklu Dil Reels v9 — rapor

Dosyalar: `out/coklu-dil-reels_v9.mp4` (31,9 sn) · `out/coklu-dil-reels_v9-kisa.mp4` (28,03 sn; cümle 6 çıkarıldı) · `.srt` (tam ve kısa) · `out/dogrulama-v9-*.json` · `out/sheet-v9-*.jpg` · `out/kontrol-v9/`.
Ses ve metin değişmedi (`ses/anlatim-v4.mp3`, `ses-metni-v4.md`). Kısa sürüm: `ses/kisa-uret-v4.py` (kesim 0,25 sn boşluk + 20 ms solma, hız değişmez) → `ses/anlatim-v4-kisa.mp3`, `ses/cue-v4-kisa.json`.
Teslim: video 1080×1920, 30 fps, H.264 bt709 ≈6,7 Mbps, −14,1 LUFS, örnek tepe −1,81 dBFS (tam) / −1,68 (kısa); limiter −2,0 dB.

## Giderilen hatalar (v8 listesi)
1 sayaç kaldırıldı · 2 çipler yalnız TR EN DE FR ES IT RU AR, "20'den fazla dil" · 3 işlevsel içerik y≤1248 (D'de yalnız `.dekor`) · 4 plaka kanıtı kesmiyor (kanıt y 400–1000, plaka 1040–1236) · 5 telefon mockup'ı yok, 900×600 gerçek ekran kırpması (ölçek 1,0–1,125) · 6 acı kartları 430×220, yazı 40 px · 7 metin çakışması yok (çıkış 160 ms, sonra giriş; plaka hep opak, yalnız metin 60 ms) · 8 geçiş çukuru: plaka dışı öğesiz en uzun süre 0,30 sn (yalnız kapanış→açılış), diğer geçişlerde 1 kare · 9 anahtar kartlar altyazıyı tekrarlamıyor (acı ve fayda sahnelerinde anahtar kart yok) · 10 halka/karartma yok · 11 URL 56 px (sığmazsa küçülür; ölçülen 56), logo A'da 240 px, ok yok · 12 etiket 36 px · 13 kısa sürüm · 14 tepe limiti.
Kullanıcı kararları (Faz A): D dekor metni kalsın (testte `.dekor` muaf); aktif dil B'de yazılı ("TR · Türkçe" vb.); S2 boş çerçeveler MASA 5–8 ile dolduruldu, S3 boş çerçeveler kaldırıldı (yerine D'de dekor dil çipleri); Diller/CSV kırpmalarında komşu kart şeridi maskelendi; dil seçicide "Filtrele" artık tam görünüyor.

## Otomatik test sonuçları (30 fps, tam ve kısa; hepsi 0 ihlal)
metin–metin çakışma 0 · y>1248'de işlevsel öğe 0 · plaka opaklığı <%95 olan kare 0 · güvenli bölge 0 · sağ ray 0 · min yazı ≥36 px (ihlal 0) · kontrast (dolgu-bilinçli; plaka ≥7:1, en düşük 7,79; diğer ≥4,5) 0 ihlal · kanıt kartı genişliği ≥900 (0 ihlal) · çipler yalnız 8 dil · yasak ifade ("Bekleme süresi", d:dd, otuz, 30 dil, PT/NL/PL) 0 · halka/karartma DOM'da yok · bounce/elastic/rotate yok · Kiril/Arapça glif yok · altyazı metni = ses metni (tam 12/12, kısa 11/11) · başlangıç sapması ≤0,05 sn · bayat metin 0 · satır ihlali 0 · CSV İçe Aktar vurgusu tam: 21,63–23,50 sn, kısa: 17,77–19,67 sn.
Test notu: metin kutuları çakışma/güvenli bölge için dikeyde %18 daraltıldı (font içerik kutusu yerine glif yüksekliğine yakın); ilk denemede bu olmadan yanlış pozitif çıktı.

## Dürüstçe: sınırlı/başarısız noktalar
1. **Kanıt kartı yüksekliği:** S4 kartları 900×600; S5'te *Diller* ve *CSV İçe Aktar* kırpmaları 900×225 (900×600 olursa *CSV Dışa Aktar* kartı kadraja girerdi). "Ana görsel ≥900×600" yalnız S4'te sağlanıyor.
2. **Dil seçici kartında etkin metin ≈18–20 px** (kaynak ekranda liste yazısı küçük; ölçek 1,0). ≥30 px sağlanmıyor; ekran yeniden yakalanmadı (`PANEL_*` yok). EN/DE/FR/TR menü satırları ≥30 px.
3. Dil seçici kırpmasında sağda ≈40 px koyu boşluk (kaynak 860 px, kart 900 px) ve bir komşu ürün kartının ince dilimi görünüyor.
4. "Gerçek demo menü" etiketi kartın alt-sol köşesi yerine kartın üstünde, sağ hizada.
5. S5/S6 ve S3'te D bölgesi dekor metni içeriyor (kullanıcı onaylı).
6. Kapanış sahnesinde D boş (planlandığı gibi); kapanış→açılış geçişinde 0,3 sn'lik sahne öğesiz an var (plaka ve zemin görünür).
7. Kısa sürümde DE/FR menüleri cümle 5 içinde hızlı değişiyor (cümle 6 yok).
8. Plaka metni geçişlerinde (60 ms) kısa boş an olabilir; plaka kendisi her karede opak.
9. Gerçek telefonda Reels arayüzü testi, telaffuz ve kesim kontrolü yapılmadı (ses dinlenemedi; kesim doğal sessizlik ortasında).

## Hangi kareleri açıp bakıldı
Faz A kontrol karelerinin TAMAMI tam boyutta: 1-kanca, 2-aci, 3-donus, 4-dil-secici, 5-en-menu, 6-diller, 7-csv-vurgusu, 8-kapanis, 9a-gecis-4.4s, 9b-gecis-4.6s, 9c-loop-gecis, 9d-loop-gecis (3, 4, 6, 7, 8 düzeltme sonrası yeniden). Son videolar için: tam ve kısa 1 fps kontak sayfaları (`sheet-v9-1sn.jpg`, `sheet-v9-kisa-1sn.jpg`) ve v8|v9 karşılaştırma (`kontrol-v9/karsilastirma-v8-v9.jpg`) açılıp bakıldı; nihai videodan tam boyutlu tek kare ayrıca açılmadı (kareler aynı render hattından).
