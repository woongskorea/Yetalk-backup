/*==================================================
YETALK CHURCH COMMON BOTTOM NAV BAR (church_bottom_bar.js)
- 최상단 헤더 상단 상태표시줄 겹침 방지 (시원한 세이프 에어리어)
- 하단 5대 메뉴 (예톡TV / 복음 / 약도 / 헌금 / 쿠팡) 깔끔한 화이트 박스 테마
- 100 대형 애드몹 푸터 완벽 배치 및 가림/잘림 방지
- 온라인 헌금 간편결제 모달 (22개 은행 + 원클릭 스마트 송금) 자체 내장 (검은 화면 완벽 해결)
- 쿠팡 2초 위트 애드몹 카운트다운 게이트 (천국 쿠팡)
==================================================*/

(function() {
    // 1. 공통 CSS 주입 (상단 겹침 방지 + 화이트 하단바 + 헌금 모달)
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        /* 🌟 모든 서브 페이지 최상단 헤더 겹침 완벽 방지: 상태표시줄 아래로 시원하게 내림 */
        .gospel-header,
        .map-header,
        .admin-top-header,
        header.top-header,
        .church-fixed-header-sub {
            padding-top: max(env(safe-area-inset-top, 0px) + 14px, 26px) !important;
            height: auto !important;
            min-height: 58px !important;
            box-sizing: border-box !important;
        }

        /* 최상단 헤더의 중복 예톡TV 버튼 제거 */
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
            padding-bottom: calc(105px + max(env(safe-area-inset-bottom, 0px), 8px)) !important;
        }

        /* 🌟 5대 메뉴 일체형 고정 바 (하얀색 순백 박스 테마) */
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
            box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.08) !important;
            margin: 0 !important;
        }

        /* 🌟 5대 하단 고정 바 (순백색 전체 박스 테마) */
        .church-common-bottom-nav {
            width: 100% !important;
            height: 52px !important;
            background: #ffffff !important;
            border-top: 1.5px solid #e2e8f0 !important;
            display: grid !important;
            grid-template-columns: repeat(5, 1fr) !important;
            align-items: center !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.04) !important;
        }

        /* 🌟 하단 고정 100px 애드몹 푸터 (구글 정책 완벽 부합 및 안드로이드 소프트키 짤림 방지) */
        .church-common-admob-footer {
            width: 100% !important;
            height: 100px !important;
            min-height: 100px !important;
            padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px) !important;
            background: #050a14 !important;
            border-top: 1px solid #1e293b !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: content-box !important;
            gap: 3px !important;
        }

        /* 🌟 [사용자 요청] 컴퓨터(PC/태블릿) 화면: 구글 정책 준수 및 화면 최적화를 위해 모든 애드몹 일괄 완전 숨김 */
        @media (min-width: 768px) {
            body {
                padding-bottom: 56px !important;
            }
            .church-common-admob-footer,
            .church-fixed-admob-footer,
            .bottom-fixed-admob-footer,
            .fixed-bottom-admob,
            .global-fixed-bottom-admob,
            .coupang-admob-slot,
            .coupang-admob-card,
            .admob-safety-bar,
            .admob-display-slot,
            .detail-admob-banner,
            .infeed-admob-box,
            .grace-admob-250-slot,
            .admob-medium-rectangle-card,
            .admob-mission-guide-box,
            .admob-large-box,
            .admob-250-ending-box,
            .admob-250-card,
            .admob-250-overlay,
            .bottom-fixed-admob-100,
            .admob-safety-wrapper,
            .admob-250-wrapper,
            [class*="admob"],
            [id*="admob"],
            [class*="Admob"],
            [id*="Admob"] {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                min-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
                overflow: hidden !important;
            }
        }

        .church-common-nav-btn {
            background: none !important;
            border: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 2px !important;
            height: 100% !important;
            cursor: pointer !important;
            text-decoration: none !important;
            border-radius: 8px !important;
            margin: 2px 3px !important;
            transition: background 0.15s ease, transform 0.1s ease !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        .church-common-nav-btn:active {
            transform: scale(0.92) !important;
            background: #f1f5f9 !important;
        }
        .church-common-nav-icon {
            font-size: 18px !important;
            line-height: 1 !important;
        }
        .church-common-nav-label {
            font-size: 11px !important;
            font-weight: 850 !important;
            color: #334155 !important; /* 선명하고 품격 있는 다크 그레이 */
            letter-spacing: -0.3px !important;
            white-space: nowrap !important;
        }
        .church-common-nav-btn.active .church-common-nav-label {
            color: #0284c7 !important;
            font-weight: 950 !important;
        }
        .church-common-nav-btn.nav-offering .church-common-nav-label {
            color: #b45309 !important; /* 헌금 골드/오렌지 */
            font-weight: 950 !important;
        }
        .church-common-nav-btn.nav-coupang .church-common-nav-label {
            color: #e11d48 !important; /* 쿠팡 레드 */
            font-weight: 950 !important;
        }

        /* 🌟 공통 헌금 모달 스타일 (검은 화면 완벽 해결) */
        .church-global-modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.88);
            z-index: 1000001;
            align-items: center;
            justify-content: center;
            padding: 14px;
            backdrop-filter: blur(6px);
        }
        .church-global-modal-overlay.open {
            display: flex !important;
        }
        .church-offering-card {
            width: 100%;
            max-width: 400px;
            background: #ffffff;
            border: 2px solid #0284c7;
            border-radius: 18px;
            padding: 18px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-shadow: 0 12px 35px rgba(0,0,0,0.25);
            color: #0f172a;
            box-sizing: border-box;
            max-height: 92vh;
            overflow-y: auto;
        }
        .cg-input {
            width: 100%;
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 8px;
            padding: 8px 10px;
            color: #0f172a;
            font-size: 13.5px;
            font-weight: 700;
            outline: none;
            box-sizing: border-box;
            font-family: inherit;
        }
        .cg-input:focus { border-color: #0284c7; background: #ffffff; }
        .cg-box {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 6px;
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

        /* 전역 토스트 */
        .church-global-toast {
            position: fixed;
            bottom: 75px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: rgba(15, 23, 42, 0.95);
            border: 1.5px solid #38bdf8;
            color: #ffffff;
            padding: 9px 18px;
            border-radius: 20px;
            font-size: 12.5px;
            font-weight: 850;
            z-index: 1000005;
            opacity: 0;
            visibility: hidden;
            transition: all 0.25s ease;
            white-space: nowrap;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5);
        }
        .church-global-toast.show {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
    `;
    document.head.appendChild(styleEl);

    // 2. DOM 초기화 (하단 바 및 헌금 모달, 쿠팡 모달 자동 주입)
    function initChurchNav() {
        const isChatPage = location.pathname.includes('churchpray') || location.pathname.includes('churchmember') || location.pathname.includes('churchjesuswalking');
        if (isChatPage) return;

        // 상단 헤더 예톡TV 텍스트 버튼 정리
        document.querySelectorAll('header button, header a, .header button, .header a').forEach(el => {
            if (el.textContent.includes('예톡TV')) {
                el.remove();
            }
        });

        // 현재 페이지 감지하여 활성 탭 하이라이트
        const isGospel = location.pathname.includes('gospel');
        const isMap = location.pathname.includes('map');

        // 하단 5대 네비게이션 고정 바 생성 (순백색 박스 테마)
        if (!document.getElementById('churchCommonFixedWrapper')) {
            const wrap = document.createElement('div');
            wrap.className = 'church-common-fixed-wrapper';
            wrap.id = 'churchCommonFixedWrapper';

            wrap.innerHTML = `
                <div class="church-common-admob-footer" id="churchCommonAdmobFooter">
                    <span style="font-size:10px; color:#64748b; font-weight:800;">AD • Google AdMob 공식 스폰서 슬롯 (320 × 100)</span>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                        <strong style="color:#38bdf8; font-size:13.5px; font-weight:950;">Google AdMob Large Banner</strong>
                        <span style="color:#94a3b8; font-size:11px; font-weight:700;">한국 교회 및 선교 미디어 공식 지원 스폰서</span>
                    </div>
                </div>
            `;
            document.body.appendChild(wrap);
        }

        // 🌟 온라인 헌금 간편결제 공통 모달 주입 (서브 페이지 검은 화면 방지)
        if (!document.getElementById('churchOfferingModal') && !document.getElementById('churchGlobalOfferingModal')) {
            const offModal = document.createElement('div');
            offModal.className = 'church-global-modal-overlay';
            offModal.id = 'churchGlobalOfferingModal';

            offModal.innerHTML = `
                <div class="church-offering-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #e2e8f0; padding-bottom:8px;">
                        <strong style="color:#0284c7; font-size:16px;">⛪ 온라인 헌금 간편결제</strong>
                        <button type="button" style="background:none; border:none; color:#64748b; font-size:22px; cursor:pointer;" onclick="closeChurchGlobalOfferingModal()">✕</button>
                    </div>

                    <!-- 헌금하시는 분 (출금) -->
                    <div class="cg-box">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:12px; color:#0369a1; font-weight:900;">💼 헌금하시는 분 (출금 정보)</span>
                            <button type="button" style="background:#0284c7; color:white; border:none; border-radius:6px; padding:3px 8px; font-size:11px; font-weight:900; cursor:pointer;" onclick="saveGlobalGiverInfo()">내정보 저장</button>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:6px;">
                            <input type="text" class="cg-input" id="cgbGiverName" placeholder="성함">
                            <select id="cgbGiverBank" class="cg-input">
                                <option value="국민은행">국민은행 (KB)</option>
                                <option value="농협은행">농협은행 (NH)</option>
                                <option value="신한은행">신한은행</option>
                                <option value="우리은행">우리은행</option>
                                <option value="하나은행">하나은행</option>
                                <option value="카카오뱅크">카카오뱅크</option>
                                <option value="토스뱅크">토스뱅크</option>
                                <option value="케이뱅크">케이뱅크</option>
                                <option value="기업은행">IBK기업은행</option>
                                <option value="SC제일은행">SC제일은행</option>
                                <option value="우체국">우체국</option>
                                <option value="새마을금고">새마을금고</option>
                                <option value="신협">신협</option>
                                <option value="수협은행">수협은행</option>
                                <option value="부산은행">부산은행</option>
                                <option value="대구은행">iM뱅크(대구)</option>
                                <option value="경남은행">경남은행</option>
                                <option value="광주은행">광주은행</option>
                                <option value="전북은행">전북은행</option>
                                <option value="제주은행">제주은행</option>
                                <option value="KDB산업은행">KDB산업은행</option>
                                <option value="산림조합">산림조합</option>
                            </select>
                        </div>
                        <input type="text" class="cg-input" id="cgbGiverAcc" placeholder="출금 계좌번호 (- 없이)">
                    </div>

                    <!-- 받는 분 (교회 계좌) -->
                    <div class="cg-box">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:12px; color:#b45309; font-weight:900;">🏛️ 받는 분 (교회 계좌)</span>
                            <button type="button" style="background:#f59e0b; color:#ffffff; border:none; border-radius:6px; padding:3px 8px; font-size:11px; font-weight:950; cursor:pointer;" onclick="saveGlobalReceiverInfo()">저장</button>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:6px;">
                            <input type="text" class="cg-input" id="cgbReceiverName" placeholder="교회명">
                            <input type="text" class="cg-input" id="cgbReceiverBank" placeholder="은행명">
                        </div>
                        <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:6px;">
                            <input type="text" class="cg-input" id="cgbReceiverAcc" placeholder="계좌번호">
                            <input type="text" class="cg-input" id="cgbReceiverHolder" placeholder="예금주">
                        </div>
                    </div>

                    <!-- 헌금 금액 -->
                    <div>
                        <label style="font-size:11.5px; color:#475569; font-weight:800; display:block; margin-bottom:2px;">헌금 금액 (원)</label>
                        <input type="number" class="cg-input" id="cgbOfferingAmount" value="50000" style="font-size:16px; color:#0284c7; font-weight:950;">
                    </div>

                    <!-- 결제 비밀번호 -->
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                            <label style="font-size:11.5px; color:#0369a1; font-weight:900;">🔒 안전 결제 비밀번호 (4자리)</label>
                            <button type="button" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; border-radius:6px; padding:2px 7px; font-size:11px; font-weight:900; cursor:pointer;" onclick="registerOrUpdateGlobalOfferingPin()">🔑 비밀번호 등록/변경</button>
                        </div>
                        <input type="password" class="cg-input" id="cgbOfferingPw" maxlength="4" placeholder="••••" style="letter-spacing:6px; font-size:16px; font-weight:950; text-align:center;">
                    </div>

                    <!-- 스마트 결제 액션 버튼들 -->
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <button type="button" style="width:100%; height:46px; background:linear-gradient(135deg, #0284c7, #2563eb); color:white; border:none; border-radius:11px; font-size:14.5px; font-weight:950; cursor:pointer;" onclick="submitGlobalChurchOffering()">
                            🚀 즉시 송금 (계좌 자동복사 + 은행앱 열기)
                        </button>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px;">
                            <button type="button" style="height:38px; background:#f8fafc; color:#0284c7; border:1.5px solid #0284c7; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer;" onclick="copyGlobalChurchAccountOnly()">
                                📋 계좌번호만 복사
                            </button>
                            <button type="button" style="height:38px; background:#fef3c7; color:#b45309; border:1.5px solid #f59e0b; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer;" onclick="openGlobalTossDirectOffering()">
                                ⚡ 토스로 바로 송금
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(offModal);
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

        // 전역 토스트 생성
        if (!document.getElementById('churchGlobalToastBox')) {
            const t = document.createElement('div');
            t.className = 'church-global-toast';
            t.id = 'churchGlobalToastBox';
            document.body.appendChild(t);
        }
    }

    // 🌟 헌금 관련 전역 함수들
    const GLOBAL_BANK_MAP = {
        "국민은행": { pkg: "com.kbstar.kbbank", name: "KB스타뱅킹" },
        "농협은행": { pkg: "nh.smart.banking", name: "NH스마트뱅킹" },
        "신한은행": { pkg: "com.shinhan.sbanking", name: "신한 SOL뱅크" },
        "우리은행": { pkg: "com.wooribank.smart.npib", name: "우리WON뱅킹" },
        "하나은행": { pkg: "com.kebhana.hananbank", name: "하나원큐" },
        "카카오뱅크": { pkg: "com.kakaobank.channel", name: "카카오뱅크" },
        "토스뱅크": { pkg: "viva.republica.toss", name: "토스" },
        "케이뱅크": { pkg: "com.kbankwith.smartbank", name: "케이뱅크" },
        "기업은행": { pkg: "com.ibk.neobanking", name: "i-ONE Bank" },
        "SC제일은행": { pkg: "com.scfirstbank.breeze", name: "SC제일은행" },
        "우체국": { pkg: "com.epost.psns.sbanking", name: "우체국스마트뱅킹" },
        "새마을금고": { pkg: "kr.co.kfcc.mobile", name: "MG더뱅킹" },
        "신협": { pkg: "kr.co.cu.smartbank", name: "신협ON뱅크" },
        "수협은행": { pkg: "com.suhyup.psb", name: "수협헤이뱅크" },
        "부산은행": { pkg: "com.bsbank.smartbank", name: "부산은행" },
        "대구은행": { pkg: "com.dgb.bmap", name: "iM뱅크" },
        "경남은행": { pkg: "com.knbank.maru", name: "경남은행" },
        "광주은행": { pkg: "com.kjbank.smart", name: "광주은행" },
        "전북은행": { pkg: "com.jbbank.mbs", name: "전북은행" },
        "제주은행": { pkg: "com.shinhan.jejubank", name: "제주은행" },
        "KDB산업은행": { pkg: "com.kdb.smart", name: "스마트KDB" },
        "산림조합": { pkg: "kr.co.nfcf.smartbank", name: "산림조합" }
    };

    function showGlobalToast(msg) {
        const t = document.getElementById('churchGlobalToastBox');
        if (t) {
            t.innerText = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2200);
        } else {
            alert(msg);
        }
    }

    window.openChurchGlobalOfferingModal = function() {
        const modal = document.getElementById('churchGlobalOfferingModal');
        if (!modal) return;

        const gName = document.getElementById("cgbGiverName");
        const gBank = document.getElementById("cgbGiverBank");
        const gAcc = document.getElementById("cgbGiverAcc");
        const rName = document.getElementById("cgbReceiverName");
        const rBank = document.getElementById("cgbReceiverBank");
        const rAcc = document.getElementById("cgbReceiverAcc");
        const rHolder = document.getElementById("cgbReceiverHolder");

        if (gName) gName.value = localStorage.getItem("yetalkUserId") || localStorage.getItem("yetalkUserName") || "최예톡";
        if (gBank) gBank.value = localStorage.getItem("yetalkGiverBank") || "국민은행";
        if (gAcc) gAcc.value = localStorage.getItem("yetalkGiverAcc") || "";

        let curChurch = localStorage.getItem("yetalkChurchName") || "예톡행복한교회";
        if (!curChurch || curChurch.includes("움직이는") || curChurch.includes("김예톡") || curChurch.includes("최예톡")) {
            curChurch = "예톡행복한교회";
            localStorage.setItem("yetalkChurchName", "예톡행복한교회");
        }
        if (rName) rName.value = curChurch;
        if (rBank) rBank.value = localStorage.getItem("yetalkChurchBank") || "농협";
        if (rAcc) rAcc.value = localStorage.getItem("yetalkChurchAcc") || "302-1234-5678-91";
        if (rHolder) rHolder.value = localStorage.getItem("yetalkChurchHolder") || "예톡행복한교회";

        const savedPin = localStorage.getItem("yetalkOfferingPin") || "";
        const pwEl = document.getElementById("cgbOfferingPw");
        if (pwEl) pwEl.value = savedPin;

        modal.classList.add('open');
    };

    window.closeChurchGlobalOfferingModal = function() {
        const modal = document.getElementById('churchGlobalOfferingModal');
        if (modal) modal.classList.remove('open');
    };

    window.registerOrUpdateGlobalOfferingPin = function() {
        const cur = localStorage.getItem("yetalkOfferingPin") || "";
        const promptMsg = cur 
            ? "현재 등록된 안전결제 4자리 비밀번호가 있습니다.\n새로 변경할 비밀번호(숫자 4자리)를 입력하세요:" 
            : "헌금 시 사용할 안전결제 비밀번호(숫자 4자리)를 등록하세요:";
        const newPin = prompt(promptMsg, cur);
        if (newPin === null) return;
        const cleaned = newPin.trim();
        if (!/^\d{4}$/.test(cleaned)) {
            alert("⚠️ 비밀번호는 반드시 숫자 4자리여야 합니다.");
            return;
        }
        localStorage.setItem("yetalkOfferingPin", cleaned);
        const pwEl = document.getElementById("cgbOfferingPw");
        if (pwEl) pwEl.value = cleaned;
        showGlobalToast("🔑 안전결제 비밀번호(4자리)가 저장되었습니다!");
    };

    window.saveGlobalGiverInfo = function() {
        const gName = document.getElementById("cgbGiverName")?.value.trim();
        const gBank = document.getElementById("cgbGiverBank")?.value;
        const gAcc = document.getElementById("cgbGiverAcc")?.value.trim();
        if (gName) localStorage.setItem("yetalkUserName", gName);
        if (gBank) localStorage.setItem("yetalkGiverBank", gBank);
        if (gAcc) localStorage.setItem("yetalkGiverAcc", gAcc);
        showGlobalToast("✨ 출금 정보가 저장되었습니다!");
    };

    window.saveGlobalReceiverInfo = function() {
        const rName = document.getElementById("cgbReceiverName")?.value.trim();
        const rBank = document.getElementById("cgbReceiverBank")?.value.trim();
        const rAcc = document.getElementById("cgbReceiverAcc")?.value.trim();
        const rHolder = document.getElementById("cgbReceiverHolder")?.value.trim();
        if (rName) localStorage.setItem("yetalkChurchName", rName);
        if (rBank) localStorage.setItem("yetalkChurchBank", rBank);
        if (rAcc) localStorage.setItem("yetalkChurchAcc", rAcc);
        if (rHolder) localStorage.setItem("yetalkChurchHolder", rHolder);
        showGlobalToast("✨ 교회 계좌 정보가 저장되었습니다!");
    };

    window.copyGlobalChurchAccountOnly = function() {
        const acc = (document.getElementById("cgbReceiverAcc")?.value || "302-1234-5678-91").trim();
        const bank = (document.getElementById("cgbReceiverBank")?.value || "농협").trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(acc);
        }
        showGlobalToast(`📋 [${bank} ${acc}] 계좌가 복사되었습니다!`);
    };

    window.openGlobalTossDirectOffering = function() {
        const acc = (document.getElementById("cgbReceiverAcc")?.value || "3021234567891").replace(/[^0-9]/g, "");
        const bank = (document.getElementById("cgbReceiverBank")?.value || "농협").trim();
        const amount = (document.getElementById("cgbOfferingAmount")?.value || "50000").trim();
        const enteredPin = (document.getElementById("cgbOfferingPw")?.value || "").trim();
        const savedPin = localStorage.getItem("yetalkOfferingPin") || "";

        if (!enteredPin || enteredPin.length !== 4) {
            showGlobalToast("🔒 안전결제 비밀번호 4자리를 입력해주세요.");
            document.getElementById("cgbOfferingPw")?.focus();
            return;
        }
        if (savedPin && enteredPin !== savedPin) {
            showGlobalToast("❌ 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(acc);
        }
        closeChurchGlobalOfferingModal();
        showGlobalToast("⚡ 토스 앱으로 안전하게 연결합니다...");

        const tossUrl = `supertoss://send?bank=${encodeURIComponent(bank)}&account=${acc}&amount=${amount}`;
        window.location.href = tossUrl;
        setTimeout(() => {
            window.location.href = "intent://#Intent;package=viva.republica.toss;end;";
        }, 800);
    };

    window.submitGlobalChurchOffering = function() {
        const bank = (document.getElementById("cgbReceiverBank")?.value || "농협").trim();
        const acc = (document.getElementById("cgbReceiverAcc")?.value || "302-1234-5678-91").trim();
        const amount = (document.getElementById("cgbOfferingAmount")?.value || "50000").trim();
        const giverBank = document.getElementById("cgbGiverBank")?.value || "국민은행";
        const enteredPin = (document.getElementById("cgbOfferingPw")?.value || "").trim();
        const savedPin = localStorage.getItem("yetalkOfferingPin") || "";

        if (!amount || parseInt(amount, 10) <= 0) {
            showGlobalToast("헌금 금액을 올바르게 입력해주세요.");
            return;
        }

        if (!enteredPin || enteredPin.length !== 4) {
            showGlobalToast("🔒 안전결제 비밀번호 4자리를 입력해주세요.");
            document.getElementById("cgbOfferingPw")?.focus();
            return;
        }

        if (savedPin && enteredPin !== savedPin) {
            showGlobalToast("❌ 비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
            return;
        }

        if (!savedPin && /^\d{4}$/.test(enteredPin)) {
            localStorage.setItem("yetalkOfferingPin", enteredPin);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(acc);
        }

        closeChurchGlobalOfferingModal();
        showGlobalToast(`📋 [${bank} ${acc}] 계좌 복사 완료! [${giverBank}] 앱으로 연결합니다...`);

        const bankInfo = GLOBAL_BANK_MAP[giverBank] || GLOBAL_BANK_MAP["국민은행"];
        setTimeout(() => {
            if (bankInfo) {
                window.location.href = `intent://#Intent;package=${bankInfo.pkg};end;`;
            }
        }, 600);
    };

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

        timerNum.innerText = "2";
        gateMsg.innerText = "✨ 천국에도 쿠팡이 있을까? (2)";
        modal.classList.add('show');

        let remain = 2;
        if (coupangCountdownTimer) clearInterval(coupangCountdownTimer);

        coupangCountdownTimer = setInterval(() => {
            remain--;
            if (remain === 1) {
                timerNum.innerText = "1";
                gateMsg.innerText = "🛒 행복한 천국 쇼핑하세요 (1)";
            } else if (remain <= 0) {
                clearInterval(coupangCountdownTimer);
                modal.classList.remove('show');
                proceedToCoupangDirect();
            }
        }, 1000);
    }

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

    // 🌟 하단 5대 메뉴 클릭 이벤트 핸들러
    window.handleChurchGlobalNav = function(type) {
        switch(type) {
            case 'gospel':
                if (location.pathname.includes('gospel')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.location.href = "church_gospel.html";
                }
                break;
            case 'map':
                if (location.pathname.includes('map')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.location.href = "church_map.html";
                }
                break;
            case 'offering':
                // 1) 페이지 내 자체 openChurchOfferingModal 이 있으면 우선 실행
                if (typeof openChurchOfferingModal === 'function') {
                    openChurchOfferingModal();
                } else if (typeof openOfferingModal === 'function') {
                    openOfferingModal();
                } else {
                    // 2) 없으면 공통 주입 헌금 모달 실행 (절대 검은 화면 없음)
                    openChurchGlobalOfferingModal();
                }
                break;
            case 'tv':
                window.location.href = "index.html";
                break;
            case 'coupang':
                runCoupangGateCountdown();
                break;
        }
    };

    function checkAndHidePcAdmob() {
        const isPc = (window.innerWidth >= 768) || (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.AndroidBridge);
        if (isPc) {
            document.querySelectorAll('.church-common-admob-footer, .church-fixed-admob-footer, .bottom-fixed-admob-footer, .fixed-bottom-admob, .global-fixed-bottom-admob, [class*="admob"], [id*="admob"], [class*="Admob"], [id*="Admob"]').forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });
            document.body.style.setProperty('padding-bottom', '56px', 'important');
        }
    }

    function onChurchNavReady() {
        initChurchNav();
        checkAndHidePcAdmob();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onChurchNavReady);
    } else {
        onChurchNavReady();
    }
    window.addEventListener('pageshow', checkAndHidePcAdmob);
    window.addEventListener('resize', checkAndHidePcAdmob);
})();