$en = (Invoke-WebRequest -Uri 'http://localhost:3000/api/content/sections/homepage/hero?lang=en' -UseBasicParsing).Content | ConvertFrom-Json
Write-Output ("EN title: " + $en.title)
Write-Output ("EN body:  " + $en.body)
Write-Output ("EN fields eyebrow: " + $en.metadata.fields.eyebrow.en)
Write-Output ("EN fields ctaPrimary: " + $en.metadata.fields.ctaPrimary.en)
