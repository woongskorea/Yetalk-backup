using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        UpdateAndroidManifest();
        UpdateIndexHtml();
        SyncFiles();
        Console.WriteLine("ALL_MEMBER_INFO_AND_BUTTON_FIXES_APPLIED");
    }

    static void UpdateAndroidManifest()
    {
        string path = @"app\src\main\AndroidManifest.xml";
        string xml = File.ReadAllText(path, Encoding.UTF8);

        if (xml.Contains("android:allowBackup=\"true\""))
        {
            xml = xml.Replace("android:allowBackup=\"true\"", "android:allowBackup=\"false\"");
            File.WriteAllText(path, xml, new UTF8Encoding(false));
            Console.WriteLine("Updated AndroidManifest.xml: allowBackup=false to prevent cross-device sync");
        }
    }

    static void UpdateIndexHtml()
    {
        string path = @"assets\index.html";
        string html = File.ReadAllText(path, Encoding.UTF8);

        // 1. Replace hardcoded chipTabOurChurch text from "⛪ 부산제일감리교회" to "⛪ 우리교회"
        html = html.Replace(
            ">⛪ 부산제일감리교회</button>",
            ">⛪ 우리교회</button>"
        );

        // 2. Add Reset (새로작성) button and oninput triggers in christianRegisterModal
        string oldModalHeader = @"                <div>
                    <span class=""modal-title"" id=""christianRegisterModalTitle"" style=""color:#047857; font-size:18px; font-weight:950;"">✝️ 예톡 교우 회원가입</span>
                    <div style=""font-size:12px; color:#64748b; font-weight:700; margin-top:2px;"">교회명과 담임목사님 입력 시 우리교회앱이 즉시 생성·연결됩니다</div>
                </div>
                <button type=""button"" style=""background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer;"" onclick=""closeChristianRegisterModal()"">✕</button>";

        string newModalHeader = @"                <div>
                    <span class=""modal-title"" id=""christianRegisterModalTitle"" style=""color:#047857; font-size:18px; font-weight:950;"">✝️ 예톡 교우 회원가입</span>
                    <div style=""font-size:12px; color:#64748b; font-weight:700; margin-top:2px;"">교회명과 담임목사님 입력 시 우리교회앱이 즉시 생성·연결됩니다</div>
                </div>
                <div style=""display:flex; align-items:center; gap:8px;"">
                    <button type=""button"" onclick=""resetChristianRegForm()"" style=""background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; font-size:11.5px; font-weight:850; color:#334155; padding:5px 9px; cursor:pointer; display:inline-flex; align-items:center; gap:3px;"" title=""새로 작성 (비우기)"">🔄 새로작성</button>
                    <button type=""button"" style=""background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer; padding:2px; line-height:1;"" onclick=""closeChristianRegisterModal()"">✕</button>
                </div>";

        if (html.Contains(oldModalHeader))
        {
            html = html.Replace(oldModalHeader, newModalHeader);
            Console.WriteLine("Added reset button in christianRegisterModal header");
        }

        // Add oninput to input fields
        html = html.Replace(
            "id=\"inpRegNameOrId\" placeholder=\"예: 홍길동 (또는 성도명)\"",
            "id=\"inpRegNameOrId\" placeholder=\"예: 홍길동 (또는 성도명)\" oninput=\"handleRegInputChanged()\""
        );
        html = html.Replace(
            "id=\"inpRegChurchName\" placeholder=\"예: 은혜교회 (또는 본인 교회명)\"",
            "id=\"inpRegChurchName\" placeholder=\"예: 은혜교회 (또는 본인 교회명)\" oninput=\"handleRegInputChanged()\""
        );
        html = html.Replace(
            "id=\"inpRegPastorName\" placeholder=\"예: 김요셉 목사 (성과 이름 전체 입력)\"",
            "id=\"inpRegPastorName\" placeholder=\"예: 김요셉 목사 (성과 이름 전체 입력)\" oninput=\"handleRegInputChanged()\""
        );

        // 3. Update openChristianRegisterModal and submitChristianRegistration
        string oldModalCode = @"    function openChristianRegisterModal() {
        const inpName = document.getElementById(""inpRegNameOrId"");
        const inpChurch = document.getElementById(""inpRegChurchName"");
        const inpPastor = document.getElementById(""inpRegPastorName"");
        const selRole = document.getElementById(""selRegChurchRole"");
        const titleEl = document.getElementById(""christianRegisterModalTitle"");
        const submitBtn = document.getElementById(""btnSubmitChristianReg"");

        const savedName = localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalk_user_id"") || """";
        const savedChurch = localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || """";
        const savedPastor = localStorage.getItem(""yetalk_pastor_name"") || """";
        const savedRole = localStorage.getItem(""yetalk_church_role"") || ""성도"";

        // 🌟 [사용자 요청] 회원가입 후에는 본인 기존 정보가 입력창에 바로 떠서 언제든 수정 가능!
        if (savedName || savedChurch) {
            if (inpName) inpName.value = savedName;
            if (inpChurch) inpChurch.value = savedChurch;
            if (inpPastor) inpPastor.value = savedPastor;
            if (selRole) {
                let matched = false;
                for (let i = 0; i < selRole.options.length; i++) {
                    if (selRole.options[i].value === savedRole) {
                        selRole.selectedIndex = i;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    // ""목회사역자"" 또는 ""목회사역자(사모포함)"" 등 유연한 매칭 지원
                    for (let i = 0; i < selRole.options.length; i++) {
                        if (selRole.options[i].value.includes(savedRole) || savedRole.includes(selRole.options[i].value)) {
                            selRole.selectedIndex = i;
                            matched = true;
                            break;
                        }
                    }
                }
                if (!matched) selRole.value = ""성도"";
            }
            if (titleEl) titleEl.innerText = ""✏️ 회원정보 확인 및 수정"";
            if (submitBtn) submitBtn.innerText = ""💾 회원정보 수정 완료 ✓"";
            onChurchRoleChange(selRole ? selRole.value : savedRole);
        } else {
            if (inpName) { inpName.value = """"; inpName.placeholder = ""예: 홍길동 (또는 성도명)""; }
            if (inpChurch) { inpChurch.value = """"; inpChurch.placeholder = ""예: 은혜교회 (또는 본인 교회명)""; }
            if (inpPastor) { inpPastor.value = """"; inpPastor.placeholder = ""예: 김요셉 목사 (성과 이름 전체 입력)""; }
            if (selRole) selRole.value = ""성도"";
            if (titleEl) titleEl.innerText = ""✝️ 예톡 교우 회원가입"";
            if (submitBtn) submitBtn.innerText = ""✝️ 가입 완료 및 우리교회앱 연결 ➔"";
            onChurchRoleChange(""성도"");
        }";

        string newModalCode = @"    let isRegEditMode = false;

    // 🌟 [사용자 요청] 입력창을 수정 중일 때 버튼 상태를 주황색 '변경사항 저장하기'로 차별화
    function handleRegInputChanged() {
        const submitBtn = document.getElementById(""btnSubmitChristianReg"");
        if (!submitBtn) return;
        if (isRegEditMode) {
            submitBtn.innerText = ""💾 변경사항 저장하기"";
            submitBtn.style.background = ""linear-gradient(135deg, #ea580c 0%, #c2410c 100%)"";
            submitBtn.style.boxShadow = ""0 3px 12px rgba(234,88,12,0.4)"";
        }
    }

    // 🌟 [사용자 요청] 아내 폰 등 타인 정보가 채워져 있을 때 원클릭으로 깨끗이 비우고 새로 작성
    function resetChristianRegForm() {
        if (!confirm(""입력칸을 모두 비우고 새로운 교우 정보로 작성하시겠습니까?"")) return;
        const inpName = document.getElementById(""inpRegNameOrId"");
        const inpChurch = document.getElementById(""inpRegChurchName"");
        const inpPastor = document.getElementById(""inpRegPastorName"");
        const selRole = document.getElementById(""selRegChurchRole"");
        if (inpName) inpName.value = """";
        if (inpChurch) inpChurch.value = """";
        if (inpPastor) inpPastor.value = """";
        if (selRole) selRole.value = ""성도"";
        onChurchRoleChange(""성도"");

        isRegEditMode = false;
        const titleEl = document.getElementById(""christianRegisterModalTitle"");
        if (titleEl) titleEl.innerText = ""✝️ 예톡 교우 회원가입"";
        const submitBtn = document.getElementById(""btnSubmitChristianReg"");
        if (submitBtn) {
            submitBtn.innerText = ""✝️ 가입 완료 및 우리교회앱 연결 ➔"";
            submitBtn.style.background = ""linear-gradient(135deg, #059669 0%, #047857 100%)"";
            submitBtn.style.boxShadow = ""0 3px 10px rgba(5,150,105,0.3)"";
        }
    }

    function openChristianRegisterModal() {
        const inpName = document.getElementById(""inpRegNameOrId"");
        const inpChurch = document.getElementById(""inpRegChurchName"");
        const inpPastor = document.getElementById(""inpRegPastorName"");
        const selRole = document.getElementById(""selRegChurchRole"");
        const titleEl = document.getElementById(""christianRegisterModalTitle"");
        const submitBtn = document.getElementById(""btnSubmitChristianReg"");

        const savedName = localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalk_user_id"") || """";
        const savedChurch = localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || """";
        const savedPastor = localStorage.getItem(""yetalk_pastor_name"") || """";
        const savedRole = localStorage.getItem(""yetalk_church_role"") || ""성도"";

        isRegEditMode = !!(savedName || savedChurch);

        // 🌟 [사용자 요청] 수정 전에는 상시 체크(✓)를 완전히 없애고 시원한 파란색 '💾 회원정보 수정하기'로 명확히 표기!
        if (isRegEditMode) {
            if (inpName) inpName.value = savedName;
            if (inpChurch) inpChurch.value = savedChurch;
            if (inpPastor) inpPastor.value = savedPastor;
            if (selRole) {
                let matched = false;
                for (let i = 0; i < selRole.options.length; i++) {
                    if (selRole.options[i].value === savedRole) {
                        selRole.selectedIndex = i;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    for (let i = 0; i < selRole.options.length; i++) {
                        if (selRole.options[i].value.includes(savedRole) || savedRole.includes(selRole.options[i].value)) {
                            selRole.selectedIndex = i;
                            matched = true;
                            break;
                        }
                    }
                }
                if (!matched) selRole.value = ""성도"";
            }
            if (titleEl) titleEl.innerText = ""✏️ 회원정보 확인 및 수정"";
            if (submitBtn) {
                submitBtn.innerText = ""💾 회원정보 수정하기"";
                submitBtn.style.background = ""linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"";
                submitBtn.style.boxShadow = ""0 3px 12px rgba(2,132,199,0.35)"";
            }
            onChurchRoleChange(selRole ? selRole.value : savedRole);
        } else {
            if (inpName) { inpName.value = """"; inpName.placeholder = ""예: 홍길동 (또는 성도명)""; }
            if (inpChurch) { inpChurch.value = """"; inpChurch.placeholder = ""예: 은혜교회 (또는 본인 교회명)""; }
            if (inpPastor) { inpPastor.value = """"; inpPastor.placeholder = ""예: 김요셉 목사 (성과 이름 전체 입력)""; }
            if (selRole) selRole.value = ""성도"";
            if (titleEl) titleEl.innerText = ""✝️ 예톡 교우 회원가입"";
            if (submitBtn) {
                submitBtn.innerText = ""✝️ 가입 완료 및 우리교회앱 연결 ➔"";
                submitBtn.style.background = ""linear-gradient(135deg, #059669 0%, #047857 100%)"";
                submitBtn.style.boxShadow = ""0 3px 10px rgba(5,150,105,0.3)"";
            }
            onChurchRoleChange(""성도"");
        }";

        if (html.Contains(oldModalCode))
        {
            html = html.Replace(oldModalCode, newModalCode);
            Console.WriteLine("Updated openChristianRegisterModal and button states in index.html");
        }
        else
        {
            Console.WriteLine("Warning: oldModalCode not found directly");
        }

        // 4. Update submitChristianRegistration to provide visual success state on button before closing
        string oldSubmitSuccess = @"        closeChristianRegisterModal();
        updateChristianHeaderUI();

        alert(`✅ 회원정보가 성공적으로 저장되었습니다!\n\n• 성도명: ${nameOrId}\n• 교회명: ${churchName}\n• 담임목사: ${pastorName}\n• 직분: ${role}`);";

        string newSubmitSuccess = @"        // 🌟 [사용자 요청] 수정 완료 시 버튼이 화사한 에메랄드 초록색 '✅ 회원정보 수정 완료! ✓'로 확실하게 반응!
        const submitBtn = document.getElementById(""btnSubmitChristianReg"");
        if (submitBtn) {
            submitBtn.innerText = ""✅ 회원정보 수정 완료! ✓"";
            submitBtn.style.background = ""linear-gradient(135deg, #10b981 0%, #059669 100%)"";
            submitBtn.style.boxShadow = ""0 4px 16px rgba(16,185,129,0.5)"";
        }

        setTimeout(() => {
            closeChristianRegisterModal();
            updateChristianHeaderUI();
            alert(`✅ 회원정보가 성공적으로 저장되었습니다!\n\n• 성도명: ${nameOrId}\n• 교회명: ${churchName}\n• 담임목사: ${pastorName}\n• 직분: ${role}`);
        }, 350);";

        if (html.Contains(oldSubmitSuccess))
        {
            html = html.Replace(oldSubmitSuccess, newSubmitSuccess);
            Console.WriteLine("Updated submitChristianRegistration with visual button feedback");
        }

        // 5. Update updateChristianHeaderUI so empty church name shows "우리교회 등록" instead of forcing "부산제일감리교회"
        string oldHeaderUI = @"    function updateChristianHeaderUI() {
        // 🌟 [사용자 요청] 홈 상단 바에 등록 교회 및 이름 버튼 표시 (내 교회명 즉시 반영)
        const churchName = localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || ""부산제일감리교회"";
        const ourChurchTab = document.getElementById(""chipTabOurChurch"");
        if (ourChurchTab) {
            ourChurchTab.innerHTML = `⛪ ${churchName.trim()}`;
        }";

        string newHeaderUI = @"    function updateChristianHeaderUI() {
        // 🌟 [사용자 요청] 홈 상단 바에 등록 교회 및 이름 버튼 표시 (내 교회명 즉시 반영)
        const churchName = localStorage.getItem(""yetalk_church_name"") || localStorage.getItem(""yetalkChurchName"") || """";
        const ourChurchTab = document.getElementById(""chipTabOurChurch"");
        if (ourChurchTab) {
            if (churchName && churchName.trim()) {
                ourChurchTab.innerHTML = `⛪ ${churchName.trim()}`;
            } else {
                ourChurchTab.innerHTML = `⛪ 우리교회 등록`;
            }
        }";

        if (html.Contains(oldHeaderUI))
        {
            html = html.Replace(oldHeaderUI, newHeaderUI);
            Console.WriteLine("Updated updateChristianHeaderUI in index.html");
        }

        File.WriteAllText(path, html, new UTF8Encoding(false));
    }

    static void SyncFiles()
    {
        string path = @"assets\index.html";
        File.Copy(path, @"docs\index.html", true);
        File.Copy(path, @"app\src\main\assets\index.html", true);
        Console.WriteLine("Synced index.html to docs and app/src/main/assets");
    }
}
