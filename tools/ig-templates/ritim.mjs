// node ritim.mjs plan/grid-plan.json — 3 kolonlu gridde yatay/dikey komşu iki görsel aynı aile ya da aynı zemin tonu (koyu–koyu, krem–krem) ise UYARIR; en az çakışmalı yeni sıralama önerir.
import fs from 'node:fs'; import path from 'node:path'; import { DIR } from './srv.mjs';
const KOL = 3;
export function cakismalar(sira) { const c = []; sira.forEach((a, i) => { const sag = (i % KOL < KOL - 1) ? sira[i + 1] : null, alt = sira[i + KOL];
  for (const [b, yon] of [[sag, 'yatay'], [alt, 'dikey']]) { if (!b) continue; const j = yon === 'yatay' ? i + 1 : i + KOL; if (a.aile === b.aile) c.push({ yon, a: a.id, b: b.id, neden: 'aynı aile: ' + a.aile, konum: [i, j] }); if (a.zemin === b.zemin) c.push({ yon, a: a.id, b: b.id, neden: 'aynı zemin tonu: ' + a.zemin, konum: [i, j] }); } }); return c; }
const yeniCakisma = (sira, ny) => cakismalar(sira).filter((k) => k.konum[0] < ny || k.konum[1] < ny);   // en az bir ucu yeni görsel olan çakışmalar (eski grid değiştirilemez)
export function oner(yeni, mevcut) {    // en yeni içerik üstte; mevcut grid altta sabit; yeni öğelerin sırasını brute-force/dallan-budak ile en aza indir
  const n = yeni.length; let en = { skor: 1e9, sira: yeni }; const kul = Array(n).fill(false); const cur = [];
  const rec = () => { if (cur.length === n) { const s = yeniCakisma([...cur, ...mevcut], n).length; if (s < en.skor) en = { skor: s, sira: [...cur] }; return; }
    for (let i = 0; i < n; i++) if (!kul[i]) { kul[i] = true; cur.push(yeni[i]); if (yeniCakisma(cur, n).length < en.skor) rec(); cur.pop(); kul[i] = false; } };
  rec(); return en; }
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const plan = JSON.parse(fs.readFileSync(process.argv[2] || path.join(DIR, 'plan', 'grid-plan.json'), 'utf8')); const sira = [...plan.yeni, ...plan.mevcut]; const c = yeniCakisma(sira, plan.yeni.length); const eskiC = cakismalar(sira).length - c.length;
  const satir = (s) => { const out = []; for (let i = 0; i < s.length; i += KOL) out.push(s.slice(i, i + KOL).map((x) => `${x.id}(${x.zemin},${x.aile})`).join('  |  ')); return out.join('\n'); };
  console.log('MEVCUT PLAN (yeni → eski):\n' + satir(sira)); console.log(c.length ? `\nUYARI: yeni görsellerle ilgili ${c.length} çakışma (mevcut grid'deki ${eskiC} çakışma değiştirilemez, sayılmadı)` : '\nÇakışma yok'); for (const k of c) console.log(`  ⚠ ${k.yon}: ${k.a} ↔ ${k.b} — ${k.neden}`);
  const o = oner(plan.yeni, plan.mevcut); console.log(`\nÖNERİLEN SIRA (çakışma ${o.skor}):\n` + satir([...o.sira, ...plan.mevcut])); console.log('  yeni sıra: ' + o.sira.map((x) => x.id).join(' → '));
  fs.writeFileSync(path.join(DIR, 'out', 'ritim-oneri.json'), JSON.stringify({ mevcutCakisma: c, oneriSkor: o.skor, oneri: o.sira.map((x) => x.id), uyari: c.length }, null, 1)); process.exit(c.length ? 1 : 0);
}
