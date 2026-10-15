use strict;
use warnings;
use utf8;
binmode(STDIN, ':encoding(UTF-8)');
binmode(STDOUT, ':encoding(UTF-8)');

# 1. Update doctalk_popup.html
{
    my $file = 'app/src/main/assets/doctalk_popup.html';
    open my $fh, '<:encoding(UTF-8)', $file or die "Cannot open $file: $!";
    my $content = do { local $/; <$fh> };
    close $fh;

    # Replace stiff title and add nick change button in header
    my $old_header = <<'OLD_HDR';
        <div class="header-left">
            <span style="font-size: 20px;">🩺</span>
            <div class="header-title">
                <span id="dispDocTalkTitle">닥톡 (DocTalk)</span>
                <span class="window-badge">PC 모니터 화면</span>
            </div>
        </div>
        <button type="button" class="btn-header-action" onclick="render()">🔄 새로고침</button>
OLD_HDR

    my $new_header = <<'NEW_HDR';
        <div class="header-left">
            <span style="font-size: 20px;">💬</span>
            <div class="header-title">
                <span id="dispDocTalkTitle">닥톡 (DocTalk)</span>
                <span class="window-badge">PC 수다방</span>
            </div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
            <button type="button" class="btn-header-action" style="background:#fff; border:1px solid #e5ce00; font-weight:900;" onclick="changePopupAnonNick()">👤 익명 ID: <span id="dispPopupNick">커피수혈원장</span> ✏️</button>
            <button type="button" class="btn-header-action" onclick="render()">🔄 새로고침</button>
        </div>
NEW_HDR

    $content =~ s/\Q$old_header\E/$new_header/;

    # Update input placeholders
    $content =~ s/placeholder="학술·임상 메모 또는 원장 공유 제목 \(한줄\)"/placeholder="일상 이야기, 농담, 맛집 추천 등 가벼운 제목 (한줄)"/;
    $content =~ s/placeholder="임상 내용 또는 케이스를 입력하세요 \(긴 글은 5줄로 자동 생략됩니다\)"/placeholder="자유롭게 이야기를 나눠보세요 (퇴근길, 일상, 취미 등)"/;

    # Update script
    my $new_posts_and_roles = <<'SCRIPT_CHUNK';
        const DEFAULT_POSTS = [
            {
                id: 1,
                author: "커피수혈원장",
                date: "오늘 12:20",
                title: "오늘 점심 병원 근처 평양냉면집 대박이네요ㅋㅋ",
                content: "원장님들 오늘 점심 뭐 드셨나요?\n병원 뒷골목에 새로 생긴 평양냉면 육수가 진짜 예술입니다ㅋㅋ\n시원하게 한 그릇 완냉하고 오후 진료 힘내서 달려봅니다!\n다들 맛점하시고 오늘 하루도 파이팅하세요~",
                comments: [
                    { id: 101, author: "퇴근마려운원장", time: "12:28", text: "오 거기 저도 가봤는데 녹두전도 맛있습니다ㅋㅋ" }
                ]
            },
            {
                id: 2,
                author: "퇴근마려운원장",
                date: "오늘 10:15",
                title: "퇴근 30분 전... 오늘 야식 메뉴 투표 받습니다🍕",
                content: "치맥 vs 피자 vs 떡볶이...\n오늘따라 퇴근길 발걸음이 무척 가벼울 것 같습니다ㅎㅎ\n원장님들 오늘 저녁 메뉴 추천 부탁드립니다!\n다들 칼퇴 기원합니다~",
                comments: [
                    { id: 102, author: "야식매니아", time: "10:30", text: "날씨 쌀쌀하니 오늘은 무조건 치맥입니다ㅎㅎ" }
                ]
            }
        ];

        const urlParams = new URLSearchParams(window.location.search);
        const roleParam = urlParams.get("role") || localStorage.getItem("yetalkUserMedicalRole") || "doctor";
        let storageKey = "yetalk_doctalk_posts_v10";
        let appTitle = "닥톡 (DocTalk)";
        let roleBadge = "원장 일상 수다방";
        let defaultNick = "커피수혈원장";

        if (roleParam === 'korean_doctor') {
            storageKey = "han_doc_talk_feed_list";
            appTitle = "한의톡 (HanTalk)";
            roleBadge = "한의사 일상 수다방";
            defaultNick = "쌍화탕러버";
        } else if (roleParam === 'dentist') {
            storageKey = "dental_doc_talk_feed_list";
            appTitle = "치의톡 (DenTalk)";
            roleBadge = "치과의사 일상 수다방";
            defaultNick = "치아요정원장";
        }

        function getPopupAnonNick() {
            let nickKey = "yetalk_popup_nick_" + roleParam;
            let nick = localStorage.getItem(nickKey);
            if (!nick) {
                nick = defaultNick;
                localStorage.setItem(nickKey, nick);
            }
            return nick;
        }

        function changePopupAnonNick() {
            const cur = getPopupAnonNick();
            const next = prompt("교체할 익명 아이디(닉네임)를 입력하세요:\n(자연스러운 카톡방처럼 편하게 대화할 수 있습니다)", cur);
            if (!next || !next.trim() || next.trim() === cur) return;
            localStorage.setItem("yetalk_popup_nick_" + roleParam, next.trim());
            updatePopupNickDisplay();
            render();
        }

        function updatePopupNickDisplay() {
            const el = document.getElementById("dispPopupNick");
            if (el) el.innerText = getPopupAnonNick();
        }
SCRIPT_CHUNK

    $content =~ s/const DEFAULT_POSTS = \[.*?let defaultAuthor = "[^"]*";\s*\}/$new_posts_and_roles/s;

    # In addComment & submitPost: use getPopupAnonNick()
    $content =~ s/const myName = localStorage\.getItem\("yetalkUserName"\) \|\| "김예톡 원장";/const myName = getPopupAnonNick();/g;

    # In DOMContentLoaded: call updatePopupNickDisplay()
    $content =~ s/(render\(\);\s*\}\);)/updatePopupNickDisplay();\n            $1/;

    open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!";
    print $out $content;
    close $out;
    print "Updated doctalk_popup.html\n";
}

# 2. Update clinictalk_popup.html: context menu on bubbles & clean layout
{
    my $file = 'app/src/main/assets/clinictalk_popup.html';
    open my $fh, '<:encoding(UTF-8)', $file or die "Cannot open $file: $!";
    my $content = do { local $/; <$fh> };
    close $fh;

    # Remove inline chat-actions from render()
    my $old_render_part = <<'OLD_RND';
                        <div class="chat-actions">
                            <span class="chat-action-btn" onclick="copyMsg(${idx})">📋 복사</span>
                            ${msg.mine ? `<span class="chat-action-btn" onclick="editMsg(${idx})">✏️ 수정</span>` : ''}
                            ${msg.mine ? `<span class="chat-action-btn" style="color:#ef4444;" onclick="deleteMsg(${idx})">🗑️ 삭제</span>` : ''}
                        </div>
OLD_RND

    my $new_render_part = <<'NEW_RND';
                        <div class="chat-actions" style="opacity:0.75; font-size:10px; cursor:pointer;" onclick="openClinicCtxPopup(${idx})">
                            <span>••• 더보기</span>
                        </div>
NEW_RND

    $content =~ s/\Q$old_render_part\E/$new_render_part/;

    open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!";
    print $out $content;
    close $out;
    print "Updated clinictalk_popup.html\n";
}
