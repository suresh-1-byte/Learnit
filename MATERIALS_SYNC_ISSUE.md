# Study Materials & Broadcasts Not Syncing - Issue Analysis

## 🐛 PROBLEM IDENTIFIED

**Issue:** Study materials uploaded by mentors and broadcasts sent are NOT visible in the student portal.

**Root Cause:** Both Mentor Dashboard and Student Dashboard are using **local state arrays** instead of **Firebase Firestore** for data storage and retrieval.

---

## 🔍 TECHNICAL ANALYSIS

### Current Implementation (BROKEN)

#### Mentor Dashboard
**Location:** `src/components/Mentor/MentorDashboard.tsx`
**Lines:** 177-178

```typescript
const [materials, setMaterials] = useState<LearningMaterial[]>([]);
const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);
```

**Problem:**
- Materials are stored in **component state** only
- When mentor uploads material, it's added to local array:
  ```typescript
  setMaterials([newMat, ...materials]);
  ```
- **NOT saved to Firebase**
- Data lost on page refresh
- Not shared across users

#### Student Dashboard  
**Location:** `src/components/Student/StudentDashboard.tsx`
**Line:** 103

```typescript
const [materials] = useState<LearningMaterial[]>([]);
```

**Problem:**
- **Empty array** initialized
- **No Firebase fetch** logic
- **No real-time listener**
- Cannot see mentor-uploaded materials

---

## ✅ AVAILABLE FIREBASE SERVICES

### Firebase Materials Service EXISTS!
**Location:** `src/services/firebase/materials.service.ts`

**Available Functions:**
1. ✅ `createMaterial()` - Upload material to Firestore + Storage
2. ✅ `getMaterialsByMentor()` - Get all materials by mentor ID
3. ✅ `getMaterialsByClass()` - Get materials for specific class
4. ✅ `updateMaterial()` - Update existing material
5. ✅ `deleteMaterial()` - Remove material
6. ✅ `incrementMaterialViewCount()` - Track views
7. ✅ `searchMaterials()` - Search functionality

### Custom Hook EXISTS!
**Location:** `src/hooks/useMaterials.ts`

**Provides:**
- `materials` - Array of materials from Firebase
- `loading` - Loading state
- `error` - Error handling
- `addMaterial()` - Create new material
- `updateMaterialData()` - Update material
- `removeMaterial()` - Delete material
- `incrementViewCount()` - Track views
- `searchMaterials()` - Search function

---

## 🔧 REQUIRED FIXES

### Fix 1: Mentor Dashboard - Use Firebase for Material Upload

**Current (BROKEN):**
```typescript
const [materials, setMaterials] = useState<LearningMaterial[]>([]);

const handleAddMaterial = (e: React.FormEvent) => {
  e.preventDefault();
  const newMat = { /* ... */ };
  setMaterials([newMat, ...materials]); // ❌ Local state only
  setShowUploadMaterialModal(false);
};
```

**Fixed (CORRECT):**
```typescript
import { useMaterials } from '../../hooks/useMaterials';

// In component:
const { materials, loading, addMaterial } = useMaterials();

const handleAddMaterial = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const materialData = {
    title: newMatTitle,
    type: newMatType,
    description: newMatDesc,
    classId: selectedClassId,
    mentorId: userProfile.id,
    tags: []
  };
  
  try {
    await addMaterial(materialData, uploadedFile); // ✅ Saves to Firebase
    setShowUploadMaterialModal(false);
  } catch (error) {
    console.error('Failed to upload material:', error);
  }
};
```

### Fix 2: Student Dashboard - Fetch Materials from Firebase

**Current (BROKEN):**
```typescript
const [materials] = useState<LearningMaterial[]>([]); // ❌ Empty array
```

**Fixed (CORRECT):**
```typescript
import { useMaterials } from '../../hooks/useMaterials';
import { useAuth } from '../../contexts/AuthContext';

// In component:
const { userProfile } = useAuth();
const { materials, loading, error } = useMaterials(userProfile?.classId);

// Materials automatically fetched from Firebase
// Updates in real-time when mentors add new materials
```

---

## 📊 DATA FLOW (AFTER FIX)

```
MENTOR UPLOADS MATERIAL
       ↓
useMaterials.addMaterial()
       ↓
Firebase Materials Service
       ↓
┌─────────────────────────┐
│  Firestore Database     │
│  Collection: materials  │
│  + Document Created     │
└─────────────────────────┘
       ↓
┌─────────────────────────┐
│  Firebase Storage       │
│  Path: materials/       │
│       mentorId/         │
│       materialId/file   │
└─────────────────────────┘
       ↓
STUDENT FETCHES MATERIALS
       ↓
useMaterials(classId)
       ↓
getMaterialsByClass()
       ↓
STUDENT SEES NEW MATERIAL ✅
```

---

## 🎯 SAME ISSUE WITH BROADCASTS

### Broadcast Problem
**Same pattern as materials:**
- Mentor sends broadcast → Saved to local state only
- Student portal → Empty array, no Firebase fetch
- Broadcasts not syncing

### Broadcast Solution
Need to:
1. Create `src/services/firebase/broadcasts.service.ts`
2. Create `src/hooks/useBroadcasts.ts`
3. Update Mentor Dashboard to save broadcasts to Firebase
4. Update Student Dashboard to fetch broadcasts from Firebase

---

## ⚙️ FIRESTORE DATA STRUCTURE

### Materials Collection
```typescript
materials/
  {materialId}/
    id: string
    title: string
    description: string
    type: 'Video' | 'PDF' | 'Code Sandbox' | 'Slides'
    mentorId: string
    classId: string
    fileUrl: string
    fileName: string
    fileSize: number
    viewCount: number
    tags: string[]
    createdAt: string
    updatedAt: string
```

### Broadcasts Collection (TO BE CREATED)
```typescript
broadcasts/
  {broadcastId}/
    id: string
    title: string
    message: string
    mentorId: string
    classId: string
    priority: 'Normal' | 'High' | 'Urgent'
    read: boolean
    createdAt: string
```

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Fix Mentor Materials Upload
1. Import `useMaterials` hook in MentorDashboard
2. Replace local state with hook
3. Update `handleAddMaterial` to use `addMaterial()` from hook
4. Add file upload input to modal
5. Handle loading and error states

### Step 2: Fix Student Materials View
1. Import `useMaterials` hook in StudentDashboard
2. Replace empty array with hook (pass classId)
3. Add loading spinner while fetching
4. Display error if fetch fails
5. Show real materials from Firebase

### Step 3: Fix Broadcasts (Similar Pattern)
1. Create broadcasts Firebase service
2. Create useBroadcasts hook
3. Update Mentor broadcast sending
4. Update Student broadcast receiving
5. Add real-time listeners

### Step 4: Add Real-Time Updates
1. Use Firestore `onSnapshot` in hooks
2. Auto-refresh when new materials added
3. Show notification when new broadcast arrives
4. Update UI immediately without refresh

---

## 🔐 FIREBASE SECURITY RULES

### Materials Access Rules (Already Configured)
```javascript
match /materials/{materialId} {
  // Mentors can create/update/delete their own materials
  allow create: if request.auth != null && 
                   request.auth.uid == request.resource.data.mentorId;
  
  // Students can read materials for their class
  allow read: if request.auth != null && 
                 resource.data.classId == getUserClass(request.auth.uid);
  
  // Mentors can update/delete their own materials
  allow update, delete: if request.auth != null && 
                           resource.data.mentorId == request.auth.uid;
}
```

---

## ✅ BENEFITS AFTER FIX

### For Mentors:
- ✅ Materials persist after page refresh
- ✅ Materials available across all devices
- ✅ Track view counts and analytics
- ✅ Search and filter materials
- ✅ Update or delete materials anytime

### For Students:
- ✅ See all materials uploaded by mentor
- ✅ Real-time updates when new materials added
- ✅ Download materials anytime
- ✅ Track learning progress
- ✅ Bookmark favorite materials

### For System:
- ✅ Centralized data storage
- ✅ Scalable architecture
- ✅ Audit trail of uploads
- ✅ Analytics and reporting
- ✅ Backup and recovery

---

## 🎯 PRIORITY

**Status:** 🔴 HIGH PRIORITY
**Impact:** Core functionality broken
**Affected Users:** All mentors and students
**Estimated Fix Time:** 2-3 hours

---

## 📝 TESTING CHECKLIST

After implementing fixes:

### Mentor Side:
- [ ] Upload new material
- [ ] Verify saved to Firebase Console
- [ ] Refresh page - material still visible
- [ ] Update material details
- [ ] Delete material
- [ ] Search materials
- [ ] View upload history

### Student Side:
- [ ] View materials list
- [ ] See newly uploaded materials
- [ ] Download material file
- [ ] Track view count
- [ ] Bookmark materials
- [ ] Search materials
- [ ] Filter by type

### Cross-User:
- [ ] Mentor uploads → Student sees (same class)
- [ ] Different classes don't see each other's materials
- [ ] Real-time update works
- [ ] Multiple students can download simultaneously

---

**Issue Documented:** August 19, 2026
**Severity:** Critical
**Status:** Requires Implementation
