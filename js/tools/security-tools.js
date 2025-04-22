document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('security-form');
    const toolRadios = document.querySelectorAll('input[name="tool"]');
    const results = document.getElementById('results');
    const toolSections = document.querySelectorAll('.tool-section');

    // Tool selection handler
    toolRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            toolSections.forEach(section => {
                section.classList.add('d-none');
            });
            document.getElementById(`${radio.value}-tool`).classList.remove('d-none');
        });
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedTool = document.querySelector('input[name="tool"]:checked').value;

        try {
            switch (selectedTool) {
                case 'md5':
                    generateMD5();
                    break;
                case 'sha256':
                    generateSHA256();
                    break;
                case 'password':
                    generatePassword();
                    break;
                case 'random':
                    generateRandomString();
                    break;
                case 'url':
                    shortenURL();
                    break;
                case 'ip':
                    findIPLocation();
                    break;
                case 'ssl':
                    checkSSLCertificate();
                    break;
                case 'whois':
                    performWhoisLookup();
                    break;
                case 'headers':
                    checkHTTPHeaders();
                    break;
                case 'privacy':
                    generatePrivacyPolicy();
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

    // MD5 Hash Generator
    function generateMD5() {
        const text = document.getElementById('md5-input').value;
        if (!text) {
            throw new Error('Please enter text to hash');
        }
        const hash = CryptoJS.MD5(text).toString();
        showResults('MD5 Hash', hash);
    }

    // SHA256 Hash Generator
    function generateSHA256() {
        const text = document.getElementById('sha256-input').value;
        if (!text) {
            throw new Error('Please enter text to hash');
        }
        const hash = CryptoJS.SHA256(text).toString();
        showResults('SHA256 Hash', hash);
    }

    // Password Generator
    function generatePassword() {
        const length = parseInt(document.getElementById('password-length').value);
        const useUppercase = document.getElementById('uppercase').checked;
        const useLowercase = document.getElementById('lowercase').checked;
        const useNumbers = document.getElementById('numbers').checked;
        const useSymbols = document.getElementById('symbols').checked;

        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
            throw new Error('Please select at least one character type');
        }

        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let chars = '';
        if (useUppercase) chars += uppercase;
        if (useLowercase) chars += lowercase;
        if (useNumbers) chars += numbers;
        if (useSymbols) chars += symbols;

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        showResults('Generated Password', password);
    }

    // Random String Generator
    function generateRandomString() {
        const length = parseInt(document.getElementById('random-length').value);
        const type = document.getElementById('random-type').value;

        let chars;
        switch (type) {
            case 'alphanumeric':
                chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                break;
            case 'letters':
                chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                break;
            case 'numbers':
                chars = '0123456789';
                break;
            case 'hex':
                chars = '0123456789ABCDEF';
                break;
        }

        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        showResults('Random String', result);
    }

    // URL Shortener
    async function shortenURL() {
        const url = document.getElementById('url-input').value;
        if (!url) {
            throw new Error('Please enter a URL to shorten');
        }

        try {
            const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_BITLY_ACCESS_TOKEN',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ long_url: url })
            });

            const data = await response.json();
            showResults('Shortened URL', data.link);
        } catch (error) {
            throw new Error('Failed to shorten URL. Please try again later.');
        }
    }

    // IP Geolocation Finder
    async function findIPLocation() {
        const ip = document.getElementById('ip-input').value;
        if (!ip) {
            throw new Error('Please enter an IP address');
        }

        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason);
            }

            const locationInfo = `
                <p><strong>IP:</strong> ${data.ip}</p>
                <p><strong>City:</strong> ${data.city}</p>
                <p><strong>Region:</strong> ${data.region}</p>
                <p><strong>Country:</strong> ${data.country_name}</p>
                <p><strong>Postal Code:</strong> ${data.postal}</p>
                <p><strong>Latitude:</strong> ${data.latitude}</p>
                <p><strong>Longitude:</strong> ${data.longitude}</p>
                <p><strong>Timezone:</strong> ${data.timezone}</p>
                <p><strong>ISP:</strong> ${data.org}</p>
            `;

            showResults('IP Geolocation Information', locationInfo);
        } catch (error) {
            throw new Error('Failed to find IP location. Please try again later.');
        }
    }

    // SSL Certificate Checker
    async function checkSSLCertificate() {
        const domain = document.getElementById('ssl-input').value;
        if (!domain) {
            throw new Error('Please enter a domain name');
        }

        try {
            const response = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${domain}`);
            const data = await response.json();

            if (data.status === 'ERROR') {
                throw new Error(data.statusMessage);
            }

            const certInfo = `
                <p><strong>Domain:</strong> ${domain}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Grade:</strong> ${data.grade}</p>
                <p><strong>Issuer:</strong> ${data.cert.issuerSubject}</p>
                <p><strong>Valid From:</strong> ${new Date(data.cert.notBefore).toLocaleDateString()}</p>
                <p><strong>Valid Until:</strong> ${new Date(data.cert.notAfter).toLocaleDateString()}</p>
            `;

            showResults('SSL Certificate Information', certInfo);
        } catch (error) {
            throw new Error('Failed to check SSL certificate. Please try again later.');
        }
    }

    // Whois Lookup
    async function performWhoisLookup() {
        const query = document.getElementById('whois-input').value;
        if (!query) {
            throw new Error('Please enter a domain or IP address');
        }

        try {
            const response = await fetch(`https://whois.arin.net/rest/ip/${query}`);
            const data = await response.json();

            const whoisInfo = `
                <p><strong>Query:</strong> ${query}</p>
                <p><strong>Organization:</strong> ${data.net.orgRef['@name']}</p>
                <p><strong>Registration Date:</strong> ${data.net.registrationDate}</p>
                <p><strong>Last Updated:</strong> ${data.net.updateDate}</p>
                <p><strong>Net Range:</strong> ${data.net.startAddress} - ${data.net.endAddress}</p>
            `;

            showResults('Whois Information', whoisInfo);
        } catch (error) {
            throw new Error('Failed to perform Whois lookup. Please try again later.');
        }
    }

    // HTTP Headers Checker
    async function checkHTTPHeaders() {
        const url = document.getElementById('headers-input').value;
        if (!url) {
            throw new Error('Please enter a URL');
        }

        try {
            const response = await fetch(url);
            const headers = Array.from(response.headers.entries());

            let headersInfo = '<div class="table-responsive"><table class="table table-sm">';
            headers.forEach(([key, value]) => {
                headersInfo += `
                    <tr>
                        <td><strong>${key}:</strong></td>
                        <td>${value}</td>
                    </tr>
                `;
            });
            headersInfo += '</table></div>';

            showResults('HTTP Headers', headersInfo);
        } catch (error) {
            throw new Error('Failed to check HTTP headers. Please try again later.');
        }
    }

    // Privacy Policy Generator
    function generatePrivacyPolicy() {
        const companyName = document.getElementById('company-name').value;
        const websiteUrl = document.getElementById('website-url').value;
        const collectName = document.getElementById('collect-name').checked;
        const collectEmail = document.getElementById('collect-email').checked;
        const collectPhone = document.getElementById('collect-phone').checked;
        const collectAddress = document.getElementById('collect-address').checked;
        const collectCookies = document.getElementById('collect-cookies').checked;

        if (!companyName || !websiteUrl) {
            throw new Error('Please enter company name and website URL');
        }

        let dataCollection = [];
        if (collectName) dataCollection.push('name');
        if (collectEmail) dataCollection.push('email address');
        if (collectPhone) dataCollection.push('phone number');
        if (collectAddress) dataCollection.push('address');
        if (collectCookies) dataCollection.push('cookies');

        const privacyPolicy = `
            <h4>Privacy Policy for ${companyName}</h4>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>

            <h5>1. Introduction</h5>
            <p>Welcome to ${companyName}'s Privacy Policy. This policy describes how we collect, use, and protect your personal information when you visit our website at ${websiteUrl}.</p>

            <h5>2. Information We Collect</h5>
            <p>We collect the following types of information:</p>
            <ul>
                ${dataCollection.map(item => `<li>${item}</li>`).join('')}
            </ul>

            <h5>3. How We Use Your Information</h5>
            <p>We use the collected information for the following purposes:</p>
            <ul>
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
            </ul>

            <h5>4. Data Protection</h5>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>

            <h5>5. Your Rights</h5>
            <p>You have the right to:</p>
            <ul>
                <li>Access your personal data</li>
                <li>Correct your personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Withdraw consent</li>
            </ul>

            <h5>6. Contact Us</h5>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>${companyName}<br>
            ${websiteUrl}</p>
        `;

        showResults('Privacy Policy', privacyPolicy);
    }

    // Helper function to display results
    function showResults(title, content) {
        results.innerHTML = `
            <div class="mb-3">
                <h6>${title}</h6>
                <div class="p-3 bg-white rounded border">
                    ${content}
                </div>
            </div>
            <button class="btn btn-sm btn-outline-primary" onclick="copyToClipboard(this)">
                <i class="bi bi-clipboard"></i> Copy
            </button>
        `;
    }

    // Form reset handler
    form.addEventListener('reset', () => {
        setTimeout(() => {
            results.innerHTML = '<p class="text-center text-muted">Select a tool and enter values to see results</p>';
        }, 0);
    });
});

// Global function to copy text to clipboard
function copyToClipboard(button) {
    const content = button.previousElementSibling.textContent;
    navigator.clipboard.writeText(content).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    });
} 