document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const outputFormat = document.getElementById('output-format');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const maxWidth = document.getElementById('max-width');
    const maxHeight = document.getElementById('max-height');
    const maintainAspect = document.getElementById('maintain-aspect');
    const preserveMetadata = document.getElementById('preserve-metadata');
    const compressionInfo = document.getElementById('compression-info');
    const originalSize = document.getElementById('original-size');
    const compressedSize = document.getElementById('compressed-size');
    const reduction = document.getElementById('reduction');
    const compressBtn = document.getElementById('compress-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const uploadArea = document.querySelector('.upload-area');

    let originalImage = null;
    let compressedImage = null;
    let originalFileSize = 0;

    // Update quality value display
    quality.addEventListener('input', function() {
        qualityValue.textContent = `${this.value}%`;
    });

    // Handle file input
    imageInput.addEventListener('change', handleFileSelect);
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('border-primary');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('border-primary');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('border-primary');
        
        if (e.dataTransfer.files.length) {
            imageInput.files = e.dataTransfer.files;
            handleFileSelect({ target: imageInput });
        }
    });

    // Compress button click
    compressBtn.addEventListener('click', function() {
        if (!originalImage) return;
        compressImage();
    });

    // Download button click
    downloadBtn.addEventListener('click', function() {
        if (compressedImage) {
            const link = document.createElement('a');
            link.download = `compressed-${imageInput.files[0].name}`;
            link.href = compressedImage;
            link.click();
        }
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        imageInput.value = '';
        previewContainer.classList.add('d-none');
        compressionInfo.classList.add('d-none');
        compressedImage = null;
        compressBtn.disabled = true;
        downloadBtn.disabled = true;
        resetBtn.disabled = true;
        resetOptions();
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        originalFileSize = file.size;
        originalSize.textContent = formatFileSize(originalFileSize);

        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove('d-none');
            
            // Store original image
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = function() {
                maxWidth.placeholder = originalImage.naturalWidth;
                maxHeight.placeholder = originalImage.naturalHeight;
                compressBtn.disabled = false;
                resetBtn.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }

    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        let width = originalImage.naturalWidth;
        let height = originalImage.naturalHeight;
        
        if (maxWidth.value && maxWidth.value < width) {
            width = parseInt(maxWidth.value);
            if (maintainAspect.checked) {
                height = Math.round((width / originalImage.naturalWidth) * height);
            }
        }
        
        if (maxHeight.value && maxHeight.value < height) {
            height = parseInt(maxHeight.value);
            if (maintainAspect.checked) {
                width = Math.round((height / originalImage.naturalHeight) * width);
            }
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw image
        ctx.drawImage(originalImage, 0, 0, width, height);
        
        // Get output format
        let mimeType = 'image/jpeg';
        if (outputFormat.value === 'png') {
            mimeType = 'image/png';
        } else if (outputFormat.value === 'webp') {
            mimeType = 'image/webp';
        } else if (outputFormat.value === 'auto') {
            mimeType = imageInput.files[0].type;
        }
        
        // Convert to blob
        canvas.toBlob(function(blob) {
            compressedImage = URL.createObjectURL(blob);
            compressedSize.textContent = formatFileSize(blob.size);
            
            const reductionValue = ((originalFileSize - blob.size) / originalFileSize * 100).toFixed(1);
            reduction.textContent = `${reductionValue}%`;
            
            compressionInfo.classList.remove('d-none');
            downloadBtn.disabled = false;
        }, mimeType, quality.value / 100);
    }

    function resetOptions() {
        outputFormat.value = 'auto';
        quality.value = 80;
        qualityValue.textContent = '80%';
        maxWidth.value = '';
        maxHeight.value = '';
        maintainAspect.checked = true;
        preserveMetadata.checked = true;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 