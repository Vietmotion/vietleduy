import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { firebaseConfig, visitsCollectionName } from "./firebase-config.js";

const SESSION_VISIT_KEY = "vld_visit_logged_v1";

function normalizePageName(pageName) {
    if (!pageName) {
        return "home";
    }

    const cleaned = String(pageName).trim();
    if (!cleaned || cleaned === "/" || cleaned === "home") {
        return "home";
    }

    const withoutSlash = cleaned.replace(/^\//, "").split("?")[0].split("#")[0];
    return withoutSlash || "home";
}

function getPageLabel(pageName) {
    const normalized = normalizePageName(pageName);
    const labels = {
        home: "Home",
        about: "About",
        art: "Art",
        blog: "Blog",
        gallery: "Gallery",
        "blog-post-1": "The Art of Restraint in Modern Design",
        "blog-post-2": "Designing for Clarity and Confidence",
        "blog-post-3": "Tư duy thiết kế tối giản",
        "blog-post-4": "Cách xây dựng thương hiệu bền vững",
    };

    return labels[normalized] || normalized.replace(/-/g, " ");
}

function getCurrentPageName() {
    const activePage = document.querySelector(".page.active");
    if (activePage && activePage.id) {
        return activePage.id;
    }

    const path = normalizePageName(window.location.pathname);
    return path;
}

function hasFirebaseConfig() {
    return firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

async function fetchGeoData() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
        const response = await fetch("https://ipapi.co/json/", {
            signal: controller.signal,
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Geo lookup failed: ${response.status}`);
        }

        const data = await response.json();
        return {
            country: data.country_name || "Unknown",
            countryCode: data.country_code || "ZZ",
            region: data.region || "Unknown",
            city: data.city || "Unknown",
        };
    } catch {
        return {
            country: "Unknown",
            countryCode: "ZZ",
            region: "Unknown",
            city: "Unknown",
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

async function trackPageView(pageName) {
    const resolvedPageName = normalizePageName(pageName || getCurrentPageName());
    const sessionKey = `${SESSION_VISIT_KEY}_${resolvedPageName}`;

    if (sessionStorage.getItem(sessionKey)) {
        return;
    }

    if (!hasFirebaseConfig()) {
        console.warn("Firebase visit tracking skipped: configure firebase-config.js first.");
        return;
    }

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const geo = await fetchGeoData();

    try {
        await addDoc(collection(db, visitsCollectionName), {
            visitedAt: serverTimestamp(),
            page: window.location.pathname,
            pageName: resolvedPageName,
            pageLabel: getPageLabel(resolvedPageName),
            referrer: document.referrer || "direct",
            language: navigator.language || "unknown",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
            ...geo,
        });

        sessionStorage.setItem(sessionKey, "1");
    } catch (error) {
        console.error("Failed to write visit analytics:", error);
    }
}

async function trackVisit() {
    const pageName = getCurrentPageName();
    await trackPageView(pageName);
}

window.addEventListener("pageview", (event) => {
    const pageName = event?.detail?.pageName || getCurrentPageName();
    trackPageView(pageName);
});

trackVisit();
