# Ambient bed (anlatım sesi gelene kadar): sıcak pad + yumuşak vurgu sesleri. Tamamen sentez; harici örnek/telif yok.
# Çıktı: ses/ambient-bed.wav (48 kHz, stereo, 28 sn, döngüye uygun başlangıç/bitiş). Seviye encode.sh'te -14 LUFS'a ayarlanır.
import numpy as np, wave, os
SR = 48000; D = 28.0; N = int(SR * D)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
sm = lambda x: x * x * (3 - 2 * x)
def win(a, b, fade=1.4):   # [a,b] aralığında 1, kenarlarda yumuşak geçiş
    return np.clip((t - (a - fade / 2)) / fade, 0, 1) * np.clip(((b + fade / 2) - t) / fade, 0, 1)
ACORD = [  # (başla, bitir, nota frekansları)
    (0, 7, [110.0, 164.81, 220.0, 261.63, 329.63]),      # Am9
    (7, 14, [87.31, 130.81, 174.61, 220.0, 329.63]),     # Fmaj7
    (14, 21, [130.81, 196.0, 261.63, 329.63, 392.0]),    # C
    (21, 28, [98.0, 146.83, 196.0, 246.94, 293.66]),     # G
]
L = np.zeros(N); R = np.zeros(N)
for k, (a, b, notes) in enumerate(ACORD):
    w = np.where((t >= a) & (t < b), 1.0, 0.0)
    w = np.convolve(w, np.hanning(int(SR * 1.6)) / np.hanning(int(SR * 1.6)).sum(), mode='same')   # akor geçişi çapraz erime
    if k == 0: w = np.where(t < 1.0, 1.0, w)            # döngü başı: ilk akor tam
    if k == 3: w = np.where(t > D - 1.0, 1.0, w)
    for i, f in enumerate(notes):
        for ch, det in ((0, -1.8), (1, +1.8)):
            ff = f * 2 ** (det / 1200)
            ph = 2 * np.pi * ff * t + i * 0.9
            v = np.sin(ph) + .28 * np.sin(2 * ph) + .08 * np.sin(3 * ph)
            trem = 1 + .12 * np.sin(2 * np.pi * (.17 + .03 * i) * t + i)
            (L if ch == 0 else R)[:] += w * v * trem * (0.16 if f < 120 else 0.11)
# sub
sub = np.sin(2 * np.pi * 55.0 * t) * (.5 + .5 * np.sin(2 * np.pi * .07 * t)) * .05
L += sub; R += sub
# yumuşak "ışıltı" ritmi: 8. notalar, çok düşük seviye, sahne 4–5'te biraz artar
bps = 2.0
shim = np.zeros(N)
for b in np.arange(0, D, 1 / (bps * 2)):
    i0 = int(b * SR); ln = int(.22 * SR)
    if i0 + ln >= N: break
    env = np.exp(-np.arange(ln) / (SR * .05))
    f = [659.25, 783.99, 987.77, 783.99][int(b * bps * 2) % 4]
    seg_ = np.sin(2 * np.pi * f * np.arange(ln) / SR) * env
    shim[i0:i0 + ln] += seg_ * (0.014 + 0.022 * ((10 <= b < 23)))
L += shim * .9; R += np.roll(shim, int(SR * .012)) * .9
def chime(t0, f, g=.16, pan=0.0):
    i0 = int(t0 * SR); ln = int(1.8 * SR); x = np.arange(ln) / SR
    s = (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * 2.01 * f * x) + .15 * np.sin(2 * np.pi * 3.02 * f * x)) * np.exp(-x / .42) * np.minimum(1, x / .004)
    n_ = min(ln, N - i0); L[i0:i0 + n_] += g * s[:n_] * (1 - pan) ; R[i0:i0 + n_] += g * s[:n_] * (1 + pan)
def whoosh(a, b, g=.20):
    i0 = int(a * SR); i1 = int(b * SR); n_ = i1 - i0
    x = rng.standard_normal(n_); y = np.zeros(n_); z = 0.0
    for i in range(n_):
        p = i / n_; c = .01 + .5 * p * p            # alçak geçiren kesim frekansı yükselir
        z += c * (x[i] - z); y[i] = x[i] - z if p > .5 else z
    env = np.sin(np.pi * np.linspace(0, 1, n_)) ** 2
    L[i0:i1] += g * y * env; R[i0:i1] += g * np.roll(y, 37) * env
whoosh(7.55, 8.25)                      # dönüş: telefon gelir (8,0)
chime(8.9, 880.0, .13, -.2); chime(9.1, 1318.5, .10, .2)
chime(10.0, 987.77, .12, 0)             # kanıt sahnesi
chime(11.7, 783.99, .07, -.3); chime(13.0, 880.0, .07, .3); chime(14.5, 987.77, .07, -.3); chime(15.8, 1174.7, .07, .3)   # dil değişimleri
chime(17.0, 659.25, .13, 0); chime(18.6, 880.0, .08, -.2); chime(20.0, 987.77, .08, .2); chime(21.4, 1174.7, .08, -.2)    # panel vurguları
chime(22.6, 783.99, .12, 0); chime(23.1, 1046.5, .10, .2); chime(25.4, 1318.5, .08, 0)
chime(27.25, 440.0, .10, 0)             # hook geri gelir
# döngü kenarları: 25 ms fade
f = int(SR * .025); fi = np.linspace(0, 1, f); L[:f] *= fi; R[:f] *= fi; L[-f:] *= fi[::-1]; R[-f:] *= fi[::-1]
# CTA gizlenirken (26,6–27,1) pad hafifçe çekilir, hook ile geri gelir
duck = 1 - .45 * (np.clip((t - 26.6) / .5, 0, 1) * np.clip((27.35 - t) / .25, 0, 1))
L *= duck; R *= duck
pk = max(np.abs(L).max(), np.abs(R).max()); L /= pk; R /= pk
st = (np.stack([L, R], 1) * 0.5 * 32767).astype('<i2')
os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'ses'), exist_ok=True)
with wave.open(os.path.join(os.path.dirname(__file__), '..', 'ses', 'ambient-bed.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
print('ambient-bed.wav yazıldı', D, 'sn')
