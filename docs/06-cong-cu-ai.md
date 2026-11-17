# 6. Công cụ AI — đánh giá và lựa chọn

> Giá kiểm tra ngày **17/11/2026**. Cột "Nguồn giá": **Chính thức** = đọc trực tiếp trang giá của nhà cung cấp; **Bên thứ ba** = tổng hợp từ blog/so sánh giá, cần kiểm tra lại trước khi mua. Giá AI thay đổi rất nhanh — ví dụ Veo 3.1 không còn trên bảng giá Gemini API, đã được thay bằng Gemini Omni Flash.

## Bảng đánh giá

### Viết kịch bản

| Công cụ | Điểm mạnh | Điểm yếu | Nhất quán | API | Giá | Phù hợp sản xuất hàng loạt |
| --- | --- | --- | --- | --- | --- | --- |
| **Claude** | Văn hội thoại tự nhiên, theo system prompt dài tốt, xuất JSON ổn định | — | Cao (character bible trong system prompt) | Có | Gói Pro ~$20/tháng; API: vài cent / kịch bản (ước tính) | Rất cao |
| **ChatGPT** | Tương tự, hệ sinh thái lớn | — | Cao | Có | Plus ~$20/tháng | Rất cao |

→ Dùng **một** model làm "writer" và model còn lại làm "editor" kiểm tra CEFR/ngữ pháp — hai model khác nhau bắt lỗi của nhau tốt hơn.

### Hình ảnh (nhân vật, bối cảnh, thumbnail)

| Công cụ | Điểm mạnh | Điểm yếu | Nhất quán nhân vật | API | Giá | Nguồn giá |
| --- | --- | --- | --- | --- | --- | --- |
| **Nano Banana 2.1** (Gemini 3.1 Flash Image) | Chỉnh sửa hội thoại, nhiều ảnh reference, "multi-turn character consistency", chữ chính xác hơn | Thẩm mỹ đôi khi "phẳng" hơn Midjourney | Cao | Có (Gemini API, Batch giảm giá) | $0,034/ảnh 1K · $0,050/ảnh 2K · $0,113/ảnh 4K | [Chính thức](https://ai.google.dev/gemini-api/docs/pricing) |
| **Nano Banana Pro** (Gemini 3 Pro Image) | Bố cục phức tạp, chữ trên ảnh tốt nhất | Đắt gấp ~3–4 lần | Cao | Có | $0,134/ảnh 1K–2K · $0,24/ảnh 4K | [Chính thức](https://ai.google.dev/gemini-api/docs/pricing) |
| **Midjourney** (Omni Reference) | Thẩm mỹ đẹp nhất, khám phá phong cách | Không có API chính thức; Omni Reference tốn ~2× GPU time | Khá | Không (chỉ wrapper không chính thức — rủi ro khóa tài khoản) | ~$10–120/tháng | [Bên thứ ba](https://www.eesel.ai/blog/midjourney-pricing) |

→ **Midjourney chỉ dùng thủ công ở giai đoạn thiết kế** (tuần 1). Sản xuất hàng loạt dùng Nano Banana qua API.

### Video / chuyển động

| Công cụ | Điểm mạnh | Điểm yếu | Nhất quán | API | Giá | Nguồn giá |
| --- | --- | --- | --- | --- | --- | --- |
| **Kling 3.0** | Image-to-video tốt, có bản có âm thanh gốc, Motion Control, Omni (reference) | Gói API chính thức trả trước | Khá với reference | Có | 720p: 0,6 unit/s (không audio) ≈ **$0,084/s**; 0,9 unit/s có audio ≈ $0,126/s (1 unit = $0,14 giá niêm yết; gói trial $0,098/unit) | [Chính thức](https://kling.ai/dev/pricing) |
| **Kling 2.5 Turbo** | Rẻ nhất họ Kling | Chất lượng thấp hơn | Trung bình | Có | 720p 0,3 unit/s ≈ **$0,042/s** | [Chính thức](https://kling.ai/dev/pricing) |
| **Kling 4.0 / 4.0 Flash** | Model mới nhất | Gói API riêng tối thiểu **$500** (180 ngày) | Khá–cao | Có | 4.0: 1,0 unit/s 720p ≈ $0,15/s; Flash 0,6 unit/s | [Chính thức](https://kling.ai/dev/pricing) |
| **Gemini Omni 1.2 Flash** | Tạo + chỉnh sửa video tới 15 giây, có âm thanh gốc, cùng API với Nano Banana | Mới, cần thử với phong cách cartoon | Chưa đánh giá | Có | ≈ **$0,07/s** 720p · $0,104/s 1080p | [Chính thức](https://ai.google.dev/gemini-api/docs/pricing) |
| **Runway** (Gen-4.5, Gen-4 Turbo) | Công cụ chỉnh sửa mạnh, ổn định | Đắt hơn cho cùng chất lượng cartoon | Khá | Có | Gen-4.5 ~$0,12/s; Gen-4 Turbo ~$0,05/s; web $15–95/tháng | [Bên thứ ba](https://magichour.ai/blog/runway-gen-45-pricing) |
| **Higgsfield** | Nền tảng tổng hợp nhiều model (Kling, Seedance...) + preset camera | Là lớp trung gian — giá model tương đương nơi khác | Tùy model | Có | Web $15 / $49 / $129 tháng | [Bên thứ ba (blog của Higgsfield)](https://higgsfield.ai/blog/higgsfield-vs-runway-2026) |
| **Pika** | Hiệu ứng vui, nhanh | Không thấy lợi thế về nhất quán/API so với Kling cho use-case này; chưa xác minh giá | — | — | — | Không khuyến nghị |

→ **Chọn Kling 3.0 (qua gói General trial $9,8–98 hoặc qua fal.ai) + thử Gemini Omni Flash.** Không cần Kling 4.0 (gói tối thiểu $500) ở giai đoạn đầu vì AI video chỉ chiếm 5–10% thời lượng.

### Lip-sync / avatar

| Công cụ | Điểm mạnh | Điểm yếu | Hợp với cartoon | API | Giá | Nguồn giá |
| --- | --- | --- | --- | --- | --- | --- |
| **Rhubarb Lip Sync + puppet** | Miễn phí (mã nguồn mở), chính xác theo audio, nhất quán tuyệt đối | Cần rig puppet (đầu tư 1 lần) | **Rất tốt** (được thiết kế cho 2D) | CLI | $0 | [GitHub](https://github.com/DanielSWolf/rhubarb-lip-sync) |
| **Kling Lip Sync** | Rẻ, áp lên video có sẵn | Kết quả trên cartoon không ổn định | Trung bình | Có | 0,5 unit/5s ≈ **$0,014/s** | [Chính thức](https://kling.ai/dev/pricing) |
| **Kling Avatar** | Ảnh + audio → video nói | Một người/khung | Khá | Có | 720p 0,4 unit/s ≈ $0,056/s | [Chính thức](https://kling.ai/dev/pricing) |
| **Hedra Character-3** | Ảnh tĩnh → nhân vật nói có biểu cảm, hỗ trợ nhân vật hoạt hình | Một người/khung, giá theo giây | Khá–tốt | Có (trả trước, không subscription) | 540p $0,025/s · 720p $0,05/s · 1080p $0,0625/s | [Chính thức](https://www.hedra.com/models/video/hedra/character-3) |
| **HeyGen** (Avatar IV) | Tốt nhất cho avatar người thật | Đắt; tối ưu cho người thật, không phải cartoon | Trung bình | Có (pay-as-you-go từ $5) | ~$3/phút (Photo Avatar) | [Bên thứ ba](https://diyai.io/ai-tools/video-generation/heygen-pricing/) |

→ **HeyGen không phù hợp** với kênh hoạt hình (đắt, tối ưu cho người thật). Dùng Rhubarb cho cảnh hội thoại; Hedra/Kling Avatar chỉ khi cần cảnh nhân vật nói trong cảnh chèn AI.

### Giọng nói

| Công cụ | Điểm mạnh | Điểm yếu | API | Giá | Nguồn giá |
| --- | --- | --- | --- | --- | --- |
| **ElevenLabs** v3 / v4 | Tự nhiên và cảm xúc nhất; audio tags; v3 hỗ trợ hội thoại nhiều người; timestamps ký tự | Đắt nhất | Có | API: $0,08/1K ký tự (v3/v4), $0,04 (Flash/Turbo, v4 Turbo); gói Starter $6 (75K ký tự v4), Creator $22 (275K), Pro $99 | [Chính thức](https://elevenlabs.io/pricing/api) |
| **Gemini 3.8 Flash TTS** | Rất rẻ, "expressive acting" | Ít lựa chọn giọng hơn; ít kiểm soát hơn | Có | ≈ $0,0135/phút đến 31/12/2026; ≈ $0,027/phút từ 1/1/2027 | [Chính thức](https://ai.google.dev/gemini-api/docs/pricing) |
| **Azure Neural TTS** | SSML kiểm soát chi tiết (ngắt nghỉ, nhấn), nhiều accent, free 500K ký tự/tháng | Ít cảm xúc hơn ElevenLabs | Có | ~$15/1M ký tự (Neural), ~$22/1M (HD) | [Bên thứ ba](https://www.beri.net/article/elevenlabs-vs-cartesia-vs-azure-tts-latency-pricing-voice-cloning-2026) |

1 phút thoại tiếng Anh ≈ 800–1.000 ký tự → ElevenLabs v3/v4 ≈ **$0,08/phút**.

### Giọng tiếng Việt (Tín dẫn bài, Cô Ba)

| Công cụ | Điểm mạnh | Điểm yếu | API | Giá | Nguồn giá |
| --- | --- | --- | --- | --- | --- |
| **ElevenLabs v3** | Cùng nền tảng với giọng tiếng Anh, có audio tags cảm xúc; v3 hỗ trợ 70+ ngôn ngữ | Chưa thấy đánh giá độc lập về độ tự nhiên tiếng Việt; ít lựa chọn giọng miền Nam | Có | Như tiếng Anh ($0,08/1K ký tự) | [Chính thức](https://elevenlabs.io/pricing/api) |
| **Gemini 3.8 Flash TTS** | Rất rẻ, có tiếng Việt | Kiểm soát giọng vùng miền hạn chế | Có | ≈ $0,0135/phút (đến 31/12/2026) | [Chính thức](https://ai.google.dev/gemini-api/docs/pricing) |
| **FPT.AI TTS** | Nhà cung cấp Việt, tự giới thiệu có nhiều giọng Việt | Giá không công khai — phải liên hệ | Có | Liên hệ | [FPT.AI](https://docs.fpt.ai/docs/en/speech/documentation/tts-pricing) |
| Mô hình mã nguồn mở (ví dụ Kokoro-Vietnamese) | Miễn phí, tự host | Chất lượng và giấy phép thương mại cần kiểm tra | Tự host | $0 + GPU | Chưa xác minh |

→ **Không chọn từ bảng giá — chọn bằng tai.** Tuần 2 làm bài nghe mù 5 câu của Tín + 3 câu của Cô Ba trên 3 công cụ, cho 3–5 người Việt chấm. Với lượng tiếng Việt ~2–3 phút/video, chênh lệch chi phí giữa các công cụ chỉ vài chục cent mỗi video.

### Dựng video và tự động hóa

| Công cụ | Vai trò | Giá | Ghi chú |
| --- | --- | --- | --- |
| **Remotion** (React → MP4) | Engine dựng chính, render từ JSON | **Miễn phí** cho cá nhân/công ty ≤ 3 người ([nguồn](https://www.remotion.dev/docs/license)) | Lựa chọn tốt nhất cho lập trình viên |
| **CapCut** | Dựng tay nhanh, auto-caption, template | Free; Pro ~$19,99/tháng ([bên thứ ba](https://eesel.ai/blog/capcut-pricing), giá khác nhau theo vùng) | Dùng giai đoạn đầu, trước khi có template code |
| **DaVinci Resolve** | Dựng/màu/âm thanh chuyên nghiệp | Bản free đủ dùng | Fairlight cho mix âm thanh |
| **FFmpeg** | Ghép, chuẩn hóa âm thanh, xuất Shorts | Miễn phí | Dùng trong pipeline |
| **n8n** | Điều phối workflow, cổng duyệt (Wait node), thông báo | Self-host miễn phí | Hợp nếu muốn giao diện kéo-thả |
| **Node.js / Python** | Pipeline chính | Miễn phí | Khuyến nghị: TypeScript (cùng ngôn ngữ với Remotion) |
| **fal.ai** | Một API gọi nhiều model video/lip-sync (Kling, Hedra...) | Trả theo lượt | Tránh mua gói tối thiểu của từng hãng |
| **YouTube Data API v3** | Upload, cập nhật metadata, phụ đề, thumbnail | Miễn phí, quota mặc định 10.000 unit/ngày | Chi phí quota của upload đã thay đổi nhiều lần — kiểm tra [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost) |

## Ba bộ công cụ theo ngân sách

| | Tiết kiệm | **Cân bằng (khuyến nghị)** | Chất lượng cao |
| --- | --- | --- | --- |
| Kịch bản | Claude hoặc ChatGPT gói free/Pro | Claude Pro + ChatGPT Plus (writer/editor) hoặc API | Như Cân bằng + người bản xứ duyệt (freelance) |
| Hình ảnh | Nano Banana 2.1 API | Nano Banana 2.1 API + Midjourney 1 tháng (thiết kế) | Nano Banana Pro + Midjourney + LoRA riêng |
| Nhân vật | Puppet + Rhubarb | Puppet + Rhubarb | Puppet thuê illustrator chỉnh sửa chuyên nghiệp (~$300–800/nhân vật, ước tính) |
| Giọng | Gemini 3.8 Flash TTS / Azure | ElevenLabs Creator | ElevenLabs Pro |
| Video chèn | Không có / Kling 2.5 Turbo | Kling 3.0 + Gemini Omni Flash | Kling 4.0 (gói $500) + Runway |
| Lip-sync | Rhubarb | Rhubarb (+ Hedra khi cần) | Rhubarb + Hedra/Kling Avatar |
| Dựng | CapCut free → Remotion | Remotion + FFmpeg | Remotion + DaVinci + editor bán thời gian |
| **Chi phí cố định/tháng** | **~$0–20** | **~$70–120** | **~$300–700** |
| Chi phí biến đổi/video 10 phút | ~$1–3 | ~$8–15 | ~$40–150 |

Chi tiết tính toán ở [07-chi-phi.md](07-chi-phi.md).
