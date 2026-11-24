using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

class ThickBlueBorderIcon
{
    static string brainDir = @"C:\Users\Administrator\.gemini\antigravity\brain\78025a7f-688c-412d-8f11-e2ca21c51220";
    static string projectDir = @"c:\Users\Administrator\AndroidStudioProjects\Yetalk";
    static string desktopDir = @"C:\Users\Administrator\Desktop";

    static void Main()
    {
        string spritePath = Path.Combine(brainDir, "extracted_ye_heart.png");
        string out1024 = Path.Combine(brainDir, "yetalk_icon_uncut_1024.png");
        string out512 = Path.Combine(brainDir, "yetalk_icon_uncut_512.png");
        string mockupOut = Path.Combine(brainDir, "yetalk_icon_thick_border_comparison.png");

        // 1. 파란색 테두리를 조금 더 두껍고 또렷하게 렌더링 (Safe-Zone 완벽 유지)
        RenderIcon(spritePath, out1024, 1024);
        RenderIcon(spritePath, out512, 512);

        // 2. 홈화면 시뮬레이션 비교 (이전 얇은 테두리 vs 신규 두꺼운 테두리)
        RenderComparisonMockup(out512, mockupOut);

        // 3. 안드로이드 mipmap 리소스에 즉시 배포
        DeployToAndroidMipmap(out512);

        // 4. 프로젝트 루트 및 바탕화면 플레이스토어 아이콘 동기화
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

        Console.WriteLine("Thick blue border icon generated and deployed successfully!");
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

            // 1. 배경 Full-bleed (깊은 우주 네이비 블랙)
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

            // 2. 🌟 [대표님 요청 반영] 파랑색 테두리를 시원하고 또렷하게 두껍게 보강!
            // 기존: tube 14f, core 7f -> 변경: tube 25f, core 13f (약 1.7배 두껍고 선명)
            float borderMargin = 64f * scale;
            float borderRadius = (size - borderMargin * 2) * 0.24f;
            RectangleF borderRect = new RectangleF(borderMargin, borderMargin, size - borderMargin * 2, size - borderMargin * 2);

            using (GraphicsPath borderPath = CreateSquirclePath(borderRect, borderRadius))
            {
                // 풍부하고 영롱한 일렉트릭 블루/시안 네온 글로우 & 두꺼운 테두리 선
                using (Pen glow0 = new Pen(Color.FromArgb(50, 0, 160, 255), 72f * scale)) { g.DrawPath(glow0, borderPath); }
                using (Pen glow1 = new Pen(Color.FromArgb(95, 0, 195, 255), 50f * scale)) { g.DrawPath(glow1, borderPath); }
                using (Pen glow2 = new Pen(Color.FromArgb(160, 0, 220, 255), 34f * scale)) { g.DrawPath(glow2, borderPath); }
                using (Pen tubePen = new Pen(Color.FromArgb(255, 0, 235, 255), 25f * scale)) { g.DrawPath(tubePen, borderPath); }
                using (Pen corePen = new Pen(Color.FromArgb(255, 140, 250, 255), 13f * scale)) { g.DrawPath(corePen, borderPath); }
            }

            // 3. '예 + 원본 하트' 정중앙 안착
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
        string oldIconPath = Path.Combine(brainDir, "yetalk_icon_uncut_comparison.png"); // or previous uncut 512
        // We will make a side-by-side mockup: [기존 얇은 테두리] vs [새로운 또렷한 파란 테두리]
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
                g.DrawString("📱 [요청 반영] 예톡 앱 파란색 테두리 두께 보강 비교", titleF, tb, 40, 25);
            }
            using (Font subF = new Font("Malgun Gothic", 12f, FontStyle.Regular))
            using (SolidBrush sb = new SolidBrush(Color.FromArgb(203, 213, 225)))
            {
                g.DrawString("핸드폰 홈 화면 작은 아이콘에서도 파란 테두리가 더욱 선명하고 또렷하게 눈에 띕니다", subF, sb, 42, 62);
            }

            int iconSize = 160;
            int startX = 140;
            int gap = 380;
            int iconY = 125;

            // 1. 이전 버전 (기존 얇은 테두리)
            string prev512 = Path.Combine(brainDir, "yetalk_icon_perfect_symmetric_512.png");
            if (File.Exists(prev512))
            {
                DrawMockupWithPhoneMask(g, startX, iconY, iconSize, prev512, "이전 (기존 테두리)", "• 테두리 선이 다소 얇아서\n• 먼 거리에서 보면 가늘게 보임", Color.FromArgb(200, 200, 200));
            }

            // 2. 신규 버전 (두껍고 또렷해진 파란색 테두리)
            if (File.Exists(newIconPath))
            {
                DrawMockupWithPhoneMask(g, startX + gap, iconY, iconSize, newIconPath, "예톡 (파란 테두리 보강)", "★ 파란색 네온 테두리 1.7배 도톰 보강!\n★ 홈 화면에서 훨씬 시원하고 또렷함\n★ 코너 잘림 없는 완벽한 Safe-Zone", Color.FromArgb(0, 235, 255));
            }

            bmp.Save(destPath, ImageFormat.Png);
        }
    }

    static void DrawMockupWithPhoneMask(Graphics g, int x, int y, int size, string iconPath, string name, string sub, Color badgeColor)
    {
        // 폰 그림자
        using (SolidBrush shadow = new SolidBrush(Color.FromArgb(80, 0, 0, 0)))
        {
            using (GraphicsPath sp = CreateSquirclePath(new RectangleF(x + 2, y + 8, size, size), size * 0.23f))
            {
                g.FillPath(shadow, sp);
            }
        }

        // 폰 런처의 스쿼클 마스크로 자른 실제 아이콘 모습
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

        // 라벨 렌더링
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
