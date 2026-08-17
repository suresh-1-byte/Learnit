import React, { useState } from 'react';
import { AnalyticsService, AnalyticsData } from '../../services/analyticsService';
import { useTheme } from '../../contexts/ThemeContext';
import {
  BarChart3,
  TrendingUp,
  GraduationCap,
  Award,
  CheckCircle2,
  Briefcase,
  RefreshCw,
  ArrowUpRight,
  BookOpen,
  FileText,
  Target,
  Star
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import AttendanceCalendar, { AttendanceDayData } from '../Shared/AttendanceCalendar';

export const StudentAnalytics: React.FC<{ studentId?: string }> = ({ studentId = 'stu_001' }) => {
  const { theme } = useTheme();
  const [timeHorizon, setTimeHorizon] = useState<'today' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'attendance' | 'placements' | 'skills'>('overview');

  // Get Student specific analytics data
  const analyticsData: AnalyticsData = AnalyticsService.getStudentAnalytics(studentId);

  // Generate attendance calendar data for current month
  const generateAttendanceData = (): AttendanceDayData[] => {
    const data: AttendanceDayData[] = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const attendancePct = parseFloat(analyticsData.kpis.find(k => k.label === 'Attendance')?.value.toString().replace('%', '') || '92');
    
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
        mentor: 'Prof. Rajesh Kumar'
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
          theme === 'dark' ? 'bg-[#A855F7]/10' : 'bg-[#A855F7]/5'
        }`}></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                theme === 'dark' 
                  ? 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/20' 
                  : 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/20'
              }`}>
                STUDENT
              </span>
              <span className={`text-xs font-medium ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
              }`}>Personal Analytics</span>
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>My Dashboard</h1>
            <p className={`text-xs mt-0.5 ${
              theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
            }`}>
              Your personal academic and placement metrics
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
          { id: 'academic', label: 'Academic', icon: <GraduationCap className="w-3.5 h-3.5" /> },
          { id: 'attendance', label: 'Attendance', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
          { id: 'placements', label: 'Placements', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'skills', label: 'Skills', icon: <Star className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#A855F7] text-white shadow-md font-bold'
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
            {/* Performance Trend */}
            <div className={`rounded-2xl border p-5 space-y-4 ${
              theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <div>
                  <h3 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Performance Trend</h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#777]' : 'text-gray-600'
                  }`}>Your monthly performance trajectory</p>
                </div>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.charts.performanceTrend}>
                    <defs>
                      <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
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
                    <Area type="monotone" dataKey="score" name="Score %" stroke="#A855F7" fillOpacity={1} fill="url(#colorPerformance)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance Calendar */}
            <div className={`rounded-2xl border p-5 space-y-4 ${
              theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <h3 className={`font-bold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Attendance Calendar</h3>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                }`}>August 2026</span>
              </div>

              <div className="space-y-2">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={`text-[10px] font-bold uppercase ${
                      theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
                    }`}>{day}</div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2; // Offset to start from Aug 1
                    const isCurrentMonth = day >= 1 && day <= 31;
                    const attendanceStatus = isCurrentMonth 
                      ? Math.random() > 0.15 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late'
                      : null;
                    
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-medium cursor-pointer transition-all hover:scale-110 ${
                          !isCurrentMonth 
                            ? 'opacity-20' 
                            : attendanceStatus === 'present'
                            ? 'bg-[#10B981] text-white'
                            : attendanceStatus === 'absent'
                            ? 'bg-[#EF4444] text-white'
                            : 'bg-[#F59E0B] text-white'
                        }`}
                        title={isCurrentMonth ? `Aug ${day}: ${attendanceStatus}` : ''}
                      >
                        {isCurrentMonth ? day : ''}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#10B981]"></div>
                    <span className={`text-[10px] ${
                      theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                    }`}>Present</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#F59E0B]"></div>
                    <span className={`text-[10px] ${
                      theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                    }`}>Late</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#EF4444]"></div>
                    <span className={`text-[10px] ${
                      theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                    }`}>Absent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Tab */}
      {activeTab === 'academic' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Academic Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>CGPA</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'CGPA')?.value}
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Assignments</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Assignments')?.value}
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Avg Score</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Avg Score')?.value}
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Course Progress</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Course Progress')?.value}
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
            role="student"
            onDateSelect={(date, data) => {

            }}
          />
        </div>
      )}

      {/* Placements Tab */}
      {activeTab === 'placements' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Placement Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Placement Status</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Placement Status')?.value}
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Certificates</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Certificates')?.value}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Skills Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Skills Mastered</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Skills')?.value}
              </div>
            </div>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.charts.skillProgress}>
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
                  <Bar dataKey="progress" name="Progress %" fill="#A855F7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
