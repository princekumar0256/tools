document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const pageSize = document.getElementById('page-size');
    const orientation = document.getElementById('orientation');
    const margin = document.getElementById('margin');
    const marginValue = document.getElementById('margin-value');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const fitToPage = document.getElementById('fit-to-page');
    const addPageNumbers = document.getElementById('add-page-numbers');
    const convertBtn = document.getElementById('convert-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const uploadArea = document.querySelector('.upload-area');

    let images = [];
    let pdf = null;

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

    // Margin slider
    margin.addEventListener('input', function() {
        marginValue.textContent = `${this.value}mm`;
    });

    // Quality slider
    quality.addEventListener('input', function() {
        qualityValue.textContent = `${this.value}%`;
    });

    // Convert button click
    convertBtn.addEventListener('click', convertToPDF);

    // Download button click
    downloadBtn.addEventListener('click', function() {
        if (pdf) {
            pdf.save('screenshots.pdf');
        }
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        imageInput.value = '';
        previewContainer.classList.add('d-none');
        imagePreview.innerHTML = '';
        images = [];
        pdf = null;
        convertBtn.disabled = true;
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

                    // Show preview container and enable buttons
                    previewContainer.classList.remove('d-none');
                    convertBtn.disabled = false;
                    resetBtn.disabled = false;
                };
            };
            reader.readAsDataURL(file);
        });
    }

    function convertToPDF() {
        if (images.length === 0) return;

        convertBtn.disabled = true;
        convertBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Converting...';

        // Initialize PDF
        const { jsPDF } = window.jspdf;
        pdf = new jsPDF({
            orientation: orientation.value,
            unit: 'mm',
            format: pageSize.value
        });

        // Get page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const marginSize = parseInt(margin.value);

        // Calculate available space for images
        const availableWidth = pageWidth - (marginSize * 2);
        const availableHeight = pageHeight - (marginSize * 2);

        // Process each image
        images.forEach((img, index) => {
            if (index > 0) {
                pdf.addPage();
            }

            let imgWidth = img.naturalWidth;
            let imgHeight = img.naturalHeight;

            // Calculate dimensions to fit page if needed
            if (fitToPage.checked) {
                const widthRatio = availableWidth / imgWidth;
                const heightRatio = availableHeight / imgHeight;
                const ratio = Math.min(widthRatio, heightRatio);

                imgWidth *= ratio;
                imgHeight *= ratio;
            }

            // Calculate position to center image
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            // Add image to PDF
            pdf.addImage(
                img,
                'JPEG',
                x,
                y,
                imgWidth,
                imgHeight,
                null,
                'FAST'
            );

            // Add page number if enabled
            if (addPageNumbers.checked) {
                pdf.setFontSize(10);
                pdf.text(
                    `Page ${index + 1} of ${images.length}`,
                    pageWidth / 2,
                    pageHeight - marginSize / 2,
                    { align: 'center' }
                );
            }
        });

        // Enable download button
        downloadBtn.disabled = false;
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Convert to PDF';
    }
}); 