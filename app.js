const app = {
    currentScreen: 'login',

    init() {
        this.navigate('login');
    },

    navigate(screenId) {
        this.currentScreen = screenId;
        const appContainer = document.getElementById('app');
        const template = document.getElementById(`screen-${screenId}`);

        if (!template) return;

        // Clear current content
        appContainer.innerHTML = '';

        // Clone and append new screen
        const content = template.content.cloneNode(true);
        appContainer.appendChild(content);

        // Re-initialize icons for new DOM elements
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Setup screen-specific logic
        this.setupScreenLogic(screenId);
    },

    setupScreenLogic(screenId) {
        if (screenId === 'login') {
            const btnLogin = document.getElementById('btn-login');
            const pnrInput = document.getElementById('pnr-input');
            const btnScan = document.getElementById('btn-scan');

            btnLogin.addEventListener('click', () => {
                const pnr = pnrInput.value.trim();
                // Simple validation for demo
                if (pnr.length >= 5) {
                    btnLogin.innerHTML = '<i data-lucide="loader" class="spin"></i> Verifying...';
                    lucide.createIcons();

                    setTimeout(() => {
                        this.navigate('order');
                    }, 1000);
                } else {
                    pnrInput.style.borderColor = 'var(--danger)';
                    setTimeout(() => pnrInput.style.borderColor = '', 1000);
                }
            });

            btnScan.addEventListener('click', () => {
                btnScan.innerHTML = '<i data-lucide="loader" class="spin"></i> Scanning...';
                lucide.createIcons();
                setTimeout(() => {
                    this.navigate('order');
                }, 1000);
            });
        }

        if (screenId === 'order') {
            const aiBtn = document.getElementById('btn-ai-order');
            const aiInput = document.getElementById('ai-order-input');

            aiBtn.addEventListener('click', () => {
                if (aiInput.value.trim() !== '') {
                    aiBtn.innerHTML = '<i data-lucide="check"></i>';
                    aiBtn.style.color = 'var(--success)';
                    lucide.createIcons();

                    setTimeout(() => {
                        this.navigate('tracking');
                    }, 800);
                }
            });

            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') aiBtn.click();
            });
        }

        if (screenId === 'tracking') {
            // Animate map pin
            const pin = document.querySelector('.pin-icon');
            if (pin) {
                let pos = 0;
                setInterval(() => {
                    pos = (pos + 1) % 100;
                    pin.style.left = pos + '%';
                }, 100);
            }
        }

        if (screenId === 'feedback') {
            const stars = document.querySelectorAll('.star');
            const textarea = document.getElementById('feedback-text');
            const sentimentBadge = document.getElementById('sentiment-badge');
            const sentimentText = document.getElementById('sentiment-text');
            const btnSubmit = document.getElementById('btn-submit-feedback');

            let currentRating = 0;

            stars.forEach(star => {
                star.addEventListener('click', (e) => {
                    const val = parseInt(e.currentTarget.dataset.val);
                    currentRating = val;

                    stars.forEach((s, index) => {
                        if (index < val) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });

                    triggerSentimentAnalysis();
                });
            });

            textarea.addEventListener('input', () => {
                triggerSentimentAnalysis();
            });

            function triggerSentimentAnalysis() {
                const text = textarea.value.toLowerCase();
                if (text.length > 5 || currentRating > 0) {
                    sentimentBadge.classList.remove('hidden');

                    // Simple simulated AI sentiment analysis
                    const negativeWords = ['late', 'cold', 'bad', 'terrible', 'worst', 'poor', 'spicy', 'stale'];
                    const positiveWords = ['good', 'great', 'hot', 'delicious', 'tasty', 'amazing', 'fast', 'yummy', 'excellent'];

                    let isNegative = currentRating > 0 && currentRating <= 2;
                    let isPositive = currentRating >= 4;

                    for (let word of negativeWords) {
                        if (text.includes(word)) isNegative = true;
                    }

                    for (let word of positiveWords) {
                        if (text.includes(word)) isPositive = true;
                    }

                    // Escalate low ratings
                    if (isNegative && !isPositive) {
                        sentimentBadge.className = 'ai-sentiment-badge negative';
                        sentimentBadge.innerHTML = '<i data-lucide="alert-triangle"></i> <span>Apologies! Escalatating to Kitchen Manager.</span>';
                    } else if (isPositive) {
                        sentimentBadge.className = 'ai-sentiment-badge positive';
                        sentimentBadge.innerHTML = '<i data-lucide="zap"></i> <span>Positive Experience Detected!</span>';
                    } else {
                        sentimentBadge.className = 'ai-sentiment-badge';
                        sentimentBadge.innerHTML = '<i data-lucide="zap"></i> <span>Analyzing feedback...</span>';
                    }

                    if (window.lucide) lucide.createIcons();
                } else {
                    sentimentBadge.classList.add('hidden');
                }
            }

            btnSubmit.addEventListener('click', () => {
                btnSubmit.innerHTML = '<i data-lucide="check-circle" class="mr-2"></i> Feedback Submitted!';
                btnSubmit.style.background = 'var(--success)';
                btnSubmit.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
                if (window.lucide) lucide.createIcons();

                setTimeout(() => {
                    app.navigate('order');
                }, 2000);
            });
        }
    },

    placeOrder() {
        this.navigate('tracking');
    }
};

// Add some extra CSS dynamically for spinner and active states
const style = document.createElement('style');
style.textContent = `
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .hidden { display: none !important; }
    .mr-2 { margin-right: 8px; }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
