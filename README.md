# PDF Merger - Kết Hợp Hình Ảnh và PDF

Một script Node.js để chuyển đổi nhiều hình ảnh hoặc PDF thành một file PDF liền mạch mà không bị phân trang rối rạc.

## 🎯 Tính Năng

✅ Kết hợp nhiều hình ảnh (JPG, PNG, GIF, WebP, TIFF) thành PDF  
✅ Gộp nhiều file PDF thành một  
✅ Hỗ trợ kết hợp cả hình ảnh và PDF  
✅ Tự động điều chỉnh kích thước để vừa trang (không còn những page trống)  
✅ Hai chế độ sử dụng: **Tương tác** và **Batch**  
✅ Giao diện CLI thân thiện  

## 📋 Yêu Cầu

- Node.js >= 14.0
- npm hoặc yarn

## 🚀 Cài Đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Chạy script:**

### Chế độ Tương Tác (Chọn File Từng Cái)
```bash
npm start
```
hoặc:
```bash
node merger.js --interactive
```

**Quy trình:**
- Chọn thư mục chứa file
- Chọn các file cần kết hợp (dùng Space để chọn)
- Nhập tên file output
- Script sẽ tiến hành xử lý

### Chế độ Batch (Xử Lý Tất Cả File)
```bash
npm run batch
```
hoặc:
```bash
node merger.js --batch
```

**Quy trình:**
- Chọn thư mục chứa file
- Script sẽ tự động xử lý tất cả file hình ảnh/PDF trong thư mục
- Nhập tên file output
- Hoàn thành!

## 📁 Định Dạng Hỗ Trợ

### Hình Ảnh:
- `.jpg`, `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.tiff`

### PDF:
- `.pdf`

## 💡 Ví Dụ

**Tình huống 1:** Bạn có 10 ảnh chụp tài liệu và muốn chuyển thành 1 file PDF
```bash
npm start
# Chọn thư mục chứa ảnh
# Chọn 10 ảnh
# Nhập: "tai-lieu.pdf"
✓ Hoàn thành! File lưu tại: /path/to/tai-lieu.pdf
```

**Tình huống 2:** Bạn có nhiều PDF lẻ và muốn gộp thành 1
```bash
npm run batch
# Nhập thư mục chứa các PDF
# Script tự động kết hợp tất cả
# Nhập: "hop-nhat.pdf"
✓ Hoàn thành!
```

## ⚙️ Cách Hoạt Động

1. **Hình ảnh** → Chuyển đổi thành PNG → Nhúng vào PDF với kích thước tự động vừa trang
2. **PDF** → Copy trang từ file PDF gốc vào PDF mới
3. **Gộp** → Tất cả được đưa vào một file PDF duy nhất
4. **Output** → Lưu file PDF cuối cùng

## 🔧 Tùy Chỉnh Kích Thước

Script mặc định điều chỉnh kích thước theo tiêu chuẩn **A4** (595 x 842 pixels).

Để thay đổi, sửa các giá trị này trong `merger.js`:
```javascript
const A4_WIDTH = 595;
const A4_HEIGHT = 842;
```

**Các tiêu chuẩn khác:**
- **Letter**: 612 x 792
- **A3**: 842 x 1191
- **A5**: 420 x 595

## 🐛 Xử Lý Lỗi

Script sẽ tự động bỏ qua file không hỗ trợ và hiển thị cảnh báo.

Ví dụ:
```
✓ Đã thêm thành công
⚠️  Định dạng không hỗ trợ: .txt
✓ Đã thêm thành công
```

## 📝 Ghi Chú

- File được sắp xếp theo thứ tự **alphabetical** trong chế độ batch
- Thứ tự chọn file được giữ nguyên trong chế độ tương tác
- File output không được ghi đè (nếu tồn tại, bạn cần xác nhập tên khác)

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Node.js phiên bản >= 14.0 đã cài đặt?
2. Dependencies đã cài thành công? (`npm install`)
3. Đường dẫn thư mục có tồn tại?
4. File có đuôi hỗ trợ?

---

**Tạo bởi:** PDF Merger Tool v1.0  
**Cập nhật lần cuối:** 2026
