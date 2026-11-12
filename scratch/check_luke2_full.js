const fs = require('fs');
let content = fs.readFileSync('assets/bible_66_data.js', 'utf8').trim();
if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
content = content.replace(/^window\.BIBLE_66_DATA\s*=\s*/, '');
if (content.endsWith(';')) content = content.slice(0, -1);
const obj = JSON.parse(content);
console.log('Luke 2 total verses:', obj['누가복음'][1].length);
console.log('Verses 8-14:');
console.log(JSON.stringify(obj['누가복음'][1].slice(7, 14), null, 2));
