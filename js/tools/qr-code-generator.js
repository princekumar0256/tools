document.addEventListener('DOMContentLoaded', function() {
    const contentType = document.getElementById('content-type');
    const urlInput = document.getElementById('url-input');
    const textInput = document.getElementById('text-input');
    const contactInput = document.getElementById('contact-input');
    const url = document.getElementById('url');
    const text = document.getElementById('text');
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const size = document.getElementById('size');
    const sizeValue = document.getElementById('size-value');
    const errorCorrection = document.getElementById('error-correction');
    const foregroundColor = document.getElementById('foreground-color');
    const backgroundColor = document.getElementById('background-color');
    const addLogo = document.getElementById('add-logo');
    const logoUpload = document.getElementById('logo-upload');
    const logo = document.getElementById('logo');
    const qrCode = document.getElementById('qr-code');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    let logoImage = null;

    // Content type change
    contentType.addEventListener('change', function() {
        document.querySelectorAll('.content-input').forEach(input => {
            input.classList.add('d-none');
        });
        document.getElementById(`${this.value}-input`).classList.remove('d-none');
    });

    // Size slider
    size.addEventListener('input', function() {
        sizeValue.textContent = `${this.value}px`;
        if (qrCode.getContext('2d')) {
            generateQRCode();
        }
    });

    // Logo upload
    logo.addEventListener('change', function() {
        if (this.files.length) {
            const reader = new FileReader();
            reader.onload = function(e) {
                logoImage = new Image();
                logoImage.src = e.target.result;
                logoImage.onload = function() {
                    if (qrCode.getContext('2d')) {
                        generateQRCode();
                    }
                };
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Add logo toggle
    addLogo.addEventListener('change', function() {
        logoUpload.style.display = this.checked ? 'block' : 'none';
        if (qrCode.getContext('2d')) {
            generateQRCode();
        }
    });

    // Generate button click
    generateBtn.addEventListener('click', generateQRCode);

    // Download button click
    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = qrCode.toDataURL('image/png');
        link.click();
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        contentType.value = 'url';
        url.value = '';
        text.value = '';
        name.value = '';
        phone.value = '';
        email.value = '';
        address.value = '';
        size.value = 200;
        sizeValue.textContent = '200px';
        errorCorrection.value = 'M';
        foregroundColor.value = '#000000';
        backgroundColor.value = '#ffffff';
        addLogo.checked = true;
        logo.value = '';
        logoImage = null;
        document.querySelectorAll('.content-input').forEach(input => {
            input.classList.add('d-none');
        });
        urlInput.classList.remove('d-none');
        downloadBtn.disabled = true;
        qrCode.getContext('2d').clearRect(0, 0, qrCode.width, qrCode.height);
    });

    function generateQRCode() {
        let content = '';
        switch (contentType.value) {
            case 'url':
                content = url.value;
                break;
            case 'text':
                content = text.value;
                break;
            case 'contact':
                content = `BEGIN:VCARD\nVERSION:3.0\nFN:${name.value}\nTEL:${phone.value}\nEMAIL:${email.value}\nADR:${address.value}\nEND:VCARD`;
                break;
        }

        if (!content) {
            alert('Please enter content for the QR code');
            return;
        }

        // Set canvas size
        qrCode.width = parseInt(size.value);
        qrCode.height = parseInt(size.value);

        // Generate QR code
        QRCode.toCanvas(qrCode, content, {
            width: parseInt(size.value),
            margin: 1,
            color: {
                dark: foregroundColor.value,
                light: backgroundColor.value
            },
            errorCorrectionLevel: errorCorrection.value
        }, function(error) {
            if (error) {
                console.error(error);
                alert('Error generating QR code');
                return;
            }

            // Add logo if enabled
            if (addLogo.checked && logoImage) {
                const ctx = qrCode.getContext('2d');
                const logoSize = qrCode.width * 0.2;
                const logoX = (qrCode.width - logoSize) / 2;
                const logoY = (qrCode.height - logoSize) / 2;
                ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            }

            // Enable download button
            downloadBtn.disabled = false;
        });
    }
}); 