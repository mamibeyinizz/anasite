import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1440}});
for(let i=1;i<=5;i++){await p.goto(`file:///home/user/anasite/analiz/carousel-dil/carousel-v6.html?s=${i}`);await p.waitForFunction('document.body.dataset.ready');await p.screenshot({path:`/home/user/anasite/analiz/carousel-dil/v6-slayt-${i}.png`});}
await b.close();
