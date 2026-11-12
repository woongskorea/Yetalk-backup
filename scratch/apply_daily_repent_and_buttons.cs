using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string filePath = @"assets/index.html";
        string html = File.ReadAllText(filePath, Encoding.UTF8);

        // 1. Replace best-book-portal-row
        string oldTarget = @"        <!-- 🌟 [사용자 요청] 역사상 가장 많이 읽힌 책 / 성경, 영원한 천국의 책 / 왜 예수님께서 나의 구원자 되시는가? 3줄 + 매일 열기 버튼 세로 확대 -->
        <article class=""best-book-portal-row"" onclick=""openKkajitgeotModal()"" title=""까짓것! 별거아냐 - 나의 신앙고백 &amp; 결단"">
            <div class=""best-book-text-col"">
                <div class=""best-book-line-1"">역사상 가장 많이 읽힌 책</div>
                <div class=""best-book-line-2"">성경, 영원한 천국의 책</div>
                <div class=""best-book-line-3"">왜 예수님께서 나의 구원자 되시는가?</div>
            </div>
            <button type=""button"" class=""btn-best-book-open"" onclick=""event.stopPropagation(); openKkajitgeotModal()"" style=""background:linear-gradient(135deg, #dc2626, #b91c1c); box-shadow:0 3px 10px rgba(220,38,38,0.4); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; padding:8px 12px; min-width:85px; cursor:pointer;"">
                <span style=""font-size:14.5px; font-weight:950; letter-spacing:-0.2px;"">까짓것 ▶</span>
                <span style=""font-size:11.5px; font-weight:800; opacity:0.95; letter-spacing:-0.2px;"">별거아냐</span>
            </button>
        </article>";

        string newButtonRow = @"        <!-- 🌟 [사용자 요청] 역사상 가장 많이 읽힌 책 / 성경, 영원한 천국의 책 + [매일회개/영적승리] & [까짓것/별거아냐] 굵은 버튼 2개 + 하단 단독행: 성경은 예수님께서 구원자이심을 나타내시며 오직 예수님을 통해 구원받습니다. -->
        <article class=""best-book-portal-container"" style=""padding: 4px 2px 6px 2px; width: 100%; box-sizing: border-box;"">
            <div style=""display: flex; align-items: center; justify-content: space-between; gap: 8px;"">
                <!-- 좌측 2줄 텍스트 -->
                <div class=""best-book-text-col"" style=""flex: 1; min-width: 0;"">
                    <div class=""best-book-line-1"" style=""font-size: 14.5px; font-weight: 850; color: #1e293b; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"">
                        역사상 가장 많이 읽힌 책
                    </div>
                    <div class=""best-book-line-2"" style=""font-size: 14px; font-weight: 950; color: #dc2626; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;"">
                        성경, 영원한 천국의 책
                    </div>
                </div>
                <!-- 우측 굵은 버튼 2개 나란히 배치 -->
                <div style=""display: flex; align-items: center; gap: 5px; flex-shrink: 0;"">
                    <!-- 1) 매일회개 / 영적승리 버튼 -->
                    <button type=""button"" onclick=""openDailyRepentVictoryModal()"" style=""background: linear-gradient(135deg, #1d4ed8, #1e3a8a); color: #ffffff; border: none; border-radius: 11px; min-width: 64px; padding: 7px 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; cursor: pointer; box-shadow: 0 3px 8px rgba(29,78,216,0.35); transition: transform 0.12s ease;"" title=""매일회개 &amp; 영적승리 기도문"">
                        <span style=""font-size: 13px; font-weight: 950; letter-spacing: -0.3px; line-height: 1.15;"">매일회개</span>
                        <span style=""font-size: 11px; font-weight: 800; opacity: 0.95; letter-spacing: -0.3px; line-height: 1.15;"">영적승리</span>
                    </button>
                    <!-- 2) 까짓것 / 별거아냐 버튼 (우측 삼각표 제거, 가로폭 슬림화) -->
                    <button type=""button"" onclick=""openKkajitgeotModal()"" style=""background: linear-gradient(135deg, #dc2626, #b91c1c); color: #ffffff; border: none; border-radius: 11px; min-width: 64px; padding: 7px 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; cursor: pointer; box-shadow: 0 3px 8px rgba(220,38,38,0.35); transition: transform 0.12s ease;"" title=""까짓것! 별거아냐 - 나의 신앙고백 &amp; 결단"">
                        <span style=""font-size: 13px; font-weight: 950; letter-spacing: -0.3px; line-height: 1.15;"">까짓것</span>
                        <span style=""font-size: 11px; font-weight: 800; opacity: 0.95; letter-spacing: -0.3px; line-height: 1.15;"">별거아냐</span>
                    </button>
                </div>
            </div>
            <!-- 하단으로 한줄 내려서 우측 굵은 버튼 2개와 안 부딪치도록 배치 -->
            <div style=""margin-top: 6px; font-size: 12.8px; font-weight: 850; color: #0284c7; letter-spacing: -0.35px; line-height: 1.35; word-break: keep-all; padding: 2px 1px;"">
                성경은 예수님께서 구원자이심을 나타내시며 오직 예수님을 통해 구원받습니다.
            </div>
        </article>";

        // Normalize newlines for matching
        oldTarget = oldTarget.Replace("\r\n", "\n").Replace("\r", "\n");
        string htmlNorm = html.Replace("\r\n", "\n").Replace("\r", "\n");

        if (!htmlNorm.Contains(oldTarget))
        {
            Console.WriteLine("Error: oldTarget not found!");
            return;
        }

        htmlNorm = htmlNorm.Replace(oldTarget, newButtonRow.Replace("\r\n", "\n"));

        // 2. Add JS functions
        string jsTarget = @"    // 🌟 [사용자 요청] '까짓것' 모달 열기 및 개인 고백 & 회개기도 불러오기
    function openKkajitgeotModal() {";
        jsTarget = jsTarget.Replace("\r\n", "\n");

        string newJs = @"    // 🌟 [사용자 요청] '매일회개 & 영적승리' 기도문 모달 열기/닫기
    function openDailyRepentVictoryModal() {
        const modal = document.getElementById(""dailyRepentVictoryModal"");
        if (!modal) return;
        modal.classList.add(""show"");
        modal.style.setProperty(""display"", ""flex"", ""important"");
    }

    function closeDailyRepentVictoryModal() {
        const modal = document.getElementById(""dailyRepentVictoryModal"");
        if (!modal) return;
        modal.classList.remove(""show"");
        modal.style.setProperty(""display"", ""none"", ""important"");
    }

    // 🌟 [사용자 요청] '까짓것' 모달 열기 및 개인 고백 & 회개기도 불러오기
    function openKkajitgeotModal() {";

        if (!htmlNorm.Contains(jsTarget))
        {
            Console.WriteLine("Error: jsTarget not found!");
            return;
        }

        htmlNorm = htmlNorm.Replace(jsTarget, newJs.Replace("\r\n", "\n"));

        // 3. Add dailyRepentVictoryModal before </body>
        string modalHtml = @"    <!-- 🌟 [사용자 요청] 매일 회개 & 영적 승리 기도문 모달 (박스 없이 시원한 텍스트 단락 구성) -->
    <div class=""modal-overlay"" id=""dailyRepentVictoryModal"" style=""position:fixed !important; inset:0 !important; width:100vw !important; height:100vh !important; max-width:100vw !important; max-height:100vh !important; background:#ffffff !important; z-index:99999 !important; display:none; flex-direction:column !important; padding:0 !important; margin:0 !important; box-sizing:border-box !important; overflow:hidden !important; backdrop-filter:none !important;"">
        <div style=""width:100%; height:100%; max-width:680px; margin:0 auto; background:#ffffff; display:flex; flex-direction:column; overflow:hidden; box-sizing:border-box;"">
            
            <!-- 상단 고정 헤더: 상태표시줄/노치 겹침 방지 여백 -->
            <div style=""padding-top: max(28px, calc(env(safe-area-inset-top) + 12px)); padding-bottom: 12px; padding-left: 14px; padding-right: 14px; background:#ffffff; border-bottom:1.5px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; box-sizing:border-box;"">
                <button type=""button"" onclick=""closeDailyRepentVictoryModal()"" style=""background:#f1f5f9; border:1px solid #cbd5e1; border-radius:20px; color:#1e293b; font-size:15px; font-weight:950; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:9px 16px; min-height:42px; white-space:nowrap; box-shadow:0 1px 4px rgba(0,0,0,0.08); touch-action:manipulation;"">
                    <span style=""font-size:16px;"">←</span> <span>뒤로</span>
                </button>
                <div style=""font-size:16px; font-weight:900; color:#1e3a8a;"">
                    매일회개 &amp; 영적승리
                </div>
                <button type=""button"" onclick=""closeDailyRepentVictoryModal()"" style=""width:42px; height:42px; border-radius:50%; background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; font-size:20px; font-weight:950; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 4px rgba(0,0,0,0.08); touch-action:manipulation;"" title=""닫기"">✕</button>
            </div>

            <!-- 본문 스크롤 영역 (사용자 요청: 박스 전혀 없이 시원한 텍스트 단락 구성, 약간 작은 글씨) -->
            <div style=""flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:22px 20px 90px 20px; display:flex; flex-direction:column; background:#ffffff;"">

                <!-- 대제목 -->
                <div style=""text-align:center; padding-bottom:16px; border-bottom:2px solid #e2e8f0; margin-bottom:22px;"">
                    <div style=""font-size:22px; font-weight:950; color:#0f172a; letter-spacing:-0.5px; line-height:1.3;"">
                        🔥 매일 회개 &amp; 영적 승리 기도문
                    </div>
                    <div style=""font-size:14px; font-weight:850; color:#2563eb; margin-top:5px;"">
                        조상의 영적 대물림 끊기 · 날마다 발을 씻는 통회자복 · 성령의 권세 선포
                    </div>
                </div>

                <!-- 기도문 본문: 박스 없이 자연스러운 단락 흐름 -->
                <div style=""font-size:14.5px; font-weight:800; color:#1e293b; line-height:1.9; word-break:keep-all;"">
                    <p style=""margin:0 0 18px 0;"">
                        만군의 여호와 하나님, 온 우주 만물의 주관자이시며 나의 참된 아버지이신 주님을 찬양합니다. 하늘과 땅의 모든 권세를 가지신 우리 주 예수 그리스도께서 십자가 위에서 다 이루었다 선포하시며 모든 어둠의 정사와 권세를 완전히 박살 내셨음을 믿습니다. 오직 주님만이 나의 유일한 구주이시며, 내 영혼과 가정, 일터의 절대적인 인도자되심을 선포합니다. 이 시간 예수 우리 주님의 이름으로 보좌 앞에 온전한 믿음으로 나아갑니다.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        주님, 오늘 이 시간 우리 가문의 오랜 역사속에 모든 허물과 죄악들을 주님의 거룩한 빛 앞에 온전히 내려놓습니다. 성경 말씀에 기록된 대로 조상의 죄악과 영적 대물림이 삼사대까지 미칠 수 있음을 기억하며, 저희가 비록 우리 조상들이 행했던 모든 세세한 허물과 어둠의 일들을 다 기억하지 못하고 잘 알지 못할지라도, 영원히 죽지않는 악한 마귀의 끈질긴 미혹속에서 그 모든 뿌리 깊은 대물림과 죄로 얽매인 줄들을 주님 앞에 회개하며 끊어졌음을 선포합니다.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        비록 조상의 죄가 나의 구원과는 관계없지만 그 악한 뿌리들을 끊어야 더욱 강한 하나님의 군사로서, 하나님께서 기뻐하시는 삶을 승리하며 살 수 있는 영적인 존재임을 고백합니다. 죄의 뿌리가 얼마나 지독한지 철저히 기억하여 더욱 성장하는 은혜를 누리도록 기도하며 우리 가문의 가장 깊은 곳에 숨어 있는 영적 찌꺼기와 드러나지 않은 모든 악의 쓴 뿌리까지 오직 주의 성령의 불로 완전히 태워 씻어내어 주옵소서.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        조상 대대로 하나님을 온전히 경외하지 못하고 행했던 각양각색의 미신과 우상 숭배, 터를 다지며 섬겼던 더러운 잡신들과의 모든 숨은 영적 계약, 그리고 가문 가운데 흘러내려온 술의 중독과 방탕함, 패가망신을 부르는 도박의 영, 나태함과 게으름으로 삶을 허비했던 완악함과, 그로 인해 자손들에게 대물림되어 삼사대에 걸쳐 우리를 옭아매었던 깊은 상처와 분노, 거절감, 그리고 밤낮으로 우리를 엄습하던 두려움과 불안의 영까지, 이 모든 숨은 찌꺼기와 가문의 악한 유산을 주님의 보혈 앞에 낱낱이 파헤치고 자백하오니 지금 이 시간 완전히 끊어내어 주옵소서.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        주님, 그러나 조상들의 이러한 연약함과 죄악보다, 사실은 내가 하나님의 은혜를 수없이 받고도 이를 잊어버리고, 나의 욕심을 추구하며 작은 죄, 큰 죄를 지으며 살아왔음을 이 시간 통회하며 회개합니다. 주님의 말씀대로 살지 못하고 내 안의 탐욕과 정욕을 채우기에 급급했으며, 입술로 지은 수많은 교만과 미움과 판단의 죄, 하나님보다 돈과 세상의 안락과 성공을 더 사랑했던 우상숭배의 죄, 주어진 시간과 재능을 게으름으로 허비하고 영적으로 나태했던 죄, 이웃을 온전히 사랑하지 못하고 내 중심적으로 살았던 모든 허물과 은밀한 죄들을 주님 앞에 낱낱이 자백하오니 이 시간 용서하여 주옵소서.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        어찌 이 땅은 영원한 본향인 천국에 가는 임시 거할 처소이며, 떠나야할 정류장에 불과한데, 이 곳에 마음을 뺏겨 안주하며 물질과 명예와 정욕과 교만과 자기의를 따라 살며 진짜 목적지를 그리워하지 않고 목적대로 살아가지 못하였음을 회개합니다.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        예수님께서 12제자에게조차 이미 몸을 씻어 깨끗게 된 자라도 예수님께 발씻음을 받지않으면 나와 상관이 없으리라고 하신 무서운 말씀안에 예수님께 날마다 회개하며 발을 씻는 것이 우리 가족 모두에게 얼마나 중요한 것인가 다시금 생각합니다. 예수님을 잘 믿다가도 배도한 자들이 얼마나 많은지요. 저희가 죽을 때까지 깨어 기도하여 겸손히 낮아져서 혹시나 방심하여 지은 작은 죄가 습관이 되고 무덤덤해지며 이로 인해 큰 죄로 발전하여 결국 큰 죄가 사망에 이른다는 성경의 경고의 말씀을 새기고 방심하지 않고 깨어 기도하겠습니다.
                    </p>

                    <p style=""margin:0 0 18px 0; color:#1d4ed8; font-weight:900;"">
                        항상 기뻐하라. 쉬지 말고 기도하라. 범사에 감사하라는 말씀으로 주님 앞에 더 가까이 더 가까이 나아가겠습니다.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        주여! 어떠한 환경 가운데에 있을지라도 성령님께서 연약한 나를 훈련시키고 강하게 성장시켜 감에 감사하며 모든 어려움 속에서도 항상 감사함으로 능히 이기며 성장하며 천국의 상급을 쌓아가는 성도들 되게 하시옵소서.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        이렇듯 죄로 인해 죽어 마땅한 나를 구원한 십자가의 피 흘림으로 구원하여 주시며, 오직 십자가에서 흘리신 예수 그리스도의 보혈만이 이 모든 저주의 뿌리를 단번에 끊을 수 있음을 믿사오니, 지금 이 시간 십자가의 보혈을 우리 가문의 뿌리와 내 심령의 가장 깊은 곳까지 덮습니다. 과거의 상처와 아픔으로 찢긴 영혼마다 주의 보혈을 바르노니, 삼사대로 이어지던 모든 악독과 율법의 저주는 예수 그리스도의 이름으로 완전히 끊어졌음을 선포합니다.
                    </p>

                    <p style=""margin:0 0 18px 0; color:#059669; font-weight:900;"">
                        성령님으로 항상 내 안에 계심을 알고 인도하시는 대로 순종하며 나아가겠습니다.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        주님, 이제는 오직 성령의 능력과 권세, 그리고 성전의 불을 절대 꺼지게 하지 말라는 말씀대로 성령의 불이 없이는 단 하루도 살 수 없음을 고백합니다. 내 힘과 의지로는 이 치열한 영적 전쟁에서 이길 수 없사오니, 내 영혼과 심령 속에 성령의 불을 맹렬히 부어 주옵소서. 성령의 권세로 무장되어 철저한 성령의 사람으로 거듭나게 하시고, 내 안에 도사린 모든 육신의 정욕과 어둠의 세력을 성령의 불로 완전히 태워 소멸하여 주옵소서. 성령의 검인 하나님의 말씀과 성령의 폭발적인 능력으로 원수 마귀의 머리를 완전히 박살 내며, 언제나 성령의 인도하심 따라 거침없이 전진하고 승리하는 영적 용사로 세워 주옵소서.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        이제 만왕의 왕이신 예수 그리스도의 권세와 성령의 능력을 힘입어 명령한다. 내 영혼과 가정, 생업을 대적하며 가문의 틈을 타 역사하던 모든 더러운 영들과 어둠의 세력들은 들을지어다. 가문을 무너뜨리려던 미신과 우상의 영, 삶을 황폐하게 만들던 술과 도박, 게임, 오락의 중독 영, 게으름과 무기력으로 기도를 막아서던 나태의 영, 마음을 갉아먹던 상처와 분노의 영, 그리고 두려움과 염려의 영아.
                    </p>

                    <p style=""margin:0 0 18px 0; color:#dc2626; font-weight:900;"">
                        나사렛 예수 그리스도의 이름과 성령의 불로 명하노니 지금 당장 이 시간 우리의 심령에서, 우리 가정에서, 우리의 일터와 삶의 지경에서 숨어 있던 찌꺼기까지 단 한 조각도 남김없이 완전히 떠나갈지어다. 파쇄될지어다. 더 이상 우리의 과거와 가문의 틈을 빌미 삼아 역사하지 못할지니라. 원수 마귀야 너의 모든 권세는 성령의 불 앞에 완전히 무너졌고 너는 영원히 지옥의 불못으로 쫓겨날지어다. 예수 그리스도의 보혈과 성령의 권세 앞에 무릎을 꿇고 지금 즉시 떠나갈지어다.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        주님, 이 땅은 우리가 편안하게 먹고 쉬며 안주하는 곳이 아니라 눈에 보이지 않는 치열한 영적 전쟁터임을 깨닫습니다. 영적인 잠에서 완전히 깨어나게 하시고 방심하거나 안일함에 빠지지 않게 하시며 날마다 성령 안에서 깨어 기도하며 원수 마귀의 모든 간계를 대적하여 싸워 이기게 하옵소서. 사방의 막힌 담을 터뜨리시는 파레츠 돌파의 은혜와 성령의 능력으로 내 앞의 모든 장벽을 돌파하게 하시고, 어떠한 시련에도 낙심하고 꺾이지 않으며 마침내 싸워 이겨서 승리하는 참된 성령의 사람이 되게 하옵소서.
                    </p>

                    <p style=""margin:0 0 18px 0;"">
                        원수가 떠나간 그 빈자리에 오직 성령의 불과 생수로 가득 채워 주사 날마다 거룩한 열정과 부흥의 발걸음으로 거침없이 전진하게 하소서. 하나님 감사합니다. 하나님을 소망하며 영광돌리며 더 이상 어린아이가 아니라 장성한 믿음의 분량을 소유하며 하나님 나라의 군사요 예수 그리스도의 증인으로 살겠습니다. 발을 씻는 마음으로 매일 기도하겠습니다. 이 기도를 할 때마다 나의 영이 정결해지고 주님과 가까워지게 하시니 감사합니다. 이 모든 말씀을 우리를 죄와 사망, 그리고 모든 어둠의 권세에서 완전히 건져내신 우리 구주 예수 그리스도의 이름으로 권세 있게 간절히 기도드리옵나이다. 아멘.
                    </p>
                </div>

                <!-- 하단 은혜의 확인 버튼 -->
                <div style=""display:flex; justify-content:center; margin-top:20px; padding-bottom:10px;"">
                    <button type=""button"" onclick=""closeDailyRepentVictoryModal()"" style=""height:48px; width:100%; max-width:320px; background:linear-gradient(135deg, #1d4ed8, #1e3a8a); color:#ffffff; border:none; border-radius:12px; font-size:16px; font-weight:950; cursor:pointer; box-shadow:0 3px 12px rgba(29,78,216,0.35);"">
                        🙏 아멘 · 은혜로 승리하기
                    </button>
                </div>

            </div>
        </div>
    </div>
</body>";

        string bodyTarget = "</body>";
        if (!htmlNorm.Contains(bodyTarget))
        {
            Console.WriteLine("Error: </body> not found!");
            return;
        }

        htmlNorm = htmlNorm.Replace(bodyTarget, modalHtml.Replace("\r\n", "\n"));

        // Write back as UTF8 with CRLF
        string finalHtml = htmlNorm.Replace("\n", "\r\n");
        File.WriteAllText(filePath, finalHtml, new UTF8Encoding(false));
        Console.WriteLine("Success! Updated assets/index.html");
    }
}
