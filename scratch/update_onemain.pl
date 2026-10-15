use strict;
use warnings;
use utf8;
binmode(STDIN, ':encoding(UTF-8)');
binmode(STDOUT, ':encoding(UTF-8)');

my $file = 'app/src/main/assets/onemain.html';
open my $fh, '<:encoding(UTF-8)', $file or die "Cannot open $file: $!";
my $content = do { local $/; <$fh> };
close $fh;

# 1. Update nav chip for Friends & Dangol
$content =~ s/<button type="button" class="one-nav-chip" id="chip_friends" onclick="switchSection\('friends'\)">4\. 예톡 친구<\/button>/<button type="button" class="one-nav-chip" id="chip_friends" onclick="switchSection('friends')">4. 예톡 단골·친구 <span id="badgeDangolCountChip" style="background:#ef4444; color:#fff; font-size:10px; font-weight:900; padding:1px 6px; border-radius:10px; margin-left:2px; display:inline-block;">2<\/span><\/button>/;

$content =~ s/<button type="button" class="one-nav-chip" id="chip_notice" onclick="switchSection\('notice'\)">5\. 공지알림<\/button>/<button type="button" class="one-nav-chip" id="chip_notice" onclick="switchSection('notice')">5. 공지알림 <span id="badgeNoticeCountChip" style="background:#0284c7; color:#fff; font-size:10px; font-weight:900; padding:1px 6px; border-radius:10px; margin-left:2px; display:inline-block;">3<\/span><\/button>/;

# 2. In sec_friends, add the Dangol notice banner at the top
my $dangol_banner = <<'BANNER_HTML';
                    <!-- 🌟 [사용자 요청] 단골 새 소식 바로가기 및 알림 숫자 배너 -->
                    <div style="background:linear-gradient(135deg, #1e3a5f, #0f1f38); border:1.5px solid #38bdf8; border-radius:14px; padding:12px 14px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; box-shadow:0 4px 12px rgba(56,189,248,0.15);" onclick="switchSection('notice')">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:24px;">🔔</span>
                            <div>
                                <div style="font-size:13.5px; font-weight:950; color:#fff;">단골 병원·교회·매장에서 새 공지가 도착했습니다!</div>
                                <div style="font-size:11px; color:#93c5fd;">터치 시 오늘 도착한 공지알림으로 바로 이동 ➔</div>
                            </div>
                        </div>
                        <span id="badgeDangolAlertNum" style="background:#ef4444; color:#fff; font-size:12px; font-weight:950; padding:3px 9px; border-radius:12px; box-shadow:0 2px 6px rgba(239,68,68,0.4);">2건</span>
                    </div>
BANNER_HTML

if ($content !~ /badgeDangolAlertNum/) {
    $content =~ s/(<div class="kakao-friends-wrap">\s*<div class="kf-top-header">.*?<\/div>)/$1\n$dangol_banner/s;
}

# 3. Replace sec_notice with the 3 category boxes and today's notice single-column list
my $old_notice_html = <<'OLD_SEC';
        <!-- 🌟 5. 공지알림 섹션 (전체 피드 꽉 채움, 별점 순 & 교회 정회원 최상단 고정) -->
        <div class="one-tab-page-container" id="sec_notice">
            <section class="one-v-page" id="page_notice_1" style="background:#0a1322; padding:16px 14px 90px 14px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #1f375b; padding-bottom:10px;">
                    <div>
                        <div style="font-size:12px; font-weight:800; color:#38bdf8;">📢 실시간 통합 피드</div>
                        <h2 style="font-size:18px; font-weight:950; color:#ffffff;">전체 공지알림</h2>
                    </div>
                    <button type="button" id="btnChurchMemberBadge" style="background:#12213a; color:#38bdf8; border:1.2px solid #2563eb; padding:6px 11px; border-radius:10px; font-size:11.5px; font-weight:900; cursor:pointer;" onclick="toggleChurchMembership()">
                        ⛪ 교회 정회원: <span id="txtChurchMemberStatus" style="color:#fde047;">가입 (최우선 고정)</span>
                    </button>
                </div>

                <div id="noticeFullFeedContainer" style="display:flex; flex-direction:column; gap:12px; flex:1;"></div>
            </section>
        </div>
OLD_SEC

my $new_notice_html = <<'NEW_SEC';
        <!-- 🌟 5. 공지알림 섹션 (3개 카테고리 박스 + 당일 공지 일렬 나열) -->
        <div class="one-tab-page-container" id="sec_notice">
            <section class="one-v-page" id="page_notice_1" style="background:#0a1322; padding:16px 14px 90px 14px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #1f375b; padding-bottom:10px;">
                    <div>
                        <div style="font-size:12px; font-weight:800; color:#38bdf8;">📢 실시간 통합 피드</div>
                        <h2 style="font-size:18px; font-weight:950; color:#ffffff;">전체 공지알림</h2>
                    </div>
                    <button type="button" id="btnChurchMemberBadge" style="background:#12213a; color:#38bdf8; border:1.2px solid #2563eb; padding:6px 11px; border-radius:10px; font-size:11.5px; font-weight:900; cursor:pointer;" onclick="toggleChurchMembership()">
                        ⛪ 교회 정회원: <span id="txtChurchMemberStatus" style="color:#fde047;">가입 (최우선 고정)</span>
                    </button>
                </div>

                <!-- 🌟 [사용자 요청] 3개 분야별 카테고리 박스 (의원/한의/치과 알림, 교회 알림, 음식점 및 기타 알림) -->
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
                    <div class="one-notice-cat-card active" id="oneNoticeCat_clinic" onclick="filterOneNoticeCat('clinic')" style="background:#0f1f38; border:2px solid #0284c7; border-radius:14px; padding:12px 6px; text-align:center; cursor:pointer; box-shadow:0 3px 10px rgba(2,132,199,0.25);">
                        <div style="font-size:24px; margin-bottom:3px;">🏥</div>
                        <strong style="font-size:13px; color:#ffffff; display:block;">의원·한의·치과</strong>
                        <span style="font-size:10px; color:#38bdf8; font-weight:700;">진료/원내 알림</span>
                    </div>
                    <div class="one-notice-cat-card" id="oneNoticeCat_church" onclick="filterOneNoticeCat('church')" style="background:#0f172a; border:2px solid #334155; border-radius:14px; padding:12px 6px; text-align:center; cursor:pointer;">
                        <div style="font-size:24px; margin-bottom:3px;">⛪</div>
                        <strong style="font-size:13px; color:#ffffff; display:block;">교회 알림</strong>
                        <span style="font-size:10px; color:#fde047; font-weight:700;">예배/기도/소식</span>
                    </div>
                    <div class="one-notice-cat-card" id="oneNoticeCat_store" onclick="filterOneNoticeCat('store')" style="background:#0f172a; border:2px solid #334155; border-radius:14px; padding:12px 6px; text-align:center; cursor:pointer;">
                        <div style="font-size:24px; margin-bottom:3px;">🍽️</div>
                        <strong style="font-size:13px; color:#ffffff; display:block;">음식점 및 기타</strong>
                        <span style="font-size:10px; color:#a7f3d0; font-weight:700;">단골 맛집/상점</span>
                    </div>
                </div>

                <!-- 🌟 [사용자 요청] 버튼 밑에 '당일날 온 공지 알림이 일렬로 짝 나열' -->
                <div id="secTodayNoticesArea" style="background:linear-gradient(135deg, #132238, #0a1322); border:1.8px solid #38bdf8; border-radius:16px; padding:12px 14px; box-shadow:0 4px 16px rgba(56,189,248,0.2);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #1f375b; padding-bottom:6px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="font-size:18px;">⚡</span>
                            <strong style="font-size:14px; font-weight:950; color:#38bdf8;">오늘(당일) 도착한 신규 공지알림</strong>
                        </div>
                        <span id="badgeTodayNoticeCount" style="background:#ef4444; color:#fff; font-size:11px; font-weight:900; padding:2px 8px; border-radius:10px;">0건</span>
                    </div>
                    <div id="todayNoticesListContainer" style="display:flex; flex-direction:column; gap:8px;"></div>
                </div>

                <!-- 선택 카테고리 피드 헤더 & 전체보기 토글 -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                    <strong style="font-size:13.5px; font-weight:900; color:#94a3b8;" id="dispOneNoticeCatTitle">📋 카테고리별 공지 목록</strong>
                    <button type="button" style="background:#1e293b; color:#38bdf8; border:1px solid #334155; padding:4px 9px; border-radius:6px; font-size:11px; font-weight:800; cursor:pointer;" onclick="filterOneNoticeCat('all')">전체보기</button>
                </div>

                <div id="noticeFullFeedContainer" style="display:flex; flex-direction:column; gap:12px; flex:1;"></div>
            </section>
        </div>
NEW_SEC

$content =~ s/\Q$old_notice_html\E/$new_notice_html/;

# 4. Replace renderFullNoticeSection logic in script
my $new_notice_script = <<'SCRIPT_CODE';
    let currentNoticeFilterCat = "all";

    function filterOneNoticeCat(cat) {
        currentNoticeFilterCat = cat;
        ["clinic", "church", "store"].forEach(c => {
            const el = document.getElementById("oneNoticeCat_" + c);
            if (el) {
                if (cat === c) {
                    el.style.border = "2px solid #38bdf8";
                    el.style.background = "#0f1f38";
                    el.style.boxShadow = "0 3px 10px rgba(56,189,248,0.3)";
                } else {
                    el.style.border = "2px solid #334155";
                    el.style.background = "#0f172a";
                    el.style.boxShadow = "none";
                }
            }
        });
        const titleEl = document.getElementById("dispOneNoticeCatTitle");
        if (titleEl) {
            if (cat === "clinic") titleEl.innerText = "🏥 의원·한의·치과 알림 목록";
            else if (cat === "church") titleEl.innerText = "⛪ 교회 알림 목록";
            else if (cat === "store") titleEl.innerText = "🍽️ 음식점 및 기타 알림 목록";
            else titleEl.innerText = "📋 전체 공지 피드";
        }
        renderFullNoticeSection();
    }

    function renderFullNoticeSection() {
        const container = document.getElementById("noticeFullFeedContainer");
        const todayContainer = document.getElementById("todayNoticesListContainer");
        const badgeToday = document.getElementById("badgeTodayNoticeCount");
        const badgeDangol = document.getElementById("badgeDangolAlertNum");
        const badgeDangolChip = document.getElementById("badgeDangolCountChip");
        const badgeNoticeChip = document.getElementById("badgeNoticeCountChip");

        let notices = getAllNotices();

        const now = new Date();
        const todayStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
        const todayStr2 = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

        const todayNotices = notices.filter(n => {
            const d = n.date || "";
            return n.isToday || d.includes(todayStr) || d.includes(todayStr2) || d.includes("오늘") || d.includes("10.12") || d.includes("10.13");
        });

        if (badgeToday) badgeToday.innerText = `${todayNotices.length}건`;
        if (badgeDangol) badgeDangol.innerText = `${todayNotices.length}건`;
        if (badgeDangolChip) badgeDangolChip.innerText = `${todayNotices.length}`;
        if (badgeNoticeChip) badgeNoticeChip.innerText = `${notices.length}`;

        // 1) 당일 공지 일렬 렌더링
        if (todayContainer) {
            if (todayNotices.length === 0) {
                todayContainer.innerHTML = `<div style="text-align:center; padding:12px; color:#64748b; font-size:12.5px;">오늘 새로 도착한 공지가 없습니다.</div>`;
            } else {
                todayContainer.innerHTML = todayNotices.map(item => `
                    <div style="background:#1e293b; border:1px solid #38bdf8; border-radius:12px; padding:10px 12px; display:flex; flex-direction:column; gap:4px; box-shadow:0 2px 8px rgba(0,0,0,0.25);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:11.5px; font-weight:900; background:#0284c7; color:#fff; padding:2px 7px; border-radius:6px;">${item.sender}</span>
                            <span style="font-size:11px; color:#fde047; font-weight:800;">⚡ 오늘 도착</span>
                        </div>
                        <strong style="font-size:14.5px; color:#ffffff; font-weight:950; margin-top:2px;">${item.title}</strong>
                        <p style="font-size:12.5px; color:#cbd5e1; line-height:1.5; white-space:pre-wrap;">${item.content || item.body || ""}</p>
                        ${item.img ? `<img src="${item.img}" style="max-height:130px; border-radius:8px; object-fit:cover; margin-top:4px;" alt="사진">` : ''}
                    </div>
                `).join("");
            }
        }

        // 2) 카테고리 필터링된 전체 공지 목록 렌더링
        let filtered = notices;
        if (currentNoticeFilterCat === "clinic") {
            filtered = notices.filter(n => n.senderType === "clinic" || n.sender?.includes("의원") || n.sender?.includes("치과") || n.sender?.includes("한의원"));
        } else if (currentNoticeFilterCat === "church") {
            filtered = notices.filter(n => n.isChurchNotice || n.senderType === "church" || n.sender?.includes("교회"));
        } else if (currentNoticeFilterCat === "store") {
            filtered = notices.filter(n => n.senderType === "store" || n.senderType === "hq" || (!n.isChurchNotice && !n.sender?.includes("의원") && !n.sender?.includes("치과") && !n.sender?.includes("한의원")));
        }

        filtered.sort((a, b) => {
            if (isChurchMember) {
                if (a.isChurchNotice && !b.isChurchNotice) return -1;
                if (!a.isChurchNotice && b.isChurchNotice) return 1;
            }
            return (b.date || "").localeCompare(a.date || "");
        });

        if (container) {
            if (filtered.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:30px; color:#64748b;">해당 분야의 등록된 공지가 없습니다.</div>`;
                return;
            }
            container.innerHTML = filtered.map(item => {
                const isChurch = item.isChurchNotice;
                return `
                    <div style="background:#1e293b; border:${isChurch && isChurchMember ? '2px solid #38bdf8' : '1px solid #334155'}; border-radius:16px; padding:16px; display:flex; flex-direction:column; gap:8px; box-shadow:0 4px 14px rgba(0,0,0,0.3); position:relative;">
                        ${isChurch && isChurchMember ? `
                        <div style="position:absolute; top:-10px; right:14px; background:#0284c7; color:#fff; font-size:10.5px; font-weight:950; padding:2px 8px; border-radius:10px;">
                            📌 교회 정회원 최상단 고정
                        </div>
                        ` : ''}
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:12px; font-weight:900; background:${isChurch ? '#0369a1' : '#1e3a5f'}; color:#fff; padding:3px 8px; border-radius:6px;">
                                ${item.sender}
                            </span>
                            <span style="font-size:11px; color:#94a3b8; font-weight:700;">${item.date}</span>
                        </div>
                        <h3 style="font-size:16px; font-weight:950; color:#f8fafc; line-height:1.4; margin-top:2px;">
                            ${item.title}
                        </h3>
                        <p style="font-size:13.5px; color:#cbd5e1; line-height:1.6; white-space:pre-line;">
                            ${item.content || item.body || ""}
                        </p>
                        ${item.img ? `<img src="${item.img}" style="max-height:160px; border-radius:10px; object-fit:cover; margin-top:4px;" alt="사진">` : ''}
                        <div style="display:flex; justify-content:flex-end; border-top:1px dashed #334155; padding-top:8px; margin-top:4px;">
                            <button type="button" style="background:#0f172a; color:#38bdf8; border:1px solid #334155; padding:4px 10px; border-radius:6px; font-size:11.5px; font-weight:800; cursor:pointer;" onclick="showToast('✅ 공지사항을 확인하였습니다.')">
                                확인완료 ✔
                            </button>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }
SCRIPT_CODE

$content =~ s/function renderFullNoticeSection\(\)\s*\{.*?container\.innerHTML = notices\.map\(item => \{.*?\}\)\.join\(""\);\s*\}/$new_notice_script/s;

open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!";
print $out $content;
close $out;
print "Updated onemain.html\n";
