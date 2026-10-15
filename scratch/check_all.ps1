$adb = 'C:\Users\Administrator\AppData\Local\Android\Sdk\platform-tools\adb.exe'
$files = & $adb shell "run-as com.yetalk.app ls /data/data/com.yetalk.app/app_webview/Default/Local\ Storage/leveldb"
foreach ($f in $files) {
    $f = $f.Trim()
    if ($f -match '\.(ldb|log)$') {
        $out = & $adb shell "run-as com.yetalk.app cat /data/data/com.yetalk.app/app_webview/Default/Local\ Storage/leveldb/$f"
        $matches = $out | Select-String 'videoId'
        if ($matches) {
            Write-Host "Found in $f : "
            $matches | ForEach-Object { Write-Host $_.Line.Substring(0, [Math]::Min(150, $_.Line.Length)) }
        }
    }
}
