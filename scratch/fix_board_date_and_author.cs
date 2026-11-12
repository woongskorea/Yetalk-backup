using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string filePath = @"assets/index.html";
        string html = File.ReadAllText(filePath, Encoding.UTF8);

        // 1. Update getBoardUserDisplayId and formatBoardAuthorId and add formatPostDate
        string oldDisplayFunc = @"    // 🌟 [사용자 요청] 자유게시판 및 성경 감사고백 등록 시 개인정보(실명) 보호용 회원 아이디 반환
    function getBoardUserDisplayId() {
        let uid = localStorage.getItem(""yetalk_user_id"") || localStorage.getItem(""yetalkUserId"");
        if (!uid || uid === ""최웅식"" || uid === ""최예톡"" || uid === ""예톡회원"") {
            let anonId = localStorage.getItem(""yetalk_board_anon_id"");
            if (!anonId) {
                anonId = ""user_"" + Math.random().toString(36).substring(2, 7);
                localStorage.setItem(""yetalk_board_anon_id"", anonId);
            }
            uid = anonId;
        }
        if (uid.includes(""@"")) {
            const parts = uid.split(""@"");
            const userPart = parts[0];
            return (userPart.length > 3 ? userPart.substring(0, 3) + ""***"" : userPart + ""***"");
        }
        return uid;
    }

    function formatBoardAuthorId(author) {
        if (!author) return getBoardUserDisplayId();
        if (author.includes(""최웅식"") || author.includes(""최용식"") || author.includes(""최예톡"") || author === ""예톡회원"") {
            return getBoardUserDisplayId();
        }
        return author;
    }";

        string newDisplayFunc = @"    // 🌟 [사용자 요청] 게시판 및 댓글 작성자 아이디 / 실명 처리: 임의 난수(user_00tlg 등) 노출 방지 및 실제 성도 이름 반영
    function getBoardUserDisplayId() {
        const name = localStorage.getItem(""yetalk_user_name"");
        const uid = localStorage.getItem(""yetalk_user_id"") || localStorage.getItem(""yetalkUserId"");
        if (name && name.trim()) return name.trim();
        if (uid && uid.trim() && !uid.startsWith(""user_"") && uid !== ""최웅식"" && uid !== ""최예톡"" && uid !== ""예톡회원"") {
            return uid.trim();
        }
        return ""최베드로"";
    }

    function formatBoardAuthorId(author) {
        const myName = localStorage.getItem(""yetalk_user_name"") || localStorage.getItem(""yetalk_user_id"") || ""최베드로"";
        if (!author) return myName;
        if (author.startsWith(""user_"") || author.includes(""최웅식"") || author.includes(""최용식"") || author.includes(""최예톡"") || author === ""예톡회원"") {
            return myName;
        }
        return author;
    }

    // 🌟 [사용자 요청] 며칠 전 작성한 글이 항상 '방금 전'으로 고정되던 문제 해결: 실제 경과 시간 동적 계산 함수
    function formatPostDate(item) {
        if (!item) return ""방금 전"";
        let ts = item.createdAt || item.timestamp;
        if (!ts && typeof item.id === 'number' && item.id > 1600000000000) {
            ts = item.id;
        } else if (!ts && typeof item.id === 'string' && item.id.startsWith('c_')) {
            const num = parseInt(item.id.replace('c_', ''), 10);
            if (num > 1600000000000) ts = num;
        }

        if (ts) {
            const now = Date.now();
            const diffMs = now - ts;
            if (diffMs < 0) return ""방금 전"";
            const diffMins = Math.floor(diffMs / (60 * 1000));
            if (diffMins < 1) return ""방금 전"";
            if (diffMins < 60) return `${diffMins}분 전`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours}시간 전`;
            const diffDays = Math.floor(diffHours / 24);
            if (diffDays === 1) return ""1일 전"";
            if (diffDays < 7) return `${diffDays}일 전`;
            const d = new Date(ts);
            return `${d.getMonth() + 1}월 ${d.getDate()}일`;
        }

        if (item.date && item.date !== ""방금 전"") {
            return item.date;
        }
        return ""방금 전"";
    }
    window.formatPostDate = formatPostDate;";

        if (html.Contains(oldDisplayFunc))
        {
            html = html.Replace(oldDisplayFunc, newDisplayFunc);
            Console.WriteLine("Replaced getBoardUserDisplayId & added formatPostDate");
        }
        else
        {
            Console.WriteLine("WARN: oldDisplayFunc not found exact match!");
        }

        // 2. In submitAmenConfessionPost: add createdAt: Date.now()
        string oldAmenPost = @"        const newPost = {
            id: Date.now(),
            author: displayAuthorId,
            tag: ""감사게시판"",
            board: ""감사게시판"",
            title: `[${slotTitle}] ${currentBook} ${currentCh}${unit} 말씀 묵상 감사`,
            text: text,
            date: ""방금 전"",";

        string newAmenPost = @"        const newPost = {
            id: Date.now(),
            createdAt: Date.now(),
            author: displayAuthorId,
            tag: ""감사게시판"",
            board: ""감사게시판"",
            title: `[${slotTitle}] ${currentBook} ${currentCh}${unit} 말씀 묵상 감사`,
            text: text,
            date: ""방금 전"",";

        if (html.Contains(oldAmenPost))
        {
            html = html.Replace(oldAmenPost, newAmenPost);
            Console.WriteLine("Added createdAt to submitAmenConfessionPost");
        }

        // 3. In renderFullscreenBoard: use formatPostDate(p)
        string oldRenderCardDate = "<span class=\"board-fullscreen-card-date\">${p.date || '오늘'}</span>";
        string newRenderCardDate = "<span class=\"board-fullscreen-card-date\">${formatPostDate(p)}</span>";

        if (html.Contains(oldRenderCardDate))
        {
            html = html.Replace(oldRenderCardDate, newRenderCardDate);
            Console.WriteLine("Updated renderFullscreenBoard to use formatPostDate(p)");
        }

        // 4. In openBoardPostDetail: use formatPostDate(post)
        string oldDetailDate = "if (dateEl) dateEl.innerText = post.date || '오늘';";
        string newDetailDate = "if (dateEl) dateEl.innerText = formatPostDate(post);";

        if (html.Contains(oldDetailDate))
        {
            html = html.Replace(oldDetailDate, newDetailDate);
            Console.WriteLine("Updated openBoardPostDetail to use formatPostDate(post)");
        }

        // 5. In renderPostComments: use formatPostDate(c)
        string oldCommentDate = "<span class=\"post-comment-date\">${escapePostHtml(c.date || '방금 전')}</span>";
        string newCommentDate = "<span class=\"post-comment-date\">${escapePostHtml(formatPostDate(c))}</span>";

        if (html.Contains(oldCommentDate))
        {
            html = html.Replace(oldCommentDate, newCommentDate);
            Console.WriteLine("Updated renderPostComments to use formatPostDate(c)");
        }

        // 6. In submitPostComment: add createdAt
        string oldSubmitComment = @"        const newComment = {
            id: ""c_"" + Date.now(),
            author: author,
            text: commentText,
            date: ""방금 전""
        };";

        string newSubmitComment = @"        const newComment = {
            id: ""c_"" + Date.now(),
            createdAt: Date.now(),
            author: author,
            text: commentText,
            date: ""방금 전""
        };";

        if (html.Contains(oldSubmitComment))
        {
            html = html.Replace(oldSubmitComment, newSubmitComment);
            Console.WriteLine("Added createdAt to submitPostComment");
        }

        // 7. In submitCafePost: add createdAt
        string oldCafePost = @"            const newPost = {
                id: Date.now(),
                author: author,
                tag: currentCafeCat,
                board: currentCafeCat,
                title: title || (content.length > 20 ? content.substring(0, 20) + ""..."" : content),
                text: content,
                date: ""방금 전"",";

        string newCafePost = @"            const newPost = {
                id: Date.now(),
                createdAt: Date.now(),
                author: author,
                tag: currentCafeCat,
                board: currentCafeCat,
                title: title || (content.length > 20 ? content.substring(0, 20) + ""..."" : content),
                text: content,
                date: ""방금 전"",";

        if (html.Contains(oldCafePost))
        {
            html = html.Replace(oldCafePost, newCafePost);
            Console.WriteLine("Added createdAt to submitCafePost");
        }

        // 8. In DEFAULT_BOARD_POSTS: update sample authors to warm Christian handles
        html = html.Replace("\"user_yetalk\"", "\"은혜맘\"")
                   .Replace("\"user_salt\"", "\"소금과빛\"")
                   .Replace("\"user_grace\"", "\"은혜성도\"")
                   .Replace("\"user_faith\"", "\"믿음의가정\"")
                   .Replace("\"user_hope\"", "\"소망의빛\"")
                   .Replace("\"user_love\"", "\"사랑의통로\"")
                   .Replace("\"user_deacon\"", "\"기쁨집사\"")
                   .Replace("\"user_david\"", "\"다윗청년\"")
                   .Replace("\"user_paul\"", "\"바울성도\"");

        File.WriteAllText(filePath, html, new UTF8Encoding(false));
        Console.WriteLine("Wrote assets/index.html successfully.");
    }
}
