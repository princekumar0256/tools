document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('speed-form');
    const metrics = document.getElementById('metrics');
    const recommendations = document.getElementById('recommendations');
    const performanceScore = document.getElementById('performance-score');
    const accessibilityScore = document.getElementById('accessibility-score');
    const bestPracticesScore = document.getElementById('best-practices-score');
    const seoScore = document.getElementById('seo-score');

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        checkPageSpeed();
    });

    async function checkPageSpeed() {
        const url = document.getElementById('url').value.trim();
        const strategy = document.getElementById('strategy').value;
        const category = document.getElementById('category').value;

        // Validate URL
        if (!url.match(/^https?:\/\/.+/)) {
            alert('Please enter a valid URL starting with http:// or https://');
            return;
        }

        try {
            const results = await getPageSpeedResults(url, strategy, category);
            
            // Update scores
            performanceScore.textContent = results.scores.performance;
            accessibilityScore.textContent = results.scores.accessibility;
            bestPracticesScore.textContent = results.scores.bestPractices;
            seoScore.textContent = results.scores.seo;

            // Update metrics
            metrics.innerHTML = '';
            results.metrics.forEach(metric => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${metric.name}</td>
                    <td>${metric.value}</td>
                    <td><span class="badge bg-${getStatusClass(metric.status)}">${metric.status}</span></td>
                `;
                metrics.appendChild(row);
            });

            // Update recommendations
            recommendations.innerHTML = '';
            if (results.recommendations.length === 0) {
                recommendations.innerHTML = '<p class="text-success">No recommendations needed. Your page is performing well!</p>';
            } else {
                const list = document.createElement('ul');
                list.className = 'list-group';
                results.recommendations.forEach(rec => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item';
                    item.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center">
                            <span>${rec.title}</span>
                            <span class="badge bg-${getImpactClass(rec.impact)}">${rec.impact}</span>
                        </div>
                        <small class="text-muted">${rec.description}</small>
                    `;
                    list.appendChild(item);
                });
                recommendations.appendChild(list);
            }
        } catch (error) {
            console.error('Error checking page speed:', error);
            metrics.innerHTML = '<tr><td colspan="3" class="text-warning">Error checking page speed</td></tr>';
            recommendations.innerHTML = '<p class="text-warning">Error checking page speed</p>';
        }
    }

    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'good': return 'success';
            case 'needs improvement': return 'warning';
            case 'poor': return 'danger';
            default: return 'secondary';
        }
    }

    function getImpactClass(impact) {
        switch (impact.toLowerCase()) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'secondary';
        }
    }

    async function getPageSpeedResults(url, strategy, category) {
        // Note: This is a simplified version. In a real implementation,
        // you would need to use the Google PageSpeed Insights API
        // or a similar service.
        
        // For demonstration purposes, we'll simulate the check
        // with random data
        return {
            scores: {
                performance: Math.floor(Math.random() * 100),
                accessibility: Math.floor(Math.random() * 100),
                bestPractices: Math.floor(Math.random() * 100),
                seo: Math.floor(Math.random() * 100)
            },
            metrics: [
                {
                    name: 'First Contentful Paint',
                    value: `${(Math.random() * 3).toFixed(2)}s`,
                    status: Math.random() > 0.5 ? 'Good' : 'Needs Improvement'
                },
                {
                    name: 'Speed Index',
                    value: `${(Math.random() * 4).toFixed(2)}s`,
                    status: Math.random() > 0.5 ? 'Good' : 'Needs Improvement'
                },
                {
                    name: 'Largest Contentful Paint',
                    value: `${(Math.random() * 5).toFixed(2)}s`,
                    status: Math.random() > 0.5 ? 'Good' : 'Needs Improvement'
                },
                {
                    name: 'Time to Interactive',
                    value: `${(Math.random() * 6).toFixed(2)}s`,
                    status: Math.random() > 0.5 ? 'Good' : 'Needs Improvement'
                },
                {
                    name: 'Total Blocking Time',
                    value: `${(Math.random() * 500).toFixed(0)}ms`,
                    status: Math.random() > 0.5 ? 'Good' : 'Needs Improvement'
                },
                {
                    name: 'Cumulative Layout Shift',
                    value: `${(Math.random() * 0.3).toFixed(2)}`,
                    status: Math.random() > 0.5 ? 'Good' : 'Needs Improvement'
                }
            ],
            recommendations: [
                {
                    title: 'Optimize Images',
                    description: 'Compress and resize images to reduce their file size.',
                    impact: 'High'
                },
                {
                    title: 'Enable Compression',
                    description: 'Enable text compression for your resources.',
                    impact: 'Medium'
                },
                {
                    title: 'Minify CSS',
                    description: 'Remove unnecessary characters from your CSS files.',
                    impact: 'Low'
                }
            ]
        };
    }
}); 