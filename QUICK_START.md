# Quick Start Guide - Firebase Authentication

## ✅ What's Been Completed

Firebase authentication system has been fully integrated into your Learn IT platform. Here's what's ready:

### 1. **Firebase SDK & Configuration** ✅
- Firebase installed and configured
- Environment variables structure created
- All Firebase services initialized (Auth, Firestore, Storage)

### 2. **Authentication System** ✅
- Real Firebase email/password authentication
- Role-based access control (mentor/student)
- Session persistence (survives page refresh)
- Automatic user profile loading from Firestore
- Protected routes

### 3. **Updated Components** ✅
- **MentorLogin**: Now uses real Firebase authentication
- **StudentLogin**: Now uses real Firebase authentication  
- **App.tsx**: Integrated with Firebase auth state
- **AuthContext**: Manages global authentication state

## 🚀 Next Steps - YOU NEED TO DO THIS

### Step 1: Create Your Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Create a project" (or use existing)
3. Follow the setup wizard

### Step 2: Enable Firebase Services (5 minutes)

#### Enable Authentication:
1. Go to **Build** → **Authentication**
2. Click **Get Started**
3. Select **Email/Password**
4. Toggle it **ON**
5. Click **Save**

#### Create Firestore Database:
1. Go to **Build** → **Firestore Database**
2. Click **Create database**
3. Select **Production mode**
4. Choose a location
5. Click **Enable**

#### Enable Storage:
1. Go to **Build** → **Storage**
2. Click **Get Started**
3. Accept default rules
4. Click **Done**

### Step 3: Get Your Firebase Config (2 minutes)

1. Go to **Project Settings** (gear icon ⚙️)
2. Scroll to **Your apps**
3. Click the **Web** icon `</>`
4. Register app (give it a name like "LearnIT Web")
5. **COPY the firebaseConfig object**

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 4: Create .env File (1 minute)

1. In the project root, create a file named `.env`
2. Add your Firebase config (replace the values):

```env
VITE_FIREBASE_API_KEY="AIza..."
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abc123"
```

**Important:** 
- NO quotes inside the values
- Make sure each variable starts with `VITE_`

### Step 5: Create Test Accounts (2 minutes)

Run this command to create test mentor and student accounts:

```bash
npm run setup-accounts
```

This will create:
- **Mentor Account:** `mentor@test.com` / `Test@123`
- **Student Account:** `student@test.com` / `Test@123`

### Step 6: Start the App (1 minute)

```bash
npm run dev
```

### Step 7: Test Login

1. Open http://localhost:3000
2. Click "Mentor Login"
3. Enter: `mentor@test.com` / `Test@123`
4. You should be redirected to the Mentor Dashboard!

## 🎯 Expected Behavior

### ✅ After Login:
- You'll see the Mentor Dashboard
- Your session persists even after page refresh
- Browser's back button doesn't break authentication
- Logout button works correctly

### ✅ Security:
- Students cannot access mentor portal
- Mentors cannot access student portal
- Invalid credentials show error messages
- All data is protected by Firebase rules

## 📋 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
**Fix:** Create the `.env` file with your Firebase config, then restart dev server

### "User profile not found in database"
**Fix:** Run `npm run setup-accounts` or manually create user documents in Firestore

### "Missing or insufficient permissions"
**Fix:** Update Firestore security rules (see FIREBASE_SETUP.md)

### Login button does nothing
**Fix:** Check browser console for errors, verify `.env` variables

## 📁 Important Files

```
.env                            # Your Firebase credentials (CREATE THIS!)
FIREBASE_SETUP.md               # Detailed setup instructions
MENTOR_PORTAL_PROGRESS.md       # Full progress report
src/config/firebase.ts          # Firebase initialization
src/contexts/AuthContext.tsx    # Authentication state management
src/components/Auth/MentorLogin.tsx    # Mentor login
src/components/Auth/StudentLogin.tsx   # Student login
```

## 🔥 What's Next After Authentication Works?

Once login is working, we'll build:

1. ✅ **Dashboard with real data** - Connect metrics to Firestore
2. **My Classes** - Create, edit, delete classes
3. **Attendance System** - Mark attendance, QR codes
4. **Assignments** - Create assignments, grade submissions
5. **Assessments** - Create tests, track results
6. **Study Materials** - Upload PDFs, videos
7. **Recorded Classes** - Video management
8. **Messaging** - Chat with students
9. **Reports** - Analytics and insights
10. **Profile Management** - Edit mentor profile

## ⏱️ Time Investment

- **Firebase Setup:** ~15 minutes
- **First Login Test:** ~1 minute
- **Total:** ~16 minutes to get authentication working

## 🆘 Need Help?

1. Read `FIREBASE_SETUP.md` for detailed instructions
2. Check browser console for errors
3. Verify Firebase Console settings
4. Check that `.env` file exists and is correct
5. Make sure dev server was restarted after creating `.env`

---

**Your Task:** Complete Steps 1-7 above. Once you can log in successfully, we'll continue with the Mentor Dashboard features!
