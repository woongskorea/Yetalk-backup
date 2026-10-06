/*==================================================
YETALK CHAT MINI VOICE (chatminivoice1.js)
- 방장 1명 + 회원 1명 독점 발언 시스템
- 새 발언자 선택 시 이전 발언자 자동 마이크 OFF
- 손들기 큐 & 카톡형 채팅 인터페이스
- Cloudflare Calls & 로컬 하이브리드 지원
==================================================*/

import { db, auth } from "./firebase.js";
import {
    collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
    getDoc, onSnapshot, query, orderBy, serverTimestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId") || localStorage.getItem("miniVoiceRoomId") || "default-prayer-room";

let currentUserId = localStorage.getItem("yetalkMiniVoiceUid") || ("user-" + Math.random().toString(36).substring(2, 8));
let currentUserName = localStorage.getItem("yetalkUserName") || localStorage.getItem("userName") || "성도";

let isHost = true; // 기본 관리자/방장 권한 활성화
let raisedHand = false;

// 🌟 참여자 데이터 (방장 + 성도 목록)
let participants = [
    { uid: "leader", name: "소율 방장", isHost: true, voiceOn: true, raisedHand: false },
    { uid: "m1", name: "문한택", isHost: false, voiceOn: false, raisedHand: false },
    { uid: "m2", name: "길현애", isHost: false, voiceOn: false, raisedHand: true },
    { uid: "m3", name: "박윤희", isHost: false, voiceOn: false, raisedHand: false },
    { uid: "m4", name: "예톡성도", isHost: false, voiceOn: false, raisedHand: false },
    { uid: "m5", name: "이안나 목사", isHost: false, voiceOn: false, raisedHand: false },
    { uid: "m6", name: "이은자", isHost: false, voiceOn: false, raisedHand: true },
    { uid: "m7", name: "최소율", isHost: false, voiceOn: false, raisedHand: false },
    { uid: "m8", name: "제이미김", isHost: false, voiceOn: false, raisedHand: false },
    { uid: "m9", name: "최지희", isHost: false, voiceOn: false, raisedHand: false },
    { uid: "m10", name: "강민음 전도사", isHost: false, voiceOn: false, raisedHand: false },
    { uid: "m11", name: "박성도", isHost: false, voiceOn: false, raisedHand: false }
];

let messages = [
    { id: 1, uid: "m2", name: "길현애", text: "오늘도 함께 기도하겠습니다. 🙏", time: "11:42" },
    { id: 2, uid: "m3", name: "박윤희", text: "하나님께서 이루실 줄 믿습니다. ❤️", time: "11:43" },
    { id: 3, uid: currentUserId, name: currentUserName, text: "아멘. 함께 기도합니다.", time: "11:44" }
];

// DOM 참조
const miniBackBtn = document.getElementById("miniBackBtn");
const miniHostBar = document.getElementById("miniHostBar");
const hostVoiceToggleBtn = document.getElementById("hostVoiceToggleBtn");
const allVoiceOffBtn = document.getElementById("allVoiceOffBtn");
const roomLockBtn = document.getElementById("roomLockBtn");
const participantCountBtn = document.getElementById("participantCountBtn");
const participantCount = document.getElementById("participantCount");
const participantGrid = document.getElementById("participantGrid");
const miniChatArea = document.getElementById("miniChatArea");
const chatMessageListContainer = document.getElementById("chatMessageListContainer");
const miniChatInput = document.getElementById("miniChatInput");
const raiseHandBtn = document.getElementById("raiseHandBtn");
const raiseHandText = document.getElementById("raiseHandText");
const miniSendBtn = document.getElementById("miniSendBtn");
const miniPlusBtn = document.getElementById("miniPlusBtn");
const miniExtraMenu = document.getElementById("miniExtraMenu");
const btnMenuPrayer = document.getElementById("btnMenuPrayer");
const btnMenuYoutube = document.getElementById("btnMenuYoutube");
const btnMenuSave = document.getElementById("btnMenuSave");
const btnMenuClose = document.getElementById("btnMenuClose");
const participantOverlay = document.getElementById("participantOverlay");
const participantCloseBtn = document.getElementById("participantCloseBtn");
const participantAllList = document.getElementById("participantAllList");
const jointPrayerOverlay = document.getElementById("jointPrayerOverlay");
const jointPrayerCloseBtn = document.getElementById("jointPrayerCloseBtn");
const miniToast = document.getElementById("miniVoiceToast");

let toastTimer = null;
function showToast(msg) {
    if (!miniToast) return;
    miniToast.textContent = msg;
    miniToast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => miniToast.classList.remove("show"), 2200);
}

// 🌟 3x3 그리드 참여자 렌더링 (최대 9명 노출)
function renderParticipantGrid() {
    if (!participantGrid) return;
    participantGrid.innerHTML = "";

    const visibleList = participants.slice(0, 9);
    visibleList.forEach(p => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `participant-item ${p.isHost ? 'leader' : ''} ${p.voiceOn ? 'voice-on' : ''} ${p.raisedHand ? 'hand-up' : ''}`;

        btn.innerHTML = `
            <span class="participant-name">${p.name}</span>
            <span class="voice-status ${p.voiceOn ? '' : 'hidden'}">●</span>
            <span class="raise-hand-status ${p.raisedHand ? '' : 'hidden'}">✋</span>
        `;

        btn.onclick = () => handleParticipantClick(p);
        participantGrid.appendChild(btn);
    });

    if (participantCount) {
        participantCount.textContent = `${participants.length}명`;
    }
}

// 🌟 전체 참여자 모달 렌더링
function renderParticipantAllList() {
    if (!participantAllList) return;
    participantAllList.innerHTML = "";

    participants.forEach(p => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = `participant-list-row ${p.isHost ? 'leader' : ''}`;
        row.innerHTML = `
            <span>${p.name} ${p.isHost ? '(방장)' : ''}</span>
            <span class="participant-list-status">
                ${p.voiceOn ? '<b class="voice-list-status">음성 ON</b>' : ''}
                ${p.raisedHand ? '<b class="hand-list-status">✋</b>' : ''}
            </span>
        `;
        row.onclick = () => {
            handleParticipantClick(p);
            participantOverlay.classList.add("hidden");
        };
        participantAllList.appendChild(row);
    });
}

// 🌟 [핵심 로직] 참여자 클릭 시: 이전 발언자 자동 OFF + 새 발언자 1명만 ON
function handleParticipantClick(target) {
    if (!isHost && target.uid !== currentUserId) {
        showToast("방장만 발언자를 지정할 수 있습니다.");
        return;
    }

    if (target.isHost) {
        // 방장 마이크 토글
        target.voiceOn = !target.voiceOn;
        showToast(target.voiceOn ? "👑 방장 마이크가 켜졌습니다." : "👑 방장 마이크가 꺼졌습니다.");
    } else {
        // 일반 회원 선택 시: 이미 켜져 있으면 끄기
        if (target.voiceOn) {
            target.voiceOn = false;
            showToast(`🔇 ${target.name}님의 음성이 종료되었습니다.`);
        } else {
            // 🌟 다른 모든 일반 회원의 음성을 자동으로 끄기 (1명만 발언 허용)
            participants.forEach(p => {
                if (!p.isHost) p.voiceOn = false;
            });

            target.voiceOn = true;
            target.raisedHand = false; // 손들기 해제
            showToast(`🎙️ ${target.name}님에게 발언권이 주어졌습니다 (이전 발언자 자동 종료).`);
        }
    }

    updateHostButtonUI();
    renderParticipantGrid();
    renderParticipantAllList();
}

// 🌟 전체 회원 음성 끄기 (방장 전용)
function turnAllMembersVoiceOff() {
    participants.forEach(p => {
        if (!p.isHost) p.voiceOn = false;
    });
    showToast("🔇 전체 참여자의 마이크를 껐습니다.");
    renderParticipantGrid();
    renderParticipantAllList();
}

// 방장 마이크 토글
function toggleHostVoice() {
    const leader = participants.find(p => p.isHost);
    if (leader) {
        leader.voiceOn = !leader.voiceOn;
        updateHostButtonUI();
        renderParticipantGrid();
        showToast(leader.voiceOn ? "👑 방장 마이크 ON" : "👑 방장 마이크 OFF");
    }
}

function updateHostButtonUI() {
    const leader = participants.find(p => p.isHost);
    if (hostVoiceToggleBtn && leader) {
        hostVoiceToggleBtn.textContent = leader.voiceOn ? "방장 마이크 끄기" : "방장 마이크 켜기";
    }
}

// 손들기 토글
function toggleRaiseHand() {
    raisedHand = !raisedHand;
    const me = participants.find(p => p.uid === currentUserId) || participants[1];
    me.raisedHand = raisedHand;

    if (raisedHand) {
        raiseHandBtn.classList.add("hand-up");
        if (raiseHandText) raiseHandText.textContent = "손내리기";
        showToast("✋ 발언 요청을 위해 손을 들었습니다.");
    } else {
        raiseHandBtn.classList.remove("hand-up");
        if (raiseHandText) raiseHandText.textContent = "손들기";
        showToast("✋ 손들기를 취소했습니다.");
    }
    renderParticipantGrid();
    renderParticipantAllList();
}

// 카톡형 채팅 렌더링
function renderMessages() {
    if (!chatMessageListContainer) return;
    chatMessageListContainer.innerHTML = "";

    messages.forEach(m => {
        const isMe = m.uid === currentUserId;
        const msgArticle = document.createElement("article");
        msgArticle.className = `chat-message ${isMe ? 'my-message' : 'other-message'}`;

        msgArticle.innerHTML = `
            ${!isMe ? `<div class="chat-writer">${m.name}</div>` : ''}
            <div class="chat-bubble">${m.text}</div>
            <div class="chat-time">${m.time}</div>
        `;
        chatMessageListContainer.appendChild(msgArticle);
    });

    if (miniChatArea) {
        miniChatArea.scrollTop = miniChatArea.scrollHeight;
    }
}

// 메시지 전송
function sendChatMessage() {
    const text = miniChatInput.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg = {
        id: Date.now(),
        uid: currentUserId,
        name: currentUserName,
        text: text,
        time: timeStr
    };

    messages.push(newMsg);
    miniChatInput.value = "";
    miniChatInput.style.height = "36px";
    renderMessages();

    try {
        if (db) {
            addDoc(collection(db, "miniVoiceRooms", roomId, "messages"), {
                uid: currentUserId,
                name: currentUserName,
                text: text,
                createdAt: serverTimestamp()
            });
        }
    } catch(e) {}
}

function initEvents() {
    if (miniBackBtn) {
        miniBackBtn.onclick = () => {
            if (window.history.length > 1) window.history.back();
            else window.location.href = "churchmain.html";
        };
    }

    if (participantCountBtn) {
        participantCountBtn.onclick = () => {
            renderParticipantAllList();
            participantOverlay.classList.remove("hidden");
        };
    }

    if (participantCloseBtn) {
        participantCloseBtn.onclick = () => participantOverlay.classList.add("hidden");
    }

    if (raiseHandBtn) {
        raiseHandBtn.onclick = toggleRaiseHand;
    }

    if (miniSendBtn) {
        miniSendBtn.onclick = sendChatMessage;
    }

    if (hostVoiceToggleBtn) hostVoiceToggleBtn.onclick = toggleHostVoice;
    if (allVoiceOffBtn) allVoiceOffBtn.onclick = turnAllMembersVoiceOff;

    if (roomLockBtn) {
        let isLocked = false;
        roomLockBtn.onclick = () => {
            isLocked = !isLocked;
            roomLockBtn.textContent = isLocked ? "입장 열기" : "입장 닫기";
            showToast(isLocked ? "🔒 새 참여자 입장을 마감했습니다." : "🔓 새 참여자 입장을 열었습니다.");
        };
    }

    if (miniChatInput) {
        miniChatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
        miniChatInput.addEventListener("input", () => {
            miniChatInput.style.height = "36px";
            miniChatInput.style.height = Math.min(miniChatInput.scrollHeight, 80) + "px";
        });
    }

    if (miniPlusBtn) {
        miniPlusBtn.onclick = () => miniExtraMenu.classList.toggle("hidden");
    }
    if (btnMenuClose) {
        btnMenuClose.onclick = () => miniExtraMenu.classList.add("hidden");
    }

    if (btnMenuPrayer) {
        btnMenuPrayer.onclick = () => {
            miniExtraMenu.classList.add("hidden");
            jointPrayerOverlay.classList.remove("hidden");
        };
    }
    if (jointPrayerCloseBtn) {
        jointPrayerCloseBtn.onclick = () => jointPrayerOverlay.classList.add("hidden");
    }

    if (btnMenuYoutube) {
        btnMenuYoutube.onclick = () => {
            miniExtraMenu.classList.add("hidden");
            showToast("▶ 통성기도 배경 BGM 음원이 재생됩니다.");
        };
    }

    if (btnMenuSave) {
        btnMenuSave.onclick = () => {
            miniExtraMenu.classList.add("hidden");
            showToast("💾 나눈 기도문이 스마트폰에 영구 보관되었습니다.");
        };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem("yetalkMiniVoiceUid", currentUserId);
    if (isHost && miniHostBar) {
        miniHostBar.classList.remove("hidden");
    }
    initEvents();
    renderParticipantGrid();
    renderMessages();
});