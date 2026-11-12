using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string filePath = @"assets/yetalktv.html";
        string html = File.ReadAllText(filePath, Encoding.UTF8);

        // 1. Fix channel leakage in loadSavedFeeds()
        string oldChannelBlocks = @"        // 🌟 [사용자 요청] 우리교회 채널: 실시간 라이브 예배 영상 최우선 1번 자동 배치
        if (currentTvChannel === '우리교회') {
            const churchName = localStorage.getItem('yetalk_church_name') || localStorage.getItem('yetalkChurchName') || '우리교회';
            let liveUrl = localStorage.getItem('yetalk_church_live_video_url') || localStorage.getItem('yetalk_church_sermon_video');
            let liveVid = liveUrl ? extractYouTubeVideoId(liveUrl) : null;
            if (!liveVid) {
                const myChurchCustom = customList.find(f => (f.bizName && f.bizName.includes(churchName)) || (f.targetUrl && f.targetUrl.includes('church')));
                if (myChurchCustom) liveVid = myChurchCustom.videoId;
            }
            if (!liveVid) liveVid = '92oktJl3-Fo';

            const ourChurchLiveFeed = {
                id: 'ourchurch_live_stream_priority_feed',
                videoId: liveVid,
                bizName: churchName,
                shortAd: `🔴 [실시간 생방송] ${churchName} 주일 대예배 라이브`,
                targetUrl: 'churchmain.html',
                views: 8920,
                likes: 1540,
                format: '16:9',
                region: localStorage.getItem('yetalkUserRegion') || '전국',
                badge: '🔴 [실시간 생방송 라이브]',
                channel: '우리교회'
            };
            list = list.filter(f => f.id !== 'ourchurch_live_stream_priority_feed' && f.videoId !== liveVid);
            list.unshift(ourChurchLiveFeed);
        }

        // 🌟 [사용자 요청] 말씀TV 1~2번에 본 교회 라이브/설교 영상 최우선 배치 (본 교인들이 가장 보기 쉽게)
        const churchName = localStorage.getItem('yetalk_church_name') || localStorage.getItem('yetalkChurchName') || '우리교회';
        let topLiveSermonYt = localStorage.getItem('yetalk_church_live_video_url') || localStorage.getItem('yetalk_church_sermon_video');
        let churchLiveVid = topLiveSermonYt ? extractYouTubeVideoId(topLiveSermonYt) : null;
        if (!churchLiveVid) {
            const myChurchCustom = customList.find(f => (f.bizName && f.bizName.includes(churchName)) || (f.targetUrl && f.targetUrl.includes('church')));
            if (myChurchCustom) churchLiveVid = myChurchCustom.videoId;
        }
        if (!churchLiveVid) churchLiveVid = '92oktJl3-Fo';

        const churchTopFeed = {
            id: 'church_worship_priority_feed',
            videoId: churchLiveVid,
            bizName: churchName,
            shortAd: `[우리교회 실시간예배/설교] ${churchName} 은혜의 말씀`,
            targetUrl: 'churchmain.html',
            views: 5280,
            likes: 910,
            format: '16:9',
            region: localStorage.getItem('yetalkUserRegion') || '전국',
            badge: '🔴 [우리교회] 실시간예배/설교',
            channel: '말씀'
        };

        if (currentTvChannel === '말씀' || !currentTvChannel) {
            list = list.filter(f => f.id !== 'church_worship_priority_feed' && f.videoId !== churchLiveVid);
            list.unshift(churchTopFeed);
        }";

        string newChannelBlocks = @"        // 🌟 [사용자 요청] 우리교회 채널: '우리교회' 채널로 지정 등록된 영상 또는 전용 실시간 라이브 영상만 노출 (타 채널 찬양 침범 100% 차단)
        if (currentTvChannel === '우리교회') {
            const churchName = localStorage.getItem('yetalk_church_name') || localStorage.getItem('yetalkChurchName') || '우리교회';
            let liveUrl = localStorage.getItem('yetalk_church_live_video_url');
            let liveVid = liveUrl ? extractYouTubeVideoId(liveUrl) : null;
            if (!liveVid) {
                // 오직 '우리교회' 채널로 등록된 영상만 필터링 매칭 (찬양/말씀 등 다른 채널 영상 침범 금지)
                const myChurchCustom = customList.find(f => f.channel === '우리교회');
                if (myChurchCustom) liveVid = myChurchCustom.videoId;
            }
            if (liveVid) {
                const ourChurchLiveFeed = {
                    id: 'ourchurch_live_stream_priority_feed',
                    videoId: liveVid,
                    bizName: churchName,
                    shortAd: `🔴 [실시간 생방송] ${churchName} 주일 대예배 라이브`,
                    targetUrl: 'churchmain.html',
                    views: 8920,
                    likes: 1540,
                    format: '16:9',
                    region: localStorage.getItem('yetalkUserRegion') || '전국',
                    badge: '🔴 [실시간 생방송 라이브]',
                    channel: '우리교회'
                };
                list = list.filter(f => f.id !== 'ourchurch_live_stream_priority_feed' && f.videoId !== liveVid);
                list.unshift(ourChurchLiveFeed);
            }
        }

        // 🌟 [사용자 요청] 말씀TV 채널: '말씀' 채널로 지정 등록된 설교 영상 또는 공식 설교 영상만 노출 (찬양 등 타 채널 영상 침범 100% 차단)
        if (currentTvChannel === '말씀') {
            const churchName = localStorage.getItem('yetalk_church_name') || localStorage.getItem('yetalkChurchName') || '우리교회';
            let topLiveSermonYt = localStorage.getItem('yetalk_church_sermon_video');
            let churchLiveVid = topLiveSermonYt ? extractYouTubeVideoId(topLiveSermonYt) : null;
            if (!churchLiveVid) {
                // 오직 '말씀' 채널로 등록된 영상만 필터링 매칭 (찬양 등 다른 채널 영상 침범 금지)
                const mySermonCustom = customList.find(f => f.channel === '말씀' || f.channel === '말씀TV');
                if (mySermonCustom) churchLiveVid = mySermonCustom.videoId;
            }
            if (churchLiveVid) {
                const churchTopFeed = {
                    id: 'church_worship_priority_feed',
                    videoId: churchLiveVid,
                    bizName: churchName,
                    shortAd: `[우리교회 설교] ${churchName} 은혜의 말씀`,
                    targetUrl: 'churchmain.html',
                    views: 5280,
                    likes: 910,
                    format: '16:9',
                    region: localStorage.getItem('yetalkUserRegion') || '전국',
                    badge: '🔴 [우리교회] 은혜의 말씀/설교',
                    channel: '말씀'
                };
                list = list.filter(f => f.id !== 'church_worship_priority_feed' && f.videoId !== churchLiveVid);
                list.unshift(churchTopFeed);
            }
        }";

        if (html.Contains(oldChannelBlocks))
        {
            html = html.Replace(oldChannelBlocks, newChannelBlocks);
            Console.WriteLine("Successfully replaced channel isolation logic in yetalktv.html");
        }
        else
        {
            Console.WriteLine("WARN: oldChannelBlocks not found exact match!");
        }

        // 2. Add 60s minimum interval logic for AdMob 250
        string oldAdmobEndedLogic = @"        if (event.data === YT.PlayerState.ENDED) {
            if (videoPauseGraceTimer) {
                clearTimeout(videoPauseGraceTimer);
                videoPauseGraceTimer = null;
            }
            isUserExplicitPause = false;
            currentEndedFeedId = feedId;
            isVideoPaused = true;
            updatePlaybackUiState('ended'); // 🌟 [사용자 요청] 영상 끝난 후: 우측 메뉴 및 하단 메뉴(전문앱 홍보/100애드몹) 모두 ❌ 숨김
            showAdmob250AndReplay(feedId);
        }";

        string newAdmobEndedLogic = @"        if (event.data === YT.PlayerState.ENDED) {
            if (videoPauseGraceTimer) {
                clearTimeout(videoPauseGraceTimer);
                videoPauseGraceTimer = null;
            }
            isUserExplicitPause = false;
            currentEndedFeedId = feedId;
            isVideoPaused = true;

            // 🌟 [구글 애드몹 정책 준수] 쇼츠 등 짧은 영상 반복 시 광고 과다 노출(정책 위반) 방지: 최소 1분(60초) 간격 쿨타임 보장
            const nowTime = Date.now();
            if (nowTime - lastAdmob250ShowTime >= ADMOB_250_MIN_INTERVAL_MS) {
                lastAdmob250ShowTime = nowTime;
                updatePlaybackUiState('ended'); // 영상 끝난 후: 우측 및 하단 메뉴 숨김
                showAdmob250AndReplay(feedId);
            } else {
                // 1분이 지나지 않은 경우 애드몹 250 팝업을 띄우지 않고 즉시 재시작/연속재생하여 정책 준수
                replayCurrentVideo(feedId);
            }
        }";

        string timerVarDecl = "let admobReplayTimer = null;";
        string timerVarDeclNew = @"let admobReplayTimer = null;
    let lastAdmob250ShowTime = 0;
    const ADMOB_250_MIN_INTERVAL_MS = 60 * 1000; // 🌟 [구글 정책 준수] 최소 1분(60초) 주기 쿨타임 간격 보장";

        if (html.Contains(timerVarDecl) && !html.Contains("ADMOB_250_MIN_INTERVAL_MS"))
        {
            html = html.Replace(timerVarDecl, timerVarDeclNew);
            Console.WriteLine("Added ADMOB_250_MIN_INTERVAL_MS variable declaration");
        }

        if (html.Contains(oldAdmobEndedLogic))
        {
            html = html.Replace(oldAdmobEndedLogic, newAdmobEndedLogic);
            Console.WriteLine("Replaced AdMob ENDED handler with 60s cooldown");
        }
        else
        {
            Console.WriteLine("WARN: oldAdmobEndedLogic not found exact match!");
        }

        // Inside showAdmob250AndReplay, also add guard
        string oldShowAdmobFunc = @"    function showAdmob250AndReplay(feedId) {
        if (admobReplayTimer) clearInterval(admobReplayTimer);";

        string newShowAdmobFunc = @"    function showAdmob250AndReplay(feedId) {
        if (admobReplayTimer) clearInterval(admobReplayTimer);
        const nowCheck = Date.now();
        if (nowCheck - lastAdmob250ShowTime < ADMOB_250_MIN_INTERVAL_MS && lastAdmob250ShowTime > 0) {
            replayCurrentVideo(feedId);
            return;
        }
        lastAdmob250ShowTime = nowCheck;";

        if (html.Contains(oldShowAdmobFunc))
        {
            html = html.Replace(oldShowAdmobFunc, newShowAdmobFunc);
            Console.WriteLine("Added inner guard to showAdmob250AndReplay");
        }

        File.WriteAllText(filePath, html, new UTF8Encoding(false));
        Console.WriteLine("Wrote assets/yetalktv.html successfully.");
    }
}
