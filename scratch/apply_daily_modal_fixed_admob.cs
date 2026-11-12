using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string filePath = @"assets/index.html";
        string html = File.ReadAllText(filePath, Encoding.UTF8);

        // Normalize newlines
        string htmlNorm = html.Replace("\r\n", "\n").Replace("\r", "\n");

        // 1. Add CSS for #dailyRepentVictoryModal
        string cssTarget = @"        #kkajitgeotModal.modal-overlay.show {
            display: flex !important;
        }";
        cssTarget = cssTarget.Replace("\r\n", "\n");

        string newCss = @"        #kkajitgeotModal.modal-overlay.show {
            display: flex !important;
        }

        #dailyRepentVictoryModal.modal-overlay {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            max-height: 100dvh !important;
            background: #ffffff !important;
            z-index: 99999 !important;
            display: none;
            flex-direction: column !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            backdrop-filter: none !important;
        }
        #dailyRepentVictoryModal.modal-overlay.show {
            display: flex !important;
        }";

        if (!htmlNorm.Contains(cssTarget))
        {
            Console.WriteLine("Error: cssTarget not found!");
            return;
        }

        htmlNorm = htmlNorm.Replace(cssTarget, newCss.Replace("\r\n", "\n"));

        // 2. Update dailyRepentVictoryModal body scroll and add bottom fixed AdMob
        string scrollTarget = @"            <!-- 본문 스크롤 영역 (사용자 요청: 박스 전혀 없이 시원한 텍스트 단락 구성, 약간 작은 글씨) -->
            <div style=""flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:22px 20px 90px 20px; display:flex; flex-direction:column; background:#ffffff;"">";
        scrollTarget = scrollTarget.Replace("\r\n", "\n");

        string newScroll = @"            <!-- 본문 스크롤 영역: flex: 1; min-height: 0; overflow-y: auto; (사용자 요청: 시원한 무한 스크롤 & 박스 없는 텍스트 단락) -->
            <div style=""flex:1; min-height:0; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:22px 20px 24px 20px; display:flex; flex-direction:column; background:#ffffff;"">";

        if (!htmlNorm.Contains(scrollTarget))
        {
            Console.WriteLine("Error: scrollTarget not found!");
            return;
        }

        htmlNorm = htmlNorm.Replace(scrollTarget, newScroll.Replace("\r\n", "\n"));

        // 3. Add bottom fixed AdMob inside dailyRepentVictoryModal (after the scrollable div, before the modal card closing div)
        string endTarget = @"                <!-- 하단 은혜의 확인 버튼 -->
                <div style=""display:flex; justify-content:center; margin-top:20px; padding-bottom:10px;"">
                    <button type=""button"" onclick=""closeDailyRepentVictoryModal()"" style=""height:48px; width:100%; max-width:320px; background:linear-gradient(135deg, #1d4ed8, #1e3a8a); color:#ffffff; border:none; border-radius:12px; font-size:16px; font-weight:950; cursor:pointer; box-shadow:0 3px 12px rgba(29,78,216,0.35);"">
                        🙏 아멘 · 은혜로 승리하기
                    </button>
                </div>

            </div>
        </div>
    </div>";
        endTarget = endTarget.Replace("\r\n", "\n");

        string newEnd = @"                <!-- 하단 은혜의 확인 버튼 -->
                <div style=""display:flex; justify-content:center; margin-top:20px; padding-bottom:14px;"">
                    <button type=""button"" onclick=""closeDailyRepentVictoryModal()"" style=""height:48px; width:100%; max-width:320px; background:linear-gradient(135deg, #1d4ed8, #1e3a8a); color:#ffffff; border:none; border-radius:12px; font-size:16px; font-weight:950; cursor:pointer; box-shadow:0 3px 12px rgba(29,78,216,0.35);"">
                        🙏 아멘 · 은혜로 승리하기
                    </button>
                </div>

            </div>

            <!-- 🌟 [사용자 요청] 하단 고정 애드몹 (소상공인·교회·의원 공식 스폰서 슬롯) -->
            <div style=""flex-shrink:0; width:100%; background:#0f172a; border-top:1.5px solid #1e293b; padding:10px 14px calc(env(safe-area-inset-bottom, 0px) + 8px) 14px; box-sizing:border-box; display:flex; align-items:center; justify-content:center; z-index:50;"">
                <div style=""width:100%; max-width:360px; background:rgba(30,41,59,0.85); border:1px solid rgba(56,189,248,0.3); border-radius:12px; padding:8px 12px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; box-shadow:0 2px 8px rgba(0,0,0,0.25);"">
                    <div style=""display:flex; align-items:center; gap:6px;"">
                        <span style=""background:#0284c7; color:#ffffff; font-size:10.5px; font-weight:950; padding:1px 6px; border-radius:4px;"">AD</span>
                        <strong style=""color:#ffffff; font-size:13.5px; font-weight:900;"">Google AdMob (320 x 100)</strong>
                    </div>
                    <span style=""font-size:11px; color:#94a3b8; font-weight:700;"">소상공인 · 교회 · 의원 · 예약앱 공식 스폰서 배너</span>
                </div>
            </div>

        </div>
    </div>";

        if (!htmlNorm.Contains(endTarget))
        {
            Console.WriteLine("Error: endTarget not found!");
            return;
        }

        htmlNorm = htmlNorm.Replace(endTarget, newEnd.Replace("\r\n", "\n"));

        // Write back as UTF8 with CRLF
        string finalHtml = htmlNorm.Replace("\n", "\r\n");
        File.WriteAllText(filePath, finalHtml, new UTF8Encoding(false));
        Console.WriteLine("Success! Updated assets/index.html with fixed AdMob & smooth scroll CSS");
    }
}
