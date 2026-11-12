using System;
using System.IO;
using System.Text;

class ApplyTermsAndPrivacyModal {
    static void Main() {
        string path = "assets/index.html";
        string text = File.ReadAllText(path, Encoding.UTF8);

        // 1. Add terms modal CSS
        string cssAnchor = "/* 🌟 [사용자 요청] 메디게이트 스타일 상단 댓글 작성창 (카메라 아이콘 포함) */";
        string newTermsCss = @"/* 🌟 [사용자 요청] 예톡 이용약관 및 개인정보·종교 안내 모달 스타일 */
        .yetalk-terms-modal-card {
            background: #ffffff;
            border-radius: 20px;
            width: 100%;
            max-width: 460px;
            max-height: 88vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.4);
            animation: fadeInUpModal 0.25s ease-out;
            box-sizing: border-box;
        }
        .terms-content-scroll {
            padding: 16px 20px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            display: flex;
            flex-direction: column;
            gap: 16px;
            font-size: 13.5px;
            line-height: 1.75;
            color: #334155;
            background: #ffffff;
        }
        .terms-section-card {
            background: #f8fafc;
            border: 1.2px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 14px;
        }
        .terms-section-title {
            font-size: 14.5px;
            font-weight: 950;
            color: #0f172a;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .terms-section-badge {
            font-size: 11px;
            font-weight: 900;
            padding: 2px 7px;
            border-radius: 6px;
        }
        .badge-green { background: #dcfce7; color: #15803d; }
        .badge-blue { background: #e0f2fe; color: #0284c7; }
        .badge-amber { background: #fef3c7; color: #b45309; }

        " + cssAnchor;

        if (text.Contains(cssAnchor)) {
            text = text.Replace(cssAnchor, newTermsCss);
            Console.WriteLine("Added Terms CSS successfully.");
        }

        // 2. Add Terms Checkbox into applyStep1 in applyAppModal
        string step1Anchor = "<!-- 🌟 [사용자 요청] 기본 회원 가입/수정 먼저 뜨고, 그 밑에 전문앱 신청 뜨게 배치 -->";
        string termsCheckHtml = @"<!-- 🌟 [사용자 요청] 6. 개인정보 보호 및 서비스·종교 이용약관 동의 승낙 -->
                <div style=""background:#0f172a; border:1.5px solid #334155; border-radius:12px; padding:11px 12px; margin-top:2px;"">
                    <label style=""display:flex; align-items:center; gap:8px; cursor:pointer;"">
                        <input type=""checkbox"" id=""chkApplyTermsAgree"" checked style=""width:19px; height:19px; accent-color:#0284c7; cursor:pointer;"">
                        <span style=""font-size:13.5px; font-weight:900; color:#ffffff; line-height:1.35;"">
                            [필수] 개인정보보호 및 이용약관 · 종교고지 동의
                        </span>
                    </label>
                    <div style=""display:flex; justify-content:space-between; align-items:center; margin-top:6px; padding-left:27px;"">
                        <span style=""font-size:11.5px; color:#94a3b8;"">최소 정보 수집 · 건전한 신앙 교제 준수</span>
                        <button type=""button"" onclick=""openYetalkTermsModal()"" style=""background:none; border:none; color:#38bdf8; font-size:12px; font-weight:900; cursor:pointer; text-decoration:underline; padding:0;"">[약관 전문 보기 ➔]</button>
                    </div>
                </div>

                " + step1Anchor;

        if (text.Contains(step1Anchor)) {
            text = text.Replace(step1Anchor, termsCheckHtml);
            Console.WriteLine("Added Terms Checkbox into applyAppModal.");
        }

        // 3. Add Home Footer Policy Link before </main>
        string mainCloseAnchor = "<div style=\"height: 110px; flex-shrink: 0;\"></div>\n\n    </main>";
        string mainCloseAnchorCRLF = "<div style=\"height: 110px; flex-shrink: 0;\"></div>\r\n\r\n    </main>";
        string footerHtml = @"<!-- 🌟 [사용자 요청] 예톡 홈 하단 서비스 안내 및 이용약관/개인정보/종교고지 푸터 -->
        <div class=""yetalk-home-footer-info"" style=""text-align:center; padding:18px 14px 20px 14px; margin-top:16px; border-top:1px solid #e2e8f0; color:#64748b; font-size:12px; line-height:1.6;"">
            <div style=""font-weight:950; color:#0f172a; margin-bottom:3px; font-size:13.5px;"">
                ✨ 예톡 (Yetalk) • 말씀과 사랑으로 소통하는 은혜의 나눔터
            </div>
            <div style=""margin-bottom:8px; font-size:12px; color:#64748b;"">
                복음 전파와 성도 및 이웃 섬김을 위한 비영리 무료 플랫폼 (평생 0원)
            </div>
            <div style=""display:flex; justify-content:center; align-items:center; gap:8px;"">
                <button type=""button"" onclick=""openYetalkTermsModal()"" style=""background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; padding:6px 12px; font-size:12px; font-weight:850; color:#334155; cursor:pointer; display:inline-flex; align-items:center; gap:4px;"">
                    <span>📜</span>
                    <span>개인정보보호 및 서비스 이용약관 · 종교고지</span>
                </button>
            </div>
        </div>

        <div style=""height: 110px; flex-shrink: 0;""></div>

    </main>";

        if (text.Contains(mainCloseAnchor)) {
            text = text.Replace(mainCloseAnchor, footerHtml);
            Console.WriteLine("Added Footer Policy Link into main (LF).");
        } else if (text.Contains(mainCloseAnchorCRLF)) {
            text = text.Replace(mainCloseAnchorCRLF, footerHtml);
            Console.WriteLine("Added Footer Policy Link into main (CRLF).");
        } else {
            Console.WriteLine("Warning: mainCloseAnchor not found directly.");
        }

        // 4. Add the Full yetalkTermsModal HTML at modal container area
        string modalCardAnchor = "<!-- 12. 내 전용 맞춤앱 보관함 모달 (내앱) -->";
        string termsModalHtml = @"<!-- 🌟 [사용자 요청] 예톡 서비스 이용약관 & 개인정보보호 및 종교안내 모달 전문 -->
    <div class=""modal-overlay"" id=""yetalkTermsModal"" style=""display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.8); z-index:999999; justify-content:center; align-items:center; padding:16px; box-sizing:border-box;"" onclick=""closeYetalkTermsModal()"">
        <div class=""yetalk-terms-modal-card"" onclick=""event.stopPropagation()"">
            <!-- 모달 헤더 -->
            <div style=""display:flex; justify-content:space-between; align-items:center; padding:16px 20px; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; flex-shrink:0;"">
                <div style=""display:flex; align-items:center; gap:8px;"">
                    <span style=""font-size:22px;"">📜</span>
                    <div>
                        <strong style=""font-size:16.5px; font-weight:950; color:#ffffff; display:block;"">예톡 이용약관 및 개인정보·종교 안내</strong>
                        <span style=""font-size:11.5px; color:#94a3b8;"">최소 정보 수집 · 건전한 신앙 교제 · 평생 무료</span>
                    </div>
                </div>
                <button type=""button"" onclick=""closeYetalkTermsModal()"" style=""background:none; border:none; color:#94a3b8; font-size:22px; cursor:pointer; padding:2px; line-height:1;"" title=""닫기"">✕</button>
            </div>

            <!-- 약관 본문 스크롤 영역 -->
            <div class=""terms-content-scroll"">
                <!-- 제1조: 서비스 목적 및 비영리 무료 원칙 -->
                <div class=""terms-section-card"">
                    <div class=""terms-section-title"">
                        <span>🕊️ 제1조 (목적 및 평생 무료 원칙)</span>
                        <span class=""terms-section-badge badge-green"">비영리 무료</span>
                    </div>
                    <div>
                        1. 본 <strong>'예톡(Yetalk)'</strong>은 한국 교회와 성도님, 그리고 이웃 간에 하나님의 말씀과 사랑으로 따뜻하게 소통하기 위해 개발된 <strong>비영리 복음·생활 플랫폼</strong>입니다.<br>
                        2. 본 앱은 성도와 이웃을 섬기는 순수 무료 서비스로서, <strong>이용자에게 어떠한 유료 과금이나 결제를 요구하지 않으며 평생 무료(0원)</strong>로 제공됩니다.
                    </div>
                </div>

                <!-- 제2조: 개인정보 보호 및 최소 수집 원칙 -->
                <div class=""terms-section-card"">
                    <div class=""terms-section-title"">
                        <span>🔒 제2조 (개인정보 보호 및 최소 수집)</span>
                        <span class=""terms-section-badge badge-blue"">최소 수집</span>
                    </div>
                    <div>
                        1. <strong>수집 항목 최소화:</strong> 본 앱은 회원의 사생활과 개인정보를 최우선으로 보호하며, 서비스 식별을 위한 <strong>닉네임(이름), 아이디, 4자리 간이 비밀번호</strong>만 최소한으로 사용합니다. 주민등록번호나 금융정보 등 민감정보는 일절 요구하거나 수집하지 않습니다.<br>
                        2. <strong>기기 자체 로컬 안전 보관:</strong> 회원의 모든 정보는 사용자의 스마트폰 기기 내부 메모리(로컬 스토리지)에만 안전하게 보관되며, <strong>외부 유료 서버에 저장되거나 제3자에게 판매·유출되지 않습니다.</strong><br>
                        3. <strong>삭제의 권리:</strong> 회원은 언제든지 앱 삭제 또는 캐시 삭제를 통해 기기 내 모든 정보를 즉시 영구 삭제할 수 있습니다.
                    </div>
                </div>

                <!-- 제3조: 기독교 신앙 가치 및 종교적 고지 -->
                <div class=""terms-section-card"">
                    <div class=""terms-section-title"">
                        <span>✝️ 제3조 (기독교 신앙 가치 및 종교적 고지)</span>
                        <span class=""terms-section-badge badge-amber"">신앙 및 교제</span>
                    </div>
                    <div>
                        1. <strong>신앙의 정체성:</strong> 예톡은 성경 66권과 정통 기독교(복음주의) 신앙을 바탕으로 성경 통독, 찬송, 말씀 묵상, 기도 나눔을 제공합니다.<br>
                        2. <strong>이웃과의 열린 교제:</strong> 본 앱은 성도뿐만 아니라 비기독교인 이웃도 누구나 자유롭고 편안하게 소통할 수 있는 열린 공간입니다.<br>
                        3. <strong>이단 및 분쟁 방지:</strong> 정통 기독교 교단에서 규정한 <strong>이단·사이비 단체의 포교 행위</strong>, 타 종교나 타인을 비방·혐오하는 행위, 악의적인 종교 분쟁을 조장하는 글은 성도 간의 평안과 질서를 위해 사전 고지 없이 제한 및 삭제될 수 있습니다.
                    </div>
                </div>

                <!-- 제4조: 게시판 및 커뮤니티 건전성 유지 -->
                <div class=""terms-section-card"">
                    <div class=""terms-section-title"">
                        <span>💬 제4조 (게시판 이용 수칙)</span>
                    </div>
                    <div>
                        1. 모든 회원은 감사, 자유, 나눔토론, 선교보고 게시판에서 따뜻하고 예의 바른 언어로 소통해야 합니다.<br>
                        2. 음란물, 불법 광고, 상업적 스팸, 욕설 및 타인의 명예를 훼손하는 게시물은 발견 즉시 통보 없이 삭제 조치됩니다.<br>
                        3. <strong>담임목사전용 게시판</strong>은 공인된 담임목사님만을 위한 공간으로, 등록된 목회자 외에는 접근이 제한됩니다.
                    </div>
                </div>

                <!-- 제5조: 동의 및 효력 -->
                <div class=""terms-section-card"" style=""background:#f0fdf4; border-color:#86efac;"">
                    <div class=""terms-section-title"" style=""color:#166534;"">
                        <span>⚖️ 제5조 (약관의 효력 및 동의)</span>
                    </div>
                    <div style=""color:#15803d; font-size:12.5px;"">
                        본 약관에 동의하고 앱을 이용하시는 것은 위의 개인정보 보호 방침과 건전한 신앙·교제 운영 규칙을 숙지하고 동의하신 것으로 간주됩니다.
                    </div>
                </div>
            </div>

            <!-- 모달 하단 버튼 바 -->
            <div style=""display:flex; gap:8px; padding:12px 18px; background:#f8fafc; border-top:1.5px solid #e2e8f0; flex-shrink:0;"">
                <button type=""button"" onclick=""closeYetalkTermsModal()"" style=""flex:1; height:44px; background:#ffffff; border:1.5px solid #cbd5e1; border-radius:10px; font-size:14px; font-weight:850; color:#475569; cursor:pointer;"">
                    닫기
                </button>
                <button type=""button"" onclick=""acceptYetalkTerms()"" style=""flex:1.4; height:44px; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); border:none; border-radius:10px; font-size:14px; font-weight:950; color:#ffffff; cursor:pointer; box-shadow:0 2px 8px rgba(2,132,199,0.3);"">
                    ✔️ 약관 동의 및 확인
                </button>
            </div>
        </div>
    </div>

    " + modalCardAnchor;

        if (text.Contains(modalCardAnchor)) {
            text = text.Replace(modalCardAnchor, termsModalHtml);
            Console.WriteLine("Added yetalkTermsModal HTML successfully.");
        }

        // 5. Add JS functions: openYetalkTermsModal, closeYetalkTermsModal, acceptYetalkTerms, and check in saveBasicMemberInfoOnly
        string jsAnchor = "function saveBasicMemberInfoOnly() {";
        string newSaveJs = @"function openYetalkTermsModal() {
        const modal = document.getElementById(""yetalkTermsModal"");
        if (modal) {
            modal.style.display = ""flex"";
            modal.classList.add(""show"");
        }
    }

    function closeYetalkTermsModal() {
        const modal = document.getElementById(""yetalkTermsModal"");
        if (modal) {
            modal.style.display = ""none"";
            modal.classList.remove(""show"");
        }
    }

    function acceptYetalkTerms() {
        localStorage.setItem(""yetalk_terms_agreed"", ""true"");
        const chk = document.getElementById(""chkApplyTermsAgree"");
        if (chk) chk.checked = true;
        closeYetalkTermsModal();
        alert(""✨ 예톡 서비스 이용약관 및 개인정보·종교 안내에 동의하셨습니다."");
    }

    function saveBasicMemberInfoOnly() {
        const termsChk = document.getElementById(""chkApplyTermsAgree"");
        if (termsChk && !termsChk.checked) {
            alert(""🔒 예톡 정회원 이용을 위해 개인정보보호 및 이용약관·종교고지에 동의해 주세요."");
            return;
        }
        localStorage.setItem(""yetalk_terms_agreed"", ""true"");";

        if (text.Contains(jsAnchor)) {
            text = text.Replace(jsAnchor, newSaveJs);
            Console.WriteLine("Added Terms JS functions and validation in saveBasicMemberInfoOnly.");
        }

        File.WriteAllText(path, text, Encoding.UTF8);
        Console.WriteLine("All Terms & Privacy implementation finished successfully.");
    }
}
