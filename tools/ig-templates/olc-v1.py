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
im = Image.open(jpg)
print(json.dumps(dict(ink=ink, sagUstInk=sag, kontrast=kon, bosMedyan=med.tolist(), bosMaks=mx.tolist(), jpgBayt=os.path.getsize(jpg), jpgBoyut=list(im.size), jpgIcc=bool(im.info.get('icc_profile')), jpgMod=im.mode)))
