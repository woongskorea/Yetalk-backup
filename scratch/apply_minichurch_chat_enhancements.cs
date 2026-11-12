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

        // 1. Update hero image in HTML
        content = content.Replace(
            @"<img class=""bus-hero-bg"" id=""heroBgImage"" src=""images/heaven_bus.jpg"" alt=""성화 - 타실 분 다 타세요!"" onerror=""this.onerror=null; this.src='https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=90';"">",
            @"<img class=""bus-hero-bg"" id=""heroBgImage"" src=""images/jesus_walking_path.jpg"" alt=""성화 - 예수님과 함께 걷는 길"" onerror=""this.onerror=null; this.src='images/heaven_bus_peace.jpg';"">"
        );

        // 2. Adjust .bus-hero-bg object-position for portrait
        content = content.Replace(
            @"object-position: center 14%;",
            @"object-position: center center;"
        );

        // 3. Update DEFAULT_HERO_SLIDES images and labels
        string oldDefaultHeroSlides = @"    const DEFAULT_HERO_SLIDES = [
        {
            id: ""slide_1"",
            title: ""천국버스"",
            subBadge: ""✨ 타실 분 다 타세요!"",
            verseBadge: ""📖 요한복음 14:6"",
            verseText: ""“예수께서 이르시되 내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라”"",
            imageUrl: ""images/heaven_bus.jpg"",
            fallbackUrl: ""https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=90""
        },
        {
            id: ""slide_2"",
            title: ""선한 목자 예수님"",
            subBadge: ""✨ 내게 부족함이 없으리로다"",
            verseBadge: ""📖 시편 23:1-2"",
            verseText: ""“여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다”"",
            imageUrl: ""https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=90"",
            fallbackUrl: ""images/heaven_bus.jpg""
        },
        {
            id: ""slide_3"",
            title: ""은혜의 십자가 사랑"",
            subBadge: ""✨ 내가 너희를 쉬게 하리라"",
            verseBadge: ""📖 마태복음 11:28"",
            verseText: ""“수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라 나는 마음이 온유하고 겸손하니 나의 멍에를 메고 내게 배우라”"",
            imageUrl: ""https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1600&q=90"",
            fallbackUrl: ""images/heaven_bus.jpg""
        }
    ];";

        string newDefaultHeroSlides = @"    const DEFAULT_HERO_SLIDES = [
        {
            id: ""slide_1"",
            title: ""예수님과 동행하는 삶"",
            subBadge: ""✨ 주님이 나의 길이 되십니다"",
            verseBadge: ""📖 요한복음 14:6"",
            verseText: ""“예수께서 이르시되 내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라”"",
            imageUrl: ""images/jesus_walking_path.jpg"",
            fallbackUrl: ""images/heaven_bus_peace.jpg""
        },
        {
            id: ""slide_2"",
            title: ""천국행 평화의 버스"",
            subBadge: ""✨ 평화의 버스 타실 분 다 타세요!"",
            verseBadge: ""📖 시편 23:1-2"",
            verseText: ""“여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다”"",
            imageUrl: ""images/heaven_bus_peace.jpg"",
            fallbackUrl: ""images/heaven_bus_life.jpg""
        },
        {
            id: ""slide_3"",
            title: ""천국행 영원한 생명"",
            subBadge: ""✨ 참된 쉼과 영원한 구원"",
            verseBadge: ""📖 마태복음 11:28"",
            verseText: ""“수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라 나는 마음이 온유하고 겸손하니 나의 멍에를 메고 내게 배우라”"",
            imageUrl: ""images/heaven_bus_life.jpg"",
            fallbackUrl: ""images/jesus_walking_path.jpg""
        }
    ];";

        content = content.Replace(oldDefaultHeroSlides, newDefaultHeroSlides);

        // Update KEY_HERO_SLIDES to v4 to ensure fresh load of new images
        content = content.Replace(
            @"const KEY_HERO_SLIDES = ""yetalk_minichurch_hero_slides_v3"";",
            @"const KEY_HERO_SLIDES = ""yetalk_minichurch_hero_slides_v4"";"
        );

        // 4. Update CSS for chat-pinned-devotion-card and pinned elements
        string oldPinnedCss = @".chat-pinned-devotion-card {
            background: #ffffff;
            border: 1px solid #dbeafe;
            border-radius: 14px;
            margin: 6px 10px 4px 10px;
            padding: 9px 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            flex-shrink: 0;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }
        .pinned-header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            cursor: pointer;
            user-select: none;
        }
        .pinned-tag-title {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 14.5px;
            font-weight: 900;
            color: #0f172a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
            min-width: 0;
        }
        .pinned-tag-badge {
            color: #d97706;
            font-weight: 950;
            font-size: 14.5px;
            flex-shrink: 0;
        }
        .btn-pinned-toggle {
            background: transparent;
            border: none;
            color: #64748b;
            font-size: 13px;
            font-weight: 900;
            cursor: pointer;
            padding: 2px 4px;
            line-height: 1;
        }
        .btn-pinned-manage {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            color: #0284c7;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 900;
            padding: 3px 8px;
            cursor: pointer;
            line-height: 1;
            white-space: nowrap;
        }
        .btn-pinned-manage:active {
            transform: scale(0.95);
            background: #e0f2fe;
        }
        .pinned-body-text {
            font-size: 13.5px;
            line-height: 1.55;
            color: #334155;
            font-weight: 600;
            margin-top: 5px;
            white-space: pre-wrap;
            word-break: keep-all;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }
        .chat-pinned-devotion-card.expanded .pinned-body-text {
            display: block;
            -webkit-line-clamp: unset;
            overflow: visible;
        }
        .pinned-prayer-box {
            display: none;
            margin-top: 6px;
            padding: 7px 9px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.55;
            color: #166534;
            font-weight: 700;
            white-space: pre-wrap;
            word-break: keep-all;
        }
        .chat-pinned-devotion-card.expanded .pinned-prayer-box {
            display: block;
        }
        .pinned-footer-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 6px;
            font-size: 11.5px;
            color: #64748b;
            font-weight: 700;
        }";

        string newPinnedCss = @".chat-pinned-devotion-card {
            background: #ffffff;
            border: 1px solid #dbeafe;
            border-radius: 12px;
            margin: 4px 10px 4px 10px;
            padding: 6px 12px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            flex-shrink: 0;
            box-sizing: border-box;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        .chat-pinned-devotion-card:hover {
            border-color: #93c5fd;
        }
        .pinned-header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            cursor: pointer;
            user-select: none;
        }
        .pinned-tag-title {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 13.5px;
            font-weight: 900;
            color: #0f172a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
            min-width: 0;
        }
        .pinned-tag-badge {
            color: #d97706;
            font-weight: 950;
            font-size: 13.5px;
            flex-shrink: 0;
        }
        .btn-pinned-toggle {
            background: transparent;
            border: none;
            color: #64748b;
            font-size: 12px;
            font-weight: 900;
            cursor: pointer;
            padding: 2px 4px;
            line-height: 1;
        }
        .btn-pinned-manage {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            color: #0284c7;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 900;
            padding: 3px 7px;
            cursor: pointer;
            line-height: 1;
            white-space: nowrap;
        }
        .btn-pinned-manage:active {
            transform: scale(0.95);
            background: #e0f2fe;
        }
        .pinned-body-text {
            font-size: 13px;
            line-height: 1.5;
            color: #334155;
            font-weight: 600;
            margin-top: 3px;
            white-space: pre-wrap;
            word-break: keep-all;
            overflow-wrap: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }
        .chat-pinned-devotion-card.expanded .pinned-body-text {
            display: block;
            -webkit-line-clamp: unset;
            overflow: visible;
            max-height: 380px;
            overflow-y: auto;
        }
        .pinned-prayer-box {
            display: none;
            margin-top: 6px;
            padding: 7px 9px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            font-size: 12.5px;
            line-height: 1.55;
            color: #166534;
            font-weight: 700;
            white-space: pre-wrap;
            word-break: keep-all;
            overflow-wrap: break-word;
        }
        .chat-pinned-devotion-card.expanded .pinned-prayer-box {
            display: block;
        }
        .pinned-footer-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 3px;
            font-size: 11px;
            color: #64748b;
            font-weight: 700;
        }";

        content = content.Replace(oldPinnedCss, newPinnedCss);

        // 5. Update HTML for chat-pinned-devotion-card:
        // - onclick="togglePinnedDevotionExpand(event)"
        // - Remove btnPinnedSendMembers ("📨 회원에게 보내기")
        string oldPinnedHtml = @"                <!-- 🌟 [사용자 요청] 교회앱과 100% 동일한 상단 고정 예수동행 말씀 카드 (복사/수정/삭제/발송 지원) -->
                <div class=""chat-pinned-devotion-card"" id=""chatPinnedDevotion""
                     onclick=""openPinnedDevotionActionModal(event)""
                     oncontextmenu=""event.preventDefault(); openPinnedDevotionActionModal(event);""
                     ontouchstart=""handlePinnedDevotionTouchStart(event)""
                     ontouchend=""handlePinnedDevotionTouchEnd(event)""
                     ontouchmove=""handlePinnedDevotionTouchMove(event)""
                     title=""터치하여 말씀 복사/수정/삭제"">
                    <div class=""pinned-header-row"">
                        <div class=""pinned-tag-title"">
                            <span class=""pinned-tag-badge"">[예수동행]</span>
                            <span id=""pinnedDevotionTitle"">“주 여호와의 영이 내게 내리...”</span>
                        </div>
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <button type=""button"" class=""btn-pinned-manage"" onclick=""openPinnedDevotionActionModal(event)"" title=""말씀 관리 (복사/수정/삭제)"">⋮ 관리</button>
                            <button type=""button"" class=""btn-pinned-toggle"" id=""btnPinnedToggle"" onclick=""togglePinnedDevotionExpand(event)"" title=""접기/펼치기"">▼</button>
                        </div>
                    </div>
                    <div class=""pinned-body-text"" id=""pinnedBodyText"">
                        성도 여러분, 오늘도 주님과 손잡고 걸어가는 복된 하루 되시기를 축복합니다. 마음의 무거운 짐을...
                    </div>
                    <div class=""pinned-prayer-box"" id=""pinnedPrayerText""></div>
                    <div class=""pinned-footer-row"" onclick=""event.stopPropagation()"">
                        <span class=""pinned-stat"" onclick=""likePinnedDevotion()"" style=""cursor:pointer;"" title=""은혜 아멘"">❤️ <span id=""pinnedHeartCount"">18</span></span>
                        <span class=""pinned-stat"">👀 <span id=""pinnedViewCount"">28</span></span>
                        <span class=""pinned-author"">· <span id=""pinnedAuthorName"">최예톡의 작은교회</span></span>
                        <span class=""pinned-date"">· <span id=""pinnedDateStr"">2026-10-29</span></span>
                        <button type=""button"" class=""btn-pinned-send-members"" id=""btnPinnedSendMembers"" onclick=""sendDevotionToMembersDirect(event)"" title=""성도 개인앱 공지로 발송"">
                            📨 회원에게 보내기
                        </button>
                    </div>
                </div>";

        string newPinnedHtml = @"                <!-- 🌟 [사용자 요청] 슬림형 예수동행 말씀 카드 (터치시 본문 전체 펼침 / 길게누르면 관리창) -->
                <div class=""chat-pinned-devotion-card"" id=""chatPinnedDevotion""
                     onclick=""togglePinnedDevotionExpand(event)""
                     oncontextmenu=""event.preventDefault(); openPinnedDevotionActionModal(event);""
                     ontouchstart=""handlePinnedDevotionTouchStart(event)""
                     ontouchend=""handlePinnedDevotionTouchEnd(event)""
                     ontouchmove=""handlePinnedDevotionTouchMove(event)""
                     title=""터치: 본문 전체보기 / 길게누름: 복사·수정·삭제"">
                    <div class=""pinned-header-row"">
                        <div class=""pinned-tag-title"">
                            <span class=""pinned-tag-badge"">[예수동행]</span>
                            <span id=""pinnedDevotionTitle"">“주 여호와의 영이 내게 내리...”</span>
                        </div>
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <button type=""button"" class=""btn-pinned-manage"" onclick=""event.stopPropagation(); openPinnedDevotionActionModal(event)"" title=""말씀 관리 (복사/수정/삭제)"">⋮ 관리</button>
                            <button type=""button"" class=""btn-pinned-toggle"" id=""btnPinnedToggle"" onclick=""togglePinnedDevotionExpand(event)"" title=""접기/펼치기"">▼</button>
                        </div>
                    </div>
                    <div class=""pinned-body-text"" id=""pinnedBodyText"">
                        성도 여러분, 오늘도 주님과 손잡고 걸어가는 복된 하루 되시기를 축복합니다. 마음의 무거운 짐을...
                    </div>
                    <div class=""pinned-prayer-box"" id=""pinnedPrayerText""></div>
                    <div class=""pinned-footer-row"" onclick=""event.stopPropagation()"">
                        <span class=""pinned-stat"" onclick=""likePinnedDevotion()"" style=""cursor:pointer;"" title=""은혜 아멘"">❤️ <span id=""pinnedHeartCount"">18</span></span>
                        <span class=""pinned-stat"">👀 <span id=""pinnedViewCount"">28</span></span>
                        <span class=""pinned-author"">· <span id=""pinnedAuthorName"">최예톡의 작은교회</span></span>
                        <span class=""pinned-date"">· <span id=""pinnedDateStr"">2026-10-29</span></span>
                    </div>
                </div>";

        content = content.Replace(oldPinnedHtml, newPinnedHtml);

        // 6. Update bottom dock:
        // - Replace `openQuickBlessingsModal()` with `openChatNewPostModal()`
        // - Remove `chatBroadcastRow`
        string oldDockHtml = @"                <div class=""chat-fixed-dock-bottom"">
                    <div style=""display:flex; align-items:center; gap:6px; width:100%;"">
                        <button type=""button"" class=""btn-chat-plus"" onclick=""openQuickBlessingsModal()"">＋</button>
                        <textarea id=""inpChatText"" class=""inp-chat-message-field"" rows=""1"" placeholder=""은혜 나눔을 남겨주세요..."" onkeydown=""handleChatInputKeyDown(event)"" oninput=""autoGrowTextarea(this)""></textarea>
                        <button type=""button"" class=""btn-chat-send-yellow"" onclick=""sendChatMessage()"">전송</button>
                    </div>
                    <!-- 🌟 [사용자 요청] 기본은 개인앱에 발송 안 됨 (공지 폭탄 방지), 누를 때만 발송 -->
                    <div class=""chat-dock-subbar"" id=""chatBroadcastRow"">
                        <label class=""chat-dock-broadcast-toggle"">
                            <input type=""checkbox"" id=""chkSendToMembersNotice"">
                            <span>📨 회원에게 알림 발송 (기본: 해제)</span>
                        </label>
                    </div>
                </div>";

        string newDockHtml = @"                <div class=""chat-fixed-dock-bottom"">
                    <div style=""display:flex; align-items:center; gap:6px; width:100%;"">
                        <button type=""button"" class=""btn-chat-plus"" onclick=""openChatNewPostModal()"" title=""새글 나눔 & 사진 등록"">＋</button>
                        <textarea id=""inpChatText"" class=""inp-chat-message-field"" rows=""1"" placeholder=""은혜 나눔을 남겨주세요..."" onkeydown=""handleChatInputKeyDown(event)"" oninput=""autoGrowTextarea(this)""></textarea>
                        <button type=""button"" class=""btn-chat-send-yellow"" onclick=""sendChatMessage()"">전송</button>
                    </div>
                </div>";

        content = content.Replace(oldDockHtml, newDockHtml);

        // 7. Update chat-bubble-main CSS to ensure word-break: keep-all and pre-wrap
        string oldBubbleCss = @"        .chat-bubble-main {
            padding: 8px 12px;
            border-radius: 14px;
            font-size: 15px;
            line-height: 1.45;
            letter-spacing: -0.2px;
            white-space: pre-wrap;
            word-break: break-word;
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
            max-width: 100%;
            user-select: text;
            -webkit-user-select: text;
            cursor: pointer;
        }";

        string newBubbleCss = @"        .chat-bubble-main {
            padding: 9px 13px;
            border-radius: 14px;
            font-size: 15px;
            line-height: 1.6;
            letter-spacing: -0.2px;
            white-space: pre-wrap;
            word-break: keep-all;
            overflow-wrap: break-word;
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
            max-width: 100%;
            user-select: text;
            -webkit-user-select: text;
            cursor: pointer;
        }";

        content = content.Replace(oldBubbleCss, newBubbleCss);

        // 8. Replace modalQuickBlessings with modalChatNewPost
        string oldQuickBlessingsModal = @"<div class=""modal-overlay"" id=""modalQuickBlessings"" onclick=""closeModal('modalQuickBlessings')"">
    <div class=""modal-card"" onclick=""event.stopPropagation()"">
        <div class=""modal-header"">
            <strong class=""modal-title"">✨ 은혜의 말씀과 축복 문구</strong>
            <button type=""button"" class=""btn-modal-close"" onclick=""closeModal('modalQuickBlessings')"">✕</button>
        </div>
        <div class=""modal-body"" style=""gap:6px;"">
            <button type=""button"" class=""btn-m-cancel"" style=""text-align:left; background:#f8fafc; border:1px solid #cbd5e1; padding:9px 12px;"" onclick=""insertQuickChat('샬롬! 주님의 이름으로 축복하고 사랑합니다. 🌿')"">
                🌿 샬롬! 주님의 이름으로 축복하고 사랑합니다. 🌿
            </button>
            <button type=""button"" class=""btn-m-cancel"" style=""text-align:left; background:#f8fafc; border:1px solid #cbd5e1; padding:9px 12px;"" onclick=""insertQuickChat('오늘도 주님 안에서 참된 평안과 승리 누리세요! 🕊️')"">
                🕊️ 오늘도 주님 안에서 참된 평안과 승리 누리세요! 🕊️
            </button>
            <button type=""button"" class=""btn-m-cancel"" style=""text-align:left; background:#f8fafc; border:1px solid #cbd5e1; padding:9px 12px;"" onclick=""insertQuickChat('목사님 귀한 말씀 감사합니다. 오늘도 주님 손잡고 승리하겠습니다!')"">
                🙏 목사님 귀한 말씀 감사합니다. 승리하겠습니다!
            </button>
        </div>
    </div>
</div>";

        string newChatPostModal = @"<!-- 🌟 [사용자 요청] 새글 쓰기 모달 (글 쓰는 공간 대폭 확대 & 사진/그림 첨부 기능) -->
<div class=""modal-overlay"" id=""modalChatNewPost"" onclick=""closeModal('modalChatNewPost')"">
    <div class=""modal-card"" onclick=""event.stopPropagation()"" style=""max-width:440px; width:92%;"">
        <div class=""modal-header"">
            <strong class=""modal-title"">✍️ 예수동행 새글 나눔 & 사진 등록</strong>
            <button type=""button"" class=""btn-modal-close"" onclick=""closeModal('modalChatNewPost')"">✕</button>
        </div>
        <div class=""modal-body"" style=""gap:12px;"">
            <div style=""display:flex; align-items:center; gap:8px;"">
                <label style=""font-size:13.5px; font-weight:800; color:#334155; white-space:nowrap;"">작성자</label>
                <input type=""text"" id=""inpNewPostAuthor"" class=""m-input"" style=""flex:1; padding:8px 12px; font-size:14px; font-weight:700; border:1.5px solid #cbd5e1; border-radius:8px;"" placeholder=""작성자 이름"">
            </div>
            <div>
                <label style=""display:block; font-size:13.5px; font-weight:800; color:#334155; margin-bottom:6px;"">나눔 글 내용</label>
                <textarea id=""inpNewPostText"" rows=""6"" style=""width:100%; box-sizing:border-box; padding:12px; font-size:15px; line-height:1.6; border:1.5px solid #94a3b8; border-radius:10px; white-space:pre-wrap; word-break:keep-all; font-family:inherit; resize:vertical; outline:none; min-height:140px;"" placeholder=""주님 안에서 은혜로운 간증, 일상 나눔, 기도제목을 자유롭게 적어보세요... (줄바꿈과 띄어쓰기가 온전히 유지됩니다)""></textarea>
            </div>
            <div>
                <input type=""file"" id=""inpNewPostFile"" accept=""image/*"" style=""display:none;"" onchange=""handleNewPostPhotoSelected(event)"">
                <button type=""button"" style=""display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:11px; background:#f8fafc; border:1.5px dashed #0284c7; border-radius:10px; color:#0369a1; font-size:14px; font-weight:800; cursor:pointer;"" onclick=""document.getElementById('inpNewPostFile').click()"">
                    📷 그림 / 사진 첨부하기
                </button>
                <div id=""newPostPhotoPreviewWrap"" style=""display:none; position:relative; margin-top:8px;"">
                    <img id=""imgNewPostPreview"" src="""" alt=""첨부 사진 미리보기"" style=""width:100%; max-height:220px; object-fit:contain; border-radius:8px; border:1px solid #cbd5e1; background:#0f172a;"">
                    <button type=""button"" onclick=""clearNewPostPhoto()"" style=""position:absolute; top:6px; right:6px; background:rgba(0,0,0,0.7); color:#fff; border:none; border-radius:50%; width:28px; height:28px; font-weight:900; cursor:pointer;"">✕</button>
                </div>
            </div>
        </div>
        <div class=""modal-footer"" style=""display:flex; gap:8px;"">
            <button type=""button"" class=""btn-m-cancel"" onclick=""closeModal('modalChatNewPost')"" style=""flex:1; padding:11px; font-weight:800;"">취소</button>
            <button type=""button"" class=""btn-m-confirm"" onclick=""submitChatNewPost()"" style=""flex:2; background:#2563eb; color:#fff; font-size:15px; font-weight:900; padding:11px; border-radius:10px;"">💾 나눔글 올리기</button>
        </div>
    </div>
</div>";

        content = content.Replace(oldQuickBlessingsModal, newChatPostModal);

        // 9. Update JavaScript functions:
        // - pinnedDevTouchTimer & togglePinnedDevotionExpand
        // - chatMsgTouch handling
        // - openChatNewPostModal, handleNewPostPhotoSelected, clearNewPostPhoto, submitChatNewPost
        // - openQuickBlessingsModal alias

        string oldTouchJs = @"    let pinnedDevTouchTimer = null;
    let pinnedDevTouchMoved = false;

    function handlePinnedDevotionTouchStart(e) {
        pinnedDevTouchMoved = false;
        clearTimeout(pinnedDevTouchTimer);
        pinnedDevTouchTimer = setTimeout(() => {
            if (!pinnedDevTouchMoved) {
                openPinnedDevotionActionModal(e);
            }
        }, 450);
    }
    function handlePinnedDevotionTouchMove(e) {
        pinnedDevTouchMoved = true;
        clearTimeout(pinnedDevTouchTimer);
    }
    function handlePinnedDevotionTouchEnd(e) {
        clearTimeout(pinnedDevTouchTimer);
    }

    function togglePinnedDevotionExpand(e) {
        if (e) {
            if (typeof e.stopPropagation === ""function"") e.stopPropagation();
        }
        const card = document.getElementById(""chatPinnedDevotion"");
        const btn = document.getElementById(""btnPinnedToggle"");
        if (!card) return;
        const isExp = card.classList.toggle(""expanded"");
        if (btn) btn.innerText = isExp ? ""▲"" : ""▼"";
    }";

        string newTouchJs = @"    let pinnedDevTouchTimer = null;
    let pinnedDevTouchMoved = false;
    let pinnedDevLongPressed = false;

    function handlePinnedDevotionTouchStart(e) {
        pinnedDevTouchMoved = false;
        pinnedDevLongPressed = false;
        clearTimeout(pinnedDevTouchTimer);
        pinnedDevTouchTimer = setTimeout(() => {
            if (!pinnedDevTouchMoved) {
                pinnedDevLongPressed = true;
                openPinnedDevotionActionModal(e);
            }
        }, 450);
    }
    function handlePinnedDevotionTouchMove(e) {
        pinnedDevTouchMoved = true;
        clearTimeout(pinnedDevTouchTimer);
    }
    function handlePinnedDevotionTouchEnd(e) {
        clearTimeout(pinnedDevTouchTimer);
    }

    /* 🌟 [사용자 요청] 상단 박스 클릭 시 본문 전체 펼쳐보기 토글 */
    function togglePinnedDevotionExpand(e) {
        if (pinnedDevLongPressed) {
            pinnedDevLongPressed = false;
            return;
        }
        if (e && typeof e.stopPropagation === ""function"") e.stopPropagation();
        const card = document.getElementById(""chatPinnedDevotion"");
        const btn = document.getElementById(""btnPinnedToggle"");
        if (!card) return;
        const isExp = card.classList.toggle(""expanded"");
        if (btn) btn.innerText = isExp ? ""▲"" : ""▼"";
    }";

        content = content.Replace(oldTouchJs, newTouchJs);

        // Update chatMsgTouch logic
        string oldChatMsgTouchJs = @"    let chatMsgTouchTimer = null;
    let chatMsgTouchMoved = false;

    function handleChatMsgTouchStart(e, id) {
        chatMsgTouchMoved = false;
        clearTimeout(chatMsgTouchTimer);
        chatMsgTouchTimer = setTimeout(() => {
            if (!chatMsgTouchMoved) {
                openChatMsgActionModal(id);
            }
        }, 450);
    }

    function handleChatMsgTouchMove(e) {
        chatMsgTouchMoved = true;
        clearTimeout(chatMsgTouchTimer);
    }

    function handleChatMsgTouchEnd(e) {
        clearTimeout(chatMsgTouchTimer);
    }";

        string newChatMsgTouchJs = @"    let chatMsgTouchTimer = null;
    let chatMsgTouchMoved = false;
    let chatMsgLongPressed = false;

    /* 🌟 [사용자 요청] 글자를 길게 누르면 복사, 수정, 삭제 창 팝업 */
    function handleChatMsgTouchStart(e, id) {
        chatMsgTouchMoved = false;
        chatMsgLongPressed = false;
        clearTimeout(chatMsgTouchTimer);
        chatMsgTouchTimer = setTimeout(() => {
            if (!chatMsgTouchMoved) {
                chatMsgLongPressed = true;
                openChatMsgActionModal(id);
            }
        }, 450);
    }

    function handleChatMsgTouchMove(e) {
        chatMsgTouchMoved = true;
        clearTimeout(chatMsgTouchTimer);
    }

    function handleChatMsgTouchEnd(e) {
        clearTimeout(chatMsgTouchTimer);
    }";

        content = content.Replace(oldChatMsgTouchJs, newChatMsgTouchJs);

        // Replace quick blessing functions with new post functions
        string oldQuickBlessingsJs = @"    function openQuickBlessingsModal() { openModal(""modalQuickBlessings""); }

    function insertQuickChat(phrase) {
        const inp = document.getElementById(""inpChatText"");
        if (inp) {
            inp.value = phrase;
            autoGrowTextarea(inp);
        }
        closeModal(""modalQuickBlessings"");
        sendChatMessage();
    }";

        string newPostJs = @"    /* 🌟 [사용자 요청] 새글 쓰기 창 (글 쓰는 공간 늘리고 사진/그림 첨부 기능) */
    let newPostPhotoData = """";

    function openChatNewPostModal() {
        const authorInp = document.getElementById(""inpNewPostAuthor"");
        if (authorInp) {
            authorInp.value = localStorage.getItem(""yetalkUserName"") || ""최예톡"";
        }
        const textInp = document.getElementById(""inpNewPostText"");
        if (textInp) textInp.value = """";
        clearNewPostPhoto();
        openModal(""modalChatNewPost"");
    }

    function openQuickBlessingsModal() {
        openChatNewPostModal();
    }

    function handleNewPostPhotoSelected(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            newPostPhotoData = evt.target.result;
            const wrap = document.getElementById(""newPostPhotoPreviewWrap"");
            const img = document.getElementById(""imgNewPostPreview"");
            if (img) img.src = newPostPhotoData;
            if (wrap) wrap.style.display = ""block"";
        };
        reader.readAsDataURL(file);
    }

    function clearNewPostPhoto() {
        newPostPhotoData = """";
        const fileInp = document.getElementById(""inpNewPostFile"");
        if (fileInp) fileInp.value = """";
        const wrap = document.getElementById(""newPostPhotoPreviewWrap"");
        if (wrap) wrap.style.display = ""none"";
        const img = document.getElementById(""imgNewPostPreview"");
        if (img) img.src = """";
    }

    function submitChatNewPost() {
        const author = (document.getElementById(""inpNewPostAuthor"")?.value || """").trim() || ""최예톡"";
        const text = (document.getElementById(""inpNewPostText"")?.value || """").trim();
        if (!text && !newPostPhotoData) {
            showToast(""글 내용이나 사진을 등록해주세요."");
            return;
        }

        let chats = DEFAULT_CHAT_SEED;
        try {
            const raw = localStorage.getItem(KEY_CHAT_MSGS);
            if (raw) chats = JSON.parse(raw);
        } catch(e){}

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        chats.push({
            id: Date.now(),
            author: author,
            isMe: true,
            text: text,
            time: timeStr,
            img: newPostPhotoData || """"
        });

        localStorage.setItem(KEY_CHAT_MSGS, JSON.stringify(chats));
        closeModal(""modalChatNewPost"");
        initChatMessages(true);
        showToast(""✨ 은혜로운 새글이 등록되었습니다!"");
    }";

        content = content.Replace(oldQuickBlessingsJs, newPostJs);

        File.WriteAllText(filePath, content, Encoding.UTF8);
        Console.WriteLine("Successfully updated " + filePath);

        // Sync to docs and app/src/main/assets
        File.Copy(filePath, @"docs\minichurch.html", true);
        Console.WriteLine("Synced to docs\\minichurch.html");

        File.Copy(filePath, @"app\src\main\assets\minichurch.html", true);
        Console.WriteLine("Synced to app\\src\\main\\assets\\minichurch.html");
    }
}
