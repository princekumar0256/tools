document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('index-checker-form');
    const results = document.getElementById('results');
    const totalPages = document.getElementById('total-pages');
    const indexedPages = document.getElementById('indexed-pages');
    const notIndexedPages = document.getElementById('not-indexed-pages');
    const checkSite = document.getElementById('check-site');
    const checkPages = document.getElementById('check-pages');
    const pagesContainer = document.getElementById('pages-container');

    // Toggle pages container
    checkPages.addEventListener('change', function() {
        pagesContainer.style.display = this.checked ? 'block' : 'none';
        if (!this.checked) {
            document.getElementById('pages').value = '';
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        checkIndexing();
    });

    async function checkIndexing() {
        const baseUrl = document.getElementById('url').value;
        const checkEntireSite = checkSite.checked;
        const pages = document.getElementById('pages').value.split('\n').filter(page => page.trim());

        // Validate URL
        if (!baseUrl.match(/^https?:\/\/.+/)) {
            alert('Please enter a valid URL starting with http:// or https://');
            return;
        }

        // Clean base URL
        const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

        // Prepare URLs to check
        let urlsToCheck = [];
        if (checkEntireSite) {
            urlsToCheck.push(cleanBaseUrl);
        }
        if (checkPages.checked && pages.length > 0) {
            pages.forEach(page => {
                const cleanPage = page.trim().replace(/^\/+/, '');
                urlsToCheck.push(`${cleanBaseUrl}/${cleanPage}`);
            });
        }

        // Clear previous results
        results.innerHTML = '';
        let indexedCount = 0;
        let notIndexedCount = 0;

        // Check each URL
        for (const url of urlsToCheck) {
            try {
                const isIndexed = await checkGoogleIndex(url);
                const status = isIndexed ? 'Indexed' : 'Not Indexed';
                const statusClass = isIndexed ? 'text-success' : 'text-danger';
                const now = new Date().toLocaleString();

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${url}</td>
                    <td><span class="${statusClass}">${status}</span></td>
                    <td>${now}</td>
                `;
                results.appendChild(row);

                if (isIndexed) {
                    indexedCount++;
                } else {
                    notIndexedCount++;
                }
            } catch (error) {
                console.error('Error checking URL:', url, error);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${url}</td>
                    <td><span class="text-warning">Error</span></td>
                    <td>${new Date().toLocaleString()}</td>
                `;
                results.appendChild(row);
            }
        }

        // Update statistics
        const total = urlsToCheck.length;
        totalPages.textContent = total;
        indexedPages.textContent = indexedCount;
        notIndexedPages.textContent = notIndexedCount;
    }

    async function checkGoogleIndex(url) {
        // Note: This is a simplified version. In a real implementation,
        // you would need to use the Google Search Console API or
        // implement a proper crawling mechanism.
        
        // For demonstration purposes, we'll simulate the check
        // with a random result
        return Math.random() > 0.3; // 70% chance of being indexed
    }
}); 