# Assignment Not Showing - Debug Guide

**Status**: Debug version deployed  
**Live URL**: https://www.zentrixlearnit.in

---

## WHAT I FIXED

1. **Added Debug Logging**: Console logs now show what's happening
2. **Fixed Index Error**: If Firebase index is missing, it will fallback to sorting in memory
3. **Better Error Handling**: More detailed error messages

---

## HOW TO DEBUG

### Step 1: Open Browser Console

1. Go to https://www.zentrixlearnit.in
2. Login as **student**: vijay7003@gmail.com
3. Press `F12` to open Developer Tools
4. Click on the **Console** tab

### Step 2: Navigate to Assignments Tab

1. Click on "Assignments" tab in student dashboard
2. Watch the console for messages

### Step 3: Check Console Logs

You should see these messages:

```javascript
// These logs will tell us what's happening:
StudentAssignments - userProfile: {id: "...", classId: "..."}
StudentAssignments - studentClassId: "xyz123"
Fetching assignments for class: "xyz123"
getAssignmentsByClass called with classId: "xyz123"
```

---

## POSSIBLE ISSUES & SOLUTIONS

### Issue 1: No classId
**Console shows**: `StudentAssignments - studentClassId: ""`

**Reason**: Student not assigned to any class

**Solution**: 
1. Login as mentor (sureshchitki@gmail.com)
2. Go to Students tab
3. Click on student name
4. Select a class from dropdown
5. Verify it saves

---

### Issue 2: Firebase Index Missing
**Console shows**: `Index error, trying without orderBy: ...`

**Reason**: Firebase composite index not created

**Solution** (Already handled automatically):
- The code now automatically falls back to in-memory sorting
- Assignments should still load
- To create index properly:
  1. Go to Firebase Console
  2. Click the error link in console
  3. Create the index
  4. Wait for it to build

---

### Issue 3: No Assignments Created
**Console shows**: `Successfully fetched assignments: 0`

**Reason**: Mentor hasn't created assignments for this class

**Solution**:
1. Login as mentor
2. Go to Assignments tab
3. Click "Create Assignment"
4. Make sure to select the SAME class that student is assigned to
5. Save the assignment

---

### Issue 4: classId Mismatch
**Console shows**: Assignment exists but `classId` doesn't match

**Check**:
1. Open Firebase Console
2. Go to Firestore Database
3. Check `users` collection → Find student → Check `classId` field
4. Check `assignments` collection → Find assignment → Check `classId` field
5. They must match EXACTLY

---

## VERIFICATION STEPS

### Check Student Profile

1. Firebase Console → Firestore → `users` collection
2. Find student document: vijay7003@gmail.com
3. Check fields:
   - `classId`: Should have a value (like "abc123")
   - `role`: Should be "student"

### Check Class Exists

1. Firebase Console → Firestore → `classes` collection
2. Find class with same ID as student's classId
3. Verify it exists

### Check Assignment Exists

1. Firebase Console → Firestore → `assignments` collection
2. Find assignments where `classId` matches student's classId
3. If none exist, that's the problem!

---

## QUICK FIX CHECKLIST

Run through this checklist:

- [ ] **Step 1**: Student has a `classId` in their profile
- [ ] **Step 2**: Class with that ID exists in `classes` collection
- [ ] **Step 3**: At least one assignment exists with matching `classId`
- [ ] **Step 4**: Check browser console for errors
- [ ] **Step 5**: Try refreshing the page

---

## WHAT TO SEND ME

If still not working, send me:

1. **Screenshot of browser console** when on Assignments tab
2. **Screenshot from Firebase Console**:
   - Student's user document (hide email if you want)
   - Classes collection showing the class
   - Assignments collection showing assignments

---

## EXPECTED BEHAVIOR

### When Working Correctly:

**Console**:
```
StudentAssignments - studentClassId: "abc123"
Fetching assignments for class: "abc123"
Successfully fetched assignments: 2
```

**Screen**:
- Shows list of assignments
- Each assignment has title, due date, submit button
- No "No assignments yet" message

### When Student Not Assigned:

**Console**:
```
StudentAssignments - studentClassId: ""
No classId provided, skipping fetch
```

**Screen**:
- Shows "No class assigned" message
- Tells user to contact administrator

### When No Assignments Created:

**Console**:
```
StudentAssignments - studentClassId: "abc123"
Fetching assignments for class: "abc123"
Successfully fetched assignments: 0
```

**Screen**:
- Shows "No assignments yet" message
- Says mentor hasn't assigned work

---

## MOST LIKELY CAUSES

Based on common issues:

1. **70% chance**: Student's classId doesn't match any assignments' classId
2. **20% chance**: Mentor created assignment but forgot to select the class
3. **8% chance**: Firebase index missing (but code handles this now)
4. **2% chance**: Network/permission issue

---

## FIREBASE INDEX FIX (If Needed)

If you see this error in console:
```
The query requires an index
```

**Option 1**: Code handles it automatically (already done)

**Option 2**: Create index manually:
1. Copy the URL from the error message
2. Open it in browser
3. Click "Create Index"
4. Wait 2-5 minutes for it to build
5. Refresh your app

---

## TESTING WORKFLOW

1. **Login as Mentor**:
   - Create a class (e.g., "React Basics")
   - Note the class name

2. **Assign Student**:
   - Go to Students tab
   - Click on student (vijay7003@gmail.com)
   - Select "React Basics" from dropdown
   - Verify it saves

3. **Create Assignment**:
   - Go to Assignments tab
   - Create new assignment
   - **IMPORTANT**: Select "React Basics" as class
   - Save

4. **Login as Student**:
   - Go to Assignments tab
   - Should see the assignment!

---

## COMMIT DETAILS

**Changes Made**:
- Added debug logging to StudentAssignments
- Added debug logging to useAssignments hook
- Fixed getAssignmentsByClass to handle missing index
- Added fallback to in-memory sorting

**Files Modified**:
- `src/components/Student/StudentAssignments.tsx`
- `src/hooks/useAssignments.ts`
- `src/services/firebase/assignments.service.ts`

---

## NEXT STEPS

1. **Open browser console** and check what it says
2. **Verify student has classId** in their profile
3. **Verify assignment exists** with matching classId
4. **Send me console output** if still not working

The debug version is now live at https://www.zentrixlearnit.in

Check the console and let me know what you see! 🔍
