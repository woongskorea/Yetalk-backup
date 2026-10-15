use strict;
use warnings;
use utf8;
binmode(STDIN, ':encoding(UTF-8)');
binmode(STDOUT, ':encoding(UTF-8)');

my $file = 'app/src/main/assets/dentalmain.html';
open my $fh, '<:encoding(UTF-8)', $file or die "Cannot open $file: $!";
my $content = do { local $/; <$fh> };
close $fh;

# 1. Update DEFAULT_DOCTALK_POSTS to casual everyday chat
my $new_posts_code = <<'POSTS_CODE';
const DEFAULT_DOCTALK_POSTS = [
    {
        id: "dt_1",
        author: "치아요정원장",
        dept: "자유수다",
        date: "오늘 12:20",
        title: "오늘 점심 병원 근처 평양냉면집 대박이네요ㅋㅋ",
        body: "원장님들 오늘 점심 뭐 드셨나요? 병원 뒷골목에 새로 생긴 평양냉면 육수가 진짜 예술입니다ㅋㅋ\n시원하게 한 그릇 완냉하고 오후 진료 힘내서 달려봅니다! 다들 맛점하세요~",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        comments: [
            { id: 101, author: "스케일링장인", time: "12:28", text: "오 거기 저도 가봤는데 녹두전도 맛있습니다ㅋㅋ" }
        ]
    },
    {
        id: "dt_2",
        author: "스케일링장인",
        dept: "일상잡담",
        date: "오늘 10:15",
        title: "치실 하루 3번씩 하시는 분 계신가요?ㅎㅎ",
        body: "환자분들한테는 치실 하루 3번 필수라고 매번 강조하는데 솔직히 저도 야식 먹고 너무 졸리면 패스할 때 있네요ㅋㅋ\n치과의사도 사람인지라 공감하시는 원장님 계실까요?ㅎㅎ",
        youtubeUrl: "",
        img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
        comments: []
    },
    {
        id: "dt_3",
        author: "골프치는치과의사",
        dept: "취미/골프",
        date: "어제 18:40",
        title: "골프 드라이버 비거리 늘리는 꿀팁 있으신가요?",
        body: "주말에 필드 다녀왔는데 슬라이스만 계속 나네요ㅠㅠ\n퇴근하고 스크린이나 연습장 가실 원장님 계신가요~ 조언 부탁드립니다!",
        youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        img: "",
        comments: []
    }
];
POSTS_CODE

$content =~ s/const DEFAULT_DOCTALK_POSTS = \[.*?\];/ $new_posts_code /s;

# 2. Add anonymous nick functions
my $nick_funcs = <<'NICK_CODE';
function getDenTalkAnonNick() {
    let nick = localStorage.getItem("yetalk_dental_anon_nick");
    if (!nick) {
        nick = "치아요정원장";
        localStorage.setItem("yetalk_dental_anon_nick", nick);
    }
    return nick;
}

function changeDenTalkAnonNick() {
    const cur = getDenTalkAnonNick();
    const next = prompt("교체할 익명 아이디(닉네임)를 입력하세요:\n(자연스러운 카톡방처럼 편하게 대화할 수 있습니다)", cur);
    if (!next || !next.trim() || next.trim() === cur) return;
    localStorage.setItem("yetalk_dental_anon_nick", next.trim());
    updateDenTalkNickDisplay();
    showToast(`👤 익명 ID가 "${next.trim()}"(으)로 교체되었습니다.`);
}

function updateDenTalkNickDisplay() {
    const nick = getDenTalkAnonNick();
    const el1 = document.getElementById("dispCurDenTalkNick");
    if (el1) el1.innerText = nick;
    const el2 = document.getElementById("dispPostAnonNick");
    if (el2) el2.innerText = nick;
}
NICK_CODE

if ($content !~ /getDenTalkAnonNick/) {
    $content =~ s/(let docTalkPosts = \[\];)/$nick_funcs\n$1/;
}

# 3. Use getDenTalkAnonNick in comment & post submit
$content =~ s/const myName = localStorage\.getItem\("yetalkUserName"\) \|\| "김예톡 원장";/const myName = getDenTalkAnonNick();/g;

# 4. Context Menu logic & renderClinicChatMessages rewrite (no inline buttons, long-press only)
my $clinic_context_code = <<'CTX_CODE';
let selectedClinicMsgIdx = -1;
let clinicLongPressTimer = null;

function setupClinicMsgLongPress(element, idx) {
    let touchMoved = false;
    element.addEventListener("touchstart", (e) => {
        touchMoved = false;
        clinicLongPressTimer = setTimeout(() => {
            if (!touchMoved) {
                openClinicContextMenu(idx);
            }
        }, 450);
    }, { passive: true });
    element.addEventListener("touchmove", () => {
        touchMoved = true;
        clearTimeout(clinicLongPressTimer);
    });
    element.addEventListener("touchend", () => clearTimeout(clinicLongPressTimer));
    element.addEventListener("touchcancel", () => clearTimeout(clinicLongPressTimer));

    element.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        openClinicContextMenu(idx);
    });
}

function openClinicContextMenu(idx) {
    selectedClinicMsgIdx = idx;
    const msg = clinicChatMessages[idx];
    if (!msg) return;
    const modal = document.getElementById("modalClinicContextMenu");
    if (!modal) return;
    const btnEdit = document.getElementById("btnCtxEdit");
    const btnDel = document.getElementById("btnCtxDelete");
    if (btnEdit) btnEdit.style.display = msg.mine ? "flex" : "none";
    if (btnDel) btnDel.style.display = msg.mine ? "flex" : "none";
    modal.classList.add("open");
}

function closeClinicContextMenu() {
    const modal = document.getElementById("modalClinicContextMenu");
    if (modal) modal.classList.remove("open");
}

function handleCtxCopy() {
    if (selectedClinicMsgIdx < 0) return;
    copyClinicMsg(selectedClinicMsgIdx);
    closeClinicContextMenu();
}

function handleCtxEdit() {
    if (selectedClinicMsgIdx < 0) return;
    const idx = selectedClinicMsgIdx;
    closeClinicContextMenu();
    editClinicMsg(idx);
}

function handleCtxDelete() {
    if (selectedClinicMsgIdx < 0) return;
    const idx = selectedClinicMsgIdx;
    closeClinicContextMenu();
    deleteClinicMsg(idx);
}

function renderClinicChatMessages() {
    const list = document.getElementById("kakaotalkChatMsgList");
    if (!list) return;
    loadClinicChatData();
    list.innerHTML = "";

    clinicChatMessages.forEach((msg, idx) => {
        const row = document.createElement("div");
        row.className = `chat-bubble-row ${msg.mine ? 'mine' : 'other'}`;

        const ytId = extractYouTubeId(msg.text || "");

        const bubble = document.createElement("div");
        bubble.className = "chat-bubble-body";
        bubble.style.cursor = "pointer";
        bubble.setAttribute("title", "길게 꾹 누르면 복사/수정/삭제 메뉴가 뜹니다");

        bubble.innerHTML = `
            ${msg.text ? `<div style="white-space:pre-wrap; word-break:break-all;">${msg.text}</div>` : ''}
            ${msg.img ? `<img src="${msg.img}" style="max-width:200px; border-radius:8px; margin-top:4px;" alt="사진">` : ''}
            ${ytId ? `
            <div class="yt-embed-preview-card" style="margin-top:6px;" onclick="event.stopPropagation(); openGlobalYouTubeModal('${ytId}')">
                <img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" class="yt-thumb-img" style="height:120px;" alt="유튜브">
                <div class="yt-play-overlay-badge">
                    <div class="yt-play-btn-circle" style="width:36px; height:36px; font-size:16px;">▶</div>
                    <span class="yt-play-label" style="font-size:11px;">영상 재생</span>
                </div>
            </div>
            ` : ''}
            <div style="font-size:9.5px; opacity:0.75; text-align:right; margin-top:3px;">${msg.time || ""}</div>
        `;

        setupClinicMsgLongPress(bubble, idx);
        row.appendChild(bubble);
        list.appendChild(row);
    });
    list.scrollTop = list.scrollHeight;
}
CTX_CODE

$content =~ s/function renderClinicChatMessages\(\)\s*\{.*?list\.scrollTop = list\.scrollHeight;\s*\}/$clinic_context_code/s;

# 5. Direct Clinic Notice Submission & Photo handling (bottom form)
my $direct_notice_js = <<'NOTICE_JS';
let tempDirectNoticeImgBase64 = "";

function handleDirectNoticePhoto(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        tempDirectNoticeImgBase64 = e.target.result;
        document.getElementById("txtDirectNoticePhotoStatus").innerText = `선택됨: ${file.name}`;
        const prev = document.getElementById("imgDirectNoticePhotoPreview");
        if (prev) prev.src = tempDirectNoticeImgBase64;
        const box = document.getElementById("previewDirectNoticePhotoBox");
        if (box) box.style.display = "block";
    };
    reader.readAsDataURL(file);
}

function submitDirectClinicNotice() {
    const title = (document.getElementById("inpDirectNoticeTitle")?.value || "").trim();
    const content = (document.getElementById("inpDirectNoticeContent")?.value || "").trim();
    if (!title || !content) return alert("공지 제목과 내용을 모두 입력해주세요.");

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
    const myClinicName = localStorage.getItem("yetalkDoctorName") || "예톡 스마일치과의원";

    const newNotice = {
        id: "notice_clinic_" + Date.now(),
        sender: `🏥 ${myClinicName}`,
        senderType: "clinic",
        isChurchNotice: false,
        title: title,
        content: content,
        date: dateStr,
        img: tempDirectNoticeImgBase64 || "",
        stars: 5,
        isToday: true,
        timestamp: Date.now()
    };

    // 1. 치과 로컬 피드에 추가
    clinicNotices.unshift(newNotice);
    saveNoticeBoardData();
    renderNoticeBoardData();

    // 2. 가입 회원들의 개인앱(onemain.html) 전역 공지창으로 즉시 발송
    let allGlobalNotices = JSON.parse(localStorage.getItem("yetalk_all_notices") || "[]");
    allGlobalNotices.unshift(newNotice);
    localStorage.setItem("yetalk_all_notices", JSON.stringify(allGlobalNotices));

    // 3. 예톡 단골 신규 알림 카운트 증가
    let dangolCount = parseInt(localStorage.getItem("yetalk_dangol_new_notice_count") || "0", 10);
    localStorage.setItem("yetalk_dangol_new_notice_count", (dangolCount + 1).toString());

    // 폼 리셋
    document.getElementById("inpDirectNoticeTitle").value = "";
    document.getElementById("inpDirectNoticeContent").value = "";
    document.getElementById("txtDirectNoticePhotoStatus").innerText = "첨부된 사진 없음";
    const box = document.getElementById("previewDirectNoticePhotoBox");
    if (box) box.style.display = "none";
    tempDirectNoticeImgBase64 = "";

    showToast("📢 공지가 등록되었으며, 가입 회원들의 개인앱(onemain) 및 단골 소식으로 즉시 발송되었습니다!");
}
NOTICE_JS

if ($content !~ /submitDirectClinicNotice/) {
    $content =~ s/(function renderNoticeBoardData\(\)\s*\{)/$direct_notice_js\n$1/;
}

# 6. Ensure DOMContentLoaded calls updateDenTalkNickDisplay()
if ($content !~ /updateDenTalkNickDisplay\(\);/) {
    $content =~ s/(renderNoticeBoardData\(\);)/$1\n    updateDenTalkNickDisplay();/;
}

open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!";
print $out $content;
close $out;
print "Updated JS in $file\n";
