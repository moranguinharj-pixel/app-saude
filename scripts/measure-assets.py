from pathlib import Path
from PIL import Image

for path in sorted(Path('assets/images').glob('anatomical-*.png')):
    image = Image.open(path).convert('RGB')
    pixels = image.load()
    xs=[]
    ys=[]
    for y in range(image.height):
        for x in range(image.width):
            r,g,b=pixels[x,y]
            if min(r,g,b) < 245 or max(r,g,b)-min(r,g,b) > 10:
                xs.append(x); ys.append(y)
    print(path.name, image.size, (min(xs), min(ys), max(xs), max(ys)), tuple(round(v/(image.size[i//2]-1),4) for i,v in enumerate((min(xs),min(ys),max(xs),max(ys))) for i in []))
    print('normalized', round(min(xs)/(image.width-1),4), round(min(ys)/(image.height-1),4), round(max(xs)/(image.width-1),4), round(max(ys)/(image.height-1),4))
