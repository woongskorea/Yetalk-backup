using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string[] files = new string[]
        {
            @"assets\index.html",
            @"docs\index.html",
            @"app\src\main\assets\index.html"
        };

        foreach (var file in files)
        {
            if (!File.Exists(file)) continue;
            string text = File.ReadAllText(file, Encoding.UTF8);

            // 1. Move clock inside header-logo-group and reduce header top padding
            string oldHeaderFull = @"    <!-- 🌟 [사용자 요청] 스마트폰 상단 시계 감춤 대응: 나의 앱 예톡 위에 겹치지 않게 날짜/시계 실시간 표출 -->
    <div class=""header-live-clock-row"" style=""padding:4px 14px 2px 14px; display:flex; justify-content:flex-start; align-items:center; background:#ffffff; box-sizing:border-box;"">
        <span id=""txtHeaderLiveClock"" style=""font-size:11.5px; font-weight:800; color:#64748b; letter-spacing:-0.2px; display:inline-flex; align-items:center; gap:5px;"">
            <span style=""font-size:11px;"">🕒</span><span id=""liveClockDateText"">11월 11일(화) 오후 11:30</span>
        </span>
    </div>
    <header class=""app-header"" style=""display:flex; justify-content:space-between; align-items:center; padding:calc(var(--safe-top, 24px) - 14px) 14px 0 14px; background:#ffffff; border-bottom:none; box-sizing:border-box;"">
        <div class=""header-logo-group"" id=""headerLogoGroup"" onclick=""handleLogoClick()"" style=""display:flex; align-items:baseline; gap:5px; white-space:nowrap; cursor:pointer;"">
            <span class=""header-logo-prefix"" style=""font-size:13.5px; font-weight:750; color:#475569; letter-spacing:-0.3px; white-space:nowrap;"">나의 앱</span>
            <span class=""header-logo-name"" style=""font-size:26px; font-weight:950; color:#059669; letter-spacing:-0.5px; white-space:nowrap;"">예톡🌿</span>
        </div>";

            string newHeaderFull = @"    <header class=""app-header"" style=""display:flex; justify-content:space-between; align-items:center; padding:2px 14px 0 14px; background:#ffffff; border-bottom:none; box-sizing:border-box;"">
        <div class=""header-logo-group"" id=""headerLogoGroup"" onclick=""handleLogoClick()"" style=""display:flex; flex-direction:column; justify-content:center; white-space:nowrap; cursor:pointer;"">
            <span id=""txtHeaderLiveClock"" style=""font-size:11px; font-weight:800; color:#64748b; letter-spacing:-0.2px; line-height:1.2; margin-bottom:2px;"">
                🕒 <span id=""liveClockDateText"">11월 11일(화) 오후 11:30</span>
            </span>
            <div style=""display:flex; align-items:baseline; gap:5px;"">
                <span class=""header-logo-prefix"" style=""font-size:13.5px; font-weight:750; color:#475569; letter-spacing:-0.3px;"">나의 앱</span>
                <span class=""header-logo-name"" style=""font-size:26px; font-weight:950; color:#059669; letter-spacing:-0.5px;"">예톡🌿</span>
            </div>
        </div>";

            if (text.Contains(oldHeaderFull))
            {
                text = text.Replace(oldHeaderFull, newHeaderFull);
            }
            else
            {
                // In case line endings differ
                string oldNorm = oldHeaderFull.Replace("\r\n", "\n");
                string textNorm = text.Replace("\r\n", "\n");
                if (textNorm.Contains(oldNorm))
                {
                    textNorm = textNorm.Replace(oldNorm, newHeaderFull.Replace("\r\n", "\n"));
                    text = textNorm;
                }
            }

            // 2. Tighten padding/margin around [💡 예톡 간단 사용안내] button
            string oldGuideDiv = "padding:2px 14px 6px 14px; margin-top:-2px;";
            string newGuideDiv = "padding:0 14px; margin-top:-6px; margin-bottom:2px;";
            text = text.Replace(oldGuideDiv, newGuideDiv);

            // 3. Remove bottom footer bar in modalYetalkGuide
            string footerSnippet = @"            <!-- 하단 닫기 바 -->
            <div style=""padding:12px 18px; background:#ffffff; border-top:1.5px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;"">
                <span style=""font-size:12.5px; color:#059669; font-weight:850;"">🌿 작은교회 예수동행 말씀 & 기도 플랫폼</span>
                <button type=""button"" onclick=""closeYetalkGuideModal()"" style=""padding:8px 22px; background:linear-gradient(135deg, #059669 0%, #047857 100%); color:#ffffff; font-size:14px; font-weight:950; border:none; border-radius:12px; cursor:pointer; box-shadow:0 2px 6px rgba(5,150,105,0.25);"">확인 닫기</button>
            </div>";

            if (text.Contains(footerSnippet))
            {
                text = text.Replace(footerSnippet, "");
            }
            else
            {
                string footNorm = footerSnippet.Replace("\r\n", "\n");
                string textNorm = text.Replace("\r\n", "\n");
                if (textNorm.Contains(footNorm))
                {
                    textNorm = textNorm.Replace(footNorm, "");
                    text = textNorm;
                }
            }

            // 4. Reduce margin & padding of .portal-five-apps-bar (복음, 구원, 쿠팡, 네이버쇼핑 상하 여유 축소)
            string oldFiveBarCss = @"        .portal-five-apps-bar {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            margin: 12px 0 16px 0;
            padding: 12px 8px;
            background: #ffffff;
            border-radius: 18px;
            border: 1.5px solid #e2e8f0;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
            box-sizing: border-box;
        }";

            string newFiveBarCss = @"        .portal-five-apps-bar {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            margin: 4px 0 6px 0;
            padding: 8px 6px;
            background: #ffffff;
            border-radius: 18px;
            border: 1.5px solid #e2e8f0;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
            box-sizing: border-box;
        }";

            if (text.Contains(oldFiveBarCss))
            {
                text = text.Replace(oldFiveBarCss, newFiveBarCss);
            }
            else
            {
                string bNorm = oldFiveBarCss.Replace("\r\n", "\n");
                string textNorm = text.Replace("\r\n", "\n");
                if (textNorm.Contains(bNorm))
                {
                    textNorm = textNorm.Replace(bNorm, newFiveBarCss.Replace("\r\n", "\n"));
                    text = textNorm;
                }
            }

            // Also reduce gap above 4 apps bar
            text = text.Replace("margin-top: 6px; font-size: 12.8px; font-weight: 850; color: #0284c7; letter-spacing: -0.35px; line-height: 1.35; word-break: keep-all; padding: 2px 1px;",
                                "margin-top: 2px; font-size: 12.8px; font-weight: 850; color: #0284c7; letter-spacing: -0.35px; line-height: 1.3; word-break: keep-all; padding: 1px 1px; margin-bottom: 2px;");

            File.WriteAllText(file, text, Encoding.UTF8);
            Console.WriteLine("Done compacting " + file);
        }
    }
}
