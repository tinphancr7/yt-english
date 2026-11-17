# Nguồn tham khảo và hạn chế hiện tại của AI video

## Hạn chế của AI Video Generation (tháng 11/2026)

| Hạn chế | Ảnh hưởng tới kênh | Cách xử lý trong kế hoạch này |
| --- | --- | --- |
| **Nhân vật trôi giữa các clip** — chi tiết nhỏ (kẹp tóc, kính, logo áo, số ngón tay) thay đổi dù có ảnh reference | Mất nhận diện thương hiệu qua hàng trăm video | Puppet cho 90% thời lượng; AI video chỉ 5–10%; duyệt keyframe; QC màu |
| **Clip ngắn** — thường 5–15 giây/lần tạo (Gemini Omni Flash tối đa 15 giây) | Không tạo được cảnh hội thoại dài liền mạch | Ghép nhiều shot ngắn; hội thoại dài dùng puppet |
| **Hội thoại nhiều người** — lip-sync dễ gán nhầm người nói, biểu cảm người nghe thiếu tự nhiên | Không dùng được cho phần cốt lõi của kênh | Mỗi lượt thoại render riêng bằng puppet + Rhubarb |
| **Chữ trong ảnh/video** bị lỗi (Easy English có cảnh bàn phím chữ "spoce") | Lỗi chính tả trên kênh dạy tiếng Anh | Chữ luôn là layer riêng do code/Canva tạo |
| **Phong cách cartoon phẳng** — nhiều model nghiêng về 3D/bán thực; dễ thêm gradient, ánh sáng điện ảnh | Lệch style giữa cảnh chèn và cảnh puppet | Prompt "keep the exact art style of the input image", camera tĩnh, chuyển động đơn giản |
| **Chi phí re-roll** — 2–3 lần mới được 1 clip dùng được | Chi phí thực ×2–3 so với giá niêm yết | Đã tính hệ số 2,5 trong [07-chi-phi.md](07-chi-phi.md) |
| **Model và giá thay đổi liên tục** — Veo 3.1 không còn trên bảng giá Gemini API; Kling 4.0 có gói API riêng tối thiểu $500 | Pipeline gãy, ngân sách lệch | Adapter provider; kiểm tra giá hàng tháng |
| **Bộ lọc an toàn** chặn prompt vô hại (ví dụ "horse" + "eat") | Job thất bại không rõ lý do | Không retry nguyên văn; viết lại prompt; ghi log |
| **Chính sách nền tảng** — YouTube siết nội dung AI hàng loạt, lặp lại | Rủi ro mất kiếm tiền | Đầu tư câu chuyện, phần học chủ động, sản lượng vừa phải |
| **Âm thanh gốc của model video** (Kling có audio, Gemini Omni) — giọng không khớp giọng nhân vật cố định | Giọng nhân vật không nhất quán | Tắt audio gốc; dùng TTS cố định + SFX riêng |

## Nguồn đã mở và đọc trực tiếp (17/11/2026)

| Nguồn | Dùng cho |
| --- | --- |
| [Learn English with Jessica — kênh](https://www.youtube.com/@LearnEnglishwithJessica/videos) và [video "How to Order Like A Native?"](https://www.youtube.com/watch?v=Exyvfd1AZdg) | Phân tích kênh, khung hình, mô tả, từ khóa |
| [Easy English — kênh](https://www.youtube.com/@easyenglish551/videos) và [video "English for Real-Life Situations"](https://www.youtube.com/watch?v=W7OITQxqBjU) | Phân tích kênh, chapters, khung hình |
| [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing) | Giá Nano Banana 2.1 / Pro, Gemini Omni 1.2 Flash, Gemini 3.8 Flash TTS |
| [Kling API pricing](https://kling.ai/dev/pricing) | Giá Kling 2.5 Turbo / 3.0 / 4.0, Avatar, Lip Sync, gói trả trước |
| [ElevenLabs API pricing](https://elevenlabs.io/pricing/api) | Giá TTS v3/v4, gói Starter/Creator/Pro, SFX, Music |
| Tìm kiếm YouTube (khu vực VN): ["học tiếng anh giao tiếp hoạt hình song ngữ"](https://www.youtube.com/results?search_query=h%E1%BB%8Dc+ti%E1%BA%BFng+anh+giao+ti%E1%BA%BFp+ho%E1%BA%A1t+h%C3%ACnh+song+ng%E1%BB%AF) và ["tiếng anh giao tiếp cho người mất gốc hội thoại tình huống"](https://www.youtube.com/results?search_query=ti%E1%BA%BFng+anh+giao+ti%E1%BA%BFp+cho+ng%C6%B0%E1%BB%9Di+m%E1%BA%A5t+g%E1%BB%91c+h%E1%BB%99i+tho%E1%BA%A1i+t%C3%ACnh+hu%E1%BB%91ng) | Khảo sát đối thủ thị trường Việt Nam |
| [FPT.AI — TTS pricing](https://docs.fpt.ai/docs/en/speech/documentation/tts-pricing) | TTS tiếng Việt (giá phải liên hệ) |
| [Phải Giỏi Tiếng Anh](https://www.youtube.com/@phaigioitienganh/videos) — [bài thi Việt→Anh](https://www.youtube.com/watch?v=gKbQ8wT-Nm8), [bài học](https://www.youtube.com/watch?v=MKTyYLPj8vA) | Định dạng phản xạ 7 giây và video bài học ([docs/11](11-video-luyen-tap.md)) |
| [VocabularyHeaven](https://www.youtube.com/@Vocabulary_Heaven/videos) — [Cấu trúc từ vựng B1 phần 4](https://www.youtube.com/watch?v=HHz8xG79ISs) | Cách phân tích cấu trúc câu (tham khảo cho video Phân tích & giải thích) ([docs/11](11-video-luyen-tap.md)) |
| [Sức Mạnh Của Claude? — kênh Đất](https://www.youtube.com/watch?v=q7fKeP6S6Ds) | Cách dùng Claude cho motion graphics, edit, thiết kế, kịch bản; giới hạn và mẹo ([docs/12](12-du-phong-rui-ro.md)) |

## Nguồn tham khảo bên thứ ba (qua tìm kiếm — cần kiểm tra lại trên trang chính thức)

| Nguồn | Nội dung |
| --- | --- |
| [eesel.ai — Midjourney pricing 2026](https://www.eesel.ai/blog/midjourney-pricing) | Gói Midjourney, Omni Reference |
| [magichour.ai — Runway Gen-4.5 pricing](https://magichour.ai/blog/runway-gen-45-pricing) | Giá Runway API |
| [higgsfield.ai — Higgsfield vs Runway 2026](https://higgsfield.ai/blog/higgsfield-vs-runway-2026) | Gói Higgsfield và Runway (blog của nhà cung cấp) |
| [Hedra — Character-3](https://www.hedra.com/models/video/hedra/character-3) | Giá Character-3 theo giây |
| [diyai.io — HeyGen pricing 2026](https://diyai.io/ai-tools/video-generation/heygen-pricing/) | Giá HeyGen API Avatar IV |
| [beri.net — ElevenLabs vs Cartesia vs Azure TTS](https://www.beri.net/article/elevenlabs-vs-cartesia-vs-azure-tts-latency-pricing-voice-cloning-2026) | Giá Azure Neural TTS |
| [Remotion — License](https://www.remotion.dev/docs/license) | Điều kiện miễn phí (≤ 3 người) |
| [eesel.ai — CapCut pricing](https://eesel.ai/blog/capcut-pricing) | Giá CapCut Pro (khác nhau theo vùng) |
| [YouTube Data API — Quota cost](https://developers.google.com/youtube/v3/determine_quota_cost) | Quota upload (đã thay đổi nhiều lần — kiểm tra trong Cloud Console) |
| [vidIQ — YouTube AI monetization](https://vidiq.com/blog/post/youtube-ai-monetization/), [TechRepublic](https://www.techrepublic.com/article/news-youtube-ai-video-monetization-rules/), [eWeek](https://www.eweek.com/news/youtube-responds-to-ai-concerns/) | Chính sách "inauthentic content" |

## Công cụ và tài liệu kỹ thuật

| Tài liệu | Dùng cho |
| --- | --- |
| [Rhubarb Lip Sync (GitHub)](https://github.com/DanielSWolf/rhubarb-lip-sync) | Lip-sync 2D từ audio, chuẩn khẩu hình A–H, X |
| [Remotion docs](https://www.remotion.dev/docs/) | Dựng video bằng React, render từ dữ liệu |
| [YouTube Data API — Videos: insert](https://developers.google.com/youtube/v3/docs/videos/insert) | Upload tự động |
| [YouTube Help — chính sách kiếm tiền YPP](https://support.google.com/youtube/answer/1311392) | Điều kiện kiếm tiền, nội dung lặp lại/không xác thực |
| [YouTube Audio Library](https://studio.youtube.com/) (YouTube Studio → Audio Library) | Nhạc nền miễn phí |
| [Cambridge English Profile](https://www.englishprofile.org/) | Tra cấp độ CEFR của từ và cấu trúc |

## Việc cần kiểm tra lại trước khi chi tiền

- [ ] Giá Midjourney, Runway, Higgsfield, HeyGen, CapCut trên trang chính thức (mới có số liệu bên thứ ba).
- [ ] Gói API Kling: gói "General" có còn bán trial 30% không; có cần gói Flagship cho Kling 4.0 không.
- [ ] Chất lượng Gemini Omni Flash với phong cách cartoon phẳng (chưa thử thực tế).
- [ ] Quota upload YouTube Data API của project bạn trong Cloud Console.
- [ ] Điều khoản thương mại của giọng ElevenLabs Voice Library bạn chọn.
