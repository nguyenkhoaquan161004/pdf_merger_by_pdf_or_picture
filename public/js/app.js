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

// Handle Files
async function handleFiles(files) {
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

        selectedFiles = data.files;
        renderFileList();
        mergeBtn.disabled = false;
        showSuccess(`Đã tải lên ${data.files.length} file thành công`);

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
    fileList.innerHTML = selectedFiles.map((file, index) => `
        <div class="file-item">
            <div class="file-item-info">
                <div class="file-item-name">
                    ${index + 1}. ${file.name}
                </div>
                <div class="file-item-size">
                    ${formatFileSize(file.size)}
                </div>
            </div>
            <button class="file-item-remove" onclick="removeFile(${index})" title="Xóa file">×</button>
        </div>
    `).join('');
}

// Remove File
function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();
    
    if (selectedFiles.length === 0) {
        mergeBtn.disabled = true;
        fileInput.value = '';
    }
}

// Clear All Files
function clearFiles() {
    selectedFiles = [];
    fileInput.value = '';
    renderFileList();
    mergeBtn.disabled = true;
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
        fetch('/api/cleanup', { method: 'POST' }).catch(() => {});
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
