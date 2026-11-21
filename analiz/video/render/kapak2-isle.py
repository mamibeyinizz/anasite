#!/usr/bin/env python3
# kapak/_ham-{A,B,C}.png → kapak/coklu-dil-kapak-{A,B,C}.png|jpg, kapak/onizleme-v2.jpg, kapak/kontrol-v2.json. cwd bağımsız.
import json, os, numpy as np
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__)); K = os.path.join(D, '..', 'kapak'); O = json.load(open(f'{K}/_olcum2.json')); GRID = Image.open(os.path.join(D, '..', '..', 'ekran', 'grid-1.jpg')).convert('RGB')
def Y(c): c = np.asarray(c, float) / 255; c = np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]
def oran(a, b): la, lb = Y(a), Y(b); return (max(la, lb) + .05) / (min(la, lb) + .05)
R = {}; imgs = {}
for ad in 'ABC':
    im = np.asarray(Image.open(f'{K}/_ham-{ad}.png').convert('RGB')).astype(np.float32); rng = np.random.default_rng(11)
    out = np.clip(np.round(im + rng.normal(0, .9, im.shape[:2])[..., None] + rng.normal(0, .35, im.shape)), 0, 255).astype(np.uint8); img = Image.fromarray(out); imgs[ad] = img
    img.save(f'{K}/coklu-dil-kapak-{ad}.png', optimize=True); q = 92; img.save(f'{K}/coklu-dil-kapak-{ad}.jpg', quality=q, subsampling=0)
    while os.path.getsize(f'{K}/coklu-dil-kapak-{ad}.jpg') > 2_000_000 and q > 60: q -= 1; img.save(f'{K}/coklu-dil-kapak-{ad}.jpg', quality=q)
    o = O[ad]; m = o['metin']
    # kontrast: metin kutusu içinde krem/altın piksel kümeleri ↔ yakın zemin (metin dışı) medyanı
    box = out[int(m['y0']):int(m['y1']), int(m['x0']):int(m['x1'])].reshape(-1, 3).astype(float); lum = np.array([Y(p) for p in box[::7]]); sub = box[::7]
    krem = sub[(sub[:, 0] > 225) & (sub[:, 1] > 220)]; altin = sub[(abs(sub[:, 0] - 201) < 18) & (abs(sub[:, 1] - 168) < 18) & (abs(sub[:, 2] - 76) < 30)]
    zemin = sub[lum < np.percentile(lum, 35)]; bg = np.median(zemin, axis=0)
    kon = {'krem/zemin': round(float(oran((244, 241, 232), bg)), 2), 'altin/zemin': round(float(oran((201, 168, 76), bg)), 2)}
    sag_ust = out[240:400, 920:1080].reshape(-1, 3).astype(float); bos = bool(sag_ust.std(axis=0).max() < 8)
    def marj(c0, c1):
        mm = 1e9
        for k in ('metin', 'pil', 'logo', 'grup'):
            d = o[k]
            if d['y0'] >= c0 and d['y1'] <= c1: mm = min(mm, d['y0'] - c0, c1 - d['y1'], d['x0'], 1080 - d['x1'])
        return round(mm, 1)
    R[ad] = dict(metin_px=o['metinPx'], metin_satir_yuksekligi_330px=round(o['metinPx'] * .98 * 330 / 1080, 1), kontrast=kon, sag_ust_160x160_bos=bos, soru_balonu_px=[round(o['soruBalonu']['w']), round(o['soruBalonu']['h'])],
        grup_genislik=round(o['grup']['w']), grup_y=[round(o['grup']['y0']), round(o['grup']['y1'])], metin_x=[round(m['x0']), round(m['x1'])], metin_y=[round(m['y0']), round(m['y1'])], pil_y=[round(o['pil']['y0']), round(o['pil']['y1'])],
        logo_genislik=round(o['logo']['x1'] - o['logo']['x0']), logo_y=[round(o['logo']['y0']), round(o['logo']['y1'])], kenar_payi_3x4=marj(240, 1680), kenar_payi_1x1_metin_hap=min(round(m['y0'] - 420, 1), round(o['pil']['y0'] - 420, 1)),
        metin_1x1_icinde=(m['y0'] >= 420 and m['y1'] <= 1500), jpg_mb=round(os.path.getsize(f'{K}/coklu-dil-kapak-{ad}.jpg') / 1e6, 2), png_mb=round(os.path.getsize(f'{K}/coklu-dil-kapak-{ad}.png') / 1e6, 2), jpg_kalite=q)
json.dump(R, open(f'{K}/kontrol-v2.json', 'w'), ensure_ascii=False, indent=1); print(json.dumps(R, ensure_ascii=False, indent=1))
# önizleme: her varyant 9:16 · 3:4 · 1:1 · 330 px (3 oran)
H = 520; rows = []
for ad in 'ABC':
    im = imgs[ad]; parts = [im.resize((int(1080 * H / 1920), H), Image.LANCZOS), im.crop((0, 240, 1080, 1680)).resize((int(1080 * H / 1440), H), Image.LANCZOS), im.crop((0, 420, 1080, 1500)).resize((H, H), Image.LANCZOS)]
    s330 = [im.resize((330, 587), Image.LANCZOS), im.crop((0, 240, 1080, 1680)).resize((330, 440), Image.LANCZOS), im.crop((0, 420, 1080, 1500)).resize((330, 330), Image.LANCZOS)]
    w = sum(p.width for p in parts + s330) + 8 * 20; row = Image.new('RGB', (w, 600), '#333'); d = ImageDraw.Draw(row); x = 20
    d.text((x, 4), f'{ad}: 9:16 · 3:4 · 1:1 | 330 px: 9:16 · 3:4 · 1:1', fill='white')
    for p in parts + s330: row.paste(p, (x, 24)); x += p.width + 20
    rows.append(row)
# mevcut grid karolarıyla montaj: grid-1'in 1. karosu yerine kapak (3:4 kırpım); 2 satır × 3 karo
TX0, TY0, TW, TH = 198, 239, 419, 557                                      # grid-1.jpg (1600×2560) 1. karo (ekrandan ölçülen)
mont = []
for ad in 'ABC':
    g = GRID.copy(); g.paste(imgs[ad].crop((0, 240, 1080, 1680)).resize((TW, TH), Image.LANCZOS), (TX0, TY0)); mont.append(g.crop((150, 180, 1480, 1400)).resize((665, 610), Image.LANCZOS))
W = max(r.width for r in rows); sh = Image.new('RGB', (W, 600 * 3 + 640), '#222'); y = 0
for r in rows: sh.paste(r, (0, y)); y += 600
d = ImageDraw.Draw(sh); d.text((20, y + 4), 'Grid montajı: mevcut karolar (grid-1.jpg) + 1. karo yerine A | B | C', fill='white'); x = 20
for m_ in mont: sh.paste(m_, (x, y + 24)); x += m_.width + 20
sh.save(f'{K}/onizleme-v2.jpg', quality=90); print('önizleme', sh.size)
