<#
.SYNOPSIS
   PostgreSQL service manager with auto-recovery
#>

$PG_PATH = "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe"
$DATA_DIR = "C:\Program Files\PostgreSQL\17\data"
$PG_LOG_DIR = "$PSScriptRoot\logs\postgres.log"

function Start-Postgres {
    try {
        Write-Output "$(Get-Date) [INFO] Starting PostgreSQL..." | Tee-Object -FilePath $PG_LOG_DIR -Append
        & $PG_PATH -D $DATA_DIR -l $PG_LOG_DIR start
        
        # Auto-recovery: Verify connection
        $tries = 0
        while ($tries -lt 3) {
            & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "SELECT 1" 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Output "$(Get-Date) [SUCCESS] PostgreSQL running" | Tee-Object -FilePath $PG_LOG_DIR -Append
                return $true
            }
            Start-Sleep -Seconds 2
            $tries++
        }
        throw "PostgreSQL failed to start after 3 attempts"
    }
    catch {
        Write-Output "$(Get-Date) [ERROR] $_" | Tee-Object -FilePath $PG_LOG_DIR -Append
        return $false
    }
}

function Stop-Postgres {
    try {
        Write-Output "$(Get-Date) [INFO] Stopping PostgreSQL..." | Tee-Object -FilePath $PG_LOG_DIR -Append
        & $PG_PATH -D $DATA_DIR stop
        
        # Force stop if still running
        if (Get-Process postgres -ErrorAction SilentlyContinue) {
            taskkill /IM postgres.exe /F /T 2>$null
            Write-Output "$(Get-Date) [WARN] PostgreSQL force-stopped" | Tee-Object -FilePath $PG_LOG_DIR -Append
        }
        return $true
    }
    catch {
        Write-Output "$(Get-Date) [ERROR] $_" | Tee-Object -FilePath $PG_LOG_DIR -Append
        return $false
    }
}