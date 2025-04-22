document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const preserveTransparency = document.getElementById('preserve-transparency');
    const conversionInfo = document.getElementById('conversion-info');
    const originalSize = document.getElementById('original-size');
    const convertedSize = document.getElementById('converted-size');
    const convertBtn = document.getElementById('convert-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const uploadArea = document.querySelector('.upload-area');

    let originalImage = null;
    let convertedImage = null;

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

    // Quality slider
    quality.addEventListener('input', function() {
        qualityValue.textContent = `${this.value}%`;
        if (originalImage) {
            convertImage();
        }
    });

    // Preserve transparency toggle
    preserveTransparency.addEventListener('change', function() {
        if (originalImage) {
            convertImage();
        }
    });

    // Convert button click
    convertBtn.addEventListener('click', convertImage);

    // Download button click
    downloadBtn.addEventListener('click', function() {
        if (convertedImage) {
            const link = document.createElement('a');
            const fileName = imageInput.files[0].name.replace('.webp', '.png');
            link.download = fileName;
            link.href = convertedImage;
            link.click();
        }
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        imageInput.value = '';
        previewContainer.classList.add('d-none');
        conversionInfo.classList.add('d-none');
        convertedImage = null;
        convertBtn.disabled = true;
        downloadBtn.disabled = true;
        resetBtn.disabled = true;
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/webp')) {
            alert('Please select a WebP image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove('d-none');
            
            // Store original image
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = function() {
                // Show original size
                originalSize.textContent = formatFileSize(file.size);
                conversionInfo.classList.remove('d-none');
                
                // Enable buttons
                convertBtn.disabled = false;
                resetBtn.disabled = false;
                
                // Convert image
                convertImage();
            };
        };
        reader.readAsDataURL(file);
    }

    function convertImage() {
        if (!originalImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match image
        canvas.width = originalImage.naturalWidth;
        canvas.height = originalImage.naturalHeight;
        
        // Draw image
        ctx.drawImage(originalImage, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply quality reduction if needed
        if (quality.value < 100) {
            const qualityFactor = quality.value / 100;
            for (let i = 0; i < data.length; i += 4) {
                // Only reduce quality for non-transparent pixels if transparency is preserved
                if (preserveTransparency.checked && data[i + 3] === 0) continue;
                
                data[i] = Math.round(data[i] * qualityFactor);     // Red
                data[i + 1] = Math.round(data[i + 1] * qualityFactor); // Green
                data[i + 2] = Math.round(data[i + 2] * qualityFactor); // Blue
            }
            ctx.putImageData(imageData, 0, 0);
        }
        
        // Convert to PNG
        convertedImage = canvas.toDataURL('image/png');
        
        // Update preview
        imagePreview.src = convertedImage;
        
        // Show converted size
        const base64Length = convertedImage.length - convertedImage.indexOf(',') - 1;
        const convertedFileSize = Math.ceil(base64Length * 0.75);
        convertedSize.textContent = formatFileSize(convertedFileSize);
        
        // Enable download button
        downloadBtn.disabled = false;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 