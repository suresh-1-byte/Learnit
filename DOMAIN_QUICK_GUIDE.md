# 🚀 GoDaddy Domain → Vercel - Quick Setup

## ⚡ 3-Step Process (15 minutes)

---

## Step 1: Add Domain in Vercel

**Go to:**  
👉 https://vercel.com/sureshs-projects-1c6ee3cb/learn-it-platform/settings/domains

**Actions:**
1. Type your domain (e.g., `learnit.com` or `www.learnit.com`)
2. Click "Add"
3. **Copy the DNS records Vercel shows you**

---

## Step 2: Update GoDaddy DNS

**Go to:**  
👉 https://dcc.godaddy.com/control/portfolio/

**Actions:**
1. Find your domain → Click "DNS"
2. Click "Add" button

### If using root domain (learnit.com):
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600
```

### If using www (www.learnit.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

3. Click "Save"

---

## Step 3: Add to Firebase

**Go to:**  
👉 https://console.firebase.google.com/project/learnit-c7e54/authentication/settings

**Actions:**
1. Scroll to "Authorized domains"
2. Click "Add domain"
3. Enter your domain (e.g., `learnit.com`)
4. Click "Add"

---

## ⏱️ Wait 5-30 Minutes

DNS propagation takes time. Check status:
- Vercel: https://vercel.com/sureshs-projects-1c6ee3cb/learn-it-platform/settings/domains
- DNS Checker: https://www.whatsmydns.net/

---

## ✅ Done!

Your site will be live at:
- `https://yourdomain.com` ✨
- Auto HTTPS + SSL ✅
- Global CDN ✅

---

**Full Guide:** See `GODADDY_DOMAIN_SETUP.md` for detailed instructions with troubleshooting.

---

## 🔗 All Links You Need

1. **Add domain in Vercel**: https://vercel.com/sureshs-projects-1c6ee3cb/learn-it-platform/settings/domains
2. **Update GoDaddy DNS**: https://dcc.godaddy.com/control/portfolio/
3. **Add to Firebase**: https://console.firebase.google.com/project/learnit-c7e54/authentication/settings
4. **Check DNS propagation**: https://www.whatsmydns.net/

---

**Start now! Click link #1 above!** 🚀
