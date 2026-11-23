# Çoklu Dil Reels v8 — rapor

Dosyalar: `out/coklu-dil-reels_v8.mp4` (31,9 sn, 1080×1920, 30 fps, H.264 bt709 ≈6,7 Mbps, −14,1 LUFS), `out/coklu-dil-reels_v8.srt`, `out/dogrulama-v8.json`, `out/sheet-v8-*.jpg`, `out/kontrol-v8/` (anahtar kareler, v7|v8 karşılaştırma).
Ses: kullanıcının ElevenLabs çıktısı `ses/anlatim-v4.mp3` (değiştirilmedi). Zamanlar `ses/cue-v4.json` (silencedetect, `ses/cue-uret-v4.py`); 13 konuşma parçası bulundu, 12. cümle ile eşleşmek için "Turist QR'ı okutur, | dilini seçer." içindeki 0,19 sn'lik virgül duraklaması birleştirildi (betik yalnız bu yerde birleştirmeye izin verir).

## Otomatik kontrol sonuçları (ölçülen)
- Altyazı metni = ses metni (12/12 cümle birebir). Başlangıç sapması ≤0,05 sn. Bayat metin 0 kare. Plaka sabit (x65–1015, y1040–1236), ≤2 satır, satır ihlali 0. 14 altyazı parçası, en kısa 0,62 sn.
- Plaka kontrastı ≥7:1 (altın sahne koyu plaka + #E8C766 vurgu; zümrüt sahne krem plaka + #5C480D vurgu).
- Güvenli bölge (A/B/C) ihlali 0; sağ ray (x>940, y1000–1700) ihlali 0.
- CSV vurgusu: yalnız *CSV İçe Aktar*, 21,70–23,50 sn ("dosyadan toplu yüklersiniz"); *Dışa Aktar* hiçbir karede yok.
- Yasak hareket (bounce/elastic/back/rotate) 0; Kiril/Arapça glif 0; "otuz" yok, "Yirmiden fazla dil" var.
- Ses −14,1 LUFS; 0,3 sn üstü sessizlik 0.

## Sapmalar / başarısız hedefler (dürüst)
1. **Dikey doluluk hedefi sağlanamadı.** İçerikle tek başına sahne ortalamaları %37–79; arka plana eklediğim halka dokusu + üst/alt karartma dahil %66–92. Hedef: sahne 2/4/5 ≥%85, sahne 1/3/6 ≥%70. Telefon sahneleri (r4) %83, Acı (r2) %82, Dönüş (r3) %66 → hedefin altında. Halka/karartma spec'te yok, sayıyı yükseltiyor ama gerçek içerik değil.
2. **Üstte 270 px** metin yasağı nedeniyle yalnız dekorla dolu.
3. **Telefon** ≈940 px ekran yüksekliği (spec ≈1500): gerçek ekran görüntüleri 1800 px yükseklikte ve alt çubuk kesildiği için daha uzun olamıyor; yeniden yakalama yapılmadı (`PANEL_*` bilgisi yok).
4. **Yazı boyutu:** etiket "ÇOKLU DİL MODÜLÜ" 32 px (spec'in kendi değeri; ≥36 kuralının dışında). Diğer tüm DOM metni ≥36 px. Ekran içi UI metni (ekran görüntüsü) ≈ 0,93 ölçekte; ≥30 px etkin ölçümü otomatik yapılmadı, gözle kontrol edildi.
5. **Kart/karo genişlikleri 410 px** (spec 440; sağ ray için).
6. **Geçişlerde kısa boşluklar:** 7,7 / 24,9 / 27,5 sn civarında içerik <%15'e düşen ≤0,2–0,3 sn'lik çapraz geçiş çukurları var (0,4 sn eşiğinin altında, ancak "ölü kare" sıfır değil).
7. Kontrast testi, dolgulu öğelerde (altın dolgulu kart/çip/hap üzerindeki koyu metin) zemini yanlış varsayıyor: 7 sahne-metni "ihlal" raporu bu test artefaktı (gerçekte koyu/altın dolgu üzerinde ≥5:1), el ile doğrulanmadı.
8. Altyazı vurgu rengi zümrüt sahnede #7F6419 yerine #5C480D (7:1 için); spec'teki #7F6419 krem üzerinde 4,97:1.
9. Son kare→ilk kare 0,69 sn çapraz geçişi var; geçiş sırasında iki başlık üst üste görünür (spec'in istediği çapraz geçiş).

## Yapılamayan / kullanıcıya bırakılan
- Telaffuz ve kesim kontrolü (ses dinlenemedi).
- Gerçek cihazda Reels arayüzü üst/alt örtüsü testi.
