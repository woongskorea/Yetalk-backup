using System;
using System.IO;
using System.Text;

class ApplyMedigateExactComments {
    static void Main() {
        string path = "assets/index.html";
        string text = File.ReadAllText(path, Encoding.UTF8);

        // 1. Add CSS for Medigate top comment write box and reply box
        string cssAnchor = "/* 🌟 [사용자 요청] 메디게이트 스타일 답글(대댓글) 디자인 */";
        string newCss = @"/* 🌟 [사용자 요청] 메디게이트 스타일 상단 댓글 작성창 (카메라 아이콘 포함) */
        .medigate-comment-write-box {
            background: #ffffff;
            border: 1.5px solid #cbd5e1;
            border-radius: 12px;
            padding: 8px 12px;
            margin-bottom: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .medigate-comment-write-inner {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .btn-medigate-camera {
            font-size: 20px;
            cursor: pointer;
            line-height: 1;
            padding: 2px 4px;
            color: #475569;
            user-select: none;
            transition: transform 0.1s;
        }
        .btn-medigate-camera:active {
            transform: scale(0.92);
        }
        .medigate-comment-input {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
            outline: none;
            padding: 6px 0;
        }
        .medigate-comment-input::placeholder {
            color: #94a3b8;
            font-size: 13.5px;
        }
        .btn-medigate-submit {
            background: #0284c7;
            color: #ffffff;
            border: none;
            padding: 7px 15px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 850;
            cursor: pointer;
            transition: background 0.15s;
            white-space: nowrap;
        }
        .btn-medigate-submit:active {
            background: #0369a1;
        }

        /* 🌟 [사용자 요청] 메디게이트 스타일 답글(대댓글) 디자인 */
        .btn-reply-toggle {
            background: none;
            border: none;
            color: #475569;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            padding: 0;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .btn-reply-toggle:hover {
            color: #0284c7;
        }
        .medigate-reply-box {
            display: none;
            margin-top: 8px;
            background: #ffffff;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            padding: 10px;
            flex-direction: column;
            gap: 6px;
        }
        .medigate-reply-textarea {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 13px;
            outline: none;
            resize: none;
            min-height: 48px;
            font-family: inherit;
            color: #0f172a;
            line-height: 1.45;
        }
        .post-reply-item {
            margin-left: 14px;
            margin-top: 6px;
            background: #f1f5f9;
            border-left: 3px solid #0284c7;
            border-radius: 6px;
            padding: 8px 10px;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }";

        int idxOldCss = text.IndexOf(cssAnchor);
        if (idxOldCss > 0) {
            int closeOldCss = text.IndexOf("/* 5대 게시판 추가 탭 스타일 */", idxOldCss);
            if (closeOldCss > 0) {
                text = text.Substring(0, idxOldCss) + newCss + "\n\n        " + text.Substring(closeOldCss);
                Console.WriteLine("Updated Medigate CSS styles successfully.");
            }
        }

        // 2. HTML: Place Medigate comment write box at top of comments section, and REMOVE sticky footer bar!
        int idxCommentsSec = text.IndexOf("<div class=\"post-detail-comments-section\">");
        if (idxCommentsSec > 0) {
            int idxCommentsHeader = text.IndexOf("<div class=\"comments-section-header\">", idxCommentsSec);
            int idxCommentsList = text.IndexOf("<div class=\"post-comments-list\"", idxCommentsHeader);
            if (idxCommentsList > 0) {
                string topWriteBox = @"<div class=""comments-section-header"">
                    <div style=""display:flex; align-items:center; gap:6px;"">
                        <span style=""font-size:14px; font-weight:900; color:#0f172a;"">💬 댓글</span>
                        <span id=""postCommentsCount"" style=""color:#0284c7; font-size:13px; font-weight:900;"">0</span>
                    </div>
                    <span style=""font-size:11px; color:#64748b;"">따뜻한 격려와 축복의 한마디</span>
                </div>

                <!-- 🌟 [사용자 요청] 메디게이트 스타일 상단 댓글 작성창 (사진기 아이콘 포함) -->
                <div class=""medigate-comment-write-box"" id=""medigateCommentWriteBox"">
                    <div class=""medigate-comment-write-inner"">
                        <label for=""fileCommentPhoto"" class=""btn-medigate-camera"" title=""사진 첨부"">📷</label>
                        <input type=""file"" id=""fileCommentPhoto"" accept=""image/*"" style=""display:none;"" onchange=""handleCommentPhotoSelect(event)"">
                        <input type=""text"" id=""inpPostComment"" class=""medigate-comment-input"" placeholder=""댓글을 남겨주세요."" onkeydown=""if(event.key==='Enter') submitPostComment()"">
                        <button type=""button"" class=""btn-medigate-submit"" onclick=""submitPostComment()"">등록</button>
                    </div>
                    <div id=""commentPhotoAttachedBadge"" style=""display:none; padding:4px 4px 2px 4px; font-size:11.5px; color:#0284c7; align-items:center; gap:6px;"">
                        <span>📷 사진 첨부됨</span>
                        <button type=""button"" onclick=""cancelCommentPhoto()"" style=""background:none; border:none; color:#ef4444; font-size:11px; cursor:pointer;"">✕ 삭제</button>
                    </div>
                </div>

                ";
                text = text.Substring(0, idxCommentsHeader) + topWriteBox + text.Substring(idxCommentsList);
                Console.WriteLine("Placed Medigate comment write box at top of comments section.");
            }
        }

        // 3. Remove post-detail-sticky-footer-bar completely!
        int idxSticky = text.IndexOf("<div class=\"post-detail-sticky-footer-bar\">");
        if (idxSticky > 0) {
            int closeSticky = text.IndexOf("</div>", idxSticky);
            if (closeSticky > 0) {
                text = text.Substring(0, idxSticky) + text.Substring(closeSticky + 6);
                Console.WriteLine("Completely removed post-detail-sticky-footer-bar.");
            }
        }

        // 4. Update JS: photo handlers, renderPostComments (Medigate style reply box with 취소 | 등록 and hidden by default)
        int idxJsRender = text.IndexOf("function renderPostComments(post) {");
        int idxJsEnd = text.IndexOf("function copyCurrentPostText() {", idxJsRender);

        if (idxJsRender > 0 && idxJsEnd > 0) {
            string newJsComments = @"let currentCommentAttachedPhoto = """";
    let currentReplyAttachedPhotos = {};

    function handleCommentPhotoSelect(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            alert(""사진 용량은 3MB 이하로 선택해 주세요."");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            currentCommentAttachedPhoto = e.target.result;
            const badge = document.getElementById(""commentPhotoAttachedBadge"");
            if (badge) badge.style.display = ""flex"";
        };
        reader.readAsDataURL(file);
    }

    function cancelCommentPhoto() {
        currentCommentAttachedPhoto = """";
        const badge = document.getElementById(""commentPhotoAttachedBadge"");
        const fileInp = document.getElementById(""fileCommentPhoto"");
        if (badge) badge.style.display = ""none"";
        if (fileInp) fileInp.value = """";
    }

    function handleReplyPhotoSelect(event, commentId) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            alert(""사진 용량은 3MB 이하로 선택해 주세요."");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            currentReplyAttachedPhotos[commentId] = e.target.result;
            const badge = document.getElementById(""replyPhotoBadge_"" + commentId);
            if (badge) badge.style.display = ""flex"";
        };
        reader.readAsDataURL(file);
    }

    function cancelReplyPhoto(commentId) {
        delete currentReplyAttachedPhotos[commentId];
        const badge = document.getElementById(""replyPhotoBadge_"" + commentId);
        const fileInp = document.getElementById(""fileReplyPhoto_"" + commentId);
        if (badge) badge.style.display = ""none"";
        if (fileInp) fileInp.value = """";
    }

    function toggleCommentHeart(postId, commentId) {
        if (!currentViewingPost) return;
        const comments = currentViewingPost.comments || [];
        const target = comments.find(c => String(c.id) === String(commentId));
        if (!target) return;
        target.hearts = (target.hearts || 0) + 1;

        try {
            let saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
            const idx = saved.findIndex(s => String(s.id) === String(postId));
            if (idx >= 0) {
                saved[idx].comments = currentViewingPost.comments;
            }
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
        } catch(e) {}

        renderPostComments(currentViewingPost);
    }

    // 🌟 [사용자 요청] 메디게이트 스타일 댓글 & 대댓글 렌더링 (흰색/연회색 번갈아 배치 및 답글쓰기)
    function renderPostComments(post) {
        if (!post) return;
        const countEl = document.getElementById(""postCommentsCount"");
        const listEl = document.getElementById(""postCommentsList"");
        const comments = Array.isArray(post.comments) ? post.comments : [];

        const totalComments = comments.reduce((acc, c) => acc + 1 + (Array.isArray(c.replies) ? c.replies.length : 0), 0);
        if (countEl) countEl.innerText = totalComments;
        if (!listEl) return;

        if (comments.length === 0) {
            listEl.innerHTML = `
                <div style=""text-align:center; padding:18px 10px; color:#64748b; font-size:12px; background:rgba(255,255,255,0.02); border-radius:10px;"">
                    ✨ 첫 번째 따뜻한 댓글의 주인공이 되어보세요!
                </div>
            `;
            return;
        }

        listEl.innerHTML = comments.map((c, idx) => {
            const itemBg = (idx % 2 === 0) ? '#ffffff' : '#f8fafc';
            const replies = Array.isArray(c.replies) ? c.replies : [];
            const repliesHtml = replies.map(r => `
                <div class=""post-reply-item"">
                    <div style=""display:flex; justify-content:space-between; align-items:center;"">
                        <strong style=""font-size:11.5px; color:#0369a1;"">↳ ${escapePostHtml(formatBoardAuthorId(r.author))}</strong>
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <span style=""font-size:10.5px; color:#64748b;"">${escapePostHtml(formatPostDate(r))}</span>
                            <button type=""button"" class=""btn-del-comment"" onclick=""deletePostReply('${post.id}', '${c.id}', '${r.id}')"" title=""답글 삭제"" style=""font-size:11px; padding:0 2px; color:#ef4444; background:none; border:none; cursor:pointer;"">✕</button>
                        </div>
                    </div>
                    ${r.photo ? `<div style=""margin:4px 0;""><img src=""${r.photo}"" style=""max-width:160px; max-height:120px; border-radius:6px; object-fit:cover;""></div>` : ''}
                    <div style=""font-size:12.5px; color:#1e293b; line-height:1.45; word-break:break-word;"">${escapePostHtml(r.text || '')}</div>
                </div>
            `).join("""");

            return `
                <div class=""post-comment-item"" style=""background:${itemBg}; border:1px solid #e2e8f0; border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:6px;"">
                    <div class=""post-comment-head"" style=""display:flex; justify-content:space-between; align-items:center;"">
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <strong class=""post-comment-author"" style=""color:#0284c7; font-size:12.5px; font-weight:850;"">${escapePostHtml(formatBoardAuthorId(c.author))}</strong>
                            <span class=""post-comment-date"" style=""color:#64748b; font-size:11px;"">${escapePostHtml(formatPostDate(c))}</span>
                        </div>
                        <button type=""button"" class=""btn-del-comment"" onclick=""deletePostComment('${post.id}', '${c.id}')"" title=""댓글 삭제"" style=""color:#ef4444; background:none; border:none; cursor:pointer; font-size:13px;"">✕</button>
                    </div>
                    ${c.photo ? `<div style=""margin:4px 0;""><img src=""${c.photo}"" style=""max-width:200px; max-height:150px; border-radius:8px; border:1px solid #cbd5e1; object-fit:cover;""></div>` : ''}
                    <div class=""post-comment-text"" style=""color:#1e293b; font-size:13.5px; line-height:1.5; word-break:break-word;"">${escapePostHtml(c.text || '')}</div>
                    
                    <!-- 메디게이트 스타일 액션: 좋아요 & 댓글쓰기 -->
                    <div style=""display:flex; align-items:center; gap:12px; margin-top:4px;"">
                        <span onclick=""toggleCommentHeart('${post.id}', '${c.id}')"" style=""cursor:pointer; font-size:12px; color:#64748b; font-weight:700; user-select:none;"">♡ ${(c.hearts || 0)}</span>
                        <button type=""button"" class=""btn-reply-toggle"" onclick=""toggleReplyBox('${c.id}')"">
                            💬 댓글쓰기
                        </button>
                    </div>

                    <!-- 🌟 메디게이트 스타일 대댓글 입력창 (취소 | 등록 포함, 기본 완전 숨김) -->
                    <div class=""medigate-reply-box"" id=""replyBox_${c.id}"" style=""display:none;"">
                        <div style=""display:flex; align-items:flex-start; gap:8px;"">
                            <label for=""fileReplyPhoto_${c.id}"" class=""btn-medigate-camera"" style=""font-size:18px; cursor:pointer; color:#64748b; padding-top:2px;"" title=""사진 첨부"">📷</label>
                            <input type=""file"" id=""fileReplyPhoto_${c.id}"" accept=""image/*"" style=""display:none;"" onchange=""handleReplyPhotoSelect(event, '${c.id}')"">
                            <textarea id=""inpReply_${c.id}"" class=""medigate-reply-textarea"" placeholder=""답글을 남겨주세요..."" onkeydown=""if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); submitPostReply('${post.id}', '${c.id}'); }""></textarea>
                        </div>
                        <div id=""replyPhotoBadge_${c.id}"" style=""display:none; padding-left:26px; font-size:11px; color:#0284c7; align-items:center; gap:6px;"">
                            <span>📷 사진 첨부됨</span>
                            <button type=""button"" onclick=""cancelReplyPhoto('${c.id}')"" style=""background:none; border:none; color:#ef4444; font-size:11px; cursor:pointer;"">✕ 삭제</button>
                        </div>
                        <div style=""display:flex; justify-content:flex-end; align-items:center; gap:10px; padding-top:6px; border-top:1px solid #f1f5f9;"">
                            <button type=""button"" onclick=""toggleReplyBox('${c.id}')"" style=""background:none; border:none; color:#64748b; font-size:12.5px; font-weight:700; cursor:pointer;"">취소</button>
                            <span style=""color:#cbd5e1; font-size:11px;"">|</span>
                            <button type=""button"" onclick=""submitPostReply('${post.id}', '${c.id}')"" style=""background:none; border:none; color:#0284c7; font-size:12.5px; font-weight:900; cursor:pointer;"">등록</button>
                        </div>
                    </div>

                    ${repliesHtml}
                </div>
            `;
        }).join("""");
    }

    // 답글(대댓글) 입력창 토글 (완전 숨김 / 열림)
    function toggleReplyBox(commentId) {
        const box = document.getElementById(""replyBox_"" + commentId);
        if (!box) return;
        const isHidden = (box.style.display === ""none"" || !box.style.display);
        box.style.display = isHidden ? ""flex"" : ""none"";
        if (isHidden) {
            const inp = document.getElementById(""inpReply_"" + commentId);
            if (inp) inp.focus();
        }
    }

    // 답글(대댓글) 등록
    function submitPostReply(postId, commentId) {
        if (!currentViewingPost) return;
        const inp = document.getElementById(""inpReply_"" + commentId);
        if (!inp) return;
        const replyText = (inp.value || """").trim();
        const attachedPhoto = currentReplyAttachedPhotos[commentId] || """";
        if (!replyText && !attachedPhoto) {
            inp.focus();
            return;
        }

        const comments = currentViewingPost.comments || [];
        const targetComment = comments.find(c => String(c.id) === String(commentId));
        if (!targetComment) return;

        if (!Array.isArray(targetComment.replies)) {
            targetComment.replies = [];
        }

        const author = getBoardUserDisplayId();
        targetComment.replies.push({
            id: ""r_"" + Date.now(),
            author: author,
            text: replyText,
            photo: attachedPhoto,
            createdAt: Date.now(),
            date: ""방금 전""
        });

        try {
            let saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
            const idx = saved.findIndex(s => String(s.id) === String(postId));
            if (idx >= 0) {
                saved[idx].comments = currentViewingPost.comments;
            } else {
                saved.unshift({ ...currentViewingPost });
            }
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
        } catch(e) {}

        cancelReplyPhoto(commentId);
        renderPostComments(currentViewingPost);
        renderFullscreenBoard();
    }

    // 답글(대댓글) 삭제
    function deletePostReply(postId, commentId, replyId) {
        if (!confirm(""답글을 삭제하시겠습니까?"")) return;
        if (!currentViewingPost) return;
        const comments = currentViewingPost.comments || [];
        const targetComment = comments.find(c => String(c.id) === String(commentId));
        if (!targetComment || !Array.isArray(targetComment.replies)) return;

        targetComment.replies = targetComment.replies.filter(r => String(r.id) !== String(replyId));

        try {
            let saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
            const idx = saved.findIndex(s => String(s.id) === String(postId));
            if (idx >= 0) {
                saved[idx].comments = currentViewingPost.comments;
            } else {
                saved.unshift({ ...currentViewingPost });
            }
            localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));
        } catch(e) {}

        renderPostComments(currentViewingPost);
        renderFullscreenBoard();
    }

    // 🌟 [사용자 요청] 메디게이트 스타일 상단 댓글 등록 처리 (사진 첨부 지원)
    function submitPostComment() {
        if (!currentViewingPost) return;
        const inputEl = document.getElementById(""inpPostComment"");
        if (!inputEl) return;
        const commentText = (inputEl.value || '').trim();
        if (!commentText && !currentCommentAttachedPhoto) {
            inputEl.focus();
            return;
        }

        let author = getBoardUserDisplayId();

        const newComment = {
            id: ""c_"" + Date.now(),
            createdAt: Date.now(),
            author: author,
            text: commentText,
            photo: currentCommentAttachedPhoto || """",
            hearts: 0,
            date: ""방금 전"",
            replies: []
        };

        if (!Array.isArray(currentViewingPost.comments)) {
            currentViewingPost.comments = [];
        }
        currentViewingPost.comments.push(newComment);

        let saved = [];
        try {
            saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
        } catch(e) {}
        const idx = saved.findIndex(s => String(s.id) === String(currentViewingPost.id));
        if (idx >= 0) {
            saved[idx].comments = currentViewingPost.comments;
        } else {
            saved.unshift({ ...currentViewingPost });
        }
        localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));

        inputEl.value = """";
        cancelCommentPhoto();
        renderPostComments(currentViewingPost);
        renderFullscreenBoard();
    }

    // 🌟 [사용자 요청] 댓글 삭제 처리
    function deletePostComment(postId, commentId) {
        if (!confirm(""댓글을 삭제하시겠습니까?"")) return;
        if (!currentViewingPost || String(currentViewingPost.id) !== String(postId)) return;

        if (Array.isArray(currentViewingPost.comments)) {
            currentViewingPost.comments = currentViewingPost.comments.filter(c => String(c.id) !== String(commentId));
        }

        let saved = [];
        try {
            saved = JSON.parse(localStorage.getItem(""yetalk_unified_board_posts"") || ""[]"");
        } catch(e) {}
        const idx = saved.findIndex(s => String(s.id) === String(postId));
        if (idx >= 0) {
            saved[idx].comments = currentViewingPost.comments;
        } else {
            saved.unshift({ ...currentViewingPost });
        }
        localStorage.setItem(""yetalk_unified_board_posts"", JSON.stringify(saved));

        renderPostComments(currentViewingPost);
        renderFullscreenBoard();
    }

    function closeBoardPostDetail() {
        const modal = document.getElementById(""boardPostDetailModal"");
        if (modal) modal.classList.remove(""show"");
        renderFullscreenBoard();
    }

    ";
            text = text.Substring(0, idxJsRender) + newJsComments + text.Substring(idxJsEnd);
            Console.WriteLine("Updated JavaScript comments logic to Medigate style.");
        }

        File.WriteAllText(path, text, Encoding.UTF8);
        Console.WriteLine("All Medigate comment updates finished successfully.");
    }
}
