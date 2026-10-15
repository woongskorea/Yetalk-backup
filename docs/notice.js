/*==================================================
YETALK CHATNOTICE.JS

공지알림 통합본 1/3

핵심 원칙

1. 공지 원본은 Firebase에 단 1개만 저장
2. 예톡 개인홈 알림 상태는 LocalStorage 사용
3. 개인별 Firebase 알림문서 생성하지 않음
4. 자료실도 게시글을 복사 저장하지 않음
5. 같은 공지 원본의 category 값으로 자동분류
6. 사진 1장만 Firebase Storage 사용
7. PDF / 유튜브 / 외부앨범은 링크 사용
8. 관리자·담임목사·부사역자·허용 직원만 작성
9. 모바일 / PC 공용
10. CSS 코드 없음

※ 2/3, 3/3을 바로 아래에 이어 붙입니다.
==================================================*/


/*==================================================
FIREBASE

Firebase SDK는 firebase.js 한 곳만 사용합니다.
==================================================*/

import {

    db,
    storage,

    collection,
    doc,

    getDoc,
    getDocs,

    setDoc,
    deleteDoc,

    query,
    where,
    orderBy,
    limit,

    runTransaction,

    serverTimestamp,
    increment,

    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject

} from "./firebase.js";


/*==================================================
기본 설정
==================================================*/

const DEFAULT_CHURCH_ID =
    "yetalk-church";


const DEFAULT_CHURCH_NAME =
    "우리 교회";


const DEFAULT_NOTICE_DAYS =
    14;


const DEFAULT_ARCHIVE_DAYS =
    365;


const INITIAL_LOAD_LIMIT =
    20;


const MORE_LOAD_LIMIT =
    20;


const MAX_LOAD_LIMIT =
    100;


const COMMENT_LOAD_LIMIT =
    100;


/*
대표사진 최대 원본 선택 용량

실제 운영에서는
업로드 직전 자동압축 기능을 추가해서
Storage 비용을 더 줄일 예정
*/

const MAX_IMAGE_SIZE =
    10 * 1024 * 1024;


/*==================================================
LocalStorage 교회 ID 후보
==================================================*/

const CHURCH_STORAGE_KEYS = [

    "yetalkMyChurchId",
    "currentChurchId",
    "selectedChurchId",
    "churchId",
    "myChurchId"

];


/*==================================================
LocalStorage 로그인 회원 후보
==================================================*/

const USER_STORAGE_KEYS = [

    "loginUser",
    "currentUser",
    "yetalkUser",
    "memberInfo"

];


/*==================================================
개인 예톡홈 공지 LocalStorage 원칙

중요:

chatnotice.js에서
회원마다 Firebase 알림문서를 만들지 않습니다.

예톡 개인홈이 같은 공지 원본을 확인한 후
각 휴대폰에 아래와 같은 상태만 저장합니다.

예:
yetalkNoticeLastSeen_{churchId}
yetalkNoticeLastRead_{churchId}

실제 개인홈 연결은 index.js에서 담당합니다.
==================================================*/


/*==================================================
자료실 대분류 / 소분류

공지 작성 시
"자료실에도 저장"을 선택했을 때만 사용합니다.

실제 게시글은 복사하지 않고
같은 Firebase 원본의 category 값만 사용합니다.
==================================================*/

const ARCHIVE_CATEGORY_GROUPS = {

    church: {

        name:
            "교회소개·역사",

        items: [

            {
                key:
                    "churchHistory",

                name:
                    "교회 역사",

                icon:
                    "⛪"
            },

            {
                key:
                    "churchIntroduction",

                name:
                    "교회 소개",

                icon:
                    "🏠"
            },

            {
                key:
                    "churchVision",

                name:
                    "교회 비전",

                icon:
                    "🌿"
            },

            {
                key:
                    "churchAnniversary",

                name:
                    "창립·기념자료",

                icon:
                    "🎉"
            }

        ]

    },


    worship: {

        name:
            "예배·말씀",

        items: [

            {
                key:
                    "sundayBulletin",

                name:
                    "주일 주보",

                icon:
                    "📖"
            },

            {
                key:
                    "sundaySermon",

                name:
                    "주일 설교",

                icon:
                    "🎙️"
            },

            {
                key:
                    "worshipGuide",

                name:
                    "예배 안내",

                icon:
                    "🙏"
            },

            {
                key:
                    "specialWorship",

                name:
                    "특별예배",

                icon:
                    "✝️"
            }

        ]

    },


    pastor: {

        name:
            "담임목사 말씀",

        items: [

            {
                key:
                    "pastorMessage",

                name:
                    "오늘의 말씀",

                icon:
                    "📖"
            },

            {
                key:
                    "pastorColumn",

                name:
                    "목회칼럼",

                icon:
                    "✍️"
            },

            {
                key:
                    "pastorLetter",

                name:
                    "목회서신",

                icon:
                    "💌"
            }

        ]

    },


    nextGeneration: {

        name:
            "다음세대",

        items: [

            {
                key:
                    "children",

                name:
                    "아동부",

                icon:
                    "🧒"
            },

            {
                key:
                    "youth",

                name:
                    "청소년부",

                icon:
                    "👦"
            },

            {
                key:
                    "youngAdult",

                name:
                    "청년부",

                icon:
                    "👥"
            },

            {
                key:
                    "nextGenerationEvent",

                name:
                    "다음세대 행사",

                icon:
                    "🌱"
            }

        ]

    },


    department: {

        name:
            "교회부서",

        items: [

            {
                key:
                    "worshipTeam",

                name:
                    "예배·찬양",

                icon:
                    "🎵"
            },

            {
                key:
                    "serviceTeam",

                name:
                    "봉사",

                icon:
                    "🤝"
            },

            {
                key:
                    "cellGroup",

                name:
                    "소그룹·셀",

                icon:
                    "👨‍👩‍👧‍👦"
            },

            {
                key:
                    "departmentEtc",

                name:
                    "기타 부서",

                icon:
                    "📌"
            }

        ]

    },


    mission: {

        name:
            "선교·전도",

        items: [

            {
                key:
                    "mission",

                name:
                    "선교",

                icon:
                    "🌍"
            },

            {
                key:
                    "evangelism",

                name:
                    "전도",

                icon:
                    "📣"
            },

            {
                key:
                    "missionary",

                name:
                    "선교사 소식",

                icon:
                    "🕊️"
            },

            {
                key:
                    "missionReport",

                name:
                    "선교 보고",

                icon:
                    "📋"
            }

        ]

    },


    education: {

        name:
            "교육·훈련",

        items: [

            {
                key:
                    "bibleStudy",

                name:
                    "성경공부",

                icon:
                    "📚"
            },

            {
                key:
                    "discipleship",

                name:
                    "제자훈련",

                icon:
                    "🌱"
            },

            {
                key:
                    "seminar",

                name:
                    "교육·세미나",

                icon:
                    "🎓"
            }

        ]

    },


    administration: {

        name:
            "행정·재정",

        items: [

            {
                key:
                    "meetingMinutes",

                name:
                    "회의자료",

                icon:
                    "📝"
            },

            {
                key:
                    "budget",

                name:
                    "예산·결산",

                icon:
                    "💰"
            },

            {
                key:
                    "administration",

                name:
                    "행정자료",

                icon:
                    "📂"
            }

        ]

    },


    media: {

        name:
            "사진·영상",

        items: [

            {
                key:
                    "churchGallery",

                name:
                    "교회 갤러리",

                icon:
                    "📷"
            },

            {
                key:
                    "eventGallery",

                name:
                    "행사 사진",

                icon:
                    "🖼️"
            },

            {
                key:
                    "churchVideo",

                name:
                    "교회 영상",

                icon:
                    "🎬"
            }

        ]

    },


    document: {

        name:
            "문서·자료",

        items: [

            {
                key:
                    "churchDocument",

                name:
                    "교회 문서",

                icon:
                    "📄"
            },

            {
                key:
                    "formDocument",

                name:
                    "양식·서식",

                icon:
                    "📑"
            },

            {
                key:
                    "reference",

                name:
                    "참고자료",

                icon:
                    "🗂️"
            }

        ]

    },


    custom: {

        name:
            "우리 교회 사용자 분류",

        items:
            []

    }

};


/*==================================================
자료실 소분류 빠른 검색표
==================================================*/

const ARCHIVE_CATEGORY_LOOKUP =
    {};


Object.entries(
    ARCHIVE_CATEGORY_GROUPS
).forEach(

    ([mainKey, group]) => {

        group.items.forEach(

            item => {

                ARCHIVE_CATEGORY_LOOKUP[
                    item.key
                ] = {

                    mainKey:
                        mainKey,

                    mainName:
                        group.name,

                    ...item

                };

            }

        );

    }

);


/*==================================================
DOM
==================================================*/

const noticeBackBtn =
    document.getElementById(
        "noticeBackBtn"
    );


const noticeSearchHeaderBtn =
    document.getElementById(
        "noticeSearchHeaderBtn"
    );


const noticeHeaderChurch =
    document.getElementById(
        "noticeHeaderChurch"
    );


const noticeAllBtn =
    document.getElementById(
        "noticeAllBtn"
    );


const noticeImportantBtn =
    document.getElementById(
        "noticeImportantBtn"
    );


const noticeNewBtn =
    document.getElementById(
        "noticeNewBtn"
    );


const noticeArchiveBtn =
    document.getElementById(
        "noticeArchiveBtn"
    );


const noticeSearchArea =
    document.getElementById(
        "noticeSearchArea"
    );


const noticeSearchInput =
    document.getElementById(
        "noticeSearchInput"
    );


const noticeSearchClearBtn =
    document.getElementById(
        "noticeSearchClearBtn"
    );


const noticeSearchCloseBtn =
    document.getElementById(
        "noticeSearchCloseBtn"
    );


const noticeListTitle =
    document.getElementById(
        "noticeListTitle"
    );


const noticePostCount =
    document.getElementById(
        "noticePostCount"
    );


const noticeRefreshBtn =
    document.getElementById(
        "noticeRefreshBtn"
    );


const noticeLoading =
    document.getElementById(
        "noticeLoading"
    );


const noticePostList =
    document.getElementById(
        "noticePostList"
    );


const noticeEmpty =
    document.getElementById(
        "noticeEmpty"
    );


const noticeEmptyTitle =
    document.getElementById(
        "noticeEmptyTitle"
    );


const noticeEmptyDescription =
    document.getElementById(
        "noticeEmptyDescription"
    );


const noticeMoreBtn =
    document.getElementById(
        "noticeMoreBtn"
    );


const noticeWriteBtn =
    document.getElementById(
        "noticeWriteBtn"
    );


const noticeAdSection =
    document.getElementById(
        "noticeAdSection"
    );


/*==================================================
상세보기 DOM
==================================================*/

const noticeDetailOverlay =
    document.getElementById(
        "noticeDetailOverlay"
    );


const noticeDetailBackBtn =
    document.getElementById(
        "noticeDetailBackBtn"
    );


const noticeDetailHeaderChurch =
    document.getElementById(
        "noticeDetailHeaderChurch"
    );


const noticeDetailMenuBtn =
    document.getElementById(
        "noticeDetailMenuBtn"
    );


const noticeDetailImportant =
    document.getElementById(
        "noticeDetailImportant"
    );


const noticeDetailNew =
    document.getElementById(
        "noticeDetailNew"
    );


const noticeDetailArchive =
    document.getElementById(
        "noticeDetailArchive"
    );


const noticeDetailPermanent =
    document.getElementById(
        "noticeDetailPermanent"
    );


const noticeDetailTitle =
    document.getElementById(
        "noticeDetailTitle"
    );


const noticeDetailWriter =
    document.getElementById(
        "noticeDetailWriter"
    );


const noticeDetailDate =
    document.getElementById(
        "noticeDetailDate"
    );


const noticeDetailPeriod =
    document.getElementById(
        "noticeDetailPeriod"
    );


const noticeDetailPeriodText =
    document.getElementById(
        "noticeDetailPeriodText"
    );


const noticeDetailImageArea =
    document.getElementById(
        "noticeDetailImageArea"
    );


const noticeDetailImage =
    document.getElementById(
        "noticeDetailImage"
    );


const noticeDetailText =
    document.getElementById(
        "noticeDetailText"
    );


const noticeAttachmentArea =
    document.getElementById(
        "noticeAttachmentArea"
    );


const noticePdfBtn =
    document.getElementById(
        "noticePdfBtn"
    );


const noticePdfName =
    noticeDetailOverlay
        ?.querySelector(
            "#noticePdfName"
        );


const noticeVideoBtn =
    document.getElementById(
        "noticeVideoBtn"
    );


const noticeVideoName =
    noticeDetailOverlay
        ?.querySelector(
            "#noticeVideoName"
        );


const noticeLinkBtn =
    document.getElementById(
        "noticeLinkBtn"
    );


const noticeLinkName =
    noticeDetailOverlay
        ?.querySelector(
            "#noticeLinkName"
        );


const noticeCategoryBoardBtn =
    document.getElementById(
        "noticeCategoryBoardBtn"
    );


const noticeDetailAdminArea =
    document.getElementById(
        "noticeDetailAdminArea"
    );


const noticeDetailEditBtn =
    document.getElementById(
        "noticeDetailEditBtn"
    );


const noticeDetailDeleteBtn =
    document.getElementById(
        "noticeDetailDeleteBtn"
    );


/*==================================================
댓글 DOM
==================================================*/

const noticeCommentSection =
    document.getElementById(
        "noticeCommentSection"
    );


const noticeCommentCount =
    document.getElementById(
        "noticeCommentCount"
    );


const noticeCommentRefreshBtn =
    document.getElementById(
        "noticeCommentRefreshBtn"
    );


const noticeCommentList =
    document.getElementById(
        "noticeCommentList"
    );


const noticeCommentInput =
    document.getElementById(
        "noticeCommentInput"
    );


const noticeCommentSendBtn =
    document.getElementById(
        "noticeCommentSendBtn"
    );


/*==================================================
작성 DOM
==================================================*/

const noticeWriteOverlay =
    document.getElementById(
        "noticeWriteOverlay"
    );


const noticeWriteCloseBtn =
    document.getElementById(
        "noticeWriteCloseBtn"
    );


const noticeWriteHeaderTitle =
    document.getElementById(
        "noticeWriteHeaderTitle"
    );


const noticeWriteSaveBtn =
    document.getElementById(
        "noticeWriteSaveBtn"
    );


const noticeWriteTitle =
    document.getElementById(
        "noticeWriteTitle"
    );


const noticeWriteText =
    document.getElementById(
        "noticeWriteText"
    );


const noticePublishDate =
    document.getElementById(
        "noticePublishDate"
    );


const noticeUntil =
    document.getElementById(
        "noticeUntil"
    );


const noticePinned =
    document.getElementById(
        "noticePinned"
    );


const noticeSendIndexNotice =
    document.getElementById(
        "noticeSendIndexNotice"
    );


const noticeAllowComments =
    document.getElementById(
        "noticeAllowComments"
    );


const noticeSaveToArchive =
    document.getElementById(
        "noticeSaveToArchive"
    );


const noticeArchiveOptions =
    document.getElementById(
        "noticeArchiveOptions"
    );


const noticeArchiveMainCategory =
    document.getElementById(
        "noticeArchiveMainCategory"
    );


const noticeArchiveSubCategory =
    document.getElementById(
        "noticeArchiveSubCategory"
    );


const noticeCustomCategoryBox =
    document.getElementById(
        "noticeCustomCategoryBox"
    );


const noticeCustomCategoryName =
    document.getElementById(
        "noticeCustomCategoryName"
    );


const noticeCustomCategoryIcon =
    document.getElementById(
        "noticeCustomCategoryIcon"
    );


const noticeArchiveUntil =
    document.getElementById(
        "noticeArchiveUntil"
    );


const noticePermanent =
    document.getElementById(
        "noticePermanent"
    );


const noticeImageInput =
    document.getElementById(
        "noticeImageInput"
    );


const noticeImagePreview =
    document.getElementById(
        "noticeImagePreview"
    );


const noticeImagePreviewImg =
    document.getElementById(
        "noticeImagePreviewImg"
    );


const noticeImageRemoveBtn =
    document.getElementById(
        "noticeImageRemoveBtn"
    );


const noticePdfUrl =
    document.getElementById(
        "noticePdfUrl"
    );


/*
HTML에 상세보기와 작성화면의
noticePdfName ID가 중복되어 있으므로
작성창 안에서 정확히 찾습니다.
*/

const noticePdfNameInput =
    noticeWriteOverlay
        ?.querySelector(
            'input#noticePdfName'
        );


const noticeVideoUrl =
    document.getElementById(
        "noticeVideoUrl"
    );


const noticeVideoNameInput =
    noticeWriteOverlay
        ?.querySelector(
            'input#noticeVideoName'
        );


const noticeLinkUrl =
    document.getElementById(
        "noticeLinkUrl"
    );


const noticeLinkNameInput =
    noticeWriteOverlay
        ?.querySelector(
            'input#noticeLinkName'
        );


/*==================================================
삭제확인 / 토스트
==================================================*/

const noticeConfirmOverlay =
    document.getElementById(
        "noticeConfirmOverlay"
    );


const noticeConfirmCancelBtn =
    document.getElementById(
        "noticeConfirmCancelBtn"
    );


const noticeConfirmDeleteBtn =
    document.getElementById(
        "noticeConfirmDeleteBtn"
    );


const noticeToast =
    document.getElementById(
        "noticeToast"
    );


/*==================================================
상태
==================================================*/

let currentChurchId =
    getCurrentChurchId();


let currentChurchName =
    DEFAULT_CHURCH_NAME;


let loginUser =
    getLoginUser();


let currentMembership =
    null;


let loadedPosts =
    [];


let visiblePosts =
    [];


let selectedPost =
    null;


let editingPost =
    null;


let currentFilter =
    "all";


let currentLoadLimit =
    INITIAL_LOAD_LIMIT;


let selectedImageFile =
    null;


let selectedImagePreviewUrl =
    "";


let removeExistingImage =
    false;


let isSavingPost =
    false;


let isDeletingPost =
    false;


let isSendingComment =
    false;


let toastTimer =
    null;


/*==================================================
초기 실행
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeNoticePage

);


async function initializeNoticePage() {

    setLoading(true);


    bindBasicEvents();


    setInitialDates();


    await loadChurchInformation();


    await loadCurrentMembership();


    updateWritePermissionUI();


    await loadNoticePosts(true);

}


/*==================================================
현재 교회 ID 확인
==================================================*/

function getCurrentChurchId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const queryChurchId =
        cleanText(
            params.get(
                "churchId"
            )
        );


    if (queryChurchId) {

        saveCurrentChurchId(
            queryChurchId
        );


        return queryChurchId;

    }


    for (
        const key
        of CHURCH_STORAGE_KEYS
    ) {

        const value =
            cleanText(
                localStorage.getItem(
                    key
                )
            );


        if (value) {

            return value;

        }

    }


    return DEFAULT_CHURCH_ID;

}


/*==================================================
현재 교회 ID 저장
==================================================*/

function saveCurrentChurchId(
    churchId
) {

    const value =
        cleanText(churchId);


    if (!value) {

        return;

    }


    localStorage.setItem(

        "yetalkMyChurchId",

        value

    );


    localStorage.setItem(

        "currentChurchId",

        value

    );

}


/*==================================================
로그인 회원 확인
==================================================*/

function getLoginUser() {

    for (
        const key
        of USER_STORAGE_KEYS
    ) {

        const saved =
            localStorage.getItem(
                key
            );


        if (!saved) {

            continue;

        }


        try {

            const parsed =
                JSON.parse(
                    saved
                );


            if (
                parsed &&
                typeof parsed ===
                "object"
            ) {

                return parsed;

            }

        }

        catch (error) {

            console.warn(

                `${key} 로그인정보 읽기 실패:`,

                error

            );

        }

    }


    return null;

}


/*==================================================
교회 기본정보
==================================================*/

async function loadChurchInformation() {

    if (
        !db ||
        !currentChurchId
    ) {

        applyChurchName(
            DEFAULT_CHURCH_NAME
        );


        return;

    }


    try {

        const snapshot =
            await getDoc(

                doc(

                    db,

                    "churches",

                    currentChurchId

                )

            );


        if (!snapshot.exists()) {

            applyChurchName(
                DEFAULT_CHURCH_NAME
            );


            return;

        }


        const data =
            snapshot.data();


        currentChurchName =
            cleanText(

                data.churchName ||
                data.name

            ) ||
            DEFAULT_CHURCH_NAME;


        applyChurchName(
            currentChurchName
        );


        /*
        무료 교회만 광고 표시
        */

        const plan =
            cleanText(

                data.plan ||
                data.churchPlan

            )
                .toLowerCase();


        noticeAdSection?.classList.toggle(

            "hidden",

            plan !== "free"

        );

    }

    catch (error) {

        console.warn(

            "교회정보 불러오기 실패:",

            error

        );


        applyChurchName(
            DEFAULT_CHURCH_NAME
        );

    }

}


/*==================================================
화면 교회명 반영
==================================================*/

function applyChurchName(
    churchName
) {

    currentChurchName =
        cleanText(churchName) ||
        DEFAULT_CHURCH_NAME;


    if (noticeHeaderChurch) {

        noticeHeaderChurch.textContent =
            currentChurchName;

    }


    if (noticeDetailHeaderChurch) {

        noticeDetailHeaderChurch.textContent =
            currentChurchName;

    }

}


/*==================================================
교회 회원 권한 확인
==================================================*/

async function loadCurrentMembership() {

    const memberNo =
        cleanText(
            loginUser?.memberNo
        );


    if (
        !db ||
        !memberNo ||
        !currentChurchId
    ) {

        currentMembership =
            null;


        return;

    }


    const references = [

        doc(

            db,

            "churches",

            currentChurchId,

            "members",

            memberNo

        ),

        doc(

            db,

            "users",

            memberNo,

            "churches",

            currentChurchId

        )

    ];


    for (
        const reference
        of references
    ) {

        try {

            const snapshot =
                await getDoc(
                    reference
                );


            if (snapshot.exists()) {

                currentMembership = {

                    memberNo:
                        memberNo,

                    ...snapshot.data()

                };


                return;

            }

        }

        catch (error) {

            console.warn(

                "교회 회원권한 확인 실패:",

                error

            );

        }

    }


    /*
    기존 로그인자료 임시 호환
    */

    currentMembership = {

        memberNo:
            memberNo,

        role:
            loginUser?.role ||
            "",

        isOwner:
            loginUser?.isOwner ===
            true,

        isChurchAdmin:
            loginUser?.isChurchAdmin ===
            true

    };

}


/*==================================================
교회 역할 정리
==================================================*/

function getNormalizedRole() {

    const role =
        cleanText(
            currentMembership?.role
        )
            .toLowerCase();


    if (

        role === "owner" ||
        role === "church_owner" ||
        role === "creator_admin" ||
        currentMembership?.isOwner === true

    ) {

        return "owner";

    }


    if (

        role === "pastor" ||
        role === "senior_pastor" ||
        role === "minister" ||
        role === "assistant_pastor" ||
        role === "admin" ||
        role === "assistant_admin" ||
        role === "church_admin" ||
        role === "churchadmin" ||
        currentMembership?.isChurchAdmin === true

    ) {

        return "minister";

    }


    if (

        role === "staff" ||
        role === "secretary" ||
        role === "office" ||
        role === "church_staff"

    ) {

        return "staff";

    }


    return (
        role ||
        "member"
    );

}


/*==================================================
공지 작성 권한
==================================================*/

function canWriteBoard() {

    const role =
        getNormalizedRole();


    return (

        role === "owner" ||
        role === "minister" ||
        role === "staff"

    );

}


/*==================================================
게시글 수정·삭제 권한
==================================================*/

function canManagePost(
    post
) {

    if (!post) {

        return false;

    }


    const role =
        getNormalizedRole();


    if (

        role === "owner" ||
        role === "minister"

    ) {

        return true;

    }


    const memberNo =
        cleanText(
            loginUser?.memberNo
        );


    if (!memberNo) {

        return false;

    }


    /*
    사무직원은
    자신이 작성한 공지만 기본 수정·삭제 가능
    */

    return (

        role === "staff" &&
        cleanText(
            post.writerMemberNo
        ) === memberNo

    );

}


/*==================================================
작성 버튼 표시
==================================================*/

function updateWritePermissionUI() {

    noticeWriteBtn?.classList.toggle(

        "hidden",

        !canWriteBoard()

    );

}


/*==================================================
공지 Collection

핵심:

공지 원본은 이곳에 단 한 번만 저장합니다.

churchBoards/{postId}

예톡 개인홈도
교회 메인도
자료실도

이 같은 원본을 읽습니다.
==================================================*/

function getBoardCollection() {

    return collection(

        db,

        "churchBoards"

    );

}


/*==================================================
공지 Document
==================================================*/

function getBoardDocument(
    postId
) {

    return doc(

        db,

        "churchBoards",

        makeSafeDocumentId(
            postId
        )

    );

}


/*==================================================
댓글 Collection
==================================================*/

function getCommentCollection(
    postId
) {

    return collection(

        db,

        "churchBoards",

        makeSafeDocumentId(
            postId
        ),

        "comments"

    );

}


/*==================================================
공지 불러오기
==================================================*/

async function loadNoticePosts(
    resetLimit = false
) {

    if (resetLimit) {

        currentLoadLimit =
            INITIAL_LOAD_LIMIT;

    }


    setLoading(true);


    try {

        let snapshot;


        try {

            snapshot =
                await getDocs(

                    query(

                        getBoardCollection(),

                        where(
                            "churchId",
                            "==",
                            currentChurchId
                        ),

                        orderBy(
                            "publishDateMs",
                            "desc"
                        ),

                        limit(
                            currentLoadLimit
                        )

                    )

                );

        }

        catch (queryError) {

            console.warn(

                "공지 조건조회 실패, 단순조회 사용:",

                queryError

            );


            snapshot =
                await getDocs(
                    getBoardCollection()
                );

        }


        const posts =
            [];


        snapshot.forEach(

            item => {

                const data =
                    item.data();


                if (
                    cleanText(
                        data.churchId
                    ) !==
                    currentChurchId
                ) {

                    return;

                }


                if (
                    cleanText(
                        data.status
                    )
                        .toLowerCase() ===
                    "deleted"
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


        posts.sort(

            (
                first,
                second
            ) =>

                getPostDateMs(
                    second
                ) -

                getPostDateMs(
                    first
                )

        );


        loadedPosts =
            posts.filter(
                isNoticeCurrentlyVisible
            );


        applyCurrentFilter();


        updateMoreButton();


        setLoading(false);

    }

    catch (error) {

        console.error(

            "공지 불러오기 오류:",

            error

        );


        loadedPosts =
            [];


        visiblePosts =
            [];


        renderPostList();


        setLoading(false);


        showToast(

            getFirebaseErrorMessage(

                error,

                "공지를 불러오지 못했습니다."

            )

        );

    }

}


/*==================================================
현재 표시 가능한 공지
==================================================*/

function isNoticeCurrentlyVisible(
    post
) {

    if (!post) {

        return false;

    }


    const status =
        cleanText(
            post.status
        )
            .toLowerCase();


    if (

        status === "deleted" ||
        status === "hidden" ||
        status === "inactive" ||
        status === "draft"

    ) {

        return false;

    }


    if (
        post.showInNotice ===
        false
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


    const noticeUntil =
        cleanText(
            post.noticeUntil
        );


    if (
        noticeUntil &&
        noticeUntil < today
    ) {

        return false;

    }


    return true;

}


/*==================================================
현재 필터 적용
==================================================*/

function applyCurrentFilter() {

    let posts =
        [...loadedPosts];


    if (
        currentFilter ===
        "important"
    ) {

        posts =
            posts.filter(

                post =>
                    post.pinned ===
                    true

            );

    }


    if (
        currentFilter ===
        "new"
    ) {

        posts =
            posts.filter(
                isNewPost
            );

    }


    const keyword =
        cleanText(
            noticeSearchInput?.value
        )
            .toLowerCase();


    if (keyword) {

        posts =
            posts.filter(

                post => {

                    const title =
                        cleanText(
                            post.title
                        )
                            .toLowerCase();


                    const content =
                        cleanText(
                            post.content
                        )
                            .toLowerCase();


                    const writer =
                        cleanText(
                            post.writerName
                        )
                            .toLowerCase();


                    return (

                        title.includes(
                            keyword
                        ) ||

                        content.includes(
                            keyword
                        ) ||

                        writer.includes(
                            keyword
                        )

                    );

                }

            );

    }


    /*
    중요공지 우선
    이후 최신순
    */

    posts.sort(

        (
            first,
            second
        ) => {

            const pinDifference =

                Number(
                    second.pinned === true
                ) -

                Number(
                    first.pinned === true
                );


            if (
                pinDifference !== 0
            ) {

                return pinDifference;

            }


            return (

                getPostDateMs(
                    second
                ) -

                getPostDateMs(
                    first
                )

            );

        }

    );


    visiblePosts =
        posts;


    renderPostList();


    updateFilterTitle();

}


/*==================================================
필터 변경
==================================================*/

function changeFilter(
    filter
) {

    currentFilter =
        filter;


    document
        .querySelectorAll(
            ".noticeQuickBtn[data-filter]"
        )
        .forEach(

            button => {

                button.classList.toggle(

                    "active",

                    button.dataset.filter ===
                    filter

                );

            }

        );


    applyCurrentFilter();

}


/*==================================================
필터 제목
==================================================*/

function updateFilterTitle() {

    let title =
        "최근 공지";


    if (
        currentFilter ===
        "important"
    ) {

        title =
            "중요 공지";

    }


    if (
        currentFilter ===
        "new"
    ) {

        title =
            "새 공지";

    }


    if (
        cleanText(
            noticeSearchInput?.value
        )
    ) {

        title =
            "검색 결과";

    }


    if (noticeListTitle) {

        noticeListTitle.textContent =
            title;

    }


    if (noticePostCount) {

        noticePostCount.textContent =
            String(
                visiblePosts.length
            );

    }

}


/*==================================================
공지 목록 출력
==================================================*/

function renderPostList() {

    if (!noticePostList) {

        return;

    }


    noticePostList.innerHTML =
        "";


    if (
        visiblePosts.length ===
        0
    ) {

        showEmptyState();


        return;

    }


    noticeEmpty?.classList.add(
        "hidden"
    );


    visiblePosts.forEach(

        post => {

            noticePostList.appendChild(

                createPostCard(
                    post
                )

            );

        }

    );

}


/*==================================================
공지 카드 생성
==================================================*/

function createPostCard(
    post
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "noticePostCard";


    if (
        post.pinned ===
        true
    ) {

        card.classList.add(
            "important"
        );

    }


    card.tabIndex =
        0;


    card.setAttribute(
        "role",
        "button"
    );


    const newBadge =
        isNewPost(post)

            ? `
                <span class="noticePostNew">
                    NEW
                </span>
              `

            : "";


    const archiveBadge =

        post.saveToArchive ===
        true

            ? `
                <span class="noticePostArchive">
                    자료실
                </span>
              `

            : "";


    const permanentBadge =

        post.saveToArchive === true &&
        post.permanent === true

            ? `
                <span class="noticePostPermanent">
                    장기보관
                </span>
              `

            : "";


    const attachmentLabels =
        createPostAttachmentLabels(
            post
        );


    card.innerHTML = `

        <div class="noticePostTop">

            <div class="noticePostBadgeRow">

                ${newBadge}

                ${archiveBadge}

                ${permanentBadge}

            </div>


            <span class="noticePostDate">

                ${escapeHTML(
                    formatPostDate(
                        post
                    )
                )}

            </span>

        </div>


        <h2 class="noticePostTitle">

            ${escapeHTML(
                cleanText(
                    post.title
                ) ||
                "제목 없음"
            )}

        </h2>


        ${
            cleanText(
                post.content
            )

                ? `
                    <div class="noticePostContent">

                        ${formatText(
                            post.content
                        )}

                    </div>
                  `

                : ""
        }


        <div class="noticePostBottom">

            <span class="noticePostWriter">

                ${escapeHTML(
                    cleanText(
                        post.writerName
                    ) ||
                    "교회 관리자"
                )}

            </span>


            <div class="noticePostAttachments">

                ${attachmentLabels}

                ${
                    post.allowComments !== false

                        ? `
                            <span class="noticePostCommentCount">

                                💬
                                ${Number(
                                    post.commentCount ||
                                    0
                                )}

                            </span>
                          `

                        : ""
                }

            </div>

        </div>

    `;


    card.addEventListener(

        "click",

        () => {

            openPostDetail(
                post
            );

        }

    );


    card.addEventListener(

        "keydown",

        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();


                openPostDetail(
                    post
                );

            }

        }

    );


    return card;

}


/*==================================================
첨부 표시
==================================================*/

function createPostAttachmentLabels(
    post
) {

    const labels =
        [];


    if (
        isSafeHttpUrl(
            post.pdfUrl
        )
    ) {

        labels.push(
            `<span class="noticePostAttachment">📄 문서</span>`
        );

    }


    if (
        isSafeHttpUrl(
            post.videoUrl
        )
    ) {

        labels.push(
            `<span class="noticePostAttachment">▶ 영상</span>`
        );

    }


    if (
        isSafeHttpUrl(
            post.linkUrl
        )
    ) {

        labels.push(
            `<span class="noticePostAttachment">🔗 링크</span>`
        );

    }


    if (
        isSafeHttpUrl(
            post.imageUrl
        )
    ) {

        labels.push(
            `<span class="noticePostAttachment">📷 사진</span>`
        );

    }


    return labels.join(
        ""
    );

}


/*==================================================
공지 없음
==================================================*/

function showEmptyState() {

    noticeEmpty?.classList.remove(
        "hidden"
    );


    let title =
        "등록된 공지가 없습니다.";


    let description =
        "교회 관리자가 공지를 등록하면 이곳에 표시됩니다.";


    if (
        currentFilter ===
        "important"
    ) {

        title =
            "중요 공지가 없습니다.";


        description =
            "중요공지로 지정된 글이 없습니다.";

    }


    if (
        currentFilter ===
        "new"
    ) {

        title =
            "새 공지가 없습니다.";


        description =
            "최근 등록된 새로운 공지가 없습니다.";

    }


    if (
        cleanText(
            noticeSearchInput?.value
        )
    ) {

        title =
            "검색 결과가 없습니다.";


        description =
            "다른 검색어로 다시 찾아보세요.";

    }


    if (noticeEmptyTitle) {

        noticeEmptyTitle.textContent =
            title;

    }


    if (noticeEmptyDescription) {

        noticeEmptyDescription.textContent =
            description;

    }


    if (noticePostCount) {

        noticePostCount.textContent =
            "0";

    }

}


/*==================================================
새 공지 여부

최근 7일
==================================================*/

function isNewPost(
    post
) {

    const dateMs =
        getPostDateMs(
            post
        );


    if (!dateMs) {

        return false;

    }


    const sevenDays =
        7 *
        24 *
        60 *
        60 *
        1000;


    return (

        Date.now() -
        dateMs

    ) <= sevenDays;

}


/*==================================================
게시글 시간
==================================================*/

function getPostDateMs(
    post
) {

    const direct =
        Number(

            post?.publishDateMs ||
            post?.createdAtMs ||
            post?.updatedAtMs

        );


    if (
        Number.isFinite(
            direct
        ) &&
        direct > 0
    ) {

        return direct;

    }


    const timestamp =

        post?.createdAt ||
        post?.updatedAt;


    if (
        timestamp &&
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }


    const publishDate =
        cleanText(
            post?.publishDate
        );


    if (publishDate) {

        const time =
            new Date(

                publishDate +
                "T00:00:00"

            )
                .getTime();


        if (
            Number.isFinite(
                time
            )
        ) {

            return time;

        }

    }


    return 0;

}


/*==================================================
자료실 보관기간 종료 여부
==================================================*/

function isArchiveExpired(
    post
) {

    if (
        post?.permanent ===
        true
    ) {

        return false;

    }


    const archiveUntil =
        cleanText(

            post?.archiveUntil ||
            post?.expireDate

        );


    if (!archiveUntil) {

        return false;

    }


    return (
        archiveUntil <
        getTodayKey()
    );

}


/*==================================================
더보기 버튼
==================================================*/

function updateMoreButton() {

    const canLoadMore =

        loadedPosts.length >=
            currentLoadLimit &&

        currentLoadLimit <
            MAX_LOAD_LIMIT;


    noticeMoreBtn?.classList.toggle(

        "hidden",

        !canLoadMore

    );

}


/*==================================================
로딩
==================================================*/

function setLoading(
    loading
) {

    noticeLoading?.classList.toggle(

        "hidden",

        !loading

    );


    if (loading) {

        noticeEmpty?.classList.add(
            "hidden"
        );


        noticePostList?.classList.add(
            "hidden"
        );

    } else {

        noticePostList?.classList.remove(
            "hidden"
        );

    }

}


/*==================================================
검색 열기
==================================================*/

function openSearchArea() {

    noticeSearchArea?.classList.remove(
        "hidden"
    );


    window.setTimeout(

        () => {

            noticeSearchInput?.focus();

        },

        80

    );

}


/*==================================================
검색 닫기
==================================================*/

function closeSearchArea() {

    noticeSearchArea?.classList.add(
        "hidden"
    );


    clearSearchInput();

}


/*==================================================
검색어 삭제
==================================================*/

function clearSearchInput() {

    if (noticeSearchInput) {

        noticeSearchInput.value =
            "";

    }


    noticeSearchClearBtn?.classList.add(
        "hidden"
    );


    applyCurrentFilter();

}


/*==================================================
자료실 전체 열기
==================================================*/

function openAllArchiveBoards() {

    const params =
        new URLSearchParams();


    params.set(
        "churchId",
        currentChurchId
    );


    params.set(
        "view",
        "archive"
    );


    window.location.href =

        "chattitle.html?" +
        params.toString();

}


/*==================================================
초기 날짜
==================================================*/

function setInitialDates() {

    const today =
        getTodayKey();


    if (
        noticePublishDate &&
        !noticePublishDate.value
    ) {

        noticePublishDate.value =
            today;

    }


    if (
        noticeUntil &&
        !noticeUntil.value
    ) {

        noticeUntil.value =
            addDaysToDateString(

                today,

                DEFAULT_NOTICE_DAYS

            );

    }


    if (
        noticeArchiveUntil &&
        !noticeArchiveUntil.value
    ) {

        noticeArchiveUntil.value =
            addDaysToDateString(

                today,

                DEFAULT_ARCHIVE_DAYS

            );

    }

}


/*==================================================
텍스트 정리
==================================================*/

function cleanText(
    value
) {

    return String(
        value ?? ""
    ).trim();

}


/*==================================================
분류키 정리
==================================================*/

function cleanCategoryKey(
    value
) {

    return String(
        value ?? ""
    )
        .normalize(
            "NFKC"
        )
        .trim()
        .replace(

            /[^a-zA-Z0-9_-]/g,

            ""

        )
        .slice(
            0,
            80
        );

}


/*==================================================
사용자 자료실 키 생성
==================================================*/

function createCustomCategoryKey(
    name
) {

    const safeName =
        String(
            name || "church"
        )
            .normalize(
                "NFKC"
            )
            .trim()
            .replace(
                /\s+/g,
                "_"
            )
            .replace(
                /[^a-zA-Z0-9가-힣_-]/g,
                ""
            )
            .slice(
                0,
                24
            );


    return (

        "custom_" +
        (
            safeName ||
            "church"
        ) +
        "_" +
        Date.now()
            .toString(36)

    );

}


/*==================================================
CHATNOTICE.JS 1/3 끝

다음 2/3

- 상세보기
- 첨부자료
- 댓글
- 새 공지 작성
- 자료실 분류
- 공지 저장

중요:
공지 저장은 Firebase 원본 1개뿐이며
별도 공지신호 문서는 만들지 않습니다.
==================================================*/
/*==================================================
YETALK CHATNOTICE.JS

공지알림 통합본 2/3

1/3 바로 아래에 이어 붙입니다.

이번 구간

1. 상세보기
2. 공지기간
3. 대표사진
4. 첨부자료
5. 자료실 이동
6. 댓글
7. 공지 작성·수정
8. 자료실 분류
9. 사진 선택
10. 공지 저장

중요

- 공지 원본은 Firebase에 1번만 저장
- 개인 예톡홈용 별도 Firebase 알림문서 생성 안 함
- 자료실용 게시글 복사 저장 안 함
==================================================*/


/*==================================================
상세보기 열기
==================================================*/

async function openPostDetail(
    post
) {

    if (!post) {

        return;

    }


    selectedPost =
        post;


    noticeDetailImportant?.classList.toggle(

        "hidden",

        post.pinned !== true

    );


    noticeDetailNew?.classList.toggle(

        "hidden",

        !isNewPost(post)

    );


    noticeDetailArchive?.classList.toggle(

        "hidden",

        post.saveToArchive !== true

    );


    noticeDetailPermanent?.classList.toggle(

        "hidden",

        !(
            post.saveToArchive === true &&
            post.permanent === true
        )

    );


    if (noticeDetailTitle) {

        noticeDetailTitle.textContent =

            cleanText(
                post.title
            ) ||
            "제목 없음";

    }


    if (noticeDetailWriter) {

        noticeDetailWriter.textContent =

            cleanText(
                post.writerName
            ) ||
            "교회 관리자";

    }


    if (noticeDetailDate) {

        noticeDetailDate.textContent =
            formatPostDate(
                post
            );

    }


    showNoticePeriod(
        post
    );


    showDetailImage(
        post
    );


    if (noticeDetailText) {

        noticeDetailText.textContent =
            cleanText(
                post.content
            );

    }


    showDetailAttachments(
        post
    );


    showArchiveBoardButton(
        post
    );


    const allowed =
        canManagePost(
            post
        );


    noticeDetailAdminArea?.classList.toggle(

        "hidden",

        !allowed

    );


    noticeDetailMenuBtn?.classList.toggle(

        "hidden",

        !allowed

    );


    showCommentArea(
        post
    );


    noticeDetailOverlay?.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    if (
        post.allowComments !==
        false
    ) {

        await loadComments();

    }

}


/*==================================================
공지기간 표시
==================================================*/

function showNoticePeriod(
    post
) {

    const publishDate =
        cleanText(
            post?.publishDate
        );


    const noticeEndDate =
        cleanText(
            post?.noticeUntil
        );


    if (
        !publishDate &&
        !noticeEndDate
    ) {

        noticeDetailPeriod?.classList.add(
            "hidden"
        );


        return;

    }


    let periodText =
        "";


    if (
        publishDate &&
        noticeEndDate
    ) {

        periodText =

            formatDateString(
                publishDate
            ) +

            " ~ " +

            formatDateString(
                noticeEndDate
            );

    }

    else if (
        publishDate
    ) {

        periodText =

            formatDateString(
                publishDate
            ) +

            "부터";

    }

    else {

        periodText =

            formatDateString(
                noticeEndDate
            ) +

            "까지";

    }


    if (
        noticeDetailPeriodText
    ) {

        noticeDetailPeriodText.textContent =
            periodText;

    }


    noticeDetailPeriod?.classList.remove(
        "hidden"
    );

}


/*==================================================
상세 대표사진
==================================================*/

function showDetailImage(
    post
) {

    const imageUrl =
        cleanText(
            post?.imageUrl
        );


    if (
        !isSafeHttpUrl(
            imageUrl
        )
    ) {

        noticeDetailImageArea?.classList.add(
            "hidden"
        );


        noticeDetailImage?.removeAttribute(
            "src"
        );


        return;

    }


    if (
        noticeDetailImage
    ) {

        noticeDetailImage.src =
            imageUrl;


        noticeDetailImage.alt =

            cleanText(
                post.title
            ) ||
            "공지 대표사진";

    }


    noticeDetailImageArea?.classList.remove(
        "hidden"
    );

}


/*==================================================
상세 첨부자료
==================================================*/

function showDetailAttachments(
    post
) {

    const pdfUrl =
        cleanText(
            post?.pdfUrl
        );


    const videoUrl =
        cleanText(
            post?.videoUrl
        );


    const linkUrl =
        cleanText(
            post?.linkUrl
        );


    const hasPdf =
        isSafeHttpUrl(
            pdfUrl
        );


    const hasVideo =
        isSafeHttpUrl(
            videoUrl
        );


    const hasLink =
        isSafeHttpUrl(
            linkUrl
        );


    noticePdfBtn?.classList.toggle(

        "hidden",

        !hasPdf

    );


    noticeVideoBtn?.classList.toggle(

        "hidden",

        !hasVideo

    );


    noticeLinkBtn?.classList.toggle(

        "hidden",

        !hasLink

    );


    if (
        hasPdf &&
        noticePdfName
    ) {

        noticePdfName.textContent =

            cleanText(
                post.pdfName
            ) ||
            "문서 보기";

    }


    if (
        hasVideo &&
        noticeVideoName
    ) {

        noticeVideoName.textContent =

            cleanText(
                post.videoName
            ) ||
            "영상 보기";

    }


    if (
        hasLink &&
        noticeLinkName
    ) {

        noticeLinkName.textContent =

            cleanText(
                post.linkName
            ) ||
            "연결 페이지 보기";

    }


    noticeAttachmentArea?.classList.toggle(

        "hidden",

        !(
            hasPdf ||
            hasVideo ||
            hasLink
        )

    );


    setExternalButton(
        noticePdfBtn,
        pdfUrl
    );


    setExternalButton(
        noticeVideoBtn,
        videoUrl
    );


    setExternalButton(
        noticeLinkBtn,
        linkUrl
    );

}


/*==================================================
자료실 이동 버튼
==================================================*/

function showArchiveBoardButton(
    post
) {

    const available =

        post?.saveToArchive ===
        true &&

        Boolean(
            cleanCategoryKey(
                post?.category
            )
        ) &&

        !isArchiveExpired(
            post
        );


    noticeCategoryBoardBtn?.classList.toggle(

        "hidden",

        !available

    );

}


/*==================================================
외부 주소 버튼
==================================================*/

function setExternalButton(
    button,
    url
) {

    if (!button) {

        return;

    }


    button.onclick =
        null;


    if (
        !isSafeHttpUrl(
            url
        )
    ) {

        return;

    }


    button.onclick =
        () => {

            openExternalUrl(
                url
            );

        };

}


/*==================================================
외부 주소 열기
==================================================*/

function openExternalUrl(
    url
) {

    if (
        !isSafeHttpUrl(
            url
        )
    ) {

        showToast(
            "올바른 연결 주소가 아닙니다."
        );


        return;

    }


    const opened =
        window.open(

            url,

            "_blank",

            "noopener,noreferrer"

        );


    if (!opened) {

        window.location.href =
            url;

    }

}


/*==================================================
안전한 HTTP 주소
==================================================*/

function isSafeHttpUrl(
    value
) {

    const text =
        cleanText(
            value
        );


    if (!text) {

        return false;

    }


    try {

        const url =
            new URL(
                text
            );


        return (

            url.protocol ===
            "https:" ||

            url.protocol ===
            "http:"

        );

    }

    catch {

        return false;

    }

}


/*==================================================
상세보기 닫기
==================================================*/

function closePostDetail() {

    noticeDetailOverlay?.classList.add(
        "hidden"
    );


    selectedPost =
        null;


    clearCommentArea();


    document.body.style.overflow =
        "";

}


/*==================================================
현재 자료의 자료실 열기
==================================================*/

function openSelectedArchiveBoard() {

    if (
        !selectedPost ||
        selectedPost.saveToArchive !== true
    ) {

        return;

    }


    const category =
        cleanCategoryKey(
            selectedPost.category
        );


    if (!category) {

        showToast(
            "연결된 자료실 분류가 없습니다."
        );


        return;

    }


    const params =
        new URLSearchParams();


    params.set(
        "churchId",
        currentChurchId
    );


    params.set(
        "category",
        category
    );


    if (
        cleanText(
            selectedPost.categoryName
        )
    ) {

        params.set(

            "name",

            selectedPost.categoryName

        );

    }


    if (
        cleanText(
            selectedPost.categoryIcon
        )
    ) {

        params.set(

            "icon",

            selectedPost.categoryIcon

        );

    }


    window.location.href =

        "chattitle.html?" +
        params.toString();

}


/*==================================================
댓글 영역 표시
==================================================*/

function showCommentArea(
    post
) {

    const allowed =
        post?.allowComments !==
        false;


    noticeCommentSection?.classList.toggle(

        "hidden",

        !allowed

    );


    if (!allowed) {

        clearCommentArea();


        return;

    }


    if (
        noticeCommentInput
    ) {

        noticeCommentInput.disabled =
            false;


        noticeCommentInput.placeholder =
            "댓글을 입력하세요.";

    }


    if (
        noticeCommentSendBtn
    ) {

        noticeCommentSendBtn.disabled =
            false;

    }

}


/*==================================================
댓글 초기화
==================================================*/

function clearCommentArea() {

    if (
        noticeCommentList
    ) {

        noticeCommentList.innerHTML = `

            <div class="noticeCommentEmpty">

                아직 댓글이 없습니다.

            </div>

        `;

    }


    if (
        noticeCommentCount
    ) {

        noticeCommentCount.textContent =
            "0";

    }


    if (
        noticeCommentInput
    ) {

        noticeCommentInput.value =
            "";

    }

}


/*==================================================
댓글 불러오기
==================================================*/

async function loadComments() {

    if (
        !selectedPost ||
        selectedPost.allowComments === false
    ) {

        return;

    }


    if (
        noticeCommentList
    ) {

        noticeCommentList.innerHTML = `

            <div class="noticeCommentEmpty">

                댓글을 불러오는 중입니다.

            </div>

        `;

    }


    try {

        const commentsQuery =
            query(

                getCommentCollection(
                    selectedPost.id
                ),

                orderBy(
                    "createdAtMs",
                    "desc"
                ),

                limit(
                    COMMENT_LOAD_LIMIT
                )

            );


        const snapshot =
            await getDocs(
                commentsQuery
            );


        const comments =
            [];


        snapshot.forEach(

            item => {

                comments.push({

                    id:
                        item.id,

                    ...item.data()

                });

            }

        );


        comments.reverse();


        renderComments(
            comments
        );


        if (
            noticeCommentCount
        ) {

            noticeCommentCount.textContent =
                String(

                    Number(

                        selectedPost.commentCount ??
                        comments.length

                    )

                );

        }

    }

    catch (error) {

        console.error(

            "댓글 불러오기 오류:",

            error

        );


        showCommentEmpty(
            "댓글을 불러오지 못했습니다."
        );

    }

}


/*==================================================
댓글 출력
==================================================*/

function renderComments(
    comments
) {

    if (
        !noticeCommentList
    ) {

        return;

    }


    if (
        !Array.isArray(
            comments
        ) ||
        comments.length === 0
    ) {

        showCommentEmpty(
            "아직 댓글이 없습니다."
        );


        return;

    }


    noticeCommentList.innerHTML =
        "";


    comments.forEach(

        comment => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "noticeCommentItem";


            item.innerHTML = `

                <div class="noticeCommentTop">

                    <span class="noticeCommentName">

                        ${escapeHTML(
                            comment.nickname ||
                            "은혜 성**"
                        )}

                    </span>


                    <span class="noticeCommentTime">

                        ${escapeHTML(
                            comment.displayTime ||
                            ""
                        )}

                    </span>

                </div>


                <div class="noticeCommentText">

                    ${formatText(
                        comment.text ||
                        ""
                    )}

                </div>

            `;


            noticeCommentList.appendChild(
                item
            );

        }

    );

}


/*==================================================
댓글 없음
==================================================*/

function showCommentEmpty(
    message
) {

    if (
        !noticeCommentList
    ) {

        return;

    }


    noticeCommentList.innerHTML = `

        <div class="noticeCommentEmpty">

            ${formatText(
                message
            )}

        </div>

    `;

}


/*==================================================
댓글 등록
==================================================*/

async function sendComment() {

    if (
        isSendingComment ||
        !selectedPost ||
        selectedPost.allowComments === false
    ) {

        return;

    }


    const memberNo =
        cleanText(
            loginUser?.memberNo
        );


    if (!memberNo) {

        showToast(
            "로그인 후 댓글을 작성할 수 있습니다."
        );


        return;

    }


    const text =
        cleanText(
            noticeCommentInput?.value
        );


    if (!text) {

        showToast(
            "댓글 내용을 입력하세요."
        );


        noticeCommentInput?.focus();


        return;

    }


    if (
        text.length >
        200
    ) {

        showToast(
            "댓글은 200자 이하로 작성해 주세요."
        );


        return;

    }


    isSendingComment =
        true;


    setCommentLoading(
        true
    );


    try {

        const postRef =
            getBoardDocument(
                selectedPost.id
            );


        const commentRef =
            doc(

                getCommentCollection(
                    selectedPost.id
                )

            );


        const nickname =
            createAnonymousNickname(
                loginUser
            );


        const createdAtMs =
            Date.now();


        await runTransaction(

            db,

            async transaction => {

                const postSnapshot =
                    await transaction.get(
                        postRef
                    );


                if (
                    !postSnapshot.exists()
                ) {

                    throw new Error(
                        "해당 공지가 존재하지 않습니다."
                    );

                }


                if (
                    postSnapshot.data()
                        ?.allowComments === false
                ) {

                    throw new Error(
                        "댓글이 허용되지 않은 공지입니다."
                    );

                }


                transaction.set(

                    commentRef,

                    {
                        memberNo:
                            memberNo,

                        nickname:
                            nickname,

                        text:
                            text,

                        createdAt:
                            serverTimestamp(),

                        createdAtMs:
                            createdAtMs,

                        displayTime:
                            getNowLabel()
                    }

                );


                transaction.update(

                    postRef,

                    {
                        commentCount:
                            increment(
                                1
                            ),

                        updatedAt:
                            serverTimestamp(),

                        updatedAtMs:
                            createdAtMs
                    }

                );

            }

        );


        if (
            noticeCommentInput
        ) {

            noticeCommentInput.value =
                "";


            resizeTextarea(

                noticeCommentInput,

                48,

                120

            );

        }


        selectedPost.commentCount =

            Number(
                selectedPost.commentCount ||
                0
            ) +
            1;


        updatePostInMemory(
            selectedPost
        );


        showToast(
            "댓글이 등록되었습니다."
        );


        await loadComments();

    }

    catch (error) {

        console.error(

            "댓글 등록 오류:",

            error

        );


        showToast(

            getFirebaseErrorMessage(

                error,

                "댓글을 등록하지 못했습니다."

            )

        );

    }

    finally {

        isSendingComment =
            false;


        setCommentLoading(
            false
        );

    }

}


/*==================================================
댓글 등록 버튼 상태
==================================================*/

function setCommentLoading(
    isLoading
) {

    if (
        !noticeCommentSendBtn
    ) {

        return;

    }


    noticeCommentSendBtn.disabled =
        isLoading;


    noticeCommentSendBtn.textContent =

        isLoading
            ? "등록 중"
            : "등록";

}


/*==================================================
비실명 댓글 이름
==================================================*/

function createAnonymousNickname(
    user
) {

    const favoriteWord =
        cleanText(
            user?.favoriteWord
        )
            .replace(
                /\s+/g,
                ""
            )
            .slice(
                0,
                4
            ) ||
        "은혜";


    const name =
        cleanText(
            user?.name
        )
            .replace(
                /\s+/g,
                ""
            );


    const hiddenName =

        name
            ? name.charAt(0) +
              "**"
            : "성**";


    return (

        favoriteWord +
        " " +
        hiddenName

    );

}


/*==================================================
새 공지 작성창 열기
==================================================*/

function openNewWriteOverlay() {

    if (
        !canWriteBoard()
    ) {

        showToast(
            "공지를 등록할 권한이 없습니다."
        );


        return;

    }


    openWriteOverlay(
        null
    );

}


/*==================================================
작성·수정창 열기
==================================================*/

function openWriteOverlay(
    post
) {

    editingPost =
        post ||
        null;


    selectedImageFile =
        null;


    removeExistingImage =
        false;


    clearSelectedPreviewUrl();


    resetWriteForm();


    if (
        editingPost
    ) {

        fillWriteForm(
            editingPost
        );

    }


    if (
        noticeWriteHeaderTitle
    ) {

        noticeWriteHeaderTitle.textContent =

            editingPost
                ? "공지 수정"
                : "새 공지 등록";

    }


    noticeWriteOverlay?.classList.remove(
        "hidden"
    );


    noticeDetailOverlay?.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    window.setTimeout(

        () => {

            noticeWriteTitle?.focus();

        },

        100

    );

}


/*==================================================
작성폼 초기화
==================================================*/

function resetWriteForm() {

    if (
        noticeWriteTitle
    ) {

        noticeWriteTitle.value =
            "";

    }


    if (
        noticeWriteText
    ) {

        noticeWriteText.value =
            "";

    }


    const today =
        getTodayKey();


    if (
        noticePublishDate
    ) {

        noticePublishDate.value =
            today;

    }


    if (
        noticeUntil
    ) {

        noticeUntil.value =
            addDaysToDateString(

                today,

                DEFAULT_NOTICE_DAYS

            );

    }


    if (
        noticePinned
    ) {

        noticePinned.checked =
            false;

    }


    if (
        noticeSendIndexNotice
    ) {

        noticeSendIndexNotice.checked =
            false;

    }


    if (
        noticeAllowComments
    ) {

        noticeAllowComments.checked =
            true;

    }


    if (
        noticeSaveToArchive
    ) {

        noticeSaveToArchive.checked =
            false;

    }


    if (
        noticeArchiveMainCategory
    ) {

        noticeArchiveMainCategory.value =
            "";

    }


    resetArchiveSubCategory();


    noticeCustomCategoryBox?.classList.add(
        "hidden"
    );


    if (
        noticeCustomCategoryName
    ) {

        noticeCustomCategoryName.value =
            "";

    }


    if (
        noticeCustomCategoryIcon
    ) {

        noticeCustomCategoryIcon.value =
            "";

    }


    if (
        noticeArchiveUntil
    ) {

        noticeArchiveUntil.value =
            addDaysToDateString(

                today,

                DEFAULT_ARCHIVE_DAYS

            );


        noticeArchiveUntil.disabled =
            false;

    }


    if (
        noticePermanent
    ) {

        noticePermanent.checked =
            false;

    }


    updateArchiveOptionVisibility();


    if (
        noticeImageInput
    ) {

        noticeImageInput.value =
            "";

    }


    hideImagePreview();


    if (
        noticePdfUrl
    ) {

        noticePdfUrl.value =
            "";

    }


    if (
        noticePdfNameInput
    ) {

        noticePdfNameInput.value =
            "";

    }


    if (
        noticeVideoUrl
    ) {

        noticeVideoUrl.value =
            "";

    }


    if (
        noticeVideoNameInput
    ) {

        noticeVideoNameInput.value =
            "";

    }


    if (
        noticeLinkUrl
    ) {

        noticeLinkUrl.value =
            "";

    }


    if (
        noticeLinkNameInput
    ) {

        noticeLinkNameInput.value =
            "";

    }

}


/*==================================================
자료실 세부영역 표시
==================================================*/

function updateArchiveOptionVisibility() {

    const enabled =
        noticeSaveToArchive?.checked ===
        true;


    noticeArchiveOptions?.classList.toggle(

        "hidden",

        !enabled

    );


    if (
        !enabled
    ) {

        noticeCustomCategoryBox?.classList.add(
            "hidden"
        );

    }

}


/*==================================================
자료실 소분류 초기화
==================================================*/

function resetArchiveSubCategory() {

    if (
        !noticeArchiveSubCategory
    ) {

        return;

    }


    noticeArchiveSubCategory.innerHTML = `

        <option value="">

            먼저 대분류를 선택하세요.

        </option>

    `;


    noticeArchiveSubCategory.disabled =
        true;

}


/*==================================================
대분류에 따른 소분류 표시
==================================================*/

function updateArchiveSubCategoryOptions(
    selectedValue = ""
) {

    if (
        !noticeArchiveMainCategory ||
        !noticeArchiveSubCategory
    ) {

        return;

    }


    const mainKey =
        cleanText(
            noticeArchiveMainCategory.value
        );


    const group =
        ARCHIVE_CATEGORY_GROUPS[
            mainKey
        ];


    const isCustom =
        mainKey ===
        "custom";


    noticeCustomCategoryBox?.classList.toggle(

        "hidden",

        !isCustom

    );


    if (
        !group ||
        isCustom
    ) {

        noticeArchiveSubCategory.innerHTML = `

            <option value="">

                사용자 자료실 이름을 입력하세요.

            </option>

        `;


        noticeArchiveSubCategory.disabled =
            true;


        return;

    }


    noticeArchiveSubCategory.innerHTML = `

        <option value="">

            소분류를 선택하세요.

        </option>

    `;


    group.items.forEach(

        item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.key;


            option.textContent =

                item.icon +
                " " +
                item.name;


            noticeArchiveSubCategory.appendChild(
                option
            );

        }

    );


    noticeArchiveSubCategory.disabled =
        false;


    if (
        selectedValue
    ) {

        noticeArchiveSubCategory.value =
            selectedValue;

    }

}


/*==================================================
수정 자료 작성폼에 표시
==================================================*/

function fillWriteForm(
    post
) {

    if (
        noticeWriteTitle
    ) {

        noticeWriteTitle.value =
            cleanText(
                post.title
            );

    }


    if (
        noticeWriteText
    ) {

        noticeWriteText.value =
            cleanText(
                post.content
            );

    }


    if (
        noticePublishDate
    ) {

        noticePublishDate.value =

            cleanText(
                post.publishDate
            ) ||
            getTodayKey();

    }


    if (
        noticeUntil
    ) {

        noticeUntil.value =
            cleanText(
                post.noticeUntil
            );

    }


    if (
        noticePinned
    ) {

        noticePinned.checked =
            post.pinned ===
            true;

    }


    if (
        noticeSendIndexNotice
    ) {

        noticeSendIndexNotice.checked =
            post.sendIndexNotice ===
            true;

    }


    if (
        noticeAllowComments
    ) {

        noticeAllowComments.checked =
            post.allowComments !==
            false;

    }


    const saveToArchive =
        post.saveToArchive ===
        true;


    if (
        noticeSaveToArchive
    ) {

        noticeSaveToArchive.checked =
            saveToArchive;

    }


    updateArchiveOptionVisibility();


    if (
        saveToArchive
    ) {

        fillArchiveCategory(
            post
        );

    }


    if (
        noticeArchiveUntil
    ) {

        noticeArchiveUntil.value =
            cleanText(

                post.archiveUntil ||
                post.expireDate

            );


        noticeArchiveUntil.disabled =
            post.permanent ===
            true;

    }


    if (
        noticePermanent
    ) {

        noticePermanent.checked =
            post.permanent ===
            true;

    }


    if (
        noticePdfUrl
    ) {

        noticePdfUrl.value =
            cleanText(
                post.pdfUrl
            );

    }


    if (
        noticePdfNameInput
    ) {

        noticePdfNameInput.value =
            cleanText(
                post.pdfName
            );

    }


    if (
        noticeVideoUrl
    ) {

        noticeVideoUrl.value =
            cleanText(
                post.videoUrl
            );

    }


    if (
        noticeVideoNameInput
    ) {

        noticeVideoNameInput.value =
            cleanText(
                post.videoName
            );

    }


    if (
        noticeLinkUrl
    ) {

        noticeLinkUrl.value =
            cleanText(
                post.linkUrl
            );

    }


    if (
        noticeLinkNameInput
    ) {

        noticeLinkNameInput.value =
            cleanText(
                post.linkName
            );

    }


    const imageUrl =
        cleanText(
            post.imageUrl
        );


    if (
        isSafeHttpUrl(
            imageUrl
        )
    ) {

        showImagePreview(
            imageUrl
        );

    }

}


/*==================================================
기존 자료실 분류 표시
==================================================*/

function fillArchiveCategory(
    post
) {

    const categoryKey =
        cleanCategoryKey(
            post.category
        );


    const info =
        ARCHIVE_CATEGORY_LOOKUP[
            categoryKey
        ];


    if (
        info
    ) {

        if (
            noticeArchiveMainCategory
        ) {

            noticeArchiveMainCategory.value =
                info.mainKey;

        }


        updateArchiveSubCategoryOptions(
            categoryKey
        );


        return;

    }


    if (
        noticeArchiveMainCategory
    ) {

        noticeArchiveMainCategory.value =
            "custom";

    }


    updateArchiveSubCategoryOptions();


    if (
        noticeCustomCategoryName
    ) {

        noticeCustomCategoryName.value =

            cleanText(
                post.categoryName
            ) ||
            "교회 자료";

    }


    if (
        noticeCustomCategoryIcon
    ) {

        noticeCustomCategoryIcon.value =

            cleanText(
                post.categoryIcon
            ) ||
            "📂";

    }

}


/*==================================================
URL 분류 자동선택

다른 화면에서 특정 분류로
공지 작성창을 열 때 사용 가능
==================================================*/

function selectArchiveCategoryInForm(
    categoryKey,
    fallbackName = ""
) {

    const info =
        ARCHIVE_CATEGORY_LOOKUP[
            categoryKey
        ];


    if (
        info
    ) {

        if (
            noticeArchiveMainCategory
        ) {

            noticeArchiveMainCategory.value =
                info.mainKey;

        }


        updateArchiveSubCategoryOptions(
            categoryKey
        );


        return;

    }


    if (
        noticeArchiveMainCategory
    ) {

        noticeArchiveMainCategory.value =
            "custom";

    }


    updateArchiveSubCategoryOptions();


    if (
        noticeCustomCategoryName
    ) {

        noticeCustomCategoryName.value =

            fallbackName ||
            "교회 자료";

    }

}


/*==================================================
작성창 닫기
==================================================*/

function closeWriteOverlay() {

    noticeWriteOverlay?.classList.add(
        "hidden"
    );


    clearSelectedPreviewUrl();


    selectedImageFile =
        null;


    removeExistingImage =
        false;


    const returnToDetail =
        Boolean(

            editingPost &&
            selectedPost

        );


    editingPost =
        null;


    if (
        returnToDetail
    ) {

        noticeDetailOverlay?.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";

    }

    else {

        document.body.style.overflow =
            "";

    }

}


/*==================================================
사진 선택
==================================================*/

function handleImageSelect() {

    const file =
        noticeImageInput
            ?.files
            ?.[0];


    if (!file) {

        selectedImageFile =
            null;


        return;

    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showToast(
            "사진 파일만 선택할 수 있습니다."
        );


        noticeImageInput.value =
            "";


        return;

    }


    if (
        file.size >
        MAX_IMAGE_SIZE
    ) {

        showToast(
            "사진은 10MB 이하만 선택해 주세요."
        );


        noticeImageInput.value =
            "";


        return;

    }


    selectedImageFile =
        file;


    removeExistingImage =
        false;


    clearSelectedPreviewUrl();


    selectedImagePreviewUrl =
        URL.createObjectURL(
            file
        );


    showImagePreview(
        selectedImagePreviewUrl
    );

}


/*==================================================
사진 미리보기
==================================================*/

function showImagePreview(
    url
) {

    if (
        !noticeImagePreview ||
        !noticeImagePreviewImg
    ) {

        return;

    }


    noticeImagePreviewImg.src =
        url;


    noticeImagePreview.classList.remove(
        "hidden"
    );

}


/*==================================================
사진 미리보기 숨김
==================================================*/

function hideImagePreview() {

    noticeImagePreview?.classList.add(
        "hidden"
    );


    noticeImagePreviewImg?.removeAttribute(
        "src"
    );

}


/*==================================================
선택 사진 삭제
==================================================*/

function removeSelectedImage() {

    selectedImageFile =
        null;


    removeExistingImage =
        Boolean(

            editingPost?.imageUrl ||
            editingPost?.imagePath

        );


    if (
        noticeImageInput
    ) {

        noticeImageInput.value =
            "";

    }


    clearSelectedPreviewUrl();


    hideImagePreview();

}


/*==================================================
Object URL 해제
==================================================*/

function clearSelectedPreviewUrl() {

    if (
        !selectedImagePreviewUrl
    ) {

        return;

    }


    URL.revokeObjectURL(
        selectedImagePreviewUrl
    );


    selectedImagePreviewUrl =
        "";

}


/*==================================================
작성 자료실 분류 확인
==================================================*/

function getArchiveCategorySelection() {

    if (
        noticeSaveToArchive?.checked !==
        true
    ) {

        return null;

    }


    const mainKey =
        cleanText(
            noticeArchiveMainCategory?.value
        );


    if (!mainKey) {

        showToast(
            "자료실 대분류를 선택하세요."
        );


        noticeArchiveMainCategory?.focus();


        return false;

    }


    if (
        mainKey ===
        "custom"
    ) {

        const customName =
            cleanText(
                noticeCustomCategoryName?.value
            );


        const customIcon =

            cleanText(
                noticeCustomCategoryIcon?.value
            ) ||
            "📂";


        if (
            !customName
        ) {

            showToast(
                "새 자료실 이름을 입력하세요."
            );


            noticeCustomCategoryName?.focus();


            return false;

        }


        const existingKey =
            cleanCategoryKey(
                editingPost?.category
            );


        return {

            mainKey:
                "custom",

            mainName:
                ARCHIVE_CATEGORY_GROUPS
                    .custom
                    .name,

            key:
                existingKey.startsWith(
                    "custom_"
                )

                    ? existingKey

                    : createCustomCategoryKey(
                        customName
                    ),

            name:
                customName,

            icon:
                customIcon

        };

    }


    const group =
        ARCHIVE_CATEGORY_GROUPS[
            mainKey
        ];


    const subKey =
        cleanCategoryKey(
            noticeArchiveSubCategory?.value
        );


    if (!subKey) {

        showToast(
            "자료실 소분류를 선택하세요."
        );


        noticeArchiveSubCategory?.focus();


        return false;

    }


    const item =
        group?.items.find(

            value =>
                value.key ===
                subKey

        );


    if (
        !item
    ) {

        showToast(
            "자료실 분류를 다시 선택하세요."
        );


        return false;

    }


    return {

        mainKey:
            mainKey,

        mainName:
            group.name,

        key:
            item.key,

        name:
            item.name,

        icon:
            item.icon

    };

}


/*==================================================
공지 저장

매우 중요

Firebase에는 아래 공지 원본 하나만 저장합니다.

churchBoards/{postId}

예톡 개인홈에 별도 공지문서 생성 안 함.

sendIndexNotice 값은
"개인홈에도 알려줄 공지인가?"를 나타내는
원본 게시글의 속성일 뿐입니다.

개인홈 index.js가 이 원본을 읽은 뒤
각 기기의 LocalStorage에 읽음상태를 저장합니다.

자료실도 별도 복사하지 않고
category 값으로 같은 공지를 불러옵니다.
==================================================*/

async function savePost() {

    if (
        isSavingPost ||
        !canWriteBoard()
    ) {

        return;

    }


    const title =
        cleanText(
            noticeWriteTitle?.value
        );


    const content =
        cleanText(
            noticeWriteText?.value
        );


    const publishDate =

        cleanText(
            noticePublishDate?.value
        ) ||
        getTodayKey();


    const noticeEndDate =
        cleanText(
            noticeUntil?.value
        );


    const saveToArchive =
        noticeSaveToArchive?.checked ===
        true;


    const categorySelection =
        getArchiveCategorySelection();


    if (
        saveToArchive &&
        categorySelection === false
    ) {

        return;

    }


    const permanent =

        saveToArchive &&

        noticePermanent?.checked ===
        true;


    const archiveEndDate =

        saveToArchive &&
        !permanent

            ? cleanText(
                noticeArchiveUntil?.value
            )

            : "";


    const pdfUrl =
        cleanText(
            noticePdfUrl?.value
        );


    const videoUrl =
        cleanText(
            noticeVideoUrl?.value
        );


    const linkUrl =
        cleanText(
            noticeLinkUrl?.value
        );


    if (
        !title
    ) {

        showToast(
            "공지 제목을 입력하세요."
        );


        noticeWriteTitle?.focus();


        return;

    }


    if (
        title.length >
        100
    ) {

        showToast(
            "제목은 100자 이하로 작성해 주세요."
        );


        return;

    }


    if (
        content.length >
        5000
    ) {

        showToast(
            "내용은 5,000자 이하로 작성해 주세요."
        );


        return;

    }


    if (
        noticeEndDate &&
        noticeEndDate <
        publishDate
    ) {

        showToast(
            "공지 종료일은 게시일보다 빠를 수 없습니다."
        );


        noticeUntil?.focus();


        return;

    }


    if (
        saveToArchive &&
        !permanent &&
        archiveEndDate &&
        archiveEndDate <
        publishDate
    ) {

        showToast(
            "자료실 보관 종료일은 게시일보다 빠를 수 없습니다."
        );


        noticeArchiveUntil?.focus();


        return;

    }


    if (
        pdfUrl &&
        !isSafeHttpUrl(
            pdfUrl
        )
    ) {

        showToast(
            "PDF 또는 문서 주소를 확인해 주세요."
        );


        noticePdfUrl?.focus();


        return;

    }


    if (
        videoUrl &&
        !isSafeHttpUrl(
            videoUrl
        )
    ) {

        showToast(
            "영상 주소를 확인해 주세요."
        );


        noticeVideoUrl?.focus();


        return;

    }


    if (
        linkUrl &&
        !isSafeHttpUrl(
            linkUrl
        )
    ) {

        showToast(
            "외부 연결 주소를 확인해 주세요."
        );


        noticeLinkUrl?.focus();


        return;

    }


    isSavingPost =
        true;


    setSaveLoading(
        true
    );


    try {

        const postId =

            editingPost?.id ||
            createDocumentId();


        const postRef =
            getBoardDocument(
                postId
            );


        let imageUrl =
            cleanText(
                editingPost?.imageUrl
            );


        let imagePath =
            cleanText(
                editingPost?.imagePath
            );


        if (
            removeExistingImage
        ) {

            await deleteStorageImageSafely(
                imagePath
            );


            imageUrl =
                "";


            imagePath =
                "";

        }


        if (
            selectedImageFile
        ) {

            if (
                imagePath
            ) {

                await deleteStorageImageSafely(
                    imagePath
                );

            }


            const uploaded =
                await uploadBoardImage(

                    selectedImageFile,

                    postId

                );


            imageUrl =
                uploaded.url;


            imagePath =
                uploaded.path;

        }


        const isNew =
            !editingPost;


        const nowMs =
            Date.now();


        const data = {

            churchId:
                currentChurchId,

            churchName:
                currentChurchName,


            /*==================================================
            일반 공지
            ==================================================*/

            title:
                title,

            content:
                content,

            publishDate:
                publishDate,

            publishDateMs:
                getStartOfDateMs(
                    publishDate
                ),

            noticeUntil:
                noticeEndDate,

            showInNotice:
                true,

            pinned:
                noticePinned?.checked ===
                true,

            /*
            개인 예톡홈에
            새 공지 표시를 할지 여부

            별도 Firebase 저장 안 함.
            */

            sendIndexNotice:
                noticeSendIndexNotice?.checked ===
                true,

            allowComments:
                noticeAllowComments?.checked !==
                false,


            /*==================================================
            자료실 보관

            게시글 복사하지 않고
            아래 값으로 같은 원본을 분류
            ==================================================*/

            saveToArchive:
                saveToArchive,

            archiveMainCategory:

                saveToArchive
                    ? categorySelection.mainKey
                    : "",

            archiveMainCategoryName:

                saveToArchive
                    ? categorySelection.mainName
                    : "",

            category:

                saveToArchive
                    ? categorySelection.key
                    : "",

            categoryName:

                saveToArchive
                    ? categorySelection.name
                    : "",

            categoryIcon:

                saveToArchive
                    ? categorySelection.icon
                    : "",

            archiveUntil:
                archiveEndDate,

            expireDate:
                archiveEndDate,

            permanent:
                permanent,


            /*==================================================
            첨부
            ==================================================*/

            imageUrl:
                imageUrl,

            imagePath:
                imagePath,

            pdfUrl:
                pdfUrl,

            pdfName:
                cleanText(
                    noticePdfNameInput?.value
                ),

            videoUrl:
                videoUrl,

            videoName:
                cleanText(
                    noticeVideoNameInput?.value
                ),

            linkUrl:
                linkUrl,

            linkName:
                cleanText(
                    noticeLinkNameInput?.value
                ),


            /*==================================================
            작성자
            ==================================================*/

            writerMemberNo:

                editingPost?.writerMemberNo ||
                loginUser?.memberNo ||
                "",

            writerName:

                editingPost?.writerName ||
                loginUser?.name ||
                "교회 관리자",

            writerRole:

                editingPost?.writerRole ||
                loginUser?.role ||
                "member",


            /*==================================================
            상태
            ==================================================*/

            status:
                "active",

            updatedAt:
                serverTimestamp(),

            updatedAtMs:
                nowMs

        };


        if (
            isNew
        ) {

            data.createdAt =
                serverTimestamp();


            data.createdAtMs =
                nowMs;


            data.commentCount =
                0;

        }


        /*
        핵심

        Firebase 공지 저장은
        이 setDoc 한 번뿐입니다.
        */

        await setDoc(

            postRef,

            data,

            {
                merge:
                    true
            }

        );


        showToast(

            isNew
                ? "공지가 등록되었습니다."
                : "공지가 수정되었습니다."

        );


        noticeWriteOverlay?.classList.add(
            "hidden"
        );


        noticeDetailOverlay?.classList.add(
            "hidden"
        );


        editingPost =
            null;


        selectedPost =
            null;


        selectedImageFile =
            null;


        removeExistingImage =
            false;


        clearSelectedPreviewUrl();


        document.body.style.overflow =
            "";


        await loadNoticePosts(
            true
        );

    }

    catch (error) {

        console.error(

            "공지 저장 오류:",

            error

        );


        showToast(

            getFirebaseErrorMessage(

                error,

                "공지를 저장하지 못했습니다."

            )

        );

    }

    finally {

        isSavingPost =
            false;


        setSaveLoading(
            false
        );

    }

}


/*==================================================
저장 버튼 상태
==================================================*/

function setSaveLoading(
    isLoading
) {

    if (
        !noticeWriteSaveBtn
    ) {

        return;

    }


    noticeWriteSaveBtn.disabled =
        isLoading;


    noticeWriteSaveBtn.textContent =

        isLoading
            ? "저장 중"
            : "저장";

}


/*==================================================
CHATNOTICE.JS 2/3 끝

다음 3/3

- 사진 Storage 업로드
- 사진 삭제
- 공지 수정·삭제
- 댓글 전체삭제
- 이벤트 연결
- 날짜 처리
- 입력창 자동높이
- HTML 안전처리
- Firebase 오류
- 토스트
==================================================*/
/*==================================================
YETALK CHATNOTICE.JS

공지알림 통합본 3/3

2/3 바로 아래에 이어 붙입니다.

이번 구간

1. 사진 Storage 업로드
2. 사진 안전 삭제
3. 수정·삭제
4. 댓글 전체 삭제
5. 메모리 갱신
6. 이벤트 연결
7. 날짜 처리
8. 입력창 자동 높이
9. HTML 안전 처리
10. Firebase 오류 안내
11. 토스트

중요

- 공지 원본은 Firebase에 1개만 저장
- 개인홈 알림상태는 LocalStorage
- 자료실은 같은 원본 category로 표시
==================================================*/


/*==================================================
사진 업로드
==================================================*/

async function uploadBoardImage(
    file,
    postId
) {

    const safeChurchId =
        makeSafePathPart(
            currentChurchId
        );


    const safePostId =
        makeSafePathPart(
            postId
        );


    const safeFileName =
        makeSafeFileName(
            file.name
        );


    const path =

        "churchBoards/" +
        safeChurchId +
        "/" +
        safePostId +
        "/" +
        Date.now() +
        "_" +
        safeFileName;


    const imageReference =
        ref(
            storage,
            path
        );


    await uploadBytes(

        imageReference,

        file,

        {
            contentType:
                file.type ||
                "image/jpeg"
        }

    );


    const url =
        await getDownloadURL(
            imageReference
        );


    return {

        url:
            url,

        path:
            path

    };

}


/*==================================================
Storage 사진 안전 삭제
==================================================*/

async function deleteStorageImageSafely(
    imagePath
) {

    const path =
        cleanText(
            imagePath
        );


    if (!path) {

        return;

    }


    try {

        await deleteObject(

            ref(
                storage,
                path
            )

        );

    }

    catch (error) {

        console.warn(

            "사진 삭제 실패:",

            error

        );

    }

}


/*==================================================
수정창 열기
==================================================*/

function openEditPost() {

    if (
        !selectedPost ||
        !canManagePost(
            selectedPost
        )
    ) {

        showToast(
            "공지를 수정할 권한이 없습니다."
        );


        return;

    }


    openWriteOverlay(
        selectedPost
    );

}


/*==================================================
삭제 확인 열기
==================================================*/

function openDeleteConfirm() {

    if (
        !selectedPost ||
        !canManagePost(
            selectedPost
        )
    ) {

        showToast(
            "공지를 삭제할 권한이 없습니다."
        );


        return;

    }


    noticeConfirmOverlay?.classList.remove(
        "hidden"
    );

}


/*==================================================
삭제 확인 닫기
==================================================*/

function closeDeleteConfirm() {

    noticeConfirmOverlay?.classList.add(
        "hidden"
    );

}


/*==================================================
공지 삭제
==================================================*/

async function deleteSelectedPost() {

    if (
        isDeletingPost ||
        !selectedPost ||
        !canManagePost(
            selectedPost
        )
    ) {

        return;

    }


    isDeletingPost =
        true;


    setDeleteLoading(
        true
    );


    try {

        const postId =
            selectedPost.id;


        const imagePath =
            cleanText(
                selectedPost.imagePath
            );


        /*
        댓글이 있으면 먼저 삭제
        */

        await deletePostComments(
            postId
        );


        /*
        공지 원본 삭제
        */

        await deleteDoc(
            getBoardDocument(
                postId
            )
        );


        /*
        대표사진이 있으면 Storage에서도 삭제
        */

        await deleteStorageImageSafely(
            imagePath
        );


        closeDeleteConfirm();


        closePostDetail();


        showToast(
            "공지가 삭제되었습니다."
        );


        await loadNoticePosts(
            true
        );

    }

    catch (error) {

        console.error(

            "공지 삭제 오류:",

            error

        );


        showToast(

            getFirebaseErrorMessage(

                error,

                "공지를 삭제하지 못했습니다."

            )

        );

    }

    finally {

        isDeletingPost =
            false;


        setDeleteLoading(
            false
        );

    }

}


/*==================================================
게시글 댓글 전체 삭제
==================================================*/

async function deletePostComments(
    postId
) {

    const snapshot =
        await getDocs(
            getCommentCollection(
                postId
            )
        );


    const deletePromises =
        [];


    snapshot.forEach(

        item => {

            deletePromises.push(

                deleteDoc(
                    item.ref
                )

            );

        }

    );


    if (
        deletePromises.length >
        0
    ) {

        await Promise.all(
            deletePromises
        );

    }

}


/*==================================================
삭제 버튼 상태
==================================================*/

function setDeleteLoading(
    isLoading
) {

    if (
        !noticeConfirmDeleteBtn
    ) {

        return;

    }


    noticeConfirmDeleteBtn.disabled =
        isLoading;


    noticeConfirmDeleteBtn.textContent =

        isLoading
            ? "삭제 중"
            : "삭제";

}


/*==================================================
메모리 게시글 갱신
==================================================*/

function updatePostInMemory(
    updatedPost
) {

    const updateArray =
        array => {

            const index =
                array.findIndex(

                    item =>
                        item.id ===
                        updatedPost.id

                );


            if (
                index >=
                0
            ) {

                array[index] = {

                    ...array[index],

                    ...updatedPost

                };

            }

        };


    updateArray(
        loadedPosts
    );


    updateArray(
        visiblePosts
    );

}


/*==================================================
기본 이벤트 연결
==================================================*/

function bindBasicEvents() {

    noticeBackBtn?.addEventListener(

        "click",

        () => {

            history.back();

        }

    );


    noticeSearchHeaderBtn?.addEventListener(

        "click",

        openSearchArea

    );


    noticeAllBtn?.addEventListener(

        "click",

        () => {

            changeFilter(
                "all"
            );

        }

    );


    noticeImportantBtn?.addEventListener(

        "click",

        () => {

            changeFilter(
                "important"
            );

        }

    );


    noticeNewBtn?.addEventListener(

        "click",

        () => {

            changeFilter(
                "new"
            );

        }

    );


    noticeArchiveBtn?.addEventListener(

        "click",

        openAllArchiveBoards

    );


    noticeSearchCloseBtn?.addEventListener(

        "click",

        closeSearchArea

    );


    noticeSearchClearBtn?.addEventListener(

        "click",

        clearSearchInput

    );


    noticeSearchInput?.addEventListener(

        "input",

        () => {

            const hasText =
                Boolean(
                    noticeSearchInput.value.trim()
                );


            noticeSearchClearBtn?.classList.toggle(

                "hidden",

                !hasText

            );


            applyCurrentFilter();

        }

    );


    noticeRefreshBtn?.addEventListener(

        "click",

        async () => {

            await loadNoticePosts(
                true
            );


            showToast(
                "공지를 새로 불러왔습니다."
            );

        }

    );


    noticeMoreBtn?.addEventListener(

        "click",

        async () => {

            currentLoadLimit =
                Math.min(

                    MAX_LOAD_LIMIT,

                    currentLoadLimit +
                    MORE_LOAD_LIMIT

                );


            await loadNoticePosts(
                false
            );

        }

    );


    noticeWriteBtn?.addEventListener(

        "click",

        openNewWriteOverlay

    );


    noticeDetailBackBtn?.addEventListener(

        "click",

        closePostDetail

    );


    noticeDetailMenuBtn?.addEventListener(

        "click",

        () => {

            noticeDetailAdminArea
                ?.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

        }

    );


    noticeCategoryBoardBtn?.addEventListener(

        "click",

        openSelectedArchiveBoard

    );


    noticeDetailEditBtn?.addEventListener(

        "click",

        openEditPost

    );


    noticeDetailDeleteBtn?.addEventListener(

        "click",

        openDeleteConfirm

    );


    noticeCommentRefreshBtn?.addEventListener(

        "click",

        async () => {

            await loadComments();


            showToast(
                "댓글을 새로 불러왔습니다."
            );

        }

    );


    noticeCommentSendBtn?.addEventListener(

        "click",

        sendComment

    );


    noticeCommentInput?.addEventListener(

        "input",

        () => {

            resizeTextarea(

                noticeCommentInput,

                48,

                120

            );

        }

    );


    noticeCommentInput?.addEventListener(

        "keydown",

        event => {

            if (
                event.key ===
                    "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();


                sendComment();

            }

        }

    );


    noticeWriteCloseBtn?.addEventListener(

        "click",

        closeWriteOverlay

    );


    noticeWriteSaveBtn?.addEventListener(

        "click",

        savePost

    );


    noticeSaveToArchive?.addEventListener(

        "change",

        updateArchiveOptionVisibility

    );


    noticeArchiveMainCategory
        ?.addEventListener(

            "change",

            () => {

                updateArchiveSubCategoryOptions();

            }

        );


    noticePublishDate?.addEventListener(

        "change",

        handlePublishDateChange

    );


    noticePermanent?.addEventListener(

        "change",

        handlePermanentChange

    );


    noticeImageInput?.addEventListener(

        "change",

        handleImageSelect

    );


    noticeImageRemoveBtn?.addEventListener(

        "click",

        removeSelectedImage

    );


    noticeConfirmCancelBtn?.addEventListener(

        "click",

        closeDeleteConfirm

    );


    noticeConfirmDeleteBtn?.addEventListener(

        "click",

        deleteSelectedPost

    );


    noticeConfirmOverlay?.addEventListener(

        "click",

        event => {

            if (
                event.target ===
                noticeConfirmOverlay
            ) {

                closeDeleteConfirm();

            }

        }

    );


    document.addEventListener(

        "keydown",

        handleEscapeKey

    );

}


/*==================================================
게시일 변경
==================================================*/

function handlePublishDateChange() {

    const publishDate =
        cleanText(
            noticePublishDate?.value
        );


    if (
        !publishDate
    ) {

        return;

    }


    if (
        noticeUntil &&
        !noticeUntil.value
    ) {

        noticeUntil.value =
            addDaysToDateString(

                publishDate,

                DEFAULT_NOTICE_DAYS

            );

    }


    if (
        noticeArchiveUntil &&
        !noticeArchiveUntil.value &&
        noticePermanent?.checked !==
            true
    ) {

        noticeArchiveUntil.value =
            addDaysToDateString(

                publishDate,

                DEFAULT_ARCHIVE_DAYS

            );

    }

}


/*==================================================
장기보관 변경
==================================================*/

function handlePermanentChange() {

    if (
        !noticeArchiveUntil
    ) {

        return;

    }


    const permanent =
        noticePermanent?.checked ===
        true;


    noticeArchiveUntil.disabled =
        permanent;


    if (
        permanent
    ) {

        noticeArchiveUntil.value =
            "";

    }

    else if (
        !noticeArchiveUntil.value
    ) {

        noticeArchiveUntil.value =
            addDaysToDateString(

                noticePublishDate?.value ||
                getTodayKey(),

                DEFAULT_ARCHIVE_DAYS

            );

    }

}


/*==================================================
ESC 키
==================================================*/

function handleEscapeKey(
    event
) {

    if (
        event.key !==
        "Escape"
    ) {

        return;

    }


    if (
        !noticeConfirmOverlay
            ?.classList
            .contains(
                "hidden"
            )
    ) {

        closeDeleteConfirm();


        return;

    }


    if (
        !noticeWriteOverlay
            ?.classList
            .contains(
                "hidden"
            )
    ) {

        closeWriteOverlay();


        return;

    }


    if (
        !noticeDetailOverlay
            ?.classList
            .contains(
                "hidden"
            )
    ) {

        closePostDetail();


        return;

    }


    if (
        !noticeSearchArea
            ?.classList
            .contains(
                "hidden"
            )
    ) {

        closeSearchArea();

    }

}


/*==================================================
오늘 날짜
==================================================*/

function getTodayKey() {

    const now =
        new Date();


    return (

        now.getFullYear() +
        "-" +

        String(
            now.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            ) +
        "-" +

        String(
            now.getDate()
        )
            .padStart(
                2,
                "0"
            )

    );

}


/*==================================================
날짜 더하기
==================================================*/

function addDaysToDateString(
    dateValue,
    days
) {

    const date =
        new Date(

            dateValue +
            "T12:00:00"

        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return getTodayKey();

    }


    date.setDate(

        date.getDate() +
        Number(
            days ||
            0
        )

    );


    return (

        date.getFullYear() +
        "-" +

        String(
            date.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            ) +
        "-" +

        String(
            date.getDate()
        )
            .padStart(
                2,
                "0"
            )

    );

}


/*==================================================
날짜 시작 시각
==================================================*/

function getStartOfDateMs(
    dateValue
) {

    const date =
        new Date(

            dateValue +
            "T00:00:00"

        );


    const time =
        date.getTime();


    return Number.isFinite(
        time
    )
        ? time
        : Date.now();

}


/*==================================================
게시글 날짜 표시
==================================================*/

function formatPostDate(
    post
) {

    const publishDate =
        cleanText(
            post?.publishDate
        );


    if (
        publishDate
    ) {

        return formatDateString(
            publishDate
        );

    }


    const dateMs =
        getPostDateMs(
            post
        );


    if (
        !dateMs
    ) {

        return "";

    }


    return formatDateObject(

        new Date(
            dateMs
        )

    );

}


/*==================================================
YYYY-MM-DD 표시
==================================================*/

function formatDateString(
    value
) {

    const parts =
        String(
            value ||
            ""
        )
            .split(
                "-"
            );


    if (
        parts.length !==
        3
    ) {

        return value;

    }


    return (

        Number(
            parts[0]
        ) +
        "." +

        Number(
            parts[1]
        ) +
        "." +

        Number(
            parts[2]
        )

    );

}


/*==================================================
Date 표시
==================================================*/

function formatDateObject(
    date
) {

    if (
        !(date instanceof Date) ||
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return (

        date.getFullYear() +
        "." +

        (
            date.getMonth() +
            1
        ) +
        "." +

        date.getDate()

    );

}


/*==================================================
현재 시각
==================================================*/

function getNowLabel() {

    const now =
        new Date();


    let hour =
        now.getHours();


    const minute =
        String(
            now.getMinutes()
        )
            .padStart(
                2,
                "0"
            );


    const period =

        hour >= 12
            ? "오후"
            : "오전";


    if (
        hour ===
        0
    ) {

        hour =
            12;

    }

    else if (
        hour >
        12
    ) {

        hour -=
            12;

    }


    return (

        period +
        " " +
        hour +
        ":" +
        minute

    );

}


/*==================================================
문서 ID 생성
==================================================*/

function createDocumentId() {

    return (

        makeSafePathPart(
            currentChurchId
        ) +
        "_" +

        Date.now() +
        "_" +

        Math.random()
            .toString(
                36
            )
            .slice(
                2,
                8
            )

    );

}


/*==================================================
문서 ID 안전 처리
==================================================*/

function makeSafeDocumentId(
    value
) {

    return String(
        value ||
        "yetalk"
    )
        .normalize(
            "NFKC"
        )
        .trim()
        .replace(

            /[\/\\.#$\[\]\s]+/g,

            "_"

        )
        .slice(
            0,
            180
        ) ||
        "yetalk";

}


/*==================================================
Storage 경로 안전 처리
==================================================*/

function makeSafePathPart(
    value
) {

    return String(
        value ||
        "yetalk"
    )
        .normalize(
            "NFKC"
        )
        .trim()
        .replace(

            /[\/\\.#$\[\]\s]+/g,

            "_"

        )
        .slice(
            0,
            100
        ) ||
        "yetalk";

}


/*==================================================
파일명 안전 처리
==================================================*/

function makeSafeFileName(
    value
) {

    const cleaned =
        String(
            value ||
            "image.jpg"
        )
            .normalize(
                "NFKC"
            )
            .replace(

                /[^a-zA-Z0-9가-힣._-]/g,

                "_"

            )
            .slice(
                0,
                100
            );


    return (

        cleaned ||
        "image.jpg"

    );

}


/*==================================================
입력창 자동 높이
==================================================*/

function resizeTextarea(
    element,
    minimumHeight,
    maximumHeight
) {

    if (
        !element
    ) {

        return;

    }


    element.style.height =
        minimumHeight +
        "px";


    element.style.height =

        Math.min(

            element.scrollHeight,

            maximumHeight

        ) +
        "px";

}


/*==================================================
HTML 안전 처리
==================================================*/

function escapeHTML(
    value
) {

    return String(
        value ??
        ""
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
줄바꿈 처리
==================================================*/

function formatText(
    value
) {

    return escapeHTML(
        value
    )
        .replace(
            /\n/g,
            "<br>"
        );

}


/*==================================================
Firebase 오류 안내
==================================================*/

function getFirebaseErrorMessage(
    error,
    defaultMessage
) {

    const code =
        cleanText(
            error?.code
        );


    if (
        code ===
        "permission-denied"
    ) {

        return (

            "Firebase 접근 권한이 없습니다. " +
            "회원 권한과 보안 규칙을 확인해 주세요."

        );

    }


    if (
        code ===
        "unavailable"
    ) {

        return (

            "인터넷 연결이 불안정합니다. " +
            "잠시 후 다시 시도해 주세요."

        );

    }


    if (
        code ===
        "failed-precondition"
    ) {

        return (

            "게시판 검색 인덱스가 아직 준비되지 않았습니다. " +
            "Firebase Console의 인덱스 설정을 확인해 주세요."

        );

    }


    if (
        code ===
        "storage/unauthorized"
    ) {

        return (

            "사진 저장 권한이 없습니다. " +
            "Storage 보안 규칙을 확인해 주세요."

        );

    }


    if (
        code ===
        "storage/quota-exceeded"
    ) {

        return (

            "사진 저장공간을 초과했습니다. " +
            "예톡 관리자에게 문의해 주세요."

        );

    }


    if (
        code ===
        "storage/canceled"
    ) {

        return (
            "사진 업로드가 취소되었습니다."
        );

    }


    return (

        cleanText(
            error?.message
        ) ||
        defaultMessage

    );

}


/*==================================================
토스트
==================================================*/

function showToast(
    message
) {

    if (
        !noticeToast
    ) {

        return;

    }


    noticeToast.textContent =
        message;


    noticeToast.classList.add(
        "show"
    );


    if (
        toastTimer
    ) {

        clearTimeout(
            toastTimer
        );

    }


    toastTimer =
        setTimeout(

            () => {

                noticeToast.classList.remove(
                    "show"
                );

            },

            2400

        );

}


/*==================================================
YETALK CHATNOTICE.JS 끝
==================================================*/