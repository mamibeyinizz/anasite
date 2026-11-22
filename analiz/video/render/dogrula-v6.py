#!/usr/bin/env python3
# v6 doğrulama. Kullanım: python3 render/dogrula-v6.py tam|kisa  (cwd: analiz/video)
import json, os, re, subprocess, sys
from PIL import Image
MOD = sys.argv[1]; kisa = MOD == 'kisa'
V = 'out/coklu-dil-reels_v6-kisa.mp4' if kisa else 'out/coklu-dil-reels_v6.mp4'; CUEF = 'ses/cue-kisa.json' if kisa else 'ses/cue.json'; VOX = 'ses/anlatim-kisa.mp3' if kisa else 'ses/anlatim.mp3'
LAY = 'out/layout-kisa.json' if kisa else 'out/layout.json'; SON = 'kisa' if kisa else 'tam'; O = f'out/kontrol-v6-{SON}'; os.makedirs(f'{O}/k', exist_ok=True)
sh = lambda *a, **k: subprocess.run(a, capture_output=True, text=True, **k)
cue = json.load(open(CUEF)); L = json.load(open(LAY)); R = {}
p = json.loads(sh('ffprobe', '-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', V).stdout)
v = [s for s in p['streams'] if s['codec_type'] == 'video'][0]; a = [s for s in p['streams'] if s['codec_type'] == 'audio'][0]; hedef = cue['konusmaBitis'] + 0.8
R['ffprobe'] = dict(boyut=f"{v['width']}x{v['height']}", fps=v['r_frame_rate'], sure=float(p['format']['duration']), hedef=round(hedef, 3), fark=round(float(p['format']['duration']) - hedef, 3), renk=[v.get('color_space'), v.get('color_primaries'), v.get('color_transfer')], video_bps=int(v['bit_rate']), ses=f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']} kanal")
e = sh('ffmpeg', '-hide_banner', '-nostats', '-i', V, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-').stderr
R['ses'] = dict(LUFS=float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1]), tepe_dBTP=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)[-1]), sessizlik_1sn_ustu=sh('ffmpeg', '-hide_banner', '-nostats', '-i', V, '-vn', '-af', 'silencedetect=n=-50dB:d=1', '-f', 'null', '-').stderr.count('silence_start'))
if kisa:   # konuşma hızı değişmedi mi: kısa sesteki konuşma parçası süreleri ↔ orijinal parça süreleri
    def parcalar(f):
        s = sh('ffmpeg', '-hide_banner', '-i', f, '-af', 'silencedetect=n=-38dB:d=0.18', '-f', 'null', '-').stderr
        st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', s)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', s)]
        t = 0; out = []
        for a_, b_ in zip(st, en + [1e9]):
            if a_ - t > 0.02: out.append(round(a_ - t, 3))
            t = b_
        return out
    po = parcalar('ses/anlatim.mp3'); pk = parcalar('ses/anlatim-kisa.mp3'); R['hiz_kontrol'] = dict(orijinal_parca_sureleri=po, kisa_parca_sureleri=pk, kesilen=2, not_='kısa sürümde parçalar orijinaliyle aynı sürede (hız değişmedi); 3. ve 4. cümle çıkarıldı, birleşim boşluğu 0,25 sn')
Z = L['ozet']; R['layout'] = dict(ihlal=Z['ihlalSayisi'], kurallar=Z['kurallar'], ornek=Z['ornekSayisi'], dolgusuz_sn=Z['dolgusuzSn'], csv_kelime_sn=Z['csvKelimeSn'], metinsiz_max_sn=Z['enUzunMetinsizSnHaric'], senkron_en_buyuk_fark_sn=Z['senkronEnBuyukFark'], kontrast=Z['kontrast'], telefon_oran=Z['doluluk']['telefon']['oran'], pencere_kesik_kutu=Z['pencereKesikKutu'], video=Z['video'])
R['senkron_tablosu'] = L['senkron']; R['vurgu_ornekleri'] = Z['vurguOrnekleri']
def kare(t, f): sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', V, '-frames:v', '1', '-q:v', '3', f)
def sheet(files, w, h, cols, out):
    ims = [Image.open(f).resize((w, h)) for f in files]; rows = (len(ims) + cols - 1) // cols; s = Image.new('RGB', (cols * (w + 6), rows * (h + 6)), '#777')
    for i, im in enumerate(ims): s.paste(im, ((i % cols) * (w + 6), (i // cols) * (h + 6)))
    s.save(out, quality=88)
sh('ffmpeg', '-v', 'error', '-y', '-i', V, '-vf', 'fps=1,scale=216:384,tile=6x6', '-frames:v', '1', '-q:v', '3', f'out/sheet-v6-{SON}-1sn.jpg')
P = {x['id']: x for x in cue['parcalar']}; c10 = P['c10']; csv = c10['kelime']['csv']; c11 = P['c11']
araliklar = {'telefon-dd': (L['ozet'] and None)}
tl_t0 = [x for x in cue['parcalar'] if x['id'] in ('c4', 'c5')][0]['baslangic']
for ad, (t0, t1) in {'panel-csv': (round(c10['baslangic'] - 0.4, 1), round(c11['bitis'] + 0.4, 1)), 'telefon-dd': (round(tl_t0 - 0.4, 1), round(tl_t0 + 2.4, 1))}.items():
    fs = []
    for k in range(int((t1 - t0) * 10)):
        t = t0 + k / 10; f = f'{O}/k/{ad}_{t:05.1f}.jpg'; kare(t, f); fs.append(f)
    sheet(fs, 108, 192, 12, f'out/sheet-v6-{SON}-{ad}.jpg')
fs = []
for c in cue['cumleler'][1:]:
    for dt in (-0.1, 0.0, 0.1):
        t = max(0, c['baslangic'] + dt); f = f'{O}/k/sb_{c["no"]:02d}_{dt:+.1f}.jpg'; kare(t, f); fs.append(f)
sheet(fs, 108, 192, 9, f'out/sheet-v6-{SON}-cumle-sinirlari.jpg')
if not kisa:   # önce/sonra: v5 | v6
    pairs = [('1-csv-elle', 23.4), ('1-csv-kelimesi', csv + 0.3), ('2-telefon-dd', 10.6), ('3-otuz-dile', 26.7)]
    for ad, t in pairs:
        fs2 = []
        for ver in ('v5', 'v6'):
            f = f'{O}/_{ver}.jpg'; sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', f'out/coklu-dil-reels_{ver}.mp4', '-frames:v', '1', '-q:v', '3', f); fs2.append(f)
        sheet(fs2, 405, 720, 2, f'{O}/once-sonra_{ad}.jpg')
    for ver in ('v5', 'v6'): os.remove(f'{O}/_{ver}.jpg')
json.dump(R, open(f'out/dogrulama-v6-{SON}.json', 'w'), ensure_ascii=False, indent=1); print(json.dumps({k: R[k] for k in ('ffprobe', 'ses', 'layout')}, ensure_ascii=False, indent=1)[:2500])
