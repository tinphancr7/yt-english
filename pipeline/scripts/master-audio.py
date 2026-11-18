"""Master âm thanh của một video đã xuất về −16 LUFS, true peak ≤ −1,5 dBFS (giữ nguyên hình, chỉ đổi tiếng).

    python scripts/master-audio.py in.mp4 [out.mp4]      (không có out → ghi đè in.mp4)

Hai lượt ffmpeg loudnorm (đo → áp dụng tuyến tính), video copy nguyên. Chạy sau mỗi lần xuất (segment.mjs render
tự gọi) để QC đo đúng thứ sẽ đăng. Lý do: đoạn đố vui/màn hình cuối có nhạc nhẹ kéo độ to tích hợp xuống −17,6 LUFS
dù từng câu thoại đã ở −16 (Sổ lỗi #33).
"""
import json, os, re, subprocess, sys

sys.stdout.reconfigure(encoding='utf-8')
src = sys.argv[1]
dst = sys.argv[2] if len(sys.argv) > 2 else src
I, TP, LRA = -16.0, -1.5, 11.0
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', src, '-af', f'loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True, errors='replace').stderr
m = json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}', e)[-1])
filt = (f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
        f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
        # loudnorm cannot hold the true peak when it has to add a lot of gain (Phản xạ: long quiet countdowns → +6 dB → TP −0,5);
        # a brick-wall limiter at −2 dBFS keeps the AAC-encoded peak under −1 (Sổ lỗi #37)
        ",alimiter=limit=0.79:level=false")
tmp = dst + '.master.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-c:v', 'copy', '-af', filt, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', tmp], check=True)
os.replace(tmp, dst)
print(f"master: {m['input_i']} → {I} LUFS (TP {m['input_tp']} → ≤ {TP})")
