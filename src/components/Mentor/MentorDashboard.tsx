import React, { useState, useEffect } from 'react';
import {
  Batch,
  Student,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  LearningMaterial
} from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useClasses } from '../../hooks/useClasses';
import { useMentorStats } from '../../hooks/useMentorStats';
import { useAttendance } from '../../hooks/useAttendance';
import { useAssignments } from '../../hooks/useAssignments';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useMaterials } from '../../hooks/useMaterials';
import { useVideos } from '../../hooks/useVideos';
import { getStudentsByClass } from '../../services/firebase/students.service';
import { AnalyticsBI } from '../Analytics/AnalyticsBI';
import { AssignmentsManager } from './AssignmentsManager';
import {
  BookOpen,
  UserCheck,
  FileCheck,
  Video,
  Award,
  Users,
  LayoutDashboard,
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Upload,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Bell,
  User,
  TrendingUp,
  BarChart3,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  X,
  Send,
  Edit,
  Trash2,
  QrCode,
  Lock,
  RefreshCw,
  FileText,
  Check,
  Eye,
  Star,
  Download,
  HelpCircle,
  Zap,
  Play,
  Share2,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Activity,
  CalendarDays
} from 'lucide-react';

interface MentorDashboardProps {
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

// Empty data structures - ready for backend integration
const mockClassesSchedule: any[] = [];
const mockAssessmentsList: any[] = [];
const mockVideoRecordings: any[] = [];
const mockAnnouncementsList: any[] = [];
const mockPlacementStudents: any[] = [];
const mockMessages: any[] = [];
const mockNotificationsList: any[] = [];

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  activeTab = 'dashboard',
  onSelectTab
}) => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const { classes, loading: classesLoading, error: classesError, addClass, updateClassData, removeClass } = useClasses();
  const { stats, loading: statsLoading, error: statsError } = useMentorStats();
  
  // Attendance state - need to select a class first
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState<string>('');
  const {
    attendance: attendanceRecordsFromFirebase,
    loading: attendanceLoading,
    error: attendanceError,
    markBulkStudentAttendance,
    fetchAttendanceByClassAndDate
  } = useAttendance(selectedClassForAttendance, new Date().toISOString().split('T')[0]);
  
  // Load students when class is selected
  useEffect(() => {
    if (selectedClassForAttendance) {
      loadStudentsForClass(selectedClassForAttendance);
    } else {
      setStudentsList([]);
    }
  }, [selectedClassForAttendance]);

  const loadStudentsForClass = async (classId: string) => {
    try {
      const students = await getStudentsByClass(classId);
      setStudentsList(students.map(s => ({
        ...s,
        attendancePct: 85 // Mock for now, will calculate later
      })) as any);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudentsList([]);
    }
  };
  
  // State variables
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('All');
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>('');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<any | null>(null);

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrTimer, setQrTimer] = useState(45);
  const [savedSuccessAlert, setSavedSuccessAlert] = useState(false);

  // Assignments & Grading - Firebase Integration
  const {
    assignments,
    submissions,
    loading: assignmentsLoading,
    error: assignmentsError,
    addAssignment,
    removeAssignment,
    updateAssignmentData,
    fetchSubmissions,
    gradeStudentSubmission
  } = useAssignments();
  
  // Firebase Materials Integration
  const {
    materials,
    loading: materialsLoading,
    error: materialsError,
    addMaterial,
    removeMaterial
  } = useMaterials();
  
  // Firebase Videos Integration
  const {
    videos: firebaseVideos,
    loading: videosLoading,
    addVideo
  } = useVideos();
  
  // Use Firebase videos or fallback to mock
  const videos = firebaseVideos.length > 0 ? firebaseVideos : mockVideoRecordings;
  
  // Firebase Announcements Integration
  const {
    announcements: firebaseAnnouncements,
    loading: announcementsLoading,
    addAnnouncement
  } = useAnnouncements();
  
  // Use Firebase announcements or fallback to mock
  const announcements = firebaseAnnouncements.length > 0 ? firebaseAnnouncements : mockAnnouncementsList;
  
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(95);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDeadline, setNewAssignmentDeadline] = useState('2026-08-15');
  // Additional assignment form fields
  const [selectedClassForAssignment, setSelectedClassForAssignment] = useState<string>('');
  const [newAssignmentDescription, setNewAssignmentDescription] = useState('');
  const [newAssignmentInstructions, setNewAssignmentInstructions] = useState('');
  const [newAssignmentMaxMarks, setNewAssignmentMaxMarks] = useState(100);
  const [newAssignmentFile, setNewAssignmentFile] = useState<File | undefined>(undefined);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] = useState<any>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);

  // Assessments state
  const [assessments, setAssessments] = useState(mockAssessmentsList);
  const [showCreateAssessmentModal, setShowCreateAssessmentModal] = useState(false);
  const [newAssessmentTitle, setNewAssessmentTitle] = useState('');
  const [newAssessmentType, setNewAssessmentType] = useState('Coding Test');

  // Study Materials state - Firebase Integration
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatType, setNewMatType] = useState<'Video' | 'PDF' | 'Code Sandbox'>('PDF');
  const [newMatDesc, setNewMatDesc] = useState('');
  const [newMatFile, setNewMatFile] = useState<File | null>(null);
  const [newMatUrl, setNewMatUrl] = useState('');

  // Video Library state - Firebase integrated above
  const [showUploadVideoModal, setShowUploadVideoModal] = useState(false);
  const [activePlayingVideo, setActivePlayingVideo] = useState<any | null>(null);

  // Announcements state - Firebase integrated above
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnBody, setNewAnnBody] = useState('');

  // AI Tools state
  const [showAiLessonModal, setShowAiLessonModal] = useState(false);
  const [showAiQuestionModal, setShowAiQuestionModal] = useState(false);
  const [aiGeneratedOutput, setAiGeneratedOutput] = useState('');

  // Create Class state
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [newClassTitle, setNewClassTitle] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [newClassBatchName, setNewClassBatchName] = useState('');
  const [newClassProgramTitle, setNewClassProgramTitle] = useState('');
  const [newClassScheduleDay, setNewClassScheduleDay] = useState('');
  const [newClassStartTime, setNewClassStartTime] = useState('');
  const [newClassEndTime, setNewClassEndTime] = useState('');
  const [newClassStartDate, setNewClassStartDate] = useState('');
  const [newClassEndDate, setNewClassEndDate] = useState('');
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // Edit Class state
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<any | null>(null);
  const [isUpdatingClass, setIsUpdatingClass] = useState(false);

  // Delete Class state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);
  const [isDeletingClass, setIsDeletingClass] = useState(false);

  // Messaging state
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([
    {
      id: 1,
      studentName: 'Arun Kumar',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      batch: 'Enterprise Full-Stack 2026-A',
      unread: true,
      lastMessage: 'Sir, I have a doubt regarding the assignment.',
      lastTime: '2 min ago',
      messages: [
        {
          id: 1,
          sender: 'student',
          name: 'Arun Kumar',
          text: 'Sir, I have a doubt regarding the assignment.',
          time: '10:42 AM'
        },
        {
          id: 2,
          sender: 'mentor',
          name: 'Ananya Deshmukh',
          text: 'Sure Arun. Please check the examples discussed in today\'s class. If you still have doubts, send me the question here.',
          time: '10:45 AM'
        }
      ]
    },
    {
      id: 2,
      studentName: 'Priya Sharma',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      batch: 'Applied AI & ML 2026-B',
      unread: false,
      lastMessage: 'When will the next assessment be conducted?',
      lastTime: '1 hr ago',
      messages: [
        {
          id: 1,
          sender: 'student',
          name: 'Priya Sharma',
          text: 'When will the next assessment be conducted?',
          time: '09:30 AM'
        },
        {
          id: 2,
          sender: 'mentor',
          name: 'Ananya Deshmukh',
          text: 'The next assessment is scheduled for Friday.',
          time: '09:35 AM'
        }
      ]
    }
  ]);

  // Messaging handlers
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: selectedConversation.messages.length + 1,
      sender: 'mentor',
      name: mentorProfile.name,
      text: messageInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setConversations((prev: any[]) => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          lastTime: 'Just now'
        };
      }
      return conv;
    }));

    setSelectedConversation((prev: any) => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    setMessageInput('');
  };
  // Use mentor profile from Firebase Auth Context
  const mentorProfile = {
    name: userProfile?.name || 'Mentor',
    title: userProfile?.designation || 'Mentor',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    qualifications: userProfile?.qualifications || '',
    skills: userProfile?.skills || [],
    assignedPrograms: userProfile?.assignedPrograms || [],
    assignedBatches: userProfile?.assignedBatches || []
  };

  // Action Center helpers
  const handleStatusToggle = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    studentsList.forEach(s => { updated[s.id] = 'Present'; });
    setAttendanceRecords(updated);
  };

  const handleSaveAttendance = async () => {
    if (!userProfile || !selectedClassForAttendance) {
      alert('Please select a class first');
      return;
    }

    try {
      // Get selected class details
      const selectedClass = classes.find(c => c.id === selectedClassForAttendance);
      if (!selectedClass) {
        alert('Class not found');
        return;
      }

      // Convert attendance records to Firebase format
      const attendanceData = studentsList.map(student => ({
        classId: selectedClassForAttendance,
        studentId: student.id,
        studentName: student.name,
        mentorId: userProfile.id,
        date: attendanceDate,
        status: attendanceRecords[student.id] || 'Present',
        markedBy: userProfile.name
      }));

      // Save to Firebase
      await markBulkStudentAttendance(attendanceData);
      
      setSavedSuccessAlert(true);
      setTimeout(() => setSavedSuccessAlert(false), 3000);
      
      alert('Attendance saved successfully!');
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance: ' + error.message);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      // Save grade to Firebase
      await gradeStudentSubmission(
        selectedSubmission.id,
        gradeScore,
        gradeFeedback || 'Good work!'
      );
      
      // Refresh submissions if we have the assignment ID
      if (selectedSubmission.assignmentId) {
        await fetchSubmissions(selectedSubmission.assignmentId);
      }
      
      // Reset form
      setSelectedSubmission(null);
      setGradeScore(95);
      setGradeFeedback('');
      
      alert('Submission graded successfully!');
    } catch (error: any) {
      console.error('Error grading submission:', error);
      alert('Failed to grade submission: ' + error.message);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAssignmentTitle || !userProfile || !selectedClassForAssignment) {
      alert('Please fill all required fields and select a class');
      return;
    }

    try {
      // Get selected class details
      const selectedClass = classes.find(c => c.id === selectedClassForAssignment);
      if (!selectedClass) {
        alert('Please select a valid class');
        return;
      }

      const assignmentData = {
        title: newAssignmentTitle,
        description: newAssignmentDescription || 'Complete the assignment as instructed',
        mentorId: userProfile.id,
        mentorName: userProfile.name,
        classId: selectedClassForAssignment,
        dueDate: newAssignmentDeadline,
        maxMarks: newAssignmentMaxMarks,
        instructions: newAssignmentInstructions || ''
      };

      // Create assignment in Firebase
      await addAssignment(assignmentData, newAssignmentFile);
      
      // Reset form
      setShowCreateAssignmentModal(false);
      setNewAssignmentTitle('');
      setNewAssignmentDescription('');
      setNewAssignmentDeadline('2026-08-15');
      setNewAssignmentMaxMarks(100);
      setNewAssignmentInstructions('');
      setNewAssignmentFile(undefined);
      setSelectedClassForAssignment('');
      
      alert('Assignment created successfully!');
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment: ' + error.message);
    }
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssessmentTitle) return;

    const newAsm = {
      id: `asm_${Date.now()}`,
      title: newAssessmentTitle,
      type: newAssessmentType,
      batch: 'Enterprise Full-Stack 2026-A',
      totalMarks: 100,
      date: new Date().toISOString().split('T')[0],
      evaluatedCount: 0,
      totalCount: 60,
      status: 'Scheduled'
    };

    setAssessments([newAsm, ...assessments]);
    setShowCreateAssessmentModal(false);
    setNewAssessmentTitle('');
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle || !newMatFile || !userProfile) return;

    try {
      const materialData = {
        title: newMatTitle,
        type: newMatType as 'Video' | 'PDF' | 'Code Sandbox' | 'Slides',
        description: newMatDesc || '',
        classId: selectedClass?.id || classes[0]?.id || 'default-class',
        className: selectedClass?.name || classes[0]?.name || 'General',
        mentorId: userProfile.id,
        mentorName: userProfile.displayName || userProfile.name || 'Mentor',
        uploadedAt: new Date().toISOString(),
        tags: []
      };

      await addMaterial(materialData, newMatFile);
      
      // Reset form
      setShowUploadMaterialModal(false);
      setNewMatTitle('');
      setNewMatDesc('');
      setNewMatFile(null);
      setNewMatUrl('');
      
      alert('Material uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload material:', error);
      alert('Failed to upload material. Please try again.');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !userProfile) return;

    try {
      const announcementData = {
        title: newAnnTitle,
        message: newAnnBody,
        mentorId: userProfile.id,
        mentorName: userProfile.displayName || userProfile.name || 'Mentor',
        classId: selectedClass?.id || classes[0]?.id || 'default-class',
        priority: 'High' as 'High' | 'Medium' | 'Low'
      };

      await addAnnouncement(announcementData);
      
      // Reset form
      setShowCreateAnnouncementModal(false);
      setNewAnnTitle('');
      setNewAnnBody('');
      
      alert('Announcement created successfully!');
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement. Please try again.');
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !newClassTitle || !newClassBatchName) return;

    try {
      setIsCreatingClass(true);
      
      await addClass({
        title: newClassTitle,
        description: newClassDescription,
        mentorId: userProfile.id,
        mentorName: userProfile.name,
        schedule: {
          day: newClassScheduleDay || 'Monday',
          startTime: newClassStartTime || '10:00 AM',
          endTime: newClassEndTime || '12:00 PM'
        },
        startDate: newClassStartDate || new Date().toISOString().split('T')[0],
        endDate: newClassEndDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        batchName: newClassBatchName,
        programTitle: newClassProgramTitle || 'General Program',
        studentIds: []
      });

      // Reset form
      setShowCreateClassModal(false);
      setNewClassTitle('');
      setNewClassDescription('');
      setNewClassBatchName('');
      setNewClassProgramTitle('');
      setNewClassScheduleDay('');
      setNewClassStartTime('');
      setNewClassEndTime('');
      setNewClassStartDate('');
      setNewClassEndDate('');
      
      alert('Class created successfully!');
    } catch (error: any) {
      console.error('Error creating class:', error);
      alert('Failed to create class: ' + error.message);
    } finally {
      setIsCreatingClass(false);
    }
  };

  const handleEditClass = (cls: any) => {
    setEditingClass(cls);
    setNewClassTitle(cls.title);
    setNewClassDescription(cls.description || '');
    setNewClassBatchName(cls.batchName);
    setNewClassProgramTitle(cls.programTitle || '');
    setNewClassScheduleDay(cls.schedule?.day || '');
    setNewClassStartTime(cls.schedule?.startTime || '');
    setNewClassEndTime(cls.schedule?.endTime || '');
    setNewClassStartDate(cls.startDate || '');
    setNewClassEndDate(cls.endDate || '');
    setShowEditClassModal(true);
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !newClassTitle || !newClassBatchName) return;

    try {
      setIsUpdatingClass(true);
      
      await updateClassData(editingClass.id, {
        title: newClassTitle,
        description: newClassDescription,
        schedule: {
          day: newClassScheduleDay || 'Monday',
          startTime: newClassStartTime || '10:00 AM',
          endTime: newClassEndTime || '12:00 PM'
        },
        startDate: newClassStartDate,
        endDate: newClassEndDate,
        batchName: newClassBatchName,
        programTitle: newClassProgramTitle || 'General Program'
      });

      // Reset form
      setShowEditClassModal(false);
      setEditingClass(null);
      setNewClassTitle('');
      setNewClassDescription('');
      setNewClassBatchName('');
      setNewClassProgramTitle('');
      setNewClassScheduleDay('');
      setNewClassStartTime('');
      setNewClassEndTime('');
      setNewClassStartDate('');
      setNewClassEndDate('');
      
      alert('Class updated successfully!');
    } catch (error: any) {
      console.error('Error updating class:', error);
      alert('Failed to update class: ' + error.message);
    } finally {
      setIsUpdatingClass(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!deletingClassId) return;

    try {
      setIsDeletingClass(true);
      await removeClass(deletingClassId);
      setShowDeleteConfirm(false);
      setDeletingClassId(null);
      alert('Class deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class: ' + error.message);
    } finally {
      setIsDeletingClass(false);
    }
  };

  const openDeleteConfirm = (classId: string) => {
    setDeletingClassId(classId);
    setShowDeleteConfirm(true);
  };

  // Render Sub-Views based on activeTab

  /* -------------------------------------------------------------------------- */
  /* 1. DASHBOARD OVERVIEW ("What Should I Do Today?")                          */
  /* -------------------------------------------------------------------------- */
  const renderDashboardView = () => (
    <div className="space-y-6">
      
      {/* Mentor Header Profile Banner */}
      <div className={`rounded-2xl p-6 border shadow-lg relative overflow-hidden transition-all duration-250 ${
        theme === 'dark' 
          ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)] text-white' 
          : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900'
      }`}>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[#10B981] font-semibold text-xs tracking-[0.15em] uppercase mb-1">
              <BookOpen className="w-4 h-4 text-[#10B981]" /> Faculty & Mentor Workbench
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Welcome back, {mentorProfile.name}</h1>
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>
              {mentorProfile.title} • {stats.totalClasses} Active Classes • {stats.totalStudents} Students Mentored
            </p>
            <div className={`flex flex-wrap items-center gap-3 text-xs mt-2 ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>
              <span className="flex items-center gap-1.5 font-medium text-[#AAA]">
                <Calendar className="w-3.5 h-3.5 text-[#6366F1]" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className={theme === 'dark' ? 'text-[#333]' : 'text-gray-300'}>|</span>
              <span className={`px-2 py-0.5 rounded-md border font-mono ${
                theme === 'dark' 
                  ? 'bg-[#141414] border-[#222] text-[#DDD]' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}>{mentorProfile.assignedPrograms[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onSelectTab?.('attendance')}
              className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <UserCheck className="w-4 h-4" /> Take Attendance
            </button>
            <button
              onClick={() => setShowCreateAssignmentModal(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                theme === 'dark' 
                  ? 'bg-[#1A1A1A] hover:bg-[#222] text-white border-[#333]' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
              }`}
            >
              <Plus className="w-4 h-4 text-[#6366F1]" /> Create Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Analytics Cards Grid (12 Key Metrics) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-xs font-bold uppercase tracking-[0.2em] ${
            theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
          }`}>Performance Analytics</h2>
          <button onClick={() => onSelectTab?.('analytics')} className="text-[11px] text-[#6366F1] font-semibold hover:underline flex items-center gap-1">
            View Full Analytics <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(99,102,241,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Total Students</span>
            <div className={`text-xl font-extrabold mt-1.5 font-mono ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{stats.totalStudents}</div>
            <span className="text-[10px] text-[#10B981] mt-0.5 block">Across {stats.totalClasses} Classes</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Today's Attendance</span>
            <div className="text-xl font-extrabold text-[#10B981] mt-1.5 font-mono">
              {stats.todaysAttendance}%
            </div>
            <span className="text-[10px] text-[#10B981] mt-0.5 block">Live Tracking</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(245,158,11,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(245,158,11,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Assignments Pending</span>
            <div className="text-xl font-extrabold text-[#F59E0B] mt-1.5 font-mono">{stats.assignmentsPending}</div>
            <span className="text-[10px] text-[#F59E0B] mt-0.5 block">Action Required</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Assignments Reviewed</span>
            <div className="text-xl font-extrabold text-[#10B981] mt-1.5 font-mono">{stats.assignmentsReviewed}</div>
            <span className="text-[10px] text-[#10B981] mt-0.5 block">This Month</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(168,85,247,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(168,85,247,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Avg Performance</span>
            <div className={`text-xl font-extrabold mt-1.5 font-mono ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{stats.avgPerformance}%</div>
            <span className="text-[10px] text-[#A855F7] mt-0.5 block">Based on Graded Work</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Avg Attendance</span>
            <div className={`text-xl font-extrabold mt-1.5 font-mono ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.avgAttendance}%
            </div>
            <span className="text-[10px] text-[#10B981] mt-0.5 block">QR Verified</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(59,130,246,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Recorded Sessions</span>
            <div className={`text-xl font-extrabold mt-1.5 font-mono ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{stats.materialsUploaded}</div>
            <span className="text-[10px] text-[#6366F1] mt-0.5 block">This Semester</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Materials Uploaded</span>
            <div className={`text-xl font-extrabold mt-1.5 font-mono ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{stats.materialsUploaded}</div>
            <span className="text-[10px] text-[#10B981] mt-0.5 block">Study Resources</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Videos Uploaded</span>
            <div className={`text-xl font-extrabold mt-1.5 font-mono ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{stats.videosUploaded}</div>
            <span className="text-[10px] text-[#6366F1] mt-0.5 block">Recorded Lectures</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(236,72,153,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(236,72,153,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Announcements Sent</span>
            <div className={`text-xl font-extrabold mt-1.5 font-mono ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{stats.announcementsSent}</div>
            <span className="text-[10px] text-[#EC4899] mt-0.5 block">This Semester</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Placement Eligible</span>
            <div className="text-xl font-extrabold text-[#10B981] mt-1.5 font-mono">{mockPlacementStudents.filter(s => s.eligibility === 'Placement Ready').length}</div>
            <span className="text-[10px] text-[#10B981] mt-0.5 block">Verified Resumes</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(168,85,247,0.2)]' 
              : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[rgba(168,85,247,0.2)]'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Assessment Avg</span>
            <div className={`text-xl font-extrabold mt-1.5 font-mono ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              0%
            </div>
            <span className="text-[10px] text-[#A855F7] mt-0.5 block">All Batches</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Chart */}
        <div className={`rounded-2xl border p-5 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#10B981]" />
              <h2 className={`text-sm font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Attendance Trend</h2>
            </div>
            <span className={`text-[10px] ${
              theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
            }`}>Last 7 Days</span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { day: 'Mon', value: 92 },
              { day: 'Tue', value: 94 },
              { day: 'Wed', value: 88 },
              { day: 'Thu', value: 95 },
              { day: 'Fri', value: 91 },
              { day: 'Sat', value: 78 },
              { day: 'Sun', value: 85 }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className={`text-[10px] w-8 ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>{item.day}</span>
                <div className={`flex-1 h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-[#111]' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full transition-all"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className={`text-[10px] font-mono w-10 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Trend Chart */}
        <div className={`rounded-2xl border p-5 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#6366F1]" />
              <h2 className={`text-sm font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Assignment Trend</h2>
            </div>
            <span className={`text-[10px] ${
              theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
            }`}>This Month</span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { week: 'W1', submitted: 45, graded: 42 },
              { week: 'W2', submitted: 48, graded: 45 },
              { week: 'W3', submitted: 52, graded: 48 },
              { week: 'W4', submitted: 50, graded: 47 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className={`flex items-center justify-between text-[10px] ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  <span>{item.week}</span>
                  <span>{item.submitted} submitted</span>
                </div>
                <div className="flex gap-1.5">
                  <div className={`flex-1 h-2 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-[#111]' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full bg-[#6366F1] rounded-full"
                      style={{ width: `${(item.submitted / 60) * 100}%` }}
                    />
                  </div>
                  <div className={`flex-1 h-2 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-[#111]' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full bg-[#10B981] rounded-full"
                      style={{ width: `${(item.graded / 60) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className={`flex items-center gap-4 pt-2 border-t ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Submitted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Graded</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className={`rounded-2xl border p-5 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#A855F7]" />
              <h2 className={`text-sm font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Performance</h2>
            </div>
            <span className={`text-[10px] ${
              theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
            }`}>By Batch</span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { batch: '2026-A', score: 87 },
              { batch: '2026-B', score: 82 },
              { batch: '2026-C', score: 89 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{item.batch}</span>
                  <span className="text-[#A855F7] font-mono">{item.score}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-[#111]' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-[#A855F7] to-[#C084FC] rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
            <div className={`pt-2 border-t ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Overall Average</span>
                <span className="text-sm font-bold text-[#A855F7] font-mono">86.0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`rounded-2xl border p-5 ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[#F59E0B]" />
          <h2 className={`text-sm font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button onClick={() => onSelectTab?.('attendance')} className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
            theme === 'dark' 
              ? 'bg-[#111] hover:bg-[#181818] border-[#222] text-white' 
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
          }`}>
            <UserCheck className="w-5 h-5 text-[#10B981]" />
            <span>Take Attendance</span>
          </button>
          <button onClick={() => setShowCreateAssignmentModal(true)} className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
            theme === 'dark' 
              ? 'bg-[#111] hover:bg-[#181818] border-[#222] text-white' 
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
          }`}>
            <FileCheck className="w-5 h-5 text-[#6366F1]" />
            <span>Create Assignment</span>
          </button>
          <button onClick={() => setShowUploadMaterialModal(true)} className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
            theme === 'dark' 
              ? 'bg-[#111] hover:bg-[#181818] border-[#222] text-white' 
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
          }`}>
            <Upload className="w-5 h-5 text-[#A855F7]" />
            <span>Upload Material</span>
          </button>
          <button onClick={() => setShowUploadVideoModal(true)} className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
            theme === 'dark' 
              ? 'bg-[#111] hover:bg-[#181818] border-[#222] text-white' 
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
          }`}>
            <Video className="w-5 h-5 text-[#EC4899]" />
            <span>Upload Video</span>
          </button>
          <button onClick={() => setShowCreateAssessmentModal(true)} className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
            theme === 'dark' 
              ? 'bg-[#111] hover:bg-[#181818] border-[#222] text-white' 
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
          }`}>
            <FileText className="w-5 h-5 text-[#F59E0B]" />
            <span>Create Assessment</span>
          </button>
          <button onClick={() => onSelectTab?.('students')} className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
            theme === 'dark' 
              ? 'bg-[#111] hover:bg-[#181818] border-[#222] text-white' 
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
          }`}>
            <Users className="w-5 h-5 text-[#3B82F6]" />
            <span>View Students</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Schedule & Activity */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Classes */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#10B981]" />
                <h2 className={`text-base font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Today's Classes</h2>
              </div>
              <button
                onClick={() => onSelectTab?.('my_classes')}
                className="text-xs text-[#6366F1] font-semibold hover:underline flex items-center gap-1"
              >
                View Full Schedule <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {mockClassesSchedule.map((c) => (
                <div key={c.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#222]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        c.status === 'Live Now' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 animate-pulse' : 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20'
                      }`}>
                        {c.status}
                      </span>
                      <span className={`text-xs font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{c.time}</span>
                    </div>
                    <h3 className={`font-bold text-sm mt-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{c.topic}</h3>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                    }`}>{c.batch} • {c.mode} ({c.studentsCount} Students)</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectTab?.('attendance')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        theme === 'dark' 
                          ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#2A2A2A]' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                      }`}
                    >
                      Roll Call
                    </button>
                    <a
                      href={c.roomLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" /> Join Class
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
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
                <h2 className={`text-base font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Recent Activity</h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <FileCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Rohan Mehta submitted Assignment 3</p>
                  <p className={`text-[10px] ${
                    theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                  }`}>15 minutes ago</p>
                </div>
              </div>
              <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <UserCheck className="w-4 h-4 text-[#6366F1] shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Attendance marked for BATCH-2026-CSE-ALPHA</p>
                  <p className={`text-[10px] ${
                    theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                  }`}>1 hour ago</p>
                </div>
              </div>
              <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <Upload className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Uploaded Lecture 14: System Design</p>
                  <p className={`text-[10px] ${
                    theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                  }`}>3 hours ago</p>
                </div>
              </div>
              <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <MessageSquare className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>New student question from Priya Sharma</p>
                  <p className={`text-[10px] ${
                    theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                  }`}>5 hours ago</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Upcoming & Messages */}
        <div className="space-y-6">
          
          {/* Upcoming Schedule */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#A855F7]" />
                <h2 className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Upcoming</h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`p-3 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Assessment Due</span>
                </div>
                <p className={`text-[11px] ${
                  theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                }`}>Mid-Term Coding Assessment</p>
                <p className={`text-[10px] mt-1 ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Aug 10, 2026</p>
              </div>
              <div className={`p-3 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <FileCheck className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Assignment Deadline</span>
                </div>
                <p className={`text-[11px] ${
                  theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                }`}>Kafka Producer Assignment</p>
                <p className={`text-[10px] mt-1 ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Aug 15, 2026</p>
              </div>
              <div className={`p-3 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Placement Drive</span>
                </div>
                <p className={`text-[11px] ${
                  theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                }`}>Microsoft SDE-1 Interview</p>
                <p className={`text-[10px] mt-1 ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>Aug 18, 2026</p>
              </div>
            </div>
          </div>

          {/* Student Doubts */}
          <div className={`rounded-2xl border p-5 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#6366F1]" />
                <h3 className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Student Questions</h3>
              </div>
              <span className="text-[10px] text-[#F59E0B] font-mono font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded">{mockMessages.filter(m => m.unread).length} Unread</span>
            </div>

            <div className="space-y-3">
              {mockMessages.slice(0, 3).map((msg) => (
                <div key={msg.id} className={`p-3 rounded-xl border space-y-1.5 ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#222]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={msg.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className={`font-bold text-xs ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{msg.sender}</span>
                    </div>
                    <span className={`text-[10px] ${
                      theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                    }`}>{msg.time}</span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                  }`}>"{msg.text}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 2. MY CLASSES SCHEDULE                                                      */
  /* -------------------------------------------------------------------------- */
  const renderMyClassesView = () => (
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
          }`}>Assigned Classes & Teaching Agenda</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Live lectures, lab sessions, and upcoming timetable for assigned batches</p>
        </div>
        <button
          onClick={() => setShowAiLessonModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold shadow-md"
        >
          <Sparkles className="w-4 h-4" /> AI Syllabus Planner
        </button>
      </div>

      {classesLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#6366F1] mb-2" />
          <p className={`text-sm ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>
            Loading classes...
          </p>
        </div>
      ) : classesError ? (
        <div className="text-center py-12">
          <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-500">{classesError}</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-[#6366F1]/30 mb-3" />
          <h3 className={`font-bold text-base mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            No Classes Yet
          </h3>
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>
            Create your first class to get started with teaching
          </p>
          <button 
            onClick={() => setShowCreateClassModal(true)}
            className="px-4 py-2 bg-[#6366F1] text-white rounded-xl text-sm font-semibold"
          >
            <Plus className="w-4 h-4 inline mr-2" /> Create First Class
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setShowCreateClassModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Create New Class
            </button>
          </div>
          {classes.map((cls) => (
            <div key={cls.id} className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20`}>
                    Scheduled
                  </span>
                  <span className="text-xs font-mono font-bold text-[#10B981]">
                    {cls.schedule.day} • {cls.schedule.startTime} - {cls.schedule.endTime}
                  </span>
                </div>

                <h3 className={`font-bold text-base ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{cls.title}</h3>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>
                  {cls.programTitle} • <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{cls.batchName}</strong> ({cls.studentIds?.length || 0} Enrolled Mentees)
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#777]' : 'text-[#94A3B8]'
                }`}>{cls.description}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onSelectTab?.('attendance')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                    theme === 'dark' 
                      ? 'bg-[#1A1A1A] hover:bg-[#222] text-white border-[#2A2A2A]' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditClass(cls)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                    theme === 'dark' 
                      ? 'bg-[#1A1A1A] hover:bg-[#222] text-white border-[#2A2A2A]' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                  }`}
                  title="Edit Class"
                >
                  <Edit className="w-4 h-4 text-[#6366F1]" />
                </button>
                <button
                  onClick={() => openDeleteConfirm(cls.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                    theme === 'dark' 
                      ? 'bg-[#1A1A1A] hover:bg-[#222] text-white border-[#2A2A2A]' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                  }`}
                  title="Delete Class"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
                <button
                  className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs"
                >
                  <Eye className="w-4 h-4" /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 3. TODAY'S SCHEDULE TIMELINE                                              */
  /* -------------------------------------------------------------------------- */
  const renderScheduleView = () => (
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
          }`}>Daily Timetable Agenda</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Hourly breakdown of teaching, doubt resolution, and assignment reviews</p>
        </div>
        <span className="text-xs font-mono text-[#10B981] font-bold bg-[#10B981]/10 px-3 py-1 rounded-lg border border-[#10B981]/20">
          Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className={`relative pl-6 border-l-2 space-y-8 ${
        theme === 'dark' ? 'border-[#222]' : 'border-gray-200'
      }`}>
        <div className="relative">
          <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#10B981] ring-4 ring-[#10B981]/20"></div>
          <div className={`p-4 rounded-xl border space-y-1 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <span className="text-xs font-mono text-[#10B981] font-bold">10:00 AM - 11:30 AM (LIVE NOW)</span>
            <h3 className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Microservices Communication & gRPC Integration</h3>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Enterprise Full-Stack 2026-A • Lab Room 101</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#6366F1]"></div>
          <div className={`p-4 rounded-xl border space-y-1 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <span className="text-xs font-mono text-[#6366F1] font-bold">12:00 PM - 01:00 PM</span>
            <h3 className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Office Hours & Doubt Resolution Session</h3>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>1-on-1 Student Mentorship & Code Review</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#A855F7]"></div>
          <div className={`p-4 rounded-xl border space-y-1 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <span className="text-xs font-mono text-[#A855F7] font-bold">02:00 PM - 03:30 PM</span>
            <h3 className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Transformers Architecture & Attention Mechanisms</h3>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Applied AI & ML 2026-B • Lecture Hall B</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 4. STUDENTS DIRECTORY & PROFILE MODAL                                     */
  /* -------------------------------------------------------------------------- */
  const renderStudentsView = () => {
    const filteredStudents = studentsList.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(studentSearchTerm.toLowerCase());
      return matchSearch;
    });

    return (
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
            }`}>Assigned Mentees & Student Directory</h2>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Detailed performance profiles across assigned training batches</p>
          </div>
          <span className="text-xs text-[#10B981] font-mono font-bold bg-[#10B981]/10 px-3 py-1 rounded-lg border border-[#10B981]/20">
            195 Total Students
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              theme === 'dark' ? 'text-[#555]' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search student by name, USN, roll number..."
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-hidden ${
                theme === 'dark' 
                  ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555] focus:border-[#10B981]' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#10B981]'
              }`}
            />
          </div>

          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs focus:outline-hidden ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            <option value="All">All Assigned Batches</option>
            <option value="batch_1">Enterprise Full-Stack 2026-A</option>
            <option value="batch_2">Applied AI & ML 2026-B</option>
            <option value="batch_3">Cloud DevOps Architecture 2026-A</option>
          </select>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[10px] font-bold uppercase tracking-[0.15em] ${
                theme === 'dark' 
                  ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                  : 'border-gray-200 text-gray-500 bg-gray-50'
              }`}>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll No / USN</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Placement Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-[#141414]' : 'divide-gray-200'
            }`}>
              {filteredStudents.map((s) => (
                <tr key={s.id} className={`transition-colors ${
                  theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'
                }`}>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className={`w-8 h-8 rounded-full object-cover border ${
                        theme === 'dark' ? 'border-[#222]' : 'border-gray-300'
                      }`} />
                      <div>
                        <span className={`font-bold block ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{s.name}</span>
                        <span className={`text-[10px] ${
                          theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                        }`}>{s.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3.5 px-4 font-mono font-bold ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                  }`}>{s.rollNumber}</td>
                  <td className={`py-3.5 px-4 ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                  }`}>{s.departmentName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#10B981]">{s.attendancePct}%</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold border border-[#10B981]/20">
                      Placement Eligible
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudentForProfile(s)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold border ${
                        theme === 'dark' 
                          ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#2A2A2A]' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                      }`}
                    >
                      View Student Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Student Profile Modal */}
        {selectedStudentForProfile && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border space-y-6 ${
              theme === 'dark' 
                ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}>
              <div className={`flex items-center justify-between pb-4 border-b ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <img src={selectedStudentForProfile.avatar} alt="" className={`w-12 h-12 rounded-full object-cover border ${
                    theme === 'dark' ? 'border-[#222]' : 'border-gray-300'
                  }`} />
                  <div>
                    <h3 className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{selectedStudentForProfile.name}</h3>
                    <p className={`text-xs font-mono ${
                      theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                    }`}>{selectedStudentForProfile.rollNumber} • {selectedStudentForProfile.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudentForProfile(null)} className={`${
                  theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-center">
                <div className={`p-3 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#222]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`block text-[10px] uppercase font-bold ${
                    theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                  }`}>Attendance Rate</span>
                  <strong className="text-base text-[#10B981] font-mono">{selectedStudentForProfile.attendancePct}%</strong>
                </div>
                <div className={`p-3 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#222]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`block text-[10px] uppercase font-bold ${
                    theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                  }`}>Assignment Avg</span>
                  <strong className={`text-base font-mono ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>92.5%</strong>
                </div>
                <div className={`p-3 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-[#111] border-[#222]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`block text-[10px] uppercase font-bold ${
                    theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                  }`}>Placement Score</span>
                  <strong className="text-base text-[#6366F1] font-mono">94 / 100</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className={`font-bold uppercase text-[10px] tracking-wider ${
                  theme === 'dark' ? 'text-white text-[#666]' : 'text-gray-900 text-[#64748B]'
                }`}>Mentor Confidential Notes</h4>
                <textarea
                  rows={3}
                  defaultValue="Student exhibits strong analytical problem-solving skills in distributed systems. Recommended for Tier-1 corporate hiring drives."
                  className={`w-full p-3 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div className={`flex justify-end pt-2 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button onClick={() => setSelectedStudentForProfile(null)} className="px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold">
                  Save Notes & Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };

  /* -------------------------------------------------------------------------- */
  /* 5. ATTENDANCE REGISTER                                                     */
  /* -------------------------------------------------------------------------- */
  const renderAttendanceView = () => {
    // Get students from selected class
    const selectedClass = classes.find(c => c.id === selectedClassForAttendance);
    const classStudents = selectedClass?.studentIds || [];

    // For now, since we don't have student profiles yet, we'll show a message
    // In a real app, you'd fetch student details from a students collection
    
    return (
    <div className={`rounded-2xl border p-6 shadow-xs space-y-6 ${
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
          }`}>Class Attendance Register</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Mark student roll call via QR cryptographic code, manual toggles, or bulk sync</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            disabled={!selectedClassForAttendance}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <QrCode className="w-4 h-4" /> Generate QR Code
          </button>

          <button
            onClick={handleMarkAllPresent}
            disabled={!selectedClassForAttendance || studentsList.length === 0}
            className={`px-3.5 py-2 text-[#10B981] text-xs font-semibold rounded-xl border disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === 'dark' 
                ? 'bg-[#10B981]/10 hover:bg-[#10B981]/20 border-[#10B981]/20' 
                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
            }`}
          >
            Mark All Present
          </button>

          <button
            onClick={handleSaveAttendance}
            disabled={!selectedClassForAttendance || studentsList.length === 0}
            className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Attendance
          </button>
        </div>
      </div>

      {savedSuccessAlert && (
        <div className={`p-3 rounded-xl border text-[#10B981] text-xs font-semibold flex items-center gap-2 ${
          theme === 'dark' 
            ? 'bg-[#10B981]/10 border-[#10B981]/20' 
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          Attendance successfully saved to Firebase for {attendanceDate}.
        </div>
      )}

      {/* Class & Date Selector */}
      <div className={`flex flex-col gap-3 p-4 rounded-xl border ${
        theme === 'dark' 
          ? 'bg-[#0D0D0D] border-[#222]' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className={`flex items-center gap-2 text-xs ${
            theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
          }`}>
            <BookOpen className="w-4 h-4 text-[#6366F1]" />
            <span>Select Class:</span>
            <select
              value={selectedClassForAttendance}
              onChange={(e) => setSelectedClassForAttendance(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-[#6366F1] ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[#222] text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">-- Select a class --</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.title} ({cls.batchName})
                </option>
              ))}
            </select>
          </div>

          <div className={`flex items-center gap-2 text-xs border-l pl-4 ${
            theme === 'dark' ? 'text-[#AAA] border-[#222]' : 'text-[#64748B] border-gray-200'
          }`}>
            <Calendar className="w-4 h-4 text-[#10B981]" />
            <span>Session Date:</span>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className={`px-2 py-1 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#6366F1] ${
                theme === 'dark' ? 'bg-[#111] text-white border border-[#222]' : 'bg-white text-gray-900 border border-gray-300'
              }`}
            />
          </div>
        </div>

        {selectedClass && (
          <div className={`text-xs ${theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}`}>
            <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              {selectedClass.title}
            </strong> • {selectedClass.programTitle} • {selectedClass.studentIds?.length || 0} enrolled students
          </div>
        )}
      </div>

      {/* Content based on selection */}
      {!selectedClassForAttendance ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-[#6366F1]/30 mb-3" />
          <h3 className={`font-bold text-base mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Select a Class
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>
            Please select a class from the dropdown above to mark attendance
          </p>
        </div>
      ) : classStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-[#F59E0B]/30 mb-3" />
          <h3 className={`font-bold text-base mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            No Students Enrolled
          </h3>
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>
            This class doesn't have any students enrolled yet. Add students to the class first.
          </p>
          <button
            onClick={() => onSelectTab?.('students')}
            className="px-4 py-2 bg-[#6366F1] text-white rounded-xl text-sm font-semibold"
          >
            Go to Students Management
          </button>
        </div>
      ) : studentsList.length > 0 ? (
        <>
          {/* Roll Call Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-bold uppercase tracking-[0.15em] ${
                  theme === 'dark' 
                    ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                    : 'border-gray-200 text-gray-500 bg-gray-50'
                }`}>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Historical %</th>
                  <th className="py-3 px-4 text-center">Mark Attendance Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' ? 'divide-[#141414]' : 'divide-gray-200'
              }`}>
                {studentsList.map((s) => {
                  const status = attendanceRecords[s.id] || 'Present';
                  return (
                    <tr key={s.id} className={`transition-colors ${
                      theme === 'dark' ? 'hover:bg-[#111]/80' : 'hover:bg-gray-50'
                    }`}>
                      <td className={`py-3 px-4 font-mono font-bold ${
                        theme === 'dark' ? 'text-[#CCC]' : 'text-[#64748B]'
                      }`}>{s.rollNumber}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={s.avatar} alt={s.name} className={`w-7 h-7 rounded-full object-cover border ${
                            theme === 'dark' ? 'border-[#222]' : 'border-gray-300'
                          }`} />
                          <span className={`font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{s.name}</span>
                        </div>
                      </td>
                      <td className={`py-3 px-4 font-medium ${
                        theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                      }`}>{s.departmentName}</td>
                      <td className="py-3 px-4 font-bold text-[#10B981]">{s.attendancePct}%</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStatusToggle(s.id, 'Present')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              status === 'Present'
                                ? 'bg-[#10B981] text-white'
                                : theme === 'dark'
                                  ? 'bg-[#141414] text-[#777] hover:text-white hover:bg-[#222]'
                                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Present
                          </button>
                          
                          <button
                            onClick={() => handleStatusToggle(s.id, 'Late')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              status === 'Late'
                                ? 'bg-[#F59E0B] text-white'
                                : theme === 'dark'
                                  ? 'bg-[#141414] text-[#777] hover:text-white hover:bg-[#222]'
                                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" /> Late
                          </button>

                          <button
                            onClick={() => handleStatusToggle(s.id, 'Absent')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              status === 'Absent'
                                ? 'bg-[#EF4444] text-white'
                                : theme === 'dark'
                                  ? 'bg-[#141414] text-[#777] hover:text-white hover:bg-[#222]'
                                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto text-[#888]/30 mb-3" />
          <h3 className={`font-bold text-base mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Ready to Mark Attendance
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>
            Student list will appear here once you fetch enrolled students
          </p>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-sm w-full p-6 shadow-2xl border text-center space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Dynamic Attendance QR</h3>
              <button onClick={() => setShowQrModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white rounded-2xl inline-block shadow-inner my-2">
              <QrCode className="w-40 h-40 text-black mx-auto" />
            </div>

            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
            }`}>Ask students to scan using their LearnIT Student Mobile App.</p>
            <span className="text-xs font-mono font-bold text-[#F59E0B] block">Expires in 00:{qrTimer}s</span>

            <button onClick={() => setShowQrModal(false)} className="w-full py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold">
              Done & Lock Attendance
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

  /* -------------------------------------------------------------------------- */
  /* 6. ASSIGNMENTS & GRADEBOOK - FULLY INTEGRATED WITH FIREBASE               */
  /* -------------------------------------------------------------------------- */
  const renderAssignmentsView = () => (
    <AssignmentsManager
      // Assignment creation modal
      showCreateAssignmentModal={showCreateAssignmentModal}
      setShowCreateAssignmentModal={setShowCreateAssignmentModal}
      handleCreateAssignment={handleCreateAssignment}
      
      // Form state
      selectedClassForAssignment={selectedClassForAssignment}
      setSelectedClassForAssignment={setSelectedClassForAssignment}
      newAssignmentTitle={newAssignmentTitle}
      setNewAssignmentTitle={setNewAssignmentTitle}
      newAssignmentDescription={newAssignmentDescription}
      setNewAssignmentDescription={setNewAssignmentDescription}
      newAssignmentInstructions={newAssignmentInstructions}
      setNewAssignmentInstructions={setNewAssignmentInstructions}
      newAssignmentDeadline={newAssignmentDeadline}
      setNewAssignmentDeadline={setNewAssignmentDeadline}
      newAssignmentMaxMarks={newAssignmentMaxMarks}
      setNewAssignmentMaxMarks={setNewAssignmentMaxMarks}
      newAssignmentFile={newAssignmentFile}
      setNewAssignmentFile={setNewAssignmentFile}
      
      // Classes data
      classes={classes}
      
      // Assignments data
      assignments={assignments}
      assignmentsLoading={assignmentsLoading}
      
      // Submissions modal
      showSubmissionsModal={showSubmissionsModal}
      setShowSubmissionsModal={setShowSubmissionsModal}
      selectedAssignmentForSubmissions={selectedAssignmentForSubmissions}
      setSelectedAssignmentForSubmissions={setSelectedAssignmentForSubmissions}
      submissions={submissions}
      fetchSubmissions={fetchSubmissions}
      
      // Grading modal
      showGradingModal={showGradingModal}
      setShowGradingModal={setShowGradingModal}
      selectedSubmission={selectedSubmission}
      setSelectedSubmission={setSelectedSubmission}
      gradeScore={gradeScore}
      setGradeScore={setGradeScore}
      gradeFeedback={gradeFeedback}
      setGradeFeedback={setGradeFeedback}
      handleGradeSubmission={handleGradeSubmission}
      
      // Actions
      removeAssignment={removeAssignment}
    />
  );

  /* -------------------------------------------------------------------------- */
  /* 7. ASSESSMENTS                                                            */
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
          }`}>Academic Assessments & Quizzes</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Internal tests, coding exams, and practical project evaluations</p>
        </div>
        <button
          onClick={() => setShowCreateAssessmentModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold"
        >
          <Plus className="w-4 h-4" /> Create Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assessments.map((a) => (
          <div key={a.id} className={`p-5 rounded-2xl border space-y-3 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">
                {a.type}
              </span>
              <span className="text-[10px] font-bold text-[#10B981]">{a.status}</span>
            </div>

            <h3 className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{a.title}</h3>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
            }`}>{a.batch} • {a.totalMarks} Marks</p>

            <div className={`pt-2 border-t flex justify-between items-center text-xs ${
              theme === 'dark' ? 'border-[#1A1A1A] text-[#AAA]' : 'border-gray-200 text-[#64748B]'
            }`}>
              <span>Evaluated: <strong>{a.evaluatedCount}/{a.totalCount}</strong></span>
              <button className={`px-3 py-1 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-[#1A1A1A] text-white border-[#2A2A2A]' 
                  : 'bg-gray-100 text-gray-900 border-gray-300'
              }`}>Enter Marks</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assessment Modal */}
      {showCreateAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Schedule New Assessment</h3>
              <button onClick={() => setShowCreateAssessmentModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Assessment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Practical Assessment: Distributed Locking"
                  value={newAssessmentTitle}
                  onChange={(e) => setNewAssessmentTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Type</label>
                <select
                  value={newAssessmentType}
                  onChange={(e) => setNewAssessmentType(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Coding Test">Coding Test</option>
                  <option value="Quiz">Internal Quiz</option>
                  <option value="Practical Assessment">Practical Assessment</option>
                  <option value="Project Evaluation">Project Evaluation</option>
                </select>
              </div>

              <div className={`flex justify-end gap-2 pt-3 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button type="button" onClick={() => setShowCreateAssessmentModal(false)} className={`px-4 py-2 ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#6366F1] text-white rounded-xl font-semibold">Schedule Test</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 8. STUDY MATERIALS                                                         */
  /* -------------------------------------------------------------------------- */
  const renderMaterialsView = () => (
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
          }`}>Study Materials Repository</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>PDF notes, PPT slides, and reference architectural documents</p>
        </div>
        <button
          onClick={() => setShowUploadMaterialModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#10B981] text-white rounded-xl text-xs font-semibold"
        >
          <Plus className="w-4 h-4" /> Upload Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {materials.map((m) => (
          <div key={m.id} className={`p-4 rounded-xl border space-y-3 ${
            theme === 'dark' 
              ? 'border-[#1A1A1A] bg-[#111]' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#6366F1]/10 text-[#6366F1]">
                {m.type}
              </span>
              <span className={`text-xs ${
                theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
              }`}>{m.durationOrPages}</span>
            </div>
            <h4 className={`font-bold text-xs ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{m.title}</h4>
            <a href={m.url} target="_blank" rel="noreferrer" className="text-xs text-[#6366F1] font-semibold hover:underline block pt-2">
              Download PDF →
            </a>
          </div>
        ))}
      </div>

      {/* Upload Material Modal */}
      {showUploadMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Upload Study Resource</h3>
              <button onClick={() => setShowUploadMaterialModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Title *</label>
                <input
                  type="text"
                  required
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Description</label>
                <textarea
                  rows={2}
                  value={newMatDesc}
                  onChange={(e) => setNewMatDesc(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>File * (PDF, Video, etc.)</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setNewMatFile(e.target.files?.[0] || null)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>External URL (optional)</label>
                <input
                  type="url"
                  value={newMatUrl}
                  onChange={(e) => setNewMatUrl(e.target.value)}
                  placeholder="https://..."
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className={`flex justify-end gap-2 pt-3 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button type="button" onClick={() => setShowUploadMaterialModal(false)} className={`px-4 py-2 ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#10B981] text-white rounded-xl font-semibold">Publish Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 9. VIDEO LIBRARY                                                          */
  /* -------------------------------------------------------------------------- */
  const renderVideoLibraryView = () => (
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
          }`}>Recorded Class Video Library</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Recorded lectures, technical workshops, and laboratory tutorials</p>
        </div>
        <button
          onClick={() => setShowUploadVideoModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#10B981] text-white rounded-xl text-xs font-semibold"
        >
          <Upload className="w-4 h-4" /> Upload Video Recording
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className={`p-4 rounded-2xl border space-y-3 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`relative aspect-video rounded-xl border flex items-center justify-center overflow-hidden group ${
              theme === 'dark' ? 'bg-black border-[#222]' : 'bg-gray-900 border-gray-300'
            }`}>
              <Video className="w-10 h-10 text-[#6366F1] group-hover:scale-110 transition-transform" />
              <button
                onClick={() => setActivePlayingVideo(vid)}
                className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-white transition-all"
              >
                <Play className="w-8 h-8 fill-white" />
              </button>
            </div>

            <h3 className={`font-bold text-xs line-clamp-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{vid.title}</h3>
            <div className={`flex items-center justify-between text-[10px] font-mono ${
              theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
            }`}>
              <span>{vid.duration}</span>
              <span>{vid.views} Student Views</span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {activePlayingVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-2xl w-full p-6 border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{activePlayingVideo.title}</h3>
              <button onClick={() => setActivePlayingVideo(null)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <video controls autoPlay className={`w-full aspect-video rounded-xl border ${
              theme === 'dark' ? 'border-[#222]' : 'border-gray-300'
            }`}>
              <source src={activePlayingVideo.videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </div>
        </div>
      )}

    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 10. ANNOUNCEMENTS                                                         */
  /* -------------------------------------------------------------------------- */
  const renderAnnouncementsView = () => (
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
          }`}>Batch Broadcast Announcements</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Broadcast urgent notices, hackathon invites, and assignment reminders</p>
        </div>
        <button
          onClick={() => setShowCreateAnnouncementModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold"
        >
          <Plus className="w-4 h-4" /> Broadcast Notice
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className={`p-5 rounded-2xl border space-y-2 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                ann.priority === 'Urgent' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#6366F1]/10 text-[#6366F1]'
              }`}>
                {ann.priority} Priority
              </span>
              <span className={`text-xs font-mono ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>{ann.date}</span>
            </div>

            <h3 className={`font-bold text-base ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{ann.title}</h3>
            <p className={`text-xs leading-relaxed ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
            }`}>{ann.body}</p>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {showCreateAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>New Announcement Notice</h3>
              <button onClick={() => setShowCreateAnnouncementModal(false)} className={`${
                theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Headline *</label>
                <input
                  type="text"
                  required
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                }`}>Message Body *</label>
                <textarea
                  rows={4}
                  required
                  value={newAnnBody}
                  onChange={(e) => setNewAnnBody(e.target.value)}
                  className={`w-full p-2.5 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className={`flex justify-end gap-2 pt-3 border-t ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <button type="button" onClick={() => setShowCreateAnnouncementModal(false)} className={`px-4 py-2 ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#6366F1] text-white rounded-xl font-semibold">Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 11. PLACEMENT READINESS                                                   */
  /* -------------------------------------------------------------------------- */
  const renderPlacementReadinessView = () => (
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
          }`}>Student Placement Readiness Index</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Multi-dimensional evaluation: Attendance, Assignments, Practical Mock Rating & Eligibility</p>
        </div>
        <span className="text-xs text-[#10B981] font-mono font-bold bg-[#10B981]/10 px-3 py-1 rounded-lg border border-[#10B981]/20">
          42 Mentees Placement Ready
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-bold uppercase ${
              theme === 'dark' 
                ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                : 'border-gray-200 text-gray-500 bg-gray-50'
            }`}>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4">Assignment Score</th>
              <th className="py-3 px-4">Practical Rating</th>
              <th className="py-3 px-4">Resume Status</th>
              <th className="py-3 px-4">Placement Eligibility</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === 'dark' ? 'divide-[#141414]' : 'divide-gray-200'
          }`}>
            {mockPlacementStudents.map((ps) => (
              <tr key={ps.id} className={`transition-colors ${
                theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'
              }`}>
                <td className={`py-3.5 px-4 font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{ps.name} <span className={`block text-[10px] font-mono ${
                  theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                }`}>{ps.usn}</span></td>
                <td className="py-3.5 px-4 font-mono font-bold text-[#10B981]">{ps.attendanceScore}%</td>
                <td className={`py-3.5 px-4 font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{ps.assignmentScore}%</td>
                <td className="py-3.5 px-4 text-[#F59E0B] font-bold">★ {ps.mockRating}.0 / 5.0</td>
                <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold">{ps.resumeStatus}</span></td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ps.eligibility === 'Placement Ready' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}>
                    {ps.eligibility}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="px-3 py-1 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg text-[11px] font-semibold">
                    Recommend to TPO
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
  /* 13. PERFORMANCE ANALYTICS                                                  */
  /* -------------------------------------------------------------------------- */
  const renderAnalyticsView = () => (
    <AnalyticsBI userRole="mentor" />
  );

  /* -------------------------------------------------------------------------- */
  /* 14. MESSAGES                                                               */
  /* -------------------------------------------------------------------------- */
  const renderMessagesView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 ${
      theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Student Questions</h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>Direct technical doubt resolution and mentor communications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
        {/* Left Side - Conversation List */}
        <div className="space-y-2">
          <h3 className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-3 ${
            theme === 'dark' ? 'text-[#555]' : 'text-[#64748B]'
          }`}>Student Questions</h3>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-3 rounded-xl border cursor-pointer space-y-2 transition-all ${
                selectedConversation?.id === conv.id
                  ? theme === 'dark'
                    ? 'bg-[#6366F1]/10 border-[#6366F1]/30'
                    : 'bg-[#6366F1]/5 border-[#6366F1]/20'
                  : theme === 'dark'
                    ? 'bg-[#111] border-[#222] hover:border-[#333]'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <img src={conv.studentAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <strong className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{conv.studentName}</strong>
                    {conv.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
                    )}
                  </div>
                  <p className={`text-[10px] ${theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'}`}>{conv.batch}</p>
                </div>
              </div>
              <p className={`text-[11px] line-clamp-1 ${theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}`}>{conv.lastMessage}</p>
              <span className={`text-[10px] ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`}>{conv.lastTime}</span>
            </div>
          ))}
        </div>

        {/* Right Side - Conversation Detail */}
        <div className={`md:col-span-2 rounded-2xl border flex flex-col ${
          theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
        }`}>
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className={`p-4 border-b flex items-center gap-3 ${
                theme === 'dark' ? 'border-[#222]' : 'border-gray-200'
              }`}>
                <img src={selectedConversation.studentAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <strong className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedConversation.studentName}</strong>
                  <p className={`text-xs ${theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'}`}>{selectedConversation.batch}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[350px]">
                {selectedConversation.messages.map((msg: any) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'mentor' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'student' && (
                      <img src={selectedConversation.studentAvatar} alt="" className="w-8 h-8 rounded-full object-cover mt-1" />
                    )}
                    <div className={`max-w-[70%] ${msg.sender === 'mentor' ? 'text-right' : 'text-left'}`}>
                      <div className={`text-[10px] font-semibold mb-1 ${
                        theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                      }`}>{msg.name}</div>
                      <div className={`p-3 rounded-xl text-xs ${
                        msg.sender === 'mentor'
                          ? theme === 'dark'
                            ? 'bg-[#6366F1] text-white'
                            : 'bg-[#6366F1] text-white'
                          : theme === 'dark'
                            ? 'bg-[#0A0A0A] text-[#DDD]'
                            : 'bg-white text-gray-700'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`}>{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t flex gap-2 ${
                theme === 'dark' ? 'border-[#222]' : 'border-gray-200'
              }`}>
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className={`flex-1 p-2.5 rounded-xl text-xs ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border border-[#222] text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`}>
                Select a conversation to view messages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 15. NOTIFICATIONS                                                          */
  /* -------------------------------------------------------------------------- */
  const renderNotificationsView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 ${
      theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Mentor Notification Center</h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>Real-time system alerts, assignment submissions, and attendance locks</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockNotificationsList.map((n) => (
          <div key={n.id} className={`p-4 rounded-xl border flex items-start gap-3 ${
            theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
          }`}>
            <Bell className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{n.title}</h4>
                <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`}>{n.time}</span>
              </div>
              <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}`}>{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 16. MENTOR PROFILE                                                         */
  /* -------------------------------------------------------------------------- */
  const renderProfileView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 max-w-3xl ${
      theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center gap-4 pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div className={`w-16 h-16 rounded-full bg-[#10B981]/10 border border-[#10B981] flex items-center justify-center text-xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          AD
        </div>
        <div>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{mentorProfile.name}</h2>
          <p className={`text-xs font-semibold text-[#10B981]`}>{mentorProfile.title}</p>
          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'}`}>{mentorProfile.email} • {mentorProfile.phone}</p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <span className={`uppercase font-bold block text-[10px] tracking-wider mb-1 ${
            theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
          }`}>Academic Qualifications</span>
          <p className={`p-3 rounded-xl border ${
            theme === 'dark' ? 'text-white bg-[#111] border-[#222]' : 'text-gray-900 bg-gray-50 border-gray-200'
          }`}>{mentorProfile.qualifications}</p>
        </div>

        <div>
          <span className={`uppercase font-bold block text-[10px] tracking-wider mb-1 ${
            theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
          }`}>Domain Expertise & Skills</span>
          <div className="flex flex-wrap gap-2 pt-1">
            {mentorProfile.skills.map((s, idx) => (
              <span key={idx} className={`px-2.5 py-1 rounded-lg border font-mono ${
                theme === 'dark' 
                  ? 'bg-[#141414] text-white border-[#262626]' 
                  : 'bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className={`uppercase font-bold block text-[10px] tracking-wider mb-1 ${
            theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
          }`}>Assigned Academic Batches</span>
          <ul className={`list-disc pl-5 space-y-1 ${
            theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
          }`}>
            {mentorProfile.assignedBatches.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // Switch router based on activeTab
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardView();
      case 'my_classes':
        return renderMyClassesView();
      case 'schedule':
        return renderScheduleView();
      case 'students':
        return renderStudentsView();
      case 'attendance':
        return renderAttendanceView();
      case 'assignments':
        return renderAssignmentsView();
      case 'assessments':
        return renderAssessmentsView();
      case 'materials':
        return renderMaterialsView();
      case 'video_library':
        return renderVideoLibraryView();
      case 'announcements':
        return renderAnnouncementsView();
      case 'placements':
        return renderPlacementReadinessView();
      case 'placement_readiness':
        return renderPlacementReadinessView();
      case 'reports':
        return renderAnalyticsView();
      case 'messages':
        return renderMessagesView();
      case 'notifications':
        return renderNotificationsView();
      case 'profile':
        return renderProfileView();
      case 'settings':
        return renderProfileView();
      default:
        return renderDashboardView();
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Tab Render */}
      {renderActiveTabContent()}

      {/* Global AI Lesson Planner Modal */}
      {showAiLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2 text-[#A855F7]">
                <Sparkles className="w-5 h-5" />
                <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI Lesson Planner & Syllabus Generator</h3>
              </div>
              <button onClick={() => setShowAiLessonModal(false)} className={theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>
              Generates an optimized 90-minute hands-on lab lesson plan complete with theory, code demos, and Q&A checkpoints.
            </p>

            <button
              onClick={() => setAiGeneratedOutput(`
📚 AI GENERATED LESSON PLAN: Microservices Communication with gRPC
------------------------------------------------------------------
00:00 - 00:15 | Introduction: REST vs gRPC Protocols & Protocol Buffers serialization efficiency
00:15 - 00:45 | Code Live Demo: Writing .proto schemas and generating TypeScript client/server stubs
00:45 - 01:15 | Hands-on Lab: Implementing Bidirectional Streaming RPC in Node.js
01:15 - 01:30 | Q&A Checkpoint & Live Student Quiz on Protobuf wire formats
              `)}
              className="w-full py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold"
            >
              Generate 90-Min Lesson Plan
            </button>

            {aiGeneratedOutput && (
              <pre className={`p-4 rounded-xl text-xs font-mono whitespace-pre-wrap ${
                theme === 'dark' ? 'bg-[#0D0D0D] border border-[#222] text-[#10B981]' : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}>
                {aiGeneratedOutput}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Global AI Question Generator Modal */}
      {showAiQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2 text-[#F59E0B]">
                <Zap className="w-5 h-5" />
                <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI Coding Test Question Generator</h3>
              </div>
              <button onClick={() => setShowAiQuestionModal(false)} className={theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>Generate production-grade coding assessment questions and test cases.</p>

            <button
              onClick={() => setAiGeneratedOutput(`
⚡ AI GENERATED CODING QUESTION
--------------------------------
Title: Implement an In-Memory Rate Limiter with Sliding Window Counter
Difficulty: Medium / Hard
Time limit: 45 Minutes

Problem Statement:
Design a thread-safe rate limiter middleware in TypeScript that allows a maximum of N requests per user ID within a configurable time window T (in seconds).

Test Cases Included:
1. Basic burst traffic under threshold -> PASS
2. Expired window reset -> PASS
3. High concurrency stress test -> PASS
              `)}
              className="w-full py-2 bg-[#F59E0B] text-white rounded-xl text-xs font-semibold"
            >
              Generate Problem & Test Cases
            </button>

            {aiGeneratedOutput && (
              <pre className={`p-4 rounded-xl text-xs font-mono whitespace-pre-wrap ${
                theme === 'dark' ? 'bg-[#0D0D0D] border border-[#222] text-[#F59E0B]' : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}>
                {aiGeneratedOutput}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-[#0A0A0A] border border-[#1A1A1A]' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#6366F1]" />
                <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Create New Class</h3>
              </div>
              <button 
                onClick={() => setShowCreateClassModal(false)} 
                className={theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                  Class Title *
                </label>
                <input
                  type="text"
                  value={newClassTitle}
                  onChange={(e) => setNewClassTitle(e.target.value)}
                  required
                  placeholder="e.g., Full-Stack Development - React & Node.js"
                  className={`w-full px-3 py-2 rounded-lg text-sm ${
                    theme === 'dark' 
                      ? 'bg-[#111] border-[#222] text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                  placeholder="Brief description of the class..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg text-sm ${
                    theme === 'dark' 
                      ? 'bg-[#111] border-[#222] text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    value={newClassBatchName}
                    onChange={(e) => setNewClassBatchName(e.target.value)}
                    required
                    placeholder="e.g., FSE-2026-A"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Program Title
                  </label>
                  <input
                    type="text"
                    value={newClassProgramTitle}
                    onChange={(e) => setNewClassProgramTitle(e.target.value)}
                    placeholder="e.g., Full-Stack Engineering"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Schedule Day
                  </label>
                  <input
                    type="text"
                    value={newClassScheduleDay}
                    onChange={(e) => setNewClassScheduleDay(e.target.value)}
                    placeholder="e.g., Monday, Wednesday"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={newClassStartTime}
                    onChange={(e) => setNewClassStartTime(e.target.value)}
                    placeholder="10:00 AM"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    End Time
                  </label>
                  <input
                    type="text"
                    value={newClassEndTime}
                    onChange={(e) => setNewClassEndTime(e.target.value)}
                    placeholder="12:00 PM"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newClassStartDate}
                    onChange={(e) => setNewClassStartDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newClassEndDate}
                    onChange={(e) => setNewClassEndDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateClassModal(false)}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold border ${
                    theme === 'dark' 
                      ? 'bg-[#1A1A1A] hover:bg-[#222] text-white border-[#2A2A2A]' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingClass}
                  className="flex-1 px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreatingClass ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Class
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-[#0A0A0A] border border-[#1A1A1A]' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#6366F1]" />
                <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Edit Class</h3>
              </div>
              <button 
                onClick={() => {
                  setShowEditClassModal(false);
                  setEditingClass(null);
                }} 
                className={theme === 'dark' ? 'text-[#666] hover:text-white' : 'text-gray-500 hover:text-gray-900'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateClass} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                  Class Title *
                </label>
                <input
                  type="text"
                  value={newClassTitle}
                  onChange={(e) => setNewClassTitle(e.target.value)}
                  required
                  placeholder="e.g., Full-Stack Development - React & Node.js"
                  className={`w-full px-3 py-2 rounded-lg text-sm ${
                    theme === 'dark' 
                      ? 'bg-[#111] border-[#222] text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                  placeholder="Brief description of the class..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg text-sm ${
                    theme === 'dark' 
                      ? 'bg-[#111] border-[#222] text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    value={newClassBatchName}
                    onChange={(e) => setNewClassBatchName(e.target.value)}
                    required
                    placeholder="e.g., FSE-2026-A"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Program Title
                  </label>
                  <input
                    type="text"
                    value={newClassProgramTitle}
                    onChange={(e) => setNewClassProgramTitle(e.target.value)}
                    placeholder="e.g., Full-Stack Engineering"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Schedule Day
                  </label>
                  <input
                    type="text"
                    value={newClassScheduleDay}
                    onChange={(e) => setNewClassScheduleDay(e.target.value)}
                    placeholder="e.g., Monday, Wednesday"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={newClassStartTime}
                    onChange={(e) => setNewClassStartTime(e.target.value)}
                    placeholder="10:00 AM"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    End Time
                  </label>
                  <input
                    type="text"
                    value={newClassEndTime}
                    onChange={(e) => setNewClassEndTime(e.target.value)}
                    placeholder="12:00 PM"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newClassStartDate}
                    onChange={(e) => setNewClassStartDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-[#888]' : 'text-gray-700'}`}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newClassEndDate}
                    onChange={(e) => setNewClassEndDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-[#6366F1]`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditClassModal(false);
                    setEditingClass(null);
                  }}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold border ${
                    theme === 'dark' 
                      ? 'bg-[#1A1A1A] hover:bg-[#222] text-white border-[#2A2A2A]' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingClass}
                  className="flex-1 px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdatingClass ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Update Class
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Class Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full ${
            theme === 'dark' ? 'bg-[#0A0A0A] border border-[#1A1A1A]' : 'bg-white'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Delete Class?
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'}`}>
              Are you sure you want to delete this class? All associated data including attendance records, assignments, and materials will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingClassId(null);
                }}
                disabled={isDeletingClass}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold border ${
                  theme === 'dark' 
                    ? 'bg-[#1A1A1A] hover:bg-[#222] text-white border-[#2A2A2A]' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteClass}
                disabled={isDeletingClass}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeletingClass ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Class
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
