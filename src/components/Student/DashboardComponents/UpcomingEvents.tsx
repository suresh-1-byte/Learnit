import React from 'react';
import { CalendarDays, Bell, FileText, FileCheck } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface UpcomingEvent {
  icon: React.ReactNode;
  title: string;
  description: string;
  date: string;
}

interface Announcement {
  title: string;
  description: string;
  time: string;
}

interface UpcomingEventsProps {
  upcomingEvents: UpcomingEvent[];
  announcements: Announcement[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ upcomingEvents, announcements }) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      {/* Upcoming */}
      <div className={`rounded-2xl border p-5 space-y-4 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#14141C] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#A855F7]" />
            <h2 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upcoming</h2>
          </div>
        </div>

        <div className="space-y-3">
          {upcomingEvents.map((event, idx) => (
            <div key={idx} className={`p-3 rounded-xl border transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#171720] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {event.icon}
                <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{event.title}</span>
              </div>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-[#999]' : 'text-[#64748B]'}`}>{event.description}</p>
              <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-[#777]' : 'text-[#94A3B8]'}`}>{event.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className={`rounded-2xl border p-5 space-y-4 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#14141C] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#6366F1]" />
            <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Announcements</h3>
          </div>
          <span className="text-[10px] text-[#F59E0B] font-mono font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded">{announcements.length} New</span>
        </div>

        <div className="space-y-3">
          {announcements.map((announcement, idx) => (
            <div key={idx} className={`p-3 rounded-xl border transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#171720] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{announcement.title}</p>
              <p className={`text-[11px] mt-1 ${theme === 'dark' ? 'text-[#999]' : 'text-[#64748B]'}`}>{announcement.description}</p>
              <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-[#777]' : 'text-[#94A3B8]'}`}>{announcement.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
