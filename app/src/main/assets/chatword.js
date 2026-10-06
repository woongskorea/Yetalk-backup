/*==================================================
YETALK CHATWORD.JS

말씀나눔

1. 나의 오늘 말씀
   - LocalStorage에서 읽기
   - 본인에게만 표시

2. 나의 적용·묵상
   - LocalStorage 날짜별 저장
   - Firebase 사용 없음

3. 담임목사 대표 묵상
   - 교회별 하루 1개
   - Firestore 저장

4. 성도 반응
   - 하트 / 아멘
   - 회원별 한 번만 가능
   - 다시 누르면 취소

5. 성도 댓글
   - 최근 20개만 읽기
   - 텍스트만 허용

현재 작성 권한:
admin

향후 auth.js 연결 후:
admin / pastor / minister
==================================================*/


/*==================================================
FIREBASE IMPORT
==================================================*/

import {

    db,

    doc,
    setDoc,
    getDoc,

    collection,
    getDocs,

    query,
    orderBy,
    limit,

    serverTimestamp,
    runTransaction,
    increment

} from "./firebase.js";


/*==================================================
설정
==================================================*/

const COMMENT_LIMIT = 20;

const LOCAL_WORD_DATE =
    "todayDate";

const LOCAL_WORD_RECEIVED =
    "todayWordReceived";

const LOCAL_WORD_TITLE =
    "todayWordTitle";

const LOCAL_WORD_TEXT =
    "todayWordText";

const LOCAL_WORD_CATEGORY =
    "todayCategory";

const LOCAL_LOGIN_USER =
    "loginUser";

const LOCAL_MEDITATION_PREFIX =
    "chatwordMyMeditation_";

const LOCAL_WORD_ARCHIVE =
    "chatwordMyWordArchive";


/*==================================================
현재 상태
==================================================*/

let loginUser = null;

let todayWord = null;

let currentChurchId = "";

let currentChurchName = "";

let todayKey = "";

let dayDocumentId = "";

let pastorPost = null;

let isWritingPastorPost = false;

let isSendingComment = false;

let meditationSaveTimer = null;

let toastTimer = null;


/*==================================================
DOM
==================================================*/

const wordHeaderChurch =
    document.getElementById(
        "wordHeaderChurch"
    );

const todayDate =
    document.getElementById(
        "todayDate"
    );

const myWordSection =
    document.getElementById(
        "myWordSection"
    );

const myWordTitle =
    document.getElementById(
        "myWordTitle"
    );

const myWordText =
    document.getElementById(
        "myWordText"
    );

const myWordCategory =
    document.getElementById(
        "myWordCategory"
    );

const myMeditationInput =
    document.getElementById(
        "myMeditationInput"
    );

const meditationSaveState =
    document.getElementById(
        "meditationSaveState"
    );

const saveMeditationBtn =
    document.getElementById(
        "saveMeditationBtn"
    );

const pastorEmpty =
    document.getElementById(
        "pastorEmpty"
    );

const pastorCard =
    document.getElementById(
        "pastorCard"
    );

const pastorName =
    document.getElementById(
        "pastorName"
    );

const pastorTime =
    document.getElementById(
        "pastorTime"
    );

const pastorEditBtn =
    document.getElementById(
        "pastorEditBtn"
    );

const pastorWordTitle =
    document.getElementById(
        "pastorWordTitle"
    );

const pastorWordText =
    document.getElementById(
        "pastorWordText"
    );

const pastorMeditation =
    document.getElementById(
        "pastorMeditation"
    );

const heartBtn =
    document.getElementById(
        "heartBtn"
    );

const heartCount =
    document.getElementById(
        "heartCount"
    );

const amenBtn =
    document.getElementById(
        "amenBtn"
    );

const amenCount =
    document.getElementById(
        "amenCount"
    );

const pastorWriteBox =
    document.getElementById(
        "pastorWriteBox"
    );

const pastorMeditationInput =
    document.getElementById(
        "pastorMeditationInput"
    );

const pastorSubmitBtn =
    document.getElementById(
        "pastorSubmitBtn"
    );

const commentCount =
    document.getElementById(
        "commentCount"
    );

const commentRefreshBtn =
    document.getElementById(
        "commentRefreshBtn"
    );

const commentList =
    document.getElementById(
        "commentList"
    );

const commentInput =
    document.getElementById(
        "commentInput"
    );

const commentSendBtn =
    document.getElementById(
        "commentSendBtn"
    );

const toast =
    document.getElementById(
        "toast"
    );


/*==================================================
시작
==================================================*/

window.addEventListener(

    "DOMContentLoaded",

    initializeChatword

);


/*==================================================
초기화
==================================================*/

async function initializeChatword() {

    todayKey =
        getTodayKey();

    loginUser =
        loadLoginUser();

    todayWord =
        loadTodayWord();

    currentChurchId =
        cleanText(
            localStorage.getItem(
                "currentChurch"
            )
        ) ||
        cleanText(
            loginUser?.churchId
        ) ||
        "yetalk";

    currentChurchName =
        cleanText(
            loginUser?.churchName
        ) ||
        currentChurchId ||
        "예톡라운지";

    dayDocumentId =
        makeSafeDocumentId(
            currentChurchId +
            "_" +
            todayKey
        );

    showBasicInformation();

    showMyTodayWord();

    loadMyMeditation();

    bindEvents();

    updatePastorWritingAuthority();

    await loadPastorPost();

}


/*==================================================
문자열 정리
==================================================*/

function cleanText(value) {

    return String(
        value ?? ""
    ).trim();

}


/*==================================================
오늘 날짜
YYYY-MM-DD
==================================================*/

function getTodayKey() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/*==================================================
화면 날짜
==================================================*/

function getTodayLabel() {

    const now =
        new Date();

    return (

        now.getFullYear() +
        "년 " +
        (now.getMonth() + 1) +
        "월 " +
        now.getDate() +
        "일"

    );

}


/*==================================================
현재 시각
==================================================*/

function getNowLabel() {

    const now =
        new Date();

    let hour =
        now.getHours();

    const minute =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );

    const period =
        hour >= 12
            ? "오후"
            : "오전";

    if (hour === 0) {

        hour = 12;

    } else if (hour > 12) {

        hour -= 12;

    }

    return (
        period +
        " " +
        hour +
        ":" +
        minute
    );

}


/*==================================================
문서 ID 안전 처리
==================================================*/

function makeSafeDocumentId(value) {

    return String(
        value || "yetalk"
    )
        .replace(/[\/.#$\[\]]/g, "_")
        .replace(/\s+/g, "_")
        .slice(0, 180);

}


/*==================================================
로그인 사용자 읽기
==================================================*/

function loadLoginUser() {

    try {

        const saved =
            localStorage.getItem(
                LOCAL_LOGIN_USER
            );

        if (!saved) {

            return createGuestUser();

        }

        const parsed =
            JSON.parse(
                saved
            );

        if (
            !parsed ||
            typeof parsed !== "object"
        ) {

            return createGuestUser();

        }

        return {

            memberNo:
                cleanText(
                    parsed.memberNo ||
                    parsed.memberId
                ) ||
                createLocalMemberNo(),

            name:
                cleanText(
                    parsed.name
                ) ||
                "예톡 회원",

            favoriteWord:
                cleanText(
                    parsed.favoriteWord
                ) ||
                "은혜",

            role:
                cleanText(
                    parsed.role
                ).toLowerCase() ||
                "member",

            grade:
                Number(
                    parsed.grade || 0
                ),

            churchId:
                cleanText(
                    parsed.churchId
                ) ||
                "yetalk",

            churchName:
                cleanText(
                    parsed.churchName
                ) ||
                "예톡라운지"

        };

    }

    catch (error) {

        console.error(
            "로그인 정보 확인 오류:",
            error
        );

        return createGuestUser();

    }

}


/*==================================================
임시 사용자
==================================================*/

function createGuestUser() {

    return {

        memberNo:
            createLocalMemberNo(),

        name:
            "예톡 회원",

        favoriteWord:
            "은혜",

        role:
            "member",

        grade:
            0,

        churchId:
            "yetalk",

        churchName:
            "예톡라운지"

    };

}


/*==================================================
임시 회원번호
==================================================*/

function createLocalMemberNo() {

    let memberNo =
        localStorage.getItem(
            "yetalkLocalMemberNo"
        );

    if (memberNo) {

        return memberNo;

    }

    memberNo =
        "local_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 8);

    localStorage.setItem(
        "yetalkLocalMemberNo",
        memberNo
    );

    return memberNo;

}


/*==================================================
기본 화면 정보
==================================================*/

function showBasicInformation() {

    if (wordHeaderChurch) {

        wordHeaderChurch.textContent =
            currentChurchName;

    }

    if (todayDate) {

        todayDate.textContent =
            getTodayLabel();

    }

}


/*==================================================
오늘 말씀 읽기
==================================================*/

function loadTodayWord() {

    const savedDate =
        localStorage.getItem(
            LOCAL_WORD_DATE
        );

    const received =
        localStorage.getItem(
            LOCAL_WORD_RECEIVED
        );

    const title =
        cleanText(
            localStorage.getItem(
                LOCAL_WORD_TITLE
            )
        );

    const text =
        cleanText(
            localStorage.getItem(
                LOCAL_WORD_TEXT
            )
        );

    const category =
        cleanText(
            localStorage.getItem(
                LOCAL_WORD_CATEGORY
            )
        );

    if (
        savedDate !== todayKey ||
        received !== "true" ||
        !text
    ) {

        return null;

    }

    return {

        date:
            savedDate,

        title:
            title ||
            "오늘 나의 말씀",

        text:
            text,

        category:
            category

    };

}


/*==================================================
나의 오늘 말씀 표시
==================================================*/

function showMyTodayWord() {

    if (!todayWord) {

        myWordSection?.classList.add(
            "noWord"
        );

        if (myWordTitle) {

            myWordTitle.textContent =
                "오늘 받은 말씀이 없습니다.";

        }

        if (myWordText) {

            myWordText.textContent =
                "예톡 홈에서 오늘 주시는 말씀을 먼저 받아보세요.";

        }

        if (myWordCategory) {

            myWordCategory.textContent =
                "";

        }

        if (myMeditationInput) {

            myMeditationInput.disabled =
                true;

            myMeditationInput.placeholder =
                "오늘 말씀을 받은 후 작성할 수 있습니다.";

        }

        if (saveMeditationBtn) {

            saveMeditationBtn.disabled =
                true;

        }

        return;

    }

    myWordSection?.classList.remove(
        "noWord"
    );

    if (myWordTitle) {

        myWordTitle.textContent =
            todayWord.title;

    }

    if (myWordText) {

        myWordText.textContent =
            todayWord.text;

    }

    if (myWordCategory) {

        myWordCategory.textContent =
            todayWord.category
                ? "주제 · " +
                  todayWord.category
                : "";

    }

    if (myMeditationInput) {

        myMeditationInput.disabled =
            false;

    }

    if (saveMeditationBtn) {

        saveMeditationBtn.disabled =
            false;

    }

    archiveTodayWord();

}


/*==================================================
오늘 말씀 개인 보관함 저장

같은 날짜는 한 번만 저장
서버 사용 없음
==================================================*/

function archiveTodayWord() {

    if (!todayWord) {

        return;

    }

    try {

        const saved =
            localStorage.getItem(
                LOCAL_WORD_ARCHIVE
            );

        let archive =
            saved
                ? JSON.parse(saved)
                : [];

        if (!Array.isArray(archive)) {

            archive = [];

        }

        const existingIndex =
            archive.findIndex(

                item =>
                    item.date ===
                    todayKey

            );

        const oldMeditation =
            existingIndex >= 0
                ? cleanText(
                    archive[
                        existingIndex
                    ]?.meditation
                )
                : "";

        const item = {

            date:
                todayKey,

            title:
                todayWord.title,

            text:
                todayWord.text,

            category:
                todayWord.category,

            meditation:
                oldMeditation,

            savedAt:
                Date.now()

        };

        if (existingIndex >= 0) {

            archive[
                existingIndex
            ] = item;

        } else {

            archive.unshift(
                item
            );

        }

        /*
        개인 보관함은 최근 365일만 유지
        */

        archive =
            archive.slice(
                0,
                365
            );

        localStorage.setItem(

            LOCAL_WORD_ARCHIVE,

            JSON.stringify(
                archive
            )

        );

    }

    catch (error) {

        console.error(
            "나의 말씀 보관 실패:",
            error
        );

    }

}


/*==================================================
오늘 묵상 LocalStorage 키
==================================================*/

function getMeditationKey() {

    return (
        LOCAL_MEDITATION_PREFIX +
        todayKey
    );

}


/*==================================================
나의 묵상 읽기
==================================================*/

function loadMyMeditation() {

    if (!myMeditationInput) {

        return;

    }

    const saved =
        localStorage.getItem(
            getMeditationKey()
        ) || "";

    myMeditationInput.value =
        saved;

    showMeditationSaveState(
        saved
            ? "저장됨"
            : "자동 저장",
        Boolean(saved)
    );

}


/*==================================================
나의 묵상 저장
==================================================*/

function saveMyMeditation(
    showMessage = true
) {

    if (
        !todayWord ||
        !myMeditationInput
    ) {

        return;

    }

    const text =
        myMeditationInput.value.trim();

    if (text) {

        localStorage.setItem(
            getMeditationKey(),
            text
        );

    } else {

        localStorage.removeItem(
            getMeditationKey()
        );

    }

    updateArchiveMeditation(
        text
    );

    showMeditationSaveState(
        text
            ? "저장됨"
            : "자동 저장",
        Boolean(text)
    );

    if (showMessage) {

        showToast(
            text
                ? "나의 적용·묵상이 저장되었습니다."
                : "작성한 묵상이 비워졌습니다."
        );

    }

}


/*==================================================
개인 말씀 보관함 묵상 갱신
==================================================*/

function updateArchiveMeditation(text) {

    try {

        const saved =
            localStorage.getItem(
                LOCAL_WORD_ARCHIVE
            );

        if (!saved) {

            return;

        }

        const archive =
            JSON.parse(
                saved
            );

        if (!Array.isArray(archive)) {

            return;

        }

        const item =
            archive.find(

                value =>
                    value.date ===
                    todayKey

            );

        if (!item) {

            return;

        }

        item.meditation =
            text;

        item.updatedAt =
            Date.now();

        localStorage.setItem(

            LOCAL_WORD_ARCHIVE,

            JSON.stringify(
                archive
            )

        );

    }

    catch (error) {

        console.error(
            "보관함 묵상 갱신 실패:",
            error
        );

    }

}


/*==================================================
저장 상태 표시
==================================================*/

function showMeditationSaveState(
    message,
    saved
) {

    if (!meditationSaveState) {

        return;

    }

    meditationSaveState.textContent =
        message;

    meditationSaveState.classList.toggle(
        "saved",
        saved
    );

}


/*==================================================
작성 권한

현재:
admin

미래 auth.js 연결 준비:
pastor
minister
==================================================*/

function canWritePastorMeditation() {

    const role =
        cleanText(
            loginUser?.role
        ).toLowerCase();

    return [

        "admin",
        "pastor",
        "minister"

    ].includes(
        role
    );

}


/*==================================================
담임목사 작성창 권한 적용
==================================================*/

function updatePastorWritingAuthority() {

    const allowed =
        canWritePastorMeditation();

    if (!allowed) {

        pastorWriteBox?.classList.add(
            "hidden"
        );

        pastorEditBtn?.classList.add(
            "hidden"
        );

        return;

    }

    /*
    글이 아직 없으면 작성창 표시
    */

    if (!pastorPost) {

        pastorWriteBox?.classList.remove(
            "hidden"
        );

    }

}


/*==================================================
오늘 대표 묵상 문서
==================================================*/

function getPastorPostReference() {

    return doc(
        db,
        "churchWordDays",
        dayDocumentId
    );

}


/*==================================================
담임목사 대표 묵상 불러오기
==================================================*/

async function loadPastorPost() {

    setPastorLoading(
        true
    );

    try {

        const postRef =
            getPastorPostReference();

        const snapshot =
            await getDoc(
                postRef
            );

        if (!snapshot.exists()) {

            pastorPost =
                null;

            showPastorEmpty();

            await loadComments();

            return;

        }

        pastorPost = {

            id:
                snapshot.id,

            ...snapshot.data()

        };

        showPastorPost();

        await checkMyReactions();

        await loadComments();

    }

    catch (error) {

        console.error(
            "대표 묵상 불러오기 오류:",
            error
        );

        showPastorEmpty();

        showToast(
            getFirebaseErrorMessage(
                error,
                "대표 묵상을 불러오지 못했습니다."
            )
        );

    }

    finally {

        setPastorLoading(
            false
        );

        updatePastorWritingAuthority();

    }

}


/*==================================================
대표 묵상 로딩
==================================================*/

function setPastorLoading(isLoading) {

    if (!pastorEmpty) {

        return;

    }

    if (isLoading) {

        pastorEmpty.classList.remove(
            "hidden"
        );

        pastorEmpty.innerHTML = `

            <div class="pastorEmptyIcon">
                📖
            </div>

            <strong>
                오늘의 묵상을 불러오는 중입니다.
            </strong>

            <span>
                잠시만 기다려 주세요.
            </span>

        `;

    }

}


/*==================================================
대표 묵상 없음
==================================================*/

function showPastorEmpty() {

    pastorCard?.classList.add(
        "hidden"
    );

    pastorEmpty?.classList.remove(
        "hidden"
    );

    if (pastorEmpty) {

        pastorEmpty.innerHTML = `

            <div class="pastorEmptyIcon">
                ✝️
            </div>

            <strong>
                아직 오늘의 묵상이 등록되지 않았습니다.
            </strong>

            <span>
                담임목사님이 작성하면 이곳에 표시됩니다.
            </span>

        `;

    }

    setCommentEnabled(
        false
    );

    updatePastorWritingAuthority();

}


/*==================================================
대표 묵상 표시
==================================================*/

function showPastorPost() {

    if (!pastorPost) {

        showPastorEmpty();

        return;

    }

    pastorEmpty?.classList.add(
        "hidden"
    );

    pastorCard?.classList.remove(
        "hidden"
    );

    pastorWriteBox?.classList.add(
        "hidden"
    );

    if (pastorName) {

        pastorName.textContent =
            cleanText(
                pastorPost.writerName
            ) ||
            "담임목사";

    }

    if (pastorTime) {

        pastorTime.textContent =
            cleanText(
                pastorPost.displayTime
            ) ||
            getTodayLabel();

    }

    if (pastorWordTitle) {

        pastorWordTitle.textContent =
            cleanText(
                pastorPost.wordTitle
            )
                ? "📖 " +
                  pastorPost.wordTitle
                : "";

    }

    if (pastorWordText) {

        pastorWordText.textContent =
            cleanText(
                pastorPost.wordText
            );

    }

    if (pastorMeditation) {

        pastorMeditation.textContent =
            cleanText(
                pastorPost.meditation
            );

    }

    if (heartCount) {

        heartCount.textContent =
            String(
                Number(
                    pastorPost.heartCount ||
                    0
                )
            );

    }

    if (amenCount) {

        amenCount.textContent =
            String(
                Number(
                    pastorPost.amenCount ||
                    0
                )
            );

    }

    if (
        canWritePastorMeditation()
    ) {

        pastorEditBtn?.classList.remove(
            "hidden"
        );

    } else {

        pastorEditBtn?.classList.add(
            "hidden"
        );

    }

    setCommentEnabled(
        true
    );

}


/*==================================================
대표 묵상 등록·수정
==================================================*/

async function savePastorMeditation() {

    if (
        isWritingPastorPost ||
        !canWritePastorMeditation()
    ) {

        return;

    }

    if (!todayWord) {

        showToast(
            "먼저 오늘 말씀을 받아주세요."
        );

        return;

    }

    const meditation =
        cleanText(
            pastorMeditationInput?.value
        );

    if (!meditation) {

        showToast(
            "대표 묵상 내용을 작성해 주세요."
        );

        pastorMeditationInput?.focus();

        return;

    }

    if (meditation.length > 1000) {

        showToast(
            "대표 묵상은 1,000자 이하로 작성해 주세요."
        );

        return;

    }

    isWritingPastorPost =
        true;

    setPastorSubmitLoading(
        true
    );

    try {

        const postRef =
            getPastorPostReference();

        const isEdit =
            Boolean(
                pastorPost
            );

        const data = {

            churchId:
                currentChurchId,

            churchName:
                currentChurchName,

            date:
                todayKey,

            wordTitle:
                todayWord.title,

            wordText:
                todayWord.text,

            wordCategory:
                todayWord.category,

            meditation:
                meditation,

            writerMemberNo:
                loginUser.memberNo,

            writerName:
                loginUser.name,

            writerRole:
                loginUser.role,

            displayTime:
                getTodayLabel() +
                " · " +
                getNowLabel(),

            updatedAt:
                serverTimestamp(),

            updatedAtMs:
                Date.now()

        };

        if (!isEdit) {

            data.createdAt =
                serverTimestamp();

            data.createdAtMs =
                Date.now();

            data.heartCount =
                0;

            data.amenCount =
                0;

            data.commentCount =
                0;

        }

        await setDoc(

            postRef,

            data,

            {
                merge:
                    true
            }

        );

        pastorMeditationInput.value =
            "";

        pastorPost = {

            ...(pastorPost || {}),

            ...data,

            heartCount:
                Number(
                    pastorPost?.heartCount ||
                    0
                ),

            amenCount:
                Number(
                    pastorPost?.amenCount ||
                    0
                ),

            commentCount:
                Number(
                    pastorPost?.commentCount ||
                    0
                )

        };

        showPastorPost();

        pastorWriteBox?.classList.add(
            "hidden"
        );

        showToast(
            isEdit
                ? "오늘의 대표 묵상이 수정되었습니다."
                : "오늘의 대표 묵상이 등록되었습니다."
        );

        await loadPastorPost();

    }

    catch (error) {

        console.error(
            "대표 묵상 저장 오류:",
            error
        );

        showToast(
            getFirebaseErrorMessage(
                error,
                "대표 묵상을 저장하지 못했습니다."
            )
        );

    }

    finally {

        isWritingPastorPost =
            false;

        setPastorSubmitLoading(
            false
        );

    }

}


/*==================================================
대표 묵상 버튼 상태
==================================================*/

function setPastorSubmitLoading(
    isLoading
) {

    if (!pastorSubmitBtn) {

        return;

    }

    pastorSubmitBtn.disabled =
        isLoading;

    pastorSubmitBtn.textContent =
        isLoading
            ? "저장 중..."
            : pastorPost
                ? "오늘 묵상 수정"
                : "오늘 묵상 등록";

}


/*==================================================
대표 묵상 수정창 열기
==================================================*/

function openPastorEditBox() {

    if (
        !pastorPost ||
        !canWritePastorMeditation()
    ) {

        return;

    }

    if (pastorMeditationInput) {

        pastorMeditationInput.value =
            cleanText(
                pastorPost.meditation
            );

    }

    pastorWriteBox?.classList.remove(
        "hidden"
    );

    setPastorSubmitLoading(
        false
    );

    pastorMeditationInput?.focus();

}


/*==================================================
반응 문서
==================================================*/

function getReactionReference(type) {

    const reactionId =
        makeSafeDocumentId(

            type +
            "_" +
            loginUser.memberNo

        );

    return doc(

        collection(

            getPastorPostReference(),

            "reactions"

        ),

        reactionId

    );

}


/*==================================================
내 반응 확인
==================================================*/

async function checkMyReactions() {

    if (!pastorPost) {

        return;

    }

    try {

        const [
            heartSnapshot,
            amenSnapshot
        ] =
            await Promise.all([

                getDoc(
                    getReactionReference(
                        "heart"
                    )
                ),

                getDoc(
                    getReactionReference(
                        "amen"
                    )
                )

            ]);

        heartBtn?.classList.toggle(
            "active",
            heartSnapshot.exists()
        );

        amenBtn?.classList.toggle(
            "active",
            amenSnapshot.exists()
        );

    }

    catch (error) {

        console.error(
            "내 반응 확인 오류:",
            error
        );

    }

}


/*==================================================
하트·아멘 토글
==================================================*/

async function toggleReaction(type) {

    if (!pastorPost) {

        showToast(
            "오늘의 대표 묵상이 아직 없습니다."
        );

        return;

    }

    const button =
        type === "heart"
            ? heartBtn
            : amenBtn;

    if (
        !button ||
        button.disabled
    ) {

        return;

    }

    button.disabled =
        true;

    const postRef =
        getPastorPostReference();

    const reactionRef =
        getReactionReference(
            type
        );

    const countField =
        type === "heart"
            ? "heartCount"
            : "amenCount";

    try {

        let becameActive =
            false;

        await runTransaction(

            db,

            async transaction => {

                const postSnapshot =
                    await transaction.get(
                        postRef
                    );

                if (!postSnapshot.exists()) {

                    throw new Error(
                        "오늘의 대표 묵상이 없습니다."
                    );

                }

                const reactionSnapshot =
                    await transaction.get(
                        reactionRef
                    );

                const oldCount =
                    Number(
                        postSnapshot.data()?.[
                            countField
                        ] || 0
                    );

                if (
                    reactionSnapshot.exists()
                ) {

                    transaction.delete(
                        reactionRef
                    );

                    transaction.update(

                        postRef,

                        {
                            [countField]:
                                Math.max(
                                    0,
                                    oldCount - 1
                                )
                        }

                    );

                    becameActive =
                        false;

                } else {

                    transaction.set(

                        reactionRef,

                        {
                            type:
                                type,

                            memberNo:
                                loginUser.memberNo,

                            memberName:
                                loginUser.name,

                            createdAt:
                                serverTimestamp(),

                            createdAtMs:
                                Date.now()
                        }

                    );

                    transaction.update(

                        postRef,

                        {
                            [countField]:
                                oldCount + 1
                        }

                    );

                    becameActive =
                        true;

                }

            }

        );

        button.classList.toggle(
            "active",
            becameActive
        );

        await refreshReactionCounts();

    }

    catch (error) {

        console.error(
            "반응 저장 오류:",
            error
        );

        showToast(
            getFirebaseErrorMessage(
                error,
                "반응을 저장하지 못했습니다."
            )
        );

    }

    finally {

        button.disabled =
            false;

    }

}


/*==================================================
반응 숫자만 새로 읽기
==================================================*/

async function refreshReactionCounts() {

    try {

        const snapshot =
            await getDoc(
                getPastorPostReference()
            );

        if (!snapshot.exists()) {

            return;

        }

        const data =
            snapshot.data();

        pastorPost = {

            ...(pastorPost || {}),

            ...data

        };

        if (heartCount) {

            heartCount.textContent =
                String(
                    Number(
                        data.heartCount ||
                        0
                    )
                );

        }

        if (amenCount) {

            amenCount.textContent =
                String(
                    Number(
                        data.amenCount ||
                        0
                    )
                );

        }

    }

    catch (error) {

        console.error(
            "반응 숫자 갱신 실패:",
            error
        );

    }

}


/*==================================================
댓글 컬렉션
==================================================*/

function getCommentsCollection() {

    return collection(

        getPastorPostReference(),

        "comments"

    );

}


/*==================================================
댓글 불러오기

최근 20개만 읽어 비용 절약
==================================================*/

async function loadComments() {

    if (!pastorPost) {

        showCommentEmpty(
            "담임목사님의 오늘 묵상이 등록되면 댓글을 남길 수 있습니다."
        );

        if (commentCount) {

            commentCount.textContent =
                "0";

        }

        return;

    }

    if (commentList) {

        commentList.innerHTML = `

            <div class="commentEmpty">
                댓글을 불러오는 중입니다.
            </div>

        `;

    }

    try {

        const commentsQuery =
            query(

                getCommentsCollection(),

                orderBy(
                    "createdAtMs",
                    "desc"
                ),

                limit(
                    COMMENT_LIMIT
                )

            );

        const snapshot =
            await getDocs(
                commentsQuery
            );

        const comments = [];

        snapshot.forEach(

            item => {

                comments.push({

                    id:
                        item.id,

                    ...item.data()

                });

            }

        );

        /*
        화면은 오래된 댓글부터 표시
        */

        comments.reverse();

        renderComments(
            comments
        );

        if (commentCount) {

            commentCount.textContent =
                String(
                    Number(
                        pastorPost.commentCount ??
                        comments.length
                    )
                );

        }

    }

    catch (error) {

        console.error(
            "댓글 불러오기 오류:",
            error
        );

        showCommentEmpty(
            "댓글을 불러오지 못했습니다."
        );

    }

}


/*==================================================
댓글 출력
==================================================*/

function renderComments(comments) {

    if (!commentList) {

        return;

    }

    if (
        !Array.isArray(comments) ||
        comments.length === 0
    ) {

        showCommentEmpty(
            "아직 댓글이 없습니다.\n첫 번째 아멘과 묵상을 남겨보세요."
        );

        return;

    }

    commentList.innerHTML =
        "";

    comments.forEach(

        comment => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "commentItem";

            item.innerHTML = `

                <div class="commentTop">

                    <div class="commentName">

                        ${escapeHTML(
                            comment.nickname ||
                            "은혜 성**"
                        )}

                    </div>

                    <div class="commentTime">

                        ${escapeHTML(
                            comment.displayTime ||
                            ""
                        )}

                    </div>

                </div>

                <div class="commentText">

                    ${formatText(
                        comment.text ||
                        ""
                    )}

                </div>

            `;

            commentList.appendChild(
                item
            );

        }

    );

}


/*==================================================
댓글 없음 표시
==================================================*/

function showCommentEmpty(message) {

    if (!commentList) {

        return;

    }

    commentList.innerHTML = `

        <div class="commentEmpty">

            ${formatText(
                message
            )}

        </div>

    `;

}


/*==================================================
댓글 등록
==================================================*/

async function sendComment() {

    if (
        isSendingComment ||
        !pastorPost
    ) {

        if (!pastorPost) {

            showToast(
                "오늘의 대표 묵상이 등록된 후 댓글을 작성할 수 있습니다."
            );

        }

        return;

    }

    const text =
        cleanText(
            commentInput?.value
        );

    if (!text) {

        showToast(
            "짧은 묵상이나 아멘을 적어주세요."
        );

        commentInput?.focus();

        return;

    }

    if (text.length > 200) {

        showToast(
            "댓글은 200자 이하로 작성해 주세요."
        );

        return;

    }

    isSendingComment =
        true;

    setCommentSendLoading(
        true
    );

    try {

        const commentId =
            makeSafeDocumentId(

                loginUser.memberNo +
                "_" +
                Date.now()

            );

        const commentRef =
            doc(

                getCommentsCollection(),

                commentId

            );

        const nickname =
            createAnonymousNickname(
                loginUser
            );

        const postRef =
            getPastorPostReference();

        await runTransaction(

            db,

            async transaction => {

                const postSnapshot =
                    await transaction.get(
                        postRef
                    );

                if (!postSnapshot.exists()) {

                    throw new Error(
                        "오늘의 대표 묵상이 없습니다."
                    );

                }

                transaction.set(

                    commentRef,

                    {
                        memberNo:
                            loginUser.memberNo,

                        nickname:
                            nickname,

                        text:
                            text,

                        date:
                            todayKey,

                        displayTime:
                            getNowLabel(),

                        createdAt:
                            serverTimestamp(),

                        createdAtMs:
                            Date.now()
                    }

                );

                transaction.update(

                    postRef,

                    {
                        commentCount:
                            increment(1),

                        updatedAt:
                            serverTimestamp()
                    }

                );

            }

        );

        commentInput.value =
            "";

        resizeTextarea(
            commentInput,
            45,
            120
        );

        pastorPost.commentCount =
            Number(
                pastorPost.commentCount ||
                0
            ) + 1;

        if (commentCount) {

            commentCount.textContent =
                String(
                    pastorPost.commentCount
                );

        }

        showToast(
            "댓글이 등록되었습니다."
        );

        await loadComments();

    }

    catch (error) {

        console.error(
            "댓글 등록 오류:",
            error
        );

        showToast(
            getFirebaseErrorMessage(
                error,
                "댓글을 등록하지 못했습니다."
            )
        );

    }

    finally {

        isSendingComment =
            false;

        setCommentSendLoading(
            false
        );

    }

}


/*==================================================
댓글 버튼 상태
==================================================*/

function setCommentSendLoading(
    isLoading
) {

    if (!commentSendBtn) {

        return;

    }

    commentSendBtn.disabled =
        isLoading ||
        !pastorPost;

    commentSendBtn.textContent =
        isLoading
            ? "등록 중"
            : "등록";

}


/*==================================================
댓글 입력 가능 여부
==================================================*/

function setCommentEnabled(enabled) {

    if (commentInput) {

        commentInput.disabled =
            !enabled;

        commentInput.placeholder =
            enabled
                ? "짧은 묵상이나 아멘을 적어보세요."
                : "오늘의 대표 묵상이 등록된 후 작성할 수 있습니다.";

    }

    if (commentSendBtn) {

        commentSendBtn.disabled =
            !enabled;

    }

    if (heartBtn) {

        heartBtn.disabled =
            !enabled;

    }

    if (amenBtn) {

        amenBtn.disabled =
            !enabled;

    }

}


/*==================================================
비실명 닉네임

예:
은혜 최**
==================================================*/

function createAnonymousNickname(user) {

    const favoriteWord =
        cleanText(
            user?.favoriteWord
        )
            .replace(/\s+/g, "")
            .slice(0, 4) ||
        "은혜";

    const name =
        cleanText(
            user?.name
        )
            .replace(/\s+/g, "");

    const hiddenName =
        name
            ? name.charAt(0) +
              "**"
            : "성**";

    return (
        favoriteWord +
        " " +
        hiddenName
    );

}


/*==================================================
이벤트 연결
==================================================*/

function bindEvents() {

    saveMeditationBtn?.addEventListener(

        "click",

        () => {

            saveMyMeditation(
                true
            );

        }

    );


    myMeditationInput?.addEventListener(

        "input",

        () => {

            showMeditationSaveState(
                "저장 중...",
                false
            );

            if (meditationSaveTimer) {

                clearTimeout(
                    meditationSaveTimer
                );

            }

            meditationSaveTimer =
                setTimeout(

                    () => {

                        saveMyMeditation(
                            false
                        );

                    },

                    600

                );

        }

    );


    pastorSubmitBtn?.addEventListener(

        "click",

        savePastorMeditation

    );


    pastorEditBtn?.addEventListener(

        "click",

        openPastorEditBox

    );


    heartBtn?.addEventListener(

        "click",

        () => {

            toggleReaction(
                "heart"
            );

        }

    );


    amenBtn?.addEventListener(

        "click",

        () => {

            toggleReaction(
                "amen"
            );

        }

    );


    commentRefreshBtn?.addEventListener(

        "click",

        async () => {

            await loadPastorPost();

            showToast(
                "말씀나눔을 새로 불러왔습니다."
            );

        }

    );


    commentSendBtn?.addEventListener(

        "click",

        sendComment

    );


    commentInput?.addEventListener(

        "input",

        () => {

            resizeTextarea(
                commentInput,
                45,
                120
            );

        }

    );


    commentInput?.addEventListener(

        "keydown",

        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendComment();

            }

        }

    );

}


/*==================================================
입력창 자동 높이
==================================================*/

function resizeTextarea(
    element,
    minimumHeight,
    maximumHeight
) {

    if (!element) {

        return;

    }

    element.style.height =
        minimumHeight +
        "px";

    element.style.height =
        Math.min(
            element.scrollHeight,
            maximumHeight
        ) +
        "px";

}


/*==================================================
HTML 안전 처리
==================================================*/

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/*==================================================
줄바꿈 처리
==================================================*/

function formatText(value) {

    return escapeHTML(
        value
    ).replace(
        /\n/g,
        "<br>"
    );

}


/*==================================================
Firebase 오류 문구
==================================================*/

function getFirebaseErrorMessage(
    error,
    defaultMessage
) {

    if (
        error?.code ===
        "permission-denied"
    ) {

        return (
            "Firebase 저장 권한이 없습니다. " +
            "보안 규칙을 확인해 주세요."
        );

    }

    if (
        error?.code ===
        "unavailable"
    ) {

        return (
            "인터넷 연결이 불안정합니다. " +
            "잠시 후 다시 시도해 주세요."
        );

    }

    if (
        error?.code ===
        "failed-precondition"
    ) {

        return (
            "Firebase 검색 설정이 아직 준비되지 않았습니다."
        );

    }

    return (
        cleanText(
            error?.message
        ) ||
        defaultMessage
    );

}


/*==================================================
토스트
==================================================*/

function showToast(message) {

    if (!toast) {

        return;

    }

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    if (toastTimer) {

        clearTimeout(
            toastTimer
        );

    }

    toastTimer =
        setTimeout(

            () => {

                toast.classList.remove(
                    "show"
                );

            },

            2200

        );

}