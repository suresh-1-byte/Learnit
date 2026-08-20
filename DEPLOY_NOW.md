# Deploy Recent Updates to zentrixlearnit.in

## ✅ CODE ALREADY PUSHED TO GITHUB

Your recent updates have been committed and pushed to GitHub:
- ✅ Programs curriculum with actual content
- ✅ FAQ #3 updated to 90% attendance
- ✅ Scrollable program modal with close button
- ✅ Resources articles with correct authors
- ✅ Partners section cleanup (no job roles/salaries)

**Commit:** `4853d33`
**Branch:** `main`
**Repository:** https://github.com/suresh-1-byte/Learnit.git

---

## 🚨 DEPLOYMENT ISSUE

The deployment failed because Vercel needs Firebase environment variables configured.

**Error:**
```
Environment Variable "VITE_FIREBASE_API_KEY" references Secret "vite_firebase_api_key", 
which does not exist.
```

---

## 🔧 SOLUTION: Add Firebase Secrets to Vercel

You need to add the Firebase environment variables to Vercel dashboard:

### Option 1: Via Vercel Dashboard (RECOMMENDED)

1. Go to https://vercel.com/dashboard
2. Select your project: **learn-it-platform** (or zentrixlearnit.in)
3. Go to **Settings** → **Environment Variables**
4. Add these variables (one by one):

```
VITE_FIREBASE_API_KEY = AIzaSyA_glJsKdS9-cmnW80xFsg18rr5ZUXEgrk
VITE_FIREBASE_AUTH_DOMAIN = learnit-c7e54.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = learnit-c7e54
VITE_FIREBASE_STORAGE_BUCKET = learnit-c7e54.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 403881372691
VITE_FIREBASE_APP_ID = 1:403881372691:web:3000246beb0da8a545e3e6
```

**For each variable:**
- Variable Name: `VITE_FIREBASE_API_KEY` (exact name)
- Value: `AIzaSyA_glJsKdS9-cmnW80xFsg18rr5ZUXEgrk` (exact value)
- Environment: **Production** ✓
- Click **Save**

5. After adding all 6 variables, click **"Redeploy"** button

### Option 2: Via Vercel CLI

```bash
vercel env add VITE_FIREBASE_API_KEY production
# Paste: AIzaSyA_glJsKdS9-cmnW80xFsg18rr5ZUXEgrk

vercel env add VITE_FIREBASE_AUTH_DOMAIN production
# Paste: learnit-c7e54.firebaseapp.com

vercel env add VITE_FIREBASE_PROJECT_ID production
# Paste: learnit-c7e54

vercel env add VITE_FIREBASE_STORAGE_BUCKET production
# Paste: learnit-c7e54.firebasestorage.app

vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
# Paste: 403881372691

vercel env add VITE_FIREBASE_APP_ID production
# Paste: 1:403881372691:web:3000246beb0da8a545e3e6
```

Then deploy:
```bash
vercel --prod
```

---

## 🚀 AUTOMATIC DEPLOYMENT (After Configuration)

Once environment variables are configured in Vercel:

**Vercel auto-deploys when you push to GitHub main branch!**

So your code is already pushed, Vercel just needs the environment variables to complete the deployment.

### Steps:
1. Add Firebase environment variables to Vercel (see above)
2. Vercel will automatically detect the new commit
3. Vercel will rebuild and deploy
4. Your changes will be live on zentrixlearnit.in in ~2-3 minutes

---

## 📋 CHECKLIST AFTER DEPLOYMENT

Visit https://zentrixlearnit.in and verify:

### 1. Programs Section ✅
- [ ] Click **Programs** in navigation
- [ ] See 4 programs: AI & ML, DevOps, Frontend, Backend
- [ ] Click **"View Full Syllabus"** on any program
- [ ] Modal opens with scrollable content
- [ ] See all 3 phases with topics, tools, projects
- [ ] See final capstone project
- [ ] Close button (X) visible at top-right
- [ ] Footer buttons (Close, Enroll) always visible

### 2. FAQ Section ✅
- [ ] Scroll to FAQ section
- [ ] Click to expand FAQ #3: "What is the placement support mechanism?"
- [ ] Answer shows: "Students who achieve 90%+ attendance..."

### 3. Resources Section ✅
- [ ] Click **Resources** in navigation
- [ ] Article #2 author: "Mohan Ram (Chief Technology Officer)"
- [ ] Article #3 author: "Vijay (Head of Placement Operations)"

### 4. Partners Section ✅
- [ ] Click **Placements** in navigation
- [ ] Scroll to **Partner Companies**
- [ ] Each company card shows:
  - Company logo/initial
  - Company name
  - Industry type
  - Status badge
- [ ] NO job roles displayed
- [ ] NO salary packages under company names
- [ ] General "₹3–6 LPA Package Range" visible in statistics cards above (separate section)

### 5. Mobile Responsive ✅
- [ ] Test on mobile device or dev tools
- [ ] Program modal scrolls properly
- [ ] All sections display correctly
- [ ] Close buttons accessible

---

## ⚡ QUICK DEPLOY NOW

If you've already configured Vercel environment variables before:

```bash
cd "c:\Users\Suresh K\OneDrive\Desktop\newww lit\learn-it-platform"
vercel --prod --yes
```

---

## 🔄 ALTERNATIVE: Manual Redeploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Find your project
3. Click on the latest deployment
4. Click **"Redeploy"** button
5. Select **"Use existing Build Cache"** or **"Rebuild"**
6. Click **"Redeploy"**

---

## 📞 IF DEPLOYMENT STILL FAILS

**Check these:**
1. ✅ Vercel project connected to GitHub repository
2. ✅ Vercel has access to the repository
3. ✅ All 6 Firebase environment variables added
4. ✅ Environment variables set for **Production** environment
5. ✅ Custom domain (zentrixlearnit.in) configured in Vercel

**Build Settings:**
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 🎯 SUMMARY

**Current Status:**
- ✅ Code updated locally
- ✅ Code committed to Git
- ✅ Code pushed to GitHub
- ⏳ Waiting for Vercel deployment (needs Firebase env vars)

**Next Step:**
→ Add Firebase environment variables to Vercel dashboard
→ Vercel will auto-deploy
→ Changes live on zentrixlearnit.in

---

**Updated:** August 19, 2026
**Deployment Status:** Ready (needs Vercel env configuration)
