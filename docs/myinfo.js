/*==================================================
YETALK MYINFO.JS
- 이름/핸드폰 번호 자동 덮어쓰기 방지 (빈 칸 유지)
- 실시간 ID 자동 연동
- 핸드폰 번호 숫자만 허용
- 앱 제작 및 정보 저장 처리
==================================================*/

import {
    db,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "./firebase.js";

/* DOM 요소 */
const userNameInput = document.getElementById("userName");
const userIdInput = document.getElementById("userId");
const userPwInput = document.getElementById("userPw");
const userAddrInput = document.getElementById("userAddr");

const userPhoneInput = document.getElementById("userPhone");
const bizNameInput = document.getElementById("bizName");
const bizAccountInput = document.getElementById("bizAccount");

let memberNo = "";

function cleanText(val) {
    return String(val ?? "").trim();
}

function cleanId(val) {
    return cleanText(val).replace(/\s+/g, "").toLowerCase();
}

/* 1. 이름 입력 시 ID 자동 채움 (실시간 연동) */
if (userNameInput) {
    userNameInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (!userIdInput) return;
        userIdInput.value = val.toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
    });
}

/* 2. 핸드폰 번호 숫자만 입력 허용 */
if (userPhoneInput) {
    userPhoneInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });
}

/* 3. 화면 시작 시 실행 (임의의 예전 값 강제 주입 제거) */
async function loadMemberInfo() {
    const savedLoginUser = localStorage.getItem("loginUser");
    let parsedUser = null;
    if (savedLoginUser) {
        try { parsedUser = JSON.parse(savedLoginUser); } catch(e) {}
    }

    memberNo = parsedUser?.memberNo || localStorage.getItem("memberNo") || "";

    // 💡 화면 켤 때 입력창을 비워두어 placeholder 안내 문구가 그대로 보이도록 설정
    if (userNameInput) userNameInput.value = "";
    if (userPhoneInput) userPhoneInput.value = "";
}

/* 4. 앱 등록/신청 처리 */
window.submitAppRequest = async function(appType) {
    const name = cleanText(userNameInput?.value);
    const id = cleanId(userIdInput?.value);
    const addr = cleanText(userAddrInput?.value);
    const phone = cleanText(userPhoneInput?.value);
    const biz = cleanText(bizNameInput?.value);
    const account = cleanText(bizAccountInput?.value);

    if (!name) {
        alert("이름을 입력해 주세요.");
        userNameInput?.focus();
        return;
    }
    if (!id) {
        alert("아이디를 입력해 주세요.");
        userIdInput?.focus();
        return;
    }

    // 최신 정보로 갱신
    localStorage.setItem("yetalkUserName", name);
    localStorage.setItem("yetalkUserNick", name);
    localStorage.setItem("yetalkUserId", id);
    if (addr) localStorage.setItem("yetalkUserAddr", addr);
    if (phone) localStorage.setItem("yetalkUserPhone", phone);
    if (biz) localStorage.setItem("yetalkBizName", biz);
    if (account) localStorage.setItem("yetalkBizAccount", account);

    // Firebase 연동
    if (memberNo && db) {
        try {
            const updatePayload = {
                name: name,
                yetalkId: id,
                address: addr,
                phone: phone,
                bizName: biz,
                bizAccount: account,
                requestedAppType: appType,
                updatedAt: serverTimestamp()
            };

            const userRef = doc(db, "users", memberNo);
            await updateDoc(userRef, updatePayload);
        } catch (err) {
            console.warn("Firestore 저장 알림:", err);
        }
    }

    const appTitles = {
        personal: "무료개인앱 등록",
        business: "사업체(교회/의원/상점) 비즈니스 앱 신청",
        church: "교회/모임 커뮤니티 앱 신청"
    };

    alert(`[${appTitles[appType] || '앱'}] 신청이 정상 완료되었습니다! 🚀`);
    location.href = "myapp_home.html";
};

window.addEventListener("DOMContentLoaded", () => {
    loadMemberInfo();
});