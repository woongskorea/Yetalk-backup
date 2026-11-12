const fs = require('fs');

const files = ['assets/onemain.html', 'assets/myapp_home.html', 'assets/index.html'];

for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
    let match;
    let idx = 0;
    while ((match = scriptRegex.exec(content)) !== null) {
        idx++;
        const attrs = match[1];
        const code = match[2];
        if (!code.trim() || attrs.includes('application/json') || attrs.includes('module')) continue;
        try {
            new Function(code);
        } catch(e) {
            console.error(`Syntax error in ${f} script #${idx}: ${e.message}`);
            process.exit(1);
        }
    }
    console.log(`${f} passed script syntax check!`);
}
