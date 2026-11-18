# Prompt tạo nhân vật và character sheet

Công cụ: **Nano Banana 2.1** (Gemini API / Google AI Studio) cho sản xuất; Midjourney (thủ công) cho giai đoạn khám phá nếu muốn. Luôn dán **STYLE LOCK** ở đầu — giống hệt bản trong [docs/03-nhan-vat.md](../docs/03-nhan-vat.md).

```text
STYLE LOCK — YOLO7 English:
flat 2D storybook cartoon set in modern Saigon, Vietnam; clean vector-like shapes, consistent 3px
dark-brown outline (#3D2C29), soft cel shading with one shadow tone, warm sunny palette
(wall yellow #F2C14E, iron-door green #2E7D5B, plastic-stool red #D7263D, house-number blue #2B6CB0,
cream #FFF4E0), rounded friendly proportions (head ≈ 1/4.5 of body height), large expressive eyes with
small white highlight, simple nose, warm golden-hour light, cozy and clean (not run-down),
no photorealism, no 3D render, no gradients on characters, no text, no watermark.
```

## Bước 1 — Khám phá (hero image)

```text
{STYLE LOCK}
Full-body character design of TÍN, a 21-year-old Vietnamese university student, friendly and hard-working.
He is clearly a YOUNG ADULT, not a child or teenager: adult height and adult body proportions,
slim build, defined neck and shoulders, slightly longer face shape with a gentle jawline.
Cute, friendly, softly rounded face (but adult); short neat black hair with soft bangs;
warm brown eyes; light tan skin. A wide, open, happy smile showing a little of the upper teeth,
with small curved dimple lines at the corners of the smile (drawn as short curved strokes,
not dots or moles). Nothing tucked behind his ears, no accessories.
Outfit: plain white crew-neck t-shirt with no print, no logo, no graphics; light-blue straight-leg
jeans; plain WHITE canvas sneakers (white only).
Standing in a relaxed, friendly pose, arms down, facing 3/4 to the right.
Plain flat off-white background (#FAF6EF), no colored background, centered, full body visible with margin.
```

Các nhân vật khác — thay khối mô tả:

- **TONY (Tuấn):** `24-year-old Vietnamese man, cheerful and over-confident. Spiky gelled black hair standing up, tan skin, big toothy grin. Outfit: green windbreaker jacket open over a grey t-shirt, khaki shorts, simple flip-flops; holding an orange open-face motorbike helmet under one arm.`
- **JAKE:** `29-year-old American man, friendly and curious. Tall and slim, light-brown slightly wavy hair, short neat beard, blue eyes, fair skin with a light tan. Outfit: short-sleeve shirt with a tropical flower pattern in teal and coral, beige shorts, flip-flops, a small crossbody bag.`
- **CÔ BA:** `52-year-old Vietnamese woman, warm and talkative. Short curly permed black hair with a plastic hair clip, round face, kind eyes. Outfit: matching purple floral Vietnamese home outfit (short-sleeve top and long pants), red-and-white checkered apron, a large wristwatch, holding a woven bamboo hand fan.`
- **SAM (base):** `35-year-old man, polite and calm. Short neat black hair, small thin mustache, East Asian features, gentle professional smile, slim build.` + biến thể đồng phục: `waiter: white shirt, black vest, small red bow tie, black trousers, notepad in hand` · `airport agent: navy blazer with a small wing pin, light-blue shirt, navy tie, ID lanyard` · `shop assistant: green apron over a white polo shirt` · `hotel receptionist: burgundy blazer, white shirt, name badge`.
- **MƯỚP:** `a chubby 4-year-old Vietnamese tabby cat with grey-brown stripes, round belly, half-closed lazy eyes, a red collar with a small golden bell.`

Tạo 20–30 ảnh, chọn 1 hero image cho mỗi nhân vật. Ghi prompt + ngày + model vào `meta.json`.

## Bước 2 — Turnaround (đính kèm hero image)

```text
{STYLE LOCK}
Character turnaround sheet of the character in the attached reference image.
Keep the face, hair, outfit, colors and proportions EXACTLY the same as the reference.
Five full-body views in one row, evenly spaced, same scale, same height baseline:
front view, 3/4 left view, side profile left, 3/4 right view, back view.
Neutral standing pose, arms slightly away from the body. Plain white background. No text, no labels.
16:9, 2K.
```

## Bước 3 — Expression sheet

```text
{STYLE LOCK}
Expression sheet of the character in the attached reference. Same face, hair, colors.
Eight head-and-shoulders portraits in a 4×2 grid, all in 3/4 view facing right, same size:
neutral, happy, laughing, surprised, confused, embarrassed, annoyed, sad.
Plain white background, no text, no labels. 16:9, 2K.
```

> **Bài học (17/11/2026):** nhân vật có đạo cụ đội đầu (mũ bảo hiểm của Tony) thì AI hay đội luôn lên đầu trong bảng biểu cảm, che mất chi tiết nhận diện. Thêm câu: *"He is NOT wearing the helmet: bare head with his hair clearly visible in every portrait (no helmet, no hat)."* Áp dụng tương tự cho mọi đạo cụ dễ bị "đeo nhầm".
>
> **Bài học (17/11/2026):** với con vật (Mướp), prompt turnaround mặc định ("neutral standing pose, arms slightly away from the body") khiến AI vẽ mèo **đứng hai chân như người**. Thêm câu: *"IMPORTANT: draw her as a REAL CAT on ALL FOUR LEGS (quadruped, horizontal body), NOT standing upright on two legs, not anthropomorphic."*

## Bước 4 — Mouth chart (sau đó chỉnh tay)

```text
{STYLE LOCK}
Mouth shape chart for 2D lip-sync animation of the character in the attached reference.
Nine isolated mouths drawn at the same size and position, 3/4 view, in a 3×3 grid, white background:
A: closed lips (M, B, P) · B: slightly open, teeth together (K, S, T, EE) · C: open (EH, AE) ·
D: wide open (AA) · E: rounded open (AO, ER) · F: puckered small (UW, OO, W) ·
G: upper teeth on lower lip (F, V) · H: tongue behind upper teeth (L) · X: relaxed rest.
Same outline weight and lip color as the reference. No text, no labels.
```

Chuẩn khẩu hình theo [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync) (A–H, X). AI thường vẽ lệch kích thước/vị trí → căn lại bằng tay trong Krita/Photoshop/Affinity, xuất 9 PNG nền trong suốt cùng canvas.

## Bước 5 — Tư thế tay / đạo cụ

```text
{STYLE LOCK}
The character from the attached reference, same outfit and proportions, 3/4 view facing right,
upper body. Pose: [holding a notepad and pen | holding a glass of iced coffee | pointing forward
with right index finger | waving hello | thumbs up | shrugging with both palms up |
scratching the back of the head (Tony) | fanning with a bamboo hand fan (Cô Ba) |
patting pockets in panic]. Plain white background, no text.
```

### Dáng ngồi ghế nhựa (bắt buộc cho nhân vật ngồi quán)

Nhân vật chỉ có ảnh đứng thì không thể "ngồi" bằng cách cắt nửa người (sẽ trông như bay trên bàn). Tạo riêng dáng ngồi, đính kèm hero + ảnh nền có ghế để ghế giống hệt:

```text
{STYLE LOCK}
Full-body pose of <NAME> (from the reference) SITTING on a low red plastic stool, Vietnamese street-food style:
knees bent up, feet flat on the floor, back straight, both hands resting on his/her knees, relaxed friendly smile,
mouth closed. Body turned 3/4 to the right, looking to the right. The whole stool and the feet are visible.
Plain flat off-white background (#FAF6EF), no table, no other objects, no ground shadow, full figure with margin.
```

Lưu vào `assets/characters/<name>/v1/poses/seated/` (+ `rig.json` riêng). Trong `episode.json`, vị trí `*-seated` tự dùng dáng này; pipeline đặt ghế của ảnh đè đúng lên ghế trong ảnh nền.

### Dáng xoay người / nghiêng (khi nói với người ở phía sau)

Bài học từ A1 (2026-11-18): AI hay chỉ xoay **đầu**, còn thân giữ nguyên 3/4 như ảnh tham chiếu, trông như vặn cổ.

- Luôn đính kèm **2 tham chiếu**: hero của nhân vật (mặt, trang phục) và `sheet.png` (bảng xoay), ghi rõ "copy EXACTLY its THIRD figure (the full SIDE PROFILE view)".
- Prompt phải tả **cả thân**: "rotate his WHOLE BODY to a TRUE SIDE PROFILE… shoulders and chest seen from the side, only one arm visible, both feet pointing the same way as the face". Đừng chỉ viết "head turned".
- Miệng khép (`mouth CLOSED`) để gắn khẩu hình; với dáng nghiêng, khẩu hình được thu hẹp bằng `mouth.sx` ≈ 0,6 trong `rig.json`.
- Mỗi dáng ghi `staging` trong `rig.json`: `posture` (stand/seated), `facing` (3q/profile), `look` (level/down/up), `gestures`, `holds`. Bộ kiểm tra dàn dựng dùng các trường này để chọn dáng.
- Dáng có cử chỉ/đạo cụ: **sửa từ ảnh dáng gốc** của đúng tư thế (vd. dáng ngồi `f24a2998`, dáng nghiêng `eb66ea0f`) để giữ mặt, ghế, góc xoay; chỉ mô tả phần thay đổi (tay, đồ cầm). Ghi `anchor_x` (đường giữa thân) trong `rig.json` để đổi dáng không làm nhân vật trượt ngang.
- Gửi qua ChatGPT: xóa sạch ô nhập trước khi dán prompt; sau khi xong, đối chiếu `params.prompt` của job Higgsfield với yêu cầu (ChatGPT có thể dùng nhầm prompt cũ).
- Duyệt bằng checklist ảnh AI trong [docs/13](../docs/13-quy-trinh-qc.md#checklist-ảnh-ai-bước-3-trước-khi-chọn-hoặc-tạo-video): đầu và thân cùng hướng, đúng nhân vật, không thừa tay chân.

## Checklist duyệt nhân vật

- [ ] Màu trang phục khớp mã hex trong character bible (dùng color picker)
- [ ] Chi tiết nhận diện — nụ cười rộng + lúm đồng tiền hai má, áo thun trắng trơn (Tín), mũ bảo hiểm cam (Tony), áo hoa (Jake), đồ bộ hoa tím + quạt (Cô Ba), chuông vàng (Mướp) — có mặt ở mọi góc nhìn
- [ ] Tỉ lệ đầu/thân giống nhau giữa các nhân vật
- [ ] Nhìn rõ ở kích thước thumbnail (thu nhỏ còn 160 px vẫn nhận ra)
- [ ] Người Việt xem thấy gần gũi, không rập khuôn, không phản cảm
- [ ] Không giống nhân vật của kênh khác (so sánh với ảnh trong [assets/research/](../assets/research/))
