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

        // 1. Add CSS for 10-channel subchannels bar in minichurch.html
        string channelCss = @"
        /* 🌟 [사용자 요청] 예톡TV 10개 채널 바 (2줄: 5개+5개) 작은교회 내부 직접 재생 */
        .minichurch-tv-10channels-wrap {
            background: #ffffff;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 6px 8px;
            margin: 6px 0 8px 0;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            display: flex;
            flex-direction: column;
            gap: 4px;
            box-sizing: border-box;
            width: 100%;
        }
        .mc-subchannels-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;
            width: 100%;
        }
        .mc-subchannel-pill {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 5px 2px;
            font-size: 13px;
            font-weight: 900;
            cursor: pointer;
            flex: 1 1 0;
            min-width: 0;
            text-align: center;
            transition: all 0.15s ease;
            white-space: nowrap;
        }
        .mc-subchannel-pill:active { transform: scale(0.92); }
        .mc-subchannel-pill.active {
            background: #0f172a !important;
            color: #ffffff !important;
            border-color: #0f172a !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }
        .mc-subchannel-pill.pill-praise { color: #e11d48; }
        .mc-subchannel-pill.pill-freedom { color: #0284c7; }
        .mc-subchannel-pill.pill-word { color: #15803d; }
        .mc-subchannel-pill.pill-testimony { color: #7c3aed; }
        .mc-subchannel-pill.pill-heaven { color: #d97706; }
        .mc-subchannel-pill.pill-pray { color: #2563eb; }
        .mc-subchannel-pill.pill-repent { color: #dc2626; }
        .mc-subchannel-pill.pill-ourchurch { color: #0f172a; font-weight: 950; }
        .mc-subchannel-pill.pill-bible { color: #0891b2; }
        .mc-subchannel-pill.pill-patriot { color: #4338ca; }

        /* 🌟 가로 2줄 세로로 계속 연결되어 무제한 저장되는 등록 영상 그리드 */
        .worship-video-2col-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }
        ";

        content = content.Replace(
            @"        .worship-first-page-fullscreen {",
            channelCss + @"        .worship-first-page-fullscreen {"
        );

        // 2. Add 10 channel bar into worshipContentView right before worship-first-page-fullscreen
        string tenChannelsHtml = @"
                <!-- 🌟 [사용자 요청] 예톡TV 10대 메뉴 (찬양, 자유, 말씀TV, 간증, 천국 / 기도, 회개, 우리교회, 성경, 애국) - 외부 유튜브 이동 없이 내부 직접 재생 -->
                <div class=""minichurch-tv-10channels-wrap"">
                    <div class=""mc-subchannels-row"">
                        <button type=""button"" class=""mc-subchannel-pill pill-praise active"" id=""mcChBtn_praise"" onclick=""selectMiniChurchTvChannel('찬양')"">찬양</button>
                        <button type=""button"" class=""mc-subchannel-pill pill-freedom"" id=""mcChBtn_freedom"" onclick=""selectMiniChurchTvChannel('자유')"">자유</button>
                        <button type=""button"" class=""mc-subchannel-pill pill-word"" id=""mcChBtn_word"" onclick=""selectMiniChurchTvChannel('말씀TV')"">말씀TV</button>
                        <button type=""button"" class=""mc-subchannel-pill pill-testimony"" id=""mcChBtn_testimony"" onclick=""selectMiniChurchTvChannel('간증')"">간증</button>
                        <button type=""button"" class=""mc-subchannel-pill pill-heaven"" id=""mcChBtn_heaven"" onclick=""selectMiniChurchTvChannel('천국')"">천국</button>
                    </div>
                    <div class=""mc-subchannels-row"">
                        <button type=""button"" class=""mc-subchannel-pill pill-pray"" id=""mcChBtn_pray"" onclick=""selectMiniChurchTvChannel('기도')"">기도</button>
                        <button type=""button"" class=""mc-subchannel-pill pill-repent"" id=""mcChBtn_repent"" onclick=""selectMiniChurchTvChannel('회개')"">회개</button>
                        <button type=""button"" class=""mc-subchannel-pill pill-ourchurch"" id=""mcChBtn_ourchurch"" onclick=""selectMiniChurchTvChannel('우리교회')"">우리교회</button>
                        <button type=""button"" class=""mc-subchannel-pill pill-bible"" id=""mcChBtn_bible"" onclick=""selectMiniChurchTvChannel('성경')"">성경</button>
                        <button type=""button"" class=""mc-subchannel-pill pill-patriot"" id=""mcChBtn_patriot"" onclick=""selectMiniChurchTvChannel('애국')"">애국</button>
                    </div>
                </div>";

        string targetWorshipViewStart = @"                <div class=""worship-fullscreen-top-bar"">
                    <button type=""button"" class=""btn-worship-top-back"" onclick=""closeWorshipContentView()"">
                        <span>‹ 뒤로가기</span>
                    </button>
                    <strong style=""font-size:13.5px; color:#fde047; font-weight:900;"">📺 예배 & 찬양 영상</strong>
                    <button type=""button"" class=""btn-worship-shorts-pill"" id=""btnToggleShorts"" onclick=""toggleWorshipShortsMode()"">
                        📱 쇼츠/롱폼
                    </button>
                </div>";

        content = content.Replace(targetWorshipViewStart, targetWorshipViewStart + tenChannelsHtml);

        // 3. Make video upload / URL button visible ONLY to owner / admin (주인장 전용)
        content = content.Replace(
            @"<button type=""button"" class=""btn-worship-tool primary"" onclick=""openAddVideoModal()"" title=""유튜브 영상 주소 등록 및 수정"">
                            📹 영상주소
                        </button>",
            @"<button type=""button"" class=""btn-worship-tool primary"" id=""btnWorshipEditUrl"" onclick=""openAddVideoModal()"" title=""유튜브 영상 주소 등록 및 수정 (관리자 전용)"" style=""display:none;"">
                            📹 영상주소
                        </button>"
        );

        // 4. Remove pagination container from worship section to allow continuous 2-col vertical scrolling
        content = content.Replace(
            @"                    <!-- 🌟 [사용자 요청] 1.2.3.4.5. 페이징 컨테이너 -->
                    <div id=""worshipPaginationWrap""></div>",
            @"                    <!-- 가로 두줄 세로 연속 스크롤 목록 -->"
        );

        // 5. Update JavaScript logic:
        // - 10 Channels Data & switcher
        // - Owner check for btnWorshipEditUrl
        // - Continuous 2-column rendering without pagination
        string oldWorshipRenderJs = @"    function renderRegisteredVideosGrid() {
        const grid = document.getElementById(""myRegisteredVideoGrid"");
        if (!grid) return;

        const startIndex = (currentWorshipPage - 1) * WORSHIP_PAGE_SIZE;
        const pageVideos = allWorshipVideos.slice(startIndex, startIndex + WORSHIP_PAGE_SIZE);

        grid.innerHTML = pageVideos.map(v => `
                <div class=""worship-video-card-item"" onclick=""selectRegisteredVideo('${v.id}')"" title=""${escapeHtml(v.title)}"">
                    <div class=""reg-thumb-wrap"">
                        <img src=""https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg"" alt=""${escapeHtml(v.title)}"" onerror=""this.onerror=null; this.src='images/heaven_bus.jpg';"">
                        <span class=""reg-play-icon"">▶</span>
                    </div>
                    <div class=""reg-info-box"">
                        <span class=""reg-date-badge"">📅 ${v.date}</span>
                        <strong class=""reg-title-text"">${escapeHtml(v.title)}</strong>
                    </div>
                </div>
            `).join("""");

        renderWorshipPagination();
    }";

        string newWorshipRenderJs = @"    /* 🌟 [사용자 요청] 예톡TV 10대 채널 데이터 (외부 유튜브 이동 없이 내부 직접 재생) */
    const MINICHURCH_TV_CHANNELS = {
        '찬양': { ytId: '92oktJl3-Fo', title: '감사와 소망이 넘치는 은혜찬양 12곡', desc: '주님 안에서 기쁨과 은혜가 넘치는 은혜의 거룩한 찬양' },
        '자유': { ytId: '5qap5aO4i9A', title: '마음이 평온해지는 평화의 묵상 찬양', desc: '지친 하루의 쉼을 주시는 주님의 따뜻한 위로' },
        '말씀TV': { ytId: 'F4t87Z3aJ9w', title: '오직 예수! 생명의 말씀 성경 강해', desc: '영원한 생명 되신 예수 그리스도의 구원 복음' },
        '간증': { ytId: 'd96WjhS8qZ0', title: '눈물과 감동의 성도 은혜 간증', desc: '삶의 어둠에서 빛으로 건져내신 하나님의 놀라운 은혜' },
        '천국': { ytId: 'kJQP7kiw5Fk', title: '천국 소망과 영원한 본향을 향하여', desc: '눈물과 고통이 없는 아름다운 영원한 천국' },
        '기도': { ytId: '2OEL4P1Rz04', title: '치유와 평안을 위한 간절한 중보기도', desc: '믿음의 기도는 병든 자를 구원하리니 주께서 일으키시리라' },
        '회개': { ytId: 'J---aiyznGQ', title: '영적 승리와 매일 회개의 은혜 기도', desc: '정결한 마음을 주시고 정직한 영을 새롭게 하소서' },
        '우리교회': { ytId: '92oktJl3-Fo', title: '우리 작은교회 거룩한 예배와 찬양', desc: '성도가 하나 되어 영과 진리로 드리는 예배' },
        '성경': { ytId: 'L_LUpnjgPso', title: '창세기부터 요한계시록까지 은혜의 통독', desc: '주의 말씀은 내 발의 등이요 내 길에 빛이니이다' },
        '애국': { ytId: '3JZ_D3ELwOQ', title: '자유대한민국과 교회를 위한 구국기도', desc: '하나님이 보우하사 우리나라 만세! 복음통일의 기적' }
    };

    let activeChannelKey = '찬양';

    function selectMiniChurchTvChannel(ch) {
        activeChannelKey = ch;
        const data = MINICHURCH_TV_CHANNELS[ch] || MINICHURCH_TV_CHANNELS['찬양'];

        // 버튼 활성 스타일 적용
        const btnMap = {
            '찬양': 'mcChBtn_praise', '자유': 'mcChBtn_freedom', '말씀TV': 'mcChBtn_word',
            '간증': 'mcChBtn_testimony', '천국': 'mcChBtn_heaven', '기도': 'mcChBtn_pray',
            '회개': 'mcChBtn_repent', '우리교회': 'mcChBtn_ourchurch', '성경': 'mcChBtn_bible',
            '애국': 'mcChBtn_patriot'
        };
        Object.keys(btnMap).forEach(k => {
            const b = document.getElementById(btnMap[k]);
            if (b) b.classList.toggle('active', k === ch);
        });

        // 플레이어에 즉시 내부 재생 (유튜브 이탈 방지)
        const videoObj = {
            id: 'ch_' + ch,
            ytId: data.ytId,
            title: `[${ch}] ${data.title}`,
            desc: data.desc,
            date: new Date().toISOString().split('T')[0]
        };

        renderWorshipMainVideo(videoObj);

        // 목록에 없으면 추가 후 가로 두줄 세로 연속 그리드 갱신
        if (!allWorshipVideos.some(v => v.ytId === data.ytId)) {
            allWorshipVideos.unshift(videoObj);
            try { localStorage.setItem(KEY_WORSHIP_VIDEOS, JSON.stringify(allWorshipVideos)); } catch(e){}
            renderRegisteredVideosGrid();
        }

        showToast(`📺 [${ch}] 영상이 재생됩니다.`);
    }

    /* 🌟 [사용자 요청] 이전 영상: 밑에 가로 두줄 세로로 계속 연결되어 무제한 저장 & 렌더링 */
    function renderRegisteredVideosGrid() {
        const grid = document.getElementById(""myRegisteredVideoGrid"");
        if (!grid) return;

        grid.innerHTML = allWorshipVideos.map(v => `
            <div class=""worship-video-card-item"" onclick=""selectRegisteredVideo('${v.id}')"" title=""${escapeHtml(v.title)}"">
                <div class=""reg-thumb-wrap"">
                    <img src=""https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg"" alt=""${escapeHtml(v.title)}"" onerror=""this.onerror=null; this.src='images/heaven_bus_peace.jpg';"">
                    <span class=""reg-play-icon"">▶</span>
                </div>
                <div class=""reg-info-box"">
                    <span class=""reg-date-badge"">📅 ${v.date || '최신'}</span>
                    <strong class=""reg-title-text"">${escapeHtml(v.title)}</strong>
                </div>
            </div>
        `).join("""");

        // 주인장/관리자 전용 영상등록 버튼 상태 동기화
        const btnUrl = document.getElementById(""btnWorshipEditUrl"");
        if (btnUrl) {
            btnUrl.style.display = isOwnerMode ? ""inline-flex"" : ""none"";
        }
    }";

        content = content.Replace(oldWorshipRenderJs, newWorshipRenderJs);

        // Update modalAddVideo title to indicate admin only
        content = content.Replace(
            @"<strong class=""modal-title"">📹 새 예배·찬양 영상 올리기</strong>",
            @"<strong class=""modal-title"">📹 작은교회 영상 주소 등록 (관리자 전용)</strong>"
        );

        // Make openAddVideoModal enforce owner check
        content = content.Replace(
            @"    function openAddVideoModal() {
        if (isWorshipLocked) {",
            @"    function openAddVideoModal() {
        if (!isOwnerMode) {
            showToast(""🔒 영상 주소 등록은 작은교회 주인장(관리자) 전용입니다."");
            return;
        }
        if (isWorshipLocked) {"
        );

        File.WriteAllText(filePath, content, Encoding.UTF8);
        Console.WriteLine("Successfully updated " + filePath);

        File.Copy(filePath, @"docs\minichurch.html", true);
        Console.WriteLine("Synced to docs\\minichurch.html");

        File.Copy(filePath, @"app\src\main\assets\minichurch.html", true);
        Console.WriteLine("Synced to app\\src\\main\\assets\\minichurch.html");
    }
}
