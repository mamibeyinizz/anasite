import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const v of ['altin','zumrut']){await p.goto('file:///home/user/anasite/analiz/video/kapak/kapak-tipografik.html?v='+v);await p.waitForFunction('document.body.dataset.ready');await p.screenshot({path:'/home/user/anasite/analiz/video/kapak/kapak-tipo-'+v+'.png'});}
await b.close();
