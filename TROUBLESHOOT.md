# Hướng Dẫn Khắc Phục Sự Cố

## ❌ Lỗi Thường Gặp

### 1. "Cannot find module 'pdf-lib'"

**Nguyên nhân:** Dependencies chưa cài đặt

**Giải pháp:**
```bash
npm install
```

**Chi tiết:**
```bash
cd pdf-merger
npm install --save
```

---

### 2. "Sharp prebuild was not found"

**Nguyên nhân:** Sharp library cần build từ source

**Giải pháp:**
```bash
npm install sharp --build-from-source
```

**Nếu vẫn lỗi:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

---

### 3. "ENOENT: no such file or directory"

**Nguyên nhân:** Đường dẫn thư mục không tồn tại

**Kiểm tra:**
- Nhập đúng đường dẫn đầy đủ
- Đường dẫn phải tồn tại trên máy tính
- Dùng `/` trong Windows (hoặc `\` nhưng phải escape)

**Ví dụ:**
```
❌ Sai: C:Program FilesImages
✓ Đúng: C:\Users\Your-Name\Pictures
✓ Đúng: C:/Users/Your-Name/Pictures
```

---

### 4. "No image files found"

**Nguyên nhân:** Không có file hỗ trợ trong thư mục

**Kiểm tra:**
```bash
# Những file này được hỗ trợ:
- *.jpg
- *.jpeg
- *.png
- *.gif
- *.webp
- *.tiff
- *.pdf

# Những file này KHÔNG được hỗ trợ:
- *.bmp
- *.psd
- *.eps
- *.svg
- *.txt
- *.doc
```

**Cách khắc phục:**
Chuyển đổi file sang định dạng hỗ trợ trước khi dùng script

---

### 5. "Permission denied"

**Nguyên nhân:** Không có quyền truy cập thư mục

**Giải pháp (Windows):**
- Chuộc phải copy file sang Desktop
- Kiếm tra Properties → Security

**Giải pháp (Mac/Linux):**
```bash
sudo chown -R $USER folder-name
```

---

### 6. Script chạy rất chậm

**Nguyên nhân:**
- Hình ảnh quá lớn (> 50MB)
- Số lượng file quá nhiều (> 1000 file)
- Máy tính yếu

**Cách tối ưu:**
1. **Nén hình ảnh** trước khi dùng:
   - Dùng TinyPNG, Photoshop, hoặc ImageMagick
   - Giảm resolution xuống 1200x1600px

2. **Xử lý từng batch nhỏ:**
   - Chia 100 file thành 10 batch
   - Xử lý lần lượt

3. **Cập nhật Node.js:**
   ```bash
   # Cài phiên bản mới nhất
   node --version  # Kiếm tra phiên bản
   ```

---

### 7. File PDF output bị lỗi

**Nguyên nhân:**
- Hình ảnh bị hỏng
- PDF gốc không hợp lệ
- Không đủ bộ nhớ

**Kiểm tra:**
```bash
# Mở file PDF bằng:
- Adobe Reader
- Preview (Mac)
- Edge Browser

# Nếu vẫn lỗi, thử:
- Kiếm tra lại hình ảnh gốc
- Xóa hình ảnh bị lỗi
- Chạy lại script
```

---

### 8. "ENOMEM: Cannot allocate memory"

**Nguyên nhân:** Liệu máy hết bộ nhớ

**Giải pháp:**
1. Đóng các ứng dụng không cần thiết
2. Giảm số lượng file xử lý
3. Nén hình ảnh nhỏ hơn

---

## ⚠️ Cảnh báo Thông Thường

### Cảnh báo: "Định dạng không hỗ trợ: .bmp"

**Ý nghĩa:** File .bmp bị bỏ qua

**Giải pháp:** Chuyển sang .jpg hoặc .png

---

### Cảnh báo: "PDF file is corrupted"

**Nghĩa:** File PDF không thể đọc

**Số lượng giải pháp:**
1. Thử mở PDF bằng Adobe Reader
2. Nếu lỗi trong Reader, file bị hỏng vĩnh viễn
3. Thay thế file PDF

---

## 🔍 Cách Debug

### 1. Kiểm tra Node.js
```bash
node --version
# Output: v16.0.0 hoặc cao hơn
```

### 2. Kiểm tra npm
```bash
npm --version
# Output: 7.0.0 hoặc cao hơn
```

### 3. Kiểm tra file
```bash
ls -la folder-name/
# Xem tất cả file trong thư mục
```

### 4. Chạy script với debug mode
```bash
NODE_DEBUG=* npm start
# (Dành cho advanced users)
```

---

## 📱 Hỗ trợ từng OS

### Windows

❌ **Vấn đề:** Script không chạy được
✓ **Giải pháp:**
```bash
# Chạy PowerShell as Administrator
npm install
npm start
```

❌ **Vấn đề:** Đường dẫn bị lỗi
✓ **Giải pháp:**
```bash
# Dùng forward slash: C:/Users/...
# Không dùng backslash: C:\Users\...
```

---

### Mac

❌ **Vấn đề:** Sharp không cài được
✓ **Giải pháp:**
```bash
# Cần cài Xcode Command Line Tools
xcode-select --install
npm install
```

---

### Linux

❌ **Vấn đề:** Lỗi build libraries
✓ **Giải pháp:**
```bash
# Ubuntu/Debian
sudo apt-get install build-essential python3 -y
npm install

# CentOS/RHEL
sudo yum install gcc gcc-c++ python27 -y
npm install
```

---

## 🆘 Không Trong List?

Nếu gặp lỗi không trong danh sách này:

1. **Kiểm tra error message** chính xác
2. **Google search** với error message
3. **Kiểm tra Node.js version** (phải >= 14.0)
4. **Thử cài lại dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## ✅ Xác Nhận Cài Đặt Thành Công

Nếu thấy điều này, cài đặt thành công! ✓

```
npm install
added 450+ packages
npm start
# Hiện menu chọn
```

---

**Chúc bạn sử dụng vui vẻ! 🎉**

Nếu vẫn gặp vấn đề, hãy:
1. Đọc README.md
2. Kiểm tra QUICK_START.md
3. Thử chạy lại từ đầu
