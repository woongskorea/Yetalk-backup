/*==================================================
YETALK CHURCHMAIN.JS
예톡 교회홈 (숏폼 스냅 & 애드몹 안전 규격 연동)
==================================================*/

const MENU_DEFINITIONS = [
    { id: 0, cat: "교회의꿈", link: "churchintro.html" },
    { id: 1, cat: "예배", link: "churchworship.html" },
    { id: 2, cat: "주보", link: "churchjubo.html" },
    { id: 3, cat: "공지알림", link: "churchnotice.html" },
    { id: 4, cat: "기도모임", link: "churchpray.html" },
    { id: 5, cat: "교회초청", link: "churchinvite.html" },
    { id: 6, cat: "오늘말씀", link: "churchjesuswalking.html" },
    { id: 7, cat: "보배성도", link: "churchmember.html" },
    { id: 8, cat: "다음세대", link: "churchnextgen.html" },
    { id: 9, cat: "선교전도", link: "churchmission.html" },
    { id: 10, cat: "보물창고", link: "churcharchive.html" }
];

const SHARED_WORSHIP_KEY = "yetalk_church_worship_v31";
const WORSHIP_SLIDE_KEYS = ["sunday", "wednesday", "friday", "dawn", "special", "praise"];

const DEFAULT_SHARED_WORSHIP = {
    sunday: { tabName: "주일예배", title: "주일 대예배 실황", verse: "“신령과 진정으로 드리는 예배”", body: "주일 오전 11시 본당 생중계 및 설교 말씀", timeBadge: "주일 11:00", meta: "요한복음 3장 16절 ~ 18절 · 담임목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=90" },
    wednesday: { tabName: "수요예배", title: "수요 성경강해", verse: "“주의 말씀은 내 발의 등이요”", body: "수요일 저녁 7시 30분 말씀 강해", timeBadge: "수요일 19:30", meta: "창세기 12장 1절 ~ 4절 · 담임목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1507842229452-772d1c9ab458?auto=format&fit=crop&w=1600&q=90" },
    friday: { tabName: "금요예배", title: "금요 성령기도회", verse: "“너는 내게 부르짖으라”", body: "금요일 밤 9시 뜨거운 찬양과 기도회", timeBadge: "금요일 21:00", meta: "사도행전 1장 8절 · 담임목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1600&q=90" },
    dawn: { tabName: "새벽기도회", title: "오늘 새벽기도회", verse: "“새벽을 깨우리로다”", body: "매일 새벽 5시 30분 하루를 여는 은혜의 말씀", timeBadge: "새벽 05:30", meta: "시편 23편 1절 ~ 6절 · 교구목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1600&q=90" },
    special: { tabName: "특별예배", title: "부흥 및 헌신예배", verse: "“내 잔이 넘치나이다”", body: "교회 창립기념 및 절기 특별 부흥성회", timeBadge: "특별 일정", meta: "에베소서 4장 11절 ~ 16절 · 초청강사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=90" },
    praise: { tabName: "찬양모음", title: "은혜로운 찬양과 경배", verse: "“호흡이 있는 자마다 여호와를 찬양할지어다”", body: "주일 찬양대 및 찬양팀 은혜 찬양 모음", timeBadge: "상시 재생", meta: "할렐루야 찬양대 및 찬양팀", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=90" }
};

const CHURCH_INTRO_STORAGE_KEY = "yetalk_church_intro_custom_sections_v4";
const DEFAULT_CHURCH_INTRO_DATA = {
    welcome: {
        tabName: "환영인사",
        badge: "환영인사",
        title: "예수님의 사랑으로 여러분을 환영합니다",
        img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=90",
        body: "하나님의 따뜻한 품으로 오신 모든 분들을 축복합니다.\n\n예톡행복한교회는 상처 입은 영혼이 참된 안식을 누리고 치유되는 거룩한 은혜의 공동체입니다. 믿음 안에서 영원한 생명의 기쁨을 함께 나누기를 소망합니다.\n\n언제든지 편안한 마음으로 방문하시어 교제와 기도의 은혜를 함께 누리세요.",
        bullets: [
            "말씀과 성령이 살아 숨 쉬는 생명력 넘치는 예배",
            "이웃을 내 몸과 같이 사랑하며 섬기는 따뜻한 나눔",
            "다음 세대를 기도의 용사로 세우는 비전 교육"
        ]
    },
    vision: {
        tabName: "교회비전",
        badge: "교회비전",
        title: "하나님 나라를 확장하는 3대 핵심 비전",
        img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90",
        body: "우리는 오직 성경, 오직 믿음, 오직 은혜의 토대 위에서 지역 사회를 섬기고 땅끝까지 복음을 전하는 사명자들의 공동체입니다.",
        bullets: [
            "예배의 회복: 온 마음과 정성을 다해 주님을 높이는 예배",
            "제자 훈련: 삶의 현장에서 그리스도의 향기를 발하는 성도",
            "선교와 구제: 열방과 이웃을 향해 아낌없이 베푸는 사랑의 실천"
        ]
    },
    servants: {
        tabName: "섬기는 이",
        badge: "섬기는 이",
        title: "교회를 섬기는 사역자 및 직분자",
        img: "",
        body: "기도와 말씀으로 교회를 든든히 세워가는 사역팀을 소개합니다.",
        seniorPastor: {
            name: "최남수 담임목사",
            role: "담임목회 및 강단 말씀",
            desc: "총신대 신대원 졸, 영혼 구원과 기도 훈련에 헌신\n\n“하나님의 은혜와 평강이 성도님들의 가정과 삶의 모든 터전 위에 넘치시기를 간절히 기도합니다. 주님의 몸 된 교회를 온 맘 다해 기쁨으로 섬기겠습니다.”",
            img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=85"
        },
        leaders: [
            {
                name: "최수훈 부목사",
                role: "1교구 / 목회행정 / 미디어",
                desc: "성도 케어와 온·오프라인 미디어 사역 전담",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
            },
            {
                name: "표경열 부목사",
                role: "2교구 / 방송국 사역",
                desc: "방송 선교 및 청년부 찬양 집회 지도",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
            },
            {
                name: "김은혜 교육전도사",
                role: "교회학교 및 유초등부",
                desc: "어린이 말씀 암송 및 성경 캠프 총괄",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
            },
            {
                name: "박사랑 심방전도사",
                role: "새가족 심방 / 권사회",
                desc: "새가족 정착 및 중보기도 지원",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
            }
        ]
    },
    ministry: {
        tabName: "부서사역",
        badge: "부서사역",
        title: "은사와 열정으로 헌신하는 각 사역팀",
        img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=90",
        body: "성도님들의 귀한 은사대로 자원하여 봉사하며 하나님 나라의 기쁨을 누리는 부서 안내입니다.",
        bullets: [
            "예배찬양팀: 주일 대예배와 금요성령집회 찬양 인도",
            "중보기도팀: 환우와 교회, 열방을 위한 릴레이 기도 사역",
            "차량 및 주차안내팀: 첫 발걸음부터 안전하고 편안한 예배 인도",
            "새가족환영팀: 등록 교우들의 안정적인 정착과 따뜻한 심방"
        ]
    },
    missionary: {
        tabName: "파송선교사",
        badge: "파송선교사",
        title: "땅끝까지 복음을 전하는 파송 선교지",
        img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=90",
        body: "교회가 기도로 후원하고 함께 동역하는 열방의 파송 선교사님 현황입니다.",
        bullets: [
            "동남아 필리핀: 박바울 선교사 (현지 신학교 및 교회 개척 사역)",
            "중앙아시아 키르기스스탄: 이모세 선교사 (의료 선교 및 기술 훈련)",
            "아프리카 케냐: 정에스더 선교사 (어린이 고아원 및 무료 급식 사역)"
        ]
    },
    history: {
        tabName: "교회역사",
        badge: "교회역사",
        title: "하나님의 인도하심으로 걸어온 은혜의 발자취",
        img: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1600&q=90",
        body: "눈물의 기도와 헌신으로 일군 하나님의 살아계신 역사입니다.",
        historyList: [
            { year: "2026년", text: "예톡 스마트 미디어 선교 플랫폼 런칭 및 글로벌 비전 선포" },
            { year: "2020년", text: "온라인 실시간 예배 시스템 구축 및 비전센터 봉헌" },
            { year: "2015년", text: "제2성전 건축 입당 감사예배 및 해외 단독 선교사 파송" },
            { year: "2008년", text: "교회 설립 10주년 기념 감사 축제 및 지역 나눔 사역 확대" },
            { year: "1998년", text: "성령의 인도하심으로 예톡행복한교회 첫 개척 예배" }
        ]
    }
};

function getChurchIntroData() {
    const raw = localStorage.getItem(CHURCH_INTRO_STORAGE_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (!parsed.servants || !parsed.servants.seniorPastor) {
                parsed.servants = DEFAULT_CHURCH_INTRO_DATA.servants;
            }
            if (!parsed.missionary || !parsed.missionary.bullets || parsed.missionary.bullets.length === 0) {
                parsed.missionary = DEFAULT_CHURCH_INTRO_DATA.missionary;
            }
            return parsed;
        } catch(e) {}
    }
    return JSON.parse(JSON.stringify(DEFAULT_CHURCH_INTRO_DATA));
}

function createDefaultSlides(catName, isWorship = false) {
    if (catName === "예배") {
        return [
            { title: "예배", verse: "“신령과 진정으로 예배하는 자들을 찾으시느니라 (요 4:23)”", body: "주일과 주중 모든 예배 실황과 은혜의 말씀을 나눕니다.", yt: "", img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=90" },
            { title: "예배", verse: "“주의 말씀은 내 발의 등이요 내 길에 빛이니이다 (시 119:105)”", body: "성령의 임재와 말씀의 능력을 경험하는 은혜의 축제입니다.", yt: "", img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90" },
            { title: "예배", verse: "“너희는 여호와를 만날 만한 때에 찾으라 가까이 계실 때에 그를 부르라 (사 55:6)”", body: "뜨거운 찬양과 기도로 살아계신 하나님을 깊이 만납니다.", yt: "", img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=90" }
        ];
    }
    if (catName === "보배성도") {
        return [
            { title: "보배성도", verse: "“우리가 서로 사랑하면 하나님이 우리 안에 거하시고 (요일 4:12)”", body: "주 안에서 하나 되어 기쁨과 감사를 나누는 은혜의 행복셀 모임입니다.", yt: "", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=90" },
            { title: "보배성도", verse: "“서로 돌아보아 사랑과 선행을 격려하며 (히 10:24)”", body: "말씀으로 세워지고 기도로 중보하며 함께 자라가는 나눔셀 모임입니다.", yt: "", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=90" },
            { title: "보배성도", verse: "“너희는 택하신 족속이요 왕 같은 제사장들이요 (벧전 2:9)”", body: "세상의 빛과 소금으로 부르심 받은 존귀한 성도들의 믿음의 교제입니다.", yt: "", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1600&q=90" }
        ];
    }
    if (catName === "말씀동행" || catName === "예수동행") {
        return [
            { title: "말씀동행", verse: "“여호와는 나의 목자시니 내게 부족함이 없으리로다 (시 23:1)”", body: "매일 목사님의 말씀과 묵상을 통해 주님의 인도하심을 깊이 누립니다.", yt: "", img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90" },
            { title: "말씀동행", verse: "“주의 말씀은 내 발에 등이요 내 길에 빛이니이다 (시 119:105)”", body: "동행일기와 나눔을 통해 날마다 주님의 인도하심을 깊이 누립니다.", yt: "", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=90" },
            { title: "말씀동행", verse: "“내가 너희를 고아와 같이 버려두지 아니하고 너희에게로 오리라 (요 14:18)”", body: "선한 목자 되신 예수님 품 안에서 온전한 평안과 안식을 얻습니다.", yt: "", img: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1600&q=90" }
        ];
    }
    // 🌟 1:은혜의 비전 등 불필요한 번호/수식어 완전 삭제, 메뉴의 제목만 크게 표시!
    return [
        { title: catName, verse: "“오직 여호와를 앙망하는 자는 새 힘을 얻으리니 (사 40:31)”", body: "하나님의 거룩한 임재와 은혜가 머무는 따뜻한 공동체입니다.", yt: "", img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=90" },
        { title: catName, verse: "“믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니 (히 11:1)”", body: "날마다 말씀으로 승리하는 은혜의 동행입니다.", yt: "", img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90" },
        { title: catName, verse: "“서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라 (요 13:34)”", body: "그리스도의 따뜻한 사랑을 온 세상에 전합니다.", yt: "", img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=90" }
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
    return checkIsAdminUser();
}

function checkIsAdminUser() {
    const job = (localStorage.getItem("yetalkUserJobType") || "").trim();
    const role = (localStorage.getItem("yetalkUserRole") || "").trim();
    const grade = (localStorage.getItem("yetalkUserGrade") || "").trim();
    const isAdmin = localStorage.getItem("yetalkIsAdmin") === "true";
    const isSubAdmin = localStorage.getItem("yetalkIsSubAdmin") === "true";
    const authCode = (localStorage.getItem("yetalkAdminAuthCode") || "").trim();
    const isAuthAdmin = localStorage.getItem("yetalkAdminAuth") === "true";

    if (isAdmin || isSubAdmin || isAuthAdmin || authCode === "ADMIN" || authCode === "PASTOR") {
        return true;
    }
    const adminJobs = ["담임목사", "목사", "부목사", "전도사", "기독교사역자", "사역자", "관리자", "부관리자", "총관리자", "원장", "직원"];
    if (adminJobs.some(k => (job && job.includes(k)) || (role && role.includes(k)) || (grade && grade.includes(k)))) {
        return true;
    }
    return false; // 일반 성도 및 방문자는 관리 권한 없음!
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
    const STORAGE_KEY_V40 = "yetalk_church_main_slides_v40";
    let saved = localStorage.getItem(STORAGE_KEY_V40) || localStorage.getItem("yetalk_church_main_other_slides_v38") || localStorage.getItem("yetalk_church_main_other_slides_v33") || localStorage.getItem("yetalk_church_main_other_slides_v31");
    if (saved) {
        try {
            saved = saved.replace(/photo-1519681393784-d120267933ba/g, 'photo-1438232992991-995b7058bbb3')
                         .replace(/photo-1544717305-2782549b5136/g, 'photo-1438232992991-995b7058bbb3');
            churchSlideData = JSON.parse(saved);
        } catch(e) {}
    }

    MENU_DEFINITIONS.forEach(m => {
        if (m.id === 1) {
            churchSlideData[1] = createDefaultSlides("예배", false);
        } else if (m.id === 7) {
            // 🌟 보배성도 (성도 교제 및 셀 모임)는 이전 성형외과 케이스 데이터 완전 박멸!
            const list7 = churchSlideData[7];
            if (!list7 || !Array.isArray(list7) || list7.length < 3 || list7.some(isDoctorDirtySlide)) {
                churchSlideData[7] = createDefaultSlides("보배성도", false);
            }
        } else if (m.id === 6) {
            const list6 = churchSlideData[6];
            if (!list6 || !Array.isArray(list6) || list6.length < 3 || list6.some(isDoctorDirtySlide)) {
                churchSlideData[6] = createDefaultSlides("예수동행", false);
            }
        } else {
            const currentList = churchSlideData[m.id];
            const hasDirtyData = Array.isArray(currentList) && currentList.some(isDoctorDirtySlide);
            if (!currentList || !Array.isArray(currentList) || currentList.length < 3 || hasDirtyData) {
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
        localStorage.setItem(STORAGE_KEY_V40, JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v38", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v33", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v31", JSON.stringify(churchSlideData));
    } catch(e) {}

    // 🌟 기본은 항상 첫 메뉴인 0번 (교회의꿈) 시작! (선교전도 등 임의 탭으로 튀는 현상 원천 차단)
    sessionStorage.removeItem("church_last_active_card_idx");
    
    // URL에 ?sec=N 파라미터가 명시된 경우에만 해당 탭으로 이동
    const urlParams = new URLSearchParams(window.location.search);
    const secParam = urlParams.get("sec") || urlParams.get("tab");
    let initialSecId = 0;
    if (secParam !== null && !isNaN(parseInt(secParam, 10))) {
        const parsed = parseInt(secParam, 10);
        if (parsed >= 0 && parsed < MENU_DEFINITIONS.length) {
            initialSecId = parsed;
        }
    }
    activeSecId = initialSecId;

    renderChurchView();

    // 4회 시간대별 10자 이내 성구 배너 설정
    const pill = document.getElementById("subbarVersePill");
    if (pill) pill.innerText = getActiveShortVerse();
}

function setupSectionObserver() {
    // 세로 단일 메뉴 플로우용 안전 더미 함수
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
    renderChurchMenuContent(activeSecId);
}

/* 🌟 [사용자 요청] 한 개의 메뉴에 첫 이미지가 있고 그 밑에 서브페이지가 순서대로 끝까지 배치되어
   위로 스크롤하면 다 보이게 변경 (가로/세로 연동 엉킴 완전 제거) + 마지막 다음 메뉴 가기 버튼 */
function renderChurchMenuContent(secId) {
    activeSecId = secId;
    sessionStorage.setItem("church_last_active_card_idx", secId.toString());
    updateChipsBar(secId);

    const vp = document.getElementById("churchViewport");
    const guard = document.getElementById("touchGuardShield");
    if (!vp) return;
    vp.innerHTML = "";
    if (guard) vp.appendChild(guard);

    const sec = MENU_DEFINITIONS[secId] || MENU_DEFINITIONS[0];
    const nextSecId = (secId + 1) % MENU_DEFINITIONS.length;
    const nextMenuName = MENU_DEFINITIONS[nextSecId].cat;
    const isAdmin = checkIsAdminUser();

    // 🌟 1. 교회의꿈 (Tab 0) 실제 내용 스냅 뷰포트 (환영인사, 비전, 섬기는이, 부서사역, 파송선교사, 교회역사)
    if (secId === 0) {
        renderChurchDreamFullSnapView(vp, isAdmin);
        return;
    }

    // 🌟 2. 오늘말씀 (Tab 6, 구 예수동행) 카톡 스타일 특별 뷰
    if (secId === 6) {
        renderWordWalkingKakaoView(vp, secId, nextSecId, nextMenuName);
        return;
    }

    // 🌟 3. 다음세대 (Tab 8) 카톡 스타일 특별 뷰 (청년부, 청소년부 등 닥톡 스타일)
    if (secId === 8) {
        renderNextGenKakaoView(vp, secId, nextSecId, nextMenuName);
        return;
    }

    // 🌟 4. [사용자 요청] 일반 메뉴들 (예배, 주보, 공지알림, 기도모임, 교회초청, 보배성도, 선교전도, 보물창고):
    // 불필요한 장식글(대표메인, 주보, 자세히보기, 아래로 스크롤 안내) 완전 삭제!
    const slides = churchSlideData[secId] || createDefaultSlides(sec.cat, secId === 1);

    // 1) 첫 번째 대표 메인 카드 (hero-card-section)
    const heroSlide = slides[0] || { title: sec.cat, verse: "", body: "", img: "" };
    const heroCard = document.createElement("section");
    heroCard.className = "hero-card-section";
    heroCard.id = `hero_${secId}_0`;
    heroCard.innerHTML = `
        <div style="position:relative; width:100%; height:100%; flex:1; display:flex; flex-direction:column; justify-content:space-between; min-height:68vh;">
            <img class="card-bg-img" id="slide_img_${secId}_0" src="${heroSlide.img}" alt="${sec.cat}">
            <div class="card-gradient-overlay"></div>

            <div class="card-top-content" style="display:flex; justify-content:space-between; align-items:center; width:100%; z-index:15; padding:12px 14px;">
                <span class="card-sub-tag" style="font-size:13px; font-weight:900; color:#38bdf8;">${sec.cat}</span>
                ${isAdmin ? `
                <button type="button" class="btn-screen-direct-edit" onclick="event.stopPropagation(); openDirectScreenEdit(${secId}, 0);" title="이 화면 바로 수정">
                    ✏️ 이 화면 바로수정
                </button>
                ` : ''}
            </div>

            <div class="card-title-center-box" style="z-index:10; width:90%; text-align:center;">
                <h2 class="card-title-main" style="text-shadow:0 2px 14px rgba(0,0,0,0.9); font-size:26px; color:#ffffff; font-weight:950;">${heroSlide.title || sec.cat}</h2>
            </div>

            <div class="card-bottom-content" style="z-index:15; padding: 0 16px 14px 16px !important;">
                <div class="card-verse-highlight" style="font-size:14.5px; font-weight:850; color:#fde047; text-shadow:0 1px 4px rgba(0,0,0,0.8); margin-bottom:4px;">${heroSlide.verse || ""}</div>
                <div class="card-body-text" style="font-size:13.5px; line-height:1.6; color:#e2e8f0; margin-bottom:8px;">${heroSlide.body || ""}</div>

                ${isAdmin ? `
                <div style="display:flex; justify-content:flex-end; gap:6px;">
                    <button type="button" class="btn-card-admin-room" onclick="event.stopPropagation(); location.href='churchadmin.html';" title="관리실 이동">
                        🏢 관리실
                    </button>
                    <button type="button" class="btn-card-admin-edit" onclick="event.stopPropagation(); openDirectScreenEdit(${secId}, 0);">
                        ✏️ 화면수정
                    </button>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    vp.appendChild(heroCard);

    // 2) 첫 메인 이미지 바로 밑으로 순서대로 이어지는 서브페이지들 (subpage-card-section)
    for (let sIdx = 1; sIdx < slides.length; sIdx++) {
        const sub = slides[sIdx];
        const subCard = document.createElement("section");
        subCard.className = "subpage-card-section";
        subCard.id = `subpage_${secId}_${sIdx}`;

        subCard.innerHTML = `
            <div class="subpage-badge-row" style="margin-bottom:6px;">
                <span style="font-size:12.5px; color:#38bdf8; font-weight:900;">${sec.cat} • ${sIdx + 1}/${slides.length}</span>
                ${isAdmin ? `
                <button type="button" class="btn-screen-direct-edit" onclick="event.stopPropagation(); openDirectScreenEdit(${secId}, ${sIdx});">
                    ✏️ 이 서브 수정
                </button>
                ` : ''}
            </div>

            <div class="subpage-img-box">
                <img class="subpage-img" id="slide_img_${secId}_${sIdx}" src="${sub.img}" alt="${sub.title || sec.cat}">
            </div>

            <h3 class="subpage-title-main">${sub.title || `${sec.cat} 안내 ${sIdx}`}</h3>

            ${sub.verse ? `<div class="subpage-verse-box">${sub.verse}</div>` : ''}

            <p class="subpage-desc-text">${sub.body || ""}</p>
        `;
        vp.appendChild(subCard);
    }

    // 3) 마지막 페이지: 은혜 글귀 + 250 애드몹 + [다음 메뉴 가기] 버튼
    const endingCard = document.createElement("section");
    endingCard.className = "church-ending-snap-card";
    endingCard.innerHTML = `
        <div class="ending-quote-box">
            <span class="ending-quote-tag">🌿 은혜의 말씀</span>
            <div class="ending-quote-text">“너희는 세상의 빛이라 산 위에 있는 동네가 숨겨지지 못할 것이요 (마 5:14)”</div>
        </div>

        <div class="ending-admob-250">
            <div style="font-size:10px; color:#64748b; font-weight:900; letter-spacing:0.8px; margin-bottom:6px;">AD • Google AdMob 공식 스폰서 (300 × 250)</div>
            <div style="font-size:15px; font-weight:900; color:#38bdf8; margin-bottom:4px;">Google AdMob Medium Rectangle</div>
            <div style="font-size:11px; color:#94a3b8; padding:0 16px; line-height:1.4;">한국 교회 및 복음 선교 미디어 공식 지원 스폰서</div>
            <div style="margin-top:12px; padding:4px 12px; background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.4); border-radius:18px; font-size:10.5px; font-weight:800; color:#38bdf8;">선교 사역 후원 배너</div>
        </div>

        <button type="button" class="btn-jump-next-section" onclick="handleChurchNavTab(${nextSecId})">
            <span>다음 메뉴 [${nextMenuName}] 가기</span>
            <span style="font-size:17px;">▶</span>
        </button>
    `;
    vp.appendChild(endingCard);
}

/* 🌟 [사용자 요청] 교회의꿈 실제 서브페이지 풀 스냅 뷰:
   1. 환영인사 2. 교회비전 3. 섬기는 이(담임목사 대형사진+인사글, 부목사이하 2열그리드+개별수정)
   4. 부서사역 5. 파송선교사(불렛 100% 정상출력) 6. 교회역사 7. 애드몹+다음메뉴 */
function renderChurchDreamFullSnapView(vp, isAdmin) {
    const introData = getChurchIntroData();

    // 1. 환영인사
    const welcome = introData.welcome || {};
    const welcomeCard = document.createElement("section");
    welcomeCard.className = "snap-page-section";
    welcomeCard.id = "dream_sec_welcome";
    welcomeCard.innerHTML = `
        <div class="section-header-row">
            <h2 class="article-main-title">${welcome.title || "예수님의 사랑으로 여러분을 환영합니다"}</h2>
            ${isAdmin ? `<button type="button" class="btn-screen-direct-edit" onclick="openChurchIntroSectionEdit('welcome')">✏️ 이 화면 수정</button>` : ''}
        </div>
        ${welcome.img ? `<div class="attached-photo-wrap"><img src="${welcome.img}" alt="${welcome.title || '환영인사'}"></div>` : ''}
        <div class="article-text-body">${formatIntroBody(welcome.body)}</div>
        <div class="church-bullets-list" style="margin-top:4px;">
            ${formatIntroBullets(welcome.bullets)}
        </div>
    `;
    vp.appendChild(welcomeCard);

    // 2. 교회비전
    const vision = introData.vision || {};
    const visionCard = document.createElement("section");
    visionCard.className = "snap-page-section";
    visionCard.id = "dream_sec_vision";
    visionCard.innerHTML = `
        <div class="section-header-row">
            <h2 class="article-main-title">${vision.title || "하나님 나라를 확장하는 3대 핵심 비전"}</h2>
            ${isAdmin ? `<button type="button" class="btn-screen-direct-edit" onclick="openChurchIntroSectionEdit('vision')">✏️ 이 화면 수정</button>` : ''}
        </div>
        ${vision.img ? `<div class="attached-photo-wrap"><img src="${vision.img}" alt="${vision.title || '교회비전'}"></div>` : ''}
        <div class="article-text-body">${formatIntroBody(vision.body)}</div>
        <div class="church-bullets-list" style="margin-top:4px;">
            ${formatIntroBullets(vision.bullets)}
        </div>
    `;
    vp.appendChild(visionCard);

    // 3. 섬기는 이 (담임목사 대형 사진 + 인사글 / 부목사 이하 2열 그리드 + 개별 수정)
    const servants = introData.servants || {};
    const pastor = servants.seniorPastor || {
        name: "최남수 담임목사",
        role: "담임목회 및 강단 말씀",
        desc: "총신대 신대원 졸, 영혼 구원과 기도 훈련에 헌신\n\n“하나님의 은혜와 평강이 성도님들의 가정과 삶의 모든 터전 위에 넘치시기를 간절히 기도합니다. 주님의 몸 된 교회를 온 맘 다해 기쁨으로 섬기겠습니다.”",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=85"
    };
    const leaders = servants.leaders || [];
    const servantsCard = document.createElement("section");
    servantsCard.className = "snap-page-section";
    servantsCard.id = "dream_sec_servants";
    servantsCard.innerHTML = `
        <div class="section-header-row">
            <h2 class="article-main-title">${servants.title || "교회를 섬기는 사역자 및 직분자"}</h2>
            ${isAdmin ? `<button type="button" class="btn-screen-direct-edit" onclick="openChurchIntroSectionEdit('servants')">✏️ 제목/소개 수정</button>` : ''}
        </div>
        ${servants.body ? `<div class="article-text-body" style="margin-bottom:6px;">${servants.body}</div>` : ''}

        <!-- 🌟 [사용자 요청] 담임목사는 사진이 한 장 크게 있고 그 밑에 목회 인사글 -->
        <div class="senior-pastor-card">
            <img class="senior-pastor-img" src="${pastor.img}" alt="${pastor.name}">
            <div class="senior-pastor-info">
                <div class="senior-pastor-title-row">
                    <div>
                        <h3 class="senior-pastor-name">${pastor.name}</h3>
                        <div class="senior-pastor-role">${pastor.role}</div>
                    </div>
                    ${isAdmin ? `<button type="button" class="btn-leader-inline-edit" onclick="openChurchPastorEdit()">✏️ 목사님 소개 수정</button>` : ''}
                </div>
                <div class="senior-pastor-desc">${formatIntroBody(pastor.desc)}</div>
            </div>
        </div>

        <!-- 🌟 [사용자 요청] 부목사 이하는 한 줄에 2명씩(2열 그리드) 사진과 글을 올릴 수 있게 하되 각각 사진과 글을 개별 수정할 수 있게 -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
            <span style="font-size:13.5px; font-weight:900; color:#38bdf8;">사역팀 및 교구 목회자</span>
            ${isAdmin ? `<button type="button" class="btn-leader-inline-edit" style="background:#0284c7; color:#fff;" onclick="addNewChurchLeader()">➕ 사역자 추가</button>` : ''}
        </div>
        <div class="clean-leader-grid">
            ${leaders.map((ldr, lIdx) => `
                <div class="clean-leader-card">
                    <img class="clean-leader-img" src="${ldr.img}" alt="${ldr.name}">
                    <div class="clean-leader-info">
                        <strong class="clean-leader-name">${ldr.name}</strong>
                        <span class="clean-leader-role">${ldr.role}</span>
                        <p class="clean-leader-desc">${ldr.desc}</p>
                        ${isAdmin ? `<button type="button" class="btn-leader-inline-edit" onclick="openChurchLeaderEdit(${lIdx})">✏️ 수정</button>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    vp.appendChild(servantsCard);

    // 4. 부서사역
    const ministry = introData.ministry || {};
    const ministryCard = document.createElement("section");
    ministryCard.className = "snap-page-section";
    ministryCard.id = "dream_sec_ministry";
    ministryCard.innerHTML = `
        <div class="section-header-row">
            <h2 class="article-main-title">${ministry.title || "은사와 열정으로 헌신하는 각 사역팀"}</h2>
            ${isAdmin ? `<button type="button" class="btn-screen-direct-edit" onclick="openChurchIntroSectionEdit('ministry')">✏️ 이 화면 수정</button>` : ''}
        </div>
        ${ministry.img ? `<div class="attached-photo-wrap"><img src="${ministry.img}" alt="${ministry.title || '부서사역'}"></div>` : ''}
        <div class="article-text-body">${formatIntroBody(ministry.body)}</div>
        <div class="church-bullets-list" style="margin-top:4px;">
            ${formatIntroBullets(ministry.bullets)}
        </div>
    `;
    vp.appendChild(ministryCard);

    // 5. 파송선교사 (불렛 선교사 글들이 100% 정상 출력!)
    const missionary = introData.missionary || {};
    const missionaryCard = document.createElement("section");
    missionaryCard.className = "snap-page-section";
    missionaryCard.id = "dream_sec_missionary";
    missionaryCard.innerHTML = `
        <div class="section-header-row">
            <h2 class="article-main-title">${missionary.title || "땅끝까지 복음을 전하는 파송 선교지"}</h2>
            ${isAdmin ? `<button type="button" class="btn-screen-direct-edit" onclick="openChurchIntroSectionEdit('missionary')">✏️ 이 화면 수정</button>` : ''}
        </div>
        ${missionary.img ? `<div class="attached-photo-wrap"><img src="${missionary.img}" alt="${missionary.title || '파송선교사'}"></div>` : ''}
        <div class="article-text-body">${formatIntroBody(missionary.body)}</div>
        <!-- 🌟 [사용자 요청] 파송선교사 불렛 목록 100% 화면에 확실하게 출력! -->
        <div class="church-bullets-list" style="margin-top:6px;">
            ${formatIntroBullets(missionary.bullets)}
        </div>
    `;
    vp.appendChild(missionaryCard);

    // 6. 교회역사
    const history = introData.history || {};
    const historyList = history.historyList || [
        { year: "2026년", text: "예톡 스마트 미디어 선교 플랫폼 런칭 및 글로벌 비전 선포" },
        { year: "2020년", text: "온라인 실시간 예배 시스템 구축 및 비전센터 봉헌" },
        { year: "2015년", text: "제2성전 건축 입당 감사예배 및 해외 단독 선교사 파송" },
        { year: "2008년", text: "교회 설립 10주년 기념 감사 축제 및 지역 나눔 사역 확대" },
        { year: "1998년", text: "성령의 인도하심으로 예톡행복한교회 첫 개척 예배" }
    ];
    const historyCard = document.createElement("section");
    historyCard.className = "snap-page-section";
    historyCard.id = "dream_sec_history";
    historyCard.innerHTML = `
        <div class="section-header-row">
            <h2 class="article-main-title">${history.title || "하나님의 인도하심으로 걸어온 은혜의 발자취"}</h2>
            ${isAdmin ? `<button type="button" class="btn-screen-direct-edit" onclick="openChurchIntroSectionEdit('history')">✏️ 이 화면 수정</button>` : ''}
        </div>
        ${history.img ? `<div class="attached-photo-wrap"><img src="${history.img}" alt="${history.title || '교회역사'}"></div>` : ''}
        ${history.body ? `<div class="article-text-body">${formatIntroBody(history.body)}</div>` : ''}
        <div class="clean-timeline-box">
            ${historyList.map(h => `
                <div class="clean-timeline-row">
                    <span class="clean-timeline-year">${h.year}</span>
                    <span class="clean-timeline-text">${h.text}</span>
                </div>
            `).join('')}
        </div>
    `;
    vp.appendChild(historyCard);

    // 7. 엔딩 카드 (은혜의 말씀 + 250 애드몹 + [다음 메뉴 (예배) 가기 ▶] 버튼)
    const endingCard = document.createElement("section");
    endingCard.className = "church-ending-snap-card";
    endingCard.innerHTML = `
        <div class="ending-quote-box">
            <span class="ending-quote-tag">🌿 은혜의 말씀</span>
            <div class="ending-quote-text">“너희는 세상의 빛이라 산 위에 있는 동네가 숨겨지지 못할 것이요 (마 5:14)”</div>
        </div>

        <div class="ending-admob-250">
            <div style="font-size:10px; color:#64748b; font-weight:900; letter-spacing:0.8px; margin-bottom:6px;">AD • Google AdMob 공식 스폰서 (300 × 250)</div>
            <div style="font-size:15px; font-weight:900; color:#38bdf8; margin-bottom:4px;">Google AdMob Medium Rectangle</div>
            <div style="font-size:11px; color:#94a3b8; padding:0 16px; line-height:1.4;">한국 교회 및 복음 선교 미디어 공식 지원 스폰서</div>
            <div style="margin-top:12px; padding:4px 12px; background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.4); border-radius:18px; font-size:10.5px; font-weight:800; color:#38bdf8;">선교 사역 후원 배너</div>
        </div>

        <button type="button" class="btn-jump-next-section" onclick="handleChurchNavTab(1)">
            <span>다음 메뉴 [예배] 가기</span>
            <span style="font-size:17px;">▶</span>
        </button>
    `;
    vp.appendChild(endingCard);
}

function formatIntroBody(text) {
    if (!text) return "";
    const lines = text.split("\n");
    let out = "";
    lines.forEach(l => {
        const tr = l.trim();
        if (tr.startsWith("•") || tr.startsWith("-") || tr.startsWith("*")) {
            out += `<div class="bullet-point-line">${tr.replace(/^[•\-\*]\s*/, '')}</div>`;
        } else if (tr.length > 0) {
            out += `<div style="margin-bottom:6px;">${tr}</div>`;
        }
    });
    return out;
}

function formatIntroBullets(bullets) {
    if (!bullets || !Array.isArray(bullets) || bullets.length === 0) return "";
    return bullets.map(b => `<div class="bullet-point-line">${b.replace(/^[•\-\*]\s*/, '')}</div>`).join('');
}

let currentIntroSecKey = "welcome";
let tempIntroSecImgBase64 = "";
let tempPastorImgBase64 = "";
let tempLeaderImgBase64 = "";
let currentLeaderIndex = -1;

function openChurchIntroSectionEdit(secKey) {
    currentIntroSecKey = secKey;
    const data = getChurchIntroData();
    const item = data[secKey] || {};

    const nameMap = {
        welcome: "환영인사",
        vision: "교회비전",
        servants: "섬기는 이",
        ministry: "부서사역",
        missionary: "파송선교사",
        history: "교회역사"
    };

    document.getElementById("lblIntroSecModalTitle").innerText = `✏️ [${nameMap[secKey] || secKey}] 내용 및 사진 수정`;
    document.getElementById("inpIntroSecKey").value = secKey;
    document.getElementById("inpIntroSecTitle").value = item.title || "";
    document.getElementById("inpIntroSecImgUrl").value = item.img || "";

    tempIntroSecImgBase64 = item.img || "";
    const prev = document.getElementById("prevIntroSecImg");
    if (prev) {
        if (tempIntroSecImgBase64) {
            prev.src = tempIntroSecImgBase64;
            prev.style.display = "block";
        } else {
            prev.style.display = "none";
        }
    }

    let combinedBody = item.body || "";
    if (item.bullets && Array.isArray(item.bullets) && item.bullets.length > 0) {
        if (combinedBody) combinedBody += "\n\n";
        combinedBody += item.bullets.map(b => `• ${b.replace(/^[•\-\*]\s*/, '')}`).join("\n");
    }
    document.getElementById("inpIntroSecBody").value = combinedBody;

    openModal("churchIntroSectionEditModal");
}

function handleIntroSecFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        tempIntroSecImgBase64 = e.target.result;
        const prev = document.getElementById("prevIntroSecImg");
        if (prev) {
            prev.src = tempIntroSecImgBase64;
            prev.style.display = "block";
        }
    };
    reader.readAsDataURL(file);
}

function saveChurchIntroSectionData() {
    const secKey = document.getElementById("inpIntroSecKey").value || currentIntroSecKey;
    const data = getChurchIntroData();
    if (!data[secKey]) data[secKey] = {};

    data[secKey].title = document.getElementById("inpIntroSecTitle").value.trim();
    const urlInput = document.getElementById("inpIntroSecImgUrl").value.trim();
    data[secKey].img = urlInput || tempIntroSecImgBase64;

    const rawBody = document.getElementById("inpIntroSecBody").value;
    const lines = rawBody.split("\n");
    const bodyLines = [];
    const bulletLines = [];

    lines.forEach(l => {
        const tr = l.trim();
        if (tr.startsWith("•") || tr.startsWith("-") || tr.startsWith("*")) {
            bulletLines.push(tr.replace(/^[•\-\*]\s*/, ''));
        } else {
            bodyLines.push(l);
        }
    });

    data[secKey].body = bodyLines.join("\n").trim();
    data[secKey].bullets = bulletLines;

    localStorage.setItem("yetalk_church_intro_custom_sections_v4", JSON.stringify(data));
    closeModal("churchIntroSectionEditModal");
    showToast("✅ 수정 내용이 저장되었습니다!");
    renderChurchMenuContent(0);
}

function openChurchPastorEdit() {
    const data = getChurchIntroData();
    const servants = data.servants || {};
    const pastor = servants.seniorPastor || {
        name: "최남수 담임목사",
        role: "담임목회 및 강단 말씀",
        desc: "총신대 신대원 졸, 영혼 구원과 기도 훈련에 헌신\n\n“하나님의 은혜와 평강이 성도님들의 가정과 삶의 모든 터전 위에 넘치시기를 간절히 기도합니다. 주님의 몸 된 교회를 온 맘 다해 기쁨으로 섬기겠습니다.”",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=85"
    };

    document.getElementById("inpPastorName").value = pastor.name || "";
    document.getElementById("inpPastorRole").value = pastor.role || "";
    document.getElementById("inpPastorDesc").value = pastor.desc || "";
    document.getElementById("inpPastorImgUrl").value = pastor.img || "";

    tempPastorImgBase64 = pastor.img || "";
    const prev = document.getElementById("prevPastorImg");
    if (prev) {
        prev.src = tempPastorImgBase64;
        prev.style.display = "block";
    }

    openModal("churchPastorEditModal");
}

function handlePastorFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        tempPastorImgBase64 = e.target.result;
        const prev = document.getElementById("prevPastorImg");
        if (prev) {
            prev.src = tempPastorImgBase64;
            prev.style.display = "block";
        }
    };
    reader.readAsDataURL(file);
}

function saveChurchPastorData() {
    const data = getChurchIntroData();
    if (!data.servants) data.servants = {};
    if (!data.servants.seniorPastor) data.servants.seniorPastor = {};

    const urlInput = document.getElementById("inpPastorImgUrl").value.trim();
    data.servants.seniorPastor.name = document.getElementById("inpPastorName").value.trim() || "담임목사";
    data.servants.seniorPastor.role = document.getElementById("inpPastorRole").value.trim() || "담임목회";
    data.servants.seniorPastor.desc = document.getElementById("inpPastorDesc").value.trim();
    data.servants.seniorPastor.img = urlInput || tempPastorImgBase64;

    localStorage.setItem("yetalk_church_intro_custom_sections_v4", JSON.stringify(data));
    closeModal("churchPastorEditModal");
    showToast("✅ 담임목사님 소개가 저장되었습니다!");
    renderChurchMenuContent(0);
}

function openChurchLeaderEdit(leaderIdx) {
    currentLeaderIndex = leaderIdx;
    const data = getChurchIntroData();
    const servants = data.servants || {};
    const leaders = servants.leaders || [];
    const leader = leaders[leaderIdx] || { name: "", role: "", desc: "", img: "" };

    document.getElementById("inpLeaderIndex").value = leaderIdx;
    document.getElementById("lblLeaderModalTitle").innerText = leaderIdx >= 0 ? `✏️ [${leader.name || '사역자'}] 정보 수정` : `➕ 새 사역자 등록`;
    document.getElementById("inpLeaderName").value = leader.name || "";
    document.getElementById("inpLeaderRole").value = leader.role || "";
    document.getElementById("inpLeaderDesc").value = leader.desc || "";
    document.getElementById("inpLeaderImgUrl").value = leader.img || "";

    tempLeaderImgBase64 = leader.img || "";
    const prev = document.getElementById("prevLeaderImg");
    if (prev) {
        if (tempLeaderImgBase64) {
            prev.src = tempLeaderImgBase64;
            prev.style.display = "block";
        } else {
            prev.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80";
        }
    }

    const delBtn = document.getElementById("btnDeleteLeader");
    if (delBtn) delBtn.style.display = leaderIdx >= 0 ? "block" : "none";

    openModal("churchLeaderEditModal");
}

function addNewChurchLeader() {
    openChurchLeaderEdit(-1);
}

function handleLeaderFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        tempLeaderImgBase64 = e.target.result;
        const prev = document.getElementById("prevLeaderImg");
        if (prev) {
            prev.src = tempLeaderImgBase64;
            prev.style.display = "block";
        }
    };
    reader.readAsDataURL(file);
}

function saveChurchLeaderData() {
    const data = getChurchIntroData();
    if (!data.servants) data.servants = {};
    if (!data.servants.leaders) data.servants.leaders = [];

    const name = document.getElementById("inpLeaderName").value.trim();
    if (!name) { alert("사역자 성함을 입력해 주세요."); return; }
    const role = document.getElementById("inpLeaderRole").value.trim() || "교회 사역자";
    const desc = document.getElementById("inpLeaderDesc").value.trim();
    const urlInput = document.getElementById("inpLeaderImgUrl").value.trim();
    const img = urlInput || tempLeaderImgBase64 || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80";

    const leaderObj = { name, role, desc, img };
    if (currentLeaderIndex >= 0 && currentLeaderIndex < data.servants.leaders.length) {
        data.servants.leaders[currentLeaderIndex] = leaderObj;
    } else {
        data.servants.leaders.push(leaderObj);
    }

    localStorage.setItem("yetalk_church_intro_custom_sections_v4", JSON.stringify(data));
    closeModal("churchLeaderEditModal");
    showToast("✅ 사역자 정보가 저장되었습니다!");
    renderChurchMenuContent(0);
}

function deleteChurchLeader() {
    if (currentLeaderIndex < 0) return;
    if (!confirm("이 사역자 정보를 삭제하시겠습니까?")) return;

    const data = getChurchIntroData();
    if (data.servants && data.servants.leaders) {
        data.servants.leaders.splice(currentLeaderIndex, 1);
        localStorage.setItem("yetalk_church_intro_custom_sections_v4", JSON.stringify(data));
    }
    closeModal("churchLeaderEditModal");
    showToast("🗑 사역자 정보가 삭제되었습니다.");
    renderChurchMenuContent(0);
}

/* 🌟 [사용자 요청] 오늘말씀 (구 예수동행) 카톡 스타일 뷰:
   공간 낭비 수식어 삭제, 오늘말씀 단독 표기, 댓글은 숨기고 숫자로만 표기 후 클릭 시 펼치기 토글 */
function renderWordWalkingKakaoView(vp, secId, nextSecId, nextMenuName) {
    let views = parseInt(localStorage.getItem("yetalk_church_daily_views") || "128", 10);
    if (isNaN(views) || views < 100) views = 128;
    views += 1;
    localStorage.setItem("yetalk_church_daily_views", views.toString());

    let hearts = parseInt(localStorage.getItem("yetalk_church_daily_heart") || "7", 10);
    if (isNaN(hearts) || hearts < 7) hearts = 7;

    let storedWord = localStorage.getItem("yetalk_church_daily_word");
    let dailyWord = null;
    if (storedWord) {
        try { dailyWord = JSON.parse(storedWord); } catch(e){}
    }
    if (!dailyWord) {
        dailyWord = {
            verseRef: "시편 23편 1~3절",
            verseText: "여호와는 나의 목자시니 내게 부족함이 없으리로다. 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다. 내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다.",
            meditation: "사랑하는 성도 여러분, 세상의 거친 파도 속에서도 선한 목자 되신 주님께서 우리의 손을 굳게 잡고 계십니다. 오늘 하루도 염려를 주님 발앞에 내려놓고 푸른 풀밭과 쉴 만한 물가의 평안을 누리시기를 축복합니다."
        };
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    const isAdmin = checkIsAdminUser();

    const kakaoSection = document.createElement("section");
    kakaoSection.className = "church-kakao-viewport-card";
    kakaoSection.innerHTML = `
        <div class="church-kakao-shell">
            <!-- 🌟 [사용자 요청] 윗 공간 낭비 글귀 삭제, 간결한 카톡 헤더 -->
            <div class="kakao-chat-date-banner">
                📅 ${dateStr} 오늘말씀과 묵상
            </div>

            <!-- 목사님의 카톡 말씀 말풍선 -->
            <div class="kakao-msg-row">
                <div class="kakao-avatar">✝️</div>
                <div class="kakao-msg-content" style="width:100%;">
                    <span class="kakao-sender-name">담임목사님 (오늘말씀)</span>
                    <div class="kakao-bubble-left">
                        <div class="kakao-verse-card">
                            <span class="kakao-verse-badge">📖 오늘의 성경 말씀</span>
                            <div style="font-size:12px; font-weight:800; color:#b45309; margin-bottom:3px;">${dailyWord.verseRef}</div>
                            <div class="kakao-verse-text" id="dispKakaoVerseText">“${dailyWord.verseText}”</div>
                        </div>

                        <div class="kakao-meditation-box">
                            <div style="font-weight:900; color:#0f172a; margin-bottom:4px; font-size:13px;">🕊️ 목사님의 묵상과 기도</div>
                            <div id="dispKakaoMeditationText">${dailyWord.meditation}</div>
                        </div>

                        <!-- 복사 / (관리자) 수정 / 하트 / 조회수 -->
                        <div class="kakao-action-btn-row">
                            <div style="display:flex; gap:5px; align-items:center;">
                                <button type="button" class="btn-kakao-action" onclick="copyPastorWordToClipboard()" title="말씀과 묵상 클립보드 복사">
                                    📋 말씀 복사
                                </button>
                                ${isAdmin ? `
                                <button type="button" class="btn-kakao-action" onclick="openEditDailyWordModal()" title="목사님 말씀 및 묵상 수정">
                                    ✏️ 말씀 수정
                                </button>
                                ` : ''}
                            </div>
                            <div style="display:flex; gap:5px; align-items:center;">
                                <button type="button" class="btn-kakao-action btn-heart" onclick="clickPastorWordHeart()" title="은혜 하트">
                                    ❤️ <span id="pastorWordHeartCount">${hearts}</span>
                                </button>
                                <span class="btn-kakao-action btn-view" title="방문 조회수 (자동 카운터)">
                                    👁️ <span id="pastorWordViewCount">${views}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 🌟 [사용자 요청] 댓글은 그냥 다 감추고 숫자로만 표기하고 누르면 댓글 펼쳐 보이게 토글 -->
            <button type="button" class="btn-comment-toggle" id="btnTogglePastorAmens" onclick="togglePastorAmensAccordion()">
                <span>💬 성도 은혜 나눔 (<strong id="dispPastorAmenCount">0</strong>개)</span>
                <span id="arrowPastorAmenToggle" style="font-size:11.5px; color:#0284c7;">▼ 터치하여 펼치기</span>
            </button>

            <!-- 펼쳐지는 댓글 아코디언 패널 -->
            <div class="comment-accordion-panel" id="pastorWordAmenList"></div>

            <!-- 카톡 스타일 메시지/아멘 입력 바 -->
            <div class="kakao-chat-input-row">
                <input type="text" id="inpKakaoAmenMsg" class="kakao-input-text" placeholder="따뜻한 아멘이나 은혜 소감을 나눠보세요..." onkeypress="if(event.keyCode===13) sendPastorWordAmen()">
                <button type="button" class="btn-kakao-send" onclick="sendPastorWordAmen()">전송</button>
            </div>
        </div>
    `;
    vp.appendChild(kakaoSection);

    renderPastorWordAmens();

    // 마지막 다음 메뉴 가기 버튼
    const endingCard = document.createElement("section");
    endingCard.className = "church-ending-snap-card";
    endingCard.innerHTML = `
        <div class="ending-quote-box">
            <span class="ending-quote-tag">📖 오늘말씀</span>
            <div class="ending-quote-text">“주의 말씀은 내 발에 등이요 내 길에 빛이니이다 (시 119:105)”</div>
        </div>
        <div class="ending-admob-250">
            <div style="font-size:10px; color:#64748b; font-weight:900; letter-spacing:0.8px; margin-bottom:6px;">AD • Google AdMob 공식 스폰서 (300 × 250)</div>
            <div style="font-size:15px; font-weight:900; color:#38bdf8; margin-bottom:4px;">Google AdMob Medium Rectangle</div>
            <div style="font-size:11px; color:#94a3b8; padding:0 16px; line-height:1.4;">말씀 선교 및 복음 사역 공식 지원 스폰서</div>
        </div>
        <button type="button" class="btn-jump-next-section" onclick="handleChurchNavTab(${nextSecId})">
            <span>다음 메뉴 [${nextMenuName}] 가기</span>
            <span style="font-size:17px;">▶</span>
        </button>
    `;
    vp.appendChild(endingCard);
}

/* 🌟 [사용자 요청] 다음세대 (Tab 8) 카톡 형식 (의원방 닥톡 스타일):
   상단 공간 절약, 청년부, 청소년부 등 부서 탭, 댓글은 숫자로만 표기하고 클릭 시 펼치기 토글 */
let currentNextGenDept = "youth"; // 기본 청년부

const DEFAULT_NEXTGEN_DEPT_DATA = {
    youth: {
        title: "청년부 은혜톡",
        avatar: "🌱",
        sender: "청년부 담당목사 & 리더팀",
        verse: "너는 청년의 때에 너의 창조주를 기억하라 (전도서 12:1)",
        content: "샬롬! 사랑하는 청년 여러분, 이번 주 토요일 17:00 비전홀에서 10월 연합 찬양예배가 있습니다. 캠퍼스와 일터에서 승리하는 청년이 됩시다! ✨"
    },
    teen: {
        title: "청소년부(중고등) 은혜톡",
        avatar: "🎒",
        sender: "중고등부 담당전도사 & 교사회",
        verse: "네가 어려서부터 성경을 알았나니 성경은 능히 너로 하여금 그리스도 예수 안에 있는 믿음으로 말미암아 구원에 이르는 지혜가 있게 하느니라 (딤후 3:15)",
        content: "친구들아 안녕! 이번 주일 예배 후 소그룹 모임에서 기말고사 응원 기도회가 열립니다. 주님의 지혜로 승리하자! 파이팅! 🚀"
    },
    child: {
        title: "어린이부(초등) 은혜톡",
        avatar: "🎈",
        sender: "초등부 부장선생님 & 교사팀",
        verse: "예수는 지혜와 키가 자라가며 하나님과 사람에게 더욱 사랑스러워 가시더라 (누가복음 2:52)",
        content: "반가워요 예톡 꿈나무들! 이번 주일에는 성경 암송 페스티벌과 신나는 달란트 잔치가 준비되어 있어요. 모두 주일 아침 11시에 만나요! 🎁"
    },
    infant: {
        title: "영유아부 은혜톡",
        avatar: "🍼",
        sender: "영유아부 사역팀 & 아기학교",
        verse: "어린 아이들을 용납하고 내게 오는 것을 금하지 말라 천국이 이런 사람의 것이니라 (마태복음 19:14)",
        content: "하나님의 가장 귀한 선물, 우리 아기들을 축복합니다. 매주 수요일 오전 10시 30분 영아실에서 부모 중보기도회가 진행됩니다. 축복합니다! 👶"
    }
};

function switchNextGenDept(deptKey) {
    currentNextGenDept = deptKey;
    renderChurchMenuContent(8);
}

function renderNextGenKakaoView(vp, secId, nextSecId, nextMenuName) {
    let views = parseInt(localStorage.getItem(`yetalk_church_nextgen_${currentNextGenDept}_views`) || "145", 10);
    if (isNaN(views) || views < 100) views = 145;
    views += 1;
    localStorage.setItem(`yetalk_church_nextgen_${currentNextGenDept}_views`, views.toString());

    let hearts = parseInt(localStorage.getItem(`yetalk_church_nextgen_${currentNextGenDept}_heart`) || "15", 10);
    if (isNaN(hearts) || hearts < 7) hearts = 15;

    let allDeptData = null;
    try {
        allDeptData = JSON.parse(localStorage.getItem("yetalk_church_nextgen_dept_data") || "null");
    } catch(e){}
    if (!allDeptData) {
        allDeptData = JSON.parse(JSON.stringify(DEFAULT_NEXTGEN_DEPT_DATA));
    }
    const deptInfo = allDeptData[currentNextGenDept] || allDeptData.youth;

    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    const isAdmin = checkIsAdminUser();

    const kakaoSection = document.createElement("section");
    kakaoSection.className = "church-kakao-viewport-card";
    kakaoSection.innerHTML = `
        <!-- 🌟 [사용자 요청] 다음세대 상단 공간 절약 부서 탭 바 (청년부, 청소년부 등) -->
        <div class="nextgen-dept-tabs" id="nextGenDeptTabs">
            <button type="button" class="nextgen-dept-chip ${currentNextGenDept==='youth'?'active':''}" onclick="switchNextGenDept('youth')">🌱 청년부</button>
            <button type="button" class="nextgen-dept-chip ${currentNextGenDept==='teen'?'active':''}" onclick="switchNextGenDept('teen')">🎒 청소년부</button>
            <button type="button" class="nextgen-dept-chip ${currentNextGenDept==='child'?'active':''}" onclick="switchNextGenDept('child')">🎈 어린이부</button>
            <button type="button" class="nextgen-dept-chip ${currentNextGenDept==='infant'?'active':''}" onclick="switchNextGenDept('infant')">🍼 영유아부</button>
        </div>

        <div class="church-kakao-shell" style="margin-top:6px;">
            <div class="kakao-chat-date-banner">
                📅 ${dateStr} ${deptInfo.title}
            </div>

            <!-- 의원방 닥톡 스타일 카톡 메시지 -->
            <div class="kakao-msg-row">
                <div class="kakao-avatar">${deptInfo.avatar}</div>
                <div class="kakao-msg-content" style="width:100%;">
                    <span class="kakao-sender-name">${deptInfo.sender}</span>
                    <div class="kakao-bubble-left">
                        <div class="kakao-verse-card" style="border-left-color:#10b981;">
                            <span class="kakao-verse-badge" style="background:#059669;">🌱 주간 성구</span>
                            <div class="kakao-verse-text" id="dispNextGenVerseText">“${deptInfo.verse}”</div>
                        </div>

                        <div class="kakao-meditation-box" id="dispNextGenContentText">
                            ${deptInfo.content}
                        </div>

                        <div class="kakao-action-btn-row">
                            <div style="display:flex; gap:5px; align-items:center;">
                                <button type="button" class="btn-kakao-action" onclick="copyNextGenNoticeToClipboard()">
                                    📋 소식 복사
                                </button>
                                ${isAdmin ? `
                                <button type="button" class="btn-kakao-action" onclick="openEditNextGenNoticeModal()">
                                    ✏️ 소식 수정
                                </button>
                                ` : ''}
                            </div>
                            <div style="display:flex; gap:5px; align-items:center;">
                                <button type="button" class="btn-kakao-action btn-heart" onclick="clickNextGenHeart()">
                                    ❤️ <span id="nextGenHeartCount">${hearts}</span>
                                </button>
                                <span class="btn-kakao-action btn-view" title="방문 조회수 (자동 카운터)">
                                    👁️ <span id="nextGenViewCount">${views}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 🌟 [사용자 요청] 댓글은 그냥 다 감추고 숫자로만 표기하고 누르면 댓글 펼쳐 보이게 토글 -->
            <button type="button" class="btn-comment-toggle" id="btnToggleNextGenComments" onclick="toggleNextGenCommentsAccordion()">
                <span>💬 부서 축복 응원글 (<strong id="dispNextGenCommentCount">0</strong>개)</span>
                <span id="arrowNextGenCommentToggle" style="font-size:11.5px; color:#059669;">▼ 터치하여 펼치기</span>
            </button>

            <!-- 펼쳐지는 댓글 아코디언 패널 -->
            <div class="comment-accordion-panel" id="nextGenCommentList"></div>

            <div class="kakao-chat-input-row">
                <input type="text" id="inpNextGenMsg" class="kakao-input-text" placeholder="${deptInfo.title}에 축복과 응원을 남겨주세요..." onkeypress="if(event.keyCode===13) sendNextGenComment()">
                <button type="button" class="btn-kakao-send" onclick="sendNextGenComment()">전송</button>
            </div>
        </div>
    `;
    vp.appendChild(kakaoSection);

    renderNextGenComments();

    const endingCard = document.createElement("section");
    endingCard.className = "church-ending-snap-card";
    endingCard.innerHTML = `
        <div class="ending-quote-box">
            <span class="ending-quote-tag">🌱 다음세대 축복</span>
            <div class="ending-quote-text">“마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라 (잠 22:6)”</div>
        </div>
        <div class="ending-admob-250">
            <div style="font-size:10px; color:#64748b; font-weight:900; letter-spacing:0.8px; margin-bottom:6px;">AD • Google AdMob 공식 스폰서 (300 × 250)</div>
            <div style="font-size:15px; font-weight:900; color:#38bdf8; margin-bottom:4px;">Google AdMob Medium Rectangle</div>
            <div style="font-size:11px; color:#94a3b8; padding:0 16px; line-height:1.4;">다음세대 비전 교육 및 기독 장학 사역 공식 지원 스폰서</div>
        </div>
        <button type="button" class="btn-jump-next-section" onclick="handleChurchNavTab(${nextSecId})">
            <span>다음 메뉴 [${nextMenuName}] 가기</span>
            <span style="font-size:17px;">▶</span>
        </button>
    `;
    vp.appendChild(endingCard);
}

/* 🌟 [사용자 요청] 댓글 아코디언 접기/펼치기 토글 핸들러 */
let isPastorAmensExpanded = false;
function togglePastorAmensAccordion() {
    isPastorAmensExpanded = !isPastorAmensExpanded;
    const panel = document.getElementById("pastorWordAmenList");
    const arrow = document.getElementById("arrowPastorAmenToggle");
    if (panel) {
        if (isPastorAmensExpanded) {
            panel.classList.add("open");
            if (arrow) arrow.innerText = "▲ 접기";
        } else {
            panel.classList.remove("open");
            if (arrow) arrow.innerText = "▼ 터치하여 펼치기";
        }
    }
}

let isNextGenCommentsExpanded = false;
function toggleNextGenCommentsAccordion() {
    isNextGenCommentsExpanded = !isNextGenCommentsExpanded;
    const panel = document.getElementById("nextGenCommentList");
    const arrow = document.getElementById("arrowNextGenCommentToggle");
    if (panel) {
        if (isNextGenCommentsExpanded) {
            panel.classList.add("open");
            if (arrow) arrow.innerText = "▲ 접기";
        } else {
            panel.classList.remove("open");
            if (arrow) arrow.innerText = "▼ 터치하여 펼치기";
        }
    }
}

/* 🌟 스크린 화면에서 즉시 글/사진 수정 모달 열기 */
function openDirectScreenEdit(secId, slideIdx = 0) {
    activeSecId = secId;
    currentSlideIndices[secId] = slideIdx;
    openCurrentSlideEdit();
}

/* 🌟 말씀동행 말씀 복사 & 수정 & 하트 & 아멘 핸들러 */
function copyPastorWordToClipboard() {
    let storedWord = localStorage.getItem("yetalk_church_daily_word");
    let dailyWord = null;
    if (storedWord) {
        try { dailyWord = JSON.parse(storedWord); } catch(e){}
    }
    if (!dailyWord) {
        dailyWord = {
            verseRef: "시편 23편 1~3절",
            verseText: "여호와는 나의 목자시니 내게 부족함이 없으리로다. 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다. 내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다.",
            meditation: "사랑하는 성도 여러분, 세상의 거친 파도 속에서도 선한 목자 되신 주님께서 우리의 손을 굳게 잡고 계십니다. 오늘 하루도 염려를 주님 발앞에 내려놓고 푸른 풀밭과 쉴 만한 물가의 평안을 누리시기를 축복합니다."
        };
    }

    const fullText = `[예톡행복한교회 오늘의 말씀과 묵상]\n📖 ${dailyWord.verseRef}\n“${dailyWord.verseText}”\n\n🕊️ 목사님의 묵상:\n${dailyWord.meditation}\n\n▶ 예톡 바로가기: https://yetalk.cc`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText);
    }
    showToast("📋 말씀과 묵상이 복사되었습니다! 소중한 분들에게 은혜를 전해보세요.");
}

function openEditDailyWordModal() {
    let storedWord = localStorage.getItem("yetalk_church_daily_word");
    let dailyWord = null;
    if (storedWord) {
        try { dailyWord = JSON.parse(storedWord); } catch(e){}
    }
    if (!dailyWord) {
        dailyWord = {
            verseRef: "시편 23편 1~3절",
            verseText: "여호와는 나의 목자시니 내게 부족함이 없으리로다. 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다. 내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다.",
            meditation: "사랑하는 성도 여러분, 세상의 거친 파도 속에서도 선한 목자 되신 주님께서 우리의 손을 굳게 잡고 계십니다. 오늘 하루도 염려를 주님 발앞에 내려놓고 푸른 풀밭과 쉴 만한 물가의 평안을 누리시기를 축복합니다."
        };
    }

    document.getElementById("inpEditWordRef").value = dailyWord.verseRef || "";
    document.getElementById("inpEditWordText").value = dailyWord.verseText || "";
    document.getElementById("inpEditWordMeditation").value = dailyWord.meditation || "";
    openModal("editDailyWordModal");
}

function saveDailyWordData() {
    const ref = document.getElementById("inpEditWordRef").value.trim() || "시편 23편 1~3절";
    const text = document.getElementById("inpEditWordText").value.trim();
    const med = document.getElementById("inpEditWordMeditation").value.trim();

    if (!text) { alert("말씀 본문을 입력해 주세요."); return; }

    const obj = { verseRef: ref, verseText: text, meditation: med };
    localStorage.setItem("yetalk_church_daily_word", JSON.stringify(obj));

    // 🌟 [사용자 요청] 목사님이 오전 중에 말씀을 고치면, 오후 2시 개인앱의 공지알림에 교회공지 밑에 매일 자동으로 가도록 설정 (애드몹 포함)
    const now = new Date();
    const todayStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
    localStorage.setItem("yetalk_church_word_updated_date", todayStr);

    const wordNotice = {
        id: "church_daily_word_" + todayStr,
        sender: "예톡행복한교회",
        senderType: "church",
        isChurchNotice: true,
        isDailyWordNotice: true,
        title: "🕊️ [교회공지 • 오늘말씀] " + ref,
        content: `“${text}”\n\n🕊️ 목사님의 묵상:\n${med}`,
        date: `${todayStr} 14:00`,
        isToday: true
    };
    localStorage.setItem("yetalk_church_daily_word_notice", JSON.stringify(wordNotice));
    localStorage.setItem("yetalk_latest_notice", JSON.stringify(wordNotice));

    closeModal("editDailyWordModal");
    showToast("🎉 목사님의 오늘의 말씀이 저장되었습니다! (오후 2시 개인앱 공지알림에 자동 반영)");
    renderChurchMenuContent(6);
}

function clickPastorWordHeart() {
    let hearts = parseInt(localStorage.getItem("yetalk_church_daily_heart") || "7", 10);
    hearts += 1;
    localStorage.setItem("yetalk_church_daily_heart", hearts.toString());
    const countEl = document.getElementById("pastorWordHeartCount");
    if (countEl) countEl.innerText = hearts;
    showToast(`❤️ 은혜 하트를 보냈습니다! (${hearts}개)`);
}

function sendPastorWordAmen() {
    const inp = document.getElementById("inpKakaoAmenMsg");
    if (!inp) return;
    const msg = inp.value.trim();
    if (!msg) return;

    let amens = [];
    try { amens = JSON.parse(localStorage.getItem("yetalk_church_daily_amens") || "[]"); } catch(e){}

    const myName = localStorage.getItem("yetalkUserName") || "은혜성도";
    amens.push({ name: myName, text: msg, time: "방금" });
    localStorage.setItem("yetalk_church_daily_amens", JSON.stringify(amens));

    inp.value = "";
    renderPastorWordAmens();
    showToast("🙏 은혜의 아멘과 소감이 등록되었습니다.");
}

function renderPastorWordAmens() {
    const container = document.getElementById("pastorWordAmenList");
    const countEl = document.getElementById("dispPastorAmenCount");

    let amens = [];
    try { amens = JSON.parse(localStorage.getItem("yetalk_church_daily_amens") || "[]"); } catch(e){}

    if (amens.length === 0) {
        amens = [
            { name: "김권사", text: "아멘! 오늘도 선한 목자 되신 주님만 바라보며 큰 위로를 얻습니다.", time: "오전 07:15" },
            { name: "이집사", text: "목사님 말씀에 큰 힘을 얻고 하루를 시작합니다. 감사합니다!", time: "오전 08:30" }
        ];
    }

    if (countEl) countEl.innerText = amens.length;
    if (!container) return;

    container.innerHTML = amens.map(a => `
        <div style="display:flex; justify-content:flex-end; align-items:flex-end; gap:6px; margin:4px 0;">
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:1px;">
                <span style="font-size:10.5px; color:#475569; font-weight:700;">${a.name} · ${a.time}</span>
                <div style="background:#fee500; color:#191919; border-radius:14px 2px 14px 14px; padding:8px 12px; font-size:13px; font-weight:800; max-width:85%; box-shadow:0 1px 4px rgba(0,0,0,0.12); word-break:keep-all; line-height:1.45;">
                    ${a.text}
                </div>
            </div>
        </div>
    `).join("");
}

/* 🌟 다음세대 소식 복사 & 수정 & 하트 & 댓글 핸들러 */
function copyNextGenNoticeToClipboard() {
    let allDeptData = null;
    try { allDeptData = JSON.parse(localStorage.getItem("yetalk_church_nextgen_dept_data") || "null"); } catch(e){}
    if (!allDeptData) allDeptData = DEFAULT_NEXTGEN_DEPT_DATA;
    const deptInfo = allDeptData[currentNextGenDept] || allDeptData.youth;

    const txt = `[예톡행복한교회 ${deptInfo.title}]\n🌱 ${deptInfo.verse}\n\n${deptInfo.content}\n\n▶ 예톡 바로가기: https://yetalk.cc`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt);
    }
    showToast(`📋 [${deptInfo.title}] 소식이 복사되었습니다!`);
}

function openEditNextGenNoticeModal() {
    let allDeptData = null;
    try { allDeptData = JSON.parse(localStorage.getItem("yetalk_church_nextgen_dept_data") || "null"); } catch(e){}
    if (!allDeptData) allDeptData = DEFAULT_NEXTGEN_DEPT_DATA;
    const deptInfo = allDeptData[currentNextGenDept] || allDeptData.youth;

    document.getElementById("inpEditNextGenVerse").value = deptInfo.verse || "";
    document.getElementById("inpEditNextGenContent").value = deptInfo.content || "";
    openModal("editNextGenNoticeModal");
}

function saveNextGenNoticeData() {
    const verse = document.getElementById("inpEditNextGenVerse").value.trim();
    const content = document.getElementById("inpEditNextGenContent").value.trim();
    if (!content) { alert("공지 내용을 입력해 주세요."); return; }

    let allDeptData = null;
    try { allDeptData = JSON.parse(localStorage.getItem("yetalk_church_nextgen_dept_data") || "null"); } catch(e){}
    if (!allDeptData) allDeptData = JSON.parse(JSON.stringify(DEFAULT_NEXTGEN_DEPT_DATA));

    if (!allDeptData[currentNextGenDept]) {
        allDeptData[currentNextGenDept] = JSON.parse(JSON.stringify(DEFAULT_NEXTGEN_DEPT_DATA[currentNextGenDept] || DEFAULT_NEXTGEN_DEPT_DATA.youth));
    }
    allDeptData[currentNextGenDept].verse = verse;
    allDeptData[currentNextGenDept].content = content;

    localStorage.setItem("yetalk_church_nextgen_dept_data", JSON.stringify(allDeptData));
    closeModal("editNextGenNoticeModal");
    showToast(`🎉 [${allDeptData[currentNextGenDept].title}] 소식이 저장되었습니다!`);
    renderChurchMenuContent(8);
}

function clickNextGenHeart() {
    let hearts = parseInt(localStorage.getItem(`yetalk_church_nextgen_${currentNextGenDept}_heart`) || "15", 10);
    hearts += 1;
    localStorage.setItem(`yetalk_church_nextgen_${currentNextGenDept}_heart`, hearts.toString());
    const countEl = document.getElementById("nextGenHeartCount");
    if (countEl) countEl.innerText = hearts;
    showToast(`❤️ 부서를 향한 응원 하트를 보냈습니다! (${hearts}개)`);
}

function sendNextGenComment() {
    const inp = document.getElementById("inpNextGenMsg");
    if (!inp) return;
    const msg = inp.value.trim();
    if (!msg) return;

    let comments = [];
    const storageKey = `yetalk_church_nextgen_comments_${currentNextGenDept}`;
    try { comments = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch(e){}

    const myName = localStorage.getItem("yetalkUserName") || "은혜성도";
    comments.push({ name: myName, text: msg, time: "방금" });
    localStorage.setItem(storageKey, JSON.stringify(comments));

    inp.value = "";
    renderNextGenComments();
    showToast("✨ 축복 응원 메시지가 등록되었습니다.");
}

function renderNextGenComments() {
    const container = document.getElementById("nextGenCommentList");
    const countEl = document.getElementById("dispNextGenCommentCount");

    let comments = [];
    const storageKey = `yetalk_church_nextgen_comments_${currentNextGenDept}`;
    try { comments = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch(e){}

    if (comments.length === 0) {
        comments = [
            { name: "은혜교사", text: "언제나 말씀 안에서 무럭무럭 자라나길 기도하고 축복합니다! ✨", time: "어제" }
        ];
    }

    if (countEl) countEl.innerText = comments.length;
    if (!container) return;

    container.innerHTML = comments.map(c => `
        <div style="display:flex; justify-content:flex-end; align-items:flex-end; gap:6px; margin:4px 0;">
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:1px;">
                <span style="font-size:10.5px; color:#475569; font-weight:700;">${c.name} · ${c.time}</span>
                <div style="background:#a7f3d0; color:#064e3b; border-radius:14px 2px 14px 14px; padding:8px 12px; font-size:13px; font-weight:800; max-width:85%; box-shadow:0 1px 4px rgba(0,0,0,0.12); word-break:keep-all; line-height:1.45;">
                    ${c.text}
                </div>
            </div>
        </div>
    `).join("");
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
}

function scrollToCard(index) {
    if (typeof handleChurchNavTab === "function") {
        handleChurchNavTab(index);
    } else {
        renderChurchMenuContent(index);
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
        localStorage.setItem("yetalk_church_main_other_slides_v33", JSON.stringify(churchSlideData));
        localStorage.setItem("yetalk_church_main_other_slides_v31", JSON.stringify(churchSlideData));
    }

    renderChurchMenuContent(activeSecId);
    const targetCard = document.getElementById(`page_${activeSecId}_${slideIdx}`);
    if (targetCard) targetCard.scrollIntoView({ behavior: "smooth" });
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