using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string filePath = @"assets/index.html";
        string html = File.ReadAllText(filePath, Encoding.UTF8);

        // 1. Replace HTML navigation header in goodnewsMeditationModal
        string oldHtmlHeader = @"                    <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1.5px solid #059669; gap:8px;"">
                        <div style=""display:flex; align-items:center; gap:8px; flex:1; min-width:0;"">
                            <button type=""button"" onclick=""navigateGoodnewsModalChapter(-1)"" title=""이전 장 이동"" style=""background:#f0fdf4; border:1.5px solid #059669; color:#047857; font-size:15px; font-weight:950; padding:4px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(5,150,105,0.15); transition:all 0.15s ease;"">
                                &larr;
                            </button>
                            <span id=""gnModalFullBibleTitle"" style=""font-size:17px; font-weight:950; color:#065f46; letter-spacing:-0.3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"">
                                📖 빌립보서 4장 전체 말씀
                            </span>
                            <button type=""button"" onclick=""navigateGoodnewsModalChapter(1)"" title=""다음 장 이동"" style=""background:#f0fdf4; border:1.5px solid #059669; color:#047857; font-size:15px; font-weight:950; padding:4px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(5,150,105,0.15); transition:all 0.15s ease;"">
                                &rarr;
                            </button>
                        </div>
                        <span style=""font-size:12px; color:#059669; font-weight:800; background:#f0fdf4; padding:3px 9px; border-radius:12px; border:1px solid #bbf7d0; flex-shrink:0;"">개역개정</span>
                    </div>";

        string newHtmlHeader = @"                    <div style=""display:flex; justify-content:center; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1.5px solid #059669; gap:14px; width:100%;"">
                        <button type=""button"" onclick=""navigateGoodnewsModalChapter(-1)"" title=""이전 장 이동"" style=""background:#f0fdf4; border:1.5px solid #059669; color:#047857; font-size:16px; font-weight:950; padding:6px 16px; border-radius:10px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(5,150,105,0.15); transition:all 0.15s ease; flex-shrink:0;"">
                            ◀
                        </button>
                        <span id=""gnModalFullBibleTitle"" style=""font-size:19px; font-weight:950; color:#065f46; letter-spacing:-0.3px; text-align:center; white-space:nowrap;"">
                            요한일서 1장
                        </span>
                        <button type=""button"" onclick=""navigateGoodnewsModalChapter(1)"" title=""다음 장 이동"" style=""background:#f0fdf4; border:1.5px solid #059669; color:#047857; font-size:16px; font-weight:950; padding:6px 16px; border-radius:10px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(5,150,105,0.15); transition:all 0.15s ease; flex-shrink:0;"">
                            ▶
                        </button>
                    </div>";

        if (html.Contains(oldHtmlHeader))
        {
            html = html.Replace(oldHtmlHeader, newHtmlHeader);
            Console.WriteLine("Replaced oldHtmlHeader with centered nav triangles and no emoticon / no 개역개정 badge");
        }
        else
        {
            Console.WriteLine("WARN: oldHtmlHeader not found exact match!");
        }

        // 2. Replace JS title assignment in renderGoodnewsModalChapter
        string oldJsTitle = "bibleTitle.innerText = `📖 ${currentGnBook} ${currentGnCh}장 전체 말씀`;";
        string newJsTitle = "bibleTitle.innerText = `${currentGnBook} ${currentGnCh}장`;";

        if (html.Contains(oldJsTitle))
        {
            html = html.Replace(oldJsTitle, newJsTitle);
            Console.WriteLine("Replaced oldJsTitle with clean title");
        }
        else
        {
            Console.WriteLine("WARN: oldJsTitle not found exact match!");
        }

        File.WriteAllText(filePath, html, new UTF8Encoding(false));
        Console.WriteLine("Wrote assets/index.html successfully.");
    }
}
