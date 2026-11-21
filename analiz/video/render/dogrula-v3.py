#!/usr/bin/env python3
# v3 doğrulama. cwd: analiz/video. Kullanım: NODE_PATH=/opt/node-tools/node_modules python3 render/dogrula-v3.py
import json, os, re, subprocess
from PIL import Image
V='out/coklu-dil-reels_v3.mp4'; O='out/kontrol-v3'; R={}
sh=lambda *a,**k: subprocess.run(a,capture_output=True,text=True,**k)
p=json.loads(sh('ffprobe','-v','error','-print_format','json','-show_streams','-show_format',V).stdout)
v=[s for s in p['streams'] if s['codec_type']=='video'][0]
R['ffprobe']=dict(boyut=f"{v['width']}x{v['height']}",fps=v['r_frame_rate'],sure=float(p['format']['duration']),renk=[v.get('color_space'),v.get('color_primaries'),v.get('color_transfer')],video_bps=int(v['bit_rate']))
e=sh('ffmpeg','-hide_banner','-nostats','-i',V,'-vn','-af','ebur128=peak=true','-f','null','-').stderr
R['ses']=dict(LUFS=float(re.findall(r'I:\s+(-?[\d.]+) LUFS',e)[-1]),tepe_dBTP=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS',e)[-1]))
L=json.load(open('out/layout.json'))['ozet']; R['layout']=dict(ihlal=L['ihlalSayisi'],kurallar=L['kurallar'],ornek=L['ornekSayisi'],telefon_px=L['telefonGenislikPx'],kontrast=L['kontrast'],otuz_dile_kadar_sn=L['otuzDileKadarTamOpakSn'])
os.makedirs(O,exist_ok=True)
def sheet(files,w,h,cols,out):
    ims=[Image.open(f).resize((w,h)) for f in files]; rows=(len(ims)+cols-1)//cols
    s=Image.new('RGB',(cols*(w+6),rows*(h+6)),'#777')
    for i,im in enumerate(ims): s.paste(im,((i%cols)*(w+6),(i//cols)*(h+6)))
    s.save(out,quality=88)
sh('ffmpeg','-v','error','-y','-i',V,'-vf','fps=1,scale=270:480,tile=4x7','-frames:v','1','-q:v','3','out/sheet-v3-1sn-4x7.jpg')
for a,b in [(8,12),(12,17),(19,23),(24,28)]:
    fs=[]
    for k in range(int((b-a)*10)):
        t=a+k/10; f=f'{O}/a{a}_{t:05.1f}.jpg'; sh('ffmpeg','-v','error','-y','-ss',f'{t:.2f}','-i',V,'-frames:v','1','-q:v','3',f); fs.append(f)
    sheet(fs,135,240,10,f'out/sheet-v3-{a}-{b}.jpg')
    for f in fs: os.remove(f)
# öncesi/sonrası (v2 | v3) aynı anlar
for i,t in enumerate([0.2,3.5,8.6,10.6,12.9,16.6,19.2,21.0,24.5],1):
    fs=[]
    for ver in ('v2','v3'):
        f=f'{O}/_{ver}.jpg'; sh('ffmpeg','-v','error','-y','-ss',str(t),'-i',f'out/coklu-dil-reels{"_v2" if ver=="v2" else "_v3"}.mp4','-frames:v','1','-q:v','3',f); fs.append(f)
    sheet(fs,405,720,2,f'{O}/once-sonra_{i:02d}_t{t:04.1f}.jpg')
for ver in ('v2','v3'): os.remove(f'{O}/_{ver}.jpg')
# kapak 3:4 (1080x1440 orta kırpma, t=0.5)
sh('ffmpeg','-v','error','-y','-ss','0.5','-i',V,'-frames:v','1','-vf','crop=1080:1440:0:240','-q:v','2',f'{O}/kapak-3x4.jpg')
json.dump(R,open('out/dogrulama-v3.json','w'),ensure_ascii=False,indent=1); print(json.dumps(R,ensure_ascii=False,indent=1))
