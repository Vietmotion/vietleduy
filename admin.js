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
const recentVisitsBodyEl = document.getElementById("recentVisitsBody");
const statusMessageEl = document.getElementById("statusMessage");
const refreshButton = document.getElementById("refreshButton");

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

function renderCountryRows(countryEntries, total) {
    countryRowsEl.innerHTML = "";

    if (!countryEntries.length) {
        countryRowsEl.innerHTML = "<p>No visit records yet.</p>";
        return;
    }

    countryEntries.forEach(([country, count]) => {
        const ratio = total > 0 ? (count / total) * 100 : 0;

        const row = document.createElement("article");
        row.className = "country-row";
        row.innerHTML = `
            <div>
                <div class="country-meta">
                    <span class="country-name">${country}</span>
                    <span class="country-value">${count} visit(s) · ${ratio.toFixed(1)}%</span>
                </div>
                <div class="bar-wrap">
                    <div class="bar-fill" style="width: ${Math.min(100, ratio).toFixed(2)}%"></div>
                </div>
            </div>
        `;

        countryRowsEl.appendChild(row);
    });
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
        let vnCount = 0;

        visits.forEach((visit) => {
            const country = visit.country || "Unknown";
            countryCounts.set(country, (countryCounts.get(country) || 0) + 1);

            if ((visit.countryCode || "").toUpperCase() === "VN") {
                vnCount += 1;
            }
        });

        const sortedCountryEntries = [...countryCounts.entries()].sort((a, b) => b[1] - a[1]);
        const otherCount = Math.max(0, total - vnCount);

        totalVisitsEl.textContent = String(total);
        vietnamVisitsEl.textContent = String(vnCount);
        otherVisitsEl.textContent = String(otherCount);
        countryCountEl.textContent = String(countryCounts.size);

        renderCountryRows(sortedCountryEntries, total);
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
