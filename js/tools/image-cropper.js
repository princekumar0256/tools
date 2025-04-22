document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const cropOverlay = document.getElementById('crop-overlay');
    const aspectRatio = document.getElementById('aspect-ratio');
    const cropWidth = document.getElementById('crop-width');
    const cropHeight = document.getElementById('crop-height');
    const showGrid = document.getElementById('show-grid');
    const cropBtn = document.getElementById('crop-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const uploadArea = document.querySelector('.upload-area');

    let originalImage = null;
    let croppedImage = null;
    let isDragging = false;
    let startX, startY;
    let currentAspectRatio = null;

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

    // Crop overlay events
    cropOverlay.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', dragCropOverlay);
    document.addEventListener('mouseup', stopDragging);

    // Aspect ratio change
    aspectRatio.addEventListener('change', function() {
        const ratio = this.value;
        if (ratio === 'free') {
            currentAspectRatio = null;
        } else {
            const [w, h] = ratio.split(':').map(Number);
            currentAspectRatio = w / h;
            updateCropOverlayAspectRatio();
        }
    });

    // Show grid toggle
    showGrid.addEventListener('change', function() {
        cropOverlay.classList.toggle('show-grid', this.checked);
    });

    // Crop button click
    cropBtn.addEventListener('click', function() {
        if (!originalImage) return;
        cropImage();
    });

    // Download button click
    downloadBtn.addEventListener('click', function() {
        if (croppedImage) {
            const link = document.createElement('a');
            link.download = `cropped-${imageInput.files[0].name}`;
            link.href = croppedImage;
            link.click();
        }
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        imageInput.value = '';
        previewContainer.classList.add('d-none');
        croppedImage = null;
        cropBtn.disabled = true;
        downloadBtn.disabled = true;
        resetBtn.disabled = true;
        resetCropOverlay();
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
                resetCropOverlay();
                cropBtn.disabled = false;
                resetBtn.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }

    function startDragging(e) {
        isDragging = true;
        startX = e.clientX - cropOverlay.offsetLeft;
        startY = e.clientY - cropOverlay.offsetTop;
        cropOverlay.style.cursor = 'grabbing';
    }

    function dragCropOverlay(e) {
        if (!isDragging) return;

        const previewRect = imagePreview.getBoundingClientRect();
        const maxX = previewRect.width - cropOverlay.offsetWidth;
        const maxY = previewRect.height - cropOverlay.offsetHeight;

        let newX = e.clientX - startX;
        let newY = e.clientY - startY;

        // Constrain to preview boundaries
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        cropOverlay.style.left = `${newX}px`;
        cropOverlay.style.top = `${newY}px`;

        updateCropDimensions();
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;
        cropOverlay.style.cursor = 'grab';
    }

    function updateCropOverlayAspectRatio() {
        if (!currentAspectRatio) return;

        const width = cropOverlay.offsetWidth;
        const newHeight = width / currentAspectRatio;
        
        cropOverlay.style.height = `${newHeight}px`;
        updateCropDimensions();
    }

    function updateCropDimensions() {
        cropWidth.value = Math.round(cropOverlay.offsetWidth);
        cropHeight.value = Math.round(cropOverlay.offsetHeight);
    }

    function resetCropOverlay() {
        const previewRect = imagePreview.getBoundingClientRect();
        const size = Math.min(previewRect.width, previewRect.height) * 0.5;
        
        cropOverlay.style.width = `${size}px`;
        cropOverlay.style.height = `${size}px`;
        cropOverlay.style.left = `${(previewRect.width - size) / 2}px`;
        cropOverlay.style.top = `${(previewRect.height - size) / 2}px`;
        
        updateCropDimensions();
    }

    function cropImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match crop area
        canvas.width = cropOverlay.offsetWidth;
        canvas.height = cropOverlay.offsetHeight;
        
        // Calculate source coordinates
        const previewRect = imagePreview.getBoundingClientRect();
        const scaleX = originalImage.naturalWidth / previewRect.width;
        const scaleY = originalImage.naturalHeight / previewRect.height;
        
        const sx = cropOverlay.offsetLeft * scaleX;
        const sy = cropOverlay.offsetTop * scaleY;
        const sw = cropOverlay.offsetWidth * scaleX;
        const sh = cropOverlay.offsetHeight * scaleY;
        
        // Draw cropped image
        ctx.drawImage(originalImage, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        
        // Update preview and store cropped image
        croppedImage = canvas.toDataURL('image/png');
        imagePreview.src = croppedImage;
        downloadBtn.disabled = false;
    }
}); 