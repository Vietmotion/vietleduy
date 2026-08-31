import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { firebaseConfig, visitsCollectionName } from "./firebase-config.js";

const totalVisitsEl = document.getElementById("totalVisits");
const vietnamVisitsEl = document.getElementById("vietnamVisits");
const otherVisitsEl = document.getElementById("otherVisits");
const countryCountEl = document.getElementById("countryCount");
const countryRowsEl = document.getElementById("countryRows");
const pageRowsEl = document.getElementById("pageRows");
const blogRowsEl = document.getElementById("blogRows");
const recentVisitsBodyEl = document.getElementById("recentVisitsBody");
const statusMessageEl = document.getElementById("statusMessage");
const refreshButton = document.getElementById("refreshButton");

const pageNameLabels = {
    home: "Home",
    about: "About",
    art: "Art",
    blog: "Blog",
    gallery: "Gallery",
    "blog-post-1": "Blog: The Art of Restraint in Modern Design",
    "blog-post-2": "Blog: Designing for Clarity and Confidence",
    "blog-post-3": "Blog: Tư duy thiết kế tối giản",
    "blog-post-4": "Blog: Cách xây dựng thương hiệu bền vững",
};

let db;

function hasFirebaseConfig() {
    return firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

function toUtcString(dateValue) {
    if (!dateValue) {
        return "Unknown";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toISOString().replace("T", " ").slice(0, 19);
}

function renderCountRows(container, entries, total, labelText, emptyText) {
    container.innerHTML = "";

    if (!entries.length) {
        container.innerHTML = `<p>${emptyText}</p>`;
        return;
    }

    entries.forEach(([name, count]) => {
        const ratio = total > 0 ? (count / total) * 100 : 0;

        const row = document.createElement("article");
        row.className = "country-row";
        row.innerHTML = `
            <div>
                <div class="country-meta">
                    <span class="country-name">${name}</span>
                    <span class="country-value">${count} ${labelText} · ${ratio.toFixed(1)}%</span>
                </div>
                <div class="bar-wrap">
                    <div class="bar-fill" style="width: ${Math.min(100, ratio).toFixed(2)}%"></div>
                </div>
            </div>
        `;

        container.appendChild(row);
    });
}

function renderCountryRows(countryEntries, total) {
    renderCountRows(countryRowsEl, countryEntries, total, "visit(s)", "No visit records yet.");
}

function renderPageRows(pageEntries, total) {
    renderCountRows(pageRowsEl, pageEntries, total, "view(s)", "No page views yet.");
}

function renderBlogRows(blogEntries, total) {
    renderCountRows(blogRowsEl, blogEntries, total, "read(s)", "No blog reads yet.");
}

function renderRecentVisits(visits) {
    recentVisitsBodyEl.innerHTML = "";

    if (!visits.length) {
        recentVisitsBodyEl.innerHTML = "<tr><td colspan=\"5\">No visits yet.</td></tr>";
        return;
    }

    visits.slice(0, 30).forEach((visit) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${toUtcString(visit.visitedAt)}</td>
            <td>${visit.country || "Unknown"}</td>
            <td>${visit.region || "Unknown"}</td>
            <td>${visit.city || "Unknown"}</td>
            <td>${visit.language || "Unknown"}</td>
        `;
        recentVisitsBodyEl.appendChild(row);
    });
}

async function loadVisitReport() {
    statusMessageEl.textContent = "Loading visit data...";
    refreshButton.disabled = true;

    try {
        const visitQuery = query(
            collection(db, visitsCollectionName),
            orderBy("visitedAt", "desc"),
            limit(2000)
        );
        const snapshot = await getDocs(visitQuery);
        const visits = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                visitedAt: data.visitedAt?.toDate?.() || null,
            };
        });

        const total = visits.length;
        const countryCounts = new Map();
        const pageCounts = new Map();
        const blogCounts = new Map();
        let vnCount = 0;

        visits.forEach((visit) => {
            const country = visit.country || "Unknown";
            countryCounts.set(country, (countryCounts.get(country) || 0) + 1);

            if ((visit.countryCode || "").toUpperCase() === "VN") {
                vnCount += 1;
            }

            const normalizedPageName = String(visit.pageName || visit.page || "home");
            const pageKey = normalizedPageName.replace(/^\//, "") || "home";
            const pageLabel = pageNameLabels[pageKey] || pageKey.replace(/-/g, " ");
            pageCounts.set(pageLabel, (pageCounts.get(pageLabel) || 0) + 1);

            if (pageKey.startsWith("blog-post-")) {
                const blogLabel = pageNameLabels[pageKey] || pageKey;
                blogCounts.set(blogLabel, (blogCounts.get(blogLabel) || 0) + 1);
            }
        });

        const sortedCountryEntries = [...countryCounts.entries()].sort((a, b) => b[1] - a[1]);
        const sortedPageEntries = [...pageCounts.entries()].sort((a, b) => b[1] - a[1]);
        const sortedBlogEntries = [...blogCounts.entries()].sort((a, b) => b[1] - a[1]);
        const otherCount = Math.max(0, total - vnCount);

        totalVisitsEl.textContent = String(total);
        vietnamVisitsEl.textContent = String(vnCount);
        otherVisitsEl.textContent = String(otherCount);
        countryCountEl.textContent = String(countryCounts.size);

        renderCountryRows(sortedCountryEntries, total);
        renderPageRows(sortedPageEntries, total);
        renderBlogRows(sortedBlogEntries, total);
        renderRecentVisits(visits);

        statusMessageEl.textContent = "Data updated.";
    } catch (error) {
        console.error(error);
        statusMessageEl.textContent = "Unable to load data. Check Firebase config and Firestore rules.";
    } finally {
        refreshButton.disabled = false;
    }
}

function boot() {
    if (!hasFirebaseConfig()) {
        statusMessageEl.textContent = "Please configure firebase-config.js first.";
        return;
    }

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    refreshButton.addEventListener("click", loadVisitReport);
    loadVisitReport();
}

boot();
