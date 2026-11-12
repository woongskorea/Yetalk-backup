using System;
using System.IO;
using System.Text;

class ApplyCleanKkajitgeot
{
    static void Main()
    {
        string[] paths = new string[]
        {
            @"assets\index.html",
            @"docs\index.html",
            @"app\src\main\assets\index.html"
        };

        foreach (string path in paths)
        {
            if (!File.Exists(path))
            {
                Console.WriteLine("File not found: " + path);
                continue;
            }

            string content = File.ReadAllText(path, Encoding.UTF8).Replace("\r\n", "\n");

            int modalStartIdx = content.IndexOf("<div class=\"modal-overlay\" id=\"kkajitgeotModal\"");
            if (modalStartIdx < 0)
            {
                Console.WriteLine("kkajitgeotModal not found in " + path);
                continue;
            }

            int modalEndIdx = content.IndexOf("</body>", modalStartIdx);
            if (modalEndIdx < 0)
            {
                Console.WriteLine("</body> not found in " + path);
                continue;
            }

            string newModalHtml = @"    <!-- 🌟 [사용자 요청] 까짓것! 별거아냐 - 상단 헤더 깔끔 분리(글씨 본문으로 이동), 성경본문 전체 제거, 성령훼손죄/하나님은 사랑이십니다, 가말리엘의 조언, 천국버스 14선(각 성경본문 바로밑 배치), 마지막 개인 믿음의 고백과 순종결단 작성창 -->
    <div class=""modal-overlay"" id=""kkajitgeotModal"" style=""position:fixed !important; inset:0 !important; width:100vw !important; height:100vh !important; max-width:100vw !important; max-height:100vh !important; background:#ffffff !important; z-index:99999 !important; display:none; flex-direction:column !important; padding:0 !important; margin:0 !important; box-sizing:border-box !important; overflow:hidden !important; backdrop-filter:none !important;"">
        <div style=""width:100%; height:100%; max-width:680px; margin:0 auto; background:#ffffff; display:flex; flex-direction:column; overflow:hidden; box-sizing:border-box;"">
            
            <!-- 1. 🌟 [사용자 요청] 상단 고정 헤더: 겹침 방지를 위해 좌측 뒤로가기와 우측 닫기만 두고 제목 글씨는 아래 본문으로 내림 -->
            <div style=""height:50px; background:#ffffff; border-bottom:1.5px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 16px; flex-shrink:0; box-sizing:border-box;"">
                <button type=""button"" onclick=""closeKkajitgeotModal()"" style=""background:none; border:none; color:#1e293b; font-size:16px; font-weight:950; cursor:pointer; display:flex; align-items:center; gap:4px; padding:8px 0; white-space:nowrap;"">
                    <span>← 뒤로</span>
                </button>
                <div style=""font-size:14px; font-weight:900; color:#64748b;"">
                    말씀 &amp; 신앙결단
                </div>
                <button type=""button"" onclick=""closeKkajitgeotModal()"" style=""width:34px; height:34px; border-radius:50%; background:#f1f5f9; border:none; color:#475569; font-size:16px; font-weight:950; cursor:pointer; display:flex; align-items:center; justify-content:center;"">✕</button>
            </div>

            <!-- 2. 작은 박스 없이 시원하게 글자 크게 무한 스크롤되는 본문 영역 -->
            <div style=""flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:22px 18px 90px 18px; display:flex; flex-direction:column; gap:30px;"">

                <!-- 🌟 [사용자 요청] 헤더에서 아래로 내린 최상단 메인 대제목 -->
                <div style=""text-align:center; padding-bottom:14px; border-bottom:2px solid #e2e8f0;"">
                    <div style=""font-size:22px; font-weight:950; color:#0f172a; letter-spacing:-0.5px; line-height:1.3;"">
                        👑 까짓것! 별거아냐
                    </div>
                    <div style=""font-size:15px; font-weight:900; color:#059669; margin-top:4px;"">
                        나의 신앙고백 &amp; 결단
                    </div>
                </div>

                <!-- 1) 나의 신앙고백 메인 선언 (황금빛 선언) -->
                <div style=""padding-bottom:20px; border-bottom:2px dashed #fde047;"">
                    <div style=""display:flex; align-items:center; gap:8px; margin-bottom:12px;"">
                        <span style=""font-size:26px;"">🔥</span>
                        <span style=""font-size:21px; font-weight:950; color:#854d0e; letter-spacing:-0.4px;"">“까짓것! 별거아냐! 나의 상황 관계없이 믿습니다!”</span>
                    </div>
                    <div style=""font-size:17.5px; font-weight:850; color:#1e293b; line-height:1.9; word-break:keep-all;"">
                        “나의 상황 관계없이 믿습니다.<br><br>
                        기도한 것은 이미 받은 줄로 믿고 현실로 보일 때까지 기도하겠습니다.<br><br>
                        나의 인생이 아니라 구원받은 자로서 말씀에 순종하며 주님의 뜻에 합당한 삶을 감사하며 기도로 살아가겠습니다...<br><br>
                        성경 말씀 그대로 순종하며 믿겠습니다.<br><br>
                        <strong style=""color:#b45309; font-size:18.5px;"">나의 주 나의 왕 나의 형님! 말씀만 하시옵소서. 아멘</strong>”
                    </div>
                </div>

                <!-- 2) 천국 버스 기본 주의사항 -->
                <div style=""padding-bottom:20px; border-bottom:1.5px solid #e2e8f0;"">
                    <div style=""display:flex; align-items:center; gap:8px; margin-bottom:14px;"">
                        <span style=""font-size:24px;"">🚌</span>
                        <span style=""font-size:19.5px; font-weight:950; color:#15803d; line-height:1.45;"">
                            천국 버스에 탄 이상 성경에서 말씀하시는 천국 버스에서 내리는 불상사가 없도록 합시다.
                        </span>
                    </div>
                    
                    <div style=""margin-bottom:14px; padding-left:14px; border-left:3.5px solid #16a34a;"">
                        <div style=""font-size:16.5px; font-weight:950; color:#15803d; margin-bottom:4px;"">
                            주의사항 1. 오직 나의 의인은 믿음으로 살며 뒤로 물러가지 말라
                        </div>
                        <div style=""font-size:16.5px; color:#1e293b; line-height:1.8; word-break:keep-all;"">
                            “오직 나의 의인은 믿음으로 말미암아 살리라 또한 뒤로 물러가면 내 마음이 그를 기뻐하지 아니하리라 하셨느니라 우리는 뒤로 물러가 멸망할 자가 아니요 오직 영혼을 구원함에 이르는 믿음을 가진 자니라” 
                            <strong style=""color:#059669; font-size:15.5px;"">(히브리서 10:38-39)</strong>
                        </div>
                    </div>

                    <div style=""padding-left:14px; border-left:3.5px solid #16a34a;"">
                        <div style=""font-size:16.5px; font-weight:950; color:#15803d; margin-bottom:4px;"">
                            주의사항 2. 스스로 속이지 말고 성령을 위하여 심으라
                        </div>
                        <div style=""font-size:16.5px; color:#1e293b; line-height:1.8; word-break:keep-all;"">
                            “스스로 속이지 말라 하나님은 업신여김을 받지 아니하시나니 사람이 무엇으로 심든지 그대로 거두리라 자기의 육체를 위하여 심는 자는 육체로부터 썩어질 것을 거두고 성령을 위하여 심는 자는 성령으로부터 영생을 거두리라” 
                            <strong style=""color:#059669; font-size:15.5px;"">(갈라디아서 6:7-8)</strong>
                        </div>
                    </div>
                </div>

                <!-- 3) 🌟 [사용자 요청] 가말리엘의 조언 위에: 성경에서 말하는 가장 큰 죄 : 성령훼손죄 & 하나님은 사랑이십니다 -->
                <div style=""padding-bottom:20px; border-bottom:1.5px solid #e2e8f0;"">
                    <div style=""display:flex; align-items:center; gap:8px; margin-bottom:10px;"">
                        <span style=""font-size:24px;"">⚡</span>
                        <span style=""font-size:19.5px; font-weight:950; color:#dc2626; letter-spacing:-0.3px;"">
                            성경에서 말하는 가장 큰 죄 : 성령훼손죄
                        </span>
                    </div>

                    <div style=""font-size:17px; font-weight:900; color:#991b1b; line-height:1.8; word-break:keep-all; padding-left:14px; border-left:4px solid #ef4444; margin-bottom:14px;"">
                        “그러므로 내가 너희에게 이르노니 사람의 모든 죄와 모독은 사하심을 얻으되 성령을 모독하는 것은 사하심을 얻지 못하겠고 또 누구든지 말로 인자를 거역하면 사하심을 얻되 누구든지 말로 성령을 거역하면 이 세상과 오는 세상에서도 사하심을 얻지 못하리라” 
                        <strong style=""color:#dc2626; font-size:15px;"">(마태복음 12:31-32)</strong>
                    </div>

                    <!-- 🌟 [사용자 요청] 그 밑에: 하나님은 사랑이십니다 -->
                    <div style=""padding-left:14px; border-left:4px solid #3b82f6; margin-top:14px;"">
                        <div style=""font-size:18.5px; font-weight:950; color:#1d4ed8; margin-bottom:4px;"">
                            ❤️ 하나님은 사랑이십니다.
                        </div>
                        <div style=""font-size:16.5px; color:#1e293b; line-height:1.8; word-break:keep-all;"">
                            “사랑하지 아니하는 자는 하나님을 알지 못하나니 이는 하나님은 사랑이심이라... 하나님이 우리를 사랑하시는 사랑을 우리가 알고 믿었노니 하나님은 사랑이시라 사랑 안에 거하는 자는 하나님 안에 거하고 하나님도 그의 안에 거하시느니라” 
                            <strong style=""color:#2563eb; font-size:15px;"">(요한일서 4:8, 16)</strong>
                        </div>
                    </div>
                </div>

                <!-- 4) 🌟 [사용자 요청] 가말리엘의 조언 (사도행전 5:38-39) - 본문 전체 박스는 삭제하고 해당 말씀만 시원하게 표출 -->
                <div style=""padding-bottom:20px; border-bottom:1.5px solid #e2e8f0;"">
                    <div style=""display:flex; align-items:center; gap:8px; margin-bottom:10px;"">
                        <span style=""font-size:22px;"">📖</span>
                        <span style=""font-size:19px; font-weight:950; color:#0f172a;"">가말리엘의 조언 (사도행전 5:38-39)</span>
                    </div>
                    
                    <div style=""font-size:17px; font-weight:900; color:#1e3a8a; line-height:1.8; word-break:keep-all; padding-left:14px; border-left:4px solid #3b82f6;"">
                        “이제 내가 너희에게 말하노니 이 사람들을 상관 말고 버려두라 이 사상과 이 소행이 사람으로부터 났으면 무너질 것이요 만일 하나님께로부터 났으면 너희가 그들을 무너뜨릴 수 없겠고 도리어 하나님을 대적하는 자가 될까 하노라 하니” 
                        <strong style=""color:#2563eb; font-size:15px;"">(사도행전 5:38-39)</strong>
                    </div>
                </div>

                <!-- 5) 🌟 [사용자 요청] 천국 버스에서 내려서 천국에 도달하지 못하는 마귀의 유혹에 넘어가지 맙시다 & 영적 탈락(불합격) 원인 14선 (작은 박스 없애고 소제목 1개당 해당 말씀 바로 밑 본문 기록, 글자 크게) -->
                <div style=""padding-bottom:20px; border-bottom:1.5px solid #e2e8f0;"">
                    <div style=""margin-bottom:22px;"">
                        <div style=""font-size:20px; font-weight:950; color:#b91c1c; letter-spacing:-0.3px; line-height:1.45; margin-bottom:8px;"">
                            🚍 천국 버스에서 내려서 천국에 도달하지 못하는 마귀의 유혹에 넘어가지 맙시다.
                        </div>
                        <div style=""font-size:18px; font-weight:950; color:#0f172a;"">
                            [천국버스] 영적 탈락(불합격) 원인 14선
                        </div>
                    </div>

                    <!-- 14선 리스트: 박스 없이 17px 큰 글씨로 각 항목당 바로 밑 성경본문 배치 -->
                    <div style=""display:flex; flex-direction:column; gap:24px;"">

                        <!-- 1 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                1. 입술로만 ""주여, 주여"" 하고 순종이 없는 삶 <span style=""color:#dc2626;"">(마 7:21)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “나더러 주여 주여 하는 자마다 다 천국에 들어갈 것이 아니요 다만 하늘에 계신 내 아버지의 뜻대로 행하는 자라야 들어가리라”
                            </div>
                        </div>

                        <!-- 2 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                2. 삶의 변화와 회개의 열매가 없는 '죽은 믿음' <span style=""color:#dc2626;"">(약 2:17)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “이와 같이 행함이 없는 믿음은 그 자체가 죽은 것이라... 영혼 없는 몸이 죽은 것 같이 행함이 없는 믿음은 죽은 것이니라” (야고보서 2:17, 26)
                            </div>
                        </div>

                        <!-- 3 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                3. 주님과의 인격적 친밀함이 없는 종교적 외식 <span style=""color:#dc2626;"">(마 7:23)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “그 때에 내가 그들에게 밝히 말하되 내가 너희를 도무지 알지 못하니 불법을 행하는 자들아 내게서 떠나가라 하리라”
                            </div>
                        </div>

                        <!-- 4 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                4. 세상 염려와 재물의 유혹에 마음을 빼앗긴 상태 <span style=""color:#dc2626;"">(마 13:22)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “가시떨기에 뿌려졌다는 것은 말씀을 들으나 세상의 염려와 재물의 유혹에 말씀이 막혀 결실하지 못하는 자요”
                            </div>
                        </div>

                        <!-- 5 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                5. 형제를 향한 미움과 용서하지 않는 독기 <span style=""color:#dc2626;"">(요일 4:20)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “누구든지 하나님을 사랑하노라 하고 그 형제를 미워하면 이는 거짓말하는 자니 보는 바 그 형제를 사랑하지 아니하는 자는 보지 못하는 바 하나님을 사랑할 수 없느니라”
                            </div>
                        </div>

                        <!-- 6 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                6. 하나님의 말씀에 고의적으로 불순종하는 완악함 <span style=""color:#dc2626;"">(히 3:19)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “또 하나님이 누구에게 맹세하사 그의 안식에 들어오지 못하리라 하셨느냐 곧 순종하지 아니하던 자들에게가 아니냐 이로 보건대 그들이 믿지 아니하므로 능히 들어가지 못한 것이라” (히브리서 3:18-19)
                            </div>
                        </div>

                        <!-- 7 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                7. 신랑을 맞이할 영적 준비(기름)가 없는 나태함 <span style=""color:#dc2626;"">(마 25:4)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “슬기 있는 자들은 그릇에 기름을 담아 등과 함께 가져갔더니... 문은 닫힌지라 그 후에 남은 처녀들이 와서 이르되 주여 주여 우리에게 열어 주소서 대답하여 이르되 진실로 너희에게 이르노니 내가 너희를 알지 못하노라 하였느니라” (마태복음 25:4, 10-12)
                            </div>
                        </div>

                        <!-- 8 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                8. 환난과 유혹을 견디지 못하고 진리를 배반함 <span style=""color:#dc2626;"">(히 6:4-6)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “한 번 빛을 받고 하늘의 은사를 맛보고 성령에 참여한 바 되고 하나님의 선한 말씀과 내세의 능력을 맛보고도 타락한 자들은 다시 새롭게 하여 회개하게 할 수 없나니 이는 그들이 하나님의 아들을 다시 십자가에 못 박아 드러내 놓고 욕되게 함이라”
                            </div>
                        </div>

                        <!-- 9 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                9. 고통받는 이웃을 외면하는 사랑 없는 냉랭함 <span style=""color:#dc2626;"">(마 25:45)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “이에 임금이 대답하여 이르시되 내가 진실로 너희에게 이르노니 이 지극히 작은 자 하나에게 하지 아니한 것이 곧 내게 하지 아니한 것이니라 하시리니 그들은 영벌에, 의인들은 영생에 들어가리라 하시니라” (마태복음 25:45-46)
                            </div>
                        </div>

                        <!-- 10 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                10. 맡겨주신 은사와 사명을 땅에 묻어두는 게으름 <span style=""color:#dc2626;"">(마 25:28)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “그에게서 그 한 달란트를 빼앗아 열 달란트 가진 자에게 주라... 이 무익한 종을 바깥 어두운 데로 내쫓으라 거기서 슬피 울며 이를 갈리라 하니라” (마태복음 25:28, 30)
                            </div>
                        </div>

                        <!-- 11 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                11. 복음의 능력을 잃어버린 채 경건의 모양만 남긴 형식주의 <span style=""color:#dc2626;"">(딤후 3:5)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “경건의 모양은 있으나 경건의 능력은 부인하니 이같은 자들에게서 네가 돌아서라”
                            </div>
                        </div>

                        <!-- 12 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                12. 미혹의 영과 거짓 교훈에 마음을 빼앗긴 상태 <span style=""color:#dc2626;"">(딤전 4:1)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “그러나 성령이 밝히 말씀하시기를 후일에 어떤 사람들이 믿음에서 떠나 미혹하는 영과 귀신의 가르침을 따르리라 하셨으니”
                            </div>
                        </div>

                        <!-- 13 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                13. 십자가 은혜를 버리고 자신의 종교적 의(교만)를 세움 <span style=""color:#dc2626;"">(마 5:20)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “내가 너희에게 이르노니 너희 의가 서기관과 바리새인보다 더 낫지 못하면 결코 천국에 들어가지 못하리라”
                            </div>
                        </div>

                        <!-- 14 -->
                        <div style=""padding-left:14px; border-left:4px solid #ef4444;"">
                            <div style=""font-size:17.5px; font-weight:950; color:#0f172a; margin-bottom:5px;"">
                                14. 자신의 영적 눈먼 것을 모른 채 부요하다 착각하는 잠듦 <span style=""color:#dc2626;"">(계 3:17)</span>
                            </div>
                            <div style=""font-size:16.5px; color:#334155; line-height:1.8; word-break:keep-all;"">
                                📜 “네가 말하기를 나는 부자라 부요하여 부족한 것이 없다 하나 네 곤고한 것과 가련한 것과 가난한 것과 눈 먼 것과 벌거벗은 것을 알지 못하는도다”
                            </div>
                        </div>

                    </div>
                </div>

                <!-- 6) 🌟 [사용자 요청] 14개가 다 끝난 후 글 적는 공간 배치: 나 개인의 믿음의 고백과 순종결단 (오직 본인만 볼 수 있음) -->
                <div style=""padding-top:10px;"">
                    <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"">
                        <div style=""display:flex; align-items:center; gap:6px;"">
                            <span style=""font-size:22px;"">✍️</span>
                            <strong style=""font-size:18px; font-weight:950; color:#0369a1;"">나 개인의 믿음의 고백과 순종결단</strong>
                        </div>
                        <span style=""font-size:12px; font-weight:900; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:8px;"">🔒 오직 본인만 볼 수 있음</span>
                    </div>
                    <div style=""font-size:13.5px; color:#64748b; margin-bottom:10px; line-height:1.45;"">
                        14가지 천국 말씀 앞에서 나를 돌아보고, 주님 앞에 드리는 진솔한 믿음의 고백과 순종 결단을 기록해 보세요.
                    </div>
                    <textarea id=""inpMyPersonalConfession"" rows=""4"" style=""width:100%; box-sizing:border-box; background:#f8fafc; border:1.8px solid #cbd5e1; border-radius:12px; color:#0f172a; font-size:16.5px; font-family:inherit; line-height:1.75; padding:14px; resize:none; outline:none; transition:border-color 0.15s ease;"" placeholder=""주님, 헛된 종교적 외식을 버리고 오직 성령 안에서 깨어 끝까지 말씀에 순종하며 살아가겠습니다...""></textarea>
                    
                    <div style=""display:flex; justify-content:flex-end; gap:8px; margin-top:12px;"">
                        <button type=""button"" onclick=""saveMyPersonalConfession()"" style=""height:44px; padding:0 24px; background:linear-gradient(135deg, #0284c7, #0369a1); color:#ffffff; border:none; border-radius:10px; font-size:15px; font-weight:950; cursor:pointer; box-shadow:0 2px 6px rgba(2,132,199,0.3);"">
                            💾 믿음의 고백과 순종결단 등록
                        </button>
                    </div>

                    <!-- 기 등록된 나만의 고백 카드 표시 -->
                    <div id=""boxSavedPersonalConfession"" style=""display:none; margin-top:14px; background:#f0f9ff; border:1.5px dashed #7dd3fc; border-radius:12px; padding:14px 16px;"">
                        <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"">
                            <span style=""font-size:13.5px; font-weight:950; color:#0369a1;"">📜 내가 등록한 믿음의 고백과 순종결단</span>
                            <span id=""txtPersonalConfessionDate"" style=""font-size:12px; color:#64748b;""></span>
                        </div>
                        <div id=""txtSavedPersonalConfession"" style=""font-size:16px; color:#0f172a; line-height:1.75; font-weight:800; white-space:pre-wrap; word-break:keep-all;""></div>
                    </div>
                </div>

                <!-- 7) 🌟 [사용자 요청] 마지막에 애드몹 250은 기본^^ -->
                <div style=""display:flex; justify-content:center; align-items:center; margin:16px 0 20px 0;"">
                    <div style=""width:300px; height:250px; background:#0f172a; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#ffffff; text-align:center; padding:16px; box-sizing:border-box; box-shadow:0 4px 16px rgba(0,0,0,0.2);"">
                        <div style=""display:inline-block; background:#0284c7; color:#fff; font-size:11px; font-weight:900; padding:2px 8px; border-radius:4px; margin-bottom:12px;"">AD</div>
                        <div style=""font-size:16.5px; font-weight:950; color:#38bdf8; margin-bottom:6px;"">Google AdMob (300 x 250)</div>
                        <div style=""font-size:12.5px; color:#94a3b8; line-height:1.5;"">대한민국 교회 · 목회자 · 소상공인<br>공식 스폰서 대형 배너 슬롯</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
";

            content = content.Substring(0, modalStartIdx) + newModalHtml + content.Substring(modalEndIdx);
            File.WriteAllText(path, content, new UTF8Encoding(false));
            Console.WriteLine("SUCCESS: Updated " + path);
        }
    }
}
