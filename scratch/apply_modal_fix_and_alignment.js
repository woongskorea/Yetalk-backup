const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    // 1. Fix missing closing div on mealPrayerLotteryModal that swallowed christianRegisterModal and christianFriendsModal
    const oldMealEnd = `            <div style="width:100%; min-height:100px; max-height:100px; background:#f8fafc; border-top:1.5px solid #e2e8f0; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; padding:4px 0; box-sizing:border-box;">
                <div style="width:320px; height:100px; background:#e2e8f0; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#64748b; font-size:12px; font-weight:800; border:1px dashed #cbd5e1; box-sizing:border-box;">
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                        <span style="font-size:11px; background:#0284c7; color:#fff; padding:2px 8px; border-radius:4px; font-weight:900;">AD</span>
                        <span style="font-weight:900; color:#334155;">Google AdMob (320 x 150)</span>
                    </div>
                    <span style="font-size:11px; color:#64748b;">소상공인 · 교회 · 의원 · 예약앱 공식 스폰서 배너 슬롯</span>
                </div>
            </div>

        </div>
    </div>

    <!-- 1. 교우 회원가입 모달 -->`;

    const newMealEnd = `            <div style="width:100%; min-height:100px; max-height:100px; background:#f8fafc; border-top:1.5px solid #e2e8f0; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; padding:4px 0; box-sizing:border-box;">
                <div style="width:320px; height:100px; background:#e2e8f0; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#64748b; font-size:12px; font-weight:800; border:1px dashed #cbd5e1; box-sizing:border-box;">
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                        <span style="font-size:11px; background:#0284c7; color:#fff; padding:2px 8px; border-radius:4px; font-weight:900;">AD</span>
                        <span style="font-weight:900; color:#334155;">Google AdMob (320 x 150)</span>
                    </div>
                    <span style="font-size:11px; color:#64748b;">소상공인 · 교회 · 의원 · 예약앱 공식 스폰서 배너 슬롯</span>
                </div>
            </div>

        </div>
    </div>
    </div>

    <!-- 1. 교우 회원가입 모달 -->`;

    if (html.includes(oldMealEnd)) {
        html = html.replace(oldMealEnd, newMealEnd);
        console.log(`Fixed missing closing div in ${f}`);
    } else {
        console.warn(`Target not found in ${f}`);
    }

    // 2. Align right header actions (최베드로 & ☰) down to match 나의 앱 예톡 baseline
    // and give delicate breathing room to quick-nav-bar
    const oldHeader = `<header class="app-header" style="display:flex; justify-content:space-between; align-items:center; padding:28px 14px 6px 14px; background:#ffffff; border-bottom:none; box-sizing:border-box;">
        <div class="header-logo-group" id="headerLogoGroup" onclick="handleLogoClick()" style="display:flex; flex-direction:column; justify-content:center; white-space:nowrap; cursor:pointer;">
            <span id="txtHeaderLiveClock" style="font-size:11px; font-weight:800; color:#64748b; letter-spacing:-0.2px; line-height:1.2; margin-bottom:2px;">
                🕒 <span id="liveClockDateText">11월 11일(화) 오후 11:30</span>
            </span>
            <div style="display:flex; align-items:baseline; gap:5px;">
                <span class="header-logo-prefix" style="font-size:13.5px; font-weight:750; color:#475569; letter-spacing:-0.3px;">나의 앱</span>
                <span class="header-logo-name" style="font-size:26px; font-weight:950; color:#059669; letter-spacing:-0.5px;">예톡🌿</span>
            </div>
        </div>
        <div class="header-right-actions" style="display:flex; align-items:center; gap:8px;">
            <!-- 🌟 [사용자 요청] 나의 앱 예톡 우측 햄버거 버튼 좌측에 [회원가입] 배치 -->
            <button type="button" id="btnHeaderJoinAction" onclick="openChristianRegisterModal()" style="background:linear-gradient(135deg, #059669, #047857); border:1.5px solid #10b981; color:#ffffff; font-size:12.5px; font-weight:950; padding:5px 12px; border-radius:16px; cursor:pointer; box-shadow:0 2px 8px rgba(5,150,105,0.3); white-space:nowrap; transition:transform 0.12s ease;">회원가입</button>
            <button type="button" class="btn-header-hamburger" title="전체 메뉴" onclick="openDrawer()" style="background:none; border:none; font-size:24px; color:#1e293b; padding:2px 4px; cursor:pointer;">☰</button>
        </div>
    </header>

    <!-- 2. 퀵 메뉴 바: [사용자 요청] 내앱은 MYAPP 내가 만든 앱 보관함(개인앱·작은교회·전문앱), 예약앱은 상점 리스트, 교회앱은 교회 리스트, 의원앱은 의원 리스트 연결 -->
    <nav class="quick-nav-bar" style="padding:2px 12px 6px 12px; margin-top:0;">`;

    const newHeader = `<header class="app-header" style="display:flex; justify-content:space-between; align-items:flex-end; padding:28px 14px 6px 14px; background:#ffffff; border-bottom:none; box-sizing:border-box;">
        <div class="header-logo-group" id="headerLogoGroup" onclick="handleLogoClick()" style="display:flex; flex-direction:column; justify-content:flex-end; white-space:nowrap; cursor:pointer;">
            <span id="txtHeaderLiveClock" style="font-size:11px; font-weight:800; color:#64748b; letter-spacing:-0.2px; line-height:1.2; margin-bottom:2px;">
                🕒 <span id="liveClockDateText">11월 11일(화) 오후 11:30</span>
            </span>
            <div style="display:flex; align-items:baseline; gap:5px;">
                <span class="header-logo-prefix" style="font-size:13.5px; font-weight:750; color:#475569; letter-spacing:-0.3px;">나의 앱</span>
                <span class="header-logo-name" style="font-size:26px; font-weight:950; color:#059669; letter-spacing:-0.5px;">예톡🌿</span>
            </div>
        </div>
        <div class="header-right-actions" style="display:flex; align-items:center; gap:8px; align-self:flex-end; padding-bottom:3px;">
            <!-- 🌟 [사용자 요청] 나의 앱 예톡 우측 햄버거 버튼 좌측에 [회원가입] 배치 -->
            <button type="button" id="btnHeaderJoinAction" onclick="openChristianRegisterModal()" style="background:linear-gradient(135deg, #059669, #047857); border:1.5px solid #10b981; color:#ffffff; font-size:12.5px; font-weight:950; padding:5px 12px; border-radius:16px; cursor:pointer; box-shadow:0 2px 8px rgba(5,150,105,0.3); white-space:nowrap; transition:transform 0.12s ease;">회원가입</button>
            <button type="button" class="btn-header-hamburger" title="전체 메뉴" onclick="openDrawer()" style="background:none; border:none; font-size:24px; color:#1e293b; padding:2px 4px; cursor:pointer; line-height:1;">☰</button>
        </div>
    </header>

    <!-- 2. 퀵 메뉴 바: [사용자 요청] 내앱은 MYAPP 내가 만든 앱 보관함(개인앱·작은교회·전문앱), 예약앱은 상점 리스트, 교회앱은 교회 리스트, 의원앱은 의원 리스트 연결 -->
    <nav class="quick-nav-bar" style="padding:6px 12px 8px 12px; margin-top:5px;">`;

    if (html.includes(oldHeader)) {
        html = html.replace(oldHeader, newHeader);
        console.log(`Aligned header actions and added breathing room in ${f}`);
    } else {
        console.warn(`Header target not found in ${f}`);
    }

    fs.writeFileSync(f, html, 'utf8');
}
