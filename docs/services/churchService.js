/*==================================================
YETALK CHURCH SERVICE

교회 관련 데이터 전담 파일

현재:
- 브라우저 localStorage 사용
- 실제 서비스 구조에 맞춰 함수 분리

추후:
- Firebase Firestore 연결
- 화면 HTML / CSS는 거의 수정하지 않고
  이 파일의 저장 부분을 Firebase로 교체

==================================================*/


/*==================================================
STORAGE KEYS
==================================================*/

const CHURCH_STORAGE = {
    CHURCHES: "yetalk_churches",
    MY_CHURCH: "yetalk_my_church",
    MEMBERSHIPS: "yetalk_church_memberships"
};


/*==================================================
ID 생성

Firebase 연결 후에는
Firestore document ID로 대체 가능
==================================================*/

function createChurchId() {

    return (
        "church_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


/*==================================================
문자 정리

부산제일교회
부산 제일 교회

처럼 띄어쓰기가 달라도
검색하기 쉽게 비교용 문자열 생성

주의:
실제 Firebase에서는
churchId가 최종 기준이 됨.
==================================================*/

function normalizeChurchText(text) {

    if (!text) {
        return "";
    }

    return String(text)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^\p{L}\p{N}]/gu, "");

}


/*==================================================
전체 교회 불러오기
==================================================*/

async function getChurches() {

    const saved =
        localStorage.getItem(
            CHURCH_STORAGE.CHURCHES
        );

    if (!saved) {
        return [];
    }

    try {

        const churches =
            JSON.parse(saved);

        return Array.isArray(churches)
            ? churches
            : [];

    } catch (error) {

        console.error(
            "교회 목록 불러오기 오류:",
            error
        );

        return [];

    }

}


/*==================================================
전체 교회 저장

Firebase 연결 후
이 부분은 직접 사용하지 않게 됨.
==================================================*/

async function saveChurches(churches) {

    localStorage.setItem(
        CHURCH_STORAGE.CHURCHES,
        JSON.stringify(churches)
    );

}


/*==================================================
교회 생성
==================================================*/

async function createChurch(data) {

    if (!data) {
        throw new Error(
            "교회 정보가 없습니다."
        );
    }

    const churchName =
        String(
            data.churchName || ""
        ).trim();

    const region =
        String(
            data.region || ""
        ).trim();

    if (!churchName) {

        throw new Error(
            "교회 이름을 입력해주세요."
        );

    }


    const churches =
        await getChurches();


    /*
    같은 지역 + 같은 교회 이름
    중복 확인

    띄어쓰기는 무시
    */

    const normalizedName =
        normalizeChurchText(
            churchName
        );

    const normalizedRegion =
        normalizeChurchText(
            region
        );


    const duplicate =
        churches.find(church => {

            return (
                normalizeChurchText(
                    church.churchName
                ) === normalizedName
                &&
                normalizeChurchText(
                    church.region
                ) === normalizedRegion
            );

        });


    if (duplicate) {

        throw new Error(
            "이미 등록된 교회입니다."
        );

    }


    const church = {

        churchId:
            createChurchId(),

        churchName:
            churchName,

        normalizedName:
            normalizedName,

        region:
            region,

        normalizedRegion:
            normalizedRegion,

        address:
            data.address || "",

        pastorName:
            data.pastorName || "",

        phone:
            data.phone || "",

        mainImage:
            data.mainImage || "",

        createdBy:
            data.createdBy || "",

        createdAt:
            new Date().toISOString(),

        status:
            "active"

    };


    churches.push(church);

    await saveChurches(
        churches
    );


    return church;

}


/*==================================================
교회 ID로 찾기
==================================================*/

async function getChurchById(churchId) {

    if (!churchId) {
        return null;
    }

    const churches =
        await getChurches();


    return (
        churches.find(
            church =>
                church.churchId ===
                churchId
        ) || null
    );

}


/*==================================================
교회 검색

이름 + 지역 검색

예:
부산제일교회
부산 제일 교회

둘 다 검색 가능
==================================================*/

async function searchChurch(
    keyword,
    region = ""
) {

    const churches =
        await getChurches();


    const searchName =
        normalizeChurchText(
            keyword
        );

    const searchRegion =
        normalizeChurchText(
            region
        );


    return churches.filter(
        church => {

            const churchName =
                normalizeChurchText(
                    church.churchName
                );

            const churchRegion =
                normalizeChurchText(
                    church.region
                );


            const nameMatch =
                !searchName ||
                churchName.includes(
                    searchName
                );


            const regionMatch =
                !searchRegion ||
                churchRegion.includes(
                    searchRegion
                );


            return (
                nameMatch &&
                regionMatch
            );

        }
    );

}


/*==================================================
교회 가입

기본 가입 등급:
준회원

정회원 승급은
교회 관리자가 담당
==================================================*/

async function joinChurch({
    userId,
    churchId,
    inviteType = "normal"
}) {

    if (!userId || !churchId) {

        throw new Error(
            "회원 또는 교회 정보가 없습니다."
        );

    }


    const church =
        await getChurchById(
            churchId
        );


    if (!church) {

        throw new Error(
            "등록되지 않은 교회입니다."
        );

    }


    const memberships =
        await getChurchMemberships();


    const existing =
        memberships.find(
            item =>
                item.userId === userId &&
                item.churchId === churchId
        );


    /*
    이미 가입되어 있으면
    기존 가입정보 반환
    */

    if (existing) {

        return existing;

    }


    const membership = {

        membershipId:
            "member_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 7),

        userId:
            userId,

        churchId:
            churchId,

        /*
        최초 가입은 준회원
        */

        grade:
            "associate",

        /*
        normal
        churchInvite
        */

        joinType:
            inviteType,

        joinedAt:
            new Date().toISOString(),

        status:
            "active"

    };


    memberships.push(
        membership
    );


    await saveChurchMemberships(
        memberships
    );


    return membership;

}


/*==================================================
교회 회원정보 불러오기
==================================================*/

async function getChurchMemberships() {

    const saved =
        localStorage.getItem(
            CHURCH_STORAGE.MEMBERSHIPS
        );


    if (!saved) {
        return [];
    }


    try {

        const memberships =
            JSON.parse(saved);

        return Array.isArray(
            memberships
        )
            ? memberships
            : [];

    } catch (error) {

        console.error(
            "교회 회원정보 오류:",
            error
        );

        return [];

    }

}


/*==================================================
교회 회원정보 저장
==================================================*/

async function saveChurchMemberships(
    memberships
) {

    localStorage.setItem(
        CHURCH_STORAGE.MEMBERSHIPS,
        JSON.stringify(
            memberships
        )
    );

}


/*==================================================
특정 교회 회원 목록
==================================================*/

async function getChurchMembers(
    churchId
) {

    const memberships =
        await getChurchMemberships();


    return memberships.filter(
        member =>
            member.churchId ===
            churchId &&
            member.status ===
            "active"
    );

}


/*==================================================
정회원 승급

교회 관리자 화면에서 사용 예정
==================================================*/

async function approveChurchMember(
    membershipId
) {

    const memberships =
        await getChurchMemberships();


    const member =
        memberships.find(
            item =>
                item.membershipId ===
                membershipId
        );


    if (!member) {

        throw new Error(
            "회원정보를 찾을 수 없습니다."
        );

    }


    member.grade =
        "regular";


    await saveChurchMemberships(
        memberships
    );


    return member;

}


/*==================================================
나의 대표교회 지정

즐겨찾기 ⭐를 누르면
대표교회로 지정하는 구조

실전에서는 userId별 Firebase 데이터로 저장
==================================================*/

async function setMyChurch(
    churchId
) {

    const church =
        await getChurchById(
            churchId
        );


    if (!church) {

        throw new Error(
            "교회를 찾을 수 없습니다."
        );

    }


    localStorage.setItem(
        CHURCH_STORAGE.MY_CHURCH,
        churchId
    );


    return church;

}


/*==================================================
나의 대표교회 가져오기
==================================================*/

async function getMyChurch() {

    const churchId =
        localStorage.getItem(
            CHURCH_STORAGE.MY_CHURCH
        );


    if (!churchId) {
        return null;
    }


    return await getChurchById(
        churchId
    );

}


/*==================================================
교회홈에서 소모임 연결 여부 판단용

소모임 데이터에는 반드시
churchId를 저장하는 방식으로 설계

교회 이름 문자열로 연결하지 않음.
==================================================*/

function belongsToChurch(
    group,
    churchId
) {

    if (!group || !churchId) {
        return false;
    }


    return (
        group.churchId ===
        churchId
    );

}


/*==================================================
향후 FIREBASE 전환 메모

Firebase 연결 시 주로 교체되는 함수:

getChurches()
createChurch()
getChurchById()
searchChurch()

joinChurch()
getChurchMemberships()
getChurchMembers()
approveChurchMember()

setMyChurch()
getMyChurch()

화면 파일에서는 가능하면
위 함수 이름을 그대로 사용.

그러면 HTML/CSS와 화면 JS를
대규모로 다시 만들 필요가 없음.
==================================================*/