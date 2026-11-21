# Gerçek ekran görüntülerinden 3B sahne dokularını hazırlar (kırpma + uygulamanın kendi arka plan rengi). Arayüz yeniden çizilmez.
import os
from PIL import Image
KOK = os.path.dirname(os.path.abspath(__file__))
EKRAN = os.path.join(KOK, '..', 'ekran')
TEX = os.path.join(KOK, 'tex')
os.makedirs(TEX, exist_ok=True)

def telefon(ad, kaynak, y0, y1, ust=140):
    im = Image.open(os.path.join(EKRAN, kaynak)).convert('RGB')
    zemin = im.getpixel((4, 4))            # uygulamanın kendi koyu arka planı
    tuval = Image.new('RGB', (860, 1300), zemin)
    tuval.paste(im.crop((0, y0, 860, y1)), (0, ust))
    tuval.save(os.path.join(TEX, ad + '.jpg'), quality=94)
    print(ad, 'kırpma', (y0, y1), 'zemin', zemin)

telefon('p02', '02-dil-secici.png', 0, 1300, ust=0)   # dil seçici açık: üst çubuk + logo + açılır liste tam çerçevede (v2)
telefon('p03', '03-menu-tr.png', 480, 1500)      # Türkçe menü (banner ve alt çubuk dışarıda)
telefon('p04', '04-menu-en.png', 480, 1500)
telefon('p06', '06-menu-fr.png', 480, 1500)
Image.open(os.path.join(EKRAN, '05-menu-de.png')).convert('RGB').crop((0, 330, 860, 1630)).save(os.path.join(TEX, 'p05.jpg'), quality=94)  # Almanca karşılama ekranı (üst başlık ve alt şerit dışarıda)
Image.open(os.path.join(EKRAN, '07b-panel-hub.png')).convert('RGB').crop((524, 0, 2560, 840)).save(os.path.join(TEX, 'panel.jpg'), quality=93)  # panel içerik alanı (sol menü dışarıda): 1018×420 CSS px
print('tamam')
