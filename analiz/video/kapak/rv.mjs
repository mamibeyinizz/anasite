import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file:///home/user/anasite/analiz/video/kapak/kapak-video.html');await p.waitForFunction('document.body.dataset.ready');
await p.screenshot({path:'/home/user/anasite/analiz/video/kapak/kapak-video-altin.png'});await b.close();
