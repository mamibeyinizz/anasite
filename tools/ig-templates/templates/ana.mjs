// Sayfa girişi: /veri.json + /tokens.json → ilgili aile şablonu → window.__olcum (test için), window.__hata (kural ihlali), window.__hazir.
import * as lib from './lib.mjs';
const T = await (await fetch('/tokens.json')).json(); const V = await (await fetch('/veri.json')).json(); const BOS = location.search.includes('bos=1');
try {
  await Promise.all([800, 700, 500, 400].map((w) => document.fonts.load(`${w} 40px Manrope`, 'ÇĞİÖŞÜçğıöşü'))); await document.fonts.ready;
  const fam = V.aile; const FM = T.formatlar[V.format]; if (!FM) throw new Error('bilinmeyen format: ' + V.format);
  const zemin = fam === 'kanca' ? 'koyu' : fam === 'kanit' ? 'krem' : (V.zemin || 'koyu'); if (!['koyu', 'krem'].includes(zemin)) throw new Error('zemin koyu|krem olmalı');
  if (fam === 'kanit' && V.format !== 'post34') throw new Error('kanit yalnız post34'); if (fam === 'cumle' && V.format !== 'post34') throw new Error('cumle yalnız post34');
  const root = document.getElementById('tuval'); root.className = zemin; Object.assign(root.style, { width: FM.w + 'px', height: FM.h + 'px' });
  const F = { ...FM, ...(FM[fam] || {}), w: FM.w, h: FM.h, yanMarj: FM.yanMarj }; const ctx = { T, V, F, FM, root, zemin, lib };
  let ozel = {};
  if (!BOS) { const mod = await import(`./${fam}.mjs`); ozel = await mod.kur(ctx); }
  await document.fonts.ready;
  // ölçüm
  const metinler = []; const renkler = []; const fontlar = new Set(); const yasakRenk = []; const altCizgili = [];
  for (const e of root.querySelectorAll('*')) { const cs = getComputedStyle(e); fontlar.add(cs.fontFamily.split(',')[0].replace(/"/g, '').trim());
    if (cs.textDecorationLine !== 'none') altCizgili.push(e.className || e.tagName);
    for (const p of ['color', 'borderTopColor', 'backgroundColor']) if (cs[p] === 'rgb(201, 168, 76)') yasakRenk.push(p); }
  for (const e of root.querySelectorAll('.kanca,.hap,.rozet,.chip')) { const cs = getComputedStyle(e); metinler.push(e.textContent); renkler.push({ sinif: e.className, renk: cs.color, rect: lib.rect(e) }); }
  for (const e of root.querySelectorAll('.kanca .v')) { const cs = getComputedStyle(e); renkler.push({ sinif: 'v', renk: cs.color, rect: lib.rect(e) }); }
  const yuklu = [...document.fonts].filter((f) => f.family.replace(/"/g, '') === 'Manrope' && f.status === 'loaded').length;
  window.__olcum = { id: V.id, aile: fam, format: V.format, zemin, w: FM.w, h: FM.h, metinler, renkler, fontlar: [...fontlar], manropeYuklu: yuklu, yasakRenk, altCizgili, fontKontrol: document.fonts.check('800 40px Manrope'), ...ozel };
  window.__hata = null;
} catch (e) { window.__hata = String(e.message || e); }
window.__hazir = true;
