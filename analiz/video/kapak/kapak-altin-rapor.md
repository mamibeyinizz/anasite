# Kapak ALTIN — rapor

Dosyalar: `kapak/coklu-dil-kapak-ALTIN.png|jpg` (JPG kalite 92, 0.31 MB), `kapak/onizleme-ALTIN.jpg` (gönderi-açı · carousel-1 · ALTIN, 330 ve 600 px), `kapak/kontrol-ALTIN.json`. Kaynak: `render/kapak-altin.mjs` (+ `scene-kapak-altin.mjs`, `index-kapak-altin.html`, `sunucu-kapak-altin.mjs`, `kapak-altin-isle.py`). Mevcut video sahne/HTML/sunucu dosyaları değiştirilmedi; video zümrüt kalıyor. Görsel gerçekten açılıp bakıldı: tam kare üst bölümü, 3:4 kırpım ve montaj.

## Ne değişti (geometri aynı: grup y 785–1400, metin 428, logo 1415, metin 170 px / ls −.064em, balon boyutları)
- **Zemin:** radial gradyan #E8C766 (üst-orta) → #C9A84C → #B8963F; yeşil ışıma/vinyet yok, yerine rgba(60,40,0,.16) sıcak vinyet.
- **Metin:** "Garsonunuz" ve "mı?" #0D2B22; "tercüman" #0D2B22 pill (köşe 22 px) içinde #F4F1E8. Hap kaldırıldı; aynı yerde (y 342) çerçevesiz "ÇOKLU DİL MODÜLÜ" (#0D2B22, 40 px, 800, .42em).
- **Figürler:** garson #0D2B22, turist #2F5B48, masa üstü #1E3D2F + krem kenar halkası, menü kartı krem; `rim` ışığı sıcak beyaza (#FFF4E0) ve yoğunluk 1,0'a indi.
- **Balonlar:** "?" krem + koyu "?" + ≈6,5 px #0D2B22 dış çizgi; "…" #0D2B22 dolgu + altın nokta.
- **Logo:** `v4-dark` (#0D2B22), 270 px, aynı konum.

## Kontrast (ölçülen, piksel örneklemesi; zemin = yalnız-zemin render'ından yerel medyan)
| Çift | Oran |
|---|---|
| kanca_Garsonunuz/zemin | 7.99 |
| kanca_mı?/zemin | 7.09 |
| tercuman_krem/pill | 13.42 |
| tercuman_pill/zemin(grafik) | 7.9 |
| modul_adi/zemin | 7.9 |
| logo/zemin | 5.98 |
| garson_govde/zemin(grafik) | 5.86 |
| turist_govde/zemin(grafik) | 3.31 |
| masa_ustu/zemin(grafik) | 5.57 |
| garson_ile_turist(birbirinden) | 1.75 |
| soru_balon_dolgu/zemin | 1.81 |
| soru_balon_cizgi(#0D2B22)/zemin | 7.41 |
| nokta_balon_dolgu/zemin | 7.01 |
| soru_isareti/balon | 13.42 |

Metin/logo çiftlerinin hepsi ≥4,5:1 (en düşük 5.98). Grafikler: garson/masa ≥3:1; turist/zemin 3.31:1.

## Yerleşim ve okunurluk
- 330 px'te kanca satır yüksekliği **50.9 px** (≥30).
- 3:4 kırpım içinde her şey tam: ink y 356–1489 (üstten 116, alttan 191 px pay). Üst 240 px dolu piksel 0; sağ üst 160×160 dolu piksel 0. Kanca metni Reels alt 672 sınırının içinde (y ≤ 1248), üst 270'in altında değil.
- **Zemin/yeşil artık:** zemin piksellerinin ortalaması #C0A047, kenar 40 px bandı #B69540; yeşil baskın piksel oranı 0.0 (tüm zemin) ve 0.0 (kenar); yeşil ton aralığında (HSV) piksel oranı 0.0.

## Sapmalar ve riskler
- **Yan marj 65 px ihlali:** metin x 18–1049; "tercüman" pill'i x 18'te başlıyor (kırpım kenarına 18 px). Geometri/boyut değişmeyeceği için A2 ile aynı kaldı; 3:4 kırpım tam genişlik olduğundan kesilmiyor ama kenara yakın. Pill iç boşluğu (.08 em) kenarı daha da yaklaştırmasın diye dar tutuldu.
- **Kollar krem değil:** istenen "kollar/yüz detayları krem" uygulanmadı; krem kol altın üstünde ≈1,9:1 olurdu (grafik eşiği 3:1). Kollar gövdeyle aynı koyu yeşil.
- **Krem "?" balon dolgusu altından ayrışmıyor** (1,81:1); okunurluğu dış çizgi taşıyor (çizgi/zemin 7.41:1).
- **Garson ile turist birbirinden** düşük kontrastla ayrışıyor (1.75:1; #0D2B22 vs #2F5B48); ayrım ton ve konumla, parlak kenarla değil.
- **Dikkat (kapak dışı):** montajdaki `2-carousel-1.jpg` "%60 daha fazla satış" yazıyor; içerik kuralı (rakam/yüzde, kanıtsız vaat yasağı) ile çelişiyor. Bu görsele dokunmadım.
- Altın kapak + zümrüt video kopukluğu duruyor.

## Karar kapısı
Videoyu altına çevirmeye başlamadım. Önce kapağı onaylayın; video dönüşümü (≈1000 kare yeniden render, ekran maketleri, altyazılar) ayrı iş.
