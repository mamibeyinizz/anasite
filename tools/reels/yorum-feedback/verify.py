"""Reels v2 doğrulama: ffprobe ölçüleri, ses sinyali ve loudness, her 1 sn'den kare + kontak sheet.
Kullanım: python3 verify.py   (çıktı: out/contact-sheet.png ve konsol raporu)"""
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(D, 'out')
V = os.path.join(OUT, 'yorum-feedback-reels-v2.mp4')
def run(*a): return subprocess.run(a, capture_output=True, text=True)
pr = json.loads(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,channels,sample_rate', '-of', 'json', V).stdout)
dur = float(pr['format']['duration']); vs = [s for s in pr['streams'] if s['codec_type'] == 'video'][0]; au = [s for s in pr['streams'] if s['codec_type'] == 'audio']
vol = run('ffmpeg', '-hide_banner', '-i', V, '-af', 'volumedetect', '-vn', '-f', 'null', '-').stderr
mean = float(re.search(r'mean_volume: (-?[\d.]+)', vol).group(1)); peak = float(re.search(r'max_volume: (-?[\d.]+)', vol).group(1))
eb = run('ffmpeg', '-hide_banner', '-i', V, '-af', 'ebur128', '-vn', '-f', 'null', '-').stderr
lufs = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', eb)[-1])
tail = run('ffmpeg', '-hide_banner', '-sseof', '-0.25', '-i', V, '-af', 'volumedetect', '-vn', '-f', 'null', '-').stderr
tail_mean = float(re.search(r'mean_volume: (-?[\d.]+)', tail).group(1))
checks = {
  'süre 24–27 sn': 24 <= dur <= 27.05,
  '1080x1920': (vs['width'], vs['height']) == (1080, 1920),
  '30 fps': vs['r_frame_rate'] == '30/1',
  'H.264': vs['codec_name'] == 'h264',
  'AAC ses': bool(au) and au[0]['codec_name'] == 'aac',
  'mean_volume > -30 dB': mean > -30,
  'loudness ≈ -14 LUFS (±1)': abs(lufs + 14) <= 1,
  'son 0,25 sn sönümlü (fade-out)': tail_mean < mean - 6,
}
print(f"süre={dur:.2f}s {vs['width']}x{vs['height']} {vs['r_frame_rate']} {vs['codec_name']} / {au[0]['codec_name'] if au else '-'} {au[0].get('sample_rate','') if au else ''}Hz")
print(f"mean_volume={mean} dB  max_volume={peak} dB  integrated={lufs} LUFS  son-0.25s mean={tail_mean} dB")
for k, v in checks.items(): print(('OK  ' if v else 'HATA') + ' ' + k)
# her 1 sn'den kare (0.0, 1.0, … 26.0) + son kare
fr = os.path.join(OUT, 'frames'); os.makedirs(fr, exist_ok=True)
ts = [float(i) for i in range(int(dur))] + [dur - 0.05]
tiles = []
for t in ts:
    f = os.path.join(fr, f'f_{t:05.2f}.png'); run('ffmpeg', '-y', '-v', 'error', '-ss', f'{t}', '-i', V, '-frames:v', '1', f)
    im = Image.open(f).convert('RGB').resize((270, 480)); d = ImageDraw.Draw(im)
    # güvenli alan kılavuzu: üst %14, alt %20, yanlar 120px (1080 ölçeğinde)
    s = 270 / 1080
    d.rectangle([120 * s, 1920 * 0.14 * s, (1080 - 120) * s, 1920 * 0.80 * s], outline=(255, 64, 64))
    d.rectangle([0, 0, 60, 18], fill=(0, 0, 0)); d.text((4, 3), f'{t:.1f}s', fill=(255, 255, 255))
    tiles.append(im)
cols = 7; rows = (len(tiles) + cols - 1) // cols
sheet = Image.new('RGB', (cols * 270, rows * 480), (20, 20, 20))
for i, im in enumerate(tiles): sheet.paste(im, ((i % cols) * 270, (i // cols) * 480))
sheet.save(os.path.join(OUT, 'contact-sheet.png')); print('kontak sheet:', os.path.join(OUT, 'contact-sheet.png'))
sys.exit(0 if all(checks.values()) else 1)
