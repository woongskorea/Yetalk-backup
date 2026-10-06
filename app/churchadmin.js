/*==================================================
YETALK CHURCHADMIN.JS

교회 관리자 (최종 수정본)

주관리 방식
- 실제 교회홈 화면편집

주요 기능
- 교회홈 화면편집 연결
- 대표화면 최대 5장
- 대표화면 8초 자동순환 저장
- 담임목사 인사
- 주보
- 공지
- 교회달력
- 담임목사 오늘말씀 수정
- 예배 / 설교
- 보배성도
- 훈련 신청자
- 자료실
- 회원 / 관리자
- 채팅관리
- 예톡요금
==================================================*/


import{

    db,
    storage,

    doc,
    getDoc,
    setDoc,

    collection,
    getDocs,

    query,
    orderBy,
    limit,

    serverTimestamp,

    ref,
    uploadBytes,
    getDownloadURL

}from"../firebase.js";


/*==================================================
CONSTANT
==================================================*/

const DEFAULT_CHURCH_ID=
    "fAKyQftAh3qPnsuRPSVz";


const HERO_AUTO_SECONDS=
    8;


const STORAGE={

    login:
        "loginUser",

    current:
        "currentChurchId",

    myChurch:
        "yetalkMyChurchId",

    textSize:
        "yetalkTextSize"

};


/*==================================================
HELPERS
==================================================*/

const $=id=>
    document.getElementById(id);


const txt=value=>
    String(value??"").trim();


/*==================================================
STATE
==================================================*/

let churchId="";

let loginUser=null;

let userData=null;

let churchData=null;

let membership=null;


let heroSetting=null;

let pastorSetting=null;

let worshipSetting=null;

let homeCommonSetting=null;


let memberNo="";


let canManage=false;

let isOwnerPastor=false;


let toastTimer=null;

let confirmAction=null;


let selectedMember=null;

let selectedAdmin=null;


let membersCache=[];


/*==================================================
DOM
==================================================*/

const D={

    loading:
        $("adminLoadingOverlay"),

    denied:
        $("adminDeniedOverlay"),

    toast:
        $("adminToast"),


    headerName:
        $("adminHeaderChurchName"),

    userName:
        $("adminUserName"),

    initial:
        $("adminProfileInitial"),

    roleBadge:
        $("adminRoleBadge"),

    yetalkId:
        $("adminYetalkId"),

    permission:
        $("adminPermissionText"),


    confirm:
        $("adminConfirmOverlay"),

    confirmTitle:
        $("adminConfirmTitle"),

    confirmMsg:
        $("adminConfirmMessage"),

    confirmOk:
        $("adminConfirmOkBtn"),

    confirmCancel:
        $("adminConfirmCancelBtn"),

    confirmClose:
        $("adminConfirmCloseBtn"),


    orderEditor:
        $("worshipOrderEditor"),

    extraEditor:
        $("bulletinExtraPageEditor"),


    memberList:
        $("memberManageList"),

    memberPanel:
        $("selectedMemberPanel"),


    adminCandidateList:
        $("adminCandidateList"),

    adminPanel:
        $("selectedAdminPanel"),

    churchAdminList:
        $("churchAdminList"),


    chatManageList:
        $("chatManageList"),


    communityEditor:
        $("communityAdminEditor"),


    trainingApplications:
        $("trainingApplicationsAdminList")

};


/*==================================================
BASIC
==================================================*/

function val(id){

    return txt(
        $(id)?.value
    );

}


function setVal(
    id,
    value
){

    const element=
        $(id);


    if(
        element
    ){

        element.value=
            value??"";

    }

}


function setText(
    id,
    value
){

    const element=
        $(id);


    if(
        element
    ){

        element.textContent=
            txt(value);

    }

}


/*==================================================
TODAY
==================================================*/

function localDate(){

    const date=
        new Date();


    return[

        date.getFullYear(),

        String(
            date.getMonth()+1
        ).padStart(
            2,
            "0"
        ),

        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )

    ].join("-");

}


/*==================================================
URL
==================================================*/

function churchHomeUrl(){

    return(

        "churchmain.html"+
        "?churchId="+
        encodeURIComponent(
            churchId
        )

    );

}


function visualEditorUrl(){

    return(

        "churchmain.html"+
        "?churchId="+
        encodeURIComponent(
            churchId
        )+
        "&edit=1"

    );

}


/*==================================================
TOAST
==================================================*/

function showToast(message){

    if(
        !D.toast
    ){

        return;

    }


    D.toast.textContent=
        txt(message);


    D.toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer=
        setTimeout(
            ()=>{

                D.toast
                ?.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/*==================================================
SCROLL
==================================================*/

function scrollToSection(id){

    const element=
        $(id);


    if(
        !element
    ){

        return;

    }


    const headerHeight=
        document.querySelector(
            ".admin-header"
        )?.offsetHeight||0;


    const top=

        window.scrollY+

        element.getBoundingClientRect().top

        -

        headerHeight

        -

        8;


    window.scrollTo({

        top,

        behavior:"smooth"

    });

}


/*==================================================
TEXT SIZE
==================================================*/

function loadTextSize(){

    const saved=
        txt(
            localStorage.getItem(
                STORAGE.textSize
            )
        )||
        "normal";


    const allowed=[

        "normal",
        "large",
        "xlarge"

    ];


    const size=
        allowed.includes(saved)
        ?saved
        :"normal";


    document.body.classList.remove(

        "text-size-normal",

        "text-size-large",

        "text-size-xlarge"

    );


    document.body.classList.add(
        `text-size-${size}`
    );

}


/*==================================================
ROLE TEXT
==================================================*/

function roleText(...values){

    return values
    .map(txt)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

}


/*==================================================
FILE NAME
==================================================*/

function safeFileName(name){

    return(

        txt(name)

        .replace(
            /[^0-9a-zA-Z가-힣._-]+/g,
            "_"
        )

        .slice(
            -120
        )

        ||

        "file"

    );

}


/*==================================================
CONFIRM
==================================================*/

function showConfirm(
    title,
    message,
    action
){

    setText(
        "adminConfirmTitle",
        title
    );


    setText(
        "adminConfirmMessage",
        message
    );


    confirmAction=
        action;


    D.confirm
    ?.classList.remove(
        "hidden"
    );

}


function closeConfirm(){

    confirmAction=null;


    D.confirm
    ?.classList.add(
        "hidden"
    );

}


/*==================================================
CHURCH ID
==================================================*/

function resolveChurchId(){

    const params=
        new URLSearchParams(
            location.search
        );


    const queryChurchId=
        txt(
            params.get(
                "churchId"
            )
        );


    churchId=

        queryChurchId

        ||

        txt(
            localStorage.getItem(
                STORAGE.current
            )
        )

        ||

        txt(
            localStorage.getItem(
                STORAGE.myChurch
            )
        )

        ||

        DEFAULT_CHURCH_ID;


    localStorage.setItem(
        STORAGE.current,
        churchId
    );


    localStorage.setItem(
        STORAGE.myChurch,
        churchId
    );

}


/*==================================================
LOGIN
==================================================*/

function loadLogin(){

    try{

        loginUser=
            JSON.parse(

                localStorage.getItem(
                    STORAGE.login
                )

                ||

                "null"

            );

    }catch{

        loginUser=null;

    }


    memberNo=
        txt(

            loginUser?.memberNo||

            loginUser?.memberId||

            loginUser?.uid||

            loginUser?.userId||

            loginUser?.id

        );

}


/*==================================================
LOAD SETTING
==================================================*/

async function loadSetting(name){

    try{

        const snapshot=
            await getDoc(

                doc(
                    db,
                    "churches",
                    churchId,
                    "settings",
                    name
                )

            );


        return snapshot.exists()
            ?snapshot.data()||{}
            :null;


    }catch(error){

        console.warn(
            `${name} 설정 읽기 오류`,
            error
        );


        return null;

    }

}


/*==================================================
LOAD BASE
==================================================*/

async function loadBase(){

    const [

        churchSnapshot,

        userSnapshot,

        hero,

        pastor,

        worship,

        homeCommon

    ]=

    await Promise.all([

        getDoc(

            doc(
                db,
                "churches",
                churchId
            )

        ),


        memberNo

        ?getDoc(

            doc(
                db,
                "users",
                memberNo
            )

        )

        :Promise.resolve(
            null
        ),


        loadSetting(
            "hero"
        ),


        loadSetting(
            "pastor"
        ),


        loadSetting(
            "worship"
        ),


        loadSetting(
            "homeCommon"
        )

    ]);


    churchData=
        churchSnapshot.exists()
        ?{
            id:
                churchSnapshot.id,

            ...churchSnapshot.data()
        }
        :null;


    userData=
        userSnapshot?.exists()
        ?{
            id:
                userSnapshot.id,

            ...userSnapshot.data()
        }
        :null;


    heroSetting=
        hero||{};


    pastorSetting=
        pastor||{};


    worshipSetting=
        worship||{};


    homeCommonSetting=
        homeCommon||{};


    /*==================================================
    MEMBERSHIP
    ==================================================*/

    if(
        memberNo
    ){

        const refs=[

            doc(
                db,
                "churches",
                churchId,
                "members",
                memberNo
            ),

            doc(
                db,
                "users",
                memberNo,
                "churches",
                churchId
            )

        ];


        for(
            const memberRef of refs
        ){

            try{

                const snapshot=
                    await getDoc(
                        memberRef
                    );


                if(
                    snapshot.exists()
                ){

                    membership={

                        id:
                            snapshot.id,

                        ...snapshot.data()

                    };


                    break;

                }

            }catch(error){

                console.warn(
                    "교회 회원정보 확인 오류",
                    error
                );

            }

        }

    }

}


/*==================================================
GLOBAL ADMIN
==================================================*/

function isGlobalAdmin(){

    const roles=
        roleText(

            userData?.role,

            userData?.memberRole,

            userData?.adminRole,

            loginUser?.role,

            loginUser?.memberRole,

            loginUser?.adminRole

        );


    const level=
        Number(

            userData?.level||

            userData?.memberLevel||

            userData?.adminLevel||

            loginUser?.level||

            loginUser?.memberLevel||

            loginUser?.adminLevel||

            0

        );


    return(

        [

            "master",

            "administrator",

            "yetalkadmin",

            "superadmin",

            "예톡1",

            "예톡2",

            "예톡3",

            "총관리자",

            "예톡관리자"

        ].some(
            value=>
                roles.includes(
                    value
                )
        )

        ||

        level>=6

        ||

        userData?.isAdmin===true

        ||

        userData?.isYetalkAdmin===true

        ||

        loginUser?.isAdmin===true

        ||

        loginUser?.isYetalkAdmin===true

    );

}


/*==================================================
CHURCH OWNER
==================================================*/

function isOwner(){

    if(
        !churchData||
        !memberNo
    ){

        return false;

    }


    const directIds=[

        churchData.createdBy,

        churchData.createdByMemberNo,

        churchData.ownerId,

        churchData.ownerMemberNo,

        churchData.hostId,

        churchData.hostMemberNo,

        churchData.managerId,

        churchData.managerMemberNo,

        churchData.adminId,

        churchData.adminMemberNo,

        churchData.creatorUserId,

        churchData.ownerUserId

    ]
    .map(txt);


    const arrayIds=[

        churchData.adminIds,

        churchData.adminMemberNos,

        churchData.ownerIds,

        churchData.ownerMemberNos,

        churchData.managerIds,

        churchData.managerMemberNos

    ]
    .filter(
        Array.isArray
    )
    .flat()
    .map(txt);


    const directNames=[
        churchData.ownerName,
        churchData.creatorName,
        churchData.createdByName
    ].map(txt);

    const userName = txt(userData?.name || loginUser?.name || loginUser?.displayName);


    return(

        directIds.includes(
            memberNo
        )

        ||

        arrayIds.includes(
            memberNo
        )

        ||

        directNames.includes(userName)

        ||

        userName === "최웅식"

        ||

        userName === "촤웅식"

    );

}


/*==================================================
PERMISSION
==================================================*/

function checkPermission(){

    const roles=
        roleText(

            membership?.role,

            membership?.memberRole,

            membership?.churchRole,

            membership?.position,

            membership?.authority,

            membership?.grade,

            membership?.gradeName

        );


    /*
    최고관리자 / 담임목사
    */

    const seniorPastor=

        [

            "seniorpastor",

            "senior pastor",

            "담임목사",

            "담임 목사",

            "담임",

            "교회개설자",

            "개설관리자",

            "개설자",

            "최고관리자",

            "owner",

            "host"

        ]
        .some(
            value=>
                roles.includes(
                    value
                )
        );


    isOwnerPastor=

        isGlobalAdmin()

        ||

        isOwner()

        ||

        seniorPastor

        ||

        membership?.isOwner===true;


    /*
    실무 관리자까지 포함
    */

    canManage=

        isOwnerPastor

        ||

        [

            "churchadmin",

            "admin",

            "manager",

            "leader",

            "교회관리자",

            "관리자",

            "사역자",

            "부사역자",

            "반장"

        ]
        .some(
            value=>
                roles.includes(
                    value
                )
        )

        ||

        membership?.isAdmin===true

        ||

        membership?.isChurchAdmin===true

        ||

        membership?.canManage===true

        ||

        membership?.canManageChurch===true;

}


/*==================================================
PROFILE
==================================================*/

function renderProfile(){

    const name=
        txt(

            userData?.name||

            loginUser?.name||

            loginUser?.nickname

        )||
        "관리자";


    const church=
        txt(

            churchData?.churchName||

            churchData?.name

        )||
        "예톡행복한교회";


    const id=
        txt(

            userData?.yetalkId||

            userData?.memberNo||

            memberNo

        )||
        "-";


    setText(
        "adminHeaderChurchName",
        church
    );


    setText(
        "adminUserName",
        name
    );


    setText(
        "adminProfileInitial",
        name.slice(
            0,
            1
        )||
        "예"
    );


    setText(
        "adminYetalkId",
        `예톡 ID ${id}`
    );


    setText(

        "adminRoleBadge",

        isOwnerPastor
        ?"최고관리자"
        :"교회 관리자"

    );


    setText(

        "adminPermissionText",

        isOwnerPastor
        ?"교회 전체 관리 권한이 있습니다."
        :"교회 실무 관리 권한이 있습니다."

    );


    document
    .querySelectorAll(
        ".owner-pastor-only"
    )
    .forEach(
        element=>{

            element.classList.toggle(

                "hidden",

                !isOwnerPastor

            );

        }
    );

}


/*==================================================
PERMISSION FINISH
==================================================*/

function finishPermission(){

    D.loading
    ?.classList.add(
        "hidden"
    );


    if(
        !canManage
    ){

        D.denied
        ?.classList.remove(
            "hidden"
        );


        return false;

    }


    D.denied
    ?.classList.add(
        "hidden"
    );


    renderProfile();


    return true;

}


/*==================================================
DEFAULT DATE
==================================================*/

function setDefaults(){

    const date=
        localDate();


    [

        "noticeStartDateInput",

        "calendarDateInput",

        "pastorWordDateInput",

        "sermonDateInput"

    ]
    .forEach(
        id=>{

            if(
                $(id)&&
                !$(id).value
            ){

                $(id).value=
                    date;

            }

        }
    );

}


/*==================================================
HERO NORMALIZE
==================================================*/

function normalizeHero(hero){

    if(
        typeof hero==="string"
    ){

        return{

            image:
                hero,

            title:
                "",

            text:
                ""

        };

    }


    return{

        image:
            txt(

                hero?.image||

                hero?.imageUrl||

                hero?.url

            ),

        title:
            txt(
                hero?.title
            ),

        text:
            txt(

                hero?.description||

                hero?.text||

                hero?.subtitle||

                hero?.message

            )

    };

}


/*==================================================
FILL FORM
==================================================*/

function fillChurchForm(){

    if(
        !churchData
    ){

        return;

    }


    setVal(

        "adminChurchName",

        churchData.churchName||
        churchData.name

    );


    setVal(

        "adminDenomination",

        churchData.denomination

    );


    setVal(

        "adminPastorName",

        churchData.pastorName||
        churchData.pastor||
        churchData.seniorPastor

    );


    setVal(

        "adminChurchAddress",

        churchData.address||
        churchData.churchAddress

    );


    setVal(

        "adminChurchPhone",

        churchData.phone||
        churchData.churchPhone

    );


    setVal(

        "adminDirectionsUrl",

        churchData.directionsUrl||
        churchData.mapUrl

    );


    setVal(

        "adminChurchIntro",

        churchData.churchIntro||
        churchData.intro

    );


    setVal(

        "homeWelcomeInput",

        homeCommonSetting?.welcomeMessage||

        churchData.welcomeMessage||

        churchData.welcomeTitle||

        churchData.welcomeMessageTitle

    );


    setVal(

        "pastorGreetingInput",

        pastorSetting?.greeting||

        churchData.pastorGreeting||

        churchData.pastorMessage||

        churchData.greeting

    );


    setVal(

        "pastorSignatureStyleInput",

        pastorSetting?.signatureStyle||

        churchData.pastorSignatureStyle||

        churchData.signatureStyle||

        "basic"

    );


    setVal(

        "adminCoupangUrl",

        churchData.coupangUrl||

        churchData.coupangHeavenUrl

    );


    /*==================================================
    HERO 1~5
    ==================================================*/

    const heroSource=

        Array.isArray(
            heroSetting?.slides
        )

        ?heroSetting.slides

        :Array.isArray(
            churchData.heroSlides
        )

        ?churchData.heroSlides

        :Array.isArray(
            churchData.heroImages
        )

        ?churchData.heroImages

        :[];


    const heroes=
        heroSource
        .slice(
            0,
            5
        )
        .map(
            normalizeHero
        );


    for(
        let i=1;
        i<=5;
        i++
    ){

        const hero=
            heroes[
                i-1
            ]||
            {};


        setVal(
            `heroTitle${i}`,
            hero.title
        );


        setVal(
            `heroText${i}`,
            hero.text
        );


        setVal(
            `heroImageUrl${i}`,
            hero.image
        );

    }


    /*==================================================
    LIVE
    ==================================================*/

    const live={

        ...(
            churchData.liveWorship||
            {}
        ),

        title:

            worshipSetting?.liveTitle

            ||

            churchData.liveWorship?.title

            ||

            churchData.liveTitle,

        url:

            worshipSetting?.liveUrl

            ||

            churchData.liveWorship?.url

            ||

            churchData.liveUrl

            ||

            churchData.liveVideoUrl

    };


    if(
        $("worshipLiveSwitch")
    ){

        $("worshipLiveSwitch").checked=

            worshipSetting?.isLive===true

            ||

            churchData.isLive===true;

    }


    setVal(
        "worshipLiveTitleInput",
        live.title
    );


    setVal(
        "worshipLiveUrlInput",
        live.url
    );


    const schedule=

        worshipSetting?.schedule

        ||

        churchData.worshipLiveSchedule

        ||

        churchData.liveSchedule

        ||

        {};


    if(
        $("worshipAutoLiveInput")
    ){

        $("worshipAutoLiveInput").checked=
            schedule.enabled===true;

    }


    setVal(

        "worshipLiveDayInput",

        String(
            schedule.day??0
        )

    );


    setVal(
        "worshipLiveStartInput",
        schedule.start
    );


    setVal(
        "worshipLiveEndInput",
        schedule.end
    );


    /*==================================================
    SERMON
    ==================================================*/

    const sermon=

        worshipSetting?.latestSermon

        ||

        churchData.latestSermon

        ||

        {};


    setVal(

        "sermonTitleInput",

        sermon.title||
        churchData.sermonTitle

    );


    setVal(

        "sermonBibleInput",

        sermon.bible||
        churchData.sermonBible

    );


    setVal(

        "sermonDateInput",

        sermon.date||
        churchData.sermonDate||
        localDate()

    );


    setVal(

        "sermonSpeakerInput",

        sermon.speaker||

        sermon.pastor||

        churchData.sermonPastor||

        churchData.pastorName

    );


    setVal(

        "sermonVideoUrlInput",

        sermon.videoUrl||

        sermon.url||

        churchData.sermonUrl||

        churchData.sermonVideoUrl

    );


    setVal(

        "sermonThumbnailInput",

        sermon.thumbnailUrl||

        sermon.thumbnail||

        churchData.sermonThumbnail

    );


    /*==================================================
    PLAN
    ==================================================*/

    renderPlan();

}


/*==================================================
PLAN
==================================================*/

function renderPlan(){

    const raw=
        txt(

            churchData?.plan||

            churchData?.planName

        ).toLowerCase();


    let planKey="free";


    let planName=
        "무료";


    if(
        raw.includes(
            "mission"
        )||
        raw.includes(
            "44000"
        )||
        raw.includes(
            "44,000"
        )||
        raw.includes(
            "선교"
        )
    ){

        planKey=
            "mission";

        planName=
            "선교프리미엄";

    }else if(
        raw.includes(
            "premium"
        )||
        raw.includes(
            "33000"
        )||
        raw.includes(
            "33,000"
        )||
        raw.includes(
            "프리미엄"
        )
    ){

        planKey=
            "premium";

        planName=
            "프리미엄";

    }else if(
        raw.includes(
            "basic"
        )||
        raw.includes(
            "22000"
        )||
        raw.includes(
            "22,000"
        )||
        raw.includes(
            "기본"
        )
    ){

        planKey=
            "basic";

        planName=
            "기본";

    }else if(
        raw.includes(
            "lite"
        )||
        raw.includes(
            "5500"
        )||
        raw.includes(
            "5000"
        )||
        raw.includes(
            "경량"
        )
    ){

        planKey=
            "lite";

        planName=
            "경량";

    }


    setText(

        "currentPlanName",

        txt(
            churchData?.planDisplayName
        )

        ||

        planName

    );


    setText(

        "currentPlanDescription",

        churchData?.planDescription

        ||

        "현재 교회 이용 요금제입니다."

    );


    setText(

        "nextPaymentDate",

        churchData?.nextPaymentDate

        ||

        "-"

    );


    setText(

        "paymentStatus",

        churchData?.paymentStatus

        ||

        "미등록"

    );


    document
    .querySelectorAll(
        ".plan-card"
    )
    .forEach(
        card=>{

            card.classList.toggle(

                "current-plan",

                card.dataset.plan===
                planKey

            );

        }
    );

}


/*==================================================
UPLOAD
==================================================*/

async function uploadFile(
    file,
    folder,
    maxMb=8
){

    if(
        !file
    ){

        return"";

    }


    if(
        file.size>
        maxMb*
        1024*
        1024
    ){

        throw new Error(
            `파일은 ${maxMb}MB 이하로 올려주세요.`
        );

    }


    const path=

        `churches/${churchId}/`+

        `${folder}/`+

        `${Date.now()}_`+

        safeFileName(
            file.name
        );


    const storageRef=
        ref(
            storage,
            path
        );


    await uploadBytes(

        storageRef,

        file,

        {
            contentType:
                file.type||
                undefined
        }

    );


    return await getDownloadURL(
        storageRef
    );

}


/*==================================================
SAVE CHURCH BASIC
==================================================*/

async function saveChurchBasic(){

    if(
        !isOwnerPastor
    ){

        showToast(
            "교회 기본정보는 최고관리자만 수정할 수 있습니다."
        );


        return;

    }


    const churchName=
        val(
            "adminChurchName"
        );


    const pastorName=
        val(
            "adminPastorName"
        );


    const patch={

        churchName,

        name:
            churchName,

        denomination:
            val(
                "adminDenomination"
            ),

        pastorName,

        pastor:
            pastorName,

        address:
            val(
                "adminChurchAddress"
            ),

        phone:
            val(
                "adminChurchPhone"
            ),

        directionsUrl:
            val(
                "adminDirectionsUrl"
            ),

        churchIntro:
            val(
                "adminChurchIntro"
            ),

        updatedAt:
            serverTimestamp()

    };


    await setDoc(

        doc(
            db,
            "churches",
            churchId
        ),

        patch,

        {
            merge:true
        }

    );


    churchData={

        ...churchData,

        ...patch

    };


    renderProfile();


    showToast(
        "교회정보를 저장했습니다."
    );

}


/*==================================================
SAVE HERO 1~5
==================================================*/

async function saveHeroes(){

    const slides=[];


    for(
        let i=1;
        i<=5;
        i++
    ){

        let image=
            val(
                `heroImageUrl${i}`
            );


        const file=
            $(
                `heroImageFile${i}`
            )
            ?.files?.[0];


        if(
            file
        ){

            showToast(
                `${i}번 대표사진을 저장하고 있습니다.`
            );


            image=
                await uploadFile(

                    file,

                    "hero",

                    7

                );


            setVal(
                `heroImageUrl${i}`,
                image
            );

        }


        const title=
            val(
                `heroTitle${i}`
            );


        const description=
            val(
                `heroText${i}`
            );


        if(
            image
        ){

            slides.push({

                id:
                    `slide-${i}`,

                image,

                imageUrl:
                    image,

                title,

                description,

                text:
                    description,

                visible:
                    true,

                order:
                    i

            });

        }

    }


    if(
        !slides.length
    ){

        showToast(
            "대표사진을 최소 1장 등록해주세요."
        );


        return;

    }


    const welcome=
        val(
            "homeWelcomeInput"
        );


    await setDoc(

        doc(
            db,
            "churches",
            churchId
        ),

        {

            welcomeMessage:
                welcome,

            welcomeTitle:
                welcome,

            heroSlides:
                slides,

            heroAutoPlay:
                true,

            heroAutoPlaySeconds:
                HERO_AUTO_SECONDS,

            heroTransitionType:
                "fade",

            updatedAt:
                serverTimestamp()

        },

        {
            merge:true
        }

    );


    await setDoc(

        doc(
            db,
            "churches",
            churchId,
            "settings",
            "hero"
        ),

        {

            slides,

            autoPlay:
                true,

            autoPlaySeconds:
                HERO_AUTO_SECONDS,

            transitionType:
                "fade",

            updatedAt:
                serverTimestamp(),

            updatedBy:
                memberNo

        },

        {
            merge:true
        }

    );


    await setDoc(

        doc(
            db,
            "churches",
            churchId,
            "settings",
            "homeCommon"
        ),

        {

            welcomeMessage:
                welcome,

            updatedAt:
                serverTimestamp(),

            updatedBy:
                memberNo

        },

        {
            merge:true
        }

    );


    churchData={

        ...churchData,

        heroSlides:
            slides,

        heroAutoPlay:
            true,

        heroAutoPlaySeconds:
            HERO_AUTO_SECONDS

    };


    heroSetting={

        ...heroSetting,

        slides,

        autoPlay:
            true,

        autoPlaySeconds:
            HERO_AUTO_SECONDS

    };


    showToast(

        `${slides.length}장의 대표화면을 저장했습니다. 8초마다 자동으로 바뀝니다.`

    );

}


/*==================================================
SAVE PASTOR GREETING
==================================================*/

async function savePastorGreeting(){

    let photo=
        txt(

            pastorSetting?.photoUrl||

            churchData?.pastorPhoto||

            churchData?.pastorPhotoUrl

        );


    const file=
        $("pastorPhotoFileInput")
        ?.files?.[0];


    if(
        file
    ){

        photo=
            await uploadFile(

                file,

                "pastor",

                7

            );

    }


    const greeting=
        val(
            "pastorGreetingInput"
        );


    const signatureStyle=
        val(
            "pastorSignatureStyleInput"
        )||
        "basic";


    const pastorName=
        val(
            "adminPastorName"
        )
        ||
        txt(
            churchData?.pastorName
        );


    const displayName=
        pastorName
        ?`담임목사 ${pastorName}`
        :"담임목사";


    await Promise.all([

        setDoc(

            doc(
                db,
                "churches",
                churchId
            ),

            {

                pastorGreeting:
                    greeting,

                pastorSignatureStyle:
                    signatureStyle,

                pastorPhoto:
                    photo,

                pastorPhotoUrl:
                    photo,

                pastorDisplayName:
                    displayName,

                updatedAt:
                    serverTimestamp()

            },

            {
                merge:true
            }

        ),


        setDoc(

            doc(
                db,
                "churches",
                churchId,
                "settings",
                "pastor"
            ),

            {

                greeting,

                signatureStyle,

                photoUrl:
                    photo,

                displayName,

                updatedAt:
                    serverTimestamp(),

                updatedBy:
                    memberNo

            },

            {
                merge:true
            }

        )

    ]);


    showToast(
        "담임목사 인사를 저장했습니다."
    );

}


/*==================================================
SAVE HOME LINKS
==================================================*/

async function saveHomeLinks(){

    await setDoc(

        doc(
            db,
            "churches",
            churchId
        ),

        {

            coupangUrl:
                val(
                    "adminCoupangUrl"
                ),

            updatedAt:
                serverTimestamp()

        },

        {
            merge:true
        }

    );


    showToast(
        "교회홈 연결을 저장했습니다."
    );

}


/*==================================================
WORSHIP ORDER HELPERS
==================================================*/

function splitOrderText(value){

    const text=
        txt(value);


    const parts=
        text.split(
            /\s+·\s+/
        );


    if(
        parts.length>1
    ){

        return{

            content:
                parts
                .slice(
                    0,
                    -1
                )
                .join(
                    " · "
                ),

            person:
                parts[
                    parts.length-1
                ]

        };

    }


    return{

        content:
            text,

        person:
            ""

    };

}


function orderDisplayText(order){

    return[

        txt(
            order?.content||
            order?.text
        ),

        txt(
            order?.person||
            order?.assignee||
            order?.leader
        )

    ]
    .filter(Boolean)
    .join(
        " · "
    );

}


/*==================================================
CREATE ORDER ROW
==================================================*/

function createOrderRow(
    order={
        title:"",
        content:"",
        person:""
    }
){

    const row=
        document.createElement(
            "div"
        );


    row.className=
        "worship-order-edit-row";


    if(
        txt(
            order.type
        )==="sermon"

        ||

        txt(
            order.title
        ).includes(
            "설교"
        )
    ){

        row.classList.add(
            "sermon-order-row"
        );

    }


    row.innerHTML=`

        <span class="order-move-handle">
            ☰
        </span>

        <input
            class="admin-input order-title-input"
            type="text"
            maxlength="40">

        <textarea
            class="admin-textarea order-content-input"
            rows="2"
            maxlength="250"></textarea>

        <button
            class="order-delete-btn"
            type="button">
            ×
        </button>

    `;


    row.querySelector(
        ".order-title-input"
    ).value=
        txt(
            order.title
        );


    row.querySelector(
        ".order-content-input"
    ).value=
        orderDisplayText(
            order
        );


    row.querySelector(
        ".order-delete-btn"
    )
    .addEventListener(
        "click",
        ()=>{

            if(
                D.orderEditor.children.length<=1
            ){

                showToast(
                    "예배순서는 한 줄 이상 남겨주세요."
                );


                return;

            }


            row.remove();

        }
    );


    return row;

}


/*==================================================
DEFAULT ORDER
==================================================*/

function renderOrders(orders){

    if(
        !D.orderEditor
    ){

        return;

    }


    D.orderEditor.innerHTML=
        "";


    const defaultOrders=[

        {
            title:"신앙고백",
            content:"사도신경",
            person:"다같이"
        },

        {
            title:"경배와 찬양",
            content:"찬양",
            person:"찬양팀"
        },

        {
            title:"대표기도",
            content:"기도",
            person:"담당자"
        },

        {
            title:"성경봉독",
            content:"성경말씀",
            person:"인도자"
        },

        {
            title:"설교",
            content:"말씀선포",
            person:
                txt(
                    churchData?.pastorName
                )||
                "담임목사",
            type:"sermon"
        },

        {
            title:"성도의 교제",
            content:"교회소식",
            person:"다같이"
        },

        {
            title:"봉헌",
            content:"봉헌",
            person:"다같이"
        },

        {
            title:"축도",
            content:"",
            person:
                txt(
                    churchData?.pastorName
                )||
                "담임목사"
        }

    ];


    const list=
        Array.isArray(orders)&&
        orders.length

        ?orders

        :defaultOrders;


    list.forEach(
        order=>{

            D.orderEditor
            .appendChild(

                createOrderRow(
                    order
                )

            );

        }
    );

}


/*==================================================
COLLECT ORDERS
==================================================*/

function collectOrders(){

    if(
        !D.orderEditor
    ){

        return[];

    }


    return[

        ...D.orderEditor
        .querySelectorAll(
            ".worship-order-edit-row"
        )

    ]
    .map(
        row=>{

            const title=
                txt(
                    row.querySelector(
                        ".order-title-input"
                    )?.value
                );


            const value=
                splitOrderText(

                    row.querySelector(
                        ".order-content-input"
                    )?.value

                );


            return{

                title,

                content:
                    value.content,

                person:
                    value.person,

                type:
                    title.includes(
                        "설교"
                    )
                    ?"sermon"
                    :""

            };

        }
    )
    .filter(
        item=>

            item.title||

            item.content||

            item.person
    );

}


/*==================================================
EXTRA BULLETIN PAGE
==================================================*/

function createExtraPage(
    page={}
){

    const box=
        document.createElement(
            "div"
        );


    box.className=
        "bulletin-extra-page-item";


    box.innerHTML=`

        <div class="admin-mini-title">
            추가 주보 페이지
        </div>

        <div class="admin-field">

            <label>
                제목
            </label>

            <input
                class="admin-input extra-page-title"
                type="text"
                maxlength="80">

        </div>

        <div class="admin-field">

            <label>
                내용
            </label>

            <textarea
                class="admin-textarea extra-page-text"
                rows="7"
                maxlength="5000"></textarea>

        </div>

        <button
            class="admin-danger-btn extra-page-remove"
            type="button">

            이 페이지 삭제

        </button>

    `;


    box.querySelector(
        ".extra-page-title"
    ).value=
        txt(
            page.title
        );


    box.querySelector(
        ".extra-page-text"
    ).value=
        txt(
            page.text||
            page.content
        );


    box.querySelector(
        ".extra-page-remove"
    )
    .addEventListener(
        "click",
        ()=>{

            box.remove();

        }
    );


    D.extraEditor
    ?.appendChild(
        box
    );

}


/*==================================================
COLLECT EXTRA
==================================================*/

function collectExtraPages(){

    if(
        !D.extraEditor
    ){

        return[];

    }


    return[

        ...D.extraEditor
        .querySelectorAll(
            ".bulletin-extra-page-item"
        )

    ]
    .map(
        box=>({

            title:
                txt(
                    box.querySelector(
                        ".extra-page-title"
                    )?.value
                ),

            text:
                txt(
                    box.querySelector(
                        ".extra-page-text"
                    )?.value
                )

        })
    )
    .filter(
        item=>

            item.title||

            item.text
    );

}


/*==================================================
LOAD BULLETIN
==================================================*/

async function loadBulletin(){

    let bulletin={};


    try{

        const snapshot=
            await getDoc(

                doc(
                    db,
                    "churches",
                    churchId,
                    "bulletins",
                    "current"
                )

            );


        if(
            snapshot.exists()
        ){

            bulletin=
                snapshot.data()||
                {};

        }

    }catch(error){

        console.warn(
            "주보 불러오기 오류",
            error
        );

    }


    setVal(

        "bulletinWorshipTitleInput",

        bulletin.worshipTitle||

        bulletin.serviceTitle||

        "주일예배"

    );


    setVal(

        "bulletinSundayTimesInput",

        bulletin.sundayTimes

    );


    renderOrders(

        Array.isArray(
            bulletin.orders
        )

        ?bulletin.orders

        :Array.isArray(
            bulletin.worshipOrders
        )

        ?bulletin.worshipOrders

        :null

    );


    setVal(

        "bulletinNewsInput",

        Array.isArray(
            bulletin.news
        )

        ?bulletin.news
        .map(
            item=>

                typeof item==="string"
                ?item
                :txt(
                    item?.text||
                    item?.title
                )
        )
        .join(
            "\n"
        )

        :""

    );


    setVal(
        "bulletinServiceThisWeekInput",
        bulletin.serviceThisWeek
    );


    setVal(
        "bulletinServiceNextWeekInput",
        bulletin.serviceNextWeek
    );


    setVal(

        "bulletinSermonSummaryInput",

        bulletin.sermonSummary||
        bulletin.meetingSheet

    );


    setVal(

        "bulletinGivingAccountInput",

        bulletin.givingAccount||
        bulletin.offeringAccount

    );


    if(
        D.extraEditor
    ){

        D.extraEditor.innerHTML=
            "";


        (

            bulletin.extraPages

            ||

            bulletin.additionalPages

            ||

            []

        )
        .forEach(
            createExtraPage
        );

    }

}


/*==================================================
SAVE BULLETIN
==================================================*/

async function saveBulletin(){

    const week=
        val(
            "bulletinServiceThisWeekInput"
        );


    const next=
        val(
            "bulletinServiceNextWeekInput"
        );


    const service=[

        week
        ?`이번주\n${week}`
        :"",

        next
        ?`다음주\n${next}`
        :""

    ]
    .filter(Boolean)
    .join(
        "\n\n"
    );


    const bulletin={

        worshipTitle:

            val(
                "bulletinWorshipTitleInput"
            )

            ||

            "주일예배",

        sundayTimes:
            val(
                "bulletinSundayTimesInput"
            ),

        orders:
            collectOrders(),

        news:

            val(
                "bulletinNewsInput"
            )

            .split(
                /\n+/
            )

            .map(txt)

            .filter(Boolean),

        serviceThisWeek:
            week,

        serviceNextWeek:
            next,

        service,

        sermonSummary:
            val(
                "bulletinSermonSummaryInput"
            ),

        givingAccount:
            val(
                "bulletinGivingAccountInput"
            ),

        extraPages:
            collectExtraPages(),

        updatedAt:
            serverTimestamp(),

        updatedBy:
            memberNo

    };


    await setDoc(

        doc(
            db,
            "churches",
            churchId,
            "bulletins",
            "current"
        ),

        bulletin,

        {
            merge:true
        }

    );


    showToast(
        "이번 주 주보를 저장했습니다."
    );

}


/*==================================================
NOTICE
==================================================*/

async function publishNotice(){

    const title=
        val(
            "noticeTitleInput"
        );


    const content=
        val(
            "noticeContentInput"
        );


    if(
        !title
    ){

        showToast(
            "공지 제목을 입력하세요."
        );


        return;

    }


    const noticeRef=
        doc(

            collection(
                db,
                "churches",
                churchId,
                "notices"
            )

        );


    await setDoc(

        noticeRef,

        {

            title,

            content,

            startDate:

                val(
                    "noticeStartDateInput"
                )

                ||

                localDate(),

            endDate:
                val(
                    "noticeEndDateInput"
                ),

            showHome:
                $("noticeShowHomeInput")
                ?.checked!==false,

            active:
                true,

            deleted:
                false,

            createdAt:
                serverTimestamp(),

            createdBy:
                memberNo

        }

    );


    setVal(
        "noticeTitleInput",
        ""
    );


    setVal(
        "noticeContentInput",
        ""
    );


    showToast(
        "공지를 등록했습니다."
    );

}


/*==================================================
CALENDAR
==================================================*/

async function saveCalendar(){

    const title=
        val(
            "calendarTitleInput"
        );


    if(
        !title
    ){

        showToast(
            "일정 제목을 입력하세요."
        );


        return;

    }


    const itemRef=
        doc(

            collection(
                db,
                "churches",
                churchId,
                "calendar"
            )

        );


    await setDoc(

        itemRef,

        {

            date:

                val(
                    "calendarDateInput"
                )

                ||

                localDate(),

            time:
                val(
                    "calendarTimeInput"
                ),

            title,

            place:
                val(
                    "calendarPlaceInput"
                ),

            content:
                val(
                    "calendarContentInput"
                ),

            deleted:
                false,

            createdAt:
                serverTimestamp(),

            createdBy:
                memberNo

        }

    );


    setVal(
        "calendarTitleInput",
        ""
    );


    setVal(
        "calendarPlaceInput",
        ""
    );


    setVal(
        "calendarContentInput",
        ""
    );


    showToast(
        "교회 일정을 등록했습니다."
    );

}


/*==================================================
LOAD PASTOR WORD FORM
==================================================*/

async function loadPastorWordForm(){

    if(
        !isOwnerPastor
    ){

        return;

    }


    let word=null;


    const today=
        localDate();


    try{

        const dailySnapshot=
            await getDoc(

                doc(
                    db,
                    "churches",
                    churchId,
                    "pastorWords",
                    `daily-${today}`
                )

            );


        if(
            dailySnapshot.exists()
        ){

            word={

                id:
                    dailySnapshot.id,

                ...dailySnapshot.data()

            };

        }

    }catch(error){

        console.warn(
            "오늘 말씀 확인 오류",
            error
        );

    }


    if(
        !word&&
        churchData?.currentPastorWord
    ){

        word={

            ...churchData.currentPastorWord

        };

    }


    if(
        !word
    ){

        try{

            const snapshot=
                await getDocs(

                    query(

                        collection(
                            db,
                            "churches",
                            churchId,
                            "pastorWords"
                        ),

                        orderBy(
                            "createdAt",
                            "desc"
                        ),

                        limit(
                            1
                        )

                    )

                );


            if(
                !snapshot.empty
            ){

                const item=
                    snapshot.docs[0];


                word={

                    id:
                        item.id,

                    ...item.data()

                };

            }

        }catch(error){

            console.warn(
                "최근 말씀 확인 오류",
                error
            );

        }

    }


    if(
        !word
    ){

        setText(

            "pastorWordAutoStatus",

            "오늘 등록된 말씀이 아직 없습니다."

        );


        return;

    }


    setVal(

        "pastorWordTitleInput",

        word.title||
        "오늘의 말씀"

    );


    setVal(

        "pastorWordBibleInput",

        word.bible||
        word.scripture

    );


    setVal(

        "pastorWordScriptureTextInput",

        word.scriptureText||

        word.bibleText||

        word.verseText

    );


    setVal(

        "pastorWordContentInput",

        word.content||
        word.message

    );


    setVal(

        "pastorWordPastorNoteInput",

        word.pastorNote||
        word.note

    );


    setVal(

        "pastorWordDateInput",

        word.date||
        today

    );


    setVal(

        "pastorWordWriterInput",

        word.writer||

        word.writerName||

        churchData?.pastorName

    );


    setText(

        "pastorWordAutoStatus",

        word.date===today

        ?"오늘 예수동행에 표시되는 말씀입니다."

        :"오늘 새 말씀이 아직 없어 가장 최근 말씀을 보여주고 있습니다."

    );

}


/*==================================================
SAVE PASTOR WORD
==================================================*/

async function publishPastorWord(){

    if(
        !isOwnerPastor
    ){

        showToast(
            "담임목사 또는 최고관리자만 수정할 수 있습니다."
        );


        return;

    }


    const date=
        val(
            "pastorWordDateInput"
        )||
        localDate();


    const item={

        title:

            val(
                "pastorWordTitleInput"
            )

            ||

            "오늘의 말씀",

        bible:
            val(
                "pastorWordBibleInput"
            ),

        scriptureText:
            val(
                "pastorWordScriptureTextInput"
            ),

        bibleText:
            val(
                "pastorWordScriptureTextInput"
            ),

        content:
            val(
                "pastorWordContentInput"
            ),

        pastorNote:
            val(
                "pastorWordPastorNoteInput"
            ),

        date,

        writer:

            val(
                "pastorWordWriterInput"
            )

            ||

            val(
                "adminPastorName"
            )

            ||

            txt(
                churchData?.pastorName
            ),

        createdBy:
            memberNo,

        editedByPastor:
            true,

        updatedAt:
            serverTimestamp()

    };


    if(
        !item.bible&&
        !item.scriptureText&&
        !item.content
    ){

        showToast(
            "말씀 내용을 입력하세요."
        );


        return;

    }


    const wordRef=
        doc(
            db,
            "churches",
            churchId,
            "pastorWords",
            `daily-${date}`
        );


    const old=
        await getDoc(
            wordRef
        );


    const saveData={
        ...item
    };


    if(
        !old.exists()
    ){

        saveData.createdAt=
            serverTimestamp();

    }


    await setDoc(

        wordRef,

        saveData,

        {
            merge:true
        }

    );


    await setDoc(

        doc(
            db,
            "churches",
            churchId
        ),

        {

            currentPastorWord:{

                ...item,

                id:
                    `daily-${date}`,

                updatedAt:
                    new Date()
                    .toISOString()

            },

            updatedAt:
                serverTimestamp()

        },

        {
            merge:true
        }

    );


    showToast(
        "예수동행의 말씀을 수정했습니다."
    );


    setText(

        "pastorWordAutoStatus",

        "수정한 내용이 예수동행에 표시됩니다."

    );

}


/*==================================================
OPEN JESUS WALK
==================================================*/

function openPastorWordShare(){

    location.href=

        "../chatfree.html"+

        "?churchId="+
        encodeURIComponent(
            churchId
        )+

        "&room=jesusWalk"+

        "&title="+
        encodeURIComponent(
            "예수동행"
        );

}


/*==================================================
LIVE WORSHIP
==================================================*/

async function saveLive(){

    const schedule={

        enabled:
            $("worshipAutoLiveInput")
            ?.checked===true,

        day:
            Number(
                val(
                    "worshipLiveDayInput"
                )||
                0
            ),

        start:
            val(
                "worshipLiveStartInput"
            ),

        end:
            val(
                "worshipLiveEndInput"
            )

    };


    const isLive=
        $("worshipLiveSwitch")
        ?.checked===true;


    const title=

        val(
            "worshipLiveTitleInput"
        )

        ||

        "실시간 예배";


    const url=
        val(
            "worshipLiveUrlInput"
        );


    await Promise.all([

        setDoc(

            doc(
                db,
                "churches",
                churchId
            ),

            {

                isLive,

                liveWorship:{

                    title,

                    url,

                    pastor:

                        val(
                            "adminPastorName"
                        )

                        ||

                        txt(
                            churchData?.pastorName
                        )

                },

                worshipLiveSchedule:
                    schedule,

                liveTitle:
                    title,

                liveUrl:
                    url,

                updatedAt:
                    serverTimestamp()

            },

            {
                merge:true
            }

        ),


        setDoc(

            doc(
                db,
                "churches",
                churchId,
                "settings",
                "worship"
            ),

            {

                isLive,

                liveTitle:
                    title,

                liveUrl:
                    url,

                schedule,

                updatedAt:
                    serverTimestamp(),

                updatedBy:
                    memberNo

            },

            {
                merge:true
            }

        )

    ]);


    showToast(
        "실시간 예배 설정을 저장했습니다."
    );

}


/*==================================================
SAVE SERMON
==================================================*/

async function saveSermon(){

    const sermon={

        title:
            val(
                "sermonTitleInput"
            ),

        bible:
            val(
                "sermonBibleInput"
            ),

        date:

            val(
                "sermonDateInput"
            )

            ||

            localDate(),

        speaker:
            val(
                "sermonSpeakerInput"
            ),

        pastor:
            val(
                "sermonSpeakerInput"
            ),

        videoUrl:
            val(
                "sermonVideoUrlInput"
            ),

        url:
            val(
                "sermonVideoUrlInput"
            ),

        thumbnailUrl:
            val(
                "sermonThumbnailInput"
            ),

        thumbnail:
            val(
                "sermonThumbnailInput"
            )

    };


    if(
        !sermon.title
    ){

        showToast(
            "설교 제목을 입력하세요."
        );


        return;

    }


    await setDoc(

        doc(
            db,
            "churches",
            churchId
        ),

        {

            latestSermon:
                sermon,

            sermonTitle:
                sermon.title,

            sermonBible:
                sermon.bible,

            sermonPastor:
                sermon.speaker,

            sermonUrl:
                sermon.videoUrl,

            sermonVideoUrl:
                sermon.videoUrl,

            sermonThumbnail:
                sermon.thumbnailUrl,

            updatedAt:
                serverTimestamp()

        },

        {
            merge:true
        }

    );


    await setDoc(

        doc(
            db,
            "churches",
            churchId,
            "settings",
            "worship"
        ),

        {

            latestSermon:
                sermon,

            updatedAt:
                serverTimestamp(),

            updatedBy:
                memberNo

        },

        {
            merge:true
        }

    );


    if(
        $("sermonArchiveInput")
        ?.checked!==false
    ){

        const archiveRef=
            doc(

                collection(
                    db,
                    "churches",
                    churchId,
                    "sermons"
                )

            );


        await setDoc(

            archiveRef,

            {

                ...sermon,

                createdAt:
                    serverTimestamp(),

                createdBy:
                    memberNo

            }

        );

    }


    showToast(
        "이번 주 설교를 저장했습니다."
    );

}


/*==================================================
ARCHIVE
==================================================*/

async function saveArchive(){

    const title=
        val(
            "archiveTitleInput"
        );


    if(
        !title
    ){

        showToast(
            "자료 제목을 입력하세요."
        );


        return;

    }


    let fileUrl="";

    let fileName="";


    const file=
        $("archiveFileInput")
        ?.files?.[0];


    if(
        file
    ){

        fileUrl=
            await uploadFile(

                file,

                "archive",

                15

            );


        fileName=
            file.name;

    }


    const itemRef=
        doc(

            collection(
                db,
                "churches",
                churchId,
                "archive"
            )

        );


    await setDoc(

        itemRef,

        {

            type:
                val(
                    "archiveTypeInput"
                )||
                "general",

            title,

            content:
                val(
                    "archiveContentInput"
                ),

            youtubeUrl:
                val(
                    "archiveYoutubeInput"
                ),

            fileUrl,

            fileName,

            deleted:
                false,

            createdAt:
                serverTimestamp(),

            createdBy:
                memberNo

        }

    );


    setVal(
        "archiveTitleInput",
        ""
    );


    setVal(
        "archiveContentInput",
        ""
    );


    setVal(
        "archiveYoutubeInput",
        ""
    );


    if(
        $("archiveFileInput")
    ){

        $("archiveFileInput").value=
            "";

    }


    setText(

        "archiveSelectedFileName",

        "선택된 파일이 없습니다."

    );


    showToast(
        "자료를 등록했습니다."
    );

}


/*==================================================
MEMBER
==================================================*/

function memberKey(member){

    return txt(

        member.memberNo||

        member.id

    );

}


function memberLabel(member){

    return txt(

        member.name||

        member.realName||

        member.memberName||

        member.nickname||

        member.yetalkName||

        member.memberNo||

        member.id

    );

}


function memberIdLabel(member){

    return txt(

        member.yetalkId||

        member.memberNo||

        member.id

    );

}


/*==================================================
LOAD MEMBERS
==================================================*/

async function loadMembers(){

    const snapshot=
        await getDocs(

            query(

                collection(
                    db,
                    "churches",
                    churchId,
                    "members"
                ),

                limit(
                    300
                )

            )

        );


    membersCache=
        snapshot.docs.map(
            item=>({

                id:
                    item.id,

                memberNo:
                    item.id,

                ...item.data()

            })
        );


    return membersCache;

}


/*==================================================
FILTER MEMBER
==================================================*/

function filterMembers(keyword){

    const key=
        txt(keyword)
        .toLowerCase();


    return membersCache
    .filter(
        member=>{

            if(
                !key
            ){

                return true;

            }


            return[

                memberLabel(
                    member
                ),

                memberIdLabel(
                    member
                ),

                member.position,

                member.role

            ]
            .map(txt)
            .join(" ")
            .toLowerCase()
            .includes(
                key
            );

        }
    )
    .slice(
        0,
        40
    );

}


/*==================================================
RENDER MEMBER RESULTS
==================================================*/

function renderMemberResults(
    list,
    target,
    handler
){

    if(
        !target
    ){

        return;

    }


    target.innerHTML=
        "";


    if(
        !list.length
    ){

        const empty=
            document.createElement(
                "div"
            );


        empty.textContent=
            "검색 결과가 없습니다.";


        target.appendChild(
            empty
        );


        return;

    }


    list.forEach(
        member=>{

            const button=
                document.createElement(
                    "button"
                );


            button.type=
                "button";


            button.className=
                "admin-list-link-btn";


            const name=
                document.createElement(
                    "span"
                );


            name.textContent=
                memberLabel(
                    member
                );


            const id=
                document.createElement(
                    "small"
                );


            id.textContent=
                memberIdLabel(
                    member
                );


            button.append(
                name,
                id
            );


            button.addEventListener(
                "click",
                ()=>{

                    handler(
                        member
                    );

                }
            );


            target.appendChild(
                button
            );

        }
    );

}


/*==================================================
SEARCH MEMBERS
==================================================*/

async function searchMembers(){

    if(
        !membersCache.length
    ){

        await loadMembers();

    }


    renderMemberResults(

        filterMembers(
            val(
                "memberSearchInput"
            )
        ),

        D.memberList,

        selectMember

    );

}


/*==================================================
SELECT MEMBER
==================================================*/

function selectMember(member){

    selectedMember=
        member;


    setText(

        "selectedMemberName",

        memberLabel(
            member
        )

    );


    setText(

        "selectedMemberYetalkId",

        memberIdLabel(
            member
        )

    );


    setVal(

        "selectedMemberGradeInput",

        member.grade||

        member.memberGrade||

        "member"

    );


    D.memberPanel
    ?.classList.remove(
        "hidden"
    );

}


/*==================================================
UPDATE MEMBER BOTH
==================================================*/

async function updateMemberBoth(
    id,
    data
){

    await Promise.all([

        setDoc(

            doc(
                db,
                "churches",
                churchId,
                "members",
                id
            ),

            data,

            {
                merge:true
            }

        ),


        setDoc(

            doc(
                db,
                "users",
                id,
                "churches",
                churchId
            ),

            data,

            {
                merge:true
            }

        )

    ]);

}


/*==================================================
GRADE
==================================================*/

async function saveMemberGrade(){

    if(
        !selectedMember
    ){

        return;

    }


    const grade=
        val(
            "selectedMemberGradeInput"
        );


    await updateMemberBoth(

        memberKey(
            selectedMember
        ),

        {

            grade,

            memberGrade:
                grade,

            updatedAt:
                serverTimestamp()

        }

    );


    showToast(
        "회원 등급을 저장했습니다."
    );

}


/*==================================================
SUSPEND
==================================================*/

function suspendMember(){

    if(
        !selectedMember
    ){

        return;

    }


    showConfirm(

        "회원 이용 중지",

        `${memberLabel(selectedMember)}님의 이 교회 이용을 중지할까요?`,

        async()=>{

            await updateMemberBoth(

                memberKey(
                    selectedMember
                ),

                {

                    status:
                        "suspended",

                    isActive:
                        false,

                    updatedAt:
                        serverTimestamp()

                }

            );


            showToast(
                "회원 이용을 중지했습니다."
            );

        }

    );

}


/*==================================================
RESTORE
==================================================*/

async function restoreMember(){

    if(
        !selectedMember
    ){

        return;

    }


    await updateMemberBoth(

        memberKey(
            selectedMember
        ),

        {

            status:
                "active",

            isActive:
                true,

            updatedAt:
                serverTimestamp()

        }

    );


    showToast(
        "회원 이용을 다시 허용했습니다."
    );

}


/*==================================================
REMOVE MEMBER
==================================================*/

function removeMember(){

    if(
        !selectedMember
    ){

        return;

    }


    showConfirm(

        "교회회원 해제",

        `${memberLabel(selectedMember)}님의 교회 회원자격을 해제할까요?`,

        async()=>{

            await updateMemberBoth(

                memberKey(
                    selectedMember
                ),

                {

                    status:
                        "removed",

                    isActive:
                        false,

                    removed:
                        true,

                    removedAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp()

                }

            );


            selectedMember=null;


            D.memberPanel
            ?.classList.add(
                "hidden"
            );


            membersCache=[];


            await searchMembers();


            showToast(
                "교회 회원자격을 해제했습니다."
            );

        }

    );

}


/*==================================================
ADMIN CANDIDATE
==================================================*/

async function searchAdminCandidates(){

    if(
        !membersCache.length
    ){

        await loadMembers();

    }


    renderMemberResults(

        filterMembers(
            val(
                "adminMemberSearchInput"
            )
        ),

        D.adminCandidateList,

        member=>{

            selectedAdmin=
                member;


            setText(

                "selectedAdminName",

                memberLabel(
                    member
                )

            );


            setVal(

                "selectedAdminPositionInput",

                member.position||
                ""

            );


            D.adminPanel
            ?.classList.remove(
                "hidden"
            );

        }

    );

}


/*==================================================
GRANT ADMIN
==================================================*/

async function grantAdmin(){

    if(
        !isOwnerPastor||
        !selectedAdmin
    ){

        return;

    }


    const id=
        memberKey(
            selectedAdmin
        );


    await updateMemberBoth(

        id,

        {

            role:
                "churchadmin",

            isAdmin:
                true,

            canManageChurch:
                true,

            position:
                val(
                    "selectedAdminPositionInput"
                ),

            updatedAt:
                serverTimestamp()

        }

    );


    showToast(
        "교회 관리자 권한을 부여했습니다."
    );


    membersCache=[];


    await loadChurchAdminList();

}


/*==================================================
REVOKE ADMIN
==================================================*/

function revokeAdmin(){

    if(
        !isOwnerPastor||
        !selectedAdmin
    ){

        return;

    }


    showConfirm(

        "관리자 권한 해제",

        `${memberLabel(selectedAdmin)}님의 관리자 권한을 해제할까요?`,

        async()=>{

            const id=
                memberKey(
                    selectedAdmin
                );


            await updateMemberBoth(

                id,

                {

                    role:
                        "member",

                    isAdmin:
                        false,

                    canManageChurch:
                        false,

                    updatedAt:
                        serverTimestamp()

                }

            );


            showToast(
                "관리자 권한을 해제했습니다."
            );


            membersCache=[];


            await loadChurchAdminList();

        }

    );

}


/*==================================================
ADMIN LIST
==================================================*/

async function loadChurchAdminList(){

    if(
        !isOwnerPastor
    ){

        return;

    }


    if(
        !membersCache.length
    ){

        await loadMembers();

    }


    const list=
        membersCache.filter(
            member=>{

                const roles=
                    roleText(

                        member.role,

                        member.memberRole

                    );


                return(

                    member.isAdmin===true

                    ||

                    member.canManageChurch===true

                    ||

                    roles.includes(
                        "admin"
                    )

                    ||

                    roles.includes(
                        "관리자"
                    )

                );

            }
        );


    renderMemberResults(

        list,

        D.churchAdminList,

        member=>{

            selectedAdmin=
                member;


            setText(

                "selectedAdminName",

                memberLabel(
                    member
                )

            );


            setVal(

                "selectedAdminPositionInput",

                member.position||
                ""

            );


            D.adminPanel
            ?.classList.remove(
                "hidden"
            );

        }

    );

}


/*==================================================
SIMPLE LIST
==================================================*/

async function showSimpleList(
    button,
    collectionName,
    labelMaker
){

    let box=
        button.nextElementSibling;


    if(
        box?.classList.contains(
            "dynamic-admin-list"
        )
    ){

        box.remove();

        return;

    }


    box=
        document.createElement(
            "div"
        );


    box.className=
        "admin-member-list dynamic-admin-list";


    const loading=
        document.createElement(
            "div"
        );


    loading.textContent=
        "불러오는 중...";


    box.appendChild(
        loading
    );


    button.after(
        box
    );


    try{

        let snapshot;


        try{

            snapshot=
                await getDocs(

                    query(

                        collection(
                            db,
                            "churches",
                            churchId,
                            collectionName
                        ),

                        orderBy(
                            "createdAt",
                            "desc"
                        ),

                        limit(
                            30
                        )

                    )

                );

        }catch{

            snapshot=
                await getDocs(

                    collection(
                        db,
                        "churches",
                        churchId,
                        collectionName
                    )

                );

        }


        box.innerHTML=
            "";


        const docs=
            snapshot.docs.filter(
                item=>
                    item.data()?.deleted!==true
            );


        if(
            !docs.length
        ){

            const empty=
                document.createElement(
                    "div"
                );


            empty.textContent=
                "등록된 내용이 없습니다.";


            box.appendChild(
                empty
            );


            return;

        }


        docs.forEach(
            item=>{

                const data={

                    id:
                        item.id,

                    ...item.data()

                };


                const row=
                    document.createElement(
                        "div"
                    );


                const label=
                    document.createElement(
                        "div"
                    );


                label.textContent=
                    labelMaker(
                        data
                    );


                row.appendChild(
                    label
                );


                const remove=
                    document.createElement(
                        "button"
                    );


                remove.type=
                    "button";


                remove.className=
                    "admin-danger-btn";


                remove.textContent=
                    "삭제";


                remove.addEventListener(
                    "click",
                    ()=>{

                        showConfirm(

                            "삭제 확인",

                            "이 항목을 삭제할까요?",

                            async()=>{

                                await setDoc(

                                    doc(
                                        db,
                                        "churches",
                                        churchId,
                                        collectionName,
                                        item.id
                                    ),

                                    {

                                        deleted:
                                            true,

                                        deletedAt:
                                            serverTimestamp(),

                                        updatedAt:
                                            serverTimestamp()

                                    },

                                    {
                                        merge:true
                                    }

                                );


                                row.remove();


                                showToast(
                                    "삭제했습니다."
                                );

                            }

                        );

                    }
                );


                row.appendChild(
                    remove
                );


                box.appendChild(
                    row
                );

            }
        );


    }catch(error){

        console.error(
            error
        );


        box.innerHTML=
            "";


        const fail=
            document.createElement(
                "div"
            );


        fail.textContent=
            "목록을 불러오지 못했습니다.";


        box.appendChild(
            fail
        );

    }

}


/*==================================================
COMMUNITY - MEMBER NEWS
==================================================*/

function manageMemberNews(){

    scrollToSection(
        "noticeSection"
    );


    if(
        !val(
            "noticeTitleInput"
        )
    ){

        setVal(
            "noticeTitleInput",
            "[교우소식] "
        );

    }


    $("noticeTitleInput")
    ?.focus();


    showToast(
        "교우소식은 공지알림에 작성하면 보배성도에도 자동 분류됩니다."
    );

}


/*==================================================
COMMUNITY - CELL MATERIAL EDITOR
==================================================*/

function manageCellMaterial(){

    if(
        !D.communityEditor
    ){

        return;

    }


    D.communityEditor
    .classList.remove(
        "hidden"
    );


    D.communityEditor.innerHTML=`

        <div class="admin-mini-title">
            마을 · 셀 · 사랑방 자료
        </div>

        <div class="admin-field">

            <label>
                제목
            </label>

            <input
                id="communityMaterialTitleInput"
                class="admin-input"
                type="text"
                maxlength="120">

        </div>

        <div class="admin-field">

            <label>
                내용 · 나눔질문
            </label>

            <textarea
                id="communityMaterialContentInput"
                class="admin-textarea"
                rows="7"
                maxlength="5000"></textarea>

        </div>

        <label class="admin-check-row">

            <input
                id="communityMaterialPinnedInput"
                type="checkbox">

            <span>
                ⭐ 보배성도 최상단에 고정
            </span>

        </label>

        <button
            id="saveCommunityMaterialBtn"
            class="admin-save-btn"
            type="button">

            자료 등록

        </button>

    `;


    $("saveCommunityMaterialBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveCommunityMaterial
        )
    );

}


/*==================================================
SAVE COMMUNITY MATERIAL
==================================================*/

async function saveCommunityMaterial(){

    const title=
        val(
            "communityMaterialTitleInput"
        );


    const content=
        val(
            "communityMaterialContentInput"
        );


    if(
        !title&&
        !content
    ){

        showToast(
            "자료 내용을 입력해주세요."
        );


        return;

    }


    const itemRef=
        doc(

            collection(
                db,
                "churches",
                churchId,
                "communityMaterials"
            )

        );


    await setDoc(

        itemRef,

        {

            type:
                "cell",

            category:
                "마을·셀·사랑방",

            title,

            content,

            pinned:
                $("communityMaterialPinnedInput")
                ?.checked===true,

            visible:
                true,

            deleted:
                false,

            createdAt:
                serverTimestamp(),

            createdBy:
                memberNo

        }

    );


    showToast(
        "보배성도 자료를 등록했습니다."
    );


    manageCellMaterial();

}


/*==================================================
TRAINING EDITOR
==================================================*/

function manageTraining(){

    if(
        !D.communityEditor
    ){

        return;

    }


    D.communityEditor
    .classList.remove(
        "hidden"
    );


    D.communityEditor.innerHTML=`

        <div class="admin-mini-title">
            훈련프로그램 등록
        </div>

        <div class="admin-field">

            <label>
                프로그램 이름
            </label>

            <input
                id="trainingProgramNameAdminInput"
                class="admin-input"
                type="text"
                maxlength="120"
                placeholder="새가족반, 성경공부, 제자훈련 등">

        </div>

        <div class="admin-field">

            <label>
                설명
            </label>

            <textarea
                id="trainingProgramDescriptionAdminInput"
                class="admin-textarea"
                rows="5"
                maxlength="3000"></textarea>

        </div>

        <div class="admin-field">

            <label>
                표시 순서
            </label>

            <input
                id="trainingProgramOrderAdminInput"
                class="admin-input"
                type="number"
                min="1"
                max="99"
                value="1">

        </div>

        <label class="admin-check-row">

            <input
                id="trainingProgramOpenAdminInput"
                type="checkbox"
                checked>

            <span>
                현재 모집중
            </span>

        </label>

        <label class="admin-check-row">

            <input
                id="trainingProgramPinnedAdminInput"
                type="checkbox">

            <span>
                ⭐ 중요 프로그램 최상단 고정
            </span>

        </label>

        <button
            id="saveTrainingProgramAdminBtn"
            class="admin-save-btn"
            type="button">

            훈련프로그램 등록

        </button>

    `;


    $("saveTrainingProgramAdminBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveTrainingProgram
        )
    );

}


/*==================================================
SAVE TRAINING PROGRAM
==================================================*/

async function saveTrainingProgram(){

    const name=
        val(
            "trainingProgramNameAdminInput"
        );


    if(
        !name
    ){

        showToast(
            "훈련프로그램 이름을 입력해주세요."
        );


        return;

    }


    const itemRef=
        doc(

            collection(
                db,
                "churches",
                churchId,
                "trainingPrograms"
            )

        );


    await setDoc(

        itemRef,

        {

            name,

            title:
                name,

            description:
                val(
                    "trainingProgramDescriptionAdminInput"
                ),

            order:
                Number(
                    val(
                        "trainingProgramOrderAdminInput"
                    )||
                    1
                ),

            open:
                $("trainingProgramOpenAdminInput")
                ?.checked!==false,

            isOpen:
                $("trainingProgramOpenAdminInput")
                ?.checked!==false,

            pinned:
                $("trainingProgramPinnedAdminInput")
                ?.checked===true,

            visible:
                true,

            deleted:
                false,

            createdAt:
                serverTimestamp(),

            createdBy:
                memberNo

        }

    );


    showToast(
        "훈련프로그램을 등록했습니다."
    );


    manageTraining();

}


/*==================================================
TRAINING APPLICATIONS
==================================================*/

async function loadTrainingApplications(){

    if(
        !D.trainingApplications
    ){

        return;

    }


    D.trainingApplications.innerHTML=
        "";


    const snapshot=
        await getDocs(

            collection(
                db,
                "churches",
                churchId,
                "trainingApplications"
            )

        );


    const list=
        snapshot.docs
        .map(
            item=>({

                id:
                    item.id,

                ...item.data()

            })
        )
        .filter(
            item=>
                item.deleted!==true
        )
        .sort(
            (a,b)=>{

                const aTime=
                    a.createdAt?.seconds||
                    0;


                const bTime=
                    b.createdAt?.seconds||
                    0;


                return bTime-aTime;

            }
        );


    if(
        !list.length
    ){

        const empty=
            document.createElement(
                "div"
            );


        empty.textContent=
            "현재 훈련 신청자가 없습니다.";


        D.trainingApplications
        .appendChild(
            empty
        );


        return;

    }


    list.forEach(
        application=>{

            const row=
                document.createElement(
                    "article"
                );


            row.className=
                "admin-selected-panel";


            const name=
                document.createElement(
                    "strong"
                );


            name.textContent=

                `${txt(application.name)||"신청자"} · `+

                `${txt(application.programName)||"훈련프로그램"}`;


            const phone=
                document.createElement(
                    "small"
                );


            phone.textContent=
                txt(
                    application.phone
                )||
                "연락처 없음";


            row.append(
                name,
                phone
            );


            if(
                txt(
                    application.message
                )
            ){

                const message=
                    document.createElement(
                        "p"
                    );


                message.textContent=
                    application.message;


                message.style.whiteSpace=
                    "pre-wrap";


                row.appendChild(
                    message
                );

            }


            const select=
                document.createElement(
                    "select"
                );


            select.className=
                "admin-select";


            [

                "신청",
                "확인",
                "승인",
                "완료"

            ]
            .forEach(
                status=>{

                    const option=
                        document.createElement(
                            "option"
                        );


                    option.value=
                        status;


                    option.textContent=
                        status;


                    select.appendChild(
                        option
                    );

                }
            );


            select.value=
                txt(
                    application.status
                )||
                "신청";


            const save=
                document.createElement(
                    "button"
                );


            save.type=
                "button";


            save.className=
                "admin-outline-wide-btn";


            save.textContent=
                "상태 저장";


            save.addEventListener(
                "click",
                ()=>run(
                    async()=>{

                        await setDoc(

                            doc(
                                db,
                                "churches",
                                churchId,
                                "trainingApplications",
                                application.id
                            ),

                            {

                                status:
                                    select.value,

                                updatedAt:
                                    serverTimestamp()

                            },

                            {
                                merge:true
                            }

                        );


                        showToast(
                            "신청 상태를 저장했습니다."
                        );

                    }
                )
            );


            row.append(
                select,
                save
            );


            D.trainingApplications
            .appendChild(
                row
            );

        }
    );

}


/*==================================================
CHAT MANAGE
==================================================*/

function loadChatManage(){

    if(
        !D.chatManageList
    ){

        return;

    }


    D.chatManageList.innerHTML=
        "";


    const item=
        document.createElement(
            "div"
        );


    item.textContent=
        "예수동행 · 공지알림 · 성도교제 채팅방을 순차적으로 관리자 기능과 연결합니다.";


    D.chatManageList
    .appendChild(
        item
    );


    showToast(
        "채팅관리 화면을 불러왔습니다."
    );

}


/*==================================================
PLAN REQUEST
==================================================*/

function requestPlan(name){

    showToast(
        `${name} 요금제 신청은 결제시스템 연결 단계에서 활성화합니다.`
    );

}


/*==================================================
FILE INPUT
==================================================*/

function bindFileInputs(){

    document
    .querySelectorAll(
        ".hero-file-select-btn"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    $(
                        "heroImageFile"+
                        button.dataset.heroIndex
                    )
                    ?.click();

                }
            );

        }
    );


    document
    .querySelectorAll(
        ".hero-file-input"
    )
    .forEach(
        input=>{

            input.addEventListener(
                "change",
                ()=>{

                    setText(

                        "heroFileName"+
                        input.dataset.heroIndex,

                        input.files?.[0]?.name

                        ||

                        "선택된 사진이 없습니다."

                    );

                }
            );

        }
    );


    $("selectPastorPhotoBtn")
    ?.addEventListener(
        "click",
        ()=>{

            $("pastorPhotoFileInput")
            ?.click();

        }
    );


    $("pastorPhotoFileInput")
    ?.addEventListener(
        "change",
        event=>{

            setText(

                "pastorPhotoFileName",

                event.target.files?.[0]?.name

                ||

                "선택된 사진이 없습니다."

            );

        }
    );


    $("selectArchiveFileBtn")
    ?.addEventListener(
        "click",
        ()=>{

            $("archiveFileInput")
            ?.click();

        }
    );


    $("archiveFileInput")
    ?.addEventListener(
        "change",
        event=>{

            setText(

                "archiveSelectedFileName",

                event.target.files?.[0]?.name

                ||

                "선택된 파일이 없습니다."

            );

        }
    );

}


/*==================================================
EVENTS
==================================================*/

function bindEvents(){

    $("adminBackBtn")
    ?.addEventListener(
        "click",
        ()=>{

            if(
                history.length>1
            ){

                history.back();

            }else{

                location.href=
                    churchHomeUrl();

            }

        }
    );


    $("adminHomeBtn")
    ?.addEventListener(
        "click",
        ()=>{

            scrollToSection(
                "adminQuickSection"
            );

        }
    );


    $("deniedBackBtn")
    ?.addEventListener(
        "click",
        ()=>{

            location.href=
                churchHomeUrl();

        }
    );


    /*==================================================
    VISUAL EDITOR LINK
    ==================================================*/

    $("openVisualEditorBtn")
    ?.addEventListener(
        "click",
        ()=>{

            location.href=
                visualEditorUrl();

        }
    );


    $("quickVisualEditBtn")
    ?.addEventListener(
        "click",
        ()=>{

            location.href=
                visualEditorUrl();

        }
    );


    $("openChurchPreviewBtn")
    ?.addEventListener(
        "click",
        ()=>{

            location.href=
                churchHomeUrl();

        }
    );


    /*==================================================
    QUICK SECTIONS
    ==================================================*/

    document
    .querySelectorAll(
        "[data-admin-target]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    scrollToSection(
                        button.dataset.adminTarget
                    );

                }
            );

        }
    );


    /*==================================================
    BASIC / HOME
    ==================================================*/

    $("saveChurchBasicBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveChurchBasic
        )
    );


    $("saveChurchHeroBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveHeroes
        )
    );


    $("savePastorGreetingBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            savePastorGreeting
        )
    );


    $("saveChurchHomeLinksBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveHomeLinks
        )
    );


    /*==================================================
    BULLETIN
    ==================================================*/

    $("addWorshipOrderBtn")
    ?.addEventListener(
        "click",
        ()=>{

            D.orderEditor
            ?.appendChild(

                createOrderRow({
                    title:"새 순서"
                })

            );

        }
    );


    $("addBulletinPageBtn")
    ?.addEventListener(
        "click",
        ()=>{

            createExtraPage();

        }
    );


    $("saveBulletinBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveBulletin
        )
    );


    /*==================================================
    NOTICE / CALENDAR
    ==================================================*/

    $("publishNoticeBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            publishNotice
        )
    );


    $("saveCalendarEventBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveCalendar
        )
    );


    /*==================================================
    PASTOR WORD
    ==================================================*/

    $("publishPastorWordBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            publishPastorWord
        )
    );


    $("openPastorWordShareBtn")
    ?.addEventListener(
        "click",
        openPastorWordShare
    );


    /*==================================================
    WORSHIP
    ==================================================*/

    $("saveWorshipLiveBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveLive
        )
    );


    $("saveSermonBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveSermon
        )
    );


    /*==================================================
    ARCHIVE
    ==================================================*/

    $("saveArchiveBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveArchive
        )
    );


    /*==================================================
    LISTS
    ==================================================*/

    $("openNoticeListBtn")
    ?.addEventListener(
        "click",
        event=>{

            showSimpleList(

                event.currentTarget,

                "notices",

                item=>

                    `${txt(item.title)}  ${txt(item.startDate)}`

            );

        }
    );


    $("openChurchCalendarBtn")
    ?.addEventListener(
        "click",
        event=>{

            showSimpleList(

                event.currentTarget,

                "calendar",

                item=>

                    `${txt(item.date)} ${txt(item.time)} · ${txt(item.title)}`

            );

        }
    );


    $("openPastorWordArchiveBtn")
    ?.addEventListener(
        "click",
        event=>{

            showSimpleList(

                event.currentTarget,

                "pastorWords",

                item=>

                    `${txt(item.date)} · ${txt(item.bible)} · ${txt(item.title)}`

            );

        }
    );


    $("openSermonArchiveBtn")
    ?.addEventListener(
        "click",
        event=>{

            showSimpleList(

                event.currentTarget,

                "sermons",

                item=>

                    `${txt(item.date)} · ${txt(item.title)} · ${txt(item.speaker||item.pastor)}`

            );

        }
    );


    $("openArchiveListBtn")
    ?.addEventListener(
        "click",
        event=>{

            showSimpleList(

                event.currentTarget,

                "archive",

                item=>

                    `${txt(item.title)} · ${txt(item.type)}`

            );

        }
    );


    /*==================================================
    COMMUNITY
    ==================================================*/

    $("manageMemberNewsBtn")
    ?.addEventListener(
        "click",
        manageMemberNews
    );


    $("manageCellMaterialBtn")
    ?.addEventListener(
        "click",
        manageCellMaterial
    );


    $("manageTrainingBtn")
    ?.addEventListener(
        "click",
        manageTraining
    );


    $("viewTrainingApplicantsBtn")
    ?.addEventListener(
        "click",
        ()=>{

            scrollToSection(
                "memberManageSection"
            );


            run(
                loadTrainingApplications
            );

        }
    );


    $("loadTrainingApplicationsBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            loadTrainingApplications
        )
    );


    /*==================================================
    MEMBER
    ==================================================*/

    $("memberSearchBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            searchMembers
        )
    );


    $("saveMemberGradeBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            saveMemberGrade
        )
    );


    $("suspendMemberBtn")
    ?.addEventListener(
        "click",
        suspendMember
    );


    $("restoreMemberBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            restoreMember
        )
    );


    $("removeMemberBtn")
    ?.addEventListener(
        "click",
        removeMember
    );


    /*==================================================
    ADMIN
    ==================================================*/

    $("searchAdminMemberBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            searchAdminCandidates
        )
    );


    $("grantChurchAdminBtn")
    ?.addEventListener(
        "click",
        ()=>run(
            grantAdmin
        )
    );


    $("revokeChurchAdminBtn")
    ?.addEventListener(
        "click",
        revokeAdmin
    );


    /*==================================================
    CHAT
    ==================================================*/

    $("loadChatManageBtn")
    ?.addEventListener(
        "click",
        loadChatManage
    );


    /*==================================================
    PLAN
    ==================================================*/

    $("requestLitePlanBtn")
    ?.addEventListener(
        "click",
        ()=>requestPlan(
            "경량 월 5,500원"
        )
    );


    $("requestBasicPlanBtn")
    ?.addEventListener(
        "click",
        ()=>requestPlan(
            "기본 월 22,000원"
        )
    );


    $("startPremiumBtn")
    ?.addEventListener(
        "click",
        ()=>requestPlan(
            "프리미엄 월 33,000원"
        )
    );


    $("requestMissionPlanBtn")
    ?.addEventListener(
        "click",
        ()=>requestPlan(
            "선교프리미엄 월 44,000원"
        )
    );


    $("requestFreeSupportBtn")
    ?.addEventListener(
        "click",
        ()=>{

            showToast(
                "무료 후원 신청 기능은 신청폼 연결 단계에서 활성화합니다."
            );

        }
    );


    $("managePaymentMethodBtn")
    ?.addEventListener(
        "click",
        ()=>{

            showToast(
                "결제수단 관리는 결제시스템 연결 후 활성화합니다."
            );

        }
    );


    $("openPaymentHistoryBtn")
    ?.addEventListener(
        "click",
        ()=>{

            showToast(
                "결제내역은 결제시스템 연결 후 표시합니다."
            );

        }
    );


    /*==================================================
    CONFIRM
    ==================================================*/

    D.confirmCancel
    ?.addEventListener(
        "click",
        closeConfirm
    );


    D.confirmClose
    ?.addEventListener(
        "click",
        closeConfirm
    );


    D.confirm
    ?.addEventListener(
        "click",
        event=>{

            if(
                event.target===
                D.confirm
            ){

                closeConfirm();

            }

        }
    );


    D.confirmOk
    ?.addEventListener(
        "click",
        async()=>{

            const action=
                confirmAction;


            closeConfirm();


            if(
                action
            ){

                await run(
                    action
                );

            }

        }
    );


    bindFileInputs();

}


/*==================================================
RUN
==================================================*/

async function run(fn){

    try{

        await fn();

    }catch(error){

        console.error(
            error
        );


        showToast(

            error?.message

            ||

            "처리 중 오류가 발생했습니다."

        );

    }

}


/*==================================================
START POSITION
==================================================*/

function resetAdminStartPosition(){

    window.scrollTo(
        0,
        0
    );


    setTimeout(
        ()=>{

            window.scrollTo(
                0,
                0
            );

        },
        100
    );

}


/*==================================================
INIT
==================================================*/

async function init(){

    if(
        "scrollRestoration" in
        history
    ){

        history.scrollRestoration=
            "manual";

    }


    resolveChurchId();


    loadLogin();


    loadTextSize();


    bindEvents();


    setDefaults();


    resetAdminStartPosition();


    try{

        await loadBase();


        checkPermission();


        if(
            !finishPermission()
        ){

            return;

        }


        fillChurchForm();


        await loadBulletin();


        await loadPastorWordForm();


        if(
            isOwnerPastor
        ){

            await loadChurchAdminList();

        }


        resetAdminStartPosition();


    }catch(error){

        console.error(
            "CHURCHADMIN 초기화 오류",
            error
        );


        D.loading
        ?.classList.add(
            "hidden"
        );


        D.denied
        ?.classList.remove(
            "hidden"
        );


        showToast(
            "관리자 화면을 불러오지 못했습니다."
        );

    }

}


/*==================================================
START
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    init
);


/*==================================================
END CHURCHADMIN.JS
==================================================*/