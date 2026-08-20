# 🧪 How To Test Signup Feature

## Quick Test Guide

### URL: https://www.zentrixlearnit.in

---

## Test 1: Student Signup

1. Open site: https://www.zentrixlearnit.in
2. Click **"Access ERP"** button (top right or hero section)
3. Click **"Student"** role card
4. At bottom, click **"Don't have an account? Sign up here"**
5. Fill the form:

```
Personal Information:
- Full Name: Rahul Kumar
- Phone: +91 98765 43210

Account Credentials:
- Email: rahul.kumar@example.com
- Password: Student@123
- Confirm Password: Student@123

Academic Information:
- Roll Number: 2026CS001
- Batch/Year: 2026-A
- College Name: Anna University
- Department: Computer Science and Engineering
```

6. Click **"Create Student Account"**
7. ✅ Success screen appears
8. ✅ Auto-redirects to student dashboard
9. ✅ You're logged in!

---

## Test 2: Mentor Signup

1. Open site: https://www.zentrixlearnit.in (in new incognito tab)
2. Click **"Access ERP"** button
3. Click **"Mentor"** role card
4. At bottom, click **"Don't have an account? Sign up here"**
5. Fill the form:

```
Personal Information:
- Full Name: Priya Sharma
- Phone: +91 98765 12345

Account Credentials:
- Email: priya.sharma@example.com
- Password: Mentor@123
- Confirm Password: Mentor@123

Professional Information:
- Designation/Title: Senior Software Development Mentor
- Qualifications: M.Tech Computer Science, 10 years industry experience
- Skills: React, Node.js, Python, Machine Learning, System Design
```

6. Click **"Create Mentor Account"**
7. ✅ Success screen appears
8. ✅ Auto-redirects to mentor dashboard
9. ✅ You're logged in!

---

## Test 3: Login After Signup

### Test Student Login:
1. Logout (if logged in)
2. Click "Access ERP" → Choose "Student"
3. Login with:
   - Email: `rahul.kumar@example.com`
   - Password: `Student@123`
4. ✅ Should login successfully

### Test Mentor Login:
1. Logout (if logged in)
2. Click "Access ERP" → Choose "Mentor"
3. Login with:
   - Email: `priya.sharma@example.com`
   - Password: `Mentor@123`
4. ✅ Should login successfully

---

## Test 4: Error Handling

### Test Duplicate Email:
1. Try signing up again with same email
2. ✅ Should show: "This email is already registered. Please login instead."

### Test Password Mismatch:
1. Start signup form
2. Password: `Test@123`
3. Confirm: `Test@456` (different)
4. ✅ Should show: "Passwords do not match"

### Test Weak Password:
1. Try password: `123` (too short)
2. ✅ Should show: "Password must be at least 8 characters long"

### Test Empty Required Fields:
1. Leave Name field empty
2. Try to submit
3. ✅ Browser shows "Please fill out this field"

---

## Test 5: Login/Signup Switching

### From Login to Signup:
1. On login page
2. Click "Don't have account? Sign up here"
3. ✅ Should switch to signup form

### From Signup to Login:
1. On signup page
2. Click "Already have account? Login here"
3. ✅ Should switch to login form

---

## What To Check After Signup

### Student Dashboard Should Show:
- ✅ Welcome message with your name
- ✅ Dashboard tab active
- ✅ Materials tab
- ✅ Announcements tab
- ✅ Assignments tab
- ✅ Attendance tab
- ✅ Theme toggle works
- ✅ Logout button works

### Mentor Dashboard Should Show:
- ✅ Welcome message with your name
- ✅ Dashboard tab active
- ✅ Materials tab (can upload)
- ✅ Announcements tab (can create)
- ✅ Assignments tab (can create)
- ✅ Attendance tab (can mark)
- ✅ Students tab
- ✅ Theme toggle works
- ✅ Logout button works

---

## Firebase Verification

### Check Firebase Console:
1. Go to: https://console.firebase.google.com
2. Select your project
3. Click "Authentication" → "Users"
4. ✅ Should see new users listed:
   - `rahul.kumar@example.com`
   - `priya.sharma@example.com`

### Check Firestore:
1. In Firebase Console
2. Click "Firestore Database"
3. Open `users` collection
4. ✅ Should see 2 documents with user profiles
5. Click each document to verify:
   - Student profile has: name, email, role, rollNumber, collegeName, etc.
   - Mentor profile has: name, email, role, title, qualifications, skills, etc.

---

## Common Issues & Solutions

### Issue: "Network error"
**Solution**: Check internet connection, refresh page

### Issue: "Firebase not initialized"
**Solution**: Check .env file has correct Firebase config

### Issue: Form doesn't submit
**Solution**: Check browser console for errors, ensure all required fields filled

### Issue: Redirect doesn't work
**Solution**: Wait 2 seconds for success animation, check browser console

### Issue: Can't login after signup
**Solution**: Use exact email and password from signup (case-sensitive)

---

## 🎉 Success Criteria

✅ **Student can signup and access student dashboard**  
✅ **Mentor can signup and access mentor dashboard**  
✅ **Both can login after signup**  
✅ **Error messages show for invalid inputs**  
✅ **Firebase Auth and Firestore updated correctly**  
✅ **Navigation between login/signup works**  

---

## Report Results

After testing, let me know:

**✅ Working**: "signup works perfectly"  
**❌ Issue**: "error when [describe what you did]"

Then we can proceed to test the full platform features! 🚀
