$htmlPath = 'c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\doctormain.html'
$htmlBakPath = 'c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\doctormain.html.bak'
$jsPath = 'C:\Users\Administrator\AndroidStudioProjects\Yetalk\app\build\intermediates\assets\debug\mergeDebugAssets\doctormain.js'

$htmlRaw = [System.IO.File]::ReadAllText($htmlBakPath, [System.Text.Encoding]::UTF8)
$jsRaw = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)

Write-Host "Read HTML length: " $htmlRaw.Length
Write-Host "Read JS length: " $jsRaw.Length

$missingModals = @"

    <!-- 진료과목 대표 설명글 수정 모달 -->
    <div class="subject-manage-modal" id="modalSubjectHeroEdit">
        <div class="subject-manage-card">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid var(--border); padding-bottom:8px;">
                <strong style="font-size:16px; color:#0284c7;">✏️ 진료과목 설명문 수정</strong>
                <button type="button" style="background:none; border:none; font-size:22px; cursor:pointer;" onclick="closeModal('modalSubjectHeroEdit')">✕</button>
            </div>
            <div>
                <label style="font-size:12px; font-weight:800; color:#0284c7; display:block; margin-bottom:4px;">과목 안내 문구</label>
                <textarea id="inpSubjectHeroDesc" style="width:100%; height:90px; padding:10px; border:1.5px solid var(--border); border-radius:8px; font-size:13.5px; line-height:1.5; outline:none; resize:none;"></textarea>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px;">
                <button type="button" style="background:#e2e8f0; color:#334155; border:none; padding:8px 14px; border-radius:6px; font-size:12px; cursor:pointer;" onclick="closeModal('modalSubjectHeroEdit')">닫기</button>
                <button type="button" style="background:#0284c7; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-size:12px; font-weight:900; cursor:pointer;" onclick="saveSubjectHeroDesc()">저장하기</button>
            </div>
        </div>
    </div>

    <!-- 새 시술 사례 추가 모달 -->
    <div class="subject-manage-modal" id="modalAddCaseDirect">
        <div class="subject-manage-card">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid var(--border); padding-bottom:8px;">
                <strong style="font-size:16px; color:#0284c7;">➕ 새 시술 사례 추가</strong>
                <button type="button" style="background:none; border:none; font-size:22px; cursor:pointer;" onclick="closeModal('modalAddCaseDirect')">✕</button>
            </div>
            <div>
                <label style="font-size:12px; font-weight:800; color:#0284c7; display:block; margin-bottom:4px;">사례 메타 정보 (날짜 | 환자정보 | 시술명)</label>
                <input type="text" id="inpNewCaseMeta" class="doc-input" placeholder="예: 2026.10.15 | 김○○ (49세) | 턱 보톡스 시술">
            </div>
            <div>
                <label style="font-size:12px; font-weight:800; color:#0284c7; display:block; margin-bottom:4px;">상세 설명글</label>
                <textarea id="inpNewCaseSub" style="width:100%; height:80px; padding:10px; border:1.5px solid var(--border); border-radius:8px; font-size:13.5px; outline:none; resize:none;" placeholder="시술 결과 및 특징"></textarea>
            </div>
            <div style="display:flex; gap:8px;">
                <div style="flex:1;">
                    <label style="font-size:11.5px; font-weight:800; color:#475569; display:block; margin-bottom:4px;">📷 전(Before) / 대표 사진</label>
                    <input type="file" id="fileCaseBefore" accept="image/*" style="display:none;" onchange="handleCaseImgFile(event, 'before')">
                    <button type="button" style="width:100%; padding:8px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;" onclick="document.getElementById('fileCaseBefore').click()">사진 선택</button>
                </div>
                <div style="flex:1;">
                    <label style="font-size:11.5px; font-weight:800; color:#475569; display:block; margin-bottom:4px;">📷 후(After) 사진 (선택)</label>
                    <input type="file" id="fileCaseAfter" accept="image/*" style="display:none;" onchange="handleCaseImgFile(event, 'after')">
                    <button type="button" style="width:100%; padding:8px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;" onclick="document.getElementById('fileCaseAfter').click()">사진 선택</button>
                </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:6px;">
                <button type="button" style="background:#e2e8f0; color:#334155; border:none; padding:8px 14px; border-radius:6px; font-size:12px; cursor:pointer;" onclick="closeModal('modalAddCaseDirect')">취소</button>
                <button type="button" style="background:#0284c7; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-size:12px; font-weight:900; cursor:pointer;" onclick="saveNewCaseToCurrentSubject()">사례 등록</button>
            </div>
        </div>
    </div>
"@

# Insert missing modals
if (-not $htmlRaw.Contains('id="modalSubjectHeroEdit"')) {
    $insertPoint = '    <!-- QR A4 인쇄 레이아웃 -->'
    if ($htmlRaw.Contains($insertPoint)) {
        $htmlRaw = $htmlRaw.Replace($insertPoint, $missingModals + "`r`n`r`n" + $insertPoint)
    }
}

# Replace <script src="doctor.js"></script> with inline script
$targetTag = '<script src="doctor.js"></script>'
$replacement = @"
<script>
$jsRaw
</script>
"@

$newHtml = $htmlRaw.Replace($targetTag, $replacement)

# Save combined html
[System.IO.File]::WriteAllText($htmlPath, $newHtml, [System.Text.Encoding]::UTF8)

# Delete doctormain.js from assets if it exists
$assetsJs = 'c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\doctormain.js'
if (Test-Path $assetsJs) {
    Remove-Item -Path $assetsJs -Force
}
$assetsDocJs = 'c:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\doctor.js'
if (Test-Path $assetsDocJs) {
    Remove-Item -Path $assetsDocJs -Force
}

$finalSize = (Get-Item $htmlPath).Length
Write-Host "SUCCESS! Combined doctormain.html written. Final file size: $finalSize bytes"
