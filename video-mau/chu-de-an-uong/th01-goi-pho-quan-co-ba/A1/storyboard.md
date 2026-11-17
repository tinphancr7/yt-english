# Gọi phở ở quán Cô Ba — A1 — Storyboard, prompt hình ảnh và prompt chuyển động

## Quy ước

- **PUPPET** = nhân vật puppet + Rhubarb lip-sync trên ảnh nền (Remotion). Ảnh nền **không có nhân vật**.
- **AI-VIDEO** = cảnh chèn: keyframe (Nano Banana 2.1) → video (Kling 3.0 image-to-video, 720p, 5 giây, tắt audio gốc).
- **TEMPLATE** = thẻ đồ họa Remotion (tiêu đề, mẫu câu, quiz).
- `{STYLE LOCK}` = khối style lock trong [docs/03-nhan-vat.md](../../../../docs/03-nhan-vat.md#ngôn-ngữ-hình-ảnh-chung-style-lock) — dán nguyên văn.
- Ảnh nền 16:9, 2K. Keyframe AI video 16:9, 1080p.
- Bộ ảnh nền **Quán Cô Ba** dùng lại cho cả 4 bản A1–B2 của tình huống này, tình huống "Quán cà phê" và nhiều tập khác.

## Bảng storyboard

| Shot | Thời gian | Loại | Khung hình | Thoại | Asset |
| --- | --- | --- | --- | --- | --- |
| 01 | 0:00–0:08 | PUPPET | Quầy quán: Jake tự tin nói tiếng Việt; Cô Ba ngơ ngác đưa tờ báo; zoom nhanh vào tờ báo | 1–2 | `quan-counter` |
| 02 | 0:08–0:25 | TEMPLATE + PUPPET | Tín chính diện, nửa người, vẫy tay; tiêu đề "Gọi phở ở quán Cô Ba — A1" | 3–4 | `quan-wide` (làm mờ) |
| 03 | 0:25–0:30 | AI-VIDEO | Hẻm 99 buổi sáng: Tín kéo cửa sắt, Mướp ngáp trên ghế đỏ | — | KF-A → V-A |
| 04 | 0:30–1:20 | PUPPET | Bàn inox: Jake ngồi ghế nhựa đỏ (trái), Tín đứng cầm sổ (phải) | 5–14 | `quan-table` |
| 05 | 1:20–1:25 | AI-VIDEO | Cận tô phở bốc khói được đặt xuống, rổ rau, chén tương ớt | — | KF-B → V-B |
| 06 | 1:25–1:45 | PUPPET | Bàn inox: Jake ăn; Tony bước vào từ bên phải, tay cầm mũ bảo hiểm | 15–21 | `quan-table` |
| 07 | 1:45–1:50 | AI-VIDEO | Mướp nhảy lên ghế, nhìn chằm chằm tô phở | — | KF-C → V-C |
| 08 | 1:50–2:10 | PUPPET | Quầy: Jake trả tiền, Tín thối tiền; Cô Ba khoe tiếng Anh | 22–26 | `quan-counter` |
| 09 | 2:10–3:30 | TEMPLATE | 6 thẻ mẫu câu + 1 thẻ sửa lỗi; nhân vật trong khung tròn góc phải | P1–P6, sửa lỗi | `quan-wide` (làm mờ) |
| 10 | 3:30–3:45 | TEMPLATE | Quiz 2 câu, đếm 5 giây | 27 | — |
| 11 | 3:45–4:00 | TEMPLATE + PUPPET | Tín + Mướp; thẻ link video Phản xạ 7 giây; ảnh teaser bản A2 (Tony bưng nhầm tô phở); end screen | 28–29 | `hem-99` |

## Prompt ảnh nền — Nano Banana 2.1

Tạo một lần, lưu vào `assets/locations/quan-co-ba/v1/`. **Quy tắc:** ảnh nền chỗ nhân vật ngồi KHÔNG vẽ ghế — dáng ngồi của nhân vật đã kèm ghế (tránh hai ghế chồng nhau).

**`quan-wide`**
```text
{STYLE LOCK}
Wide view of a small, cozy Vietnamese street-side eatery and coffee shop at the entrance of a narrow
Saigon alley, morning light. Yellow walls, a green folding iron gate pushed open, three stainless-steel
tables with red and blue plastic stools, a glass food cabinet with a big pot of pho broth steaming
behind it, a shelf with phin coffee filters and glasses, potted plants, bougainvillea above the door,
a parked scooter outside. Clean and welcoming. No people, no animals. Empty foreground space for
characters. Eye-level camera, 16:9. No text, no letters, no logos on signs.
```

**`quan-table`**
```text
{STYLE LOCK}
Same eatery as the attached reference (match colors, walls, gate, plants exactly). Medium view of one
stainless-steel table (NO stools — seated characters bring their own stool from the seated pose), a holder with chopsticks and spoons,
a small bottle of fish sauce and a jar of chili on the table. Empty standing space on the right for a
server. Morning light. No people, no animals, no text. 16:9.
Reference: quan-wide.png
```

**`quan-counter`**
```text
{STYLE LOCK}
Same eatery (match reference). View of the front counter with the glass food cabinet, the steaming
pho pot, a small cash box, a calendar-shaped blank board on the wall (no text), a tiny altar shelf
with flowers. Space on both sides for two standing characters. No people, no text. 16:9.
Reference: quan-wide.png
```

**`hem-99`**
```text
{STYLE LOCK}
A narrow, clean Saigon residential alley in the morning: yellow and mint-green house fronts, green
iron gates, a blank blue house-number plate on the first house (no numbers), potted plants, overhead
electric wires, a couple of parked scooters, bougainvillea, a red plastic stool by a door.
Calm and warm. No people, no animals, no text. 16:9.
```

Chữ trên biển số nhà ("99"), tên quán và lịch treo tường được thêm bằng Remotion — không để AI vẽ chữ.

## Keyframe + prompt chuyển động cho cảnh AI-VIDEO

Gửi kèm ảnh reference: `tin/v1/sheet.png`, `jake/v1/sheet.png`, `muop/v1/sheet.png` và ảnh nền tương ứng.

### V-A — Hẻm 99 buổi sáng (shot 03)

**Keyframe:**
```text
{STYLE LOCK}
Use the attached quan-wide plate as the background, seen from outside in the alley. Tín (reference: tin
sheet — young man, round cute face, short neat black hair with soft bangs, wide smile with dimples,
plain white t-shirt, light-blue straight-leg jeans, brown apron) is pulling open the green folding iron gate.
A chubby grey-brown tabby cat with a red bell collar (reference: muop sheet) is lying on a red plastic
stool, mid-yawn. Morning sunlight. Characters must match the references exactly. 16:9, no text.
```

**Animation (Kling 3.0 image-to-video, 5 s, 720p, tắt audio):**
```text
2D flat cartoon animation, keep the exact art style and colors of the input image.
Tín slides the folding iron gate open from left to right. The tabby cat on the red stool yawns
widely and stretches. A light morning breeze moves the bougainvillea. Static camera.
Smooth, simple cartoon motion, no morphing, no camera shake.
```
Negative (nếu có trường riêng): `realistic, 3D render, extra limbs, face distortion, changing outfits, text, flicker`

### V-B — Tô phở (shot 05)

**Keyframe:**
```text
{STYLE LOCK}
Close-up 3/4 top-down view of the stainless-steel table (reference quan-table). A hand with a white
t-shirt sleeve places a big bowl of beef pho: clear broth, rice noodles, thin beef slices, no onions
on top. Next to it: a basket of fresh herbs and bean sprouts, lime wedges, a small dish of chili sauce,
a glass of iced tea. Morning light. 16:9, no text.
```

**Animation:**
```text
2D flat cartoon animation, same style as the input image.
The hand gently sets the bowl down and slides out of frame. Soft cartoon steam rises from the bowl.
Ice cubes in the iced tea glass sparkle once. Static camera, smooth motion, no morphing.
```

### V-C — Mướp thèm phở (shot 07)

**Keyframe:**
```text
{STYLE LOCK}
Same eatery table (reference quan-table). The chubby tabby cat Muop (reference: muop sheet, red bell
collar) has jumped onto a red plastic stool and stares at a bowl of pho on the table with huge
pleading eyes, front paws on the table edge. 16:9, no text.
```

**Animation:**
```text
2D flat cartoon animation, same style as the input image.
The cat's eyes widen, its nose twitches as it sniffs the steam, its tail swishes slowly side to side.
Static camera. Simple, smooth cartoon motion, no morphing.
```

## Prompt thumbnail

**Nền + nhân vật (Nano Banana Pro hoặc 2.1):**
```text
{STYLE LOCK} — thumbnail version: higher contrast, more saturated, bold 4px outline.
Inside the eatery (reference quan-wide). Close framing: Jake (reference: jake sheet — tall American,
light-brown wavy hair, short beard, floral short-sleeve shirt) on the left, holding chopsticks over a
big steaming bowl of pho, grinning; Co Ba (reference: co-ba sheet — short permed hair, purple floral
home outfit, checkered apron) on the right, confused, holding up a folded newspaper. The tabby cat
Muop at the bottom-left looking at the camera. Leave the top-right 40% as simple blurred background
for text. 16:9, 1280x720. No text.
```

**Chữ (thêm bằng code/Canva):**

- Dòng chính (vàng, viền nâu dày): **GỌI MÓN BẰNG TIẾNG ANH**
- Bong bóng thoại của Jake: *"No onions, please!"*
- Tag góc dưới phải: **LEVEL 1 · A1**
