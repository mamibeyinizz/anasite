const {chromium}=require('playwright');
const sites=JSON.parse(process.argv[2]);
(async()=>{const b=await chromium.launch();
for(const [h,path,u,p] of sites){const c=await b.newContext({ignoreHTTPSErrors:true});const pg=await c.newPage();
 try{await pg.goto(`https://${h}${path}`,{timeout:60000});await pg.waitForSelector('#user_login',{timeout:40000});
 await pg.fill('#user_login',u);await pg.fill('#user_pass',p);await Promise.all([pg.waitForNavigation({timeout:60000}).catch(()=>{}),pg.click('#wp-submit')]);
 await pg.waitForTimeout(3000);
 console.log(h,pg.url(),(await pg.$('#adminmenu'))?'OK':'NO', (await pg.$eval('#login_error',e=>e.innerText).catch(()=>'')));
 await c.storageState({path:`state-${h}.json`});
 await pg.goto(`https://${h}/wp-admin/plugins.php`);console.log((await pg.$$eval('tr[data-slug]',r=>r.map(x=>x.dataset.slug+(x.classList.contains('active')?'*':'')))).join(' '));
 }catch(e){console.log(h,'ERR',e.message.slice(0,200),pg.url())}}
await b.close();})();
