import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    collection,
    documentId,
    getFirestore,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { firebaseConfig, visitsCollectionName } from "./firebase-config.js";

const totalVisitsEl = document.getElementById("totalVisits");
const vietnamVisitsEl = document.getElementById("vietnamVisits");
const otherVisitsEl = document.getElementById("otherVisits");
const countryCountEl = document.getElementById("countryCount");
const unknownVisitsEl = document.getElementById("unknownVisits");
const countryTableBodyEl = document.getElementById("countryTableBody");
const pageTableBodyEl = document.getElementById("pageTableBody");
const blogTableBodyEl = document.getElementById("blogTableBody");
const recentVisitsBodyEl = document.getElementById("recentVisitsBody");
const statusMessageEl = document.getElementById("statusMessage");
const countryTableTotalEl = document.getElementById("countryTableTotal");
const mapCoverageEl = document.getElementById("mapCoverage");
const mapMarkersEl = document.getElementById("mapMarkers");
const periodFilterEl = document.getElementById("periodFilter");
const refreshButton = document.getElementById("refreshButton");

const PAGE_SIZE = 500;
const RECENT_VISIT_LIMIT = 30;
const pageNameLabels = {
    home: "Trang chủ",
    about: "Giới thiệu",
    art: "Tác phẩm",
    blog: "Blog",
    gallery: "Thư viện",
    "blog-post-1": "The Art of Restraint in Modern Design",
    "blog-post-2": "Designing for Clarity and Confidence",
    "blog-post-3": "Tư duy thiết kế tối giản",
    "blog-post-4": "Cách xây dựng thương hiệu bền vững",
};

const countryCentroids = {
    AE: [54.4, 24.3], AR: [-64.2, -34.6], AT: [14.1, 47.6], AU: [134.5, -25.7],
    BD: [90.3, 23.7], BE: [4.7, 50.6], BR: [-51.9, -10.8], CA: [-106.3, 56.1],
    CH: [8.2, 46.8], CL: [-71.0, -35.7], CN: [103.8, 35.9], CO: [-73.1, 3.9],
    CZ: [15.5, 49.8], DE: [10.4, 51.1], DK: [9.5, 56.0], EG: [30.8, 26.8],
    ES: [-3.7, 40.4], FI: [26.0, 64.0], FR: [2.2, 46.2], GB: [-3.4, 55.4],
    GR: [22.0, 39.1], HK: [114.2, 22.3], ID: [117.2, -2.2], IE: [-8.0, 53.4],
    IN: [78.9, 22.8], IT: [12.6, 42.8], JP: [138.0, 36.2], KR: [127.8, 36.4],
    LK: [80.7, 7.9], MM: [95.9, 21.9], MX: [-102.5, 23.6], MY: [102.0, 4.2],
    NG: [8.7, 9.1], NL: [5.3, 52.1], NO: [8.5, 61.0], NZ: [172.0, -41.3],
    PE: [-75.0, -9.2], PH: [122.9, 11.8], PK: [69.3, 30.4], PL: [19.1, 52.1],
    PT: [-8.0, 39.6], RU: [90.0, 60.0], SA: [45.1, 23.9], SE: [15.0, 62.0],
    SG: [103.8, 1.35], TH: [101.0, 15.9], TR: [35.2, 39.0], TW: [120.9, 23.7],
    UA: [31.2, 48.4], US: [-98.6, 39.8], VN: [108.3, 14.1], ZA: [25.1, -29.6],
};

const countryDisplayNames = typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;
const numberFormatter = new Intl.NumberFormat("vi-VN");
const percentFormatter = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

let db;
let allVisits = [];
let lastUpdatedAt = null;

function hasFirebaseConfig() {
    return firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

function toDate(value) {
    if (value?.toDate) {
        return value.toDate();
    }

    if (!value) {
        return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function toUtcString(dateValue) {
    if (!dateValue) {
        return "Không rõ";
    }

    return dateValue.toISOString().replace("T", " ").slice(0, 19);
}

function setStatus(message, state = "info") {
    statusMessageEl.textContent = message;
    statusMessageEl.dataset.state = state;
}

function displayCountryName(countryCode, countryName) {
    if (countryCode && countryDisplayNames) {
        const localizedName = countryDisplayNames.of(countryCode);
        if (localizedName && localizedName !== countryCode) {
            return localizedName;
        }
    }

    return countryName || "Chưa xác định";
}

function getCountryIdentity(visit) {
    const rawCode = String(visit.countryCode || "").trim().toUpperCase();
    const rawName = String(visit.country || "").trim();
    const validCode = /^[A-Z]{2}$/.test(rawCode) && rawCode !== "ZZ" ? rawCode : "";
    const normalizedName = rawName.toLocaleLowerCase("vi");
    const isVietnam = validCode === "VN" || ["vietnam", "viet nam", "việt nam"].includes(normalizedName);

    if (validCode) {
        return {
            key: validCode,
            code: validCode,
            name: displayCountryName(validCode, rawName),
            isVietnam,
        };
    }

    if (!rawName || ["unknown", "n/a", "null", "undefined"].includes(normalizedName)) {
        return { key: "unknown", code: "", name: "Chưa xác định", isVietnam: false };
    }

    const canonicalName = ["vietnam", "viet nam", "việt nam"].includes(normalizedName)
        ? "Vietnam"
        : rawName;
    return {
        key: `name:${normalizedName}`,
        code: "",
        name: canonicalName,
        isVietnam,
    };
}

function getPageKey(visit) {
    const candidate = String(visit.pageName || visit.page || "home")
        .split("?")[0]
        .split("#")[0]
        .replace(/^\/+/, "");
    return candidate || "home";
}

function getPageLabel(pageKey) {
    if (pageNameLabels[pageKey]) {
        return pageNameLabels[pageKey];
    }

    return pageKey.replace(/\.html$/i, "").replace(/-/g, " ") || "Trang chủ";
}

function appendCell(row, value, className = "") {
    const cell = document.createElement("td");
    cell.textContent = String(value);
    if (className) {
        cell.className = className;
    }
    row.appendChild(cell);
    return cell;
}

function renderEmptyRow(body, columnCount, message) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = columnCount;
    cell.className = "empty-cell";
    cell.textContent = message;
    row.appendChild(cell);
    body.replaceChildren(row);
}

function renderCountryTable(countryEntries, total) {
    countryTableBodyEl.replaceChildren();
    countryTableTotalEl.textContent = `${numberFormatter.format(total)} lượt`;

    if (!countryEntries.length) {
        renderEmptyRow(countryTableBodyEl, 3, "Chưa có dữ liệu trong khoảng thời gian này.");
        return;
    }

    countryEntries.forEach((entry) => {
        const row = document.createElement("tr");
        appendCell(row, entry.name);
        appendCell(row, numberFormatter.format(entry.count), "numeric");
        appendCell(row, `${percentFormatter.format(total ? entry.count / total * 100 : 0)}%`, "numeric");
        countryTableBodyEl.appendChild(row);
    });
}

function renderRankTable(body, entries, total, emptyText) {
    body.replaceChildren();
    if (!entries.length) {
        renderEmptyRow(body, 4, emptyText);
        return;
    }

    entries.forEach(([label, count], index) => {
        const row = document.createElement("tr");
        appendCell(row, numberFormatter.format(index + 1));
        appendCell(row, label);
        appendCell(row, numberFormatter.format(count), "numeric");
        appendCell(row, `${percentFormatter.format(total ? count / total * 100 : 0)}%`, "numeric");
        body.appendChild(row);
    });
}

function projectCoordinates(longitude, latitude) {
    return {
        x: ((longitude + 180) / 360) * 1000,
        y: ((85 - latitude) / 145) * 500,
    };
}

function renderMap(countryEntries) {
    mapMarkersEl.replaceChildren();
    const knownCountries = countryEntries.filter((entry) => entry.key !== "unknown");
    const mappedEntries = knownCountries.filter((entry) => entry.code && countryCentroids[entry.code]);
    const maxCount = Math.max(1, ...mappedEntries.map((entry) => entry.count));

    mappedEntries.forEach((entry) => {
        const [longitude, latitude] = countryCentroids[entry.code];
        const { x, y } = projectCoordinates(longitude, latitude);
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        marker.setAttribute("class", "map-marker");
        marker.setAttribute("cx", x.toFixed(1));
        marker.setAttribute("cy", y.toFixed(1));
        marker.setAttribute("r", String(5 + Math.sqrt(entry.count / maxCount) * 10));
        marker.setAttribute("tabindex", "0");
        marker.setAttribute("role", "img");
        marker.setAttribute("aria-label", `${entry.name}: ${numberFormatter.format(entry.count)} lượt xem`);

        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `${entry.name}: ${numberFormatter.format(entry.count)} lượt xem`;
        marker.appendChild(title);
        mapMarkersEl.appendChild(marker);
    });

    const unmappedCount = knownCountries.length - mappedEntries.length;
    mapCoverageEl.textContent = mappedEntries.length
        ? `Đã đặt ${mappedEntries.length}/${knownCountries.length} quốc gia có dữ liệu lên bản đồ. Tâm địa lý là gần đúng; số liệu chính xác nằm trong bảng.${unmappedCount ? ` ${unmappedCount} quốc gia chưa có tọa độ trên bản đồ.` : ""}`
        : "Chưa có quốc gia đủ thông tin để hiển thị trên bản đồ; bảng bên cạnh vẫn liệt kê toàn bộ số liệu.";
}

function renderRecentVisits(visits) {
    recentVisitsBodyEl.replaceChildren();

    if (!visits.length) {
        renderEmptyRow(recentVisitsBodyEl, 6, "Chưa có lượt xem trong khoảng thời gian này.");
        return;
    }

    visits.slice(0, RECENT_VISIT_LIMIT).forEach((visit) => {
        const row = document.createElement("tr");
        appendCell(row, toUtcString(visit.visitedAt));
        appendCell(row, getCountryIdentity(visit).name);
        appendCell(row, visit.region || "Không rõ");
        appendCell(row, visit.city || "Không rõ");
        appendCell(row, getPageLabel(getPageKey(visit)));
        appendCell(row, visit.language || "Không rõ");
        recentVisitsBodyEl.appendChild(row);
    });
}

function getPeriodVisits(visits, period, now = new Date()) {
    if (period === "all") {
        return visits;
    }

    let start;
    if (period === "today") {
        start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    } else {
        start = new Date(now);
        start.setUTCDate(start.getUTCDate() - Number(period));
    }

    return visits.filter((visit) => visit.visitedAt && visit.visitedAt >= start && visit.visitedAt <= now);
}

function renderReport() {
    const visits = getPeriodVisits(allVisits, periodFilterEl.value);
    const countries = new Map();
    const pages = new Map();
    const blogs = new Map();
    let vietnamCount = 0;
    let unknownCount = 0;

    visits.forEach((visit) => {
        const country = getCountryIdentity(visit);
        const existing = countries.get(country.key);
        countries.set(country.key, {
            ...country,
            count: (existing?.count || 0) + 1,
        });

        if (country.isVietnam) {
            vietnamCount += 1;
        }
        if (country.key === "unknown") {
            unknownCount += 1;
        }

        const pageKey = getPageKey(visit);
        const pageLabel = getPageLabel(pageKey);
        pages.set(pageLabel, (pages.get(pageLabel) || 0) + 1);

        if (pageKey.startsWith("blog-post-")) {
            blogs.set(pageLabel, (blogs.get(pageLabel) || 0) + 1);
        }
    });

    const countryEntries = [...countries.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    const knownCountryCount = countryEntries.filter((entry) => entry.key !== "unknown").length;
    const otherCount = Math.max(0, visits.length - vietnamCount - unknownCount);
    const pageEntries = [...pages.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const blogEntries = [...blogs.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    totalVisitsEl.textContent = numberFormatter.format(visits.length);
    vietnamVisitsEl.textContent = numberFormatter.format(vietnamCount);
    otherVisitsEl.textContent = numberFormatter.format(otherCount);
    countryCountEl.textContent = numberFormatter.format(knownCountryCount);
    unknownVisitsEl.textContent = numberFormatter.format(unknownCount);

    renderCountryTable(countryEntries, visits.length);
    renderMap(countryEntries);
    renderRankTable(pageTableBodyEl, pageEntries, visits.length, "Chưa có lượt xem trang.");
    renderRankTable(blogTableBodyEl, blogEntries, visits.length, "Chưa có lượt xem bài viết.");

    const recentVisits = [...visits].sort((a, b) => {
        if (!a.visitedAt) return 1;
        if (!b.visitedAt) return -1;
        return b.visitedAt - a.visitedAt;
    });
    renderRecentVisits(recentVisits);

    const periodLabel = periodFilterEl.options[periodFilterEl.selectedIndex].textContent;
    const missingTimestampCount = allVisits.filter((visit) => !visit.visitedAt).length;
    const missingTimestampNote = periodFilterEl.value !== "all" && missingTimestampCount
        ? ` ${numberFormatter.format(missingTimestampCount)} bản ghi thiếu thời gian nên không được tính trong bộ lọc ngày.`
        : "";
    const updatedAtLabel = lastUpdatedAt
        ? ` Cập nhật ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(lastUpdatedAt)} (giờ địa phương).`
        : "";
    setStatus(`Đang hiển thị ${numberFormatter.format(visits.length)} lượt · ${periodLabel}.${missingTimestampNote}${updatedAtLabel}`);
}

async function fetchAllVisits() {
    const visitsCollection = collection(db, visitsCollectionName);
    const visits = [];
    let lastDocument = null;

    while (true) {
        const constraints = [orderBy(documentId()), limit(PAGE_SIZE)];
        if (lastDocument) {
            constraints.push(startAfter(lastDocument));
        }

        const snapshot = await getDocs(query(visitsCollection, ...constraints));
        snapshot.docs.forEach((document) => {
            const data = document.data();
            visits.push({
                visitedAt: toDate(data.visitedAt),
                country: typeof data.country === "string" ? data.country : "",
                countryCode: typeof data.countryCode === "string" ? data.countryCode : "",
                region: typeof data.region === "string" ? data.region : "",
                city: typeof data.city === "string" ? data.city : "",
                language: typeof data.language === "string" ? data.language : "",
                page: typeof data.page === "string" ? data.page : "",
                pageName: typeof data.pageName === "string" ? data.pageName : "",
            });
        });

        if (snapshot.size < PAGE_SIZE) {
            break;
        }

        lastDocument = snapshot.docs[snapshot.docs.length - 1];
        setStatus(`Đang tải toàn bộ bản ghi... ${numberFormatter.format(visits.length)} lượt.`);
    }

    return visits;
}

async function loadVisitReport() {
    refreshButton.disabled = true;
    setStatus("Đang tải toàn bộ bản ghi để thống kê chính xác...");

    try {
        allVisits = await fetchAllVisits();
        lastUpdatedAt = new Date();
        renderReport();
    } catch (error) {
        console.error("Unable to load the visitor report:", error);
        setStatus("Không thể tải dữ liệu. Hãy kiểm tra Firebase config, kết nối mạng và quyền đọc Firestore.", "error");
    } finally {
        refreshButton.disabled = false;
    }
}

function boot() {
    if (!hasFirebaseConfig()) {
        setStatus("Vui lòng cấu hình firebase-config.js trước khi tải báo cáo.", "error");
        refreshButton.disabled = true;
        return;
    }

    db = getFirestore(initializeApp(firebaseConfig));
    refreshButton.addEventListener("click", loadVisitReport);
    periodFilterEl.addEventListener("change", renderReport);
    loadVisitReport();
}

boot();
