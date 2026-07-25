import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { firebaseConfig, visitsCollectionName } from "./firebase-config.js";

const SESSION_VISIT_KEY = "vld_visit_logged_v1";

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

async function trackVisit() {
    if (sessionStorage.getItem(SESSION_VISIT_KEY)) {
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
            referrer: document.referrer || "direct",
            language: navigator.language || "unknown",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
            ...geo,
        });

        sessionStorage.setItem(SESSION_VISIT_KEY, "1");
    } catch (error) {
        console.error("Failed to write visit analytics:", error);
    }
}

trackVisit();
