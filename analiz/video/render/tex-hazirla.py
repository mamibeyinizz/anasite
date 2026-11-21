# v4: gerçek ekran görüntülerinden doku + ölçümler. Kırpma YOK (telefon dokuları tam 860×1800); büyüteç/panel pencereleri
# layout.js sabitlerinden ve GÖRÜNTÜDEN ölçülen satır/kart/metin kutularından türetilir. Elle koordinat yok. Çıktı: tex/*.jpg, tex/odak.json
import json, os, subprocess
import numpy as np
from PIL import Image
KOK = os.path.dirname(os.path.abspath(__file__)); EKRAN = os.path.join(KOK, '..', 'ekran'); TEX = os.path.join(KOK, 'tex'); os.makedirs(TEX, exist_ok=True)
LY = json.loads(subprocess.run(['node', '-e', "import('" + os.path.join(KOK, 'layout.js') + "').then(m=>console.log(JSON.stringify({s:m.LENS.s,texW:m.LENS.texW,satirH:m.LENS.satirH,ddH:m.LENS.ddH,ddW:m.LENS.ddW,ctaH:m.LENS.ctaH,ps:m.PANEL})))"], capture_output=True, text=True, check=True).stdout)
S, LW = LY['s'], LY['texW']
EK = {'01': '01-acilis-tr.png', '02': '02-dil-secici.png', 'tr': '03-menu-tr.png', 'en': '04-menu-en.png', 'de': '05-menu-de.png', 'fr': '06-menu-fr.png'}
odak = {'S': S, 'LW': LW, 'ekranlar': {}}
def say_segs(g):
    col = g[:, 812:822].mean(axis=1); out = g[:, 840:855].mean(axis=1); d = (col - out) > 4; segs = []; s0 = None
    for y, v in enumerate(d):
        if v and s0 is None: s0 = y
        if not v and s0 is not None:
            if y - s0 > 150 and s0 > 800: segs.append((s0, y))
            s0 = None
    return segs
def satir_kutulari(g, a, b):                # satır içi metin kutuları (ad, açıklama, fiyat, süre, ok)
    kutular = []; reg = g[a:b, 262:815] > 70; rows = reg.sum(axis=1); ic = False
    for i, v in enumerate(list(rows) + [0]):
        if v > 3 and not ic: s0 = i; ic = True
        if v <= 3 and ic:
            ic = False; sub = reg[s0:i]; cols = sub.any(axis=0); x = 0
            while x < len(cols):
                if cols[x]:
                    x0 = x
                    while x < len(cols) and (cols[x] or (x + 1 < len(cols) and cols[x + 1:x + 40].any())): x += 1
                    kutular.append([int(x0 + 262), int(a + s0), int(x + 262), int(a + i)])
                x += 1
    return [k for k in kutular if k[3] - k[1] >= 6]
for ad, dosya in EK.items():
    im = Image.open(os.path.join(EKRAN, dosya)).convert('RGB'); assert im.size == (860, 1800), (dosya, im.size)
    im.save(os.path.join(TEX, f'e-{ad}.jpg'), quality=95)
    g = np.array(im.convert('L')).astype(int); d = {}
    if ad in ('01', '02', 'tr', 'en', 'de', 'fr'):
        segs = say_segs(g); d['satirlar'] = segs
        if ad in ('tr', 'en', 'de', 'fr') and len(segs) >= 3:
            h = LY['satirH'] / S
            r1, r2, r3 = segs[0], segs[1], segs[2]
            lo = r2[1] + 2 - h; hi = min(r3[0] - 3 - h, r1[0] - 3)
            assert lo <= hi, (ad, lo, hi)
            y0 = (lo + hi) / 2
            tk = []
            for r in (r1, r2): tk += satir_kutulari(g, r[0], r[1])
            xmin = min(k[0] for k in tk); xmax = max(k[2] for k in tk)
            x0 = min(262.0, xmin - 8); x1 = x0 + LW
            assert xmax <= x1 - 1, (ad, 'sağ metin taşar', xmax, x1)
            d['pencereSatir'] = dict(x0=x0, x1=x1, y0=y0, y1=y0 + h)
            d['metinKutulari'] = tk; d['kartlar'] = [dict(x0=32, y0=r[0], x1=828, y1=r[1]) for r in segs[:3]]
            d['telefonCerceve'] = dict(x0=30, x1=830, y0=r1[0] - 3, y1=r2[1] + 3)
    odak['ekranlar'][ad] = d
# dil seçici (02): öğe ayırıcıları metin merkezlerinden
g = np.array(Image.open(os.path.join(EKRAN, '02-dil-secici.png')).convert('L')).astype(int)
reg = g[130:850, 90:330] > 140; rows = reg.sum(axis=1); gr = []; ic = False
for i, v in enumerate(list(rows) + [0]):
    if v > 1 and not ic: s0 = i; ic = True
    if v <= 1 and ic: ic = False; gr.append((s0 + 130, i + 130))
gr = [x for x in gr if x[1] - x[0] >= 17][:8]
mer = [(a + b) / 2 for a, b in gr]
sep = [(mer[i] + mer[i + 1]) / 2 for i in range(len(mer) - 1)]
top = 126; itemler = []; prev = top
for i in range(8):
    nxt = sep[i] if i < len(sep) else mer[i] + 42
    itemler.append(dict(y0=prev, y1=nxt, ad=['Türkçe', 'English', 'Deutsch', 'Français', 'Español', 'Italiano', 'Русский', 'العربية'][i], metin=[18, gr[i][0], 330, gr[i][1]])); prev = nxt
dd = odak['ekranlar']['02']; dd['itemler'] = itemler
y1dd = top + LY['ddH'] / S; y1cta = top + LY['ctaH'] / S
dd['pencereDD'] = dict(x0=4.0, x1=4.0 + LY['ddW'] / S, y0=float(top), y1=y1dd); dd['pencereCTA'] = dict(x0=0.0, x1=LW, y0=float(top), y1=y1cta)
assert (y1dd - itemler[6]['y1']) * S >= 16, ('dd son satır–alt kenar < 16 px', (y1dd - itemler[6]['y1']) * S); assert dd['pencereDD']['x1'] <= 345, 'dd penceresi kategori metnini içeriyor'; assert y1dd < itemler[7]['metin'][1], 'dd penceresi 8. öğe metnini içeriyor'; assert abs(y1cta - itemler[3]['y1']) < 4, ('cta pencere ≠ 4 öğe', y1cta, itemler[3]['y1'])
dd['kutuYanal'] = dict(x0=16, x1=342)
# panel hub
Image.open(os.path.join(EKRAN, '07b-panel-hub.png')).convert('RGB').crop((260, 0, 2560, 1600)).save(os.path.join(TEX, 'panel.jpg'), quality=95)
B = json.load(open(os.path.join(KOK, 'boxes.json')))
P = LY['ps']; cw, ch = P['cssPencereW'], P['h'] / (P['w'] / P['cssPencereW'])
odak['panel'] = dict(css_x0=130, css_x1=1280, css_y0=0, css_y1=800, cssPencereW=cw, cssPencereH=ch, cssY0=P['cssY0'],
    sol=dict(x0=P['cssSol'], x1=P['cssSol'] + cw, y0=P['cssY0'], y1=P['cssY0'] + ch), sag=dict(x0=P['cssSag'], x1=P['cssSag'] + cw, y0=P['cssY0'], y1=P['cssY0'] + ch),
    kartlar={k: dict(x0=v['x'], y0=v['y'], x1=v['x'] + v['w'], y1=v['y'] + v['h']) for k, v in B.items() if isinstance(v, dict)},
    diger=dict(banner=dict(x0=282, y0=91, x1=1260, y1=195), baslik=dict(x0=280, y0=12, x1=482, y1=62), arama=dict(x0=551, y0=14, x1=1071, y1=58), sahip=dict(x0=1140, y0=18, x1=1260, y1=54), kenarCubugu=dict(x0=0, y0=0, x1=260, y1=800)),
    serit=dict(x0=P['serit']['cssX0'], x1=P['serit']['cssX1'], y0=P['serit']['cssY0'], y1=P['serit']['cssY1']))
json.dump(odak, open(os.path.join(TEX, 'odak.json'), 'w'), indent=1, ensure_ascii=False)
print('tamam', {k: v.get('pencereSatir') and {a: round(b, 1) for a, b in v['pencereSatir'].items()} for k, v in odak['ekranlar'].items() if 'pencereSatir' in v}); print('dd', itemler[6]['y1'], y1dd, itemler[3]['y1'], y1cta)
