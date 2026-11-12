using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        // -------------------------------------------------------------
        // 1. Patch assets/index.html with OpenGraph meta tags (Fix Coupang preview)
        // -------------------------------------------------------------
        string indexFile = @"assets/index.html";
        string indexHtml = File.ReadAllText(indexFile, Encoding.UTF8).Replace("\r\n", "\n").Replace("\r", "\n");

        string ogMetaIndex = @"    <meta property=""og:type"" content=""website"">
    <meta property=""og:site_name"" content=""예톡 (Yetalk)"">
    <meta property=""og:title"" content=""예톡 (Yetalk) - 스마트 포털 & 예톡TV"">
    <meta property=""og:description"" content=""교회와 성도의 모바일 연결망, 예톡! 무료로 교회 홈페이지와 모든 성도들에게 모바일 앱을 제공합니다."">
    <meta property=""og:image"" content=""https://yetalk.cc/logo/yetalklogo.png"">
    <meta property=""og:url"" content=""https://yetalk.cc"">
    <link rel=""icon"" type=""image/png"" href=""https://yetalk.cc/logo/yetalklogo.png"">";

        if (!indexHtml.Contains(@"og:image"))
        {
            string headTarget = "<head>\n    <meta charset=\"UTF-8\">";
            string headReplacement = "<head>\n    <meta charset=\"UTF-8\">\n" + ogMetaIndex;
            if (indexHtml.Contains(headTarget))
            {
                indexHtml = indexHtml.Replace(headTarget, headReplacement);
                File.WriteAllText(indexFile, indexHtml.Replace("\n", "\r\n"), new UTF8Encoding(false));
                Console.WriteLine("1. Added OpenGraph tags to assets/index.html.");
            }
        }

        // -------------------------------------------------------------
        // 2. Patch assets/churchinvite.html
        // -------------------------------------------------------------
        string inviteFile = @"assets/churchinvite.html";
        string inviteHtml = File.ReadAllText(inviteFile, Encoding.UTF8).Replace("\r\n", "\n").Replace("\r", "\n");

        // Add OpenGraph to churchinvite.html
        string ogMetaInvite = @"    <meta property=""og:type"" content=""website"">
    <meta property=""og:site_name"" content=""예톡 교회 초청장"">
    <meta property=""og:title"" content=""우리교회 모바일 초청장 - 예톡"">
    <meta property=""og:description"" content=""지치고 분주한 삶 속에서 참된 평안과 쉼이 있는 곳, 우리 교회로 당신을 초대합니다."">
    <meta property=""og:image"" content=""https://yetalk.cc/logo/yetalkchurch.png"">
    <meta property=""og:url"" content=""https://yetalk.cc/churchinvite.html"">
    <link rel=""icon"" type=""image/png"" href=""https://yetalk.cc/logo/yetalkchurch.png"">";

        if (!inviteHtml.Contains(@"og:image"))
        {
            string headTarget = "<head>\n    <meta charset=\"UTF-8\">";
            string headReplacement = "<head>\n    <meta charset=\"UTF-8\">\n" + ogMetaInvite;
            if (inviteHtml.Contains(headTarget))
            {
                inviteHtml = inviteHtml.Replace(headTarget, headReplacement);
            }
        }

        // CSS updates: larger text, hide empty verse box
        string cssTarget = @".invite-title {
            font-size: 18px;
            font-weight: 950;
            color: #ffffff;
            line-height: 1.45;
            word-break: keep-all;
            margin-bottom: 8px;
        }";
        string newCss = @".invite-title {
            font-size: 20px;
            font-weight: 950;
            color: #ffffff;
            line-height: 1.4;
            word-break: keep-all;
            margin-bottom: 12px;
        }";
        if (inviteHtml.Contains(cssTarget)) inviteHtml = inviteHtml.Replace(cssTarget, newCss);

        string cssDescTarget = @".invite-desc {
            font-size: 13.5px;
            color: #cbd5e1;
            line-height: 1.7;
            white-space: pre-wrap;
            word-break: keep-all;
            margin-bottom: 18px;
        }";
        string newCssDesc = @".invite-desc {
            font-size: 15.5px;
            color: #f1f5f9;
            font-weight: 600;
            line-height: 1.85;
            white-space: pre-wrap;
            word-break: keep-all;
            margin-bottom: 20px;
            letter-spacing: -0.2px;
        }
        .invite-verse-box {
            display: none;
        }";
        if (inviteHtml.Contains(cssDescTarget)) inviteHtml = inviteHtml.Replace(cssDescTarget, newCssDesc);

        // Update default templates and JavaScript
        string jsTarget = @"    const DEFAULT_INVITE_TEMPLATES = {
        target: {
            badge: ""전도대상자 초청"",
            title: ""“사랑과 위로가 있는 예톡행복한교회로 당신을 초대합니다”"",
            verse: ""“수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라 (마 11:28)”"",
            desc: ""지치고 분주한 삶 속에서 참된 평안과 쉼을 찾으시나요?\n하나님의 따뜻한 위로와 성령의 거룩한 임재가 머무는 성전입니다. 소중한 당신의 걸음을 온 성도가 기도로 기다립니다."",
            kakaoShort: ""“수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라 (마 11:28)”\n\n사랑과 위로가 있는 우리 교회로 당신을 초대합니다.""
        },
        festival: {
            badge: ""전도축제 초청"",
            title: ""“가장 귀한 분을 위한 천국 잔치, 전도축제에 초대합니다”"",
            verse: ""“주 예수를 믿으라 그리하면 너와 네 집이 구원을 받으리라 (행 16:31)”"",
            desc: ""인생의 가장 큰 축복이 시작되는 영혼 구원의 축제가 열립니다.\n따뜻한 만찬과 특별한 은혜의 찬양, 생명의 복음 말씀이 준비되어 있습니다. 부담 없이 편안한 걸음으로 함께해 주세요."",
            kakaoShort: ""“주 예수를 믿으라 그리하면 너와 네 집이 구원을 받으리라 (행 16:31)”\n\n가장 귀한 분을 위한 천국 잔치, 전도축제에 초대합니다.""
        },
        yetalk: {
            badge: ""예톡 초청"",
            title: ""“교회와 성도의 연결망, 예톡으로 초대합니다”"",
            verse: ""“무료로 교회 홈페이지와 모든 성도들에게 개인앱을 제공합니다”"",
            desc: ""교회와 성도의 연결망, 예톡!\n무료로 교회 홈페이지와 모든 성도들에게 개인앱을 제공합니다.\n예톡으로 초대합니다.\n플레이스토어에서 예톡에 가입하세요.\n\n• 제작비 · 서버비 · 유지비 평생 전액 무료 (비용 제로)\n• 스마트 주보, 실시간 설교영상, 모바일 헌금, 중보기도실\n• 교회 성도와 목회자가 언제 어디서나 하나 되는 모바일 플랫폼"",
            kakaoShort: ""교회와 성도의 연결망, 예톡!\n무료로 교회 홈페이지와 모든 성도들에게 개인앱을 제공합니다.\n예톡으로 초대합니다.\n플레이스토어에서 예톡에 가입하세요.""
        }
    };";

        string newJsTemplates = @"    const DEFAULT_INVITE_TEMPLATES = {
        target: {
            badge: ""전도대상자 초청"",
            title: ""“소중한 당신을 우리 교회로 초대합니다”"",
            verse: """",
            desc: ""지치고 분주한 삶 속에서 참된 평안과 쉼이 있는 곳,\n\n하나님의 따뜻한 위로와 영원한 은혜가 넘치는 곳.\n\n소중한 당신의 걸음을 온 성도가 기도로 기다립니다."",
            kakaoShort: ""지치고 분주한 삶 속에서 참된 평안과 쉼이 있는 곳,\n하나님의 따뜻한 위로와 영원한 은혜가 넘치는 곳.\n\n소중한 당신의 걸음을 온 성도가 기도로 기다립니다.""
        },
        festival: {
            badge: ""전도축제 초청"",
            title: ""“가장 귀한 분을 위한 천국 잔치, 전도축제에 초대합니다”"",
            verse: """",
            desc: ""인생의 가장 큰 축복이 시작되는 영혼 구원의 축제!\n\n따뜻한 만찬과 특별한 은혜의 찬양, 생명의 복음 말씀이 준비되어 있습니다.\n\n부담 없이 편안한 걸음으로 함께해 주세요."",
            kakaoShort: ""가장 귀한 분을 위한 천국 잔치, 전도축제에 초대합니다.\n\n따뜻한 만찬과 은혜의 찬양, 생명의 복음 말씀이 준비되어 있으니 부담 없이 편안한 걸음으로 함께해 주세요.""
        },
        yetalk: {
            badge: ""예톡 초청"",
            title: ""“교회와 성도의 모바일 연결망, 예톡!”"",
            verse: """",
            desc: ""무료로 교회 홈페이지와 모든 성도들에게 모바일 앱을 제공합니다.\n\n• 제작비 · 서버비 · 유지비 평생 전액 무료 (비용 제로)\n• 교회 성도와 목회자가 언제 어디서나 하나 되는 모바일 플랫폼\n\n구글 플레이스토어에서 [예톡]을 검색하여 설치하세요!"",
            kakaoShort: ""교회와 성도의 모바일 연결망, 예톡!\n무료로 교회 홈페이지와 모든 성도들에게 모바일 앱을 제공합니다.\n\n구글 플레이스토어에서 [예톡]을 검색하여 설치하세요!""
        }
    };";

        if (inviteHtml.Contains(jsTarget))
        {
            inviteHtml = inviteHtml.Replace(jsTarget, newJsTemplates);
            Console.WriteLine("2-1. Updated DEFAULT_INVITE_TEMPLATES in churchinvite.html.");
        }

        // Bump cache key to v5
        inviteHtml = inviteHtml.Replace("yetalk_church_invite_data_v4", "yetalk_church_invite_data_v5");

        // Update getValidInviteUrl & getInviteLinks
        string oldUrlsTarget = @"    function getValidInviteUrl(tabKey) {
        const k = tabKey || activeTabKey;
        if (window.location.protocol === 'file:') {
            return `https://yetalk.cc/churchinvite.html?from=invite&tab=${k}&churchId=yetalk-church`;
        }
        return window.location.origin + window.location.pathname.replace(/[^/]*$/, ""churchinvite.html"") + `?from=invite&tab=${k}&churchId=yetalk-church`;
    }

    function getInviteLinks(tabKey) {
        let baseOrigin = ""https://yetalk.cc"";
        if (window.location.protocol !== 'file:' && window.location.origin && !window.location.origin.includes(""null"")) {
            baseOrigin = window.location.origin;
        }
        const churchUrl = `${baseOrigin}/churchmain.html`;
        const yetalkUrl = ""https://yetalk.cc"";
        return { churchUrl, yetalkUrl };
    }";

        string newUrls = @"    function getValidInviteUrl(tabKey) {
        const k = tabKey || activeTabKey;
        let churchName = localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || ""우리교회"";
        if (churchName.includes(""움직이는"") || churchName.includes(""김예톡"") || churchName.includes(""최예톡"")) {
            churchName = ""예톡행복한교회"";
        }
        return `https://yetalk.cc/churchmain.html?from=invite&tab=${k}&churchName=${encodeURIComponent(churchName)}`;
    }

    function getInviteLinks(tabKey) {
        let churchName = localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || ""우리교회"";
        if (churchName.includes(""움직이는"") || churchName.includes(""김예톡"") || churchName.includes(""최예톡"")) {
            churchName = ""예톡행복한교회"";
        }
        const churchUrl = `https://yetalk.cc/churchmain.html?from=invite&churchName=${encodeURIComponent(churchName)}`;
        const yetalkUrl = ""https://yetalk.cc"";
        return { churchUrl, yetalkUrl, churchName };
    }";

        if (inviteHtml.Contains(oldUrlsTarget))
        {
            inviteHtml = inviteHtml.Replace(oldUrlsTarget, newUrls);
            Console.WriteLine("2-2. Fixed getValidInviteUrl and getInviteLinks in churchinvite.html.");
        }

        // Update copy and message texts
        string oldCopyTarget = @"        if (tabKey === 'yetalk') {
            fullCopy = `[${churchName}] 예톡 초청\n\n${data.title}\n\n${data.desc}\n\n👉 예톡 홈 & 앱 설치:\n${links.yetalkUrl}\n\n👉 우리교회 바로가기:\n${links.churchUrl}`;
        } else {
            const inviteUrl = getValidInviteUrl(tabKey);
            fullCopy = `[${churchName} 초청장]\n\n${data.title}\n\n${data.verse ? data.verse + '\n\n' : ''}${data.desc}\n\n👉 교회 둘러보기:\n${inviteUrl}\n\n👉 예톡 홈:\n${links.yetalkUrl}`;
        }";

        string newCopy = @"        if (tabKey === 'yetalk') {
            fullCopy = `[${churchName}] 예톡 초청\n\n${data.title}\n\n${data.desc}\n\n👉 구글 플레이스토어 & 예톡 홈:\n${links.yetalkUrl}\n\n👉 우리교회 바로가기:\n${links.churchUrl}`;
        } else if (tabKey === 'festival') {
            const inviteUrl = getValidInviteUrl(tabKey);
            fullCopy = `[${churchName}] 전도축제 초청장\n\n${data.title}\n\n${data.desc}\n\n👉 전도축제 & 교회 둘러보기:\n${inviteUrl}\n\n👉 예톡 홈:\n${links.yetalkUrl}`;
        } else {
            const inviteUrl = getValidInviteUrl(tabKey);
            fullCopy = `[${churchName} 초청장]\n\n${data.title}\n\n${data.desc}\n\n👉 우리교회 둘러보기:\n${inviteUrl}\n\n👉 예톡 홈:\n${links.yetalkUrl}`;
        }";

        if (inviteHtml.Contains(oldCopyTarget))
        {
            inviteHtml = inviteHtml.Replace(oldCopyTarget, newCopy);
            Console.WriteLine("2-3. Updated copyInviteTextByTab in churchinvite.html.");
        }

        string oldKakaoTarget = @"        if (tabKey === 'yetalk') {
            fullMessage = `[${churchName}]\n교회와 성도의 연결망, 예톡!\n무료로 교회 홈페이지와 모든 성도들에게 개인앱을 제공합니다.\n예톡으로 초대합니다.\n플레이스토어에서 예톡에 가입하세요.\n\n👉 예톡 홈 & 앱 설치:\n${links.yetalkUrl}\n\n👉 우리교회 바로가기:\n${links.churchUrl}`;
        } else {
            const inviteUrl = getValidInviteUrl(tabKey);
            fullMessage = `[${churchName}] 초청장\n\n${data.kakaoShort || data.title}\n\n👇 아래 링크를 눌러 둘러보세요\n${inviteUrl}\n\n👉 예톡 홈:\n${links.yetalkUrl}`;
        }";

        string newKakao = @"        if (tabKey === 'yetalk') {
            fullMessage = `[${churchName}] 예톡 초청\n\n교회와 성도의 모바일 연결망, 예톡!\n무료로 교회 홈페이지와 모든 성도들에게 모바일 앱을 제공합니다.\n\n구글 플레이스토어에서 [예톡]을 검색하여 설치하세요!\n\n👉 구글 플레이스토어 & 예톡 홈:\n${links.yetalkUrl}\n\n👉 우리교회 바로가기:\n${links.churchUrl}`;
        } else if (tabKey === 'festival') {
            const inviteUrl = getValidInviteUrl(tabKey);
            fullMessage = `[${churchName}] 전도축제 초청장\n\n${data.title}\n\n${data.kakaoShort || data.desc}\n\n👇 아래 링크를 눌러 둘러보세요\n${inviteUrl}\n\n👉 예톡 홈:\n${links.yetalkUrl}`;
        } else {
            const inviteUrl = getValidInviteUrl(tabKey);
            fullMessage = `[${churchName}] 초청장\n\n${data.title}\n\n${data.kakaoShort || data.desc}\n\n👇 아래 링크를 눌러 둘러보세요\n${inviteUrl}\n\n👉 예톡 홈:\n${links.yetalkUrl}`;
        }";

        if (inviteHtml.Contains(oldKakaoTarget))
        {
            inviteHtml = inviteHtml.Replace(oldKakaoTarget, newKakao);
            Console.WriteLine("2-4. Updated sendKakaoInviteByTab in churchinvite.html.");
        }

        File.WriteAllText(inviteFile, inviteHtml.Replace("\n", "\r\n"), new UTF8Encoding(false));

        // -------------------------------------------------------------
        // 3. Patch assets/churchmain.html (Member status & OpenGraph)
        // -------------------------------------------------------------
        string churchMainFile = @"assets/churchmain.html";
        string churchMainHtml = File.ReadAllText(churchMainFile, Encoding.UTF8).Replace("\r\n", "\n").Replace("\r", "\n");

        string ogMetaChurch = @"    <meta property=""og:type"" content=""website"">
    <meta property=""og:site_name"" content=""예톡 우리교회앱"">
    <meta property=""og:title"" content=""우리교회 모바일 홈페이지 - 예톡"">
    <meta property=""og:description"" content=""지치고 분주한 삶 속에서 참된 평안과 쉼이 있는 곳, 하나님의 따뜻한 위로와 은혜가 넘치는 우리 교회로 초대합니다."">
    <meta property=""og:image"" content=""https://yetalk.cc/logo/yetalkchurch.png"">
    <meta property=""og:url"" content=""https://yetalk.cc/churchmain.html"">
    <link rel=""icon"" type=""image/png"" href=""https://yetalk.cc/logo/yetalkchurch.png"">";

        if (!churchMainHtml.Contains(@"og:image"))
        {
            string headTarget = "<head>\n    <meta charset=\"UTF-8\">";
            string headReplacement = "<head>\n    <meta charset=\"UTF-8\">\n" + ogMetaChurch;
            if (churchMainHtml.Contains(headTarget))
            {
                churchMainHtml = churchMainHtml.Replace(headTarget, headReplacement);
            }
        }

        // Update member status and URL param handling in DOMContentLoaded
        string churchMainInitTarget = @"        let churchName = localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || ""예톡행복한교회"";
        if (!churchName || churchName.includes(""최웅식"") || churchName.includes(""최용식"") || churchName.includes(""김예톡"") || churchName.includes(""최예톡"")) {
            churchName = ""예톡행복한교회"";
        }
        localStorage.setItem(""yetalkChurchName"", churchName);
        localStorage.setItem(""yetalk_church_name"", churchName);
        const titleEl = document.getElementById(""churchName"");
        if (titleEl) titleEl.innerText = churchName;

        const uName = localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalkUserName"");
        const uRole = localStorage.getItem(""yetalk_church_role"") || localStorage.getItem(""yetalkChurchRole"") || ""성도"";
        const cleanRole = uRole.replace(/\(사모포함\)/g, '').replace(/\(간단가입\)/g, '').replace(/\(간단등록\)/g, '').trim() || ""성도"";
        const churchJoinBtn = document.getElementById(""btnChurchHeaderJoin"") || document.querySelector("".btn-header-join-only"");
        if (churchJoinBtn && uName && uName.trim()) {
            churchJoinBtn.innerHTML = `<span>👤</span> ${uName.trim()} <small style=""font-size:10px; font-weight:750; opacity:0.9;"">(${cleanRole})</small>`;
            churchJoinBtn.title = ""내 교우 정보 확인"";
            churchJoinBtn.style.background = ""#047857"";
        }";

        string newChurchMainInit = @"        // 🌟 URL 쿼리 파라미터에서 교회명 읽기 (?churchName=부산제일감리교회)
        const urlParams = new URLSearchParams(window.location.search);
        const qChurch = urlParams.get(""churchName"") || urlParams.get(""churchId"");
        let churchName = """";
        if (qChurch && qChurch !== ""yetalk-church"") {
            try { churchName = decodeURIComponent(qChurch); } catch(e) { churchName = qChurch; }
        }
        if (!churchName) {
            churchName = localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || ""예톡행복한교회"";
        }
        if (!churchName || churchName.includes(""최웅식"") || churchName.includes(""최용식"") || churchName.includes(""김예톡"") || churchName.includes(""최예톡"")) {
            churchName = ""예톡행복한교회"";
        }
        localStorage.setItem(""yetalkChurchName"", churchName);
        localStorage.setItem(""yetalk_church_name"", churchName);
        const titleEl = document.getElementById(""churchName"");
        if (titleEl) titleEl.innerText = churchName;

        // 🌟 [사용자 요청] 정회원 vs 준회원 구분
        // 1. 본교회 교인 (예톡홈에서 본교회로 회원가입한 경우): 정회원 상태
        // 2. 초청으로 왔거나 본교회 미등록자: 준회원 가입 안내 (예/아니오)
        updateChurchHeaderMemberUI(churchName);";

        if (churchMainHtml.Contains(churchMainInitTarget))
        {
            churchMainHtml = churchMainHtml.Replace(churchMainInitTarget, newChurchMainInit);
            Console.WriteLine("3-1. Updated church name and member init in churchmain.html.");
        }

        // Add updateChurchHeaderMemberUI and 준회원 가입 핸들러
        string joinHandlerTarget = @"    /* 🌟 성도가입 클릭 시 원클릭 등록 분기 */
    function handleChurchMemberJoinClick() {
        const uName = localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalkUserName"");
        if (uName && uName.trim()) {
            if (confirm(`👤 [${uName.trim()}] 교우님으로 등록되어 있습니다.\n\n회원정보 확인 및 수정을 위해 예톡 홈으로 이동하시겠습니까?`)) {
                location.href = ""index.html"";
            }
            return;
        }
        openSimpleMemberJoinModal();
    }";

        string newJoinHandler = @"    // 🌟 [사용자 요청] 교회 헤더 회원 배지 및 정회원/준회원 실시간 UI 반영
    function updateChurchHeaderMemberUI(curChurch) {
        const churchName = curChurch || localStorage.getItem(""yetalkChurchName"") || ""예톡행복한교회"";
        const uName = (localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalkUserName"") || """").trim();
        const myHomeChurch = (localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || localStorage.getItem(""yetalkMyChurchName"") || """").trim();
        
        const isRegular = Boolean(uName && (myHomeChurch === churchName || localStorage.getItem(""yetalk_is_regular_member_"" + churchName) === ""true""));
        const isAssociate = Boolean(localStorage.getItem(""yetalk_church_member_grade_"" + churchName) === ""준회원"");

        const btn = document.getElementById(""btnChurchHeaderJoin"") || document.querySelector("".btn-header-join-only"");
        if (!btn) return;

        if (isRegular) {
            btn.innerHTML = `<span>👤</span> ${uName} <small style=""font-size:10px; font-weight:950; background:#065f46; color:#a7f3d0; padding:1px 5px; border-radius:4px; margin-left:2px;"">정회원</small>`;
            btn.title = `[${churchName}] 본교회 정회원 상태`;
            btn.style.background = ""#047857"";
            btn.style.borderColor = ""#10b981"";
        } else if (isAssociate) {
            const displayName = uName || localStorage.getItem(""yetalk_associate_name_"" + churchName) || ""새가족"";
            btn.innerHTML = `<span>👤</span> ${displayName} <small style=""font-size:10px; font-weight:950; background:#1e3a8a; color:#bfdbfe; padding:1px 5px; border-radius:4px; margin-left:2px;"">준회원</small>`;
            btn.title = `[${churchName}] 준회원 상태`;
            btn.style.background = ""#2563eb"";
            btn.style.borderColor = ""#60a5fa"";
        } else {
            btn.innerHTML = `<span>⛪</span> 성도가입 <small style=""font-size:9.5px; opacity:0.95;"">(준회원)</small>`;
            btn.title = ""준회원 가입 안내"";
            btn.style.background = ""#059669"";
            btn.style.borderColor = ""#34d399"";

            // 🌟 초청 링크(from=invite)로 처음 들어온 경우 준회원 가입 모달 자동 안내
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get(""from"") === ""invite"" && !sessionStorage.getItem(""yetalk_invite_prompted"")) {
                sessionStorage.setItem(""yetalk_invite_prompted"", ""true"");
                setTimeout(() => { openSimpleMemberJoinModal(); }, 600);
            }
        }
    }

    /* 🌟 성도가입 클릭 시 원클릭 등록 분기: 정회원 vs 준회원 */
    function handleChurchMemberJoinClick() {
        const churchName = localStorage.getItem(""yetalkChurchName"") || ""예톡행복한교회"";
        const uName = (localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalkUserName"") || """").trim();
        const myHomeChurch = (localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || """").trim();
        
        const isRegular = Boolean(uName && (myHomeChurch === churchName || localStorage.getItem(""yetalk_is_regular_member_"" + churchName) === ""true""));
        const isAssociate = Boolean(localStorage.getItem(""yetalk_church_member_grade_"" + churchName) === ""준회원"");

        if (isRegular) {
            if (confirm(`✅ [${uName}] 성도님은 [${churchName}] 본교회 교우로 등록된 '정회원' 상태입니다.\n\n회원정보 확인 및 수정을 위해 예톡 홈으로 이동하시겠습니까?`)) {
                location.href = ""index.html"";
            }
            return;
        }

        if (isAssociate) {
            const displayName = uName || localStorage.getItem(""yetalk_associate_name_"" + churchName) || ""새가족"";
            if (confirm(`👤 [${displayName}] 님은 현재 [${churchName}] '준회원' 상태입니다.\n\n본교회 '정회원'으로 등록하시려면 예톡 홈에서 본교회 교우로 가입해 주세요.\n\n예톡 홈으로 이동하시겠습니까?`)) {
                location.href = ""index.html"";
            }
            return;
        }

        // 본 교회 교인이 아니고 초청 등으로 처음 온 경우: 준회원 가입 안내 모달 오픈
        openSimpleMemberJoinModal();
    }";

        if (churchMainHtml.Contains(joinHandlerTarget))
        {
            churchMainHtml = churchMainHtml.Replace(joinHandlerTarget, newJoinHandler);
            Console.WriteLine("3-2. Updated handleChurchMemberJoinClick in churchmain.html.");
        }

        // Update simpleMemberJoinModal text for 준회원 가입
        string modalTarget = @"            <!-- 제목 -->
            <h3 style=""font-size:20px; font-weight:950; color:#0f172a; margin-bottom:8px; letter-spacing:-0.4px;"">교회 성도 & 예톡 간편 가입</h3>
            <!-- 설명 안내 -->
            <p style=""font-size:13px; color:#475569; font-weight:600; line-height:1.55; margin-bottom:16px; word-break:keep-all;"">
                <strong>[예]</strong>를 선택하시면 예톡 회원가입과 본교회 성도등록이<br>한 번에 동시에 자동으로 완료됩니다.
            </p>";

        string newModal = @"            <!-- 제목 -->
            <h3 style=""font-size:20px; font-weight:950; color:#0f172a; margin-bottom:8px; letter-spacing:-0.4px;"">⛪ 교회 성도 준회원 가입</h3>
            <!-- 설명 안내 -->
            <p style=""font-size:13.5px; color:#334155; font-weight:700; line-height:1.6; margin-bottom:16px; word-break:keep-all;"">
                본 교회 교인이 아니시더라도 준회원으로 가입하시면 교회 주보와 설교영상, 은혜로운 소식을 자유롭게 누리실 수 있습니다.<br><br>
                <span style=""color:#047857; font-size:14.5px; font-weight:950;"">준회원으로 가입하시겠습니까?</span>
            </p>";

        if (churchMainHtml.Contains(modalTarget))
        {
            churchMainHtml = churchMainHtml.Replace(modalTarget, newModal);
            Console.WriteLine("3-3. Updated simpleMemberJoinModal text in churchmain.html.");
        }

        // Update confirmSimpleMemberJoin to save 준회원
        string confirmJoinTarget = @"        localStorage.setItem(""yetalkIsRegularMember"", ""true"");
        localStorage.setItem(""yetalkMyChurchName"", currentChurch);";

        string newConfirmJoin = @"        localStorage.setItem(""yetalk_church_member_grade_"" + currentChurch, ""준회원"");
        localStorage.setItem(""yetalk_associate_name_"" + currentChurch, name);
        localStorage.setItem(""yetalkIsRegularMember"", ""true"");
        localStorage.setItem(""yetalkMyChurchName"", currentChurch);";

        if (churchMainHtml.Contains(confirmJoinTarget))
        {
            churchMainHtml = churchMainHtml.Replace(confirmJoinTarget, newConfirmJoin);
        }

        string alertTarget = @"        alert(`🎉 [예톡 회원가입 & 교회 성도 간편 등록 완료]\n\n• 성도명: ${name}\n• 예톡 아이디: ${myId}\n• 소속교회: ${currentChurch}\n\n예톡 계정과 [${currentChurch}] 본교회 성도 등록이 동시에 완료되었습니다!\n은혜로운 교회 소식과 예배를 함께 누리세요.`);
        showToast(`✅ [${name}] 성도 및 예톡 가입 완료!`);";

        string newAlert = @"        updateChurchHeaderMemberUI(currentChurch);
        alert(`🎉 [${currentChurch} 준회원 가입 완료]\n\n• 성도명: ${name}\n• 소속교회: ${currentChurch}\n• 회원상태: 준회원\n\n[${currentChurch}] 준회원으로 가입되었습니다!\n교회 주보, 설교 영상, 예배 소식을 언제든 자유롭게 둘러보실 수 있습니다.`);
        showToast(`✅ [${name}] 준회원 가입 완료!`);";

        if (churchMainHtml.Contains(alertTarget))
        {
            churchMainHtml = churchMainHtml.Replace(alertTarget, newAlert);
            Console.WriteLine("3-4. Updated confirmSimpleMemberJoin alert in churchmain.html.");
        }

        File.WriteAllText(churchMainFile, churchMainHtml.Replace("\n", "\r\n"), new UTF8Encoding(false));

        Console.WriteLine("All patch steps completed successfully!");
    }
}
