# 1. Phân tích hai kênh tham khảo

> Khảo sát trực tiếp ngày 17/11/2026 bằng trình duyệt: danh sách video, metadata, mô tả và khung hình chụp từ video. Ảnh chụp lưu ở [assets/research/](../assets/research/).
> **Giới hạn:** trình duyệt headless tắt tiếng nên phần giọng đọc, nhạc nền, SFX và tốc độ nói **chưa được nghe trực tiếp** — xem checklist kiểm tra thủ công ở cuối file.

## Kết luận nhanh

- Cả hai kênh dùng **nhân vật 2D dựng sẵn kiểu "rig/puppet"** (cùng một họ phong cách: mắt to, viền mảnh, chuyển động khớp), không phải ảnh AI vẽ từng khung. Đây là lý do họ giữ được nhân vật nhất quán qua hàng trăm video với chi phí thấp.
- **Easy English** ra ít video hơn (253 video) nhưng mỗi video đạt đều 60K–130K view; **Jessica** ra rất nhiều (~1.000 video) nhưng video gần đây chỉ 7K–140K view, trung vị ~27K. Bài học: **chất lượng + câu chuyện > số lượng**, nhất là khi YouTube đang siết nội dung hàng loạt.
- Easy English đã **chèn cảnh quay do AI video tạo** (cận cảnh tay bấm điện thoại — bàn phím có chữ lỗi "spoce" đặc trưng AI) xen giữa các cảnh nhân vật 2D. Mô hình lai "nhân vật rig + cảnh chèn AI" là hướng chúng ta nên đi.

## Số liệu thực tế

| Chỉ số | Learn English with Jessica | Easy English |
| --- | --- | --- |
| Subscribers | 2,85M | 4,65M |
| Số video | ~1.000 | 253 |
| Thời lượng video thường | 15–41 phút; compilation 1,5–3,3 giờ | 14–18 phút; vài video ngữ pháp 10 phút |
| Tần suất gần đây | Video mới nhất cách đây ~6 tháng (có vẻ tạm dừng) | 1 video / 1–4 tuần, đều đặn |
| View/video (30 video gần nhất) | 7,2K – 140K, trung vị ~27K | 40K – 128K, trung vị ~83K |
| Mức CEFR ghi trên tiêu đề | A1–A2, A2–B1 | Không ghi; mô tả kênh: beginner → upper-intermediate |
| Phụ đề YouTube | Chỉ ASR tự động (en) | ASR tự động ~21 ngôn ngữ (khả năng đang bật auto-dubbing/auto-translate — chưa xác nhận) |
| Mô tả video | Dài, nhiều emoji, liệt kê idiom học được, link playlist, link membership "Join" | Chỉ có chapters (timestamp) |

## So sánh theo từng tiêu chí

| Tiêu chí | Jessica | Easy English | Bài học cho kênh mới |
| --- | --- | --- | --- |
| **Character design** | 2D rig, mắt xanh to, viền mảnh, tỉ lệ người thật; nhân vật "giáo viên Jessica" mở đầu video trong lớp học | Cùng họ phong cách 2D rig; dàn nhân vật đa dạng tuổi (trẻ em, người già, gia đình) | Nhân vật rig = nhất quán tuyệt đối. Nhưng phong cách này **đã quá phổ biến** → cần thiết kế riêng để có nhận diện |
| **Bối cảnh, màu sắc** | Nền vector phẳng (flat illustration, giống stock), màu tươi | Nền chi tiết hơn, ánh sáng ấm, cây xanh nhiều; thumbnail nền gần như tranh vẽ AI | Nền là chỗ AI tạo ảnh phát huy tốt nhất: rẻ, nhanh, đẹp, tái sử dụng được |
| **Animation** | Nhép miệng + cử động tay đơn giản; cận mặt 1 người nói; chuyển cảnh cross-dissolve | Two-shot (2 nhân vật cùng khung), cử chỉ nhiều hơn; chèn cảnh AI video điện ảnh | Two-shot + cảnh chèn AI tạo cảm giác "phim" hơn talking head |
| **Hội thoại** | Chuỗi tình huống ngắn quanh 1 chủ đề (gọi pizza, coffee shop, trả hàng, khách sạn...), có lồng idiom và hiểu lầm hài hước | Mỗi chapter là 1 câu chuyện nhỏ có xung đột cảm xúc ("She Texted the Wrong Person!", "My Flight Was Canceled!") | **Xung đột nhỏ + tình huống đời thường** giữ người xem tốt hơn hội thoại "sách giáo khoa" |
| **Cấu trúc video** | Intro giáo viên → nhiều hội thoại liên tiếp; nhiều video 30 phút + bản dài 1–3 giờ (watch time) | Title card 8 giây → 8 chapter ~1,5–2 phút/chapter | Chapter rõ ràng giúp SEO (Key Moments) và người xem nhảy đoạn |
| **Phụ đề** | Burn-in, hộp trắng bo góc, chữ đen sans-serif, giữa dưới khung | Giống hệt: hộp trắng bo góc, chữ đen | Phụ đề burn-in là bắt buộc với kênh học tiếng Anh; có thể khác biệt bằng **highlight từ khóa** và tên người nói |
| **Hook 5–10 giây đầu** | Giáo viên nói lời mời "join Jessica to practice through daily conversations" | Title card tĩnh 8 giây có tên video | **Cả hai đều yếu.** Cơ hội: mở bằng khoảnh khắc hài/căng thẳng của chính câu chuyện (cold open) |
| **Thumbnail** | Chữ khối nhiều màu viền 3D, nhân vật, bong bóng thoại có câu ngắn ("HE'S HUNGRY."), badge "30 Minutes" | Nền tranh cảnh đẹp, chữ in hoa vàng/trắng viền tối, 2–4 nhân vật, không badge | Dùng: 1 câu thoại ngắn trong bong bóng + biểu cảm mạnh + chữ ≤ 4 từ |
| **Tiêu đề** | Nhồi từ khóa: "...\| English Speaking Practice for Beginners (A2-B1)" | Ngắn, rộng: "English for Travel", "Family English Conversation" | Kết hợp: tình huống cụ thể + từ khóa chính + cấp độ, ≤ 70 ký tự |
| **Branding** | Logo "English Jessica" góc trên trái + watermark góc dưới phải | Logo "Easy English" góc dưới phải | Logo nhỏ 1 góc, nhân vật mascot làm nhận diện |
| **Kiếm tiền phụ** | Channel membership | Không thấy | Membership/PDF worksheet là hướng sau 6–12 tháng |

## Điểm mạnh — điểm yếu

**Jessica**

- Mạnh: khối lượng nội dung khổng lồ, từ khóa SEO dày, video dài tối đa watch time, mô tả liệt kê rõ "What you will learn".
- Yếu: tiêu đề na ná nhau, nhân vật ít cá tính, hook yếu, hình ảnh flat giống stock; dấu hiệu sản xuất hàng loạt (rủi ro với chính sách "inauthentic content" của YouTube); đã ngừng ra video ~6 tháng.

**Easy English**

- Mạnh: mỗi chapter là một câu chuyện có cảm xúc, hình ảnh đẹp và ấm, thumbnail thoáng, đều đặn, hiệu suất/video cao.
- Yếu: tiêu đề quá chung chung (khó phân biệt giữa các video), hook 8 giây title card lãng phí, không có phần giải thích/luyện tập — người xem chỉ "nghe phim".

## Khoảng trống thị trường (cơ hội cho kênh mới)

1. **Học chủ động**: cả hai kênh chủ yếu cho xem hội thoại; gần như không có phần *giải thích mẫu câu → nghe lại chậm → đến lượt bạn nói (shadowing có khoảng lặng) → quiz*. Đây là điểm khác biệt chính.
2. **Dàn nhân vật có cá tính và mạch truyện xuyên suốt** (sitcom) thay cho nhân vật "vô danh" đổi theo từng video.
3. **Cold open hài** trong 5 giây đầu thay vì title card / lời chào.
4. **Phụ đề thông minh**: tô màu theo người nói, highlight cụm từ cần học, phụ đề tiếng Việt/đa ngôn ngữ làm track riêng.

## Thị trường Việt Nam (khảo sát bổ sung 17/11/2026)

Tìm trên YouTube (khu vực VN) với 2 cụm từ: *"học tiếng anh giao tiếp hoạt hình song ngữ"* và *"tiếng anh giao tiếp cho người mất gốc hội thoại tình huống"*. Ảnh chụp kết quả ở [assets/research/vn_search_results.png](../assets/research/vn_search_results.png).

| Dạng nội dung đang xếp hạng cao | Ví dụ (kênh — view) | Nhận xét |
| --- | --- | --- |
| Luyện nghe chậm, lặp lại nhiều tốc độ | BingGo Leaders "Lesson 1–20: chậm → rất chậm → bình thường" (18M); Tin Anh 8X (1,2M, video 1h19) | Người Việt rất chuộng **nghe nhiều tốc độ + lặp lại**. Nên đưa vào định dạng |
| Podcast / vlog chậm rãi, giáo viên người nước ngoài nói chủ đề Việt | What's Up English (2,5M; "Cách nói về quê hương") | Chủ đề gần gũi văn hóa Việt hút người xem |
| Trích phim/hoạt hình có bản quyền + phụ đề song ngữ | Learn English with Om "Friends 9: Đi ăn nhà hàng" (555K); Nhật Ký Song Ngữ (Frozen, Shin, Rapunzel) | Nhu cầu học qua câu chuyện rất lớn, nhưng **rủi ro bản quyền** (chính kênh Om ghi không đăng được toàn bộ do bản quyền) |
| Hoạt hình gia đình cho trẻ em | Tiếng Anh 5 Phút "Cùng Ba và Bé" (100–245K, đang ra đều); Oh Vui Kids (669K) | Hoạt hình gốc có nhân vật Việt **đang làm cho trẻ em**, chưa thấy cho người lớn |
| Kênh quốc tế | Learn English with Jessica cũng xuất hiện trong kết quả tìm kiếm tiếng Việt (1,2M) | Người Việt xem cả kênh nói 100% tiếng Anh, nhưng không có phần giải thích tiếng Việt |

**Khoảng trống cho kênh mới:** chưa thấy (trong 2 lượt tìm này) kênh nào làm **hoạt hình gốc, nhân vật và bối cảnh Việt, dành cho người lớn/thanh niên mất gốc, có giải thích tiếng Việt và lộ trình theo cấp độ**. Đây là vị trí kênh nên chiếm. Cần khảo sát thêm ở Tuần 1 (TikTok, Facebook Reels, các kênh trung tâm tiếng Anh) để xác nhận.

## Không sao chép

Kênh mới **không** dùng: tên/nhân vật "Jessica", bộ nhân vật rig có sẵn giống hai kênh, hộp phụ đề trắng y hệt, bố cục thumbnail chữ khối nhiều màu kiểu Jessica. Thiết kế riêng ở [02-concept-kenh.md](02-concept-kenh.md) và [03-nhan-vat.md](03-nhan-vat.md).

## Checklist kiểm tra thủ công (nghe bằng tai, ~30 phút)

Mở 2 video sau, bật tiếng, ghi lại vào bảng:

- Jessica: [How to Order Like A Native?](https://www.youtube.com/watch?v=Exyvfd1AZdg)
- Easy English: [English for Real-Life Situations](https://www.youtube.com/watch?v=W7OITQxqBjU)

| Hạng mục | Cách đo |
| --- | --- |
| Tốc độ nói (WPM) | Đếm số từ trong 30 giây × 2. A2 lý tưởng 100–130 WPM |
| Giọng đọc | TTS hay người thật? Accent Mỹ/Anh? Có cảm xúc không? |
| Nhạc nền | Có/không trong lúc thoại; âm lượng so với giọng |
| SFX | Có hiệu ứng chuyển cảnh, tiếng chuông cửa, tiếng ly cốc...? |
| Nhịp chuyển cảnh | Trung bình bao nhiêu giây đổi một shot |
| Lặp lại | Có phần nghe lại chậm / luyện nói không |
