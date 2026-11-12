const fs = require('fs');
const html = fs.readFileSync('assets/index.html', 'utf8');

function inspectModal(id) {
    const idx = html.indexOf(`id="${id}"`);
    console.log(`=== Inspecting ${id} at index ${idx} ===`);
    // Find where this tag starts
    const tagStart = html.lastIndexOf('<div', idx);
    let depth = 0;
    let pos = tagStart;
    let foundOpen = 0;
    let foundClose = 0;
    
    // Scan character by character or tag by tag
    const re = /<\/?div(\s|>|\/)/g;
    re.lastIndex = tagStart;
    let match;
    while ((match = re.exec(html)) !== null) {
        if (match[0].startsWith('</')) {
            depth--;
            foundClose++;
            if (depth === 0) {
                console.log(`Modal ${id} properly closed at index ${match.index} (close div #${foundClose})`);
                break;
            }
        } else {
            depth++;
            foundOpen++;
        }
        if (depth < 0) {
            console.log(`Negative depth at index ${match.index}!`);
            break;
        }
        // If we hit next modal with class="modal-overlay", warn!
        if (match.index > tagStart + 50 && html.substring(match.index).startsWith('<div class="modal-overlay"')) {
            console.log(`WARNING: Hit next modal-overlay at depth ${depth}! Next modal id snippet:`, html.substring(match.index, match.index + 80));
            break;
        }
    }
}

inspectModal('modalYetalkGuide');
inspectModal('mealPrayerLotteryModal');
inspectModal('christianRegisterModal');
inspectModal('christianFriendsModal');
