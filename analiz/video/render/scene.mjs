// Çoklu Dil Reels — 28 sn, 1080×1920, 30 fps. Kare kare render: window.frame(t) (t = saniye).
// 3B yalnızca yönlendirme/geçiş içindir; ürün ekranları gerçek ekran görüntüleridir (tex/*.jpg, ekran/*.png kırpımları).
import * as THREE from 'three';

await Promise.all([document.fonts.load('800 60px Manrope'), document.fonts.load('700 40px Manrope'), document.fonts.load('800 190px Manrope')]);
await document.fonts.ready;
const W = 1080, H = 1920;
const TOPLAM = 28;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
function bez(x1, y1, x2, y2) {            // cubic-bezier(.22,1,.36,1) ease-out
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (t) => {
    if (t <= 0) return 0; if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 10; i++) { const x = ((ax * u + bx) * u + cx) * u - t; const dx = (3 * ax * u + 2 * bx) * u + cx; if (Math.abs(x) < 1e-6) break; u -= x / dx; }
    return ((ay * u + by) * u + cy) * u;
  };
}
const E = bez(.22, 1, .36, 1);
const eo = (t, a, b) => E(seg(t, a, b));
const lerp = (a, b, k) => a + (b - a) * k;

/* ───────── renderer / sahne ───────── */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();
const CAMZ = 2400;
const cam = new THREE.PerspectiveCamera(2 * Math.atan(960 / CAMZ) * 180 / Math.PI, W / H, 10, 9000);
cam.position.set(0, 0, CAMZ);
scene.add(new THREE.AmbientLight(0xffffff, 1.05));
const sun = new THREE.DirectionalLight(0xfff3d8, 2.1); sun.position.set(-700, 1100, 1300); scene.add(sun);
const rim = new THREE.PointLight(0xC9A84C, 2.6, 4200, 1.2); rim.position.set(650, 380, -200); scene.add(rim);

const GOLD = 0xC9A84C, KREM = 0xF4F1E8;
const mat = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .62, metalness: .08 }, o));
const px = (x, y) => new THREE.Vector3(x - 540, 960 - y, 0);        // piksel → dünya (z=0)

function setOp(obj, a) {
  obj.traverse((o) => {
    if (!o.material) return;
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    ms.forEach((m) => {
      if (m.userData.base === undefined) m.userData.base = m.opacity;
      m.transparent = true; m.opacity = m.userData.base * a; m.depthWrite = a > 0.98;
    });
  });
  obj.visible = a > 0.004;
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function glyph(text, size, color, weight = 800) {
  const t = canvasTex(256, 256, (ctx, w, h) => { ctx.clearRect(0, 0, w, h); ctx.fillStyle = color; ctx.font = `${weight} ${size}px Manrope`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, w / 2, h / 2 + 6); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
  return m;
}
function roundedShape(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}
function goldFrame(wp, hp) {            // altın vurgu çerçevesi (gerçek arayüz öğesinin üzerine)
  const S = 3;
  const t = canvasTex(Math.ceil(wp * S), Math.ceil(hp * S), (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.shadowColor = 'rgba(201,168,76,.9)'; ctx.shadowBlur = 20; ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 12;
    rr(ctx, 14, 14, w - 28, h - 28, 22); ctx.stroke();
    ctx.shadowBlur = 0; ctx.lineWidth = 6; ctx.strokeStyle = '#F1DFA0'; rr(ctx, 14, 14, w - 28, h - 28, 22); ctx.stroke();
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(wp, hp), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }));
  m.renderOrder = 5; return m;
}

/* ───────── doku yükleme ───────── */
const loader = new THREE.TextureLoader();
const loadTex = (u) => new Promise((res, rej) => loader.load(u, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.minFilter = THREE.LinearMipmapLinearFilter; res(t); }, undefined, rej));
const TEX = {};

/* ───────── sahne nesneleri ───────── */
const root12 = new THREE.Group(); scene.add(root12);      // hook + acı sahnesi
function makeTable(x, y, z, s) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(170, 170, 16, 72), mat(0x1f5a48, { roughness: .5 }));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(170, 4.5, 14, 72), mat(GOLD, { metalness: .55, roughness: .32 })); ring.rotation.x = Math.PI / 2; ring.position.y = 8;
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(20, 32, 170, 28), mat(0x143b2f)); ped.position.y = -92;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(88, 100, 12, 36), mat(0x143b2f)); base.position.y = -182;
  g.add(top, ring, ped, base); g.position.set(x, y, z); g.scale.setScalar(s); g.rotation.x = 0.42; return g;
}
function makePerson(color, opacity = 1, withArms = false) {
  const g = new THREE.Group();
  const m = () => mat(color, { roughness: .8, transparent: opacity < 1, opacity });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(46, 128, 10, 20), m()); body.position.y = 0;
  const head = new THREE.Mesh(new THREE.SphereGeometry(38, 28, 24), m()); head.position.y = 142;
  g.add(body, head);
  if (withArms) {
    const mk = (sx) => { const p = new THREE.Group(); const a = new THREE.Mesh(new THREE.CapsuleGeometry(14, 92, 6, 12), m()); a.position.y = -52; p.add(a); p.position.set(sx * 64, 70, 6); return p; };
    g.userData.armL = mk(-1); g.userData.armR = mk(1); g.add(g.userData.armL, g.userData.armR);
  }
  return g;
}
const tableA = makeTable(-40, 150, 0, 1);
const card = new THREE.Group();
{
  const cb = new THREE.Mesh(new THREE.BoxGeometry(168, 232, 6), mat(KREM, { roughness: .5 }));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(168, 232), new THREE.MeshBasicMaterial({
    map: canvasTex(336, 464, (ctx, w, h) => {
      ctx.fillStyle = '#F4F1E8'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 8; ctx.strokeRect(14, 14, w - 28, h - 28);
      ctx.fillStyle = '#0D2B22'; ctx.font = '800 54px Manrope'; ctx.textAlign = 'center'; ctx.fillText('MENÜ', w / 2, 112);
      ctx.fillStyle = '#C9A84C'; ctx.fillRect(w / 2 - 38, 134, 76, 6);
      ctx.fillStyle = 'rgba(13,43,34,.55)'; for (let i = 0; i < 6; i++) { ctx.fillRect(52, 178 + i * 40, w - 104 - (i % 2) * 60, 12); }
    })
  }));
  face.position.z = 3.2; cb.add(face); card.add(cb);
}
card.rotation.x = -Math.PI / 2; card.rotation.z = 0.32; tableA.add(card);
const turist = makePerson(0x2c6b57, .72); turist.position.set(335, 20, 30);
const qGlyph = glyph('?', 190, '#C9A84C'); qGlyph.position.set(0, 285, 5); turist.add(qGlyph);
const garson = makePerson(0xF4F1E8, 1, true); garson.position.set(-340, 40, 40);
const bub = [glyph('?', 150, '#C9A84C'), glyph('…', 150, '#C9A84C'), glyph('?', 150, '#C9A84C')];
bub[0].position.set(-70, 290, 10); bub[1].position.set(10, 345, 10); bub[2].position.set(95, 285, 10); bub.forEach((b) => garson.add(b));
const tableB = makeTable(-390, 370, -260, .75), tableC = makeTable(345, 430, -320, .72);
const seated = [];
[[tableB, -40], [tableB, 55], [tableC, -45], [tableC, 50]].forEach(([tb, dx]) => {
  const p = new THREE.Mesh(new THREE.SphereGeometry(26, 20, 16), mat(0x5d8f7e, { transparent: true })); p.position.set(dx, 90, 70); tb.add(p); seated.push(p);
});
root12.add(tableA, turist, garson, tableB, tableC);

/* telefon */
const SP = 0.56;                                            // doku pikseli → dünya
const PW = 860 * SP, PH = 1300 * SP;                       // 482 × 728
const phone = new THREE.Group(); scene.add(phone);
const bodyGeo = new THREE.ExtrudeGeometry(roundedShape(PW + 40, PH + 40, 58), { depth: 20, bevelEnabled: true, bevelThickness: 5, bevelSize: 5, bevelSegments: 5, curveSegments: 28 });
const body = new THREE.Mesh(bodyGeo, mat(0x0b1210, { metalness: .75, roughness: .32 })); body.position.z = -10; phone.add(body);
const bezelGold = new THREE.Mesh(new THREE.TorusGeometry(1, 0.001, 4, 4), mat(GOLD)); bezelGold.visible = false; phone.add(bezelGold);
const pivot = new THREE.Group(); pivot.position.z = 16.6; phone.add(pivot);
const screenMat = new THREE.MeshBasicMaterial({ toneMapped: false });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), screenMat); pivot.add(screen);
const notch = new THREE.Mesh(new THREE.CapsuleGeometry(7, 40, 4, 10), mat(0x050807)); notch.rotation.z = Math.PI / 2; notch.position.set(0, PH / 2 - 12, 0.4); pivot.add(notch);
function texRect(x0, y0, x1, y1) { return { x: ((x0 + x1) / 2 / 860 - .5) * PW, y: (.5 - (y0 + y1) / 2 / 1300) * PH, w: (x1 - x0) * SP, h: (y1 - y0) * SP }; }
const rowR = texRect(24, 530, 836, 745);                    // ilk ürün satırı (kırpımda y 400–600; doku y = orijinal − 90)
const rowFrame = goldFrame(rowR.w, rowR.h); rowFrame.position.set(rowR.x, rowR.y, 0.8); pivot.add(rowFrame);

/* tablet */
const PX0 = 262, PCW = 1018, PCH = 420;                    // panel kırpımı (CSS px)
const TW = 880, TH = TW * PCH / PCW;
const tablet = new THREE.Group(); scene.add(tablet);
const tbody = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(TW + 34, TH + 34, 26), { depth: 14, bevelEnabled: true, bevelThickness: 4, bevelSize: 4, bevelSegments: 4, curveSegments: 20 }), mat(0x0b1210, { metalness: .75, roughness: .35 }));
tbody.position.z = -7; tablet.add(tbody);
const tscreen = new THREE.Mesh(new THREE.PlaneGeometry(TW, TH), new THREE.MeshBasicMaterial({ toneMapped: false })); tscreen.position.z = 12.2; tablet.add(tscreen);
const BOX = await (await fetch('/render/boxes.json')).json();
function boxFrame(b, pad = 6) {
  const wp = (b.w + pad * 2) * TW / PCW, hp = (b.h + pad * 2) * TH / PCH;
  const m = goldFrame(wp, hp);
  m.position.set(((b.x + b.w / 2 - PX0) / PCW - .5) * TW, (.5 - (b.y + b.h / 2) / PCH) * TH, 13.2);
  tablet.add(m); return m;
}
const fDiller = boxFrame(BOX.diller), fIce = boxFrame(BOX.csvIce), fDisa = boxFrame(BOX.csvDisa);

/* ───────── DOM yardımcıları ───────── */
const $ = (id) => document.getElementById(id);
const el = { h1: $('h1'), h2a: $('h2a'), h2b: $('h2b'), h3: $('h3'), h5: $('h5'), h6a: $('h6a'), h6b: $('h6b'), adres: $('adres'), logo: $('logo'), ok: $('ok'),
  cTR: $('cTR'), cEN: $('cEN'), cDE: $('cDE'), cFR: $('cFR'), badge: $('badge'), l1: $('l1'), l2: $('l2'), l3: $('l3'), c0: $('c0') };
el.h6a.style.top = '392px'; el.h6b.style.top = '392px'; el.adres.style.top = '606px';
function show(node, t, a, b, { inn = .45, out = .4, dy = 26, hold = false } = {}) {
  const k = Math.min(E(seg(t, a, a + inn)), hold ? 1 : 1 - E(seg(t, b - out, b)));
  const o = (t >= a && (hold || t <= b)) ? k : 0;
  node.style.opacity = o.toFixed(3);
  node.style.transform = `translate3d(0,${((1 - E(seg(t, a, a + inn))) * dy).toFixed(2)}px,0)`;
}

/* altyazı: ses-metni.md ile 1:1 (kelime kelime). Sahne 1 ve 3'te büyük başlık zaten aynı cümledir. */
const KAPTAN = [
  [2.8, 5.4, 'Garsonunuz tercümana dönüşüyor, diğer masalar bekliyor.'],
  [5.5, 8.0, 'Anlamayan misafir de sormaya çekinir.'],
  [10.0, 12.6, 'Misafir QR’ı okutur, dilini seçer.'],
  [12.6, 17.0, 'Ürün adı, açıklama, kategori, hepsi kendi dilinde açılır.'],
  [17.0, 18.7, 'Bu, Çoklu Dil modülü.'],
  [18.7, 20.3, 'Dilleri siz tanımlarsınız.'],
  [20.3, 22.2, 'Çevirileri elle ya da CSV ile girersiniz.'],
  [22.2, 23.0, 'Otuz dile kadar.'],
  [23.0, 24.5, 'Garsonunuz servise dönsün.'],
  [24.5, 27.0, 'Aynı menüyü kendi telefonunuzda deneyin, dil seçiciyi siz değiştirin.'],
  [27.0, 28.0, 'Bağlantı profilimizde.'],
];
window.__kaptan = KAPTAN;

/* telefon ekran dizisi: [başlangıç, anahtar] — her değişimde 0,5 sn çevirme (rotateY 180°) */
const DIZI = [[0, 'p02'], [11.7, 'p03'], [13.0, 'p04'], [14.5, 'p05'], [15.8, 'p06'], [23.4, 'p03'], [25.8, 'p04']];
const FLIP = 0.5;
function ekran(t) {
  let idx = 0; for (let i = 0; i < DIZI.length; i++) if (t >= DIZI[i][0]) idx = i;
  let key = DIZI[idx][1], rot = 0, flipping = false;
  if (idx > 0) {
    const k = (t - DIZI[idx][0]) / FLIP;
    if (k < 1) { flipping = true; if (k < .5) { key = DIZI[idx - 1][1]; rot = Math.PI * k; } else { rot = -Math.PI * (1 - k); } }
  }
  return { key, rot, flipping, since: t - DIZI[idx][0], key2: DIZI[idx][1] };
}

/* ───────── kare ───────── */
let hazir = false;
const camLook = new THREE.Vector3();
function frame(t) {
  if (!hazir) throw new Error('dokular hazır değil');
  t = clamp(t, 0, TOPLAM);
  const so = seg(t, 27.3, 28); const fo = 1 - so * so * (3 - 2 * so);   // son 0,7 sn: sahne 6 öğeleri solar (ilk kareye çapraz geçiş kare sonrası uygulanır)

  /* kamera */
  let cx = 0, cy = 0, cz = CAMZ;
  if (t < 8.0) cz = CAMZ - 90 * seg(t, 0, 8.0);
  else if (t < 8.9) cz = lerp(CAMZ - 90, 1450, eo(t, 8.0, 8.9));
  else if (t < 10.0) cz = lerp(1450, CAMZ - 60, eo(t, 8.9, 9.9));
  else if (t < 17.0) cz = CAMZ - 60 - 110 * seg(t, 10, 17);
  else if (t < 23.0) { const p = eo(t, 17.0, 22.6); cz = lerp(CAMZ - 170, 2200, p); }
  else { const p = eo(t, 23.0, 23.9); cz = lerp(2200, CAMZ, p); }
  cam.position.set(cx, cy, cz); camLook.set(cx, cy, 0); cam.lookAt(camLook);

  /* ── Sahne 1–2: hook + acı ── */
  const sahne12 = t < 8.95;
  const fade12 = 1 - eo(t, 8.0, 8.8);
  root12.visible = sahne12; root12.scale.setScalar(1.15 * (1 + .22 * seg(t, 8.0, 8.9))); root12.position.set(0, -90, 0);
  card.position.set(34, 14 + (1 - E(seg(t, 0, .95))) * 170, 8);
  card.rotation.z = .32 + (1 - E(seg(t, 0, .95))) * .8;
  tableA.rotation.y = .12 * Math.sin(t * .6);
  // turist: kuyruk soluk, geri çekilme 5.0–8.0
  const geri = eo(t, 5.0, 7.8);
  turist.position.set(335 + 130 * geri, 20 + 20 * geri, 30 - 160 * geri); qGlyph.position.y = 285 + 9 * Math.sin(t * 3.4);
  setOp(turist, sahne12 ? fade12 * lerp(1, .45, geri) : 0);
  // garson: 2.5'te soldan girer, kol hareketi
  const g1 = eo(t, 2.5, 3.5); garson.position.set(lerp(-760, -330, g1), 40 + 8 * Math.sin(t * 4.2), 40);
  garson.userData.armR.rotation.z = .55 + Math.sin(t * 7.2) * .75; garson.userData.armL.rotation.z = -.55 - Math.sin(t * 7.2 + 1.1) * .75;
  bub.forEach((b, i) => { const s0 = eo(t, 3.1 + i * .55, 3.55 + i * .55); b.scale.setScalar(s0 * (1 + .06 * Math.sin(t * 3 + i))); b.position.y = (i === 1 ? 345 : 290) + 6 * Math.sin(t * 2.6 + i); b.visible = s0 > .01; });
  // arka masalar solar (2 masa)
  const sol = eo(t, 3.4, 6.6); const dim = lerp(1, .2, sol);
  setOp(tableA, sahne12 ? fade12 : 0); setOp(garson, sahne12 ? fade12 : 0);
  setOp(tableB, sahne12 ? fade12 * dim : 0); setOp(tableC, sahne12 ? fade12 * dim : 0);

  /* ── Sahne 3–6: telefon ── */
  const e = ekran(t);
  screenMat.map = TEX[e.key]; screenMat.needsUpdate = false;
  pivot.rotation.y = e.rot;
  const ph3 = eo(t, 8.9, 9.95);
  let pos = new THREE.Vector3(), sc = 1, ry = 0, rx = -.04, op = 1;
  if (t < 10.0) { pos.set(-90, lerp(-1300, 270, ph3), 0); ry = lerp(-.9, 0, ph3); op = seg(t, 8.9, 9.2); }
  else if (t < 17.0) { pos.set(-90, 270, 0); ry = .16 * Math.sin((t - 10) * .9); }
  else if (t < 23.0) { const p = eo(t, 17.0, 17.95); pos.set(lerp(-90, -660, p), lerp(270, 300, p), lerp(0, 40, p)); sc = lerp(1, .5, p); ry = lerp(0, .6, p); op = 1 - eo(t, 17.3, 18.0); }
  else { const p = eo(t, 23.0, 23.9); pos.set(lerp(-660, 0, p), lerp(300, 55, p), 0); sc = .5; ry = lerp(.6, 0, p); op = eo(t, 23.0, 23.4); }
  phone.position.copy(pos); phone.scale.setScalar(sc); phone.rotation.set(rx, ry, 0);
  phone.visible = t >= 8.9; setOp(phone, op * fo);
  // telefon: ilk ürün satırı vurgusu (yeni dil ekranı oturduktan sonra 0,6 sn)
  const satirDil = (e.key2 === 'p03' || e.key2 === 'p04' || e.key2 === 'p06') && !e.flipping;
  let fr = 0; if (satirDil) { const s = e.since - FLIP; fr = Math.min(E(seg(s, 0.05, .3)), 1 - E(seg(s, .5, .65))); if (t < 10.5) fr = 0; }
  if (t >= 23.0 && t < 23.9) fr *= 1;
  rowFrame.material.opacity = fr; rowFrame.visible = fr > .01;

  /* ── tablet (panel) ── */
  const tin = eo(t, 17.0, 18.0), tout = eo(t, 23.0, 23.8);
  tablet.visible = t >= 16.95 && t < 23.85;
  tablet.position.set(lerp(1100, 0, tin) + 900 * tout, 320, 0);
  tablet.rotation.set(.035, lerp(-.5, -.14, tin) - .25 * tout, 0);
  setOp(tablet, 1 - tout);
  fDiller.material.opacity = tablet.visible ? Math.min(E(seg(t, 18.7, 19.0)), 1 - E(seg(t, 20.0, 20.25))) : 0;
  const csv = Math.min(E(seg(t, 20.3, 20.6)), 1 - E(seg(t, 21.9, 22.15)));
  fIce.material.opacity = csv; fDisa.material.opacity = csv;
  [fDiller, fIce, fDisa].forEach((f) => { f.visible = f.material.opacity > .01; });

  /* ── DOM ── */
  show(el.h1, t, 0, 2.55, { inn: .6, out: .35, dy: 18 }); if (t < .6) el.h1.style.opacity = '1';
  show(el.h2a, t, 2.8, 5.4); show(el.h2b, t, 5.5, 8.0); show(el.h3, t, 8.1, 9.6);
  show(el.h5, t, 17.05, 22.75, { out: .3 });
  show(el.h6a, t, 23.1, 24.6, { out: .3 }); show(el.h6b, t, 24.7, 28.0, { hold: true }); show(el.adres, t, 25.1, 28.0, { hold: true });
  show(el.logo, t, 24.9, 28.0, { hold: true, dy: 12 }); show(el.ok, t, 24.9, 28.0, { hold: true, dy: 0 });
  if (t >= 24.9) { const b = Math.sin((t - 24.9) * 4.2) * 7; el.ok.style.transform = `translate3d(${(-b).toFixed(1)}px,${(-b).toFixed(1)}px,0)`; }
  [el.h6b, el.adres, el.logo].forEach((n) => { n.style.opacity = (parseFloat(n.style.opacity || '0') * fo).toFixed(3); });
  el.ok.style.opacity = (parseFloat(el.ok.style.opacity || '0') * fo).toFixed(3);
  // dil çipleri (sahne 4): 10.4'te girer, aktif dil ekranla birlikte değişir; 17.0'da çıkar
  const aktif = { TR: t >= 11.7 + .5 && t < 13.0 + .25 || (t >= 11.7 && t < 13.0), EN: t >= 13.0 && t < 14.5, DE: t >= 14.5 && t < 15.8, FR: t >= 15.8 && t < 17.0 };
  [['cTR', 'TR', 0], ['cEN', 'EN', 1], ['cDE', 'DE', 2], ['cFR', 'FR', 3]].forEach(([id, k, i]) => {
    show(el[id], t, 10.4 + i * .12, 17.0, { inn: .4, out: .35, dy: 20 }); el[id].classList.toggle('on', !!aktif[k]);
  });
  show(el.badge, t, 10.5, 17.0, { inn: .45, out: .35, dy: 20 });
  show(el.l1, t, 18.7, 22.95, { out: .3, dy: 22 }); show(el.l2, t, 20.3, 22.95, { out: .3, dy: 22 }); show(el.l3, t, 22.2, 22.95, { out: .3, dy: 22 });
  // altyazı
  let ct = '', co = 0;
  for (const [a, b, s] of KAPTAN) if (t >= a && t < b) { ct = s; co = Math.min(E(seg(t, a, a + .3)), 1 - E(seg(t, b - .25, b))); }
  if (el.c0.textContent !== ct) el.c0.textContent = ct;
  el.c0.style.opacity = (ct ? Math.max(co, .0) : 0).toFixed(3);

  renderer.render(scene, cam);
  return true;
}
window.frame = frame;

/* ───────── yükleme ───────── */
for (const k of ['p02', 'p03', 'p04', 'p05', 'p06']) TEX[k] = await loadTex(`/tex/${k}.jpg`);
tscreen.material.map = await loadTex('/tex/panel.jpg'); tscreen.material.needsUpdate = true;
screenMat.map = TEX.p02; screenMat.needsUpdate = true;
hazir = true; window.hazir = true;
