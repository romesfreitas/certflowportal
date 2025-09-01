# 🔧 Configuração Inicial do Git para Deploy Automático

# Adicionar Git ao PATH se necessário
$env:PATH += ";C:\Program Files\Git\bin"

Write-Host "=== CONFIGURAÇÃO GIT - CERTFLOW PORTAL ===" -ForegroundColor Cyan
Write-Host ""

# Diretório do portal
$PortalDirectory = "c:\Users\rms\Documents\Projetos Python\PDF\V2\CertFlow.Portal"
Set-Location $PortalDirectory

Write-Host "📁 Configurando Git no diretório: $PortalDirectory" -ForegroundColor Yellow
Write-Host ""

try {
    # 1. Inicializar repositório se necessário
    if (-not (Test-Path ".git")) {
        Write-Host "🆕 Inicializando repositório Git..." -ForegroundColor Green
        git init
    } else {
        Write-Host "✅ Repositório Git já existe" -ForegroundColor Green
    }

    # 2. Configurar remote origin
    Write-Host "🔗 Configurando remote origin..." -ForegroundColor Green
    git remote remove origin 2>$null
    git remote add origin https://github.com/romesfreitas/certflowportal.git

    # 3. Configurar branch principal
    Write-Host "🌿 Configurando branch main..." -ForegroundColor Green
    git branch -M main

    # 4. Configurar usuário Git (se necessário)
    $gitUser = git config user.name
    $gitEmail = git config user.email

    if (-not $gitUser) {
        Write-Host "👤 Configurando usuário Git..." -ForegroundColor Yellow
        $username = Read-Host "Digite seu nome para Git"
        git config user.name $username
    } else {
        Write-Host "👤 Usuário Git: $gitUser" -ForegroundColor Gray
    }

    if (-not $gitEmail) {
        Write-Host "📧 Configurando email Git..." -ForegroundColor Yellow
        $email = Read-Host "Digite seu email para Git"
        git config user.email $email
    } else {
        Write-Host "📧 Email Git: $gitEmail" -ForegroundColor Gray
    }

    # 5. Criar .gitignore se não existir
    $gitignorePath = ".gitignore"
    if (-not (Test-Path $gitignorePath)) {
        Write-Host "📄 Criando .gitignore..." -ForegroundColor Green
        @"
# Arquivos temporários
*.tmp
*~
.DS_Store
Thumbs.db

# Logs
*.log

# Dependências
node_modules/

# Configurações locais
.env
.env.local
"@ | Out-File -FilePath $gitignorePath -Encoding UTF8
    }

    # 6. Fazer commit inicial dos arquivos atuais
    Write-Host "📦 Adicionando arquivos existentes..." -ForegroundColor Green
    git add .

    $status = git status --porcelain
    if ($status) {
        Write-Host "💾 Fazendo commit inicial..." -ForegroundColor Green
        git commit -m "Initial commit: CertFlow Portal setup"
    }

    # 7. Configurar push para main
    Write-Host "🚀 Configurando push upstream..." -ForegroundColor Green
    git push -u origin main

    Write-Host ""
    Write-Host "✅ CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Execute: .\auto-watcher.ps1 (para monitoramento automático)" -ForegroundColor Gray
    Write-Host "   2. Ou use: .\deploy-portal.ps1 (para deploy manual)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🌐 Site: https://romesfreitas.github.io/certflowportal/" -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "❌ ERRO NA CONFIGURAÇÃO:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "   1. Verificar se Git está instalado" -ForegroundColor Gray
    Write-Host "   2. Configurar autenticação GitHub (token)" -ForegroundColor Gray
    Write-Host "   3. Verificar permissões do repositório" -ForegroundColor Gray
}
