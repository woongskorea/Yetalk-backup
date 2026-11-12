using System;
using System.IO;
using System.Text.RegularExpressions;

class TraceDivs2
{
    static void Main()
    {
        string[] lines = File.ReadAllLines(@"c:\Users\Administrator\AndroidStudioProjects\Yetalk\assets\index.html");
        int depth = 0;
        int mainStart = -1;

        for (int i = 0; i < lines.Length; i++)
        {
            string line = lines[i];

            if (line.Contains("<div class=\"main-container\">"))
            {
                mainStart = i + 1;
                depth = 1;
                continue;
            }

            if (mainStart != -1)
            {
                var openMatches = Regex.Matches(line, @"<div[\s>]", RegexOptions.IgnoreCase);
                var closeMatches = Regex.Matches(line, @"</div>", RegexOptions.IgnoreCase);

                depth += openMatches.Count;
                depth -= closeMatches.Count;

                if (i + 1 >= 4540 && i + 1 <= 4625)
                {
                    Console.WriteLine(string.Format("L{0} [depth={1}]: {2}", i + 1, depth, line.Trim()));
                }
            }
        }
    }
}
