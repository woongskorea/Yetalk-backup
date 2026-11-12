using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        string p = @"assets/index.html";
        string c = File.ReadAllText(p, Encoding.UTF8);

        string oldTarget = @"    window.openKkajitgeotModal = openKkajitgeotModal;";
        string newText = @"    window.openDailyRepentVictoryModal = openDailyRepentVictoryModal;
    window.closeDailyRepentVictoryModal = closeDailyRepentVictoryModal;
    window.openKkajitgeotModal = openKkajitgeotModal;";

        if (!c.Contains(oldTarget))
        {
            Console.WriteLine("Target not found!");
            return;
        }

        c = c.Replace(oldTarget, newText);
        File.WriteAllText(p, c, new UTF8Encoding(false));
        Console.WriteLine("Success: window binding added!");
    }
}
