# Kurgu promptu v2 (Claude Code'a verilecek) — Çoklu Dil Reels (restoran sahibine pazarlama)

GÖREV
1080×1920, 30 fps, 28 sn, dikey Reels (mp4, H.264, bt709, 48 kHz stereo AAC) üret. Konu: QR menüde Çoklu Dil. Üç boyutlu sahne three.js ile, kareler Playwright + swiftshader ile render edilir, ffmpeg ile birleştirilir. Çalışma dizini: `anasite/analiz/video/`. Kaynak olarak `insta/src/aura/` içindeki render.mjs / encode.sh / make_audio.py mantığını İZLE (yalnızca teknik şablon; içeriğini, marka metnini ve ses dosyasını kullanma, başka bir markaya aittir).

GİRDİLER
- Ekran görüntüleri (430×900 CSS px, 2x): `ekran/01-acilis-tr.png`, `02-dil-secici.png`, `03-menu-tr.png`, `04-menu-en.png`, `05-menu-de.png`, `06-menu-fr.png`. Kaynak: test sitesi `plus.qrmenuofficial.com` herkese açık müşteri ekranı.
- Panel ekranı (Diller & Çeviriler tablosu) henüz YOK: `ekran/07-panel-diller-ceviriler.png`. Dosya yoksa 4. sahneyi (13–20 sn) yalnızca tipografiyle kur ("Diller sizin panelinizde" + dil adı sütunları: Türkçe / English / Deutsch / Français / …), sahte panel arayüzü ÇİZME. Dosya gelirse telefon yerine 3D monitör/tablet içinde göster.
- Ses: `ses/anlatim.mp3` (kullanıcı sağlayacak; metin `ses-metni.md`). Yoksa sessiz render al, süreleri `ses-metni.md` tablosundaki gibi tut.
- Font: `anasite/assets/fonts` içindeki Manrope (kendi sunucumuzdan; başka font yok). Marka: koyu yeşil #0D2B22, altın #C9A84C, krem #F4F1E8.

PAZARLAMA MANTIĞI (v2)
İzleyici restoran/kafe sahibi, telefonda sessiz izliyor, ilk 2,5 saniyede kendi sorununu görmezse kaydırır. Sıra: (1) kendi sahnesi, (2) acı ve etkisi (rakamsız), (3) çözümün çalışırken GERÇEK ekranı, (4) ancak sonra modülün adı ve nasıl çalıştığı, (5) tek CTA. Turist değil işletme sahibi merkezde: sahnede "siz" (garson, masa, bekleyen müşteri). Ekranda ürün görüntüsü toplam sürenin en az yarısı kadar kalmalı [Tahmin eşik]; 3D yalnızca yönlendirme ve geçiş içindir.

SAHNE AKIŞI (ses-metni.md v2 ile birebir; süre 28 sn)
1. 0–2,5 sn HOOK — Büyük yazı: "Yabancı misafir geldi. Menüyü kim anlatacak?" 3D: menü kartı masaya düşer, belirsiz turist silueti. İlk kare, kapak olarak da kullanılacak (3:4 güvenli alanda).
2. 2,5–8 sn ACI+ETKİ — Garson siluet el kol hareketiyle anlatır, 2 masa solar (opaklık), misafir menüden geri çekilir. Yazı: "Garson tercümana dönüştü. Masalar bekliyor." Sayı/yüzde yok.
3. 8–10 sn DÖNÜŞ — Kamera hızlı ileri, 3D telefon belirir. Yazı: "Çözüm menünün kendisinde."
4. 10–17 sn ÇÖZÜM / KANIT — Gerçek ekranlarla 3D telefon: `02-dil-secici` → `03-menu-tr` → `04-menu-en` → `05-menu-de` → `06-menu-fr`. Her geçişte kart çevirme (rotateY 180°, 0,5 sn). Telefonun yanında altın çip: TR / EN / DE / FR. Köşede küçük rozet: "Gerçek demo menü". Ekranı ürün listesi bölgesine kırp (y 480–1500 px @2x); Türkçe kalan banner ve alt "QR kodunu okutarak…" çubuğu görünmesin. Vurgu: ürün adı ve açıklamanın değiştiği satırı altın çerçeveyle 0,6 sn işaretle.
5. 17–23 sn MODÜL — Telefon sola kayar. Başlık: "Çoklu Dil modülü". Sağda panel ekranı `07-panel-diller-ceviriler.png` (gelirse, 3D tablet/monitör içinde); yoksa tipografi: üç etiket sırayla girer: "Dilleri siz tanımlarsınız" · "Elle ya da CSV" · "30 dile kadar". Sahte panel arayüzü ÇİZME.
6. 23–28 sn FAYDA+CTA — Yazı: "Garsonunuz servise dönsün." Sonra telefon son kez menüyü gösterir (TR→EN), yazı: "Canlı menüyü telefonunuzda deneyin" ve altında yazılı adres `qrmenuofficial.com/canli-menu` (altı çizili değil, altın krem). Sol üstte profile işaret eden küçük ok (Reels arayüzünde profil sol üstte; metin güvenli bölgeyi aşmasın). Logo. Son 0,7 sn ilk kareye crossfade. Sesli CTA yalnızca bu eylemdir; DM çağrısı videoda YOK (caption/sabit yorumda). Ayrıntı: `ses-metni.md` › "CTA v3".

TASARIM KURALLARI
- Hareket: ease-out (cubic-bezier .22,1,.36,1), hiçbir sahne 1,2 sn'den kısa durmaz, kesme yok, hepsi kamera/obje hareketiyle bağlanır. Yalnız transform ve opacity animasyonu.
- Meta Reels güvenli bölge: üst 270 px, alt 672 px, yan 65 px içine metin/logo koyma. Altyazı yalnızca bu alanın içinde, 1:1 ses metni; arka plan scrim'i hafif.
- Altı çizili metin, bağlantı efekti yok. Okunabilirlik: açık zeminde koyu metin, koyu zeminde krem/altın; en küçük yazı 40 px (1080 genişlikte).
- İçerik yasakları: "yapay zeka/AI", "otomatik çeviri", yüzde veya oran, "anında", "devrim", "ücretsiz", "sınırsız". Ekran görüntüsünü bozma/yeniden çizme. Demo restoran adı ve fotoğraflar test sitesinden olduğu gibi kalır.
- Bantlama yok, metin taşması yok: her sahneden bir kontrol karesi çıkar.

DOĞRULAMA (bitirmeden önce)
1. Her saniye için kontrol sheet'i (4×6 kare) `out/` altına kaydet; güvenli bölge dışı metin var mı bak.
2. ffprobe: 1080×1920, 30 fps, süre 28,0±0,1 sn, ses -14 LUFS (±1), bt709 etiketli.
3. Altyazı ile `ses-metni.md` aynı mı (kelime kelime).
4. İlk 2,5 sn testi: tek kare olarak sessiz izlemede sorunu anlatıyor mu (yazı okunur mu)? Kapak karesini ayrıca 3:4 kırpımında kontrol et.
5. Raporla: dosya yolu, süre, hangi sahne gerçek ekran / hangisi tipografi.
