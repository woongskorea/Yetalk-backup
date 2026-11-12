using System;
using System.IO;
using System.Text;

class ApplyMedigateCommunityStyle {
    static void Main() {
        string path = "assets/index.html";
        string text = File.ReadAllText(path, Encoding.UTF8);

        // 1. CSS Updates:
        // Add dropdown menu, 150 AdMob, replies, and 5-tabs styling
        string cssAnchor = "/* 🌟 [사용자 요청] 댓글 섹션 & 댓글 쓰도록 한줄창 (화이트 테마) */";
        string newCss = @"/* 🌟 [사용자 요청] 게시글 상세 세로 점세개(⋮) 메뉴 및 드롭다운 */
        .btn-post-menu-dots {
            background: #f1f5f9;
            border: 1.5px solid #cbd5e1;
            color: #1e293b;
            font-size: 20px;
            font-weight: 950;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            line-height: 1;
            transition: all 0.15s ease;
        }
        .btn-post-menu-dots:active {
            background: #e2e8f0;
            transform: scale(0.95);
        }
        .post-detail-menu-dropdown {
            position: absolute;
            top: 42px;
            right: 0;
            background: #ffffff;
            border: 1.5px solid #cbd5e1;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            z-index: 10050;
            display: none;
            flex-direction: column;
            min-width: 130px;
            overflow: hidden;
            padding: 4px 0;
        }
        .menu-dropdown-item {
            background: transparent;
            border: none;
            text-align: left;
            padding: 10px 14px;
            font-size: 13.5px;
            font-weight: 800;
            color: #1e293b;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            box-sizing: border-box;
            transition: background 0.1s;
        }
        .menu-dropdown-item:active, .menu-dropdown-item:hover {
            background: #f1f5f9;
        }
        .menu-dropdown-item.menu-item-del {
            color: #ef4444;
            border-top: 1px solid #f1f5f9;
        }

        /* 🌟 [사용자 요청] 메디게이트 스타일 답글(대댓글) 디자인 */
        .btn-reply-toggle {
            background: none;
            border: none;
            color: #0284c7;
            font-size: 11.5px;
            font-weight: 800;
            cursor: pointer;
            padding: 2px 0;
            display: inline-flex;
            align-items: center;
            gap: 3px;
        }
        .btn-reply-toggle:hover {
            text-decoration: underline;
        }
        .reply-input-box {
            display: none;
            margin-top: 8px;
            padding: 6px 8px;
            background: #f1f5f9;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            gap: 6px;
            align-items: center;
        }
        .post-reply-item {
            margin-left: 14px;
            margin-top: 6px;
            background: #f1f5f9;
            border-left: 3px solid #0284c7;
            border-radius: 6px;
            padding: 8px 10px;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        /* 5대 게시판 추가 탭 스타일 */
        .com-tab-item#tabComDebate.active {
            background: #d97706;
            border-color: #d97706;
            color: #ffffff;
        }
        .com-tab-item#tabComMission.active {
            background: #2563eb;
            border-color: #2563eb;
            color: #ffffff;
        }
        .com-tab-item#tabComPastor.active {
            background: #7c3aed;
            border-color: #7c3aed;
            color: #ffffff;
        }
        .community-sub-pill.pill-debate {
            background: #fffbeb !important;
            border: 1.5px solid #fde68a !important;
            color: #b45309 !important;
        }
        .community-sub-pill.pill-mission {
            background: #eff6ff !important;
            border: 1.5px solid #bfdbfe !important;
            color: #1d4ed8 !important;
        }
        .community-sub-pill.pill-pastor {
            background: #faf5ff !important;
            border: 1.5px solid #e9d5ff !important;
            color: #6d28d9 !important;
        }

        " + cssAnchor;

        if (text.Contains(cssAnchor)) {
            text = text.Replace(cssAnchor, newCss);
            Console.WriteLine("Added CSS styles successfully.");
        } else {
            Console.WriteLine("Warning: CSS anchor not found.");
        }

        // Update .post-detail-spacer
        text = text.Replace(".post-detail-spacer {\n            height: 28px;\n            min-height: 28px;\n        }",
                            ".post-detail-spacer {\n            height: 48px;\n            min-height: 48px;\n        }");
        text = text.Replace(".post-detail-spacer {\r\n            height: 28px;\r\n            min-height: 28px;\r\n        }",
                            ".post-detail-spacer {\r\n            height: 48px;\r\n            min-height: 48px;\r\n        }");

        // Update .post-detail-bottom-admob min-height to 150px
        text = text.Replace("min-height: 100px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            padding: 16px 0 6px 0;\n            margin-top: 26px !important;\n            margin-bottom: 12px !important;",
                            "min-height: 150px;\n            height: 150px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            padding: 0;\n            margin: 18px auto 14px auto !important;\n            border: 1.5px solid #334155;\n            border-radius: 14px;\n            background: linear-gradient(135deg, #090d16 0%, #1e293b 100%);\n            width: 100%;\n            max-width: 340px;\n            box-sizing: border-box;\n            box-shadow: 0 4px 14px rgba(0,0,0,0.12);");
        text = text.Replace("min-height: 100px;\r\n            display: flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n            padding: 16px 0 6px 0;\r\n            margin-top: 26px !important;\r\n            margin-bottom: 12px !important;",
                            "min-height: 150px;\r\n            height: 150px;\r\n            display: flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n            padding: 0;\r\n            margin: 18px auto 14px auto !important;\r\n            border: 1.5px solid #334155;\r\n            border-radius: 14px;\r\n            background: linear-gradient(135deg, #090d16 0%, #1e293b 100%);\r\n            width: 100%;\r\n            max-width: 340px;\r\n            box-sizing: border-box;\r\n            box-shadow: 0 4px 14px rgba(0,0,0,0.12);");

        // 2. HTML: communitySubChannelsBar 5 Boards
        int idxSubBar = text.IndexOf("id=\"communitySubChannelsBar\"");
        if (idxSubBar > 0) {
            int closeSection = text.IndexOf("</section>", idxSubBar);
            if (closeSection > 0) {
                string currentBar = text.Substring(idxSubBar, closeSection - idxSubBar);
                string newBar = @"id=""communitySubChannelsBar"" style=""display:none; padding:4px 0;"">
                <div class=""subchannels-row"" style=""gap:4px; justify-content:space-between; padding:3px 0;"">
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-thanks"" onclick=""openFullscreenBoard('감사게시판')"">
                        <span>감사게시판</span>
                    </button>
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-free"" onclick=""openFullscreenBoard('자유게시판')"">
                        <span>자유게시판</span>
                    </button>
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-debate"" onclick=""openFullscreenBoard('나눔토론')"">
                        <span>나눔토론</span>
                    </button>
                </div>
                <div class=""subchannels-row"" style=""gap:4px; justify-content:space-between; padding:3px 0;"">
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-mission"" onclick=""openFullscreenBoard('선교보고')"">
                        <span>선교보고</span>
                    </button>
                    <button type=""button"" class=""subchannel-pill community-sub-pill pill-pastor"" onclick=""openFullscreenBoard('담임목사전용')"">
                        <span>담임목사전용 🔒</span>
                    </button>
                </div>
            </div>
        ";
                text = text.Substring(0, idxSubBar) + newBar + text.Substring(closeSection);
                Console.WriteLine("Updated communitySubChannelsBar to 5 boards.");
            }
        }

        // 3. HTML: communityBoardTabsBar in boardFullscreenOverlay
        int idxTabsBar = text.IndexOf("id=\"communityBoardTabsBar\"");
        if (idxTabsBar > 0) {
            int closeList = text.IndexOf("<div class=\"board-fullscreen-list\"", idxTabsBar);
            if (closeList > 0) {
                string newTabs = @"id=""communityBoardTabsBar"" style=""display:flex; flex-direction:column; gap:5px; padding:8px 10px; background:#ffffff; border-bottom:1.5px solid #e2e8f0;"">
            <div style=""display:flex; gap:6px; width:100%;"">
                <button type=""button"" class=""com-tab-item active"" id=""tabComThanks"" onclick=""switchBoardCategory('감사게시판')"" style=""flex:1;"">
                    <span>감사게시판</span>
                </button>
                <button type=""button"" class=""com-tab-item"" id=""tabComFree"" onclick=""switchBoardCategory('자유게시판')"" style=""flex:1;"">
                    <span>자유게시판</span>
                </button>
                <button type=""button"" class=""com-tab-item"" id=""tabComDebate"" onclick=""switchBoardCategory('나눔토론')"" style=""flex:1;"">
                    <span>나눔토론</span>
                </button>
            </div>
            <div style=""display:flex; gap:6px; width:100%;"">
                <button type=""button"" class=""com-tab-item"" id=""tabComMission"" onclick=""switchBoardCategory('선교보고')"" style=""flex:1;"">
                    <span>선교보고</span>
                </button>
                <button type=""button"" class=""com-tab-item"" id=""tabComPastor"" onclick=""switchBoardCategory('담임목사전용')"" style=""flex:1;"">
                    <span>담임목사전용 🔒</span>
                </button>
            </div>
        </div>

        ";
                text = text.Substring(0, idxTabsBar) + newTabs + text.Substring(closeList);
                Console.WriteLine("Updated communityBoardTabsBar to 2 rows with 5 boards.");
            }
        }

        // 4. HTML: cafeCategoryBar in cafeWriteModal
        int idxCatBar = text.IndexOf("id=\"cafeCategoryBar\"");
        if (idxCatBar > 0) {
            int closeCatBar = text.IndexOf("</div>", idxCatBar);
            if (closeCatBar > 0) {
                string newCatBar = @"id=""cafeCategoryBar"">
                <span class=""cafe-cat-chip active"" id=""catChipThanks"" onclick=""selectCafeCat(this, '감사게시판')"">🙏 감사게시판</span>
                <span class=""cafe-cat-chip"" id=""catChipFree"" onclick=""selectCafeCat(this, '자유게시판')"">💬 자유게시판</span>
                <span class=""cafe-cat-chip"" id=""catChipDebate"" onclick=""selectCafeCat(this, '나눔토론')"">💡 나눔토론</span>
                <span class=""cafe-cat-chip"" id=""catChipMission"" onclick=""selectCafeCat(this, '선교보고')"">🌍 선교보고</span>
                <span class=""cafe-cat-chip"" id=""catChipPastor"" onclick=""selectCafeCat(this, '담임목사전용')"">👑 담임목사전용 🔒</span>
            ";
                text = text.Substring(0, idxCatBar) + newCatBar + text.Substring(closeCatBar);
                Console.WriteLine("Updated cafeCategoryBar to 5 categories.");
            }
        }

        // 5. HTML: boardPostDetailModal Header Actions (Replace with ⋮ menu)
        string oldHeaderActions = @"<div class=""post-detail-header-actions"">
                <button type=""button"" class=""btn-post-header-action"" onclick=""copyCurrentPostText()"" title=""글 복사"">📋 복사</button>
                <button type=""button"" class=""btn-post-header-action"" onclick=""editCurrentPost()"" title=""글 수정"">✏️ 수정</button>
            </div>";
        string newHeaderActions = @"<div class=""post-detail-header-actions"" style=""position:relative;"">
                <button type=""button"" class=""btn-post-menu-dots"" id=""btnPostMenuDots"" onclick=""togglePostDetailMenu(event)"" title=""더보기 메뉴"">⋮</button>
                <div class=""post-detail-menu-dropdown"" id=""postDetailMenuDropdown"" style=""display:none;"">
                    <button type=""button"" class=""menu-dropdown-item"" onclick=""onPostMenuAction('copy')"">📋 글 복사</button>
                    <button type=""button"" class=""menu-dropdown-item"" onclick=""onPostMenuAction('edit')"">✏️ 글 수정</button>
                    <button type=""button"" class=""menu-dropdown-item menu-item-del"" onclick=""onPostMenuAction('delete')"">🗑️ 글 삭제</button>
                </div>
            </div>";

        if (text.Contains(oldHeaderActions)) {
            text = text.Replace(oldHeaderActions, newHeaderActions);
            Console.WriteLine("Updated post detail header actions to three dots ⋮ menu.");
        } else {
            // Try CRLF
            oldHeaderActions = oldHeaderActions.Replace("\n", "\r\n");
            newHeaderActions = newHeaderActions.Replace("\n", "\r\n");
            if (text.Contains(oldHeaderActions)) {
                text = text.Replace(oldHeaderActions, newHeaderActions);
                Console.WriteLine("Updated post detail header actions (CRLF).");
            } else {
                Console.WriteLine("Warning: oldHeaderActions not found directly.");
            }
        }

        // 6. HTML: Remove post-detail-action-buttons from card body
        int idxActionBtns = text.IndexOf("<div class=\"post-detail-action-buttons\">");
        if (idxActionBtns > 0) {
            int closeActionBtns = text.IndexOf("</div>", idxActionBtns);
            if (closeActionBtns > 0) {
                text = text.Substring(0, idxActionBtns) + text.Substring(closeActionBtns + 6);
                Console.WriteLine("Removed post-detail-action-buttons from post body.");
            }
        }

        // 7. HTML: Change '❤️ 방문 0' to '❤️ 호응 0'
        text = text.Replace("id=\"detailDroneViews\">❤️ 방문 0</span>", "id=\"detailDroneViews\">❤️ 호응 0</span>");
        text = text.Replace("id=\"detailDroneViews\">❤️ 방문 ", "id=\"detailDroneViews\">❤️ 호응 ");

        // 8. HTML: AdMob 150 banner text
        text = text.Replace("Google AdMob (320 x 100)", "Google AdMob (320 x 150)");

        File.WriteAllText(path, text, Encoding.UTF8);
        Console.WriteLine("Phase 1 HTML updates completed successfully.");
    }
}
