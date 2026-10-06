/*====================================
YETALK
내기도
====================================*/

/*====================================
변수
====================================*/

let prayerRunning = false;

let prayerTimer = null;

let todayMinutes = 0;

let goalMinutes = 15;

let prayerCount = 5;

/*====================================
시작
====================================*/

window.onload = function () {

    updateTodayDate();

    loadTodayMinutes();

    loadGoal();

    loadPrayer();

    initAutoGrow();

};

/*====================================
오늘 날짜
====================================*/

function updateTodayDate() {

    const today = new Date();

    document.getElementById("todayDate").innerText =

        (today.getMonth()+1) +

        "월 " +

        today.getDate() +

        "일";

}

/*====================================
기도시간
====================================*/

function loadTodayMinutes(){

    todayMinutes = Number(

        localStorage.getItem(

            "todayMinutes"

        ) || 0

    );

    updateTodayTime();

}

function updateTodayTime(){

    document.getElementById("todayTime").innerText =

        "오늘 " + todayMinutes + "분";

}

/*====================================
기도 시작
====================================*/

function startPrayer(){

    if(prayerRunning) return;

    prayerRunning = true;

    prayerTimer = setInterval(function(){

        todayMinutes++;

        updateTodayTime();

        localStorage.setItem(

            "todayMinutes",

            todayMinutes

        );

    },60000);

}

/*====================================
기도 종료
====================================*/

function stopPrayer(){

    prayerRunning = false;

    clearInterval(prayerTimer);

}
/*====================================
Auto Grow
====================================*/

function initAutoGrow(){

    document

    .querySelectorAll(".autoGrow")

    .forEach(function(box){

        autoGrow(box);

        box.addEventListener("input",function(){

            autoGrow(this);

            savePrayer();

        });

    });

}

function autoGrow(box){

    box.style.height="auto";

    box.style.height=

    box.scrollHeight+"px";

}

/*====================================
자동 저장
====================================*/

function savePrayer(){

    const list=[];

    document

    .querySelectorAll(".prayerRow")

    .forEach(function(row){

        list.push({

            checked:

            row.querySelector(".prayerCheck").checked,

            text:

            row.querySelector("textarea").value

        });

    });

    localStorage.setItem(

        "myPrayer",

        JSON.stringify(list)

    );

}

/*====================================
불러오기
====================================*/

function loadPrayer(){

    const list=

    JSON.parse(

    localStorage.getItem("myPrayer")

    ||"[]"

    );

    list.forEach(function(item,index){

        const row=

        document.querySelectorAll(".prayerRow")[index];

        if(!row) return;

        row.querySelector(".prayerCheck").checked=

        item.checked;

        const box=

        row.querySelector("textarea");

        box.value=item.text;

        autoGrow(box);

    });

}

/*====================================
기도제목 추가
====================================*/

function addPrayerItem(){

    prayerCount++;

    const row=

    document.createElement("div");

    row.className="prayerRow";

    row.innerHTML=`

<input
type="checkbox"
class="prayerCheck">

<textarea
id="prayer${prayerCount}"
class="textInput autoGrow"
rows="1"
placeholder="${prayerCount}번 기도제목">

</textarea>

`;

    document

    .getElementById("prayerItems")

    .appendChild(row);

    const box=row.querySelector("textarea");

    box.addEventListener("input",function(){

        autoGrow(this);

        savePrayer();

    });

    row.querySelector(".prayerCheck")

    .addEventListener("change",savePrayer);

}
/*====================================
응답
====================================*/

function answerSelected(){

    const rows=document.querySelectorAll(".prayerRow");

    let answered=

    JSON.parse(

    localStorage.getItem("answeredPrayer")

    ||"[]"

    );

    let changed=false;

    rows.forEach(function(row){

        const check=row.querySelector(".prayerCheck");

        const box=row.querySelector("textarea");

        const text=box.value.trim();

        if(check.checked && text!=""){

            answered.unshift({

                date:new Date().toLocaleDateString(),

                text:text

            });

            box.value="";

            check.checked=false;

            autoGrow(box);

            changed=true;

        }

    });

    if(!changed){

        alert("선택된 기도제목이 없습니다.");

        return;

    }

    localStorage.setItem(

        "answeredPrayer",

        JSON.stringify(answered)

    );

    savePrayer();

    alert("응답기도에 저장되었습니다.");

}

/*====================================
삭제
====================================*/

function deleteSelected(){

    if(!confirm("선택한 기도제목을 삭제하시겠습니까?"))

    return;

    document

    .querySelectorAll(".prayerRow")

    .forEach(function(row){

        const check=row.querySelector(".prayerCheck");

        const box=row.querySelector("textarea");

        if(check.checked){

            box.value="";

            check.checked=false;

            autoGrow(box);

        }

    });

    savePrayer();

}

/*====================================
복사
====================================*/

function copySelected(){

    let text="";

    document

    .querySelectorAll(".prayerRow")

    .forEach(function(row){

        const check=row.querySelector(".prayerCheck");

        const box=row.querySelector("textarea");

        if(check.checked && box.value.trim()!=""){

            text+=box.value.trim()+"\n";

        }

    });

    if(text==""){

        alert("선택된 기도제목이 없습니다.");

        return;

    }

    navigator.clipboard.writeText(text);

    alert("복사되었습니다.");

}

/*====================================
기도목표
====================================*/

function selectGoal(minutes,element){

    goalMinutes=minutes;

    localStorage.setItem(

        "goalMinutes",

        minutes

    );

    document

    .querySelectorAll(".goalBtn")

    .forEach(function(btn){

        btn.classList.remove(

            "activeGoal"

        );

    });

    element.classList.add(

        "activeGoal"

    );

}

function loadGoal(){

    const saved=

    localStorage.getItem(

        "goalMinutes"

    );

    if(saved){

        goalMinutes=

        Number(saved);

    }

    document

    .querySelectorAll(".goalBtn")

    .forEach(function(btn){

        btn.classList.remove(

            "activeGoal"

        );

        if(btn.innerText.includes(goalMinutes)){

            btn.classList.add(

                "activeGoal"

            );

        }

    });

}
/*====================================
직접목표
====================================*/

function showCustomGoal(){

    document
    .getElementById("customGoalBox")
    .classList.remove("hidden");

}

function saveCustomGoal(){

    const value=

    document

    .getElementById("customGoal")

    .value.trim();

    if(value=="") return;

    localStorage.setItem(

        "goalText",

        value

    );

    alert("기도목표가 저장되었습니다.");

}
