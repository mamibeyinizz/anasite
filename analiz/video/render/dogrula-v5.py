#!/usr/bin/env python3
# v5 doğrulama. cwd: analiz/video. NODE_PATH gerekmez. Çıktı: out/dogrulama-v5.json, out/sheet-v5-*.jpg, out/kontrol-v5/*
import json, os, re, subprocess
from PIL import Image
V = 'out/coklu-dil-reels_v5.mp4'; O = 'out/kontrol-v5'; os.makedirs(O, exist_ok=True)
sh = lambda *a, **k: subprocess.run(a, capture_output=True, text=True, **k)
cue = json.load(open('ses/cue.json')); LAY = json.load(open('out/layout.json')); R = {}
p = json.loads(sh('ffprobe', '-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', V).stdout)
v = [s for s in p['streams'] if s['codec_type'] == 'video'][0]; a = [s for s in p['streams'] if s['codec_type'] == 'audio'][0]
hedef = cue['konusmaBitis'] + 0.8
R['ffprobe'] = dict(boyut=f"{v['width']}x{v['height']}", fps=v['r_frame_rate'], sure=float(p['format']['duration']), hedef_sure=round(hedef, 3), sure_farki=round(float(p['format']['duration']) - hedef, 3),
                    renk=[v.get('color_space'), v.get('color_primaries'), v.get('color_transfer')], video_bps=int(v['bit_rate']), ses=f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']} kanal")
e = sh('ffmpeg', '-hide_banner', '-nostats', '-i', V, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-').stderr
R['ses'] = dict(LUFS=float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1]), tepe_dBTP=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)[-1]))
s = sh('ffmpeg', '-hide_banner', '-nostats', '-i', V, '-vn', '-af', 'silencedetect=n=-50dB:d=1', '-f', 'null', '-').stderr
R['ses']['sessizlik_1sn_ustu_adet'] = s.count('silence_start')
# konuşma bölgesinde bed ducking: aynı filtre grafiğinden konuşma ve bed ayrı ölçülür (konuşma bitişine kadar)
bg = float(re.search(r"bed kazancı", '') .group(0)) if False else None
vl = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', sh('ffmpeg', '-hide_banner', '-nostats', '-i', 'ses/anlatim.mp3', '-af', 'ebur128', '-f', 'null', '-').stderr)[-1])
bl = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', sh('ffmpeg', '-hide_banner', '-nostats', '-i', 'ses/ambient-bed.wav', '-af', 'ebur128', '-f', 'null', '-').stderr)[-1])
g = round((vl - 20) - bl, 2); D = round(hedef, 3)
fg = f"[1:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{D},asplit[v1][v2];[0:a]aloop=loop=-1:size=2147483647,atrim=0:{D},asetpts=N/SR/TB,volume={g}dB[bed];[bed][v2]sidechaincompress=threshold=0.02:ratio=3:attack=20:release=300:makeup=1[duck]"
def olc(etiket):
    e2 = sh('ffmpeg', '-hide_banner', '-nostats', '-i', 'ses/ambient-bed.wav', '-i', 'ses/anlatim.mp3', '-filter_complex', fg + (";[v1]anullsink" if etiket == 'duck' else ";[duck]anullsink") + f";[{etiket}]atrim=0:{cue['konusmaBitis']},ebur128[o]", '-map', '[o]', '-f', 'null', '-').stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e2)[-1])
ld, lv = olc('duck'), olc('v1')
R['miks'] = dict(konusma_LUFS_ham=vl, bed_LUFS_ham=bl, bed_kazanc_dB=g, konusma_altinda_bed_dB=round(ld - lv, 1), not_='bed konuşma altında ducking sonrası, konuşma süresi boyunca; bed konuşmanın ≈-20 dB altına ayarlı, sidechain ≈-6 dB')
# kareler
os.makedirs(f'{O}/k', exist_ok=True)
def kare(t, f): sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', V, '-frames:v', '1', '-q:v', '3', f)
def sheet(files, w, h, cols, out):
    ims = [Image.open(f).resize((w, h)) for f in files]; rows = (len(ims) + cols - 1) // cols
    s = Image.new('RGB', (cols * (w + 6), rows * (h + 6)), '#777')
    for i, im in enumerate(ims): s.paste(im, ((i % cols) * (w + 6), (i // cols) * (h + 6)))
    s.save(out, quality=88)
sh('ffmpeg', '-v', 'error', '-y', '-i', V, '-vf', 'fps=1,scale=216:384,tile=6x6', '-frames:v', '1', '-q:v', '3', 'out/sheet-v5-1sn.jpg')
for ad, (t0, t1) in {'9-12': (9, 12), '17-23': (17, 23), '24-son': (24, round(hedef, 1))}.items():
    n = int((t1 - t0) * 10); fs = []
    for k in range(n):
        t = t0 + k / 10; f = f'{O}/k/{ad}_{t:05.1f}.jpg'; kare(t, f); fs.append(f)
    sheet(fs, 108, 192, 12, f'out/sheet-v5-{ad}.jpg')
# cümle sınırlarında 0,1 sn kareler: sınırdan −0.1, 0, +0.1
fs = []; etk = []
for c in cue['cumleler'][1:]:
    for dt in (-0.1, 0.0, 0.1):
        t = max(0, c['baslangic'] + dt); f = f'{O}/k/sb_{c["no"]:02d}_{dt:+.1f}.jpg'; kare(t, f); fs.append(f)
sheet(fs, 108, 192, 9, 'out/sheet-v5-cumle-sinirlari.jpg')
# v4 | v5 önce/sonra (aynı olay; v5 zamanı konuşmaya göre)
import subprocess as sp
W = lambda t4: float(sp.run(['node', '-e', f"import('./render/timeline.js').then(m=>console.log(m.kur(JSON.parse(require('fs').readFileSync('ses/cue.json'))).W({t4})))"], capture_output=True, text=True).stdout)
pairs = [('hook', 0.2, 0.2), ('dil-secici-buyutec', 10.5, 10.5), ('bar-kirpimi-satirlar', 12.9, 12.9), ('panel', 19.0, 19.0), ('panel-sagGorunum', 20.5, 20.5), ('cta', 24.8, 24.8), ('capraz-gecis', 22.5, 22.5)]
for ad, t4, _ in pairs:
    t5 = W(t4)
    fs2 = []
    for ver, tt in (('v4', t4), ('v5', t5)):
        f = f'{O}/_{ver}.jpg'; sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{tt:.3f}', '-i', f'out/coklu-dil-reels_{ver}.mp4', '-frames:v', '1', '-q:v', '3', f); fs2.append(f)
    sheet(fs2, 405, 720, 2, f'{O}/once-sonra_{ad}.jpg')
for ver in ('v4', 'v5'): os.remove(f'{O}/_{ver}.jpg')
sh('ffmpeg', '-v', 'error', '-y', '-ss', '0', '-i', V, '-frames:v', '1', '-q:v', '2', f'{O}/ilk-kare.jpg')
Z = LAY['ozet']; R['layout'] = dict(ihlal=Z['ihlalSayisi'], kurallar=Z['kurallar'], ornek=Z['ornekSayisi'], telefon_oran=Z['doluluk']['telefon']['oran'], doluluk=Z['doluluk'], metinsiz_max_sn=Z['enUzunMetinsizSnHaric'], kontrast=Z['kontrast'], ekran_metin_px=Z['ekranMetinPx'], dd_alt_bosluk_px=Z['ddAltBoslukPx'],
    senkron_en_buyuk_fark_sn=Z['senkronEnBuyukFark'], otuz_dile_kadar_tam_opak_sn=Z['otuzDileKadarTamOpakSn'], pencere_kesik_kutu=Z['pencereKesikKutu'], uv_pencere=Z['uvPencereSayisi'], satir_karti_kenardan_kesik=Z['satirKartiBuyutecteKenardanKesik'])
R['senkron_tablosu'] = LAY['senkron']
t0 = [o for o in LAY['ornekler'] if o['t'] == 0.0][0]['ogeler']; R['ilk_kare_baslik'] = [o['text'] for o in t0 if o['id'] == 'bas']
json.dump(R, open('out/dogrulama-v5.json', 'w'), ensure_ascii=False, indent=1); print(json.dumps({k: R[k] for k in ('ffprobe', 'ses', 'miks', 'ilk_kare_baslik')}, ensure_ascii=False, indent=1))
