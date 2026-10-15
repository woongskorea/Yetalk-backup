$c = [System.IO.File]::ReadAllText("C:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\user_full_index.html")

Write-Host "Contains YT.Player: $($c.IndexOf('YT.Player') -ge 0)"
Write-Host "Contains onYouTubeIframeAPIReady: $($c.IndexOf('onYouTubeIframeAPIReady') -ge 0)"
Write-Host "Contains postMessage: $($c.IndexOf('postMessage') -ge 0)"
