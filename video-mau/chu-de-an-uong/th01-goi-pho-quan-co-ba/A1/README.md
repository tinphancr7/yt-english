# Ăn uống › Tình huống 1: Gọi phở ở quán Cô Ba — **A1** "Một tô phở, không hành!" — Bộ sản xuất

Video mẫu ~4:00 (hội thoại ~1:45), bản A1 của [tình huống "Gọi phở ở quán Cô Ba"](../README.md). Các file:

| File | Nội dung |
| --- | --- |
| [script.md](script.md) | Kịch bản hoàn chỉnh: hội thoại Anh + phụ đề Việt, 6 mẫu câu (kèm mẹo phát âm ngay trong thẻ), sửa lỗi Vietglish, đố vui |
| [storyboard.md](storyboard.md) | 13 shot, prompt ảnh nền Quán Cô Ba, prompt keyframe + chuyển động cho 3 cảnh AI video, prompt thumbnail |
| [episode.json](episode.json) | Dữ liệu máy đọc cho pipeline (có trường `lang` từng câu và phụ đề Việt) |
| [subtitles.srt](subtitles.srt) | Phụ đề song ngữ (dòng 1 tiếng Anh, dòng 2 tiếng Việt) phần cold open → hội thoại, mốc thời gian ước tính |
| [luyen-phan-xa-7s.md](luyen-phan-xa-7s.md) | Video luyện nói dạng bài thi (như kênh Phải Giỏi Tiếng Anh): 25 câu × 2 chiều (Việt → Anh, Anh → Việt), mỗi câu 7 giây; Shorts |
| [phan-tich-giai-thich.md](phan-tich-giai-thich.md) | Video phân tích & giải thích: 6 câu then chốt — ngữ pháp, từ vựng, cách dùng, lỗi hay gặp; bảng tổng kết |

## 1. Ý tưởng và mục tiêu bài học

- **Câu chuyện:** Jake (người Mỹ thuê trọ) cố gọi phở bằng tiếng Việt nhưng nói "một **tờ** phở" — Cô Ba đưa tờ báo. Tín bảo anh gọi bằng tiếng Anh. Tony chen vào gọi "many beef" và được Tín sửa.
- **Mục tiêu:** sau video, người học có thể (1) hiểu câu hỏi *What would you like?*, (2) gọi món bằng *tên món + please*, (3) chọn cỡ, (4) yêu cầu bỏ một thứ (*No onions, please*), (5) hỏi món có cay không, (6) hỏi giá và đưa tiền.
- **Cấp độ:** A1, người mất gốc.

## 2. Nhân vật trong tập

| Nhân vật | Vai trong tập | Ngoại hình (đầy đủ ở [docs/03-nhan-vat.md](../../../../docs/03-nhan-vat.md)) |
| --- | --- | --- |
| Jake | Khách | Người Mỹ cao gầy, tóc nâu vàng xoăn, râu ngắn, áo sơ mi hoa |
| Tín | Phục vụ + dẫn bài (tiếng Việt) | Nam, mặt tròn, tóc ngắn mái rủ, cười rộng có lúm đồng tiền, áo thun trắng trơn, tạp dề nâu |
| Cô Ba | Chủ quán (tiếng Việt) | Tóc uốn ngắn, đồ bộ hoa tím, tạp dề caro, quạt nan |
| Tony | Khách thứ hai, nói Vietglish | Tóc vuốt dựng, áo khoác gió xanh lá, mũ bảo hiểm cam |
| Mướp | Mèo thèm phở | Mèo mướp béo, vòng cổ chuông đỏ |

## 3. Hướng dẫn voice-over

Tập này có **hai loại giọng**: tiếng Anh (hội thoại) và tiếng Việt (Tín dẫn bài, Cô Ba).

| Nhân vật | Ngôn ngữ | Mô tả giọng | Speed |
| --- | --- | --- | --- |
| Tín | Tiếng Anh | "Young Vietnamese man, warm and clear, neutral American accent, friendly" | 0,85 |
| Tín | Tiếng Việt | Nam trẻ, giọng miền Nam ấm, rõ ràng, như anh trai dạy em | 1,0 |
| Jake | Tiếng Anh | "American man, late twenties, relaxed and warm, natural" | 0,85 |
| Jake | Tiếng Việt (sai dấu) | **Dùng chính giọng tiếng Anh của Jake đọc chữ tiếng Việt** → tự nhiên có accent Mỹ, đúng chất hài | — |
| Tony | Tiếng Anh | "Young Vietnamese man, energetic, a bit over-confident, light Vietnamese accent" | 0,9 |
| Cô Ba | Tiếng Việt | Nữ trung niên miền Nam, giọng to, vui, hơi "chợ" | 1,0 |

**Chọn công cụ giọng tiếng Việt bằng bài nghe thử (Tuần 2):** cùng 5 câu của Tín và 3 câu của Cô Ba, chạy trên ElevenLabs v3, Gemini 3.8 Flash TTS và một nhà cung cấp Việt (FPT.AI — [trang giá](https://docs.fpt.ai/docs/en/speech/documentation/tts-pricing) yêu cầu liên hệ). Cho 3–5 người Việt nghe mù, chọn giọng tự nhiên nhất và có giọng miền Nam.

**Quy trình:**

1. Mỗi dòng trong `episode.json` → 1 file (`audio/L08_jake_en.mp3`). Trường `lang` quyết định giọng nào được dùng.
2. Audio tag ở đầu câu theo `audio_tags` (ví dụ `[sighs] Tony... "More beef, please."`).
3. Lấy timestamps (ElevenLabs *with-timestamps*; với nhà cung cấp không có timestamps, dùng forced alignment từ ASR — ElevenLabs Scribe hoặc Gemini Transcribe).
4. Hậu kỳ: cắt lặng, nghỉ 300 ms giữa các lượt, chuẩn hóa −16 LUFS.
5. Nghe lại ở 1,5×: kiểm tra "pho" (đọc /fʌ/, không phải /foʊ/), "dong", "sixty thousand".

## 4. Phụ đề song ngữ

- **Burn-in 2 dòng:** dòng 1 tiếng Anh (đậm, chữ lớn), dòng 2 tiếng Việt (nhỏ hơn, nâu nhạt). Câu chỉ có tiếng Việt (Tín giảng, Cô Ba) → 1 dòng.
- **Highlight:** cụm trong `highlight` tô nền vàng, hiện dần theo từ (karaoke nhẹ).
- **Lỗi Vietglish** (`error_demo: true`): gạch chân đỏ lượn sóng dưới "many beef" khi Tony nói, sau đó hiện "✅ more beef" khi Tín sửa.
- **CC upload:** `vi.srt` (toàn bộ, 1 dòng tiếng Việt) và `en.srt` (chỉ câu tiếng Anh) — để người xem tự bật/tắt khi xem lại.
- Quy tắc: ≤ 42 ký tự/dòng, hiển thị ≥ 1 giây, ngắt theo cụm nghĩa.

## 5. Quy trình ghép thành video hoàn chỉnh

| Bước | Việc | Công cụ | Thời gian (lần đầu) |
| --- | --- | --- | --- |
| 1 | Duyệt kịch bản (đọc to cả phần tiếng Anh và tiếng Việt) | — | 15 phút |
| 2 | Sinh giọng 29 dòng (2 ngôn ngữ) + hậu kỳ | ElevenLabs / TTS tiếng Việt + FFmpeg | 60 phút |
| 3 | Rhubarb lip-sync (tiếng Anh: có dialog file; tiếng Việt: chế độ phonetic) | Rhubarb CLI | 10 phút (tự động) |
| 4 | Tạo 4 ảnh nền (Quán Cô Ba × 3 + Hẻm 99), 4 biến thể/ảnh | Nano Banana 2.1 | 45 phút |
| 5 | Tạo 3 keyframe AI video, duyệt | Nano Banana 2.1 | 30 phút |
| 6 | Tạo 3 clip × 2 biến thể, chọn | Kling 3.0 | 45 phút (chờ render) |
| 7 | Dựng: DialogueScene, PhraseCard, Quiz, Outro | Remotion (hoặc CapCut nếu chưa có template) | 3–5 giờ lần đầu |
| 8 | Mix: thoại 0 dB, nhạc nền −26 dB (ducking), SFX −12 dB, tiếng hẻm buổi sáng làm ambience | Remotion / DaVinci Fairlight | 30 phút |
| 9 | Render 1080p 30fps, xem lại ở 1,5× | Remotion | 30 phút |
| 10 | Thumbnail 3 biến thể + upload private + CC + chapters + playlist | Nano Banana Pro + YouTube Studio | 45 phút |

**Tổng lần đầu:** ~9–12 giờ (chưa tính thiết kế nhân vật). Các tập sau ở Quán Cô Ba (ví dụ tình huống "Quán cà phê" A1): ~3–4 giờ.

## 6. Ước tính chi phí

| Hạng mục | Số lượng | Chi phí |
| --- | --- | --- |
| Kịch bản (LLM) | 2–3 lượt viết + kiểm tra | ~$0,5 |
| Giọng tiếng Anh (ElevenLabs v3) | ~1.000 ký tự × 1,5 | ~$0,12 |
| Giọng tiếng Việt | ~1.800 ký tự × 1,5 | ~$0,2 (ElevenLabs) — rẻ hơn nếu dùng Gemini TTS |
| Ảnh nền | 4 ảnh × 4 biến thể × $0,05 | $0,80 |
| Keyframe | 3 × 3 lượt × $0,05 | $0,45 |
| AI video | 3 clip × 5 s × 2 biến thể × $0,084 | $2,52 |
| Thumbnail | 6 ảnh × $0,134 (Nano Banana Pro) | $0,80 |
| SFX | ~1 phút ElevenLabs SFX | $0,12 |
| **Tổng** | | **≈ $5,5** |

Ảnh nền ($0,80) chỉ trả ở tập đầu tại Quán Cô Ba. Giá dịch vụ lấy từ [docs/06-cong-cu-ai.md](../../../../docs/06-cong-cu-ai.md).

## 7. Tiêu đề, thumbnail, mô tả

Xem [README của tình huống](../README.md#metadata-youtube). Lưu ý:

- Tiêu đề **tiếng Việt** chứa từ khóa người Việt hay tìm ("gọi món bằng tiếng Anh", "tiếng Anh giao tiếp"), có **cấp độ CEFR** để người xem biết vị trí trong lộ trình.
- Thumbnail có tag **A1** cùng vị trí và màu ở mọi video (A2, B1, B2 cùng kiểu), để người xem nhận ra các bản của cùng tình huống.
- Thẻ "Altered or synthetic content": video hoạt hình rõ ràng không giả người hoặc sự kiện thật, nên theo hướng dẫn hiện hành thường không bắt buộc bật. Kiểm tra lại chính sách khi đăng.
