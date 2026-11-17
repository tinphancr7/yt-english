# 7. Chi phí sản xuất

> Đơn giá lấy từ [06-cong-cu-ai.md](06-cong-cu-ai.md) (17/11/2026). Đây là **ước tính có giả định rõ ràng** — sau 5 video đầu, thay bằng số liệu thật từ sổ chi phí (cost ledger) của pipeline.

**Theo bản A1–B2 của mỗi tình huống** (thời lượng ở [04-chu-de-va-50-y-tuong.md](04-chu-de-va-50-y-tuong.md)): phim A1 (~4 phút) ≈ cột 5 phút; A2 (5–6 phút) ≈ cột 5 phút; B1 (~8 phút) ≈ giữa cột 5 và 10 phút; B2 (~11 phút) ≈ cột 10 phút; video tổng hợp tình huống ≈ $0,5. Video mẫu [Gọi phở A1](../video-mau/chu-de-an-uong/th01-goi-pho-quan-co-ba/A1/README.md#6-ước-tính-chi-phí) tính chi tiết ra **≈ $5,5**, thấp hơn cột 5 phút vì khoảng một nửa thời lượng là phần giảng tiếng Việt dùng template. Các bản A2–B2 **cùng bối cảnh** với A1 nên gần như không tốn ảnh nền mới. Giọng tiếng Việt cộng thêm ~$0,1–0,3/video.

**Một tình huống trọn bộ (13 video):** 4 phim ≈ $5,5 + $8 + $11 + $15 ≈ **$40**; 4 video phân tích + 4 video phản xạ ≈ $4; tổng hợp ≈ $0,5 → **≈ $45/tình huống**. Ở nhịp 2–3 tình huống/tháng: **~$90–135/tháng** chi phí biến đổi.

**Video đi kèm** (Phân tích & giải thích, Phản xạ 7 giây — [11-video-luyen-tap.md](11-video-luyen-tap.md)): ~$0,5/video (LLM soạn giải thích + giọng 2.000–4.000 ký tự + thumbnail, không ảnh nền mới, không AI video) và 0,5–1 giờ duyệt. Với 10 video phim/tháng, thêm 20 video luyện tập ≈ **+$10/tháng** và +10–20 giờ công.

## Giả định

| Hạng mục | Giả định |
| --- | --- |
| Lượng thoại | ~75% thời lượng có người nói; A2 ≈ 120 từ/phút ≈ 660 ký tự/phút; × 1,5 cho sinh lại (retake) |
| Ảnh | Ảnh 2K Nano Banana 2.1 = $0,05; tính cả ảnh bị loại (× 3) |
| AI video | Kling 3.0 720p không audio = $0,084/giây; mỗi cảnh chèn 5 giây; × 2,5 cho re-roll |
| Lip-sync hội thoại | Rhubarb (miễn phí) |
| Nhạc/SFX | YouTube Audio Library (miễn phí) + ElevenLabs SFX khi cần |
| Render | Máy cá nhân (Remotion + FFmpeg) — tiền điện không tính |

## Chi phí biến đổi cho một video — gói Cân bằng

| Hạng mục | 5 phút | 10 phút | 15 phút | Cách tính |
| --- | --- | --- | --- | --- |
| Kịch bản (LLM API, writer + editor) | $0,5 | $0,7 | $1,0 | Ước tính vài lượt sinh + kiểm tra |
| Giọng nói (ElevenLabs v3/v4) | $0,3 | $0,6 | $0,9 | 3.700 / 7.400 / 11.100 ký tự × $0,08/1K |
| Ảnh (bối cảnh mới, keyframe, thumbnail) | $2,0 | $3,0 | $4,0 | 40 / 60 / 80 ảnh × $0,05 |
| AI video cảnh chèn | $4,2 | $7,4 | $10,5 | 4 / 7 / 10 cảnh × 5 s × 2,5 × $0,084 |
| Lip-sync AI bổ sung (Hedra, khi cần) | $0,5 | $0,5 | $0,5 | ~10 giây 720p |
| SFX / nhạc | $0,2 | $0,3 | $0,4 | ElevenLabs SFX $0,12/phút |
| **Tổng biến đổi** | **≈ $8** | **≈ $12,5** | **≈ $17** | |
| Thời gian công (sau khi có template) | 3–4 giờ | 5–6 giờ | 7–9 giờ | Duyệt kịch bản, chọn ảnh/clip, QC, đăng |
| Thời gian công (5 video đầu) | 8–12 giờ | 12–16 giờ | — | Học quy trình |

### So sánh 3 phương án cho một video

| Phương án | 5 phút | 10 phút | 15 phút |
| --- | --- | --- | --- |
| Tiết kiệm (không AI video, Gemini TTS) | ~$1,5 | ~$2,5 | ~$3,5 |
| **Cân bằng (puppet + 5–10% AI video)** | **~$8** | **~$12,5** | **~$17** |
| 100% AI video (Kling 3.0 có audio $0,126/s × 2,5 re-roll + ảnh + TTS) | ~$95–130 | ~$190–260 | ~$285–390 |

**Kết luận:** làm mọi cảnh bằng AI video đắt hơn **10–15 lần** mà vẫn kém nhất quán. Chi phí chính của mô hình Cân bằng là **thời gian của bạn**, không phải tiền API.

## Chi phí hàng tháng (giả định video trung bình 10 phút)

| Sản lượng | Tiết kiệm | **Cân bằng** | Chất lượng cao* |
| --- | --- | --- | --- |
| Cố định/tháng | ~$20 | ~$100 (Claude/ChatGPT ~$40, ElevenLabs Creator $22 → Pro $99 khi > ~18 video, Midjourney tháng đầu ~$30, dự phòng) | ~$500 (ElevenLabs Pro, Kling 4.0 gói $500/180 ngày ≈ $83/tháng, Runway, người bản xứ duyệt kịch bản) |
| **10 video** | ~$45 | **~$225** | ~$1.200 |
| **20 video** | ~$70 | **~$430** (gồm nâng ElevenLabs Pro) | ~$1.950 |
| **30 video** | ~$95 | **~$555** | ~$2.700 |
| Giờ công 10 / 20 / 30 video | 45 / 90 / 135 giờ | 55 / 110 / 165 giờ | 40 / 80 / 120 giờ (có editor) |

\* Chất lượng cao: ~30% thời lượng là AI video Kling 4.0 (~$0,15/s), phần còn lại puppet.

**Khuyến nghị sản lượng thực tế cho 1 người:** 8–12 video dài/tháng + 30–40 Shorts cắt từ video dài. 30 video dài/tháng (165 giờ) cần thêm 1 người hỗ trợ và tăng rủi ro bị YouTube đánh giá là nội dung hàng loạt (xem [10-lo-trinh-30-ngay.md](10-lo-trinh-30-ngay.md#rủi-ro)).

## Chi phí đầu tư ban đầu (một lần)

| Hạng mục | Tiền | Thời gian |
| --- | --- | --- |
| Thiết kế 4 nhân vật + mascot (Midjourney 1 tháng + ~300 ảnh Nano Banana) | ~$30 + $15 | 15–25 giờ |
| Mouth chart + tách layer + rig puppet | $0 (tự làm) hoặc $300–800/nhân vật nếu thuê illustrator (ước tính) | 15–25 giờ |
| 5 location đầu tiên × 4 góc (+ ảnh loại) | ~$5 | 3–5 giờ |
| Template Remotion (DialogueScene, PhraseCard, YourTurn, Quiz, Intro/Outro, Shorts) | $0 | 25–40 giờ |
| Logo, jingle, font | $0–50 | 3–5 giờ |
| **Tổng** | **~$50–100** (tự làm) | **60–100 giờ** |

## Cách giảm chi phí

| Cách | Mức giảm | Ghi chú |
| --- | --- | --- |
| Tái sử dụng location (thư viện) | Ảnh: −60–80% | Tập thứ 3 cùng địa điểm gần như không cần ảnh mới |
| Sam đóng mọi vai dịch vụ | Thiết kế nhân vật: −50% | Chỉ đổi lớp trang phục |
| Draft ảnh ở 1K ($0,034) rồi mới tạo 2K bản chọn | Ảnh: −20–30% | |
| Gemini **Batch API** cho ảnh không gấp | Ảnh: ~−50% | Batch có giá thấp hơn Standard theo bảng giá Gemini |
| Sinh thoại theo câu, cache theo hash (text + voice + settings) | TTS: −30% | Sửa 1 câu không sinh lại cả tập |
| Cache kết quả AI theo hash (prompt + model + seed) | Tránh trả 2 lần | Rất quan trọng khi retry pipeline |
| Keyframe được duyệt **trước** khi gửi sang AI video | AI video: −40% | Re-roll video đắt gấp ~2 lần re-roll ảnh |
| Compilation 30–60 phút từ tập cũ | Chi phí ≈ $0 | 1 video/tháng, tăng watch time |
| Shorts render tự động từ cùng `episode.json` | Chi phí ≈ $0 | 3–5 Shorts/video |
| Giới hạn ngân sách cứng cho mỗi tập (ví dụ $20) | Chặn chi phí bất thường | Pipeline dừng và hỏi khi vượt |
