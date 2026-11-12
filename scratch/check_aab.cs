using System;
using System.IO;
using System.IO.Compression;

class Program
{
    static void Main()
    {
        using (ZipArchive zip = ZipFile.OpenRead(@"app\release\app-release.aab"))
        {
            var entry = zip.GetEntry("base/manifest/AndroidManifest.xml");
            if (entry != null)
            {
                using (var stream = entry.Open())
                using (var ms = new MemoryStream())
                {
                    stream.CopyTo(ms);
                    byte[] bytes = ms.ToArray();
                    string str = System.Text.Encoding.UTF8.GetString(bytes);
                    Console.WriteLine("Bytes: " + bytes.Length);
                    // Search for 1.0.5 or 1.0.6
                    bool has105 = str.Contains("1.0.5");
                    bool has106 = str.Contains("1.0.6");
                    Console.WriteLine("Contains 1.0.5: " + has105);
                    Console.WriteLine("Contains 1.0.6: " + has106);
                }
            }
        }
    }
}
