import {
    db,
    doc,
    getDoc,
    collection,
    getDocs
} from "./firebase.js";

// ==================================================
// 🧹 옛날 테스트용 찌꺼기 기억 강제 청소 및 본교회 강제 고정
// ==================================================
const savedChurchId = localStorage.getItem("yetalkMyChurchId");
if (
    !savedChurchId ||
    savedChurchId === "sample-church" ||
    savedChurchId === "yetalk-church" ||
    savedChurchId.trim() === ""
) {
    localStorage.setItem("yetalkMyChurchId", "fAKyQftAh3qPnsuRPSVz");
}
if (localStorage.getItem("currentChurchId") === "yetalk-church" || localStorage.getItem("currentChurchId") === "sample-church") {
    localStorage.setItem("currentChurchId", "fAKyQftAh3qPnsuRPSVz");
}
/*==================================================
YETALK INDEX.JS
단층 구조 및 절대 경로 규격 통일 최종 버전
==================================================*/


/*==================================================
PAGE LINKS (🌟 절대 경로 규격 적용)
==================================================*/

const PAGE_LINKS = {

    login:
        "https://appassets.androidplatform.net/assets/login.html",

    admin:
        "https://appassets.androidplatform.net/assets/admin.html",

    churchSearch:
        "https://appassets.androidplatform.net/assets/churchlist.html",

    churchCreate:
        "https://appassets.androidplatform.net/assets/churchnew.html",

    churchMain:
        "https://appassets.androidplatform.net/assets/churchmain.html",

    prayer:
        "https://appassets.androidplatform.net/assets/todayprayer.html",

    jesusWalk:
        "https://appassets.androidplatform.net/assets/chatword.html?room=jesusWalk",

    missionary:
        "https://appassets.androidplatform.net/assets/chatmedigate.html",

    invite:
        "https://appassets.androidplatform.net/assets/invite.html",

    notice:
        "https://appassets.androidplatform.net/assets/church_chatnotice.html",

    familyPrayer:
        "https://appassets.androidplatform.net/assets/familyprayer.html",

    myNote:
        "https://appassets.androidplatform.net/assets/mynote.html",

    myInfo:
        "https://appassets.androidplatform.net/assets/myinfo.html"

};


/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const STORAGE = {

    loginUser:
        "loginUser",

    currentChurch:
        "currentChurchId",

    primaryChurch:
        "yetalkMyChurchId",

    churchMemberships:
        "yetalkChurchMemberships",

    themeLast:
        "yetalkLastTheme",

    themeSession:
        "yetalkSessionTheme",

    todayDate:
        "todayDate"

};


/*==================================================
THEME DATA
==================================================*/

const themes = [

    {
        key: "blue",
        name: "청색",
        image: "images/themes/total-blue.jpg",
        confession: "생명되신 예수님은",
        color: "#075cab"
    },

    {
        key: "purple",
        name: "자색",
        image: "images/themes/total-purple.jpg",
        confession: "왕이신 예수님은",
        color: "#70259d"
    },

    {
        key: "red",
        name: "적색",
        image: "images/themes/total-red.jpg",
        confession: "고난받으신 예수님은",
        color: "#b52632"
    },

    {
        key: "white",
        name: "백색",
        image: "images/themes/total-white.jpg",
        confession: "부활하신 예수님은",
        color: "#315b7a"
    },

    {
        key: "gold",
        name: "금색",
        image: "images/themes/total-gold.jpg",
        confession: "영광의 예수님은",
        color: "#976900"
    }

];


/*==================================================
TEN COMMANDMENTS
==================================================*/

const commandments = [
    { number: "제1계명", text: "너는 나 외에는 다른 신들을 네게 두지 말라." },
    { number: "제2계명", text: "너를 위하여 새긴 우상을 만들지 말고 그것들에게 절하지 말며 섬기지 말라." },
    { number: "제3계명", text: "너는 네 하나님 여호와의 이름을 망령되게 부르지 말라." },
    { number: "제4계명", text: "안식일을 기억하여 거룩하게 지키라." },
    { number: "제5계명", text: "네 부모를 공경하라." },
    { number: "제6계명", text: "살인하지 말라." },
    { number: "제7계명", text: "간음하지 말라." },
    { number: "제8계명", text: "도둑질하지 말라." },
    { number: "제9계명", text: "네 이웃에 대하여 거짓 증거하지 말라." },
    { number: "제10계명", text: "네 이웃의 집이나 소유를 탐내지 말라." }
];


/*==================================================
STATE
==================================================*/

let loginUser = null;
let currentUser = null;
let currentChurchId = "";
let currentChurchName = "";
let currentChurchRegistered = false;
let currentTheme = themes[0];
let toastTimer = null;


/*==================================================
DOM
==================================================*/

const $ = id => document.getElementById(id);

const dom = {
    indexPage: $("indexPage"),
    themeStage: $("themeStage"),
    totalThemeImage: $("totalThemeImage"),
    faithLogoBtn: $("faithLogoBtn"),
    faithDate: $("faithDate"),
    faithClock: $("faithClock"),
    headerChurchGuideBtn: $("headerChurchGuideBtn"),
    headerAdminBtn: $("headerAdminBtn"),
    faithColor: $("faithColor"),
    faithJesus: $("faithJesus"),
    faithUserName: $("faithUserName"),
    faithEnding: $("faithEnding"),
    commandmentNumber: $("commandmentNumber"),
    commandmentText: $("commandmentText"),
    createChurchHomeBtn: $("createChurchHomeBtn"),
    openMyChurchBtn: $("openMyChurchBtn"),
    openMyChurchText: $("openMyChurchText"),
    prayerMenu: $("prayerMenu"),
    jesusWalkMenu: $("jesusWalkMenu"),
    missionaryMenu: $("missionaryMenu"),
    inviteMenu: $("inviteMenu"),
    noticeCardBtn: $("noticeCardBtn"),
    churchNoticeCount: $("churchNoticeCount"),
    churchNoticePreview: $("churchNoticePreview"),
    coupangCardBtn: $("coupangCardBtn"),
    noticeGuidePopup: $("noticeGuidePopup"),
    noticeGuideCloseBtn: $("noticeGuideCloseBtn"),
    noticeGuideBtn: $("noticeGuideBtn"),
    noticeGuideText: $("noticeGuideText"),
    bottomHomeBtn: $("bottomHomeBtn"),
    bottomFamilyPrayerBtn: $("bottomFamilyPrayerBtn"),
    bottomChurchGivingBtn: $("bottomChurchGivingBtn"),
    bottomMyNoteBtn: $("bottomMyNoteBtn"),
    bottomMyInfoBtn: $("bottomMyInfoBtn"),
    indexToast: $("indexToast")
};


/*==================================================
UTILITY
==================================================*/

function cleanText(value) {
    return String(value ?? "").trim();
}


/*==================================================
TOAST
==================================================*/

function showToast(message) {
    if (!dom.indexToast) return;
    dom.indexToast.textContent = cleanText(message);
    dom.indexToast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        dom.indexToast.classList.remove("show");
    }, 2500);
}


/*==================================================
예톡라운지 확인
==================================================*/

function isYetalkLounge(churchId = "", churchName = "") {
    const id = cleanText(churchId).toLowerCase();
    const name = cleanText(churchName).replace(/\s+/g, "").toLowerCase();
    return (
        ["yetalk-lounge", "yetalk-lounge-church", "yetalklounge", "예톡라운지"].includes(id) ||
        name === "예톡라운지" ||
        name === "예톡라운지교회"
    );
}


/*==================================================
현재 ⭐ 나의 우리교회
==================================================*/

function getLocalPrimaryChurchId() {
    const id = cleanText(localStorage.getItem(STORAGE.primaryChurch));
    if (isYetalkLounge(id)) return "";
    return id;
}


/*==================================================
THEME SELECT & APPLY
==================================================*/

function selectSessionTheme() {
    const sessionTheme = sessionStorage.getItem(STORAGE.themeSession);
    if (sessionTheme) {
        const foundTheme = themes.find(theme => theme.key === sessionTheme);
        if (foundTheme) {
            currentTheme = foundTheme;
            return;
        }
    }
    const lastTheme = localStorage.getItem(STORAGE.themeLast);
    let nextIndex = 0;
    if (lastTheme) {
        const lastIndex = themes.findIndex(theme => theme.key === lastTheme);
        if (lastIndex >= 0) {
            nextIndex = (lastIndex + 1) % themes.length;
        }
    }
    currentTheme = themes[nextIndex];
    sessionStorage.setItem(STORAGE.themeSession, currentTheme.key);
    localStorage.setItem(STORAGE.themeLast, currentTheme.key);
}

function applyTheme() {
    if (!dom.indexPage || !currentTheme) return;
    themes.forEach(theme => {
        dom.indexPage.classList.remove(`theme-${theme.key}`);
    });
    dom.indexPage.classList.add(`theme-${currentTheme.key}`);
    if (dom.totalThemeImage) {
        dom.totalThemeImage.src = currentTheme.image;
    }
    if (dom.faithColor) {
        dom.faithColor.textContent = `● ${currentTheme.name}`;
        dom.faithColor.style.color = currentTheme.color;
    }
    if (dom.faithJesus) {
        dom.faithJesus.textContent = currentTheme.confession;
    }
    if (dom.faithUserName) {
        dom.faithUserName.style.color = currentTheme.color;
    }
    if (dom.faithEnding) {
        dom.faithEnding.textContent = "의 하나님이십니다.";
    }
}


/*==================================================
CLOCK & COMMANDMENT
==================================================*/

function updateFaithClock() {
    const now = new Date();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    if (dom.faithDate) {
        dom.faithDate.textContent = `${now.getMonth() + 1}월 ${now.getDate()}일(${weekdays[now.getDay()]})`;
    }
    if (dom.faithClock) {
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        dom.faithClock.textContent = `${hours}:${minutes}`;
    }
}

function startFaithClock() {
    updateFaithClock();
    setInterval(updateFaithClock, 30000);
}

function showTodayCommandment() {
    const baseDate = new Date(2026, 0, 1);
    const now = new Date();
    const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const difference = Math.floor((todayOnly.getTime() - baseDate.getTime()) / 86400000);
    const index = ((difference % commandments.length) + commandments.length) % commandments.length;
    const commandment = commandments[index];

    if (dom.commandmentNumber) dom.commandmentNumber.textContent = commandment.number;
    if (dom.commandmentText) dom.commandmentText.textContent = commandment.text;
}


/*==================================================
USER DATA & ADMIN
==================================================*/

function getStoredLoginUser() {
    const saved = localStorage.getItem(STORAGE.loginUser);
    if (!saved) return null;
    try {
        const parsed = JSON.parse(saved);
        return (parsed && typeof parsed === "object") ? parsed : null;
    } catch (error) {
        return null;
    }
}

function getMemberNo() {
    return cleanText(loginUser?.memberNo || loginUser?.uid || loginUser?.userId || loginUser?.id);
}

function getUserDisplayName(user) {
    return cleanText(user?.displayName || user?.name || user?.nickname || user?.userName || loginUser?.displayName || loginUser?.name || loginUser?.nickname || "예톡회원");
}

function applyUserData() {
    if (!dom.faithUserName) return;
    dom.faithUserName.textContent = getUserDisplayName(currentUser);
}

function canManageYetalk() {
    const role = cleanText(currentUser?.role || currentUser?.memberRole || currentUser?.grade || loginUser?.role || loginUser?.memberRole).toLowerCase();
    const level = Number(currentUser?.level || currentUser?.memberLevel || loginUser?.level || loginUser?.memberLevel || 0);
    const yetalkRoles = ["master", "admin", "yetalkadmin", "yetalk_admin", "예톡2", "예톡3"];
    return yetalkRoles.includes(role) || level >= 7 || currentUser?.isAdmin === true || currentUser?.isYetalkAdmin === true || loginUser?.isAdmin === true || loginUser?.isYetalkAdmin === true;
}

function updateAdminVisibility() {
    const visible = canManageYetalk();
    document.querySelectorAll(".admin-only").forEach(element => {
        element.classList.toggle("hidden", !visible);
    });
}


/*==================================================
CHURCH STATE & LOAD
==================================================*/

function getChurchIdFromData(data, fallback = "") {
    return cleanText(data?.churchId || data?.mainChurchId || data?.homeChurchId || data?.id || fallback);
}

function applyNoChurchState() {
    currentChurchId = "";
    currentChurchName = "";
    currentChurchRegistered = false;
    localStorage.removeItem(STORAGE.currentChurch);
    if (dom.headerChurchGuideBtn) dom.headerChurchGuideBtn.textContent = "예톡라운지 우리교회";
    if (dom.openMyChurchText) dom.openMyChurchText.textContent = "바로가기";
    showNoticeEmptyState();
}

function applyChurchState() {
    if (dom.headerChurchGuideBtn) dom.headerChurchGuideBtn.textContent = currentChurchName || "우리교회";
    if (dom.openMyChurchText) dom.openMyChurchText.textContent = "바로가기";

    // 🌟 화면 피드의 타이틀들도 한글 이름으로 실시간 반영
    const feedTitle1 = document.getElementById("feedBrandTitle1");
    const feedTitle2 = document.getElementById("feedBrandTitle2");
    if (feedTitle1) feedTitle1.textContent = currentChurchName || "예톡샘플교회";
    if (feedTitle2) feedTitle2.textContent = (currentChurchName || "예톡샘플교회") + " 바로가기";
}

async function loadMainChurch(memberNo) {
    const localPrimaryId = getLocalPrimaryChurchId();
    if (localPrimaryId) {
        currentChurchId = localPrimaryId;
        localStorage.setItem(STORAGE.currentChurch, currentChurchId);
        await loadChurchInformation(null);
        return;
    }

    let userMainChurchId = cleanText(currentUser?.mainChurchId || currentUser?.homeChurchId || currentUser?.churchId);
    if (isYetalkLounge(userMainChurchId)) userMainChurchId = "";

    if (userMainChurchId) {
        currentChurchId = userMainChurchId;
        localStorage.setItem(STORAGE.currentChurch, currentChurchId);
        localStorage.setItem(STORAGE.primaryChurch, currentChurchId);
        await loadChurchInformation(null);
        return;
    }

    try {
        const reference = collection(db, "users", memberNo, "churches");
        const snapshot = await getDocs(reference);
        const churches = [];

        snapshot.forEach(item => {
            const data = item.data();
            const churchId = cleanText(data.churchId || item.id);
            const churchName = cleanText(data.churchName || data.name);
            if (isYetalkLounge(churchId, churchName) || cleanText(data.status).toLowerCase() === "deleted") return;
            churches.push({ id: item.id, ...data });
        });

        if (churches.length === 0) {
            applyNoChurchState();
            return;
        }

        const selected = churches.find(c => c.isMain === true) || churches.find(c => c.mainChurch === true) || churches.find(c => c.isHomeChurch === true) || churches[0];
        currentChurchId = getChurchIdFromData(selected, selected.id);

        if (!currentChurchId || isYetalkLounge(currentChurchId)) {
            applyNoChurchState();
            return;
        }

        localStorage.setItem(STORAGE.currentChurch, currentChurchId);
        localStorage.setItem(STORAGE.primaryChurch, currentChurchId);
        await loadChurchInformation(selected);
    } catch (error) {
        applyNoChurchState();
    }
}

async function loadChurchInformation(membershipData) {
    let churchData = null;
    try {
        const reference = doc(db, "churches", currentChurchId);
        const snapshot = await getDoc(reference);
        if (snapshot.exists()) {
            churchData = { id: snapshot.id, ...snapshot.data() };
        }
    } catch (error) {}

    // 🌟 파이어베이스 문서의 실제 한글 교회 이름(churchName 또는 name)을 우선 가져오고, 없으면 기본값 적용
    currentChurchName = cleanText(churchData?.churchName || churchData?.name || membershipData?.churchName || membershipData?.name || localStorage.getItem("yetalkMyChurchName") || "예톡샘플교회");
    currentChurchRegistered = Boolean(currentChurchId);

    if (currentChurchRegistered) {
        localStorage.setItem("yetalkMyChurchName", currentChurchName);
    }
    applyChurchState();
}


/*==================================================
OPEN MY CHURCH APP HOME (🚀 절대 경로 규격 적용)
==================================================*/

function openMyChurchAppHome() {
    const churchId = getLocalPrimaryChurchId() || cleanText(currentChurchId);

    if (!churchId) {
        location.href = PAGE_LINKS.churchSearch;
        return;
    }

    localStorage.setItem(STORAGE.currentChurch, churchId);

    // 🌟 PAGE_LINKS.churchMain을 활용하여 절대 경로 규격으로 정확하게 이동
    location.href = PAGE_LINKS.churchMain + "?churchId=" + encodeURIComponent(churchId);
}


/*==================================================
NOTICE & EMPTY STATE
==================================================*/

function createNoticePreviewItem(text, index) {
    const item = document.createElement("div");
    item.className = "church-notice-item";
    const number = document.createElement("b");
    number.textContent = `${index + 1}.`;
    const content = document.createElement("span");
    content.textContent = cleanText(text);
    item.append(number, content);
    return item;
}

function showNoticeEmptyState() {
    if (!dom.churchNoticePreview) return;
    dom.churchNoticePreview.innerHTML = "";
    const messages = currentChurchRegistered ? ["등록된 교회 공지가 없습니다.", "새 공지가 등록되면 이곳에 표시됩니다."] : ["교회를 등록하면 본교회의 공지가 표시됩니다.", "교회 소식과 예배 안내를 확인할 수 있습니다."];
    messages.slice(0, 2).forEach((message, index) => {
        dom.churchNoticePreview.appendChild(createNoticePreviewItem(message, index));
    });
    dom.churchNoticeCount?.classList.add("hidden");
}

function openChurchNotice() {}


/*==================================================
OVERLAYS
==================================================*/

function openOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
}


/*==================================================
GIVING & CALENDAR
==================================================*/

function openChurchGiving() {
    const churchId = getLocalPrimaryChurchId() || cleanText(currentChurchId);
    if (!churchId) {
        showToast("우리교회를 먼저 등록해 주세요.");
        setTimeout(() => { location.href = PAGE_LINKS.churchSearch; }, 500);
        return;
    }
    location.href = "https://appassets.androidplatform.net/assets/churchmain.html?churchId=" + encodeURIComponent(churchId) + "#givingSection";
}

function openChurchCalendar() {
    const churchId = getLocalPrimaryChurchId() || cleanText(currentChurchId);
    if (!churchId) {
        showToast("우리교회를 먼저 등록해 주세요.");
        return;
    }
    location.href = "https://appassets.androidplatform.net/assets/churchcalendar.html?churchId=" + encodeURIComponent(churchId);
}


/*==================================================
EVENT BINDINGS
==================================================*/

function bindHeaderEvents() {
    dom.faithLogoBtn?.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); });
    dom.faithClock?.addEventListener("click", openChurchCalendar);
    dom.faithDate?.addEventListener("click", openChurchCalendar);
    dom.headerChurchGuideBtn?.addEventListener("click", openMyChurchAppHome);
    dom.headerAdminBtn?.addEventListener("click", () => {
        if (!canManageYetalk()) {
            showToast("예톡 관리자만 이용할 수 있습니다.");
            return;
        }
        location.href = PAGE_LINKS.admin;
    });
}

function bindChurchEvents() {
    dom.createChurchHomeBtn?.addEventListener("click", openMyChurchAppHome);
    dom.openMyChurchBtn?.addEventListener("click", () => { location.href = PAGE_LINKS.invite; });
}

function bindMainMenuEvents() {
    dom.prayerMenu?.addEventListener("click", () => { location.href = PAGE_LINKS.prayer; });
    dom.jesusWalkMenu?.addEventListener("click", () => { location.href = PAGE_LINKS.jesusWalk; });
    dom.missionaryMenu?.addEventListener("click", () => { location.href = PAGE_LINKS.missionary; });
    dom.inviteMenu?.addEventListener("click", () => { location.href = PAGE_LINKS.invite; });
}

function bindNoticeEvents() {
    dom.noticeCardBtn?.addEventListener("click", openChurchNotice);
    dom.noticeGuideCloseBtn?.addEventListener("click", () => { closeOverlay(dom.noticeGuidePopup); });
    dom.noticeGuideBtn?.addEventListener("click", () => { closeOverlay(dom.noticeGuidePopup); });
}

function bindCoupangEvent() {
    dom.coupangCardBtn?.addEventListener("click", () => { showToast("쿠팡 연결은 다음 작업에서 추가합니다."); });
}

function bindBottomNavigation() {
    dom.bottomHomeBtn?.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); });
    dom.bottomFamilyPrayerBtn?.addEventListener("click", () => { location.href = PAGE_LINKS.familyPrayer; });
    dom.bottomChurchGivingBtn?.addEventListener("click", openChurchGiving);
    dom.bottomMyNoteBtn?.addEventListener("click", () => { location.href = PAGE_LINKS.myNote; });
    dom.bottomMyInfoBtn?.addEventListener("click", () => { location.href = PAGE_LINKS.myInfo; });
}

function bindPopupCloseEvents() {
    dom.noticeGuidePopup?.addEventListener("click", event => {
        if (event.target === dom.noticeGuidePopup) closeOverlay(dom.noticeGuidePopup);
    });
    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        closeOverlay(dom.noticeGuidePopup);
    });
}

function bindEvents() {
    bindHeaderEvents();
    bindChurchEvents();
    bindMainMenuEvents();
    bindNoticeEvents();
    bindCoupangEvent();
    bindBottomNavigation();
    bindPopupCloseEvents();
}


/*==================================================
FIREBASE INITIALIZE
==================================================*/

async function initFirebase() {
    loginUser = getStoredLoginUser();
    if (!loginUser) {
        location.href = PAGE_LINKS.login;
        return false;
    }

    const memberNo = getMemberNo();
    if (!memberNo) {
        showToast("회원번호를 확인할 수 없습니다.");
        return false;
    }

    try {
        const reference = doc(db, "users", memberNo);
        const snapshot = await getDoc(reference);

        if (!snapshot.exists()) {
            localStorage.removeItem(STORAGE.loginUser);
            alert("회원정보가 없습니다. 다시 로그인해 주세요.");
            location.href = PAGE_LINKS.login;
            return false;
        }

        currentUser = { id: snapshot.id, ...snapshot.data() };
        applyUserData();
        updateAdminVisibility();
        await loadMainChurch(memberNo);
        return true;
    } catch (error) {
        showToast(error?.message || "회원정보를 불러오지 못했습니다.");
        return false;
    }
}


/*==================================================
INITIALIZE INDEX
==================================================*/

async function initializeIndex() {
    selectSessionTheme();
    applyTheme();
    startFaithClock();
    showTodayCommandment();
    showNoticeEmptyState();
    bindEvents();
    await initFirebase();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeIndex().catch(error => {
        showToast("예톡 홈을 불러오는 중 오류가 발생했습니다.");
    });
});