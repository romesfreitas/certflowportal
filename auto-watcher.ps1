# 👀 File Watcher - Deploy Automático quando arquivos mudarem
# Monitora alterações e faz deploy automaticamente

# Adicionar Git ao PATH se necessário
$env:PATH += ";C:\Program Files\Git\bin"

Write-Host "=== CERTFLOW PORTAL - AUTO WATCHER ===" -ForegroundColor Cyan
Write-Host "👀 Monitorando mudanças nos arquivos do portal..." -ForegroundColor Yellow
Write-Host "🚀 Deploy automático será executado quando detectar alterações" -ForegroundColor Green
Write-Host "⏹️  Pressione Ctrl+C para parar" -ForegroundColor Gray
Write-Host ""

# Configurações
$PortalDirectory = "c:\Users\rms\Documents\Projetos Python\PDF\V2\CertFlow.Portal"
$DeployScript = "$PortalDirectory\deploy-portal.ps1"

# Verificar se deploy script existe
if (-not (Test-Path $DeployScript)) {
    Write-Host "❌ Script de deploy não encontrado: $DeployScript" -ForegroundColor Red
    exit 1
}

# Criar FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $PortalDirectory
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

# Arquivos a monitorar
$watchFiles = @("*.html", "*.css", "*.js", "*.md")

# Variável para controlar debounce (evitar múltiplos deploys)
$lastDeployTime = [DateTime]::MinValue
$debounceSeconds = 30

# Função para executar deploy
function Start-Deploy {
    param($FileName)
    
    $now = Get-Date
    $timeSinceLastDeploy = ($now - $script:lastDeployTime).TotalSeconds
    
    if ($timeSinceLastDeploy -lt $debounceSeconds) {
        Write-Host "⏳ Deploy recente, aguardando..." -ForegroundColor Yellow
        return
    }
    
    Write-Host ""
    Write-Host "🔄 MUDANÇA DETECTADA: $FileName" -ForegroundColor Green
    Write-Host "🚀 Iniciando deploy automático..." -ForegroundColor Cyan
    
    try {
        # Executar script de deploy
        & $DeployScript -CommitMessage "Auto-update: $FileName modificado"
        
        $script:lastDeployTime = $now
        Write-Host "✅ Deploy automático concluído!" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Erro no deploy automático: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "👀 Continuando monitoramento..." -ForegroundColor Yellow
}

# Event handlers
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $name = $Event.SourceEventArgs.Name
    $changeType = $Event.SourceEventArgs.ChangeType
    
    # Filtrar apenas arquivos relevantes
    $isRelevantFile = $false
    foreach ($pattern in $watchFiles) {
        if ($name -like $pattern) {
            $isRelevantFile = $true
            break
        }
    }
    
    # Ignorar arquivos temporários e de sistema
    if ($name -like ".*" -or $name -like "~*" -or $name -like "*.tmp") {
        return
    }
    
    if ($isRelevantFile -and $changeType -eq "Changed") {
        Write-Host "📝 $changeType`: $name" -ForegroundColor Yellow
        Start-Deploy -FileName $name
    }
}

# Registrar eventos
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action

try {
    # Loop infinito para manter o script rodando
    while ($true) {
        Start-Sleep 1
    }
} finally {
    # Cleanup
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host ""
    Write-Host "🛑 File Watcher parado." -ForegroundColor Red
}
