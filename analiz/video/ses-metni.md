# Ses metni v2 — Çoklu Dil Reels (restoran sahibine, ~27 sn)

İzleyici: restoran/kafe sahibi. Anlatım "siz" diliyle, turist değil işletme sahibinin gözünden. Akış `CONTENT_STRATEGY §4`: problem → acı → etki → çözüm → özellik → fayda → kanıt → CTA.
Sessiz izleme varsayımı: her cümle ekranda yazılı da görünür. Yasak: "yapay zeka/AI", yüzde/oran, "anında", "devrim", "ücretsiz", "sınırsız".

| # | Süre | Aşama | Ses | Ekran (yazı + görüntü) |
|---|---|---|---|---|
| 1 | 0–2,5 | Hook / problem | "Yabancı misafir geldi. Menüyü kim anlatacak?" | Yazı: aynı cümle, büyük. 3D: menü kartı masaya düşer, belirsiz turist silueti |
| 2 | 2,5–8 | Acı + etki | "Garsonunuz tercümana dönüşüyor, diğer masalar bekliyor. Anlamayan misafir de sormaya çekinir." | 3D: garson siluet el kol hareketi, 2 masa soluklaşır; misafir menüye bakıp geri çekilir |
| 3 | 8–10 | Dönüş | "Çözüm menünün kendisinde." | Hızlı kamera geçişi, telefon belirir |
| 4 | 10–17 | Çözüm (kanıt: gerçek ekran) | "Misafir QR'ı okutur, dilini seçer. Ürün adı, açıklama, kategori, hepsi kendi dilinde açılır." | 3D telefon, gerçek demo ekranları: dil seçici → TR → EN → DE → FR. Rozet: "Gerçek demo menü" |
| 5 | 17–23 | Özellik / modül | "Bu, Çoklu Dil modülü. Dilleri siz tanımlarsınız. Çevirileri elle ya da CSV ile girersiniz. Otuz dile kadar." | Panel ekranı (Diller & Çeviriler) ya da tipografi: "Elle · CSV · 30 dile kadar" |
| 6 | 23–27 | Fayda + CTA | "Garsonunuz servise dönsün. Demo için DM'den 'dil' yazın." | Logo, "DM: dil", son kare ilk kareye geçer |

Düz metin: Yabancı misafir geldi. Menüyü kim anlatacak? Garsonunuz tercümana dönüşüyor, diğer masalar bekliyor. Anlamayan misafir de sormaya çekinir. Çözüm menünün kendisinde. Misafir QR'ı okutur, dilini seçer. Ürün adı, açıklama, kategori, hepsi kendi dilinde açılır. Bu, Çoklu Dil modülü. Dilleri siz tanımlarsınız. Çevirileri elle ya da CSV ile girersiniz. Otuz dile kadar. Garsonunuz servise dönsün. Demo için DM'den "dil" yazın.

Kelime: ~66 (≈27 sn, 2,4 kelime/sn).

Doğrulama:
- Ürün adı/açıklama/kategori/rozet/arayüz çevirisi: demo ekran görüntüleri (`04-menu-en.png`) [Kesin].
- Elle/CSV ve 30 dil: `qr-ceviri` kodu, `llms.txt` [Kesin]. Harici çeviri API'si yok.
- "Anlamayan misafir sormaya çekinir": genel gözlem, ölçüm değil [Muhtemel]; sayı yok.
- Not: demo menüde yalnızca TR/EN/DE/FR açık; ekranda 30 dil gösterilmez.

A/B hook alternatifleri (ilk 2,5 sn): (A) "Yabancı misafir geldi. Menüyü kim anlatacak?" · (B) "Garsonunuz kaç dilde menü anlatabiliyor?" (B mevcut #13 gönderisinin sorusu; tek başına ölçme için aynı Reels'in iki sürümünü farklı günlerde paylaşın).
