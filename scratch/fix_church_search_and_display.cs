using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        // -------------------------------------------------------------
        // 1. Patch assets/index.html
        // -------------------------------------------------------------
        string indexFile = @"assets/index.html";
        string indexHtml = File.ReadAllText(indexFile, Encoding.UTF8).Replace("\r\n", "\n").Replace("\r", "\n");

        // When user signs up in christianRegisterModal, also store yetalk_registered_home_church
        string regChurchSaveTarget = @"            localStorage.setItem(""yetalk_church_name"", churchName);
            localStorage.setItem(""yetalkChurchName"", churchName);";
        string newRegChurchSave = @"            localStorage.setItem(""yetalk_registered_home_church"", churchName);
            localStorage.setItem(""yetalk_church_name"", churchName);
            localStorage.setItem(""yetalkChurchName"", churchName);";

        if (indexHtml.Contains(regChurchSaveTarget))
        {
            indexHtml = indexHtml.Replace(regChurchSaveTarget, newRegChurchSave);
            Console.WriteLine("1-1. Added yetalk_registered_home_church to registration in assets/index.html.");
        }

        // In handleChristianNav('our_church'): pass churchName parameter
        string ourChurchNavTarget = @"        } else if (tab === 'our_church' || tab === 'church') {
            document.getElementById(""chipTabOurChurch"")?.classList.add(""active"");
            // 🌟 [사용자 요청] 임시창 모달이 아니라 사진 4의 churchmain.html(누구나 가입하면 모이는 실제 우리교회 화면)로 바로 직행!
            location.href = ""churchmain.html"";";

        string newOurChurchNav = @"        } else if (tab === 'our_church' || tab === 'church') {
            document.getElementById(""chipTabOurChurch"")?.classList.add(""active"");
            // 🌟 [사용자 요청] 본인 출석교회명을 파라미터로 붙여 정확하게 본교회 앱으로 직행!
            const myChurch = (localStorage.getItem(""yetalk_registered_home_church"") || localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || ""부산제일감리교회"").trim();
            location.href = ""churchmain.html?churchName="" + encodeURIComponent(myChurch);";

        if (indexHtml.Contains(ourChurchNavTarget))
        {
            indexHtml = indexHtml.Replace(ourChurchNavTarget, newOurChurchNav);
            Console.WriteLine("1-2. Updated handleChristianNav in assets/index.html.");
        }

        // In executePortalSearch(): Search all created/registered churches and pass churchName param!
        string searchOldTarget = @"        // 3. 실제 등록/개설된 맞춤앱 데이터베이스 매칭
        const registeredChurches = [
            { name: ""예톡행복한교회"", url: ""churchmain.html"" },
            { name: ""행복한교회"", url: ""churchmain.html"" },
            { name: ""최예톡의 작은교회"", url: ""churchmain.html?type=small"" },
            { name: ""나의작은교회"", url: ""minichurch.html"" },
            { name: ""움직이는교회"", url: ""minichurch.html"" },
            { name: ""사랑의교회"", url: ""churchmain.html"" },
            { name: ""새빛교회"", url: ""churchmain.html"" }
        ];

        const registeredClinics = [
            { name: ""사랑받는 최웅식의원"", url: ""doctormain.html"" },
            { name: ""사랑받는 최응식의원"", url: ""doctormain.html"" },
            { name: ""최응식의원"", url: ""doctormain.html"" },
            { name: ""최웅식의원"", url: ""doctormain.html"" },
            { name: ""최응식"", url: ""doctormain.html"" },
            { name: ""최웅식"", url: ""doctormain.html"" },
            { name: ""예톡아름다운 의원"", url: ""doctormain.html"" },
            { name: ""예톡아름다운의원"", url: ""doctormain.html"" },
            { name: ""예톡아름다운"", url: ""doctormain.html"" },
            { name: ""행복한한의원"", url: ""handoctormain.html"" },
            { name: ""바른치과의원"", url: ""dentalmain.html"" },
            { name: ""바른치과"", url: ""dentalmain.html"" }
        ];

        const registeredStores = [
            { name: ""맛있는 숯불갈비"", url: ""foodmain.html"" },
            { name: ""숯불갈비"", url: ""foodmain.html"" },
            { name: ""부산밀면가"", url: ""foodmain.html"" },
            { name: ""밀면가"", url: ""foodmain.html"" },
            { name: ""달콤베이커리"", url: ""foodmain.html"" },
            { name: ""예톡헤어살롱"", url: ""foodmain.html"" },
            { name: ""헤어살롱"", url: ""foodmain.html"" }
        ];

        // 사용자가 직접 개설하여 로컬에 저장된 맞춤앱도 동적 추가
        try {
            const savedMyApps = localStorage.getItem(""yetalk_my_apps"");
            if (savedMyApps) {
                const parsed = JSON.parse(savedMyApps);
                if (parsed.mainApp && parsed.mainApp.title) {
                    registeredChurches.push({ name: parsed.mainApp.title, url: parsed.mainApp.url || ""onemain.html"" });
                }
                if (parsed.additionalApps && Array.isArray(parsed.additionalApps)) {
                    parsed.additionalApps.forEach(a => {
                        if (a.title) registeredChurches.push({ name: a.title, url: a.url || ""churchmain.html"" });
                    });
                }
            }
            const savedChName = localStorage.getItem(""yetalkChurchName"");
            if (savedChName) registeredChurches.push({ name: savedChName, url: ""churchmain.html"" });
            const savedFoodName = localStorage.getItem(""yetalk_food_name"");
            if (savedFoodName) registeredStores.push({ name: savedFoodName, url: ""foodmain.html"" });
        } catch(e) {}

        // 등록된 교회 검색 일치 여부 확인
        const matchChurch = registeredChurches.find(c => {
            const cn = c.name.toLowerCase();
            return q.includes(cn) || cn.includes(q);
        });
        if (matchChurch) {
            location.href = matchChurch.url;
            return;
        }";

        string newSearch = @"        // 3. 실제 등록/개설된 맞춤앱 데이터베이스 매칭
        // 🌟 [사용자 요청] 검색된 교회가 기존에 만들어졌으면 반드시 그 교회로 뜨도록 URL 파라미터 연동!
        const registeredChurches = [
            { name: ""행복한교회"", url: ""churchmain.html?churchName="" + encodeURIComponent(""행복한교회"") },
            { name: ""예톡행복한교회"", url: ""churchmain.html?churchName="" + encodeURIComponent(""예톡행복한교회"") },
            { name: ""부산제일감리교회"", url: ""churchmain.html?churchName="" + encodeURIComponent(""부산제일감리교회"") },
            { name: ""사랑의교회"", url: ""churchmain.html?churchName="" + encodeURIComponent(""사랑의교회"") },
            { name: ""새빛교회"", url: ""churchmain.html?churchName="" + encodeURIComponent(""새빛교회"") },
            { name: ""최예톡의 작은교회"", url: ""churchmain.html?type=small&churchName="" + encodeURIComponent(""최예톡의 작은교회"") },
            { name: ""나의작은교회"", url: ""minichurch.html"" },
            { name: ""움직이는교회"", url: ""minichurch.html"" }
        ];

        // 🌟 [사용자 요청] 사용자들이 개설/등록한 모든 교회(yetalk_registered_churches) 동적 검색 반영
        try {
            const regMap = JSON.parse(localStorage.getItem(""yetalk_registered_churches"") || ""{}"");
            if (regMap && typeof regMap === ""object"") {
                Object.values(regMap).forEach(ch => {
                    if (ch && ch.name && !registeredChurches.some(rc => rc.name === ch.name)) {
                        registeredChurches.push({
                            name: ch.name,
                            url: ""churchmain.html?churchName="" + encodeURIComponent(ch.name)
                        });
                    }
                });
            }
        } catch(e) {}

        const registeredClinics = [
            { name: ""사랑받는 최웅식의원"", url: ""doctormain.html"" },
            { name: ""사랑받는 최응식의원"", url: ""doctormain.html"" },
            { name: ""최응식의원"", url: ""doctormain.html"" },
            { name: ""최웅식의원"", url: ""doctormain.html"" },
            { name: ""최응식"", url: ""doctormain.html"" },
            { name: ""최웅식"", url: ""doctormain.html"" },
            { name: ""예톡아름다운 의원"", url: ""doctormain.html"" },
            { name: ""예톡아름다운의원"", url: ""doctormain.html"" },
            { name: ""예톡아름다운"", url: ""doctormain.html"" },
            { name: ""행복한한의원"", url: ""handoctormain.html"" },
            { name: ""바른치과의원"", url: ""dentalmain.html"" },
            { name: ""바른치과"", url: ""dentalmain.html"" }
        ];

        const registeredStores = [
            { name: ""맛있는 숯불갈비"", url: ""foodmain.html"" },
            { name: ""숯불갈비"", url: ""foodmain.html"" },
            { name: ""부산밀면가"", url: ""foodmain.html"" },
            { name: ""밀면가"", url: ""foodmain.html"" },
            { name: ""달콤베이커리"", url: ""foodmain.html"" },
            { name: ""예톡헤어살롱"", url: ""foodmain.html"" },
            { name: ""헤어살롱"", url: ""foodmain.html"" }
        ];

        // 사용자가 직접 개설하여 로컬에 저장된 맞춤앱도 동적 추가
        try {
            const savedMyApps = localStorage.getItem(""yetalk_my_apps"");
            if (savedMyApps) {
                const parsed = JSON.parse(savedMyApps);
                if (parsed.mainApp && parsed.mainApp.title) {
                    registeredChurches.push({ name: parsed.mainApp.title, url: parsed.mainApp.url || ""onemain.html"" });
                }
                if (parsed.additionalApps && Array.isArray(parsed.additionalApps)) {
                    parsed.additionalApps.forEach(a => {
                        if (a.title && !registeredChurches.some(rc => rc.name === a.title)) {
                            registeredChurches.push({ name: a.title, url: a.url || (""churchmain.html?churchName="" + encodeURIComponent(a.title)) });
                        }
                    });
                }
            }
            const myRegisteredHome = (localStorage.getItem(""yetalk_registered_home_church"") || localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || """").trim();
            if (myRegisteredHome && !registeredChurches.some(rc => rc.name === myRegisteredHome)) {
                registeredChurches.push({ name: myRegisteredHome, url: ""churchmain.html?churchName="" + encodeURIComponent(myRegisteredHome) });
            }
            const savedFoodName = localStorage.getItem(""yetalk_food_name"");
            if (savedFoodName) registeredStores.push({ name: savedFoodName, url: ""foodmain.html"" });
        } catch(e) {}

        // 등록된 교회 검색 일치 여부 확인 (공백 무시 유연한 매칭 & 정확한 교회명 URL 연결)
        const cleanQuery = q.replace(/\s+/g, '');
        const matchChurch = registeredChurches.find(c => {
            const cn = c.name.toLowerCase().replace(/\s+/g, '');
            return cleanQuery === cn || cleanQuery.includes(cn) || cn.includes(cleanQuery);
        });
        if (matchChurch) {
            let targetUrl = matchChurch.url;
            if (targetUrl.includes(""churchmain.html"") && !targetUrl.includes(""churchName="")) {
                targetUrl += (targetUrl.includes(""?"") ? ""&"" : ""?"") + ""churchName="" + encodeURIComponent(matchChurch.name);
            }
            location.href = targetUrl;
            return;
        }";

        if (indexHtml.Contains(searchOldTarget))
        {
            indexHtml = indexHtml.Replace(searchOldTarget, newSearch);
            Console.WriteLine("1-3. Updated executePortalSearch in assets/index.html.");
        }

        // Update unregistered church search alert to be clear
        string alertOld = @"        // 🌟 [사용자 요청] 아직 안 만들어진 상태(예: 부산제일감리교회 등) 검색 시 바로 예톡행복한교회 등으로 넘어가지 않고 alert창 띄우기!
        alert(""담임목사님이나 의사선생님,사장님에게 예톡에서 무료로 앱과 홈페이지를 만드시라고 전달해주세요."");";

        string newAlert = @"        if (q.includes(""교회"")) {
            alert(`📢 ['${query}']는 아직 예톡에 개설되지 않은 교회입니다.\n\n담임목사님이나 교우분들에게 예톡에서 무료로 우리교회 앱과 홈페이지를 만드시라고 전해주세요!\n\n(예톡홈 상단 '우리교회 홈페이지 무료 제작'에서 즉시 개설할 수 있습니다.)`);
            return;
        }
        alert(`📢 ['${query}'] 검색 결과가 없습니다.\n\n담임목사님이나 의사선생님, 사장님에게 예톡에서 무료로 전용 앱과 모바일 홈페이지를 만드시라고 추천해 주세요.`);";

        if (indexHtml.Contains(alertOld))
        {
            indexHtml = indexHtml.Replace(alertOld, newAlert);
            Console.WriteLine("1-4. Updated unregistered church search alert in assets/index.html.");
        }

        File.WriteAllText(indexFile, indexHtml.Replace("\n", "\r\n"), new UTF8Encoding(false));

        // -------------------------------------------------------------
        // 2. Patch assets/churchmain.html
        // -------------------------------------------------------------
        string churchMainFile = @"assets/churchmain.html";
        string churchMainHtml = File.ReadAllText(churchMainFile, Encoding.UTF8).Replace("\r\n", "\n").Replace("\r", "\n");

        string initOld = @"        // 🌟 URL 쿼리 파라미터에서 교회명 읽기 (?churchName=부산제일감리교회)
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
        if (titleEl) titleEl.innerText = churchName;";

        string initNew = @"        // 🌟 URL 쿼리 파라미터에서 교회명 읽기 (?churchName=행복한교회)
        const urlParams = new URLSearchParams(window.location.search);
        const qChurch = urlParams.get(""churchName"") || urlParams.get(""churchId"");
        let churchName = """";
        if (qChurch && qChurch !== ""yetalk-church"") {
            try { churchName = decodeURIComponent(qChurch); } catch(e) { churchName = qChurch; }
        }
        if (!churchName) {
            churchName = localStorage.getItem(""yetalkChurchName"") || localStorage.getItem(""yetalk_registered_home_church"") || localStorage.getItem(""yetalk_church_name"") || ""예톡행복한교회"";
        }
        if (!churchName || churchName.includes(""최웅식"") || churchName.includes(""최용식"") || churchName.includes(""김예톡"") || churchName.includes(""최예톡"")) {
            churchName = ""예톡행복한교회"";
        }
        // 현재 보고 있는 교회를 세션과 임시 스토리지에 저장 (단, 사용자의 본교회인 yetalk_registered_home_church는 보존!)
        sessionStorage.setItem(""yetalk_viewing_church"", churchName);
        localStorage.setItem(""yetalkChurchName"", churchName);

        const titleEl = document.getElementById(""churchName"");
        if (titleEl) titleEl.innerText = churchName;
        document.title = churchName + "" | 예톡"";";

        if (churchMainHtml.Contains(initOld))
        {
            churchMainHtml = churchMainHtml.Replace(initOld, initNew);
            Console.WriteLine("2-1. Fixed churchName init without overwriting user's home church in assets/churchmain.html.");
        }

        // In updateChurchHeaderMemberUI: check myHomeChurch properly
        string headerUiOld = @"    // 🌟 [사용자 요청] 교회 헤더 회원 배지 및 정회원/준회원 실시간 UI 반영
    function updateChurchHeaderMemberUI(curChurch) {
        const churchName = curChurch || localStorage.getItem(""yetalkChurchName"") || ""예톡행복한교회"";
        const uName = (localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalkUserName"") || """").trim();
        const myHomeChurch = (localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || localStorage.getItem(""yetalkMyChurchName"") || """").trim();
        
        const isRegular = Boolean(uName && (myHomeChurch === churchName || localStorage.getItem(""yetalk_is_regular_member_"" + churchName) === ""true""));
        const isAssociate = Boolean(localStorage.getItem(""yetalk_church_member_grade_"" + churchName) === ""준회원"");";

        string headerUiNew = @"    // 🌟 [사용자 요청] 교회 헤더 회원 배지 및 정회원/준회원 실시간 UI 반영
    function updateChurchHeaderMemberUI(curChurch) {
        const churchName = curChurch || sessionStorage.getItem(""yetalk_viewing_church"") || localStorage.getItem(""yetalkChurchName"") || ""예톡행복한교회"";
        const uName = (localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalkUserName"") || """").trim();
        // 사용자가 예톡홈에 등록한 본인 실제 출석교회명
        const myHomeChurch = (localStorage.getItem(""yetalk_registered_home_church"") || localStorage.getItem(""yetalk_church_name"") || """").trim();
        
        // 정회원: 본인 출석교회와 현재 보고 있는 교회가 일치하거나, 명시적으로 정회원인 경우
        const isRegular = Boolean(uName && myHomeChurch && (myHomeChurch === churchName || localStorage.getItem(""yetalk_is_regular_member_"" + churchName) === ""true""));
        // 준회원: 이 교회에 준회원으로 가입한 경우
        const isAssociate = Boolean(localStorage.getItem(""yetalk_church_member_grade_"" + churchName) === ""준회원"");";

        if (churchMainHtml.Contains(headerUiOld))
        {
            churchMainHtml = churchMainHtml.Replace(headerUiOld, headerUiNew);
            Console.WriteLine("2-2. Fixed updateChurchHeaderMemberUI in assets/churchmain.html.");
        }

        // In handleChurchMemberJoinClick: check myHomeChurch properly
        string clickOld = @"    /* 🌟 성도가입 클릭 시 원클릭 등록 분기: 정회원 vs 준회원 */
    function handleChurchMemberJoinClick() {
        const churchName = localStorage.getItem(""yetalkChurchName"") || ""예톡행복한교회"";
        const uName = (localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalkUserName"") || """").trim();
        const myHomeChurch = (localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || """").trim();
        
        const isRegular = Boolean(uName && (myHomeChurch === churchName || localStorage.getItem(""yetalk_is_regular_member_"" + churchName) === ""true""));
        const isAssociate = Boolean(localStorage.getItem(""yetalk_church_member_grade_"" + churchName) === ""준회원"");";

        string clickNew = @"    /* 🌟 성도가입 클릭 시 원클릭 등록 분기: 정회원 vs 준회원 */
    function handleChurchMemberJoinClick() {
        const churchName = sessionStorage.getItem(""yetalk_viewing_church"") || localStorage.getItem(""yetalkChurchName"") || ""예톡행복한교회"";
        const uName = (localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalkUserName"") || """").trim();
        const myHomeChurch = (localStorage.getItem(""yetalk_registered_home_church"") || localStorage.getItem(""yetalk_church_name"") || """").trim();
        
        const isRegular = Boolean(uName && myHomeChurch && (myHomeChurch === churchName || localStorage.getItem(""yetalk_is_regular_member_"" + churchName) === ""true""));
        const isAssociate = Boolean(localStorage.getItem(""yetalk_church_member_grade_"" + churchName) === ""준회원"");";

        if (churchMainHtml.Contains(clickOld))
        {
            churchMainHtml = churchMainHtml.Replace(clickOld, clickNew);
            Console.WriteLine("2-3. Fixed handleChurchMemberJoinClick in assets/churchmain.html.");
        }

        File.WriteAllText(churchMainFile, churchMainHtml.Replace("\n", "\r\n"), new UTF8Encoding(false));

        Console.WriteLine("All search and church view patches applied successfully!");
    }
}
