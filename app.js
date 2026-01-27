document.addEventListener('DOMContentLoaded', () => {
    const screenContainer = document.getElementById('screen-container');
    const screenTitle = document.getElementById('screen-title');
    const navItems = document.querySelectorAll('.nav-item');
    const backBtn = document.getElementById('back-btn');

    // Webhook Endpoints
    const WEBHOOKS = {
        planning: 'https://n8n-1306.zeabur.app/webhook/keyword-planning',
        crawl: 'https://n8n-1306.zeabur.app/webhook/meta-crawling',
        cluster: 'https://n8n-1306.zeabur.app/webhook/keyword-clustering',
        onPage: 'https://n8n-1306.zeabur.app/webhook/on-page-seo',
        technical: 'https://n8n-1306.zeabur.app/webhook/technical-seo'
    };

    // Screen Templates
    const screens = {
        planning: {
            title: 'Keyword Planning Strategy',
            render: () => `
                <div class="fade-in">
                    <div class="card">
                        <span class="section-label">Strategy Setup</span>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <h3 style="font-weight: 700;">Foundation Details</h3>
                            <span style="color: var(--primary); font-size: 0.8rem; background: var(--primary-light); padding: 0.25rem 0.6rem; border-radius: 0.5rem;">Step 1</span>
                        </div>
                        <div style="height: 4px; background: #eee; border-radius: 2px;">
                            <div style="width: 30%; height: 100%; background: var(--primary); border-radius: 2px;"></div>
                        </div>
                    </div>

                    <div class="card" style="text-align: center; padding: 2rem 1.25rem;">
                        <div class="intro-icon-large" style="margin-top: 0; width: 80px; height: 80px; font-size: 2.5rem;">
                            <i class="fa-solid fa-compass-drafting"></i>
                        </div>
                        <h2 style="margin-bottom: 1rem;">Strategy Framework</h2>
                        <p style="color: var(--text-muted); font-size: 0.95rem;">Our AI will analyze your business foundation to build a comprehensive keyword strategy that aligns with your core solutions and target audience.</p>
                    </div>

                    <button class="cta-button" onclick="triggerWebhook('planning')">
                        Continue to Planning <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `
        },
        crawl: {
            title: 'Meta Data Crawler',
            render: () => `
                <div class="fade-in" style="text-align: center;">
                    <div class="intro-icon-large">
                        <i class="fa-solid fa-magnifying-glass-chart"></i>
                    </div>
                    <div class="screen-intro-text">
                        <h2>Meta Data Crawler</h2>
                        <p>Deep crawl any webpage to extract <strong>H1-H6 tags</strong>, <strong>Meta Titles</strong>, and SEO metadata in seconds.</p>
                    </div>
                    <button class="cta-button" onclick="triggerWebhook('crawl')">
                        Start Crawling
                    </button>
                </div>
            `
        },
        cluster: {
            title: 'Keyword Clustering',
            render: () => `
                <div class="fade-in" style="text-align: center;">
                    <div class="intro-icon-large" style="background: none; color: var(--primary);">
                         <img src="https://img.icons8.com/fluency/96/stack.png" width="80" alt="stack">
                    </div>
                    <div class="screen-intro-text">
                        <h2 style="margin-top: 1rem;">Keyword Clustering & Content</h2>
                        <p>Transform your raw keyword data into organized semantic clusters. Our AI will group related search terms and automatically draft optimized content briefs for your SEO strategy.</p>
                    </div>

                    <div class="form-group" style="margin-top: -1rem; margin-bottom: 2rem;">
                        <label class="section-label" style="text-align: left; color: var(--text-main); font-size: 0.7rem;">Number of Articles</label>
                        <input type="number" placeholder="Enter number of articles..." id="articles-count" value="10">
                    </div>

                    <button class="cta-button" onclick="triggerWebhook('cluster')">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Cluster & Generate Articles
                    </button>
                    <p style="text-transform: uppercase; color: var(--text-muted); font-size: 0.7rem; font-weight: 700; margin-top: 1.5rem; letter-spacing: 0.05em;">Start optimizing your content structure</p>
                </div>
            `
        },
        'on-page': {
            title: 'On-Page SEO Analysis',
            render: () => `
                <div class="fade-in" style="text-align: center;">
                    <div class="intro-icon-large">
                        <i class="fa-solid fa-file-invoice"></i>
                    </div>
                    <div class="screen-intro-text">
                        <h2>On-Page Audit</h2>
                        <p>Analyze your content's structure instantly. This tool scans <strong>keyword density</strong> for optimal balance and validates your <strong>header hierarchy</strong> to improve search engine visibility.</p>
                    </div>
                    <button class="cta-button" onclick="triggerWebhook('onPage')">
                        <i class="fa-solid fa-magnifying-glass"></i> Run On-Page Analysis
                    </button>
                    <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 1.5rem;">Results usually generate in under 10 seconds.</p>
                </div>
            `
        },
        technical: {
            title: 'Technical SEO Audit',
            render: () => `
                <div class="fade-in">
                    <div class="intro-icon-large">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <div class="screen-intro-text">
                        <h2>Technical Domain Scan</h2>
                        <p>Scan your entire domain for SEO technical health. We check for missing <strong>H1 tags</strong>, <strong>meta descriptions</strong>, <strong>noindex</strong> instructions, and <strong>no canonical</strong> tags.</p>
                    </div>

                    <div class="status-check-item">
                        <div class="info">
                            <i class="fa-solid fa-t" style="background: var(--primary-light); color: var(--primary); padding: 8px; border-radius: 8px;"></i>
                            <div>
                                <div style="font-weight: 700; font-size: 0.9rem;">H1 & Meta Description</div>
                                <div style="color: var(--text-muted); font-size: 0.75rem;">Detect missing or duplicate tags</div>
                            </div>
                        </div>
                        <i class="fa-solid fa-circle-check check"></i>
                    </div>

                    <div class="status-check-item">
                        <div class="info">
                            <i class="fa-solid fa-eye-slash" style="background: #f5f3ff; color: #8b5cf6; padding: 8px; border-radius: 8px;"></i>
                            <div>
                                <div style="font-weight: 700; font-size: 0.9rem;">Noindex & No Canonical</div>
                                <div style="color: var(--text-muted); font-size: 0.75rem;">Check crawlability & indexing</div>
                            </div>
                        </div>
                        <i class="fa-solid fa-circle-check check"></i>
                    </div>

                    <button class="cta-button" style="margin-top: 2rem;" onclick="triggerWebhook('technical')">
                        Start Technical Audit
                    </button>
                    <p style="text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: 1rem;">Complete domain audit takes 1-3 minutes.</p>
                </div>
            `
        }
    };

    // Navigation Logic
    window.switchScreen = (screenName) => {
        const screen = screens[screenName];
        if (!screen) return;

        // Update UI
        screenTitle.textContent = screen.title;
        screenContainer.innerHTML = screen.render();

        // Update Nav Active State
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.screen === screenName);
        });

        // Hide/Show Back Button (Simple Logic: hide on first screen)
        backBtn.style.visibility = screenName === 'planning' ? 'hidden' : 'visible';
    };

    // Webhook Trigger Logic
    window.triggerWebhook = async (action) => {
        const url = WEBHOOKS[action];
        const btn = event.currentTarget;
        const originalContent = btn.innerHTML;

        // Loading State
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Triggering...';

        try {
            // Gather data if needed (e.g., from planning form)
            const payload = {};
            if (action === 'cluster') {
                payload.numberOfArticles = document.getElementById('articles-count').value;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
                btn.style.background = 'var(--success)';
                btn.style.boxShadow = '0 4px 14px 0 rgba(34, 197, 94, 0.39)';
            } else {
                throw new Error('Webhook failed');
            }
        } catch (error) {
            console.error(error);
            btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed';
            btn.style.background = '#ef4444';
        } finally {
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalContent;
                btn.style.background = '';
                btn.style.boxShadow = '';
            }, 3000);
        }
    };

    // Event Listeners
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchScreen(item.dataset.screen);
        });
    });

    backBtn.addEventListener('click', () => {
        // Simple back logic: go to first screen
        switchScreen('planning');
    });

    // Initialize with first screen
    switchScreen('planning');
});
