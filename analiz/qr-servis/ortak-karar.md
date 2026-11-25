# QR Servis — ChatGPT ile ortak karar
Alınan: "Kim, ne zaman onayladı?" ekseni (hesap verebilirlik), 2. slayt soru mantığı düzeltmesi (evet = acı: "göremiyor musunuz?"), ad "QR Servis", slayt 3 hesap verebilirlik, slayt 4 gerçek ekran özellikleri, slayt 5 kontrol.
Reddedilen/değiştirilen: "kaç dakikada onayladı" (kodda yalnız onay zamanı ve bekleyen çağrının geçen süresi var; onay süresi hesaplanıp gösterilmiyor), yumuşak kapanış ("ihtiyacınız olabilir" → "kontrol sizde değil"), jenerik kapaklar ("Kontrol sizde olsun" tek başına).
Riskli: çok şubeli izolasyon (Firestore kuralları şube sınırlamıyor), ortalama bekleme süresi raporu, anında/%/satış artışı, hesap iste = ödeme.

## Kapak (S1) — ChatGPT turu
ChatGPT önerisi (#11 "Masa bekliyor. Çağrısı garsonun telefonunda.") reddedildi: "Çağrısı" öznesiz/anlam bozuk, v2'nin yeniden dizilmiş hâli; "bizim farklılığımız masa adıyla çağrı" kanıtsız (rakip uygulamalar da yapabilir); 14/15 arasında etiketleme tutarsız. Alınan: acı → çözüm ipucu kalıbı, alt satırda masa adı + sesli bildirim, chip ile kapsam (garson·hesap·sipariş).
Yayınlanan: "Masa çağırdı, garson haberdar olmadı." / "Çağrı garsonun telefonuna masa adıyla, sesli düşer."
