# Kurgu promptu (Claude Code'a verilecek) — Çoklu Dil Reels

GÖREV
1080×1920, 30 fps, 25 sn, dikey Reels (mp4, H.264, bt709, 48 kHz stereo AAC) üret. Konu: QR menüde Çoklu Dil. Üç boyutlu sahne three.js ile, kareler Playwright + swiftshader ile render edilir, ffmpeg ile birleştirilir. Çalışma dizini: `anasite/analiz/video/`. Kaynak olarak `insta/src/aura/` içindeki render.mjs / encode.sh / make_audio.py mantığını İZLE (yalnızca teknik şablon; içeriğini, marka metnini ve ses dosyasını kullanma, başka bir markaya aittir).

GİRDİLER
- Ekran görüntüleri (430×900 CSS px, 2x): `ekran/01-acilis-tr.png`, `02-dil-secici.png`, `03-menu-tr.png`, `04-menu-en.png`, `05-menu-de.png`, `06-menu-fr.png`. Kaynak: test sitesi `plus.qrmenuofficial.com` herkese açık müşteri ekranı.
- Panel ekranı (Diller & Çeviriler tablosu) henüz YOK: `ekran/07-panel-diller-ceviriler.png`. Dosya yoksa 4. sahneyi (13–20 sn) yalnızca tipografiyle kur ("Diller sizin panelinizde" + dil adı sütunları: Türkçe / English / Deutsch / Français / …), sahte panel arayüzü ÇİZME. Dosya gelirse telefon yerine 3D monitör/tablet içinde göster.
- Ses: `ses/anlatim.mp3` (kullanıcı sağlayacak; metin `ses-metni.md`). Yoksa sessiz render al, süreleri `ses-metni.md` tablosundaki gibi tut.
- Font: `anasite/assets/fonts` içindeki Manrope (kendi sunucumuzdan; başka font yok). Marka: koyu yeşil #0D2B22, altın #C9A84C, krem #F4F1E8.

SAHNE AKIŞI (ses-metni.md ile birebir)
1. 0–3 sn — Karanlık yeşil zemin, havada 3D menü kartı; üzerinde dönen soru işaretleri; yanında sade turist silueti (düşük poligon, altın kenar). Kamera yavaş itiş.
2. 3–7 sn — Garson silueti iki yana el sallar; arkada 2 masa solar (opaklık düşer). "Bekliyor" yazısı YOK, hareketle anlat.
3. 7–13 sn — Gerçek ekran görüntüleriyle 3D telefon (yuvarlatılmış kutu, altın çerçeve, hafif parlak cam). Telefonu ekranın %70'ine yerleştir. QR tarama çizgisi → `01-acilis-tr` → `02-dil-secici` (dropdown açık) → 3 kez kart çevirme (rotateY 180°, 0,5 sn, ease-out) ile `03-menu-tr` → `04-menu-en` → `05-menu-de` → `06-menu-fr`. Telefon ekranını ÜRÜN LİSTESİ bölgesine kırp (y 480–1500 px @2x): üstteki Türkçe banner görseli ve alttaki "QR kodunu okutarak…" çubuğu görünmesin. Dil adı küçük altın çip olarak telefonun yanında (TR/EN/DE/FR) belirir.
4. 13–20 sn — Panel sahnesi (yukarıdaki kural). Sağda dil sütunları kayarak girer, "CSV" ve "elle" kelimeleri iki etiket olarak belirir. "30" sayısı büyük altın rakam, yalnızca "30 dile kadar" bağlamında.
5. 20–25 sn — Logo (`anasite/assets/brand`), altında "Demo için DM: dil". Son 0,7 sn ilk kareye crossfade (loop).

TASARIM KURALLARI
- Hareket: ease-out (cubic-bezier .22,1,.36,1), hiçbir sahne 1,2 sn'den kısa durmaz, kesme yok, hepsi kamera/obje hareketiyle bağlanır. Yalnız transform ve opacity animasyonu.
- Meta Reels güvenli bölge: üst 270 px, alt 672 px, yan 65 px içine metin/logo koyma. Altyazı yalnızca bu alanın içinde, 1:1 ses metni; arka plan scrim'i hafif.
- Altı çizili metin, bağlantı efekti yok. Okunabilirlik: açık zeminde koyu metin, koyu zeminde krem/altın; en küçük yazı 40 px (1080 genişlikte).
- İçerik yasakları: "yapay zeka/AI", "otomatik çeviri", yüzde veya oran, "anında", "devrim", "ücretsiz", "sınırsız". Ekran görüntüsünü bozma/yeniden çizme. Demo restoran adı ve fotoğraflar test sitesinden olduğu gibi kalır.
- Bantlama yok, metin taşması yok: her sahneden bir kontrol karesi çıkar.

DOĞRULAMA (bitirmeden önce)
1. Her saniye için kontrol sheet'i (4×6 kare) `out/` altına kaydet; güvenli bölge dışı metin var mı bak.
2. ffprobe: 1080×1920, 30 fps, süre 25,0±0,1 sn, ses -14 LUFS (±1), bt709 etiketli.
3. Altyazı ile `ses-metni.md` aynı mı (kelime kelime).
4. Raporla: dosya yolu, süre, hangi sahne gerçek ekran / hangisi tipografi.
