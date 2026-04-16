import express from 'express';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

const router = express.Router();

async function imageBufferToPdf(buffer, fileName) {
    const pdfDoc = await PDFDocument.create();

    try {
        const metadata = await sharp(buffer).metadata();
        const { width, height } = metadata;

        const imageBytes = await sharp(buffer)
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
    } catch (error) {
        console.error(`Error processing image ${fileName}:`, error.message);
        throw new Error(`Không thể xử lý ảnh: ${fileName}`);
    }
}

async function pdfBufferToPdfDoc(buffer) {
    try {
        const pdfDoc = await PDFDocument.load(buffer);
        return pdfDoc;
    } catch (error) {
        console.error('Error reading PDF:', error.message);
        throw new Error('Không thể đọc file PDF');
    }
}

router.post('/merge', async (req, res) => {
    try {
        const { fileIds, fileName } = req.body;

        if (!fileIds || fileIds.length === 0) {
            return res.status(400).json({ error: 'Vui lòng chọn ít nhất 1 file' });
        }

        if (!fileName) {
            return res.status(400).json({ error: 'Vui lòng nhập tên file' });
        }

        if (!global.uploadedFiles) {
            return res.status(400).json({ error: 'Không có file nào' });
        }

        const finalPdf = await PDFDocument.create();

        for (let i = 0; i < fileIds.length; i++) {
            const fileId = fileIds[i];
            const fileData = global.uploadedFiles[fileId];

            if (!fileData) {
                console.warn(`File ${fileId} not found`);
                continue;
            }

            try {
                let sourceDoc;

                const ext = fileData.name.substring(fileData.name.lastIndexOf('.')).toLowerCase();

                if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff'].includes(ext)) {
                    sourceDoc = await imageBufferToPdf(fileData.buffer, fileData.name);
                } else if (ext === '.pdf') {
                    sourceDoc = await pdfBufferToPdfDoc(fileData.buffer);
                } else {
                    console.warn(`Unsupported format: ${ext}`);
                    continue;
                }

                const pages = await finalPdf.copyPages(sourceDoc, sourceDoc.getPageIndices());
                pages.forEach(page => {
                    finalPdf.addPage(page);
                });

            } catch (error) {
                console.error(`Error processing file ${fileId}:`, error.message);
                // Continue with next file
            }
        }

        const pdfBytes = await finalPdf.save();

        // Ensure .pdf extension
        let finalFileName = fileName;
        if (!finalFileName.toLowerCase().endsWith('.pdf')) {
            finalFileName += '.pdf';
        }

        // Set response headers for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${finalFileName}"`);
        res.setHeader('Content-Length', pdfBytes.length);

        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Merge error:', error);
        res.status(500).json({ error: 'Lỗi khi gộp file: ' + error.message });
    }
});

export default router;
