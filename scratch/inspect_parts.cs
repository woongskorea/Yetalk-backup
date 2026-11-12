using System;
using System.IO;
using System.Text;

class Program {
    static void Main() {
        var lines = File.ReadAllLines(assets/index.html, Encoding.UTF8);
        Action<int, int> printRange = (start, count) => {
            Console.WriteLine(=== LINES  + start +  to  + (start + count) +  ===);
            for (int i = start; i < start + count && i < lines.Length; i++) {
                Console.WriteLine((i + 1) + :  + lines[i]);
            }
        };

        // communitySubChannelsBar
        printRange(4368, 20);
        // boardFullscreenOverlay tabs
        printRange(5415, 40);
        // cafeWriteModal chips
        printRange(5455, 30);
        // boardPostDetailModal HTML
        printRange(5500, 75);
    }
}
