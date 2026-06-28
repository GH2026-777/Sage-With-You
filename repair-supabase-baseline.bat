@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo ============================================
echo Sage With You - Repair Supabase migration history
echo ============================================
echo.
echo Use when deploy-supabase.bat fails on 001 with "policy already exists".
echo This marks baseline migrations as APPLIED on the LINKED remote (no SQL re-run).
echo Then deploy-supabase.bat should apply only 007 and 008.
echo.
pause

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not on PATH.
  pause
  exit /b 1
)

set "SITE_SCRIPTS=%~dp0..\scripts"
if not exist "%SITE_SCRIPTS%\repair-supabase-baseline.mjs" (
  echo [ERROR] Missing SITE\scripts\repair-supabase-baseline.mjs
  pause
  exit /b 1
)

set "SUPABASE_BASELINE_REPAIR_VERSIONS=001,002,003,004,0050,0051,006"
node "%SITE_SCRIPTS%\repair-supabase-baseline.mjs" --versions "%SUPABASE_BASELINE_REPAIR_VERSIONS%"
set "ERR=%ERRORLEVEL%"
if %ERR% NEQ 0 (
  echo.
  echo [ERROR] Baseline repair failed. Run: supabase login
  pause
  exit /b %ERR%
)

echo.
echo Done. Next: deploy-supabase.bat
echo   (should apply 007_badge_wpe_unique_submitters.sql and 008_badge_submit_rate_limit.sql)
echo.
pause
exit /b 0
