const fs = require('fs');

const files = [
    'assets/index.html',
    'docs/index.html',
    'app/src/main/assets/index.html'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');

    // 1. Expose _renderChristianFriendsModalContent on window
    html = html.replace(
        'function _renderChristianFriendsModalContent() {',
        'function _renderChristianFriendsModalContent() {\n        window._renderChristianFriendsModalContent = _renderChristianFriendsModalContent;'
    );

    // 2. Enhance _renderChristianFriendsModalContent to include pastor and core fellow members
    const oldFellowshipLogic = `        // 현재 사용자 본인 포함 보장
        const myName = localStorage.getItem("yetalk_user_name") || "최베드로";
        const myRole = localStorage.getItem("yetalk_church_role") || "성도";
        if (members.length === 0) {
            members = [
                { nameOrId: myName, role: myRole },
                { nameOrId: "김요한", role: "성도" },
                { nameOrId: "박에스더", role: "사무사역자" },
                { nameOrId: "이다윗", role: "집사" },
                { nameOrId: "정마리아", role: "권사" }
            ];
        } else if (!members.some(m => m.nameOrId === myName)) {
            members.unshift({ nameOrId: myName, role: myRole });
        }`;

    const newFellowshipLogic = `        // 현재 사용자 본인 포함 보장
        const myName = (localStorage.getItem("yetalk_user_name") || "최베드로").trim();
        const myRole = (localStorage.getItem("yetalk_church_role") || "성도").trim();

        // 🌟 [사용자 요청] 담임목사님(정찬석 목사 등) 및 교우들이 나만 보이지 않고 다 함께 따뜻하게 표출되도록 보장
        const rawPastor = (localStorage.getItem("yetalk_pastor_name") || (churchMap[churchKey] ? churchMap[churchKey].pastor : "") || "정찬석").trim();
        const pastorClean = rawPastor.replace(/(담임)?목사님?/g, '').trim();
        if (pastorClean && !members.some(m => (m.nameOrId || '').includes(pastorClean))) {
            members.unshift({ nameOrId: pastorClean + " 목사", role: "담임목사" });
        }

        // 기본 등록 교우진 (김요한, 박에스더, 이다윗, 정마리아) 함께 포함하여 혼자가 아닌 교우 명단 구성
        const defaultFellowship = [
            { nameOrId: "김요한", role: "성도" },
            { nameOrId: "박에스더", role: "사무사역자" },
            { nameOrId: "이다윗", role: "집사" },
            { nameOrId: "정마리아", role: "권사" }
        ];
        defaultFellowship.forEach(df => {
            if (!members.some(m => m.nameOrId === df.nameOrId)) {
                members.push(df);
            }
        });

        if (!members.some(m => m.nameOrId === myName)) {
            members.unshift({ nameOrId: myName, role: myRole });
        }`;

    if (html.includes(oldFellowshipLogic)) {
        html = html.replace(oldFellowshipLogic, newFellowshipLogic);
        console.log(`Enhanced fellowship logic in ${f}`);
    } else {
        console.warn(`Fellowship logic target not found in ${f}`);
    }

    // 3. In openChristianFriendsModal, trigger cloud sync
    const oldOpenFriends = `    function openChristianFriendsModal() {
        const modal = document.getElementById("christianFriendsModal");
        if (modal) { modal.style.display = "flex"; modal.classList.add("show"); }
        try {
            _renderChristianFriendsModalContent();
        } catch(err) {
            console.error("Error rendering christian friends modal:", err);
        }
    }`;

    const newOpenFriends = `    function openChristianFriendsModal() {
        const modal = document.getElementById("christianFriendsModal");
        if (modal) { modal.style.display = "flex"; modal.classList.add("show"); }
        try {
            _renderChristianFriendsModalContent();
        } catch(err) {
            console.error("Error rendering christian friends modal:", err);
        }
        try {
            const churchName = localStorage.getItem("yetalk_church_name") || "부산제일감리교회";
            const pastorName = localStorage.getItem("yetalk_pastor_name") || "";
            const churchKey = localStorage.getItem("yetalk_church_key") || normalizeChurchKey(churchName, pastorName);
            if (typeof window.syncChurchMembersFromCloud === "function") {
                window.syncChurchMembersFromCloud(churchKey);
            }
        } catch(err) {}
    }`;

    if (html.includes(oldOpenFriends)) {
        html = html.replace(oldOpenFriends, newOpenFriends);
        console.log(`Added cloud sync trigger to openChristianFriendsModal in ${f}`);
    } else {
        console.warn(`openFriends target not found in ${f}`);
    }

    // 4. In submitChristianRegistration, trigger syncMemberToCloud
    const oldRegEnd = `            try {
                localStorage.setItem("yetalk_registered_churches", JSON.stringify(churchMap));
            } catch(e) { console.warn(e); }`;

    const newRegEnd = `            try {
                localStorage.setItem("yetalk_registered_churches", JSON.stringify(churchMap));
            } catch(e) { console.warn(e); }

            // 🌟 클라우드 Firestore 실시간 교우 등록 동기화
            if (typeof window.syncMemberToCloud === "function") {
                window.syncMemberToCloud(churchKey, { nameOrId: nameOrId, role: role, joinedAt: new Date().toLocaleDateString() });
            }`;

    if (html.includes(oldRegEnd)) {
        html = html.replace(oldRegEnd, newRegEnd);
        console.log(`Added cloud sync trigger to submitChristianRegistration in ${f}`);
    } else {
        console.warn(`regEnd target not found in ${f}`);
    }

    // 5. Add Firestore cloud sync functions in module script
    const oldModuleInit = `    window.yetalkDb = db;
    window.yetalkFs = { doc, getDoc, setDoc, onSnapshot, serverTimestamp };
    console.log("Yetalk Index Firebase Firestore module initialized.");`;

    const newModuleInit = `    window.yetalkDb = db;
    window.yetalkFs = { doc, getDoc, setDoc, onSnapshot, serverTimestamp };
    console.log("Yetalk Index Firebase Firestore module initialized.");

    // 🌟 [Firebase Firestore] 전국 교우 실시간 클라우드 동기화 (기기 간 교우 명단 공유)
    async function syncMemberToCloud(churchKey, memberObj) {
        if (!db || !doc || !setDoc || !churchKey || !memberObj) return;
        try {
            const memberDocRef = doc(db, "yetalk_church_members", churchKey);
            const snap = await getDoc(memberDocRef);
            let cloudMembers = [];
            if (snap.exists() && snap.data() && Array.isArray(snap.data().members)) {
                cloudMembers = snap.data().members;
            }
            const existingIdx = cloudMembers.findIndex(m => m.nameOrId === memberObj.nameOrId);
            if (existingIdx >= 0) {
                cloudMembers[existingIdx] = memberObj;
            } else {
                cloudMembers.push(memberObj);
            }
            await setDoc(memberDocRef, {
                churchKey: churchKey,
                churchName: localStorage.getItem("yetalk_church_name") || "",
                updatedAt: new Date().toISOString(),
                members: cloudMembers
            }, { merge: true });
            console.log("[Firestore] Church member synced to cloud:", memberObj.nameOrId);
        } catch(err) {
            console.warn("[Firestore] syncMemberToCloud notice:", err);
        }
    }
    window.syncMemberToCloud = syncMemberToCloud;

    let _churchMemberUnsubscribe = null;
    function syncChurchMembersFromCloud(churchKey) {
        if (!db || !doc || !onSnapshot || !churchKey) return;
        try {
            const memberDocRef = doc(db, "yetalk_church_members", churchKey);
            if (typeof _churchMemberUnsubscribe === "function") {
                _churchMemberUnsubscribe();
            }
            _churchMemberUnsubscribe = onSnapshot(memberDocRef, (snap) => {
                if (snap.exists() && snap.data() && Array.isArray(snap.data().members)) {
                    const cloudList = snap.data().members;
                    if (cloudList.length > 0) {
                        let churchMap = {};
                        try {
                            churchMap = JSON.parse(localStorage.getItem("yetalk_registered_churches") || "{}");
                        } catch(e) { churchMap = {}; }
                        if (!churchMap[churchKey]) churchMap[churchKey] = { members: [] };
                        if (!Array.isArray(churchMap[churchKey].members)) churchMap[churchKey].members = [];
                        
                        cloudList.forEach(cm => {
                            if (!churchMap[churchKey].members.some(m => m.nameOrId === cm.nameOrId)) {
                                churchMap[churchKey].members.push(cm);
                            }
                        });
                        localStorage.setItem("yetalk_registered_churches", JSON.stringify(churchMap));
                        if (typeof window._renderChristianFriendsModalContent === "function") {
                            window._renderChristianFriendsModalContent();
                        }
                    }
                }
            });
        } catch(err) {
            console.warn("[Firestore] syncChurchMembersFromCloud notice:", err);
        }
    }
    window.syncChurchMembersFromCloud = syncChurchMembersFromCloud;`;

    if (html.includes(oldModuleInit)) {
        html = html.replace(oldModuleInit, newModuleInit);
        console.log(`Added cloud sync module functions in ${f}`);
    } else {
        console.warn(`Module init target not found in ${f}`);
    }

    fs.writeFileSync(f, html, 'utf8');
}
