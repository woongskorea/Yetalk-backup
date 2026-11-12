using System;
using System.IO;
using System.Text;

class FixPcLayoutHtml
{
    static void Main()
    {
        string[] files = new string[] {
            @"c:\Users\Administrator\AndroidStudioProjects\Yetalk\assets\index.html",
            @"c:\Users\Administrator\AndroidStudioProjects\Yetalk\docs\index.html",
            @"c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\index.html"
        };

        foreach (var path in files)
        {
            if (!File.Exists(path)) continue;
            string content = File.ReadAllText(path, Encoding.UTF8);

            // 1. Fix CSS align-items
            content = content.Replace(
                "align-items: center !important;\n                gap: 16px !important;\n                max-width: 1520px !important;",
                "align-items: flex-start !important;\n                gap: 16px !important;\n                max-width: 1520px !important;"
            );
            content = content.Replace(
                "align-items: center !important;\r\n                gap: 16px !important;\r\n                max-width: 1520px !important;",
                "align-items: flex-start !important;\r\n                gap: 16px !important;\r\n                max-width: 1520px !important;"
            );

            // 2. Fix the closing tag of main-container
            // Currently:
            //                 <div style="text-align:right; margin-top:14px; padding:4px 6px;">
            //                     <span id="superAdminSecretTrigger" onclick="openSuperAdminDeskModal()" style="font-size:11px; color:#cbd5e1; cursor:pointer; user-select:none;">© Yetalk System</span>
            //                 </div>
            //             </div>
            //         </div>
            //     </div> <!-- /.main-container -->
            //
            //     <!-- 🌟 [사용자 요청] 우측 광고 날개
            //
            // We need one MORE </div> to close main-container properly!

            string targetWrongClose = @"                <div style=""text-align:right; margin-top:14px; padding:4px 6px;"">
                    <span id=""superAdminSecretTrigger"" onclick=""openSuperAdminDeskModal()"" style=""font-size:11px; color:#cbd5e1; cursor:pointer; user-select:none;"">© Yetalk System</span>
                </div>
            </div>
        </div>
    </div> <!-- /.main-container -->";

            string replaceRightClose = @"                <div style=""text-align:right; margin-top:14px; padding:4px 6px;"">
                    <span id=""superAdminSecretTrigger"" onclick=""openSuperAdminDeskModal()"" style=""font-size:11px; color:#cbd5e1; cursor:pointer; user-select:none;"">© Yetalk System</span>
                </div>
            </div>
        </div>
    </div> <!-- /#drawerMenuOverlay -->
</div> <!-- /.main-container -->";

            string normContent = content.Replace("\r\n", "\n");
            string normTarget = targetWrongClose.Replace("\r\n", "\n");
            string normReplace = replaceRightClose.Replace("\r\n", "\n");

            if (normContent.Contains(normTarget))
            {
                normContent = normContent.Replace(normTarget, normReplace);
                Console.WriteLine("Properly closed main-container in: " + path);
            }
            else
            {
                Console.WriteLine("Warning: targetWrongClose not found in: " + path);
            }

            File.WriteAllText(path, normContent, new UTF8Encoding(false));
        }

        Console.WriteLine("Fix applied.");
    }
}
