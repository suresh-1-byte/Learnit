# Vercel Deployment Guide - LearnIT Platform

## ✅ Preparation Complete

Your project is ready for Vercel deployment:
- ✅ `vercel.json` configuration created
- ✅ Committed and pushed to GitHub
- ✅ Vercel CLI installed (v54.20.0)

---

## Option 1: Deploy via Vercel CLI (Recommended - Fastest)

### Step 1: Run Vercel Deploy Command

Open your terminal in the project directory and run:

```bash
vercel --prod
```

### Step 2: Answer the Prompts

When prompted, provide these answers:

1. **Set up and deploy?** → Press **Y** (Yes)
2. **Which scope?** → Select **suresh's projects** (or your team name)
3. **Link to existing project?** → Press **N** (No - create new)
4. **What's your project name?** → Type: **learn-it-platform** (or press Enter for default)
5. **In which directory?** → Press **Enter** (use current directory: `./`)
6. **Override settings?** → Press **N** (No - use defaults)

### Step 3: Wait for Deployment

The deployment will:
- Install dependencies
- Build the project (`npm run build`)
- Deploy to Vercel
- Provide you with a live URL

---

## Option 2: Deploy via Vercel Dashboard (Easiest - No CLI)

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/new
2. Log in with your account

### Step 2: Import GitHub Repository

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find **"suresh-1-byte/Learnit"** in the list
4. Click **"Import"**

### Step 3: Configure Project

**Project Settings**:
- **Project Name**: `learn-it-platform` (or your choice)
- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 4: Add Environment Variables

⚠️ **IMPORTANT**: Add your Firebase credentials as environment variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your Auth Domain (e.g., `learnit-c7e54.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Your Project ID (e.g., `learnit-c7e54`) |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your Storage Bucket (e.g., `learnit-c7e54.appspot.com`) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Sender ID |
| `VITE_FIREBASE_APP_ID` | Your App ID |

**Where to find these values?**
- Check your local `.env` file
- Or visit Firebase Console: https://console.firebase.google.com/project/learnit-c7e54/settings/general

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Get your live URL!

---

## Option 3: Link GitHub Repository for Auto-Deploy

Once deployed via Option 1 or 2, every push to `main` branch will automatically deploy.

### Set Up Auto-Deploy:

1. Go to your project on Vercel
2. Click **"Settings"** → **"Git"**
3. Verify GitHub repository is connected
4. Enable **"Production Branch"** → `main`

Now every `git push origin main` will trigger a new deployment!

---

## Your Firebase Environment Variables

You need to add these to Vercel (get values from your `.env` file):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=learnit-c7e54.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=learnit-c7e54
VITE_FIREBASE_STORAGE_BUCKET=learnit-c7e54.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

⚠️ **Security Note**: Never commit `.env` file to GitHub (it's already in `.gitignore`)

---

## After Deployment

### 1. Get Your Live URL

Vercel will provide you with a URL like:
- Production: `https://learn-it-platform.vercel.app`
- Preview: `https://learn-it-platform-git-main-suresh.vercel.app`

### 2. Test Your Deployment

Visit your URL and test:
- ✅ Public website loads
- ✅ Login works (try mentor@test.com / Test@123)
- ✅ Firebase connection works
- ✅ All portals accessible
- ✅ Mobile responsive
- ✅ Dark/light theme toggle

### 3. Add Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → **"Settings"** → **"Domains"**
2. Add your custom domain (e.g., `learnit.zentrix.com`)
3. Update DNS records as instructed by Vercel
4. Wait for SSL certificate (automatic)

### 4. Update Firebase Authorized Domains

⚠️ **IMPORTANT**: Add your Vercel domain to Firebase

1. Go to Firebase Console: https://console.firebase.google.com/project/learnit-c7e54/authentication/settings
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add your Vercel URL: `learn-it-platform.vercel.app`
5. If using custom domain, add that too

---

## Deployment Commands Reference

### Deploy to Production
```bash
vercel --prod
```

### Deploy Preview (Test Before Production)
```bash
vercel
```

### View Deployment Logs
```bash
vercel logs
```

### List All Deployments
```bash
vercel list
```

### Remove Deployment
```bash
vercel remove [deployment-url]
```

---

## Troubleshooting

### Build Fails

**Issue**: "Build failed" error  
**Solution**: 
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`

### Firebase Not Working

**Issue**: "Firebase configuration error"  
**Solution**:
1. Verify environment variables are set in Vercel
2. Check variable names match exactly (including `VITE_` prefix)
3. Redeploy after adding variables

### 404 Errors on Routes

**Issue**: Direct URL access shows 404  
**Solution**:
- ✅ Already fixed! The `vercel.json` rewrites all routes to `/index.html`

### Slow Build Times

**Issue**: Build takes too long  
**Solution**:
1. Check if `node_modules` is being cached
2. Use `npm ci` instead of `npm install` (already configured)

---

## Vercel Dashboard URLs

- **Your Projects**: https://vercel.com/dashboard
- **Project Settings**: https://vercel.com/suresh-1-byte/learn-it-platform/settings
- **Deployment Logs**: https://vercel.com/suresh-1-byte/learn-it-platform/deployments
- **Environment Variables**: https://vercel.com/suresh-1-byte/learn-it-platform/settings/environment-variables

---

## Performance Optimizations (Already Configured)

✅ **Static Asset Caching**: 1 year cache for `/assets/*`  
✅ **Security Headers**: XSS, Clickjacking, MIME-type protection  
✅ **SPA Routing**: All routes redirect to index.html  
✅ **Automatic Compression**: Gzip/Brotli enabled by default  
✅ **Global CDN**: Vercel Edge Network  
✅ **Instant Rollback**: One-click revert to previous deployment

---

## Quick Start Commands

### First Deployment
```bash
cd "c:\Users\Suresh K\OneDrive\Desktop\newww lit\learn-it-platform"
vercel --prod
```

### Update and Redeploy
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys!
```

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Community**: https://vercel.com/support

---

## Next Steps

1. ✅ Choose Option 1 (CLI) or Option 2 (Dashboard) above
2. ✅ Add Firebase environment variables to Vercel
3. ✅ Deploy and get your live URL
4. ✅ Add Vercel domain to Firebase authorized domains
5. ✅ Test the live application
6. ✅ Share the URL with your team!

---

**Ready to deploy? Choose your preferred method above and follow the steps!** 🚀
