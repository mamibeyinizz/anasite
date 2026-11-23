import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1440}});
await p.goto('file:///home/user/anasite/analiz/carousel-dil/carousel-v6.html?s=5');await p.waitForFunction('document.body.dataset.ready');
console.log(JSON.stringify(await p.evaluate(()=>['.lab','#H','.eb','.mods','#H2','.how5','.logo'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return [s,Math.round(r.top),Math.round(r.bottom),Math.round(r.left),Math.round(r.right)]}))));
await b.close();
