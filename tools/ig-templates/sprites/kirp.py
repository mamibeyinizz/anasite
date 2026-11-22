#!/usr/bin/env python3
# Şeffaf PNG'yi alfa sınırına kırp (6 px pay), kenar halosunu temizle (düşük alfa pikselleri sıfırla). stdout: {w,h,x0,y0}
import sys, json, numpy as np
from PIL import Image
f = sys.argv[1]; im = Image.open(f).convert('RGBA'); a = np.asarray(im).copy()
a[..., 3] = np.where(a[..., 3] < 6, 0, a[..., 3]); ys, xs = np.where(a[..., 3] > 0); x0, x1, y0, y1 = max(xs.min() - 6, 0), min(xs.max() + 7, a.shape[1]), max(ys.min() - 6, 0), min(ys.max() + 7, a.shape[0])
# alfa 0 piksellerin RGB'sini komşu dolgu rengine çek (halo yok): RGB'yi en yakın opak piksele kopyalamak yerine alfa=0 → RGB=0 bırakılır (straight alpha)
Image.fromarray(a[y0:y1, x0:x1]).save(f, optimize=True); print(json.dumps(dict(w=int(x1 - x0), h=int(y1 - y0), x0=int(x0), y0=int(y0))))
