// v5 3B malzemesi (render/scene-v5.mjs'ten alınmış tanımlar; yeni karakter/stil yok). Sprite üretimi ve tarayıcı için ES modül.
import * as THREE from 'three';
const GOLD = 0xC9A84C, KREM = 0xF4F1E8, ALTIN_AC = 0xE6C86E;
const mat = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .6, metalness: .08 }, o));
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function roundedShape(w, h, r) { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false); s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false); s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false); return s; }
function bubble(text, w, h, fill, ink, tailLeft) {
  const S2 = 3; const t = canvasTex(w * S2, (h + 36) * S2, (ctx, cw, ch) => { ctx.clearRect(0, 0, cw, ch); ctx.fillStyle = fill; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18;
    rr(ctx, 10, 10, cw - 20, h * S2 - 20, 46); ctx.fill(); ctx.beginPath(); const tx = tailLeft ? cw * .26 : cw * .74;
    ctx.moveTo(tx - 34, h * S2 - 24); ctx.lineTo(tx + (tailLeft ? -22 : 22), ch - 10); ctx.lineTo(tx + 34, h * S2 - 24); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = ink; ctx.font = `800 ${Math.round(h * S2 * .66)}px Manrope`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, cw / 2, h * S2 / 2 + 10); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h + 36), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })); m.renderOrder = 4; return m;
}
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

export { roundedShape, THREE, GOLD, KREM, ALTIN_AC, mat, canvasTex, rr, bubble, makeTable, makePerson, menuCard };
