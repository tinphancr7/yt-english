# 5. Quy trình sản xuất video bán tự động bằng AI

## Mô hình sản xuất được chọn: "Puppet + AI lai"

| Thành phần video | Tỉ lệ thời lượng | Cách làm | Vì sao |
| --- | --- | --- | --- |
| Hội thoại (nhân vật nói) | ~70% | Puppet 2D + lip-sync tự động (Rhubarb) dựng bằng code (Remotion) trên nền AI | Nhất quán tuyệt đối, chi phí ~0/giây, lip-sync chính xác theo âm thanh |
| Phần giải thích / luyện tập / quiz | ~20% | Template motion graphics (Remotion) — chữ, highlight, nhân vật nhỏ ở góc | Tái sử dụng 100%, render tự động |
| Cảnh chèn điện ảnh | 5–10% | AI video (Kling 3.0 / Gemini Omni Flash) từ ảnh keyframe | Tạo cảm giác "phim", hook, establishing shot |

So sánh với hai lựa chọn khác:

| Tiêu chí | Puppet + AI lai (chọn) | 100% AI video (Kling/Veo-style) | Animation 2D/3D truyền thống |
| --- | --- | --- | --- |
| Nhất quán nhân vật | Tuyệt đối | Trung bình — trôi chi tiết, phải re-roll | Tuyệt đối |
| Lip-sync | Chính xác (từ audio) | Khá với model có audio; kém khi 2–3 người nói xen kẽ | Chính xác |
| Chi phí video 5 phút | ~$5–10 | ~$60–100+ | $500–3.000 (thuê animator) |
| Thời gian công/video 5 phút | 2–4 giờ (sau khi có template) | 4–8 giờ (re-roll, ghép) | 20–60 giờ |
| Khả năng tự động hóa | Rất cao | Trung bình | Thấp |
| Chi phí đầu tư ban đầu | Cao (rig nhân vật + template code: 40–80 giờ) | Thấp | Rất cao |

## Bước 1 — Nghiên cứu chủ đề

**Mục tiêu:** mỗi tuần chốt 3–5 chủ đề có điểm ≥ 3,5 (thang điểm trong [04-chu-de-va-50-y-tuong.md](04-chu-de-va-50-y-tuong.md)).

1. **Nguồn ý tưởng (thị trường Việt):**
   - YouTube autocomplete tiếng Việt: gõ "tiếng anh giao tiếp khi…", "gọi món bằng tiếng anh", "tiếng anh cho người mất gốc…", "hỏi đường bằng tiếng anh" → ghi gợi ý.
   - Tab "Phổ biến" của các kênh Việt cùng ngách (luyện nghe chậm, podcast, hội thoại theo chủ đề) và kênh quốc tế người Việt hay xem (Jessica, Easy English).
   - Bình luận người Việt dưới video đối thủ: "làm thêm chủ đề…", "em hay bị sai câu…".
   - Nhóm Facebook học tiếng Anh, TikTok/Reels tiếng Anh giao tiếp, câu hỏi trên các diễn đàn; danh sách chức năng giao tiếp theo CEFR (Cambridge English Profile).
   - **Lỗi người Việt hay mắc** (Vietglish, phát âm) — gom thành ngân hàng lỗi để rải vào các tập.
2. **Công cụ:** vidIQ hoặc TubeBuddy (bản free đủ cho giai đoạn đầu), Google Trends (Việt Nam, "YouTube Search"), YouTube Data API (`search.list` với `regionCode=VN`, `relevanceLanguage=vi`; `videos.list` để lấy view) — script tự động ở [08-tu-dong-hoa.md](08-tu-dong-hoa.md).
3. **Đầu ra:** 1 dòng trong `situations.csv` cho mỗi **tình huống** (không phải từng video): `situation_id, topic, name, keyword_vi, search_score, competitor_median_views, A1_core, growth_A2_B1_B2, location_ids, score`.

## Bước 2 — Viết kịch bản

1. **Lên khung cả tình huống trước, viết từng bản sau.** Brief tình huống (bạn viết ~10 dòng): bối cảnh, các **bước của cảnh** và bản nào thêm bước nào, mạch hài, câu nào mới ở bản nào, câu nào được ôn và nâng cấp — ví dụ bảng "Cảnh được mở rộng thế nào" ở [tình huống mẫu](../video-mau/chu-de-an-uong/th01-goi-pho-quan-co-ba/README.md#cảnh-được-mở-rộng-thế-nào-qua-4-bản).
2. **LLM viết từng bản (A1 → B2)** (Claude / ChatGPT) với system prompt cố định chứa character bible, quy tắc CEFR và quy tắc mở rộng tình huống — mẫu ở [prompts/script-system-prompt.md](../prompts/script-system-prompt.md). Khi viết bản sau, **gửi kèm kịch bản bản trước** để LLM giữ đúng các bước cũ và ôn lại đúng câu cũ. Yêu cầu xuất **JSON theo schema scene** (xem [episode.json mẫu](../video-mau/chu-de-an-uong/th01-goi-pho-quan-co-ba/A1/episode.json)).
3. **Cấu trúc bắt buộc của video phim:** cold open → (ôn lại bản trước) → mở bài → xem phim → học mẫu câu + sửa lỗi Vietglish (mẹo phát âm ghi trong thẻ khi cần) → đố vui → link 2 video luyện tập + hẹn bản sau.
4. **Kiểm tra ngôn ngữ tự động** (LLM thứ hai đóng vai "editor"):
   - Mỗi câu thoại tiếng Anh đánh nhãn CEFR; câu nào vượt cấp → viết lại.
   - Độ dài câu: A1 ≤ 8 từ, A2 ≤ 12 từ, B1 ≤ 18 từ, B2 ≤ 25 từ.
   - Tự nhiên: "What can I get you to drink?" thay vì "What drink do you want to order?".
   - Phần giải thích tiếng Việt: đúng, ngắn, không dùng thuật ngữ ngữ pháp khó với người mất gốc.
   - Kiểm tra ≥ 50% mẫu câu level trước được ôn lại; lỗi văn hóa, nhạy cảm vùng miền, tên thương hiệu thật.
5. **Bạn duyệt cuối** (10–15 phút): đọc to kịch bản. **Đây là cổng kiểm duyệt bắt buộc** — lỗi ngôn ngữ trên kênh dạy tiếng Anh phá hủy uy tín.

## Bước 3 — Nhân vật và bối cảnh

1. Nhân vật: dùng puppet có sẵn (xem [03-nhan-vat.md](03-nhan-vat.md)). Chỉ tạo mới: tư thế/đạo cụ đặc biệt (cầm menu, cầm vali).
2. Bối cảnh: mỗi **location** có bộ 4 góc chuẩn, tạo bằng Nano Banana 2.1 với STYLE LOCK, độ phân giải 2K (16:9):
   - `wide` (toàn cảnh), `two-shot` (nền phía sau 2 người nói), `counter`/`table` (cận), `detail` (đồ vật: menu, hóa đơn).
3. **Thư viện asset** (lưu trên ổ + đồng bộ Google Drive/R2):

```text
assets/
  characters/<name>/v1/{sheet.png, parts/*.png, rig.json, voice.json}
  locations/<location-id>/v1/{wide.png, two-shot.png, counter.png, detail-*.png, meta.json}
  props/<prop-id>.png
  music/, sfx/, brand/{logo.svg, jingle.wav, fonts/}
```

`meta.json` ghi: prompt, model, seed (nếu có), ngày tạo, tập đã dùng. Trước khi tạo bối cảnh mới, **luôn tìm trong thư viện trước**.

## Bước 4 — Giọng nói AI

| Quyết định | Khuyến nghị |
| --- | --- |
| Giọng tiếng Anh (hội thoại) | **ElevenLabs** (v3/v4: cảm xúc tốt nhất, audio tags như `[laughs]`, `[surprised]`; v3 hỗ trợ hội thoại nhiều người) |
| Giọng tiếng Việt (Tín dẫn bài, Cô Ba) | Chọn bằng **bài nghe mù** giữa ElevenLabs v3, Gemini 3.8 Flash TTS và nhà cung cấp Việt (FPT.AI…). Ưu tiên giọng **miền Nam** tự nhiên (bối cảnh Sài Gòn) |
| Dự phòng giá rẻ | **Gemini 3.8 Flash TTS** (~$0,0135/phút đến hết 2026, ~$0,027/phút từ 2027) hoặc Azure Neural TTS (~$15/1M ký tự) |
| Giọng | Mỗi nhân vật 1 giọng cố định cho mỗi ngôn ngữ, lưu `voice_id` trong `voice.json` |
| Accent tiếng Anh | **General American** cho Tín, Jake, Sam (mẫu chuẩn để người học bắt chước); Tony có thể có accent Việt nhẹ — người học thấy "người Việt nói tiếng Anh vẫn hiểu được". Bản B2 thêm nhân vật giọng Úc/Anh (Mr. David) để luyện nghe nhiều accent |
| Jake nói tiếng Việt | Dùng **chính giọng tiếng Anh của Jake** đọc chữ tiếng Việt → accent Mỹ tự nhiên, đúng chất hài |
| Tốc độ | A1: 0,8–0,85× · A2: 0,9× · B1, B2: 1,0× (B2 cho phép chen ngang, nói nhanh tự nhiên). Video Phản xạ 7 giây tái dùng audio của phim khi câu trùng |
| Cảm xúc | Trường `emotion` trong kịch bản → map sang audio tag (`[cheerful]`, `[confused]`, `[whispers]`) và tham số `style` |

**Quy trình kỹ thuật:**

1. Sinh từng câu thoại thành 1 file riêng (`L08_jake_en.mp3`) — dễ sửa 1 câu mà không sinh lại cả cảnh. Trường `lang` của từng dòng quyết định giọng nào được dùng.
2. Dùng endpoint **with-timestamps** của ElevenLabs để nhận mốc thời gian từng ký tự → dùng cho phụ đề và highlight từ.
3. Chuẩn hóa âm lượng (-16 LUFS cho YouTube), cắt khoảng lặng đầu/cuối, chèn khoảng nghỉ 250–400 ms giữa hai lượt thoại.
4. Nghe lại toàn bộ 1 lần ở tốc độ 1,5× — kiểm tra phát âm sai (tên riêng, số, từ đồng tự). Sai → sửa bằng phiên âm (pronunciation dictionary) hoặc viết lại chính tả.

## Bước 5 — Animation / video

1. **Lip-sync:** chạy [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync) (mã nguồn mở) trên từng file thoại + text kịch bản (`--dialogFile`) → JSON khẩu hình theo thời gian. Câu tiếng Việt: dùng recognizer `phonetic` (không phụ thuộc ngôn ngữ).
2. **Dựng cảnh hội thoại** (Remotion component `<DialogueScene>`):
   - Nền = ảnh location; nhân vật = puppet đặt theo `positions` (trái/phải).
   - Người đang nói: lip-sync + cử chỉ theo `gesture`; người nghe: chớp mắt, gật nhẹ.
   - Camera: zoom nhẹ (Ken Burns 2–4%) hoặc cắt giữa two-shot và close-up theo lượt thoại.
3. **Hội thoại 3 người:** dùng wide shot + cắt cận người nói; không bao giờ để 3 người nói trong một video AI tạo sinh (lip-sync sẽ lẫn người).
4. **Cảnh chèn AI** (3–6 cảnh/video, 4–6 giây mỗi cảnh):
   - Tạo keyframe bằng Nano Banana (có reference nhân vật + location).
   - Đưa keyframe vào Kling 3.0 (image-to-video) hoặc Gemini Omni Flash với prompt chuyển động ngắn, cụ thể (mẫu trong video mẫu).
   - Tạo 2 biến thể, chọn 1. Không dùng cảnh chèn AI cho khoảnh khắc nhân vật nói thoại chính.
5. **Lip-sync bằng AI (tùy chọn)** khi cảnh chèn có nhân vật nói: Kling Lip Sync (~$0,014/giây) hoặc Kling Avatar (~$0,056/giây 720p). Với nhân vật cartoon, kết quả cần kiểm tra kỹ.

## Bước 6 — Dựng video hoàn chỉnh

Với pipeline code (Remotion), "dựng" = render từ `episode.json`:

1. **Ghép scene** theo thứ tự trong JSON; chuyển cảnh: cut cho cùng location, swipe/iris (biểu tượng ngôi nhà) khi đổi location, dissolve 0,3 s cho cảnh chèn.
2. **Âm thanh:** 3 track — thoại (0 dB chuẩn), nhạc nền (-24 đến -28 dB khi có thoại, auto-ducking), SFX (-12 dB). Nhạc từ YouTube Audio Library (miễn phí) hoặc ElevenLabs Music / thư viện có license thương mại.
3. **Phụ đề burn-in:** từ timestamps TTS; mỗi dòng ≤ 42 ký tự; tên người nói màu riêng; cụm từ mục tiêu tô vàng. **Bản A1–A2: song ngữ** (dòng Anh trên, dòng Việt dưới); **Bản B1–B2: chỉ tiếng Anh**, tiếng Việt chuyển sang CC. Xem [phụ đề mẫu](../video-mau/chu-de-an-uong/th01-goi-pho-quan-co-ba/A1/subtitles.srt).
4. **Phần học mẫu câu:** thẻ mẫu câu — câu lớn, giải thích tiếng Việt, 1 ví dụ thay thế; nhân vật nói lại câu ở góc màn hình. Thẻ **sửa lỗi Vietglish**: câu sai gạch đỏ → câu đúng.
6. **Intro/outro:** jingle 3 giây + logo; outro 15–20 giây có end screen (2 video gợi ý + nút subscribe) — YouTube yêu cầu end screen trong 5–20 giây cuối.
7. **CapCut / DaVinci Resolve** chỉ dùng cho tinh chỉnh thủ công khi cần (hoặc giai đoạn đầu trước khi có template code).

**Kiểm soát chất lượng** trước khi đưa người duyệt (đo video, bảng ảnh từng câu, checklist "hợp lý ngoài đời", sổ lỗi): xem [13-quy-trinh-qc.md](13-quy-trinh-qc.md).

## Bước 7 — Xuất bản và tối ưu YouTube

1. **Thumbnail:** Nano Banana Pro hoặc 2.1 tạo nền + nhân vật (từ reference), **chữ thêm bằng code/Canva** (không để AI vẽ chữ để tránh lỗi chính tả). 3 biến thể → dùng tính năng **Test & Compare** của YouTube Studio để A/B test.
2. **Tiêu đề (tiếng Việt):** `[Tình huống] bằng tiếng Anh | [CEFR] | YOLO7 English`, ≤ 70 ký tự. Ví dụ: *"Gọi phở bằng tiếng Anh ở quán Việt | A1 – Người mới bắt đầu | YOLO7 English"*.
3. **Mô tả:** 2 câu đầu chứa từ khóa tiếng Việt → danh sách mẫu câu → lỗi hay gặp → **link 4 bản A1–B2 của tình huống + video phân tích + video phản xạ + video tổng hợp** → chapters → playlist. 3–5 hashtag không dấu (#tienganhgiaotiep).
4. **Cards và End screen gắn trong YouTube Studio**, không vẽ vào video: lấy mốc thời gian và video đích từ `episode.json` → `publish.youtube_studio`.
5. **Phụ đề CC:** `vi.srt` + `en.srt` (chuẩn, không dùng ASR).
6. **Playlist:** theo **tình huống** ("Gọi phở ở quán Cô Ba: A1 → B2", video tổng hợp ghim đầu), theo **chủ đề và trình độ** ("Ăn uống – A1"), theo **lộ trình** ("Lộ trình A1") và theo **loại video** (phản xạ, viết).
7. **Shorts từ video dài** (3–5 Shorts/video): 1 khoảnh khắc hài (cold open — Jake nói tiếng Việt sai, Tony nói Vietglish), 1 "3 câu gọi món ai cũng cần", 1 "câu này sai ở đâu?". Định dạng 9:16 — Remotion render composition dọc từ cùng dữ liệu. Đăng lại lên TikTok/Facebook Reels (thị trường Việt dùng rất nhiều).
8. **Theo dõi (YouTube Studio / YouTube Analytics API):**

| Chỉ số | Mục tiêu 3 tháng đầu | Nếu thấp |
| --- | --- | --- |
| CTR thumbnail | ≥ 5% | Đổi thumbnail/tiêu đề trong 48 giờ đầu |
| Giữ chân 30 giây đầu | ≥ 70% | Cold open mạnh hơn, bỏ intro dài |
| Average view duration | ≥ 40% thời lượng | Rút ngắn phần Learn, thêm câu chuyện |
| Returning viewers | ≥ 20% | Tăng tính series, cliffhanger cuối tập |
| Tỉ lệ chuyển từ bản A1 sang A2 (end screen click / view A2 từ A1) | ≥ 5% | Teaser cuối A1 hấp dẫn hơn; đăng A2 sớm hơn |
| Subscriber/1.000 view | ≥ 5 | CTA tự nhiên hơn (nhân vật nói) |
