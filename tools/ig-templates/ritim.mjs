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
// 0 çakışmalı sıra yoksa en büyük alt kümeyi bulur (hangi görsellerin sonraya bırakılacağını söyler)
export function enIyiAltKume(yeni, mevcut) { for (let k = yeni.length; k >= 1; k--) { let en = null; const kom = (arr, n, bas, cur) => { if (en && en.skor === 0) return; if (cur.length === n) { const o = oner(cur, mevcut); if (!en || o.skor < en.skor) en = { ...o, alt: [...cur] }; return; } for (let i = bas; i < arr.length; i++) { cur.push(arr[i]); kom(arr, n, i + 1, cur); cur.pop(); } };
    kom(yeni, k, 0, []); if (en && en.skor === 0) return { ...en, birakilan: yeni.filter((y) => !en.alt.includes(y)).map((y) => y.id) }; } return null; }
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const plan = JSON.parse(fs.readFileSync(process.argv[2] || path.join(DIR, 'plan', 'grid-plan.json'), 'utf8')); const sira = [...plan.yeni, ...plan.mevcut]; const c = yeniCakisma(sira, plan.yeni.length); const eskiC = cakismalar(sira).length - c.length;
  const satir = (s) => { const out = []; for (let i = 0; i < s.length; i += KOL) out.push(s.slice(i, i + KOL).map((x) => `${x.id}(${x.zemin},${x.aile})`).join('  |  ')); return out.join('\n'); };
  console.log('MEVCUT PLAN (yeni → eski):\n' + satir(sira)); console.log(c.length ? `\nUYARI: yeni görsellerle ilgili ${c.length} çakışma (mevcut grid'deki ${eskiC} çakışma değiştirilemez, sayılmadı)` : '\nÇakışma yok'); for (const k of c) console.log(`  ⚠ ${k.yon}: ${k.a} ↔ ${k.b} — ${k.neden}`);
  const o = oner(plan.yeni, plan.mevcut); const alt = o.skor > 0 ? enIyiAltKume(plan.yeni, plan.mevcut) : null; if (alt) console.log(`\n0 çakışmalı alt küme: ${alt.sira.map((x) => x.id).join(' → ')}  (sonraya bırakılan: ${alt.birakilan.join(', ') || '-'})`); console.log(`\nÖNERİLEN SIRA (çakışma ${o.skor}):\n` + satir([...o.sira, ...plan.mevcut])); console.log('  yeni sıra: ' + o.sira.map((x) => x.id).join(' → '));
  { const sirasi = [...o.sira, ...plan.mevcut]; const oc = yeniCakisma(sirasi, plan.yeni.length); const yy = oc.filter((k) => k.konum[1] < plan.yeni.length), ye = oc.filter((k) => k.konum[1] >= plan.yeni.length);
    console.log(`\nÖnerilen sıradaki çakışmalar: yeni↔yeni ${yy.length}, yeni↔mevcut ${ye.length} (mevcut krem karolarla krem–krem: ${ye.filter((k) => /krem/.test(k.neden)).length}, koyu–koyu: ${ye.filter((k) => /koyu/.test(k.neden)).length}, aile: ${ye.filter((k) => /aile/.test(k.neden)).length})`); for (const k of oc) console.log(`  ⚠ ${k.yon}: ${k.a} ↔ ${k.b} — ${k.neden}`);
    if (process.argv.includes('--yaz')) { const pp = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); pp.yeni = o.sira; fs.writeFileSync(process.argv[2], JSON.stringify(pp, null, 1)); console.log('plan yeniden yazıldı: ' + process.argv[2]); }
    fs.writeFileSync(path.join(DIR, 'out', 'v2', 'ritim-oneri.json'), JSON.stringify({ oneriSkor: o.skor, yeniYeni: yy.length, yeniMevcut: ye.length, kremKremMevcutla: ye.filter((k) => /krem/.test(k.neden)).length, oneri: o.sira.map((x) => x.id), mevcutCakisma: c }, null, 1)); process.exit(c.length ? 1 : 0); }
  fs.writeFileSync(path.join(DIR, 'out', 'v2', 'ritim-oneri.json'), JSON.stringify({ mevcutCakisma: c, oneriSkor: o.skor, oneri: (alt ? alt.sira : o.sira).map((x) => x.id), sonrayaBirakilan: alt ? alt.birakilan : [], altKumeSkor: alt ? 0 : o.skor, uyari: c.length }, null, 1)); process.exit(c.length ? 1 : 0);
}
