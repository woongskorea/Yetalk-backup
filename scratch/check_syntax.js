const fs = require('fs');
const html = fs.readFileSync('assets/index.html', 'utf8');
const scripts = html.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi);
scripts.forEach((s, idx) => {
    if (s.includes('type="module"')) return;
    const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    try {
        new Function(code);
        console.log('Script ' + idx + ': Syntax 100% Valid!');
    } catch(e) {
        console.error('Script ' + idx + ' Syntax Error:', e.message);
    }
});
