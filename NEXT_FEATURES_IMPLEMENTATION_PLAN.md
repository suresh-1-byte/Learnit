# 🚀 NEXT 3 FEATURES IMPLEMENTATION PLAN

## ✅ WHAT'S ALREADY DONE

### Backend & Hooks (100% Complete)
- ✅ `announcements.service.ts` - All CRUD functions
- ✅ `materials.service.ts` - All CRUD + file upload
- ✅ `videos.service.ts` - All CRUD + file upload
- ✅ `useAnnouncements.ts` - Complete hook
- ✅ `useMaterials.ts` - Complete hook
- ✅ `useVideos.ts` - Complete hook

## 🎯 WHAT NEEDS TO BE DONE

### UI Components (2-3 hours total)

```
Phase 1: Announcements (30-45 mins)
  ├── AnnouncementsManager.tsx (Mentor UI)
  └── StudentAnnouncements.tsx (Student UI)

Phase 2: Materials (45-60 mins)  
  ├── MaterialsManager.tsx (Mentor UI)
  └── StudentMaterials.tsx (Student UI)

Phase 3: Videos (45-60 mins)
  ├── VideosManager.tsx (Mentor UI)
  └── StudentVideos.tsx (Student UI)
```

---

## 📋 FEATURE 1: ANNOUNCEMENTS

### Hook API (Already Available)
```typescript
const {
  announcements,           // List of announcements
  loading,                // Loading state
  error,                  // Error message
  unreadCount,            // Unread count (student)
  addAnnouncement,        // Create new
  updateAnnouncementData, // Update existing
  removeAnnouncement,     // Delete
  markAsRead,             // Mark as read (student)
  getStats                // Get statistics
} = useAnnouncements(classId);
```

### Data Structure
```typescript
interface Announcement {
  id: string;
  title: string;
  content: string;
  mentorId: string;
  mentorName: string;
  classId: string;          // Target class
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  updatedAt: string;
  readBy?: string[];        // Student IDs who read it
}
```

### Mentor Features
1. Create announcement (title, content, priority, target class)
2. View all announcements
3. Edit announcement
4. Delete announcement
5. See read stats (how many students read it)

### Student Features
1. View announcements for their class
2. Mark as read
3. See priority badges
4. See unread count
5. Filter by priority

---

## 📋 FEATURE 2: LEARNING MATERIALS

### Hook API (Already Available)
```typescript
const {
  materials,              // List of materials
  loading,               // Loading state
  error,                 // Error message
  addMaterial,           // Upload new material
  updateMaterialData,    // Update existing
  removeMaterial,        // Delete
  trackView,             // Track view count
  search                 // Search materials
} = useMaterials(classId);
```

### Data Structure
```typescript
interface Material {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Code' | 'Link';
  mentorId: string;
  mentorName: string;
  classId: string;          // Target class
  fileUrl: string;          // Firebase Storage URL
  fileName: string;
  fileSize: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Mentor Features
1. Upload material (PDF, code files, links)
2. View all materials
3. Edit material details
4. Delete material
5. See view statistics

### Student Features
1. View materials for their class
2. Download materials
3. Track views (auto-increment)
4. Search materials
5. Filter by type

---

## 📋 FEATURE 3: VIDEO LIBRARY

### Hook API (Already Available)
```typescript
const {
  videos,                // List of videos
  loading,              // Loading state
  error,                // Error message
  addVideo,             // Upload new video
  updateVideoData,      // Update existing
  removeVideo,          // Delete
  trackView,            // Track view count
  like,                 // Like video
  search                // Search videos
} = useVideos(classId);
```

### Data Structure
```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  mentorName: string;
  classId: string;          // Target class
  videoUrl: string;         // Firebase Storage or YouTube
  thumbnailUrl?: string;
  duration: string;         // e.g., "45:30"
  fileName: string;
  fileSize: number;
  viewCount: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}
```

### Mentor Features
1. Upload video (with optional thumbnail)
2. View all videos
3. Edit video details
4. Delete video
5. See view count and likes

### Student Features
1. View videos for their class
2. Watch videos (HTML5 player)
3. Like videos
4. Track views (auto-increment)
5. Search videos

---

## 🎨 UI COMPONENT TEMPLATES

### Pattern to Follow (Same as Assignments)

```typescript
// MENTOR COMPONENT PATTERN
export const [Feature]Manager: React.FC<Props> = ({
  // Props from parent dashboard
}) => {
  const { theme } = useTheme();
  const use[Feature] = use[Feature]s();
  
  return (
    <div>
      {/* Header with Create button */}
      {/* List of items */}
      {/* Create Modal */}
      {/* Edit Modal */}
      {/* Delete Confirmation */}
    </div>
  );
};

// STUDENT COMPONENT PATTERN  
export const Student[Feature]s: React.FC = () => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const classId = userProfile?.classId || '';
  const { [feature]s, loading } = use[Feature]s(classId);
  
  return (
    <div>
      {/* Header */}
      {/* List of items for student's class */}
      {/* Empty states */}
      {/* Loading states */}
    </div>
  );
};
```

---

## ⚡ QUICK IMPLEMENTATION CHECKLIST

### For Each Feature:

#### Step 1: Create Mentor Component (20 mins)
- [ ] Create file: `src/components/Mentor/[Feature]Manager.tsx`
- [ ] Import hook: `use[Feature]s`
- [ ] Add state for modals
- [ ] Implement create function
- [ ] Implement edit function
- [ ] Implement delete function
- [ ] Add UI with modals
- [ ] Test with mentor account

#### Step 2: Create Student Component (15 mins)
- [ ] Create file: `src/components/Student/Student[Feature]s.tsx`
- [ ] Import hook with classId
- [ ] Display list filtered by classId
- [ ] Add download/view functionality
- [ ] Add empty states
- [ ] Test with student account

#### Step 3: Integrate into Dashboards (5 mins)
- [ ] Import component in MentorDashboard
- [ ] Replace render function
- [ ] Import component in StudentDashboard
- [ ] Replace render function
- [ ] Test navigation

#### Step 4: Verify Real-Time Sync (5 mins)
- [ ] Mentor creates → Student sees
- [ ] Mentor updates → Student sees changes
- [ ] Mentor deletes → Student no longer sees
- [ ] File uploads work
- [ ] Downloads work

---

## 🔥 FIREBASE QUERIES (Auto-Handled by Hooks)

### Mentor Queries
```typescript
// Get all announcements created by mentor
WHERE mentorId == currentUser.id

// Get announcements for specific class
WHERE classId == selectedClassId
```

### Student Queries
```typescript
// Get announcements for student's class
WHERE classId == student.classId

// Get materials for student's class
WHERE classId == student.classId

// Get videos for student's class
WHERE classId == student.classId
```

**Result:** Real-time sync automatic! When mentor creates for classId "class_A", all students with classId "class_A" see it instantly!

---

## 📊 EXPECTED TIMELINE

| Feature | Mentor UI | Student UI | Integration | Testing | Total |
|---------|-----------|------------|-------------|---------|-------|
| Announcements | 20 mins | 15 mins | 5 mins | 5 mins | **45 mins** |
| Materials | 25 mins | 15 mins | 5 mins | 5 mins | **50 mins** |
| Videos | 25 mins | 20 mins | 5 mins | 5 mins | **55 mins** |
| **TOTAL** | | | | | **2.5 hours** |

---

## 🎯 PRIORITY ORDER

### Option 1: Feature Completion (Recommended)
```
1. Announcements (complete both UIs) ✅
2. Materials (complete both UIs) ✅
3. Videos (complete both UIs) ✅
```

**Advantage:** Each feature fully functional before moving to next

### Option 2: Role-Based
```
1. All Mentor UIs first
2. Then all Student UIs
```

**Advantage:** Mentor can start using immediately

### Option 3: Simple to Complex
```
1. Announcements (simplest - no file upload in create)
2. Materials (medium - one file upload)
3. Videos (complex - video + thumbnail upload)
```

**Advantage:** Build confidence with easier features first

---

## 🚀 LET'S START!

### Ready to implement?

**Choose one:**
1. "Start with Announcements" - I'll create both Mentor and Student UIs
2. "Start with Materials" - Jump to materials feature
3. "Start with Videos" - Go straight to videos
4. "Do all 3 together" - I'll create all 6 components at once

**What I'll deliver:**
- ✅ Complete, production-ready components
- ✅ Full dark/light theme support
- ✅ Zero TypeScript errors
- ✅ Integrated into dashboards
- ✅ Real-time Firebase sync working
- ✅ File uploads/downloads functional
- ✅ Professional UI matching Assignments style

**Say "continue" and I'll start implementing all 3 features!** 🚀
