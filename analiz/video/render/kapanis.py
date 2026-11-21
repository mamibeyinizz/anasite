# Son 0,7 sn (21 kare) ilk kareye çapraz geçiş: döngüde kesme görünmez. Yalnızca kare klasöründeki dosyaları günceller.
import sys, os
from PIL import Image
d = sys.argv[1]; N = 840; K = 21
f0 = Image.open(os.path.join(d, 'kare-00000.jpg')).convert('RGB')
for i in range(N - K, N):
    s = (i - (N - K) + 1) / K; a = s * s * (3 - 2 * s)
    p = os.path.join(d, 'kare-%05d.jpg' % i)
    Image.blend(Image.open(p).convert('RGB'), f0, a).save(p, quality=96)
print('çapraz geçiş uygulandı:', K, 'kare')
