/*==================================================
FRIENDADMIN.JS
==================================================*/

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {

getAuth,
onAuthStateChanged

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {

getFirestore,
doc,
getDoc,
collection,
query,
where,
getDocs

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";



/*==================================================
Firebase
==================================================*/

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);



/*==================================================
화면 시작
==================================================*/

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="login.html";

return;

}

loadFriendAdmin(user.uid);

});



/*==================================================
전체 읽기
==================================================*/

async function loadFriendAdmin(uid){

await loadSummary(uid);

await loadChurch(uid);

await loadSmall(uid);

}



/*==================================================
통계
==================================================*/

async function loadSummary(uid){

const snap=await getDoc(doc(db,"users",uid));

if(!snap.exists()) return;

const data=snap.data();

inviteCount.textContent=(data.inviteCount||0)+"명";

churchCount.textContent=(data.churchCount||0)+"개";

smallCount.textContent=(data.smallCount||0)+"개";

memberCount.textContent=(data.memberCount||0)+"명";

loveCount.textContent=(data.loveCount||0)+"명";

}



/*==================================================
교회방
==================================================*/

async function loadChurch(uid){

const wrap=document.getElementById("churchList");

wrap.innerHTML="";

const q=query(

collection(db,"churchRooms"),

where("ownerUid","==",uid)

);

const result=await getDocs(q);

if(result.empty){

wrap.innerHTML="<div class='empty'>개설한 교회방이 없습니다.</div>";

return;

}

result.forEach(docItem=>{

const data=docItem.data();

wrap.innerHTML+=`

<div class="list"
onclick="location.href='church.html?id=${docItem.id}'">

<div class="listName">

${data.ownerName}

</div>

<div class="listRoom">

${data.roomName}

</div>

</div>

`;

});

}



/*==================================================
소모임
==================================================*/

async function loadSmall(uid){

const wrap=document.getElementById("smallList");

wrap.innerHTML="";

const q=query(

collection(db,"smallRooms"),

where("ownerUid","==",uid)

);

const result=await getDocs(q);

if(result.empty){

wrap.innerHTML="<div class='empty'>개설한 소모임이 없습니다.</div>";

return;

}

result.forEach(docItem=>{

const data=docItem.data();

wrap.innerHTML+=`

<div class="list"
onclick="location.href='smallroom.html?id=${docItem.id}'">

<div class="listName">

${data.ownerName}

</div>

<div class="listRoom">

${data.roomName}

</div>

</div>

`;

});

}