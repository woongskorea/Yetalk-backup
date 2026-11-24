using System;
using System.IO;
using System.Text;
using System.Collections.Generic;

class ApplyShiftByLines
{
    static void Main()
    {
        string filePath = @"assets\yetalktv.html";
        List<string> lines = new List<string>(File.ReadAllLines(filePath, Encoding.UTF8));

        // 1. Line 5281: btnShortsAdminUpload hide by default
        for (int i = 0; i < lines.Count; i++)
        {
            if (lines[i].Contains("id=\"btnShortsAdminUpload\"") && !lines[i].Contains("style=\"display:none;\""))
            {
                lines[i] = lines[i].Replace("title=\"내가 올리는 영상 (대표 추천/고정)\"", "title=\"내가 올리는 영상 (대표 추천/고정)\" style=\"display:none;\"");
                Console.WriteLine("1. btnShortsAdminUpload hidden by default at line " + (i + 1));
                break;
            }
        }

        // 2. adminSlotEditModal body replacement
        // Find line with id="adminSlotTabsContainer"
        int tabsContainerLine = -1;
        for (int i = 0; i < lines.Count; i++)
        {
            if (lines[i].Contains("id=\"adminSlotTabsContainer\""))
            {
                tabsContainerLine = i;
                break;
            }
        }

        if (tabsContainerLine > 0)
        {
            // The notice line above it
            int noticeStart = tabsContainerLine - 1;
            while (noticeStart > 0 && !lines[noticeStart].Contains("margin-bottom:8px; display:flex;"))
            {
                noticeStart--;
            }

            // Find save button: saveAdminSlotSingleVideoExact
            int saveBtnLine = -1;
            for (int i = tabsContainerLine; i < tabsContainerLine + 40; i++)
            {
                if (lines[i].Contains("saveAdminSlotSingleVideoExact()"))
                {
                    saveBtnLine = i;
                    break;
                }
            }

            int saveBtnEnd = saveBtnLine;
            while (saveBtnEnd < lines.Count && !lines[saveBtnEnd].Contains("</button>"))
            {
                saveBtnEnd++;
            }

            Console.WriteLine("Found modal section from line " + (noticeStart + 1) + " to " + (saveBtnEnd + 1));

            // Replace lines from noticeStart up to saveBtnEnd
            List<string> replacementModalLines = new List<string>
            {
                "            <!-- 🌟 [대표님 요청] 채널 빠른 선택 5종: 찬양, 회개, 간증, 말씀, 기도 -->",
                "            <div style=\"margin-bottom:10px;\">",
                "                <span style=\"font-size:11.5px; font-weight:900; color:#94a3b8; display:block; margin-bottom:4px;\">📺 등록할 채널 선택 (5대 고정 채널)</span>",
                "                <div id=\"adminChannelQuickTabs\" style=\"display:flex; gap:5px; overflow-x:auto; padding-bottom:2px;\">",
                "                    <!-- JS로 5대 채널 버튼 동적 렌더링 -->",
                "                </div>",
                "            </div>",
                "",
                "            <!-- 🌟 [대표님 요청] 중요도 순위 1, 2, 3번 심플 선택 (밀어내기 자동 적용) -->",
                "            <div style=\"background:#1e293b; border:1.8px solid #38bdf8; border-radius:12px; padding:10px 12px; margin-bottom:12px; box-sizing:border-box;\">",
                "                <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:7px;\">",
                "                    <span style=\"font-size:12.5px; font-weight:950; color:#facc15;\">⭐ 중요도 순위 배치 (밀어내기 자동 적용)</span>",
                "                    <span id=\"adminRankSelectionBadge\" style=\"font-size:11px; font-weight:900; color:#38bdf8; background:#0b1120; padding:2px 8px; border-radius:10px; border:1px solid #38bdf8;\">1번 선택 (기존 영상 밀려남)</span>",
                "                </div>",
                "                <div style=\"display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;\">",
                "                    <button type=\"button\" id=\"btnAdminRank1\" onclick=\"selectAdminSlotRank(0)\" style=\"padding:9px 4px; background:linear-gradient(135deg, #0284c7, #2563eb); color:#fff; border:2px solid #38bdf8; border-radius:10px; font-size:13.5px; font-weight:950; cursor:pointer; box-shadow:0 0 10px rgba(56,189,248,0.5); transition:all 0.15s ease;\">",
                "                        🥇 1번 (최우선)",
                "                    </button>",
                "                    <button type=\"button\" id=\"btnAdminRank2\" onclick=\"selectAdminSlotRank(1)\" style=\"padding:9px 4px; background:#0b1120; color:#cbd5e1; border:1.2px solid #334155; border-radius:10px; font-size:13.5px; font-weight:900; cursor:pointer; transition:all 0.15s ease;\">",
                "                        🥈 2번 (중요)",
                "                    </button>",
                "                    <button type=\"button\" id=\"btnAdminRank3\" onclick=\"selectAdminSlotRank(2)\" style=\"padding:9px 4px; background:#0b1120; color:#cbd5e1; border:1.2px solid #334155; border-radius:10px; font-size:13.5px; font-weight:900; cursor:pointer; transition:all 0.15s ease;\">",
                "                        🥉 3번 (일반)",
                "                    </button>",
                "                </div>",
                "                <div style=\"font-size:11px; color:#94a3b8; margin-top:6px; line-height:1.45; word-break:keep-all;\">",
                "                    💡 <b>1번 선택 시</b>: 새 영상이 1번이 되고, 기존 1번은 2번으로, 2번은 3번으로 자동 밀려납니다!<br>",
                "                    💡 <b>2번 선택 시</b>: 1번은 유지되고, 기존 2번이 3번으로 밀려납니다!",
                "                </div>",
                "            </div>",
                "",
                "            <!-- 🌟 12개의 메뉴(슬롯 버튼) 전체 현황 (3열 바둑판) -->",
                "            <div style=\"margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;\">",
                "                <span style=\"font-size:11.5px; font-weight:900; color:#cbd5e1;\">📋 전체 12개 슬롯 배치 현황 (터치하여 개별 선택 가능)</span>",
                "                <span style=\"font-size:11px; color:#38bdf8; font-weight:800;\" id=\"adminSelectedSlotNotice\">선택: 1번</span>",
                "            </div>",
                "            <div id=\"adminSlotTabsContainer\" style=\"display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:6px; margin-bottom:12px;\">",
                "                <!-- JS로 12개 슬롯 버튼 동적 렌더링 -->",
                "            </div>",
                "",
                "            <!-- 선택된 슬롯 등록 폼 -->",
                "            <div style=\"background:#131d33; border:1.5px solid #1e3a5f; border-radius:12px; padding:12px; margin-bottom:12px; box-sizing:border-box;\">",
                "                <div style=\"margin-bottom:10px;\">",
                "                    <label style=\"font-size:12px; font-weight:900; color:#38bdf8; display:block; margin-bottom:4px;\">1. 슬롯 버튼 명칭 (이름 변경)</label>",
                "                    <input type=\"text\" id=\"inpAdminSlotLabel\" class=\"modal-input\" placeholder=\"버튼에 표시될 이름 (예: 찬양 1, 말씀 3 등)\" style=\"width:100%; padding:9px 12px; font-size:14px; font-weight:900; background:#0b1120; color:#ffffff; border:1.5px solid #334155; border-radius:8px; box-sizing:border-box;\">",
                "                </div>",
                "",
                "                <div style=\"margin-bottom:10px;\">",
                "                    <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;\">",
                "                        <label style=\"font-size:12px; font-weight:900; color:#facc15; margin:0;\">2. 유튜브 영상 주소 (새 영상 올리기)</label>",
                "                        <span style=\"font-size:10.5px; color:#94a3b8; font-weight:700;\">* 터치 시 지우지 않고 바로 붙여넣기</span>",
                "                    </div>",
                "                    <div style=\"position:relative; display:flex; align-items:center;\">",
                "                        <input type=\"text\" id=\"inpAdminSlotYtUrl\" class=\"modal-input\" placeholder=\"유튜브 링크를 붙여넣으세요\" onclick=\"handleYtUrlFocusAndPaste(this)\" onfocus=\"this.select()\" style=\"width:100%; padding:9px 75px 9px 12px; font-size:13.5px; font-weight:800; background:#0b1120; color:#64748b; border:1.5px solid #334155; border-radius:8px; box-sizing:border-box; transition:all 0.2s ease;\">",
                "                        <button type=\"button\" onclick=\"pasteClipboardToInput('inpAdminSlotYtUrl')\" style=\"position:absolute; right:6px; background:#1e293b; border:1.2px solid #38bdf8; color:#38bdf8; border-radius:6px; font-size:11px; font-weight:900; padding:4px 8px; cursor:pointer;\">",
                "                            📋 붙여넣기",
                "                        </button>",
                "                    </div>",
                "                </div>",
                "",
                "                <div style=\"margin-bottom:12px;\">",
                "                    <label style=\"font-size:12px; font-weight:800; color:#94a3b8; display:block; margin-bottom:4px;\">3. 영상 제목 (선택 사항)</label>",
                "                    <input type=\"text\" id=\"inpAdminSlotTitle\" class=\"modal-input\" placeholder=\"영상 제목 (비워둘 시 슬롯 명칭 자동 적용)\" style=\"width:100%; padding:8px 12px; font-size:13px; font-weight:800; background:#0b1120; color:#e2e8f0; border:1.2px solid #334155; border-radius:8px; box-sizing:border-box;\">",
                "                </div>",
                "",
                "                <!-- 🌟 [대표님 요청] 자동 밀어내기 저장 버튼 (메인) & 덮어쓰기 버튼 (서브) -->",
                "                <button type=\"button\" id=\"btnAdminSaveShift\" onclick=\"saveAdminSlotWithShift(true)\" style=\"width:100%; padding:13px 8px; background:linear-gradient(135deg, #10b981 0%, #059669 100%); border:none; color:#ffffff; border-radius:10px; font-size:15px; font-weight:950; cursor:pointer; box-shadow:0 3px 12px rgba(16,185,129,0.4); display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:7px;\">",
                "                    <span id=\"btnAdminSaveShiftText\">🚀 선택한 [1번]에 등록 (기존 영상 한 칸씩 아래로 밀어내기)</span>",
                "                </button>",
                "                <button type=\"button\" onclick=\"saveAdminSlotWithShift(false)\" style=\"width:100%; padding:8px; background:#1e293b; border:1px solid #475569; color:#94a3b8; border-radius:8px; font-size:12px; font-weight:800; cursor:pointer;\">",
                "                    ✏️ 밀어내지 않고 현재 슬롯만 단독 수정/덮어쓰기",
                "                </button>"
            };

            lines.RemoveRange(noticeStart, saveBtnEnd - noticeStart + 1);
            lines.InsertRange(noticeStart, replacementModalLines);
            Console.WriteLine("2. Modal HTML replaced successfully!");
        }

        // 3. updateShortsAdminDeleteButtonUI & openAdminUploadModal
        for (int i = 0; i < lines.Count; i++)
        {
            if (lines[i].Contains("function openAdminUploadModal() {"))
            {
                int endIdx = i + 1;
                while (endIdx < lines.Count && lines[endIdx].Trim() != "}")
                {
                    endIdx++;
                }

                List<string> newUploadFn = new List<string>
                {
                    "// 🌟 [사용자 요청] 내가 올리는 영상+ (대표 빨강 버튼: 찬양, 회개, 간증, 말씀, 기도 관리 모달 즉시 실행)",
                    "function openAdminUploadModal() {",
                    "    let targetCh = currentShortsChannelKey || '말씀';",
                    "    if (!fixedChannelsData || !fixedChannelsData[targetCh]) {",
                    "        targetCh = '말씀';",
                    "    }",
                    "    openAdminSlotEditModal(targetCh, 0);",
                    "}"
                };
                lines.RemoveRange(i, endIdx - i + 1);
                lines.InsertRange(i, newUploadFn);
                Console.WriteLine("3. openAdminUploadModal updated at line " + (i + 1));
                break;
            }
        }

        for (int i = 0; i < lines.Count; i++)
        {
            if (lines[i].Contains("function updateShortsAdminDeleteButtonUI() {"))
            {
                int endIdx = i + 1;
                while (endIdx < lines.Count && lines[endIdx].Trim() != "}")
                {
                    endIdx++;
                }

                List<string> newDeleteFn = new List<string>
                {
                    "// 🌟 [사용자 요청] 삭제 및 대표 빨강버튼(영상+)은 나(대표 관리자)만 보이게 처리 (일반 회원은 완전 숨김)",
                    "function updateShortsAdminDeleteButtonUI() {",
                    "    const isMaster = (typeof isMasterAdminUser === 'function') && isMasterAdminUser();",
                    "    const btnDel = document.getElementById('btnShortsAdminDelete');",
                    "    if (btnDel) {",
                    "        btnDel.style.setProperty('display', isMaster ? 'inline-flex' : 'none', 'important');",
                    "    }",
                    "    const btnAdminUpload = document.getElementById('btnShortsAdminUpload');",
                    "    if (btnAdminUpload) {",
                    "        btnAdminUpload.style.setProperty('display', isMaster ? 'inline-flex' : 'none', 'important');",
                    "    }",
                    "}"
                };
                lines.RemoveRange(i, endIdx - i + 1);
                lines.InsertRange(i, newDeleteFn);
                Console.WriteLine("4. updateShortsAdminDeleteButtonUI updated at line " + (i + 1));
                break;
            }
        }

        // 4. openAdminSlotEditModal & JS functions
        for (int i = 0; i < lines.Count; i++)
        {
            if (lines[i].Contains("function openAdminSlotEditModal(chKey, slotIdx) {"))
            {
                // Find where saveAdminSlotSingleVideoExact ends
                int saveSlotEnd = -1;
                for (int j = i; j < lines.Count; j++)
                {
                    if (lines[j].Contains("function saveAdminSlotSingleVideoExact()"))
                    {
                        saveSlotEnd = j + 1;
                        while (saveSlotEnd < lines.Count && lines[saveSlotEnd].Trim() != "}")
                        {
                            saveSlotEnd++;
                        }
                        break;
                    }
                }

                if (saveSlotEnd > 0)
                {
                    List<string> newSlotJs = new List<string>
                    {
                        "function openAdminSlotEditModal(chKey, slotIdx) {",
                        "    if (!fixedChannelsData) loadFixedChannelsData();",
                        "    if (typeof slotIdx !== 'number' || isNaN(slotIdx)) slotIdx = 0;",
                        "    currentEditingSlot = { chKey, slotIdx };",
                        "    const ch = fixedChannelsData[chKey];",
                        "    if (!ch || !ch.slots || !ch.slots[slotIdx]) return;",
                        "    const slot = ch.slots[slotIdx];",
                        "",
                        "    const modal = document.getElementById('adminSlotEditModal');",
                        "    const modalTitle = document.getElementById('adminSlotEditModalHeader');",
                        "    const inpLabel = document.getElementById('inpAdminSlotLabel');",
                        "    const inpUrl = document.getElementById('inpAdminSlotYtUrl');",
                        "    const inpTitle = document.getElementById('inpAdminSlotTitle');",
                        "",
                        "    if (slot.label && slot.label.includes('회개회개')) {",
                        "        slot.label = slot.label.replace(/회개+/g, '회개');",
                        "    }",
                        "    loadedSlotVideoIdx = null;",
                        "    const btnRep = document.getElementById('btnReplaceLoadedSlotVideo');",
                        "    if (btnRep) btnRep.style.display = 'none';",
                        "",
                        "    if (modalTitle) modalTitle.innerText = `[${ch.title}] ${slot.label} 관리`;",
                        "    if (inpLabel) inpLabel.value = slot.label || '';",
                        "    if (inpUrl) { inpUrl.value = slot.videoId ? `https://youtu.be/${slot.videoId}` : ''; inpUrl.style.color = '#64748b'; inpUrl.style.borderColor = '#334155'; }",
                        "    if (inpTitle) inpTitle.value = slot.title || (slot.videos && slot.videos[0] ? slot.videos[0].title : '');",
                        "",
                        "    renderAdminChannelQuickTabs();",
                        "    renderAdminSlotTabs();",
                        "    renderAdminSlotVideosList();",
                        "",
                        "    if (modal) {",
                        "        modal.style.setProperty('display', 'flex', 'important');",
                        "        modal.classList.add('show');",
                        "    }",
                        "}",
                        "",
                        "// 🌟 [대표님 요청] 채널 빠른 전환 탭 5종 (찬양, 회개, 간증, 말씀, 기도)",
                        "function renderAdminChannelQuickTabs() {",
                        "    const box = document.getElementById('adminChannelQuickTabs');",
                        "    if (!box || !currentEditingSlot) return;",
                        "    const channels = [",
                        "        { key: '찬양', label: '🎵 찬양' },",
                        "        { key: '회개', label: '💧 회개' },",
                        "        { key: '간증', label: '✨ 간증' },",
                        "        { key: '말씀', label: '📖 말씀' },",
                        "        { key: '기도', label: '🔥 기도' }",
                        "    ];",
                        "    box.innerHTML = channels.map(c => {",
                        "        const isActive = (c.key === currentEditingSlot.chKey);",
                        "        const bg = isActive ? 'linear-gradient(135deg, #0284c7, #2563eb)' : '#0b1120';",
                        "        const color = isActive ? '#ffffff' : '#94a3b8';",
                        "        const border = isActive ? '2px solid #38bdf8' : '1px solid #334155';",
                        "        const shadow = isActive ? 'box-shadow:0 0 8px rgba(56,189,248,0.6);' : '';",
                        "        return `",
                        "            <button type=\"button\" onclick=\"switchAdminChannelTab('${c.key}')\" style=\"flex:1; padding:7px 3px; background:${bg}; color:${color}; border:${border}; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer; white-space:nowrap; ${shadow} transition:all 0.15s ease;\">",
                        "                ${c.label}",
                        "            </button>",
                        "        `;",
                        "    }).join('');",
                        "}",
                        "",
                        "function switchAdminChannelTab(targetChKey) {",
                        "    if (!fixedChannelsData || !fixedChannelsData[targetChKey]) return;",
                        "    openAdminSlotEditModal(targetChKey, 0);",
                        "}",
                        "",
                        "// 🌟 [대표님 요청] 1, 2, 3 중요도 순위 빠른 선택",
                        "function selectAdminSlotRank(rankIdx) {",
                        "    if (!currentEditingSlot) return;",
                        "    openAdminSlotEditModal(currentEditingSlot.chKey, rankIdx);",
                        "}",
                        "",
                        "// 🌟 [사용자 요청] 12개 슬롯 버튼이 3열 x 4행 바둑판 메뉴로 시원하게 한눈에 펼쳐짐 & 1,2,3번 버튼 동기화",
                        "function renderAdminSlotTabs() {",
                        "    if (!currentEditingSlot) return;",
                        "    const { chKey, slotIdx } = currentEditingSlot;",
                        "    const ch = fixedChannelsData[chKey];",
                        "    if (!ch || !ch.slots) return;",
                        "",
                        "    const tabsBox = document.getElementById('adminSlotTabsContainer');",
                        "    if (tabsBox) {",
                        "        tabsBox.innerHTML = ch.slots.map((s, idx) => {",
                        "            const isActive = (idx === slotIdx);",
                        "            const bg = isActive ? 'linear-gradient(135deg, #0284c7, #2563eb)' : '#1e293b';",
                        "            const color = isActive ? '#ffffff' : '#cbd5e1';",
                        "            const border = isActive ? '2px solid #38bdf8' : '1.2px solid #334155';",
                        "            const shadow = isActive ? 'box-shadow:0 0 10px rgba(56, 189, 248, 0.7);' : '';",
                        "            const fontW = isActive ? '950' : '850';",
                        "            const labelText = (s.label || `${idx + 1}`).trim();",
                        "            return `",
                        "                <button type=\"button\" onclick=\"switchAdminSlotTab(${idx})\" style=\"padding:7px 4px; min-height:42px; background:${bg}; color:${color}; border:${border}; border-radius:8px; font-size:12.5px; font-weight:${fontW}; cursor:pointer; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; ${shadow} transition:all 0.15s ease;\">",
                        "                    <span style=\"display:block; font-size:10px; opacity:0.8; line-height:1;\">${idx + 1}번</span>",
                        "                    <span style=\"display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px;\">${labelText}</span>",
                        "                </button>",
                        "            `;",
                        "        }).join('');",
                        "    }",
                        "",
                        "    const noticeEl = document.getElementById('adminSelectedSlotNotice');",
                        "    if (noticeEl) {",
                        "        noticeEl.innerText = `선택: ${slotIdx + 1}번 [${ch.slots[slotIdx].label || `${slotIdx + 1}`}]`;",
                        "    }",
                        "",
                        "    // 1, 2, 3번 순위 버튼 스타일 동적 갱신",
                        "    const rankBadge = document.getElementById('adminRankSelectionBadge');",
                        "    const saveShiftText = document.getElementById('btnAdminSaveShiftText');",
                        "    const r1 = document.getElementById('btnAdminRank1');",
                        "    const r2 = document.getElementById('btnAdminRank2');",
                        "    const r3 = document.getElementById('btnAdminRank3');",
                        "",
                        "    const activeRankStyle = 'background:linear-gradient(135deg, #0284c7, #2563eb); color:#fff; border:2px solid #38bdf8; box-shadow:0 0 10px rgba(56,189,248,0.7); font-weight:950;';",
                        "    const inactiveRankStyle = 'background:#0b1120; color:#cbd5e1; border:1.2px solid #334155; box-shadow:none; font-weight:900;';",
                        "",
                        "    if (r1) r1.style.cssText = `padding:9px 4px; border-radius:10px; font-size:13.5px; cursor:pointer; transition:all 0.15s ease; ${slotIdx === 0 ? activeRankStyle : inactiveRankStyle}`;",
                        "    if (r2) r2.style.cssText = `padding:9px 4px; border-radius:10px; font-size:13.5px; cursor:pointer; transition:all 0.15s ease; ${slotIdx === 1 ? activeRankStyle : inactiveRankStyle}`;",
                        "    if (r3) r3.style.cssText = `padding:9px 4px; border-radius:10px; font-size:13.5px; cursor:pointer; transition:all 0.15s ease; ${slotIdx === 2 ? activeRankStyle : inactiveRankStyle}`;",
                        "",
                        "    if (slotIdx === 0) {",
                        "        if (rankBadge) rankBadge.innerText = '1번 선택 (기존 영상 2번, 3번으로 밀려남)';",
                        "        if (saveShiftText) saveShiftText.innerText = '🚀 선택한 [1번]에 등록 (기존 1번은 2번으로, 2번은 3번으로 밀려남)';",
                        "    } else if (slotIdx === 1) {",
                        "        if (rankBadge) rankBadge.innerText = '2번 선택 (기존 2번이 3번으로 밀려남)';",
                        "        if (saveShiftText) saveShiftText.innerText = '🚀 선택한 [2번]에 등록 (1번 유지, 기존 2번은 3번으로 밀려남)';",
                        "    } else if (slotIdx === 2) {",
                        "        if (rankBadge) rankBadge.innerText = '3번 선택 (기존 3번이 4번으로 밀려남)';",
                        "        if (saveShiftText) saveShiftText.innerText = '🚀 선택한 [3번]에 등록 (1·2번 유지, 기존 3번은 4번으로 밀려남)';",
                        "    } else {",
                        "        if (rankBadge) rankBadge.innerText = `${slotIdx + 1}번 선택`;",
                        "        if (saveShiftText) saveShiftText.innerText = `🚀 선택한 [${slotIdx + 1}번]에 등록 (아래 영상 밀어내기)`;",
                        "    }",
                        "}",
                        "",
                        "// 🌟 [대표님 요청 핵심] 1, 2, 3번 밀어내기 저장 로직 (1번을 바꾸면 2번으로 내려가고, 2번을 바꾸면 3으로 내려감)",
                        "function saveAdminSlotWithShift(isShift) {",
                        "    if (!currentEditingSlot) return;",
                        "    const { chKey, slotIdx } = currentEditingSlot;",
                        "    const ch = fixedChannelsData[chKey];",
                        "    if (!ch || !ch.slots || !ch.slots[slotIdx]) return;",
                        "",
                        "    const inpLabel = document.getElementById('inpAdminSlotLabel');",
                        "    const inpUrl = document.getElementById('inpAdminSlotYtUrl');",
                        "    const inpTitle = document.getElementById('inpAdminSlotTitle');",
                        "",
                        "    const rawUrl = inpUrl ? inpUrl.value.trim() : '';",
                        "    if (!rawUrl && !ch.slots[slotIdx].videoId) {",
                        "        alert('유튜브 영상 주소를 입력해 주세요.');",
                        "        return;",
                        "    }",
                        "",
                        "    const vid = rawUrl ? ((typeof extractYouTubeVideoId === 'function') ? extractYouTubeVideoId(rawUrl) : rawUrl) : ch.slots[slotIdx].videoId;",
                        "    const newLabel = (inpLabel ? inpLabel.value.trim() : '') || `${chKey} ${slotIdx + 1}`;",
                        "    const newTitle = (inpTitle ? inpTitle.value.trim() : '') || newLabel;",
                        "",
                        "    if (isShift) {",
                        "        // 🌟 [사용자 요청] 기존 슬롯들을 한 칸씩 아래로 순차 밀어내기!",
                        "        for (let i = ch.slots.length - 1; i > slotIdx; i--) {",
                        "            const prev = ch.slots[i - 1];",
                        "            ch.slots[i].label = prev.label;",
                        "            ch.slots[i].title = prev.title;",
                        "            ch.slots[i].videoId = prev.videoId;",
                        "            ch.slots[i].videos = prev.videos ? JSON.parse(JSON.stringify(prev.videos)) : (prev.videoId ? [{ videoId: prev.videoId, title: prev.title }] : []);",
                        "        }",
                        "        // 타겟 슬롯에 새 영상 안착",
                        "        ch.slots[slotIdx].label = newLabel;",
                        "        ch.slots[slotIdx].title = newTitle;",
                        "        ch.slots[slotIdx].videoId = vid;",
                        "        ch.slots[slotIdx].videos = [{",
                        "            videoId: vid,",
                        "            title: newTitle,",
                        "            addedAt: new Date().toISOString()",
                        "        }];",
                        "    } else {",
                        "        // 단독 수정 (덮어쓰기)",
                        "        ch.slots[slotIdx].label = newLabel;",
                        "        ch.slots[slotIdx].title = newTitle;",
                        "        ch.slots[slotIdx].videoId = vid;",
                        "        ch.slots[slotIdx].videos = [{",
                        "            videoId: vid,",
                        "            title: newTitle,",
                        "            addedAt: new Date().toISOString()",
                        "        }];",
                        "    }",
                        "",
                        "    // 슬롯 ID 재정리",
                        "    ch.slots.forEach((s, idx) => { s.id = idx + 1; });",
                        "",
                        "    saveFixedChannelsToStorageAndCloud();",
                        "    renderAdminSlotTabs();",
                        "    buildShortsFeedList();",
                        "    renderCategoryListView();",
                        "",
                        "    const desc = isShift ? `[${ch.title}] ${slotIdx + 1}번에 새 영상이 등록되었으며, 기존 영상들이 한 칸씩 아래로 밀려났습니다!` : `[${ch.title}] ${slotIdx + 1}번 슬롯이 단독 수정되었습니다!`;",
                        "    showToast(`🎉 ${desc}`);",
                        "    closeAdminSlotEditModal();",
                        "}",
                        "",
                        "function saveAdminSlotSingleVideoExact() {",
                        "    saveAdminSlotWithShift(true);",
                        "}"
                    };

                    lines.RemoveRange(i, saveSlotEnd - i + 1);
                    lines.InsertRange(i, newSlotJs);
                    Console.WriteLine("5. Slot JS functions updated at line " + (i + 1));
                    break;
                }
            }
        }

        File.WriteAllLines(filePath, lines, Encoding.UTF8);

        // 5. Sync to all target files
        string[] targets = new string[]
        {
            @"app\src\main\assets\yetalktv.html",
            @"docs\yetalktv.html",
            @"docs\assets\yetalktv.html",
            @"app\yetalktv.html"
        };

        foreach (var t in targets)
        {
            if (File.Exists(t))
            {
                File.Copy(filePath, t, true);
                Console.WriteLine("Synced to: " + t);
            }
        }
    }
}
