#!/usr/bin/env python3
# ses/anlatim.mp3 → ses/cue.json. ffprobe + silencedetect (n=-38dB, d=0.18) konuşma parçaları; ince arama (d=0.05) cümle içi/arası duraklar.
# Parça sayısı ses-metni.md düz metnindeki 14 cümle ile eşleşmezse DURUR. Çalıştır: python3 ses/cue-uret.py (cwd: analiz/video)
import json, re, subprocess, sys
V = 'ses/anlatim.mp3'
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', V], capture_output=True, text=True).stdout)
def sil(d, birles=0.03):
    t = subprocess.run(['ffmpeg', '-hide_banner', '-i', V, '-af', 'silencedetect=n=-38dB:d=0.05', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', t)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', t)]
    ham = [(a, (en[i] if i < len(en) else dur)) for i, a in enumerate(st)]; m = []
    for a, b in ham:                                   # aralarında <30 ms'lik gürültü sıçraması olan sessizlikleri birleştir
        if m and a - m[-1][1] < birles: m[-1] = (m[-1][0], b)
        else: m.append((a, b))
    return [x for x in m if x[1] - x[0] >= d]
def konusma(sl):
    segs = []; t = 0.0
    for a, b in sl:
        if a - t > 0.02: segs.append((t, a))
        t = b
    if dur - t > 0.02: segs.append((t, dur))
    return segs
kaba = konusma(sil(0.18)); ince = konusma(sil(0.18))
ince_hook = konusma(sil(0.12))[:2]                       # kanca iki cümle: aradaki 0,13 sn'lik duraktan ayrılır
md = open('ses-metni.md').read(); duz = re.search(r'Düz metin:\s*(.+)', md).group(1)
cumleler = [c.strip() for c in re.findall(r'[^.?!]+[.?!]', duz)]
# "Aynı menüyü ..., dil seçiciyi ... değiştirin." tek cümle (virgül) → cümle sayısı 14
print('düz metin cümle:', len(cumleler), '| kaba konuşma parçası:', len(kaba))
CH = [  # [kimlik, başlık parçası, cümle no (0 tabanlı)]
 ('c0', 'Yabancı misafir geldi. Menüyü kim anlatacak?', 0), ('c1', 'Garsonunuz tercümana dönüşüyor,', 2), ('c2', 'diğer masalar bekliyor.', 2),
 ('c3', 'Anlamayan misafir de sormaya çekinir.', 3), ('c4', 'Çözüm menünün kendisinde.', 4), ('c5', 'Misafir QR’ı okutur, dilini seçer.', 5),
 ('c6', 'Ürün adı, açıklama, kategori,', 6), ('c7', 'hepsi kendi dilinde açılır.', 6), ('c8', 'Bu, Çoklu Dil modülü.', 7), ('c9', 'Dilleri siz tanımlarsınız.', 8),
 ('c10', 'Çevirileri elle ya da CSV ile girersiniz.', 9), ('c11', 'Otuz dile kadar.', 10), ('c12', 'Garsonunuz servise dönsün.', 11),
 ('c13', 'Aynı menüyü kendi telefonunuzda deneyin,', 12), ('c14', 'dil seçiciyi siz değiştirin.', 12), ('c15', 'Bağlantı profilimizde.', 13)]
# ince parçalar: gürültü sıçramaları (<0.05 sn) at; ince dilimle parça sayısı = 17 (14 cümle + 3 cümle içi/arası bölünme beklenir)

print('ince konuşma parçası:', len(ince))
if len(ince) != len(CH):
    print('EŞLEŞME YOK: ince parça', len(ince), '≠ başlık parçası', len(CH)); print([(round(a, 3), round(b, 3)) for a, b in ince]); sys.exit(2)
parcalar = [dict(id=c[0], metin=c[1], cumle=c[2], baslangic=round(s[0], 3), bitis=round(s[1], 3)) for c, s in zip(CH, ince)]
# cümle bazında
cum = []
for i, c in enumerate(cumleler):
    p = [x for x in parcalar if x['cumle'] == i]
    if i == 0: cum.append(dict(no=0, metin=c, baslangic=ince_hook[0][0], bitis=ince_hook[0][1]))
    elif i == 1: cum.append(dict(no=1, metin=c, baslangic=ince_hook[1][0], bitis=ince_hook[1][1]))
    else: cum.append(dict(no=i, metin=c, baslangic=p[0]['baslangic'], bitis=p[-1]['bitis']))
bos = [dict(baslangic=round(a, 3), bitis=round(b, 3), sure=round(b - a, 3)) for (_, a), (b, _) in zip(ince, ince[1:])]
ozet = dict(dosya=V, sure=round(dur, 3), konusmaBaslangic=parcalar[0]['baslangic'], konusmaBitis=parcalar[-1]['bitis'], videoSure=round(parcalar[-1]['bitis'] + 0.8, 3),
            kabaParcaSayisi=len(kaba), cumleSayisi=len(cumleler), bosluklar=bos, enUzunBosluk=max(b['sure'] for b in bos), kirpma=[b for b in bos if b['sure'] > 0.45])
json.dump(dict(**ozet, kabaParcalar=[[round(a, 3), round(b, 3)] for a, b in kaba], parcalar=parcalar, cumleler=cum), open('ses/cue.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(ozet, ensure_ascii=False))
