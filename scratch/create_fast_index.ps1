$lines = [System.IO.File]::ReadAllLines("C:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\user_full_index.html")

# Fix 1: line 14 (0-indexed 13)
for ($i = 0; $i -lt 30; $i++) {
    if ($lines[$i] -match '<script src="https://www.youtube.com/iframe_api"></script>') {
        $lines[$i] = '    <script src="https://www.youtube.com/iframe_api" async></script>'
        break
    }
}

# Fix 2: iframe src (around line 906)
for ($i = 850; $i -lt 950; $i++) {
    if ($lines[$i] -match 'src="https://www.youtube.com/embed/\$\{feed.videoId\}') {
        $lines[$i] = '                    src="https://www.youtube.com/embed/${feed.videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin || ''https://appassets.androidplatform.net'')}&autoplay=${isFirst ? 1 : 0}&controls=0&disablekb=1&fs=0&mute=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3"'
        break
    }
}

# Fix 3: resetToFirstHomeScreen (around line 1429)
$newLines = [System.Collections.ArrayList]::new()
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '^\s*renderFeedCards\(\);\s*$' -and $i -gt 1420) {
        [void]$newLines.Add('        // If already rendered, do not destroy DOM; resume play directly')
        [void]$newLines.Add('        if (container && container.children.length > 0) {')
        [void]$newLines.Add('            const feeds = loadSavedFeeds();')
        [void]$newLines.Add('            if (feeds.length > 0) {')
        [void]$newLines.Add('                playFeedVideo(feeds[0].id);')
        [void]$newLines.Add('                isVideoPaused = false;')
        [void]$newLines.Add('                document.querySelectorAll(".yt-center-play-badge").forEach(b => b.style.display = "none");')
        [void]$newLines.Add('                setControlsVisibility(false);')
        [void]$newLines.Add('            }')
        [void]$newLines.Add('        } else {')
        [void]$newLines.Add('            renderFeedCards();')
        [void]$newLines.Add('        }')
    } else {
        [void]$newLines.Add($lines[$i])
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines("C:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\index_fast.html", $newLines, $utf8NoBom)
Write-Host "Done writing scratch\index_fast.html with $($newLines.Count) lines."
