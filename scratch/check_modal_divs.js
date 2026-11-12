const fs = require('fs');
const html = fs.readFileSync('assets/index.html', 'utf8');

function checkModalDivs(modalId) {
    const start = html.indexOf(`id="${modalId}"`);
    if (start === -1) {
        console.log(`Modal ${modalId} not found`);
        return;
    }
    // Find next modal or end
    const nextModal = html.indexOf('class="modal-overlay"', start + 20);
    const sliceEnd = nextModal !== -1 ? nextModal : html.indexOf('<script', start);
    const modalHtml = html.substring(start, sliceEnd);
    
    // Count open and close divs
    const openMatches = modalHtml.match(/<div(\s|>)/g) || [];
    const closeMatches = modalHtml.match(/<\/div>/g) || [];
    console.log(`Modal [${modalId}]: open divs = ${openMatches.length + 1}, close divs = ${closeMatches.length}`);
}

checkModalDivs('modalYetalkGuide');
checkModalDivs('mealPrayerLotteryModal');
checkModalDivs('christianRegisterModal');
checkModalDivs('christianFriendsModal');
