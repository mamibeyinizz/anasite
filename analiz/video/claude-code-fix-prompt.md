# Claude Code'a verilecek düzeltme promptu — coklu-dil-reels v1 → v2

Girdi: `analiz/video/video-v1-analiz.md` (14 bulgu), mevcut proje dosyaları, `ekran/` PNG'leri, `ses-metni.md`. v1'i EZME; çıktı `coklu-dil-reels_v2.mp4`.

GÖREV: Aşağıdaki hataları sırayla düzelt, her düzeltmeyi kareyle doğrula. Marka kuralları (renk, Manrope, güvenli bölge üst 270 / alt 672 / yan 65, altı çizili yok, yasak iddia listesi) değişmez.

1. SES (engelleyici): `ses/anlatim.mp3` varsa miksle, yoksa ambient bed üret; sonuç -14 LUFS ±1, -1 dBTP altı. Sessiz kanal bırakma.
2. DÖNGÜ (engelleyici): 26,6–27,1 sn CTA katmanlarını (başlık, URL, altyazı, ok, logo, telefon) söndür; 27,2–28,0 sn hook'u getir. Hiçbir karede iki farklı metin bloğu birlikte görünmesin. Arka plan geçişi sürekli kalsın.
3. BOŞ KARE: 8–10 sn arası telefonu 8,0'da opak getir; hiçbir karede "nesne kaplama alanı" %3'ün altında olmasın (ffmpeg signalstats ile test et).
4. CTA TELEFON: flip 23,6 sn'de bitsin; telefon genişliği ≥%45; ön yüz açık; ekran içeriği okunur (dil seçici açık veya ürün listesi).
5. OKUNABİLİRLİK: 10–17 sn'de kamerayı telefon ekranına 2–2,5× yakınlaştır (ürün adı + açıklama satırı); 17–23 sn'de panel ekranını "Diller / CSV Dışa Aktar / CSV İçe Aktar" kartlarına yakınlaştır. Ekrandaki en küçük okunması gereken metin 1080 genişlikte ≥28 px görünsün.
6. ALTYAZI ÇAKIŞMASI: 3,5–8 sn'de garson figürü altyazı plakasıyla kesişmesin; nesneleri plakanın üstünde tut (≤ y 1000).
7. TEKRAR: Başlık + altyazı çift yazısını kaldır. Kural: büyük başlık = kilit ifade; altyazı = yalnızca başlıkta olmayan söylenen cümle. Sahne 5'te "Bu, Çoklu Dil modülü." ile başlık tekrar etmesin.
8. KONTRAST: Turist figürünü krem/altın yap (arka plana kontrast ≥3:1, ölç); "?" balonunu misafire bağla; hook karesinde misafir menüyü uzatsın.
9. KIRPMA: 10–11 sn'de telefon ekranı üst çubuğu ve logoyla tam çerçevelensin; dil listesi kesilmesin ya da bilinçli merkezlensin.
10. ROZET: "Gerçek demo menü" tek satır, telefonun üstünde, yan marj ≥80 px.
11. FLIP: kart çevirmede siyah gövde olmasın; ön ve arka yüze ekran dokusu ver ya da crossfade kullan.
12. KOMPOZİSYON: Başlık + nesne bloğunu y≈360–1180 arasında dikey ortala; 3:4 kırpımda (y 240–1680) denge kontrolü yap.
13. CTA HİYERARŞİSİ: tek odak = başlık "Canlı menüyü telefonunuzda deneyin" + URL (≥44 px). Logo tek ve gerçek dosyadan (`assets/brand`); ok sade. Altyazı yalnızca sesli cümleyi taşısın.
14. KODLAMA: 6–8 Mbps (CRF 16–18), gradyanlarda hafif noise/dither, bt709 etiketi, +faststart.

DEĞİŞMEYENLER: v3 metin ve süreler, tek birincil CTA, yasak iddia listesi, gerçek ekranlar (sahte arayüz yok).

DOĞRULAMA (hepsi geçmeden "bitti" deme):
- ffprobe: 1080×1920, 30 fps, 28,0±0,1 sn, bt709; ses -14 LUFS ±1; bit hızı ≥5 Mbps.
- 1 fps sheet + 13 anahtar kare; 26,5–28 sn arası 0,1 sn aralıklı kareler (metin çakışması yok).
- Boş kare testi (madde 3), kontrast ölçümü (madde 8), güvenli bölge taraması.
- Altyazı = ses metni (kelime kelime).
- Rapor: her madde için "düzeltildi / düzeltilemedi + neden", önce/sonra kare yolları. Kapak karesini 3:4'te göster.
- Commit: `coklu-dil-reels_v2.mp4`, kaynak, kontrol sheet'i; kimlik bilgisi ve ara dosyalar hariç; dala push, PR açma.
