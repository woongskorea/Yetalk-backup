using System;
using System.IO;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        string js = File.ReadAllText(@"c:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\test_script_0.js");
        
        string html = "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body>"
            + "<div id='testOutput'></div>"
            + "<script>"
            + "window.onerror = function(msg, url, line, col, err) {"
            + "  document.getElementById('testOutput').innerText = 'ERROR: ' + msg + ' at line ' + line + ':' + col + (err ? ' ' + err.stack : '');"
            + "};"
            + "</script>"
            + "<script>\n" + js + "\n</script>"
            + "<script>"
            + "if (!document.getElementById('testOutput').innerText) {"
            + "  document.getElementById('testOutput').innerText = 'SUCCESS: NO_SYNTAX_ERROR';"
            + "}"
            + "</script></body></html>";

        File.WriteAllText(@"c:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\test_eval2.html", html);
    }
}
