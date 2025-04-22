document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('keyword-form');
    const results = document.getElementById('results');
    const totalWords = document.getElementById('total-words');
    const uniqueWords = document.getElementById('unique-words');
    const keywordsFound = document.getElementById('keywords-found');

    // Common words to ignore
    const commonWords = new Set([
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
        'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
        'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
        'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
        'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
        'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
        'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ]);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        analyzeKeywords();
    });

    function analyzeKeywords() {
        const content = document.getElementById('content').value;
        const minLength = parseInt(document.getElementById('min-length').value);
        const minFrequency = parseInt(document.getElementById('min-frequency').value);
        const ignoreCommon = document.getElementById('ignore-common').checked;

        // Clean and split text into words
        const words = content.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length >= minLength);

        // Count word frequencies
        const wordCount = {};
        words.forEach(word => {
            if (ignoreCommon && commonWords.has(word)) return;
            wordCount[word] = (wordCount[word] || 0) + 1;
        });

        // Calculate total words and unique words
        const total = words.length;
        const unique = Object.keys(wordCount).length;

        // Filter keywords based on minimum frequency
        const keywords = Object.entries(wordCount)
            .filter(([_, count]) => count >= minFrequency)
            .sort((a, b) => b[1] - a[1]);

        // Update statistics
        totalWords.textContent = total;
        uniqueWords.textContent = unique;
        keywordsFound.textContent = keywords.length;

        // Update results table
        results.innerHTML = keywords.length ? '' : '<tr><td colspan="3" class="text-center">No keywords found matching the criteria</td></tr>';
        
        keywords.forEach(([word, count]) => {
            const density = ((count / total) * 100).toFixed(2);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${word}</td>
                <td>${count}</td>
                <td>${density}%</td>
            `;
            results.appendChild(row);
        });
    }
}); 