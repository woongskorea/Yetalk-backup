using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string filePath = @"assets\minichurch.html";
        if (!File.Exists(filePath))
        {
            Console.WriteLine("File not found: " + filePath);
            return;
        }

        string content = File.ReadAllText(filePath, Encoding.UTF8);

        // 1. Rename '예수동행자유채팅' to '교제채팅' in chip navigation and titles
        content = content.Replace(
            @"<button type=""button"" class=""menu-chip-btn active"" id=""chip_chat"" onclick=""switchTab('chat')"">🕊️ 예수동행자유채팅</button>",
            @"<button type=""button"" class=""menu-chip-btn active"" id=""chip_chat"" onclick=""switchTab('chat')"">🕊️ 교제채팅</button>"
        );
        content = content.Replace(
            @"<button type=""button"" class=""menu-chip-btn"" id=""chip_chat"" onclick=""switchTab('chat')"">🕊️ 예수동행자유채팅</button>",
            @"<button type=""button"" class=""menu-chip-btn"" id=""chip_chat"" onclick=""switchTab('chat')"">🕊️ 교제채팅</button>"
        );
        content = content.Replace(
            @"title=""터치하여 예수동행 자유채팅방 입장""",
            @"title=""터치하여 교제채팅방 입장"""
        );
        content = content.Replace(
            @"title: ""예수동행자유채팅"",",
            @"title: ""교제채팅"","
        );
        content = content.Replace(
            @"chat: ""🕊️ [예수동행자유채팅] 대표 그림 & 말씀 수정"",",
            @"chat: ""🕊️ [교제채팅] 대표 그림 & 말씀 수정"","
        );

        // 2. Worship hero image replaced with worship_praise_singer.jpg
        content = content.Replace(
            @"src=""https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1600&q=90"" alt=""예배찬양""",
            @"src=""images/worship_praise_singer.jpg"" alt=""예배찬양"""
        );
        content = content.Replace(
            @"imageUrl: ""https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1600&q=90"",",
            @"imageUrl: ""images/worship_praise_singer.jpg"","
        );

        // Bump KEY_SECTION_HERO_PREFIX to v4
        content = content.Replace(
            @"const KEY_SECTION_HERO_PREFIX = ""yetalk_section_hero_v2_"";",
            @"const KEY_SECTION_HERO_PREFIX = ""yetalk_section_hero_v4_"";"
        );

        // 3. Fix scroll-spy bug (prevent forcing 'notice' when scrolling inside expanded views)
        string oldScrollSpy = @"    function updateScrollSpyActiveTab() {
        const container = document.querySelector("".tab-view-container"");
        if (!container || isChatRoomOpen) return;
        if (container.classList.contains(""in-admin-tab-mode"")) return;

        const sections = [
            { key: 'chat', el: document.getElementById('tab_panel_chat') },
            { key: 'worship', el: document.getElementById('tab_panel_worship') },
            { key: 'prayer', el: document.getElementById('tab_panel_prayer') },
            { key: 'notice', el: document.getElementById('tab_panel_notice') }
        ];

        const currentScrollTop = container.scrollTop;
        const triggerOffset = Math.min(180, container.clientHeight * 0.35);

        let activeKey = 'chat';
        // 맨 아래 끝까지 스크롤 시 마지막 공용 탭인 공지알림 활성화
        if (container.scrollHeight - container.scrollTop - container.clientHeight < 40) {
            activeKey = 'notice';
        } else {
            for (let i = sections.length - 1; i >= 0; i--) {
                const sec = sections[i];
                if (sec.el && currentScrollTop >= (sec.el.offsetTop - triggerOffset)) {
                    activeKey = sec.key;
                    break;
                }
            }
        }

        if (activeKey !== activeTabKey) {
            syncTabMenuToKey(activeKey);
        }
    }";

        string newScrollSpy = @"    /* 🌟 [사용자 버그 수정] 상세 화면(예배찬양, 중보기도, 공지알림) 안에서는 스크롤 스파이 차단 -> 공지알림 오작동 방지 */
    function updateScrollSpyActiveTab() {
        const container = document.querySelector("".tab-view-container"");
        if (!container || isChatRoomOpen) return;
        if (container.classList.contains(""in-admin-tab-mode"")) return;
        if (isWorshipExpanded || isPrayerExpanded || isNoticeExpanded) return;

        const sections = [
            { key: 'chat', el: document.getElementById('tab_panel_chat') },
            { key: 'worship', el: document.getElementById('tab_panel_worship') },
            { key: 'prayer', el: document.getElementById('tab_panel_prayer') },
            { key: 'notice', el: document.getElementById('tab_panel_notice') }
        ];

        if (isOfferingPublic()) {
            const offPanel = document.getElementById('tab_panel_offering');
            if (offPanel) sections.push({ key: 'offering', el: offPanel });
        }

        const currentScrollTop = container.scrollTop;
        const triggerOffset = Math.min(180, container.clientHeight * 0.35);

        let activeKey = 'chat';
        for (let i = sections.length - 1; i >= 0; i--) {
            const sec = sections[i];
            if (sec.el && sec.el.style.display !== 'none' && currentScrollTop >= (sec.el.offsetTop - triggerOffset)) {
                activeKey = sec.key;
                break;
            }
        }

        if (activeKey !== activeTabKey) {
            syncTabMenuToKey(activeKey);
        }
    }";

        content = content.Replace(oldScrollSpy, newScrollSpy);

        // Also update initMiniChurchScrollSpy scroll listener to skip when expanded
        content = content.Replace(
            @"            if (isProgrammaticScrolling || isChatRoomOpen) return;
            if (container.classList.contains(""in-admin-tab-mode"")) return;",
            @"            if (isProgrammaticScrolling || isChatRoomOpen) return;
            if (container.classList.contains(""in-admin-tab-mode"")) return;
            if (isWorshipExpanded || isPrayerExpanded || isNoticeExpanded) return;"
        );

        // 4. Worship player: Fullscreen hide top menu, Shorts mode, and video URL modal
        // Add CSS for worship fullscreen mode and shorts mode
        string worshipExtraCss = @"
        /* 🌟 [사용자 요청] 예배찬양 유튜브: 상단 메뉴 숨기고 쇼츠 기준 풀스크린 */
        body.worship-fullscreen-mode .fixed-top-container {
            display: none !important;
        }
        body.worship-fullscreen-mode .tab-view-container {
            height: 100vh !important;
            max-height: 100vh !important;
            padding-top: 0 !important;
        }
        .worship-fullscreen-top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: rgba(15, 23, 42, 0.95);
            color: #ffffff;
            box-sizing: border-box;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            z-index: 20;
        }
        .btn-worship-top-back {
            background: transparent;
            border: none;
            color: #ffffff;
            font-size: 14.5px;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .worship-stage-card.shorts-mode {
            aspect-ratio: 9 / 16;
            max-width: 440px;
            margin: 0 auto;
            flex: 1;
            height: auto;
        }
        .worship-stage-card.shorts-mode iframe {
            object-fit: cover;
        }
        .btn-worship-shorts-pill {
            background: #334155;
            border: 1px solid #64748b;
            color: #fde047;
            font-size: 11.5px;
            font-weight: 800;
            padding: 4px 9px;
            border-radius: 8px;
            cursor: pointer;
        }
        ";

        content = content.Replace(
            @"        .worship-first-page-fullscreen {",
            worshipExtraCss + @"        .worship-first-page-fullscreen {"
        );

        // Add worship top back bar inside worshipContentView
        string oldWorshipContentStart = @"            <!-- 🌟 클릭 시 펼쳐지는 예배 & 찬양 영상 상세 화면 (교회 앱과 100% 동일) -->
            <div id=""worshipContentView"" style=""display:none; width:100%;"">";

        string newWorshipContentStart = @"            <!-- 🌟 클릭 시 펼쳐지는 예배 & 찬양 영상 상세 화면 (상단 메뉴 숨김 및 쇼츠/롱폼 지원) -->
            <div id=""worshipContentView"" style=""display:none; width:100%;"">
                <div class=""worship-fullscreen-top-bar"">
                    <button type=""button"" class=""btn-worship-top-back"" onclick=""closeWorshipContentView()"">
                        <span>‹ 뒤로가기</span>
                    </button>
                    <strong style=""font-size:13.5px; color:#fde047; font-weight:900;"">📺 예배 & 찬양 영상</strong>
                    <button type=""button"" class=""btn-worship-shorts-pill"" id=""btnToggleShorts"" onclick=""toggleWorshipShortsMode()"">
                        📱 쇼츠/롱폼
                    </button>
                </div>";

        content = content.Replace(oldWorshipContentStart, newWorshipContentStart);

        // Update worshipCtrlsRow to have prominent "영상주소등록" button
        content = content.Replace(
            @"                        <button type=""button"" class=""btn-worship-tool primary"" onclick=""openAddVideoModal()"">
                            영상올리기
                        </button>",
            @"                        <button type=""button"" class=""btn-worship-tool primary"" onclick=""openAddVideoModal()"" title=""유튜브 영상 주소 등록 및 수정"">
                            📹 영상주소
                        </button>"
        );

        // Update openWorshipContentView and closeWorshipContentView in JS to toggle body.worship-fullscreen-mode
        string oldOpenWorshipJs = @"    function openWorshipContentView() {
        isWorshipExpanded = true;
        const panel = document.getElementById(""tab_panel_worship"");
        const hero = document.getElementById(""worshipHeroView"");
        const content = document.getElementById(""worshipContentView"");
        const container = document.querySelector("".tab-view-container"");

        if (panel) {
            panel.classList.remove(""hero-state"");
            panel.classList.add(""content-state"");
        }
        if (hero) hero.style.display = ""none"";
        if (content) {
            content.style.display = ""block"";
            fitWorshipFirstPage();
        }
        if (container) {
            container.classList.add(""in-content-expanded"", ""in-worship-expanded"");
            container.scrollTop = 0;
        }
        syncTabMenuToKey('worship');
    }";

        string newOpenWorshipJs = @"    let isShortsMode = false;

    function toggleWorshipShortsMode() {
        isShortsMode = !isShortsMode;
        const card = document.getElementById(""worshipStageCard"");
        const btn = document.getElementById(""btnToggleShorts"");
        if (card) card.classList.toggle(""shorts-mode"", isShortsMode);
        if (btn) btn.innerText = isShortsMode ? ""🎬 롱폼 전환"" : ""📱 쇼츠 전환"";
        showToast(isShortsMode ? ""📱 쇼츠 풀스크린 모드로 전환되었습니다."" : ""🎬 롱폼 표준 모드로 전환되었습니다."");
    }

    function openWorshipContentView() {
        isWorshipExpanded = true;
        document.body.classList.add(""worship-fullscreen-mode"");
        const panel = document.getElementById(""tab_panel_worship"");
        const hero = document.getElementById(""worshipHeroView"");
        const content = document.getElementById(""worshipContentView"");
        const container = document.querySelector("".tab-view-container"");

        if (panel) {
            panel.classList.remove(""hero-state"");
            panel.classList.add(""content-state"");
        }
        if (hero) hero.style.display = ""none"";
        if (content) {
            content.style.display = ""block"";
            fitWorshipFirstPage();
        }
        if (container) {
            container.classList.add(""in-content-expanded"", ""in-worship-expanded"");
            container.scrollTop = 0;
        }
        syncTabMenuToKey('worship');
    }";

        content = content.Replace(oldOpenWorshipJs, newOpenWorshipJs);

        content = content.Replace(
            @"    function closeWorshipContentView() {
        isWorshipExpanded = false;",
            @"    function closeWorshipContentView() {
        isWorshipExpanded = false;
        document.body.classList.remove(""worship-fullscreen-mode"");"
        );

        // 5. Add #tab_panel_offering section right after #tab_panel_notice
        string offeringPanelHtml = @"
        <!-- ==========================================================
             [탭 5. 헌금]
             🌟 [사용자 요청]
             - 아래로 스크롤 시 헌금 메뉴까지 이동
             - 관리자가 공개 또는 비공개 설정 가능
             ========================================================== -->
        <section class=""tab-content-panel public-section hero-state"" id=""tab_panel_offering"">
            <div class=""bus-hero-fullscreen-wrap"" id=""offeringHeroView"">
                <div class=""bus-hero-card"" onclick=""openMiniChurchOfferingModal()"" title=""터치하여 헌금 안내 및 계좌 보기"">
                    <img class=""bus-hero-bg"" id=""offeringHeroBgImage"" src=""images/jesus_walking_path.jpg"" alt=""헌금 안내"" onerror=""this.onerror=null; this.src='images/heaven_bus_peace.jpg';"">
                    <div class=""bus-hero-overlay""></div>

                    <div class=""hero-owner-edit-bar"" onclick=""event.stopPropagation()"">
                        <button type=""button"" class=""btn-hero-edit-pill"" onclick=""openEditSectionHeroModal('offering')"">
                            ✏️ 그림·글 수정
                        </button>
                    </div>

                    <div class=""bus-hero-bottom-area"">
                        <div class=""bus-verse-transparent-box"">
                            <div class=""bus-verse-badge-row"">
                                <span class=""bus-verse-badge"" id=""offeringHeroVerseBadge"">📖 고린도후서 9:7</span>
                                <span style=""font-size:12px; color:#fde047; font-weight:800;"" id=""offeringHeroSubBadge"">💳 은혜와 감사의 온라인 헌금</span>
                            </div>
                            <p class=""bus-verse-text"" id=""offeringHeroVerseText"">“각각 그 마음에 정한 대로 할 것이요 인색함으로나 억지로 하지 말지니 하나님은 즐겨 내는 자를 사랑하시느니라”</p>
                        </div>
                        <div style=""padding: 4px 0 6px 0;"">
                            <button type=""button"" class=""btn-hero-open-content"" onclick=""event.stopPropagation(); openMiniChurchOfferingModal();"">
                                <span id=""offeringHeroBtnText"">💳 헌금 안내 및 송금 계좌 보기</span>
                                <span style=""font-size:16px;"">›</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        ";

        content = content.Replace(
            @"            <!-- 🌟 클릭 시 펼쳐지는 공지알림 상세 화면 -->
            <div id=""noticeContentView"" style=""display:none; width:100%;"">
                <div class=""content-view-back-bar"">
                    <button type=""button"" class=""btn-content-view-back"" onclick=""closeNoticeContentView()"">
                        <span>‹</span> <span>첫화면(대표 성화)으로 접기</span>
                    </button>
                    <strong style=""font-size:13.5px; font-weight:900; color:#0f172a;"">📢 교회 소식 & 공지</strong>
                </div>
                <div class=""simple-section-wrap"" style=""padding-top:14px;"">
                    <div class=""simple-sec-header"">
                        <h3 class=""simple-sec-title"">📢 교회 소식 & 공지</h3>
                        <button type=""button"" class=""btn-simple-pill"" id=""btnWriteNotice"" onclick=""openWriteNoticeModal()"">＋ 새 공지 작성</button>
                    </div>
                    <div id=""noticeItemsList"" style=""display:flex; flex-direction:column; gap:8px;""></div>
                </div>
            </div>
        </section>",
            @"            <!-- 🌟 클릭 시 펼쳐지는 공지알림 상세 화면 -->
            <div id=""noticeContentView"" style=""display:none; width:100%;"">
                <div class=""content-view-back-bar"">
                    <button type=""button"" class=""btn-content-view-back"" onclick=""closeNoticeContentView()"">
                        <span>‹</span> <span>첫화면(대표 성화)으로 접기</span>
                    </button>
                    <strong style=""font-size:13.5px; font-weight:900; color:#0f172a;"">📢 교회 소식 & 공지</strong>
                </div>
                <div class=""simple-section-wrap"" style=""padding-top:14px;"">
                    <div class=""simple-sec-header"">
                        <h3 class=""simple-sec-title"">📢 교회 소식 & 공지</h3>
                        <button type=""button"" class=""btn-simple-pill"" id=""btnWriteNotice"" onclick=""openWriteNoticeModal()"">＋ 새 공지 작성</button>
                    </div>
                    <div id=""noticeItemsList"" style=""display:flex; flex-direction:column; gap:8px;""></div>
                </div>
            </div>
        </section>" + offeringPanelHtml
        );

        // 6. Offering menu visibility logic
        // Update top chip for offering
        content = content.Replace(
            @"<button type=""button"" class=""menu-chip-btn"" id=""chip_offering"" onclick=""openMiniChurchOfferingModal()"" title=""교회 헌금 안내 및 송금 계좌"">💳 헌금</button>",
            @"<button type=""button"" class=""menu-chip-btn"" id=""chip_offering"" onclick=""switchTab('offering')"" title=""교회 헌금 안내 및 송금 계좌"">💳 헌금</button>"
        );

        // In switchTab: add offering support
        content = content.Replace(
            @"        if (tabKey === 'notice' && activeTabKey === 'notice') {
            toggleNoticeContentView();
            return;
        }",
            @"        if (tabKey === 'notice' && activeTabKey === 'notice') {
            toggleNoticeContentView();
            return;
        }
        if (tabKey === 'offering' && activeTabKey === 'offering') {
            openMiniChurchOfferingModal();
            return;
        }"
        );

        content = content.Replace(
            @"const isPublicSection = ['chat', 'worship', 'prayer', 'notice'].includes(tabKey);",
            @"const isPublicSection = ['chat', 'worship', 'prayer', 'notice', 'offering'].includes(tabKey);"
        );

        // 7. Add offering visibility toggle in Admin Modal and default hero
        string offeringAdminToggleHtml = @"
            <div class=""m-form-group"" style=""background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:10px; margin-top:8px;"">
                <label style=""display:flex; align-items:center; gap:8px; font-size:13.5px; font-weight:800; cursor:pointer;"">
                    <input type=""checkbox"" id=""chkAdminOfferingVisible"" onchange=""toggleOfferingVisibility(this.checked)"" style=""width:18px; height:18px; cursor:pointer;"">
                    <span>💳 헌금 메뉴 공개 (체크 해제 시 성도/방문자에게 비공개)</span>
                </label>
            </div>";

        content = content.Replace(
            @"        <div class=""modal-footer"">
            <button type=""button"" class=""btn-m-confirm"" onclick=""saveAdminControlSettings()"">설정 저장</button>
        </div>",
            offeringAdminToggleHtml + @"
        <div class=""modal-footer"">
            <button type=""button"" class=""btn-m-confirm"" onclick=""saveAdminControlSettings()"">설정 저장</button>
        </div>"
        );

        // 8. Update Friend Invitation Banner and 2 Buttons in Contact Cards
        // Replace top banner in tab_panel_friends:
        string oldFriendBanner = @"                <!-- 🌟 [사용자 요청] 카톡 링크 초청 보내는 한 줄 버튼 -->
                <button type=""button"" class=""btn-kakao-invite-banner"" onclick=""shareKakaoMiniChurchInvite()"">
                    <div class=""invite-banner-left"">
                        <span style=""font-size:18px;"">🟡</span>
                        <span class=""invite-banner-text"">“예톡 이곳을 강추합니다. 오세요!” 카톡 친구 초청하기</span>
                    </div>
                    <span class=""invite-banner-pill"">초청 복사 📋</span>
                </button>";

        string newFriendBanner = @"                <!-- 🌟 [사용자 요청] 친구 초청 카드 (""예톡으로 와 보세요!"" + 링크 주소 복사 + 카톡 보내기) -->
                <div class=""friend-invite-card"" style=""background:linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); border:1.5px solid #facc15; border-radius:14px; padding:12px 14px; box-shadow:0 2px 8px rgba(234,179,8,0.18); display:flex; flex-direction:column; gap:10px;"">
                    <div style=""display:flex; align-items:center; gap:8px;"">
                        <span style=""font-size:22px;"">💌</span>
                        <div>
                            <div style=""font-size:15px; font-weight:900; color:#854d0e;"">“예톡으로 와 보세요!”</div>
                            <div style=""font-size:12px; font-weight:700; color:#a16207;"">소중한 친구를 우리 작은교회로 초대합니다 ✨</div>
                        </div>
                    </div>
                    <div style=""display:grid; grid-template-columns: 1fr 1fr; gap:8px;"">
                        <button type=""button"" onclick=""copyMiniChurchInviteLink()"" style=""background:#ffffff; border:1.5px solid #ca8a04; color:#854d0e; font-size:13px; font-weight:900; padding:9px 10px; border-radius:10px; display:flex; align-items:center; justify-content:center; gap:5px; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.06);"">
                            📋 링크 주소 복사
                        </button>
                        <button type=""button"" onclick=""sendKakaoMiniChurchInvite()"" style=""background:#fee500; border:1.5px solid #eab308; color:#191919; font-size:13px; font-weight:900; padding:9px 10px; border-radius:10px; display:flex; align-items:center; justify-content:center; gap:5px; cursor:pointer; box-shadow:0 1.5px 4px rgba(254,229,0,0.35);"">
                            🟡 카톡 보내기
                        </button>
                    </div>
                </div>";

        content = content.Replace(oldFriendBanner, newFriendBanner);

        // Update contact card buttons to only TWO: [예톡] and [채팅]
        string oldContactButtons = @"                    <div class=""kf-contact-actions-grid"">
                        <button type=""button"" class=""btn-kf-action btn-kf-yetalk"" onclick=""openContactChat('${escapeHtml(c.name)}')"">
                            <span>💬</span> 예톡
                        </button>
                        <button type=""button"" class=""btn-kf-action btn-kf-sms"" onclick=""window.location.href='sms:${c.phone}'"">
                            <span>✉️</span> 문자
                        </button>
                        <button type=""button"" class=""btn-kf-action btn-kf-call"" onclick=""window.location.href='tel:${c.phone}'"">
                            <span>📞</span> 전화
                        </button>
                        <button type=""button"" class=""btn-kf-action btn-kf-kakao"" onclick=""shareKakaoFriend('${escapeHtml(c.name)}', '${c.phone}')"">
                            <span>🟡</span> 카톡
                        </button>
                    </div>";

        string newContactButtons = @"                    <div class=""kf-contact-actions-grid"" style=""grid-template-columns: 1fr 1fr; gap: 8px;"">
                        <button type=""button"" class=""btn-kf-action btn-kf-yetalk"" onclick=""openContactYetalkInfo('${escapeHtml(c.name)}', '${c.phone}')"" style=""background:#f0fdf4; border:1.5px solid #86efac; color:#166534; font-size:13.5px; font-weight:900; padding:8px 12px; border-radius:9px; display:flex; align-items:center; justify-content:center; gap:6px;"">
                            <span>🌿</span> 예톡
                        </button>
                        <button type=""button"" class=""btn-kf-action btn-kf-chat"" onclick=""openContactChat('${escapeHtml(c.name)}')"" style=""background:#0284c7; border:none; color:#ffffff; font-size:13.5px; font-weight:900; padding:8px 12px; border-radius:9px; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 1.5px 4px rgba(2,132,199,0.3);"">
                            <span>💬</span> 채팅
                        </button>
                    </div>";

        content = content.Replace(oldContactButtons, newContactButtons);

        // 9. Add helper functions in JS:
        // - Offering visibility toggle and storage
        // - copyMiniChurchInviteLink and sendKakaoMiniChurchInvite
        // - openContactYetalkInfo
        string extraHelperJs = @"
    /* 🌟 [사용자 요청] 헌금 공개/비공개 설정 */
    const KEY_OFFERING_VISIBILITY = ""yetalk_minichurch_offering_visibility_v1"";

    function isOfferingPublic() {
        return localStorage.getItem(KEY_OFFERING_VISIBILITY) !== ""private"";
    }

    function toggleOfferingVisibility(isPublic) {
        localStorage.setItem(KEY_OFFERING_VISIBILITY, isPublic ? ""public"" : ""private"");
        applyOfferingVisibility();
        showToast(isPublic ? ""💳 헌금 메뉴가 공개되었습니다."" : ""🔒 헌금 메뉴가 비공개 설정되었습니다."");
    }

    function applyOfferingVisibility() {
        const isPub = isOfferingPublic();
        const chip = document.getElementById(""chip_offering"");
        const panel = document.getElementById(""tab_panel_offering"");
        const chk = document.getElementById(""chkAdminOfferingVisible"");
        if (chip) chip.style.display = isPub ? ""inline-flex"" : ""none"";
        if (panel) panel.style.display = isPub ? """" : ""none"";
        if (chk) chk.checked = isPub;
    }

    /* 🌟 [사용자 요청] 친구 초청 링크 복사 및 카톡 발송 */
    function getMiniChurchInviteUrl() {
        return window.location.href.split('#')[0];
    }

    function getMiniChurchInviteMessage() {
        const title = getChurchTitle();
        return `예톡으로 와 보세요!\n⛪ [${title}] 은혜의 말씀과 찬양 나눔에 성도님을 초대합니다.\n👉 ${getMiniChurchInviteUrl()}`;
    }

    function copyMiniChurchInviteLink() {
        const text = getMiniChurchInviteMessage();
        copyTextToClipboard(text);
        showToast(""📋 초청 링크와 문구가 복사되었습니다! 카톡이나 문자로 붙여넣어 보내세요."");
    }

    function sendKakaoMiniChurchInvite() {
        const text = getMiniChurchInviteMessage();
        if (window.AndroidBridge && typeof window.AndroidBridge.openKakaoTalk === ""function"") {
            try {
                window.AndroidBridge.openKakaoTalk("""", text);
                return;
            } catch(e){}
        }
        copyTextToClipboard(text);
        showToast(""📋 초청 문구 복사 완료! 카카오톡을 열어 붙여넣어주세요."");
        setTimeout(() => {
            window.location.href = ""kakaotalk://"";
        }, 400);
    }

    function openContactYetalkInfo(name, phone) {
        shareKakaoMiniChurchInvite();
    }
";

        content = content.Replace(
            @"    function initAllSectionHeroes() {
        ['chat', 'worship', 'prayer', 'notice'].forEach(secKey => {
            renderSectionHero(secKey);
        });
    }",
            extraHelperJs + @"
    function initAllSectionHeroes() {
        ['chat', 'worship', 'prayer', 'notice', 'offering'].forEach(secKey => {
            renderSectionHero(secKey);
        });
        applyOfferingVisibility();
    }"
        );

        // Add offering to DEFAULT_SECTION_HEROS
        string oldDefaultSecHeroes = @"        notice: {
            title: ""공지알림"",
            subBadge: ""📢 은혜와 축복의 교회 소식"",
            verseBadge: ""📖 시편 133:1"",
            verseText: ""“보라 형제가 연합하여 동거함이 어찌 그리 선하고 아름다운고 머리에 있는 보배로운 기름이 수염에 흐름 같도다”"",
            imageUrl: ""https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1600&q=90"",
            fallbackUrl: ""images/heaven_bus.jpg"",
            btnText: ""📢 교회 소식 & 공지사항 열람하기""
        }
    };";

        string newDefaultSecHeroes = @"        notice: {
            title: ""공지알림"",
            subBadge: ""📢 은혜와 축복의 교회 소식"",
            verseBadge: ""📖 시편 133:1"",
            verseText: ""“보라 형제가 연합하여 동거함이 어찌 그리 선하고 아름다운고 머리에 있는 보배로운 기름이 수염에 흐름 같도다”"",
            imageUrl: ""https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1600&q=90"",
            fallbackUrl: ""images/heaven_bus.jpg"",
            btnText: ""📢 교회 소식 & 공지사항 열람하기""
        },
        offering: {
            title: ""헌금"",
            subBadge: ""💳 은혜와 감사의 온라인 헌금"",
            verseBadge: ""📖 고린도후서 9:7"",
            verseText: ""“각각 그 마음에 정한 대로 할 것이요 인색함으로나 억지로 하지 말지니 하나님은 즐겨 내는 자를 사랑하시느니라”"",
            imageUrl: ""images/jesus_walking_path.jpg"",
            fallbackUrl: ""images/heaven_bus_peace.jpg"",
            btnText: ""💳 헌금 안내 및 송금 계좌 보기""
        }
    };";

        content = content.Replace(oldDefaultSecHeroes, newDefaultSecHeroes);

        File.WriteAllText(filePath, content, Encoding.UTF8);
        Console.WriteLine("Successfully updated " + filePath);

        File.Copy(filePath, @"docs\minichurch.html", true);
        Console.WriteLine("Synced to docs\\minichurch.html");

        File.Copy(filePath, @"app\src\main\assets\minichurch.html", true);
        Console.WriteLine("Synced to app\\src\\main\\assets\\minichurch.html");
    }
}
