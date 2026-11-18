"""QC lớp 3 — kiểm tra video đã xuất, trước khi đưa người duyệt.

    python scripts/qc-video.py out/a1-full-v3.mp4 src/data/a1-full.json out/qc/a1-full-v3

Sinh ra trong thư mục đích:
  sheet-01.png …  bảng ảnh: 1 ảnh giữa mỗi câu thoại / mỗi cảnh chèn (để Claude + người duyệt lướt nhanh)
  report.md       kết quả các phép đo, dòng ⚠️ là cần xem
  report.json     cùng dữ liệu, cho máy đọc

Phép đo:
  - âm lượng tích hợp (−16 LUFS ±1), true peak ≤ −1 dBFS
  - đoạn im > 1,5 s (dưới −45 dB), khung đen > 0,3 s, độ dài khớp timeline
  - chuyển động trong cảnh puppet: nhân vật phải đứng yên, chỉ miệng/mắt đổi.
    ≥ 4 khung liên tiếp có > 1% điểm ảnh đổi = rung/nhún (⚠️);
    1–3 khung = đổi dáng / quay mặt / zoom (ghi lại để soát trên bảng ảnh)
  - phụ đề: dòng tiếng Anh > 42 ký tự
"""
import json, os, re, subprocess, sys, textwrap
sys.stdout.reconfigure(encoding="utf-8")
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sheet import TW, TH, label, make_sheets, mmss, points as sheet_points

video, tl_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
tl = json.load(open(tl_path, encoding='utf-8'))
# Video là một đoạn (segment) của timeline: [OFF, END) — thời gian trong báo cáo vẫn theo timeline cả tập.
OFF = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
END = float(sys.argv[5]) if len(sys.argv) > 5 else tl['duration']
in_win = lambda s: s['start'] >= OFF - 0.01 and s['start'] + s['dur'] <= END + 0.01


def run(args):
    return subprocess.run(args, capture_output=True, text=True, encoding='utf-8', errors='replace')


# ---------- 1–2. bảng ảnh: 1 ảnh giữa mỗi câu ----------
points = sheet_points(tl, OFF, END)
tmp = os.path.join(out, '_f.png')
thumbs = []
for p in points:
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{p[0] - OFF:.2f}', '-i', video, '-frames:v', '1', '-vf', f'scale={TW}:{TH}', tmp])
    im = Image.open(tmp).convert('RGB') if os.path.exists(tmp) else Image.new('RGB', (TW, TH), 'red')
    thumbs.append((im.copy(), label(p), p[4]))
if os.path.exists(tmp):
    os.remove(tmp)
sheets = make_sheets(thumbs, out)

# ---------- 3. âm thanh, khung đen, độ dài ----------
r = run(['ffmpeg', '-hide_banner', '-i', video, '-af', 'silencedetect=n=-45dB:d=1.5,ebur128=peak=true', '-vf', 'blackdetect=d=0.3:pix_th=0.05', '-f', 'null', '-']).stderr
lufs = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1])
peak = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1])
silences = [(float(a), float(b)) for a, b in zip(re.findall(r'silence_start: ([\d.]+)', r), re.findall(r'silence_end: ([\d.]+)', r))]
blacks = [(float(a), float(b)) for a, b in re.findall(r'black_start:([\d.]+) black_end:([\d.]+)', r)]
dur = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).stdout.strip())

# ---------- 4. chuyển động trong cảnh puppet ----------
FPS_M, MW, MH = 12, 320, 180
motion = []  # (start, end, kind, peak%)
for s in tl['shots']:
    if s['kind'] != 'puppet' or not in_win(s):
        continue
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f"{s['start'] - OFF + 0.15:.2f}", '-t', f"{s['dur'] - 0.3:.2f}", '-i', video,
                          '-vf', f'fps={FPS_M},scale={MW}:{MH},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, MH, MW)[:, : int(MH * 0.74)]  # bỏ vùng phụ đề phía dưới
    if len(fr) < 2:
        continue
    ch = (np.abs(fr[1:].astype(int) - fr[:-1].astype(int)) > 14).mean(axis=(1, 2))
    # Nhún chậm không tạo khung đổi liên tiếp mà tạo nhiều lần đổi nhỏ rải đều. Đo trên A1 (2026-11-17):
    # bản bị nhún 1,4–2,2 lần/giây, trung vị 0,1–0,2% khung; bản đứng yên 0,04–0,34 lần/giây, trung vị 0%.
    small = ch > 0.004
    rate = int((small[1:] & ~small[:-1]).sum() + small[0]) / s['dur']
    med = float(np.median(ch)) * 100
    if rate >= 0.6 or med >= 0.05:
        motion.append((s['start'], s['start'] + s['dur'], 'rung/nhún', med, s['id'] + f' ({rate:.1f} lần đổi/giây, trung vị {med:.2f}%)'))
    big = ch > 0.01
    i = 0
    while i < len(big):
        if big[i]:
            j = i
            while j < len(big) and big[j]:
                j += 1
            t0 = s['start'] + 0.15 + (i + 1) / FPS_M
            # intentional movement: a character walking in/out (cast.from / cast.until, 0.45 s) is not a shake
            walks = [s['start'] + t for c in s.get('cast', []) for t in (c.get('from'), c.get('until')) if t is not None]
            planned = any(w - 0.25 <= t0 <= w + 0.75 for w in walks)
            kind = 'vào/ra cảnh' if planned else ('rung/nhún' if j - i >= 4 else 'đổi hình')
            motion.append((t0, t0 + (j - i) / FPS_M, kind, float(ch[i:j].max() * 100), s['id']))
            i = j
        else:
            i += 1

# ---------- 5. phụ đề ----------
long_subs = []
for s in tl['shots']:
    for l in s.get('lines', []) if s['kind'] == 'puppet' and in_win(s) else []:
        if l.get('lang') == 'en' and len(l['text']) > 42:
            long_subs.append((l['id'], len(l['text']), l['text']))

# ---------- report ----------
warn = []
ok = lambda c: '✅' if c else '⚠️'
lines = [f'# QC — {os.path.basename(video)}', '', f'Timeline: `{tl_path}` · {len(points)} ảnh trong {len(sheets)} bảng: ' + ', '.join(sheets), '']
lines += ['| Phép đo | Kết quả | Chuẩn |', '| --- | --- | --- |']
lines.append(f'| {ok(abs(lufs + 16) <= 1)} Âm lượng | {lufs} LUFS | −16 ±1 |')
lines.append(f'| {ok(peak <= -1)} True peak | {peak} dBFS | ≤ −1 |')
lines.append(f"| {ok(abs(dur - (END - OFF)) < 0.2)} Độ dài | {dur:.2f} s (timeline {END - OFF:.2f}) | khớp ±0,2 s |")
lines.append(f'| {ok(not silences)} Đoạn im > 1,5 s | {len(silences)} | 0 |')
lines.append(f'| {ok(not blacks)} Khung đen > 0,3 s | {len(blacks)} | 0 |')
shakes = [m for m in motion if m[2] == 'rung/nhún']
lines.append(f'| {ok(not shakes)} Rung/nhún trong cảnh puppet | {len(shakes)} | 0 |')
lines.append(f'| {ok(not long_subs)} Phụ đề EN > 42 ký tự | {len(long_subs)} | 0 |')
lines.append('')
if silences:
    lines += ['## ⚠️ Đoạn im', ''] + [f'- {mmss(a + OFF)} → {mmss(b + OFF)} ({b - a:.1f} s)' for a, b in silences] + ['']
if blacks:
    lines += ['## ⚠️ Khung đen', ''] + [f'- {mmss(a + OFF)} → {mmss(b + OFF)}' for a, b in blacks] + ['']
if shakes:
    lines += ['## ⚠️ Rung/nhún', ''] + [f'- {sid} {mmss(a)} → {mmss(b)} (đổi tối đa {p:.1f}% khung)' for a, b, _, p, sid in shakes] + ['']
if long_subs:
    lines += ['## ⚠️ Phụ đề dài', ''] + [f'- {i} ({n} ký tự): {t}' for i, n, t in long_subs] + ['']
jumps = [m for m in motion if m[2] in ('đổi hình', 'vào/ra cảnh')]
lines += ['## Đổi hình trong cảnh puppet (soát trên bảng ảnh: có hợp lý không?)', '']
lines += [f'- {sid} {mmss(a)} (đổi {p:.1f}% khung){" — vào/ra cảnh" if k == "vào/ra cảnh" else ""}' for a, b, k, p, sid in jumps] or ['- không có']
open(os.path.join(out, 'report.md'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
json.dump({'video': video, 'lufs': lufs, 'peak': peak, 'duration': dur, 'silences': silences, 'blacks': blacks,
           'motion': motion, 'long_subs': long_subs, 'sheets': sheets, 'points': [p[:4] for p in points]},
          open(os.path.join(out, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('\n'.join(lines))
