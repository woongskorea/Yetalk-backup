using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string[] lines = File.ReadAllLines(@"assets\index.html", Encoding.UTF8);
        for (int i = 0; i < lines.Length; i++)
        {
            if (lines[i].Contains("yetalk_user_name") || lines[i].Contains("yetalk_church_name"))
            {
                Console.WriteLine(string.Format("L{0}: {1}", i + 1, lines[i].Trim()));
            }
        }
    }
}
