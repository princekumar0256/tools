document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dev-tools-form');
    const inputCode = document.getElementById('input-code');
    const toolRadios = document.querySelectorAll('input[name="tool"]');
    const results = document.getElementById('results');
    const copyBtn = document.getElementById('copy-btn');
    const jsonOptions = document.getElementById('json-options');
    const htmlMdOptions = document.getElementById('html-md-options');
    const indentSize = document.getElementById('indent-size');
    const sortKeys = document.getElementById('sort-keys');
    const headingStyle = document.getElementById('heading-style');
    const preserveLinks = document.getElementById('preserve-links');

    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(inputCode, {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        lineWrapping: true
    });

    // Tool selection handler
    toolRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            jsonOptions.classList.toggle('d-none', radio.value !== 'json-formatter');
            htmlMdOptions.classList.toggle('d-none', radio.value !== 'html-to-md');
            
            // Update editor mode based on selected tool
            switch (radio.value) {
                case 'json-formatter':
                    editor.setOption('mode', 'javascript');
                    break;
                case 'html-to-md':
                    editor.setOption('mode', 'xml');
                    break;
                case 'css-minifier':
                    editor.setOption('mode', 'css');
                    break;
                case 'js-minifier':
                    editor.setOption('mode', 'javascript');
                    break;
            }
        });
    });

    // Copy button handler
    copyBtn.addEventListener('click', () => {
        const resultText = results.querySelector('pre')?.textContent || '';
        if (resultText) {
            navigator.clipboard.writeText(resultText).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            });
        }
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = editor.getValue();
        const selectedTool = document.querySelector('input[name="tool"]:checked').value;

        if (!code.trim()) {
            results.innerHTML = '<p class="text-center text-muted">Enter code to see results</p>';
            return;
        }

        try {
            switch (selectedTool) {
                case 'json-formatter':
                    formatJson(code);
                    break;
                case 'html-to-md':
                    convertHtmlToMarkdown(code);
                    break;
                case 'css-minifier':
                    minifyCss(code);
                    break;
                case 'js-minifier':
                    minifyJs(code);
                    break;
            }
        } catch (error) {
            results.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        }
    });

    // Form reset handler
    form.addEventListener('reset', () => {
        setTimeout(() => {
            editor.setValue('');
            results.innerHTML = '<p class="text-center text-muted">Select a tool and enter code to see results</p>';
        }, 0);
    });

    function formatJson(code) {
        try {
            const obj = JSON.parse(code);
            const indent = indentSize.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize.value));
            let formatted = JSON.stringify(obj, null, indent);
            
            if (sortKeys.checked) {
                const sortedObj = sortObjectKeys(obj);
                formatted = JSON.stringify(sortedObj, null, indent);
            }
            
            displayResults(formatted, 'javascript');
        } catch (error) {
            throw new Error('Invalid JSON format');
        }
    }

    function sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => typeof item === 'object' ? sortObjectKeys(item) : item);
        }
        
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        
        return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
                result[key] = typeof obj[key] === 'object' ? sortObjectKeys(obj[key]) : obj[key];
                return result;
            }, {});
    }

    function convertHtmlToMarkdown(code) {
        // Basic HTML to Markdown conversion
        let markdown = code
            .replace(/<h([1-6])>(.*?)<\/h\1>/gi, (match, level, content) => {
                if (headingStyle.value === 'atx') {
                    return '#'.repeat(level) + ' ' + content.trim();
                } else {
                    return content.trim() + '\n' + (level === '1' ? '=' : '-').repeat(content.length);
                }
            })
            .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<em>(.*?)<\/em>/gi, '*$1*')
            .replace(/<code>(.*?)<\/code>/gi, '`$1`')
            .replace(/<pre>(.*?)<\/pre>/gi, '```\n$1\n```')
            .replace(/<ul>(.*?)<\/ul>/gi, '$1')
            .replace(/<ol>(.*?)<\/ol>/gi, '$1')
            .replace(/<li>(.*?)<\/li>/gi, '- $1\n');

        if (preserveLinks.checked) {
            markdown = markdown.replace(/<a\s+href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');
        } else {
            markdown = markdown.replace(/<a\s+href="(.*?)">(.*?)<\/a>/gi, '$2');
        }

        displayResults(markdown, 'markdown');
    }

    function minifyCss(code) {
        // Basic CSS minification
        const minified = code
            .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\s*([{}|:;,])\s*/g, '$1') // Remove spaces around brackets, colons, semicolons, and commas
            .replace(/;}/g, '}') // Remove last semicolon in a rule
            .trim();

        displayResults(minified, 'css');
    }

    function minifyJs(code) {
        // Basic JavaScript minification
        const minified = code
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\s*([=+\-*\/%&|^~!?:,;{}()[\]])\s*/g, '$1') // Remove spaces around operators
            .replace(/;\s*}/g, '}') // Remove last semicolon in a block
            .trim();

        displayResults(minified, 'javascript');
    }

    function displayResults(code, mode) {
        results.innerHTML = `
            <pre class="mb-0"><code>${escapeHtml(code)}</code></pre>
        `;
        editor.setOption('mode', mode);
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}); 