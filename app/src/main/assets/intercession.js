<!DOCTYPE html>
<html lang="ko">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>내 노트</title>

<link rel="stylesheet"
href="../common.css">

</head>

<body>

<div class="container">

<!--=========================
HEADER
==========================-->

<header class="header">

<div class="topMenu">

<div
class="menuOff"
onclick="location.href='../index.html'">

홈

</div>

<div
class="menuOff"
onclick="location.href='myprayer.html'">

내기도

</div>

<div
class="menuOff"
onclick="location.href='intercession.html'">

중보기도

</div>

<div
class="menuOn">

내노트

</div>

</div>

</header>

<!--=========================
내 노트
==========================-->

<div class="section">

<div class="sectionTitle">

내 노트

</div>

<textarea

id="noteInput"

class="textInput autoGrow"

rows="3"

placeholder="메모를 입력하세요.">

</textarea>

<div
class="rightAlign mt10">

<button

class="commonBtn"

onclick="saveNote()">

저장

</button>

</div>

</div>
<!--=========================
저장목록
==========================-->

<div class="section">

    <div class="sectionTitle">

        저장목록

    </div>

    <div id="noteList">

        <!-- JS에서 자동 생성 -->

    </div>

</div>

<!-- 예시(자동 생성) -->

<!--

<div class="listItem">

    <div class="listTop">

        <div class="listDate">

            2026.07.08 14:25

        </div>

        <div>

            <span
            class="deleteBtn"
            onclick="copyNote(0)">

                복사

            </span>

            &nbsp;&nbsp;

            <span
            class="deleteBtn"
            onclick="deleteNote(0)">

                삭제

            </span>

        </div>

    </div>

    <div class="listText">

        오늘 받은 은혜...

    </div>

</div>

-->
<!--=========================
SCRIPT
==========================-->

<script src="mynote.js"></script>

<script>

/*==========================
자동 높이
==========================*/

const noteInput =

document.getElementById(

"noteInput"

);

noteInput.addEventListener(

"input",

function(){

this.style.height="auto";

this.style.height=

this.scrollHeight+"px";

}

);

/*==========================
Enter 저장
==========================*/

noteInput.addEventListener(

"keydown",

function(e){

if(

e.ctrlKey &&

e.key==="Enter"

){

saveNote();

}

);

</script>

</div>

</body>

</html>