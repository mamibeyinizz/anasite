#!/usr/bin/env python3
# kapak/_ham-ALTIN.png + _bos-ALTIN.png + _olcum-ALTIN.json → coklu-dil-kapak-ALTIN.png|jpg, onizleme-ALTIN.jpg, kontrol-ALTIN.json
import json, os, numpy as np
from PIL import Image, ImageDraw, ImageCms, ImageFilter
D = os.path.dirname(os.path.abspath(__file__)); K = os.path.join(D, '..', 'kapak'); FD = os.path.join(D, '..', '..', 'final-coklu-dil')
o = json.load(open(f'{K}/_olcum-ALTIN.json')); H0 = np.asarray(Image.open(f'{K}/_ham-ALTIN.png').convert('RGB')).astype(np.int32); B0 = np.asarray(Image.open(f'{K}/_bos-ALTIN.png').convert('RGB')).astype(np.int32)
rng = np.random.default_rng(21); out = np.clip(np.round(H0 + rng.normal(0, .9, H0.shape[:2])[..., None] + rng.normal(0, .35, H0.shape)), 0, 255).astype(np.uint8); img = Image.fromarray(out)
icc = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes(); img.save(f'{K}/coklu-dil-kapak-ALTIN.png', icc_profile=icc, optimize=True); q = 92; img.save(f'{K}/coklu-dil-kapak-ALTIN.jpg', quality=q, subsampling=0, icc_profile=icc)
while os.path.getsize(f'{K}/coklu-dil-kapak-ALTIN.jpg') > 2_000_000 and q > 60: q -= 1; img.save(f'{K}/coklu-dil-kapak-ALTIN.jpg', quality=q, subsampling=0, icc_profile=icc)
def Y(c): c = np.asarray(c, float) / 255; c = np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]
def oran(a, b): la, lb = Y(a), Y(b); return round(float((max(la, lb) + .05) / (min(la, lb) + .05)), 2)
def med(A, r): x0, x1, y0, y1 = [int(round(v)) for v in r]; return np.median(A[y0:y1, x0:x1].reshape(-1, 3), axis=0)
def hexs(c): return '#%02X%02X%02X' % tuple(int(round(v)) for v in c)
BG = lambda r: med(B0, r)                                           # yalnız-zemin render'ından yerel zemin rengi
mt = o['metin']; pl = o['tercumanPill']; md = o['modul']; lg = o['logo']; gb = o['garson']; tu = o['turist']; ma = o['masa']; sq = o['soruBalonu']; gbl = o['garsonBalon']
DK = (13, 43, 34); KR = (244, 241, 232)
K_ = {}
K_['kanca_Garsonunuz/zemin'] = oran(DK, BG((120, 960, 440, 590))); K_['kanca_mı?/zemin'] = oran(DK, BG((pl['x1'] + 20, mt['x1'], pl['y0'] + 20, pl['y1'] - 20)))
pc = H0[int(pl['y0']) + 10:int(pl['y1']) - 10, int(pl['x0']) + 10:int(pl['x1']) - 10].reshape(-1, 3); pbg = np.median(pc[np.abs(pc - np.array(KR)).sum(axis=1) > 150], axis=0)
K_['tercuman_krem/pill'] = oran(KR, pbg); K_['tercuman_pill/zemin(grafik)'] = oran(pbg, BG((pl['x0'] + 100, pl['x1'] - 100, pl['y1'] + 8, pl['y1'] + 30)))
K_['modul_adi/zemin'] = oran(DK, BG((md['x0'], md['x1'], md['y0'], md['y1']))); K_['logo/zemin'] = oran(DK, BG((lg['x0'], lg['x1'], lg['y0'], lg['y1'])))
def govde(r):  # gövde: rect merkezi, %55–70 yükseklik
    cx = (r['x0'] + r['x1']) / 2; y = r['y0'] + .62 * (r['y1'] - r['y0']); return med(H0, (cx - 10, cx + 10, y - 10, y + 10))
cg, ct, cm = govde(gb), govde(tu), med(H0, ((ma['x0'] + ma['x1']) / 2 - 12, (ma['x0'] + ma['x1']) / 2 + 12, ma['y0'] + .22 * (ma['y1'] - ma['y0']) - 8, ma['y0'] + .22 * (ma['y1'] - ma['y0']) + 8))
K_['garson_govde/zemin(grafik)'] = oran(cg, BG((gb['x0'] - 40, gb['x0'] - 10, gb['y0'] + 200, gb['y0'] + 300))); K_['turist_govde/zemin(grafik)'] = oran(ct, BG((tu['x1'] + 2, 1075, tu['y0'] + 250, tu['y0'] + 350)))
K_['masa_ustu/zemin(grafik)'] = oran(cm, BG((ma['x0'] - 40, ma['x0'] - 10, ma['y0'] + 60, ma['y0'] + 120)))
K_['garson_ile_turist(birbirinden)'] = oran(cg, ct)
qf = med(H0, (sq['x0'] + 25, sq['x0'] + 60, sq['y0'] + 25, sq['y0'] + 60)); K_['soru_balon_dolgu/zemin'] = oran(qf, BG((sq['x0'] - 40, sq['x0'] - 10, sq['y0'] + 60, sq['y0'] + 100))); K_['soru_balon_cizgi(#0D2B22)/zemin'] = oran(DK, BG((sq['x0'] - 40, sq['x0'] - 10, sq['y0'] + 60, sq['y0'] + 100)))
bf = med(H0, (gbl['x0'] + 15, gbl['x0'] + 55, gbl['y0'] + 12, gbl['y0'] + 45)); K_['nokta_balon_dolgu/zemin'] = oran(bf, BG((gbl['x0'] - 40, gbl['x0'] - 10, gbl['y0'] + 40, gbl['y0'] + 90))); K_['soru_isareti/balon'] = oran(DK, qf)
# yerleşim: ön plan maskesi (ham−zemin)
fm = (np.abs(H0 - B0).sum(axis=2) > 12); ys, xs = np.where(fm); ink = dict(x0=int(xs.min()), x1=int(xs.max()) + 1, y0=int(ys.min()), y1=int(ys.max()) + 1)
ust240 = int(fm[:240].sum()); sagust = int(fm[240:400, 920:1080].sum()); metinInk = np.where(fm[395:810])
yerlesim = dict(ink=ink, ust_240px_dolu_piksel=ust240, sag_ust_160x160_dolu_piksel=sagust, kirpim34_icinde=bool(ink['y0'] >= 240 and ink['y1'] <= 1680), kenar_payi_3x4_alt=1680 - ink['y1'], kenar_payi_3x4_ust=ink['y0'] - 240,
    metin_x=[round(mt['x0']), round(mt['x1'])], tercuman_pill_x=[round(pl['x0']), round(pl['x1'])], yan_marj_ihlali_65=bool(mt['x0'] < 65 or mt['x1'] > 1015), metin_y=[round(mt['y0']), round(mt['y1'])], reels_ust_270_ihlal=bool(ink['y0'] < 270),
    kanca_metni_alt_672_icinde=bool(mt['y1'] <= 1248), modul_adi_y=[round(md['y0']), round(md['y1'])], figur_grubu=dict(w=round(o['grup']['w']), y=[round(o['grup']['y0']), round(o['grup']['y1'])]), logo_genislik=round(lg['x1'] - lg['x0']))
# yeşil artık: ön plan dışı zemin pikselleri (maske 8 px genişletilmiş) — bitmiş (dither'lı) görüntüden
mk = Image.fromarray((fm * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(17)); zem = np.asarray(mk) == 0; F = out.astype(int)
def yst(m, F=F): px = F[m]; r, g, b = px[:, 0], px[:, 1], px[:, 2]; return dict(ort=hexs(px.mean(axis=0)), ort_rgb=[round(float(v), 1) for v in px.mean(axis=0)], yesil_baskin_oran=round(float(((g > r) & (g > b)).mean()), 6), g_eksi_r_ort=round(float((g - r).mean()), 2), piksel=int(m.sum()))
band = np.zeros_like(zem); band[:40] = band[-40:] = True; band[:, :40] = band[:, -40:] = True
yesil = dict(tum_zemin=yst(zem), kenar_40px=yst(zem & band), referans_yalniz_zemin_render=yst(np.ones_like(zem), np.clip(np.round(B0 + np.random.default_rng(21).normal(0, .9, B0.shape[:2])[..., None]), 0, 255).astype(int)))
hsv = np.asarray(img.convert('HSV')).astype(int); yesil['hue_yesil_aralik_piksel_orani'] = round(float((zem & (hsv[..., 0] > 60) & (hsv[..., 0] < 120) & (hsv[..., 1] > 60)).sum() / zem.sum()), 6)
kon_min_metin = min(K_[k] for k in K_ if k.startswith(('kanca', 'tercuman_krem', 'modul', 'logo', 'soru_isareti'))); kon_min_graf = min(K_[k] for k in K_ if 'grafik' in k or k.startswith(('soru_balon', 'nokta_balon', 'garson_ile')) and False)
R = dict(boyut=img.size, png_mb=round(os.path.getsize(f'{K}/coklu-dil-kapak-ALTIN.png') / 1e6, 2), jpg_mb=round(os.path.getsize(f'{K}/coklu-dil-kapak-ALTIN.jpg') / 1e6, 2), jpg_kalite=q, kanca_px=o['metinPx'], satir_yuksekligi_330px=round(o['metinPx'] * .98 * 330 / 1080, 1),
    kontrast=K_, kontrast_min_metin=kon_min_metin, yerlesim=yerlesim, yesil_artik=yesil)
json.dump(R, open(f'{K}/kontrol-ALTIN.json', 'w'), ensure_ascii=False, indent=1)
# montaj: gönderi açı (krem) · carousel-1 (zümrüt) · yeni ALTIN (3:4 kırpım) — 330 ve 600 px
tiles = [('1-gonderi-aci (krem)', Image.open(f'{FD}/1-gonderi-aci.jpg').convert('RGB')), ('2-carousel-1 (zümrüt)', Image.open(f'{FD}/2-carousel-1.jpg').convert('RGB')), ('ALTIN kapak (3:4 kırpım)', img.crop((0, 240, 1080, 1680)))]
def sira(w, y0, sh, d):
    x = 20
    for ad, t in tiles:
        r = t.resize((w, round(w * t.size[1] / t.size[0])), Image.LANCZOS); sh.paste(r, (x, y0 + 20)); d.text((x, y0 + 4), f'{ad} — {w}px', fill='white'); x += w + 20
    return round(330 * 1440 / 1080)
W = 20 + 3 * (600 + 20); S = Image.new('RGB', (W, 40 + 440 + 40 + 800), '#333'); d = ImageDraw.Draw(S); sira(330, 0, S, d); sira(600, 480, S, d); S.save(f'{K}/onizleme-ALTIN.jpg', quality=90)
print(json.dumps(dict(kontrast=K_, yerlesim=yerlesim, yesil=yesil, jpg_mb=R['jpg_mb']), ensure_ascii=False, indent=1))
