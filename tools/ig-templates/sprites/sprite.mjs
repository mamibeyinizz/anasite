// 3B sprite kütüphanesi: v5 malzemesiyle şeffaf PNG sprite'lar. window.ciz(ad) → sahneyi kurar, çizer, çapa noktalarını (dünya px) döndürür.
import { THREE, GOLD, KREM, ALTIN_AC, mat, canvasTex, rr, bubble, makeTable, makePerson, menuCard, roundedShape } from './lib3d.mjs';
await document.fonts.load('800 60px Manrope'); await document.fonts.ready;
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, premultipliedAlpha: false });
renderer.setPixelRatio(2); renderer.setSize(1000, 1000, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setClearColor(0x000000, 0);
const CAMZ = 2400; const cam = new THREE.PerspectiveCamera(2 * Math.atan(500 / CAMZ) * 180 / Math.PI, 1, 10, 9000); cam.position.set(0, 0, CAMZ); cam.lookAt(0, 0, 0);
let scene;
function kur() { scene = new THREE.Scene(); scene.add(new THREE.AmbientLight(0xffffff, 1.1)); const sun = new THREE.DirectionalLight(0xfff3d8, 2.0); sun.position.set(-700, 1100, 1300); scene.add(sun);
  const rim = new THREE.PointLight(0xC9A84C, 2.4, 4200, 1.2); rim.position.set(650, 380, -200); scene.add(rim); }
function golge(grp, w) {                                   // yumuşak temas gölgesi: zemine yakın yassı elips (ekrana dönük düzlem)
  const b = new THREE.Box3().setFromObject(grp); const cx = (b.min.x + b.max.x) / 2; const W = w || (b.max.x - b.min.x) * 0.9;
  const t = canvasTex(256, 64, (ctx, cw, ch) => { const g = ctx.createRadialGradient(cw / 2, ch / 2, 2, cw / 2, ch / 2, cw / 2); g.addColorStop(0, 'rgba(0,0,0,.42)'); g.addColorStop(.6, 'rgba(0,0,0,.16)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.scale(1, ch / cw); ctx.translate(0, (cw - ch) / 2 * (cw / ch) * 0); ctx.fillStyle = g; ctx.fillRect(0, -cw / 2 + ch / 2 * (cw / ch), cw, cw * (cw / ch)); ctx.restore(); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(W, W * 0.2), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })); m.position.set(cx, b.min.y + 4, -60); scene.add(m); }
const kolAc = (p, th, x) => { p.rotation.z = th; if (x !== undefined) p.position.x = x; };
function garson(poz) {
  const g = makePerson(KREM, true); const A = {};
  if (poz === 'kollarAcik') { kolAc(g.userData.armR, 2.25); kolAc(g.userData.armL, -2.25); }
  else if (poz === 'elSallayan') { kolAc(g.userData.armR, 2.75); kolAc(g.userData.armL, -0.4); }
  else if (poz === 'tepsi') { kolAc(g.userData.armR, 1.5); kolAc(g.userData.armL, -0.35);
    const tr = new THREE.Group(); const disk = new THREE.Mesh(new THREE.CylinderGeometry(58, 58, 7, 40), mat(GOLD, { metalness: .5, roughness: .3 })); tr.add(disk);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(15, 11, 26, 20), mat(KREM)); cup.position.set(-18, 17, 0); tr.add(cup); const cup2 = cup.clone(); cup2.position.set(20, 17, 6); tr.add(cup2);
    tr.position.set(64 + 104 + 6, 70 + 14, 24); tr.rotation.x = 0.38; g.add(tr); }
  scene.add(g); A.govde = [0, 0]; return { grp: g, A };
}
function misafir(poz) {
  const g = makePerson(ALTIN_AC, true); const A = {};
  if (poz === 'menuUzat') { g.userData.armL.visible = false; g.userData.armR.position.set(-62, 76, 24); kolAc(g.userData.armR, -1.78); A.el = [-168, 104]; }
  else if (poz === 'saskin') { kolAc(g.userData.armR, 2.6); kolAc(g.userData.armL, -2.6); g.rotation.z = 0.04; }
  scene.add(g); return { grp: g, A };
}
function zil() { const g = new THREE.Group(); const gm = mat(GOLD, { metalness: .55, roughness: .3 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(100, 108, 16, 48), gm); base.position.y = -50; const dome = new THREE.Mesh(new THREE.SphereGeometry(78, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), gm); dome.scale.set(1.15, 0.95, 1.15); dome.position.y = -42;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(14, 20, 16), mat(KREM)); knob.position.y = 40; const stem = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 18, 12), gm); stem.position.y = 32;
  g.add(base, dome, stem, knob); g.rotation.x = 0.42; scene.add(g); return { grp: g, A: {} }; }
function tablet() { const g = new THREE.Group(); const W = 340, H = 460, bw = 22; const s = roundedShape(W, H, 40); const hole = new THREE.Path(); const iw = W - 2 * bw, ih = H - 2 * bw, ir = 22, x = -iw / 2, y = -ih / 2;
  hole.moveTo(x + ir, y); hole.lineTo(x + iw - ir, y); hole.absarc(x + iw - ir, y + ir, ir, -Math.PI / 2, 0, false); hole.lineTo(x + iw, y + ih - ir); hole.absarc(x + iw - ir, y + ih - ir, ir, 0, Math.PI / 2, false); hole.lineTo(x + ir, y + ih); hole.absarc(x + ir, y + ih - ir, ir, Math.PI / 2, Math.PI, false); hole.lineTo(x, y + ir); hole.absarc(x + ir, y + ir, ir, Math.PI, Math.PI * 1.5, false); s.holes.push(hole);
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 14, bevelEnabled: true, bevelThickness: 3, bevelSize: 3, bevelSegments: 4, curveSegments: 24 }), mat(0x0b1210, { metalness: .75, roughness: .32 })); g.add(m); scene.add(g);
  return { grp: g, A: { ekranMerkez: [0, 0], ekranBoyut: [iw, ih] } }; }
function yildiz() { const sh = new THREE.Shape(); const R = 125, r = 54; for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; const px = Math.cos(a) * q, py = Math.sin(a) * q; i ? sh.lineTo(px, py) : sh.moveTo(px, py); } sh.closePath();
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 26, bevelEnabled: true, bevelThickness: 8, bevelSize: 7, bevelSegments: 4 }), mat(GOLD, { metalness: .5, roughness: .3 })); const g = new THREE.Group(); g.add(m); g.rotation.y = 0.35; g.rotation.x = -0.12; scene.add(g); return { grp: g, A: {} }; }
function qrTabela() { const g = new THREE.Group(); const plate = new THREE.Mesh(new THREE.BoxGeometry(210, 270, 14), mat(KREM, { roughness: .5 })); plate.position.y = 40; g.add(plate);
  const tex = canvasTex(420, 540, (ctx, w, h) => { ctx.fillStyle = '#F4F1E8'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 10; ctx.strokeRect(14, 14, w - 28, h - 28); ctx.fillStyle = '#0D2B22'; const n = 9, cs = (w - 120) / n, ox = 60, oy = 110; let s0 = 7;
    const rnd = () => (s0 = (s0 * 16807) % 2147483647) / 2147483647; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (rnd() > 0.52) ctx.fillRect(ox + i * cs, oy + j * cs, cs - 4, cs - 4); ctx.fillStyle = '#C9A84C'; ctx.fillRect(w / 2 - 40, 60, 80, 8); });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(210, 270), new THREE.MeshBasicMaterial({ map: tex })); face.position.set(0, 40, 7.5); g.add(face);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(70, 80, 14, 40), mat(0x1a4a3b)); stand.position.y = -110; g.add(stand); const neck = new THREE.Mesh(new THREE.BoxGeometry(26, 40, 12), mat(0x1a4a3b)); neck.position.y = -88; g.add(neck);
  g.rotation.y = -0.22; g.rotation.x = 0.06; scene.add(g); return { grp: g, A: {} }; }
function saat() { const g = new THREE.Group(); const rim = new THREE.Mesh(new THREE.CylinderGeometry(112, 112, 26, 56), mat(GOLD, { metalness: .5, roughness: .3 })); rim.rotation.x = Math.PI / 2; g.add(rim);
  const tex = canvasTex(400, 400, (ctx, w, h) => { ctx.fillStyle = '#F4F1E8'; ctx.beginPath(); ctx.arc(200, 200, 196, 0, 7); ctx.fill(); ctx.strokeStyle = '#0D2B22'; ctx.lineCap = 'round'; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.lineWidth = i % 3 ? 6 : 12; ctx.beginPath(); ctx.moveTo(200 + Math.sin(a) * 160, 200 - Math.cos(a) * 160); ctx.lineTo(200 + Math.sin(a) * 182, 200 - Math.cos(a) * 182); ctx.stroke(); }
    ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(200, 200); ctx.lineTo(200 + Math.sin(-0.55) * 90, 200 - Math.cos(-0.55) * 90); ctx.stroke(); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(200, 200); ctx.lineTo(200 + Math.sin(1.0) * 135, 200 - Math.cos(1.0) * 135); ctx.stroke(); ctx.fillStyle = '#C9A84C'; ctx.beginPath(); ctx.arc(200, 200, 14, 0, 7); ctx.fill(); });
  const face = new THREE.Mesh(new THREE.CircleGeometry(100, 56), new THREE.MeshBasicMaterial({ map: tex, transparent: true })); face.position.z = 13.5; g.add(face); g.rotation.y = -0.2; scene.add(g); return { grp: g, A: {} }; }
const YAPI = {
  'garson-kollarAcik': () => garson('kollarAcik'), 'garson-elSallayan': () => garson('elSallayan'), 'garson-tepsi': () => garson('tepsi'),
  'misafir-menuUzat': () => misafir('menuUzat'), 'misafir-saskin': () => misafir('saskin'),
  'masa': () => { const g = makeTable(1); scene.add(g); return { grp: g, A: { ust: [0, 0] } }; },
  'menuKarti': () => { const g = menuCard(); g.rotation.set(0, 0.18, 0.08); scene.add(g); return { grp: g, A: {} }; },
  'balon-ucNokta': () => { const g = bubble('…', 150, 110, '#C9A84C', '#0D2B22', true); scene.add(g); return { grp: g, A: {}, golgesiz: true }; },
  'balon-soru': () => { const g = bubble('?', 128, 110, '#F4F1E8', '#0D2B22', false); scene.add(g); return { grp: g, A: {}, golgesiz: true }; },
  zil, tablet, yildiz, qrTabela, saat };
const ZEMINDE = new Set(['garson-kollarAcik', 'garson-elSallayan', 'garson-tepsi', 'misafir-menuUzat', 'misafir-saskin', 'masa', 'zil', 'qrTabela']);
window.adlar = Object.keys(YAPI);
window.ciz = (ad) => { kur(); const o = YAPI[ad](); if (ZEMINDE.has(ad)) golge(o.grp, ad === 'masa' ? 380 : undefined); renderer.render(scene, cam);
  const b = new THREE.Box3().setFromObject(o.grp); return { ad, anchors: o.A, bbox: [b.min.x, b.min.y, b.max.x, b.max.y] }; };
window.hazir = true;
