import React, { useState } from 'react';
import {
  Student,
  Assignment,
  AssignmentSubmission,
  LearningMaterial,
  Certificate
} from '../../types';
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  Video,
  FileCheck,
  Award,
  Play,
  CheckCircle2,
  Clock,
  ExternalLink,
  QrCode,
  Download,
  CalendarDays,
  TrendingUp,
  Bell,
  User,
  FileText,
  Bookmark,
  X,
  MessageSquare,
  Send,
  Upload
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMaterials } from '../../hooks/useMaterials';
import { StudentAssignments } from './StudentAssignments';
import { StudentAttendance } from './StudentAttendance';
import {
  WelcomeBanner,
  AnalyticsCards,
  AnalyticsCharts,
  QuickActions,
  TodaysClasses,
  RecentActivity,
  UpcomingEvents
} from './DashboardComponents';

interface StudentDashboardProps {
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
  onOpenCertificateModal?: () => void;
  onOpenReceiptModal?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  activeTab = 'dashboard',
  onSelectTab,
  onOpenCertificateModal,
  onOpenReceiptModal
}) => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  

  const student: Student = {
    id: '',
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    avatar: '',
    collegeId: '',
    collegeName: '',
    departmentId: '',
    departmentName: '',
    batchId: '',
    batchName: '',
    cgpa: 0,
    attendancePct: 0,
    feeStatus: 'Pending',
    placementStatus: 'Not Eligible',
    skills: []
  };
  
  // State variables for interactive tabs
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Synchronize with prop changes if provided
  React.useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    if (onSelectTab) {
      onSelectTab(tabId);
    }
  };

  // Firebase Materials Integration
  const { materials, loading: materialsLoading } = useMaterials(userProfile?.classId);
  
  const [activeVideo, setActiveVideo] = useState<LearningMaterial | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  
  const studentAttendanceRecords: any[] = [];
  const studentSubmissions: any[] = [];
  const studentAssessments: any[] = [];
  
  const gradedSubmissions = studentSubmissions.filter(s => s.status === 'Graded');
  const assignmentCompletionRate = studentSubmissions.length > 0 
    ? Math.round((gradedSubmissions.length / studentSubmissions.length) * 100) 
    : 0;
  
  const avgAssessmentScore = 0;
  
  // Submission Form State
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionFile, setSubmissionFile] = useState('');
  const [submittedAlert, setSubmittedAlert] = useState(false);

  // Modals & Preview States
  const [selectedAssignmentPreview, setSelectedAssignmentPreview] = useState<any | null>(null);

  // Student Inbox & Messages State
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([
    {
      id: 1,
      mentorName: 'Ananya Deshmukh',
      mentorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
      batch: 'Enterprise Full-Stack 2026-A',
      unread: true,
      lastMessage: 'Sure Arun. Please check the examples discussed in today\'s class.',
      lastTime: '2 min ago',
      messages: [
        {
          id: 1,
          sender: 'student',
          name: 'Rohan Mehta',
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
      mentorName: 'Rajesh Kumar',
      mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      batch: 'Applied AI & ML 2026-B',
      unread: false,
      lastMessage: 'The next assessment is scheduled for Friday.',
      lastTime: '1 hr ago',
      messages: [
        {
          id: 1,
          sender: 'student',
          name: 'Rohan Mehta',
          text: 'When will the next assessment be conducted?',
          time: '09:30 AM'
        },
        {
          id: 2,
          sender: 'mentor',
          name: 'Rajesh Kumar',
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
      sender: 'student',
      name: 'Rohan Mehta',
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

  // Video bookmark states
  const [bookmarkedVideos, setBookmarkedVideos] = useState<string[]>(['mat_1']);

  const toggleBookmark = (id: string) => {
    if (bookmarkedVideos.includes(id)) {
      setBookmarkedVideos(bookmarkedVideos.filter((b) => b !== id));
    } else {
      setBookmarkedVideos([...bookmarkedVideos, id]);
    }
  };

  const handleFormSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl) return;

    const newSub: AssignmentSubmission = {
      id: `sub_${Date.now()}`,
      assignmentId: 'asg_1',
      studentId: student.id,
      studentName: student.name,
      submittedAt: new Date().toLocaleString(),
      fileUrl: submissionUrl,
      fileName: submissionFile || 'rohan_mehta_submission.zip',
      status: 'Submitted'
    };

    setSubmissions([newSub, ...submissions]);
    setSubmissionUrl('');
    setSubmissionFile('');
    setSubmittedAlert(true);
    setTimeout(() => setSubmittedAlert(false), 3000);
  };

  /* ========================================================================== */
  /* 1. DASHBOARD ("What should I do today?")                                   */
  /* ========================================================================== */
  const renderDashboardView = () => (
    <div className="space-y-6">
      <WelcomeBanner student={student} onJoinClass={() => handleTabChange('todays_classes')} />
      
      <AnalyticsCards 
        student={student} 
        certificateCount={0}
        assignmentCompletionRate={assignmentCompletionRate}
        avgAssessmentScore={avgAssessmentScore}
        onViewFullAnalytics={() => handleTabChange('achievements')}
      />
      
      <AnalyticsCharts student={student} />
      
      <QuickActions
        onContinueLearning={() => handleTabChange('learning')}
        onJoinClass={() => handleTabChange('todays_classes')}
        onOpenAssignment={() => handleTabChange('assignments')}
        onWatchVideo={() => handleTabChange('video_library')}
      />

      {/* Main Content - Single Column Layout */}
      <div className="space-y-6">
        <TodaysClasses 
          classes={[]}
          onViewFullSchedule={() => handleTabChange('todays_classes')}
          onMarkAttendance={() => handleTabChange('attendance')}
        />

        <RecentActivity 
          activities={[
            { icon: <FileCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />, title: 'Submitted Assignment 3: Kafka Producer', time: '2 hours ago' },
            { icon: <CheckCircle className="w-4 h-4 text-[#6366F1] shrink-0 mt-0.5" />, title: 'Attendance marked for today\'s session', time: '5 hours ago' },
            { icon: <Download className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />, title: 'Downloaded Lecture 14: System Design', time: '2 days ago' }
          ]}
        />

        <UpcomingEvents 
          upcomingEvents={[
            { icon: <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />, title: 'Assessment Due', description: 'Mid-Term System Architecture', date: 'Aug 8, 2026' },
            { icon: <FileCheck className="w-3.5 h-3.5 text-[#EF4444]" />, title: 'Assignment Deadline', description: 'Microservices OpenAPI Specs', date: 'Aug 6, 2026' }
          ]}
          announcements={[
            { title: 'New Learning Module Added', description: 'Advanced React Patterns now available in the learning center.', time: '2 hours ago' }
          ]}
        />
      </div>

    </div>
  );

  /* ========================================================================== */
  /* 2. MY LEARNING VIEW                                                       */
  /* ========================================================================== */
  const renderMyLearningView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>My Learning Modules & Progress</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Full-Stack Software Engineering Curriculum (Batch 2026)</p>
        </div>
        <div className={`flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-xl border transition-all duration-250 shadow-sm ${
          theme === 'dark' 
            ? 'bg-[#111] border-[rgba(255,255,255,0.08)]' 
            : 'bg-gray-50 border-[rgba(0,0,0,0.06)]'
        }`}>
          <span className={theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}>Overall Progress:</span>
          <strong className="text-[#10B981]">84.5% Completed</strong>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            title: 'Module 1: Enterprise Microservices & RESTful API Architecture',
            status: 'Completed',
            progress: 100,
            topicsDone: 8,
            topicsTotal: 8,
            lessons: ['Docker Orchestration', 'OpenAPI Schema Specs', 'Express ESM Middleware', 'PostgreSQL Connection Pooling']
          },
          {
            title: 'Module 2: Advanced Data Structures & Algorithmic Problem Solving',
            status: 'Completed',
            progress: 100,
            topicsDone: 10,
            topicsTotal: 10,
            lessons: ['Graph Traversal Algorithms', 'Dynamic Programming Patterns', 'Distributed Consensus', 'Trie Data Structure']
          },
          {
            title: 'Module 3: React Full-Stack Applications & State Optimization',
            status: 'In Progress',
            progress: 82,
            topicsDone: 7,
            topicsTotal: 9,
            lessons: ['React 18 Concurrent Rendering', 'Custom Hooks Architecture', 'Tailwind Utility Styling', 'State Management']
          },
          {
            title: 'Module 4: Cloud Infrastructure, Kubernetes & CI/CD Pipelines',
            status: 'Upcoming',
            progress: 0,
            topicsDone: 0,
            topicsTotal: 6,
            lessons: ['Kubernetes Cluster Ingress', 'GitHub Actions Automation', 'Cloud Run Container Deployment', 'Monitoring with Prometheus']
          }
        ].map((m, idx) => (
          <div key={idx} className={`rounded-2xl border p-5 space-y-4 transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#111] border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.2)]' 
              : 'bg-gray-50 border-[rgba(0,0,0,0.06)] hover:border-[rgba(99,102,241,0.2)]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                  m.status === 'Completed' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                  m.status === 'In Progress' ? 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20' :
                  theme === 'dark' ? 'bg-[#333] text-[#AAA] border-[#444]' : 'bg-gray-200 text-[#64748B] border-gray-300'
                }`}>
                  {m.status}
                </span>
                <h3 className={`font-bold text-base ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{m.title}</h3>
              </div>
              <span className={`text-xs font-mono ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
              }`}>{m.topicsDone} / {m.topicsTotal} Topics Covered</span>
            </div>

            <div className={`w-full h-2 rounded-full overflow-hidden ${
              theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-200'
            }`}>
              <div
                className={`h-full rounded-full ${m.status === 'Completed' ? 'bg-[#10B981]' : 'bg-[#6366F1]'}`}
                style={{ width: `${m.progress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2">
              {m.lessons.map((les, i) => (
                <div key={i} className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all duration-250 hover:-translate-y-0.5 shadow-sm hover:shadow-md ${
                  theme === 'dark' 
                    ? 'bg-[#0D0D0D] border-[rgba(255,255,255,0.08)] text-[#AAA] hover:border-[rgba(16,185,129,0.2)]' 
                    : 'bg-gray-100 border-[rgba(0,0,0,0.06)] text-[#64748B] hover:border-[rgba(16,185,129,0.2)]'
                }`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${m.progress > (i * 25) ? 'text-[#10B981]' : theme === 'dark' ? 'text-[#444]' : 'text-gray-400'}`} />
                  <span className="truncate">{les}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ========================================================================== */
  /* 3. TODAY'S CLASSES                                                         */
  /* ========================================================================== */
  const renderTodaysClassesView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Today's Class Schedule</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Live virtual classrooms and hands-on lab sessions</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            time: '10:00 AM - 12:30 PM',
            topic: 'Enterprise Microservices Architecture & OpenAPI',
            mentor: 'Prof. Rajesh Kumar',
            mode: 'Interactive Lab & Live Lecture',
            status: 'Live Now',
            roomLink: 'https://learnit.edu/live/room-104'
          },
          {
            time: '02:00 PM - 04:00 PM',
            topic: 'System Design: Redis Distributed Caching',
            mentor: 'Dr. Anita Sharma',
            mode: 'Hands-on Coding Session',
            status: 'Scheduled',
            roomLink: 'https://learnit.edu/live/room-202'
          }
        ].map((cls, idx) => (
          <div key={idx} className={`rounded-2xl border p-5 space-y-4 transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-[#111] border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.2)]' 
              : 'bg-gray-50 border-[rgba(0,0,0,0.06)] hover:border-[rgba(99,102,241,0.2)]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#6366F1] px-2 py-0.5 bg-[#6366F1]/10 rounded border border-[#6366F1]/20">{cls.time}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cls.status === 'Live Now' ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 animate-pulse' : 
                    theme === 'dark' ? 'bg-[#1A1A1A] text-[#AAA]' : 'bg-gray-200 text-[#64748B]'
                  }`}>
                    {cls.status}
                  </span>
                </div>
                <h3 className={`font-bold text-base mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{cls.topic}</h3>
                <p className={`text-xs mt-0.5 ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>Mentor: {cls.mentor} • Mode: {cls.mode}</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={cls.roomLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" /> Join Virtual Class
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ========================================================================== */
  /* 4. ATTENDANCE                                                              */
  /* ========================================================================== */
  const renderAttendanceView = () => <StudentAttendance />;

  /* ========================================================================== */
  /* 5. ASSIGNMENTS - FULLY INTEGRATED WITH FIREBASE                           */
  /* ========================================================================== */
  const renderAssignmentsView = () => <StudentAssignments />;


  /* ========================================================================== */
  /* 6. ASSESSMENTS                                                             */
  /* ========================================================================== */
  const renderAssessmentsView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Academic Assessments & Exam Scores</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>View upcoming tests, exam performance graphs, and mentor evaluation notes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-5 rounded-2xl border space-y-3 ${
          theme === 'dark' 
            ? 'bg-[#111] border-[#222]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <span className="text-xs font-bold text-[#6366F1] uppercase tracking-wider block">Upcoming Assessment</span>
          <h3 className={`text-base font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Mid-Term System Architecture & Distributed Queues</h3>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
          }`}>Date: Aug 08, 2026 • Duration: 90 Mins • Mode: Online Proctored</p>
          <div className="pt-2">
            <button className="px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-semibold">Take Practice Test</button>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border space-y-3 ${
          theme === 'dark' 
            ? 'bg-[#111] border-[#222]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider block">Completed Test Score</span>
          <h3 className={`text-base font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Core Data Structures & Algorithmic Complexity</h3>
          <div className="text-xl font-extrabold text-[#10B981] font-mono">96 / 100 (Grade A+)</div>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Mentor Remark: "Outstanding performance in graph traversal algorithms."</p>
        </div>
      </div>
    </div>
  );

  /* ========================================================================== */
  /* 7. STUDY MATERIALS & 8. VIDEO LIBRARY                                      */
  /* ========================================================================== */
  const renderStudyMaterialsView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Study Materials & Reference Documents</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Download course PDFs, slide decks, and reference guides</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((mat) => (
          <div key={mat.id} className={`p-4 rounded-2xl border space-y-3 flex flex-col justify-between ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">
                  {mat.type}
                </span>
                <button onClick={() => toggleBookmark(mat.id)}>
                  <Bookmark className={`w-4 h-4 ${bookmarkedVideos.includes(mat.id) ? 'text-[#F59E0B] fill-amber-500' : theme === 'dark' ? 'text-[#666]' : 'text-gray-400'}`} />
                </button>
              </div>
              <h3 className={`font-bold text-sm mt-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{mat.title}</h3>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>{mat.description}</p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between text-xs ${
              theme === 'dark' ? 'border-[#222]' : 'border-gray-200'
            }`}>
              <span className={`font-mono ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>{mat.durationOrPages || '3.5 MB'}</span>
              <a href={mat.url} target="_blank" rel="noreferrer" className="text-[#10B981] font-semibold hover:underline flex items-center gap-1">
                Download / View <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVideoLibraryView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Video Library & Lecture Recordings</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Watch recorded classroom sessions with continue watching state</p>
        </div>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${
        theme === 'dark' 
          ? 'bg-[#111] border-[#222]' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className={`aspect-video relative flex items-center justify-center p-8 ${
          theme === 'dark' ? 'bg-[#000]' : 'bg-gray-900'
        }`}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#6366F1] hover:bg-indigo-600 text-white flex items-center justify-center shadow-lg mx-auto transition-transform active:scale-95 cursor-pointer">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
            <div>
              <span className={`text-sm font-bold block ${
                theme === 'dark' ? 'text-white' : 'text-gray-200'
              }`}>{activeVideo?.title || 'No video selected'}</span>
              <span className={`text-xs mt-1 block ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-400'
              }`}>Duration: {activeVideo?.durationOrPages || '—'} • Mentor: {activeVideo?.uploadedBy || '—'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className={`font-bold text-base ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{activeVideo?.title || 'No video selected'}</h3>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
          }`}>Batch: {activeVideo?.programTitle || '—'} • Uploaded {activeVideo?.uploadedAt || '—'}</p>
        </div>
      </div>
    </div>
  );

  /* ========================================================================== */
  /* 9. CERTIFICATES                                                            */
  /* ========================================================================== */
  const renderCertificatesView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Issued Course Certificates</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Tamper-proof verified certificates with public QR code hashes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[]?.map((cert: any) => (
          <div key={cert.id} className={`rounded-2xl border p-6 space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#A855F7]" />
              </div>
              <span className="font-mono text-[10px] text-[#A855F7] font-bold bg-[#A855F7]/10 px-2 py-0.5 rounded border border-[#A855F7]/20">
                VERIFIED PDF
              </span>
            </div>

            <div>
              <h3 className={`font-bold text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{cert.programTitle}</h3>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
              }`}>Issued on: {cert.issuedDate} • Cert ID: {cert.certificateNumber}</p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between ${
              theme === 'dark' ? 'border-[#222]' : 'border-gray-200'
            }`}>
              <button
                onClick={onOpenCertificateModal}
                className="text-xs text-[#6366F1] font-semibold hover:underline flex items-center gap-1"
              >
                Preview & Verify QR <QrCode className="w-3.5 h-3.5" />
              </button>
              <a
                href={cert.verifyUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-[#A855F7] hover:bg-purple-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ========================================================================== */
  /* 11. CAREER PROFILE & 12. ACHIEVEMENTS                                     */
  /* ========================================================================== */
  const renderCareerProfileView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Career Profile & Placement Readiness Score</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Comprehensive analysis of technical proficiency, communication skills, and mock performance</p>
        </div>
        <span className="font-mono text-xl font-extrabold text-[#10B981]">92 / 100 Score</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className={`p-4 rounded-2xl border space-y-2 ${
          theme === 'dark' 
            ? 'bg-[#111] border-[#222]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <span className={`uppercase font-bold text-[10px] ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Communication Rating</span>
          <div className={`text-lg font-bold font-mono ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>88 / 100</div>
          <p className={`text-[11px] ${
            theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
          }`}>Evaluated during Mock HR Interview round.</p>
        </div>
        <div className={`p-4 rounded-2xl border space-y-2 ${
          theme === 'dark' 
            ? 'bg-[#111] border-[#222]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <span className={`uppercase font-bold text-[10px] ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Mock Interview Score</span>
          <div className="text-lg font-bold text-[#F59E0B] font-mono">94 / 100</div>
          <p className={`text-[11px] ${
            theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
          }`}>System Design & Microservices focus.</p>
        </div>
      </div>
    </div>
  );

  const renderAchievementsView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Badges & Achievements</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Recognitions earned across attendance, assignments, and placement readiness</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Top 5% Academic Rank', desc: 'Maintained >95% assignment scores for 3 consecutive months.', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
          { title: 'Perfect Attendance Badge', desc: 'Achieved 100% attendance check-in for July 2026.', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
          { title: 'Placement Ready Star', desc: 'Completed all technical benchmarks and resume verification.', color: 'text-[#6366F1]', bg: 'bg-[#6366F1]/10' }
        ].map((ach, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border space-y-3 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl ${ach.bg} flex items-center justify-center`}>
              <Award className={`w-5 h-5 ${ach.color}`} />
            </div>
            <h3 className={`font-bold text-base ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{ach.title}</h3>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>{ach.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessagesView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between pb-4 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Mentor Conversations</h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>Direct messages with your assigned mentor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
        {/* Left Side - Conversation List */}
        <div className="space-y-2">
          <h3 className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-3 ${
            theme === 'dark' ? 'text-[#555]' : 'text-[#64748B]'
          }`}>Mentor Conversations</h3>
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
                <img src={conv.mentorAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <strong className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{conv.mentorName}</strong>
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
                <img src={selectedConversation.mentorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <strong className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedConversation.mentorName}</strong>
                  <p className={`text-xs ${theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'}`}>{selectedConversation.batch}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[350px]">
                {selectedConversation.messages.map((msg: any) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'mentor' && (
                      <img src={selectedConversation.mentorAvatar} alt="" className="w-8 h-8 rounded-full object-cover mt-1" />
                    )}
                    <div className={`max-w-[70%] ${msg.sender === 'student' ? 'text-right' : 'text-left'}`}>
                      <div className={`text-[10px] font-semibold mb-1 ${
                        theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
                      }`}>{msg.name}</div>
                      <div className={`p-3 rounded-xl text-xs ${
                        msg.sender === 'student'
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
                  placeholder="Type your question..."
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

  /* 14. NOTIFICATIONS & 15. PROFILE                                           */
  /* ========================================================================== */
  const renderNotificationsView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Notifications & Alerts</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Updates on assignments, drive announcements, and assessment schedules</p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { title: 'Google India Drive Published', time: '2 hours ago', body: 'Software Development Engineer - 1 drive is now open for application.' },
          { title: 'Assignment Grading Posted', time: '1 day ago', body: 'Prof. Rajesh Kumar evaluated Microservices OpenAPI submission (95/100).' },
          { title: 'Attendance Verified', time: '2 days ago', body: 'QR Geofence attendance checked in for Aug 04 lecture.' }
        ].map((n, i) => (
          <div key={i} className={`p-4 rounded-xl border space-y-1 ${
            theme === 'dark' 
              ? 'bg-[#111] border-[#222]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-bold text-xs ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{n.title}</h4>
              <span className={`text-[10px] font-mono ${
                theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
              }`}>{n.time}</span>
            </div>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
            }`}>{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileView = () => (
    <div className={`rounded-2xl border p-6 space-y-6 transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Student Profile & Credentials</h2>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}>Personal data, academic enrollment details, and security settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className={`p-5 rounded-2xl border space-y-3 ${
          theme === 'dark' 
            ? 'bg-[#111] border-[#222]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Personal Information</h3>
          <p className={theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}>Name: <strong>{student.name}</strong></p>
          <p className={theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}>Roll / USN: <strong className="font-mono">{student.rollNumber}</strong></p>
          <p className={theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}>Email: <strong>{student.email}</strong></p>
          <p className={theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}>Phone: <strong>{student.phone}</strong></p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-3 ${
          theme === 'dark' 
            ? 'bg-[#111] border-[#222]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`font-bold text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Academic Enrollment</h3>
          <p className={theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}>College: <strong>{student.collegeName}</strong></p>
          <p className={theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}>Department: <strong>{student.departmentName}</strong></p>
          <p className={theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}>Batch: <strong>{student.batchName}</strong></p>
          <p className={theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'}>Current CGPA: <strong className="text-[#10B981] font-mono">{student.cgpa}</strong></p>
        </div>
      </div>
    </div>
  );

  /* ========================================================================== */
  /* TAB SWITCHER RENDER ENGINE                                                */
  /* ========================================================================== */
  const renderCurrentTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return renderDashboardView();
      case 'learning':
      case 'courses':
        return renderMyLearningView();
      case 'todays_classes':
        return renderTodaysClassesView();
      case 'attendance':
        return renderAttendanceView();
      case 'assignments':
        return renderAssignmentsView();
      case 'assessments':
        return renderAssessmentsView();
      case 'study_materials':
        return renderStudyMaterialsView();
      case 'video_library':
      case 'lectures':
        return renderVideoLibraryView();
      case 'placements':
        return renderCareerProfileView();
      case 'career_profile':
        return renderCareerProfileView();
      case 'achievements':
        return renderAchievementsView();
      case 'reports':
        return renderAchievementsView();
      case 'announcements':
        return renderNotificationsView();
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
      {renderCurrentTabContent()}

    </div>
  );
};
