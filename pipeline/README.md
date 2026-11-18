# Pipeline dựng video YOLO7 English

Remotion (React → MP4) + ElevenLabs (giọng) + Rhubarb (khẩu hình). Chạy trên máy, dữ liệu lấy từ `episode.json`.

## Cài một lần

```bash
cd pipeline
npm install
# Rhubarb 1.14.0 đã giải nén sẵn ở tools/Rhubarb-Lip-Sync-1.14.0-Windows/
# ElevenLabs key: ../.env  →  ELEVENLABS_API_KEY=sk_...  (key cần quyền TTS, Voices, Models, User)
```

## Quy trình cho một bản (ví dụ A1)

```bash
EP=../video-mau/chu-de-an-uong/th01-goi-pho-quan-co-ba/A1
# 1. Giọng đọc + mốc thời gian (có cache: câu không đổi thì không đọc lại, không tốn ký tự)
node scripts/tts-episode.mjs $EP/episode.json episodes/an-uong-th01-A1/audio
# 2. Khẩu hình (Rhubarb: tiếng Anh = pocketSphinx + lời thoại, tiếng Việt = phonetic)
node scripts/lipsync.mjs episodes/an-uong-th01-A1/audio
# 3. Chuẩn hóa độ to từng câu (bản gốc ở audio/raw/)
python scripts/loudnorm-lines.py episodes/an-uong-th01-A1/audio
# 4. Xem trước một khung hình
npm run studio                                   # mở Remotion Studio
npx remotion still src/index.ts A1-Full out/f.png --frame=300
```

## Dựng cả tập (tất cả các cảnh)

```bash
node scripts/build-narration.mjs $EP                     # lời dẫn Tín cho cảnh Learn + Quiz → $EP/narration.json
node scripts/tts-episode.mjs $EP/narration.json episodes/an-uong-th01-A1/audio
python scripts/loudnorm-lines.py episodes/an-uong-th01-A1/audio   # mọi câu về −16 LUFS (bản gốc ở audio/raw/)
node scripts/lipsync.mjs episodes/an-uong-th01-A1/audio
node scripts/build-timeline.mjs $EP all a1-full          # S01 cold open … S06 outro
npx remotion render src/index.ts A1-Full out/a1-full.mp4
```

Làm theo từng đoạn ~1 phút (khai báo `segments` trong `episode.json`):

```bash
node scripts/stage-lint.mjs $EP                 # QC lớp 1: dàn dựng, đạo cụ, liên tục → out/qc/<ep>-stage-lint.md
node scripts/segment.mjs status|board|render|approve $EP [P1]
```

Dàn dựng: `assets/locations/<loc>/v1/staging.json` (ảnh nền chứa gì, vùng cấm đứng, ghế), mục `staging` trong `rig.json` của từng dáng,
`src/slots.json` (vị trí slot). Shot puppet trong `episode.json` có thể ghi `plate` (biến thể ảnh nền), `enter`/`exit` (nhân vật vào/ra ở câu nào),
`props` (`on` bàn hoặc `holder` + `from`/`until`), câu thoại có thể ghi `react` (cử chỉ của người nghe trong câu đó); shot `ai_video` ghi `shows` (thứ cảnh chèn cho thấy, để kiểm tra liên tục).

Master âm thanh (tự chạy trong `segment.mjs render`; chạy tay cho bản đầy đủ): `python scripts/master-audio.py out/a1-full.mp4`.

Kiểm tra tái hiện lỗi cũ (chạy đầu mỗi tập và sau mỗi lần sửa pipeline): `npm run check` → `tests/regressions.mjs`.

Sau khi xuất, chạy QC rồi mới gửi duyệt (chi tiết và checklist ở [docs/13-quy-trinh-qc.md](../docs/13-quy-trinh-qc.md)):

```bash
python scripts/qc-video.py out/a1-full.mp4 src/data/a1-full.json out/qc/a1-full   # report.md + sheet-NN.png
```

Loại cảnh (`episode.json` → `scenes[].type`): `cold_open` (puppet + snap zoom + sfx), `title` (TitleCard),
`dialogue` (shot puppet/ai_video), `learn` (PhraseCard + lỗi hay gặp), `quiz` (đếm ngược, đáp án), `outro` (thẻ link, teaser, end screen 15 s).

Âm thanh: tiếng động `assets/audio/sfx/*.mp3` (`node scripts/el-sfx.mjs`, brief trong `sfx.json`, ~10 ký tự/giây),
nhạc `assets/audio/music/*.mp3` (`node scripts/el-music.mjs <tên> <giây> "<prompt>"`).
Hướng nhìn: nhân vật tự quay về phía người đang nói, hoặc khi chính mình nói thì quay về người mình đang trả lời.
Cần chỉ định khác thì thêm `"to": "<id>"` vào câu thoại trong `episode.json`.
Dáng phụ (ngồi, cầm báo, vẫy tay…) nằm ở `assets/characters/<c>/v1/poses/<pose>/`; slot `*-seated` hoặc `gesture` của câu thoại tự chọn dáng.

## Video đi kèm (mỗi bản)

```bash
A=episodes/an-uong-th01-A1/audio
# Phản xạ 7 giây — dữ liệu: $EP/reflex.json (25 câu, thứ tự Phần 2)
node scripts/tts-episode.mjs $EP/reflex.json $A          # câu đề tiếng Việt: eleven_v4, speed 0,85 (ghi trong từng câu)
python scripts/cut-clips.py $EP/reflex.json $A           # đáp án tiếng Anh cắt từ câu phim (giọng nhân vật gốc) → C##.mp3
python scripts/loudnorm-lines.py $A
node scripts/asr-check.mjs --reflex $EP/reflex.json $A   # máy nghe lại, so với chữ
node scripts/segment.mjs status|board|render|approve $EP/reflex.json [X1]

# Phân tích & giải thích — nguồn soạn: $EP/analysis.src.py → analysis.json + analysis-review.md (bản duyệt lời dẫn)
python $EP/analysis.src.py
node scripts/tts-episode.mjs $EP/analysis.json $A && python scripts/loudnorm-lines.py $A && node scripts/lipsync.mjs $A
node scripts/asr-check.mjs --lines $EP/analysis.json $A
node scripts/segment.mjs status|board|render|approve $EP/analysis.json [Y1]
```

Bước "Nghe câu" của video Phân tích phát lại đúng đoạn phim đã khóa (`pipeline.film`), nên xuất bản phim đầy đủ trước.
Lời dẫn: mỗi câu một đoạn, giọng Việt đọc liền cả từ tiếng Anh; câu sai cố ý chỉ hiện trên màn hình (TTS tự sửa lỗi).

## Chuẩn bị nhân vật (một lần cho mỗi nhân vật)

```bash
python scripts/cutout.py <char>/v1/hero.png <char>/v1/hero-cut.png      # tách nền
# đo mắt/miệng: python scripts/face-grid.py out.png <char>/v1/hero-cut.png  → ghi vào <char>/v1/rig.json
python scripts/erase-mouth.py assets/characters/<char>/v1 debug.png      # xóa miệng gốc → hero-nomouth.png
```

Miệng (A–H, X) và chớp mắt được vẽ bằng SVG trong `src/components/Mouth.tsx`, `Character.tsx`.

## Giọng nhân vật

`node scripts/el-design.mjs <key>` tạo 3 bản nghe thử (brief trong `voices/design.json`), nghe ở `voices/listen.html`,
rồi `node scripts/el-save-voices.mjs tin-en=2 ...` lưu giọng và ghi `assets/characters/<c>/v1/voice.json` (+ file mẫu).

## Tệp chính

| Tệp | Vai trò |
| --- | --- |
| `src/Episode.tsx` | Bố cục shot: ảnh nền, vị trí nhân vật (`SLOT_X`), cảnh chèn AI, che biển số (`PLATE_FIX`) |
| `src/components/Subtitle.tsx` | Phụ đề kép EN/VI, tô vàng mẫu câu |
| `src/brand.ts` | Màu thương hiệu, màu tên nhân vật |
| `src/data/*.json` | Timeline do `build-timeline.mjs` sinh ra (không sửa tay) |
