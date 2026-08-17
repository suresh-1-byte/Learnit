import React from 'react';
import { Activity, BookOpen, TrendingUp } from 'lucide-react';
import { Student } from '../../../types';
import { useTheme } from '../../../contexts/ThemeContext';
import AttendanceCalendar, { AttendanceDayData } from '../../Shared/AttendanceCalendar';

interface AnalyticsChartsProps {
  student?: Student;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ student }) => {
  const { theme } = useTheme();
  
  // Generate attendance calendar data for current month
  const generateAttendanceData = (): AttendanceDayData[] => {
    const data: AttendanceDayData[] = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const baseAttendance = student?.attendancePct || 92;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();
      
      // Skip weekends (no class)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        data.push({
          date: date.toISOString().split('T')[0],
          status: 'no_class'
        });
        continue;
      }
      
      // Random attendance status based on base attendance
      const random = Math.random();
      let status: AttendanceDayData['status'];
      
      if (random < (baseAttendance / 100) * 0.85) {
        status = 'present';
      } else if (random < (baseAttendance / 100)) {
        status = 'late';
      } else {
        status = 'absent';
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        status,
        className: 'React Microservices',
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        mentor: 'Prof. Rajesh Kumar'
      });
    }
    
    return data;
  };

  const attendanceCalendarData = generateAttendanceData();

  // Generate learning progress based on CGPA
  const baseProgress = student ? Math.round(student.cgpa * 10) : 84;
  const learningProgressData = [
    { module: 'Microservices', progress: Math.min(baseProgress + 11, 100) },
    { module: 'React Advanced', progress: Math.min(baseProgress + 4, 100) },
    { module: 'System Design', progress: Math.min(baseProgress - 12, 100) },
    { module: 'DevOps', progress: Math.min(baseProgress - 19, 100) }
  ];

  // Generate performance data based on CGPA
  const basePerformance = student ? Math.round(student.cgpa * 10) : 84;
  const performanceData = [
    { category: 'Assignments', score: Math.min(basePerformance + 8, 100) },
    { category: 'Assessments', score: Math.min(basePerformance + 10, 100) },
    { category: 'Projects', score: Math.min(basePerformance + 4, 100) },
    { category: 'Participation', score: Math.min(basePerformance + 1, 100) }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Attendance Calendar */}
      <div className={`rounded-2xl border p-5 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#14141C] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#10B981]" />
            <h2 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Attendance</h2>
          </div>
          <span className={`text-[10px] ${theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'}`}>Monthly Calendar</span>
        </div>
        <div className="mt-4">
          <AttendanceCalendar
            attendanceData={attendanceCalendarData}
            showSummary={true}
            showLegend={true}
            compact={true}
            role="student"
            onDateSelect={(date, data) => {

            }}
          />
        </div>
      </div>

      {/* Learning Progress Chart */}
      <div className={`rounded-2xl border p-5 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#14141C] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#6366F1]" />
            <h2 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Learning Progress</h2>
          </div>
          <span className={`text-[10px] ${theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'}`}>By Module</span>
        </div>
        <div className="mt-4 space-y-3">
          {learningProgressData.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.module}</span>
                <span className="text-[#6366F1] font-mono">{item.progress}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-[#171720]' : 'bg-gray-100'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#818CF8] rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
          <div className={`pt-2 border-t ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] ${theme === 'dark' ? 'text-[#999]' : 'text-[#64748B]'}`}>Overall Progress</span>
              <span className="text-sm font-bold text-[#6366F1] font-mono">{baseProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className={`rounded-2xl border p-5 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#14141C] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#A855F7]" />
            <h2 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Performance</h2>
          </div>
          <span className={`text-[10px] ${theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'}`}>This Semester</span>
        </div>
        <div className="mt-4 space-y-3">
          {performanceData.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.category}</span>
                <span className="text-[#A855F7] font-mono">{item.score}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-[#171720]' : 'bg-gray-100'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-[#A855F7] to-[#C084FC] rounded-full"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
          <div className={`pt-2 border-t ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] ${theme === 'dark' ? 'text-[#999]' : 'text-[#64748B]'}`}>Overall Score</span>
              <span className="text-sm font-bold text-[#A855F7] font-mono">{basePerformance}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
