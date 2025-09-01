# Auto-Watcher para Deploy Automatico
$env:PATH += ";C:\Program Files\Git\bin"
$PortalDirectory = "c:\Users\rms\Documents\Projetos Python\PDF\V2\CertFlow.Portal"
$DeployScript = "$PortalDirectory\deploy.ps1"

Write-Host "=== AUTO WATCHER ATIVO ===" -ForegroundColor Cyan
Write-Host "Monitorando mudancas em arquivos..." -ForegroundColor Yellow
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Gray

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $PortalDirectory
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$lastDeployTime = [DateTime]::MinValue
$debounceSeconds = 30

$action = {
    $name = $Event.SourceEventArgs.Name
    $changeType = $Event.SourceEventArgs.ChangeType
    
    # Filtrar arquivos relevantes
    if ($name -match "\.(html|css|js|md)$" -and $changeType -eq "Changed") {
        $now = Get-Date
        $timeSince = ($now - $script:lastDeployTime).TotalSeconds
        
        if ($timeSince -gt $script:debounceSeconds) {
            Write-Host ""
            Write-Host "Mudanca detectada: $name" -ForegroundColor Green
            Write-Host "Iniciando deploy automatico..." -ForegroundColor Cyan
            
            try {
                & $script:DeployScript -Message "Auto-update: $name modificado"
                $script:lastDeployTime = $now
                Write-Host "Deploy automatico concluido!" -ForegroundColor Green
            }
            catch {
                Write-Host "Erro no deploy: $($_.Exception.Message)" -ForegroundColor Red
            }
            
            Write-Host "Continuando monitoramento..." -ForegroundColor Yellow
        }
    }
}

Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action

try {
    while ($true) {
        Start-Sleep 1
    }
}
finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "Auto-watcher parado." -ForegroundColor Red
}
