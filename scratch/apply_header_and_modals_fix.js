const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    // 1. Lower header padding from 2px to 28px
    html = html.replace(
        '<header class="app-header" style="display:flex; justify-content:space-between; align-items:center; padding:2px 14px 0 14px; background:#ffffff; border-bottom:none; box-sizing:border-box;">',
        '<header class="app-header" style="display:flex; justify-content:space-between; align-items:center; padding:28px 14px 6px 14px; background:#ffffff; border-bottom:none; box-sizing:border-box;">'
    );

    // 2. Enhance openChristianRegisterModal
    const oldRegModal = `    function openChristianRegisterModal() {
        const inpName = document.getElementById("inpRegNameOrId");`;
    
    const newRegModal = `    function openChristianRegisterModal() {
        const modal = document.getElementById("christianRegisterModal");
        if (modal) { modal.style.display = "flex"; modal.classList.add("show"); }
        const inpName = document.getElementById("inpRegNameOrId");`;

    if (html.includes(oldRegModal)) {
        html = html.replace(oldRegModal, newRegModal);
    }

    // 3. Enhance openChristianFriendsModal to be 100% crash-proof
    const oldFriendsStart = `    // 🌟 [사용자 요청] 초청 누르면 박스 없애고 상단부터 공간 활용 잘해서 밑으로 친구들이 한줄로 아래로 스크롤 되는 전체화면 뷰 및 회원 관리
    function openChristianFriendsModal() {
        const churchName = localStorage.getItem("yetalk_church_name") || "부산제일감리교회";`;

    const newFriendsStart = `    // 🌟 [사용자 요청] 초청 누르면 박스 없애고 상단부터 공간 활용 잘해서 밑으로 친구들이 한줄로 아래로 스크롤 되는 전체화면 뷰 및 회원 관리
    function openChristianFriendsModal() {
        const modal = document.getElementById("christianFriendsModal");
        if (modal) { modal.style.display = "flex"; modal.classList.add("show"); }
        try {
            _renderChristianFriendsModalContent();
        } catch(err) {
            console.error("Error rendering christian friends modal:", err);
        }
    }

    function _renderChristianFriendsModalContent() {
        const churchName = localStorage.getItem("yetalk_church_name") || "부산제일감리교회";`;

    if (html.includes(oldFriendsStart)) {
        html = html.replace(oldFriendsStart, newFriendsStart);
    }

    // Safe member mapping and sort
    const oldMembersSort = `        // 🌟 [사용자 요청] 1순위: 별표 체크된 교우가 최상단 / 2순위: 가나다라 순서(이름 오름차순) 정렬!
        members.sort((a, b) => {
            const aStarred = starredFriends.includes(a.nameOrId);
            const bStarred = starredFriends.includes(b.nameOrId);
            if (aStarred && !bStarred) return -1;
            if (!aStarred && bStarred) return 1;
            return (a.nameOrId || '').localeCompare(b.nameOrId || '', 'ko');
        });`;

    const newMembersSort = `        // 🌟 교우 데이터 정규화 및 null/문자열 안전 필터링
        members = (members || []).map(m => {
            if (!m) return null;
            if (typeof m === 'string') return { nameOrId: m.trim(), role: '성도' };
            const n = (m.nameOrId || m.name || '').trim();
            return n ? { nameOrId: n, role: m.role || '성도' } : null;
        }).filter(Boolean);

        // 🌟 [사용자 요청] 1순위: 별표 체크된 교우가 최상단 / 2순위: 가나다라 순서(이름 오름차순) 정렬!
        members.sort((a, b) => {
            const aName = a ? (a.nameOrId || '') : '';
            const bName = b ? (b.nameOrId || '') : '';
            const aStarred = starredFriends.includes(aName);
            const bStarred = starredFriends.includes(bName);
            if (aStarred && !bStarred) return -1;
            if (!aStarred && bStarred) return 1;
            return aName.localeCompare(bName, 'ko');
        });`;

    if (html.includes(oldMembersSort)) {
        html = html.replace(oldMembersSort, newMembersSort);
    }

    // Bind window functions
    const oldWindowBindings = `    window.changeMealParticipantCount = changeMealParticipantCount;
    window.renderMealParticipantCards = renderMealParticipantCards;
    window.openMealPrayerLotteryModal = openMealPrayerLotteryModal;
    window.closeMealPrayerLotteryModal = closeMealPrayerLotteryModal;
    window.runMealPrayerLottery = runMealPrayerLottery;
    window.resetMealPrayerLottery = resetMealPrayerLottery;
    window.playCelebrationFanfare = playCelebrationFanfare;`;

    const newWindowBindings = `    window.changeMealParticipantCount = changeMealParticipantCount;
    window.renderMealParticipantCards = renderMealParticipantCards;
    window.openMealPrayerLotteryModal = openMealPrayerLotteryModal;
    window.closeMealPrayerLotteryModal = closeMealPrayerLotteryModal;
    window.runMealPrayerLottery = runMealPrayerLottery;
    window.resetMealPrayerLottery = resetMealPrayerLottery;
    window.playCelebrationFanfare = playCelebrationFanfare;

    window.openChristianRegisterModal = openChristianRegisterModal;
    window.closeChristianRegisterModal = closeChristianRegisterModal;
    window.openChristianFriendsModal = openChristianFriendsModal;
    window.closeChristianFriendsModal = closeChristianFriendsModal;
    window.handleChristianNav = handleChristianNav;`;

    if (html.includes(oldWindowBindings)) {
        html = html.replace(oldWindowBindings, newWindowBindings);
    }

    fs.writeFileSync(f, html, 'utf8');
    console.log(`Updated ${f} successfully!`);
}
