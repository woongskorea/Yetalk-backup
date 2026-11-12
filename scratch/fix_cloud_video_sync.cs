using System;
using System.IO;
using System.Text;

class FixCloudVideoSync
{
    static void Main()
    {
        string[] paths = new string[]
        {
            @"assets\yetalktv.html",
            @"docs\yetalktv.html",
            @"app\src\main\assets\yetalktv.html"
        };

        foreach (string path in paths)
        {
            if (!File.Exists(path))
            {
                Console.WriteLine("File not found: " + path);
                continue;
            }

            string content = File.ReadAllText(path, Encoding.UTF8).Replace("\r\n", "\n");

            // 1. In uploadVideo / studioModal save: Ensure 'channel' and 'churchName' are included in Firestore addDoc
            string oldAddDoc = @"                addDoc(collection(window.yetalkDb, ""yetalk_videos""), {
                    videoId: videoId,
                    title: promoText,
                    bizName: chosenBiz,
                    shortAd: promoText,
                    targetUrl: chosenUrl,
                    format: isShorts ? 'shorts' : '16:9',
                    views: 101,
                    likes: 3,
                    region: myRegion,
                    author: authorName,
                    isMasterAdmin: isMaster,
                    date: dateStr,
                    timestamp: Date.now(),
                    createdAt: serverTimestamp()
                })";

            string newAddDoc = @"                addDoc(collection(window.yetalkDb, ""yetalk_videos""), {
                    videoId: videoId,
                    title: promoText,
                    bizName: chosenBiz,
                    churchName: churchName || chosenBiz,
                    shortAd: promoText,
                    targetUrl: chosenUrl,
                    channel: uploadChannel || currentTvChannel || '말씀TV',
                    format: isShorts ? 'shorts' : '16:9',
                    views: 101,
                    likes: 3,
                    region: myRegion,
                    author: authorName,
                    isMasterAdmin: isMaster,
                    date: dateStr,
                    timestamp: Date.now(),
                    createdAt: serverTimestamp()
                })";

            if (content.Contains(oldAddDoc))
            {
                content = content.Replace(oldAddDoc, newAddDoc);
            }

            // 2. In loadSavedFeeds(): Make sure cloud-shared videos from other members are not filtered out!
            string oldFilter = @"        // 🌟 [사용자 요청] 10개 소메뉴 채널 필터링 & 사용자 등록 영상(해당 채널 또는 본인 업로드) 최우선 병합
        if (currentTvChannel && CHANNEL_PRESETS[currentTvChannel]) {
            let channelItems = CHANNEL_PRESETS[currentTvChannel];
            // 해당 채널로 등록된 사용자 커스텀 영상 최우선 포함 (channel이 비어있는 경우도 포함)
            let matchingCustom = customList.filter(f => f.channel === currentTvChannel || (!f.channel && f.isUploadedByMe));
            list = [...matchingCustom, ...channelItems];
        }";

            string newFilter = @"        // 🌟 [사용자 요청] 10개 소메뉴 채널 필터링 & 다른 회원이 올린 클라우드 실시간 영상도 전원에게 100% 표출!
        if (currentTvChannel && CHANNEL_PRESETS[currentTvChannel]) {
            let channelItems = CHANNEL_PRESETS[currentTvChannel];
            // 해당 채널 등록 영상, 본인 업로드 영상, 그리고 다른 회원이 올린 클라우드 공유 영상도 최우선 상단 표출
            let matchingCustom = customList.filter(f => {
                if (f.channel === currentTvChannel) return true;
                if (!f.channel && (f.isUploadedByMe || f.isCloud)) return true;
                if (f.isCloud) return true; // 타 회원이 올린 클라우드 영상도 전체 회원에게 즉시 노출!
                return false;
            });
            list = [...matchingCustom, ...channelItems];
        }";

            if (content.Contains(oldFilter))
            {
                content = content.Replace(oldFilter, newFilter);
            }

            // 3. In syncVideosFromCloud(): Ensure channel and isCloud are set, and add fallback error handler
            string oldCloudItem = @"                                id: doc.id,
                                videoId: data.videoId,
                                title: data.title || ""새 영상"",
                                bizName: data.bizName || ""예톡회원"",
                                shortAd: data.shortAd || data.title || """",
                                targetUrl: data.targetUrl || ""churchmain.html"",
                                format: data.format || ""shorts"",
                                views: data.views || 101,
                                likes: data.likes || 12,
                                date: data.date || ""최신"",
                                timestamp: data.timestamp || Date.now(),
                                isCloud: true";

            string newCloudItem = @"                                id: doc.id,
                                videoId: data.videoId,
                                title: data.title || ""새 영상"",
                                bizName: data.bizName || data.churchName || ""예톡회원"",
                                churchName: data.churchName || data.bizName || ""예톡교회"",
                                shortAd: data.shortAd || data.title || """",
                                targetUrl: data.targetUrl || ""churchmain.html"",
                                channel: data.channel || currentTvChannel || ""말씀TV"",
                                format: data.format || ""shorts"",
                                views: data.views || 101,
                                likes: data.likes || 12,
                                date: data.date || ""최신"",
                                timestamp: data.timestamp || Date.now(),
                                isCloud: true";

            if (content.Contains(oldCloudItem))
            {
                content = content.Replace(oldCloudItem, newCloudItem);
            }

            File.WriteAllText(path, content, new UTF8Encoding(false));
            Console.WriteLine("SUCCESS: Updated " + path);
        }
    }
}
