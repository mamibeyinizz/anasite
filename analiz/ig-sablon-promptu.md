# Claude Code promptu — Instagram şablon sistemi (kanca · kanıt · cümle)

Girdi: `analiz/video/render/` (v5 three.js 3B sahne, layout.js), `analiz/video/kapak/` (A2 kapak, kontrol-A2.json), `analiz/video/ekran/` (gerçek ekran görüntüleri), `assets/fonts` (Manrope, yerel), `assets/brand` (logo), `CLAUDE.md`, `CONTENT_STRATEGY.md` (§1, §7). Çalışma dizini: `tools/ig-templates/`. Çıktılar aşağıda. Mevcut dosyaları EZME.

AMAÇ: Tek JSON girdisinden Instagram görselleri (Reels kapağı, carousel/post kapağı) üreten, kuralları otomatik test eden bir şablon sistemi. Hedef: her yeni görsel elle ayarsız, hatasız, marka dilinde ve grid ritmine uygun çıksın.

1) MİMARİ
- `tokens.json` tek kaynak: renkler (yesil #0D2B22; koyu zemin glow merkezi en fazla #174233; krem #EADFC1 ve #F4F1E8; altın koyu zeminde #C9A84C, AÇIK zeminde #7F6419 — açık zeminde #C9A84C KULLANMA), font (Manrope 400/500/700/800, yerel dosya, başka font yok), boyutlar, marjlar, güvenli bölgeler.
- `templates/` içinde üç aile: `kanca`, `kanit`, `cumle`; HTML/CSS + küçük JS, `render.mjs` (Playwright, deviceScaleFactor 1, bekleme: fontlar yüklenene kadar) ile PNG→JPG.
- `data/*.json` girdi dosyaları; `out/` çıktılar; `plan/grid-plan.json` yayın sırası.
- CLI: `node render.mjs data/x.json`, `node check.mjs data/x.json`, `node ritim.mjs plan/grid-plan.json`, `node onizleme.mjs`.

2) AİLELER
- kanca (koyu yeşil zemin, hafif radyal parıltı, 3B figür sprite'ları, 2 satır büyük soru ya da cümle, hap etiket, logo). Reels kapağı için.
- kanit (KREM zemin, koyu yeşil metin, altın vurgu #7F6419; telefon çerçevesi + büyüteç kartı; gerçek ekran görüntüsü; "Gerçek demo menü" rozeti). Carousel/post kapağı için. Ekran görüntüsünü yeniden çizme/değiştirme.
- cumle (tek cümle, koyu yeşil ya da krem zemin; büyük tipografi; küçük figür ya da ikon). İpucu/alıntı için.
Ortak: tek vurgu kelimesi (altın), en fazla 5 kelime kanca, etiket hapı büyük harf ≥44 px, logo gerçek dosya ≥260 px, altı çizili metin yok.

3) FORMATLAR VE GÜVENLİ BÖLGE
- `reels`: 1080×1920. Kritik içerik 3:4 grid kırpımında (y 240–1680) kesilmeden; Reels UI güvenli bölgesi üst 270 / alt 672 / yan 65; YAN MARJ ≥80 px (mürekkep x 80–1000); sağ üst 160×160 (3:4 kırpımın içinde) BOŞ.
- `post34`: 1080×1440 (3:4, gridde birebir). Yan marj ≥80, üst/alt ≥96; sağ üst 160×160 boş.
- Kanca yazı: Reels ≥160, post34 ≥140 px; metin otomatik sığdırma (auto-fit): önce maks. boy, sığmazsa minimuma kadar küçült, minimuma inip hâlâ sığmıyorsa HATA ver ("metin çok uzun"), taşırma.

4) 3B SPRITE KÜTÜPHANESİ (bir kez üret, şablonlar yeniden kullanır)
- `render/` içindeki three.js hattıyla şeffaf PNG sprite'lar üret: `assets/figur/` altında garson (kollar açık, el sallayan, tepsi taşıyan), misafir (menü uzatan, şaşkın), masa, menü kartı, balonlar ("…" ve "?"), ve modül propları: zil, boş tablet çerçevesi (içi ekran görüntüsüyle doldurulur), yıldız (puan), QR tabela (stilize, okunabilir kod DEĞİL), saat.
- Stil v5 ile aynı (kapsül gövde, krem ve altın, yumuşak temas gölgesi). Yeni karakter/stil uydurma; yalnızca prop ekle. Sprite başına 2× çözünürlük, alfa kenarı temiz (halo yok).

5) GİRDİ ŞEMASI (örnek, `data/ornek-kanca.json`)
{ "id":"dil-kanca-A", "aile":"kanca", "format":"reels", "etiket":"RESTORAN SAHİBİ İÇİN", "kanca":["Garsonunuz","tercüman mı?"], "vurgu":"tercüman", "figur":["garson:kollarAcik","misafir:menuUzat","masa","menuKarti","balon:ucNokta","balon:soru"], "logo":true }
`kanit` için ek alanlar: "ekran":"ekran/04-menu-en.png", "lens":{"satir":"...","dil":"EN"}, "rozet":"Gerçek demo menü". `cumle` için: "cumle":["Dilleri siz","tanımlarsınız."], "vurgu":"siz", "zemin":"koyu|krem".

6) İLK ÜRETİLECEKLER
a) `kanca/Reels`: "Garsonunuz tercüman mı?" (A3: yan marj ≥80, sağ üst boş) → `out/dil-kanca-A.jpg`.
b) `kanit/post34`: Çoklu Dil, gerçek ekran (`ekran/04-menu-en.png`) + büyüteç (ürün satırı, ≥28 px), krem zemin.
c) `cumle/post34`: "Dilleri siz tanımlarsınız." (koyu ve krem iki varyant).
d) 5 modül için kanca TASLAĞI (kullanıcı onaylayacak, yayınlama): Chatbot "Aynı soruya\nyine mi cevap?", Garson çağrısı "'Garson gelmedi'\ndemesinler.", Yorum "Hangi kriterde\npuan düşüyor?", Dil "Garsonunuz\ntercüman mı?", QR masa "Hangi masa\nçağırdı?". Hepsi yasak iddia testinden geçmeli.

7) TESTLER (`check.mjs`; kırmızıda çıktıyı reddet)
- Mürekkep sınırları: tüm metin/öğe güvenli dikdörtgen içinde; yan marj ≥80; sağ üst 160×160 boş; logo kırpım kenarına ≥40 px.
- Kontrast ≥4,5:1 (piksel örneklemesi); açık zeminde altın #7F6419 dışında altın yok.
- 330 px genişlik küçültmesinde kanca satır yüksekliği ≥45 px (reels), ≥40 px (post34).
- Kanca ≤5 kelime, 2 satır; etiket var; tek vurgu kelimesi metinde geçiyor.
- Yasak içerik taraması (regex): rakam/yüzde, "AI", "yapay zeka", "otomatik çeviri", "ücretsiz", "anında", "devrim", "garantili", "sınırsız".
- Font: yalnızca Manrope; yerel dosya yüklenmiş (document.fonts).
- Çıktı: JPG kalite 92, ≤2 MB; PNG yalnızca arşiv; sRGB.
- Arka plan tutarlılığı: koyu zemin medyanı #08241A–#0E2F26 aralığında, parıltı merkezi ≤#25503D (carousel zemini ile uyum).
- Ekran görüntüsü kullanan şablonda ekran dosyası değiştirilmemiş (hash karşılaştırması).

8) GRİD RİTMİ
- `plan/grid-plan.json` en yeni → en eski sırayla aile listesi (ör. ["kanca","kanit","cumle",...]). `ritim.mjs`: 3 kolonlu gridde yatay ve dikey komşu iki aynı aile ve iki aynı zemin tonu (koyu–koyu, krem–krem) yan yana gelirse UYAR; öneri sıralaması üret.
- `onizleme.mjs`: seçilen çıktıları mevcut hesabın grid ekranıyla (`analiz/ekran/grid-1.jpg`) birleştirip 3×4 montaj (`out/onizleme-grid.jpg`) ve her görselin 330 px küçültmesini üretsin.

9) DOĞRULAMA (hepsi geçmeden "bitti" deme)
- `check.mjs` tüm ilk çıktılarda yeşil; ihlal listesi raporda.
- Ölçüm tablosu: her çıktı için yazı boyu, yan marj, kontrast, 330 px satır yüksekliği, dosya boyutu.
- Önizleme sheet'i (9:16 / 3:4 / 330 px) ve grid montajı.
- Kullanım README'si (5 satır: yeni görsel ekleme, test, grid planı).
- Commit: araç, sprite'lar, ilk çıktılar, README; ara dosyalar ve kimlik bilgisi hariç. Dala push (gerekirse fetch+merge), PR açma. Raporda her başarısız testi ve yapamadığın adımı açıkça yaz.

DEĞİŞMEYENLER: marka renkleri ve Manrope, gerçek ekran görüntüleri, yasak iddia listesi, altı çizili yok, kimlik bilgisi yok, kapak kanca metinleri sade ve rakamsız.
