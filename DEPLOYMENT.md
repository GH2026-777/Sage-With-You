# SageÉlan Foundation - Deployment Guide

## 🚀 Quick Start: Deploy to GoDaddy Staging

### Prerequisites
- Node.js and npm installed
- GoDaddy hosting account with cPanel access
- Command line/terminal access

---

## Windows Deployment

### Step 1: Run the Deployment Script
```bash
deploy-godaddy.bat
```

This automated script will:
1. ✅ Check environment configuration
2. ✅ Clean old build files
3. ✅ Install all dependencies
4. ✅ Build the production-ready site
5. ✅ Create .htaccess for React Router
6. ✅ Generate deployment zip file
7. ✅ Display upload instructions

### Step 2: Upload to GoDaddy
1. **Login** to GoDaddy cPanel
2. **Navigate** to File Manager
3. **Go to** your staging directory (e.g., `public_html/staging/sageelan/`)
4. **Delete** all existing files in that directory
5. **Upload** `sageelan-staging-deploy.zip`
6. **Right-click** the zip file → Select "Extract"
7. **Delete** the zip file from server

✅ **Done!** Your site is now live at your staging URL.

---

## Mac/Linux Deployment

### Step 1: Make Script Executable
```bash
chmod +x deploy-godaddy.sh
```

### Step 2: Run the Deployment Script
```bash
./deploy-godaddy.sh
```

Follow the same GoDaddy upload steps as Windows above.

---

## 🔐 Password Gate Configuration

Your staging site is protected with a password gate:

- **Password:** `SageElan2026`
- **Session Duration:** 24 hours
- **Location:** `/src/app/components/PasswordGate.tsx`

### To Change the Password
Edit `/src/app/components/PasswordGate.tsx`:
```typescript
const SITE_PASSWORD = 'YourNewPassword'; // Change this
```

### To Disable Password Protection
```typescript
const ENABLE_PASSWORD_GATE = false; // Set to false
```

Then rebuild and redeploy.

---

## 🌐 What Gets Deployed

### Pages
- ✅ Home page
- ✅ About page
- ✅ Programs page
- ✅ Resources page (with dashboard)
- ✅ Contact page
- ✅ Login/Signup pages
- ✅ Forgot Password/Reset Password pages

### Features
- ✅ Interactive self-assessment tools
- ✅ Comprehensive accessibility enhancements
- ✅ Resource library with planning dashboard
- ✅ Full authentication flow (mock localStorage-based)
- ✅ Password-protected staging access
- ✅ Responsive design for all devices
- ✅ React Router with clean URLs

### Technical Details
- **Framework:** React + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router (Data Mode)
- **Authentication:** Mock Supabase Client (localStorage)
- **Icons:** Lucide React
- **Build Output:** Static files in `/dist`

---

## 📋 Post-Deployment Testing Checklist

After uploading to GoDaddy, test the following:

### Basic Functionality
- [ ] Site loads with password gate
- [ ] Enter password: `SageElan2026`
- [ ] Password session persists for 24 hours
- [ ] All pages load correctly (Home, About, Programs, Resources, Contact)
- [ ] Navigation works between pages
- [ ] Footer links function properly

### Authentication
- [ ] Login page displays correctly
- [ ] Signup form works
- [ ] Forgot password flow functions
- [ ] Reset password page accessible
- [ ] Mock authentication stores in localStorage

### Interactive Features
- [ ] Self-assessment tools load and function
- [ ] Resource library displays correctly
- [ ] Planning dashboard works
- [ ] All interactive elements respond

### Visual & Responsive
- [ ] Images load correctly
- [ ] SVG icons display properly
- [ ] Site is responsive on mobile
- [ ] Site is responsive on tablet
- [ ] Site is responsive on desktop
- [ ] Accessibility features work (font size, contrast)

### Forms
- [ ] Contact form displays correctly
- [ ] Form validation works
- [ ] Form submissions trigger appropriate responses

---

## 🛠 Troubleshooting

### Issue: Pages show 404 on refresh
**Solution:** Make sure `.htaccess` is in the root directory of your deployment. The script creates this automatically.

### Issue: Images don't load
**Solution:** Check that all files were extracted from the zip. Re-extract if needed.

### Issue: Site shows blank page
**Solution:** 
1. Check browser console for errors (F12)
2. Verify all files uploaded correctly
3. Ensure you're accessing the correct URL

### Issue: Password gate doesn't appear
**Solution:** Clear browser cache and localStorage, then reload

### Issue: Routing doesn't work
**Solution:** 
1. Verify `.htaccess` exists in root directory
2. Check that mod_rewrite is enabled on server (contact GoDaddy if needed)

---

## 🔄 Updating the Site

To deploy updates:

1. Make your changes to the source code
2. Run the deployment script again: `deploy-godaddy.bat` (or `.sh`)
3. Upload the new `sageelan-staging-deploy.zip` to GoDaddy
4. Extract and replace files

**Note:** Users will need to re-enter the password if localStorage is cleared.

---

## 📁 Deployment File Structure

After extraction on GoDaddy, your directory should look like:
```
public_html/staging/sageelan/
├── index.html
├── .htaccess
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [images and other assets]
└── [other static files]
```

---

## 🔗 Important URLs (Update After Deployment)

- **Staging URL:** `https://yourdomain.com/staging/sageelan/`
- **Production URL:** `https://www.sagelanelanfoundation.org/` (when ready)

---

## 📞 Support

If you encounter issues during deployment:

1. Check the error messages from the deployment script
2. Review the troubleshooting section above
3. Verify Node.js and npm are up to date
4. Contact GoDaddy support for server-specific issues

---

## 🎯 Going Live (Production)

When ready to remove password protection and go live:

1. Edit `/src/app/components/PasswordGate.tsx`
2. Set `ENABLE_PASSWORD_GATE = false`
3. Rebuild: `npm run build`
4. Deploy to production directory (e.g., `public_html/`)
5. Point your domain to the production directory

---

## 📝 Notes

- **Authentication:** Currently uses mock localStorage-based auth. To enable real Supabase, follow prompts in the app
- **Forms:** Contact form shows success messages but doesn't send emails (add backend integration as needed)
- **Analytics:** Add Google Analytics or tracking code before production launch
- **SEO:** Update meta tags in `/index.html` for production

---

**Created for:** SageÉlan Foundation - Sage With You (Living in Place)  
**Last Updated:** March 18, 2026  
**Build System:** Vite + React + Tailwind CSS v4
