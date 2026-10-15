use strict;
use warnings;
use utf8;
binmode(STDIN, ':encoding(UTF-8)');
binmode(STDOUT, ':encoding(UTF-8)');

# ===== 1. UPDATE HANDOCTORMAIN.HTML =====
{
    my $file = 'app/src/main/assets/handoctormain.html';
    open my $fh, '<:encoding(UTF-8)', $file or die "Cannot open $file: $!";
    my $content = do { local $/; <$fh> };
    close $fh;

    # CSS fix: .fullscreen-detail-view padding-bottom
    $content =~ s/\.fullscreen-detail-view\s*\{[^}]*padding-bottom:\s*var\(--bottom-ad-h\);[^}]*\}/.fullscreen-detail-view {\n            display: none !important; position: fixed; inset: 0; background: #ffffff; z-index: 50000;\n            flex-direction: column; overflow: hidden; padding-bottom: 0;\n        }/s;

    my $context_css = <<'CSS';
        /* 카카오톡 스타일 말풍선 롱프레스 팝업 컨텍스트 메뉴 */
        .chat-context-overlay {
            display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45);
            z-index: 60000; align-items: center; justify-content: center;
        }
        .chat-context-overlay.open { display: flex; }
        .chat-context-card {
            background: #ffffff; border-radius: 16px; padding: 12px; width: 250px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.35); display: flex; flex-direction: column; gap: 6px;
        }
        .chat-context-btn {
            width: 100%; height: 44px; background: #f8fafc; border: 1px solid #e2e8f0;
            border-radius: 10px; font-size: 14px; font-weight: 850; color: #1e293b;
            display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
        }
        .chat-context-btn:active { background: #e2e8f0; }
        .chat-context-btn.del { color: #ef4444; }
        .chat-context-btn.close { background: none; border: none; color: #64748b; font-size: 13px; margin-top: 2px; }
CSS

    if ($content !~ /\.chat-context-overlay/) {
        $content =~ s/(\.fullscreen-detail-view\s*\{)/$context_css\n        $1/;
    }

    # Sub bar: 닥톡 -> 한의톡
    $content =~ s/(<button type="button" class="btn-sub-chip btn-sub-doctalk"[^>]*>)닥톡(<\/button>)/$1한의톡$2/g;

    # Notice section: remove .notice-cat-grid & add bottom write form
    my $old_notice_section = <<'OLD_SEC';
    <!-- 3) 공지알림 탭 컨테이너 -->
    <main class="doc-tab-container" id="sec_notice">
        <!-- 3개 카테고리 박스 (의원 알림, 교회 알림, 음식점 및 기타 알림) -->
        <div class="notice-cat-grid">
            <div class="notice-cat-box active" id="catBox_clinic" onclick="switchNoticeCategory('clinic')">
                <span class="notice-cat-icon">🏥</span>
                <span class="notice-cat-label" id="lblNoticeClinicCat">의원 알림</span>
            </div>
            <div class="notice-cat-box" id="catBox_church" onclick="switchNoticeCategory('church')">
                <span class="notice-cat-icon">⛪</span>
                <span class="notice-cat-label">교회 알림</span>
            </div>
            <div class="notice-cat-box" id="catBox_store" onclick="switchNoticeCategory('store')">
                <span class="notice-cat-icon">🍽️</span>
                <span class="notice-cat-label">음식점 및 기타 알림</span>
            </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="font-size:16px; color:#0f172a;" id="dispNoticeFeedHeaderTitle">📢 한의원 소식 피드</strong>
            <button type="button" style="background:#059669; color:#fff; border:none; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer;" onclick="openNoticeEditorFullscreen()">＋ 새 공지 작성</button>
        </div>
        <div id="noticeFeedContainer" style="display:flex; flex-direction:column; gap:12px;"></div>
    </main>
OLD_SEC

    my $new_notice_section = <<'NEW_SEC';
    <!-- 3) 공지알림 탭 컨테이너 -->
    <main class="doc-tab-container" id="sec_notice">
        <div style="background:#ffffff; border-radius:16px; border:1.5px solid var(--border); padding:14px 16px; box-shadow:0 2px 8px rgba(0,0,0,0.04); margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:12px; font-weight:800; color:#059669;">📢 한의원 소식 발송 관리</span>
                    <h3 style="font-size:16.5px; font-weight:950; color:#0f172a;" id="dispNoticeFeedHeaderTitle">예톡 우리동네한의원 공지소식</h3>
                </div>
                <span style="font-size:11px; color:#64748b; font-weight:700;">등록 시 회원 개인앱 및 단골로 자동 발송</span>
            </div>
        </div>

        <!-- 병원 등록 공지 목록 -->
        <div id="noticeFeedContainer" style="display:flex; flex-direction:column; gap:12px; margin-bottom:18px;"></div>

        <!-- 🌟 [사용자 요청] 공지알림 등록 폼을 밑에 배치 + 사진 파일 선택도 밑에 + 애드몹 위 배치 -->
        <section style="background:#ffffff; border:1.8px solid #059669; border-radius:18px; padding:16px; box-shadow:0 4px 14px rgba(5,150,105,0.08); margin-bottom:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1.5px solid #d1fae5; padding-bottom:8px;">
                <strong style="font-size:15px; font-weight:950; color:#059669;">📝 새 공지사항 작성 및 회원 자동 발송</strong>
                <span style="font-size:11px; color:#059669; font-weight:800;">원내 공식 공지</span>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:10px;">
                <input type="text" id="inpDirectNoticeTitle" class="m-large-input" placeholder="공지 제목을 입력하세요 (예: 10월 환절기 보약 안내)">
                <textarea id="inpDirectNoticeContent" class="m-large-input" style="height:85px; padding:10px; resize:none;" placeholder="환자 및 가입 회원들에게 전달할 공지 내용을 작성해주세요."></textarea>
                
                <!-- 사진 파일 선택 (밑에 배치) -->
                <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #e2e8f0;">
                    <label style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; background:#d1fae5; color:#059669; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:900;">
                        <span>📷 사진 파일 선택</span>
                        <input type="file" id="inpDirectNoticePhoto" accept="image/*" style="display:none;" onchange="handleDirectNoticePhoto(event)">
                    </label>
                    <span id="txtDirectNoticePhotoStatus" style="font-size:11.5px; color:#64748b; font-weight:700;">첨부된 사진 없음</span>
                </div>
                <div id="previewDirectNoticePhotoBox" style="display:none; max-height:160px; overflow:hidden; border-radius:10px; border:1px solid #cbd5e1;">
                    <img id="imgDirectNoticePhotoPreview" src="" style="width:100%; height:100%; object-fit:cover;">
                </div>

                <button type="button" style="height:48px; background:linear-gradient(135deg, #059669, #047857); color:#fff; border:none; border-radius:12px; font-size:15px; font-weight:950; cursor:pointer; box-shadow:0 3px 10px rgba(5,150,105,0.25);" onclick="submitDirectClinicNotice()">
                    📢 공지 등록 및 회원 개인앱(onemain)·단골 발송
                </button>
            </div>
        </section>
    </main>
NEW_SEC

    $content =~ s/\Q$old_notice_section\E/$new_notice_section/;

    # DocTalk Header: 한의톡 (한의사 일상 수다방)
    $content =~ s/<span class="detail-title-head">🌿 닥톡 \(HanDocTalk - 한의사전용\)<\/span>/<span class="detail-title-head">🌿 한의톡 (한의사 일상 수다방)<\/span>/;

    if ($content !~ /changeHanTalkAnonNick/) {
        $content =~ s/(<button type="button" class="btn-pc-popup" onclick="window\.open\('doctalk_popup\.html\?role=korean_doctor'[^>]*>)/<button type="button" class="btn-pc-popup" style="background:#059669; color:#fff;" onclick="changeHanTalkAnonNick()">👤 익명 ID: <span id="dispCurHanTalkNick">쌍화탕러버<\/span> ✏️<\/button>\n            $1/;
    }

    # FAB position
    $content =~ s/bottom:calc\(var\(--bottom-ad-h\) \+ 16px\);/bottom:calc(var(--bottom-ad-h) + 38px);/g;

    # modalHanDocTalkDetailView (Post Detail)
    $content =~ s/<span class="detail-title-head" style="font-size:16px;">🌿 닥톡 학술\/임상 나눔<\/span>/<span class="detail-title-head" style="font-size:16px;">🌿 한의톡 일상 수다방<\/span>/;
    $content =~ s/<input type="text" id="dtDetailCommentInput" placeholder="따뜻한 학술\/임상 댓글을 남겨주세요\.\.\."/<input type="text" id="dtDetailCommentInput" placeholder="재미있는 일상 수다 댓글을 남겨주세요..."/;

    my $han_detail_admob = <<'AD_HTML';
    <!-- 🌟 [사용자 요청] 한의톡 글 상세 뷰 최하단 고정 Google AdMob 배너 -->
    <div class="detail-bottom-admob">
        <div style="font-size:9.5px; color:#94a3b8; font-weight:700; margin-bottom:2px;">AD • Google AdMob 공식 스폰서 슬롯 (320 × 100)</div>
        <div class="admob-display-box" style="height:52px;">
            <strong style="color:#38bdf8; font-size:12.5px; font-weight:950;">Google AdMob Large Banner</strong>
            <span style="color:#facc15; font-size:10px; font-weight:700;">한의사 일상 커뮤니케이션 공식 후원 슬롯</span>
        </div>
    </div>
</div>
AD_HTML

    if ($content !~ /한의톡 글 상세 뷰 최하단 고정 Google AdMob 배너/) {
        $content =~ s/(<div id="dtDetailCommentList"[^>]*><\/div>\s*<\/div>\s*)(<\/div>)/$1$han_detail_admob/;
    }

    # Post write modal
    $content =~ s/<strong style="font-size:16px; color:#059669;" id="dispHanDocTalkPostModalTitle">✏️ 닥톡 학술\/임상 글 작성<\/strong>/<strong style="font-size:16px; color:#059669;" id="dispHanDocTalkPostModalTitle">✏️ 한의톡 이야기 나누기<\/strong>/;
    $content =~ s/<label style="font-size:12px; font-weight:900; color:#059669; display:block; margin-bottom:3px;">진료 과목 및 소속<\/label>\s*<input type="text" id="inpHanDocTalkDept"[^>]*>/<label style="font-size:12px; font-weight:900; color:#059669; display:block; margin-bottom:3px;">익명 아이디 (닉네임): <strong id="dispPostAnonNick" style="color:#f59e0b;">쌍화탕러버<\/strong><\/label><input type="hidden" id="inpHanDocTalkDept" value="자유수다">/s;

    # Context menu modal right before </body>
    my $context_menu_modal = <<'MODAL_HTML';
<!-- 카카오톡 스타일 말풍선 롱프레스 팝업 컨텍스트 메뉴 -->
<div class="chat-context-overlay" id="modalClinicContextMenu" onclick="if(event.target===this) closeClinicContextMenu()">
    <div class="chat-context-card">
        <div style="font-size:12px; font-weight:800; color:#64748b; padding:4px 6px; border-bottom:1px solid #f1f5f9; margin-bottom:4px;">메시지 관리</div>
        <button type="button" class="chat-context-btn" onclick="handleCtxCopy()">📋 메시지 복사</button>
        <button type="button" class="chat-context-btn" id="btnCtxEdit" onclick="handleCtxEdit()">✏️ 메시지 수정</button>
        <button type="button" class="chat-context-btn del" id="btnCtxDelete" onclick="handleCtxDelete()">🗑️ 메시지 삭제</button>
        <button type="button" class="chat-context-btn close" onclick="closeClinicContextMenu()">✕ 닫기</button>
    </div>
</div>
MODAL_HTML

    if ($content !~ /modalClinicContextMenu/) {
        $content =~ s/(<\/body>)/$context_menu_modal\n$1/;
    }

    # JS Code updates
    my $new_posts_code = <<'POSTS_CODE';
const DEFAULT_DOCTALK_POSTS = [
    {
        id: "dt_1",
        author: "쌍화탕러버",
        dept: "자유수다",
        date: "오늘 12:20",
        title: "오늘 같은 쌀쌀한 날엔 쌍화차 한 잔이 최고네요☕",
        body: "원내에 직접 달인 십전대보탕 향기 솔솔 퍼지니까 몸이 노곤노곤해집니다ㅋㅋ\n원장님들 오늘 하루도 따뜻하게 파이팅하세요!",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        comments: [
            { id: 101, author: "침맞고졸린원장", time: "12:25", text: "저희 원에도 한 잔 배달 부탁드립니다ㅋㅋ" }
        ]
    },
    {
        id: "dt_2",
        author: "침맞고졸린원장",
        dept: "일상잡담",
        date: "오늘 10:15",
        title: "침 맞고 너무 편해서 졸았다는 환자분ㅋㅋ",
        body: "발침하러 베드 갔더니 세상 모르게 코 골고 주무셔서 10분 더 재워드렸습니다ㅎㅎ\n치료가 편안하셨다니 이럴 때 참 뿌듯하네요.",
        youtubeUrl: "",
        img: "https://images.unsplash.com/photo-1512290900672-1a6907409476?auto=format&fit=crop&w=800&q=80",
        comments: []
    },
    {
        id: "dt_3",
        author: "녹용원장",
        dept: "취미/등산",
        date: "어제 18:40",
        title: "주말 등산 코스 추천 좀 부탁드립니다!",
        body: "이번 일요일에 가볍게 단풍 구경 갈만한 산 있을까요? 무릎에 안 무리 가는 코스로 추천 부탁드립니다ㅋㅋ",
        youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        img: "",
        comments: []
    }
];
POSTS_CODE

    $content =~ s/const DEFAULT_DOCTALK_POSTS = \[.*?\];/ $new_posts_code /s;

    my $nick_funcs = <<'NICK_CODE';
function getHanTalkAnonNick() {
    let nick = localStorage.getItem("yetalk_han_anon_nick");
    if (!nick) {
        nick = "쌍화탕러버";
        localStorage.setItem("yetalk_han_anon_nick", nick);
    }
    return nick;
}

function changeHanTalkAnonNick() {
    const cur = getHanTalkAnonNick();
    const next = prompt("교체할 익명 아이디(닉네임)를 입력하세요:\n(자연스러운 카톡방처럼 편하게 대화할 수 있습니다)", cur);
    if (!next || !next.trim() || next.trim() === cur) return;
    localStorage.setItem("yetalk_han_anon_nick", next.trim());
    updateHanTalkNickDisplay();
    showToast(`👤 익명 ID가 "${next.trim()}"(으)로 교체되었습니다.`);
}

function updateHanTalkNickDisplay() {
    const nick = getHanTalkAnonNick();
    const el1 = document.getElementById("dispCurHanTalkNick");
    if (el1) el1.innerText = nick;
    const el2 = document.getElementById("dispPostAnonNick");
    if (el2) el2.innerText = nick;
}
NICK_CODE

    if ($content !~ /getHanTalkAnonNick/) {
        $content =~ s/(let docTalkPosts = \[\];)/$nick_funcs\n$1/;
    }

    $content =~ s/const myName = localStorage\.getItem\("yetalkUserName"\) \|\| "김예톡 원장";/const myName = getHanTalkAnonNick();/g;

    # Context menu & renderClinicChatMessages rewrite
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
    const myClinicName = localStorage.getItem("yetalkDoctorName") || "예톡 우리동네한의원";

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

    clinicNotices.unshift(newNotice);
    saveNoticeBoardData();
    renderNoticeBoardData();

    let allGlobalNotices = JSON.parse(localStorage.getItem("yetalk_all_notices") || "[]");
    allGlobalNotices.unshift(newNotice);
    localStorage.setItem("yetalk_all_notices", JSON.stringify(allGlobalNotices));

    let dangolCount = parseInt(localStorage.getItem("yetalk_dangol_new_notice_count") || "0", 10);
    localStorage.setItem("yetalk_dangol_new_notice_count", (dangolCount + 1).toString());

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

    if ($content !~ /updateHanTalkNickDisplay\(\);/) {
        $content =~ s/(renderNoticeBoardData\(\);)/$1\n    updateHanTalkNickDisplay();/;
    }

    open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!";
    print $out $content;
    close $out;
    print "Updated handoctormain.html\n";
}

# ===== 2. UPDATE DOCTORMAIN.HTML =====
{
    my $file = 'app/src/main/assets/doctormain.html';
    open my $fh, '<:encoding(UTF-8)', $file or die "Cannot open $file: $!";
    my $content = do { local $/; <$fh> };
    close $fh;

    # CSS fix: .fullscreen-detail-view padding-bottom
    $content =~ s/\.fullscreen-detail-view\s*\{[^}]*padding-bottom:\s*var\(--bottom-ad-h\);[^}]*\}/.fullscreen-detail-view {\n            display: none !important; position: fixed; inset: 0; background: #ffffff; z-index: 50000;\n            flex-direction: column; overflow: hidden; padding-bottom: 0;\n        }/s;

    my $context_css = <<'CSS';
        /* 카카오톡 스타일 말풍선 롱프레스 팝업 컨텍스트 메뉴 */
        .chat-context-overlay {
            display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45);
            z-index: 60000; align-items: center; justify-content: center;
        }
        .chat-context-overlay.open { display: flex; }
        .chat-context-card {
            background: #ffffff; border-radius: 16px; padding: 12px; width: 250px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.35); display: flex; flex-direction: column; gap: 6px;
        }
        .chat-context-btn {
            width: 100%; height: 44px; background: #f8fafc; border: 1px solid #e2e8f0;
            border-radius: 10px; font-size: 14px; font-weight: 850; color: #1e293b;
            display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
        }
        .chat-context-btn:active { background: #e2e8f0; }
        .chat-context-btn.del { color: #ef4444; }
        .chat-context-btn.close { background: none; border: none; color: #64748b; font-size: 13px; margin-top: 2px; }
CSS

    if ($content !~ /\.chat-context-overlay/) {
        $content =~ s/(\.fullscreen-detail-view\s*\{)/$context_css\n        $1/;
    }

    # Notice section: remove .notice-cat-grid & add bottom write form
    my $old_notice_section = <<'OLD_SEC';
    <!-- 3) 공지알림 탭 컨테이너 -->
    <main class="doc-tab-container" id="sec_notice">
        <!-- 3개 카테고리 박스 (의원 알림, 교회 알림, 음식점 및 기타 알림) -->
        <div class="notice-cat-grid">
            <div class="notice-cat-box active" id="catBox_clinic" onclick="switchNoticeCategory('clinic')">
                <span class="notice-cat-icon">🏥</span>
                <span class="notice-cat-label" id="lblNoticeClinicCat">의원 알림</span>
            </div>
            <div class="notice-cat-box" id="catBox_church" onclick="switchNoticeCategory('church')">
                <span class="notice-cat-icon">⛪</span>
                <span class="notice-cat-label">교회 알림</span>
            </div>
            <div class="notice-cat-box" id="catBox_store" onclick="switchNoticeCategory('store')">
                <span class="notice-cat-icon">🍽️</span>
                <span class="notice-cat-label">음식점 및 기타 알림</span>
            </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="font-size:16px; color:#0f172a;" id="dispNoticeFeedHeaderTitle">📢 의원 소식 피드</strong>
            <button type="button" style="background:#0284c7; color:#fff; border:none; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer;" onclick="openNoticeEditorFullscreen()">＋ 새 공지 작성</button>
        </div>
        <div id="noticeFeedContainer" style="display:flex; flex-direction:column; gap:12px;"></div>
    </main>
OLD_SEC

    my $new_notice_section = <<'NEW_SEC';
    <!-- 3) 공지알림 탭 컨테이너 -->
    <main class="doc-tab-container" id="sec_notice">
        <div style="background:#ffffff; border-radius:16px; border:1.5px solid var(--border); padding:14px 16px; box-shadow:0 2px 8px rgba(0,0,0,0.04); margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:12px; font-weight:800; color:#0284c7;">📢 의원 소식 발송 관리</span>
                    <h3 style="font-size:16.5px; font-weight:950; color:#0f172a;" id="dispNoticeFeedHeaderTitle">예톡아름다운 의원 공지소식</h3>
                </div>
                <span style="font-size:11px; color:#64748b; font-weight:700;">등록 시 회원 개인앱 및 단골로 자동 발송</span>
            </div>
        </div>

        <!-- 병원 등록 공지 목록 -->
        <div id="noticeFeedContainer" style="display:flex; flex-direction:column; gap:12px; margin-bottom:18px;"></div>

        <!-- 🌟 [사용자 요청] 공지알림 등록 폼을 밑에 배치 + 사진 파일 선택도 밑에 + 애드몹 위 배치 -->
        <section style="background:#ffffff; border:1.8px solid #0284c7; border-radius:18px; padding:16px; box-shadow:0 4px 14px rgba(2,132,199,0.08); margin-bottom:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1.5px solid #e0f2fe; padding-bottom:8px;">
                <strong style="font-size:15px; font-weight:950; color:#0284c7;">📝 새 공지사항 작성 및 회원 자동 발송</strong>
                <span style="font-size:11px; color:#0284c7; font-weight:800;">원내 공식 공지</span>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:10px;">
                <input type="text" id="inpDirectNoticeTitle" class="m-large-input" placeholder="공지 제목을 입력하세요 (예: 10월 진료 일정 및 안내)">
                <textarea id="inpDirectNoticeContent" class="m-large-input" style="height:85px; padding:10px; resize:none;" placeholder="환자 및 가입 회원들에게 전달할 공지 내용을 작성해주세요."></textarea>
                
                <!-- 사진 파일 선택 (밑에 배치) -->
                <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #e2e8f0;">
                    <label style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; background:#e0f2fe; color:#0284c7; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:900;">
                        <span>📷 사진 파일 선택</span>
                        <input type="file" id="inpDirectNoticePhoto" accept="image/*" style="display:none;" onchange="handleDirectNoticePhoto(event)">
                    </label>
                    <span id="txtDirectNoticePhotoStatus" style="font-size:11.5px; color:#64748b; font-weight:700;">첨부된 사진 없음</span>
                </div>
                <div id="previewDirectNoticePhotoBox" style="display:none; max-height:160px; overflow:hidden; border-radius:10px; border:1px solid #cbd5e1;">
                    <img id="imgDirectNoticePhotoPreview" src="" style="width:100%; height:100%; object-fit:cover;">
                </div>

                <button type="button" style="height:48px; background:linear-gradient(135deg, #0284c7, #2563eb); color:#fff; border:none; border-radius:12px; font-size:15px; font-weight:950; cursor:pointer; box-shadow:0 3px 10px rgba(2,132,199,0.25);" onclick="submitDirectClinicNotice()">
                    📢 공지 등록 및 회원 개인앱(onemain)·단골 발송
                </button>
            </div>
        </section>
    </main>
NEW_SEC

    $content =~ s/\Q$old_notice_section\E/$new_notice_section/;

    # DocTalk Header: 닥톡 (원장 일상 수다방)
    $content =~ s/<span class="detail-title-head">🩺 닥톡 \(DocTalk - 원장 전용\)<\/span>/<span class="detail-title-head">🩺 닥톡 (원장 일상 수다방)<\/span>/;

    if ($content !~ /changeDocTalkAnonNick/) {
        $content =~ s/(<button type="button" class="btn-pc-popup" onclick="window\.open\('doctalk_popup\.html\?role=doctor'[^>]*>)/<button type="button" class="btn-pc-popup" style="background:#0284c7; color:#fff;" onclick="changeDocTalkAnonNick()">👤 익명 ID: <span id="dispCurDocTalkNick">커피수혈원장<\/span> ✏️<\/button>\n            $1/;
    }

    # FAB position
    $content =~ s/bottom:calc\(var\(--bottom-ad-h\) \+ 16px\);/bottom:calc(var(--bottom-ad-h) + 38px);/g;

    # modalDocTalkDetailView (Post Detail)
    $content =~ s/<span class="detail-title-head" style="font-size:16px;">🩺 닥톡 학술\/임상 나눔<\/span>/<span class="detail-title-head" style="font-size:16px;">🩺 닥톡 일상 수다방<\/span>/;
    $content =~ s/<input type="text" id="dtDetailCommentInput" placeholder="따뜻한 학술\/임상 댓글을 남겨주세요\.\.\."/<input type="text" id="dtDetailCommentInput" placeholder="재미있는 일상 수다 댓글을 남겨주세요..."/;

    my $doc_detail_admob = <<'AD_HTML';
    <!-- 🌟 [사용자 요청] 닥톡 글 상세 뷰 최하단 고정 Google AdMob 배너 -->
    <div class="detail-bottom-admob">
        <div style="font-size:9.5px; color:#94a3b8; font-weight:700; margin-bottom:2px;">AD • Google AdMob 공식 스폰서 슬롯 (320 × 100)</div>
        <div class="admob-display-box" style="height:52px;">
            <strong style="color:#38bdf8; font-size:12.5px; font-weight:950;">Google AdMob Large Banner</strong>
            <span style="color:#facc15; font-size:10px; font-weight:700;">원장 일상 커뮤니케이션 공식 후원 슬롯</span>
        </div>
    </div>
</div>
AD_HTML

    if ($content !~ /닥톡 글 상세 뷰 최하단 고정 Google AdMob 배너/) {
        $content =~ s/(<div id="dtDetailCommentList"[^>]*><\/div>\s*<\/div>\s*)(<\/div>)/$1$doc_detail_admob/;
    }

    # Post write modal
    $content =~ s/<strong style="font-size:16px; color:#0284c7;" id="dispDocTalkPostModalTitle">✏️ 닥톡 학술\/임상 글 작성<\/strong>/<strong style="font-size:16px; color:#0284c7;" id="dispDocTalkPostModalTitle">✏️ 닥톡 이야기 나누기<\/strong>/;
    $content =~ s/<label style="font-size:12px; font-weight:900; color:#0284c7; display:block; margin-bottom:3px;">진료 과목 및 소속<\/label>\s*<input type="text" id="inpDocTalkDept"[^>]*>/<label style="font-size:12px; font-weight:900; color:#0284c7; display:block; margin-bottom:3px;">익명 아이디 (닉네임): <strong id="dispPostAnonNick" style="color:#f59e0b;">커피수혈원장<\/strong><\/label><input type="hidden" id="inpDocTalkDept" value="자유수다">/s;

    # Context menu modal right before </body>
    my $context_menu_modal = <<'MODAL_HTML';
<!-- 카카오톡 스타일 말풍선 롱프레스 팝업 컨텍스트 메뉴 -->
<div class="chat-context-overlay" id="modalClinicContextMenu" onclick="if(event.target===this) closeClinicContextMenu()">
    <div class="chat-context-card">
        <div style="font-size:12px; font-weight:800; color:#64748b; padding:4px 6px; border-bottom:1px solid #f1f5f9; margin-bottom:4px;">메시지 관리</div>
        <button type="button" class="chat-context-btn" onclick="handleCtxCopy()">📋 메시지 복사</button>
        <button type="button" class="chat-context-btn" id="btnCtxEdit" onclick="handleCtxEdit()">✏️ 메시지 수정</button>
        <button type="button" class="chat-context-btn del" id="btnCtxDelete" onclick="handleCtxDelete()">🗑️ 메시지 삭제</button>
        <button type="button" class="chat-context-btn close" onclick="closeClinicContextMenu()">✕ 닫기</button>
    </div>
</div>
MODAL_HTML

    if ($content !~ /modalClinicContextMenu/) {
        $content =~ s/(<\/body>)/$context_menu_modal\n$1/;
    }

    # JS Code updates
    my $new_posts_code = <<'POSTS_CODE';
const DEFAULT_DOCTALK_POSTS = [
    {
        id: "dt_1",
        author: "커피수혈원장",
        dept: "자유수다",
        date: "오늘 12:20",
        title: "원장님들 오늘 하루도 커피 3잔으로 버티는 중입니다☕",
        body: "오전 진료 연속으로 보고 아이스 아메리카노 수혈 중이네요ㅋㅋ\n점심 맛있는 거 드시고 오후 진료도 힘내세요!",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
        comments: [
            { id: 101, author: "퇴근마려운원장", time: "12:26", text: "저도 방금 카페라떼 한 잔 마셨네요 힘냅시다!" }
        ]
    },
    {
        id: "dt_2",
        author: "퇴근마려운원장",
        dept: "야식메뉴",
        date: "오늘 10:15",
        title: "퇴근 30분 전... 오늘 야식 메뉴 투표 받습니다🍕",
        body: "치맥 vs 피자 vs 떡볶이... 오늘따라 퇴근길 발걸음이 가벼울 것 같습니다ㅎㅎ\n다들 칼퇴 기원합니다!",
        youtubeUrl: "",
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        comments: []
    },
    {
        id: "dt_3",
        author: "골프초보원장",
        dept: "주말힐링",
        date: "어제 18:40",
        title: "주말에 힐링할 만한 드라이브 코스 있을까요?",
        body: "도심 벗어나서 조용한 카페나 바다 보고 오고 싶은데 추천해주실 만한 곳 있으면 알려주세요~",
        youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        img: "",
        comments: []
    }
];
POSTS_CODE

    $content =~ s/const DEFAULT_DOCTALK_POSTS = \[.*?\];/ $new_posts_code /s;

    my $nick_funcs = <<'NICK_CODE';
function getDocTalkAnonNick() {
    let nick = localStorage.getItem("yetalk_doc_anon_nick");
    if (!nick) {
        nick = "커피수혈원장";
        localStorage.setItem("yetalk_doc_anon_nick", nick);
    }
    return nick;
}

function changeDocTalkAnonNick() {
    const cur = getDocTalkAnonNick();
    const next = prompt("교체할 익명 아이디(닉네임)를 입력하세요:\n(자연스러운 카톡방처럼 편하게 대화할 수 있습니다)", cur);
    if (!next || !next.trim() || next.trim() === cur) return;
    localStorage.setItem("yetalk_doc_anon_nick", next.trim());
    updateDocTalkNickDisplay();
    showToast(`👤 익명 ID가 "${next.trim()}"(으)로 교체되었습니다.`);
}

function updateDocTalkNickDisplay() {
    const nick = getDocTalkAnonNick();
    const el1 = document.getElementById("dispCurDocTalkNick");
    if (el1) el1.innerText = nick;
    const el2 = document.getElementById("dispPostAnonNick");
    if (el2) el2.innerText = nick;
}
NICK_CODE

    if ($content !~ /getDocTalkAnonNick/) {
        $content =~ s/(let docTalkPosts = \[\];)/$nick_funcs\n$1/;
    }

    $content =~ s/const myName = localStorage\.getItem\("yetalkUserName"\) \|\| "김예톡 원장";/const myName = getDocTalkAnonNick();/g;

    # Context menu & renderClinicChatMessages rewrite
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
    const myClinicName = localStorage.getItem("yetalkDoctorName") || "예톡아름다운 의원";

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

    clinicNotices.unshift(newNotice);
    saveNoticeBoardData();
    renderNoticeBoardData();

    let allGlobalNotices = JSON.parse(localStorage.getItem("yetalk_all_notices") || "[]");
    allGlobalNotices.unshift(newNotice);
    localStorage.setItem("yetalk_all_notices", JSON.stringify(allGlobalNotices));

    let dangolCount = parseInt(localStorage.getItem("yetalk_dangol_new_notice_count") || "0", 10);
    localStorage.setItem("yetalk_dangol_new_notice_count", (dangolCount + 1).toString());

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

    if ($content !~ /updateDocTalkNickDisplay\(\);/) {
        $content =~ s/(renderNoticeBoardData\(\);)/$1\n    updateDocTalkNickDisplay();/;
    }

    open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!";
    print $out $content;
    close $out;
    print "Updated doctormain.html\n";
}
