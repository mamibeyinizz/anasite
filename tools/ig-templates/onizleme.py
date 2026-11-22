#!/usr/bin/env python3
# Önizleme: (1) out/onizleme-grid.jpg — yeni görseller hesabın grid ekranına (analiz/ekran/grid-1.jpg) yerleştirilmiş 3×4 montaj; (2) out/330/<id>.jpg 330 px küçültmeler; (3) out/onizleme-sheet.jpg (9:16 / 3:4 / 330 px)
import sys, json, os
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__)); plan = json.load(open(sys.argv[1])); sira = [x['id'] for x in (json.load(open(sys.argv[2]))['oneri'] if len(sys.argv) > 2 and sys.argv[2] != '-' else [])] if False else None
ids = [x['id'] for x in plan['yeni']]
if len(sys.argv) > 2 and sys.argv[2] != '-': ids = json.load(open(sys.argv[2]))['oneri']
GRID = Image.open(os.path.join(D, '..', '..', 'analiz', 'ekran', 'grid-1.jpg')).convert('RGB'); TX = [198, 619, 1041]; TY = [239, 800, 1361, 1920]; TW, TH = 419, 557
def tile(id_):
    im = Image.open(os.path.join(D, 'out', 'v2', id_ + '.jpg')).convert('RGB')
    if im.size[1] == 1920: im = im.crop((0, 240, 1080, 1680))            # reels kapağı grid'de 3:4 ortalı kırpım
    return im
os.makedirs(os.path.join(D, 'out', 'v2', '330'), exist_ok=True); g = GRID.copy(); kes = {}
for i, id_ in enumerate(ids[:12]):
    if not os.path.exists(os.path.join(D, 'out', 'v2', id_ + '.jpg')): continue
    t = tile(id_); g.paste(t.resize((TW, TH), Image.LANCZOS), (TX[i % 3], TY[i // 3]))
    full = Image.open(os.path.join(D, 'out', 'v2', id_ + '.jpg')).convert('RGB'); full.resize((330, round(330 * full.size[1] / full.size[0])), Image.LANCZOS).save(os.path.join(D, 'out', 'v2', '330', id_ + '.jpg'), quality=92)
g.crop((150, 180, 1490, 2490)).save(os.path.join(D, 'out', 'v2', 'onizleme-grid.jpg'), quality=90)
ids = ids + [f[:-4] for f in sorted(os.listdir(os.path.join(D, 'out', 'v2'))) if f.endswith('.jpg') and not f.startswith('onizleme') and f[:-4] not in ids]
for id_ in ids:
    full = Image.open(os.path.join(D, 'out', 'v2', id_ + '.jpg')).convert('RGB'); full.resize((330, round(330 * full.size[1] / full.size[0])), Image.LANCZOS).save(os.path.join(D, 'out', 'v2', '330', id_ + '.jpg'), quality=92)
# sheet: her görsel için 9:16/4:3 tam + 330 px
H = 560; rows = []
for id_ in ids:
    p = os.path.join(D, 'out', 'v2', id_ + '.jpg')
    if not os.path.exists(p): continue
    im = Image.open(p).convert('RGB'); a = im.resize((round(im.size[0] * H / im.size[1]), H), Image.LANCZOS); b = im.crop((0, 240, 1080, 1680)) if im.size[1] == 1920 else im; b = b.resize((round(b.size[0] * H / b.size[1]), H), Image.LANCZOS)
    s330 = Image.open(os.path.join(D, 'out', 'v2', '330', id_ + '.jpg')); rows.append((id_, [a, b, s330]))
W = max(sum(x.size[0] for x in r[1]) + 80 for r in rows); cols = 2; per = (len(rows) + 1) // 2
sh = Image.new('RGB', (W * cols // 1 if False else (W * 2), (H + 40) * per), '#333'); d = ImageDraw.Draw(sh)
for k, (id_, parts) in enumerate(rows):
    x = (k % 2) * W + 20; y = (k // 2) * (H + 40) + 30; d.text((x, y - 18), id_ + '  (tam | 3:4 | 330 px)', fill='white')
    for p in parts: sh.paste(p, (x, y)); x += p.size[0] + 20
sh.save(os.path.join(D, 'out', 'v2', 'onizleme-sheet.jpg'), quality=88); print('onizleme tamam', len(ids))
