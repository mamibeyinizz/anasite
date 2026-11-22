// node check.mjs data/x.json [data/y.json ...]  — her girdi için render + piksel ölçümü + kurallar. Kırmızıda çıkış kodu 1 ve çıktı reddedilir (out/<id>.jpg silinir).
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { spawnSync } from 'node:child_process';
import { uret } from './render.mjs'; import { DIR, KOK } from './srv.mjs';
const T = JSON.parse(fs.readFileSync(path.join(DIR, 'tokens.json'), 'utf8')); const dosyalar = process.argv.slice(2).filter((a) => !a.startsWith('--')); const hashGuncelle = process.argv.includes('--ekran-hash-guncelle');
if (!dosyalar.length) { console.error('kullanım: node check.mjs data/x.json ...'); process.exit(2); }
const HX = path.join(DIR, 'data', '_ekran-hash.json'); const hashler = fs.existsSync(HX) ? JSON.parse(fs.readFileSync(HX, 'utf8')) : {};
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
let kirmizi = 0; const tablo = [];
for (const f of dosyalar) {
  const veri = JSON.parse(fs.readFileSync(f, 'utf8')); const FM = T.formatlar[veri.format]; const ihlal = []; const ok = (kosul, ad, ayr) => { if (!kosul) ihlal.push(ad + (ayr ? ' → ' + ayr : '')); };
  let r, rb; const cikti = path.join(DIR, 'out', 'v2');
  try { r = await uret(veri, { cikti }); rb = await uret(veri, { bos: true, cikti }); } catch (e) { console.log(`✗ ${veri.id}: ${e.message}`); fs.rmSync(path.join(cikti, veri.id + '.jpg'), { force: true }); kirmizi++; tablo.push({ id: veri.id, hata: e.message }); continue; }
  const bit = spawnSync('python3', [path.join(DIR, 'bitir.py'), r.png, path.join(cikti, veri.id + '.jpg')], { encoding: 'utf8' }); ok(bit.status === 0, 'jpg-uretilemedi', bit.stderr);
  const jpg = path.join(cikti, veri.id + '.jpg'); const o = r.olcum;
  const py = spawnSync('python3', [path.join(DIR, 'olc.py'), r.png, rb.png, path.join(cikti, 'arsiv', veri.id + '.olcum.json'), path.join(DIR, 'tokens.json'), jpg], { encoding: 'utf8' }); if (py.status) { console.log('✗ olc.py:', py.stderr); kirmizi++; continue; }
  const P = JSON.parse(py.stdout); const ink = P.ink; const M = FM.yanMarj;
  // 1) mürekkep sınırları
  ok(ink.x0 >= M && ink.x1 <= FM.w - M, 'yan-marj<80', `ink x ${ink.x0}–${ink.x1}`);
  if (veri.format === 'reels') { ok(ink.y0 >= FM.reelsUi.ust, 'ust-reels-ui<270', ink.y0); ok(ink.y1 <= FM.kirpim34[1] - FM.kirpimPay, 'alt-kirpim34-pay<40', ink.y1); ok(ink.y0 >= FM.kirpim34[0] + FM.kirpimPay, 'ust-kirpim34-pay<40', ink.y0);
    const kyb = Math.max(...o.kanca.kutular.map((k) => k.y1)); ok(kyb <= FM.h - FM.reelsUi.alt, 'kanca-reels-ui-alt-bolge', kyb); ok(o.logo.rect.y0 >= FM.kirpim34[0] + FM.kirpimPay && o.logo.rect.y1 <= FM.kirpim34[1] - FM.kirpimPay, 'logo-kirpim-kenari<40'); }
  else { ok(ink.y0 >= FM.ustAltMarj && ink.y1 <= FM.h - FM.ustAltMarj, 'ust-alt-marj<96', `ink y ${ink.y0}–${ink.y1}`); }
  ok(P.sagUstInk === 0, 'sag-ust-160x160-dolu', P.sagUstInk + ' px');
  // 2) kontrast + renk kuralları
  const esikOf = (k) => { const r = o.renkler.find((q) => q.renk === k.renk && q.sinif === k.sinif); const px = r ? r.px : 0, ag = r ? r.agirlik : 400; return (px >= T.kontrast.buyukPx || (ag >= 700 && px >= T.kontrast.buyukKalinPx)) ? T.kontrast.buyukMetinEsik : T.kontrast.kucukMetinEsik; };
  const kon = P.kontrast.map((k) => ({ ...k, esik: esikOf(k) })); const dusuk = kon.filter((k) => k.oran < k.esik); ok(dusuk.length === 0, 'kontrast<esik', JSON.stringify(dusuk)); const enDusuk = kon.length ? Math.min(...kon.map((k) => k.oran)) : null; const kullEsik = kon.length ? Math.min(...kon.map((k) => k.esik)) : null; ok(kon.length > 0, 'kontrast-olculemedi');
  { const pl = P.palet, es = T.palet.esikOran; ok(pl.mavi <= es, 'palet-mavi-ton', pl.mavi.toExponential(2)); ok(pl.kirmizi <= es, 'palet-kirmizi-ton', pl.kirmizi.toExponential(2)); ok(pl.kahverengi <= es, 'palet-kahverengi-bronz-ton', pl.kahverengi.toExponential(2)); }
  if (o.zemin === 'krem') { ok(P.bosStd.every((v) => v <= 1.5), 'krem-zemin-gradyan', P.bosStd.map((v) => v.toFixed(2)).join()); ok(o.yasakRenk.length === 0, 'acik-zeminde-#C9A84C', o.yasakRenk.join()); ok(o.renkler.some((k) => k.renk === 'rgb(127, 100, 25)'), 'acik-zemin-vurgu-#7F6419-yok'); }
  // 3) 330 px satır yüksekliği
  const fam = o.aile; const minSat = FM.satirYukseklik330Min; const fsPx = o.kanca.fs; const sat330 = +(fsPx * T.font.satirAraligi * 330 / FM.w).toFixed(1); ok(sat330 >= minSat, `330px-satir-yuksekligi<${minSat}`, sat330);
  ok(fsPx >= FM.kancaPx[0] || fam === 'cumle', 'yazi-boyu<min', fsPx);
  // 4) kanca yapısı
  ok(o.kanca.kelime <= T.limitler.kancaKelimeEnCok, 'kanca>5-kelime'); ok(o.kanca.satir === T.limitler.satir, 'kanca-satir≠2'); ok(!!o.hap.metin, 'etiket-yok'); ok(o.hap.px >= T.limitler.hapEnAz, 'hap<44px', o.hap.px); ok(o.logo.w >= T.limitler.logoEnAz && o.logo.rect.x1 - o.logo.rect.x0 >= T.limitler.logoEnAz - 1, 'logo<260px'); ok(/brand\/qr-menu-official-logo-v4/.test(o.logo.src), 'logo-gercek-dosya-degil');
  ok(veri.logo === true, 'logo-alani-true-degil');
  // kanca v2 ölçekleri
  let grupW = null, bGap = null, lGap = null;
  if (fam === 'kanca') { const gr = o.grup; grupW = Math.round(gr.w); const tb = Math.max(...o.kanca.kutular.map((k) => k.y1)); bGap = Math.round(gr.y0 - tb); lGap = Math.round(o.logo.rect.y0 - gr.y1); const K = FM.kanca;
    if (veri.format === 'reels') ok(gr.w >= K.grupGenislikMin, 'grup-genisligi<760', grupW); ok(bGap <= K.baslikGrupBoslukMax, 'baslik-grup-boslugu>120', bGap); ok(lGap >= K.logoGrupBoslukMin, 'grup-logo-boslugu<48', lGap);
    if (o.yildizlar && o.yildizlar.length) { ok(o.yildizlar.every((q) => q.x1 - q.x0 >= 70), 'yildiz<70px', o.yildizlar.map((q) => Math.round(q.x1 - q.x0)).join()); const fg = o.figurGrup; ok(Math.min(...o.yildizlar.map((q) => q.x0)) >= gr.x0 - 1, 'yildiz-grup-disi'); const yay = Math.max(...o.yildizlar.map((q) => q.x1)) - Math.min(...o.yildizlar.map((q) => q.x0)); ok(yay >= 0.5 * gr.w, 'yildiz-yayi<%50-grup', Math.round(yay)); } }
  if (fam === 'cumle') { const ag = P.agirlikY; ok(ag >= FM.cumle.agirlikMerkezi[0] && ag <= FM.cumle.agirlikMerkezi[1], 'agirlik-merkezi-%45-60-disi', ag.toFixed(3)); }
  // 5) yasak içerik
  const dizgeler = [veri.etiket, ...(veri.kanca || []), ...(veri.cumle || []), veri.rozet, ...o.metinler].filter(Boolean); const yas = T.yasakIcerik.map((p) => new RegExp(p, p === '\\bAI\\b' ? '' : 'i')); const bulundu = []; for (const d of dizgeler) for (const re of yas) if (re.test(d)) bulundu.push(`${re.source}: "${d}"`); ok(bulundu.length === 0, 'yasak-icerik', bulundu.join(' | '));
  if (/Çoklu Dil modülü/i.test(dizgeler.join(' '))) ok(false, 'cok-dilli-modul-etiketi-yasak');
  // 6) font
  ok(o.fontlar.every((x) => x === 'Manrope'), 'baska-font', o.fontlar.join()); ok(o.manropeYuklu >= 1 && o.fontKontrol, 'manrope-yuklenmedi'); ok(o.disIstek.length === 0, 'dis-istek-var', o.disIstek.join()); ok(o.altCizgili.length === 0, 'alti-cizili-metin', o.altCizgili.join());
  // 7) çıktı
  ok(P.jpgBayt <= T.limitler.jpgBayt, 'jpg>2MB', P.jpgBayt); ok(P.jpgIcc && P.jpgMod === 'RGB', 'jpg-srgb-degil'); ok(P.jpgBoyut[0] === FM.w && P.jpgBoyut[1] === FM.h, 'jpg-boyut', P.jpgBoyut.join('×'));
  // 8) arka plan tutarlılığı
  if (o.zemin === 'koyu') { const lo = hexRgb(T.renk.zeminMedyanAralik[0]), hi = hexRgb(T.renk.zeminMedyanAralik[1]), g = hexRgb(T.renk.glowEnFazla); ok(P.bosMedyan.every((v, i) => v >= lo[i] && v <= hi[i]), 'zemin-medyani-aralik-disi', P.bosMedyan.join()); ok(P.bosMaks.every((v, i) => v <= g[i]), 'glow>#25503D', P.bosMaks.join()); }
  else ok(P.bosMedyan.every((v, i) => Math.abs(v - hexRgb(T.renk.krem)[i]) <= 2), 'krem-zemin-≠-#EADFC1(±2)', P.bosMedyan.join());
  // 9) ekran görüntüsü değişmedi
  let ekranBilgi = null; if (o.ekran) { const e = o.ekran; const sd = path.join(KOK, 'analiz/video', e.src); const disk = crypto.createHash('sha256').update(fs.readFileSync(sd)).digest('hex'); ok(disk === e.hash, 'ekran-sayfaya-farkli-yuklendi'); if (hashGuncelle) hashler[e.src] = disk; ok(hashler[e.src] === disk, 'ekran-hash-manifest-farkli', e.src);
    const g = spawnSync('git', ['-C', KOK, 'show', `HEAD:analiz/video/${e.src}`], { maxBuffer: 1 << 26 }); if (g.status === 0) ok(crypto.createHash('sha256').update(g.stdout).digest('hex') === disk, 'ekran-git-HEAD-ten-farkli'); ekranBilgi = 'ok';
    if (o.lens) { ok(o.lens.ekranMetinPx >= T.lens.ekranMetinMin, 'lens-ekran-metni<28px', o.lens.ekranMetinPx); const orn = o.telefon.oran; ok(orn >= 0.42 && orn <= 0.5, 'telefon-orani', orn.toFixed(3)); ok(o.rozet.px >= 40, 'rozet<40px'); } }
  const sonuc = { id: veri.id, aile: fam, format: veri.format, yaziPx: fsPx, harfAraligi: o.kanca.ls, yanMarjSol: ink.x0, yanMarjSag: FM.w - ink.x1, enDusukKontrast: enDusuk, kontrastEsik: kullEsik, grupGenislik: grupW, baslikGrupBosluk: bGap, logoGrupBosluk: lGap, agirlikY: P.agirlikY, palet: P.palet, satir330px: sat330, jpgMB: +(P.jpgBayt / 1e6).toFixed(2), ihlal };
  tablo.push(sonuc); if (ihlal.length) { kirmizi++; fs.rmSync(jpg, { force: true }); console.log(`✗ ${veri.id}  ${ihlal.length} ihlal:\n   - ` + ihlal.join('\n   - ')); } else console.log(`✓ ${veri.id}  yazı ${fsPx}px  yan marj ${ink.x0}/${FM.w - ink.x1}  kontrast ${enDusuk}/${kullEsik}  grup ${grupW}  boşluk ${bGap}/${lGap}  330px satır ${sat330}  ${(P.jpgBayt / 1e6).toFixed(2)} MB`);
}
if (hashGuncelle) fs.writeFileSync(HX, JSON.stringify(hashler, null, 1)); fs.writeFileSync(path.join(DIR, 'out', 'v2', 'olcum-tablo.json'), JSON.stringify(tablo, null, 1));
console.log(kirmizi ? `\nKIRMIZI: ${kirmizi}/${dosyalar.length}` : `\nYEŞİL: ${dosyalar.length}/${dosyalar.length}`); process.exit(kirmizi ? 1 : 0);
