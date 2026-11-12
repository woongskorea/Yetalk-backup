using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        // 1. Update MainActivity.kt
        string mainKt = @"app\src\main\java\com\example\yetalk\MainActivity.kt";
        if (File.Exists(mainKt))
        {
            string ktText = File.ReadAllText(mainKt, Encoding.UTF8);
            if (ktText.Contains("https://shopping.naver.com"))
            {
                ktText = ktText.Replace("https://shopping.naver.com", "https://m.shopping.naver.com");
                File.WriteAllText(mainKt, ktText, Encoding.UTF8);
                Console.WriteLine("Updated MainActivity.kt Naver Shopping URL to mobile.");
            }
        }

        // 2. Update HTML files
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

            // Fix Naver Shopping in JS openFiveApp
            text = text.Replace("const naverShoppingUrl = 'https://shopping.naver.com';", "const naverShoppingUrl = 'https://m.shopping.naver.com';");
            text = text.Replace("window.open(naverShoppingUrl, '_blank');\r\n        }", @"try { window.location.href = naverShoppingUrl; } catch(e) { window.open(naverShoppingUrl, '_blank'); }
        }");

            // Update modal markup: wider screen utilization, reordered tabs (role at end), bigger buttons
            string oldModalBlockStart = "<!-- 🌟 [사용자 요청] 예톡 간단 사용안내 & 은혜로운 활용법 모달 -->";
            string oldModalBlockEnd = "<!-- 🌟 [사용자 요청] 대표 식사 기도자 뽑기 모달";
            int mStart = text.IndexOf(oldModalBlockStart);
            int mEnd = text.IndexOf(oldModalBlockEnd, mStart != -1 ? mStart : 0);

            if (mStart != -1 && mEnd != -1)
            {
                string newModalHtml = @"<!-- 🌟 [사용자 요청] 예톡 간단 사용안내 & 은혜로운 활용법 모달 (화면 전체 활용, 직분별 맞춤앱 맨뒤로, 글씨 크게 2페이지 스크롤, 가로메뉴 자동스크롤) -->
    <div class=""modal-overlay"" id=""modalYetalkGuide"" style=""display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.85); z-index:99999; justify-content:center; align-items:center; padding:8px; box-sizing:border-box;"" onclick=""closeYetalkGuideModal()"">
        <div style=""background:#ffffff; width:98%; max-width:540px; height:94vh; max-height:94vh; border-radius:22px; box-shadow:0 25px 60px rgba(0,0,0,0.5); overflow:hidden; display:flex; flex-direction:column; animation:fadeInUpModal 0.25s ease-out;"" onclick=""event.stopPropagation()"">
            <!-- 헤더 -->
            <div style=""display:flex; justify-content:space-between; align-items:center; padding:15px 18px; background:linear-gradient(135deg, #059669 0%, #047857 100%); color:#ffffff; flex-shrink:0; box-shadow:0 2px 8px rgba(5,150,105,0.25);"">
                <div style=""display:flex; align-items:center; gap:9px;"">
                    <span style=""font-size:24px;"">💡</span>
                    <div>
                        <div style=""font-size:18px; font-weight:950; color:#ffffff; letter-spacing:-0.3px;"">예톡 간단 사용안내</div>
                        <div style=""font-size:12.5px; color:#d1fae5; font-weight:750;"">예수님과 동행하는 은혜로운 100% 활용법</div>
                    </div>
                </div>
                <button type=""button"" onclick=""closeYetalkGuideModal()"" style=""background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.4); color:#ffffff; font-size:17px; font-weight:900; width:34px; height:34px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center;"" title=""닫기"">✕</button>
            </div>

            <!-- 소분류 탭 메뉴 (가로 스크롤, 크고 뚜렷한 버튼, 직분별 맞춤앱 맨뒤 배치) -->
            <div id=""yetalkGuideTabsContainer"" style=""display:flex; gap:8px; overflow-x:auto; padding:12px 14px; background:#f1f5f9; border-bottom:1.5px solid #cbd5e1; -webkit-overflow-scrolling:touch; flex-shrink:0; scroll-behavior:smooth;"">
                <button type=""button"" id=""guideTab_intro"" onclick=""switchYetalkGuideTab('intro')"" class=""yetalk-guide-tab-btn active"" style=""white-space:nowrap; padding:8px 15px; border-radius:20px; font-size:13.5px; font-weight:950; cursor:pointer; border:1.5px solid #059669; background:#059669; color:#ffffff; box-shadow:0 2px 6px rgba(5,150,105,0.3);"">🌿 시작과 전도</button>
                <button type=""button"" id=""guideTab_word"" onclick=""switchYetalkGuideTab('word')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:8px 15px; border-radius:20px; font-size:13.5px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#334155;"">📖 이 시간의 말씀</button>
                <button type=""button"" id=""guideTab_bible"" onclick=""switchYetalkGuideTab('bible')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:8px 15px; border-radius:20px; font-size:13.5px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#334155;"">🍚 삼시세끼 성경</button>
                <button type=""button"" id=""guideTab_prayer"" onclick=""switchYetalkGuideTab('prayer')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:8px 15px; border-radius:20px; font-size:13.5px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#334155;"">🙏 회개 & 식사기도</button>
                <button type=""button"" id=""guideTab_church"" onclick=""switchYetalkGuideTab('church')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:8px 15px; border-radius:20px; font-size:13.5px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#334155;"">🏛️ 무료 교회홈 & 배송</button>
                <button type=""button"" id=""guideTab_tv"" onclick=""switchYetalkGuideTab('tv')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:8px 15px; border-radius:20px; font-size:13.5px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#334155;"">📺 예톡TV 꿀팁</button>
                <button type=""button"" id=""guideTab_role"" onclick=""switchYetalkGuideTab('role')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:8px 15px; border-radius:20px; font-size:13.5px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#334155;"">👥 직분별 맞춤앱</button>
            </div>

            <!-- 바디 안내 내용 (글자 크게 16px 확대, 2페이지 분량 시원한 스크롤) -->
            <div id=""yetalkGuideBodyContent"" style=""padding:20px 18px; overflow-y:auto; -webkit-overflow-scrolling:touch; flex:1; font-size:16px; line-height:1.85; color:#1e293b; background:#f8fafc;"">
                <!-- JS에서 선택된 탭 내용 렌더링 -->
            </div>

            <!-- 하단 닫기 바 -->
            <div style=""padding:12px 18px; background:#ffffff; border-top:1.5px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;"">
                <span style=""font-size:12.5px; color:#059669; font-weight:850;"">🌿 작은교회 예수동행 말씀 & 기도 플랫폼</span>
                <button type=""button"" onclick=""closeYetalkGuideModal()"" style=""padding:8px 22px; background:linear-gradient(135deg, #059669 0%, #047857 100%); color:#ffffff; font-size:14px; font-weight:950; border:none; border-radius:12px; cursor:pointer; box-shadow:0 2px 6px rgba(5,150,105,0.25);"">확인 닫기</button>
            </div>
        </div>
    </div>

";
                text = text.Substring(0, mStart) + newModalHtml + text.Substring(mEnd);
            }

            // Update JS guide data and switchYetalkGuideTab with auto horizontal scroll and larger typography
            string oldJsGuideStart = "const yetalkGuideData = {";
            string oldJsGuideEnd = "function openMealPrayerLotteryModal()";
            int jsStart = text.IndexOf(oldJsGuideStart);
            int jsEnd = text.IndexOf(oldJsGuideEnd, jsStart != -1 ? jsStart : 0);

            if (jsStart != -1 && jsEnd != -1)
            {
                string newJsGuide = @"const yetalkGuideData = {
        intro: `
            <div style=""display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:12px; border-bottom:2px solid #bbf7d0;"">
                <span style=""font-size:28px;"">🌿</span>
                <div>
                    <strong style=""font-size:18.5px; color:#065f46; letter-spacing:-0.3px;"">예톡의 탄생 비화 & 복음 전도의 사명</strong>
                    <div style=""font-size:13px; color:#059669; font-weight:750;"">예수님과 함께 걸어가는 은혜의 길</div>
                </div>
            </div>

            <div style=""background:#ecfdf5; border-left:5px solid #059669; padding:16px 16px; border-radius:0 14px 14px 0; margin-bottom:16px; box-shadow:0 2px 6px rgba(5,150,105,0.08);"">
                <div style=""font-weight:950; color:#047857; font-size:16px; margin-bottom:6px;"">✨ 예수님과 언덕길을 걸으며...</div>
                <div style=""font-size:15.5px; color:#065f46; line-height:1.85;"">
                    “예수님과 다정하게 손을 잡고 언덕길을 걸으며 소박하게 대화(토크)하며, 저 언덕 위 작은 교회로 함께 걸어가는 은혜로운 모습을 바라보고 기도하며 만든 앱이 바로 <strong>예톡(Yetalk)</strong>입니다.”
                </div>
            </div>

            <div style=""display:flex; flex-direction:column; gap:14px; font-size:15.5px; color:#334155; line-height:1.85;"">
                <div style=""background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:14px 16px;"">
                    <strong style=""color:#059669; font-size:16.5px;"">🕊️ 1. 주님께 항상 깨어있는 성도</strong><br>
                    바쁜 세상 속에서도 성도님들이 말씀과 기도로 어찌하든지 늘 주님께 깨어있고, 교회와 성도가 하나로 따뜻하게 연결되도록 돕는 것이 예톡의 가장 큰 목적입니다.
                </div>

                <div style=""background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:14px; padding:14px 16px;"">
                    <strong style=""color:#2563eb; font-size:16.5px;"">💌 2. 예톡을 전하는 것이 곧 '전도'입니다!</strong><br>
                    예톡 안에는 은혜로운 복음과 성경 말씀, 전도 메시지가 자동으로 담겨 전달됩니다. 따라서 주변 성도님, 믿지 않는 가족, 이웃에게 예톡을 알려주고 공유하는 것 자체가 귀하고 강력한 <strong>복음 전도</strong>가 됩니다!
                </div>

                <div style=""background:#fffbeb; border:1.5px solid #fde68a; border-radius:14px; padding:14px 16px;"">
                    <strong style=""color:#d97706; font-size:16.5px;"">❤️ 3. 주님의 얼굴을 기쁘시게</strong><br>
                    성도도 교회도 모두 유익한 예톡을 많이 사랑해 주셔서, 우리 모두가 복음 전파의 귀한 도구로 쓰임받으며 주님의 얼굴을 기쁘시게 해드리기를 소망합니다.
                </div>
            </div>
        `,

        word: `
            <div style=""display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:12px; border-bottom:2px solid #bbf7d0;"">
                <span style=""font-size:28px;"">📖</span>
                <div>
                    <strong style=""font-size:18.5px; color:#065f46; letter-spacing:-0.3px;"">이 시간의 말씀 활용법</strong>
                    <div style=""font-size:13px; color:#059669; font-weight:750;"">하루 8번, 3시간마다 채워지는 하늘 양식</div>
                </div>
            </div>

            <div style=""display:flex; flex-direction:column; gap:14px; font-size:15.5px; line-height:1.85;"">
                <div style=""background:#f0fdf4; border:1.5px solid #86efac; border-radius:14px; padding:16px;"">
                    <strong style=""color:#166534; font-size:16.5px;"">⏰ 3시간마다 자동으로 바뀌는 은혜</strong><br>
                    아침부터 밤까지 일상을 보내는 성도님들이 영적으로 지치지 않도록, 3시간마다 하루 일과에 맞춘 새로운 묵상 말씀이 자동으로 바뀝니다.
                </div>

                <div style=""background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px;"">
                    <strong style=""color:#0f172a; font-size:16.5px;"">👆 말씀 구절 터치 시 '간단 예배 & 성경 본문' 직행</strong><br>
                    화면에 보이는 말씀 구절(예: <strong>이사야 40:31</strong>)을 손가락으로 톡 누르시면, 해당 구절이 속한 <strong>성경 전체 장</strong>과 함께 <strong>은혜로운 간단 예배</strong>로 즉시 이동합니다! 깊이 있는 묵상을 언제든 바로 이어가실 수 있습니다.
                </div>
            </div>
        `,

        bible: `
            <div style=""display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:12px; border-bottom:2px solid #fecaca;"">
                <span style=""font-size:28px;"">🍚</span>
                <div>
                    <strong style=""font-size:18.5px; color:#991b1b; letter-spacing:-0.3px;"">삼시세끼 성경 100% 통독법</strong>
                    <div style=""font-size:13px; color:#b91c1c; font-weight:750;"">성경 어디 읽을까 고민을 완전히 해결!</div>
                </div>
            </div>

            <div style=""display:flex; flex-direction:column; gap:14px; font-size:15.5px; line-height:1.85;"">
                <div style=""background:#fff1f2; border-left:5px solid #f43f5e; padding:16px; border-radius:0 14px 14px 0;"">
                    <strong style=""color:#be123c; font-size:16.5px;"">🔴 1. 빨간색 고정으로 끝까지 통독!</strong><br>
                    성경을 여기 읽다가 저기 읽다가 어디 읽을까 고민될 때가 많으셨죠? 창세기든 원하는 성경 한 권을 <strong>빨간색</strong>으로 고정해 두세요!
                </div>

                <div style=""background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px;"">
                    <strong style=""color:#0f172a; font-size:16.5px;"">🍚 2. 아침 1장, 점심 1장, 저녁 1장!</strong><br>
                    삼시세끼 식사하듯 매일 3장씩, 다음 날도 4장부터 끊김 없이 이어서 읽다 보면 누구나 성경 66권을 끝까지 완독할 수 있습니다.
                </div>

                <div style=""background:#f0fdf4; border:1.5px solid #86efac; border-radius:14px; padding:16px;"">
                    <strong style=""color:#166534; font-size:16.5px;"">🖍️ 3. 예배 시 본문 찾기 & 형광펜 기능</strong><br>
                    주일 예배 때 설교 본문 찾기가 너무나 빠르고 편리합니다. 감동받은 구절을 톡 누르면 예쁜 형광펜 색깔이 칠해집니다. 최고의 성경앱이자 개인 신앙앱입니다.
                </div>
            </div>
        `,

        prayer: `
            <div style=""display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:12px; border-bottom:2px solid #fde68a;"">
                <span style=""font-size:28px;"">🙏</span>
                <div>
                    <strong style=""font-size:18.5px; color:#92400e; letter-spacing:-0.3px;"">회개기도 & 대표 식사기도 투표</strong>
                    <div style=""font-size:13px; color:#b45309; font-weight:750;"">영적 청결과 화목한 식탁 교제</div>
                </div>
            </div>

            <div style=""display:flex; flex-direction:column; gap:14px; font-size:15.5px; line-height:1.85;"">
                <div style=""background:#ecfdf5; border:1.5px solid #86efac; border-radius:14px; padding:16px;"">
                    <strong style=""color:#166534; font-size:16.5px;"">✨ 1. 매일 회개기도 (영적 청결과 강건함)</strong><br>
                    매일 하루 여러 번 진실한 회개기도를 드리시면 영적으로 깨끗해지고 흔들리지 않는 강력한 믿음의 힘을 얻습니다.
                </div>

                <div style=""background:#fefce8; border:1.5px solid #fde047; border-radius:14px; padding:16px;"">
                    <strong style=""color:#854d0e; font-size:16.5px;"">🍽️ 2. 재미있는 대표식사기도자 투표!</strong><br>
                    식사 모임이나 구역 식구들이 모였을 때, 참여 인원수를 정하고 각자 번호를 마음에 품은 뒤 투표 버튼을 누르면 당첨된 분이 기쁨으로 대표기도를 섬기는 은혜롭고 유쾌한 기능입니다! (모임에서 한 명 뽑을 때 투표로도 좋습니다.)
                </div>

                <div style=""background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px;"">
                    <strong style=""color:#0f172a; font-size:16.5px;"">📜 3. 상황별 맞춤 식사기도문 3가지</strong><br>
                    기도가 부담되지 않도록 <strong>[가족식사], [모임식사], [이웃방문]</strong> 3가지 상황별 감동적인 기도문을 기본 제공합니다. (기본은 가족식사가 바로 보입니다!)
                </div>
            </div>
        `,

        church: `
            <div style=""display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:12px; border-bottom:2px solid #bbf7d0;"">
                <span style=""font-size:28px;"">🏛️</span>
                <div>
                    <strong style=""font-size:18.5px; color:#065f46; letter-spacing:-0.3px;"">영원히 무료 교회홈 & 공지 자동배송</strong>
                    <div style=""font-size:13px; color:#059669; font-weight:750;"">교회와 성도를 하나로 묶는 스마트 선교</div>
                </div>
            </div>

            <div style=""display:flex; flex-direction:column; gap:14px; font-size:15.5px; line-height:1.85;"">
                <div style=""background:#f0fdf4; border:1.5px solid #86efac; border-radius:14px; padding:16px;"">
                    <strong style=""color:#166534; font-size:16.5px;"">📱 성도 1명 가입만으로 무료 교회홈 뚝딱!</strong><br>
                    성도 한 분이 가입할 때 본인 소속 교회명과 담임목사님 성함만 필수 입력하면, 유지비가 평생 제로인 무료 스마트 교회 홈페이지와 앱이 즉시 생성됩니다.
                </div>

                <div style=""background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:14px; padding:16px;"">
                    <strong style=""color:#1d4ed8; font-size:16.5px;"">🚀 성도 개인 스마트폰으로 자동 배송! (문자비 0원)</strong><br>
                    교회에서 공지알림을 올리면 예톡홈과 성도 개인의 내앱으로 직접 자동 배송됩니다. 값비싼 단체 문자메시지 비용이 1원도 들지 않습니다!
                </div>

                <div style=""background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px;"">
                    <strong style=""color:#334155; font-size:16.5px;"">📦 은혜의 보배창고 & 작은 모임 공간</strong><br>
                    지나간 공지의 다양한 내용은 '보배창고'에 가지런히 정돈 보관되며, 작은 모임이나 구역 나눔 공간도 함께 마련되어 있습니다.
                </div>
            </div>
        `,

        tv: `
            <div style=""display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:12px; border-bottom:2px solid #fecaca;"">
                <span style=""font-size:28px;"">📺</span>
                <div>
                    <strong style=""font-size:18.5px; color:#b91c1c; letter-spacing:-0.3px;"">예톡TV 무료 프리미엄 꿀팁</strong>
                    <div style=""font-size:13px; color:#dc2626; font-weight:750;"">호주머니 청취 모드와 영상 추천</div>
                </div>
            </div>

            <div style=""display:flex; flex-direction:column; gap:14px; font-size:15.5px; line-height:1.85;"">
                <div style=""background:#fff5f5; border:1.5px solid #fca5a5; border-radius:14px; padding:16px;"">
                    <strong style=""color:#dc2626; font-size:16.5px;"">🌟 1. 누구나 감동 영상 추천 등록</strong><br>
                    유튜브에서 분야별(찬양, 말씀, 간증 등) 좋은 영상을 보셨다면 [영상 올리기]를 통해 누구나 추천 등록할 수 있습니다. 20자 내외로 마음을 담은 나눔 글도 적으실 수 있습니다.
                </div>

                <div style=""background:#f0fdf4; border:1.5px solid #86efac; border-radius:14px; padding:16px;"">
                    <strong style=""color:#166534; font-size:16.5px;"">🔒 2. 화면고정 & 호주머니 청취 모드</strong><br>
                    화면고정 기능을 켜시면 스마트폰을 호주머니나 가방에 넣고 걸어도 꺼지지 않으며, 광고 방해 없이 찬양과 말씀을 마음껏 은혜롭게 들으실 수 있습니다!
                </div>
            </div>
        `,

        role: `
            <div style=""display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:12px; border-bottom:2px solid #bfdbfe;"">
                <span style=""font-size:28px;"">👥</span>
                <div>
                    <strong style=""font-size:18.5px; color:#1e40af; letter-spacing:-0.3px;"">직분별 맞춤앱 제공 체계</strong>
                    <div style=""font-size:13px; color:#2563eb; font-weight:750;"">성도 · 부사역자 · 담임목사님 맞춤 권한</div>
                </div>
            </div>

            <div style=""display:flex; flex-direction:column; gap:14px; font-size:15.5px; line-height:1.85;"">
                <div style=""background:#ffffff; border:1.5px solid #cbd5e1; border-radius:14px; padding:16px;"">
                    <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"">
                        <strong style=""font-size:17px; color:#0f172a;"">1. 일반 성도</strong>
                        <span style=""background:#e0f2fe; color:#0284c7; padding:3px 10px; border-radius:8px; font-weight:950; font-size:12.5px;"">내앱 제공</span>
                    </div>
                    <div style=""font-size:14.5px; color:#475569;"">
                        개인 성경 통독, 매일 3회 회개기도, 본교회 실시간 공지알림 확인 등 나만의 알찬 신앙생활 지원.
                    </div>
                </div>

                <div style=""background:#f0fdf4; border:1.5px solid #86efac; border-radius:14px; padding:16px;"">
                    <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"">
                        <strong style=""font-size:17px; color:#166534;"">2. 부사역자 (부목사·전도사)</strong>
                        <span style=""background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:8px; font-weight:950; font-size:12.5px;"">내앱 + 작은교회</span>
                    </div>
                    <div style=""font-size:14.5px; color:#15803d;"">
                        [내앱] 기본 혜택과 함께, 담당 구역·교구·청년부 등 소그룹을 하나의 '작은교회'로 밀착 케어할 수 있는 스마트 지원앱 제공.
                    </div>
                </div>

                <div style=""background:#fefce8; border:1.5px solid #fde047; border-radius:14px; padding:16px;"">
                    <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"">
                        <strong style=""font-size:17px; color:#854d0e;"">3. 담임목사님</strong>
                        <span style=""background:#fef08a; color:#a16207; padding:3px 10px; border-radius:8px; font-weight:950; font-size:12.5px;"">3가지 모두 제공!</span>
                    </div>
                    <div style=""font-size:14.5px; color:#a16207;"">
                        [내앱] + [작은교회] + [우리교회 총괄 관리자(홈페이지·스마트 주보·공지 발송·성도 관리)] 3가지 권한을 모두 드립니다!
                    </div>
                </div>
            </div>
        `
    };

    function openYetalkGuideModal(tabKey) {
        switchYetalkGuideTab(tabKey || 'intro');
        const modal = document.getElementById('modalYetalkGuide');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    function closeYetalkGuideModal() {
        const modal = document.getElementById('modalYetalkGuide');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    }

    function switchYetalkGuideTab(tabKey) {
        const bodyEl = document.getElementById('yetalkGuideBodyContent');
        if (bodyEl) {
            bodyEl.innerHTML = yetalkGuideData[tabKey] || yetalkGuideData.intro;
            bodyEl.scrollTop = 0;
        }

        const tabKeys = ['intro', 'word', 'bible', 'prayer', 'church', 'tv', 'role'];
        tabKeys.forEach(key => {
            const btn = document.getElementById('guideTab_' + key);
            if (btn) {
                if (key === tabKey) {
                    btn.style.border = '2px solid #059669';
                    btn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                    btn.style.color = '#ffffff';
                    btn.style.fontWeight = '950';
                    btn.style.boxShadow = '0 3px 8px rgba(5,150,105,0.35)';
                    try {
                        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    } catch(e) {}
                } else {
                    btn.style.border = '1.5px solid #cbd5e1';
                    btn.style.background = '#ffffff';
                    btn.style.color = '#334155';
                    btn.style.fontWeight = '800';
                    btn.style.boxShadow = 'none';
                }
            }
        });
    }
";
                text = text.Substring(0, jsStart) + newJsGuide + "\r\n    " + text.Substring(jsEnd);
            }

            File.WriteAllText(file, text, Encoding.UTF8);
            Console.WriteLine("Successfully upgraded " + file);
        }
    }
}
