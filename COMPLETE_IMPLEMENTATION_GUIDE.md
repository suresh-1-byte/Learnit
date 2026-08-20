# 🎯 COMPLETE IMPLEMENTATION GUIDE - ALL 3 FEATURES

## ✅ WHAT I JUST CREATED

### 1. AnnouncementsManager.tsx ✅
**Location:** `src/components/Mentor/AnnouncementsManager.tsx`  
**Lines:** 650+  
**Status:** COMPLETE

**Features:**
- Create announcement with priority (High/Medium/Low)
- View all announcements with priority badges
- Edit announcements
- Delete with confirmation
- Show read count
- Full dark/light theme
- Empty states and loading states

---

## 📋 REMAINING COMPONENTS TO CREATE

I'll provide you with the exact code for each component. You can either:
1. Ask me to continue creating them one by one
2. Copy-paste the code I'll provide below

---

## 🎯 FEATURE 1: ANNOUNCEMENTS (50% Done)

### ✅ Already Created:
- AnnouncementsManager.tsx (Mentor UI)

### ⏳ Need to Create:

#### File: `src/components/Student/StudentAnnouncements.tsx`
```typescript
import React, { useEffect } from 'react';
import { Bell, Calendar, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAnnouncements } from '../../hooks/useAnnouncements';

export const StudentAnnouncements: React.FC = () => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const classId = userProfile?.classId || userProfile?.batchId || '';
  
  const {
    announcements,
    loading,
    markAsRead
  } = useAnnouncements(classId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
      case 'Medium': return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20';
      case 'Low': return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';
      default: return 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isUnread = (announcement: any) => {
    return !announcement.readBy || !announcement.readBy.includes(userProfile?.id || '');
  };

  const handleMarkAsRead = async (announcementId: string) => {
    if (userProfile?.id) {
      await markAsRead(announcementId);
    }
  };

  return (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Announcements & Notices</h2>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Important updates from your mentors</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
        </div>
      )}

      {!loading && !classId && (
        <div className={`text-center py-12 rounded-2xl border ${
          theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
        }`}>
          <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${
            theme === 'dark' ? 'text-[#333]' : 'text-gray-400'
          }`} />
          <p className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
          }`}>No class assigned</p>
        </div>
      )}

      {!loading && classId && announcements.length === 0 && (
        <div className={`text-center py-12 rounded-2xl border ${
          theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
        }`}>
          <Bell className={`w-12 h-12 mx-auto mb-3 ${
            theme === 'dark' ? 'text-[#333]' : 'text-gray-400'
          }`} />
          <p className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
          }`}>No announcements yet</p>
        </div>
      )}

      {!loading && announcements.length > 0 && (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => isUnread(announcement) && handleMarkAsRead(announcement.id)}
              className={`p-5 rounded-2xl border transition-all duration-250 cursor-pointer ${
                isUnread(announcement)
                  ? theme === 'dark'
                    ? 'bg-[#6366F1]/5 border-[#6366F1]/20 hover:border-[#6366F1]/40'
                    : 'bg-indigo-50 border-indigo-200 hover:border-indigo-300'
                  : theme === 'dark'
                  ? 'bg-[#111] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]'
                  : 'bg-gray-50 border-[rgba(0,0,0,0.06)] hover:border-[rgba(0,0,0,0.12)]'
              }`}
            >
              <div className="flex items-start gap-4">
                {isUnread(announcement) && (
                  <div className="w-2 h-2 rounded-full bg-[#6366F1] mt-2 flex-shrink-0"></div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                    {isUnread(announcement) && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`font-bold text-base mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{announcement.title}</h3>
                  
                  <p className={`text-sm mb-3 ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                  }`}>{announcement.content}</p>
                  
                  <div className={`flex items-center gap-4 text-xs ${
                    theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(announcement.createdAt)}
                    </span>
                    <span>Posted by {announcement.mentorName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 🎯 DASHBOARD INTEGRATION CODE

### MentorDashboard.tsx - Add These Sections:

#### 1. Import (add to imports section ~line 25):
```typescript
import { AnnouncementsManager } from './AnnouncementsManager';
```

#### 2. State Variables (add after existing state ~line 150):
```typescript
// Announcements state
const {
  announcements,
  loading: announcementsLoading,
  error: announcementsError,
  addAnnouncement,
  updateAnnouncementData,
  removeAnnouncement
} = useAnnouncements();

const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false);
const [showEditAnnouncementModal, setShowEditAnnouncementModal] = useState(false);
const [selectedClassForAnnouncement, setSelectedClassForAnnouncement] = useState<string>('');
const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
const [newAnnouncementPriority, setNewAnnouncementPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
```

#### 3. Handler Functions (add after existing handlers ~line 600):
```typescript
const handleCreateAnnouncement = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!userProfile || !selectedClassForAnnouncement || !newAnnouncementTitle) {
    alert('Please fill all required fields');
    return;
  }

  try {
    await addAnnouncement({
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      mentorId: userProfile.id,
      mentorName: userProfile.name,
      classId: selectedClassForAnnouncement,
      priority: newAnnouncementPriority
    });
    
    // Reset form
    setShowCreateAnnouncementModal(false);
    setNewAnnouncementTitle('');
    setNewAnnouncementContent('');
    setNewAnnouncementPriority('Medium');
    setSelectedClassForAnnouncement('');
    
    alert('Announcement posted successfully!');
  } catch (error: any) {
    console.error('Error creating announcement:', error);
    alert('Failed to create announcement: ' + error.message);
  }
};

const handleUpdateAnnouncement = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!editingAnnouncement) return;

  try {
    await updateAnnouncementData(editingAnnouncement.id, {
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      priority: newAnnouncementPriority
    });
    
    setShowEditAnnouncementModal(false);
    setEditingAnnouncement(null);
    setNewAnnouncementTitle('');
    setNewAnnouncementContent('');
    setNewAnnouncementPriority('Medium');
    
    alert('Announcement updated successfully!');
  } catch (error: any) {
    console.error('Error updating announcement:', error);
    alert('Failed to update announcement: ' + error.message);
  }
};
```

#### 4. Render Function (add after renderAssignmentsView ~line 2220):
```typescript
const renderAnnouncementsView = () => (
  <AnnouncementsManager
    showCreateAnnouncementModal={showCreateAnnouncementModal}
    setShowCreateAnnouncementModal={setShowCreateAnnouncementModal}
    handleCreateAnnouncement={handleCreateAnnouncement}
    selectedClassForAnnouncement={selectedClassForAnnouncement}
    setSelectedClassForAnnouncement={setSelectedClassForAnnouncement}
    newAnnouncementTitle={newAnnouncementTitle}
    setNewAnnouncementTitle={setNewAnnouncementTitle}
    newAnnouncementContent={newAnnouncementContent}
    setNewAnnouncementContent={setNewAnnouncementContent}
    newAnnouncementPriority={newAnnouncementPriority}
    setNewAnnouncementPriority={setNewAnnouncementPriority}
    classes={classes}
    announcements={announcements}
    announcementsLoading={announcementsLoading}
    showEditAnnouncementModal={showEditAnnouncementModal}
    setShowEditAnnouncementModal={setShowEditAnnouncementModal}
    editingAnnouncement={editingAnnouncement}
    setEditingAnnouncement={setEditingAnnouncement}
    handleUpdateAnnouncement={handleUpdateAnnouncement}
    removeAnnouncement={removeAnnouncement}
  />
);
```

### StudentDashboard.tsx - Add These Sections:

#### 1. Import (add to imports section ~line 34):
```typescript
import { StudentAnnouncements } from './StudentAnnouncements';
```

#### 2. Render Function (add after renderAssignmentsView):
```typescript
const renderAnnouncementsView = () => <StudentAnnouncements />;
```

---

## ⚡ QUICK COMPLETION STEPS

### Step 1: Create Student Component (5 mins)
```bash
# Create the file
New-Item -Path "src\components\Student\StudentAnnouncements.tsx" -ItemType File

# Copy the code above into it
```

### Step 2: Integrate into MentorDashboard (10 mins)
1. Add import at top
2. Add state variables
3. Add handler functions
4. Add render function
5. Hook up to switch statement (find 'announcements' case)

### Step 3: Integrate into StudentDashboard (2 mins)
1. Add import at top
2. Add render function  
3. Hook up to switch statement

### Step 4: Test (3 mins)
1. `npm run dev`
2. Login as mentor → Create announcement
3. Login as student → See announcement

---

## 🎯 NEXT: MATERIALS & VIDEOS

After Announcements is done, I'll create:
1. MaterialsManager.tsx + StudentMaterials.tsx (similar pattern)
2. VideosManager.tsx + StudentVideos.tsx (similar pattern)

**Total Time Remaining:** ~2 hours for all 3 features complete

---

## 🚀 READY TO CONTINUE?

**Say:**
- "create student announcements" - I'll create the student component
- "show me integration" - I'll show the exact integration steps
- "do materials next" - I'll skip to materials feature
- "continue with all" - I'll create all remaining components

**Your AnnouncementsManager is ready and waiting! 🎉**
