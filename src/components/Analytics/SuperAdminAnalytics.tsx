import React, { useState } from 'react';
import { AnalyticsService, AnalyticsData, AnalyticsKPI, ChartData } from '../../services/analyticsService';
import { useTheme } from '../../contexts/ThemeContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  GraduationCap,
  Award,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Filter,
  Search,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Briefcase,
  Layers,
  ShieldAlert
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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#A855F7', '#EF4444', '#06B6D4'];

export const SuperAdminAnalytics: React.FC = () => {
  const { theme } = useTheme();
  const [timeHorizon, setTimeHorizon] = useState<'today' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'colleges' | 'placements' | 'mentors' | 'financial'>('overview');

  // Get Super Admin specific analytics data
  const analyticsData: AnalyticsData = AnalyticsService.getSuperAdminAnalytics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 border shadow-xl relative overflow-hidden ${
        theme === 'dark' ? 'bg-[#080808] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <div className={`absolute -right-10 -bottom-10 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          theme === 'dark' ? 'bg-[#6366F1]/10' : 'bg-[#6366F1]/5'
        }`}></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                theme === 'dark' 
                  ? 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20' 
                  : 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20'
              }`}>
                SUPER ADMIN
              </span>
              <span className={`text-xs font-medium ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
              }`}>Global Platform Analytics</span>
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Platform Overview</h1>
            <p className={`text-xs mt-0.5 ${
              theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
            }`}>
              Global metrics across all partner colleges, mentors, and students
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
          { id: 'colleges', label: 'Colleges', icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'placements', label: 'Placements', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'mentors', label: 'Mentors', icon: <UserCheck className="w-3.5 h-3.5" /> },
          { id: 'financial', label: 'Financial', icon: <CreditCard className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#6366F1] text-white shadow-md font-bold'
                : theme === 'dark' ? 'text-[#888] hover:text-white hover:bg-[#111]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {analyticsData.kpis.map((kpi, index) => (
          <div key={index} className={`p-3.5 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
          }`}>
            <span className={`text-[9px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
            }`}>{kpi.label}</span>
            <div className={`text-lg font-extrabold mt-1 font-mono ${
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
            {/* Enrollment & Placement Trend */}
            <div className={`rounded-2xl border p-5 space-y-4 ${
              theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <div>
                  <h3 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Student Enrollment vs Placement Velocity</h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#777]' : 'text-gray-600'
                  }`}>Monthly growth trajectory across all partner institutions</p>
                </div>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.charts.enrollment}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
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
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="students" name="Enrolled Students" stroke="#6366F1" fillOpacity={1} fill="url(#colorStudents)" />
                    <Area type="monotone" dataKey="placements" name="Students Placed" stroke="#10B981" fillOpacity={1} fill="url(#colorPlacements)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* College Performance */}
            <div className={`rounded-2xl border p-5 space-y-4 ${
              theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <h3 className={`font-bold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Partner College Performance</h3>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                }`}>All Colleges</span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.charts.collegePerformance}>
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
                    <Bar dataKey="students" name="Students" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="placementRate" name="Placement Rate %" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Colleges Tab */}
      {activeTab === 'colleges' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>College-wise Performance Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' : 'border-gray-200 text-gray-500 bg-gray-50'
                }`}>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4">Placement Rate</th>
                  <th className="py-3 px-4">Revenue</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' ? 'divide-[#141414]' : 'divide-gray-200'
              }`}>
                {analyticsData.charts.collegePerformance.map((college: any, index: number) => (
                  <tr key={index} className={theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}>
                    <td className={`py-3 px-4 font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{college.name}</td>
                    <td className={`py-3 px-4 font-mono ${
                      theme === 'dark' ? 'text-[#6366F1]' : 'text-indigo-600'
                    }`}>{college.students}</td>
                    <td className={`py-3 px-4 font-mono ${
                      theme === 'dark' ? 'text-[#10B981]' : 'text-green-600'
                    }`}>{college.placementRate}%</td>
                    <td className={`py-3 px-4 font-mono ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>₹{(college.revenue / 100000).toFixed(1)}L</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        theme === 'dark' 
                          ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Placements Tab */}
      {activeTab === 'placements' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Global Placement Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Total Placed</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Placement Rate')?.value}
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Active Hiring Partners</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>150+</div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Avg Package</span>
              <div className={`text-2xl font-extrabold font-mono text-[#F59E0B]`}>₹14.2 LPA</div>
            </div>
          </div>
        </div>
      )}

      {/* Mentors Tab */}
      {activeTab === 'mentors' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Mentor Activity Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Total Mentors</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Total Mentors')?.value}
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Avg Rating</span>
              <div className={`text-2xl font-extrabold font-mono text-[#10B981]`}>4.8/5.0</div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && (
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Total Revenue</span>
              <div className={`text-2xl font-extrabold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.kpis.find(k => k.label === 'Total Revenue')?.value}
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
              }`}>Collection Rate</span>
              <div className={`text-2xl font-extrabold font-mono text-[#10B981]`}>92.1%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
