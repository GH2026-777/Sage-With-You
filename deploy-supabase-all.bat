@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================
echo Sage With You - Full Supabase deploy
echo   1. Database migrations
echo   2. Edge Functions
echo ============================================
echo.

call "%~dp0deploy-supabase.bat"
if errorlevel 1 exit /b 1

echo.
echo Continuing to Edge Functions deploy...
echo.

call "%~dp0deploy-supabase-functions.bat"
exit /b %ERRORLEVEL%
