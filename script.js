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
const artVinylButtons = Array.from(document.querySelectorAll('.art-vinyl-piece'));
const artSelectedTitle = document.getElementById('artSelectedTitle');
const artSelectedMeta = document.getElementById('artSelectedMeta');
const artSelectedDescription = document.getElementById('artSelectedDescription');
const artSelectedTags = document.getElementById('artSelectedTags');
const artSelectedImage = document.getElementById('artSelectedImage');
const artTurntableVisual = document.getElementById('artTurntableVisual');
const artVinylStack = document.getElementById('artVinylStack');
const artVinylStage = document.querySelector('.art-vinyl-stage');
const artFullviewButton = document.getElementById('artFullviewButton');
const artModal = document.getElementById('artModal');
const artModalClose = document.getElementById('artModalClose');
const artModalImage = document.getElementById('artModalImage');
const artModalCaption = document.getElementById('artModalCaption');

let currentArtId = 'lola-trip';
let showcaseSnapTimeout = null;
let isShowcaseSnapping = false;

artVinylButtons.forEach((button, index) => {
    const centerIndex = (artVinylButtons.length - 1) / 2;
    const spreadIndex = index - centerIndex;
    const depth = index * 1.25;
    const isFirst = index === 0;
    const isLast = index === artVinylButtons.length - 1;

    let edgeHoverShift = 0;
    let edgeSelectShift = 0;

    if (isFirst) {
        edgeHoverShift = 1.15;
        edgeSelectShift = 2.05;
    } else if (isLast) {
        edgeHoverShift = -1.15;
        edgeSelectShift = -2.05;
    }

    button.style.setProperty('--stack-x', `${spreadIndex * 0.95}rem`);
    button.style.setProperty('--stack-y', `${Math.abs(spreadIndex) * 0.08}rem`);
    button.style.setProperty('--stack-z', `${depth}px`);
    button.style.setProperty('--stack-rot-x', `${10 + Math.abs(spreadIndex) * 0.14}deg`);
    button.style.setProperty('--stack-rot-y', `${spreadIndex * 2.15}deg`);
    button.style.setProperty('--stack-rot-z', `${spreadIndex * 0.12}deg`);
    button.style.setProperty('--stack-order', String(100 - Math.abs(spreadIndex)));
    button.style.setProperty('--edge-hover-shift', `${edgeHoverShift}rem`);
    button.style.setProperty('--edge-select-shift', `${edgeSelectShift}rem`);
});

function updateArtStackGutters() {
    if (!artVinylStack || !artVinylButtons.length) {
        return;
    }

    const sampleCard = artVinylButtons[0];
    const gutter = Math.max(18, (artVinylStack.clientWidth - sampleCard.offsetWidth) / 2);
    artVinylStack.style.paddingLeft = `${gutter}px`;
    artVinylStack.style.paddingRight = `${gutter}px`;
}

function isGalleryPageActive() {
    const activePage = document.querySelector('.page.active');
    return activePage?.id === 'gallery';
}

function shouldAutoScrollOnHover(button) {
    if (!artVinylStack || !button) {
        return false;
    }

    const stackRect = artVinylStack.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const edgeTrigger = Math.max(72, stackRect.width * 0.18);
    const nearLeft = buttonRect.left <= stackRect.left + edgeTrigger;
    const nearRight = buttonRect.right >= stackRect.right - edgeTrigger;

    return nearLeft || nearRight;
}

function maybeSnapToShowcase() {
    if (!artVinylStage || !isGalleryPageActive() || isShowcaseSnapping) {
        return;
    }

    const stageRect = artVinylStage.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const stickyTopOffset = viewportHeight >= 1000 ? 56 : 28;
    const isPartiallyCrossed = stageRect.top < viewportHeight * 0.28 && stageRect.bottom > viewportHeight * 0.58;
    const isNearStage = stageRect.top < viewportHeight * 0.7 && stageRect.bottom > viewportHeight * 0.3;
    const isMisaligned = Math.abs(stageRect.top - stickyTopOffset) > 20;

    if (!isPartiallyCrossed || !isNearStage || !isMisaligned) {
        return;
    }

    isShowcaseSnapping = true;

    const targetTop = Math.max(0, window.scrollY + stageRect.top - stickyTopOffset);
    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    window.setTimeout(() => {
        isShowcaseSnapping = false;
    }, 520);
}

const artPieces = {
    'lola-trip': {
        title: 'Lola Trip',
        type: '3D Art',
        meta: 'Featured 3D work · 2026',
        description: 'The first piece in the stack and the opening note for the 3D side of the archive.',
        image: 'art/Lola Trip.png',
        coverImage: 'art/Lola Trip.png',
        alt: 'Lola Trip 3D artwork',
        tags: ['3D Art', 'Featured', 'Lola Trip'],
        background: 'radial-gradient(circle at 25% 15%, rgba(255, 255, 255, 0.34), transparent 28%), radial-gradient(circle at 70% 20%, rgba(255, 170, 100, 0.2), transparent 22%), linear-gradient(135deg, rgba(192, 129, 76, 0.94), rgba(124, 70, 36, 0.96))',
    },
    'painting-01': {
        title: 'Room of Shelby',
        type: '3D Art',
        meta: '3D interior scene · 2026',
        description: 'A cinematic interior frame with atmosphere and narrative lighting.',
        image: 'art/Room of Shelby 16x9.png',
        coverImage: 'art/Room of Shelby 16x9.png',
        tags: ['3D Art', 'Interior', 'Cinematic'],
        background: 'radial-gradient(circle at 25% 18%, rgba(255, 232, 188, 0.45), transparent 24%), linear-gradient(135deg, rgba(143, 90, 42, 0.96), rgba(204, 137, 84, 0.92))',
    },
    'digital-01': {
        title: 'Omni Warrior',
        type: '3D Art',
        meta: 'Character concept render · 2026',
        description: 'A stylized warrior composition with strong character silhouette and mood.',
        image: 'art/Omni Warrior.png',
        coverImage: 'art/Omni Warrior.png',
        tags: ['3D Art', 'Character', 'Concept'],
        background: 'radial-gradient(circle at 20% 18%, rgba(82, 211, 255, 0.45), transparent 24%), radial-gradient(circle at 82% 25%, rgba(170, 122, 255, 0.38), transparent 24%), linear-gradient(135deg, rgba(28, 34, 64, 0.98), rgba(60, 100, 180, 0.84))',
    },
    'motion-01': {
        title: 'Temple of Anubis',
        type: '3D Art',
        meta: 'Environment render · 2022',
        description: 'A world-building piece focused on monumental architecture and atmosphere.',
        image: 'art/2022-Temple of Anubis.png',
        coverImage: 'art/2022-Temple of Anubis.png',
        tags: ['3D Art', 'Environment', 'Anubis'],
        background: 'radial-gradient(circle at 22% 18%, rgba(165, 255, 228, 0.35), transparent 24%), radial-gradient(circle at 80% 30%, rgba(98, 163, 255, 0.36), transparent 24%), linear-gradient(135deg, rgba(5, 18, 27, 0.98), rgba(32, 105, 119, 0.84))',
    },
    '3d-02': {
        title: 'Dune Monster',
        type: '3D Art',
        meta: 'Creature concept render · 2025',
        description: 'A creature-focused 3D concept built around silhouette, texture, and atmosphere.',
        image: 'art/Dune monster_2025.png',
        coverImage: 'art/Dune monster_2025.png',
        tags: ['3D Art', 'Creature', 'Concept'],
        background: 'radial-gradient(circle at 26% 20%, rgba(255, 210, 150, 0.42), transparent 24%), linear-gradient(135deg, rgba(72, 48, 98, 0.96), rgba(174, 118, 79, 0.88))',
    },
    'painting-02': {
        title: 'Too Much Vaping Today',
        type: '3D Art',
        meta: 'Character scene render · 2026',
        description: 'A stylized 3D composition with a playful title and moody scene construction.',
        image: 'art/ToMuch Vaping Today.png',
        coverImage: 'art/ToMuch Vaping Today.png',
        tags: ['3D Art', 'Scene', 'Character'],
        background: 'radial-gradient(circle at 18% 18%, rgba(240, 209, 147, 0.42), transparent 24%), linear-gradient(135deg, rgba(100, 67, 44, 0.96), rgba(201, 132, 92, 0.88))',
    },
    'digital-02': {
        title: 'Digital Study 02',
        type: 'Digital Painting',
        meta: 'Digital piece · coming later',
        description: 'A second digital lane for sharper studies or stylized illustrations.',
        image: 'art/2022-Temple of Anubis.png',
        coverImage: 'art/2022-Temple of Anubis.png',
        tags: ['Digital', 'Illustration', 'Study'],
        background: 'radial-gradient(circle at 18% 22%, rgba(99, 243, 255, 0.36), transparent 24%), linear-gradient(135deg, rgba(19, 29, 51, 0.98), rgba(96, 92, 200, 0.84))',
    },
    'motion-02': {
        title: 'Motion Loop 02',
        type: 'Motion',
        meta: 'Moving image · coming later',
        description: 'A second motion slot for another short animated piece.',
        image: 'art/Lola Trip.png',
        coverImage: 'art/Lola Trip.png',
        tags: ['Motion', 'Animation', 'Loop'],
        background: 'radial-gradient(circle at 20% 18%, rgba(180, 255, 230, 0.32), transparent 24%), linear-gradient(135deg, rgba(8, 19, 28, 0.98), rgba(55, 137, 158, 0.84))',
    },
    '3d-03': {
        title: '3D Project 03',
        type: '3D Art',
        meta: '3D render · coming later',
        description: 'A third 3D slot for when you add another strong render.',
        image: 'art/Omni Warrior.png',
        coverImage: 'art/Omni Warrior.png',
        tags: ['3D Art', 'Render', 'Coming soon'],
        background: 'radial-gradient(circle at 24% 18%, rgba(255, 215, 160, 0.4), transparent 24%), linear-gradient(135deg, rgba(89, 58, 36, 0.96), rgba(180, 111, 72, 0.88))',
    },
    'reserved-10': {
        title: 'Reserved 10',
        type: 'Open slot',
        meta: 'Reserved for later',
        description: 'Leave this one open for the next standout piece that deserves a place in the stack.',
        image: 'art/Room of Shelby 16x9.png',
        coverImage: 'art/Room of Shelby 16x9.png',
        tags: ['Reserved', 'Open slot'],
        background: 'radial-gradient(circle at 24% 18%, rgba(255, 255, 255, 0.18), transparent 22%), linear-gradient(135deg, rgba(16, 19, 24, 0.98), rgba(71, 74, 80, 0.86))',
    },
};

artVinylButtons.forEach(button => {
    const piece = artPieces[button.dataset.artId];
    if (!piece) {
        return;
    }

    const coverImage = piece.coverImage || piece.image;
    if (coverImage) {
        button.style.setProperty('--vinyl-cover', `url("${coverImage}")`);
    }
});

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
        title: 'Started the Creative Journey',
        kicker: 'Chapter 03',
        lead: 'Eventually, I graduated from the University of Economics and Law, but the future still did not look clear to me.',
        bodyBlocks: [
            {
                type: 'paragraph',
                text: 'I studied at the University of Economics and Law, where I learned quite a lot about economics, business, and how the world is supposed to work on paper.',
            },
            {
                type: 'paragraph',
                text: 'But even with all that knowledge, the future still did not look clear to me.',
            },
            {
                type: 'paragraph',
                text: 'Knowing a little about economics did not suddenly give me a map. It did not tell me exactly what kind of work I should do, what kind of life I should build, or who I was supposed to become.',
            },
            {
                type: 'paragraph',
                text: 'But somewhere during those university years, I started to imagine something.',
            },
            {
                type: 'paragraph',
                text: 'I did not have the exact words for it yet, but I kept thinking about creating visual products for companies. Something with images. Something with design. Something that could help a business tell its story, explain what it does, and look better in the world.',
            },
            {
                type: 'image',
                src: 'img/earlycreative05.JPG',
                alt: 'Early creative work image',
                caption: 'An early creative moment before the path became clear.',
                objectPosition: 'center 38%',
            },
            {
                type: 'paragraph',
                text: 'It was still blurry. But the shape was there.',
            },
            {
                type: 'paragraph',
                text: 'During my internship period near the end of my fourth year, I was lucky that I already knew a bit about motion graphics. That small skill opened the first professional door for me.',
            },
            {
                type: 'paragraph',
                text: 'I was accepted into a company with a parent company in Switzerland (21ilab). And for someone just starting out, that environment was incredibly valuable. I had the chance to work around people who were much more experienced than me, people who knew how professional work should be done, how ideas should be presented, how standards should be kept, and how a real team could operate.',
            },
            {
                type: 'image',
                src: 'img/21ilab.jpg',
                alt: '21ilab team or workspace',
                caption: 'My first professional door: 21ilab.',
            },
            {
                type: 'paragraph',
                text: 'That period gave me something important: a first look at the working world from inside the room. Not from school. Not from theory. But from actual people doing actual work.',
            },
            {
                type: 'paragraph',
                text: 'Later, I decided to move to Red Cat Motion, one of the leading animation studios in Vietnam at the time.',
            },
            {
                type: 'paragraph',
                text: 'That was another important step.',
            },
            {
                type: 'paragraph',
                text: 'At Red Cat Motion, I entered a more specialized creative environment, surrounded by people with strong skills, serious standards, and real industry experience. The work was sharper. The expectations were higher. The world of animation and motion design became more real to me.',
            },
            {
                type: 'image',
                src: 'img/rcm01.jpg',
                alt: 'Red Cat Motion project or studio image 01',
                caption: 'Red Cat Motion, where the work became sharper.',
            },
            {
                type: 'paragraph',
                text: 'But beyond the work, there was something else that stayed with me.',
            },
            {
                type: 'paragraph',
                text: 'I met people there who did not remain only as colleagues. Many of them became friends, creative companions, and people I would continue to talk to, learn from, exchange ideas with, and support through the many strange turns of the career journey later on.',
            },
            {
                type: 'image',
                src: 'img/rcm03.jpg',
                alt: 'Red Cat Motion project or studio image 03',
                caption: 'The people I met there stayed important long after the job changed.',
            },
            {
                type: 'paragraph',
                text: 'After that, I continued to another company (DRAV), where a different door opened.',
            },
            {
                type: 'paragraph',
                text: 'With the guidance of my leader there, I had the chance to step much deeper into the world of stage visuals and live events. This was where my 3D skills grew a lot. I worked on many large-scale events, where images were no longer just sitting on a screen. They became part of a stage, part of the lights, part of the music, part of a whole live experience happening in front of thousands of people.',
            },
            {
                type: 'image',
                src: 'img/phoenix matxi kids.jpg',
                alt: 'Phoenix Matxi Kids stage visual or event image',
                caption: 'Stage visuals moving into real live moments.',
            },
            {
                type: 'paragraph',
                text: 'That period was special.',
            },
            {
                type: 'paragraph',
                text: 'It stood somewhere between professional production and artistic expression. Between technical execution and the feeling of building something massive for a real audience. There were moments when the work was just one small part of a much bigger stage, but even that small part carried its own electricity.',
            },
            {
                type: 'paragraph',
                text: 'Looking back, I think this chapter was not about becoming great yet.',
            },
            {
                type: 'paragraph',
                text: 'It was about entering the field. It was about standing close to people who were better than me. It was about learning what professional creative work actually looked like. It was about discovering how far images could travel, from a computer screen to animation, from animation to stages, from stages to real emotions in a crowd.',
            },
            {
                type: 'paragraph',
                text: 'I still did not know exactly where the path would lead.',
            },
            {
                type: 'paragraph',
                text: 'But every place I passed through gave me something. Every team shaped me a little. Every project left a mark.',
            },
            {
                type: 'paragraph',
                text: 'And slowly, those experiences became part of the person I am today.',
            },
        ],
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
                    if (block.objectPosition) {
                        image.style.objectPosition = block.objectPosition;
                    }
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

function renderArtPiece(artId, options = {}) {
    const shouldAutoScroll = options.autoScroll !== false;
    const piece = artPieces[artId];

    if (!piece) {
        return;
    }

    currentArtId = artId;

    artVinylButtons.forEach(button => {
        const isSelected = button.dataset.artId === artId;
        button.classList.toggle('active', isSelected);
        button.classList.toggle('is-selected', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
    });

    if (artSelectedTitle) {
        artSelectedTitle.textContent = piece.title;
    }

    if (artSelectedMeta) {
        artSelectedMeta.textContent = piece.meta;
    }

    if (artSelectedDescription) {
        artSelectedDescription.textContent = piece.description;
    }

    if (artSelectedTags) {
        artSelectedTags.innerHTML = piece.tags.map(tag => `<span>${tag}</span>`).join('');
    }

    if (artTurntableVisual) {
        artTurntableVisual.style.background = piece.background;
    }

    if (artSelectedImage) {
        if (piece.image) {
            artSelectedImage.src = piece.image;
            artSelectedImage.alt = piece.alt || piece.title;
            artSelectedImage.hidden = false;
        } else {
            artSelectedImage.hidden = true;
        }
    }

    const selectedButton = artVinylButtons.find(button => button.dataset.artId === artId);
    if (selectedButton && artVinylStack && shouldAutoScroll) {
        requestAnimationFrame(() => {
            const targetLeft = selectedButton.offsetLeft - ((artVinylStack.clientWidth - selectedButton.offsetWidth) / 2);
            const maxLeft = Math.max(0, artVinylStack.scrollWidth - artVinylStack.clientWidth);
            const clampedLeft = Math.max(0, Math.min(targetLeft, maxLeft));

            artVinylStack.scrollTo({
                left: clampedLeft,
                behavior: 'smooth',
            });
        });
    }
}

function openArtModal() {
    if (!artModal || !artModalImage) {
        return;
    }

    const piece = artPieces[currentArtId];
    if (!piece || !piece.image) {
        return;
    }

    artModalImage.src = piece.image;
    artModalImage.alt = piece.alt || piece.title;

    if (artModalCaption) {
        artModalCaption.textContent = `${piece.title} · ${piece.type}`;
    }

    artModal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeArtModal() {
    if (!artModal) {
        return;
    }

    artModal.hidden = true;
    document.body.style.overflow = '';
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

artVinylButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        renderArtPiece(button.dataset.artId, {
            autoScroll: shouldAutoScrollOnHover(button),
        });
    });

    button.addEventListener('click', () => {
        renderArtPiece(button.dataset.artId, { autoScroll: true });
    });
});

if (artFullviewButton) {
    artFullviewButton.addEventListener('click', openArtModal);
}

if (artModalClose) {
    artModalClose.addEventListener('click', closeArtModal);
}

if (artModal) {
    artModal.addEventListener('click', event => {
        if (event.target === artModal) {
            closeArtModal();
        }
    });
}

window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && artModal && !artModal.hidden) {
        closeArtModal();
    }
});

if (artVinylButtons.length) {
    updateArtStackGutters();
    renderArtPiece(artVinylButtons[0].dataset.artId);
}

if (window.scrollX !== 0) {
    window.scrollTo({ left: 0, top: window.scrollY, behavior: 'auto' });
}

window.addEventListener('resize', updateArtStackGutters);

window.addEventListener('scroll', () => {
    updateMoveUpButtonVisibility();

    if (showcaseSnapTimeout) {
        window.clearTimeout(showcaseSnapTimeout);
    }

    showcaseSnapTimeout = window.setTimeout(() => {
        maybeSnapToShowcase();
    }, 95);
}, { passive: true });

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