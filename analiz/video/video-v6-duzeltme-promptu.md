# Claude Code promptu — v5 → v6 (küçük düzeltmeler + kısa sürüm)

Girdi: `video-v5-analiz.md`, `render/`, `ses/anlatim.mp3`, `ses/cue.json`. Çıktı: `out/coklu-dil-reels_v6.mp4` (35,8 sn düzeltilmiş) ve (ayrı) `out/coklu-dil-reels_v6-kisa.mp4` (kısa sürüm). v1–v5'i EZME.

1. İÇERİK HATASI (22,8–24,5 sn): "CSV ile girersiniz" sırasında "CSV Dışa Aktar" vurgulu; "CSV İçe Aktar" vurgulu olmalı. Cümle başında ("elle") "Diller", "CSV" kelimesinde "CSV İçe Aktar" vurgusu; panel penceresinde İçe Aktar kartı bu aralıkta görünür olsun. Cue'lara bağlı (cue.json).
2. 10–11,4 sn: telefon zaten sol konumda açılsın, büyüteç 0,5 sn erken gelsin (dolgusuz süre ≤0,8 sn).
3. 26,3–27,3 sn: panelde "28 dil etkin" kartı vurgusu "Otuz dile kadar" ile aynı anda; sayı çelişkisi sorulursa cevap: kapasite 30, etkin 28 (raporda not et). Sesi yeniden üretme.
4. KISA SÜRÜM: "Anlamayan misafir de sormaya çekinir." ve "Çözüm menünün kendisinde." cümlelerini çıkar. Sesi cümleyi kırparak yeniden birleştir (konuşma hızını değiştirme, kesimleri 0,25 sn crossfade/boşlukla birleştir). Hedef ≈31 sn. Sahne zamanlaması cue'lardan yeniden hesaplanır; yerleşim aynı.
5. TEST: layout_check.mjs ihlal 0; senkron farkı her cümlede ≤0,15 sn; metinsiz ≤0,4 sn; vurgu–cümle eşleşmesi testi (CSV cümlesinde İçe Aktar vurgulu); ffprobe (1080×1920, 30 fps, bt709, -14 LUFS ±1, ≥5 Mbps). Önce/sonra kareleri.
6. Raporda "telaffuz kontrolü kullanıcıda" yaz. Commit/push (gerekirse fetch+merge), PR açma.

DEĞİŞMEYENLER: metin, tek birincil CTA, yasak iddia listesi, gerçek ekranlar, marka renkleri/Manrope, altı çizili yok, kimlik bilgisi yok.
