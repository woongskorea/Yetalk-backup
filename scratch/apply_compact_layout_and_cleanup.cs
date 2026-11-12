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

            // 1. Remove separate header-live-clock-row that pushed top down, and integrate clock inside header-logo-group
            string clockRowPattern1 = "<!-- 🌟 [사용자 요청] 스마트폰 상단 시계 감춤 대응: 나의 앱 예톡 위에 겹치지 않게 날짜/시계 실시간 표출 -->";
            if (text.Contains(clockRowPattern1))
            {
                int crStart = text.IndexOf(clockRowPattern1);
                int hStart = text.IndexOf("<header class=\"app-header\"", crStart);
                if (crStart != -1 && hStart != -1)
                {
                    text = text.Substring(0, crStart) + text.Substring(hStart);
                }
            }

            // Also check if any standalone <div class="header-live-clock-row" remains
            string clockRowDivStart = "<div class=\"header-live-clock-row\"";
            if (text.Contains(clockRowDivStart))
            {
                int cDivStart = text.IndexOf(clockRowDivStart);
                int cDivEnd = text.IndexOf("</div>", cDivStart);
                if (cDivStart != -1 && cDivEnd != -1)
                {
                    text = text.Substring(0, cDivStart) + text.Substring(cDivEnd + 6);
                }
            }

            // Tighten app-header padding and place clock cleanly above [나의 앱 예톡🌿]
            string oldLogoGroup = @"<div class=""header-logo-group"" id=""headerLogoGroup"" onclick=""handleLogoClick()"" style=""display:flex; align-items:baseline; gap:5px; white-space:nowrap; cursor:pointer;"">
            <span class=""header-logo-prefix"" style=""font-size:13.5px; font-weight:750; color:#475569; letter-spacing:-0.3px; white-space:nowrap;"">나의 앱</span>
            <span class=""header-logo-name"" style=""font-size:26px; font-weight:950; color:#059669; letter-spacing:-0.5px; white-space:nowrap;"">예톡🌿</span>
        </div>";

            string newLogoGroup = @"<div class=""header-logo-group"" id=""headerLogoGroup"" onclick=""handleLogoClick()"" style=""display:flex; flex-direction:column; justify-content:center; white-space:nowrap; cursor:pointer;"">
            <span id=""txtHeaderLiveClock"" style=""font-size:11px; font-weight:800; color:#64748b; letter-spacing:-0.2px; line-height:1.2; margin-bottom:2px;"">
                🕒 <span id=""liveClockDateText"">11월 11일(화) 오후 11:30</span>
            </span>
            <div style=""display:flex; align-items:baseline; gap:5px;"">
                <span class=""header-logo-prefix"" style=""font-size:13px; font-weight:750; color:#475569; letter-spacing:-0.3px;"">나의 앱</span>
                <span class=""header-logo-name"" style=""font-size:24px; font-weight:950; color:#059669; letter-spacing:-0.5px;"">예톡🌿</span>
            </div>
        </div>";

            text = text.Replace(oldLogoGroup, newLogoGroup);

            // Tighten header top padding so the screen starts right near the top
            text = text.Replace("padding:calc(var(--safe-top, 24px) - 14px) 14px 0 14px;", "padding:2px 14px 0 14px;");

            // 2. Tighten vertical gap around [💡 예톡 간단 사용안내]
            string oldGuideBtnWrapper = "style=\"display:flex; justify-content:flex-end; align-items:center; padding:2px 14px 6px 14px; margin-top:-2px;\"";
            string newGuideBtnWrapper = "style=\"display:flex; justify-content:flex-end; align-items:center; padding:0 14px; margin-top:-6px; margin-bottom:2px;\"";
            text = text.Replace(oldGuideBtnWrapper, newGuideBtnWrapper);

            // 3. Completely remove bottom footer bar [확인 닫기] in modalYetalkGuide
            string footerBarMarker = "<!-- 하단 닫기 바 -->";
            int fbStart = text.IndexOf(footerBarMarker);
            if (fbStart != -1)
            {
                // find end of this footer div
                int fbDivEnd = text.IndexOf("</div>\r\n        </div>\r\n    </div>", fbStart);
                if (fbDivEnd == -1) fbDivEnd = text.IndexOf("</div>\n        </div>\n    </div>", fbStart);

                if (fbDivEnd != -1)
                {
                    text = text.Substring(0, fbStart) + text.Substring(fbDivEnd);
                }
            }

            // 4. Reduce margin & padding of .portal-five-apps-bar (복음, 구원, 쿠팡, 네이버쇼핑 상하 여유 축소)
            string oldBarCss = @"        .portal-five-apps-bar {
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

            string newBarCss = @"        .portal-five-apps-bar {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            margin: 4px 0 6px 0;
            padding: 8px 6px;
            background: #ffffff;
            border-radius: 18px;
            border: 1.5px solid #e2e8f0;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
            box-sizing: border-box;
        }";

            text = text.Replace(oldBarCss, newBarCss);

            // Also reduce gap above 4 apps bar
            text = text.Replace("margin-top: 6px; font-size: 12.8px; font-weight: 850; color: #0284c7; letter-spacing: -0.35px; line-height: 1.35; word-break: keep-all; padding: 2px 1px;",
                                "margin-top: 2px; font-size: 12.8px; font-weight: 850; color: #0284c7; letter-spacing: -0.35px; line-height: 1.3; word-break: keep-all; padding: 1px 1px; margin-bottom: 2px;");

            File.WriteAllText(file, text, Encoding.UTF8);
            Console.WriteLine("Successfully compacted layout in " + file);
        }
    }
}
