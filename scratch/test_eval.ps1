$targets = Invoke-RestMethod -Uri "http://localhost:9222/json"
$wsUrl = $targets[0].webSocketDebuggerUrl

$ws = New-Object System.Net.WebSockets.ClientWebSocket
$cts = New-Object System.Threading.CancellationTokenSource
$ws.ConnectAsync([uri]$wsUrl, $cts.Token).Wait()

$expr = $args[0]
if (-not $expr) { $expr = "document.title" }

$payload = [ordered]@{
    id = 1
    method = 'Runtime.evaluate'
    params = @{
        expression = $expr
    }
} | ConvertTo-Json -Compress

$bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
$ws.SendAsync([ArraySegment[byte]]$bytes, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

$buf = New-Object byte[] 65536
$res = $ws.ReceiveAsync([ArraySegment[byte]]$buf, $cts.Token)
$res.Wait()
$ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, '', $cts.Token).Wait()

[System.Text.Encoding]::UTF8.GetString($buf, 0, $res.Result.Count)
