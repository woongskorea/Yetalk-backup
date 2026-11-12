const fs = require('fs');
const content = fs.readFileSync('assets/index.html', 'utf8');
console.log('Read success! Length:', content.length);
// Check script tags balance
const scriptOpen = (content.match(/<script/gi) || []).length;
const scriptClose = (content.match(/<\/script>/gi) || []).length;
console.log('Script tags:', scriptOpen, scriptClose);
