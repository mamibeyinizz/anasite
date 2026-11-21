# Claude Code düzeltme promptu v3 — coklu-dil-reels_v2 → v3 (yerleşim sistemi + otomatik test)

Girdi: `analiz/video/video-v2-analiz.md` (11 bulgu), `analiz/video/claude-code-fix-prompt.md`, `ses-metni.md`, `ekran/`, mevcut render kaynağı. v2'yi EZME; çıktı `coklu-dil-reels_v3.mp4`.

TEŞHİS: Sorun tek tek hata değil, yerleşim sisteminin olmaması. Önce sistemi kur, sonra sahneleri ona oturt, en son otomatik testle kanıtla. Elle koordinat verme.

1) YERLEŞİM SİSTEMİ (tek kaynak, `layout.js`)
- Güvenli dikdörtgen S = x 80–1000, y 270–1248 (yan 80, üst 270, alt 672). Hiçbir metin, medya, rozet, çip, logo veya altyazı S'in dışına çıkamaz. Tek istisna: arka plan ve dekor.
- Bantlar (y): BAŞLIK 330–560 · MEDYA 600–1130 · ALTYAZI 1140–1230. Her öğenin bandı sabit; sahne içinde bantlar arasında ≥24 px boşluk.
- Medya (telefon/tablet/panel) kutusu en fazla 780×530 px (telefon dikey ise 330×530); ortalanmış, y 600–1130. Telefon genişliği 330–420 px arası ve tüm sahnelerde aynı değer (ölçek sıçraması yok); büyütme yalnızca kamera yakınlaştırmasıyla ve kutu içinde.
- Altyazı plakası yalnızca ALTYAZI bandında; medyanın üstüne ASLA binmez. Medya ile plaka arası ≥24 px.
- Başlık ile altyazı aynı cümleyi taşımaz.

2) YAKINLAŞTIRMA = KIRPMA PENCERESİ
Zoom, medya kutusunun içinde (overflow hidden, yuvarlatılmış köşeli pencere) yapılır; içerik pencerenin dışına taşmaz, tuval kenarından kesilmez. Panel sahnesi: pencere 780×500, içinde "Diller / CSV Dışa Aktar / CSV İçe Aktar" kartlarına dolly (1,6–2×). Kartlar pencere içinde tam görünür; en küçük gerekli metin ≥28 px ekran-eşdeğeri.

3) DÜZELTMELER (v2 bulgularıyla eşleşir)
1: telefon genişliği 330–420, bant 600–1130, marjlar ≥80.
2: altyazı yalnızca ALTYAZI bandında, medyayı örtmez.
3: "Gerçek demo menü" rozeti telefon üstünde BAŞLIK–MEDYA arasında (y≈575) tek satır; dil çipleri telefonun YANINDA değil, rozetle aynı satırda ya da telefon altında; çerçeveye temas yok (≥16 px).
4–5: panel pencere içinde, dikey ortada (y 600–1100), taşma yok.
6: `05-menu-de` ekranını menü listesi görünümünde yeniden çek (splash değil); TR/EN/DE/FR dördü de aynı ekran durumunda (arama + kategori + ürün satırları) olsun. Çekim: `ekran/` altına, salt okunur, ayar değiştirme yok.
7: telefon ölçeği 8–28 sn boyunca sabit; hareket yalnızca konum/kamera.
8: altyazı geçişi çapraz değil: eski cümle tamamen söner (0,2 sn), yenisi gelir; iki cümle aynı anda görünmez. "Otuz dile kadar." ≥1,2 sn tam opak.
9: CTA sahnesi: başlık + URL (≥44 px, krem/altın, kontrast ≥4,5:1) tek blok; telefon MEDYA bandında; logo tek, gerçek dosya (`assets/brand`); karartma yok (opaklık ≥0,9). Altyazı yalnızca ALTYAZI bandında.
10: her sahnenin içerik ağırlık merkezi y 640–960 arasında.
11: sol/orta masa müşterilerine gövde ekle ya da kaldır; balon ve figür başka nesneyle örtüşmesin.

4) OTOMATİK YERLEŞİM TESTİ (render'dan önce zorunlu)
Her sahne için her 0,1 sn'de tüm öğelerin sınırlayıcı kutularını `out/layout.json`'a yaz. Test script'i (`layout_check.mjs`; `insta/src/aura/tools/layout_check.mjs` yalnızca yapı örneği, içeriği kullanma) şunları doğrular ve kırmızıda render'ı DURDURUR:
- Tüm metin/medya/rozet/çip/logo kutuları S içinde.
- Metin kutusu ile medya kutusu kesişimi = 0 (altyazı dahil).
- İki metin bloğu aynı anda görünürken kutuları kesişmez; aynı anda ikiden fazla metin bloğu yok.
- En küçük yazı: başlık/altyazı ≥40 px, ekran içi vurgulanan metin ≥28 px.
- Metin/zemin kontrastı ≥4,5:1 (örneklenmiş piksellerle).
- Telefon genişliği tüm medya sahnelerinde sabit (±0 px).
- Ağırlık merkezi y 640–960.

5) DOĞRULAMA
ffprobe (1080×1920, 30 fps, 28,0±0,1 sn, bt709, -14 LUFS ±1, ≥5 Mbps); 1 fps sheet + 0,1 sn aralıklı kritik aralıklar: 8–12, 12–17, 19–23, 24–28; `layout.json` raporu; her bulgu için önce/sonra karesi; kapak karesini 3:4 kırpımda göster. "Bitti" demeden önce 11 bulgunun her biri için "düzeltildi/düzeltilemedi + kanıt" yaz. Commit: `coklu-dil-reels_v3.mp4`, kaynak, `layout.json`, sheet; kimlik bilgisi ve ara dosyalar hariç; dala push (çekilmesi gerekirse önce fetch+merge), PR açma.

DEĞİŞMEYENLER: v3 metin ve süreler, tek birincil CTA, yasak iddia listesi, gerçek ekranlar, marka renkleri/Manrope, altı çizili yok.
