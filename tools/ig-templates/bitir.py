#!/usr/bin/env python3
# PNG → JPG (kalite 92, hafif dither: banding yok, sRGB profili gömülü). Kullanım: bitir.py girdi.png cikti.jpg
import sys, os, numpy as np
from PIL import Image, ImageCms
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(np.float32); rng = np.random.default_rng(3)
out = np.clip(np.round(im + rng.normal(0, .9, im.shape[:2])[..., None] + rng.normal(0, .35, im.shape)), 0, 255).astype(np.uint8)
icc = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes(); q = 92
Image.fromarray(out).save(sys.argv[2], quality=q, subsampling=0, icc_profile=icc)
while os.path.getsize(sys.argv[2]) > 2_000_000 and q > 60: q -= 1; Image.fromarray(out).save(sys.argv[2], quality=q, subsampling=0, icc_profile=icc)
print(f'{os.path.getsize(sys.argv[2])/1e6:.2f} MB q{q}')
