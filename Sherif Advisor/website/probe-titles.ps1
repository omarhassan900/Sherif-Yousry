try {
  $r = Invoke-WebRequest -Uri 'http://localhost:3000/api/content/sections/homepage/hero?lang=en' -UseBasicParsing
  $j = $r.Content | ConvertFrom-Json
  Write-Output ("title: " + $j.title)
  Write-Output ("eyebrow: " + $j.metadata.fields.eyebrow.en)
} catch {
  Write-Output ("ERR: " + $_.Exception.Message)
}
