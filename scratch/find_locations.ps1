$original = [System.IO.File]::ReadAllText("C:\Users\Administrator\AndroidStudioProjects\Yetalk\scratch\user_full_index.html")

# Let's inspect the exact lines around iframe_api in user_full_index.html
$idx1 = $original.IndexOf('<script src="https://www.youtube.com/iframe_api"></script>')
Write-Host "Found iframe_api script at index: $idx1"

# Let's inspect renderFeedCards in user_full_index.html
$idx2 = $original.IndexOf('function renderFeedCards()')
Write-Host "Found renderFeedCards at index: $idx2"

# Let's inspect resetToFirstHomeScreen in user_full_index.html
$idx3 = $original.IndexOf('function resetToFirstHomeScreen()')
Write-Host "Found resetToFirstHomeScreen at index: $idx3"
