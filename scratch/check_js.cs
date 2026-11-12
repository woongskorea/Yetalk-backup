using System;
using System.IO;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        string html = File.ReadAllText(@"c:\Users\Administrator\AndroidStudioProjects\Yetalk\assets\index.html");
        
        var matches = Regex.Matches(html, @"<script(?![^>]*src)(?![^>]*module)[^>]*>(.*?)</script>", RegexOptions.Singleline | RegexOptions.IgnoreCase);
        Console.WriteLine("Found inline scripts: " + matches.Count);

        for (int i = 0; i < matches.Count; i++)
        {
            string js = matches[i].Groups[1].Value;
            File.WriteAllText(string.Format(@"c:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\test_script_{0}.js", i), js);
            Console.WriteLine(string.Format("Script {0}: length={1}", i, js.Length));
        }
    }
}
