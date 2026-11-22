# ig-templates raporu

## Ölçüm tablosu (check.mjs yeşil)
| Çıktı | Aile/format | Yazı px | Yan marj sol/sağ px | En düşük kontrast | 330 px satır yük. px | JPG MB |
|---|---|---|---|---|---|---|
| dil-kanca-A | kanca/reels | 152 | 83 / 83 | 5.43 | 45.5 | 0.29 |
| dil-kanit | kanit/post34 | 162 | 83 / 81 | 4.68 | 48.5 | 0.32 |
| dil-cumle-koyu | cumle/post34 | 154 | 84 / 84 | 5.94 | 46.1 | 0.21 |
| dil-cumle-krem | cumle/post34 | 154 | 84 / 84 | 4.76 | 46.1 | 0.19 |
| taslak-chatbot | kanca/reels | 190 | 109 / 110 | 5.71 | 56.9 | 0.27 |
| taslak-garson-cagrisi | kanca/reels | 172 | 86 / 87 | 5.43 | 51.5 | 0.28 |
| taslak-yorum | kanca/reels | 180 | 87 / 86 | 5.86 | 53.9 | 0.26 |
| taslak-qr-masa | kanca/reels | 180 | 85 / 85 | 5.86 | 53.9 | 0.28 |

## Başarısız testler / yapılamayanlar
- **Reels kanca ≥160 px ve yan marj ≥80 birlikte sağlanamadı** ("tercüman mı?" 920 px mürekkep genişliğine ≥160 px'te sığmıyor, harf aralığı −0,075 em'de bile). `tokens.json` Reels kanca alt sınırı **152 px** (330 px'te ≥45 px satır yüksekliğinin de alt sınırı); sığmazsa araç HATA verir. A kancası 152 px'e oturdu.
- **Orijinal taslak metinleri reddedildi** (aynı kuraldan): "Aynı soruya / yine mi cevap?", "'Garson gelmedi' / demesinler.", "Hangi kriterde / puan düşüyor?" → `data/taslak-*-orijinal.json` (araç hata verir). Geçen önerilen kısa karşılıkları: "Hep aynı / soru mu?", "Garson / gelmedi mi?", "Hangi kriter / düşüyor?"; "Hangi masa / çağırdı?" ve "Garsonunuz / tercüman mı?" aynen geçti. **Kullanıcı onayı gerekir; yayınlanmadı.**
- Krem zeminde `#7F6419` kontrastı #EADFC1 üstünde 4,23:1 (<4,5) çıktı; krem zemin üst bölgede `#F4F1E8`'e açılan radyal gradyan oldu (kenarlar #EADFC1), kontrast 4,68–4,76:1. Grid'deki düz #EADFC1 karolarla birebir aynı ton değil.
- Cümle ailesinde yazı alt sınırı 120 yerine kancayla aynı biçimde sığdırılıyor (154 px).
- Test sayıları ve yasak içerik regex'i `\d` her rakamı yasaklar (ekran görüntüsünün içindeki rakamlar DOM metni olmadığı için taranmaz).
- Grid montajı: yeni görseller hesabın mevcut grid ekran görüntüsüne yerleştirilmiş simülasyondur; ritim uyarıları yalnız yeni görsellerle ilgili çakışmaları sayar (mevcut grid'deki 13 çakışma değiştirilemez).
- "yorum" taslağında yıldızlar grubu küçültüyor (figür grubu yatay ve dikey kutuya sığdırılır).
