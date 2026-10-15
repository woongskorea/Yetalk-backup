$transcriptPath = 'C:\Users\Administrator\.gemini\antigravity\brain\7169b4c7-c907-4d54-b2a7-538b2c219c76\.system_generated\logs\transcript_full.jsonl'
$reader = [System.IO.File]::OpenText($transcriptPath)
$lastMatchingContent = $null

while (-not $reader.EndOfStream) {
    $line = $reader.ReadLine()
    if ($line.Contains('<!DOCTYPE html>') -and $line.Contains('doctormain.html')) {
        $lastMatchingContent = $line
    }
}
$reader.Close()

if ($lastMatchingContent) {
    Write-Host "Found line! Length: " $lastMatchingContent.Length
    # Parse JSON
    $jsonObj = $lastMatchingContent | ConvertFrom-Json
    $userText = $jsonObj.content
    # Find <!DOCTYPE html>
    $idx = $userText.IndexOf('<!DOCTYPE html>')
    if ($idx -ge 0) {
        $htmlCode = $userText.Substring($idx)
        [System.IO.File]::WriteAllText('c:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\original_user_doctormain.html', $htmlCode, [System.Text.Encoding]::UTF8)
        Write-Host "Successfully extracted original doctormain.html to scratch! Length:" $htmlCode.Length
    }
}
