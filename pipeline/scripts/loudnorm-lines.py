"""Chuẩn hóa độ to từng câu thoại về −16 LUFS (chạy sau tts-episode.mjs, trước lipsync/build-timeline).

    python scripts/loudnorm-lines.py episodes/an-uong-th01-A1/audio

- Câu lệch ≤ 0,5 LU giữ nguyên (không đụng file → đoạn đã khóa không bị đổi).
- Chỉ đổi âm lượng (gain), không đổi thời lượng → mốc thời gian TTS và khẩu hình vẫn đúng.
- Bản gốc lưu một lần ở <dir>/raw/<id>.mp3; chạy lại luôn tính từ bản gốc (idempotent).
Lý do: A1 P3 — giọng dẫn bài lệch −14,7…−17,5 LUFS, phần học nhỏ hơn phim ~2 LU (Sổ lỗi #27).
"""
import os, re, shutil, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8")

TARGET, TOL, CEIL = -16.0, 0.5, -1.5
d = sys.argv[1]
raw = os.path.join(d, 'raw')
os.makedirs(raw, exist_ok=True)


def measure(f):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True, errors='replace').stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)[-1])


changed = 0
for name in sorted(os.listdir(d)):
    if not re.fullmatch(r'[LNRCA]\d+\.mp3', name):
        continue
    f, src = os.path.join(d, name), os.path.join(raw, name)
    # TTS re-generated this line after our last pass (file newer than the raw copy) → the raw copy is stale
    if os.path.exists(src) and os.path.getmtime(f) > os.path.getmtime(src) + 1:
        shutil.copyfile(f, src)
        print(f'{name}: TTS mới → cập nhật bản gốc')
    base = src if os.path.exists(src) else f
    i, peak = measure(base)
    gain = TARGET - i
    if abs(gain) <= TOL:
        if base == src:  # previously changed but now within tolerance from the original → restore
            shutil.copyfile(src, f)
        continue
    if not os.path.exists(src):
        shutil.copyfile(f, src)
    filt = f'volume={gain:.2f}dB' + (f',alimiter=limit={10 ** (CEIL / 20):.3f}:level=false' if peak + gain > CEIL else '')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', filt, '-c:a', 'libmp3lame', '-b:a', '128k', f], check=True)
    st = os.stat(src); os.utime(f, (st.st_atime, st.st_mtime))  # same mtime as raw → a later TTS write is detectable
    i2, p2 = measure(f)
    print(f'{name}: {i:6.1f} → {i2:6.1f} LUFS (gain {gain:+.1f} dB, peak {p2:.1f})')
    changed += 1
print(f'{changed} câu đã chuẩn hóa về {TARGET} LUFS')
