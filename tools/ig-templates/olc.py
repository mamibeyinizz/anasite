#!/usr/bin/env python3
# Piksel ölçümleri. Kullanım: olc.py png bos.png olcum.json tokens.json jpg  → stdout JSON
import sys, json, re, os, numpy as np
from PIL import Image
png, bos, ol, tk, jpg = sys.argv[1:6]; I = np.asarray(Image.open(png).convert('RGB')).astype(int); B = np.asarray(Image.open(bos).convert('RGB')).astype(int)
O = json.load(open(ol)); T = json.load(open(tk)); FM = T['formatlar'][O['format']]; H, W = I.shape[:2]
mask = np.abs(I - B).sum(axis=2) > 110; ys, xs = np.where(mask); ink = dict(x0=int(xs.min()), x1=int(xs.max()) + 1, y0=int(ys.min()), y1=int(ys.max()) + 1) if len(xs) else None
sx0, sy0, sx1, sy1 = FM['sagUstBos']; sag = int(mask[sy0:sy1, sx0:sx1].sum())
def Y(c): c = np.asarray(c, float) / 255; c = np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]
def oran(a, b): la, lb = Y(a), Y(b); return (max(la, lb) + .05) / (min(la, lb) + .05)
kon = []
for r in O['renkler']:
    m = re.findall(r'[\d.]+', r['renk']); fg = np.array([float(x) for x in m[:3]]); q = r['rect']; x0, x1, y0, y1 = [int(round(v)) for v in (q['x0'], q['x1'], q['y0'], q['y1'])]
    sub = I[max(0, y0):min(H, y1), max(0, x0):min(W, x1)].reshape(-1, 3)
    if len(sub) < 20: continue
    d = np.abs(sub - fg).sum(axis=1); zem = sub[d > 120]
    if len(zem) < 10: continue
    bg = np.median(zem, axis=0); kon.append(dict(sinif=r['sinif'], renk=r['renk'], oran=round(float(oran(fg, bg)), 2)))
med = np.median(B.reshape(-1, 3), axis=0).astype(int); mx = B.reshape(-1, 3).max(axis=0).astype(int)
# --- palet denetimi (HSV): ekran görüntüsü/telefon/lens/tablet alanları dışarıda; mavi, kırmızı, kahverengi/turuncu ton oranı
ex = np.zeros((H, W), bool)
for k in ('telefon', 'lens', 'tablet'):
    r = O.get(k); r = r and (r.get('rect') or r)
    if r and 'x0' in r: ex[max(0, int(r['y0'])):int(r['y1']), max(0, int(r['x0'])):int(r['x1'])] = True
rgb = I.astype(np.float32) / 255; mx_ = rgb.max(axis=2); mn_ = rgb.min(axis=2); d_ = mx_ - mn_ + 1e-9
hh = np.where(mx_ == rgb[..., 0], ((rgb[..., 1] - rgb[..., 2]) / d_) % 6, np.where(mx_ == rgb[..., 1], (rgb[..., 2] - rgb[..., 0]) / d_ + 2, (rgb[..., 0] - rgb[..., 1]) / d_ + 4)) * 60; ss = d_ / (mx_ + 1e-9); vv = mx_
renkli = (ss > 0.35) & (vv > 0.18) & ~ex; tot = float((~ex).sum())
mavi = renkli & (hh >= 185) & (hh <= 265); kirmizi = renkli & (ss > 0.45) & ((hh >= 350) | (hh <= 10)); kahve = renkli & (hh > 10) & (hh < 36)
palet = dict(mavi=float(mavi.sum()) / tot, kirmizi=float(kirmizi.sum()) / tot, kahverengi=float(kahve.sum()) / tot)
bgstd = B.reshape(-1, 3).std(axis=0).tolist(); wm = mask.copy()
if O.get('tablet') and 'x0' in (O['tablet'].get('rect') or O['tablet']): _t = O['tablet'].get('rect') or O['tablet']; wm[int(_t['y0']):int(_t['y1']), int(_t['x0']):int(_t['x1'])] = True   # koyu çerçeveli tablet de ağırlığa girer
wy, _wx = np.where(wm); agirlikY = float(wy.mean() / H) if len(wy) else None
im = Image.open(jpg)
print(json.dumps(dict(palet=palet, bosStd=bgstd, agirlikY=agirlikY, ink=ink, sagUstInk=sag, kontrast=kon, bosMedyan=med.tolist(), bosMaks=mx.tolist(), jpgBayt=os.path.getsize(jpg), jpgBoyut=list(im.size), jpgIcc=bool(im.info.get('icc_profile')), jpgMod=im.mode)))
