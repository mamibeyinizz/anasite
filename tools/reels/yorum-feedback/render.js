// Reels render: reel.html'i kare kare çizer.
// Seslendirmeli (v5, varsayılan): python3 audio/build_voice.py && python3 music.py <END> && node render.js && python3 mix.py
//   → zamanlama audio/timing.json'dan; ses mix.py ile eklenir (out/yorum-feedback-reels-v5.mp4)
// Yalnızca müzik (v4): node render.js --music-only  → out/yorum-feedback-reels-v4.mp4 (20 sn, -14 LUFS)
const { chromium } = require('playwright');
const { spawn, spawnSync, execFileSync } = require('child_process');
const path = require('path'); const fs = require('fs');
const MUSIC_ONLY = process.argv.includes('--music-only');
const TIMING_FILE = path.join(__dirname, 'audio', 'timing.json');
const TIMING = MUSIC_ONLY ? null : JSON.parse(fs.readFileSync(TIMING_FILE, 'utf8')).scenes;
const DUR = MUSIC_ONLY ? 20 : TIMING.END, FPS = 30;
const OUT = path.join(__dirname, 'out');
const VIDEO = path.join(OUT, 'video_noaudio.mp4');
const MUSIC = path.join(OUT, 'music_raw.wav');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  if (TIMING) await p.addInitScript(t => { window.TIMING = t; }, TIMING);
  await p.goto('file://' + path.join(__dirname, 'reel.html'));
  await p.evaluate(() => window.ready());
  await p.waitForTimeout(500);

  await p.evaluate(() => render(0, { cover: true }));
  await p.screenshot({ path: path.join(OUT, 'cover.png') });

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS), '-movflags', '+faststart', VIDEO],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round(DUR * FPS);
  for (let f = 0; f < N; f++) {
    await p.evaluate(t => render(t), f / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();

  if (!MUSIC_ONLY) { console.log('ok video', VIDEO, `${DUR}s — sesi eklemek için: python3 mix.py`); return; }
  const FINAL = path.join(OUT, 'yorum-feedback-reels-v4.mp4');
  const meas = spawnSync('ffmpeg', ['-hide_banner', '-i', MUSIC, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const m = JSON.parse(meas.slice(meas.lastIndexOf('{')));
  const ln = `loudnorm=I=-14:TP=-2:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', VIDEO, '-i', MUSIC,
    '-filter_complex', `[1:a]atrim=0:${DUR},${ln},aresample=48000,alimiter=limit=0.70:attack=1:release=50:level=false:asc=1,afade=t=out:st=${DUR - 0.5}:d=0.5[a]`,
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', String(DUR), '-movflags', '+faststart', FINAL]);
  console.log('ok', FINAL);
})();
