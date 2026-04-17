# 🚀 Quick Deploy Reference

## One Command Deployment

### Windows
```bash
deploy-godaddy.bat
```

### Mac/Linux
```bash
chmod +x deploy-godaddy.sh
./deploy-godaddy.sh
```

---

## GoDaddy Upload (5 Steps)

1. **Login** → GoDaddy cPanel
2. **File Manager** → Navigate to staging folder
3. **Delete** → All existing files
4. **Upload** → `sageelan-staging-deploy.zip`
5. **Extract** → Right-click zip → Extract → Delete zip

---

## 🔐 Access Info

| Item | Value |
|------|-------|
| **Password** | `SageElan2026` |
| **Session** | 24 hours |
| **File** | `/src/app/components/PasswordGate.tsx` |

---

## ✅ Quick Test Checklist

- [ ] Password gate works
- [ ] All pages navigate
- [ ] Auth system functions
- [ ] Mobile responsive
- [ ] Images load

---

## 🔧 Quick Fixes

**404 on refresh?** → Check `.htaccess` is uploaded

**Blank page?** → Check browser console (F12)

**Password not appearing?** → Clear cache + localStorage

---

## 📦 Output File

`sageelan-staging-deploy.zip` (ready to upload)

---

**Full docs:** See `DEPLOYMENT.md`
