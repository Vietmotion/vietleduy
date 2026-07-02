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
        lead: 'I was born in Da Lat, the cold and beautiful mountain city that I still think of as one of the best places in Vietnam.',
        bodyBlocks: [
            {
                type: 'paragraph',
                text: 'Back then, life moved slowly. The city was quiet, the mornings were cold, and sometimes I could see my own breath in the air on the way to school. There was no big dream in my head yet. No clear direction. Just a little kid growing up among the hills, going to school in the morning, walking home in the afternoon, living a life that did not seem very different from anyone else\'s.',
            },
            {
                type: 'image',
                src: 'img/childhood.jpg',
                alt: 'Viet Le Duy childhood photo in Da Lat',
                caption: 'A childhood memory from Da Lat.',
            },
            {
                type: 'paragraph',
                text: 'But maybe some things were already being planted quietly.',
            },
            {
                type: 'paragraph',
                text: 'When I was around four or five, my uncle was living at my grandfather\'s house while studying in Da Lat. He had a computer. I did not know it at the time, but having the chance to touch a computer that early was something rare. It opened a small door. Maybe that was one of the reasons I later became a little faster with computers, technology, and all the strange creative things that could happen on a screen.',
            },
            {
                type: 'paragraph',
                text: 'There was also art in the family, even if nobody called it that so loudly.',
            },
            {
                type: 'paragraph',
                text: 'My father was a photographer. He would go out to take pictures for tourists visiting Da Lat, sometimes going to hotels and calling clients down for their photos. Back then, not everyone had a camera. A photograph still felt like something special, something worth dressing up for, something worth keeping.',
            },
            {
                type: 'paragraph',
                text: 'My grandfather had his own kind of art too. He did pyrography, drawing with fire on wood. I still remember some of his works being really beautiful. Sadly, we did not keep them. They now exist only in memory, like smoke from something once burning.',
            },
            {
                type: 'paragraph',
                text: 'Later, my family opened a computer game shop. A few years after that, when the internet arrived, it became an internet game shop. The business was not very successful and eventually stopped when I was in second grade. But during that time, something important had already happened.',
            },
            {
                type: 'paragraph',
                text: 'I played games. I used Yahoo. I touched the early internet when it still felt like a secret universe. I started to feel the joy of making, discovering, and playing with cool things.',
            },
            {
                type: 'paragraph',
                text: 'It was not yet anything with a name.',
            },
            {
                type: 'paragraph',
                text: 'It was not yet something I could explain.',
            },
            {
                type: 'paragraph',
                text: 'It was not yet a career.',
            },
            {
                type: 'paragraph',
                text: 'It was just a cold city, a small kid, a family full of quiet art, and a computer screen glowing somewhere in the early years.',
            },
            {
                type: 'paragraph',
                text: 'That was where the first chapter began.',
            },
        ],
    },
    2: {
        title: 'The Young Eager Boiz',
        kicker: 'Chapter 02',
        lead: 'As I grew up, I still did not really know what I liked, who I wanted to become, or where I was heading.',
        bodyBlocks: [
            {
                type: 'paragraph',
                text: 'My family was running an internet shop at the time, so games and computers were already part of my daily life. But somehow, that made gaming feel almost normal to me. It was fun, but it was not the thing that lit the whole room on fire.',
            },
            {
                type: 'paragraph',
                text: 'Then something else appeared.',
            },
            {
                type: 'image',
                src: 'img/viethiphop9.jpg',
                alt: 'Early schoolyard hip hop energy',
                caption: 'The first pull toward movement.',
            },
            {
                type: 'paragraph',
                text: 'My first year of third grade was not exactly great in terms of studying. But one day, in the school backyard, I saw some older guys doing handstands and windmills. I had no idea what it was. I just knew it looked impossible, and therefore, extremely cool.',
            },
            {
                type: 'paragraph',
                text: 'I spent entire break times standing there, watching them practice.',
            },
            {
                type: 'paragraph',
                text: 'Until one day, I asked to join.',
            },
            {
                type: 'paragraph',
                text: 'That small question opened another door.',
            },
            {
                type: 'paragraph',
                text: 'Around that time, I found a video of Last For One performing at BOTY 2005. I still watch that showcase even now. The movement, the teamwork, the music, the wild tricks, the way everyone moved together with so much energy. Something in that video hit me hard. It pulled me into the world of b-boying before I even fully understood what that world was.',
            },
            {
                type: 'image',
                src: 'img/OMG crew.jpg',
                alt: 'OMG Crew practice and crew spirit',
                caption: 'OMG Crew era: loud, hungry, and full of energy.',
            },
            {
                type: 'paragraph',
                text: 'Not long after, I joined a neighborhood crew called OMG Crew.',
            },
            {
                type: 'paragraph',
                text: 'And suddenly, my memories had a soundtrack.',
            },
            {
                type: 'paragraph',
                text: 'We practiced. We battled. We joined showcases, competitions, and small events. We were young, loud, hungry, and full of energy. I will never forget that period. If Chapter 01 was quiet Da Lat mornings, this chapter was schoolyard concrete, spinning sneakers, sore arms, and the feeling of trying again after falling for the hundredth time.',
            },
            {
                type: 'paragraph',
                text: 'That became one of the strongest memories of my younger years.',
            },
            {
                type: 'image',
                src: 'img/viethiphop8.jpg',
                alt: 'University Village practice floor',
                caption: 'Early evenings in University Village.',
            },
            {
                type: 'paragraph',
                text: 'Later, I carried that love with me into university.',
            },
            {
                type: 'paragraph',
                text: 'My university was far from the center of Ho Chi Minh City, in an area we called the University Village. It had around eight universities gathered together, which made the whole place feel like a strange little country of students. I had more free time than I expected, so I started practicing alone on the ground floor of a student residence in the early evenings.',
            },
            {
                type: 'paragraph',
                text: 'Day after day, I kept going back.',
            },
            {
                type: 'paragraph',
                text: 'Then one day, another guy showed up at the exact same place to practice.',
            },
            {
                type: 'paragraph',
                text: 'I walked over and said, "Hey, let\'s do this together."',
            },
            {
                type: 'paragraph',
                text: 'That guy was Ti, now Minh Ti, a stand-up comedian and the CEO of Monstio, a creative studio focused on great cartoon character design. Even back then, he was already one of the most talented people I knew.',
            },
            {
                type: 'image',
                src: 'img/viethiphop4.jpg',
                alt: 'Viet Le Duy and Minh Ti during practice days',
                caption: 'Me and Minh Ti in those early practice years.',
            },
            {
                type: 'paragraph',
                text: 'For some reason, more and more people started showing up. One person became two. Two became a small group. And from that strange little gathering, we founded Monkeez Crew, the first hip hop crew in the area.',
            },
            {
                type: 'paragraph',
                text: 'To be honest, we were not exactly great at hip hop back then.',
            },
            {
                type: 'paragraph',
                text: 'But we had energy. And sometimes, energy is enough to start something.',
            },
            {
                type: 'image',
                src: 'img/viethiphop10.jpg',
                alt: 'Crew growth and battles',
                caption: 'From small gatherings to a bigger movement.',
            },
            {
                type: 'paragraph',
                text: 'A few months later, we met Waking Crew, another crew from the same area. They were all b-boys, and of course, they looked far cooler than us. They had tricks, power moves, and that sharper battle energy. Monkeez had some very weird basic hip hop moves.',
            },
            {
                type: 'paragraph',
                text: 'But it was fun.',
            },
            {
                type: 'paragraph',
                text: 'We met. We battled. We practiced. Then instead of staying separate, we decided to join forces and become something bigger.',
            },
            {
                type: 'paragraph',
                text: 'That was how Universe Family began.',
            },
            {
                type: 'paragraph',
                text: 'We practiced together, shared what we knew, created choreographies, joined local competitions, and even won a few awards. At some point, we became known around the University Village. We were not one of the greatest dance clubs in Ho Chi Minh City, but in our little world, we were something.',
            },
            {
                type: 'paragraph',
                text: 'At our peak, around 50 people joined the club and practiced together.',
            },
            {
                type: 'paragraph',
                text: 'For a while, it felt like it could last forever.',
            },
            {
                type: 'paragraph',
                text: 'But time does what time always does. People grew up. We went to work. Some started families. Life moved forward. The crews and the club are still there in some form, and the groove never really disappeared. But those exact days, that exact feeling, that exact wild happiness of being young together, those things belong to their own time now.',
            },
            {
                type: 'paragraph',
                text: 'Looking back, it still makes me feel something.',
            },
            {
                type: 'paragraph',
                text: 'We were not perfect. We were not famous. We were not supposed to become anything big.',
            },
            {
                type: 'paragraph',
                text: 'But somehow, we built a small world from nothing.',
            },
            {
                type: 'paragraph',
                text: 'And maybe that was one of the first times I learned how powerful a dream can become when people gather around it.',
            },
        ],
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
let moveUpScrollAnimationFrame = null;

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

function renderChapterBody(chapter) {
    if (!chapterStoryBody) {
        return;
    }

    if (Array.isArray(chapter.bodyBlocks) && chapter.bodyBlocks.length) {
        const nodes = chapter.bodyBlocks
            .map(block => {
                if (!block || typeof block !== 'object') {
                    return null;
                }

                if (block.type === 'image' && block.src) {
                    const figure = document.createElement('figure');
                    figure.className = 'chapter-story-media';

                    const image = document.createElement('img');
                    image.src = block.src;
                    image.alt = block.alt || '';
                    image.loading = 'lazy';
                    image.decoding = 'async';
                    figure.appendChild(image);

                    if (block.caption) {
                        const caption = document.createElement('figcaption');
                        caption.textContent = block.caption;
                        figure.appendChild(caption);
                    }

                    return figure;
                }

                if (block.type === 'paragraph' && block.text) {
                    const paragraphNode = document.createElement('p');
                    paragraphNode.textContent = block.text;
                    return paragraphNode;
                }

                return null;
            })
            .filter(Boolean);

        chapterStoryBody.replaceChildren(...nodes);
        return;
    }

    const paragraphList = Array.isArray(chapter.bodyParagraphs) && chapter.bodyParagraphs.length
        ? chapter.bodyParagraphs
        : [chapter.body];

    const paragraphElements = paragraphList
        .filter(Boolean)
        .map(paragraph => {
            const paragraphNode = document.createElement('p');
            paragraphNode.textContent = paragraph;
            return paragraphNode;
        });

    chapterStoryBody.replaceChildren(...paragraphElements);
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

    renderChapterBody(chapter);

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
    const targetY = chapterSelectSection
        ? Math.max(0, chapterSelectSection.getBoundingClientRect().top + window.scrollY - 18)
        : 0;

    if (moveUpScrollAnimationFrame) {
        cancelAnimationFrame(moveUpScrollAnimationFrame);
        moveUpScrollAnimationFrame = null;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
        window.scrollTo({ top: targetY, behavior: 'auto' });
        return;
    }

    const duration = 1120;
    const startTime = performance.now();
    const easeInOutCubic = t => (
        t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2
    );

    const step = now => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        window.scrollTo({
            top: startY + distance * eased,
            behavior: 'auto',
        });

        if (progress < 1) {
            moveUpScrollAnimationFrame = requestAnimationFrame(step);
        } else {
            moveUpScrollAnimationFrame = null;
        }
    };

    moveUpScrollAnimationFrame = requestAnimationFrame(step);
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