document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const includeDataUri = document.getElementById('include-data-uri');
    const formatOutput = document.getElementById('format-output');
    const base64Output = document.getElementById('base64-output');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const uploadArea = document.querySelector('.upload-area');

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

    // Copy button click
    copyBtn.addEventListener('click', function() {
        base64Output.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        imageInput.value = '';
        previewContainer.classList.add('d-none');
        base64Output.value = '';
        copyBtn.disabled = true;
        resetBtn.disabled = true;
    });

    // Output options change
    includeDataUri.addEventListener('change', updateBase64Output);
    formatOutput.addEventListener('change', updateBase64Output);

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
            convertToBase64(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function convertToBase64(dataUrl) {
        // Remove the data URI prefix if not needed
        let base64 = dataUrl;
        if (!includeDataUri.checked) {
            base64 = dataUrl.split(',')[1];
        }

        // Format the output if needed
        if (formatOutput.checked) {
            base64 = formatBase64(base64);
        }

        base64Output.value = base64;
        copyBtn.disabled = false;
        resetBtn.disabled = false;
    }

    function formatBase64(base64) {
        // Add line breaks every 76 characters (standard Base64 line length)
        return base64.replace(/(.{76})/g, '$1\n');
    }

    function updateBase64Output() {
        if (base64Output.value) {
            convertToBase64(imagePreview.src);
        }
    }
}); 