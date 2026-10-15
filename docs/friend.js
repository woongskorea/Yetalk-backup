/*====================================
YETALK
FRIEND.JS
v1.0
====================================*/

/*====================================
전역변수
====================================*/

let roomList = [];

let favoriteList = [];

let adIndex = 0;

const adList = [

    "📢 오늘의 말씀",

    "🎬 AI 쇼츠",

    "⛪ 교회광고",

    "🙏 기도제목",

    "💝 사랑받는 자 초대"

];

/*====================================
시작
====================================*/

window.onload = function () {

    loadMyInfo();

    loadFavorite();

    loadRoomList();

    initSearch();

    applyTheme();

    startBottomAd();

    updateUserState();

};

/*====================================
내 정보
====================================*/

function loadMyInfo(){

    const displayName =
        localStorage.getItem("displayName");

    if(displayName){

        const obj =
        document.getElementById("myName");

        if(obj){

            obj.innerText = displayName;

        }

    }

    const character =
        localStorage.getItem("character");

    if(character){

        const obj =
        document.getElementById("myCharacter");

        if(obj){

            obj.src = character;

        }

    }

}

/*====================================
광고 시작
====================================*/

function startBottomAd(){

    const ad =
    document.getElementById("bottomAd");

    if(!ad) return;

    ad.innerHTML = adList[0];

    setInterval(function(){

        adIndex++;

        if(adIndex>=adList.length){

            adIndex=0;

        }

        ad.innerHTML =
        adList[adIndex];

    },3000);

}

/*====================================
친구상태
====================================*/

function updateUserState(){

    /*

    Firebase 연결 예정

    🔴ON
    🔴OFF
    🩷ON
    🩷OFF

    */

}

/*====================================
방목록
====================================*/

function loadRoomList(){

    roomList=[

        {

            id:"friend1",

            name:"김철수",

            type:"friend",

            chat:"chat"

        },

        {

            id:"friend2",

            name:"이영희",

            type:"friend",

            chat:"chat"

        },

        {

            id:"friend3",

            name:"박영수",

            type:"friend",

            chat:"chat"

        }

    ];

}

/*====================================
검색 초기화
====================================*/

function initSearch(){

    const search =
    document.getElementById("searchFriend");

    if(!search) return;

    search.addEventListener(

        "input",

        function(){

            searchRoom(this.value);

        }

    );

}

/*====================================
검색
====================================*/

function searchFriend(){

    const txt =
    document.getElementById("searchFriend").value;

    searchRoom(txt);

}

function searchRoom(keyword){

    keyword =
    keyword.toLowerCase();

    document
    .querySelectorAll(".listItem")
    .forEach(function(item){

        const text =
        item.innerText.toLowerCase();

        item.style.display =

        text.includes(keyword)

        ?

        "flex"

        :

        "none";

    });

   }
   function changeTheme(){

       document.getElementById("themeMenu").style.display="flex";

   }

   function closeMenu(id){

       document.getElementById(id).style.display="none";

   }

   function setTheme(theme){

       localStorage.setItem("theme",theme);

       applyTheme();

       closeMenu("themeMenu");

   }

   function applyTheme(){

       const theme=localStorage.getItem("theme")||"white";

       document.body.setAttribute("data-theme",theme);

   }
/*====================================
채팅 열기
====================================*/

function openChat(roomId,roomName,roomType,chatType){

    localStorage.setItem("roomId",roomId);

    localStorage.setItem("roomName",roomName);

    localStorage.setItem("roomType",roomType);

    localStorage.setItem("chatType",chatType);

    switch(chatType){

        case "chat":

            location.href="chat.html";

            break;

        case "chat2":

            location.href="chat2.html";

            break;

        case "chat3":

            location.href="chat3.html";

            break;

        default:

            location.href="chat.html";

    }

}

/*====================================
즐겨찾기 불러오기
====================================*/

function loadFavorite(){

    favoriteList=

    JSON.parse(

        localStorage.getItem("favoriteList")

        ||

        "[]"

    );

    refreshFavoriteIcon();

}

/*====================================
즐겨찾기 저장
====================================*/

function saveFavorite(){

    localStorage.setItem(

        "favoriteList",

        JSON.stringify(favoriteList)

    );

}

/*====================================
즐겨찾기 클릭
====================================*/

function toggleFavorite(event,obj){

    event.stopPropagation();

    const item=

    obj.closest(".listItem");

    if(!item) return;

    const roomId=

    item.getAttribute("onclick")

    .match(/'(.*?)'/)[1];

    const idx=

    favoriteList.indexOf(roomId);

    if(idx==-1){

        favoriteList.push(roomId);

        obj.innerText="⭐";

        obj.classList.add("on");

    }

    else{

        favoriteList.splice(idx,1);

        obj.innerText="☆";

        obj.classList.remove("on");

    }

    saveFavorite();

}

/*====================================
즐겨찾기 표시
====================================*/

function refreshFavoriteIcon(){

    document

    .querySelectorAll("#allList .listItem")

    .forEach(function(item){

        const roomId=

        item.getAttribute("onclick")

        .match(/'(.*?)'/)[1];

        const star=

        item.querySelector(".favorite");

        if(!star) return;

        if(favoriteList.includes(roomId)){

            star.innerText="⭐";

            star.classList.add("on");

        }

        else{

            star.innerText="☆";

            star.classList.remove("on");

        }

    });

}

/*====================================
즐겨찾기 여부
====================================*/

function isFavorite(roomId){

    return favoriteList.includes(roomId);

}

