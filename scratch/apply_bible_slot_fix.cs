using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string path = @"assets\index.html";
        string html = File.ReadAllText(path, Encoding.UTF8);

        // 1. Fix refreshBibleSuiteAndHome to prioritize slotInfo.ch when tongdok is active or when user is following daily reading
        string oldRefreshCode = @"        // 현재 시간대에 맞는 슬롯 선택
        const slotInfo = getCurrentTimeSlotInfo();
        currentUserSlotIdx = slotInfo.slotIdx;
        const savedUserChoice = localStorage.getItem(""yetalk_user_bible_book"");
        if (savedUserChoice) {
            currentUserBibleBook = savedUserChoice;
            currentUserBibleCh = parseInt(localStorage.getItem(""yetalk_user_bible_ch"") || ""1"", 10);
            if (isNaN(currentUserBibleCh) || currentUserBibleCh < 1) currentUserBibleCh = 1;
        } else {
            currentUserBibleBook = slotInfo.book;
            currentUserBibleCh = slotInfo.ch;
        }";

        string newRefreshCode = @"        // 현재 시간대에 맞는 슬롯 선택
        const slotInfo = getCurrentTimeSlotInfo();
        currentUserSlotIdx = slotInfo.slotIdx;
        const isTongdokActive = (localStorage.getItem(""yetalk_tongdok_active"") === ""true"");
        const savedUserChoice = localStorage.getItem(""yetalk_user_bible_book"");

        // 🌟 [사용자 요청] 통독 지정 상태이거나 기본 시간대 진도일 경우: 12시(점심), 18시(저녁)에 맞춰 자동 2장, 3장으로 즉시 전환!
        if (isTongdokActive) {
            currentUserBibleBook = slotInfo.book;
            currentUserBibleCh = slotInfo.ch;
            localStorage.setItem(""yetalk_user_bible_book"", slotInfo.book);
            localStorage.setItem(""yetalk_user_bible_ch"", String(slotInfo.ch));
        } else if (savedUserChoice) {
            currentUserBibleBook = savedUserChoice;
            // 만약 통독 지정된 성경과 동일한 책이라면 시간대별 장수를 우선 적용
            if (savedUserChoice === slotInfo.book) {
                currentUserBibleCh = slotInfo.ch;
            } else {
                currentUserBibleCh = parseInt(localStorage.getItem(""yetalk_user_bible_ch"") || String(slotInfo.ch), 10);
                if (isNaN(currentUserBibleCh) || currentUserBibleCh < 1) currentUserBibleCh = slotInfo.ch;
            }
        } else {
            currentUserBibleBook = slotInfo.book;
            currentUserBibleCh = slotInfo.ch;
        }";

        if (html.Contains(oldRefreshCode))
        {
            html = html.Replace(oldRefreshCode, newRefreshCode);
            Console.WriteLine("Updated refreshBibleSuiteAndHome slot priority in index.html");
        }
        else
        {
            Console.WriteLine("Warning: oldRefreshCode not found directly");
        }

        // 2. In toggleDailyTongdokBook, immediately display the active time-slot chapter upon toggle
        string oldToggleTongdok = @"            currentUserBibleBook = targetBook;
            showBibleToast(`🔴 [${targetBook}] 통독 고정`);
        }

        renderHomeBibleBookChips();
        updateAutoTimeSlotButtonUI();";

        string newToggleTongdok = @"            currentUserBibleBook = targetBook;
            localStorage.removeItem(""yetalk_user_bible_ch"");
            showBibleToast(`🔴 [${targetBook}] 통독 고정`);
        }

        refreshBibleSuiteAndHome();";

        if (html.Contains(oldToggleTongdok))
        {
            html = html.Replace(oldToggleTongdok, newToggleTongdok);
            Console.WriteLine("Updated toggleDailyTongdokBook in index.html");
        }

        // 3. Add periodic slot change detector timer and visibilitychange listener
        string oldFocusListener = @"    function initBibleReadingFocusListeners() {
        // 스크롤 시 임시 점 홍보 배너 숨김
    }";

        string newFocusListener = @"    let lastKnownSlotIdx = -1;
    function initBibleReadingFocusListeners() {
        // 🌟 [사용자 요청] 12시(점심), 18시(저녁), 05시(아침) 시간대 전환 실시간 자동 감지
        function checkAndAutoAdvanceTimeSlot() {
            const slotInfo = getCurrentTimeSlotInfo();
            if (lastKnownSlotIdx === -1) {
                lastKnownSlotIdx = slotInfo.slotIdx;
                return;
            }
            if (lastKnownSlotIdx !== slotInfo.slotIdx) {
                lastKnownSlotIdx = slotInfo.slotIdx;
                console.log(""[Bible Slot Transition] New slot detected:"", slotInfo.slotName, slotInfo.book, slotInfo.ch);
                refreshBibleSuiteAndHome();
            }
        }

        if (!window._bibleSlotTimerStarted) {
            window._bibleSlotTimerStarted = true;
            lastKnownSlotIdx = getCurrentTimeSlotInfo().slotIdx;
            // 20초마다 시간대 변경 감지 (12:00, 18:00에 즉각 2장, 3장으로 자동 전환)
            setInterval(checkAndAutoAdvanceTimeSlot, 20000);
            document.addEventListener(""visibilitychange"", () => {
                if (document.visibilityState === ""visible"") {
                    checkAndAutoAdvanceTimeSlot();
                }
            });
        }
    }";

        if (html.Contains(oldFocusListener))
        {
            html = html.Replace(oldFocusListener, newFocusListener);
            Console.WriteLine("Added real-time time slot auto-advance in index.html");
        }

        File.WriteAllText(path, html, new UTF8Encoding(false));

        // Sync to docs and app/src/main/assets
        File.Copy(path, @"docs\index.html", true);
        File.Copy(path, @"app\src\main\assets\index.html", true);
        Console.WriteLine("Synced index.html to docs and app/src/main/assets");
    }
}
