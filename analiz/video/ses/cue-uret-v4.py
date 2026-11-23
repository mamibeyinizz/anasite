#!/usr/bin/env python3
# ses/anlatim-v4.mp3 → ses/cue-v4.json (cumleler:[{no,metin,baslangic,bitis}]). silencedetect n=-38dB d=0.18; segment sayısı cümle sayısına eşit değilse DURUR ve segmentleri yazar.
# Çalıştır: python3 ses/cue-uret-v4.py (cwd: analiz/video). Opsiyonel: SIL_D=0.12 ile duraklar ince aranır.
import json, os, re, subprocess, sys
V = 'ses/anlatim-v4.mp3'; D = float(os.environ.get('SIL_D', '0.18'))
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', V], capture_output=True, text=True).stdout)
t = subprocess.run(['ffmpeg', '-hide_banner', '-i', V, '-af', 'silencedetect=n=-38dB:d=0.05', '-f', 'null', '-'], capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', t)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', t)]
ham = [(a, (en[i] if i < len(en) else dur)) for i, a in enumerate(st)]; m = []
for a, b in ham:
    if m and a - m[-1][1] < 0.03: m[-1] = (m[-1][0], b)
    else: m.append((a, b))
sl = [x for x in m if x[1] - x[0] >= D]; segs = []; p = 0.0
for a, b in sl:
    if a - p > 0.02: segs.append((p, a))
    p = b
if dur - p > 0.02: segs.append((p, dur))
duz = re.search(r'Düz metin:\s*(.+)', open('ses-metni-v4.md').read()).group(1)
cum = [c.strip() for c in re.findall(r'[^.?!]+[.?!]', duz)]
print('cümle:', len(cum), '| konuşma segmenti:', len(segs)); print([(round(a, 3), round(b, 3)) for a, b in segs])
if len(segs) == len(cum) + 1:   # tek cümle içi virgül duraklaması: en kısa aralığı birleştir ve yazdır
    g = [(segs[i + 1][0] - segs[i][1], i) for i in range(len(segs) - 1)]; k = min(g)[1]
    print('birleştirilen cümle-içi duraklama: segment', k + 1, '+', k + 2, 'aralık', round(min(g)[0], 3), 'sn (beklenen: "Turist QR\'ı okutur, | dilini seçer." → 4+5)')
    if k != 3: print('beklenmeyen yer — DURDU'); sys.exit(2)
    segs[k:k + 2] = [(segs[k][0], segs[k + 1][1])]
if len(segs) != len(cum): print('EŞLEŞME YOK — DURDU'); sys.exit(2)
out = [dict(no=i + 1, metin=c, baslangic=round(a, 3), bitis=round(b, 3)) for i, (c, (a, b)) in enumerate(zip(cum, segs))]
json.dump(dict(dosya=V, sure=round(dur, 3), konusmaBitis=out[-1]['bitis'], tahmin=False, cumleler=out), open('ses/cue-v4.json', 'w'), ensure_ascii=False, indent=1)
for c in out: print(c['no'], c['baslangic'], c['bitis'], c['metin'])
