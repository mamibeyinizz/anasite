# Claude Code promptu — Instagram kapak v2 (kanca metinli)

Girdi: `render/` (v5 3B sahne ve `layout.js`), `assets/brand`, `kapak/coklu-dil-kapak.png` (v1, beğenilmedi), `video-v5-analiz.md`. Çıktılar: `kapak/coklu-dil-kapak-A.png|jpg`, `-B.png|jpg`, `-C.png|jpg`, `kapak/onizleme-v2.jpg`. v1'i EZME.

NEDEN v1 OLMADI
Slayt gibi okunuyor: ifade bildirim cümlesi ("Yabancı misafir geldi…"), özellik etiketi ("Çoklu Dil modülü", hesapta en az ilgi gören dil), figürler küçük, üst %25 boş, merak/gerilim yok. Grid'de kapak, kaydırmayı durduran tek şeydir: çok büyük, çok kısa, tek fikir.

TASARIM KURALLARI (üçü ortak)
- Tuval 1080×1920. İçerik 3:4 grid kırpımında (y 240–1680) kesilmeden görünsün; 1:1 profil kırpımında (y 420–1500) da kanca metni okunsun; Reels güvenli bölgesi üst 270 / alt 672 / yan 65. Grid'de sağ üst köşe (≈160×160 px, 3:4 kırpımın içinde) sabitleme/Reels ikonları için BOŞ kalsın.
- Kanca metin: en fazla 5 kelime, 2 satır, Manrope 800, ≥170 px, satır aralığı sıkı; tek anahtar kelime altın (#C9A84C), kalanı krem (#F4F1E8). Metin 1:1 kırpımın içine ve görsel nesnenin ÜSTÜNE değil yanına/üstüne yerleşir (örtüşme yok).
- Hedef etiketi (niş çağrısı): küçük hap, altın çerçeve, büyük harf, ≥44 px: "RESTORAN SAHİBİ İÇİN" (metnin üstünde).
- Görsel: v5 3B malzemesi (garson, turist, masa, MENÜ kartı, balonlar), ama KADRAJ YAKIN: figür grubu genişliği ≥900 px, garson el kol hareketi abartılı (kollar iki yanda), turistin "?" balonu büyük (≥200 px). Duygu: şaşkın turist, bunalmış garson. Yeni karakter/stil uydurma.
- Logo: gerçek dosya, ≥260 px, alt orta (y≈1560) ya da hap içinde; CTA/URL/telefon/ekran görüntüsü YOK.
- Arka plan videodaki koyu yeşil; kanca metnin arkasında hafif radyal parlama (kontrast), dither (banding yok). Altı çizili metin yok.
- Hesap grid'indeki mevcut krem/koyu yeşil tipografi karolarından ayrışsın: 3B figür ve yakın kadraj.
- YASAK: rakam/yüzde, "AI", "ücretsiz", "anında", "devrim", "Çoklu Dil modülü" etiketi.

ÜÇ KANCA (A/B için)
- A: "Garsonunuz\ntercüman mı?" — "tercüman" altın. Birincil.
- B: "Menüyü kim\nanlatacak?" — "kim" altın.
- C: "Garson tercümanlık\nyapmasın." — "tercümanlık" altın (sonuç odaklı).
Her varyantta aynı görsel kompozisyon, yalnız metin değişir.

DOĞRULAMA (hepsi geçmeden "bitti" deme)
1. Önizleme sheet'i: A/B/C yan yana; her biri 9:16 tam, 3:4, 1:1 ve 330 px genişlik küçültmesinde. 330 px'te kanca metin yüksekliği ≥50 px/3 = okunur (satır yüksekliği ≥ 30 px); okunmuyorsa büyüt.
2. Kontrast ≥4,5:1 (piksel örneklemesiyle); kırpım kenarlarına ≥40 px; sağ üst 160×160 boş.
3. Mevcut grid karoları yanında (ekran/grid-1.jpg'e kompozit) deneme montajı: kapak mevcut karolardan ayrışıyor mu, ekle `onizleme-v2.jpg`.
4. Rapor: dosya yolları, ölçülen metin yüksekliği, kontrast, hangi kanca birincil ve neden.
5. Commit: PNG/JPG (≤2 MB), kaynak, önizleme; dala push (gerekirse fetch+merge), PR açma.

KULLANIM: Reels yüklerken "Kapak › Galeriden ekle" ile A'yı seç; grid önizlemesini 3:4 ve 1:1'de kontrol et. Kapak yayından sonra da değiştirilebilir (Reels › Düzenle › Kapak): A ile başla, 7 gün sonra B'ye geç ve profil ziyareti/erişimi karşılaştır (tek hesapta küçük örnek, kesin sonuç beklemeyin).
