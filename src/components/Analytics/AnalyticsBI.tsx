import React, { useState } from 'react';
import {
  UserRole
} from '../../types';
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
  FileText,
  Printer,
  ChevronDown,
  RefreshCw,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Briefcase,
  Layers,
  HelpCircle,
  Bell,
  Mail,
  ShieldAlert,
  Send,
  Eye,
  Check,
  X,
  Sliders,
  Plus
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

interface AnalyticsBIProps {
  userRole?: UserRole;
  collegeId?: string;
}

// Chart Colors
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#A855F7', '#EF4444', '#06B6D4'];

export const AnalyticsBI: React.FC<AnalyticsBIProps> = ({
  userRole = 'super_admin',
  collegeId
}) => {
  // Selected Perspective/Role Mode
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);
  const [timeHorizon, setTimeHorizon] = useState<'today' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<
    'executive' | 'attendance' | 'academic' | 'placements' | 'mentors' | 'financial' | 'student_risk' | 'ai_forecast' | 'comparison' | 'report_builder'
  >('executive');

  // Filters State
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Saved Reports State
  const [savedReports, setSavedReports] = useState([
    { id: 'rep_1', title: 'Monthly Placement & Salary Trend Q2', created: '2026-07-28', format: 'PDF' },
    { id: 'rep_2', title: 'At-Risk Student Attendance Warning Log', created: '2026-08-01', format: 'CSV' },
    { id: 'rep_3', title: 'Departmental Profitability & Fee Collection', created: '2026-08-03', format: 'Excel' }
  ]);
  const [newReportName, setNewReportName] = useState('');
  const [reportSavedAlert, setReportSavedAlert] = useState(false);

  // Mock Data Sets
  const monthlyEnrollmentData = [
    { month: 'Jan', students: 820, placements: 45, revenue: 65 },
    { month: 'Feb', students: 950, placements: 72, revenue: 78 },
    { month: 'Mar', students: 1100, placements: 110, revenue: 92 },
    { month: 'Apr', students: 1240, placements: 140, revenue: 105 },
    { month: 'May', students: 1350, placements: 195, revenue: 120 },
    { month: 'Jun', students: 1410, placements: 260, revenue: 135 },
    { month: 'Jul', students: 1450, placements: 340, revenue: 148 }
  ];

  const placementFunnelData = [
    { stage: 'Eligible Students', count: 1200, fill: '#6366F1' },
    { stage: 'Drive Applications', count: 1050, fill: '#3B82F6' },
    { stage: 'Aptitude Cleared', count: 820, fill: '#06B6D4' },
    { stage: 'Technical Round', count: 610, fill: '#10B981' },
    { stage: 'HR Round', count: 450, fill: '#F59E0B' },
    { stage: 'Offers Released', count: 380, fill: '#A855F7' },
    { stage: 'Offers Accepted', count: 360, fill: '#EC4899' }
  ];

  const departmentPerformanceData = [
    { dept: 'CSE', attendance: 97.2, avgScore: 88.5, placementRate: 98.0, avgPackage: 18.2 },
    { dept: 'AI & DS', attendance: 96.5, avgScore: 86.2, placementRate: 95.4, avgPackage: 16.5 },
    { dept: 'IT', attendance: 95.8, avgScore: 84.0, placementRate: 92.1, avgPackage: 14.8 },
    { dept: 'ECE', attendance: 93.4, avgScore: 79.8, placementRate: 88.0, avgPackage: 11.5 },
    { dept: 'Cybersec', attendance: 94.8, avgScore: 82.5, placementRate: 91.0, avgPackage: 13.2 }
  ];

  const attendanceHeatmapData = [
    { day: 'Mon', w1: 96, w2: 95, w3: 98, w4: 97 },
    { day: 'Tue', w1: 97, w2: 96, w3: 97, w4: 98 },
    { day: 'Wed', w1: 95, w2: 94, w3: 96, w4: 95 },
    { day: 'Thu', w1: 94, w2: 93, w3: 95, w4: 96 },
    { day: 'Fri', w1: 92, w2: 90, w3: 93, w4: 94 }
  ];

  const topRecruitersData = [
    { company: 'Microsoft India', hires: 28, highestPackage: 48.0, avgPackage: 26.5 },
    { company: 'Amazon AWS', hires: 35, highestPackage: 32.0, avgPackage: 21.0 },
    { company: 'Goldman Sachs', hires: 18, highestPackage: 28.0, avgPackage: 19.5 },
    { company: 'Atlassian', hires: 12, highestPackage: 42.0, avgPackage: 28.0 },
    { company: 'Salesforce', hires: 22, highestPackage: 26.0, avgPackage: 22.5 }
  ];

  const mentorPerformanceData = [
    { name: 'Dr. Rajesh Kumar', dept: 'CSE', attendanceSla: 99.5, gradingHrs: 8.2, feedbackRating: 4.9, batchCount: 3 },
    { name: 'Prof. Ananya Desai', dept: 'AI & DS', attendanceSla: 98.8, gradingHrs: 11.5, feedbackRating: 4.8, batchCount: 2 },
    { name: 'Sanjay Mehta', dept: 'IT', attendanceSla: 99.0, gradingHrs: 9.0, feedbackRating: 4.9, batchCount: 2 },
    { name: 'Meera Iyer', dept: 'ECE', attendanceSla: 96.5, gradingHrs: 14.2, feedbackRating: 4.7, batchCount: 1 }
  ];

  const atRiskStudents = [
    { id: 's_risk_1', name: 'Vikram Choudhury', usn: '1SX22CS089', dept: 'CSE', attendance: 68.5, assignmentScore: 52.0, riskLevel: 'High', reason: 'Critical attendance drop (<70%) and 3 missed assignments' },
    { id: 's_risk_2', name: 'Pooja Hegde', usn: '1BN22AI034', dept: 'AI & DS', attendance: 72.0, assignmentScore: 58.5, riskLevel: 'High', reason: 'Low assessment scores and pending fees' },
    { id: 's_risk_3', name: 'Karan Saxena', usn: '1DC22IT044', dept: 'IT', attendance: 74.2, assignmentScore: 61.0, riskLevel: 'Medium', reason: 'Below 75% attendance threshold' },
    { id: 's_risk_4', name: 'Neha Kulkarni', usn: '1HT22ECE012', dept: 'ECE', attendance: 71.5, assignmentScore: 54.0, riskLevel: 'High', reason: 'Multiple failed mock placement tests' }
  ];

  // Additional mock data for charts
  const attendanceTrendData = [
    { week: 'Week 1', avgAttendance: 96.2, onTime: 94.5, late: 1.7 },
    { week: 'Week 2', avgAttendance: 95.8, onTime: 93.8, late: 2.0 },
    { week: 'Week 3', avgAttendance: 96.5, onTime: 95.0, late: 1.5 },
    { week: 'Week 4', avgAttendance: 95.2, onTime: 93.5, late: 1.7 }
  ];

  const attendanceDistributionData = [
    { name: 'On Time', value: 94.2, fill: '#10B981' },
    { name: 'Late', value: 1.8, fill: '#F59E0B' },
    { name: 'Absent', value: 4.0, fill: '#EF4444' }
  ];

  const academicScoreTrendData = [
    { month: 'Jan', avgScore: 82, cgpa: 8.5 },
    { month: 'Feb', avgScore: 84, cgpa: 8.6 },
    { month: 'Mar', avgScore: 86, cgpa: 8.7 },
    { month: 'Apr', avgScore: 85, cgpa: 8.6 },
    { month: 'May', avgScore: 88, cgpa: 8.8 },
    { month: 'Jun', avgScore: 87, cgpa: 8.7 },
    { month: 'Jul', avgScore: 89, cgpa: 8.9 }
  ];

  const gradeDistributionData = [
    { name: 'A+ (90-100)', value: 25, fill: '#10B981' },
    { name: 'A (80-89)', value: 35, fill: '#6366F1' },
    { name: 'B+ (70-79)', value: 20, fill: '#A855F7' },
    { name: 'B (60-69)', value: 12, fill: '#F59E0B' },
    { name: 'C (50-59)', value: 6, fill: '#EF4444' },
    { name: 'F (<50)', value: 2, fill: '#6B7280' }
  ];

  const placementTrendData = [
    { month: 'Jan', offers: 45, avgPackage: 14.2 },
    { month: 'Feb', offers: 72, avgPackage: 14.8 },
    { month: 'Mar', offers: 110, avgPackage: 15.5 },
    { month: 'Apr', offers: 140, avgPackage: 16.2 },
    { month: 'May', offers: 195, avgPackage: 17.0 },
    { month: 'Jun', offers: 260, avgPackage: 18.5 },
    { month: 'Jul', offers: 340, avgPackage: 19.8 }
  ];

  const placementPackageDistributionData = [
    { name: '< 10 LPA', value: 15, fill: '#6B7280' },
    { name: '10-15 LPA', value: 30, fill: '#F59E0B' },
    { name: '15-20 LPA', value: 35, fill: '#6366F1' },
    { name: '20-30 LPA', value: 15, fill: '#A855F7' },
    { name: '> 30 LPA', value: 5, fill: '#10B981' }
  ];

  const mentorRatingDistributionData = [
    { name: '5.0', value: 12, fill: '#10B981' },
    { name: '4.5-4.9', value: 10, fill: '#6366F1' },
    { name: '4.0-4.4', value: 4, fill: '#A855F7' },
    { name: '3.5-3.9', value: 2, fill: '#F59E0B' }
  ];

  const mentorWorkloadData = [
    { mentor: 'Dr. Rajesh', hours: 8.2, students: 45 },
    { mentor: 'Prof. Ananya', hours: 11.5, students: 52 },
    { mentor: 'Sanjay', hours: 9.0, students: 38 },
    { mentor: 'Meera', hours: 14.2, students: 48 }
  ];

  const revenueBreakdownData = [
    { source: 'Tuition Fees', amount: 3.85, fill: '#6366F1' },
    { source: 'Corporate Sponsorships', amount: 0.65, fill: '#10B981' },
    { source: 'College Subscriptions', amount: 0.35, fill: '#A855F7' }
  ];

  const riskCategoryDistributionData = [
    { name: 'High Risk', value: 4, fill: '#EF4444' },
    { name: 'Medium Risk', value: 8, fill: '#F59E0B' },
    { name: 'Low Risk', value: 12, fill: '#10B981' },
    { name: 'No Risk', value: 1426, fill: '#6366F1' }
  ];

  const riskTrendData = [
    { month: 'Jan', highRisk: 2, mediumRisk: 5, lowRisk: 10 },
    { month: 'Feb', highRisk: 3, mediumRisk: 6, lowRisk: 11 },
    { month: 'Mar', highRisk: 4, mediumRisk: 7, lowRisk: 12 },
    { month: 'Apr', highRisk: 3, mediumRisk: 8, lowRisk: 11 },
    { month: 'May', highRisk: 4, mediumRisk: 8, lowRisk: 12 },
    { month: 'Jun', highRisk: 4, mediumRisk: 8, lowRisk: 12 },
    { month: 'Jul', highRisk: 4, mediumRisk: 8, lowRisk: 12 }
  ];

  const forecastAccuracyData = [
    { metric: 'Placement Rate', actual: 92.4, forecast: 94.8, accuracy: 97.5 },
    { metric: 'Student Growth', actual: 1450, forecast: 1480, accuracy: 98.0 },
    { metric: 'Revenue', actual: 4.85, forecast: 5.0, accuracy: 97.0 }
  ];

  const forecastConfidenceData = [
    { name: 'High Confidence (>90%)', value: 65, fill: '#10B981' },
    { name: 'Medium Confidence (70-90%)', value: 25, fill: '#F59E0B' },
    { name: 'Low Confidence (<70%)', value: 10, fill: '#EF4444' }
  ];

  const comparisonRadarData = [
    { metric: 'Attendance', CSE: 97.2, 'AI & DS': 96.5, IT: 95.8, ECE: 93.4, Cybersec: 94.8 },
    { metric: 'Avg Score', CSE: 88.5, 'AI & DS': 86.2, IT: 84.0, ECE: 79.8, Cybersec: 82.5 },
    { metric: 'Placement Rate', CSE: 98.0, 'AI & DS': 95.4, IT: 92.1, ECE: 88.0, Cybersec: 91.0 },
    { metric: 'Avg Package', CSE: 18.2, 'AI & DS': 16.5, IT: 14.8, ECE: 11.5, Cybersec: 13.2 }
  ];

  const departmentComparisonPieData = [
    { name: 'CSE', value: 98, fill: '#6366F1' },
    { name: 'AI & DS', value: 95, fill: '#10B981' },
    { name: 'IT', value: 92, fill: '#A855F7' },
    { name: 'ECE', value: 88, fill: '#F59E0B' },
    { name: 'Cybersec', value: 91, fill: '#06B6D4' }
  ];

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportName) return;

    const newRep = {
      id: `rep_${Date.now()}`,
      title: newReportName,
      created: new Date().toISOString().split('T')[0],
      format: 'PDF'
    };

    setSavedReports([newRep, ...savedReports]);
    setNewReportName('');
    setReportSavedAlert(true);
    setTimeout(() => setReportSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top BI Header & Perspective Bar */}
      <div className="bg-[#080808] rounded-2xl p-6 text-white border border-[#1A1A1A] shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono text-[#6366F1] uppercase tracking-wider bg-[#6366F1]/10 px-2.5 py-0.5 rounded border border-[#6366F1]/20">
                REAL-TIME BI ENGINE
              </span>
              <span className="text-xs text-[#AAA] font-medium">Enterprise Analytics v1.0</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1">Analytics & Business Intelligence</h1>
            <p className="text-xs text-[#888] mt-0.5">
              Turn raw academic, attendance, and placement data into actionable decisions
            </p>
          </div>

          {/* Perspective & Time Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#111] border border-[#222] rounded-xl p-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#666] px-2">Role View:</span>
              <button
                onClick={() => setSelectedRole('super_admin')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  selectedRole === 'super_admin' ? 'bg-[#6366F1] text-white shadow-xs' : 'text-[#888] hover:text-white'
                }`}
              >
                Super Admin
              </button>
              <button
                onClick={() => setSelectedRole('college_admin')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  selectedRole === 'college_admin' ? 'bg-[#6366F1] text-white shadow-xs' : 'text-[#888] hover:text-white'
                }`}
              >
                College Admin
              </button>
              {/* TPO role removed - placement-related */}
              <button
                onClick={() => setSelectedRole('mentor')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  selectedRole === 'mentor' ? 'bg-[#6366F1] text-white shadow-xs' : 'text-[#888] hover:text-white'
                }`}
              >
                Mentor
              </button>
            </div>

            <div className="flex items-center bg-[#111] border border-[#222] rounded-xl p-1 text-xs font-semibold">
              {(['today', 'weekly', 'monthly', 'quarterly', 'yearly'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setTimeHorizon(h)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    timeHorizon === h ? 'bg-[#222] text-white border border-[#333]' : 'text-[#777] hover:text-white'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Filter Toolbar */}
        <div className="mt-5 pt-4 border-t border-[#1A1A1A] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-[#666] block text-[9px] uppercase font-bold mb-1">Partner College</label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full p-2 bg-[#111] border border-[#222] rounded-xl text-white font-medium"
            >
              <option value="All">All Partner Colleges (5)</option>
              <option value="clg_1">St. Xavier's Institute of Tech</option>
              <option value="clg_2">Bangalore National Inst of Tech</option>
              <option value="clg_3">Delhi College of Engineering</option>
            </select>
          </div>

          <div>
            <label className="text-[#666] block text-[9px] uppercase font-bold mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2 bg-[#111] border border-[#222] rounded-xl text-white font-medium"
            >
              <option value="All">All Departments (12)</option>
              <option value="CSE">Computer Science & Eng</option>
              <option value="AIDS">AI & Data Science</option>
              <option value="IT">Information Technology</option>
              <option value="ECE">Electronics & Comm</option>
            </select>
          </div>

          <div>
            <label className="text-[#666] block text-[9px] uppercase font-bold mb-1">Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full p-2 bg-[#111] border border-[#222] rounded-xl text-white font-medium"
            >
              <option value="All">All Active Batches (24)</option>
              <option value="batch_1">Enterprise Full-Stack 2026-A</option>
              <option value="batch_2">Applied AI & ML 2026-B</option>
              <option value="batch_3">DevOps Architecture 2026-A</option>
            </select>
          </div>

          <div>
            <label className="text-[#666] block text-[9px] uppercase font-bold mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 bg-[#111] border border-[#222] rounded-xl text-white font-medium"
            >
              <option value="2026">2025 - 2026</option>
              <option value="2025">2024 - 2025</option>
              <option value="2024">2023 - 2024</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
            <button className="w-full p-2 bg-[#1A1A1A] hover:bg-[#222] text-white border border-[#333] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-[#1A1A1A] overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'executive', label: 'Executive BI', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'attendance', label: 'Attendance', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
          { id: 'academic', label: 'Academic Performance', icon: <GraduationCap className="w-3.5 h-3.5" /> },
          { id: 'placements', label: 'Placements & Funnel', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'mentors', label: 'Mentor Analytics', icon: <UserCheck className="w-3.5 h-3.5" /> },
          { id: 'financial', label: 'Financial & Revenue', icon: <CreditCard className="w-3.5 h-3.5" /> },
          { id: 'student_risk', label: 'At-Risk Alerts', icon: <AlertCircle className="w-3.5 h-3.5" />, badge: '4 Alert' },
          { id: 'ai_forecast', label: 'AI Forecasting', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'comparison', label: 'Comparison Matrix', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'report_builder', label: 'Custom Report Builder', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#6366F1] text-white shadow-md font-bold'
                : 'text-[#888] hover:text-white hover:bg-[#111]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[9px] font-bold bg-[#EF4444]/20 text-[#EF4444] px-1.5 py-0.2 rounded border border-[#EF4444]/30">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Global KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-[#1A1A1A]">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-wider block">Partner Colleges</span>
          <div className="text-lg font-extrabold text-white mt-1 font-mono">5</div>
          <span className="text-[9px] text-[#10B981] flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +100% YoY
          </span>
        </div>

        <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-[#1A1A1A]">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-wider block">Active Students</span>
          <div className="text-lg font-extrabold text-white mt-1 font-mono">1,450</div>
          <span className="text-[9px] text-[#10B981] flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +24% MoM
          </span>
        </div>

        <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-[#1A1A1A]">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-wider block">Avg Attendance</span>
          <div className="text-lg font-extrabold text-[#10B981] mt-1 font-mono">95.8%</div>
          <span className="text-[9px] text-[#10B981] flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +1.2% Target
          </span>
        </div>

        <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-[#1A1A1A]">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-wider block">Placement Rate</span>
          <div className="text-lg font-extrabold text-[#10B981] mt-1 font-mono">92.4%</div>
          <span className="text-[9px] text-[#10B981] flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> 360 Placed
          </span>
        </div>

        <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-[#1A1A1A]">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-wider block">Avg Package</span>
          <div className="text-lg font-extrabold text-[#F59E0B] mt-1 font-mono">₹14.2 LPA</div>
          <span className="text-[9px] text-[#F59E0B] flex items-center gap-0.5 mt-0.5">
            Max ₹48.0 LPA
          </span>
        </div>

        <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-[#1A1A1A]">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-wider block">Total Revenue</span>
          <div className="text-lg font-extrabold text-[#A855F7] mt-1 font-mono">₹4.85 Cr</div>
          <span className="text-[9px] text-[#A855F7] flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +18.5%
          </span>
        </div>

        <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-[#1A1A1A]">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-wider block">Pending Dues</span>
          <div className="text-lg font-extrabold text-[#EF4444] mt-1 font-mono">₹38.5 L</div>
          <span className="text-[9px] text-[#EF4444] flex items-center gap-0.5 mt-0.5">
            7.9% Collection Rate
          </span>
        </div>

        <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-[#1A1A1A]">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-wider block">Certificates Issued</span>
          <div className="text-lg font-extrabold text-white mt-1 font-mono">1,280</div>
          <span className="text-[9px] text-[#6366F1] flex items-center gap-0.5 mt-0.5">
            100% QR Verified
          </span>
        </div>
      </div>

      {/* TAB 1: EXECUTIVE BI */}
      {activeTab === 'executive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Enrollment & Revenue Trend Line Chart */}
            <div className="lg:col-span-2 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <div>
                  <h3 className="font-bold text-white text-sm">Student Enrollment vs Placement Velocity</h3>
                  <p className="text-xs text-[#777]">Monthly growth trajectory across all partner institutions</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded border border-[#10B981]/20">
                  +340 Placed YTD
                </span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyEnrollmentData}>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="month" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="students" name="Enrolled Students" stroke="#6366F1" fillOpacity={1} fill="url(#colorStudents)" />
                    <Area type="monotone" dataKey="placements" name="Students Placed" stroke="#10B981" fillOpacity={1} fill="url(#colorPlacements)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Wise Placement Share */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Department Placement Share</h3>
                <span className="text-xs text-[#AAA]">Batch 2026</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentPerformanceData}
                      dataKey="placementRate"
                      nameKey="dept"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {departmentPerformanceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 text-xs border-t border-[#1A1A1A]">
                {departmentPerformanceData.map((d, i) => (
                  <div key={d.dept} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                      <span className="text-white font-medium">{d.dept} Dept</span>
                    </div>
                    <span className="font-mono text-[#AAA]">₹{d.avgPackage} LPA Avg</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE ANALYTICS */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Trend Line Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <div>
                  <h3 className="font-bold text-white text-sm">Weekly Attendance Trend</h3>
                  <p className="text-xs text-[#777]">Average attendance over 4 consecutive weeks</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#10B981]">95.8% Global Average</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="week" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} domain={[90, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="avgAttendance" name="Avg Attendance %" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} />
                    <Line type="monotone" dataKey="onTime" name="On Time %" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance Distribution Pie Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Attendance Distribution</h3>
                <span className="text-xs text-[#AAA]">Current Month</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {attendanceDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Attendance Heatmap */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div>
                <h3 className="font-bold text-white text-sm">Weekly Attendance Heatmap (Monday - Friday)</h3>
                <p className="text-xs text-[#777]">Detect absentee patterns across 4 consecutive academic weeks</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#10B981]">95.8% Global Compliance</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider text-[#555] bg-[#080808]">
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4">Week 1</th>
                    <th className="py-3 px-4">Week 2</th>
                    <th className="py-3 px-4">Week 3</th>
                    <th className="py-3 px-4">Week 4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]">
                  {attendanceHeatmapData.map((row) => (
                    <tr key={row.day} className="hover:bg-[#111]">
                      <td className="py-3 px-4 font-bold text-white">{row.day}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-mono font-bold">
                          {row.w1}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-mono font-bold">
                          {row.w2}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-mono font-bold">
                          {row.w3}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-mono font-bold">
                          {row.w4}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC PERFORMANCE */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Academic Score Trend Line Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <div>
                  <h3 className="font-bold text-white text-sm">Academic Score Trend</h3>
                  <p className="text-xs text-[#777]">Monthly average scores and CGPA progression</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#10B981]">89% Current Avg</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={academicScoreTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="month" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} domain={[80, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="avgScore" name="Avg Score %" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} />
                    <Line type="monotone" dataKey="cgpa" name="CGPA" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grade Distribution Pie Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Grade Distribution</h3>
                <span className="text-xs text-[#AAA]">Current Semester</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Performers Leaderboard */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Top Academic Performers Leaderboard</h3>
                <span className="text-xs text-[#F59E0B] font-mono font-bold">Top 1% Class Rank</span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { rank: '#1', name: 'Rohan Mehta', usn: '1SX22CS045', dept: 'CSE', cgpa: 9.4, score: '98%', placement: 'Placed @ Microsoft (26 LPA)' },
                  { rank: '#2', name: 'Ananya Sharma', usn: '1BN22AI012', dept: 'AI & DS', cgpa: 9.3, score: '97%', placement: 'Placed @ Amazon AWS (22 LPA)' },
                  { rank: '#3', name: 'Vikramaditya Rao', usn: '1DC22IT088', dept: 'IT', cgpa: 9.1, score: '95%', placement: 'Placed @ Goldman Sachs (20 LPA)' },
                  { rank: '#4', name: 'Priya Nair', usn: '1HT22ECE019', dept: 'ECE', cgpa: 8.9, score: '94%', placement: 'Shortlisted @ Google' }
                ].map((st) => (
                  <div key={st.rank} className="p-3 bg-[#111] rounded-xl border border-[#222] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] font-bold flex items-center justify-center font-mono">
                        {st.rank}
                      </span>
                      <div>
                        <h4 className="font-bold text-white">{st.name}</h4>
                        <p className="text-[11px] text-[#777]">{st.dept} • {st.usn} • CGPA: {st.cgpa}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded border border-[#10B981]/20">
                      {st.placement}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Subject Scores */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Department Assessment Averages</h3>
                <span className="text-xs text-[#AAA]">Batch 2026 Benchmark</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="dept" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="avgScore" name="Avg Score %" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="attendance" name="Attendance %" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: PLACEMENTS & FUNNEL */}
      {activeTab === 'placements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Placement Trend Line Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <div>
                  <h3 className="font-bold text-white text-sm">Placement Offers Trend</h3>
                  <p className="text-xs text-[#777]">Monthly placement offers and average package progression</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#10B981]">340 Offers YTD</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={placementTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="month" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="offers" name="Offers" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} />
                    <Line type="monotone" dataKey="avgPackage" name="Avg Package (LPA)" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Package Distribution Pie Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Package Distribution</h3>
                <span className="text-xs text-[#AAA]">Current Year</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={placementPackageDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {placementPackageDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Placement Funnel Chart */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div>
                <h3 className="font-bold text-white text-sm">Campus Recruitment Conversion Funnel</h3>
                <p className="text-xs text-[#777]">Stage-by-stage progression from eligible candidates to accepted offers</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded border border-[#10B981]/20">
                94.7% Offer Acceptance Rate
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 pt-2">
              {placementFunnelData.map((fn, idx) => (
                <div key={fn.stage} className="p-3 bg-[#111] rounded-xl border border-[#222] text-center space-y-1">
                  <span className="text-[9px] font-bold uppercase text-[#666] block truncate">{fn.stage}</span>
                  <div className="text-lg font-extrabold font-mono text-white">{fn.count}</div>
                  <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{ width: `${(fn.count / 1200) * 100}%`, backgroundColor: fn.fill }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Hiring Table */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <h3 className="font-bold text-white text-sm">Top Recruiting Partner Performance</h3>
              <span className="text-xs text-[#AAA]">50+ Active Recruiting Partners</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider text-[#555] bg-[#080808]">
                    <th className="py-3 px-4">Recruiting Company</th>
                    <th className="py-3 px-4">Students Hired</th>
                    <th className="py-3 px-4">Highest Package</th>
                    <th className="py-3 px-4">Average Package</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]">
                  {topRecruitersData.map((rec) => (
                    <tr key={rec.company} className="hover:bg-[#111]">
                      <td className="py-3 px-4 font-bold text-white">{rec.company}</td>
                      <td className="py-3 px-4 font-mono text-[#10B981] font-bold">{rec.hires} Students</td>
                      <td className="py-3 px-4 font-mono text-white">₹{rec.highestPackage} LPA</td>
                      <td className="py-3 px-4 font-mono text-white">₹{rec.avgPackage} LPA</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                          Active Drive
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: MENTOR ANALYTICS */}
      {activeTab === 'mentors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Mentor Rating Distribution Pie Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Mentor Rating Distribution</h3>
                <span className="text-xs text-[#AAA]">28 Active Mentors</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mentorRatingDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {mentorRatingDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mentor Workload Bar Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Mentor Workload Analysis</h3>
                <span className="text-xs text-[#AAA]">Hours vs Students</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mentorWorkloadData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="mentor" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="hours" name="Grading Hours" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="students" name="Students" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Mentor Performance Table */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <h3 className="font-bold text-white text-sm">Faculty & Mentor Performance Scorecard</h3>
              <span className="text-xs text-[#AAA]">28 Active Mentors</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider text-[#555] bg-[#080808]">
                    <th className="py-3 px-4">Mentor Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Attendance Log SLA</th>
                    <th className="py-3 px-4">Avg Grading Time</th>
                    <th className="py-3 px-4">Student Rating</th>
                    <th className="py-3 px-4">Assigned Batches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]">
                  {mentorPerformanceData.map((m) => (
                    <tr key={m.name} className="hover:bg-[#111]">
                      <td className="py-3 px-4 font-bold text-white">{m.name}</td>
                      <td className="py-3 px-4 text-[#AAA]">{m.dept}</td>
                      <td className="py-3 px-4 font-mono text-[#10B981] font-bold">{m.attendanceSla}%</td>
                      <td className="py-3 px-4 font-mono text-white">{m.gradingHrs} Hours</td>
                      <td className="py-3 px-4 font-mono text-[#F59E0B] font-bold">★ {m.feedbackRating} / 5.0</td>
                      <td className="py-3 px-4 text-[#AAA]">{m.batchCount} Active Batches</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FINANCIAL & REVENUE */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <div>
                  <h3 className="font-bold text-white text-sm">Monthly Revenue & Collection Dynamics</h3>
                  <p className="text-xs text-[#777]">Tuition fees, corporate sponsorships, and college subscriptions</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#A855F7] bg-[#A855F7]/10 px-2.5 py-0.5 rounded border border-[#A855F7]/20">
                  ₹1.48 Cr Jul Collection
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyEnrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="month" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="revenue" name="Revenue (Lakhs ₹)" fill="#A855F7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Revenue Breakdown</h3>
                <span className="text-xs text-[#AAA]">Current Month</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueBreakdownData}
                      dataKey="amount"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {revenueBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <h3 className="font-bold text-white text-sm pb-2 border-b border-[#1A1A1A]">Fee Collection Health</h3>
              <div className="p-4 rounded-xl bg-[#111] border border-[#222] space-y-2">
                <span className="text-[10px] text-[#888] uppercase font-bold block">Total Fee Receivable</span>
                <div className="text-xl font-bold font-mono text-white">₹5.23 Cr</div>
                <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#10B981] h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
                <p className="text-[11px] text-[#10B981] pt-1">92.1% Collected (₹4.85 Cr)</p>
              </div>

              <div className="p-4 rounded-xl bg-[#111] border border-[#222] space-y-2">
                <span className="text-[10px] text-[#888] uppercase font-bold block">Outstanding Dues</span>
                <div className="text-xl font-bold font-mono text-[#EF4444]">₹38.5 L</div>
                <p className="text-[11px] text-[#888]">124 Students with pending installments</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 7: AT-RISK ALERTS */}
      {activeTab === 'student_risk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Risk Category Distribution Pie Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Risk Category Distribution</h3>
                <span className="text-xs text-[#AAA]">1,450 Students</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskCategoryDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
                    >
                      {riskCategoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Trend Line Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <div>
                  <h3 className="font-bold text-white text-sm">Risk Trend Over Time</h3>
                  <p className="text-xs text-[#777]">Monthly risk category progression</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#EF4444]">4 High Risk</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={riskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="month" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="highRisk" name="High Risk" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
                    <Line type="monotone" dataKey="mediumRisk" name="Medium Risk" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} />
                    <Line type="monotone" dataKey="lowRisk" name="Low Risk" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* At-Risk Students List */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div>
                <h3 className="font-bold text-white text-sm">Automated Student Early Warning System</h3>
                <p className="text-xs text-[#777]">Students flagged below thresholds (&lt;75% Attendance or low assessment scores)</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#EF4444] bg-[#EF4444]/10 px-2.5 py-0.5 rounded border border-[#EF4444]/20">
                4 High Risk Students
              </span>
            </div>

            <div className="space-y-3">
              {atRiskStudents.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-[#111] border border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                        {s.riskLevel} Risk
                      </span>
                      <h4 className="font-bold text-white text-sm">{s.name}</h4>
                      <span className="text-[#AAA] font-mono">({s.usn})</span>
                    </div>
                    <p className="text-[#888] mt-1">{s.reason}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-[#AAA]">
                      <span>Attendance: <strong className="text-[#EF4444]">{s.attendance}%</strong></span>
                      <span>Assignment Score: <strong className="text-[#F59E0B]">{s.assignmentScore}%</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button className="px-3.5 py-1.5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-xs">
                      Notify Mentor
                    </button>
                    <button className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#222] text-white border border-[#333] rounded-xl font-semibold">
                      Schedule Counseling
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AI FORECASTING */}
      {activeTab === 'ai_forecast' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Forecast Accuracy Bar Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                  <h3 className="font-bold text-white text-sm">Forecast Accuracy Analysis</h3>
                </div>
                <span className="text-xs text-[#F59E0B] font-mono font-bold">97.5% Avg Accuracy</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastAccuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="metric" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} domain={[90, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="accuracy" name="Accuracy %" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Forecast Confidence Pie Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Forecast Confidence Distribution</h3>
                <span className="text-xs text-[#AAA]">Model Reliability</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={forecastConfidenceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {forecastConfidenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Forecast Summary Cards */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-bold text-white text-base">Machine Learning Predictive Analytics</h3>
              </div>
              <span className="text-xs text-[#F59E0B] font-mono font-bold">12-Month AI Forecast Engine</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#111] rounded-2xl border border-[#222] space-y-2">
                <span className="text-[10px] text-[#888] uppercase font-bold block">Placement Rate Forecast</span>
                <div className="text-2xl font-extrabold text-[#10B981] font-mono">94.8% Projected</div>
                <p className="text-[#AAA] text-[11px]">Predicted +2.4% increase due to new cloud microservices curriculum adoption.</p>
              </div>

              <div className="p-4 bg-[#111] rounded-2xl border border-[#222] space-y-2">
                <span className="text-[10px] text-[#888] uppercase font-bold block">Student Growth Forecast</span>
                <div className="text-2xl font-extrabold text-[#6366F1] font-mono">1,820 Students</div>
                <p className="text-[#AAA] text-[11px]">Estimated +25.5% expansion across 2 new partner engineering colleges in Q4.</p>
              </div>

              <div className="p-4 bg-[#111] rounded-2xl border border-[#222] space-y-2">
                <span className="text-[10px] text-[#888] uppercase font-bold block">Revenue Forecast</span>
                <div className="text-2xl font-extrabold text-[#A855F7] font-mono">₹6.20 Cr FY27</div>
                <p className="text-[#AAA] text-[11px]">Based on current enrollment velocity and corporate placement fee contracts.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: COMPARISON MATRIX */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Department Comparison Bar Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Department Performance Comparison</h3>
                <span className="text-xs text-[#AAA]">Multi-Metric Analysis</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="dept" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="attendance" name="Attendance %" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="avgScore" name="Avg Score %" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="placementRate" name="Placement Rate %" fill="#A855F7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Placement Rate Pie Chart */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <h3 className="font-bold text-white text-sm">Department Placement Share</h3>
                <span className="text-xs text-[#AAA]">Placement Rate Distribution</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentComparisonPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {departmentComparisonPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <h3 className="font-bold text-white text-sm">Cross-Departmental Performance Matrix</h3>
              <span className="text-xs text-[#AAA]">Batch 2026 Cohort</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider text-[#555] bg-[#080808]">
                    <th className="py-3 px-4">Department Name</th>
                    <th className="py-3 px-4">Attendance %</th>
                    <th className="py-3 px-4">Assessment Avg</th>
                    <th className="py-3 px-4">Placement Rate</th>
                    <th className="py-3 px-4">Avg Package (LPA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]">
                  {departmentPerformanceData.map((d) => (
                    <tr key={d.dept} className="hover:bg-[#111]">
                      <td className="py-3 px-4 font-bold text-white">{d.dept} Department</td>
                      <td className="py-3 px-4 font-mono text-[#10B981] font-bold">{d.attendance}%</td>
                      <td className="py-3 px-4 font-mono text-white">{d.avgScore}%</td>
                      <td className="py-3 px-4 font-mono text-[#10B981] font-bold">{d.placementRate}%</td>
                      <td className="py-3 px-4 font-mono text-[#F59E0B] font-bold">₹{d.avgPackage} LPA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: CUSTOM REPORT BUILDER */}
      {activeTab === 'report_builder' && (
        <div className="space-y-6">
          
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
              <div>
                <h3 className="text-base font-bold text-white">Custom Business Intelligence Report Builder</h3>
                <p className="text-xs text-[#888]">Select metrics, apply filters, preview data, and export to PDF, Excel, or CSV</p>
              </div>
            </div>

            {reportSavedAlert && (
              <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Custom report configuration saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveReport} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Report Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q3 Placement & Salary Audit Report"
                    value={newReportName}
                    onChange={(e) => setNewReportName(e.target.value)}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Primary Metric</label>
                  <select className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white">
                    <option value="placement">Placement Rate & CTC Distribution</option>
                    <option value="attendance">Student Attendance & Absentee Trends</option>
                    <option value="academic">Assessment Scores & Assignment SLA</option>
                    <option value="revenue">Financial Revenue & Collection Health</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Export Format</label>
                  <select className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white">
                    <option value="pdf">PDF Report (Print Optimized)</option>
                    <option value="excel">Excel Spreadsheet (.xlsx)</option>
                    <option value="csv">CSV Raw Data (.csv)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Save Report Query
                </button>
                <button
                  type="button"
                  onClick={() => alert('Exporting report data...')}
                  className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-md flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Instant Export
                </button>
              </div>
            </form>

            {/* Saved Reports List */}
            <div className="pt-6 border-t border-[#1A1A1A] space-y-3">
              <h4 className="font-bold text-white text-sm">Saved Custom Reports & Scheduled Deliveries</h4>
              <div className="space-y-3">
                {savedReports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-xl bg-[#111] border border-[#222] flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-white text-sm">{rep.title}</h5>
                      <span className="text-[#777] text-[11px]">Created on {rep.created} • Format: {rep.format}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-[#1A1A1A] hover:bg-[#222] text-white rounded-xl border border-[#333]">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-2 bg-[#1A1A1A] hover:bg-[#222] text-white rounded-xl border border-[#333]">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
