# Thiệp cưới Hoài An & Bùi Hòa

Bộ template HTML/CSS/JS thuần, dựng lại theo phong cách demo Hoa Mộc Xanh:
- Nền kem + xanh lá
- Hoa watercolor
- Parallax khi cuộn
- Mở thiệp
- Nhạc nền
- Couple/family/ceremony/reception
- Album + lightbox
- Countdown
- Lịch tháng
- RSVP
- Google Maps
- Timeline
- Sổ lưu bút lưu localStorage
- Hộp quà QR

## Quan trọng
Source CSS/JS và file nhạc gốc của demo ChungDoi không được public qua crawler ở dạng có thể lấy nguyên file, nên bộ này là implementation riêng, không phải bản sao source của ChungDoi.

## Thay thông tin
Chỉ sửa `config.js`.

## Thay ảnh
Đặt ảnh vào `assets/images/`, sau đó sửa mảng `photos` trong `config.js`.

## Thay nhạc
Đặt file MP3 vào `assets/music/wedding.mp3`.

## Thay QR
Đặt `qr-groom.png` và `qr-bride.png` vào `assets/images/`.

## Deploy
Push toàn bộ thư mục lên GitHub, sau đó kết nối repository với Cloudflare Pages.
