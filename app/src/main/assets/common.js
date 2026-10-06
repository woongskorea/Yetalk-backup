/*==================================================
YETALK COMMON.JS

예톡 전체 공통 이동 시스템

하단 고정 6메뉴
교회홈 / 나의홈 / 쿠팡 / 헌금 / 오시는길 / 내정보

- 기존 하단메뉴 중복 방지
- 관리자 뒤로가기 보강
- 관리자 홈버튼 보강
- 안전한 뒤로가기
- churchId 유지
==================================================*/

(function(){

const STORAGE={
    currentChurch:"currentChurchId",
    myChurch:"yetalkMyChurchId",
    loginUser:"loginUser"
};


/*==================================================
BASIC
==================================================*/

function clean(v){
    return String(v??"").trim();
}

// 기존의 복잡한 폴더 감지 함수들을 전부 통과형(직행)으로 변경

function inChurchFolder(){
    return false; // 항상 루트(단층) 마당에 있다고 판정
}

function rootFile(file){
    return file; // 우회(../) 없이 파일 이름 그대로 곧바로 호출
}

function churchFile(file){
    return file; // church/ 폴더를 붙이지 않고 파일 이름 그대로 직행
}


/*==================================================
CHURCH ID
==================================================*/

function getChurchId(){

    const params=
        new URLSearchParams(location.search);

    const queryId=
        clean(params.get("churchId"));

    const currentId=
        clean(
            localStorage.getItem(
                STORAGE.currentChurch
            )
        );

    const myChurchId=
        clean(
            localStorage.getItem(
                STORAGE.myChurch
            )
        );

    const id=
        queryId||
        currentId||
        myChurchId||
        "";

    if(id){
        localStorage.setItem(
            STORAGE.currentChurch,
            id
        );
    }

    return id;
}


/*==================================================
URL
==================================================*/

function churchHomeUrl(target=""){

    const churchId=
        getChurchId();

    if(!churchId){
        return rootFile(
            "churchlist.html"
        );
    }

    let url=
        `${churchFile("churchmain.html")}?churchId=${encodeURIComponent(churchId)}`;

    if(target){
        url+=
            `&navTarget=${encodeURIComponent(target)}`;
    }

    return url;
}


/*==================================================
GO
==================================================*/

function goMyHome(){
    location.href=
        rootFile("index.html");
}

function goChurchHome(){
    location.href=
        churchHomeUrl();
}

function goMyInfo(){
    location.href=
        rootFile("myinfo.html");
}


/*==================================================
COUPANG
==================================================*/

function goCoupang(){

    const existing=
        document.getElementById(
            "churchBottomCoupangBtn"
        );

    if(existing){
        existing.click();
        return;
    }

    location.href=
        churchHomeUrl("coupang");
}


/*==================================================
GIVING
==================================================*/

function goGiving(){

    const existing=
        document.getElementById(
            "churchBottomGivingBtn"
        );

    if(existing){
        existing.click();
        return;
    }

    location.href=
        churchHomeUrl("giving");
}


/*==================================================
DIRECTIONS
==================================================*/

function goDirections(){

    const existing=
        document.getElementById(
            "churchBottomDirectionsBtn"
        );

    if(existing){
        existing.click();
        return;
    }

    const churchId=
        getChurchId();

    if(!churchId){

        location.href=
            rootFile(
                "churchlist.html"
            );

        return;
    }

    location.href=
        `${churchFile("church_map.html")}?churchId=${encodeURIComponent(churchId)}`;
}

function isChurchPage(){
    // 폴더 경로 대신 파일 이름이나 파라미터(churchId) 기준으로 판단하도록 변경
    const path = location.pathname.toLowerCase();
    const params = new URLSearchParams(location.search);

    // churchmain 이나 church 관련 파일 이름이 포함되어 있거나 churchId가 있으면 true 반환
    return path.includes("churchmain") || path.includes("church") || params.has("churchId");
}

/*==================================================
SAFE BACK
==================================================*/

function safeBack(){

    try{

        const referrer=
            clean(document.referrer);

        if(
            history.length>1&&
            referrer&&
            referrer.startsWith(
                location.origin
            )
        ){

            history.back();
            return;
        }

    }catch(error){

        console.warn(
            "예톡 뒤로가기 확인 오류",
            error
        );

    }

    /*
    이전 기록이 없을 경우

    교회 관련 화면
    → 교회홈

    일반 예톡 화면
    → 나의홈
    */

    if(isChurchPage()){
        goChurchHome();
        return;
    }

    goMyHome();
}


/*==================================================
CURRENT PAGE
==================================================*/

function currentPage(){

    const path=
        location.pathname
        .toLowerCase();

    const params=
        new URLSearchParams(
            location.search
        );

    if(
        path.endsWith("/index.html")
    ){
        return"myHome";
    }

    if(
        path.endsWith("/churchmain.html")
    ){
        return"churchHome";
    }

    if(
        path.endsWith("/myinfo.html")
    ){
        return"myInfo";
    }

    if(
        path.endsWith("/church_map.html")||
        (path.endsWith("/churchinfo.html")&&
        params.get("section")==="location")
    ){
        return"directions";
    }

    return"";
}


/*==================================================
EXISTING BOTTOM NAV
==================================================*/

function hasBottomNavigation(){

    return Boolean(

        document.querySelector(
            ".church-bottom-navigation"
        )||

        document.querySelector(
            ".yetalk-common-bottom-nav"
        )||

        document.querySelector(
            "[data-yetalk-standard-bottom]"
        )

    );
}


/*==================================================
CREATE BOTTOM NAV
==================================================*/

function createBottomNavigation(){

    if(hasBottomNavigation()){
        return;
    }

    const nav=
        document.createElement("nav");

    nav.id=
        "yetalkCommonBottomNav";

    nav.className=
        "yetalk-common-bottom-nav";

    nav.dataset.yetalkStandardBottom=
        "true";

    nav.setAttribute(
        "aria-label",
        "예톡 하단 메뉴"
    );


    const items=[

        {
            key:"churchHome",
            icon:"⛪",
            label:"교회홈",
            action:goChurchHome
        },

        {
            key:"myHome",
            icon:"🏠",
            label:"나의홈",
            action:goMyHome
        },

        {
            key:"coupang",
            icon:"🛒",
            label:"쿠팡",
            action:goCoupang
        },

        {
            key:"giving",
            icon:"💝",
            label:"헌금",
            action:goGiving
        },

        {
            key:"directions",
            icon:"📍",
            label:"오시는길",
            action:goDirections
        },

        {
            key:"myInfo",
            icon:"👤",
            label:"내정보",
            action:goMyInfo
        }

    ];


    const active=
        currentPage();


    items.forEach(item=>{

        const button=
            document.createElement(
                "button"
            );

        button.type=
            "button";

        button.className=
            "yetalk-common-bottom-item";

        button.dataset.page=
            item.key;


        if(
            active===
            item.key
        ){
            button.classList.add(
                "active"
            );
        }


        const icon=
            document.createElement(
                "span"
            );

        icon.className=
            "yetalk-common-bottom-icon";

        icon.textContent=
            item.icon;


        const label=
            document.createElement(
                "strong"
            );

        label.textContent=
            item.label;


        button.append(
            icon,
            label
        );


        button.addEventListener(
            "click",
            event=>{

                event.preventDefault();
                item.action();

            }
        );


        nav.appendChild(
            button
        );

    });


    document.body.appendChild(nav);

    document.body.classList.add(
        "has-yetalk-common-bottom-nav"
    );
}


/*==================================================
뒤로가기 버튼

기존 여러 페이지 형태를 모두 인식
==================================================*/

function bindBackButtons(){

    document.addEventListener(
        "click",
        event=>{

            const button=
                event.target.closest(
                    [
                        ".back",
                        ".back-btn",
                        ".header-back-btn",
                        ".admin-back-btn",
                        "[data-back]",
                        "[data-common-back]"
                    ].join(",")
                );

            if(!button){
                return;
            }

            /*
            이 속성이 있으면
            원래 페이지 기능 사용
            */

            if(
                button.dataset.nativeBack===
                "true"
            ){
                return;
            }

            event.preventDefault();

            event.stopImmediatePropagation();

            safeBack();

        },
        true
    );
}


/*==================================================
관리자 HOME 버튼

churchadmin.html의
adminHomeBtn을 확실히 교회홈으로 연결
==================================================*/

function bindChurchHomeButtons(){

    document.addEventListener(
        "click",
        event=>{

            const button=
                event.target.closest(
                    [
                        "#adminHomeBtn",
                        ".admin-home-btn",
                        "[data-church-home]"
                    ].join(",")
                );

            if(!button){
                return;
            }

            if(
                button.dataset.nativeHome===
                "true"
            ){
                return;
            }

            event.preventDefault();

            event.stopImmediatePropagation();

            goChurchHome();

        },
        true
    );
}


/*==================================================
화살표가 전혀 없는 페이지

자동 ← 버튼 생성
==================================================*/

function createBackButton(){

    const path=
        location.pathname
        .toLowerCase();


    /*
    나의홈과 교회홈은
    별도 뒤로가기 필요 없음
    */

    if(
        path.endsWith("/index.html")||
        path.endsWith("/churchmain.html")
    ){
        return;
    }


    if(
        document.querySelector(
            [
                ".back",
                ".back-btn",
                ".header-back-btn",
                ".admin-back-btn",
                "[data-back]",
                "[data-common-back]",
                ".yetalk-common-back"
            ].join(",")
        )
    ){
        return;
    }


    const button=
        document.createElement(
            "button"
        );

    button.type=
        "button";

    button.className=
        "yetalk-common-back";

    button.setAttribute(
        "aria-label",
        "이전 화면"
    );

    button.innerHTML=
        "<span>‹</span>";


    button.addEventListener(
        "click",
        safeBack
    );


    document.body.appendChild(
        button
    );
}


/*==================================================
CHURCHMAIN TARGET

관리자 등 다른 페이지의 하단메뉴에서

쿠팡 / 헌금

눌렀을 때
교회홈으로 돌아온 뒤
해당 기능 실행
==================================================*/

function runNavigationTarget(){

    const params=
        new URLSearchParams(
            location.search
        );

    const target=
        clean(
            params.get(
                "navTarget"
            )
        );

    if(!target){
        return;
    }


    const buttonMap={

        coupang:
            "churchBottomCoupangBtn",

        giving:
            "churchBottomGivingBtn",

        directions:
            "churchBottomDirectionsBtn"

    };


    const buttonId=
        buttonMap[target];

    if(!buttonId){
        return;
    }


    /*
    churchmain.js가 먼저
    이벤트를 연결하고
    교회 데이터도 불러올 시간을 줌
    */

    setTimeout(()=>{

        const button=
            document.getElementById(
                buttonId
            );

        if(button){
            button.click();
        }


        try{

            const nextParams=
                new URLSearchParams(
                    location.search
                );

            nextParams.delete(
                "navTarget"
            );

            const query=
                nextParams.toString();

            history.replaceState(
                null,
                "",
                location.pathname+
                (query?`?${query}`:"")+
                location.hash
            );

        }catch(error){

            console.warn(
                "예톡 navTarget 정리 오류",
                error
            );

        }

    },1200);
}


/*==================================================
GLOBAL
==================================================*/

window.yetalkSafeBack=
    safeBack;

window.yetalkGoChurchHome=
    goChurchHome;

window.yetalkGoMyHome=
    goMyHome;

window.yetalkGoCoupang=
    goCoupang;

window.yetalkGoGiving=
    goGiving;

window.yetalkGoDirections=
    goDirections;

window.yetalkGoMyInfo=
    goMyInfo;


/*
기존 페이지 호환
*/

window.goBack=
    safeBack;

window.goChurchHome=
    goChurchHome;


/*==================================================
START
==================================================*/

function initialize(){

    bindBackButtons();

    bindChurchHomeButtons();

    createBottomNavigation();

    createBackButton();

    runNavigationTarget();

}


if(
    document.readyState===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

}else{

    initialize();

}

})();