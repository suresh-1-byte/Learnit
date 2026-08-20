import React, { useState } from 'react';
import {
  Plus,
  X,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle,
  Bell,
  Eye,
  Edit2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AnnouncementsManagerProps {
  // Announcements modal
  showCreateAnnouncementModal: boolean;
  setShowCreateAnnouncementModal: (show: boolean) => void;
  handleCreateAnnouncement: (e: React.FormEvent) => void;
  
  // Form state
  selectedClassForAnnouncement: string;
  setSelectedClassForAnnouncement: (value: string) => void;
  newAnnouncementTitle: string;
  setNewAnnouncementTitle: (value: string) => void;
  newAnnouncementContent: string;
  setNewAnnouncementContent: (value: string) => void;
  newAnnouncementPriority: 'High' | 'Medium' | 'Low';
  setNewAnnouncementPriority: (value: 'High' | 'Medium' | 'Low') => void;
  
  // Classes data
  classes: any[];
  
  // Announcements data
  announcements: any[];
  announcementsLoading: boolean;
  
  // Edit modal
  showEditAnnouncementModal: boolean;
  setShowEditAnnouncementModal: (show: boolean) => void;
  editingAnnouncement: any;
  setEditingAnnouncement: (announcement: any) => void;
  handleUpdateAnnouncement: (e: React.FormEvent) => void;
  
  // Actions
  removeAnnouncement: (id: string) => Promise<void>;
}

export const AnnouncementsManager: React.FC<AnnouncementsManagerProps> = ({
  showCreateAnnouncementModal,
  setShowCreateAnnouncementModal,
  handleCreateAnnouncement,
  selectedClassForAnnouncement,
  setSelectedClassForAnnouncement,
  newAnnouncementTitle,
  setNewAnnouncementTitle,
  newAnnouncementContent,
  setNewAnnouncementContent,
  newAnnouncementPriority,
  setNewAnnouncementPriority,
  classes,
  announcements,
  announcementsLoading,
  showEditAnnouncementModal,
  setShowEditAnnouncementModal,
  editingAnnouncement,
  setEditingAnnouncement,
  handleUpdateAnnouncement,
  removeAnnouncement
}) => {
  const { theme } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Announcements & Notices</h2>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Post important updates and notices to your students</p>
        </div>
        <button
          onClick={() => setShowCreateAnnouncementModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Post Announcement
        </button>
      </div>

      {/* Loading State */}
      {announcementsLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
        </div>
      )}

      {/* Empty State */}
      {!announcementsLoading && announcements.length === 0 && (
        <div className={`text-center py-12 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-[#111] border-[#222]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <Bell className={`w-12 h-12 mx-auto mb-3 ${
            theme === 'dark' ? 'text-[#333]' : 'text-gray-400'
          }`} />
          <p className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
          }`}>No announcements yet</p>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
          }`}>Create your first announcement to notify students</p>
        </div>
      )}

      {/* Announcements List */}
      {!announcementsLoading && announcements.length > 0 && (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className={`p-5 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#111] border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.2)]' 
                : 'bg-gray-50 border-[rgba(0,0,0,0.06)] hover:border-[rgba(99,102,241,0.2)]'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Priority Badge & Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                    <h3 className={`font-bold text-base ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{announcement.title}</h3>
                  </div>
                  
                  {/* Content */}
                  <p className={`text-sm mb-3 ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                  }`}>{announcement.content}</p>
                  
                  {/* Meta Info */}
                  <div className={`flex items-center gap-4 text-xs ${
                    theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(announcement.createdAt)}
                    </span>
                    {announcement.readBy && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {announcement.readBy.length} read
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingAnnouncement(announcement);
                      setShowEditAnnouncementModal(true);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-[#1A1A1A] text-[#AAA] hover:text-white' 
                        : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                    title="Edit announcement"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(announcement.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-[#1A1A1A] text-[#EF4444] hover:text-[#DC2626]' 
                        : 'hover:bg-red-50 text-[#EF4444] hover:text-[#DC2626]'
                    }`}
                    title="Delete announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateAnnouncementModal && (
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
              }`}>Post New Announcement</h3>
              <button onClick={() => setShowCreateAnnouncementModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Target Class *</label>
                <select
                  required
                  value={selectedClassForAnnouncement}
                  onChange={(e) => setSelectedClassForAnnouncement(e.target.value)}
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
                }`}>Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class Rescheduled to 3 PM"
                  value={newAnnouncementTitle}
                  onChange={(e) => setNewAnnouncementTitle(e.target.value)}
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
                }`}>Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your announcement message here..."
                  value={newAnnouncementContent}
                  onChange={(e) => setNewAnnouncementContent(e.target.value)}
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
                }`}>Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High', 'Medium', 'Low'] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setNewAnnouncementPriority(priority)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        newAnnouncementPriority === priority
                          ? priority === 'High' 
                            ? 'bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444]'
                            : priority === 'Medium'
                            ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]'
                            : 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                          : theme === 'dark'
                          ? 'bg-[#1A1A1A] border-[#2A2A2A] text-[#888] hover:border-[#444]'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`flex justify-end gap-2 pt-3 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button type="button" onClick={() => setShowCreateAnnouncementModal(false)} className={`px-4 py-2 rounded-xl font-semibold ${
                  theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-[#64748B] hover:text-gray-900'
                }`}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-md">
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {showEditAnnouncementModal && editingAnnouncement && (
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
              }`}>Edit Announcement</h3>
              <button onClick={() => setShowEditAnnouncementModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Announcement Title *</label>
                <input
                  type="text"
                  required
                  value={newAnnouncementTitle}
                  onChange={(e) => setNewAnnouncementTitle(e.target.value)}
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
                }`}>Message *</label>
                <textarea
                  rows={4}
                  required
                  value={newAnnouncementContent}
                  onChange={(e) => setNewAnnouncementContent(e.target.value)}
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
                }`}>Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High', 'Medium', 'Low'] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setNewAnnouncementPriority(priority)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        newAnnouncementPriority === priority
                          ? priority === 'High' 
                            ? 'bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444]'
                            : priority === 'Medium'
                            ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]'
                            : 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                          : theme === 'dark'
                          ? 'bg-[#1A1A1A] border-[#2A2A2A] text-[#888] hover:border-[#444]'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`flex justify-end gap-2 pt-3 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button type="button" onClick={() => setShowEditAnnouncementModal(false)} className={`px-4 py-2 rounded-xl font-semibold ${
                  theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-[#64748B] hover:text-gray-900'
                }`}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-md">
                  Update Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
                }`}>Delete Announcement?</h3>
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
                  await removeAnnouncement(deleteConfirm);
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
