/**
 * ============================================================
 *  MÃ APPS SCRIPT CHO THIỆP CƯỚI — RSVP & SỔ LƯU BÚT
 * ============================================================
 *  Cách dùng: xem docs/HUONG-DAN-GOOGLE-SHEET.md
 *  Tóm tắt: mở Google Sheet → Tiện ích mở rộng (Extensions) →
 *  Apps Script → XOÁ hết nội dung → dán TOÀN BỘ file này vào →
 *  Lưu → Triển khai (Deploy) → Web app.
 *
 *  Yêu cầu: Google Sheet phải có 2 tab tên CHÍNH XÁC:
 *    - "RSVP"     (cột: Thời gian | Tên | Tham dự | Số người | Lời nhắn)
 *    - "LoiChuc"  (cột: Thời gian | Tên | Lời chúc)
 *  (Bảng tiêu đề không bắt buộc có sẵn — script tự ghi, dòng đầu
 *  tiên các bạn có thể gõ tiêu đề cho đẹp, script ghi từ dòng 2.)
 * ============================================================
 */

// Múi giờ Việt Nam cho cột "Thời gian"
var TZ = "Asia/Ho_Chi_Minh";

/** Ghi dữ liệu khi khách gửi form (RSVP hoặc lời chúc) */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.type === "rsvp") {
      var sh = ss.getSheetByName("RSVP");
      if (!sh) throw new Error("Thiếu tab 'RSVP' trong Google Sheet");
      sh.appendRow([
        Utilities.formatDate(new Date(), TZ, "dd/MM/yyyy HH:mm"),
        String(data.name || "").slice(0, 80),
        data.attendance === "no" ? "Không tham dự" : "Tham dự",
        Math.max(1, Math.min(20, Number(data.guests) || 1)),
        String(data.note || "").slice(0, 500)
      ]);
    } else { // lời chúc
      var sh2 = ss.getSheetByName("LoiChuc");
      if (!sh2) throw new Error("Thiếu tab 'LoiChuc' trong Google Sheet");
      sh2.appendRow([
        Utilities.formatDate(new Date(), TZ, "dd/MM/yyyy HH:mm"),
        String(data.name || "").slice(0, 80),
        String(data.message || "").slice(0, 500)
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Trả danh sách lời chúc + thống kê số khách xác nhận (web đọc để hiển thị) */
function doGet(e) {
  var out = { ok: true, wishes: [], rsvpCount: null, guestCount: null };
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Lời chúc — mới nhất lên đầu, tối đa 40
  var sh = ss.getSheetByName("LoiChuc");
  if (sh && sh.getLastRow() > 1) {
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1 && out.wishes.length < 40; i--) {
      out.wishes.push({ time: String(rows[i][0] || ""), name: String(rows[i][1] || ""), message: String(rows[i][2] || "") });
    }
  }

  // Thống kê RSVP
  var rs = ss.getSheetByName("RSVP");
  if (rs && rs.getLastRow() > 1) {
    var data = rs.getDataRange().getValues();
    var going = 0, guests = 0;
    for (var j = 1; j < data.length; j++) {
      var a = String(data[j][2] || "");
      if (a === "Tham dự") { going++; guests += Number(data[j][3]) || 0; }
    }
    out.rsvpCount = going;
    out.guestCount = guests;
  }

  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * (Tùy chọn) Nhận email thông báo mỗi khi có khách xác nhận.
 * Bật bằng cách: trong Apps Script menu bên trái chọn
 * "Trình kích hoạt" (Triggers) → Add Trigger → hàm doPost →
 * sự kiện "On form submit"... không có — hãy dùng cách đơn giản hơn:
 * bỏ chú thích 2 dòng dưới đây trong doPost (phía sau appendRow của RSVP):
 *   MailApp.sendEmail("email-cua-ban@gmail.com", "Khách xác nhận: " + data.name, ...);
 */
