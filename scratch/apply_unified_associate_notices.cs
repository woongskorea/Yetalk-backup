using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        // 1. Update churchmain.html to record yetalk_associate_churches array on join
        string churchMainPath = @"assets\churchmain.html";
        if (File.Exists(churchMainPath))
        {
            string cm = File.ReadAllText(churchMainPath, Encoding.UTF8);
            string oldSaveGrade = @"        localStorage.setItem(""yetalk_church_member_grade_"" + currentChurch, ""준회원"");
        localStorage.setItem(""yetalk_associate_name_"" + currentChurch, name);";

            string newSaveGrade = @"        localStorage.setItem(""yetalk_church_member_grade_"" + currentChurch, ""준회원"");
        localStorage.setItem(""yetalk_associate_name_"" + currentChurch, name);
        try {
            let assocList = JSON.parse(localStorage.getItem(""yetalk_associate_churches"") || ""[]"");
            if (!assocList.includes(currentChurch)) {
                assocList.push(currentChurch);
                localStorage.setItem(""yetalk_associate_churches"", JSON.stringify(assocList));
            }
        } catch(e){}";

            cm = cm.Replace(oldSaveGrade, newSaveGrade);
            File.WriteAllText(churchMainPath, cm, Encoding.UTF8);
            File.Copy(churchMainPath, @"docs\churchmain.html", true);
            File.Copy(churchMainPath, @"app\src\main\assets\churchmain.html", true);
            Console.WriteLine("Updated churchmain.html successfully.");
        }

        // 2. Update index.html renderUnifiedNotices to display both Home Church and Associate Church notices
        string indexPath = @"assets\index.html";
        if (File.Exists(indexPath))
        {
            string idx = File.ReadAllText(indexPath, Encoding.UTF8);

            string oldRenderNotices = @"    // 🌟 [사용자 요청] 공지알림은 본인 교회의 공지알림만 뜨도록 엄격 제어
    function renderUnifiedNotices() {
        const container = document.getElementById(""unifiedNoticePanel"");
        if (!container) return;

        const churchName = localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || ""부산제일감리교회"";
        const pastorName = localStorage.getItem(""yetalk_pastor_name"") || ""담임목사"";
        const churchKey = localStorage.getItem(""yetalk_church_key"") || ""default"";

        let notices = [];

        if (churchName && churchKey) {
            let customNotices = [];
            try {
                customNotices = JSON.parse(localStorage.getItem(""yetalk_church_notices_"" + churchKey) || ""[]"");
            } catch(e) { customNotices = []; }

            const defaultChurchNotices = [
                {
                    id: ""notice_worship_"" + churchKey,
                    tagType: ""church"",
                    tagText: ""예배·주보"",
                    sender: churchName,
                    title: `[${churchName}] 금주 예배 및 주보 안내`,
                    content: `🕊️ [${churchName} 예배 안내]\n\n• 주일 대예배: 주일 오전 11:00\n• 수요 기도회: 수요일 저녁 7:30\n• 새벽 기도회: 매일 새벽 5:30`,
                    dateText: ""금주"",
                    targetUrl: ""churchnotice.html?noticeId=notice_worship_"" + churchKey
                },
                {
                    id: ""notice_comm_"" + churchKey,
                    tagType: ""church"",
                    tagText: ""교우소식"",
                    sender: churchName,
                    title: `[${churchName}] 우리교회 전용 앱 & 홈페이지 개설`,
                    content: `✨ [${churchName} 교우 소식]\n\n우리 '${churchName}'의 전용 모바일 교회앱과 홈페이지가 개설되었습니다.`,
                    dateText: ""최신"",
                    targetUrl: ""churchnotice.html?noticeId=notice_comm_"" + churchKey
                },
                {
                    id: ""notice_prayer_"" + churchKey,
                    tagType: ""church"",
                    tagText: ""기도제목"",
                    sender: churchName,
                    title: `[${churchName}] 금주의 중보기도 제목`,
                    content: `🙏 [${churchName} 성도 중보기도제목]\n\n1. 교회의 부흥과 담임목사님(${pastorName})의 영육 간 강건함을 위해`,
                    dateText: ""오늘"",
                    targetUrl: ""churchnotice.html?noticeId=notice_prayer_"" + churchKey
                }
            ];

            notices = [...customNotices, ...defaultChurchNotices];
        } else {
            notices = [
                {
                    id: ""notice_register_guide"",
                    tagType: ""church"",
                    tagText: ""안내"",
                    sender: ""예톡"",
                    title: ""✨ 출석 교회를 등록하시면 우리교회 전용 공지가 한줄로 표시됩니다"",
                    content: ""우리교회를 등록하시면 교회 공지알림이 즉시 연동됩니다."",
                    dateText: ""안내"",
                    targetUrl: ""churchnotice.html""
                }
            ];
        }

        const badgeCount = document.getElementById(""noticeBadgeCount"");
        if (badgeCount) badgeCount.innerText = notices.length;

        const headerTitle = churchName ? `📢 [${churchName}] 공지알림` : `📢 출석교회 공지알림`;
        const headerHtml = `
            <div style=""display:flex; justify-content:space-between; align-items:center; padding:6px 4px 10px 4px; border-bottom:1.5px solid #e2e8f0; margin-bottom:8px;"">
                <div style=""display:flex; align-items:center; gap:6px;"">
                    <span style=""font-size:14.5px; font-weight:950; color:#0f172a;"">${headerTitle}</span>
                    <span style=""background:#059669; color:#fff; font-size:11px; font-weight:900; padding:1px 7px; border-radius:10px;"">${notices.length}</span>
                </div>
                <span style=""font-size:11.5px; color:#64748b; font-weight:800;"">터치 시 교회 공지글로 직행 ›</span>
            </div>
        `;

        // 🌟 [사용자 요청] 공지알림 버튼 누르면 교회앱속의 그 공지글로 바로 연결되어 열리게 처리!
        const itemsHtml = notices.map(n => {
            const target = n.targetUrl ? n.targetUrl : (`churchnotice.html?noticeId=${encodeURIComponent(n.id)}`);
            return `
                <div onclick=""location.href='${target}'"" style=""display:flex; justify-content:space-between; align-items:center; padding:11px 12px; background:#ffffff; border-radius:10px; margin-bottom:6px; border:1px solid #e2e8f0; cursor:pointer; box-shadow:0 1.5px 3px rgba(0,0,0,0.03); transition:all 0.15s ease;"">
                    <div style=""display:flex; align-items:center; gap:8px; overflow:hidden;"">
                        <span style=""flex-shrink:0; font-size:11px; font-weight:900; background:#dcfce7; color:#15803d; padding:2px 7px; border-radius:6px;"">${n.tagText}</span>
                        <strong style=""font-size:13.5px; font-weight:850; color:#0f172a; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"">${n.title}</strong>
                    </div>
                    <div style=""display:flex; align-items:center; gap:6px; flex-shrink:0; margin-left:8px;"">
                        <span style=""font-size:11px; color:#94a3b8; font-weight:700;"">${n.dateText}</span>
                        <span style=""color:#059669; font-size:13px; font-weight:900;"">›</span>
                    </div>
                </div>
            `;
        }).join("""");

        container.innerHTML = headerHtml + itemsHtml;
    }";

            string newRenderNotices = @"    /* 🌟 [사용자 요청] 공지알림: 본교회 공지와 준회원 가입 교회(이웃교회) 공지 함께 통합 노출 */
    function renderUnifiedNotices() {
        const container = document.getElementById(""unifiedNoticePanel"");
        if (!container) return;

        const homeChurch = localStorage.getItem(""yetalk_registered_home_church"") || localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || ""부산제일감리교회"";
        const pastorName = localStorage.getItem(""yetalk_pastor_name"") || ""담임목사"";
        const churchKey = localStorage.getItem(""yetalk_church_key"") || ""default"";

        let notices = [];

        // 1. 본교회 공지알림 (🏛️ 본교회 라벨)
        if (homeChurch) {
            let customNotices = [];
            try {
                customNotices = JSON.parse(localStorage.getItem(""yetalk_church_notices_"" + churchKey) || ""[]"");
            } catch(e) { customNotices = []; }

            const defaultHomeNotices = [
                {
                    id: ""notice_worship_"" + churchKey,
                    isHome: true,
                    churchName: homeChurch,
                    tagBadge: ""🏛️ 본교회"",
                    tagBadgeClass: ""badge-home-church"",
                    tagText: ""예배·주보"",
                    sender: homeChurch,
                    title: `[${homeChurch}] 금주 예배 및 주보 안내`,
                    content: `🕊️ [${homeChurch} 예배 안내]\n\n• 주일 대예배: 주일 오전 11:00\n• 수요 기도회: 수요일 저녁 7:30\n• 새벽 기도회: 매일 새벽 5:30`,
                    dateText: ""금주"",
                    targetUrl: ""churchnotice.html?noticeId=notice_worship_"" + churchKey
                },
                {
                    id: ""notice_comm_"" + churchKey,
                    isHome: true,
                    churchName: homeChurch,
                    tagBadge: ""🏛️ 본교회"",
                    tagBadgeClass: ""badge-home-church"",
                    tagText: ""교우소식"",
                    sender: homeChurch,
                    title: `[${homeChurch}] 우리교회 전용 앱 & 홈페이지 소식`,
                    content: `✨ [${homeChurch} 교우 소식]\n\n우리 '${homeChurch}'의 전용 모바일 교회앱과 홈페이지가 개설되었습니다.`,
                    dateText: ""최신"",
                    targetUrl: ""churchnotice.html?noticeId=notice_comm_"" + churchKey
                },
                {
                    id: ""notice_prayer_"" + churchKey,
                    isHome: true,
                    churchName: homeChurch,
                    tagBadge: ""🏛️ 본교회"",
                    tagBadgeClass: ""badge-home-church"",
                    tagText: ""기도제목"",
                    sender: homeChurch,
                    title: `[${homeChurch}] 금주의 성도 중보기도 제목`,
                    content: `🙏 [${homeChurch} 중보기도제목]\n\n1. 교회의 부흥과 담임목사님(${pastorName})의 영육 간 강건함을 위해 기도합니다.`,
                    dateText: ""오늘"",
                    targetUrl: ""churchnotice.html?noticeId=notice_prayer_"" + churchKey
                }
            ];

            const customMapped = customNotices.map(cn => ({
                ...cn,
                isHome: true,
                churchName: homeChurch,
                tagBadge: ""🏛️ 본교회"",
                tagBadgeClass: ""badge-home-church"",
                tagText: cn.tagText || ""교회공지"",
                targetUrl: cn.targetUrl || (""churchnotice.html?noticeId="" + cn.id)
            }));

            notices = [...customMapped, ...defaultHomeNotices];
        }

        // 2. 준회원으로 가입한 이웃교회 공지알림 (🌿 이웃교회 라벨)
        try {
            let assocChurches = [];
            try {
                assocChurches = JSON.parse(localStorage.getItem(""yetalk_associate_churches"") || ""[]"");
            } catch(e){}

            // localStorage 전체 스캔하여 yetalk_church_member_grade_* 가 '준회원'인 교회 수집
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith(""yetalk_church_member_grade_"")) {
                    const chName = k.replace(""yetalk_church_member_grade_"", """").trim();
                    if (chName && chName !== homeChurch && localStorage.getItem(k) === ""준회원"") {
                        if (!assocChurches.includes(chName)) assocChurches.push(chName);
                    }
                }
            }

            assocChurches.forEach((acName, idx) => {
                if (acName === homeChurch) return; // 본교회는 제외
                const acNotices = [
                    {
                        id: `assoc_notice_welcome_${idx}`,
                        isHome: false,
                        churchName: acName,
                        tagBadge: `🌿 ${acName}`,
                        tagBadgeClass: ""badge-assoc-church"",
                        tagText: ""준회원소식"",
                        sender: acName,
                        title: `[${acName}] 이웃 성도 초청 및 교우 소식`,
                        content: `🌿 [${acName} 준회원 성도 소식]\n\n'${acName}'의 준회원으로 가입하신 것을 진심으로 환영합니다. 주님의 풍성한 은혜와 평강이 함께하시길 축복합니다.`,
                        dateText: ""최신"",
                        targetUrl: `churchmain.html?churchName=${encodeURIComponent(acName)}`
                    },
                    {
                        id: `assoc_notice_event_${idx}`,
                        isHome: false,
                        churchName: acName,
                        tagBadge: `🌿 ${acName}`,
                        tagBadgeClass: ""badge-assoc-church"",
                        tagText: ""연합예배"",
                        sender: acName,
                        title: `[${acName}] 이웃과 함께하는 은혜의 말씀 나눔`,
                        content: `🕊️ [${acName} 말씀 나눔]\n\n온 교우와 이웃이 함께 은혜를 나누는 특별 찬양과 말씀의 자리에 초대합니다.`,
                        dateText: ""금주"",
                        targetUrl: `churchmain.html?churchName=${encodeURIComponent(acName)}`
                    }
                ];
                notices.push(...acNotices);
            });
        } catch(e) {
            console.error(""Associate church notice load error:"", e);
        }

        const badgeCount = document.getElementById(""noticeBadgeCount"");
        if (badgeCount) badgeCount.innerText = notices.length;

        const headerHtml = `
            <div style=""display:flex; justify-content:space-between; align-items:center; padding:6px 4px 10px 4px; border-bottom:1.5px solid #e2e8f0; margin-bottom:8px;"">
                <div style=""display:flex; align-items:center; gap:6px;"">
                    <span style=""font-size:14.5px; font-weight:950; color:#0f172a;"">📢 [${homeChurch}] 및 이웃교회 공지</span>
                    <span style=""background:#059669; color:#fff; font-size:11px; font-weight:900; padding:1px 7px; border-radius:10px;"">${notices.length}</span>
                </div>
                <span style=""font-size:11.5px; color:#64748b; font-weight:800;"">터치 시 해당 교회로 직행 ›</span>
            </div>
        `;

        const itemsHtml = notices.map(n => {
            const target = n.targetUrl ? n.targetUrl : (`churchnotice.html?noticeId=${encodeURIComponent(n.id)}`);
            const badgeBg = n.isHome ? ""#dcfce7"" : ""#eff6ff"";
            const badgeColor = n.isHome ? ""#15803d"" : ""#1d4ed8"";
            const borderCol = n.isHome ? ""#bbf7d0"" : ""#bfdbfe"";
            return `
                <div onclick=""location.href='${target}'"" style=""display:flex; justify-content:space-between; align-items:center; padding:11px 12px; background:#ffffff; border-radius:10px; margin-bottom:6px; border:1px solid #e2e8f0; cursor:pointer; box-shadow:0 1.5px 3px rgba(0,0,0,0.03); transition:all 0.15s ease;"">
                    <div style=""display:flex; align-items:center; gap:6px; overflow:hidden;"">
                        <span style=""flex-shrink:0; font-size:10.5px; font-weight:900; background:${badgeBg}; color:${badgeColor}; border:1px solid ${borderCol}; padding:2px 6px; border-radius:5px;"">${n.tagBadge}</span>
                        <span style=""flex-shrink:0; font-size:10.5px; font-weight:800; background:#f1f5f9; color:#475569; padding:2px 5px; border-radius:4px;"">${n.tagText}</span>
                        <strong style=""font-size:13.5px; font-weight:850; color:#0f172a; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-left:2px;"">${n.title}</strong>
                    </div>
                    <div style=""display:flex; align-items:center; gap:6px; flex-shrink:0; margin-left:8px;"">
                        <span style=""font-size:11px; color:#94a3b8; font-weight:700;"">${n.dateText}</span>
                        <span style=""color:${badgeColor}; font-size:13px; font-weight:900;"">›</span>
                    </div>
                </div>
            `;
        }).join("""");

        container.innerHTML = headerHtml + itemsHtml;
    }";

            idx = idx.Replace(oldRenderNotices, newRenderNotices);
            File.WriteAllText(indexPath, idx, Encoding.UTF8);
            File.Copy(indexPath, @"docs\index.html", true);
            File.Copy(indexPath, @"app\src\main\assets\index.html", true);
            Console.WriteLine("Updated index.html successfully.");
        }
    }
}
