// Menu functionality
const menuButton = document.getElementById('menuButton');
const fullscreenMenu = document.getElementById('fullscreenMenu');
const closeMenu = document.getElementById('closeMenu');
const navLinks = document.querySelectorAll('.nav-link');
const blogSearchInput = document.getElementById('blogSearchInput');
const blogTagButtons = document.querySelectorAll('.blog-tag');
const blogCards = document.querySelectorAll('#blog .blog-card');
const blogNoResults = document.getElementById('blogNoResults');

// Open menu
menuButton.addEventListener('click', () => {
    fullscreenMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close menu
closeMenu.addEventListener('click', () => {
    fullscreenMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageName = link.dataset.page;
        navigateTo(pageName);
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Navigation functionality
async function loadBlogPostIfNeeded(pageName, targetPage) {
    if (!targetPage || !pageName.startsWith('blog-post-') || targetPage.dataset.loaded === 'true') {
        return;
    }

    try {
        const response = await fetch(`blog-posts/${pageName}.html`);
        if (!response.ok) {
            throw new Error(`Unable to load ${pageName}`);
        }

        targetPage.innerHTML = await response.text();
        targetPage.dataset.loaded = 'true';
    } catch (error) {
        targetPage.innerHTML = `
            <div class="blog-post">
                <a href="#" class="back-link" onclick="navigateTo('blog'); return false;">← Back to Blog</a>
                <div class="blog-post-header">
                    <h1>Post unavailable</h1>
                </div>
                <div class="blog-post-content">
                    <p>Sorry, this blog post could not be loaded right now.</p>
                </div>
            </div>
        `;
        targetPage.dataset.loaded = 'error';
        console.error(error);
    }
}

async function navigateTo(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        await loadBlogPostIfNeeded(pageName, targetPage);
        targetPage.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Close menu when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

function getSelectedBlogLanguages() {
    return Array.from(blogTagButtons)
        .filter(button => button.classList.contains('active'))
        .map(button => button.dataset.tag);
}

function applyBlogFilters() {
    if (!blogCards.length) {
        return;
    }

    const query = (blogSearchInput?.value || '').trim().toLowerCase();
    const selectedLanguages = getSelectedBlogLanguages();
    const activeLanguages = selectedLanguages.length
        ? selectedLanguages
        : ['english', 'vietnamese'];

    let visibleCount = 0;

    blogCards.forEach(card => {
        const language = card.dataset.language || '';
        const searchableText = card.textContent.toLowerCase();
        const matchesQuery = !query || searchableText.includes(query);
        const matchesLanguage = activeLanguages.includes(language);
        const isVisible = matchesQuery && matchesLanguage;

        card.style.display = isVisible ? '' : 'none';

        if (isVisible) {
            visibleCount += 1;
        }
    });

    if (blogNoResults) {
        blogNoResults.hidden = visibleCount > 0;
    }
}

if (blogSearchInput) {
    blogSearchInput.addEventListener('input', applyBlogFilters);
}

blogTagButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        applyBlogFilters();
    });
});

applyBlogFilters();