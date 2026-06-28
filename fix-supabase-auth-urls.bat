@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo ============================================
echo Sage With You — fix Supabase auth URLs
echo (production: sagewithyou.org, no hyphens)
echo ============================================
echo.

if defined SAGE_WITH_YOU_PROJECT_REF (
  set "PROJECT_REF=!SAGE_WITH_YOU_PROJECT_REF!"
) else if exist ".env" (
  if exist "scripts\extract-supabase-project-ref.ps1" (
    for /f "usebackq delims=" %%i in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\extract-supabase-project-ref.ps1"`) do set "PROJECT_REF=%%i"
  )
)
if not defined PROJECT_REF set "PROJECT_REF=htckswutkpktxclyijwk"

where supabase >nul 2>&1
if not errorlevel 1 (
  set "SB=supabase"
) else (
  set "SB=npx -y supabase"
)

echo Project ref: !PROJECT_REF!
echo Linking...
call %SB% link --project-ref !PROJECT_REF! --yes
if errorlevel 1 goto fail

echo.
echo Pushing auth URL config from supabase\config.toml ...
call %SB% config push --project-ref !PROJECT_REF! --yes
if errorlevel 1 goto fail

echo.
echo Done. Supabase now allows redirects to https://sagewithyou.org
echo.
pause
exit /b 0

:fail
echo.
echo Failed. Run `supabase login` in a terminal, then run this script again.
echo Manual fallback: Dashboard - Authentication - URL Configuration
echo   https://supabase.com/dashboard/project/!PROJECT_REF!/auth/url-configuration
pause
exit /b 1
