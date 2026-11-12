using System;
using System.IO;

class Program
{
    static void Main()
    {
        string p = @"app\build.gradle.kts";
        string s = File.ReadAllText(p);
        s = s.Replace("versionCode = 6", "versionCode = 7");
        s = s.Replace("\"1.0.5\"", "\"1.0.6\"");
        File.WriteAllText(p, s);
        Console.WriteLine("Done bumping to 7 (1.0.6)!");
    }
}
