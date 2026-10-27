# Thiệp cưới Hoài An & Bùi Hòa

Bộ template HTML/CSS/JS thuần, phong cách hiện đại tối giản:
- Theme **"bầu trời đêm"** toàn trang: tinh vân + dải ngân hà + sao nhấp nháy (SVG tự vẽ, không phụ thuộc mạng), sao băng bay qua khi lướt tới từng mục
- Cỡ chữ "co giãn" mượt theo màn hình (fluid typography, không cần chỉnh tay)
- Mở thiệp: lướt xuống thiệp, bật nhạc, rồi **tự cuộn chậm ngắm toàn bộ** (~1 phút, chạm vào là dừng)
- Couple / family / ceremony / reception
- Album **masonry tự đo kích thước ảnh** + hiệu ứng hover + lightbox (có vuốt trên điện thoại)
- Ảnh chân dung khung vòm, hiệu ứng xuất hiện khi cuộn
- Countdown, lịch tháng, RSVP, sơ đồ đường đi, timeline, sổ lưu bút
- Hộp quà QR dưới dạng **hố đen đang quay** — chạm vào nổ "Big Bang" rồi mở quà

## Thay thông tin
Chỉ sửa `config.js`.

## Thay ảnh — web tự co giãn mọi kích thước

1. *(Khuyên dùng)* Mở `tools/image-resizer.html` bằng trình duyệt → kéo ảnh vào → tải bản đã nén (~1600px, vài trăm KB).
2. Đặt ảnh vào `assets/images/`.
3. Sửa mảng `photos` trong `config.js` — 2 cách viết:

```js
photos: [
  "assets/images/photo-01.jpg",                              // cách nhanh
  { src: "assets/images/photo-01.jpg", alt: "Chụp ở biển" }, // có chú thích
  { src: "assets/images/photo-02.jpg", alt: "Ảnh chính", featured: true }, // to gấp đôi
]
```

Ảnh dọc, ngang hay vuông đều được: web **tự đo tỷ lệ ảnh thật** và xếp lưới đẹp,
ảnh **không bao giờ bị méo** — không cần chỉnh CSS gì thêm.

### Ảnh chân dung chú rể / cô dâu
Đổi `couple.groomPhoto` / `couple.bridePhoto` trong `config.js` sang file của bạn
(nên dùng ảnh **dọc**, khung 2:3 — web sẽ tự cắt vừa khung vòm).

### Ảnh lớn màn chào (hero)
Đổi `heroPhoto.src` trong `config.js`. Ảnh tự cắt vừa khung 4:5.

## Thay nhạc
Đặt file MP3 vào `assets/music/wedding.mp3`.

## Lưu RSVP & sổ lưu bút vào Google Sheet (quan trọng trước khi deploy)

Làm theo **`docs/HUONG-DAN-GOOGLE-SHEET.md`** (≈15 phút, làm 1 lần):
tạo Google Sheet → dán mã sẵn có trong `tools/apps-script-code.gs` → deploy →
dán Web app URL vào `appsScriptUrl` trong `config.js`.

Không cấu hình thì web vẫn chạy nhưng dữ liệu chỉ lưu tạm trên trình duyệt của khách.

## Thay QR
Đặt `qr-groom.png` và `qr-bride.png` vào `assets/images/`, rồi sửa `gift.*.qr` trong `config.js`.

## Font chữ
- `--script` (Beau Rivage) dùng cho tên — hiển thị tốt dấu tiếng Việt cơ bản (à, è, ù, ò…).
  Nếu tên có dấu phức tạp (ệ, ẫ, ể…) hiển thị lỗi, đổi trong `style.css`:
  `--script:"Dancing Script",cursive` (font này hỗ trợ đầy đủ tiếng Việt).

## Xem thử trên máy
Chạy: `python tools/dev-server.py` → mở `http://localhost:8644`
(server này không lưu cache — luôn hiển thị bản sửa mới nhất; server Python thường có thể giữ bản cũ trong cache trình duyệt).

## Địa điểm & bản đồ
Phần "THE VENUE" dùng **sơ đồ vẽ sẵn** (`assets/images/map.svg`) — không phụ thuộc mạng nên không bao giờ báo lỗi như bản đồ nhúng Google/OpenStreetMap (bị chặn ở nhiều mạng công ty / 4G).
- Nút "CHỈ ĐƯỜNG — GOOGLE MAPS" mở Google Maps app của khách với ghim đúng tọa độ `reception.coords`.
- Link "Mở bản đồ lớn" mở OpenStreetMap.
- Muốn vẽ lại sơ đồ: sửa `assets/images/map.svg` (thay tên thôn trong file này cho khớp nếu đổi địa điểm).

## Deploy
Push toàn bộ thư mục lên GitHub, sau đó kết nối repository với Cloudflare Pages.
