/*==================================================
YETALK CHURCHMAIN.JS
예톡 교회홈 (숏폼 스냅 & 애드몹 안전 규격 연동)
==================================================*/

const MENU_DEFINITIONS = [
    { id: 0, cat: "교회의꿈", link: "churchintro.html" },
    { id: 1, cat: "예배", link: "churchworship.html" },
    { id: 2, cat: "주보", link: "churchjubo.html" },
    { id: 3, cat: "공지알림", link: "churchnotice.html" },
    { id: 4, cat: "기도모임", link: "churchpray.html" },
    { id: 5, cat: "교회초청", link: "churchinvite.html" },
    { id: 6, cat: "예수동행", link: "churchjesuswalking.html" },
    { id: 7, cat: "보배성도", link: "churchmember.html" },
    { id: 8, cat: "다음세대", link: "churchnextgen.html" },
    { id: 9, cat: "선교전도", link: "churchmission.html" },
    { id: 10, cat: "보물창고", link: "churcharchive.html" }
];

const SHARED_WORSHIP_KEY = "yetalk_church_worship_v31";
const WORSHIP_SLIDE_KEYS = ["sunday", "wednesday", "friday", "dawn", "special", "praise"];

const DEFAULT_SHARED_WORSHIP = {
    sunday: { tabName: "주일예배", title: "주일 대예배 실황", verse: "“신령과 진정으로 드리는 예배”", body: "주일 오전 11시 본당 생중계 및 설교 말씀", timeBadge: "주일 11:00", meta: "요한복음 3장 16절 ~ 18절 · 담임목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=90" },
    wednesday: { tabName: "수요예배", title: "수요 성경강해", verse: "“주의 말씀은 내 발의 등이요”", body: "수요일 저녁 7시 30분 말씀 강해", timeBadge: "수요일 19:30", meta: "창세기 12장 1절 ~ 4절 · 담임목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1507842229452-772d1c9ab458?auto=format&fit=crop&w=1600&q=90" },
    friday: { tabName: "금요예배", title: "금요 성령기도회", verse: "“너는 내게 부르짖으라”", body: "금요일 밤 9시 뜨거운 찬양과 기도회", timeBadge: "금요일 21:00", meta: "사도행전 1장 8절 · 담임목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1600&q=90" },
    dawn: { tabName: "새벽기도회", title: "오늘 새벽기도회", verse: "“새벽을 깨우리로다”", body: "매일 새벽 5시 30분 하루를 여는 은혜의 말씀", timeBadge: "새벽 05:30", meta: "시편 23편 1절 ~ 6절 · 교구목사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1600&q=90" },
    special: { tabName: "특별예배", title: "부흥 및 헌신예배", verse: "“내 잔이 넘치나이다”", body: "교회 창립기념 및 절기 특별 부흥성회", timeBadge: "특별 일정", meta: "에베소서 4장 11절 ~ 16절 · 초청강사", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=90" },
    praise: { tabName: "찬양모음", title: "은혜로운 찬양과 경배", verse: "“호흡이 있는 자마다 여호와를 찬양할지어다”", body: "주일 찬양대 및 찬양팀 은혜 찬양 모음", timeBadge: "상시 재생", meta: "할렐루야 찬양대 및 찬양팀", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=90" }
};

function createDefaultSlides(catName, isWorship = false) {
    if (isWorship) {
        let shared = getSharedWorshipData();
        return WORSHIP_SLIDE_KEYS.map(k => shared[k]);
    }
    return [
        { title: `${catName} 1: 은혜의 비전`, verse: "“오직 여호와를 앙망하는 자는 새 힘을 얻으리니”", body: "하나님의 거룩한 임재와 은혜가 머무는 공동체입니다.", yt: "", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=90" },
        { title: `${catName} 2: 믿음의 동행`, verse: "“믿음은 바라는 것들의 실상이요”", body: "날마다 말씀으로 세상을 이기는 믿음의 사람입니다.", yt: "", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=90" },
        { title: `${catName} 3: 사랑과 섬김`, verse: "“서로 사랑하라 내가 너희를 사랑한 것 같이”", body: "이웃을 섬기며 그리스도의 사랑을 흘려보냅니다.", yt: "", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=90" }
    ];
}

function getSharedWorshipData() {
    const saved = localStorage.getItem(SHARED_WORSHIP_KEY);
    if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
    }
    localStorage.setItem(SHARED_WORSHIP_KEY, JSON.stringify(DEFAULT_SHARED_WORSHIP));
    return JSON.parse(JSON.stringify(DEFAULT_SHARED_WORSHIP));
}

let churchSlideData = {};
let currentSlideIndices = {};
let activeSecId = 0;
let tempEditImgBase64 = "";
let isScreenLocked = false;

function initChurchData() {
    let saved = localStorage.getItem("yetalk_church_main_other_slides_v31");
    if (saved) {
        try {
            saved = saved.replace(/photo-1544717305-2782549b5136/g, 'photo-1519681393784-d120267933ba');
            churchSlideData = JSON.parse(saved);
        } catch(e) {}
    }

    MENU_DEFINITIONS.forEach(m => {
        if (m.id === 1) {
            const shared = getSharedWorshipData();
            churchSlideData[1] = WORSHIP_SLIDE_KEYS.map(k => shared[k]);
        } else if (!churchSlideData[m.id]) {
            churchSlideData[m.id] = createDefaultSlides(m.cat, false);
        }
        currentSlideIndices[m.id] = 0;
    });

    renderChurchView();
    setupSectionObserver();

    // 4회 시간대별 10자 이내 성구 배너 설정
    const pill = document.getElementById("subbarVersePill");
    if (pill) pill.innerText = getActiveShortVerse();

    // 세부 페이지에서 뒤로가기 시 원래 카드 위치로 복귀
    const savedCardIdx = sessionStorage.getItem("church_last_active_card_idx");
    if (savedCardIdx !== null && savedCardIdx !== undefined) {
        const targetIdx = parseInt(savedCardIdx, 10);
        if (!isNaN(targetIdx) && targetIdx >= 0 && targetIdx < MENU_DEFINITIONS.length) {
            setTimeout(() => {
                scrollToCard(targetIdx);
            }, 120);
        }
    }
}

function extractYoutubeVideoId(url) {
    if (!url) return null;
    let videoId = null;
    if (url.includes("youtube.com/live/")) videoId = url.split("youtube.com/live/")[1].split("?")[0].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0].split("&")[0];
    else if (url.includes("shorts/")) videoId = url.split("shorts/")[1].split("?")[0].split("&")[0];
    else if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    return videoId ? videoId.trim() : null;
}

function goToDetailPage(secId, targetLink) {
    sessionStorage.setItem("church_last_active_card_idx", secId.toString());
    location.href = targetLink;
}

const FOUR_TIMES_SHORT_VERSES = {
    morning: "🌅 주의 인자하심 들으라", // 10자
    noon: "☀️ 여호와를 앙망하라",     // 9자
    evening: "🌆 평안을 너희에게",     // 9자
    night: "🌙 주 날개 아래 평안"      // 10자
};

function getActiveShortVerse() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return FOUR_TIMES_SHORT_VERSES.morning;
    if (hour >= 11 && hour < 17) return FOUR_TIMES_SHORT_VERSES.noon;
    if (hour >= 17 && hour < 22) return FOUR_TIMES_SHORT_VERSES.evening;
    return FOUR_TIMES_SHORT_VERSES.night;
}

const FOUR_TIMES_WORDS = {
    morning: { tag: "🌅 오늘 아침 말씀", text: "“아침에 나로 하여금 주의 인자한 말씀을 듣게 하소서 (시 143:8)”" },
    noon: { tag: "☀️ 한낮의 말씀", text: "“오직 여호와를 앙망하는 자는 새 힘을 얻으리니 (사 40:31)”" },
    evening: { tag: "🌆 저녁의 말씀", text: "“평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 (요 14:27)”" },
    night: { tag: "🌙 안식의 말씀", text: "“내가 평안히 눕고 자기도 하리니 나를 안전히 살게 하시는 이는 오직 여호와이시니이다 (시 4:8)”" }
};

function getActiveWord() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return FOUR_TIMES_WORDS.morning;
    if (hour >= 11 && hour < 17) return FOUR_TIMES_WORDS.noon;
    if (hour >= 17 && hour < 22) return FOUR_TIMES_WORDS.evening;
    return FOUR_TIMES_WORDS.night;
}

function renderChurchView() {
    const vp = document.getElementById("churchViewport");
    const guard = document.getElementById("touchGuardShield");
    vp.innerHTML = "";
    if (guard) vp.appendChild(guard);

    MENU_DEFINITIONS.forEach(sec => {
        const card = document.createElement("section");
        card.className = "snap-card-section";
        card.id = `section_card_${sec.id}`;
        card.dataset.index = sec.id;

        card.onclick = (e) => {
            if (e.target.closest('.slide-arrow-btn') || e.target.closest('.worship-yt-middle-container')) return;
            goToDetailPage(sec.id, sec.link);
        };

        const slides = churchSlideData[sec.id] || createDefaultSlides(sec.cat, sec.id === 1);
        const cur = slides[0];

        card.innerHTML = `
            <img class="card-bg-img" id="slide_img_${sec.id}" src="${cur.img}" alt="${sec.cat}">
            <div class="card-gradient-overlay"></div>

            <div class="worship-yt-middle-container ${sec.id === 1 ? 'active' : ''}" id="ytContainer_${sec.id}">
                <div class="worship-yt-player-box" id="ytBox_${sec.id}"></div>
            </div>

            <button type="button" class="slide-arrow-btn slide-arrow-left" onclick="event.stopPropagation(); changeCardSlide(${sec.id}, -1)">‹</button>
            <button type="button" class="slide-arrow-btn slide-arrow-right" onclick="event.stopPropagation(); changeCardSlide(${sec.id}, 1)">›</button>

            <div class="card-top-content">
                <span class="card-category-badge">${sec.cat}</span>
                <h2 class="card-title-main" id="slide_title_${sec.id}">${cur.title}</h2>
            </div>

            <div class="card-bottom-content">
                <div class="card-verse-highlight" id="slide_verse_${sec.id}">${cur.verse}</div>
                <div class="card-body-text" id="slide_body_${sec.id}">${cur.body}</div>
                <div class="card-bottom-guide-row">
                    <span class="card-click-guide">화면을 클릭하세요 👉</span>
                </div>
            </div>

            <div class="slide-dots" id="dots_${sec.id}">
                ${slides.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
            </div>
        `;
        vp.appendChild(card);
    });

    // 엔딩 카드
    const activeWord = getActiveWord();
    const footerCard = document.createElement("section");
    footerCard.className = "final-footer-snap-card";
    footerCard.id = `section_card_11`;
    footerCard.dataset.index = 11;
    footerCard.innerHTML = `
        <div style="font-size:12.5px; font-weight:900; color:#38bdf8; margin-bottom:4px;">🤝 섬김과 미디어 사역 후원 공간</div>
        <div class="admob-mrec-box">
            <span style="font-size:24px;">🎁</span>
            <strong style="font-size:13.5px; color:#facc15;">Google AdMob (300x250)</strong>
            <span style="font-size:10px; color:#e2e8f0;">지역 맞춤형 공식 스폰서 배너</span>
        </div>

        <div class="scripture-verse-card">
            <div style="font-size:11px; font-weight:900; color:#facc15; margin-bottom:3px;">${activeWord.tag}</div>
            <div style="font-family:'Nanum Myeongjo', serif; font-size:12px; line-height:1.5; color:#ffffff;">${activeWord.text}</div>
        </div>

        <button type="button" class="btn-top-return" onclick="scrollToCard(0)">
            ⌃ 제일 위로 가기
        </button>
    `;
    vp.appendChild(footerCard);

    updateSlideContent(1, 0);
}

function changeCardSlide(secId, dir) {
    const slides = churchSlideData[secId];
    let idx = (currentSlideIndices[secId] || 0) + dir;
    if (idx >= slides.length) idx = 0;
    if (idx < 0) idx = slides.length - 1;
    currentSlideIndices[secId] = idx;
    updateSlideContent(secId, idx);
}

function updateSlideContent(secId, idx) {
    const cur = churchSlideData[secId][idx];
    const imgEl = document.getElementById(`slide_img_${secId}`);
    const titleEl = document.getElementById(`slide_title_${secId}`);
    const verseEl = document.getElementById(`slide_verse_${secId}`);
    const bodyEl = document.getElementById(`slide_body_${secId}`);
    const dotsEl = document.getElementById(`dots_${secId}`);
    const ytBox = document.getElementById(`ytBox_${secId}`);
    const ytContainer = document.getElementById(`ytContainer_${secId}`);

    if (imgEl && cur.img) imgEl.src = cur.img;
    if (titleEl) titleEl.innerText = cur.title;
    if (verseEl) verseEl.innerText = cur.verse;
    if (bodyEl) bodyEl.innerText = cur.body;

    if (dotsEl) {
        dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === idx));
    }

    if (secId === 1 && cur.yt) {
        const ytId = extractYoutubeVideoId(cur.yt);
        if (ytId && ytBox) {
            if (ytContainer) ytContainer.classList.add("active");
            ytBox.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${ytId}?autoplay=0&controls=1&enablejsapi=1"
                        allow="autoplay; encrypted-media" allowfullscreen="true"></iframe>
            `;
        } else if (ytBox) {
            if (ytContainer) ytContainer.classList.remove("active");
            ytBox.innerHTML = "";
        }
    }
}

function setupSectionObserver() {
    const sections = document.querySelectorAll(".snap-card-section, .final-footer-snap-card");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = parseInt(entry.target.dataset.index, 10);
                if (!isNaN(idx)) {
                    activeSecId = idx;
                    updateChipsBar(idx);
                }
            }
        });
    }, { root: document.getElementById("churchViewport"), threshold: 0.55 });
    sections.forEach(sec => observer.observe(sec));

    const vp = document.getElementById("churchViewport");
    if (vp) {
        let scrollTimer = null;
        vp.addEventListener("scroll", () => {
            if (scrollTimer) cancelAnimationFrame(scrollTimer);
            scrollTimer = requestAnimationFrame(() => {
                const top = vp.scrollTop;
                const h = vp.clientHeight || 1;
                const idx = Math.round(top / h);
                if (idx >= 0 && idx < MENU_DEFINITIONS.length && idx !== activeSecId) {
                    activeSecId = idx;
                    updateChipsBar(idx);
                }
            });
        }, { passive: true });
    }
}

function updateChipsBar(idx) {
    document.querySelectorAll(".c-nav-chip").forEach((chip, i) => {
        const match = (i === idx);
        chip.classList.toggle("active", match);
        if (match) chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
    const curMenu = MENU_DEFINITIONS[idx];
    const subTitle = document.getElementById("fixedChurchSubbarTitle");
    if (curMenu && subTitle) {
        subTitle.innerText = `${curMenu.cat}`;
    }
}

function scrollToCard(index) {
    activeSecId = index;
    updateChipsBar(index);
    const target = document.getElementById(`section_card_${index}`);
    const vp = document.getElementById("churchViewport");
    if (target && vp) {
        vp.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    } else if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

/* 🌟 화면 고정 ON/OFF (터치 및 다음 영상 밀림 완전 차단) */
function toggleScreenLock() {
    isScreenLocked = !isScreenLocked;
    const btn = document.getElementById("btnToggleLock");
    const guard = document.getElementById("touchGuardShield");
    const viewport = document.getElementById("churchViewport");

    if (isScreenLocked) {
        btn.classList.add("locked");
        btn.innerText = "고정ON";
        if (guard) guard.classList.add("active");
        if (viewport) viewport.classList.add("locked-scroll");
        if (window.AndroidBridge && window.AndroidBridge.setLockKeepAudio) {
            window.AndroidBridge.setLockKeepAudio(true);
        }
        showToast("🔒 화면 보호 ON: 터치 및 스크롤이 차단되어 안전하게 재생됩니다.");
    } else {
        btn.classList.remove("locked");
        btn.innerText = "고정OFF";
        if (guard) guard.classList.remove("active");
        if (viewport) viewport.classList.remove("locked-scroll");
        if (window.AndroidBridge && window.AndroidBridge.setLockKeepAudio) {
            window.AndroidBridge.setLockKeepAudio(false);
        }
        showToast("🔓 화면 보호가 해제되었습니다.");
    }
}

function showLockedAlert() {
    showToast("🔒 화면 고정 중입니다. 상단 [고정ON] 버튼을 탭하세요.");
}

function handleBottomNav(type) {
    switch(type) {
        case 'gospel': location.href = "church_gospel.html"; break;
        case 'map': location.href = "church_map.html"; break;
        case 'offering': openChurchOfferingModal(); break;
        case 'tv': location.href = "index.html"; break;
        case 'coupang': runFastCoupangModal(); break;
    }
}

function openChurchOfferingModal() {
    document.getElementById("churchGiverName").value = localStorage.getItem("yetalkUserName") || "김예톡";
    document.getElementById("churchGiverBank").value = localStorage.getItem("yetalkGiverBank") || "국민은행";
    document.getElementById("churchGiverAcc").value = localStorage.getItem("yetalkGiverAcc") || "";

    document.getElementById("churchReceiverName").value = localStorage.getItem("yetalkChurchName") || "예톡행복한교회";
    document.getElementById("churchReceiverBank").value = localStorage.getItem("yetalkChurchBank") || "농협";
    document.getElementById("churchReceiverAcc").value = localStorage.getItem("yetalkChurchAcc") || "302-1234-5678-91";
    document.getElementById("churchReceiverHolder").value = localStorage.getItem("yetalkChurchHolder") || "예톡행복한교회";
    openModal("churchOfferingModal");
}

function saveGiverInfo() {
    localStorage.setItem("yetalkUserName", document.getElementById("churchGiverName").value.trim());
    localStorage.setItem("yetalkGiverBank", document.getElementById("churchGiverBank").value);
    localStorage.setItem("yetalkGiverAcc", document.getElementById("churchGiverAcc").value.trim());
    showToast("✨ 출금 정보가 저장되었습니다!");
}

function saveChurchReceiverInfo() {
    localStorage.setItem("yetalkChurchName", document.getElementById("churchReceiverName").value.trim());
    localStorage.setItem("yetalkChurchBank", document.getElementById("churchReceiverBank").value.trim());
    localStorage.setItem("yetalkChurchAcc", document.getElementById("churchReceiverAcc").value.trim());
    localStorage.setItem("yetalkChurchHolder", document.getElementById("churchReceiverHolder").value.trim());
    showToast("✨ 교회 계좌 정보가 저장되었습니다!");
}

function submitChurchOffering() {
    const cName = document.getElementById("churchReceiverName").value.trim();
    const acc = document.getElementById("churchReceiverAcc").value.trim();
    const amount = document.getElementById("churchOfferingAmount").value.trim();
    if (!amount || parseInt(amount, 10) <= 0) { showToast("금액을 입력하세요."); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(acc);
    closeModal("churchOfferingModal");
    showToast(`🎉 [${cName}] 계좌로 ${parseInt(amount, 10).toLocaleString()}원 송금 완료!`);
}

function openCurrentSlideEdit() {
    const slideIdx = currentSlideIndices[activeSecId] || 0;
    const cur = churchSlideData[activeSecId][slideIdx];
    const menu = MENU_DEFINITIONS[activeSecId] || MENU_DEFINITIONS[0];

    document.getElementById("modalCardTitleLabel").innerText = `✏️ [${menu.cat}] #${slideIdx + 1} 수정`;
    document.getElementById("inpCardTitle").value = cur.title;
    document.getElementById("inpCardVerse").value = cur.verse;
    document.getElementById("inpCardBody").value = cur.body;
    tempEditImgBase64 = cur.img;
    document.getElementById("prevFirstCardImg").src = tempEditImgBase64;
    openModal("churchMainEditModal");
}

function handleFirstCardFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            let w = img.width, h = img.height;
            if (w > 1600) { h = Math.round((h * 1600) / w); w = 1600; }
            canvas.width = w; canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            tempEditImgBase64 = canvas.toDataURL("image/jpeg", 0.92);
            document.getElementById("prevFirstCardImg").src = tempEditImgBase64;
            showToast("📷 사진 준비 완료. [저장하기]를 누르세요.");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function saveCurrentCardData() {
    const slideIdx = currentSlideIndices[activeSecId] || 0;
    const target = churchSlideData[activeSecId][slideIdx];

    target.title = document.getElementById("inpCardTitle").value.trim();
    target.verse = document.getElementById("inpCardVerse").value.trim();
    target.body = document.getElementById("inpCardBody").value.trim();
    if (tempEditImgBase64) target.img = tempEditImgBase64;

    if (activeSecId === 1) {
        const sharedKey = WORSHIP_SLIDE_KEYS[slideIdx];
        let shared = getSharedWorshipData();
        shared[sharedKey].title = target.title;
        shared[sharedKey].verse = target.verse;
        shared[sharedKey].body = target.body;
        if (tempEditImgBase64) shared[sharedKey].img = tempEditImgBase64;
        localStorage.setItem(SHARED_WORSHIP_KEY, JSON.stringify(shared));
    } else {
        localStorage.setItem("yetalk_church_main_other_slides_v31", JSON.stringify(churchSlideData));
    }

    updateSlideContent(activeSecId, slideIdx);
    closeModal("churchMainEditModal");
    showToast("🎉 수정 내용이 반영되었습니다!");
}

let fastLaunchTimer = null;
function runFastCoupangModal() {
    const modal = document.getElementById('coupangGateModal');
    if (!modal) { openCoupangDirectSafe(); return; }
    modal.classList.add('show');
    if (fastLaunchTimer) clearTimeout(fastLaunchTimer);
    fastLaunchTimer = setTimeout(() => { openCoupangDirectSafe(); }, 1100);
}

function openCoupangDirectSafe() {
    if (window.AndroidBridge && window.AndroidBridge.launchCoupangDirect) {
        window.AndroidBridge.launchCoupangDirect();
    } else {
        window.open("https://www.coupang.com", "_blank");
    }
}

function openModal(id) { document.getElementById(id).classList.add("show"); }
function closeModal(id) { document.getElementById(id).classList.remove("show"); }

function showToast(msg) {
    const t = document.getElementById("yetalkToast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", () => {
    const customChurch = localStorage.getItem("yetalkUserStoreName") || localStorage.getItem("yetalkChurchName");
    if (customChurch) {
        const el = document.getElementById("churchName");
        if (el) el.innerText = customChurch;
    }
    initChurchData();
});