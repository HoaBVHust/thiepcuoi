const WEDDING_CONFIG = {
  couple: {
    groom: "Bùi Hòa",
    bride: "Hoài An",
    groomRole: "Chú Rể",
    brideRole: "Cô Dâu",
    // Ảnh chân dung chú rể / cô dâu (phần "Hai chúng tôi").
    // Bất kể ảnh dọc, ngang hay vuông — web tự cắt vừa khung 2:3, không méo.
    // Đổi thành "assets/images/anh-chu-re.jpg" khi có ảnh thật.
    groomPhoto: "assets/images/groom.svg",
    bridePhoto: "assets/images/bride.svg"
  },

  // Ảnh lớn ở màn chào (hero). Ảnh bất kỳ kích thước nào cũng tự cắt vừa khung vòm 4:5.
  heroPhoto: {
    src: "assets/images/final.jpeg",
    alt: "Hoài An & Bùi Hòa — ảnh đôi bên bờ biển"
  },

  date: {
    iso: "2026-11-29T18:00:00+07:00",
    display: "29/11/2026",
    day: "CHỦ NHẬT",
    dayNumber: "29",
    month: "THÁNG 11",
    year: "2026",
    lunar: ""
  },

  ceremony: {
    time: "09:00",
    title: "LỄ THÀNH HÔN",
    subtitle: "ĐƯỢC CỬ HÀNH TẠI TƯ GIA"
  },

  reception: {
    guestTime: "17:30",
    startTime: "18:00",
    venue: "Tại gia nhà cô dâu & Nhà văn hóa thôn Kim Thượng",
    address: "Thôn Kim Thượng, xã Đa Phúc, thành phố Hà Nội",
    // Tọa độ chính xác vị trí tiệc (lấy từ Google Maps) — bản đồ ghim đúng tới từng mét
    coords: "21.20466, 105.9066",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=21.20466%2C%20105.9066"
  },

  family: {
    groom: {
      title: "Gia đình nhà trai",
      father: "Ông Bùi Văn ...",
      mother: "Bà ...",
      address: "Địa chỉ nhà trai"
    },
    bride: {
      title: "Gia đình nhà gái",
      father: "Ông ...",
      mother: "Bà ...",
      address: "Địa chỉ nhà gái"
    }
  },

  /* ======================================================================
     ALBUM ẢNH — cách thêm ảnh mới:
     1. Đặt file ảnh vào  assets/images/  (nên nén qua tools/image-resizer.html)
     2. Thêm 1 dòng vào mảng bên dưới, 2 cách viết đều được:

        Cách 1 — nhanh (chỉ đường dẫn):
        "assets/images/photo-01.jpg"

        Cách 2 — đầy đủ (có chú thích + ảnh nổi bật):
        { src: "assets/images/photo-01.jpg", alt: "Chụp ở biển", featured: true }

     - "featured: true"  → ảnh chiếm 2 cột, to hơn các ảnh khác
     - Web TỰ ĐỘNG đo kích thước ảnh (dọc/ngang/vuông) và xếp lưới đẹp,
       KHÔNG cần chỉnh gì thêm, ảnh không bao giờ bị méo.
     ====================================================================== */
  photos: [
    { src: "assets/images/gallery-01.svg", alt: "Vòm hoa & ngày cưới", featured: true },
    { src: "assets/images/gallery-02.svg", alt: "Hai chiếc nhẫn" },
    { src: "assets/images/gallery-03.svg", alt: "Hoa cưới" },
    { src: "assets/images/gallery-04.svg", alt: "Nâng ly chúc mừng" },
    { src: "assets/images/gallery-05.svg", alt: "Thư gửi ngày cưới" },
    { src: "assets/images/gallery-06.svg", alt: "Đường về nhà" },
    { src: "assets/images/gallery-07.svg", alt: "Tiệc mừng ngày mới" },
    { src: "assets/images/gallery-08.svg", alt: "Hai chúng tôi" }
  ],

  /* ======================================================================
     LƯU DỮ LIỆU KHÁCH MỜI (RSVP + sổ lưu bút) vào Google Sheet
     Làm theo docs/HUONG-DAN-GOOGLE-SHEET.md rồi dán Web app URL vào đây
     (chuỗi kết thúc bằng /exec).
     Để trống "" → web chạy chế độ demo: dữ liệu chỉ lưu trên trình duyệt
     của khách, KHÔNG có nơi tổng hợp. Nhớ điền trước khi deploy thật!
     ====================================================================== */
  appsScriptUrl: "",

  music: {
    enabled: true,
    src: "assets/music/wedding.mp3",
    autoplayAfterOpen: true
  },

  gift: {
    groom: {
      bank: "Ngân hàng",
      account: "0000000000",
      owner: "Bùi Hòa",
      qr: "assets/images/qr-groom.svg"
    },
    bride: {
      bank: "Ngân hàng",
      account: "0000000000",
      owner: "Hoài An",
      qr: "assets/images/qr-bride.svg"
    }
  }
};
