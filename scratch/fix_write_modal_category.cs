using System;
using System.IO;
using System.Text;

class FixWriteModalCategory
{
    static void Main()
    {
        string[] files = new string[] {
            @"c:\Users\Administrator\AndroidStudioProjects\Yetalk\assets\index.html",
            @"c:\Users\Administrator\AndroidStudioProjects\Yetalk\docs\index.html",
            @"c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\index.html"
        };

        foreach (var path in files)
        {
            if (!File.Exists(path)) continue;
            string text = File.ReadAllText(path, Encoding.UTF8).Replace("\r\n", "\n");

            string oldBlock = @"            if (titleEl) titleEl.innerText = ""✍️ 자유게시판 글쓰기"";
            if (idInput) idInput.value = """";
            if (titleInput) titleInput.value = """";
            if (contentTextarea) contentTextarea.value = """";
            setCafeActiveCatChip('일상나눔');";

            string newBlock = @"            if (titleEl) titleEl.innerText = `✍️ ${currentBoardCategory || '커뮤니티'} 글쓰기`;
            if (idInput) idInput.value = """";
            if (titleInput) titleInput.value = """";
            if (contentTextarea) contentTextarea.value = """";
            setCafeActiveCatChip(currentBoardCategory || '감사게시판');";

            if (text.Contains(oldBlock))
            {
                text = text.Replace(oldBlock, newBlock);
                Console.WriteLine("Updated openCafeWriteModal empty state in: " + path);
            }

            string oldSetChip = @"    function setCafeActiveCatChip(cat) {
        currentCafeCat = cat;
        const chips = document.querySelectorAll(""#cafeCategoryBar .cafe-cat-chip"");
        chips.forEach(c => {
            if (c.innerText.trim() === cat) c.classList.add(""active"");
            else c.classList.remove(""active"");
        });
    }";

            string newSetChip = @"    function setCafeActiveCatChip(cat) {
        currentCafeCat = cat;
        const chips = document.querySelectorAll(""#cafeCategoryBar .cafe-cat-chip"");
        chips.forEach(c => {
            if (c.innerText.indexOf(cat) >= 0 || cat.indexOf(c.innerText.trim()) >= 0) c.classList.add(""active"");
            else c.classList.remove(""active"");
        });
    }";

            if (text.Contains(oldSetChip))
            {
                text = text.Replace(oldSetChip, newSetChip);
                Console.WriteLine("Updated setCafeActiveCatChip in: " + path);
            }

            File.WriteAllText(path, text, new UTF8Encoding(false));
        }

        Console.WriteLine("Done.");
    }
}
