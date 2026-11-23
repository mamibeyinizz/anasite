// v7 testi: güvenli bölge, en küçük metin ≥36, sağ üst 160×160 boş, senkron ≤0,15, metinsiz ≤0,4, CSV vurgusu, easing taraması, kontrast (piksel). Çıktı: out/layout-v7[-kisa].json
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module'; import { spawnSync } from 'node:child_process';
import { baslat, CHROME_ARGS } from './sunucu-v7.mjs'; import { kur } from './timeline.js';
const { chromium } = createRequire(import.meta.url)('playwright'); const DIR = path.dirname(fileURLToPath(import.meta.url)); const OUT = path.resolve(DIR, '..', 'out');
const CUEF = process.env.CUE_DOSYA ? path.resolve(process.env.CUE_DOSYA) : path.join(DIR, '..', 'ses', 'cue.json'); const CUE = JSON.parse(fs.readFileSync(CUEF, 'utf8')); const TL = kur(CUE); const KISA = /kisa/.test(CUEF);
const s = await baslat(); const b = await chromium.launch({ args: CHROME_ARGS, env: { ...process.env, NO_PROXY: '127.0.0.1,localhost' } });
const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 }); let p = await ctx.newPage(); await p.goto(s.URL); await p.waitForFunction('window.hazir===true', null, { timeout: 120000 });
const ihlal = []; const say = {}; const bil = (k, t, a) => { ihlal.push({ kural: k, t: +t.toFixed(2), ...a }); say[k] = (say[k] || 0) + 1; };
const tl = await p.evaluate(() => window.__tl); const alfa = {}; const metinsiz = []; const kon = []; const vurguOrnek = []; let enKucuk = 1e9;
for (let i = 0; i <= Math.floor(TL.SURE / 0.05); i++) { const t = +(i * 0.05).toFixed(2); const d = await p.evaluate((x) => window.__ol(x), t); const og = d.ogeler.filter((o) => o.gorunur);
  for (const o of og) { if (o.id.startsWith('c')) (alfa[o.id] = alfa[o.id] || []).push([t, o.a]); if (o.fs != null && o.a > 0.3) enKucuk = Math.min(enKucuk, o.fs);
    if (o.a > 0.3 && o.id !== 'cta' && (o.rect.x0 < 65 - 0.5 || o.rect.x1 > 1015 + 0.5 || o.rect.y0 < 270 - 0.5 || o.rect.y1 > 1248 + 0.5)) bil('guvenli-bolge', t, { id: o.id, rect: o.rect });
    if (o.a > 0.3 && o.rect.x1 > 920 && o.rect.y0 < 400 && o.rect.y1 > 240) bil('sag-ust-160x160', t, { id: o.id });
    if (o.fs != null && o.a > 0.3 && o.fs < 36 - 0.01) bil('yazi<36px', t, { id: o.id, fs: o.fs }); }
  const bas = og.some((o) => o.id.startsWith('c') && o.id !== 'cta' && o.a > 0.05) || og.some((o) => o.id === 'cta' && o.a > 0.05); metinsiz.push([t, bas]);
  if (Math.abs(t * 2 - Math.round(t * 2)) < 1e-6) kon.push({ t, ogeler: og.filter((o) => o.a > 0.95 && /^c\d/.test(o.id)).slice(0, 2) });
  // CSV vurgu testi
  const c10 = CUE.parcalar.find((x) => x.id === 'c10'), c11 = CUE.parcalar.find((x) => x.id === 'c11'), TCSV = c10.kelime ? c10.kelime.csv : c10.baslangic + 0.54 * (c10.bitis - c10.baslangic);
  if (t >= c10.baslangic - 0.3 && t <= c11.bitis + 0.1) { const v = await p.evaluate((x) => window.__vurgu(x), t); if (Math.abs(t * 10 - Math.round(t * 10)) < 1e-6) vurguOrnek.push({ t, kart: v.kart });
    if (v.kart === 'csvDisa') bil('csv-disa-aktar-vurgulu', t, {}); if (t >= TCSV + 0.15 && t <= c10.bitis - 0.15 && v.kart !== 'csvIce') bil('csv-ice-aktar-vurgulanmadi', t, { kart: v.kart }); if (t >= c10.baslangic + 0.3 && t <= TCSV - 0.3 && v.kart !== 'diller') bil('elle-diller-vurgulanmadi', t, { kart: v.kart }); } }
// metinsiz süre (loop boşluğu hariç) ≤ 0,4
let b0 = null, enUzun = 0; for (const [t, v] of metinsiz) { if (t >= TL.kapanis - 0.02 && t <= TL.kancaGeri[0] + 0.25) { b0 = null; continue; } if (!v && b0 === null) b0 = t; if (v && b0 !== null) { enUzun = Math.max(enUzun, t - b0); if (t - b0 > 0.4 + 1e-6) bil('metinsiz>0.4', b0, { sure: +(t - b0).toFixed(2) }); b0 = null; } }
// senkron: blok alfa ≥0,5 giriş/çıkış − cue
const senkron = []; for (let i = 0; i < CUE.parcalar.length; i++) { const pc = CUE.parcalar[i]; const seri = (alfa[pc.id] || []).filter(([, a]) => a >= 0.5 && true).filter(([t]) => t < TL.kancaGeri[0]); if (!seri.length) { bil('senkron-yok', 0, { parca: pc.id }); continue; }
  const on = seri[0][0], off = seri[seri.length - 1][0] + 0.05; const dOn = i === 0 ? 0 : on - pc.baslangic, dOff = off - pc.bitis; senkron.push({ parca: pc.id, metin: pc.metin, cueBaslangic: pc.baslangic, cueBitis: pc.bitis, baslikGiris: +on.toFixed(2), baslikCikis: +off.toFixed(2), farkGiris: +dOn.toFixed(2), farkCikis: +dOff.toFixed(2) });
  if (Math.abs(dOn) > 0.15) bil('senkron-giris>0.15', on, { parca: pc.id, fark: +dOn.toFixed(2) }); if (i < CUE.parcalar.length - 1 && Math.abs(dOff) > 0.15) bil('senkron-cikis>0.15', off, { parca: pc.id, fark: +dOff.toFixed(2) }); }
// easing/hareket taraması (kaynak kod)
const kod = fs.readFileSync(path.join(DIR, 'scene-v7.mjs'), 'utf8').replace(/\/\/.*$/gm, ''); const yasak = kod.match(/\b(back|elastic|bounce|overshoot|rotate|rotateZ|three)\b/gi) || []; if (yasak.length) bil('yasak-easing/rotasyon/3b', 0, { bulunan: [...new Set(yasak)] });
// kontrast (piksel): 0,5 sn aralıkla blok kareleri
await p.close(); p = await ctx.newPage(); await p.goto(s.URL); await p.waitForFunction('window.hazir===true', null, { timeout: 180000 }); const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v7-')); const isler = [];
for (const k of kon) { if (!k.ogeler.length) continue; await p.evaluate((x) => window.frame(x), k.t); const f = path.join(tmp, `k-${k.t.toFixed(2)}.jpg`); await p.screenshot({ path: f, type: 'jpeg', quality: 98, timeout: 120000 }); isler.push({ t: k.t, dosya: f, ogeler: k.ogeler.map((o) => ({ id: o.id, kind: 'metin', rect: o.rect, color: o.renk, alpha: 1, text: o.id })) }); }
fs.writeFileSync(path.join(tmp, 'isler.json'), JSON.stringify(isler)); const py = spawnSync('python3', [path.join(DIR, 'layout_kontrast.py'), path.join(tmp, 'isler.json')], { encoding: 'utf8' }); let kontrast = { en_dusuk: null, olcum: 0 };
if (py.status === 0) { kontrast = JSON.parse(py.stdout); for (const x of kontrast.dusukler) bil('kontrast<4.5', x.t, x); } else bil('kontrast-olculemedi', 0, {});
await b.close(); s.kapat(); const ad = KISA ? 'layout-v7-kisa.json' : 'layout-v7.json';
const ozet = { kurallar: say, ihlalSayisi: ihlal.length, ornekSayisi: Math.floor(TL.SURE / 0.05) + 1, enKucukYaziPx: enKucuk, enUzunMetinsizSn: +enUzun.toFixed(2), kontrast: { enDusukOran: kontrast.en_dusuk, olcum: kontrast.olcum }, senkronEnBuyukFark: +Math.max(...senkron.map((x) => Math.max(Math.abs(x.farkGiris), Math.abs(x.farkCikis)))).toFixed(2), csvKelimeSn: tl.tCSV, video: { sure: +TL.SURE.toFixed(3), kare: TL.KARE } };
fs.writeFileSync(path.join(OUT, ad), JSON.stringify({ ozet, senkron, vurguOrnekleri: vurguOrnek, ihlaller: ihlal.slice(0, 200) })); console.log('V7 TEST:', ihlal.length ? 'KIRMIZI' : 'YEŞİL', JSON.stringify(ozet)); if (ihlal.length) { const g = {}; for (const i of ihlal) (g[i.kural] = g[i.kural] || []).push(i); for (const [k, v] of Object.entries(g)) console.log(' •', k, v.length, JSON.stringify(v[0]).slice(0, 220)); }
process.exit(ihlal.length ? 1 : 0);
