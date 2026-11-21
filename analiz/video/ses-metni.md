# Ses metni v3 — Çoklu Dil Reels (restoran sahibine, ~28 sn)

İzleyici: restoran/kafe sahibi. Anlatım "siz" diliyle, turist değil işletme sahibinin gözünden. Akış `CONTENT_STRATEGY §4`: problem → acı → etki → çözüm → özellik → fayda → kanıt → CTA.
Sessiz izleme varsayımı: her cümle ekranda yazılı da görünür. Yasak: "yapay zeka/AI", yüzde/oran, "anında", "devrim", "ücretsiz", "sınırsız".

| # | Süre | Aşama | Ses | Ekran (yazı + görüntü) |
|---|---|---|---|---|
| 1 | 0–2,5 | Hook / problem | "Yabancı misafir geldi. Menüyü kim anlatacak?" | Yazı: aynı cümle, büyük. 3D: menü kartı masaya düşer, belirsiz turist silueti |
| 2 | 2,5–8 | Acı + etki | "Garsonunuz tercümana dönüşüyor, diğer masalar bekliyor. Anlamayan misafir de sormaya çekinir." | 3D: garson siluet el kol hareketi, 2 masa soluklaşır; misafir menüye bakıp geri çekilir |
| 3 | 8–10 | Dönüş | "Çözüm menünün kendisinde." | Hızlı kamera geçişi, telefon belirir |
| 4 | 10–17 | Çözüm (kanıt: gerçek ekran) | "Misafir QR'ı okutur, dilini seçer. Ürün adı, açıklama, kategori, hepsi kendi dilinde açılır." | 3D telefon, gerçek demo ekranları: dil seçici → TR → EN → DE → FR. Rozet: "Gerçek demo menü" |
| 5 | 17–23 | Özellik / modül | "Bu, Çoklu Dil modülü. Dilleri siz tanımlarsınız. Çevirileri elle ya da CSV ile girersiniz. Otuz dile kadar." | Panel ekranı (Diller & Çeviriler) ya da tipografi: "Elle · CSV · 30 dile kadar" |
| 6 | 23–28 | Fayda + CTA | "Garsonunuz servise dönsün. Aynı menüyü kendi telefonunuzda deneyin, dil seçiciyi siz değiştirin. Bağlantı profilimizde." | Yazı: "Canlı menüyü telefonunuzda deneyin" + yazılı adres `qrmenuofficial.com/canli-menu`; yukarı-sol ok profile işaret eder; logo; son kare ilk kareye geçer |

Düz metin: Yabancı misafir geldi. Menüyü kim anlatacak? Garsonunuz tercümana dönüşüyor, diğer masalar bekliyor. Anlamayan misafir de sormaya çekinir. Çözüm menünün kendisinde. Misafir QR'ı okutur, dilini seçer. Ürün adı, açıklama, kategori, hepsi kendi dilinde açılır. Bu, Çoklu Dil modülü. Dilleri siz tanımlarsınız. Çevirileri elle ya da CSV ile girersiniz. Otuz dile kadar. Garsonunuz servise dönsün. Aynı menüyü kendi telefonunuzda deneyin, dil seçiciyi siz değiştirin. Bağlantı profilimizde.

Kelime: ~72 (≈28 sn, 2,5 kelime/sn).

Doğrulama:
- Ürün adı/açıklama/kategori/rozet/arayüz çevirisi: demo ekran görüntüleri (`04-menu-en.png`) [Kesin].
- Elle/CSV ve 30 dil: `qr-ceviri` kodu, `llms.txt` [Kesin]. Harici çeviri API'si yok.
- "Anlamayan misafir sormaya çekinir": genel gözlem, ölçüm değil [Muhtemel]; sayı yok.
- Not: demo menüde yalnızca TR/EN/DE/FR açık; ekranda 30 dil gösterilmez.

A/B hook alternatifleri (ilk 2,5 sn): (A) "Yabancı misafir geldi. Menüyü kim anlatacak?" · (B) "Garsonunuz kaç dilde menü anlatabiliyor?" (B mevcut #13 gönderisinin sorusu; tek başına ölçme için aynı Reels'in iki sürümünü farklı günlerde paylaşın).

---

## CTA v3 — neden değişti, nasıl çalışır

**v2'nin zayıflığı** ("Demo için DM'den 'dil' yazın"):
1. Reels izleyicisinin çoğu takipçi değil (hesap 4 takipçili [Kesin]); markayı tanımayan bir işletme sahibi ilk temasta DM atmaz: sürtünme yüksek.
2. "dil" anahtar sözcüğü neye karşılık geldiğini söylemiyor; DM'e ne cevap verileceği, kimin vereceği, demonun ne olduğu tanımlı değil (`CONTENT_STRATEGY §9`: demo akışı TBD).
3. Kanıt (gerçek ekran) ile istenen eylem (DM) arasında mantık köprüsü yok: izleyici az önce menüyü gördü, şimdi bir yabancıdan ilişki kurmak yerine aynı şeyi kendi elinde denemek ister.

**v3 CTA (tek birincil, §9 uyumlu):** "Aynı menüyü kendi telefonunuzda deneyin, dil seçiciyi siz değiştirin. Bağlantı profilimizde."
- Hedef: `https://qrmenuofficial.com/canli-menu/` ("Menünüz misafirinizin telefonunda böyle açılır", sayfada "Dili değiştirin. Dil seçiciden menüyü başka bir dilde açın." adımı var) [Kesin, `canli-menu/index.html`].
- Düşük risk, anında yapılabilir, ödeme/form/teslim yok; "ücretsiz" sözü verilmiyor.
- Reels'te link tıklanamaz: adres yazılı gösterilir ve eylem "profilimizde" diye yönlendirilir. Bu yüzden önkoşul: profil linkinin ilk sırası canlı menü olmalı.

**İkincil (sadece caption ve sabit yorum, sesli değil):** "Kendi menünüzde nasıl görüneceğini görmek isterseniz DM'den 'menü' yazın."

**Önkoşullar**
1. Profil linkini (Instagram'da ilk bağlantı) şu adrese ayarlayın: `https://qrmenuofficial.com/canli-menu/?utm_source=instagram&utm_medium=reels&utm_campaign=coklu-dil`. (UTM yoksa tıklama kaynağı site tarafında ayırt edilemez.)
2. Demo menü, videoda görünenle uyumlu olsun: videodaki ekranlar `plus.qrmenuofficial.com`'dan alındı; canlı menü sayfası `temel/test/full` alt alan adlarına gidiyor. Dil seçici görüntüsü tutarsa devam edin, tutmazsa çekimi canlı menüde linklenen demodan (`temel.qrmenuofficial.com`, Çoklu Dil Temel pakette) yeniden alın.
3. DM akışı yazılı hâle gelsin (aşağıda şablon). "Ücretsiz" ifadesi, ancak gerçekten ücretsizse kullanılır.

**DM yanıt şablonu ("menü" yazana)**
> Merhaba, ilginiz için teşekkürler. Menünüzü sizin için daha doğru anlatabilmemiz için üç şey soralım: 1) Kaç şubeniz var? 2) Menünüz şu an basılı mı, PDF mi, dijital mi? 3) Hangi dillerde misafir ağırlıyorsunuz? Cevabınıza göre size uygun paketi ve bir gösterim zamanı önerelim.

**Ölçüm (14 gün sonra)** [Tahmin eşikleri; veri yok]: profil bağlantısı tıklaması (Insights), UTM'li oturum sayısı, "menü" DM sayısı. Karar kuralı: ≥10 tıklama ve ≥2 DM → CTA kalır; tıklama var, DM yok → ikincil CTA'yı güçlendir; tıklama <10 → hook'u değil önce profil linki/bio'yu kontrol et.
