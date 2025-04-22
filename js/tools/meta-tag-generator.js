document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('meta-tag-form');
    const generatedTags = document.getElementById('generated-tags');
    const copyBtn = document.getElementById('copy-btn');

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateMetaTags();
    });

    // Copy button click
    copyBtn.addEventListener('click', function() {
        generatedTags.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    });

    // Auto-fill OG and Twitter fields when basic info changes
    document.getElementById('title').addEventListener('input', function() {
        const ogTitle = document.getElementById('og-title');
        const twitterTitle = document.getElementById('twitter-title');
        if (!ogTitle.value) ogTitle.value = this.value;
        if (!twitterTitle.value) twitterTitle.value = this.value;
    });

    document.getElementById('description').addEventListener('input', function() {
        const ogDescription = document.getElementById('og-description');
        const twitterDescription = document.getElementById('twitter-description');
        if (!ogDescription.value) ogDescription.value = this.value;
        if (!twitterDescription.value) twitterDescription.value = this.value;
    });

    function generateMetaTags() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const keywords = document.getElementById('keywords').value;
        const author = document.getElementById('author').value;
        const viewport = document.getElementById('viewport').value;
        const robots = document.getElementById('robots').value;

        // Open Graph
        const ogTitle = document.getElementById('og-title').value;
        const ogDescription = document.getElementById('og-description').value;
        const ogImage = document.getElementById('og-image').value;
        const ogUrl = document.getElementById('og-url').value;

        // Twitter Card
        const twitterCard = document.getElementById('twitter-card').value;
        const twitterTitle = document.getElementById('twitter-title').value;
        const twitterDescription = document.getElementById('twitter-description').value;
        const twitterImage = document.getElementById('twitter-image').value;

        let tags = '';

        // Basic meta tags
        tags += `<title>${escapeHtml(title)}</title>\n`;
        tags += `<meta name="description" content="${escapeHtml(description)}">\n`;
        if (keywords) tags += `<meta name="keywords" content="${escapeHtml(keywords)}">\n`;
        if (author) tags += `<meta name="author" content="${escapeHtml(author)}">\n`;
        tags += `<meta name="viewport" content="${escapeHtml(viewport)}">\n`;
        tags += `<meta name="robots" content="${escapeHtml(robots)}">\n\n`;

        // Open Graph tags
        if (ogTitle) tags += `<meta property="og:title" content="${escapeHtml(ogTitle)}">\n`;
        if (ogDescription) tags += `<meta property="og:description" content="${escapeHtml(ogDescription)}">\n`;
        if (ogImage) tags += `<meta property="og:image" content="${escapeHtml(ogImage)}">\n`;
        if (ogUrl) tags += `<meta property="og:url" content="${escapeHtml(ogUrl)}">\n`;
        tags += `<meta property="og:type" content="website">\n\n`;

        // Twitter Card tags
        tags += `<meta name="twitter:card" content="${escapeHtml(twitterCard)}">\n`;
        if (twitterTitle) tags += `<meta name="twitter:title" content="${escapeHtml(twitterTitle)}">\n`;
        if (twitterDescription) tags += `<meta name="twitter:description" content="${escapeHtml(twitterDescription)}">\n`;
        if (twitterImage) tags += `<meta name="twitter:image" content="${escapeHtml(twitterImage)}">\n`;

        generatedTags.value = tags;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}); 