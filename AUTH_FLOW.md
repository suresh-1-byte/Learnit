# Authentication Flow Diagram

## 🔐 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER VISITS APP                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  AuthProvider  │  (Checks existing session)
                    │   initializes  │
                    └────────┬───────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │ No Session   │          │ Has Session  │
        │ Found        │          │ (Firebase)   │
        └──────┬───────┘          └──────┬───────┘
               │                         │
               │                         ▼
               │              ┌────────────────────┐
               │              │ Fetch User Profile │
               │              │  from Firestore    │
               │              └─────────┬──────────┘
               │                        │
               │                        ▼
               │              ┌────────────────────┐
               │              │  Check User Role   │
               │              └─────────┬──────────┘
               │                        │
               │        ┌───────────────┼───────────────┐
               │        │               │               │
               │        ▼               ▼               ▼
               │  ┌─────────┐    ┌─────────┐    ┌─────────┐
               │  │ Mentor  │    │ Student │    │  Admin  │
               │  │Dashboard│    │Dashboard│    │Dashboard│
               │  └─────────┘    └─────────┘    └─────────┘
               │
               ▼
    ┌──────────────────┐
    │  Login Page      │
    │  (Choose Role)   │
    └────────┬─────────┘
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
┌──────────┐    ┌───────────┐
│ Mentor   │    │  Student  │
│  Login   │    │   Login   │
└────┬─────┘    └─────┬─────┘
     │                │
     └────────┬───────┘
              │
              ▼
    ┌──────────────────┐
    │ User enters:     │
    │ - Email          │
    │ - Password       │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Firebase Auth    │
    │ Authentication   │
    └────────┬─────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌──────────┐
│ Success │      │  Error   │
└────┬────┘      └────┬─────┘
     │                │
     │                ▼
     │        ┌──────────────┐
     │        │ Show Error:  │
     │        │ - Invalid    │
     │        │ - Not Found  │
     │        │ - Network    │
     │        └──────────────┘
     │
     ▼
┌──────────────────┐
│ Fetch User from  │
│ Firestore        │
│ /users/{uid}     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Verify Role      │
│ matches login    │
│ portal type      │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────────┐
│  OK    │ │  DENIED    │
└───┬────┘ └──────┬─────┘
    │             │
    │             ▼
    │      ┌────────────┐
    │      │"Access     │
    │      │ Denied"    │
    │      └────────────┘
    │
    ▼
┌──────────────────┐
│ Set User in      │
│ AuthContext      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Redirect to      │
│ Dashboard        │
└──────────────────┘
```

## 🗄️ Data Storage Structure

### Firebase Authentication
```
Firebase Auth Users
├── UID: abc123xyz
│   ├── email: mentor@test.com
│   ├── emailVerified: true
│   └── (password hash - managed by Firebase)
│
└── UID: def456uvw
    ├── email: student@test.com
    ├── emailVerified: true
    └── (password hash - managed by Firebase)
```

### Firestore Database
```
Collection: users
│
├── Document: abc123xyz (Firebase UID)
│   ├── id: "abc123xyz"
│   ├── name: "Ananya Deshmukh"
│   ├── email: "mentor@test.com"
│   ├── role: "mentor"
│   ├── profileImage: "url..."
│   ├── phone: "+91 98765 22222"
│   ├── qualifications: "M.Tech..."
│   ├── skills: ["React", "Node.js"]
│   ├── assignedBatches: ["BATCH-2026-A"]
│   ├── createdAt: "2026-08-17T10:00:00Z"
│   └── updatedAt: "2026-08-17T10:00:00Z"
│
└── Document: def456uvw (Firebase UID)
    ├── id: "def456uvw"
    ├── name: "Arun Kumar"
    ├── email: "student@test.com"
    ├── role: "student"
    ├── rollNumber: "STU-2026-001"
    ├── batchName: "BATCH-2026-A"
    ├── createdAt: "2026-08-17T10:00:00Z"
    └── updatedAt: "2026-08-17T10:00:00Z"
```

## 🔒 Security Rules Logic

### Firestore Rules
```
If user is authenticated {
    If accessing own profile {
        ✅ Allow READ
        ✅ Allow UPDATE
    }
    
    If user is mentor {
        ✅ Allow READ student profiles
        ✅ Allow CREATE/READ/UPDATE/DELETE classes
        ✅ Allow CREATE/READ/UPDATE/DELETE assignments
        ✅ Allow CREATE/READ/UPDATE/DELETE attendance
        ✅ Allow READ submissions
        ✅ Allow UPDATE submissions (for grading)
    }
    
    If user is student {
        ✅ Allow READ own assignments
        ✅ Allow CREATE own submissions
        ✅ Allow READ own attendance
        ✅ Allow READ study materials
        ✅ Allow READ announcements
        ❌ DENY modifying other student data
        ❌ DENY accessing mentor-only data
    }
}
```

## 📱 Component Hierarchy

```
App.tsx
├── AuthProvider (Global Authentication State)
│   └── useAuth() hook available to all children
│
├── Not Authenticated
│   ├── PublicWebsite
│   ├── AuthModal
│   ├── MentorLogin (uses useAuth)
│   └── StudentLogin (uses useAuth)
│
└── Authenticated
    ├── Header (shows user info from useAuth)
    ├── Sidebar (based on user role from useAuth)
    └── Dashboard (role-specific)
        ├── MentorDashboard (if role === 'mentor')
        └── StudentDashboard (if role === 'student')
```

## 🔄 Session Persistence

### How it Works:
1. User logs in → Firebase stores session in browser
2. Browser refresh → AuthProvider checks Firebase session
3. Session exists → Automatically fetch user profile
4. User sees dashboard immediately (no re-login needed)
5. User closes browser → Session persists
6. User opens browser later → Still logged in

### Session Lifecycle:
```
Login
  ↓
Firebase Auth creates session
  ↓
Session stored in browser (IndexedDB)
  ↓
┌─────────────────────┐
│ Session Active      │ ←──────┐
│ - Token auto-refresh│        │
│ - Profile in memory │        │
└──────────┬──────────┘        │
           │                   │
           ├──→ Page Refresh ──┘
           │
           ├──→ Browser Close → Session Persists
           │
           └──→ Logout → Session Destroyed
```

## 🛡️ Protected Routes Logic

```javascript
function ProtectedRoute({ allowedRole }) {
  const { userProfile } = useAuth();
  
  // Not logged in
  if (!userProfile) {
    return <RedirectToLogin />;
  }
  
  // Wrong role
  if (userProfile.role !== allowedRole) {
    return <AccessDenied />;
  }
  
  // All good!
  return <Dashboard />;
}
```

## 🚦 Authentication States

```
LOADING (Initial)
  │
  ├─→ Firebase checking existing session...
  │
  ▼
NOT_AUTHENTICATED
  │
  ├─→ Show login page
  ├─→ User enters credentials
  ├─→ Firebase authentication
  │
  ▼
AUTHENTICATING
  │
  ├─→ Validating credentials...
  ├─→ Fetching user profile...
  ├─→ Verifying role...
  │
  ▼
AUTHENTICATED
  │
  ├─→ User profile loaded
  ├─→ Role verified
  ├─→ Dashboard shown
  │
  └─→ [User clicks Logout]
      │
      ▼
    LOGGING_OUT
      │
      ├─→ Clear Firebase session
      ├─→ Clear local state
      │
      ▼
    NOT_AUTHENTICATED
```

## 💾 Local State Management

### AuthContext provides:
```typescript
{
  currentUser: User | null,           // Firebase auth user
  userProfile: UserProfile | null,    // Firestore user data
  loading: boolean,                   // Initial load state
  login: (email, password) => Promise,
  logout: () => Promise,
  refreshUserProfile: () => Promise
}
```

### Usage in components:
```typescript
const { userProfile, logout } = useAuth();

// Access user data
console.log(userProfile.name);
console.log(userProfile.role);
console.log(userProfile.assignedBatches);

// Logout
await logout();
```

---

This authentication system provides:
- ✅ Secure Firebase authentication
- ✅ Role-based access control
- ✅ Session persistence
- ✅ Automatic profile loading
- ✅ Protected routes
- ✅ Real-time auth state
- ✅ Production-ready security
