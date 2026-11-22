# Acı → avantaj gönderisi: tasarım sistemi (nizami sürüm)

Dosyalar: `post1-dil-nizami.html` (kaynak), `post1-dil-nizami.jpg` (1080×1440, 3:4).

## Yapı: 3 bölge, tek eksen
1. **Başlık şeridi** (y 104): marka metni `QRMENUOFFICIAL`, 30 px, harf aralığı .5em, gold-ink #7F6419.
2. **İçerik** (soru → ayraç → cevap): ortalı, tek dikey eksen.
3. **Alt şerit** (alt kenardan 104): dil çipleri TR · EN · DE · FR (28 px, kenarlı). Konunun görsel kanıtı: "kendi dilinde".
Üst ve alt kenar boşluğu eşit (104 px); başlık şeridi → içerik ve içerik → alt şerit boşlukları eşit (ölçüm: 231 / 231 px).

## Boşluk ve ritim
- Temel birim 8 px; tüm aralıklar 8'in katı; yan kenar boşluğu 96 px (ölçüm: sol 104 / sağ 97 mürekkep).
- Soru → ayraç ile ayraç → cevap arası **optik** eşit (67 / 68 px): metin kutusu değil mürekkep boşluğu eşitlendi (ascender/descender farkı telafi edildi).
- Sağ üst 160×160 boş (Instagram sabitleme/çoklu gönderi simgeleri için).

## Tipografi ölçeği
| Rol | Boyut | Ağırlık | Renk |
|---|---|---|---|
| Soru | 109 px (otomatik sığdır, en çok 112 / en az 80) | 800, harf aralığı −.035em | #0D2B22 |
| Cevap | 56 px (en çok 56 / en az 44) | 500; eylem kelimeleri 800 | #0D2B22 %85; eylem #7F6419 |
| Marka / çip | 30 / 28 px | 800 | #7F6419 / #0D2B22 |
Oran: soru/cevap ≈ 1,95. Metin sığmazsa font küçülür, taşmaz; minimum altına inerse hata.

## Satır kırma (anlam birimleri)
- Soru: "Personeliniz / Menüyü Kaç Dilde / Anlatabiliyor?" (en uzun satır tam sütun genişliği).
- Cevap: "Turist müşteri / menüyü kendi dilinde **okusun,** / siparişini kendi dilinde **versin.**" İki eylem satırı paralel; "kendi dilinde" iki kez aynı yerde hizalanır; sarkan tek kelime (orphan) yok.

## Renk
Düz #EADFC1 zemin (gradyan yok), yeşil #0D2B22, gold-ink #7F6419, altın #C9A84C yalnız ayraçta. Kontrast: soru 11,4:1; cevap 7,7:1; gold-ink 4,23:1 (büyük metin eşiği ≥3:1).

## Bir sonraki modüle uygulama
Aynı üç bölge ve ölçek; yalnız (1) soru, (2) cevap ve (3) alt şerit içeriği değişir. Alt şerit modüle göre: Çoklu Dil → dil çipleri; Garson & Hesap → "Garson · Hesap" çipleri; QR Masa → masa numaraları çipleri; Yorum → kriter çipleri.

---

## Işık sürümü (3'lü sistemin 1. parçası, bağlayıcı olan)
Önceki "nizami" sürüm ortalı ve marka metin şeritliydi; "Işık" kombinasyonundan sapıyordu. Bağlayıcı sürüm: `post1-dil-isik-nizami.html` / `.jpg` — Işık'ın 1. parça düzeni:
- **Sol eksen (x=96)**: hap etiket "RESTORAN SAHİBİ İÇİN" üstte solda; soru ve cevap sola yaslı; kısa altın ayraç (96×4 px, #C9A84C) sol kenardan başlar.
- **Soru:** cümle düzeni (Title Case yok), tek vurgu kelime grubu "kaç dilde" gold-ink #7F6419; 3 satır, 112 px.
- **Cevap:** 56 px; eylem kelimeleri "okusun," "versin." gold-ink kalın; paralel satırlar.
- **Alt:** gerçek logo (v4-dark), ortalı, 300 px.
- **Boşluklar (ölçüm):** pill→soru 208 px, soru→ayraç 68 px, ayraç→cevap 68 px, cevap→logo 205 px. Soru/ayraç/cevap boşlukları optik eşit; üst ve alt boşluk ≈ eşit.
- Yan marj sol 96 / sağ 98; sağ üst 160×160 boş; JPG 0,14 MB.
