# @qrmenuofficial — Acı noktası görseli: SABİT ŞABLON (birebir aynı olacak)

Karar: Instagram'daki **her modülün acı → avantaj görseli bu tasarımla birebir aynı** üretilir. Referans: `analiz/post1-dil/post1-dil-final.jpg` (Çoklu Dil). Şablon: `tools/ig-aci/sablon.html` — çıktı referansla **piksel piksel aynı** (doğrulandı: fark 0).

## Üretim
`node tools/ig-aci/uret.mjs tools/ig-aci/data/<modul>.json [çıktı-dizini]` → 1080×1440 PNG.
JSON yalnız metin alır: `id`, `modul` (üst şerit), `soru` (satır dizisi), `cevap` (satır dizisi). Vurgu: `[[kelime]]`.
Tasarım değeri (renk, boyut, aralık, arka plan) JSON'da YOK; değiştirilmez.

## DEĞİŞMEZ (bütün modüllerde aynı)
- Tuval 1080×1440 (3:4); zemin düz #EADFC1 + yeşil halka arka planı (sağ kenarda merkezli 7 halka, yeşil ışıma, yeşil yörünge noktaları, sol altta ters halka grubu).
- Yapı: üstte modül adı (sola yaslı, 30 px, harf aralığı .5em, gold-ink #7F6419) → soru (800, otomatik sığdırma 112→80 px, −.035em, koyu yeşil #0D2B22) → kısa altın ayraç (96×4 px, #C9A84C) → cevap (500, 56→44 px, %85 yeşil) → alt orta logo (v4-dark, 300 px).
- Tek sol eksen x=96; yan marj 96; üst/alt kenar 96–104; aralıklar 8 px birim, soru→ayraç ve ayraç→cevap optik eşit (68/68).
- Soruda tek vurgu grubu (gold-ink), cevapta eylem kelimeleri vurgulu (gold-ink, 800).
- YOK: hap etiket ("RESTORAN SAHİBİ İÇİN" vb.), figür, ekran görüntüsü, çip, saydam kelime dekoru, farklı renk/halka varyantı.

## DEĞİŞİR (yalnız metin)
- Modül adı (en çok ~24 karakter, büyük harf; örn. "ÇOKLU DİL MODÜLÜ", "GARSON & HESAP MODÜLÜ").
- Soru: 2–3 satır, her satır ~16 karaktere kadar (en uzun satır 888 px'e sığmalı; sığmazsa şablon küçültür, 80 px altına inerse metni kısalt).
- Cevap: 2–3 satır, paralel yapı, eylem fiilleri vurgulu.

## Metin kuralları (CONTENT_STRATEGY ile uyumlu)
Acı → avantaj sırası; cümleler ürünün gerçekten yaptığıyla sınırlı. Yasak: rakam/yüzde, "AI/yapay zeka", "otomatik çeviri", "ücretsiz", "anında", "devrim", "garantili", "sınırsız".

## Her yeni görselden önce kontrol
1. Referansla aynı yerleşim (marj 96/≈99, ritim 68/68), sağ üst köşe boş.
2. Gold-ink büyük metin kontrastı ≥3:1 (halka üstünde ölçülen 3,99–4,23).
3. Gridde 330 px küçültmede soru okunuyor.
4. Yan yana modül görselleri ardışık aynı rengi tekrar etmeyecek biçimde sıralanır (üçlü sistem: acı · carousel · Reels).
