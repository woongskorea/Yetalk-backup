const fs = require('fs');
const html = fs.readFileSync('assets/index.html', 'utf8');

// Mock browser environment
global.localStorage = {
    data: {
        yetalk_user_name: '최베드로',
        yetalk_church_role: '성도',
        yetalk_church_name: '부산제일감리교회',
        yetalk_pastor_name: '이요한 목사'
    },
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = v; }
};

global.document = {
    getElementById(id) {
        return {
            id,
            value: '',
            innerText: '',
            innerHTML: '',
            style: {},
            classList: {
                add: (c) => console.log(`[${id}].classList.add(${c})`),
                remove: (c) => console.log(`[${id}].classList.remove(${c})`),
                toggle: (c, v) => {}
            },
            options: [{ value: '성도' }, { value: '담임목사' }]
        };
    },
    querySelectorAll() { return []; }, addEventListener() {}, body: { appendChild() {} }
};

global.window = global; global.addEventListener = () => {}; global.window.location = {};

// Extract script
const scriptMatch = html.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/i);
if (scriptMatch) {
    try {
        eval(scriptMatch[1]);
        console.log('Script evaluated successfully!');

        console.log('Testing openChristianRegisterModal()...');
        openChristianRegisterModal();
        console.log('openChristianRegisterModal() OK!');

        console.log('Testing openChristianFriendsModal()...');
        openChristianFriendsModal();
        console.log('openChristianFriendsModal() OK!');
    } catch(e) {
        console.error('ERROR during eval or call:', e);
    }
}
