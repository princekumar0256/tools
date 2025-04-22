document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('text-tools-form');
    const textInput = document.getElementById('text-input');
    const toolRadios = document.querySelectorAll('input[name="tool"]');
    const caseOptions = document.getElementById('case-options');
    const results = document.getElementById('results');
    const caseButtons = document.querySelectorAll('[data-case]');

    // Tool selection handler
    toolRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            caseOptions.classList.toggle('d-none', radio.value !== 'case-converter');
            updateResults();
        });
    });

    // Case converter button handlers
    caseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const text = textInput.value;
            const caseType = button.dataset.case;
            const convertedText = convertCase(text, caseType);
            textInput.value = convertedText;
            updateResults();
        });
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateResults();
    });

    // Form reset handler
    form.addEventListener('reset', () => {
        setTimeout(() => {
            results.innerHTML = '<p class="text-center text-muted">Select a tool and enter text to see results</p>';
        }, 0);
    });

    // Text input handler
    textInput.addEventListener('input', () => {
        updateResults();
    });

    function updateResults() {
        const text = textInput.value;
        const selectedTool = document.querySelector('input[name="tool"]:checked').value;

        if (!text.trim()) {
            results.innerHTML = '<p class="text-center text-muted">Enter text to see results</p>';
            return;
        }

        switch (selectedTool) {
            case 'word-counter':
                showWordCount(text);
                break;
            case 'character-counter':
                showCharacterCount(text);
                break;
            case 'case-converter':
                showCaseConverter(text);
                break;
            case 'plagiarism-checker':
                checkPlagiarism(text);
                break;
            case 'grammar-checker':
                checkGrammar(text);
                break;
        }
    }

    function showWordCount(text) {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;
        const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;

        results.innerHTML = `
            <div class="row text-center">
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Total Words</h6>
                            <p class="card-text display-6">${wordCount}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Unique Words</h6>
                            <p class="card-text display-6">${uniqueWords}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Avg. Word Length</h6>
                            <p class="card-text display-6">${averageWordLength.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function showCharacterCount(text) {
        const charCount = text.length;
        const charCountNoSpaces = text.replace(/\s/g, '').length;
        const lineCount = text.split('\n').length;
        const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

        results.innerHTML = `
            <div class="row text-center">
                <div class="col-md-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Total Characters</h6>
                            <p class="card-text display-6">${charCount}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Characters (no spaces)</h6>
                            <p class="card-text display-6">${charCountNoSpaces}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Lines</h6>
                            <p class="card-text display-6">${lineCount}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Paragraphs</h6>
                            <p class="card-text display-6">${paragraphCount}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function showCaseConverter(text) {
        results.innerHTML = `
            <div class="text-center">
                <p class="text-muted">Use the buttons above to convert the text case</p>
                <div class="border rounded p-3 bg-white">
                    <p class="mb-0">${text}</p>
                </div>
            </div>
        `;
    }

    function convertCase(text, caseType) {
        switch (caseType) {
            case 'lowercase':
                return text.toLowerCase();
            case 'uppercase':
                return text.toUpperCase();
            case 'title':
                return text.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
            case 'sentence':
                return text.split('. ').map(sentence => 
                    sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()
                ).join('. ');
            default:
                return text;
        }
    }

    function checkPlagiarism(text) {
        // Simulate plagiarism check
        const similarity = Math.random() * 100;
        const sources = [
            { url: 'https://example.com/source1', similarity: Math.random() * 30 },
            { url: 'https://example.com/source2', similarity: Math.random() * 20 },
            { url: 'https://example.com/source3', similarity: Math.random() * 15 }
        ].filter(source => source.similarity > 5);

        results.innerHTML = `
            <div class="text-center mb-4">
                <h6>Overall Similarity</h6>
                <p class="display-6 ${similarity > 30 ? 'text-danger' : 'text-success'}">${similarity.toFixed(1)}%</p>
            </div>
            ${sources.length > 0 ? `
                <h6>Similar Sources</h6>
                <div class="list-group">
                    ${sources.map(source => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <a href="${source.url}" target="_blank">${source.url}</a>
                                <span class="badge bg-${source.similarity > 20 ? 'danger' : 'warning'}">
                                    ${source.similarity.toFixed(1)}% similar
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="text-success">No significant matches found</p>'}
        `;
    }

    function checkGrammar(text) {
        // Simulate grammar check
        const issues = [
            { type: 'spelling', text: 'teh', suggestion: 'the', context: '...quick brown fox jumps over teh lazy dog...' },
            { type: 'grammar', text: 'they is', suggestion: 'they are', context: '...they is going to the store...' },
            { type: 'punctuation', text: 'its', suggestion: "it's", context: '...its a beautiful day...' }
        ].filter(() => Math.random() > 0.5);

        results.innerHTML = `
            <div class="text-center mb-4">
                <h6>Grammar Check Results</h6>
                <p class="display-6 ${issues.length > 0 ? 'text-warning' : 'text-success'}">
                    ${issues.length} ${issues.length === 1 ? 'issue' : 'issues'} found
                </p>
            </div>
            ${issues.length > 0 ? `
                <div class="list-group">
                    ${issues.map(issue => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-${getIssueTypeClass(issue.type)}">${issue.type}</span>
                                <button class="btn btn-sm btn-outline-primary" onclick="replaceText('${issue.text}', '${issue.suggestion}')">
                                    Fix
                                </button>
                            </div>
                            <p class="mb-1">${issue.context}</p>
                            <small class="text-muted">Suggested: ${issue.suggestion}</small>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="text-success">No grammar issues found!</p>'}
        `;
    }

    function getIssueTypeClass(type) {
        switch (type) {
            case 'spelling': return 'danger';
            case 'grammar': return 'warning';
            case 'punctuation': return 'info';
            default: return 'secondary';
        }
    }

    // Add global function for text replacement
    window.replaceText = (oldText, newText) => {
        textInput.value = textInput.value.replace(oldText, newText);
        updateResults();
    };
}); 