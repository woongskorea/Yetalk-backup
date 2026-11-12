const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

const newPrayerHtml = `                <!-- 대제목: [사용자 요청] 회개와 믿음 선포 기도문 -->
                <div style="text-align:center; padding-bottom:16px; border-bottom:2px solid #e2e8f0; margin-bottom:22px;">
                    <div style="font-size:23px; font-weight:950; color:#0f172a; letter-spacing:-0.5px; line-height:1.3;">
                        🔥 회개와 믿음 선포 기도문
                    </div>
                    <div style="font-size:14.5px; font-weight:850; color:#2563eb; margin-top:6px;">
                        조상의 영적 대물림 끊기 · 날마다 발을 씻는 통회자복 · 성령의 권세 선포
                    </div>
                </div>

                <!-- 기도문 본문: [사용자 요청] 글자 크기 16.5px로 살짝 크게 확대, 정돈된 단락 구성 -->
                <div style="font-size:16.5px; font-weight:800; color:#1e293b; line-height:1.95; word-break:keep-all;">
                    <p style="margin:0 0 20px 0;">
                        만군의 여호와 하나님, 온 우주 만물의 주관자이시며 나의 참된 아버지이신 주님을 찬양합니다! 예수 그리스도께서 십자가 위에서 "다 이루었다" 선포하시며 모든 어둠의 정사와 권세를 완전히 박살 내셨음을 믿고 선포합니다. 오직 주님만이 나의 유일한 구주이시며, 내 영혼과 가정, 일터의 절대적인 인도자 되심을 선포합니다.
                    </p>

                    <p style="margin:0 0 20px 0;">
                        주님, 이 시간 보혈의 능력으로 우리 가문의 오랜 역사 속 모든 어둠의 뿌리와 죄의 대물림을 단번에 끊어냅니다! 조상 대대로 흘러내려온 미신과 우상숭배, 알코올과 도박의 중독, 나태와 게으름, 상처와 분노, 그리고 두려움과 불안의 영을 예수 그리스도의 보혈 앞에 낱낱이 자백하오니, 삼·사 대로 이어지던 모든 저주의 줄은 지금 즉시 예수 이름으로 완전히 끊어졌음을 선포합니다!
                    </p>

                    <p style="margin:0 0 20px 0;">
                        주님, 그러나 조상들의 연약함보다 더 무서운 나의 은밀한 죄와 허물을 이 시간 낱낱이 자백하며 통회자복합니다.<br><br>
                        내 눈과 마음을 지키지 못하고 틈만 나면 파고들었던 음란과 정욕의 더러운 생각과 죄악들을 주님의 거룩한 보혈로 완전히 씻어내어 주옵소서.<br><br>
                        입으로는 하나님을 믿는다, 주님을 부른다 하면서도, 막상 삶의 현장과 일상 속에서는 주님을 온전히 신뢰하고 의지하지 않은 채, 내 경험과 내 생각, 내 뜻대로 고집하며 내 힘으로 살아가려 했던 모든 교만의 죄를 용서하여 주옵소서.<br><br>
                        하나님의 거룩한 말씀과 계명들을 가볍게 여기고 내 편한 대로 살아가며 주의 법도를 지키지 못한 모든 불순종의 죄를 이 시간 십자가 앞에 발고합니다. 하나님보다 돈과 세상의 안락과 성공을 더 사랑했던 우상숭배의 죄와, 주어진 시간과 재능을 영적 나태함으로 허비했던 모든 허물을 불쌍히 여겨 주옵소서.
                    </p>

                    <p style="margin:0 0 20px 0;">
                        생각해 보면 이 땅은 영원한 본향인 천국으로 가는 임시 거처요 정류장일 뿐인데, 이 세상에 마음을 빼앗겨 안주하며 살았음을 회개합니다. 예수님께서 제자들의 발을 씻기시며 "발을 씻지 않으면 나와 상관이 없다" 하신 말씀을 기억하오니, 날마다 주님 앞에서 내 영혼의 발을 씻으며 죽을 때까지 깨어 기도하는 겸손한 성도가 되게 하옵소서.
                    </p>

                    <p style="margin:0 0 20px 0; color:#1e40af; font-weight:850;">
                        주님, 우리가 이처럼 진심으로 통회자복하며 회개할 때, 예수님의 보혈로 우리의 모든 허물과 죄를 온전히 씻어주시고 '죄 없다' 의롭다 선언하여 주시니 참으로 감사합니다! 이 놀라운 은혜를 힘입어 주님 다시 오실 그날까지 우리의 행실을 정결하게 지키게 하시고, 날마다 자기를 부인하며 자기 십자가를 지고 따르는 십자가의 좋은 군사로 굳건히 서게 하옵소서. 오직 주님께서 입혀주시는 깨끗하고 빛난 세마포 옷을 입고, 기름을 준비한 지혜로운 다섯 처녀와 같이 늘 깨어 신랑 되신 주님을 맞이하는 거룩한 삶을 살아가게 하옵소서!
                    </p>

                    <p style="margin:0 0 20px 0; color:#047857; font-weight:900;">
                        성령님, 내 영혼과 심령 속에 성령의 불을 맹렬히 부어 주옵소서! 성령의 검인 하나님의 말씀과 폭발적인 능력으로 원수 마귀의 머리를 완전히 박살 내며, 언제나 성령의 인도하심 따라 거침없이 승리하는 영적 용사로 세워 주옵소서.
                    </p>

                    <p style="margin:0 0 20px 0; color:#b91c1c; font-weight:950; background:#fef2f2; border-left:4px solid #ef4444; padding:12px 14px; border-radius:8px;">
                        만왕의 왕이신 예수 그리스도의 권세와 성령의 능력을 힘입어 명하노니, 내 영혼과 가정, 생업을 대적하며 역사하던 모든 더러운 영과 어둠의 세력들은 들을지어다! 음란의 영, 우상의 영, 중독의 영, 내 뜻을 높이는 교만의 영, 나태와 불순종의 영아, 나사렛 예수 그리스도의 이름과 성령의 불로 명하노니 우리의 심령과 가정, 일터에서 단 한 조각도 남김없이 지금 당장 떠나갈지어다! 파쇄될지어다! 너희는 영원히 지옥 불못으로 쫓겨날지어다!
                    </p>

                    <p style="margin:0 0 20px 0;">
                        주님, 눈에 보이지 않는 이 치열한 영적 전쟁터에서 사방의 막힌 담을 터뜨리시는 파레스(돌파)의 은혜로 내 앞의 모든 장벽을 무너뜨려 주옵소서. 어떠한 시련 속에서도 항상 감사함으로 능히 이기게 하시고, 원수가 떠난 그 빈자리를 오직 성령의 불과 생수로 가득 채워 주사 거침없이 전진하게 하소서.
                    </p>

                    <p style="margin:0 0 20px 0; color:#0f172a; font-weight:900;">
                        더 이상 어린아이의 믿음에 머무르지 않고 장성한 분량을 소유한 하나님 나라의 군사요, 예수 그리스도의 증인으로 살아가겠습니다. 이 기도를 드릴 때마다 나의 영이 정결해지고 주님과 깊이 연합되게 하시니 감사합니다!
                    </p>

                    <!-- 🌟 [사용자 요청] 감사드리며 예수님의 이름으로 기도합니다.로 끝맺음 -->
                    <p style="margin:0 0 20px 0; color:#1d4ed8; font-weight:950; font-size:17.5px; text-align:center; padding:12px 0;">
                        감사드리며 예수님의 이름으로 기도합니다. 아멘!
                    </p>
                </div>`;

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    const startMarker = '<!-- 대제목';
    const endMarker = '<!-- 하단 은혜의 확인 버튼 (감사게시판 자동 연동) -->';

    const sIdx = html.indexOf(startMarker);
    const eIdx = html.indexOf(endMarker);

    if (sIdx !== -1 && eIdx !== -1) {
        html = html.substring(0, sIdx) + newPrayerHtml + '\n\n                ' + html.substring(eIdx);
        fs.writeFileSync(f, html, 'utf8');
        console.log(`Updated prayer content with requested ending in ${f}`);
    } else {
        console.warn(`Markers not found in ${f}`);
    }
}
