16<#
.SYNOPSIS
   NestJS process manager with auto-restart
#>

$NESTJS_PATH = "C:\purple-moo\echoo\backend"
$NEST_LOG_DIR = "$PSScriptRoot\logs\nestjs.log"
$NEST_PID = $null

function Start-NestJS {
    try {
        Write-Output "$(Get-Date) [INFO] Starting NestJS..." | Tee-Object -FilePath $NEST_LOG_DIR -Append
        $script:NEST_PID = Start-Process "npm" -ArgumentList "run start:dev" -PassThru -WorkingDirectory $NESTJS_PATH -WindowStyle Hidden
        
        # Health check
        $tries = 0
        while ($tries -lt 5) {
            if (Test-NestJSHealth) {
                Write-Output "$(Get-Date) [SUCCESS] NestJS running (PID: $NEST_PID)" | Tee-Object -FilePath $NEST_LOG_DIR -Append
                return $true
            }
            Start-Sleep -Seconds 3
            $tries++
        }
        throw "NestJS failed health checks"
    }
    catch {
        Write-Output "$(Get-Date) [ERROR] $_" | Tee-Object -FilePath $NEST_LOG_DIR -Append
        return $false
    }
}

function Test-NestJSHealth {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000" -Method Get -TimeoutSec 3
        return $response -match "NestJS"  # Adjust based on your API response
    }
    catch { return $false }
}

function Stop-NestJS {
    try {
        if ($NEST_PID) {
            Write-Output "$(Get-Date) [INFO] Stopping NestJS (PID: $NEST_PID)..." | Tee-Object -FilePath $NEST_LOG_DIR -Append
            Stop-Process -Id $NEST_PID.Id -Force
        }
        # Cleanup any orphaned processes
        Get-Process node -ErrorAction SilentlyContinue | 
            Where-Object { $_.Path -like "*nestjs*" } | 
            Stop-Process -Force
        return $true
    }
    catch {
        Write-Output "$(Get-Date) [ERROR] $_" | Tee-Object -FilePath $NEST_LOG_DIR -Append
        return $false
    }
}