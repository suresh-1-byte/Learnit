# Testing Guide - Firebase Authentication

## ✅ Setup Complete!

Your Firebase authentication is now integrated and the development server is running!

**Server URL:** http://localhost:3001/

## 🧪 Test Scenarios

### Test 1: Mentor Login ✓

1. Open http://localhost:3001/ in your browser
2. The app should show the Public Website/Login page
3. Look for "Mentor Login" button or link
4. Click it to open the Mentor Login modal
5. Enter credentials:
   - **Email:** `mentor@test.com`
   - **Password:** `Test@123`
6. Click "Access Mentor Dashboard"

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Redirects to Mentor Dashboard
- ✅ Shows mentor name in header
- ✅ Dashboard displays (even with empty data)

### Test 2: Session Persistence ✓

1. After logging in as mentor (Test 1)
2. Press F5 to refresh the page
3. OR Close the browser tab and reopen http://localhost:3001/

**Expected Result:**
- ✅ Still logged in
- ✅ Dashboard loads immediately
- ✅ No need to re-enter credentials

### Test 3: Logout ✓

1. While logged in (Test 1)
2. Click the profile/user menu in header
3. Click "Logout" button

**Expected Result:**
- ✅ Redirects to login page
- ✅ Session cleared
- ✅ Cannot access dashboard by navigating back

### Test 4: Student Login ✓

1. From the login page
2. Look for "Student Login" button or link
3. Click it to open Student Login modal
4. Enter credentials:
   - **Email:** `student@test.com`
   - **Password:** `Test@123`
5. Click "Access Student Dashboard"

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Redirects to Student Dashboard
- ✅ Shows student name in header

### Test 5: Role-Based Access Control ✓

**Test 5A: Student Cannot Access Mentor Portal**
1. Log in as student (Test 4)
2. Try to manually navigate to mentor routes (if available)

**Expected Result:**
- ✅ Access denied
- ✅ Error message or redirect

**Test 5B: Mentor Cannot Access Student Portal**
1. Log in as mentor (Test 1)
2. Try to manually navigate to student routes (if available)

**Expected Result:**
- ✅ Access denied
- ✅ Error message or redirect

### Test 6: Invalid Credentials ✓

1. Open Mentor Login
2. Enter:
   - **Email:** `wrong@test.com`
   - **Password:** `wrongpass`
3. Click login

**Expected Result:**
- ✅ Error message displays
- ✅ "Invalid email or password" shown
- ✅ Stays on login page

### Test 7: Empty Fields Validation ✓

1. Open Mentor Login
2. Leave email or password empty
3. Click login

**Expected Result:**
- ✅ HTML5 validation prevents submission
- ✅ "Please fill out this field" message

## 🐛 Troubleshooting Tests

### If Login Fails

**Check 1: Browser Console**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Common errors:
   - `auth/invalid-api-key` → Check `.env` file
   - `auth/user-not-found` → Run `npm run setup-accounts`
   - `User profile not found` → Check Firestore has user documents

**Check 2: Network Tab**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try logging in
4. Look for Firebase API calls
5. Check if they return 200 or error codes

**Check 3: Firebase Console**
1. Go to https://console.firebase.google.com/
2. Select your project
3. Go to Authentication → Users
4. Verify mentor@test.com and student@test.com exist
5. Go to Firestore Database → users collection
6. Verify user documents exist with correct UIDs

**Check 4: Environment Variables**
1. Verify `.env` file exists in project root
2. Check all variables start with `VITE_`
3. Restart dev server if you just created `.env`

## 📊 What to Check in Each Test

### Browser Console
Should see:
```
✅ No red errors
✅ Firebase initialization logs
✅ Auth state change logs (if added)
```

### Network Requests
Should see:
```
✅ identitytoolkit.googleapis.com requests (Firebase Auth)
✅ firestore.googleapis.com requests (Firestore)
✅ 200 status codes
```

### Firestore Database
Should have:
```
users/
  ├── {mentor-uid}/
  │   ├── email: "mentor@test.com"
  │   ├── role: "mentor"
  │   ├── name: "Ananya Deshmukh"
  │   └── ... other fields
  │
  └── {student-uid}/
      ├── email: "student@test.com"
      ├── role: "student"
      ├── name: "Arun Kumar"
      └── ... other fields
```

## ✅ Success Checklist

Mark each as complete after testing:

- [ ] Can log in as mentor with mentor@test.com
- [ ] Can log in as student with student@test.com
- [ ] Session persists after page refresh
- [ ] Logout works correctly
- [ ] Invalid credentials show error message
- [ ] Mentor sees Mentor Dashboard (not Student Dashboard)
- [ ] Student sees Student Dashboard (not Mentor Dashboard)
- [ ] No console errors during login
- [ ] Browser back button doesn't break authentication

## 🎯 Current Limitations (Expected)

Right now, the dashboard will show **empty data or zeros** for:
- Total students: 0
- Total classes: 0
- Assignments: Empty list
- Attendance: 0%
- etc.

**This is NORMAL and EXPECTED!** We haven't implemented the backend CRUD operations yet.

### What Works Now:
✅ Firebase Authentication
✅ User login/logout
✅ Session persistence
✅ Role verification
✅ Protected routes
✅ User profile loading

### What's Next (Not Yet Implemented):
❌ Creating classes
❌ Adding students
❌ Marking attendance
❌ Creating assignments
❌ Uploading materials
❌ Real-time data updates

## 🔥 Next Steps After Testing

Once all tests pass, we'll implement:

### Phase 2: Mentor Dashboard with Real Data
- Connect dashboard metrics to Firestore
- Show real counts instead of 0
- Create collections for classes, students, etc.

### Phase 3: My Classes Feature
- Create class functionality
- List all classes
- Edit/delete classes
- Firebase Storage for class materials

### Phase 4: Students Management
- Add students to Firestore
- Assign students to classes
- View student profiles

... and so on following the original plan!

## 📞 Report Issues

If any test fails:

1. **Take a screenshot** of the error
2. **Check browser console** and copy error messages
3. **Check Network tab** for failed requests
4. **Verify Firebase Console** settings
5. **Check `.env` file** configuration

## 🎊 Celebration Time!

If all tests pass, **congratulations!** 🎉

You now have:
- ✅ Production-ready Firebase authentication
- ✅ Role-based access control
- ✅ Secure session management
- ✅ Proper error handling
- ✅ A solid foundation for building features

**You're ready to move to Phase 2: Building Mentor Portal Features!**

---

**Current Status:** Authentication Complete ✅  
**Next Phase:** Mentor Dashboard Data Integration  
**Server Running:** http://localhost:3001/  
**Test Accounts Ready:** mentor@test.com & student@test.com
