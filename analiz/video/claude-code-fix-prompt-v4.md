# Claude Code düzeltme promptu v4 — v3 → v4 (gerçek telefon + büyüteç + doluluk testi)

Girdi: `analiz/video/video-v3-analiz.md`, `render/layout.js`, `render/layout_check.mjs`, `ekran/`. v3'ü EZME; çıktı `coklu-dil-reels_v4.mp4`.

NOT: v3'teki sınırlarım yanlıştı (medya ≤780×530, telefon 330–420 px genişlik). Bu sınırları KALDIR, aşağıdakilerle değiştir. Güvenli dikdörtgen S (x 80–1000, y 270–1248) değişmez.

1) YENİ BANTLAR
- BAŞLIK 330–540: sesli cümlenin kendisi; TEK metin katmanı. Altyazı plakası YOK (altyazıyı başlığa dönüştür; uzun cümleleri 2 satıra böl, her chunk ≥1,2 sn). Böylece medya bandı 570–1240.
- MEDYA 570–1240 (670 px yükseklik).
- Hiçbir sahnede metinsiz süre 0,4 sn'yi geçmesin (döngü boşluğu 26,9–27,2 hariç).

2) TELEFON = GERÇEK TELEFON
- Oran 9:19,5 (≈0,46): genişlik ~310, yükseklik ~670, tam çerçeveli, ekran görüntüsü kırpılmadan tam ekran (üst bar dahil). Ekran içi metin okunmaz olacağı için ürün kanıtı BÜYÜTEÇTE gösterilir (madde 3).
- Telefon ölçeği 8–28 sn sabit. Konum: sol, x 100–410.

3) BÜYÜTEÇ (lens) KANIT KARTI
- Telefonun sağında kart: x 440–1000 (560 px), y 640–1000. İçinde telefondaki ürün satırının 2,4× büyütülmüş hâli (ürün adı + açıklama + fiyat), ≥28 px. Telefondaki satırdan karta ince altın bir bağlantı çizgisi.
- Dil değişimi: TR → EN → DE → FR; kart içeriği çapraz DEĞİL, 0,2 sn söner/gelir; telefon ve kart aynı anda aynı dili gösterir. Satır sığmıyorsa iki satıra kır, "…" ile kesme YOK.
- Dil seçici açılışı (9–11 sn): açılır liste büyüteçte de görünsün (Türkçe, English, Deutsch, Français, Español, Italiano, Русский, العربية…), ≥28 px.

4) PANEL SAHNESİ
- Pencere 920×540, y 600–1140. Kırpma pencerenin içeriğine uyar: "Diller · 28 dil etkin", "CSV Dışa Aktar", "CSV İçe Aktar" kartlarının TAMAMI görünür (yarım kart/ikon yok), alt yarı boş krem alan yok.
- UV her zaman görüntü sınırı içinde (örnekleme dışarı taşmaz; koyu şerit olmaz): pan/zoom sınırlarını görüntü boyutuna göre kıskaçla.
- "Otuz dile kadar" söylenirken "Diller · 28 dil etkin" kartı vurgulu.

5) CTA SAHNESİ (24–28)
- Telefon tam boy, dil seçici AÇIK (ekran/02-dil-secici); yanında büyüteç: "Dil seçiciyi siz değiştirin" anında seçilen dil adı vurgulu.
- Logo gerçek dosyadan, ≥220 px genişlik; ok ≥56 px; URL ≥54 px krem/altın, kontrast ≥4,5:1.

6) 3D SAHNELER (0–8)
Figür+masa grubunu büyüt: genişlik ≥640 px, MEDYA bandını %70+ doldur. Okunur ifade, çakışma yok.

7) TEST — yeni kurallar (layout_check.mjs'e ekle; kırmızıda render DUR)
- Doluluk: medya sahnelerinde ana nesne yüksekliği ≥560 px (telefon/panel), 3D sahnelerde grup genişliği ≥640 px.
- Telefon oranı 0,42–0,50.
- Kırpma sınırı: tüm UV örnekleri [0,1] içinde.
- Bütünlük: kırpma penceresi içinde kısmen kesilen kart/metin kutusu sayısı = 0 (DOM kutularıyla ölç).
- Metin kesilmesi: "…" veya sağ kenardan taşan metin yok (ölçü: metin kutusu ≤ taşıyıcı kutu).
- Mesaj–görsel eşleşmesi: CTA sahnesinde dil seçici görünür.
- Metinsiz süre ≤0,4 sn.
- Eski kurallar (S içi, kesişim=0, kontrast ≥4,5, ağırlık merkezi y 640–1000) geçerli.
- Raporda "ihlal 0" ile birlikte doluluk oranını, her sahnenin ana nesne boyutunu ve ekran görüntüsü sheet'ini sun: çakışma yok demek kompozisyon iyi demek değildir.

8) DOĞRULAMA
ffprobe (1080×1920, 30 fps, 28,0±0,1 sn, bt709, -14 LUFS ±1, ≥5 Mbps); 1 fps sheet + 0,1 sn sheet'ler (8–12, 12–17, 19–23, 24–28); v3|v4 önce/sonra; kapak 3:4; 8 bulgunun her biri için "düzeltildi/düzeltilemedi + kanıt". Anlatım sesi (`ses/anlatim.mp3`) varsa miksle, yoksa bunu raporun en üstünde "yayına hazır değil" diye yaz. Commit: `coklu-dil-reels_v4.mp4`, kaynak, layout.json, sheet; dala push (gerekirse fetch+merge), PR açma.

DEĞİŞMEYENLER: v3 metin ve süreler, tek birincil CTA, yasak iddia listesi, gerçek ekranlar, marka renkleri/Manrope, altı çizili yok.
