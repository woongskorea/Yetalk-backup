/*==================================================
YETALK CHURCHMAIN.JS
예톡 교회홈 (숏폼 스냅 & 애드몹 안전 규격 연동)
==================================================*/

const MENU_DEFINITIONS = [
    { id: 0, cat: "교회", link: "churchintro.html" },
    { id: 1, cat: "예배", link: "churchworship.html" },
    { id: 2, cat: "주보", link: "churchjubo.html" },
    { id: 3, cat: "공지알림", link: "churchnotice.html" },
    { id: 4, cat: "기도모임", link: "churchpray.html" },
    { id: 5, cat: "교회초청", link: "churchinvite.html" },
    { id: 6, cat: "예수동행", link: "churchjesuswalking.html" },
    { id: 7, cat: "소모임방", link: "churchmember.html" },
    { id: 8, cat: "다음세대", link: "churchnextgen.html" },
    { id: 9, cat: "선교전도", link: "churchmission.html" },
    { id: 10, cat: "보물창고", link: "churcharchive.html" }
];

const SHARED_WORSHIP_KEY = "yetalk_church_worship_v31";
const WORSHIP_SLIDE_KEYS = ["sunday", "wednesday", "friday", "dawn", "special", "praise"];

const DEFAULT_SHARED_WORSHIP = {
    sunday: { tabName: "주일예배", title: "주일 대예배 실황", verse: "“신령과 진정으로 드리는 예배”", body: "주일 오전 11시 본당 생중계 및 설교 말씀", timeBadge: "주일 11:00", meta: "요한복음 3장 16절 ~ 18절 · 담임목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=90" },
    wednesday: { tabName: "수요예배", title: "수요 성경강해", verse: "“주의 말씀은 내 발의 등이요”", body: "수요일 저녁 7시 30분 말씀 강해", timeBadge: "수요일 19:30", meta: "창세기 12장 1절 ~ 4절 · 담임목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1507842229452-772d1c9ab458?auto=format&fit=crop&w=1600&q=90" },
    friday: { tabName: "금요기도회", title: "금요 성령기도회", verse: "“너는 내게 부르짖으라”", body: "금요일 밤 9시 뜨거운 찬양과 기도회", timeBadge: "금요일 21:00", meta: "사도행전 1장 8절 · 담임목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1600&q=90" },
    dawn: { tabName: "새벽기도회", title: "오늘 새벽기도회", verse: "“새벽을 깨우리로다”", body: "매일 새벽 5시 30분 하루를 여는 은혜의 말씀", timeBadge: "새벽 05:30", meta: "시편 23편 1절 ~ 6절 · 교구목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1600&q=90" },
    special: { tabName: "특별예배", title: "부흥 및 헌신예배", verse: "“내 잔이 넘치나이다”", body: "교회 창립기념 및 절기 특별 부흥성회", timeBadge: "특별 일정", meta: "에베소서 4장 11절 ~ 16절 · 초청강사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=90" },
    praise: { tabName: "찬양모음", title: "은혜로운 찬양과 경배", verse: "“호흡이 있는 자마다 여호와를 찬양할지어다”", body: "주일 찬양대 및 찬양팀 은혜 찬양 모음", timeBadge: "상시 재생", meta: "할렐루야 찬양대 및 찬양팀", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=90" }
};

function createDefaultSlides(catName, isWorship = false) {
    if (catName === "교회" || catName === "교회의꿈") {
        return [
            { title: "교회", verse: "2026 온 성도 사랑과 감사의 축제", body: "하나님의 거룩한 임재와 은혜가 머무는 따뜻한 사랑의 공동체입니다.", yt: "", img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=90" },
            { title: "교회", verse: "세상을 밝히는 복음의 빛과 사랑", body: "세상을 밝히고 이웃에게 그리스도의 사랑을 흘려보내는 은혜의 통로입니다.", yt: "", img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90" },
            { title: "교회", verse: "말씀 위에 굳건히 서는 믿음의 교회", body: "진리의 말씀 위에 굳건히 서서 믿음으로 승리하는 주님의 몸 된 교회입니다.", yt: "", img: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1600&q=90" },
            { title: "교회", verse: "그리스도 안에서 하나 되는 사랑의 교제", body: "모든 성도가 그리스도 안에서 한 가족 되어 기쁨과 감사를 함께 나눕니다.", yt: "", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=90" },
            { title: "교회", verse: "성령의 능력으로 부르짖는 기도의 제단", body: "성령의 불길로 무릎 꿇어 부르짖으며 하나님의 능력을 체험하는 기도의 제단입니다.", yt: "", img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=90" },
            { title: "교회", verse: "땅끝까지 전하는 예수 생명의 증인", body: "복음의 열정으로 땅끝까지 예수 그리스도의 생명의 증인으로 나아갑니다.", yt: "", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=90" },
            { title: "교회", verse: "하나님의 영광과 임재가 가득한 처소", body: "하나님의 영광과 임재가 가득한 영원한 은혜의 처소, 예톡행복한교회입니다.", yt: "", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=90" }
        ];
    }
    if (catName === "예배") {
        return [
            { title: "예배", verse: "신령과 진정으로 드리는 거룩한 예배", body: "주일과 주중 모든 예배 실황과 은혜의 말씀을 나눕니다.", yt: "", img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=90" },
            { title: "예배", verse: "주의 말씀은 내 발의 등이요 내 길의 빛", body: "성령의 임재와 말씀의 능력을 경험하는 은혜의 축제입니다.", yt: "", img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90" },
            { title: "예배", verse: "살아계신 하나님을 깊이 만나는 축제", body: "뜨거운 찬양과 기도로 살아계신 하나님을 깊이 만납니다.", yt: "", img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=90" }
        ];
    }
    if (catName === "보배성도" || catName === "소모임방") {
        return [
            { title: "소모임방", verse: "주 안에서 하나 되는 행복셀 나눔", body: "주 안에서 하나 되어 기쁨과 감사를 나누는 은혜의 행복셀 모임입니다.", yt: "", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=90" },
            { title: "소모임방", verse: "사랑과 선행으로 격려하는 은혜의 교제", body: "말씀으로 세워지고 기도로 중보하며 함께 자라가는 나눔셀 모임입니다.", yt: "", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=90" },
            { title: "소모임방", verse: "세상의 빛과 소금 된 존귀한 성도들", body: "세상의 빛과 소금으로 부르심 받은 존귀한 성도들의 믿음의 교제입니다.", yt: "", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1600&q=90" },
            { title: "소모임방", verse: "선교 사역 및 미디어 방송 공식 후원", body: "주님의 평안과 풍성한 은혜가 사랑하는 성도님의 가정과 삶에 충만하시길 기도합니다.", yt: "", img: "", isAdmob250: true }
        ];
    }
    if (catName === "공지알림") {
        return [
            { title: "공지알림", verse: "은혜와 사랑이 넘치는 교회 주요 소식", body: "하나님의 거룩한 사랑과 교회의 은혜로운 주요 소식을 함께 나눕니다.", yt: "", img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=90" },
            { title: "공지알림", verse: "성도 영적 성장을 위한 목회 안내", body: "성도 여러분의 영적 성장과 동역을 위한 안내 말씀입니다.", yt: "", img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90" },
            { title: "공지알림", verse: "선교 사역 및 복음 전파 공식 스폰서", body: "선교 사역과 복음 전파를 후원하는 공식 스폰서 슬롯과 함께합니다.", yt: "", img: "", isAdmob250: true }
        ];
    }
    if (catName === "예수동행") {
        return [
            { title: "예수동행", verse: "24시간 주님을 의식하는 은혜의 동행", body: "매일 삶의 모든 순간마다 주님을 의식하고 동행하는 24시간 은혜의 여정입니다.", yt: "", img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90" },
            { title: "예수동행", verse: "동행일기로 날마다 누리는 주님의 인도", body: "동행일기와 나눔을 통해 날마다 주님의 인도하심을 깊이 누립니다.", yt: "", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=90" },
            { title: "예수동행", verse: "선한 목자 예수님 품 안의 참된 평안", body: "선한 목자 되신 예수님 품 안에서 온전한 평안과 안식을 얻습니다.", yt: "", img: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1600&q=90" }
        ];
    }
    // 🌟 메뉴의 한줄 행사/소제목만 선명하게 표시!
    return [
        { title: catName, verse: `2026 ${catName} 사랑과 은혜의 축제`, body: "하나님의 거룩한 임재와 은혜가 머무는 따뜻한 공동체입니다.", yt: "", img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=90" },
        { title: catName, verse: `날마다 말씀으로 승리하는 ${catName}`, body: "날마다 말씀으로 승리하는 은혜의 동행입니다.", yt: "", img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90" },
        { title: catName, verse: "그리스도의 따뜻한 사랑을 온 세상에", body: "그리스도의 따뜻한 사랑을 온 세상에 전합니다.", yt: "", img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=90" }
    ];
}

function isDoctorDirtySlide(s) {
    if (!s) return true;
    if (s.img && s.img.startsWith("data:")) return true; // 이전에 캡처된 성형외과 Before/After 캔버스 이미지 원천 박멸!
    const txt = ((s.title || '') + ' ' + (s.verse || '') + ' ' + (s.body || '') + ' ' + (s.img || '')).toLowerCase();
    const bad = ['시술', '사각턱', 'before', 'after', '비포', '애프터', '성형', '필러', '보톡스', '원장', '의원', '피부과', '병원'];
    return bad.some(w => txt.includes(w.toLowerCase()));
}

function checkIsSubAdminOrAbove() {
    const job = (localStorage.getItem("yetalkUserJobType") || "").trim();
    const role = (localStorage.getItem("yetalkUserRole") || "").trim();
    const grade = (localStorage.getItem("yetalkUserGrade") || "").trim();
    const isAdmin = localStorage.getItem("yetalkIsAdmin") === "true";
    const isSubAdmin = localStorage.getItem("yetalkIsSubAdmin") === "true";

    if (job === "일반성도" || role === "일반성도" || grade === "일반성도") {
        return false;
    }
    const adminJobs = ["담임목사", "목사", "부목사", "전도사", "기독교사역자", "사역자", "관리자", "부관리자", "총관리자"];
    if (adminJobs.some(k => job.includes(k) || role.includes(k) || grade.includes(k))) {
        return true;
    }
    if (isAdmin || isSubAdmin) {
        return true;
    }
    return true; // 기본값: 부관리자 이상 권한 제공
}

function openCardSlideEdit(secId) {
    activeSecId = secId;
    openCurrentSlideEdit();
}

function getSharedWorshipData() {
    const saved = localStorage.getItem(SHARED_WORSHIP_KEY);
    let data = null;
    if (saved) {
        try { data = JSON.parse(saved); } catch(e) {}
    }
    if (!data) {
        data = JSON.parse(JSON.stringify(DEFAULT_SHARED_WORSHIP));
    }
    // 🌟 사용자 요청: 예배의 첫화면 영상은 마지막 주일 예배 영상이면서 라이브일 때는 라이브 영상
    const isLive = localStorage.getItem("yetalk_church_live_broadcast") === "true";
    const liveYt = localStorage.getItem("yetalk_church_live_video_url");
    const liveTitle = localStorage.getItem("yetalk_church_live_video_title");
    if (isLive && liveYt && data.sunday) {
        data.sunday.yt = liveYt;
        data.sunday.title = liveTitle || "🔴 실시간 주일예배 라이브 생중계";
        data.sunday.timeBadge = "🔴 LIVE";
    }
    return data;
}

let churchSlideData = {};
let currentSlideIndices = {};
let activeSecId = 0;
let tempEditImgBase64 = "";
let isScreenLocked = false;
let isWorshipLocked = false;
let worshipYtPlayer = null;

function initChurchData() {
    const STORAGE_KEY_V41 = "yetalk_church_main_slides_v41";
    let saved = localStorage.getItem(STORAGE_KEY_V41);
    let needVerseMigration = false;
    if (!saved) {
        saved = localStorage.getItem("yetalk_church_main_slides_v40") || localStorage.getItem("yetalk_church_main_other_slides_v38") || localStorage.getItem("yetalk_church_main_other_slides_v33") || localStorage.getItem("yetalk_church_main_other_slides_v31");
        needVerseMigration = true;
    }
    if (saved) {
        try {
            saved = saved.replace(/photo-1519681393784-d120267933ba/g, 'photo-1438232992991-995b7058bbb3')
                         .replace(/photo-1544717305-2782549b5136/g, 'photo-1438232992991-995b7058bbb3');
            churchSlideData = JSON.parse(saved);
        } catch(e) {}
    }

    MENU_DEFINITIONS.forEach(m => {
        if (m.id === 0) {
            // 🌟 교회 (0번 메뉴): 7개 슬라이드 완전 보장 & 한줄 행사/소제목 적용
            const list0 = churchSlideData[0];
            if (!list0 || !Array.isArray(list0) || list0.length < 7 || list0.some(isDoctorDirtySlide) || needVerseMigration) {
                churchSlideData[0] = createDefaultSlides("교회", false);
            } else {
                churchSlideData[0].forEach(s => {
                    if (s.title === "교회의꿈" || (s.title && (s.title.includes("1:") || s.title.includes("은혜의 비전")))) {
                        s.title = "교회";
                    }
                });
            }
        } else if (m.id === 1) {
            churchSlideData[1] = createDefaultSlides("예배", false);
        } else if (m.id === 3) {
            const list3 = churchSlideData[3];
            if (!list3 || !Array.isArray(list3) || list3.length < 3 || !list3[list3.length - 1].isAdmob250 || list3.some(isDoctorDirtySlide) || needVerseMigration) {
                churchSlideData[3] = createDefaultSlides("공지알림", false);
            }
        } else if (m.id === 7) {
            // 🌟 소모임방 (성도 교제 및 셀 모임): 마지막 슬라이드에 250 애드몹 보장!
            const list7 = churchSlideData[7];
            if (!list7 || !Array.isArray(list7) || list7.length < 3 || !list7[list7.length - 1].isAdmob250 || list7.some(isDoctorDirtySlide) || needVerseMigration) {
                churchSlideData[7] = createDefaultSlides("소모임방", false);
            } else {
                churchSlideData[7].forEach(s => {
                    if (s.title === "보배성도" || !s.title) s.title = "소모임방";
                });
            }
        } else if (m.id === 6) {
            const list6 = churchSlideData[6];
            if (!list6 || !Array.isArray(list6) || list6.length < 3 || list6.some(isDoctorDirtySlide) || needVerseMigration) {
                churchSlideData[6] = createDefaultSlides("예수동행", false);
            }
        } else {
            const currentList = churchSlideData[m.id];
            const hasDirtyData = Array.isArray(currentList) && currentList.some(isDoctorDirtySlide);
            if (!currentList || !Array.isArray(currentList) || currentList.length < 3 || hasDirtyData || needVerseMigration) {
                churchSlideData[m.id] = createDefaultSlides(m.cat, false);
            } else {
                // 이전 데이터의 "1: 은혜의 비전" 등의 수식어 정제
                churchSlideData[m.id].forEach(s => {
                    if (s.title && (s.title.includes("1:") || s.title.includes("2:") || s.title.includes("3:") || s.title.includes("은혜의 비전") || s.title.includes("은혜의 비젼"))) {
                        s.title = m.cat;
                    }
                });
            }
        }
        currentSlideIndices[m.id] = 0;
    });

    try {
        localStorage.setItem(STORAGE_KEY_V41, JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_slides_v40", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v38", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v33", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v31", JSON.stringify(churchSlideData));
    } catch(e) {}

    renderChurchView();
    setupSectionObserver();

    // 🌟 [사용자 요청] 하부페이지에서 복귀 시 보고 있던 해당 메뉴 카드로 자동 복귀
    restoreLastActiveCard(false);
}

function restoreLastActiveCard(instant) {
    let targetCard = 0;
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const cardParam = urlParams.get("card");
        const lastCard = sessionStorage.getItem("church_last_active_card_idx");
        if (cardParam !== null && !isNaN(parseInt(cardParam, 10))) {
            targetCard = parseInt(cardParam, 10);
        } else if (lastCard !== null && !isNaN(parseInt(lastCard, 10))) {
            targetCard = parseInt(lastCard, 10);
        }
    } catch(e) {}

    if (targetCard > 0 && targetCard < MENU_DEFINITIONS.length) {
        activeSecId = targetCard;
        updateChipsBar(targetCard);
        const target = document.getElementById(`section_card_${targetCard}`);
        const vp = document.getElementById("churchViewport");
        if (target && vp) {
            if (instant) {
                vp.scrollTop = target.offsetTop;
            } else {
                setTimeout(() => {
                    scrollToCard(targetCard);
                }, 100);
            }
        }
    } else {
        // 4초 간격 첫 메뉴(교회 카드 0) 자동 슬라이드 시작
        startCard0AutoSlide();
    }
}

window.addEventListener("pageshow", () => {
    restoreLastActiveCard(true);
});

let churchSlide0Timer = null;
function startCard0AutoSlide() {
    if (churchSlide0Timer) clearInterval(churchSlide0Timer);
    churchSlide0Timer = setInterval(() => {
        const editModal = document.getElementById("cardSlideEditModal");
        if (editModal && editModal.style.display === "flex") return;
        changeCardSlide(0, 1);
    }, 4000);
}

function extractYoutubeVideoId(url) {
    if (!url) return null;
    let videoId = null;
    if (url.includes("youtube.com/live/")) videoId = url.split("youtube.com/live/")[1].split("?")[0].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0].split("&")[0];
    else if (url.includes("shorts/")) videoId = url.split("shorts/")[1].split("?")[0].split("&")[0];
    else if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    return videoId ? videoId.trim() : null;
}

function getCurrentLiveWorship() {
    const savedType = localStorage.getItem("yetalk_church_live_service_type");
    const savedName = localStorage.getItem("yetalk_church_live_worship_name");
    if (savedName) return { name: savedName, tabKey: savedType || "sunday" };

    const now = new Date();
    const day = now.getDay(); // 0: 일, 1: 월, 2: 화, 3: 수, 4: 목, 5: 금, 6: 토
    const hour = now.getHours();

    if (day === 0) {
        return { name: "주일 대예배", tabKey: "sunday" };
    } else if (day === 3) {
        return { name: "수요 성경강해", tabKey: "wednesday" };
    } else if (day === 5) {
        return { name: "금요 성령기도회", tabKey: "friday" };
    } else if (hour >= 5 && hour < 7) {
        return { name: "새벽기도회", tabKey: "dawn" };
    } else {
        return { name: "주일 대예배", tabKey: "sunday" };
    }
}

function goToLiveWorship(tabKey) {
    sessionStorage.setItem("church_last_active_card_idx", "1");
    location.href = `churchworship.html?tab=${tabKey || 'sunday'}`;
}

function goToDetailPage(secId, targetLink) {
    sessionStorage.setItem("church_last_active_card_idx", secId.toString());
    location.href = targetLink;
}

const FOUR_TIMES_SHORT_VERSES = {
    morning: "🌅 주의 인자하심 들으라", // 10자
    noon: "☀️ 여호와를 앙망하라",     // 9자
    evening: "🌆 평안을 너희에게",     // 9자
    night: "🌙 주 날개 아래 평안"      // 10자
};

function getActiveShortVerse() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return FOUR_TIMES_SHORT_VERSES.morning;
    if (hour >= 11 && hour < 17) return FOUR_TIMES_SHORT_VERSES.noon;
    if (hour >= 17 && hour < 22) return FOUR_TIMES_SHORT_VERSES.evening;
    return FOUR_TIMES_SHORT_VERSES.night;
}

const FOUR_TIMES_WORDS = {
    morning: { tag: "🌅 오늘 아침 말씀", text: "“아침에 나로 하여금 주의 인자한 말씀을 듣게 하소서 (시 143:8)”" },
    noon: { tag: "☀️ 한낮의 말씀", text: "“오직 여호와를 앙망하는 자는 새 힘을 얻으리니 (사 40:31)”" },
    evening: { tag: "🌆 저녁의 말씀", text: "“평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 (요 14:27)”" },
    night: { tag: "🌙 안식의 말씀", text: "“내가 평안히 눕고 자기도 하리니 나를 안전히 살게 하시는 이는 오직 여호와이시니이다 (시 4:8)”" }
};

function getActiveWord() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return FOUR_TIMES_WORDS.morning;
    if (hour >= 11 && hour < 17) return FOUR_TIMES_WORDS.noon;
    if (hour >= 17 && hour < 22) return FOUR_TIMES_WORDS.evening;
    return FOUR_TIMES_WORDS.night;
}

function checkIfShortsUrl(url) {
    if (!url) return false;
    return url.includes("/shorts/") || url.includes("format=shorts");
}

let isWorshipImmersive = false;

function setupWorshipMessageListener() {
    window.addEventListener("message", function(e) {
        if (!e.data) return;
        try {
            let data = e.data;
            if (typeof data === "string") {
                try { data = JSON.parse(data); } catch(err) {}
            }
            if (typeof data === "object" && data !== null) {
                if (data.event === "onStateChange") {
                    if (data.info === 1) { // PLAYING
                        setWorshipPlayingMode(true);
                    } else if (data.info === 2 || data.info === 0) { // PAUSED or ENDED
                        setWorshipPlayingMode(false);
                    }
                } else if (data.event === "infoDelivery" && data.info) {
                    if (data.info.playerState === 1) {
                        setWorshipPlayingMode(true);
                    } else if (data.info.playerState === 2 || data.info.playerState === 0) {
                        setWorshipPlayingMode(false);
                    }
                }
            }
        } catch(err) {}
    });

    window.addEventListener("blur", function() {
        if (activeSectionIndex === 1 && !isWorshipLocked) {
            setTimeout(() => {
                setWorshipPlayingMode(true);
            }, 500);
        }
    });
}

function setWorshipPlayingMode(isPlaying) {
    isWorshipImmersive = !!isPlaying;
    const imBtnText = document.getElementById("worshipImmersiveText");
    const imBtnIcon = document.getElementById("worshipImmersiveIcon");
    if (isPlaying) {
        document.body.classList.add("church-worship-playing");
        if (imBtnText) imBtnText.innerText = "메뉴보기";
        if (imBtnIcon) imBtnIcon.innerText = "📋";
    } else {
        document.body.classList.remove("church-worship-playing");
        if (imBtnText) imBtnText.innerText = "몰입모드 (메뉴숨김)";
        if (imBtnIcon) imBtnIcon.innerText = "🎬";
    }
}

function toggleWorshipImmersive(e) {
    if (e) e.stopPropagation();
    const willBeImmersive = !document.body.classList.contains("church-worship-playing");
    setWorshipPlayingMode(willBeImmersive);
    if (willBeImmersive) {
        showToast("🎬 몰입 모드 ON: 영상과 애드몹에만 집중합니다. (아래 '메뉴보기'로 복구)");
    } else {
        showToast("📋 전체 메뉴가 다시 표시됩니다.");
    }
}

function toggleWorshipScreenLock(e) {
    if (e) e.stopPropagation();
    isWorshipLocked = !isWorshipLocked;
    const btn = document.getElementById("btnWorshipLock");
    const icon = document.getElementById("worshipLockIcon");
    const text = document.getElementById("worshipLockText");
    const guard = document.getElementById("touchGuardShield");

    if (isWorshipLocked) {
        if (btn) btn.classList.add("locked");
        if (icon) icon.innerText = "🔒";
        if (text) text.innerText = "고정ON";
        if (guard) guard.classList.add("active");
        showToast("🔒 화면 보호 ON: 터치 및 스크롤이 차단되어 안전하게 재생됩니다.");
    } else {
        if (btn) btn.classList.remove("locked");
        if (icon) icon.innerText = "🔓";
        if (text) text.innerText = "화면고정";
        if (guard) guard.classList.remove("active");
        showToast("🔓 화면 보호가 해제되었습니다.");
    }
}

function loadWorshipYt(ytId, isShorts) {
    const ytBox = document.getElementById("ytBox_1");
    if (!ytBox) return;

    ytBox.classList.toggle("is-shorts", !!isShorts);
    ytBox.innerHTML = `
        <iframe id="worshipIframe"
                src="https://www.youtube.com/embed/${ytId}?autoplay=0&controls=1&enablejsapi=1&playsinline=1&rel=0&modestbranding=1"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen="true"></iframe>
    `;

    if (window.YT && window.YT.Player) {
        try {
            worshipYtPlayer = new YT.Player("worshipIframe", {
                events: {
                    'onStateChange': function(event) {
                        if (event.data === YT.PlayerState.PLAYING) {
                            setWorshipPlayingMode(true);
                        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                            setWorshipPlayingMode(false);
                        }
                    }
                }
            });
        } catch(e) {}
    }
}

function renderChurchView() {
    const vp = document.getElementById("churchViewport");
    const guard = document.getElementById("touchGuardShield");
    vp.innerHTML = "";
    if (guard) vp.appendChild(guard);

    MENU_DEFINITIONS.forEach(sec => {
        const card = document.createElement("section");
        card.className = "snap-card-section";
        card.id = `section_card_${sec.id}`;
        card.dataset.index = sec.id;

        let cardTouchStartX = 0, cardTouchStartY = 0, hasSwipedHoriz = false;
        card.addEventListener("touchstart", (e) => {
            if (e.touches.length === 1) {
                cardTouchStartX = e.touches[0].clientX;
                cardTouchStartY = e.touches[0].clientY;
                hasSwipedHoriz = false;
            }
        }, { passive: true });

        card.addEventListener("touchend", (e) => {
            if (e.changedTouches.length === 1) {
                const diffX = e.changedTouches[0].clientX - cardTouchStartX;
                const diffY = e.changedTouches[0].clientY - cardTouchStartY;
                if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
                    hasSwipedHoriz = true;
                    if (diffX < 0) {
                        changeCardSlide(sec.id, 1);
                    } else {
                        changeCardSlide(sec.id, -1);
                    }
                }
            }
        }, { passive: true });

        card.onclick = (e) => {
            if (hasSwipedHoriz) { hasSwipedHoriz = false; return; }
            if (e.target.closest('.slide-arrow-btn')) return;
            goToDetailPage(sec.id, sec.link);
        };

        const slides = churchSlideData[sec.id] || createDefaultSlides(sec.cat, false);
        const cur = slides[0];

        let liveBannerHtml = "";
        if (sec.id === 1) {
            const isLive = localStorage.getItem("yetalk_church_live_broadcast") === "true";
            const liveInfo = getCurrentLiveWorship();
            if (isLive) {
                liveBannerHtml = `
                    <div class="card-live-blinking-pill" style="background:#ef4444; border-color:#dc2626; box-shadow:0 2px 10px rgba(239,68,68,0.5);" onclick="event.stopPropagation(); goToLiveWorship('${liveInfo.tabKey}');" title="${liveInfo.name} 실시간 라이브 시청">
                        <span class="blinking-red-dot" style="color:#ffffff;">●</span>
                        <span class="live-pill-text" style="color:#ffffff; font-weight:950;">주일예배 LIVE 생중계 ▶</span>
                    </div>
                `;
            }
        }

        card.innerHTML = `
            <div class="snap-card-inner-box">
                <img class="card-bg-img" id="slide_img_${sec.id}" src="${cur.img}" alt="${sec.cat}">
                <div class="card-gradient-overlay"></div>

                <!-- 🌟 250 애드몹 (300 × 250) 슬롯 (소모임방/공지알림 마지막 슬라이드 전용) -->
                <div class="card-embedded-admob-250" id="cardEmbeddedAdmob_${sec.id}" style="display:none; width:300px; height:250px; background:#0b1120; border:1.5px solid #1e3a5f; border-radius:16px; box-shadow:0 4px 18px rgba(0,0,0,0.6); flex-direction:column; align-items:center; justify-content:center; text-align:center; position:absolute; top:42%; left:50%; transform:translate(-50%, -50%); z-index:15;">
                    <div style="font-size:10px; color:#64748b; font-weight:900; letter-spacing:0.8px; margin-bottom:6px;">AD • Google AdMob 공식 스폰서 (300 × 250)</div>
                    <div style="font-size:16px; font-weight:900; color:#38bdf8; margin-bottom:4px;">Google AdMob Medium Rectangle</div>
                    <div style="font-size:11px; color:#94a3b8; padding:0 20px; line-height:1.4;">선교 사역 및 미디어 영상 방송 공식 후원 슬롯</div>
                    <div style="margin-top:10px; padding:4px 12px; background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.4); border-radius:18px; font-size:10px; font-weight:800; color:#38bdf8;">미디어 선교 후원 배너</div>
                </div>

                <button type="button" class="slide-arrow-btn slide-arrow-left" ontouchstart="event.stopPropagation();" ontouchend="event.stopPropagation(); changeCardSlide(${sec.id}, -1);" onclick="event.stopPropagation(); changeCardSlide(${sec.id}, -1);">‹</button>
                <button type="button" class="slide-arrow-btn slide-arrow-right" ontouchstart="event.stopPropagation();" ontouchend="event.stopPropagation(); changeCardSlide(${sec.id}, 1);" onclick="event.stopPropagation(); changeCardSlide(${sec.id}, 1);">›</button>

                <!-- 🌟 카드 상단: 좌측 메뉴 타이틀 + 우측 관리/화면수정 버튼 (관리자 전용) -->
                <div class="card-top-content">
                    <div class="card-top-bar">
                        <h2 class="card-title-main" id="slide_title_${sec.id}">${sec.id === 7 ? '소모임방' : (cur.title || sec.cat)}</h2>
                        ${checkIsSubAdminOrAbove() ? `
                            <div class="card-top-admin-group">
                                <button type="button" class="btn-card-admin-room" onclick="event.stopPropagation(); location.href='churchadmin.html';" title="교회 관리실 이동">🏛️ 관리</button>
                                <button type="button" class="btn-card-admin-edit" onclick="event.stopPropagation(); openCardSlideEdit(${sec.id});" title="현재 카드 슬라이드 수정">✏️ 화면수정</button>
                            </div>
                        ` : ''}
                    </div>
                    ${sec.id === 1 ? liveBannerHtml : ''}
                </div>

                <div class="card-bottom-content">
                    <div class="card-verse-highlight" id="slide_verse_${sec.id}">${cur.verse}</div>
                    <div class="card-body-text" id="slide_body_${sec.id}">${cur.body}</div>
                    ${sec.id === 6 ? `
                        <div style="margin-top:6px;">
                            <button type="button" onclick="event.stopPropagation(); goToDetailPage(6, 'churchjesuswalking.html');" style="background:linear-gradient(135deg, #0284c7, #2563eb); border:1.5px solid #38bdf8; border-radius:24px; padding:6px 14px; color:#ffffff; font-size:12.5px; font-weight:950; box-shadow:0 4px 14px rgba(2,132,199,0.5); cursor:pointer; display:inline-flex; align-items:center; gap:5px;">
                                <span>🕊️</span> <span>담임목사님과 함께 (콕 누르세요 👆)</span>
                            </button>
                        </div>
                    ` : ''}

                    <!-- 🌟 [사용자 요청] 이미지 바탕 맨 아래에 포함된 한줄 4대 메뉴 (예톡TV, 복음, 오시는길, 헌금) -->
                    <div class="card-embedded-quick-nav">
                        <button type="button" class="c-quick-nav-btn" onclick="event.stopPropagation(); handleBottomNav('tv');" title="예톡TV 숏폼 보기">
                            <span class="c-quick-icon">📺</span>
                            <span class="c-quick-label">예톡TV</span>
                        </button>
                        <button type="button" class="c-quick-nav-btn" onclick="event.stopPropagation(); handleBottomNav('gospel');" title="복음 말씀">
                            <span class="c-quick-icon">📖</span>
                            <span class="c-quick-label">복음</span>
                        </button>
                        <button type="button" class="c-quick-nav-btn" onclick="event.stopPropagation(); handleBottomNav('map');" title="오시는길 약도">
                            <span class="c-quick-icon">📍</span>
                            <span class="c-quick-label">오시는길</span>
                        </button>
                        <button type="button" class="c-quick-nav-btn c-quick-offering" onclick="event.stopPropagation(); handleBottomNav('offering');" title="온라인 헌금">
                            <span class="c-quick-icon">💳</span>
                            <span class="c-quick-label">헌금</span>
                        </button>
                    </div>
                </div>

                <div class="slide-dots" id="dots_${sec.id}">
                    ${slides.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
                </div>
            </div>
        `;
        vp.appendChild(card);
    });

    // 🌟 엔딩 카드 (250 애드몹 확실한 배치 & 간격 확보 & 광고 선교 안내)
    const footerCard = document.createElement("section");
    footerCard.className = "final-footer-snap-card";
    footerCard.id = `section_card_11`;
    footerCard.dataset.index = 11;
    footerCard.innerHTML = `
        <!-- 🌟 광고 선교 안내 문구 (Image 5와 100% 일치) -->
        <div class="admob-mission-guide-box" style="margin:20px auto 14px auto; max-width:320px; padding:12px 14px; background:rgba(15,23,42,0.75); border:1px solid rgba(56,189,248,0.4); border-radius:12px; text-align:center;">
            <div style="font-size:12.5px; font-weight:800; color:#fde047; margin-bottom:4px;">📢 미디어 선교 사역 후원 안내</div>
            <div style="font-size:11.5px; color:#e2e8f0; line-height:1.45; word-break:keep-all;">여기는 앱과 홈페이지 운영을 위한 광고 선교를 위한 것이니 양해 바랍니다.</div>
        </div>

        <!-- 🌟 확실한 250 (300 × 250) 공식 애드몹 슬롯 (충분한 간격 유지) -->
        <div class="admob-medium-rectangle-card" style="margin:10px auto 26px auto; width:300px; height:250px; background:#0b1120; border:1.5px solid #1e3a5f; border-radius:16px; box-shadow:0 4px 18px rgba(0,0,0,0.6); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; overflow:hidden;">
            <div style="font-size:10px; color:#64748b; font-weight:900; letter-spacing:0.8px; margin-bottom:8px;">AD • Google AdMob 공식 스폰서 (300 × 250)</div>
            <div style="font-size:16px; font-weight:900; color:#38bdf8; margin-bottom:5px;">Google AdMob Medium Rectangle</div>
            <div style="font-size:11.5px; color:#94a3b8; padding:0 20px; line-height:1.4;">한국 교회 및 선교 미디어 공식 지원 스폰서</div>
            <div style="margin-top:14px; padding:5px 14px; background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.4); border-radius:20px; font-size:10.5px; font-weight:800; color:#38bdf8;">선교 사역 후원 배너</div>
        </div>

        <button type="button" class="btn-top-return" onclick="scrollToCard(0)">
            ⌃ 제일 위로 가기
        </button>
    `;
    vp.appendChild(footerCard);

    updateSlideContent(1, 0);
}

function changeCardSlide(secId, dir) {
    const slides = churchSlideData[secId];
    if (!slides || slides.length === 0) return;
    let idx = (currentSlideIndices[secId] || 0) + dir;
    if (idx >= slides.length) idx = 0;
    if (idx < 0) idx = slides.length - 1;
    currentSlideIndices[secId] = idx;
    updateSlideContent(secId, idx);
    if (secId === 0) {
        startCard0AutoSlide();
    }
}

function updateSlideContent(secId, idx) {
    const slides = churchSlideData[secId];
    if (!slides || !slides[idx]) return;
    const cur = slides[idx];
    const imgEl = document.getElementById(`slide_img_${secId}`);
    const admobEl = document.getElementById(`cardEmbeddedAdmob_${secId}`);
    const titleEl = document.getElementById(`slide_title_${secId}`);
    const verseEl = document.getElementById(`slide_verse_${secId}`);
    const bodyEl = document.getElementById(`slide_body_${secId}`);
    const dotsEl = document.getElementById(`dots_${secId}`);

    if (cur.isAdmob250) {
        if (imgEl) imgEl.style.display = "none";
        if (admobEl) admobEl.style.display = "flex";
    } else {
        if (imgEl) {
            imgEl.style.display = "block";
            if (cur.img) {
                imgEl.style.opacity = "0.5";
                imgEl.src = cur.img;
                imgEl.onload = () => { imgEl.style.opacity = "1"; };
                setTimeout(() => { imgEl.style.opacity = "1"; }, 300);
            }
        }
        if (admobEl) admobEl.style.display = "none";
    }

    let displayTitle = cur.title || MENU_DEFINITIONS[secId].cat;
    if (secId === 7 && (displayTitle === "보배성도" || !displayTitle)) displayTitle = "소모임방";
    if (titleEl) titleEl.innerText = displayTitle;
    if (verseEl) verseEl.innerText = cur.verse || "";
    if (bodyEl) bodyEl.innerText = cur.body || "";

    if (dotsEl) {
        dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === idx));
    }

    checkAdmobFooterExclusion();
}

// 🌟 [사용자 요청 & 구글 정책] 컴퓨터(PC) 및 PC iframe 내부 또는 250 애드몹 노출 시 100 하단 애드몹 완전 숨김
function checkAdmobFooterExclusion() {
    const footer100 = document.getElementById("churchFixedAdmobFooter");
    if (!footer100) return;

    // PC 환경(아이프레임 포함)에서는 애드몹 완전 숨김
    const isPc = (window.parent !== window) || (window.innerWidth >= 900) || location.search.includes("pc=1") || (sessionStorage.getItem("yetalk_is_pc") === "true");
    if (isPc) {
        footer100.style.setProperty("display", "none", "important");
        document.body.classList.add("is-pc-mode");
        return;
    }

    const slides = churchSlideData[activeSecId];
    const curSlide = slides ? slides[currentSlideIndices[activeSecId] || 0] : null;
    const is250Active = (activeSecId === 11) || (curSlide && curSlide.isAdmob250);
    if (is250Active) {
        footer100.style.setProperty("display", "none", "important");
    } else {
        footer100.style.removeProperty("display");
    }
}

let isProgrammaticChurchScroll = false;

function setupSectionObserver() {
    const vp = document.getElementById("churchViewport");
    if (!vp) return;

    // 🌟 1. 세로 스크롤 시 뷰포트 정중앙과 가장 가까운 카드를 정밀 감지하여 1:1 매칭
    // (기존의 Math.round(top / h) 수학적 오차로 인해 '교회초청'이 건너뛰어지던 버그 원천 해결!)
    let scrollTimer = null;
    vp.addEventListener("scroll", () => {
        if (isProgrammaticChurchScroll) return;
        if (scrollTimer) cancelAnimationFrame(scrollTimer);
        scrollTimer = requestAnimationFrame(() => {
            if (isProgrammaticChurchScroll) return;
            const cards = vp.querySelectorAll(".snap-card-section, .final-footer-snap-card");
            const vpRect = vp.getBoundingClientRect();
            const vpCenter = vpRect.top + vpRect.height / 2;
            let closestIdx = activeSecId;
            let minDiff = Infinity;

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const diff = Math.abs(cardCenter - vpCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    const idx = parseInt(card.dataset.index, 10);
                    if (!isNaN(idx)) closestIdx = idx;
                }
            });

            if (closestIdx !== activeSecId && closestIdx >= 0 && closestIdx < MENU_DEFINITIONS.length) {
                activeSecId = closestIdx;
                try { sessionStorage.setItem("church_last_active_card_idx", closestIdx.toString()); } catch(e){}
                updateChipsBar(closestIdx);
                checkAdmobFooterExclusion();
            }
        });
    }, { passive: true });

    // 🌟 네이티브 CSS scroll-snap-type: y mandatory; 및 scroll-snap-stop: always; 를 온전히 적용하여
    // 충돌과 흔들림(앞뒤 덜컹거림) 없는 완벽한 원-카드 스냅 보장!
}

function updateChipsBar(idx) {
    document.querySelectorAll(".c-nav-chip").forEach((chip, i) => {
        const match = (i === idx);
        chip.classList.toggle("active", match);
        if (match) chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
    const curMenu = MENU_DEFINITIONS[idx];
    const subTitle = document.getElementById("fixedChurchSubbarTitle");
    if (curMenu && subTitle) {
        subTitle.innerText = `${curMenu.cat}`;
    }
    checkAdmobFooterExclusion();
}

let programmaticTimer = null;

function scrollToCard(index) {
    if (index < 0 || index >= MENU_DEFINITIONS.length) return;
    activeSecId = index;
    try { sessionStorage.setItem("church_last_active_card_idx", index.toString()); } catch(e){}
    updateChipsBar(index);
    const target = document.getElementById(`section_card_${index}`);
    const vp = document.getElementById("churchViewport");
    if (target && vp) {
        isProgrammaticChurchScroll = true;
        if (programmaticTimer) clearTimeout(programmaticTimer);
        vp.style.scrollSnapType = "none";

        const targetTop = target.offsetTop;
        vp.scrollTo({ top: targetTop, behavior: "smooth" });

        programmaticTimer = setTimeout(() => {
            vp.scrollTop = targetTop;
            vp.style.scrollSnapType = "y mandatory";
            setTimeout(() => {
                isProgrammaticChurchScroll = false;
            }, 150);
        }, 850);
    } else if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

/* 🌟 화면 고정 ON/OFF (터치 및 다음 영상 밀림 완전 차단) */
function toggleScreenLock() {
    isScreenLocked = !isScreenLocked;
    const btn = document.getElementById("btnToggleLock");
    const guard = document.getElementById("touchGuardShield");
    const viewport = document.getElementById("churchViewport");

    if (isScreenLocked) {
        btn.classList.add("locked");
        btn.innerText = "고정ON";
        if (guard) guard.classList.add("active");
        if (viewport) viewport.classList.add("locked-scroll");
        if (window.AndroidBridge && window.AndroidBridge.setLockKeepAudio) {
            window.AndroidBridge.setLockKeepAudio(true);
        }
        showToast("🔒 화면 보호 ON: 터치 및 스크롤이 차단되어 안전하게 재생됩니다.");
    } else {
        btn.classList.remove("locked");
        btn.innerText = "고정OFF";
        if (guard) guard.classList.remove("active");
        if (viewport) viewport.classList.remove("locked-scroll");
        if (window.AndroidBridge && window.AndroidBridge.setLockKeepAudio) {
            window.AndroidBridge.setLockKeepAudio(false);
        }
        showToast("🔓 화면 보호가 해제되었습니다.");
    }
}

function showLockedAlert() {
    showToast("🔒 화면 고정 중입니다. 상단 [고정ON] 버튼을 탭하세요.");
}

function handleBottomNav(type) {
    switch(type) {
        case 'gospel': location.href = "church_gospel.html"; break;
        case 'map': location.href = "church_map.html"; break;
        case 'offering': openChurchOfferingModal(); break;
        case 'tv': location.href = "index.html"; break;
        case 'coupang': runFastCoupangModal(); break;
    }
}

function openChurchOfferingModal() {
    document.getElementById("churchGiverName").value = localStorage.getItem("yetalkUserName") || "김예톡";
    document.getElementById("churchGiverBank").value = localStorage.getItem("yetalkGiverBank") || "국민은행";
    document.getElementById("churchGiverAcc").value = localStorage.getItem("yetalkGiverAcc") || "";

    document.getElementById("churchReceiverName").value = localStorage.getItem("yetalkChurchName") || "예톡행복한교회";
    document.getElementById("churchReceiverBank").value = localStorage.getItem("yetalkChurchBank") || "농협";
    document.getElementById("churchReceiverAcc").value = localStorage.getItem("yetalkChurchAcc") || "302-1234-5678-91";
    document.getElementById("churchReceiverHolder").value = localStorage.getItem("yetalkChurchHolder") || "예톡행복한교회";

    const savedPin = localStorage.getItem("yetalk_church_offering_pin") || localStorage.getItem("yetalkOfferingPin") || "";
    const pinEl = document.getElementById("churchOfferingPw");
    if (pinEl) pinEl.value = savedPin;

    openModal("churchOfferingModal");
}

function saveGiverInfo() {
    localStorage.setItem("yetalkUserName", document.getElementById("churchGiverName").value.trim());
    localStorage.setItem("yetalkGiverBank", document.getElementById("churchGiverBank").value);
    localStorage.setItem("yetalkGiverAcc", document.getElementById("churchGiverAcc").value.trim());
    showToast("✨ 출금 정보가 저장되었습니다!");
}

function saveChurchReceiverInfo() {
    localStorage.setItem("yetalkChurchName", document.getElementById("churchReceiverName").value.trim());
    localStorage.setItem("yetalkChurchBank", document.getElementById("churchReceiverBank").value.trim());
    localStorage.setItem("yetalkChurchAcc", document.getElementById("churchReceiverAcc").value.trim());
    localStorage.setItem("yetalkChurchHolder", document.getElementById("churchReceiverHolder").value.trim());
    showToast("✨ 교회 계좌 정보가 저장되었습니다!");
}

const CHURCH_BANK_MAP = {
    "국민은행": { scheme: "kbbank://", pkg: "com.kbstar.kbbank", name: "KB스타뱅킹" },
    "농협은행": { scheme: "nhapplink://", pkg: "nh.smart.banking", name: "NH스마트뱅킹" },
    "신한은행": { scheme: "shinhan-sr-sol://", pkg: "com.shinhan.sbanking", name: "신한 SOL뱅크" },
    "우리은행": { scheme: "wooribank://", pkg: "com.wooribank.smart.npib", name: "우리WON뱅킹" },
    "하나은행": { scheme: "hana1q://", pkg: "com.kebhana.hananbank", name: "하나원큐" },
    "카카오뱅크": { scheme: "kakaobank://", pkg: "com.kakaobank.channel", name: "카카오뱅크" },
    "토스뱅크": { scheme: "supertoss://", pkg: "viva.republica.toss", name: "토스" },
    "케이뱅크": { scheme: "kbank://", pkg: "com.kbankwith.smartbank", name: "케이뱅크" },
    "기업은행": { scheme: "ibk://", pkg: "com.ibk.neobanking", name: "i-ONE Bank(기업은행)" },
    "SC제일은행": { scheme: "scbank://", pkg: "com.scfirstbank.breeze", name: "SC제일은행" },
    "우체국": { scheme: "epost://", pkg: "com.epost.psns.sbanking", name: "우체국스마트뱅킹" },
    "새마을금고": { scheme: "kfcc://", pkg: "kr.co.kfcc.mobile", name: "MG더뱅킹" },
    "신협": { scheme: "cu://", pkg: "kr.co.cu.smartbank", name: "신협ON뱅크" },
    "수협은행": { scheme: "suhyup://", pkg: "com.suhyup.psb", name: "수협헤이뱅크" },
    "부산은행": { scheme: "bsbank://", pkg: "com.bsbank.smartbank", name: "부산은행" },
    "대구은행": { scheme: "dgb://", pkg: "com.dgb.bmap", name: "iM뱅크" },
    "경남은행": { scheme: "knbank://", pkg: "com.knbank.maru", name: "경남은행" },
    "광주은행": { scheme: "kjbank://", pkg: "com.kjbank.smart", name: "광주은행" },
    "전북은행": { scheme: "jbbank://", pkg: "com.jbbank.mbs", name: "전북은행" },
    "제주은행": { scheme: "jejubank://", pkg: "com.shinhan.jejubank", name: "제주은행" },
    "KDB산업은행": { scheme: "kdb://", pkg: "com.kdb.smart", name: "스마트KDB" },
    "산림조합": { scheme: "nfcf://", pkg: "kr.co.nfcf.smartbank", name: "산림조합" }
};

function copyChurchAccountOnly() {
    const acc = (document.getElementById("churchReceiverAcc")?.value || "302-1234-5678-91").trim();
    const bank = (document.getElementById("churchReceiverBank")?.value || "농협").trim();
    const cName = (document.getElementById("churchReceiverName")?.value || "예톡행복한교회").trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(acc);
    }
    showToast(`📋 [${bank} ${acc}] 계좌번호가 복사되었습니다!`);
}

function openTossDirectOffering() {
    const acc = (document.getElementById("churchReceiverAcc")?.value || "3021234567891").replace(/[^0-9]/g, "");
    const bank = (document.getElementById("churchReceiverBank")?.value || "농협").trim();
    const amount = (document.getElementById("churchOfferingAmount")?.value || "50000").trim();
    const enteredPin = (document.getElementById("churchOfferingPw")?.value || "").trim();
    const savedPin = localStorage.getItem("yetalk_church_offering_pin") || localStorage.getItem("yetalkOfferingPin") || "";

    if (!enteredPin || enteredPin.length !== 4) {
        showToast("🔒 안전결제 비밀번호 4자리를 입력해주세요.");
        document.getElementById("churchOfferingPw")?.focus();
        return;
    }
    if (savedPin && enteredPin !== savedPin) {
        showToast("❌ 비밀번호가 일치하지 않습니다.");
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(acc);
    }
    closeModal("churchOfferingModal");
    showToast("⚡ 토스 앱으로 안전하게 연결합니다...");

    const tossUrl = `supertoss://send?bank=${encodeURIComponent(bank)}&account=${acc}&amount=${amount}`;
    window.location.href = tossUrl;
    setTimeout(() => {
        window.location.href = "intent://#Intent;package=viva.republica.toss;end;";
    }, 800);
}

function submitChurchOffering() {
    const cName = (document.getElementById("churchReceiverName")?.value || "예톡행복한교회").trim();
    const bank = (document.getElementById("churchReceiverBank")?.value || "농협").trim();
    const acc = (document.getElementById("churchReceiverAcc")?.value || "302-1234-5678-91").trim();
    const amount = (document.getElementById("churchOfferingAmount")?.value || "50000").trim();
    const giverBank = document.getElementById("churchGiverBank")?.value || "국민은행";
    const enteredPin = (document.getElementById("churchOfferingPw")?.value || "").trim();
    const savedPin = localStorage.getItem("yetalk_church_offering_pin") || localStorage.getItem("yetalkOfferingPin") || "";

    if (!amount || parseInt(amount, 10) <= 0) {
        showToast("헌금 금액을 올바르게 입력해주세요.");
        return;
    }

    if (!enteredPin || enteredPin.length !== 4) {
        showToast("🔒 안전결제 비밀번호 4자리를 입력해주세요.");
        document.getElementById("churchOfferingPw")?.focus();
        return;
    }

    if (savedPin && enteredPin !== savedPin) {
        showToast("❌ 비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
        return;
    }

    if (!savedPin && /^\d{4}$/.test(enteredPin)) {
        localStorage.setItem("yetalk_church_offering_pin", enteredPin);
        localStorage.setItem("yetalkOfferingPin", enteredPin);
    }

    // 1. 스마트 클립보드 계좌 자동 복사 (은행앱 실행 시 자동 감지)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(acc);
    }

    closeModal("churchOfferingModal");
    showToast(`📋 [${bank} ${acc}] 계좌 복사 완료! [${giverBank}] 앱으로 연결합니다...`);

    // 2. 출금 은행 앱 인텐트 실행
    const bankInfo = CHURCH_BANK_MAP[giverBank] || CHURCH_BANK_MAP["국민은행"];
    setTimeout(() => {
        if (bankInfo) {
            window.location.href = `intent://#Intent;package=${bankInfo.pkg};end;`;
        }
    }, 600);
}

function openCurrentSlideEdit() {
    const slideIdx = currentSlideIndices[activeSecId] || 0;
    const cur = churchSlideData[activeSecId][slideIdx];
    const menu = MENU_DEFINITIONS[activeSecId] || MENU_DEFINITIONS[0];

    document.getElementById("modalCardTitleLabel").innerText = `✏️ [${menu.cat}] #${slideIdx + 1} 수정`;
    document.getElementById("inpCardTitle").value = cur.title || "";
    document.getElementById("inpCardVerse").value = cur.verse || "";
    document.getElementById("inpCardBody").value = cur.body || "";
    tempEditImgBase64 = cur.img || "";
    document.getElementById("prevFirstCardImg").src = tempEditImgBase64;

    const ytRow = document.getElementById("worshipYtEditRow");
    if (ytRow) {
        if (activeSecId === 1) {
            ytRow.style.display = "flex";
            const inpYt = document.getElementById("inpCardYt");
            if (inpYt) inpYt.value = cur.yt || "";
            const chkBroadcast = document.getElementById("chkBroadcastToYetalkTv");
            if (chkBroadcast) chkBroadcast.checked = (localStorage.getItem("yetalk_church_live_broadcast") === "true");
        } else {
            ytRow.style.display = "none";
        }
    }

    openModal("churchMainEditModal");
}

function handleFirstCardFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            let w = img.width, h = img.height;
            if (w > 1600) { h = Math.round((h * 1600) / w); w = 1600; }
            canvas.width = w; canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            tempEditImgBase64 = canvas.toDataURL("image/jpeg", 0.92);
            document.getElementById("prevFirstCardImg").src = tempEditImgBase64;
            showToast("📷 사진 준비 완료. [저장하기]를 누르세요.");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function saveCurrentCardData() {
    const slideIdx = currentSlideIndices[activeSecId] || 0;
    const target = churchSlideData[activeSecId][slideIdx];

    target.title = document.getElementById("inpCardTitle").value.trim();
    target.verse = document.getElementById("inpCardVerse").value.trim();
    target.body = document.getElementById("inpCardBody").value.trim();
    if (tempEditImgBase64) target.img = tempEditImgBase64;

    if (activeSecId === 1) {
        const inpYt = document.getElementById("inpCardYt");
        if (inpYt) target.yt = inpYt.value.trim();

        const chkBroadcast = document.getElementById("chkBroadcastToYetalkTv");
        if (chkBroadcast) {
            localStorage.setItem("yetalk_church_live_broadcast", chkBroadcast.checked ? "true" : "false");
            if (chkBroadcast.checked && target.yt) {
                localStorage.setItem("yetalk_church_live_video_url", target.yt);
                localStorage.setItem("yetalk_church_live_video_title", target.title || "교회 예배 라이브");
            }
        }

        const sharedKey = WORSHIP_SLIDE_KEYS[slideIdx];
        let shared = getSharedWorshipData();
        shared[sharedKey].title = target.title;
        shared[sharedKey].verse = target.verse;
        shared[sharedKey].body = target.body;
        if (target.yt !== undefined) shared[sharedKey].yt = target.yt;
        if (tempEditImgBase64) shared[sharedKey].img = tempEditImgBase64;
        localStorage.setItem(SHARED_WORSHIP_KEY, JSON.stringify(shared));
    } else {
        localStorage.setItem("yetalk_church_main_slides_v41", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_slides_v40", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v38", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v33", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v31", JSON.stringify(churchSlideData));
    }

    updateSlideContent(activeSecId, slideIdx);
    closeModal("churchMainEditModal");
    showToast("🎉 수정 내용이 반영되었습니다!");
}

let fastLaunchTimer = null;
function runFastCoupangModal() {
    const modal = document.getElementById('coupangGateModal');
    if (!modal) { openCoupangDirectSafe(); return; }
    modal.classList.add('show');
    if (fastLaunchTimer) clearTimeout(fastLaunchTimer);
    fastLaunchTimer = setTimeout(() => { openCoupangDirectSafe(); }, 1100);
}

function openCoupangDirectSafe() {
    if (window.AndroidBridge && window.AndroidBridge.launchCoupangDirect) {
        window.AndroidBridge.launchCoupangDirect();
    } else {
        window.open("https://www.coupang.com", "_blank");
    }
}

function openModal(id) { document.getElementById(id).classList.add("show"); }
function closeModal(id) { document.getElementById(id).classList.remove("show"); }

function showToast(msg) {
    const t = document.getElementById("yetalkToast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", () => {
    const customChurch = localStorage.getItem("yetalkUserStoreName") || localStorage.getItem("yetalkChurchName");
    if (customChurch) {
        const el = document.getElementById("churchName");
        if (el) el.innerText = customChurch;
    }
    initChurchData();
});