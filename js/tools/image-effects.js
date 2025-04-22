document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const brightness = document.getElementById('brightness');
    const brightnessValue = document.getElementById('brightness-value');
    const contrast = document.getElementById('contrast');
    const contrastValue = document.getElementById('contrast-value');
    const saturation = document.getElementById('saturation');
    const saturationValue = document.getElementById('saturation-value');
    const hue = document.getElementById('hue');
    const hueValue = document.getElementById('hue-value');
    const blur = document.getElementById('blur');
    const blurValue = document.getElementById('blur-value');
    const grayscale = document.getElementById('grayscale');
    const grayscaleValue = document.getElementById('grayscale-value');
    const sepia = document.getElementById('sepia');
    const sepiaValue = document.getElementById('sepia-value');
    const invert = document.getElementById('invert');
    const invertValue = document.getElementById('invert-value');
    const applyBtn = document.getElementById('apply-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const uploadArea = document.querySelector('.upload-area');
    const presetButtons = document.querySelectorAll('[data-preset]');

    let originalImage = null;
    let ctx = null;

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

    // Update value displays
    brightness.addEventListener('input', function() {
        brightnessValue.textContent = `${this.value}%`;
        applyEffects();
    });

    contrast.addEventListener('input', function() {
        contrastValue.textContent = `${this.value}%`;
        applyEffects();
    });

    saturation.addEventListener('input', function() {
        saturationValue.textContent = `${this.value}%`;
        applyEffects();
    });

    hue.addEventListener('input', function() {
        hueValue.textContent = `${this.value}°`;
        applyEffects();
    });

    blur.addEventListener('input', function() {
        blurValue.textContent = `${this.value}px`;
        applyEffects();
    });

    grayscale.addEventListener('input', function() {
        grayscaleValue.textContent = `${this.value}%`;
        applyEffects();
    });

    sepia.addEventListener('input', function() {
        sepiaValue.textContent = `${this.value}%`;
        applyEffects();
    });

    invert.addEventListener('input', function() {
        invertValue.textContent = `${this.value}%`;
        applyEffects();
    });

    // Preset buttons
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const preset = this.dataset.preset;
            applyPreset(preset);
        });
    });

    // Apply button click
    applyBtn.addEventListener('click', applyEffects);

    // Download button click
    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'image-with-effects.png';
        link.href = imagePreview.toDataURL('image/png');
        link.click();
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        resetValues();
        if (originalImage) {
            ctx.drawImage(originalImage, 0, 0, imagePreview.width, imagePreview.height);
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
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = function() {
                // Set canvas size
                imagePreview.width = originalImage.width;
                imagePreview.height = originalImage.height;
                ctx = imagePreview.getContext('2d');

                // Draw original image
                ctx.drawImage(originalImage, 0, 0);

                // Show preview and enable buttons
                previewContainer.classList.remove('d-none');
                applyBtn.disabled = false;
                resetBtn.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }

    function applyEffects() {
        if (!originalImage) return;

        // Clear canvas
        ctx.clearRect(0, 0, imagePreview.width, imagePreview.height);
        ctx.drawImage(originalImage, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, imagePreview.width, imagePreview.height);
        const data = imageData.data;

        // Apply effects
        for (let i = 0; i < data.length; i += 4) {
            // Brightness
            data[i] *= brightness.value / 100;
            data[i + 1] *= brightness.value / 100;
            data[i + 2] *= brightness.value / 100;

            // Contrast
            const factor = (259 * (contrast.value - 100) + 255) / (255 * (259 - contrast.value));
            data[i] = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;

            // Saturation
            const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
            data[i] = gray + (data[i] - gray) * (saturation.value / 100);
            data[i + 1] = gray + (data[i + 1] - gray) * (saturation.value / 100);
            data[i + 2] = gray + (data[i + 2] - gray) * (saturation.value / 100);

            // Hue rotation
            const h = hue.value * Math.PI / 180;
            const cos = Math.cos(h);
            const sin = Math.sin(h);
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = r * (cos + (1 - cos) / 3) + g * ((1 - cos) / 3 - Math.sqrt(3) * sin / 3) + b * ((1 - cos) / 3 + Math.sqrt(3) * sin / 3);
            data[i + 1] = r * ((1 - cos) / 3 + Math.sqrt(3) * sin / 3) + g * (cos + (1 - cos) / 3) + b * ((1 - cos) / 3 - Math.sqrt(3) * sin / 3);
            data[i + 2] = r * ((1 - cos) / 3 - Math.sqrt(3) * sin / 3) + g * ((1 - cos) / 3 + Math.sqrt(3) * sin / 3) + b * (cos + (1 - cos) / 3);

            // Grayscale
            const grayValue = grayscale.value / 100;
            const grayColor = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
            data[i] = data[i] * (1 - grayValue) + grayColor * grayValue;
            data[i + 1] = data[i + 1] * (1 - grayValue) + grayColor * grayValue;
            data[i + 2] = data[i + 2] * (1 - grayValue) + grayColor * grayValue;

            // Sepia
            const sepiaValue = sepia.value / 100;
            data[i] = data[i] * (1 - sepiaValue) + (data[i] * 0.393 + data[i + 1] * 0.769 + data[i + 2] * 0.189) * sepiaValue;
            data[i + 1] = data[i + 1] * (1 - sepiaValue) + (data[i] * 0.349 + data[i + 1] * 0.686 + data[i + 2] * 0.168) * sepiaValue;
            data[i + 2] = data[i + 2] * (1 - sepiaValue) + (data[i] * 0.272 + data[i + 1] * 0.534 + data[i + 2] * 0.131) * sepiaValue;

            // Invert
            const invertValue = invert.value / 100;
            data[i] = data[i] * (1 - invertValue) + (255 - data[i]) * invertValue;
            data[i + 1] = data[i + 1] * (1 - invertValue) + (255 - data[i + 1]) * invertValue;
            data[i + 2] = data[i + 2] * (1 - invertValue) + (255 - data[i + 2]) * invertValue;
        }

        // Apply blur
        if (blur.value > 0) {
            ctx.filter = `blur(${blur.value}px)`;
            ctx.drawImage(imagePreview, 0, 0);
            ctx.filter = 'none';
        } else {
            ctx.putImageData(imageData, 0, 0);
        }

        // Enable download button
        downloadBtn.disabled = false;
    }

    function applyPreset(preset) {
        switch (preset) {
            case 'vintage':
                brightness.value = 90;
                contrast.value = 90;
                saturation.value = 80;
                sepia.value = 30;
                break;
            case 'black-and-white':
                grayscale.value = 100;
                contrast.value = 120;
                break;
            case 'sepia':
                sepia.value = 100;
                brightness.value = 90;
                break;
            case 'blur':
                blur.value = 5;
                break;
            case 'invert':
                invert.value = 100;
                break;
            case 'high-contrast':
                contrast.value = 150;
                saturation.value = 120;
                break;
        }

        // Update value displays
        brightnessValue.textContent = `${brightness.value}%`;
        contrastValue.textContent = `${contrast.value}%`;
        saturationValue.textContent = `${saturation.value}%`;
        sepiaValue.textContent = `${sepia.value}%`;
        grayscaleValue.textContent = `${grayscale.value}%`;
        blurValue.textContent = `${blur.value}px`;
        invertValue.textContent = `${invert.value}%`;

        // Apply effects
        applyEffects();
    }

    function resetValues() {
        brightness.value = 100;
        contrast.value = 100;
        saturation.value = 100;
        hue.value = 0;
        blur.value = 0;
        grayscale.value = 0;
        sepia.value = 0;
        invert.value = 0;

        // Update value displays
        brightnessValue.textContent = '100%';
        contrastValue.textContent = '100%';
        saturationValue.textContent = '100%';
        hueValue.textContent = '0°';
        blurValue.textContent = '0px';
        grayscaleValue.textContent = '0%';
        sepiaValue.textContent = '0%';
        invertValue.textContent = '0%';

        // Disable download button
        downloadBtn.disabled = true;
    }
}); 