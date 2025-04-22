document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('robots-form');
    const generatedRobots = document.getElementById('generated-robots');
    const copyBtn = document.getElementById('copy-btn');
    const allowAll = document.getElementById('allow-all');
    const customAgents = document.getElementById('custom-agents');

    // Toggle custom agents textarea
    allowAll.addEventListener('change', function() {
        customAgents.disabled = this.checked;
        if (this.checked) {
            customAgents.value = '';
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateRobotsTxt();
    });

    // Copy button click
    copyBtn.addEventListener('click', function() {
        generatedRobots.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    });

    function generateRobotsTxt() {
        const sitemapUrl = document.getElementById('sitemap-url').value;
        const disallowedPaths = document.getElementById('disallowed-paths').value.split('\n').filter(path => path.trim());
        const allowedPaths = document.getElementById('allowed-paths').value.split('\n').filter(path => path.trim());
        const crawlDelay = document.getElementById('crawl-delay').value;
        const customAgentsList = customAgents.value.split('\n').filter(agent => agent.trim());

        let robotsTxt = '';

        // Add sitemap
        if (sitemapUrl) {
            robotsTxt += `Sitemap: ${sitemapUrl}\n\n`;
        }

        // Add user agents
        if (allowAll.checked) {
            robotsTxt += 'User-agent: *\n';
        } else if (customAgentsList.length > 0) {
            customAgentsList.forEach(agent => {
                robotsTxt += `User-agent: ${agent}\n`;
            });
        }

        // Add disallowed paths
        if (disallowedPaths.length > 0) {
            disallowedPaths.forEach(path => {
                robotsTxt += `Disallow: ${path.trim()}\n`;
            });
        }

        // Add allowed paths
        if (allowedPaths.length > 0) {
            allowedPaths.forEach(path => {
                robotsTxt += `Allow: ${path.trim()}\n`;
            });
        }

        // Add crawl delay
        if (crawlDelay > 0) {
            robotsTxt += `Crawl-delay: ${crawlDelay}\n`;
        }

        generatedRobots.value = robotsTxt;
    }
}); 