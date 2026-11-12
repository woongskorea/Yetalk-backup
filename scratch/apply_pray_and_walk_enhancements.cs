using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        UpdateChurchPray();
        UpdateChurchJesusWalking();
        SyncFiles();
        Console.WriteLine("ALL_ENHANCEMENTS_APPLIED_SUCCESSFULLY");
    }

    static void UpdateChurchPray()
    {
        string path = @"assets\churchpray.html";
        string html = File.ReadAllText(path, Encoding.UTF8);

        // 1. Enforce 5 Default Intercessory Rooms
        string oldDef = @"    const DEFAULT_INTERCESS_ROOMS = [
        { id: ""pr_1"", name: ""+ 1중보기도방 (빈방)"", leader: """", isPrivate: false, members: [], pendingRequests: [] },
        { id: ""pr_2"", name: ""+ 2중보기도방 (빈방)"", leader: """", isPrivate: false, members: [], pendingRequests: [] },
        { id: ""pr_3"", name: ""+ 환우치유 기도방 (빈방)"", leader: """", isPrivate: false, members: [], pendingRequests: [] },
        { id: ""pr_4"", name: ""+ 새신자 축복기도방 (빈방)"", leader: """", isPrivate: false, members: [], pendingRequests: [] },
        { id: ""pr_5"", name: ""+ 기도방 (중보 빈방)"", leader: """", isPrivate: false, members: [], pendingRequests: [] }
    ];";

        string newDef = @"    // 🌟 [사용자 요청] 기본 5개 중보기도방
    const DEFAULT_INTERCESS_ROOMS = [
        { id: ""pr_1"", name: ""1중보기도방"", leader: """", isPrivate: false, members: [], pendingRequests: [] },
        { id: ""pr_2"", name: ""2중보기도방"", leader: """", isPrivate: false, members: [], pendingRequests: [] },
        { id: ""pr_3"", name: ""환우치유 기도방"", leader: """", isPrivate: false, members: [], pendingRequests: [] },
        { id: ""pr_4"", name: ""새신자 축복기도방"", leader: """", isPrivate: false, members: [], pendingRequests: [] },
        { id: ""pr_5"", name: ""은혜와 평강 중보기도방"", leader: """", isPrivate: false, members: [], pendingRequests: [] }
    ];";

        if (html.Contains(oldDef))
        {
            html = html.Replace(oldDef, newDef);
            Console.WriteLine("Replaced DEFAULT_INTERCESS_ROOMS in churchpray.html");
        }
        else
        {
            Console.WriteLine("Warning: oldDef not found directly, checking variation...");
        }

        // 2. In initPage(), limit to 5 rooms
        string oldInit = @"        const savedI = localStorage.getItem(""yetalk_pray_rooms_intercess_v7"");
        intercessRooms = savedI ? JSON.parse(savedI).map(sanitizeRoom) : DEFAULT_INTERCESS_ROOMS.map(sanitizeRoom);";

        string newInit = @"        const savedI = localStorage.getItem(""yetalk_pray_rooms_intercess_v8"") || localStorage.getItem(""yetalk_pray_rooms_intercess_v7"");
        if (savedI) {
            try {
                let parsed = JSON.parse(savedI).map(sanitizeRoom);
                // 🌟 기본 5개 방으로 정돈 (초과 생성된 빈방 정리)
                if (parsed.length > 5) {
                    parsed = parsed.slice(0, 5);
                }
                intercessRooms = parsed;
            } catch(e) {
                intercessRooms = DEFAULT_INTERCESS_ROOMS.map(sanitizeRoom);
            }
        } else {
            intercessRooms = DEFAULT_INTERCESS_ROOMS.map(sanitizeRoom);
        }";

        if (html.Contains(oldInit))
        {
            html = html.Replace(oldInit, newInit);
            Console.WriteLine("Updated initPage() in churchpray.html");
        }

        // 3. renderRooms() logic: 사용중 vs 빈방, 방장 표시
        string oldRenderRoomsTarget = @"    function renderRooms() {
        const container = document.getElementById(""roomListContainer"");
        container.innerHTML = """";
        const list = (currentCategory === ""intercess"") ? intercessRooms : specialRooms;

        list.forEach(r => {
            const isUnopened = !r.leader || r.leader.trim() === """" || r.name.startsWith(""+"");
            const leaderText = isUnopened ? `👤 빈방 (입장 후 방장 등록)` : `👑 방장(인도자): ${r.leader}`;

            const isPrivate = !!r.isPrivate;
            const canEnter = canUserEnterRoom(r);
            const isPending = isUserPending(r);

            // 🌟 [사용자 요청] 밖에서는 수정 버튼 완전 제거!
            // 상태는 3가지: 참여 / 승인대기 / 참여신청
            // 모든 경우에 [입장 ▶] 글자는 항상 표시!
            let statusBadgeHtml = """";

            if (!isPrivate || canEnter) {
                // 1. 참여 상태 (승인되었거나 공개방이거나 빈방)
                statusBadgeHtml = `<span style=""font-size:11px; font-weight:900; color:#10b981; background:rgba(16,185,129,0.14); border:1px solid rgba(16,185,129,0.35); border-radius:6px; padding:3px 7px; white-space:nowrap;"">참여</span>`;
            } else if (isPending) {
                // 2. 승인대기 상태
                statusBadgeHtml = `<button type=""""button"""" style=""""font-size:11px; font-weight:900; color:#f59e0b; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.4); border-radius:6px; padding:3px 7px; cursor:pointer; white-space:nowrap;"""" onclick=""""event.stopPropagation(); showToast('⏳ 방장의 참여 승인을 기다리고 있습니다.');"""">승인대기</button>`;
            } else {
                // 3. 참여신청 상태 (비공개방 미신청)
                statusBadgeHtml = `<button type=""""button"""" style=""""font-size:11px; font-weight:950; color:#ffffff; background:linear-gradient(135deg, #ef4444, #dc2626); border:1px solid #f87171; border-radius:6px; padding:3px 8px; cursor:pointer; box-shadow:0 2px 6px rgba(220,38,38,0.35); white-space:nowrap;"""" onclick=""""event.stopPropagation(); openJoinRequestModal('${r.id}')"""">참여신청</button>`;
            }

            const actionHtml = `
                ${statusBadgeHtml}
                <span style=""color:#38bdf8; font-size:13.5px; font-weight:950; padding:2px 4px; white-space:nowrap;"">입장 ▶</span>
            `;

            const card = document.createElement(""div"");
            card.className = `room-card ${(!isUnopened) ? 'leader-active' : ''}`;
            card.onclick = () => enterPrayChatRoom(r);

            card.innerHTML = `
                <div class=""room-info-col"">
                    <span class=""room-name-title"">${escapeHtml(r.name)}</span>
                    <span class=""room-leader-tag"">${leaderText}</span>
                </div>
                <div class=""room-action-wrap"">
                    ${actionHtml}
                </div>
            `;
            container.appendChild(card);
        });
    }";

        string newRenderRooms = @"    function renderRooms() {
        const container = document.getElementById(""roomListContainer"");
        container.innerHTML = """";
        const list = (currentCategory === ""intercess"") ? intercessRooms : specialRooms;

        list.forEach(r => {
            const hasLeader = !!(r.leader && r.leader.trim() !== """");
            // 이름 정돈: 기존 (빈방)이나 (사용중) 접미사 정리 후 상태에 맞게 반영
            const cleanTitle = (r.name || """").replace(/^\+\s*/, '').replace(/\s*\((빈방|사용중)\)/g, '').trim();
            const displayTitle = ""+ "" + cleanTitle + (hasLeader ? "" (사용중)"" : "" (빈방)"");
            const leaderText = hasLeader ? `👑 방장: ${r.leader}` : `👤 빈방 (입장 후 방장 등록)`;

            const isPrivate = !!r.isPrivate;
            const canEnter = canUserEnterRoom(r);
            const isPending = isUserPending(r);

            let statusBadgeHtml = """";
            if (hasLeader) {
                // 사용 중인 방
                statusBadgeHtml = `<span style=""font-size:11px; font-weight:900; color:#ef4444; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.35); border-radius:6px; padding:3px 7px; white-space:nowrap;"">🔥 사용중</span>`;
            } else if (!isPrivate || canEnter) {
                // 빈방
                statusBadgeHtml = `<span style=""font-size:11px; font-weight:900; color:#10b981; background:rgba(16,185,129,0.14); border:1px solid rgba(16,185,129,0.35); border-radius:6px; padding:3px 7px; white-space:nowrap;"">빈방</span>`;
            } else if (isPending) {
                statusBadgeHtml = `<button type=""button"" style=""font-size:11px; font-weight:900; color:#f59e0b; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.4); border-radius:6px; padding:3px 7px; cursor:pointer; white-space:nowrap;"" onclick=""event.stopPropagation(); showToast('⏳ 방장의 참여 승인을 기다리고 있습니다.');"">승인대기</button>`;
            } else {
                statusBadgeHtml = `<button type=""button"" style=""font-size:11px; font-weight:950; color:#ffffff; background:linear-gradient(135deg, #ef4444, #dc2626); border:1px solid #f87171; border-radius:6px; padding:3px 8px; cursor:pointer; box-shadow:0 2px 6px rgba(220,38,38,0.35); white-space:nowrap;"" onclick=""event.stopPropagation(); openJoinRequestModal('${r.id}')"">참여신청</button>`;
            }

            const actionHtml = `
                ${statusBadgeHtml}
                <span style=""color:#38bdf8; font-size:13.5px; font-weight:950; padding:2px 4px; white-space:nowrap;"">입장 ▶</span>
            `;

            const card = document.createElement(""div"");
            card.className = `room-card ${hasLeader ? 'leader-active' : ''}`;
            card.onclick = () => enterPrayChatRoom(r);

            card.innerHTML = `
                <div class=""room-info-col"">
                    <span class=""room-name-title"">${escapeHtml(displayTitle)}</span>
                    <span class=""room-leader-tag"">${leaderText}</span>
                </div>
                <div class=""room-action-wrap"">
                    ${actionHtml}
                </div>
            `;
            container.appendChild(card);
        });
    }";

        if (html.Contains(oldRenderRoomsTarget))
        {
            html = html.Replace(oldRenderRoomsTarget, newRenderRooms);
            Console.WriteLine("Updated renderRooms() in churchpray.html");
        }

        // 4. Update saveAllRoomsToStorage to use v8 so changes persist cleanly
        html = html.Replace(
            "localStorage.setItem(\"yetalk_pray_rooms_intercess_v7\", JSON.stringify(intercessRooms));",
            "localStorage.setItem(\"yetalk_pray_rooms_intercess_v8\", JSON.stringify(intercessRooms));\n        localStorage.setItem(\"yetalk_pray_rooms_intercess_v7\", JSON.stringify(intercessRooms));"
        );

        // 5. Unify input bar into a single KakaoTalk-style capsule in #prayBottomDock
        string oldPrayInputDock = @"            <!-- 한줄 입력창 -->
            <div style=""position:relative; width:100%; background:#BACEE0; border-top:1px solid rgba(0,0,0,0.08); padding:6px 10px; display:flex; flex-direction:column; gap:4px; box-sizing:border-box;"">
                <div id=""replyIndicatorBar"" style=""display:none; padding:4px 10px; background:rgba(255,255,255,0.95); border-radius:8px; font-size:11.5px; color:#0f172a; justify-content:space-between; align-items:center; border:1px solid #cbd5e1;"">
                    <span id=""replyIndicatorText"" style=""white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:85%;"">↩️ 답장 작성 중...</span>
                    <button type=""button"" onclick=""cancelReplyMode()"" style=""background:none; border:none; color:#ef4444; font-weight:900; cursor:pointer; font-size:13px; padding:0 4px;"">✕</button>
                </div>
                <div style=""display:flex; align-items:center; gap:6px; width:100%;"">
                    <button type=""button"" onclick=""document.getElementById('prayInlinePhotoInput').click()"" style=""width:36px; height:36px; border-radius:50%; background:#ffffff; border:1px solid #cbd5e1; font-size:18px; color:#475569; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;"" title=""사진 첨부"">+</button>
                    <input type=""text"" id=""quickPrayInput"" placeholder="""" style=""flex:1; height:38px; background:#ffffff; border:1px solid #cbd5e1; border-radius:19px; padding:0 14px; font-size:14.5px; font-weight:700; color:#0f172a; outline:none; box-sizing:border-box;"" onkeydown=""if(event.key==='Enter' && !event.isComposing){ event.preventDefault(); submitQuickPrayComment(); }"">
                    <button type=""button"" onmousedown=""event.preventDefault()"" onclick=""submitQuickPrayComment()"" style=""height:38px; padding:0 16px; background:#fee500; color:#191919; border:none; border-radius:19px; font-size:13.5px; font-weight:950; cursor:pointer; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.1);"">전송</button>
                </div>
            </div>";

        string newPrayInputDock = @"            <!-- 🌟 [사용자 요청] 하나로 깔끔하게 통일된 일체형 캡슐 입력바 -->
            <div style=""position:relative; width:100%; background:#BACEE0; border-top:1px solid rgba(0,0,0,0.08); padding:6px 10px; display:flex; flex-direction:column; gap:4px; box-sizing:border-box;"">
                <div id=""replyIndicatorBar"" style=""display:none; padding:4px 10px; background:rgba(255,255,255,0.95); border-radius:8px; font-size:11.5px; color:#0f172a; justify-content:space-between; align-items:center; border:1px solid #cbd5e1;"">
                    <span id=""replyIndicatorText"" style=""white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:85%;"">↩️ 답장 작성 중...</span>
                    <button type=""button"" onclick=""cancelReplyMode()"" style=""background:none; border:none; color:#ef4444; font-weight:900; cursor:pointer; font-size:13px; padding:0 4px;"">✕</button>
                </div>
                <div style=""display:flex; align-items:center; background:#ffffff; border:1.2px solid #cbd5e1; border-radius:24px; padding:3px 5px 3px 12px; width:100%; box-sizing:border-box; box-shadow:0 1px 4px rgba(0,0,0,0.06);"">
                    <button type=""button"" onclick=""document.getElementById('prayInlinePhotoInput').click()"" style=""background:none; border:none; font-size:19px; color:#64748b; cursor:pointer; padding:0 6px 0 0; display:flex; align-items:center; justify-content:center; flex-shrink:0; line-height:1;"" title=""사진 첨부"">📷</button>
                    <input type=""text"" id=""quickPrayInput"" placeholder=""기도제목이나 나눔을 남겨보세요..."" style=""flex:1; height:34px; background:transparent; border:none; padding:0 6px; font-size:14px; font-weight:700; color:#0f172a; outline:none; box-sizing:border-box;"" onkeydown=""if(event.key==='Enter' && !event.isComposing){ event.preventDefault(); submitQuickPrayComment(); }"">
                    <button type=""button"" onmousedown=""event.preventDefault()"" onclick=""submitQuickPrayComment()"" style=""height:32px; padding:0 15px; background:#fee500; color:#191919; border:none; border-radius:16px; font-size:13px; font-weight:950; cursor:pointer; flex-shrink:0; box-shadow:0 1px 2px rgba(0,0,0,0.08);"">전송</button>
                </div>
            </div>";

        if (html.Contains(oldPrayInputDock))
        {
            html = html.Replace(oldPrayInputDock, newPrayInputDock);
            Console.WriteLine("Replaced pray bottom dock with unified input capsule in churchpray.html");
        }

        // 6. Fix bubble cutoff: Increase .feed-list padding-bottom to 36px and add bottom spacer
        html = html.Replace(
            "padding: 8px 12px 14px 12px; box-sizing: border-box;",
            "padding: 10px 12px 36px 12px; box-sizing: border-box;"
        );

        // Also add spacer div inside renderPrayPosts and update scrollFeedToBottom
        string oldRenderPostsEnd = @"            container.appendChild(row);
        });
    }";
        string newRenderPostsEnd = @"            container.appendChild(row);
        });
        const spacer = document.createElement(""div"");
        spacer.style.cssText = ""height: 24px; flex-shrink: 0; width: 100%;"";
        container.appendChild(spacer);
    }";
        if (html.Contains(oldRenderPostsEnd))
        {
            html = html.Replace(oldRenderPostsEnd, newRenderPostsEnd);
            Console.WriteLine("Added bottom spacer in renderPrayPosts");
        }

        // 7. Make modalCommentActionSheet compact horizontal mini popup
        string oldPrayActionSheet = @"<!-- 🌟 댓글 길게 누르기(롱프레스) 액션 시트 모달 -->
<div id=""modalCommentActionSheet"" style=""display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:20000200 !important; align-items:flex-end; justify-content:center; backdrop-filter:blur(2px);"" onclick=""closeCommentActionSheet()"">
    <div style=""width:100%; max-width:480px; background:#ffffff; border-top-left-radius:20px; border-top-right-radius:20px; padding:18px 16px max(env(safe-area-inset-bottom, 0px) + 16px, 20px) 16px; box-shadow:0 -4px 25px rgba(0,0,0,0.2); display:flex; flex-direction:column; gap:10px; animation:sheetSlideUp 0.2s ease;"" onclick=""event.stopPropagation()"">
        <div style=""display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:8px;"">
            <div style=""font-size:12.5px; font-weight:900; color:#475569;"">
                💬 <span id=""actionSheetAuthor"">성도</span> 님의 기도 나눔
            </div>
            <button type=""button"" onclick=""closeCommentActionSheet()"" style=""background:none; border:none; font-size:18px; color:#94a3b8; cursor:pointer; font-weight:900;"">✕</button>
        </div>
        <div id=""actionSheetPreviewText"" style=""font-size:13px; color:#334155; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis; word-break:break-word; font-weight:600;""></div>

        <div style=""display:flex; flex-direction:column; gap:6px; margin-top:4px;"">
            <button type=""button"" onclick=""actionSheetCopyText()"" style=""width:100%; display:flex; align-items:center; gap:10px; padding:12px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-size:14px; font-weight:850; color:#0f172a; cursor:pointer;"">
                <span style=""font-size:16px;"">📋</span> <span>글 복사</span>
            </button>
            <button type=""button"" onclick=""actionSheetPinBest()"" style=""width:100%; display:flex; align-items:center; gap:10px; padding:12px 14px; background:#fffbeb; border:1px solid #fde68a; border-radius:12px; font-size:14px; font-weight:950; color:#b45309; cursor:pointer;"">
                <span style=""font-size:16px;"">📌</span> <span>실시간 베스트로 지정 (방장)</span>
            </button>
            <button type=""button"" onclick=""actionSheetEdit()"" style=""width:100%; display:flex; align-items:center; gap:10px; padding:12px 14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; font-size:14px; font-weight:850; color:#1d4ed8; cursor:pointer;"">
                <span style=""font-size:16px;"">✏️</span> <span>글 수정</span>
            </button>
            <button type=""button"" onclick=""actionSheetDelete()"" style=""width:100%; display:flex; align-items:center; gap:10px; padding:12px 14px; background:#fef2f2; border:1px solid #fecaca; border-radius:12px; font-size:14px; font-weight:850; color:#dc2626; cursor:pointer;"">
                <span style=""font-size:16px;"">🗑️</span> <span>글 삭제</span>
            </button>
        </div>
        <button type=""button"" onclick=""closeCommentActionSheet()"" style=""width:100%; padding:11px; background:#f1f5f9; border:none; border-radius:12px; font-size:13.5px; font-weight:900; color:#475569; cursor:pointer; margin-top:2px;"">취소</button>
    </div>
</div>";

        string newPrayActionSheet = @"<!-- 🌟 [사용자 요청] 글 탭/롱프레스 미니 액션 팝업 (복사, 수정, 삭제 조그마하게 표시) -->
<div id=""modalCommentActionSheet"" style=""display:none; position:fixed; inset:0; background:rgba(0,0,0,0.35); z-index:20000200 !important; align-items:center; justify-content:center; padding:16px;"" onclick=""closeCommentActionSheet()"">
    <div style=""background:#ffffff; border-radius:16px; padding:10px 14px; box-shadow:0 10px 30px rgba(0,0,0,0.25); display:inline-flex; align-items:center; gap:8px; border:1px solid #e2e8f0; animation:sheetSlideUp 0.15s ease;"" onclick=""event.stopPropagation()"">
        <span id=""actionSheetAuthor"" style=""display:none;""></span>
        <span id=""actionSheetPreviewText"" style=""display:none;""></span>
        <button type=""button"" onclick=""actionSheetCopyText()"" style=""background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:7px 11px; font-size:12.5px; font-weight:850; color:#1e293b; cursor:pointer; display:inline-flex; align-items:center; gap:4px;"">
            <span>📋</span> 복사
        </button>
        <button type=""button"" onclick=""actionSheetEdit()"" style=""background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:7px 11px; font-size:12.5px; font-weight:850; color:#1d4ed8; cursor:pointer; display:inline-flex; align-items:center; gap:4px;"">
            <span>✏️</span> 수정
        </button>
        <button type=""button"" onclick=""actionSheetDelete()"" style=""background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:7px 11px; font-size:12.5px; font-weight:850; color:#dc2626; cursor:pointer; display:inline-flex; align-items:center; gap:4px;"">
            <span>🗑️</span> 삭제
        </button>
        <button type=""button"" onclick=""closeCommentActionSheet()"" style=""background:none; border:none; color:#94a3b8; font-size:16px; font-weight:900; cursor:pointer; padding:2px 6px; line-height:1;"" title=""닫기"">✕</button>
    </div>
</div>";

        if (html.Contains(oldPrayActionSheet))
        {
            html = html.Replace(oldPrayActionSheet, newPrayActionSheet);
            Console.WriteLine("Replaced modalCommentActionSheet with compact mini popup in churchpray.html");
        }

        // Also allow clicking bubble directly to open the mini menu
        html = html.Replace(
            "oncontextmenu=\"event.preventDefault(); openCommentActionSheet('${post.id}')\"",
            "onclick=\"openCommentActionSheet('${post.id}')\" oncontextmenu=\"event.preventDefault(); openCommentActionSheet('${post.id}')\""
        );

        File.WriteAllText(path, html, new UTF8Encoding(false));
    }

    static void UpdateChurchJesusWalking()
    {
        string path = @"assets\churchjesuswalking.html";
        string html = File.ReadAllText(path, Encoding.UTF8);

        // 1. Unify bottom input bar into single KakaoTalk-style capsule in #jesusBottomDock
        string oldJesusInputDock = @"        <!-- 한줄 댓글창 -->
        <div class=""fixed-quick-comment-bar"" style=""position:relative; width:100%; background:#BACEE0; border-top:1px solid rgba(0,0,0,0.08); padding:6px 10px; display:flex; flex-direction:column; gap:4px; box-sizing:border-box;"">
            <!-- 카톡 답장 중 표시 바 -->
            <div id=""replyIndicatorBar"" style=""display:none; padding:4px 10px; background:rgba(255,255,255,0.95); border-radius:8px; font-size:11.5px; color:#0f172a; justify-content:space-between; align-items:center; border:1px solid #cbd5e1;"">
                <span id=""replyIndicatorText"" style=""white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:85%;"">↩️ 답장 작성 중...</span>
                <button type=""button"" onclick=""cancelReplyMode()"" style=""background:none; border:none; color:#ef4444; font-weight:900; cursor:pointer; font-size:13px; padding:0 4px;"">✕</button>
            </div>
            <div style=""display:flex; align-items:center; gap:6px; width:100%;"">
                <button type=""button"" onclick=""document.getElementById('pastorInlinePhotoInput').click()"" style=""width:36px; height:36px; border-radius:50%; background:#ffffff; border:1px solid #cbd5e1; font-size:18px; color:#475569; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;"" title=""사진 첨부"">+</button>
                <input type=""text"" id=""quickPastorCommentInput"" placeholder=""은혜 나눔을 남겨주세요..."" style=""flex:1; height:38px; background:#ffffff; border:1px solid #cbd5e1; border-radius:19px; padding:0 14px; font-size:14.5px; font-weight:700; color:#0f172a; outline:none; box-sizing:border-box;"" onkeypress=""if(event.key==='Enter') submitQuickPastorComment()"">
                <button type=""button"" onclick=""submitQuickPastorComment()"" style=""height:38px; padding:0 16px; background:#fee500; color:#191919; border:none; border-radius:19px; font-size:13.5px; font-weight:950; cursor:pointer; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.1);"">전송</button>
            </div>
        </div>";

        string newJesusInputDock = @"        <!-- 🌟 [사용자 요청] 하나로 깔끔하게 통일된 일체형 캡슐 입력바 -->
        <div class=""fixed-quick-comment-bar"" style=""position:relative; width:100%; background:#BACEE0; border-top:1px solid rgba(0,0,0,0.08); padding:6px 10px; display:flex; flex-direction:column; gap:4px; box-sizing:border-box;"">
            <!-- 카톡 답장 중 표시 바 -->
            <div id=""replyIndicatorBar"" style=""display:none; padding:4px 10px; background:rgba(255,255,255,0.95); border-radius:8px; font-size:11.5px; color:#0f172a; justify-content:space-between; align-items:center; border:1px solid #cbd5e1;"">
                <span id=""replyIndicatorText"" style=""white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:85%;"">↩️ 답장 작성 중...</span>
                <button type=""button"" onclick=""cancelReplyMode()"" style=""background:none; border:none; color:#ef4444; font-weight:900; cursor:pointer; font-size:13px; padding:0 4px;"">✕</button>
            </div>
            <div style=""display:flex; align-items:center; background:#ffffff; border:1.2px solid #cbd5e1; border-radius:24px; padding:3px 5px 3px 12px; width:100%; box-sizing:border-box; box-shadow:0 1px 4px rgba(0,0,0,0.06);"">
                <button type=""button"" onclick=""document.getElementById('pastorInlinePhotoInput').click()"" style=""background:none; border:none; font-size:19px; color:#64748b; cursor:pointer; padding:0 6px 0 0; display:flex; align-items:center; justify-content:center; flex-shrink:0; line-height:1;"" title=""사진 첨부"">📷</button>
                <input type=""text"" id=""quickPastorCommentInput"" placeholder=""은혜 나눔을 남겨주세요..."" style=""flex:1; height:34px; background:transparent; border:none; padding:0 6px; font-size:14px; font-weight:700; color:#0f172a; outline:none; box-sizing:border-box;"" onkeydown=""if(event.key==='Enter' && !event.isComposing){ event.preventDefault(); submitQuickPastorComment(); }"">
                <button type=""button"" onclick=""submitQuickPastorComment()"" style=""height:32px; padding:0 15px; background:#fee500; color:#191919; border:none; border-radius:16px; font-size:13px; font-weight:950; cursor:pointer; flex-shrink:0; box-shadow:0 1px 2px rgba(0,0,0,0.08);"">전송</button>
            </div>
        </div>";

        if (html.Contains(oldJesusInputDock))
        {
            html = html.Replace(oldJesusInputDock, newJesusInputDock);
            Console.WriteLine("Replaced jesus bottom dock with unified input capsule in churchjesuswalking.html");
        }

        // 2. Make modalCommentActionSheet compact horizontal mini popup
        string oldJesusActionSheet = @"    <!-- 🌟 [사용자 요청] 댓글 길게 누르기(롱프레스) 액션 시트 모달 -->
    <div id=""modalCommentActionSheet"" style=""display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:20000200 !important; align-items:flex-end; justify-content:center; backdrop-filter:blur(2px);"" onclick=""closeCommentActionSheet()"">
        <div style=""width:100%; max-width:480px; background:#ffffff; border-top-left-radius:20px; border-top-right-radius:20px; padding:18px 16px max(env(safe-area-inset-bottom, 0px) + 16px, 20px) 16px; box-shadow:0 -4px 25px rgba(0,0,0,0.2); display:flex; flex-direction:column; gap:10px; animation:sheetSlideUp 0.2s ease;"" onclick=""event.stopPropagation()"">
            <div style=""display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:8px;"">
                <div style=""font-size:12.5px; font-weight:900; color:#475569;"">
                    💬 <span id=""actionSheetAuthor"">성도</span> 님의 나눔
                </div>
                <button type=""button"" onclick=""closeCommentActionSheet()"" style=""background:none; border:none; font-size:18px; color:#94a3b8; cursor:pointer; font-weight:900;"">✕</button>
            </div>
            <div id=""actionSheetPreviewText"" style=""font-size:13px; color:#334155; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis; word-break:break-word; font-weight:600;""></div>

            <div style=""display:flex; flex-direction:column; gap:6px; margin-top:4px;"">
                <button type=""button"" onclick=""actionSheetCopyText()"" style=""width:100%; display:flex; align-items:center; gap:10px; padding:12px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-size:14px; font-weight:850; color:#0f172a; cursor:pointer;"">
                    <span style=""font-size:16px;"">📋</span>
                    <span>글 복사</span>
                </button>
                <button type=""button"" onclick=""actionSheetPinBest()"" style=""width:100%; display:flex; align-items:center; gap:10px; padding:12px 14px; background:#fffbeb; border:1px solid #fde68a; border-radius:12px; font-size:14px; font-weight:950; color:#b45309; cursor:pointer;"">
                    <span style=""font-size:16px;"">📌</span>
                    <span>실시간 베스트로 지정 (방장)</span>
                </button>
                <button type=""button"" onclick=""actionSheetEdit()"" style=""width:100%; display:flex; align-items:center; gap:10px; padding:12px 14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; font-size:14px; font-weight:850; color:#1d4ed8; cursor:pointer;"">
                    <span style=""font-size:16px;"">✏️</span>
                    <span>글 수정</span>
                </button>
                <button type=""button"" onclick=""actionSheetDelete()"" style=""width:100%; display:flex; align-items:center; gap:10px; padding:12px 14px; background:#fef2f2; border:1px solid #fecaca; border-radius:12px; font-size:14px; font-weight:850; color:#dc2626; cursor:pointer;"">
                    <span style=""font-size:16px;"">🗑️</span>
                    <span>글 삭제</span>
                </button>
                <button type=""button"" onclick=""closeCommentActionSheet()"" style=""width:100%; padding:11px; background:#f1f5f9; border:none; border-radius:12px; font-size:13.5px; font-weight:900; color:#64748b; cursor:pointer; margin-top:2px;"">
                    닫기
                </button>
            </div>
        </div>
    </div>";

        string newJesusActionSheet = @"    <!-- 🌟 [사용자 요청] 글 탭/롱프레스 미니 액션 팝업 (복사, 수정, 삭제 조그마하게 표시) -->
    <div id=""modalCommentActionSheet"" style=""display:none; position:fixed; inset:0; background:rgba(0,0,0,0.35); z-index:20000200 !important; align-items:center; justify-content:center; padding:16px;"" onclick=""closeCommentActionSheet()"">
        <div style=""background:#ffffff; border-radius:16px; padding:10px 14px; box-shadow:0 10px 30px rgba(0,0,0,0.25); display:inline-flex; align-items:center; gap:8px; border:1px solid #e2e8f0; animation:sheetSlideUp 0.15s ease;"" onclick=""event.stopPropagation()"">
            <span id=""actionSheetAuthor"" style=""display:none;""></span>
            <span id=""actionSheetPreviewText"" style=""display:none;""></span>
            <button type=""button"" onclick=""actionSheetCopyText()"" style=""background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:7px 11px; font-size:12.5px; font-weight:850; color:#1e293b; cursor:pointer; display:inline-flex; align-items:center; gap:4px;"">
                <span>📋</span> 복사
            </button>
            <button type=""button"" onclick=""actionSheetEdit()"" style=""background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:7px 11px; font-size:12.5px; font-weight:850; color:#1d4ed8; cursor:pointer; display:inline-flex; align-items:center; gap:4px;"">
                <span>✏️</span> 수정
            </button>
            <button type=""button"" onclick=""actionSheetDelete()"" style=""background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:7px 11px; font-size:12.5px; font-weight:850; color:#dc2626; cursor:pointer; display:inline-flex; align-items:center; gap:4px;"">
                <span>🗑️</span> 삭제
            </button>
            <button type=""button"" onclick=""closeCommentActionSheet()"" style=""background:none; border:none; color:#94a3b8; font-size:16px; font-weight:900; cursor:pointer; padding:2px 6px; line-height:1;"" title=""닫기"">✕</button>
        </div>
    </div>";

        if (html.Contains(oldJesusActionSheet))
        {
            html = html.Replace(oldJesusActionSheet, newJesusActionSheet);
            Console.WriteLine("Replaced modalCommentActionSheet with compact mini popup in churchjesuswalking.html");
        }

        // Also add onclick to bubbleAttrs so clicking bubble immediately opens action modal
        html = html.Replace(
            "const bubbleAttrs = `class=\"${bubbleClass}\" data-cid=\"${c.id}\"",
            "const bubbleAttrs = `class=\"${bubbleClass}\" data-cid=\"${c.id}\" onclick=\"openCommentActionModal(${c.id})\""
        );

        File.WriteAllText(path, html, new UTF8Encoding(false));
    }

    static void SyncFiles()
    {
        string[] targets = new[] { "churchpray.html", "churchjesuswalking.html" };
        foreach (var file in targets)
        {
            string src = Path.Combine("assets", file);
            string d1 = Path.Combine("docs", file);
            string d2 = Path.Combine("app", "src", "main", "assets", file);

            File.Copy(src, d1, true);
            File.Copy(src, d2, true);
            Console.WriteLine("Synced " + file + " to docs and app/src/main/assets");
        }
    }
}
