# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Firebase Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Click on **Email/Password** → Enable it → Save

## Step 3: Create Cloud Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Start in **Production mode** (we'll add security rules later)
4. Choose a Firestore location close to your users
5. Click **Enable**

## Step 4: Enable Firebase Storage

1. In Firebase Console, go to **Build** → **Storage**
2. Click **Get Started**
3. Accept the default security rules for now
4. Choose a storage location
5. Click **Done**

## Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "LearnIT Web App")
5. Copy the Firebase configuration object

## Step 6: Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY="your_api_key_here"
VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

## Step 7: Firestore Database Structure

Your Firestore database will use the following collections:

### Collections Overview

```
firestore
├── users (user profiles)
├── classes (mentor classes)
├── students (student records)
├── attendance (attendance records)
├── assignments (assignments)
├── submissions (assignment submissions)
├── assessments (assessments/exams)
├── attemps (assessment attempts)
├── materials (study materials)
├── videos (recorded classes)
├── announcements (announcements)
├── messages (direct messages)
└── reports (analytics reports)
```

### Users Collection

Document ID: Firebase UID
```json
{
  "id": "firebase_uid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "mentor", // or "student"
  "profileImage": "url_to_image",
  "phone": "+91 9876543210",
  "qualifications": "M.Tech Computer Science",
  "skills": ["React", "Node.js", "Firebase"],
  "assignedPrograms": ["Full-Stack Engineering"],
  "assignedBatches": ["BATCH-2026-A"],
  "createdAt": "2026-08-17T10:00:00Z",
  "updatedAt": "2026-08-17T10:00:00Z"
}
```

## Step 8: Create Test Accounts

### Method 1: Using Firebase Console

1. Go to **Authentication** → **Users** tab
2. Click **Add user**
3. Enter email and password
4. After creating the user, go to **Firestore Database**
5. Create a document in the `users` collection with the user's UID as the document ID
6. Add the user profile data (name, email, role, etc.)

### Method 2: Using a Setup Script (Recommended)

We'll create a setup script in the next steps to automate this process.

### Example Test Accounts

**Mentor Account:**
- Email: `mentor@test.com`
- Password: `Test@123`
- Role: `mentor`

**Student Account:**
- Email: `student@test.com`
- Password: `Test@123`
- Role: `student`

## Step 9: Firebase Security Rules

After setting up, update your Firestore Security Rules:

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Helper function to check if user is mentor
    function isMentor() {
      return isAuthenticated() && getUserRole() == 'mentor';
    }
    
    // Helper function to check if user is student
    function isStudent() {
      return isAuthenticated() && getUserRole() == 'student';
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isAuthenticated() && request.auth.uid == userId;
      
      // Users can update their own profile
      allow update: if isAuthenticated() && request.auth.uid == userId;
      
      // Mentors can read student profiles
      allow read: if isMentor();
    }
    
    // Classes collection
    match /classes/{classId} {
      // Mentors can CRUD their own classes
      allow read, create, update, delete: if isMentor();
      
      // Students can read classes they're enrolled in
      allow read: if isStudent();
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      // Mentors can CRUD attendance
      allow read, create, update, delete: if isMentor();
      
      // Students can read their own attendance
      allow read: if isAuthenticated() && resource.data.studentId == request.auth.uid;
    }
    
    // Assignments collection
    match /assignments/{assignmentId} {
      // Mentors can CRUD assignments
      allow read, create, update, delete: if isMentor();
      
      // Students can read assignments assigned to them
      allow read: if isStudent();
    }
    
    // Submissions collection
    match /submissions/{submissionId} {
      // Students can create and read their own submissions
      allow create: if isStudent() && request.resource.data.studentId == request.auth.uid;
      allow read: if isAuthenticated() && resource.data.studentId == request.auth.uid;
      
      // Mentors can read and update all submissions
      allow read, update: if isMentor();
    }
    
    // Assessments collection
    match /assessments/{assessmentId} {
      // Mentors can CRUD assessments
      allow read, create, update, delete: if isMentor();
      
      // Students can read assessments
      allow read: if isStudent();
    }
    
    // Materials collection
    match /materials/{materialId} {
      // Mentors can CRUD materials
      allow read, create, update, delete: if isMentor();
      
      // Students can read materials
      allow read: if isStudent();
    }
    
    // Videos collection
    match /videos/{videoId} {
      // Mentors can CRUD videos
      allow read, create, update, delete: if isMentor();
      
      // Students can read videos
      allow read: if isStudent();
    }
    
    // Announcements collection
    match /announcements/{announcementId} {
      // Mentors can CRUD announcements
      allow read, create, update, delete: if isMentor();
      
      // Students can read announcements
      allow read: if isStudent();
    }
    
    // Messages collection
    match /messages/{messageId} {
      // Users can read messages where they are sender or receiver
      allow read: if isAuthenticated() && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
      
      // Users can create messages where they are the sender
      allow create: if isAuthenticated() && request.resource.data.senderId == request.auth.uid;
      
      // Prevent updates and deletes for now
      allow update, delete: if false;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Assignment submissions
    match /submissions/{userId}/{fileName} {
      // Students can upload their own submissions
      allow write: if isAuthenticated() && request.auth.uid == userId;
      
      // Students and mentors can read submissions
      allow read: if isAuthenticated();
    }
    
    // Study materials
    match /materials/{fileName} {
      // Mentors can upload materials
      allow write: if isAuthenticated();
      
      // Everyone can read materials
      allow read: if isAuthenticated();
    }
    
    // Recorded videos
    match /videos/{fileName} {
      // Mentors can upload videos
      allow write: if isAuthenticated();
      
      // Everyone can read videos
      allow read: if isAuthenticated();
    }
    
    // Profile images
    match /profiles/{userId}/{fileName} {
      // Users can upload their own profile image
      allow write: if isAuthenticated() && request.auth.uid == userId;
      
      // Everyone can read profile images
      allow read: if isAuthenticated();
    }
  }
}
```

## Step 10: Test the Setup

1. Start the development server: `npm run dev`
2. Try logging in with your test mentor account
3. Verify that the dashboard loads correctly
4. Check the browser console for any Firebase errors

## Troubleshooting

### Common Issues

**"Firebase: Error (auth/configuration-not-found)"**
- Make sure your `.env` file is in the project root
- Restart the development server after creating the `.env` file
- Verify all environment variables start with `VITE_`

**"Missing or insufficient permissions"**
- Update your Firestore Security Rules
- Make sure the user document exists in the `users` collection
- Verify the user's role is set correctly

**"Network request failed"**
- Check your internet connection
- Verify your Firebase project is active
- Check Firebase Console for any service outages

## Next Steps

After completing the setup:

1. Create test mentor and student accounts
2. Start implementing Mentor Dashboard features
3. Test authentication flow
4. Implement Firestore CRUD operations for classes, attendance, etc.
