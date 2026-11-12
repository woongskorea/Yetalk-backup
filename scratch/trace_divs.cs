using System;
using System.IO;
using System.Text.RegularExpressions;

class TraceDivs
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
                Console.WriteLine("main-container starts at line: " + mainStart);
                depth = 1;
                continue;
            }

            if (mainStart != -1)
            {
                // Count opening divs
                var openMatches = Regex.Matches(line, @"<div[\s>]", RegexOptions.IgnoreCase);
                var closeMatches = Regex.Matches(line, @"</div>", RegexOptions.IgnoreCase);

                depth += openMatches.Count;
                depth -= closeMatches.Count;

                if (line.Contains("PARTNER WINGS") || line.Contains("superAdminSecretTrigger") || depth <= 0)
                {
                    Console.WriteLine(string.Format("Line {0} (depth {1}): {2}", i + 1, depth, line.Trim()));
                }

                if (depth <= 0)
                {
                    Console.WriteLine("main-container CLOSED at line: " + (i + 1));
                    break;
                }
            }
        }
    }
}
