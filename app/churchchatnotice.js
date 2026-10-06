import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where, orderBy } from "./firebase.js";

let noticeList = [];
let isManagerOn = false;

let selectedFileObj = null;
let selectedFileType = null;

const categoryNames = {
    notice: "📢 공지알림", jesus: "✝️ 예수동행", saint: "💎 보배성도", sermon: "📖 목사님 주일설교",
    important: "📌 중요 공지", bulletin: "📄 주보", event: "🎈 행사/봉사"
};

const DEFAULT_WELCOME_NOTICE = {
    id: "default-welcome", category: "notice",
    text: "공지글을 올려주시면 성도님들에게 바로 전달되는 공지창입니다.\n분류에 맞게 올려주시면 자동 저장됩니다.",
    date: "2026.09.03", createdAtMs: 1
};

initAdminState();
loadNotices();
initDynamicChurchName();

// 파일 첨부 시 이름 띄워주기
const photoInput = document.getElementById("chatPhotoInput");
if (photoInput) {
    photoInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            selectedFileObj = e.target.files[0];
            selectedFileType = 'photo';
            document.getElementById("attachPreviewText").innerText = "📷 " + selectedFileObj.name;
        }
    });
}

const fileInput = document.getElementById("chatFileInput");
if (fileInput) {
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            selectedFileObj = e.target.files[0];
            selectedFileType = 'file';
            document.getElementById("attachPreviewText").innerText = "📁 " + selectedFileObj.name;
        }
    });
}

function initAdminState() {
    isManagerOn = localStorage.getItem("yetalk_chat_admin_on") === "true";
}

// ⭐ 유튜브 ID 추출 유틸리티
function extractYoutubeId(linkOrText) {
    if (!linkOrText) return "";
    const match = linkOrText.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) return match[1];
    if (linkOrText.length === 11 && !linkOrText.includes(" ")) return linkOrText;
    return "";
}

window.sendChatNotice = async function() {
    if (!isManagerOn) return;
    const textarea = document.getElementById("chatMessageInput");
    const categorySelect = document.getElementById("chatCategorySelect");

    const text = textarea.value.trim();
    if (!text && !selectedFileObj) {
        showToast("공지 내용이나 사진을 입력해주세요.");
        textarea.focus();
        return;
    }

    const churchId = localStorage.getItem("yetalkMyChurchId") || localStorage.getItem("currentChurchId") || "yetalk-church";
    const today = new Date();
    const dateStr = today.getFullYear() + "." + String(today.getMonth() + 1).padStart(2, "0") + "." + String(today.getDate()).padStart(2, "0");

    const newPost = {
        churchId: churchId,
        category: categorySelect.value,
        text: text,
        date: dateStr,
        createdAtMs: Date.now(),
        attachedFileName: selectedFileObj ? selectedFileObj.name : null,
        attachedFileType: selectedFileType
    };

    try {
        // 1. 공지알림 게시판 저장소에 저장
        const docRef = await addDoc(collection(db, "churchNoticeChats"), newPost);
        newPost.id = docRef.id;
        let localNotices = JSON.parse(localStorage.getItem("yetalk_chat_notices_" + churchId) || "[]");
        localNotices.push(newPost);
        localStorage.setItem("yetalk_chat_notices_" + churchId, JSON.stringify(localNotices));

        // 2. 보물창고 자동 저장
        await addDoc(collection(db, "churchArchive"), { ...newPost, isArchived: true });

        // 3. 예톡 개인홈 자동 전송
        let personalNotices = JSON.parse(localStorage.getItem("yetalk_personal_notices_" + churchId) || "[]");
        personalNotices.unshift(newPost);
        localStorage.setItem("yetalk_personal_notices_" + churchId, JSON.stringify(personalNotices));

        // 4. ⭐ [핵심 멀티 자동 연동] 목사님 주일설교(sermon) 이거나 내용에 유튜브 주소가 있는 경우 예배영상실 및 보물창고 예배 카테고리로 멀티 자동 전송!
        const ytId = extractYoutubeId(text);
        if (categorySelect.value === "sermon" || ytId) {
            const worshipVideoData = {
                churchId: churchId,
                category: "worshipVideo",
                worshipCategory: "주일예배", // 기본 주일예배 탭으로 자동 매칭
                title: text.split("\n")[0] || "교회 예배 말씀",
                youtubeId: ytId || "jfKfPfyJRdk",
                content: text,
                desc: text,
                writer: "관리자",
                dateStr: dateStr,
                createdAtMs: Date.now()
            };
            await addDoc(collection(db, "worshipVideos"), worshipVideoData);
        }

        showToast("공지 및 예배영상실·보물창고로 멀티 자동 연동되었습니다!");
    } catch (err) {
        console.warn("저장 실패:", err);
        showToast("저장 중 오류가 발생했습니다.");
    }

    // 작성 칸 초기화
    textarea.value = "";
    if (document.getElementById("chatPhotoInput")) document.getElementById("chatPhotoInput").value = "";
    if (document.getElementById("chatFileInput")) document.getElementById("chatFileInput").value = "";
    if (document.getElementById("attachPreviewText")) document.getElementById("attachPreviewText").innerText = "";
    selectedFileObj = null;
    selectedFileType = null;

    // 등록 성공 시 창 닫기
    if(window.closeEditor) window.closeEditor();

    await loadNotices();
};

async function loadNotices() {
    const churchId = localStorage.getItem("yetalkMyChurchId") || localStorage.getItem("currentChurchId") || "yetalk-church";
    let posts = [];
    try {
        const q = query(collection(db, "churchNoticeChats"), where("churchId", "==", churchId), orderBy("createdAtMs", "asc"));
        const snapshot = await getDocs(q);
        snapshot.forEach(docSnap => posts.push({ id: docSnap.id, ...docSnap.data() }));
    } catch (err) {}

    if (posts.length === 0) posts = JSON.parse(localStorage.getItem("yetalk_chat_notices_" + churchId) || "[]");
    if (posts.length === 0) posts = [DEFAULT_WELCOME_NOTICE];

    noticeList = posts;
    drawNoticeList();
}

function drawNoticeList() {
    const listEl = document.getElementById("noticePostList");
    const emptyEl = document.getElementById("noticeEmpty");
    if (!listEl) return;
    listEl.innerHTML = "";

    if (noticeList.length === 0) {
        emptyEl?.classList.remove("hidden"); return;
    }
    emptyEl?.classList.add("hidden");

    noticeList.forEach((item, index) => {
        const fullText = item.text || "";
        const lines = fullText.split("\n");
        const firstLine = lines[0] || "공지 사항";
        const restLines = lines.slice(1).join("\n");
        const badgeText = categoryNames[item.category || "notice"] || "📢 공지알림";
        const isDefaultWelcome = item.id === "default-welcome";

        const card = document.createElement("article");
        card.className = "noticePostCard";
        card.addEventListener("click", (e) => {
            if (!e.target.closest(".noticePostActions")) card.classList.toggle("expanded");
        });

        const actionButtonsHTML = isManagerOn && !isDefaultWelcome ? `
            <div class="noticePostActions">
                <button type="button" class="noticePostBtn noticePostEdit" onclick="editNoticeItem('${item.id || ''}', ${index})">수정</button>
                <button type="button" class="noticePostBtn noticePostDelete" onclick="deleteNoticeItem('${item.id || ''}', ${index})">삭제</button>
            </div>
        ` : `
            <div class="noticePostActions">
                <button type="button" class="noticePostBtn noticePostCopy" onclick="copyNoticeText(event, \`${escapeJsString(fullText)}\`)">복사</button>
            </div>
        `;

        let attachmentHTML = "";
        if (item.attachedFileName) {
            const icon = item.attachedFileType === 'photo' ? '📷' : '📁';
            attachmentHTML = `
                <div class="noticeAttachmentBox">
                    <span class="attachIcon">${icon}</span>
                    <span class="attachName">${escapeHtml(item.attachedFileName)}</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="noticePostTop">
                <div style="display:flex; align-items:center; gap:6px;">
                    <span class="noticePostBadge">${badgeText}</span>
                    <span class="noticePostDate">${item.date || ""}</span>
                </div>
                ${actionButtonsHTML}
            </div>
            <div class="noticePostFirstLine">${escapeHtml(firstLine)}</div>
            ${restLines ? `<div class="noticePostContent">${escapeHtml(restLines)}</div>` : ""}
            ${attachmentHTML}
        `;
        listEl.appendChild(card);
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

window.editNoticeItem = async function(docId, index) {
    if (!isManagerOn) return;
    const newText = prompt("공지 내용을 수정하세요:", noticeList[index].text || "");
    if (!newText || !newText.trim()) return;
    noticeList[index].text = newText.trim();

    if (docId && docId !== "default-welcome") await updateDoc(doc(db, "churchNoticeChats", docId), { text: newText.trim() });
    drawNoticeList(); showToast("수정되었습니다.");
};

window.deleteNoticeItem = async function(docId, index) {
    if (!isManagerOn || !confirm("이 공지를 삭제하시겠습니까?")) return;
    if (docId && docId !== "default-welcome") await deleteDoc(doc(db, "churchNoticeChats", docId));
    noticeList.splice(index, 1);
    drawNoticeList(); showToast("삭제되었습니다.");
};

window.copyNoticeText = function(event, text) {
    event.stopPropagation();
    navigator.clipboard.writeText(text).then(() => showToast("복사되었습니다."));
};

function initDynamicChurchName() {
    setInterval(() => {
        const name = localStorage.getItem("yetalkMyChurchName") || localStorage.getItem("currentChurchName");
        if (name && document.getElementById("noticeHeaderChurch")) document.getElementById("noticeHeaderChurch").innerText = name;
    }, 500);
}

function showToast(msg) {
    const toast = document.getElementById("noticeToast");
    if (!toast) return;
    toast.textContent = msg; toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}
function escapeHtml(text) { return String(text||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
function escapeJsString(str) { return String(str||"").replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\n/g,'\\n'); }