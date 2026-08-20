# 🧪 TEST ASSIGNMENTS FEATURE - QUICK START

## 🚀 START TESTING IN 3 MINUTES

### Step 1: Start Development Server
```bash
npm run dev
```

Wait for "Local: http://localhost:5173" message.

---

## 👨‍🏫 MENTOR WORKFLOW TEST

### Test Account
- **Email:** mentor@test.com
- **Password:** Test@123

### Test Steps

#### 1. Create Assignment (2 minutes)
1. Login as mentor@test.com
2. Click **Assignments** tab in left sidebar
3. Click **"+ Create Assignment"** button (top right)
4. Fill form:
   - **Select Class:** Choose any class from dropdown
   - **Assignment Title:** "React Hooks Assignment"
   - **Description:** "Build a custom hook"
   - **Instructions:** "Create useLocalStorage hook"
   - **Due Date:** Pick tomorrow's date
   - **Max Marks:** 100
   - **Attachment:** Upload a PDF/DOC file (optional)
5. Click **"Create Assignment"**
6. ✅ Should see success alert and new assignment in list

#### 2. View Assignment Details (30 seconds)
1. Scroll to assignment you just created
2. Check:
   - ✅ Title displays correctly
   - ✅ Description shows
   - ✅ Due date shows
   - ✅ Max marks shows (100)
   - ✅ Download button appears if you uploaded file
3. Click **"Download Attachment"** (if uploaded)
   - ✅ File should download

#### 3. View Submissions (30 seconds)
1. Click **"View Submissions"** button on assignment
2. Modal opens showing:
   - ✅ "No submissions yet" message (before student submits)
   - ✅ Or list of submissions (after student submits)
3. Close modal

#### 4. Delete Assignment (Optional - 30 seconds)
1. Click **trash icon** on assignment
2. Confirm deletion in dialog
3. ✅ Assignment disappears from list

---

## 🎓 STUDENT WORKFLOW TEST

### Test Account
- **Email:** student@test.com
- **Password:** Test@123

### Test Steps

#### 1. View Assignments (1 minute)
1. Logout mentor (click profile icon → Logout)
2. Login as student@test.com
3. Click **Assignments** tab in left sidebar
4. Check display:
   - ✅ See list of assignments for your class
   - ✅ Status badge shows (Pending/Overdue based on due date)
   - ✅ Assignment details visible (title, description, due date, marks)
   - ✅ Download button appears for assignment files

#### 2. Download Assignment File (30 seconds)
1. Find assignment with attachment
2. Click **"Download Assignment"** button
3. ✅ File should download to your computer

#### 3. Submit Assignment (2 minutes)
1. Click **"Submit Assignment"** button on any assignment
2. Modal opens
3. Click **"Choose File"** button
4. Select a file (PDF, DOC, DOCX, ZIP, PNG, JPG, or JPEG)
5. Click **"Submit Assignment"**
6. ✅ Should see success alert
7. ✅ Modal closes
8. ✅ "Your Submission" section appears below assignment
9. Check submission details:
   - ✅ Submission date/time shows
   - ✅ Download button for your submission appears
   - ✅ Status changes to "Submitted" (blue badge)

#### 4. View Submission Status (30 seconds)
1. Check status badge on assignment:
   - **Pending** (yellow) = Not submitted, before due date
   - **Overdue** (red) = Not submitted, past due date
   - **Submitted** (blue) = Submitted on time
   - **Late** (orange) = Submitted after due date
   - **Graded** (green) = Mentor has graded
2. ✅ Status should be "Submitted" or "Late"

---

## 👨‍🏫 MENTOR GRADING TEST

### Switch Back to Mentor

#### 1. Grade Submission (2 minutes)
1. Logout student
2. Login as mentor@test.com
3. Go to **Assignments** tab
4. Click **"View Submissions"** on assignment student submitted to
5. See student submission in list with **"Grade"** button
6. Click **"Grade"** button
7. Grading modal opens
8. Fill grading form:
   - **Marks:** Enter score (e.g., 85)
   - **Feedback:** "Great work on the custom hook!"
9. Click **"Submit Grade"**
10. ✅ Success alert appears
11. ✅ Modal closes
12. ✅ Submission status changes to "Graded"
13. ✅ Marks display next to student name

---

## 🎓 STUDENT VIEW GRADES TEST

### Switch Back to Student

#### 1. View Grade (1 minute)
1. Logout mentor
2. Login as student@test.com
3. Go to **Assignments** tab
4. Find the graded assignment
5. Check:
   - ✅ Status badge changed to "Graded" (green)
   - ✅ Marks display: "85/100" (or whatever mentor entered)
   - ✅ Feedback shows in yellow box below submission
6. ✅ Test complete!

---

## 📋 COMPLETE FLOW CHECKLIST

### Mentor Side ✅
- [ ] Login successful
- [ ] Assignments tab loads
- [ ] Create assignment form opens
- [ ] Assignment created successfully
- [ ] Assignment appears in list
- [ ] Download attachment works
- [ ] View submissions modal opens
- [ ] Grade submission form works
- [ ] Grade saved successfully
- [ ] Marks and feedback display

### Student Side ✅
- [ ] Login successful
- [ ] Assignments tab loads
- [ ] Assignments list displays
- [ ] Assignment details visible
- [ ] Download assignment file works
- [ ] Submit modal opens
- [ ] File upload works
- [ ] Submission saved successfully
- [ ] Submission details display
- [ ] Grade and feedback visible after grading

---

## 🎨 UI/UX TO VERIFY

### Visual Elements ✅
- [ ] Dark/light theme works (toggle in top-right)
- [ ] Status badges color-coded correctly
- [ ] Loading spinners show during operations
- [ ] Success alerts appear after actions
- [ ] Modals center on screen
- [ ] Buttons have hover effects
- [ ] Forms are clear and labeled
- [ ] Empty states show when no data

### Responsiveness ✅
- [ ] Works on desktop (1920px)
- [ ] Works on laptop (1366px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)

---

## 🐛 TROUBLESHOOTING

### "No assignments showing"
**Cause:** Student's classId doesn't match any assignments' classId  
**Fix:** Ensure student profile has correct `classId` field

### "Firebase error on upload"
**Cause:** Firebase Storage not configured or rules incorrect  
**Fix:** Check `.env` for Firebase config, verify Storage rules allow uploads

### "Can't create assignment"
**Cause:** Missing required fields or no class selected  
**Fix:** Ensure class is selected and title + due date are filled

### "Submission not showing"
**Cause:** Assignment filter by classId not matching  
**Fix:** Verify student and assignment have same classId

---

## ✅ SUCCESS INDICATORS

You'll know everything works when:
1. ✅ Mentor creates assignment → Appears in list
2. ✅ Student sees assignment → Can download file
3. ✅ Student submits → Submission appears immediately
4. ✅ Mentor grades → Grade saves and displays
5. ✅ Student sees grade → Marks and feedback visible
6. ✅ No console errors
7. ✅ All modals open/close smoothly
8. ✅ Theme switching works
9. ✅ File uploads/downloads work
10. ✅ Status badges update automatically

---

## 🎯 EXPECTED BEHAVIOR

### Assignment Status Flow
```
CREATE → Pending (yellow)
         ↓
      SUBMIT → Submitted (blue) or Late (orange)
         ↓
       GRADE → Graded (green)
```

### File Types Supported
- **Assignments:** .pdf, .doc, .docx, .zip
- **Submissions:** .pdf, .doc, .docx, .zip, .png, .jpg, .jpeg

### Permissions
- **Mentor:** Create, view all, grade, delete
- **Student:** View own class only, submit, view own submissions

---

## 🏁 TESTING COMPLETE!

Once all checkboxes are checked, the Assignments feature is **fully verified** and ready for production use! 🚀

**Average Test Time:** 10-15 minutes for complete flow  
**Difficulty:** Easy  
**Prerequisites:** Firebase configured, test users created

Happy testing! 🎉
