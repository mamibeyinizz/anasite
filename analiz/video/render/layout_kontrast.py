#!/usr/bin/env python3
# Piksel örneklemesiyle metin/zemin kontrastı. Girdi: isler.json (kare dosyaları + öğe kutuları + CSS renkleri). Çıktı (stdout): JSON.
import json, re, sys
import numpy as np
from PIL import Image
def lin(c):
    c = np.asarray(c, float) / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def Y(rgb):
    r, g, b = lin(rgb); return 0.2126 * r + 0.7152 * g + 0.0722 * b
def oran(a, b):
    la, lb = Y(a), Y(b); return (max(la, lb) + .05) / (min(la, lb) + .05)
def renk(s):
    m = re.findall(r'[\d.]+', s); r, g, b = [float(x) for x in m[:3]]; a = float(m[3]) if len(m) > 3 else 1.0; return np.array([r, g, b]), a
KREM = np.array([244, 241, 232.]); ALTIN = np.array([201, 168, 76.])
isler = json.load(open(sys.argv[1])); dusukler = []; en_dusuk = 1e9; olcum = 0
for k in isler:
    im = np.array(Image.open(k['dosya']).convert('RGB')).astype(float)
    for o in k['ogeler']:
        r = o['rect']; x0, x1, y0, y1 = [int(round(v)) for v in (r['x0'], r['x1'], r['y0'], r['y1'])]
        x0, y0 = max(0, x0), max(0, y0); x1, y1 = min(1080, x1), min(1920, y1)
        if x1 - x0 < 4 or y1 - y0 < 4: continue
        px = im[y0:y1, x0:x1].reshape(-1, 3); lum = np.array([Y(p) for p in px[::max(1, len(px) // 4000)]]); sub = px[::max(1, len(px) // 4000)]
        col, a = renk(o['color'])
        renkler = [KREM, ALTIN] if o['kind'] == 'baslik' else [col]
        medL = np.median(lum)
        for tc in renkler:
            tl = Y(tc)
            zemin = sub[lum < medL] if tl > medL else sub[lum > medL]
            if len(zemin) < 8: continue
            bg = np.median(zemin, axis=0)
            etkin = tc * a + bg * (1 - a) if a < 1 else tc            # yarı saydam yazı rengi zeminle karışır
            c = float(oran(etkin, bg)); olcum += 1; en_dusuk = min(en_dusuk, c)
            if c < 4.5: dusukler.append(dict(t=k['t'], id=o['id'], oran=round(c, 2), metin=o.get('text', '')[:30]))
print(json.dumps(dict(en_dusuk=round(en_dusuk, 2), olcum=olcum, dusukler=dusukler[:60])))
