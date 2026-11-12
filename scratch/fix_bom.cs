using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string p = @"app\src\main\java\com\example\yetalk\MainActivity.kt";
        string s = File.ReadAllText(p);
        File.WriteAllText(p, s, new UTF8Encoding(false));
        Console.WriteLine("Done fix bom!");
    }
}
