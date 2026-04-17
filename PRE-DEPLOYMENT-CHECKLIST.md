# Pre-Deployment Checklist
## SageÉlan Foundation - Sage With You (Living in Place)

Complete this checklist before running the deployment script.

---

## 📋 Configuration Review

### Password Gate Settings
- [ ] Password is set to: `SageElan2026` (or your preferred password)
- [ ] Password gate is ENABLED (`ENABLE_PASSWORD_GATE = true`)
- [ ] Session duration is appropriate (default: 24 hours)
- [ ] Location: `/src/app/components/PasswordGate.tsx`

### Site Content
- [ ] All page content is finalized
- [ ] Contact information is correct
- [ ] Program descriptions are accurate
- [ ] About page reflects current mission/vision
- [ ] Resources are up-to-date

### Branding & Design
- [ ] Logo is correct
- [ ] Color scheme matches brand guidelines
- [ ] Typography is consistent
- [ ] Images are high quality
- [ ] All placeholder content replaced

---

## 🔧 Technical Review

### Code Quality
- [ ] No console errors in browser console (F12)
- [ ] No TypeScript/build errors
- [ ] All links work correctly
- [ ] Forms validate properly
- [ ] Navigation functions as expected

### Responsive Design
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] All breakpoints look good

### Accessibility
- [ ] Font size controls work
- [ ] High contrast mode functions
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Alt text on all images

### Performance
- [ ] Images are optimized
- [ ] No large file sizes
- [ ] Page loads quickly in dev mode
- [ ] No memory leaks

---

## 🌐 Browser Testing

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Mobile browsers

---

## 📄 Content Accuracy

### Contact Information
- [ ] Email address correct
- [ ] Phone number correct
- [ ] Physical address (if applicable)
- [ ] Social media links (if applicable)

### Legal/Compliance
- [ ] Privacy policy (if required)
- [ ] Terms of service (if required)
- [ ] Accessibility statement
- [ ] Copyright notice

### SEO Basics
- [ ] Page titles are descriptive
- [ ] Meta descriptions exist (if added)
- [ ] Heading hierarchy is logical (H1, H2, H3)

---

## 🔐 Security Review

### Password Gate
- [ ] Password is strong but shareable
- [ ] Password documented for team
- [ ] Session timeout is reasonable
- [ ] Password can be easily changed

### Authentication System
- [ ] Mock auth clearly labeled (not production)
- [ ] No sensitive data in localStorage
- [ ] Ready to swap for real Supabase when needed

### Data Privacy
- [ ] No PII (Personally Identifiable Information) collected yet
- [ ] Form data is not sent to backend (mock only)
- [ ] Clear messaging about staging environment

---

## 📦 Build Preparation

### Environment
- [ ] Node.js is installed (v18+)
- [ ] npm is installed and updated
- [ ] Current directory is project root
- [ ] Terminal/Command Prompt access available

### Dependencies
- [ ] Run `npm install` to verify all packages work
- [ ] No dependency conflicts
- [ ] All required packages in package.json

### Clean Build Test
- [ ] Run `npm run build` locally to test
- [ ] Build completes without errors
- [ ] `dist` folder is created
- [ ] `dist/index.html` exists

---

## 🎯 Deployment Readiness

### GoDaddy Access
- [ ] GoDaddy account credentials available
- [ ] cPanel access confirmed
- [ ] Staging directory location known
- [ ] FTP/File Manager access working

### Team Communication
- [ ] Stakeholders notified of deployment
- [ ] Password shared with authorized users
- [ ] Staging URL communicated
- [ ] Feedback process established

### Documentation
- [ ] DEPLOYMENT.md reviewed
- [ ] QUICK-DEPLOY.md ready
- [ ] Team knows how to report issues

---

## ✅ Final Checks

### Before Running Script
- [ ] All changes committed/saved
- [ ] No ongoing development work will be lost
- [ ] Have 10-15 minutes for deployment process
- [ ] Stable internet connection

### Script Requirements
- [ ] Using correct script for OS (`.bat` for Windows, `.sh` for Mac/Linux)
- [ ] Script has execute permissions (Mac/Linux: `chmod +x`)
- [ ] Running from project root directory

---

## 🚀 Ready to Deploy!

If all items are checked, you're ready to run:

**Windows:**
```bash
deploy-godaddy.bat
```

**Mac/Linux:**
```bash
./deploy-godaddy.sh
```

---

## 📞 Emergency Contacts

**If deployment fails:**
1. Check error messages from script
2. Review DEPLOYMENT.md troubleshooting section
3. Verify Node.js/npm versions
4. Contact GoDaddy support for server issues

---

## 📝 Post-Deployment

After successful deployment, complete the testing checklist in `DEPLOYMENT.md`

---

**Prepared by:** Development Team  
**For:** SageÉlan Foundation  
**Project:** Sage With You - Living in Place Website  
**Date:** March 18, 2026
