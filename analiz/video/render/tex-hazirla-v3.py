# Gerçek ekran görüntülerinden 3B sahne dokularını hazırlar (yalnızca kırpma; arayüz yeniden çizilmez) ve
# yakınlaştırma odaklarını (kart metin konumları) görüntüden ÖLÇER → tex/odak.json. Elle koordinat yok.
import json, os
import numpy as np
from PIL import Image
KOK = os.path.dirname(os.path.abspath(__file__))
EKRAN = os.path.join(KOK, '..', 'ekran'); TEX = os.path.join(KOK, 'tex'); os.makedirs(TEX, exist_ok=True)
# telefon ekranı oranı: layout.js TELEFON (364×464) → doku 860×1096
import subprocess
LY = json.loads(subprocess.run(['node', '-e', "import('"+os.path.join(KOK,'layout.js')+"').then(m=>console.log(JSON.stringify({w:m.TELEFON.ekranW,h:m.TELEFON.ekranH})))"], capture_output=True, text=True, check=True).stdout)
TW, TH = 860, int(round(860 * LY['h'] / LY['w']))
LISTE_Y0 = 480                       # menü listesi: arama çubuğundan başlar (üst banner ve alt "QR okutun" çubuğu dışarıda)
odak = {}

def kirp(kaynak, y0):
    return Image.open(os.path.join(EKRAN, kaynak)).convert('RGB').crop((0, y0, TW, y0 + TH))

kirp('02-dil-secici.png', 0).save(os.path.join(TEX, 'p02.jpg'), quality=94)       # üst çubuk + logo + açılır liste
for ad, dosya in (('tr', '03-menu-tr.png'), ('en', '04-menu-en.png'), ('de', '05-menu-de.png'), ('fr', '06-menu-fr.png')):
    kirp(dosya, LISTE_Y0).save(os.path.join(TEX, f'p-{ad}.jpg'), quality=94)
    g = np.array(Image.open(os.path.join(EKRAN, dosya)).convert('L')).astype(int)
    reg = g[1080:1340, 255:700]
    rows = (reg > 105).sum(axis=1); grp = []; ic = False
    for i, v in enumerate(rows):
        if v > 3 and not ic: s = i; ic = True
        if v <= 3 and ic: grp.append((s + 1080, i + 1080)); ic = False
    grp = [x for x in grp if x[1] - x[0] >= 17 and x[0] > 1100]                  # 2. kart: ad, açıklama, fiyat satırı
    ad_, ac_, fi_ = grp[0], grp[1], grp[2]
    def xr(a, b):
        sub = g[a:b, 255:700] > 105; cols = np.where(sub.any(axis=0))[0]; return cols.min() + 255, cols.max() + 255
    x0 = min(xr(*ad_)[0], xr(*ac_)[0]); x1 = max(xr(*ad_)[1], xr(*ac_)[1])
    cx = (x0 + x1) / 2; cy = (ad_[0] + fi_[1]) / 2
    odak[ad] = dict(
        cx=cx / TW, cy=(cy - LISTE_Y0) / TH,
        ad=dict(y0=ad_[0], y1=ad_[1]), ac=dict(y0=ac_[0], y1=ac_[1]), metin=dict(x0=int(x0), x1=int(x1)),
        kare=dict(x0=252 / TW, x1=(x1 + 20) / TW, y0=(ad_[0] - 16 - LISTE_Y0) / TH, y1=(fi_[1] + 10 - LISTE_Y0) / TH),
        ad_yukseklik_px=int(ad_[1] - ad_[0]), ac_yukseklik_px=int(ac_[1] - ac_[0]))
Image.open(os.path.join(EKRAN, '07b-panel-hub.png')).convert('RGB').crop((260, 0, 2560, 1600)).save(os.path.join(TEX, 'panel.jpg'), quality=93)   # css x 130–1280, y 0–800 (2×)
odak['panel'] = dict(css_x0=130, css_x1=1280, css_y0=0, css_y1=800)
odak['TW'] = TW; odak['TH'] = TH; odak['LISTE_Y0'] = LISTE_Y0
json.dump(odak, open(os.path.join(TEX, 'odak.json'), 'w'), indent=1)
print('tamam', {k: (round(v['cx'], 3), round(v['cy'], 3)) for k, v in odak.items() if isinstance(v, dict) and 'cx' in v})
