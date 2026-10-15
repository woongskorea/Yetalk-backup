$adb = 'C:\Users\Administrator\AppData\Local\Android\Sdk\platform-tools\adb.exe'
& $adb shell "run-as com.yetalk.app cat /data/data/com.yetalk.app/app_webview/Default/Local\ Storage/leveldb/000904.ldb" | Select-String -Pattern 'videoId' | ForEach-Object { $_.Line.Substring(0, [Math]::Min(200, $_.Line.Length)) }
