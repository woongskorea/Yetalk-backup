using System;
using System.IO;
using System.Text;

class ApplyCommunityBoards
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

            // 1. CSS update: add styles for community sub-channels and board tabs
            string oldCssTarget = ".subchannel-pill.pill-patriot { color: #4338ca !important; }";
            string newCss = @".subchannel-pill.pill-patriot { color: #4338ca !important; }

        /* 🌟 [사용자 요청] 커뮤니티 3대 소메뉴 바: 감사게시판, 자유게시판, 예수동행 */
        .community-subchannels-bar {
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
        }
        .community-sub-pill.pill-thanks {
            background: #ecfdf5 !important;
            border: 1.5px solid #a7f3d0 !important;
            color: #047857 !important;
        }
        .community-sub-pill.pill-free {
            background: #f0f9ff !important;
            border: 1.5px solid #bae6fd !important;
            color: #0284c7 !important;
        }
        .community-sub-pill.pill-jesus {
            background: #faf5ff !important;
            border: 1.5px solid #e9d5ff !important;
            color: #7c3aed !important;
        }
        .community-sub-pill:active {
            transform: scale(0.96);
        }

        /* 🌟 [사용자 요청] 커뮤니티 모달 내부 3대 게시판 탭 전환 바 */
        .community-board-tabs-bar {
            display: flex;
            background: #ffffff;
            border-bottom: 2px solid #e2e8f0;
            padding: 8px 12px;
            gap: 8px;
            position: sticky;
            top: 52px;
            z-index: 10;
        }
        .com-tab-item {
            flex: 1;
            padding: 9px 4px;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            background: #f8fafc;
            color: #475569;
            font-size: 13.5px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.18s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .com-tab-item.active {
            background: #0f172a;
            color: #ffffff;
            border-color: #0f172a;
            font-weight: 950;
            box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
        }
        .com-tab-item#tabComThanks.active {
            background: #047857;
            border-color: #047857;
            color: #ffffff;
        }
        .com-tab-item#tabComFree.active {
            background: #0284c7;
            border-color: #0284c7;
            color: #ffffff;
        }
        .com-tab-item#tabComJesus.active {
            background: #7c3aed;
            border-color: #7c3aed;
            color: #ffffff;
        }";

            if (text.Contains(oldCssTarget))
            {
                text = text.Replace(oldCssTarget, newCss);
                Console.WriteLine("Added CSS in: " + path);
            }

            // 2. HTML: Change btnThreeBoard to 커뮤니티 ▶ with toggleCommunitySubMenu()
            string oldBoardBtn = @"                <button type=""button"" class=""btn-three-item btn-three-board"" id=""btnThreeBoard"" onclick=""openFullscreenBoard()"">
                    <span>💬 자유게시판</span>
                </button>";
            string newBoardBtn = @"                <button type=""button"" class=""btn-three-item btn-three-board"" id=""btnThreeBoard"" onclick=""toggleCommunitySubMenu()"" title=""커뮤니티 3대 게시판 보기"">
                    <span>💬 커뮤니티 ▶</span>
                </button>";

            if (text.Contains(oldBoardBtn))
            {
                text = text.Replace(oldBoardBtn, newBoardBtn);
                Console.WriteLine("Replaced btnThreeBoard in: " + path);
            }

            // 3. HTML: Add communitySubChannelsBar right after yetalkTvSubChannelsBar
            string oldTvBarEnd = @"                    <button type=""button"" class=""subchannel-pill pill-bible"" onclick=""openTvChannel('성경')"">성경</button>
                    <button type=""button"" class=""subchannel-pill pill-patriot"" onclick=""openTvChannel('애국')"">애국</button>
                </div>
            </div>";

            string newTvBarEnd = @"                    <button type=""button"" class=""subchannel-pill pill-bible"" onclick=""openTvChannel('성경')"">성경</button>
                    <button type=""button"" class=""subchannel-pill pill-patriot"" onclick=""openTvChannel('애국')"">애국</button>
                </div>
            </div>

            <!-- 🌟 [사용자 요청] 커뮤니티 누르면 나타나는 가로 3개 소메뉴: 감사게시판, 자유게시판, 예수동행 -->
            <div class=""""""community-subchannels-bar"""""" id=""""""communitySubChannelsBar"""""" style=""""""display:none;"""""">
                <div class=""""""subchannels-row"""""" style=""""""gap:6px; justify-content:space-around; padding:6px 2px;"""""">
                    <button type=""""""button"""""" class=""""""subchannel-pill community-sub-pill pill-thanks"""""" onclick=""""""openFullscreenBoard('감사게시판')"""""">
                        <span>🙏 감사게시판</span>
                    </button>
                    <button type=""""""button"""""" class=""""""subchannel-pill community-sub-pill pill-free"""""" onclick=""""""openFullscreenBoard('자유게시판')"""""">
                        <span>💬 자유게시판</span>
                    </button>
                    <button type=""""""button"""""" class=""""""subchannel-pill community-sub-pill pill-jesus"""""" onclick=""""""openFullscreenBoard('예수동행')"""""">
                        <span>✝️ 예수동행</span>
                    </button>
                </div>
            </div>";

            // clean up 6 quotes from literal string: replace """ with "
            newTvBarEnd = newTvBarEnd.Replace("\"\"\"", "\"");

            if (text.Contains(oldTvBarEnd))
            {
                text = text.Replace(oldTvBarEnd, newTvBarEnd);
                Console.WriteLine("Added communitySubChannelsBar in: " + path);
            }

            // 4. HTML: In amen confession card, update text to 감사게시판
            string oldAmenSub = @"<span class=""amen-confession-sub"">말씀 묵상 후 아래 '아멘'을 누르시면 자유게시판에 자동 등록됩니다</span>";
            string newAmenSub = @"<span class=""amen-confession-sub"">말씀 묵상 후 아래 '아멘'을 누르시면 감사게시판에 자동 등록됩니다</span>";
            if (text.Contains(oldAmenSub))
            {
                text = text.Replace(oldAmenSub, newAmenSub);
                Console.WriteLine("Updated amenConfessionSub to 감사게시판 in: " + path);
            }

            // 5. HTML: In boardFullscreenOverlay, update title and add 3 board tabs
            string oldBoardHeader = @"        <header class=""board-fullscreen-header"">
            <button type=""button"" class=""btn-board-fullscreen-back"" onclick=""closeFullscreenBoard()"">✕ 닫기</button>
            <div class=""board-fullscreen-title-box"">
                <span class=""board-fullscreen-title"">💬 예톡 자유게시판</span>
                <span class=""board-fullscreen-sub"">따뜻한 소통과 일상 나눔터</span>
            </div>
            <button type=""button"" class=""btn-cafe-submit"" onclick=""openCafeWriteModal()"" style=""padding:5px 12px; font-size:12px;"">✍️ 글쓰기</button>
        </header>

        <!-- 풀스크린 게시글 스크롤 리스트 (JS로 압축 렌더링) -->";

            string newBoardHeader = @"        <header class=""board-fullscreen-header"">
            <button type=""button"" class=""btn-board-fullscreen-back"" onclick=""closeFullscreenBoard()"">✕ 닫기</button>
            <div class=""board-fullscreen-title-box"">
                <span class=""board-fullscreen-title"" id=""boardFullscreenTitle"">💬 예톡 커뮤니티</span>
                <span class=""board-fullscreen-sub"" id=""boardFullscreenSub"">따뜻한 소통과 은혜의 나눔터</span>
            </div>
            <button type=""button"" class=""btn-cafe-submit"" onclick=""openCafeWriteModal()"" style=""padding:5px 12px; font-size:12px;"">✍️ 글쓰기</button>
        </header>

        <!-- 🌟 [사용자 요청] 감사게시판, 자유게시판, 예수동행 3대 게시판 탭 전환 -->
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
        </div>

        <!-- 풀스크린 게시글 스크롤 리스트 (JS로 압축 렌더링) -->";

            if (text.Contains(oldBoardHeader))
            {
                text = text.Replace(oldBoardHeader, newBoardHeader);
                Console.WriteLine("Updated boardFullscreenOverlay header and added tabs in: " + path);
            }

            // 6. HTML: In cafeWriteModal, update category chips to 감사게시판, 자유게시판, 예수동행
            string oldCafeChips = @"            <!-- 카테고리 선택 -->
            <div class=""cafe-category-bar"" id=""cafeCategoryBar"">
                <span class=""cafe-cat-chip active"" onclick=""selectCafeCat(this, '일상나눔')"">일상나눔</span>
                <span class=""cafe-cat-chip"" onclick=""selectCafeCat(this, '감사')"">감사</span>
                <span class=""cafe-cat-chip"" onclick=""selectCafeCat(this, '소통')"">소통</span>
                <span class=""cafe-cat-chip"" onclick=""selectCafeCat(this, '기도제목')"">기도제목</span>
                <span class=""cafe-cat-chip"" onclick=""selectCafeCat(this, '동네정보')"">동네정보</span>
            </div>";

            string newCafeChips = @"            <!-- 카테고리 선택 -->
            <div class=""cafe-category-bar"" id=""cafeCategoryBar"">
                <span class=""cafe-cat-chip active"" id=""catChipThanks"" onclick=""selectCafeCat(this, '감사게시판')"">🙏 감사게시판</span>
                <span class=""cafe-cat-chip"" id=""catChipFree"" onclick=""selectCafeCat(this, '자유게시판')"">💬 자유게시판</span>
                <span class=""cafe-cat-chip"" id=""catChipJesus"" onclick=""selectCafeCat(this, '예수동행')"">✝️ 예수동행</span>
            </div>";

            if (text.Contains(oldCafeChips))
            {
                text = text.Replace(oldCafeChips, newCafeChips);
                Console.WriteLine("Updated cafeCategoryBar chips in: " + path);
            }

            // 7. JS: Update toggleYetalkTvSubChannels and toggleNoticeDropPanel to close communitySubChannelsBar
            string oldToggleTv = @"        if (panelNotice) panelNotice.style.display = ""none"";
        if (btnNotice) btnNotice.classList.remove(""active"");
        if (panelBoard) panelBoard.style.display = ""none"";
        if (btnBoard) btnBoard.classList.remove(""active"");";

            string newToggleTv = @"        if (panelNotice) panelNotice.style.display = ""none"";
        if (btnNotice) btnNotice.classList.remove(""active"");
        if (panelBoard) panelBoard.style.display = ""none"";
        if (btnBoard) btnBoard.classList.remove(""active"");
        const barCom = document.getElementById(""communitySubChannelsBar"");
        if (barCom) barCom.style.display = ""none"";";

            if (text.Contains(oldToggleTv))
            {
                text = text.Replace(oldToggleTv, newToggleTv);
                Console.WriteLine("Updated toggleYetalkTvSubChannels in: " + path);
            }

            string oldToggleNotice = @"        if (barTv) barTv.style.display = ""none"";
        if (btnTv) btnTv.classList.remove(""active"");
        const btnNotice = document.getElementById(""btnThreeNotice"");
        const btnBoard = document.getElementById(""btnThreeBoard"");";

            string newToggleNotice = @"        if (barTv) barTv.style.display = ""none"";
        if (btnTv) btnTv.classList.remove(""active"");
        const barComNotice = document.getElementById(""communitySubChannelsBar"");
        if (barComNotice) barComNotice.style.display = ""none"";
        const btnNotice = document.getElementById(""btnThreeNotice"");
        const btnBoard = document.getElementById(""btnThreeBoard"");";

            if (text.Contains(oldToggleNotice))
            {
                text = text.Replace(oldToggleNotice, newToggleNotice);
                Console.WriteLine("Updated toggleNoticeDropPanel in: " + path);
            }

            // 8. JS: Add toggleCommunitySubMenu function
            string oldOpenBoardFunc = @"    // 🌟 [사용자 요청] 자유게시판 풀 화면 (전체화면) 열기 & 닫기
    function openFullscreenBoard() {
        cancelAutoSuiteTimer();
        renderFullscreenBoard();
        const overlay = document.getElementById(""boardFullscreenOverlay"");
        if (overlay) overlay.classList.add(""show"");
    }";

            string newOpenBoardFunc = @"    // 🌟 [사용자 요청] 커뮤니티 3대 소메뉴 (감사게시판 / 자유게시판 / 예수동행) 토글
    function toggleCommunitySubMenu() {
        const bar = document.getElementById(""communitySubChannelsBar"");
        const btnBoard = document.getElementById(""btnThreeBoard"");
        const panelNotice = document.getElementById(""unifiedNoticePanel"");
        const btnNotice = document.getElementById(""btnThreeNotice"");
        const barTv = document.getElementById(""yetalkTvSubChannelsBar"");
        const btnTv = document.getElementById(""btnThreeTv"");

        if (panelNotice) panelNotice.style.display = ""none"";
        if (btnNotice) btnNotice.classList.remove(""active"");
        if (barTv) barTv.style.display = ""none"";
        if (btnTv) btnTv.classList.remove(""active"");

        if (!bar) return;
        if (bar.style.display === ""none"" || !bar.style.display) {
            bar.style.display = ""flex"";
            if (btnBoard) btnBoard.classList.add(""active"");
        } else {
            bar.style.display = ""none"";
            if (btnBoard) btnBoard.classList.remove(""active"");
        }
    }

    let currentBoardCategory = '감사게시판';

    // 🌟 [사용자 요청] 커뮤니티 풀 화면 열기 (지정된 게시판으로 바로 열기 지원)
    function openFullscreenBoard(boardType = null) {
        cancelAutoSuiteTimer();
        if (boardType && ['감사게시판', '자유게시판', '예수동행'].indexOf(boardType) >= 0) {
            currentBoardCategory = boardType;
        }
        switchBoardCategory(currentBoardCategory);
        const overlay = document.getElementById(""boardFullscreenOverlay"");
        if (overlay) overlay.classList.add(""show"");
    }

    function switchBoardCategory(cat) {
        currentBoardCategory = cat;

        const tabThanks = document.getElementById(""tabComThanks"");
        const tabFree = document.getElementById(""tabComFree"");
        const tabJesus = document.getElementById(""tabComJesus"");
        if (tabThanks) tabThanks.classList.toggle(""active"", cat === '감사게시판');
        if (tabFree) tabFree.classList.toggle(""active"", cat === '자유게시판');
        if (tabJesus) tabJesus.classList.toggle(""active"", cat === '예수동행');

        const titleEl = document.getElementById(""boardFullscreenTitle"");
        const subEl = document.getElementById(""boardFullscreenSub"");
        if (cat === '감사게시판') {
            if (titleEl) titleEl.innerText = ""🙏 예톡 감사게시판"";
            if (subEl) subEl.innerText = ""범사에 감사하라 (살전 5:18)"";
        } else if (cat === '자유게시판') {
            if (titleEl) titleEl.innerText = ""💬 예톡 자유게시판"";
            if (subEl) subEl.innerText = ""따뜻한 소통과 일상 나눔터"";
        } else if (cat === '예수동행') {
            if (titleEl) titleEl.innerText = ""✝️ 예수동행 일기"";
            if (subEl) subEl.innerText = ""주님과 24시간 동행하는 삶"";
        }

        renderFullscreenBoard();
    }";

            if (text.Contains(oldOpenBoardFunc))
            {
                text = text.Replace(oldOpenBoardFunc, newOpenBoardFunc);
                Console.WriteLine("Replaced openFullscreenBoard and added switchBoardCategory in: " + path);
            }

            // 9. JS: Update DEFAULT_BOARD_POSTS with all 3 categories
            string oldDefaultPosts = @"    const DEFAULT_BOARD_POSTS = [
        { 
            id: ""default_1"", 
            author: ""user_grace"", 
            tag: ""일상나눔"", 
            title: ""오늘 하루도 주님 안에서 평안하시기를!"", 
            text: ""오늘 하루도 주님 안에서 평안하고 기쁜 일만 가득하시기를 응원합니다! 😊\n늘 함께 소통하며 은혜를 나눌 수 있어 참 감사합니다."", 
            date: ""오늘"", 
            views: 124, 
            photo: """", 
            link: """",
            comments: [
                { id: ""c1_1"", author: ""user_faith"", text: ""아멘! 오늘도 주님 은혜 안에서 평안한 하루 되세요 ✨"", date: ""10분 전"" },
                { id: ""c1_2"", author: ""user_hope"", text: ""좋은 말씀 나눔 감사합니다! 늘 축복합니다 🙏"", date: ""30분 전"" }
            ]
        },
        { 
            id: ""default_2"", 
            author: ""user_yetalk"", 
            tag: ""감사"", 
            title: ""무료로 좋은 앱과 말씀을 전해주셔서 감사합니다"", 
            text: ""늘 무료로 좋은 앱들과 말씀을 전해주셔서 큰 힘이 됩니다. 모두 축복합니다! 🌿\n많은 이웃들과 따뜻한 은혜를 나누고 싶습니다."", 
            date: ""어제"", 
            views: 98, 
            photo: """", 
            link: """",
            comments: [
                { id: ""c2_1"", author: ""user_salt"", text: ""무료로 섬겨주시는 귀한 마음에 진심으로 감사드립니다! 🌿"", date: ""1시간 전"" }
            ]
        },
        { 
            id: ""default_3"", 
            author: ""user_love"", 
            tag: ""소통"", 
            title: ""우리동네 단골집과 교회 주보를 한 번에!"", 
            text: ""우리동네 단골집과 교회 주보를 한 번에 볼 수 있어서 너무 편리하네요~ ☕\n주변 이웃 분들에게도 적극 추천하고 있습니다."", 
            date: ""2일 전"", 
            views: 76, 
            photo: """", 
            link: """",
            comments: [
                { id: ""c3_1"", author: ""user_deacon"", text: ""정말 편리하고 좋네요. 저희 구역 식구들에게도 널리 알릴게요 👍"", date: ""어제"" }
            ]
        }
    ];";

            string newDefaultPosts = @"    const DEFAULT_BOARD_POSTS = [
        { 
            id: ""default_thanks_1"", 
            author: ""user_yetalk"", 
            tag: ""감사게시판"", 
            board: ""감사게시판"",
            title: ""무료로 좋은 앱과 말씀을 전해주셔서 감사합니다"", 
            text: ""늘 무료로 좋은 앱들과 말씀을 전해주셔서 큰 힘이 됩니다. 모두 축복합니다! 🌿\n많은 이웃들과 따뜻한 은혜를 나누고 싶습니다."", 
            date: ""어제"", 
            views: 152, 
            photo: """", 
            link: """",
            comments: [
                { id: ""c2_1"", author: ""user_salt"", text: ""무료로 섬겨주시는 귀한 마음에 진심으로 감사드립니다! 🌿"", date: ""1시간 전"" }
            ]
        },
        { 
            id: ""default_thanks_2"", 
            author: ""user_grace"", 
            tag: ""감사게시판"", 
            board: ""감사게시판"",
            title: ""오늘 하루도 살아서 숨쉬고 기도할 수 있음에 감사합니다"", 
            text: ""주님의 크신 사랑과 은혜에 감사드립니다. 범사에 감사하라 하신 말씀 기억하며 오늘도 승리합니다! 🙏"", 
            date: ""오늘"", 
            views: 89, 
            photo: """", 
            link: """",
            comments: []
        },
        { 
            id: ""default_free_1"", 
            author: ""user_faith"", 
            tag: ""자유게시판"", 
            board: ""자유게시판"",
            title: ""오늘 하루도 주님 안에서 평안하시기를!"", 
            text: ""오늘 하루도 주님 안에서 평안하고 기쁜 일만 가득하시기를 응원합니다! 😊\n늘 함께 소통하며 은혜를 나눌 수 있어 참 감사합니다."", 
            date: ""오늘"", 
            views: 124, 
            photo: """", 
            link: """",
            comments: [
                { id: ""c1_1"", author: ""user_faith"", text: ""아멘! 오늘도 주님 은혜 안에서 평안한 하루 되세요 ✨"", date: ""10분 전"" },
                { id: ""c1_2"", author: ""user_hope"", text: ""좋은 말씀 나눔 감사합니다! 늘 축복합니다 🙏"", date: ""30분 전"" }
            ]
        },
        { 
            id: ""default_free_2"", 
            author: ""user_love"", 
            tag: ""자유게시판"", 
            board: ""자유게시판"",
            title: ""우리동네 단골집과 교회 주보를 한 번에!"", 
            text: ""우리동네 단골집과 교회 주보를 한 번에 볼 수 있어서 너무 편리하네요~ ☕\n주변 이웃 분들에게도 적극 추천하고 있습니다."", 
            date: ""2일 전"", 
            views: 76, 
            photo: """", 
            link: """",
            comments: [
                { id: ""c3_1"", author: ""user_deacon"", text: ""정말 편리하고 좋네요. 저희 구역 식구들에게도 널리 알릴게요 👍"", date: ""어제"" }
            ]
        },
        { 
            id: ""default_jesus_1"", 
            author: ""user_david"", 
            tag: ""예수동행"", 
            board: ""예수동행"",
            title: ""24시간 주님을 바라보며 매 순간 동행하기를 결단합니다"", 
            text: ""내 생각과 고집을 십자가에 못 박고, 오직 내 안에 사시는 그리스도와 온전히 동행하는 하루가 되기를 소망합니다. ✝️"", 
            date: ""오늘"", 
            views: 110, 
            photo: """", 
            link: """",
            comments: [
                { id: ""cj_1"", author: ""user_paul"", text: ""아멘! 주님과 동행하는 삶이 가장 큰 축복입니다 🙏"", date: ""15분 전"" }
            ]
        }
    ];";

            if (text.Contains(oldDefaultPosts))
            {
                text = text.Replace(oldDefaultPosts, newDefaultPosts);
                Console.WriteLine("Updated DEFAULT_BOARD_POSTS in: " + path);
            }

            // 10. JS: Update renderFullscreenBoard with category filtering
            string oldRenderBoard = @"    // 🌟 [사용자 요청] 자유게시판 목록: 하트, 십자가 옆에 댓글 (갯수) 보여주기 & 글 압축 카드 (아이디 작성자 노출)
    function renderFullscreenBoard() {
        const list = document.getElementById(""boardFullscreenList"");
        if (!list) return;

        const posts = getLoadedBoardPosts();

        list.innerHTML = posts.map(p => {
            const viewsCount = p.views != null ? p.views : (p.hearts || 0);
            const commentsCount = Array.isArray(p.comments) ? p.comments.length : 0;
            const displayAuthor = formatBoardAuthorId(p.author);
            return `
                <div class=""board-fullscreen-card"" onclick=""openBoardPostDetail('${p.id}')"">
                    <div class=""board-fullscreen-card-head"">
                        <div class=""board-fullscreen-card-author-group"">
                            <span class=""board-fullscreen-card-tag"">[${p.tag || '일상나눔'}]</span>
                            <strong class=""board-fullscreen-card-author"">${displayAuthor}</strong>
                        </div>
                        <span class=""board-fullscreen-card-date"">${p.date || '오늘'}</span>
                    </div>
                    ${p.title ? `<div class=""board-fullscreen-card-title"">${p.title}</div>` : ''}
                    <div class=""board-fullscreen-card-text"">${p.text || ''}</div>
                    ${(p.photo || p.link) ? `
                        <div class=""board-card-attach-badges"">
                            ${p.photo ? `<span class=""badge-card-attach"">📷 사진</span>` : ''}
                            ${p.link ? `<span class=""badge-card-attach"">🔗 링크</span>` : ''}
                        </div>
                    ` : ''}
                    <div class=""board-fullscreen-card-foot"" onclick=""event.stopPropagation()"">
                        <div class=""board-foot-drones"">
                            <button type=""button"" class=""btn-card-drone"" onclick=""spawnDrone('heart')"">❤️ 하트</button>
                            <button type=""button"" class=""btn-card-drone"" onclick=""spawnDrone('cross')"">✝️ 십자가</button>
                            <span class=""board-card-comment-badge"">💬 댓글 (${commentsCount})</span>
                        </div>
                        <div class=""board-view-count"">❤️ ${viewsCount}</div>
                    </div>
                </div>
            `;
        }).join("""");
    }";

            string newRenderBoard = @"    // 🌟 [사용자 요청] 커뮤니티 3대 게시판 (감사게시판 / 자유게시판 / 예수동행) 필터링 렌더링
    function renderFullscreenBoard() {
        const list = document.getElementById(""boardFullscreenList"");
        if (!list) return;

        const allPosts = getLoadedBoardPosts();

        const posts = allPosts.filter(p => {
            const b = p.board || p.tag || '';
            const t = p.title || '';
            if (currentBoardCategory === '감사게시판') {
                return b === '감사게시판' || b === '감사' || b === '말씀아멘' || t.includes('감사') || t.includes('아멘');
            } else if (currentBoardCategory === '자유게시판') {
                return b === '자유게시판' || b === '일상나눔' || b === '소통' || b === '동네정보' || (!b && !t.includes('감사') && !t.includes('동행'));
            } else if (currentBoardCategory === '예수동행') {
                return b === '예수동행' || b === '기도제목' || b === '묵상' || t.includes('동행') || t.includes('순종');
            }
            return true;
        });

        if (posts.length === 0) {
            list.innerHTML = `
                <div style=""text-align:center; padding:50px 20px; color:#64748b;"">
                    <div style=""font-size:38px; margin-bottom:12px;"">🌿</div>
                    <div style=""font-size:15.5px; font-weight:900; color:#1e293b; margin-bottom:6px;"">아직 등록된 [${currentBoardCategory}] 글이 없습니다.</div>
                    <div style=""font-size:13px; color:#94a3b8; margin-bottom:18px;"">첫 번째 은혜의 나눔을 남겨보세요!</div>
                    <button type=""button"" onclick=""openCafeWriteModal()"" style=""padding:9px 20px; background:#047857; color:#ffffff; border:none; border-radius:10px; font-size:13px; font-weight:800; cursor:pointer;"">
                        ✍️ ${currentBoardCategory} 첫 글쓰기
                    </button>
                </div>
            `;
            return;
        }

        list.innerHTML = posts.map(p => {
            const viewsCount = p.views != null ? p.views : (p.hearts || 0);
            const commentsCount = Array.isArray(p.comments) ? p.comments.length : 0;
            const displayAuthor = formatBoardAuthorId(p.author);
            const tagText = p.board || p.tag || currentBoardCategory;
            return `
                <div class=""board-fullscreen-card"" onclick=""openBoardPostDetail('${p.id}')"">
                    <div class=""board-fullscreen-card-head"">
                        <div class=""board-fullscreen-card-author-group"">
                            <span class=""board-fullscreen-card-tag"">[${tagText}]</span>
                            <strong class=""board-fullscreen-card-author"">${displayAuthor}</strong>
                        </div>
                        <span class=""board-fullscreen-card-date"">${p.date || '오늘'}</span>
                    </div>
                    ${p.title ? `<div class=""board-fullscreen-card-title"">${p.title}</div>` : ''}
                    <div class=""board-fullscreen-card-text"">${p.text || ''}</div>
                    ${(p.photo || p.link) ? `
                        <div class=""board-card-attach-badges"">
                            ${p.photo ? `<span class=""badge-card-attach"">📷 사진</span>` : ''}
                            ${p.link ? `<span class=""badge-card-attach"">🔗 링크</span>` : ''}
                        </div>
                    ` : ''}
                    <div class=""board-fullscreen-card-foot"" onclick=""event.stopPropagation()"">
                        <div class=""board-foot-drones"">
                            <button type=""button"" class=""btn-card-drone"" onclick=""spawnDrone('heart')"">❤️ 하트</button>
                            <button type=""button"" class=""btn-card-drone"" onclick=""spawnDrone('cross')"">✝️ 십자가</button>
                            <span class=""board-card-comment-badge"">💬 댓글 (${commentsCount})</span>
                        </div>
                        <div class=""board-view-count"">❤️ ${viewsCount}</div>
                    </div>
                </div>
            `;
        }).join("""");
    }";

            if (text.Contains(oldRenderBoard))
            {
                text = text.Replace(oldRenderBoard, newRenderBoard);
                Console.WriteLine("Replaced renderFullscreenBoard in: " + path);
            }

            // 11. JS: In openCafeWriteModal, pre-select currentBoardCategory
            string oldCafeOpenCat = @"    let currentCafeCat = '일상나눔';";
            string newCafeOpenCat = @"    let currentCafeCat = '감사게시판';";
            if (text.Contains(oldCafeOpenCat))
            {
                text = text.Replace(oldCafeOpenCat, newCafeOpenCat);
            }

            string oldCafeResetCode = @"            if (titleEl) titleEl.innerText = ""✍️ 자유게시판 글쓰기"";
            if (idInput) idInput.value = """";
            if (titleInput) titleInput.value = """";
            if (contentTextarea) contentTextarea.value = """";
            removeCafePhoto();
            removeCafeLink();
            currentCafeCat = '일상나눔';
            document.querySelectorAll(""#cafeCategoryBar .cafe-cat-chip"").forEach(c => c.classList.remove(""active""));
            const firstChip = document.querySelector(""#cafeCategoryBar .cafe-cat-chip"");
            if (firstChip) firstChip.classList.add(""active"");";

            string newCafeResetCode = @"            if (titleEl) titleEl.innerText = `✍️ [${currentBoardCategory}] 글쓰기`;
            if (idInput) idInput.value = """";
            if (titleInput) titleInput.value = """";
            if (contentTextarea) contentTextarea.value = """";
            removeCafePhoto();
            removeCafeLink();
            currentCafeCat = currentBoardCategory || '감사게시판';
            document.querySelectorAll(""#cafeCategoryBar .cafe-cat-chip"").forEach(c => {
                if (c.textContent.includes(currentCafeCat)) c.classList.add(""active"");
                else c.classList.remove(""active"");
            });";

            if (text.Contains(oldCafeResetCode))
            {
                text = text.Replace(oldCafeResetCode, newCafeResetCode);
                Console.WriteLine("Updated openCafeWriteModal reset logic in: " + path);
            }

            // 12. JS: In submitCafePost, save board tag and alert with board name
            string oldSubmitPost = @"            const newPost = {
                id: Date.now(),
                author: author,
                tag: currentCafeCat,
                title: title || (content.length > 20 ? content.substring(0, 20) + ""..."" : content),
                text: content,
                date: ""방금 전"",
                views: 1,
                photo: currentCafeAttachedPhoto,
                link: currentCafeAttachedLink,
                comments: []
            };
            saved.unshift(newPost);
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
            closeCafeWriteModal();
            renderFullscreenBoard();
            alert(""✨ 자유게시판에 따뜻한 글이 등록되었습니다."");";

            string newSubmitPost = @"            const newPost = {
                id: Date.now(),
                author: author,
                tag: currentCafeCat,
                board: currentCafeCat,
                title: title || (content.length > 20 ? content.substring(0, 20) + ""..."" : content),
                text: content,
                date: ""방금 전"",
                views: 1,
                photo: currentCafeAttachedPhoto,
                link: currentCafeAttachedLink,
                comments: []
            };
            saved.unshift(newPost);
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
            closeCafeWriteModal();
            currentBoardCategory = currentCafeCat;
            switchBoardCategory(currentBoardCategory);
            alert(`✨ [${currentCafeCat}]에 은혜로운 글이 등록되었습니다.`);";

            if (text.Contains(oldSubmitPost))
            {
                text = text.Replace(oldSubmitPost, newSubmitPost);
                Console.WriteLine("Updated submitCafePost in: " + path);
            }

            // 13. JS: In submitBibleAmenConfession, automatically register to 감사게시판
            string oldAmenSubmit = @"        const newPost = {
            id: Date.now(),
            author: displayAuthorId,
            tag: ""말씀아멘"",
            title: `[아멘] ${currentBook} ${currentCh}${unit} 말씀 묵상 감사`,
            text: text,
            date: ""방금 전"",
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

        if (typeof renderFullscreenBoard === 'function') {
            renderFullscreenBoard();
        }

        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = ""✅ 아멘 등록 완료"";
            btn.style.background = ""#047857"";
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = ""linear-gradient(135deg, #059669 0%, #047857 100%)"";
            }, 3000);
        }

        inp.value = """";
        delete inp.dataset.userEdited;
        alert(`✨ 아멘!\n아이디 '${displayAuthorId}' 님으로 예톡 자유게시판에 오늘의 감사 고백이 안전하게 등록되었습니다.`);";

            string newAmenSubmit = @"        const titleEl = document.getElementById(""amenConfessionSlotTitle"");
        const slotTitle = titleEl ? titleEl.innerText.trim() : ""감사 고백"";

        // 🌟 [사용자 요청] 아침/점심/저녁 감사 고백에 아멘 누르면 감사게시판으로 자동 등록!
        const newPost = {
            id: Date.now(),
            author: displayAuthorId,
            tag: ""감사게시판"",
            board: ""감사게시판"",
            title: `[${slotTitle}] ${currentBook} ${currentCh}${unit} 말씀 묵상 감사`,
            text: text,
            date: ""방금 전"",
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

        currentBoardCategory = ""감사게시판"";
        if (typeof renderFullscreenBoard === 'function') {
            renderFullscreenBoard();
        }

        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = ""✅ 아멘 감사 등록"";
            btn.style.background = ""#047857"";
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = ""linear-gradient(135deg, #059669 0%, #047857 100%)"";
            }, 3000);
        }

        inp.value = """";
        delete inp.dataset.userEdited;
        alert(`✨ 아멘!\n아이디 '${displayAuthorId}' 님으로 [감사게시판]에 오늘의 감사 고백이 안전하게 등록되었습니다.`);";

            if (text.Contains(oldAmenSubmit))
            {
                text = text.Replace(oldAmenSubmit, newAmenSubmit);
                Console.WriteLine("Updated submitBibleAmenConfession to 감사게시판 in: " + path);
            }

            File.WriteAllText(path, text, new UTF8Encoding(false));
            Console.WriteLine("Done file: " + path);
        }
    }
}
