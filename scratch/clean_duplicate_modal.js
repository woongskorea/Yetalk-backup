const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    // Replace duplicate const modal at end of openChristianRegisterModal
    const target = `        const modal = document.getElementById("christianRegisterModal");
        if (modal) { modal.style.display = "flex"; modal.classList.add("show"); }
    }

    function closeChristianRegisterModal() {`;

    const replacement = `    }

    function closeChristianRegisterModal() {`;

    if (html.includes(target)) {
        html = html.replace(target, replacement);
    }

    fs.writeFileSync(f, html, 'utf8');
    console.log(`Cleaned modal declaration in ${f}`);
}
