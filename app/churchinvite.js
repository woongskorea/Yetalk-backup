document.addEventListener("DOMContentLoaded", () => {
    // 1. 화면 요소 가져오기
    const tabA = document.getElementById("tabA");
    const tabB = document.getElementById("tabB");
    const tabC = document.getElementById("tabC");

    const previewCardTitle = document.getElementById("previewCardTitle");
    const textContent = document.getElementById("textContent");
    const editArea = document.getElementById("editArea");
    const editTextarea = document.getElementById("editTextarea");
    const editBtn = document.getElementById("editBtn");
    const saveEditBtn = document.getElementById("saveEditBtn");

    const copyBtn = document.getElementById("copyInviteTextBtn"); // 단일 통합 복사 버튼
    const joinBtn = document.getElementById("goToJoinBtn");
    const loginBtn = document.getElementById("goToLoginBtn");

    // 2. 기본 정보 및 테마 색상 연동 세팅
    const urlParams = new URLSearchParams(location.search);
    const churchId = urlParams.get("churchId") || localStorage.getItem("currentChurchId") || localStorage.getItem("yetalkCurrentChurchId") || localStorage.getItem("yetalkMyChurchId") || "fAKyQftAh3qPnsuRPSVz";
    let churchName = urlParams.get("churchName") || localStorage.getItem("yetalkMyChurchName") || "예톡 모델하우스 교회";

    document.getElementById("headerTitle").textContent = `${churchName} 초청장`;

    // 💡 교회 메인과 연동된 테마 색상 자동 반영
    const savedTheme = localStorage.getItem(`yetalkChurchTheme_${churchId}`) || localStorage.getItem("yetalkThemeColor") || "blue";
    const themeColors = {
        white: "#334155",
        black: "#0f172a",
        blue: "#0284c7",
        pink: "#97266d"
    };
    const activeColor = themeColors[savedTheme] || "#97266d";
    document.documentElement.style.setProperty('--theme-color', activeColor);

    let currentMode = "A";
    let isManager = false;

    const textA = `1. 우리교회 앱과 홈페이지가 만들어졌습니다.\n2. 성도님들을 환영합니다.\n3. 교회의 알림과 공지가 개인 예톡앱에서 바로 볼 수 있습니다.\n4. 행복한 교제와 은혜가 넘치는 공간에 당신을 초대합니다.`;
    const textB = `목사님! 우리교회가 잘 사용하고 있는 성도와 교회가 함께 연결되는 교회앱 및 홈페이지를 무료로 사용하실 수 있도록 초청드릴게요.\n한번 이용해보시면 정말 만족하실 거에요^^\n함께 예배드리고 은혜를 나누는 축복의 통로가 되길 소망합니다.`;
    let textC = `하나님께서 당신을 사랑한다고 하셔서 초청합니다.\n이번 전도잔치에 오셔서 하나님의 크신 사랑을 마음껏 누리며 이 땅에서와 천국에서도 영원한 평안과 기쁨을 누리시기를 원합니다.`;

    // 3. 버튼 탭 기능
    function updateView() {
        editArea.style.display = "none";
        textContent.style.display = "block";
        editBtn.textContent = "수정";

        tabA.className = currentMode === "A" ? "modernTabBtn active" : "modernTabBtn";
        tabB.className = currentMode === "B" ? "modernTabBtn active" : "modernTabBtn";
        tabC.className = currentMode === "C" ? "modernTabBtn active" : "modernTabBtn";

        if (currentMode === "A") {
            previewCardTitle.textContent = `[${churchName}] 성도초청`;
            textContent.textContent = textA;
            editBtn.style.display = "none";
        } else if (currentMode === "B") {
            previewCardTitle.textContent = `[${churchName}] 목사초대`;
            textContent.textContent = textB;
            editBtn.style.display = "none";
        } else {
            previewCardTitle.textContent = `[${churchName}] 전도초청`;
            textContent.textContent = textC;
            editBtn.style.display = isManager ? "inline-block" : "none";
        }
    }

    tabA.onclick = () => { currentMode = "A"; updateView(); };
    tabB.onclick = () => { currentMode = "B"; updateView(); };
    tabC.onclick = () => { currentMode = "C"; updateView(); };

    function getCurrentBodyText() {
        if (currentMode === "A") return textA;
        if (currentMode === "B") return textB;
        return textC;
    }

    // ⭐ 파이어베이스 실제 호스팅 주소
    const REAL_DOMAIN = "https://yetalk-kr.web.app";
    const inviteUrl = `${REAL_DOMAIN}/assets/church/churchinvite.html?churchId=${encodeURIComponent(churchId)}`;

    // 💡 안드로이드 웹뷰 복사 에러 방지 브릿지 연동
    function silentCopyToClipboard(text) {
        if (window.Android && window.Android.copyToClipboard) {
            window.Android.copyToClipboard(text);
        } else if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(() => fallbackSilentCopy(text));
        } else {
            fallbackSilentCopy(text);
        }
    }

    function fallbackSilentCopy(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(textArea);
    }

    // 화면 하단 스치듯 지나가는 토스트 메시지 함수
    function showQuickToast(msg) {
        let toast = document.getElementById("quickToastMsg");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "quickToastMsg";
            toast.style.cssText = "position:fixed; bottom:90px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.88); color:#fff; padding:12px 18px; border-radius:12px; font-size:14px; font-weight:800; z-index:999999; text-align:center; box-shadow:0 4px 15px rgba(0,0,0,0.3); transition:opacity 0.3s; word-break:keep-all;";
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.style.opacity = "1";
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => { toast.style.display = "none"; }, 300);
        }, 2500);
    }

    // 4. 단일 복사 기능 (클릭 시 복사 후 가벼운 토스트 알림)
    if (copyBtn) {
        copyBtn.onclick = () => {
            const title = currentMode === "A" ? "성도초청" : (currentMode === "B" ? "목사초대" : "전도초청");
            const shareText = `[${churchName} ${title}]\n\n${getCurrentBodyText()}\n\n👇 아래 링크를 눌러 가입하고 함께해요:\n${inviteUrl}`;

            silentCopyToClipboard(shareText);
            showQuickToast("📋 초청글이 복사되었습니다!\n카카오톡이나 문자메시지에 붙여넣어 주세요.");
        };
    }

    joinBtn.onclick = () => { location.href = `../../join.html?churchId=${encodeURIComponent(churchId)}`; };
    loginBtn.onclick = () => { location.href = `../../login.html?churchId=${encodeURIComponent(churchId)}`; };

    editBtn.onclick = () => {
        if (editArea.style.display === "none") {
            editArea.style.display = "block";
            textContent.style.display = "none";
            editTextarea.value = textC;
            editBtn.textContent = "취소";
        } else {
            editArea.style.display = "none";
            textContent.style.display = "block";
            editBtn.textContent = "수정";
        }
    };

    updateView();

    // 5. 파이어베이스 연동 및 관리자 권한 확인
    import("../../firebase.js").then(fb => {
        const { db, doc, getDoc, setDoc, serverTimestamp } = fb;
        getDoc(doc(db, "churches", churchId)).then(snap => {
            if (snap.exists()) {
                const data = snap.data();
                if (data.churchName || data.name) {
                    churchName = data.churchName || data.name;
                    document.getElementById("headerTitle").textContent = `${churchName} 초청장`;
                    updateView();
                }
                if (data.customEvangelismText) {
                    textC = data.customEvangelismText;
                    if (currentMode === "C") textContent.textContent = textC;
                }
                const loginUser = JSON.parse(localStorage.getItem("loginUser") || localStorage.getItem("yetalkUser") || "{}");
                const memberNo = loginUser.memberNo || loginUser.uid;
                if (memberNo && (data.ownerMemberNo === memberNo || loginUser.isAdmin || (data.subManagers && data.subManagers.includes(memberNo)))) {
                    isManager = true;
                    if (currentMode === "C") editBtn.style.display = "inline-block";
                }
            }
        }).catch(err => console.log("DB 데이터 로드 실패:", err));

        saveEditBtn.onclick = () => {
            const newText = editTextarea.value.trim();
            if (!newText) { alert("내용을 입력해주세요."); return; }
            setDoc(doc(db, "churches", churchId), { customEvangelismText: newText, updatedAt: serverTimestamp() }, { merge: true })
            .then(() => {
                textC = newText;
                textContent.textContent = textC;
                editArea.style.display = "none";
                textContent.style.display = "block";
                editBtn.textContent = "수정";
                alert("성공적으로 저장되었습니다!");
            })
            .catch(err => alert("저장 실패: " + err.message));
        };
    }).catch(err => console.log("Firebase 지연 오류"));

    // 6. ⭐ 1초 후 가입창(정회원 등록 유도) 팝업 자동 실행
    const isLoggedIn = localStorage.getItem("loginUser") || localStorage.getItem("yetalkUser");
    if (urlParams.has("churchId") && !isLoggedIn) {
        setTimeout(() => {
            const wantJoin = confirm(`⛪ ${churchName} 초청장을 확인하셨나요?\n\n정회원으로 등록하고 우리 교회 성도 공간을 이용하시려면 지금 '간편 회원가입'을 진행해 주세요!`);
            if (wantJoin) {
                location.href = `../../join.html?churchId=${encodeURIComponent(churchId)}`;
            }
        }, 1000);
    }
});