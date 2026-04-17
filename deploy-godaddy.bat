@echo off
echo ============================================
echo SAGEELAN FOUNDATION - AUTOMATED DEPLOYMENT
echo Sage With You - Living in Place
echo ============================================
echo.

REM Get current directory
set "CURRENT_DIR=%CD%"
echo Working directory: %CURRENT_DIR%
echo.

REM Check if we're in the right place
if not exist "src\app\App.tsx" (
    echo ERROR: App.tsx not found!
    echo Please run this script from your SageElan project folder.
    echo Current location: %CD%
    pause
    exit /b 1
)

REM Supabase: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example)
echo [1/7] Checking environment configuration...
if exist ".env" (
    echo    .env file found — Vite will embed VITE_* vars into the production build
) else (
    echo    WARNING: .env not found. Create .env from .env.example or the build may fail / auth will not work.
)
echo.

REM Clean old build files
echo [2/7] Cleaning old build files...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "dist" rmdir /s /q "dist"
if exist "package-lock.json" del /f /q "package-lock.json"
echo    Clean complete
echo.

REM Install dependencies
echo [3/7] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    echo Make sure Node.js and npm are installed.
    pause
    exit /b 1
)
echo.

REM Build
echo [4/7] Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    echo Check the error messages above.
    pause
    exit /b 1
)
echo.

REM Verify dist folder was created
if not exist "dist\index.html" (
    echo ERROR: Build did not create dist folder properly!
    pause
    exit /b 1
)

REM Create .htaccess for React Router
echo [5/7] Creating .htaccess for React Router...
(
echo ^<IfModule mod_rewrite.c^>
echo   RewriteEngine On
echo   RewriteBase /
echo   RewriteRule ^^index\.html$ - [L]
echo   RewriteCond %%{REQUEST_FILENAME} !-f
echo   RewriteCond %%{REQUEST_FILENAME} !-d
echo   RewriteCond %%{REQUEST_FILENAME} !-l
echo   RewriteRule . /index.html [L]
echo ^</IfModule^>
echo.
echo # Enable compression
echo ^<IfModule mod_deflate.c^>
echo   AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
echo ^</IfModule^>
echo.
echo # Browser caching
echo ^<IfModule mod_expires.c^>
echo   ExpiresActive On
echo   ExpiresByType image/jpg "access plus 1 year"
echo   ExpiresByType image/jpeg "access plus 1 year"
echo   ExpiresByType image/gif "access plus 1 year"
echo   ExpiresByType image/png "access plus 1 year"
echo   ExpiresByType image/svg+xml "access plus 1 year"
echo   ExpiresByType text/css "access plus 1 month"
echo   ExpiresByType application/javascript "access plus 1 month"
echo   ExpiresByType text/html "access plus 0 seconds"
echo ^</IfModule^>
) > "dist\.htaccess"
echo    .htaccess created with React Router support
echo.

REM Create zip
echo [6/7] Creating deployment zip...
if exist "sageelan-staging-deploy.zip" del /f /q "sageelan-staging-deploy.zip"
powershell Compress-Archive -Path "dist\*" -DestinationPath "sageelan-staging-deploy.zip" -Force
if errorlevel 1 (
    echo ERROR: Failed to create zip file!
    pause
    exit /b 1
)
echo.

REM Summary
echo [7/7] Build complete!
echo.
echo ============================================
echo SUCCESS! Deployment package ready.
echo ============================================
echo.
echo File: sageelan-staging-deploy.zip
echo Location: %CD%\sageelan-staging-deploy.zip
echo Size: 
powershell -command "(Get-Item 'sageelan-staging-deploy.zip').length/1MB -as [int]" 2>nul && echo MB
echo.
echo ============================================
echo GODADDY UPLOAD INSTRUCTIONS:
echo ============================================
echo.
echo 1. Login to GoDaddy cPanel
echo 2. Go to File Manager
echo 3. Navigate to public_html (or your staging subdirectory)
echo    Example: public_html/staging/sageelan/
echo 4. Delete all existing files in that directory
echo 5. Upload sageelan-staging-deploy.zip
echo 6. Right-click the zip file and select "Extract"
echo 7. Delete the zip file from server after extraction
echo.
echo ============================================
echo IMPORTANT CONFIGURATION NOTES:
echo ============================================
echo.
echo PASSWORD GATE (Staging Protection):
echo   - Status: ENABLED
echo   - Password: SageElan2026
echo   - Session: 24 hours
echo   - To disable: Set ENABLE_PASSWORD_GATE = false in
echo     src/app/components/PasswordGate.tsx
echo.
echo AUTHENTICATION SYSTEM:
echo   - Type: Mock Supabase Client (localStorage-based)
echo   - No database required for staging
echo   - Test accounts work in browser localStorage
echo   - To connect real Supabase: Follow in-app prompts
echo.
echo ROUTING:
echo   - Multi-page React Router setup
echo   - .htaccess configured for clean URLs
echo   - All routes will work after deployment
echo.
echo PAGES INCLUDED:
echo   - Home
echo   - About
echo   - Programs
echo   - Resources (with dashboard)
echo   - Contact
echo   - Login/Signup/Forgot Password/Reset Password
echo.
echo FEATURES:
echo   - Interactive self-assessment tools
echo   - Accessibility enhancements
echo   - Resource library with planning dashboard
echo   - Full authentication flow (mock)
echo   - Password-protected staging access
echo.
echo ============================================
echo TESTING CHECKLIST AFTER DEPLOYMENT:
echo ============================================
echo.
echo [ ] Site loads with password gate
echo [ ] Enter password: SageElan2026
echo [ ] Navigate to all pages (Home, About, Programs, etc.)
echo [ ] Test authentication (Login/Signup)
echo [ ] Test self-assessment tools
echo [ ] Test resource library and dashboard
echo [ ] Check mobile responsiveness
echo [ ] Verify all images load correctly
echo [ ] Test contact form
echo.
echo ============================================
echo.
echo Your staging site is ready to deploy!
echo Good luck with your launch! 🚀
echo.
echo ============================================
pause
