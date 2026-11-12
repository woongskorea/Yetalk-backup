const fs = require('fs');
const content = fs.readFileSync('assets/index.html', 'utf8');
const vm = require('vm');

const mockLocalStorage = {
    getItem: (k) => {
        if (k === 'yetalk_user_name') return '최베드로';
        if (k === 'yetalk_church_role') return '성도';
        if (k === 'yetalk_church_name') return '부산제일감리교회';
        return null;
    },
    setItem: () => {}
};

const mockElements = {};
const getMockEl = (id) => {
    if (!mockElements[id]) {
        mockElements[id] = {
            style: {},
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            setAttribute: () => {},
            addEventListener: () => {},
            value: '',
            innerText: '',
            innerHTML: '',
            options: []
        };
    }
    return mockElements[id];
};

const dom = {
    getElementById: (id) => getMockEl(id),
    querySelectorAll: () => [],
    querySelector: () => null,
    body: { style: {} },
    addEventListener: () => {}
};

const sandbox = {
    window: { addEventListener: () => {} },
    document: dom,
    localStorage: mockLocalStorage,
    console: console,
    navigator: { userAgent: 'test' },
    location: { href: '' },
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval
};
sandbox.window.window = sandbox.window;
sandbox.window.document = dom;
sandbox.window.localStorage = mockLocalStorage;

// Find script
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.indexOf('</script>', scriptStart);
const code = content.substring(scriptStart + 8, scriptEnd);

try {
    vm.runInNewContext(code, sandbox);
    console.log('Script loaded successfully!');
    
    // Test openChristianRegisterModal
    console.log('Testing openChristianRegisterModal:');
    sandbox.openChristianRegisterModal();
    console.log('openChristianRegisterModal passed!');

    // Test handleChristianNav('invite')
    console.log('Testing handleChristianNav invite:');
    sandbox.handleChristianNav('invite');
    console.log('handleChristianNav invite passed!');
} catch(err) {
    console.error('Error during execution:', err);
}
