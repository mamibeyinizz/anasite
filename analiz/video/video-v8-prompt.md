# Claude Code promptu — Çoklu Dil Reels v8 (v7'nin UX/altyazı/anlatım düzeltmesi)

Dal: `claude/qr-menu-instagram-strategy-rs76jf` (PR açma, ana dala push yok). v1–v7 DEĞİŞMEZ; yeni dosyalar `-v8` sonekli. Girdi analizi: `out/coklu-dil-reels_v7.mp4` (kullanıcı reddetti: "kare olmuş, uzun ekran yok, altyazı yok, anlatım berbat").

## 1) v7'de ÖLÇÜLEN hatalar (hepsi giderilecek)
1. **İçerik tüm süre boyunca y=324–1260 bandında (936 px = ekranın %49'u).** Tuval 1080×1920 ama kompozisyon 1:1'e yakın; kare 0–35 sn aynı bant. Üstte 324 px, altta 660 px (%34) boş. Neden: Meta güvenli bölgesi (üst 270, alt 672, yan 65) yalnız METİN için geçerlidir; v7 görselleri, ekranları ve arka planı da bu banda hapsetti. Köşe ayraçlarından oluşan sabit kare çerçeve bunu pekiştirdi.
2. **Altyazı yok.** Dosyada altyazı akışı yok; ekrandaki yazılar cümle parçalarını ortada tek tek gösteren "başlık kartları". Okunacak sürekli, cümle-senkronlu altyazı hiç yok.
3. **Ürün ekranları okunmuyor.** Telefon ≈300 px geniş (ekranın %28'i); içindeki menü yazısı ≈10 px. Panel kırpması dört küçük kart (≈24 px yazı) + 20 px "MÜŞTERİ DENEYİMİ" etiketi. "Gerçek demo menü" kanıtı okunmuyor.
4. **Ölü kareler:** 9–11 sn arası kareler neredeyse boş yeşil (yalnız solan yazı); 27–29 sn altın kare boş.
5. **Acı şeması (3–9 sn) anlamsız:** dört küçük daire + "?" radyo düğmesi gibi görünüyor; "masa" olduğu anlaşılmıyor.
6. **CTA zayıf:** URL satırı soluk (düşük kontrast), logo küçük, "Bağlantı profilimizde" ayrı bir karede tek başına.
7. **Anlatım (ses metni v3) zayıf:** özellik sayımı + jargon ("Dilleri siz tanımlarsınız", "CSV"), "Otuz dile kadar" ama carousel/açıklama "20'den fazla dil" diyor (rakam tutarsızlığı), gönderilerin satış/acı söylemiyle uyumsuz.

## 2) ANLATIM: yeni metin ve ses
- Yeni metin: `analiz/video/ses-metni-v4.md` (8 cümle, ≈27 sn). Ses kullanıcı tarafından aynı ElevenLabs sesiyle üretilip `analiz/video/ses/anlatim-v4.mp3` olarak konacak.
- **Sen ses ÜRETME.** `ses/anlatim-v4.mp3` yoksa: Faz A (aşağıda) tahmini zamanlarla anahtar kareleri üret ve DUR. Dosya gelince Faz B.
- `ses/cue-uret.py` v3'e özel (14 cümle, sabit başlık listesi). Genelleştirilmiş `ses/cue-uret-v4.py` yaz: `ses-metni-v4.md` düz metnindeki cümleleri ayır, ses dosyasından konuşma parçalarını (silencedetect) bul, cümle sayısı eşleşmezse DUR ve parça listesini yazdır. Çıktı: `ses/cue-v4.json` (`cumleler: [{no, metin, baslangic, bitis}]`). Videoyu bu dosyadan sür; sahne/altyazı zamanlarına sabit saniye YAZMA.

## 3) YERLEŞİM SİSTEMİ (1080×1920, tam boy)
- **Arka plan ve görseller 0–1920 tam boy.** METİN güvenli bölgede: x 65–1015, y 270–1248. Sağ ray: y 1000–1700 arası x>940'a yazı/önemli arayüz koyma (Instagram düğmeleri).
- Dört bölge:
  - **A (y 270–330):** üst etiket "ÇOKLU DİL MODÜLÜ" (32 px, 800, .42em). CTA sahnesinde logo burada soldadır.
  - **B (y 360–1000):** anahtar kart (hook/CTA'da büyük tipografi, 2–5 kelime, 120–146 px) ya da ana görselin üst kısmı.
  - **C (y 1040–1236):** ALTYAZI plakası (aşağıya bak). Tüm sahnelerde sabit konum.
  - **D (y 1248–1920):** görselin devamı (telefon gövdesi, kartlar, desen). Burada METİN YOK; ama BOŞ DA OLMAYACAK.
- **Dikey doluluk testi:** 1 fps'te her karede satırların (0–1920) en az %85'inde arka plandan farklı piksel (ürün sahneleri 4–5 ve acı sahnesi 2); tipografik sahnelerde (1, 3, 6) en az %70. v7 ortalaması %49 idi.
- **Sabit kare çerçeveyi KALDIR** (köşe ayraçları). Zemin tam ekran gradyan + %11 nokta ızgarası (tüm tuvalde). Marka: Manrope (yalnız `assets/fonts/manrope-var-latin(.-ext).woff2`; Kiril/Arapça glifi YOK, bu yüzden kullanma), altın #C9A84C, koyu yeşil #0D2B22/#1E3D2F, krem #F4F1E8. Açılış ve kapanış ALTIN, orta bölüm ZÜMRÜT (v7 gibi). Hareket: yalnız opaklık + 24–48 px kayma + ≤%3 ölçek, ease-out, 280–480 ms; bounce/elastic/back/rotasyon yok; çocuksu öğe yok (3B figür, balon, emoji, sticker).

## 4) ALTYAZI (zorunlu, tüm videoda)
- Metin = ses metninin AYNISI (paraphrase yok). Biçim: plaka x 65–1015, y 1040–1236 (yükseklik ≤196), köşe 28 px; en çok 2 satır, satır ≤26 karakter, yazı 64 px / 800 / satır yük. 1.18, ortalı.
- Renk: ALTIN sahnede plaka #0D2B22 (%92) + krem metin; ZÜMRÜT sahnede plaka #F4F1E8 (%94) + koyu yeşil metin; kontrast ≥7:1. Aktif parçada anahtar kelime ALTIN/koyu pill DEĞİL, yalnız renk (altın ya da #7F6419) + 800.
- Zamanlama: cümle sınırları `cue-v4.json`. >2 satır tutan cümle ardışık parçalara bölünür; parça süresi karakter sayısıyla orantılı, en az 0,9 sn. Cümle başında ≤0,15 sn gecikme/öne alma. Konuşma boşluğu >0,5 sn ise plaka söner (eski metin ekranda KALMAZ).
- Aynı metin hem altyazıda hem büyük tipografide tekrarlanmaz: anahtar kart yalnız 2–5 kelimelik özet kavramdır (aşağıdaki sahneler).
- Ek çıktı: `out/coklu-dil-reels_v8.srt` (yedek).

## 5) SAHNELER (süre = cümle cue'larından türet)
1. **Kanca (ALTIN)** — cümle 1–2. B: anahtar kart "Dil engeli, / kayıp masa." (≈140 px, sola dayalı). D: ardışık dört selamlama satırı "Hello? / Hallo? / Bonjour? / ¿Hola?" (88 px, koyu yeşil %60, bir kelime/0,5 sn belirir; yanıtsız kalmış hissi). Logo yok.
2. **Acı (ALTIN→koyu perde)** — cümle 2. B: "Diğer masalar bekliyor." D: 2×2 MASA KARTI (her biri 440×250; "MASA 1…4" başlık + durum): 1. kart altın dolu "GARSON: yabancı masada", diğer üçü "BEKLİYOR" + ince zaman çubuğu dolar. Düz, bilgi grafiği dili.
3. **Dönüş (ZÜMRÜT'e perde)** — cümle 3 "Çoklu Dil modülü bunu çözüyor." B: "Çözüm: / Çoklu Dil" (altın pill yalnız "Çoklu Dil"). D: kelime aralıklı dil kodları TR·EN·DE·FR·RU·AR +20 dil (80 px).
4. **Çözüm (ZÜMRÜT)** — cümle 4–5. Telefon: genişlik 700, yükseklik ≈1500, x merkez, üst y=330, alt kenar 1830'a TAŞAR (D'ye devam eder). Gerçek ekranlar `ekran/01…06` sırayla; ekran içi içerik yatay sığdırılır, dil seçici açılışında üstte dil şeridi (TR·EN·DE·FR) aktif altın. Ekran yazısı etkin ≥30 px. Küçük "Gerçek demo menü" etiketi A bölgesinin altında (≥36 px).
5. **Modül (ZÜMRÜT)** — cümle 6. Panel ekranlarından BÜYÜK kırpmalar (kart genişliği ≥900 px, kart yazısı etkin ≥34 px): önce *Diller* kartı ("28 dil etkin"), sonra *CSV İçe Aktar* (karartma %55 + 3 px altın çerçeve; *CSV Dışa Aktar* HİÇ vurgulanmaz; CSV vurgusu cümlede "dosyadan toplu yüklersiniz" ifadesinde). B: "20+ dil" (altın, 190 px). D: ikinci kart/ekranın devamı.
6. **Kapanış (ALTIN)** — cümle 7–8. A: logo sol, etiket sağ. B: "Canlı menüyü / telefonunuzda deneyin" (110 px). URL `qrmenuofficial.com/canli-menu` y≈900'de 52 px, TAM OPAK koyu yeşil (soluk yok), UTM YAZMA. D: oynat düğmesi OLMADAN büyük logo + ince ok (profile işaret). Son kare ilk kareye 0,7 sn çapraz geçiş (`render/kapanis.py` mantığı).

## 6) TEKNİK
- Yeni: `render/index-v8.html`, `render/scene-v8.mjs` (DOM/CSS/SVG, three.js YOK, `window.frame(t)` deterministik), `render/render-v8.mjs`, `encode-v8.sh`. 1080×1920, 30 fps, bt709, H.264 ≥6 Mbps, ses −14 LUFS (`encode-v6.sh` mantığı), kapak yok (kapak ayrı: `kapak/kapak-video-altin.jpg`).
- Ekran görüntüleri `ekran/*.png`: yeniden çizme; yalnız kırp/ölçekle. Yükseltmede bulanıklık kontrolü: kırpma 2× üstüne ölçeklenmeyecek; gerekirse `ekran/` görüntüsünü yüksek çözünürlükte aynı yolla yeniden al (`tools/panel-video/`, salt okunur, kimlik bilgisi YALNIZ `PANEL_*` ortam değişkenlerinden; chat/log/repo'ya YAZMA). Yapamazsan nedenini raporla.

## 7) DOĞRULAMA (otomatik + göz; v6 testlerini uyarla: `render/dogrula-v6.py`, `layout_check-v5.mjs`)
Dikey doluluk (≥%85 / ≥%70); metin güvenli bölge ihlali 0; en küçük yazı ≥36 px (UI içi ekran yazısı etkin ≥30 px); kontrast metin ≥4.5, altyazı ≥7:1; altyazı senkron ≤0,15 sn; eski metin kalma 0; boş/ölü kare (≥0,4 sn, anlamlı öğesiz) 0; CSV vurgu testi; kodda back/elastic/bounce taraması; Kiril/Arapça glif kullanımı 0; ses −14 LUFS, sessizlik 0; tutarlılık: "20'den fazla/yirmiden fazla dil" dışında dil sayısı yok ("otuz" geçmeyecek). Kontak sayfası 1 fps, v7|v8 karşılaştırma kareleri `out/kontrol-v8/`. "Kontrol edildi" demeden önce kareler gerçekten açılıp bakılmış olmalı. Sesi dinleyemiyorsan telaffuz/kesim kontrolünü kullanıcıya bırak.

## 8) AŞAMALAR VE KARAR KAPISI
- **Faz A (ses yoksa/şimdi):** `ses-metni-v4.md` kelime sayısından tahmini zamanlarla 8 ANAHTAR KARE (PNG 1080×1920): kanca, acı, dönüş, telefon (dil seçici), telefon (EN menü), panel *Diller*, panel *CSV İçe Aktar*, kapanış. `out/kontrol-v8/` altına koy; dikey doluluk ve altyazı plakası görünür olsun; DUR, onay iste.
- **Faz B (onaydan ve `ses/anlatim-v4.mp3`'ten sonra):** `cue-uret-v4.py` → tam render → `out/coklu-dil-reels_v8.mp4` + `video-v8-rapor.md` + `out/dogrulama-v8.json`.

## 9) YASAK
Kimlik bilgisi/token/çerez commit'i; panele kimlik bilgisini sohbete yazma; v1–v7 dosyalarını değiştirme/silme; ses üretme; PR açma; ana dala push.
