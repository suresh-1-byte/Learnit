# 🎯 Action Checklist - Get Mentor Portal Working

## ⚡ IMMEDIATE ACTIONS (Do This Now - 15 minutes)

### ☐ Step 1: Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### ☐ Step 2: Login to Firebase
```bash
firebase login
```

### ☐ Step 3: Initialize Firebase (if not already done)
```bash
firebase init
```
Select:
- ☐ Firestore
- ☐ Storage

### ☐ Step 4: Deploy Security Rules (CRITICAL!)
```bash
firebase deploy --only firestore:rules,storage:rules
```

**Expected Output**:
```
✔  Deploy complete!
```

---

## ⚡ TEST YOUR SETUP (5 minutes)

### ☐ Step 5: Start Development Server
```bash
npm run dev
```

**Expected**: Server starts at http://localhost:3000

### ☐ Step 6: Login to the App
- Open http://localhost:3000
- Click "Mentor Login"
- Email: `mentor@test.com`
- Password: `Test@123`

**Expected**: Redirects to Mentor Dashboard

### ☐ Step 7: Check Dashboard Metrics
Look at the dashboard and verify:
- ☐ Total Students shows a number (may be 0)
- ☐ Total Classes shows a number (may be 0)
- ☐ No console errors about permissions
- ☐ Page loads without crashes

---

## 🔧 IF YOU SEE ERRORS

### Error: "Missing or insufficient permissions"

✅ **Fix**:
```bash
# Redeploy rules
firebase deploy --only firestore:rules,storage:rules

# Check Firebase Console
# Go to Firestore > Rules
# Verify rules are published (check timestamp)
```

### Error: "The query requires an index"

✅ **Fix**:
1. Look at the console error
2. Click the provided link (it auto-creates the index)
3. Wait 2-3 minutes
4. Refresh the page

**OR** manually create indexes:
1. Go to Firebase Console
2. Navigate to Firestore > Indexes
3. Create composite index:
   - Collection: `classes`
   - Fields: `mentorId` (Ascending), `createdAt` (Descending)
4. Repeat for: `assignments`, `materials`, `videos`, `announcements`

---

## 📊 ADD TEST DATA (Optional - 10 minutes)

### ☐ Step 8: Generate Sample Data
```bash
npm run generate-test-data
```

**Expected Output**:
```
✅ Logged in as: mentor@test.com
📚 Creating sample classes...
   ✓ Created: Full-Stack Development Batch A
   ✓ Created: Data Science & AI Batch B
   ✓ Created: Cloud Architecture & DevOps
📢 Creating sample announcements...
   ✓ Created: Welcome announcement
   ✓ Created: Assignment announcement
   ✓ Created: Assessment announcement
   ✓ Created: Event announcement
✨ Test data generation completed successfully!
```

### ☐ Step 9: Verify Data in Firebase Console
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: `learnit-c7e54`
3. Go to Firestore Database
4. You should see collections:
   - ☐ `classes` (3 documents)
   - ☐ `announcements` (4 documents)
   - ☐ `users` (2 documents)

### ☐ Step 10: Refresh Dashboard
- Refresh http://localhost:3000
- Dashboard should now show:
  - ☐ Total Classes: **3**
  - ☐ Announcements Sent: **4**

---

## ✅ SUCCESS CRITERIA

If all of these are true, your setup is complete:

- ✅ No permission errors in console
- ✅ Dashboard loads without crashing
- ✅ Metrics display numbers (not "undefined" or errors)
- ✅ Can navigate between tabs
- ✅ Firebase Console shows data in Firestore
- ✅ No red errors in browser console

---

## 🎯 NEXT STEPS (After Setup Works)

Once the above is working, you can:

### Option 1: Test Backend Services (Recommended First)

Open browser console and try:

```javascript
// Test creating a class
import { createClass } from './services/firebase/classes.service';

await createClass({
  title: 'Test Class',
  description: 'Testing backend',
  mentorId: 'your-mentor-id',
  mentorName: 'Test Mentor',
  schedule: { day: 'Monday', startTime: '10:00', endTime: '12:00' },
  startDate: '2026-01-01',
  endDate: '2026-06-30',
  batchName: 'TEST-2026',
  programTitle: 'Test Program',
  studentIds: []
});
```

**Check**: Go to Firebase Console > Firestore > `classes` collection
**Expected**: New document appears

### Option 2: Connect a UI Tab

Start with the simplest: **My Classes Tab**

**File to edit**: `src/components/Mentor/MentorDashboard.tsx`

Find the "My Classes" tab rendering section and replace mock data with:

```typescript
const { classes, loading, error } = useClasses();

// In render:
{loading ? (
  <div>Loading classes...</div>
) : error ? (
  <div>Error: {error}</div>
) : classes.length === 0 ? (
  <div>No classes yet. Create your first class!</div>
) : (
  <div className="grid gap-4">
    {classes.map(cls => (
      <div key={cls.id} className="p-4 border rounded">
        <h3>{cls.title}</h3>
        <p>{cls.description}</p>
        <p>Students: {cls.studentIds?.length || 0}</p>
      </div>
    ))}
  </div>
)}
```

---

## 📞 TROUBLESHOOTING

### Issue: Firebase CLI not found
```bash
npm install -g firebase-tools
```

### Issue: Permission denied when deploying
```bash
# Logout and login again
firebase logout
firebase login
```

### Issue: Wrong project selected
```bash
# List projects
firebase projects:list

# Use correct project
firebase use learnit-c7e54
```

### Issue: Rules deploy fails
**Check**:
1. ☐ firestore.rules file exists in project root
2. ☐ storage.rules file exists in project root
3. ☐ firebase.json is configured correctly

**Fix**: Manually copy rules to Firebase Console

---

## 📋 CHECKLIST SUMMARY

**Before Testing**:
- ☐ Firebase CLI installed
- ☐ Logged into Firebase
- ☐ Security rules deployed
- ☐ Dev server running

**Testing**:
- ☐ Can login as mentor@test.com
- ☐ Dashboard loads without errors
- ☐ Metrics display correctly
- ☐ Console has no permission errors

**Optional Enhancements**:
- ☐ Test data generated
- ☐ Data visible in Firebase Console
- ☐ Dashboard shows test data counts

**Next Development**:
- ☐ Backend services tested
- ☐ Ready to connect UI tabs
- ☐ Plan next feature to implement

---

## 🎉 COMPLETION

When all checkboxes above are checked, you have:

✅ **Working Firebase backend**
✅ **Deployed security rules**
✅ **Functioning authentication**
✅ **Real-time dashboard**
✅ **Test data for verification**

**You're ready to start connecting UI tabs to your Firebase backend!**

---

## 📚 Reference Documents

- **Detailed Status**: `MENTOR_PORTAL_STATUS.md`
- **Full Implementation Plan**: `MENTOR_PORTAL_IMPLEMENTATION_PLAN.md`
- **Rules Setup Guide**: `FIREBASE_RULES_SETUP.md`
- **Quick Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Quick Commands**: `QUICK_REFERENCE.md`

---

**Current Time**: Check this off when you complete the setup!
**Estimated Time**: 30 minutes total
**Difficulty**: Easy (just follow steps)
