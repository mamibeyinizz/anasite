import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1440}});
for(const k of ['A-isik','B-nokta','C-cizgi','D-qr']){await p.goto('file:///home/user/anasite/analiz/carousel-dil/v5-'+k+'.html?s=1');await p.waitForFunction('document.body.dataset.ready');await p.screenshot({path:'v5-'+k+'.png'});}
await b.close();
