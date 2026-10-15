$userHtml = [System.IO.File]::ReadAllText("C:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\user_full_index.html")
$currentHtml = [System.IO.File]::ReadAllText("C:\Users\Administrator\AndroidStudioProjects\Yetalk\app\src\main\assets\index.html")

Write-Host "User HTML length: $($userHtml.Length)"
Write-Host "Current index.html length: $($currentHtml.Length)"

if ($userHtml -eq $currentHtml) {
    Write-Host "EXACT MATCH: userHtml is identical to current index.html!"
} else {
    Write-Host "DIFFERENCE FOUND!"
}
