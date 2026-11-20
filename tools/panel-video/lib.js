const {chromium}=require('playwright');const fs=require('fs');const {execFileSync}=require('child_process');
const W=require('path').resolve(__dirname,'w');const H='plus.qrmenuofficial.com';
const INIT=`(()=>{const K='__alt';function kur(){if(document.getElementById('dn-ui'))return;const s=document.createElement('style');s.id='dn-ui';s.textContent=\`
#dn-bant{position:fixed;left:50%;transform:translateX(-50%);width:min(820px,90vw);box-sizing:border-box;bottom:24px;font-size:18px!important;z-index:2147483647;background:rgba(13,43,34,.96);color:#F4F1E8;font:600 15px/1.4 Manrope,system-ui,sans-serif;padding:12px 14px 12px 50px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.35);border:1px solid rgba(201,168,76,.5);pointer-events:none;min-height:24px}
#dn-bant b{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:#C9A84C;color:#0D2B22;display:grid;place-items:center;font:800 14px Manrope,system-ui}
#dn-bant:empty{display:none}
.postbox[id*=gwscache],#gwscache_meta{display:none!important}
.dn-tik{position:fixed;z-index:2147483646;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(201,168,76,.45);border:3px solid #C9A84C;pointer-events:none;animation:dnt .7s ease-out forwards}
@keyframes dnt{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.5);opacity:0}}
.dn-hl{outline:3px solid #C9A84C!important;outline-offset:3px!important;border-radius:8px}
#dn-kart{position:fixed;inset:0;z-index:2147483647;background:linear-gradient(160deg,#173226,#0D2B22);color:#F4F1E8;display:flex;flex-direction:column;justify-content:center;padding:80px 120px;font-family:Manrope,system-ui;pointer-events:none}
#dn-kart p{margin:0 0 10px!important;color:#C9A84C!important;font:800 13px Manrope,system-ui!important;letter-spacing:.1em!important}#dn-kart h1{margin:0 0 14px!important;color:#F4F1E8!important;font:800 52px/1.12 Manrope,system-ui!important}#dn-kart span{color:#F4F1E8!important;font:500 22px/1.5 Manrope,system-ui!important;opacity:.85}\`;
document.documentElement.appendChild(s);const b=document.createElement('div');b.id='dn-bant';document.documentElement.appendChild(b);
const v=sessionStorage.getItem(K);if(v){const o=JSON.parse(v);b.innerHTML=o.n?'<b>'+o.n+'</b>'+o.t:o.t;if(!o.n)b.style.paddingLeft='14px';}}
window.__alt=(t,n)=>{sessionStorage.setItem(K,JSON.stringify({t,n}));kur();const b=document.getElementById('dn-bant');b.innerHTML=n?'<b>'+n+'</b>'+t:t;b.style.paddingLeft=n?'50px':'14px';};
window.__kart=(e,h,s)=>{kur();let k=document.getElementById('dn-kart');if(!k){k=document.createElement('div');k.id='dn-kart';document.documentElement.appendChild(k)}k.innerHTML='<p>'+e+'</p><h1>'+h+'</h1><span>'+s+'</span>';k.style.display='flex'};
window.__kartKapat=()=>{const k=document.getElementById('dn-kart');if(k)k.style.display='none'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',kur);else kur();})();`;
async function baglam(b,{panel=true,dosya}){const opt={viewport:{width:1280,height:800},deviceScaleFactor:1.5};
 if(panel)opt.storageState=W+'/state-'+H+'.json';const t0=Date.now();const c=await b.newContext(opt);await c.addInitScript(INIT);const p=await c.newPage();
 const kayit={c,p,t0,bas:null,dosya,kareler:[]};
 /* Netlik için CDP ekran yayını: kareler cihaz pikseliyle (2x) alınır. */
 const cdp=await c.newCDPSession(p);const kdir=__dirname+'/kare/'+dosya;fs.rmSync(kdir,{recursive:true,force:true});fs.mkdirSync(kdir,{recursive:true});
 cdp.on('Page.screencastFrame',async(f)=>{try{await cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId})}catch(e){}
   if(kayit.bas===null)return;const n=kayit.kareler.length;const yol=kdir+'/'+String(n).padStart(5,'0')+'.jpg';fs.writeFileSync(yol,Buffer.from(f.data,'base64'));kayit.kareler.push({yol,t:Date.now()});});
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:88,maxWidth:1920,maxHeight:1200,everyNthFrame:1});
 kayit.cdp=cdp;
 kayit.git=async(u,sel)=>{for(let i=0;i<6;i++){await p.goto(u.startsWith('http')?u:'https://'+H+u,{timeout:90000});await p.waitForTimeout(2500);if(await p.$(sel))return;await p.waitForTimeout(9000);}throw new Error('açılmadı '+u)};
 kayit.basla=()=>{kayit.bas=Date.now()};
 kayit.alt=async(t,n)=>{await p.evaluate(([t,n])=>window.__alt(t,n),[t,n]);};
 kayit.dokun=async(sel,{bekle=900,tikla=true}={})=>{const e=typeof sel==='string'?await p.waitForSelector(sel,{state:'visible',timeout:30000}):sel;await e.scrollIntoViewIfNeeded();await p.waitForTimeout(350);const bb=await e.boundingBox();
   await p.evaluate(([x,y])=>{const d=document.createElement('div');d.className='dn-tik';d.style.left=x+'px';d.style.top=y+'px';document.documentElement.appendChild(d);setTimeout(()=>d.remove(),800)},[bb.x+bb.width/2,bb.y+bb.height/2]);
   await p.waitForTimeout(450);if(tikla)await e.click();await p.waitForTimeout(bekle);return e};
 kayit.isaretle=async(sel,on=true)=>{await p.evaluate(([s,on])=>{document.querySelectorAll(s).forEach(e=>e.classList.toggle('dn-hl',on))},[sel,on])};
 kayit.bitir=async()=>{await p.waitForTimeout(300);try{await cdp.send('Page.stopScreencast')}catch(e){}await c.close();
   const K=kayit.kareler;if(!K.length)throw new Error('kare yok '+dosya);const son=Date.now();
   /* Ekran yalnız değişince kare gelir: her kareyi bir sonrakine kadar ekranda tut (concat süreleri). */
   const satir=[];for(let i=0;i<K.length;i++){const d=Math.min(2.2,((i+1<K.length?K[i+1].t:son)-K[i].t)/1000);satir.push(`file '${K[i].yol}'`,`duration ${Math.max(0.033,d).toFixed(3)}`);}
   satir.push(`file '${K[K.length-1].yol}'`);const lst=kdir+'/liste.txt';fs.writeFileSync(lst,satir.join('\n'));
   execFileSync('ffmpeg',['-loglevel','error','-y','-f','concat','-safe','0','-i',lst,'-vf','fps=30,scale=1920:1200:force_original_aspect_ratio=decrease,pad=1920:1200:(ow-iw)/2:(oh-ih)/2:color=0x0D2B22,format=yuv420p','-c:v','libx264','-crf','24','-preset','slow','-an',__dirname+'/parca/'+dosya+'.mp4']);return __dirname+'/parca/'+dosya+'.mp4'};
 return kayit;}
function birlestir(parcalar,cikti){const liste=__dirname+'/liste.txt';fs.writeFileSync(liste,parcalar.map(x=>`file '${x}'`).join('\n'));
 execFileSync('ffmpeg',['-loglevel','error','-y','-f','concat','-safe','0','-i',liste,'-c:v','libx264','-pix_fmt','yuv420p','-crf','27','-preset','slow','-movflags','+faststart','-an',cikti]);}
module.exports={chromium,baglam,birlestir,H};
