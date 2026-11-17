"""Crop the head area of cut-out heroes and overlay a coordinate grid (for locating eyes/mouth)."""
import sys
from PIL import Image, ImageDraw

out = sys.argv[1]
tiles = []
for p in sys.argv[2:]:
    im = Image.open(p).convert('RGBA')
    w, h = im.size
    head_h = int(h * 0.24)
    crop = im.crop((0, 0, w, head_h))
    bg = Image.new('RGBA', crop.size, (255, 255, 255, 255))
    bg.alpha_composite(crop)
    d = ImageDraw.Draw(bg)
    for x in range(0, w, 50):
        d.line([(x, 0), (x, head_h)], fill=(0, 160, 255, 255) if x % 100 == 0 else (180, 220, 255, 255), width=1)
        if x % 100 == 0:
            d.text((x + 2, 2), str(x), fill=(0, 90, 200, 255))
    for y in range(0, head_h, 50):
        d.line([(0, y), (w, y)], fill=(255, 80, 80, 255) if y % 100 == 0 else (255, 200, 200, 255), width=1)
        if y % 100 == 0:
            d.text((2, y + 2), str(y), fill=(200, 0, 0, 255))
    tiles.append(bg.convert('RGB'))
W = sum(t.width for t in tiles) + 10 * len(tiles)
H = max(t.height for t in tiles)
sheet = Image.new('RGB', (W, H), (240, 240, 240))
x = 0
for t in tiles:
    sheet.paste(t, (x, 0)); x += t.width + 10
sheet.save(out)
print(out, sheet.size)
