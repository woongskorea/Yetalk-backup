using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string[] files = new string[]
        {
            @"assets\index.html",
            @"docs\index.html",
            @"app\src\main\assets\index.html"
        };

        foreach (var file in files)
        {
            if (!File.Exists(file)) continue;
            string text = File.ReadAllText(file, Encoding.UTF8);

            // 1. Ensure CSS has high z-index and display:flex !important for christianRegisterModal and christianFriendsModal
            string cssTarget = "#christianFriendsModal.modal-overlay.show {";
            string cssReplacement = @"#christianRegisterModal.modal-overlay,
        #christianFriendsModal.modal-overlay,
        .modal-overlay {
            z-index: 99999 !important;
        }
        #christianRegisterModal.modal-overlay.show,
        #christianFriendsModal.modal-overlay.show,
        .modal-overlay.show {
            display: flex !important;
        }";

            if (text.Contains(cssTarget))
            {
                int cPos = text.IndexOf(cssTarget);
                int closeBrace = text.IndexOf("}", cPos);
                if (closeBrace != -1)
                {
                    string oldCss = text.Substring(cPos, closeBrace + 1 - cPos);
                    text = text.Replace(oldCss, cssReplacement);
                }
            }

            // 2. Add Live Clock right above [나의 앱 예톡🌿] without overlapping
            string clockHtml = @"
    <!-- 🌟 [사용자 요청] 스마트폰 상단 시계 감춤 대응: 나의 앱 예톡 위에 겹치지 않게 날짜/시계 실시간 표출 -->
    <div class=""header-live-clock-row"" style=""padding:4px 14px 2px 14px; display:flex; justify-content:flex-start; align-items:center; background:#ffffff; box-sizing:border-box;"">
        <span id=""txtHeaderLiveClock"" style=""font-size:11.5px; font-weight:800; color:#64748b; letter-spacing:-0.2px; display:inline-flex; align-items:center; gap:5px;"">
            <span style=""font-size:11px;"">🕒</span><span id=""liveClockDateText"">11월 11일(화) 오후 11:30</span>
        </span>
    </div>";

            string headerStartMarker = "<header class=\"app-header\"";
            if (!text.Contains("id=\"txtHeaderLiveClock\"") && text.Contains(headerStartMarker))
            {
                int hPos = text.IndexOf(headerStartMarker);
                text = text.Insert(hPos, clockHtml + "\r\n    ");
            }

            // 3. Add [📋 색칠 복사] button next to subtitle and 대표식사기도
            string oldSubtitleRowTarget = "<button type=\"button\" onclick=\"openMealPrayerLotteryModal()\"";
            string copyVerseBtnHtml = @"<button type=""button"" onclick=""copyHighlightedVersesInCurrentChapter()"" style=""background:#f0fdf4; border:1.5px solid #86efac; color:#15803d; border-radius:18px; padding:5px 10px; font-size:12px; font-weight:950; cursor:pointer; display:inline-flex; align-items:center; gap:4px; flex-shrink:0; white-space:nowrap; box-shadow:0 1.5px 4px rgba(22,163,74,0.15);"" title=""현재 장에서 형광펜 색칠한 구절 모두 복사하기"">
                    <span>📋</span><span>색칠 복사</span>
                </button>
                ";
            if (!text.Contains("copyHighlightedVersesInCurrentChapter()") && text.Contains(oldSubtitleRowTarget))
            {
                text = text.Replace(oldSubtitleRowTarget, copyVerseBtnHtml + oldSubtitleRowTarget);
            }

            // 4. Update formatBibleVersesHtml to support long press and click on verses
            string oldVerseItemPattern = "onclick=\"toggleBibleVerseHighlight(this, '${verseKey}')\" title=\"터치하여 형광펜 칠하기 (분홍 ➔ 노랑 ➔ 해제)\"";
            string newVerseItemPattern = "onclick=\"handleBibleVerseClick(event, this, '${verseKey}')\" onmousedown=\"handleVersePressStart(this, '${verseKey}')\" onmouseup=\"handleVersePressEnd()\" onmouseleave=\"handleVersePressEnd()\" ontouchstart=\"handleVersePressStart(this, '${verseKey}')\" ontouchend=\"handleVersePressEnd()\" ontouchcancel=\"handleVersePressEnd()\" oncontextmenu=\"event.preventDefault(); return false;\" title=\"터치: 형광펜 색칠 / 꾹 길게 누르면: 색칠 구절 복사\"";
            text = text.Replace(oldVerseItemPattern, newVerseItemPattern);

            string oldLineItemPattern = "onclick=\"toggleBibleVerseHighlight(this, '${lineKey}')\" title=\"터치하여 형광펜 칠하기 (분홍 ➔ 노랑 ➔ 해제)\"";
            string newLineItemPattern = "onclick=\"handleBibleVerseClick(event, this, '${lineKey}')\" onmousedown=\"handleVersePressStart(this, '${lineKey}')\" onmouseup=\"handleVersePressEnd()\" onmouseleave=\"handleVersePressEnd()\" ontouchstart=\"handleVersePressStart(this, '${lineKey}')\" ontouchend=\"handleVersePressEnd()\" ontouchcancel=\"handleVersePressEnd()\" oncontextmenu=\"event.preventDefault(); return false;\" title=\"터치: 형광펜 색칠 / 꾹 길게 누르면: 색칠 구절 복사\"";
            text = text.Replace(oldLineItemPattern, newLineItemPattern);

            // 5. Update openChristianRegisterModal, closeChristianRegisterModal, openChristianFriendsModal, closeChristianFriendsModal to explicitly set style.display = 'flex' / 'none'
            text = text.Replace("const modal = document.getElementById(\"christianRegisterModal\");\r\n        if (modal) modal.classList.add(\"show\");",
                "const modal = document.getElementById(\"christianRegisterModal\");\r\n        if (modal) { modal.style.display = \"flex\"; modal.classList.add(\"show\"); }");
            text = text.Replace("const modal = document.getElementById(\"christianRegisterModal\");\n        if (modal) modal.classList.add(\"show\");",
                "const modal = document.getElementById(\"christianRegisterModal\");\n        if (modal) { modal.style.display = \"flex\"; modal.classList.add(\"show\"); }");

            text = text.Replace("const modal = document.getElementById(\"christianRegisterModal\");\r\n        if (modal) modal.classList.remove(\"show\");",
                "const modal = document.getElementById(\"christianRegisterModal\");\r\n        if (modal) { modal.style.display = \"none\"; modal.classList.remove(\"show\"); }");
            text = text.Replace("const modal = document.getElementById(\"christianRegisterModal\");\n        if (modal) modal.classList.remove(\"show\");",
                "const modal = document.getElementById(\"christianRegisterModal\");\n        if (modal) { modal.style.display = \"none\"; modal.classList.remove(\"show\"); }");

            text = text.Replace("const modal = document.getElementById(\"christianFriendsModal\");\r\n        if (modal) modal.classList.add(\"show\");",
                "const modal = document.getElementById(\"christianFriendsModal\");\r\n        if (modal) { modal.style.display = \"flex\"; modal.classList.add(\"show\"); }");
            text = text.Replace("const modal = document.getElementById(\"christianFriendsModal\");\n        if (modal) modal.classList.add(\"show\");",
                "const modal = document.getElementById(\"christianFriendsModal\");\n        if (modal) { modal.style.display = \"flex\"; modal.classList.add(\"show\"); }");

            text = text.Replace("const modal = document.getElementById(\"christianFriendsModal\");\r\n        if (modal) modal.classList.remove(\"show\");",
                "const modal = document.getElementById(\"christianFriendsModal\");\r\n        if (modal) { modal.style.display = \"none\"; modal.classList.remove(\"show\"); }");
            text = text.Replace("const modal = document.getElementById(\"christianFriendsModal\");\n        if (modal) modal.classList.remove(\"show\");",
                "const modal = document.getElementById(\"christianFriendsModal\");\n        if (modal) { modal.style.display = \"none\"; modal.classList.remove(\"show\"); }");

            // 6. In updateChristianHeaderUI, ensure joinBtn.onclick is explicitly bound and chipTabInvite has onclick
            string oldHeaderJoinBtnUpdate = "joinBtn.style.padding = \"5px 10px\";\r\n            }";
            string oldHeaderJoinBtnUpdateLF = "joinBtn.style.padding = \"5px 10px\";\n            }";
            string newHeaderJoinBtnUpdate = "joinBtn.style.padding = \"5px 10px\";\r\n                joinBtn.onclick = () => openChristianRegisterModal();\r\n            }";
            if (text.Contains(oldHeaderJoinBtnUpdate))
            {
                text = text.Replace(oldHeaderJoinBtnUpdate, newHeaderJoinBtnUpdate);
            }
            else if (text.Contains(oldHeaderJoinBtnUpdateLF))
            {
                text = text.Replace(oldHeaderJoinBtnUpdateLF, newHeaderJoinBtnUpdate);
            }

            // Also ensure else branch sets onclick
            string oldHeaderJoinBtnElse = "joinBtn.style.padding = \"5px 12px\";\r\n            }";
            string oldHeaderJoinBtnElseLF = "joinBtn.style.padding = \"5px 12px\";\n            }";
            string newHeaderJoinBtnElse = "joinBtn.style.padding = \"5px 12px\";\r\n                joinBtn.onclick = () => openChristianRegisterModal();\r\n            }";
            if (text.Contains(oldHeaderJoinBtnElse))
            {
                text = text.Replace(oldHeaderJoinBtnElse, newHeaderJoinBtnElse);
            }
            else if (text.Contains(oldHeaderJoinBtnElseLF))
            {
                text = text.Replace(oldHeaderJoinBtnElseLF, newHeaderJoinBtnElse);
            }

            // 7. Add JS long-press handler, copyHighlightedVersesInCurrentChapter, and live clock update function
            string jsMarker = "function toggleBibleVerseHighlight(el, verseKey) {";
            if (!text.Contains("function copyHighlightedVersesInCurrentChapter") && text.Contains(jsMarker))
            {
                string jsLongPressCode = @"
    /* ==========================================================================
       🌟 [사용자 요청] 헤더 상단 실시간 시계 (몇월 몇일(요일) 몇시 몇분)
    ========================================================================== */
    function updateHeaderLiveClock() {
        const el = document.getElementById('liveClockDateText');
        if (!el) return;
        const now = new Date();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = days[now.getDay()];
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        el.innerText = `${month}월 ${date}일(${dayName}) ${ampm} ${displayHours}시 ${minutes}분`;
    }
    setInterval(updateHeaderLiveClock, 30000);
    setTimeout(updateHeaderLiveClock, 100);

    /* ==========================================================================
       🌟 [사용자 요청] 성경 구절 터치하여 색칠(형광펜) 후 꾹 길게 누르면 색칠 구절 자동 복사!
       - 현재 장 안에서 색칠된 모든 구절을 순서대로 모아서 클립보드에 복사
       - 색칠된 구절이 없을 때 길게 누르면 해당 구절을 바로 색칠하고 복사
    ========================================================================== */
    let versePressTimer = null;
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
    }

    function copyHighlightedVersesInCurrentChapter(clickedKey) {
        const book = currentUserBibleBook || '성경';
        const ch = currentUserBibleCh || 1;
        let highlights = {};
        try {
            highlights = JSON.parse(localStorage.getItem('yetalk_bible_highlights') || '{}');
        } catch(e) { highlights = {}; }

        const item = getBibleChapterItem(book, ch);
        const lines = (item.text || '').split('\n');
        let versesInChapter = [];

        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return;
            const m = trimmed.match(/^(\d+)[.\s]\s*(.*)$/);
            if (m) {
                const vNum = parseInt(m[1], 10);
                const vKey = `${book}_${ch}_${m[1]}`;
                if (highlights[vKey]) {
                    versesInChapter.push({ num: vNum, text: `${m[1]}. ${m[2]}` });
                }
            } else {
                const lKey = `${book}_${ch}_L${idx}`;
                if (highlights[lKey]) {
                    versesInChapter.push({ num: idx + 1, text: trimmed });
                }
            }
        });

        // 현재 장에 아직 색칠된 구절이 없다면, 방금 길게 누른 구절을 바로 색칠하고 복사
        if (versesInChapter.length === 0 && clickedKey) {
            const targetEl = document.querySelector(`[data-verse-key=""${clickedKey}""]`);
            if (targetEl) {
                toggleBibleVerseHighlight(targetEl, clickedKey);
            }
            try {
                highlights = JSON.parse(localStorage.getItem('yetalk_bible_highlights') || '{}');
            } catch(e) {}
            lines.forEach((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return;
                const m = trimmed.match(/^(\d+)[.\s]\s*(.*)$/);
                if (m) {
                    const vNum = parseInt(m[1], 10);
                    const vKey = `${book}_${ch}_${m[1]}`;
                    if (highlights[vKey]) {
                        versesInChapter.push({ num: vNum, text: `${m[1]}. ${m[2]}` });
                    }
                } else {
                    const lKey = `${book}_${ch}_L${idx}`;
                    if (highlights[lKey]) {
                        versesInChapter.push({ num: idx + 1, text: trimmed });
                    }
                }
            });
        }

        if (versesInChapter.length === 0) {
            showBibleToast('💡 성경 구절을 터치하여 색칠한 후 꾹 누르면 복사됩니다.');
            return;
        }

        // 절 번호 순서로 오름차순 정렬
        versesInChapter.sort((a, b) => a.num - b.num);
        const minVerse = versesInChapter[0].num;
        const maxVerse = versesInChapter[versesInChapter.length - 1].num;
        const rangeStr = (minVerse === maxVerse) ? `${minVerse}절` : `${minVerse}~${maxVerse}절`;

        const copyBody = versesInChapter.map(v => v.text).join('\n');
        const fullText = `[${book} ${ch}장 (${rangeStr} 말씀)]\n${copyBody}\n\n- 예톡 성경 (yetalk.cc)`;

        let copied = false;
        if (window.AndroidBridge && window.AndroidBridge.copyToClipboard) {
            try {
                window.AndroidBridge.copyToClipboard(fullText);
                copied = true;
            } catch(e) {}
        }
        if (!copied && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(fullText).then(() => {}).catch(() => {});
            copied = true;
        }
        if (!copied) {
            try {
                const ta = document.createElement('textarea');
                ta.value = fullText;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                copied = true;
            } catch(e) {}
        }

        try {
            if (navigator.vibrate) navigator.vibrate(50);
        } catch(e) {}
        showBibleToast(`📋 ${book} ${ch}장 색칠 말씀 (${versesInChapter.length}개 절) 복사 완료!`);
    }

    window.updateHeaderLiveClock = updateHeaderLiveClock;
    window.copyHighlightedVersesInCurrentChapter = copyHighlightedVersesInCurrentChapter;
    window.handleBibleVerseClick = handleBibleVerseClick;
    window.handleVersePressStart = handleVersePressStart;
    window.handleVersePressEnd = handleVersePressEnd;
";
                text = text.Replace(jsMarker, jsLongPressCode + "\r\n    " + jsMarker);
            }

            // Expose globally
            if (!text.Contains("window.openChristianRegisterModal = openChristianRegisterModal;"))
            {
                text = text.Replace("window.updateChristianHeaderUI = updateChristianHeaderUI;",
                    "window.updateChristianHeaderUI = updateChristianHeaderUI;\r\n    window.openChristianRegisterModal = openChristianRegisterModal;\r\n    window.closeChristianRegisterModal = closeChristianRegisterModal;\r\n    window.openChristianFriendsModal = openChristianFriendsModal;\r\n    window.closeChristianFriendsModal = closeChristianFriendsModal;");
            }

            File.WriteAllText(file, text, Encoding.UTF8);
            Console.WriteLine("Successfully updated verse copy, modals & live clock in " + file);
        }
    }
}
