# YOLO7 English — Kế hoạch kênh YouTube học tiếng Anh giao tiếp bằng hoạt hình AI cho người Việt

Cập nhật: 17/11/2026 · Giá công cụ AI kiểm tra cùng ngày (xem [docs/06-cong-cu-ai.md](docs/06-cong-cu-ai.md)).

## Tóm tắt điều hành

**Đề xuất:** xây kênh **"YOLO7 English"**, một sitcom hoạt hình 2D lấy bối cảnh một con hẻm ở Sài Gòn, dành cho **người Việt từ mất gốc đến trung cao cấp (A1 → B2)**. Nhân vật chính là **Tín**. Nội dung chia theo **Chủ đề › Tình huống › 4 bản A1 → A2 → B1 → B2**: cùng một cảnh, bản sau giữ các bước của bản trước, nói bằng câu khó hơn và thêm bước mới (hội thoại ~2 → 3 → 4–5 → 6 phút). **Mỗi bản có 3 video:** phim → phân tích & giải thích → phản xạ 7 giây; đủ 4 bản thì có thêm video tổng hợp.

| Quyết định | Lựa chọn | Lý do chính |
| --- | --- | --- |
| Khán giả | Người Việt 16–35 tuổi, học để giao tiếp với người nước ngoài, du lịch, đi làm | Thị trường lớn; chưa thấy kênh hoạt hình gốc nhân vật Việt cho người lớn |
| Concept | Hẻm 99: Quán Cô Ba, **Tín** (nhân vật chính, con trai Cô Ba, dẫn bài), Tony "Vietglish", Jake người Mỹ thuê trọ, Sam đóng mọi vai nhân viên nước ngoài, mèo Mướp | Gần gũi văn hóa Việt, hài tự nhiên, bối cảnh tái sử dụng tối đa |
| Phương pháp | **Một cảnh, 4 trình độ**: A1 (lõi ~2', 1 giao dịch) → A2 (+ bước mới, trục trặc) → B1 (+ vấn đề thật, đổi vai) → B2 (+ thương lượng, thuyết phục). Cùng bối cảnh, ôn ≥ 50% câu bản trước | Học liền mạch theo đúng yêu cầu; sau này đóng gói thành khóa học |
| Định dạng | 1 tình huống = 4 phim (~4 / 5–6 / 8 / 11 phút) + 4 video phân tích + 4 video phản xạ + 1 tổng hợp = **13 video** | Người học tìm đúng trình độ; cùng bối cảnh nên rẻ; video tổng hợp tăng thời gian xem |
| Video đi kèm | Mỗi bản có **Phân tích & giải thích** (ngữ pháp, từ vựng, cách dùng) và **Phản xạ 7 giây** (bài thi 2 chiều), dùng lại câu của bản đó | Vòng Xem → Hiểu → Nói; ~$0,5/video ([docs/11](docs/11-video-luyen-tap.md)) |
| Ngôn ngữ | Hội thoại tiếng Anh; tiếng Việt giảm dần (55% → 35% → 15% → 5%); phụ đề song ngữ ở A1–A2 | "Giàn giáo" tháo dần khi người học lên level |
| Điểm khác biệt | Sửa lỗi Vietglish cho người Việt; video phim ngắn gọn + video phân tích ngữ pháp/từ vựng/cách dùng + bài thi phản xạ 7 giây 2 chiều; văn hóa Việt (trà đá, giành trả tiền, Tết) | Khớp thói quen học của người Việt (luyện phản xạ, phân tích câu) |
| Cách giữ nhân vật nhất quán | AI thiết kế nhân vật **một lần** → puppet 2D → lip-sync tự động (Rhubarb) | AI video vẫn "trôi" nhân vật; puppet nhất quán tuyệt đối |
| Vai trò AI video | 5–10% thời lượng (cảnh chèn) — Kling 3.0 / Gemini Omni Flash | Rẻ hơn 10–15 lần so với làm toàn bộ bằng AI video |
| Chi phí | Phim A1 **~$5,5**, A2 ~$8, B1 ~$11, B2 ~$15; **~$45 cho trọn 1 tình huống (13 video)**; cố định ~$100/tháng | Doanh thu quảng cáo ở Việt Nam thấp → chi phí phải thấp |
| Sản lượng | 2 tình huống chạy song song: ~6 video dài/tuần (2 phim + 2 phân tích + 2 phản xạ) + Shorts (đăng cả TikTok/Reels) | Tránh rủi ro chính sách "inauthentic content" của YouTube |
| Kiếm tiền dài hạn | Sách bài tập theo chủ đề và tình huống, khóa học lộ trình A1→B2, membership, hợp tác trung tâm | Quảng cáo YouTube ở Việt Nam không đủ nuôi kênh |

**Phát hiện quan trọng từ nghiên cứu:**

- Easy English (4,65M sub, 253 video) đạt trung vị ~83K view/video; Jessica (2,85M sub, ~1.000 video) ~27K và đã ~6 tháng không ra video → **chất lượng và câu chuyện thắng số lượng**.
- Thị trường Việt: các định dạng thắng là luyện nghe chậm/nhiều tốc độ, podcast chủ đề Việt, trích phim có bản quyền (rủi ro), hoạt hình cho trẻ em. **Chưa thấy hoạt hình gốc nhân vật Việt cho người lớn.**
- Giá AI thay đổi rất nhanh (Veo 3.1 không còn trên bảng giá Gemini API, Kling đã lên 4.0) → pipeline cần lớp adapter để đổi nhà cung cấp.

## Mục lục

| # | Tài liệu | Nội dung |
| --- | --- | --- |
| 1 | [docs/01-phan-tich-kenh-tham-khao.md](docs/01-phan-tich-kenh-tham-khao.md) | Hai kênh tham khảo + khảo sát thị trường Việt Nam |
| 2 | [docs/02-concept-kenh.md](docs/02-concept-kenh.md) | 3 concept, concept được chọn, tỉ lệ tiếng Việt theo level, định dạng video, nhận diện, kiếm tiền |
| 3 | [docs/03-nhan-vat.md](docs/03-nhan-vat.md) | Thế giới Hẻm 99, dàn nhân vật, style lock, character sheet, cách giữ nhất quán |
| 4 | [docs/04-chu-de-va-50-y-tuong.md](docs/04-chu-de-va-50-y-tuong.md) | **Cấu trúc Chủ đề › Tình huống › 4 bản**, quy tắc mở rộng cảnh, **50 tình huống** (12 chủ đề), lịch đăng song song, playlist |
| 5 | [docs/05-quy-trinh-san-xuat.md](docs/05-quy-trinh-san-xuat.md) | Quy trình 7 bước (giọng Anh + Việt, phụ đề song ngữ) |
| 6 | [docs/06-cong-cu-ai.md](docs/06-cong-cu-ai.md) | Đánh giá công cụ (giá USD, API, nhất quán), TTS tiếng Việt, 3 bộ công cụ theo ngân sách |
| 7 | [docs/07-chi-phi.md](docs/07-chi-phi.md) | Chi phí video 5/10/15 phút, 10/20/30 video/tháng, cách giảm chi phí |
| 8 | [docs/08-tu-dong-hoa.md](docs/08-tu-dong-hoa.md) | Kiến trúc pipeline, `situation.json`, mức tự động từng bước, retry, kiểm soát chi phí |
| 9 | [video-mau/chu-de-an-uong/](video-mau/chu-de-an-uong/README.md) | **Chủ đề mẫu Ăn uống › Tình huống 1 "Gọi phở ở quán Cô Ba"** A1 → B2: bản A1 đủ bộ sản xuất + video phân tích + video phản xạ; A2, B1, B2 có kịch bản; bảng mở rộng cảnh qua 4 bản; video tổng hợp |
| 10 | [docs/10-lo-trinh-30-ngay.md](docs/10-lo-trinh-30-ngay.md) | Kế hoạch 4 tuần, tiêu chí chất lượng, ngân sách thử nghiệm, rủi ro |
| 11 | [docs/11-video-luyen-tap.md](docs/11-video-luyen-tap.md) | **Video đi kèm** mỗi bản: Phân tích & giải thích (ngữ pháp, từ vựng, cách dùng) và Phản xạ 7 giây (bài thi 2 chiều); phân tích 2 kênh tham khảo; mẫu cho Gọi phở A1 |
| 12 | [docs/12-du-phong-rui-ro.md](docs/12-du-phong-rui-ro.md) | Bài học từ video "Sức Mạnh Của Claude?" và **9 điểm cần dự phòng** (AI bịa thông tin ngữ pháp, render quá tải, giọng nhân vật, font tiếng Việt, Shorts dọc…) |
| — | [docs/99-nguon-va-han-che-ai.md](docs/99-nguon-va-han-che-ai.md) | Hạn chế hiện tại của AI video, nguồn tham khảo |
| — | [prompts/](prompts/) | Prompt viết kịch bản (writer/editor, quy tắc thang cấp độ), prompt character sheet |
| — | [assets/research/](assets/research/) | Ảnh chụp kênh tham khảo và kết quả tìm kiếm thị trường Việt |

## Bắt đầu ngay (3 việc tuần này)

1. Kiểm tra handle `@yolo7english` còn trống (YouTube, TikTok, Facebook) và khảo sát thêm 5–10 kênh tiếng Anh giao tiếp của Việt Nam.
2. Tạo hero image cho Tín, Tony, Jake, Cô Ba, Sam, Mướp bằng [prompts/character-sheet.md](prompts/character-sheet.md); cho 5 người Việt xem góp ý.
3. Đọc to kịch bản [Gọi phở A1](video-mau/chu-de-an-uong/th01-goi-pho-quan-co-ba/A1/script.md) và [A2](video-mau/chu-de-an-uong/th01-goi-pho-quan-co-ba/A2/script.md) — sửa chỗ nào chưa tự nhiên (cả tiếng Anh và tiếng Việt) trước khi sinh giọng.
