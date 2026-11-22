# Claude Code promptu — ig-templates düzeltme turu (marka renkleri korunur)

Girdi: `tools/ig-templates/` (RAPOR.md, check.mjs, tokens.json, templates/, sprites/, plan/), `analiz/ekran/grid-1.jpg`, `CLAUDE.md`. Mevcut çıktıları EZME; yeni sürümleri `out/v2/` altına yaz.

KURAL 0 — MARKA RENKLERİ DEĞİŞMEZ
Tek geçerli palet (tokens.json'a olduğu gibi yaz, yeni renk ekleme):
- Koyu yeşil #0D2B22 (zemin; parıltı merkezi en fazla #174233).
- Altın #C9A84C (koyu zeminde vurgu, yıldız, zil, ornament).
- Krem #EADFC1 DÜZ zemin (gradyan YOK, daha açık ton YOK; grid'deki mevcut krem karolarla birebir aynı), ek metin zemini #F4F1E8 yalnız rozet/pill içinde.
- Açık zeminde altın YAZI rengi: #7F6419 (CLAUDE.md `--ts-gold-ink`); #C9A84C açık zeminde YASAK.
- Kahverengi, bronz, gümüş, mavi, kırmızı yok. v1'de #F4F1E8'e açılan krem gradyan ve koyulaştırılmış mürekkep denemelerini GERİ AL.

KONTRAST KURALI (CLAUDE.md ile uyumlu): metin kontrastı ≥4,5:1; büyük/kalın metin (≥24 px, 700+ ağırlık ≥18,66 px) ≥3:1. Bu şablonlardaki bütün metinler ≥40 px olduğundan eşik 3:1; #7F6419 / #EADFC1 = 4,23:1 geçer. `check.mjs`'te eşiği bu kurala göre yaz, raporda ölçülen değeri yine göster (4,5 hedefi aşılıyorsa "bonus" olarak belirt). Ölçüm için gerekçe: büyük metin tanımı.

1) CÜMLE AİLESİ (yeniden tasarla)
- Boş balonlu tek figürü KALDIR. İki varyant üret:
  a) Tipografi odaklı: büyük cümle (2 satır, tek altın vurgu kelime), altında ince altın çizgi ornamenti, alt orta logo; figür yok. Koyu ve krem zemin.
  b) Prop'lu: cümleye bağlı küçük kanıt öğesi; Çoklu Dil için `ekran/02-dil-secici.png`'den dil listesi kırpığıyla tablet sprite (gerçek ekran, yeniden çizme/değiştirme).
- İçerik alanı dikey olarak dengeli (ağırlık merkezi y 45–60 %), alt boşluk kalmasın.

2) PROP DÜZELTMELERİ (sprite'ları yeniden üret, `sprites/` altına v2)
- Zil: çağrı zili — altın taban + kısa üst düğme, krem vurgu; kubbe/cloche silüeti ve kahverengi YOK.
- Saat: kaldır ya da yalnız QR masa kancasında figür grubuna yakın küçük prop olarak (başlık altında yüzmesin).
- Yıldızlar: #C9A84C parlak, büyük (her biri ≥70 px), figür grubunun parçası (grup üstünde yay, grubun %60'ı kadar genişlik).
- QR tabela: stilize, okunamaz desen (gerçek kod değil), altın çerçeve.
- Tüm sprite'lar v5 stilinde, alfa kenarı temiz, 2×.

3) ÖLÇEK KURALI (tüm kanca kapakları)
Figür grubu genişliği ≥760 px (Reels), başlık–grup boşluğu ≤120 px, grup alt kenarı ile logo üst kenarı arası ≥48 px (logo figür ayağına yapışmasın). Kural ihlal ederse şablon figür ölçeğini büyütür; sığmıyorsa hata ver. `check.mjs`'e bu üç ölçümü ekle.

4) KANCA METİNLERİ
- Chatbot: "Soruyu kim\ncevaplıyor?" (eski "Hep aynı soru mu?" yerine).
- Diğerleri (kullanıcı onayladığı geçen sürümler) aynı kalır: "Garson\ngelmedi mi?", "Hangi kriter\ndüşüyor?", "Hangi masa\nçağırdı?", "Garsonunuz\ntercüman mı?".
- Yasak içerik testi ve kanca kuralı (≤5 kelime, 2 satır) değişmez.

5) GRİD RİTMİ
`plan/grid-plan.json` sırasını `ritim.mjs` önerisiyle yeniden yaz ve yeni görseller için uyarı sayısının 0 olduğunu doğrula (koyu–koyu, krem–krem yan yana ve alt alta yok; yeni krem düz #EADFC1 olduğundan mevcut karolarla krem–krem komşuluğunu da say ve raporla). Önizleme montajını yeniden üret.

6) YENİ/GÜNCEL TESTLER
- Palet denetimi: çıktıda baskın zemin renkleri tokens.json paletiyle uyumlu (krem zemin düz #EADFC1 ±2 kanal, gradyan yok; kahverengi/bronz/mavi ton yok — HSV taramasıyla).
- Kontrast: büyük metin ≥3:1, küçük metin ≥4,5:1; ölçülen değerler raporda.
- Mevcut testler (güvenli bölge, yan marj ≥80, 330 px satır yüksekliği, yasak içerik, font, boyut ≤2 MB) geçerli.

7) DOĞRULAMA
Her yeni çıktı için tablo: yazı boyu, yan marj, kontrast (ölçülen ve eşik), figür grubu genişliği, başlık–grup boşluğu, logo boşluğu, dosya boyutu. Önizleme sheet'i (9:16/3:4/330 px) ve grid montajı (eski krem karolarla yan yana: ton uyumu görsel kontrol). RAPOR.md'yi güncelle; başarısız/yapılamayanları açıkça yaz. Commit: sprite'lar, şablonlar, testler, out/v2; ara dosyalar hariç; dala push (gerekirse fetch+merge), PR açma.

DEĞİŞMEYENLER: kanca A ve kanıt şablonlarının yerleşimi, Manrope, gerçek ekran görüntüleri, yasak iddia listesi, altı çizili yok, kimlik bilgisi yok.
