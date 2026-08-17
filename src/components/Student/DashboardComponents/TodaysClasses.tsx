import React from 'react';
import { Clock, ChevronRight, Play, Bell } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface ClassSchedule {
  time: string;
  topic: string;
  mentor: string;
  mode: string;
  status: 'Live Now' | 'Scheduled';
}

interface TodaysClassesProps {
  classes: ClassSchedule[];
  onViewFullSchedule: () => void;
  onMarkAttendance: () => void;
}

export const TodaysClasses: React.FC<TodaysClassesProps> = ({ classes, onViewFullSchedule, onMarkAttendance }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-2xl border p-5 space-y-4 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#14141C] border-[#1A1A1A]' : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between pb-3 border-b ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#10B981]" />
          <h2 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Today's Classes</h2>
        </div>
        <button
          onClick={onViewFullSchedule}
          className="text-xs text-[#6366F1] font-semibold hover:underline flex items-center gap-1"
        >
          View Full Schedule <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {classes.map((cls, idx) => (
          <div key={idx} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-[#171720] border-[#222]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#6366F1] px-2 py-0.5 bg-[#6366F1]/10 rounded border border-[#6366F1]/20">{cls.time}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  cls.status === 'Live Now' ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 animate-pulse' : (theme === 'dark' ? 'bg-[#1A1A1A] text-[#BBB]' : 'bg-gray-200 text-[#64748B]')
                }`}>
                  {cls.status}
                </span>
              </div>
              <h3 className={`font-bold text-sm mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cls.topic}</h3>
              <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-[#999]' : 'text-[#64748B]'}`}>Mentor: {cls.mentor} • Mode: {cls.mode}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {cls.status === 'Live Now' ? (
                <>
                  <button
                    onClick={onMarkAttendance}
                    className={`px-3 py-1.5 text-white rounded-lg text-xs font-semibold border transition-colors ${
                      theme === 'dark' 
                        ? 'bg-[#1B1B26] hover:bg-[#252530] border-[#2A2A2A]' 
                        : 'bg-gray-200 hover:bg-gray-300 border-gray-300 text-gray-900'
                    }`}
                  >
                    Mark Attendance
                  </button>
                  <button className="px-3.5 py-1.5 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                    <Play className="w-3.5 h-3.5" /> Join Class
                  </button>
                </>
              ) : (
                <button className="px-3.5 py-1.5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                  <Bell className="w-3.5 h-3.5" /> Set Reminder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
