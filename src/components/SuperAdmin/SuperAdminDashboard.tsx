import React, { useState } from 'react';
import { PartnerCollege, TrainingProgram, UserRole, PlacementDrive, PlacementDriveStatus } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { PlacementService } from '../../services/placementService';
import { 
  mockPartnerColleges, 
  mockTrainingPrograms, 
  mockAuditLogs, 
  mockDepartments as centralDepartments, 
  mockBatches as centralBatches, 
  mockMentors as centralMentors, 
  mockStudents as centralStudents, 
  mockCertificates, 
  mockPaymentTransactions,
  mockAttendanceRecords as centralAttendanceRecords,
  mockSubmissions as centralSubmissions
} from '../../mockData';
import { AnalyticsBI } from '../Analytics/AnalyticsBI';
import { EnterpriseSettings } from '../Settings/EnterpriseSettings';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  FileText,
  Filter,
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  X,
  Calendar,
  UserCheck,
  Briefcase,
  Award,
  BarChart3,
  Bell,
  HelpCircle,
  Settings,
  User,
  RefreshCw,
  Send,
  Check,
  ShieldAlert,
  Download,
  QrCode,
  Lock,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  Sparkles,
  Building,
  ArrowRight,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sidebar as SidebarIcon,
  Target,
  UserPlus,
  Layers,
  FileCheck,
  BookOpen,
  DollarSign,
  Radio,
  Bookmark,
  CheckSquare
} from 'lucide-react';

interface SuperAdminDashboardProps {
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
  onSelectCollege?: (collegeId: string) => void;
  onOpenAuditLogs?: () => void;
}

// Mock Data Definitions for Super Admin - using centralized data
const mockDepartments = centralDepartments.map(dept => ({
  id: dept.id,
  name: dept.name,
  code: dept.code,
  collegesCount: 1,
  studentsCount: dept.totalStudents,
  programsCount: 2,
  status: 'Active'
}));

const mockBatches = centralBatches.map(batch => ({
  id: batch.id,
  name: batch.name,
  code: batch.name.split('-').slice(0, 2).join('-'),
  college: mockPartnerColleges.find(c => c.id === batch.collegeId)?.name || 'Unknown',
  program: batch.programTitle,
  mentor: batch.mentorName,
  studentsCount: batch.studentCount,
  startDate: batch.startDate,
  endDate: batch.endDate,
  status: batch.status === 'Ongoing' ? 'In Progress' : batch.status
}));

const mockMentorsList = centralMentors.map(mentor => ({
  id: mentor.id,
  name: mentor.name,
  email: mentor.email,
  phone: mentor.phone,
  college: mentor.collegeName,
  batchesCount: mentor.assignedBatchesCount,
  rating: mentor.rating,
  attendanceRate: 98.5,
  status: 'Active',
  avatar: mentor.avatar
}));

const mockGlobalStudents = centralStudents.slice(0, 5).map(student => ({
  id: student.id,
  usn: student.rollNumber,
  name: student.name,
  email: student.email,
  college: student.collegeName,
  dept: student.departmentName,
  program: 'Full-Stack Software Eng',
  batch: student.batchName,
  attendance: student.attendancePct,
  placement: student.placementStatus === 'Placed' 
    ? `Placed (${student.placedCompany} - ${student.packageLPA} LPA)` 
    : student.placementStatus,
  status: 'Active'
}));

// Placement-related data removed - no longer needed
// const mockPlacementOfficersList = [...];
// const mockCompaniesList = mockRecruitingCompanies.slice(0, 4).map(...);

const mockCertificatesList = mockCertificates.map(cert => ({
  id: cert.id,
  student: cert.studentName,
  usn: 'USN-' + cert.studentId.slice(-4),
  college: cert.collegeName,
  program: cert.programTitle,
  issueDate: cert.issuedDate,
  verifyCode: cert.verifyUrl.split('/').pop(),
  status: 'Issued'
}));

const mockPaymentsList = mockPaymentTransactions.slice(0, 4).map(payment => ({
  id: payment.id,
  college: payment.collegeName,
  plan: payment.entityType === 'College Subscription' ? 'Enterprise Tier' : 'Student Fee',
  amount: `₹${payment.amount.toLocaleString()}`,
  invoiceDate: payment.date,
  dueDate: payment.date,
  status: payment.status === 'Success' ? 'Paid' : payment.status,
  receiptNo: payment.transactionRef
}));

const mockSupportTickets = [
  { id: 'TKT-101', title: 'Batch QR Code expiry duration configuration request', requester: 'Prof. Suresh Nair (TPO)', college: "St. Xavier's Tech", priority: 'Normal', status: 'Open', date: '2026-08-02' },
  { id: 'TKT-102', title: 'Bulk student roster import CSV column mismatch', requester: 'Dr. Kavita Menon', college: 'Bangalore National Inst', priority: 'High', status: 'In Progress', date: '2026-08-03' },
  { id: 'TKT-103', title: 'Placement drive candidate eligibility filter update', requester: 'Er. Alok Srivastava', college: 'Delhi College of Eng', priority: 'Urgent', status: 'Resolved', date: '2026-08-01' },
];

// Chart data for various sections
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#A855F7', '#EF4444', '#06B6D4'];

const collegeEnrollmentData = [
  { name: 'St. Xavier\'s', students: 320, mentors: 12, placement: 94 },
  { name: 'Bangalore National', students: 450, mentors: 18, placement: 96 },
  { name: 'Delhi College', students: 380, mentors: 15, placement: 92 },
  { name: 'Pune Academy', students: 290, mentors: 11, placement: 89 },
  { name: 'Chennai Inst', students: 310, mentors: 13, placement: 91 }
];

const collegeTierDistribution = [
  { name: 'Enterprise', value: 2, fill: '#6366F1' },
  { name: 'Professional', value: 2, fill: '#10B981' },
  { name: 'Standard', value: 1, fill: '#F59E0B' }
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

const companyHiresData = [
  { company: 'Microsoft', hires: 28, avgPackage: 26.5 },
  { company: 'Amazon', hires: 35, avgPackage: 21.0 },
  { company: 'Google', hires: 18, avgPackage: 32.0 },
  { company: 'Goldman Sachs', hires: 12, avgPackage: 28.0 },
  { company: 'Salesforce', hires: 22, avgPackage: 22.5 }
];

const mentorPerformanceData = [
  { name: 'Dr. Rajesh', rating: 4.9, students: 45, attendance: 99.5 },
  { name: 'Prof. Ananya', rating: 4.8, students: 52, attendance: 98.8 },
  { name: 'Sanjay', rating: 4.9, students: 38, attendance: 99.0 },
  { name: 'Meera', rating: 4.7, students: 48, attendance: 96.5 }
];

const mentorRatingDistribution = [
  { name: '5.0', value: 12, fill: '#10B981' },
  { name: '4.5-4.9', value: 10, fill: '#6366F1' },
  { name: '4.0-4.4', value: 4, fill: '#A855F7' },
  { name: '3.5-3.9', value: 2, fill: '#F59E0B' }
];

const revenueTrendData = [
  { month: 'Jan', revenue: 3.2, collected: 3.0 },
  { month: 'Feb', revenue: 3.5, collected: 3.3 },
  { month: 'Mar', revenue: 3.8, collected: 3.6 },
  { month: 'Apr', revenue: 4.2, collected: 4.0 },
  { month: 'May', revenue: 4.5, collected: 4.3 },
  { month: 'Jun', revenue: 4.8, collected: 4.6 },
  { month: 'Jul', revenue: 5.2, collected: 5.0 }
];

const revenueSourceData = [
  { name: 'Tuition Fees', value: 3.85, fill: '#6366F1' },
  { name: 'Corporate Sponsorships', value: 0.65, fill: '#10B981' },
  { name: 'College Subscriptions', value: 0.35, fill: '#A855F7' }
];

const studentEnrollmentTrend = [
  { month: 'Jan', enrolled: 1200, active: 1150, graduated: 50 },
  { month: 'Feb', enrolled: 1350, active: 1280, graduated: 70 },
  { month: 'Mar', enrolled: 1500, active: 1420, graduated: 80 },
  { month: 'Apr', enrolled: 1680, active: 1580, graduated: 100 },
  { month: 'May', enrolled: 1850, active: 1720, graduated: 130 },
  { month: 'Jun', enrolled: 2000, active: 1850, graduated: 150 },
  { month: 'Jul', enrolled: 2200, active: 2020, graduated: 180 }
];

const studentDepartmentDistribution = [
  { name: 'CSE', value: 4500, fill: '#6366F1' },
  { name: 'ISE', value: 3200, fill: '#10B981' },
  { name: 'ECE', value: 2800, fill: '#A855F7' },
  { name: 'Mech', value: 2100, fill: '#F59E0B' },
  { name: 'Civil', value: 1650, fill: '#EF4444' }
];

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  activeTab = 'dashboard',
  onSelectTab,
  onSelectCollege,
  onOpenAuditLogs
}) => {
  const { theme } = useTheme();
  const [colleges, setColleges] = useState<PartnerCollege[]>(mockPartnerColleges);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedCollegeForDetail, setSelectedCollegeForDetail] = useState<PartnerCollege | null>(null);
  const [collegeTab, setCollegeTab] = useState<'Overview' | 'Departments' | 'Programs' | 'Mentors' | 'Students' | 'Placements' | 'Payments'>('Overview');
  
  // Right Panel Toggle
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Modals & Drawers state
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showVerifyCertModal, setShowVerifyCertModal] = useState(false);
  const [showPlacementDriveModal, setShowPlacementDriveModal] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);
  const [selectedMentorDetail, setSelectedMentorDetail] = useState<any>(null);
  const [selectedPlacementDrive, setSelectedPlacementDrive] = useState<PlacementDrive | null>(null);

  // Placement Drives state
  const [placementDrives, setPlacementDrives] = useState<PlacementDrive[]>(PlacementService.getAllPlacementDrives());
  const [placementFilter, setPlacementFilter] = useState<PlacementDriveStatus | 'All'>('All');
  const [newPlacementDrive, setNewPlacementDrive] = useState({
    companyName: '',
    companyLogo: '',
    jobRole: '',
    package: '',
    location: '',
    driveDate: '',
    eligibility: '',
    description: '',
    requiredSkills: [] as string[]
  });

  // New College Form
  const [newCollege, setNewCollege] = useState({
    name: '', code: '', location: '', state: '', tier: 'Enterprise' as const, fee: 1200000, admin: '', email: ''
  });

  const totalStudentsCount = colleges.reduce((acc, c) => acc + c.totalStudents, 0);
  const totalARR = colleges.reduce((acc, c) => acc + c.annualFee, 0);

  // Placement Drive Handlers
  const handleCreatePlacementDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlacementDrive.companyName || !newPlacementDrive.jobRole) return;

    const created = PlacementService.createPlacementDrive({
      ...newPlacementDrive,
      createdBy: 'super_admin_001'
    });

    setPlacementDrives(PlacementService.getAllPlacementDrives());
    setShowPlacementDriveModal(false);
    setNewPlacementDrive({
      companyName: '',
      companyLogo: '',
      jobRole: '',
      package: '',
      location: '',
      driveDate: '',
      eligibility: '',
      description: '',
      requiredSkills: []
    });
  };

  const handleSubmitForApproval = (id: string) => {
    PlacementService.submitForApproval(id);
    setPlacementDrives(PlacementService.getAllPlacementDrives());
  };

  const handleApproveDrive = (id: string) => {
    PlacementService.approvePlacementDrive(id, 'super_admin_001');
    setPlacementDrives(PlacementService.getAllPlacementDrives());
  };

  const handleRejectDrive = (id: string, reason: string) => {
    PlacementService.rejectPlacementDrive(id, reason);
    setPlacementDrives(PlacementService.getAllPlacementDrives());
  };

  const handleArchiveDrive = (id: string) => {
    PlacementService.archivePlacementDrive(id);
    setPlacementDrives(PlacementService.getAllPlacementDrives());
  };

  const handleDeleteDrive = (id: string) => {
    PlacementService.deletePlacementDrive(id);
    setPlacementDrives(PlacementService.getAllPlacementDrives());
  };

  const handleCreateCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollege.name || !newCollege.code) return;

    const created: PartnerCollege = {
      id: `clg_${Date.now()}`,
      name: newCollege.name,
      code: newCollege.code.toUpperCase(),
      location: newCollege.location || 'Campus Center',
      state: newCollege.state || 'State',
      logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=150&q=80',
      contractStatus: 'Active',
      planTier: newCollege.tier,
      joinedDate: new Date().toISOString().split('T')[0],
      totalDepartments: 4,
      totalStudents: 400,
      totalMentors: 8,
      placementRate: 85.0,
      annualFee: Number(newCollege.fee),
      contactPerson: newCollege.admin || 'College Admin',
      contactEmail: newCollege.email || 'admin@college.edu'
    };

    setColleges([created, ...colleges]);
    setShowAddCollegeModal(false);
    setNewCollege({ name: '', code: '', location: '', state: '', tier: 'Enterprise', fee: 1200000, admin: '', email: '' });
  };

  /* -------------------------------------------------------------------------- */
  /* 1. EXECUTIVE DASHBOARD SUB-VIEW                                            */
  /* -------------------------------------------------------------------------- */
  const renderDashboardView = () => (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* SECTION 1: EXECUTIVE WELCOME BANNER */}
        <div className={`rounded-2xl p-6 border shadow-lg relative overflow-hidden transition-all duration-250 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0E] text-white border-[rgba(255,255,255,0.08)]' 
            : 'bg-white text-gray-900 border-[rgba(0,0,0,0.06)]'
        }`}>
          <div className={`absolute -right-12 -bottom-12 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
            theme === 'dark' ? 'bg-[#6366F1]/10' : 'bg-[#6366F1]/5'
          }`}></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-[#6366F1] font-bold text-[11px] tracking-[0.2em] uppercase mb-1">
                <ShieldCheck className="w-4 h-4 text-[#6366F1]" /> Super Admin Headquarters
              </div>
              <h1 className={`text-2xl font-extrabold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Good Morning, LearnIT Team</h1>
              <div className={`flex flex-wrap items-center gap-3 text-xs mt-2 ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`flex items-center gap-1.5 font-medium ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#475569]'
                }`}>
                  <Calendar className="w-3.5 h-3.5 text-[#6366F1]" /> Tuesday, August 4, 2026
                </span>
                <span className={theme === 'dark' ? 'text-[#333]' : 'text-gray-300'}>&bull;</span>
                <span className={`px-2 py-0.5 rounded-md border font-mono transition-all duration-250 ${
                  theme === 'dark' 
                    ? 'bg-[#141414] border-[rgba(255,255,255,0.08)] text-[#DDD]' 
                    : 'bg-gray-100 border-[rgba(0,0,0,0.06)] text-gray-700'
                }`}>Academic Year 2025–26</span>
                <span className={theme === 'dark' ? 'text-[#333]' : 'text-gray-300'}>&bull;</span>
                <span className="px-2 py-0.5 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 font-bold">Fall Semester (Sem VII)</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowAddCollegeModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all duration-250 hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-4 h-4" /> Create College
              </button>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-semibold transition-all duration-250 hover:-translate-y-0.5 shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-[#111] hover:bg-[#181818] text-white border-[rgba(255,255,255,0.08)] hover:shadow-md' 
                    : 'bg-white hover:bg-gray-50 text-gray-900 border-[rgba(0,0,0,0.06)] hover:shadow-md'
                }`}
              >
                <Bell className="w-4 h-4 text-[#A855F7]" /> Broadcast
              </button>
              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className={`p-2 border rounded-xl text-xs font-medium transition-all duration-250 hover:-translate-y-0.5 shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-[#111] hover:bg-[#181818] text-[#888] hover:text-white border-[rgba(255,255,255,0.08)] hover:shadow-md' 
                    : 'bg-white hover:bg-gray-50 text-[#64748B] hover:text-gray-900 border-[rgba(0,0,0,0.06)] hover:shadow-md'
                }`}
                title="Toggle Right Panel"
              >
                <SidebarIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: 4-COLUMN KPI GRID (2 ROWS) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-xs font-bold uppercase tracking-[0.2em] ${
              theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
            }`}>Ecosystem KPI Metrics</h2>
            <span className="text-[11px] text-[#10B981] font-mono font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> All Systems Real-Time Syncing
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Card 1: Partner Colleges */}
            <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 group shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(99,102,241,0.2)]'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#475569]'
                }`}>Partner Colleges</span>
                <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{colleges.length}</div>
                <span className="text-[11px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">+4 Campuses</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] transition-colors duration-250 ${
                theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
              }`}>
                <span className={theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}>SLA Compliance: 99.4%</span>
                <button onClick={() => onSelectTab?.('colleges')} className="text-[#6366F1] font-semibold hover:underline flex items-center gap-0.5">
                  Directory <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Card 2: Enrolled Students */}
            <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 group shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(168,85,247,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(168,85,247,0.2)]'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#475569]'
                }`}>Enrolled Students</span>
                <div className="p-2 rounded-xl bg-[#A855F7]/10 text-[#A855F7]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{centralStudents.length.toLocaleString()}</div>
                <span className="text-[11px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">+18.2% YoY</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] transition-colors duration-250 ${
                theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
              }`}>
                <span className={theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}>Across 10 Depts</span>
                <button onClick={() => onSelectTab?.('students')} className="text-[#A855F7] font-semibold hover:underline flex items-center gap-0.5">
                  Search Roster <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Card 3: Mentors */}
            <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 group shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(59,130,246,0.2)]'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#475569]'
                }`}>Active Mentors</span>
                <div className="p-2 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{centralMentors.length}</div>
                <span className="text-[11px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">+{centralMentors.length - 20} Allocated</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] transition-colors duration-250 ${
                theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
              }`}>
                <span className={theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}>Rating: 4.7 / 5.0</span>
                <button onClick={() => onSelectTab?.('mentors')} className="text-[#3B82F6] font-semibold hover:underline flex items-center gap-0.5">
                  Allocations <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Row 2 - Card 5: Annual ARR */}
            <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 group shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(245,158,11,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(245,158,11,0.2)]'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#475569]'
                }`}>Platform ARR</span>
                <div className="p-2 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>₹{(totalARR / 10000000).toFixed(2)} Cr</div>
                <span className="text-[11px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">+15.4%</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] transition-colors duration-250 ${
                theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
              }`}>
                <span className={theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}>100% Invoiced</span>
                <button onClick={() => onSelectTab?.('payments')} className="text-[#F59E0B] font-semibold hover:underline flex items-center gap-0.5">
                  Invoices <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Row 2 - Card 6: Attendance Records */}
            <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 group shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(236,72,153,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(236,72,153,0.2)]'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#475569]'
                }`}>Attendance Records</span>
                <div className="p-2 rounded-xl bg-[#EC4899]/10 text-[#EC4899]">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{(centralAttendanceRecords.length / 1000).toFixed(1)}K</div>
                <span className="text-[11px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">90 Days</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] transition-colors duration-250 ${
                theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
              }`}>
                <span className={theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}>92.1% Avg Rate</span>
                <button onClick={() => onSelectTab?.('attendance')} className="text-[#EC4899] font-semibold hover:underline flex items-center gap-0.5">
                  Audit <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Row 2 - Card 7: Assignment Submissions */}
            <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 group shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(99,102,241,0.2)]'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#475569]'
                }`}>Assignments Graded</span>
                <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{centralSubmissions.length}</div>
                <span className="text-[11px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">85% On Time</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] transition-colors duration-250 ${
                theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
              }`}>
                <span className={theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}>Avg Score: 78/100</span>
                <button onClick={() => onSelectTab?.('assignments')} className="text-[#6366F1] font-semibold hover:underline flex items-center gap-0.5">
                  Review <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Row 2 - Card 8: System Health */}
            <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 group shadow-sm hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
                : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
            }`}>
              <div className={`flex items-center justify-between ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#475569]'
                }`}>System Health</span>
                <div className="p-2 rounded-xl bg-[#10B981]/10 text-[#10B981]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className="text-2xl font-black text-[#10B981] font-mono">99.98%</div>
                <span className="text-[11px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">Optimal</span>
              </div>
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] transition-colors duration-250 ${
                theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
              }`}>
                <span className={theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}>Lat: 18ms</span>
                <button onClick={onOpenAuditLogs} className="text-[#10B981] font-semibold hover:underline flex items-center gap-0.5">
                  Security <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 7: AI COMMAND CENTER */}
        <div className={`rounded-2xl border p-5 space-y-4 transition-all duration-250 shadow-lg ${
          theme === 'dark' 
            ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
            : 'bg-white border-[rgba(0,0,0,0.06)]'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b transition-colors duration-250 ${
            theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
          }`}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#6366F1]/10 text-[#6366F1] rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>AI Command Center & Governance Insights</h3>
                <p className={`text-[11px] ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Automated telemetry, risk detection, and proactive action recommendations</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#6366F1]/20 text-[#6366F1] rounded-full border border-[#6366F1]/30">
              Gemini 2.5 Pro Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                title: 'Attendance Dropped 5.2% in CSE Dept',
                col: 'Pune Engineering Academy',
                severity: 'Medium Risk',
                sevColor: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
                rec: 'Notify HOD to verify QR code scan duration and mentor presence.',
                actionText: 'Send Alert to HOD'
              },
              {
                title: '12 Students Eligible for Microsoft SDE Drive',
                col: "St. Xavier's Institute of Tech",
                severity: 'Opportunity',
                sevColor: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
                rec: 'Auto-invite candidates with high coding assessment performance.',
                actionText: 'Invite Candidates'
              },
              {
                title: '3 Batches Require Mentor Re-allocation',
                col: 'Delhi College of Engineering',
                severity: 'Action Needed',
                sevColor: 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20',
                rec: 'Assign available senior AI mentors before Q3 syllabus launch.',
                actionText: 'Assign Mentors'
              },
              {
                title: 'Annual ARR Invoiced (+₹15.0L Revenue)',
                col: 'Bangalore National Institute',
                severity: 'Financial',
                sevColor: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
                rec: 'Subscription payment successfully settled via bank wire.',
                actionText: 'View Receipt'
              }
            ].map((insight, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border hover:border-[#333] transition-all space-y-2 ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222] hover:border-[#333]' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${insight.sevColor}`}>
                    {insight.severity}
                  </span>
                  <span className={`text-[10px] font-mono ${
                    theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                  }`}>{insight.col}</span>
                </div>
                <h4 className={`font-bold text-xs ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{insight.title}</h4>
                <p className={`text-[11px] leading-relaxed ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{insight.rec}</p>
                <div className="pt-2 flex justify-end">
                  <button className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                    theme === 'dark' 
                      ? 'bg-[#1A1A1A] hover:bg-[#222] text-white border-[#2A2A2A]' 
                      : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
                  }`}>
                    {insight.actionText} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: ACTION CENTER (HIGH PRIORITY CARDS) */}
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
              }`}>Action Center — Immediate Operational Attention Needed</h3>
            </div>
            <span className="text-[11px] text-[#EF4444] font-mono font-bold bg-[#EF4444]/10 px-2.5 py-0.5 rounded-full border border-[#EF4444]/20">
              5 Pending Issues
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">High Priority</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Attendance</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{centralStudents.filter(s => s.attendancePct < 75).length} Students Below 75% Attendance</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Final year students flagged for low roll-call logs across partner colleges.</p>
              <button onClick={() => onSelectTab?.('students')} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Review Roster
              </button>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">Urgent</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Payments</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>₹{(mockPaymentTransactions.filter(p => p.status === 'Processing').reduce((acc, p) => acc + p.amount, 0) / 100000).toFixed(2)} Lakhs Payments Pending</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>{mockPaymentTransactions.filter(p => p.status === 'Processing').length} invoices pending clearance from partner colleges.</p>
              <button onClick={() => onSelectTab?.('payments')} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Send Reminder
              </button>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">Action Needed</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Mentors</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{centralMentors.filter(m => m.rating < 4.0).length} Mentors Need Attention</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Mentors with low ratings or attendance compliance issues.</p>
              <button onClick={() => onSelectTab?.('mentors')} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Notify Instructors
              </button>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">Live Today</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Placements</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{centralStudents.filter(s => s.cgpa >= 8.5).length} Students Placement Ready</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>High-performing candidates eligible for upcoming placement drives.</p>
              <button onClick={() => onSelectTab?.('companies')} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Monitor Drives
              </button>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">Operational</span>
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Infrastructure</span>
              </div>
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>System Security Diagnostics</h4>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>All Cloud Run containers, Firestore DB, & CDN operating nominally.</p>
              <button onClick={onOpenAuditLogs} className={`w-full py-1.5 rounded-lg text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#181818] hover:bg-[#222] text-white border-[#2A2A2A]' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                Audit Logs
              </button>
            </div>

          </div>
        </div>

        {/* SECTION 4 & 6: LIVE ACTIVITY TIMELINE & TOP PERFORMERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section 4: Live Activity Timeline */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#6366F1]" />
                <h3 className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Live Activity Stream</h3>
              </div>
              <span className={`text-[10px] font-mono ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Real-time events</span>
            </div>

            <div className="space-y-3">
              {[
                { time: '10 mins ago', title: 'Placement Offer Uploaded', desc: 'Rohan Verma received offer from Microsoft SDE-1 (28.5 LPA)', type: 'placement' },
                { time: '25 mins ago', title: 'Attendance Completed', desc: 'Batch FS-2026-A marked 98% attendance by Dr. Rajesh Kumar', type: 'attendance' },
                { time: '1 hr ago', title: 'Payment Received', desc: 'St. Xavier Institute settled Q3 Annual Enterprise Fee (₹1.5 Cr)', type: 'payment' },
                { time: '2 hrs ago', title: 'Certificate Generated', desc: 'Cryptographic hash issued for 48 Full-Stack graduates', type: 'cert' },
                { time: '3 hrs ago', title: 'Mentor Added', desc: 'Prof. Ananya Desai assigned to Applied AI & ML Batch 2026-B', type: 'mentor' },
              ].map((ev, i) => (
                <div key={i} className={`flex gap-3 text-xs items-start p-2.5 rounded-xl transition-colors ${
                  theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-[#6366F1] mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{ev.title}</strong>
                      <span className={`text-[10px] font-mono ${
                        theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                      }`}>{ev.time}</span>
                    </div>
                    <p className={`text-[11px] mt-0.5 ${
                      theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                    }`}>{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Top Performers */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                <h3 className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Ecosystem Top Performers</h3>
              </div>
              <span className={`text-[10px] font-mono ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>AY 2025–26</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div>
                  <span className={`text-[10px] font-bold block uppercase ${
                    theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                  }`}>Best Performing College</span>
                  <strong className={`text-xs ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>St. Xavier's Institute of Tech</strong>
                  <p className="text-[10px] text-[#10B981]">98.4% Placement Rate • 1,450 Students</p>
                </div>
                <div className="px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] font-bold rounded-lg border border-[#10B981]/20">#1 Campus</div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div>
                  <span className={`text-[10px] font-bold block uppercase ${
                    theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                  }`}>Best Mentor</span>
                  <strong className={`text-xs ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Dr. Rajesh Kumar</strong>
                  <p className="text-[10px] text-[#3B82F6]">4.95 Rating • 99.2% Roll Call Compliance</p>
                </div>
                <div className="px-2.5 py-1 bg-[#3B82F6]/10 text-[#3B82F6] font-bold rounded-lg border border-[#3B82F6]/20">★ 4.95</div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div>
                  <span className={`text-[10px] font-bold block uppercase ${
                    theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                  }`}>Highest Package Offer</span>
                  <strong className={`text-xs ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Rohan Verma (CSE)</strong>
                  <p className="text-[10px] text-[#A855F7]">Microsoft Corporation • 28.5 LPA CTC</p>
                </div>
                <div className="px-2.5 py-1 bg-[#A855F7]/10 text-[#A855F7] font-bold rounded-lg border border-[#A855F7]/20">28.5 LPA</div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div>
                  <span className={`text-[10px] font-bold block uppercase ${
                    theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                  }`}>Top Academic Batch</span>
                  <strong className={`text-xs ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>FS-2026-A (Enterprise Full-Stack)</strong>
                  <p className="text-[10px] text-[#F59E0B]">60 / 60 Students Placed (100% Rate)</p>
                </div>
                <div className="px-2.5 py-1 bg-[#F59E0B]/10 text-[#F59E0B] font-bold rounded-lg border border-[#F59E0B]/20">100% Placed</div>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 8: QUICK ACTIONS BAR */}
        <div className={`rounded-2xl border p-5 space-y-3 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ${
            theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
          }`}>Super Admin Quick Action Center</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              onClick={() => setShowAddCollegeModal(true)}
              className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-all active:scale-95 ${
                theme === 'dark' 
                  ? 'bg-[#111] hover:bg-[#1A1A1A] text-white border-[#222]' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200'
              }`}
            >
              <Building2 className="w-5 h-5 text-[#6366F1]" />
              <span>Create College</span>
            </button>

            <button
              onClick={() => setShowProgramModal(true)}
              className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-all active:scale-95 ${
                theme === 'dark' 
                  ? 'bg-[#111] hover:bg-[#1A1A1A] text-white border-[#222]' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200'
              }`}
            >
              <BookOpen className="w-5 h-5 text-[#A855F7]" />
              <span>Create Program</span>
            </button>

            <button
              onClick={() => onSelectTab?.('mentors')}
              className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-all active:scale-95 ${
                theme === 'dark' 
                  ? 'bg-[#111] hover:bg-[#1A1A1A] text-white border-[#222]' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200'
              }`}
            >
              <UserPlus className="w-5 h-5 text-[#3B82F6]" />
              <span>Assign Mentor</span>
            </button>

            <button
              onClick={() => onSelectTab?.('certificates')}
              className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-all active:scale-95 ${
                theme === 'dark' 
                  ? 'bg-[#111] hover:bg-[#1A1A1A] text-white border-[#222]' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200'
              }`}
            >
              <Award className="w-5 h-5 text-[#10B981]" />
              <span>Issue Certificate</span>
            </button>

            <button
              onClick={() => onSelectTab?.('companies')}
              className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-all active:scale-95 ${
                theme === 'dark' 
                  ? 'bg-[#111] hover:bg-[#1A1A1A] text-white border-[#222]' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200'
              }`}
            >
              <Briefcase className="w-5 h-5 text-[#F59E0B]" />
              <span>Create Drive</span>
            </button>

            <button
              onClick={() => setShowBroadcastModal(true)}
              className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-all active:scale-95 ${
                theme === 'dark' 
                  ? 'bg-[#111] hover:bg-[#1A1A1A] text-white border-[#222]' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200'
              }`}
            >
              <Radio className="w-5 h-5 text-[#EC4899]" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE ACTIVITY PANEL */}
      {showRightPanel && (
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Today's Tasks */}
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
                <CheckSquare className="w-3.5 h-3.5 text-[#6366F1]" /> Today's Tasks
              </h3>
              <span className="text-[10px] text-[#6366F1] font-bold bg-[#6366F1]/10 px-2 py-0.5 rounded">3 Pending</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { title: 'Approve Q3 Partner College SLA Renewals', done: false },
                { title: 'Sign cryptographic certificate batch for 48 grads', done: false },
                { title: 'Review Microsoft drive eligibility roster', done: true },
                { title: 'Confirm Wire payment receipt for Delhi Eng College', done: false }
              ].map((task, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#1F1F1F]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <input type="checkbox" defaultChecked={task.done} className={`rounded border ${
                    theme === 'dark' ? 'border-[#333] bg-[#0A0A0A]' : 'border-gray-300 bg-white'
                  } text-[#6366F1]`} />
                  <span className={`text-[11px] ${
                    task.done 
                      ? 'line-through ' + (theme === 'dark' ? 'text-[#555]' : 'text-[#9CA3AF]')
                      : theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>{task.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pinned Notes */}
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
                <Bookmark className="w-3.5 h-3.5 text-[#F59E0B]" /> Pinned Executive Notes
              </h3>
            </div>
            <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <strong className={`block ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Q3 Campus Expansion Goal</strong>
              <p className={`text-[11px] ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Target onboarding 5 additional Tier-1 engineering campuses in North Zone by September 15.</p>
              <span className="text-[9px] text-[#6366F1] font-mono block pt-1">Pinned by COO Aris Thorne</span>
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
                <Calendar className="w-3.5 h-3.5 text-[#10B981]" /> Upcoming Events
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { date: 'Aug 06', title: 'National Placement Officer Summit', location: 'Virtual HQ' },
                { date: 'Aug 10', title: 'Amazon AWS Campus Drive Day 1', location: 'St. Xavier Campus' },
                { date: 'Aug 15', title: 'Q3 Curriculum & Assessment Sync', location: 'Bangalore Center' }
              ].map((ev, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#1F1F1F]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`text-center px-2 py-1 rounded-md border shrink-0 ${
                    theme === 'dark' 
                      ? 'bg-[#181818] border-[#222]' 
                      : 'bg-white border-gray-200'
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

  /* -------------------------------------------------------------------------- */
  /* PLACEMENT DRIVES MANAGEMENT                                                */
  /* -------------------------------------------------------------------------- */
  const renderPlacementDrivesView = () => {
    const filteredDrives = placementFilter === 'All' 
      ? placementDrives 
      : placementDrives.filter(d => d.status === placementFilter);

    const statusColors: Record<PlacementDriveStatus, string> = {
      'Draft': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      'Pending Approval': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'Approved': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
      'Archived': 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className={`rounded-2xl border p-6 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F59E0B]/10 rounded-xl">
                <Briefcase className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Placement Drives Management</h2>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Create, approve, and manage campus placement drives</p>
              </div>
            </div>
            <button
              onClick={() => setShowPlacementDriveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" /> Create New Drive
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'Draft', 'Pending Approval', 'Approved', 'Rejected', 'Archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setPlacementFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  placementFilter === status
                    ? 'bg-[#6366F1] text-white'
                    : theme === 'dark'
                      ? 'bg-[#111] text-[#888] hover:text-white border border-[#222]'
                      : 'bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {status} ({status === 'All' ? placementDrives.length : placementDrives.filter(d => d.status === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Placement Drives List */}
        <div className={`rounded-2xl border p-6 space-y-4 ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          {filteredDrives.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Briefcase className={`w-12 h-12 mx-auto ${
                theme === 'dark' ? 'text-[#333]' : 'text-gray-300'
              }`} />
              <p className={`text-sm ${
                theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
              }`}>
                No placement drives found for this filter
              </p>
              <button
                onClick={() => setShowPlacementDriveModal(true)}
                className="text-xs text-[#6366F1] font-semibold hover:underline"
              >
                Create your first placement drive
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDrives.map((drive) => (
                <div
                  key={drive.id}
                  className={`p-4 rounded-xl border space-y-3 ${
                    theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        theme === 'dark' ? 'bg-[#6366F1]/15' : 'bg-[#6366F1]/10'
                      }`}>
                        <Building2 className="w-6 h-6 text-[#6366F1]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{drive.companyName}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[drive.status]}`}>
                            {drive.status}
                          </span>
                        </div>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                        }`}>{drive.jobRole}</p>
                        <div className="flex items-center gap-4 mt-2 text-[10px]">
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                          }`}>CTC: {drive.package}</span>
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                          }`}>Location: {drive.location}</span>
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                          }`}>Drive Date: {drive.driveDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {drive.status === 'Draft' && (
                        <button
                          onClick={() => handleSubmitForApproval(drive.id)}
                          className="px-3 py-1.5 bg-[#F59E0B] text-white rounded-lg text-[10px] font-semibold hover:bg-yellow-600 transition-all"
                        >
                          Submit for Approval
                        </button>
                      )}
                      {drive.status === 'Pending Approval' && (
                        <>
                          <button
                            onClick={() => handleApproveDrive(drive.id)}
                            className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg text-[10px] font-semibold hover:bg-green-600 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Enter rejection reason:');
                              if (reason) handleRejectDrive(drive.id, reason);
                            }}
                            className="px-3 py-1.5 bg-[#EF4444] text-white rounded-lg text-[10px] font-semibold hover:bg-red-600 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {drive.status === 'Approved' && (
                        <button
                          onClick={() => handleArchiveDrive(drive.id)}
                          className="px-3 py-1.5 bg-[#A855F7] text-white rounded-lg text-[10px] font-semibold hover:bg-purple-600 transition-all"
                        >
                          Archive
                        </button>
                      )}
                      {(drive.status === 'Draft' || drive.status === 'Rejected') && (
                        <button
                          onClick={() => handleDeleteDrive(drive.id)}
                          className="px-3 py-1.5 bg-[#EF4444] text-white rounded-lg text-[10px] font-semibold hover:bg-red-600 transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={`pt-3 border-t text-[10px] ${
                    theme === 'dark' ? 'border-[#222]' : 'border-gray-200'
                  }`}>
                    <p className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    }`}>Eligibility: {drive.eligibility}</p>
                    <p className={`${
                      theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                    }`}>{drive.description}</p>
                    {drive.requiredSkills.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {drive.requiredSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[9px] font-medium ${
                              theme === 'dark' ? 'bg-[#222] text-[#CCC]' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------------------- */
  /* 2. PARTNER COLLEGES MANAGEMENT                                             */
  /* -------------------------------------------------------------------------- */
  const renderCollegesView = () => (
    <div className="space-y-6">
      
      {/* College Details View Modal if selected */}
      {selectedCollegeForDetail ? (
        <div className={`rounded-2xl border p-6 space-y-6 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`flex items-center justify-between pb-4 border-b ${
            theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              <img src={selectedCollegeForDetail.logo} alt="" className={`w-12 h-12 rounded-xl object-cover border ${
                theme === 'dark' ? 'border-[#222]' : 'border-gray-200'
              }`} />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{selectedCollegeForDetail.name}</h2>
                  <span className="text-xs font-mono font-bold text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded-md border border-[#6366F1]/20">
                    {selectedCollegeForDetail.code}
                  </span>
                </div>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>{selectedCollegeForDetail.location}, {selectedCollegeForDetail.state} • Tier: {selectedCollegeForDetail.planTier}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCollegeForDetail(null)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${
                theme === 'dark' 
                  ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#2A2A2A]' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
              }`}
            >
              ← Back to Directory
            </button>
          </div>

          {/* Sub tabs */}
          <div className={`flex gap-2 border-b pb-2 text-xs font-semibold ${
            theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
          }`}>
            {(['Overview', 'Departments', 'Programs', 'Mentors', 'Students', 'Placements', 'Payments'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setCollegeTab(t)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  collegeTab === t 
                    ? 'bg-[#6366F1] text-white' 
                    : theme === 'dark' 
                      ? 'text-[#888] hover:text-white hover:bg-[#111]' 
                      : 'text-[#64748B] hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sub tab content */}
          {collegeTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className={`p-4 rounded-xl border space-y-2 ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`font-bold block uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Institutional Contacts</span>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}><strong>Principal / Director:</strong> {selectedCollegeForDetail.contactPerson}</p>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}><strong>Official Email:</strong> {selectedCollegeForDetail.contactEmail}</p>
                <p className={theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}><strong>Joined Date:</strong> {selectedCollegeForDetail.joinedDate}</p>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`font-bold block uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Academic Capacity</span>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}><strong>Enrolled Students:</strong> {selectedCollegeForDetail.totalStudents}</p>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}><strong>Allocated Mentors:</strong> {selectedCollegeForDetail.totalMentors}</p>
                <p className="text-[#10B981]"><strong>Placement Success:</strong> {selectedCollegeForDetail.placementRate}%</p>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`font-bold block uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Contract & SLA</span>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}><strong>Subscription Fee:</strong> ₹{(selectedCollegeForDetail.annualFee / 100000).toFixed(1)} Lakhs / year</p>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}><strong>Status:</strong> <span className="text-[#10B981]">{selectedCollegeForDetail.contractStatus}</span></p>
                <div className="pt-2 flex gap-2">
                  <button className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-lg">Renew SLA</button>
                  <button className="px-3 py-1 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 rounded-lg">Suspend</button>
                </div>
              </div>
            </div>
          )}

          {collegeTab !== 'Overview' && (
            <div className={`p-8 text-center text-xs rounded-xl border ${
              theme === 'dark' 
                ? 'text-[#888] bg-[#0D0D0D] border-[#1A1A1A]' 
                : 'text-[#64748B] bg-gray-50 border-gray-200'
            }`}>
              Displaying {collegeTab} records for {selectedCollegeForDetail.name}. All active data synced with HQ database.
            </div>
          )}
        </div>
      ) : (
        /* College List Table */
        <div className="space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* College Enrollment Bar Chart */}
            <div className={`rounded-2xl border p-5 space-y-4 ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h3 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>College Enrollment & Placement</h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                  }`}>Students, mentors, and placement rates by college</p>
                </div>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collegeEnrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1A1A1A' : '#E5E7EB'} />
                    <XAxis dataKey="name" stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                    <YAxis stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                        borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                        borderRadius: '12px', 
                        fontSize: '12px' 
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="students" name="Students" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="mentors" name="Mentors" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="placement" name="Placement %" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* College Tier Distribution Pie Chart */}
            <div className={`rounded-2xl border p-5 space-y-4 ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className={`font-bold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>College Tier Distribution</h3>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>5 Partner Colleges</span>
              </div>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={collegeTierDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {collegeTierDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                        borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                        borderRadius: '12px', 
                        fontSize: '12px' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* College Table */}
          <div className={`rounded-2xl border p-6 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div>
                <h2 className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Partner College Directory</h2>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Manage institutional subscriptions, student capacity, and campus admins</p>
              </div>
              <button
                onClick={() => setShowAddCollegeModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                <Plus className="w-4 h-4" /> Onboard Partner College
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
                    <th className="py-3 px-4">College Name</th>
                    <th className="py-3 px-4">Code & City</th>
                    <th className="py-3 px-4">Plan Tier</th>
                    <th className="py-3 px-4">Students</th>
                    <th className="py-3 px-4">Mentors</th>
                    <th className="py-3 px-4">Placement Rate</th>
                    <th className="py-3 px-4">Annual Fee</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
                {colleges.map((c) => (
                  <tr key={c.id} className={`transition-colors ${
                    theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'
                  }`}>
                    <td className={`py-3.5 px-4 font-bold flex items-center gap-2.5 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      <img src={c.logo} className="w-8 h-8 rounded-lg object-cover" />
                      <span>{c.name}</span>
                    </td>
                    <td className={`py-3.5 px-4 font-mono ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                    }`}>{c.code} • {c.location}</td>
                    <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-[#A855F7]/10 text-[#A855F7] text-[10px] font-bold">{c.planTier}</span></td>
                    <td className={`py-3.5 px-4 font-mono ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{c.totalStudents}</td>
                    <td className={`py-3.5 px-4 font-mono ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                    }`}>{c.totalMentors}</td>
                    <td className="py-3.5 px-4 font-bold text-[#10B981]">{c.placementRate}%</td>
                    <td className={`py-3.5 px-4 font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>₹{(c.annualFee / 100000).toFixed(1)} L</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCollegeForDetail(c)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold border ${
                          theme === 'dark' 
                            ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#2A2A2A]' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                        }`}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 3. DEPARTMENTS MANAGEMENT                                                  */
  /* -------------------------------------------------------------------------- */
  const renderDepartmentsView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Department Governance</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Centralized academic departments enabled across partner colleges</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDepartments.map((dept) => (
          <div key={dept.id} className={`p-5 rounded-xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-[#6366F1]/10 text-[#6366F1] rounded border border-[#6366F1]/20">
                {dept.code}
              </span>
              <span className="text-[10px] font-bold text-[#10B981]">{dept.status}</span>
            </div>
            <h3 className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{dept.name}</h3>
            <div className={`flex items-center justify-between text-[11px] p-3 rounded-lg border ${
              theme === 'dark' 
                ? 'text-[#AAA] bg-[#0A0A0A] border-[#1A1A1A]' 
                : 'text-[#64748B] bg-white border-gray-200'
            }`}>
              <div className="text-center flex-1">
                <span className={`text-[9px] block ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#9CA3AF]'
                }`}>Colleges</span>
                <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{dept.collegesCount}</strong>
              </div>
              <div className={`text-center flex-1 border-l border-r px-2 ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <span className={`text-[9px] block ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#9CA3AF]'
                }`}>Students</span>
                <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{dept.studentsCount}</strong>
              </div>
              <div className="text-center flex-1">
                <span className={`text-[9px] block ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#9CA3AF]'
                }`}>Tracks</span>
                <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{dept.programsCount}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 4. TRAINING PROGRAMS MANAGEMENT                                            */
  /* -------------------------------------------------------------------------- */
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
          }`}>Platform Training Programs</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Standardized industry curriculum deployed to engineering colleges</p>
        </div>
        <button
          onClick={() => setShowProgramModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
        >
          <Plus className="w-4 h-4" /> Create Training Track
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTrainingPrograms.map((prog) => (
          <div key={prog.id} className={`p-6 rounded-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 bg-[#6366F1]/10 text-[#6366F1] rounded-full border border-[#6366F1]/20">
                {prog.code}
              </span>
              <span className={`text-xs font-mono ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>{prog.durationWeeks} Weeks</span>
            </div>

            <h3 className={`font-bold text-base ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{prog.title}</h3>
            <p className={`text-xs leading-relaxed ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>{prog.description}</p>

            <div className={`pt-3 border-t flex items-center justify-between text-xs ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <span className={`font-mono ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
              }`}>{prog.enrolledStudentsCount} Students Enrolled</span>
              <button className={`px-3 py-1 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-[#1A1A1A] text-white border-[#2A2A2A]' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}>Edit Track</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 5. BATCH MANAGEMENT                                                       */
  /* -------------------------------------------------------------------------- */
  const renderBatchesView = () => (
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
          }`}>Active Academic Batches</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Active cohort schedules, assigned mentors, and attendance logs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold">
          <Plus className="w-4 h-4" /> Schedule New Batch
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-bold uppercase ${
              theme === 'dark' 
                ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                : 'border-gray-200 text-[#64748B] bg-gray-50'
            }`}>
              <th className="py-3 px-4">Batch Name & Code</th>
              <th className="py-3 px-4">Partner College</th>
              <th className="py-3 px-4">Program Track</th>
              <th className="py-3 px-4">Assigned Mentor</th>
              <th className="py-3 px-4">Students</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
            {mockBatches.map((b) => (
              <tr key={b.id} className={theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}>
                <td className={`py-3.5 px-4 font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{b.name} <span className={`block text-[10px] font-mono text-[#6366F1]`}>{b.code}</span></td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{b.college}</td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{b.program}</td>
                <td className="py-3.5 px-4 text-[#10B981] font-semibold">{b.mentor}</td>
                <td className={`py-3.5 px-4 font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{b.studentsCount}</td>
                <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 6. MENTORS DIRECTORY                                                       */
  /* -------------------------------------------------------------------------- */
  const renderMentorsView = () => (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentor Performance Bar Chart */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className={`font-bold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Mentor Performance</h3>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
              }`}>Rating, students, and attendance by mentor</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#10B981]">4.8 Avg Rating</span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mentorPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1A1A1A' : '#E5E7EB'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                <YAxis stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                    borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="rating" name="Rating" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="students" name="Students" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="attendance" name="Attendance %" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mentor Rating Distribution Pie Chart */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Mentor Rating Distribution</h3>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
            }`}>28 Active Mentors</span>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mentorRatingDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {mentorRatingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                    borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Mentors Directory */}
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
            }`}>Industry Mentor Directory</h2>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Allocated instructors, roll call records, and student evaluations</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold">
            <Plus className="w-4 h-4" /> Onboard Mentor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockMentorsList.map((m) => (
          <div key={m.id} className={`p-5 rounded-2xl border space-y-3 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={m.avatar} alt="" className={`w-10 h-10 rounded-xl object-cover border ${
                  theme === 'dark' ? 'border-[#333]' : 'border-gray-300'
                }`} />
                <div>
                  <h3 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{m.name}</h3>
                  <p className={`text-[11px] ${
                    theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                  }`}>{m.college}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#F59E0B]">★ {m.rating} Rating</span>
            </div>

            <div className={`grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg border ${
              theme === 'dark' 
                ? 'text-[#AAA] bg-[#0A0A0A] border-[#1A1A1A]' 
                : 'text-[#64748B] bg-white border-gray-200'
            }`}>
              <div><span className={`block text-[10px] ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#9CA3AF]'
              }`}>Active Batches</span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{m.batchesCount} Batches</strong></div>
              <div><span className={`block text-[10px] ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#9CA3AF]'
              }`}>Roll Call Attendance</span><strong className="text-[#10B981]">{m.attendanceRate}%</strong></div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className={theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}>{m.email}</span>
              <button onClick={() => setSelectedMentorDetail(m)} className={`px-3 py-1 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#262626]' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
              }`}>View Profile</button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 7. PARTNER COMPANIES DIRECTORY                                              */
  /* -------------------------------------------------------------------------- */
  const renderPartnerCompaniesView = () => {
    const mockPartnerCompanies = [
      {
        id: 'comp_001',
        name: 'Microsoft Corporation',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80',
        industry: 'Technology',
        location: 'Redmond, WA',
        tier: 'Enterprise',
        contactPerson: 'Sarah Johnson',
        contactEmail: 'recruitment@microsoft.com',
        totalHires: 45,
        activeDrives: 3,
        avgPackage: '24.5 LPA',
        partnershipStatus: 'Active',
        joinedDate: '2024-01-15'
      },
      {
        id: 'comp_002',
        name: 'Amazon Web Services',
        logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80',
        industry: 'Cloud Computing',
        location: 'Seattle, WA',
        tier: 'Enterprise',
        contactPerson: 'Michael Chen',
        contactEmail: 'campus@amazon.com',
        totalHires: 38,
        activeDrives: 2,
        avgPackage: '28.0 LPA',
        partnershipStatus: 'Active',
        joinedDate: '2024-02-20'
      },
      {
        id: 'comp_003',
        name: 'Google India',
        logo: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=150&q=80',
        industry: 'Technology',
        location: 'Bangalore, India',
        tier: 'Enterprise',
        contactPerson: 'Priya Sharma',
        contactEmail: 'hiring@google.com',
        totalHires: 52,
        activeDrives: 4,
        avgPackage: '32.0 LPA',
        partnershipStatus: 'Active',
        joinedDate: '2024-03-10'
      },
      {
        id: 'comp_004',
        name: 'Infosys Limited',
        logo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=150&q=80',
        industry: 'IT Services',
        location: 'Bangalore, India',
        tier: 'Strategic',
        contactPerson: 'Rajesh Kumar',
        contactEmail: 'campus@infosys.com',
        totalHires: 120,
        activeDrives: 5,
        avgPackage: '8.5 LPA',
        partnershipStatus: 'Active',
        joinedDate: '2023-08-01'
      },
      {
        id: 'comp_005',
        name: 'Tata Consultancy Services',
        logo: 'https://images.unsplash.com/photo-1587464265686-e3b0d3a9a4f8?auto=format&fit=crop&w=150&q=80',
        industry: 'IT Services',
        location: 'Mumbai, India',
        tier: 'Strategic',
        contactPerson: 'Anita Desai',
        contactEmail: 'recruitment@tcs.com',
        totalHires: 145,
        activeDrives: 6,
        avgPackage: '7.5 LPA',
        partnershipStatus: 'Active',
        joinedDate: '2023-06-15'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Placement Trend Line Chart */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className={`font-bold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Placement Offers Trend</h3>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                }`}>Monthly offers and average package progression</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#10B981]">340 Offers YTD</span>
            </div>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={placementTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1A1A1A' : '#E5E7EB'} />
                  <XAxis dataKey="month" stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                  <YAxis stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                      borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                      borderRadius: '12px', 
                      fontSize: '12px' 
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="offers" name="Offers" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} />
                  <Line type="monotone" dataKey="avgPackage" name="Avg Package (LPA)" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Company Hires Bar Chart */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className={`font-bold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Top Company Hires</h3>
              <span className={`text-xs ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
              }`}>By Average Package</span>
            </div>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyHiresData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1A1A1A' : '#E5E7EB'} />
                  <XAxis dataKey="company" stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                  <YAxis stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                      borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                      borderRadius: '12px', 
                      fontSize: '12px' 
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="hires" name="Hires" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avgPackage" name="Avg Package (LPA)" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Partner Companies Table */}
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
              }`}>Partner Companies Directory</h2>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Manage recruiting company partnerships, placement drives, and hiring metrics</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md">
              <Plus className="w-4 h-4" /> Onboard Partner Company
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
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Industry & Location</th>
                <th className="py-3 px-4">Partnership Tier</th>
                <th className="py-3 px-4">Total Hires</th>
                <th className="py-3 px-4">Active Drives</th>
                <th className="py-3 px-4">Avg Package</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
              {mockPartnerCompanies.map((company) => (
                <tr key={company.id} className={`transition-colors ${
                  theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'
                }`}>
                  <td className={`py-3.5 px-4 font-bold flex items-center gap-2.5 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <img src={company.logo} className="w-8 h-8 rounded-lg object-cover" />
                    <span>{company.name}</span>
                  </td>
                  <td className={`py-3.5 px-4 font-mono ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                  }`}>{company.industry} • {company.location}</td>
                  <td className="py-3.5 px-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    company.tier === 'Enterprise' 
                      ? 'bg-[#A855F7]/10 text-[#A855F7]' 
                      : 'bg-[#10B981]/10 text-[#10B981]'
                  }`}>{company.tier}</span></td>
                  <td className={`py-3.5 px-4 font-mono ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{company.totalHires}</td>
                  <td className={`py-3.5 px-4 font-mono ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                  }`}>{company.activeDrives}</td>
                  <td className={`py-3.5 px-4 font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{company.avgPackage}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className={`px-3 py-1 rounded-lg text-[11px] font-semibold border ${
                      theme === 'dark' 
                        ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#2A2A2A]' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                    }`}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    );
  };

  /* -------------------------------------------------------------------------- */
  /* 8. STUDENT DIRECTORY                                                       */
  /* -------------------------------------------------------------------------- */
  const renderStudentsView = () => (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Enrollment Trend Line Chart */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className={`font-bold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Student Enrollment Trend</h3>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
              }`}>Monthly enrollment, active, and graduated students</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#10B981]">14,250 Total</span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentEnrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1A1A1A' : '#E5E7EB'} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                <YAxis stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                    borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="enrolled" name="Enrolled" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} />
                <Line type="monotone" dataKey="active" name="Active" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                <Line type="monotone" dataKey="graduated" name="Graduated" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Pie Chart */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Department Distribution</h3>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
            }`}>By Student Count</span>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentDepartmentDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {studentDepartmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                    borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Directory Table */}
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
            }`}>Global Student Directory</h2>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Unified directory across 48 partner engineering colleges</p>
          </div>
          <span className="text-xs text-[#10B981] font-mono font-bold bg-[#10B981]/10 px-3 py-1 rounded-lg border border-[#10B981]/20">
            14,250 Enrolled Students
          </span>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-bold uppercase ${
              theme === 'dark' 
                ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                : 'border-gray-200 text-[#64748B] bg-gray-50'
            }`}>
              <th className="py-3 px-4">Student & USN</th>
              <th className="py-3 px-4">Partner College</th>
              <th className="py-3 px-4">Program Track</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4">Placement Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
            {mockGlobalStudents.map((s) => (
              <tr key={s.id} className={theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}>
                <td className={`py-3.5 px-4 font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{s.name} <span className={`block text-[10px] font-mono ${
                  theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                }`}>{s.usn}</span></td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{s.college} ({s.dept})</td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{s.program}</td>
                <td className="py-3.5 px-4 font-mono text-[#10B981] font-bold">{s.attendance}%</td>
                <td className="py-3.5 px-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 'At Risk' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>{s.placement}</span></td>
                <td className="py-3.5 px-4 text-right">
                  <button onClick={() => setSelectedStudentDetail(s)} className={`px-3 py-1 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#262626]' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
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
    </div>
  );

  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /* 10. CERTIFICATES ENGINE                                                    */
  /* -------------------------------------------------------------------------- */
  const renderCertificatesView = () => (
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
          }`}>Cryptographic Certificate Engine</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Tamper-evident verification URL generation and QR code ledger</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowVerifyCertModal(true)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold border ${
            theme === 'dark' 
              ? 'bg-[#1A1A1A] text-white border-[#2A2A2A]' 
              : 'bg-gray-100 text-gray-900 border-gray-300'
          }`}>
            Verify QR Hash
          </button>
          <button className="px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold">
            Batch Issue Certificates
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-bold uppercase ${
              theme === 'dark' 
                ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                : 'border-gray-200 text-[#64748B] bg-gray-50'
            }`}>
              <th className="py-3 px-4">Certificate ID</th>
              <th className="py-3 px-4">Student & College</th>
              <th className="py-3 px-4">Program Track</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">QR Hash</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
            {mockCertificatesList.map((cert) => (
              <tr key={cert.id} className={theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}>
                <td className="py-3.5 px-4 font-mono font-bold text-[#6366F1]">{cert.id}</td>
                <td className={`py-3.5 px-4 font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{cert.student} <span className={`block text-[10px] ${
                  theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                }`}>{cert.college}</span></td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{cert.program}</td>
                <td className={`py-3.5 px-4 font-mono ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>{cert.issueDate}</td>
                <td className="py-3.5 px-4 font-mono text-[10px] text-[#10B981]">{cert.verifyCode}</td>
                <td className="py-3.5 px-4 text-right">
                  <button className={`px-3 py-1 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#262626]' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                  }`}>
                    Preview PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 11. PAYMENTS & REVENUE                                                     */
  /* -------------------------------------------------------------------------- */
  const renderPaymentsView = () => (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Line Chart */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className={`font-bold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Revenue Trend</h3>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
              }`}>Monthly revenue and collection progression</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#10B981]">₹5.2 Cr Jul</span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1A1A1A' : '#E5E7EB'} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                <YAxis stroke={theme === 'dark' ? '#666' : '#64748B'} fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                    borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="revenue" name="Revenue (Cr)" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} />
                <Line type="monotone" dataKey="collected" name="Collected (Cr)" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Source Pie Chart */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Revenue Sources</h3>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
            }`}>Current Month</span>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueSourceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {revenueSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                    borderColor: theme === 'dark' ? '#222' : '#E5E7EB', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payments Table */}
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
            }`}>Institutional Payments & Invoices</h2>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Subscription fee tracking and automated receipt generation</p>
          </div>
          <span className="text-xs text-[#F59E0B] font-mono font-bold bg-[#F59E0B]/10 px-3 py-1 rounded-lg border border-[#F59E0B]/20">
            Total Platform ARR: ₹7.20 Cr
          </span>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-bold uppercase ${
              theme === 'dark' 
                ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                : 'border-gray-200 text-[#64748B] bg-gray-50'
            }`}>
              <th className="py-3 px-4">Invoice ID</th>
              <th className="py-3 px-4">Partner College</th>
              <th className="py-3 px-4">Plan Tier</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
            {mockPaymentsList.map((p) => (
              <tr key={p.id} className={theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}>
                <td className="py-3.5 px-4 font-mono font-bold text-[#6366F1]">{p.id}</td>
                <td className={`py-3.5 px-4 font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{p.college}</td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{p.plan}</td>
                <td className={`py-3.5 px-4 font-mono font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{p.amount}</td>
                <td className={`py-3.5 px-4 font-mono ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>{p.dueDate}</td>
                <td className="py-3.5 px-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'Paid' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{p.status}</span></td>
                <td className="py-3.5 px-4 text-right">
                  <button className={`px-3 py-1 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#262626]' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                  }`}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 12. ASSESSMENTS VIEW                                                       */
  /* -------------------------------------------------------------------------- */
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
          }`}>Assessments Management</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Configure and manage assessment templates, schedules, and results</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold">
          <Plus className="w-4 h-4" /> Create Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assessments', value: '156', change: '+12%', color: '#6366F1' },
          { label: 'Active This Month', value: '24', change: '+8%', color: '#10B981' },
          { label: 'Completed', value: '1,245', change: '+15%', color: '#A855F7' },
          { label: 'Avg Score', value: '78%', change: '+3%', color: '#F59E0B' }
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
              {['Assessment Name', 'Type', 'Program', 'Status', 'Date', 'Participants', 'Actions'].map((header) => (
                <th key={header} className={`py-3 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Full-Stack Final Exam', type: 'Technical', program: 'Enterprise Full-Stack', status: 'Active', date: 'Aug 15, 2026', participants: 45 },
              { name: 'ML Fundamentals Quiz', type: 'Quiz', program: 'Applied AI & ML', status: 'Completed', date: 'Aug 10, 2026', participants: 38 },
              { name: 'Cloud Architecture Assessment', type: 'Practical', program: 'Cloud DevOps', status: 'Scheduled', date: 'Aug 20, 2026', participants: 52 },
              { name: 'Product Management Case Study', type: 'Project', program: 'Tech Product Management', status: 'Active', date: 'Aug 18, 2026', participants: 28 }
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
                }`}>{assessment.program}</td>
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
                }`}>{assessment.participants}</td>
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

  /* -------------------------------------------------------------------------- */
  /* 13. REPORTS & ANALYTICS                                                    */
  /* -------------------------------------------------------------------------- */
  const renderReportsView = () => (
    <AnalyticsBI userRole="super_admin" />
  );

  /* -------------------------------------------------------------------------- */
  /* 13. NOTIFICATIONS BROADCAST CENTER                                         */
  /* -------------------------------------------------------------------------- */
  const renderNotificationsView = () => (
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
          }`}>Broadcast Center</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Send multi-channel announcements to colleges, mentors, and students</p>
        </div>
        <button onClick={() => setShowBroadcastModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold">
          <Send className="w-4 h-4" /> Compose Broadcast
        </button>
      </div>

      <div className="space-y-3">
        {[
          { title: 'Academic Session 2026 Quarter 3 Calendar Released', audience: 'All Partner Colleges & Mentors', date: '2026-08-01', channel: 'In-App + Email' },
          { title: 'Urgent System Maintenance Scheduled for Sunday 2 AM', audience: 'All Platform Users', date: '2026-07-28', channel: 'In-App Banner' },
          { title: 'Placement Drive Readiness Webinar for Final Year Students', audience: 'Final Year Engineering Students', date: '2026-07-20', channel: 'Email + SMS' },
        ].map((b, i) => (
          <div key={i} className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div>
              <h4 className={`font-bold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{b.title}</h4>
              <p className={`mt-0.5 ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Audience: {b.audience} • Channel: {b.channel}</p>
            </div>
            <span className={`font-mono ${
              theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
            }`}>{b.date}</span>
          </div>
        ))}
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 14. AUDIT & SECURITY LOGS                                                  */
  /* -------------------------------------------------------------------------- */
  const renderAuditLogsView = () => (
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
          }`}>System Security & Audit Ledger</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Immutable audit trail tracking every administrative event</p>
        </div>
        <button onClick={onOpenAuditLogs} className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
          theme === 'dark' 
            ? 'bg-[#1A1A1A] text-white border-[#2A2A2A]' 
            : 'bg-gray-100 text-gray-900 border-gray-300'
        }`}>
          Export Audit Trail
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-bold uppercase ${
              theme === 'dark' 
                ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                : 'border-gray-200 text-[#64748B] bg-gray-50'
            }`}>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Event Action</th>
              <th className="py-3 px-4">Module</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
            {mockAuditLogs.map((log) => (
              <tr key={log.id} className={theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}>
                <td className={`py-3.5 px-4 font-mono ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>{log.timestamp}</td>
                <td className={`py-3.5 px-4 font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{log.userEmail}</td>
                <td className="py-3.5 px-4 text-[#A855F7] font-semibold">{log.userRole}</td>
                <td className={`py-3.5 px-4 font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{log.action}</td>
                <td className={`py-3.5 px-4 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>{log.module}</td>
                <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold">{log.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 15. SUPPORT TICKETS                                                        */
  /* -------------------------------------------------------------------------- */
  const renderTicketsView = () => (
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
          }`}>System Support Tickets</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Helpdesk requests from College Admins and Placement Officers</p>
        </div>
        <span className="text-xs text-[#6366F1] font-mono font-bold bg-[#6366F1]/10 px-3 py-1 rounded-lg border border-[#6366F1]/20">
          3 Open Tickets
        </span>
      </div>

      <div className="space-y-3">
        {mockSupportTickets.map((t) => (
          <div key={t.id} className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#6366F1]">{t.id}</span>
                <span className={`font-bold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{t.title}</span>
              </div>
              <p className={theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}>{t.requester} • {t.college}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                t.priority === 'Urgent' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
              }`}>{t.priority}</span>
              <button className={`px-3 py-1 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-[#1A1A1A] hover:bg-[#222] text-white border-[#262626]' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
              }`}>
                Resolve Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 16. SYSTEM SETTINGS                                                         */
  /* -------------------------------------------------------------------------- */
  const renderSettingsView = () => (
    <EnterpriseSettings userRole="super_admin" />
  );

  /* -------------------------------------------------------------------------- */
  /* 17. ADMIN PROFILE                                                          */
  /* -------------------------------------------------------------------------- */
  const renderProfileView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 max-w-2xl ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center gap-4 pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#A855F7] flex items-center justify-center text-white font-extrabold text-2xl">
          HQ
        </div>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Super Admin HQ Profile</h2>
          <p className="text-xs text-[#6366F1] font-semibold">LearnIT Platform Master Governance Account</p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>aris.thorne@learnit.hq • Root Privilege Level</p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <div className={`p-4 rounded-xl border space-y-2 ${
          theme === 'dark' 
            ? 'bg-[#111] border-[#222]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <span className={`font-bold block ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Active Root Sessions</span>
          <p className={theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}>Logged in from Chrome on macOS • IP: 182.74.92.11 (Bangalore HQ)</p>
        </div>

        <button className={`px-4 py-2 rounded-xl border font-semibold ${
          theme === 'dark' 
            ? 'bg-[#1A1A1A] text-white border-[#2A2A2A]' 
            : 'bg-gray-100 text-gray-900 border-gray-300'
        }`}>
          Change Root Security Credentials
        </button>
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* ROUTER BY ACTIVE TAB                                                       */
  /* -------------------------------------------------------------------------- */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboardView();
      case 'colleges': return renderCollegesView();
      case 'departments': return renderDepartmentsView();
      case 'programs': return renderProgramsView();
      case 'courses': return renderProgramsView();
      case 'batches': return renderBatchesView();
      case 'mentors': return renderMentorsView();
      case 'students': return renderStudentsView();
      case 'placements': return renderPartnerCompaniesView();
      case 'attendance': return renderAuditLogsView();
      case 'assessments': return renderAssessmentsView();
      case 'payments': return renderPaymentsView();
      case 'reports': return renderReportsView();
      case 'notifications': return renderNotificationsView();
      case 'messages': return renderNotificationsView();
      case 'settings': return renderSettingsView();
      case 'profile': return renderProfileView();
      default: return renderDashboardView();
    }
  };

  return (
    <div className="space-y-6">
      {renderTabContent()}

      {/* Onboard College Modal */}
      {showAddCollegeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0A0A0A] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#1A1A1A] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]">
              <h3 className="text-lg font-bold text-white">Onboard Partner College</h3>
              <button onClick={() => setShowAddCollegeModal(false)} className="p-1 text-[#666] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollege} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-[#AAA] font-bold mb-1">College Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Institute of Tech"
                  value={newCollege.name}
                  onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                  className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#AAA] font-bold mb-1">College Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIT-SUR"
                    value={newCollege.code}
                    onChange={(e) => setNewCollege({ ...newCollege, code: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] font-bold mb-1">City Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Surat"
                    value={newCollege.location}
                    onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1A1A1A]">
                <button type="button" onClick={() => setShowAddCollegeModal(false)} className="px-4 py-2 text-[#888]">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#6366F1] text-white font-bold rounded-xl">Provision Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0A0A0A] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#1A1A1A] text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <h3 className="text-base font-bold text-white">Broadcast Announcement</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="p-1 text-[#666] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#888] font-bold block mb-1">Announcement Subject</label>
                <input type="text" placeholder="e.g. Q3 Exam & Drive Schedule" className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white" />
              </div>
              <div>
                <label className="text-[#888] font-bold block mb-1">Target Audience</label>
                <select className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white">
                  <option>All Partner Colleges & Mentors</option>
                  <option>Final Year Engineering Students</option>
                  <option>Placement Officers Only</option>
                </select>
              </div>
              <div>
                <label className="text-[#888] font-bold block mb-1">Message Body</label>
                <textarea rows={3} placeholder="Enter broadcast text..." className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white" />
              </div>

              <button
                onClick={() => setShowBroadcastModal(false)}
                className="w-full py-2.5 bg-[#6366F1] text-white font-bold rounded-xl mt-2"
              >
                Send Broadcast Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Placement Drive Modal */}
      {showPlacementDriveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0A0A0A] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#1A1A1A] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]">
              <h3 className="text-lg font-bold text-white">Create Placement Drive</h3>
              <button onClick={() => setShowPlacementDriveModal(false)} className="p-1 text-[#666] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlacementDrive} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-[#AAA] font-bold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microsoft Corporation"
                  value={newPlacementDrive.companyName}
                  onChange={(e) => setNewPlacementDrive({ ...newPlacementDrive, companyName: e.target.value })}
                  className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#AAA] font-bold mb-1">Job Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Development Engineer"
                    value={newPlacementDrive.jobRole}
                    onChange={(e) => setNewPlacementDrive({ ...newPlacementDrive, jobRole: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] font-bold mb-1">Package (CTC) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24.5 LPA"
                    value={newPlacementDrive.package}
                    onChange={(e) => setNewPlacementDrive({ ...newPlacementDrive, package: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#AAA] font-bold mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore/Hyderabad"
                    value={newPlacementDrive.location}
                    onChange={(e) => setNewPlacementDrive({ ...newPlacementDrive, location: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] font-bold mb-1">Drive Date *</label>
                  <input
                    type="date"
                    required
                    value={newPlacementDrive.driveDate}
                    onChange={(e) => setNewPlacementDrive({ ...newPlacementDrive, driveDate: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#AAA] font-bold mb-1">Eligibility Criteria *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech CSE/IT, CGPA >= 7.5, No Active Backlogs"
                  value={newPlacementDrive.eligibility}
                  onChange={(e) => setNewPlacementDrive({ ...newPlacementDrive, eligibility: e.target.value })}
                  className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-[#AAA] font-bold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the role and responsibilities..."
                  value={newPlacementDrive.description}
                  onChange={(e) => setNewPlacementDrive({ ...newPlacementDrive, description: e.target.value })}
                  className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-[#AAA] font-bold mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Python, AWS"
                  value={newPlacementDrive.requiredSkills.join(', ')}
                  onChange={(e) => setNewPlacementDrive({ 
                    ...newPlacementDrive, 
                    requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1A1A1A]">
                <button type="button" onClick={() => setShowPlacementDriveModal(false)} className="px-4 py-2 text-[#888]">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#6366F1] text-white font-bold rounded-xl">Create Drive</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal / Drawer */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0A0A0A] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#1A1A1A] text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div>
                <h3 className="text-base font-bold text-white">{selectedStudentDetail.name}</h3>
                <p className="text-xs font-mono text-[#6366F1]">{selectedStudentDetail.usn} • {selectedStudentDetail.college}</p>
              </div>
              <button onClick={() => setSelectedStudentDetail(null)} className="p-1 text-[#666] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#111] p-3 rounded-xl border border-[#222]">
              <div><span className="text-[#666] block">Department</span><strong className="text-white">{selectedStudentDetail.dept}</strong></div>
              <div><span className="text-[#666] block">Batch</span><strong className="text-white">{selectedStudentDetail.batch}</strong></div>
              <div><span className="text-[#666] block">Attendance Rate</span><strong className="text-[#10B981]">{selectedStudentDetail.attendance}%</strong></div>
              <div><span className="text-[#666] block">Placement Offer</span><strong className="text-[#10B981]">{selectedStudentDetail.placement}</strong></div>
            </div>

            <button onClick={() => setSelectedStudentDetail(null)} className="w-full py-2 bg-[#1A1A1A] text-white rounded-xl text-xs font-semibold">
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Mentor Detail Modal / Drawer */}
      {selectedMentorDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0A0A0A] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#1A1A1A] text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <img src={selectedMentorDetail.avatar} className="w-12 h-12 rounded-xl object-cover border border-[#333]" />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedMentorDetail.name}</h3>
                  <p className="text-xs text-[#888]">{selectedMentorDetail.college}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMentorDetail(null)} className="p-1 text-[#666] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#111] p-3 rounded-xl border border-[#222]">
              <div><span className="text-[#666] block">Email</span><strong className="text-white">{selectedMentorDetail.email}</strong></div>
              <div><span className="text-[#666] block">Rating</span><strong className="text-[#F59E0B]">★ {selectedMentorDetail.rating}</strong></div>
              <div><span className="text-[#666] block">Roll Call Compliance</span><strong className="text-[#10B981]">{selectedMentorDetail.attendanceRate}%</strong></div>
              <div><span className="text-[#666] block">Active Batches</span><strong className="text-white">{selectedMentorDetail.batchesCount} Batches</strong></div>
            </div>

            <button onClick={() => setSelectedMentorDetail(null)} className="w-full py-2 bg-[#1A1A1A] text-white rounded-xl text-xs font-semibold">
              Close Profile
            </button>
          </div>
        </div>
      )}

    </div>
  );

  // Main render with tab switching
  return (
    <div className="space-y-6">
      {activeTab === 'dashboard' && renderDashboardView()}
      {activeTab === 'colleges' && renderCollegesView()}
      {activeTab === 'placements' && renderPlacementDrivesView()}
      {/* Other tabs would be added here */}
    </div>
  );
};
