using System;
using System.IO;
using System.Text;

class ApplyReal100pxAdmobBanner
{
    static void Main()
    {
        string filePath = @"assets\index.html";
        string content = File.ReadAllText(filePath, Encoding.UTF8);

        // 1. Update CSS for .bottom-admob-100-portal and .admob-pill-portal
        string oldCss = @"        /* 포털 홈 최하단 애드몹 100 고정 배너: [사용자 요청] 세로 폭 확대 적용 */
        .bottom-admob-100-portal {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 480px !important;
            min-height: 68px !important;
            height: auto !important;
            background: #ffffff !important;
            border-top: 1.5px solid #cbd5e1 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 6px 12px max(calc(var(--safe-bottom) + 6px), 20px) 12px !important;
            z-index: 9999 !important;
            box-sizing: border-box !important;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06) !important;
        }
        .admob-pill-portal {
            width: 100%;
            max-width: 360px;
            min-height: 56px;
            height: auto;
            background: #f8fafc;
            border: 1.5px solid #94a3b8;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            padding: 5px 10px;
            box-sizing: border-box;
        }";

        string newCss = @"        /* 포털 홈 최하단 애드몹 100 고정 배너: [사용자 요청] 실제 100px 규격 & 가장 점잖은 글 위주 광고 */
        .bottom-admob-100-portal {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 480px !important;
            min-height: 114px !important;
            height: auto !important;
            background: #ffffff !important;
            border-top: 1.5px solid #cbd5e1 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 7px 12px max(calc(var(--safe-bottom) + 6px), 10px) 12px !important;
            z-index: 9999 !important;
            box-sizing: border-box !important;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08) !important;
        }
        .admob-pill-portal {
            width: 100%;
            max-width: 340px;
            min-height: 100px;
            height: 100px;
            max-height: 100px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: stretch;
            padding: 8px 12px;
            box-sizing: border-box;
            text-align: left;
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }";

        if (content.Contains(oldCss))
        {
            content = content.Replace(oldCss, newCss);
            Console.WriteLine("CSS replaced (CRLF).");
        }
        else
        {
            string oldCssLf = oldCss.Replace("\r\n", "\n");
            string newCssLf = newCss.Replace("\r\n", "\n");
            if (content.Contains(oldCssLf))
            {
                content = content.Replace(oldCssLf, newCssLf);
                Console.WriteLine("CSS replaced (LF).");
            }
            else
            {
                Console.WriteLine("CSS pattern not found.");
            }
        }

        // 2. Update spacer height before the fixed AdMob bar
        string oldSpacer = @"        <!-- 🌟 [사용자 요청] 하단 고정 애드몹 100과 겹치지 않는 넉넉한 36px 안전 간격 스페이서 -->
        <div style=""height: 36px; flex-shrink: 0;""></div>";

        string newSpacer = @"        <!-- 🌟 [사용자 요청] 100px 대형 애드몹 배너와 겹치지 않는 130px 안전 간격 스페이서 -->
        <div style=""height: 130px; flex-shrink: 0;""></div>";

        if (content.Contains(oldSpacer))
        {
            content = content.Replace(oldSpacer, newSpacer);
            Console.WriteLine("Spacer replaced (CRLF).");
        }
        else
        {
            string oldSpacerLf = oldSpacer.Replace("\r\n", "\n");
            string newSpacerLf = newSpacer.Replace("\r\n", "\n");
            if (content.Contains(oldSpacerLf))
            {
                content = content.Replace(oldSpacerLf, newSpacerLf);
                Console.WriteLine("Spacer replaced (LF).");
            }
            else
            {
                Console.WriteLine("Spacer pattern not found.");
            }
        }

        // 3. Update HTML for .bottom-admob-100-portal with the realistic, dignified text-focused ad
        string oldHtml = @"    <!-- 포털 홈 최하단 애드몹 100 고정 배너: [사용자 요청] 정상적인 100px 대형 배너 규격 자리 확보 -->
    <div class=""bottom-admob-100-portal"">
        <div class=""admob-pill-portal"">
            <div class=""admob-badge-row"">
                <span class=""admob-badge-tag"">AD</span>
                <strong class=""admob-badge-title"">Google AdMob (300 x 100 / Large Banner)</strong>
            </div>
            <span class=""admob-badge-sub"">소상공인 · 교회 · 의원 · 예약앱 공식 스폰서 배너 슬롯</span>
        </div>
    </div>";

        string newHtml = @"    <!-- 포털 홈 최하단 애드몹 100 고정 배너: [사용자 요청] 실제 100px 규격의 가장 점잖은 글 위주 가상 애드몹 광고 -->
    <div class=""bottom-admob-100-portal"">
        <div class=""admob-pill-portal"">
            <!-- 1. 상단: AD 구글 스폰서 뱃지 & AdChoices -->
            <div style=""display: flex; align-items: center; justify-content: space-between; line-height: 1;"">
                <div style=""display: flex; align-items: center; gap: 5px;"">
                    <span style=""background: #0284c7; color: #ffffff; font-size: 9.5px; font-weight: 900; padding: 2px 5px; border-radius: 3px; letter-spacing: 0.3px;"">AD</span>
                    <span style=""font-size: 11px; font-weight: 700; color: #64748b;"">Google 스폰서 · 기독교 문서선교</span>
                </div>
                <span style=""font-size: 10px; color: #94a3b8; font-family: sans-serif;"" title=""Google 광고"">ⓘ AdChoices</span>
            </div>

            <!-- 2. 중앙: 점잖은 제목 & 은혜로운 한 줄 설명 (글 위주) -->
            <div style=""margin: 3px 0;"">
                <div style=""font-size: 13.5px; font-weight: 900; color: #0f172a; line-height: 1.35; letter-spacing: -0.3px; word-break: keep-all;"">
                    말씀 묵상과 영적 성장을 돕는 추천 신앙 도서전
                </div>
                <div style=""font-size: 11.5px; color: #475569; margin-top: 3px; line-height: 1.35; word-break: keep-all; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;"">
                    삶을 변화시키는 은혜로운 말씀 길잡이, 전국 기독교 서점에서 만나보세요.
                </div>
            </div>

            <!-- 3. 하단: 출처 및 단정한 바로가기 버튼 -->
            <div style=""display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed #e2e8f0; padding-top: 4px; line-height: 1;"">
                <span style=""font-size: 10.5px; color: #64748b; font-weight: 600;"">한국기독교출판협회 공익 캠페인</span>
                <span style=""font-size: 11px; font-weight: 800; color: #0284c7; display: flex; align-items: center; gap: 2px;"">
                    자세히 보기 <span style=""font-size: 9px;"">▶</span>
                </span>
            </div>
        </div>
    </div>";

        if (content.Contains(oldHtml))
        {
            content = content.Replace(oldHtml, newHtml);
            Console.WriteLine("HTML replaced (CRLF).");
        }
        else
        {
            string oldHtmlLf = oldHtml.Replace("\r\n", "\n");
            string newHtmlLf = newHtml.Replace("\r\n", "\n");
            if (content.Contains(oldHtmlLf))
            {
                content = content.Replace(oldHtmlLf, newHtmlLf);
                Console.WriteLine("HTML replaced (LF).");
            }
            else
            {
                Console.WriteLine("HTML pattern not found.");
            }
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
