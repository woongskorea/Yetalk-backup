const fs = require('fs');
const txt = fs.readFileSync('assets/bible_data.js', 'utf8');
const idx = txt.indexOf('window.BIBLE_FULL_CHAPTERS["창세기_1"]');
if (idx !== -1) {
    console.log(txt.substring(idx, idx + 400));
} else {
    console.log('Not found in bible_data.js');
}
