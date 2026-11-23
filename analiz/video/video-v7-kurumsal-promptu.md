# Claude Code promptu — Çoklu Dil Reels v7: KURUMSAL tema (3B çizgi film öğeleri kalkıyor)

Dal: `claude/qr-menu-instagram-strategy-rs76jf` (PR açma, ana dala push yok). v1–v6 ve tüm eski dosyalar DEĞİŞMEZ; yeni dosyalar `-v7` sonekli.

## Amaç
`out/coklu-dil-reels_v6.mp4` (35,8 sn) içeriğini koruyup görsel dili baştan kurumsal hâle getir. Kullanıcı geri bildirimi: 3B figürler, konuşma balonları ve oyuncak gibi animasyonlar çocuksu; kurumsal bir yazılım firmasına yakışmıyor. Kapak ve gönderiler zaten yeni standartta (tipografik, figürsüz). Video bunlarla aynı marka diline geçecek.

## KORUNACAKLAR (dokunma)
- **Ses:** `ses/anlatim.mp3` + `ses/cue.json` (tam) ve `ses/anlatim-kisa.mp3` + `ses/cue-kisa.json`. TTS'i YENİDEN ÜRETME, ses metnini değiştirme (`ses-metni.md`). Telaffuz kullanıcıca onaylı.
- **Gerçek ürün ekranları:** `ekran/*.png` (01–07e). Arayüz yeniden çizilmez, yalnız kırpılır/kadraja alınır.
- **Mantık ve iddia sınırları:** Yasak: "AI/yapay zeka/otomatik çeviri", yüzde/oran, "ücretsiz", "anında", "devrim", "sınırsız". CSV vurgu kuralı (v6): "CSV" kelimesinde *CSV İçe Aktar* vurgulanır, *CSV Dışa Aktar* hiç vurgulanmaz. "28 dil etkin" = demo hesap, kapasite 30.
- Çıktı biçimi: 1080×1920, 30 fps, bt709, ses −14 LUFS, kapanış karesi → ilk kareye çapraz geçiş (`render/kapanis.py` mantığı).

## KALDIRILACAKLAR
3B insan figürleri (garson, turist), masa, "?" ve "…" konuşma balonları, `RESTORAN SAHİBİ İÇİN` hapı, zıplama/esneme/dönme animasyonları, kamera savrulmaları, three.js sahnesi (`scene-v*.mjs`) bu videoda KULLANILMAYACAK.

## MARKA DİLİ (carousel/kapakla aynı; kaynaklar: `tools/ig-carousel/SPEC.md`, `analiz/carousel-dil/carousel-v6.html`, `analiz/video/kapak/kapak-video.html`)
- Yazı tipi yalnız **Manrope** (`assets/fonts/manrope-var-latin(.-ext).woff2`). Renkler: koyu yeşil #0D2B22 / #1E3D2F, altın #C9A84C (üst ışık #E8C766, alt #B8963F), krem #F4F1E8.
- **Renk dramaturjisi (kapakla kopukluğu çözer):** AÇILIŞ ve KAPANIŞ ALTIN zeminde (koyu yeşil metin; ilk kare kapağın kompozisyonuyla aynı dilde), ORTA bölüm (çözüm + ürün ekranları) ZÜMRÜT zeminde (krem metin, altın vurgu). Geçiş: tek yatay/dikey perde (wipe), 450 ms.
- Süs: ince altın köşe ayraçları + %11 nokta ızgarası (zümrüt bölümde), üst etiket "ÇOKLU DİL MODÜLÜ", altın pill vurgu (cümle başına en fazla bir). Logo (koyu/altın varyant) yalnız açılış ve kapanışta.
- Hareket dili: yalnız opaklık + 24–48 px kayma + hafif ölçek (en çok %3), easing ease-out (cubic/quint), süre 280–480 ms. YASAK: back/elastic/bounce/overshoot, rotasyon, sallanma, parıltı/konfeti, emoji, sticker. Hareket başına tek odak. Kamera hareketi yok (en çok ≤12 px yavaş sürükleme).
- Ekran gösterimi: telefon/panel ekranları DÜZ (eğimsiz) çerçevede: yuvarlatılmış dikdörtgen, 2 px koyu kenar, yumuşak gölge. Vurgu = ekranın geri kalanını %55 karartıp ilgili alana 3 px altın çerçeve (büyüteç/lens animasyonu yerine).
- Yazı: ses cümleleri ekranda yazılı (sessiz izleme). Ana cümle 76–96 px, 800; ikincil 44–56 px; en küçük metin ≥ 36 px. Güvenli bölge: üst 270, alt 672, yan 65 (metin bunun içinde); sağ üst 160×160 boş.

## SAHNE HARİTASI (zamanlar `ses/cue.json` cümle sınırlarından türetilir; sabit saniye YAZMA)
1. **Kanca** — ALTIN. "Yabancı misafir geldi. Menüyü kim anlatacak?" iki satır büyük tipografi, "kim anlatacak?" pill.
2. **Acı** — ALTIN→koyu ton. "Garsonunuz tercümana dönüşüyor, diğer masalar bekliyor. Anlamayan misafir de sormaya çekinir." Çizgi film yok: dört masayı temsil eden DÜZ dört kare/daire şeması; biri altın dolu (garsonun meşgul olduğu masa), diğer üçü sırayla soluyor ("bekliyor"); altında cümle yazısı. Soyut, bilgi grafiği dili.
3. **Dönüş** — "Çözüm menünün kendisinde." tek satır, ZÜMRÜT'e perde geçişi.
4. **Çözüm** — ZÜMRÜT. "Misafir QR'ı okutur, dilini seçer…" düz telefon çerçevesi içinde gerçek ekranlar sırayla: `01-acilis-tr` → `02-dil-secici` → `03-menu-tr` → `04-menu-en` → `05-menu-de` → `06-menu-fr`; üstte dil kodu şeridi (TR · EN · DE · FR) aktif olan altın; rozet "Gerçek demo menü" (çerçevesiz küçük etiket, pill değil).
5. **Modül** — ZÜMRÜT. "Bu, Çoklu Dil modülü. Dilleri siz tanımlarsınız. Çevirileri elle ya da CSV ile girersiniz. Otuz dile kadar." Panel ekranları (`07-panel-diller-ceviriler`, `07c-panel-csv-ice`) düz çerçevede, vurgu = karartma+altın çerçeve (CSV kuralına uy); yanında "Elle · CSV · 30 dile kadar" tipografi.
6. **Fayda + CTA** — ALTIN. "Garsonunuz servise dönsün. … Bağlantı profilimizde." Büyük: "Canlı menüyü telefonunuzda deneyin", altında adres `qrmenuofficial.com/canli-menu` (UTM yazılmaz), logo; son kare ilk kareye çapraz geçiş.

## ÇIKTILAR
`out/coklu-dil-reels_v7.mp4` (tam) ve `out/coklu-dil-reels_v7-kisa.mp4` (kısa ses/cue ile aynı sahneler), `video-v7-rapor.md`, `out/dogrulama-v7-*.json`, 1 fps kontak sayfası `out/sheet-v7-*.jpg`, v6|v7 karşılaştırma kareleri `out/kontrol-v7/`. Yeni kaynaklar: `render/index-v7.html`, `render/scene-v7.mjs` (DOM/CSS/SVG, three.js YOK; `window.frame(t)` ile deterministik), `render/render-v7.mjs`, `encode-v7.sh`. Üç boyutlu sahneye bağımlılık kalmamalı.

## DOĞRULAMA (v6 testlerini uyarla: `render/dogrula-v6.py`, `layout_check-v5.mjs`)
Güvenli bölge ihlali 0; en küçük metin ≥36 px; kontrast: metin ≥4.5:1, grafik ≥3:1; boş kare yok; ses–yazı senkronu ≤0,15 sn; sessizlik 0; −14 LUFS; CSV vurgu testi; "kullanılan easing back/elastic/bounce içermez" kod taraması; çıktıda 3B/figür/balon yok (kare incelemesi). Rapor "kontrol edildi" demeden önce kareler gerçekten açılıp bakılmış olmalı; ses dinlenemediği için telaffuz/kesim notunu kullanıcıya bırak.

## KARAR KAPISI
Önce 6 ANAHTAR KARE (PNG, 1080×1920): kanca, acı şeması, dönüş (perde ortası), telefon–dil seçici, panel–CSV vurgusu, CTA. Bunları `out/kontrol-v7/` altına koyup DUR; kullanıcı onayı olmadan tam render'ı başlatma.

## YASAK
Kimlik bilgisi/token/çerez commit'leme; panele oturum açma (ekranlar hazır); mevcut v1–v6 dosyalarını silme/değiştirme; PR açma.
