// Reels v2 render: reel.html'i kare kare çizer, sentez müzikle birleştirir.
// Kullanım: python3 music.py 27 && node render.js
// Çıktı: out/yorum-feedback-reels-v2.mp4 (1080x1920, 30 fps, H.264 + AAC, -14 LUFS) ve out/cover.png
const { chromium } = require('playwright');
const { spawn, spawnSync, execFileSync } = require('child_process');
const path = require('path');
const DUR = 27, FPS = 30;
const OUT = path.join(__dirname, 'out');
const VIDEO = path.join(OUT, 'video_noaudio.mp4');
const MUSIC = path.join(OUT, 'music_raw.wav');
const FINAL = path.join(OUT, 'yorum-feedback-reels-v2.mp4');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'reel.html'));
  await p.evaluate(() => window.ready());
  await p.waitForTimeout(500);

  // Kapak: kanca karesi + modül adı, dokunuş göstergesi olmadan
  await p.evaluate(() => render(1.4, { cover: true }));
  await p.screenshot({ path: path.join(OUT, 'cover.png') });

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS), '-movflags', '+faststart', VIDEO],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < DUR * FPS; f++) {
    await p.evaluate(t => render(t), f / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();

  // Ses: -14 LUFS (iki geçişli loudnorm), son 0,5 sn fade-out; video ile birleştir
  const meas = spawnSync('ffmpeg', ['-hide_banner', '-i', MUSIC, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const m = JSON.parse(meas.slice(meas.lastIndexOf('{')));
  const ln = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', VIDEO, '-i', MUSIC,
    '-filter_complex', `[1:a]atrim=0:${DUR},${ln},aresample=48000,afade=t=out:st=${DUR - 0.5}:d=0.5[a]`,
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', String(DUR), '-movflags', '+faststart', FINAL]);
  console.log('ok', FINAL);
})();
