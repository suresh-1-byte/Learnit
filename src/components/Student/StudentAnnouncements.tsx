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
    const announcement = announcements.find(a => a.id === announcementId);
    if (userProfile?.id && announcement && isUnread(announcement)) {
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
                  }`}>{announcement.body}</p>
                  
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
