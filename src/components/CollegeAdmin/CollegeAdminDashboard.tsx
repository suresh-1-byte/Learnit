import React, { useState } from 'react';
import { Department, Batch, Student, Mentor } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { mockSubmissions, mockPaymentTransactions } from '../../mockData';
import {
  Building2,
  Users,
  GraduationCap,
  CheckCircle,
  CreditCard,
  Plus,
  Search,
  Filter,
  UserCheck,
  ChevronRight,
  Sparkles,
  BookOpen,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  AlertCircle,
  Calendar,
  TrendingUp,
  Award,
  Briefcase,
  Bell,
  BarChart3,
  ShieldCheck,
  FileCheck,
  Layers,
  ArrowRight,
  Download,
  Send,
  RefreshCw,
  CheckSquare,
  Bookmark,
  Radio,
  UserPlus,
  Zap,
  Eye,
  Edit,
  ChevronDown,
  Check,
  MoreVertical,
  Sliders,
  AlertTriangle,
  Building,
  FileSpreadsheet,
  Globe
} from 'lucide-react';

interface CollegeAdminDashboardProps {
  collegeId?: string;
  onNavigateToAttendance?: () => void;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export const CollegeAdminDashboard: React.FC<CollegeAdminDashboardProps> = ({
  collegeId = 'clg_1',
  onNavigateToAttendance,
  activeTab = 'dashboard',
  onSelectTab
}) => {
  const { theme } = useTheme();
  const college: any = { id: collegeId, name: '', code: '', location: '', state: '', logo: '', contractStatus: 'Active', planTier: 'Enterprise', joinedDate: '', totalDepartments: 0, totalStudents: 0, totalMentors: 0, placementRate: 0, annualFee: 0, contactPerson: '', contactEmail: '' };
  const [departments, setDepartments] = useState<Department[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors] = useState<Mentor[]>([]);

  // Sub tab navigation inside dashboard or sync with activeTab
  const currentTab = activeTab || 'dashboard';

  // State for search and filters
  const [studentSearch, setStudentSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [feeFilter, setFeeFilter] = useState<'All' | 'Paid' | 'Pending' | 'Partial'>('All');
  const [attendanceFilter, setAttendanceFilter] = useState<'All' | 'High' | 'Low'>('All');

  // Toggle Right Insight Panel
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Modals & Drawers
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [showQuickCreateMenu, setShowQuickCreateMenu] = useState(false);

  // Selected Detail Drawers
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [selectedMentorDetail, setSelectedMentorDetail] = useState<Mentor | null>(null);
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<any>(null);

  // New department state
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newHodName, setNewHodName] = useState('');

  // New student state
  const [newStdName, setNewStdName] = useState('');
  const [newStdRoll, setNewStdRoll] = useState('');
  const [newStdEmail, setNewStdEmail] = useState('');
  const [newStdDept, setNewStdDept] = useState(departments[0]?.name || 'CSE');

  // Broadcast Announcement State
  const [announcementMsg, setAnnouncementMsg] = useState({ title: '', body: '', target: 'All Students', priority: 'Normal' });

  // Programs Mock Data
  const [programsList] = useState([
    { id: 'prg-1', code: 'FS-2026', name: 'Full-Stack Software Engineering', dept: 'Computer Science', duration: '6 Months', enrolled: 280, status: 'Active', mentor: 'Dr. Rajesh Kumar' },
    { id: 'prg-2', code: 'AI-2026', name: 'Applied AI & LLM Systems', dept: 'AI & Data Science', duration: '6 Months', enrolled: 220, status: 'Active', mentor: 'Prof. Ananya Desai' },
    { id: 'prg-3', code: 'DEVOPS-2026', name: 'Cloud DevOps & Infrastructure', dept: 'Information Tech', duration: '4 Months', enrolled: 180, status: 'Active', mentor: 'Sanjay Mehta' },
    { id: 'prg-4', code: 'PM-2026', name: 'Tech Product Management', dept: 'Electronics & Comm', duration: '4 Months', enrolled: 140, status: 'Active', mentor: 'Meera Iyer' },
  ]);

  // Announcements List
  const [announcementsList, setAnnouncementsList] = useState([
    { id: 'anc-1', title: 'Mid-Term Assessment Schedule Released', body: 'Fall semester theory and coding assessments will commence on August 12, 2026.', date: 'Aug 03, 2026', pinned: true, target: 'All Students & Mentors' },
    { id: 'anc-2', title: 'Amazon AWS Campus Recruitment Drive', body: 'Pre-placement talk scheduled for Friday 10:00 AM at St. Xavier Auditorium.', date: 'Aug 02, 2026', pinned: true, target: 'Final Year Students' },
    { id: 'anc-3', title: 'Attendance QR Code Policy Reminder', body: 'Roll call must be scanned within the first 15 minutes of each lab session.', date: 'Jul 28, 2026', pinned: false, target: 'All Mentors' },
  ]);

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.departmentName.includes(deptFilter) || s.departmentId === deptFilter;
    const matchesFee = feeFilter === 'All' || s.feeStatus === feeFilter;
    const matchesAttendance = attendanceFilter === 'All' ||
      (attendanceFilter === 'High' ? s.attendancePct >= 90 : s.attendancePct < 75);
    return matchesSearch && matchesDept && matchesFee && matchesAttendance;
  });

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;

    const newDept: Department = {
      id: `dept_${Date.now()}`,
      collegeId: college.id,
      name: newDeptName,
      code: newDeptCode.toUpperCase(),
      headOfDepartment: newHodName || 'Dr. Academic HOD',
      totalBatches: 2,
      totalStudents: 120
    };

    setDepartments([...departments, newDept]);
    setShowAddDeptModal(false);
    setNewDeptName('');
    setNewDeptCode('');
    setNewHodName('');
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName || !newStdRoll) return;

    const newStudent: Student = {
      id: `std_${Date.now()}`,
      name: newStdName,
      rollNumber: newStdRoll,
      email: newStdEmail || `${newStdRoll.toLowerCase()}@student.stxavier.edu`,
      phone: '+91 98000 00000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      collegeId: college.id,
      collegeName: college.name,
      departmentId: 'dept_1',
      departmentName: newStdDept,
      batchId: 'batch_1',
      batchName: 'BATCH-2026-CSE-ALPHA',
      cgpa: 8.50,
      attendancePct: 95.0,
      feeStatus: 'Paid',
      placementStatus: 'In Process',
      skills: ['Full Stack', 'Problem Solving']
    };

    setStudents([newStudent, ...students]);
    setShowAddStudentModal(false);
    setNewStdName('');
    setNewStdRoll('');
    setNewStdEmail('');
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementMsg.title || !announcementMsg.body) return;

    const newAnc = {
      id: `anc_${Date.now()}`,
      title: announcementMsg.title,
      body: announcementMsg.body,
      date: 'Today',
      pinned: false,
      target: announcementMsg.target
    };

    setAnnouncementsList([newAnc, ...announcementsList]);
    setShowBroadcastModal(false);
    setAnnouncementMsg({ title: '', body: '', target: 'All Students', priority: 'Normal' });
  };

  /* ========================================================================== */
  /* RENDER DASHBOARD MAIN VIEW                                                 */
  /* ========================================================================== */
  const renderDashboardOverview = () => (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Main Workspace Area */}
      <div className="flex-1 space-y-6 min-w-0">
        
        {/* TOP BANNER */}
        <div className={`rounded-2xl p-6 border shadow-lg relative overflow-hidden transition-all duration-250 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0E] text-white border-[rgba(255,255,255,0.08)]' 
            : 'bg-white text-gray-900 border-[rgba(0,0,0,0.06)]'
        }`}>
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src={college.logo}
                alt={college.name}
                className={`w-16 h-16 rounded-2xl object-cover border shadow-md shrink-0 transition-all duration-250 ${
                  theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
                }`}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold text-[#6366F1] uppercase tracking-[0.2em] bg-[#6366F1]/10 px-2 py-0.5 rounded-md border border-[#6366F1]/20">
                    {college.code} • Campus HQ
                  </span>
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>{college.location}, {college.state}</span>
                </div>
                <h1 className={`text-2xl font-black tracking-tight mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Good Morning, Admin Team</h1>
                <p className={`text-xs mt-0.5 ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  <span className={`font-semibold ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                  }`}>{college.name}</span> • Academic Year 2025–26 • Fall Semester (Sem VII)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all duration-250 hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-4 h-4" /> Enroll Student
              </button>

              <button
                onClick={() => setShowBroadcastModal(true)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-250 hover:-translate-y-0.5 shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-[#111] hover:bg-[#181818] text-white border-[rgba(255,255,255,0.08)] hover:shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-[rgba(0,0,0,0.06)] hover:shadow-md'
                }`}
              >
                <Bell className="w-4 h-4 text-[#A855F7]" /> Broadcast
              </button>


              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className={`p-2 rounded-xl text-xs font-medium transition-all duration-250 hover:-translate-y-0.5 shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-[#111] hover:bg-[#181818] text-[#888] hover:text-white border-[rgba(255,255,255,0.08)] hover:shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border-[rgba(0,0,0,0.06)] hover:shadow-md'
                }`}
                title="Toggle Right Insight Panel"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: TODAY'S OVERVIEW (6 PILL METRICS) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-xs font-bold uppercase tracking-[0.2em] ${
              theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
            }`}>Today's Training Operations</h2>
            <span className="text-[11px] text-[#10B981] font-mono font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" /> Live Class Synchronization Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className={`p-3.5 rounded-2xl border text-center transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(99,102,241,0.2)]'
            }`}>
              <span className={`text-[10px] font-semibold block uppercase tracking-wider ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Total Students</span>
              <div className={`text-xl font-black font-mono mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{students.length}</div>
              <span className="text-[10px] text-[#6366F1] font-medium">Enrolled</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
            }`}>
              <span className={`text-[10px] font-semibold block uppercase tracking-wider ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Attendance</span>
              <div className="text-xl font-black text-[#10B981] font-mono mt-1">{Math.round(students.reduce((acc, s) => acc + s.attendancePct, 0) / students.length)}%</div>
              <span className="text-[10px] text-[#10B981] font-medium">Avg Rate</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(59,130,246,0.2)]'
            }`}>
              <span className={`text-[10px] font-semibold block uppercase tracking-wider ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Mentors</span>
              <div className="text-xl font-black text-[#3B82F6] font-mono mt-1">{mentors.length}</div>
              <span className="text-[10px] text-[#3B82F6] font-medium">Active</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(99,102,241,0.2)]'
            }`}>
              <span className={`text-[10px] font-semibold block uppercase tracking-wider ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Departments</span>
              <div className={`text-xl font-black font-mono mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{departments.length}</div>
              <span className={`text-[10px] font-medium ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Programs</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(168,85,247,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(168,85,247,0.2)]'
            }`}>
              <span className={`text-[10px] font-semibold block uppercase tracking-wider ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Batches</span>
              <div className={`text-xl font-black font-mono mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{batches.length}</div>
              <span className={`text-[10px] font-medium ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Active</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
            }`}>
              <span className={`text-[10px] font-semibold block uppercase tracking-wider ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Certificates</span>
              <div className="text-xl font-black text-[#10B981] font-mono mt-1">0</div>
              <span className="text-[10px] text-[#10B981] font-medium">Issued</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: 8-KPI GRID */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-xs font-bold uppercase tracking-[0.2em] ${
              theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
            }`}>Institutional Core KPIs</h2>
            <span className="text-[11px] text-[#6366F1] font-mono font-semibold">Real-Time Data Sync</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* KPI 1: Total Students */}
            <div className={`p-4 rounded-2xl border hover:border-[#2A2A2A] transition-all group ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#2A2A2A]' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Enrolled Students</span>
                <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{students.length}</div>
                <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">+18.2% YoY</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                theme === 'dark' ? 'border-[#141414] text-[#666]' : 'border-gray-200 text-[#64748B]'
              }`}>
                <span>Across {departments.length} Depts</span>
                <button onClick={() => onSelectTab?.('students')} className="text-[#6366F1] font-semibold hover:underline flex items-center gap-0.5">
                  Roster <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* KPI 2: Active Mentors */}
            <div className={`p-4 rounded-2xl border hover:border-[#2A2A2A] transition-all group ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#2A2A2A]' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Active Mentors</span>
                <div className="p-2 rounded-xl bg-[#A855F7]/10 text-[#A855F7]">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{mentors.length}</div>
                <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">100% Assigned</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                theme === 'dark' ? 'border-[#141414] text-[#666]' : 'border-gray-200 text-[#64748B]'
              }`}>
                <span>Avg Rating: 4.7/5.0</span>
                <button onClick={() => onSelectTab?.('mentors')} className="text-[#A855F7] font-semibold hover:underline flex items-center gap-0.5">
                  Mentors <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* KPI 3: Tech Programs */}
            <div className={`p-4 rounded-2xl border hover:border-[#2A2A2A] transition-all group ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#2A2A2A]' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Tech Programs</span>
                <div className="p-2 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{departments.length}</div>
                <span className="text-[10px] text-[#3B82F6] font-bold bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">Industry Aligned</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                theme === 'dark' ? 'border-[#141414] text-[#666]' : 'border-gray-200 text-[#64748B]'
              }`}>
                <span>Full-Stack, AI, DevOps</span>
                <button onClick={() => onSelectTab?.('programs')} className="text-[#3B82F6] font-semibold hover:underline flex items-center gap-0.5">
                  Programs <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* KPI 4: Active Batches */}
            <div className={`p-4 rounded-2xl border hover:border-[#2A2A2A] transition-all group ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#2A2A2A]' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Active Batches</span>
                <div className="p-2 rounded-xl bg-[#10B981]/10 text-[#10B981]">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{batches.length}</div>
                <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">On Schedule</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                theme === 'dark' ? 'border-[#141414] text-[#666]' : 'border-gray-200 text-[#64748B]'
              }`}>
                <span>Avg {Math.round(students.length / batches.length)} stds/batch</span>
                <button onClick={() => onSelectTab?.('batches')} className="text-[#10B981] font-semibold hover:underline flex items-center gap-0.5">
                  Batches <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* KPI 5: Attendance % */}
            <div className={`p-4 rounded-2xl border hover:border-[#2A2A2A] transition-all group ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#2A2A2A]' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Attendance %</span>
                <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{Math.round(students.reduce((acc, s) => acc + s.attendancePct, 0) / students.length)}%</div>
                <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">+2.1% W/W</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                theme === 'dark' ? 'border-[#141414] text-[#666]' : 'border-gray-200 text-[#64748B]'
              }`}>
                <span>0 Records</span>
                <button onClick={() => onSelectTab?.('attendance')} className="text-[#6366F1] font-semibold hover:underline flex items-center gap-0.5">
                  Audit <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* KPI 6: Assignment Completion */}
            <div className={`p-4 rounded-2xl border hover:border-[#2A2A2A] transition-all group ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#2A2A2A]' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Assignments</span>
                <div className="p-2 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>0</div>
                <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">Graded</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                theme === 'dark' ? 'border-[#141414] text-[#666]' : 'border-gray-200 text-[#64748B]'
              }`}>
                <span>85% On Time</span>
                <button onClick={() => onSelectTab?.('assignments')} className="text-[#F59E0B] font-semibold hover:underline flex items-center gap-0.5">
                  Submissions <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* KPI 7: Assessments */}
            <div className={`p-4 rounded-2xl border hover:border-[#2A2A2A] transition-all group ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#2A2A2A]' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Assessments</span>
                <div className="p-2 rounded-xl bg-[#10B981]/10 text-[#10B981]">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className="text-2xl font-black text-[#10B981] font-mono">0</div>
                <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">Completed</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                theme === 'dark' ? 'border-[#141414] text-[#666]' : 'border-gray-200 text-[#64748B]'
              }`}>
                <span>78% Avg Score</span>
                <button onClick={() => onSelectTab?.('assessments')} className="text-[#10B981] font-semibold hover:underline flex items-center gap-0.5">
                  Results <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: ACTION CENTER (OPERATIONAL ALERT GRID) */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#EF4444]" />
              <h3 className={`text-sm font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Action Center — Items Requiring Approval & Action</h3>
            </div>
            <span className="text-[11px] text-[#EF4444] font-mono font-bold bg-[#EF4444]/10 px-2.5 py-0.5 rounded-full border border-[#EF4444]/20">
              6 Active Operational Tasks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">Critical Priority</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Attendance</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{students.filter(s => s.attendancePct < 75).length} Students Below 75% Attendance</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Flagged for roll call deficit in CSE and ECE departments.</p>
              <button onClick={() => onSelectTab?.('students')} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Issue Warnings
              </button>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">Medium Priority</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Assignments</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{mockSubmissions.filter(s => s.status === 'Submitted').length} Assignments Pending Review</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Applied AI capstone submissions waiting mentor evaluation.</p>
              <button onClick={() => onSelectTab?.('assignments')} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Review Submissions
              </button>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">Medium Priority</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Placements</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{students.filter(s => s.cgpa >= 8.5).length} Candidates Eligible for Placement Drive</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Pre-placement talk scheduled for Friday.</p>
              <button onClick={() => onSelectTab?.('placements')} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Verify Eligibility List
              </button>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">Low Priority</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Mentors</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{mentors.filter(m => m.rating >= 4.8).length} Top-Rated Mentors Pending Recognition</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Mentors with exceptional performance this semester.</p>
              <button onClick={() => onSelectTab?.('mentors')} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Nudge Mentors
              </button>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">Medium Priority</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Fee Collection</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>₹{(mockPaymentTransactions.filter(p => p.status === 'Processing').reduce((acc, p) => acc + p.amount, 0) / 100000).toFixed(2)} Lakhs Tuition Fees Due</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>{mockPaymentTransactions.filter(p => p.status === 'Processing').length} students pending Q3 installment settlement.</p>
              <button onClick={() => onSelectTab?.('fees')} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Send Fee Reminders
              </button>
            </div>

          </div>
        </div>

        {/* SECTION 4: TODAY'S SCHEDULE (TIMELINE VIEW) */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6366F1]" />
              <h3 className={`text-sm font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Today's Class Schedule & Room Allocations</h3>
            </div>
            <span className={`text-[10px] font-mono ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>{batches.length} Batches Active</span>
          </div>

          <div className="space-y-3">
            {[
              { time: '09:00 AM - 11:00 AM', title: 'Full-Stack React Architecture & Redux State', mentor: 'Dr. Rajesh Kumar', batch: 'FS-2026-A', room: 'Lab 402 (Software Lab)', status: 'Completed', statusCol: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' },
              { time: '11:15 AM - 01:15 PM', title: 'Applied AI: Fine-tuning Open-Source LLMs', mentor: 'Prof. Ananya Desai', batch: 'AI-2026-B', room: 'Online (Zoom Room 1)', status: 'Live Now', statusCol: 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20 animate-pulse' },
              { time: '02:00 PM - 04:00 PM', title: 'Cloud DevOps: Kubernetes & Container Orchestration', mentor: 'Sanjay Mehta', batch: 'DEVOPS-2026-A', room: 'Seminar Hall B', status: 'Upcoming', statusCol: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' },
              { time: '04:15 PM - 06:00 PM', title: 'Product Architecture & Microservices Design', mentor: 'Meera Iyer', batch: 'PM-2026-A', room: 'Innovation Center', status: 'Upcoming', statusCol: 'bg-[#888]/10 text-[#AAA] border-[#333]' },
            ].map((item, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#333] transition-all ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222] hover:border-[#333]' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold shrink-0 ${
                    theme === 'dark' 
                      ? 'bg-[#181818] border-[#262626] text-[#DDD]' 
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}>
                    {item.time}
                  </div>
                  <div>
                    <h4 className={`font-bold text-xs ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{item.title}</h4>
                    <p className={`text-[11px] mt-0.5 ${
                      theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                    }`}>
                      Mentor: <strong className={theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'}>{item.mentor}</strong> • Batch: <span className="font-mono text-[#6366F1]">{item.batch}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 text-xs">
                  <span className={`text-[11px] font-mono ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>{item.room}</span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${item.statusCol}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 & 7: RECENT ACTIVITY STREAM & MENTOR PERFORMANCE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section 5: Recent Activity */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#A855F7]" />
                <h3 className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Recent Operations Stream</h3>
              </div>
              <span className={`text-[10px] font-mono ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Newest First</span>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Placement Applied', desc: 'Rohan Verma shortlisted for Microsoft SDE-1 (28.5 LPA)', time: '10 mins ago', type: 'placement' },
                { title: 'Attendance Submitted', desc: 'Batch FS-2026-A marked 98% present by Dr. Rajesh Kumar', time: '25 mins ago', type: 'attendance' },
                { title: 'Assignment Uploaded', desc: '58 submissions received for System Architecture Capstone', time: '1 hr ago', type: 'assignment' },
                { title: 'Certificate Signed', desc: 'Cryptographic hash issued for 42 Full-Stack graduates', time: '2 hrs ago', type: 'certificate' },
                { title: 'Student Registered', desc: 'Aditya Sharma enrolled in AI & Data Science Dept', time: '3 hrs ago', type: 'student' }
              ].map((act, i) => (
                <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors text-xs ${
                  theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-[#6366F1] mt-1.5 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{act.title}</strong>
                      <span className={`text-[10px] font-mono ${
                        theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                      }`}>{act.time}</span>
                    </div>
                    <p className={`text-[11px] mt-0.5 truncate ${
                      theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                    }`}>{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Mentor Performance */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#3B82F6]" />
                <h3 className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Mentor Performance Metrics</h3>
              </div>
              <button onClick={() => onSelectTab?.('mentors')} className="text-xs text-[#3B82F6] font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {mentors.map((m) => (
                <div key={m.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#222]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className={`w-9 h-9 rounded-xl object-cover border shrink-0 ${
                      theme === 'dark' ? 'border-[#333]' : 'border-gray-300'
                    }`} />
                    <div>
                      <h4 className={`font-bold text-xs ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{m.name}</h4>
                      <p className={`text-[10px] ${
                        theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                      }`}>{m.specialization}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-right">
                    <div>
                      <span className="text-[#10B981] font-mono font-bold block">99.2% Roll Call</span>
                      <span className="text-[#F59E0B] font-bold">★ {m.rating} Rating</span>
                    </div>
                    <button onClick={() => setSelectedMentorDetail(m)} className={`p-1.5 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-[#181818] text-[#AAA] hover:text-white border-[#262626]' 
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900 border-gray-300'
                    }`}>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 8 & 9: PLACEMENTS OVERVIEW & ANNOUNCEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section 8: Placement Overview */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#10B981]" />
                <h3 className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Campus Placement Pipeline</h3>
              </div>
              <span className="text-[11px] text-[#10B981] font-bold font-mono">98.4% Placement Rate</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className={`p-3 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`block text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Ready Students</span>
                <strong className={`text-base font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>340 / 350</strong>
              </div>
              <div className={`p-3 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`block text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Upcoming Drives</span>
                <strong className="text-[#3B82F6] text-base font-mono">5 Companies</strong>
              </div>
              <div className={`p-3 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`block text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Highest Offer</span>
                <strong className="text-[#10B981] text-base font-mono">28.5 LPA</strong>
              </div>
              <div className={`p-3 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`block text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Average CTC</span>
                <strong className="text-[#F59E0B] text-base font-mono">14.2 LPA</strong>
              </div>
            </div>

            <button onClick={() => onSelectTab?.('placements')} className={`w-full py-2 text-xs font-semibold rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
            }`}>
              Open Placement Portal →
            </button>
          </div>

          {/* Section 9: Announcements */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#EC4899]" />
                <h3 className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Institutional Announcements</h3>
              </div>
              <button onClick={() => setShowBroadcastModal(true)} className="px-2.5 py-1 bg-[#6366F1] text-white text-[11px] font-bold rounded-lg">
                + Create
              </button>
            </div>

            <div className="space-y-2.5">
              {announcementsList.map((anc) => (
                <div key={anc.id} className={`p-3 rounded-xl border space-y-1 ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#222]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#EC4899] bg-[#EC4899]/10 px-2 py-0.5 rounded">{anc.target}</span>
                    <span className={`font-mono ${
                      theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                    }`}>{anc.date}</span>
                  </div>
                  <h4 className={`font-bold text-xs ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{anc.title}</h4>
                  <p className={`text-[11px] ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>{anc.body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT INSIGHT PANEL */}
      {showRightPanel && (
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Admin Checklist */}
          <div className={`rounded-2xl border p-4 space-y-3 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <CheckSquare className="w-3.5 h-3.5 text-[#6366F1]" /> Today's Operations Tasks
              </h3>
              <span className="text-[10px] text-[#6366F1] font-bold bg-[#6366F1]/10 px-2 py-0.5 rounded">4 Pending</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { title: 'Verify QR attendance roll call logs for CSE Lab 402', done: true },
                { title: 'Approve 12 cryptographic certificates for grads', done: false },
                { title: 'Confirm eligibility roster for Amazon AWS drive', done: false },
                { title: 'Send fee payment reminders to 18 students', done: false }
              ].map((task, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#1F1F1F]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <input type="checkbox" defaultChecked={task.done} className="rounded border-[#333] bg-[#0A0A0A] text-[#6366F1]" />
                  <span className={`text-[11px] ${task.done ? 'line-through text-[#555]' : theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'}`}>{task.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pinned Executive Notes */}
          <div className={`rounded-2xl border p-4 space-y-3 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Bookmark className="w-3.5 h-3.5 text-[#F59E0B]" /> Pinned Notes
              </h3>
            </div>
            <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <strong className={`block ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Q3 Assessment Guidelines</strong>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Ensure all coding capstones are reviewed by mentors prior to August 10.</p>
              <span className="text-[9px] text-[#6366F1] font-mono block pt-1">Pinned by Academic HOD</span>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className={`rounded-2xl border p-4 space-y-3 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Calendar className="w-3.5 h-3.5 text-[#10B981]" /> Institutional Calendar
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { date: 'Aug 05', title: 'Mid-Semester Mentor Review Sync', location: 'Conference Room 2' },
                { date: 'Aug 08', title: 'Amazon AWS Campus Drive Day 1', location: 'St. Xavier Auditorium' },
                { date: 'Aug 12', title: 'Theory & Coding Mid-Terms Start', location: 'All Labs' }
              ].map((ev, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#1F1F1F]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`text-center px-2 py-1 rounded-md border shrink-0 ${
                    theme === 'dark' 
                      ? 'bg-[#181818] border-[#222]' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <span className="text-[10px] text-[#10B981] font-bold block">{ev.date}</span>
                  </div>
                  <div>
                    <strong className={`text-[11px] block ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{ev.title}</strong>
                    <span className={`text-[10px] ${
                      theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                    }`}>{ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );

  /* ========================================================================== */
  /* SUB VIEW 2: DEPARTMENTS                                                    */
  /* ========================================================================== */
  const renderDepartmentsView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Academic Departments Directory</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Manage department heads, student intake, programs, and performance scores</p>
        </div>
        <button
          onClick={() => setShowAddDeptModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.id} className={`p-5 rounded-2xl border hover:border-[#222] transition-all space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#1A1A1A] hover:border-[#222]' 
              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold text-base ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{d.name}</h3>
                <span className="text-[11px] font-mono font-bold text-[#6366F1] bg-[#6366F1]/10 border border-[#6366F1]/20 px-2 py-0.5 rounded-md mt-1 inline-block">
                  CODE: {d.code}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border text-[#10B981] font-mono font-bold text-xs ${
                theme === 'dark' 
                  ? 'bg-[#181818] border-[#262626]' 
                  : 'bg-gray-100 border-gray-300'
              }`}>
                Score: 98.4
              </div>
            </div>

            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
            }`}>HOD: <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{d.headOfDepartment}</strong></p>

            <div className={`grid grid-cols-2 gap-2 text-xs p-3 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1F1F1F]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div>
                <span className={`block text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Active Batches</span>
                <strong className={`font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{d.totalBatches} Batches</strong>
              </div>
              <div>
                <span className={`block text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Enrolled Students</span>
                <strong className={`font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{d.totalStudents} Students</strong>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-[#10B981] font-semibold">98% Attendance Rate</span>
              <button className={`px-3 py-1 rounded-lg border font-semibold ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                View Dept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ========================================================================== */
  /* SUB VIEW 3: PROGRAMS MANAGEMENT                                            */
  /* ========================================================================== */
  const renderProgramsView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Technology Training Programs</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Industry-aligned curriculum tracks and mentor allocations</p>
        </div>
        <button
          onClick={() => setShowAddProgramModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold"
        >
          <Plus className="w-4 h-4" /> Create Program
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b text-[10px] font-bold uppercase tracking-[0.15em] ${
              theme === 'dark' 
                ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                : 'border-gray-200 text-[#64748B] bg-gray-50'
            }`}>
              <th className="py-3 px-4">Program Title</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Lead Mentor</th>
              <th className="py-3 px-4">Enrolled Students</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
            {programsList.map((prg) => (
              <tr key={prg.id} className={theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}>
                <td className={`py-3.5 px-4 font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{prg.name} ({prg.code})</td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{prg.dept}</td>
                <td className={`py-3.5 px-4 font-mono ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>{prg.duration}</td>
                <td className={`py-3.5 px-4 font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{prg.mentor}</td>
                <td className="py-3.5 px-4 font-mono text-[#10B981] font-bold">{prg.enrolled} Students</td>
                <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold">{prg.status}</span></td>
                <td className="py-3.5 px-4 text-right">
                  <button onClick={() => setSelectedProgramDetail(prg)} className={`px-3 py-1 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-[#181818] text-white border-[#262626]' 
                      : 'bg-gray-100 text-gray-900 border-gray-300'
                  }`}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ========================================================================== */
  /* SUB VIEW 4: STUDENT DIRECTORY                                              */
  /* ========================================================================== */
  const renderStudentDirectoryView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
        : 'bg-white border-gray-200'
    }`}>
      
      {/* Header & Controls */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Student Roster & Directory</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>1,450 enrolled students across 6 departments with live attendance & fee status</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Enroll Student
          </button>
          <button className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
            theme === 'dark' 
              ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#2A2A2A]' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
          }`}>
            <Download className="w-3.5 h-3.5" /> Export Roster
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-2xl border ${
        theme === 'dark' 
          ? 'bg-[#111] border-[#1F1F1F]' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            theme === 'dark' ? 'text-[#555]' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search name, USN, email..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs placeholder-${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#262626] text-white placeholder-[#555]' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className={`py-2 px-3 rounded-xl text-xs ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#262626] text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="All">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <select
          value={feeFilter}
          onChange={(e) => setFeeFilter(e.target.value as any)}
          className={`py-2 px-3 rounded-xl text-xs ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#262626] text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="All">All Fee Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Partial">Partial</option>
        </select>

        <select
          value={attendanceFilter}
          onChange={(e) => setAttendanceFilter(e.target.value as any)}
          className={`py-2 px-3 rounded-xl text-xs ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#262626] text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="All">All Attendance Rates</option>
          <option value="High">Above 90% Attendance</option>
          <option value="Low">Below 75% (At Risk)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b text-[10px] font-bold uppercase tracking-[0.15em] ${
              theme === 'dark' 
                ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                : 'border-gray-200 text-[#64748B] bg-gray-50'
            }`}>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Department & Batch</th>
              <th className="py-3 px-4">CGPA</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4">Fee Status</th>
              <th className="py-3 px-4">Placement</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
            {filteredStudents.map((s) => (
              <tr key={s.id} className={theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt="" className={`w-8 h-8 rounded-full object-cover border ${
                      theme === 'dark' ? 'border-[#222]' : 'border-gray-300'
                    }`} />
                    <div>
                      <strong className={`block font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{s.name}</strong>
                      <span className={`text-[10px] font-mono ${
                        theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                      }`}>{s.rollNumber}</span>
                    </div>
                  </div>
                </td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>
                  <strong className={`block ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{s.departmentName}</strong>
                  <span className={`text-[10px] ${
                    theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                  }`}>{s.batchName}</span>
                </td>
                <td className={`py-3.5 px-4 font-mono font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{s.cgpa}</td>
                <td className="py-3.5 px-4">
                  <span className={`font-bold ${s.attendancePct >= 90 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {s.attendancePct}%
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.feeStatus === 'Paid' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}>
                    {s.feeStatus}
                  </span>
                </td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{s.placementStatus || 'In Progress'}</td>
                <td className="py-3.5 px-4 text-right">
                  <button onClick={() => setSelectedStudentDetail(s)} className={`px-3 py-1 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-[#181818] text-white border-[#262626]' 
                      : 'bg-gray-100 text-gray-900 border-gray-300'
                  }`}>
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ========================================================================== */
  /* ASSESSMENTS VIEW                                                          */
  /* ========================================================================== */
  const renderAssessmentsView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 ${
      theme === 'dark'
        ? 'bg-[#0A0A0A] border-[#1A1A1A]'
        : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Assessments Portal</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Mid-term results, coding benchmarks, and top performers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold">
          <Plus className="w-4 h-4" /> Schedule Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assessments', value: '24', change: '+4', color: '#6366F1' },
          { label: 'Active', value: '8', change: '+2', color: '#10B981' },
          { label: 'Completed', value: '16', change: '+2', color: '#A855F7' },
          { label: 'Avg Score', value: '76%', change: '+5%', color: '#F59E0B' }
        ].map((stat, index) => (
          <div key={index} className={`p-4 rounded-xl border ${
            theme === 'dark' ? 'bg-[#141414] border-[#262626]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>{stat.label}</span>
              <span className={`text-xs font-bold text-[${stat.color}]`}>{stat.change}</span>
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className={`rounded-xl border overflow-hidden ${
        theme === 'dark' ? 'border-[#262626]' : 'border-gray-200'
      }`}>
        <table className="w-full">
          <thead className={`${
            theme === 'dark' ? 'bg-[#141414]' : 'bg-gray-50'
          }`}>
            <tr>
              {['Assessment Name', 'Type', 'Department', 'Status', 'Date', 'Students', 'Actions'].map((header) => (
                <th key={header} className={`py-3 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Data Structures Mid-Term', type: 'Technical', dept: 'Computer Science', status: 'Active', date: 'Aug 15, 2026', students: 45 },
              { name: 'Web Development Project', type: 'Practical', dept: 'Information Tech', status: 'Completed', date: 'Aug 10, 2026', students: 38 },
              { name: 'Database Management Quiz', type: 'Quiz', dept: 'Computer Science', status: 'Scheduled', date: 'Aug 20, 2026', students: 52 },
              { name: 'Algorithm Design Assessment', type: 'Technical', dept: 'AI & Data Science', status: 'Active', date: 'Aug 18, 2026', students: 28 }
            ].map((assessment, index) => (
              <tr key={index} className={`border-t ${
                theme === 'dark' ? 'border-[#262626] hover:bg-[#1A1A1A]' : 'border-gray-200 hover:bg-gray-50'
              } transition-colors`}>
                <td className={`py-3.5 px-4 font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{assessment.name}</td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{assessment.type}</td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{assessment.dept}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    assessment.status === 'Active' 
                      ? (theme === 'dark' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#10B981]/10 text-[#10B981]')
                      : assessment.status === 'Completed'
                      ? (theme === 'dark' ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'bg-[#6366F1]/10 text-[#6366F1]')
                      : (theme === 'dark' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#F59E0B]/10 text-[#F59E0B]')
                  }`}>{assessment.status}</span>
                </td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{assessment.date}</td>
                <td className={`py-3.5 px-4 font-mono font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{assessment.students}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <button className={`p-1.5 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#262626]'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                    }`}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className={`p-1.5 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#262626]'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                    }`}>
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ========================================================================== */
  /* GENERIC FALLBACK SUB-VIEW                                                  */
  /* ========================================================================== */
  const renderGenericSubView = (title: string, subtitle: string) => (
    <div className={`rounded-2xl border p-6 space-y-6 ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{title}</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>{subtitle}</p>
        </div>
      </div>
      <div className={`p-8 text-center rounded-2xl border space-y-3 ${
        theme === 'dark' 
          ? 'bg-[#111] border-[#222]' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <Sparkles className="w-8 h-8 text-[#6366F1] mx-auto" />
        <h3 className={`text-sm font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>{title} Operations Active</h3>
        <p className={`text-xs max-w-md mx-auto ${
          theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
        }`}>
          All data feeds and telemetry for {title.toLowerCase()} are currently synced with LearnIT Master Database.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Sub-Tab Route Switcher */}
      {currentTab === 'dashboard' && renderDashboardOverview()}
      {currentTab === 'departments' && renderDepartmentsView()}
      {currentTab === 'programs' && renderProgramsView()}
      {currentTab === 'students' && renderStudentDirectoryView()}
      {currentTab === 'batches' && renderGenericSubView('Batches & Schedules', 'Batch timeline, student count, and roll call monitoring')}
      {currentTab === 'mentors' && renderGenericSubView('Mentors Directory', 'Allocated instructors, ratings, and attendance logs')}
      {currentTab === 'courses' && renderProgramsView()}
      {currentTab === 'attendance' && renderGenericSubView('Attendance Hub', 'Calendar heatmap, QR scan logs, and attendance audits')}
      {currentTab === 'assignments' && renderGenericSubView('Assignments Tracker', 'Submission rates, late submissions, and mentor reviews')}
      {currentTab === 'assessments' && renderAssessmentsView()}
      {currentTab === 'placements' && renderGenericSubView('Placements', 'Placement statistics, company partnerships, and job offers')}
      {currentTab === 'eligible_students' && renderGenericSubView('Eligible Students', 'Students eligible for placement drives')}
      {currentTab === 'reports' && renderGenericSubView('Reports & Business Intelligence', 'Custom report generator, PDF exports, and executive telemetry')}
      {currentTab === 'announcements' && renderGenericSubView('Announcements & Alerts', 'Broadcast announcements to students and mentors')}
      {currentTab === 'profile' && renderGenericSubView('Profile', 'College administrator profile and settings')}

      {/* MODALS & DRAWERS */}

      {/* Add Dept Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Add New Department</h3>
              <button onClick={() => setShowAddDeptModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDepartment} className="space-y-3 mt-4 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mechanical Engineering"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MECH"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className={`w-full p-2.5 rounded-xl uppercase ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Head of Department (HOD)</label>
                <input
                  type="text"
                  placeholder="Dr. HOD Name"
                  value={newHodName}
                  onChange={(e) => setNewHodName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div className={`flex justify-end gap-2 pt-3 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button type="button" onClick={() => setShowAddDeptModal(false)} className={`px-4 py-2 font-semibold ${
                  theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                }`}>Cancel</button>
                <button type="submit" className="px-4 py-2 font-semibold bg-[#6366F1] text-white rounded-xl">Create Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Enroll New Student</h3>
              <button onClick={() => setShowAddStudentModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStudent} className="space-y-3 mt-4 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Aditya Sharma"
                  value={newStdName}
                  onChange={(e) => setNewStdName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>USN / Roll Number *</label>
                <input
                  type="text"
                  required
                  placeholder="2026-CSE-102"
                  value={newStdRoll}
                  onChange={(e) => setNewStdRoll(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Official Student Email</label>
                <input
                  type="email"
                  placeholder="aditya.s@student.stxavier.edu"
                  value={newStdEmail}
                  onChange={(e) => setNewStdEmail(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Department</label>
                <select
                  value={newStdDept}
                  onChange={(e) => setNewStdDept(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div className={`flex justify-end gap-2 pt-3 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button type="button" onClick={() => setShowAddStudentModal(false)} className={`px-4 py-2 font-semibold ${
                  theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                }`}>Cancel</button>
                <button type="submit" className="px-4 py-2 font-semibold bg-[#6366F1] text-white rounded-xl">Enroll Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`text-base font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Broadcast Campus Notice</h3>
              <button onClick={() => setShowBroadcastModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Coding Assessment Schedule"
                  value={announcementMsg.title}
                  onChange={(e) => setAnnouncementMsg({ ...announcementMsg, title: e.target.value })}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Target Audience</label>
                <select
                  value={announcementMsg.target}
                  onChange={(e) => setAnnouncementMsg({ ...announcementMsg, target: e.target.value })}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="All Students">All Students & Mentors</option>
                  <option value="Final Year Students">Final Year Students Only</option>
                  <option value="All Mentors">All Mentors</option>
                </select>
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                }`}>Notice Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter notice announcement text..."
                  value={announcementMsg.body}
                  onChange={(e) => setAnnouncementMsg({ ...announcementMsg, body: e.target.value })}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div className={`flex justify-end gap-2 pt-3 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button type="button" onClick={() => setShowBroadcastModal(false)} className={`px-4 py-2 font-semibold ${
                  theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                }`}>Cancel</button>
                <button type="submit" className="px-4 py-2 font-semibold bg-[#EC4899] text-white rounded-xl">Broadcast Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Drawer */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <img src={selectedStudentDetail.avatar} className={`w-12 h-12 rounded-full object-cover border ${
                  theme === 'dark' ? 'border-[#333]' : 'border-gray-300'
                }`} />
                <div>
                  <h3 className={`text-base font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{selectedStudentDetail.name}</h3>
                  <p className="text-xs text-[#888] font-mono">{selectedStudentDetail.rollNumber}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudentDetail(null)} className={`p-1 ${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`grid grid-cols-2 gap-3 text-xs p-3 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div><span className={`block ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>Department</span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedStudentDetail.departmentName}</strong></div>
              <div><span className={`block ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>CGPA</span><strong className={`font-mono ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{selectedStudentDetail.cgpa}</strong></div>
              <div><span className={`block ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>Attendance</span><strong className="text-[#10B981] font-mono">{selectedStudentDetail.attendancePct}%</strong></div>
              <div><span className={`block ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>Fee Status</span><strong className="text-[#10B981]">{selectedStudentDetail.feeStatus}</strong></div>
            </div>

            <button onClick={() => setSelectedStudentDetail(null)} className={`w-full py-2 rounded-xl text-xs font-semibold ${
              theme === 'dark' 
                ? 'bg-[#1A1A1A] text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Mentor Detail Drawer */}
      {selectedMentorDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <img src={selectedMentorDetail.avatar} className={`w-12 h-12 rounded-xl object-cover border ${
                  theme === 'dark' ? 'border-[#333]' : 'border-gray-300'
                }`} />
                <div>
                  <h3 className={`text-base font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{selectedMentorDetail.name}</h3>
                  <p className="text-xs text-[#6366F1]">{selectedMentorDetail.specialization}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMentorDetail(null)} className={`p-1 ${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`grid grid-cols-2 gap-3 text-xs p-3 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div><span className={`block ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>Experience</span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedMentorDetail.experienceYears} Years</strong></div>
              <div><span className={`block ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>Rating</span><strong className="text-[#F59E0B]">★ {selectedMentorDetail.rating}</strong></div>
              <div><span className={`block ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>Assigned Batches</span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedMentorDetail.assignedBatchesCount} Batches</strong></div>
              <div><span className={`block ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>Students Mentored</span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedMentorDetail.totalStudentsMentored} Students</strong></div>
            </div>

            <button onClick={() => setSelectedMentorDetail(null)} className={`w-full py-2 rounded-xl text-xs font-semibold ${
              theme === 'dark' 
                ? 'bg-[#1A1A1A] text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              Close Profile
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
