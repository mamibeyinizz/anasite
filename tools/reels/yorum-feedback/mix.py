"""Seslendirme + müzik mix'i ve mux (v5).
Ses −16 LUFS, müzik −22 LUFS; ses varken müzik sidechain ile ~8 dB kısılır; toplam −14 LUFS, true peak ≤ −1,5 dBTP
(limiter −2 dBFS), son 0,5 sn fade-out.
Girdi: audio/voice_track.wav, out/music_raw.wav, out/video_noaudio.mp4, audio/timing.json
Çıktı: out/yorum-feedback-reels-v5.mp4, out/mix_stems/*.wav (ölçüm için)"""
import json, os, re, subprocess
D = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(D, 'out'); ST = os.path.join(OUT, 'mix_stems')
os.makedirs(ST, exist_ok=True)
DUR = json.load(open(os.path.join(D, 'audio', 'timing.json'), encoding='utf-8'))['scenes']['END']
VOICE, MUSIC, VIDEO = os.path.join(D, 'audio', 'voice_track.wav'), os.path.join(OUT, 'music_raw.wav'), os.path.join(OUT, 'video_noaudio.mp4')
FINAL = os.path.join(OUT, 'yorum-feedback-reels-v5.mp4')
ff = lambda *a: subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)

def ln_args(src, I, TP, extra=''):
    """İki geçişli loudnorm (linear) filtre dizesi."""
    e = subprocess.run(['ffmpeg', '-hide_banner', '-i', src, '-af', f'{extra}loudnorm=I={I}:TP={TP}:LRA=11:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(e[e.rindex('{'):])
    return (f"loudnorm=I={I}:TP={TP}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
            f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")

# 1) stemler: ses −16, müzik −22 (aynı süre, 48 kHz stereo)
v16, m22 = os.path.join(ST, 'voice_-16.wav'), os.path.join(ST, 'music_-22.wav')
ff('-i', VOICE, '-af', f'{ln_args(VOICE, -16, -2)},aresample=48000,apad=whole_dur={DUR}', '-ac', '2', '-t', f'{DUR}', v16)
ff('-i', MUSIC, '-af', f'atrim=0:{DUR},{ln_args(MUSIC, -22, -2, f"atrim=0:{DUR},")},aresample=48000', '-ac', '2', '-t', f'{DUR}', m22)
# 2) ducking: sesin kendisi sidechain; parametreler ölçülerek seçildi (konuşma sırasında ≈ −8 dB, boşlukta 0 dB)
md = os.path.join(ST, 'music_ducked.wav')
ff('-i', m22, '-i', v16, '-filter_complex',
   '[1:a]highpass=f=120[sc];[0:a][sc]sidechaincompress=threshold=0.045:ratio=5:attack=30:release=250:knee=4:makeup=1[o]', '-map', '[o]', md)
# 3) toplama + toplam −14 LUFS + limiter + fade-out
pre = os.path.join(ST, 'mix_pre.wav')
ff('-i', v16, '-i', md, '-filter_complex', '[0:a][1:a]amix=inputs=2:normalize=0[o]', '-map', '[o]', pre)
fin = os.path.join(ST, 'mix_final.wav')
ff('-i', pre, '-af', f"{ln_args(pre, -14, -2)},aresample=48000,alimiter=limit=0.70:attack=1:release=50:level=false:asc=1,afade=t=out:st={DUR - 0.5:.3f}:d=0.5", fin)
ff('-i', VIDEO, '-i', fin, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', f'{DUR}', '-movflags', '+faststart', FINAL)

# 4) ölçüm raporu
def meas(src, af=''):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-i', src, '-af', f'{af}ebur128=peak=true', '-vn', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)[-1])
print('ses stemi       I/TP:', meas(v16))
print('müzik stemi     I/TP:', meas(m22))
print('nihai (mp4)     I/TP:', meas(FINAL))
print('ok', FINAL)
