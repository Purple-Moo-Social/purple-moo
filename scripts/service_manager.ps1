

<#
.SYNOPSIS
   Hybrid service manager with dependency control
.EXAMPLE
   .\service_manager.ps1 -Action start -Target nest
   .\service_manager.ps1 -Action stop -Target all
#>

param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("all","postgres","nest")]  # Allowed values
    [string]$Target,  # Remove default value to enforce validation

    [Parameter(Mandatory=$true)]
    [ValidateSet("start","stop","restart")]
    [string]$Action
)

# Add this after the param block
if ($Target -notin @("all","postgres","nest")) {
  Write-Error "Invalid Target: $Target. Valid values are 'all', 'postgres', or 'nest'"
  exit 1
}

# Add this near the top (after param block)
$LOG_DIR = "$PSScriptRoot\logs"
if (!(Test-Path $LOG_DIR)) { New-Item -ItemType Directory $LOG_DIR -Force }
"$(Get-Date) [SYSTEM] Script started" | Out-File "$LOG_DIR\service.log" -Append -Encoding utf8

# Import modules
. "$PSScriptRoot\postgres_ctl.ps1"
. "$PSScriptRoot\nest_ctl.ps1"

# Log rotation (keep last 7 days)
$logs = "$PSScriptRoot\logs\*"
Get-ChildItem $logs | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item

switch ($Action) {
    "start" {
        if ($Target -in ("all","postgres")) {
            if (-not (Start-Postgres)) { exit 1 }
        }
        if ($Target -in ("all","nest")) {
            if (-not (Start-NestJS)) { exit 1 }
        }
    }
    "stop" {
        if ($Target -in ("all","nest")) { Stop-NestJS }
        if ($Target -in ("all","postgres")) { Stop-Postgres }
    }
    "restart" {
        if ($Target -in ("all","nest")) { 
            Stop-NestJS
            Start-Sleep -Seconds 2
            Start-NestJS
        }
        if ($Target -in ("all","postgres")) {
            Stop-Postgres
            Start-Sleep -Seconds 5  # Allow proper shutdown
            Start-Postgres
        }
    }
}