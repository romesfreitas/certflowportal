# 🚀 Script de Deploy Automático para GitHub Pages
# Executa sempre que houver mudanças nos arquivos do portal

param(
    [string]$CommitMessage = "Auto-update: Portal CertFlow atualizado"
)

Write-Host "=== CERTFLOW PORTAL - AUTO DEPLOY ===" -ForegroundColor Cyan
Write-Host ""

# Configurações
$PortalDirectory = "c:\Users\rms\Documents\Projetos Python\PDF\V2\CertFlow.Portal"
$GitRepo = "https://github.com/romesfreitas/certflowportal.git"
$Branch = "main"

# Verificar se está no diretório correto
Set-Location $PortalDirectory

Write-Host "📁 Diretório: $PortalDirectory" -ForegroundColor Yellow
Write-Host "🌐 Repositório: $GitRepo" -ForegroundColor Yellow
Write-Host ""

try {
    # 1. Verificar se é um repositório Git
    if (-not (Test-Path ".git")) {
        Write-Host "⚠️  Inicializando repositório Git..." -ForegroundColor Yellow
        git init
        git remote add origin $GitRepo
    }

    # 2. Verificar status do Git
    Write-Host "📊 Verificando mudanças..." -ForegroundColor Green
    $status = git status --porcelain
    
    if (-not $status) {
        Write-Host "✅ Nenhuma mudança detectada. Portal está atualizado!" -ForegroundColor Green
        return
    }

    Write-Host "📝 Mudanças detectadas:" -ForegroundColor Yellow
    git status --short
    Write-Host ""

    # 3. Adicionar todos os arquivos
    Write-Host "📦 Adicionando arquivos..." -ForegroundColor Green
    git add .

    # 4. Commit das mudanças
    Write-Host "💾 Fazendo commit..." -ForegroundColor Green
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $fullMessage = "$CommitMessage - $timestamp"
    git commit -m $fullMessage

    # 5. Push para GitHub
    Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Green
    git push origin $Branch

    Write-Host ""
    Write-Host "✅ DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
    Write-Host "🌐 Site será atualizado em: https://romesfreitas.github.io/certflowportal/" -ForegroundColor Cyan
    Write-Host "⏱️  Aguarde 1-2 minutos para propagação do GitHub Pages" -ForegroundColor Yellow

} catch {
    Write-Host ""
    Write-Host "❌ ERRO DURANTE DEPLOY:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "   1. Verificar credenciais Git" -ForegroundColor Gray
    Write-Host "   2. Configurar autenticação GitHub" -ForegroundColor Gray
    Write-Host "   3. Verificar conectividade" -ForegroundColor Gray
}
