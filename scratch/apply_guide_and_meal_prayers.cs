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

            // 1. Add Guide Button in the empty space above community / under slogan
            string targetSloganMarker = "우리교회 홈페이지(앱) 무료 제작";
            int sloganPos = text.IndexOf(targetSloganMarker);
            if (sloganPos != -1 && !text.Contains("openYetalkGuideModal()"))
            {
                int closeDiv3 = text.IndexOf("</div>\r\n            </div>\r\n        </div>", sloganPos);
                string sep = "\r\n            </div>\r\n        </div>";
                if (closeDiv3 == -1)
                {
                    closeDiv3 = text.IndexOf("</div>\n            </div>\n        </div>", sloganPos);
                    sep = "\n            </div>\n        </div>";
                }

                if (closeDiv3 != -1)
                {
                    int insertIndex = closeDiv3 + ("</div>" + sep).Length;
                    string guideButtonHtml = @"
        <!-- 🌟 [사용자 요청] 커뮤니티 위 빈공간: 예톡 간단 사용안내 소버튼 -->
        <div style=""display:flex; justify-content:flex-end; align-items:center; padding:2px 14px 6px 14px; margin-top:-2px;"">
            <button type=""button"" onclick=""openYetalkGuideModal()"" style=""display:inline-flex; align-items:center; gap:5px; background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); color:#15803d; border:1.5px solid #86efac; border-radius:18px; padding:5px 12px; font-size:12px; font-weight:950; cursor:pointer; box-shadow:0 2px 6px rgba(22,163,74,0.18); transition:transform 0.12s ease;"" title=""예톡 은혜로운 100% 활용법 안내 보기"">
                <span style=""font-size:14px;"">💡</span>
                <span>예톡 간단 사용안내</span>
                <span style=""font-size:10px; background:#16a34a; color:#ffffff; padding:1px 5px; border-radius:8px; font-weight:900;"">안내</span>
            </button>
        </div>";
                    text = text.Insert(insertIndex, guideButtonHtml);
                }
            }

            // 2. Make meal prayer button more noticeable
            int btnStart = text.IndexOf("<button type=\"button\" onclick=\"openMealPrayerLotteryModal()\"");
            if (btnStart != -1)
            {
                int btnEnd = text.IndexOf("</button>", btnStart);
                if (btnEnd != -1)
                {
                    string oldBtn = text.Substring(btnStart, btnEnd + 9 - btnStart);
                    string newBtn = @"<button type=""button"" onclick=""openMealPrayerLotteryModal()"" style=""background:linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #d97706 100%); color:#ffffff; border:1.5px solid #fed7aa; padding:6px 13px; border-radius:22px; font-size:13px; font-weight:950; cursor:pointer; box-shadow:0 3px 10px rgba(234,88,12,0.38); display:inline-flex; align-items:center; gap:5px; flex-shrink:0; white-space:nowrap;"" title=""재미있는 대표 식사 기도자 추첨 & 3가지 상황별 기도문"">
                    <span style=""font-size:15px;"">🍽️</span>
                    <span>대표식사기도</span>
                    <span style=""font-size:10px; background:#ffffff; color:#c2410c; padding:1px 5px; border-radius:10px; font-weight:900;"">추첨·기도문</span>
                </button>";
                    text = text.Replace(oldBtn, newBtn);
                }
            }

            // 3. Update meal prayer modal with 3 situation prayer tabs (가족식사, 모임식사, 이웃방문)
            string oldPrayerSection = "<!-- 🌟 [사용자 요청] 오늘의 대표 식사 기도문 (글자 크기 큼직하게 16.5px 확대) -->";
            int prayerSecPos = text.IndexOf(oldPrayerSection);
            if (prayerSecPos != -1)
            {
                // find end of this box (starts with <div style="background:#f8fafc;, ends before <!-- 🌟 [사용자 요청] 하단 고정 100 애드몹)
                int admobPos = text.IndexOf("<!-- 🌟 [사용자 요청] 하단 고정 100 애드몹", prayerSecPos);
                if (admobPos != -1)
                {
                    string oldBlock = text.Substring(prayerSecPos, admobPos - prayerSecPos);
                    string newBlock = @"<!-- 🌟 [사용자 요청] 오늘의 대표 식사 기도문 (가족식사, 모임식사, 이웃방문 3가지 선택 탭, 기본 가족식사) -->
                <div style=""background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:15px 15px 13px 15px;"">
                    <div style=""display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;"">
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <span style=""font-size:18px;"">🙏</span>
                            <strong style=""font-size:15.5px; color:#0f172a; font-weight:950;"">상황별 대표 식사 기도문</strong>
                        </div>
                        <span style=""font-size:11px; color:#64748b; font-weight:800;"">상황 선택</span>
                    </div>

                    <!-- 3가지 상황 선택 탭: 가족식사(기본), 모임식사, 이웃방문 -->
                    <div style=""display:flex; gap:6px; margin-bottom:12px;"">
                        <button type=""button"" id=""btnMealTab_family"" onclick=""switchMealPrayerTab('family')"" style=""flex:1; padding:7px 2px; border-radius:10px; font-size:12.5px; font-weight:950; cursor:pointer; border:1.5px solid #f59e0b; background:#fef3c7; color:#92400e; box-shadow:0 1.5px 4px rgba(245,158,11,0.2); transition:all 0.15s ease;"">👨‍👩‍👧‍👦 가족식사</button>
                        <button type=""button"" id=""btnMealTab_meeting"" onclick=""switchMealPrayerTab('meeting')"" style=""flex:1; padding:7px 2px; border-radius:10px; font-size:12.5px; font-weight:800; cursor:pointer; border:1.5px solid #e2e8f0; background:#ffffff; color:#64748b; transition:all 0.15s ease;"">👥 모임식사</button>
                        <button type=""button"" id=""btnMealTab_neighbor"" onclick=""switchMealPrayerTab('neighbor')"" style=""flex:1; padding:7px 2px; border-radius:10px; font-size:12.5px; font-weight:800; cursor:pointer; border:1.5px solid #e2e8f0; background:#ffffff; color:#64748b; transition:all 0.15s ease;"">🏡 이웃방문</button>
                    </div>

                    <!-- 선택된 기도문 본문 -->
                    <div id=""mealPrayerDisplayContent"" style=""font-family:'Pretendard', 'Nanum Myeongjo', serif; font-size:16px; color:#1e293b; line-height:1.8; word-break:keep-all; font-weight:700; background:#ffffff; padding:12px; border-radius:10px; border:1px solid #f1f5f9;"">
                        <!-- JS로 가족식사 기도문 기본 렌더링 -->
                    </div>
                </div>

            ";
                    text = text.Replace(oldBlock, newBlock);
                }
            }

            // 4. Add Yetalk Guide Modal HTML (modalYetalkGuide) right before mealPrayerLotteryModal
            string mealModalMarker = "<!-- 🌟 [사용자 요청] 대표 식사 기도자 뽑기 모달";
            if (!text.Contains("id=\"modalYetalkGuide\"") && text.Contains(mealModalMarker))
            {
                string guideModalHtml = @"    <!-- 🌟 [사용자 요청] 예톡 간단 사용안내 & 은혜로운 활용법 모달 -->
    <div class=""modal-overlay"" id=""modalYetalkGuide"" style=""display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.8); z-index:99999; justify-content:center; align-items:center; padding:14px; box-sizing:border-box;"" onclick=""closeYetalkGuideModal()"">
        <div style=""background:#ffffff; width:100%; max-width:460px; max-height:92vh; border-radius:22px; box-shadow:0 25px 60px rgba(0,0,0,0.4); overflow:hidden; display:flex; flex-direction:column; animation:fadeInUpModal 0.25s ease-out;"" onclick=""event.stopPropagation()"">
            <!-- 헤더 -->
            <div style=""display:flex; justify-content:space-between; align-items:center; padding:14px 18px; background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-bottom:1.5px solid #a7f3d0; flex-shrink:0;"">
                <div style=""display:flex; align-items:center; gap:8px;"">
                    <span style=""font-size:22px;"">💡</span>
                    <div>
                        <div style=""font-size:16.5px; font-weight:950; color:#065f46;"">예톡 간단 사용안내</div>
                        <div style=""font-size:11.5px; color:#047857; font-weight:750;"">예수님과 동행하는 은혜로운 활용법</div>
                    </div>
                </div>
                <button type=""button"" onclick=""closeYetalkGuideModal()"" style=""background:#ffffff; border:none; color:#065f46; font-size:16px; font-weight:900; width:30px; height:30px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,0.12);"" title=""닫기"">✕</button>
            </div>

            <!-- 소분류 탭 메뉴 (가로 스크롤 가능한 칩 버튼들) -->
            <div style=""display:flex; gap:6px; overflow-x:auto; padding:10px 14px; background:#f8fafc; border-bottom:1px solid #e2e8f0; -webkit-overflow-scrolling:touch; flex-shrink:0;"">
                <button type=""button"" id=""guideTab_intro"" onclick=""switchYetalkGuideTab('intro')"" class=""yetalk-guide-tab-btn active"" style=""white-space:nowrap; padding:6px 12px; border-radius:18px; font-size:12px; font-weight:900; cursor:pointer; border:1.5px solid #059669; background:#059669; color:#ffffff; box-shadow:0 2px 5px rgba(5,150,105,0.25);"">🌿 시작과 전도</button>
                <button type=""button"" id=""guideTab_role"" onclick=""switchYetalkGuideTab('role')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:6px 12px; border-radius:18px; font-size:12px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#475569;"">👥 직분별 맞춤앱</button>
                <button type=""button"" id=""guideTab_word"" onclick=""switchYetalkGuideTab('word')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:6px 12px; border-radius:18px; font-size:12px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#475569;"">📖 이 시간의 말씀</button>
                <button type=""button"" id=""guideTab_bible"" onclick=""switchYetalkGuideTab('bible')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:6px 12px; border-radius:18px; font-size:12px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#475569;"">🍚 삼시세끼 성경</button>
                <button type=""button"" id=""guideTab_prayer"" onclick=""switchYetalkGuideTab('prayer')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:6px 12px; border-radius:18px; font-size:12px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#475569;"">🙏 회개 & 식사기도</button>
                <button type=""button"" id=""guideTab_church"" onclick=""switchYetalkGuideTab('church')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:6px 12px; border-radius:18px; font-size:12px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#475569;"">🏛️ 무료 교회홈 & 배송</button>
                <button type=""button"" id=""guideTab_tv"" onclick=""switchYetalkGuideTab('tv')"" class=""yetalk-guide-tab-btn"" style=""white-space:nowrap; padding:6px 12px; border-radius:18px; font-size:12px; font-weight:800; cursor:pointer; border:1.5px solid #cbd5e1; background:#ffffff; color:#475569;"">📺 예톡TV 꿀팁</button>
            </div>

            <!-- 바디 안내 내용 (스크롤 영역) -->
            <div id=""yetalkGuideBodyContent"" style=""padding:18px; overflow-y:auto; -webkit-overflow-scrolling:touch; flex:1; font-size:14.5px; line-height:1.75; color:#1e293b;"">
                <!-- JS에서 선택된 탭 내용 렌더링 -->
            </div>

            <!-- 하단 닫기 바 -->
            <div style=""padding:10px 18px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;"">
                <span style=""font-size:11.5px; color:#059669; font-weight:800;"">🌿 예수동행 말씀 & 기도 플랫폼 예톡</span>
                <button type=""button"" onclick=""closeYetalkGuideModal()"" style=""padding:7px 18px; background:#059669; color:#ffffff; font-size:13px; font-weight:900; border:none; border-radius:10px; cursor:pointer;"">닫기</button>
            </div>
        </div>
    </div>

";
                text = text.Replace(mealModalMarker, guideModalHtml + mealModalMarker);
            }

            // 5. Add JavaScript functions for guide modal and meal prayer switching
            string jsMarker = "function openMealPrayerLotteryModal()";
            if (!text.Contains("function openYetalkGuideModal()") && text.Contains(jsMarker))
            {
                string jsCode = @"
    /* ==================================================
       🌟 [사용자 요청] 대표 식사 기도문 3가지 상황별 전환 (가족식사, 모임식사, 이웃방문)
    ================================================== */
    const mealPrayerTexts = {
        family: `“사랑과 은혜가 풍성하신 하나님 아버지, 오늘 이렇게 온 가족이 건강한 모습으로 한 식탁에 둘러앉아 맛있는 음식을 함께 나눌 수 있는 기쁨을 주시니 진심으로 감사드립니다.<br><br>
이 음식을 먹고 마시는 우리 가족 모두의 영과 육이 더욱 강건하여지게 하시고, 세상에서 살아갈 때 주님의 지혜와 용기를 더하여 주옵소서. 날마다 주님의 사랑으로 서로 아끼고 격려하며, 믿음 안에서 하나 되는 화목하고 복된 가정이 되게 하옵소서.<br><br>
정성으로 음식을 준비한 사랑의 손길을 축복하여 주시며, 오늘도 우리 가정의 주인이 되어 주시는 <span style=""color:#047857; font-weight:950;"">예수 그리스도의 이름으로 감사히 기도드립니다. 아멘!</span>”`,
        
        meeting: `“참 좋으신 하나님 아버지, 주님의 크신 은혜 안에서 믿음의 지체들이 한자리에 모여 기쁨으로 교제하며 아름다운 식탁을 나눌 수 있게 하심을 감사드립니다.<br><br>
이 음식을 통하여 지친 우리의 몸과 마음에 새 힘을 부어주시고, 함께 나누는 대화와 교제 속에 하늘의 평안과 위로가 가득 넘치게 하옵소서. 우리가 모일 때마다 주님의 사랑을 증거하며 서로를 위해 기도하는 신실한 믿음의 동역자들이 되게 하옵소서.<br><br>
이 귀한 모임을 예비하고 정성으로 섬겨주신 모든 손길 위에 하늘의 신령한 복을 풍성히 채워주시길 원하오며, <span style=""color:#047857; font-weight:950;"">우리의 참된 양식 되시는 예수 그리스도의 이름으로 감사히 기도드립니다. 아멘!</span>”`,
        
        neighbor: `“평강의 하나님 아버지, 오늘 귀한 발걸음으로 사랑하는 이웃의 가정을 방문하여 따뜻한 사랑과 정성이 담긴 식탁을 마주하게 하시니 참으로 감사드립니다.<br><br>
이 아름다운 가정에 주님의 평안과 복을 넘치도록 채워주시고, 집안의 들고 나는 모든 일 가운데 기쁨과 감사가 끊이지 않게 하옵소서. 귀한 음식을 정성껏 베풀어준 따뜻한 손길을 기억하시고, 베푼 것의 백 배나 되는 풍성한 은혜로 갚아 주옵소서.<br><br>
오늘 나누는 이 식사와 따뜻한 대화를 통해 그리스도의 향기가 온 집안에 가득하기를 소망하오며, <span style=""color:#047857; font-weight:950;"">예수 그리스도의 이름으로 축복하며 기도드립니다. 아멘!</span>”`
    };

    let currentMealPrayerTab = 'family';
    function switchMealPrayerTab(tab) {
        currentMealPrayerTab = tab;
        const bodyEl = document.getElementById('mealPrayerDisplayContent');
        if (bodyEl) {
            bodyEl.innerHTML = mealPrayerTexts[tab] || mealPrayerTexts.family;
        }

        const tabs = ['family', 'meeting', 'neighbor'];
        tabs.forEach(t => {
            const btn = document.getElementById('btnMealTab_' + t);
            if (btn) {
                if (t === tab) {
                    btn.style.border = '1.5px solid #f59e0b';
                    btn.style.background = '#fef3c7';
                    btn.style.color = '#92400e';
                    btn.style.fontWeight = '950';
                    btn.style.boxShadow = '0 1.5px 4px rgba(245,158,11,0.2)';
                } else {
                    btn.style.border = '1.5px solid #e2e8f0';
                    btn.style.background = '#ffffff';
                    btn.style.color = '#64748b';
                    btn.style.fontWeight = '800';
                    btn.style.boxShadow = 'none';
                }
            }
        });
    }

    /* ==================================================
       🌟 [사용자 요청] 예톡 간단 사용안내 모달 & 7대 소분류 탭 제어
    ================================================== */
    const yetalkGuideData = {
        intro: `
            <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #d1fae5;"">
                <span style=""font-size:22px;"">🌿</span>
                <strong style=""font-size:16px; color:#065f46;"">예톡의 탄생 비화와 전도의 사명</strong>
            </div>
            <div style=""background:#ecfdf5; border-left:4px solid #059669; padding:12px 14px; border-radius:0 10px 10px 0; margin-bottom:14px;"">
                <div style=""font-weight:900; color:#047857; font-size:14px; margin-bottom:4px;"">✨ 예수님과 언덕길을 걸으며...</div>
                <div style=""font-size:13.5px; color:#065f46; line-height:1.65;"">
                    “예수님과 다정히 손잡고 언덕길을 걸으며 대화(토크)하며, 소박하고 아름다운 작은 교회로 함께 걸어가는 은혜로운 모습을 바라보며 만든 앱이 바로 <strong>예톡(Yetalk)</strong>입니다.”
                </div>
            </div>
            <div style=""display:flex; flex-direction:column; gap:10px; font-size:13.5px; color:#334155;"">
                <div style=""display:flex; gap:8px;"">
                    <span style=""color:#059669; font-weight:900;"">✔</span>
                    <div><strong>주님께 깨어있는 성도:</strong> 바쁜 일상 속에서도 말씀과 기도로 항상 주님께 깨어있고, 교회와 성도가 하나로 연결되도록 제작되었습니다.</div>
                </div>
                <div style=""display:flex; gap:8px;"">
                    <span style=""color:#2563eb; font-weight:900;"">✔</span>
                    <div><strong>예톡을 전하는 것이 곧 전도:</strong> 예톡 안에는 은혜로운 복음과 말씀, 전도 메시지가 자동으로 담겨 전달되므로, 주변 성도님이나 이웃, 가족에게 예톡을 알려주는 것 자체가 귀한 <strong>복음 전도</strong>가 됩니다!</div>
                </div>
                <div style=""display:flex; gap:8px;"">
                    <span style=""color:#d97706; font-weight:900;"">✔</span>
                    <div><strong>주님의 얼굴을 기쁘시게:</strong> 성도도 교회도 모두 유익한 예톡을 많이 사랑해 주시고 복음 전파의 도구로 귀하게 쓰임받기를 소망합니다.</div>
                </div>
            </div>
        `,

        role: `
            <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #dbeafe;"">
                <span style=""font-size:22px;"">👥</span>
                <strong style=""font-size:16px; color:#1e40af;"">직분별 맞춤앱 제공 체계</strong>
            </div>
            <div style=""font-size:13px; color:#475569; margin-bottom:14px;"">
                교회 안에서의 역할과 사역에 꼭 맞게 차별화된 앱 혜택을 드립니다:
            </div>
            <div style=""display:flex; flex-direction:column; gap:10px;"">
                <div style=""background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:12px;"">
                    <div style=""display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;"">
                        <strong style=""font-size:14px; color:#0f172a;"">1. 일반 성도</strong>
                        <span style=""font-size:11px; background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:6px; font-weight:900;"">내앱 제공</span>
                    </div>
                    <div style=""font-size:12.5px; color:#64748b; line-height:1.5;"">
                        개인 성경 통독, 매일 3회 회개기도, 본교회 실시간 공지알림 확인 등 나만의 알찬 신앙생활 지원.
                    </div>
                </div>

                <div style=""background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:12px; padding:12px;"">
                    <div style=""display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;"">
                        <strong style=""font-size:14px; color:#166534;"">2. 부사역자 (부목사·전도사)</strong>
                        <span style=""font-size:11px; background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:6px; font-weight:900;"">내앱 + 작은교회</span>
                    </div>
                    <div style=""font-size:12.5px; color:#15803d; line-height:1.5;"">
                        [내앱] 기본 혜택과 함께, 담당 구역·교구·청년부 등 소그룹을 하나의 '작은교회'로 밀착 케어할 수 있는 스마트 지원앱 제공.
                    </div>
                </div>

                <div style=""background:#fefce8; border:1.5px solid #fde047; border-radius:12px; padding:12px;"">
                    <div style=""display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;"">
                        <strong style=""font-size:14px; color:#854d0e;"">3. 담임목사님</strong>
                        <span style=""font-size:11px; background:#fef08a; color:#a16207; padding:2px 8px; border-radius:6px; font-weight:900;"">3가지 모두 제공!</span>
                    </div>
                    <div style=""font-size:12.5px; color:#a16207; line-height:1.5;"">
                        [내앱] + [작은교회] + [우리교회 총괄 관리자(홈페이지·스마트 주보·공지 발송·성도 관리)] 3가지 권한을 모두 드립니다!
                    </div>
                </div>
            </div>
        `,

        word: `
            <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #d1fae5;"">
                <span style=""font-size:22px;"">📖</span>
                <strong style=""font-size:16px; color:#065f46;"">이 시간의 말씀 활용법</strong>
            </div>
            <div style=""background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:13px; margin-bottom:12px;"">
                <div style=""font-weight:900; color:#047857; font-size:14px; margin-bottom:5px;"">⏰ 3시간마다 바뀌는 살아있는 은혜</div>
                <div style=""font-size:13px; color:#15803d; line-height:1.6;"">
                    하루를 보내며 성도님들이 지치지 않도록 3시간마다 새로운 묵상 말씀이 자동으로 전달됩니다.
                </div>
            </div>
            <div style=""background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:13px;"">
                <div style=""font-weight:900; color:#0f172a; font-size:14px; margin-bottom:5px;"">👆 말씀 구절 터치 시 깊은 묵상 직행</div>
                <div style=""font-size:13px; color:#475569; line-height:1.6;"">
                    말씀 구절(예: 이사야 40:31)을 톡 누르시면, <strong>해당 본문이 속한 성경 전체 장</strong>과 <strong>간단 예배 화면</strong>으로 즉시 이동하여 깊은 은혜를 누리실 수 있습니다.
                </div>
            </div>
        `,

        bible: `
            <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #fee2e2;"">
                <span style=""font-size:22px;"">🍚</span>
                <strong style=""font-size:16px; color:#991b1b;"">삼시세끼 성경 100% 통독법</strong>
            </div>
            <div style=""font-size:13.5px; color:#334155; line-height:1.7; display:flex; flex-direction:column; gap:10px;"">
                <div>
                    <strong>🔴 빨간색 고정으로 어디 읽을까 고민 끝!</strong><br>
                    성경을 여기 읽다가 저기 읽다가 고민될 때가 많으셨죠? 창세기든 원하는 성경을 빨간색으로 고정해 두세요.
                </div>
                <div style=""background:#fff1f2; border-left:4px solid #f43f5e; padding:10px 12px; border-radius:0 8px 8px 0;"">
                    <strong>아침 1장 ➜ 점심 1장 ➜ 저녁 1장!</strong><br>
                    하루 삼시세끼 밥 먹듯이 3장씩 읽고, 다음 날도 4장부터 끊김 없이 이어서 읽으면 누구나 성경 66권을 끝까지 완독할 수 있습니다.
                </div>
                <div>
                    <strong>🖍️ 예배 본문 찾기 & 형광펜 기능:</strong><br>
                    주일 예배 때 설교 본문 찾기도 너무 편하고, 감동받은 구절을 톡 누르면 예쁜 형광펜 색깔이 칠해집니다. 최고의 성경·교회·개인앱입니다.
                </div>
            </div>
        `,

        prayer: `
            <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #fef3c7;"">
                <span style=""font-size:22px;"">🙏</span>
                <strong style=""font-size:16px; color:#92400e;"">회개기도 & 대표식사기도 투표</strong>
            </div>
            <div style=""display:flex; flex-direction:column; gap:12px;"">
                <div style=""background:#f0fdf4; border:1px solid #86efac; border-radius:12px; padding:12px;"">
                    <div style=""font-weight:900; color:#166534; font-size:14px; margin-bottom:4px;"">✨ 매일 회개기도 (영적 청결)</div>
                    <div style=""font-size:13px; color:#15803d; line-height:1.6;"">
                        매일 하루 여러 번 진실한 회개기도를 드리시면 영적으로 맑아지고 깨끗해지며 강력한 영적 새 힘을 얻습니다.
                    </div>
                </div>

                <div style=""background:#fefce8; border:1px solid #fde047; border-radius:12px; padding:12px;"">
                    <div style=""font-weight:900; color:#854d0e; font-size:14px; margin-bottom:4px;"">🍽️ 대표식사기도 & 재미있는 투표</div>
                    <div style=""font-size:13px; color:#a16207; line-height:1.6;"">
                        함께 식사할 때 사람 수를 선택해 번호를 정하고 투표를 누르면, 당첨된 분이 기쁨으로 대표기도를 섬기는 재미있고 유익한 기능입니다! (모임에서 1명 뽑을 때 투표로도 좋습니다.)
                    </div>
                </div>

                <div style=""background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px;"">
                    <div style=""font-weight:900; color:#0f172a; font-size:14px; margin-bottom:4px;"">📜 3가지 맞춤 식사기도문</div>
                    <div style=""font-size:13px; color:#475569; line-height:1.6;"">
                        기도가 막막하지 않도록 <strong>[가족식사], [모임식사], [이웃방문]</strong> 3가지 상황별 은혜로운 기도문을 기본 제공합니다.
                    </div>
                </div>
            </div>
        `,

        church: `
            <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #d1fae5;"">
                <span style=""font-size:22px;"">🏛️</span>
                <strong style=""font-size:16px; color:#065f46;"">영원히 무료 교회홈 & 공지 자동배송</strong>
            </div>
            <div style=""display:flex; flex-direction:column; gap:10px; font-size:13px; color:#334155; line-height:1.65;"">
                <div style=""background:#f0fdf4; border-radius:10px; padding:12px; border:1px solid #bbf7d0;"">
                    <strong style=""color:#15803d; font-size:13.5px;"">📱 성도 1명만 가입해도 무료 교회홈 뚝딱!</strong><br>
                    성도 한 분이 가입할 때 본인 소속 교회와 담임목사님 성함만 입력하면, 평생 무료로 사용하는 스마트 교회 홈페이지와 앱이 즉시 만들어집니다.
                </div>
                <div style=""background:#eff6ff; border-radius:10px; padding:12px; border:1px solid #bfdbfe;"">
                    <strong style=""color:#1d4ed8; font-size:13.5px;"">🚀 개인에게 자동 배송되는 공지 시스템 (문자비 0원)</strong><br>
                    교회에서 공지글을 올리면 예톡홈과 성도 개인의 내앱으로 바로 자동 배송됩니다. 비싼 교회 단체문자 비용이 전혀 들지 않습니다!
                </div>
                <div style=""background:#f8fafc; border-radius:10px; padding:12px; border:1px solid #e2e8f0;"">
                    <strong style=""color:#334155; font-size:13.5px;"">📦 은혜의 보배창고 & 작은 모임 공간</strong><br>
                    지나간 공지와 주보, 설교 요약은 '보배창고'에 가지런히 정돈되어 언제든 열어볼 수 있으며, 교구와 구역 작은 모임 공간도 함께 지원됩니다.
                </div>
            </div>
        `,

        tv: `
            <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #fee2e2;"">
                <span style=""font-size:22px;"">📺</span>
                <strong style=""font-size:16px; color:#b91c1c;"">예톡TV 무료 프리미엄 꿀팁</strong>
            </div>
            <div style=""display:flex; flex-direction:column; gap:11px; font-size:13.5px; color:#334155; line-height:1.7;"">
                <div style=""background:#fff5f5; border:1.5px solid #fecaca; border-radius:12px; padding:12px;"">
                    <strong style=""color:#dc2626;"">🌟 누구나 감동 영상 추천 등록:</strong><br>
                    유튜브에서 분야별(찬양, 말씀, 간증 등) 좋은 영상을 보셨다면 [영상 올리기]를 통해 누구나 추천할 수 있습니다. 20자 내외로 은혜 나눔 글도 함께 적을 수 있습니다.
                </div>
                <div style=""background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:12px; padding:12px;"">
                    <strong style=""color:#15803d;"">🔒 화면고정 & 주머니 청취 모드:</strong><br>
                    화면고정 기능을 켜시면 스마트폰을 호주머니나 가방에 넣고 걸어도 꺼지지 않고, 광고 방해 없이 찬양과 말씀을 평안하게 들으실 수 있습니다!
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
        }

        const tabKeys = ['intro', 'role', 'word', 'bible', 'prayer', 'church', 'tv'];
        tabKeys.forEach(key => {
            const btn = document.getElementById('guideTab_' + key);
            if (btn) {
                if (key === tabKey) {
                    btn.style.border = '1.5px solid #059669';
                    btn.style.background = '#059669';
                    btn.style.color = '#ffffff';
                    btn.style.fontWeight = '950';
                    btn.style.boxShadow = '0 2px 5px rgba(5,150,105,0.25)';
                } else {
                    btn.style.border = '1.5px solid #cbd5e1';
                    btn.style.background = '#ffffff';
                    btn.style.color = '#475569';
                    btn.style.fontWeight = '800';
                    btn.style.boxShadow = 'none';
                }
            }
        });
    }
";
                text = text.Replace(jsMarker, jsCode + "\r\n    " + jsMarker);
            }

            // Also make sure inside openMealPrayerLotteryModal, switchMealPrayerTab('family') is called
            if (!text.Contains("switchMealPrayerTab('family');"))
            {
                text = text.Replace("renderMealParticipantCards();", "renderMealParticipantCards();\r\n        switchMealPrayerTab('family');");
            }

            File.WriteAllText(file, text, Encoding.UTF8);
            Console.WriteLine("Successfully applied to " + file);
        }
    }
}
