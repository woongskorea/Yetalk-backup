#!/usr/bin/env perl
use strict;
use warnings;
use utf8;
binmode(STDOUT, ":utf8");
binmode(STDERR, ":utf8");

my $src_file = "app/src/main/assets/doctormain.html";
open my $in, "<:utf8", $src_file or die "Cannot open $src_file: $!";
my $content = do { local $/; <$in> };
close $in;

print "Source file doctormain.html loaded: " . length($content) . " chars\n";

# =========================================================================
# 1. GENERATE handoctormain.html (한의원: "예톡 우리동네한의원")
# =========================================================================
my $han = $content;

# 1-1. Title & Meta
$han =~ s/<title>.*?<\/title>/<title>예톡 우리동네한의원<\/title>/g;

# 1-2. Color Theme: Green (#059669)
$han =~ s/--primary:\s*#0284c7;/--primary: #059669;/g;
$han =~ s/--primary-dark:\s*#0369a1;/--primary-dark: #047857;/g;
$han =~ s/--primary-light:\s*#e0f2fe;/--primary-light: #d1fae5;/g;
$han =~ s/#0284c7/#059669/g;
$han =~ s/#0369a1/#047857/g;
$han =~ s/#38bdf8/#34d399/g;
$han =~ s/#7dd3fc/#a7f3d0/g;
$han =~ s/#e0f2fe/#ecfdf5/g;
$han =~ s/#f0f9ff/#f0fdf4/g;

# 1-3. Hospital Names (all variations)
$han =~ s/예톡\s*아름다운\s*의원/예톡 우리동네한의원/g;
$han =~ s/아름다운\s*의원/우리동네한의원/g;
$han =~ s/예톡의원/예톡한의원/g;
$han =~ s/행복의원/우리동네한의원/g;

# 1-4. Header info & banners
$han =~ s/피부클리닉 · 리프팅 전문/비수술 척추·관절 추나 · 체질한약 전문/g;
$han =~ s/⚡ 간단 접수를 원하시면 클릭하세요/⚡ 비수술 한방치료·추나 간편 접수 (터치 즉시 예약접수)/g;
$han =~ s/🏥 의원 예약관리실/🏥 한의원 예약관리실/g;
$han =~ s/의원 예약관리실/한의원 예약관리실/g;
$han =~ s/의원소개/한의원소개/g;
$han =~ s/진료\(시술\)안내/진료\(한방\)안내/g;
$han =~ s/시술사례/진료사례/g;
$han =~ s/시술안내/진료안내/g;
$han =~ s/시술 내용 입력/진료 내용(추나,한약,침 등) 입력/g;
$han =~ s/진료\(시술\)종목/진료종목/g;

# 1-5. Professional Titles
$han =~ s/대표 의사/대표 한의사/g;
$han =~ s/대표의사/대표한의사/g;
$han =~ s/의원장/한의원장/g;
$han =~ s/의료진/한방의료진/g;
$han =~ s/전문의/한방 전문의/g;
$han =~ s/의사/한의사/g;
# Fix potential unintended double replacements
$han =~ s/한한의사/한의사/g;
$han =~ s/한한의원장/한의원장/g;
$han =~ s/한한의원/한의원/g;
$han =~ s/한한방/한방/g;

# 1-6. Categories in Notice Box & Headers
$han =~ s/🏥 의원 알림/🏥 한의원 알림/g;
$han =~ s/'clinic': '의원'/'clinic': '한의원'/g;
$han =~ s/📢 의원 소식 피드/📢 한의원 소식 피드/g;
$han =~ s/'의원'/'한의원'/g;

# 1-7. DocTalk Branding
$han =~ s/DocTalk - 한의사 소통/HanDocTalk - 한의사 소통/g;
$han =~ s/DocTalk/HanDocTalk/g;
$han =~ s/대한민국 한의사·한방의료진 전용/대한민국 한의사·한방의료진 전용/g;

# 1-8. Roles & LocalStorage keys
$han =~ s/yetalkDoctorName/yetalkHandoctorName/g;
$han =~ s/"doctor"/"korean_doctor"/g;
$han =~ s/'doctor'/'korean_doctor'/g;
$han =~ s/myBizUrl = "doctormain.html"/myBizUrl = "handoctormain.html"/g;
$han =~ s/yetalk_doctor_intro_pages_v3/yetalk_handoctor_intro_pages_v3/g;
$han =~ s/yetalk_doctor_beauty_v2/yetalk_handoctor_beauty_v2/g;
$han =~ s/yetalk_treatments_list_clinic/yetalk_treatments_list_han/g;
$han =~ s/doc_talk_feed_list/han_doc_talk_feed_list/g;
$han =~ s/clinic_talk_chat_msgs/han_clinic_talk_chat_msgs/g;

# 1-9. Default Treatments List (DEFAULT_CLINIC_TREATMENTS)
my $han_treats_block = q|const DEFAULT_CLINIC_TREATMENTS = [
    "척추·관절 추나요법",
    "체질 맞춤 한약 처방",
    "침구 및 봉약침 치료",
    "한방 물리치료·부항",
    "교통사고 후유증 케어"
];|;
$han =~ s/const DEFAULT_CLINIC_TREATMENTS = \[.*?\];/$han_treats_block/s;

# 1-10. Intro Slides (DEFAULT_INTRO_PAGES)
my $han_intro_pages = q|const DEFAULT_INTRO_PAGES = [
    {
        title: "한의원소개",
        img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=90",
        desc: "안녕하십니까, 예톡 우리동네한의원입니다.\n\n저희 한의원은 불필요한 과잉진료를 철저히 지양하고, 척추·관절 추나요법과 체질 맞춤 한약으로 환자분들의 건강과 활력을 되찾아 드립니다."
    },
    {
        isInvite: true,
        title: "한의원소개 (초대)",
        img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85",
        desc: "🌿 예톡 우리동네한의원에 여러분을 정성껏 초대합니다 🌿\n\n한의사의 1:1 맞춤 진료로 정직하게 다스립니다.\n언제든 편안하게 내원하시어 건강 상담과 체질 진단을 받아보세요!"
    },
    {
        title: "한의원소개 (진료시간 및 오시는 길)",
        img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
        desc: "⏰ 진료시간 안내\n평 일 : 오전 09:00 ~ 오후 07:00 (점심: 13:00~14:00)\n토요일 : 오전 09:00 ~ 오후 02:00 (점심시간 없음)\n일요일 및 공휴일 : 휴진\n\n📍 주소: 대한민국 중심가 메디컬타워 3층 (지하철역 2번 출구)"
    }
];|;
$han =~ s/const DEFAULT_INTRO_PAGES = \[.*?\];/$han_intro_pages/s;

# 1-11. Subjects & Cases (DEFAULT_BEAUTY_SUBJECTS)
my $han_subjects_block = q|const DEFAULT_BEAUTY_SUBJECTS = [
    {
        subjectId: "b0",
        title: "척추·관절 추나요법",
        cases: [
            {
                title: "비수술 디스크 척추·골반 교정 추나",
                desc: "한의사가 직접 손으로 틀어진 척추와 골반을 정밀 교정하여 신경 압박을 풀고 근골격계 통증을 근본적으로 다스립니다.",
                img1: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
            }
        ]
    },
    {
        subjectId: "b1",
        title: "체질 맞춤 한약",
        cases: [
            {
                title: "개인 맞춤 체질 청정한약 처방",
                desc: "식약처 규격 검증 정품 한약재만을 엄선하여 기혈 순환을 촉진하고 면역력 증진 및 만성 피로를 회복시킵니다.",
                img1: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
            }
        ]
    },
    {
        subjectId: "b2",
        title: "침구·약침 치료",
        cases: [
            {
                title: "급만성 통증 약침 및 전침 요법",
                desc: "경혈점에 순수 정제 한약 추출물을 직접 주입하여 강력한 소염 진통과 빠른 손상 조직 재생을 유도합니다.",
                img1: "https://images.unsplash.com/photo-1512290903672-d798546722f4?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
            }
        ]
    }
];|;
$han =~ s/const DEFAULT_BEAUTY_SUBJECTS = \[.*?\];/$han_subjects_block/s;

# 1-12. Default DocTalk Posts
my $han_doctalk_block = q|const DEFAULT_DOCTALK_POSTS = [
    {
        id: "dt_1",
        author: "김예톡 한의원장",
        dept: "척추관절/추나과",
        date: "2026.10.12 11:30",
        title: "[임상 공유] 경추·요추 디스크 환자 추나 치료 및 봉약침 병용 사례",
        body: "경추 디스크로 인한 상지 방사통 환자 대상 정골 추나요법과 봉독 약침 병행 시 신경 압박 완화 속도가 매우 우수했습니다. 시술 노하우와 임상 팁을 나눕니다.",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "dt_2",
        author: "박원장",
        dept: "한방내과/사상의학",
        date: "2026.10.12 09:15",
        title: "[처방 연구] 만성 소화불량 및 피로 개선을 위한 체질 맞춤 보약 가이드",
        body: "원장님들 안녕하세요. 사상체질별 보기·보혈 약재 구성과 탕전 노하우를 정리한 임상 리포트입니다. 궁금한 점 댓글 남겨주세요.",
        youtubeUrl: "",
        img: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "dt_3",
        author: "이원장",
        dept: "통증재활센터",
        date: "2026.10.11 18:40",
        title: "[치료 특강] 오십견 및 회전근개 손상 침구·온열치료 프로토콜",
        body: "어깨 관절 가동 범위 확장을 위한 견정혈, 견우혈 약침 및 전침 복합 요법 가이드입니다.",
        youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        img: ""
    }
];|;
$han =~ s/const DEFAULT_DOCTALK_POSTS = \[.*?\];/$han_doctalk_block/s;

# 1-13. Default Notice Posts
my $han_notices_block = q|const DEFAULT_NOTICES = [
    {
        id: 201, cat: "clinic", title: "환절기 면역력 증진 공진단·경옥고 맞춤 조제 안내",
        content: "환절기 기력 회복과 면역력 강화를 돕는 원방 공진단 및 전통 경옥고 상담을 진행합니다.\n\n한의사 1:1 체질 감별 후 정성껏 맞춤 조제됩니다.",
        author: "원장실", time: "오늘 오전"
    },
    {
        id: 202, cat: "church", title: "지역 주민과 함께하는 가을 힐링 음악회 안내",
        content: "행복한 교회에서 이웃 사랑 나눔 힐링 음악회를 개최합니다. 따뜻한 차와 다과가 준비되어 있습니다.",
        author: "교회 본부", time: "어제"
    },
    {
        id: 203, cat: "store", title: "제휴 매장 밀면 전문점 건강 할인 쿠폰 지급",
        content: "예톡 회원 전원에게 부산밀면가 식사 시 10% 현장 할인 혜택을 제공합니다.",
        author: "단골 혜택팀", time: "10.08"
    }
];|;
$han =~ s/const DEFAULT_NOTICES = \[.*?\];/$han_notices_block/s;

# 1-14. QR Card labels
$han =~ s/모바일 주치의 전용 QR코드/한방 주치의 전용 QR코드/g;

# 1-15. Popup urls
$han =~ s/doctoradmin\.html/doctoradmin.html?type=han/g;
$han =~ s/doctalk_popup\.html/doctalk_popup.html?role=korean_doctor/g;
$han =~ s/clinictalk_popup\.html/clinictalk_popup.html?role=korean_doctor/g;

# 1-16. Initial storage check in DOMContentLoaded
$han =~ s/let savedClinic = localStorage\.getItem\("yetalkDoctorName"\);.*?if \(!savedClinic \|\| savedClinic === "행복의원"\) \{.*?savedClinic = "예톡아름다운 의원";.*?localStorage\.setItem\("yetalkDoctorName", savedClinic\);.*?\}/let savedClinic = localStorage.getItem("yetalkHandoctorName"); if (!savedClinic || savedClinic.indexOf("아름다운") !== -1 || savedClinic === "행복의원") { savedClinic = "예톡 우리동네한의원"; localStorage.setItem("yetalkHandoctorName", savedClinic); }/s;

my $dst_han = "app/src/main/assets/handoctormain.html";
open my $out_han, ">:utf8", $dst_han or die "Cannot write $dst_han: $!";
print $out_han $han;
close $out_han;
print "handoctormain.html successfully generated: " . length($han) . " chars\n";


# =========================================================================
# 2. GENERATE dentalmain.html (치과: "예톡 스마일치과의원")
# =========================================================================
my $den = $content;

# 2-1. Title & Meta
$den =~ s/<title>.*?<\/title>/<title>예톡 스마일치과의원<\/title>/g;

# 2-2. Hospital Names (all variations)
$den =~ s/예톡\s*아름다운\s*의원/예톡 스마일치과의원/g;
$den =~ s/아름다운\s*의원/스마일치과의원/g;
$den =~ s/예톡의원/예톡치과의원/g;
$den =~ s/행복의원/스마일치과의원/g;

# 2-3. Header info & banners
$den =~ s/피부클리닉 · 리프팅 전문/디지털 임플란트 · 치아교정 · 심미보철 전문/g;
$den =~ s/⚡ 간단 접수를 원하시면 클릭하세요/⚡ 임플란트·충치·교정 간편 접수 (터치 즉시 예약접수)/g;
$den =~ s/🏥 의원 예약관리실/🏥 치과의원 예약관리실/g;
$den =~ s/의원 예약관리실/치과의원 예약관리실/g;
$den =~ s/의원소개/치과소개/g;
$den =~ s/진료\(시술\)안내/진료\(치과\)안내/g;
$den =~ s/시술사례/진료사례/g;
$den =~ s/시술안내/진료안내/g;
$den =~ s/시술 내용 입력/진료 내용(임플란트,교정,스케일링 등) 입력/g;
$den =~ s/진료\(시술\)종목/진료종목/g;

# 2-4. Professional Titles
$den =~ s/대표 의사/대표 치과의사/g;
$den =~ s/대표의사/대표치과의사/g;
$den =~ s/의원장/치과원장/g;
$den =~ s/의료진/치과의료진/g;
$den =~ s/전문의/치과 전문의/g;
$den =~ s/의사/치과의사/g;
# Fix potential unintended double replacements
$den =~ s/치과치과의사/치과의사/g;
$den =~ s/치과치과원장/치과원장/g;
$den =~ s/치과치과의원/치과의원/g;

# 2-5. Categories in Notice Box & Headers
$den =~ s/🏥 의원 알림/🏥 치과 알림/g;
$den =~ s/'clinic': '의원'/'clinic': '치과'/g;
$den =~ s/📢 의원 소식 피드/📢 치과 소식 피드/g;
$den =~ s/'의원'/'치과'/g;

# 2-6. DocTalk Branding
$den =~ s/DocTalk - 치과의사 소통/DenTalk - 치과의사 소통/g;
$den =~ s/DocTalk/DenTalk/g;
$den =~ s/대한민국 치과의사·치과의료진 전용/대한민국 치과의사·치과의료진 전용/g;

# 2-7. Roles & LocalStorage keys
$den =~ s/yetalkDoctorName/yetalkDentalName/g;
$den =~ s/"doctor"/"dentist"/g;
$den =~ s/'doctor'/'dentist'/g;
$den =~ s/myBizUrl = "doctormain.html"/myBizUrl = "dentalmain.html"/g;
$den =~ s/yetalk_doctor_intro_pages_v3/yetalk_dental_intro_pages_v3/g;
$den =~ s/yetalk_doctor_beauty_v2/yetalk_dental_beauty_v2/g;
$den =~ s/yetalk_treatments_list_clinic/yetalk_treatments_list_dental/g;
$den =~ s/doc_talk_feed_list/dental_doc_talk_feed_list/g;
$den =~ s/clinic_talk_chat_msgs/dental_clinic_talk_chat_msgs/g;

# 2-8. Default Treatments List (DEFAULT_CLINIC_TREATMENTS)
my $den_treats_block = q|const DEFAULT_CLINIC_TREATMENTS = [
    "디지털 임플란트",
    "클리어 투명 치아교정",
    "원데이 치아미백",
    "스케일링·잇몸케어",
    "무통 충치·신경치료"
];|;
$den =~ s/const DEFAULT_CLINIC_TREATMENTS = \[.*?\];/$den_treats_block/s;

# 2-9. Intro Slides (DEFAULT_INTRO_PAGES)
my $den_intro_pages = q|const DEFAULT_INTRO_PAGES = [
    {
        title: "치과소개",
        img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=90",
        desc: "안녕하십니까, 예톡 스마일치과의원입니다.\n\n저희 치과는 정밀 3D 디지털 장비로 정확히 진단하고, 무통 진료 시스템으로 덜 아프고 편안하게 평생 치아 건강을 지켜드립니다."
    },
    {
        isInvite: true,
        title: "치과소개 (초대)",
        img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85",
        desc: "🦷 예톡 스마일치과의원에 여러분을 정성껏 초대합니다 🦷\n\n치과의사의 1:1 맞춤 진료와 꼼꼼한 사후관리로 환한 미소를 선물합니다.\n언제든 편안하게 내원하시어 구강 검진과 임플란트·교정 상담을 받아보세요!"
    },
    {
        title: "치과소개 (진료시간 및 오시는 길)",
        img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
        desc: "⏰ 진료시간 안내\n평 일 : 오전 09:30 ~ 오후 06:30 (점심: 13:00~14:00)\n토요일 : 오전 09:30 ~ 오후 01:30 (점심시간 없음)\n일요일 및 공휴일 : 휴진\n\n📍 주소: 대한민국 중심가 메디컬타워 5층 (지하철역 1번 출구)"
    }
];|;
$den =~ s/const DEFAULT_INTRO_PAGES = \[.*?\];/$den_intro_pages/s;

# 2-10. Subjects & Cases (DEFAULT_BEAUTY_SUBJECTS)
my $den_subjects_block = q|const DEFAULT_BEAUTY_SUBJECTS = [
    {
        subjectId: "b0",
        title: "디지털 임플란트",
        cases: [
            {
                title: "네비게이션 3D 맞춤 임플란트 식립",
                desc: "첨단 3차원 CT 분석으로 잇몸 최소 절개 및 안전하고 정확한 식립으로 출혈과 통증을 최소화합니다.",
                img1: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
            }
        ]
    },
    {
        subjectId: "b1",
        title: "심미 치아교정",
        cases: [
            {
                title: "보이지 않는 인비절라인 투명교정",
                desc: "개인별 치아 배열을 디지털 시뮬레이션하여 티 나지 않고 정밀하게 치열을 바르게 정돈합니다.",
                img1: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
            }
        ]
    },
    {
        subjectId: "b2",
        title: "원데이 치아미백",
        cases: [
            {
                title: "식약처 안심 인증 전문가 치아미백",
                desc: "치아 손상 없이 안전한 고농도 미백 젤과 특수 광선으로 맑고 밝은 자연치아 미소를 되찾아 드립니다.",
                img1: "https://images.unsplash.com/photo-1512290903672-d798546722f4?auto=format&fit=crop&w=800&q=80",
                img2: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
            }
        ]
    }
];|;
$den =~ s/const DEFAULT_BEAUTY_SUBJECTS = \[.*?\];/$den_subjects_block/s;

# 2-11. Default DocTalk Posts
my $den_doctalk_block = q|const DEFAULT_DOCTALK_POSTS = [
    {
        id: "dt_1",
        author: "김예톡 치과원장",
        dept: "임플란트/구강악안면",
        date: "2026.10.12 11:30",
        title: "[임상 공유] 상악동 거상술 및 네비게이션 가이드 임플란트 식립 사례",
        body: "골밀도가 낮은 상악 구치부 부위에 최소 침습 상악동 거상술과 3D 디지털 가이드를 적용하여 수술 시간 단축 및 골유착 성공률을 극대화한 임상 데이터입니다.",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "dt_2",
        author: "박원장",
        dept: "교정과/심미치과",
        date: "2026.10.12 09:15",
        title: "[교정 세미나] 성인 투명교정(인비절라인) 블랙트라이앵글 예방 및 스트리핑 노하우",
        body: "원장님들 안녕하세요. 전치부 밀집 총생 환자의 투명교정 진행 시 치간 삭제(IPR) 시점과 어태치먼트 최적 배치 팁을 공유합니다.",
        youtubeUrl: "",
        img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "dt_3",
        author: "이원장",
        dept: "보존과/치주과",
        date: "2026.10.11 18:40",
        title: "[임상 가이드] 무통 근관치료(신경치료) 및 지르코니아 크라운 보철 프로토콜",
        body: "근관 성형 시 Ni-Ti 파일 회전 파절 방지 팁과 원데이 지르코니아 밀링 적합도 향상 노하우입니다.",
        youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        img: ""
    }
];|;
$den =~ s/const DEFAULT_DOCTALK_POSTS = \[.*?\];/$den_doctalk_block/s;

# 2-12. Default Notice Posts
my $den_notices_block = q|const DEFAULT_NOTICES = [
    {
        id: 201, cat: "clinic", title: "건강보험 적용 스케일링 및 잇몸 집중 케어 안내",
        content: "만 19세 이상 대한민국 국민 대상 연 1회 건강보험 적용 스케일링 기간입니다.\n\n정기적인 치석 제거로 치주질환을 예방하세요.",
        author: "원장실", time: "오늘 오전"
    },
    {
        id: 202, cat: "church", title: "지역 주민과 함께하는 가을 힐링 음악회 안내",
        content: "행복한 교회에서 이웃 사랑 나눔 힐링 음악회를 개최합니다. 따뜻한 차와 다과가 준비되어 있습니다.",
        author: "교회 본부", time: "어제"
    },
    {
        id: 203, cat: "store", title: "제휴 매장 밀면 전문점 건강 할인 쿠폰 지급",
        content: "예톡 회원 전원에게 부산밀면가 식사 시 10% 현장 할인 혜택을 제공합니다.",
        author: "단골 혜택팀", time: "10.08"
    }
];|;
$den =~ s/const DEFAULT_NOTICES = \[.*?\];/$den_notices_block/s;

# 2-13. QR Card labels
$den =~ s/모바일 주치의 전용 QR코드/평생 치아 주치의 전용 QR코드/g;

# 2-14. Popup urls
$den =~ s/doctoradmin\.html/doctoradmin.html?type=dental/g;
$den =~ s/doctalk_popup\.html/doctalk_popup.html?role=dentist/g;
$den =~ s/clinictalk_popup\.html/clinictalk_popup.html?role=dentist/g;

# 2-15. Initial storage check in DOMContentLoaded
$den =~ s/let savedClinic = localStorage\.getItem\("yetalkDoctorName"\);.*?if \(!savedClinic \|\| savedClinic === "행복의원"\) \{.*?savedClinic = "예톡아름다운 의원";.*?localStorage\.setItem\("yetalkDoctorName", savedClinic\);.*?\}/let savedClinic = localStorage.getItem("yetalkDentalName"); if (!savedClinic || savedClinic.indexOf("아름다운") !== -1 || savedClinic === "행복의원") { savedClinic = "예톡 스마일치과의원"; localStorage.setItem("yetalkDentalName", savedClinic); }/s;

my $dst_den = "app/src/main/assets/dentalmain.html";
open my $out_den, ">:utf8", $dst_den or die "Cannot write $dst_den: $!";
print $out_den $den;
close $out_den;
print "dentalmain.html successfully generated: " . length($den) . " chars\n";
