document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const frameDelay = document.getElementById('frame-delay');
    const frameDelayValue = document.getElementById('frame-delay-value');
    const loopCount = document.getElementById('loop-count');
    const width = document.getElementById('width');
    const height = document.getElementById('height');
    const maintainAspectRatio = document.getElementById('maintain-aspect-ratio');
    const createGifBtn = document.getElementById('create-gif-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const uploadArea = document.querySelector('.upload-area');

    let images = [];
    let gif = null;

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

    // Frame delay slider
    frameDelay.addEventListener('input', function() {
        frameDelayValue.textContent = `${this.value}ms`;
    });

    // Width/height inputs
    width.addEventListener('input', function() {
        if (maintainAspectRatio.checked && images.length > 0) {
            const aspectRatio = images[0].naturalHeight / images[0].naturalWidth;
            height.value = Math.round(this.value * aspectRatio);
        }
    });

    height.addEventListener('input', function() {
        if (maintainAspectRatio.checked && images.length > 0) {
            const aspectRatio = images[0].naturalWidth / images[0].naturalHeight;
            width.value = Math.round(this.value * aspectRatio);
        }
    });

    // Create GIF button click
    createGifBtn.addEventListener('click', createGif);

    // Download button click
    downloadBtn.addEventListener('click', function() {
        if (gif) {
            const link = document.createElement('a');
            link.download = 'animated.gif';
            link.href = URL.createObjectURL(gif);
            link.click();
            URL.revokeObjectURL(link.href);
        }
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        imageInput.value = '';
        previewContainer.classList.add('d-none');
        imagePreview.innerHTML = '';
        images = [];
        gif = null;
        createGifBtn.disabled = true;
        downloadBtn.disabled = true;
        resetBtn.disabled = true;
    });

    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Clear previous images
        imagePreview.innerHTML = '';
        images = [];

        // Load and preview images
        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert('Please select only image files');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    // Add to preview
                    const previewImg = document.createElement('img');
                    previewImg.src = e.target.result;
                    previewImg.className = 'img-thumbnail';
                    previewImg.style.maxWidth = '150px';
                    imagePreview.appendChild(previewImg);

                    // Store original image
                    images.push(img);

                    // Update dimensions if first image
                    if (images.length === 1) {
                        width.value = img.naturalWidth;
                        height.value = img.naturalHeight;
                    }

                    // Show preview container and enable buttons
                    previewContainer.classList.remove('d-none');
                    createGifBtn.disabled = false;
                    resetBtn.disabled = false;
                };
            };
            reader.readAsDataURL(file);
        });
    }

    function createGif() {
        if (images.length === 0) return;

        createGifBtn.disabled = true;
        createGifBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...';

        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: parseInt(width.value),
            height: parseInt(height.value),
            workerScript: 'https://cdn.jsdelivr.net/npm/gif.js.optimized@1.0.1/dist/gif.worker.js'
        });

        // Add frames
        images.forEach(img => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = parseInt(width.value);
            canvas.height = parseInt(height.value);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            gif.addFrame(canvas, { delay: parseInt(frameDelay.value) });
        });

        // Set loop count
        gif.setOption('loop', parseInt(loopCount.value));

        // Render GIF
        gif.on('finished', function(blob) {
            this.gif = blob;
            createGifBtn.disabled = false;
            createGifBtn.innerHTML = '<i class="bi bi-play-circle"></i> Create GIF';
            downloadBtn.disabled = false;
        });

        gif.render();
    }
}); 