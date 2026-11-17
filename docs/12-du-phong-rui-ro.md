# 12. Bài học từ video "Sức Mạnh Của Claude?" và kế hoạch dự phòng

> Video: [Sức Mạnh Của Claude? — kênh Đất](https://www.youtube.com/watch?v=q7fKeP6S6Ds) (11:52, 70,8K view, đăng 07/11/2026). Transcript không tải được bằng trình duyệt tự động; nội dung dưới đây đọc từ chapters, mô tả và khung hình xem trước: [phần dây chuyền, giới hạn, mẹo](../assets/research/claude_video_pipeline_gioi_han_meo.png) · [phần motion, edit, thiết kế](../assets/research/claude_video_motion_edit_thiet_ke.png). Đọc lướt bằng khung hình nên có thể sót chi tiết lời nói.

## Kết luận nhanh

Video **xác nhận hướng đi của kế hoạch**: Claude không tạo ảnh hay cảnh quay, nhưng viết code để làm motion graphics (Remotion, GSAP), dựng và cắt video (FFmpeg), phụ đề (Whisper), thiết kế (HTML/CSS/SVG) — và **chính video đó dùng hoạt hình 2D cut-out** (nhân vật tách bộ phận, rig bằng code), đúng mô hình puppet của Hẻm 99.

Từ 5 giới hạn và 5 mẹo trong video, có **9 điểm cần dự phòng** cho kênh, trong đó 3 điểm quan trọng nhất là: **AI bịa thông tin** (nguy hiểm nhất với video Phân tích ngữ pháp), **render bằng máy cá nhân** (mỗi tình huống 13 video dài), và **giọng nhân vật phụ thuộc ElevenLabs**.

## Nội dung chính của video

| Phần | Nội dung | Đối chiếu với kế hoạch Hẻm 99 |
| --- | --- | --- |
| Nguyên lý | "Thứ gì quy được về code hoặc dòng lệnh thì Claude làm được." Công thức 3 bước: bạn nói ý tưởng bằng tiếng Việt → Claude viết code → máy chạy ra thành phẩm | Đúng cách dùng Claude Code cho pipeline ([08](08-tu-dong-hoa.md)) |
| Món 1 · Motion graphics | Thay vì kéo keyframe trong After Effects/CapCut, gõ mô tả → Claude viết GSAP/CSS/SVG hoặc **Remotion**; cần thêm **bước render**; làm được biểu đồ, toán học kiểu 3Blue1Brown, **hoạt hình 2D cut-out chibi** | Template phụ đề, thẻ mẫu câu, bài thi phản xạ, puppet đều là motion graphics bằng code |
| Món 2 · Edit video | FFmpeg: cắt, nối, đổi tốc độ, **ngang → dọc 9:16**, **tách giọng – cân âm lượng – chèn nhạc**, nén file (180 MB → nhẹ hơn 13 lần, vẫn xem tốt); cảnh báo **cắt chính giữa khi đổi sang dọc dễ "mất mặt"** nhân vật | Shorts, chuẩn hóa −16 LUFS, ducking nhạc |
| Món 3 · Thiết kế | Claude **không tạo ảnh bằng điểm ảnh**, mà dựng bằng code/vector (poster, banner, thiệp, landing page); lợi thế: chữ sắc nét, phóng to không vỡ | Thumbnail: ảnh từ Higgsfield, **chữ do code** ([05](05-quy-trinh-san-xuat.md)) |
| Món 4 · Kịch bản | Chủ đề thô → 3 góc kể → kịch bản → storyboard có prompt ảnh và mô tả chuyển động | Đúng bước viết kịch bản + storyboard |
| Mở gì để dùng | Claude trên web, Claude Code, tiện ích Chrome, kết nối Gmail/Drive/Calendar | Bạn đã có Claude Code |
| Dây chuyền 7 bước | 1 Chủ đề → 3 góc kể · 2 Viết kịch bản · 3 Storyboard · 4 Ảnh + giọng đọc · 5 Dựng cảnh khớp lời (Whisper lấy mốc thời gian) · 6 Render & xuất bản (ngang + dọc, gắn phụ đề) · 7 Thumbnail & 5 phương án tiêu đề. "Bạn: từ thợ lên đạo diễn" | Trùng gần như hoàn toàn với pipeline ở [08](08-tu-dong-hoa.md) |

**5 giới hạn video nêu:** (1) không tự sinh cảnh quay thực / ảnh chụp — cần Veo, Kling, Seedance…; (2) thiếu định hướng thì ra sản phẩm "đẹp kiểu trung bình cộng"; (3) đừng mong được ngay lần đầu — phải lặp chạy thử → xem → chỉ chỗ chưa ưng; (4) render chạy bằng máy bạn; (5) có thể bịa rất tự tin (số liệu, tên riêng, chi tiết lịch sử).

**5 mẹo:** (1) đưa tham chiếu; (2) nói mục đích, không chỉ thao tác ("video này cho Shorts, khán giả lướt"); (3) chia nhỏ; (4) lưu thành template — công sức mỗi video giảm dần (100% → 55% → 35% → 25%); (5) sửa cụ thể như đạo diễn ("hơi nhanh" → "tiêu đề bay vào mất đúng 1 giây, dừng giữa màn hình").

## 9 điểm cần dự phòng cho Hẻm 99

| # | Rủi ro | Từ video | Mức | Dự phòng cụ thể |
| --- | --- | --- | --- | --- |
| 1 | **AI bịa thông tin trong video Phân tích**: giải thích ngữ pháp sai, IPA sai, gắn sai CEFR, sai sự thật văn hóa | Giới hạn 5 | **Cao nhất** | Editor-LLM thứ hai (ChatGPT kiểm Claude và ngược lại); **IPA tra từ nguồn có sẵn** (từ điển Cambridge/Oxford khi duyệt; về sau script tra CMUdict cho giọng Mỹ thay vì để LLM tự viết IPA); CEFR tra English Profile; bạn duyệt từng khối; mỗi lỗi bị khán giả phát hiện → ghim bình luận đính chính + sửa template prompt |
| 2 | **Render quá tải máy cá nhân**: mỗi tình huống 13 video dài (phản xạ 11–16 phút, tổng hợp ~30 phút) + Shorts | Giới hạn 4 | Cao | **Đo thử ở Tuần 2**: thời gian render 1 phút video trên máy bạn → tính ra giờ render/tuần; render qua đêm theo hàng đợi; tách render theo scene để chỉ render lại phần sửa; dự phòng **Remotion Lambda** (render trên AWS, trả theo lượt) khi máy không kịp; kiểm tra dung lượng ổ (ước tính vài GB mỗi tình huống, gồm file trung gian) |
| 3 | **Giọng nhân vật biến mất hoặc đổi**: giọng lấy từ Voice Library của ElevenLabs có thể bị chủ sở hữu gỡ; model TTS đổi phiên bản làm giọng khác đi | (không có trong video — phát sinh khi đối chiếu) | Cao | Tạo giọng **bằng Voice Design** (giọng của riêng bạn) thay vì dùng giọng thư viện của người khác; lưu `voice_id`, cài đặt, model và **file mẫu 30 giây** của mỗi nhân vật; ghim phiên bản model trong `voice.json`; giọng dự phòng ở nhà cung cấp thứ hai (Gemini TTS) đã nghe thử |
| 4 | **Sản phẩm "đẹp trung bình cộng"**: template và hình na ná mọi kênh AI khác | Giới hạn 2, mẹo 1 | Trung bình | STYLE LOCK + ảnh tham chiếu nhân vật/bối cảnh luôn đính kèm; làm **bộ token thương hiệu** cho Remotion (màu, font, bo góc, chuyển động chuẩn) trong một file dùng chung; lưu 5–10 khung hình "chuẩn" làm tham chiếu khi nhờ Claude sửa template |
| 5 | **Mất thời gian vì lặp sửa** — video đầu tiên lâu hơn dự kiến | Giới hạn 3, mẹo 4 | Trung bình | Lộ trình đã để 9–12 giờ cho video đầu; dự trữ thêm 30% thời gian cho tháng 1; ghi lại mỗi lần sửa thành quy tắc trong template/prompt để không sửa lại lần hai |
| 6 | **Phản hồi mơ hồ làm Claude sửa sai hướng** | Mẹo 5 | Thấp–TB | Lập **bảng từ vựng phản hồi** cho animation: thời lượng (giây/khung), vị trí (trên/giữa/dưới, % màn hình), easing (vào nhanh – ra chậm), cỡ chữ (px); luôn kèm số cụ thể |
| 7 | **Shorts dọc bị "mất mặt"** khi cắt từ video ngang | Món 2 | Trung bình | **Không cắt** từ bản ngang: render một composition 9:16 riêng từ cùng `episode.json` (bố cục dọc thiết kế sẵn); kiểm tra vùng an toàn của Shorts/TikTok (che bởi nút bấm, chú thích) |
| 8 | **Phụ đề lệch giờ** khi giọng tiếng Việt không có mốc thời gian | Bước 5 (Whisper) | Thấp–TB | Ưu tiên mốc thời gian từ TTS (ElevenLabs with-timestamps); dự phòng **Whisper / ElevenLabs Scribe** để căn (forced alignment); QC tự động lệch > 0,3 giây → cảnh báo |
| 9 | **Font không hiển thị đúng dấu tiếng Việt** trên template code (lỗi dấu chồng, thiếu glyph) | Món 3 (chữ bằng code) | Trung bình | Chọn font Google Fonts hỗ trợ đầy đủ tiếng Việt và cho phép dùng thương mại (giấy phép OFL), ví dụ Be Vietnam Pro, Nunito; nhúng font vào project, không dùng font hệ thống; test bộ câu có đủ dấu ("Tờ báo hả con? Ổng nói gì vậy?") trước khi khóa template |

### Dự phòng khác cần có (ngoài video)

| Rủi ro | Dự phòng |
| --- | --- |
| Higgsfield hết credit giữa tháng hoặc gặp sự cố | Thư viện asset tái sử dụng (location, tư thế nhân vật) để vẫn ra video mà không cần tạo ảnh mới; tài khoản API dự phòng (Gemini cho ảnh, Kling/fal cho clip) nạp sẵn ít tiền |
| Model ảnh đổi phiên bản làm lệch phong cách | Giữ ảnh tham chiếu gốc của nhân vật/bối cảnh; asset đã duyệt không tạo lại; cảnh chèn AI chỉ chiếm 5–10% nên ảnh hưởng nhỏ |
| Hết lượt dùng Claude Code giữa lúc dựng pipeline | Chia việc theo phiên nhỏ (mẹo 3); ChatGPT làm dự phòng cho viết/sửa kịch bản; code lưu trên git nên phiên sau tiếp tục được |
| Mất dữ liệu (ổ hỏng, xóa nhầm) | Git cho code, kịch bản, `episode.json`; asset và video đồng bộ lên cloud (Google Drive hoặc R2) hằng ngày |
| Bản quyền nhạc, font, giọng | Nhạc chỉ từ YouTube Audio Library hoặc nguồn có giấy phép; lưu bằng chứng giấy phép trong `assets/licenses/`; chỉ dùng giọng tạo ra khi gói ElevenLabs đang trả phí |

## Việc bổ sung vào lộ trình 30 ngày

| Tuần | Thêm việc |
| --- | --- |
| Tuần 1 | Tạo giọng nhân vật bằng **Voice Design**, lưu file mẫu 30 giây; chọn và nhúng font tiếng Việt; lập bảng từ vựng phản hồi animation |
| Tuần 2 | Đo tốc độ render 1 phút video trên máy; ước tính giờ render/tuần; test font với câu đủ dấu |
| Tuần 3 | Thiết lập git + sao lưu cloud; nạp sẵn tài khoản API dự phòng; thêm bước tra IPA tự động vào `practice:analysis` |

Chi tiết lộ trình: [10-lo-trinh-30-ngay.md](10-lo-trinh-30-ngay.md). Các rủi ro chung khác: [10-lo-trinh-30-ngay.md#rủi-ro](10-lo-trinh-30-ngay.md#rủi-ro).
