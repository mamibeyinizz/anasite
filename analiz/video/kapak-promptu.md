# Claude Code promptu — Instagram Reels kapak görseli (Çoklu Dil)

Girdi: `render/` (v4 üç boyutlu sahne ve `layout.js`), `ekran/`, `assets/brand`, `video-v4-analiz.md`. Çıktı: `kapak/coklu-dil-kapak.png` (1080×1920, sRGB) + `kapak/coklu-dil-kapak.jpg` (kalite 92, ≤2 MB) + `kapak/onizleme.jpg` (aşağıdaki kırpımların yan yana sheet'i).

AMAÇ: Restoran/kafe sahibi grid'de ya da Reels sekmesinde kaydırırken ilk saniyede kendi acısını görsün ve dokunsun. Videonun hook'u ile aynı sahne, ama durağan ve grid'de okunacak büyüklükte.

TASARIM
- Tuval 1080×1920. Tüm kritik içerik 3:4 grid kırpımında (y 240–1680, 1080×1440) ve 1:1 profil kırpımında (y 420–1500) KESİLMEDEN görünsün; ayrıca Reels UI için üst 270 / alt 672 / yan 65 güvenli bölge içinde kal.
- Başlık: "Yabancı misafir geldi. Menüyü kim anlatacak?" iki satır; Manrope 800, ≥96 px, satır 1 krem (#F4F1E8), satır 2 altın (#C9A84C). Konum: 1:1 kırpım içinde (y 480–800).
- Görsel: v4 3B sahnesinin (garson, turist, masa, MENÜ kartı, "…" ve "?" balonları) birebir aynı malzemesiyle render, grup genişliği ≥760 px, y 860–1420; kamera biraz yakın, hafif perspektif. Yeni karakter/stil uydurma.
- Etiket: küçük hap "Çoklu Dil modülü" (altın çerçeve, ≥40 px yazı) başlığın üstünde (y≈420) ya da altında; sağ üstte değil.
- Logo: gerçek dosya (`assets/brand`), küçük (≈220 px), alt orta (y≈1560, 3:4 kırpımın içinde).
- Arka plan: videodaki koyu yeşil gradyan (#0D2B22 tonları), hafif vinyet; gradyanda dither (banding yok).
- YASAK: yüzde/rakam iddiası, "AI", "ücretsiz", "anında", CTA metni, link/URL, altı çizili metin, ürün ekranı kırpığı (kapakta telefon yok).
- Gridde mevcut gönderilerle ayrışsın (onlar krem/koyu yeşil tipografi): kapakta 3B figür ve koyu yeşil zemin kullan; mevcut krem karoları taklit etme.

DOĞRULAMA (hepsi geçmeden "bitti" deme)
1. Önizleme sheet'i: 9:16 tam · 3:4 (240–1680) · 1:1 (420–1500) · 330 px genişlikte grid küçültmesi. Başlık 330 px'te okunuyor mu (yazı yüksekliği ≥26 px); okunmuyorsa büyüt.
2. Kontrast: başlık/zemin ≥4,5:1 (piksel örneklemesiyle). Metin güvenli bölgede, hiçbir öğe kırpım kenarına değmiyor (≥40 px boşluk).
3. Kapak karesi ile videonun ilk karesi aynı hook cümlesini taşır; 3B malzeme v4 ile aynı (render kaynağından), elle çizim yok.
4. Raporda: dosya yolları, kırpım önizlemeleri, ölçülen metin yüksekliği ve kontrast.
5. Commit: PNG, JPG, önizleme, kaynak; dala push (gerekirse fetch+merge), PR açma.

KULLANIM NOTU (kullanıcıya yaz): Instagram'da Reels yüklerken "Kapak" › "Galeriden ekle" ile `coklu-dil-kapak.jpg`'yi seç; grid önizlemesini 3:4 ve 1:1 görünümlerinde kontrol et.
