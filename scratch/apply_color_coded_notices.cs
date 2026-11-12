using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string indexPath = @"assets\index.html";
        if (!File.Exists(indexPath))
        {
            Console.WriteLine("File not found: " + indexPath);
            return;
        }

        string content = File.ReadAllText(indexPath, Encoding.UTF8);

        int startIdx = content.IndexOf("function renderUnifiedNotices()");
        if (startIdx == -1)
        {
            Console.WriteLine("renderUnifiedNotices function not found!");
            return;
        }

        int endIdx = content.IndexOf("function openDrawer()", startIdx);
        if (endIdx == -1)
        {
            Console.WriteLine("openDrawer function not found!");
            return;
        }

        string replacement = @"function renderUnifiedNotices() {
        const container = document.getElementById(""unifiedNoticePanel"");
        if (!container) return;

        const homeChurch = localStorage.getItem(""yetalk_registered_home_church"") || localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || ""부산제일감리교회"";
        const pastorName = localStorage.getItem(""yetalk_pastor_name"") || ""담임목사"";
        const churchKey = localStorage.getItem(""yetalk_church_key"") || ""default"";

        let notices = [];

        // 1. 🏛️ 본교회 공지알림 (선명한 초록색 뱃지 & 초록 바)
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
                    tagText: ""예배·주보"",
                    sender: homeChurch,
                    title: `[${homeChurch}] 금주 주일예배 및 주보 안내`,
                    dateText: ""금주"",
                    targetUrl: ""churchnotice.html?noticeId=notice_worship_"" + churchKey
                },
                {
                    id: ""notice_comm_"" + churchKey,
                    isHome: true,
                    churchName: homeChurch,
                    tagBadge: ""🏛️ 본교회"",
                    tagText: ""교우소식"",
                    sender: homeChurch,
                    title: `[${homeChurch}] 우리교회 전용 앱 & 성도 소통 안내`,
                    dateText: ""최신"",
                    targetUrl: ""churchnotice.html?noticeId=notice_comm_"" + churchKey
                },
                {
                    id: ""notice_prayer_"" + churchKey,
                    isHome: true,
                    churchName: homeChurch,
                    tagBadge: ""🏛️ 본교회"",
                    tagText: ""기도제목"",
                    sender: homeChurch,
                    title: `[${homeChurch}] 금주의 성도 중보기도 제목`,
                    dateText: ""오늘"",
                    targetUrl: ""churchnotice.html?noticeId=notice_prayer_"" + churchKey
                }
            ];

            const customMapped = customNotices.map(cn => ({
                ...cn,
                isHome: true,
                churchName: homeChurch,
                tagBadge: ""🏛️ 본교회"",
                tagText: cn.tagText || ""교회공지"",
                targetUrl: cn.targetUrl || (""churchnotice.html?noticeId="" + cn.id)
            }));

            notices = [...customMapped, ...defaultHomeNotices];
        }

        // 2. 🌿 준회원 가입 교회(이웃교회) 공지알림 (선명한 파란색 뱃지 & 파랑 바)
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

        // 사용자가 검색 및 가입해 둘 수 있는 대표 이웃교회 예시(행복한교회)
        if (assocChurches.length === 0 && homeChurch !== ""행복한교회"") {
            assocChurches.push(""행복한교회"");
        }

        assocChurches.forEach((acName, idx) => {
            if (acName === homeChurch) return;
            const acNotices = [
                {
                    id: `assoc_notice_welcome_${idx}`,
                    isHome: false,
                    churchName: acName,
                    tagBadge: ""🌿 이웃교회"",
                    tagText: ""초청소식"",
                    sender: acName,
                    title: `[${acName}] 이웃 성도 초청 및 사랑의 교제 안내`,
                    dateText: ""최신"",
                    targetUrl: `churchmain.html?churchName=${encodeURIComponent(acName)}`
                },
                {
                    id: `assoc_notice_festival_${idx}`,
                    isHome: false,
                    churchName: acName,
                    tagBadge: ""🌿 이웃교회"",
                    tagText: ""연합나눔"",
                    sender: acName,
                    title: `[${acName}] 온 성도가 함께하는 은혜의 나눔 축제`,
                    dateText: ""금주"",
                    targetUrl: `churchmain.html?churchName=${encodeURIComponent(acName)}`
                }
            ];
            notices.push(...acNotices);
        });

        const badgeCount = document.getElementById(""noticeBadgeCount"");
        if (badgeCount) badgeCount.innerText = notices.length;

        const headerHtml = `
            <div style=""display:flex; justify-content:space-between; align-items:center; padding:6px 4px 10px 4px; border-bottom:1.5px solid #e2e8f0; margin-bottom:8px;"">
                <div style=""display:flex; align-items:center; gap:6px;"">
                    <span style=""font-size:14.5px; font-weight:950; color:#0f172a;"">🔔 [${homeChurch}] & 이웃교회 공지</span>
                    <span style=""background:#059669; color:#fff; font-size:11px; font-weight:900; padding:1px 7px; border-radius:10px;"">${notices.length}</span>
                </div>
                <div style=""display:flex; align-items:center; gap:6px; font-size:11px; font-weight:800;"">
                    <span style=""color:#059669;"">● 본교회(초록)</span>
                    <span style=""color:#2563eb;"">● 이웃교회(파랑)</span>
                </div>
            </div>
        `;

        const itemsHtml = notices.map(n => {
            const target = n.targetUrl ? n.targetUrl : (`churchnotice.html?noticeId=${encodeURIComponent(n.id)}`);
            // 본교회: 초록색 (#059669 / #dcfce7 / #15803d)
            // 준회원/이웃교회: 파란색 (#2563eb / #dbeafe / #1e40af)
            const mainBadgeBg = n.isHome ? ""#059669"" : ""#2563eb"";
            const subBadgeBg = n.isHome ? ""#dcfce7"" : ""#dbeafe"";
            const subBadgeColor = n.isHome ? ""#15803d"" : ""#1e40af"";
            const borderLeft = n.isHome ? ""4px solid #059669"" : ""4px solid #2563eb"";
            const arrowColor = n.isHome ? ""#059669"" : ""#2563eb"";

            return `
                <div onclick=""location.href='${target}'"" style=""display:flex; justify-content:space-between; align-items:center; padding:11px 12px; background:#ffffff; border-radius:10px; margin-bottom:7px; border:1px solid #e2e8f0; border-left:${borderLeft}; cursor:pointer; box-shadow:0 1.5px 3px rgba(0,0,0,0.03); transition:all 0.15s ease;"">
                    <div style=""display:flex; align-items:center; gap:6px; overflow:hidden;"">
                        <span style=""flex-shrink:0; font-size:10.5px; font-weight:900; background:${mainBadgeBg}; color:#ffffff; padding:2.5px 6px; border-radius:5px; letter-spacing:-0.2px;"">${n.tagBadge}</span>
                        <span style=""flex-shrink:0; font-size:10.5px; font-weight:800; background:${subBadgeBg}; color:${subBadgeColor}; padding:2.5px 6px; border-radius:5px;"">${n.tagText}</span>
                        <strong style=""font-size:13.5px; font-weight:850; color:#0f172a; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-left:2px;"">${n.title}</strong>
                    </div>
                    <div style=""display:flex; align-items:center; gap:6px; flex-shrink:0; margin-left:8px;"">
                        <span style=""font-size:11px; color:#94a3b8; font-weight:700;"">${n.dateText}</span>
                        <span style=""color:${arrowColor}; font-size:14px; font-weight:900;"">➔</span>
                    </div>
                </div>
            `;
        }).join("""");

        container.innerHTML = headerHtml + itemsHtml;
    }

    ";

        string newContent = content.Substring(0, startIdx) + replacement + content.Substring(endIdx);
        File.WriteAllText(indexPath, newContent, Encoding.UTF8);
        Console.WriteLine("Successfully replaced renderUnifiedNotices in " + indexPath);

        File.Copy(indexPath, @"docs\index.html", true);
        Console.WriteLine("Synced to docs\\index.html");

        File.Copy(indexPath, @"app\src\main\assets\index.html", true);
        Console.WriteLine("Synced to app\\src\\main\\assets\\index.html");
    }
}
