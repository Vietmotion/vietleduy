// Menu functionality
const menuButton = document.getElementById('menuButton');
const fullscreenMenu = document.getElementById('fullscreenMenu');
const closeMenu = document.getElementById('closeMenu');
const navLinks = document.querySelectorAll('.nav-link');
const blogSearchInput = document.getElementById('blogSearchInput');
const blogTagButtons = document.querySelectorAll('.blog-tag');
const blogCards = document.querySelectorAll('#blog .blog-card');
const blogNoResults = document.getElementById('blogNoResults');
const themeToggle = document.getElementById('themeToggle');
const chapterRack = document.getElementById('chapterRack');
const chapterStoryPanel = document.getElementById('chapterStoryPanel');
const chapterStoryKicker = document.getElementById('chapterStoryKicker');
const chapterStoryTitle = document.getElementById('chapterStoryTitle');
const chapterStoryLead = document.getElementById('chapterStoryLead');
const chapterStoryBody = document.getElementById('chapterStoryBody');
const chapterStoryLock = document.getElementById('chapterStoryLock');
const prevChapterButton = document.getElementById('prevChapter');
const nextChapterButton = document.getElementById('nextChapter');
const chapterSelectSection = document.getElementById('chapterSelect');
const moveUpButton = document.getElementById('moveUpButton');

const chapterData = {
    1: {
        title: 'Childhood',
        kicker: 'Chapter 01',
        lead: 'The earliest chapter begins in Hanoi, where ordinary streets became the first place I learned to notice texture, light, and movement.',
        body: 'Warm memories from a late-90s childhood sit at the center of this chapter. The city felt alive in a quiet way, and that atmosphere shaped how I later saw images, spaces, and stories. It was the beginning of learning that everyday life could be turned into something meaningful.',
    },
    2: {
        title: 'The Young Eager Boiz',
        kicker: 'Chapter 02',
        lead: 'Rhythm came before strategy. Hip Hop gave the next chapter its pulse, attitude, and sense of movement.',
        body: 'As I got older, Hip Hop became more than music. It was style, discipline, and identity all at once. The culture taught me to pay attention to energy, to timing, and to the way a strong point of view can change how people feel about a piece of work.',
    },
    3: {
        title: 'Started The Creative Journey',
        kicker: 'Chapter 03',
        lead: 'Motion design was the bridge from curiosity to craft, beginning at 21ilab and continuing through Redcat Motion and DRAW.',
        body: 'Those years were about learning how images can move, how pacing changes meaning, and how a team can turn abstract ideas into something memorable. 21ilab, Redcat Motion, and DRAW each shaped a different part of that path, and together they formed the foundation for the work I do now.',
    },
    4: {
        title: 'MIGHTY STONE',
        kicker: 'Chapter 04',
        lead: 'Mighty Stone began as a way to turn creative instinct into a real studio with purpose.',
        body: 'Starting Mighty Stone meant building more than a brand name. It meant creating a place where design, motion, and story could meet strategy. The studio became a home for work that was meant to help people, not just decorate their timeline.',
    },
    5: {
        title: 'Viet Le Duy - Creative Director',
        kicker: 'Chapter 05',
        lead: 'This chapter is about becoming a Creative Director, working with technology, and building projects that help clients move forward.',
        body: 'As Mighty Stone grew, so did the scope of the work. I stepped further into the role of Creative Director while also living inside a world of technology, systems, and execution. That mix led to meaningful client projects and creative experiments, including work like ONIWIRE, where the goal was always to build something useful, beautiful, and real.',
    },
    6: {
        title: '...',
        kicker: 'Chapter 06',
        lead: 'This chapter is still locked.',
        body: 'You have not reached this stage yet. The chapter will open later as the story moves forward.',
        locked: true,
    },
    7: {
        title: '...',
        kicker: 'Chapter 07',
        lead: 'This chapter is still locked.',
        body: 'You have not reached this stage yet. The chapter will open later as the story moves forward.',
        locked: true,
    },
    8: {
        title: '...',
        kicker: 'Chapter 08',
        lead: 'This chapter is still locked.',
        body: 'You have not reached this stage yet. The chapter will open later as the story moves forward.',
        locked: true,
    },
    9: {
        title: '...',
        kicker: 'Chapter 09',
        lead: 'This chapter is still locked.',
        body: 'You have not reached this stage yet. The chapter will open later as the story moves forward.',
        locked: true,
    },
    10: {
        title: 'Thank you!',
        kicker: 'Chapter 10',
        lead: 'This chapter is still locked.',
        body: 'You have not reached this stage yet. The chapter will open later as the story moves forward.',
        locked: true,
    },
};

let activeChapterId = '1';
let chapterScrollAnimationFrame = null;

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
    updateMoveUpButtonVisibility();
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

function applyTheme(themeName) {
    const resolvedTheme = themeName === 'dark' ? 'dark' : 'light';
    document.body.dataset.theme = resolvedTheme;
    localStorage.setItem('vld-theme', resolvedTheme);

    if (themeToggle) {
        themeToggle.dataset.mode = resolvedTheme;
        themeToggle.setAttribute('aria-label', resolvedTheme === 'dark' ? 'Switch to bright mode' : 'Switch to dark mode');
    }
}

function getChapter(chapterId) {
    return chapterData[Number(chapterId)] || chapterData[1];
}

function syncChapterButtons(chapterId) {
    chapterButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.chapter === String(chapterId));
    });
}

function renderChapter(chapterId, options = {}) {
    const chapter = getChapter(chapterId);
    const isLocked = Boolean(chapter.locked || options.locked);

    if (chapterStoryKicker) {
        chapterStoryKicker.textContent = chapter.kicker;
    }

    if (chapterStoryTitle) {
        chapterStoryTitle.textContent = chapter.title;
    }

    if (chapterStoryLead) {
        chapterStoryLead.textContent = chapter.lead;
    }

    if (chapterStoryBody) {
        chapterStoryBody.textContent = chapter.body;
    }

    if (chapterStoryLock) {
        chapterStoryLock.hidden = !isLocked;
    }

    if (!isLocked && options.persist) {
        activeChapterId = String(chapterId);
        syncChapterButtons(activeChapterId);
    }
}

function moveChapter(direction) {
    const currentId = Number(activeChapterId);
    const nextId = Math.min(10, Math.max(1, currentId + direction));
    const nextChapter = getChapter(nextId);

    if (nextChapter.locked) {
        renderChapter(nextId, { locked: true });
        return;
    }

    renderChapter(nextId, { persist: true });
}

function startAcceleratedStoryPanelScroll() {
    if (!chapterStoryPanel) {
        return;
    }

    if (chapterScrollAnimationFrame) {
        cancelAnimationFrame(chapterScrollAnimationFrame);
        chapterScrollAnimationFrame = null;
    }

    const startY = window.scrollY;
    const targetY = chapterStoryPanel.getBoundingClientRect().top + window.scrollY - 18;
    const distance = targetY - startY;

    if (Math.abs(distance) < 4) {
        return;
    }

    const duration = 760;
    const startTime = performance.now();

    const easeInCubic = t => t * t * t;

    const step = now => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInCubic(progress);

        window.scrollTo({
            top: startY + distance * eased,
            behavior: 'auto',
        });

        if (progress < 1) {
            chapterScrollAnimationFrame = requestAnimationFrame(step);
        } else {
            chapterScrollAnimationFrame = null;
        }
    };

    chapterScrollAnimationFrame = requestAnimationFrame(step);
}

function scrollToChapterSelect() {
    if (!chapterSelectSection) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const targetY = chapterSelectSection.getBoundingClientRect().top + window.scrollY - 18;

    window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth',
    });
}

function updateMoveUpButtonVisibility() {
    if (!moveUpButton) {
        return;
    }

    const activePage = document.querySelector('.page.active');
    const isHomePage = activePage?.id === 'home';
    const defaultBottomOffset = window.innerWidth <= 480 ? 20 : 28;
    const defaultRightOffset = window.innerWidth <= 480 ? 20 : 40;
    let shouldShow = isHomePage && window.scrollY > 360;
    let targetRightOffset = moveUpButton.style.right || `${defaultRightOffset}px`;

    moveUpButton.style.bottom = `${defaultBottomOffset}px`;

    if (shouldShow && chapterStoryPanel) {
        const panelRect = chapterStoryPanel.getBoundingClientRect();
        const buttonHeight = moveUpButton.offsetHeight || 54;
        const minVisibleBottom = buttonHeight + defaultBottomOffset;
        const panelInsetRight = Math.max(defaultRightOffset, window.innerWidth - panelRect.right + defaultRightOffset);
        targetRightOffset = `${panelInsetRight}px`;

        if (panelRect.bottom <= minVisibleBottom) {
            shouldShow = false;
        } else {
            const overlap = Math.max(0, window.innerHeight - panelRect.bottom + defaultBottomOffset);
            moveUpButton.style.bottom = `${defaultBottomOffset + overlap}px`;
        }
    }

    if (shouldShow) {
        moveUpButton.style.right = targetRightOffset;
    }

    moveUpButton.classList.toggle('is-visible', shouldShow);
}

const chapterButtons = Array.from(document.querySelectorAll('.chapter-strip'));

chapterButtons.forEach(button => {
    const chapterId = button.dataset.chapter;

    button.addEventListener('mouseenter', () => {
        if (button.dataset.locked === 'true') {
            renderChapter(chapterId, { locked: true });
            return;
        }

        renderChapter(chapterId);
    });

    button.addEventListener('focus', () => {
        if (button.dataset.locked === 'true') {
            renderChapter(chapterId, { locked: true });
            return;
        }

        renderChapter(chapterId);
    });

    button.addEventListener('click', () => {
        if (button.dataset.locked === 'true') {
            renderChapter(chapterId, { locked: true });
            startAcceleratedStoryPanelScroll();
            return;
        }

        renderChapter(chapterId, { persist: true });
        startAcceleratedStoryPanelScroll();
    });
});

if (chapterRack) {
    chapterRack.addEventListener('mouseleave', () => {
        renderChapter(activeChapterId, { persist: true });
    });
}

if (prevChapterButton) {
    prevChapterButton.addEventListener('click', () => {
        moveChapter(-1);
    });
}

if (nextChapterButton) {
    nextChapterButton.addEventListener('click', () => {
        moveChapter(1);
    });
}

if (moveUpButton) {
    moveUpButton.addEventListener('click', () => {
        scrollToChapterSelect();
    });
}

window.addEventListener('scroll', updateMoveUpButtonVisibility, { passive: true });

if (themeToggle) {
    const storedTheme = localStorage.getItem('vld-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

    themeToggle.addEventListener('click', () => {
        applyTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
    });
} else {
    document.body.dataset.theme = localStorage.getItem('vld-theme') || 'light';
}

renderChapter(activeChapterId, { persist: true });
updateMoveUpButtonVisibility();