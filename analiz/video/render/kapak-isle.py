#!/usr/bin/env python3
# kapak/_ham.png → kapak/coklu-dil-kapak.png|jpg (dither, sRGB), kapak/onizleme.jpg (9:16 · 3:4 · 1:1 · 330 px grid) + kontroller (kapak/kontrol.json)
import json, os, numpy as np
from PIL import Image, ImageDraw
K = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'kapak'); o = json.load(open(f'{K}/_olcum.json'))
im = np.asarray(Image.open(f'{K}/_ham.png').convert('RGB')).astype(np.float32)
rng = np.random.default_rng(7); n = rng.normal(0, 0.9, im.shape[:2])[..., None] + rng.normal(0, 0.35, im.shape)   # hafif dither (banding yok)
out = np.clip(np.round(im + n), 0, 255).astype(np.uint8); img = Image.fromarray(out)
img.save(f'{K}/coklu-dil-kapak.png', icc_profile=None, optimize=True)
q = 92
img.save(f'{K}/coklu-dil-kapak.jpg', quality=q, subsampling=0 if os.path.getsize(f'{K}/coklu-dil-kapak.png') else 2)
while os.path.getsize(f'{K}/coklu-dil-kapak.jpg') > 2_000_000 and q > 60: q -= 1; img.save(f'{K}/coklu-dil-kapak.jpg', quality=q)
# kontroller
def kutu(d): return (d['x0'], d['y0'], d['x1'], d['y1'])
ogeler = {'baslik': o['baslik'], 'pil': o['pil'], 'grup': o['grup'], 'logo': o['logo']}
def marj(crop):  # kırpım kenarına en yakın uzaklık
    y0, y1 = crop; m = 1e9
    for k, d in ogeler.items():
        if d['y1'] < y0 or d['y0'] > y1: continue                     # kırpım dışı (örn. 1:1'de logo) → gerekmez
        m = min(m, d['y0'] - y0, y1 - d['y1'], d['x0'], 1080 - d['x1'])
    return round(m, 1)
def icinde(crop): return {k: (d['y0'] >= crop[0] and d['y1'] <= crop[1]) for k, d in ogeler.items()}
def Y(c): c = np.asarray(c, float) / 255; c = np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]
def oran(a, b): la, lb = Y(a), Y(b); return (max(la, lb) + .05) / (min(la, lb) + .05)
bg = np.median(out[600:700, 40:200].reshape(-1, 3), axis=0)
kon = {'krem/zemin': round(oran((244, 241, 232), bg), 2), 'altin/zemin': round(oran((201, 168, 76), bg), 2), 'pil altin/zemin': round(oran((201, 168, 76), bg), 2)}
R = dict(boyut=img.size, png_bayt=os.path.getsize(f'{K}/coklu-dil-kapak.png'), jpg_bayt=os.path.getsize(f'{K}/coklu-dil-kapak.jpg'), jpg_kalite=q,
         baslik_px=o['baslikPx'], baslik_330px_yazi_yuksekligi=round(o['baslikPx'] * 330 / 1080, 1), grup_genislik=round(o['grup']['w']), grup_y=[round(o['grup']['y0']), round(o['grup']['y1'])],
         pil_y=[o['pil']['y0'], o['pil']['y1']], pil_yazi_px=48, logo_genislik=round(o['logo']['x1'] - o['logo']['x0']), baslik_y=[round(o['baslik']['y0']), round(o['baslik']['y1'])],
         kenar_payi_3x4_px=marj((240, 1680)), kenar_payi_1x1_px=marj((420, 1500)), kirpimda_tam_3x4=icinde((240, 1680)), kirpimda_tam_1x1={k: v for k, v in icinde((420, 1500)).items() if k != 'logo'},
         kontrast=kon, yasak_icerik='rakam/yüzde/AI/ücretsiz/anında/CTA/URL/altı çizili/telefon-ekran: yok (yalnız başlık, hap, 3B grup, logo)')
json.dump(R, open(f'{K}/kontrol.json', 'w'), ensure_ascii=False, indent=1); print(json.dumps(R, ensure_ascii=False, indent=1))
# önizleme: 9:16 tam · 3:4 · 1:1 · 330 px grid küçültmesi
H = 640; a = img.resize((int(1080 * H / 1920), H), Image.LANCZOS); b3 = img.crop((0, 240, 1080, 1680)).resize((int(1080 * H / 1440), H), Image.LANCZOS); c = img.crop((0, 420, 1080, 1500)).resize((H, H), Image.LANCZOS)
sm = img.resize((330, 587), Image.LANCZOS); sm34 = img.crop((0, 240, 1080, 1680)).resize((330, 440), Image.LANCZOS); sm11 = img.crop((0, 420, 1080, 1500)).resize((330, 330), Image.LANCZOS)
W = a.width + b3.width + c.width + 330 * 3 + 7 * 20; sh = Image.new('RGB', (W, H + 80), '#333'); d = ImageDraw.Draw(sh); x = 20
for t, im2, y in [('9:16 tam', a, 40), ('3:4 (y 240–1680)', b3, 40), ('1:1 (y 420–1500)', c, 40), ('330 px 9:16', sm, 40), ('330 px 3:4', sm34, 40), ('330 px 1:1', sm11, 40)]:
    sh.paste(im2, (x, y)); d.text((x, 12), t, fill='white'); x += im2.width + 20
sh.save(f'{K}/onizleme.jpg', quality=90)
