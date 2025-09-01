# Script de Deploy Simples
param([string]$CommitMessage = "Auto-update: Portal CertFlow atualizado")

# Adicionar Git ao PATH
$env:PATH += ";C:\Program Files\Git\bin"

Write-Host "=== CERTFLOW PORTAL - DEPLOY ===" -ForegroundColor Cyan

try {
    # Verificar mudanças
    $status = git status --porcelain
    
    if (-not $status) {
        Write-Host "✅ Nenhuma mudança detectada!" -ForegroundColor Green
        return
    }

    # Fazer deploy
    Write-Host "📝 Mudanças detectadas, fazendo deploy..." -ForegroundColor Yellow
    git add .
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $fullMessage = "$CommitMessage - $timestamp"
    git commit -m $fullMessage
    
    git push origin main
    
    Write-Host "✅ DEPLOY CONCLUÍDO!" -ForegroundColor Green
    Write-Host "🌐 Site: https://romesfreitas.github.io/certflowportal/" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
