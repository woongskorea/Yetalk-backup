/*==================================================
YETALK CHURCHMAIN.JS

교회 메인 화면

1. 예톡교회 모델하우스 기본자료
2. 교회별 정보 불러오기
3. 예톡 전체 공통설정 불러오기
4. 대표 이미지 자동 변경
5. 분위기 변경
6. 주요 메뉴 이동
7. 예배중 표시
8. 최근 주일설교 / 실시간 예배 전환
9. 최근공지 / 긴급공지
10. 담임목사 오늘의 말씀 팝업
11. 헌금 계좌번호 복사
12. 하단 고정메뉴
13. 교회 관리자 버튼
==================================================*/


/*==================================================
Firebase 연결

기존 assets/firebase.js를 사용합니다.

firebase.js에 db, auth가 있으면 Firestore를 사용하고,
아직 연결되지 않았거나 오류가 있어도 기본 화면은 표시됩니다.
==================================================*/

let firebaseModule = {};
let firestoreModule = {};

try {

    firebaseModule = await import("../firebase.js");

} catch (error) {

    console.warn(
        "firebase.js 연결 실패:",
        error
    );

}


try {

    firestoreModule = await import(
        "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"
    );

} catch (error) {

    console.warn(
        "Firestore 모듈 연결 실패:",
        error
    );

}


const db = firebaseModule.db || null;
const auth = firebaseModule.auth || null;


const {

    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit

} = firestoreModule;


/*==================================================
기본 설정
==================================================*/

const DEFAULT_CHURCH_ID = "yetalk-church";

const HERO_CHANGE_TIME = 6000;

const THEME_STORAGE_KEY = "churchMainTheme";

const PASTOR_POPUP_STORAGE_KEY =
    "churchPastorWordPopup";

const CHURCH_LOCAL_DATA_PREFIX =
    "churchMainData_";


/*==================================================
현재 교회와 로그인 회원
==================================================*/

const currentChurchId = getCurrentChurchId();

const currentUser = getCurrentUser();


/*==================================================
예톡교회 모델하우스 기본자료

새 교회가 처음 개설되면 이 형식을 기준으로 시작합니다.
각 교회 관리자가 자기 교회 정보로 바꾸게 됩니다.
==================================================*/

const DEFAULT_CHURCH_DATA = {

    churchId: DEFAULT_CHURCH_ID,

    churchName: "예톡교회",

    englishName: "YETALK CHURCH",

    welcomeMessage:
        "오늘 우리 교회에 오신 여러분을 진심으로 환영합니다.",

    theme: "white",

    pastorName: "정찬석",

    pastorPhoto:
        "churchimages/pastor.jpg",

    pastorGreeting:
        "예수님의 사랑으로 여러분을 환영합니다.\n함께 신앙의 기쁨을 나누는 교회가 되겠습니다.",

    heroSlides: [

        {

            image:
                "churchimages/church-main-1.jpg",

            title:
                "하나님은\n사랑이시라",

            description:
                "사랑 안에서 서로 섬기는\n행복한 공동체",

            bible:
                "요한일서 4:8"

        },

        {

            image:
                "churchimages/church-main-2.jpg",

            title:
                "항상 기뻐하라",

            description:
                "기도하며 감사하는\n믿음의 공동체",

            bible:
                "데살로니가전서 5:16-18"

        },

        {

            image:
                "churchimages/church-main-3.jpg",

            title:
                "내가 너와\n함께 함이라",

            description:
                "두려워하지 말고\n믿음으로 나아갑니다",

            bible:
                "이사야 41:10"

        }

    ],

    sermon: {

        title:
            "믿음으로 사는 사람",

        bible:
            "히브리서 11:1-6",

        date:
            "2026-08-02",

        thumbnail:
            "churchimages/sermon-default.jpg",

        videoUrl:
            ""

    },

    worshipLive: {

        isLive:
            false,

        title:
            "지금 예배중입니다",

        bible:
            "",

        startText:
            "실시간 예배",

        thumbnail:
            "churchimages/worship-live.jpg",

        liveUrl:
            ""

    },

    giving: {

        owner:
            "예톡교회",

        description:
            "정성껏 드리는 예물은\n하나님 나라를 위해 사용됩니다.",

        bible:
            "하나님은 즐겨 내는 자를 사랑하시느니라. (고후 9:7)",

        accounts:
            []

    }

};


/*==================================================
예톡 전체 공통자료

교회 관리자가 수정하지 않습니다.

쿠팡 천국배송
베드로의 고백
예톡 전체 공통링크
==================================================*/

const DEFAULT_GLOBAL_DATA = {

    coupang: {

        enabled:
            true,

        subtitle:
            "예톡이 추천하는",

        description:
            "빠르고 편리한 믿음 있는 쇼핑!",

        url:
            ""

    },

    confession: {

        title:
            "베드로의 고백",

        url:
            "../chatword.html?room=confession"

    }

};


/*==================================================
메뉴 주소

화면이 아직 없는 메뉴는 추후 파일을 만든 뒤
이 주소만 변경하면 됩니다.
==================================================*/

const MENU_LINKS = {

    church:
        "churchintro.html",

    worship:
        "worship.html",

    notice:
        "../chatnotice.html",

    word:
        "../chatword.html",

    meetingPrayer:
        "../chatvoice.html",

    onlyJesus:
        "bible.html",

    mission:
        "../chattitle.html?category=mission",

    invite:
        "../invite.html",

    nextGeneration:
        "../chattitle.html?category=nextGeneration",

    archive:
        "../chattitle.html",

    testimony:
        "../chattitle.html?category=testimony",

    location:
        "churchintro.html#location",

    newcomer:
        "../join.html?type=newcomer",

    gallery:
        "../chattitle.html?category=churchGallery",

    introduction:
        "churchintro.html"

};


/*==================================================
DOM
==================================================*/

const churchPage =
    document.getElementById("churchPage");

const churchLogoBtn =
    document.getElementById("churchLogoBtn");

const headerChurchName =
    document.getElementById("headerChurchName");

const themeBtn =
    document.getElementById("themeBtn");

const themeMenu =
    document.getElementById("themeMenu");

const imageManageBtn =
    document.getElementById("imageManageBtn");

const churchAdminBtn =
    document.getElementById("churchAdminBtn");


const heroImage =
    document.getElementById("heroImage");

const heroTitle =
    document.getElementById("heroTitle");

const heroDescription =
    document.getElementById("heroDescription");

const heroBible =
    document.getElementById("heroBible");

const heroPrevBtn =
    document.getElementById("heroPrevBtn");

const heroNextBtn =
    document.getElementById("heroNextBtn");

const heroDots =
    document.getElementById("heroDots");


const welcomeMessageBtn =
    document.getElementById("welcomeMessageBtn");

const welcomeMessage =
    document.getElementById("welcomeMessage");


const churchMenuGrid =
    document.getElementById("churchMenuGrid");

const worshipLiveBadge =
    document.getElementById("worshipLiveBadge");

const noticeBadge =
    document.getElementById("noticeBadge");


const pastorPhoto =
    document.getElementById("pastorPhoto");

const pastorGreeting =
    document.getElementById("pastorGreeting");

const pastorDisplayName =
    document.getElementById("pastorDisplayName");

const pastorGreetingMoreBtn =
    document.getElementById("pastorGreetingMoreBtn");


const sermonCardTitle =
    document.getElementById("sermonCardTitle");

const sermonLiveLabel =
    document.getElementById("sermonLiveLabel");

const sermonMoreBtn =
    document.getElementById("sermonMoreBtn");

const sermonVideoBtn =
    document.getElementById("sermonVideoBtn");

const sermonThumbnail =
    document.getElementById("sermonThumbnail");

const sermonTitle =
    document.getElementById("sermonTitle");

const sermonBible =
    document.getElementById("sermonBible");

const sermonDate =
    document.getElementById("sermonDate");

const sermonWatchBtn =
    document.getElementById("sermonWatchBtn");

const sermonWatchText =
    document.getElementById("sermonWatchText");


const scrollToSecondBtn =
    document.getElementById("scrollToSecondBtn");

const secondScreen =
    document.getElementById("secondScreen");


const recentNoticeList =
    document.getElementById("recentNoticeList");

const urgentNoticeList =
    document.getElementById("urgentNoticeList");

const recentNoticeMoreBtn =
    document.getElementById("recentNoticeMoreBtn");

const urgentNoticeMoreBtn =
    document.getElementById("urgentNoticeMoreBtn");


const churchShortcutGrid =
    document.getElementById("churchShortcutGrid");


const coupangBanner =
    document.getElementById("coupangBanner");

const coupangSubtitle =
    document.getElementById("coupangSubtitle");

const coupangDescription =
    document.getElementById("coupangDescription");

const coupangBtn =
    document.getElementById("coupangBtn");


const givingSection =
    document.getElementById("givingSection");

const givingDescription =
    document.getElementById("givingDescription");

const givingOwner =
    document.getElementById("givingOwner");

const givingAccountList =
    document.getElementById("givingAccountList");

const givingBible =
    document.getElementById("givingBible");


const bottomHomeBtn =
    document.getElementById("bottomHomeBtn");

const bottomNewcomerBtn =
    document.getElementById("bottomNewcomerBtn");

const bottomConfessionBtn =
    document.getElementById("bottomConfessionBtn");

const bottomGivingBtn =
    document.getElementById("bottomGivingBtn");

const bottomMyInfoBtn =
    document.getElementById("bottomMyInfoBtn");


const pastorWordOverlay =
    document.getElementById("pastorWordOverlay");

const pastorWordCloseBtn =
    document.getElementById("pastorWordCloseBtn");

const pastorWordTodayCloseBtn =
    document.getElementById("pastorWordTodayCloseBtn");

const pastorWordArchiveBtn =
    document.getElementById("pastorWordArchiveBtn");

const pastorWordPopupTitle =
    document.getElementById("pastorWordPopupTitle");

const pastorWordBible =
    document.getElementById("pastorWordBible");

const pastorWordContent =
    document.getElementById("pastorWordContent");

const pastorWordDate =
    document.getElementById("pastorWordDate");

const pastorWordWriter =
    document.getElementById("pastorWordWriter");


const churchToast =
    document.getElementById("churchToast");


/*==================================================
상태
==================================================*/

let currentChurchData =
    cloneObject(DEFAULT_CHURCH_DATA);

let currentGlobalData =
    cloneObject(DEFAULT_GLOBAL_DATA);

let heroSlides =
    [...DEFAULT_CHURCH_DATA.heroSlides];

let currentHeroIndex =
    0;

let heroTimer =
    null;

let toastTimer =
    null;

let currentPastorWord =
    null;


/*==================================================
초기 실행
==================================================*/

async function initializeChurchMain() {

    bindEvents();

    bindImageErrorFallback();

    applySavedTheme();

    applyChurchData(
        currentChurchData
    );

    applyGlobalData(
        currentGlobalData
    );

    setAdminVisibility();

    startHeroAutoPlay();


    await Promise.allSettled([

        loadChurchData(),

        loadGlobalData(),

        loadChurchNotices(),

        loadPastorWord()

    ]);

}


/*==================================================
현재 교회 ID
==================================================*/

function getCurrentChurchId() {

    const searchParams =
        new URLSearchParams(
            window.location.search
        );


    const queryChurchId =
        cleanText(
            searchParams.get("churchId")
        );


    if (queryChurchId) {

        localStorage.setItem(
            "currentChurchId",
            queryChurchId
        );


        return queryChurchId;

    }


    const storageKeys = [

        "currentChurchId",
        "selectedChurchId",
        "myChurchId",
        "churchId"

    ];


    for (const key of storageKeys) {

        const value =
            cleanText(
                localStorage.getItem(key)
            );


        if (value) {

            return value;

        }

    }


    return DEFAULT_CHURCH_ID;

}


/*==================================================
현재 회원
==================================================*/

function getCurrentUser() {

    const storageKeys = [

        "loginUser",
        "currentUser",
        "yetalkUser",
        "memberInfo"

    ];


    for (const key of storageKeys) {

        const value =
            localStorage.getItem(key);


        if (!value) {

            continue;

        }


        try {

            const parsed =
                JSON.parse(value);


            if (
                parsed &&
                typeof parsed === "object"
            ) {

                return parsed;

            }

        } catch (error) {

            console.warn(
                `${key} 회원정보 읽기 실패:`,
                error
            );

        }

    }


    return null;

}


/*==================================================
교회 관리자 권한
==================================================*/

function canManageChurch() {

    if (!currentUser) {

        return false;

    }


    const role =
        cleanText(

            currentUser.role ||
            currentUser.memberRole ||
            currentUser.grade ||
            currentUser.levelName

        ).toLowerCase();


    const level =
        Number(

            currentUser.level ||
            currentUser.memberLevel ||
            currentUser.gradeLevel ||
            0

        );


    const managerRoles = [

        "master",
        "admin",
        "churchadmin",
        "church_admin",
        "pastor",
        "seniorpastor",
        "host",
        "leader",
        "담임목사",
        "관리자",
        "방장",
        "예톡3"

    ];


    return (

        currentUser.isAdmin === true ||

        currentUser.isChurchAdmin === true ||

        managerRoles.includes(role) ||

        level >= 6

    );

}


/*==================================================
관리자 버튼 표시
==================================================*/

function setAdminVisibility() {

    const isManager =
        canManageChurch();


    document
        .querySelectorAll(".admin-only")
        .forEach(element => {

            element.classList.toggle(
                "hidden",
                !isManager
            );

        });

}


/*==================================================
교회별 자료 불러오기
==================================================*/

async function loadChurchData() {

    const localData =
        loadLocalChurchData();


    if (localData) {

        currentChurchData =
            mergeChurchData(
                DEFAULT_CHURCH_DATA,
                localData
            );


        applyChurchData(
            currentChurchData
        );

    }


    if (
        !db ||
        !doc ||
        !getDoc
    ) {

        return;

    }


    const candidatePaths = [

        [
            "churchHomes",
            currentChurchId
        ],

        [
            "churches",
            currentChurchId,
            "settings",
            "home"
        ],

        [
            "churches",
            currentChurchId
        ]

    ];


    for (const pathParts of candidatePaths) {

        try {

            const snapshot =
                await getDoc(
                    doc(
                        db,
                        ...pathParts
                    )
                );


            if (!snapshot.exists()) {

                continue;

            }


            const loadedData = {

                id:
                    snapshot.id,

                ...snapshot.data()

            };


            currentChurchData =
                mergeChurchData(
                    DEFAULT_CHURCH_DATA,
                    loadedData
                );


            applyChurchData(
                currentChurchData
            );


            saveLocalChurchData(
                currentChurchData
            );


            return;

        } catch (error) {

            console.warn(
                "교회 자료 경로 확인 실패:",
                pathParts,
                error
            );

        }

    }

}


/*==================================================
예톡 전체 공통자료 불러오기
==================================================*/

async function loadGlobalData() {

    if (
        !db ||
        !doc ||
        !getDoc
    ) {

        return;

    }


    const candidatePaths = [

        [
            "appSettings",
            "global"
        ],

        [
            "yetalkSettings",
            "global"
        ],

        [
            "serviceSettings",
            "global"
        ]

    ];


    for (const pathParts of candidatePaths) {

        try {

            const snapshot =
                await getDoc(
                    doc(
                        db,
                        ...pathParts
                    )
                );


            if (!snapshot.exists()) {

                continue;

            }


            const loadedData =
                snapshot.data();


            currentGlobalData = {

                ...DEFAULT_GLOBAL_DATA,

                ...loadedData,

                coupang: {

                    ...DEFAULT_GLOBAL_DATA.coupang,

                    ...(loadedData.coupang || {})

                },

                confession: {

                    ...DEFAULT_GLOBAL_DATA.confession,

                    ...(loadedData.confession || {})

                }

            };


            applyGlobalData(
                currentGlobalData
            );


            return;

        } catch (error) {

            console.warn(
                "예톡 공통설정 경로 확인 실패:",
                pathParts,
                error
            );

        }

    }

}


/*==================================================
교회 자료 합치기
==================================================*/

function mergeChurchData(
    baseData,
    loadedData
) {

    const loadedSlides =
        Array.isArray(
            loadedData.heroSlides
        )
            ? loadedData.heroSlides
            : [];


    const loadedSermon =
        loadedData.sermon ||
        {};


    const loadedWorshipLive =
        loadedData.worshipLive ||
        {};


    const loadedGiving =
        loadedData.giving ||
        {};


    return {

        ...baseData,

        ...loadedData,

        heroSlides:
            loadedSlides.length > 0
                ? loadedSlides
                : baseData.heroSlides,

        sermon: {

            ...baseData.sermon,

            ...loadedSermon

        },

        worshipLive: {

            ...baseData.worshipLive,

            ...loadedWorshipLive

        },

        giving: {

            ...baseData.giving,

            ...loadedGiving,

            accounts:
                Array.isArray(
                    loadedGiving.accounts
                )
                    ? loadedGiving.accounts
                    : baseData.giving.accounts

        }

    };

}


/*==================================================
교회 자료 화면 적용
==================================================*/

function applyChurchData(data) {

    if (headerChurchName) {

        headerChurchName.textContent =

            cleanText(
                data.churchName
            ) ||

            DEFAULT_CHURCH_DATA.churchName;

    }


    if (welcomeMessage) {

        welcomeMessage.textContent =

            cleanText(
                data.welcomeMessage
            ) ||

            DEFAULT_CHURCH_DATA.welcomeMessage;

    }


    if (pastorPhoto) {

        pastorPhoto.src =

            cleanText(
                data.pastorPhoto
            ) ||

            DEFAULT_CHURCH_DATA.pastorPhoto;

    }


    if (pastorGreeting) {

        pastorGreeting.innerHTML =

            escapeHTML(

                cleanText(
                    data.pastorGreeting
                ) ||

                DEFAULT_CHURCH_DATA.pastorGreeting

            ).replace(
                /\n/g,
                "<br>"
            );

    }


    if (pastorDisplayName) {

        pastorDisplayName.textContent =

            "담임목사 " +

            (
                cleanText(
                    data.pastorName
                ) ||

                DEFAULT_CHURCH_DATA.pastorName
            );

    }


    heroSlides =
        normalizeHeroSlides(
            data.heroSlides
        );


    currentHeroIndex = 0;

    createHeroDots();

    showHeroSlide(0);


    renderGivingData(
        data.giving
    );


    applyWorshipMode(
        data
    );


    if (data.theme) {

        applyTheme(
            data.theme,
            false
        );

    }

}


/*==================================================
예톡 공통자료 화면 적용
==================================================*/

function applyGlobalData(data) {

    const coupang =
        data.coupang ||
        DEFAULT_GLOBAL_DATA.coupang;


    if (coupangBanner) {

        coupangBanner.classList.toggle(
            "hidden",
            coupang.enabled === false
        );

    }


    if (coupangSubtitle) {

        coupangSubtitle.textContent =

            cleanText(
                coupang.subtitle
            ) ||

            DEFAULT_GLOBAL_DATA.coupang.subtitle;

    }


    if (coupangDescription) {

        coupangDescription.textContent =

            cleanText(
                coupang.description
            ) ||

            DEFAULT_GLOBAL_DATA.coupang.description;

    }

}


/*==================================================
예배중 / 최근 주일설교 전환
==================================================*/

function applyWorshipMode(data) {

    const liveData =
        data.worshipLive ||
        DEFAULT_CHURCH_DATA.worshipLive;


    const sermonData =
        data.sermon ||
        DEFAULT_CHURCH_DATA.sermon;


    const isLive =
        liveData.isLive === true;


    worshipLiveBadge?.classList.toggle(
        "hidden",
        !isLive
    );


    sermonLiveLabel?.classList.toggle(
        "hidden",
        !isLive
    );


    if (isLive) {

        if (sermonCardTitle) {

            sermonCardTitle.textContent =
                "실시간 예배";

        }


        if (sermonThumbnail) {

            sermonThumbnail.src =

                cleanText(
                    liveData.thumbnail
                ) ||

                sermonData.thumbnail ||

                DEFAULT_CHURCH_DATA.worshipLive.thumbnail;

        }


        if (sermonTitle) {

            sermonTitle.textContent =

                cleanText(
                    liveData.title
                ) ||

                "지금 예배중입니다";

        }


        if (sermonBible) {

            sermonBible.textContent =

                cleanText(
                    liveData.bible
                ) ||

                "함께 예배드리겠습니다.";

        }


        if (sermonDate) {

            sermonDate.textContent =

                cleanText(
                    liveData.startText
                ) ||

                "실시간 예배";

        }


        if (sermonWatchText) {

            sermonWatchText.textContent =
                "예배드리기";

        }


        return;

    }


    if (sermonCardTitle) {

        sermonCardTitle.textContent =
            "최근 주일설교";

    }


    if (sermonThumbnail) {

        sermonThumbnail.src =

            cleanText(
                sermonData.thumbnail
            ) ||

            DEFAULT_CHURCH_DATA.sermon.thumbnail;

    }


    if (sermonTitle) {

        sermonTitle.textContent =

            cleanText(
                sermonData.title
            ) ||

            DEFAULT_CHURCH_DATA.sermon.title;

    }


    if (sermonBible) {

        sermonBible.textContent =

            cleanText(
                sermonData.bible
            ) ||

            DEFAULT_CHURCH_DATA.sermon.bible;

    }


    if (sermonDate) {

        sermonDate.textContent =
            formatDateDisplay(
                sermonData.date
            );

    }


    if (sermonWatchText) {

        sermonWatchText.textContent =
            "설교 영상 보러가기";

    }

}


/*==================================================
현재 표시할 영상 주소
==================================================*/

function getCurrentVideoUrl() {

    const liveData =
        currentChurchData.worshipLive ||
        {};


    if (
        liveData.isLive === true
    ) {

        return normalizeExternalUrl(
            liveData.liveUrl
        );

    }


    return normalizeExternalUrl(
        currentChurchData.sermon?.videoUrl
    );

}


/*==================================================
대표 이미지 정리
==================================================*/

function normalizeHeroSlides(slides) {

    if (!Array.isArray(slides)) {

        return [
            ...DEFAULT_CHURCH_DATA.heroSlides
        ];

    }


    const normalized =
        slides
            .map(slide => ({

                image:
                    cleanText(
                        slide?.image ||
                        slide?.imageUrl
                    ),

                title:
                    cleanText(
                        slide?.title
                    ),

                description:
                    cleanText(
                        slide?.description ||
                        slide?.subtitle
                    ),

                bible:
                    cleanText(
                        slide?.bible ||
                        slide?.bibleVerse
                    )

            }))
            .filter(slide =>
                Boolean(slide.image)
            );


    return normalized.length > 0
        ? normalized
        : [
            ...DEFAULT_CHURCH_DATA.heroSlides
        ];

}


/*==================================================
대표 이미지 점 생성
==================================================*/

function createHeroDots() {

    if (!heroDots) {

        return;

    }


    heroDots.innerHTML = "";


    heroSlides.forEach(
        (
            slide,
            index
        ) => {

            const dot =
                document.createElement(
                    "button"
                );


            dot.type =
                "button";


            dot.className =
                "hero-dot";


            dot.setAttribute(
                "aria-label",
                `${index + 1}번째 대표 이미지`
            );


            dot.addEventListener(
                "click",
                () => {

                    showHeroSlide(index);

                    restartHeroAutoPlay();

                }
            );


            heroDots.appendChild(dot);

        }
    );

}


/*==================================================
대표 이미지 표시
==================================================*/

function showHeroSlide(index) {

    if (heroSlides.length === 0) {

        return;

    }


    currentHeroIndex =

        (
            index +
            heroSlides.length
        ) %

        heroSlides.length;


    const slide =
        heroSlides[currentHeroIndex];


    if (heroImage) {

        heroImage.style.opacity =
            "0.3";


        window.setTimeout(
            () => {

                heroImage.src =
                    slide.image;


                heroImage.alt =
                    slide.title ||
                    "교회 대표 이미지";


                heroImage.style.opacity =
                    "1";

            },
            120
        );

    }


    if (heroTitle) {

        heroTitle.innerHTML =

            escapeHTML(
                slide.title
            ).replace(
                /\n/g,
                "<br>"
            );

    }


    if (heroDescription) {

        heroDescription.innerHTML =

            escapeHTML(
                slide.description
            ).replace(
                /\n/g,
                "<br>"
            );

    }


    if (heroBible) {

        heroBible.textContent =
            slide.bible;

    }


    heroDots
        ?.querySelectorAll(
            ".hero-dot"
        )
        .forEach(
            (
                dot,
                dotIndex
            ) => {

                dot.classList.toggle(
                    "active",
                    dotIndex === currentHeroIndex
                );

            }
        );

}


/*==================================================
대표 이미지 자동 변경
==================================================*/

function startHeroAutoPlay() {

    stopHeroAutoPlay();


    if (heroSlides.length <= 1) {

        return;

    }


    heroTimer =
        window.setInterval(
            () => {

                showHeroSlide(
                    currentHeroIndex + 1
                );

            },
            HERO_CHANGE_TIME
        );

}


function stopHeroAutoPlay() {

    if (!heroTimer) {

        return;

    }


    window.clearInterval(
        heroTimer
    );


    heroTimer = null;

}


function restartHeroAutoPlay() {

    startHeroAutoPlay();

}


/*==================================================
헌금 자료 출력
==================================================*/

function renderGivingData(givingData) {

    const giving = {

        ...DEFAULT_CHURCH_DATA.giving,

        ...(givingData || {})

    };


    if (givingOwner) {

        givingOwner.textContent =

            cleanText(
                giving.owner
            ) ||

            cleanText(
                currentChurchData.churchName
            ) ||

            "우리교회";

    }


    if (givingDescription) {

        givingDescription.innerHTML =

            escapeHTML(
                giving.description
            ).replace(
                /\n/g,
                "<br>"
            );

    }


    if (givingBible) {

        givingBible.textContent =
            giving.bible ||
            DEFAULT_CHURCH_DATA.giving.bible;

    }


    renderGivingAccounts(
        giving.accounts
    );

}


/*==================================================
헌금 계좌 출력
==================================================*/

function renderGivingAccounts(accounts) {

    if (!givingAccountList) {

        return;

    }


    givingAccountList.innerHTML = "";


    if (
        !Array.isArray(accounts) ||
        accounts.length === 0
    ) {

        const emptyRow =
            document.createElement("div");


        emptyRow.className =
            "giving-account-row";


        emptyRow.innerHTML = `

            <span class="giving-bank-name">
                계좌 안내
            </span>

            <strong class="giving-account-number">
                교회 관리자가 등록하면 표시됩니다.
            </strong>

        `;


        givingAccountList.appendChild(
            emptyRow
        );


        return;

    }


    accounts
        .slice(0, 4)
        .forEach(
            (
                account,
                index
            ) => {

                const row =
                    document.createElement("div");


                row.className =
                    "giving-account-row";


                const bank =
                    document.createElement("span");


                bank.className =
                    "giving-bank-name";


                bank.textContent =

                    cleanText(
                        account.bank ||
                        account.bankName
                    ) ||

                    "은행";


                const number =
                    document.createElement("strong");


                number.className =
                    "giving-account-number";


                number.id =
                    `givingAccount${index + 1}`;


                number.textContent =

                    cleanText(
                        account.account ||
                        account.accountNumber
                    );


                const copyButton =
                    document.createElement("button");


                copyButton.type =
                    "button";


                copyButton.className =
                    "account-copy-btn";


                copyButton.textContent =
                    "복사";


                copyButton.addEventListener(
                    "click",
                    () => {

                        copyAccountNumber(
                            number.textContent
                        );

                    }
                );


                row.append(
                    bank,
                    number,
                    copyButton
                );


                givingAccountList.appendChild(
                    row
                );

            }
        );

}


/*==================================================
계좌번호 복사
==================================================*/

async function copyAccountNumber(value) {

    const accountNumber =
        cleanText(value);


    if (!accountNumber) {

        showToast(
            "복사할 계좌번호가 없습니다."
        );


        return;

    }


    try {

        await navigator.clipboard.writeText(
            accountNumber
        );


        showToast(
            "계좌번호가 복사되었습니다."
        );

    } catch (error) {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            accountNumber;


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


        showToast(
            "계좌번호가 복사되었습니다."
        );

    }

}


/*==================================================
공지 불러오기

chatnotice에서 저장한 교회공지 중
최근공지 3개와 긴급공지 3개를 표시합니다.
==================================================*/

async function loadChurchNotices() {

    if (
        !db ||
        !collection ||
        !getDocs
    ) {

        renderNoticeLists(
            [],
            []
        );


        return;

    }


    const candidateCollections = [

        "churchNotices",
        "churchBoards",
        "notices"

    ];


    for (
        const collectionName of
        candidateCollections
    ) {

        try {

            const reference =
                collection(
                    db,
                    collectionName
                );


            let snapshot;


            try {

                snapshot =
                    await getDocs(

                        query(

                            reference,

                            where(
                                "churchId",
                                "==",
                                currentChurchId
                            ),

                            orderBy(
                                "createdAtMs",
                                "desc"
                            ),

                            limit(30)

                        )

                    );

            } catch (queryError) {

                snapshot =
                    await getDocs(reference);

            }


            const posts = [];


            snapshot.forEach(
                item => {

                    const data =
                        item.data();


                    if (
                        cleanText(data.churchId) !==
                        currentChurchId
                    ) {

                        return;

                    }


                    if (
                        data.deleted === true ||
                        data.status === "deleted"
                    ) {

                        return;

                    }


                    posts.push({

                        id:
                            item.id,

                        ...data

                    });

                }
            );


            if (posts.length === 0) {

                continue;

            }


            posts.sort(
                (
                    first,
                    second
                ) =>
                    getPostTime(second) -
                    getPostTime(first)
            );


            const visiblePosts =
                posts.filter(
                    isVisibleNotice
                );


            const urgentPosts =
                visiblePosts
                    .filter(
                        isUrgentNotice
                    )
                    .slice(0, 3);


            const recentPosts =
                visiblePosts
                    .filter(
                        post =>
                            !isUrgentNotice(post)
                    )
                    .slice(0, 3);


            renderNoticeLists(
                recentPosts,
                urgentPosts
            );


            updateNoticeBadge(
                visiblePosts.length
            );


            return;

        } catch (error) {

            console.warn(
                `${collectionName} 공지 확인 실패:`,
                error
            );

        }

    }


    renderNoticeLists(
        [],
        []
    );

}


/*==================================================
공지 표시 여부
==================================================*/

function isVisibleNotice(post) {

    if (
        post.showInNotice === false ||
        post.showOnHome === false
    ) {

        return false;

    }


    const today =
        getTodayKey();


    const publishDate =
        cleanText(
            post.publishDate
        );


    if (
        publishDate &&
        publishDate > today
    ) {

        return false;

    }


    const expireDate =
        cleanText(
            post.expireDate
        );


    if (
        expireDate &&
        expireDate < today &&
        post.permanent !== true
    ) {

        return false;

    }


    return true;

}


/*==================================================
긴급공지 판별
==================================================*/

function isUrgentNotice(post) {

    if (
        post.urgent === true ||
        post.isUrgent === true ||
        post.emergency === true
    ) {

        return true;

    }


    const comparisonText = [

        post.type,
        post.noticeType,
        post.category,
        post.categoryName,
        post.title

    ]
        .map(cleanText)
        .join(" ")
        .toLowerCase();


    return (

        comparisonText.includes("긴급") ||

        comparisonText.includes("urgent") ||

        comparisonText.includes("emergency")

    );

}


/*==================================================
공지 목록 출력
==================================================*/

function renderNoticeLists(
    recentPosts,
    urgentPosts
) {

    renderNoticeList(

        recentNoticeList,

        recentPosts,

        false,

        "등록된 최근 공지가 없습니다.",

        "교회 관리자가 공지를 등록하면 이곳에 표시됩니다."

    );


    renderNoticeList(

        urgentNoticeList,

        urgentPosts,

        true,

        "현재 긴급 공지가 없습니다.",

        "긴급한 교회 소식이 등록되면 이곳에 표시됩니다."

    );

}


/*==================================================
공지 한 목록 출력
==================================================*/

function renderNoticeList(
    container,
    posts,
    urgent,
    emptyTitle,
    emptyDescription
) {

    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        !Array.isArray(posts) ||
        posts.length === 0
    ) {

        container.appendChild(

            createNoticeElement(

                {

                    title:
                        emptyTitle,

                    content:
                        emptyDescription

                },

                0,

                urgent,

                true

            )

        );


        return;

    }


    posts.forEach(
        (
            post,
            index
        ) => {

            container.appendChild(

                createNoticeElement(

                    post,

                    index,

                    urgent,

                    false

                )

            );

        }
    );

}


/*==================================================
공지 한 줄 생성
==================================================*/

function createNoticeElement(
    post,
    index,
    urgent,
    isEmpty
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "notice-row";


    const number =
        document.createElement(
            "span"
        );


    number.className =
        urgent
            ? "notice-number urgent"
            : "notice-number";


    number.textContent =
        String(index + 1);


    const contentArea =
        document.createElement(
            "div"
        );


    contentArea.className =
        "notice-content";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =

        cleanText(
            post.title
        ) ||

        "제목 없음";


    const summary =
        document.createElement(
            "p"
        );


    summary.textContent =
        makeNoticeSummary(
            post.content ||
            post.description
        );


    contentArea.append(
        title,
        summary
    );


    article.append(
        number,
        contentArea
    );


    if (
        !isEmpty &&
        post.id
    ) {

        article.tabIndex = 0;

        article.setAttribute(
            "role",
            "button"
        );


        article.addEventListener(
            "click",
            () => {

                openNoticeDetail(post);

            }
        );


        article.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openNoticeDetail(post);

                }

            }
        );

    }


    return article;

}


/*==================================================
공지 요약
==================================================*/

function makeNoticeSummary(value) {

    const text =
        cleanText(value)
            .replace(
                /\s+/g,
                " "
            );


    if (!text) {

        return "내용을 확인해 주세요.";

    }


    return text.length > 100
        ? `${text.slice(0, 100)}…`
        : text;

}


/*==================================================
공지 상세
==================================================*/

function openNoticeDetail(post) {

    if (!post?.id) {

        return;

    }


    window.location.href =

        "../chatnotice.html" +

        "?post=" +

        encodeURIComponent(
            post.id
        ) +

        "&churchId=" +

        encodeURIComponent(
            currentChurchId
        );

}


/*==================================================
공지 배지
==================================================*/

function updateNoticeBadge(count) {

    if (!noticeBadge) {

        return;

    }


    const safeCount =
        Math.max(
            0,
            Number(count) || 0
        );


    noticeBadge.textContent =
        safeCount > 99
            ? "99+"
            : String(safeCount);


    noticeBadge.classList.toggle(
        "hidden",
        safeCount === 0
    );

}


/*==================================================
공지 시간
==================================================*/

function getPostTime(post) {

    const candidates = [

        post.createdAtMs,
        post.updatedAtMs,
        post.publishDateMs,
        post.createdAt?.toMillis?.(),
        post.updatedAt?.toMillis?.()

    ];


    for (const value of candidates) {

        const number =
            Number(value);


        if (
            Number.isFinite(number) &&
            number > 0
        ) {

            return number;

        }

    }


    return 0;

}


/*==================================================
담임목사 오늘의 말씀

오늘 글이 없더라도 가장 최근 글 1개를 팝업합니다.
==================================================*/

async function loadPastorWord() {

    if (
        !db ||
        !collection ||
        !getDocs
    ) {

        return;

    }


    const candidateCollections = [

        "churchPastorMessages",
        "churchPastorMessage",
        "pastorMessages"

    ];


    for (
        const collectionName of
        candidateCollections
    ) {

        try {

            const reference =
                collection(
                    db,
                    collectionName
                );


            let snapshot;


            try {

                snapshot =
                    await getDocs(

                        query(

                            reference,

                            where(
                                "churchId",
                                "==",
                                currentChurchId
                            ),

                            orderBy(
                                "publishDateMs",
                                "desc"
                            ),

                            limit(10)

                        )

                    );

            } catch (queryError) {

                snapshot =
                    await getDocs(reference);

            }


            const messages = [];


            snapshot.forEach(
                item => {

                    const data =
                        item.data();


                    if (
                        cleanText(data.churchId) !==
                        currentChurchId
                    ) {

                        return;

                    }


                    if (
                        data.deleted === true ||
                        data.status === "deleted"
                    ) {

                        return;

                    }


                    messages.push({

                        id:
                            item.id,

                        ...data

                    });

                }
            );


            messages.sort(
                (
                    first,
                    second
                ) =>
                    getPastorWordTime(second) -
                    getPastorWordTime(first)
            );


            if (messages.length === 0) {

                continue;

            }


            currentPastorWord =
                messages[0];


            showPastorWordPopupIfNeeded(
                currentPastorWord
            );


            return;

        } catch (error) {

            console.warn(
                `${collectionName} 담임목사 말씀 확인 실패:`,
                error
            );

        }

    }

}


/*==================================================
담임목사 말씀 시간
==================================================*/

function getPastorWordTime(message) {

    const candidates = [

        message.publishDateMs,
        message.createdAtMs,
        message.updatedAtMs,
        message.createdAt?.toMillis?.(),
        message.updatedAt?.toMillis?.()

    ];


    for (const value of candidates) {

        const number =
            Number(value);


        if (
            Number.isFinite(number) &&
            number > 0
        ) {

            return number;

        }

    }


    return 0;

}


/*==================================================
담임목사 말씀 팝업
==================================================*/

function showPastorWordPopupIfNeeded(message) {

    if (
        !message ||
        !pastorWordOverlay
    ) {

        return;

    }


    const today =
        getTodayKey();


    const popupKey =

        `${currentChurchId}_${message.id}_${today}`;


    const storedKey =
        localStorage.getItem(
            PASTOR_POPUP_STORAGE_KEY
        );


    if (storedKey === popupKey) {

        return;

    }


    if (pastorWordPopupTitle) {

        pastorWordPopupTitle.textContent =

            cleanText(
                message.title
            ) ||

            "담임목사 오늘의 말씀";

    }


    if (pastorWordBible) {

        pastorWordBible.textContent =

            cleanText(

                message.bibleVerse ||
                message.bible ||
                message.scripture

            );

    }


    if (pastorWordContent) {

        pastorWordContent.textContent =

            cleanText(

                message.content ||
                message.message

            );

    }


    if (pastorWordDate) {

        pastorWordDate.textContent =
            formatPastorWordDate(
                message
            );

    }


    if (pastorWordWriter) {

        pastorWordWriter.textContent =

            cleanText(
                message.writerName
            ) ||

            `담임목사 ${
                cleanText(
                    currentChurchData.pastorName
                ) ||
                "정찬석"
            }`;

    }


    pastorWordOverlay.dataset.popupKey =
        popupKey;


    window.setTimeout(
        () => {

            pastorWordOverlay.classList.remove(
                "hidden"
            );


            document.body.style.overflow =
                "hidden";

        },
        450
    );

}


/*==================================================
담임목사 말씀 날짜
==================================================*/

function formatPastorWordDate(message) {

    const publishDate =
        cleanText(
            message.publishDate
        );


    if (publishDate) {

        return publishDate.replace(
            /-/g,
            "."
        );

    }


    const time =
        getPastorWordTime(
            message
        );


    if (!time) {

        return "최근 말씀";

    }


    return new Intl.DateTimeFormat(
        "ko-KR",
        {

            year:
                "numeric",

            month:
                "2-digit",

            day:
                "2-digit"

        }
    ).format(
        new Date(time)
    );

}


/*==================================================
담임목사 말씀 닫기
==================================================*/

function closePastorWordPopup(
    closeForToday
) {

    if (!pastorWordOverlay) {

        return;

    }


    if (closeForToday) {

        const popupKey =
            cleanText(
                pastorWordOverlay.dataset.popupKey
            );


        if (popupKey) {

            localStorage.setItem(
                PASTOR_POPUP_STORAGE_KEY,
                popupKey
            );

        }

    }


    pastorWordOverlay.classList.add(
        "hidden"
    );


    document.body.style.overflow = "";

}


/*==================================================
분위기
==================================================*/

function applySavedTheme() {

    const savedTheme =
        cleanText(
            localStorage.getItem(
                THEME_STORAGE_KEY
            )
        ) ||
        "white";


    applyTheme(
        savedTheme,
        false
    );

}


function applyTheme(
    theme,
    save = true
) {

    if (!churchPage) {

        return;

    }


    const allowedThemes = [

        "white",
        "pink",
        "blue",
        "purple"

    ];


    const safeTheme =
        allowedThemes.includes(theme)
            ? theme
            : "white";


    allowedThemes.forEach(
        item => {

            churchPage.classList.remove(
                `theme-${item}`
            );

        }
    );


    churchPage.classList.add(
        `theme-${safeTheme}`
    );


    if (save) {

        localStorage.setItem(
            THEME_STORAGE_KEY,
            safeTheme
        );

    }

}


/*==================================================
메뉴 이동
==================================================*/

function moveToMenu(key) {

    const url =
        MENU_LINKS[key];


    if (!url) {

        showToast(
            "준비 중인 메뉴입니다."
        );


        return;

    }


    window.location.href =
        appendChurchId(url);

}


/*==================================================
교회 ID를 주소에 추가
==================================================*/

function appendChurchId(url) {

    if (!url) {

        return "";

    }


    if (
        url.startsWith("#") ||
        url.includes("#")
    ) {

        return url;

    }


    const separator =
        url.includes("?")
            ? "&"
            : "?";


    return (

        url +

        separator +

        "churchId=" +

        encodeURIComponent(
            currentChurchId
        )

    );

}


/*==================================================
교회 관리자 열기
==================================================*/

function openChurchAdmin(section) {

    if (!canManageChurch()) {

        showToast(
            "교회 관리자만 이용할 수 있습니다."
        );


        return;

    }


    window.location.href =

        "churchadmin.html" +

        "?churchId=" +

        encodeURIComponent(
            currentChurchId
        ) +

        "&section=" +

        encodeURIComponent(
            section
        );

}


/*==================================================
설교 또는 실시간 예배 열기
==================================================*/

function openCurrentVideo() {

    const videoUrl =
        getCurrentVideoUrl();


    if (!videoUrl) {

        const isLive =
            currentChurchData
                .worshipLive
                ?.isLive === true;


        showToast(

            isLive

                ? "실시간 예배 주소가 아직 등록되지 않았습니다."

                : "최근 설교 영상이 아직 등록되지 않았습니다."

        );


        return;

    }


    window.open(
        videoUrl,
        "_blank",
        "noopener,noreferrer"
    );

}


/*==================================================
쿠팡 천국배송 열기
==================================================*/

function openCoupang() {

    const url =
        normalizeExternalUrl(
            currentGlobalData
                .coupang
                ?.url
        );


    if (!url) {

        showToast(
            "쿠팡 천국배송 주소가 아직 등록되지 않았습니다."
        );


        return;

    }


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/*==================================================
베드로의 고백 열기
==================================================*/

function openConfession() {

    const confessionUrl =
        cleanText(
            currentGlobalData
                .confession
                ?.url
        ) ||

        DEFAULT_GLOBAL_DATA
            .confession
            .url;


    window.location.href =
        confessionUrl;

}


/*==================================================
이벤트 연결
==================================================*/

function bindEvents() {

    churchLogoBtn?.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top:
                    0,

                behavior:
                    "smooth"

            });

        }
    );


    themeBtn?.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            themeMenu?.classList.toggle(
                "hidden"
            );

        }
    );


    document
        .querySelectorAll(".theme-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const theme =
                        cleanText(
                            button.dataset.theme
                        );


                    applyTheme(theme);


                    themeMenu?.classList.add(
                        "hidden"
                    );


                    showToast(
                        "교회 분위기가 변경되었습니다."
                    );

                }
            );

        });


    imageManageBtn?.addEventListener(
        "click",
        () => {

            openChurchAdmin(
                "images"
            );

        }
    );


    churchAdminBtn?.addEventListener(
        "click",
        () => {

            openChurchAdmin(
                "main"
            );

        }
    );


    heroPrevBtn?.addEventListener(
        "click",
        () => {

            showHeroSlide(
                currentHeroIndex - 1
            );


            restartHeroAutoPlay();

        }
    );


    heroNextBtn?.addEventListener(
        "click",
        () => {

            showHeroSlide(
                currentHeroIndex + 1
            );


            restartHeroAutoPlay();

        }
    );


    welcomeMessageBtn?.addEventListener(
        "click",
        () => {

            if (canManageChurch()) {

                openChurchAdmin(
                    "welcome"
                );

            }

        }
    );


    churchMenuGrid?.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-menu]"
                );


            if (!button) {

                return;

            }


            moveToMenu(
                button.dataset.menu
            );

        }
    );


    churchShortcutGrid?.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-shortcut]"
                );


            if (!button) {

                return;

            }


            moveToMenu(
                button.dataset.shortcut
            );

        }
    );


    pastorGreetingMoreBtn?.addEventListener(
        "click",
        () => {

            moveToMenu(
                "introduction"
            );

        }
    );


    sermonVideoBtn?.addEventListener(
        "click",
        openCurrentVideo
    );


    sermonWatchBtn?.addEventListener(
        "click",
        openCurrentVideo
    );


    sermonMoreBtn?.addEventListener(
        "click",
        () => {

            window.location.href =
                appendChurchId(
                    "../chattitle.html?category=sundaySermon"
                );

        }
    );


    scrollToSecondBtn?.addEventListener(
        "click",
        () => {

            secondScreen?.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }
    );


    recentNoticeMoreBtn?.addEventListener(
        "click",
        () => {

            window.location.href =
                appendChurchId(
                    "../chatnotice.html?type=recent"
                );

        }
    );


    urgentNoticeMoreBtn?.addEventListener(
        "click",
        () => {

            window.location.href =
                appendChurchId(
                    "../chatnotice.html?type=urgent"
                );

        }
    );


    coupangBtn?.addEventListener(
        "click",
        openCoupang
    );


    bottomHomeBtn?.addEventListener(
        "click",
        () => {

            window.location.href =
                "../index.html";

        }
    );


    bottomNewcomerBtn?.addEventListener(
        "click",
        () => {

            moveToMenu(
                "newcomer"
            );

        }
    );


    bottomConfessionBtn?.addEventListener(
        "click",
        openConfession
    );


    bottomGivingBtn?.addEventListener(
        "click",
        () => {

            givingSection?.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        }
    );


    bottomMyInfoBtn?.addEventListener(
        "click",
        () => {

            window.location.href =
                "../myinfo.html";

        }
    );


    pastorWordCloseBtn?.addEventListener(
        "click",
        () => {

            closePastorWordPopup(
                false
            );

        }
    );


    pastorWordTodayCloseBtn?.addEventListener(
        "click",
        () => {

            closePastorWordPopup(
                true
            );

        }
    );


    pastorWordArchiveBtn?.addEventListener(
        "click",
        () => {

            closePastorWordPopup(
                true
            );


            window.location.href =
                appendChurchId(
                    "../chattitle.html?category=pastorMessage"
                );

        }
    );


    pastorWordOverlay?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                pastorWordOverlay
            ) {

                closePastorWordPopup(
                    false
                );

            }

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                themeMenu?.classList.contains(
                    "hidden"
                )
            ) {

                return;

            }


            if (
                event.target.closest("#themeMenu") ||
                event.target.closest("#themeBtn")
            ) {

                return;

            }


            themeMenu.classList.add(
                "hidden"
            );

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {

                return;

            }


            if (
                pastorWordOverlay &&
                !pastorWordOverlay.classList.contains(
                    "hidden"
                )
            ) {

                closePastorWordPopup(
                    false
                );


                return;

            }


            themeMenu?.classList.add(
                "hidden"
            );

        }
    );


    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                stopHeroAutoPlay();

            } else {

                startHeroAutoPlay();

            }

        }
    );


    window.addEventListener(
        "beforeunload",
        stopHeroAutoPlay
    );

}


/*==================================================
LocalStorage 교회 임시자료

관리자 페이지 완성 전에도 테스트할 수 있습니다.
==================================================*/

function loadLocalChurchData() {

    const value =
        localStorage.getItem(

            CHURCH_LOCAL_DATA_PREFIX +
            currentChurchId

        );


    if (!value) {

        return null;

    }


    try {

        return JSON.parse(value);

    } catch (error) {

        console.warn(
            "교회 임시자료 읽기 실패:",
            error
        );


        return null;

    }

}


function saveLocalChurchData(data) {

    try {

        localStorage.setItem(

            CHURCH_LOCAL_DATA_PREFIX +
            currentChurchId,

            JSON.stringify(data)

        );

    } catch (error) {

        console.warn(
            "교회 임시자료 저장 실패:",
            error
        );

    }

}


/*==================================================
개발 중 임시 수정 기능

콘솔에서 아래처럼 사용할 수 있습니다.

window.YETALK_CHURCH_MAIN.update({
    churchName: "부산제일교회",
    pastorName: "정찬석"
});

예배중 테스트:

window.YETALK_CHURCH_MAIN.setLive(true);

예배종료:

window.YETALK_CHURCH_MAIN.setLive(false);
==================================================*/

window.YETALK_CHURCH_MAIN = {

    update(data) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            return;

        }


        currentChurchData =
            mergeChurchData(
                currentChurchData,
                data
            );


        applyChurchData(
            currentChurchData
        );


        saveLocalChurchData(
            currentChurchData
        );


        showToast(
            "교회 메인자료가 변경되었습니다."
        );

    },


    setLive(isLive) {

        currentChurchData =
            mergeChurchData(

                currentChurchData,

                {

                    worshipLive: {

                        ...currentChurchData.worshipLive,

                        isLive:
                            Boolean(isLive)

                    }

                }

            );


        applyChurchData(
            currentChurchData
        );


        saveLocalChurchData(
            currentChurchData
        );


        showToast(

            isLive

                ? "예배중으로 변경되었습니다."

                : "예배가 종료되었습니다."

        );

    },


    reset() {

        localStorage.removeItem(

            CHURCH_LOCAL_DATA_PREFIX +
            currentChurchId

        );


        currentChurchData =
            cloneObject(
                DEFAULT_CHURCH_DATA
            );


        applyChurchData(
            currentChurchData
        );


        showToast(
            "예톡교회 기본 모델로 초기화되었습니다."
        );

    },


    reloadNotices() {

        return loadChurchNotices();

    }

};


/*==================================================
이미지 오류 대체
==================================================*/

function bindImageErrorFallback() {

    document
        .querySelectorAll("img")
        .forEach(image => {

            image.addEventListener(
                "error",
                () => {

                    if (
                        image.dataset.fallbackApplied ===
                        "true"
                    ) {

                        return;

                    }


                    image.dataset.fallbackApplied =
                        "true";


                    image.src =
                        "churchimages/default.jpg";

                }
            );

        });

}


/*==================================================
날짜
==================================================*/

function getTodayKey() {

    const now =
        new Date();


    return [

        now.getFullYear(),

        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        ),

        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        )

    ].join("-");

}


function formatDateDisplay(value) {

    const text =
        cleanText(value);


    if (!text) {

        return "";

    }


    return text.replace(
        /-/g,
        "."
    );

}


/*==================================================
외부 주소 정리
==================================================*/

function normalizeExternalUrl(value) {

    const url =
        cleanText(value);


    if (!url) {

        return "";

    }


    if (
        /^https?:\/\//i.test(url)
    ) {

        return url;

    }


    return `https://${url}`;

}


/*==================================================
문자 정리
==================================================*/

function cleanText(value) {

    return String(
        value ?? ""
    ).trim();

}


/*==================================================
HTML 안전 처리
==================================================*/

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/*==================================================
객체 복사
==================================================*/

function cloneObject(value) {

    return JSON.parse(
        JSON.stringify(value)
    );

}


/*==================================================
토스트
==================================================*/

function showToast(message) {

    if (!churchToast) {

        return;

    }


    churchToast.textContent =
        cleanText(message);


    churchToast.classList.add(
        "show"
    );


    if (toastTimer) {

        window.clearTimeout(
            toastTimer
        );

    }


    toastTimer =
        window.setTimeout(
            () => {

                churchToast.classList.remove(
                    "show"
                );

            },
            2400
        );

}


/*==================================================
실행
==================================================*/

initializeChurchMain()
    .catch(error => {

        console.error(
            "교회 메인 초기화 오류:",
            error
        );


        showToast(
            "교회 화면을 불러오는 중 오류가 발생했습니다."
        );

    });


/*==================================================
YETALK CHURCHMAIN.JS 끝
==================================================*/