# Claude Code ana promptu v5 — düzeltmeler + anlatım sesi + kapak (tek iş)

Girdi: `ses/anlatim.mp3` (FİNAL ElevenLabs sesi; yoksa DUR ve bildir), `render/` (v4 kaynağı), `ses-metni.md`, `video-v4-analiz.md`, `ekran/`, `assets/brand`, `encode-v2.sh`. Çıktılar: `out/coklu-dil-reels_v5.mp4`, `kapak/coklu-dil-kapak.png|jpg`, `kapak/onizleme.jpg`, `out/layout.json`, `video-v5-rapor.md`. v1–v4'ü EZME.

BÖLÜM 1 — SES ANALİZİ VE ZAMANLAMA
1. `ffprobe` + `silencedetect` (n=-38dB, d=0.18) ile konuşma parçalarını çıkar; `ses/cue.json` yaz. Altyazı chunk listesi (ses-metni.md düz metnindeki 14 cümle/ifade) ile eşle. Eşleşme tutmazsa DUR, parça sayısını ve zamanlarını raporla.
2. Video süresi = konuşma bitişi + 0,8 sn. 0,45 sn'den uzun duraklamaları 0,25 sn'ye sıkıştır (konuşma hızını DEĞİŞTİRME), sesi yeniden birleştir ve yapılan kırpmaları kaydet.
3. Sahne sırası, yerleşim ve içerik v4 ile aynı; yalnız süreler sese göre hesaplanır (`timeline.js`). Her başlık chunk'ı ilgili cümle başlangıcından 0,08 sn önce girer, bitişten 0,12 sn sonra söner; sahne geçişleri cümle sınırlarına oturur.
4. Miks: ambient bed konuşma altında ≈ -26 dB, konuşma sırasında ducking; toplam -14 LUFS (±1), tepe ≤ -1 dBTP, 48 kHz stereo AAC. `encode-v2.sh` kullan ya da eşdeğerini yaz.
5. Altyazıda yalnız `ses-metni.md` düz metni görünür (QR, CSV). Telaffuz için sese yazılmış "kü ar", "si es vi" gibi okunuşlar altyazıya GİRMEZ.

BÖLÜM 2 — v4 BUG DÜZELTMELERİ (v4 analizi)
a. 10–11 sn büyüteçte kırpık "a Yemek" metin parçası: büyüteç penceresini kategori metnini içermeyecek biçimde daralt; liste son satırı ile kart alt kenarı arası ≥16 px.
b. Panel ile telefon çapraz geçişi (22,3–22,7 sn): çapraz YOK; eski sahne 0,2 sn söner, yenisi gelir.
c. CTA'daki "↖" oku KALDIR (Reels'te hedefi yok).
d. Panel sahnesine ince başlık şeridi: ekran görüntüsünden "Diller & Çeviriler" başlığı (kırpma penceresinin üstünde sabit), kartlar bütün kalır.
e. Telefon alt çubuğu "Lütfen QR kodunu okutarak masanızdan erişin" izleyiciyi demo kilitli sandırabilir: telefon ekranını bu çubuğu kırpacak biçimde çerçevele (ekran görüntüsünün alt çubuk yüksekliğini kırp; telefon oranı korunur) ya da çubuğu görünmez yap. Ekranı yeniden çizme/değiştirme yok.
f. Diğer v4 değerleri (gerçek telefon oranı, büyüteç ≥28 px, tek metin katmanı, panel bütün kartlar, CTA'da açık dil seçici, güvenli bölge, kontrast ≥4,5:1) bozulmasın.

BÖLÜM 3 — KAPAK GÖRSELİ
Çıktı `kapak/coklu-dil-kapak.png` (1080×1920, sRGB), `.jpg` (kalite 92, ≤2 MB), `kapak/onizleme.jpg`.
- Tüm kritik içerik 3:4 grid kırpımında (y 240–1680) ve 1:1 profil kırpımında (y 420–1500) KESİLMEDEN görünsün; ayrıca Reels güvenli bölgesi (üst 270, alt 672, yan 65).
- Başlık: "Yabancı misafir geldi. Menüyü kim anlatacak?" iki satır, Manrope 800, ≥96 px; satır 1 krem #F4F1E8, satır 2 altın #C9A84C; konum y 480–800.
- Görsel: v4 3B sahnesinin birebir aynı malzemesi (garson, turist, masa, MENÜ kartı, "…" ve "?" balonları), grup genişliği ≥760 px, y 860–1420; v5 render kaynağından alınır, yeni karakter/stil uydurma.
- "Çoklu Dil modülü" hapı (altın çerçeve, ≥40 px yazı), başlığın üstünde y≈420; logo (`assets/brand`, gerçek dosya) ≈220 px, alt orta y≈1560.
- Arka plan videodaki koyu yeşil gradyan, hafif vinyet, dither (banding yok).
- YASAK: rakam/yüzde, "AI", "ücretsiz", "anında", CTA metni, URL, altı çizili metin, telefon/ekran görüntüsü. Mevcut krem/yeşil tipografi karolarını taklit etme.
- Önizleme sheet'i: 9:16 tam · 3:4 · 1:1 · 330 px genişlikte grid küçültmesi. Başlık 330 px'te okunmalı (yazı yüksekliği ≥26 px), kontrast ≥4,5:1, hiçbir öğe kırpım kenarına <40 px.

BÖLÜM 4 — TEST VE DOĞRULAMA (hepsi geçmeden "bitti" deme)
- `layout_check.mjs` zamanlama bazlı yeniden çalışsın: ihlal 0; doluluk, telefon oranı 0,42–0,50, UV sınırı, kesik kart yok, mesaj–görsel eşleşmesi (CTA'da dil seçici); metinsiz süre ≤0,4 sn; başlık–ses senkron farkı her cümlede ≤0,15 sn (cue.json ile karşılaştır).
- ffprobe: 1080×1920, 30 fps, süre = konuşma bitişi + 0,8 sn (±0,1), bt709, -14 LUFS ±1, ≥5 Mbps, ses kanalı sessiz değil (silencedetect).
- 1 fps sheet + cümle sınırlarında 0,1 sn kareler; kritik aralıklar: 9–12, 17–23, 24–son; v4|v5 önce/sonra.
- Cümle başına senkron farkı tablosu; kapak ve videonun ilk karesi aynı hook cümlesi.
- Dürüstlük: ses telaffuzunu SEN dinleyemezsin; raporda "telaffuz kontrolü kullanıcıda" yaz. Kimlik bilgisi veya ara dosya commit etme.
- Commit: v5 mp4, kapak dosyaları, kaynak, cue.json, layout.json, sheet'ler, rapor. Dala push (gerekirse fetch+merge), PR açma. Raporda her madde için "düzeltildi/düzeltilemedi + kanıt" yaz.

DEĞİŞMEYENLER: metin (ses-metni.md düz metni), tek birincil CTA (canlı menüyü dene), yasak iddia listesi, gerçek ekranlar, marka renkleri/Manrope, altı çizili yok, kimlik bilgisi yok.
