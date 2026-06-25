# Start ngrok tunnel for SePay webhook dev testing.
# Usage (PowerShell):
#   .\scripts\dev-sepay-ngrok.ps1
#   .\scripts\dev-sepay-ngrok.ps1 -Port 3000

param(
  [int]$Port = 3000
)

function Get-NgrokPath {
  $cmd = Get-Command ngrok -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  $wingetPath = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"
  if (Test-Path $wingetPath) { return $wingetPath }

  return $null
}

function Ensure-NgrokVersion($ngrokPath) {
  $versionLine = & $ngrokPath version 2>&1 | Select-Object -First 1
  if ($versionLine -match "3\.(\d+)\.") {
    $minor = [int]$Matches[1]
    if ($minor -lt 20) {
      Write-Host "ngrok $versionLine quá cũ (cần >= 3.20). Đang cập nhật..." -ForegroundColor Yellow
      & $ngrokPath update 2>&1 | Out-Null
      $versionLine = & $ngrokPath version 2>&1 | Select-Object -First 1
      Write-Host "Đã cập nhật: $versionLine" -ForegroundColor Green
    }
  }
}

function Show-NgrokUrl {
  param([int]$MaxAttempts = 20)

  for ($i = 0; $i -lt $MaxAttempts; $i++) {
    try {
      $tunnels = (Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2).tunnels
      $publicUrl = ($tunnels | Where-Object { $_.public_url -like "https://*" } | Select-Object -First 1).public_url
      if ($publicUrl) {
        Write-Host ""
        Write-Host "=== URL ngrok ===" -ForegroundColor Green
        Write-Host $publicUrl
        Write-Host ""
        Write-Host "SePay webhook URL:" -ForegroundColor Cyan
        Write-Host "$publicUrl/api/webhooks/sepay"
        Write-Host ""
        Write-Host "Dashboard: http://127.0.0.1:4040  |  Ctrl+C để dừng tunnel" -ForegroundColor DarkGray
        Write-Host ""
        return $true
      }
    } catch {
      Start-Sleep -Milliseconds 400
    }
  }

  Write-Host "Chưa lấy được URL — mở http://127.0.0.1:4040 sau vài giây." -ForegroundColor Yellow
  return $false
}

$ngrokPath = Get-NgrokPath
if (-not $ngrokPath) {
  Write-Host "ngrok chưa có trong PATH. Cài: winget install ngrok.ngrok" -ForegroundColor Red
  exit 1
}

Ensure-NgrokVersion $ngrokPath

Write-Host ""
Write-Host "=== SePay webhook dev (ngrok) ===" -ForegroundColor Cyan
Write-Host "App phải đang chạy: npm run dev  (port $Port)"
Write-Host ""

$ngrokJob = Start-Job -ScriptBlock {
  param($Path, $Port)
  & $Path http $Port 2>&1
} -ArgumentList $ngrokPath, $Port

Show-NgrokUrl | Out-Null

try {
  Receive-Job $ngrokJob -Wait
} finally {
  Stop-Job $ngrokJob -ErrorAction SilentlyContinue
  Remove-Job $ngrokJob -ErrorAction SilentlyContinue
}
