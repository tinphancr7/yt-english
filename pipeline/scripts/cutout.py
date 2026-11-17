"""Remove the flat background around a character drawn with a closed dark outline.

Flood-fills from the image border over pixels close to the background colour
(also catches the soft ground shadow), then writes an RGBA PNG cropped to the
character with a small margin.

usage: python cutout.py <in.png> <out.png> [threshold=42]
"""
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
thresh = float(sys.argv[3]) if len(sys.argv) > 3 else 42.0

img = Image.open(src).convert('RGB')
a = np.asarray(img).astype(np.int16)
h, w, _ = a.shape

# Background colour = median of the outer 8-px frame.
frame = np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)])
bg = np.median(frame, axis=0)
dist = np.sqrt(((a - bg) ** 2).sum(axis=2))
# Light, low-saturation pixels (background + soft shadow) are fillable.
lum = a.mean(axis=2)
sat = a.max(axis=2) - a.min(axis=2)
fillable = (dist < thresh) | ((lum > 170) & (sat < 40) & (dist < thresh * 2.2))

bgmask = np.zeros((h, w), bool)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if fillable[y, x] and not bgmask[y, x]:
            bgmask[y, x] = True; q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if fillable[y, x] and not bgmask[y, x]:
            bgmask[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and not bgmask[ny, nx] and fillable[ny, nx]:
            bgmask[ny, nx] = True; q.append((ny, nx))

alpha = Image.fromarray(np.where(bgmask, 0, 255).astype(np.uint8))
# Shrink 1px then soften the edge to hide the light halo along the outline.
alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
out = img.convert('RGBA')
out.putalpha(alpha)
bbox = Image.fromarray(np.where(bgmask, 0, 255).astype(np.uint8)).getbbox()
if bbox:
    m = 12
    bbox = (max(0, bbox[0] - m), max(0, bbox[1] - m), min(w, bbox[2] + m), min(h, bbox[3] + m))
    out = out.crop(bbox)
out.save(dst)
print(f'{src} -> {dst} size={out.size} bg={bg.round().tolist()} removed={bgmask.mean():.1%}')
