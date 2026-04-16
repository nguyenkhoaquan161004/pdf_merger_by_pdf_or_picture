# Hướng Dẫn Nhanh - Quick Start

## 🎬 Bắt Đầu Nhanh (5 phút)

### 1️⃣ Cài đặt
```bash
cd pdf-merger
npm install
```

### 2️⃣ Dùng ngay

**Chế độ tương tác (dễ dàng nhất):**
```bash
npm start
```

**Chế độ batch (xử lý hàng loạt):**
```bash
npm run batch
```

### 3️⃣ Theo dõi

Bạn sẽ thấy:
```
✓ Đã thêm thành công
[1/5] Đang xử lý: page1.jpg
✓ Hoàn thành! File lưu tại: merged.pdf
```

---

## 🎓 Các Tình Huống Sử Dụng

### Tình Huống 1: Chuyển Ảnh Chụp Thành PDF
```
Có 20 ảnh chụp từ điện thoại
↓
npm start
↓
Chọn 20 ảnh
↓
Gõ: "scan-doc.pdf"
↓
✓ File PDF hoàn chỉnh
```

### Tình Huống 2: Gộp Nhiều Báo Cáo PDF
```
Có 5 file PDF của dự án
↓
npm run batch
↓
Chọn thư mục
↓
Gõ: "report-2026.pdf"
↓
✓ Tất cả gộp lại thành 1 file
```

### Tình Huống 3: Hỗn Hợp Ảnh + PDF
```
Ảnh 1, 2 + File PDF 1 + Ảnh 3, 4
↓
npm start
↓
Chọn cả hình ảnh và PDF
↓
✓ Mọi thứ thành 1 file nhập chứng
```

---

## 📊 So Sánh Hai Chế Độ

| Chế Độ | Ưu Điểm | Nhược Điểm |
|--------|--------|-----------|
| **Tương tác** | Chọn file cụ thể, kiểm soát thứ tự | Chậm hơn khi có nhiều file |
| **Batch** | Nhanh, tự động xử lý hết | Phải xử lý tất cả file |

---

## ⚡ Tips & Tricks

### Tip 1: Đặt Tên File Hợp Lý
```
✓ Đặt tên: page-001.jpg, page-002.jpg, ...
✗ Tránh: anh.jpg, anh (1).jpg, anh (2).jpg
```

### Tip 2: Kiểm Tra Định Dạng
```
Hỗ trợ: jpg, png, gif, tiff, webp, pdf
Không hỗ trợ: bmp, psd, eps, svg
```

### Tip 3: Tổ Chức Thư Mục
```
📁 project/
  ├─ 📁 input/
  │  ├─ page1.jpg
  │  ├─ page2.jpg
  │  └─ page3.pdf
  └─ 📁 output/
     └─ (file output sẽ ở đây)
```

---

## 🔧 Khắc Phục Sự Cố

**Lỗi: `Cannot find module`**
```bash
→ Chạy: npm install
```

**Lỗi: `File not found`**
```bash
→ Kiếm tra đường dẫn có đúng không
```

**Lỗi: `Sharp library error`**
```bash
→ Cài đặt lại: npm install sharp --build-from-source
```

---

## 📱 Ví Dụ Thực Tế

### Ví Dụ 1: Hóa Đơn
```javascript
// 10 ảnh hóa đơn từ điện thoại
→ Chọn tất cả bằng chế độ tương tác
→ Output: "hoá-đơn-tháng-4.pdf"
→ Mở file để kiểm tra
```

### Ví Dụ 2: Tài Liệu Công Ty
```bash
npm run batch
# Chọn: /company/documents/2026
# Output: "2026-all-docs.pdf"
# ✓ Tất cả tài liệu trong thư mục được gộp
```

---

## 🎯 Tiếp Theo

Sau khi có file PDF:
1. ✅ Kiểm tra file bằng Adobe Reader hoặc trình xem PDF
2. ✅ Chia sẻ file cho những người khác
3. ✅ Upload lên cloud storage
4. ✅ In ấn nếu cần

---

**Chúc bạn sử dụng vui vẻ! 🎉**

Nếu có câu hỏi, hãy kiểm tra `README.md`
