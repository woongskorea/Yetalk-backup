let isListView = true;
let isManagerOn = false;
let allPosts = [];
let filteredPosts = [];
let currentPostIndex = 0;
let currentCategory = "all";
let currentWorshipTab = "주일예배";
let selectedFileObj = null;

const dailyGoldVerses = [
    { text: "내가 너로 큰 민족을 이루고 네게 복을 주어 네 이름을 창대하게 하리니 너는 복이 될지라", ref: "창세기 12:2" },
    { text: "여호와는 네게 복을 주시고 너를 지키시기를 원하며", ref: "민수기 6:24" },
    { text: "네 하나님 여호와의 말씀을 청종하면 이 모든 복이 네게 임하며", ref: "신명기 28:2" },
    { text: "네 광주리와 떡 반죽 그릇이 복을 받을 것이며", ref: "신명기 28:5" },
    { text: "이스라엘이여 너는 행복한 사람이로다 여호와의 구원을 너 같이 얻은 백성이 누구냐", ref: "신명기 33:29" },
    { text: "복 있는 사람은 악인들의 꾀를 따르지 아니하며 죄인들의 길에 서지 아니하며", ref: "시편 1:1" },
    { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" },
    { text: "내 평생에 선하심과 인자하심이 반드시 나를 따르리니 내가 여호와의 집에 영원히 살리로다", ref: "시편 23:6" },
    { text: "만군의 여호와여 주께 의지하는 자는 복이 있나이다", ref: "시편 84:12" },
    { text: "여호와께서 주시는 복은 사람을 부하게 하고 근심을 겸하여 주지 아니하시느니라", ref: "잠언 10:22" },
    { text: "너의 행사를 여호와께 맡기라 그리하면 네가 경영하는 것이 이루어지리라", ref: "잠언 16:3" },
    { text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라", ref: "이사야 41:10" }
];

const categories = [
    { id: "all", name: "전체자료" },
    { id: "bulletin", name: "주보" },
    { id: "sermon", name: "주일설교" },
    { id: "cell", name: "마을 나눔지" },
    { id: "notice", name: "교회공지" },
    { id: "praise", name: "찬양자료" },
    { id: "worshipVideo", name: "예배영상" },
    { id: "mission", name: "선교소식" },
    { id: "education", name: "교육자료" },
    { id: "event", name: "행사사진" }
];

const worshipTabs = ["주일예배", "수요예배", "금요예배", "새벽예배", "특별예배", "다음세대예배"];

document.addEventListener("DOMContentLoaded", () => {
    initDynamicChurchName();
    initAdminState();
    renderTabs("all");
    initEditorSelect();
    loadGoldboxPostsFromFirebase(); // 파이어베이스 데이터 연동 로직 호출

    const photoInput = document.getElementById("photoInput");
    if (photoInput) {
        photoInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                selectedFileObj = e.target.files[0];
                document.getElementById("attachPreview").innerText = "📷 " + selectedFileObj.name;
            }
        });
    }
});

function initDynamicChurchName() {
    const name = localStorage.getItem("yetalkMyChurchName") || localStorage.getItem("currentChurchName") || "우리 교회";
    document.getElementById("churchNameText").innerText = name;
}

function initAdminState() {
    isManagerOn = localStorage.getItem("yetalk_chat_admin_on") === "true";
    const btn = document.getElementById("adminStateBtn");
    if (btn) {
        btn.textContent = isManagerOn ? "관리자 ON" : "관리자 OFF";
        btn.style.background = isManagerOn ? "#dc2626" : "#111827";
    }
}

window.toggleGlobalAdmin = function() {
    const current = localStorage.getItem("yetalk_chat_admin_on") === "true";
    localStorage.setItem("yetalk_chat_admin_on", !current);
    location.reload();
};

function showToast(msg, duration = 2000) {
    const t = document.getElementById("toastMsg");
    if(!t) return;
    t.innerHTML = msg;
    t.style.display = "block";
    setTimeout(() => { t.style.display = "none"; }, duration);
}

window.editGoldboxPost = function(index) { showToast("글 수정 모드로 이동합니다."); };
window.deleteGoldboxPost = function(index) { if(confirm("삭제하시겠습니까?")) showToast("자료가 삭제되었습니다."); };
window.copyGoldboxPost = function(index) { showToast("게시물 내용이 복사되었습니다."); };
window.printGoldboxPost = function() { window.print(); };

window.toggleViewMode = function() {
    isListView = !isListView;
    if(isListView) window.showTabMenu();
    renderPosts();
};

window.hideTabMenu = function() {
    const wrapper = document.getElementById("tabMenuWrapper");
    if(wrapper) wrapper.classList.add("collapsed");
};

window.showTabMenu = function() {
    const wrapper = document.getElementById("tabMenuWrapper");
    if(wrapper) wrapper.classList.remove("collapsed");
    currentPostIndex = 0;
    renderPosts();
    document.getElementById('boardListArea').scrollTop = 0;
};

window.goPrevPost = function() {
    if(currentPostIndex > 0) {
        currentPostIndex--;
        if(currentPostIndex === 0) window.showTabMenu();
        renderPosts();
        document.getElementById('boardListArea').scrollTop = 0;
    }
};

window.goNextPost = function() {
    if(currentPostIndex < filteredPosts.length - 1) {
        currentPostIndex++;
        window.hideTabMenu();
        renderPosts();
        document.getElementById('boardListArea').scrollTop = 0;
    }
};

window.viewSinglePost = function(index) {
    currentPostIndex = index;
    isListView = false;
    if(index > 0) window.hideTabMenu();
    renderPosts();
    document.getElementById('boardListArea').scrollTop = 0;
};

window.openEditor = function() { document.getElementById("fullScreenEditor").classList.remove("hidden"); };
window.closeEditor = function() { document.getElementById("fullScreenEditor").classList.add("hidden"); };

window.selectCategory = function(categoryId) {
    currentCategory = categoryId;
    renderTabs(categoryId);
    currentPostIndex = 0;

    if (categoryId === "worshipVideo" || categoryId === "sermon") {
        isListView = true;
        window.hideTabMenu();
    } else {
        isListView = false;
        window.showTabMenu();
    }
    filterAndRenderPosts();
};

window.selectWorshipSubTab = function(tabName) {
    currentWorshipTab = tabName;
    currentPostIndex = 0;
    isListView = true;
    filterAndRenderPosts();
};

window.scrollTabs = function(direction) {
    const container = document.getElementById("tabMenuContainer");
    if(!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
};

function renderTabs(activeId) {
    const tabContainer = document.getElementById("tabMenuContainer");
    if(!tabContainer) return;
    tabContainer.innerHTML = "";

    let pageDiv = null;
    categories.forEach((cat, index) => {
        if (index % 4 === 0) {
            pageDiv = document.createElement("div");
            pageDiv.className = "menu-page";
            tabContainer.appendChild(pageDiv);
        }
        const btn = document.createElement("button");
        btn.className = `tab-btn ${cat.id === activeId ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.onclick = () => window.selectCategory(cat.id);
        pageDiv.appendChild(btn);
    });
}

function initEditorSelect() {
    const select = document.getElementById("editorCategory");
    if(!select) return;
    select.innerHTML = "";
    categories.forEach(cat => {
        if(cat.id === "all") return;
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = `📁 ` + cat.name;
        select.appendChild(option);
    });
}

function extractYoutubeId(linkOrText) {
    if (!linkOrText) return "";
    const match = linkOrText.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) return match[1];
    if (linkOrText.length === 11 && !linkOrText.includes(" ")) return linkOrText;
    return "";
}

// ⭐ 파이어베이스에서 worshipVideos 데이터를 가져와 보물창고에 실시간 동기화
async function loadGoldboxPostsFromFirebase() {
    const churchId = localStorage.getItem("yetalkMyChurchId") || localStorage.getItem("currentChurchId") || "yetalk-church";

    // 기본 더미 데이터
    let basePosts = [
        { id: 1, title: "11월 1주차 마을 나눔지", content: "이번 주 마을 모임 나눔지입니다.", category: "cell", hasFile: true },
        { id: 2, title: "11월 1주차 주보 안내", content: "이번 주 온라인 주보입니다.", category: "bulletin", hasFile: true }
    ];

    try {
        const { db, collection, getDocs, query, where, orderBy } = await import("../../firebase.js");
        const q = query(collection(db, "worshipVideos"), where("churchId", "==", churchId), orderBy("createdAtMs", "desc"));
        const snapshot = await getDocs(q);

        let firebaseVideos = [];
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            firebaseVideos.push({
                id: docSnap.id,
                title: data.title,
                content: data.content || data.desc || "",
                category: "worshipVideo", // 보물창고 예배영상 카테고리로 자동 매핑
                worshipCategory: data.worshipCategory || "주일예배",
                youtubeId: data.youtubeId,
                hasFile: false
            });
        });

        allPosts = [...firebaseVideos, ...basePosts];
    } catch (e) {
        console.warn("파이어베이스 연동 안내:", e);
        allPosts = basePosts;
    }
    filterAndRenderPosts();
}

function filterAndRenderPosts() {
    if (currentCategory === "all") {
        filteredPosts = allPosts;
    } else if (currentCategory === "worshipVideo") {
        filteredPosts = allPosts.filter(post => post.category === "worshipVideo" && (!post.worshipCategory || post.worshipCategory === currentWorshipTab));
    } else if (currentCategory === "sermon") {
        // 보물창고 주일설교를 누를 때 주일예배 영상들도 함께 묶여서 풍성하게 보이도록 연동
        filteredPosts = allPosts.filter(post => post.category === "sermon" || (post.category === "worshipVideo" && post.worshipCategory === "주일예배"));
    } else {
        filteredPosts = allPosts.filter(post => post.category === currentCategory);
    }
    renderPosts();
}

function renderPosts() {
    const listEl = document.getElementById("boardListArea");
    if(!listEl) return;
    listEl.innerHTML = "";

    const isMenuHidden = document.getElementById("tabMenuWrapper").classList.contains("collapsed");

    if(currentPostIndex === 0 || isListView) {
        const todayIndex = new Date().getDate() - 1;
        const goldVerse = dailyGoldVerses[todayIndex] || dailyGoldVerses[0];

        const goldCard = document.createElement("div");
        goldCard.className = "daily-gold-card";
        goldCard.innerHTML = `
            <div class="gold-title">✨ 오늘의 골드 말씀 <span class="gold-ref">(${goldVerse.ref})</span></div>
            <div class="gold-content">"${goldVerse.text}"</div>
        `;
        listEl.appendChild(goldCard);
    }

    if (currentCategory === "worshipVideo") {
        const subTabBar = document.createElement("div");
        subTabBar.style.cssText = "display: flex; gap: 6px; padding: 12px 16px; overflow-x: auto; background: #fff; border-bottom: 1px solid #e2e8f0; scrollbar-width: none;";

        worshipTabs.forEach(tabName => {
            const isActive = currentWorshipTab === tabName;
            const subBtn = document.createElement("button");
            subBtn.style.cssText = `white-space: nowrap; padding: 10px 16px; font-size: 14px; font-weight: 1000; border-radius: 20px; border: 1px solid ${isActive ? 'var(--primary)' : '#cbd5e1'}; ${isActive ? 'background: var(--primary); color: #fff;' : 'background: #f1f5f9; color: #475569;'}`;
            subBtn.textContent = tabName;
            subBtn.onclick = () => selectWorshipSubTab(tabName);
            subTabBar.appendChild(subBtn);
        });
        listEl.appendChild(subTabBar);
    }

    if (filteredPosts.length === 0) {
        const emptyBox = document.createElement("div");
        emptyBox.style.cssText = "text-align:center; padding: 60px 20px; color:#64748b; font-size:16px; font-weight:1000;";
        emptyBox.innerHTML = `등록된 자료가 없습니다.<br><span style="font-size:13px; font-weight:800; color:#94a3b8; margin-top:6px; display:inline-block;">예배영상실에서 새 영상을 등록해 보세요!</span>`;
        listEl.appendChild(emptyBox);
        return;
    }

    if (isListView) {
        const listHeader = document.createElement("div");
        listHeader.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding: 14px 16px; background:#fff; border-bottom:1px solid #e2e8f0;";

        let headerTitle = categories.find(c => c.id === currentCategory)?.name || "전체자료";
        if (currentCategory === "worshipVideo") {
            headerTitle = `예배영상 > ${currentWorshipTab}`;
        }

        listHeader.innerHTML = `
            <span style="font-size: 17px; font-weight: 1000; color: var(--primary);">📂 ${headerTitle} 목록 (최신 4개 미리보기)</span>
            <div style="display:flex; gap: 8px;">
                <button class="attach-sm-btn" style="display:${isMenuHidden ? 'flex' : 'none'}; color: var(--primary); border-color: var(--primary); background: #fff; font-weight:1000;" onclick="showTabMenu()">📂 메뉴 보기</button>
            </div>
        `;
        listEl.appendChild(listHeader);

        // ⭐ 원장님 요청: 리스트로 4개 정도씩 깔끔하게 미리보기 나열
        const previewList = filteredPosts.slice(0, 4);
        previewList.forEach((post, index) => {
            let catName = categories.find(c => c.id === post.category)?.name || "교회공지";
            if(post.category === "worshipVideo" && post.worshipCategory) {
                catName = post.worshipCategory;
            }
            const article = document.createElement("article");
            article.className = "feed-list-item";
            article.onclick = () => window.viewSinglePost(index);
            article.innerHTML = `
                <span class="feed-category" style="font-size:12px; font-weight:1000; padding:4px 8px;">${catName}</span>
                <h3 class="feed-title" style="font-size: 16px; font-weight: 1000; color: #0f172a;">${post.title}</h3>
                <span style="color:var(--primary); font-size:22px; font-weight:1000;">›</span>
            `;
            listEl.appendChild(article);
        });
    } else {
        const post = filteredPosts[currentPostIndex];
        let catName = categories.find(c => c.id === post.category)?.name || "교회공지";
        if(post.category === "worshipVideo" && post.worshipCategory) {
            catName = `예배영상 > ${post.worshipCategory}`;
        }

        let youtubePlayerHTML = "";
        const ytId = post.youtubeId || extractYoutubeId(post.content);
        if (ytId) {
            youtubePlayerHTML = `
                <div style="position: relative; width: 100%; padding-bottom: 56.25%; background: #000; border-radius: 12px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <iframe src="https://www.youtube.com/embed/${ytId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            `;
        }

        const article = document.createElement("article");
        article.className = "feed-post";
        article.innerHTML = `
            <div class="feed-header">
                <span class="feed-category" style="font-size: 13px; font-weight: 1000; padding: 4px 10px;">${catName}</span>
                <span style="font-size: 13px; font-weight: 900; color: #64748b;">${currentPostIndex + 1} / ${filteredPosts.length}</span>
            </div>
            <h3 class="feed-title" style="font-size: 21px; font-weight: 1000;">${post.title}</h3>
            ${youtubePlayerHTML}
            <div class="feed-content" style="font-size: 16.5px; font-weight: 900;">${post.content}</div>
            <div class="attachment-buttons-wrap">
                <button class="attach-sm-btn" style="color: var(--primary); border-color: var(--primary); background: #fff; font-weight: 1000;" onclick="toggleViewMode()">📄 리스트로 돌아가기</button>
            </div>
        `;
        listEl.appendChild(article);
    }
}

window.submitPost = function() {
    alert("자료가 등록되었습니다!");
    document.getElementById("editorMessageInput").value = "";
    document.getElementById("attachPreview").innerText = "";
    selectedFileObj = null;
    closeEditor();
};