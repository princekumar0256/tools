document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mobile-test-form');
    const urlInput = document.getElementById('url');
    const deviceSelect = document.getElementById('device');
    const orientationSelect = document.getElementById('orientation');
    const mobileFriendlyElement = document.getElementById('mobile-friendly');
    const viewportElement = document.getElementById('viewport');
    const textSizeElement = document.getElementById('text-size');
    const tapTargetsElement = document.getElementById('tap-targets');
    const issuesElement = document.getElementById('issues');
    const screenshotContainer = document.getElementById('screenshot-container');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        const device = deviceSelect.value;
        const orientation = orientationSelect.value;

        if (!url) {
            showError('Please enter a valid URL');
            return;
        }

        try {
            // Simulate mobile-friendly test
            const results = await testMobileFriendly(url, device, orientation);
            
            // Update results
            updateResults(results);
            
            // Update screenshot (simulated)
            updateScreenshot(url, device, orientation);
        } catch (error) {
            showError('Error testing mobile-friendliness: ' + error.message);
        }
    });

    form.addEventListener('reset', () => {
        resetResults();
    });

    function updateResults(results) {
        // Update status indicators
        mobileFriendlyElement.textContent = results.mobileFriendly ? 'Yes' : 'No';
        mobileFriendlyElement.className = `card-text display-6 ${results.mobileFriendly ? 'text-success' : 'text-danger'}`;
        
        viewportElement.textContent = results.viewport ? 'Yes' : 'No';
        viewportElement.className = `card-text display-6 ${results.viewport ? 'text-success' : 'text-danger'}`;
        
        textSizeElement.textContent = results.textSize ? 'Yes' : 'No';
        textSizeElement.className = `card-text display-6 ${results.textSize ? 'text-success' : 'text-danger'}`;
        
        tapTargetsElement.textContent = results.tapTargets ? 'Yes' : 'No';
        tapTargetsElement.className = `card-text display-6 ${results.tapTargets ? 'text-success' : 'text-danger'}`;

        // Update issues
        if (results.issues.length === 0) {
            issuesElement.innerHTML = '<p class="text-success">No issues found!</p>';
        } else {
            const issuesList = document.createElement('ul');
            issuesList.className = 'list-group';
            
            results.issues.forEach(issue => {
                const li = document.createElement('li');
                li.className = 'list-group-item list-group-item-danger';
                li.textContent = issue;
                issuesList.appendChild(li);
            });
            
            issuesElement.innerHTML = '';
            issuesElement.appendChild(issuesList);
        }
    }

    function updateScreenshot(url, device, orientation) {
        // In a real implementation, this would fetch a screenshot from a service
        // For now, we'll just show a placeholder
        screenshotContainer.innerHTML = `
            <div class="text-center">
                <p class="text-muted">Screenshot preview for ${device} (${orientation})</p>
                <div class="border rounded p-3 bg-white">
                    <p class="mb-0">[Screenshot would appear here]</p>
                </div>
            </div>
        `;
    }

    function resetResults() {
        mobileFriendlyElement.textContent = 'No';
        mobileFriendlyElement.className = 'card-text display-6';
        
        viewportElement.textContent = 'No';
        viewportElement.className = 'card-text display-6';
        
        textSizeElement.textContent = 'No';
        textSizeElement.className = 'card-text display-6';
        
        tapTargetsElement.textContent = 'No';
        tapTargetsElement.className = 'card-text display-6';

        issuesElement.innerHTML = '<p class="text-center">Enter URL and click "Test" to see results</p>';
        screenshotContainer.innerHTML = '<p class="text-muted">Enter URL and click "Test" to see preview</p>';
    }

    function showError(message) {
        issuesElement.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${message}
            </div>
        `;
    }

    // Simulated mobile-friendly test
    async function testMobileFriendly(url, device, orientation) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate random results for demonstration
        const mobileFriendly = Math.random() > 0.3;
        const viewport = Math.random() > 0.2;
        const textSize = Math.random() > 0.2;
        const tapTargets = Math.random() > 0.2;

        const issues = [];
        if (!mobileFriendly) issues.push('Website is not mobile-friendly');
        if (!viewport) issues.push('Viewport meta tag is missing or incorrect');
        if (!textSize) issues.push('Text size is too small for mobile viewing');
        if (!tapTargets) issues.push('Tap targets are too small or too close together');

        return {
            mobileFriendly,
            viewport,
            textSize,
            tapTargets,
            issues
        };
    }
}); 