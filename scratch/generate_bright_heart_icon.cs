using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

class GenerateBrightHeartIcon
{
    static string brainDir = @"C:\Users\Administrator\.gemini\antigravity\brain\78025a7f-688c-412d-8f11-e2ca21c51220";
    static string projectDir = @"c:\Users\Administrator\AndroidStudioProjects\Yetalk";
    static string desktopDir = @"C:\Users\Administrator\Desktop";

    static void Main()
    {
        string rawSpritePath = Path.Combine(brainDir, "extracted_ye_heart.png");
        string brightSpritePath = Path.Combine(brainDir, "extracted_ye_bright_heart.png");

        string out1024 = Path.Combine(brainDir, "yetalk_icon_uncut_1024.png");
        string out512 = Path.Combine(brainDir, "yetalk_icon_uncut_512.png");
        string mockupOut = Path.Combine(brainDir, "yetalk_bright_heart_comparison.png");

        // 1. 하트의 3D 풍선 입체감은 100% 살리고, 색상을 화사하고 밝은 비비드 루비 레드로 정밀 보정
        using (Bitmap orig = new Bitmap(rawSpritePath))
        using (Bitmap bright = ProcessHeart(orig, 1.45f, 0.62f, 1.2f))
        {
            bright.Save(brightSpritePath, ImageFormat.Png);
        }

        // 2. 도톰해진 파란색 네온 테두리 + 밝고 화사해진 3D 레드 하트 아이콘 렌더링
        RenderIcon(brightSpritePath, out1024, 1024);
        RenderIcon(brightSpritePath, out512, 512);

        // 3. 홈화면 시뮬레이션 비교 이미지 생성
        RenderComparisonMockup(out512, mockupOut);

        // 4. 안드로이드 mipmap 리소스에 즉시 배포 (런처 아이콘 10종)
        DeployToAndroidMipmap(out512);

        // 5. 프로젝트 루트 및 바탕화면 플레이스토어 아이콘 동기화
        string playIconProject = Path.Combine(projectDir, "yetalk_playstore_icon_512.png");
        string playIcon1024Project = Path.Combine(projectDir, "yetalk_playstore_icon_1024.png");
        File.Copy(out512, playIconProject, true);
        File.Copy(out1024, playIcon1024Project, true);

        if (Directory.Exists(desktopDir))
        {
            string playIconDesktop = Path.Combine(desktopDir, "예톡_플레이스토어_아이콘_512.png");
            string compDesktop = Path.Combine(desktopDir, "예톡_아이콘_비교확인.png");
            File.Copy(out512, playIconDesktop, true);
            File.Copy(mockupOut, compDesktop, true);
        }

        Console.WriteLine("Bright 3D Heart Icon deployed successfully!");
    }

    static Bitmap ProcessHeart(Bitmap orig, float mult, float gamma, float satMult)
    {
        Bitmap res = new Bitmap(orig.Width, orig.Height, PixelFormat.Format32bppArgb);
        for (int y = 0; y < orig.Height; y++)
        {
            for (int x = 0; x < orig.Width; x++)
            {
                Color c = orig.GetPixel(x, y);
                if (c.A == 0)
                {
                    res.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                    continue;
                }

                bool inHeartBox = (x >= 320 && y <= 190);
                bool isWhiteLetter = (c.R > 190 && c.G > 190 && c.B > 190 && Math.Abs(c.R - c.G) < 25 && Math.Abs(c.R - c.B) < 25);

                if (inHeartBox && !isWhiteLetter && (c.R > c.G + 12 || c.R > c.B + 12))
                {
                    float r = c.R / 255f;
                    float g = c.G / 255f;
                    float b = c.B / 255f;

                    float minRgb = Math.Min(r, Math.Min(g, b));
                    float isHighlight = (minRgb > 0.65f) ? (minRgb - 0.65f) / 0.35f : 0f;

                    float newR = (float)Math.Pow(r, gamma) * mult;
                    if (newR > 1f) newR = 1f;

                    float newG = g * (float)Math.Pow(g / (r + 0.001f), 0.2f) * mult;
                    float newB = b * (float)Math.Pow(b / (r + 0.001f), 0.2f) * mult;

                    if (isHighlight < 0.5f)
                    {
                        newG *= (1f / satMult);
                        newB *= (1f / satMult);
                    }

                    if (isHighlight > 0f)
                    {
                        newR = newR * (1f - isHighlight) + r * isHighlight;
                        newG = newG * (1f - isHighlight) + g * isHighlight;
                        newB = newB * (1f - isHighlight) + b * isHighlight;
                    }

                    int finalR = Math.Min(255, Math.Max(0, (int)(newR * 255)));
                    int finalG = Math.Min(255, Math.Max(0, (int)(newG * 255)));
                    int finalB = Math.Min(255, Math.Max(0, (int)(newB * 255)));

                    res.SetPixel(x, y, Color.FromArgb(c.A, finalR, finalG, finalB));
                }
                else
                {
                    res.SetPixel(x, y, c);
                }
            }
        }
        return res;
    }

    static GraphicsPath CreateSquirclePath(RectangleF rect, float radius)
    {
        GraphicsPath path = new GraphicsPath();
        float x = rect.X, y = rect.Y, w = rect.Width, h = rect.Height;
        float d = radius * 2;
        path.AddArc(x, y, d, d, 180, 90);
        path.AddArc(x + w - d, y, d, d, 270, 90);
        path.AddArc(x + w - d, y + h - d, d, d, 0, 90);
        path.AddArc(x, y + h - d, d, d, 90, 90);
        path.CloseFigure();
        return path;
    }

    static void RenderIcon(string spritePath, string destPath, int size)
    {
        float scale = size / 1024f;

        using (Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb))
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;

            // 1. 깊은 우주 네이비 블랙 배경
            RectangleF fullRect = new RectangleF(0, 0, size, size);
            using (LinearGradientBrush bgBrush = new LinearGradientBrush(
                new Point(0, 0), new Point(size, size),
                Color.FromArgb(255, 8, 14, 24),
                Color.FromArgb(255, 2, 4, 10)))
            {
                g.FillRectangle(bgBrush, fullRect);
            }

            // 중앙 코스믹 오라
            using (GraphicsPath radPath = new GraphicsPath())
            {
                radPath.AddEllipse(size * 0.1f, size * 0.1f, size * 0.8f, size * 0.8f);
                using (PathGradientBrush pgb = new PathGradientBrush(radPath))
                {
                    pgb.CenterColor = Color.FromArgb(95, 0, 185, 255);
                    pgb.SurroundColors = new Color[] { Color.Transparent };
                    g.FillPath(pgb, radPath);
                }
            }

            // 2. 도톰하고 또렷한 파란색 네온 테두리 (1.7배 두께, Safe-Zone 최적화)
            float borderMargin = 64f * scale;
            float borderRadius = (size - borderMargin * 2) * 0.24f;
            RectangleF borderRect = new RectangleF(borderMargin, borderMargin, size - borderMargin * 2, size - borderMargin * 2);

            using (GraphicsPath borderPath = CreateSquirclePath(borderRect, borderRadius))
            {
                using (Pen glow0 = new Pen(Color.FromArgb(50, 0, 160, 255), 72f * scale)) { g.DrawPath(glow0, borderPath); }
                using (Pen glow1 = new Pen(Color.FromArgb(95, 0, 195, 255), 50f * scale)) { g.DrawPath(glow1, borderPath); }
                using (Pen glow2 = new Pen(Color.FromArgb(160, 0, 220, 255), 34f * scale)) { g.DrawPath(glow2, borderPath); }
                using (Pen tubePen = new Pen(Color.FromArgb(255, 0, 235, 255), 25f * scale)) { g.DrawPath(tubePen, borderPath); }
                using (Pen corePen = new Pen(Color.FromArgb(255, 140, 250, 255), 13f * scale)) { g.DrawPath(corePen, borderPath); }
            }

            // 3. '예 + 밝고 화사해진 3D 레드 하트' 정중앙 안착
            if (File.Exists(spritePath))
            {
                using (Image sprite = Image.FromFile(spritePath))
                {
                    float targetW = 635f * scale;
                    float targetH = 622f * scale;

                    float posX = (size - targetW) / 2f;
                    float posY = (size - targetH) / 2f + (3f * scale);

                    g.DrawImage(sprite, new RectangleF(posX, posY, targetW, targetH));
                }
            }

            bmp.Save(destPath, ImageFormat.Png);
        }
    }

    static void RenderComparisonMockup(string newIconPath, string destPath)
    {
        string oldIconPath = Path.Combine(brainDir, "yetalk_icon_uncut_512.png"); // The previous thick border with dark heart
        int w = 1000, h = 540;

        using (Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb))
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;

            // 스마트폰 홈화면 배경
            using (LinearGradientBrush bg = new LinearGradientBrush(
                new Point(0, 0), new Point(0, h),
                Color.FromArgb(255, 55, 90, 115),
                Color.FromArgb(255, 28, 50, 68)))
            {
                g.FillRectangle(bg, 0, 0, w, h);
            }

            // 상단 제목
            using (Font titleF = new Font("Malgun Gothic", 18, FontStyle.Bold))
            using (SolidBrush tb = new SolidBrush(Color.White))
            {
                g.DrawString("🎈 [요청 반영] 3D 풍선 하트 밝기 개선 & 선명한 파란 테두리", titleF, tb, 40, 25);
            }
            using (Font subF = new Font("Malgun Gothic", 12f, FontStyle.Regular))
            using (SolidBrush sb = new SolidBrush(Color.FromArgb(203, 213, 225)))
            {
                g.DrawString("풍선 같은 입체감과 광택은 그대로 살리면서, 어두웠던 와인빛 레드를 화사한 비비드 루비 레드로 업그레이드!", subF, sb, 42, 62);
            }

            int iconSize = 160;
            int startX = 140;
            int gap = 380;
            int iconY = 125;

            // 1. 이전 버전 (어두웠던 하트)
            string prevDarkIcon = Path.Combine(brainDir, "yetalk_icon_thick_border_prev.png");
            if (!File.Exists(prevDarkIcon) && File.Exists(oldIconPath))
            {
                File.Copy(oldIconPath, prevDarkIcon, true);
            }
            if (File.Exists(prevDarkIcon))
            {
                DrawMockupWithPhoneMask(g, startX, iconY, iconSize, prevDarkIcon, "이전 (다소 어두운 하트)", "• 와인빛이 돌아 약간 어두움\n• 도톰한 파란 테두리 적용 상태", Color.FromArgb(220, 160, 160));
            }

            // 2. 신규 버전 (화사하고 밝아진 3D 풍선 하트)
            if (File.Exists(newIconPath))
            {
                DrawMockupWithPhoneMask(g, startX + gap, iconY, iconSize, newIconPath, "예톡 (화사한 3D 하트 최종본)", "★ 3D 풍선 입체감 & 광택 100% 보존!\n★ 산뜻하고 밝은 화사한 루비 레드\n★ 시원하고 또렷한 파란색 네온 테두리", Color.FromArgb(255, 80, 110));
            }

            bmp.Save(destPath, ImageFormat.Png);
        }
    }

    static void DrawMockupWithPhoneMask(Graphics g, int x, int y, int size, string iconPath, string name, string sub, Color badgeColor)
    {
        using (SolidBrush shadow = new SolidBrush(Color.FromArgb(80, 0, 0, 0)))
        {
            using (GraphicsPath sp = CreateSquirclePath(new RectangleF(x + 2, y + 8, size, size), size * 0.23f))
            {
                g.FillPath(shadow, sp);
            }
        }

        if (File.Exists(iconPath))
        {
            using (Image img = Image.FromFile(iconPath))
            {
                GraphicsState state = g.Save();
                using (GraphicsPath clip = CreateSquirclePath(new RectangleF(x, y, size, size), size * 0.23f))
                {
                    g.SetClip(clip);
                    g.DrawImage(img, x, y, size, size);
                }
                g.Restore(state);
            }
        }

        using (Font nameF = new Font("Malgun Gothic", 14f, FontStyle.Bold))
        using (SolidBrush nb = new SolidBrush(Color.White))
        {
            SizeF ns = g.MeasureString(name, nameF);
            g.DrawString(name, nameF, nb, x + (size - ns.Width) / 2f, y + size + 16);
        }

        using (Font subF = new Font("Malgun Gothic", 10.5f, FontStyle.Regular))
        using (SolidBrush sb = new SolidBrush(badgeColor))
        {
            string[] lines = sub.Split('\n');
            float curY = y + size + 42;
            foreach (string line in lines)
            {
                SizeF ss = g.MeasureString(line, subF);
                g.DrawString(line, subF, sb, x + (size - ss.Width) / 2f, curY);
                curY += 19;
            }
        }
    }

    static void DeployToAndroidMipmap(string icon512Path)
    {
        string resDir = Path.Combine(projectDir, "app", "src", "main", "res");
        var sizes = new System.Collections.Generic.Dictionary<string, int>
        {
            { "mipmap-mdpi", 48 },
            { "mipmap-hdpi", 72 },
            { "mipmap-xhdpi", 96 },
            { "mipmap-xxhdpi", 144 },
            { "mipmap-xxxhdpi", 192 }
        };

        using (Image src = Image.FromFile(icon512Path))
        {
            foreach (var kvp in sizes)
            {
                string targetFolder = Path.Combine(resDir, kvp.Key);
                if (!Directory.Exists(targetFolder)) Directory.CreateDirectory(targetFolder);

                string outPath = Path.Combine(targetFolder, "ic_launcher.png");
                string outRoundPath = Path.Combine(targetFolder, "ic_launcher_round.png");

                ResizeAndSave(src, outPath, kvp.Value);
                ResizeAndSave(src, outRoundPath, kvp.Value);
            }
        }
    }

    static void ResizeAndSave(Image src, string destPath, int size)
    {
        using (Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb))
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.DrawImage(src, 0, 0, size, size);
            bmp.Save(destPath, ImageFormat.Png);
        }
    }
}
