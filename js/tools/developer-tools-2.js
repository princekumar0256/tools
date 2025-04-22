document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dev-tools-form');
    const inputCode = document.getElementById('input-code');
    const toolRadios = document.querySelectorAll('input[name="tool"]');
    const results = document.getElementById('results');
    const copyBtn = document.getElementById('copy-btn');
    const sqlOptions = document.getElementById('sql-options');
    const htaccessOptions = document.getElementById('htaccess-options');
    const colorOptions = document.getElementById('color-options');
    const base64Options = document.getElementById('base64-options');
    const ipOptions = document.getElementById('ip-options');
    const sqlIndent = document.getElementById('sql-indent');
    const uppercaseKeywords = document.getElementById('uppercase-keywords');
    const redirectType = document.getElementById('redirect-type');
    const sourcePath = document.getElementById('source-path');
    const targetPath = document.getElementById('target-path');
    const wwwRedirect = document.getElementById('www-redirect');
    const colorInput = document.getElementById('color-input');
    const colorFormat = document.getElementById('color-format');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const ipInput = document.getElementById('ip-input');
    const lookupBtn = document.getElementById('lookup-btn');

    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(inputCode, {
        mode: 'sql',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        lineWrapping: true
    });

    // Initialize Spectrum color picker
    $("#color-input").spectrum({
        type: "component",
        showInput: true,
        showInitial: true,
        showAlpha: true,
        preferredFormat: "hex",
        move: function(color) {
            updateColorResults(color);
        }
    });

    // Tool selection handler
    toolRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            sqlOptions.classList.toggle('d-none', radio.value !== 'sql-formatter');
            htaccessOptions.classList.toggle('d-none', radio.value !== 'htaccess');
            colorOptions.classList.toggle('d-none', radio.value !== 'color-picker');
            base64Options.classList.toggle('d-none', radio.value !== 'base64');
            ipOptions.classList.toggle('d-none', radio.value !== 'ip-lookup');
            
            // Update editor mode based on selected tool
            switch (radio.value) {
                case 'sql-formatter':
                    editor.setOption('mode', 'sql');
                    break;
                case 'md-to-html':
                    editor.setOption('mode', 'markdown');
                    break;
                case 'base64':
                    editor.setOption('mode', 'text/plain');
                    break;
                default:
                    editor.setOption('mode', 'text/plain');
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
        const input = editor.getValue();
        const selectedTool = document.querySelector('input[name="tool"]:checked').value;

        if (!input.trim() && selectedTool !== 'ip-lookup') {
            results.innerHTML = '<p class="text-center text-muted">Enter input to see results</p>';
            return;
        }

        try {
            switch (selectedTool) {
                case 'sql-formatter':
                    formatSql(input);
                    break;
                case 'htaccess':
                    generateHtaccess();
                    break;
                case 'md-to-html':
                    convertMarkdownToHtml(input);
                    break;
                case 'base64':
                    // Base64 operations are handled by button clicks
                    break;
                case 'ip-lookup':
                    // IP lookup is handled by button click
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

    // Base64 button handlers
    encodeBtn.addEventListener('click', () => {
        const input = editor.getValue();
        const encoded = btoa(input);
        displayResults(encoded, 'text/plain');
    });

    decodeBtn.addEventListener('click', () => {
        const input = editor.getValue();
        try {
            const decoded = atob(input);
            displayResults(decoded, 'text/plain');
        } catch (error) {
            results.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> Invalid Base64 input
                </div>
            `;
        }
    });

    // IP lookup button handler
    lookupBtn.addEventListener('click', async () => {
        const ip = ipInput.value.trim();
        if (!ip) {
            results.innerHTML = '<p class="text-center text-muted">Enter an IP address</p>';
            return;
        }

        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.reason);
            }

            const result = `
                <div class="row">
                    <div class="col-md-6">
                        <h6>IP Information</h6>
                        <ul class="list-unstyled">
                            <li><strong>IP:</strong> ${data.ip}</li>
                            <li><strong>City:</strong> ${data.city}</li>
                            <li><strong>Region:</strong> ${data.region}</li>
                            <li><strong>Country:</strong> ${data.country_name}</li>
                            <li><strong>Postal:</strong> ${data.postal}</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6>Network Information</h6>
                        <ul class="list-unstyled">
                            <li><strong>ISP:</strong> ${data.org}</li>
                            <li><strong>Timezone:</strong> ${data.timezone}</li>
                            <li><strong>Currency:</strong> ${data.currency}</li>
                            <li><strong>Languages:</strong> ${data.languages}</li>
                        </ul>
                    </div>
                </div>
            `;

            results.innerHTML = result;
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
            results.innerHTML = '<p class="text-center text-muted">Select a tool and enter input to see results</p>';
        }, 0);
    });

    function formatSql(code) {
        const indent = sqlIndent.value === 'tab' ? '\t' : ' '.repeat(parseInt(sqlIndent.value));
        let formatted = code
            .replace(/\s+/g, ' ')
            .replace(/\s*([(),;])\s*/g, '$1 ')
            .replace(/\s*([=<>!])\s*/g, ' $1 ')
            .replace(/\s*([+\-*/%])\s*/g, ' $1 ')
            .replace(/\s*([{}])\s*/g, '$1')
            .trim();

        if (uppercaseKeywords.checked) {
            const keywords = [
                'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL',
                'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY',
                'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'INSERT', 'INTO',
                'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX',
                'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'CHECK',
                'DEFAULT', 'AUTO_INCREMENT', 'COMMENT', 'CHARACTER', 'SET',
                'COLLATE', 'ENGINE', 'INNODB', 'MYISAM', 'BEGIN', 'COMMIT',
                'ROLLBACK', 'TRANSACTION', 'SAVEPOINT', 'RELEASE', 'LOCK',
                'UNLOCK', 'TABLES', 'DATABASE', 'SHOW', 'USE', 'DESCRIBE',
                'EXPLAIN', 'SET', 'VARIABLES', 'SESSION', 'GLOBAL'
            ];

            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                formatted = formatted.replace(regex, keyword);
            });
        }

        displayResults(formatted, 'sql');
    }

    function generateHtaccess() {
        const type = redirectType.value;
        const source = sourcePath.value.trim();
        const target = targetPath.value.trim();
        let rules = [];

        if (wwwRedirect.checked) {
            rules.push(`
# Redirect www to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^(.*)$ http://%1/$1 [R=301,L]
            `.trim());
        }

        if (source && target) {
            rules.push(`
# Redirect ${source} to ${target}
Redirect ${type} ${source} ${target}
            `.trim());
        }

        const result = rules.join('\n\n');
        displayResults(result, 'text/plain');
    }

    function convertMarkdownToHtml(code) {
        // Basic Markdown to HTML conversion
        let html = code
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
            .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
            .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
            .replace(/^\s*\n\*/gm, '<ul>\n*')
            .replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n$2')
            .replace(/^\*(.+)/gm, '<li>$1</li>')
            .replace(/^\s*\n\d\./gm, '<ol>\n1.')
            .replace(/^(\d\..+)\s*\n([^\d\.])/gm, '$1\n</ol>\n$2')
            .replace(/^\d\.(.+)/gm, '<li>$1</li>')
            .replace(/\n\n/g, '</p>\n\n<p>')
            .replace(/^\s*$/gm, '<br>');

        displayResults(html, 'xml');
    }

    function updateColorResults(color) {
        const format = colorFormat.value;
        let result = '';

        switch (format) {
            case 'hex':
                result = color.toHexString();
                break;
            case 'rgb':
                result = color.toRgbString();
                break;
            case 'rgba':
                result = color.toRgbString();
                break;
            case 'hsl':
                result = color.toHslString();
                break;
            case 'hsla':
                result = color.toHslString();
                break;
        }

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Color Preview</h6>
                    <div class="border rounded p-3" style="background-color: ${color.toHexString()}; height: 100px;"></div>
                </div>
                <div class="col-md-6">
                    <h6>Color Values</h6>
                    <ul class="list-unstyled">
                        <li><strong>HEX:</strong> ${color.toHexString()}</li>
                        <li><strong>RGB:</strong> ${color.toRgbString()}</li>
                        <li><strong>HSL:</strong> ${color.toHslString()}</li>
                    </ul>
                </div>
            </div>
        `;
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