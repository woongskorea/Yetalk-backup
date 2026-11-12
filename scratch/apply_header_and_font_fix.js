const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    // 1. Increase .goodnews-text font-size by 1px (from 15.5px to 16.5px)
    const oldGnFont = `.goodnews-text {
            font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
            font-size: 15.5px;`;
    const newGnFont = `.goodnews-text {
            font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
            font-size: 16.5px;`;

    if (html.includes(oldGnFont)) {
        html = html.replace(oldGnFont, newGnFont);
        console.log(`Increased goodnews-text font size in ${f}`);
    } else {
        console.warn(`goodnews-text font size target not found in ${f}`);
    }

    // 2. Fix top padding for app-header on main page (to prevent status bar collision)
    const oldAppHeader = `<header class="app-header" style="display:flex; justify-content:space-between; align-items:flex-end; padding:28px 14px 6px 14px; background:#ffffff; border-bottom:none; box-sizing:border-box;">`;
    const newAppHeader = `<header class="app-header" style="display:flex; justify-content:space-between; align-items:flex-end; padding:max(36px, calc(env(safe-area-inset-top, 0px) + 16px)) 14px 8px 14px; background:#ffffff; border-bottom:none; box-sizing:border-box;">`;

    if (html.includes(oldAppHeader)) {
        html = html.replace(oldAppHeader, newAppHeader);
        console.log(`Lowered app-header in ${f}`);
    } else {
        console.warn(`App header target not found in ${f}`);
    }

    // 3. Fix top padding in christianFriendsModal (was height:52px with 0px top padding, overlapping status bar)
    const oldFriendsHeader = `<div style="height:52px; background:#ffffff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 16px; flex-shrink:0;">`;
    const newFriendsHeader = `<div style="padding-top:max(34px, calc(env(safe-area-inset-top, 0px) + 16px)); padding-bottom:12px; padding-left:16px; padding-right:16px; background:#ffffff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; box-sizing:border-box;">`;

    if (html.includes(oldFriendsHeader)) {
        html = html.replace(oldFriendsHeader, newFriendsHeader);
        console.log(`Fixed top padding in christianFriendsModal in ${f}`);
    } else {
        console.warn(`Friends header target not found in ${f}`);
    }

    fs.writeFileSync(f, html, 'utf8');
}
