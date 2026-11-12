using System;
using System.IO;
using System.Text;

class ApplyKkajitgeotAndStarSort
{
    static void Main()
    {
        string[] paths = new string[]
        {
            @"assets\index.html",
            @"docs\index.html",
            @"app\src\main\assets\index.html"
        };

        foreach (string path in paths)
        {
            if (!File.Exists(path))
            {
                Console.WriteLine("File not found: " + path);
                continue;
            }

            string content = File.ReadAllText(path, Encoding.UTF8).Replace("\r\n", "\n");

            // ========================================================
            // 1. Update the '까짓것 ▶' button to include '별거아냐' and proper inline style
            // ========================================================
            string oldBtnPattern = @"<button type=""button"" class=""btn-best-book-open"" onclick=""event.stopPropagation(); openKkajitgeotModal()"" style=""background:linear-gradient(135deg, #dc2626, #b91c1c); box-shadow:0 3px 10px rgba(220,38,38,0.4);"">
                까짓것 ▶
            </button>";

            string newBtnHtml = @"<button type=""button"" class=""btn-best-book-open"" onclick=""event.stopPropagation(); openKkajitgeotModal()"" style=""background:linear-gradient(135deg, #dc2626, #b91c1c); box-shadow:0 3px 10px rgba(220,38,38,0.4); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; padding:8px 12px; min-width:85px; cursor:pointer;"">
                <span style=""font-size:14.5px; font-weight:950; letter-spacing:-0.2px;"">까짓것 ▶</span>
                <span style=""font-size:11.5px; font-weight:800; opacity:0.95; letter-spacing:-0.2px;"">별거아냐</span>
            </button>";

            if (content.Contains(oldBtnPattern))
            {
                content = content.Replace(oldBtnPattern, newBtnHtml);
            }

            content = content.Replace(
                @"title=""까짓것! 나의 신앙고백 &amp; 결단""",
                @"title=""까짓것! 별거아냐 - 나의 신앙고백 &amp; 결단"""
            );

            // ========================================================
            // 2. Add CSS rule for #kkajitgeotModal.modal-overlay.show
            // ========================================================
            string cssToInsert = @"
        #kkajitgeotModal.modal-overlay {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
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
        #kkajitgeotModal.modal-overlay.show {
            display: flex !important;
        }
";
            if (!content.Contains("#kkajitgeotModal.modal-overlay.show"))
            {
                int cssInsertIdx = content.IndexOf("#christianFriendsModal.modal-overlay {");
                if (cssInsertIdx >= 0)
                {
                    content = content.Insert(cssInsertIdx, cssToInsert + "\n");
                }
            }

            // ========================================================
            // 3. Swap Invite Buttons: [🔗 링크 복사] first, [💬 카톡으로 초청장 보내기] second
            // ========================================================
            string oldInviteBtns = @"                <div style=""display:flex; gap:8px; margin-bottom:10px;"">
                    <button type=""button"" id=""btnSendKakaoAction"" onclick=""shareChristianInviteKakao()"" style=""flex:1; height:42px; background:#fee500; color:#191919; border:none; border-radius:10px; font-size:14px; font-weight:950; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 2px 6px rgba(254,229,0,0.35); transition:all 0.15s ease;"">
                        <span style=""font-size:16px;"">💬</span>
                        <span>카톡으로 초청장 보내기</span>
                    </button>
                    <button type=""button"" id=""btnCopyInviteAction"" onclick=""copyChristianInvite()"" style=""height:42px; padding:0 14px; background:#0284c7; color:#ffffff; border:none; border-radius:10px; font-size:13.5px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px; box-shadow:0 2px 6px rgba(2,132,199,0.25); white-space:nowrap; transition:all 0.15s ease;"">
                        <span>🔗 링크 복사</span>
                    </button>
                </div>";

            string newInviteBtns = @"                <!-- 🌟 [사용자 요청] 링크 복사 후 카톡 보내기 순서로 배치 (링크 복사 먼저, 카톡 보내기 다음) -->
                <div style=""display:flex; gap:8px; margin-bottom:10px;"">
                    <button type=""button"" id=""btnCopyInviteAction"" onclick=""copyChristianInvite()"" style=""flex:1; height:42px; background:#0284c7; color:#ffffff; border:none; border-radius:10px; font-size:14px; font-weight:950; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 2px 6px rgba(2,132,199,0.25); white-space:nowrap; transition:all 0.15s ease;"">
                        <span style=""font-size:15px;"">🔗</span>
                        <span>링크 복사</span>
                    </button>
                    <button type=""button"" id=""btnSendKakaoAction"" onclick=""shareChristianInviteKakao()"" style=""flex:1.25; height:42px; background:#fee500; color:#191919; border:none; border-radius:10px; font-size:14px; font-weight:950; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 2px 6px rgba(254,229,0,0.35); transition:all 0.15s ease;"">
                        <span style=""font-size:16px;"">💬</span>
                        <span>카톡으로 초청장 보내기</span>
                    </button>
                </div>";

            if (content.Contains(oldInviteBtns))
            {
                content = content.Replace(oldInviteBtns, newInviteBtns);
            }

            // ========================================================
            // 4. Update openChristianFriendsModal(): Starred on top + Korean Alphabetical Sort (가나다순)
            // ========================================================
            int funcIdx = content.IndexOf("function openChristianFriendsModal() {");
            if (funcIdx >= 0)
            {
                int funcEnd = content.IndexOf("function registerNewChristianFriend() {", funcIdx);
                if (funcEnd >= 0)
                {
                    string newFriendsFunc = @"function openChristianFriendsModal() {
        const churchName = localStorage.getItem(""yetalk_church_name"") || ""부산제일감리교회"";
        const pastorName = localStorage.getItem(""yetalk_pastor_name"") || """";
        const churchKey = localStorage.getItem(""yetalk_church_key"") || normalizeChurchKey(churchName, pastorName);

        const badge = document.getElementById(""txtFriendChurchNameBadge"");
        if (badge) badge.innerText = churchName;

        let churchMap = {};
        try {
            churchMap = JSON.parse(localStorage.getItem(""yetalk_registered_churches"") || ""{}"");
        } catch(e) { churchMap = {}; }

        let customFriends = [];
        try {
            customFriends = JSON.parse(localStorage.getItem(""yetalk_custom_friends"") || ""[]"");
        } catch(e) { customFriends = []; }

        let members = [];
        if (churchKey && churchMap[churchKey] && churchMap[churchKey].members && churchMap[churchKey].members.length > 0) {
            members = [...churchMap[churchKey].members];
        }

        // customFriends 병합
        customFriends.forEach(cf => {
            if (!members.some(m => m.nameOrId === cf.nameOrId)) {
                members.push(cf);
            }
        });

        // 현재 사용자 본인 포함 보장
        const myName = localStorage.getItem(""yetalk_user_name"") || ""최베드로"";
        const myRole = localStorage.getItem(""yetalk_church_role"") || ""성도"";
        if (members.length === 0) {
            members = [
                { nameOrId: myName, role: myRole },
                { nameOrId: ""김요한"", role: ""성도"" },
                { nameOrId: ""박에스더"", role: ""사무사역자"" },
                { nameOrId: ""이다윗"", role: ""집사"" },
                { nameOrId: ""정마리아"", role: ""권사"" }
            ];
        } else if (!members.some(m => m.nameOrId === myName)) {
            members.unshift({ nameOrId: myName, role: myRole });
        }

        // 🌟 [사용자 요청] 별 체크 여부 불러오기
        let starredFriends = [];
        try {
            starredFriends = JSON.parse(localStorage.getItem(""yetalk_starred_friends"") || ""[]"");
        } catch(e) { starredFriends = []; }

        // 🌟 [사용자 요청] 1순위: 별표 체크된 교우가 최상단 / 2순위: 가나다라 순서(이름 오름차순) 정렬!
        members.sort((a, b) => {
            const aStarred = starredFriends.includes(a.nameOrId);
            const bStarred = starredFriends.includes(b.nameOrId);
            if (aStarred && !bStarred) return -1;
            if (!aStarred && bStarred) return 1;
            return (a.nameOrId || '').localeCompare(b.nameOrId || '', 'ko');
        });

        // 총 인원수 배지 갱신
        const totalCountEl = document.getElementById(""txtFriendTotalCount"");
        if (totalCountEl) totalCountEl.innerText = `총 ${members.length}명`;

        // 🌟 [사용자 요청] 수십, 수백명도 한 줄로 아래로 시원하게 스크롤되는 리스트 렌더링 + 별표(상단고정) 토글 버튼
        const row = document.getElementById(""christianRegisteredMembersRow"");
        if (row) {
            row.innerHTML = members.map((m, idx) => {
                const initial = (m.nameOrId || ""교"").substring(0, 1);
                const isMe = (m.nameOrId === myName);
                const isStarred = starredFriends.includes(m.nameOrId);
                return `
                <div style=""display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:${isStarred ? '#fffbeb' : '#ffffff'}; border:${isStarred ? '1.8px solid #fde047' : '1px solid #e2e8f0'}; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.03); transition:all 0.15s ease;"">
                    <div style=""display:flex; align-items:center; gap:8px; min-width:0;"">
                        <!-- 🌟 [사용자 요청] 별표 토글 버튼 (누르면 상단 고정 / 해제) -->
                        <button type=""button"" onclick=""toggleStarChristianFriend('${m.nameOrId}')"" title=""${isStarred ? '상단 고정 별표 해제' : '최상단 고정 별표 등록'}"" style=""background:none; border:none; cursor:pointer; font-size:20px; padding:2px 4px; line-height:1; color:${isStarred ? '#f59e0b' : '#cbd5e1'}; flex-shrink:0; transition:transform 0.1s ease;"">
                            ${isStarred ? '★' : '☆'}
                        </button>
                        <div style=""width:36px; height:36px; border-radius:50%; background:${isMe ? '#ecfdf5' : '#f0f9ff'}; border:1.5px solid ${isMe ? '#a7f3d0' : '#bae6fd'}; color:${isMe ? '#059669' : '#0284c7'}; display:flex; align-items:center; justify-content:center; font-size:14.5px; font-weight:950; flex-shrink:0;"">
                            ${initial}
                        </div>
                        <div style=""display:flex; flex-direction:column; min-width:0;"">
                            <div style=""display:flex; align-items:center; gap:6px;"">
                                <span style=""font-size:15.5px; font-weight:950; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"">${m.nameOrId}</span>
                                <span style=""font-size:11px; font-weight:800; color:${isMe ? '#059669' : '#0369a1'}; background:${isMe ? '#dcfce7' : '#e0f2fe'}; padding:1px 6px; border-radius:6px; flex-shrink:0;"">${isMe ? '나' : (m.role || '성도')}</span>
                            </div>
                        </div>
                    </div>
                    <div style=""display:flex; gap:6px; align-items:center; flex-shrink:0;"">
                        <button type=""button"" onclick=""openMemberPrivateChat('${m.nameOrId}', '${m.role || ''}')"" style=""padding:6px 12px; background:#0284c7; color:#ffffff; border:none; border-radius:8px; font-size:13px; font-weight:900; cursor:pointer; display:flex; align-items:center; gap:4px; box-shadow:0 1.5px 4px rgba(2,132,199,0.25);"">
                            <span>예톡</span>
                            <span style=""background:#ef4444; color:#fff; font-size:10px; font-weight:950; padding:1px 5px; border-radius:8px;"">1</span>
                        </button>
                        <button type=""button"" onclick=""shareChristianInviteKakao('${m.nameOrId}')"" style=""padding:6px 12px; background:#fee500; color:#191919; border:none; border-radius:8px; font-size:13px; font-weight:900; cursor:pointer; box-shadow:0 1.5px 4px rgba(254,229,0,0.3);"">
                            카톡
                        </button>
                        ${!isMe ? `<button type=""button"" onclick=""deleteChristianFriend('${m.nameOrId}')"" title=""삭제"" style=""background:none; border:none; color:#94a3b8; font-size:15px; cursor:pointer; padding:4px 6px; border-radius:4px;"">✕</button>` : ''}
                    </div>
                </div>
            `}).join("""");
        }

        const modal = document.getElementById(""christianFriendsModal"");
        if (modal) modal.classList.add(""show"");
    }

    // 🌟 [사용자 요청] 교우 별표(즐겨찾기/상단고정) 토글 함수
    function toggleStarChristianFriend(friendName) {
        let starred = [];
        try {
            starred = JSON.parse(localStorage.getItem(""yetalk_starred_friends"") || ""[]"");
        } catch(e) { starred = []; }
        const idx = starred.indexOf(friendName);
        if (idx >= 0) {
            starred.splice(idx, 1);
            showBibleToast(`⭐ [${friendName}] 별표 해제`);
        } else {
            starred.push(friendName);
            showBibleToast(`⭐ [${friendName}] 상단 고정 등록!`);
        }
        localStorage.setItem(""yetalk_starred_friends"", JSON.stringify(starred));
        openChristianFriendsModal();
    }
    window.toggleStarChristianFriend = toggleStarChristianFriend;
";
                    content = content.Substring(0, funcIdx) + newFriendsFunc + "\n    " + content.Substring(funcEnd);
                }
            }

            // ========================================================
            // 5. Replace entire #kkajitgeotModal with updated content:
            //    - Title: 까짓것! 별거아냐 - 나의 신앙고백 & 결단
            //    - 3. 항상 깨어 낮은 자세로 바짝 엎드려 기도하라
            //    - 오늘 회개하며 기도할 것 (오직 나만 볼 수 있음)
            // ========================================================
            int modalStartIdx = content.IndexOf("<div class=\"modal-overlay\" id=\"kkajitgeotModal\"");
            if (modalStartIdx >= 0)
            {
                int modalEndIdx = content.IndexOf("</body>", modalStartIdx);
                if (modalEndIdx >= 0)
                {
                    string newModalHtml = @"    <!-- 🌟 [사용자 요청] 까짓것! 별거아냐 - 나의 신앙고백 & 결단, 천국 버스 주의사항, 성경 본문 전체, 항상 깨어 바짝 엎드려 기도하라, 오늘 회개하며 기도할 것, 개인 고백 등록창, 애드몹 250 풀스크린 모달 -->
    <div class=""modal-overlay"" id=""kkajitgeotModal"" style=""position:fixed !important; inset:0 !important; width:100vw !important; height:100vh !important; max-width:100vw !important; max-height:100vh !important; background:#ffffff !important; z-index:99999 !important; display:none; flex-direction:column !important; padding:0 !important; margin:0 !important; box-sizing:border-box !important; overflow:hidden !important; backdrop-filter:none !important;"">
        <div style=""width:100%; height:100%; max-width:680px; margin:0 auto; background:#ffffff; display:flex; flex-direction:column; overflow:hidden; box-sizing:border-box;"">
            <!-- 1. 상단 고정 헤더 -->
            <div style=""height:52px; background:#ffffff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 16px; flex-shrink:0;"">
                <button type=""button"" onclick=""closeKkajitgeotModal()"" style=""background:none; border:none; color:#334155; font-size:15px; font-weight:950; cursor:pointer; display:flex; align-items:center; gap:4px; padding:6px 0;"">
                    <span>← 뒤로</span>
                </button>
                <div style=""font-size:16.5px; font-weight:950; color:#0f172a; display:flex; align-items:center; gap:6px;"">
                    <span>👑</span>
                    <span>까짓것! 별거아냐 - 나의 신앙고백 &amp; 결단</span>
                </div>
                <button type=""button"" onclick=""closeKkajitgeotModal()"" style=""width:32px; height:32px; border-radius:50%; background:#f1f5f9; border:none; color:#475569; font-size:16px; font-weight:950; cursor:pointer; display:flex; align-items:center; justify-content:center;"">✕</button>
            </div>

            <!-- 2. 무한대로 쭉 스크롤되는 본문 영역 -->
            <div style=""flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:18px 16px 60px 16px; display:flex; flex-direction:column; gap:20px;"">

                <!-- 1) 나의 신앙고백 메인 선언 (황금빛 카드) -->
                <div style=""background:linear-gradient(135deg, #fefce8 0%, #fffbeb 100%); border:2px solid #fde047; border-radius:16px; padding:20px 18px; box-shadow:0 4px 14px rgba(234,179,8,0.15);"">
                    <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px;"">
                        <span style=""font-size:24px;"">🔥</span>
                        <strong style=""font-size:19px; font-weight:950; color:#854d0e; letter-spacing:-0.3px;"">“까짓것! 별거아냐! 나의 상황 관계없이 믿습니다!”</strong>
                    </div>
                    <div style=""font-size:16px; font-weight:800; color:#1e293b; line-height:1.85; word-break:keep-all;"">
                        “나의 상황 관계없이 믿습니다.<br><br>
                        기도한 것은 이미 받은 줄로 믿고 현실로 보일 때까지 기도하겠습니다.<br><br>
                        나의 인생이 아니라 구원받은 자로서 말씀에 순종하며 주님의 뜻에 합당한 삶을 감사하며 기도로 살아가겠습니다...<br><br>
                        성경 말씀 그대로 순종하며 믿겠습니다.<br><br>
                        <strong>나의 주 나의 왕 나의 형님! 말씀만 하시옵소서. 아멘</strong>”
                    </div>
                </div>

                <!-- 2) 천국 버스 안내 및 주의사항 -->
                <div style=""background:#f0fdf4; border:1.8px solid #86efac; border-radius:16px; padding:18px 16px;"">
                    <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px;"">
                        <span style=""font-size:22px;"">🚌</span>
                        <strong style=""font-size:17.5px; font-weight:950; color:#15803d; line-height:1.4;"">
                            천국 버스에 탄 이상 성경에서 말씀하시는 천국 버스에서 내리는 불상사가 없도록 합시다.
                        </strong>
                    </div>
                    
                    <!-- 주의사항 1 -->
                    <div style=""background:#ffffff; border:1px solid #bbf7d0; border-radius:12px; padding:14px; margin-bottom:12px;"">
                        <div style=""font-size:15px; font-weight:950; color:#166534; margin-bottom:6px; display:flex; align-items:center; gap:6px;"">
                            <span style=""background:#dcfce7; color:#15803d; padding:2px 7px; border-radius:6px; font-size:12px;"">주의사항 1</span>
                            <span>오직 나의 의인은 믿음으로 살며 뒤로 물러가지 말라</span>
                        </div>
                        <div style=""font-size:14.5px; color:#1e293b; line-height:1.75; word-break:keep-all;"">
                            “오직 나의 의인은 믿음으로 말미암아 살리라 또한 뒤로 물러가면 내 마음이 그를 기뻐하지 아니하리라 하셨느니라 우리는 뒤로 물러가 멸망할 자가 아니요 오직 영혼을 구원함에 이르는 믿음을 가진 자니라” 
                            <span style=""font-size:13px; font-weight:950; color:#059669;"">(히브리서 10:38-39)</span>
                        </div>
                    </div>

                    <!-- 주의사항 2 -->
                    <div style=""background:#ffffff; border:1px solid #bbf7d0; border-radius:12px; padding:14px;"">
                        <div style=""font-size:15px; font-weight:950; color:#166534; margin-bottom:6px; display:flex; align-items:center; gap:6px;"">
                            <span style=""background:#dcfce7; color:#15803d; padding:2px 7px; border-radius:6px; font-size:12px;"">주의사항 2</span>
                            <span>스스로 속이지 말고 성령을 위하여 심으라</span>
                        </div>
                        <div style=""font-size:14.5px; color:#1e293b; line-height:1.75; word-break:keep-all;"">
                            “스스로 속이지 말라 하나님은 업신여김을 받지 아니하시나니 사람이 무엇으로 심든지 그대로 거두리라 자기의 육체를 위하여 심는 자는 육체로부터 썩어질 것을 거두고 성령을 위하여 심는 자는 성령으로부터 영생을 거두리라” 
                            <span style=""font-size:13px; font-weight:950; color:#059669;"">(갈라디아서 6:7-8)</span>
                        </div>
                    </div>
                </div>

                <!-- 3) 1. 가말리엘의 조언 (사도행전 5:38-39) & 성경 본문 전체 -->
                <div style=""background:#f8fafc; border:1.8px solid #cbd5e1; border-radius:16px; padding:18px 16px;"">
                    <div style=""display:flex; align-items:center; gap:8px; margin-bottom:10px;"">
                        <span style=""font-size:20px;"">📖</span>
                        <strong style=""font-size:17px; font-weight:950; color:#0f172a;"">1. 가말리엘의 조언 (사도행전 5:38-39)</strong>
                    </div>
                    
                    <!-- 핵심 말씀 -->
                    <div style=""background:#eff6ff; border-left:4px solid #3b82f6; padding:12px 14px; border-radius:8px; margin-bottom:14px;"">
                        <div style=""font-size:15.5px; font-weight:900; color:#1e3a8a; line-height:1.75; word-break:keep-all;"">
                            “이제 내가 너희에게 말하노니 이 사람들을 상관 말고 버려두라 이 사상과 이 소행이 사람으로부터 났으면 무너질 것이요 만일 하나님께로부터 났으면 너희가 그들을 무너뜨릴 수 없겠고 도리어 하나님을 대적하는 자가 될까 하노라 하니”
                        </div>
                        <div style=""text-align:right; font-size:13px; font-weight:950; color:#2563eb; margin-top:4px;"">(사도행전 5:38-39)</div>
                    </div>

                    <!-- 성경 본문 전체 -->
                    <div style=""font-size:14px; font-weight:950; color:#475569; margin-bottom:6px;"">📜 사도행전 5장 33절~42절 성경본문 전체</div>
                    <div style=""font-size:14.5px; color:#334155; line-height:1.85; word-break:keep-all; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:14px; max-height:280px; overflow-y:auto; -webkit-overflow-scrolling:touch;"">
                        33 그들이 듣고 크게 노하여 사도들을 없이하고자 할새<br>
                        34 바리새인 가말리엘은 율법교사로 모든 백성에게 칭송을 받는 자라 공회 중에 일어나 명하여 사도들을 잠깐 밖에 나가게 하고<br>
                        35 말하되 이스라엘 사람들아 너희가 이 사람들에게 대하여 어떻게 하려는지 조심하라<br>
                        36 이전에 드다가 일어나 스스로 선전하매 사람이 약 사백 명이나 따르더니 그가 죽임을 당하매 따르던 모든 사람들이 흩어져 없어졌고<br>
                        37 그 후 호적할 때에 갈릴리의 유다가 일어나 백성을 꾀어 따르게 하다가 그도 망한즉 따르던 모든 사람들이 흩어졌느니라<br>
                        38 이제 내가 너희에게 말하노니 이 사람들을 상관 말고 버려두라 이 사상과 이 소행이 사람으로부터 났으면 무너질 것이요<br>
                        39 만일 하나님께로부터 났으면 너희가 그들을 무너뜨릴 수 없겠고 도리어 하나님을 대적하는 자가 될까 하노라 하니<br>
                        40 그들이 옳게 여겨 사도들을 불러들여 채찍질하며 예수의 이름으로 말하는 것을 금하고 놓으니<br>
                        41 사도들은 그 이름을 위하여 능욕 받는 일에 합당한 자로 여기심을 기뻐하면서 공회 앞을 떠나니라<br>
                        42 그들이 날마다 성전에 있든지 집에 있든지 예수는 그리스도라고 가르치기와 전도하기를 그치지 아니하니라
                    </div>
                </div>

                <!-- 4) 2. 성령 모독에 대한 경고 (마태복음 12:31-32) & 성경 본문 전체 -->
                <div style=""background:#f8fafc; border:1.8px solid #cbd5e1; border-radius:16px; padding:18px 16px;"">
                    <div style=""display:flex; align-items:center; gap:8px; margin-bottom:10px;"">
                        <span style=""font-size:20px;"">⚡</span>
                        <strong style=""font-size:17px; font-weight:950; color:#0f172a;"">2. 성령 모독에 대한 경고 (마태복음 12:31-32)</strong>
                    </div>

                    <!-- 핵심 말씀 -->
                    <div style=""background:#fef2f2; border-left:4px solid #ef4444; padding:12px 14px; border-radius:8px; margin-bottom:14px;"">
                        <div style=""font-size:15.5px; font-weight:900; color:#991b1b; line-height:1.75; word-break:keep-all;"">
                            “그러므로 내가 너희에게 이르노니 사람의 모든 죄와 모독은 사하심을 얻으되 성령을 모독하는 것은 사하심을 얻지 못하겠고 또 누구든지 말로 인자를 거역하면 사하심을 얻되 누구든지 말로 성령을 거역하면 이 세상과 오는 세상에서도 사하심을 얻지 못하리라”
                        </div>
                        <div style=""text-align:right; font-size:13px; font-weight:950; color:#dc2626; margin-top:4px;"">(마태복음 12:31-32)</div>
                    </div>

                    <!-- 성경 본문 전체 -->
                    <div style=""font-size:14px; font-weight:950; color:#475569; margin-bottom:6px;"">📜 마태복음 12장 28절~37절 성경본문 전체</div>
                    <div style=""font-size:14.5px; color:#334155; line-height:1.85; word-break:keep-all; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:14px; max-height:280px; overflow-y:auto; -webkit-overflow-scrolling:touch;"">
                        28 그러나 내가 하나님의 성령을 힘입어 귀신을 쫓아내는 것이면 하나님의 나라가 이미 너희에게 임하였느니라<br>
                        29 사람이 먼저 강한 자를 결박하지 않고서야 어떻게 그 강한 자의 집에 들어가 그 세간을 강탈하겠느냐 결박한 후에야 그 집을 강탈하리라<br>
                        30 나와 함께 아니하는 자는 나를 반대하는 자요 나와 함께 모으지 아니하는 자는 헤치는 자니라<br>
                        31 그러므로 내가 너희에게 이르노니 사람의 모든 죄와 모독은 사하심을 얻으되 성령을 모독하는 것은 사하심을 얻지 못하겠고<br>
                        32 또 누구든지 말로 인자를 거역하면 사하심을 얻되 누구든지 말로 성령을 거역하면 이 세상과 오는 세상에서도 사하심을 얻지 못하리라<br>
                        33 나무도 좋고 열매도 좋다 하든지 나무도 좋지 않고 열매도 좋지 않다 하든지 하라 그 열매로 나무를 아느니라<br>
                        34 독사의 자식들아 너희는 악하니 어떻게 선한 말을 할 수 있느냐 이는 마음에 가득한 것을 입으로 말함이라<br>
                        35 선한 사람은 그 쌓은 선에서 선한 것을 내고 악한 사람은 그 쌓은 악에서 악한 것을 내느니라<br>
                        36 내가 너희에게 이르노니 사람이 무슨 무익한 말을 하든지 심판 날에 이에 대하여 심문을 받으리니<br>
                        37 네 말로 의롭다 함을 받고 네 말로 정죄함을 받으리라
                    </div>
                </div>

                <!-- 5) 🌟 [사용자 요청] 항상 깨어 낮은 자세로 바짝 엎드려 기도하라 & 오늘 회개하며 기도할 것 (오직 나만 볼 수 있음) -->
                <div style=""background:#ffffff; border:2px solid #7c3aed; border-radius:16px; padding:18px 16px; box-shadow:0 4px 14px rgba(124,58,237,0.1);"">
                    <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px;"">
                        <span style=""font-size:22px;"">🙏</span>
                        <strong style=""font-size:17.5px; font-weight:950; color:#5b21b6; letter-spacing:-0.3px;"">
                            3. 항상 깨어 낮은 자세로 바짝 엎드려 기도하라
                        </strong>
                    </div>

                    <!-- 권면의 말씀 1 -->
                    <div style=""background:#f5f3ff; border-left:4px solid #8b5cf6; padding:12px 14px; border-radius:8px; margin-bottom:12px;"">
                        <div style=""font-size:15px; font-weight:900; color:#4c1d95; line-height:1.75; word-break:keep-all;"">
                            “그러므로 하나님의 능하신 손 아래에서 겸손하라 때가 되면 너희를 높이시리라 너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라 근신하라 깨어라 너희 대적 마귀가 우는 사자 같이 두루 다니며 삼킬 자를 찾나니”
                        </div>
                        <div style=""text-align:right; font-size:13px; font-weight:950; color:#7c3aed; margin-top:4px;"">(베드로전서 5:6-8)</div>
                    </div>

                    <!-- 권면의 말씀 2 -->
                    <div style=""background:#f5f3ff; border-left:4px solid #8b5cf6; padding:12px 14px; border-radius:8px; margin-bottom:14px;"">
                        <div style=""font-size:15px; font-weight:900; color:#4c1d95; line-height:1.75; word-break:keep-all;"">
                            “이러므로 너희는 장차 올 이 모든 일을 능히 피하고 인자 앞에 서도록 항상 기도하며 깨어 있으라 하시니라”
                        </div>
                        <div style=""text-align:right; font-size:13px; font-weight:950; color:#7c3aed; margin-top:4px;"">(누가복음 21:36)</div>
                    </div>

                    <!-- 오늘 회개하며 기도할 것 (오직 나만 볼 수 있음) 입력 영역 -->
                    <div style=""background:#faf5ff; border:1.5px solid #d8b4fe; border-radius:14px; padding:14px 12px; margin-top:8px;"">
                        <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"">
                            <div style=""display:flex; align-items:center; gap:6px;"">
                                <span style=""font-size:17px;"">💧</span>
                                <strong style=""font-size:15.5px; font-weight:950; color:#6b21a8;"">오늘 회개하며 기도할 것</strong>
                            </div>
                            <span style=""font-size:11.5px; font-weight:800; color:#7c3aed; background:#ede9fe; padding:2px 8px; border-radius:8px;"">🔒 오직 나만 볼 수 있음</span>
                        </div>
                        <div style=""font-size:12.5px; color:#6b7280; margin-bottom:8px; line-height:1.45;"">
                            주님 앞에서 바짝 엎드려 오늘 회개하고 간구할 기도의 제목을 기록해 보세요.
                        </div>
                        <textarea id=""inpMyRepentPrayerNote"" rows=""4"" style=""width:100%; box-sizing:border-box; background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; color:#0f172a; font-size:15px; font-family:inherit; line-height:1.7; padding:12px 14px; resize:none; outline:none; transition:border-color 0.15s ease;"" placeholder=""주님, 나의 교만과 부족함을 용서하시고 오직 성령 안에서 깨어 바짝 엎드려 기도하게 하옵소서...""></textarea>
                        
                        <div style=""display:flex; justify-content:flex-end; gap:8px; margin-top:10px;"">
                            <button type=""button"" onclick=""saveMyRepentPrayer()"" style=""height:40px; padding:0 20px; background:linear-gradient(135deg, #7c3aed, #6d28d9); color:#ffffff; border:none; border-radius:10px; font-size:14px; font-weight:950; cursor:pointer; box-shadow:0 2px 6px rgba(124,58,237,0.3);"">
                                💾 회개와 기도 등록하기
                            </button>
                        </div>

                        <!-- 기 등록된 회개기도 표시 카드 -->
                        <div id=""boxSavedRepentPrayer"" style=""display:none; margin-top:14px; background:#ffffff; border:1.2px dashed #c084fc; border-radius:12px; padding:12px 14px;"">
                            <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"">
                                <span style=""font-size:12.5px; font-weight:950; color:#6b21a8;"">📜 내가 등록한 회개와 기도</span>
                                <span id=""txtRepentPrayerDate"" style=""font-size:11px; color:#6b7280;""></span>
                            </div>
                            <div id=""txtSavedRepentPrayer"" style=""font-size:14.5px; color:#0f172a; line-height:1.7; font-weight:800; white-space:pre-wrap; word-break:keep-all;""></div>
                        </div>
                    </div>
                </div>

                <!-- 6) 🌟 [사용자 요청] 나 개인의 고백 등록 공간 (오직 본인 기기에만 보임) -->
                <div style=""background:#ffffff; border:2px solid #0284c7; border-radius:16px; padding:18px 16px; box-shadow:0 4px 14px rgba(2,132,199,0.1);"">
                    <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"">
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <span style=""font-size:18px;"">✍️</span>
                            <strong style=""font-size:16.5px; font-weight:950; color:#0369a1;"">나 개인의 고백 등록</strong>
                        </div>
                        <span style=""font-size:11.5px; font-weight:800; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:8px;"">🔒 오직 본인에게만 보임</span>
                    </div>
                    <div style=""font-size:12.5px; color:#64748b; margin-bottom:10px; line-height:1.45;"">
                        주님 앞에 드리는 나만의 진솔한 결단과 믿음의 고백을 기록해 보세요.
                    </div>
                    <textarea id=""inpMyPersonalConfession"" rows=""4"" style=""width:100%; box-sizing:border-box; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; color:#0f172a; font-size:15px; font-family:inherit; line-height:1.7; padding:12px 14px; resize:none; outline:none; transition:border-color 0.15s ease;"" placeholder=""주님, 나의 상황에 굴하지 않고 오직 주님만 바라보며 끝까지 충성하겠습니다...""></textarea>
                    
                    <div style=""display:flex; justify-content:flex-end; gap:8px; margin-top:10px;"">
                        <button type=""button"" onclick=""saveMyPersonalConfession()"" style=""height:40px; padding:0 20px; background:linear-gradient(135deg, #0284c7, #0369a1); color:#ffffff; border:none; border-radius:10px; font-size:14px; font-weight:950; cursor:pointer; box-shadow:0 2px 6px rgba(2,132,199,0.3);"">
                            💾 고백 등록하기
                        </button>
                    </div>

                    <!-- 기 등록된 나만의 고백 카드 표시 -->
                    <div id=""boxSavedPersonalConfession"" style=""display:none; margin-top:14px; background:#f0f9ff; border:1.2px dashed #7dd3fc; border-radius:12px; padding:12px 14px;"">
                        <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"">
                            <span style=""font-size:12.5px; font-weight:950; color:#0369a1;"">📜 내가 등록한 신앙고백</span>
                            <span id=""txtPersonalConfessionDate"" style=""font-size:11px; color:#64748b;""></span>
                        </div>
                        <div id=""txtSavedPersonalConfession"" style=""font-size:14.5px; color:#0f172a; line-height:1.7; font-weight:800; white-space:pre-wrap; word-break:keep-all;""></div>
                    </div>
                </div>

                <!-- 7) 🌟 [사용자 요청] 마지막에 애드몹 250은 기본^^ -->
                <div style=""display:flex; justify-content:center; align-items:center; margin:16px 0 20px 0;"">
                    <div style=""width:300px; height:250px; background:#0f172a; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#ffffff; text-align:center; padding:16px; box-sizing:border-box; box-shadow:0 4px 16px rgba(0,0,0,0.2);"">
                        <div style=""display:inline-block; background:#0284c7; color:#fff; font-size:11px; font-weight:900; padding:2px 8px; border-radius:4px; margin-bottom:12px;"">AD</div>
                        <div style=""font-size:16px; font-weight:950; color:#38bdf8; margin-bottom:6px;"">Google AdMob (300 x 250)</div>
                        <div style=""font-size:12px; color:#94a3b8; line-height:1.5;"">대한민국 교회 · 목회자 · 소상공인<br>공식 스폰서 대형 배너 슬롯</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
";
                    content = content.Substring(0, modalStartIdx) + newModalHtml + content.Substring(modalEndIdx);
                }
            }

            // ========================================================
            // 6. Update JavaScript:
            //    - openKkajitgeotModal() attaches to window & adds .show
            //    - saveMyRepentPrayer(), loadSavedRepentPrayer()
            // ========================================================
            string oldJsTarget = @"    // 🌟 [사용자 요청] '까짓것' 모달 열기 및 개인 고백 불러오기
    function openKkajitgeotModal() {";

            int jsTargetIdx = content.IndexOf(oldJsTarget);
            if (jsTargetIdx >= 0)
            {
                int jsEndIdx = content.IndexOf("</script>", jsTargetIdx);
                if (jsEndIdx >= 0)
                {
                    string newJsBlock = @"    // 🌟 [사용자 요청] '까짓것' 모달 열기 및 개인 고백 & 회개기도 불러오기
    function openKkajitgeotModal() {
        const modal = document.getElementById(""kkajitgeotModal"");
        if (!modal) return;
        try {
            loadSavedPersonalConfession();
            loadSavedRepentPrayer();
        } catch(e) { console.warn(e); }
        modal.classList.add(""show"");
        modal.style.setProperty(""display"", ""flex"", ""important"");
    }

    function closeKkajitgeotModal() {
        const modal = document.getElementById(""kkajitgeotModal"");
        if (!modal) return;
        modal.classList.remove(""show"");
        modal.style.setProperty(""display"", ""none"", ""important"");
    }

    function saveMyPersonalConfession() {
        const inp = document.getElementById(""inpMyPersonalConfession"");
        if (!inp) return;
        const text = inp.value.trim();
        if (!text) {
            showBibleToast(""고백 내용을 입력해 주세요."");
            inp.focus();
            return;
        }

        const data = {
            content: text,
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
        };
        localStorage.setItem(""yetalk_my_personal_confession"", JSON.stringify(data));
        showBibleToast(""✅ 나의 신앙고백이 안전하게 등록되었습니다."");
        loadSavedPersonalConfession();
    }

    function loadSavedPersonalConfession() {
        const box = document.getElementById(""boxSavedPersonalConfession"");
        const txtEl = document.getElementById(""txtSavedPersonalConfession"");
        const dateEl = document.getElementById(""txtPersonalConfessionDate"");
        const inp = document.getElementById(""inpMyPersonalConfession"");

        try {
            const raw = localStorage.getItem(""yetalk_my_personal_confession"");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.content) {
                    if (txtEl) txtEl.innerText = parsed.content;
                    if (dateEl) dateEl.innerText = parsed.date || """";
                    if (box) box.style.display = ""block"";
                    if (inp && !inp.value) inp.value = parsed.content;
                    return;
                }
            }
        } catch(e){}

        if (box) box.style.display = ""none"";
    }

    // 🌟 [사용자 요청] 오늘 회개하며 기도할 것 (오직 나만 볼 수 있음) 저장 및 로드
    function saveMyRepentPrayer() {
        const inp = document.getElementById(""inpMyRepentPrayerNote"");
        if (!inp) return;
        const text = inp.value.trim();
        if (!text) {
            showBibleToast(""회개와 기도 내용을 입력해 주세요."");
            inp.focus();
            return;
        }

        const data = {
            content: text,
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
        };
        localStorage.setItem(""yetalk_my_repent_prayer_note"", JSON.stringify(data));
        showBibleToast(""✅ 나의 회개와 기도가 안전하게 등록되었습니다."");
        loadSavedRepentPrayer();
    }

    function loadSavedRepentPrayer() {
        const box = document.getElementById(""boxSavedRepentPrayer"");
        const txtEl = document.getElementById(""txtSavedRepentPrayer"");
        const dateEl = document.getElementById(""txtRepentPrayerDate"");
        const inp = document.getElementById(""inpMyRepentPrayerNote"");

        try {
            const raw = localStorage.getItem(""yetalk_my_repent_prayer_note"");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.content) {
                    if (txtEl) txtEl.innerText = parsed.content;
                    if (dateEl) dateEl.innerText = parsed.date || """";
                    if (box) box.style.display = ""block"";
                    if (inp && !inp.value) inp.value = parsed.content;
                    return;
                }
            }
        } catch(e){}

        if (box) box.style.display = ""none"";
    }

    // 전역 window 바인딩 (인라인 onclick 안전 보장)
    window.openKkajitgeotModal = openKkajitgeotModal;
    window.closeKkajitgeotModal = closeKkajitgeotModal;
    window.saveMyPersonalConfession = saveMyPersonalConfession;
    window.loadSavedPersonalConfession = loadSavedPersonalConfession;
    window.saveMyRepentPrayer = saveMyRepentPrayer;
    window.loadSavedRepentPrayer = loadSavedRepentPrayer;
";
                    content = content.Substring(0, jsTargetIdx) + newJsBlock + content.Substring(jsEndIdx);
                }
            }

            File.WriteAllText(path, content, new UTF8Encoding(false));
            Console.WriteLine("SUCCESS: Updated " + path);
        }
    }
}
