/*==================================================
YETALK CHURCHCOMMUNITY.JS

보배성도

- 빈 영역은 표시하지 않음
- 관리자가 등록한 실제 내용만 표시
- ⭐ 상단고정
- 교우소식
- 마을 · 셀 · 사랑방 자료
- 이번 주 말씀나눔
- 훈련프로그램
- 훈련 신청
- 나의 신청
- 성도교제 → chatfree
==================================================*/


import{

    db,

    doc,

    getDoc,

    setDoc,

    collection,

    getDocs,

    serverTimestamp

}from"../firebase.js";


/*==================================================
DOM
==================================================*/

const $=id=>
    document.getElementById(id);


const dom={

    backBtn:
        $("communityBackBtn"),

    homeBtn:
        $("communityHomeBtn"),

    churchName:
        $("communityChurchName"),


    pinnedSection:
        $("communityPinnedSection"),

    pinnedList:
        $("communityPinnedList"),


    memberNewsSection:
        $("memberNewsSection"),

    memberNewsList:
        $("memberNewsList"),

    openAllMemberNewsBtn:
        $("openAllMemberNewsBtn"),


    cellMeetingSection:
        $("cellMeetingSection"),

    cellSermonCard:
        $("cellSermonCard"),

    cellSermonDate:
        $("cellSermonDate"),

    cellSermonTitle:
        $("cellSermonTitle"),

    cellSermonBible:
        $("cellSermonBible"),

    cellSermonSummary:
        $("cellSermonSummary"),

    openSermonMaterialBtn:
        $("openSermonMaterialBtn"),

    cellMeetingGuide:
        $("cellMeetingGuide"),


    trainingSection:
        $("trainingSection"),

    trainingProgramList:
        $("trainingProgramList"),


    myTrainingSection:
        $("myTrainingSection"),

    myTrainingApplications:
        $("myTrainingApplications"),


    fellowshipBtn:
        $("openFellowshipChatBtn"),


    trainingOverlay:
        $("trainingApplyOverlay"),

    trainingCloseBtn:
        $("trainingApplyCloseBtn"),

    trainingProgramName:
        $("trainingApplyProgramName"),

    trainingName:
        $("trainingApplyName"),

    trainingPhone:
        $("trainingApplyPhone"),

    trainingMessage:
        $("trainingApplyMessage"),

    trainingSubmitBtn:
        $("trainingApplySubmitBtn"),


    toast:
        $("communityToast")

};


/*==================================================
STATE
==================================================*/

let churchId="";

let churchData={};

let loginUser={};

let userData={};

let membershipData={};


let memberNo="";

let myRealName="";


let selectedTrainingProgram=null;


let noticeItems=[];

let trainingPrograms=[];

let meetingMaterials=[];


/*==================================================
UTILITY
==================================================*/

function clean(value){

    return String(
        value??""
    ).trim();

}


/*==================================================
BOOLEAN
==================================================*/

function boolValue(value){

    return(

        value===true

        ||

        value==="true"

        ||

        value===1

        ||

        value==="1"

        ||

        value==="yes"

        ||

        value==="Y"

    );

}


/*==================================================
NUMBER
==================================================*/

function numberValue(
    value,
    fallback=999
){

    const number=
        Number(value);


    return Number.isFinite(number)
        ?number
        :fallback;

}


/*==================================================
TODAY
==================================================*/

function getToday(){

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
TIMESTAMP
==================================================*/

function timestampToDate(value){

    if(
        !value
    ){

        return null;

    }


    try{

        if(
            typeof value.toDate===
            "function"
        ){

            return value.toDate();

        }


        if(
            value.seconds
        ){

            return new Date(
                value.seconds*1000
            );

        }


        const date=
            new Date(value);


        if(
            Number.isNaN(
                date.getTime()
            )
        ){

            return null;

        }


        return date;


    }catch{

        return null;

    }

}


/*==================================================
TIME VALUE
==================================================*/

function timeValue(value){

    const date=
        timestampToDate(
            value
        );


    return date
        ?date.getTime()
        :0;

}


/*==================================================
DATE TEXT
==================================================*/

function formatDate(value){

    const date=
        timestampToDate(
            value
        );


    if(
        !date
    ){

        return"";

    }


    return(

        `${date.getMonth()+1}.`+

        `${String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )}`

    );

}


/*==================================================
LOGIN
==================================================*/

function loadLoginUser(){

    try{

        const raw=
            localStorage.getItem(
                "loginUser"
            );


        loginUser=
            raw
            ?JSON.parse(raw)||{}
            :{};


    }catch{

        loginUser={};

    }

}


/*==================================================
CHURCH ID
==================================================*/

function resolveChurchId(){

    const params=
        new URLSearchParams(
            location.search
        );


    churchId=

        clean(
            params.get(
                "churchId"
            )
        )

        ||

        clean(
            localStorage.getItem(
                "currentChurchId"
            )
        )

        ||

        clean(
            localStorage.getItem(
                "yetalkMyChurchId"
            )
        )

        ||

        "yetalk-lounge";


    localStorage.setItem(
        "currentChurchId",
        churchId
    );

}


/*==================================================
MEMBER NO
==================================================*/

function resolveMemberNo(){

    memberNo=
        clean(

            loginUser.memberNo||

            loginUser.userNo||

            loginUser.userId||

            loginUser.uid||

            loginUser.id||

            userData.memberNo||

            userData.userNo||

            userData.userId||

            userData.uid||

            userData.id

        );

}


/*==================================================
LOAD USER
==================================================*/

async function loadUser(){

    resolveMemberNo();


    if(
        !memberNo
    ){

        return;

    }


    try{

        const snap=
            await getDoc(

                doc(
                    db,
                    "users",
                    memberNo
                )

            );


        if(
            snap.exists()
        ){

            userData=
                snap.data()||{};

        }


    }catch(error){

        console.warn(
            "사용자 정보 오류",
            error
        );

    }


    resolveMemberNo();

}


/*==================================================
LOAD CHURCH
==================================================*/

async function loadChurch(){

    try{

        const snap=
            await getDoc(

                doc(
                    db,
                    "churches",
                    churchId
                )

            );


        churchData=
            snap.exists()
            ?snap.data()||{}
            :{};


    }catch(error){

        console.warn(
            "교회정보 오류",
            error
        );


        churchData={};

    }

}


/*==================================================
LOAD MEMBERSHIP
==================================================*/

async function loadMembership(){

    if(
        !memberNo
    ){

        return;

    }


    try{

        const snap=
            await getDoc(

                doc(
                    db,
                    "churches",
                    churchId,
                    "members",
                    memberNo
                )

            );


        membershipData=
            snap.exists()
            ?snap.data()||{}
            :{};


    }catch(error){

        console.warn(
            "교회회원 정보 오류",
            error
        );


        membershipData={};

    }

}


/*==================================================
REAL NAME
==================================================*/

function resolveRealName(){

    myRealName=
        clean(

            membershipData.realName||

            membershipData.name||

            membershipData.memberName||

            userData.realName||

            userData.name||

            userData.memberName||

            loginUser.realName||

            loginUser.name||

            loginUser.memberName

        );

}


/*==================================================
CHURCH NAME
==================================================*/

function getChurchName(){

    return clean(

        churchData.churchName||

        churchData.name

    )||
    "우리교회";

}


/*==================================================
BASIC RENDER
==================================================*/

function renderBasic(){

    if(
        dom.churchName
    ){

        dom.churchName.textContent=
            getChurchName();

    }


    if(
        dom.trainingName
    ){

        dom.trainingName.value=
            myRealName;

    }


    if(
        dom.trainingPhone
    ){

        dom.trainingPhone.value=
            clean(

                membershipData.phone||

                userData.phone||

                loginUser.phone

            );

    }

}


/*==================================================
TEXT SIZE
==================================================*/

function loadTextSize(){

    const saved=
        clean(
            localStorage.getItem(
                "yetalkTextSize"
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
THEME
==================================================*/

function loadTheme(){

    const keys=[

        `yetalkChurchAtmosphere_${memberNo||"guest"}_${churchId}`,

        `yetalkChurchTheme_${churchId}`,

        "yetalkLastTheme",

        "faithHeaderColor"

    ];


    let saved="";


    for(
        const key of keys
    ){

        saved=
            clean(
                localStorage.getItem(key)
            );


        if(
            saved
        ){

            break;

        }

    }


    const convert={

        gold:"yellow",

        yellow:"yellow",

        blue:"blue",

        purple:"purple",

        red:"red",

        white:"white",

        black:"black",

        pink:"pink"

    };


    const theme=
        convert[saved]||
        "blue";


    document.body.classList.remove(

        "theme-blue",

        "theme-purple",

        "theme-red",

        "theme-white",

        "theme-black",

        "theme-pink",

        "theme-yellow"

    );


    document.body.classList.add(
        `theme-${theme}`
    );

}


/*==================================================
HIDE SECTION
==================================================*/

function hideSection(element){

    element
    ?.classList.add(
        "hidden"
    );

}


/*==================================================
SHOW SECTION
==================================================*/

function showSection(element){

    element
    ?.classList.remove(
        "hidden"
    );

}


/*==================================================
NOTICE CATEGORY
==================================================*/

function noticeCategory(item){

    return clean(

        item.category||

        item.noticeCategory||

        item.noticeType||

        item.type||

        item.group

    ).toLowerCase();

}


/*==================================================
IS MEMBER NEWS
==================================================*/

function isMemberNews(item){

    const category=
        noticeCategory(item);


    const title=
        clean(
            item.title
        );


    return(

        category==="member"

        ||

        category==="membernews"

        ||

        category==="member-news"

        ||

        category==="교우소식"

        ||

        category.includes(
            "교우"
        )

        ||

        title.startsWith(
            "[교우]"
        )

        ||

        title.startsWith(
            "[교우소식]"
        )

    );

}


/*==================================================
PINNED
==================================================*/

function isPinned(item){

    return(

        boolValue(
            item.pinned
        )

        ||

        boolValue(
            item.isPinned
        )

        ||

        boolValue(
            item.topFixed
        )

        ||

        boolValue(
            item.favorite
        )

        ||

        Number(
            item.priority
        )===1

    );

}


/*==================================================
NOTICE ICON
==================================================*/

function memberNewsIcon(item){

    const text=

        `${clean(item.title)} `+

        `${clean(
            item.content||
            item.text||
            item.message
        )}`;


    if(
        text.includes("결혼")
    ){

        return"💐";

    }


    if(
        text.includes("출산")||
        text.includes("아기")
    ){

        return"👶";

    }


    if(
        text.includes("입원")||
        text.includes("퇴원")||
        text.includes("환우")
    ){

        return"🙏";

    }


    if(
        text.includes("새가족")
    ){

        return"🌱";

    }


    if(
        text.includes("이사")
    ){

        return"🏠";

    }


    if(
        text.includes("개업")
    ){

        return"🎉";

    }


    if(
        text.includes("소천")||
        text.includes("장례")
    ){

        return"🌿";

    }


    return"🌷";

}


/*==================================================
READ COLLECTION SAFE
==================================================*/

async function readCollectionSafe(
    ...segments
){

    try{

        const snap=
            await getDocs(

                collection(
                    db,
                    ...segments
                )

            );


        return snap.docs.map(
            item=>({

                id:item.id,

                ...(
                    item.data()||
                    {}
                )

            })
        );


    }catch(error){

        console.warn(
            "컬렉션 읽기 오류",
            segments.join("/"),
            error
        );


        return[];

    }

}


/*==================================================
LOAD NOTICES

여러 기존 구조를 같이 확인
==================================================*/

async function loadNotices(){

    const results=[];


    const churchNotices=
        await readCollectionSafe(

            "churches",
            churchId,
            "notices"

        );


    results.push(
        ...churchNotices
    );


    /*
    chatnotice가 채팅구조로 저장되는 경우도 대비
    */

    const noticeChat=
        await readCollectionSafe(

            "churches",
            churchId,
            "chats",
            "notice",
            "messages"

        );


    results.push(
        ...noticeChat
    );


    const chatNotice=
        await readCollectionSafe(

            "churches",
            churchId,
            "chats",
            "chatnotice",
            "messages"

        );


    results.push(
        ...chatNotice
    );


    /*
    중복 제거
    */

    const map=
        new Map();


    results.forEach(
        item=>{

            const key=

                clean(item.id)

                ||

                [
                    clean(item.title),
                    clean(
                        item.content||
                        item.text||
                        item.message
                    ),
                    timeValue(
                        item.createdAt
                    )
                ].join("|");


            map.set(
                key,
                item
            );

        }
    );


    noticeItems=
        Array.from(
            map.values()
        )
        .filter(
            item=>
                item.deleted!==true
        )
        .sort(
            (a,b)=>

                timeValue(
                    b.updatedAt||
                    b.createdAt
                )

                -

                timeValue(
                    a.updatedAt||
                    a.createdAt
                )
        );

}


/*==================================================
CREATE NEWS CARD
==================================================*/

function createMemberNewsCard(item){

    const card=
        document.createElement(
            "article"
        );


    card.className=
        "member-news-card";


    const icon=
        document.createElement(
            "div"
        );


    icon.className=
        "member-news-icon";


    icon.textContent=
        memberNewsIcon(item);


    const body=
        document.createElement(
            "div"
        );


    const title=
        document.createElement(
            "strong"
        );


    title.textContent=
        clean(
            item.title
        )||
        "교우소식";


    body.appendChild(
        title
    );


    const content=
        clean(

            item.content||

            item.text||

            item.message

        );


    if(
        content
    ){

        const text=
            document.createElement(
                "p"
            );


        text.textContent=
            content;


        body.appendChild(
            text
        );

    }


    card.append(
        icon,
        body
    );


    return card;

}


/*==================================================
RENDER MEMBER NEWS
==================================================*/

function renderMemberNews(){

    if(
        !dom.memberNewsList
    ){

        return;

    }


    const list=
        noticeItems.filter(
            isMemberNews
        );


    dom.memberNewsList.innerHTML=
        "";


    if(
        !list.length
    ){

        hideSection(
            dom.memberNewsSection
        );


        return;

    }


    list
    .slice(
        0,
        7
    )
    .forEach(
        item=>{

            dom.memberNewsList
            .appendChild(

                createMemberNewsCard(
                    item
                )

            );

        }
    );


    showSection(
        dom.memberNewsSection
    );

}


/*==================================================
SERMON DATA
==================================================*/

function getCurrentSermon(){

    return(

        churchData.currentSermon||

        churchData.latestSermon||

        churchData.sermon||

        churchData.weeklySermon||

        {}

    );

}


/*==================================================
SERMON MATERIAL DATA
==================================================*/

function getSermonMaterialData(){

    return(

        churchData.currentSermonMaterials||

        churchData.sermonMaterials||

        churchData.cellMaterial||

        {}

    );

}


/*==================================================
RENDER SERMON
==================================================*/

function renderCurrentSermon(){

    const sermon=
        getCurrentSermon();


    const materials=
        getSermonMaterialData();


    const title=
        clean(
            sermon.title
        );


    const bible=
        clean(

            sermon.bible||

            sermon.scripture

        );


    const summary=
        clean(

            sermon.summary||

            sermon.sermonSummary||

            materials.summary||

            materials.content

        );


    const materialUrl=
        clean(

            sermon.materialUrl||

            sermon.pdfUrl||

            materials.url||

            materials.materialUrl

        );


    if(
        !title&&
        !bible&&
        !summary
    ){

        hideSection(
            dom.cellSermonCard
        );


        return false;

    }


    if(
        dom.cellSermonTitle
    ){

        dom.cellSermonTitle.textContent=
            title||
            "이번 주 말씀";

    }


    if(
        dom.cellSermonBible
    ){

        dom.cellSermonBible.textContent=
            bible;


        dom.cellSermonBible.classList.toggle(
            "hidden",
            !bible
        );

    }


    if(
        dom.cellSermonSummary
    ){

        dom.cellSermonSummary.textContent=
            summary;


        dom.cellSermonSummary.classList.toggle(
            "hidden",
            !summary
        );

    }


    if(
        dom.cellSermonDate
    ){

        dom.cellSermonDate.textContent=

            clean(
                sermon.date
            )

            ||

            formatDate(

                sermon.updatedAt||

                sermon.createdAt

            );

    }


    if(
        dom.openSermonMaterialBtn
    ){

        dom.openSermonMaterialBtn
        .dataset.url=
            materialUrl;


        dom.openSermonMaterialBtn
        .classList.toggle(
            "hidden",
            !materialUrl
        );

    }


    showSection(
        dom.cellSermonCard
    );


    return true;

}


/*==================================================
LOAD MEETING MATERIALS
==================================================*/

async function loadMeetingMaterials(){

    meetingMaterials=
        await readCollectionSafe(

            "churches",
            churchId,
            "communityMaterials"

        );


    if(
        !meetingMaterials.length
    ){

        meetingMaterials=
            await readCollectionSafe(

                "churches",
                churchId,
                "cellMaterials"

            );

    }


    meetingMaterials=
        meetingMaterials
        .filter(
            item=>{

                if(
                    item.deleted===true
                ){

                    return false;

                }


                if(
                    item.visible===false
                ){

                    return false;

                }


                const type=
                    clean(
                        item.type||
                        item.category
                    ).toLowerCase();


                if(
                    !type
                ){

                    return true;

                }


                return(

                    type.includes(
                        "cell"
                    )

                    ||

                    type.includes(
                        "meeting"
                    )

                    ||

                    type.includes(
                        "small"
                    )

                    ||

                    type.includes(
                        "마을"
                    )

                    ||

                    type.includes(
                        "셀"
                    )

                    ||

                    type.includes(
                        "사랑방"
                    )

                );

            }
        )
        .sort(
            (a,b)=>{

                const order=
                    numberValue(
                        a.order
                    )
                    -
                    numberValue(
                        b.order
                    );


                if(
                    order!==0
                ){

                    return order;

                }


                return(

                    timeValue(
                        b.updatedAt||
                        b.createdAt
                    )

                    -

                    timeValue(
                        a.updatedAt||
                        a.createdAt
                    )

                );

            }
        );

}


/*==================================================
CREATE MATERIAL CARD
==================================================*/

function createMaterialCard(item){

    const card=
        document.createElement(
            "article"
        );


    card.className=
        "community-post-card";


    const top=
        document.createElement(
            "div"
        );


    top.className=
        "community-post-top";


    const category=
        document.createElement(
            "span"
        );


    category.className=
        "community-post-category";


    category.textContent=
        clean(

            item.categoryName||

            item.category

        )||
        "모임자료";


    const date=
        document.createElement(
            "span"
        );


    date.className=
        "community-post-date";


    date.textContent=

        clean(
            item.date
        )

        ||

        formatDate(

            item.updatedAt||

            item.createdAt

        );


    top.append(
        category,
        date
    );


    card.appendChild(
        top
    );


    const titleText=
        clean(
            item.title
        );


    if(
        titleText
    ){

        const title=
            document.createElement(
                "h2"
            );


        title.className=
            "community-post-title";


        title.textContent=
            titleText;


        card.appendChild(
            title
        );

    }


    const contentText=
        clean(

            item.content||

            item.text||

            item.summary||

            item.description

        );


    if(
        contentText
    ){

        const content=
            document.createElement(
                "div"
            );


        content.className=
            "community-post-content";


        content.textContent=
            contentText;


        card.appendChild(
            content
        );

    }


    const url=
        clean(

            item.url||

            item.link||

            item.materialUrl

        );


    if(
        url
    ){

        const button=
            document.createElement(
                "button"
            );


        button.type=
            "button";


        button.className=
            "community-outline-btn";


        button.textContent=
            "자료 보기";


        button.addEventListener(
            "click",
            ()=>{

                location.href=
                    url;

            }
        );


        card.appendChild(
            button
        );

    }


    return card;

}


/*==================================================
RENDER MEETING MATERIALS
==================================================*/

function renderMeetingMaterials(){

    if(
        !dom.cellMeetingGuide
    ){

        return false;

    }


    dom.cellMeetingGuide.innerHTML=
        "";


    if(
        !meetingMaterials.length
    ){

        return false;

    }


    meetingMaterials.forEach(
        item=>{

            dom.cellMeetingGuide
            .appendChild(

                createMaterialCard(
                    item
                )

            );

        }
    );


    return true;

}


/*==================================================
RENDER CELL SECTION
==================================================*/

function renderCellSection(){

    const hasSermon=
        renderCurrentSermon();


    const hasMaterial=
        renderMeetingMaterials();


    if(
        hasSermon||
        hasMaterial
    ){

        showSection(
            dom.cellMeetingSection
        );

    }else{

        hideSection(
            dom.cellMeetingSection
        );

    }

}


/*==================================================
LOAD TRAINING PROGRAMS
==================================================*/

async function loadTrainingPrograms(){

    /*
    우선 서브컬렉션 사용
    */

    trainingPrograms=
        await readCollectionSafe(

            "churches",
            churchId,
            "trainingPrograms"

        );


    /*
    아직 관리자가 서브컬렉션을 만들지 않았고
    교회문서 배열에 저장한 경우도 지원
    */

    if(
        !trainingPrograms.length&&
        Array.isArray(
            churchData.trainingPrograms
        )
    ){

        trainingPrograms=
            churchData.trainingPrograms
            .map(
                (item,index)=>({

                    id:
                        clean(item.id)||
                        `program-${index+1}`,

                    ...item

                })
            );

    }


    trainingPrograms=
        trainingPrograms
        .filter(
            item=>{

                if(
                    item.deleted===true
                ){

                    return false;

                }


                if(
                    item.visible===false
                ){

                    return false;

                }


                if(
                    item.open===false
                ){

                    return false;

                }


                if(
                    item.isOpen===false
                ){

                    return false;

                }


                return true;

            }
        )
        .sort(
            (a,b)=>{

                /*
                상단고정 먼저
                */

                if(
                    isPinned(a)!==
                    isPinned(b)
                ){

                    return isPinned(a)
                        ?-1
                        :1;

                }


                return(

                    numberValue(
                        a.order
                    )

                    -

                    numberValue(
                        b.order
                    )

                );

            }
        );

}


/*==================================================
TRAINING ICON
==================================================*/

function trainingIcon(item){

    const icon=
        clean(
            item.icon
        );


    if(
        icon
    ){

        return icon;

    }


    const text=
        clean(
            item.name||
            item.title
        );


    if(
        text.includes(
            "새가족"
        )
    ){

        return"🌱";

    }


    if(
        text.includes(
            "성경"
        )
    ){

        return"📖";

    }


    if(
        text.includes(
            "제자"
        )
    ){

        return"✝️";

    }


    if(
        text.includes(
            "사역"
        )
    ){

        return"🙏";

    }


    return"📚";

}


/*==================================================
CREATE TRAINING CARD
==================================================*/

function createTrainingCard(item){

    const card=
        document.createElement(
            "article"
        );


    card.className=
        "training-program-card";


    const icon=
        document.createElement(
            "div"
        );


    icon.className=
        "training-program-icon";


    icon.textContent=
        trainingIcon(item);


    const body=
        document.createElement(
            "div"
        );


    body.className=
        "training-program-content";


    if(
        isPinned(item)
    ){

        const fixed=
            document.createElement(
                "small"
            );


        fixed.textContent=
            "⭐ 중요 · 모집중";


        body.appendChild(
            fixed
        );

    }


    const title=
        document.createElement(
            "h3"
        );


    title.textContent=
        clean(
            item.name||
            item.title
        )||
        "훈련프로그램";


    body.appendChild(
        title
    );


    const description=
        clean(

            item.description||

            item.content||

            item.summary

        );


    if(
        description
    ){

        const text=
            document.createElement(
                "p"
            );


        text.textContent=
            description;


        body.appendChild(
            text
        );

    }


    const button=
        document.createElement(
            "button"
        );


    button.type=
        "button";


    button.className=
        "training-apply-btn";


    button.textContent=
        clean(
            item.buttonText
        )||
        "신청";


    button.addEventListener(
        "click",
        ()=>{

            openTrainingPopup(
                item
            );

        }
    );


    card.append(
        icon,
        body,
        button
    );


    return card;

}


/*==================================================
RENDER TRAINING
==================================================*/

function renderTrainingPrograms(){

    if(
        !dom.trainingProgramList
    ){

        return;

    }


    dom.trainingProgramList.innerHTML=
        "";


    if(
        !trainingPrograms.length
    ){

        hideSection(
            dom.trainingSection
        );


        return;

    }


    trainingPrograms.forEach(
        item=>{

            dom.trainingProgramList
            .appendChild(

                createTrainingCard(
                    item
                )

            );

        }
    );


    showSection(
        dom.trainingSection
    );

}


/*==================================================
TRAINING POPUP
==================================================*/

function openTrainingPopup(item){

    selectedTrainingProgram=
        item;


    const name=
        clean(
            item.name||
            item.title
        )||
        "훈련프로그램";


    if(
        dom.trainingProgramName
    ){

        dom.trainingProgramName.textContent=
            name;

    }


    if(
        dom.trainingName&&
        !dom.trainingName.value
    ){

        dom.trainingName.value=
            myRealName;

    }


    showSection(
        dom.trainingOverlay
    );

}


/*==================================================
CLOSE TRAINING POPUP
==================================================*/

function closeTrainingPopup(){

    selectedTrainingProgram=
        null;


    hideSection(
        dom.trainingOverlay
    );

}


/*==================================================
SAVE TRAINING
==================================================*/

async function saveTrainingApplication(){

    if(
        !selectedTrainingProgram
    ){

        return;

    }


    if(
        !memberNo
    ){

        showToast(
            "로그인 후 신청할 수 있습니다."
        );


        return;

    }


    const name=
        clean(
            dom.trainingName?.value
        );


    if(
        !name
    ){

        showToast(
            "이름을 입력해주세요."
        );


        return;

    }


    const programName=
        clean(

            selectedTrainingProgram.name||

            selectedTrainingProgram.title

        )||
        "훈련프로그램";


    const programId=
        clean(
            selectedTrainingProgram.id
        )||
        programName;


    const applicationRef=
        doc(

            collection(

                db,

                "churches",
                churchId,

                "trainingApplications"

            )

        );


    try{

        await setDoc(

            applicationRef,

            {

                applicationId:
                    applicationRef.id,

                churchId,

                programId,

                programName,

                memberNo,

                name,

                phone:
                    clean(
                        dom.trainingPhone?.value
                    ),

                message:
                    clean(
                        dom.trainingMessage?.value
                    ),

                status:
                    "신청",

                appliedDate:
                    getToday(),

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()

            }

        );


        showToast(
            `${programName} 신청이 접수되었습니다.`
        );


        if(
            dom.trainingMessage
        ){

            dom.trainingMessage.value="";

        }


        closeTrainingPopup();


        await loadMyTraining();


    }catch(error){

        console.error(
            "훈련 신청 오류",
            error
        );


        showToast(
            "신청을 저장하지 못했습니다."
        );

    }

}


/*==================================================
LOAD MY TRAINING
==================================================*/

async function loadMyTraining(){

    if(
        !memberNo||
        !dom.myTrainingApplications
    ){

        hideSection(
            dom.myTrainingSection
        );


        return;

    }


    const all=
        await readCollectionSafe(

            "churches",
            churchId,
            "trainingApplications"

        );


    const mine=
        all
        .filter(
            item=>

                clean(
                    item.memberNo
                )===
                memberNo

                &&

                item.deleted!==true
        )
        .sort(
            (a,b)=>

                timeValue(
                    b.createdAt
                )

                -

                timeValue(
                    a.createdAt
                )
        );


    dom.myTrainingApplications.innerHTML=
        "";


    if(
        !mine.length
    ){

        hideSection(
            dom.myTrainingSection
        );


        return;

    }


    mine.forEach(
        item=>{

            const row=
                document.createElement(
                    "article"
                );


            row.className=
                "my-training-item";


            const body=
                document.createElement(
                    "div"
                );


            const title=
                document.createElement(
                    "strong"
                );


            title.textContent=
                clean(
                    item.programName
                )||
                "훈련프로그램";


            body.appendChild(
                title
            );


            const date=
                document.createElement(
                    "small"
                );


            date.textContent=

                clean(
                    item.appliedDate
                )

                ||

                formatDate(
                    item.createdAt
                );


            body.appendChild(
                date
            );


            const status=
                document.createElement(
                    "span"
                );


            status.className=
                "my-training-status";


            status.textContent=
                clean(
                    item.status
                )||
                "신청";


            row.append(
                body,
                status
            );


            dom.myTrainingApplications
            .appendChild(
                row
            );

        }
    );


    showSection(
        dom.myTrainingSection
    );

}


/*==================================================
PINNED CARD
==================================================*/

function createPinnedCard(item){

    const card=
        document.createElement(
            "article"
        );


    card.className=
        "community-post-card";


    const top=
        document.createElement(
            "div"
        );


    top.className=
        "community-post-top";


    const category=
        document.createElement(
            "span"
        );


    category.className=
        "community-post-category";


    category.textContent=
        clean(
            item._pinnedCategory
        )||
        "중요소식";


    const date=
        document.createElement(
            "span"
        );


    date.className=
        "community-post-date";


    date.textContent=

        clean(
            item.date
        )

        ||

        formatDate(

            item.updatedAt||

            item.createdAt

        );


    top.append(
        category,
        date
    );


    card.appendChild(
        top
    );


    const titleText=
        clean(

            item.name||

            item.title||

            item.programName

        );


    if(
        titleText
    ){

        const title=
            document.createElement(
                "h2"
            );


        title.className=
            "community-post-title";


        title.textContent=
            titleText;


        card.appendChild(
            title
        );

    }


    const contentText=
        clean(

            item.description||

            item.content||

            item.text||

            item.message||

            item.summary

        );


    if(
        contentText
    ){

        const content=
            document.createElement(
                "div"
            );


        content.className=
            "community-post-content";


        content.textContent=
            contentText;


        card.appendChild(
            content
        );

    }


    return card;

}


/*==================================================
RENDER PINNED

교우소식 / 모임자료 / 훈련프로그램 중
⭐ 지정된 것을 모아 최상단에 표시
==================================================*/

function renderPinned(){

    if(
        !dom.pinnedList
    ){

        return;

    }


    const pinned=[];


    noticeItems
    .filter(
        isPinned
    )
    .forEach(
        item=>{

            pinned.push({

                ...item,

                _pinnedCategory:
                    isMemberNews(item)
                    ?"교우소식"
                    :"공지"

            });

        }
    );


    meetingMaterials
    .filter(
        isPinned
    )
    .forEach(
        item=>{

            pinned.push({

                ...item,

                _pinnedCategory:
                    "마을 · 셀 · 사랑방"

            });

        }
    );


    trainingPrograms
    .filter(
        isPinned
    )
    .forEach(
        item=>{

            pinned.push({

                ...item,

                _pinnedCategory:
                    "훈련프로그램"

            });

        }
    );


    pinned.sort(
        (a,b)=>{

            const order=
                numberValue(
                    a.pinOrder,
                    numberValue(
                        a.order
                    )
                )

                -

                numberValue(
                    b.pinOrder,
                    numberValue(
                        b.order
                    )
                );


            if(
                order!==0
            ){

                return order;

            }


            return(

                timeValue(
                    b.updatedAt||
                    b.createdAt
                )

                -

                timeValue(
                    a.updatedAt||
                    a.createdAt
                )

            );

        }
    );


    dom.pinnedList.innerHTML=
        "";


    if(
        !pinned.length
    ){

        hideSection(
            dom.pinnedSection
        );


        return;

    }


    pinned.forEach(
        item=>{

            dom.pinnedList
            .appendChild(

                createPinnedCard(
                    item
                )

            );

        }
    );


    showSection(
        dom.pinnedSection
    );

}


/*==================================================
OPEN MEMBER NEWS
==================================================*/

function openAllMemberNews(){

    location.href=

        `../chatnotice.html`+

        `?churchId=${encodeURIComponent(churchId)}`+

        `&category=memberNews`;

}


/*==================================================
OPEN SERMON MATERIAL
==================================================*/

function openSermonMaterial(){

    const url=
        clean(
            dom.openSermonMaterialBtn
            ?.dataset.url
        );


    if(
        !url
    ){

        return;

    }


    location.href=
        url;

}


/*==================================================
FELLOWSHIP

보배성도의 별도 성도교제 문자방
==================================================*/

function openFellowship(){

    location.href=

        `../chatfree.html`+

        `?churchId=${encodeURIComponent(churchId)}`+

        `&room=churchCommunity`+

        `&title=${encodeURIComponent(
            "보배성도 · 성도교제"
        )}`;

}


/*==================================================
TOAST
==================================================*/

function showToast(message){

    if(
        !dom.toast
    ){

        return;

    }


    dom.toast.textContent=
        clean(message);


    dom.toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer=
        setTimeout(
            ()=>{

                dom.toast
                ?.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/*==================================================
EVENTS
==================================================*/

function bindEvents(){

    /*==================================================
    BACK
    ==================================================*/

    dom.backBtn
    ?.addEventListener(
        "click",
        ()=>{

            if(
                history.length>1
            ){

                history.back();

            }else{

                location.href=

                    `churchmain.html`+

                    `?churchId=${encodeURIComponent(churchId)}`;

            }

        }
    );


    /*==================================================
    CHURCH HOME
    ==================================================*/

    dom.homeBtn
    ?.addEventListener(
        "click",
        ()=>{

            location.href=

                `churchmain.html`+

                `?churchId=${encodeURIComponent(churchId)}`;

        }
    );


    /*==================================================
    MEMBER NEWS
    ==================================================*/

    dom.openAllMemberNewsBtn
    ?.addEventListener(
        "click",
        openAllMemberNews
    );


    /*==================================================
    SERMON MATERIAL
    ==================================================*/

    dom.openSermonMaterialBtn
    ?.addEventListener(
        "click",
        openSermonMaterial
    );


    /*==================================================
    FELLOWSHIP
    ==================================================*/

    dom.fellowshipBtn
    ?.addEventListener(
        "click",
        openFellowship
    );


    /*==================================================
    TRAINING CLOSE
    ==================================================*/

    dom.trainingCloseBtn
    ?.addEventListener(
        "click",
        closeTrainingPopup
    );


    dom.trainingOverlay
    ?.addEventListener(
        "click",
        event=>{

            if(
                event.target===
                dom.trainingOverlay
            ){

                closeTrainingPopup();

            }

        }
    );


    /*==================================================
    TRAINING SUBMIT
    ==================================================*/

    dom.trainingSubmitBtn
    ?.addEventListener(
        "click",
        saveTrainingApplication
    );

}


/*==================================================
LOAD COMMUNITY
==================================================*/

async function loadCommunity(){

    await loadNotices();


    await loadMeetingMaterials();


    await loadTrainingPrograms();


    renderMemberNews();


    renderCellSection();


    renderTrainingPrograms();


    renderPinned();


    await loadMyTraining();

}


/*==================================================
INIT
==================================================*/

async function init(){

    resolveChurchId();


    loadLoginUser();


    loadTextSize();


    await loadUser();


    await loadChurch();


    await loadMembership();


    resolveRealName();


    loadTheme();


    renderBasic();


    bindEvents();


    await loadCommunity();

}


/*==================================================
START
==================================================*/

init().catch(
    error=>{

        console.error(
            "보배성도 초기화 오류",
            error
        );


        showToast(
            "보배성도를 불러오는 중 오류가 발생했습니다."
        );

    }
);


/*==================================================
END CHURCHCOMMUNITY.JS
==================================================*/