document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('social-form');
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
                case 'youtube-thumbnail':
                    downloadYouTubeThumbnail();
                    break;
                case 'instagram-photo':
                    downloadInstagramPhoto();
                    break;
                case 'twitter-video':
                    downloadTwitterVideo();
                    break;
                case 'facebook-video':
                    downloadFacebookVideo();
                    break;
                case 'tiktok-video':
                    downloadTikTokVideo();
                    break;
                case 'youtube-tags':
                    extractYouTubeTags();
                    break;
                case 'hashtag':
                    generateHashtags();
                    break;
                case 'post-generator':
                    generateSocialPost();
                    break;
                case 'emoji':
                    showEmojiKeyboard();
                    break;
                case 'twitter-counter':
                    updateTwitterCounter();
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

    // YouTube Thumbnail Downloader
    async function downloadYouTubeThumbnail() {
        const url = document.getElementById('youtube-url').value;
        if (!url) {
            throw new Error('Please enter a YouTube video URL');
        }

        const videoId = extractYouTubeId(url);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }

        const quality = document.querySelector('input[name="thumbnail-quality"]:checked').value;
        let thumbnailUrl;

        switch (quality) {
            case 'maxres':
                thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                break;
            case 'hq':
                thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                break;
            case 'mq':
                thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                break;
        }

        showResults('YouTube Thumbnail', `
            <div class="text-center">
                <img src="${thumbnailUrl}" class="img-fluid mb-3" alt="YouTube Thumbnail">
                <div>
                    <a href="${thumbnailUrl}" class="btn btn-primary" download>
                        <i class="bi bi-download"></i> Download
                    </a>
                </div>
            </div>
        `);
    }

    // Instagram Photo Downloader
    async function downloadInstagramPhoto() {
        const url = document.getElementById('instagram-url').value;
        if (!url) {
            throw new Error('Please enter an Instagram post URL');
        }

        try {
            const response = await fetch(`https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            
            showResults('Instagram Photo', `
                <div class="text-center">
                    <img src="${data.thumbnail_url}" class="img-fluid mb-3" alt="Instagram Photo">
                    <div>
                        <a href="${data.thumbnail_url}" class="btn btn-primary" download>
                            <i class="bi bi-download"></i> Download
                        </a>
                    </div>
                </div>
            `);
        } catch (error) {
            throw new Error('Failed to fetch Instagram photo. Please try again later.');
        }
    }

    // Twitter Video Downloader
    async function downloadTwitterVideo() {
        const url = document.getElementById('twitter-url').value;
        if (!url) {
            throw new Error('Please enter a Twitter video URL');
        }

        try {
            const response = await fetch(`https://api.twitter.com/1.1/statuses/show.json?id=${extractTwitterId(url)}`);
            const data = await response.json();
            
            if (data.extended_entities && data.extended_entities.media[0].video_info) {
                const videoUrl = data.extended_entities.media[0].video_info.variants[0].url;
                showResults('Twitter Video', `
                    <div class="text-center">
                        <video controls class="w-100 mb-3">
                            <source src="${videoUrl}" type="video/mp4">
                        </video>
                        <div>
                            <a href="${videoUrl}" class="btn btn-primary" download>
                                <i class="bi bi-download"></i> Download
                            </a>
                        </div>
                    </div>
                `);
            } else {
                throw new Error('No video found in this tweet');
            }
        } catch (error) {
            throw new Error('Failed to fetch Twitter video. Please try again later.');
        }
    }

    // Facebook Video Downloader
    async function downloadFacebookVideo() {
        const url = document.getElementById('facebook-url').value;
        if (!url) {
            throw new Error('Please enter a Facebook video URL');
        }

        try {
            const response = await fetch(`https://graph.facebook.com/v12.0/oembed_video?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            
            showResults('Facebook Video', `
                <div class="text-center">
                    <video controls class="w-100 mb-3">
                        <source src="${data.html}" type="video/mp4">
                    </video>
                    <div>
                        <a href="${data.html}" class="btn btn-primary" download>
                            <i class="bi bi-download"></i> Download
                        </a>
                    </div>
                </div>
            `);
        } catch (error) {
            throw new Error('Failed to fetch Facebook video. Please try again later.');
        }
    }

    // TikTok Video Downloader
    async function downloadTikTokVideo() {
        const url = document.getElementById('tiktok-url').value;
        if (!url) {
            throw new Error('Please enter a TikTok video URL');
        }

        try {
            const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            
            showResults('TikTok Video', `
                <div class="text-center">
                    <video controls class="w-100 mb-3">
                        <source src="${data.html}" type="video/mp4">
                    </video>
                    <div>
                        <a href="${data.html}" class="btn btn-primary" download>
                            <i class="bi bi-download"></i> Download
                        </a>
                    </div>
                </div>
            `);
        } catch (error) {
            throw new Error('Failed to fetch TikTok video. Please try again later.');
        }
    }

    // YouTube Tags Extractor
    async function extractYouTubeTags() {
        const url = document.getElementById('youtube-tags-url').value;
        if (!url) {
            throw new Error('Please enter a YouTube video URL');
        }

        const videoId = extractYouTubeId(url);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }

        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=YOUR_API_KEY`);
            const data = await response.json();
            
            if (data.items && data.items[0].snippet.tags) {
                const tags = data.items[0].snippet.tags;
                showResults('YouTube Tags', `
                    <div class="d-flex flex-wrap gap-2">
                        ${tags.map(tag => `<span class="badge bg-primary">${tag}</span>`).join('')}
                    </div>
                `);
            } else {
                throw new Error('No tags found for this video');
            }
        } catch (error) {
            throw new Error('Failed to extract YouTube tags. Please try again later.');
        }
    }

    // Hashtag Generator
    function generateHashtags() {
        const text = document.getElementById('hashtag-text').value;
        if (!text) {
            throw new Error('Please enter text to generate hashtags');
        }

        const removeSpaces = document.getElementById('remove-spaces').checked;
        const addNumbers = document.getElementById('add-numbers').checked;
        const includeTrending = document.getElementById('trending').checked;

        let hashtags = text.split(/\s+/).map(word => {
            if (removeSpaces) {
                word = word.replace(/\s+/g, '');
            }
            return `#${word}`;
        });

        if (addNumbers) {
            hashtags = hashtags.map(tag => `${tag}${Math.floor(Math.random() * 1000)}`);
        }

        if (includeTrending) {
            const trendingHashtags = ['#trending', '#viral', '#fyp', '#explore', '#instagood'];
            hashtags = [...hashtags, ...trendingHashtags];
        }

        showResults('Generated Hashtags', `
            <div class="d-flex flex-wrap gap-2">
                ${hashtags.map(tag => `<span class="badge bg-primary">${tag}</span>`).join('')}
            </div>
        `);
    }

    // Social Media Post Generator
    function generateSocialPost() {
        const platform = document.getElementById('post-platform').value;
        const type = document.getElementById('post-type').value;
        const topic = document.getElementById('post-topic').value;
        const tone = document.getElementById('post-tone').value;

        if (!topic) {
            throw new Error('Please enter a topic for the post');
        }

        const templates = {
            instagram: {
                promotional: {
                    professional: `🚀 Exciting news! We're thrilled to announce our latest ${topic} that will revolutionize your experience. Don't miss out!`,
                    casual: `Hey there! Check out our awesome new ${topic} - it's a game-changer! 😎`,
                    friendly: `Hey friends! We've got something special for you - our new ${topic}! Let us know what you think! 💖`,
                    humorous: `Guess what? We've been working on something epic! Introducing our new ${topic} - it's so cool, even our coffee machine is jealous! 😂`
                },
                informational: {
                    professional: `📚 Did you know? Here's everything you need to know about ${topic}.`,
                    casual: `Hey! Want to learn more about ${topic}? We've got you covered!`,
                    friendly: `Hey everyone! Let's talk about ${topic} - it's more interesting than you think!`,
                    humorous: `Time for some fun facts about ${topic}! You won't believe #3! 😲`
                }
            },
            twitter: {
                promotional: {
                    professional: `Introducing our new ${topic} - designed to enhance your experience. Learn more: [link]`,
                    casual: `Check out our new ${topic}! It's pretty cool if we do say so ourselves 😎`,
                    friendly: `Hey Twitter fam! We've got something new for you - ${topic}! Let us know what you think!`,
                    humorous: `Breaking news: Our new ${topic} is so good, it made our CEO do a happy dance! 🕺`
                },
                informational: {
                    professional: `Learn about ${topic} and how it can benefit you. #KnowledgeIsPower`,
                    casual: `Quick tip: Here's what you need to know about ${topic}!`,
                    friendly: `Hey there! Let's talk about ${topic} - it's more interesting than you think!`,
                    humorous: `Fun fact: ${topic} is more exciting than watching paint dry! 😂`
                }
            }
        };

        const post = templates[platform]?.[type]?.[tone] || 'Unable to generate post. Please try different options.';
        showResults('Generated Post', `
            <div class="p-3 bg-white rounded border">
                <p class="mb-0">${post}</p>
            </div>
        `);
    }

    // Emoji Keyboard
    function showEmojiKeyboard() {
        const searchTerm = document.getElementById('emoji-search').value.toLowerCase();
        const emojiGrid = document.getElementById('emoji-grid');
        emojiGrid.innerHTML = '';

        const emojis = {
            smileys: ['😊', '😂', '😍', '😎', '😘', '😜', '😁', '😇', '😋', '😏'],
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
            food: ['🍕', '🍔', '🍟', '🌭', '🍿', '🍦', '🍩', '🍪', '🍫', '🍬'],
            activities: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'],
            objects: ['📱', '💻', '⌚', '📷', '🎮', '🎧', '📚', '✏️', '📝', '🔍']
        };

        const selectedCategory = document.querySelector('.btn-group .active')?.dataset.category || 'smileys';
        const filteredEmojis = emojis[selectedCategory].filter(emoji => 
            emoji.toLowerCase().includes(searchTerm)
        );

        filteredEmojis.forEach(emoji => {
            const col = document.createElement('div');
            col.className = 'col-2';
            col.innerHTML = `
                <button class="btn btn-outline-primary w-100" onclick="copyToClipboard(this, '${emoji}')">
                    ${emoji}
                </button>
            `;
            emojiGrid.appendChild(col);
        });
    }

    // Twitter Character Counter
    function updateTwitterCounter() {
        const text = document.getElementById('tweet-text').value;
        const charCount = text.length;
        const remaining = 280 - charCount;
        const progress = (charCount / 280) * 100;

        document.getElementById('char-count').textContent = charCount;
        document.getElementById('remaining-chars').textContent = remaining;
        document.querySelector('.progress-bar').style.width = `${progress}%`;

        if (charCount > 280) {
            document.querySelector('.progress-bar').classList.add('bg-danger');
        } else {
            document.querySelector('.progress-bar').classList.remove('bg-danger');
        }
    }

    // Helper functions
    function extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function extractTwitterId(url) {
        const regExp = /twitter\.com\/\w+\/status\/(\d+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

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

    // Event listeners for real-time updates
    document.getElementById('tweet-text')?.addEventListener('input', updateTwitterCounter);
    document.getElementById('emoji-search')?.addEventListener('input', showEmojiKeyboard);
    document.querySelectorAll('.btn-group button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.btn-group button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            showEmojiKeyboard();
        });
    });

    // Form reset handler
    form.addEventListener('reset', () => {
        setTimeout(() => {
            results.innerHTML = '<p class="text-center text-muted">Select a tool and enter values to see results</p>';
            if (document.getElementById('char-count')) {
                updateTwitterCounter();
            }
        }, 0);
    });
});

// Global function to copy text to clipboard
function copyToClipboard(button, text = null) {
    const content = text || button.previousElementSibling.textContent;
    navigator.clipboard.writeText(content).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    });
} 