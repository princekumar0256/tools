// Load header and footer
function loadComponents() {
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        });

    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });
}

// Tool data structure
const tools = [
    // Image Tools
    {
        id: 'image-to-png',
        title: 'Image to PNG Converter',
        category: 'image',
        description: 'Convert any image format to PNG',
        icon: 'bi-image'
    },
    {
        id: 'image-to-jpg',
        title: 'Image to JPG Converter',
        category: 'image',
        description: 'Convert any image format to JPG',
        icon: 'bi-image'
    },
    {
        id: 'image-resizer',
        title: 'Image Resizer',
        category: 'image',
        description: 'Resize images while maintaining aspect ratio',
        icon: 'bi-arrows-angle-expand'
    },
    {
        id: 'image-compressor',
        title: 'Image Compressor',
        category: 'image',
        description: 'Compress images without losing quality',
        icon: 'bi-file-earmark-zip'
    },
    {
        id: 'image-cropper',
        title: 'Image Cropper',
        category: 'image',
        description: 'Crop images to any size',
        icon: 'bi-crop'
    },
    {
        id: 'image-to-base64',
        title: 'Image to Base64',
        category: 'image',
        description: 'Convert images to Base64 string',
        icon: 'bi-code-square'
    },
    {
        id: 'webp-to-png',
        title: 'WebP to PNG',
        category: 'image',
        description: 'Convert WebP images to PNG format',
        icon: 'bi-image'
    },
    {
        id: 'gif-maker',
        title: 'GIF Maker',
        category: 'image',
        description: 'Create GIFs from images or videos',
        icon: 'bi-film'
    },
    {
        id: 'qr-generator',
        title: 'QR Code Generator',
        category: 'image',
        description: 'Generate QR codes for URLs, text, and more',
        icon: 'bi-qr-code'
    },
    {
        id: 'screenshot-to-pdf',
        title: 'Screenshot to PDF',
        category: 'image',
        description: 'Convert screenshots to PDF documents',
        icon: 'bi-file-earmark-pdf'
    },
    // Text Tools
    {
        id: 'word-counter',
        title: 'Word Counter',
        category: 'text',
        description: 'Count words and characters in your text',
        icon: 'bi-text-paragraph'
    },
    {
        id: 'character-counter',
        title: 'Character Counter',
        category: 'text',
        description: 'Count characters in your text',
        icon: 'bi-text-left'
    },
    {
        id: 'case-converter',
        title: 'Case Converter',
        category: 'text',
        description: 'Convert text between different cases',
        icon: 'bi-text-case'
    },
    {
        id: 'text-to-speech',
        title: 'Text to Speech',
        category: 'text',
        description: 'Convert text to speech',
        icon: 'bi-megaphone'
    },
    {
        id: 'speech-to-text',
        title: 'Speech to Text',
        category: 'text',
        description: 'Convert speech to text',
        icon: 'bi-mic'
    },
    {
        id: 'url-encoder',
        title: 'URL Encoder',
        category: 'text',
        description: 'Encode URLs for web use',
        icon: 'bi-link-45deg'
    },
    {
        id: 'fancy-text',
        title: 'Fancy Text Generator',
        category: 'text',
        description: 'Generate fancy text styles',
        icon: 'bi-fonts'
    },
    {
        id: 'random-text',
        title: 'Random Text Generator',
        category: 'text',
        description: 'Generate random text',
        icon: 'bi-shuffle'
    },
    // Developer Tools
    {
        id: 'json-formatter',
        title: 'JSON Formatter',
        category: 'developer',
        description: 'Format and validate JSON',
        icon: 'bi-code-slash'
    },
    {
        id: 'html-to-markdown',
        title: 'HTML to Markdown',
        category: 'developer',
        description: 'Convert HTML to Markdown',
        icon: 'bi-file-earmark-text'
    },
    {
        id: 'css-minifier',
        title: 'CSS Minifier',
        category: 'developer',
        description: 'Minify CSS code',
        icon: 'bi-file-earmark-code'
    },
    {
        id: 'js-minifier',
        title: 'JavaScript Minifier',
        category: 'developer',
        description: 'Minify JavaScript code',
        icon: 'bi-file-earmark-code'
    },
    {
        id: 'sql-formatter',
        title: 'SQL Formatter',
        category: 'developer',
        description: 'Format SQL queries',
        icon: 'bi-database'
    },
    {
        id: 'color-picker',
        title: 'Color Picker',
        category: 'developer',
        description: 'Pick and convert colors',
        icon: 'bi-palette'
    },
    {
        id: 'base64-encoder',
        title: 'Base64 Encoder',
        category: 'developer',
        description: 'Encode and decode Base64',
        icon: 'bi-code-square'
    },
    {
        id: 'ip-lookup',
        title: 'IP Address Lookup',
        category: 'developer',
        description: 'Lookup IP address information',
        icon: 'bi-globe'
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
    loadTools();
    setupEventListeners();
});

// Load tools into the grid
function loadTools() {
    const toolsGrid = document.getElementById('tools-grid');
    toolsGrid.innerHTML = '';

    tools.forEach(tool => {
        const toolCard = createToolCard(tool);
        toolsGrid.appendChild(toolCard);
    });
}

// Create tool card element
function createToolCard(tool) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-lg-3 mb-4';
    
    col.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="bi ${tool.icon}"></i>
                    ${tool.title}
                </h5>
                <p class="card-text">${tool.description}</p>
                <a href="tools/${tool.id}.html" class="btn btn-primary">Use Tool</a>
            </div>
        </div>
    `;
    
    return col;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterTools(searchTerm);
    });

    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterToolsByCategory(category);
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Filter tools by search term
function filterTools(searchTerm) {
    const filteredTools = tools.filter(tool => 
        tool.title.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm)
    );
    displayFilteredTools(filteredTools);
}

// Filter tools by category
function filterToolsByCategory(category) {
    if (category === 'all') {
        loadTools();
        return;
    }
    
    const filteredTools = tools.filter(tool => tool.category === category);
    displayFilteredTools(filteredTools);
}

// Display filtered tools
function displayFilteredTools(filteredTools) {
    const toolsGrid = document.getElementById('tools-grid');
    toolsGrid.innerHTML = '';
    
    filteredTools.forEach(tool => {
        const toolCard = createToolCard(tool);
        toolsGrid.appendChild(toolCard);
    });
}

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    // Save theme preference to localStorage
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDark);
}

// Check for saved theme preference
function checkTheme() {
    const darkTheme = localStorage.getItem('darkTheme') === 'true';
    if (darkTheme) {
        document.body.classList.add('dark-theme');
    }
} 