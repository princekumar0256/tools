document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('text-tools-form');
    const textInput = document.getElementById('text-input');
    const toolRadios = document.querySelectorAll('input[name="tool"]');
    const results = document.getElementById('results');
    const ttsOptions = document.getElementById('tts-options');
    const urlOptions = document.getElementById('url-options');
    const fancyOptions = document.getElementById('fancy-options');
    const randomOptions = document.getElementById('random-options');
    const voiceSelect = document.getElementById('voice-select');
    const rateInput = document.getElementById('rate');
    const rateValue = document.getElementById('rate-value');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const fancyButtons = document.querySelectorAll('[data-style]');
    const textTypeSelect = document.getElementById('text-type');
    const textLengthInput = document.getElementById('text-length');

    let speechSynthesis = window.speechSynthesis;
    let recognition = null;
    let voices = [];

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
    }

    // Load available voices
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = voices.map(voice => 
            `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
        ).join('');
    }

    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Tool selection handler
    toolRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            ttsOptions.classList.toggle('d-none', radio.value !== 'text-to-speech');
            urlOptions.classList.toggle('d-none', radio.value !== 'url-encoder');
            fancyOptions.classList.toggle('d-none', radio.value !== 'fancy-text');
            randomOptions.classList.toggle('d-none', radio.value !== 'random-text');
            updateResults();
        });
    });

    // Speech rate handler
    rateInput.addEventListener('input', () => {
        rateValue.textContent = rateInput.value;
    });

    // URL encoder/decoder handlers
    encodeBtn.addEventListener('click', () => {
        const text = textInput.value;
        textInput.value = encodeURIComponent(text);
        updateResults();
    });

    decodeBtn.addEventListener('click', () => {
        const text = textInput.value;
        textInput.value = decodeURIComponent(text);
        updateResults();
    });

    // Fancy text button handlers
    fancyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const text = textInput.value;
            const style = button.dataset.style;
            textInput.value = convertToFancyText(text, style);
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

        if (!text.trim() && selectedTool !== 'random-text') {
            results.innerHTML = '<p class="text-center text-muted">Enter text to see results</p>';
            return;
        }

        switch (selectedTool) {
            case 'text-to-speech':
                speakText(text);
                break;
            case 'speech-to-text':
                startSpeechRecognition();
                break;
            case 'url-encoder':
                showUrlResults(text);
                break;
            case 'fancy-text':
                showFancyTextResults(text);
                break;
            case 'random-text':
                generateRandomText();
                break;
        }
    }

    function speakText(text) {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        utterance.rate = parseFloat(rateInput.value);
        speechSynthesis.speak(utterance);

        results.innerHTML = `
            <div class="text-center">
                <p class="text-success">Speaking text...</p>
                <button class="btn btn-danger" onclick="window.speechSynthesis.cancel()">
                    <i class="bi bi-stop-fill"></i> Stop
                </button>
            </div>
        `;
    }

    function startSpeechRecognition() {
        if (!recognition) {
            results.innerHTML = '<p class="text-danger">Speech recognition is not supported in your browser.</p>';
            return;
        }

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            textInput.value = transcript;
            results.innerHTML = `
                <div class="text-center">
                    <p class="text-success">Listening...</p>
                    <button class="btn btn-danger" onclick="stopRecognition()">
                        <i class="bi bi-stop-fill"></i> Stop
                    </button>
                </div>
            `;
        };

        recognition.onerror = (event) => {
            results.innerHTML = `<p class="text-danger">Error: ${event.error}</p>`;
        };

        recognition.start();
    }

    function stopRecognition() {
        if (recognition) {
            recognition.stop();
        }
    }

    function showUrlResults(text) {
        const encoded = encodeURIComponent(text);
        const decoded = decodeURIComponent(text);
        
        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Encoded URL</h6>
                    <div class="border rounded p-2 bg-white">
                        <code>${encoded}</code>
                    </div>
                </div>
                <div class="col-md-6">
                    <h6>Decoded URL</h6>
                    <div class="border rounded p-2 bg-white">
                        <code>${decoded}</code>
                    </div>
                </div>
            </div>
        `;
    }

    function showFancyTextResults(text) {
        results.innerHTML = `
            <div class="text-center">
                <p class="text-muted">Use the buttons above to convert the text</p>
                <div class="border rounded p-3 bg-white">
                    <p class="mb-0">${text}</p>
                </div>
            </div>
        `;
    }

    function convertToFancyText(text, style) {
        const styles = {
            bold: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳',
            italic: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻',
            cursive: '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏',
            gothic: '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'
        };

        const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const fancy = styles[style];
        
        return text.split('').map(char => {
            const index = normal.indexOf(char);
            return index !== -1 ? fancy[index] : char;
        }).join('');
    }

    function generateRandomText() {
        const type = textTypeSelect.value;
        const length = parseInt(textLengthInput.value);
        let text = '';

        const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        const words = lorem.split(' ');
        const sentences = lorem.split('. ');

        switch (type) {
            case 'lorem':
                text = lorem.repeat(Math.ceil(length / lorem.length)).slice(0, length);
                break;
            case 'random':
                text = Array.from({ length }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
                break;
            case 'sentences':
                text = Array.from({ length: Math.ceil(length / 50) }, () => 
                    sentences[Math.floor(Math.random() * sentences.length)]
                ).join('. ') + '.';
                break;
            case 'paragraphs':
                text = Array.from({ length: Math.ceil(length / 200) }, () => 
                    lorem.repeat(Math.floor(Math.random() * 3) + 1)
                ).join('\n\n');
                break;
        }

        textInput.value = text;
        results.innerHTML = `
            <div class="text-center">
                <p class="text-success">Random text generated!</p>
                <div class="border rounded p-3 bg-white">
                    <p class="mb-0">${text}</p>
                </div>
            </div>
        `;
    }

    // Add global functions
    window.stopRecognition = stopRecognition;
}); 