"""Cắt câu đáp án tiếng Anh từ câu thoại của phim (tái dùng giọng nhân vật) cho video Phản xạ 7 giây.

    python scripts/cut-clips.py <reflex.json> <audioDir>

Mỗi item có en_audio.from (L##) + en_audio.cut (chuỗi cần cắt) → <audioDir>/C<nn>.mp3 + .json (mốc thời gian).
Dùng mốc từng ký tự của TTS (<L##>.json → alignment); không cắt lẹm sang chữ kế tiếp.
"""
import json, os, re, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8')
cfg, d = sys.argv[1], sys.argv[2]
data = json.load(open(cfg, encoding='utf-8'))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
for it in data['items']:
    a = it['en_audio']
    if 'from' not in a:
        continue
    al = json.load(open(os.path.join(d, a['from'] + '.json'), encoding='utf-8'))['alignment']
    chars, st, en = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    # map normalized text index → char index
    idx = [i for i, ch in enumerate(chars) if norm(ch)]
    flat = ''.join(norm(chars[i]) for i in idx)
    k = flat.find(norm(a['cut']))
    if k < 0:
        sys.exit(f"#{it['n']}: không tìm thấy '{a['cut']}' trong {a['from']}")
    i0, i1 = idx[k], idx[k + len(norm(a['cut'])) - 1]
    t0 = max(0.0, st[i0] - 0.06)
    nxt = next((st[j] for j in range(i1 + 1, len(chars)) if norm(chars[j])), None)
    t1 = en[i1] + 0.18 if nxt is None else min(en[i1] + 0.18, nxt - 0.03)
    out = os.path.join(d, 'C%02d.mp3' % it['n'])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t0:.3f}', '-to', f'{t1:.3f}', '-i', os.path.join(d, a['from'] + '.mp3'),
                    '-af', 'afade=t=in:d=0.02,areverse,afade=t=in:d=0.04,areverse', '-c:a', 'libmp3lame', '-b:a', '128k', out], check=True)
    json.dump({'id': 'C%02d' % it['n'], 'from': a['from'], 'text': a['cut'], 'speaker': None, 't0': t0, 't1': t1, 'dur': t1 - t0},
              open(out[:-4] + '.json', 'w', encoding='utf-8'), ensure_ascii=False)
    print(f"C{it['n']:02d} ← {a['from']} [{t0:.2f}–{t1:.2f}] {a['cut']}")
