// Test if null or string in members causes error
let members = [null, { nameOrId: "최베드로" }];
try {
    members.sort((a, b) => {
        return (a.nameOrId || '').localeCompare(b.nameOrId || '', 'ko');
    });
    console.log("Sort passed");
} catch(e) {
    console.log("CRASH CAUGHT:", e.message);
}
