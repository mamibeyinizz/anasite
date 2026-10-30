#!/usr/bin/env node
/**
 * /iletisim/ kalite kontrolü:  node iletisim/qa.mjs
 * Statik bağlantı ve tek H1 kontrolü her zaman çalışır.
 * Tarayıcı kontrolleri Playwright + sistem Chrome varsa çalışır.
 */
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const html = fs.readFileSync(path.join(here, "index.html"), "utf8");
const WIDTHS = [320, 360, 390, 561, 600, 768, 900, 901, 1024, 1366, 1440, 1920];
let pass = 0;
let failN = 0;
const check = (ok, name, detail) => {
  if (ok) pass += 1;
  else {
    failN += 1;
    console.error(`FAIL: ${name}${detail ? " — " + detail : ""}`);
  }
};

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
check((html.match(/<h1[\s>]/g) || []).length === 1, "tek h1");
check(dup.length === 0, "yinelenen id yok", dup.join(","));
check(html.includes('href="tel:+905422043587"'), "telefon bağlantısı");
check(html.includes("0542 204 35 87"), "telefon metni");
check(html.includes("mailto:muhammedulusoyresmi@gmail.com"), "e-posta bağlantısı");
check(html.includes("muhammedulusoyresmi@gmail.com"), "e-posta metni");
check(!/whatsapp|wa\.me/i.test(html), "uydurma WhatsApp yok");
check(!/href="#"/.test(html), 'href="#" yok');
check(html.includes('src="iletisim.js"'), "form betiği bağlı");
check(html.includes("demo menüleri Canlı Menü sayfasında"), "canlı menü notu");
check(html.includes("Bu düğme mesajı bize ulaştırmaz"), "mailto sınırı yazılı");
check(/name="consent"[^>]*required/.test(html), "yanıtlama onayı zorunlu");
check(!/id="qrmo-contact-marketing"[^>]*required/.test(html), "pazarlama onayı zorunlu değil");
check(html.includes("QRMO:HEADER:END") && html.includes("QRMO:FOOTER:END"), "global işaretçiler duruyor");
check(html.includes('rel="canonical" href="https://qrmenuofficial.com/iletisim/"'), "canonical");
check(html.includes('property="og:title" content="İletişim | QR Menu Official"'), "og:title");
check(html.includes('"@type":"ContactPage"'), "yapılandırılmış veri ContactPage");
check(/id="qrmo-contact-form"[^>]*aria-labelledby="qrmo-contact-form-title"/.test(html), "form aria-labelledby");
check(html.includes('maxlength="600"') && html.includes("qrmo-contact-message-count"), "mesaj sınırı ve sayaç");
check((html.match(/<h2[\s>]/g) || []).length >= 3, "h2 hiyerarşisi");
check((html.match(/class="qrmo-contact-guide-card"/g) || []).length === 3, "üç karar kartı");
check(html.includes('href="../paketler/"') && html.includes("Paketleri incele"), "paketler kartı");
check(html.includes('href="../moduller/"') && html.includes("Çözümleri keşfet"), "çözümler kartı");
check(html.includes('href="../sss/"') && html.includes("Soruların yanıtlarını gör"), "sss kartı");
check(!html.includes("Talep formuna geç") && !html.includes('href="#talep"'), "hero talep bağlantısı yok");
check((html.match(/Bizi arayın/g) || []).length === 2, "telefon CTA metni");
check((html.match(/E-posta gönderin/g) || []).length === 2, "e-posta CTA metni");
check(!html.includes("Aramayı başlat") && !html.includes("E-posta yaz"), "eski kanal CTA yok");
check(!fs.readFileSync(path.join(here, "iletisim.css"), "utf8").includes("#7F6419"), "kahverengi gold-ink yok");

for (const href of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1])) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
  let target = path.resolve(here, href);
  if (href.endsWith("/")) target = path.join(target, "index.html");
  check(target.startsWith(root) && fs.existsSync(target), `bağlantı ${href}`, target);
}

function serve() {
  const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".svg": "image/svg+xml" };
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent(req.url.split("?")[0]);
      if (urlPath.endsWith("/")) urlPath += "index.html";
      const file = path.join(root, urlPath);
      if (!file.startsWith(root)) {
        res.writeHead(404);
        return res.end("nf");
      }
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404);
          return res.end("nf");
        }
        res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch { /* yerel kurulum yok */ }
  const bundled = process.env.PLAYWRIGHT_PATH;
  if (bundled && fs.existsSync(bundled)) return import(bundled);
  return null;
}

const pw = await loadPlaywright();
if (!pw) {
  console.warn("Playwright yok; tarayıcı kontrolleri atlandı.");
} else {
  const chrome = ["/usr/local/bin/google-chrome", process.env.CHROME_PATH].find((p) => p && fs.existsSync(p));
  const browser = await pw.chromium.launch({
    executablePath: chrome,
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  const { server, port } = await serve();
  const shotDir = "/tmp/iletisim-qa";
  fs.mkdirSync(shotDir, { recursive: true });
  try {
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const errors = [];
      page.on("pageerror", (err) => errors.push(String(err)));
      page.on("response", (res) => {
        if (res.status() < 400) return;
        if (/favicon\.ico/.test(res.url())) return;
        errors.push(`${res.status()} ${res.url()}`);
      });
      await page.goto(`http://127.0.0.1:${port}/iletisim/`, { waitUntil: "networkidle" });
      const result = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const main = document.querySelector("main.qrmo-contact");
        const h1 = document.querySelector("h1");
        const form = document.getElementById("qrmo-contact-form");
        const panel = document.getElementById("talep");
        const aside = [...document.querySelectorAll(".qrmo-contact-aside")].find((el) => getComputedStyle(el).display !== "none");
        const controls = [...main.querySelectorAll("a, button, input, select, textarea")];
        const small = [];
        controls.forEach((el) => {
          const style = getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") return;
          const target = el.matches('input[type="checkbox"]') ? el.closest("label") || el : el;
          const box = target.getBoundingClientRect();
          if (!box.width || !box.height) return;
          if (box.height < 43.5 || box.width < 24) small.push(`${el.id || el.textContent.trim().slice(0, 28)} ${Math.round(box.width)}x${Math.round(box.height)}`);
        });
        const inner = document.querySelector(".qrmo-contact-inner");
        const panelBox = panel.getBoundingClientRect();
        const asideBox = aside.getBoundingClientRect();
        const split = vw >= 1000 ? asideBox.left > panelBox.right - 2 : asideBox.top < panelBox.top;
        const edge = (el) => {
          const b = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return {
            left: Math.round((b.left + parseFloat(s.paddingLeft)) * 10) / 10,
            right: Math.round((b.right - parseFloat(s.paddingRight)) * 10) / 10
          };
        };
        const contact = edge(inner);
        const footer = edge(document.querySelector(".qrmo-gf-in"));
        const header = edge(document.querySelector(".qrmo-gh-in"));
        const guide = document.getElementById("qrmo-contact-guide-title").getBoundingClientRect().left;
        const cards = [...document.querySelectorAll(".qrmo-contact-guide-card")].map((el) => el.getBoundingClientRect());
        const cardTops = cards.map((b) => Math.round(b.top));
        const stacked = cards.length === 3 && cardTops[1] > cardTops[0] + 20 && cardTops[2] > cardTops[1] + 20;
        const threeCol = cards.length === 3 && Math.abs(cardTops[0] - cardTops[1]) <= 2 && Math.abs(cardTops[1] - cardTops[2]) <= 2;
        return {
          overflow: document.documentElement.scrollWidth - vw,
          h1: h1 ? h1.textContent.trim() : "",
          h1Count: document.querySelectorAll("h1").length,
          split,
          small: small.slice(0, 8),
          gutter: inner ? Math.round(parseFloat(getComputedStyle(inner).paddingLeft)) : 0,
          h1Size: h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : 0,
          contactLeft: contact.left,
          contactRight: contact.right,
          headerLeft: header.left,
          headerRight: header.right,
          footerLeft: footer.left,
          footerRight: footer.right,
          h1Left: h1 ? Math.round(h1.getBoundingClientRect().left * 10) / 10 : 0,
          formLeft: Math.round(panelBox.left * 10) / 10,
          guideLeft: Math.round(guide * 10) / 10,
          cardCount: cards.length,
          cardLayout: vw >= 1000 ? threeCol : stacked,
          firstCardLeft: cards[0] ? Math.round(cards[0].left * 10) / 10 : 0,
          lastCardRight: cards[2] ? Math.round(cards[2].right * 10) / 10 : 0
        };
      });
      check(errors.length === 0, `@${width} konsol hatası yok`, errors.join(" | "));
      check(result.overflow <= 1, `@${width} yatay taşma yok`, `${result.overflow}px`);
      check(result.h1Count === 1, `@${width} tek h1`);
      check(result.split, `@${width} sütun düzeni`, `split=${result.split}`);
      check(result.small.length === 0, `@${width} küçük hedef yok`, result.small.join("; "));
      if (width <= 360) check(result.gutter === 16, `@${width} oluk 16px`, String(result.gutter));
      else if (width < 561) check(result.gutter === 20, `@${width} oluk 20px`, String(result.gutter));
      else check(Math.abs(result.gutter - Math.round(width * 0.05)) <= 1, `@${width} oluk 5vw`, String(result.gutter));
      check(Math.abs(result.h1Left - result.contactLeft) <= 1, `@${width} h1 sol ızgara`, `${result.h1Left}/${result.contactLeft}`);
      check(Math.abs(result.formLeft - result.contactLeft) <= 1, `@${width} form sol ızgara`, `${result.formLeft}/${result.contactLeft}`);
      check(Math.abs(result.guideLeft - result.contactLeft) <= 1, `@${width} karar sol ızgara`, `${result.guideLeft}/${result.contactLeft}`);
      check(result.cardCount === 3, `@${width} üç karar kartı`, String(result.cardCount));
      check(result.cardLayout, `@${width} karar kart düzeni`);
      check(Math.abs(result.firstCardLeft - result.contactLeft) <= 1, `@${width} ilk kart sol`, `${result.firstCardLeft}/${result.contactLeft}`);
      check(Math.abs(result.lastCardRight - result.contactRight) <= 1, `@${width} son kart sağ`, `${result.lastCardRight}/${result.contactRight}`);
      check(Math.abs(result.contactLeft - result.footerLeft) <= 1, `@${width} footer sol hizası`, `${result.contactLeft}/${result.footerLeft}`);
      check(Math.abs(result.contactRight - result.footerRight) <= 1, `@${width} footer sağ hizası`, `${result.contactRight}/${result.footerRight}`);
      if (width >= 561) {
        check(Math.abs(result.contactLeft - result.headerLeft) <= 1, `@${width} header sol hizası`, `${result.contactLeft}/${result.headerLeft}`);
        check(Math.abs(result.contactRight - result.headerRight) <= 1, `@${width} header sağ hizası`, `${result.contactRight}/${result.headerRight}`);
      }
      console.log(`@${width} içerik sol/sağ: iletişim ${result.contactLeft}/${result.contactRight} · header ${result.headerLeft}/${result.headerRight} · footer ${result.footerLeft}/${result.footerRight} · oluk ${result.gutter}px`);
      if (width < 901) check(result.h1Size >= 32 && result.h1Size <= 40, `@${width} h1 boyutu`, String(result.h1Size));
      else check(result.h1Size >= 48 && result.h1Size <= 64, `@${width} h1 boyutu`, String(result.h1Size));
      await page.screenshot({ path: path.join(shotDir, `iletisim-${width}.png`), fullPage: true });
      await page.close();
    }

    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      permissions: ["clipboard-read", "clipboard-write"]
    });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${port}/iletisim/`, { waitUntil: "networkidle" });
    await page.click("#qrmo-contact-submit");
    const emptyErrors = await page.locator(".qrmo-contact-error:not([hidden])").count();
    check(emptyErrors >= 5, "boş gönderimde alan hataları", String(emptyErrors));
    check(await page.locator("#qrmo-contact-status").innerText() === "", "boş gönderimde başarı yok");
    await page.waitForFunction(() => document.activeElement.id === "qrmo-contact-name");
    const focused = await page.evaluate(() => document.activeElement.id);
    check(focused === "qrmo-contact-name", "ilk hatalı alana odak", focused);

    await page.fill("#qrmo-contact-name", "A");
    await page.fill("#qrmo-contact-business", "Kafe");
    await page.fill("#qrmo-contact-phone", "123");
    await page.fill("#qrmo-contact-email", "yanlis");
    await page.selectOption("#qrmo-contact-topic", "paketler");
    await page.fill("#qrmo-contact-message", "kısa");
    const countAfterShort = await page.locator(".qrmo-contact-count-num").innerText();
    check(countAfterShort === "4", "mesaj karakter sayacı", countAfterShort);
    await page.click("#qrmo-contact-submit");
    check((await page.locator("#qrmo-contact-phone-error").innerText()).includes("10 ile 15"), "telefon hatası");
    check((await page.locator("#qrmo-contact-email-error").innerText()).length > 0, "e-posta hatası");
    check((await page.locator("#qrmo-contact-message-error").innerText()).includes("10 karakter"), "mesaj hatası");
    check(await page.locator("#qrmo-contact-status h3").count() === 0, "hatalı veride taslak yok");

    await page.fill("#qrmo-contact-name", "Ayşe Yılmaz");
    await page.fill("#qrmo-contact-business", "Yılmaz Kafe");
    await page.fill("#qrmo-contact-phone", "0542 204 35 87");
    await page.fill("#qrmo-contact-email", "ayse@ornek.com");
    await page.selectOption("#qrmo-contact-type", "kafe");
    await page.selectOption("#qrmo-contact-topic", "paketler");
    await page.fill("#qrmo-contact-message", "Üç masalık kafe için paketleri birlikte değerlendirmek istiyorum.");
    await page.check("#qrmo-contact-consent");
    await page.click("#qrmo-contact-submit");
    await page.waitForSelector("#qrmo-contact-status-title");
    const statusText = await page.locator("#qrmo-contact-status").innerText();
    check(statusText.includes("E-posta taslağı hazır"), "taslak başlığı");
    check(statusText.includes("siz gönderene kadar bize ulaşmaz"), "ulaştığı iddia edilmiyor");
    check(!(/mesajınız (bize )?ulaştı|gönderildi/i.test(statusText)), "sahte başarı yok");
    const draft = await page.locator(".qrmo-contact-draft").innerText();
    check(draft.includes("muhammedulusoyresmi@gmail.com"), "taslakta alıcı");
    check(draft.includes("Yılmaz Kafe"), "taslakta işletme");
    check(draft.includes("Paketler ve fiyatlar"), "taslakta konu");
    check(draft.includes("Ürün duyurusu: İstemiyor"), "pazarlama izni varsayılan değil");
    const mailto = await page.getAttribute("#qrmo-contact-form", "data-draft-url");
    check(Boolean(mailto && mailto.startsWith("mailto:muhammedulusoyresmi@gmail.com?")), "mailto adresi hazır", (mailto || "").slice(0, 120));
    check(mailto.includes(encodeURIComponent("Yılmaz Kafe")), "mailto gövdesinde işletme");
    check(mailto.includes(encodeURIComponent("Paketler ve fiyatlar")), "mailto konusunda seçim");

    await page.fill("#qrmo-contact-message", "ğ".repeat(590) + "|QA_COPY|");
    await page.click("#qrmo-contact-submit");
    await page.waitForSelector("#qrmo-contact-status-title");
    const copyTitle = await page.locator("#qrmo-contact-status-title").innerText();
    const copyDraft = await page.locator(".qrmo-contact-draft").innerText();
    const copyUrlLen = (await page.getAttribute("#qrmo-contact-form", "data-draft-url") || "").length;
    check(copyTitle.includes("kendiniz göndermeniz"), "uzun kodlama kopyalama modu", copyTitle);
    check(copyUrlLen > 1800, "mailto 1800 üstü", String(copyUrlLen));
    check(copyDraft.includes("|QA_COPY|"), "kopyalama modunda taslak tam");
    check((await page.inputValue("#qrmo-contact-message")).includes("|QA_COPY|"), "form metni korunur");

    await page.click(".qrmo-contact-copy");
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    check(copied.includes("Yılmaz Kafe"), "kopyalama");

    const burger = page.locator(".qrmo-gh-burger");
    await burger.click();
    check(await burger.getAttribute("aria-expanded") === "true", "mobil menü açıldı");
    await page.keyboard.press("Escape");
    check(await burger.getAttribute("aria-expanded") === "false", "mobil menü kapandı");
    await page.locator(".qrmo-contact-aside--stack a[href='tel:+905422043587']").focus();
    await page.keyboard.press("Tab");
    const mobileNext = await page.evaluate(() => document.activeElement.getAttribute("href"));
    check(mobileNext === "mailto:muhammedulusoyresmi@gmail.com", "mobilde sekme e-posta kartına gider", mobileNext);
    await context.close();

    const desk = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const deskPage = await desk.newPage();
    await deskPage.goto(`http://127.0.0.1:${port}/iletisim/`, { waitUntil: "load" });
    const phoneCard = deskPage.locator('.qrmo-contact-aside--rail a[href="tel:+905422043587"]');
    const loadRing = await phoneCard.evaluate((el) => ({
      active: document.activeElement === el,
      style: getComputedStyle(el).outlineStyle
    }));
    check(!loadRing.active && loadRing.style === "none", "yüklemede telefon odağı yok", JSON.stringify(loadRing));
    await deskPage.locator("#qrmo-contact-submit").focus();
    await deskPage.keyboard.press("Tab");
    const keyRing = await phoneCard.evaluate((el) => ({
      active: document.activeElement === el,
      focusVisible: el.matches(":focus-visible"),
      style: getComputedStyle(el).outlineStyle
    }));
    check(keyRing.active && keyRing.focusVisible && keyRing.style === "solid", "klavye odağında telefon çerçevesi var", JSON.stringify(keyRing));
    await deskPage.locator("#qrmo-contact-submit").evaluate((el) => el.focus());
    await phoneCard.evaluate((el) => {
      el.addEventListener("click", (event) => event.preventDefault(), { once: true });
    });
    await phoneCard.click();
    const mouseRing = await phoneCard.evaluate((el) => ({
      focusVisible: el.matches(":focus-visible"),
      style: getComputedStyle(el).outlineStyle
    }));
    check(!mouseRing.focusVisible && mouseRing.style === "none", "fare tıklamasında telefon çerçevesi yok", JSON.stringify(mouseRing));
    await deskPage.evaluate(() => {
      const panel = document.getElementById("talep");
      panel.setAttribute("tabindex", "-1");
      panel.focus();
    });
    await deskPage.keyboard.press("Tab");
    const deskNext = await deskPage.evaluate(() => document.activeElement.id);
    check(deskNext === "qrmo-contact-name", "masaüstünde sekme forma gider", deskNext);
    const visibleAsides = await deskPage.locator(".qrmo-contact-aside").evaluateAll((els) => els.filter((el) => getComputedStyle(el).display !== "none").length);
    check(visibleAsides === 1, "masaüstünde tek iletişim sütunu", String(visibleAsides));
    const railHidden = await deskPage.locator('[data-qrmo-contact-aside="rail"]').getAttribute("aria-hidden");
    check(railHidden === "false", "masaüstünde rail erişilebilir", railHidden);
    const liveHref = await deskPage.locator(".qrmo-gh-nav a", { hasText: "Canlı Menüyü Gör" }).getAttribute("href");
    check(liveHref === "../canli-menu/", "Canlı Menüyü Gör /canli-menu/ adresine gider", liveHref);
    await desk.close();
  } finally {
    await browser.close();
    server.close();
  }
}

console.log(`iletisim qa: ${pass} geçti, ${failN} kaldı`);
if (failN) process.exit(1);
