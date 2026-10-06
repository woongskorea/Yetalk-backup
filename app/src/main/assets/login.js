/*==================================================
YETALK LOGIN.JS (관리자 7777 예외 적용 버전)
==================================================*/

import {
    db,
    collection,
    getDocs,
    query,
    where
} from "./firebase.js";

/*==================================================
DOM
==================================================*/

const userName = document.getElementById("userName");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const joinBtn = document.getElementById("joinBtn");

/*==================================================
문자열 정리
==================================================*/

function cleanText(value) {
    return String(value ?? "").trim();
}

function normalizeLoginName(value) {
    return String(value ?? "")
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}

function cleanYetalkId(value) {
    return cleanText(value).replace(/\s+/g, "");
}

function normalizeYetalkId(value) {
    return cleanYetalkId(value).toLowerCase();
}

async function hashPassword(passwordValue, saltValue) {
    const source = `${String(saltValue || "")}:${String(passwordValue || "")}`;
    const encoded = new TextEncoder().encode(source);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function getMemberRole(userData) {
    const savedRole = cleanText(userData?.role).toLowerCase();
    const savedGrade = Number(userData?.grade || 0);
    const isAdmin =
        savedRole === "admin" ||
        userData?.admin === true ||
        userData?.isAdmin === true ||
        savedGrade >= 9;

    return isAdmin ? "admin" : "member";
}

function getMemberGrade(userData, role) {
    if (role === "admin") {
        return 9;
    }
    const savedGrade = Number(userData?.grade);
    if (Number.isFinite(savedGrade) && savedGrade >= 0) {
        return savedGrade;
    }
    return 0;
}

function saveLoginInformation(memberNo, userData) {
    const savedName = cleanText(userData.name) || "예톡 회원";
    const savedYetalkId = cleanYetalkId(userData.yetalkId);
    const savedYetalkIdNormalized = cleanText(userData.yetalkIdNormalized) || normalizeYetalkId(savedYetalkId);
    const savedFavoriteWord = cleanText(userData.favoriteWord);
    const savedProfileColor = cleanText(userData.profileColor);
    const savedRole = getMemberRole(userData);
    const savedGrade = getMemberGrade(userData, savedRole);

    const loginUser = {
        memberNo: memberNo,
        memberId: memberNo,
        name: savedName,
        yetalkId: savedYetalkId,
        yetalkIdNormalized: savedYetalkIdNormalized,
        favoriteWord: savedFavoriteWord,
        profileColor: savedProfileColor,
        role: savedRole,
        grade: savedGrade,
        churchId: cleanText(userData.churchId) || "yetalk",
        churchName: cleanText(userData.churchName) || "예톡라운지"
    };

    localStorage.setItem("loginUser", JSON.stringify(loginUser));
    localStorage.setItem("memberNo", memberNo);
    localStorage.setItem("memberId", memberNo);

    if (savedYetalkId) {
        localStorage.setItem("yetalkId", savedYetalkId);
    } else {
        localStorage.removeItem("yetalkId");
    }

    return loginUser;
}

function checkExistingLogin() {
    try {
        const savedLogin = localStorage.getItem("loginUser");
        if (!savedLogin) return false;

        const loginUser = JSON.parse(savedLogin);
        if (!loginUser || typeof loginUser !== "object") {
            clearInvalidLogin();
            return false;
        }

        const savedMemberNo = cleanText(
            loginUser.memberNo ||
            loginUser.memberId ||
            localStorage.getItem("memberNo") ||
            localStorage.getItem("memberId")
        );

        if (!savedMemberNo) {
            clearInvalidLogin();
            return false;
        }

        loginUser.memberNo = savedMemberNo;
        loginUser.memberId = savedMemberNo;
        localStorage.setItem("loginUser", JSON.stringify(loginUser));
        localStorage.setItem("memberNo", savedMemberNo);
        localStorage.setItem("memberId", savedMemberNo);

        location.replace("index.html");
        return true;
    } catch (error) {
        console.error("자동 로그인 정보 확인 오류:", error);
        clearInvalidLogin();
        return false;
    }
}

function clearInvalidLogin() {
    const loginKeys = ["loginUser", "memberNo", "memberId", "yetalkId"];
    loginKeys.forEach(key => localStorage.removeItem(key));
}

window.addEventListener("DOMContentLoaded", () => {
    const alreadyLoggedIn = checkExistingLogin();
    if (alreadyLoggedIn) return;

    userName?.focus();

    userName?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            password?.focus();
        }
    });

    password?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            login();
        }
    });
});

loginBtn?.addEventListener("click", login);
joinBtn?.addEventListener("click", () => {
    location.href = "join.html";
});

function setLoginLoading(isLoading) {
    if (!loginBtn) return;
    loginBtn.disabled = isLoading;
    loginBtn.textContent = isLoading ? "로그인 중..." : "로그인";
}

async function login() {
    if (loginBtn?.disabled) return;

    const name = cleanText(userName?.value);
    const passwordValue = String(password?.value || "");

    if (!name) {
        alert("이름을 입력하세요.");
        userName?.focus();
        return;
    }

    if (!passwordValue) {
        alert("비밀번호를 입력하세요.");
        password?.focus();
        return;
    }

    setLoginLoading(true);

    try {
        const loginName = normalizeLoginName(name);
        const usersRef = collection(db, "users");
        const sameNameQuery = query(usersRef, where("loginName", "==", loginName));
        const snapshot = await getDocs(sameNameQuery);

        if (snapshot.empty) {
            alert("이름 또는 비밀번호가 맞지 않습니다.");
            password?.focus();
            password?.select();
            return;
        }

        let matchedUser = null;
        let matchedMemberNo = "";

        for (const userDocument of snapshot.docs) {
            const userData = userDocument.data();
            const accountStatus = cleanText(userData.status) || "active";

            if (accountStatus === "deleted") continue;

            // ⭐ [관리자 7777 임시 예외 처리] 문서 ID가 'admin'이고 입력한 비번이 '7777'이면 즉시 통과!
            if (userDocument.id === "admin" && passwordValue === "7777") {
                matchedUser = userData;
                matchedMemberNo = userDocument.id;
                break;
            }

            const savedSalt = cleanText(userData.passwordSalt);
            const savedHash = cleanText(userData.passwordHash);

            if (!savedSalt || !savedHash) continue;

            const inputHash = await hashPassword(passwordValue, savedSalt);

            if (inputHash === savedHash) {
                matchedUser = userData;
                matchedMemberNo = userDocument.id;
                break;
            }
        }

        if (!matchedUser || !matchedMemberNo) {
            alert("이름 또는 비밀번호가 맞지 않습니다.");
            password?.focus();
            password?.select();
            return;
        }

        const accountStatus = cleanText(matchedUser.status) || "active";
        if (accountStatus === "deleted") {
            alert("탈퇴 처리된 회원입니다.");
            return;
        }
        if (accountStatus === "blocked" || accountStatus === "suspended") {
            alert("현재 이용이 제한된 회원입니다.");
            return;
        }

        const loginUser = saveLoginInformation(matchedMemberNo, matchedUser);

        console.log("로그인 완료:", {
            memberNo: loginUser.memberNo,
            name: loginUser.name,
            role: loginUser.role
        });

        location.replace("index.html");

    } catch (error) {
        console.error("로그인 오류:", error);
        alert(error?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
        setLoginLoading(false);
    }
}