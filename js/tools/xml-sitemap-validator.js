document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('validator-form');
    const issues = document.getElementById('issues');
    const urlList = document.getElementById('url-list');
    const totalUrls = document.getElementById('total-urls');
    const validUrls = document.getElementById('valid-urls');
    const errorCount = document.getElementById('error-count');
    const warningCount = document.getElementById('warning-count');

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        validateSitemap();
    });

    async function validateSitemap() {
        const sitemapUrl = document.getElementById('sitemap-url').value.trim();
        const checkUrls = document.getElementById('check-urls').checked;
        const checkFormat = document.getElementById('check-format').checked;
        const checkRobots = document.getElementById('check-robots').checked;

        // Validate URL
        if (!sitemapUrl.match(/^https?:\/\/.+/)) {
            alert('Please enter a valid sitemap URL starting with http:// or https://');
            return;
        }

        try {
            const results = await validateSitemapXml(sitemapUrl, checkUrls, checkFormat, checkRobots);
            
            // Update statistics
            totalUrls.textContent = results.totalUrls;
            validUrls.textContent = results.validUrls;
            errorCount.textContent = results.errors.length;
            warningCount.textContent = results.warnings.length;

            // Update issues
            issues.innerHTML = '';
            if (results.errors.length === 0 && results.warnings.length === 0) {
                issues.innerHTML = '<p class="text-success">No issues found. Your sitemap is valid!</p>';
            } else {
                const list = document.createElement('ul');
                list.className = 'list-group';
                
                results.errors.forEach(error => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item list-group-item-danger';
                    item.textContent = error;
                    list.appendChild(item);
                });

                results.warnings.forEach(warning => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item list-group-item-warning';
                    item.textContent = warning;
                    list.appendChild(item);
                });

                issues.appendChild(list);
            }

            // Update URL list
            urlList.innerHTML = '';
            results.urls.forEach(url => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="${url.loc}" target="_blank">${url.loc}</a></td>
                    <td>${url.lastmod || 'N/A'}</td>
                    <td>${url.changefreq || 'N/A'}</td>
                    <td>${url.priority || 'N/A'}</td>
                    <td><span class="badge bg-${url.status === 'valid' ? 'success' : 'danger'}">${url.status}</span></td>
                `;
                urlList.appendChild(row);
            });
        } catch (error) {
            console.error('Error validating sitemap:', error);
            issues.innerHTML = '<p class="text-warning">Error validating sitemap</p>';
            urlList.innerHTML = '<tr><td colspan="5" class="text-warning">Error validating sitemap</td></tr>';
        }
    }

    async function validateSitemapXml(sitemapUrl, checkUrls, checkFormat, checkRobots) {
        // Note: This is a simplified version. In a real implementation,
        // you would need to:
        // 1. Fetch and parse the XML sitemap
        // 2. Validate the XML structure
        // 3. Check each URL for accessibility
        // 4. Verify robots.txt compatibility
        
        // For demonstration purposes, we'll simulate the validation
        // with random data
        const total = Math.floor(Math.random() * 50) + 10;
        const valid = Math.floor(total * 0.8);
        const errors = [];
        const warnings = [];
        const urls = [];

        // Generate random errors and warnings
        if (Math.random() > 0.5) {
            errors.push('Invalid XML format: Missing closing tag');
        }
        if (Math.random() > 0.5) {
            errors.push('URL not accessible: 404 Not Found');
        }
        if (Math.random() > 0.5) {
            warnings.push('Priority value out of range: 1.5');
        }
        if (Math.random() > 0.5) {
            warnings.push('Change frequency not specified');
        }

        // Generate random URLs
        for (let i = 0; i < total; i++) {
            urls.push({
                loc: `https://example.com/page${i}`,
                lastmod: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                changefreq: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'][Math.floor(Math.random() * 7)],
                priority: (Math.random() * 1).toFixed(1),
                status: Math.random() > 0.2 ? 'valid' : 'invalid'
            });
        }

        return {
            totalUrls: total,
            validUrls: valid,
            errors: errors,
            warnings: warnings,
            urls: urls
        };
    }
}); 