import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import fs from 'node:fs';
const [html,out]=process.argv.slice(2); fs.mkdirSync(path.dirname(out),{recursive:true});
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:+(process.env.DSF||1)});
await p.goto('file://'+path.resolve(html)); await p.waitForFunction('document.body.dataset.ready'); await p.screenshot({path:out}); await b.close();
