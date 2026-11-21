# Claude Code promptu — video zamanlamasını anlatım sesine uydur (v5)

Girdi: `ses/anlatim.mp3` (ElevenLabs, SON hâl), `render/` (v4), `ses-metni.md`, `video-v4-analiz.md`. Çıktı: `coklu-dil-reels_v5.mp4`. v4'ü EZME.

1. SES ANALİZİ: `silencedetect` (n=-38dB, d=0.18) ile konuşma parçalarını çıkar. Beklenen 14 cümle (ses-metni.md düz metni) ile eşle; eşleme tutmazsa DUR ve parça sayısını/zamanlarını raporla. Cümle başlangıç/bitişlerini `ses/cue.json`'a yaz.
2. SÜRE: video süresi = konuşma bitişi + 0,8 sn (döngü kuyruğu). 0,45 sn'den uzun duraklamaları kırp (0,25 sn bırak) ve sesi yeniden birleştir; kırpmayı kaydet. Doğal hız bozulmasın (konuşma hızını değiştirme).
3. SAHNE ZAMANLAMASI: her başlık chunk'ı ilgili cümlenin başlangıcından 0,08 sn önce girer, bitişinden 0,12 sn sonra söner; sahne geçişleri cümle sınırlarına oturur. v4 sahne sırası, yerleşim ve içerik değişmez; sadece süreler sese göre yeniden hesaplanır (layout.js sabit, zamanlama `timeline.js`).
4. MİKS: ambient bed -26 dB civarı (anlatım üstünde net), sesin -14 LUFS (±1) toplam, tepe ≤ -1 dBTP; ambient konuşma boşluklarında hafif yükselmez (ducking).
5. TEST: layout_check.mjs zamanlama bazlı yeniden çalışsın (ihlal 0); başlık–ses senkron farkı her cümlede ≤0,15 sn; metinsiz süre ≤0,4 sn; `ses/cue.json` ile `layout.json` karşılaştırma raporu.
6. ALTYAZI: "kü ar"/"si es vi" gibi yalnız ses için yazılan okunuşlar altyazıda GÖRÜNMEZ; altyazı `ses-metni.md` düz metnidir (QR, CSV).
7. KALAN DÜZELTMELER (v4 analizinden): 10–11 sn büyüteç kırpık "a Yemek" parçası, panel–telefon çapraz geçişi (söndür–getir), CTA oku kaldır, panele "Diller & Çeviriler" başlık şeridi.
8. DOĞRULAMA: ffprobe (1080×1920, 30 fps, süre = cue.json'dan hesaplanan, bt709, -14 LUFS ±1, ≥5 Mbps); 1 fps sheet + cümle sınırlarında 0,1 sn kareler; rapor: cümle başına senkron farkı tablosu. Commit/push (gerekirse fetch+merge), PR açma.
