using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

class RenderAdmob100pxPreview
{
    static string brainDir = @"C:\Users\Administrator\.gemini\antigravity\brain\78025a7f-688c-412d-8f11-e2ca21c51220";
    static string desktopDir = @"C:\Users\Administrator\Desktop";

    static void Main()
    {
        string outPath = Path.Combine(brainDir, "admob_100px_preview.png");
        int w = 500, h = 720;

        using (Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb))
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.Clear(Color.FromArgb(255, 248, 250, 252)); // Light background

            // Header Simulation (Upper content)
            using (Font titleF = new Font("Malgun Gothic", 15, FontStyle.Bold))
            using (SolidBrush tb = new SolidBrush(Color.FromArgb(15, 23, 42)))
            {
                g.DrawString("📱 [실제 100px 규격] 점잖은 글 위주 애드몹 적용 화면", titleF, tb, 25, 20);
            }

            // 1. 네 개 사각형 버튼 영역 시뮬레이션
            int btnY = 65;
            Draw4Buttons(g, 25, btnY, 450);

            // 2. 감사 배너 (예수님 사랑합니다. 감사합니다 + 하트)
            int bannerY = 160;
            DrawThanksBanner(g, 25, bannerY, 450);

            // 3. 오늘 복음 / 영접 기도 버튼
            int prayY = 230;
            DrawPrayButtons(g, 25, prayY, 450);

            // 4. 병원 배너
            int clinicY = 295;
            DrawClinicBanner(g, 25, clinicY, 450);

            // 5. 🌟 최하단 고정 100px 대형 애드몹 배너 (Real 100px)
            int admobBarY = 560;
            DrawAdmob100pxBar(g, 0, admobBarY, w, 160);

            bmp.Save(outPath, ImageFormat.Png);

            if (Directory.Exists(desktopDir))
            {
                string dtPath = Path.Combine(desktopDir, "예톡_100px_애드몹_시안확인.png");
                File.Copy(outPath, dtPath, true);
            }

            Console.WriteLine("Preview saved: " + outPath);
        }
    }

    static void Draw4Buttons(Graphics g, int x, int y, int width)
    {
        int bw = (width - 24) / 4;
        string[] labels = { "매일회개\n영적승리", "까짓것\n별거아냐", "예톡\n사용법", "교회·성경\n검색" };
        Color[] bgColors = { Color.FromArgb(239, 246, 255), Color.FromArgb(254, 242, 242), Color.FromArgb(254, 252, 232), Color.FromArgb(240, 253, 244) };
        Color[] borderColors = { Color.FromArgb(191, 219, 254), Color.FromArgb(254, 202, 202), Color.FromArgb(254, 240, 138), Color.FromArgb(187, 247, 208) };
        Color[] textColors = { Color.FromArgb(29, 78, 216), Color.FromArgb(185, 28, 28), Color.FromArgb(161, 98, 7), Color.FromArgb(21, 128, 61) };

        using (Font f = new Font("Malgun Gothic", 10.5f, FontStyle.Bold))
        {
            for (int i = 0; i < 4; i++)
            {
                int bx = x + i * (bw + 8);
                Rectangle r = new Rectangle(bx, y, bw, 75);
                using (SolidBrush sb = new SolidBrush(bgColors[i]))
                using (Pen p = new Pen(borderColors[i], 1.5f))
                {
                    g.FillRectangle(sb, r);
                    g.DrawRectangle(p, r);
                }
                using (SolidBrush tb = new SolidBrush(textColors[i]))
                using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
                {
                    g.DrawString(labels[i], f, tb, r, sf);
                }
            }
        }
    }

    static void DrawThanksBanner(Graphics g, int x, int y, int width)
    {
        Rectangle r = new Rectangle(x, y, width, 55);
        using (SolidBrush sb = new SolidBrush(Color.FromArgb(254, 252, 232)))
        using (Pen p = new Pen(Color.FromArgb(254, 240, 138), 1.5f))
        {
            g.FillRectangle(sb, r);
            g.DrawRectangle(p, r);
        }
        using (Font f = new Font("Malgun Gothic", 13.5f, FontStyle.Bold))
        using (SolidBrush tb = new SolidBrush(Color.FromArgb(120, 53, 15)))
        using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
        {
            g.DrawString("🤍   예수님 사랑합니다. 감사합니다   ❤️", f, tb, r, sf);
        }
    }

    static void DrawPrayButtons(Graphics g, int x, int y, int width)
    {
        int bw = (width - 12) / 2;
        Rectangle r1 = new Rectangle(x, y, bw, 50);
        Rectangle r2 = new Rectangle(x + bw + 12, y, bw, 50);

        using (SolidBrush b1 = new SolidBrush(Color.FromArgb(240, 253, 244)))
        using (Pen p1 = new Pen(Color.FromArgb(187, 247, 208), 1.5f))
        using (SolidBrush b2 = new SolidBrush(Color.FromArgb(254, 242, 242)))
        using (Pen p2 = new Pen(Color.FromArgb(254, 202, 202), 1.5f))
        {
            g.FillRectangle(b1, r1);
            g.DrawRectangle(p1, r1);
            g.FillRectangle(b2, r2);
            g.DrawRectangle(p2, r2);
        }

        using (Font f = new Font("Malgun Gothic", 12.5f, FontStyle.Bold))
        using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
        {
            using (SolidBrush tb1 = new SolidBrush(Color.FromArgb(21, 128, 61))) { g.DrawString("📖 오늘 복음", f, tb1, r1, sf); }
            using (SolidBrush tb2 = new SolidBrush(Color.FromArgb(185, 28, 28))) { g.DrawString("✝ 영접 기도", f, tb2, r2, sf); }
        }
    }

    static void DrawClinicBanner(Graphics g, int x, int y, int width)
    {
        Rectangle r = new Rectangle(x, y, width, 55);
        using (LinearGradientBrush lgb = new LinearGradientBrush(r, Color.FromArgb(15, 118, 110), Color.FromArgb(13, 148, 136), 90f))
        {
            g.FillRectangle(lgb, r);
        }
        using (Font f = new Font("Malgun Gothic", 12f, FontStyle.Bold))
        using (SolidBrush tb = new SolidBrush(Color.White))
        using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
        {
            g.DrawString("🏥 부산제일의원 · 온가족 안심 건강 케어", f, tb, r, sf);
        }
    }

    static void DrawAdmob100pxBar(Graphics g, int x, int y, int width, int height)
    {
        // Container background
        using (SolidBrush bg = new SolidBrush(Color.White))
        using (Pen topBorder = new Pen(Color.FromArgb(203, 213, 225), 1.5f))
        {
            g.FillRectangle(bg, x, y, width, height);
            g.DrawLine(topBorder, x, y, x + width, y);
        }

        // 🌟 100px AdMob Card (Width: 380, Height: 100)
        int cardW = 440;
        int cardH = 100;
        int cardX = (width - cardW) / 2;
        int cardY = y + 8;

        Rectangle cr = new Rectangle(cardX, cardY, cardW, cardH);
        using (SolidBrush cb = new SolidBrush(Color.FromArgb(255, 255, 255)))
        using (Pen cp = new Pen(Color.FromArgb(203, 213, 225), 1.2f))
        {
            g.FillRectangle(cb, cr);
            g.DrawRectangle(cp, cr);
        }

        // Inner Padding: 10px
        int inX = cardX + 12;
        int inY = cardY + 8;
        int inW = cardW - 24;

        // Row 1: AD Badge + Sponsor info
        using (SolidBrush ab = new SolidBrush(Color.FromArgb(2, 132, 199)))
        {
            g.FillRectangle(ab, inX, inY, 26, 16);
        }
        using (Font adF = new Font("Malgun Gothic", 8.5f, FontStyle.Bold))
        using (SolidBrush wtb = new SolidBrush(Color.White))
        {
            g.DrawString("AD", adF, wtb, inX + 4, inY + 1);
        }

        using (Font spF = new Font("Malgun Gothic", 9.5f, FontStyle.Bold))
        using (SolidBrush spB = new SolidBrush(Color.FromArgb(100, 116, 139)))
        {
            g.DrawString("Google 스폰서 · 기독교 문서선교", spF, spB, inX + 32, inY + 1);
        }

        using (Font infoF = new Font("Malgun Gothic", 8.5f, FontStyle.Regular))
        using (SolidBrush infoB = new SolidBrush(Color.FromArgb(148, 163, 184)))
        {
            g.DrawString("ⓘ AdChoices", infoF, infoB, inX + inW - 65, inY + 1);
        }

        // Row 2: Headline
        int headY = inY + 22;
        using (Font hF = new Font("Malgun Gothic", 12f, FontStyle.Bold))
        using (SolidBrush hB = new SolidBrush(Color.FromArgb(15, 23, 42)))
        {
            g.DrawString("말씀 묵상과 영적 성장을 돕는 추천 신앙 도서전", hF, hB, inX, headY);
        }

        // Row 3: Subtext
        int subY = headY + 20;
        using (Font subF = new Font("Malgun Gothic", 9.5f, FontStyle.Regular))
        using (SolidBrush subB = new SolidBrush(Color.FromArgb(71, 85, 105)))
        {
            g.DrawString("삶을 변화시키는 은혜로운 말씀 길잡이, 전국 기독교 서점에서 만나보세요.", subF, subB, inX, subY);
        }

        // Row 4: Bottom bar with dashed line
        int botY = subY + 24;
        using (Pen dashP = new Pen(Color.FromArgb(226, 232, 240), 1f))
        {
            dashP.DashStyle = DashStyle.Dash;
            g.DrawLine(dashP, inX, botY, inX + inW, botY);
        }

        int linkY = botY + 3;
        using (Font orgF = new Font("Malgun Gothic", 9f, FontStyle.Regular))
        using (SolidBrush orgB = new SolidBrush(Color.FromArgb(100, 116, 139)))
        {
            g.DrawString("한국기독교출판협회 공익 캠페인", orgF, orgB, inX, linkY);
        }

        using (Font ctaF = new Font("Malgun Gothic", 9.5f, FontStyle.Bold))
        using (SolidBrush ctaB = new SolidBrush(Color.FromArgb(2, 132, 199)))
        {
            g.DrawString("자세히 보기 ▶", ctaF, ctaB, inX + inW - 75, linkY);
        }
    }
}
