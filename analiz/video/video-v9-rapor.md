# Çoklu Dil Reels v9 — rapor (revizyon 2)

## Revizyon 2 (inceleme düzeltmeleri)
1. **Boş plaka yok:** plaka yalnız konuşma parçası varken görünür; parçalar arası sessizlik >0,15 sn ise plaka + metin 120 ms'de söner, yeni cümlede 120 ms'de geri gelir; bitişik parçalar arasında anlık geçiş. Testte "boş plaka süresi" = **0,000 sn** (tam ve kısa). Plaka görünür süre: tam 28,7 / kısa 25,13 sn.
2. **Son 0,7 sn:** kapanış metni 160 ms'de çıkar, kanca metni 300 ms'de girer; plaka yok. Plaka dışı öğesiz en uzun an: tam 0,10 sn, kısa 0,07 sn (önceki 0,3 sn).
3. **S5 kırpmaları:** sağdaki krem maske kaldırıldı; kart içeriğe oturdu (764×225, ortalı). Not: genişlik 900'den 764'e düştü (komşu kart şeridi kadrajda kalmasın diye).
4. **S4 kanıt kartı:** 900×628 (önceki 900×600), menü ekranları ölçek 1,15 (etkin metin ürün adı ≈33, fiyat ≈32, açıklama ≈26 px). 900×720 mümkün değil: B bölgesi y 330–1020, plaka y 1040'ta; etiket satırı + kart toplam 690 px'e sığar. Sığmayan 3. satır kırpıldı.
5. **Senkron:** dil seçici, cümle 5 ("Menü ve sipariş kendi dilinde açılır") başlamadan 1,0 sn önce kapanır; TR menü cümle başında görünür (kontrol: 12,27 sn karesi = TR menü, plaka henüz yok).
Önceki sürümle aynı kalanlar aşağıda.


Dosyalar: `out/coklu-dil-reels_v9.mp4` (31,9 sn) · `out/coklu-dil-reels_v9-kisa.mp4` (28,03 sn; cümle 6 çıkarıldı) · `.srt` (tam ve kısa) · `out/dogrulama-v9-*.json` · `out/sheet-v9-*.jpg` · `out/kontrol-v9/`.
Ses ve metin değişmedi (`ses/anlatim-v4.mp3`, `ses-metni-v4.md`). Kısa sürüm: `ses/kisa-uret-v4.py` (kesim 0,25 sn boşluk + 20 ms solma, hız değişmez) → `ses/anlatim-v4-kisa.mp3`, `ses/cue-v4-kisa.json`.
Teslim: video 1080×1920, 30 fps, H.264 bt709 ≈6,7 Mbps, −14,1 LUFS, örnek tepe −1,81 dBFS (tam) / −1,68 (kısa); limiter −2,0 dB.

## Giderilen hatalar (v8 listesi)
1 sayaç kaldırıldı · 2 çipler yalnız TR EN DE FR ES IT RU AR, "20'den fazla dil" · 3 işlevsel içerik y≤1248 (D'de yalnız `.dekor`) · 4 plaka kanıtı kesmiyor (kanıt y 400–1000, plaka 1040–1236) · 5 telefon mockup'ı yok, 900×600 gerçek ekran kırpması (ölçek 1,0–1,125) · 6 acı kartları 430×220, yazı 40 px · 7 metin çakışması yok (çıkış 160 ms, sonra giriş; plaka hep opak, yalnız metin 60 ms) · 8 geçiş çukuru: plaka dışı öğesiz en uzun süre 0,30 sn (yalnız kapanış→açılış), diğer geçişlerde 1 kare · 9 anahtar kartlar altyazıyı tekrarlamıyor (acı ve fayda sahnelerinde anahtar kart yok) · 10 halka/karartma yok · 11 URL 56 px (sığmazsa küçülür; ölçülen 56), logo A'da 240 px, ok yok · 12 etiket 36 px · 13 kısa sürüm · 14 tepe limiti.
Kullanıcı kararları (Faz A): D dekor metni kalsın (testte `.dekor` muaf); aktif dil B'de yazılı ("TR · Türkçe" vb.); S2 boş çerçeveler MASA 5–8 ile dolduruldu, S3 boş çerçeveler kaldırıldı (yerine D'de dekor dil çipleri); Diller/CSV kırpmalarında komşu kart şeridi maskelendi; dil seçicide "Filtrele" artık tam görünüyor.

## Otomatik test sonuçları (30 fps, tam ve kısa; hepsi 0 ihlal)
metin–metin çakışma 0 · y>1248'de işlevsel öğe 0 · boş plaka (görünür ama metinsiz / konuşma penceresi dışında) kare 0 · güvenli bölge 0 · sağ ray 0 · min yazı ≥36 px (ihlal 0) · kontrast (dolgu-bilinçli; plaka ≥7:1, en düşük 7,79; diğer ≥4,5) 0 ihlal · kanıt kartı genişliği ≥900 (0 ihlal) · çipler yalnız 8 dil · yasak ifade ("Bekleme süresi", d:dd, otuz, 30 dil, PT/NL/PL) 0 · halka/karartma DOM'da yok · bounce/elastic/rotate yok · Kiril/Arapça glif yok · altyazı metni = ses metni (tam 12/12, kısa 11/11) · başlangıç sapması ≤0,05 sn · bayat metin 0 · satır ihlali 0 · CSV İçe Aktar vurgusu tam: 21,63–23,50 sn, kısa: 17,77–19,67 sn.
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

## Revizyon 2'de açıp bakılanlar
Anahtar kareler 5-en-menu, 7-csv-vurgusu, 9c/9d-loop, 4-dil-secici tam boyutta; nihai tam videodan 4,3 / 12,27 / 31,5 sn kareleri tam boyutta; 1 fps kontak sayfası (tam). Kısa sürümün kontak sayfası bu revizyonda açılmadı (aynı kod yolu; testleri 0 ihlal).

## Hangi kareleri açıp bakıldı (ilk sürüm)
Faz A kontrol karelerinin TAMAMI tam boyutta: 1-kanca, 2-aci, 3-donus, 4-dil-secici, 5-en-menu, 6-diller, 7-csv-vurgusu, 8-kapanis, 9a-gecis-4.4s, 9b-gecis-4.6s, 9c-loop-gecis, 9d-loop-gecis (3, 4, 6, 7, 8 düzeltme sonrası yeniden). Son videolar için: tam ve kısa 1 fps kontak sayfaları (`sheet-v9-1sn.jpg`, `sheet-v9-kisa-1sn.jpg`) ve v8|v9 karşılaştırma (`kontrol-v9/karsilastirma-v8-v9.jpg`) açılıp bakıldı; nihai videodan tam boyutlu tek kare ayrıca açılmadı (kareler aynı render hattından).
