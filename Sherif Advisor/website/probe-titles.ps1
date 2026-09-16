$r = Invoke-WebRequest -Uri 'http://localhost:3000/services' -UseBasicParsing
if ($r.Content -match 'No services listed yet') { Write-Output 'FOUND_EMPTY_MESSAGE' } else { Write-Output 'NO_EMPTY_MESSAGE' }
$m = ([regex]::Matches($r.Content, '/services/[a-z0-9]+')).Count
Write-Output "service_links=$m"
