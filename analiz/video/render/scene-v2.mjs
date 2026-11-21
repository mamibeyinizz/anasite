// Çoklu Dil Reels v2 — 28 sn, 1080×1920, 30 fps. Kare kare render: window.frame(t) (t = saniye).
// 3B yalnızca yönlendirme/geçiş içindir; ürün ekranları gerçek ekran görüntüleridir (tex/*.jpg).
// v2 değişiklikleri: bkz. video-v1-analiz.md (14 bulgu). v1 kaynağı: scene-v1.mjs.
import * as THREE from 'three';

await Promise.all([document.fonts.load('800 60px Manrope'), document.fonts.load('700 40px Manrope'), document.fonts.load('800 190px Manrope')]);
await document.fonts.ready;
const W = 1080, H = 1920;
const TOPLAM = 28;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
function bez(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (t) => {
    if (t <= 0) return 0; if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 10; i++) { const x = ((ax * u + bx) * u + cx) * u - t; const dx = (3 * ax * u + 2 * bx) * u + cx; if (Math.abs(x) < 1e-6) break; u -= x / dx; }
    return ((ay * u + by) * u + cy) * u;
  };
}
const E = bez(.22, 1, .36, 1);                  // ease-out cubic-bezier(.22,1,.36,1)
const eo = (t, a, b) => E(seg(t, a, b));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (x) => x * x * (3 - 2 * x);

/* ───────── renderer / sahne ───────── */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();
const CAMZ = 2400;
const cam = new THREE.PerspectiveCamera(2 * Math.atan(960 / CAMZ) * 180 / Math.PI, W / H, 10, 9000);
scene.add(new THREE.AmbientLight(0xffffff, 1.1));
const sun = new THREE.DirectionalLight(0xfff3d8, 2.0); sun.position.set(-700, 1100, 1300); scene.add(sun);
const rim = new THREE.PointLight(0xC9A84C, 2.4, 4200, 1.2); rim.position.set(650, 380, -200); scene.add(rim);

const GOLD = 0xC9A84C, KREM = 0xF4F1E8, ALTIN_AC = 0xE6C86E;
const mat = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .6, metalness: .08 }, o));

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
function roundedShape(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}
function goldFrame(wp, hp) {
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
function bubble(text, w = 150, h = 130, fill = '#F4F1E8', ink = '#0D2B22', tailLeft = true) {   // konuşma balonu + kuyruk (sahibine bağlı)
  const S = 3;
  const t = canvasTex(w * S, (h + 36) * S, (ctx, cw, ch) => {
    ctx.clearRect(0, 0, cw, ch); ctx.fillStyle = fill; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18;
    rr(ctx, 10, 10, cw - 20, h * S - 20, 46); ctx.fill();
    ctx.beginPath(); const tx = tailLeft ? cw * .26 : cw * .74;
    ctx.moveTo(tx - 34, h * S - 24); ctx.lineTo(tx + (tailLeft ? -22 : 22), ch - 10); ctx.lineTo(tx + 34, h * S - 24); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = ink; ctx.font = `800 ${Math.round(h * S * .66)}px Manrope`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, cw / 2, h * S / 2 + 10);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h + 36), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
  m.renderOrder = 4; return m;
}

/* ───────── doku ───────── */
const loader = new THREE.TextureLoader();
const loadTex = (u) => new Promise((res, rej) => loader.load(u, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.minFilter = THREE.LinearMipmapLinearFilter; res(t); }, undefined, rej));
const TEX = {};

/* ───────── sahne 1–2 nesneleri (hook + acı) ───────── */
const root12 = new THREE.Group(); scene.add(root12);
function makeTable(x, y, z, s) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(170, 170, 16, 72), mat(0x2a6b57, { roughness: .5 }));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(170, 4.5, 14, 72), mat(GOLD, { metalness: .55, roughness: .32 })); ring.rotation.x = Math.PI / 2; ring.position.y = 8;
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(20, 32, 170, 28), mat(0x1a4a3b)); ped.position.y = -92;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(88, 100, 12, 36), mat(0x1a4a3b)); base.position.y = -182;
  g.add(top, ring, ped, base); g.position.set(x, y, z); g.scale.setScalar(s); g.rotation.x = 0.42; return g;
}
function makePerson(color, withArms = false) {
  const g = new THREE.Group();
  const m = () => mat(color, { roughness: .75 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(46, 128, 10, 20), m());
  const head = new THREE.Mesh(new THREE.SphereGeometry(38, 28, 24), m()); head.position.y = 142;
  g.add(body, head);
  if (withArms) {
    const mk = (sx) => { const p = new THREE.Group(); const a = new THREE.Mesh(new THREE.CapsuleGeometry(14, 92, 6, 12), m()); a.position.y = -52; p.add(a); p.position.set(sx * 64, 70, 6); return p; };
    g.userData.armL = mk(-1); g.userData.armR = mk(1); g.add(g.userData.armL, g.userData.armR);
  }
  return g;
}
function menuCard() {
  const g = new THREE.Group();
  const cb = new THREE.Mesh(new THREE.BoxGeometry(150, 205, 6), mat(KREM, { roughness: .5 }));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(150, 205), new THREE.MeshBasicMaterial({
    map: canvasTex(300, 410, (ctx, w, h) => {
      ctx.fillStyle = '#F4F1E8'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 8; ctx.strokeRect(14, 14, w - 28, h - 28);
      ctx.fillStyle = '#0D2B22'; ctx.font = '800 50px Manrope'; ctx.textAlign = 'center'; ctx.fillText('MENÜ', w / 2, 100);
      ctx.fillStyle = '#C9A84C'; ctx.fillRect(w / 2 - 34, 120, 68, 6);
      ctx.fillStyle = 'rgba(13,43,34,.55)'; for (let i = 0; i < 6; i++) ctx.fillRect(46, 160 + i * 38, w - 92 - (i % 2) * 54, 11);
    })
  }));
  face.position.z = 3.2; cb.add(face); g.add(cb); return g;
}
const tableA = makeTable(-30, 20, 0, 1);
// misafir (altın): menüyü uzatır, "?" balonu başına bağlı
const turist = makePerson(ALTIN_AC, true);
{
  turist.userData.armL.visible = false;
  const arm = turist.userData.armR; arm.position.set(-62, 76, 24);      // menüyü uzatan kol (kameraya ve masaya doğru)
  turist.userData.menu = menuCard(); turist.userData.menu.position.set(-150, 104, 38); turist.add(turist.userData.menu);
  const q = bubble('?', 128, 110, '#F4F1E8', '#0D2B22', false); q.position.set(60, 262, 14); turist.userData.q = q; turist.add(q);
}
const garson = makePerson(KREM, true);
{
  const b = bubble('…', 150, 110, '#C9A84C', '#0D2B22', true); b.position.set(70, 250, 14); garson.userData.b = b; garson.add(b);
}
const tableB = makeTable(-390, 210, -260, .75), tableC = makeTable(345, 250, -320, .72);
[[tableB, -40], [tableB, 55], [tableC, -45], [tableC, 50]].forEach(([tb, dx]) => {
  const p = new THREE.Mesh(new THREE.SphereGeometry(26, 20, 16), mat(0x8fbba9)); p.position.set(dx, 90, 70); tb.add(p);
});
root12.add(tableA, turist, garson, tableB, tableC);
root12.position.set(0, -95, 0);

/* ───────── telefon (iki ekran düzlemi: çapraz geçiş) ───────── */
const SP = 0.56;
const PW = 860 * SP, PH = 1300 * SP;                       // 482 × 728
const phone = new THREE.Group(); scene.add(phone);
const body = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(PW + 40, PH + 40, 58), { depth: 20, bevelEnabled: true, bevelThickness: 5, bevelSize: 5, bevelSegments: 5, curveSegments: 28 }), mat(0x0b1210, { metalness: .75, roughness: .32 }));
body.position.z = -10; phone.add(body);
const pivot = new THREE.Group(); pivot.position.z = 16.6; phone.add(pivot);
const mkScr = (z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true })); m.position.z = z; pivot.add(m); return m; };
const scrA = mkScr(0), scrB = mkScr(0.3);
function texRect(x0, y0, x1, y1) { return { x: ((x0 + x1) / 2 / 860 - .5) * PW, y: (.5 - (y0 + y1) / 2 / 1300) * PH, w: (x1 - x0) * SP, h: (y1 - y0) * SP }; }
const rowR = texRect(24, 530, 836, 745);
const rowFrame = goldFrame(rowR.w, rowR.h); rowFrame.position.set(rowR.x, rowR.y, 0.8); pivot.add(rowFrame);

/* ───────── tablet (panel) ───────── */
const PX0 = 262, PCW = 1018, PCH = 420;
const TW = 880, TH = TW * PCH / PCW;
const tablet = new THREE.Group(); scene.add(tablet);
const tbody = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(TW + 34, TH + 34, 26), { depth: 14, bevelEnabled: true, bevelThickness: 4, bevelSize: 4, bevelSegments: 4, curveSegments: 20 }), mat(0x0b1210, { metalness: .75, roughness: .35 }));
tbody.position.z = -7; tablet.add(tbody);
const tscreen = new THREE.Mesh(new THREE.PlaneGeometry(TW, TH), new THREE.MeshBasicMaterial({ toneMapped: false })); tscreen.position.z = 12.2; tablet.add(tscreen);
const BOX = await (await fetch('/render/boxes.json')).json();
const cardPos = (b) => ({ x: ((b.x + b.w / 2 - PX0) / PCW - .5) * TW, y: (.5 - (b.y + b.h / 2) / PCH) * TH });
function boxFrame(b, pad = 6) {
  const wp = (b.w + pad * 2) * TW / PCW, hp = (b.h + pad * 2) * TH / PCH;
  const m = goldFrame(wp, hp); const p = cardPos(b); m.position.set(p.x, p.y, 13.2); tablet.add(m); return m;
}
const fDiller = boxFrame(BOX.diller), fIce = boxFrame(BOX.csvIce), fDisa = boxFrame(BOX.csvDisa);
const TABLET_Y = 240;                                       // dünya y (piksel y ≈ 720)

/* ───────── DOM ───────── */
const $ = (id) => document.getElementById(id);
const el = {}; ['h1', 'h2a', 'h2b', 'h3', 'h5', 'h6a', 'h6b', 'adres', 'logo', 'ok', 'cTR', 'cEN', 'cDE', 'cFR', 'badge', 'c0', 'scrim'].forEach((k) => { el[k] = $(k); });
function show(node, t, a, b, { inn = .45, out = .4, dy = 26, hold = false } = {}) {
  const k = Math.min(E(seg(t, a, a + inn)), hold ? 1 : 1 - E(seg(t, b - out, b)));
  node.style.opacity = ((t >= a && (hold || t <= b)) ? k : 0).toFixed(3);
  node.style.transform = `translate3d(0,${((1 - E(seg(t, a, a + inn))) * dy).toFixed(2)}px,0)`;
}

/* Metin katmanı kuralı (v2): büyük başlık = kilit ifade (söylenen cümlenin kendisi); altyazı = başlıkta OLMAYAN söylenen cümle.
   Birleşik sıra (başlıklar + altyazılar) ses-metni.md "Düz metin" ile kelime kelime eşittir. */
const BASLIK = [   // [başlangıç, bitiş, id, söylenen cümle]
  [0.0, 2.6, 'h1', 'Yabancı misafir geldi. Menüyü kim anlatacak?'],
  [2.65, 5.4, 'h2a', 'Garsonunuz tercümana dönüşüyor, diğer masalar bekliyor.'],
  [5.5, 8.0, 'h2b', 'Anlamayan misafir de sormaya çekinir.'],
  [8.0, 10.0, 'h3', 'Çözüm menünün kendisinde.'],
  [17.0, 22.4, 'h5', 'Bu, Çoklu Dil modülü.'],
  [22.6, 23.9, 'h6a', 'Garsonunuz servise dönsün.'],
];
const KAPTAN = [   // başlıkta olmayan söylenen cümleler
  [10.0, 12.6, 'Misafir QR’ı okutur, dilini seçer.'],
  [12.6, 17.0, 'Ürün adı, açıklama, kategori, hepsi kendi dilinde açılır.'],
  [18.4, 19.8, 'Dilleri siz tanımlarsınız.'],
  [19.8, 21.6, 'Çevirileri elle ya da CSV ile girersiniz.'],
  [21.6, 22.6, 'Otuz dile kadar.'],
  [23.9, 25.9, 'Aynı menüyü kendi telefonunuzda deneyin, dil seçiciyi siz değiştirin.'],
  [25.9, 27.0, 'Bağlantı profilimizde.'],
];
window.__kaptan = KAPTAN; window.__baslik = BASLIK;

/* telefon ekran dizisi — her değişim 0,5 sn çapraz geçiş (gövde hep ekranlı kalır) */
const DIZI = [[0, 'p02'], [11.7, 'p03'], [13.0, 'p04'], [14.5, 'p05'], [15.8, 'p06'], [23.1, 'p03'], [25.4, 'p04']];
const XF = 0.5;
function ekran(t) {
  let idx = 0; for (let i = 0; i < DIZI.length; i++) if (t >= DIZI[i][0]) idx = i;
  const k = idx > 0 ? clamp((t - DIZI[idx][0]) / XF) : 1;
  const bas = idx > 0 && k < 1;
  return { from: DIZI[Math.max(0, idx - 1)][1], to: DIZI[idx][1], mix: idx > 0 ? smooth(k) : 1, xf: bas, since: t - DIZI[idx][0], cur: DIZI[idx][1] };
}

/* kamera odak yardımcısı: dünya (wx,wy) noktası ekran (sx,sy) pikseline gelsin, büyütme k */
function odak(wx, wy, k, sx, sy) { return { cx: wx - (sx - 540) / k, cy: wy - (960 - sy) / k, cz: CAMZ / k }; }
const mixc = (a, b, m) => ({ cx: lerp(a.cx, b.cx, m), cy: lerp(a.cy, b.cy, m), cz: lerp(a.cz, b.cz, m) });

/* sabit yerleşim */
const PH_YC = 106;                                          // telefon merkezi dünya y (piksel y ≈ 854, üstü ≈ 470)
const K_PHONE = 1.9, K_TAB = 2.15;                          // kanıt büyütmesi: telefon 1,9× (ürün adı ≈36 px, açıklama ≈30 px), panel 2,15× (kart başlığı ≈30 px)
const WIDE = { cx: 0, cy: 0, cz: CAMZ };
const camFull = odak(0, PH_YC, 1.0, 540, 960 - PH_YC);
const camPhoneZoom = odak(0, PH_YC + 7, K_PHONE, 540, 975);   // ilk ürün satırı (ürün adı + açıklama) altyazı plakasının üstünde kalır
const camPhoneZoom2 = camPhoneZoom;                          // ek yakınlaşma yok: arama çubuğu üst çipler altına girmesin
const camDE = odak(0, PH_YC, 1.12, 540, 880);               // Almanca karşılama ekranı: tam görünür
function camKey(keys, t) {
  for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i][0] && t < keys[i + 1][0]) return mixc(keys[i][1], keys[i + 1][1], eo(t, keys[i][0], keys[i + 1][0]));
  return keys[keys.length - 1][1];
}
const dillerP = cardPos(BOX.diller), disaP = cardPos(BOX.csvDisa), iceP = cardPos(BOX.csvIce);
const camT = (p, k = K_TAB) => odak(p.x, TABLET_Y + p.y, k, 540, 715);
const camTabWide = odak(0, TABLET_Y, 1.1, 540, 740);

/* ───────── kare ───────── */
let hazir = false;
const camLook = new THREE.Vector3();
function frame(t) {
  if (!hazir) throw new Error('dokular hazır değil');
  t = clamp(t, 0, TOPLAM);
  const fo = 1 - smooth(seg(t, 26.6, 27.1));                // CTA katmanları 26,6–27,1'de söner
  const hookIn = t >= 27.2 ? eo(t, 27.2, 27.9) : 0;         // hook 27,2–28,0'da geri gelir (t=28'de t=0 ile aynı durum)
  const ts = t >= 27.15 ? 0 : t;                            // sahne 1 durumu için efektif zaman

  /* ── kamera ── */
  let c = WIDE;
  if (t < 10.0) c = { cx: 0, cy: 0, cz: CAMZ - 80 * seg(t, 0, 8.0) };
  else if (t < 17.0) {                                    // kanıt: tam telefon → yakın (ürün adı + açıklama) → DE'de geri → FR'de yakın
    const K = [[10.0, camFull], [11.7, camFull], [12.6, camPhoneZoom], [14.2, camPhoneZoom2], [14.7, camDE], [15.6, camDE], [16.2, camPhoneZoom], [17.0, camPhoneZoom2]];
    c = camKey(K, t);
  } else if (t < 22.6) {
    const K = [[17.0, WIDE], [18.0, camTabWide], [18.2, camTabWide], [18.9, camT(dillerP)], [19.9, camT(dillerP)], [20.4, camT(disaP)], [21.1, camT(disaP)], [21.5, camT(iceP)], [22.1, camT(iceP)], [22.6, camTabWide]];
    c = camKey(K, t);
  } else { const p = eo(t, 22.6, 23.4); c = mixc(camTabWide, WIDE, p); }
  cam.position.set(c.cx, c.cy, c.cz); camLook.set(c.cx, c.cy, 0); cam.lookAt(camLook);

  /* ── sahne 1–2 (+ döngü dönüşü) ── */
  const on12 = ts < 8.7 || t >= 27.15;
  const a12 = t >= 27.15 ? hookIn : 1 - eo(t, 8.0, 8.7);
  root12.visible = on12; root12.scale.setScalar(1.12 * (1 + .12 * seg(ts, 8.0, 8.9))); root12.position.set(0, -95, 0);
  tableA.rotation.y = .1 * Math.sin(ts * .6);
  // misafir: menüyü uzatır; 5,0–8,0 arası biraz geri çekilir
  const geri = eo(ts, 5.0, 7.8);
  turist.position.set(318 + 120 * geri, 40 + 10 * geri, 30 - 150 * geri);
  turist.userData.armR.rotation.z = -1.78 + Math.sin(ts * 2.3) * .07 + .35 * geri;
  turist.userData.menu.position.set(-168 + 10 * Math.sin(ts * 2.3), 100, 34); turist.userData.menu.rotation.set(0, .18, .08 * Math.sin(ts * 2.3));
  turist.userData.q.position.y = 262 + 8 * Math.sin(ts * 3.1);
  // garson: 2,5'te soldan girer, tercümanlık yapar
  const g1 = eo(ts, 2.5, 3.5); garson.position.set(lerp(-760, -330, g1), 40 + 8 * Math.sin(ts * 4.2), 40);
  garson.userData.armR.rotation.z = .55 + Math.sin(ts * 7.2) * .75; garson.userData.armL.rotation.z = -.55 - Math.sin(ts * 7.2 + 1.1) * .75;
  const bs = eo(ts, 3.2, 3.7); garson.userData.b.scale.setScalar(Math.max(bs, .001) * (1 + .05 * Math.sin(ts * 3))); garson.userData.b.visible = bs > .01;
  const sol = eo(ts, 3.4, 6.6); const dim = lerp(1, .2, sol);
  setOp(tableA, on12 ? a12 : 0); setOp(garson, on12 ? a12 : 0); setOp(turist, on12 ? a12 * lerp(1, .6, geri) : 0);
  setOp(tableB, on12 ? a12 * dim : 0); setOp(tableC, on12 ? a12 * dim : 0);

  /* ── telefon ── */
  const e = ekran(t);
  scrA.material.map = TEX[e.from]; scrB.material.map = TEX[e.to];
  scrA.material.opacity = 1; scrB.material.opacity = e.xf ? e.mix : 1; scrB.visible = e.xf;
  if (!e.xf) scrA.material.map = TEX[e.to];
  let pos = new THREE.Vector3(0, PH_YC, 0), sc = 1, ry = 0, op = 1;
  const wob = e.xf ? Math.sin(e.mix * Math.PI) : 0;           // geçişte hafif yan dönüş + nefes (gövde hep ekranlı)
  if (t < 10.0) { pos.set(0, lerp(-440, PH_YC, eo(t, 8.0, 9.4)), 0); ry = lerp(-.55, 0, eo(t, 8.0, 9.4)); op = t >= 8.0 ? 1 : 0; }
  else if (t < 17.0) { pos.set(0, PH_YC, 0); ry = .05 * Math.sin((t - 10) * .9) + .22 * wob; sc = 1 + .02 * wob; }
  else if (t < 22.6) { const p = eo(t, 17.0, 17.7); pos.set(lerp(0, -900, p), PH_YC, 20); ry = lerp(0, .5, p); }
  else { const p = eo(t, 22.6, 23.3); pos.set(lerp(-900, 0, p), lerp(PH_YC, -60, p), 0); sc = lerp(1, 1.12, p) + .02 * wob; ry = lerp(.5, 0, p) + .15 * wob; }
  if (t >= 23.3) { pos.set(0, -60, 0); sc = 1.12 + .02 * wob; ry = .15 * wob; }
  phone.position.copy(pos); phone.scale.setScalar(sc); phone.rotation.set(-.02, ry, 0);
  phone.visible = t >= 8.0 && t < 27.15; setOp(phone, (t >= 8.0 && t < 27.15) ? op * (t >= 26.6 ? fo : 1) : 0);
  // ürün satırı vurgusu (yeni dil ekranı oturduktan sonra 0,6 sn)
  const satir = (e.cur === 'p03' || e.cur === 'p04' || e.cur === 'p06') && !e.xf;
  let fr = 0; if (satir && t >= 12.3) { const s = e.since - XF; fr = Math.min(E(seg(s, .05, .3)), 1 - E(seg(s, .5, .65))); }
  rowFrame.material.opacity = fr; rowFrame.visible = fr > .01;

  /* ── tablet ── */
  const tin = eo(t, 17.0, 17.8), tout = eo(t, 22.6, 23.2);
  tablet.visible = t >= 16.95 && t < 23.25;
  tablet.position.set(lerp(1100, 0, tin) + 900 * tout, TABLET_Y, 0); tablet.rotation.set(.02, 0, 0);
  setOp(tablet, 1 - tout);
  const fo1 = Math.min(E(seg(t, 18.6, 18.9)), 1 - E(seg(t, 19.9, 20.15)));
  const fo2 = Math.min(E(seg(t, 20.0, 20.3)), 1 - E(seg(t, 21.0, 21.25)));
  const fo3 = Math.min(E(seg(t, 21.1, 21.4)), 1 - E(seg(t, 22.1, 22.35)));
  fDiller.material.opacity = fo1; fDisa.material.opacity = fo2; fIce.material.opacity = fo3;
  [fDiller, fDisa, fIce].forEach((f) => { f.visible = f.material.opacity > .01 && tablet.visible; });

  /* ── DOM: başlıklar ── */
  const hh = { h1: el.h1, h2a: el.h2a, h2b: el.h2b, h3: el.h3, h5: el.h5, h6a: el.h6a };
  for (const [a, b, id] of BASLIK) {
    if (id === 'h1') continue;
    show(hh[id], t, a, b, { out: .35 });
  }
  // h1: t=0'da zaten görünür; döngü dönüşünde 27,2–27,9 arası gelir ve t=28'de t=0 ile aynıdır
  if (t < 2.6) { show(el.h1, t, 0, 2.6, { inn: .6, out: .3, dy: 18 }); if (t < .6) el.h1.style.opacity = '1'; }
  else if (t >= 27.2) { el.h1.style.opacity = (t >= 27.9 ? 1 : hookIn).toFixed(3); el.h1.style.transform = 'translate3d(0,18px,0)'; }
  else el.h1.style.opacity = '0';
  // son sahne
  show(el.h6b, t, 24.0, 28.0, { hold: true }); show(el.adres, t, 24.4, 28.0, { hold: true });
  show(el.logo, t, 24.6, 28.0, { hold: true, dy: 12 }); show(el.ok, t, 24.6, 28.0, { hold: true, dy: 0 });
  [el.h6b, el.adres, el.logo, el.ok].forEach((n) => { n.style.opacity = (parseFloat(n.style.opacity || '0') * fo).toFixed(3); });
  if (t >= 24.6) { const b = Math.sin((t - 24.6) * 4.2) * 7; el.ok.style.transform = `translate3d(${(-b).toFixed(1)}px,${(-b).toFixed(1)}px,0)`; }
  // dil çipleri + rozet (10,4–17,0)
  const aktif = { TR: t >= 11.7 && t < 13.0, EN: t >= 13.0 && t < 14.5, DE: t >= 14.5 && t < 15.8, FR: t >= 15.8 && t < 17.0 };
  [['cTR', 'TR', 0], ['cEN', 'EN', 1], ['cDE', 'DE', 2], ['cFR', 'FR', 3]].forEach(([id, k, i]) => { show(el[id], t, 10.5 + i * .1, 17.0, { inn: .4, out: .35, dy: 16 }); el[id].classList.toggle('on', !!aktif[k]); });
  show(el.badge, t, 10.3, 17.0, { inn: .45, out: .35, dy: 16 });
  // üst karartma (panel yakınlaştırmasında başlık okunurluğu)
  el.scrim.style.opacity = (Math.min(E(seg(t, 18.0, 18.6)), 1 - E(seg(t, 22.2, 22.8))) * (t >= 17.0 ? 1 : 0)).toFixed(3);
  // altyazı (yalnızca başlıkta olmayan söylenen cümle)
  let ct = '', co = 0;
  for (const [a, b, s] of KAPTAN) if (t >= a && t < b) { ct = s; co = Math.min(E(seg(t, a, a + .3)), 1 - E(seg(t, b - .25, b))); }
  if (t >= 26.6) co *= fo;
  if (el.c0.textContent !== ct) el.c0.textContent = ct;
  el.c0.style.opacity = (ct ? co : 0).toFixed(3);

  renderer.render(scene, cam);
  return true;
}
window.frame = frame;
// ölçüm için: tüm içerik gizli (yalnızca arka plan) — boş kare referansı
window.blank = () => { root12.visible = false; phone.visible = false; tablet.visible = false; Object.values(el).forEach((n) => { n.style.opacity = '0'; }); renderer.render(scene, cam); return true; };
// piksel ölçeği hesabı (okunurluk raporu): ekranda görünen metin yüksekliği = doku px × SP × ölçek × büyütme
window.__olcek = { SP, K_PHONE, K_TAB, tabletKartBaslikPx: 16 * (TW / PCW) * K_TAB, urunAdiPx: 34 * SP * K_PHONE, urunAciklamaPx: 28 * SP * K_PHONE };

/* ───────── yükleme ───────── */
for (const k of ['p02', 'p03', 'p04', 'p05', 'p06']) TEX[k] = await loadTex(`/tex/${k}.jpg`);
tscreen.material.map = await loadTex('/tex/panel.jpg'); tscreen.material.needsUpdate = true;
scrA.material.map = TEX.p02; scrB.material.map = TEX.p03;
hazir = true; window.hazir = true;
