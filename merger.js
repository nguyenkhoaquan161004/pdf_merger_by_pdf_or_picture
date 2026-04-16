import fse from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import inquirer from 'inquirer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const fs = fse;

const supportedImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff'];
const supportedPdfFormats = ['.pdf'];

// Đọc file PDF
async function readPdf(filePath) {
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    return pdfDoc;
}

// Hàm đảm bảo file có đuôi .pdf
function ensurePdfExtension(filename) {
    if (!filename.toLowerCase().endsWith('.pdf')) {
        return filename + '.pdf';
    }
    return filename;
}

// Chuyển đổi hình ảnh thành PDF
async function imageToPdf(imagePath) {
    const pdfDoc = await PDFDocument.create();

    // Lấy thông tin ảnh
    const metadata = await sharp(imagePath).metadata();
    const { width, height } = metadata;

    // Chuyển ảnh thành PNG buffer
    const imageBytes = await sharp(imagePath)
        .png()
        .toBuffer();

    // Tính toán kích thước phù hợp A4 với độ phân giải cao
    const A4_WIDTH = 1200;  // Chiều rộng cao hơn để hình ảnh rõ hơn
    const aspectRatio = width / height;

    // Luôn sử dụng chiều rộng A4, điều chỉnh chiều cao theo tỷ lệ ảnh
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

// Gộp tất cả file thành một PDF
async function mergeFiles(filePaths, outputPath) {
    const finalPdf = await PDFDocument.create();

    console.log(`\nBắt đầu xử lý ${filePaths.length} file...`);

    for (let i = 0; i < filePaths.length; i++) {
        const file = filePaths[i];
        const ext = path.extname(file).toLowerCase();

        try {
            console.log(`[${i + 1}/${filePaths.length}] Đang xử lý: ${path.basename(file)}`);

            let sourceDoc;

            if (supportedImageFormats.includes(ext)) {
                // Xử lý hình ảnh
                sourceDoc = await imageToPdf(file);
            } else if (supportedPdfFormats.includes(ext)) {
                // Xử lý PDF
                sourceDoc = await readPdf(file);
            } else {
                console.warn(`⚠️  Định dạng không hỗ trợ: ${ext}`);
                continue;
            }

            // Copy tất cả trang từ source PDF
            const pages = await finalPdf.copyPages(sourceDoc, sourceDoc.getPageIndices());
            pages.forEach(page => {
                finalPdf.addPage(page);
            });

            console.log(`✓ Đã thêm thành công`);
        } catch (error) {
            console.error(`✗ Lỗi khi xử lý ${file}:`, error.message);
        }
    }

    // Lưu file output
    const pdfBytes = await finalPdf.save();
    await fs.writeFile(outputPath, pdfBytes);
    console.log(`\n✓ Hoàn thành! File lưu tại: ${outputPath}`);
}

// Lấy tất cả file từ folder
async function getFilesFromFolder(folderPath) {
    const files = await fs.readdir(folderPath);
    const fullPaths = files
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return supportedImageFormats.includes(ext) || supportedPdfFormats.includes(ext);
        })
        .map(file => path.join(folderPath, file))
        .sort();

    return fullPaths;
}

// Chế độ tương tác (chọn từng file)
async function interactiveMode() {
    console.log('\n📁 Chế độ tương tác - Chọn các file cần kết hợp\n');

    const { startFolder } = await inquirer.prompt([
        {
            type: 'input',
            name: 'startFolder',
            message: 'Nhập đường dẫn thư mục (mặc định: thư mục hiện tại):',
            default: './'
        }
    ]);

    const absolutePath = path.resolve(startFolder);

    if (!fs.existsSync(absolutePath)) {
        console.error('❌ Thư mục không tồn tại!');
        process.exit(1);
    }

    const availableFiles = await getFilesFromFolder(absolutePath);

    if (availableFiles.length === 0) {
        console.log('❌ Không tìm thấy file hình ảnh hoặc PDF trong thư mục!');
        process.exit(1);
    }

    console.log(`\nTìm thấy ${availableFiles.length} file:\n`);
    availableFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${path.basename(file)}`);
    });

    const { selectedFiles } = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedFiles',
            message: 'Chọn các file cần kết hợp (dùng Space để chọn, Enter để xác nhận):',
            choices: availableFiles.map((file, index) => ({
                name: path.basename(file),
                value: file,
                checked: index < 5 // Mặc định chọn 5 file đầu
            }))
        }
    ]);

    if (selectedFiles.length === 0) {
        console.log('❌ Vui lòng chọn ít nhất 1 file!');
        process.exit(1);
    }

    const { outputFileName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'outputFileName',
            message: 'Nhập tên file output (mặc định: merged.pdf):',
            default: 'merged.pdf'
        }
    ]);

    const finalFileName = ensurePdfExtension(outputFileName);
    const outputPath = path.join(absolutePath, finalFileName);
    await mergeFiles(selectedFiles, outputPath);
}

// Chế độ batch (xử lý tất cả file trong folder)
async function batchMode() {
    console.log('\n📦 Chế độ batch - Kết hợp tất cả file trong folder\n');

    const { folderPath } = await inquirer.prompt([
        {
            type: 'input',
            name: 'folderPath',
            message: 'Nhập đường dẫn thư mục:',
            default: './'
        }
    ]);

    const absolutePath = path.resolve(folderPath);

    if (!fs.existsSync(absolutePath)) {
        console.error('❌ Thư mục không tồn tại!');
        process.exit(1);
    }

    const files = await getFilesFromFolder(absolutePath);

    if (files.length === 0) {
        console.log('❌ Không tìm thấy file hình ảnh hoặc PDF!');
        process.exit(1);
    }

    console.log(`\n🔍 Tìm thấy ${files.length} file`);

    const { outputFileName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'outputFileName',
            message: 'Nhập tên file output (mặc định: merged.pdf):',
            default: 'merged.pdf'
        }
    ]);

    const finalFileName = ensurePdfExtension(outputFileName);
    const outputPath = path.join(absolutePath, finalFileName);
    await mergeFiles(files, outputPath);
}

// Main
async function main() {
    const argv = yargs(hideBin(process.argv))
        .option('batch', {
            alias: 'b',
            description: 'Chế độ batch - xử lý tất cả file trong folder',
            type: 'boolean'
        })
        .option('interactive', {
            alias: 'i',
            description: 'Chế độ tương tác - chọn từng file',
            type: 'boolean'
        })
        .help()
        .argv;

    try {
        if (argv.batch) {
            await batchMode();
        } else if (argv.interactive || (!argv.batch && !argv.interactive)) {
            await interactiveMode();
        }
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

main();
