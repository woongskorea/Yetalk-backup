/*====================================
내 노트
====================================*/

window.onload=function(){

loadMyNote();

loadSavedList();

};

/*====================================
자동 저장
====================================*/

const note1=document.getElementById("note1");
const note2=document.getElementById("note2");
const note3=document.getElementById("note3");

note1.addEventListener("input",saveMyNote);
note2.addEventListener("input",saveMyNote);
note3.addEventListener("input",saveMyNote);

/*====================================
저장
====================================*/

function saveMyNote(){

localStorage.setItem("myNote1",note1.value);
localStorage.setItem("myNote2",note2.value);
localStorage.setItem("myNote3",note3.value);

}

/*====================================
불러오기
====================================*/

function loadMyNote(){

note1.value=
localStorage.getItem("myNote1")||"";

note2.value=
localStorage.getItem("myNote2")||"";

note3.value=
localStorage.getItem("myNote3")||"";

}

/*====================================
전체 삭제
====================================*/

function deleteMyNote(){

if(!confirm("모든 메모를 삭제하시겠습니까?")) return;

localStorage.removeItem("myNote1");
localStorage.removeItem("myNote2");
localStorage.removeItem("myNote3");

note1.value="";
note2.value="";
note3.value="";

}

/*====================================
저장목록
====================================*/

function loadSavedList(){

const list=JSON.parse(

localStorage.getItem("savedNoteList")||"[]"

);

const box=document.getElementById("noteList");

if(!box) return;

box.innerHTML="";

list.forEach(function(item,index){

box.innerHTML+=`

<div class="listItem">

<div class="listTop">

<div class="listDate">

${item.date}

</div>

<div>

<span class="deleteBtn"
onclick="copySavedNote(${index})">

복사

</span>

&nbsp;&nbsp;

<span class="deleteBtn"
onclick="deleteSavedNote(${index})">

삭제

</span>

</div>

</div>

<div class="listText">

<b>[${item.type}]</b><br>

${item.text}

</div>

</div>

`;

});

}

/*====================================
복사
====================================*/

function copySavedNote(index){

const list=JSON.parse(

localStorage.getItem("savedNoteList")||"[]"

);

navigator.clipboard.writeText(

list[index].text

);

alert("복사되었습니다.");

}

/*====================================
삭제
====================================*/

function deleteSavedNote(index){

const list=JSON.parse(

localStorage.getItem("savedNoteList")||"[]"

);

list.splice(index,1);

localStorage.setItem(

"savedNoteList",

JSON.stringify(list)

);

loadSavedList();

}