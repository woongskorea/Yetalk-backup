/*==================================================
YETALK CHURCHMAIN.JS 1/2
4 COLOR DESIGN (WHITE/BLACK/BLUE/PINK) + HERO 7 + PASTOR + SERMON + BULLETIN
+ FONT & THEME PERSISTENT STORAGE
==================================================*/


/*==================================================
BASIC CONSTANT
==================================================*/

const FIREBASE_MODULE = "../firebase.js";

const CHURCH_COLLECTION = "churches";

const MAX_HERO = 7;

const MAX_BULLETIN_PAGES = 10;


/*==================================================
HELPER
==================================================*/

const $ = (id) =>
    document.getElementById(id);

const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

const text = (value) =>
    String(value ?? "").trim();

const escapeHtml = (value) =>
    String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");


/*==================================================
CHURCH ID
==================================================*/

const params =
    new URLSearchParams(location.search);

const churchId =
    params.get("churchId")
    ||
    localStorage.getItem("currentChurchId")
    ||
    localStorage.getItem("yetalkCurrentChurchId")
    ||
    localStorage.getItem("yetalkMyChurchId")
    ||
    localStorage.getItem("churchId")
    ||
    "fAKyQftAh3qPnsuRPSVz";


/*==================================================
DESIGN
흰색 → 검정 → 파랑 → 분홍
==================================================*/

const THEMES = [
    "white",
    "black",
    "blue",
    "pink"
];

const FONTS = [
    "normal",
    "large",
    "small"
];


/*==================================================
DEFAULT IMAGE
assets/churchmain.js 기준
==================================================*/

const DEFAULT_HERO_IMAGES = [
    "../images/church/churchcard1.jpg",
    "../images/church/churchcard2.jpg",
    "../images/church/churchcard3.jpg",
    "../images/church/churchcard4.jpg",
    "../images/church/churchcard5.jpg",
    "../images/church/churchcard6.jpg",
    "../images/church/churchcard7.jpg"
];

const DEFAULT_HERO_TITLES = [
    "하나님께서 사랑하시는 교회",
    "서로 섬기는 교회",
    "말씀 위에 서는 교회",
    "예배가 살아있는 교회",
    "기도하는 교회",
    "이웃을 사랑하는 교회",
    "다음세대를 세우는 교회"
];

const DEFAULT_PASTOR_IMAGE =
    "../images/church/pastorcard.jpg";

const DEFAULT_SERMON_IMAGE =
    "../images/church/sermoncard.jpg";


/*==================================================
GLOBAL
==================================================*/

let fb = null;

let churchDocData = {};

let isChurchAdmin = false;

let adminEditMode = false;

let heroIndex = 0;

let bulletinIndex = 0;

let heroTouchStartX = 0;

let fullHeroTouchStartX = 0;

let bulletinTouchStartX = 0;

let bulletinTouchStartY = 0;

let toastTimer = null;

let selectedPrintItems =
    new Set();

let currentMaterialViewType =
    "sermon";

let quickNavLockUntil = 0;

let scrollTicking = false;


/*==================================================
DEFAULT WORSHIP ORDER
==================================================*/

const DEFAULT_WORSHIP_ORDER = [

    {
        title: "예배의 부름",
        content: "인도자"
    },

    {
        title: "신앙고백",
        content: "사도신경"
    },

    {
        title: "찬송",
        content: "21장"
    },

    {
        title: "대표기도",
        content: "담당자"
    },

    {
        title: "성경봉독",
        content: "요한복음 3:16"
    },

    {
        title: "찬양",
        content: "찬양대"
    },

    {
        title: "말씀",
        content: "담임목사"
    },

    {
        title: "봉헌",
        content: "계좌보기 · 복사",
        action: "offering"
    },

    {
        title: "교회소식",
        content: "인도자"
    },

    {
        title: "축도",
        content: "담임목사"
    }

];


/*==================================================
DEFAULT BULLETIN 1~10
==================================================*/

const DEFAULT_PAGES = [

    {
        title: "주일예배순서",

        blocks: [

            {
                type: "worshipOrder",
                title: "주일예배순서"
            },

            {
                type: "sermonBodyLink"
            }

        ]
    },


    {
        title: "설교본문",

        blocks: [

            {
                type: "sermonBodyLink"
            }

        ]
    },


    {
        title: "교우소식 · 모임안내 · 교회소식",

        blocks: [

            {
                type: "text",
                title: "교우소식",
                content:
                    "새가족 · 생일 · 결혼 · 출산 · 입원 · 장례 등 교우소식을 적어주세요.",
                image: ""
            },

            {
                type: "text",
                title: "모임안내",
                content:
                    "교회 모임과 기관별 일정을 적어주세요.",
                image: ""
            },

            {
                type: "text",
                title: "교회소식",
                content:
                    "이번 주 중요한 교회소식을 적어주세요.",
                image: ""
            }

        ]
    },


    {
        title: "다음주 봉사자 안내",

        blocks: [

            {
                type: "text",
                title: "다음주 봉사자 안내",
                content:
                    "대표기도 · 안내 · 헌금위원 · 찬양 · 차량 · 식사봉사 등을 적어주세요.",
                image: ""
            },

            {
                type: "text",
                title: "다음주 예배안내",
                content:
                    "다음 주 예배와 특별순서를 안내합니다.",
                image: ""
            },

            {
                type: "text",
                title: "주간계획",
                content:
                    "이번 주 교회 일정을 적어주세요.",
                image: ""
            }

        ]
    },


    {
        title: "선교 및 모임",

        blocks: [

            {
                type: "text",
                title: "선교 및 모임",
                content:
                    "국내외 선교소식과 각 기관 · 부서 · 마을 · 셀 · 사랑방 등의 모임소식을 자유롭게 적어주세요.",
                image: ""
            }

        ]
    },


    {
        title:
            "교회 섬기는 사람들 · 월간계획 · 찾아오시는 길",

        blocks: [

            {
                type: "text",
                title: "교회 섬기는 사람들",
                content:
                    "담임목사 · 교역자 · 장로 · 권사 · 교사와 각 부서 담당자를 안내할 수 있습니다.",
                image: ""
            },

            {
                type: "text",
                title: "월간계획",
                content:
                    "이번 달 주요 교회일정을 적어주세요.",
                image: ""
            },

            {
                type: "text",
                title: "찾아오시는 길",
                content:
                    "교회주소 · 대중교통 · 주차안내 등을 입력할 수 있습니다.",
                image: ""
            }

        ]
    },


    {
        title: "선교지에서 온 편지",

        blocks: [

            {
                type: "text",
                title: "선교지에서 온 편지",
                content:
                    "선교사님의 소식과 기도제목을 이곳에 전할 수 있습니다.",
                image: ""
            }

        ]
    },


    {
        title: "하나님께 드린 예물",

        blocks: [

            {
                type: "text",
                title: "하나님께 드린 예물",
                content:
                    "이번 주 하나님께 드린 예물과 감사의 내용을 교회 형편에 맞게 기록할 수 있습니다.",
                image: ""
            }

        ]
    },


    {
        title: "교회의 비전",

        blocks: [

            {
                type: "text",
                title: "교회의 비전",
                content:
                    "우리교회의 비전과 목회방향을 자유롭게 적어주세요.",
                image: ""
            }

        ]
    },


    {
        title: "우리교회 이야기",

        blocks: [

            {
                type: "text",
                title: "우리교회 이야기",
                content:
                    "필요한 내용을 자유롭게 적어주세요.",
                image: ""
            }

        ]
    }

];


/*==================================================
DEFAULT OFFERING
==================================================*/

const DEFAULT_OFFERING_TYPES = [

    {
        id: "tithe",
        title: "십일조",
        bank: "",
        account: "",
        holder: ""
    },

    {
        id: "thanks",
        title: "감사헌금",
        bank: "",
        account: "",
        holder: ""
    },

    {
        id: "sunday",
        title: "주일헌금",
        bank: "",
        account: "",
        holder: ""
    },

    {
        id: "village",
        title: "마을헌금",
        bank: "",
        account: "",
        holder: ""
    },

    {
        id: "mission",
        title: "선교헌금",
        bank: "",
        account: "",
        holder: ""
    },

    {
        id: "purpose",
        title: "목적헌금",
        bank: "",
        account: "",
        holder: ""
    }

];


/*==================================================
DEFAULT HERO 7
==================================================*/

const DEFAULT_HERO_CARDS =
    DEFAULT_HERO_IMAGES.map(
        (image, index) => ({

            image,

            eyebrow:
                "",

            title:
                DEFAULT_HERO_TITLES[index],

            text:
                ""

        })
    );


/*==================================================
DEFAULT STATE
==================================================*/

const DEFAULT_STATE = {

    welcomeText:
        "우리교회에 오신 여러분을 진심으로 환영합니다.",


    heroCards:
        DEFAULT_HERO_CARDS,


    pastorGreeting: {

        image:
            "",

        title:
            "담임목사 인사",

        text:
            "예수님의 사랑으로 여러분을 진심으로 환영합니다.",

        pastor:
            "담임목사"

    },


    weeklySermon: {

        image:
            "",

        title:
            "이번주 말씀",

        bodyTitle:
            "설교본문",

        bible:
            "요한복음 3:16",

        bodyText:
            "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니\n이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.",

        pastor:
            "담임목사",

        video:
            "",

        isLive:
            false

    },


    bulletin: {

        worshipOrder:
            DEFAULT_WORSHIP_ORDER,

        pages:
            DEFAULT_PAGES

    },


    materials: {

        titles: {

            sermon:
                "설교요약",

            cell:
                "셀나눔지",

            family:
                "가정예배순서지"

        },

        contents: {

            sermon:
                "",

            cell:
                "",

            family:
                ""

        }

    },


    offering: {

        version:
            2,

        purposeMigrationDone:
            false,

        types:
            DEFAULT_OFFERING_TYPES

    }

};


let state =
    clone(
        DEFAULT_STATE
    );


/*==================================================
CLONE
==================================================*/

function clone(value) {

    return JSON.parse(
        JSON.stringify(value)
    );

}


/*==================================================
DEEP MERGE
==================================================*/

function mergeDeep(
    base,
    patch
) {

    if (
        Array.isArray(patch)
    ) {

        return clone(
            patch
        );

    }


    if (
        !patch
        ||
        typeof patch !== "object"
    ) {

        return patch;

    }


    const output = {
        ...(base || {})
    };


    Object.entries(
        patch
    )
    .forEach(
        ([key, value]) => {

            if (
                Array.isArray(value)
            ) {

                output[key] =
                    clone(value);

            }

            else if (
                value
                &&
                typeof value === "object"
            ) {

                output[key] =
                    mergeDeep(
                        output[key],
                        value
                    );

            }

            else {

                output[key] =
                    value;

            }

        }
    );


    return output;

}


/*==================================================
LOCAL STORAGE KEY
==================================================*/

function localStateKey() {

    return `yetalkChurchHomeV2_${churchId || "default"}`;

}


function themeKey() {

    return `yetalkChurchTheme_${churchId || "default"}`;

}


function fontKey() {

    return `yetalkChurchFont_${churchId || "default"}`;

}


/*==================================================
LOCAL LOAD
==================================================*/

function loadLocalState() {

    try {

        const raw =
            localStorage.getItem(
                localStateKey()
            );


        return raw
            ? JSON.parse(raw)
            : null;

    }

    catch (error) {

        console.warn(
            "로컬 자료 불러오기 실패",
            error
        );


        return null;

    }

}


/*==================================================
LOCAL SAVE
==================================================*/

function saveLocalState() {

    try {

        localStorage.setItem(
            localStateKey(),
            JSON.stringify(state)
        );

    }

    catch (error) {

        console.warn(
            "로컬 저장 실패",
            error
        );

    }

}


/*==================================================
FIREBASE LOAD
==================================================*/

async function loadFirebaseModule() {

    try {

        fb =
            await import(
                FIREBASE_MODULE
            );

    }

    catch (error) {

        fb = null;


        console.warn(
            "Firebase 연결 없이 로컬 모드로 실행합니다.",
            error
        );

    }

}


/*==================================================
REMOTE LOAD
==================================================*/

async function loadRemoteState() {

    if (
        !fb
        ||
        !churchId
    ) {

        return;

    }


    try {

        const snap =
            await fb.getDoc(

                fb.doc(
                    fb.db,
                    CHURCH_COLLECTION,
                    churchId
                )

            );


        if (
            !snap.exists()
        ) {

            return;

        }


        churchDocData =
            snap.data()
            ||
            {};


        if (
            churchDocData.churchHome
        ) {

            state =
                mergeDeep(
                    state,
                    churchDocData.churchHome
                );

        }

    }

    catch (error) {

        console.warn(
            "교회홈 자료 불러오기 실패",
            error
        );

    }

}


/*==================================================
SAVE STATE
==================================================*/

async function saveState(
    message = "저장했습니다."
) {

    saveLocalState();


    if (
        fb
        &&
        churchId
    ) {

        try {

            await fb.setDoc(

                fb.doc(
                    fb.db,
                    CHURCH_COLLECTION,
                    churchId
                ),

                {

                    churchHome:
                        state,

                    churchHomeUpdatedAt:
                        fb.serverTimestamp()

                },

                {
                    merge:
                        true
                }

            );

        }

        catch (error) {

            console.warn(
                "Firebase 저장 실패",
                error
            );


            showToast(
                "이 기기에 먼저 저장했습니다."
            );


            return;

        }

    }


    if (message) {

        showToast(
            message
        );

    }

}


/*==================================================
CHURCH NAME
==================================================*/

function getChurchName() {

    return text(

        churchDocData.churchName
        ||
        churchDocData.name
        ||
        localStorage.getItem("yetalkMyChurchName")
        ||
        "예톡행복한교회"

    );

}


/*==================================================
TEXT
==================================================*/

function setText(
    id,
    value
) {

    const el =
        $(id);


    if (el) {

        el.textContent =
            value ?? "";

    }

}


/*==================================================
IMAGE
==================================================*/

function setImage(
    id,
    src
) {

    const img =
        $(id);


    if (!img) {

        return;

    }


    if (
        text(src)
    ) {

        img.src =
            src;


        img.classList.remove(
            "hidden"
        );

    }

    else {

        img.removeAttribute(
            "src"
        );


        img.classList.add(
            "hidden"
        );

    }

}


/*==================================================
TOAST
==================================================*/

function showToast(message) {

    const toast =
        $("churchToast");


    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/*==================================================
OVERLAY
==================================================*/

function openOverlay(id) {

    const el =
        $(id);


    if (!el) {

        return;

    }


    el.classList.remove(
        "hidden"
    );


    el.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeOverlay(id) {

    const el =
        $(id);


    if (!el) {

        return;

    }


    el.classList.add(
        "hidden"
    );


    el.setAttribute(
        "aria-hidden",
        "true"
    );


    if (
        !document.querySelector(
            ".js-modal-overlay"
        )
        &&
        $$(".church-overlay:not(.hidden)")
            .length === 0
    ) {

        document.body.style.overflow =
            "";

    }

}


/*==================================================
INIT
==================================================*/

async function initChurchMain() {

    if (
        window.__yetalkChurchMainStarted
    ) {

        return;

    }


    window.__yetalkChurchMainStarted =
        true;


    try {

        const local =
            loadLocalState();


        if (local) {

            state =
                mergeDeep(
                    state,
                    local
                );

        }


        bindImmediateUi();


        restoreUiChoice();


        applyAll();


        playWelcomeAnimation();


        await loadFirebaseModule();


        await loadRemoteState();


        applyAll();


        await resolveAdmin();


        updateAdminUi();

    }

    catch (error) {

        console.error(
            "CHURCHMAIN INIT ERROR",
            error
        );

    }

}


/*==================================================
INIT EXECUTE
==================================================*/

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initChurchMain,
        {
            once:
                true
        }
    );

}

else {

    initChurchMain();

}


/*==================================================
BIND IMMEDIATE UI
==================================================*/

function bindImmediateUi() {

    bindHomeButtons();

    bindTheme();

    bindFont();

    bindHero();

    bindPastorAndSermon();

    bindBulletin();

    bindMaterials();

    bindOffering();

    bindAdminButton();

    bindOverlayClose();

    bindEsc();

}


/*==================================================
APPLY ALL
==================================================*/

function applyAll() {

    applyChurchName();

    applyWelcome();

    renderHero();

    applyPastor();

    applySermon();

    renderHomeBulletinPreview();

    renderBulletin();

    renderMaterials();

    renderOffering();

}


/*==================================================
APPLY CHURCH NAME
==================================================*/

function applyChurchName() {

    const name =
        getChurchName();


    setText(
        "churchName",
        name
    );


    setText(
        "bulletinChurchName",
        name
    );


    setText(
        "offeringChurchName",
        name
    );


    document.title =
        `${name} · 예톡`;

}


/*==================================================
WELCOME
==================================================*/

function applyWelcome() {

    setText(
        "churchWelcomeText",
        state.welcomeText
        ||
        DEFAULT_STATE.welcomeText
    );

}


/*==================================================
WELCOME ANIMATION
==================================================*/

function playWelcomeAnimation() {

    const welcome =
        $("churchWelcome");


    if (!welcome) {

        return;

    }


    welcome.classList.remove(
        "welcome-play"
    );


    void welcome.offsetWidth;


    welcome.classList.add(
        "welcome-play"
    );

}


/*==================================================
HOME BUTTONS
==================================================*/

function bindHomeButtons() {

    $("churchHomeButton")
        ?.addEventListener(
            "click",
            (e) => {
                e.preventDefault();
                goChurchHome();
            }
        );


    $("bulletinHomeButton")
        ?.addEventListener(
            "click",
            (e) => {
                e.preventDefault();
                goChurchHome();
            }
        );


    $("homeBulletinOpenButton")
        ?.addEventListener(
            "click",
            openBulletinFromHome
        );

}


/*==================================================
GO HOME (글자 크기 및 테마 유지 보장)
==================================================*/

function goChurchHome() {

    bulletinIndex =
        0;


    updateBulletinPosition(
        false
    );


    // 스크롤 맨 위로 부드럽게 이동
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    setTimeout(
        playWelcomeAnimation,
        250
    );

}


/*==================================================
HOME → BULLETIN
==================================================*/

function openBulletinFromHome() {

    bulletinIndex =
        0;


    updateBulletinPosition(
        false
    );


    requestAnimationFrame(
        () => {

            scrollBulletinTop(
                true
            );

        }
    );

}


/*==================================================
RESTORE COLOR + FONT (로컬 스토리지 복원)
==================================================*/

function restoreUiChoice() {

    const savedTheme =
        localStorage.getItem(
            themeKey()
        );


    const savedFont =
        localStorage.getItem(
            fontKey()
        );


    applyTheme(

        THEMES.includes(
            savedTheme
        )

            ? savedTheme

            : "blue"

    );


    applyFont(

        FONTS.includes(
            savedFont
        )

            ? savedFont

            : "normal"

    );

}


/*==================================================
COLOR BUTTON
흰색 → 검정 → 파랑 → 분홍
==================================================*/

function bindTheme() {

    $("themeCycleButton")
        ?.addEventListener(
            "click",
            () => {

                const app =
                    $("churchApp");


                if (!app) {

                    return;

                }


                const current =
                    THEMES.find(
                        (name) =>
                            app.classList.contains(
                                `theme-${name}`
                            )
                    )
                    ||
                    "blue";


                const currentIndex =
                    THEMES.indexOf(
                        current
                    );


                const next =
                    THEMES[
                        (
                            currentIndex
                            +
                            1
                        )
                        %
                        THEMES.length
                    ];


                applyTheme(
                    next
                );


                localStorage.setItem(
                    themeKey(),
                    next
                );


                const labels = {

                    white:
                        "흰색 디자인",

                    black:
                        "검정 디자인",

                    blue:
                        "파랑 디자인",

                    pink:
                        "분홍 디자인"

                };


                showToast(
                    labels[next]
                );

            }
        );

}


/*==================================================
APPLY THEME
==================================================*/

function applyTheme(theme) {

    const app =
        $("churchApp");


    if (!app) {

        return;

    }


    THEMES.forEach(
        (name) => {

            app.classList.remove(
                `theme-${name}`
            );

        }
    );


    app.classList.add(
        `theme-${theme}`
    );

}


/*==================================================
FONT
교회이름 클릭 시 글자 크기 순환 & 로컬스토리지 영구저장
==================================================*/

function bindFont() {

    $("churchNameButton")
        ?.addEventListener(
            "click",
            () => {

                const app =
                    $("churchApp");


                if (!app) {

                    return;

                }


                const current =
                    FONTS.find(
                        (name) =>
                            app.classList.contains(
                                `font-${name}`
                            )
                    )
                    ||
                    "normal";


                const currentIndex =
                    FONTS.indexOf(
                        current
                    );


                const next =
                    FONTS[
                        (
                            currentIndex
                            +
                            1
                        )
                        %
                        FONTS.length
                    ];


                applyFont(
                    next
                );


                localStorage.setItem(
                    fontKey(),
                    next
                );


                const label = {

                    normal:
                        "글자 크기 : 보통",

                    large:
                        "글자 크기 : 조금 크게",

                    small:
                        "글자 크기 : 조금 작게"

                };


                showToast(
                    label[next]
                );

            }
        );

}


/*==================================================
APPLY FONT
==================================================*/

function applyFont(mode) {

    const app =
        $("churchApp");


    if (!app) {

        return;

    }


    FONTS.forEach(
        (name) => {

            app.classList.remove(
                `font-${name}`
            );

        }
    );


    app.classList.add(
        `font-${mode}`
    );

}


/*==================================================
CURRENT USER
==================================================*/

function readCurrentUser() {

    const result =
        {};


    const objectKeys = [

        "yetalkUser",
        "yetalkCurrentUser",
        "currentUser",
        "loginUser",
        "currentMember",
        "member"

    ];


    objectKeys.forEach(
        (key) => {

            try {

                const raw =
                    localStorage.getItem(
                        key
                    );


                if (!raw) {

                    return;

                }


                const parsed =
                    JSON.parse(
                        raw
                    );


                if (
                    parsed
                    &&
                    typeof parsed === "object"
                ) {

                    Object.assign(
                        result,
                        parsed
                    );

                }

            }

            catch {
                /* ignore */
            }

        }
    );


    const scalarMap = {

        memberNo: [
            "memberNo",
            "yetalkMemberNo",
            "loginMemberNo"
        ],

        userId: [
            "userId",
            "uid",
            "yetalkUserId"
        ],

        name: [
            "userName",
            "name",
            "yetalkName",
            "displayName"
        ],

        nickname: [
            "nickname",
            "yetalkNickname"
        ],

        grade: [
            "baseGrade",
            "yetalkGrade",
            "grade",
            "role"
        ]

    };


    Object.entries(
        scalarMap
    )
    .forEach(
        ([field, keys]) => {

            if (
                text(
                    result[field]
                )
            ) {

                return;

            }


            for (
                const key of keys
            ) {

                const value =
                    text(
                        localStorage.getItem(
                            key
                        )
                    );


                if (value) {

                    result[field] =
                        value;


                    break;

                }

            }

        }
    );


    return result;

}


/*==================================================
DEVELOPMENT
==================================================*/

function isDevelopmentPreview() {

    return (

        location.protocol === "file:"

        ||

        [
            "localhost",
            "127.0.0.1"
        ].includes(
            location.hostname
        )

    );

}


/*==================================================
ADMIN CHECK
==================================================*/

async function resolveAdmin() {

    const user =
        readCurrentUser();


    const role =
        text(
            user.role
            ||
            user.grade
            ||
            user.baseGrade
            ||
            user.yetalkGrade
        ).toLowerCase();

    const level =
        Number(
            user.level
            ||
            user.memberLevel
            ||
            0
        );

    if (
        [
            "master",
            "admin",
            "yetalkadmin",
            "yetalk_admin",
            "예톡2",
            "예톡3"
        ].includes(role)
        ||
        level >= 6
        ||
        user.isAdmin === true
        ||
        user.isYetalkAdmin === true
    ) {

        isChurchAdmin =
            true;

        return;

    }


    const userId =
        text(
            user.userId
            ||
            user.uid
            ||
            user.id
        );

    const memberNo =
        text(
            user.memberNo
            ||
            user.memberNumber
        );

    const name =
        text(
            user.name
            ||
            user.displayName
            ||
            user.userName
            ||
            user.nickname
        );


    const ownerIds = [
        churchDocData.ownerUserId,
        churchDocData.ownerId,
        churchDocData.creatorUserId,
        churchDocData.adminUid
    ]
    .map(text)
    .filter(Boolean);


    const ownerMemberNos = [
        churchDocData.ownerMemberNo,
        churchDocData.creatorMemberNo,
        churchDocData.createdByMemberNo,
        churchDocData.adminMemberNo
    ]
    .map(text)
    .filter(Boolean);


    const ownerNames = [
        churchDocData.ownerName,
        churchDocData.creatorName,
        churchDocData.createdByName
    ]
    .map(text)
    .filter(Boolean);


    if (
        (userId && ownerIds.includes(userId)) ||
        (memberNo && ownerMemberNos.includes(memberNo)) ||
        (name && ownerNames.includes(name)) ||
        (name === "촤웅식" || name === "최웅식")
    ) {

        isChurchAdmin =
            true;

        return;

    }


    if (
        fb
        &&
        churchId
        &&
        memberNo
    ) {

        try {

            const memSnap =
                await fb.getDoc(
                    fb.doc(
                        fb.db,
                        "users",
                        memberNo,
                        "churches",
                        churchId
                    )
                );

            if (memSnap.exists()) {

                const mData = memSnap.data() || {};

                if (
                    mData.isOwner === true ||
                    mData.isChurchAdmin === true ||
                    mData.role === "owner" ||
                    mData.grade === "owner" ||
                    mData.gradeName === "개설관리자" ||
                    [ "총관리자", "부관리자", "최고관리자", "관리자" ].includes(text(mData.role || mData.grade))
                ) {

                    isChurchAdmin =
                        true;

                    return;

                }

            }

        }

        catch (error) {

            console.warn(
                "멤버십 권한 확인 중 오류:",
                error
            );

        }

    }


    if (
        localStorage.getItem("isChurchAdmin") === "true" ||
        localStorage.getItem("isOwner") === "true"
    ) {

        isChurchAdmin =
            true;

        return;

    }


    if (
        isDevelopmentPreview()
    ) {

        isChurchAdmin =
            true;

    }

}


/*==================================================
ADMIN BUTTON
==================================================*/

function bindAdminButton() {

    $("churchAdminModeButton")
        ?.addEventListener(
            "click",
            () => {

                if (
                    !isChurchAdmin
                ) {

                    return;

                }


                adminEditMode =
                    !adminEditMode;


                updateAdminUi();


                showToast(

                    adminEditMode

                        ? "관리자 편집모드"

                        : "편집모드 종료"

                );

            }
        );

}


/*==================================================
ADMIN UI
==================================================*/

function updateAdminUi() {

    const adminButton =
        $("churchAdminModeButton");


    if (adminButton) {

        adminButton.classList.toggle(
            "hidden",
            !isChurchAdmin
        );


        adminButton.textContent =
            adminEditMode
                ? "완료"
                : "관리자";

    }


    const visible =
        isChurchAdmin
        &&
        adminEditMode;


    [

        "heroAdminTools",
        "bulletinAdminTools",
        "materialTitleEditButton",
        "offeringEditButton",
        "bulletinPrintToggleButton",
        "bulletinImageUploadButton"

    ]
    .forEach(
        (id) => {

            $(id)
                ?.classList
                .toggle(
                    "hidden",
                    !visible
                );

        }
    );


    if (!visible) {

        $("bulletinPrintPanel")
            ?.classList
            .add(
                "hidden"
            );

    }


    $$(
        ".bulletin-add-block-button"
    )
    .forEach(
        (el) => {

            el.classList.toggle(
                "hidden",
                !visible
            );

        }
    );


    $$(
        ".js-inline-admin"
    )
    .forEach(
        (el) => {

            el.classList.toggle(
                "hidden",
                !visible
            );

        }
    );


    document.body.classList.toggle(
        "admin-edit",
        visible
    );

}


/*==================================================
HERO NORMALIZE
항상 7장
==================================================*/

function normalizeHeroCards() {

    const oldCards =
        Array.isArray(
            state.heroCards
        )

            ? state.heroCards.slice(
                0,
                MAX_HERO
            )

            : [];


    const cards =
        [];


    for (
        let i = 0;
        i < MAX_HERO;
        i++
    ) {

        const old =
            oldCards[i]
            ||
            {};


        cards.push({

            image:
                text(
                    old.image
                )
                ||
                DEFAULT_HERO_IMAGES[i],

            eyebrow:
                text(
                    old.eyebrow
                ),

            title:
                text(
                    old.title
                )
                ||
                DEFAULT_HERO_TITLES[i],

            text:
                text(
                    old.text
                )

        });

    }


    state.heroCards =
        cards;


    if (
        heroIndex >=
        cards.length
    ) {

        heroIndex =
            0;

    }

}


/*==================================================
RENDER HERO
==================================================*/

function renderHero() {

    normalizeHeroCards();


    const track =
        $("heroTrack");


    if (!track) {

        return;

    }


    track.innerHTML =

        state.heroCards

            .map(
                (
                    card,
                    index
                ) => `

                    <article
                        class="hero-slide"
                        data-hero-index="${index}"
                    >

                        <img
                            class="hero-image"
                            src="${escapeHtml(card.image)}"
                            alt=""
                        >

                        <div class="hero-slide-overlay">

                            ${
                                card.eyebrow

                                    ? `
                                        <div class="hero-slide-eyebrow">
                                            ${escapeHtml(card.eyebrow)}
                                        </div>
                                    `

                                    : ""
                            }

                            <h2 class="hero-slide-title">
                                ${escapeHtml(card.title)}
                            </h2>

                            ${
                                card.text

                                    ? `
                                        <p class="hero-slide-text">
                                            ${escapeHtml(card.text)}
                                        </p>
                                    `

                                    : ""
                            }

                        </div>

                    </article>

                `
            )

            .join("");


    updateHeroPosition(
        false
    );


    $$(
        ".hero-slide",
        track
    )
    .forEach(
        (slide) => {

            slide.addEventListener(
                "click",
                () => {

                    openHeroFull(
                        Number(
                            slide.dataset.heroIndex
                        )
                    );

                }
            );

        }
    );

}


/*==================================================
HERO POSITION
==================================================*/

function updateHeroPosition(
    animate = true
) {

    const track =
        $("heroTrack");


    if (!track) {

        return;

    }


    track.style.transition =
        animate

            ? "transform .32s ease"

            : "none";


    track.style.transform =
        `translateX(-${heroIndex * 100}%)`;


    if (
        $("heroFullOverlay")
        &&
        !$("heroFullOverlay")
            .classList
            .contains(
                "hidden"
            )
    ) {

        renderHeroFull();

    }

}


/*==================================================
MOVE HERO
==================================================*/

function moveHero(direction) {

    const count =
        state.heroCards.length;


    if (!count) {

        return;

    }


    heroIndex =

        (
            heroIndex
            +
            direction
            +
            count
        )

        %

        count;


    updateHeroPosition(
        true
    );

}


/*==================================================
BIND HERO
==================================================*/

function bindHero() {

    $("heroPrevButton")
        ?.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                moveHero(
                    -1
                );

            }
        );


    $("heroNextButton")
        ?.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                moveHero(
                    1
                );

            }
        );


    $("heroManageButton")
        ?.addEventListener(
            "click",
            openHeroEditor
        );


    const viewport =
        $("heroViewport");


    viewport
        ?.addEventListener(
            "touchstart",
            (event) => {

                heroTouchStartX =
                    event.touches[0]
                        .clientX;

            },
            {
                passive:
                    true
            }
        );


    viewport
        ?.addEventListener(
            "touchend",
            (event) => {

                const diff =

                    event.changedTouches[0]
                        .clientX

                    -

                    heroTouchStartX;


                if (
                    Math.abs(diff)
                    >=
                    45
                ) {

                    moveHero(
                        diff < 0
                            ? 1
                            : -1
                    );

                }

            },
            {
                passive:
                    true
            }
        );


    $("heroFullPrevButton")
        ?.addEventListener(
            "click",
            () => {

                moveHero(
                    -1
                );

            }
        );


    $("heroFullNextButton")
        ?.addEventListener(
            "click",
            () => {

                moveHero(
                    1
                );

            }
        );


    $("heroFullCloseButton")
        ?.addEventListener(
            "click",
            () => {

                closeOverlay(
                    "heroFullOverlay"
                );

            }
        );


    const fullContent =
        $("heroFullContent");


    fullContent
        ?.addEventListener(
            "touchstart",
            (event) => {

                fullHeroTouchStartX =
                    event.touches[0]
                        .clientX;

            },
            {
                passive:
                    true
            }
        );


    fullContent
        ?.addEventListener(
            "touchend",
            (event) => {

                const diff =

                    event.changedTouches[0]
                        .clientX

                    -

                    fullHeroTouchStartX;


                if (
                    Math.abs(diff)
                    >=
                    45
                ) {

                    moveHero(
                        diff < 0
                            ? 1
                            : -1
                    );

                }

            },
            {
                passive:
                    true
            }
        );

}


/*==================================================
OPEN HERO FULL
==================================================*/

function openHeroFull(index) {

    heroIndex =
        Number.isFinite(index)

            ? index

            : heroIndex;


    renderHeroFull();


    openOverlay(
        "heroFullOverlay"
    );

}


/*==================================================
RENDER HERO FULL
==================================================*/

function renderHeroFull() {

    const card =
        state.heroCards[
            heroIndex
        ]
        ||
        state.heroCards[0];


    if (!card) {

        return;

    }


    setImage(
        "heroFullImage",
        card.image
    );


    setText(
        "heroFullEyebrow",
        card.eyebrow
    );


    setText(
        "heroFullTitle",
        card.title
        ||
        DEFAULT_HERO_TITLES[
            heroIndex
        ]
    );


    setText(
        "heroFullText",
        card.text
    );

}


/*==================================================
HERO EDITOR
==================================================*/

async function openHeroEditor() {

    if (
        !adminEditMode
    ) {

        return;

    }


    const modal =
        createModal(
            "메인 그림카드 편집",
            true
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    let cards =
        clone(
            state.heroCards
        );


    const render =
        () => {

            body.innerHTML = `

                <p class="js-help">
                    기본 그림 7장이 항상 있습니다.
                    교회 사진을 올리면 해당 기본그림 대신 표시됩니다.
                </p>

                <div id="jsHeroRows">
                </div>

                <div class="js-actions">

                    <button
                        type="button"
                        class="js-primary"
                        id="jsHeroSave"
                    >
                        저장
                    </button>

                </div>

            `;


            const rows =
                body.querySelector(
                    "#jsHeroRows"
                );


            cards.forEach(
                (
                    card,
                    index
                ) => {

                    const row =
                        document.createElement(
                            "section"
                        );


                    row.className =
                        "js-edit-card";


                    row.innerHTML = `

                        <h3>
                            그림 ${index + 1}
                        </h3>

                        <label class="js-label">
                            작은 글

                            <input
                                data-field="eyebrow"
                                value="${escapeHtml(card.eyebrow || "")}"
                            >
                        </label>

                        <label class="js-label">
                            큰 글

                            <input
                                data-field="title"
                                value="${escapeHtml(card.title || DEFAULT_HERO_TITLES[index])}"
                            >
                        </label>

                        <label class="js-label">
                            짧은 글

                            <textarea
                                data-field="text"
                                rows="2"
                            >${escapeHtml(card.text || "")}</textarea>
                        </label>

                        <label class="js-label">
                            교회 사진으로 교체

                            <input
                                data-field="file"
                                type="file"
                                accept="image/*"
                            >
                        </label>

                        <img
                            class="js-preview"
                            src="${escapeHtml(card.image || DEFAULT_HERO_IMAGES[index])}"
                            alt=""
                        >

                        <div class="js-row-actions">

                            <button
                                type="button"
                                class="js-secondary"
                                data-reset="${index}"
                            >
                                기본그림으로
                            </button>

                        </div>

                    `;


                    rows.appendChild(
                        row
                    );

                }
            );


            $$(
                "[data-reset]",
                rows
            )
            .forEach(
                (button) => {

                    button.onclick =
                        () => {

                            collectHeroRows(
                                rows,
                                cards
                            );


                            const index =
                                Number(
                                    button.dataset.reset
                                );


                            cards[index].image =
                                DEFAULT_HERO_IMAGES[index];


                            render();

                        };

                }
            );


            body.querySelector(
                "#jsHeroSave"
            )
            .onclick =
                async () => {

                    const rowEls =
                        $$(
                            ".js-edit-card",
                            rows
                        );


                    const next =
                        [];


                    for (
                        let i = 0;
                        i < MAX_HERO;
                        i++
                    ) {

                        const row =
                            rowEls[i];


                        const old =
                            cards[i]
                            ||
                            {};


                        const file =
                            row.querySelector(
                                '[data-field="file"]'
                            )
                            ?.files
                            ?.[0];


                        let image =
                            text(
                                old.image
                            )
                            ||
                            DEFAULT_HERO_IMAGES[i];


                        if (file) {

                            image =
                                await storeImage(
                                    file,
                                    `hero_${i + 1}`
                                );

                        }


                        next.push({

                            image:
                                image
                                ||
                                DEFAULT_HERO_IMAGES[i],

                            eyebrow:
                                text(
                                    row.querySelector(
                                        '[data-field="eyebrow"]'
                                    )
                                    ?.value
                                ),

                            title:
                                text(
                                    row.querySelector(
                                        '[data-field="title"]'
                                    )
                                    ?.value
                                )
                                ||
                                DEFAULT_HERO_TITLES[i],

                            text:
                                text(
                                    row.querySelector(
                                        '[data-field="text"]'
                                    )
                                    ?.value
                                )

                        });

                    }


                    state.heroCards =
                        next;


                    heroIndex =
                        0;


                    renderHero();


                    await saveState(
                        "메인 그림카드를 저장했습니다."
                    );


                    removeModal(
                        modal
                    );

                };

        };


    render();

}


/*==================================================
COLLECT HERO
==================================================*/

function collectHeroRows(
    rows,
    cards
) {

    $$(
        ".js-edit-card",
        rows
    )
    .forEach(
        (
            row,
            index
        ) => {

            cards[index] = {

                ...(cards[index] || {}),

                eyebrow:
                    text(
                        row.querySelector(
                            '[data-field="eyebrow"]'
                        )
                        ?.value
                    ),

                title:
                    text(
                        row.querySelector(
                            '[data-field="title"]'
                        )
                        ?.value
                    )
                    ||
                    DEFAULT_HERO_TITLES[index],

                text:
                    text(
                        row.querySelector(
                            '[data-field="text"]'
                        )
                        ?.value
                    )

            };

        }
    );

}


/*==================================================
PASTOR
==================================================*/

function applyPastor() {

    const pastor =
        state.pastorGreeting
        ||
        DEFAULT_STATE.pastorGreeting;


    const pastorImage =
        text(
            pastor.image
        )
        ||
        DEFAULT_PASTOR_IMAGE;


    setImage(
        "pastorGreetingFullImage",
        pastorImage
    );


    setText(
        "pastorGreetingFullTitle",
        pastor.title
        ||
        "담임목사 인사"
    );


    setText(
        "pastorGreetingFullText",
        pastor.text
        ||
        ""
    );


    setText(
        "pastorGreetingFullPastor",
        pastor.pastor
        ||
        "담임목사"
    );


    const cardArea =
        $("pastorGreetingCardImageArea");


    if (cardArea) {

        cardArea.style.backgroundImage =
            `url("${pastorImage}")`;


        cardArea.style.backgroundSize =
            "cover";


        cardArea.style.backgroundPosition =
            "center";

    }

}


/*==================================================
SERMON NORMALIZE
==================================================*/

function ensureWeeklySermonBody() {

    if (
        !state.weeklySermon
    ) {

        state.weeklySermon =
            clone(
                DEFAULT_STATE.weeklySermon
            );

    }


    if (
        !text(
            state.weeklySermon.title
        )
    ) {

        state.weeklySermon.title =
            "이번주 말씀";

    }


    if (
        !text(
            state.weeklySermon.bodyTitle
        )
    ) {

        state.weeklySermon.bodyTitle =
            "설교본문";

    }


    if (
        !text(
            state.weeklySermon.bible
        )
        ||
        state.weeklySermon.bible
        ===
        "성경본문"
    ) {

        state.weeklySermon.bible =
            "요한복음 3:16";

    }


    if (
        !text(
            state.weeklySermon.bodyText
        )
    ) {

        state.weeklySermon.bodyText =
            DEFAULT_STATE
                .weeklySermon
                .bodyText;

    }


    if (
        !text(
            state.weeklySermon.pastor
        )
    ) {

        state.weeklySermon.pastor =
            "담임목사";

    }


    if (
        state.weeklySermon.video
        ===
        undefined
    ) {

        state.weeklySermon.video =
            "";

    }


    if (
        state.weeklySermon.image
        ===
        undefined
    ) {

        state.weeklySermon.image =
            "";

    }


    if (
        state.weeklySermon.isLive
        ===
        undefined
    ) {

        state.weeklySermon.isLive =
            false;

    }

}


/*==================================================
YOUTUBE ID
==================================================*/

function getYoutubeVideoId(url) {

    const value =
        text(
            url
        );


    if (!value) {

        return "";

    }


    try {

        const parsed =
            new URL(
                value
            );


        if (
            parsed.hostname.includes(
                "youtu.be"
            )
        ) {

            return parsed.pathname
                .replace(
                    "/",
                    ""
                )
                .split("?")[0];

        }


        if (
            parsed.hostname.includes(
                "youtube.com"
            )
        ) {

            if (
                parsed.pathname.startsWith(
                    "/shorts/"
                )
            ) {

                return parsed.pathname
                    .split("/")[2]
                    ||
                    "";

            }


            if (
                parsed.pathname.startsWith(
                    "/embed/"
                )
            ) {

                return parsed.pathname
                    .split("/")[2]
                    ||
                    "";

            }


            return parsed.searchParams
                .get(
                    "v"
                )
                ||
                "";

        }

    }

    catch {

        return "";

    }


    return "";

}


/*==================================================
SERMON CARD IMAGE
==================================================*/

function getSermonCardImage() {

    ensureWeeklySermonBody();


    const sermon =
        state.weeklySermon;


    if (
        text(
            sermon.image
        )
    ) {

        return sermon.image;

    }


    const youtubeId =
        getYoutubeVideoId(
            sermon.video
        );


    if (youtubeId) {

        return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    }


    return DEFAULT_SERMON_IMAGE;

}


/*==================================================
APPLY SERMON
==================================================*/

function applySermon() {

    ensureWeeklySermonBody();


    const sermon =
        state.weeklySermon;


    const live =
        !!sermon.isLive;


    $("weeklySermonStatusDot")
        ?.classList
        .toggle(
            "hidden",
            !live
        );


    setText(
        "weeklySermonCardText",

        live

            ? "이번주 라이브설교"

            : "이번주 설교"

    );


    setText(
        "weeklySermonCardSubText",

        live

            ? "지금 라이브 보기"

            : (
                sermon.title
                ||
                "설교 보기"
            )

    );


    setText(
        "weeklySermonOverlayLabel",

        live

            ? "이번주 라이브설교"

            : "이번주 설교"

    );


    setText(
        "weeklySermonFullTitle",
        sermon.title
        ||
        "이번주 말씀"
    );


    setText(
        "weeklySermonBible",
        sermon.bible
        ||
        "성경본문"
    );


    setText(
        "weeklySermonFullPastor",
        sermon.pastor
        ||
        "담임목사"
    );


    const sermonCardImage =
        getSermonCardImage();


    const cardArea =
        $("weeklySermonCardImageArea");


    if (cardArea) {

        cardArea.style.backgroundImage =
            `url("${sermonCardImage}")`;


        cardArea.style.backgroundSize =
            "cover";


        cardArea.style.backgroundPosition =
            "center";

    }


    renderSermonVideo(
        sermon.video
    );

}


/*==================================================
HOME BULLETIN PREVIEW
==================================================*/

function renderHomeBulletinPreview() {

    ensureWeeklySermonBody();


    setText(
        "homeBulletinBible",
        state.weeklySermon.bible
        ||
        "성경본문"
    );


    setText(
        "homeBulletinSermonTitle",
        state.weeklySermon.title
        ||
        "이번주 설교제목"
    );

}


/*==================================================
PASTOR / SERMON BUTTON
==================================================*/

function bindPastorAndSermon() {

    $("pastorGreetingCard")
        ?.addEventListener(
            "click",
            () => {

                if (
                    adminEditMode
                ) {

                    openPastorEditor();

                }

                else {

                    openOverlay(
                        "pastorGreetingOverlay"
                    );

                }

            }
        );


    $("pastorGreetingCloseButton")
        ?.addEventListener(
            "click",
            () => {

                closeOverlay(
                    "pastorGreetingOverlay"
                );

            }
        );


    $("weeklySermonCard")
        ?.addEventListener(
            "click",
            () => {

                if (
                    adminEditMode
                ) {

                    openSermonEditor();

                }

                else {

                    openOverlay(
                        "weeklySermonOverlay"
                    );

                }

            }
        );


    $("weeklySermonCloseButton")
        ?.addEventListener(
            "click",
            () => {

                closeOverlay(
                    "weeklySermonOverlay"
                );

            }
        );

}


/*==================================================
YOUTUBE EMBED
==================================================*/

function youtubeEmbedUrl(url) {

    const id =
        getYoutubeVideoId(
            url
        );


    return id
        ? `https://www.youtube.com/embed/${id}`
        : "";

}


/*==================================================
SERMON VIDEO
==================================================*/

function renderSermonVideo(url) {

    const area =
        $("weeklySermonVideoArea");


    if (!area) {

        return;

    }


    const embed =
        youtubeEmbedUrl(
            url
        );


    if (embed) {

        area.innerHTML = `

            <iframe
                src="${escapeHtml(embed)}"
                title="주일설교"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
            ></iframe>

        `;

    }

    else if (
        text(
            url
        )
    ) {

        area.innerHTML = `

            <video
                src="${escapeHtml(url)}"
                controls
                playsinline
            ></video>

        `;

    }

    else {

        area.innerHTML = `

            <div class="sermon-video-empty">
                설교 영상이 등록되면
                이곳에서 볼 수 있습니다.
            </div>

        `;

    }

}


/*==================================================
PASTOR EDITOR
==================================================*/

async function openPastorEditor() {

    if (
        !adminEditMode
    ) {

        return;

    }


    const pastor =
        clone(
            state.pastorGreeting
        );


    const modal =
        createModal(
            "담임목사 인사 편집"
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    const previewImage =
        text(
            pastor.image
        )
        ||
        DEFAULT_PASTOR_IMAGE;


    body.innerHTML = `

        <label class="js-label">
            제목

            <input
                id="jsPastorTitle"
                value="${escapeHtml(pastor.title || "담임목사 인사")}"
            >
        </label>

        <label class="js-label">
            담임목사 이름

            <input
                id="jsPastorName"
                value="${escapeHtml(pastor.pastor || "")}"
            >
        </label>

        <label class="js-label">
            인사말

            <textarea
                id="jsPastorText"
                rows="9"
            >${escapeHtml(pastor.text || "")}</textarea>
        </label>

        <label class="js-label">
            목사님 사진

            <input
                id="jsPastorFile"
                type="file"
                accept="image/*"
            >
        </label>

        <img
            class="js-preview"
            src="${escapeHtml(previewImage)}"
            alt=""
        >

        <div class="js-actions">

            <button
                type="button"
                class="js-secondary"
                id="jsPastorReset"
            >
                기본그림 사용
            </button>

            <button
                type="button"
                class="js-primary"
                id="jsPastorSave"
            >
                저장
            </button>

        </div>

    `;


    let resetToDefault =
        false;


    body.querySelector(
        "#jsPastorReset"
    )
    .onclick =
        () => {

            resetToDefault =
                true;


            pastor.image =
                "";


            body.querySelector(
                ".js-preview"
            )
            .src =
                DEFAULT_PASTOR_IMAGE;


            showToast(
                "기본그림으로 변경합니다."
            );

        };


    body.querySelector(
        "#jsPastorSave"
    )
    .onclick =
        async () => {

            const file =
                body.querySelector(
                    "#jsPastorFile"
                )
                ?.files
                ?.[0];


            let image =
                resetToDefault
                    ? ""
                    : (
                        pastor.image
                        ||
                        ""
                    );


            if (file) {

                image =
                    await storeImage(
                        file,
                        "pastor"
                    );

            }


            state.pastorGreeting = {

                image,

                title:
                    text(
                        body.querySelector(
                            "#jsPastorTitle"
                        )
                        .value
                    )
                    ||
                    "담임목사 인사",

                text:
                    text(
                        body.querySelector(
                            "#jsPastorText"
                        )
                        .value
                    ),

                pastor:
                    text(
                        body.querySelector(
                            "#jsPastorName"
                        )
                        .value
                    )
                    ||
                    "담임목사"

            };


            applyPastor();


            await saveState(
                "담임목사 인사를 저장했습니다."
            );


            removeModal(
                modal
            );

        };

}


/*==================================================
SERMON EDITOR
==================================================*/

async function openSermonEditor() {

    if (
        !adminEditMode
    ) {

        return;

    }


    ensureWeeklySermonBody();


    const sermon =
        clone(
            state.weeklySermon
        );


    const modal =
        createModal(
            "주일설교 · 설교본문 편집",
            true
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    body.innerHTML = `

        <label
            class="js-label"
            style="display:flex;align-items:center;gap:8px;"
        >

            <input
                id="jsSermonLive"
                type="checkbox"
                style="width:auto;margin:0;"
                ${sermon.isLive ? "checked" : ""}
            >

            현재 라이브 중

        </label>

        <label class="js-label">
            설교 제목

            <input
                id="jsSermonTitle"
                value="${escapeHtml(sermon.title || "")}"
            >
        </label>

        <label class="js-label">
            설교본문 제목

            <input
                id="jsSermonBodyTitle"
                value="${escapeHtml(sermon.bodyTitle || "설교본문")}"
            >
        </label>

        <label class="js-label">
            말씀 위치

            <input
                id="jsSermonBible"
                value="${escapeHtml(sermon.bible || "")}"
                placeholder="예: 요한복음 3:16"
            >
        </label>

        <label class="js-label">
            설교본문

            <textarea
                id="jsSermonBodyText"
                rows="10"
            >${escapeHtml(sermon.bodyText || "")}</textarea>
        </label>

        <label class="js-label">
            설교자

            <input
                id="jsSermonPastor"
                value="${escapeHtml(sermon.pastor || "")}"
            >
        </label>

        <label class="js-label">
            유튜브 또는 영상 주소

            <input
                id="jsSermonVideo"
                value="${escapeHtml(sermon.video || "")}"
            >
        </label>

        <label class="js-label">
            대표사진
            선택하지 않으면 유튜브 썸네일이 자동 사용됩니다.

            <input
                id="jsSermonFile"
                type="file"
                accept="image/*"
            >
        </label>

        <div class="js-actions">

            <button
                type="button"
                class="js-secondary"
                id="jsSermonImageReset"
            >
                자동 썸네일 사용
            </button>

            <button
                type="button"
                class="js-primary"
                id="jsSermonSave"
            >
                저장
            </button>

        </div>

    `;


    let resetSermonImage =
        false;


    body.querySelector(
        "#jsSermonImageReset"
    )
    .onclick =
        () => {

            resetSermonImage =
                true;


            showToast(
                "유튜브 썸네일 자동사용으로 변경합니다."
            );

        };


    body.querySelector(
        "#jsSermonSave"
    )
    .onclick =
        async () => {

            const file =
                body.querySelector(
                    "#jsSermonFile"
                )
                ?.files
                ?.[0];


            let image =
                resetSermonImage
                    ? ""
                    : (
                        sermon.image
                        ||
                        ""
                    );


            if (file) {

                image =
                    await storeImage(
                        file,
                        "sermon"
                    );

            }


            state.weeklySermon = {

                image,

                title:
                    text(
                        body.querySelector(
                            "#jsSermonTitle"
                        )
                        .value
                    )
                    ||
                    "이번주 말씀",

                bodyTitle:
                    text(
                        body.querySelector(
                            "#jsSermonBodyTitle"
                        )
                        .value
                    )
                    ||
                    "설교본문",

                bible:
                    text(
                        body.querySelector(
                            "#jsSermonBible"
                        )
                        .value
                    ),

                bodyText:
                    text(
                        body.querySelector(
                            "#jsSermonBodyText"
                        )
                        .value
                    ),

                pastor:
                    text(
                        body.querySelector(
                            "#jsSermonPastor"
                        )
                        .value
                    )
                    ||
                    "담임목사",

                video:
                    text(
                        body.querySelector(
                            "#jsSermonVideo"
                        )
                        .value
                    ),

                isLive:
                    !!body.querySelector(
                        "#jsSermonLive"
                    )
                    ?.checked

            };


            applySermon();


            renderHomeBulletinPreview();


            renderBulletin();


            await saveState(
                "주일설교와 설교본문을 저장했습니다."
            );


            removeModal(
                modal
            );

        };

}


/*==================================================
OLD SERMON TEXT
==================================================*/

const OLD_DEFAULT_SERMON_TEXT =
    "설교제목과 성경본문을 이곳에 입력합니다.\n\n예) 하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.\n\n요한복음 3장 16절";


/*==================================================
NORMALIZE BULLETIN
==================================================*/

function normalizeBulletin() {

    if (
        !state.bulletin
    ) {

        state.bulletin =
            clone(
                DEFAULT_STATE.bulletin
            );

    }


    if (
        !Array.isArray(
            state.bulletin.worshipOrder
        )
        ||
        !state.bulletin
            .worshipOrder
            .length
    ) {

        state.bulletin.worshipOrder =
            clone(
                DEFAULT_WORSHIP_ORDER
            );

    }


    if (
        !Array.isArray(
            state.bulletin.pages
        )
        ||
        !state.bulletin
            .pages
            .length
    ) {

        state.bulletin.pages =
            clone(
                DEFAULT_PAGES
            );

    }


    state.bulletin.pages =
        state.bulletin.pages.slice(
            0,
            MAX_BULLETIN_PAGES
        );


    while (
        state.bulletin.pages.length
        <
        MAX_BULLETIN_PAGES
    ) {

        state.bulletin.pages.push({

            title:
                `자유주보 ${state.bulletin.pages.length + 1}`,

            blocks:
                []

        });

    }


    state.bulletin.pages =
        state.bulletin.pages.map(
            (
                page,
                index
            ) => ({

                title:
                    text(
                        page?.title
                    )
                    ||
                    `주보 ${index + 1}면`,

                blocks:
                    Array.isArray(
                        page?.blocks
                    )

                        ? page.blocks

                        : []

            })
        );


    const page2Before =
        state.bulletin
            .pages[1];


    const oldSermonBlock =
        page2Before
            ?.blocks
            ?.find(
                (block) =>
                    text(
                        block?.title
                    )
                    ===
                    "설교본문"
                    &&
                    block?.type
                    !==
                    "sermonBodyLink"
            );


    const oldSermonText =
        text(
            oldSermonBlock
                ?.content
        );


    if (
        oldSermonText
        &&
        oldSermonText
        !==
        text(
            OLD_DEFAULT_SERMON_TEXT
        )
    ) {

        if (
            !state.weeklySermon
        ) {

            state.weeklySermon =
                {};

        }


        const currentBody =
            text(
                state.weeklySermon
                    .bodyText
            );


        const defaultBody =
            text(
                DEFAULT_STATE
                    .weeklySermon
                    .bodyText
            );


        if (
            !currentBody
            ||
            currentBody
            ===
            defaultBody
        ) {

            state.weeklySermon.bodyText =
                oldSermonText;

        }

    }


    ensureWeeklySermonBody();


    const page1 =
        state.bulletin
            .pages[0];


    page1.blocks =
        page1.blocks.filter(
            (block) => {

                if (
                    text(
                        block?.title
                    )
                    ===
                    "기타 예배안내"
                ) {

                    return false;

                }


                if (
                    block?.type
                    ===
                    "sermonBodyLink"
                ) {

                    return false;

                }


                return true;

            }
        );


    let worshipIndex =
        page1.blocks.findIndex(
            (block) =>
                block?.type
                ===
                "worshipOrder"
        );


    if (
        worshipIndex === -1
    ) {

        page1.blocks.unshift({

            type:
                "worshipOrder",

            title:
                "주일예배순서"

        });


        worshipIndex =
            0;

    }


    page1.blocks.splice(
        worshipIndex + 1,
        0,
        {
            type:
                "sermonBodyLink"
        }
    );


    const page2 =
        state.bulletin
            .pages[1];


    page2.blocks =
        page2.blocks.filter(
            (block) => {

                if (
                    block?.type
                    ===
                    "sermonBodyLink"
                ) {

                    return false;

                }


                if (
                    text(
                        block?.title
                    )
                    ===
                    "설교본문"
                ) {

                    return false;

                }


                return true;

            }
        );


    page2.blocks.unshift({

        type:
            "sermonBodyLink"

    });


    if (
        bulletinIndex
        >=
        state.bulletin.pages.length
        ||
        bulletinIndex < 0
    ) {

        bulletinIndex =
            0;

    }

}


/*==================================================
RENDER BULLETIN
==================================================*/

function renderBulletin() {

    normalizeBulletin();


    const track =
        $("bulletinTrack");


    if (!track) {

        return;

    }


    track.innerHTML =

        state.bulletin.pages

            .map(
                (
                    page,
                    pageIndex
                ) => `

                    <section
                        class="bulletin-page"
                        data-bulletin-page="${pageIndex}"
                    >

                        <div class="bulletin-page-scroll">

                            ${
                                page.blocks

                                    .map(
                                        (
                                            block,
                                            blockIndex
                                        ) =>
                                            renderBulletinBlock(
                                                block,
                                                pageIndex,
                                                blockIndex
                                            )
                                    )

                                    .join("")
                            }

                            <button
                                type="button"
                                class="bulletin-add-block-button hidden"
                                data-add-block-page="${pageIndex}"
                            >
                                + 제목 · 내용 · 이미지 추가
                            </button>

                        </div>

                    </section>

                `
            )

            .join("");


    updateBulletinPosition(
        false
    );


    updateAdminUi();

}


/*==================================================
RENDER BULLETIN BLOCK
==================================================*/

function renderBulletinBlock(
    block,
    pageIndex,
    blockIndex
) {

    if (
        block.type
        ===
        "worshipOrder"
    ) {

        const rows =

            state.bulletin
                .worshipOrder

                .map(
                    (item) => {

                        if (
                            item.action
                            ===
                            "offering"
                            ||
                            item.title
                            ===
                            "봉헌"
                        ) {

                            return `

                                <button
                                    type="button"
                                    class="worship-order-row worship-order-offering"
                                    data-bulletin-offering
                                >

                                    <span class="worship-order-label">
                                        ${escapeHtml(item.title)}
                                    </span>

                                    <strong class="worship-order-content">
                                        ${escapeHtml(item.content || "계좌보기 · 복사")}
                                    </strong>

                                </button>

                            `;

                        }


                        return `

                            <div class="worship-order-row">

                                <span class="worship-order-label">
                                    ${escapeHtml(item.title)}
                                </span>

                                <strong class="worship-order-content">
                                    ${escapeHtml(item.content)}
                                </strong>

                            </div>

                        `;

                    }
                )

                .join("");


        return `

            <article
                class="bulletin-content-block worship-order-block"
                data-block="${pageIndex}-${blockIndex}"
            >

                <h3>
                    ${escapeHtml(block.title || "주일예배순서")}
                </h3>

                <div class="worship-order-list">
                    ${rows}
                </div>

                <button
                    type="button"
                    class="js-inline-admin hidden"
                    data-edit-worship
                >
                    예배순서 편집
                </button>

            </article>

        `;

    }


    if (
        block.type
        ===
        "sermonBodyLink"
    ) {

        ensureWeeklySermonBody();


        const sermon =
            state.weeklySermon;


        return `

            <article
                class="bulletin-content-block sermon-body-linked-block"
                data-block="${pageIndex}-${blockIndex}"
            >

                <h3>
                    ${escapeHtml(sermon.bodyTitle || "설교본문")}
                </h3>

                <div class="bulletin-sermon-bible">
                    ${escapeHtml(sermon.bible || "")}
                </div>

                <div class="bulletin-sermon-body">
                    ${
                        escapeHtml(
                            sermon.bodyText || ""
                        )
                        .replaceAll(
                            "\n",
                            "<br>"
                        )
                    }
                </div>

                <button
                    type="button"
                    class="js-inline-admin hidden"
                    data-edit-sermon-body
                >
                    설교본문 수정
                </button>

            </article>

        `;

    }


    return `

        <article
            class="bulletin-content-block"
            data-block="${pageIndex}-${blockIndex}"
        >

            <h3>
                ${escapeHtml(block.title || "제목")}
            </h3>

            <div class="bulletin-block-text">

                ${
                    escapeHtml(
                        block.content || ""
                    )
                    .replaceAll(
                        "\n",
                        "<br>"
                    )
                }

            </div>

            ${
                block.image

                    ? `
                        <img
                            class="bulletin-block-image"
                            src="${escapeHtml(block.image)}"
                            alt=""
                        >
                    `

                    : ""
            }

            <button
                type="button"
                class="js-inline-admin hidden"
                data-edit-block="${pageIndex}-${blockIndex}"
            >
                수정
            </button>

        </article>

    `;

}


/*==================================================
CHURCHMAIN.JS 1/2 END
==================================================*/
/*==================================================
YETALK CHURCHMAIN.JS 2/2
BULLETIN + MATERIAL + OFFERING + IMAGE + MODAL
==================================================*/


/*==================================================
BIND BULLETIN
==================================================*/

function bindBulletin() {

    $("bulletinPrevButton")
        ?.addEventListener(
            "click",
            () => {

                moveBulletin(-1);

            }
        );


    $("bulletinNextButton")
        ?.addEventListener(
            "click",
            () => {

                moveBulletin(1);

            }
        );


    $("bulletinPrintToggleButton")
        ?.addEventListener(
            "click",
            () => {

                if (!adminEditMode) {

                    return;

                }


                $("bulletinPrintPanel")
                    ?.classList
                    .toggle(
                        "hidden"
                    );

            }
        );


    $("bulletinPrintItemSelectButton")
        ?.addEventListener(
            "click",
            openPrintSelector
        );


    $("bulletinPrintButton")
        ?.addEventListener(
            "click",
            openPrintPreview
        );


    $("bulletinPageManageButton")
        ?.addEventListener(
            "click",
            openPageManager
        );


    $("bulletinImageUploadButton")
        ?.addEventListener(
            "click",
            openBulletinImageUploader
        );


    const viewport =
        $("bulletinViewport");


    viewport
        ?.addEventListener(
            "touchstart",
            (event) => {

                bulletinTouchStartX =
                    event.touches[0]
                        .clientX;


                bulletinTouchStartY =
                    event.touches[0]
                        .clientY;

            },
            {
                passive: true
            }
        );


    viewport
        ?.addEventListener(
            "touchend",
            (event) => {

                const dx =
                    event.changedTouches[0]
                        .clientX
                    -
                    bulletinTouchStartX;


                const dy =
                    event.changedTouches[0]
                        .clientY
                    -
                    bulletinTouchStartY;


                if (
                    Math.abs(dx) >= 45
                    &&
                    Math.abs(dx)
                    >
                    Math.abs(dy) * 1.15
                ) {

                    moveBulletin(
                        dx < 0
                            ? 1
                            : -1
                    );

                }

            },
            {
                passive: true
            }
        );


    document.addEventListener(
        "click",
        (event) => {

            const offeringButton =
                event.target.closest(
                    "[data-bulletin-offering]"
                );


            if (offeringButton) {

                event.preventDefault();


                openOverlay(
                    "bulletinOfferingOverlay"
                );


                return;

            }


            const worshipButton =
                event.target.closest(
                    "[data-edit-worship]"
                );


            if (
                worshipButton
                &&
                adminEditMode
            ) {

                openWorshipEditor();


                return;

            }


            const sermonButton =
                event.target.closest(
                    "[data-edit-sermon-body]"
                );


            if (
                sermonButton
                &&
                adminEditMode
            ) {

                openSermonEditor();


                return;

            }


            const editBlock =
                event.target.closest(
                    "[data-edit-block]"
                );


            if (
                editBlock
                &&
                adminEditMode
            ) {

                const [
                    pageIndex,
                    blockIndex
                ] =
                    editBlock
                        .dataset
                        .editBlock
                        .split("-")
                        .map(Number);


                openBulletinBlockEditor(
                    pageIndex,
                    blockIndex
                );


                return;

            }


            const addBlock =
                event.target.closest(
                    "[data-add-block-page]"
                );


            if (
                addBlock
                &&
                adminEditMode
            ) {

                openBulletinBlockEditor(
                    Number(
                        addBlock
                            .dataset
                            .addBlockPage
                    )
                );

            }

        }
    );

}


/*==================================================
MOVE BULLETIN
==================================================*/

function moveBulletin(direction) {

    normalizeBulletin();


    const count =
        state.bulletin
            .pages
            .length;


    if (!count) {

        return;

    }


    bulletinIndex =
        (
            bulletinIndex
            +
            direction
            +
            count
        )
        %
        count;


    updateBulletinPosition(
        true
    );


    setTimeout(
        () => {

            scrollBulletinTop(
                true
            );

        },
        40
    );

}


/*==================================================
UPDATE BULLETIN POSITION
==================================================*/

function updateBulletinPosition(
    animate = true
) {

    normalizeBulletin();


    const track =
        $("bulletinTrack");


    if (track) {

        track.style.transition =
            animate
                ? "transform .30s ease"
                : "none";


        track.style.transform =
            `translateX(-${bulletinIndex * 100}%)`;

    }


    const page =
        state.bulletin
            .pages[
                bulletinIndex
            ];


    setText(
        "bulletinPageTitle",
        `${bulletinIndex + 1} / ${state.bulletin.pages.length} ${page?.title || "온라인주보"}`
    );


    $("churchApp")
        ?.classList
        .toggle(
            "bulletin-other-page",
            bulletinIndex !== 0
        );

}


/*==================================================
SCROLL BULLETIN TOP
==================================================*/

function scrollBulletinTop(
    smooth = true
) {

    const paper =
        $("bulletinPaper");


    if (!paper) {

        return;

    }


    const headerHeight =
        $("churchHeader")
            ?.offsetHeight
        ||
        0;


    const top =
        window.scrollY
        +
        paper
            .getBoundingClientRect()
            .top
        -
        headerHeight
        -
        7;


    window.scrollTo({

        top:
            Math.max(
                0,
                top
            ),

        behavior:
            smooth
                ? "smooth"
                : "auto"

    });

}


/*==================================================
BULLETIN IMAGE UPLOAD
==================================================*/

function openBulletinImageUploader() {

    if (!adminEditMode) {

        return;

    }


    normalizeBulletin();


    const pageIndex =
        bulletinIndex;


    const modal =
        createModal(
            `주보사진 올리기 · ${pageIndex + 1}/10`
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    body.innerHTML = `

        <p class="js-help">
            사진을 선택하면 JPG로 줄여서
            현재 주보면에 저장합니다.
        </p>

        <label class="js-label">
            사진 제목

            <input
                id="jsBulletinImageTitle"
                value="주보사진"
            >
        </label>

        <label class="js-label">
            사진 선택

            <input
                id="jsBulletinImageFile"
                type="file"
                accept="image/*"
            >
        </label>

        <div class="js-actions">

            <button
                type="button"
                class="js-primary"
                id="jsBulletinImageSave"
            >
                JPG로 저장
            </button>

        </div>

    `;


    body.querySelector(
        "#jsBulletinImageSave"
    )
    .onclick =
        async () => {

            const file =
                body.querySelector(
                    "#jsBulletinImageFile"
                )
                ?.files
                ?.[0];


            if (!file) {

                showToast(
                    "사진을 선택하세요."
                );


                return;

            }


            const image =
                await storeImage(
                    file,
                    `bulletin_page_${pageIndex + 1}`,
                    1600,
                    0.82
                );


            if (!image) {

                return;

            }


            state.bulletin
                .pages[
                    pageIndex
                ]
                .blocks
                .push({

                    type:
                        "text",

                    title:
                        text(
                            body.querySelector(
                                "#jsBulletinImageTitle"
                            )
                            .value
                        )
                        ||
                        "주보사진",

                    content:
                        "",

                    image

                });


            bulletinIndex =
                pageIndex;


            renderBulletin();


            await saveState(
                "주보사진을 저장했습니다."
            );


            removeModal(
                modal
            );


            setTimeout(
                () => {

                    scrollBulletinTop(
                        false
                    );

                },
                50
            );

        };

}


/*==================================================
BULLETIN BLOCK EDITOR
==================================================*/

async function openBulletinBlockEditor(
    pageIndex,
    blockIndex = null
) {

    if (!adminEditMode) {

        return;

    }


    normalizeBulletin();


    const page =
        state.bulletin
            .pages[
                pageIndex
            ];


    if (!page) {

        return;

    }


    const old =
        blockIndex === null

            ? {
                type: "text",
                title: "",
                content: "",
                image: ""
            }

            : clone(
                page.blocks[
                    blockIndex
                ]
            );


    if (
        old.type
        ===
        "worshipOrder"
    ) {

        openWorshipEditor();

        return;

    }


    if (
        old.type
        ===
        "sermonBodyLink"
    ) {

        openSermonEditor();

        return;

    }


    const modal =
        createModal(
            blockIndex === null
                ? "주보 내용 추가"
                : "주보 내용 수정"
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    body.innerHTML = `

        <label class="js-label">
            제목

            <input
                id="jsBlockTitle"
                value="${escapeHtml(old.title || "")}"
            >
        </label>

        <label class="js-label">
            내용

            <textarea
                id="jsBlockContent"
                rows="9"
            >${escapeHtml(old.content || "")}</textarea>
        </label>

        <label class="js-label">
            이미지

            <input
                id="jsBlockFile"
                type="file"
                accept="image/*"
            >
        </label>

        ${
            old.image
                ? `
                    <img
                        class="js-preview"
                        src="${escapeHtml(old.image)}"
                        alt=""
                    >
                `
                : ""
        }

        <div class="js-actions">

            ${
                blockIndex !== null
                    ? `
                        <button
                            type="button"
                            class="js-danger"
                            id="jsBlockDelete"
                        >
                            삭제
                        </button>
                    `
                    : ""
            }

            <button
                type="button"
                class="js-primary"
                id="jsBlockSave"
            >
                저장
            </button>

        </div>

    `;


    body.querySelector(
        "#jsBlockSave"
    )
    .onclick =
        async () => {

            const file =
                body.querySelector(
                    "#jsBlockFile"
                )
                ?.files
                ?.[0];


            let image =
                old.image
                ||
                "";


            if (file) {

                image =
                    await storeImage(
                        file,
                        `bulletin_${pageIndex + 1}`
                    );

            }


            const next = {

                type:
                    "text",

                title:
                    text(
                        body.querySelector(
                            "#jsBlockTitle"
                        )
                        .value
                    )
                    ||
                    "제목",

                content:
                    text(
                        body.querySelector(
                            "#jsBlockContent"
                        )
                        .value
                    ),

                image

            };


            if (
                blockIndex === null
            ) {

                page.blocks.push(
                    next
                );

            }

            else {

                page.blocks[
                    blockIndex
                ] =
                    next;

            }


            bulletinIndex =
                pageIndex;


            renderBulletin();


            await saveState(
                "주보 내용을 저장했습니다."
            );


            removeModal(
                modal
            );

        };


    body.querySelector(
        "#jsBlockDelete"
    )
    ?.addEventListener(
        "click",
        async () => {

            if (
                !confirm(
                    "이 내용을 삭제할까요?"
                )
            ) {

                return;

            }


            page.blocks.splice(
                blockIndex,
                1
            );


            bulletinIndex =
                pageIndex;


            renderBulletin();


            await saveState(
                "삭제했습니다."
            );


            removeModal(
                modal
            );

        }
    );

}


/*==================================================
WORSHIP EDITOR
==================================================*/

function openWorshipEditor() {

    if (!adminEditMode) {

        return;

    }


    normalizeBulletin();


    const modal =
        createModal(
            "예배순서 편집",
            true
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    let items =
        clone(
            state.bulletin
                .worshipOrder
        );


    const render =
        () => {

            body.innerHTML = `

                <p class="js-help">
                    순서 · 담당자 · 찬송 등을 수정할 수 있습니다.
                </p>

                <div id="jsWorshipRows">
                </div>

                <div class="js-actions">

                    <button
                        type="button"
                        class="js-secondary"
                        id="jsWorshipAdd"
                    >
                        + 순서 추가
                    </button>

                    <button
                        type="button"
                        class="js-primary"
                        id="jsWorshipSave"
                    >
                        저장
                    </button>

                </div>

            `;


            const holder =
                body.querySelector(
                    "#jsWorshipRows"
                );


            items.forEach(
                (
                    item,
                    index
                ) => {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "js-order-row";


                    row.innerHTML = `

                        <div class="js-order-move">

                            <button
                                type="button"
                                data-up="${index}"
                            >
                                ↑
                            </button>

                            <button
                                type="button"
                                data-down="${index}"
                            >
                                ↓
                            </button>

                        </div>

                        <input
                            data-title
                            value="${escapeHtml(item.title || "")}"
                            placeholder="순서"
                        >

                        <input
                            data-content
                            value="${escapeHtml(item.content || "")}"
                            placeholder="내용"
                        >

                        <button
                            type="button"
                            class="js-order-delete"
                            data-delete="${index}"
                        >
                            ×
                        </button>

                    `;


                    holder.appendChild(
                        row
                    );

                }
            );


            const collect =
                () => {

                    items =
                        $$(
                            ".js-order-row",
                            holder
                        )
                        .map(
                            (row) => {

                                const title =
                                    text(
                                        row.querySelector(
                                            "[data-title]"
                                        )
                                        .value
                                    );


                                return {

                                    title,

                                    content:
                                        text(
                                            row.querySelector(
                                                "[data-content]"
                                            )
                                            .value
                                        ),

                                    ...(
                                        title === "봉헌"
                                            ? {
                                                action:
                                                    "offering"
                                            }
                                            : {}
                                    )

                                };

                            }
                        );

                };


            $$(
                "[data-up]",
                holder
            )
            .forEach(
                (button) => {

                    button.onclick =
                        () => {

                            collect();


                            const index =
                                Number(
                                    button.dataset.up
                                );


                            if (index > 0) {

                                [
                                    items[index - 1],
                                    items[index]
                                ]
                                =
                                [
                                    items[index],
                                    items[index - 1]
                                ];

                            }


                            render();

                        };

                }
            );


            $$(
                "[data-down]",
                holder
            )
            .forEach(
                (button) => {

                    button.onclick =
                        () => {

                            collect();


                            const index =
                                Number(
                                    button.dataset.down
                                );


                            if (
                                index
                                <
                                items.length - 1
                            ) {

                                [
                                    items[index],
                                    items[index + 1]
                                ]
                                =
                                [
                                    items[index + 1],
                                    items[index]
                                ];

                            }


                            render();

                        };

                }
            );


            $$(
                "[data-delete]",
                holder
            )
            .forEach(
                (button) => {

                    button.onclick =
                        () => {

                            collect();


                            items.splice(
                                Number(
                                    button.dataset.delete
                                ),
                                1
                            );


                            render();

                        };

                }
            );


            body.querySelector(
                "#jsWorshipAdd"
            )
            .onclick =
                () => {

                    collect();


                    items.push({

                        title:
                            "",

                        content:
                            ""

                    });


                    render();

                };


            body.querySelector(
                "#jsWorshipSave"
            )
            .onclick =
                async () => {

                    collect();


                    state.bulletin
                        .worshipOrder =
                            items;


                    renderBulletin();


                    await saveState(
                        "예배순서를 저장했습니다."
                    );


                    removeModal(
                        modal
                    );

                };

        };


    render();

}


/*==================================================
PAGE MANAGER
==================================================*/

function openPageManager() {

    if (!adminEditMode) {

        return;

    }


    normalizeBulletin();


    const modal =
        createModal(
            "주보 1~10면 제목 관리"
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    body.innerHTML = `

        <div id="jsPageTitleRows">
        </div>

        <div class="js-actions">

            <button
                type="button"
                class="js-primary"
                id="jsPageTitleSave"
            >
                저장
            </button>

        </div>

    `;


    const holder =
        body.querySelector(
            "#jsPageTitleRows"
        );


    state.bulletin
        .pages
        .forEach(
            (
                page,
                index
            ) => {

                const label =
                    document.createElement(
                        "label"
                    );


                label.className =
                    "js-label";


                label.innerHTML = `

                    ${index + 1}면

                    <input
                        data-page-title="${index}"
                        value="${escapeHtml(page.title)}"
                    >

                `;


                holder.appendChild(
                    label
                );

            }
        );


    body.querySelector(
        "#jsPageTitleSave"
    )
    .onclick =
        async () => {

            $$(
                "[data-page-title]",
                holder
            )
            .forEach(
                (input) => {

                    const index =
                        Number(
                            input.dataset.pageTitle
                        );


                    state.bulletin
                        .pages[
                            index
                        ]
                        .title =
                            text(
                                input.value
                            )
                            ||
                            `${index + 1}면`;

                }
            );


            renderBulletin();


            await saveState(
                "주보 제목을 저장했습니다."
            );


            removeModal(
                modal
            );

        };

}


/*==================================================
PRINT ITEMS
==================================================*/

function collectPrintableItems() {

    normalizeBulletin();


    const items =
        [];


    state.bulletin
        .pages
        .forEach(
            (
                page,
                pageIndex
            ) => {

                page.blocks
                    .forEach(
                        (
                            block,
                            blockIndex
                        ) => {

                            const id =
                                `p${pageIndex}b${blockIndex}`;


                            let title =
                                block.title
                                ||
                                "제목";


                            if (
                                block.type
                                ===
                                "sermonBodyLink"
                            ) {

                                title =
                                    state.weeklySermon
                                        .bodyTitle
                                    ||
                                    "설교본문";

                            }


                            items.push({

                                id,

                                pageIndex,

                                blockIndex,

                                type:
                                    block.type,

                                title

                            });

                        }
                    );

            }
        );


    return items;

}


/*==================================================
PRINT SELECTOR
==================================================*/

function openPrintSelector() {

    if (!adminEditMode) {

        return;

    }


    const items =
        collectPrintableItems();


    const modal =
        createModal(
            "인쇄할 주보내용 선택"
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    body.innerHTML = `

        <div
            class="js-check-list"
            id="jsPrintChecks"
        >
        </div>

        <div class="js-actions">

            <button
                type="button"
                class="js-secondary"
                id="jsPrintAll"
            >
                전체선택
            </button>

            <button
                type="button"
                class="js-primary"
                id="jsPrintDone"
            >
                선택완료
            </button>

        </div>

    `;


    const holder =
        body.querySelector(
            "#jsPrintChecks"
        );


    items.forEach(
        (item) => {

            const label =
                document.createElement(
                    "label"
                );


            label.innerHTML = `

                <input
                    type="checkbox"
                    value="${item.id}"
                    ${selectedPrintItems.has(item.id) ? "checked" : ""}
                >

                <span>
                    ${item.pageIndex + 1}면 ·
                    ${escapeHtml(item.title)}
                </span>

            `;


            holder.appendChild(
                label
            );

        }
    );


    body.querySelector(
        "#jsPrintAll"
    )
    .onclick =
        () => {

            $$(
                'input[type="checkbox"]',
                holder
            )
            .forEach(
                (input) => {

                    input.checked =
                        true;

                }
            );

        };


    body.querySelector(
        "#jsPrintDone"
    )
    .onclick =
        () => {

            selectedPrintItems =
                new Set(
                    $$(
                        'input[type="checkbox"]:checked',
                        holder
                    )
                    .map(
                        (input) =>
                            input.value
                    )
                );


            setText(
                "bulletinPrintSelectedSummary",
                `${selectedPrintItems.size}개 선택`
            );


            removeModal(
                modal
            );

        };

}


/*==================================================
PRINT ITEM
==================================================*/

function renderPrintItem(item) {

    const block =
        state.bulletin
            .pages[
                item.pageIndex
            ]
            .blocks[
                item.blockIndex
            ];


    if (!block) {

        return "";

    }


    if (
        block.type
        ===
        "worshipOrder"
    ) {

        return `

            <article>

                <h3>
                    ${escapeHtml(block.title || "주일예배순서")}
                </h3>

                ${
                    state.bulletin
                        .worshipOrder
                        .map(
                            (row) => `

                                <div class="print-order">

                                    <span>
                                        ${escapeHtml(row.title)}
                                    </span>

                                    <strong>
                                        ${escapeHtml(row.content)}
                                    </strong>

                                </div>

                            `
                        )
                        .join("")
                }

            </article>

        `;

    }


    if (
        block.type
        ===
        "sermonBodyLink"
    ) {

        return `

            <article>

                <h3>
                    ${escapeHtml(state.weeklySermon.bodyTitle || "설교본문")}
                </h3>

                <strong>
                    ${escapeHtml(state.weeklySermon.bible || "")}
                </strong>

                <div>
                    ${
                        escapeHtml(
                            state.weeklySermon.bodyText || ""
                        )
                        .replaceAll(
                            "\n",
                            "<br>"
                        )
                    }
                </div>

            </article>

        `;

    }


    return `

        <article>

            <h3>
                ${escapeHtml(block.title || "제목")}
            </h3>

            <div>
                ${
                    escapeHtml(
                        block.content || ""
                    )
                    .replaceAll(
                        "\n",
                        "<br>"
                    )
                }
            </div>

            ${
                block.image
                    ? `
                        <img
                            src="${escapeHtml(block.image)}"
                            alt=""
                        >
                    `
                    : ""
            }

        </article>

    `;

}


/*==================================================
PRINT PREVIEW
==================================================*/

function openPrintPreview() {

    if (!adminEditMode) {

        return;

    }


    const all =
        collectPrintableItems();


    const selected =
        all.filter(
            (item) =>
                selectedPrintItems.has(
                    item.id
                )
        );


    if (
        !selected.length
    ) {

        showToast(
            "먼저 인쇄할 내용을 선택하세요."
        );


        return;

    }


    const layout =
        Number(
            document.querySelector(
                'input[name="bulletinPrintLayout"]:checked'
            )
            ?.value
            ||
            6
        );


    printSelectedBulletin(
        selected,
        layout
    );

}


/*==================================================
PRINT BULLETIN
==================================================*/

function printSelectedBulletin(
    selected,
    layout
) {

    const iframe =
        document.createElement(
            "iframe"
        );


    Object.assign(
        iframe.style,
        {

            position:
                "fixed",

            width:
                "1px",

            height:
                "1px",

            opacity:
                "0"

        }
    );


    document.body.appendChild(
        iframe
    );


    const doc =
        iframe.contentDocument;


    doc.open();


    doc.write(`

        <!doctype html>

        <html lang="ko">

        <head>

            <meta charset="utf-8">

            <title>
                ${escapeHtml(getChurchName())} 주보
            </title>

            <style>

                @page{
                    size:A4;
                    margin:10mm;
                }

                *{
                    box-sizing:border-box;
                }

                body{
                    margin:0;
                    color:#111;
                    font-family:Arial,"Noto Sans KR",sans-serif;
                }

                header{
                    padding-bottom:10px;
                    margin-bottom:12px;
                    border-bottom:2px solid #222;
                }

                header h1{
                    margin:0;
                    font-size:22px;
                }

                header p{
                    margin:4px 0 0;
                    font-size:11px;
                }

                article{
                    margin-bottom:16px;
                    padding-bottom:13px;
                    border-bottom:1px solid #ddd;
                    break-inside:avoid;
                }

                h3{
                    margin:0 0 8px;
                    font-size:16px;
                }

                article div{
                    font-size:11px;
                    line-height:1.7;
                }

                article > strong{
                    display:block;
                    margin-bottom:7px;
                    font-size:11px;
                }

                article img{
                    display:block;
                    max-width:100%;
                    max-height:110mm;
                    margin-top:10px;
                    object-fit:contain;
                }

                .print-order{
                    display:grid;
                    grid-template-columns:40% 60%;
                    gap:8px;
                    padding:5px 0;
                    border-bottom:1px solid #eee;
                    font-size:10px;
                }

                .print-order strong{
                    text-align:right;
                }

                .layout-note{
                    margin-bottom:10px;
                    color:#777;
                    font-size:9px;
                    text-align:right;
                }

            </style>

        </head>

        <body>

            <header>

                <h1>
                    ${escapeHtml(getChurchName())}
                </h1>

                <p>
                    온라인주보 인쇄
                </p>

            </header>

            <div class="layout-note">
                ${layout}면 인쇄선택
            </div>

            ${
                selected
                    .map(
                        renderPrintItem
                    )
                    .join("")
            }

        </body>

        </html>

    `);


    doc.close();


    setTimeout(
        () => {

            iframe.contentWindow
                .focus();


            iframe.contentWindow
                .print();


            setTimeout(
                () => {

                    iframe.remove();

                },
                1500
            );

        },
        350
    );

}


/*==================================================
MATERIAL NORMALIZE
==================================================*/

function normalizeMaterials() {

    state.materials ||=
        {};


    state.materials.titles ||=
        {};


    state.materials.contents ||=
        {};


    state.materials.titles.sermon =
        text(
            state.materials
                .titles
                .sermon
        )
        ||
        "설교요약";


    state.materials.titles.cell =
        text(
            state.materials
                .titles
                .cell
        )
        ||
        "셀나눔지";


    state.materials.titles.family =
        text(
            state.materials
                .titles
                .family
        )
        ||
        "가정예배순서지";


    state.materials.contents.sermon ??=
        "";


    state.materials.contents.cell ??=
        "";


    state.materials.contents.family ??=
        "";

}


/*==================================================
RENDER MATERIAL
==================================================*/

function renderMaterials() {

    normalizeMaterials();


    setText(
        "materialTitle_sermon",
        state.materials
            .titles
            .sermon
    );


    setText(
        "materialTitle_cell",
        state.materials
            .titles
            .cell
    );


    setText(
        "materialTitle_family",
        state.materials
            .titles
            .family
    );

}


/*==================================================
BIND MATERIAL
==================================================*/

function bindMaterials() {

    $("materialTitleEditButton")
        ?.addEventListener(
            "click",
            openMaterialEditor
        );


    $("materialViewCloseButton")
        ?.addEventListener(
            "click",
            () => {

                closeOverlay(
                    "materialViewOverlay"
                );

            }
        );


    $("materialViewPrintButton")
        ?.addEventListener(
            "click",
            () => {

                printMaterial(
                    currentMaterialViewType
                );

            }
        );


    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-material-view]"
                );


            if (!button) {

                return;

            }


            openMaterialView(
                button.dataset.materialView
            );

        }
    );

}


/*==================================================
OPEN MATERIAL
==================================================*/

function openMaterialView(type) {

    normalizeMaterials();


    currentMaterialViewType =
        type;


    setText(
        "materialViewTitle",
        state.materials
            .titles[
                type
            ]
        ||
        "자료 보기"
    );


    setText(
        "materialViewContent",
        state.materials
            .contents[
                type
            ]
        ||
        "등록된 내용이 없습니다."
    );


    openOverlay(
        "materialViewOverlay"
    );

}


/*==================================================
MATERIAL EDITOR
==================================================*/

function openMaterialEditor() {

    if (!adminEditMode) {

        return;

    }


    normalizeMaterials();


    const modal =
        createModal(
            "말씀 · 모임자료 편집",
            true
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    body.innerHTML = `

        ${materialEditorField("sermon")}

        ${materialEditorField("cell")}

        ${materialEditorField("family")}

        <div class="js-actions">

            <button
                type="button"
                class="js-primary"
                id="jsMaterialSave"
            >
                저장
            </button>

        </div>

    `;


    body.querySelector(
        "#jsMaterialSave"
    )
    .onclick =
        async () => {

            [
                "sermon",
                "cell",
                "family"
            ]
            .forEach(
                (type) => {

                    state.materials
                        .titles[
                            type
                        ] =
                            text(
                                body.querySelector(
                                    `[data-m-title="${type}"]`
                                )
                                .value
                            );


                    state.materials
                        .contents[
                            type
                        ] =
                            text(
                                body.querySelector(
                                    `[data-m-content="${type}"]`
                                )
                                .value
                            );

                }
            );


            renderMaterials();


            await saveState(
                "말씀 · 모임자료를 저장했습니다."
            );


            removeModal(
                modal
            );

        };

}


/*==================================================
MATERIAL FIELD
==================================================*/

function materialEditorField(type) {

    return `

        <section class="js-edit-card">

            <label class="js-label">
                제목

                <input
                    data-m-title="${type}"
                    value="${escapeHtml(state.materials.titles[type] || "")}"
                >
            </label>

            <label class="js-label">
                내용

                <textarea
                    data-m-content="${type}"
                    rows="8"
                >${escapeHtml(state.materials.contents[type] || "")}</textarea>
            </label>

        </section>

    `;

}


/*==================================================
PRINT MATERIAL
==================================================*/

function printMaterial(type) {

    normalizeMaterials();


    const title =
        state.materials
            .titles[
                type
            ]
        ||
        "교회자료";


    const content =
        state.materials
            .contents[
                type
            ]
        ||
        "";


    const iframe =
        document.createElement(
            "iframe"
        );


    Object.assign(
        iframe.style,
        {

            position:
                "fixed",

            width:
                "1px",

            height:
                "1px",

            opacity:
                "0"

        }
    );


    document.body.appendChild(
        iframe
    );


    const doc =
        iframe.contentDocument;


    doc.open();


    doc.write(`

        <!doctype html>

        <html lang="ko">

        <head>

            <meta charset="utf-8">

            <title>
                ${escapeHtml(title)}
            </title>

            <style>

                body{
                    padding:15mm;
                    color:#111;
                    font-family:Arial,"Noto Sans KR",sans-serif;
                }

                h1{
                    font-size:22px;
                }

                .content{
                    font-size:12px;
                    line-height:1.9;
                    white-space:pre-wrap;
                }

            </style>

        </head>

        <body>

            <h1>
                ${escapeHtml(title)}
            </h1>

            <div class="content">
                ${escapeHtml(content)}
            </div>

        </body>

        </html>

    `);


    doc.close();


    setTimeout(
        () => {

            iframe.contentWindow
                .focus();


            iframe.contentWindow
                .print();


            setTimeout(
                () => {

                    iframe.remove();

                },
                1500
            );

        },
        300
    );

}


/*==================================================
OFFERING NORMALIZE
==================================================*/

function normalizeOffering() {

    if (!state.offering) {

        state.offering = {

            version:
                2,

            purposeMigrationDone:
                true,

            types:
                clone(
                    DEFAULT_OFFERING_TYPES
                )

        };

    }


    if (
        !Array.isArray(
            state.offering.types
        )
        ||
        !state.offering
            .types
            .length
    ) {

        state.offering.types =
            clone(
                DEFAULT_OFFERING_TYPES
            );

    }


    if (
        state.offering
            .purposeMigrationDone
        !==
        true
    ) {

        const hasPurpose =
            state.offering
                .types
                .some(
                    (item) =>
                        item.id
                        ===
                        "purpose"
                );


        if (!hasPurpose) {

            state.offering
                .types
                .push({

                    id:
                        "purpose",

                    title:
                        "목적헌금",

                    bank:
                        "",

                    account:
                        "",

                    holder:
                        ""

                });

        }


        state.offering
            .purposeMigrationDone =
                true;

    }


    state.offering.version =
        2;

}


/*==================================================
RENDER OFFERING
==================================================*/

function renderOffering() {

    normalizeOffering();


    const html =
        state.offering
            .types
            .map(
                (item) => `

                    <button
                        type="button"
                        class="offering-type-button"
                        data-offering-type="${escapeHtml(item.id)}"
                    >

                        <strong>
                            ${escapeHtml(item.title)}
                        </strong>

                        <span>
                            계좌 복사
                        </span>

                    </button>

                `
            )
            .join("");


    if (
        $("offeringTypeList")
    ) {

        $("offeringTypeList")
            .innerHTML =
                html;

    }


    if (
        $("bulletinOfferingTypeList")
    ) {

        $("bulletinOfferingTypeList")
            .innerHTML =
                html;

    }

}


/*==================================================
BIND OFFERING
==================================================*/

function bindOffering() {

    $("offeringViewButton")
        ?.addEventListener(
            "click",
            () => {

                const panel =
                    $("offeringDetailPanel");


                const button =
                    $("offeringViewButton");


                if (
                    !panel
                    ||
                    !button
                ) {

                    return;

                }


                const open =
                    panel
                        .classList
                        .contains(
                            "hidden"
                        );


                panel.classList.toggle(
                    "hidden",
                    !open
                );


                button.textContent =
                    open
                        ? "계좌닫기"
                        : "계좌보기";


                button.setAttribute(
                    "aria-expanded",
                    open
                        ? "true"
                        : "false"
                );

            }
        );


    $("offeringEditButton")
        ?.addEventListener(
            "click",
            openOfferingEditor
        );


    $("bulletinOfferingCloseButton")
        ?.addEventListener(
            "click",
            () => {

                closeOverlay(
                    "bulletinOfferingOverlay"
                );

            }
        );


    $("offeringCopyNoticeCloseButton")
        ?.addEventListener(
            "click",
            () => {

                closeOverlay(
                    "offeringCopyNoticeOverlay"
                );

            }
        );


    $("offeringCopyNoticeOkButton")
        ?.addEventListener(
            "click",
            () => {

                closeOverlay(
                    "offeringCopyNoticeOverlay"
                );

            }
        );


    $("bottomOfferingButton")
        ?.addEventListener(
            "click",
            () => {

                scrollOfferingTop();

            }
        );


    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-offering-type]"
                );


            if (!button) {

                return;

            }


            copyOfferingType(
                button.dataset.offeringType
            );

        }
    );

}


/*==================================================
SCROLL OFFERING
==================================================*/

function scrollOfferingTop() {

    const target =
        $("offeringSection");

    if (!target) return;

    const headerHeight =
        $("churchHeader")?.offsetHeight || 0;

    const top =
        window.scrollY
        + target.getBoundingClientRect().top
        - headerHeight
        - 8;

    window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth"
    });

}


/*==================================================
COPY OFFERING
==================================================*/

async function copyOfferingType(id) {

    normalizeOffering();


    const item =
        state.offering
            .types
            .find(
                (type) =>
                    type.id === id
            );


    if (!item) {

        return;

    }


    if (
        !text(
            item.account
        )
    ) {

        showToast(
            "계좌번호가 아직 등록되지 않았습니다."
        );


        return;

    }


    await copyText(
        item.account
    );


    closeOverlay(
        "bulletinOfferingOverlay"
    );


    setText(
        "offeringCopyNoticeTitle",
        `${item.title} 계좌번호가 복사되었습니다`
    );


    setText(
        "offeringCopyNoticeAccount",
        [
            item.bank,
            item.account,
            item.holder
        ]
        .filter(Boolean)
        .join(" · ")
    );


    const user =
        readCurrentUser();


    const sender =
        text(
            user.name
            ||
            user.displayName
            ||
            user.userName
            ||
            user.nickname
        )
        ||
        "최웅식";


    setText(
        "offeringCopyExample",
        `예) ${sender}${item.title}`
    );


    openOverlay(
        "offeringCopyNoticeOverlay"
    );

}


/*==================================================
COPY TEXT
==================================================*/

async function copyText(value) {

    try {

        await navigator.clipboard
            .writeText(
                value
            );

    }

    catch {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            value;


        textarea.style.position =
            "fixed";


        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        document.execCommand(
            "copy"
        );


        textarea.remove();

    }

}


/*==================================================
OFFERING EDITOR
==================================================*/

function openOfferingEditor() {

    if (!adminEditMode) {

        return;

    }


    normalizeOffering();


    const modal =
        createModal(
            "헌금 계좌 편집",
            true
        );


    const body =
        modal.querySelector(
            ".js-modal-body"
        );


    let types =
        clone(
            state.offering.types
        );


    const render =
        () => {

            body.innerHTML = `

                <div id="jsOfferingRows">
                </div>

                <div class="js-actions">

                    <button
                        type="button"
                        class="js-secondary"
                        id="jsOfferingAdd"
                    >
                        + 헌금종류 추가
                    </button>

                    <button
                        type="button"
                        class="js-primary"
                        id="jsOfferingSave"
                    >
                        저장
                    </button>

                </div>

            `;


            const holder =
                body.querySelector(
                    "#jsOfferingRows"
                );


            types.forEach(
                (
                    item,
                    index
                ) => {

                    const row =
                        document.createElement(
                            "section"
                        );


                    row.className =
                        "js-edit-card";


                    row.innerHTML = `

                        <label class="js-label">
                            헌금종류

                            <input
                                data-o="title"
                                value="${escapeHtml(item.title || "")}"
                            >
                        </label>

                        <label class="js-label">
                            은행

                            <input
                                data-o="bank"
                                value="${escapeHtml(item.bank || "")}"
                            >
                        </label>

                        <label class="js-label">
                            계좌번호

                            <input
                                data-o="account"
                                value="${escapeHtml(item.account || "")}"
                            >
                        </label>

                        <label class="js-label">
                            예금주

                            <input
                                data-o="holder"
                                value="${escapeHtml(item.holder || "")}"
                            >
                        </label>

                        <div class="js-row-actions">

                            <button
                                type="button"
                                class="js-danger"
                                data-o-remove="${index}"
                            >
                                삭제
                            </button>

                        </div>

                    `;


                    holder.appendChild(
                        row
                    );

                }
            );


            const collect =
                () => {

                    const oldTypes =
                        types;


                    types =
                        $$(
                            ".js-edit-card",
                            holder
                        )
                        .map(
                            (
                                row,
                                index
                            ) => ({

                                id:
                                    oldTypes[index]
                                        ?.id
                                    ||
                                    `offering_${Date.now()}_${index}`,

                                title:
                                    text(
                                        row.querySelector(
                                            '[data-o="title"]'
                                        )
                                        .value
                                    )
                                    ||
                                    "헌금",

                                bank:
                                    text(
                                        row.querySelector(
                                            '[data-o="bank"]'
                                        )
                                        .value
                                    ),

                                account:
                                    text(
                                        row.querySelector(
                                            '[data-o="account"]'
                                        )
                                        .value
                                    ),

                                holder:
                                    text(
                                        row.querySelector(
                                            '[data-o="holder"]'
                                        )
                                        .value
                                    )

                            })
                        );

                };


            $$(
                "[data-o-remove]",
                holder
            )
            .forEach(
                (button) => {

                    button.onclick =
                        () => {

                            collect();


                            types.splice(
                                Number(
                                    button.dataset.oRemove
                                ),
                                1
                            );


                            render();

                        };

                }
            );


            body.querySelector(
                "#jsOfferingAdd"
            )
            .onclick =
                () => {

                    collect();


                    types.push({

                        id:
                            `offering_${Date.now()}`,

                        title:
                            "새 헌금",

                        bank:
                            "",

                        account:
                            "",

                        holder:
                            ""

                    });


                    render();

                };


            body.querySelector(
                "#jsOfferingSave"
            )
            .onclick =
                async () => {

                    collect();


                    state.offering.types =
                        types;


                    state.offering
                        .purposeMigrationDone =
                            true;


                    state.offering.version =
                        2;


                    renderOffering();


                    await saveState(
                        "헌금계좌를 저장했습니다."
                    );


                    removeModal(
                        modal
                    );

                };

        };


    render();

}


/*==================================================
IMAGE COMPRESS TO JPG
==================================================*/

async function compressImage(
    file,
    maxWidth = 1400,
    quality = 0.82
) {

    if (
        "createImageBitmap" in window
    ) {

        let bitmap;


        try {

            bitmap =
                await createImageBitmap(
                    file,
                    {
                        imageOrientation:
                            "from-image"
                    }
                );

        }

        catch {

            bitmap =
                await createImageBitmap(
                    file
                );

        }


        const ratio =
            Math.min(
                1,
                maxWidth / bitmap.width
            );


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            Math.round(
                bitmap.width * ratio
            );


        canvas.height =
            Math.round(
                bitmap.height * ratio
            );


        const ctx =
            canvas.getContext(
                "2d"
            );


        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.drawImage(
            bitmap,
            0,
            0,
            canvas.width,
            canvas.height
        );


        bitmap.close?.();


        return await new Promise(
            (
                resolve,
                reject
            ) => {

                canvas.toBlob(
                    (blob) => {

                        if (blob) {

                            resolve(
                                blob
                            );

                        }

                        else {

                            reject(
                                new Error(
                                    "JPG 변환 실패"
                                )
                            );

                        }

                    },
                    "image/jpeg",
                    quality
                );

            }
        );

    }


    return compressImageFallback(
        file,
        maxWidth,
        quality
    );

}


/*==================================================
IMAGE FALLBACK
==================================================*/

function compressImageFallback(
    file,
    maxWidth,
    quality
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onerror =
                reject;


            reader.onload =
                () => {

                    const image =
                        new Image();


                    image.onerror =
                        reject;


                    image.onload =
                        () => {

                            const ratio =
                                Math.min(
                                    1,
                                    maxWidth / image.width
                                );


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                Math.round(
                                    image.width * ratio
                                );


                            canvas.height =
                                Math.round(
                                    image.height * ratio
                                );


                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );


                            ctx.fillStyle =
                                "#ffffff";


                            ctx.fillRect(
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                            ctx.drawImage(
                                image,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                            canvas.toBlob(
                                (blob) => {

                                    if (blob) {

                                        resolve(
                                            blob
                                        );

                                    }

                                    else {

                                        reject(
                                            new Error(
                                                "JPG 변환 실패"
                                            )
                                        );

                                    }

                                },
                                "image/jpeg",
                                quality
                            );

                        };


                    image.src =
                        reader.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/*==================================================
BLOB TO DATA URL
==================================================*/

function blobToDataUrl(blob) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                blob
            );

        }
    );

}


/*==================================================
STORE IMAGE
==================================================*/

async function storeImage(
    file,
    prefix = "image",
    maxWidth = 1400,
    quality = 0.82
) {

    try {

        const blob =
            await compressImage(
                file,
                maxWidth,
                quality
            );


        if (
            fb
            &&
            churchId
            &&
            fb.storage
            &&
            fb.ref
            &&
            fb.uploadBytes
            &&
            fb.getDownloadURL
        ) {

            const path =
                `churches/${churchId}/churchmain/${Date.now()}_${prefix}.jpg`;


            const storageRef =
                fb.ref(
                    fb.storage,
                    path
                );


            await fb.uploadBytes(
                storageRef,
                blob,
                {
                    contentType:
                        "image/jpeg"
                }
            );


            return await fb.getDownloadURL(
                storageRef
            );

        }


        return await blobToDataUrl(
            blob
        );

    }

    catch (error) {

        console.warn(
            "이미지 저장 실패",
            error
        );


        showToast(
            "이미지 저장에 실패했습니다."
        );


        return "";

    }

}


/*==================================================
CREATE MODAL
==================================================*/

function createModal(
    title,
    wide = false
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "js-modal-overlay";


    overlay.innerHTML = `

        <section
            class="js-modal-card ${wide ? "js-wide" : ""}"
        >

            <header class="js-modal-head">

                <h2>
                    ${escapeHtml(title)}
                </h2>

                <button
                    type="button"
                    class="js-modal-close"
                >
                    ×
                </button>

            </header>

            <div class="js-modal-body">
            </div>

        </section>

    `;


    document.body.appendChild(
        overlay
    );


    document.body.style.overflow =
        "hidden";


    overlay.querySelector(
        ".js-modal-close"
    )
    .onclick =
        () => {

            removeModal(
                overlay
            );

        };


    overlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target
                ===
                overlay
            ) {

                removeModal(
                    overlay
                );

            }

        }
    );


    return overlay;

}


/*==================================================
REMOVE MODAL
==================================================*/

function removeModal(modal) {

    if (!modal) {

        return;

    }


    modal.remove();


    if (
        !document.querySelector(
            ".js-modal-overlay"
        )
        &&
        $$(".church-overlay:not(.hidden)")
            .length === 0
    ) {

        document.body.style.overflow =
            "";

    }

}


/*==================================================
OVERLAY BACKGROUND CLOSE
==================================================*/

function bindOverlayClose() {

    [

        "heroFullOverlay",
        "pastorGreetingOverlay",
        "weeklySermonOverlay",
        "materialViewOverlay",
        "bulletinOfferingOverlay",
        "offeringCopyNoticeOverlay"

    ]
    .forEach(
        (id) => {

            $(id)
                ?.addEventListener(
                    "click",
                    (event) => {

                        if (
                            event.target.id
                            ===
                            id
                        ) {

                            closeOverlay(
                                id
                            );

                        }

                    }
                );

        }
    );

}


/*==================================================
ESC CLOSE
==================================================*/

function bindEsc() {

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key
                !==
                "Escape"
            ) {

                return;

            }


            const modal =
                document.querySelector(
                    ".js-modal-overlay"
                );


            if (modal) {

                removeModal(
                    modal
                );


                return;

            }


            const openOverlayEl =
                $$(".church-overlay:not(.hidden)")[0];


            if (
                openOverlayEl
            ) {

                closeOverlay(
                    openOverlayEl.id
                );

            }

        }
    );

}


/*==================================================
END
==================================================*/