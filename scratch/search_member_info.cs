using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        string[] files = Directory.GetFiles("assets", "*.html");
        string[] keywords = new[] { "yetalk_user_name", "yetalk_church_name", "yetalk_pastor_name", "yetalk_church_role", "최베드로", "부산제일감리교회" };

        foreach (var file in files)
        {
            string text = File.ReadAllText(file, Encoding.UTF8);
            foreach (var kw in keywords)
            {
                int count = Regex.Matches(text, Regex.Escape(kw)).Count;
                if (count > 0)
                {
                    Console.WriteLine(string.Format("{0}: {1} ({2} times)", Path.GetFileName(file), kw, count));
                }
            }
        }
    }
}
