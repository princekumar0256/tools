document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('backlink-form');
    const results = document.getElementById('results');
    const totalLinks = document.getElementById('total-links');
    const dofollowLinks = document.getElementById('dofollow-links');
    const nofollowLinks = document.getElementById('nofollow-links');
    const avgDa = document.getElementById('avg-da');

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        checkBacklinks();
    });

    async function checkBacklinks() {
        const url = document.getElementById('url').value.trim();
        const maxResults = parseInt(document.getElementById('max-results').value);
        const minDa = parseInt(document.getElementById('min-da').value);
        const includeNofollow = document.getElementById('follow-links').checked;

        // Validate URL
        if (!url.match(/^https?:\/\/.+/)) {
            alert('Please enter a valid URL starting with http:// or https://');
            return;
        }

        // Clear previous results
        results.innerHTML = '';
        let total = 0;
        let dofollow = 0;
        let nofollow = 0;
        let daSum = 0;

        try {
            const backlinks = await getBacklinks(url, maxResults, minDa, includeNofollow);
            
            if (backlinks.length === 0) {
                results.innerHTML = '<tr><td colspan="5" class="text-center">No backlinks found</td></tr>';
                return;
            }

            backlinks.forEach(link => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="${link.sourceUrl}" target="_blank">${link.sourceUrl}</a></td>
                    <td>${link.anchorText}</td>
                    <td>${link.da.toFixed(1)}</td>
                    <td>${link.type}</td>
                    <td>${new Date(link.foundDate).toLocaleDateString()}</td>
                `;
                results.appendChild(row);

                total++;
                if (link.type === 'dofollow') {
                    dofollow++;
                } else {
                    nofollow++;
                }
                daSum += link.da;
            });

            // Update statistics
            totalLinks.textContent = total;
            dofollowLinks.textContent = dofollow;
            nofollowLinks.textContent = nofollow;
            avgDa.textContent = (daSum / total).toFixed(1);
        } catch (error) {
            console.error('Error checking backlinks:', error);
            results.innerHTML = '<tr><td colspan="5" class="text-warning">Error checking backlinks</td></tr>';
        }
    }

    async function getBacklinks(url, maxResults, minDa, includeNofollow) {
        // Note: This is a simplified version. In a real implementation,
        // you would need to use a backlink API service like Ahrefs,
        // Moz, or SEMrush.
        
        // For demonstration purposes, we'll simulate the check
        // with random data
        const backlinks = [];
        const count = Math.min(maxResults, Math.floor(Math.random() * 50) + 10);
        
        for (let i = 0; i < count; i++) {
            const da = Math.random() * 100;
            if (da >= minDa) {
                backlinks.push({
                    sourceUrl: `https://example${i}.com/page${i}`,
                    anchorText: `Link ${i + 1}`,
                    da: da,
                    type: Math.random() > 0.3 ? 'dofollow' : 'nofollow',
                    foundDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
                });
            }
        }

        // Filter nofollow links if needed
        return includeNofollow ? backlinks : backlinks.filter(link => link.type === 'dofollow');
    }
}); 