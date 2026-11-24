using System;
using System.IO;
using System.Text;

class RemovePlayStoreNoticePopup
{
    static void Main()
    {
        string filePath = @"assets\index.html";
        string content = File.ReadAllText(filePath, Encoding.UTF8);

        // 1. Remove modal HTML
        string modalStart = "    <!-- 🌟 [사용자 요청] 1주일간 매일 오전 5시 이후 첫 접속 시 플레이스토어 업데이트 & 소감(리뷰) 안내 팝업 모달 -->";
        string modalEnd = "    </div>\r\n\r\n    <!-- 🌟 [사용자 요청] 오늘의 복음 팝업 모달";
        if (!content.Contains(modalEnd))
        {
            modalEnd = "    </div>\n\n    <!-- 🌟 [사용자 요청] 오늘의 복음 팝업 모달";
        }

        int idxStart = content.IndexOf(modalStart);
        if (idxStart >= 0)
        {
            int idxEnd = content.IndexOf(modalEnd, idxStart);
            if (idxEnd >= 0)
            {
                // Remove from idxStart up to before "    <!-- 🌟 [사용자 요청] 오늘의 복음 팝업 모달"
                content = content.Substring(0, idxStart) + content.Substring(idxEnd + (modalEnd.StartsWith("    </div>\r\n\r\n") ? 14 : 12));
                Console.WriteLine("Modal HTML removed successfully.");
            }
            else
            {
                Console.WriteLine("Could not find modal end.");
            }
        }
        else
        {
            Console.WriteLine("Modal start not found.");
        }

        // 2. Simplify checkPlayStoreNoticePopup call at window load
        string oldCall = @"        // 🌟 [사용자 요청] 1주일간 매일 오전 5시 이후 첫 접속 시 플레이스토어 업데이트 & 소감(리뷰) 안내 팝업 (우선 노출)
        const playStoreNoticeShown = checkPlayStoreNoticePopup();
        if (!playStoreNoticeShown) {
            // 🌟 하루 한 번 이쁜 구원의 복음 팝업창 (월~주일 7대 복음 매일 1회 자동 노출)
            checkDailyGospelPopup();
        }";

        string newCall = @"        // 🌟 하루 한 번 이쁜 구원의 복음 팝업창 (월~주일 7대 복음 매일 1회 자동 노출)
        checkDailyGospelPopup();";

        if (content.Contains(oldCall))
        {
            content = content.Replace(oldCall, newCall);
            Console.WriteLine("Window load check replaced successfully.");
        }
        else
        {
            // Try with LF line endings
            string oldCallLf = oldCall.Replace("\r\n", "\n");
            string newCallLf = newCall.Replace("\r\n", "\n");
            if (content.Contains(oldCallLf))
            {
                content = content.Replace(oldCallLf, newCallLf);
                Console.WriteLine("Window load check (LF) replaced successfully.");
            }
            else
            {
                Console.WriteLine("Window load check pattern not found.");
            }
        }

        // 3. Make JS functions harmless no-ops
        string jsTargetStart = "    // 🌟 [사용자 요청] 1주일간 매일 오전 5시 이후 처음 열 때 1회 플레이스토어 업데이트 & 소감(리뷰) 안내 팝업";
        string jsTargetEnd = "    window.checkPlayStoreNoticePopup = checkPlayStoreNoticePopup;";
        int jsStart = content.IndexOf(jsTargetStart);
        if (jsStart >= 0)
        {
            int jsEnd = content.IndexOf(jsTargetEnd, jsStart);
            if (jsEnd >= 0)
            {
                jsEnd += jsTargetEnd.Length;
                string replacement = @"    // 플레이스토어 업데이트 & 소감 안내 팝업 제거됨 (no-op)
    function showPlayStoreNoticePopup() {}
    function closePlayStoreNoticePopup() {}
    function openYetalkPlayStore() {}
    function checkPlayStoreNoticePopup() { return false; }
    window.showPlayStoreNoticePopup = showPlayStoreNoticePopup;
    window.closePlayStoreNoticePopup = closePlayStoreNoticePopup;
    window.openYetalkPlayStore = openYetalkPlayStore;
    window.checkPlayStoreNoticePopup = checkPlayStoreNoticePopup;";

                content = content.Substring(0, jsStart) + replacement + content.Substring(jsEnd);
                Console.WriteLine("JS functions replaced with no-ops.");
            }
            else
            {
                Console.WriteLine("jsEnd not found.");
            }
        }
        else
        {
            Console.WriteLine("jsStart not found.");
        }

        File.WriteAllText(filePath, content, Encoding.UTF8);

        // 4. Synchronize all targets
        string[] targets = new string[]
        {
            @"app\src\main\assets\index.html",
            @"docs\index.html",
            @"docs\assets\index.html"
        };

        foreach (var t in targets)
        {
            if (File.Exists(t))
            {
                File.Copy(filePath, t, true);
                Console.WriteLine("Synced to: " + t);
            }
        }
    }
}
