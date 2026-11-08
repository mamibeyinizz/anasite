"""Reels doğrulama: ffprobe ölçüleri, ses sinyali ve loudness, her 1 sn'den kare + kontak sheet.
Kullanım: python3 verify.py   (çıktı: out/contact-sheet.png ve konsol raporu)"""
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(D, 'out')
V = os.path.join(OUT, 'yorum-feedback-reels-v4.mp4')
def run(*a): return subprocess.run(a, capture_output=True, text=True)
pr = json.loads(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,channels,sample_rate', '-of', 'json', V).stdout)
dur = float(pr['format']['duration']); vs = [s for s in pr['streams'] if s['codec_type'] == 'video'][0]; au = [s for s in pr['streams'] if s['codec_type'] == 'audio']
vol = run('ffmpeg', '-hide_banner', '-i', V, '-af', 'volumedetect', '-vn', '-f', 'null', '-').stderr
mean = float(re.search(r'mean_volume: (-?[\d.]+)', vol).group(1)); peak = float(re.search(r'max_volume: (-?[\d.]+)', vol).group(1))
eb = run('ffmpeg', '-hide_banner', '-i', V, '-af', 'ebur128=peak=true', '-vn', '-f', 'null', '-').stderr
lufs = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', eb)[-1])
tp = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', eb)[-1])
tail = run('ffmpeg', '-hide_banner', '-sseof', '-0.25', '-i', V, '-af', 'volumedetect', '-vn', '-f', 'null', '-').stderr
tail_mean = float(re.search(r'mean_volume: (-?[\d.]+)', tail).group(1))
checks = {
  'süre ≈ 20 sn (19–21)': 19 <= dur <= 21,
  '1080x1920': (vs['width'], vs['height']) == (1080, 1920),
  '30 fps': vs['r_frame_rate'] == '30/1',
  'H.264': vs['codec_name'] == 'h264',
  'AAC ses': bool(au) and au[0]['codec_name'] == 'aac',
  'mean_volume > -30 dB': mean > -30,
  'loudness ≈ -14 LUFS (±1)': abs(lufs + 14) <= 1,
  'true peak ≤ -1,5 dBTP': tp <= -1.5,
  'son 0,25 sn sönümlü (fade-out)': tail_mean < mean - 6,
}

# statik kare: 10 fps örnekle; bir kareyle 12 seviyeden fazla farklı piksel oranı %0,02'nin altındaysa "aynı kare"
import numpy as np
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', V, '-vf', 'fps=10,scale=540:960,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
fr10 = np.frombuffer(raw, np.uint8).reshape(-1, 960, 540).astype(np.int16)
# seri, başlangıç karesiyle "aynı" kaldığı sürece uzar (yavaş geçişler de yakalanır)
same = lambda i, j: (np.abs(fr10[j] - fr10[i]) > 12).mean() < 0.0002
best = 0; best_end = 0; i = 0
while i < len(fr10):
    j = i
    while j + 1 < len(fr10) and same(i, j + 1): j += 1
    if j - i > best: best, best_end = j - i, j
    i = j + 1
longest_static = best / 10
print(f"en uzun statik seri: {longest_static:.1f} sn (bitiş ≈ {best_end / 10:.1f} sn)")
checks['aynı kare ≤ 2 sn'] = longest_static <= 2.0
print(f"süre={dur:.2f}s {vs['width']}x{vs['height']} {vs['r_frame_rate']} {vs['codec_name']} / {au[0]['codec_name'] if au else '-'} {au[0].get('sample_rate','') if au else ''}Hz")
print(f"mean_volume={mean} dB  max_volume={peak} dB  true_peak={tp} dBTP  integrated={lufs} LUFS  son-0.25s mean={tail_mean} dB")
# her 1 sn'den kare (0.0, 1.0, … 26.0) + son kare
fr = os.path.join(OUT, 'frames'); os.makedirs(fr, exist_ok=True)
ts = [i * 0.5 for i in range(int(dur * 2))] + [dur - 0.05]
tiles = []
for t in ts:
    f = os.path.join(fr, f'f_{t:05.2f}.png'); run('ffmpeg', '-y', '-v', 'error', '-ss', f'{t}', '-i', V, '-frames:v', '1', f)
    im = Image.open(f).convert('RGB').resize((270, 480)); d = ImageDraw.Draw(im)
    # güvenli alan kılavuzu: üst 270, alt 340, yanlar 120 px (1080 ölçeğinde)
    s = 270 / 1080
    d.rectangle([120 * s, 270 * s, (1080 - 120) * s, (1920 - 340) * s], outline=(255, 64, 64))
    d.rectangle([0, 0, 60, 18], fill=(0, 0, 0)); d.text((4, 3), f'{t:.1f}s', fill=(255, 255, 255))
    tiles.append(im)

# (b) boş içerik alanı: içerik bölgesinde (x 120–960, y 482–1500) arka plandan belirgin ayrışan piksel oranı
empty = []
for t in ts:
    f = os.path.join(fr, f'f_{t:05.2f}.png')
    a = np.asarray(Image.open(f).convert('L').crop((120, 482, 960, 1500)), dtype=np.int16)
    frac = float((a > 110).mean())
    if frac < 0.03: empty.append((t, round(frac, 3)))
print('boş içerik kareleri:', empty or 'yok')
checks['boş içerik alanı yok'] = not empty
# (d) puan satırı hizası (piksel): 8,2 sn karesinde her satırda ilk yıldızın sol kenarı ve yıldız merkez aralıkları
f = os.path.join(fr, 'align_8.2.png'); run('ffmpeg', '-y', '-v', 'error', '-ss', '8.2', '-i', V, '-frames:v', '1', f)
im = np.asarray(Image.open(f).convert('RGB'), dtype=np.int16)
star = (np.abs(im[:, :, 0] - 245) < 25) & (np.abs(im[:, :, 1] - 158) < 30) & (im[:, :, 2] < 60)   # #f59e0b
gray = (np.abs(im[:, :, 0] - 203) < 12) & (np.abs(im[:, :, 1] - 213) < 12) & (np.abs(im[:, :, 2] - 225) < 12)
mask = star | gray
mask[:, :520] = False   # yalnızca yıldız sütunu (etiket kenar yumuşatması gri sayılmasın)
rowsy = np.where(mask.sum(1) > 30)[0]
bands = []; st = rowsy[0]; pv = rowsy[0]
for y in rowsy[1:]:
    if y - pv > 6: bands.append((st, pv)); st = y
    pv = y
bands.append((st, pv)); bands = [b for b in bands if b[1] - b[0] > 30]
lefts = []; centers = []
for a0, a1 in bands:
    cols = np.where(mask[a0:a1 + 1].sum(0) > 2)[0]
    runs = []; s0 = p0 = cols[0]
    for c in cols[1:]:
        if c - p0 > 3: runs.append((s0, p0)); s0 = c
        p0 = c
    runs.append((s0, p0))
    lefts.append(int(runs[0][0])); centers.append([int((x + y) // 2) for x, y in runs])
pitch = sorted({int(np.round(np.diff(c).mean())) for c in centers if len(c) == 5})
print(f'puan satırları (piksel): {len(bands)} satır, satır aralığı {sorted(set(int(b[0]) for b in np.diff([b[0] for b in bands]).reshape(-1,1)))} px, ilk yıldız x={sorted(set(lefts))}, yıldız adımı={pitch}')
checks['puan satırları hizalı (piksel)'] = len(bands) == 5 and max(lefts) - min(lefts) <= 2 and len(pitch) == 1
cols = 10; rows = (len(tiles) + cols - 1) // cols
sheet = Image.new('RGB', (cols * 270, rows * 480), (20, 20, 20))
for i, im in enumerate(tiles): sheet.paste(im, ((i % cols) * 270, (i // cols) * 480))
checks_txt = None
sheet.save(os.path.join(OUT, 'contact-sheet.png')); print('kontak sheet:', os.path.join(OUT, 'contact-sheet.png'))
for k, v in checks.items(): print(('OK  ' if v else 'HATA') + ' ' + k)
sys.exit(0 if all(checks.values()) else 1)
