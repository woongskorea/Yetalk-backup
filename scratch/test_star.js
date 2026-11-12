let myFriends = [
    { id: "p_01012345678_0", name: "홍길동", phone: "010-1234-5678", starLevel: 0, isFav: false },
    { id: "p_01099998888_1", name: "김철수", phone: "010-9999-8888", starLevel: 1, isFav: true },
    { id: "p_01077776666_2", name: "이영희", phone: "010-7777-6666", starLevel: 2, isFav: true }
];

function setFriendStarLevel(friendId, targetLevel) {
    const f = myFriends.find(item => item.id === friendId);
    if (!f) return "not found";
    const cur = Number(f.starLevel) || (f.isFav ? 1 : 0);
    const next = (cur === targetLevel) ? 0 : targetLevel;
    f.starLevel = next;
    f.isFav = next > 0;
    return { cur, targetLevel, next };
}

console.log("From 0 click 1:", setFriendStarLevel("p_01012345678_0", 1));
console.log("From 1 click 1:", setFriendStarLevel("p_01012345678_0", 1));
console.log("From 0 click 2:", setFriendStarLevel("p_01012345678_0", 2));

function cycleFriendStar(friendId) {
    const f = myFriends.find(item => item.id === friendId);
    if (!f) return "not found";
    const cur = Number(f.starLevel) || (f.isFav ? 1 : 0);
    const next = (cur + 1) % 4;
    f.starLevel = next;
    f.isFav = next > 0;
    return { cur, next };
}

console.log("Cycle from 0:", cycleFriendStar("p_01012345678_0"));
console.log("Cycle from 1:", cycleFriendStar("p_01012345678_0"));
console.log("Cycle from 2:", cycleFriendStar("p_01012345678_0"));
console.log("Cycle from 3:", cycleFriendStar("p_01012345678_0"));
