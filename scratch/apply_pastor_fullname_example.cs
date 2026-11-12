using System;
using System.IO;
using System.Text;

class ApplyPastorFullNameExample
{
    static void Main()
    {
        string[] paths = new string[]
        {
            @"assets\index.html",
            @"docs\index.html",
            @"app\src\main\assets\index.html"
        };

        foreach (string path in paths)
        {
            if (!File.Exists(path))
            {
                Console.WriteLine("File not found: " + path);
                continue;
            }

            string content = File.ReadAllText(path, Encoding.UTF8).Replace("\r\n", "\n");

            // 1. In HTML template: update placeholder and add helpful guide text
            string oldPastorInput = @"                    <label class=""modal-label"" style=""font-size:13.5px; font-weight:900; color:#0f172a; margin-bottom:4px; display:block;"">3. 담임목사님 성함 <span style=""color:#dc2626;"">*</span></label>
                    <input type=""text"" class=""modal-input"" id=""inpRegPastorName"" placeholder=""예: 김목사 (또는 담임목사 성함)"" style=""height:44px; font-size:14.5px; font-weight:800; border:1.5px solid #cbd5e1; border-radius:10px; padding:0 12px; width:100%; box-sizing:border-box;"">";

            string newPastorInput = @"                    <label class=""modal-label"" style=""font-size:13.5px; font-weight:900; color:#0f172a; margin-bottom:4px; display:block;"">3. 담임목사님 성함 <span style=""color:#dc2626;"">*</span></label>
                    <input type=""text"" class=""modal-input"" id=""inpRegPastorName"" placeholder=""예: 김요셉 목사 (성과 이름 전체 입력)"" style=""height:44px; font-size:14.5px; font-weight:800; border:1.5px solid #cbd5e1; border-radius:10px; padding:0 12px; width:100%; box-sizing:border-box;"">
                    <div style=""font-size:11.5px; color:#64748b; margin-top:3px; padding-left:2px;"">
                        ※ '김목사', '최목사' 대신 <strong>'김요셉 목사'</strong>처럼 성과 이름을 모두 입력해 주세요.
                    </div>";

            if (content.Contains(oldPastorInput))
            {
                content = content.Replace(oldPastorInput, newPastorInput);
            }

            // 2. In openChristianRegisterModal(): update placeholder
            content = content.Replace(
                @"if (inpPastor) { inpPastor.value = """"; inpPastor.placeholder = ""예: 김목사 (또는 담임목사 성함)""; }",
                @"if (inpPastor) { inpPastor.value = """"; inpPastor.placeholder = ""예: 김요셉 목사 (성과 이름 전체 입력)""; }"
            );

            // 3. In submitChristianRegistration(): validate that user didn't enter single-character surname (e.g., 김목사, 최목사)
            string oldValidation = @"        if (!pastorName) {
            alert(""담임목사님 성함을 입력해주세요."");
            document.getElementById(""inpRegPastorName"")?.focus();
            return;
        }";

            string newValidation = @"        if (!pastorName) {
            alert(""담임목사님 성함을 입력해주세요."");
            document.getElementById(""inpRegPastorName"")?.focus();
            return;
        }

        // 🌟 [사용자 요청] '김목사', '최목사' 처럼 성만 적는 착각 방지: 성과 이름을 모두 입력하도록 검증
        const cleanPastorName = pastorName.replace(/\s+/g, '').replace(/^(담임)?목사님?/g, '').replace(/(담임)?목사(님)?$/g, '');
        if (cleanPastorName.length <= 1) {
            alert(""담임목사님의 성과 이름을 모두 입력해 주세요.\n(예: '김목사' ➔ '김요셉 목사')"");
            document.getElementById(""inpRegPastorName"")?.focus();
            return;
        }";

            if (content.Contains(oldValidation))
            {
                content = content.Replace(oldValidation, newValidation);
            }

            File.WriteAllText(path, content, new UTF8Encoding(false));
            Console.WriteLine("SUCCESS: Updated " + path);
        }
    }
}
