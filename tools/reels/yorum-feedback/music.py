"""Telifsiz, sentezlenmiş arka plan müziği (harici dosya yok).
120 BPM; kick + kapalı hi-hat + bas + yumuşak pad (Am–F–C–G). Çıktı: out/music_raw.wav
Loudness normalizasyonu ve fade-out render.js içinde ffmpeg ile yapılır."""
import numpy as np, wave, os, sys
SR = 48000; DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 27.0
BPM = 120; beat = 60 / BPM; n = int(SR * DUR); t = np.arange(n) / SR
mix = np.zeros((n, 2))
def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR); j = min(n, i + len(sig))
    if i >= n: return
    s = sig[: j - i] * gain
    mix[i:j, 0] += s * (1 - pan) ** 0.5 if pan > 0 else s
    mix[i:j, 1] += s * (1 + pan) ** 0.5 if pan < 0 else s
def env(length, a=0.005, d=0.2):
    x = np.arange(int(length * SR)) / SR
    return np.minimum(1, x / a) * np.exp(-x / d)
# kick
kl = 0.35; kx = np.arange(int(kl * SR)) / SR
kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-kx * 30)) * kx) * np.exp(-kx * 9)
# hat
rng = np.random.default_rng(7)
hat = rng.standard_normal(int(0.05 * SR)); hat = np.diff(hat, prepend=0) * env(0.05, 0.001, 0.012)
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G (MIDI)
f = lambda m: 440 * 2 ** ((m - 69) / 12)
bar = 4 * beat
nb = int(DUR / beat) + 1
for b in range(nb):
    st = b * beat
    intro = st < 1.0  # ilk saniye daha hafif
    add(kick, st, 0.55 if not intro else 0.3)
    add(hat, st + beat / 2, 0.18, 0.3)
    if b % 2: add(hat, st, 0.10, -0.3)
for c in range(int(DUR / bar) + 1):
    st = c * bar; ch = chords[c % 4]; L = bar + 0.3
    x = np.arange(int(L * SR)) / SR
    e = np.minimum(1, x / 0.35) * np.minimum(1, (L - x) / 0.4).clip(0)
    pad = sum(np.sin(2 * np.pi * f(m) * x) + 0.4 * np.sin(2 * np.pi * f(m) * 2.003 * x) for m in ch) / 3
    add(pad * e, st, 0.16)
    # bas: her vuruşta kök nota, kısa
    for k in range(4):
        bl = beat * 0.8; bx = np.arange(int(bl * SR)) / SR
        bs = np.sin(2 * np.pi * f(ch[0] - 24) * bx) * np.minimum(1, bx / 0.01) * np.exp(-bx * 4)
        add(bs, st + k * beat, 0.35)
mix /= np.max(np.abs(mix)) + 1e-9; mix *= 0.8
os.makedirs(os.path.join(os.path.dirname(__file__), 'out'), exist_ok=True)
with wave.open(os.path.join(os.path.dirname(__file__), 'out', 'music_raw.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', DUR)
