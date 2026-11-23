# Claude Code promptu — Çoklu Dil Reels v9 (v8'in UX düzeltmesi, hedef: kusursuz)

Dal: `claude/qr-menu-instagram-strategy-rs76jf` (PR yok, ana dala push yok). v1–v8 DEĞİŞMEZ; yeni dosyalar `-v9` sonekli. Mevcut hat: `render/scene-v8.mjs`, `index-v8.html`, `render-v8.mjs`, `srt-v8.mjs`, `test-v8.mjs`, `encode-v8.sh`, `ses/cue-v4.json`, `ses/anlatim-v4.mp3` (SES VE METİN DEĞİŞMEZ; yeniden ses üretme). Girdi: `out/coklu-dil-reels_v8.mp4` (31,9 sn). Ölçüm kaynağı: kullanıcı v8'i inceletti.

## 1) v8'de bulunan hatalar (hepsi giderilecek; sıra önem sırasıdır)
**Doğruluk**
1. **Uydurma sayaç:** Acı sahnesinde "1:32 / 2:54 / 4:17 · Bekleme süresi" gerçek ölçüm gibi görünüyor, kaynağı yok. KALDIR (sayı/süre gösterme).
2. **Doğrulanmamış dil çipleri:** PT, NL, PL çipleri ürün kanıtı olmadan gösteriliyor. Demo dil seçicide (`ekran/02-dil-secici.png`) yalnız şu diller görünüyor: Türkçe, English, Deutsch, Français, Español, Italiano, Русский, العربية. Çiplerde SADECE bu sekiz dilin kodu (TR EN DE FR ES IT RU AR) ve "+20 dil" yerine "20'den fazla dil" metni kullanılacak (sayı anlatım ve carousel ile aynı). Kiril/Arapça GLİF kullanma (font kapsamı yok) — yalnız iki harfli kod.

**Yerleşim / okunurluk**
3. **Kritik içerik Instagram alt örtüsünün altında:** dil karoları (TR/EN/DE/FR) y≈1370–1890, dil çipleri (S5) ve CTA logosu y≈1400–1580'de. Kural: METİN ve işlevsel/ikna edici içerik (altyazı, anahtar kart, kanıt ekranı, URL, aktif dil göstergesi) y ≤ 1248; y 1248–1920 yalnız DEVAM/DEKOR görseli.
4. **Altyazı plakası ürün ekranını kesiyor:** S4'te menü/dil listesi (Arapça satırı) plakanın altında kalıyor; S5'te *Diller* ve *CSV İçe Aktar* kartları plakayla bölünüyor. Plaka sabit (y 1040–1236) kalır; kanıt görselleri plakanın ÜSTÜNDEKİ alana (y 330–1020) sığacak şekilde yeniden kurgulanır.
5. **Ürün kanıtı okunmuyor:** telefon çerçevesi ≈770×940 (yatay kırpım), içindeki menü yazısı etkin ≈14 px; EN/DE/FR menü satırları okunmaz. Telefon mockup'ı KALDIR. Yerine gerçek ekranın ilgili bölgesinden 900×690 (x 90–990, y 330–1020) çerçevesiz-düz kırpma kartı (2 px koyu/altın kenar, yuvarlak köşe 24): kaynak `ekran/*.png` en çok 1,15× ölçeklenir (keskin kalmalı); metin etkin ≥30 px. Yeniden ekran yakalama yok (`PANEL_*` kimlik bilgisi yok); yapamazsan raporla.
6. **Acı sahnesi kartları küçük:** "MASA n / GARSON yabancı masada" ≈22 px. Kart yazıları ≥40 px; 2×2 ızgara y 520–1000 içinde, kart ≥430×220.

**Geçişler**
7. **Yazı üst üste biniyor:** 4,2 sn ("Diğer masalar" "Dil engeli"nin üstünde), 18 sn, 27 sn ve 31,3 sn (kapanış→açılış: "Canlı menüyü…" üzerinde "Dil engeli, kayıp masa." hayaleti). Kural: HİÇBİR karede iki ayrı metin bloğu üst üste binmez. Çıkan metin 160 ms'de tamamen söner, gelen metin sonra belirir (sıralı, çakışmasız). Altyazı PLAKASI geçişlerde %100 opak kalır (4,2 sn'de soluk görünüyordu); yalnız plakanın METNİ 120 ms içinde değişir. Kapanış→açılış çapraz geçişinde yalnız ARKA PLAN çözülür (altın→altın), metinler sırayla çıkar/girer (toplam 0,7 sn).
8. **Boş geçiş çukurları** (7,7 / 24,9 / 27,5 sn civarında içerik <%15): giderilecek, geçişte her zaman bir öğe görünür.

**İçerik tekrarı ve sadelik**
9. **Aynı mesaj aynı karede iki kez:** "Diğer masalar bekliyor." (kart) = altyazı "…diğer masalar bekler."; "Dil değil, servis." = altyazı "Garsonunuz dil değil, servis yapsın."; CTA "Canlı menüyü telefonunuzda deneyin" = altyazı "Aynı menüyü kendi telefonunuzda deneyin." Anahtar kart altyazıyı TEKRARLAMAZ; yalnız altyazının vermediği bilgiyi taşır (aşağıdaki sahne planı). Karşılığı yoksa anahtar kart olmaz.
10. **Halka dokusu (eşmerkezli daireler) ve alt/üst karartma:** carousel standardında halka yok; görsel gürültü ve "dikey doluluk" ölçümünü şişirdi. KALDIR. Zemin: gradyan + %11 nokta ızgarası (tüm tuvalde, v7 gibi).
11. **CTA zayıf:** URL ≈28 px; alttaki ince dikey çizgi (ok) hiçbir şeye işaret etmiyor; logo alt örtüde. Çizgiyi kaldır; URL ≥56 px, tam opak; logo A bölgesine.
12. **Etiket 32 px** (≥36 kuralının dışında) → 36 px.
13. **Tempo:** 31,9 sn (Reels için ≤30 sn hedef). Ses DEĞİŞMEZ; aşağıda "kısa sürüm" ayrıca üretilir (cümle 6 "Ürün adı, açıklama, kategori, hepsi kendi dilinde." çıkarılır; `ses/kisa-uret.py` mantığı: kesim 0,25 sn boşluk + 20 ms solma, konuşma hızı değişmez, cue yeniden hesaplanır). Tam sürüm de teslim edilir.
14. **Ses:** −14,1 LUFS iyi; örnek tepe −1,1 dBFS yüksek. `encode`'da true peak limiti −1,5 dBTP (alimiter) uygula; LUFS −14 ±0,5 kalsın.

**v8'de KORUNACAKLAR (iyi çalışan):** tam boy zemin; altyazı metni = ses metni (cümle başı sapması ≤0,05 sn, bayat metin yok); plaka sabit konumu ve kontrastı (≥7:1); altın–zümrüt–altın dramaturji; CSV kuralı (yalnız *CSV İçe Aktar* "dosyadan toplu yüklersiniz" cümlesinde, *Dışa Aktar* hiç); hareket dili (bounce/elastic/rotasyon yok).

## 2) Bölgeler (1080×1920)
- A y 270–330: etiket "ÇOKLU DİL MODÜLÜ" 36 px (CTA sahnesinde soldaki logo 240 px + sağda etiket).
- B y 330–1020: ANA GÖRSEL/ANAHTAR KART (kanıt kırpması 900×690, ya da büyük tipografi).
- C y 1040–1236: ALTYAZI plakası (v8 ile aynı: x 65–1015, ≤2 satır, 64 px, kontrast ≥7:1).
- D y 1248–1920: yalnız devam/dekor (dil karoları, masa kartı devamı, selamlama yığını, desen). METİN ve tek-kaynaklı bilgi YOK.
- Güvenli bölge: x 65–1015; sağ ray (x>940, y 1000–1700) boş.

## 3) Sahne planı (süreler `ses/cue-v4.json` cümlelerinden; sabit saniye yazma)
1. **Kanca (ALTIN):** B: anahtar kart "Dil engeli, / kayıp masa." (≈140 px, sola dayalı, y 360–800). D: dört selamlama satırı "Hello? / Hallo? / Bonjour? / ¿Hola?" (88 px, %60, sırayla 0,5 sn arayla belirir). Altyazı: cümle 1.
2. **Acı (ALTIN):** B: 2×2 masa kartları (başlık "MASA 1…4" ≥40 px; 1. kart altın dolu "SİPARİŞ ALINIYOR", diğer üçü "BEKLİYOR" + sayısız ilerleme çubuğu; SAYAÇ YOK). Anahtar kart yok (altyazı zaten söylüyor). D: kart desenin devamı. Altyazı: cümle 2.
3. **Dönüş (ZÜMRÜT'e perde):** B: "Çoklu Dil" altın pill + altında 8 dil kodu satırı TR·EN·DE·FR·ES·IT·RU·AR. Altyazı: cümle 3.
4. **Çözüm (ZÜMRÜT):** B: gerçek ekran kırpma kartı, sırayla: dil seçici açık (`02-dil-secici`) → TR menü (`03-menu-tr`) → EN (`04-menu-en`) → DE (`05`) → FR (`06`). Kartın üstünde (B içinde, kartla çakışmadan y≈330–400) aktif dil etiketi "TR · Türkçe" vb. (≥44 px, altın). Küçük "Gerçek demo menü" etiketi kartın alt-sol köşesinde (≥36 px). D: dört dil karosu (dekor; aktif altın, ama bilgi B'dedir). Altyazı: cümle 4–5.
5. **Modül (ZÜMRÜT):** B: *Diller* kartı kırpma (≥900 px geniş) → *CSV İçe Aktar* kartı kırpma (karartma %55 + 3 px altın çerçeve; yalnız "dosyadan toplu yüklersiniz" cümlesinde); anahtar kart "20'den fazla dil" yalnız *Diller* kartı gösterilirken kartın üstünde y 330–420. D: 8 dil çipi (yalnız doğrulananlar). Altyazı: cümle 6–8 (v8 numaralandırması).
6. **Kapanış (ALTIN):** A: logo (240 px, sol) + etiket (sağ). B: anahtar kart "Canlı menü" 140 px + altında URL `qrmenuofficial.com/canli-menu` 56 px tam opak (UTM yok). D: büyük logo (dekor, bilgi taşımaz) yerine boş altın + nokta ızgarası; ince çizgi/ok YOK. Altyazı: cümle 11–12 ("Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde."). Son kare→ilk kare 0,7 sn: yalnız zemin çapraz; metin önce söner, sonra yenisi girer.

## 4) Çıktılar
`out/coklu-dil-reels_v9.mp4` (tam) ve `out/coklu-dil-reels_v9-kisa.mp4` (kısa; ≈28 sn), `out/coklu-dil-reels_v9.srt`, `video-v9-rapor.md`, `out/dogrulama-v9-*.json`, 1 fps kontak sayfası, v8|v9 karşılaştırma kareleri `out/kontrol-v9/`. Yeni dosyalar: `render/index-v9.html`, `scene-v9.mjs`, `render-v9.mjs`, `test-v9.mjs`, `encode-v9.sh`.

## 5) Doğrulama (otomatik + göz)
v8 testlerine EKLE: (a) **metin–metin çakışma:** 30 fps'te görünür her metin kutusu çifti için kesişim 0; (b) **alt örtü:** y>1248'de metin/işlevsel öğe yok; (c) **plaka opaklığı:** altyazı plakası her karede ≥%95 opak; (d) **kanıt kartı boyutu:** S4–S5'te kanıt kırpması ≥900×600 ve etkin metin ≥30 px; (e) **çipler:** yalnız doğrulanan 8 dil; (f) **yasak ifade taraması:** "Bekleme süresi", saat biçimli sayaç (d:dd), "otuz", "30 dil", PT/NL/PL; (g) **halka/karartma yok;** (h) v8'in tüm testleri (güvenli bölge, senkron ≤0,15 sn, CSV, hareket dili, kontrast: DOLGULU öğelerde zemini gerçek dolgu olarak al — v8'in test artefaktını düzelt). Dikey doluluk eski metriği ("%85") KALDIRILDI (dekorla şişiriliyordu); yerine (d) ve "B bölgesinde ana görsel ≥900×600" kullanılır. Rapor "kontrol edildi" demeden önce kareler gerçekten açılıp bakılmış olmalı; v8'deki gibi başarısız/sınırlı hedefleri dürüstçe yaz.

## 6) Karar kapısı
Önce 8 ANAHTAR KARE (PNG): kanca, acı, dönüş, S4-dil seçici, S4-EN menü, S5-Diller, S5-CSV vurgusu, kapanış + 4,2 sn ve loop geçişinin ara karesi (çakışma yok kanıtı). `out/kontrol-v9/`'a koy, DUR, onay iste; sonra tam ve kısa render.

## 7) Yasak
Kimlik bilgisi/token/çerez commit'i; ses üretme/değiştirme; metin değiştirme (ses-metni-v4); v1–v8'i silme/değiştirme; PR; ana dala push.
