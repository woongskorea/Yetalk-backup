using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string filePath = @"assets/index.html";
        string html = File.ReadAllText(filePath, Encoding.UTF8);

        // Normalize newlines to \n
        string norm = html.Replace("\r\n", "\n").Replace("\r", "\n");

        // 1. In renderFullscreenBoard(): Remove blue category tag span: <span class="board-fullscreen-card-tag">[${tagText}]</span>
        string tagTarget = @"                        <div class=""board-fullscreen-card-author-group"">
                            <span class=""board-fullscreen-card-tag"">[${tagText}]</span>
                            <strong class=""board-fullscreen-card-author"">${displayAuthor}</strong>
                        </div>";
        tagTarget = tagTarget.Replace("\r\n", "\n");

        string newTag = @"                        <div class=""board-fullscreen-card-author-group"">
                            <strong class=""board-fullscreen-card-author"">${displayAuthor}</strong>
                        </div>";

        if (norm.Contains(tagTarget))
        {
            norm = norm.Replace(tagTarget, newTag);
            Console.WriteLine("1. Removed board category tag span.");
        }
        else
        {
            Console.WriteLine("Warning: tagTarget not found!");
        }

        // 2. Add getPostTimestamp and sorting to getLoadedBoardPosts()
        string getPostsTarget = @"    function getLoadedBoardPosts() {
        let posts = [...DEFAULT_BOARD_POSTS];
        try {
            const saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
            if (Array.isArray(saved) && saved.length > 0) {
                const savedIds = new Set(saved.map(s => String(s.id)));
                const remainingDefaults = DEFAULT_BOARD_POSTS.filter(d => !savedIds.has(String(d.id)));
                posts = [...saved, ...remainingDefaults];
            }
        } catch(e) {}
        posts.forEach(p => {
            if (!Array.isArray(p.comments)) p.comments = [];
            if (p.hearts == null) p.hearts = p.views || 0;
        });
        return posts;
    }";
        getPostsTarget = getPostsTarget.Replace("\r\n", "\n");

        string newGetPosts = @"    function getPostTimestamp(item) {
        if (!item) return 0;
        let ts = item.createdAt || item.timestamp;
        if (!ts && typeof item.id === 'number' && item.id > 1600000000000) {
            ts = item.id;
        } else if (!ts && typeof item.id === 'string') {
            if (item.id.startsWith('c_')) {
                const num = parseInt(item.id.replace('c_', ''), 10);
                if (num > 1600000000000) ts = num;
            } else if (item.id.startsWith('user_post_')) {
                const num = parseInt(item.id.replace('user_post_', ''), 10);
                if (num > 1600000000000) ts = num;
            } else if (item.id.startsWith('amen_repent_')) {
                const num = parseInt(item.id.replace('amen_repent_', ''), 10);
                if (num > 1600000000000) ts = num;
            }
        }
        if (ts) return Number(ts);

        const d = (item.date || '').trim();
        const now = Date.now();
        if (!d || d === '방금 전') return now;
        if (d.includes('분 전')) {
            const mins = parseInt(d, 10) || 1;
            return now - mins * 60 * 1000;
        }
        if (d.includes('시간 전')) {
            const hours = parseInt(d, 10) || 1;
            return now - hours * 3600 * 1000;
        }
        if (d === '오늘') {
            // 기본 게시글 중 오늘인 글은 오늘 시각(1~2시간 전) 부여
            return now - 2 * 3600 * 1000;
        }
        if (d === '어제' || d === '1일 전') return now - 24 * 3600 * 1000;
        if (d === '2일 전') return now - 48 * 3600 * 1000;
        if (d === '3일 전') return now - 72 * 3600 * 1000;
        if (d.includes('일 전')) {
            const days = parseInt(d, 10) || 3;
            return now - days * 24 * 3600 * 1000;
        }
        const parsed = new Date(d).getTime();
        return isNaN(parsed) ? (now - 100 * 3600 * 1000) : parsed;
    }

    // 🌟 [사용자 요청] 최신 글이 제일 위에 올라오도록 시간 역순(최신순) 엄격 정렬
    function getLoadedBoardPosts() {
        let posts = [...DEFAULT_BOARD_POSTS];
        try {
            const saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
            if (Array.isArray(saved) && saved.length > 0) {
                const savedIds = new Set(saved.map(s => String(s.id)));
                const remainingDefaults = DEFAULT_BOARD_POSTS.filter(d => !savedIds.has(String(d.id)));
                posts = [...saved, ...remainingDefaults];
            }
        } catch(e) {}
        posts.forEach(p => {
            if (!Array.isArray(p.comments)) p.comments = [];
            if (p.hearts == null) p.hearts = p.views || 0;
        });
        posts.sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
        return posts;
    }";

        if (norm.Contains(getPostsTarget))
        {
            norm = norm.Replace(getPostsTarget, newGetPosts);
            Console.WriteLine("2. Added strict date sorting (latest first) to getLoadedBoardPosts.");
        }
        else
        {
            Console.WriteLine("Warning: getPostsTarget not found!");
        }

        // 3. Add submitDailyRepentAmenToThanksBoard() and bind to window
        string amenJsTarget = @"    // 🌟 [사용자 요청] '매일회개 & 영적승리' 기도문 모달 열기/닫기";
        string newAmenJs = @"    // 🌟 [사용자 요청] 매일회개 끝나고 아멘 터치 시 감사게시판으로 '아멘! 기도의 제단을 매일 쌓아가겠습니다.' 자동 등록
    function submitDailyRepentAmenToThanksBoard() {
        const uName = (localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalk_user_id"") || ""은혜 성도"").trim();
        const newPost = {
            id: ""amen_repent_"" + Date.now(),
            createdAt: Date.now(),
            timestamp: Date.now(),
            author: uName,
            board: ""감사게시판"",
            tag: ""감사게시판"",
            title: ""아멘! 기도의 제단을 매일 쌓아가겠습니다."",
            text: ""만군의 여호와 하나님 앞에서 매일 회개하며 십자가 보혈의 능력과 성령의 불로 승리합니다. 아멘! 기도의 제단을 매일 쌓아가겠습니다. 🙏"",
            date: ""방금 전"",
            hearts: 1,
            views: 1,
            photo: """",
            link: """",
            comments: []
        };
        let saved = [];
        try {
            saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
        } catch(e) {}
        saved.unshift(newPost);
        localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));

        closeDailyRepentVictoryModal();
        alert(""🙏 감사게시판에 '아멘! 기도의 제단을 매일 쌓아가겠습니다.'가 등록되었습니다."");
        if (typeof renderFullscreenBoard === 'function') {
            renderFullscreenBoard();
        }
    }
    window.submitDailyRepentAmenToThanksBoard = submitDailyRepentAmenToThanksBoard;

    // 🌟 [사용자 요청] '매일회개 & 영적승리' 기도문 모달 열기/닫기";

        if (norm.Contains(amenJsTarget))
        {
            norm = norm.Replace(amenJsTarget, newAmenJs);
            Console.WriteLine("3. Added submitDailyRepentAmenToThanksBoard function.");
        }
        else
        {
            Console.WriteLine("Warning: amenJsTarget not found!");
        }

        // 4. Update dailyRepentVictoryModal button to call submitDailyRepentAmenToThanksBoard()
        string amenBtnTarget = @"                <!-- 하단 은혜의 확인 버튼 -->
                <div style=""display:flex; justify-content:center; margin-top:20px; padding-bottom:14px;"">
                    <button type=""button"" onclick=""closeDailyRepentVictoryModal()"" style=""height:48px; width:100%; max-width:320px; background:linear-gradient(135deg, #1d4ed8, #1e3a8a); color:#ffffff; border:none; border-radius:12px; font-size:16px; font-weight:950; cursor:pointer; box-shadow:0 3px 12px rgba(29,78,216,0.35);"">
                        🙏 아멘 · 은혜로 승리하기
                    </button>
                </div>";
        amenBtnTarget = amenBtnTarget.Replace("\r\n", "\n");

        string newAmenBtn = @"                <!-- 하단 은혜의 확인 버튼 (감사게시판 자동 연동) -->
                <div style=""display:flex; justify-content:center; margin-top:20px; padding-bottom:14px;"">
                    <button type=""button"" onclick=""submitDailyRepentAmenToThanksBoard()"" style=""height:48px; width:100%; max-width:340px; background:linear-gradient(135deg, #1d4ed8, #1e3a8a); color:#ffffff; border:none; border-radius:12px; font-size:15.5px; font-weight:950; cursor:pointer; box-shadow:0 3px 12px rgba(29,78,216,0.35); display:inline-flex; align-items:center; justify-content:center; gap:6px;"" title=""감사게시판에 아멘 결단 등록"">
                        <span>🙏</span> <span>아멘! 기도의 제단을 매일 쌓아가겠습니다</span>
                    </button>
                </div>";

        if (norm.Contains(amenBtnTarget))
        {
            norm = norm.Replace(amenBtnTarget, newAmenBtn);
            Console.WriteLine("4. Updated dailyRepentVictoryModal button to auto-post Amen to Thanks Board.");
        }
        else
        {
            Console.WriteLine("Warning: amenBtnTarget not found!");
        }

        // 5. In kkajitgeotModal: Update title text, insert heaven bus image, update item 3, simplify end, add fixed bottom AdMob
        string heavenBusHeadTarget = @"                <!-- 2) 🌟 [사용자 요청] 천국 버스에서 내려서 천국에 도달하지 못하는 마귀의 유혹에 넘어가지 맙시다 & 영적 탈락(불합격) 원인 14선 -->
                <div style=""padding-bottom:20px; border-bottom:1.5px solid #e2e8f0;"">
                    <div style=""margin-bottom:22px;"">
                        <div style=""font-size:20px; font-weight:950; color:#b91c1c; letter-spacing:-0.3px; line-height:1.45; margin-bottom:8px;"">
                            🚍 천국 버스에서 내려서 천국에 도달하지 못하는 마귀의 유혹에 넘어가지 맙시다.
                        </div>
                        <div style=""font-size:18px; font-weight:950; color:#0f172a;"">
                            [천국버스] 영적 탈락(불합격) 원인 14선
                        </div>
                    </div>";
        heavenBusHeadTarget = heavenBusHeadTarget.Replace("\r\n", "\n");

        string newHeavenBusHead = @"                <!-- 2) 🌟 [사용자 요청] 천국버스에 탄 우리 조차도 마귀는 미혹하려고 합니다 + 세상쾌락 정류장 그림 삽입 + 영적 탈락 원인 14선 -->
                <div style=""padding-bottom:20px; border-bottom:1.5px solid #e2e8f0;"">
                    <div style=""margin-bottom:18px;"">
                        <div style=""font-size:20px; font-weight:950; color:#b91c1c; letter-spacing:-0.3px; line-height:1.45; margin-bottom:6px;"">
                            🚍 천국버스에 탄 우리조차도 마귀는 미혹하려고 합니다.
                        </div>
                        <div style=""font-size:16px; font-weight:900; color:#0f172a; margin-bottom:14px;"">
                            [천국버스] 영적 탈락(불합격) 원인 14선
                        </div>
                        <!-- 🌟 [사용자 요청] 세상쾌락 정류장의 미혹 그림 삽입 -->
                        <div style=""width:100%; border-radius:14px; overflow:hidden; box-shadow:0 4px 18px rgba(0,0,0,0.15); margin-bottom:16px;"">
                            <img src=""images/heaven_bus_temptation.jpg"" alt=""천국버스 세상쾌락 정류장의 미혹"" style=""width:100%; height:auto; display:block;"">
                        </div>
                    </div>";

        if (norm.Contains(heavenBusHeadTarget))
        {
            norm = norm.Replace(heavenBusHeadTarget, newHeavenBusHead);
            Console.WriteLine("5. Updated heaven bus text and inserted image.");
        }
        else
        {
            Console.WriteLine("Warning: heavenBusHeadTarget not found!");
        }

        // 6. Update item 3 in kkajitgeotModal
        string item3Target = @"                        <!-- 3 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                3. 주님과의 인격적 친밀함이 없는 종교적 외식 <span style=""color:#dc2626;"">(마 7:23)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “그 때에 내가 그들에게 밝히 말하되 내가 너희를 도무지 알지 못하니 불법을 행하는 자들아 내게서 떠나가라 하리라”
                            </div>
                        </div>";
        item3Target = item3Target.Replace("\r\n", "\n");

        string newItem3 = @"                        <!-- 3 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                3. 믿는다 하면서 행함을 무시하는 자 <span style=""color:#dc2626;"">(약 2:14, 마 7:23)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “내 형제들아 만일 사람이 믿음이 있노라 하고 행함이 없으면 무슨 유익이 있으리요 그 믿음이 능히 자기를 구원하겠느냐... 그 때에 내가 그들에게 밝히 말하되 내가 너희를 도무지 알지 못하니 불법을 행하는 자들아 내게서 떠나가라 하리라” (약 2:14, 마 7:23)
                            </div>
                        </div>";

        if (norm.Contains(item3Target))
        {
            norm = norm.Replace(item3Target, newItem3);
            Console.WriteLine("6. Updated Item 3 to '믿는다 하면서 행함을 무시하는 자'.");
        }
        else
        {
            Console.WriteLine("Warning: item3Target not found!");
        }

        // 7. Simplify end of kkajitgeotModal and add fixed bottom AdMob
        string scrollDivTarget = @"            <!-- 2. 작은 박스 없이 시원하게 글자 크게 무한 스크롤되는 본문 영역 -->
            <div style=""flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:22px 18px 90px 18px; display:flex; flex-direction:column; gap:30px;"">";
        scrollDivTarget = scrollDivTarget.Replace("\r\n", "\n");

        string newScrollDiv = @"            <!-- 2. 작은 박스 없이 시원하게 글자 크게 무한 스크롤되는 본문 영역 (하단 고정 애드몹 분리) -->
            <div style=""flex:1; min-height:0; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:22px 18px 24px 18px; display:flex; flex-direction:column; gap:26px;"">";

        if (norm.Contains(scrollDivTarget))
        {
            norm = norm.Replace(scrollDivTarget, newScrollDiv);
            Console.WriteLine("7-1. Updated scroll div with min-height: 0.");
        }

        string endAreaTarget = @"                <!-- 6) 🌟 [사용자 요청] 14개가 다 끝난 후 글 적는 공간 배치: 나 개인의 믿음의 고백과 순종결단 (오직 본인만 볼 수 있음) -->
                <div style=""padding-top:10px;"">
                    <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"">
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <span style=""font-size:22px;"">✍️</span>
                            <strong style=""font-size:18px; font-weight:950; color:#0369a1;"">나 개인의 믿음의 고백과 순종결단</strong>
                        </div>
                        <span style=""font-size:12px; font-weight:900; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:8px;"">🔒 오직 본인만 볼 수 있음</span>
                    </div>
                    <div style=""font-size:13.5px; color:#64748b; margin-bottom:10px; line-height:1.45;"">
                        14가지 천국 말씀 앞에서 나를 돌아보고, 주님 앞에 드리는 진솔한 믿음의 고백과 순종 결단을 기록해 보세요.
                    </div>
                    <textarea id=""inpMyPersonalConfession"" rows=""4"" style=""width:100%; box-sizing:border-box; background:#f8fafc; border:1.8px solid #cbd5e1; border-radius:12px; color:#0f172a; font-size:16.5px; font-family:inherit; line-height:1.75; padding:14px; resize:none; outline:none; transition:border-color 0.15s ease;"" placeholder=""주님, 헛된 종교적 외식을 버리고 오직 성령 안에서 깨어 끝까지 말씀에 순종하며 살아가겠습니다...""></textarea>
                    
                    <div style=""display:flex; justify-content:flex-end; gap:8px; margin-top:12px;"">
                        <button type=""button"" onclick=""saveMyPersonalConfession()"" style=""height:44px; padding:0 24px; background:linear-gradient(135deg, #0284c7, #0369a1); color:#ffffff; border:none; border-radius:10px; font-size:15px; font-weight:950; cursor:pointer; box-shadow:0 2px 6px rgba(2,132,199,0.3);"">
                            💾 믿음의 고백과 순종결단 등록
                        </button>
                    </div>

                    <!-- 기 등록된 나만의 고백 카드 표시 -->
                    <div id=""boxSavedPersonalConfession"" style=""display:none; margin-top:14px; background:#f0f9ff; border:1.5px dashed #7dd3fc; border-radius:12px; padding:14px 16px;"">
                        <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"">
                            <span style=""font-size:13.5px; font-weight:950; color:#0369a1;"">📜 내가 등록한 믿음의 고백과 순종결단</span>
                            <span id=""txtPersonalConfessionDate"" style=""font-size:12px; color:#64748b;""></span>
                        </div>
                        <div id=""txtSavedPersonalConfession"" style=""font-size:16px; color:#0f172a; line-height:1.75; font-weight:800; white-space:pre-wrap; word-break:keep-all;""></div>
                    </div>
                </div>

                <!-- 7) 🌟 [사용자 요청] 마지막에 애드몹 250은 기본^^ -->
                <div style=""display:flex; justify-content:center; align-items:center; margin:16px 0 20px 0;"">
                    <div style=""width:300px; height:250px; background:#0f172a; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#ffffff; text-align:center; padding:16px; box-sizing:border-box; box-shadow:0 4px 16px rgba(0,0,0,0.2);"">
                        <div style=""display:inline-block; background:#0284c7; color:#fff; font-size:11px; font-weight:900; padding:2px 8px; border-radius:4px; margin-bottom:12px;"">AD</div>
                        <div style=""font-size:16.5px; font-weight:950; color:#38bdf8; margin-bottom:6px;"">Google AdMob (300 x 250)</div>
                        <div style=""font-size:12.5px; color:#94a3b8; line-height:1.5;"">대한민국 교회 · 목회자 · 소상공인<br>공식 스폰서 대형 배너 슬롯</div>
                    </div>
                </div>

            </div>
        </div>
    </div>";
        endAreaTarget = endAreaTarget.Replace("\r\n", "\n");

        string newEndArea = @"                <!-- 6) 🌟 [사용자 요청] 맨 마지막 영역 심플화: 나의 믿음의 고백과 순종결단 -->
                <div style=""padding-top:14px; border-top:1.5px solid #e2e8f0;"">
                    <div style=""font-size:16px; font-weight:950; color:#0f172a; margin-bottom:6px;"">
                        ✍️ 나의 믿음의 고백과 순종 결단
                    </div>
                    <textarea id=""inpMyPersonalConfession"" rows=""3"" style=""width:100%; box-sizing:border-box; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; color:#0f172a; font-size:15px; font-family:inherit; line-height:1.6; padding:10px 12px; resize:none; outline:none;"" placeholder=""주님 앞에 드리는 진솔한 믿음의 고백과 순종 결단을 기록해 보세요...""></textarea>
                    
                    <button type=""button"" onclick=""saveMyPersonalConfession()"" style=""height:42px; width:100%; margin-top:8px; background:linear-gradient(135deg, #0284c7, #0369a1); color:#ffffff; border:none; border-radius:10px; font-size:15px; font-weight:950; cursor:pointer; box-shadow:0 2px 6px rgba(2,132,199,0.3);"">
                        💾 나의 믿음의 고백 등록
                    </button>

                    <!-- 기 등록된 나만의 고백 카드 표시 -->
                    <div id=""boxSavedPersonalConfession"" style=""display:none; margin-top:10px; background:#f0f9ff; border:1px solid #7dd3fc; border-radius:10px; padding:10px 12px;"">
                        <div style=""font-size:12px; font-weight:900; color:#0369a1; margin-bottom:4px;"">📜 등록된 나의 신앙결단 (<span id=""txtPersonalConfessionDate""></span>)</div>
                        <div id=""txtSavedPersonalConfession"" style=""font-size:14.5px; color:#0f172a; line-height:1.6; font-weight:800; white-space:pre-wrap; word-break:keep-all;""></div>
                    </div>
                </div>

            </div>

            <!-- 🌟 [사용자 요청] 까짓것 모달 하단 고정 애드몹 (소상공인·교회·의원 공식 스폰서 슬롯) -->
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

        if (norm.Contains(endAreaTarget))
        {
            norm = norm.Replace(endAreaTarget, newEndArea);
            Console.WriteLine("7-2. Simplified end of kkajitgeotModal and added bottom fixed AdMob.");
        }
        else
        {
            Console.WriteLine("Warning: endAreaTarget not found!");
        }

        // Write back with CRLF
        string finalHtml = norm.Replace("\n", "\r\n");
        File.WriteAllText(filePath, finalHtml, new UTF8Encoding(false));
        Console.WriteLine("All changes successfully written to assets/index.html!");
    }
}
