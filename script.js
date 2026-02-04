const CONFIG = {
    webhooks: {
        'keyword-planning': 'https://n8n-1306.zeabur.app/webhook/keyword-planning',
        'meta-data': 'https://n8n-1306.zeabur.app/webhook/meta-crawling',
        'keyword-clustering': 'https://n8n-1306.zeabur.app/webhook/keyword-clustering',
        'on-page-seo': 'https://n8n-1306.zeabur.app/webhook/on-page-seo',
        'technical-audit': 'https://n8n-1306.zeabur.app/webhook/technical-seo'
    },
    pages: {
        'keyword-planning': {
            title: 'Keyword Planning',
            description: 'Configure your strategy parameters to generate high-intent keyword opportunities.',
            inputs: [
                { id: 'client', label: 'Client', placeholder: 'e.g. Acme Corp', type: 'text' },
                { id: 'domain', label: 'Domain', placeholder: 'example.com', type: 'text' },
                { id: 'target_audience', label: 'Target Audience', placeholder: 'e.g. CTOs at B2B Tech Startups', type: 'text' },
                { id: 'user_intent', label: 'User Intent', placeholder: 'e.g. Purchase Intent', type: 'text' },
                { id: 'solution', label: 'Solution', placeholder: 'Describe the solution you are offering in detail...', type: 'textarea', fullWidth: true }
            ]
        },
        'meta-data': {
            title: 'Meta Data Crawler',
            description: 'Bulk analyze titles, descriptions, and H-tags for any set of URLs.',
            buttonText: 'Start Crawl',
            estimatedTime: '~4 minutes for 1,000 URLs',
            features: [
                { title: 'Page Titles', subtitle: 'FIXED ITEM' },
                { title: 'Meta Description', subtitle: 'FIXED ITEM' },
                { title: 'H1 Tag', subtitle: 'FIXED ITEM' },
                { title: 'Canonical Tag', subtitle: 'FIXED ITEM' },
                { title: 'No-index Tag', subtitle: 'FIXED ITEM' }
            ],
            inputs: [
                { id: 'client_sitemap', label: 'Client sitemap', placeholder: 'https://example.com/sitemap.xml', type: 'text', icon: 'fas fa-sitemap', fullWidth: true },
                { id: 'url_list', label: 'Bulk URL Input', placeholder: 'Enter URLs here, one per line...', type: 'textarea', fullWidth: true }
            ]
        },
        'keyword-clustering': {
            title: 'Keyword Clustering',
            description: 'Define your volume thresholds and article count to organize your content strategy.',
            cardTitle: 'Clustering Parameters',
            gridCols: 3,
            inputs: [
                { id: 'client_page_id', label: 'Client page ID', placeholder: '500', type: 'text', help: 'Target volume for high-level pillar keywords.' },
                { id: 'volume_threshold', label: 'Volume threshold', placeholder: '600', type: 'number', help: 'Minimum threshold for supporting long-tail variations.' },
                { id: 'num_articles', label: 'Number of articles', placeholder: '2', type: 'number', help: 'Total number of articles to generate for the cluster.' }
            ]
        },
        'on-page-seo': {
            title: 'On-Page SEO Analysis',
            description: 'Analyze your webpage\'s SEO performance and accessibility across devices.',
            cardTitle: 'Enter Website URL',
            inputs: [
                { id: 'website_url', label: 'Website URL', placeholder: '', type: 'text', icon: 'fas fa-link', fullWidth: true },
                { id: 'keyword_database', label: 'Keyword Database URL', placeholder: '', type: 'text', icon: 'fas fa-database', fullWidth: true },
                { id: 'client_sitemap', label: 'Client Sitemap URL', placeholder: '', type: 'text', icon: 'fas fa-sitemap', fullWidth: true },
                { id: 'content_brief_template', label: 'Content brief template', placeholder: '', type: 'text', icon: 'fas fa-file-invoice', fullWidth: true }
            ],
            buttons: [
                { id: 'validate', text: 'Validate & Analyze URL', icon: 'fas fa-chart-line' }
            ]
        },
        'technical-audit': {
            title: 'Technical Audit Setup',
            description: 'Ready to start your technical audit? Click below to begin the analysis of your website\'s performance and SEO health.',
            inputs: [
                { id: 'client_sitemap', label: 'Client sitemap', placeholder: 'https://example.com/sitemap.xml', type: 'text', icon: 'fas fa-sitemap', fullWidth: true }
            ],
            buttons: [
                { id: 'run', text: 'RUN TASK', icon: 'fas fa-bolt' }
            ]
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadPage('keyword-planning');
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('data-page');

            // Update active state
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            loadPage(pageId);
        });
    });

    // Success Modal Close Logic
    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    }

    // Close modal on click outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}

function showModal(message) {
    const modal = document.getElementById('success-modal');
    const messageEl = document.getElementById('modal-message');
    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.style.display = 'flex';
        // Force reflow for transition
        modal.offsetHeight;
        modal.classList.add('active');
    }
}

function loadPage(pageId) {
    const pageData = CONFIG.pages[pageId];
    const contentArea = document.getElementById('page-content');
    const breadcrumb = document.getElementById('current-page-breadcrumb');

    breadcrumb.textContent = pageData.title;

    let inputsHtml = '';
    pageData.inputs.forEach(input => {
        const fullWidthClass = input.fullWidth ? 'full-width' : '';
        let inputField = '';

        if (input.type === 'select') {
            inputField = `
                <select id="${input.id}" class="form-control">
                    ${input.options.map(opt => `<option value="${opt === 'Select primary intent...' ? '' : opt}">${opt}</option>`).join('')}
                </select>
            `;
        } else if (input.type === 'textarea') {
            inputField = `<textarea id="${input.id}" class="form-control" placeholder="${input.placeholder}"></textarea>`;
        } else {
            inputField = `
                <div class="input-with-icon">
                    ${input.icon ? `<i class="${input.icon} input-field-icon"></i>` : ''}
                    <input type="${input.type}" id="${input.id}" class="form-control ${input.icon ? 'has-icon' : ''}" value="${input.placeholder || ''}" placeholder="${input.placeholder}">
                </div>
            `;
        }

        inputsHtml += `
            <div class="form-group ${fullWidthClass}">
                ${input.label ? `
                    <label for="${input.id}">
                        ${input.label}
                        ${input.help ? `<i class="fas fa-info-circle label-info"></i>` : ''}
                    </label>
                ` : ''}
                ${inputField}
                ${input.help ? `<p class="input-help">${input.help}</p>` : ''}
            </div>
        `;
    });

    let featuresHtml = '';
    if (pageData.features) {
        featuresHtml = `
            <div class="features-section">
                <h3 class="features-title">Included Features</h3>
                <div class="features-grid">
                    ${pageData.features.map(f => `
                        <div class="feature-card">
                            <div class="feature-check"><i class="fas fa-check-circle"></i></div>
                            <div class="feature-info">
                                <span class="feature-name">${f.title}</span>
                                <span class="feature-status">${f.subtitle}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    contentArea.innerHTML = `
        <div class="page-header">
            <h1>${pageData.title}</h1>
            <p class="page-description">${pageData.description}</p>
        </div>

        <div class="card">
            ${pageData.cardTitle ? `<h2 class="card-title">${pageData.cardTitle}</h2>` : ''}
            <form id="task-form">
                <div class="form-grid" style="${pageData.gridCols ? `grid-template-columns: repeat(${pageData.gridCols}, 1fr);` : ''}">
                    ${inputsHtml}
                </div>
                
                ${featuresHtml}

                <div class="card-footer" style="${pageData.buttons ? 'justify-content: center;' : ''}">
                    ${!pageData.buttons ? `
                        <div class="execution-time">
                            <i class="fas fa-info-circle"></i>
                            ${pageData.estimatedTime || 'Estimated generation time: 2-3 minutes'}
                        </div>
                    ` : ''}
                    <div class="form-actions" style="${pageData.buttons ? 'width: 100%; gap: 20px;' : ''}">
                        ${pageData.buttons ? pageData.buttons.map(btn => `
                            <button type="${btn.id === 'cancel' ? 'button' : 'submit'}" class="${btn.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}" style="flex: 1; justify-content: center;" id="${btn.id}_btn">
                                ${btn.icon ? `<i class="${btn.icon}"></i>` : ''}
                                ${btn.text}
                            </button>
                        `).join('') : `
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-play"></i>
                                ${pageData.buttonText || 'Run Task'}
                            </button>
                        `}
                    </div>
                </div>
            </form>
        </div>

        <div class="info-badges">
            <div class="info-badge info-badge-blue">
                <div class="info-icon"><i class="fas fa-sparkles"></i></div>
                <div class="info-content">
                    <h4>Context-Aware Planning</h4>
                    <p>Our AI uses your inputs to discover niche keywords aligned with your specific solution and audience.</p>
                </div>
            </div>
            <div class="info-badge info-badge-green">
                <div class="info-icon"><i class="fas fa-check-circle"></i></div>
                <div class="info-content">
                    <h4>Drive Sync Enabled</h4>
                    <p>Strategy maps and keyword lists will be automatically saved to your connected Google Drive.</p>
                </div>
            </div>
        </div>
    `;

    // Handle form submission
    const form = document.getElementById('task-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        runTask(pageId);
    });
}

async function runTask(pageId) {
    const pageData = CONFIG.pages[pageId];
    const formData = {};
    const submitBtn = document.querySelector('.btn-primary');
    const originalBtnHtml = submitBtn.innerHTML;

    pageData.inputs.forEach(input => {
        const element = document.getElementById(input.id);
        formData[input.id] = element.value;
    });

    console.log(`Running task for ${pageId}...`, formData);

    // Visual feedback
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(CONFIG.webhooks[pageId], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showModal(`Your task "${pageData.title}" has been successfully started and is processing in the background.`);
        } else {
            alert(`Error starting task: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Webhook error:', error);
        alert('Failed to trigger webhook. Check console for details.');
    } finally {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
    }
}
