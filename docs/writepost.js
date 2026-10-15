/*==================================================
YETALK WRITEPOST.JS
==================================================*/

window.onload=function(){

    loadTemp();

    document.getElementById(

    "postText"

    ).focus();

};

/*==================================================
등록
==================================================*/

function savePost(){

    const text=document.getElementById(

    "postText"

    ).value.trim();

    if(text==""){

        alert("내용을 입력하세요.");

        return;

    }

    const lines=text.split("\n");

    const title=lines[0];

    const content=lines.slice(1).join("\n");

    const post={

        title:title,

        content:content,

        writer:localStorage.getItem("myName")||"회원",

        date:new Date().toLocaleString(),

        amen:0,

        reply:0,

        view:0

    };

    let posts=

    JSON.parse(

    localStorage.getItem("chat2Posts")

    )||[];

    posts.unshift(post);

    localStorage.setItem(

    "chat2Posts",

    JSON.stringify(posts)

    );

finishPost();

}
/*==================================================
자동 임시저장
==================================================*/

const postText=

document.getElementById("postText");

postText.addEventListener(

"input",

function(){

localStorage.setItem(

"tempPost",

this.value

);

this.style.height="auto";

this.style.height=

this.scrollHeight+"px";

}

);

/*==================================================
임시글 불러오기
==================================================*/

function loadTemp(){

const temp=

localStorage.getItem(

"tempPost"

);

if(temp){

postText.value=temp;

postText.style.height="auto";

postText.style.height=

postText.scrollHeight+"px";

}

}
/*==================================================
뒤로가기
==================================================*/

function goBack(){

history.back();

}

/*==================================================
등록 후 초기화
==================================================*/

function clearPost(){

localStorage.removeItem(

"tempPost"

);

document.getElementById(

"postText"

).value="";

}

/*==================================================
등록완료
==================================================*/

function finishPost(){

clearPost();

location.href="chat2.html";

}