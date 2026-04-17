#!/bin/bash

echo "============================================"
echo "SAGEELAN FOUNDATION - AUTOMATED DEPLOYMENT"
echo "Sage With You - Living in Place"
echo "============================================"
echo ""

# Get current directory
CURRENT_DIR=$(pwd)
echo "Working directory: $CURRENT_DIR"
echo ""

# Check if we're in the right place
if [ ! -f "src/app/App.tsx" ]; then
    echo "ERROR: App.tsx not found!"
    echo "Please run this script from your SageElan project folder."
    echo "Current location: $(pwd)"
    read -p "Press enter to exit..."
    exit 1
fi

# Supabase: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example)
echo "[1/7] Checking environment configuration..."
if [ -f ".env" ]; then
    echo "   .env file found — Vite will embed VITE_* vars into the production build"
else
    echo "   WARNING: .env not found. Create .env from .env.example or the build may fail / auth will not work."
fi
echo ""

# Clean old build files
echo "[2/7] Cleaning old build files..."
rm -rf node_modules
rm -rf dist
rm -f package-lock.json
echo "   Clean complete"
echo ""

# Install dependencies
echo "[3/7] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed!"
    echo "Make sure Node.js and npm are installed."
    read -p "Press enter to exit..."
    exit 1
fi
echo ""

# Build
echo "[4/7] Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    echo "Check the error messages above."
    read -p "Press enter to exit..."
    exit 1
fi
echo ""

# Verify dist folder was created
if [ ! -f "dist/index.html" ]; then
    echo "ERROR: Build did not create dist folder properly!"
    read -p "Press enter to exit..."
    exit 1
fi

# Create .htaccess for React Router
echo "[5/7] Creating .htaccess for React Router..."
cat > "dist/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
EOF
echo "   .htaccess created with React Router support"
echo ""

# Create zip
echo "[6/7] Creating deployment zip..."
rm -f sageelan-staging-deploy.zip
cd dist
zip -r ../sageelan-staging-deploy.zip *
cd ..
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create zip file!"
    read -p "Press enter to exit..."
    exit 1
fi
echo ""

# Summary
echo "[7/7] Build complete!"
echo ""
echo "============================================"
echo "SUCCESS! Deployment package ready."
echo "============================================"
echo ""
echo "File: sageelan-staging-deploy.zip"
echo "Location: $(pwd)/sageelan-staging-deploy.zip"
echo "Size: $(du -h sageelan-staging-deploy.zip | cut -f1)"
echo ""
echo "============================================"
echo "GODADDY UPLOAD INSTRUCTIONS:"
echo "============================================"
echo ""
echo "1. Login to GoDaddy cPanel"
echo "2. Go to File Manager"
echo "3. Navigate to public_html (or your staging subdirectory)"
echo "   Example: public_html/staging/sageelan/"
echo "4. Delete all existing files in that directory"
echo "5. Upload sageelan-staging-deploy.zip"
echo "6. Right-click the zip file and select \"Extract\""
echo "7. Delete the zip file from server after extraction"
echo ""
echo "============================================"
echo "IMPORTANT CONFIGURATION NOTES:"
echo "============================================"
echo ""
echo "PASSWORD GATE (Staging Protection):"
echo "  - Status: ENABLED"
echo "  - Password: SageElan2026"
echo "  - Session: 24 hours"
echo "  - To disable: Set ENABLE_PASSWORD_GATE = false in"
echo "    src/app/components/PasswordGate.tsx"
echo ""
echo "AUTHENTICATION SYSTEM:"
echo "  - Type: Mock Supabase Client (localStorage-based)"
echo "  - No database required for staging"
echo "  - Test accounts work in browser localStorage"
echo "  - To connect real Supabase: Follow in-app prompts"
echo ""
echo "ROUTING:"
echo "  - Multi-page React Router setup"
echo "  - .htaccess configured for clean URLs"
echo "  - All routes will work after deployment"
echo ""
echo "PAGES INCLUDED:"
echo "  - Home"
echo "  - About"
echo "  - Programs"
echo "  - Resources (with dashboard)"
echo "  - Contact"
echo "  - Login/Signup/Forgot Password/Reset Password"
echo ""
echo "FEATURES:"
echo "  - Interactive self-assessment tools"
echo "  - Accessibility enhancements"
echo "  - Resource library with planning dashboard"
echo "  - Full authentication flow (mock)"
echo "  - Password-protected staging access"
echo ""
echo "============================================"
echo "TESTING CHECKLIST AFTER DEPLOYMENT:"
echo "============================================"
echo ""
echo "[ ] Site loads with password gate"
echo "[ ] Enter password: SageElan2026"
echo "[ ] Navigate to all pages (Home, About, Programs, etc.)"
echo "[ ] Test authentication (Login/Signup)"
echo "[ ] Test self-assessment tools"
echo "[ ] Test resource library and dashboard"
echo "[ ] Check mobile responsiveness"
echo "[ ] Verify all images load correctly"
echo "[ ] Test contact form"
echo ""
echo "============================================"
echo ""
echo "Your staging site is ready to deploy!"
echo "Good luck with your launch! 🚀"
echo ""
echo "============================================"
read -p "Press enter to exit..."
