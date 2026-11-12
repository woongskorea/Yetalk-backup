const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    const target = `<div class="top-slogan-nobox" onclick="openChristianRegisterModal()" style="cursor:pointer;" title="우리교회 홈페이지(앱) 무료 제작">`;
    const replacement = `<div class="top-slogan-nobox">`;

    if (html.includes(target)) {
        html = html.replace(target, replacement);
        fs.writeFileSync(f, html, 'utf8');
        console.log(`Removed slogan onclick from ${f}`);
    } else {
        console.warn(`Target not found in ${f}`);
    }
}
