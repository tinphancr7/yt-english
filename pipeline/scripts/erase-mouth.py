"""Erase the drawn mouth on a cut-out hero using rig.json -> hero-nomouth.png (+ debug preview).

Fill = median colour of a thin ring just outside the erase ellipse (skin tone),
feathered so the patch blends with the flat cel shading.
usage: python erase-mouth.py <charDir/v1> <debug.png>
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

d = Path(sys.argv[1])
rig = json.loads((d / 'rig.json').read_text(encoding='utf8'))
im = Image.open(d / rig['source']).convert('RGBA')
a = np.asarray(im).astype(np.float32)
h, w = a.shape[:2]
m = rig['mouth']
cx, cy, rx, ry = m['cx'], m['cy'], m['erase']['rx'], m['erase']['ry']
yy, xx = np.mgrid[0:h, 0:w]
e = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
ring = (e > 1.15) & (e < 1.9) & (a[..., 3] > 250)
px = a[ring][:, :3]
# Skin = brightest-ish half of ring pixels (avoids outline / beard / hair).
lum = px.mean(axis=1)
skin = np.median(px[lum >= np.median(lum)], axis=0)
mask = Image.fromarray(((e <= 1.0) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
fill = Image.new('RGBA', im.size, tuple(int(v) for v in skin) + (255,))
out = im.copy()
out.paste(fill, (0, 0), mask)
# keep original alpha (never paint outside the character)
out.putalpha(im.getchannel('A'))
out.save(d / rig['image'])
rig['skin'] = [int(v) for v in skin]
(d / 'rig.json').write_text(json.dumps(rig, ensure_ascii=False, indent=2) + '\n', encoding='utf8')

dbg = Image.new('RGBA', im.size, (255, 255, 255, 255))
dbg.alpha_composite(out)
dr = ImageDraw.Draw(dbg)
for ey in rig['eyes']:
    dr.ellipse([ey['cx'] - ey['rx'], ey['cy'] - ey['ry'], ey['cx'] + ey['rx'], ey['cy'] + ey['ry']], outline=(0, 140, 255, 255), width=2)
dr.line([cx - m['w'] / 2, cy, cx + m['w'] / 2, cy], fill=(255, 0, 0, 255), width=2)
crop = dbg.crop((max(0, cx - 260), max(0, cy - 300), min(w, cx + 260), min(h, cy + 160)))
crop.convert('RGB').save(sys.argv[2])
print(d.name if d.name != 'v1' else d.parent.name, 'skin', rig['skin'])
