using System;
using System.IO;
using System.Text;

class ApplyMedigateJsPhase2 {
    static void Main() {
        string path = "assets/index.html";
        string text = File.ReadAllText(path, Encoding.UTF8);

        // 1. Replace DEFAULT_BOARD_POSTS and Board category handling
        int idxStart = text.IndexOf("let currentBoardCategory = '감사게시판';");
        int idxEnd = text.IndexOf("function editCurrentPost() {", idxStart);

        if (idxStart < 0 || idxEnd < 0) {
            Console.WriteLine("Error: start or end anchor not found.");
            return;
        }

        string newSection = @"let currentBoardCategory = '감사게시판';

    // 🌟 [사용자 요청] 담임목사 인증 여부 확인 (담임목사전용게시판 접근 제어)
    function isCurrentUserPastor() {
        const role = (localStorage.getItem(""yetalk_user_role"") || """").trim();
        const isOwner = localStorage.getItem(""yetalk_is_church_owner"") === ""true"";
        return role === ""담임목사"" || isOwner;
    }

    // 🌟 [사용자 요청] 커뮤니티 전면 상단 5대 게시판 (감사, 자유, 나눔토론, 선교보고, 담임목사전용)
    function openFullscreenBoard(boardType = null) {
        cancelAutoSuiteTimer();
        if (boardType === '담임목사전용' && !isCurrentUserPastor()) {
            const currentRole = (localStorage.getItem(""yetalk_user_role"") || ""성도"").trim();
            alert(`🔒 [담임목사전용 게시판]\n\n이 공간은 담임목사님 전용 게시판입니다.\n담임목사님으로 등록 및 인증된 분만 입장하실 수 있습니다.\n\n(현재 나의 직분: ${currentRole})`);
            boardType = currentBoardCategory || '감사게시판';
        }
        if (boardType && ['감사게시판', '자유게시판', '나눔토론', '선교보고', '담임목사전용', '예수동행'].indexOf(boardType) >= 0) {
            currentBoardCategory = boardType;
        }
        switchBoardCategory(currentBoardCategory);
        const overlay = document.getElementById(""boardFullscreenOverlay"");
        if (overlay) overlay.classList.add(""show"");
    }

    function switchBoardCategory(cat) {
        if (cat === '담임목사전용' && !isCurrentUserPastor()) {
            const currentRole = (localStorage.getItem(""yetalk_user_role"") || ""성도"").trim();
            alert(`🔒 [담임목사전용 게시판]\n\n이 공간은 담임목사님 전용 게시판입니다.\n담임목사님으로 등록 및 인증된 분만 입장하실 수 있습니다.\n\n(현재 나의 직분: ${currentRole})`);
            return;
        }
        currentBoardCategory = cat;

        const tabThanks = document.getElementById(""tabComThanks"");
        const tabFree = document.getElementById(""tabComFree"");
        const tabDebate = document.getElementById(""tabComDebate"");
        const tabMission = document.getElementById(""tabComMission"");
        const tabPastor = document.getElementById(""tabComPastor"");

        if (tabThanks) tabThanks.classList.toggle(""active"", cat === '감사게시판');
        if (tabFree) tabFree.classList.toggle(""active"", cat === '자유게시판');
        if (tabDebate) tabDebate.classList.toggle(""active"", cat === '나눔토론' || cat === '예수동행');
        if (tabMission) tabMission.classList.toggle(""active"", cat === '선교보고');
        if (tabPastor) tabPastor.classList.toggle(""active"", cat === '담임목사전용');

        const titleEl = document.getElementById(""boardFullscreenTitle"");
        const subEl = document.getElementById(""boardFullscreenSub"");
        if (cat === '감사게시판') {
            if (titleEl) titleEl.innerText = ""🙏 예톡 감사게시판"";
            if (subEl) subEl.innerText = ""범사에 감사하라 (살전 5:18)"";
        } else if (cat === '자유게시판') {
            if (titleEl) titleEl.innerText = ""💬 예톡 자유게시판"";
            if (subEl) subEl.innerText = ""따뜻한 소통과 일상 나눔터"";
        } else if (cat === '나눔토론' || cat === '예수동행') {
            if (titleEl) titleEl.innerText = ""💡 예톡 나눔토론"";
            if (subEl) subEl.innerText = ""지혜와 은혜를 나누는 나눔·토론의 장"";
        } else if (cat === '선교보고') {
            if (titleEl) titleEl.innerText = ""🌍 예톡 선교보고"";
            if (subEl) subEl.innerText = ""땅 끝까지 복음을 전하는 선교 이야기 (누구나 열람 가능)"";
        } else if (cat === '담임목사전용') {
            if (titleEl) titleEl.innerText = ""👑 담임목사전용 게시판"";
            if (subEl) subEl.innerText = ""오직 담임목사님만을 위한 나눔과 목회 공간"";
        }

        renderFullscreenBoard();
    }

    function closeFullscreenBoard() {
        const overlay = document.getElementById(""boardFullscreenOverlay"");
        if (overlay) overlay.classList.remove(""show"");
    }

    function toggleBoardDropPanel() {
        openFullscreenBoard();
    }

    function switchUnifiedBoardTab(tabType) {
        if (tabType === 'notice') toggleNoticeDropPanel();
        else openFullscreenBoard();
    }

    function openBoardModal() { openFullscreenBoard(); }
    function closeBoardModal() { closeFullscreenBoard(); }

    // 🌟 [사용자 요청] 5대 게시판 기본 게시글 데이터 (감사, 자유, 나눔토론, 선교보고, 담임목사전용)
    const DEFAULT_BOARD_POSTS = [
        { 
            id: ""default_thanks_1"", 
            author: ""은혜맘"", 
            tag: ""감사게시판"", 
            board: ""감사게시판"",
            title: ""무료로 좋은 앱과 말씀을 전해주셔서 감사합니다"", 
            text: ""늘 무료로 좋은 앱들과 말씀을 전해주셔서 큰 힘이 됩니다. 모두 축복합니다! 🌿\n많은 이웃들과 따뜻한 은혜를 나누고 싶습니다."", 
            date: ""어제"", 
            hearts: 152,
            views: 152, 
            photo: """", 
            link: """",
            comments: [
                { id: ""c2_1"", author: ""소금과빛"", text: ""무료로 섬겨주시는 귀한 마음에 진심으로 감사드립니다! 🌿"", date: ""1시간 전"" }
            ]
        },
        { 
            id: ""default_thanks_2"", 
            author: ""은혜성도"", 
            tag: ""감사게시판"", 
            board: ""감사게시판"",
            title: ""오늘 하루도 살아서 숨쉬고 기도할 수 있음에 감사합니다"", 
            text: ""주님의 크신 사랑과 은혜에 감사드립니다. 범사에 감사하라 하신 말씀 기억하며 오늘도 승리합니다! 🙏"", 
            date: ""오늘"", 
            hearts: 89,
            views: 89, 
            photo: """", 
            link: """",
            comments: []
        },
        { 
            id: ""default_free_1"", 
            author: ""믿음의가정"", 
            tag: ""자유게시판"", 
            board: ""자유게시판"",
            title: ""오늘 하루도 주님 안에서 평안하시기를!"", 
            text: ""오늘 하루도 주님 안에서 평안하고 기쁜 일만 가득하시기를 응원합니다! 😊\n늘 함께 소통하며 은혜를 나눌 수 있어 참 감사합니다."", 
            date: ""오늘"", 
            hearts: 124,
            views: 124, 
            photo: """", 
            link: """",
            comments: [
                { id: ""c1_1"", author: ""소망의빛"", text: ""아멘! 오늘도 주님 은혜 안에서 평안한 하루 되세요 ✨"", date: ""10분 전"" },
                { id: ""c1_2"", author: ""기쁨지기"", text: ""좋은 말씀 나눔 감사합니다! 늘 축복합니다 🙏"", date: ""30분 전"" }
            ]
        },
        { 
            id: ""default_free_2"", 
            author: ""사랑의통로"", 
            tag: ""자유게시판"", 
            board: ""자유게시판"",
            title: ""우리동네 단골집과 교회 주보를 한 번에!"", 
            text: ""우리동네 단골집과 교회 주보를 한 번에 볼 수 있어서 너무 편리하네요~ ☕\n주변 이웃 분들에게도 적극 추천하고 있습니다."", 
            date: ""2일 전"", 
            hearts: 119,
            views: 119, 
            photo: """", 
            link: """",
            comments: [
                { id: ""c3_1"", author: ""은혜맘"", text: ""정말 편리하고 좋네요. 저희 구역 식구들에게도 널리 알릴게요 👍"", date: ""어제"" }
            ]
        },
        { 
            id: ""default_debate_1"", 
            author: ""열린마음"", 
            tag: ""나눔토론"", 
            board: ""나눔토론"",
            title: ""오늘 주일 설교 말씀 중 가장 마음에 와닿은 구절을 나눠요"", 
            text: ""주일 설교를 듣고 한 주간 어떻게 삶 속에서 실천할지 서로 생각을 나눠보는 시간입니다. 성도님들은 어떤 구절에 큰 은혜를 받으셨나요? 🌿"", 
            date: ""어제"", 
            hearts: 94,
            views: 94, 
            photo: """", 
            link: """",
            comments: [
                { id: ""cd_1"", author: ""빛과소금"", text: ""저는 요한복음 15장 5절 포도나무 비유 말씀이 가장 깊이 와닿았습니다."", date: ""2시간 전"" }
            ]
        },
        { 
            id: ""default_mission_1"", 
            author: ""김요셉선교사"", 
            tag: ""선교보고"", 
            board: ""선교보고"",
            title: ""[필리핀 선교지 소식] 어린이 여름 성경학교 은혜 가운데 마쳤습니다 🇵🇭"", 
            text: ""사랑하는 예톡 성도님들께 문안드립니다.\n필리핀 민다나오 어린이 120여 명과 함께 성경학교를 은혜롭게 마쳤습니다.\n현지 아이들이 말씀으로 자라나도록 계속적인 중보기도 부탁드립니다!"", 
            date: ""1일 전"", 
            hearts: 215,
            views: 215, 
            photo: """", 
            link: """",
            comments: [
                { id: ""cm_1"", author: ""다윗청년"", text: ""귀한 선교 사역을 응원하며 기도하겠습니다! 선교사님 영육간에 강건하세요 🙏"", date: ""3시간 전"" }
            ]
        },
        { 
            id: ""default_pastor_1"", 
            author: ""정찬석목사"", 
            tag: ""담임목사전용"", 
            board: ""담임목사전용"",
            title: ""[목회 나눔] 주일 설교 준비와 성도들을 위한 중보기도"", 
            text: ""한 주간의 목회와 주일 강단을 준비하며 성도님들의 가정과 건강, 믿음의 승리를 위해 간절히 기도합니다.\n동역하는 모든 목회자님들께 주님의 위로와 능력이 함께하시길 소망합니다."", 
            date: ""오늘"", 
            hearts: 88,
            views: 88, 
            photo: """", 
            link: """",
            comments: []
        }
    ];

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
        return posts;
    }

    // 🌟 [사용자 요청] 카테고리별 게시글 필터 공통 함수
    function filterPostsByBoard(posts, category) {
        return posts.filter(p => {
            const b = p.board || p.tag || '';
            const t = p.title || '';
            if (category === '감사게시판') {
                return b === '감사게시판' || b === '감사' || b === '말씀아멘' || t.includes('감사') || t.includes('아멘');
            } else if (category === '자유게시판') {
                return b === '자유게시판' || b === '일상나눔' || b === '소통' || b === '동네정보' || (!b && !t.includes('감사') && !t.includes('선교') && !t.includes('토론') && !t.includes('목회'));
            } else if (category === '나눔토론' || category === '예수동행') {
                return b === '나눔토론' || b === '예수동행' || b === '기도제목' || b === '묵상' || t.includes('토론') || t.includes('나눔') || t.includes('동행');
            } else if (category === '선교보고') {
                return b === '선교보고' || b === '선교' || t.includes('선교') || t.includes('해외') || t.includes('선교사');
            } else if (category === '담임목사전용') {
                return b === '담임목사전용' || b === '담임목사' || b === '목회' || t.includes('목회') || t.includes('목사');
            }
            return true;
        });
    }

    // 🌟 [사용자 요청] 커뮤니티 전면 5대 게시판 필터링 렌더링
    function renderFullscreenBoard() {
        const list = document.getElementById(""boardFullscreenList"");
        if (!list) return;

        const allPosts = getLoadedBoardPosts();
        const posts = filterPostsByBoard(allPosts, currentBoardCategory);

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
            const viewsCount = p.hearts != null ? p.hearts : (p.views || 0);
            const commentsCount = Array.isArray(p.comments) 
                ? p.comments.reduce((acc, c) => acc + 1 + (Array.isArray(c.replies) ? c.replies.length : 0), 0)
                : 0;
            const displayAuthor = formatBoardAuthorId(p.author);
            const tagText = p.board || p.tag || currentBoardCategory;
            return `
                <div class=""board-fullscreen-card"" onclick=""openBoardPostDetail('${p.id}')"">
                    <div class=""board-fullscreen-card-head"">
                        <div class=""board-fullscreen-card-author-group"">
                            <span class=""board-fullscreen-card-tag"">[${tagText}]</span>
                            <strong class=""board-fullscreen-card-author"">${displayAuthor}</strong>
                        </div>
                        <span class=""board-fullscreen-card-date"">${formatPostDate(p)}</span>
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
                        <div class=""board-view-count"">❤️ 호응 ${viewsCount}</div>
                    </div>
                </div>
            `;
        }).join("""");
    }

    // 🌟 [사용자 요청] 네이버카페 스타일의 풀화면 글쓰기 모달 제어
    let currentCafeCat = '감사게시판';
    let currentCafeAttachedPhoto = '';
    let currentCafeAttachedLink = '';

    function openCafeWriteModal(editPostId = null) {
        cancelAutoSuiteTimer();
        const modal = document.getElementById(""cafeWriteModal"");
        if (!modal) return;

        const titleEl = document.getElementById(""cafeWriteModalTitle"");
        const idInput = document.getElementById(""hiddenCafeEditPostId"");
        const titleInput = document.getElementById(""inpCafePostTitle"");
        const contentTextarea = document.getElementById(""inpCafePostContent"");
        const photoBox = document.getElementById(""cafePhotoPreviewBox"");
        const photoImg = document.getElementById(""imgCafePhotoPreview"");
        const linkBox = document.getElementById(""cafeLinkPreviewBox"");
        const linkTxt = document.getElementById(""txtCafeLinkPreview"");

        if (editPostId) {
            const posts = getLoadedBoardPosts();
            const target = posts.find(p => String(p.id) === String(editPostId));
            if (target) {
                if (titleEl) titleEl.innerText = ""✏️ 게시글 수정하기"";
                if (idInput) idInput.value = target.id;
                if (titleInput) titleInput.value = target.title || """";
                if (contentTextarea) contentTextarea.value = target.text || """";
                setCafeActiveCatChip(target.tag || '일상나눔');

                if (target.photo) {
                    currentCafeAttachedPhoto = target.photo;
                    if (photoImg) photoImg.src = target.photo;
                    if (photoBox) photoBox.style.display = ""flex"";
                } else {
                    currentCafeAttachedPhoto = """";
                    if (photoBox) photoBox.style.display = ""none"";
                }

                if (target.link) {
                    currentCafeAttachedLink = target.link;
                    if (linkTxt) linkTxt.innerText = target.link;
                    if (linkBox) linkBox.style.display = ""flex"";
                } else {
                    currentCafeAttachedLink = """";
                    if (linkBox) linkBox.style.display = ""none"";
                }
            }
        } else {
            let initialCat = currentBoardCategory || '감사게시판';
            if (initialCat === '담임목사전용' && !isCurrentUserPastor()) {
                initialCat = '자유게시판';
            }
            if (titleEl) titleEl.innerText = `✍️ ${initialCat} 글쓰기`;
            if (idInput) idInput.value = """";
            if (titleInput) titleInput.value = """";
            if (contentTextarea) contentTextarea.value = """";
            setCafeActiveCatChip(initialCat);
            currentCafeAttachedPhoto = """";
            if (photoBox) photoBox.style.display = ""none"";
            currentCafeAttachedLink = """";
            if (linkBox) linkBox.style.display = ""none"";
        }

        modal.classList.add(""show"");
    }

    function closeCafeWriteModal() {
        const modal = document.getElementById(""cafeWriteModal"");
        if (modal) modal.classList.remove(""show"");
    }

    function setCafeActiveCatChip(cat) {
        currentCafeCat = cat;
        const chips = document.querySelectorAll(""#cafeCategoryBar .cafe-cat-chip"");
        chips.forEach(c => {
            if (c.innerText.indexOf(cat) >= 0 || cat.indexOf(c.innerText.trim()) >= 0) c.classList.add(""active"");
            else c.classList.remove(""active"");
        });
    }

    function selectCafeCat(el, cat) {
        if (cat === '담임목사전용' && !isCurrentUserPastor()) {
            const currentRole = (localStorage.getItem(""yetalk_user_role"") || ""성도"").trim();
            alert(`🔒 [담임목사전용 게시판]\n\n담임목사님만 이 카테고리로 글을 작성하실 수 있습니다.\n\n(현재 나의 직분: ${currentRole})`);
            return;
        }
        currentCafeCat = cat;
        const chips = document.querySelectorAll(""#cafeCategoryBar .cafe-cat-chip"");
        chips.forEach(c => c.classList.remove(""active""));
        el.classList.add(""active"");
    }

    function handleCafePhotoUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            alert(""사진 용량은 3MB 이하로 선택해 주세요."");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            currentCafeAttachedPhoto = e.target.result;
            const box = document.getElementById(""cafePhotoPreviewBox"");
            const img = document.getElementById(""imgCafePhotoPreview"");
            if (img) img.src = currentCafeAttachedPhoto;
            if (box) box.style.display = ""flex"";
        };
        reader.readAsDataURL(file);
    }

    function removeCafePhoto() {
        currentCafeAttachedPhoto = """";
        const box = document.getElementById(""cafePhotoPreviewBox"");
        const img = document.getElementById(""imgCafePhotoPreview"");
        const input = document.getElementById(""fileCafePhotoInput"");
        if (box) box.style.display = ""none"";
        if (img) img.src = """";
        if (input) input.value = """";
    }

    function promptCafeLink() {
        const url = prompt(""첨부할 관련 링크(URL) 주소를 입력해 주세요:"", currentCafeAttachedLink || ""https://"");
        if (url === null) return;
        const trimmed = url.trim();
        if (!trimmed || trimmed === ""https://"" || trimmed === ""http://"") {
            removeCafeLink();
            return;
        }
        currentCafeAttachedLink = trimmed;
        const box = document.getElementById(""cafeLinkPreviewBox"");
        const txt = document.getElementById(""txtCafeLinkPreview"");
        if (txt) txt.innerText = trimmed;
        if (box) box.style.display = ""flex"";
    }

    function removeCafeLink() {
        currentCafeAttachedLink = """";
        const box = document.getElementById(""cafeLinkPreviewBox"");
        const txt = document.getElementById(""txtCafeLinkPreview"");
        if (box) box.style.display = ""none"";
        if (txt) txt.innerText = """";
    }

    function submitCafePost() {
        const idInput = document.getElementById(""hiddenCafeEditPostId"");
        const titleInput = document.getElementById(""inpCafePostTitle"");
        const contentTextarea = document.getElementById(""inpCafePostContent"");

        const editId = idInput ? idInput.value : """";
        const title = (titleInput ? titleInput.value : """").trim();
        const text = (contentTextarea ? contentTextarea.value : """").trim();

        if (!text) {
            alert(""본문 내용을 작성해 주세요."");
            if (contentTextarea) contentTextarea.focus();
            return;
        }

        let saved = [];
        try {
            saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
        } catch(e) {}

        const author = getBoardUserDisplayId();

        if (editId) {
            const idx = saved.findIndex(s => String(s.id) === String(editId));
            if (idx >= 0) {
                saved[idx].title = title;
                saved[idx].text = text;
                saved[idx].tag = currentCafeCat;
                saved[idx].board = currentCafeCat;
                saved[idx].photo = currentCafeAttachedPhoto;
                saved[idx].link = currentCafeAttachedLink;
            }
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
            closeCafeWriteModal();
            currentBoardCategory = currentCafeCat;
            switchBoardCategory(currentBoardCategory);
            alert(""✨ 게시글이 수정되었습니다."");
        } else {
            const newPost = {
                id: ""user_post_"" + Date.now(),
                createdAt: Date.now(),
                author: author,
                tag: currentCafeCat,
                board: currentCafeCat,
                title: title,
                text: text,
                date: ""방금 전"",
                hearts: 0,
                views: 0,
                photo: currentCafeAttachedPhoto,
                link: currentCafeAttachedLink,
                comments: []
            };
            saved.unshift(newPost);
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
            closeCafeWriteModal();
            currentBoardCategory = currentCafeCat;
            switchBoardCategory(currentBoardCategory);
            alert(`✨ [${currentCafeCat}]에 은혜로운 글이 등록되었습니다.`);
        }
    }

    // 🌟 [사용자 요청] 글 상세 읽기 화면: 메디게이트 스타일 시원한 여백 & 애드몹 150 & 세로 점 세개 메뉴 & 호응 카운트
    let currentViewingPost = null;

    function escapePostHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/""/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 세로 점 세개(⋮) 메뉴 토글 및 액션 처리
    function togglePostDetailMenu(event) {
        if (event) event.stopPropagation();
        const dropdown = document.getElementById(""postDetailMenuDropdown"");
        if (!dropdown) return;
        dropdown.style.display = (dropdown.style.display === ""none"" || !dropdown.style.display) ? ""flex"" : ""none"";
    }

    function onPostMenuAction(action) {
        const dropdown = document.getElementById(""postDetailMenuDropdown"");
        if (dropdown) dropdown.style.display = ""none"";
        if (action === 'copy') copyCurrentPostText();
        else if (action === 'edit') editCurrentPost();
        else if (action === 'delete') deleteCurrentPost();
    }

    document.addEventListener(""click"", function(e) {
        const dropdown = document.getElementById(""postDetailMenuDropdown"");
        const dotsBtn = document.getElementById(""btnPostMenuDots"");
        if (dropdown && dropdown.style.display === ""flex"") {
            if (!dropdown.contains(e.target) && (!dotsBtn || !dotsBtn.contains(e.target))) {
                dropdown.style.display = ""none"";
            }
        }
    });

    // 🌟 [사용자 요청] 하트 / 십자가 클릭 시 호응 개수 실시간 연동 (+1)
    function incrementCurrentPostReaction() {
        if (!currentViewingPost) return;
        const current = Number(currentViewingPost.hearts || currentViewingPost.views || 0);
        const updated = current + 1;
        currentViewingPost.hearts = updated;
        currentViewingPost.views = updated;

        const droneViewsEl = document.getElementById(""detailDroneViews"");
        const viewsEl = document.getElementById(""detailPostViews"");
        if (droneViewsEl) droneViewsEl.innerText = ""❤️ 호응 "" + updated;
        if (viewsEl) viewsEl.innerText = ""❤️ "" + updated;

        try {
            let saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
            const idx = saved.findIndex(s => String(s.id) === String(currentViewingPost.id));
            if (idx >= 0) {
                saved[idx].hearts = updated;
                saved[idx].views = updated;
            } else {
                saved.unshift({ ...currentViewingPost, hearts: updated, views: updated });
            }
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
        } catch(e) {}

        renderFullscreenBoard();
    }

    function openBoardPostDetail(postId) {
        cancelAutoSuiteTimer();
        const posts = getLoadedBoardPosts();
        const post = posts.find(p => String(p.id) === String(postId));
        if (!post) return;

        currentViewingPost = post;

        // 🌟 [사용자 요청] 다음글 제목 한줄 표기 & 터치 시 바로 읽기 계산 (5대 게시판 공통)
        let activeBoardPosts = [];
        const catFiltered = filterPostsByBoard(posts, currentBoardCategory);

        if (catFiltered.some(p => String(p.id) === String(post.id))) {
            activeBoardPosts = catFiltered;
        } else {
            const postBoard = post.board || post.tag || '';
            const matchTag = posts.filter(p => (p.board || p.tag || '') === postBoard);
            activeBoardPosts = matchTag.length > 1 ? matchTag : posts;
        }

        const currIdx = activeBoardPosts.findIndex(p => String(p.id) === String(post.id));
        let nextPost = null;
        let prevPost = null;
        if (currIdx >= 0 && activeBoardPosts.length > 1) {
            if (currIdx + 1 < activeBoardPosts.length) {
                nextPost = activeBoardPosts[currIdx + 1];
            } else {
                nextPost = activeBoardPosts[0]; // 순환 이동
            }
            if (currIdx - 1 >= 0) {
                prevPost = activeBoardPosts[currIdx - 1];
            } else {
                prevPost = activeBoardPosts[activeBoardPosts.length - 1];
            }
        }

        currentAdjacentNextPostId = nextPost ? nextPost.id : null;
        currentAdjacentPrevPostId = prevPost ? prevPost.id : null;

        const rowNext = document.getElementById(""rowDetailNextPost"");
        const txtNext = document.getElementById(""txtDetailNextTitle"");
        const rowPrev = document.getElementById(""rowDetailPrevPost"");
        const txtPrev = document.getElementById(""txtDetailPrevTitle"");

        if (rowNext && txtNext) {
            if (nextPost) {
                txtNext.innerText = nextPost.title || (formatBoardAuthorId(nextPost.author) + '님의 나눔');
                rowNext.style.display = ""flex"";
            } else {
                rowNext.style.display = ""none"";
            }
        }

        if (rowPrev && txtPrev) {
            if (prevPost) {
                txtPrev.innerText = prevPost.title || (formatBoardAuthorId(prevPost.author) + '님의 나눔');
                rowPrev.style.display = ""flex"";
            } else {
                rowPrev.style.display = ""none"";
            }
        }

        const modal = document.getElementById(""boardPostDetailModal"");
        const tagEl = document.getElementById(""detailPostTag"");
        const authorEl = document.getElementById(""detailPostAuthor"");
        const dateEl = document.getElementById(""detailPostDate"");
        const viewsEl = document.getElementById(""detailPostViews"");
        const droneViewsEl = document.getElementById(""detailDroneViews"");
        const titleEl = document.getElementById(""detailPostTitle"");
        const textEl = document.getElementById(""detailPostText"");
        const photoWrap = document.getElementById(""detailPhotoWrap"");
        const photoImg = document.getElementById(""detailPostImg"");
        const linkWrap = document.getElementById(""detailLinkWrap"");
        const linkBtn = document.getElementById(""detailPostLink"");
        const scrollBody = document.getElementById(""postDetailScrollBody"");
        const commentInp = document.getElementById(""inpPostComment"");

        const displayAuthor = formatBoardAuthorId(post.author);
        const postHearts = post.hearts != null ? post.hearts : (post.views || 0);

        if (tagEl) tagEl.innerText = `[${post.tag || post.board || currentBoardCategory}]`;
        if (authorEl) authorEl.innerText = displayAuthor;
        if (dateEl) dateEl.innerText = formatPostDate(post);
        if (viewsEl) viewsEl.innerText = `❤️ ${postHearts}`;
        if (droneViewsEl) droneViewsEl.innerText = `❤️ 호응 ${postHearts}`;
        if (titleEl) titleEl.innerText = post.title || (displayAuthor + '님의 나눔');
        if (textEl) {
            textEl.innerHTML = (post.text || '').replace(/\n/g, '<br>');
        }

        if (photoWrap && photoImg) {
            if (post.photo) {
                photoImg.src = post.photo;
                photoWrap.style.display = ""block"";
            } else {
                photoWrap.style.display = ""none"";
            }
        }

        if (linkWrap && linkBtn) {
            if (post.link) {
                linkBtn.href = post.link;
                linkBtn.innerHTML = `🔗 첨부 링크 바로가기 (${post.link.replace(/^https?:\/\//, '')}) ➔`;
                linkWrap.style.display = ""block"";
            } else {
                linkWrap.style.display = ""none"";
            }
        }

        if (commentInp) commentInp.value = """";
        renderPostComments(post);

        if (scrollBody) scrollBody.scrollTop = 0;
        if (modal) modal.classList.add(""show"");
    }

    // 🌟 [사용자 요청] 메디게이트 스타일 댓글 & 대댓글 렌더링 (흰색/연회색 번갈아 배치 및 답글쓰기)
    function renderPostComments(post) {
        if (!post) return;
        const countEl = document.getElementById(""postCommentsCount"");
        const listEl = document.getElementById(""postCommentsList"");
        const comments = Array.isArray(post.comments) ? post.comments : [];

        const totalComments = comments.reduce((acc, c) => acc + 1 + (Array.isArray(c.replies) ? c.replies.length : 0), 0);
        if (countEl) countEl.innerText = totalComments;
        if (!listEl) return;

        if (comments.length === 0) {
            listEl.innerHTML = `
                <div style=""text-align:center; padding:18px 10px; color:#64748b; font-size:12px; background:rgba(255,255,255,0.02); border-radius:10px;"">
                    ✨ 첫 번째 따뜻한 댓글의 주인공이 되어보세요!
                </div>
            `;
            return;
        }

        listEl.innerHTML = comments.map((c, idx) => {
            const itemBg = (idx % 2 === 0) ? '#ffffff' : '#f8fafc';
            const replies = Array.isArray(c.replies) ? c.replies : [];
            const repliesHtml = replies.map(r => `
                <div class=""post-reply-item"">
                    <div style=""display:flex; justify-content:space-between; align-items:center;"">
                        <strong style=""font-size:11.5px; color:#0369a1;"">↳ ${escapePostHtml(formatBoardAuthorId(r.author))}</strong>
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <span style=""font-size:10.5px; color:#64748b;"">${escapePostHtml(formatPostDate(r))}</span>
                            <button type=""button"" class=""btn-del-comment"" onclick=""deletePostReply('${post.id}', '${c.id}', '${r.id}')"" title=""답글 삭제"" style=""font-size:11px; padding:0 2px;"">✕</button>
                        </div>
                    </div>
                    <div style=""font-size:12.5px; color:#1e293b; line-height:1.45; word-break:break-word;"">${escapePostHtml(r.text || '')}</div>
                </div>
            `).join("""");

            return `
                <div class=""post-comment-item"" style=""background:${itemBg}; border:1px solid #e2e8f0; border-radius:10px; padding:10px 12px; display:flex; flex-direction:column; gap:6px;"">
                    <div class=""post-comment-head"" style=""display:flex; justify-content:space-between; align-items:center;"">
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <strong class=""post-comment-author"" style=""color:#0284c7; font-size:12.5px; font-weight:850;"">${escapePostHtml(formatBoardAuthorId(c.author))}</strong>
                            <span class=""post-comment-date"" style=""color:#64748b; font-size:11px;"">${escapePostHtml(formatPostDate(c))}</span>
                        </div>
                        <button type=""button"" class=""btn-del-comment"" onclick=""deletePostComment('${post.id}', '${c.id}')"" title=""댓글 삭제"" style=""color:#ef4444; background:none; border:none; cursor:pointer; font-size:13px;"">✕</button>
                    </div>
                    <div class=""post-comment-text"" style=""color:#1e293b; font-size:13.5px; line-height:1.5; word-break:break-word;"">${escapePostHtml(c.text || '')}</div>
                    <div style=""display:flex; justify-content:flex-start; margin-top:2px;"">
                        <button type=""button"" class=""btn-reply-toggle"" onclick=""toggleReplyBox('${c.id}')"">💬 답글쓰기</button>
                    </div>
                    <div class=""reply-input-box"" id=""replyBox_${c.id}"">
                        <input type=""text"" id=""inpReply_${c.id}"" placeholder=""답글을 남겨보세요..."" style=""flex:1; border:none; background:#ffffff; border-radius:6px; padding:6px 10px; font-size:12.5px; outline:none;"" onkeydown=""if(event.key==='Enter') submitPostReply('${post.id}', '${c.id}')"">
                        <button type=""button"" onclick=""submitPostReply('${post.id}', '${c.id}')"" style=""background:#0284c7; color:#fff; border:none; border-radius:6px; padding:6px 12px; font-size:12px; font-weight:800; cursor:pointer;"">등록</button>
                    </div>
                    ${repliesHtml}
                </div>
            `;
        }).join("""");
    }

    // 답글(대댓글) 입력창 토글
    function toggleReplyBox(commentId) {
        const box = document.getElementById(""replyBox_"" + commentId);
        if (!box) return;
        const isHidden = (box.style.display === ""none"" || !box.style.display);
        box.style.display = isHidden ? ""flex"" : ""none"";
        if (isHidden) {
            const inp = document.getElementById(""inpReply_"" + commentId);
            if (inp) inp.focus();
        }
    }

    // 답글(대댓글) 등록
    function submitPostReply(postId, commentId) {
        if (!currentViewingPost) return;
        const inp = document.getElementById(""inpReply_"" + commentId);
        if (!inp) return;
        const replyText = (inp.value || """").trim();
        if (!replyText) {
            inp.focus();
            return;
        }

        const comments = currentViewingPost.comments || [];
        const targetComment = comments.find(c => String(c.id) === String(commentId));
        if (!targetComment) return;

        if (!Array.isArray(targetComment.replies)) {
            targetComment.replies = [];
        }

        const author = getBoardUserDisplayId();
        targetComment.replies.push({
            id: ""r_"" + Date.now(),
            author: author,
            text: replyText,
            createdAt: Date.now(),
            date: ""방금 전""
        });

        try {
            let saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
            const idx = saved.findIndex(s => String(s.id) === String(postId));
            if (idx >= 0) {
                saved[idx].comments = currentViewingPost.comments;
            } else {
                saved.unshift({ ...currentViewingPost });
            }
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
        } catch(e) {}

        renderPostComments(currentViewingPost);
        renderFullscreenBoard();
    }

    // 답글(대댓글) 삭제
    function deletePostReply(postId, commentId, replyId) {
        if (!confirm(""답글을 삭제하시겠습니까?"")) return;
        if (!currentViewingPost) return;
        const comments = currentViewingPost.comments || [];
        const targetComment = comments.find(c => String(c.id) === String(commentId));
        if (!targetComment || !Array.isArray(targetComment.replies)) return;

        targetComment.replies = targetComment.replies.filter(r => String(r.id) !== String(replyId));

        try {
            let saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
            const idx = saved.findIndex(s => String(s.id) === String(postId));
            if (idx >= 0) {
                saved[idx].comments = currentViewingPost.comments;
            } else {
                saved.unshift({ ...currentViewingPost });
            }
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
        } catch(e) {}

        renderPostComments(currentViewingPost);
        renderFullscreenBoard();
    }

    // 🌟 [사용자 요청] 댓글 쓰도록 한줄창 등록 처리 (아이디 작성자 처리)
    function submitPostComment() {
        if (!currentViewingPost) return;
        const inputEl = document.getElementById(""inpPostComment"");
        if (!inputEl) return;
        const commentText = (inputEl.value || '').trim();
        if (!commentText) {
            inputEl.focus();
            return;
        }

        let author = getBoardUserDisplayId();

        const newComment = {
            id: ""c_"" + Date.now(),
            createdAt: Date.now(),
            author: author,
            text: commentText,
            date: ""방금 전"",
            replies: []
        };

        if (!Array.isArray(currentViewingPost.comments)) {
            currentViewingPost.comments = [];
        }
        currentViewingPost.comments.push(newComment);

        let saved = [];
        try {
            saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
        } catch(e) {}
        const idx = saved.findIndex(s => String(s.id) === String(currentViewingPost.id));
        if (idx >= 0) {
            saved[idx].comments = currentViewingPost.comments;
        } else {
            saved.unshift({ ...currentViewingPost });
        }
        localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));

        inputEl.value = """";
        renderPostComments(currentViewingPost);
        renderFullscreenBoard();
    }

    // 🌟 [사용자 요청] 댓글 삭제 처리
    function deletePostComment(postId, commentId) {
        if (!confirm(""댓글을 삭제하시겠습니까?"")) return;
        if (!currentViewingPost || String(currentViewingPost.id) !== String(postId)) return;

        if (Array.isArray(currentViewingPost.comments)) {
            currentViewingPost.comments = currentViewingPost.comments.filter(c => String(c.id) !== String(commentId));
        }

        let saved = [];
        try {
            saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
        } catch(e) {}
        const idx = saved.findIndex(s => String(s.id) === String(postId));
        if (idx >= 0) {
            saved[idx].comments = currentViewingPost.comments;
        } else {
            saved.unshift({ ...currentViewingPost });
        }
        localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));

        renderPostComments(currentViewingPost);
        renderFullscreenBoard();
    }

    function closeBoardPostDetail() {
        const modal = document.getElementById(""boardPostDetailModal"");
        if (modal) modal.classList.remove(""show"");
        renderFullscreenBoard();
    }

    function copyCurrentPostText() {
        if (!currentViewingPost) return;
        const textToCopy = `[예톡 커뮤니티 나눔]\n카테고리: ${currentViewingPost.board || currentViewingPost.tag || '나눔'}\n제목: ${currentViewingPost.title || '(제목 없음)'}\n작성자: ${currentViewingPost.author} (${currentViewingPost.date})\n\n${currentViewingPost.text}${currentViewingPost.link ? '\n\n🔗 관련 링크: ' + currentViewingPost.link : ''}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert(""📋 본문 내용이 클립보드에 복사되었습니다!\n필요한 곳에 붙여넣기 하실 수 있습니다."");
            }).catch(() => {
                fallbackCopy(textToCopy);
            });
        } else {
            fallbackCopy(textToCopy);
        }
    }

    function fallbackCopy(text) {
        const ta = document.createElement(""textarea"");
        ta.value = text;
        ta.style.position = ""fixed"";
        ta.style.opacity = ""0"";
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand(""copy"");
            alert(""📋 본문 내용이 복사되었습니다!"");
        } catch(e) {
            alert(""복사에 실패했습니다. 텍스트를 직접 길게 눌러 복사해주세요."");
        }
        document.body.removeChild(ta);
    }

    ";

        text = text.Substring(0, idxStart) + newSection + text.Substring(idxEnd);
        Console.WriteLine("Replaced JavaScript section successfully.");

        // Also connect incrementCurrentPostReaction to spawnHeartSwarmFX and spawnCrossFormationFX
        text = text.Replace("function spawnHeartSwarmFX() {", "function spawnHeartSwarmFX() {\n        incrementCurrentPostReaction();");
        text = text.Replace("function spawnCrossFormationFX() {", "function spawnCrossFormationFX() {\n        incrementCurrentPostReaction();");
        Console.WriteLine("Hooked incrementCurrentPostReaction into animation functions.");

        File.WriteAllText(path, text, Encoding.UTF8);
        Console.WriteLine("Phase 2 JS updates completed successfully.");
    }
}
