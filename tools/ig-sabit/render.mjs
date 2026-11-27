import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs'; import path from 'node:path';
const out=path.resolve(process.argv[2]); fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1440},deviceScaleFactor:+(process.env.DSF||1)});
for(let i=1;i<=3;i++){await p.goto('file://'+path.resolve(`sabit-${i}.html`));await p.waitForFunction('document.body.dataset.ready');await p.screenshot({path:path.join(out,`sabit-${i}.png`)});}
await b.close();
