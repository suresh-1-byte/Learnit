import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Coffee,
  Minus
} from 'lucide-react';

// Attendance status types
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday' | 'no_class';

// Attendance data structure for a single day
export interface AttendanceDayData {
  date: string; // ISO date string (YYYY-MM-DD)
  status: AttendanceStatus;
  className?: string;
  startTime?: string;
  endTime?: string;
  mentor?: string;
  subject?: string;
}

// Props for the AttendanceCalendar component
export interface AttendanceCalendarProps {
  // Initial month to display (default: current month)
  initialMonth?: Date;
  // Attendance data for the month
  attendanceData?: AttendanceDayData[];
  // Callback when a date is clicked
  onDateSelect?: (date: Date, data?: AttendanceDayData) => void;
  // Show/hide summary cards
  showSummary?: boolean;
  // Show/hide legend
  showLegend?: boolean;
  // Compact mode for smaller spaces
  compact?: boolean;
  // Role-specific styling
  role?: 'student' | 'mentor' | 'college_admin' | 'super_admin';
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  initialMonth = new Date(),
  attendanceData = [],
  onDateSelect,
  showSummary = true,
  showLegend = true,
  compact = false,
  role = 'student'
}) => {
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calculate summary statistics
  const calculateSummary = () => {
    const present = attendanceData.filter(d => d.status === 'present').length;
    const absent = attendanceData.filter(d => d.status === 'absent').length;
    const late = attendanceData.filter(d => d.status === 'late').length;
    const totalClasses = attendanceData.filter(d => d.status !== 'no_class' && d.status !== 'holiday').length;
    const percentage = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;

    return { present, absent, late, totalClasses, percentage };
  };

  const summary = calculateSummary();

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Get days in month and calendar grid
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = lastDay.getDate();
    
    const days: Array<{ date: Date | null; dayNumber: number }> = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ date: null, dayNumber: 0 });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), dayNumber: day });
    }
    
    return days;
  };

  // Handle date click with null check
  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    const attendanceDataForDate = getAttendanceForDate(date);
    if (onDateSelect) {
      onDateSelect(date, attendanceDataForDate);
    }
  };

  // Get attendance data for a specific date
  const getAttendanceForDate = (date: Date): AttendanceDayData | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return attendanceData.find(d => d.date === dateStr);
  };

  // Get status color and label
  const getStatusConfig = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return {
          bgColor: 'bg-[#10B981]',
          textColor: 'text-white',
          label: 'P',
          icon: <CheckCircle2 className="w-3 h-3" />
        };
      case 'absent':
        return {
          bgColor: 'bg-[#EF4444]',
          textColor: 'text-white',
          label: 'A',
          icon: <XCircle className="w-3 h-3" />
        };
      case 'late':
        return {
          bgColor: 'bg-[#F59E0B]',
          textColor: 'text-white',
          label: 'L',
          icon: <Clock className="w-3 h-3" />
        };
      case 'holiday':
        return {
          bgColor: 'bg-[#6366F1]',
          textColor: 'text-white',
          label: 'H',
          icon: <Coffee className="w-3 h-3" />
        };
      case 'no_class':
        return {
          bgColor: theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-200',
          textColor: theme === 'dark' ? 'text-[#666]' : 'text-gray-400',
          label: '-',
          icon: <Minus className="w-3 h-3" />
        };
      default:
        return {
          bgColor: theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-200',
          textColor: theme === 'dark' ? 'text-[#666]' : 'text-gray-400',
          label: '-',
          icon: <Minus className="w-3 h-3" />
        };
    }
  };

  // Format month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  const calendarDays = getCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`space-y-4 ${compact ? 'space-y-3' : ''}`}>
      {/* Calendar Header */}
      <div className={`flex items-center justify-between ${compact ? 'px-2' : ''}`}>
        <div className="flex items-center gap-2">
          <CalendarIcon className={`w-4 h-4 ${theme === 'dark' ? 'text-[#6366F1]' : 'text-indigo-600'}`} />
          <h3 className={`font-bold ${compact ? 'text-xs' : 'text-sm'} ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{monthName}</h3>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={goToPreviousMonth}
            className={`p-1.5 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'hover:bg-[#1A1A1A] text-[#888] hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={goToToday}
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              theme === 'dark' 
                ? 'bg-[#1A1A1A] text-[#888] hover:text-white hover:bg-[#222]' 
                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
            title="Go to today"
          >
            Today
          </button>
          
          <button
            onClick={goToNextMonth}
            className={`p-1.5 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'hover:bg-[#1A1A1A] text-[#888] hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {showSummary && (
        <div className="grid grid-cols-5 gap-2">
          <div className={`p-2 rounded-lg border text-center ${
            theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-[10px] uppercase font-bold ${
              theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
            }`}>Attendance</div>
            <div className={`text-lg font-extrabold font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {summary.percentage}%
            </div>
          </div>
          
          <div className={`p-2 rounded-lg border text-center ${
            theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-[10px] uppercase font-bold ${
              theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
            }`}>Present</div>
            <div className={`text-lg font-extrabold font-mono text-[#10B981]`}>
              {summary.present}
            </div>
          </div>
          
          <div className={`p-2 rounded-lg border text-center ${
            theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-[10px] uppercase font-bold ${
              theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
            }`}>Absent</div>
            <div className={`text-lg font-extrabold font-mono text-[#EF4444]`}>
              {summary.absent}
            </div>
          </div>
          
          <div className={`p-2 rounded-lg border text-center ${
            theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-[10px] uppercase font-bold ${
              theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
            }`}>Late</div>
            <div className={`text-lg font-extrabold font-mono text-[#F59E0B]`}>
              {summary.late}
            </div>
          </div>
          
          <div className={`p-2 rounded-lg border text-center ${
            theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-[10px] uppercase font-bold ${
              theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
            }`}>Total</div>
            <div className={`text-lg font-extrabold font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {summary.totalClasses}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className={`rounded-xl border p-3 ${
        theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className={`text-center font-bold uppercase ${
              theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
            } ${compact ? 'text-[8px]' : 'text-[9px]'}`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day.date) {
              return <div key={index} className="aspect-square" />;
            }

            const attendanceDataForDate = getAttendanceForDate(day.date);
            const status = attendanceDataForDate?.status || 'no_class';
            const statusConfig = getStatusConfig(status);
            const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
            const isToday = day.date.toDateString() === new Date().toDateString();

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day.date)}
                className={`aspect-square rounded-lg flex items-center justify-center font-medium cursor-pointer transition-all hover:scale-110 ${
                  statusConfig.bgColor
                } ${statusConfig.textColor} ${
                  isSelected ? 'ring-2 ring-[#6366F1] ring-offset-2' : ''
                } ${isToday ? 'ring-2 ring-[#10B981] ring-offset-2' : ''
                } ${compact ? 'text-[9px]' : 'text-[10px]'}`}
                title={`${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${statusConfig.label}`}
              >
                {day.dayNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { status: 'present' as AttendanceStatus, label: 'Present' },
            { status: 'absent' as AttendanceStatus, label: 'Absent' },
            { status: 'late' as AttendanceStatus, label: 'Late' },
            { status: 'holiday' as AttendanceStatus, label: 'Holiday' },
            { status: 'no_class' as AttendanceStatus, label: 'No Class' }
          ].map(item => {
            const config = getStatusConfig(item.status);
            return (
              <div key={item.status} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded ${config.bgColor}`} />
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                }`}>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Date Details */}
      {selectedDate && onDateSelect && (
        <div className={`p-3 rounded-lg border ${
          theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`font-bold text-xs mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          
          {(() => {
            const data = selectedDate ? getAttendanceForDate(selectedDate) : undefined;
            if (!data || data.status === 'no_class') {
              return (
                <div className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                  No class scheduled
                </div>
              );
            }

            const statusConfig = getStatusConfig(data.status);
            return (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {statusConfig.icon}
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Status: {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </span>
                </div>
                {data.className && (
                  <div className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                    Class: {data.className}
                  </div>
                )}
                {data.startTime && data.endTime && (
                  <div className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                    Time: {data.startTime} – {data.endTime}
                  </div>
                )}
                {data.mentor && (
                  <div className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                    Mentor: {data.mentor}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
