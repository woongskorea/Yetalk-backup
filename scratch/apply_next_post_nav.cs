using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string filePath = @"assets/index.html";
        string html = File.ReadAllText(filePath, Encoding.UTF8);

        // 1. Drawer menu: replace openOurChurchAppModal with direct link to churchmain.html
        string oldDrawerLink = "onclick=\"openOurChurchAppModal(); closeDrawer();\"";
        string newDrawerLink = "onclick=\"location.href='churchmain.html'; closeDrawer();\"";
        if (html.Contains(oldDrawerLink))
        {
            html = html.Replace(oldDrawerLink, newDrawerLink);
            Console.WriteLine("Replaced drawer link to churchmain.html");
        }

        // 2. Hide ourChurchAppModal completely
        string oldModalTag = "<div class=\"modal-overlay\" id=\"ourChurchAppModal\">";
        string newModalTag = "<div class=\"modal-overlay\" id=\"ourChurchAppModal\" style=\"display:none !important;\">";
        if (html.Contains(oldModalTag))
        {
            html = html.Replace(oldModalTag, newModalTag);
            Console.WriteLine("Hidden ourChurchAppModal completely");
        }

        // 3. Make openOurChurchAppModal simply redirect
        string targetFuncStart = "function openOurChurchAppModal() {";
        int idxFunc = html.IndexOf(targetFuncStart);
        if (idxFunc >= 0)
        {
            int idxFuncClose = html.IndexOf("function closeOurChurchAppModal()", idxFunc);
            if (idxFuncClose >= 0)
            {
                string newFuncBody = @"function openOurChurchAppModal() {
        location.href = ""churchmain.html"";
    }

    ";
                html = html.Substring(0, idxFunc) + newFuncBody + html.Substring(idxFuncClose);
                Console.WriteLine("Replaced openOurChurchAppModal body with direct redirection");
            }
        }

        // 4. Add Next Post / Prev Post row in boardPostDetailModal
        string targetActionButtons = @"<div class=""post-detail-action-buttons"">
                    <button type=""button"" class=""btn-post-action-pill"" onclick=""copyCurrentPostText()"" title=""글 복사"">📋 복사</button>
                    <button type=""button"" class=""btn-post-action-pill"" onclick=""editCurrentPost()"" title=""글 수정"">✏️ 수정</button>
                    <button type=""button"" class=""btn-post-action-pill btn-post-action-photo"" onclick=""handleDetailPhotoClick()"" title=""사진 보기/첨부"">🖼️ 그림</button>
                    <button type=""button"" class=""btn-post-action-pill btn-post-action-del"" onclick=""deleteCurrentPost()"" title=""글 삭제"">🗑️ 삭제</button>
                    <input type=""file"" id=""fileDetailQuickPhotoInput"" accept=""image/*"" style=""display:none;"" onchange=""handleDetailQuickPhotoUpload(event)"">
                </div>";

        string navRowsHtml = @"<div class=""post-detail-action-buttons"">
                    <button type=""button"" class=""btn-post-action-pill"" onclick=""copyCurrentPostText()"" title=""글 복사"">📋 복사</button>
                    <button type=""button"" class=""btn-post-action-pill"" onclick=""editCurrentPost()"" title=""글 수정"">✏️ 수정</button>
                    <button type=""button"" class=""btn-post-action-pill btn-post-action-photo"" onclick=""handleDetailPhotoClick()"" title=""사진 보기/첨부"">🖼️ 그림</button>
                    <button type=""button"" class=""btn-post-action-pill btn-post-action-del"" onclick=""deleteCurrentPost()"" title=""글 삭제"">🗑️ 삭제</button>
                    <input type=""file"" id=""fileDetailQuickPhotoInput"" accept=""image/*"" style=""display:none;"" onchange=""handleDetailQuickPhotoUpload(event)"">
                </div>

                <!-- 🌟 [사용자 요청] 모든 게시판마다 다음글 제목 한줄 보이게 하여 터치 시 다음글 바로 연속 읽기 -->
                <div class=""post-detail-nav-rows"" id=""detailPostNavRows"" style=""margin-top:10px; margin-bottom:8px; display:flex; flex-direction:column; gap:6px;"">
                    <div id=""rowDetailNextPost"" onclick=""goToAdjacentBoardPost('next')"" style=""display:none; background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:10px 14px; cursor:pointer; align-items:center; gap:8px; box-shadow:0 1px 3px rgba(0,0,0,0.03); transition:background 0.15s ease;"">
                        <span style=""font-size:12px; font-weight:900; color:#15803d; background:#dcfce7; padding:3px 8px; border-radius:6px; flex-shrink:0;"">다음글 ▶</span>
                        <span id=""txtDetailNextTitle"" style=""font-size:13.5px; font-weight:800; color:#0f172a; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;""></span>
                        <span style=""font-size:14px; color:#15803d; font-weight:900;"">›</span>
                    </div>
                    <div id=""rowDetailPrevPost"" onclick=""goToAdjacentBoardPost('prev')"" style=""display:none; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; padding:9px 14px; cursor:pointer; align-items:center; gap:8px; box-shadow:0 1px 3px rgba(0,0,0,0.02); transition:background 0.15s ease;"">
                        <span style=""font-size:12px; font-weight:900; color:#475569; background:#f1f5f9; padding:3px 8px; border-radius:6px; flex-shrink:0;"">◀ 이전글</span>
                        <span id=""txtDetailPrevTitle"" style=""font-size:13px; font-weight:700; color:#475569; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;""></span>
                        <span style=""font-size:14px; color:#94a3b8; font-weight:900;"">›</span>
                    </div>
                </div>";

        if (html.Contains(targetActionButtons))
        {
            html = html.Replace(targetActionButtons, navRowsHtml);
            Console.WriteLine("Added post-detail-nav-rows directly above admob in boardPostDetailModal");
        }
        else
        {
            Console.WriteLine("WARN: targetActionButtons not found exactly!");
        }

        // 5. Update openBoardPostDetail to populate adjacent posts
        string targetOpenBoardPostDetail = "function openBoardPostDetail(postId) {";
        string targetOpenBoardPostDetailReplacement = @"let currentAdjacentNextPostId = null;
    let currentAdjacentPrevPostId = null;

    function goToAdjacentBoardPost(dir) {
        if (dir === 'next' && currentAdjacentNextPostId != null) {
            openBoardPostDetail(currentAdjacentNextPostId);
        } else if (dir === 'prev' && currentAdjacentPrevPostId != null) {
            openBoardPostDetail(currentAdjacentPrevPostId);
        }
    }
    window.goToAdjacentBoardPost = goToAdjacentBoardPost;

    function openBoardPostDetail(postId) {";

        if (html.Contains(targetOpenBoardPostDetail) && !html.Contains("goToAdjacentBoardPost"))
        {
            html = html.Replace(targetOpenBoardPostDetail, targetOpenBoardPostDetailReplacement);
            Console.WriteLine("Added goToAdjacentBoardPost function");
        }

        // Inside openBoardPostDetail, after setting currentViewingPost = post;
        string targetCurrentViewingPost = "currentViewingPost = post;";
        string adjacentPostCalculation = @"currentViewingPost = post;

        // 🌟 [사용자 요청] 다음글 제목 한줄 표기 & 터치 시 바로 읽기 계산
        let activeBoardPosts = [];
        const catFiltered = posts.filter(p => {
            const b = p.board || p.tag || '';
            const t = p.title || '';
            if (currentBoardCategory === '감사게시판') {
                return b === '감사게시판' || b === '감사' || b === '말씀아멘' || t.includes('감사') || t.includes('아멘');
            } else if (currentBoardCategory === '자유게시판') {
                return b === '자유게시판' || b === '일상나눔' || b === '소통' || b === '동네정보' || (!b && !t.includes('감사') && !t.includes('동행'));
            } else if (currentBoardCategory === '예수동행') {
                return b === '예수동행' || b === '기도제목' || b === '묵상' || t.includes('동행') || t.includes('순종');
            }
            return true;
        });

        if (catFiltered.some(p => String(p.id) === String(post.id))) {
            activeBoardPosts = catFiltered;
        } else {
            const postBoard = post.board || post.tag || '';
            const matchTag = posts.filter(p => (p.board || p.tag || '') === postBoard);
            activeBoardPosts = matchTag.length > 1 ? matchTag : posts;
        }

        const currIdx = activeBoardPosts.findIndex(p => String(p.id) === String(post.id));
        let nextPost = null;
        let prevPost = null;
        if (currIdx >= 0 && activeBoardPosts.length > 1) {
            if (currIdx + 1 < activeBoardPosts.length) {
                nextPost = activeBoardPosts[currIdx + 1];
            } else {
                nextPost = activeBoardPosts[0]; // 순환 이동
            }
            if (currIdx - 1 >= 0) {
                prevPost = activeBoardPosts[currIdx - 1];
            } else {
                prevPost = activeBoardPosts[activeBoardPosts.length - 1];
            }
        }

        currentAdjacentNextPostId = nextPost ? nextPost.id : null;
        currentAdjacentPrevPostId = prevPost ? prevPost.id : null;

        const rowNext = document.getElementById(""rowDetailNextPost"");
        const txtNext = document.getElementById(""txtDetailNextTitle"");
        const rowPrev = document.getElementById(""rowDetailPrevPost"");
        const txtPrev = document.getElementById(""txtDetailPrevTitle"");

        if (rowNext && txtNext) {
            if (nextPost) {
                txtNext.innerText = nextPost.title || (formatBoardAuthorId(nextPost.author) + '님의 나눔');
                rowNext.style.display = ""flex"";
            } else {
                rowNext.style.display = ""none"";
            }
        }

        if (rowPrev && txtPrev) {
            if (prevPost) {
                txtPrev.innerText = prevPost.title || (formatBoardAuthorId(prevPost.author) + '님의 나눔');
                rowPrev.style.display = ""flex"";
            } else {
                rowPrev.style.display = ""none"";
            }
        }";

        if (html.Contains(targetCurrentViewingPost))
        {
            html = html.Replace(targetCurrentViewingPost, adjacentPostCalculation);
            Console.WriteLine("Injected adjacent post navigation display logic in openBoardPostDetail");
        }

        File.WriteAllText(filePath, html, new UTF8Encoding(false));
        Console.WriteLine("Wrote assets/index.html successfully without BOM.");
    }
}
