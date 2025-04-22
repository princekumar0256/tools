document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sitemap-form');
    const generatedSitemap = document.getElementById('generated-sitemap');
    const copyBtn = document.getElementById('copy-btn');
    const priority = document.getElementById('priority');
    const priorityValue = document.getElementById('priority-value');

    // Update priority value display
    priority.addEventListener('input', function() {
        priorityValue.textContent = (this.value / 10).toFixed(1);
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateSitemap();
    });

    // Copy button click
    copyBtn.addEventListener('click', function() {
        generatedSitemap.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    });

    function generateSitemap() {
        const baseUrl = document.getElementById('base-url').value;
        const changeFreq = document.getElementById('change-freq').value;
        const priority = (document.getElementById('priority').value / 10).toFixed(1);
        const urls = document.getElementById('urls').value.split('\n').filter(url => url.trim());

        // Validate base URL
        if (!baseUrl.match(/^https?:\/\/.+/)) {
            alert('Please enter a valid base URL starting with http:// or https://');
            return;
        }

        // Clean base URL
        const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

        // Generate XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add URLs
        urls.forEach(url => {
            const cleanUrl = url.trim().replace(/^\/+/, '');
            const fullUrl = `${cleanBaseUrl}/${cleanUrl}`;
            const lastmod = new Date().toISOString().split('T')[0];

            xml += '  <url>\n';
            xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <changefreq>${changeFreq}</changefreq>\n`;
            xml += `    <priority>${priority}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        generatedSitemap.value = xml;
    }

    function escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"]/g, function(c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
    }
}); 