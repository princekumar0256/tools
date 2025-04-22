document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainRatio = document.getElementById('maintain-ratio');
    const convertBtn = document.getElementById('convert-btn');
    const downloadBtn = document.getElementById('download-btn');
    const uploadArea = document.querySelector('.upload-area');

    let originalImage = null;
    let convertedImage = null;

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

    // Convert button click
    convertBtn.addEventListener('click', convertToPNG);

    // Download button click
    downloadBtn.addEventListener('click', function() {
        if (convertedImage) {
            const link = document.createElement('a');
            link.download = 'converted-image.png';
            link.href = convertedImage;
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
                widthInput.value = this.naturalWidth;
                heightInput.value = this.naturalHeight;
                convertBtn.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }

    function convertToPNG() {
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

        // Convert to PNG
        const quality = qualitySlider.value / 100;
        convertedImage = canvas.toDataURL('image/png', quality);
        
        // Update preview
        imagePreview.src = convertedImage;
        downloadBtn.disabled = false;
    }
}); 