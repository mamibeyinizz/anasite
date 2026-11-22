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


---

# v2 (KURAL 0: palet değişmez) — çıktılar `out/v2/`

v1 çıktıları ve `out/olcum-tablo.json` dokunulmadı. v1 deneme ayarları geri alındı: krem **düz #EADFC1** (gradyan yok), `#F4F1E8` yalnız hap/rozet içinde. Yeni renk eklenmedi (`tokens.json` paleti: #0D2B22, #174233 glow, #08241A kenar, #C9A84C koyu zeminde, #EADFC1, #F4F1E8 pill, #7F6419 açık zeminde yazı).

## Ölçüm tablosu (check.mjs yeşil, 10/10)
| Çıktı | Yazı px | Yan marj sol/sağ | Kontrast (ölçülen / eşik) | Figür grubu genişliği | Başlık–grup boşluğu | Grup–logo boşluğu | 330 px satır yük. | JPG MB |
|---|---|---|---|---|---|---|---|---|
| dil-cumle-prop-koyu | 154 | 84 / 84 | 5.94 (eşik 3) | — | — | — | 46.1 | 0.21 |
| dil-cumle-prop-krem | 154 | 84 / 84 | 4.23 (eşik 3) | — | — | — | 46.1 | 0.2 |
| dil-cumle-tipo-koyu | 154 | 84 / 84 | 5.79 (eşik 3) | — | — | — | 46.1 | 0.19 |
| dil-cumle-tipo-krem | 154 | 84 / 84 | 4.23 (eşik 3) | — | — | — | 46.1 | 0.18 |
| dil-kanca-A | 152 | 83 / 83 | 5.43 (eşik 3) | 893 | 56 | 56 | 45.5 | 0.29 |
| dil-kanit | 162 | 83 / 81 | 4.23 (eşik 3) | — | — | — | 48.5 | 0.32 |
| taslak-chatbot | 182 | 87 / 87 | 6.02 (eşik 3) | 803 | 56 | 56 | 54.5 | 0.28 |
| taslak-garson-cagrisi | 172 | 86 / 87 | 5.43 (eşik 3) | 914 | 56 | 56 | 51.5 | 0.28 |
| taslak-qr-masa | 180 | 85 / 85 | 5.86 (eşik 3) | 808 | 56 | 56 | 53.9 | 0.29 |
| taslak-yorum | 180 | 87 / 86 | 5.86 (eşik 3) | 828 | 56 | 56 | 53.9 | 0.28 |

- Kontrast eşiği CLAUDE.md'ye göre: bütün metinler ≥40 px → büyük metin eşiği 3:1. En düşük ölçülen **4,23:1** (#7F6419 / #EADFC1, kanıt ve krem cümle); koyu zeminde 5,4–6,0:1.
- Palet taraması (HSV; ekran görüntüsü/telefon/tablet alanları hariç): mavi/kırmızı/kahverengi-turuncu piksel oranı ≤ 0.0e+00 (eşik 5e-4). Krem arka plan standart sapması ≤1,5 (düz).
- Yazı alt sınırı hâlâ Reels 152 px (≥160 + yan marj ≥80 birlikte mümkün değil; bkz. v1 notu).
- dil-cumle-prop-koyu: ağırlık merkezi y = %53
- dil-cumle-prop-krem: ağırlık merkezi y = %53
- dil-cumle-tipo-koyu: ağırlık merkezi y = %48
- dil-cumle-tipo-krem: ağırlık merkezi y = %48

## Yapılanlar
1. **Cümle ailesi yeniden:** boş balonlu figür kaldırıldı. (a) *tipografi*: 2 satır, tek altın vurgu, ince altın ornament çizgisi, alt orta logo, figür yok; koyu ve krem. (b) *prop'lu*: tablet sprite + `ekran/02-dil-secici.png` dil listesi kırpığı (ilk 5 öğe tam; gerçek ekran, hash testli); koyu ve krem. Alt boşluk kalmadı (logo y 1250).
2. **Prop'lar (assets/figur/v2):** zil = yassı altın taban + krem halka + kısa düğme (kubbe/kahverengi yok); yıldız = parlak #C9A84C, grup üstünde yay (grup genişliğinin %60'ı), her biri ≥70 px (testli); QR tabela okunamaz desen + altın çerçeve; saat qr-masa kancasından çıkarıldı (sprite durur, masa üstü yerleşimi var).
3. **Ölçek kuralı (kanca):** şablon figür aralığını açarak grubu büyütür; grup ≥760 px, başlık–grup ≤120 px, grup–logo ≥48 px hem şablonda (hata verir) hem `check.mjs`'te. Logo artık grubun 56 px altında; A'da grup ve logo v1'e göre biraz küçüldü/yukarı kaydı (logo ayağa yapışmıyor).
4. **Kanca metinleri:** chatbot "Soruyu kim / cevaplıyor?" (vurgu "kim"); diğerleri aynı. Figür listeleri: yorum ve QR masa'ya garson/misafir eklendi (grup ≥760 px için).
5. **Grid ritmi (`plan/grid-plan-v2.json`, ritim önerisiyle yazıldı):** 6'lı dalga A → kanıt → prop-koyu → tipografi-krem → chatbot → prop-krem. Mevcut krem karolarla **krem–krem komşuluğu 0**. Kalan uyarı **2** (yeni↔yeni 1: iki cümle görseli alt alta aynı aile; yeni↔mevcut 1: chatbot altındaki eski karo koyu).

## Başarısız / yapılamayan
- **Uyarı sayısı 0 sağlanamadı.** Mevcut grid'in ilk satırı üç koyu karo, onu izleyen satırlar koyu ağırlıklı; 2 ve üstü sayıda yeni görselle 0 çakışmalı dizilim yok (`ritim.mjs enIyiAltKume` tüm alt kümeleri deniyor; yalnız tek görsel eklemede 0: krem olmalı). 6'lı dalgada en iyi sonuç 2 çakışma.
- Yorum taslağında figürler küçük kalıyor (grup ≥760 px için aralık açıldı); kompozisyon zayıf, onay öncesi gözden geçir.
- Zil, garson çağrısı kancasında küçük ve tepsiyle kısmen örtüşüyor.
- Kanıt ve A yerleşimleri değişmedi; A'da grup/logo konumu ölçek kuralı gereği kaydı.
