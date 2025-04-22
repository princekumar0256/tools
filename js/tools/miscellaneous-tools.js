document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('misc-form');
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
                case 'barcode':
                    generateBarcode();
                    break;
                case 'meme':
                    generateMeme();
                    break;
                case 'resume':
                    generateResume();
                    break;
                case 'invoice':
                    generateInvoice();
                    break;
                case 'business-name':
                    generateBusinessName();
                    break;
                case 'lottery':
                    generateLotteryNumbers();
                    break;
                case 'coin':
                    flipCoin();
                    break;
                case 'random-number':
                    generateRandomNumbers();
                    break;
                case 'dice':
                    rollDice();
                    break;
                case 'speed-test':
                    runSpeedTest();
                    break;
                case 'planner':
                    generatePlanner();
                    break;
                case 'wedding':
                    generateWeddingInvitation();
                    break;
                case 'story':
                    generateStoryPlot();
                    break;
                case 'ebook':
                    generateEbook();
                    break;
                case 'chatbot':
                    // Chatbot is handled by event listeners
                    break;
                case 'ip-tracker':
                    trackIP();
                    break;
                case 'fake-address':
                    generateFakeAddress();
                    break;
                case 'electric-bill':
                    calculateElectricBill();
                    break;
                case 'leap-year':
                    checkLeapYear();
                    break;
                case 'numerology':
                    calculateNumerology();
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

    // Barcode Generator
    function generateBarcode() {
        const text = document.getElementById('barcode-text').value;
        const type = document.getElementById('barcode-type').value;

        if (!text) {
            throw new Error('Please enter text to generate barcode');
        }

        const canvas = document.createElement('canvas');
        JsBarcode(canvas, text, {
            format: type,
            lineColor: '#000',
            width: 2,
            height: 100,
            displayValue: true
        });

        showResults('Barcode', `
            <div class="text-center">
                <img src="${canvas.toDataURL()}" alt="Barcode" class="img-fluid">
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="downloadImage(this, 'barcode.png')">
                        <i class="bi bi-download"></i> Download
                    </button>
                </div>
            </div>
        `);
    }

    // Meme Generator
    function generateMeme() {
        const template = document.getElementById('meme-template').value;
        const topText = document.getElementById('meme-top').value;
        const bottomText = document.getElementById('meme-bottom').value;

        if (!topText && !bottomText) {
            throw new Error('Please enter at least one text for the meme');
        }

        const templates = {
            drake: 'https://i.imgflip.com/30b1gx.jpg',
            distracted: 'https://i.imgflip.com/1g8my4.jpg',
            change: 'https://i.imgflip.com/24y43o.jpg',
            expanding: 'https://i.imgflip.com/1jwhww.jpg'
        };

        showResults('Meme', `
            <div class="text-center">
                <div class="position-relative">
                    <img src="${templates[template]}" alt="Meme Template" class="img-fluid">
                    <div class="position-absolute top-0 start-50 translate-middle-x w-100 text-center p-2" style="background: rgba(0,0,0,0.5);">
                        <h4 class="text-white mb-0">${topText}</h4>
                    </div>
                    <div class="position-absolute bottom-0 start-50 translate-middle-x w-100 text-center p-2" style="background: rgba(0,0,0,0.5);">
                        <h4 class="text-white mb-0">${bottomText}</h4>
                    </div>
                </div>
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="downloadImage(this, 'meme.png')">
                        <i class="bi bi-download"></i> Download
                    </button>
                </div>
            </div>
        `);
    }

    // Resume Builder
    function generateResume() {
        const name = document.getElementById('resume-name').value;
        const email = document.getElementById('resume-email').value;
        const phone = document.getElementById('resume-phone').value;
        const experience = document.getElementById('resume-experience').value;
        const education = document.getElementById('resume-education').value;
        const skills = document.getElementById('resume-skills').value;

        if (!name || !email || !phone) {
            throw new Error('Please fill in all required fields');
        }

        const resume = `
            <div class="p-4 bg-white rounded border">
                <h2 class="text-center mb-4">${name}</h2>
                <div class="row mb-4">
                    <div class="col-md-4">
                        <p><strong>Email:</strong> ${email}</p>
                    </div>
                    <div class="col-md-4">
                        <p><strong>Phone:</strong> ${phone}</p>
                    </div>
                </div>
                <div class="mb-4">
                    <h4>Work Experience</h4>
                    <p>${experience}</p>
                </div>
                <div class="mb-4">
                    <h4>Education</h4>
                    <p>${education}</p>
                </div>
                <div class="mb-4">
                    <h4>Skills</h4>
                    <p>${skills}</p>
                </div>
            </div>
        `;

        showResults('Resume', resume);
    }

    // Invoice Generator
    function generateInvoice() {
        const number = document.getElementById('invoice-number').value;
        const date = document.getElementById('invoice-date').value;
        const client = document.getElementById('invoice-client').value;
        const items = Array.from(document.querySelectorAll('#invoice-items .row')).map(row => ({
            description: row.querySelector('input[type="text"]').value,
            quantity: row.querySelector('input[type="number"]:nth-of-type(1)').value,
            price: row.querySelector('input[type="number"]:nth-of-type(2)').value
        }));

        if (!number || !date || !client || items.length === 0) {
            throw new Error('Please fill in all required fields');
        }

        const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        const invoice = `
            <div class="p-4 bg-white rounded border">
                <div class="row mb-4">
                    <div class="col-md-6">
                        <h2>Invoice #${number}</h2>
                        <p><strong>Date:</strong> ${date}</p>
                    </div>
                    <div class="col-md-6 text-end">
                        <h3>Bill To:</h3>
                        <p>${client}</p>
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.price}</td>
                                <td>$${item.quantity * item.price}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-end"><strong>Total:</strong></td>
                            <td><strong>$${total}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        showResults('Invoice', invoice);
    }

    // Business Name Generator
    function generateBusinessName() {
        const keywords = document.getElementById('business-keywords').value.split(',').map(k => k.trim());
        const industry = document.getElementById('business-industry').value;

        if (keywords.length === 0) {
            throw new Error('Please enter at least one keyword');
        }

        const prefixes = ['Pro', 'Elite', 'Prime', 'Ultra', 'Max', 'Super', 'Mega', 'Grand'];
        const suffixes = ['Tech', 'Solutions', 'Systems', 'Services', 'Group', 'Labs', 'Studio', 'Works'];

        const names = [];
        for (let i = 0; i < 5; i++) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const keyword = keywords[Math.floor(Math.random() * keywords.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            names.push(`${prefix}${keyword}${suffix}`);
        }

        showResults('Business Names', `
            <div class="list-group">
                ${names.map(name => `
                    <div class="list-group-item">
                        <h5 class="mb-1">${name}</h5>
                        <small class="text-muted">${industry.charAt(0).toUpperCase() + industry.slice(1)}</small>
                    </div>
                `).join('')}
            </div>
        `);
    }

    // Lottery Number Generator
    function generateLotteryNumbers() {
        const type = document.getElementById('lottery-type').value;
        const count = document.getElementById('lottery-count').value;

        const rules = {
            powerball: { main: 5, max: 69, special: 1, specialMax: 26 },
            megamillions: { main: 5, max: 70, special: 1, specialMax: 25 },
            euro: { main: 5, max: 50, special: 2, specialMax: 12 },
            lotto: { main: 6, max: 59, special: 0 }
        };

        const rule = rules[type];
        const sets = [];

        for (let i = 0; i < count; i++) {
            const main = generateUniqueNumbers(rule.main, rule.max);
            const special = rule.special > 0 ? generateUniqueNumbers(rule.special, rule.specialMax) : [];
            sets.push({ main, special });
        }

        showResults('Lottery Numbers', `
            <div class="list-group">
                ${sets.map((set, index) => `
                    <div class="list-group-item">
                        <h5 class="mb-1">Set ${index + 1}</h5>
                        <div class="d-flex gap-2">
                            ${set.main.map(num => `<span class="badge bg-primary">${num}</span>`).join('')}
                            ${set.special.map(num => `<span class="badge bg-danger">${num}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `);
    }

    // Flip a Coin Simulator
    function flipCoin() {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '🪙';

        showResults('Coin Flip', `
            <div class="text-center">
                <h1 class="display-1">${emoji}</h1>
                <h2>${result}</h2>
            </div>
        `);
    }

    // Random Number Generator
    function generateRandomNumbers() {
        const min = parseInt(document.getElementById('random-min').value);
        const max = parseInt(document.getElementById('random-max').value);
        const count = parseInt(document.getElementById('random-count').value);

        if (min >= max) {
            throw new Error('Minimum value must be less than maximum value');
        }

        const numbers = [];
        for (let i = 0; i < count; i++) {
            numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }

        showResults('Random Numbers', `
            <div class="list-group">
                ${numbers.map(num => `
                    <div class="list-group-item">
                        <h5 class="mb-0">${num}</h5>
                    </div>
                `).join('')}
            </div>
        `);
    }

    // Dice Roller Simulator
    function rollDice() {
        const count = parseInt(document.getElementById('dice-count').value);
        const sides = parseInt(document.getElementById('dice-sides').value);

        const rolls = [];
        let total = 0;

        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }

        const diceEmojis = {
            4: '🎲',
            6: '🎲',
            8: '🎲',
            10: '🎲',
            12: '🎲',
            20: '🎲'
        };

        showResults('Dice Roll', `
            <div class="text-center">
                <div class="d-flex justify-content-center gap-2 mb-3">
                    ${rolls.map(roll => `<span class="display-4">${diceEmojis[sides]}</span>`).join('')}
                </div>
                <div class="mb-3">
                    <h4>Rolls: ${rolls.join(', ')}</h4>
                    <h4>Total: ${total}</h4>
                </div>
            </div>
        `);
    }

    // Internet Speed Test
    function runSpeedTest() {
        const progressBar = document.querySelector('.progress-bar');
        const downloadSpeed = document.getElementById('download-speed');
        const uploadSpeed = document.getElementById('upload-speed');

        progressBar.style.width = '0%';
        downloadSpeed.textContent = '0';
        uploadSpeed.textContent = '0';

        // Simulate speed test
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;

            if (progress <= 50) {
                downloadSpeed.textContent = (Math.random() * 100).toFixed(2);
            } else {
                uploadSpeed.textContent = (Math.random() * 50).toFixed(2);
            }

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 500);
    }

    // Daily Planner Creator
    function generatePlanner() {
        const date = document.getElementById('planner-date').value;
        const tasks = Array.from(document.querySelectorAll('#planner-tasks .row')).map(row => ({
            time: row.querySelector('input[type="time"]').value,
            description: row.querySelector('input[type="text"]').value
        }));

        if (!date || tasks.length === 0) {
            throw new Error('Please fill in all required fields');
        }

        const planner = `
            <div class="p-4 bg-white rounded border">
                <h2 class="text-center mb-4">Daily Planner - ${new Date(date).toLocaleDateString()}</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Task</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tasks.map(task => `
                            <tr>
                                <td>${task.time}</td>
                                <td>${task.description}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        showResults('Daily Planner', planner);
    }

    // Wedding Invitation Generator
    function generateWeddingInvitation() {
        const bride = document.getElementById('wedding-bride').value;
        const groom = document.getElementById('wedding-groom').value;
        const date = document.getElementById('wedding-date').value;
        const venue = document.getElementById('wedding-venue').value;
        const template = document.getElementById('wedding-template').value;

        if (!bride || !groom || !date || !venue) {
            throw new Error('Please fill in all required fields');
        }

        const invitation = `
            <div class="p-4 bg-white rounded border text-center">
                <h2 class="mb-4">${bride} & ${groom}</h2>
                <p class="lead">Request the pleasure of your company</p>
                <p class="lead">at their wedding celebration</p>
                <p class="lead">${new Date(date).toLocaleDateString()}</p>
                <p class="lead">${venue}</p>
            </div>
        `;

        showResults('Wedding Invitation', invitation);
    }

    // Story Plot Generator
    function generateStoryPlot() {
        const genre = document.getElementById('story-genre').value;
        const keywords = document.getElementById('story-keywords').value.split(',').map(k => k.trim());

        if (keywords.length === 0) {
            throw new Error('Please enter at least one keyword');
        }

        const plots = {
            fantasy: [
                'A young hero discovers a magical artifact that grants them extraordinary powers.',
                'A group of adventurers must save their kingdom from an ancient evil.',
                'A magical academy student uncovers a dark conspiracy.'
            ],
            scifi: [
                'A scientist accidentally creates a time machine and must fix the timeline.',
                'A space crew discovers a mysterious alien artifact with dangerous powers.',
                'A future society where emotions are controlled by technology.'
            ],
            mystery: [
                'A detective must solve a murder that seems impossible to commit.',
                'A journalist uncovers a conspiracy while investigating a small-town crime.',
                'A person wakes up with no memory and must piece together their past.'
            ],
            romance: [
                'Two people from different worlds fall in love despite all odds.',
                'A chance encounter leads to an unexpected romance.',
                'A love triangle that tests the boundaries of friendship.'
            ],
            horror: [
                'A family moves into a house with a dark history.',
                'A group of friends must survive a night in a haunted location.',
                'A person starts seeing things that no one else can see.'
            ]
        };

        const plot = plots[genre][Math.floor(Math.random() * plots[genre].length)];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];

        showResults('Story Plot', `
            <div class="p-4 bg-white rounded border">
                <h4>Genre: ${genre.charAt(0).toUpperCase() + genre.slice(1)}</h4>
                <h4>Keywords: ${keywords.join(', ')}</h4>
                <hr>
                <p class="lead">${plot}</p>
                <p>Including the keyword: "${keyword}"</p>
            </div>
        `);
    }

    // E-book Creator
    function generateEbook() {
        const title = document.getElementById('ebook-title').value;
        const author = document.getElementById('ebook-author').value;
        const content = document.getElementById('ebook-content').value;
        const format = document.getElementById('ebook-format').value;

        if (!title || !author || !content) {
            throw new Error('Please fill in all required fields');
        }

        const ebook = `
            <div class="p-4 bg-white rounded border">
                <h2 class="text-center mb-4">${title}</h2>
                <p class="text-center mb-4">by ${author}</p>
                <div class="mb-4">
                    ${content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                </div>
                <div class="text-center">
                    <button class="btn btn-primary" onclick="downloadEbook(this, '${format}')">
                        <i class="bi bi-download"></i> Download as ${format.toUpperCase()}
                    </button>
                </div>
            </div>
        `;

        showResults('E-book', ebook);
    }

    // IP Address Tracker
    async function trackIP() {
        const ip = document.getElementById('ip-address').value;

        if (!ip) {
            throw new Error('Please enter an IP address');
        }

        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            showResults('IP Address Information', `
                <div class="p-4 bg-white rounded border">
                    <h4>IP Address: ${data.ip}</h4>
                    <p><strong>Country:</strong> ${data.country_name}</p>
                    <p><strong>Region:</strong> ${data.region}</p>
                    <p><strong>City:</strong> ${data.city}</p>
                    <p><strong>Postal Code:</strong> ${data.postal}</p>
                    <p><strong>Timezone:</strong> ${data.timezone}</p>
                    <p><strong>ISP:</strong> ${data.org}</p>
                </div>
            `);
        } catch (error) {
            throw new Error('Failed to track IP address. Please try again later.');
        }
    }

    // Fake Address Generator
    function generateFakeAddress() {
        const country = document.getElementById('address-country').value;

        const addresses = {
            us: {
                street: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Maple', 'Cedar'][Math.floor(Math.random() * 5)]} St`,
                city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
                state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
                zip: Math.floor(Math.random() * 90000) + 10000
            },
            uk: {
                street: `${Math.floor(Math.random() * 999) + 1} ${['High', 'Church', 'Park', 'Victoria', 'George'][Math.floor(Math.random() * 5)]} Road`,
                city: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Glasgow'][Math.floor(Math.random() * 5)],
                postcode: `${['EC', 'WC', 'SW', 'NW', 'SE'][Math.floor(Math.random() * 5)]}${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
            },
            ca: {
                street: `${Math.floor(Math.random() * 9999) + 1} ${['Yonge', 'Bloor', 'Queen', 'King', 'Dundas'][Math.floor(Math.random() * 5)]} St`,
                city: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'][Math.floor(Math.random() * 5)],
                province: ['ON', 'QC', 'BC', 'AB', 'ON'][Math.floor(Math.random() * 5)],
                postal: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9) + 1}`
            },
            au: {
                street: `${Math.floor(Math.random() * 999) + 1} ${['George', 'William', 'Elizabeth', 'Victoria', 'King'][Math.floor(Math.random() * 5)]} St`,
                city: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'][Math.floor(Math.random() * 5)],
                state: ['NSW', 'VIC', 'QLD', 'WA', 'SA'][Math.floor(Math.random() * 5)],
                postcode: Math.floor(Math.random() * 9000) + 1000
            }
        };

        const address = addresses[country];

        showResults('Fake Address', `
            <div class="p-4 bg-white rounded border">
                <h4>${address.street}</h4>
                <h4>${address.city}, ${address.state || address.province} ${address.zip || address.postcode || address.postal}</h4>
                <h4>${country === 'us' ? 'United States' : country === 'uk' ? 'United Kingdom' : country === 'ca' ? 'Canada' : 'Australia'}</h4>
            </div>
        `);
    }

    // Calculator for Electric Bills
    function calculateElectricBill() {
        const usage = parseFloat(document.getElementById('electric-usage').value);
        const rate = parseFloat(document.getElementById('electric-rate').value);

        if (!usage || !rate) {
            throw new Error('Please enter both usage and rate');
        }

        const total = usage * rate;

        showResults('Electric Bill Calculation', `
            <div class="p-4 bg-white rounded border">
                <h4>Monthly Usage: ${usage} kWh</h4>
                <h4>Rate per kWh: $${rate}</h4>
                <hr>
                <h4>Total Bill: $${total.toFixed(2)}</h4>
            </div>
        `);
    }

    // Leap Year Checker
    function checkLeapYear() {
        const year = parseInt(document.getElementById('leap-year').value);

        if (!year) {
            throw new Error('Please enter a year');
        }

        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

        showResults('Leap Year Check', `
            <div class="p-4 bg-white rounded border text-center">
                <h2>${year}</h2>
                <h3 class="${isLeap ? 'text-success' : 'text-danger'}">
                    ${isLeap ? 'IS' : 'IS NOT'} a leap year
                </h3>
            </div>
        `);
    }

    // Name to Numerology Calculator
    function calculateNumerology() {
        const name = document.getElementById('numerology-name').value;
        const birthdate = document.getElementById('numerology-birthdate').value;

        if (!name || !birthdate) {
            throw new Error('Please enter both name and birth date');
        }

        const numerologyValues = {
            a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
            j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
            s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
        };

        const nameValue = name.toLowerCase().split('').reduce((sum, char) => {
            return sum + (numerologyValues[char] || 0);
        }, 0);

        const lifePathNumber = nameValue.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        const destinyNumber = birthdate.split('-').join('').split('').reduce((sum, digit) => sum + parseInt(digit), 0);

        showResults('Numerology Calculation', `
            <div class="p-4 bg-white rounded border">
                <h4>Name: ${name}</h4>
                <h4>Birth Date: ${new Date(birthdate).toLocaleDateString()}</h4>
                <hr>
                <h4>Life Path Number: ${lifePathNumber}</h4>
                <h4>Destiny Number: ${destinyNumber}</h4>
            </div>
        `);
    }

    // Helper functions
    function generateUniqueNumbers(count, max) {
        const numbers = new Set();
        while (numbers.size < count) {
            numbers.add(Math.floor(Math.random() * max) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function showResults(title, content) {
        results.innerHTML = `
            <div class="mb-3">
                <h6>${title}</h6>
                ${content}
            </div>
            <button class="btn btn-sm btn-outline-primary" onclick="copyToClipboard(this)">
                <i class="bi bi-clipboard"></i> Copy
            </button>
        `;
    }

    // Event listeners for real-time updates
    document.getElementById('flip-coin')?.addEventListener('click', flipCoin);
    document.getElementById('start-speed-test')?.addEventListener('click', runSpeedTest);
    document.getElementById('add-item')?.addEventListener('click', () => {
        const items = document.getElementById('invoice-items');
        const newItem = document.createElement('div');
        newItem.className = 'row mb-2';
        newItem.innerHTML = `
            <div class="col-md-5">
                <input type="text" class="form-control" placeholder="Description">
            </div>
            <div class="col-md-2">
                <input type="number" class="form-control" placeholder="Quantity">
            </div>
            <div class="col-md-2">
                <input type="number" class="form-control" placeholder="Price">
            </div>
            <div class="col-md-2">
                <input type="number" class="form-control" placeholder="Total" readonly>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-danger">×</button>
            </div>
        `;
        items.appendChild(newItem);
    });

    document.getElementById('add-task')?.addEventListener('click', () => {
        const tasks = document.getElementById('planner-tasks');
        const newTask = document.createElement('div');
        newTask.className = 'row mb-2';
        newTask.innerHTML = `
            <div class="col-md-2">
                <input type="time" class="form-control">
            </div>
            <div class="col-md-8">
                <input type="text" class="form-control" placeholder="Task description">
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger">×</button>
            </div>
        `;
        tasks.appendChild(newTask);
    });

    // Form reset handler
    form.addEventListener('reset', () => {
        setTimeout(() => {
            results.innerHTML = '<p class="text-center text-muted">Select a tool and enter values to see results</p>';
        }, 0);
    });
});

// Global functions
function downloadImage(button, filename) {
    const img = button.closest('.text-center').querySelector('img');
    const link = document.createElement('a');
    link.href = img.src;
    link.download = filename;
    link.click();
}

function downloadEbook(button, format) {
    const content = button.closest('.p-4').innerHTML;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ebook.${format}`;
    link.click();
}

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