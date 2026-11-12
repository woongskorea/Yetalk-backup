using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string filePath = @"assets/index.html";
        string html = File.ReadAllText(filePath, Encoding.UTF8);

        // Normalize newlines to \n
        string norm = html.Replace("\r\n", "\n").Replace("\r", "\n");

        string target = @"    // 안드로이드 뒤로가기 버튼 연동 (MainActivity.kt)
    window.handleAppBackPress = function() {
        cancelAutoSuiteTimer();
        const noticeWriteModal = document.getElementById(""noticeWriteModal"");
        if (noticeWriteModal && noticeWriteModal.classList.contains(""show"")) {
            closeNoticeWriteModal();
            return true;
        }
        const detailModal = document.getElementById(""boardPostDetailModal"");
        if (detailModal && detailModal.classList.contains(""show"")) {
            closeBoardPostDetail();
            return true;
        }
        const writeModal = document.getElementById(""cafeWriteModal"");
        if (writeModal && writeModal.classList.contains(""show"")) {
            closeCafeWriteModal();
            return true;
        }
        const boardOverlay = document.getElementById(""boardFullscreenOverlay"");
        if (boardOverlay && boardOverlay.classList.contains(""show"")) {
            closeFullscreenBoard();
            return true;
        }
        const activeModal = document.querySelector('.modal-overlay.show, .video-list-modal.show, .drawer-menu-overlay.show');
        if (activeModal) {
            activeModal.classList.remove('show');
            return true;
        }
        const suiteContainer = document.getElementById(""suiteScrollContainer"");
        if (suiteContainer && suiteContainer.scrollTop > 150) {
            scrollToVideoTop();
            return true;
        }
        const suiteOverlay = document.getElementById('bibleSuiteOverlay');
        if (suiteOverlay && suiteOverlay.classList.contains('show')) {
            closeBibleSuite();
            return true;
        }
        return false;
    };";

        target = target.Replace("\r\n", "\n");

        string replacement = @"    // 🌟 [사용자 요청] 안드로이드 시스템 뒤로가기 버튼 연동 (MainActivity.kt)
    // 모달이나 서브 화면에서 하단 '<' 뒤로가기 터치 시 앱이 종료되거나 바탕화면으로 가지 않고, 반드시 예톡 홈으로 복귀하도록 완벽 제어
    window.handleAppBackPress = function() {
        try {
            cancelAutoSuiteTimer();
        } catch(e) {}

        // 1. 🌟 [사용자 요청] '매일회개 & 영적승리' 모달 닫기 -> 예톡 홈 복귀
        const dailyModal = document.getElementById(""dailyRepentVictoryModal"");
        if (dailyModal && (dailyModal.classList.contains(""show"") || dailyModal.style.display === ""flex"" || (dailyModal.style.display && dailyModal.style.display !== ""none""))) {
            if (typeof closeDailyRepentVictoryModal === ""function"") {
                closeDailyRepentVictoryModal();
            } else {
                dailyModal.classList.remove(""show"");
                dailyModal.style.setProperty(""display"", ""none"", ""important"");
            }
            return true;
        }

        // 2. 🌟 [사용자 요청] '까짓것! 별거아냐 / 말씀 & 신앙결단' 모달 닫기 -> 예톡 홈 복귀
        const kkModal = document.getElementById(""kkajitgeotModal"");
        if (kkModal && (kkModal.classList.contains(""show"") || kkModal.style.display === ""flex"" || (kkModal.style.display && kkModal.style.display !== ""none""))) {
            if (typeof closeKkajitgeotModal === ""function"") {
                closeKkajitgeotModal();
            } else {
                kkModal.classList.remove(""show"");
                kkModal.style.setProperty(""display"", ""none"", ""important"");
            }
            return true;
        }

        // 3. 공지사항 글쓰기 모달
        const noticeWriteModal = document.getElementById(""noticeWriteModal"");
        if (noticeWriteModal && (noticeWriteModal.classList.contains(""show"") || (noticeWriteModal.style.display && noticeWriteModal.style.display !== ""none""))) {
            if (typeof closeNoticeWriteModal === ""function"") closeNoticeWriteModal();
            noticeWriteModal.classList.remove(""show"");
            noticeWriteModal.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        // 4. 게시글 상세 모달
        const detailModal = document.getElementById(""boardPostDetailModal"");
        if (detailModal && (detailModal.classList.contains(""show"") || (detailModal.style.display && detailModal.style.display !== ""none""))) {
            if (typeof closeBoardPostDetail === ""function"") closeBoardPostDetail();
            detailModal.classList.remove(""show"");
            detailModal.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        // 5. 커뮤니티 글쓰기 모달
        const writeModal = document.getElementById(""cafeWriteModal"");
        if (writeModal && (writeModal.classList.contains(""show"") || (writeModal.style.display && writeModal.style.display !== ""none""))) {
            if (typeof closeCafeWriteModal === ""function"") closeCafeWriteModal();
            writeModal.classList.remove(""show"");
            writeModal.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        // 6. 커뮤니티 전체화면 오버레이
        const boardOverlay = document.getElementById(""boardFullscreenOverlay"");
        if (boardOverlay && (boardOverlay.classList.contains(""show"") || (boardOverlay.style.display && boardOverlay.style.display !== ""none""))) {
            if (typeof closeFullscreenBoard === ""function"") closeFullscreenBoard();
            boardOverlay.classList.remove(""show"");
            boardOverlay.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        // 7. 교우 회원가입 / 정보수정 모달
        const regModal = document.getElementById(""christianRegisterModal"");
        if (regModal && (regModal.classList.contains(""show"") || (regModal.style.display && regModal.style.display !== ""none""))) {
            if (typeof closeChristianRegisterModal === ""function"") closeChristianRegisterModal();
            regModal.classList.remove(""show"");
            regModal.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        // 8. 1:1 채팅창 풀스크린 오버레이
        const chatOverlay = document.getElementById(""yetalkPrivateChatOverlay"");
        if (chatOverlay && (chatOverlay.classList.contains(""show"") || chatOverlay.style.display === ""flex"" || (chatOverlay.style.display && chatOverlay.style.display !== ""none""))) {
            chatOverlay.classList.remove(""show"");
            chatOverlay.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        // 9. 성경 묵상 및 기타 팝업 모달
        const heavenModal = document.getElementById(""heavenMeditationModal"");
        if (heavenModal && (heavenModal.classList.contains(""show"") || (heavenModal.style.display && heavenModal.style.display !== ""none""))) {
            if (typeof closeHeavenMeditationModal === ""function"") closeHeavenMeditationModal();
            heavenModal.classList.remove(""show"");
            heavenModal.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        const mealModal = document.getElementById(""mealPrayerLotteryModal"");
        if (mealModal && (mealModal.classList.contains(""show"") || (mealModal.style.display && mealModal.style.display !== ""none""))) {
            if (typeof closeMealPrayerLotteryModal === ""function"") closeMealPrayerLotteryModal();
            mealModal.classList.remove(""show"");
            mealModal.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        const gnModal = document.getElementById(""goodnewsMeditationModal"");
        if (gnModal && (gnModal.classList.contains(""show"") || (gnModal.style.display && gnModal.style.display !== ""none""))) {
            if (typeof closeGoodnewsMeditationModal === ""function"") closeGoodnewsMeditationModal();
            gnModal.classList.remove(""show"");
            gnModal.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        const friendModal = document.getElementById(""christianFriendsModal"");
        if (friendModal && (friendModal.classList.contains(""show"") || (friendModal.style.display && friendModal.style.display !== ""none""))) {
            if (typeof closeChristianFriendsModal === ""function"") closeChristianFriendsModal();
            friendModal.classList.remove(""show"");
            friendModal.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        const churchModal = document.getElementById(""ourChurchAppModal"");
        if (churchModal && (churchModal.classList.contains(""show"") || (churchModal.style.display && churchModal.style.display !== ""none""))) {
            if (typeof closeOurChurchAppModal === ""function"") closeOurChurchAppModal();
            churchModal.classList.remove(""show"");
            churchModal.style.setProperty(""display"", ""none"", ""important"");
            return true;
        }

        // 10. 열려 있는 모든 모달/오버레이 검사 및 닫기
        const activeModals = document.querySelectorAll('.modal-overlay.show, .video-list-modal.show, .drawer-menu-overlay.show, [id$=""Modal""].show');
        for (let i = 0; i < activeModals.length; i++) {
            const m = activeModals[i];
            m.classList.remove('show');
            m.style.setProperty('display', 'none', 'important');
            return true;
        }

        // 11. 예톡TV 및 성경 스위트
        const suiteOverlay = document.getElementById('bibleSuiteOverlay');
        if (suiteOverlay && (suiteOverlay.classList.contains('show') || (suiteOverlay.style.display && suiteOverlay.style.display !== 'none'))) {
            if (typeof closeBibleSuite === 'function') closeBibleSuite();
            suiteOverlay.classList.remove('show');
            suiteOverlay.style.setProperty('display', 'none', 'important');
            return true;
        }

        const suiteContainer = document.getElementById(""suiteScrollContainer"");
        if (suiteContainer && suiteContainer.scrollTop > 150) {
            if (typeof scrollToVideoTop === 'function') scrollToVideoTop();
            return true;
        }

        return false;
    };";

        if (norm.Contains(target))
        {
            norm = norm.Replace(target, replacement);
            string finalHtml = norm.Replace("\n", "\r\n");
            File.WriteAllText(filePath, finalHtml, new UTF8Encoding(false));
            Console.WriteLine("Success: handleAppBackPress replaced successfully!");
        }
        else
        {
            Console.WriteLine("Error: target not found in assets/index.html!");
        }
    }
}
