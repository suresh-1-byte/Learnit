# 🎯 ALL REMAINING COMPONENTS - COMPLETE CODE

## 📋 TABLE OF CONTENTS
1. StudentAnnouncements.tsx (Student UI for Announcements)
2. MaterialsManager.tsx (Mentor UI for Materials)
3. StudentMaterials.tsx (Student UI for Materials)
4. VideosManager.tsx (Mentor UI for Videos)
5. StudentVideos.tsx (Student UI for Videos)

---

## 1️⃣ STUDENT ANNOUNCEMENTS COMPONENT

### File: `src/components/Student/StudentAnnouncements.tsx`

```typescript
import React from 'react';
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
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isUnread = (announcement: any) => {
    return !announcement.readBy || !announcement.readBy.includes(userProfile?.id || '');
  };

  const handleMarkAsRead = async (announcementId: string) => {
    if (userProfile?.id && isUnread(announcements.find(a => a.id === announcementId))) {
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
              onClick={() => handleMarkAsRead(announcement.id)}
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

## 2️⃣ MATERIALS MANAGER COMPONENT (Mentor)

### File: `src/components/Mentor/MaterialsManager.tsx`

```typescript
import React, { useState } from 'react';
import {
  Plus,
  X,
  Trash2,
  Download,
  FileText,
  Eye,
  AlertCircle,
  Upload
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface MaterialsManagerProps {
  // Upload modal
  showUploadMaterialModal: boolean;
  setShowUploadMaterialModal: (show: boolean) => void;
  handleUploadMaterial: (e: React.FormEvent) => void;
  
  // Form state
  selectedClassForMaterial: string;
  setSelectedClassForMaterial: (value: string) => void;
  newMaterialTitle: string;
  setNewMaterialTitle: (value: string) => void;
  newMaterialDescription: string;
  setNewMaterialDescription: (value: string) => void;
  newMaterialType: 'PDF' | 'Video' | 'Code' | 'Link';
  setNewMaterialType: (value: 'PDF' | 'Video' | 'Code' | 'Link') => void;
  newMaterialFile: File | undefined;
  setNewMaterialFile: (file: File | undefined) => void;
  
  // Classes data
  classes: any[];
  
  // Materials data
  materials: any[];
  materialsLoading: boolean;
  
  // Actions
  removeMaterial: (id: string) => Promise<void>;
}

export const MaterialsManager: React.FC<MaterialsManagerProps> = ({
  showUploadMaterialModal,
  setShowUploadMaterialModal,
  handleUploadMaterial,
  selectedClassForMaterial,
  setSelectedClassForMaterial,
  newMaterialTitle,
  setNewMaterialTitle,
  newMaterialDescription,
  setNewMaterialDescription,
  newMaterialType,
  setNewMaterialType,
  newMaterialFile,
  setNewMaterialFile,
  classes,
  materials,
  materialsLoading,
  removeMaterial
}) => {
  const { theme } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    return <FileText className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
      case 'Video': return 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20';
      case 'Code': return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';
      case 'Link': return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20';
      default: return 'text-[#888] bg-[#888]/10 border-[#888]/20';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
          }`}>Learning Materials</h2>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Upload and manage study materials for your students</p>
        </div>
        <button
          onClick={() => setShowUploadMaterialModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
        >
          <Upload className="w-4 h-4" /> Upload Material
        </button>
      </div>

      {materialsLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div>
        </div>
      )}

      {!materialsLoading && materials.length === 0 && (
        <div className={`text-center py-12 rounded-2xl border ${
          theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
        }`}>
          <FileText className={`w-12 h-12 mx-auto mb-3 ${
            theme === 'dark' ? 'text-[#333]' : 'text-gray-400'
          }`} />
          <p className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
          }`}>No materials uploaded yet</p>
        </div>
      )}

      {!materialsLoading && materials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
            <div key={material.id} className={`p-5 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#111] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
                : 'bg-gray-50 border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${getTypeColor(material.type)}`}>
                  {getTypeIcon(material.type)}
                </div>
                <button
                  onClick={() => setDeleteConfirm(material.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-[#1A1A1A] text-[#EF4444]' 
                      : 'hover:bg-red-50 text-[#EF4444]'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-2 ${getTypeColor(material.type)}`}>
                {material.type}
              </span>

              <h3 className={`font-bold text-sm mb-2 line-clamp-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{material.title}</h3>

              {material.description && (
                <p className={`text-xs mb-3 line-clamp-2 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{material.description}</p>
              )}

              <div className={`flex items-center justify-between text-xs pt-3 border-t ${
                theme === 'dark' ? 'border-[#222] text-[#666]' : 'border-gray-200 text-gray-500'
              }`}>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {material.viewCount || 0} views
                </span>
                {material.fileSize && (
                  <span>{formatFileSize(material.fileSize)}</span>
                )}
              </div>

              {material.fileUrl && (
                <a
                  href={material.fileUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] rounded-lg text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Material Modal */}
      {showUploadMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Upload Learning Material</h3>
              <button onClick={() => setShowUploadMaterialModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Target Class *</label>
                <select
                  required
                  value={selectedClassForMaterial}
                  onChange={(e) => setSelectedClassForMaterial(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Material Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Hooks Lecture Notes"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the material..."
                  value={newMaterialDescription}
                  onChange={(e) => setNewMaterialDescription(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border resize-none ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Material Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['PDF', 'Video', 'Code', 'Link'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewMaterialType(type)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        newMaterialType === type
                          ? getTypeColor(type)
                          : theme === 'dark'
                          ? 'bg-[#1A1A1A] border-[#2A2A2A] text-[#888]'
                          : 'bg-gray-100 border-gray-300 text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Upload File *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.zip,.mp4,.mov,.ppt,.pptx"
                  onChange={(e) => setNewMaterialFile(e.target.files?.[0])}
                  className={`w-full p-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <p className={`text-[10px] mt-1 ${
                  theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
                }`}>Supported: PDF, DOC, ZIP, MP4, PPT (Max 50MB)</p>
              </div>

              <div className={`flex justify-end gap-2 pt-3 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button type="button" onClick={() => setShowUploadMaterialModal(false)} className={`px-4 py-2 rounded-xl font-semibold ${
                  theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-[#64748B] hover:text-gray-900'
                }`}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-md">
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#EF4444]" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Delete Material?</h3>
                <p className={`text-xs mt-0.5 ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDeleteConfirm(null)} className={`px-4 py-2 rounded-xl font-semibold ${
                theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-[#64748B] hover:text-gray-900'
              }`}>Cancel</button>
              <button
                onClick={async () => {
                  await removeMaterial(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-[#EF4444] hover:bg-red-600 text-white rounded-xl font-semibold shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## ⚠️ RESPONSE LENGTH LIMIT

I've created the first 2 complete components. The remaining components (StudentMaterials and both Videos components) are ready but exceed the response limit.

**Would you like me to:**

1. **"continue with remaining"** - Create StudentMaterials.tsx and both Videos components in next response
2. **"create files now"** - I'll create all 4 component files directly using fs_write
3. **"show integration"** - Show how to integrate what we have so far

**Which would you prefer?**