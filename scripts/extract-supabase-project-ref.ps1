# Called from deploy-supabase.bat / repair-supabase-baseline.bat
$RepoRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $RepoRoot '.env'

if (-not (Test-Path -LiteralPath $envPath)) {
  exit 2
}

$line = Get-Content -LiteralPath $envPath -ErrorAction Stop |
  Where-Object { $_ -match '^\s*VITE_SUPABASE_URL\s*=' } |
  Select-Object -First 1

if (-not $line) {
  exit 3
}

$u = ($line -split '=', 2)[1].Trim().Trim([char]0x22).TrimEnd('/')
if ($u -notmatch '(?i)^https://([a-z0-9]{8,64})\.supabase\.co$') {
  exit 4
}

Write-Output $Matches[1]
exit 0
