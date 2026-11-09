// DOM tabanlı doğrulama (her 0,5 sn): (c) en küçük metin, (d) puan satırı hizası, (e) başlık→içerik 48 px,
// (f) güvenli alan, (g) cihaz boyutu/konumu, panel etiket→çubuk boşluğu, CTA ekseni ve aralıkları.
// Kullanım: node probe.js  → out/probe.json + konsol özeti; ihlal varsa çıkış kodu 1
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const tf = path.join(__dirname, 'audio', 'timing.json');
  const TIMING = process.argv.includes('--music-only') || !fs.existsSync(tf) ? null : JSON.parse(fs.readFileSync(tf, 'utf8')).scenes;
  if (TIMING) await p.addInitScript(t => { window.TIMING = t; }, TIMING);
  const END = TIMING ? TIMING.END : 20;
  await p.goto('file://' + path.join(__dirname, 'reel.html')); await p.evaluate(() => window.ready());
  const res = [];
  for (let t = 0; t < END; t = Math.round((t + 0.5) * 10) / 10) {
    res.push(await p.evaluate(t => {
      render(t);
      const shown = el => { for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || +cs.opacity < 0.05) return false; } return true; };
      const R = el => el.getBoundingClientRect();
      const out = { t, issues: [] };
      // (c) en küçük metin (cihaz içi dahil; ölçek dönüşümü hesaba katılır)
      let min = 1e9, who = '';
      const walk = el => { for (const n of el.childNodes) {
        if (n.nodeType === 3 && n.textContent.trim()) { const e = n.parentElement; if (!shown(e)) continue; const r = R(e); if (r.bottom < 0 || r.top > 1920 || r.right < 0 || r.left > 1080) continue;
          const px = parseFloat(getComputedStyle(e).fontSize) * (r.height / (e.offsetHeight || r.height)); if (px < min) { min = px; who = n.textContent.trim().slice(0, 28); } }
        else if (n.nodeType === 1) walk(n); } };
      walk(document.getElementById('stage'));
      out.minText = Math.round(min * 10) / 10; out.minWho = who; if (min < 36 - 0.01) out.issues.push(`metin ${out.minText}px "${who}"`);
      // aktif başlık ve içerik
      const title = [...document.querySelectorAll('.title')].find(shown);
      const contentIds = ['phone', 'mail', 'tabs', 'ctaCol'];
      const content = contentIds.map(id => document.getElementById(id)).find(shown);
      if (title && content) {
        const span = title.querySelector('span'); const gap = R(content).top - R(span).bottom;
        out.gap = Math.round(gap * 10) / 10;
        // başlık giriş hareketi (ilk 0,3 sn) dışında 48 px olmalı
        const settled = !String(title.style.transform).match(/translateY\((?!0px)[\d.]+px\)/);
        if (settled && Math.abs(gap - 48) > 1) out.issues.push(`başlık→içerik ${out.gap}px`);
        const lines = Math.round(R(span).height / (56 * 1.2)); if (lines > 2) out.issues.push(`başlık ${lines} satır`);
      }
      // (f) güvenli alan: görünen ana öğeler y 270–1580, x 120–960
      for (const id of ['tA', 'tB', 'tC', 'tD', 'tE', 'phone', 'mail', 'mailNote', 'tabs', 'rcard', 'ctaLogo', 'ctaValue', 'ctaDm', 'ctaHandle']) {
        const el = document.getElementById(id); if (!shown(el)) continue; const r = R(el.classList.contains('title') ? el.querySelector('span') : el);
        if (r.top < 270 - .5 || r.bottom > 1580 + .5 || r.left < 120 - .5 || r.right > 960 + .5) out.issues.push(`güvenli alan: ${id} ${Math.round(r.left)},${Math.round(r.top)}–${Math.round(r.right)},${Math.round(r.bottom)}`);
      }
      // (g) cihaz boyutu/konumu
      const ph = document.getElementById('phone');
      if (shown(ph)) { const r = R(ph); out.device = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join(',');
        if (out.device !== '120,482,840,1040') out.issues.push(`cihaz ${out.device}`);
        // (d) puan satırları: etiket sarılmamış, yıldızlar aynı x, satır 120 px
        const rows = [...document.querySelectorAll('#rateCard .rrow')];
        const xs = rows.map(r => Math.round(R(r.querySelector('svg')).left)); const hs = rows.map(r => Math.round(R(r).height));
        const wrap = rows.some(r => { const l = r.querySelector('.l'); return l.scrollWidth > 360 || R(l).height > 38 * 1.2 + 1; });
        const st = rows[0].querySelectorAll('svg'); const sz = Math.round(R(st[0]).width), gp = Math.round(R(st[1]).left - R(st[0]).right);
        out.rows = { x: [...new Set(xs)], h: [...new Set(hs)], star: sz, gap: gp, wrap };
        if (new Set(xs).size > 1 || hs.some(h => h !== 120) || wrap || sz !== 64 || gp !== 8) out.issues.push('puan satırı hizası ' + JSON.stringify(out.rows));
      }
      // panel: "Fiyat / Performans" etiketi ile çubuk arası ≥16 px
      if (shown(document.getElementById('rcard'))) {
        const crs = [...document.querySelectorAll('#crit .cr')];
        out.labelBarGap = Math.min(...crs.map(c => { const rg = document.createRange(); rg.selectNodeContents(c.querySelector('span')); return R(c.querySelector('.bar')).left - rg.getBoundingClientRect().right; }));
        if (out.labelBarGap < 16) out.issues.push(`etiket→çubuk ${out.labelBarGap}px`);
      }
      // CTA: tek eksen + 48 px aralık
      if (shown(document.getElementById('ctaCol'))) {
        const els = ['ctaLogo', 'ctaValue', 'ctaDm', 'ctaHandle'].map(id => R(document.getElementById(id)));
        const cx = els.map(r => Math.round(r.left + r.width / 2)); const gaps = els.slice(1).map((r, i) => Math.round(r.top - els[i].bottom));
        out.cta = { cx: [...new Set(cx)], gaps };
        if (new Set(cx).size > 1 || gaps.some(g => Math.abs(g - 48) > 1)) out.issues.push('CTA ' + JSON.stringify(out.cta));
      }
      return out;
    }, t));
  }
  fs.writeFileSync(path.join(__dirname, 'out', 'probe.json'), JSON.stringify(res, null, 1));
  const bad = res.filter(r => r.issues.length);
  console.log('en küçük metin:', Math.min(...res.map(r => r.minText)), 'px');
  console.log('başlık→içerik boşlukları:', [...new Set(res.filter(r => r.gap != null).map(r => r.gap))].join(', '));
  console.log('cihaz:', [...new Set(res.filter(r => r.device).map(r => r.device))].join(' | '));
  const rr = res.find(r => r.rows); console.log('puan satırları:', JSON.stringify(rr && rr.rows));
  console.log('etiket→çubuk min:', Math.min(...res.filter(r => r.labelBarGap != null).map(r => r.labelBarGap)).toFixed(1), 'px');
  console.log('CTA:', JSON.stringify((res.find(r => r.cta) || {}).cta));
  for (const r of bad) console.log('HATA', r.t, r.issues.join(' ; '));
  console.log(bad.length ? `${bad.length} karede ihlal` : 'DOM kontrolleri: ihlal yok');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
