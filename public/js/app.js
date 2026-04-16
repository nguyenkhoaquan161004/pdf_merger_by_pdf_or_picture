// State
let selectedFiles = [];
let mergedFileName = '';

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const fileListSection = document.getElementById('fileListSection');
const fileName = document.getElementById('fileName');
const mergeBtn = document.getElementById('mergeBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultSection = document.getElementById('resultSection');
const downloadBtn = document.getElementById('downloadBtn');
const errorAlert = document.getElementById('errorAlert');
const successAlert = document.getElementById('successAlert');
const resultMessage = document.getElementById('resultMessage');

// Drag & Drop Event Listeners
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

// File Input Change
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Add File Input Change (thêm file sau)
const addFileInput = document.getElementById('addFileInput');
if (addFileInput) {
    addFileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files, true);  // true = thêm vào danh sách hiện tại
    });
}

// Handle Files
async function handleFiles(files, append = false) {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let file of files) {
        formData.append('files', file);
    }

    try {
        hideAlert();

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || 'Lỗi khi tải file');
            return;
        }

        if (append) {
            // Thêm file mới vào danh sách hiện tại
            selectedFiles = selectedFiles.concat(data.files);
            showSuccess(`Đã thêm ${data.files.length} file`);
        } else {
            // Thay thế danh sách
            selectedFiles = data.files;
            showSuccess(`Đã tải lên ${data.files.length} file`);
        }

        renderFileList();
        mergeBtn.disabled = false;

        // Reset input
        fileInput.value = '';
        if (addFileInput) addFileInput.value = '';
    } catch (error) {
        showError('Lỗi: ' + error.message);
    }
}

// Render File List
function renderFileList() {
    if (selectedFiles.length === 0) {
        fileListSection.style.display = 'none';
        return;
    }

    fileListSection.style.display = 'block';
    document.getElementById('fileCount').textContent = selectedFiles.length;

    fileList.innerHTML = selectedFiles.map((file, index) => `
        <div class="file-item">
            <div class="file-item-info">
                <span class="file-item-number">${index + 1}</span>
                <div class="file-item-name">${file.name}</div>
                <div class="file-item-size">${formatFileSize(file.size)}</div>
            </div>
            <div class="file-item-actions">
                <button class="file-item-btn" onclick="moveFile(${index}, -1)" ${index === 0 ? 'disabled' : ''} title="Di chuyển lên">
                    ▲
                </button>
                <button class="file-item-btn" onclick="moveFile(${index}, 1)" ${index === selectedFiles.length - 1 ? 'disabled' : ''} title="Di chuyển xuống">
                    ▼
                </button>
                <button class="file-item-remove" onclick="removeFile(${index})" title="Xóa file">
                    ✕
                </button>
            </div>
        </div>
    `).join('');
}

// Move File
function moveFile(index, direction) {
    const newIndex = index + direction;

    // Kiểm tra giới hạn
    if (newIndex < 0 || newIndex >= selectedFiles.length) {
        return;
    }

    // Hoán đổi
    const temp = selectedFiles[index];
    selectedFiles[index] = selectedFiles[newIndex];
    selectedFiles[newIndex] = temp;

    renderFileList();
}

// Remove File
function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();

    if (selectedFiles.length === 0) {
        mergeBtn.disabled = true;
        fileInput.value = '';
        if (addFileInput) addFileInput.value = '';
    }
}

// Clear All Files
function clearFiles() {
    if (!confirm('Bạn chắc chắn muốn xóa tất cả file?')) {
        return;
    }
    selectedFiles = [];
    fileInput.value = '';
    if (addFileInput) addFileInput.value = '';
    renderFileList();
    mergeBtn.disabled = true;
    hideAlert();
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Merge Files
async function mergeFiles() {
    if (selectedFiles.length === 0) {
        showError('Vui lòng chọn ít nhất 1 file');
        return;
    }

    const outputFileName = fileName.value.trim();
    if (!outputFileName) {
        showError('Vui lòng nhập tên file');
        return;
    }

    try {
        hideAlert();
        progressSection.style.display = 'block';
        resultSection.style.display = 'none';
        mergeBtn.disabled = true;

        const filePaths = selectedFiles.map(f => f.path);

        const response = await fetch('/api/merge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filePaths: filePaths,
                fileName: outputFileName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || 'Lỗi khi gộp file');
            progressSection.style.display = 'none';
            mergeBtn.disabled = false;
            return;
        }

        // Simulate progress completion
        progressFill.style.width = '100%';
        progressText.textContent = 'Gộp thành công!';

        setTimeout(() => {
            progressSection.style.display = 'none';
            showResult(data);
        }, 500);

        mergedFileName = data.fileName;

    } catch (error) {
        showError('Lỗi: ' + error.message);
        progressSection.style.display = 'none';
        mergeBtn.disabled = false;
    }
}

// Show Result
function showResult(data) {
    resultMessage.textContent = `Gộp thành công! File: ${data.fileName}`;
    resultSection.style.display = 'block';
}

// Download File
async function downloadFile() {
    if (!mergedFileName) return;

    const link = document.createElement('a');
    link.href = `/api/download/${mergedFileName}`;
    link.download = mergedFileName;
    link.click();

    // Clean up
    setTimeout(() => {
        fetch('/api/cleanup', { method: 'POST' }).catch(() => { });
    }, 1000);
}

// Reset Form
function resetForm() {
    selectedFiles = [];
    fileInput.value = '';
    fileName.value = 'merged';
    mergedFileName = '';
    renderFileList();
    progressSection.style.display = 'none';
    resultSection.style.display = 'none';
    mergeBtn.disabled = true;
    hideAlert();
}

// Show Error
function showError(message) {
    errorAlert.textContent = '❌ ' + message;
    errorAlert.style.display = 'block';
}

// Show Success
function showSuccess(message) {
    successAlert.textContent = '✓ ' + message;
    successAlert.style.display = 'block';
    setTimeout(() => {
        successAlert.style.display = 'none';
    }, 3000);
}

// Hide Alert
function hideAlert() {
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fileName.value = 'merged';
    mergeBtn.disabled = true;
});
