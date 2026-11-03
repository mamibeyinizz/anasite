/* =========================================================
   QR MENU OFFICIAL — /odeme/ BAĞLANTI AYARI (tek dosya)
   Fiyat ve paket içeriği burada DEĞİL, ../paketler/packages-data.js içindedir.

   mode: "test"  → ücret çekilmez, hiçbir veri gönderilmez/saklanmaz; ekranda sahte onay gösterilir.
   mode: "live"  → aşağıdaki iki yöntemden biriyle gerçek ödemeye geçer (önce endpoint, yoksa links):

     A) endpoint  Sunucu uç noktanız. Sayfa POST JSON gönderir:
                  { plan:"pro", period:"monthly"|"annual", customer:{ name, business, email, phone, domain } }
                  Yanıt: { "url": "https://…" } → ziyaretçi bu adrese yönlendirilir (iyzico/PayTR/Stripe checkout oturumu vb.).
     B) links     Sağlayıcının hazır ödeme bağlantıları (Payment Link vb.). Boş olan kombinasyon hata verir.

   UYARI: live + endpoint müşteri bilgisini sunucuya gönderir. Yayına almadan önce
   yasal/legal-data.mjs (gizlilik/KVKK, kullanım şartları) güncellenmeli ve `node yasal/build.mjs` çalıştırılmalıdır.
   ========================================================= */
window.QRMO_CHECKOUT = {
  mode: "test",
  endpoint: "",
  links: {
    temel: { monthly: "", annual: "" },
    pro:   { monthly: "", annual: "" },
    plus:  { monthly: "", annual: "" }
  }
};
