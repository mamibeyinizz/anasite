#!/usr/bin/env python3
# v2 doğrulama paketi. Kullanım: python3 render/dogrula-v2.py KARE_KLASORU   (cwd: analiz/video)
import json, os, re, subprocess, sys, glob
import numpy as np
from PIL import Image
KARE = sys.argv[1]; V = 'out/coklu-dil-reels_v2.mp4'; O = 'out/kontrol-v2'; R = {}
sh = lambda *a, **k: subprocess.run(a, capture_output=True, text=True, **k)
# 1) ffprobe
p = json.loads(sh('ffprobe', '-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', V).stdout)
v = [s for s in p['streams'] if s['codec_type'] == 'video'][0]; a = [s for s in p['streams'] if s['codec_type'] == 'audio'][0]
R['ffprobe'] = dict(boyut=f"{v['width']}x{v['height']}", fps=v['r_frame_rate'], sure=float(p['format']['duration']), pix_fmt=v['pix_fmt'], renk=[v.get('color_space'), v.get('color_primaries'), v.get('color_transfer'), v.get('color_range')],
                    video_bps=int(v['bit_rate']), toplam_bps=int(p['format']['bit_rate']), ses=f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']} kanal")
# 2) ses: LUFS, true peak, sessizlik
e = sh('ffmpeg', '-hide_banner', '-nostats', '-i', V, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-').stderr
R['ses'] = dict(LUFS=float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1]), LRA=float(re.findall(r'LRA:\s+(-?[\d.]+) LU', e)[-1]), tepe_dBTP=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)[-1]))
s = sh('ffmpeg', '-hide_banner', '-nostats', '-i', V, '-vn', '-af', 'silencedetect=n=-50dB:d=1', '-f', 'null', '-').stderr
R['ses']['sessizlik_1sn_ustu_adet'] = s.count('silence_start')
# 3) boş kare / kaplama
os.makedirs(O, exist_ok=True); bl = f'{O}/bos-referans.png'
sh('ffmpeg', '-v', 'error', '-y', '-i', V, '-vf', 'select=eq(n\\,815)', '-frames:v', '1', bl)
cov = f'{O}/kaplama.txt'
if os.path.exists(cov): os.remove(cov)
sh('ffmpeg', '-hide_banner', '-nostats', '-i', V, '-loop', '1', '-i', bl, '-filter_complex', f"[0:v]format=rgb24[a];[1:v]format=rgb24[b];[a][b]blend=all_mode=difference,format=gray,lut=y='if(gt(val,34),255,0)',signalstats,metadata=print:key=lavfi.signalstats.YAVG:file={cov}", '-frames:v', '840', '-f', 'null', '-')
vals = [float(m) / 255 * 100 for m in re.findall(r'YAVG=([\d.]+)', open(cov).read())][:840]
ar = lambda x, y: (min(vals[int(x * 30):int(y * 30)]), max(vals[int(x * 30):int(y * 30)]))
R['kaplama_yuzde'] = {f'{x}-{y}': tuple(round(t, 1) for t in ar(x, y)) for x, y in [(0, 8), (8, 10), (10, 17), (17, 22.6), (22.6, 26.6), (26.6, 27.2), (27.2, 28)]}
R['kaplama_3_alti_kareler'] = [round(i / 30, 2) for i, x in enumerate(vals) if x < 3]
# 4) kontrast (altın misafir figürü / arka plan) — ham karelerden
def lin(c): c = c / 255.0; return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def Lm(rgb): r, g, b = [float(lin(np.array(x, float))) for x in rgb]; return 0.2126 * r + 0.7152 * g + 0.0722 * b
def cr(x, y): lx, ly = Lm(x), Lm(y); return (max(lx, ly) + .05) / (min(lx, ly) + .05)
kon = {}
for fr in (0, 60, 135):
    im = np.array(Image.open(os.path.join(KARE, 'kare-%05d.jpg' % fr)).convert('RGB')).astype(int)
    m = (im[..., 0] > 170) & (im[..., 1] > 140) & (im[..., 2] < 150) & (im[..., 0] - im[..., 2] > 60)
    ys, xs = np.where(m); sel = (ys > 600) & (ys < 1100); yy, xx = ys[sel], xs[sel]
    fg = im[yy, xx].mean(axis=0); bg = np.mean([np.median(im[int(yy.mean())][np.clip(np.arange(xx.min() + o, xx.max() + o), 0, 1079)], axis=0) for o in (-140, 140)], axis=0)
    kon[f't={fr / 30:.1f}sn'] = round(cr(fg, bg), 2)
R['misafir_kontrast_orani'] = kon
# 5) güvenli bölge + yazı boyu + başlık çakışması
sh('node', 'render/render.mjs', '--olc', '1', '--out', 'out', env={**os.environ, 'NODE_PATH': os.environ.get('NODE_PATH', '/opt/node-tools/node_modules')})
g = json.load(open('out/guvenli-bolge.json'))
R['guvenli_bolge'] = dict(ihlal=g['ihlalSayisi'], en_kucuk_yazi_px=g['enKucukYazi'], baslik_cakisma_kare=g['baslikCakismaKareSayisi'], ekran_yazisi_px=g['olcek'])
# 6) altyazı = ses metni
md = open('ses-metni.md').read(); duz = re.search(r'Düz metin:\s*(.+)', md).group(1)
bk = [(a_, s_) for a_, b_, i_, s_ in g['baslik']] ; kp = [(a_, s_) for a_, b_, s_ in g['kaptan']]
ekr = ' '.join(s_ for _, s_ in sorted(bk + kp)); n = lambda s_: re.sub(r'\s+', ' ', s_.replace('’', "'")).strip()
R['altyazi_ses_metni_ile_esit'] = n(ekr) == n(duz)
# 7) kontrol kareleri
os.makedirs(f'{O}/anahtar', exist_ok=True); os.makedirs(f'{O}/dongu', exist_ok=True)
for i, t in enumerate([0.2, 3.5, 6.5, 8.6, 10.6, 12.9, 14.9, 16.6, 19.2, 21.0, 22.3, 24.5, 26.2], 1):
    sh('ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', V, '-frames:v', '1', '-q:v', '3', f'{O}/anahtar/{i:02d}_t{t:05.2f}.jpg')
for k in range(16):
    t = 26.5 + .1 * k; sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', V, '-frames:v', '1', '-q:v', '3', f'{O}/dongu/t{t:05.2f}.jpg')
sh('ffmpeg', '-v', 'error', '-y', '-i', V, '-vf', 'fps=1,scale=270:480,tile=4x7', '-frames:v', '1', '-q:v', '3', 'out/sheet-v2-1sn-4x7.jpg')
def sheet(files, w, h, cols, out):
    ims = [Image.open(f).resize((w, h)) for f in files]; rows = (len(ims) + cols - 1) // cols
    s = Image.new('RGB', (cols * (w + 6), rows * (h + 6)), '#777')
    for i, im in enumerate(ims): s.paste(im, ((i % cols) * (w + 6), (i // cols) * (h + 6)))
    s.save(out, quality=88)
sheet(sorted(glob.glob(f'{O}/anahtar/*.jpg')), 270, 480, 7, 'out/sheet-v2-anahtar-13.jpg')
sheet(sorted(glob.glob(f'{O}/dongu/*.jpg')), 216, 384, 8, 'out/sheet-v2-dongu-26.5-28.jpg')
sh('ffmpeg', '-v', 'error', '-y', '-ss', '0', '-i', V, '-frames:v', '1', f'{O}/kapak.png')
Image.open(f'{O}/kapak.png').convert('RGB').save(f'{O}/kapak.jpg', quality=90); Image.open(f'{O}/kapak.png').convert('RGB').crop((0, 240, 1080, 1680)).save(f'{O}/kapak-3x4.jpg', quality=90)
os.remove(f'{O}/kapak.png'); os.remove(bl)
json.dump(R, open('out/dogrulama-v2.json', 'w'), indent=1, ensure_ascii=False)
print(json.dumps(R, indent=1, ensure_ascii=False))
