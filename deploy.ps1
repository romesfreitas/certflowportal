param([string]$Message = "Auto-update Portal")
$env:PATH += ";C:\Program Files\Git\bin"
Write-Host "=== DEPLOY PORTAL ===" -ForegroundColor Cyan
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
$commitMsg = "$Message - $timestamp"
git commit -m $commitMsg
git push origin main
Write-Host "Deploy concluido!" -ForegroundColor Green
Write-Host "Site: https://romesfreitas.github.io/certflowportal/" -ForegroundColor Yellow
