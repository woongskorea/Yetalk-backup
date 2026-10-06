/*==================================================
YETALK ADMIN.JS
예톡 통합관리자

CHURCH
CLINIC
FOOD
EXTRA1
EXTRA2
==================================================*/


/*==================================================
FIREBASE
==================================================*/

import{
    db,
    doc,
    setDoc,
    collection,
    getDocs,
    serverTimestamp
}from"./firebase.js";


/*==================================================
COLLECTION
==================================================*/

const USERS_COLLECTION="users";
const CHURCHES_COLLECTION="churches";
const REPORTS_COLLECTION="reports";
const PAYMENTS_COLLECTION="payments";
const FINANCE_COLLECTION="adminFinance";
const SUPPORT_COLLECTION="supportRequests";


/*==================================================
LOCAL STORAGE
==================================================*/

const ADMIN_NOTICE_KEY="yetalkAdminNotice";
const ADMIN_FINANCE_KEY="yetalkAdminFinance";


/*==================================================
BUSINESS AREA
==================================================*/

const BUSINESS_AREAS=[
    "church",
    "clinic",
    "food",
    "extra1",
    "extra2"
];

let currentBusinessArea="church";


/*==================================================
MEMBER GRADE
==================================================*/

const MEMBER_GRADES=[
    "정회원",
    "우수회원",
    "예톡1",
    "예톡2",
    "예톡3"
];

const ADMIN_GRADES=[
    "예톡1",
    "예톡2",
    "예톡3"
];

const REAL_ADMIN_GRADES=[
    "예톡2",
    "예톡3"
];


/*==================================================
PLAN
==================================================*/

const PLAN_PRICE={
    trial:0,
    minimum:0,
    lite:9900,
    basic:22000,
    premium:33000,
    mission:44000
};


/*==================================================
STATE
==================================================*/

let members=[];
let churches=[];
let reports=[];
let payments=[];
let supportRequests=[];
let financeRecords={};

let currentMemberId="";
let currentChurchId="";
let currentSupportRequestId="";

let memberFilter="all";
let churchFilter="all";
let supportFilter="pending";
let reportFilter="pending";
let financePeriod="current";

let confirmCallback=null;
let toastTimer=null;


/*==================================================
START
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    initAdmin
);


async function initAdmin(){

    bindBusinessAreas();

    bindTabs();
    bindDashboardLinks();
    bindAdminHome();

    bindTopSummary();
    bindPlanJump();

    bindMemberSearch();
    bindMemberFilters();
    bindMemberModal();

    bindChurchSearch();
    bindChurchFilters();
    bindChurchModal();

    bindSupportFilters();
    bindSupportModal();

    bindFinancePeriod();
    bindFinanceInputs();

    bindNotice();
    bindReportFilters();

    bindConfirmModal();
    bindKeyboard();

    loadLocalNotice();
    loadLocalFinance();

    setBusinessBoardDate();

    /*
    예톡 통합관리자 기본 화면은
    항상 교회
    */

    openBusinessArea(
        "church",
        false
    );

    showToast(
        "예톡 운영정보를 불러오고 있습니다."
    );

    await Promise.all([
        loadMembers(),
        loadChurches(),
        loadReports(),
        loadPayments(),
        loadSupportRequests(),
        loadFinanceRecords()
    ]);

    await syncExpiredSupports();

    renderAll();
}


/*==================================================
SHORT
==================================================*/

function $(id){

    return document.getElementById(id);
}


function $all(selector){

    return[
        ...document.querySelectorAll(selector)
    ];
}


function txt(value){

    return String(
        value??""
    ).trim();
}


function num(value){

    if(
        typeof value==="number"
    ){

        return Number.isFinite(value)
            ?value
            :0;
    }

    const cleaned=
        String(value??"")
        .replaceAll(",","")
        .replace(/[^\d.-]/g,"");

    const result=
        Number(cleaned);

    return Number.isFinite(result)
        ?result
        :0;
}


function setText(
    id,
    value
){

    const element=$(id);

    if(element){

        element.textContent=
            value??"";
    }
}


function escapeHtml(value){

    return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}


/*==================================================
MONEY
==================================================*/

function money(value){

    return(
        Math.round(
            num(value)
        )
        .toLocaleString("ko-KR")
        +"원"
    );
}


/*==================================================
DATE
==================================================*/

function toDate(value){

    if(!value){

        return null;
    }

    if(
        typeof value.toDate
        ===
        "function"
    ){

        return value.toDate();
    }

    if(
        typeof value.seconds
        ===
        "number"
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
}


function dateInputValue(value){

    if(!value){

        return"";
    }

    if(
        typeof value==="string"
        &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ){

        return value;
    }

    const date=
        toDate(value);

    if(!date){

        return"";
    }

    return(
        `${date.getFullYear()}-`
        +
        `${String(date.getMonth()+1).padStart(2,"0")}-`
        +
        `${String(date.getDate()).padStart(2,"0")}`
    );
}


function monthKey(
    date=new Date()
){

    return(
        `${date.getFullYear()}-`
        +
        `${String(date.getMonth()+1).padStart(2,"0")}`
    );
}


function previousMonthDate(){

    const now=
        new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth()-1,
        1
    );
}


function currentYear(){

    return new Date()
        .getFullYear();
}


function isSameMonth(
    date,
    base=new Date()
){

    if(!date){

        return false;
    }

    return(
        date.getFullYear()
        ===
        base.getFullYear()
        &&
        date.getMonth()
        ===
        base.getMonth()
    );
}


function defaultSupportEndDate(){

    const date=
        new Date();

    date.setMonth(
        date.getMonth()+6
    );

    return dateInputValue(date);
}


/*==================================================
TOP DATE
==================================================*/

function setBusinessBoardDate(){

    const now=
        new Date();

    setText(
        "businessBoardDate",
        `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")}`
    );
}


/*==================================================
BUSINESS NORMALIZE
==================================================*/

function normalizeBusinessArea(value){

    const raw=
        txt(value)
        .toLowerCase();

    if(
        raw==="clinic"
        ||
        raw==="medical"
        ||
        raw==="의원"
    ){

        return"clinic";
    }

    if(
        raw==="food"
        ||
        raw==="restaurant"
        ||
        raw==="식당"
    ){

        return"food";
    }

    if(raw==="extra1"){

        return"extra1";
    }

    if(raw==="extra2"){

        return"extra2";
    }

    /*
    과거 자료에는 businessArea가 없으므로
    기본 교회 자료로 판단
    */

    return"church";
}


/*==================================================
BUSINESS AREA BIND
==================================================*/

function bindBusinessAreas(){

    $all(
        "[data-business-area]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    openBusinessArea(
                        button.dataset.businessArea
                    );
                }
            );
        }
    );
}


/*==================================================
OPEN BUSINESS AREA
==================================================*/

function openBusinessArea(
    area,
    scroll=true
){

    if(
        !BUSINESS_AREAS.includes(area)
    ){

        area="church";
    }

    currentBusinessArea=area;

    closeAllSummaryDetails();

    $all(
        "[data-business-area]"
    )
    .forEach(
        button=>{

            button.classList.toggle(
                "active",
                button.dataset.businessArea===area
            );
        }
    );

    $all(
        "[data-business-panel]"
    )
    .forEach(
        panel=>{

            const active=
                panel.dataset.businessPanel
                ===
                area;

            panel.classList.toggle(
                "hidden",
                !active
            );

            panel.classList.toggle(
                "active",
                active
            );
        }
    );

    /*
    교회로 돌아오면
    운영현황 탭을 기본 표시
    */

    if(area==="church"){

        openPanel(
            "dashboardPanel",
            false
        );
    }

    if(scroll){

        setTimeout(
            ()=>{

                document
                .querySelector(
                    ".business-selector"
                )
                ?.scrollIntoView({
                    behavior:"smooth",
                    block:"start"
                });
            },
            30
        );
    }
}


/*==================================================
PLAN NORMALIZE
==================================================*/

function normalizePlanValue(
    rawValue,
    priceValue=0
){

    const raw=
        txt(rawValue)
        .toLowerCase();

    const price=
        num(priceValue);

    if(
        raw==="minimum"
        ||
        raw==="minimal"
        ||
        raw==="homepage"
        ||
        raw==="최소기능"
    ){

        return"minimum";
    }

    if(
        raw==="mission"
        ||
        raw==="missionpremium"
        ||
        raw==="mission-premium"
        ||
        raw==="선교"
        ||
        price===44000
    ){

        return"mission";
    }

    if(
        raw==="premium"
        ||
        raw==="프리미엄"
        ||
        price===33000
    ){

        return"premium";
    }

    if(
        raw==="basic"
        ||
        raw==="기본"
        ||
        price===22000
    ){

        return"basic";
    }

    /*
    과거 5,500원 / 7,700원 자료도
    현재 라이트로 인식
    */

    if(
        raw==="lite"
        ||
        raw==="light"
        ||
        raw==="라이트"
        ||
        price===9900
        ||
        price===7700
        ||
        price===5500
    ){

        return"lite";
    }

    return"trial";
}


/*==================================================
PLAN NAME
==================================================*/

function planName(plan){

    const map={
        trial:"무료체험",
        minimum:"최소기능 홈페이지",
        lite:"라이트 · 월 9,900원",
        basic:"기본 · 월 22,000원",
        premium:"프리미엄 · 월 33,000원",
        mission:"선교 프리미엄 · 월 44,000원"
    };

    return map[plan]
        ||
        "무료체험";
}


function shortPlanName(plan){

    const map={
        trial:"무료체험",
        minimum:"최소기능",
        lite:"라이트",
        basic:"기본",
        premium:"프리미엄",
        mission:"선교프리미엄"
    };

    return map[plan]
        ||
        "무료체험";
}


function planPrice(plan){

    return PLAN_PRICE[plan]
        ||
        0;
}


/*==================================================
GRADE NORMALIZE
==================================================*/

function normalizeGrade(data){

    const raw=
        txt(
            data?.baseGrade
            ||
            data?.yetalkGrade
            ||
            data?.grade
            ||
            data?.level
        );

    const lower=
        raw.toLowerCase();

    if(
        raw==="예톡3"
        ||
        lower==="yetalk3"
        ||
        lower==="admin3"
        ||
        lower==="master"
        ||
        num(data?.adminLevel)===3
    ){

        return"예톡3";
    }

    if(
        raw==="예톡2"
        ||
        lower==="yetalk2"
        ||
        lower==="admin2"
        ||
        num(data?.adminLevel)===2
    ){

        return"예톡2";
    }

    if(
        raw==="예톡1"
        ||
        lower==="yetalk1"
        ||
        lower==="admin1"
        ||
        num(data?.adminLevel)===1
    ){

        return"예톡1";
    }

    if(
        raw==="우수회원"
        ||
        lower==="excellent"
        ||
        lower==="vip"
    ){

        return"우수회원";
    }

    return"정회원";
}


/*==================================================
MEMBER STATUS
==================================================*/

function normalizeMemberStatus(data){

    const raw=
        txt(
            data?.status
            ||
            data?.memberStatus
        )
        .toLowerCase();

    if(
        raw==="restricted"
        ||
        raw==="suspended"
        ||
        raw==="blocked"
        ||
        raw==="이용중지"
    ){

        return"restricted";
    }

    if(
        raw==="withdrawn"
        ||
        raw==="deleted"
        ||
        raw==="탈퇴"
    ){

        return"withdrawn";
    }

    return"active";
}


function memberStatusName(status){

    if(status==="restricted"){

        return"이용중지";
    }

    if(status==="withdrawn"){

        return"탈퇴";
    }

    return"정상";
}


/*==================================================
MEMBER NORMALIZE
==================================================*/

function normalizeMember(
    id,
    data
){

    const realName=
        txt(
            data.name
            ||
            data.realName
            ||
            data.legalName
        );

    const nickname=
        txt(
            data.nickname
            ||
            data.displayName
            ||
            realName
            ||
            "회원"
        );

    return{

        id,

        ...data,

        memberNo:
            txt(
                data.memberNo
                ||
                data.memberNumber
                ||
                data.number
                ||
                id
            ),

        legacyMemberNo:
            txt(
                data.legacyMemberNo
            ),

        realName:
            realName
            ||
            nickname,

        nickname,

        phone:
            txt(
                data.phone
                ||
                data.phoneNumber
                ||
                data.mobile
            ),

        phoneNormalized:
            txt(
                data.phoneNormalized
                ||
                data.phone
                ||
                data.phoneNumber
                ||
                data.mobile
            )
            .replace(/[^\d]/g,""),

        baseGrade:
            normalizeGrade(data),

        status:
            normalizeMemberStatus(data),

        churchId:
            txt(
                data.churchId
                ||
                data.myChurchId
            ),

        churchName:
            txt(
                data.churchName
                ||
                data.myChurchName
            ),

        mustChangePassword:
            data.mustChangePassword
            ===
            true,

        passwordResetRequested:
            data.passwordResetRequested
            ===
            true
    };
}


/*==================================================
CHURCH STATUS
==================================================*/

function normalizeChurchStatus(data){

    const raw=
        txt(
            data.status
            ||
            data.churchStatus
        )
        .toLowerCase();

    if(
        raw==="closed"
        ||
        raw==="deleted"
        ||
        raw==="폐쇄"
    ){

        return"closed";
    }

    if(
        raw==="restricted"
        ||
        raw==="suspended"
        ||
        raw==="blocked"
        ||
        raw==="사용중지"
    ){

        return"restricted";
    }

    return"active";
}


function churchStatusName(status){

    if(status==="closed"){

        return"폐쇄";
    }

    if(status==="restricted"){

        return"사용중지";
    }

    return"정상운영";
}


/*==================================================
SUPPORT NORMALIZE
==================================================*/

function normalizeSupportStatus(data){

    const raw=
        txt(
            data.supportStatus
            ||
            data.benefitStatus
        )
        .toLowerCase();

    if(
        raw==="approved"
        ||
        raw==="active"
        ||
        raw==="지원중"
        ||
        data.freeSupport===true
    ){

        return"approved";
    }

    if(
        raw==="ended"
        ||
        raw==="expired"
        ||
        raw==="종료"
    ){

        return"ended";
    }

    return"none";
}


function normalizeSupportPlan(data){

    const raw=
        txt(
            data.supportPlan
            ||
            data.benefitPlan
        );

    if(raw){

        return normalizePlanValue(raw);
    }

    if(data.freeSupport===true){

        return"lite";
    }

    return"";
}


function supportIsActive(church){

    if(
        church.supportStatus
        !==
        "approved"
    ){

        return false;
    }

    if(!church.supportPlan){

        return false;
    }

    if(!church.supportEndDate){

        return true;
    }

    const end=
        new Date(
            `${church.supportEndDate}T23:59:59`
        );

    if(
        Number.isNaN(
            end.getTime()
        )
    ){

        return true;
    }

    return end>=new Date();
}


function supportDisplay(church){

    if(
        !supportIsActive(church)
    ){

        return"없음";
    }

    let value=
        `${shortPlanName(church.supportPlan)} 기능 지원`;

    if(church.supportEndDate){

        value+=
            ` · ${church.supportEndDate}까지`;
    }

    return value;
}


/*==================================================
CHURCH NORMALIZE
==================================================*/

function normalizeChurch(
    id,
    data
){

    let plan=
        normalizePlanValue(
            data.planCode
            ||
            data.plan
            ||
            data.pricingPlan,
            data.planPrice
            ||
            data.price
            ||
            data.monthlyPrice
        );

    const rawPlan=
        txt(
            data.planCode
            ||
            data.plan
        )
        .toLowerCase();

    if(
        rawPlan==="freesupport"
        ||
        rawPlan==="support"
    ){

        plan="trial";
    }

    return{

        id,

        ...data,

        businessArea:
            "church",

        churchId:
            txt(
                data.churchId
                ||
                id
            ),

        churchName:
            txt(
                data.churchName
                ||
                data.name
                ||
                "교회"
            ),

        pastorName:
            txt(
                data.pastorName
                ||
                data.pastor
            ),

        ownerName:
            txt(
                data.ownerName
                ||
                data.adminName
                ||
                data.creatorName
            ),

        ownerMemberNo:
            txt(
                data.ownerMemberNo
                ||
                data.creatorMemberNo
            ),

        ownerUserId:
            txt(
                data.ownerUserId
                ||
                data.ownerId
                ||
                data.creatorUserId
                ||
                data.creatorId
            ),

        memberCount:
            num(
                data.memberCount
            ),

        plan,

        status:
            normalizeChurchStatus(data),

        supportStatus:
            normalizeSupportStatus(data),

        supportPlan:
            normalizeSupportPlan(data),

        supportReason:
            txt(
                data.supportReason
                ||
                data.benefitReason
            ),

        supportEndDate:
            dateInputValue(
                data.supportEndDate
                ||
                data.benefitEndDate
            ),

        supportStartedAt:
            toDate(
                data.supportStartedAt
                ||
                data.supportApprovedAt
            ),

        supportType:
            txt(
                data.supportType
            )
    };
}


/*==================================================
LOAD MEMBERS
==================================================*/

async function loadMembers(){

    try{

        const snapshot=
            await getDocs(
                collection(
                    db,
                    USERS_COLLECTION
                )
            );

        members=
            snapshot.docs
            .map(
                item=>
                    normalizeMember(
                        item.id,
                        item.data()
                    )
            );

        members.sort(
            (a,b)=>
                a.nickname.localeCompare(
                    b.nickname,
                    "ko"
                )
        );
    }
    catch(error){

        console.error(
            "회원 불러오기 실패",
            error
        );

        members=[];
    }
}


/*==================================================
LOAD CHURCHES
==================================================*/

async function loadChurches(){

    try{

        const snapshot=
            await getDocs(
                collection(
                    db,
                    CHURCHES_COLLECTION
                )
            );

        churches=
            snapshot.docs
            .map(
                item=>
                    normalizeChurch(
                        item.id,
                        item.data()
                    )
            );

        churches.sort(
            (a,b)=>
                a.churchName.localeCompare(
                    b.churchName,
                    "ko"
                )
        );
    }
    catch(error){

        console.error(
            "교회 불러오기 실패",
            error
        );

        churches=[];
    }
}


/*==================================================
MEMBER ↔ CHURCH MANAGER
==================================================*/

function memberManagesChurch(
    member,
    church
){

    if(
        church.ownerUserId
        &&
        church.ownerUserId
        ===
        member.id
    ){

        return true;
    }

    if(
        church.ownerMemberNo
        &&
        (
            church.ownerMemberNo
            ===
            member.memberNo
            ||
            church.ownerMemberNo
            ===
            member.legacyMemberNo
        )
    ){

        return true;
    }

    /*
    과거 시험자료에
    회원번호 연결이 없는 경우만
    이름으로 보조판정
    */

    if(
        !church.ownerUserId
        &&
        !church.ownerMemberNo
        &&
        church.ownerName
    ){

        if(
            church.ownerName===member.nickname
            ||
            church.ownerName===member.realName
        ){

            return true;
        }
    }

    return false;
}


function getManagedChurches(member){

    return churches.filter(
        church=>
            church.status!=="closed"
            &&
            memberManagesChurch(
                member,
                church
            )
    );
}


/*==================================================
EFFECTIVE MEMBER GRADE
==================================================*/

function getEffectiveGrade(member){

    /*
    예톡 관리자 등급은 그대로 유지
    */

    if(
        ADMIN_GRADES.includes(
            member.baseGrade
        )
    ){

        return member.baseGrade;
    }

    if(
        member.baseGrade
        ===
        "우수회원"
    ){

        return"우수회원";
    }

    /*
    교회 총관리자에게는
    원래등급을 바꾸지 않고
    우수회원 혜택만 적용
    */

    if(
        getManagedChurches(member)
        .length>0
    ){

        return"우수회원";
    }

    return"정회원";
}


/*==================================================
MEMBER CHURCH DISPLAY
==================================================*/

function memberManagerTitle(member){

    const managed=
        getManagedChurches(member);

    if(!managed.length){

        return"";
    }

    if(managed.length===1){

        return(
            managed[0].churchName
            +
            " 총관리자"
        );
    }

    return(
        managed[0].churchName
        +
        ` 외 ${managed.length-1}곳 총관리자`
    );
}


function memberDisplayName(member){

    const managed=
        getManagedChurches(member);

    if(!managed.length){

        return member.nickname;
    }

    if(managed.length===1){

        return(
            `${member.nickname} (${managed[0].churchName})`
        );
    }

    return(
        `${member.nickname} (${managed[0].churchName} 외 ${managed.length-1}곳)`
    );
}


/*==================================================
REPORT LOAD
==================================================*/

async function loadReports(){

    try{

        const snapshot=
            await getDocs(
                collection(
                    db,
                    REPORTS_COLLECTION
                )
            );

        reports=
            snapshot.docs
            .map(
                item=>({

                    id:item.id,

                    ...item.data(),

                    businessArea:
                        normalizeBusinessArea(
                            item.data()
                            .businessArea
                            ||
                            item.data()
                            .serviceType
                        )
                })
            );
    }
    catch(error){

        console.warn(
            "신고자료 없음",
            error
        );

        reports=[];
    }
}


/*==================================================
PAYMENT
==================================================*/

function normalizePayment(
    id,
    data
){

    const amount=
        num(
            data.amount
            ||
            data.price
            ||
            data.totalAmount
            ||
            data.paymentAmount
        );

    return{

        id,

        ...data,

        businessArea:
            normalizeBusinessArea(
                data.businessArea
                ||
                data.serviceType
            ),

        churchId:
            txt(
                data.churchId
                ||
                data.churchDocId
            ),

        amount,

        plan:
            normalizePlanValue(
                data.planCode
                ||
                data.plan
                ||
                data.pricingPlan,
                amount
            ),

        paidDate:
            toDate(
                data.paidAt
                ||
                data.approvedAt
                ||
                data.completedAt
                ||
                data.createdAt
                ||
                data.date
            ),

        status:
            txt(
                data.status
                ||
                data.paymentStatus
            )
            .toLowerCase()
    };
}


function isPaidPayment(payment){

    if(!payment.paidDate){

        return false;
    }

    if(!payment.status){

        return true;
    }

    return[
        "paid",
        "completed",
        "complete",
        "success",
        "approved",
        "done",
        "결제완료"
    ]
    .includes(
        payment.status
    );
}


async function loadPayments(){

    try{

        const snapshot=
            await getDocs(
                collection(
                    db,
                    PAYMENTS_COLLECTION
                )
            );

        payments=
            snapshot.docs
            .map(
                item=>
                    normalizePayment(
                        item.id,
                        item.data()
                    )
            )
            .filter(
                isPaidPayment
            );
    }
    catch(error){

        console.warn(
            "결제자료 없음 또는 미연결",
            error
        );

        payments=[];
    }
}


/*==================================================
SUPPORT REQUEST
==================================================*/

function normalizeSupportRequestType(data){

    const raw=
        txt(
            data.requestType
            ||
            data.type
        )
        .toLowerCase();

    if(
        raw==="benefit"
        ||
        raw==="special"
        ||
        raw==="특별혜택"
        ||
        raw==="특별지원"
    ){

        return"benefit";
    }

    return"freeSupport";
}


function supportRequestTypeName(type){

    return type==="benefit"
        ?"특별혜택 요청"
        :"무료지원 요청";
}


function normalizeSupportRequestStatus(data){

    const raw=
        txt(
            data.status
            ||
            data.requestStatus
        )
        .toLowerCase();

    if(
        raw==="approved"
        ||
        raw==="active"
        ||
        raw==="승인"
    ){

        return"approved";
    }

    if(
        raw==="hold"
        ||
        raw==="보류"
    ){

        return"hold";
    }

    if(
        raw==="rejected"
        ||
        raw==="denied"
        ||
        raw==="거절"
    ){

        return"rejected";
    }

    if(
        raw==="ended"
        ||
        raw==="expired"
        ||
        raw==="종료"
    ){

        return"ended";
    }

    return"pending";
}


function normalizeSupportRequest(
    id,
    data
){

    return{

        id,

        ...data,

        businessArea:
            normalizeBusinessArea(
                data.businessArea
                ||
                data.serviceType
            ),

        churchId:
            txt(
                data.churchId
                ||
                data.churchDocId
            ),

        churchName:
            txt(
                data.churchName
                ||
                data.name
                ||
                "교회"
            ),

        pastorName:
            txt(
                data.pastorName
                ||
                data.pastor
            ),

        attendance:
            num(
                data.attendance
                ||
                data.sundayAttendance
                ||
                data.memberCount
            ),

        annualBudgetRaw:
            txt(
                data.annualBudget
                ||
                data.budget
            ),

        annualBudget:
            num(
                data.annualBudget
                ||
                data.budget
            ),

        foundedYear:
            txt(
                data.foundedYear
                ||
                data.churchFoundedYear
                ||
                data.startYear
            ),

        reason:
            txt(
                data.reason
                ||
                data.requestReason
                ||
                data.content
            ),

        requestType:
            normalizeSupportRequestType(
                data
            ),

        status:
            normalizeSupportRequestStatus(
                data
            ),

        requestedAt:
            toDate(
                data.requestedAt
                ||
                data.createdAt
            ),

        processedAt:
            toDate(
                data.processedAt
                ||
                data.approvedAt
                ||
                data.rejectedAt
            ),

        supportPlan:
            normalizePlanValue(
                data.supportPlan
                ||
                data.approvedPlan
                ||
                "lite"
            ),

        supportEndDate:
            dateInputValue(
                data.supportEndDate
            )
    };
}


async function loadSupportRequests(){

    try{

        const snapshot=
            await getDocs(
                collection(
                    db,
                    SUPPORT_COLLECTION
                )
            );

        supportRequests=
            snapshot.docs
            .map(
                item=>
                    normalizeSupportRequest(
                        item.id,
                        item.data()
                    )
            );

        supportRequests.sort(
            (a,b)=>{

                const aTime=
                    a.requestedAt
                    ?.getTime()
                    ||
                    0;

                const bTime=
                    b.requestedAt
                    ?.getTime()
                    ||
                    0;

                return bTime-aTime;
            }
        );
    }
    catch(error){

        console.warn(
            "지원요청 자료 없음",
            error
        );

        supportRequests=[];
    }
}


/*==================================================
FINANCE LOAD
==================================================*/

function loadLocalFinance(){

    const saved=
        localStorage.getItem(
            ADMIN_FINANCE_KEY
        );

    if(!saved){

        return;
    }

    try{

        const data=
            JSON.parse(saved);

        if(
            data
            &&
            typeof data==="object"
        ){

            financeRecords={
                ...financeRecords,
                ...data
            };
        }
    }
    catch(error){

        console.warn(error);
    }
}


function saveLocalFinance(){

    localStorage.setItem(
        ADMIN_FINANCE_KEY,
        JSON.stringify(
            financeRecords
        )
    );
}


async function loadFinanceRecords(){

    try{

        const snapshot=
            await getDocs(
                collection(
                    db,
                    FINANCE_COLLECTION
                )
            );

        snapshot.docs
        .forEach(
            item=>{

                financeRecords[
                    item.id
                ]={

                    ...financeRecords[
                        item.id
                    ],

                    ...item.data()
                };
            }
        );

        saveLocalFinance();
    }
    catch(error){

        console.warn(
            "Firebase 재정자료 없음",
            error
        );
    }
}


/*==================================================
FIND CHURCH
==================================================*/

function findChurchByAnyId(id){

    return churches.find(
        church=>
            church.id===id
            ||
            church.churchId===id
    );
}


/*==================================================
EXPIRED SUPPORT
==================================================*/

async function syncExpiredSupports(){

    const today=
        new Date();

    for(
        const church
        of
        churches
    ){

        if(
            church.supportStatus!=="approved"
            ||
            !church.supportEndDate
        ){

            continue;
        }

        const end=
            new Date(
                `${church.supportEndDate}T23:59:59`
            );

        if(
            Number.isNaN(
                end.getTime()
            )
            ||
            end>=today
        ){

            continue;
        }

        church.supportStatus=
            "ended";

        try{

            await setDoc(
                doc(
                    db,
                    CHURCHES_COLLECTION,
                    church.id
                ),
                {
                    supportStatus:
                        "ended",

                    supportEndedAt:
                        serverTimestamp(),

                    supportEndReason:
                        "periodEnded",

                    updatedAt:
                        serverTimestamp()
                },
                {
                    merge:true
                }
            );
        }
        catch(error){

            console.warn(
                "지원기간 종료 저장 실패",
                error
            );
        }
    }
}


/*==================================================
RENDER ALL
==================================================*/

function renderAll(){

    renderTopSummary();
    renderMemberSummary();
    renderPlanCounts();
    renderSupportSummary();
    renderDashboard();
    renderOperationChecks();

    renderMembers();
    renderChurches();
    renderSupportRequests();
    renderReports();
    renderFinance();
}


/*==================================================
TOP SUMMARY
==================================================*/

function renderTopSummary(){

    const activeMembers=
        members.filter(
            member=>
                member.status!=="withdrawn"
        );

    const activeChurches=
        churches.filter(
            church=>
                church.status!=="closed"
        );

    const pendingSupport=
        supportRequests.filter(
            request=>
                request.businessArea==="church"
                &&
                request.status==="pending"
        );

    const finance=
        calculateFinance(
            "current"
        );

    setText(
        "memberCount",
        activeMembers.length
    );

    setText(
        "churchCount",
        activeChurches.length
    );

    setText(
        "monthRevenueTop",
        money(
            finance.revenue
        )
    );

    setText(
        "supportRequestCount",
        `${pendingSupport.length}건`
    );
}


/*==================================================
MEMBER SUMMARY
==================================================*/

function renderMemberSummary(){

    const active=
        members.filter(
            member=>
                member.status!=="withdrawn"
        );

    const regular=
        active.filter(
            member=>
                getEffectiveGrade(member)
                ===
                "정회원"
        ).length;

    const excellent=
        active.filter(
            member=>
                getEffectiveGrade(member)
                ===
                "우수회원"
        ).length;

    const admins=
        active.filter(
            member=>
                ADMIN_GRADES.includes(
                    member.baseGrade
                )
        ).length;

    const restricted=
        members.filter(
            member=>
                member.status==="restricted"
        ).length;

    setText(
        "topRegularMemberCount",
        regular
    );

    setText(
        "topExcellentMemberCount",
        excellent
    );

    setText(
        "topAdminMemberCount",
        admins
    );

    setText(
        "topRestrictedMemberCount",
        restricted
    );

    const finance=
        calculateFinance(
            "current"
        );

    setText(
        "topRevenueDetail",
        money(
            finance.revenue
        )
    );

    setText(
        "topExpenseDetail",
        money(
            finance.expenseWithoutTax
        )
    );

    setText(
        "topTaxDetail",
        money(
            finance.taxReserve
        )
    );

    setText(
        "topProfitDetail",
        money(
            finance.profit
        )
    );
}


/*==================================================
PLAN COUNTS
==================================================*/

function getPlanCounts(){

    const counts={
        trial:0,
        lite:0,
        basic:0,
        premium:0,
        mission:0,
        supported:0
    };

    churches
    .filter(
        church=>
            church.status!=="closed"
    )
    .forEach(
        church=>{

            if(
                supportIsActive(church)
            ){

                counts.supported++;

                return;
            }

            if(
                counts[
                    church.plan
                ]
                !==
                undefined
            ){

                counts[
                    church.plan
                ]++;
            }
        }
    );

    return counts;
}


function renderPlanCounts(){

    const counts=
        getPlanCounts();

    setText(
        "planTrialCount",
        counts.trial
    );

    setText(
        "planLiteCount",
        counts.lite
    );

    setText(
        "planBasicCount",
        counts.basic
    );

    setText(
        "planPremiumCount",
        counts.premium
    );

    setText(
        "planMissionCount",
        counts.mission
    );

    setText(
        "planSupportCount",
        counts.supported
    );

    setText(
        "churchPlanTrialCount",
        counts.trial
    );

    setText(
        "churchPlanLiteCount",
        counts.lite
    );

    setText(
        "churchPlanBasicCount",
        counts.basic
    );

    setText(
        "churchPlanPremiumCount",
        counts.premium
    );

    setText(
        "churchPlanMissionCount",
        counts.mission
    );

    setText(
        "churchPlanSupportCount",
        counts.supported
    );

    setText(
        "dashboardLiteCount",
        counts.lite
    );

    setText(
        "dashboardBasicCount",
        counts.basic
    );

    setText(
        "dashboardPremiumCount",
        counts.premium
    );

    setText(
        "dashboardMissionCount",
        counts.mission
    );
}


/*==================================================
SUPPORT SUMMARY
==================================================*/

function churchSupportRequests(){

    return supportRequests.filter(
        request=>
            request.businessArea==="church"
    );
}


function renderSupportSummary(){

    const requests=
        churchSupportRequests();

    const pending=
        requests.filter(
            request=>
                request.status==="pending"
        );

    const freePending=
        pending.filter(
            request=>
                request.requestType
                ===
                "freeSupport"
        );

    const benefitPending=
        pending.filter(
            request=>
                request.requestType
                ===
                "benefit"
        );

    const supported=
        churches.filter(
            supportIsActive
        );

    const processedThisMonth=
        requests.filter(
            request=>
                request.processedAt
                &&
                isSameMonth(
                    request.processedAt
                )
        );

    setText(
        "freeSupportPendingCount",
        freePending.length
    );

    setText(
        "benefitPendingCount",
        benefitPending.length
    );

    setText(
        "supportedChurchCount",
        supported.length
    );

    setText(
        "supportProcessedMonthCount",
        processedThisMonth.length
    );

    setText(
        "supportPendingCount",
        pending.length
    );

    setText(
        "supportApprovedCount",
        requests.filter(
            request=>
                request.status==="approved"
        ).length
    );

    setText(
        "supportHoldCount",
        requests.filter(
            request=>
                request.status==="hold"
        ).length
    );

    setText(
        "supportEndedCount",
        requests.filter(
            request=>
                request.status==="ended"
        ).length
    );

    setText(
        "dashboardSupportRequestCount",
        `${pending.length}건`
    );
}


/*==================================================
DASHBOARD
==================================================*/

function renderDashboard(){

    const finance=
        calculateFinance(
            "current"
        );

    const now=
        new Date();

    setText(
        "dashboardMonthTitle",
        `${now.getFullYear()}년 ${now.getMonth()+1}월`
    );

    setText(
        "dashboardRevenue",
        money(
            finance.revenue
        )
    );

    setText(
        "dashboardExpense",
        money(
            finance.expenseWithoutTax
        )
    );

    setText(
        "dashboardTaxReserve",
        money(
            finance.taxReserve
        )
    );

    setText(
        "dashboardProfit",
        money(
            finance.profit
        )
    );
}


/*==================================================
OPERATION CHECK
==================================================*/

function renderOperationChecks(){

    const unresolved=
        reports.filter(
            report=>
                report.businessArea==="church"
                &&
                txt(
                    report.status
                )
                .toLowerCase()
                !==
                "resolved"
        );

    const stoppedChurches=
        churches.filter(
            church=>
                church.status==="restricted"
        );

    setText(
        "unresolvedReportCount",
        `${unresolved.length}건`
    );

    setText(
        "restrictedChurchCount",
        `${stoppedChurches.length}곳`
    );

    setText(
        "reportBadgeCount",
        unresolved.length
    );

    const health=
        getFinanceHealth(
            calculateFinance(
                "current"
            )
        );

    setText(
        "financeHealthText",
        health.title
    );
}


/*==================================================
SUMMARY
==================================================*/

function bindTopSummary(){

    $all(
        "[data-summary-detail]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    const id=
                        button.dataset.summaryDetail;

                    const target=$(id);

                    if(!target){

                        return;
                    }

                    const open=
                        !target.classList.contains(
                            "hidden"
                        );

                    closeAllSummaryDetails();

                    if(!open){

                        target.classList.remove(
                            "hidden"
                        );
                    }
                }
            );
        }
    );

    $all(
        "[data-close-summary]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    $(
                        button.dataset.closeSummary
                    )
                    ?.classList
                    .add(
                        "hidden"
                    );
                }
            );
        }
    );
}


function closeAllSummaryDetails(){

    $all(
        ".summary-detail-card"
    )
    .forEach(
        item=>
            item.classList.add(
                "hidden"
            )
    );
}


/*==================================================
PLAN JUMP
==================================================*/

function bindPlanJump(){

    $all(
        "[data-plan-jump]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    churchFilter=
                        button.dataset.planJump;

                    openPanel(
                        "churchPanel"
                    );

                    updateChurchFilterButtons();

                    renderChurches();
                }
            );
        }
    );
}


/*==================================================
TABS
==================================================*/

function bindTabs(){

    $all(
        ".admin-tab"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    openPanel(
                        button.dataset.panel
                    );
                }
            );
        }
    );
}


function openPanel(
    panelId,
    scroll=true
){

    closeAllSummaryDetails();

    $all(
        ".admin-tab"
    )
    .forEach(
        button=>{

            button.classList.toggle(
                "active",
                button.dataset.panel===panelId
            );
        }
    );

    $all(
        ".admin-panel"
    )
    .forEach(
        panel=>{

            panel.classList.toggle(
                "active",
                panel.id===panelId
            );
        }
    );

    if(panelId==="financePanel"){

        renderFinance();
    }

    if(scroll){

        setTimeout(
            ()=>{

                document
                .querySelector(
                    ".admin-tabs"
                )
                ?.scrollIntoView({
                    behavior:"smooth",
                    block:"start"
                });
            },
            30
        );
    }
}


/*==================================================
DASHBOARD LINKS
==================================================*/

function bindDashboardLinks(){

    $all(
        "[data-open-panel]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    openPanel(
                        button.dataset.openPanel
                    );
                }
            );
        }
    );
}


/*==================================================
HOME
==================================================*/

function bindAdminHome(){

    $("adminHomeButton")
    ?.addEventListener(
        "click",
        ()=>{

            location.href=
                "index.html";
        }
    );
}


/*==================================================
MEMBER SEARCH
==================================================*/

function bindMemberSearch(){

    $("memberSearch")
    ?.addEventListener(
        "input",
        renderMembers
    );
}


/*==================================================
MEMBER FILTER
==================================================*/

function bindMemberFilters(){

    $all(
        "[data-member-filter]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    memberFilter=
                        button.dataset.memberFilter;

                    $all(
                        "[data-member-filter]"
                    )
                    .forEach(
                        item=>
                            item.classList.toggle(
                                "active",
                                item===button
                            )
                    );

                    renderMembers();
                }
            );
        }
    );
}


/*==================================================
RENDER MEMBERS
==================================================*/

function renderMembers(){

    const container=
        $("memberList");

    if(!container){

        return;
    }

    const keyword=
        txt(
            $("memberSearch")
            ?.value
        )
        .toLowerCase();

    let list=[
        ...members
    ];

    if(keyword){

        list=
            list.filter(
                member=>{

                    const managed=
                        getManagedChurches(member)
                        .map(
                            church=>
                                church.churchName
                        )
                        .join(" ");

                    const target=[
                        member.realName,
                        member.nickname,
                        member.memberNo,
                        member.phone,
                        member.phoneNormalized,
                        member.churchName,
                        managed
                    ]
                    .join(" ")
                    .toLowerCase();

                    return target.includes(
                        keyword
                    );
                }
            );
    }

    if(
        memberFilter==="정회원"
        ||
        memberFilter==="우수회원"
    ){

        list=
            list.filter(
                member=>
                    getEffectiveGrade(member)
                    ===
                    memberFilter
            );
    }

    if(memberFilter==="admin"){

        list=
            list.filter(
                member=>
                    ADMIN_GRADES.includes(
                        member.baseGrade
                    )
            );
    }

    if(memberFilter==="restricted"){

        list=
            list.filter(
                member=>
                    member.status==="restricted"
            );
    }

    setText(
        "memberSearchResultCount",
        `${list.length}명`
    );

    if(!list.length){

        container.innerHTML=`
            <div class="empty-card">
                표시할 회원이 없습니다.
            </div>
        `;

        return;
    }

    container.innerHTML=
        list
        .map(
            member=>{

                const managed=
                    getManagedChurches(member);

                const effectiveGrade=
                    getEffectiveGrade(member);

                const managerBenefit=
                    managed.length>0
                    &&
                    member.baseGrade==="정회원";

                return`

                    <article class="member-item">

                        <strong>
                            👤
                            ${escapeHtml(
                                memberDisplayName(member)
                            )}
                        </strong>

                        <p>

                            실명 :
                            ${escapeHtml(
                                member.realName
                            )}

                            <br>

                            회원번호 :
                            ${escapeHtml(
                                member.memberNo
                            )}

                            ${
                                member.phone
                                ?`
                                    <br>
                                    휴대폰 :
                                    ${escapeHtml(
                                        member.phone
                                    )}
                                `
                                :""
                            }

                            <br>

                            예톡등급 :
                            <b>
                                ${escapeHtml(
                                    member.baseGrade
                                )}
                            </b>

                            ${
                                managerBenefit
                                ?`
                                    <br>
                                    혜택 :
                                    <b>
                                        교회 총관리자 · 우수회원
                                    </b>
                                `
                                :""
                            }

                            ${
                                managed.length
                                ?`
                                    <br>
                                    교회권한 :
                                    ${escapeHtml(
                                        memberManagerTitle(
                                            member
                                        )
                                    )}
                                `
                                :""
                            }

                            ${
                                effectiveGrade
                                !==
                                member.baseGrade
                                &&
                                !managerBenefit
                                ?`
                                    <br>
                                    적용등급 :
                                    ${escapeHtml(
                                        effectiveGrade
                                    )}
                                `
                                :""
                            }

                            <br>

                            상태 :
                            ${escapeHtml(
                                memberStatusName(
                                    member.status
                                )
                            )}

                        </p>

                        <div class="actions">

                            <button
                                type="button"
                                data-member-detail="${escapeHtml(member.id)}"
                            >
                                관리
                            </button>

                        </div>

                    </article>
                `;
            }
        )
        .join("");

    container
    .querySelectorAll(
        "[data-member-detail]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    openMemberDetail(
                        button.dataset.memberDetail
                    );
                }
            );
        }
    );
}


/*==================================================
MEMBER MODAL
==================================================*/

function bindMemberModal(){

    $("memberDetailCloseButton")
    ?.addEventListener(
        "click",
        closeMemberDetail
    );

    $("memberGradeSaveButton")
    ?.addEventListener(
        "click",
        saveMemberGrade
    );

    $("memberPasswordResetButton")
    ?.addEventListener(
        "click",
        requestMemberPasswordReset
    );

    $("memberRestrictButton")
    ?.addEventListener(
        "click",
        restrictCurrentMember
    );

    $("memberRestoreButton")
    ?.addEventListener(
        "click",
        restoreCurrentMember
    );

    $("memberWithdrawButton")
    ?.addEventListener(
        "click",
        withdrawCurrentMember
    );

    $("memberDetailOverlay")
    ?.addEventListener(
        "click",
        event=>{

            if(
                event.target.id
                ===
                "memberDetailOverlay"
            ){

                closeMemberDetail();
            }
        }
    );
}


/*==================================================
OPEN MEMBER
==================================================*/

function openMemberDetail(id){

    const member=
        members.find(
            item=>item.id===id
        );

    if(!member){

        return;
    }

    currentMemberId=id;

    const managed=
        getManagedChurches(member);

    const churchNames=
        managed
        .map(
            church=>
                church.churchName
        );

    if(
        member.churchName
        &&
        !churchNames.includes(
            member.churchName
        )
    ){

        churchNames.unshift(
            member.churchName
        );
    }

    setText(
        "memberDetailName",
        member.nickname
    );

    setText(
        "memberDetailRealName",
        `실명 ${member.realName}`
    );

    setText(
        "memberDetailNumber",
        `회원번호 ${member.memberNo}`
    );

    setText(
        "memberDetailNickname",
        member.nickname
    );

    setText(
        "memberDetailLegalName",
        member.realName
    );

    setText(
        "memberDetailPhone",
        member.phone
        ||
        "-"
    );

    setText(
        "memberDetailCurrentGrade",
        member.baseGrade
    );

    setText(
        "memberDetailStatus",
        memberStatusName(
            member.status
        )
    );

    setText(
        "memberDetailChurch",
        churchNames.length
        ?churchNames.join(", ")
        :"없음"
    );

    setText(
        "memberDetailChurchRole",
        managed.length
        ?"총관리자"
        :"-"
    );

    const badge=
        $("memberChurchManagerBadge");

    if(badge){

        badge.classList.toggle(
            "hidden",
            managed.length===0
        );
    }

    if(managed.length){

        setText(
            "memberChurchManagerText",
            memberManagerTitle(
                member
            )
        );
    }

    const select=
        $("memberGradeSelect");

    if(select){

        select.value=
            MEMBER_GRADES.includes(
                member.baseGrade
            )
            ?member.baseGrade
            :"정회원";
    }

    const resetButton=
        $("memberPasswordResetButton");

    if(resetButton){

        if(member.passwordResetRequested){

            resetButton.textContent=
                "비밀번호 초기화 요청됨";
        }
        else{

            resetButton.textContent=
                "비밀번호 초기화";
        }
    }

    openOverlay(
        "memberDetailOverlay"
    );
}


/*==================================================
CLOSE MEMBER
==================================================*/

function closeMemberDetail(){

    currentMemberId="";

    closeOverlay(
        "memberDetailOverlay"
    );
}


/*==================================================
SAVE MEMBER GRADE
==================================================*/

async function saveMemberGrade(){

    const member=
        members.find(
            item=>
                item.id===currentMemberId
        );

    if(!member){

        return;
    }

    const grade=
        txt(
            $("memberGradeSelect")
            ?.value
        );

    if(
        !MEMBER_GRADES.includes(
            grade
        )
    ){

        return;
    }

    /*
    예톡3은 한 명
    */

    if(grade==="예톡3"){

        const existing=
            members.find(
                item=>
                    item.id!==member.id
                    &&
                    item.baseGrade==="예톡3"
                    &&
                    item.status!=="withdrawn"
            );

        if(existing){

            showToast(
                `예톡3은 한 명만 가능합니다. 현재 ${existing.nickname}님이 예톡3입니다.`
            );

            return;
        }
    }

    /*
    예톡2도 최대 한 명
    */

    if(grade==="예톡2"){

        const existing=
            members.find(
                item=>
                    item.id!==member.id
                    &&
                    item.baseGrade==="예톡2"
                    &&
                    item.status!=="withdrawn"
            );

        if(existing){

            showToast(
                `예톡2는 최대 한 명입니다. 현재 ${existing.nickname}님이 예톡2입니다.`
            );

            return;
        }
    }

    openConfirm(
        "회원 등급 변경",
        `${member.nickname}님의 예톡등급을 '${grade}'(으)로 변경하시겠습니까?`,
        async()=>{

            try{

                await setDoc(
                    doc(
                        db,
                        USERS_COLLECTION,
                        member.id
                    ),
                    {
                        baseGrade:grade,
                        yetalkGrade:grade,
                        grade,

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge:true
                    }
                );

                member.baseGrade=
                    grade;

                setText(
                    "memberDetailCurrentGrade",
                    grade
                );

                renderAll();

                showToast(
                    "회원 등급을 변경했습니다."
                );
            }
            catch(error){

                console.error(error);

                showToast(
                    "등급 변경에 실패했습니다."
                );
            }
        }
    );
}


/*==================================================
PASSWORD RESET REQUEST
==================================================*/

async function requestMemberPasswordReset(){

    const member=
        members.find(
            item=>
                item.id===currentMemberId
        );

    if(!member){

        return;
    }

    /*
    중요:
    password:"1111" 같은 원문 비밀번호는
    Firestore에 저장하지 않는다.

    지금은 초기화 요청 상태만 저장하고
    가입/로그인 구조 수정 시
    인증 시스템과 연결한다.
    */

    openConfirm(
        "비밀번호 초기화",
        `${member.nickname}님의 비밀번호를 초기화하시겠습니까?\n로그인 시스템 연결 후 임시번호 1111 → 새 비밀번호 변경 방식으로 작동합니다.`,
        async()=>{

            try{

                await setDoc(
                    doc(
                        db,
                        USERS_COLLECTION,
                        member.id
                    ),
                    {
                        passwordResetRequested:true,

                        mustChangePassword:true,

                        passwordResetAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge:true
                    }
                );

                member.passwordResetRequested=
                    true;

                member.mustChangePassword=
                    true;

                if(
                    $("memberPasswordResetButton")
                ){

                    $("memberPasswordResetButton")
                    .textContent=
                        "비밀번호 초기화 요청됨";
                }

                showToast(
                    "비밀번호 초기화 요청을 저장했습니다."
                );
            }
            catch(error){

                console.error(error);

                showToast(
                    "비밀번호 초기화 요청 저장에 실패했습니다."
                );
            }
        }
    );
}


/*==================================================
MEMBER STATUS
==================================================*/

async function setMemberStatus(status){

    const member=
        members.find(
            item=>
                item.id===currentMemberId
        );

    if(!member){

        return;
    }

    try{

        const data={
            status,
            updatedAt:
                serverTimestamp()
        };

        if(status==="restricted"){

            data.restrictedAt=
                serverTimestamp();
        }

        if(status==="withdrawn"){

            data.withdrawnAt=
                serverTimestamp();
        }

        if(status==="active"){

            data.restoredAt=
                serverTimestamp();
        }

        await setDoc(
            doc(
                db,
                USERS_COLLECTION,
                member.id
            ),
            data,
            {
                merge:true
            }
        );

        member.status=status;

        setText(
            "memberDetailStatus",
            memberStatusName(status)
        );

        renderAll();

        showToast(
            "회원 상태를 변경했습니다."
        );
    }
    catch(error){

        console.error(error);

        showToast(
            "회원 상태 변경에 실패했습니다."
        );
    }
}


function restrictCurrentMember(){

    const member=
        members.find(
            item=>item.id===currentMemberId
        );

    if(!member){

        return;
    }

    openConfirm(
        "회원 이용중지",
        `${member.nickname}님의 예톡 이용을 중지하시겠습니까?`,
        ()=>setMemberStatus(
            "restricted"
        )
    );
}


function restoreCurrentMember(){

    const member=
        members.find(
            item=>item.id===currentMemberId
        );

    if(!member){

        return;
    }

    openConfirm(
        "회원 이용복구",
        `${member.nickname}님의 이용상태를 정상으로 복구하시겠습니까?`,
        ()=>setMemberStatus(
            "active"
        )
    );
}


function withdrawCurrentMember(){

    const member=
        members.find(
            item=>item.id===currentMemberId
        );

    if(!member){

        return;
    }

    openConfirm(
        "회원 탈퇴처리",
        `${member.nickname}님을 탈퇴 상태로 변경하시겠습니까?\n데이터는 즉시 완전삭제하지 않습니다.`,
        ()=>setMemberStatus(
            "withdrawn"
        )
    );
}


/*==================================================
CHURCH SEARCH
==================================================*/

function bindChurchSearch(){

    $("churchSearch")
    ?.addEventListener(
        "input",
        renderChurches
    );
}


/*==================================================
CHURCH FILTER
==================================================*/

function bindChurchFilters(){

    $all(
        "[data-church-filter]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    churchFilter=
                        button.dataset.churchFilter;

                    updateChurchFilterButtons();

                    renderChurches();
                }
            );
        }
    );
}


function updateChurchFilterButtons(){

    $all(
        "[data-church-filter]"
    )
    .forEach(
        button=>{

            button.classList.toggle(
                "active",
                button.dataset.churchFilter
                ===
                churchFilter
            );
        }
    );
}


/*==================================================
CHURCH STATS
==================================================*/

function renderChurchStats(){

    const total=
        churches.length;

    const paid=
        churches.filter(
            church=>
                !supportIsActive(church)
                &&
                church.status!=="closed"
                &&
                [
                    "lite",
                    "basic",
                    "premium",
                    "mission"
                ]
                .includes(
                    church.plan
                )
        ).length;

    const trial=
        churches.filter(
            church=>
                !supportIsActive(church)
                &&
                church.status!=="closed"
                &&
                church.plan==="trial"
        ).length;

    const stopped=
        churches.filter(
            church=>
                church.status==="restricted"
                ||
                church.status==="closed"
        ).length;

    setText(
        "churchTotalCount",
        total
    );

    setText(
        "churchPaidCount",
        paid
    );

    setText(
        "churchTrialCount",
        trial
    );

    setText(
        "churchStoppedCount",
        stopped
    );
}


/*==================================================
RENDER CHURCHES
==================================================*/

function renderChurches(){

    renderChurchStats();

    const container=
        $("churchList");

    if(!container){

        return;
    }

    const keyword=
        txt(
            $("churchSearch")
            ?.value
        )
        .toLowerCase();

    let list=[
        ...churches
    ];

    if(keyword){

        list=
            list.filter(
                church=>{

                    const target=[
                        church.churchName,
                        church.pastorName,
                        church.ownerName,
                        church.ownerMemberNo,
                        church.churchId
                    ]
                    .join(" ")
                    .toLowerCase();

                    return target.includes(
                        keyword
                    );
                }
            );
    }

    if(
        [
            "trial",
            "lite",
            "basic",
            "premium",
            "mission"
        ]
        .includes(
            churchFilter
        )
    ){

        list=
            list.filter(
                church=>
                    !supportIsActive(church)
                    &&
                    church.plan===churchFilter
            );
    }

    if(churchFilter==="supported"){

        list=
            list.filter(
                supportIsActive
            );
    }

    if(churchFilter==="restricted"){

        list=
            list.filter(
                church=>
                    church.status==="restricted"
            );
    }

    if(churchFilter==="closed"){

        list=
            list.filter(
                church=>
                    church.status==="closed"
            );
    }

    setText(
        "churchSearchResultCount",
        `${list.length}곳`
    );

    if(!list.length){

        container.innerHTML=`
            <div class="empty-card">
                표시할 교회가 없습니다.
            </div>
        `;

        return;
    }

    container.innerHTML=
        list
        .map(
            church=>`

                <article class="church-item">

                    <strong>
                        ⛪
                        ${escapeHtml(
                            church.churchName
                        )}
                    </strong>

                    <p>

                        담임목사 :
                        ${escapeHtml(
                            church.pastorName
                            ||
                            "-"
                        )}

                        <br>

                        총관리자 :
                        ${escapeHtml(
                            church.ownerName
                            ||
                            church.ownerMemberNo
                            ||
                            "-"
                        )}

                        <br>

                        요금제 :
                        <b>
                            ${escapeHtml(
                                planName(
                                    church.plan
                                )
                            )}
                        </b>

                        <br>

                        상태 :
                        ${escapeHtml(
                            churchStatusName(
                                church.status
                            )
                        )}

                        ${
                            supportIsActive(church)
                            ?`
                                <br>
                                ♡ 지원 :
                                <b>
                                    ${escapeHtml(
                                        supportDisplay(
                                            church
                                        )
                                    )}
                                </b>
                            `
                            :""
                        }

                    </p>

                    <div class="actions">

                        <button
                            type="button"
                            data-church-detail="${escapeHtml(church.id)}"
                        >
                            관리
                        </button>

                    </div>

                </article>
            `
        )
        .join("");

    container
    .querySelectorAll(
        "[data-church-detail]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    openChurchDetail(
                        button.dataset.churchDetail
                    );
                }
            );
        }
    );
}


/*==================================================
CHURCH MODAL
==================================================*/

function bindChurchModal(){

    $("churchDetailCloseButton")
    ?.addEventListener(
        "click",
        closeChurchDetail
    );

    $("churchPlanSaveButton")
    ?.addEventListener(
        "click",
        saveChurchPlan
    );

    $("churchSupportSaveButton")
    ?.addEventListener(
        "click",
        saveChurchSupport
    );

    $("churchOpenButton")
    ?.addEventListener(
        "click",
        openCurrentChurchHome
    );

    $("churchAdminOpenButton")
    ?.addEventListener(
        "click",
        openCurrentChurchAdmin
    );

    $("churchRestrictButton")
    ?.addEventListener(
        "click",
        restrictCurrentChurch
    );

    $("churchRestoreButton")
    ?.addEventListener(
        "click",
        restoreCurrentChurch
    );

    $("churchCloseButton")
    ?.addEventListener(
        "click",
        closeCurrentChurch
    );

    $("churchDetailOverlay")
    ?.addEventListener(
        "click",
        event=>{

            if(
                event.target.id
                ===
                "churchDetailOverlay"
            ){

                closeChurchDetail();
            }
        }
    );
}


function openChurchDetail(id){

    const church=
        findChurchByAnyId(id);

    if(!church){

        return;
    }

    currentChurchId=
        church.id;

    setText(
        "churchDetailName",
        church.churchName
    );

    setText(
        "churchDetailId",
        church.churchId
    );

    setText(
        "churchDetailPastor",
        church.pastorName
        ||
        "-"
    );

    setText(
        "churchDetailOwner",
        church.ownerName
        ||
        church.ownerMemberNo
        ||
        "-"
    );

    setText(
        "churchDetailMemberCount",
        `${church.memberCount||0}명`
    );

    setText(
        "churchDetailStatus",
        churchStatusName(
            church.status
        )
    );

    setText(
        "churchDetailSupportStatus",
        supportDisplay(
            church
        )
    );

    if(
        $("churchPlanSelect")
    ){

        $("churchPlanSelect").value=
            church.plan;
    }

    if(
        $("churchSupportPlanSelect")
    ){

        $("churchSupportPlanSelect").value=
            supportIsActive(church)
            ?church.supportPlan
            :"none";
    }

    if(
        $("churchSupportReason")
    ){

        $("churchSupportReason").value=
            church.supportReason
            ||
            "";
    }

    if(
        $("churchSupportEndDate")
    ){

        $("churchSupportEndDate").value=
            supportIsActive(church)
            ?church.supportEndDate
            :defaultSupportEndDate();
    }

    openOverlay(
        "churchDetailOverlay"
    );
}


function closeChurchDetail(){

    currentChurchId="";

    closeOverlay(
        "churchDetailOverlay"
    );
}


/*==================================================
SAVE CHURCH PLAN
==================================================*/

async function saveChurchPlan(){

    const church=
        findChurchByAnyId(
            currentChurchId
        );

    if(!church){

        return;
    }

    const plan=
        txt(
            $("churchPlanSelect")
            ?.value
        );

    if(
        ![
            "trial",
            "minimum",
            "lite",
            "basic",
            "premium",
            "mission"
        ]
        .includes(plan)
    ){

        return;
    }

    openConfirm(
        "교회 요금제 변경",
        `${church.churchName}의 정상 요금제를 '${planName(plan)}'(으)로 변경하시겠습니까?`,
        async()=>{

            try{

                await setDoc(
                    doc(
                        db,
                        CHURCHES_COLLECTION,
                        church.id
                    ),
                    {
                        planCode:plan,
                        plan,

                        planPrice:
                            planPrice(plan),

                        planUpdatedAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge:true
                    }
                );

                church.plan=plan;

                renderAll();

                openChurchDetail(
                    church.id
                );

                showToast(
                    "교회 요금제를 저장했습니다."
                );
            }
            catch(error){

                console.error(error);

                showToast(
                    "요금제 저장에 실패했습니다."
                );
            }
        }
    );
}


/*==================================================
SPECIAL SUPPORT
==================================================*/

async function saveChurchSupport(){

    const church=
        findChurchByAnyId(
            currentChurchId
        );

    if(!church){

        return;
    }

    const supportPlan=
        txt(
            $("churchSupportPlanSelect")
            ?.value
        );

    const reason=
        txt(
            $("churchSupportReason")
            ?.value
        );

    const endDate=
        txt(
            $("churchSupportEndDate")
            ?.value
        );

    if(supportPlan==="none"){

        openConfirm(
            "특별지원 종료",
            `${church.churchName}의 특별지원을 종료하시겠습니까?`,
            async()=>{

                try{

                    await setDoc(
                        doc(
                            db,
                            CHURCHES_COLLECTION,
                            church.id
                        ),
                        {
                            supportStatus:
                                "ended",

                            supportPlan:
                                "",

                            supportEndedAt:
                                serverTimestamp(),

                            supportEndReason:
                                "admin",

                            updatedAt:
                                serverTimestamp()
                        },
                        {
                            merge:true
                        }
                    );

                    church.supportStatus=
                        "ended";

                    church.supportPlan=
                        "";

                    renderAll();

                    openChurchDetail(
                        church.id
                    );

                    showToast(
                        "특별지원을 종료했습니다."
                    );
                }
                catch(error){

                    console.error(error);

                    showToast(
                        "지원 종료에 실패했습니다."
                    );
                }
            }
        );

        return;
    }

    if(
        ![
            "lite",
            "basic",
            "premium",
            "mission"
        ]
        .includes(
            supportPlan
        )
    ){

        return;
    }

    if(!endDate){

        showToast(
            "지원 종료일을 선택해 주세요."
        );

        return;
    }

    openConfirm(
        "특별지원 적용",
        `${church.churchName}에 '${shortPlanName(supportPlan)} 기능 지원'을 적용하시겠습니까?`,
        async()=>{

            try{

                await setDoc(
                    doc(
                        db,
                        CHURCHES_COLLECTION,
                        church.id
                    ),
                    {
                        supportStatus:
                            "approved",

                        supportType:
                            "manual",

                        supportPlan,

                        supportReason:
                            reason,

                        supportEndDate:
                            endDate,

                        supportStartedAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge:true
                    }
                );

                church.supportStatus=
                    "approved";

                church.supportPlan=
                    supportPlan;

                church.supportReason=
                    reason;

                church.supportEndDate=
                    endDate;

                church.supportStartedAt=
                    new Date();

                renderAll();

                openChurchDetail(
                    church.id
                );

                showToast(
                    "특별지원을 적용했습니다."
                );
            }
            catch(error){

                console.error(error);

                showToast(
                    "특별지원 저장에 실패했습니다."
                );
            }
        }
    );
}


/*==================================================
CHURCH STATUS
==================================================*/

async function setChurchStatus(status){

    const church=
        findChurchByAnyId(
            currentChurchId
        );

    if(!church){

        return;
    }

    try{

        const data={
            status,

            updatedAt:
                serverTimestamp()
        };

        if(status==="restricted"){

            data.restrictedAt=
                serverTimestamp();
        }

        if(status==="closed"){

            data.closedAt=
                serverTimestamp();
        }

        if(status==="active"){

            data.restoredAt=
                serverTimestamp();
        }

        await setDoc(
            doc(
                db,
                CHURCHES_COLLECTION,
                church.id
            ),
            data,
            {
                merge:true
            }
        );

        church.status=status;

        setText(
            "churchDetailStatus",
            churchStatusName(status)
        );

        renderAll();

        showToast(
            "교회 상태를 변경했습니다."
        );
    }
    catch(error){

        console.error(error);

        showToast(
            "교회 상태 변경에 실패했습니다."
        );
    }
}


function restrictCurrentChurch(){

    const church=
        findChurchByAnyId(
            currentChurchId
        );

    if(!church){

        return;
    }

    openConfirm(
        "교회방 사용중지",
        `${church.churchName} 교회방 사용을 중지하시겠습니까?`,
        ()=>setChurchStatus(
            "restricted"
        )
    );
}


function restoreCurrentChurch(){

    const church=
        findChurchByAnyId(
            currentChurchId
        );

    if(!church){

        return;
    }

    openConfirm(
        "교회방 이용복구",
        `${church.churchName}을 정상운영 상태로 복구하시겠습니까?`,
        ()=>setChurchStatus(
            "active"
        )
    );
}


function closeCurrentChurch(){

    const church=
        findChurchByAnyId(
            currentChurchId
        );

    if(!church){

        return;
    }

    openConfirm(
        "교회방 폐쇄",
        `${church.churchName} 교회방을 폐쇄하시겠습니까?\n데이터는 즉시 완전삭제하지 않습니다.`,
        ()=>setChurchStatus(
            "closed"
        )
    );
}


function openCurrentChurchHome(){

    if(!currentChurchId){

        return;
    }

    location.href=
        `churchmain.html?churchId=${encodeURIComponent(currentChurchId)}`;
}


function openCurrentChurchAdmin(){

    if(!currentChurchId){

        return;
    }

    location.href=
        `churchadmin.html?churchId=${encodeURIComponent(currentChurchId)}`;
}


/*==================================================
SUPPORT FILTER
==================================================*/

function bindSupportFilters(){

    $all(
        "[data-support-filter]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    supportFilter=
                        button.dataset.supportFilter;

                    $all(
                        "[data-support-filter]"
                    )
                    .forEach(
                        item=>
                            item.classList.toggle(
                                "active",
                                item===button
                            )
                    );

                    renderSupportRequests();
                }
            );
        }
    );
}


/*==================================================
SUPPORT LIST
==================================================*/

function renderSupportRequests(){

    const container=
        $("supportRequestList");

    if(!container){

        return;
    }

    let list=
        churchSupportRequests();

    if(supportFilter!=="all"){

        list=
            list.filter(
                request=>
                    request.status
                    ===
                    supportFilter
            );
    }

    if(!list.length){

        container.innerHTML=`
            <div class="empty-card">
                현재 표시할 지원 요청이 없습니다.
            </div>
        `;

        return;
    }

    container.innerHTML=
        list
        .map(
            request=>{

                let statusName="확인대기";

                if(request.status==="approved"){
                    statusName="지원중";
                }

                if(request.status==="hold"){
                    statusName="보류";
                }

                if(request.status==="rejected"){
                    statusName="거절";
                }

                if(request.status==="ended"){
                    statusName="종료";
                }

                return`

                    <article class="support-request-item">

                        <strong>
                            ♡
                            ${escapeHtml(
                                request.churchName
                            )}
                        </strong>

                        <p>

                            ${escapeHtml(
                                supportRequestTypeName(
                                    request.requestType
                                )
                            )}

                            ·
                            ${escapeHtml(statusName)}

                            <br>

                            주일 출석 :
                            ${request.attendance.toLocaleString("ko-KR")}명

                            ${
                                request.annualBudgetRaw
                                ?`
                                    <br>
                                    연간 예산 :
                                    ${escapeHtml(
                                        request.annualBudget
                                        ?money(
                                            request.annualBudget
                                        )
                                        :request.annualBudgetRaw
                                    )}
                                `
                                :""
                            }

                            ${
                                request.reason
                                ?`
                                    <br>
                                    신청사유 :
                                    ${escapeHtml(
                                        request.reason.length>45
                                        ?request.reason.slice(0,45)+"…"
                                        :request.reason
                                    )}
                                `
                                :""
                            }

                        </p>

                        <div class="actions">

                            <button
                                type="button"
                                data-support-detail="${escapeHtml(request.id)}"
                            >
                                요청서 보기
                            </button>

                        </div>

                    </article>
                `;
            }
        )
        .join("");

    container
    .querySelectorAll(
        "[data-support-detail]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    openSupportDetail(
                        button.dataset.supportDetail
                    );
                }
            );
        }
    );
}


/*==================================================
SUPPORT MODAL
==================================================*/

function bindSupportModal(){

    $("supportDetailCloseButton")
    ?.addEventListener(
        "click",
        closeSupportDetail
    );

    $("supportApproveButton")
    ?.addEventListener(
        "click",
        approveSupportRequest
    );

    $("supportHoldButton")
    ?.addEventListener(
        "click",
        holdSupportRequest
    );

    $("supportRejectButton")
    ?.addEventListener(
        "click",
        rejectSupportRequest
    );

    $("supportDetailOverlay")
    ?.addEventListener(
        "click",
        event=>{

            if(
                event.target.id
                ===
                "supportDetailOverlay"
            ){

                closeSupportDetail();
            }
        }
    );
}


function openSupportDetail(id){

    const request=
        supportRequests.find(
            item=>item.id===id
        );

    if(!request){

        return;
    }

    currentSupportRequestId=id;

    setText(
        "supportDetailChurchName",
        request.churchName
    );

    setText(
        "supportDetailRequestType",
        supportRequestTypeName(
            request.requestType
        )
    );

    setText(
        "supportDetailPastor",
        request.pastorName
        ||
        "-"
    );

    setText(
        "supportDetailAttendance",
        `${request.attendance.toLocaleString("ko-KR")}명`
    );

    setText(
        "supportDetailBudget",
        request.annualBudget
        ?money(
            request.annualBudget
        )
        :(
            request.annualBudgetRaw
            ||
            "-"
        )
    );

    setText(
        "supportDetailFoundedYear",
        request.foundedYear
        ||
        "-"
    );

    setText(
        "supportDetailReason",
        request.reason
        ||
        "-"
    );

    if(
        $("supportApprovePlanSelect")
    ){

        $("supportApprovePlanSelect").value=
            [
                "lite",
                "basic",
                "premium",
                "mission"
            ]
            .includes(
                request.supportPlan
            )
            ?request.supportPlan
            :"lite";
    }

    if(
        $("supportApproveEndDate")
    ){

        $("supportApproveEndDate").value=
            request.supportEndDate
            ||
            defaultSupportEndDate();
    }

    openOverlay(
        "supportDetailOverlay"
    );
}


function closeSupportDetail(){

    currentSupportRequestId="";

    closeOverlay(
        "supportDetailOverlay"
    );
}


/*==================================================
APPROVE SUPPORT
==================================================*/

async function approveSupportRequest(){

    const request=
        supportRequests.find(
            item=>
                item.id
                ===
                currentSupportRequestId
        );

    if(!request){

        return;
    }

    const plan=
        txt(
            $("supportApprovePlanSelect")
            ?.value
        );

    const endDate=
        txt(
            $("supportApproveEndDate")
            ?.value
        );

    if(!endDate){

        showToast(
            "지원 종료일을 선택해 주세요."
        );

        return;
    }

    const church=
        findChurchByAnyId(
            request.churchId
        );

    openConfirm(
        "지원 승인",
        `${request.churchName}에 '${shortPlanName(plan)} 기능 지원'을 승인하시겠습니까?`,
        async()=>{

            try{

                await setDoc(
                    doc(
                        db,
                        SUPPORT_COLLECTION,
                        request.id
                    ),
                    {
                        status:
                            "approved",

                        supportPlan:
                            plan,

                        supportEndDate:
                            endDate,

                        approvedAt:
                            serverTimestamp(),

                        processedAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge:true
                    }
                );

                request.status=
                    "approved";

                request.supportPlan=
                    plan;

                request.supportEndDate=
                    endDate;

                request.processedAt=
                    new Date();

                if(church){

                    await setDoc(
                        doc(
                            db,
                            CHURCHES_COLLECTION,
                            church.id
                        ),
                        {
                            supportStatus:
                                "approved",

                            supportType:
                                request.requestType,

                            supportPlan:
                                plan,

                            supportReason:
                                request.reason,

                            supportRequestId:
                                request.id,

                            supportEndDate:
                                endDate,

                            supportStartedAt:
                                serverTimestamp(),

                            updatedAt:
                                serverTimestamp()
                        },
                        {
                            merge:true
                        }
                    );

                    church.supportStatus=
                        "approved";

                    church.supportType=
                        request.requestType;

                    church.supportPlan=
                        plan;

                    church.supportReason=
                        request.reason;

                    church.supportEndDate=
                        endDate;

                    church.supportStartedAt=
                        new Date();
                }

                closeSupportDetail();

                renderAll();

                showToast(
                    "지원 요청을 승인했습니다."
                );
            }
            catch(error){

                console.error(error);

                showToast(
                    "지원 승인에 실패했습니다."
                );
            }
        }
    );
}


/*==================================================
HOLD SUPPORT
==================================================*/

async function holdSupportRequest(){

    const request=
        supportRequests.find(
            item=>
                item.id===currentSupportRequestId
        );

    if(!request){

        return;
    }

    openConfirm(
        "지원 요청 보류",
        `${request.churchName}의 지원 요청을 보류하시겠습니까?`,
        async()=>{

            try{

                await setDoc(
                    doc(
                        db,
                        SUPPORT_COLLECTION,
                        request.id
                    ),
                    {
                        status:
                            "hold",

                        processedAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge:true
                    }
                );

                request.status=
                    "hold";

                request.processedAt=
                    new Date();

                closeSupportDetail();

                renderAll();

                showToast(
                    "지원 요청을 보류했습니다."
                );
            }
            catch(error){

                console.error(error);

                showToast(
                    "보류 처리에 실패했습니다."
                );
            }
        }
    );
}


/*==================================================
REJECT SUPPORT
==================================================*/

async function rejectSupportRequest(){

    const request=
        supportRequests.find(
            item=>
                item.id===currentSupportRequestId
        );

    if(!request){

        return;
    }

    openConfirm(
        "지원 요청 거절",
        `${request.churchName}의 지원 요청을 거절하시겠습니까?`,
        async()=>{

            try{

                await setDoc(
                    doc(
                        db,
                        SUPPORT_COLLECTION,
                        request.id
                    ),
                    {
                        status:
                            "rejected",

                        rejectedAt:
                            serverTimestamp(),

                        processedAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge:true
                    }
                );

                request.status=
                    "rejected";

                request.processedAt=
                    new Date();

                closeSupportDetail();

                renderAll();

                showToast(
                    "지원 요청을 거절했습니다."
                );
            }
            catch(error){

                console.error(error);

                showToast(
                    "거절 처리에 실패했습니다."
                );
            }
        }
    );
}


/*==================================================
FINANCE
==================================================*/

function isDateInPeriod(
    date,
    period
){

    if(!date){

        return false;
    }

    const now=
        new Date();

    if(period==="current"){

        return(
            date.getFullYear()
            ===
            now.getFullYear()
            &&
            date.getMonth()
            ===
            now.getMonth()
        );
    }

    if(period==="previous"){

        const previous=
            previousMonthDate();

        return(
            date.getFullYear()
            ===
            previous.getFullYear()
            &&
            date.getMonth()
            ===
            previous.getMonth()
        );
    }

    if(period==="year"){

        return(
            date.getFullYear()
            ===
            now.getFullYear()
        );
    }

    return false;
}


function getRevenueData(period){

    const result={
        lite:0,
        basic:0,
        premium:0,
        mission:0,
        total:0
    };

    payments
    .filter(
        payment=>
            payment.businessArea==="church"
            &&
            isDateInPeriod(
                payment.paidDate,
                period
            )
    )
    .forEach(
        payment=>{

            result.total+=
                payment.amount;

            if(
                result[
                    payment.plan
                ]
                !==
                undefined
            ){

                result[
                    payment.plan
                ]+=
                    payment.amount;
            }
        }
    );

    return result;
}


function financeKeyForPeriod(period){

    if(period==="current"){

        return(
            "church-"
            +
            monthKey(
                new Date()
            )
        );
    }

    if(period==="previous"){

        return(
            "church-"
            +
            monthKey(
                previousMonthDate()
            )
        );
    }

    return null;
}


function emptyFinanceRecord(){

    return{
        firebase:0,
        voice:0,
        ai:0,
        payment:0,
        etc:0,
        taxReserve:0
    };
}


function getMonthFinanceRecord(key){

    /*
    새 통합형 key가 없으면
    과거 yyyy-mm 자료도 호환
    */

    if(
        financeRecords[key]
    ){

        return{
            ...emptyFinanceRecord(),
            ...financeRecords[key]
        };
    }

    const oldKey=
        key?.replace(
            "church-",
            ""
        );

    return{
        ...emptyFinanceRecord(),
        ...(
            financeRecords[
                oldKey
            ]
            ||
            {}
        )
    };
}


function getYearFinanceRecord(){

    const year=
        String(
            currentYear()
        );

    const result=
        emptyFinanceRecord();

    Object.entries(
        financeRecords
    )
    .forEach(
        ([
            key,
            record
        ])=>{

            const isChurchKey=
                key.startsWith(
                    `church-${year}-`
                );

            const isOldKey=
                key.startsWith(
                    `${year}-`
                );

            if(
                !isChurchKey
                &&
                !isOldKey
            ){

                return;
            }

            result.firebase+=
                num(record.firebase);

            result.voice+=
                num(record.voice);

            result.ai+=
                num(record.ai);

            result.payment+=
                num(record.payment);

            result.etc+=
                num(record.etc);

            result.taxReserve+=
                num(record.taxReserve);
        }
    );

    return result;
}


function calculateFinance(period){

    const revenueData=
        getRevenueData(period);

    let expenseRecord;

    if(period==="year"){

        expenseRecord=
            getYearFinanceRecord();
    }
    else{

        expenseRecord=
            getMonthFinanceRecord(
                financeKeyForPeriod(
                    period
                )
            );
    }

    const expenseWithoutTax=
        num(expenseRecord.firebase)
        +
        num(expenseRecord.voice)
        +
        num(expenseRecord.ai)
        +
        num(expenseRecord.payment)
        +
        num(expenseRecord.etc);

    const taxReserve=
        num(
            expenseRecord.taxReserve
        );

    const totalExpense=
        expenseWithoutTax
        +
        taxReserve;

    const profit=
        revenueData.total
        -
        totalExpense;

    return{
        revenue:
            revenueData.total,

        revenueData,
        expenseRecord,
        expenseWithoutTax,
        taxReserve,
        totalExpense,
        profit
    };
}


function getFinanceHealth(finance){

    if(finance.revenue<=0){

        return{
            type:"warning",
            icon:"?",
            title:"매출 확인",
            description:
                "아직 결제 매출자료가 없거나 결제시스템이 연결되지 않았습니다."
        };
    }

    const ratio=
        finance.totalExpense
        /
        finance.revenue;

    if(
        finance.profit<0
        ||
        ratio>=1
    ){

        return{
            type:"danger",
            icon:"!",
            title:"지출 점검",
            description:
                "예상 지출이 매출보다 크거나 비슷합니다."
        };
    }

    if(ratio>=0.7){

        return{
            type:"warning",
            icon:"!",
            title:"주의",
            description:
                "운영은 가능하지만 매출 대비 비용비율이 높습니다."
        };
    }

    return{
        type:"good",
        icon:"✓",
        title:"양호",
        description:
            "현재 매출과 예상지출을 기준으로 안정적인 운영상태입니다."
    };
}


/*==================================================
FINANCE PERIOD
==================================================*/

function bindFinancePeriod(){

    $all(
        "[data-finance-period]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    financePeriod=
                        button.dataset.financePeriod;

                    $all(
                        "[data-finance-period]"
                    )
                    .forEach(
                        item=>
                            item.classList.toggle(
                                "active",
                                item===button
                            )
                    );

                    renderFinance();
                }
            );
        }
    );
}


function bindFinanceInputs(){

    $("financeSaveButton")
    ?.addEventListener(
        "click",
        saveFinance
    );
}


function getFinanceTitle(period){

    const now=
        new Date();

    if(period==="current"){

        return{
            title:"이번달",
            date:
                `${now.getFullYear()}년 ${now.getMonth()+1}월`
        };
    }

    if(period==="previous"){

        const previous=
            previousMonthDate();

        return{
            title:"지난달",
            date:
                `${previous.getFullYear()}년 ${previous.getMonth()+1}월`
        };
    }

    return{
        title:"올해 누계",
        date:
            `${now.getFullYear()}년`
    };
}


function renderFinance(){

    const finance=
        calculateFinance(
            financePeriod
        );

    const title=
        getFinanceTitle(
            financePeriod
        );

    setText(
        "financePeriodTitle",
        title.title
    );

    setText(
        "financePeriodDate",
        title.date
    );

    setText(
        "financeRevenue",
        money(
            finance.revenue
        )
    );

    setText(
        "financeExpense",
        money(
            finance.totalExpense
        )
    );

    setText(
        "financeProfit",
        money(
            finance.profit
        )
    );

    setText(
        "revenueLite",
        money(
            finance.revenueData.lite
        )
    );

    setText(
        "revenueBasic",
        money(
            finance.revenueData.basic
        )
    );

    setText(
        "revenuePremium",
        money(
            finance.revenueData.premium
        )
    );

    setText(
        "revenueMission",
        money(
            finance.revenueData.mission
        )
    );

    setText(
        "revenueTotal",
        money(
            finance.revenueData.total
        )
    );

    fillFinanceInputs(
        finance.expenseRecord
    );

    renderFinanceHealth(
        finance
    );
}


function fillFinanceInputs(record){

    const disabled=
        financePeriod==="year";

    const fields={
        expenseFirebaseInput:
            record.firebase,

        expenseVoiceInput:
            record.voice,

        expenseAiInput:
            record.ai,

        expensePaymentInput:
            record.payment,

        expenseEtcInput:
            record.etc,

        taxReserveInput:
            record.taxReserve
    };

    Object.entries(
        fields
    )
    .forEach(
        ([
            id,
            value
        ])=>{

            const input=$(id);

            if(!input){

                return;
            }

            input.value=
                Math.round(
                    num(value)
                );

            input.disabled=
                disabled;
        }
    );

    const button=
        $("financeSaveButton");

    if(button){

        button.disabled=
            disabled;

        button.textContent=
            disabled
            ?"올해 누계는 월별 합계입니다."
            :"운영비 저장";
    }
}


async function saveFinance(){

    if(financePeriod==="year"){

        return;
    }

    const key=
        financeKeyForPeriod(
            financePeriod
        );

    if(!key){

        return;
    }

    const data={
        businessArea:
            "church",

        firebase:
            num(
                $("expenseFirebaseInput")
                ?.value
            ),

        voice:
            num(
                $("expenseVoiceInput")
                ?.value
            ),

        ai:
            num(
                $("expenseAiInput")
                ?.value
            ),

        payment:
            num(
                $("expensePaymentInput")
                ?.value
            ),

        etc:
            num(
                $("expenseEtcInput")
                ?.value
            ),

        taxReserve:
            num(
                $("taxReserveInput")
                ?.value
            )
    };

    financeRecords[key]={
        ...data
    };

    saveLocalFinance();

    try{

        await setDoc(
            doc(
                db,
                FINANCE_COLLECTION,
                key
            ),
            {
                ...data,

                monthKey:key,

                updatedAt:
                    serverTimestamp()
            },
            {
                merge:true
            }
        );

        showToast(
            "교회 운영비를 저장했습니다."
        );
    }
    catch(error){

        console.warn(error);

        showToast(
            "이 기기에 운영비를 저장했습니다."
        );
    }

    renderAll();
}


function renderFinanceHealth(finance){

    const card=
        $("financeHealthCard");

    const health=
        getFinanceHealth(finance);

    if(card){

        card.classList.remove(
            "good",
            "warning",
            "danger"
        );

        card.classList.add(
            health.type
        );
    }

    const icon=
        card?.querySelector(
            ".finance-health-icon"
        );

    if(icon){

        icon.textContent=
            health.icon;
    }

    setText(
        "financeHealthTitle",
        health.title
    );

    setText(
        "financeHealthDescription",
        health.description
    );
}


/*==================================================
NOTICE
==================================================*/

function bindNotice(){

    $("noticeSaveButton")
    ?.addEventListener(
        "click",
        saveNotice
    );
}


function loadLocalNotice(){

    const saved=
        localStorage.getItem(
            ADMIN_NOTICE_KEY
        );

    if(!saved){

        return;
    }

    try{

        const data=
            JSON.parse(saved);

        if(
            $("topNotice")
        ){

            $("topNotice").value=
                data.topNotice
                ||
                "";
        }

        if(
            $("globalNotice")
        ){

            $("globalNotice").value=
                data.globalNotice
                ||
                "";
        }
    }
    catch(error){

        console.warn(error);
    }
}


async function saveNotice(){

    const topNotice=
        txt(
            $("topNotice")
            ?.value
        );

    const globalNotice=
        txt(
            $("globalNotice")
            ?.value
        );

    localStorage.setItem(
        ADMIN_NOTICE_KEY,
        JSON.stringify({
            topNotice,
            globalNotice,
            savedAt:
                new Date()
                .toISOString()
        })
    );

    try{

        await setDoc(
            doc(
                db,
                "settings",
                "admin"
            ),
            {
                topNotice,
                globalNotice,

                noticeUpdatedAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()
            },
            {
                merge:true
            }
        );

        showToast(
            "예톡 전체 공지를 저장했습니다."
        );
    }
    catch(error){

        console.warn(error);

        showToast(
            "공지를 이 기기에 저장했습니다."
        );
    }
}


/*==================================================
REPORT
==================================================*/

function bindReportFilters(){

    $all(
        "[data-report-filter]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    reportFilter=
                        button.dataset.reportFilter;

                    $all(
                        "[data-report-filter]"
                    )
                    .forEach(
                        item=>
                            item.classList.toggle(
                                "active",
                                item===button
                            )
                    );

                    renderReports();
                }
            );
        }
    );
}


function renderReports(){

    const container=
        $("reportList");

    if(!container){

        return;
    }

    let list=
        reports.filter(
            report=>
                report.businessArea
                ===
                "church"
        );

    if(reportFilter==="pending"){

        list=
            list.filter(
                report=>
                    txt(
                        report.status
                    )
                    .toLowerCase()
                    !==
                    "resolved"
            );
    }

    if(reportFilter==="resolved"){

        list=
            list.filter(
                report=>
                    txt(
                        report.status
                    )
                    .toLowerCase()
                    ===
                    "resolved"
            );
    }

    if(!list.length){

        container.innerHTML=`
            <div class="empty-card">
                ${
                    reportFilter==="pending"
                    ?"현재 미처리 신고가 없습니다."
                    :"표시할 신고가 없습니다."
                }
            </div>
        `;

        return;
    }

    container.innerHTML=
        list
        .map(
            report=>{

                const resolved=
                    txt(
                        report.status
                    )
                    .toLowerCase()
                    ===
                    "resolved";

                return`

                    <article class="report-item">

                        <strong>
                            !
                            ${escapeHtml(
                                report.title
                                ||
                                report.type
                                ||
                                "신고"
                            )}
                        </strong>

                        <p>
                            ${escapeHtml(
                                report.reason
                                ||
                                report.content
                                ||
                                "신고 내용"
                            )}
                        </p>

                        ${
                            !resolved
                            ?`
                                <div class="actions">

                                    <button
                                        type="button"
                                        data-resolve-report="${escapeHtml(report.id)}"
                                    >
                                        처리완료
                                    </button>

                                </div>
                            `
                            :`
                                <p>
                                    ✓ 처리완료
                                </p>
                            `
                        }

                    </article>
                `;
            }
        )
        .join("");

    container
    .querySelectorAll(
        "[data-resolve-report]"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    resolveReport(
                        button.dataset.resolveReport
                    );
                }
            );
        }
    );
}


async function resolveReport(id){

    try{

        await setDoc(
            doc(
                db,
                REPORTS_COLLECTION,
                id
            ),
            {
                status:
                    "resolved",

                resolvedAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()
            },
            {
                merge:true
            }
        );

        const report=
            reports.find(
                item=>item.id===id
            );

        if(report){

            report.status=
                "resolved";
        }

        renderAll();

        showToast(
            "신고를 처리했습니다."
        );
    }
    catch(error){

        console.error(error);

        showToast(
            "신고 처리에 실패했습니다."
        );
    }
}


/*==================================================
OVERLAY
==================================================*/

function openOverlay(id){

    const overlay=$(id);

    if(!overlay){

        return;
    }

    overlay.classList.remove(
        "hidden"
    );

    overlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow=
        "hidden";
}


function closeOverlay(id){

    const overlay=$(id);

    if(!overlay){

        return;
    }

    overlay.classList.add(
        "hidden"
    );

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow=
        "";
}


/*==================================================
CONFIRM
==================================================*/

function bindConfirmModal(){

    $("adminConfirmCancelButton")
    ?.addEventListener(
        "click",
        closeConfirm
    );

    $("adminConfirmOkButton")
    ?.addEventListener(
        "click",
        async()=>{

            const callback=
                confirmCallback;

            confirmCallback=null;

            closeOverlay(
                "adminConfirmOverlay"
            );

            if(
                typeof callback==="function"
            ){

                await callback();
            }
        }
    );

    $("adminConfirmOverlay")
    ?.addEventListener(
        "click",
        event=>{

            if(
                event.target.id
                ===
                "adminConfirmOverlay"
            ){

                closeConfirm();
            }
        }
    );
}


function openConfirm(
    title,
    message,
    callback
){

    confirmCallback=
        callback;

    setText(
        "adminConfirmTitle",
        title
    );

    setText(
        "adminConfirmMessage",
        message
    );

    openOverlay(
        "adminConfirmOverlay"
    );
}


function closeConfirm(){

    confirmCallback=null;

    closeOverlay(
        "adminConfirmOverlay"
    );
}


/*==================================================
KEYBOARD
==================================================*/

function bindKeyboard(){

    document.addEventListener(
        "keydown",
        event=>{

            if(event.key!=="Escape"){

                return;
            }

            if(
                !$("adminConfirmOverlay")
                ?.classList
                .contains("hidden")
            ){

                closeConfirm();

                return;
            }

            if(
                !$("supportDetailOverlay")
                ?.classList
                .contains("hidden")
            ){

                closeSupportDetail();

                return;
            }

            if(
                !$("memberDetailOverlay")
                ?.classList
                .contains("hidden")
            ){

                closeMemberDetail();

                return;
            }

            if(
                !$("churchDetailOverlay")
                ?.classList
                .contains("hidden")
            ){

                closeChurchDetail();

                return;
            }

            closeAllSummaryDetails();
        }
    );
}


/*==================================================
TOAST
==================================================*/

function showToast(message){

    const toast=
        $("adminToast");

    if(!toast){

        return;
    }

    toast.textContent=
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer=
        setTimeout(
            ()=>{

                toast.classList.remove(
                    "show"
                );
            },
            2200
        );
}


/*==================================================
YETALK ADMIN.JS END
==================================================*/