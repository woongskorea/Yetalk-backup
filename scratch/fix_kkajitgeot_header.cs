using System;
using System.IO;
using System.Text;

class FixKkajitgeotHeader
{
    static void Main()
    {
        string[] files = new string[] {
            @"c:\Users\Administrator\AndroidStudioProjects\Yetalk\assets\index.html",
            @"c:\Users\Administrator\AndroidStudioProjects\Yetalk\docs\index.html",
            @"c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\index.html"
        };

        foreach (var path in files)
        {
            if (!File.Exists(path)) continue;
            string text = File.ReadAllText(path, Encoding.UTF8).Replace("\r\n", "\n");

            string oldHeader = @"            <!-- 1. 🌟 [사용자 요청] 상단 고정 헤더: 겹침 방지를 위해 좌측 뒤로가기와 우측 닫기만 두고 제목 글씨는 아래 본문으로 내림 -->
            <div style=""height:50px; background:#ffffff; border-bottom:1.5px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 16px; flex-shrink:0; box-sizing:border-box;"">
                <button type=""button"" onclick=""closeKkajitgeotModal()"" style=""background:none; border:none; color:#1e293b; font-size:16px; font-weight:950; cursor:pointer; display:flex; align-items:center; gap:4px; padding:8px 0; white-space:nowrap;"">
                    <span>← 뒤로</span>
                </button>
                <div style=""font-size:14px; font-weight:900; color:#64748b;"">
                    말씀 &amp; 신앙결단
                </div>
                <button type=""button"" onclick=""closeKkajitgeotModal()"" style=""width:34px; height:34px; border-radius:50%; background:#f1f5f9; border:none; color:#475569; font-size:16px; font-weight:950; cursor:pointer; display:flex; align-items:center; justify-content:center;"">✕</button>
            </div>";

            string newHeader = @"            <!-- 1. 🌟 [사용자 요청] 상단 고정 헤더: 상태표시줄 겹침 방지 및 터치 영역 널찍하게 아래로 여백 확보 -->
            <div style=""padding-top: max(16px, env(safe-area-inset-top)); padding-bottom: 10px; padding-left: 14px; padding-right: 14px; background:#ffffff; border-bottom:1.5px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; box-sizing:border-box;"">
                <button type=""button"" onclick=""closeKkajitgeotModal()"" style=""background:#f1f5f9; border:1px solid #e2e8f0; border-radius:20px; color:#1e293b; font-size:15px; font-weight:950; cursor:pointer; display:inline-flex; align-items:center; gap:4px; padding:7px 14px; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.05);"">
                    <span>← 뒤로</span>
                </button>
                <div style=""font-size:14.5px; font-weight:900; color:#475569;"">
                    말씀 &amp; 신앙결단
                </div>
                <button type=""button"" onclick=""closeKkajitgeotModal()"" style=""width:38px; height:38px; border-radius:50%; background:#f1f5f9; border:1px solid #e2e8f0; color:#475569; font-size:18px; font-weight:950; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,0.05);"">✕</button>
            </div>";

            if (text.Contains(oldHeader))
            {
                text = text.Replace(oldHeader, newHeader);
                Console.WriteLine("Updated kkajitgeot header in: " + path);
            }
            else
            {
                Console.WriteLine("Warning: oldHeader not found in: " + path);
            }

            File.WriteAllText(path, text, new UTF8Encoding(false));
        }

        Console.WriteLine("Done.");
    }
}
