$basePath = "c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\doctormain.html"
$content = [System.IO.File]::ReadAllText($basePath, [System.Text.Encoding]::UTF8)

# ---------------------------------------------
# 1. Generate handoctormain.html (한의원 전문)
# ---------------------------------------------
$han = $content

# Theme colors to Emerald
$han = $han.Replace("#0284c7", "#059669")
$han = $han.Replace("#0369a1", "#047857")
$han = $han.Replace("#38bdf8", "#34d399")
$han = $han.Replace("#e0f2fe", "#d1fae5")
$han = $han.Replace("#f0f9ff", "#ecfdf5")
$han = $han.Replace("#bae6fd", "#a7f3d0")
$han = $han.Replace("linear-gradient(135deg, #0284c7, #2563eb)", "linear-gradient(135deg, #059669, #047857)")
$han = $han.Replace("linear-gradient(135deg, #059669, #2563eb)", "linear-gradient(135deg, #059669, #047857)")

# Storage keys
$han = $han.Replace("yetalkDoctorName", "yetalkHanDoctorName")
$han = $han.Replace("yetalk_treatments_list_clinic", "yetalk_treatments_list_hanclinic")
$han = $han.Replace("yetalk_doctalk_", "yetalk_hantalk_")
$han = $han.Replace("yetalk_doctor_beauty_v2", "yetalk_handoctor_beauty_v2")
$han = $han.Replace("yetalk_doctor_intro_pages_v3", "yetalk_handoctor_intro_pages_v3")
$han = $han.Replace("yetalk_doctor_notices_board_v16", "yetalk_handoctor_notices_board_v16")
$han = $han.Replace("yetalk_staff_res_schedule_v3", "yetalk_hanstaff_res_schedule_v3")

# Branding & Clinic Title
$han = $han.Replace("예톡아름다운 의원", "예톡 우리동네한의원")
$han = $han.Replace("예톡아름다운의원", "예톡 우리동네한의원")
$han = $han.Replace("예톡행복한의원", "예톡 우리동네한의원")
$han = $han.Replace("아름다운 의원", "우리동네한의원")
$han = $han.Replace("아름다운 한의원", "우리동네한의원")
$han = $han.Replace("아름다운의원", "우리동네한의원")

# Titles and roles
$han = $han.Replace("의원 예약관리실", "한의원 예약관리실")
$han = $han.Replace("의원 알림", "한의원 알림")
$han = $han.Replace("의원 소식", "한의원 소식")
$han = $han.Replace("의원소개", "한의원소개")
$han = $han.Replace("1. 의원소개", "1. 한의원소개")
$han = $han.Replace("의원 초대", "한의원 초대")
$han = $han.Replace("의원 고객", "한의원 고객")
$han = $han.Replace("의원 회원", "한의원 회원")
$han = $han.Replace("닥톡 (DocTalk - 의사 전용)", "한의톡 (HanTalk - 한의사 전용)")
$han = $han.Replace("닥톡 (DocTalk)", "한의톡 (HanTalk)")
$han = $han.Replace("닥톡", "한의톡")
$han = $han.Replace("DocTalk", "HanTalk")
$han = $han.Replace("의사 전용", "한의사 전용")
$han = $han.Replace("의사", "한의사")
$han = $han.Replace("원장", "한의원장")
$han = $han.Replace("대표한의원장", "대표한의원장")
$han = $han.Replace("한의원장실", "한의원장실")

# Treatments list
$hanTreatments = @"
const DEFAULT_CLINIC_TREATMENTS = [
    "척추·관절 추나요법",
    "체질 맞춤 한약·보약",
    "통증 침구 및 약침치료",
    "체형교정 및 한방 물리요법",
    "일반 한방 진료 (상담)"
];
"@
$han = $han.Replace(@'
const DEFAULT_CLINIC_TREATMENTS = [
    "보톡스 맞춤 케어",
    "맞춤 볼륨 필러",
    "소화기 내시경 검진",
    "피부 톤업·장벽 케어",
    "일반 진료 (상담)"
];
'@, $hanTreatments)

# Beauty / Treatment Guidance data
$hanBeauty = @"
const DEFAULT_BEAUTY_SUBJECTS = [
    {
        subjectId: "h0",
        title: "척추·관절 추나요법",
        cases: [
            {
                title: "추나요법 체형 교정",
                desc: "틀어진 척추와 골반의 불균형을 바로잡아 만성 통증을 치료하는 전통 한방 수기 교정 치료입니다.",
                img1: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
            }
        ]
    }
];
"@
$han = $han.Replace(@'
const DEFAULT_BEAUTY_SUBJECTS = [
    {
        subjectId: "b0",
        title: "보톡스 (주름·사각턱)",
        cases: [
            {
                title: "보톡스 맞춤 클리닉",
                desc: "과도하게 발달한 근육을 축소하고 표정 주름을 완화하여 자연스러운 라인을 완성하는 정품·정량 맞춤 케어입니다.",
                img1: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
            }
        ]
    }
];
'@, $hanBeauty)

# QR Code URL
$han = $han.Replace("doctormain.html%3Fjoin%3Dclinic", "handoctormain.html%3Fjoin%3Dhanclinic")
$han = $han.Replace("doctormain.html", "handoctormain.html")

[System.IO.File]::WriteAllText("c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\handoctormain.html", $han, [System.Text.Encoding]::UTF8)
Write-Host "handoctormain.html successfully generated!"

# ---------------------------------------------
# 2. Generate dentalmain.html (치과의원 전문)
# ---------------------------------------------
$den = $content

# Storage keys
$den = $den.Replace("yetalkDoctorName", "yetalkDentalName")
$den = $den.Replace("yetalk_treatments_list_clinic", "yetalk_treatments_list_dental")
$den = $den.Replace("yetalk_doctalk_", "yetalk_denttalk_")
$den = $den.Replace("yetalk_doctor_beauty_v2", "yetalk_dental_beauty_v2")
$den = $den.Replace("yetalk_doctor_intro_pages_v3", "yetalk_dental_intro_pages_v3")
$den = $den.Replace("yetalk_doctor_notices_board_v16", "yetalk_dental_notices_board_v16")
$den = $den.Replace("yetalk_staff_res_schedule_v3", "yetalk_dentalstaff_res_schedule_v3")

# Branding & Clinic Title
$den = $den.Replace("예톡아름다운 의원", "예톡 스마일치과의원")
$den = $den.Replace("예톡아름다운의원", "예톡 스마일치과의원")
$den = $den.Replace("예톡행복한의원", "예톡 스마일치과의원")
$den = $den.Replace("아름다운 의원", "스마일 치과의원")
$den = $den.Replace("아름다운의원", "스마일 치과의원")

# Titles and roles
$den = $den.Replace("의원 예약관리실", "치과의원 예약관리실")
$den = $den.Replace("의원 알림", "치과의원 알림")
$den = $den.Replace("의원 소식", "치과의원 소식")
$den = $den.Replace("의원소개", "치과소개")
$den = $den.Replace("1. 의원소개", "1. 치과소개")
$den = $den.Replace("의원 초대", "치과 초대")
$den = $den.Replace("의원 고객", "치과 고객")
$den = $den.Replace("의원 회원", "치과 회원")
$den = $den.Replace("닥톡 (DocTalk - 의사 전용)", "치과톡 (DentTalk - 치과의사 전용)")
$den = $den.Replace("닥톡 (DocTalk)", "치과톡 (DentTalk)")
$den = $den.Replace("닥톡", "치과톡")
$den = $den.Replace("DocTalk", "DentTalk")
$den = $den.Replace("의사 전용", "치과의사 전용")
$den = $den.Replace("의사", "치과의사")
$den = $den.Replace("원장", "치과원장")
$den = $den.Replace("대표치과의원장", "대표치과원장")
$den = $den.Replace("치과의원장실", "치과원장실")

# Treatments list
$denTreatments = @"
const DEFAULT_CLINIC_TREATMENTS = [
    "임플란트 식립·수술",
    "치아 교정 클리닉",
    "원데이 치아 미백",
    "충치 및 신경치료",
    "일반 구강 검진 (상담)"
];
"@
$den = $den.Replace(@'
const DEFAULT_CLINIC_TREATMENTS = [
    "보톡스 맞춤 케어",
    "맞춤 볼륨 필러",
    "소화기 내시경 검진",
    "피부 톤업·장벽 케어",
    "일반 진료 (상담)"
];
'@, $denTreatments)

# Beauty / Treatment Guidance data
$denBeauty = @"
const DEFAULT_BEAUTY_SUBJECTS = [
    {
        subjectId: "d0",
        title: "치아 미백 & 라미네이트",
        cases: [
            {
                title: "원데이 맞춤 치아미백",
                desc: "변색된 치아를 밝고 환하게 되돌리는 안전한 고성능 치아 미백 클리닉입니다.",
                img1: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"
            }
        ]
    }
];
"@
$den = $den.Replace(@'
const DEFAULT_BEAUTY_SUBJECTS = [
    {
        subjectId: "b0",
        title: "보톡스 (주름·사각턱)",
        cases: [
            {
                title: "보톡스 맞춤 클리닉",
                desc: "과도하게 발달한 근육을 축소하고 표정 주름을 완화하여 자연스러운 라인을 완성하는 정품·정량 맞춤 케어입니다.",
                img1: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
            }
        ]
    }
];
'@, $denBeauty)

# QR Code URL
$den = $den.Replace("doctormain.html%3Fjoin%3Dclinic", "dentalmain.html%3Fjoin%3Ddental")
$den = $den.Replace("doctormain.html", "dentalmain.html")

[System.IO.File]::WriteAllText("c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\dentalmain.html", $den, [System.Text.Encoding]::UTF8)
Write-Host "dentalmain.html successfully generated!"
