const fs = require('fs');
let content = fs.readFileSync('assets/bible_66_data.js', 'utf8').trim();
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}
content = content.replace(/^window\.BIBLE_66_DATA\s*=\s*/, '');
if (content.endsWith(';')) content = content.slice(0, -1);

const obj = JSON.parse(content);
console.log('Total Luke chapters:', obj['누가복음'].length);
console.log('Luke 2 verses 1-7:');
console.log(JSON.stringify(obj['누가복음'][1].slice(0, 7), null, 2));
