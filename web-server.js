import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup
const uploadDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.pdf'];

        if (supportedFormats.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Định dạng không hỗ trợ: ${ext}`));
        }
    }
});

// Hàm đảm bảo file có đuôi .pdf
function ensurePdfExtension(filename) {
    if (!filename.toLowerCase().endsWith('.pdf')) {
        return filename + '.pdf';
    }
    return filename;
}

// Chuyển ảnh thành PDF
async function imageToPdf(imagePath) {
    const pdfDoc = await PDFDocument.create();

    const metadata = await sharp(imagePath).metadata();
    const { width, height } = metadata;

    const imageBytes = await sharp(imagePath)
        .png()
        .toBuffer();

    const A4_WIDTH = 1200;
    const aspectRatio = width / height;

    const pageWidth = A4_WIDTH;
    const pageHeight = A4_WIDTH / aspectRatio;

    const pngImage = await pdfDoc.embedPng(imageBytes);
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
    });

    return pdfDoc;
}

// Đọc PDF
async function readPdf(filePath) {
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    return pdfDoc;
}

// API: Upload files
app.post('/api/upload', upload.array('files', 100), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Không có file nào được tải lên' });
        }

        const uploadedFiles = req.files.map(file => ({
            name: file.originalname,
            path: file.path,
            size: file.size
        }));

        res.json({
            success: true,
            files: uploadedFiles,
            message: `Đã tải lên ${uploadedFiles.length} file`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Merge PDF
app.post('/api/merge', async (req, res) => {
    try {
        const { filePaths, fileName } = req.body;

        if (!filePaths || filePaths.length === 0) {
            return res.status(400).json({ error: 'Vui lòng chọn ít nhất 1 file' });
        }

        if (!fileName) {
            return res.status(400).json({ error: 'Vui lòng nhập tên file' });
        }

        const finalPdf = await PDFDocument.create();

        for (let i = 0; i < filePaths.length; i++) {
            const file = filePaths[i];
            const ext = path.extname(file).toLowerCase();

            try {
                let sourceDoc;

                if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff'].includes(ext)) {
                    sourceDoc = await imageToPdf(file);
                } else if (ext === '.pdf') {
                    sourceDoc = await readPdf(file);
                } else {
                    continue;
                }

                const pages = await finalPdf.copyPages(sourceDoc, sourceDoc.getPageIndices());
                pages.forEach(page => {
                    finalPdf.addPage(page);
                });

            } catch (error) {
                console.error(`Lỗi xử lý ${file}:`, error.message);
            }
        }

        const finalFileName = ensurePdfExtension(fileName);
        const outputPath = path.join(uploadDir, finalFileName);
        const pdfBytes = await finalPdf.save();
        await fs.writeFile(outputPath, pdfBytes);

        res.json({
            success: true,
            filePath: outputPath,
            fileName: finalFileName,
            message: 'Gộp thành công'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Download file
app.get('/api/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File không tìm thấy' });
        }

        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            // Xóa file sau khi download
            setTimeout(() => {
                fs.remove(filePath).catch(err => console.error('Error removing file:', err));
            }, 1000);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Clean uploaded files
app.post('/api/cleanup', async (req, res) => {
    try {
        await fs.emptyDir(uploadDir);
        res.json({ success: true, message: 'Đã xóa tất cả file tạm' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║   📄 PDF Merger Web Interface       ║
╚══════════════════════════════════════╝

🌐 Server chạy tại: http://localhost:${PORT}

📝 Mở trình duyệt và truy cập:
   → http://localhost:${PORT}

⏹️  Để dừng: Nhấn Ctrl + C

    `);
});

// Cleanup on exit
process.on('SIGINT', async () => {
    console.log('\n\nDang dung server...');
    await fs.emptyDir(uploadDir).catch(() => { });
    process.exit(0);
});
