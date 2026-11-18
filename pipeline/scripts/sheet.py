"""Bảng ảnh (contact sheet) dùng chung cho qc-video.py (ảnh lấy từ video đã xuất) và segment.mjs (ảnh tĩnh render trước).

    python scripts/sheet.py points <timeline.json> [from] [to]   → in JSON các điểm lấy ảnh trong khoảng [from, to)
    python scripts/sheet.py make <items.json> <outDir> [prefix]   → items: [{"img", "head", "text"}] → outDir/<prefix>-NN.png
"""
import json, os, sys, textwrap
from PIL import Image, ImageDraw, ImageFont

FONT = 'C:/Windows/Fonts/arial.ttf'
FONT_B = 'C:/Windows/Fonts/arialbd.ttf'
TW, TH, CAP, COLS, PER = 480, 270, 64, 4, 16


def mmss(t):
    return f'{int(t // 60)}:{t % 60:04.1f}'


def points(tl, t0=0.0, t1=None):
    """Một điểm ở giữa mỗi câu thoại / cảnh chèn / câu đố. Trả về [(t, shot, tag, speaker, text)] theo thời gian timeline."""
    t1 = tl['duration'] if t1 is None else t1
    pts = []

    def add_lines(shot, lines, base):
        for l in lines:
            pts.append((base + l['start'] + l['dur'] / 2, shot['id'], l['id'], l.get('speaker', ''), l.get('text', '')))

    for s in tl['shots']:
        k = s['kind']
        if s.get('points'):  # shot lists its own sample points (companion videos)
            for p in s['points']:
                pts.append((s['start'] + p['t'], s['id'], p['tag'], '', p['text']))
            continue
        if k == 'video':
            pts.append((s['start'] + s['dur'] / 2, s['id'], s.get('insert', 'video'), '', 'cảnh chèn AI'))
        elif k == 'learn':
            for b in s['blocks']:
                add_lines(s, b.get('lines', []), s['start'] + b['start'])
        elif k == 'quiz':
            if s.get('intro'):
                add_lines(s, [s['intro']], s['start'])
            for i, q in enumerate(s['questions']):
                pts.append((s['start'] + q['cdStart'] + 1.5, s['id'], f'Q{i + 1}', '', 'đếm ngược: ' + q['q']))
                pts.append((s['start'] + q['reveal'] + 0.8, s['id'], f'Q{i + 1} đáp án', '', 'đáp án'))
        else:
            add_lines(s, s.get('lines', []), s['start'])
            if k == 'outro' and s.get('endScreenAt') is not None:
                pts.append((s['start'] + s['endScreenAt'] + 2, s['id'], 'END', '', 'màn hình cuối'))
    return sorted(p for p in pts if t0 <= p[0] < t1)


def label(p):
    t, sid, tag, spk, _ = p
    return f'{mmss(t)}  {sid} · {tag}' + (f' · {spk}' if spk else '')


def make_sheets(items, out, prefix='sheet'):
    """items: [(PIL.Image | path, head, text)] → ghi out/<prefix>-NN.png, trả về tên file."""
    font, font_b = ImageFont.truetype(FONT, 15), ImageFont.truetype(FONT_B, 15)
    os.makedirs(out, exist_ok=True)
    names = []
    for n in range(0, len(items), PER):
        chunk = items[n:n + PER]
        rows = (len(chunk) + COLS - 1) // COLS
        sheet = Image.new('RGB', (COLS * TW + (COLS + 1) * 8, rows * (TH + CAP) + (rows + 1) * 8), (40, 40, 40))
        d = ImageDraw.Draw(sheet)
        for i, (im, head, text) in enumerate(chunk):
            if not isinstance(im, Image.Image):
                im = Image.open(im) if im and os.path.exists(im) else Image.new('RGB', (TW, TH), 'red')
            im = im.convert('RGB').resize((TW, TH))
            x, y = 8 + (i % COLS) * (TW + 8), 8 + (i // COLS) * (TH + CAP + 8)
            sheet.paste(im, (x, y))
            d.rectangle([x, y + TH, x + TW, y + TH + CAP], fill=(250, 245, 230))
            d.text((x + 6, y + TH + 4), head, font=font_b, fill=(30, 30, 30))
            d.text((x + 6, y + TH + 24), '\n'.join(textwrap.wrap(text, 58)[:2]), font=font, fill=(60, 60, 60))
        name = f'{prefix}-{n // PER + 1:02d}.png'
        sheet.save(os.path.join(out, name))
        names.append(name)
    return names


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    cmd = sys.argv[1]
    if cmd == 'points':
        tl = json.load(open(sys.argv[2], encoding='utf-8'))
        t0 = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
        t1 = float(sys.argv[4]) if len(sys.argv) > 4 else None
        print(json.dumps([{'t': p[0], 'head': label(p), 'text': p[4]} for p in points(tl, t0, t1)], ensure_ascii=False))
    elif cmd == 'make':
        items = json.load(open(sys.argv[2], encoding='utf-8'))
        prefix = sys.argv[4] if len(sys.argv) > 4 else 'sheet'
        print(json.dumps(make_sheets([(i['img'], i['head'], i['text']) for i in items], sys.argv[3], prefix), ensure_ascii=False))
