import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Memory storage instead of disk
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.pdf'];
        
        if (supportedFormats.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Định dạng không hỗ trợ: ${ext}`), false);
        }
    }
});

// Upload endpoint
router.post('/upload', upload.array('files', 100), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Không có file nào được tải lên' });
        }

        // Store files in memory
        const uploadedFiles = req.files.map((file, index) => ({
            id: `${Date.now()}-${index}`,
            name: file.originalname,
            buffer: file.buffer,
            size: file.size,
            mimetype: file.mimetype
        }));

        // Store in session/global (temporary solution)
        if (!global.uploadedFiles) {
            global.uploadedFiles = {};
        }

        uploadedFiles.forEach(file => {
            global.uploadedFiles[file.id] = file;
        });

        // Return only metadata (not buffer)
        const response = uploadedFiles.map(f => ({
            id: f.id,
            name: f.name,
            size: f.size
        }));

        res.json({
            success: true,
            files: response,
            message: `Đã tải lên ${uploadedFiles.length} file`
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
