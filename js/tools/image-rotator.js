document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const rotationSlider = document.getElementById('rotation');
    const rotationValue = document.getElementById('rotation-value');
    const rotateButtons = document.querySelectorAll('.rotate-btn');
    const flipButtons = document.querySelectorAll('.flip-btn');
    const maintainQuality = document.getElementById('maintain-quality');
    const backgroundInput = document.getElementById('background');
    const applyBtn = document.getElementById('apply-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const uploadArea = document.querySelector('.upload-area');

    let originalImage = null;
    let currentRotation = 0;
    let isFlippedHorizontal = false;
    let isFlippedVertical = false;

    // Update rotation value display
    rotationSlider.addEventListener('input', function() {
        rotationValue.textContent = `${this.value}°`;
        currentRotation = parseInt(this.value);
        updatePreview();
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

    // Handle rotate buttons
    rotateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const angle = parseInt(this.dataset.angle);
            currentRotation += angle;
            if (currentRotation > 180) currentRotation -= 360;
            if (currentRotation < -180) currentRotation += 360;
            rotationSlider.value = currentRotation;
            rotationValue.textContent = `${currentRotation}°`;
            updatePreview();
        });
    });

    // Handle flip buttons
    flipButtons.forEach(button => {
        button.addEventListener('click', function() {
            const direction = this.dataset.direction;
            if (direction === 'horizontal') {
                isFlippedHorizontal = !isFlippedHorizontal;
            } else {
                isFlippedVertical = !isFlippedVertical;
            }
            updatePreview();
        });
    });

    // Apply button click
    applyBtn.addEventListener('click', function() {
        if (originalImage) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions
            const width = originalImage.naturalWidth;
            const height = originalImage.naturalHeight;
            const angle = currentRotation * Math.PI / 180;
            
            // Set canvas size to accommodate rotation
            canvas.width = Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle));
            canvas.height = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
            
            // Fill background
            ctx.fillStyle = backgroundInput.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Center the image
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(angle);
            
            // Apply flips
            if (isFlippedHorizontal) {
                ctx.scale(-1, 1);
            }
            if (isFlippedVertical) {
                ctx.scale(1, -1);
            }
            
            // Draw image
            ctx.drawImage(originalImage, -width / 2, -height / 2, width, height);
            
            // Update preview
            imagePreview.src = canvas.toDataURL('image/png');
            downloadBtn.disabled = false;
        }
    });

    // Download button click
    downloadBtn.addEventListener('click', function() {
        if (imagePreview.src) {
            const link = document.createElement('a');
            link.download = 'rotated-image.png';
            link.href = imagePreview.src;
            link.click();
        }
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        if (originalImage) {
            currentRotation = 0;
            isFlippedHorizontal = false;
            isFlippedVertical = false;
            rotationSlider.value = 0;
            rotationValue.textContent = '0°';
            imagePreview.src = originalImage.src;
            downloadBtn.disabled = true;
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
                applyBtn.disabled = false;
                resetBtn.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }

    function updatePreview() {
        if (!originalImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        const width = originalImage.naturalWidth;
        const height = originalImage.naturalHeight;
        const angle = currentRotation * Math.PI / 180;
        
        // Set canvas size to accommodate rotation
        canvas.width = Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle));
        canvas.height = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
        
        // Fill background
        ctx.fillStyle = backgroundInput.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center the image
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        
        // Apply flips
        if (isFlippedHorizontal) {
            ctx.scale(-1, 1);
        }
        if (isFlippedVertical) {
            ctx.scale(1, -1);
        }
        
        // Draw image
        ctx.drawImage(originalImage, -width / 2, -height / 2, width, height);
        
        // Update preview
        imagePreview.src = canvas.toDataURL('image/png');
    }
}); 