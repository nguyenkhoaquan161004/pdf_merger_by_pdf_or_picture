# 🚀 Deploy Lên Vercel - Hướng Dẫn Chi Tiết

PDF Merger đã sẵn sàng để deploy lên Vercel! Chỉ cần làm theo các bước dưới đây.

## 📋 Yêu Cầu

- ✅ Tài khoản GitHub (đã có)
- ✅ Tài khoản Vercel (miễn phí)
- ✅ Code đã push lên GitHub

## 🎯 Cách Deploy

### Bước 1: Tạo Tài Khoản Vercel (Nếu Chưa Có)

1. Truy cập: https://vercel.com
2. Bấm **"Sign Up"**
3. Chọn **"Continue with GitHub"**
4. Cho phép quyền truy cập GitHub
5. Xác nhận email

---

### Bước 2: Import Project

1. Vào: https://vercel.com/new
2. Bấm **"Continue with GitHub"**
3. Tìm repo: `pdf_merger_by_pdf_or_picture`
4. Bấm **"Import"**

---

### Bước 3: Cấu Hình Project

**Root Directory**: `.` (để trống - mặc định)

**Framework**: `Other` (không chọn framework cụ thể)

**Environment Variables** (tùy chọn):
- `NODE_ENV`: `production`

Bấm **"Deploy"**

---

### Bước 4: Chờ Deploy

Vercel sẽ:
1. ✓ Clone repo từ GitHub
2. ✓ Cài đặt dependencies (`npm install`)
3. ✓ Build project
4. ✓ Deploy lên servers

**Thời gian chờ**: 2-3 phút

---

### Bước 5: Truy Cập Ứng Dụng

Sau khi deploy thành công, Vercel sẽ cấp cho bạn:

```
🌐 URL: https://pdf-merger-xxx.vercel.app
```

Chép URL này vào trình duyệt để sử dụng!

---

## ✨ Sau Khi Deploy

### Ưu Điểm:
- ✅ Ứng dụng chạy 24/7 miễn phí
- ✅ URL public - share cho bạn bè
- ✅ SSL/HTTPS tự động
- ✅ Deploy tự động khi push code lên GitHub

### Lưu Ý:
- ⚠️ File uploads sẽ bị xóa sau khi dừng request (vì Vercel là stateless)
- ⚠️ Nên tải về PDF ngay sau khi hoàn thành
- ⚠️ Upload tối đa ~5MB/file trên free tier

---

## 🔄 Deploy Lại Khi Có Thay Đổi

Cách 1: **Tự động** (Recommended)
```bash
# Commit & push code
git add .
git commit -m "Update features"
git push origin main

# Vercel sẽ tự động redeploy
```

Cách 2: **Thủ công**
1. Vào Vercel Dashboard
2. Chọn project `pdf_merger_by_pdf_or_picture`
3. Bấm **"Redeploy"**

---

## 🐛 Khắc Phục Lỗi

### Lỗi: "Build Failed"

**Nguyên nhân**: Dependencies không đủ

**Cách Sửa**:
```bash
# Chạy local để kiểm tra
npm install
npm start
```

### Lỗi: "Cannot find module"

**Nguyên nhân**: Thiếu package trong `package.json`

**Cách Sửa**:
```bash
npm install package-name
npm start
git add .
git commit -m "Add dependency"
git push origin main
```

### Lỗi: "Deployment Timeout"

**Nguyên nhân**: Build mất quá lâu

**Cách Sửa**:
1. Vào Vercel Settings
2. Tăng "Build Timeout" (nếu có)
3. Hoặc redeploy

---

## 📊 Giám Sát Deploy

### Xem Logs:
1. Vào Vercel Dashboard
2. Chọn project
3. Bấm **"Deployments"**
4. Chọn deployment gần nhất
5. Xem "Build Logs"

### Xem Performance:
- Vào **"Analytics"** trong Vercel Dashboard
- Xem số lượt request, thời gian response, etc.

---

## 💾 Backup

Nếu muốn backup on-premise (tự host locally):

### Option 1: Docker
```bash
docker build -t pdf-merger .
docker run -p 3000:3000 pdf-merger
```

### Option 2: Hosting Lần 2 (nếu Vercel bị gỡ)
```bash
npm install
npm start
# Hoặc sử dụng PM2 để chạy background
npm install -g pm2
pm2 start web-server.js
```

---

## 🎉 Hoàn Thành!

Ứng dụng của bạn giờ đã có:
- ✅ URL public
- ✅ HTTPS tự động
- ✅ Deploy tự động
- ✅ 99.99% uptime

**Chia sẻ URL với bạn bè và họ có thể sử dụng ngay!**

---

## 📞 Hỗ Trợ Thêm

- Vercel Docs: https://vercel.com/docs
- GitHub Integration: https://vercel.com/docs/git

Chúc bạn deploy thành công! 🚀
