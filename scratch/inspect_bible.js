const fs = require('fs');
const content = fs.readFileSync('assets/bible_66_data.js', 'utf8');
console.log('Total length:', content.length);
console.log('Head 400 chars:', content.substring(0, 400));

// Find Luke (눅 or 누가복음)
const idx = content.indexOf('누가복음');
console.log('Index of 누가복음:', idx);
if (idx >= 0) {
    console.log('누가복음 snippet:', content.substring(idx, idx + 400));
}
