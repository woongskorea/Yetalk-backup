$lines1 = [System.IO.File]::ReadAllLines("C:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\user_full_index.html")
$lines2 = [System.IO.File]::ReadAllLines("C:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\index_fast.html")

Write-Host "Original lines: $($lines1.Length)"
Write-Host "Modified lines: $($lines2.Length)"

# Let's print the changed line ranges
for ($i = 0; $i -lt [Math]::Max($lines1.Length, $lines2.Length); $i++) {
    $l1 = if ($i -lt $lines1.Length) { $lines1[$i] } else { "" }
    $l2 = if ($i -lt $lines2.Length) { $lines2[$i] } else { "" }
    if ($l1 -ne $l2) {
        Write-Host "Diff at line $($i + 1):"
        Write-Host "  ORIGINAL: $l1"
        Write-Host "  MODIFIED: $l2"
        # show a few lines
        $i += 10
    }
}
