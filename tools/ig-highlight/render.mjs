import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import fs from 'node:fs';
const out=path.resolve(process.argv[2]); fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:+(process.env.DSF||1)});
for(const k of ['sss','nasil','qr','ai','servis','dil','yorum']){await p.goto('file://'+path.resolve(k+'.html'));await p.screenshot({path:path.join(out,k+'.png')});}
await b.close();
