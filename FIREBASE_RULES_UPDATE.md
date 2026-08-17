# 🔥 Firebase Rules - Update Instructions

## ⚠️ IMPORTANT: You Need to Update Firebase Console

The `firestore.rules` file has been updated locally, but you need to **manually copy it to Firebase Console**.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Firebase Rules Editor
Go to: https://console.firebase.google.com/project/learnit-c7e54/firestore/rules

### Step 2: Delete All Existing Rules

Click in the editor and press `Ctrl+A` then `Delete` to clear everything.

### Step 3: Copy This Complete Code

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Helper function to check user role
    function hasRole(role) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || hasRole('super_admin');
    }
    
    // Classes collection
    match /classes/{classId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('mentor') || hasRole('super_admin') || hasRole('college_admin');
      allow update: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin') || 
                       hasRole('college_admin'));
      allow delete: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin') || 
                       hasRole('college_admin'));
    }
    
    // Students collection - TEMPORARY OPEN ACCESS FOR TESTING
    match /students/{studentId} {
      allow read, write: if true;
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('mentor') || hasRole('super_admin') || hasRole('college_admin');
      allow update: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin') || 
                       hasRole('college_admin'));
      allow delete: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin') || 
                       hasRole('college_admin'));
    }
    
    // Assignments collection
    match /assignments/{assignmentId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('mentor') || hasRole('super_admin');
      allow update: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
      allow delete: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
    }
    
    // Submissions collection
    match /submissions/{submissionId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('student') || hasRole('mentor') || hasRole('super_admin');
      allow update: if isAuthenticated() && 
                      (resource.data.studentId == request.auth.uid || 
                       hasRole('mentor') || 
                       hasRole('super_admin'));
      allow delete: if isAuthenticated() && 
                      (resource.data.studentId == request.auth.uid || 
                       hasRole('super_admin'));
    }
    
    // Materials collection
    match /materials/{materialId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('mentor') || hasRole('super_admin');
      allow update: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
      allow delete: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
    }
    
    // Videos collection
    match /videos/{videoId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('mentor') || hasRole('super_admin');
      allow update: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
      allow delete: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
    }
    
    // Announcements collection
    match /announcements/{announcementId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('mentor') || hasRole('super_admin') || hasRole('college_admin');
      allow update: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
      allow delete: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
    }
    
    // Assessments collection
    match /assessments/{assessmentId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('mentor') || hasRole('super_admin');
      allow update: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
      allow delete: if isAuthenticated() && 
                      (resource.data.mentorId == request.auth.uid || 
                       hasRole('super_admin'));
    }
    
    // Assessment attempts collection
    match /assessment_attempts/{attemptId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('student') || hasRole('mentor') || hasRole('super_admin');
      allow update: if isAuthenticated() && 
                      (resource.data.studentId == request.auth.uid || 
                       hasRole('mentor') || 
                       hasRole('super_admin'));
      allow delete: if hasRole('super_admin');
    }
    
    // Messages/Conversations collections
    match /conversations/{conversationId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if hasRole('super_admin');
    }
    
    match /messages/{messageId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if hasRole('super_admin');
    }
    
    // Default deny all other documents
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 4: Click "Publish"

Click the blue "Publish" button at the top right.

### Step 5: Test It

Run this command:
```bash
npm run generate-students
```

You should see:
```
✅ Created: Arun Kumar (CS001)
✅ Created: Priya Sharma (CS002)
... (15 students)
✅ Updated class with 15 students
🎉 Done!
```

---

## ⚠️ After Testing: Restore Secure Rules

Once testing is complete, replace the students section with:

```javascript
// Students collection - SECURE VERSION
match /students/{studentId} {
  allow read: if isAuthenticated();
  allow create: if hasRole('college_admin') || hasRole('super_admin');
  allow update: if hasRole('college_admin') || hasRole('super_admin');
  allow delete: if hasRole('college_admin') || hasRole('super_admin');
}
```

Then click "Publish" again.

---

## 🎯 What Changed

**Line 42-44**: Added students collection with temporary open access:
```javascript
match /students/{studentId} {
  allow read, write: if true;  // TEMPORARY - for testing script
}
```

This allows the `generate-students` script to work without authentication.

**IMPORTANT**: This is only for testing! Restore secure rules after confirming it works.

---

## Next Steps After Rules Are Published

1. ✅ Test script: `npm run generate-students`
2. ✅ Start dev server: `npm run dev`
3. ✅ View Student Management UI
4. ✅ Restore secure rules
