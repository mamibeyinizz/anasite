#!/usr/bin/env python3
# Kısa sürüm: "Anlamayan misafir de sormaya çekinir." (c3) ve "Çözüm menünün kendisinde." (c4) kesilir. Konuşma hızı DEĞİŞMEZ.
# Kesim, c2 sonrası ve c5 öncesi doğal sessizliğin ortasından yapılır; birleşimde 0,25 sn boşluk kalır. Çıktı: ses/anlatim-kisa.mp3 + ses/cue-kisa.json (cwd: analiz/video)
import json, subprocess
C = json.load(open('ses/cue.json')); P = {p['id']: p for p in C['parcalar']}
a_end = P['c2']['bitis'] + 0.125; b_start = P['c5']['baslangic'] - 0.125; shift = round(b_start - a_end, 3)
fc = f"[0:a]atrim=0:{a_end:.3f},asetpts=PTS-STARTPTS,afade=t=out:st={a_end-0.02:.3f}:d=0.02[a];[0:a]atrim=start={b_start:.3f},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.02[b];[a][b]concat=n=2:v=0:a=1[o]"
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'ses/anlatim.mp3', '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '44100', '-c:a', 'libmp3lame', '-q:a', '2', 'ses/anlatim-kisa.mp3'], check=True)
sil = lambda t: round(t - shift, 3) if t >= b_start else t
kalan = [p for p in C['parcalar'] if p['id'] not in ('c3', 'c4')]
for p in kalan:
    if p['baslangic'] >= b_start: p['baslangic'] = sil(p['baslangic']); p['bitis'] = sil(p['bitis'])
    if 'kelime' in p: p['kelime']['csv'] = sil(p['kelime']['csv'])
cum = [dict(c, baslangic=sil(c['baslangic']), bitis=sil(c['bitis'])) for c in C['cumleler'] if c['no'] not in (4, 5)]
# cümle numaraları: 'Anlamayan' (3) ve 'Çözüm' (4) çıkar
cum = [dict(c, baslangic=sil(c['baslangic']), bitis=sil(c['bitis'])) for c in C['cumleler'] if c['no'] not in (3, 4)]
bos = [dict(baslangic=a['bitis'], bitis=b['baslangic'], sure=round(b['baslangic'] - a['bitis'], 3)) for a, b in zip(kalan, kalan[1:])]
out = dict(C, dosya='ses/anlatim-kisa.mp3', konusmaBitis=kalan[-1]['bitis'], videoSure=round(kalan[-1]['bitis'] + 0.8, 3), parcalar=kalan, cumleler=cum, bosluklar=bos, enUzunBosluk=max(b['sure'] for b in bos),
           kesilenCumleler=['Anlamayan misafir de sormaya çekinir.', 'Çözüm menünün kendisinde.'], kesim=dict(birinciParcaBitis=round(a_end, 3), ikinciParcaBaslangic=round(b_start, 3), kayma=shift, eklenenBosluk=0.25))
out.pop('kabaParcalar', None); json.dump(out, open('ses/cue-kisa.json', 'w'), ensure_ascii=False, indent=1)
print('kısa süre', out['videoSure'], 'kayma', shift, 'parça', len(kalan))
