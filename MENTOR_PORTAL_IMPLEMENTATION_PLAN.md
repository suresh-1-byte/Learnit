# Mentor Portal - Complete Backend Implementation Plan

## Current Status ✅

### COMPLETED:
1. ✅ Firebase Configuration & Authentication
2. ✅ AuthContext with session persistence
3. ✅ Classes Service (CRUD operations)
4. ✅ Attendance Service (mark, get, statistics)
5. ✅ Assignments Service (create, submissions, grading)
6. ✅ Custom Hooks: `useClasses`, `useMentorStats`
7. ✅ Dashboard metrics integration with real Firebase data

## Remaining Implementation Tasks

### PHASE 1: Core Firebase Services (Priority: HIGH)
**Status:** In Progress

#### 1.1 Study Materials Service
**File:** `src/services/firebase/materials.service.ts`

**Features Needed:**
- Upload material (PDF/Video/Slides) to Firebase Storage
- Create material document in Firestore
- Get materials by class/mentor
- Update material metadata
- Delete material (remove from Storage & Firestore)
- Search materials by title/type

**Firestore Collection:** `materials`

#### 1.2 Videos/Recorded Sessions Service  
**File:** `src/services/firebase/videos.service.ts`

**Features Needed:**
- Upload video to Firebase Storage
- Create video document with metadata
- Get videos by class/mentor
- Update video details
- Delete video
- Track video views/engagement

**Firestore Collection:** `videos`

#### 1.3 Announcements Service
**File:** `src/services/firebase/announcements.service.ts`

**Features Needed:**
- Create announcement
- Get announcements by mentor/batch
- Update announcement
- Delete announcement
- Mark announcement as read (per student)
- Get unread count

**Firestore Collection:** `announcements`

#### 1.4 Assessments/Exams Service
**File:** `src/services/firebase/assessments.service.ts`

**Features Needed:**
- Create assessment with questions
- Get assessments by class/mentor
- Update assessment
- Delete assessment
- Student attempt tracking
- Scoring and results
- Get assessment statistics

**Firestore Collections:** `assessments`, `assessment_attempts`

#### 1.5 Messages/Chat Service
**File:** `src/services/firebase/messages.service.ts`

**Features Needed:**
- Send message (mentor to student)
- Get conversations by mentor
- Get messages for a conversation
- Mark messages as read
- Real-time message updates (Firestore listeners)
- Search conversations

**Firestore Collections:** `conversations`, `messages`

### PHASE 2: Custom React Hooks (Priority: HIGH)
**Status:** Pending

Create hooks for each service:

- ✅ `src/hooks/useClasses.ts` (DONE)
- ✅ `src/hooks/useMentorStats.ts` (DONE)
- `src/hooks/useAttendance.ts` - For attendance operations
- `src/hooks/useAssignments.ts` - For assignments & submissions
- `src/hooks/useMaterials.ts` - For study materials
- `src/hooks/useVideos.ts` - For recorded videos
- `src/hooks/useAnnouncements.ts` - For announcements
- `src/hooks/useAssessments.ts` - For assessments/exams
- `src/hooks/useMessages.ts` - For chat/messaging

Each hook should provide:
- Data fetching with loading/error states
- CRUD operations
- Real-time updates where needed
- Automatic refresh after mutations

### PHASE 3: UI Integration (Priority: MEDIUM)
**Status:** Pending

#### 3.1 Dashboard Tab
- ✅ Display real metrics from `useMentorStats`
- Add loading skeletons
- Add error boundaries
- Add refresh button

#### 3.2 My Classes Tab
- Display classes from `useClasses`
- Create Class modal with form validation
- Edit Class modal
- Delete confirmation dialog
- Assign students to class
- View class details

#### 3.3 Attendance Tab
- Select class dropdown (from `useClasses`)
- Date selector
- Student list with Present/Absent/Late toggle
- QR code generation for auto-attendance
- Bulk actions (Mark All Present)
- Save attendance to Firebase
- Attendance history view

#### 3.4 Assignments Tab
- List assignments from `useAssignments`
- Create Assignment modal:
  - File upload support
  - Due date picker
  - Max marks input
  - Class selection
- View submissions
- Grade submission modal:
  - Marks input
  - Feedback textarea
  - Save to Firebase
- Filter by class/status

#### 3.5 Study Materials Tab
- List materials from `useMaterials`
- Upload Material modal:
  - File type selection (PDF/Video/Slides)
  - File upload to Storage
  - Title & description
  - Class selection
- Preview materials
- Edit/Delete materials
- Search and filter

#### 3.6 Recorded Videos Tab
- List videos from `useVideos`
- Upload Video modal:
  - Video file upload
  - Metadata (title, duration, topic)
  - Class selection
- Video player integration
- Edit/Delete videos
- View analytics

#### 3.7 Assessments Tab
- List assessments from `useAssessments`
- Create Assessment modal:
  - Add questions (MCQ, Coding, Descriptive)
  - Set duration and marks
  - Schedule assessment
- View student attempts
- Manual grading for descriptive answers
- Assessment analytics

#### 3.8 Announcements Tab
- List announcements from `useAnnouncements`
- Create Announcement modal:
  - Title & body
  - Target batch/all
  - Priority level
- Edit/Delete announcements
- View delivery status

#### 3.9 Messages Tab
- Conversations list from `useMessages`
- Message thread view
- Send message
- Real-time updates
- Search conversations
- Unread count badge

### PHASE 4: Data Initialization (Priority: MEDIUM)
**Status:** Pending

Create script: `scripts/generateMentorData.ts`

**Purpose:** Generate sample data for testing

- Create sample classes for logged-in mentor
- Create sample students and assign to classes
- Create sample assignments
- Create sample materials
- Create sample announcements
- Create sample attendance records

### PHASE 5: Error Handling & Validation (Priority: MEDIUM)
**Status:** Pending

- Add form validation with Zod/Yup
- Add Firebase error handling
- Add retry logic for failed operations
- Add offline detection
- Add proper error messages
- Add success toast notifications

### PHASE 6: Testing & QA (Priority: LOW)
**Status:** Pending

For each feature:
1. Test CRUD operations
2. Verify Firebase data persistence
3. Check Firebase Console for data
4. Test error scenarios
5. Test loading states
6. Test with multiple classes
7. Test file uploads to Storage

## Implementation Order

### Week 1:
- ✅ Day 1-2: Firebase setup, Auth, Classes service
- ✅ Day 3-4: Attendance & Assignments services
- ⏳ Day 5-7: Materials, Videos, Announcements services

### Week 2:
- Day 1-3: Create all custom hooks
- Day 4-5: Dashboard integration
- Day 6-7: My Classes tab integration

### Week 3:
- Day 1-2: Attendance tab integration
- Day 3-4: Assignments tab integration
- Day 5-7: Materials & Videos tabs

### Week 4:
- Day 1-2: Assessments tab integration
- Day 3-4: Announcements & Messages tabs
- Day 5-7: Testing, bug fixes, polish

## Current Blockers

1. **Firestore Index Errors** - Need to create composite indexes for queries
   - Solution: Firebase Console will show index creation links in errors
   
2. **Storage Rules** - Need to configure Firebase Storage security rules
   - Solution: Update storage.rules to allow authenticated uploads

3. **User Profile Missing Fields** - Need to update user profiles with additional metadata
   - Solution: Update Firestore user documents with mentor-specific fields

## Firebase Console Setup Required

1. **Firestore Indexes:**
   - Create indexes for queries with orderBy + where
   - Check console errors for automatic index creation links

2. **Storage Rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /assignments/{assignmentId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /submissions/{assignmentId}/{studentId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /materials/{materialId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /videos/{videoId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

3. **Firestore Rules:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /attendance/{attendanceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /assignments/{assignmentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /submissions/{submissionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /materials/{materialId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /videos/{videoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /announcements/{announcementId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /assessments/{assessmentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Success Criteria

✅ **Dashboard:** All metrics show real data from Firebase
✅ **My Classes:** Can create, read, update, delete classes
✅ **Attendance:** Can mark attendance and save to Firebase
✅ **Assignments:** Can create assignments, view submissions, grade
✅ **Materials:** Can upload and manage study materials
✅ **Videos:** Can upload and manage recorded videos
✅ **Assessments:** Can create and manage assessments
✅ **Announcements:** Can create and send announcements
✅ **Messages:** Can chat with students in real-time
✅ **Data Persistence:** All data persists across page refreshes
✅ **Firebase Console:** Can see all data in Firestore and Storage
✅ **Error Handling:** Graceful error messages and loading states

## Next Immediate Steps

1. Create Materials Service
2. Create Videos Service
3. Create Announcements Service
4. Update useMentorStats to fetch materials/videos/announcements counts
5. Test dashboard with real data
6. Fix any Firebase index errors
7. Configure Storage rules
