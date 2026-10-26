# Hướng dẫn lưu RSVP & Sổ lưu bút vào Google Sheet

> Làm 1 lần ~15 phút. Sau đó mọi xác nhận tham dự và lời chúc của khách
> sẽ tự chảy vào Google Sheet của bạn, và sổ lưu bút trên website sẽ
> hiển thị lời chúc của **mọi người** (không chỉ của máy khách).

## Bước 1 — Tạo Google Sheet

1. Vào [sheets.google.com](https://sheets.google.com) bằng Google account của bạn (hoặc của cô dâu/chú rể — tài khoản nào tạo thì sheet nằm trong Drive tài khoản đó).
2. Bấm **＋ Trống** (Blank) để tạo spreadsheet mới, đặt tên ví dụ: `Thiep cuoi Hoai An & Bui Hoa`.
3. Đổi tên 2 tab dưới cùng (nhấp đúp vào tên tab):
   - Tab 1 → đặt tên **`RSVP`** (viết hoa, không dấu, không khoảng trắng)
   - Bấm dấu **＋** cạnh tab để thêm tab mới → đặt tên **`LoiChuc`**
4. *(Tùy chọn, chỉ để nhìn đẹp)* Gõ tiêu đề ở dòng 1:
   - Tab `RSVP`: `Thời gian` | `Tên` | `Tham dự` | `Số người` | `Lời nhắn`
   - Tab `LoiChuc`: `Thời gian` | `Tên` | `Lời chúc`

> Script ghi dữ liệu bắt đầu từ dòng 2, nên dù không gõ tiêu đề vẫn chạy bình thường.

## Bước 2 — Dán mã Apps Script

1. Trong Google Sheet: menu **Tiện ích mở rộng** (Extensions) → **Apps Script**. Một tab mới mở ra với trình soạn thảo code (file mặc định tên `Code.gs`).
2. **Xoá hết** nội dung mặc định trong khung soạn thảo.
3. Mở file `tools/apps-script-code.gs` trong thư mục dự án này, **copy toàn bộ** rồi dán vào khung soạn thảo.
4. Bấm biểu tượng **💾 Lưu** (Ctrl+S). Có thể đổi tên dự án thành "Thiep cuoi" cho gọn.

## Bước 3 — Triển khai (Deploy) thành Web App

1. Góc phải trên bấm **Triển khai** (Deploy) → **Triển khai mới** (New deployment).
2. Bấm biểu tượng **⚙️** cạnh "Chọn loại" → chọn **Ứng dụng web** (Web app).
3. Đặt các lựa chọn như sau (quan trọng):
   - **Mô tả**: `thiep cuoi`
   - **Thực thi với tư cách** (Execute as): **Tôi** (Me — tài khoản của bạn)
   - **Ai có quyền truy cập** (Who has access): **Bất kỳ ai** (Anyone) — bắt buộc để khách mở thiệp gửi được.
4. Bấm **Triển khai** → Google yêu cầu cấp quyền → **Cấp quyền truy cập** → chọn tài khoản → có thể hiện cảnh báo "Google chưa xác minh ứng dụng" → bấm **Nâng cao** (Advanced) → **Chuyển đến Thiep cuoi (không an toàn)** → **Cho phép**.
   > Đây là script bạn tự viết, chạy trong Drive của chính bạn — cảnh báo này là bình thường với script cá nhân.
5. Sau khi triển khai xong, copy **URL ứng dụng web** (Web app URL), dạng:
   `https://script.google.com/macros/s/AKfycb.../exec`
   — copy cả chuỗi, kết thúc bằng `/exec`.

## Bước 4 — Dán URL vào thiệp

Mở file `config.js` trong dự án, điền URL vừa copy:

```js
appsScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec",
```

Xong! Chỉnh sửa file này là được — còn lại (RSVP gửi về Sheet, sổ lưu bút tải lời chúc từ Sheet, thống kê số khách) web tự chạy.

## Bước 5 — Kiểm tra

1. Mở thiệp (chạy `index.html` hoặc địa chỉ Cloudflare của bạn), điền form "Xác nhận tham dự" và gửi.
2. Mở lại Google Sheet → tab `RSVP` → một dòng mới xuất hiện là thành công ✅
3. Gửi một lời chúc ở "Sổ lưu bút" → tab `LoiChuc` cũng có dòng mới; tải lại trang thiệp sẽ thấy lời chúc hiển thị trong danh sách.

## Vấn đề thường gặp

| Hiện tượng | Nguyên nhân & cách xử lý |
|---|---|
| Gửi form báo lỗi / không hiện gì | Kiểm tra URL kết thúc bằng `/exec` (không phải `/dev`); kiểm tra quyền deploy là "Bất kỳ ai". |
| Sổ lưu bút không hiện lời chúc | Đúng tên tab phải là `LoiChuc`; thử mở URL `/exec` trực tiếp trên trình duyệt — phải thấy JSON `{"ok":true,...}`. |
| Đổi lại mã Apps Script không có tác dụng | Phải **Deploy → Quản lý triển khai → ✏️ Chỉnh sửa → Version: New version → Deploy** sau mỗi lần sửa code. |
| Mạng công ty chặn Google | Không ảnh hưởng khách mời (họ dùng mạng riêng); chỉ máy bạn trong giờ làm việc không tải được lời chúc — web sẽ tự chuyển sang chế độ chờ, không báo lỗi to. |
| Muốn nhận email mỗi khi có khách xác nhận | Xem ghi chú cuối file `tools/apps-script-code.gs`. |

## Cách dữ liệu chảy

```
Khách điền form ──POST──▶ Apps Script ──appendRow──▶ Google Sheet (RSVP / LoiChuc)
Trang thiệp       ◀──GET──  Apps Script ◀──đọc──── Google Sheet
        └─ hiển thị sổ lưu bút chung + dòng "X khách đã xác nhận"
```

Nếu `appsScriptUrl` để trống, website vẫn chạy được nhưng RSVP/lời chúc chỉ lưu tạm trên trình duyệt của khách (chế độ demo) — nhớ điền URL trước khi đẩy lên Cloudflare.
