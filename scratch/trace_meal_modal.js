const fs = require('fs');
const html = fs.readFileSync('assets/index.html', 'utf8');

const start = html.indexOf('id="mealPrayerLotteryModal"');
const end = html.indexOf('id="christianRegisterModal"');
const snippet = html.substring(start, end);

const lines = snippet.split('\n');
let depth = 0;
lines.forEach((line, i) => {
    const opens = (line.match(/<div(\s|>)/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    depth += (opens - closes);
    console.log(`Line ${i} (depth=${depth}): ${line.trim()}`);
});
