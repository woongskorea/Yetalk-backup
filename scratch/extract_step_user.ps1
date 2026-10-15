$lines = [System.IO.File]::ReadLines("C:\Users\Administrator\.gemini\antigravity\brain\7169b4c7-c907-4d54-b2a7-538b2c219c76\.system_generated\logs\transcript_full.jsonl")
foreach ($line in $lines) {
    if ($line.Contains('"type":"USER_INPUT"') -and $line.Contains('<!DOCTYPE html>')) {
        $obj = ConvertFrom-Json $line
        $content = $obj.content
        $idx = $content.IndexOf("<!DOCTYPE html>")
        if ($idx -ge 0) {
            $html = $content.Substring($idx)
            $endIdx = $html.IndexOf("</USER_REQUEST>")
            if ($endIdx -ge 0) {
                $html = $html.Substring(0, $endIdx)
            }
            [System.IO.File]::WriteAllText("C:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\user_full_index.html", $html.Trim(), [System.Text.Encoding]::UTF8)
            Write-Host "Length of user html: $($html.Length)"
        }
    }
}
