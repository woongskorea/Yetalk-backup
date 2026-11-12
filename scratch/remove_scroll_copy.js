const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    // 1. Simplify handleBibleVerseClick and remove long-press timer triggers
    const oldVersePressBlock = `    let versePressTimer = null;
    let verseLongPressed = false;

    function handleVersePressStart(el, verseKey) {
        verseLongPressed = false;
        clearTimeout(versePressTimer);
        versePressTimer = setTimeout(() => {
            verseLongPressed = true;
            copyHighlightedVersesInCurrentChapter(verseKey);
        }, 550);
    }

    function handleVersePressEnd() {
        clearTimeout(versePressTimer);
    }

    function handleBibleVerseClick(event, el, verseKey) {
        if (verseLongPressed) {
            verseLongPressed = false;
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            return;
        }
        toggleBibleVerseHighlight(el, verseKey);
    }`;

    const newVersePressBlock = `    // 🌟 [사용자 요청] 스크롤 시 자동 클립복사 완전 제거! (터치할 때만 깨끗하게 색칠되고, 복사는 [색칠 복사] 버튼으로만 안전하게 실행)
    function handleVersePressStart(el, verseKey) {}
    function handleVersePressEnd() {}

    function handleBibleVerseClick(event, el, verseKey) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        toggleBibleVerseHighlight(el, verseKey);
    }`;

    if (html.includes(oldVersePressBlock)) {
        html = html.replace(oldVersePressBlock, newVersePressBlock);
    }

    // 2. Remove touchstart/mousedown from formatBibleVersesHtml
    const oldV1 = `html += \`<div class="bible-verse-item \${hlClass}" data-verse-key="\${verseKey}" onclick="handleBibleVerseClick(event, this, '\${verseKey}')" onmousedown="handleVersePressStart(this, '\${verseKey}')" onmouseup="handleVersePressEnd()" onmouseleave="handleVersePressEnd()" ontouchstart="handleVersePressStart(this, '\${verseKey}')" ontouchend="handleVersePressEnd()" ontouchcancel="handleVersePressEnd()" oncontextmenu="event.preventDefault(); return false;" title="터치: 형광펜 색칠 / 꾹 길게 누르면: 색칠 구절 복사"><span class="bible-verse-num">\${verseNum}.</span><span class="bible-verse-body">\${verseBody}</span></div>\`;`;
    const newV1 = `html += \`<div class="bible-verse-item \${hlClass}" data-verse-key="\${verseKey}" onclick="handleBibleVerseClick(event, this, '\${verseKey}')" oncontextmenu="event.preventDefault(); return false;" title="터치: 형광펜 색칠 (상단 [색칠 복사] 버튼으로 복사)"><span class="bible-verse-num">\${verseNum}.</span><span class="bible-verse-body">\${verseBody}</span></div>\`;`;

    if (html.includes(oldV1)) {
        html = html.replace(oldV1, newV1);
    }

    const oldV2 = `html += \`<div class="bible-verse-item \${hlLineClass}" data-verse-key="\${lineKey}" onclick="handleBibleVerseClick(event, this, '\${lineKey}')" onmousedown="handleVersePressStart(this, '\${lineKey}')" onmouseup="handleVersePressEnd()" onmouseleave="handleVersePressEnd()" ontouchstart="handleVersePressStart(this, '\${lineKey}')" ontouchend="handleVersePressEnd()" ontouchcancel="handleVersePressEnd()" oncontextmenu="event.preventDefault(); return false;" title="터치: 형광펜 색칠 / 꾹 길게 누르면: 색칠 구절 복사">\${trimmed}</div>\`;`;
    const newV2 = `html += \`<div class="bible-verse-item \${hlLineClass}" data-verse-key="\${lineKey}" onclick="handleBibleVerseClick(event, this, '\${lineKey}')" oncontextmenu="event.preventDefault(); return false;" title="터치: 형광펜 색칠 (상단 [색칠 복사] 버튼으로 복사)">\${trimmed}</div>\`;`;

    if (html.includes(oldV2)) {
        html = html.replace(oldV2, newV2);
    }

    // 3. Update copyHighlightedVersesInCurrentChapter toast message when no verses
    const oldNoVerses = `        if (versesInChapter.length === 0) {
            showBibleToast('💡 성경 구절을 터치하여 색칠한 후 꾹 누르면 복사됩니다.');
            return;
        }`;
    const newNoVerses = `        if (versesInChapter.length === 0) {
            showBibleToast('💡 복사할 성경 구절을 먼저 터치하여 색칠한 후 [색칠 복사] 버튼을 눌러주세요.');
            return;
        }`;

    if (html.includes(oldNoVerses)) {
        html = html.replace(oldNoVerses, newNoVerses);
    }

    fs.writeFileSync(f, html, 'utf8');
    console.log(`Updated scroll & copy logic in ${f}`);
}
