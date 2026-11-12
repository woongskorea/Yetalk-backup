const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    // 1. Add .circle-kakaotalk in CSS
    const oldCss = `        .circle-navershop {
            background: linear-gradient(135deg, #86efac 0%, #22c55e 50%, #15803d 100%);
            border: 2px solid #166534;
            box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
            color: #ffffff;
        }`;

    const newCss = `        .circle-navershop {
            background: linear-gradient(135deg, #86efac 0%, #22c55e 50%, #15803d 100%);
            border: 2px solid #166534;
            box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
            color: #ffffff;
        }
        .circle-kakaotalk {
            background: #FEE500;
            border: 2px solid #E5CE00;
            box-shadow: 0 4px 14px rgba(254, 229, 0, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
        }`;

    if (html.includes(oldCss)) {
        html = html.replace(oldCss, newCss);
    }

    // 2. Replace 네이버쇼핑 button with 카카오톡
    const oldBtn = `            <button type="button" class="btn-portal-app-item" onclick="openFiveApp('navershop')" title="네이버쇼핑">
                <div class="app-item-circle circle-navershop">
                    <span>🛍️</span>
                </div>
                <span class="app-item-label">네이버쇼핑</span>
            </button>`;

    const newBtn = `            <button type="button" class="btn-portal-app-item" onclick="openFiveApp('kakaotalk')" title="카카오톡 열기">
                <div class="app-item-circle circle-kakaotalk">
                    <svg viewBox="0 0 32 32" width="36" height="36" style="display:block;">
                        <path fill="#381E1F" d="M16 4.5C9.65 4.5 4.5 8.7 4.5 13.88c0 3.33 2.12 6.25 5.37 7.79l-1.37 5.12c-.12.45.38.83.77.58l6.04-3.99c.23.02.46.03.69.03 6.35 0 11.5-4.2 11.5-9.38S22.35 4.5 16 4.5z"/>
                        <text x="16" y="15.8" fill="#FEE500" font-family="'Arial Black', 'Pretendard', sans-serif" font-weight="900" font-size="6.5" text-anchor="middle" dominant-baseline="central">TALK</text>
                    </svg>
                </div>
                <span class="app-item-label">카카오톡</span>
            </button>`;

    if (html.includes(oldBtn)) {
        html = html.replace(oldBtn, newBtn);
    }

    // 3. Update openFiveApp logic
    const oldOpenFive = `        } else if (target === 'navershop') {
            // 🌟 [사용자 요청] 네이버쇼핑 로딩 지연/미표출 문제 완전 해결: 최신 쇼핑 URL 및 새창/외부 브라우저 안전 실행
            const naverShoppingUrl = 'https://m.shopping.naver.com';
            if (window.AndroidBridge) {
                if (window.AndroidBridge.openBrowser) {
                    try {
                        window.AndroidBridge.openBrowser(naverShoppingUrl);
                        return;
                    } catch(e) {}
                }
                if (window.AndroidBridge.launchApp) {
                    try {
                        window.AndroidBridge.launchApp('navershop');
                        return;
                    } catch(e) {}
                }
            }
            try { window.location.href = naverShoppingUrl; } catch(e) { window.open(naverShoppingUrl, '_blank'); }
        }`;

    const newOpenFive = `        } else if (target === 'kakao' || target === 'kakaotalk') {
            // 🌟 [사용자 요청] 네이버쇼핑 대신 카카오톡 앱 즉시 실행 (전국민 메신저 직행)
            if (window.AndroidBridge && window.AndroidBridge.launchApp) {
                try {
                    window.AndroidBridge.launchApp('kakaotalk');
                    return;
                } catch(e) {}
            }
            try {
                window.location.href = 'kakaotalk://';
                setTimeout(() => {
                    window.open('https://talk.kakao.com', '_blank');
                }, 1200);
            } catch(e) {
                window.open('https://talk.kakao.com', '_blank');
            }
        } else if (target === 'navershop') {
            const naverShoppingUrl = 'https://m.shopping.naver.com';
            if (window.AndroidBridge && window.AndroidBridge.openBrowser) {
                try { window.AndroidBridge.openBrowser(naverShoppingUrl); return; } catch(e) {}
            }
            try { window.location.href = naverShoppingUrl; } catch(e) { window.open(naverShoppingUrl, '_blank'); }
        }`;

    if (html.includes(oldOpenFive)) {
        html = html.replace(oldOpenFive, newOpenFive);
    }

    fs.writeFileSync(f, html, 'utf8');
    console.log(`Replaced navershop with kakaotalk in ${f}`);
}
