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
# 3. Timeline cho các cảnh cần dựng + chép tài nguyên vào public/
node scripts/build-timeline.mjs $EP S03 a1-s03
# 4. Xem trước / xuất
npm run studio                                   # mở Remotion Studio
npx remotion still src/index.ts A1-S03 out/f.png --frame=300
npx remotion render src/index.ts A1-S03 out/a1-s03.mp4
```

## Dựng cả tập (tất cả các cảnh)

```bash
node scripts/build-narration.mjs $EP                     # lời dẫn Tín cho cảnh Learn + Quiz → $EP/narration.json
node scripts/tts-episode.mjs $EP/narration.json episodes/an-uong-th01-A1/audio
node scripts/lipsync.mjs episodes/an-uong-th01-A1/audio
node scripts/build-timeline.mjs $EP all a1-full          # S01 cold open … S06 outro
npx remotion render src/index.ts A1-Full out/a1-full.mp4
```

Loại cảnh (`episode.json` → `scenes[].type`): `cold_open` (puppet + snap zoom + sfx), `title` (TitleCard),
`dialogue` (shot puppet/ai_video), `learn` (PhraseCard + lỗi hay gặp), `quiz` (đếm ngược, đáp án), `outro` (thẻ link, teaser, end screen 15 s).

Âm thanh: tiếng động `assets/audio/sfx/*.mp3` (`node scripts/el-sfx.mjs`, brief trong `sfx.json`, ~10 ký tự/giây),
nhạc `assets/audio/music/*.mp3` (`node scripts/el-music.mjs <tên> <giây> "<prompt>"`).
Hướng nhìn: nhân vật tự quay về phía người đang nói, hoặc khi chính mình nói thì quay về người mình đang trả lời.
Cần chỉ định khác thì thêm `"to": "<id>"` vào câu thoại trong `episode.json`.
Dáng phụ (ngồi, cầm báo, vẫy tay…) nằm ở `assets/characters/<c>/v1/poses/<pose>/`; slot `*-seated` hoặc `gesture` của câu thoại tự chọn dáng.

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
