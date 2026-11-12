const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    // 1. Add bottom AdMob slot to modalYetalkGuide
    const oldModalGuideEnd = `            <!-- 바디 안내 내용 (글자 크게 16px 확대, 2페이지 분량 시원한 스크롤) -->
            <div id="yetalkGuideBodyContent" style="padding:20px 18px; overflow-y:auto; -webkit-overflow-scrolling:touch; flex:1; font-size:16px; line-height:1.85; color:#1e293b; background:#f8fafc;">
                <!-- JS에서 선택된 탭 내용 렌더링 -->
            </div>


        </div>
    </div>`;

    const newModalGuideEnd = `            <!-- 바디 안내 내용 (글자 크게 16px 확대, 2페이지 분량 시원한 스크롤) -->
            <div id="yetalkGuideBodyContent" style="padding:20px 18px; overflow-y:auto; -webkit-overflow-scrolling:touch; flex:1; font-size:16px; line-height:1.85; color:#1e293b; background:#f8fafc;">
                <!-- JS에서 선택된 탭 내용 렌더링 -->
            </div>

            <!-- 🌟 [사용자 요청] 예톡 안내창 하단 고정 100 애드몹 배너 (소상공인·교회·의원 공식 스폰서 슬롯) -->
            <div style="width:100%; min-height:96px; max-height:96px; background:#f8fafc; border-top:1.5px solid #e2e8f0; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; padding:4px 0; box-sizing:border-box;">
                <div style="width:320px; height:88px; background:#e2e8f0; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#64748b; font-size:12px; font-weight:800; border:1px dashed #cbd5e1; box-sizing:border-box;">
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:3px;">
                        <span style="font-size:11px; background:#0284c7; color:#fff; padding:2px 8px; border-radius:4px; font-weight:900;">AD</span>
                        <span style="font-weight:900; color:#334155;">Google AdMob (320 x 100)</span>
                    </div>
                    <span style="font-size:11px; color:#64748b;">소상공인 · 교회 · 의원 · 예약앱 공식 스폰서 배너 슬롯</span>
                </div>
            </div>

        </div>
    </div>`;

    if (html.includes(oldModalGuideEnd)) {
        html = html.replace(oldModalGuideEnd, newModalGuideEnd);
        console.log(`Added bottom AdMob to guide modal in ${f}`);
    } else {
        console.warn(`Guide modal end not found in ${f}`);
    }

    // 2. Update title in yetalkGuideData.intro to "예톡의 시작 & 복음전도의 사명" on one line
    const oldIntroTitle = `<strong style="font-size:18.5px; color:#065f46; letter-spacing:-0.3px;">예톡의 탄생 비화 & 복음 전도의 사명</strong>`;
    const newIntroTitle = `<strong style="font-size:17.5px; color:#065f46; letter-spacing:-0.5px; white-space:nowrap;">예톡의 시작 &amp; 복음전도의 사명</strong>`;

    if (html.includes(oldIntroTitle)) {
        html = html.replace(oldIntroTitle, newIntroTitle);
        console.log(`Updated intro title in ${f}`);
    } else {
        console.warn(`Intro title not found in ${f}`);
    }

    fs.writeFileSync(f, html, 'utf8');
}
