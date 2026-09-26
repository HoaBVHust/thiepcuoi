/*
 * CONFIG THIỆP CƯỚI
 * Chỉ cần sửa file này để tạo một thiệp mới.
 */
const WEDDING_CONFIG = {
  couple: {
    groom: "Văn Hòa Họ Bùi",
    bride: "Hoài An",
    separator: "♥",
    subtitle: "Trân trọng kính mời bạn đến chung vui cùng chúng tôi"
  },

  date: {
    iso: "2026-11-29T09:30:00+07:00",
    display: "29 tháng 11, 2026",
    lunar: "22 tháng 10 năm Bính Ngọ"
  },

  cover: {
    image: "assets/images/cover.svg",
    eyebrow: "SAVE THE DATE",
    title: "Bùi Hòa & Hoài An",
    buttonText: "Mở thiệp"
  },

  story: {
    title: "Câu chuyện của chúng mình",
    text: "Từ một cuộc gặp gỡ rất đỗi tình cờ, chúng mình đã cùng nhau đi qua những ngày bình thường và biến chúng thành những kỷ niệm thật đẹp. Nay chúng mình muốn chia sẻ khoảnh khắc đặc biệt này cùng những người thân yêu."
  },

  event: {
    title: "Hôn lễ",
    time: "17:30",
    date: "Chủ Nhật, 24.05.2026",
    venue: "Nhà hàng Hoa Mộc",
    address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    mapUrl: "https://maps.google.com/"
  },

  gallery: [
    "assets/images/gallery-01.svg",
    "assets/images/gallery-02.svg",
    "assets/images/gallery-03.svg",
    "assets/images/gallery-04.svg",
    "assets/images/gallery-05.svg",
    "assets/images/gallery-06.svg"
  ],

  music: {
    enabled: true,
    src: "assets/music/wedding.mp3",
    title: "Wedding Song"
  },

  gift: {
    enabled: true,
    bank: "Vietcombank",
    account: "0123456789",
    owner: "Bùi Văn Hòa",
    qr: "assets/images/qr.svg"
  },

  footer: {
    message: "Cảm ơn bạn đã đến chung vui cùng chúng mình ♥"
  }
};
