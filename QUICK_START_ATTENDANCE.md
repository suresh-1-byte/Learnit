# ⚡ Quick Start - Attendance with Real Data

**2-Minute Setup Guide**

---

## 🎯 Before You Start

You need:
1. ✅ At least **1 class** created
2. ✅ At least **1 student** assigned to that class

---

## 📝 STEP 1: Create a Class (if you don't have one)

1. Login as mentor
2. Click **"My Classes"** tab
3. Click **"Create New Class"**
4. Fill in:
   - Title: "React Basics"
   - Batch: "2026-A"
   - Description: "Learn React"
5. Click **"Create Class"**
6. ✅ Done!

---

## 👨‍🎓 STEP 2: Add/Assign a Student

### Option A: Use Existing Student (vijay7003@gmail.com)

1. Go to **"Students"** tab
2. Find student "Vijay"
3. Click **"Edit"** or profile icon
4. Find the `classId` field
5. Set it to your class ID (copy from Classes tab)
6. Click **"Save"**
7. ✅ Student assigned!

### Option B: Create New Student

1. Go to **"Students"** tab
2. Click **"Add Student"**
3. Fill in:
   - Name: "Test Student"
   - Email: "test@example.com"
   - Roll Number: "CS001"
   - **classId**: [Your class ID] ← Important!
4. Click **"Save"**
5. ✅ Student created and assigned!

---

## ✅ STEP 3: Mark Attendance

1. Go to **"Attendance"** tab
2. Select date (default: today)
3. Click **"Mark Manually"** button
4. **You should see REAL student names!** 🎉
5. Mark each student:
   - Click **"Present"** (green)
   - Click **"Late"** (orange)  
   - Click **"Absent"** (red)
6. Click **"Save Attendance"**
7. ✅ Attendance saved!

---

## 🔍 VERIFY IT WORKED

### In the App:
- Statistics show numbers (not 0%)
- Change date and come back
- Attendance is still there!

### In Firebase Console:
1. Go to Firebase Console
2. Firestore → Data
3. Look for `attendance` collection
4. See your attendance records!

---

## ⚠️ TROUBLESHOOTING

### "No students found in class"

**Fix:**
1. Check Students tab - do students exist?
2. Check student's `classId` field
3. Make sure it matches your class ID
4. Re-save the student

### Still showing "Student 1, Student 2, Student 3"

**Fix:**
1. Hard refresh: **Ctrl+Shift+R**
2. Clear browser cache
3. Try again

### Can't click "Mark Manually"

**Fix:**
1. Make sure you have a class created
2. The class will auto-select
3. Check class name shows at top

---

## 📊 EXPECTED RESULT

When you click "Mark Manually", you should see:

```
Mark Attendance

Date: 2026-08-20

┌──────────────────────────────┐
│ Vijay Kumar              ✓   │
│ CS001                        │
│ [Present] Late  Absent       │
└──────────────────────────────┘

[Save Attendance] [Cancel]
```

**Not this:**
```
❌ Student 1
❌ Student 2  
❌ Student 3
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Class created
- [ ] Student exists
- [ ] Student's classId set to your class
- [ ] Attendance tab opens (no crash)
- [ ] "Mark Manually" clickable
- [ ] See REAL student names
- [ ] Can mark Present/Absent/Late
- [ ] Save works
- [ ] Data in Firebase

**All checked?** → **You're all set!** 🎉

---

## 🚀 NEXT STEPS

1. Mark attendance daily
2. View history (change dates)
3. Check statistics
4. Export reports (coming soon!)

---

**Total Time**: 2-5 minutes  
**Difficulty**: Easy  
**Status**: ✅ Working with real data!
