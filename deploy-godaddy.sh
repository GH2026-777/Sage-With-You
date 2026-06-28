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

# Clean old build output only
echo "[2/7] Cleaning old build files..."
rm -rf dist
echo "   Clean complete"
echo ""

# Install dependencies
echo "[3/7] Installing dependencies..."
npm ci
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

# Create zip (unix 0644 for cPanel)
echo "[6/7] Creating deployment zip..."
DEPLOY_DATE=$(date +%Y-%m-%d)
ZIPNAME="sageelan-staging-deploy-${DEPLOY_DATE}.zip"
echo "   Output: $ZIPNAME"
"$(cd "$(dirname "$0")/.." && pwd)/scripts/create-deploy-zip.sh" dist "$ZIPNAME"
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
echo "File: $ZIPNAME"
echo "Location: $(pwd)/$ZIPNAME"
echo "Size: $(du -h "$ZIPNAME" | cut -f1)"
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
echo "5. Upload $ZIPNAME"
echo "6. Right-click the zip file and select \"Extract\""
echo "7. Delete the zip file from server after extraction"
echo ""
echo "============================================"
echo "IMPORTANT CONFIGURATION NOTES:"
echo "============================================"
echo ""
echo "PASSWORD GATE (staging / UAT):"
echo "  - ON by default (set VITE_ENABLE_PASSWORD_GATE=false for public go-live)"
echo "  - Password: VITE_STAGING_GATE_PASSWORD in .env / .env.production"
echo "  - While gate is ON, all pages use noindex for crawlers"
echo ""
echo "AUTHENTICATION:"
echo "  - Supabase email + password (sign-in, join, reset, account delete)"
echo "  - Requires VITE_SUPABASE_* at build time"
echo ""
echo "CONTACT FORM:"
echo "  - Edge Function submit-contact + O365 SMTP (see docs/SUPABASE_OPS_CHECKLIST.md)"
echo ""
echo "ROUTING:"
echo "  - React Router + .htaccess in dist/"
echo ""
echo "PAGES INCLUDED:"
echo "  - Home, About, Programs, Resources, Assessments, Library, Contact, Account"
echo "  - Login, Join, Forgot/Reset password, Privacy, Terms"
echo ""
echo "FEATURES:"
echo "  - Self-assessment tools, accessibility widget, cookie consent"
echo "  - Optional library Storage, PWA manifest"
echo ""
echo "============================================"
echo "TESTING CHECKLIST AFTER DEPLOYMENT:"
echo "============================================"
echo ""
echo "[ ] Site loads with staging gate (if enabled)"
echo "[ ] Sign up, confirm email, sign in"
echo "[ ] Contact form + confirmation email"
echo "[ ] Navigate all main pages"
echo "[ ] Mobile responsiveness"
echo ""
echo "============================================"
echo ""
echo "Your staging site is ready to deploy!"
echo "Good luck with your launch! 🚀"
echo ""
echo "============================================"
read -p "Press enter to exit..."
