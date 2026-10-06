/*==================================================
YETALK CHATTITLE.JS

분류별 제목형 교회 자료실

현재 파일: 완성본 1/3

핵심 구조

1. chatnotice에서 saveToArchive = true로 저장한 글만 표시

2. 게시글 원본은 churchBoardPosts에 한 번만 저장

3. URL의 category 값에 따라
   하나의 chattitle.html이 여러 자료실로 작동

4. category=all이면 전체 자료실 홈과
   모든 보관 자료를 표시

5. 대분류를 누르면 소분류 선택 화면 표시

6. 소분류를 누르면 같은 페이지를
   해당 category 값으로 다시 연다

7. 만료된 자료는 목록에서 자동 제외

8. permanent = true이면 장기보관

9. 실시간 감시는 사용하지 않고
   처음 열기·새로고침·더 보기에만 읽기 실행

10. 자료 등록은 chatnotice에서 진행
==================================================*/


/*==================================================
FIREBASE IMPORT
==================================================*/

import {

    db,
    storage,

    doc,
    setDoc,
    getDoc,
    deleteDoc,

    collection,
    getDocs,

    query,
    where,
    orderBy,
    limit,

    serverTimestamp,

    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject

} from "./firebase.js";


/*==================================================
기본 설정
==================================================*/

const BOARD_COLLECTION =
    "churchBoardPosts";


const LOGIN_USER_KEY =
    "loginUser";


const FAVORITE_STORAGE_KEY =
    "yetalkArchiveFavorites";


const FIRST_LOAD_LIMIT =
    30;


const MORE_LOAD_LIMIT =
    30;


const MAX_LOAD_LIMIT =
    300;


const NEW_POST_DAYS =
    3;


const MAX_IMAGE_SIZE =

    10 *
    1024 *
    1024;


/*
신규 자료 등록은 chatnotice에서만 진행
*/

const WRITE_FROM_CHATNOTICE_ONLY =
    true;


/*==================================================
자료실 대분류·소분류

chatnotice.js의 ARCHIVE_CATEGORY_GROUPS와
같은 key를 사용해야 한다.

방을 각각 만드는 것이 아니라
category 값에 따라 자동으로 자료실이 열린다.
==================================================*/

const ARCHIVE_CATEGORY_GROUPS = {


    /*==================================================
    교회소개·역사
    ==================================================*/

    church: {

        key:
            "church",

        name:
            "교회소개·역사",

        icon:
            "⛪",

        description:
            "교회 소개와 역사, 비전과 기본 안내를 확인합니다.",

        items: [

            {
                key:
                    "churchIntroduction",

                name:
                    "교회소개",

                icon:
                    "⛪",

                description:
                    "교회의 기본 소개와 사역 방향"
            },

            {
                key:
                    "pastorGreeting",

                name:
                    "담임목사 인사",

                icon:
                    "👤",

                description:
                    "담임목사의 인사와 환영 메시지"
            },

            {
                key:
                    "churchVision",

                name:
                    "교회 비전",

                icon:
                    "🌿",

                description:
                    "교회의 비전과 목회 방향"
            },

            {
                key:
                    "churchHistory",

                name:
                    "교회 역사",

                icon:
                    "📜",

                description:
                    "교회의 주요 역사와 기록"
            },

            {
                key:
                    "churchChronology",

                name:
                    "교회 연혁",

                icon:
                    "🕰️",

                description:
                    "연도별 교회 주요 연혁"
            },

            {
                key:
                    "churchStaff",

                name:
                    "섬기는 분들",

                icon:
                    "🤝",

                description:
                    "목회자와 교역자, 주요 봉사자 소개"
            },

            {
                key:
                    "churchOrganization",

                name:
                    "교회 조직",

                icon:
                    "🌳",

                description:
                    "교회 조직과 부서 구성"
            },

            {
                key:
                    "worshipGuide",

                name:
                    "예배시간 안내",

                icon:
                    "🕊️",

                description:
                    "정기예배와 모임 시간 안내"
            },

            {
                key:
                    "churchFacility",

                name:
                    "교회시설 안내",

                icon:
                    "🏠",

                description:
                    "예배당과 교육관 등 교회시설 안내"
            },

            {
                key:
                    "churchLocation",

                name:
                    "오시는 길",

                icon:
                    "🗺️",

                description:
                    "교회 주소와 찾아오는 방법"
            },

            {
                key:
                    "churchContact",

                name:
                    "교회 연락처",

                icon:
                    "☎️",

                description:
                    "교회 전화번호와 연락 안내"
            },

            {
                key:
                    "offeringGuide",

                name:
                    "헌금 안내",

                icon:
                    "💝",

                description:
                    "헌금계좌와 온라인 헌금 안내"
            }

        ]

    },


    /*==================================================
    예배·말씀
    ==================================================*/

    worship: {

        key:
            "worship",

        name:
            "예배·말씀",

        icon:
            "📖",

        description:
            "주보와 설교, 예배 영상과 말씀 자료를 확인합니다.",

        items: [

            {
                key:
                    "bulletin",

                name:
                    "주보",

                icon:
                    "📄",

                description:
                    "주일별 상세 주보"
            },

            {
                key:
                    "simpleBulletin",

                name:
                    "간단 주보",

                icon:
                    "📰",

                description:
                    "설교와 찬양, 봉사자 등 간단 주보"
            },

            {
                key:
                    "sundaySermon",

                name:
                    "주일설교",

                icon:
                    "📖",

                description:
                    "주일설교 영상과 설교 요약"
            },

            {
                key:
                    "sundayVideo",

                name:
                    "주일예배 영상",

                icon:
                    "🎬",

                description:
                    "주일예배 전체 영상"
            },

            {
                key:
                    "sermonSummary",

                name:
                    "설교 요약",

                icon:
                    "📝",

                description:
                    "설교 핵심 내용과 적용"
            },

            {
                key:
                    "wednesdayService",

                name:
                    "수요예배",

                icon:
                    "🕊️",

                description:
                    "수요예배 말씀과 안내"
            },

            {
                key:
                    "wednesdayVideo",

                name:
                    "수요예배 영상",

                icon:
                    "🎥",

                description:
                    "수요예배 영상 자료"
            },

            {
                key:
                    "fridayPrayer",

                name:
                    "금요기도회",

                icon:
                    "🙏",

                description:
                    "금요기도회 말씀과 영상"
            },

            {
                key:
                    "dawnService",

                name:
                    "새벽기도",

                icon:
                    "🌅",

                description:
                    "새벽기도 말씀과 예배자료"
            },

            {
                key:
                    "specialDawnPrayer",

                name:
                    "특별 새벽기도",

                icon:
                    "🌄",

                description:
                    "특별 새벽기도회 말씀과 자료"
            },

            {
                key:
                    "specialEveningPrayer",

                name:
                    "특별 저녁기도회",

                icon:
                    "🌙",

                description:
                    "특별 저녁기도회 말씀과 자료"
            },

            {
                key:
                    "specialService",

                name:
                    "특별예배",

                icon:
                    "✨",

                description:
                    "특별예배와 특별집회 자료"
            },

            {
                key:
                    "seasonService",

                name:
                    "절기예배",

                icon:
                    "✝️",

                description:
                    "부활절과 성탄절 등 절기예배"
            },

            {
                key:
                    "revival",

                name:
                    "부흥회·집회",

                icon:
                    "🔥",

                description:
                    "부흥회와 특별집회 자료"
            },

            {
                key:
                    "praiseVideo",

                name:
                    "찬양 영상",

                icon:
                    "🎵",

                description:
                    "찬양과 경배 영상"
            },

            {
                key:
                    "choir",

                name:
                    "성가대",

                icon:
                    "🎼",

                description:
                    "성가대 찬양과 자료"
            },

            {
                key:
                    "familyWorship",

                name:
                    "가정예배",

                icon:
                    "🏡",

                description:
                    "가정예배 순서와 말씀"
            },

            {
                key:
                    "bibleReading",

                name:
                    "성경통독",

                icon:
                    "📚",

                description:
                    "성경통독표와 통독자료"
            },

            {
                key:
                    "memoryVerse",

                name:
                    "말씀암송",

                icon:
                    "💡",

                description:
                    "주간 또는 월간 암송말씀"
            }

        ]

    },


    /*==================================================
    담임목사 말씀
    ==================================================*/

    pastor: {

        key:
            "pastor",

        name:
            "담임목사 말씀",

        icon:
            "✝️",

        description:
            "담임목사의 오늘 말씀과 묵상, 목회칼럼을 확인합니다.",

        items: [

            {
                key:
                    "pastorTodayWord",

                name:
                    "담임목사 오늘의 말씀",

                icon:
                    "🌿",

                description:
                    "담임목사가 나누는 오늘의 말씀"
            },

            {
                key:
                    "pastorMeditation",

                name:
                    "담임목사 묵상",

                icon:
                    "📖",

                description:
                    "말씀 묵상과 짧은 적용"
            },

            {
                key:
                    "pastorColumn",

                name:
                    "목회칼럼",

                icon:
                    "✍️",

                description:
                    "담임목사의 목회칼럼"
            },

            {
                key:
                    "pastorLetter",

                name:
                    "목회서신",

                icon:
                    "💌",

                description:
                    "교우들에게 전하는 목회서신"
            },

            {
                key:
                    "pastorPrayer",

                name:
                    "담임목사 기도문",

                icon:
                    "🙏",

                description:
                    "교회와 성도를 위한 기도문"
            },

            {
                key:
                    "pastorRecommendedWord",

                name:
                    "추천 말씀",

                icon:
                    "📘",

                description:
                    "함께 읽을 추천 말씀"
            },

            {
                key:
                    "pastorSpecialMessage",

                name:
                    "특별 메시지",

                icon:
                    "📢",

                description:
                    "절기와 행사에 전하는 특별 메시지"
            }

        ]

    },


    /*==================================================
    다음세대
    ==================================================*/

    nextGeneration: {

        key:
            "nextGeneration",

        name:
            "다음세대",

        icon:
            "🌱",

        description:
            "영아부부터 청년부까지 다음세대 자료를 확인합니다.",

        items: [

            {
                key:
                    "infant",

                name:
                    "영아부",

                icon:
                    "👶",

                description:
                    "영아부 예배와 교육자료"
            },

            {
                key:
                    "kindergarten",

                name:
                    "유치부",

                icon:
                    "🌼",

                description:
                    "유치부 예배와 교육자료"
            },

            {
                key:
                    "children",

                name:
                    "어린이부",

                icon:
                    "🎒",

                description:
                    "어린이부 예배와 교육자료"
            },

            {
                key:
                    "elementary",

                name:
                    "초등부",

                icon:
                    "📗",

                description:
                    "초등부 예배와 교육자료"
            },

            {
                key:
                    "student",

                name:
                    "중고등부",

                icon:
                    "📘",

                description:
                    "중고등부 예배와 모임자료"
            },

            {
                key:
                    "youth",

                name:
                    "청년부",

                icon:
                    "🌿",

                description:
                    "청년부 예배와 모임자료"
            },

            {
                key:
                    "youngGenerationChurch",

                name:
                    "청년·젊은세대교회",

                icon:
                    "🔥",

                description:
                    "청년과 젊은세대교회 자료"
            },

            {
                key:
                    "churchSchool",

                name:
                    "교회학교 전체",

                icon:
                    "🧒",

                description:
                    "교회학교 전체 공통자료"
            },

            {
                key:
                    "nextGenerationWorship",

                name:
                    "다음세대 예배",

                icon:
                    "🕊️",

                description:
                    "다음세대 연합예배와 말씀"
            },

            {
                key:
                    "nextGenerationEducation",

                name:
                    "다음세대 교육자료",

                icon:
                    "📚",

                description:
                    "다음세대 공통 교육자료"
            },

            {
                key:
                    "nextGenerationEvent",

                name:
                    "다음세대 행사",

                icon:
                    "🎈",

                description:
                    "다음세대 행사와 활동자료"
            },

            {
                key:
                    "bibleSchool",

                name:
                    "성경학교",

                icon:
                    "🎨",

                description:
                    "여름·겨울 성경학교 자료"
            },

            {
                key:
                    "nextGenerationRetreat",

                name:
                    "수련회·캠프",

                icon:
                    "⛺",

                description:
                    "다음세대 수련회와 캠프자료"
            }

        ]

    },


    /*==================================================
    교회부서
    ==================================================*/

    department: {

        key:
            "department",

        name:
            "교회부서",

        icon:
            "👥",

        description:
            "교회 부서와 기관의 자료를 확인합니다.",

        items: [

            {
                key:
                    "missionDepartment",

                name:
                    "선교부",

                icon:
                    "🌍",

                description:
                    "선교부 사역과 회의자료"
            },

            {
                key:
                    "managementDepartment",

                name:
                    "관리부",

                icon:
                    "🛠️",

                description:
                    "교회 관리와 시설자료"
            },

            {
                key:
                    "financeDepartment",

                name:
                    "재정부",

                icon:
                    "📊",

                description:
                    "재정부 업무와 자료"
            },

            {
                key:
                    "serviceDepartment",

                name:
                    "봉사부",

                icon:
                    "🫶",

                description:
                    "봉사부 사역과 자료"
            },

            {
                key:
                    "worshipDepartment",

                name:
                    "예배부",

                icon:
                    "🕊️",

                description:
                    "예배 준비와 봉사자료"
            },

            {
                key:
                    "ministryDepartment",

                name:
                    "사역자부",

                icon:
                    "✝️",

                description:
                    "사역자 관련 자료"
            },

            {
                key:
                    "educationDepartment",

                name:
                    "교육부",

                icon:
                    "📚",

                description:
                    "교육부 사역과 자료"
            },

            {
                key:
                    "evangelismDepartment",

                name:
                    "전도부",

                icon:
                    "📣",

                description:
                    "전도부 사역과 전도자료"
            },

            {
                key:
                    "mediaDepartment",

                name:
                    "미디어·방송부",

                icon:
                    "🎥",

                description:
                    "방송과 영상 관련 자료"
            },

            {
                key:
                    "vehicleDepartment",

                name:
                    "차량부",

                icon:
                    "🚌",

                description:
                    "차량운행과 봉사자료"
            },

            {
                key:
                    "foodDepartment",

                name:
                    "주방·식당봉사",

                icon:
                    "🍚",

                description:
                    "주방봉사와 식당 운영자료"
            },

            {
                key:
                    "menMission",

                name:
                    "남선교회",

                icon:
                    "👨",

                description:
                    "남선교회 소식과 자료"
            },

            {
                key:
                    "womenMission",

                name:
                    "여선교회",

                icon:
                    "👩",

                description:
                    "여선교회 소식과 자료"
            },

            {
                key:
                    "elderCouncil",

                name:
                    "장로회",

                icon:
                    "🧑‍💼",

                description:
                    "장로회 자료"
            },

            {
                key:
                    "deaconCouncil",

                name:
                    "집사회",

                icon:
                    "🤝",

                description:
                    "집사회 자료"
            },

            {
                key:
                    "kwonsaCouncil",

                name:
                    "권사회",

                icon:
                    "🌷",

                description:
                    "권사회 자료"
            },

            {
                key:
                    "cell",

                name:
                    "셀·구역·속회",

                icon:
                    "🏘️",

                description:
                    "셀과 구역, 속회 나눔자료"
            }

        ]

    },


    /*==================================================
    선교·전도
    ==================================================*/

    mission: {

        key:
            "mission",

        name:
            "선교·전도",

        icon:
            "🌍",

        description:
            "선교사 소식과 전도, 봉사사역 자료를 확인합니다.",

        items: [

            {
                key:
                    "mission",

                name:
                    "선교소식",

                icon:
                    "🌍",

                description:
                    "국내외 선교소식"
            },

            {
                key:
                    "dispatchedMissionary",

                name:
                    "파송 선교사",

                icon:
                    "✈️",

                description:
                    "교회가 파송한 선교사 소개"
            },

            {
                key:
                    "supportedMissionary",

                name:
                    "후원 선교사",

                icon:
                    "💝",

                description:
                    "교회가 후원하는 선교사 소개"
            },

            {
                key:
                    "missionaryIntroduction",

                name:
                    "선교사 소개",

                icon:
                    "👤",

                description:
                    "선교사와 선교지 소개"
            },

            {
                key:
                    "missionPrayer",

                name:
                    "선교소식·기도제목",

                icon:
                    "🙏",

                description:
                    "선교지 소식과 기도제목"
            },

            {
                key:
                    "missionReport",

                name:
                    "선교보고",

                icon:
                    "📝",

                description:
                    "선교사역 보고자료"
            },

            {
                key:
                    "domesticMission",

                name:
                    "국내선교",

                icon:
                    "🇰🇷",

                description:
                    "국내선교와 미자립교회 지원"
            },

            {
                key:
                    "overseasMission",

                name:
                    "해외선교",

                icon:
                    "🌏",

                description:
                    "해외선교 사역자료"
            },

            {
                key:
                    "shortMission",

                name:
                    "단기선교",

                icon:
                    "🧳",

                description:
                    "단기선교 일정과 자료"
            },

            {
                key:
                    "missionSupport",

                name:
                    "선교후원",

                icon:
                    "💗",

                description:
                    "선교후원과 참여 안내"
            },

            {
                key:
                    "evangelismTeam",

                name:
                    "전도팀",

                icon:
                    "📣",

                description:
                    "전도팀 사역과 일정"
            },

            {
                key:
                    "evangelismMaterial",

                name:
                    "전도자료",

                icon:
                    "📖",

                description:
                    "전도지와 전도교육 자료"
            },

            {
                key:
                    "localEvangelism",

                name:
                    "지역전도",

                icon:
                    "🏘️",

                description:
                    "지역 전도와 초청행사"
            },

            {
                key:
                    "serviceTeam",

                name:
                    "봉사팀",

                icon:
                    "🫶",

                description:
                    "봉사팀 사역과 자료"
            },

            {
                key:
                    "localService",

                name:
                    "지역봉사",

                icon:
                    "❤️",

                description:
                    "지역사회 섬김과 봉사"
            },

            {
                key:
                    "relief",

                name:
                    "구제사역",

                icon:
                    "🤲",

                description:
                    "구제와 나눔 사역자료"
            }

        ]

    },


    /*==================================================
    교육·훈련
    ==================================================*/

    education: {

        key:
            "education",

        name:
            "교육·훈련",

        icon:
            "📚",

        description:
            "새가족교육과 성경공부, 제자훈련 자료를 확인합니다.",

        items: [

            {
                key:
                    "education",

                name:
                    "교육자료",

                icon:
                    "📖",

                description:
                    "교회 공통 교육자료"
            },

            {
                key:
                    "newcomerEducation",

                name:
                    "새가족교육",

                icon:
                    "🌱",

                description:
                    "새가족 등록과 교육자료"
            },

            {
                key:
                    "baptismEducation",

                name:
                    "세례교육",

                icon:
                    "💧",

                description:
                    "세례와 입교 교육자료"
            },

            {
                key:
                    "bibleStudy",

                name:
                    "성경공부",

                icon:
                    "📚",

                description:
                    "성경공부 교재와 나눔자료"
            },

            {
                key:
                    "discipleship",

                name:
                    "제자훈련",

                icon:
                    "👣",

                description:
                    "제자훈련 과정과 교재"
            },

            {
                key:
                    "teacherEducation",

                name:
                    "교사교육",

                icon:
                    "🧑‍🏫",

                description:
                    "교회학교 교사교육 자료"
            },

            {
                key:
                    "leaderEducation",

                name:
                    "리더교육",

                icon:
                    "🧭",

                description:
                    "셀과 부서 리더교육 자료"
            },

            {
                key:
                    "ministerEducation",

                name:
                    "사역자교육",

                icon:
                    "📘",

                description:
                    "사역자 교육과 훈련자료"
            },

            {
                key:
                    "parentEducation",

                name:
                    "부모교육",

                icon:
                    "👨‍👩‍👧",

                description:
                    "신앙교육과 자녀양육 자료"
            },

            {
                key:
                    "coupleEducation",

                name:
                    "부부교육",

                icon:
                    "💑",

                description:
                    "부부와 가정회복 교육자료"
            },

            {
                key:
                    "seminar",

                name:
                    "세미나·특강",

                icon:
                    "🎤",

                description:
                    "교회 세미나와 특별강의"
            },

            {
                key:
                    "recommendedBook",

                name:
                    "추천도서",

                icon:
                    "📚",

                description:
                    "신앙과 삶을 위한 추천도서"
            },

            {
                key:
                    "recommendedVideo",

                name:
                    "추천영상",

                icon:
                    "🎞️",

                description:
                    "신앙과 교육을 위한 추천영상"
            },

            {
                key:
                    "faithMaterial",

                name:
                    "신앙자료",

                icon:
                    "✝️",

                description:
                    "신앙생활에 필요한 공통자료"
            }

        ]

    },


    /*==================================================
    행정·재정
    ==================================================*/

    administration: {

        key:
            "administration",

        name:
            "행정·재정",

        icon:
            "🗂️",

        description:
            "교회 행정과 회의, 예산·결산 자료를 확인합니다.",

        items: [

            {
                key:
                    "administrationNotice",

                name:
                    "행정자료",

                icon:
                    "📢",

                description:
                    "교회 행정업무 공통자료"
            },

            {
                key:
                    "meeting",

                name:
                    "회의자료",

                icon:
                    "🗂️",

                description:
                    "각종 회의 준비자료"
            },

            {
                key:
                    "meetingMinutes",

                name:
                    "회의록",

                icon:
                    "📋",

                description:
                    "교회와 부서 회의기록"
            },

            {
                key:
                    "churchCouncil",

                name:
                    "당회자료",

                icon:
                    "🏛️",

                description:
                    "당회 관련 자료"
            },

            {
                key:
                    "officersMeeting",

                name:
                    "제직회자료",

                icon:
                    "👥",

                description:
                    "제직회 관련 자료"
            },

            {
                key:
                    "generalMeeting",

                name:
                    "공동의회자료",

                icon:
                    "🗳️",

                description:
                    "공동의회 관련 자료"
            },

            {
                key:
                    "departmentMeeting",

                name:
                    "부서회의자료",

                icon:
                    "📝",

                description:
                    "각 부서 회의자료"
            },

            {
                key:
                    "annualPlan",

                name:
                    "연간계획",

                icon:
                    "🗓️",

                description:
                    "교회 연간계획과 일정"
            },

            {
                key:
                    "monthlyPlan",

                name:
                    "월간계획",

                icon:
                    "📅",

                description:
                    "월별 계획과 주요 일정"
            },

            {
                key:
                    "churchSchedule",

                name:
                    "교회일정",

                icon:
                    "📆",

                description:
                    "교회 전체 일정자료"
            },

            {
                key:
                    "budget",

                name:
                    "예산보고",

                icon:
                    "💰",

                description:
                    "교회 예산자료"
            },

            {
                key:
                    "settlement",

                name:
                    "결산보고",

                icon:
                    "🧾",

                description:
                    "교회 결산자료"
            },

            {
                key:
                    "budgetSettlement",

                name:
                    "예산·결산보고",

                icon:
                    "📊",

                description:
                    "연도별 예산과 결산보고"
            },

            {
                key:
                    "finance",

                name:
                    "재정보고",

                icon:
                    "📈",

                description:
                    "공개 가능한 재정보고"
            },

            {
                key:
                    "churchRule",

                name:
                    "교회규정",

                icon:
                    "⚖️",

                description:
                    "교회 정관과 운영규정"
            },

            {
                key:
                    "applicationForm",

                name:
                    "신청서",

                icon:
                    "✍️",

                description:
                    "등록과 신청에 필요한 서식"
            },

            {
                key:
                    "volunteerList",

                name:
                    "봉사자 명단",

                icon:
                    "🙋",

                description:
                    "부서별 봉사자와 담당자 명단"
            },

            {
                key:
                    "dutyGuide",

                name:
                    "담당자 안내",

                icon:
                    "📌",

                description:
                    "주간과 월간 담당자 안내"
            }

        ]

    },


    /*==================================================
    사진·영상
    ==================================================*/

    media: {

        key:
            "media",

        name:
            "사진·영상",

        icon:
            "📷",

        description:
            "교회 행사사진과 영상, 갤러리를 확인합니다.",

        items: [

            {
                key:
                    "churchGallery",

                name:
                    "교회 갤러리",

                icon:
                    "🖼️",

                description:
                    "교회 주요 사진과 앨범"
            },

            {
                key:
                    "eventPhoto",

                name:
                    "행사사진",

                icon:
                    "📷",

                description:
                    "교회 행사 사진앨범"
            },

            {
                key:
                    "eventVideo",

                name:
                    "행사영상",

                icon:
                    "📹",

                description:
                    "교회 행사 영상"
            },

            {
                key:
                    "worshipPhoto",

                name:
                    "예배사진",

                icon:
                    "⛪",

                description:
                    "예배와 특별집회 사진"
            },

            {
                key:
                    "churchSchoolPhoto",

                name:
                    "교회학교 사진",

                icon:
                    "🧒",

                description:
                    "교회학교 활동사진"
            },

            {
                key:
                    "youthPhoto",

                name:
                    "청년부 사진",

                icon:
                    "🌿",

                description:
                    "청년부 예배와 활동사진"
            },

            {
                key:
                    "missionPhoto",

                name:
                    "선교사진",

                icon:
                    "🌍",

                description:
                    "선교지와 선교활동 사진"
            },

            {
                key:
                    "servicePhoto",

                name:
                    "봉사사진",

                icon:
                    "🫶",

                description:
                    "지역봉사와 섬김 사진"
            },

            {
                key:
                    "retreatPhoto",

                name:
                    "수련회 사진",

                icon:
                    "⛺",

                description:
                    "수련회와 캠프 사진"
            },

            {
                key:
                    "bibleSchoolPhoto",

                name:
                    "성경학교 사진",

                icon:
                    "🎨",

                description:
                    "여름·겨울 성경학교 사진"
            },

            {
                key:
                    "churchHistoryPhoto",

                name:
                    "교회역사 사진",

                icon:
                    "📜",

                description:
                    "교회 역사를 담은 사진"
            },

            {
                key:
                    "testimonyVideo",

                name:
                    "간증영상",

                icon:
                    "✨",

                description:
                    "성도들의 간증영상"
            },

            {
                key:
                    "specialVideo",

                name:
                    "특별영상",

                icon:
                    "🎞️",

                description:
                    "특별행사와 기념영상"
            },

            {
                key:
                    "promotionVideo",

                name:
                    "홍보영상",

                icon:
                    "📣",

                description:
                    "교회 소개와 행사 홍보영상"
            }

        ]

    },


    /*==================================================
    문서·자료
    ==================================================*/

    document: {

        key:
            "document",

        name:
            "문서·자료",

        icon:
            "📑",

        description:
            "교회 문서와 서식, 신앙자료를 확인합니다.",

        items: [

            {
                key:
                    "document",

                name:
                    "교회 문서",

                icon:
                    "📑",

                description:
                    "교회 운영과 사역 문서"
            },

            {
                key:
                    "pdfMaterial",

                name:
                    "PDF 자료",

                icon:
                    "📄",

                description:
                    "PDF 형식의 교회자료"
            },

            {
                key:
                    "downloadMaterial",

                name:
                    "다운로드 자료",

                icon:
                    "⬇️",

                description:
                    "다운로드 가능한 자료"
            },

            {
                key:
                    "formMaterial",

                name:
                    "서식자료",

                icon:
                    "📝",

                description:
                    "교회 행정과 사역 서식"
            },

            {
                key:
                    "praiseSheet",

                name:
                    "찬양악보",

                icon:
                    "🎼",

                description:
                    "찬양 악보와 음악자료"
            },

            {
                key:
                    "prayerMaterial",

                name:
                    "기도자료",

                icon:
                    "🙏",

                description:
                    "기도문과 기도회 자료"
            },

            {
                key:
                    "sermonMaterial",

                name:
                    "설교자료",

                icon:
                    "📖",

                description:
                    "설교와 말씀 관련 자료"
            },

            {
                key:
                    "usefulLink",

                name:
                    "유용한 링크",

                icon:
                    "🔗",

                description:
                    "교회와 신앙생활에 유용한 링크"
            },

            {
                key:
                    "other",

                name:
                    "기타자료",

                icon:
                    "📂",

                description:
                    "다른 분류에 포함되지 않는 자료"
            }

        ]

    }

};


/*==================================================
소분류 빠른 검색표
==================================================*/

const ARCHIVE_CATEGORY_LOOKUP =
    buildArchiveCategoryLookup();


/*==================================================
현재 상태
==================================================*/

let loginUser =
    null;


let currentChurchId =
    "";


let currentChurchName =
    "";


let currentChurchPlan =
    "free";


let currentCategory =
    "all";


let currentCategoryInfo =
    null;


let currentLoadLimit =
    FIRST_LOAD_LIMIT;


let loadedPosts =
    [];


let visiblePosts =
    [];


let selectedPost =
    null;


let editingPost =
    null;


let selectedImageFile =
    null;


let selectedImagePreviewUrl =
    "";


let removeExistingImage =
    false;


let selectedMainCategory =
    null;


let favoritePostIds =
    new Set();


let isLoadingPosts =
    false;


let isSavingPost =
    false;


let isDeletingPost =
    false;


let toastTimer =
    null;


/*==================================================
DOM

기본 화면
==================================================*/

const titleBackBtn =
    document.getElementById(
        "titleBackBtn"
    );


const titleHeaderName =
    document.getElementById(
        "titleHeaderName"
    );


const titleHeaderChurch =
    document.getElementById(
        "titleHeaderChurch"
    );


const titleSearchBtn =
    document.getElementById(
        "titleSearchBtn"
    );


const titleGuideIcon =
    document.getElementById(
        "titleGuideIcon"
    );


const titleGuideTitle =
    document.getElementById(
        "titleGuideTitle"
    );


const titleGuideDescription =
    document.getElementById(
        "titleGuideDescription"
    );


const titleArchiveHome =
    document.getElementById(
        "titleArchiveHome"
    );


const titleArchiveManageBtn =
    document.getElementById(
        "titleArchiveManageBtn"
    );


const titleMainCategoryList =
    document.getElementById(
        "titleMainCategoryList"
    );


const titleSearchArea =
    document.getElementById(
        "titleSearchArea"
    );


const titleSearchInput =
    document.getElementById(
        "titleSearchInput"
    );


const titleSearchClearBtn =
    document.getElementById(
        "titleSearchClearBtn"
    );


const titleSearchCloseBtn =
    document.getElementById(
        "titleSearchCloseBtn"
    );


const titleCurrentCategory =
    document.getElementById(
        "titleCurrentCategory"
    );


const titlePostCount =
    document.getElementById(
        "titlePostCount"
    );


const titleListDescription =
    document.getElementById(
        "titleListDescription"
    );


const titleSortSelect =
    document.getElementById(
        "titleSortSelect"
    );


const titleDateFilter =
    document.getElementById(
        "titleDateFilter"
    );


const titleYearSelect =
    document.getElementById(
        "titleYearSelect"
    );


const titleMonthSelect =
    document.getElementById(
        "titleMonthSelect"
    );


const titleDateResetBtn =
    document.getElementById(
        "titleDateResetBtn"
    );


const titleLoading =
    document.getElementById(
        "titleLoading"
    );


const titlePostList =
    document.getElementById(
        "titlePostList"
    );


const titleEmpty =
    document.getElementById(
        "titleEmpty"
    );


const titleEmptyTitle =
    document.getElementById(
        "titleEmptyTitle"
    );


const titleEmptyDescription =
    document.getElementById(
        "titleEmptyDescription"
    );


const titleMoreBtn =
    document.getElementById(
        "titleMoreBtn"
    );


const titleRefreshBtn =
    document.getElementById(
        "titleRefreshBtn"
    );


const titleWriteBtn =
    document.getElementById(
        "titleWriteBtn"
    );


const titleAdSection =
    document.getElementById(
        "titleAdSection"
    );


/*==================================================
DOM

분류 선택 화면
==================================================*/

const titleCategoryOverlay =
    document.getElementById(
        "titleCategoryOverlay"
    );


const titleCategoryBackBtn =
    document.getElementById(
        "titleCategoryBackBtn"
    );


const titleCategoryHeaderTitle =
    document.getElementById(
        "titleCategoryHeaderTitle"
    );


const titleCategoryHeaderChurch =
    document.getElementById(
        "titleCategoryHeaderChurch"
    );


const titleCategoryGuideIcon =
    document.getElementById(
        "titleCategoryGuideIcon"
    );


const titleCategoryGuideTitle =
    document.getElementById(
        "titleCategoryGuideTitle"
    );


const titleSubCategoryList =
    document.getElementById(
        "titleSubCategoryList"
    );


const titleSubCategoryEmpty =
    document.getElementById(
        "titleSubCategoryEmpty"
    );


/*==================================================
DOM

상세보기
==================================================*/

const titleDetailOverlay =
    document.getElementById(
        "titleDetailOverlay"
    );


const titleDetailBackBtn =
    document.getElementById(
        "titleDetailBackBtn"
    );


const titleDetailHeaderCategory =
    document.getElementById(
        "titleDetailHeaderCategory"
    );


const titleDetailHeaderChurch =
    document.getElementById(
        "titleDetailHeaderChurch"
    );


const titleDetailMenuBtn =
    document.getElementById(
        "titleDetailMenuBtn"
    );


const titleDetailCategory =
    document.getElementById(
        "titleDetailCategory"
    );


const titleDetailNew =
    document.getElementById(
        "titleDetailNew"
    );


const titleDetailExpired =
    document.getElementById(
        "titleDetailExpired"
    );


const titleDetailPermanent =
    document.getElementById(
        "titleDetailPermanent"
    );


const titleDetailTitle =
    document.getElementById(
        "titleDetailTitle"
    );


const titleDetailWriter =
    document.getElementById(
        "titleDetailWriter"
    );


const titleDetailDate =
    document.getElementById(
        "titleDetailDate"
    );


const titleDetailPeriod =
    document.getElementById(
        "titleDetailPeriod"
    );


const titleDetailPeriodText =
    document.getElementById(
        "titleDetailPeriodText"
    );


const titleDetailImageArea =
    document.getElementById(
        "titleDetailImageArea"
    );


const titleDetailImage =
    document.getElementById(
        "titleDetailImage"
    );


const titleDetailText =
    document.getElementById(
        "titleDetailText"
    );


const titleAttachmentArea =
    document.getElementById(
        "titleAttachmentArea"
    );


const titlePdfBtn =
    document.getElementById(
        "titlePdfBtn"
    );


const titlePdfName =
    document.getElementById(
        "titlePdfName"
    );


const titleVideoBtn =
    document.getElementById(
        "titleVideoBtn"
    );


const titleVideoName =
    document.getElementById(
        "titleVideoName"
    );


const titleLinkBtn =
    document.getElementById(
        "titleLinkBtn"
    );


const titleLinkName =
    document.getElementById(
        "titleLinkName"
    );


const titleFavoriteBtn =
    document.getElementById(
        "titleFavoriteBtn"
    );


const titleFavoriteIcon =
    document.getElementById(
        "titleFavoriteIcon"
    );


const titleShareBtn =
    document.getElementById(
        "titleShareBtn"
    );


const titleCopyLinkBtn =
    document.getElementById(
        "titleCopyLinkBtn"
    );


const titleDetailAdminArea =
    document.getElementById(
        "titleDetailAdminArea"
    );


const titleDetailEditBtn =
    document.getElementById(
        "titleDetailEditBtn"
    );


const titleDetailDeleteBtn =
    document.getElementById(
        "titleDetailDeleteBtn"
    );


/*==================================================
DOM

수정 화면
==================================================*/

const titleWriteOverlay =
    document.getElementById(
        "titleWriteOverlay"
    );


const titleWriteCloseBtn =
    document.getElementById(
        "titleWriteCloseBtn"
    );


const titleWriteHeaderText =
    document.getElementById(
        "titleWriteHeaderText"
    );


const titleWriteSaveBtn =
    document.getElementById(
        "titleWriteSaveBtn"
    );


const titleSelectedCategoryName =
    document.getElementById(
        "titleSelectedCategoryName"
    );


const titleWriteCategory =
    document.getElementById(
        "titleWriteCategory"
    );


const titleWriteTitle =
    document.getElementById(
        "titleWriteTitle"
    );


const titleWriteText =
    document.getElementById(
        "titleWriteText"
    );


const titlePublishDate =
    document.getElementById(
        "titlePublishDate"
    );


const titleExpireDate =
    document.getElementById(
        "titleExpireDate"
    );


const titleImageInput =
    document.getElementById(
        "titleImageInput"
    );


const titleImagePreview =
    document.getElementById(
        "titleImagePreview"
    );


const titleImagePreviewImg =
    document.getElementById(
        "titleImagePreviewImg"
    );


const titleImageRemoveBtn =
    document.getElementById(
        "titleImageRemoveBtn"
    );


const titlePdfUrl =
    document.getElementById(
        "titlePdfUrl"
    );


const titlePdfNameInput =
    document.getElementById(
        "titlePdfNameInput"
    );


const titleVideoUrl =
    document.getElementById(
        "titleVideoUrl"
    );


const titleVideoNameInput =
    document.getElementById(
        "titleVideoNameInput"
    );


const titleLinkUrl =
    document.getElementById(
        "titleLinkUrl"
    );


const titleLinkNameInput =
    document.getElementById(
        "titleLinkNameInput"
    );


const titleShowInNotice =
    document.getElementById(
        "titleShowInNotice"
    );


const titleSendIndexNotice =
    document.getElementById(
        "titleSendIndexNotice"
    );


/*==================================================
DOM

삭제·토스트
==================================================*/

const titleConfirmOverlay =
    document.getElementById(
        "titleConfirmOverlay"
    );


const titleConfirmCancelBtn =
    document.getElementById(
        "titleConfirmCancelBtn"
    );


const titleConfirmDeleteBtn =
    document.getElementById(
        "titleConfirmDeleteBtn"
    );


const titleToast =
    document.getElementById(
        "titleToast"
    );


/*==================================================
시작
==================================================*/

window.addEventListener(

    "DOMContentLoaded",

    initializeTitleBoard

);


/*==================================================
초기화
==================================================*/

async function initializeTitleBoard() {

    loginUser =
        loadLoginUser();


    setCurrentChurch();


    setCurrentCategory();


    loadFavoritePostIds();


    showChurchInformation();


    showCurrentCategoryInformation();


    applyWritingAuthority();


    applyAdvertisementVisibility();


    bindBasicEvents();


    renderMainCategoryMenu();


    await loadPosts(
        true
    );

}


/*==================================================
문자열 정리
==================================================*/

function cleanText(value) {

    return String(
        value ?? ""
    ).trim();

}


/*==================================================
분류 키 정리
==================================================*/

function cleanCategoryKey(value) {

    const cleaned =
        String(
            value || ""
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
                60
            );


    return cleaned;

}


/*==================================================
로그인 사용자 불러오기
==================================================*/

function loadLoginUser() {

    try {

        const saved =
            localStorage.getItem(
                LOGIN_USER_KEY
            );


        if (!saved) {

            return createGuestUser();

        }


        const parsed =
            JSON.parse(
                saved
            );


        if (
            !parsed ||
            typeof parsed !==
            "object"
        ) {

            return createGuestUser();

        }


        return {

            memberNo:
                cleanText(

                    parsed.memberNo ||
                    parsed.memberId

                ),

            name:
                cleanText(
                    parsed.name
                ) ||
                "예톡 회원",

            role:
                cleanText(
                    parsed.role
                ).toLowerCase() ||
                "member",

            grade:
                Number(
                    parsed.grade || 0
                ),

            churchId:
                cleanText(
                    parsed.churchId
                ) ||
                "yetalk",

            churchName:
                cleanText(
                    parsed.churchName
                ) ||
                "예톡라운지",

            churchPlan:
                cleanText(

                    parsed.churchPlan ||
                    parsed.plan

                ).toLowerCase() ||
                "free",

            canWriteBoard:
                parsed.canWriteBoard ===
                true,

            canManageBoard:
                parsed.canManageBoard ===
                true

        };

    }

    catch (error) {

        console.error(
            "로그인 정보 읽기 오류:",
            error
        );


        return createGuestUser();

    }

}


/*==================================================
비로그인 사용자
==================================================*/

function createGuestUser() {

    return {

        memberNo:
            "",

        name:
            "예톡 회원",

        role:
            "guest",

        grade:
            0,

        churchId:
            "yetalk",

        churchName:
            "예톡라운지",

        churchPlan:
            "free",

        canWriteBoard:
            false,

        canManageBoard:
            false

    };

}


/*==================================================
현재 교회 설정
==================================================*/

function setCurrentChurch() {

    const role =
        cleanText(
            loginUser?.role
        ).toLowerCase();


    const selectedChurchId =
        cleanText(
            localStorage.getItem(
                "currentChurch"
            )
        );


    const selectedChurchName =
        cleanText(
            localStorage.getItem(
                "currentChurchName"
            )
        );


    if (
        role === "admin" &&
        selectedChurchId
    ) {

        currentChurchId =
            selectedChurchId;


        currentChurchName =
            selectedChurchName ||
            selectedChurchId;


        currentChurchPlan =
            cleanText(
                loginUser?.churchPlan
            ) ||
            "free";


        return;

    }


    currentChurchId =
        cleanText(
            loginUser?.churchId
        ) ||
        selectedChurchId ||
        "yetalk";


    currentChurchName =
        cleanText(
            loginUser?.churchName
        ) ||
        selectedChurchName ||
        currentChurchId ||
        "예톡라운지";


    currentChurchPlan =
        cleanText(
            loginUser?.churchPlan
        ) ||
        "free";

}


/*==================================================
URL 현재 분류 설정
==================================================*/

function setCurrentCategory() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        cleanCategoryKey(
            params.get(
                "category"
            )
        ) ||
        "all";


    const customName =
        cleanText(
            params.get(
                "name"
            )
        );


    const customIcon =
        cleanText(
            params.get(
                "icon"
            )
        );


    currentCategory =
        category;


    if (currentCategory === "all") {

        currentCategoryInfo = {

            key:
                "all",

            name:
                "전체 자료",

            icon:
                "📚",

            description:
                "교회의 주요 자료를 한곳에서 확인하세요.",

            mainKey:
                "all",

            mainName:
                "전체 자료실"

        };


        return;

    }


    const knownCategory =
        ARCHIVE_CATEGORY_LOOKUP[
            currentCategory
        ];


    if (knownCategory) {

        currentCategoryInfo =
            knownCategory;


        return;

    }


    currentCategoryInfo = {

        key:
            currentCategory,

        name:
            customName ||
            "교회 자료",

        icon:
            customIcon ||
            "📂",

        description:
            "제목을 누르면 자료의 상세 내용이 열립니다.",

        mainKey:
            "custom",

        mainName:
            "우리 교회 자료실"

    };

}


/*==================================================
분류 빠른 검색표 만들기
==================================================*/

function buildArchiveCategoryLookup() {

    const lookup =
        {};


    Object.entries(
        ARCHIVE_CATEGORY_GROUPS
    ).forEach(

        ([
            mainKey,
            group
        ]) => {

            group.items.forEach(

                item => {

                    lookup[
                        item.key
                    ] = {

                        ...item,

                        mainKey:
                            mainKey,

                        mainName:
                            group.name,

                        mainIcon:
                            group.icon

                    };

                }

            );

        }

    );


    return lookup;

}


/*==================================================
교회명 표시
==================================================*/

function showChurchInformation() {

    if (titleHeaderChurch) {

        titleHeaderChurch.textContent =
            currentChurchName;

    }


    if (titleCategoryHeaderChurch) {

        titleCategoryHeaderChurch.textContent =
            currentChurchName;

    }


    if (titleDetailHeaderChurch) {

        titleDetailHeaderChurch.textContent =
            currentChurchName;

    }

}


/*==================================================
현재 자료실 정보 표시
==================================================*/

function showCurrentCategoryInformation() {

    const name =
        currentCategoryInfo?.name ||
        "교회 자료실";


    const icon =
        currentCategoryInfo?.icon ||
        "📚";


    const description =
        currentCategoryInfo?.description ||
        "제목을 누르면 상세 내용이 열립니다.";


    if (titleHeaderName) {

        titleHeaderName.textContent =
            currentCategory === "all"
                ? "교회 자료실"
                : name;

    }


    if (titleGuideIcon) {

        titleGuideIcon.textContent =
            icon;

    }


    if (titleGuideTitle) {

        titleGuideTitle.textContent =

            currentCategory === "all"
                ? "교회 자료를 한곳에서 확인하세요."
                : name + " 자료를 확인하세요.";

    }


    if (titleGuideDescription) {

        titleGuideDescription.textContent =
            description;

    }


    if (titleCurrentCategory) {

        titleCurrentCategory.textContent =
            name;

    }


    if (titleListDescription) {

        titleListDescription.textContent =

            currentCategory === "all"
                ? "자료실에 보관된 전체 자료입니다."
                : "최근 등록된 " + name + " 자료입니다.";

    }


    titleArchiveHome?.classList.toggle(

        "hidden",

        currentCategory !== "all"

    );


    document.title =

        name +
        " · 예톡";

}


/*==================================================
자료 작성 권한
==================================================*/

function canWriteBoard() {

    const role =
        cleanText(
            loginUser?.role
        ).toLowerCase();


    if (
        loginUser?.canWriteBoard ===
        true
    ) {

        return true;

    }


    return [

        "admin",
        "helper",
        "pastor",
        "minister",
        "staff"

    ].includes(
        role
    );

}


/*==================================================
자료 전체 관리 권한
==================================================*/

function canManageBoard() {

    const role =
        cleanText(
            loginUser?.role
        ).toLowerCase();


    if (
        loginUser?.canManageBoard ===
        true
    ) {

        return true;

    }


    return [

        "admin",
        "helper",
        "pastor",
        "minister",
        "staff"

    ].includes(
        role
    );

}


/*==================================================
특정 자료 수정·삭제 권한
==================================================*/

function canManagePost(post) {

    if (!post) {

        return false;

    }


    if (
        canManageBoard()
    ) {

        return true;

    }


    const myMemberNo =
        cleanText(
            loginUser?.memberNo
        );


    const writerMemberNo =
        cleanText(
            post.writerMemberNo
        );


    return Boolean(

        myMemberNo &&
        writerMemberNo &&
        myMemberNo ===
        writerMemberNo

    );

}


/*==================================================
작성·관리 버튼 권한
==================================================*/

function applyWritingAuthority() {

    titleWriteBtn?.classList.toggle(

        "hidden",

        !canWriteBoard()

    );


    titleArchiveManageBtn?.classList.toggle(

        "hidden",

        !canManageBoard()

    );

}


/*==================================================
광고 표시
==================================================*/

function applyAdvertisementVisibility() {

    const showAdvertisement =
        currentChurchPlan ===
        "free";


    titleAdSection?.classList.toggle(

        "hidden",

        !showAdvertisement

    );

}


/*==================================================
즐겨찾기 불러오기
==================================================*/

function loadFavoritePostIds() {

    try {

        const saved =
            localStorage.getItem(
                FAVORITE_STORAGE_KEY
            );


        if (!saved) {

            favoritePostIds =
                new Set();


            return;

        }


        const parsed =
            JSON.parse(
                saved
            );


        if (!Array.isArray(parsed)) {

            favoritePostIds =
                new Set();


            return;

        }


        favoritePostIds =
            new Set(

                parsed
                    .map(cleanText)
                    .filter(Boolean)

            );

    }

    catch (error) {

        console.error(
            "즐겨찾기 읽기 오류:",
            error
        );


        favoritePostIds =
            new Set();

    }

}


/*==================================================
게시글 컬렉션
==================================================*/

function getBoardCollection() {

    return collection(
        db,
        BOARD_COLLECTION
    );

}


/*==================================================
게시글 문서
==================================================*/

function getBoardDocument(postId) {

    return doc(

        db,

        BOARD_COLLECTION,

        postId

    );

}


/*==================================================
전체 자료실 대분류 메뉴
==================================================*/

function renderMainCategoryMenu() {

    if (!titleMainCategoryList) {

        return;

    }


    titleMainCategoryList.innerHTML =
        "";


    Object.values(
        ARCHIVE_CATEGORY_GROUPS
    ).forEach(

        group => {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "titleMainCategoryItem";


            item.tabIndex =
                0;


            item.setAttribute(
                "role",
                "button"
            );


            item.setAttribute(
                "aria-label",
                group.name + " 자료실 열기"
            );


            item.innerHTML = `

                <div class="titleMainCategoryIcon">

                    ${escapeHTML(
                        group.icon
                    )}

                </div>


                <div class="titleMainCategoryText">

                    <strong>

                        ${escapeHTML(
                            group.name
                        )}

                    </strong>


                    <span>

                        ${group.items.length}개 분류

                    </span>

                </div>


                <div class="titleMainCategoryArrow">

                    ›

                </div>

            `;


            item.addEventListener(

                "click",

                () => {

                    openMainCategory(
                        group
                    );

                }

            );


            item.addEventListener(

                "keydown",

                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();


                        openMainCategory(
                            group
                        );

                    }

                }

            );


            titleMainCategoryList.appendChild(
                item
            );

        }

    );

}


/*==================================================
대분류 열기
==================================================*/

function openMainCategory(group) {

    if (!group) {

        return;

    }


    selectedMainCategory =
        group;


    if (titleCategoryHeaderTitle) {

        titleCategoryHeaderTitle.textContent =
            group.name;

    }


    if (titleCategoryGuideIcon) {

        titleCategoryGuideIcon.textContent =
            group.icon;

    }


    if (titleCategoryGuideTitle) {

        titleCategoryGuideTitle.textContent =
            group.name;

    }


    renderSubCategoryMenu(
        group
    );


    titleCategoryOverlay?.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


/*==================================================
소분류 메뉴 출력
==================================================*/

function renderSubCategoryMenu(group) {

    if (!titleSubCategoryList) {

        return;

    }


    titleSubCategoryList.innerHTML =
        "";


    if (
        !group ||
        !Array.isArray(group.items) ||
        group.items.length === 0
    ) {

        titleSubCategoryEmpty?.classList.remove(
            "hidden"
        );


        return;

    }


    titleSubCategoryEmpty?.classList.add(
        "hidden"
    );


    group.items.forEach(

        category => {

            const count =
                getLoadedCategoryCount(
                    category.key
                );


            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "titleSubCategoryItem";


            item.tabIndex =
                0;


            item.setAttribute(
                "role",
                "button"
            );


            item.setAttribute(
                "aria-label",
                category.name + " 자료실 열기"
            );


            item.innerHTML = `

                <div class="titleSubCategoryIcon">

                    ${escapeHTML(
                        category.icon
                    )}

                </div>


                <div class="titleSubCategoryText">

                    <strong>

                        ${escapeHTML(
                            category.name
                        )}

                    </strong>


                    <span>

                        ${escapeHTML(
                            category.description ||
                            "자료를 확인하세요."
                        )}

                        ${
                            count > 0
                                ? " · " + count + "개"
                                : ""
                        }

                    </span>

                </div>


                <div class="titleSubCategoryArrow">

                    ›

                </div>

            `;


            item.addEventListener(

                "click",

                () => {

                    openCategoryBoard(
                        category
                    );

                }

            );


            item.addEventListener(

                "keydown",

                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();


                        openCategoryBoard(
                            category
                        );

                    }

                }

            );


            titleSubCategoryList.appendChild(
                item
            );

        }

    );

}


/*==================================================
현재 불러온 자료 중 분류 개수
==================================================*/

function getLoadedCategoryCount(
    categoryKey
) {

    return loadedPosts.filter(

        post =>

            post.saveToArchive === true &&
            cleanCategoryKey(
                post.category
            ) === categoryKey &&
            !isArchiveExpired(post)

    ).length;

}


/*==================================================
소분류 자료실 이동
==================================================*/

function openCategoryBoard(category) {

    if (!category) {

        return;

    }


    const params =
        new URLSearchParams();


    params.set(
        "category",
        category.key
    );


    params.set(
        "name",
        category.name
    );


    params.set(
        "icon",
        category.icon
    );


    location.href =

        "chattitle.html?" +
        params.toString();

}


/*==================================================
대분류 화면 닫기
==================================================*/

function closeCategoryOverlay() {

    titleCategoryOverlay?.classList.add(
        "hidden"
    );


    selectedMainCategory =
        null;


    document.body.style.overflow =
        "";

}


/*==================================================
게시글 불러오기

Firestore에서는

churchId
saveToArchive
publishDateMs

조건으로 읽는다.

전체 자료실:
churchId + saveToArchive

분류별 자료실:
churchId + saveToArchive + category

인덱스 생성이 필요할 수 있다.
==================================================*/

async function loadPosts(
    reset = false
) {

    if (isLoadingPosts) {

        return;

    }


    if (reset) {

        currentLoadLimit =
            FIRST_LOAD_LIMIT;

    }


    isLoadingPosts =
        true;


    setListLoading(
        true
    );


    try {

        let boardQuery;


        if (
            currentCategory ===
            "all"
        ) {

            boardQuery =
                query(

                    getBoardCollection(),

                    where(
                        "churchId",
                        "==",
                        currentChurchId
                    ),

                    where(
                        "saveToArchive",
                        "==",
                        true
                    ),

                    orderBy(
                        "publishDateMs",
                        "desc"
                    ),

                    limit(
                        currentLoadLimit
                    )

                );

        } else {

            boardQuery =
                query(

                    getBoardCollection(),

                    where(
                        "churchId",
                        "==",
                        currentChurchId
                    ),

                    where(
                        "saveToArchive",
                        "==",
                        true
                    ),

                    where(
                        "category",
                        "==",
                        currentCategory
                    ),

                    orderBy(
                        "publishDateMs",
                        "desc"
                    ),

                    limit(
                        currentLoadLimit
                    )

                );

        }


        const snapshot =
            await getDocs(
                boardQuery
            );


        const posts =
            [];


        snapshot.forEach(

            item => {

                posts.push({

                    id:
                        item.id,

                    ...item.data()

                });

            }

        );


        loadedPosts =
            posts;


        rebuildDateFilterOptions();


        applyCurrentFilter();


        renderMainCategoryMenu();


        const mayHaveMore =

            snapshot.size >=
            currentLoadLimit &&

            currentLoadLimit <
            MAX_LOAD_LIMIT;


        titleMoreBtn?.classList.toggle(

            "hidden",

            !mayHaveMore

        );

    }

    catch (error) {

        console.error(
            "자료 불러오기 오류:",
            error
        );


        loadedPosts =
            [];


        visiblePosts =
            [];


        renderPosts();


        showToast(
            getFirebaseErrorMessage(
                error,
                "자료를 불러오지 못했습니다."
            )
        );

    }

    finally {

        isLoadingPosts =
            false;


        setListLoading(
            false
        );

    }

}


/*==================================================
검색·정렬·연도·월·만료 필터
==================================================*/

function applyCurrentFilter() {

    const searchText =
        normalizeSearchText(
            titleSearchInput?.value
        );


    const sortType =
        cleanText(
            titleSortSelect?.value
        ) ||
        "latest";


    const selectedYear =
        cleanText(
            titleYearSelect?.value
        ) ||
        "all";


    const selectedMonth =
        cleanText(
            titleMonthSelect?.value
        ) ||
        "all";


    const now =
        Date.now();


    visiblePosts =
        loadedPosts.filter(

            post => {

                /*
                저장 상태 확인
                */

                if (
                    post.saveToArchive !==
                    true
                ) {

                    return false;

                }


                /*
                삭제·숨김 상태 제외
                */

                const status =
                    cleanText(
                        post.status
                    ).toLowerCase() ||
                    "active";


                if (
                    status !== "active"
                ) {

                    return false;

                }


                /*
                게시 시작일 전 제외
                */

                const publishDateMs =
                    Number(

                        post.publishDateMs ||
                        post.createdAtMs ||
                        0

                    );


                if (
                    publishDateMs &&
                    publishDateMs >
                    now
                ) {

                    return false;

                }


                /*
                자료 보관 종료
                */

                if (
                    isArchiveExpired(
                        post
                    )
                ) {

                    return false;

                }


                /*
                분류 확인

                Firestore 쿼리로 이미 분류됐지만
                이중 안전검사
                */

                if (
                    currentCategory !==
                    "all" &&
                    cleanCategoryKey(
                        post.category
                    ) !==
                    currentCategory
                ) {

                    return false;

                }


                /*
                연도·월 필터
                */

                const dateParts =
                    getPostYearMonth(
                        post
                    );


                if (
                    selectedYear !== "all" &&
                    dateParts.year !==
                    selectedYear
                ) {

                    return false;

                }


                if (
                    selectedMonth !== "all" &&
                    dateParts.month !==
                    selectedMonth
                ) {

                    return false;

                }


                /*
                검색
                */

                if (!searchText) {

                    return true;

                }


                const searchable =
                    normalizeSearchText(

                        [
                            post.title,
                            post.content,
                            post.writerName,
                            post.categoryName,
                            post.archiveMainCategoryName,
                            post.pdfName,
                            post.videoName,
                            post.linkName
                        ].join(
                            " "
                        )

                    );


                return searchable.includes(
                    searchText
                );

            }

        );


    /*
    정렬
    */

    if (
        sortType === "oldest"
    ) {

        visiblePosts.sort(

            (
                first,
                second
            ) =>

                getPostDateMs(
                    first
                ) -
                getPostDateMs(
                    second
                )

        );

    } else if (
        sortType === "title"
    ) {

        visiblePosts.sort(

            (
                first,
                second
            ) =>

                cleanText(
                    first.title
                ).localeCompare(

                    cleanText(
                        second.title
                    ),

                    "ko"

                )

        );

    } else {

        visiblePosts.sort(

            (
                first,
                second
            ) => {

                const firstPinned =
                    Boolean(

                        first.pinned ||
                        first.permanent

                    );


                const secondPinned =
                    Boolean(

                        second.pinned ||
                        second.permanent

                    );


                if (
                    firstPinned !==
                    secondPinned
                ) {

                    return firstPinned
                        ? -1
                        : 1;

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

    }


    renderPosts();

}


/*==================================================
검색 문자열 정리
==================================================*/

function normalizeSearchText(value) {

    return String(
        value ?? ""
    )
        .normalize(
            "NFKC"
        )
        .trim()
        .replace(
            /\s+/g,
            " "
        )
        .toLowerCase();

}


/*==================================================
게시글 기준 날짜
==================================================*/

function getPostDateMs(post) {

    return Number(

        post?.publishDateMs ||
        post?.createdAtMs ||
        post?.updatedAtMs ||
        0

    );

}


/*==================================================
자료 보관 종료 확인
==================================================*/

function isArchiveExpired(post) {

    if (!post) {

        return false;

    }


    if (
        post.permanent ===
        true
    ) {

        return false;

    }


    const archiveUntil =
        cleanText(

            post.archiveUntil ||
            post.expireDate

        );


    if (!archiveUntil) {

        return false;

    }


    const expireMs =
        getEndOfDateMs(
            archiveUntil
        );


    if (!expireMs) {

        return false;

    }


    return Date.now() >
        expireMs;

}


/*==================================================
날짜 마지막 시각
==================================================*/

function getEndOfDateMs(dateValue) {

    if (!dateValue) {

        return 0;

    }


    const date =
        new Date(
            dateValue +
            "T23:59:59.999"
        );


    const time =
        date.getTime();


    return Number.isFinite(
        time
    )
        ? time
        : 0;

}


/*==================================================
게시글 연도·월
==================================================*/

function getPostYearMonth(post) {

    const publishDate =
        cleanText(
            post?.publishDate
        );


    if (
        /^\d{4}-\d{2}-\d{2}$/
            .test(
                publishDate
            )
    ) {

        return {

            year:
                publishDate.slice(
                    0,
                    4
                ),

            month:
                publishDate.slice(
                    5,
                    7
                )

        };

    }


    const dateMs =
        getPostDateMs(
            post
        );


    if (!dateMs) {

        return {

            year:
                "",

            month:
                ""

        };

    }


    const date =
        new Date(
            dateMs
        );


    return {

        year:
            String(
                date.getFullYear()
            ),

        month:
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            )

    };

}


/*==================================================
연도·월 필터 옵션 생성
==================================================*/

function rebuildDateFilterOptions() {

    if (
        !titleYearSelect ||
        !titleMonthSelect
    ) {

        return;

    }


    const years =
        new Set();


    loadedPosts.forEach(

        post => {

            const parts =
                getPostYearMonth(
                    post
                );


            if (parts.year) {

                years.add(
                    parts.year
                );

            }

        }

    );


    const previousYear =
        titleYearSelect.value ||
        "all";


    const previousMonth =
        titleMonthSelect.value ||
        "all";


    titleYearSelect.innerHTML = `

        <option value="all">

            전체 연도

        </option>

    `;


    Array.from(years)
        .sort(
            (
                first,
                second
            ) =>

                Number(second) -
                Number(first)

        )
        .forEach(

            year => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    year;


                option.textContent =
                    year + "년";


                titleYearSelect.appendChild(
                    option
                );

            }

        );


    titleMonthSelect.innerHTML = `

        <option value="all">

            전체 월

        </option>

    `;


    for (
        let month = 1;
        month <= 12;
        month += 1
    ) {

        const monthValue =
            String(month)
                .padStart(
                    2,
                    "0"
                );


        const option =
            document.createElement(
                "option"
            );


        option.value =
            monthValue;


        option.textContent =
            month + "월";


        titleMonthSelect.appendChild(
            option
        );

    }


    if (
        Array.from(years)
            .includes(
                previousYear
            )
    ) {

        titleYearSelect.value =
            previousYear;

    }


    if (
        previousMonth === "all" ||
        /^(0[1-9]|1[0-2])$/
            .test(
                previousMonth
            )
    ) {

        titleMonthSelect.value =
            previousMonth;

    }


    /*
    2개 이상의 연도 또는 12개 이상의 자료가 있을 때
    날짜필터 표시
    */

    const showDateFilter =

        years.size >= 2 ||
        loadedPosts.length >= 12;


    titleDateFilter?.classList.toggle(

        "hidden",

        !showDateFilter

    );

}


/*==================================================
새 자료 확인
==================================================*/

function isNewPost(post) {

    const postTime =
        getPostDateMs(
            post
        );


    if (!postTime) {

        return false;

    }


    const newPostRange =

        NEW_POST_DAYS *
        24 *
        60 *
        60 *
        1000;


    return (

        Date.now() -
        postTime

    ) <=
        newPostRange;

}


/*==================================================
목록 로딩
==================================================*/

function setListLoading(isLoading) {

    titleLoading?.classList.toggle(

        "hidden",

        !isLoading

    );


    if (
        isLoading &&
        titlePostList
    ) {

        titlePostList.innerHTML =
            "";

    }

}


/*==================================================
자료 목록 출력
==================================================*/

function renderPosts() {

    if (!titlePostList) {

        return;

    }


    titlePostList.innerHTML =
        "";


    if (titlePostCount) {

        titlePostCount.textContent =
            String(
                visiblePosts.length
            );

    }


    if (
        visiblePosts.length === 0
    ) {

        titleEmpty?.classList.remove(
            "hidden"
        );


        const hasSearch =
            Boolean(
                titleSearchInput?.value.trim()
            );


        if (titleEmptyTitle) {

            titleEmptyTitle.textContent =
                hasSearch
                    ? "검색된 자료가 없습니다."
                    : "등록된 자료가 없습니다.";

        }


        if (titleEmptyDescription) {

            titleEmptyDescription.textContent =
                hasSearch
                    ? "다른 검색어 또는 날짜를 선택해 보세요."
                    : "교회 관리자가 자료를 등록하면 이곳에 표시됩니다.";

        }


        return;

    }


    titleEmpty?.classList.add(
        "hidden"
    );


    visiblePosts.forEach(

        post => {

            const item =
                createPostItem(
                    post
                );


            titlePostList.appendChild(
                item
            );

        }

    );

}


/*==================================================
자료 항목 생성
==================================================*/

function createPostItem(post) {

    const item =
        document.createElement(
            "article"
        );


    item.className =
        "titlePostItem";


    if (
        post.pinned === true ||
        post.permanent === true
    ) {

        item.classList.add(
            "pinned"
        );

    }


    item.tabIndex =
        0;


    item.setAttribute(
        "role",
        "button"
    );


    item.setAttribute(
        "aria-label",

        (
            cleanText(
                post.title
            ) ||
            "자료"
        ) +
        " 상세보기"

    );


    const categoryInfo =
        getPostCategoryInfo(
            post
        );


    const attachmentHTML =
        createAttachmentSummaryHTML(
            post
        );


    const newHTML =
        isNewPost(
            post
        )
            ? `

                <span class="titlePostNew">

                    NEW

                </span>

              `
            : "";


    const permanentHTML =
        post.permanent ===
        true
            ? `

                <span class="titlePostPermanent">

                    장기보관

                </span>

              `
            : "";


    item.innerHTML = `

        <div class="titlePostTypeIcon">

            ${escapeHTML(
                categoryInfo.icon
            )}

        </div>


        <div class="titlePostMain">

            <div class="titlePostCategoryRow">

                <span class="titlePostCategory">

                    ${escapeHTML(
                        categoryInfo.name
                    )}

                </span>


                ${newHTML}


                ${permanentHTML}

            </div>


            <div class="titlePostTitle">

                ${escapeHTML(
                    post.title ||
                    "제목 없음"
                )}

            </div>


            <div class="titlePostMeta">

                <span>

                    ${escapeHTML(
                        post.writerName ||
                        "교회 관리자"
                    )}

                </span>


                <span class="titlePostMetaDot">

                    ·

                </span>


                <span>

                    ${escapeHTML(
                        formatPostDate(
                            post
                        )
                    )}

                </span>

            </div>


            ${attachmentHTML}

        </div>


        <div class="titlePostArrow">

            ›

        </div>

    `;


    item.addEventListener(

        "click",

        () => {

            openPostDetail(
                post
            );

        }

    );


    item.addEventListener(

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


    return item;

}


/*==================================================
자료 분류 정보
==================================================*/

function getPostCategoryInfo(post) {

    const categoryKey =
        cleanCategoryKey(
            post?.category
        );


    const known =
        ARCHIVE_CATEGORY_LOOKUP[
            categoryKey
        ];


    if (known) {

        return known;

    }


    return {

        key:
            categoryKey ||
            "other",

        name:
            cleanText(
                post?.categoryName
            ) ||
            "교회 자료",

        icon:
            cleanText(
                post?.categoryIcon
            ) ||
            "📂",

        description:
            "교회 자료"

    };

}


/*==================================================
목록 첨부자료 표시
==================================================*/

function createAttachmentSummaryHTML(post) {

    const attachments =
        [];


    if (
        cleanText(
            post.imageUrl
        )
    ) {

        attachments.push(

            `
                <span class="titlePostAttachment">

                    📷 사진

                </span>
            `

        );

    }


    if (
        cleanText(
            post.pdfUrl
        )
    ) {

        attachments.push(

            `
                <span class="titlePostAttachment">

                    📄 문서

                </span>
            `

        );

    }


    if (
        cleanText(
            post.videoUrl
        )
    ) {

        attachments.push(

            `
                <span class="titlePostAttachment">

                    ▶️ 영상

                </span>
            `

        );

    }


    if (
        cleanText(
            post.linkUrl
        )
    ) {

        attachments.push(

            `
                <span class="titlePostAttachment">

                    🔗 링크

                </span>
            `

        );

    }


    if (
        attachments.length === 0
    ) {

        return "";

    }


    return `

        <div class="titlePostAttachments">

            ${attachments.join("")}

        </div>

    `;

}


/*==================================================
게시글 날짜 표시
==================================================*/

function formatPostDate(post) {

    const publishDate =
        cleanText(
            post?.publishDate
        );


    if (publishDate) {

        return formatDateString(
            publishDate
        );

    }


    const dateMs =
        getPostDateMs(
            post
        );


    if (!dateMs) {

        return "";

    }


    return formatDateObject(

        new Date(
            dateMs
        )

    );

}


/*==================================================
YYYY-MM-DD 날짜 표시
==================================================*/

function formatDateString(value) {

    const parts =
        String(
            value || ""
        ).split(
            "-"
        );


    if (
        parts.length !== 3
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
Date 날짜 표시
==================================================*/

function formatDateObject(date) {

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
        (date.getMonth() + 1) +
        "." +
        date.getDate()

    );

}


/*==================================================
HTML 안전 처리

2/3에서도 계속 사용
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
1/3 끝

다음 2/3 시작 위치

상세보기 열기
보관기간 표시
사진 표시
PDF·영상·링크 열기
즐겨찾기
공유
링크복사
작성 화면 이동
수정 화면 열기
수정폼 채우기
사진 선택과 미리보기
==================================================*/
/*==================================================
상세보기 열기
==================================================*/

function openPostDetail(post) {

    if (!post) {

        return;

    }


    selectedPost =
        post;


    const categoryInfo =
        getPostCategoryInfo(
            post
        );


    if (titleDetailHeaderCategory) {

        titleDetailHeaderCategory.textContent =
            categoryInfo.name;

    }


    if (titleDetailCategory) {

        titleDetailCategory.textContent =
            categoryInfo.name;

    }


    titleDetailNew?.classList.toggle(

        "hidden",

        !isNewPost(
            post
        )

    );


    titleDetailExpired?.classList.toggle(

        "hidden",

        !isArchiveExpired(
            post
        )

    );


    titleDetailPermanent?.classList.toggle(

        "hidden",

        post.permanent !==
        true

    );


    if (titleDetailTitle) {

        titleDetailTitle.textContent =
            cleanText(
                post.title
            ) ||
            "제목 없음";

    }


    if (titleDetailWriter) {

        titleDetailWriter.textContent =
            cleanText(
                post.writerName
            ) ||
            "교회 관리자";

    }


    if (titleDetailDate) {

        titleDetailDate.textContent =
            formatPostDate(
                post
            );

    }


    showPostPeriod(
        post
    );


    showPostImage(
        post
    );


    if (titleDetailText) {

        titleDetailText.textContent =
            cleanText(
                post.content
            );

    }


    showPostAttachments(
        post
    );


    updateFavoriteButton();


    const allowed =
        canManagePost(
            post
        );


    titleDetailAdminArea?.classList.toggle(

        "hidden",

        !allowed

    );


    titleDetailMenuBtn?.classList.toggle(

        "hidden",

        !allowed

    );


    titleDetailOverlay?.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    updateBrowserPostParameter(
        post.id
    );

}


/*==================================================
상세 보관기간 표시
==================================================*/

function showPostPeriod(post) {

    const publishDate =
        cleanText(
            post?.publishDate
        );


    const archiveUntil =
        cleanText(

            post?.archiveUntil ||
            post?.expireDate

        );


    if (
        post?.permanent ===
        true
    ) {

        titleDetailPeriod?.classList.remove(
            "hidden"
        );


        if (titleDetailPeriodText) {

            titleDetailPeriodText.textContent =

                publishDate
                    ? formatDateString(
                        publishDate
                    ) +
                      "부터 · 장기보관"
                    : "장기보관";

        }


        return;

    }


    if (
        !publishDate &&
        !archiveUntil
    ) {

        titleDetailPeriod?.classList.add(
            "hidden"
        );


        return;

    }


    let periodText =
        "";


    if (
        publishDate &&
        archiveUntil
    ) {

        periodText =

            formatDateString(
                publishDate
            ) +
            " ~ " +
            formatDateString(
                archiveUntil
            );

    } else if (
        publishDate
    ) {

        periodText =

            formatDateString(
                publishDate
            ) +
            "부터";

    } else {

        periodText =

            formatDateString(
                archiveUntil
            ) +
            "까지";

    }


    if (titleDetailPeriodText) {

        titleDetailPeriodText.textContent =
            periodText;

    }


    titleDetailPeriod?.classList.remove(
        "hidden"
    );

}


/*==================================================
상세 사진 표시
==================================================*/

function showPostImage(post) {

    const imageUrl =
        cleanText(
            post?.imageUrl
        );


    if (
        !imageUrl ||
        !isSafeHttpUrl(
            imageUrl
        )
    ) {

        titleDetailImageArea?.classList.add(
            "hidden"
        );


        if (titleDetailImage) {

            titleDetailImage.removeAttribute(
                "src"
            );

        }


        return;

    }


    if (titleDetailImage) {

        titleDetailImage.src =
            imageUrl;


        titleDetailImage.alt =
            cleanText(
                post.title
            ) ||
            "자료 대표사진";

    }


    titleDetailImageArea?.classList.remove(
        "hidden"
    );

}


/*==================================================
상세 첨부자료 표시
==================================================*/

function showPostAttachments(post) {

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


    titlePdfBtn?.classList.toggle(

        "hidden",

        !hasPdf

    );


    titleVideoBtn?.classList.toggle(

        "hidden",

        !hasVideo

    );


    titleLinkBtn?.classList.toggle(

        "hidden",

        !hasLink

    );


    if (
        hasPdf &&
        titlePdfName
    ) {

        titlePdfName.textContent =
            cleanText(
                post.pdfName
            ) ||
            "문서 보기";

    }


    if (
        hasVideo &&
        titleVideoName
    ) {

        titleVideoName.textContent =
            cleanText(
                post.videoName
            ) ||
            "영상 보기";

    }


    if (
        hasLink &&
        titleLinkName
    ) {

        titleLinkName.textContent =
            cleanText(
                post.linkName
            ) ||
            (
                post.category ===
                "eventPhoto"
                    ? "사진앨범 보기"
                    : "연결 페이지 보기"
            );

    }


    titleAttachmentArea?.classList.toggle(

        "hidden",

        !(
            hasPdf ||
            hasVideo ||
            hasLink
        )

    );


    setExternalButton(

        titlePdfBtn,

        pdfUrl

    );


    setExternalButton(

        titleVideoBtn,

        videoUrl

    );


    setExternalButton(

        titleLinkBtn,

        linkUrl

    );

}


/*==================================================
외부 주소 버튼 연결
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

function openExternalUrl(url) {

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


    /*
    Android WebView 등에서
    새 창이 막히면 현재 창으로 이동
    */

    if (!opened) {

        window.location.href =
            url;

    }

}


/*==================================================
안전한 HTTP 주소 확인
==================================================*/

function isSafeHttpUrl(value) {

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

    titleDetailOverlay?.classList.add(
        "hidden"
    );


    selectedPost =
        null;


    document.body.style.overflow =
        "";


    removeBrowserPostParameter();

}


/*==================================================
즐겨찾기 저장
==================================================*/

function saveFavoritePostIds() {

    try {

        const values =
            Array.from(
                favoritePostIds
            );


        localStorage.setItem(

            FAVORITE_STORAGE_KEY,

            JSON.stringify(
                values
            )

        );

    }

    catch (error) {

        console.error(
            "즐겨찾기 저장 오류:",
            error
        );

    }

}


/*==================================================
현재 자료 즐겨찾기 여부
==================================================*/

function isSelectedPostFavorite() {

    if (!selectedPost?.id) {

        return false;

    }


    return favoritePostIds.has(
        selectedPost.id
    );

}


/*==================================================
즐겨찾기 버튼 표시
==================================================*/

function updateFavoriteButton() {

    const active =
        isSelectedPostFavorite();


    titleFavoriteBtn?.classList.toggle(

        "active",

        active

    );


    if (titleFavoriteIcon) {

        titleFavoriteIcon.textContent =
            active
                ? "★"
                : "☆";

    }

}


/*==================================================
즐겨찾기 추가·삭제
==================================================*/

function toggleFavorite() {

    if (!selectedPost?.id) {

        return;

    }


    const postId =
        selectedPost.id;


    if (
        favoritePostIds.has(
            postId
        )
    ) {

        favoritePostIds.delete(
            postId
        );


        showToast(
            "즐겨찾기에서 삭제했습니다."
        );

    } else {

        favoritePostIds.add(
            postId
        );


        /*
        개인 휴대폰 저장이 너무 커지지 않도록
        최대 300개만 유지
        */

        if (
            favoritePostIds.size >
            300
        ) {

            const firstId =
                favoritePostIds
                    .values()
                    .next()
                    .value;


            if (firstId) {

                favoritePostIds.delete(
                    firstId
                );

            }

        }


        showToast(
            "즐겨찾기에 저장했습니다."
        );

    }


    saveFavoritePostIds();


    updateFavoriteButton();

}


/*==================================================
선택 자료 공유
==================================================*/

async function shareSelectedPost() {

    if (!selectedPost) {

        return;

    }


    const shareUrl =
        createSelectedPostUrl();


    const shareData = {

        title:
            cleanText(
                selectedPost.title
            ) ||
            "예톡 교회 자료",

        text:
            createShareText(
                selectedPost
            ),

        url:
            shareUrl

    };


    try {

        if (
            typeof navigator.share ===
            "function"
        ) {

            await navigator.share(
                shareData
            );


            return;

        }


        await copyTextToClipboard(

            shareData.text +
            "\n" +
            shareUrl

        );


        showToast(
            "공유할 내용과 링크를 복사했습니다."
        );

    }

    catch (error) {

        if (
            error?.name ===
            "AbortError"
        ) {

            return;

        }


        console.error(
            "공유 오류:",
            error
        );


        showToast(
            "공유하지 못했습니다."
        );

    }

}


/*==================================================
공유 내용 만들기
==================================================*/

function createShareText(post) {

    const content =
        cleanText(
            post?.content
        );


    const shortContent =
        content.length >
        140
            ? content.slice(
                0,
                140
            ) +
              "…"
            : content;


    return [

        currentChurchName,

        cleanText(
            post?.title
        ),

        shortContent

    ]
        .filter(Boolean)
        .join(
            "\n"
        );

}


/*==================================================
선택 자료 링크복사
==================================================*/

async function copySelectedPostLink() {

    if (!selectedPost) {

        return;

    }


    try {

        await copyTextToClipboard(

            createSelectedPostUrl()

        );


        showToast(
            "자료 링크를 복사했습니다."
        );

    }

    catch (error) {

        console.error(
            "링크 복사 오류:",
            error
        );


        showToast(
            "링크를 복사하지 못했습니다."
        );

    }

}


/*==================================================
선택 자료 URL 만들기
==================================================*/

function createSelectedPostUrl() {

    const url =
        new URL(
            window.location.href
        );


    const category =
        cleanCategoryKey(

            selectedPost?.category ||
            currentCategory

        ) ||
        "all";


    url.searchParams.set(
        "category",
        category
    );


    url.searchParams.set(
        "post",
        selectedPost?.id ||
        ""
    );


    if (
        cleanText(
            selectedPost?.categoryName
        )
    ) {

        url.searchParams.set(

            "name",

            selectedPost.categoryName

        );

    }


    if (
        cleanText(
            selectedPost?.categoryIcon
        )
    ) {

        url.searchParams.set(

            "icon",

            selectedPost.categoryIcon

        );

    }


    return url.toString();

}


/*==================================================
클립보드 복사
==================================================*/

async function copyTextToClipboard(text) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        await navigator.clipboard.writeText(
            text
        );


        return;

    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.top =
        "0";


    textarea.style.left =
        "-9999px";


    textarea.setAttribute(
        "readonly",
        ""
    );


    document.body.appendChild(
        textarea
    );


    textarea.focus();


    textarea.select();


    const success =
        document.execCommand(
            "copy"
        );


    textarea.remove();


    if (!success) {

        throw new Error(
            "클립보드 복사 실패"
        );

    }

}


/*==================================================
주소에 현재 자료 ID 추가
==================================================*/

function updateBrowserPostParameter(
    postId
) {

    if (!postId) {

        return;

    }


    try {

        const url =
            new URL(
                window.location.href
            );


        url.searchParams.set(
            "post",
            postId
        );


        history.replaceState(

            null,

            "",

            url.toString()

        );

    }

    catch (error) {

        console.warn(
            "자료 주소 표시 오류:",
            error
        );

    }

}


/*==================================================
주소에서 자료 ID 제거
==================================================*/

function removeBrowserPostParameter() {

    try {

        const url =
            new URL(
                window.location.href
            );


        url.searchParams.delete(
            "post"
        );


        history.replaceState(

            null,

            "",

            url.toString()

        );

    }

    catch (error) {

        console.warn(
            "자료 주소 정리 오류:",
            error
        );

    }

}


/*==================================================
URL의 자료 자동 열기
==================================================*/

function openRequestedPostFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const postId =
        cleanText(
            params.get(
                "post"
            )
        );


    if (!postId) {

        return;

    }


    const post =
        loadedPosts.find(

            item =>
                item.id ===
                postId

        );


    if (!post) {

        showToast(
            "해당 자료를 찾지 못했습니다."
        );


        return;

    }


    /*
    만료되거나 숨김된 자료는
    직접 링크로도 열지 않음
    */

    if (
        post.status &&
        cleanText(
            post.status
        ).toLowerCase() !==
        "active"
    ) {

        showToast(
            "현재 볼 수 없는 자료입니다."
        );


        return;

    }


    if (
        isArchiveExpired(
            post
        )
    ) {

        showToast(
            "보관기간이 끝난 자료입니다."
        );


        return;

    }


    openPostDetail(
        post
    );

}


/*==================================================
자료 등록 화면 이동
==================================================*/

function openNewPostWriter() {

    if (
        !canWriteBoard()
    ) {

        showToast(
            "자료를 등록할 권한이 없습니다."
        );


        return;

    }


    if (
        WRITE_FROM_CHATNOTICE_ONLY
    ) {

        const params =
            new URLSearchParams();


        params.set(
            "mode",
            "write"
        );


        if (
            currentCategory !==
            "all"
        ) {

            params.set(
                "category",
                currentCategory
            );


            params.set(

                "categoryName",

                currentCategoryInfo?.name ||
                "교회 자료"

            );


            params.set(

                "categoryIcon",

                currentCategoryInfo?.icon ||
                "📂"

            );

        }


        location.href =

            "chatnotice.html?" +
            params.toString();


        return;

    }


    showToast(
        "새 자료 등록은 공지알림에서 진행합니다."
    );

}


/*==================================================
자료 수정화면 열기
==================================================*/

function openEditPost() {

    if (
        !selectedPost ||
        !canManagePost(
            selectedPost
        )
    ) {

        showToast(
            "자료를 수정할 권한이 없습니다."
        );


        return;

    }


    editingPost =
        selectedPost;


    selectedImageFile =
        null;


    removeExistingImage =
        false;


    clearSelectedPreviewUrl();


    resetWriteForm();


    fillWriteForm(
        editingPost
    );


    titleDetailOverlay?.classList.add(
        "hidden"
    );


    titleWriteOverlay?.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(

        () => {

            titleWriteTitle?.focus();

        },

        100

    );

}


/*==================================================
수정폼 초기화
==================================================*/

function resetWriteForm() {

    if (titleWriteHeaderText) {

        titleWriteHeaderText.textContent =
            "자료 수정";

    }


    if (titleSelectedCategoryName) {

        titleSelectedCategoryName.textContent =
            currentCategoryInfo?.name ||
            "교회 자료";

    }


    if (titleWriteCategory) {

        titleWriteCategory.value =
            currentCategory ===
            "all"
                ? ""
                : currentCategory;

    }


    if (titleWriteTitle) {

        titleWriteTitle.value =
            "";

    }


    if (titleWriteText) {

        titleWriteText.value =
            "";

    }


    if (titlePublishDate) {

        titlePublishDate.value =
            getTodayKey();

    }


    if (titleExpireDate) {

        titleExpireDate.value =
            "";


        titleExpireDate.disabled =
            false;

    }


    if (titleImageInput) {

        titleImageInput.value =
            "";

    }


    hideImagePreview();


    if (titlePdfUrl) {

        titlePdfUrl.value =
            "";

    }


    if (titlePdfNameInput) {

        titlePdfNameInput.value =
            "";

    }


    if (titleVideoUrl) {

        titleVideoUrl.value =
            "";

    }


    if (titleVideoNameInput) {

        titleVideoNameInput.value =
            "";

    }


    if (titleLinkUrl) {

        titleLinkUrl.value =
            "";

    }


    if (titleLinkNameInput) {

        titleLinkNameInput.value =
            "";

    }


    if (titleShowInNotice) {

        titleShowInNotice.checked =
            false;

    }


    if (titleSendIndexNotice) {

        titleSendIndexNotice.checked =
            false;

    }

}


/*==================================================
기존 자료 수정폼에 표시
==================================================*/

function fillWriteForm(post) {

    const categoryInfo =
        getPostCategoryInfo(
            post
        );


    if (titleSelectedCategoryName) {

        titleSelectedCategoryName.textContent =
            categoryInfo.name;

    }


    if (titleWriteCategory) {

        titleWriteCategory.value =
            cleanCategoryKey(
                post.category
            );

    }


    if (titleWriteTitle) {

        titleWriteTitle.value =
            cleanText(
                post.title
            );

    }


    if (titleWriteText) {

        titleWriteText.value =
            cleanText(
                post.content
            );

    }


    if (titlePublishDate) {

        titlePublishDate.value =
            cleanText(
                post.publishDate
            ) ||
            getTodayKey();

    }


    if (titleExpireDate) {

        titleExpireDate.value =
            cleanText(

                post.archiveUntil ||
                post.expireDate

            );


        titleExpireDate.disabled =
            post.permanent ===
            true;

    }


    if (titlePdfUrl) {

        titlePdfUrl.value =
            cleanText(
                post.pdfUrl
            );

    }


    if (titlePdfNameInput) {

        titlePdfNameInput.value =
            cleanText(
                post.pdfName
            );

    }


    if (titleVideoUrl) {

        titleVideoUrl.value =
            cleanText(
                post.videoUrl
            );

    }


    if (titleVideoNameInput) {

        titleVideoNameInput.value =
            cleanText(
                post.videoName
            );

    }


    if (titleLinkUrl) {

        titleLinkUrl.value =
            cleanText(
                post.linkUrl
            );

    }


    if (titleLinkNameInput) {

        titleLinkNameInput.value =
            cleanText(
                post.linkName
            );

    }


    if (titleShowInNotice) {

        titleShowInNotice.checked =
            post.showInNotice ===
            true;

    }


    if (titleSendIndexNotice) {

        titleSendIndexNotice.checked =
            post.sendIndexNotice ===
            true;

    }


    const imageUrl =
        cleanText(
            post.imageUrl
        );


    if (
        imageUrl &&
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
수정화면 닫기
==================================================*/

function closeWriteOverlay() {

    titleWriteOverlay?.classList.add(
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


    if (returnToDetail) {

        titleDetailOverlay?.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";

    } else {

        document.body.style.overflow =
            "";

    }

}


/*==================================================
사진 선택
==================================================*/

function handleImageSelect() {

    const file =
        titleImageInput?.files?.[0];


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


        titleImageInput.value =
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


        titleImageInput.value =
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
사진 미리보기 표시
==================================================*/

function showImagePreview(url) {

    if (
        !titleImagePreview ||
        !titleImagePreviewImg
    ) {

        return;

    }


    titleImagePreviewImg.src =
        url;


    titleImagePreview.classList.remove(
        "hidden"
    );

}


/*==================================================
사진 미리보기 숨김
==================================================*/

function hideImagePreview() {

    titleImagePreview?.classList.add(
        "hidden"
    );


    if (titleImagePreviewImg) {

        titleImagePreviewImg.removeAttribute(
            "src"
        );

    }

}


/*==================================================
사진 삭제 선택
==================================================*/

function removeSelectedImage() {

    selectedImageFile =
        null;


    removeExistingImage =
        Boolean(

            editingPost?.imageUrl ||
            editingPost?.imagePath

        );


    if (titleImageInput) {

        titleImageInput.value =
            "";

    }


    clearSelectedPreviewUrl();


    hideImagePreview();

}


/*==================================================
Object URL 해제
==================================================*/

function clearSelectedPreviewUrl() {

    if (!selectedImagePreviewUrl) {

        return;

    }


    URL.revokeObjectURL(
        selectedImagePreviewUrl
    );


    selectedImagePreviewUrl =
        "";

}


/*==================================================
수정 내용 검사
==================================================*/

function validateEditForm() {

    const title =
        cleanText(
            titleWriteTitle?.value
        );


    const content =
        cleanText(
            titleWriteText?.value
        );


    const publishDate =
        cleanText(
            titlePublishDate?.value
        ) ||
        getTodayKey();


    const archiveUntil =
        editingPost?.permanent ===
        true
            ? ""
            : cleanText(
                titleExpireDate?.value
            );


    const pdfUrl =
        cleanText(
            titlePdfUrl?.value
        );


    const videoUrl =
        cleanText(
            titleVideoUrl?.value
        );


    const linkUrl =
        cleanText(
            titleLinkUrl?.value
        );


    if (!title) {

        showToast(
            "자료 제목을 입력하세요."
        );


        titleWriteTitle?.focus();


        return false;

    }


    if (
        title.length >
        100
    ) {

        showToast(
            "제목은 100자 이하로 작성해 주세요."
        );


        titleWriteTitle?.focus();


        return false;

    }


    if (
        content.length >
        5000
    ) {

        showToast(
            "내용은 5,000자 이하로 작성해 주세요."
        );


        titleWriteText?.focus();


        return false;

    }


    if (
        archiveUntil &&
        archiveUntil <
        publishDate
    ) {

        showToast(
            "보관 종료일은 게시일보다 빠를 수 없습니다."
        );


        titleExpireDate?.focus();


        return false;

    }


    if (
        pdfUrl &&
        !isSafeHttpUrl(
            pdfUrl
        )
    ) {

        showToast(
            "문서 주소를 확인해 주세요."
        );


        titlePdfUrl?.focus();


        return false;

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


        titleVideoUrl?.focus();


        return false;

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


        titleLinkUrl?.focus();


        return false;

    }


    return {

        title:
            title,

        content:
            content,

        publishDate:
            publishDate,

        archiveUntil:
            archiveUntil,

        pdfUrl:
            pdfUrl,

        videoUrl:
            videoUrl,

        linkUrl:
            linkUrl

    };

}


/*==================================================
2/3 끝

다음 3/3 시작 위치

자료 수정 저장
사진 Storage 업로드
Storage 기존 사진 삭제
삭제 확인
자료 삭제
댓글 하위 컬렉션 삭제
이벤트 연결
검색창
연도·월 초기화
날짜 함수
경로·파일명 정리
Firebase 오류
토스트
URL 자료 자동열기
==================================================*/
/*==================================================
자료 수정 저장
==================================================*/

async function savePost() {

    if (
        isSavingPost ||
        !editingPost ||
        !canManagePost(
            editingPost
        )
    ) {

        return;

    }


    const formData =
        validateEditForm();


    if (!formData) {

        return;

    }


    isSavingPost =
        true;


    setSaveLoading(
        true
    );


    try {

        const postId =
            editingPost.id;


        const postRef =
            getBoardDocument(
                postId
            );


        let imageUrl =
            cleanText(
                editingPost.imageUrl
            );


        let imagePath =
            cleanText(
                editingPost.imagePath
            );


        /*
        기존 사진 삭제를 선택한 경우
        */

        if (removeExistingImage) {

            await deleteStorageImageSafely(
                imagePath
            );


            imageUrl =
                "";


            imagePath =
                "";

        }


        /*
        새 사진을 선택한 경우

        기존 사진을 먼저 삭제하고
        새 사진을 Storage에 올린다.
        */

        if (selectedImageFile) {

            if (imagePath) {

                await deleteStorageImageSafely(
                    imagePath
                );

            }


            const uploadResult =
                await uploadBoardImage(

                    selectedImageFile,

                    postId

                );


            imageUrl =
                uploadResult.url;


            imagePath =
                uploadResult.path;

        }


        const nowMs =
            Date.now();


        const categoryKey =
            cleanCategoryKey(

                titleWriteCategory?.value ||
                editingPost.category

            );


        const categoryInfo =
            getPostCategoryInfo(
                editingPost
            );


        const updatedData = {

            /*
            교회 정보는 유지
            */

            churchId:
                currentChurchId,

            churchName:
                currentChurchName,


            /*
            자료실 정보
            */

            saveToArchive:
                true,

            category:
                categoryKey,

            categoryName:
                cleanText(
                    editingPost.categoryName
                ) ||
                categoryInfo.name,

            categoryIcon:
                cleanText(
                    editingPost.categoryIcon
                ) ||
                categoryInfo.icon,

            archiveMainCategory:
                cleanText(
                    editingPost.archiveMainCategory
                ) ||
                categoryInfo.mainKey ||
                "",

            archiveMainCategoryName:
                cleanText(
                    editingPost.archiveMainCategoryName
                ) ||
                categoryInfo.mainName ||
                "",


            /*
            기본 내용
            */

            title:
                formData.title,

            content:
                formData.content,

            publishDate:
                formData.publishDate,

            publishDateMs:
                getStartOfDateMs(
                    formData.publishDate
                ),

            archiveUntil:
                formData.archiveUntil,

            expireDate:
                formData.archiveUntil,

            permanent:
                editingPost.permanent ===
                true,


            /*
            사진
            */

            imageUrl:
                imageUrl,

            imagePath:
                imagePath,


            /*
            문서
            */

            pdfUrl:
                formData.pdfUrl,

            pdfName:
                cleanText(
                    titlePdfNameInput?.value
                ),


            /*
            영상
            */

            videoUrl:
                formData.videoUrl,

            videoName:
                cleanText(
                    titleVideoNameInput?.value
                ),


            /*
            외부 링크
            */

            linkUrl:
                formData.linkUrl,

            linkName:
                cleanText(
                    titleLinkNameInput?.value
                ),


            /*
            공지 표시 설정

            공지 종료일은 기존 값을 유지한다.
            */

            showInNotice:
                titleShowInNotice?.checked ===
                true,

            sendIndexNotice:
                titleSendIndexNotice?.checked ===
                true,


            /*
            상태
            */

            status:
                "active",

            updatedAt:
                serverTimestamp(),

            updatedAtMs:
                nowMs

        };


        await setDoc(

            postRef,

            updatedData,

            {
                merge:
                    true
            }

        );


        const updatedPost = {

            ...editingPost,

            ...updatedData,

            id:
                postId

        };


        updatePostInMemory(
            updatedPost
        );


        selectedPost =
            updatedPost;


        showToast(
            "자료가 수정되었습니다."
        );


        titleWriteOverlay?.classList.add(
            "hidden"
        );


        titleDetailOverlay?.classList.add(
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


        await loadPosts(
            true
        );

    }

    catch (error) {

        console.error(
            "자료 수정 오류:",
            error
        );


        showToast(
            getFirebaseErrorMessage(
                error,
                "자료를 수정하지 못했습니다."
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

function setSaveLoading(isLoading) {

    if (!titleWriteSaveBtn) {

        return;

    }


    titleWriteSaveBtn.disabled =
        isLoading;


    titleWriteSaveBtn.textContent =
        isLoading
            ? "저장 중"
            : "저장";

}


/*==================================================
사진 Storage 업로드

저장 경로

churchBoards
    /교회ID
    /게시글ID
    /시간_파일명
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


    const imagePath =

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
            imagePath
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


    const downloadUrl =
        await getDownloadURL(
            imageReference
        );


    return {

        url:
            downloadUrl,

        path:
            imagePath

    };

}


/*==================================================
Storage 기존 사진 안전 삭제
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

        /*
        Storage 파일이 이미 없거나
        삭제 권한이 없는 경우에도

        Firestore 자료 수정·삭제는
        계속 진행할 수 있도록 한다.
        */

        console.warn(
            "기존 사진 삭제 실패:",
            error
        );

    }

}


/*==================================================
삭제 확인창 열기
==================================================*/

function openDeleteConfirm() {

    if (
        !selectedPost ||
        !canManagePost(
            selectedPost
        )
    ) {

        showToast(
            "자료를 삭제할 권한이 없습니다."
        );


        return;

    }


    titleConfirmOverlay?.classList.remove(
        "hidden"
    );

}


/*==================================================
삭제 확인창 닫기
==================================================*/

function closeDeleteConfirm() {

    titleConfirmOverlay?.classList.add(
        "hidden"
    );

}


/*==================================================
자료 삭제
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
        댓글 하위 컬렉션을 먼저 삭제
        */

        await deletePostComments(
            postId
        );


        /*
        게시글 원본 삭제

        같은 원본을 chatnotice와 chattitle이
        함께 사용하므로 양쪽에서 모두 사라진다.
        */

        await deleteDoc(
            getBoardDocument(
                postId
            )
        );


        /*
        대표사진 삭제
        */

        await deleteStorageImageSafely(
            imagePath
        );


        /*
        개인 즐겨찾기에서 삭제
        */

        removeFavoritePostId(
            postId
        );


        closeDeleteConfirm();


        closePostDetail();


        showToast(
            "자료가 삭제되었습니다."
        );


        await loadPosts(
            true
        );

    }

    catch (error) {

        console.error(
            "자료 삭제 오류:",
            error
        );


        showToast(
            getFirebaseErrorMessage(
                error,
                "자료를 삭제하지 못했습니다."
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
댓글 하위 컬렉션 삭제
==================================================*/

async function deletePostComments(postId) {

    if (!postId) {

        return;

    }


    try {

        const commentCollection =
            collection(

                getBoardDocument(
                    postId
                ),

                "comments"

            );


        const snapshot =
            await getDocs(
                commentCollection
            );


        const deleteTasks =
            [];


        snapshot.forEach(

            item => {

                deleteTasks.push(

                    deleteDoc(
                        item.ref
                    )

                );

            }

        );


        if (
            deleteTasks.length >
            0
        ) {

            await Promise.all(
                deleteTasks
            );

        }

    }

    catch (error) {

        /*
        댓글 삭제에 실패하면
        게시글만 삭제되어 고아 댓글이 남을 수 있으므로
        게시글 삭제도 중지한다.
        */

        console.error(
            "댓글 삭제 오류:",
            error
        );


        throw error;

    }

}


/*==================================================
삭제 버튼 상태
==================================================*/

function setDeleteLoading(isLoading) {

    if (!titleConfirmDeleteBtn) {

        return;

    }


    titleConfirmDeleteBtn.disabled =
        isLoading;


    titleConfirmDeleteBtn.textContent =
        isLoading
            ? "삭제 중"
            : "삭제";

}


/*==================================================
즐겨찾기에서 자료 ID 삭제
==================================================*/

function removeFavoritePostId(postId) {

    if (!postId) {

        return;

    }


    favoritePostIds.delete(
        postId
    );


    saveFavoritePostIds();

}


/*==================================================
메모리 자료 갱신
==================================================*/

function updatePostInMemory(updatedPost) {

    if (!updatedPost?.id) {

        return;

    }


    const updateArray =
        array => {

            const index =
                array.findIndex(

                    item =>
                        item.id ===
                        updatedPost.id

                );


            if (index >= 0) {

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
검색창 열기
==================================================*/

function openSearchArea() {

    titleSearchArea?.classList.remove(
        "hidden"
    );


    setTimeout(

        () => {

            titleSearchInput?.focus();

        },

        100

    );

}


/*==================================================
검색창 닫기
==================================================*/

function closeSearchArea() {

    titleSearchArea?.classList.add(
        "hidden"
    );

}


/*==================================================
검색어 지우기
==================================================*/

function clearSearchInput() {

    if (!titleSearchInput) {

        return;

    }


    titleSearchInput.value =
        "";


    titleSearchClearBtn?.classList.add(
        "hidden"
    );


    applyCurrentFilter();


    titleSearchInput.focus();

}


/*==================================================
연도·월 필터 초기화
==================================================*/

function resetDateFilter() {

    if (titleYearSelect) {

        titleYearSelect.value =
            "all";

    }


    if (titleMonthSelect) {

        titleMonthSelect.value =
            "all";

    }


    applyCurrentFilter();


    showToast(
        "날짜 선택을 초기화했습니다."
    );

}


/*==================================================
자료실 메뉴 관리

현재 자료실은 고정 대분류·소분류를 사용한다.

교회별 사용자 자료실 메뉴 관리는
교회 관리자 화면에서 별도로 연결한다.
==================================================*/

function openArchiveMenuManagement() {

    if (
        !canManageBoard()
    ) {

        showToast(
            "자료실 메뉴를 관리할 권한이 없습니다."
        );


        return;

    }


    showToast(
        "사용자 자료실 관리는 교회 관리자 메뉴에서 연결할 예정입니다."
    );

}


/*==================================================
기본 이벤트 연결
==================================================*/

function bindBasicEvents() {

    /*
    기본 화면 뒤로가기
    */

    titleBackBtn?.addEventListener(

        "click",

        () => {

            history.back();

        }

    );


    /*
    검색
    */

    titleSearchBtn?.addEventListener(

        "click",

        openSearchArea

    );


    titleSearchCloseBtn?.addEventListener(

        "click",

        closeSearchArea

    );


    titleSearchClearBtn?.addEventListener(

        "click",

        clearSearchInput

    );


    titleSearchInput?.addEventListener(

        "input",

        () => {

            const hasText =
                Boolean(
                    titleSearchInput.value.trim()
                );


            titleSearchClearBtn?.classList.toggle(

                "hidden",

                !hasText

            );


            applyCurrentFilter();

        }

    );


    /*
    정렬
    */

    titleSortSelect?.addEventListener(

        "change",

        applyCurrentFilter

    );


    /*
    연도·월 필터
    */

    titleYearSelect?.addEventListener(

        "change",

        applyCurrentFilter

    );


    titleMonthSelect?.addEventListener(

        "change",

        applyCurrentFilter

    );


    titleDateResetBtn?.addEventListener(

        "click",

        resetDateFilter

    );


    /*
    새로고침
    */

    titleRefreshBtn?.addEventListener(

        "click",

        async () => {

            await loadPosts(
                true
            );


            showToast(
                "자료를 새로 불러왔습니다."
            );

        }

    );


    /*
    이전 자료 더 보기
    */

    titleMoreBtn?.addEventListener(

        "click",

        async () => {

            currentLoadLimit =
                Math.min(

                    MAX_LOAD_LIMIT,

                    currentLoadLimit +
                    MORE_LOAD_LIMIT

                );


            await loadPosts(
                false
            );

        }

    );


    /*
    자료 등록
    */

    titleWriteBtn?.addEventListener(

        "click",

        openNewPostWriter

    );


    /*
    자료실 메뉴 관리
    */

    titleArchiveManageBtn?.addEventListener(

        "click",

        openArchiveMenuManagement

    );


    /*
    대분류·소분류 화면 닫기
    */

    titleCategoryBackBtn?.addEventListener(

        "click",

        closeCategoryOverlay

    );


    /*
    상세보기 닫기
    */

    titleDetailBackBtn?.addEventListener(

        "click",

        closePostDetail

    );


    /*
    상세 관리자 메뉴
    */

    titleDetailMenuBtn?.addEventListener(

        "click",

        () => {

            if (
                selectedPost &&
                canManagePost(
                    selectedPost
                )
            ) {

                titleDetailAdminArea
                    ?.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "center"

                    });

            }

        }

    );


    /*
    즐겨찾기
    */

    titleFavoriteBtn?.addEventListener(

        "click",

        toggleFavorite

    );


    /*
    공유
    */

    titleShareBtn?.addEventListener(

        "click",

        shareSelectedPost

    );


    /*
    링크복사
    */

    titleCopyLinkBtn?.addEventListener(

        "click",

        copySelectedPostLink

    );


    /*
    수정·삭제
    */

    titleDetailEditBtn?.addEventListener(

        "click",

        openEditPost

    );


    titleDetailDeleteBtn?.addEventListener(

        "click",

        openDeleteConfirm

    );


    /*
    수정화면
    */

    titleWriteCloseBtn?.addEventListener(

        "click",

        closeWriteOverlay

    );


    titleWriteSaveBtn?.addEventListener(

        "click",

        savePost

    );


    titleImageInput?.addEventListener(

        "change",

        handleImageSelect

    );


    titleImageRemoveBtn?.addEventListener(

        "click",

        removeSelectedImage

    );


    /*
    삭제 확인
    */

    titleConfirmCancelBtn?.addEventListener(

        "click",

        closeDeleteConfirm

    );


    titleConfirmDeleteBtn?.addEventListener(

        "click",

        deleteSelectedPost

    );


    titleConfirmOverlay?.addEventListener(

        "click",

        event => {

            if (
                event.target ===
                titleConfirmOverlay
            ) {

                closeDeleteConfirm();

            }

        }

    );


    /*
    ESC 키
    */

    document.addEventListener(

        "keydown",

        handleEscapeKey

    );

}


/*==================================================
ESC 키 처리
==================================================*/

function handleEscapeKey(event) {

    if (
        event.key !==
        "Escape"
    ) {

        return;

    }


    /*
    삭제 확인창 우선
    */

    if (
        !titleConfirmOverlay
            ?.classList
            .contains(
                "hidden"
            )
    ) {

        closeDeleteConfirm();


        return;

    }


    /*
    수정화면
    */

    if (
        !titleWriteOverlay
            ?.classList
            .contains(
                "hidden"
            )
    ) {

        closeWriteOverlay();


        return;

    }


    /*
    상세보기
    */

    if (
        !titleDetailOverlay
            ?.classList
            .contains(
                "hidden"
            )
    ) {

        closePostDetail();


        return;

    }


    /*
    대분류·소분류 화면
    */

    if (
        !titleCategoryOverlay
            ?.classList
            .contains(
                "hidden"
            )
    ) {

        closeCategoryOverlay();


        return;

    }


    /*
    검색창
    */

    if (
        !titleSearchArea
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
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        )

    );

}


/*==================================================
날짜 시작 시각
==================================================*/

function getStartOfDateMs(dateValue) {

    const value =
        cleanText(
            dateValue
        );


    if (!value) {

        return Date.now();

    }


    const date =
        new Date(
            value +
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
Storage 경로 문자 정리
==================================================*/

function makeSafePathPart(value) {

    return String(
        value || "yetalk"
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
파일명 정리
==================================================*/

function makeSafeFileName(value) {

    const cleaned =
        String(
            value || "image.jpg"
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


    return cleaned ||
        "image.jpg";

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
            "Firebase 자료 접근 권한이 없습니다. " +
            "회원 권한과 Firestore 보안 규칙을 확인해 주세요."
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
            "자료실 검색 인덱스가 아직 준비되지 않았습니다. " +
            "Firebase Console에 표시되는 인덱스 생성 링크를 눌러주세요."
        );

    }


    if (
        code ===
        "storage/unauthorized"
    ) {

        return (
            "사진 저장 권한이 없습니다. " +
            "Firebase Storage 보안 규칙을 확인해 주세요."
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


    if (
        code ===
        "storage/unknown"
    ) {

        return (
            "사진 저장 중 오류가 발생했습니다. " +
            "잠시 후 다시 시도해 주세요."
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
토스트 알림
==================================================*/

function showToast(message) {

    if (!titleToast) {

        return;

    }


    titleToast.textContent =
        cleanText(
            message
        );


    titleToast.classList.add(
        "show"
    );


    if (toastTimer) {

        clearTimeout(
            toastTimer
        );

    }


    toastTimer =
        setTimeout(

            () => {

                titleToast.classList.remove(
                    "show"
                );

            },

            2400

        );

}


/*==================================================
URL 자료 자동 열기 준비

공유 링크 예:

chattitle.html
?category=sundaySermon
&post=게시글ID

페이지 로딩 후 자료가 준비되면
해당 상세보기를 자동으로 연다.
==================================================*/

let requestedPostOpenAttempts =
    0;


const MAX_REQUESTED_POST_OPEN_ATTEMPTS =
    10;


/*==================================================
URL 자료 자동 열기 재시도
==================================================*/

function tryOpenRequestedPostFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const requestedPostId =
        cleanText(
            params.get(
                "post"
            )
        );


    if (!requestedPostId) {

        return;

    }


    const foundPost =
        loadedPosts.find(

            post =>
                post.id ===
                requestedPostId

        );


    if (foundPost) {

        openRequestedPostFromUrl();


        return;

    }


    requestedPostOpenAttempts +=
        1;


    if (
        requestedPostOpenAttempts >=
        MAX_REQUESTED_POST_OPEN_ATTEMPTS
    ) {

        showToast(
            "공유된 자료를 찾지 못했습니다."
        );


        return;

    }


    setTimeout(

        tryOpenRequestedPostFromUrl,

        250

    );

}


/*==================================================
페이지 전체 로딩 후 공유 자료 열기
==================================================*/

window.addEventListener(

    "load",

    () => {

        setTimeout(

            tryOpenRequestedPostFromUrl,

            200

        );

    }

);


/*==================================================
YETALK CHATTITLE.JS 끝
==================================================*/
