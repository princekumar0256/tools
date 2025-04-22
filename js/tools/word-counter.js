document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');

    // Update counts when text changes
    textInput.addEventListener('input', updateCounts);

    // Clear button functionality
    clearBtn.addEventListener('click', function() {
        textInput.value = '';
        updateCounts();
    });

    // Copy button functionality
    copyBtn.addEventListener('click', function() {
        textInput.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });

    function updateCounts() {
        const text = textInput.value;
        
        // Word count
        const words = text.trim().split(/\s+/);
        wordCount.textContent = text.trim() === '' ? '0' : words.length;
        
        // Character count
        charCount.textContent = text.length;
        
        // Sentence count
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        sentenceCount.textContent = sentences.length;
        
        // Paragraph count
        const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
        paragraphCount.textContent = paragraphs.length;
    }

    // Initialize counts
    updateCounts();
}); 