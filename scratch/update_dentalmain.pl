use strict;
use warnings;
use utf8;
binmode(STDIN, ':encoding(UTF-8)');
binmode(STDOUT, ':encoding(UTF-8)');

my $file = 'app/src/main/assets/dentalmain.html';
open my $fh, '<:encoding(UTF-8)', $file or die "Cannot open $file: $!";
my $content = do { local $/; <$fh> };
close $fh;

# 1. CSS fix: .fullscreen-detail-view padding-bottom
$content =~ s/\.fullscreen-detail-view\s*\{[^}]*padding-bottom:\s*var\(--bottom-ad-h\);[^}]*\}/.fullscreen-detail-view {\n            display: none !important; position: fixed; inset: 0; background: #ffffff; z-index: 50000;\n            flex-direction: column; overflow: hidden; padding-bottom: 0;\n        }/s;

# 1-2. Add chat context menu CSS
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

# 2. Sub action bar button: change 닥톡 -> 치의톡
$content =~ s/(<button type="button" class="btn-sub-chip btn-sub-doctalk"[^>]*>)닥톡(<\/button>)/$1치의톡$2/g;

# 3. Notice tab in dentalmain: replace .notice-cat-grid and top write button with clean clinic notice & bottom form
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
            <strong style="font-size:16px; color:#0f172a;" id="dispNoticeFeedHeaderTitle">📢 치과 소식 피드</strong>
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
                    <span style="font-size:12px; font-weight:800; color:#0284c7;">📢 치과 소식 발송 관리</span>
                    <h3 style="font-size:16.5px; font-weight:950; color:#0f172a;" id="dispNoticeFeedHeaderTitle">예톡 스마일치과의원 공지소식</h3>
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
                <input type="text" id="inpDirectNoticeTitle" class="m-large-input" placeholder="공지 제목을 입력하세요 (예: 10월 치과 진료 안내)">
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

# 4. DocTalk Header & Nickname button & FAB position
$content =~ s/<span class="detail-title-head">🩺 닥톡 \(DenTalk - 치과의사 전용\)<\/span>/<span class="detail-title-head">🩺 치의톡 (치과의사 일상 수다방)<\/span>/;

# Insert Nickname change button into detail-top-nav of viewDetailChat
if ($content !~ /changeDenTalkAnonNick/) {
    $content =~ s/(<button type="button" class="btn-pc-popup" onclick="window\.open\('doctalk_popup\.html\?role=dentist'[^>]*>)/<button type="button" class="btn-pc-popup" style="background:#0284c7; color:#fff;" onclick="changeDenTalkAnonNick()">👤 익명 ID: <span id="dispCurDenTalkNick">치아요정원장<\/span> ✏️<\/button>\n            $1/;
}

# FAB position: raise above AdMob (bottom: 125px instead of bottom:calc(var(--bottom-ad-h) + 16px))
$content =~ s/bottom:calc\(var\(--bottom-ad-h\) \+ 16px\);/bottom:calc(var(--bottom-ad-h) + 38px);/g;

# 5. modalDenTalkDetailView (Post Detail): Header title -> 치의톡 일상 수다방 & Add bottom AdMob
$content =~ s/<span class="detail-title-head" style="font-size:16px;">🩺 닥톡 학술\/임상 나눔<\/span>/<span class="detail-title-head" style="font-size:16px;">🦷 치의톡 일상 수다방<\/span>/;
$content =~ s/<input type="text" id="dtDetailCommentInput" placeholder="따뜻한 학술\/임상 댓글을 남겨주세요\.\.\."/<input type="text" id="dtDetailCommentInput" placeholder="재미있는 일상 수다 댓글을 남겨주세요..."/;

my $detail_bottom_admob = <<'AD_HTML';
    <!-- 🌟 [사용자 요청] 치의톡 글 상세 뷰 최하단 고정 Google AdMob 배너 -->
    <div class="detail-bottom-admob">
        <div style="font-size:9.5px; color:#94a3b8; font-weight:700; margin-bottom:2px;">AD • Google AdMob 공식 스폰서 슬롯 (320 × 100)</div>
        <div class="admob-display-box" style="height:52px;">
            <strong style="color:#38bdf8; font-size:12.5px; font-weight:950;">Google AdMob Large Banner</strong>
            <span style="color:#facc15; font-size:10px; font-weight:700;">치과의사 일상 커뮤니케이션 공식 후원 슬롯</span>
        </div>
    </div>
</div>
AD_HTML

if ($content !~ /치의톡 글 상세 뷰 최하단 고정 Google AdMob 배너/) {
    $content =~ s/(<div id="dtDetailCommentList"[^>]*><\/div>\s*<\/div>\s*)(<\/div>)/$1$detail_bottom_admob/;
}

# 6. Post write modal
$content =~ s/<strong style="font-size:16px; color:#0284c7;" id="dispDenTalkPostModalTitle">✏️ 닥톡 학술\/임상 글 작성<\/strong>/<strong style="font-size:16px; color:#0284c7;" id="dispDenTalkPostModalTitle">✏️ 치의톡 이야기 나누기<\/strong>/;
$content =~ s/<label style="font-size:12px; font-weight:900; color:#0284c7; display:block; margin-bottom:3px;">진료 과목 및 소속<\/label>\s*<input type="text" id="inpDenTalkDept"[^>]*>/<label style="font-size:12px; font-weight:900; color:#0284c7; display:block; margin-bottom:3px;">익명 아이디 (닉네임): <strong id="dispPostAnonNick" style="color:#f59e0b;">치아요정원장<\/strong><\/label><input type="hidden" id="inpDenTalkDept" value="자유수다">/s;

# 7. Add Clinic context menu modal right before </body>
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

open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!";
print $out $content;
close $out;
print "Updated markup in $file\n";
