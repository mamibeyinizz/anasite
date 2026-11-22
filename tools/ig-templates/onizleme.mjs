// node onizleme.mjs [plan/grid-plan.json] [--oneri]  → out/onizleme-grid.jpg, out/330/*.jpg, out/onizleme-sheet.jpg
import path from 'node:path'; import { spawnSync } from 'node:child_process'; import { DIR } from './srv.mjs';
const plan = process.argv.find((a, i) => i > 1 && a.endsWith('.json')) || path.join(DIR, 'plan', 'grid-plan.json'); const args = [path.join(DIR, 'onizleme.py'), plan]; if (process.argv.includes('--oneri')) args.push(path.join(DIR, 'out', 'ritim-oneri.json'));
const r = spawnSync('python3', args, { stdio: 'inherit' }); process.exit(r.status || 0);
