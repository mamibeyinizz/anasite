#!/usr/bin/env python3
# v4 kısa sürüm: cümle 6 "Ürün adı, açıklama, kategori, hepsi kendi dilinde." kesilir. Konuşma hızı DEĞİŞMEZ; kesim doğal sessizlik ortasından, birleşimde 0,25 sn boşluk, 20 ms solma.
# Çıktı: ses/anlatim-v4-kisa.mp3 + ses/cue-v4-kisa.json (cümle 6 'atla' yer tutucu, süre 0). cwd: analiz/video
import json, subprocess
C = json.load(open('ses/cue-v4.json')); S = {c['no']: c for c in C['cumleler']}
a_end = S[5]['bitis'] + 0.125; b_start = S[7]['baslangic'] - 0.125; shift = round(b_start - a_end, 3)
fc = f"[0:a]atrim=0:{a_end:.3f},asetpts=PTS-STARTPTS,afade=t=out:st={a_end-0.02:.3f}:d=0.02[a];[0:a]atrim=start={b_start:.3f},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.02[b];[a][b]concat=n=2:v=0:a=1[o]"
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'ses/anlatim-v4.mp3', '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '44100', '-c:a', 'libmp3lame', '-q:a', '2', 'ses/anlatim-v4-kisa.mp3'], check=True)
out = []
for c in C['cumleler']:
    if c['no'] == 6: out.append(dict(c, baslangic=S[5]['bitis'], bitis=S[5]['bitis'], atla=True))
    elif c['no'] > 6: out.append(dict(c, baslangic=round(c['baslangic'] - shift, 3), bitis=round(c['bitis'] - shift, 3)))
    else: out.append(dict(c))
d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'ses/anlatim-v4-kisa.mp3'], capture_output=True, text=True).stdout)
json.dump(dict(dosya='ses/anlatim-v4-kisa.mp3', sure=round(d, 3), konusmaBitis=out[-1]['bitis'], tahmin=False, kesilen=['Ürün adı, açıklama, kategori, hepsi kendi dilinde.'], kesim=dict(a_end=round(a_end, 3), b_start=round(b_start, 3), kayma=shift, eklenenBosluk=0.25), cumleler=out), open('ses/cue-v4-kisa.json', 'w'), ensure_ascii=False, indent=1)
print('kısa süre', round(out[-1]['bitis'] + 0.8, 3), 'kayma', shift)
