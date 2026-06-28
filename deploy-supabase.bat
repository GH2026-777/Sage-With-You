@echo off
setlocal EnableExtensions EnableDelayedExpansion
REM Migrations only. Edge Functions: deploy-supabase-functions.bat (or deploy-supabase-all.bat)
cd /d "%~dp0"

echo ============================================
echo Sage With You - Supabase database migrations
echo ============================================
echo Working folder: %~dp0
echo.

if not exist "supabase\config.toml" (
  echo [ERROR] Run from the Sage With You project root.
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not on PATH.
  pause
  exit /b 1
)

set "SITE_SCRIPTS=%~dp0..\scripts"
if not exist "%SITE_SCRIPTS%\deploy-supabase-db.mjs" (
  echo [ERROR] Missing SITE\scripts\deploy-supabase-db.mjs
  pause
  exit /b 1
)

if defined SAGE_WITH_YOU_PROJECT_REF (
  set "SUPABASE_PROJECT_REF=%SAGE_WITH_YOU_PROJECT_REF%"
) else if exist "scripts\extract-supabase-project-ref.ps1" (
  for /f "usebackq delims=" %%i in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\extract-supabase-project-ref.ps1"`) do set "SUPABASE_PROJECT_REF=%%i"
)
if not defined SUPABASE_PROJECT_REF set "SUPABASE_PROJECT_REF=htckswutkpktxclyijwk"
echo Target project: !SUPABASE_PROJECT_REF! ^(Sage With You — NOT Sage Panthers^)
echo.

REM Auto-repair linked migration history once if SQL Editor baseline causes 001 to fail
set "SUPABASE_BASELINE_REPAIR_VERSIONS=001,002,003,004,0050,0051,006"

node "%SITE_SCRIPTS%\deploy-supabase-db.mjs" --label "Sage With You"
set "ERR=%ERRORLEVEL%"
if %ERR% NEQ 0 (
  echo.
  echo [ERROR] db push failed.
  echo If 001 fails with "policy already exists", run repair-supabase-baseline.bat once, then retry.
  echo.
  pause
  exit /b %ERR%
)

echo.
echo Next: deploy-supabase-functions.bat for Edge Functions
echo       ^(or deploy-supabase-all.bat for DB + functions^)
pause
exit /b 0
