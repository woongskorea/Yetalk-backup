using System;
using System.IO;
using System.Text;

class ApplySubtitleFix
{
    static void Main()
    {
        string[] paths = new string[]
        {
            @"assets\index.html",
            @"docs\index.html",
            @"app\src\main\assets\index.html"
        };

        foreach (string path in paths)
        {
            if (!File.Exists(path))
            {
                Console.WriteLine("File not found: " + path);
                continue;
            }

            string content = File.ReadAllText(path, Encoding.UTF8).Replace("\r\n", "\n");

            // 1. In HTML template, increase font size by 1px (14px -> 15px)
            content = content.Replace(
                @"<div class=""bible-reading-sub-title"" id=""bbrChapterSubtitle"" style=""font-size:14px; color:#047857; font-weight:850; line-height:1.4;"">",
                @"<div class=""bible-reading-sub-title"" id=""bbrChapterSubtitle"" style=""font-size:15px; color:#047857; font-weight:900; line-height:1.4;"">"
            );

            // 2. In JS renderUserBibleReading(), eliminate duplicate '성경 1장' and set font size to 15px
            string targetOld = @"        const item = getBibleChapterItem(currentUserBibleBook, currentUserBibleCh);
        if (subTitleEl) {
            subTitleEl.style.color = ""#047857"";
            subTitleEl.innerText = `${item.title}: ${item.subtitle || '말씀 묵상 및 성경 통독'}`;
        }";

            string replacementNew = @"        const item = getBibleChapterItem(currentUserBibleBook, currentUserBibleCh);
        if (subTitleEl) {
            subTitleEl.style.color = ""#047857"";
            subTitleEl.style.fontSize = ""15px"";
            // 🌟 [사용자 요청] 성경본문 시작전 '창세기 1장: 창세기 1장...' 처럼 중복되는 부분 하나로 줄이고 1px 크게
            let sub = (item.subtitle || '개역개정 말씀 통독').trim();
            if (sub.startsWith(item.title)) {
                subTitleEl.innerText = sub;
            } else {
                subTitleEl.innerText = `${item.title} ${sub}`.trim();
            }
        }";

            if (content.Contains(targetOld))
            {
                content = content.Replace(targetOld, replacementNew);
            }
            else
            {
                Console.WriteLine("Warning: targetOld not found in " + path);
            }

            File.WriteAllText(path, content, new UTF8Encoding(false));
            Console.WriteLine("SUCCESS: Updated " + path);
        }
    }
}
