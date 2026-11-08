// Doğrulama: her 0,5 sn'de görünen metnin efektif en küçük boyutu ve kritik öğelerin güvenli alan sınırları
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'reel.html')); await p.evaluate(() => window.ready());
  const rows = []; let worst = { min: 1e9 };
  for (let t = 0; t < 20; t += 0.5) {
    const r = await p.evaluate(t => { render(t);
      const ids = ['phone', 'mail', 'mailNote', 'tabs', 'rcard', 'ctaTitle', 'ctaPill', 'ctaHandle', 'ctaBenefit', 'logo', 'capA', 'capB', 'capC', 'capD', 'capE'];
      const bad = [];
      for (const id of ids) { const e = document.getElementById(id); let v = true; for (let x = e; x && x.id !== 'stage'; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || +cs.opacity < 0.05) v = false; }
        if (!v) continue; const q = e.getBoundingClientRect(); if (q.width < 1) continue;
        // giriş slide'ı sırasında yatay konum geçicidir; yalnızca dikey sınır + yerleşmiş yatay sınır
        if (q.top < 269 - 0.5 || q.bottom > 1536 + 0.5) bad.push(`${id} y ${Math.round(q.top)}–${Math.round(q.bottom)}`);
        if (q.left < 0 || q.right > 1080) continue;
        if (q.right > 960 + 0.5 || q.left < 120 - 0.5) bad.push(`${id} x ${Math.round(q.left)}–${Math.round(q.right)}`);
      }
      return { ...minTextPx(), bad, cs: CROP_SCALE };
    }, t);
    rows.push([t, r.min, r.who, r.bad.join('; ')]); if (r.min < worst.min) worst = { ...r, t };
  }
  for (const r of rows) console.log(r[0].toFixed(1).padStart(4), String(r[1]).padStart(5), r[2].padEnd(30), r[3] || '');
  const cs = rows.length && (await p.evaluate(() => CROP_SCALE));
  // ekran görüntüsü içi en küçük metin (ölçüldü): "Yemek Lezzeti" büyük harf 32 px → ~45 px yazı; "Telefon" 31 px → ~43 px yazı
  console.log('HTML en küçük metin:', worst.min, 'px', `"${worst.who}"`, '@', worst.t, 's');
  const FS = { star: 45, contact: 43 };
  for (const k in cs) console.log(`telefon içi (${k}) etiket ≈ ${FS[k]} × ${cs[k].toFixed(3)} = ${(FS[k] * cs[k]).toFixed(1)} px`);
  await b.close();
})();
