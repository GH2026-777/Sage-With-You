@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================
echo SAGE WITH YOU - Supabase Edge Functions deploy
echo ============================================
echo.

if not exist "package.json" (
  echo ERROR: Run from the Sage With You project root ^(folder containing package.json^).
  pause
  exit /b 1
)

REM Prefer: global `supabase` OR local CLI after `npm install` ^(devDependency^).
REM `npx supabase` without -y can hang on "Ok to install?" — we use `npx -y supabase` when no global/local.

where supabase >nul 2>&1
if not errorlevel 1 (
  set "SB_MODE=global"
  echo [CLI] Using global Supabase CLI from PATH.
  goto sb_check_login
)

if exist "node_modules\supabase\package.json" (
  set "SB_MODE=local"
  echo [CLI] Using local CLI: npx supabase ^(from npm install in this folder^).
  goto sb_check_login
)

set "SB_MODE=npx"
echo [CLI] Using: npx -y supabase
echo       First run may download the CLI ^(1–3 minutes^) with little output — please wait.
echo       Tip: run `npm install` here once to add a local CLI and speed this up.
goto sb_check_login

:sb_check_login
if defined SAGE_WITH_YOU_PROJECT_REF (set "PROJECT_REF=%SAGE_WITH_YOU_PROJECT_REF%") else (set "PROJECT_REF=htckswutkpktxclyijwk")
echo.
echo [1/3] Checking Supabase login ^(project ref: %PROJECT_REF%^)...

if "%SB_MODE%"=="global" (
  supabase projects list >nul 2>&1
) else if "%SB_MODE%"=="local" (
  call npx supabase projects list >nul 2>&1
) else (
  call npx -y supabase projects list >nul 2>&1
)

if errorlevel 1 (
  echo.
  echo Not logged in. A browser window may open — complete sign-in, then this script continues.
  if "%SB_MODE%"=="global" (
    supabase login
  ) else if "%SB_MODE%"=="local" (
    call npx supabase login
  ) else (
    call npx -y supabase login
  )
  if errorlevel 1 (
    echo Login failed or was cancelled.
    pause
    exit /b 1
  )
)

echo [2/3] Deploying submit-contact...
if "%SB_MODE%"=="global" (
  supabase functions deploy submit-contact --project-ref %PROJECT_REF%
) else if "%SB_MODE%"=="local" (
  call npx supabase functions deploy submit-contact --project-ref %PROJECT_REF%
) else (
  call npx -y supabase functions deploy submit-contact --project-ref %PROJECT_REF%
)
if errorlevel 1 goto fail

echo [3/3] Deploying delete-account...
if "%SB_MODE%"=="global" (
  supabase functions deploy delete-account --project-ref %PROJECT_REF%
) else if "%SB_MODE%"=="local" (
  call npx supabase functions deploy delete-account --project-ref %PROJECT_REF%
) else (
  call npx -y supabase functions deploy delete-account --project-ref %PROJECT_REF%
)
if errorlevel 1 goto fail

echo.
echo Done. ^(submit-contact, delete-account^)
pause
exit /b 0

:fail
echo.
echo Deploy failed. Check: supabase login, network, and that PROJECT_REF matches Dashboard - Settings - Reference ID.
echo Override: set SAGE_WITH_YOU_PROJECT_REF=your_ref
echo.
pause
exit /b 1
