// Çoklu Dil Reels v3 — 28 sn, 1080×1920, 30 fps. Kare kare render: window.frame(t) (t = saniye).
// v3: yerleşim sistemi (layout.js) tek kaynak; kamera SABİT; yakınlaştırma yalnızca medya penceresinin İÇİNDE (doku penceresi);
// telefon ölçeği tüm sahnelerde aynı. 3B yalnızca yönlendirme içindir; ürün ekranları gerçek ekran görüntüleridir.
import * as THREE from 'three';
import * as L from '/layout.js';

await Promise.all([document.fonts.load('800 60px Manrope'), document.fonts.load('700 40px Manrope'), document.fonts.load('800 190px Manrope')]);
await document.fonts.ready;
const { W, H } = L.CANVAS, TOPLAM = L.CANVAS.SURE;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
function bez(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (t) => { if (t <= 0) return 0; if (t >= 1) return 1; let u = t;
    for (let i = 0; i < 10; i++) { const x = ((ax * u + bx) * u + cx) * u - t; const dx = (3 * ax * u + 2 * bx) * u + cx; if (Math.abs(x) < 1e-6) break; u -= x / dx; }
    return ((ay * u + by) * u + cy) * u; };
}
const E = bez(.22, 1, .36, 1);                    // ease-out cubic-bezier(.22,1,.36,1)
const eo = (t, a, b) => E(seg(t, a, b));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (x) => x * x * (3 - 2 * x);

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

/* ───────── pencere içi yakınlaştırma: doku penceresi (UV) ───────── */
function uvPencere(tex, k, cx, cy, tw = 1, th = 1) {     // k büyütme; (cx,cy) pencere merkezi (dokuda 0–1, y aşağı); tw/th: pencerenin k=1'de dokuya oranı
  const rw = tw / k, rh = th / k;
  cx = clamp(cx, rw / 2, 1 - rw / 2); cy = clamp(cy, rh / 2, 1 - rh / 2);
  tex.repeat.set(rw, rh); tex.offset.set(cx - rw / 2, 1 - (cy + rh / 2)); tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping; tex.needsUpdate = false;
  return { cx, cy, rw, rh };
}

/* ───────── sahne 1–3: hook + acı (medya bandı içinde, S'in içinde) ───────── */
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
// konumlar: medya merkezine göre piksel ofsetleri (layout.js'ten türetilir; elle mutlak koordinat yok)
const OFS = { A: [-10, 36], turist: [200, 100], garson: [-252, 100] };
const wpos = (o) => L.dunya(L.MEDYA.cx + o[0], L.MEDYA.cy + o[1]);
tableA.userData.p = wpos(OFS.A); tableA.position.set(tableA.userData.p.x, tableA.userData.p.y, 0);
const pT = wpos(OFS.turist), pG = wpos(OFS.garson);

/* ───────── telefon: sabit gövde, iki ekran düzlemi (çapraz geçiş), pencere içi zoom ───────── */
const TP = L.TELEFON, PW = TP.ekranW, PH = TP.ekranH;
const phone = new THREE.Group(); scene.add(phone);
const pbody = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(TP.w, TP.h, TP.kose), { depth: 20, bevelEnabled: true, bevelThickness: 5, bevelSize: 5, bevelSegments: 5, curveSegments: 28 }), mat(0x0b1210, { metalness: .75, roughness: .32 }));
pbody.position.z = -10; phone.add(pbody);
const pivot = new THREE.Group(); pivot.position.z = 16.6; phone.add(pivot);
const ekranMask = maskTex(PW, PH, TP.ekranKose);
const mkScr = (z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, alphaMap: ekranMask })); m.position.z = z; pivot.add(m); return m; };
const scrA = mkScr(0), scrB = mkScr(0.3);
const KEYS = ['tr', 'en', 'de', 'fr'];
const kareMesh = {}, kareRect = {};
const ZK = L.TELEFON.zoom;
function listeOdak(key) { const o = ODAK[key]; return uvPencere({ repeat: { set() {} }, offset: { set() {} } }, ZK, o.cx, o.cy); }
for (const k of KEYS) {                               // dil başına bir vurgu çerçevesi (k sabit → boyut sabit); pencere içinde kalır
  const o = ODAK[k], p = listeOdak(k), kr = o.kare;
  const x0 = Math.max(kr.x0, p.cx - p.rw / 2 + 12 / 860), x1 = Math.min(kr.x1, p.cx + p.rw / 2 - 12 / 860), y0 = Math.max(kr.y0, p.cy - p.rh / 2 + 12 / ODAK.TH), y1 = Math.min(kr.y1, p.cy + p.rh / 2 - 12 / ODAK.TH);
  const bx = ((x0 + x1) / 2 - p.cx) / p.rw * PW, by = -(((y0 + y1) / 2 - p.cy) / p.rh) * PH, bw = (x1 - x0) / p.rw * PW, bh = (y1 - y0) / p.rh * PH;
  const m = goldFrame(bw, bh); m.position.set(bx, by, 0.9); pivot.add(m); kareMesh[k] = m; kareRect[k] = { bx, by, bw, bh };
}
// CTA / kanıt metni boyutu (ekran-eşdeğeri px): doku px × (ekran px / doku px) × zoom
const TEX_W = 860, S0 = PW / TEX_W;
const EKRAN_METIN = { urun_adi_px: ODAK.tr.ad_yukseklik_px / 0.72 * S0 * ZK, urun_aciklama_px: ODAK.tr.ac_yukseklik_px / 0.72 * S0 * ZK };

/* ───────── panel penceresi 780×500 (yuvarlatılmış), içeride dolly ───────── */
const PN = L.PANEL;
const panel = new THREE.Group(); scene.add(panel);
const pMask = maskTex(PN.w, PN.h, PN.kose);
const pScr = new THREE.Mesh(new THREE.PlaneGeometry(PN.w, PN.h), new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, alphaMap: pMask })); panel.add(pScr);
const pRing = new THREE.Mesh(new THREE.PlaneGeometry(PN.w, PN.h), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, map: canvasTex(PN.w * 1.5, PN.h * 1.5, (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h); ctx.strokeStyle = 'rgba(201,168,76,.9)'; ctx.lineWidth = 7; rr(ctx, 3.5, 3.5, w - 7, h - 7, PN.kose * 1.5); ctx.stroke(); }) })); pRing.position.z = 0.6; panel.add(pRing);
const PCSS = ODAK.panel, PTW = PCSS.css_x1 - PCSS.css_x0, PTH = PCSS.css_y1 - PCSS.css_y0;     // doku = css 130–1280 × 0–800
const PBAZ_W = PN.bazCssGenislik, PBAZ_H = PN.h / (PN.w / PBAZ_W);                              // k=1'de pencerenin kapsadığı css alanı
const PXCSS = PN.w / PBAZ_W;                                                                       // k=1 piksel/css
function panelUV(tex, k, cssX, cssY) { return uvPencere(tex, k, (cssX - PCSS.css_x0) / PTW, (cssY - PCSS.css_y0) / PTH, PBAZ_W / PTW, PBAZ_H / PTH); }
const cardC = (b) => [b.x + b.w / 2, b.y + b.h / 2];
const C_DILLER = cardC(BOX.diller), C_DISA = cardC(BOX.csvDisa), C_ICE = cardC(BOX.csvIce), C_WIDE = [700, 280];
const pFrame = goldFrame((BOX.diller.w + 14) * PXCSS * PN.zoomKart, (BOX.diller.h + 14) * PXCSS * PN.zoomKart); pFrame.position.z = 0.9; panel.add(pFrame);
const PANEL_METIN_PX = 34 / 2 / 0.74 * PXCSS * PN.zoomKart;                                         // kart başlığı: satır yüksekliği 34 (2×px) → css 17 → yazı ≈ 17/0.74 css
const PANEL_ASC_PX = 17 * PXCSS * PN.zoomKart;

/* ───────── DOM (konumlar layout.js'ten) ───────── */
const $ = (id) => document.getElementById(id);
const el = {}; ['h1', 'h2a', 'h2b', 'h3', 'h5', 'h6a', 'cta', 'h6b', 'adres', 'logo', 'ok', 'badge', 'cTR', 'cEN', 'cDE', 'cFR', 'c0'].forEach((k) => { el[k] = $(k); });
const BASLIKLAR = ['h1', 'h2a', 'h2b', 'h3', 'h5', 'h6a'];
BASLIKLAR.forEach((k) => { Object.assign(el[k].style, { left: L.S.x0 + 'px', width: L.S.w + 'px', top: L.BAND.baslik.y0 + 'px' }); });
Object.assign(el.cta.style, { left: L.S.x0 + 'px', width: L.S.w + 'px', top: L.CTA_BASLIK_Y0 + 'px' });
Object.assign(el.c0.style, { left: L.ALTYAZI_PLAKA.x0 + 'px', width: (L.ALTYAZI_PLAKA.x1 - L.ALTYAZI_PLAKA.x0) + 'px', top: L.ALTYAZI_PLAKA.y0 + 'px', height: (L.ALTYAZI_PLAKA.y1 - L.ALTYAZI_PLAKA.y0) + 'px' });
Object.assign(el.ok.style, { left: L.S.x0 + 'px', top: L.LOGO.y0 + 'px', width: L.LOGO.h + 'px', height: L.LOGO.h + 'px' });
Object.assign(el.logo.style, { left: (L.S.x0 + L.LOGO.h + 16) + 'px', top: L.LOGO.y0 + 'px', height: L.LOGO.h + 'px', width: 'auto' });
{ // rozet + dil çipleri: tek satır, ortalı
  const satir = [el.badge, el.cTR, el.cEN, el.cDE, el.cFR]; const gaps = [22, 10, 10, 10];
  satir.forEach((n) => { n.style.top = L.ROZET_SATIRI.y0 + 'px'; n.style.height = L.ROZET_SATIRI.h + 'px'; });
  const ws = satir.map((n) => n.getBoundingClientRect().width); const tot = ws.reduce((a, b) => a + b, 0) + gaps.reduce((a, b) => a + b, 0);
  let x = L.MEDYA.cx - tot / 2; satir.forEach((n, i) => { n.style.left = x + 'px'; x += ws[i] + (gaps[i] || 0); });
}
function show(node, t, a, b, { inn = .45, out = .4, hold = false } = {}) {
  const k = Math.min(E(seg(t, a, a + inn)), hold ? 1 : 1 - E(seg(t, b - out, b)));
  node.style.opacity = ((t >= a && (hold || t <= b)) ? k : 0).toFixed(3);
}

/* Metin katmanı kuralı: büyük başlık = kilit ifade (söylenen cümlenin kendisi); altyazı = başlıkta OLMAYAN söylenen cümle. Başlık ile altyazı aynı cümleyi taşımaz.
   Birleşik sıra (başlıklar + altyazılar) ses-metni.md "Düz metin" ile kelime kelime eşittir. */
const BASLIK = [   // [başlangıç, bitiş, id, söylenen cümle]
  [0.0, 2.6, 'h1', 'Yabancı misafir geldi. Menüyü kim anlatacak?'],
  [2.65, 5.4, 'h2a', 'Garsonunuz tercümana dönüşüyor, diğer masalar bekliyor.'],
  [5.5, 8.0, 'h2b', 'Anlamayan misafir de sormaya çekinir.'],
  [8.0, 10.0, 'h3', 'Çözüm menünün kendisinde.'],
  [17.0, 22.4, 'h5', 'Bu, Çoklu Dil modülü.'],
  [22.6, 23.5, 'h6a', 'Garsonunuz servise dönsün.'],
];
const KAPTAN = [   // [başlangıç, bitiş, cümle] — yalnızca ALTYAZI bandında, tek satır; her cümle önce tamamen söner (0,2 sn), sonra yenisi gelir
  [10.0, 12.6, 'Misafir QR’ı okutur, dilini seçer.'],
  [12.6, 14.8, 'Ürün adı, açıklama, kategori,'],
  [14.8, 17.0, 'hepsi kendi dilinde açılır.'],
  [18.4, 19.6, 'Dilleri siz tanımlarsınız.'],
  [19.6, 20.9, 'Çevirileri elle ya da CSV ile girersiniz.'],
  [20.9, 22.55, 'Otuz dile kadar.'],
  [23.5, 24.6, 'Aynı menüyü kendi telefonunuzda deneyin,'],
  [24.6, 25.7, 'dil seçiciyi siz değiştirin.'],
  [25.7, 26.7, 'Bağlantı profilimizde.'],
];
const CTA_ACIK = 23.9, CTA_KAPAN = [26.6, 27.1], HOOK_GERI = [27.2, 27.9];
window.__kaptan = KAPTAN; window.__baslik = BASLIK;

/* telefon ekran dizisi — her değişim 0,5 sn çapraz geçiş; gövde ve boyut sabit */
const SIRA = [[0, 'p02'], [11.7, 'tr'], [13.0, 'en'], [14.5, 'de'], [15.8, 'fr'], [23.1, 'tr'], [25.4, 'en']];
const XF = 0.5;
const TEX = {};
function durum(key, t0, t) {                           // bir ekranın pencere durumu (zoom/odak)
  if (key === 'p02') return { k: 1, cx: .5, cy: .5 };
  const o = ODAK[key]; if (key === 'tr' && Math.abs(t0 - 11.7) < 1e-6) { const p = eo(t, 11.7, 12.7); return { k: lerp(1, ZK, p), cx: lerp(.5, o.cx, p), cy: lerp(.5, o.cy, p) }; }
  return { k: ZK, cx: o.cx, cy: o.cy };
}
function telefonKaresi(t) {
  let idx = 0; for (let i = 0; i < SIRA.length; i++) if (t >= SIRA[i][0]) idx = i;
  const kA = SIRA[Math.max(0, idx - 1)], kB = SIRA[idx];
  const xf = idx > 0 && t < kB[0] + XF; const mix = xf ? smooth((t - kB[0]) / XF) : 1;
  const texKey = (k) => (k === 'p02' ? 'p02' : 'p-' + k);
  const sB = durum(kB[1], kB[0], t), sA = xf ? durum(kA[1], kA[0], kB[0] + XF) : sB;
  if (xf) { uvPencere(TEX[texKey(kA[1])], sA.k, sA.cx, sA.cy); scrA.material.map = TEX[texKey(kA[1])]; } else { scrA.material.map = TEX[texKey(kB[1])]; }
  uvPencere(TEX[texKey(kB[1])], sB.k, sB.cx, sB.cy);
  if (xf) { scrB.material.map = TEX[texKey(kB[1])]; } else { uvPencere(TEX[texKey(kB[1])], sB.k, sB.cx, sB.cy); }
  scrA.material.opacity = 1; scrB.material.opacity = xf ? mix : 1; scrB.visible = xf;
  return { cur: kB[1], since: t - kB[0], xf };
}

/* ───────── kare ───────── */
let hazir = false;
const FR_SETTLE = 0.55;
function frame(t) {
  if (!hazir) throw new Error('dokular hazır değil');
  t = clamp(t, 0, TOPLAM);
  const fo = 1 - smooth(seg(t, CTA_KAPAN[0], CTA_KAPAN[1]));        // CTA katmanları 26,6–27,1'de söner
  const hookIn = t >= HOOK_GERI[0] ? eo(t, HOOK_GERI[0], HOOK_GERI[1]) : 0;
  const ts = t >= 27.15 ? 0 : t;                                       // sahne 1 durumu (t=28'de t=0 ile aynı)

  /* sahne 1–3 */
  const on12 = ts < 8.7 || t >= 27.15; const a12 = t >= 27.15 ? hookIn : 1 - eo(t, 8.0, 8.7);
  root12.visible = on12;
  tableA.rotation.y = .1 * Math.sin(ts * .6);
  const geri = eo(ts, 5.0, 7.8);
  turist.position.set(pT.x + 24 * geri, pT.y + 8 * geri, 30 - 140 * geri);
  turist.userData.armR.rotation.z = -1.78 + Math.sin(ts * 2.3) * .07 + .35 * geri;
  turist.userData.menu.position.set(-168 + 10 * Math.sin(ts * 2.3), 104, 34); turist.userData.menu.rotation.set(0, .18, .08 * Math.sin(ts * 2.3));
  turist.userData.q.position.set(-6, 262 + 6 * Math.sin(ts * 3.1), 14);
  const gIn = eo(ts, 2.5, 3.3); garson.position.set(pG.x, pG.y + 6 * Math.sin(ts * 4.2), 40); garson.scale.setScalar(lerp(.86, 1, gIn));
  garson.userData.armR.rotation.z = .55 + Math.sin(ts * 7.2) * .75; garson.userData.armL.rotation.z = -.55 - Math.sin(ts * 7.2 + 1.1) * .75;
  garson.userData.b.position.set(78, 262, 14); const bs = eo(ts, 3.2, 3.7); garson.userData.b.scale.setScalar(Math.max(bs, .001)); garson.userData.b.visible = bs > .01;
  setOp(tableA, on12 ? a12 : 0);
  setOp(turist, on12 ? a12 * lerp(1, .6, geri) : 0); setOp(garson, on12 ? a12 * gIn : 0);

  /* telefon: SABİT boyut/konum; 8,0'da sağdan (S içinde) kayarak opak girer; 17,0'da panelle yer değiştirir; 22,6–23,0'da geri gelir */
  const faz = telefonKaresi(t);
  const phoneVis = (t >= 8.0 && t < 17.4) || (t >= 22.6 && t < 27.15);
  let px = 0, pop = 1;
  if (t < 8.6) { px = lerp(220, 0, eo(t, 8.0, 8.6)); pop = t >= 8.0 ? 1 : 0; }
  if (t >= 17.0 && t < 22.6) pop = 1 - eo(t, 17.0, 17.4);
  if (t >= 22.6 && t < 27.15) pop = eo(t, 22.6, 23.0) * (t >= CTA_KAPAN[0] ? fo : 1);
  const pw = L.dunya(L.MEDYA.cx + px, L.MEDYA.cy);
  phone.position.set(pw.x, pw.y, 0); phone.scale.setScalar(1); phone.rotation.set(-.02, 0, 0);
  setOp(phone, phoneVis ? pop : 0);
  // vurgu çerçevesi: yeni dil ekranı oturunca (zoom pencere içinde)
  for (const k of KEYS) { const m = kareMesh[k]; let fr = 0;
    if (faz.cur === k && !faz.xf && t >= 12.3 && t < 17.0) { const s = faz.since - XF; fr = Math.min(E(seg(s, FR_SETTLE - .5, FR_SETTLE - .2)), 1 - E(seg(s, FR_SETTLE + .05, FR_SETTLE + .2))); }
    m.material.opacity = Math.max(0, fr); m.visible = fr > .01; }

  /* panel penceresi: 780×500; içeride dolly (1,6–2×) — Diller / CSV Dışa Aktar / CSV İçe Aktar */
  const pIn = t >= 17.0 && t < 22.6 ? eo(t, 17.0, 17.4) : 0, pOut = t >= 22.6 && t < 23.0 ? 1 - eo(t, 22.6, 23.0) : 0;
  const panOp = t >= 17.0 && t < 22.6 ? pIn : pOut; const pw2 = L.dunya(L.MEDYA.cx, PN.cy);
  panel.position.set(pw2.x, pw2.y, 0); setOp(panel, panOp);
  const KS = [[17.0, 1, C_WIDE], [18.4, 1, C_WIDE], [19.0, PN.zoomKart, C_DILLER], [19.9, PN.zoomKart, C_DILLER], [20.4, PN.zoomKart, C_DISA], [21.1, PN.zoomKart, C_DISA], [21.5, PN.zoomKart, C_ICE], [22.1, PN.zoomKart, C_ICE], [22.6, 1, C_WIDE]];
  let kk = 1, cc = C_WIDE; for (let i = 0; i < KS.length - 1; i++) if (t >= KS[i][0] && t < KS[i + 1][0]) { const p = eo(t, KS[i][0], KS[i + 1][0]); kk = lerp(KS[i][1], KS[i + 1][1], p); cc = [lerp(KS[i][2][0], KS[i + 1][2][0], p), lerp(KS[i][2][1], KS[i + 1][2][1], p)]; }
  pScr.material.map = TEX.panel; panelUV(TEX.panel, kk, cc[0], cc[1]);
  const pf = Math.max(Math.min(E(seg(t, 19.0, 19.25)), 1 - E(seg(t, 19.7, 19.9))), Math.min(E(seg(t, 20.4, 20.65)), 1 - E(seg(t, 20.9, 21.1))), Math.min(E(seg(t, 21.5, 21.75)), 1 - E(seg(t, 21.9, 22.1))));
  pFrame.material.opacity = t >= 17 && t < 22.6 ? pf : 0; pFrame.visible = pFrame.material.opacity > .01 && panel.visible;

  /* DOM: başlıklar (yalnız opaklık; bant dışına taşma yok) */
  for (const [a, b, id] of BASLIK) { if (id === 'h1') continue; show(el[id], t, a, b, { out: .3 }); }
  if (t < 2.6) { show(el.h1, t, 0, 2.6, { inn: .6, out: .3 }); if (t < .6) el.h1.style.opacity = '1'; }
  else if (t >= HOOK_GERI[0]) el.h1.style.opacity = (t >= HOOK_GERI[1] ? 1 : hookIn).toFixed(3); else el.h1.style.opacity = '0';
  // CTA: başlık + URL tek blok; karartma yok (opaklık ≥ 0,9)
  show(el.cta, t, CTA_ACIK, 27.15, { hold: true, inn: .4 }); el.cta.style.opacity = (parseFloat(el.cta.style.opacity) * fo).toFixed(3);
  show(el.logo, t, CTA_ACIK, 27.15, { hold: true, inn: .4 }); show(el.ok, t, CTA_ACIK, 27.15, { hold: true, inn: .4 });
  [el.logo, el.ok].forEach((n) => { n.style.opacity = (parseFloat(n.style.opacity) * fo).toFixed(3); });
  // rozet + çipler: tek satır (10,3–17,0)
  const aktif = { TR: t >= 11.7 && t < 13.0, EN: t >= 13.0 && t < 14.5, DE: t >= 14.5 && t < 15.8, FR: t >= 15.8 && t < 17.0 };
  show(el.badge, t, 10.3, 17.0, { inn: .4, out: .35 });
  [['cTR', 'TR', 0], ['cEN', 'EN', 1], ['cDE', 'DE', 2], ['cFR', 'FR', 3]].forEach(([id, k, i]) => { show(el[id], t, 10.4 + i * .08, 17.0, { inn: .4, out: .35 }); el[id].classList.toggle('on', !!aktif[k]); });
  // altyazı: eski cümle tamamen söner (0,2 sn), yenisi gelir; iki cümle aynı anda görünmez
  let ct = '', co = 0;
  for (const [a, b, s] of KAPTAN) if (t >= a && t < b) { ct = s; co = Math.min(E(seg(t, a, a + .14)), 1 - E(seg(t, b - .2, b))); }
  if (t >= CTA_KAPAN[0]) co *= fo;
  if (el.c0.dataset.s !== ct) { el.c0.dataset.s = ct; el.c0.textContent = ct; el.c0.style.fontSize = ''; fitCaption(); }
  el.c0.style.opacity = (ct ? co : 0).toFixed(3);

  renderer.render(scene, cam);
  return true;
}
function fitCaption() {                                  // tek satır; 44 → 40 px arasında sığdır
  const e = el.c0; const max = L.TIP.altyazi + 2; let fs = max; e.style.fontSize = fs + 'px';
  while (e.scrollWidth > e.clientWidth - 8 && fs > L.TIP.altyaziMin) { fs -= 1; e.style.fontSize = fs + 'px'; }
}
window.frame = frame;

/* ───────── otomatik yerleşim testi için dışa açılan ölçümler ───────── */
const _v = new THREE.Vector3();
function ekranRect(obj, hedefler) {                      // 3B nesnenin ekran (piksel) sınır kutusu
  obj.updateWorldMatrix(true, true); const b = new THREE.Box3(); b.setFromObject(obj, true);
  if (b.isEmpty()) return null; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) { _v.set(x, y, z).project(cam); const sx = (_v.x * .5 + .5) * W, sy = (-_v.y * .5 + .5) * H; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
  return { x0, x1, y0, y1 };
}
function gorunur3(obj) { let v = obj.visible; for (let p = obj.parent; p; p = p.parent) v = v && p.visible; return v; }
window.__layout = (t) => {
  frame(t); const out = [];
  const dom = [['h1', 'baslik'], ['h2a', 'baslik'], ['h2b', 'baslik'], ['h3', 'baslik'], ['h5', 'baslik'], ['h6a', 'baslik'], ['cta', 'baslik'], ['c0', 'altyazi'], ['badge', 'rozet'], ['cTR', 'cip'], ['cEN', 'cip'], ['cDE', 'cip'], ['cFR', 'cip'], ['logo', 'logo'], ['ok', 'logo']];
  for (const [id, kind] of dom) { const e = el[id]; const a = parseFloat(e.style.opacity || '0'); if (!(a > 0.05)) continue;
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    let rect = { x0: r.left, x1: r.right, y0: r.top, y1: r.bottom };
    if (id === 'c0') { const rg = document.createRange(); rg.selectNodeContents(e); const q = rg.getBoundingClientRect(); rect.metin = { x0: q.left, x1: q.right, y0: q.top, y1: q.bottom }; }
    out.push({ id, kind, rect, alpha: a, font: kind === 'logo' ? null : parseFloat(cs.fontSize), color: cs.color, text: (e.textContent || '').trim().slice(0, 60) });
    if (id === 'cta') { const u = el.adres.getBoundingClientRect(); out.push({ id: 'adres', kind: 'url', rect: { x0: u.left, x1: u.right, y0: u.top, y1: u.bottom }, alpha: a, font: parseFloat(getComputedStyle(el.adres).fontSize), color: getComputedStyle(el.adres).color, text: el.adres.textContent.trim() }); } }
  const m3 = [['telefon', phone, 'medya', pbody], ['panel', panel, 'medya', pScr]];
  for (const [id, grp, kind, ref] of m3) { if (!gorunur3(grp) || !(grp.userData.a > 0.05)) continue; const r = ekranRect(ref, null); if (r) out.push({ id, kind, rect: r, alpha: grp.userData.a }); }
  if (gorunur3(root12)) for (const [id, o] of [['masaA', tableA], ['misafir', turist], ['garson', garson]]) { if (!gorunur3(o) || !(o.userData.a > 0.05)) continue; const r = ekranRect(o, null); if (r) out.push({ id, kind: 'sahne', rect: r, alpha: o.userData.a }); }
  if (gorunur3(root12)) for (const [id, o, sahip] of [['balon_misafir', turist.userData.q, 'misafir'], ['balon_garson', garson.userData.b, 'garson']]) { if (!gorunur3(o) || !(o.parent.userData.a > 0.05)) continue; const r = ekranRect(o, null); if (r) out.push({ id, kind: 'balon', sahip, rect: r, alpha: o.parent.userData.a }); }
  return { t, ogeler: out, ekranMetin: { urun_adi_px: EKRAN_METIN.urun_adi_px, urun_aciklama_px: EKRAN_METIN.urun_aciklama_px, panel_baslik_yazi_px: PANEL_METIN_PX, panel_baslik_govde_px: PANEL_ASC_PX, vurgulanan: phoneVisNow(t) } };
};
function phoneVisNow(t) { return (t >= 12.3 && t < 17.0) ? 'telefon_urun_adi' : (t >= 19.0 && t < 22.1 ? 'panel_kart_basligi' : null); }
window.blank = () => { root12.visible = false; phone.visible = false; panel.visible = false; Object.values(el).forEach((n) => { n.style.opacity = '0'; }); renderer.render(scene, cam); return true; };
window.__olcek = { ...EKRAN_METIN, panel_baslik_yazi_px: PANEL_METIN_PX, panel_baslik_govde_px: PANEL_ASC_PX, zoom_telefon: ZK, zoom_panel: PN.zoomKart };

/* ───────── yükleme ───────── */
TEX.p02 = await loadTex('/tex/p02.jpg'); for (const k of KEYS) TEX['p-' + k] = await loadTex(`/tex/p-${k}.jpg`);
TEX.panel = await loadTex('/tex/panel.jpg');
scrA.material.map = TEX.p02; scrB.material.map = TEX['p-tr'];
hazir = true; window.hazir = true;
