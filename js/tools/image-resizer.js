document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const originalWidthInput = document.getElementById('original-width');
    const originalHeightInput = document.getElementById('original-height');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainRatio = document.getElementById('maintain-ratio');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const resizeBtn = document.getElementById('resize-btn');
    const downloadBtn = document.getElementById('download-btn');
    const uploadArea = document.querySelector('.upload-area');
    const presetButtons = document.querySelectorAll('.preset-btn');

    let originalImage = null;
    let resizedImage = null;

    // Update quality value display
    qualitySlider.addEventListener('input', function() {
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

    // Handle aspect ratio
    widthInput.addEventListener('input', function() {
        if (maintainRatio.checked && originalImage) {
            const ratio = originalImage.naturalHeight / originalImage.naturalWidth;
            heightInput.value = Math.round(this.value * ratio);
        }
    });

    heightInput.addEventListener('input', function() {
        if (maintainRatio.checked && originalImage) {
            const ratio = originalImage.naturalWidth / originalImage.naturalHeight;
            widthInput.value = Math.round(this.value * ratio);
        }
    });

    // Handle preset buttons
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const width = parseInt(this.dataset.width);
            const height = parseInt(this.dataset.height);
            
            if (maintainRatio.checked && originalImage) {
                const ratio = originalImage.naturalWidth / originalImage.naturalHeight;
                if (width / height > ratio) {
                    widthInput.value = Math.round(height * ratio);
                    heightInput.value = height;
                } else {
                    widthInput.value = width;
                    heightInput.value = Math.round(width / ratio);
                }
            } else {
                widthInput.value = width;
                heightInput.value = height;
            }
        });
    });

    // Resize button click
    resizeBtn.addEventListener('click', resizeImage);

    // Download button click
    downloadBtn.addEventListener('click', function() {
        if (resizedImage) {
            const link = document.createElement('a');
            link.download = 'resized-image.png';
            link.href = resizedImage;
            link.click();
        }
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
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
                originalWidthInput.value = this.naturalWidth;
                originalHeightInput.value = this.naturalHeight;
                widthInput.value = this.naturalWidth;
                heightInput.value = this.naturalHeight;
                resizeBtn.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }

    function resizeImage() {
        if (!originalImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        const width = widthInput.value || originalImage.naturalWidth;
        const height = heightInput.value || originalImage.naturalHeight;
        canvas.width = width;
        canvas.height = height;

        // Draw image
        ctx.drawImage(originalImage, 0, 0, width, height);

        // Convert to image
        const quality = qualitySlider.value / 100;
        resizedImage = canvas.toDataURL('image/png', quality);
        
        // Update preview
        imagePreview.src = resizedImage;
        downloadBtn.disabled = false;
    }
}); 