// Çoklu Dil Reels v4 — 28 sn, 1080×1920, 30 fps. Kare kare render: window.frame(t) (t = saniye).
// v4: tek metin katmanı (başlık = sesli cümle), gerçek oranlı telefon (tam ekran görüntüsü), büyüteç (lens) kanıt kartı, 920×568 panel penceresi,
// büyütülmüş 3B grup. Yerleşim sabitleri yalnız layout.js'te. Ürün ekranları gerçek ekran görüntüleridir (kırpma yalnızca UV penceresi).
import * as THREE from 'three';
import * as L from '/layout.js';
import * as TLm from '/timeline.js';

await Promise.all([document.fonts.load('800 60px Manrope'), document.fonts.load('700 40px Manrope'), document.fonts.load('800 190px Manrope')]);
await document.fonts.ready;
const { W, H } = L.CANVAS;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
function bez(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (t) => { if (t <= 0) return 0; if (t >= 1) return 1; let u = t;
    for (let i = 0; i < 10; i++) { const x = ((ax * u + bx) * u + cx) * u - t; const dx = (3 * ax * u + 2 * bx) * u + cx; if (Math.abs(x) < 1e-6) break; u -= x / dx; }
    return ((ay * u + by) * u + cy) * u; };
}
const E = bez(.22, 1, .36, 1);
const eo = (t, a, b) => E(seg(t, a, b));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (x) => x * x * (3 - 2 * x);
const dip = (t, c, w = 0.1) => smooth(clamp(Math.abs(t - c) / w));      // c anında 0, c±w'de 1 (0,2 sn söner/gelir)

/* ───────── renderer / sahne (kamera SABİT) ───────── */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();
const CAMZ = 2400;
const cam = new THREE.PerspectiveCamera(2 * Math.atan(H / 2 / CAMZ) * 180 / Math.PI, W / H, 10, 9000);
cam.position.set(0, 0, CAMZ); cam.lookAt(0, 0, 0); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
scene.add(new THREE.AmbientLight(0xffffff, 1.1));
const sun = new THREE.DirectionalLight(0xfff3d8, 2.0); sun.position.set(-700, 1100, 1300); scene.add(sun);
const rim = new THREE.PointLight(0xC9A84C, 2.4, 4200, 1.2); rim.position.set(650, 380, -200); scene.add(rim);

const GOLD = 0xC9A84C, KREM = 0xF4F1E8, ALTIN_AC = 0xE6C86E;
const mat = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .6, metalness: .08 }, o));
function setOp(obj, a) {
  obj.userData.a = a;
  obj.traverse((o) => { if (!o.material) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
    if (m.userData.base === undefined) m.userData.base = m.opacity; m.transparent = true; m.opacity = m.userData.base * a; m.depthWrite = a > 0.98; }); });
  obj.visible = a > 0.004;
}
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function roundedShape(w, h, r) { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false); s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false); s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false); return s; }
function maskTex(w, h, r) {                         // yuvarlatılmış pencere maskesi (alphaMap: yeşil kanal)
  const S2 = 3; return canvasTex(w * S2 / 2, h * S2 / 2, (ctx, cw, ch) => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch); ctx.fillStyle = '#fff'; rr(ctx, 0, 0, cw, ch, r * S2 / 2); ctx.fill(); });
}
function goldFrame(wp, hp) {
  const S2 = 3; const t = canvasTex(Math.ceil(wp * S2), Math.ceil(hp * S2), (ctx, w, h) => { ctx.clearRect(0, 0, w, h);
    ctx.shadowColor = 'rgba(201,168,76,.9)'; ctx.shadowBlur = 16; ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 12; rr(ctx, 12, 12, w - 24, h - 24, 22); ctx.stroke();
    ctx.shadowBlur = 0; ctx.lineWidth = 6; ctx.strokeStyle = '#F1DFA0'; rr(ctx, 12, 12, w - 24, h - 24, 22); ctx.stroke(); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(wp, hp), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false })); m.renderOrder = 5; return m;
}
function bubble(text, w, h, fill, ink, tailLeft) {
  const S2 = 3; const t = canvasTex(w * S2, (h + 36) * S2, (ctx, cw, ch) => { ctx.clearRect(0, 0, cw, ch); ctx.fillStyle = fill; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18;
    rr(ctx, 10, 10, cw - 20, h * S2 - 20, 46); ctx.fill(); ctx.beginPath(); const tx = tailLeft ? cw * .26 : cw * .74;
    ctx.moveTo(tx - 34, h * S2 - 24); ctx.lineTo(tx + (tailLeft ? -22 : 22), ch - 10); ctx.lineTo(tx + 34, h * S2 - 24); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = ink; ctx.font = `800 ${Math.round(h * S2 * .66)}px Manrope`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, cw / 2, h * S2 / 2 + 10); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h + 36), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })); m.renderOrder = 4; return m;
}
const loader = new THREE.TextureLoader();
const loadTex = (u) => new Promise((res, rej) => loader.load(u, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; res(t); }, undefined, rej));
const ODAK = await (await fetch('/tex/odak.json')).json();
const BOX = await (await fetch('/render/boxes.json')).json();
const CUE = await (await fetch('/cue.json')).json(); const TL = TLm.kur(CUE); const TOPLAM = TL.SURE;
const w = TL.W;                                                         // v4 olay zamanı → v5 (konuşma) zamanı
const EP = L.EKRAN_PENCERE;

const loadU = (u) => loader.loadAsync(u).then((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; return t; });
const px2w = (x, y) => L.dunya(x, y);

/* ───────── doku penceresi (UV) — her pencere kendi doku kopyasına yazılır; sınır [0,1] kıskaçlı ve kayda geçer ───────── */
const UVLOG = [];
function pencere(base, ad, x0, y0, x1, y1, tw, th) {
  const t = base.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.repeat.set((x1 - x0) / tw, (y1 - y0) / th); t.offset.set(x0 / tw, 1 - y1 / th);
  UVLOG.push({ ad, tw, th, x0, y0, x1, y1, u0: x0 / tw, u1: x1 / tw, v0: y0 / th, v1: y1 / th }); return t;
}

/* ───────── sahne 1–3: 3B grup (MEDYA bandını doldurur) ───────── */
const root12 = new THREE.Group(); scene.add(root12);
function makeTable(s) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(170, 170, 16, 72), mat(0x2a6b57, { roughness: .5 }));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(170, 4.5, 14, 72), mat(GOLD, { metalness: .55, roughness: .32 })); ring.rotation.x = Math.PI / 2; ring.position.y = 8;
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(20, 32, 170, 28), mat(0x1a4a3b)); ped.position.y = -92;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(88, 100, 12, 36), mat(0x1a4a3b)); base.position.y = -182;
  g.add(top, ring, ped, base); g.scale.setScalar(s); g.rotation.x = 0.42; return g;
}
function makePerson(color, withArms) {
  const g = new THREE.Group(); const m = () => mat(color, { roughness: .75 });
  g.add(new THREE.Mesh(new THREE.CapsuleGeometry(46, 128, 10, 20), m())); const head = new THREE.Mesh(new THREE.SphereGeometry(38, 28, 24), m()); head.position.y = 142; g.add(head);
  if (withArms) { const mk = (sx) => { const p = new THREE.Group(); const a = new THREE.Mesh(new THREE.CapsuleGeometry(14, 92, 6, 12), m()); a.position.y = -52; p.add(a); p.position.set(sx * 64, 70, 6); return p; };
    g.userData.armL = mk(-1); g.userData.armR = mk(1); g.add(g.userData.armL, g.userData.armR); }
  return g;
}
function menuCard() {
  const g = new THREE.Group(); const cb = new THREE.Mesh(new THREE.BoxGeometry(150, 205, 6), mat(KREM, { roughness: .5 }));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(150, 205), new THREE.MeshBasicMaterial({ map: canvasTex(300, 410, (ctx, w, h) => {
    ctx.fillStyle = '#F4F1E8'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 8; ctx.strokeRect(14, 14, w - 28, h - 28);
    ctx.fillStyle = '#0D2B22'; ctx.font = '800 50px Manrope'; ctx.textAlign = 'center'; ctx.fillText('MENÜ', w / 2, 100); ctx.fillStyle = '#C9A84C'; ctx.fillRect(w / 2 - 34, 120, 68, 6);
    ctx.fillStyle = 'rgba(13,43,34,.55)'; for (let i = 0; i < 6; i++) ctx.fillRect(46, 160 + i * 38, w - 92 - (i % 2) * 54, 11); }) }));
  face.position.z = 3.2; cb.add(face); g.add(cb); return g;
}
const tableA = makeTable(1);
const turist = makePerson(ALTIN_AC, true);
{ turist.userData.armL.visible = false; turist.userData.armR.position.set(-62, 76, 24);
  turist.userData.menu = menuCard(); turist.add(turist.userData.menu);
  turist.userData.q = bubble('?', 128, 110, '#F4F1E8', '#0D2B22', false); turist.add(turist.userData.q); }
const garson = makePerson(KREM, true);
{ garson.userData.b = bubble('…', 150, 110, '#C9A84C', '#0D2B22', true); garson.add(garson.userData.b); }
root12.add(tableA, turist, garson);
const GS = 1.22;                                             // grup ölçeği (ofsetler grup yerel birimi)
const OFS = { A: [-6, 40], turist: [272, 100], garson: [-196, 100] };
{ const p = px2w(L.MEDYA.cx - 12, L.MEDYA.cy - 14); root12.position.set(p.x, p.y, 0); root12.scale.setScalar(GS); }
tableA.position.set(OFS.A[0], -OFS.A[1], 0);

/* ───────── telefon: gerçek oran, tam ekran görüntüsü, sabit boyut ───────── */
const TP = L.TELEFON, PW = TP.ekranW, PH = TP.ekranH, PS = TP.ekranOlcek;
const phone = new THREE.Group(); scene.add(phone);
const pbody = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(TP.w, TP.h, TP.kose), { depth: 20, bevelEnabled: true, bevelThickness: TP.bevel, bevelSize: TP.bevel, bevelSegments: 5, curveSegments: 28 }), mat(0x0b1210, { metalness: .75, roughness: .32 }));
pbody.position.z = -10; phone.add(pbody);
const pivot = new THREE.Group(); pivot.position.z = 10 + TP.bevel + 1.6; phone.add(pivot);
const ekranMask = maskTex(PW, PH, TP.ekranKose);
const mkScr = (z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, alphaMap: ekranMask })); m.position.z = z; pivot.add(m); return m; };
const scrA = mkScr(0), scrB = mkScr(0.3);
const KEYS = ['tr', 'en', 'de', 'fr'];
const EW = L.EKRAN_TEX.w, EH = L.EKRAN_TEX.h;
const TEX = {}, PT = {}, LT = {};
const V = TL.V, Ev = TL.Ev;
const tDD = w(9.0), tSlide = w(9.5), tTR = w(11.7), tEN = w(13.0), tDE = w(14.5), tFR = w(15.8);
const tCikis = [V[8] - 0.25, V[8] - 0.05];                                   // telefon/büyüteç/rozet çıkışı; panel V[8]'de girer (çapraz yok)
const tPanelCikis = [V[12] - 0.25, V[12] - 0.05];                          // panel çıkışı; telefon V[12]'de girer (çapraz yok)
const SIRA = [[0, '01'], [tDD, '02'], [tTR, 'tr'], [tEN, 'en'], [tDE, 'de'], [tFR, 'fr'], [V[8] + 0.3, '02']];
function telefonKaresi(t) {
  let i = 0; for (let k = 0; k < SIRA.length; k++) if (t >= SIRA[k][0] - 0.1) i = k;
  const xf = i > 0 && t < SIRA[i][0] + 0.1; const mix = xf ? smooth(clamp((t - (SIRA[i][0] - 0.1)) / 0.2)) : 1;
  const kB = SIRA[i][1], kA = xf ? SIRA[i - 1][1] : kB;
  scrA.material.map = PT[kA]; scrB.material.map = PT[kB]; scrA.material.opacity = 1; scrB.material.opacity = xf ? mix : 1; scrB.visible = xf;
  return { cur: mix >= 0.5 ? kB : kA };
}
/* telefon üstü ve büyüteç vurgu çerçeveleri */
const phItem = goldFrame(((ODAK_DD().kutuYanal.x1 - ODAK_DD().kutuYanal.x0) + 8) * PS, 85.5 * PS); pivot.add(phItem); phItem.position.z = 0.9;
const EPX = (EP.x0 + EP.x1) / 2, EPY = (EP.y0 + EP.y1) / 2;
function ODAK_DD() { return ODAK.ekranlar['02']; }
const phRows = {}; for (const k of KEYS) { const c = ODAK.ekranlar[k].telefonCerceve; const m = goldFrame((c.x1 - c.x0) * PS, (c.y1 - c.y0) * PS); m.position.set(((c.x0 + c.x1) / 2 - EPX) * PS, -((c.y0 + c.y1) / 2 - EPY) * PS, 0.9); pivot.add(m); phRows[k] = m; }
const fOp = (m, a) => { m.material.opacity = Math.max(0, a); m.visible = a > 0.01; };

/* ───────── büyüteç (lens) ───────── */
function ring(w, h) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, map: canvasTex(w * 1.5, h * 1.5, (ctx, cw, ch) => {
  ctx.clearRect(0, 0, cw, ch); ctx.strokeStyle = 'rgba(201,168,76,.95)'; ctx.lineWidth = 8; rr(ctx, 4, 4, cw - 8, ch - 8, L.LENS.kose * 1.5); ctx.stroke(); }) })); m.position.z = 0.6; return m; }
function lensMesh(w, h) { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, alphaMap: maskTex(w, h, L.LENS.kose), depthWrite: false })); g.add(m, ring(w, h)); g.userData.m = m; g.userData.w = w; g.userData.h = h; scene.add(g); return g; }
const LS = L.LENS.s, LX = L.LENS.x0, LCX = L.LENS.x0 + L.LENS.w / 2;
const lensDD = lensMesh(L.LENS.ddW, L.LENS.ddH), lensRows = lensMesh(L.LENS.w, L.LENS.satirH), lensCTA = lensMesh(L.LENS.w, L.LENS.ctaH);
const lensY = { dd: L.LENS.ddY0 + L.LENS.ddH / 2, rows: L.LENS.satirY0 + L.LENS.satirH / 2, cta: L.LENS.ctaY0 + L.LENS.ctaH / 2 };
{ const a = px2w(LX + L.LENS.ddW / 2, lensY.dd); lensDD.position.set(a.x, a.y, 0); const b = px2w(LCX, lensY.rows); lensRows.position.set(b.x, b.y, 0); const c = px2w(LCX, lensY.cta); lensCTA.position.set(c.x, c.y, 0); }
const lensFrame = {};                                                       // büyüteç içi dil öğesi çerçevesi
const lfW = (ODAK_DD().kutuYanal.x1 - ODAK_DD().kutuYanal.x0 + 8) * LS;
lensFrame.dd = goldFrame((L.LENS.ddW - 12), 85.5 * LS); lensFrame.cta = goldFrame(lfW, 85.5 * LS); scene.add(lensFrame.dd, lensFrame.cta);
const itemMerkezY = (i) => { const it = ODAK_DD().itemler[i]; return (it.y0 + it.y1) / 2; };
function lensItemPos(grp, win, yTop, i) { const xTex = (ODAK_DD().kutuYanal.x0 + ODAK_DD().kutuYanal.x1) / 2; return px2w(LX + (xTex - win.x0) * LS, yTop + (itemMerkezY(i) - win.y0) * LS); }
const ddWin = ODAK_DD().pencereDD, ctaWin = ODAK_DD().pencereCTA;
/* bağlantı çizgisi (telefondaki vurgudan karta) */
const link = new THREE.Mesh(new THREE.PlaneGeometry(1, 3), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, depthWrite: false, toneMapped: false })); link.renderOrder = 6; scene.add(link);
const linkNode = (g) => new THREE.Mesh(new THREE.CircleGeometry(6, 20), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, depthWrite: false, toneMapped: false }));
const nodeA = linkNode(), nodeB = linkNode(); nodeA.renderOrder = nodeB.renderOrder = 6; scene.add(nodeA, nodeB);
function setLink(x0, y0, x1, y1, a) {
  const A = px2w(x0, y0), B = px2w(x1, y1); const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy);
  link.position.set((A.x + B.x) / 2, (A.y + B.y) / 2, 1); link.rotation.z = Math.atan2(dy, dx); link.scale.set(len, 1, 1); nodeA.position.set(A.x, A.y, 1); nodeB.position.set(B.x, B.y, 1);
  for (const m of [link, nodeA, nodeB]) { m.material.opacity = Math.max(0, a); m.visible = a > 0.01; }
}

/* ───────── panel penceresi 920×568 (hub ekranı; pencere UV'si css koordinatından) ───────── */
const PN = L.PANEL, PD = ODAK.panel;
const panel = new THREE.Group(); scene.add(panel);
const pMask = maskTex(PN.w, PN.h, PN.kose);
const pScr = new THREE.Mesh(new THREE.PlaneGeometry(PN.w, PN.h), new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, alphaMap: pMask, depthWrite: false })); panel.add(pScr);
const pRing = new THREE.Mesh(new THREE.PlaneGeometry(PN.w, PN.h), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, map: canvasTex(PN.w * 1.5, PN.h * 1.5, (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h); ctx.strokeStyle = 'rgba(201,168,76,.9)'; ctx.lineWidth = 7; rr(ctx, 3.5, 3.5, w - 7, h - 7, PN.kose * 1.5); ctx.stroke(); }) })); pRing.position.z = 0.6; panel.add(pRing);
{ const p = px2w(L.MEDYA.cx, PN.cy); panel.position.set(p.x, p.y, 0); }
const PTW = (PD.css_x1 - PD.css_x0) * 2, PTH = (PD.css_y1 - PD.css_y0) * 2;             // panel.jpg: css 130–1280 × 0–800 (2×)
const PAN = {};
const KARTLAR = PD.kartlar; const kartRect = (k) => KARTLAR[k];
const pFrame = goldFrame((KARTLAR.diller.x1 - KARTLAR.diller.x0 + 10) * PN.s, (KARTLAR.diller.y1 - KARTLAR.diller.y0 + 10) * PN.s); pFrame.position.z = 0.9; panel.add(pFrame);
/* panel başlık şeridi: ekran görüntüsündeki "Diller & Çeviriler" (sabit; pencerenin üstünde) */
const stripG = new THREE.Group(); scene.add(stripG);
{ const sp = PN.serit; const m = new THREE.Mesh(new THREE.PlaneGeometry(sp.w, sp.h), new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, alphaMap: maskTex(sp.w, sp.h, sp.kose), depthWrite: false })); stripG.add(m); stripG.userData.m = m;
  const r = new THREE.Mesh(new THREE.PlaneGeometry(sp.w, sp.h), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, map: canvasTex(sp.w * 1.5, sp.h * 1.5, (ctx, cw, ch) => { ctx.clearRect(0, 0, cw, ch); ctx.strokeStyle = 'rgba(201,168,76,.9)'; ctx.lineWidth = 6; rr(ctx, 3, 3, cw - 6, ch - 6, sp.kose * 1.5); ctx.stroke(); }) })); r.position.z = 0.6; stripG.add(r);
  const p = px2w(sp.x0 + sp.w / 2, sp.y0 + sp.h / 2); stripG.position.set(p.x, p.y, 0); }

const PAN_METIN_PX = 13.5 * PN.s;                       // kart alt yazısı (en küçük vurgulu metin) ≈ 13,5 css → ≥ 36 px
function panelDurum(t) {                                // [görünüm, vurgulu kart, vurgu alfa] — zamanlar konuşmaya oturtulmuş (v4 olay zamanları → w)
  const v = (t >= w(20.2) && t < w(20.7)) ? 'sag' : 'sol';
  const fa = (a, b) => Math.min(E(seg(t, a, a + .2)), 1 - E(seg(t, b - .2, b)));
  const S2 = [['diller', 18.5, 19.4], ['csvDisa', 19.65, 20.1], ['csvIce', 20.3, 20.65], ['diller', 20.85, 22.2]];
  for (const [k, a, b] of S2) if (t >= w(a) && t < w(b)) return [v, k, fa(w(a), w(b))];
  return [v, null, 0];
}

/* ───────── DOM ───────── */
const $ = (id) => document.getElementById(id);
const el = {}; ['bas', 'logo', 'adres', 'badge', 'cTR', 'cEN', 'cDE', 'cFR'].forEach((k) => { el[k] = $(k); });
Object.assign(el.bas.style, { left: L.S.x0 + 'px', width: L.S.w + 'px', top: L.BAND.baslik.y0 + 'px' });
Object.assign(el.logo.style, { left: L.CTA.logoX0 + 'px', top: L.LENS.ctaLogoY0 + 'px', height: L.LENS.logoH + 'px', width: 'auto' });
Object.assign(el.adres.style, { left: L.LENS.x0 + 'px', top: L.LENS.urlY0 + 'px' });
{ // rozet (üst) + dil çipleri (alt): sağ sütun, büyüteçle 24 px aralık
  Object.assign(el.badge.style, { left: L.LENS.x0 + 'px', top: (L.LENS.satirY0 - L.GAP - L.LENS.rozetH) + 'px', height: L.LENS.rozetH + 'px' });
  const chips = [el.cTR, el.cEN, el.cDE, el.cFR]; let x = L.LENS.x0;
  chips.forEach((n) => { n.style.top = L.LENS.chipY0 + 'px'; n.style.height = L.LENS.rozetH + 'px'; const w = n.getBoundingClientRect().width; n.style.left = x + 'px'; x += w + 12; });
}
const fadeEl = (n, a) => { n.style.opacity = clamp(a).toFixed(3); };

const HTML = [
  'Yabancı misafir geldi.<br><b>Menüyü kim anlatacak?</b>', 'Garsonunuz <b>tercümana dönüşüyor,</b>', 'diğer masalar bekliyor.', 'Anlamayan misafir de <b>sormaya çekinir.</b>',
  'Çözüm menünün <b>kendisinde.</b>', 'Misafir QR’ı okutur, <b>dilini seçer.</b>', 'Ürün adı, açıklama, kategori,', 'hepsi <b>kendi dilinde</b> açılır.', 'Bu, <b>Çoklu Dil modülü.</b>',
  '<b>Dilleri</b> siz tanımlarsınız.', 'Çevirileri elle ya da <b>CSV</b> ile girersiniz.', '<b>Otuz dile</b> kadar.', 'Garsonunuz <b>servise dönsün.</b>', 'Aynı menüyü kendi telefonunuzda deneyin,',
  'dil seçiciyi <b>siz değiştirin.</b>', 'Bağlantı <b>profilimizde.</b>'];
const BASLIK = CUE.parcalar.map((p, i) => [V[i], Ev[i], HTML[i], p.metin]);          // [görünür başlangıç, görünür bitiş, html, düz metin]
const BAS_FONT = BASLIK.map(([, , html]) => { const b = el.bas; b.innerHTML = html; let fs = L.TIP.baslikMax; b.style.fontSize = fs + 'px'; b.style.opacity = '0';
  const satir = () => Math.round(b.offsetHeight / (fs * 1.1));
  while ((satir() > L.TIP.baslikSatir || b.offsetHeight > L.BAND.baslik.y1 - L.BAND.baslik.y0 || b.scrollWidth > b.clientWidth + 1) && fs > L.TIP.baslikMin) { fs -= 2; b.style.fontSize = fs + 'px'; }
  return { fs, h: b.offsetHeight, satir: satir() }; });
window.__baslik = BASLIK.map(([a, b, , s], i) => [a, b, 'bas' + i, s]); window.__baslikFont = BAS_FONT; window.__tl = { V, Ev, SURE: TL.SURE, KARE: TL.KARE, dongu: TL.dongu };
const CTA_ACIK = w(24.0), CTA_KAPAN = TL.ctaKapan, HOOK_GERI = TL.kancaGeri;
const aktifDil = (t) => (t >= tFR ? 'fr' : t >= tDE ? 'de' : t >= tEN ? 'en' : 'tr');
const segW = (t, a, b) => seg(t, w(a), w(a) + (b - a)), eoW = (t, a, b) => E(segW(t, a, b));

/* ───────── kare ───────── */
let hazir = false;
function frame(t) {
  if (!hazir) throw new Error('dokular hazır değil');
  t = clamp(t, 0, TOPLAM);
  const fo = 1 - smooth(seg(t, CTA_KAPAN[0], CTA_KAPAN[1]));              // CTA katmanları son cümleden hemen önce söner
  const hookIn = t >= HOOK_GERI[0] ? eo(t, HOOK_GERI[0], HOOK_GERI[1]) : 0;
  const loop = t >= TL.dongu;
  const ts = loop ? 0 : t;

  /* 3B: sahne 1–3 */
  const on12 = ts < V[4] + 0.6 || loop; const a12 = loop ? hookIn : 1 - eo(t, V[4], V[4] + 0.5);
  root12.visible = on12;
  tableA.rotation.y = .1 * Math.sin(ts * .6);
  const geri = E(seg(ts, w(5.0), w(7.8)));
  turist.position.set(OFS.turist[0] + 40 * geri, -OFS.turist[1] + 6 * geri, 30 - 90 * geri);
  turist.userData.armR.rotation.z = -1.78 + Math.sin(ts * 2.3) * .07 + .35 * geri;
  turist.userData.menu.position.set(-168 + 10 * Math.sin(ts * 2.3), 104, 34); turist.userData.menu.rotation.set(0, .18, .08 * Math.sin(ts * 2.3));
  turist.userData.q.position.set(-6, 262 + 6 * Math.sin(ts * 3.1), 14);
  const gIn = eo(ts, V[1] - 0.15, V[1] + 0.65); garson.position.set(OFS.garson[0], -OFS.garson[1] + 6 * Math.sin(ts * 4.2), 40); garson.scale.setScalar(lerp(.86, 1, gIn));
  garson.userData.armR.rotation.z = .4 + Math.sin(ts * 7.2) * .5; garson.userData.armL.rotation.z = -.4 - Math.sin(ts * 7.2 + 1.1) * .5;
  garson.userData.b.position.set(78, 262, 14); const bs = eo(ts, V[1] + 0.55, V[1] + 1.05); garson.userData.b.scale.setScalar(Math.max(bs, .001)); garson.userData.b.visible = bs > .01;
  setOp(tableA, on12 ? a12 : 0);
  setOp(turist, on12 ? a12 * lerp(1, .6, geri) : 0); setOp(garson, on12 ? a12 * gIn : 0);

  /* telefon: SABİT boyut; yalnız konum: orta → sol; panel/telefon arasında çapraz YOK (eski söner, yenisi gelir) */
  const faz = telefonKaresi(t);
  const sunumA = t >= V[4] && t < V[8] - 0.04, ctaA0 = t >= V[12] && t < TL.dongu;
  const phoneVis = sunumA || ctaA0;
  let cx = TP.cxSol, pop = 1;
  if (sunumA) { cx = t < tSlide ? lerp(L.MEDYA.cx + 220, TP.cxOrta, eo(t, V[4], V[4] + 0.6)) : lerp(TP.cxOrta, TP.cxSol, smooth(seg(t, tSlide, tSlide + 0.6))); pop = Math.min(eo(t, V[4], V[4] + 0.35), 1 - eo(t, tCikis[0], tCikis[1])); }
  else if (ctaA0) { const ts2 = w(23.5); cx = lerp(TP.cxOrta, TP.cxSol, smooth(seg(t, ts2, ts2 + 0.45))); pop = eo(t, V[12], V[12] + 0.3) * fo; }
  const pw = px2w(cx, TP.cy); phone.position.set(pw.x, pw.y, 0); phone.scale.setScalar(1); phone.rotation.set(-.02, 0, 0);
  setOp(phone, phoneVis ? pop : 0);

  /* büyüteç: dil seçici · ürün satırları · CTA dil seçici */
  const lang = aktifDil(t);
  const dipSw = Math.min(dip(t, tEN), dip(t, tDE), dip(t, tFR));
  const aDD = (t >= V[5] && t < tTR ? Math.min(eo(t, V[5], V[5] + 0.3), 1 - eo(t, tTR - 0.2, tTR - 0.05)) : 0);
  const aRows = (t >= tTR && t < V[8] ? Math.min(eo(t, tTR, tTR + 0.15), 1 - eo(t, tCikis[0], tCikis[1])) : 0) * dipSw;
  const aCTA = (t >= CTA_ACIK && t < TL.dongu ? eo(t, CTA_ACIK, CTA_ACIK + 0.3) * fo : 0);
  setOp(lensDD, aDD); setOp(lensRows, aRows); setOp(lensCTA, aCTA);
  lensRows.userData.m.material.map = LT[lang].satir;
  /* dil öğesi çerçeveleri */
  const idxCta = smooth(segW(t, 24.85, 25.05)) + smooth(segW(t, 25.2, 25.4)) + smooth(segW(t, 25.55, 25.75));
  const ddA = aDD * eo(t, V[5] + 0.1, V[5] + 0.3);
  fOp(lensFrame.dd, ddA); { const p = lensItemPos(0, ddWin, L.LENS.ddY0, 0); lensFrame.dd.position.set(p.x, p.y, 0.9); }
  const ctaA = aCTA * eo(t, CTA_ACIK + 0.3, CTA_ACIK + 0.5);
  fOp(lensFrame.cta, ctaA); { const i0 = Math.floor(idxCta + 1e-6), f = idxCta - i0; const y0 = itemMerkezY(Math.min(i0, 3)), y1 = itemMerkezY(Math.min(i0 + 1, 3)); const yy = lerp(y0, y1, f);
    const xTex = (ODAK_DD().kutuYanal.x0 + ODAK_DD().kutuYanal.x1) / 2; const p = px2w(LX + (xTex - ctaWin.x0) * LS, L.LENS.ctaY0 + (yy - ctaWin.y0) * LS); lensFrame.cta.position.set(p.x, p.y, 0.9);
    const ph = phItemPos(yy); phItem.position.set(ph.x, ph.y, 0.9); }
  { const p0 = phItemPos(itemMerkezY(0)); if (!ctaA0) phItem.position.set(p0.x, p0.y, 0.9); }
  fOp(phItem, (ctaA0 ? ctaA : ddA) * (phoneVis ? pop : 0));
  for (const k of KEYS) fOp(phRows[k], k === lang ? aRows * (phoneVis ? pop : 0) : 0);
  /* bağlantı çizgisi: telefondaki vurgudan (sağ kenar) karta */
  const xPhR = TP.cxSol + PW / 2;
  let linkA = 0, ly0 = 0, ly1 = 0, lx1 = LX;
  if (aDD > 0.01) { linkA = ddA; const yTexT = itemMerkezY(0); ly0 = TP.cy - PH / 2 + yTexT * PS; ly1 = L.LENS.ddY0 + (yTexT - ddWin.y0) * LS; }
  else if (aRows > 0.01) { linkA = aRows; const c = ODAK.ekranlar[lang].telefonCerceve; ly0 = TP.cy - PH / 2 + ((c.y0 + c.y1) / 2) * PS; ly1 = L.LENS.satirY0 + L.LENS.satirH / 2; }
  else if (aCTA > 0.01) { linkA = ctaA; const i0 = Math.floor(idxCta + 1e-6), f = idxCta - i0; const yy = lerp(itemMerkezY(Math.min(i0, 3)), itemMerkezY(Math.min(i0 + 1, 3)), f); ly0 = TP.cy - PH / 2 + yy * PS; ly1 = L.LENS.ctaY0 + (yy - ctaWin.y0) * LS; }
  setLink(xPhR + 4, ly0, lx1, ly1, linkA * (phoneVis ? pop : 0));

  /* panel: başlık şeridi + 920×560 pencere. Telefonla çapraz YOK: önce biri söner (0,2 sn), sonra diğeri gelir */
  const panOn = t >= V[8] && t < V[12] - 0.04; const panA = panOn ? Math.min(eo(t, V[8], V[8] + 0.3), 1 - eo(t, tPanelCikis[0], tPanelCikis[1])) : 0;
  const [view, kart, fa] = panelDurum(t); const vd = Math.min(dip(t, w(20.2)), dip(t, w(20.7)));
  pScr.material.map = PAN[view]; setOp(panel, panA); pScr.material.opacity = panA * vd; pRing.material.opacity = panA; setOp(stripG, panA);
  { const wv = view === 'sag' ? PD.sag : PD.sol; if (kart) { const k = kartRect(kart); const cxx = (k.x0 + k.x1) / 2, cyy = (k.y0 + k.y1) / 2;
      pFrame.position.set((cxx - (wv.x0 + wv.x1) / 2) * PN.s, -(cyy - (wv.y0 + wv.y1) / 2) * PN.s, 0.9); } fOp(pFrame, panA * fa * vd); }

  /* DOM: başlık (tek katman) */
  let bi = -1, ba = 0;
  for (let i = 0; i < BASLIK.length; i++) { const [a, b] = BASLIK[i]; if (t >= a && t < b) { bi = i; ba = Math.min(i === 0 ? 1 : E(seg(t, a, a + .18)), 1 - E(seg(t, b - .2, b))); } }
  if (t >= HOOK_GERI[0]) { bi = 0; ba = hookIn; }
  if (bi >= 0) { if (el.bas.dataset.i !== String(bi)) { el.bas.dataset.i = String(bi); el.bas.innerHTML = BASLIK[bi][2]; el.bas.style.fontSize = BAS_FONT[bi].fs + 'px'; } fadeEl(el.bas, ba); } else fadeEl(el.bas, 0);
  // CTA: logo + URL (sağ sütun)
  const ca = t >= CTA_ACIK && !loop ? eo(t, CTA_ACIK, CTA_ACIK + .4) * fo : 0; fadeEl(el.logo, ca); fadeEl(el.adres, ca);
  // rozet + çipler (satır büyüteci ile birlikte)
  const ra = t >= tTR && t < V[8] ? Math.min(eo(t, tTR, tTR + 0.3), 1 - eo(t, tCikis[0], tCikis[1])) : 0;
  fadeEl(el.badge, ra); [['cTR', 'tr'], ['cEN', 'en'], ['cDE', 'de'], ['cFR', 'fr']].forEach(([id, k]) => { fadeEl(el[id], ra); el[id].classList.toggle('on', lang === k && ra > 0); });

  renderer.render(scene, cam);
  return true;
}
window.frame = frame;
function phItemPos(yTex) { return { x: ((ODAK_DD().kutuYanal.x0 + ODAK_DD().kutuYanal.x1) / 2 - EPX) * PS, y: -(yTex - EPY) * PS }; }

/* ───────── otomatik yerleşim testi için ölçümler ───────── */
const _v = new THREE.Vector3();
function ekranRect(obj) { obj.updateWorldMatrix(true, true); const b = new THREE.Box3(); b.setFromObject(obj, true); if (b.isEmpty()) return null; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) { _v.set(x, y, z).project(cam); const sx = (_v.x * .5 + .5) * W, sy = (-_v.y * .5 + .5) * H; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
  return { x0, x1, y0, y1 }; }
function gorunur3(obj) { let v = obj.visible; for (let p = obj.parent; p; p = p.parent) v = v && p.visible; return v; }
const rectOf = (n) => { const r = n.getBoundingClientRect(); return { x0: r.left, x1: r.right, y0: r.top, y1: r.bottom }; };
const bbox2d = (cx, cy, w, h) => ({ x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 });
window.__layout = (t) => {
  frame(t); const out = [];
  const opa = (e) => parseFloat(e.style.opacity || '0');
  // başlık (tek metin katmanı)
  { const e = el.bas, a = opa(e); if (a > 0.05) { const r = rectOf(e), cs = getComputedStyle(e);
    out.push({ id: 'bas', kind: 'baslik', rect: r, alpha: a, font: parseFloat(cs.fontSize), color: cs.color, text: e.textContent.trim(), tasma: e.scrollWidth > e.clientWidth + 1 || /…|\.\.\./.test(e.textContent) || r.x1 > L.S.x1 + 0.5, satir: Math.round(e.offsetHeight / (parseFloat(cs.fontSize) * 1.1)) }); } }
  for (const [id, kind] of [['badge', 'rozet'], ['cTR', 'cip'], ['cEN', 'cip'], ['cDE', 'cip'], ['cFR', 'cip'], ['logo', 'logo']]) { const e = el[id], a = opa(e); if (!(a > 0.05)) continue; const cs = getComputedStyle(e);
    out.push({ id, kind, rect: rectOf(e), alpha: a, font: kind === 'logo' ? null : parseFloat(cs.fontSize), color: cs.color, text: (e.textContent || '').trim(), genislik: e.getBoundingClientRect().width }); }
  { const e = el.adres, a = opa(e); if (a > 0.05) { const cs = getComputedStyle(e); const sp = [...e.querySelectorAll('span')].map((s) => { const rg = document.createRange(); rg.selectNodeContents(s); const q = rg.getBoundingClientRect(); return q.right; });
    out.push({ id: 'adres', kind: 'url', rect: rectOf(e), alpha: a, font: parseFloat(cs.fontSize), color: cs.color, text: e.textContent.trim(), tasma: Math.max(...sp) > L.LENS.x1 + 0.5 }); } }
  // medya
  const gorunurTel = phone.userData.a > 0.05 && gorunur3(phone);
  if (gorunurTel) { const r = ekranRect(pbody); if (r) out.push({ id: 'telefon', kind: 'medya', rect: r, alpha: phone.userData.a, rol: 'telefon' }); }
  if (gorunur3(panel) && panel.userData.a > 0.05) out.push({ id: 'panel', kind: 'medya', rect: bbox2d(L.MEDYA.cx, L.PANEL.cy, L.PANEL.w, L.PANEL.h), alpha: panel.userData.a, rol: 'panel', pencere: panelDurum(t)[0] });
  if (stripG.userData.a > 0.05 && gorunur3(stripG)) out.push({ id: 'panel-serit', kind: 'medya', rect: bbox2d(L.PANEL.serit.x0 + L.PANEL.serit.w / 2, L.PANEL.serit.y0 + L.PANEL.serit.h / 2, L.PANEL.serit.w, L.PANEL.serit.h), alpha: stripG.userData.a, rol: 'panel-serit' });
  const ln = [['lens-dd', lensDD, L.LENS.ddH, lensY.dd, 'dd', L.LENS.ddW], ['lens-satir', lensRows, L.LENS.satirH, lensY.rows, 'satir'], ['lens-cta', lensCTA, L.LENS.ctaH, lensY.cta, 'cta']];
  for (const [id, g, h, cy, tur, ww] of ln) if (g.userData.a > 0.05 && gorunur3(g)) out.push({ id, kind: 'medya', rect: bbox2d(ww ? LX + ww / 2 : LCX, cy, ww || L.LENS.w, h), alpha: g.userData.a, rol: 'lens', tur });
  if (gorunur3(root12)) for (const [id, o] of [['masaA', tableA], ['misafir', turist], ['garson', garson]]) { if (!gorunur3(o) || !(o.userData.a > 0.05)) continue; const r = ekranRect(o); if (r) out.push({ id, kind: 'sahne', rect: r, alpha: o.userData.a }); }
  if (gorunur3(root12)) for (const [id, o, sahip] of [['balon_misafir', turist.userData.q, 'misafir'], ['balon_garson', garson.userData.b, 'garson']]) { if (!gorunur3(o) || !(o.parent.userData.a > 0.05)) continue; const r = ekranRect(o); if (r) out.push({ id, kind: 'balon', sahip, rect: r, alpha: o.parent.userData.a }); }
  // pencere/ekran durumu
  const dil = aktifDil(t); const faz = { telefon: (() => { let k = SIRA[0][1]; for (const [a, kk] of SIRA) if (t >= a) k = kk; return k; })(), dil };
  const pencereler = [];
  if (lensDD.userData.a > 0.05) pencereler.push({ id: 'lens-dd', ekran: '02', win: ddWin, alpha: lensDD.userData.a });
  if (lensRows.userData.a > 0.05) pencereler.push({ id: 'lens-satir', ekran: dil, win: ODAK.ekranlar[dil].pencereSatir, alpha: lensRows.userData.a });
  if (lensCTA.userData.a > 0.05) pencereler.push({ id: 'lens-cta', ekran: '02', win: ctaWin, alpha: lensCTA.userData.a });
  if (panel.userData.a > 0.05 && panelDurum(t)[0]) { const v = panelDurum(t)[0]; pencereler.push({ id: 'panel', ekran: 'panel', pencere: v, win: v === 'sag' ? PD.sag : PD.sol, alpha: panel.userData.a * Math.min(dip(t, 20.2), dip(t, 20.7)) }); }
  if (stripG.userData.a > 0.05) pencereler.push({ id: 'panel-serit', ekran: 'panel', pencere: 'serit', win: PD.serit, alpha: stripG.userData.a });
  return { t, ogeler: out, faz, pencereler, ekranMetin: { lens_px: LS, panel_s: PN.s }, aktifBaslik: el.bas.dataset.i };
};
window.__uv = () => UVLOG;
window.__olcek = { lens_s: LS, panel_s: PN.s, telefon_ekran_olcek: PS, panel_alt_yazi_px: PAN_METIN_PX };
window.blank = () => { root12.visible = false; phone.visible = false; panel.visible = false; stripG.visible = false; for (const g of [lensDD, lensRows, lensCTA]) g.visible = false; for (const m of [phItem, lensFrame.dd, lensFrame.cta, pFrame, link, nodeA, nodeB, ...Object.values(phRows)]) m.visible = false; Object.values(el).forEach((n) => { n.style.opacity = '0'; }); renderer.render(scene, cam); return true; };


/* ───────── kapak (1080×1920): v4/v5 3B sahnesinin aynı malzemesi; yeni karakter/stil yok ───────── */
window.kapakKur = (opt = {}) => {
  const K = L.KAPAK; frame(V[2] - 0.3);                                   // garson + turist + balonlar yerinde, turist geri çekilmeden
  for (const g of [phone, panel, stripG, lensDD, lensRows, lensCTA]) g.visible = false;
  for (const m of [phItem, lensFrame.dd, lensFrame.cta, pFrame, link, nodeA, nodeB]) m.visible = false;
  Object.values(el).forEach((n) => { n.style.opacity = '0'; });
  root12.visible = true; setOp(tableA, 1); setOp(turist, 1); setOp(garson, 1);
  const hepsi = () => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const o of [tableA, turist, garson, turist.userData.q, garson.userData.b]) { const r = ekranRect(o); x0 = Math.min(x0, r.x0); x1 = Math.max(x1, r.x1); y0 = Math.min(y0, r.y0); y1 = Math.max(y1, r.y1); } return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0 }; };
  let yay = opt.yay ?? 0; const hedefH = K.grupY[1] - K.grupY[0]; let r;
  for (let i = 0; i < 40; i++) {                                         // genişlik ≥ 760 ve yükseklik = 560 olana dek yayılımı artır / ölçekle
    garson.position.x = OFS.garson[0] - yay; turist.position.x = OFS.turist[0] + yay; tableA.position.x = OFS.A[0];
    root12.scale.setScalar(1); root12.position.set(0, 0, 0); r = hepsi(); const sc = hedefH / r.h; root12.scale.setScalar(sc); r = hepsi();
    if (r.w >= (opt.minW ?? 770)) break; yay += 12;
  }
  for (let j = 0; j < 4; j++) { const dx = L.MEDYA.cx - (r.x0 + r.x1) / 2, dy = (K.grupY[0] + K.grupY[1]) / 2 - (r.y0 + r.y1) / 2; root12.position.x += dx; root12.position.y -= dy; root12.scale.setScalar(root12.scale.x * hedefH / r.h); r = hepsi(); }
  renderer.render(scene, cam);
  // metin + hap + logo (DOM)
  const b = el.bas; b.style.left = '65px'; b.style.width = '950px'; b.style.top = K.baslikY[0] + 'px'; b.style.letterSpacing = '-.035em'; b.style.textWrap = 'nowrap'; b.innerHTML = '<span style="color:#F4F1E8">Yabancı misafir geldi.</span><br><span style="color:#C9A84C">Menüyü kim anlatacak?</span>'; b.style.whiteSpace = 'nowrap';
  let fs = 110; b.style.fontSize = fs + 'px'; b.style.lineHeight = '1.1'; while (b.scrollWidth > 950 && fs > 60) { fs -= 1; b.style.fontSize = fs + 'px'; } b.style.opacity = '1';
  const pill = document.getElementById('pill'); Object.assign(pill.style, { opacity: '1', fontSize: '48px', height: '76px', padding: '0 40px', top: K.pilY + 'px' }); pill.style.left = (L.MEDYA.cx - pill.getBoundingClientRect().width / 2) + 'px';
  Object.assign(el.logo.style, { opacity: '1', left: (L.MEDYA.cx - K.logoW / 2) + 'px', top: (K.logoY - K.logoW / 3.365 / 2) + 'px', width: K.logoW + 'px', height: 'auto' });
  const st = document.getElementById('stage'); const vin = document.createElement('div'); vin.style.cssText = 'position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 75% 70% at 50% 46%,rgba(0,0,0,0) 55%,rgba(2,12,8,.42) 100%)'; st.appendChild(vin);
  const R2 = (n) => { const q = n.getBoundingClientRect(); return { x0: q.left, x1: q.right, y0: q.top, y1: q.bottom }; };
  const rg = document.createRange(); rg.selectNodeContents(b); const tb = rg.getBoundingClientRect();
  return { grup: r, baslikPx: fs, baslik: { x0: tb.left, x1: tb.right, y0: tb.top, y1: tb.bottom }, pil: R2(pill), logo: R2(el.logo), yay };
};


/* ───────── kapak v2 (A/B/C): yakın kadraj, abartılı garson, büyük "?" balonu; aynı v5 3B malzemesi ───────── */
window.kapakKur2 = (opt = {}) => {
  frame(V[2] - 0.3);
  for (const g of [phone, panel, stripG, lensDD, lensRows, lensCTA]) g.visible = false;
  for (const m of [phItem, lensFrame.dd, lensFrame.cta, pFrame, link, nodeA, nodeB]) m.visible = false;
  Object.values(el).forEach((n) => { n.style.opacity = '0'; });
  root12.visible = true; setOp(tableA, 1); setOp(turist, 1); setOp(garson, 1);
  garson.userData.armR.rotation.z = 2.25; garson.userData.armL.rotation.z = -2.25;      // kollar iki yanda, bunalmış
  garson.scale.setScalar(1.06); turist.userData.q.scale.setScalar(1.55); garson.userData.b.scale.setScalar(1.15);
  turist.userData.q.position.set(-6, 262 + 40, 14);
  const parts = () => [tableA, turist, garson, turist.userData.q, garson.userData.b];
  const hepsi = () => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const o of parts()) { const r = ekranRect(o); x0 = Math.min(x0, r.x0); x1 = Math.max(x1, r.x1); y0 = Math.min(y0, r.y0); y1 = Math.max(y1, r.y1); } return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0 }; };
  const gy = opt.grupY || [905, 1520], hedefH = gy[1] - gy[0]; let yay = 0, r;
  for (let i = 0; i < 60; i++) { garson.position.x = OFS.garson[0] - yay; turist.position.x = OFS.turist[0] + yay; root12.scale.setScalar(1); root12.position.set(0, 0, 0); r = hepsi(); root12.scale.setScalar(hedefH / r.h); r = hepsi(); if (r.w >= (opt.minW || 920)) break; yay += 10; }
  for (let j = 0; j < 4; j++) { const dx = L.MEDYA.cx - (r.x0 + r.x1) / 2, dy = (gy[0] + gy[1]) / 2 - (r.y0 + r.y1) / 2; root12.position.x += dx; root12.position.y -= dy; root12.scale.setScalar(root12.scale.x * hedefH / r.h); r = hepsi(); }
  const qr = ekranRect(turist.userData.q), br = ekranRect(garson.userData.b);
  // metin
  const b = el.bas, W2 = opt.genislik || 950; Object.assign(b.style, { left: ((1080 - W2) / 2) + 'px', width: W2 + 'px', top: opt.metinY + 'px', letterSpacing: '-.058em', textWrap: 'nowrap', whiteSpace: 'nowrap', lineHeight: '0.98', textAlign: 'center', opacity: '1' });
  b.innerHTML = opt.html; let fs = 230; b.style.fontSize = fs + 'px'; while (b.scrollWidth > W2 && fs > 60) { fs -= 1; b.style.fontSize = fs + 'px'; }
  const rg = document.createRange(); rg.selectNodeContents(b); const tb = rg.getBoundingClientRect();
  const pill = document.getElementById('pill'); pill.textContent = 'RESTORAN SAHİBİ İÇİN'; Object.assign(pill.style, { opacity: '1', fontSize: '46px', height: '76px', padding: '0 44px', top: opt.pilY + 'px', letterSpacing: '.06em' }); pill.style.left = (540 - pill.getBoundingClientRect().width / 2) + 'px';
  Object.assign(el.logo.style, { opacity: '1', left: (540 - 135) + 'px', top: opt.logoY + 'px', width: '270px', height: 'auto' });
  const st = document.getElementById('stage');
  const glow = document.createElement('div'); glow.style.cssText = `position:absolute;left:0;top:${(tb.top + tb.bottom) / 2 - 520}px;width:1080px;height:1040px;pointer-events:none;background:radial-gradient(ellipse 52% 46% at 50% 50%,rgba(70,150,118,.55) 0%,rgba(40,100,78,.28) 45%,rgba(0,0,0,0) 100%)`; st.insertBefore(glow, document.getElementById('gl'));
  const vin = document.createElement('div'); vin.style.cssText = 'position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 75% 70% at 50% 46%,rgba(0,0,0,0) 55%,rgba(2,12,8,.42) 100%)'; st.appendChild(vin);
  renderer.render(scene, cam);
  const R2 = (n) => { const q = n.getBoundingClientRect(); return { x0: q.left, x1: q.right, y0: q.top, y1: q.bottom }; };
  const alt = (e) => ({ x0: e.x0, x1: e.x1, y0: e.y0, y1: e.y1 });
  return { grup: r, soruBalonu: { w: qr.x1 - qr.x0, h: qr.y1 - qr.y0, ...alt(qr) }, garsonBalon: alt(br), metinPx: fs, metin: { x0: tb.left, x1: tb.right, y0: tb.top, y1: tb.bottom }, pil: R2(pill), logo: R2(el.logo), yay };
};

/* ───────── yükleme ───────── */
for (const k of ['01', '02', ...KEYS]) { const b = await loadU(`/tex/e-${k}.jpg`); TEX[k] = b; }
TEX.panel = await loadU('/tex/panel.jpg');
for (const k of ['01', '02', ...KEYS]) PT[k] = pencere(TEX[k], 'telefon-' + k, EP.x0, EP.y0, EP.x1, EP.y1, EW, EH);
for (const k of KEYS) { const w = ODAK.ekranlar[k].pencereSatir; LT[k] = { satir: pencere(TEX[k], 'lens-satir-' + k, w.x0, w.y0, w.x1, w.y1, EW, EH) }; }
lensDD.userData.m.material.map = pencere(TEX['02'], 'lens-dd', ddWin.x0, ddWin.y0, ddWin.x1, ddWin.y1, EW, EH);
lensCTA.userData.m.material.map = pencere(TEX['02'], 'lens-cta', ctaWin.x0, ctaWin.y0, ctaWin.x1, ctaWin.y1, EW, EH);
lensRows.userData.m.material.map = LT.tr.satir;
scrA.material.map = PT['01']; scrB.material.map = PT['02'];
for (const g of [lensDD, lensRows, lensCTA]) setOp(g, 0);
for (const [ad, w] of [['sol', PD.sol], ['sag', PD.sag]]) PAN[ad] = pencere(TEX.panel, 'panel-' + ad, (w.x0 - PD.css_x0) * 2, (w.y0 - PD.css_y0) * 2, (w.x1 - PD.css_x0) * 2, (w.y1 - PD.css_y0) * 2, PTW, PTH);
pScr.material.map = PAN.sol;
{ const sr = PD.serit; stripG.userData.m.material.map = pencere(TEX.panel, 'panel-serit', (sr.x0 - PD.css_x0) * 2, (sr.y0 - PD.css_y0) * 2, (sr.x1 - PD.css_x0) * 2, (sr.y1 - PD.css_y0) * 2, PTW, PTH); }
hazir = true; window.hazir = true;
