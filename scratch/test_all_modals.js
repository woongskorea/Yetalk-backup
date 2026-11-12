const fs = require('fs');
let html = fs.readFileSync('assets/index.html', 'utf8');

const target = `            </div>

        </div>
    </div>

    <!-- 1. 교우 회원가입 모달 -->`;

const replacement = `            </div>

        </div>
    </div>
    </div>

    <!-- 1. 교우 회원가입 모달 -->`;

html = html.replace(target, replacement);

function inspectModal(id) {
    const idx = html.indexOf(`id="${id}"`);
    console.log(`=== Inspecting ${id} ===`);
    const tagStart = html.lastIndexOf('<div', idx);
    let depth = 0;
    const re = /<\/?div(\s|>|\/)/g;
    re.lastIndex = tagStart;
    let match;
    while ((match = re.exec(html)) !== null) {
        if (match[0].startsWith('</')) {
            depth--;
            if (depth === 0) {
                console.log(`Modal ${id} properly closed at index ${match.index}!`);
                break;
            }
        } else {
            depth++;
        }
        if (match.index > tagStart + 50 && html.substring(match.index).startsWith('<div class="modal-overlay"')) {
            console.log(`WARNING: Hit next modal-overlay at depth ${depth}!`);
            break;
        }
    }
}

inspectModal('modalYetalkGuide');
inspectModal('mealPrayerLotteryModal');
inspectModal('christianRegisterModal');
inspectModal('christianFriendsModal');
