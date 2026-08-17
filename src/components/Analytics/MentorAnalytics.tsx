import React, { useState } from 'react';
import { AnalyticsService, AnalyticsData } from '../../services/analyticsService';
import { useTheme } from '../../contexts/ThemeContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  Briefcase,
  RefreshCw,
  ArrowUpRight,
  UserCheck,
  BookOpen,
  FileText,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import AttendanceCalendar, { AttendanceDayData } from '../Shared/AttendanceCalendar';

export const MentorAnalytics: React.FC<{ mentorId?: string }> = ({ mentorId = 'user_003' }) => {
  const { theme } = useTheme();
  const [timeHorizon, setTimeHorizon] = useState<'today' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'attendance' | 'performance' | 'submissions'>('overview');

  // Get Mentor specific analytics data
  const analyticsData: AnalyticsData = AnalyticsService.getMentorAnalytics(mentorId);

  // Generate attendance calendar data for current month
  const generateAttendanceData = (): AttendanceDayData[] => {
    const data: AttendanceDayData[] = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const attendancePct = parseFloat(analyticsData.kpis.find(k => k.label === 'Attendance Rate')?.value.toString().replace('%', '') || '95');
    
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
      
      // Random attendance status based on attendance percentage
      const random = Math.random();
      let status: AttendanceDayData['status'];
      
      if (random < (attendancePct / 100) * 0.85) {
        status = 'present';
      } else if (random < (attendancePct / 100)) {
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
        mentor: 'Dr. Emily Rodriguez'
      });
    }
    
    return data;
  };

  const attendanceCalendarData = generateAttendanceData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 border shadow-xl relative overflow-hidden ${
        theme === 'dark' ? 'bg-[#080808] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <div className={`absolute -right-10 -bottom-10 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          theme === 'dark' ? 'bg-[#10B981]/10' : 'bg-[#10B981]/5'
        }`}></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                theme === 'dark' 
                  ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' 
                  : 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20'
              }`}>
                MENTOR
              </span>
              <span className={`text-xs font-medium ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
              }`}>Mentor-Specific Analytics</span>
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Mentor Dashboard</h1>
            <p className={`text-xs mt-0.5 ${
              theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
            }`}>
              Metrics for your assigned students and batches only
            </p>
          </div>

          {/* Time Horizon Switcher */}
          <div className={`flex items-center border rounded-xl p-1 text-xs font-semibold ${
            theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-100 border-gray-200'
          }`}>
            {(['today', 'weekly', 'monthly', 'quarterly', 'yearly'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setTimeHorizon(h)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  timeHorizon === h 
                    ? theme === 'dark' ? 'bg-[#222] text-white border border-[#333]' : 'bg-white text-gray-900 border border-gray-300 shadow-sm'
                    : theme === 'dark' ? 'text-[#777] hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className={`flex items-center gap-1 border-b overflow-x-auto pb-1 text-xs font-semibold ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'students', label: 'Students', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'attendance', label: 'Attendance', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
          { id: 'performance', label: 'Performance', icon: <GraduationCap className="w-3.5 h-3.5" /> },
          { id: 'submissions', label: 'Submissions', icon: <FileText className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#10B981] text-white shadow-md font-bold'
                : theme === 'dark' ? 'text-[#888] hover:text-white hover:bg-[#111]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
        {analyticsData.kpis.map((kpi, index) => (
          <div key={index} className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
          }`}>
            <span className={`text-[9px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
            }`}>{kpi.label}</span>
            <div className={`text-xl font-extrabold mt-1 font-mono ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ color: kpi.color }}>{kpi.value}</div>
            {kpi.trend && (
              <span className={`text-[9px] flex items-center gap-0.5 mt-0.5 ${
                kpi.trend.includes('+') ? 'text-[#10B981]' : theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>
                <ArrowUpRight className="w-2.5 h-2.5" /> {kpi.trend}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Performance */}
            <div className={`rounded-2xl border p-5 space-y-4 ${
              theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <div>
                  <h3 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Student Performance Overview</h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#777]' : 'text-gray-600'
                  }`}>Performance of your assigned students</p>
                </div>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.charts.studentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1A1A1A' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={theme === 'dark' ? '#666' : '#666'} fontSize={10} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke={theme === 'dark' ? '#666' : '#666'} fontSize={11} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                        borderColor: theme === 'dark' ? '#222' : '#e5e7eb', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        color: theme === 'dark' ? '#fff' : '#000'
                      }}
                    />
                    <Bar dataKey="attendance" name="Attendance %" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="cgpa" name="CGPA" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Batch Performance */}
            <div className={`rounded-2xl border p-5 space-y-4 ${
              theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <h3 className={`font-bold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Assigned Batches</h3>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                }`}>Active Batches</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.charts.batchPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1A1A1A' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={theme === 'dark' ? '#666' : '#666'} fontSize={10} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke={theme === 'dark' ? '#666' : '#666'} fontSize={11} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                        borderColor: theme === 'dark' ? '#222' : '#e5e7eb', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        color: theme === 'dark' ? '#fff' : '#000'
                      }}
                    />
                    <Bar dataKey="students" name="Students" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="attendance" name="Attendance %" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Assigned Students</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Students Mentored</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Students Mentored')?.value}
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Active Batches</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Active Batches')?.value}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Attendance Calendar</h3>
          <AttendanceCalendar
            attendanceData={attendanceCalendarData}
            showSummary={true}
            showLegend={true}
            compact={false}
            role="mentor"
            onDateSelect={(date, data) => {

            }}
          />
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Performance Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Avg Performance</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Avg Performance')?.value}
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Placed Students</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Placed Students')?.value}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Submission Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Submission Rate</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Submission Rate')?.value}
              </div>
            </div>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.charts.submissionTrend}>
                  <defs>
                    <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1A1A1A' : '#e5e7eb'} />
                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#666' : '#666'} fontSize={11} />
                  <YAxis stroke={theme === 'dark' ? '#666' : '#666'} fontSize={11} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                      borderColor: theme === 'dark' ? '#222' : '#e5e7eb', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      color: theme === 'dark' ? '#fff' : '#000'
                    }}
                  />
                  <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#10B981" fillOpacity={1} fill="url(#colorSubmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
