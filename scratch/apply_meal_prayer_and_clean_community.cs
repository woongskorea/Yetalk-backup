using System;
using System.IO;
using System.Text;

class ApplyMealPrayerAndCleanCommunity
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

            // 1. Update CSS for community-sub-pill: compact padding, flex 1 1 0, min-width 0
            string oldCss = @".community-subchannels-bar {
            display: flex;
            flex-direction: column;
            width: 100%;
            box-sizing: border-box;
            border-top: 1px dashed #e2e8f0;
            margin-top: 4px;
            padding: 8px 4px 6px 4px;
        }
        .community-sub-pill {
            padding: 7px 10px !important;
            border-radius: 8px !important;
            font-size: 13.5px !important;
            font-weight: 950 !important;
            cursor: pointer;
            flex: 1;
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
            transition: all 0.15s ease;
        }";

            string newCss = @".community-subchannels-bar {
            display: flex;
            flex-direction: column;
            width: 100%;
            box-sizing: border-box;
            border-top: 1px dashed #e2e8f0;
            margin-top: 4px;
            padding: 6px 2px 4px 2px;
        }
        .community-sub-pill {
            padding: 7px 2px !important;
            border-radius: 8px !important;
            font-size: 13.5px !important;
            font-weight: 950 !important;
            cursor: pointer;
            flex: 1 1 0 !important;
            min-width: 0 !important;
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
            transition: all 0.15s ease;
        }";

            if (text.Contains(oldCss))
            {
                text = text.Replace(oldCss, newCss);
                Console.WriteLine("Updated community-sub-pill CSS in: " + path);
            }

            // 2. HTML: Remove emoji from communitySubChannelsBar
            string oldSubBar = @"            <!-- 🌟 [사용자 요청] 커뮤니티 누르면 나타나는 가로 3개 소메뉴: 감사게시판, 자유게시판, 예수동행 -->
            <div class=""community-subchannels-bar"" id=""communitySubChannelsBar"" style=""display:none;"">
                <div class=""subchannels-row"" style=""gap:6px; justify-content:space-around; padding:6px 2px;"">
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-thanks"" onclick=""openFullscreenBoard('감사게시판')"">
                        <span>🙏 감사게시판</span>
                    </button>
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-free"" onclick=""openFullscreenBoard('자유게시판')"">
                        <span>💬 자유게시판</span>
                    </button>
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-jesus"" onclick=""openFullscreenBoard('예수동행')"">
                        <span>✝️ 예수동행</span>
                    </button>
                </div>
            </div>";

            string newSubBar = @"            <!-- 🌟 [사용자 요청] 커뮤니티 누르면 나타나는 가로 3개 소메뉴: 감사게시판, 자유게시판, 예수동행 (공간확보 및 잘림 방지를 위해 이모티콘 제거) -->
            <div class=""community-subchannels-bar"" id=""communitySubChannelsBar"" style=""display:none;"">
                <div class=""subchannels-row"" style=""gap:4px; justify-content:space-between; padding:4px 0;"">
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-thanks"" onclick=""openFullscreenBoard('감사게시판')"">
                        <span>감사게시판</span>
                    </button>
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-free"" onclick=""openFullscreenBoard('자유게시판')"">
                        <span>자유게시판</span>
                    </button>
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-jesus"" onclick=""openFullscreenBoard('예수동행')"">
                        <span>예수동행</span>
                    </button>
                </div>
            </div>";

            if (text.Contains(oldSubBar))
            {
                text = text.Replace(oldSubBar, newSubBar);
                Console.WriteLine("Removed emojis from communitySubChannelsBar in: " + path);
            }

            // 3. HTML: Remove emojis from communityBoardTabsBar inside modal for consistency
            string oldModalTabs = @"        <!-- 🌟 [사용자 요청] 감사게시판, 자유게시판, 예수동행 3대 게시판 탭 전환 -->
        <div class=""community-board-tabs-bar"" id=""communityBoardTabsBar"">
            <button type=""button"" class=""com-tab-item active"" id=""tabComThanks"" onclick=""switchBoardCategory('감사게시판')"">
                <span>🙏 감사게시판</span>
            </button>
            <button type=""button"" class=""com-tab-item"" id=""tabComFree"" onclick=""switchBoardCategory('자유게시판')"">
                <span>💬 자유게시판</span>
            </button>
            <button type=""button"" class=""com-tab-item"" id=""tabComJesus"" onclick=""switchBoardCategory('예수동행')"">
                <span>✝️ 예수동행</span>
            </button>
        </div>";

            string newModalTabs = @"        <!-- 🌟 [사용자 요청] 감사게시판, 자유게시판, 예수동행 3대 게시판 탭 전환 -->
        <div class=""community-board-tabs-bar"" id=""communityBoardTabsBar"">
            <button type=""button"" class=""com-tab-item active"" id=""tabComThanks"" onclick=""switchBoardCategory('감사게시판')"">
                <span>감사게시판</span>
            </button>
            <button type=""button"" class=""com-tab-item"" id=""tabComFree"" onclick=""switchBoardCategory('자유게시판')"">
                <span>자유게시판</span>
            </button>
            <button type=""button"" class=""com-tab-item"" id=""tabComJesus"" onclick=""switchBoardCategory('예수동행')"">
                <span>예수동행</span>
            </button>
        </div>";

            if (text.Contains(oldModalTabs))
            {
                text = text.Replace(oldModalTabs, newModalTabs);
                Console.WriteLine("Removed emojis from modal tabs in: " + path);
            }

            // 4. JS: Update runMealPrayerLottery to handle clickedNum comparison and fanfare sound condition
            string oldLotteryFunc = @"    function runMealPrayerLottery(clickedNum) {
        if (isMealLotteryRunning) return;
        isMealLotteryRunning = true;

        // 🌟 [사용자 요청] 25% 비율로 정확히 1명 당선, 3명 낙선 (1, 2, 3, 4번 중 1개 랜덤 추첨)
        const winner = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, 4 중 하나 (각 25% 확률)

        const btn = document.getElementById('btnRunMealLottery');
        if (btn) btn.innerText = '추첨 진행 중... 🥁';

        // 0.3초 드럼 롤 후 당선 발표
        setTimeout(() => {
            for (let i = 1; i <= 4; i++) {
                const card = document.getElementById('mealCard_' + i);
                const num = document.getElementById('mealNum_' + i);
                const status = document.getElementById('mealStatus_' + i);

                if (i === winner) {
                    // 🎉 당선자 (25%)
                    if (card) {
                        card.style.background = 'linear-gradient(135deg, #fef08a, #facc15)';
                        card.style.borderColor = '#d97706';
                        card.style.boxShadow = '0 6px 18px rgba(217, 119, 6, 0.45)';
                        card.style.transform = 'scale(1.08)';
                    }
                    if (num) {
                        num.innerHTML = '🎉 ' + i + '번';
                        num.style.color = '#78350f';
                    }
                    if (status) {
                        status.innerHTML = '<strong>당선!</strong> 🙏';
                        status.style.color = '#92400e';
                    }
                } else {
                    // 낙선자 3명 (75%)
                    if (card) {
                        card.style.background = '#f1f5f9';
                        card.style.borderColor = '#e2e8f0';
                        card.style.boxShadow = 'none';
                        card.style.transform = 'scale(0.96)';
                    }
                    if (num) {
                        num.innerText = i + '번';
                        num.style.color = '#94a3b8';
                    }
                    if (status) {
                        status.innerText = '낙선 😊';
                        status.style.color = '#94a3b8';
                    }
                }
            }

            // 결과 안내 배너
            const resultBox = document.getElementById('mealLotteryResultBox');
            const winnerText = document.getElementById('mealResultWinner');
            if (winnerText) winnerText.innerText = '🎉 ' + winner + '번 당선! 🙏';
            if (resultBox) resultBox.style.display = 'block';

            if (btn) {
                btn.innerText = '🎉 ' + winner + '번 당선! (다시 하려면 아래 [다시 뽑기])';
                btn.disabled = true;
            }

            // 🌟 [사용자 요청] 당선 시 신나는 팡파레 / 딩동댕 소리 재생!
            playCelebrationFanfare();
        }, 300);
    }";

            string newLotteryFunc = @"    function runMealPrayerLottery(clickedNum) {
        if (isMealLotteryRunning) return;
        isMealLotteryRunning = true;

        // 🌟 [사용자 요청] 25% 비율로 정확히 1명 당선, 3명 낙선 (1, 2, 3, 4번 중 1개 랜덤 추첨)
        const winner = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, 4 중 하나 (각 25% 확률)

        const btn = document.getElementById('btnRunMealLottery');
        if (btn) btn.innerText = '추첨 진행 중... 🥁';

        // 0.3초 드럼 롤 후 당선 발표
        setTimeout(() => {
            const isUserWon = (clickedNum != null && clickedNum === winner);
            const isUserLost = (clickedNum != null && clickedNum !== winner);

            for (let i = 1; i <= 4; i++) {
                const card = document.getElementById('mealCard_' + i);
                const num = document.getElementById('mealNum_' + i);
                const status = document.getElementById('mealStatus_' + i);

                if (i === winner) {
                    // 🎉 당선자 (25%)
                    if (card) {
                        card.style.background = 'linear-gradient(135deg, #fef08a, #facc15)';
                        card.style.borderColor = '#d97706';
                        card.style.boxShadow = '0 6px 18px rgba(217, 119, 6, 0.45)';
                        card.style.transform = 'scale(1.08)';
                    }
                    if (num) {
                        num.innerHTML = '🎉 ' + i + '번';
                        num.style.color = '#78350f';
                    }
                    if (status) {
                        if (clickedNum != null && i === clickedNum) {
                            status.innerHTML = '<strong style=""color:#b45309;"">내 선택 당선!</strong> 🎉';
                        } else {
                            status.innerHTML = '<strong>당선!</strong> 🙏';
                        }
                        status.style.color = '#92400e';
                    }
                } else {
                    // 낙선자 3명 (75%)
                    if (card) {
                        card.style.background = '#f1f5f9';
                        card.style.borderColor = '#e2e8f0';
                        card.style.boxShadow = 'none';
                        card.style.transform = 'scale(0.96)';
                    }
                    if (num) {
                        num.innerText = i + '번';
                        num.style.color = '#94a3b8';
                    }
                    if (status) {
                        if (clickedNum != null && i === clickedNum) {
                            status.innerHTML = '<span style=""color:#2563eb; font-weight:800;"">내 선택 (낙선 😊)</span>';
                        } else {
                            status.innerText = '낙선 😊';
                            status.style.color = '#94a3b8';
                        }
                    }
                }
            }

            // 결과 안내 배너 (사용자 요청: 본인 누른 번호 당선 시 '당선 엄청 축하합니다', 낙선 시 '낙선을 축하드립니다')
            const resultBox = document.getElementById('mealLotteryResultBox');
            const subText = document.getElementById('mealResultSub');
            const winnerText = document.getElementById('mealResultWinner');
            const passText = document.getElementById('mealResultPass');

            if (isUserWon) {
                // 본인이 누른 번호가 당선된 경우
                if (subText) subText.innerText = '🎉 당선 엄청 축하합니다! 오늘의 은혜로운 대표 기도자입니다!';
                if (winnerText) winnerText.innerText = '🎉 내가 누른 [' + clickedNum + '번] 당선! 🙏';
                if (passText) passText.innerText = '오늘의 대표 식사 기도를 맡으셨습니다. 은혜로운 기도 부탁드립니다 ✨';
                if (resultBox) {
                    resultBox.style.background = 'linear-gradient(135deg, #ecfdf5, #d1fae5)';
                    resultBox.style.borderColor = '#10b981';
                    resultBox.style.display = 'block';
                }
                if (btn) {
                    btn.innerText = '🎉 내가 누른 [' + clickedNum + '번] 당선 엄청 축하합니다!';
                    btn.disabled = true;
                }
                // 🌟 [사용자 요청] 소리는 본인 누른 번호가 당첨(당선)되었을 때만 빵빠레 울림!
                playCelebrationFanfare();
            } else if (isUserLost) {
                // 본인이 누른 번호가 낙선된 경우
                if (subText) subText.innerText = '😊 낙선을 축하드립니다! 맛있게 식사하세요 🍽️';
                if (winnerText) winnerText.innerText = '🎉 ' + winner + '번 당선! (내 번호: ' + clickedNum + '번 낙선)';
                if (passText) passText.innerText = winner + '번 성도님께서 대표 기도해 주십니다. 편안하게 맛있게 드세요 😊';
                if (resultBox) {
                    resultBox.style.background = 'linear-gradient(135deg, #f0fdf4, #eff6ff)';
                    resultBox.style.borderColor = '#60a5fa';
                    resultBox.style.display = 'block';
                }
                if (btn) {
                    btn.innerText = '😊 낙선을 축하드립니다! (' + winner + '번 성도님 당선)';
                    btn.disabled = true;
                }
                // 낙선된 경우에는 빵빠레 울리지 않음!
            } else {
                // 특정 번호 클릭 없이 전체 추첨 버튼을 누른 경우
                if (subText) subText.innerText = '🎉 축하합니다! 오늘의 은혜로운 대표 기도자입니다!';
                if (winnerText) winnerText.innerText = '🎉 ' + winner + '번 당선! 🙏';
                if (passText) passText.innerText = '나머지 번호는 낙선 (맛있게 드세요 😊)';
                if (resultBox) {
                    resultBox.style.background = 'linear-gradient(135deg, #ecfdf5, #d1fae5)';
                    resultBox.style.borderColor = '#10b981';
                    resultBox.style.display = 'block';
                }
                if (btn) {
                    btn.innerText = '🎉 ' + winner + '번 당선! (다시 하려면 아래 [다시 뽑기])';
                    btn.disabled = true;
                }
            }
        }, 300);
    }";

            if (text.Contains(oldLotteryFunc))
            {
                text = text.Replace(oldLotteryFunc, newLotteryFunc);
                Console.WriteLine("Updated runMealPrayerLottery logic in: " + path);
            }

            File.WriteAllText(path, text, new UTF8Encoding(false));
            Console.WriteLine("Done: " + path);
        }
    }
}
