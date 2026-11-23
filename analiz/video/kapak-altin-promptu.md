# Claude Code promptu — Reels kapağı ALTIN zemin (Çoklu Dil)

Görev: `analiz/video/kapak/coklu-dil-kapak-A2.png` (zümrüt zeminli 3B kapak, "Garsonunuz tercüman mı?") ALTIN zeminli yeni bir kapağa dönüştür. Yalnız kapak; Reels videosunun kendisi (zümrüt) DEĞİŞMEZ. Dal: `claude/qr-menu-instagram-strategy-rs76jf`. PR açma; yalnız o dala commit + push.

## Kaynak ve yöntem
- Kapak `analiz/video/render/kapak-a2.mjs` → `window.kapakKur2` (`render/scene*.mjs` + `index-*.html`, three.js r160, Playwright). Hangi sahne/HTML dosyasını yüklediğini `sunucu.mjs`'ten bul.
- VİDEONUN tekrar üretilebilirliğini bozma: mevcut `scene-v5.mjs` / `index-v*.html` / `scene.mjs` dosyalarını DEĞİŞTİRME. Kopyala: `render/scene-kapak-altin.mjs`, `render/index-kapak-altin.html`, giriş: `render/kapak-altin.mjs`. Çıktılar `analiz/video/kapak/` altına.
- Geometri, kadraj, figür ölçeği, metin boyu (165 px, `ls -.064em`), balon boyutları, `grupY [785,1400]`, `metinY 428`, `logoY 1415` AYNI kalır; yalnız renk/malzeme/ışık değişir.

## Renk sistemi (marka: koyu yeşil #0D2B22 · altın #C9A84C · krem #F4F1E8; Manrope)
- **Zemin:** dikey/ışıma gradyanı #E8C766 (üst-orta ışık) → #C9A84C (orta) → #B8963F (kenar). Yeşil ışıma (`glow`) ve koyu vinyeti kaldır; yerine çok hafif sıcak vinyet (rgba(60,40,0,.16)). Yeşil kalıntı (eski radial #17463a…) KALMASIN.
- **Metin:** "Garsonunuz" ve " mı?" koyu yeşil #0D2B22. "tercüman" kelimesi koyu yeşil yuvarlatılmış zemin (pill gibi, köşe 22 px) üzerinde krem #F4F1E8. Kontrast: koyu yeşil/altın ≥ 6,6:1; krem/koyu yeşil ≥ 11:1.
- **"RESTORAN SAHİBİ İÇİN" hapını KALDIR** (marka kuralı: hap etiket yok). Yerine aynı yerde (y=342) çerçevesiz, harf aralıklı "ÇOKLU DİL MODÜLÜ" (koyu yeşil, ~40 px, 800, .42em). Modül adı kapakta görünsün.
- **3B figürler:** altın üstünde krem figür okunmuyor. Garson gövdesi koyu yeşil #0D2B22 (kollar/yüz detayları krem), turist gövdesi #1E3D2F veya daha açık yeşil #2F5B48 (garsondan ayırt edilir). Masa üstü #1E3D2F, kenar krem rim. Menü kartı krem kalır (koyu masa üzerinde). `rim` PointLight'ı (0xC9A84C) sıcak beyaza çevir/azalt (altın üstünde altın ışık kayboluyor).
- **Balonlar:** "?" balonu krem + koyu yeşil "?" + 6 px koyu yeşil dış çizgi ya da koyu yeşil balon + krem "?"; "…" balonu koyu yeşil + altın nokta. Altın üstünde krem balon tek başına kontrastsız: çizgi/gölge şart.
- **Logo:** altın logo yerine koyu varyant (`#0D2B22`, "v4-dark"); `el.logo` kaynağını koyu SVG ile değiştir, 270 px, aynı konum.

## Kurallar (ölçüp raporla)
1. Çıktı 1080×1920. 3:4 profil kırpımı (y 240–1680) içinde kanca metni + modül adı + figür grubu TAM görünür; üst 240 px ve sağ üst 160×160 boş (Instagram simgeleri); Reels güvenli bölge: üst 270, alt 672, yan 65 (kanca metni bunun içinde değilse 3:4 kırpımı esas, nedenini raporla).
2. Kontrast tablosu (`kontrol-ALTIN.json`): kanca metni/zemin, "tercüman" pill, modül adı, logo, figür/zemin (grafik ≥3:1), balon/zemin. Metin <4,5:1 veya grafik <3:1 ise düzelt.
3. 330 px küçük karoda kanca okunuyor (ölç: satır yüksekliği ≥ 30 px).
4. Grid montajı: `kapak/onizleme-ALTIN.jpg` = soldan sağa: `analiz/final-coklu-dil/1-gonderi-aci.jpg` (krem) · `analiz/final-coklu-dil/2-carousel-1.jpg` (zümrüt) · yeni ALTIN kapak (3:4 kırpım). Hepsi 330 px ve 600 px genişlikte.
5. Yeşil artık (kenarlarda/dither'da) yok: zemin pikselleri için ortalama renk ve kenar piksel ölçümü ver.

## Çıktılar
`analiz/video/kapak/coklu-dil-kapak-ALTIN.png` (+ `.jpg`, kalite 92), `onizleme-ALTIN.jpg`, `kontrol-ALTIN.json`, `kapak-altin-rapor.md` (ne değişti, ölçümler, sapmalar, kalan riskler). Rapor "kontrol edildi" demeden önce kare/görsel gerçekten açılıp bakılmış olmalı.

## Karar kapısı (benden onay iste, kendin yapma)
Videonun gövdesi zümrüt kalıyor; altın kapak + zümrüt video arası kopukluk oluşturur (kullanıcı altın kapağa dokunur, koyu yeşil video açılır). Kapak onaylandıktan sonra videonun kendisini de altına çevirmek ayrı, büyük bir iş (840 kare yeniden render, ekran maketleri, altyazılar). Başlama; önce kapağı teslim et ve sor.

## Yasak
Kimlik bilgisi/token commit'leme; `.env` ve oturum çerezlerini repoya koyma; mevcut video render dosyalarını değiştirme; PR açma; ana dala push.
