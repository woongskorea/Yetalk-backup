/*==================================================
YETALK CHURCH COMMON BOTTOM NAV BAR (church_bottom_bar.js)
- 최상단 헤더 우측 예톡TV 버튼 자동 제거/숨김
- 바닥 애드몹 및 중복 헌금 버튼 원천 차단
- 5대 고정 탭 (복음 / 약도 / 헌금 / 예톡TV / 쿠팡) 자동 주입
- 🌟 쿠팡 클릭 시 2초 위트 애드몹 카운트다운 게이트 (천국 쿠팡)
==================================================*/

(function() {
    // 1. 공통 CSS 주입
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        /* 최상단 헤더의 예톡TV 버튼 제거 */
        .btn-header-tv,
        .header-tv-btn,
        .tv-header-btn,
        [id*="headerTv"],
        [class*="header-tv"],
        a[href*="church_tv"]:not(.church-common-nav-btn),
        button[onclick*="church_tv"]:not(.church-common-nav-btn) {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* 기존 중복 플로팅 버튼 숨김 */
        .online-offering-floating-btn {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            visibility: hidden !important;
        }

        body {
            padding-bottom: calc(160px + env(safe-area-inset-bottom, 0px)) !important;
        }

        /* 🌟 5대 메뉴 + 100 애드몹 고정 일체형 바 */
        .church-common-fixed-wrapper {
            position: fixed !important;
            bottom: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 100% !important;
            max-width: 480px !important;
            display: flex !important;
            flex-direction: column !important;
            z-index: 999999 !important;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.7) !important;
            margin: 0 !important;
        }

        /* 5대 하단 고정 바 */
        .church-common-bottom-nav {
            width: 100% !important;
            height: 54px !important;
            background: #0f172a !important;
            border-top: 1.5px solid #1e293b !important;
            display: grid !important;
            grid-template-columns: repeat(5, 1fr) !important;
            align-items: center !important;
            margin: 0 !important;
        }

        /* 100 대형 애드몹 푸터 */
        .church-common-admob-footer {
            width: 100% !important;
            height: 100px !important;
            background: #000000 !important;
            border-top: 1.5px solid #1e293b !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 2px !important;
            padding-bottom: env(safe-area-inset-bottom, 0px) !important;
        }
        .church-common-admob-title {
            font-size: 13.5px !important;
            font-weight: 950 !important;
            color: #38bdf8 !important;
            letter-spacing: 0.5px !important;
        }
        .church-common-admob-desc {
            font-size: 11px !important;
            font-weight: 850 !important;
            color: #facc15 !important;
        }

        .church-common-nav-btn {
            background: none !important;
            border: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 3px !important;
            height: 100% !important;
            cursor: pointer !important;
            text-decoration: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        .church-common-nav-btn:active {
            transform: scale(0.92) !important;
            background: rgba(255, 255, 255, 0.06) !important;
        }
        .church-common-nav-icon {
            font-size: 18px !important;
            line-height: 1 !important;
        }
        .church-common-nav-label {
            font-size: 11px !important;
            font-weight: 850 !important;
            color: #e2e8f0 !important;
            letter-spacing: -0.3px !important;
            white-space: nowrap !important;
        }
        .church-common-nav-btn.nav-offering .church-common-nav-label {
            color: #facc15 !important;
        }
        .church-common-nav-btn.nav-coupang .church-common-nav-label {
            color: #f87171 !important;
        }

        /* 🌟 쿠팡 2초 애드몹 카운트다운 모달 스타일 */
        .coupang-gate-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.88);
            z-index: 1000000;
            align-items: center;
            justify-content: center;
            padding: 14px;
            backdrop-filter: blur(5px);
        }
        .coupang-gate-overlay.show {
            display: flex;
        }
        .coupang-gate-card {
            width: 100%;
            max-width: 360px;
            background: #0c1220;
            border: 2px solid #f43f5e;
            border-radius: 20px;
            padding: 22px 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.95);
            color: #ffffff;
        }
        .coupang-timer-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #e11d48;
            color: #ffffff;
            font-size: 22px;
            font-weight: 950;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #fecdd3;
            box-shadow: 0 0 16px rgba(225, 29, 72, 0.6);
        }
        .coupang-gate-title {
            font-size: 15px;
            font-weight: 950;
            color: #fde047;
            line-height: 1.4;
        }
        .coupang-admob-slot {
            width: 100%;
            height: 160px;
            background: #131d31;
            border: 1.5px dashed #facc15;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            margin: 2px 0;
        }
    `;
    document.head.appendChild(styleEl);

    // 2. DOM 초기화 (하단 바 및 쿠팡 게이트 모달 동적 주입)
    function initChurchNav() {
        // 상단 헤더 예톡TV 텍스트 버튼 정리
        document.querySelectorAll('header button, header a, .header button, .header a').forEach(el => {
            if (el.textContent.includes('예톡TV')) {
                el.remove();
            }
        });

        // 하단 네비게이션 및 100 애드몹 일체형 고정 바 생성
        if (!document.getElementById('churchCommonFixedWrapper')) {
            const wrap = document.createElement('div');
            wrap.className = 'church-common-fixed-wrapper';
            wrap.id = 'churchCommonFixedWrapper';

            wrap.innerHTML = `
                <nav class="church-common-bottom-nav" id="churchCommonBottomNav">
                    <button type="button" class="church-common-nav-btn" onclick="handleChurchGlobalNav('tv')">
                        <span class="church-common-nav-icon">📺</span>
                        <span class="church-common-nav-label">예톡TV</span>
                    </button>
                    <button type="button" class="church-common-nav-btn" onclick="handleChurchGlobalNav('gospel')">
                        <span class="church-common-nav-icon">📖</span>
                        <span class="church-common-nav-label">복음</span>
                    </button>
                    <button type="button" class="church-common-nav-btn" onclick="handleChurchGlobalNav('map')">
                        <span class="church-common-nav-icon">📍</span>
                        <span class="church-common-nav-label">약도</span>
                    </button>
                    <button type="button" class="church-common-nav-btn nav-offering" onclick="handleChurchGlobalNav('offering')">
                        <span class="church-common-nav-icon">💳</span>
                        <span class="church-common-nav-label">헌금</span>
                    </button>
                    <button type="button" class="church-common-nav-btn nav-coupang" onclick="handleChurchGlobalNav('coupang')">
                        <span class="church-common-nav-icon">🛒</span>
                        <span class="church-common-nav-label">쿠팡</span>
                    </button>
                </nav>
                <footer class="church-common-admob-footer">
                    <div style="width:100%; height:16px; background:#050914; border-bottom:1px solid #1e293b; display:flex; align-items:center; justify-content:center;">
                        <span style="font-size:9.5px; color:#38bdf8; font-weight:900; letter-spacing:0.5px;">AD · 구글 애드몹 공식 스폰서</span>
                    </div>
                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;">
                        <span class="church-common-admob-title">Google AdMob (300x100 / Large Banner)</span>
                        <span class="church-common-admob-desc">선교 사역 및 미디어 영상 방송 공식 후원 슬롯</span>
                    </div>
                </footer>
            `;
            document.body.appendChild(wrap);
        }

        // 쿠팡 2초 애드몹 카운트다운 모달 생성
        if (!document.getElementById('coupangGateModal')) {
            const modal = document.createElement('div');
            modal.className = 'coupang-gate-overlay';
            modal.id = 'coupangGateModal';

            modal.innerHTML = `
                <div class="coupang-gate-card">
                    <div class="coupang-timer-circle" id="coupangTimerNum">2</div>
                    <div>
                        <strong style="color:#ffffff; font-size:16px; display:block; margin-bottom:2px;">쿠팡으로 안전하게 이동합니다</strong>
                        <div class="coupang-gate-title" id="coupangGateMsg">✨ 천국에도 쿠팡이 있을까? (2)</div>
                    </div>

                    <!-- AdMob 스폰서 슬롯 (300x250 대응) -->
                    <div class="coupang-admob-slot">
                        <span style="font-size:26px;">🎁</span>
                        <strong style="font-size:14px; color:#facc15;">Google AdMob Sponsor</strong>
                        <span style="font-size:10px; color:#94a3b8;">교회 미디어 사역 공식 스폰서 슬롯</span>
                    </div>

                    <span style="font-size:10.5px; color:#94a3b8;">잠시 후 쿠팡이 열립니다...</span>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    // 🌟 쿠팡 2초 애드몹 카운트다운 실행 함수
    let coupangCountdownTimer = null;
    function runCoupangGateCountdown() {
        const modal = document.getElementById('coupangGateModal');
        const timerNum = document.getElementById('coupangTimerNum');
        const gateMsg = document.getElementById('coupangGateMsg');

        if (!modal || !timerNum || !gateMsg) {
            proceedToCoupangDirect();
            return;
        }

        // 2초 초기화
        timerNum.innerText = "2";
        gateMsg.innerText = "✨ 천국에도 쿠팡이 있을까? (2)";
        modal.classList.add('show');

        let remain = 2;
        if (coupangCountdownTimer) clearInterval(coupangCountdownTimer);

        coupangCountdownTimer = setInterval(() => {
            remain--;
            if (remain === 1) {
                // 1초 전환
                timerNum.innerText = "1";
                gateMsg.innerText = "🛒 행복한 천국 쇼핑하세요 (1)";
            } else if (remain <= 0) {
                // 완료 후 즉시 쿠팡 실행
                clearInterval(coupangCountdownTimer);
                modal.classList.remove('show');
                proceedToCoupangDirect();
            }
        }, 1000);
    }

    // 실제 쿠팡 연결 (앱 우선 실행 및 웹 폴백)
    function proceedToCoupangDirect() {
        const fallbackUrl = "https://www.coupang.com";
        const isAndroid = /Android/i.test(navigator.userAgent);

        if (isAndroid) {
            window.location.href = "intent://#Intent;scheme=coupang;package=com.coupang.mobile;end;";
            setTimeout(() => {
                window.location.href = fallbackUrl;
            }, 1200);
        } else {
            window.open(fallbackUrl, "_blank");
        }
    }

    // 하단 5대 메뉴 클릭 이벤트 핸들러
    window.handleChurchGlobalNav = function(type) {
        switch(type) {
            case 'gospel':
                if (typeof openGospelModal === 'function') openGospelModal();
                else window.location.href = "church_gospel.html";
                break;
            case 'map':
                if (typeof openMapModal === 'function') openMapModal();
                else window.location.href = "church_map.html";
                break;
            case 'offering':
                const offeringModal = document.getElementById('offeringModal') || document.getElementById('churchOfferingModal');
                if (offeringModal) {
                    offeringModal.classList.add('show');
                } else if (typeof openChurchOfferingModal === 'function') {
                    openChurchOfferingModal();
                } else if (typeof openOfferingModal === 'function') {
                    openOfferingModal();
                } else {
                    window.location.href = "church_offering.html";
                }
                break;
            case 'tv':
                window.location.href = "index.html";
                break;
            case 'coupang':
                // 🌟 하얀 화면 대기 없이 2초 애드몹 카운트다운 모달 실행
                runCoupangGateCountdown();
                break;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChurchNav);
    } else {
        initChurchNav();
    }
})();