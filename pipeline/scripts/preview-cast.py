"""Composite cut-out heroes onto a background plate for a quick visual check."""
import sys
from PIL import Image

bg = Image.open(sys.argv[1]).convert('RGBA')
out = sys.argv[2]
chars = sys.argv[3:]
W, H = bg.size
target_h = int(H * 0.78)
x = int(W * 0.03)
for p in chars:
    c = Image.open(p).convert('RGBA')
    scale = target_h / c.height if 'muop' not in p else (target_h * 0.35) / c.height
    c = c.resize((int(c.width * scale), int(c.height * scale)), Image.LANCZOS)
    bg.alpha_composite(c, (x, H - c.height - int(H * 0.02)))
    x += c.width + int(W * 0.005)
bg.convert('RGB').resize((W // 2, H // 2)).save(out)
print(out)
