"""ElevenLabs seslendirmesini sahnelere yerleştirir ve video zamanlamasını üretir.
Girdi : audio/voiceover-elevenlabs.mp3 (tek dosya, 8 konuşma parçası)
Çıktı : audio/voice_track.wav (48 kHz mono, sahnelere yerleşmiş, normalize edilmemiş)
        audio/timing.json     (sahne başlangıçları; reel.html ve render.js okur)
        audio/scenes/NN-*.wav (sahne bazlı ses dosyaları)
Kurallar: atempo ≤ %8 (burada 1.06), ses sahne başından 0,15 sn sonra başlar (≤0,3),
sahne sonu = ses sonu + 0,3 sn nefes payı, toplam 18–24 sn."""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(D, 'voiceover-elevenlabs.mp3')
SR = 48000
TEMPO = 1.06          # %6 hızlandırma (sınır ±%8)
LEAD = 0.15           # sahne başı → ses başı
BREATH = 0.30         # ses sonu → sahne sonu
INNER_GAP = 0.35      # aynı sahnedeki iki cümle arası
CTA_TAIL = 0.70       # CTA'da ses bittikten sonra kalan süre (son 0,5 sn fade-out)
# konuşma parçaları (kaynakta, silencedetect −38 dB ile ölçüldü) ve metinleri (faster-whisper transkripti)
CHUNKS = [
    (0.00, 3.44, 'Tek bir kötü puan, onlarca müşteriyi uzaklaştırabilir.'),
    (4.05, 5.53, 'O puan önce size gelsin.'),
    (6.11, 9.06, 'Yeni geri bildirim, anında e-postanıza düşer.'),
    (9.75, 12.64, 'Müşteri, beş kriteri tek dokunuşla puanlar.'),
    (13.35, 15.19, 'İletişim bilgisi isteğe bağlı.'),
    (16.04, 17.99, 'Olumsuz yorumlar ayrı sekmede.'),
    (18.49, 21.38, 'Puan, masa ve kriter kırılımı tek panelde.'),
    (22.37, 25.39, "Demo için, di-em'den DEMO yazın."),
]
SCENES = [('A', '01-kanca', [0]), ('B', '02-bildirim', [1, 2]), ('C', '03-puanlama', [3]),
          ('D', '04-iletisim', [4]), ('E', '05-panel', [5, 6]), ('F', '06-cta', [7])]
PAD = 0.04  # parça kenarında nefes/sönüm kırpılmasın

def cut(a, b, out):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, a - PAD):.3f}', '-to', f'{b + PAD:.3f}', '-i', SRC,
                    '-af', f'atempo={TEMPO},aresample={SR}', '-ac', '1', out], check=True)
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out],
                                capture_output=True, text=True).stdout)

os.makedirs(os.path.join(D, 'scenes'), exist_ok=True)
tmp = os.path.join(D, 'scenes')
t = 0.0; timing = {}; placements = []; report = []
for key, name, idx in SCENES:
    timing[key] = round(t, 3)
    cur = t + LEAD; parts = []
    for j, i in enumerate(idx):
        a, b, txt = CHUNKS[i]
        f = os.path.join(tmp, f'_c{i}.wav'); d = cut(a, b, f)
        placements.append((f, cur)); parts.append((f, cur - t, d, txt))
        cur += d + (INNER_GAP if j < len(idx) - 1 else 0)
    voice_end = cur
    end = voice_end + (CTA_TAIL if key == 'F' else BREATH)
    # sahne dosyası: sahne başından itibaren (önündeki 0,15 sn sessizlik dahil)
    sf = os.path.join(tmp, f'{name}.wav')
    inputs = sum([['-i', p[0]] for p in parts], [])
    fl = ''.join(f'[{k}]adelay={int(p[1] * 1000)}|{int(p[1] * 1000)}[d{k}];' for k, p in enumerate(parts))
    fl += ''.join(f'[d{k}]' for k in range(len(parts))) + f'amix=inputs={len(parts)}:normalize=0,apad=whole_dur={end - t:.3f}[o]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', fl, '-map', '[o]', '-ar', str(SR), '-ac', '1', sf], check=True)
    report.append({'sahne': name, 'başlangıç': round(t, 2), 'süre': round(end - t, 2), 'ses_gecikmesi': LEAD,
                   'ses_süresi': round(voice_end - t - LEAD, 2), 'metin': ' '.join(p[3] for p in parts)})
    t = end
timing['END'] = round(t, 3)
# tam ses izi
inputs = sum([['-i', p[0]] for p in placements], [])
fl = ''.join(f'[{k}]adelay={int(p[1] * 1000)}|{int(p[1] * 1000)}[d{k}];' for k, p in enumerate(placements))
fl += ''.join(f'[d{k}]' for k in range(len(placements))) + f'amix=inputs={len(placements)}:normalize=0,apad=whole_dur={t:.3f}[o]'
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', fl, '-map', '[o]', '-ar', str(SR), '-ac', '1',
                os.path.join(D, 'voice_track.wav')], check=True)
for p in placements: os.remove(p[0])
json.dump({'scenes': timing, 'tempo': TEMPO, 'lead': LEAD, 'breath': BREATH, 'report': report},
          open(os.path.join(D, 'timing.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(D, 'metin.txt'), 'w', encoding='utf-8') as f:
    for r in report: f.write(f"{r['sahne']}\t{r['metin']}\n")
for r in report: print(f"{r['sahne']:12} {r['başlangıç']:6.2f}s  süre {r['süre']:5.2f}s  ses {r['ses_süresi']:5.2f}s  | {r['metin']}")
print('toplam', round(t, 2), 'sn', timing)
