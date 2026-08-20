import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAssignments } from '../../hooks/useAssignments';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useAttendance } from '../../hooks/useAttendance';
import { useClasses } from '../../hooks/useClasses';
import { useMaterials } from '../../hooks/useMaterials';
import { useVideos } from '../../hooks/useVideos';
import { StudentAssignments } from './StudentAssignments';
import { StudentAttendance } from './StudentAttendance';
import { StudentAssessments } from './StudentAssessments';
import {
  BookOpen,
  Calendar,
  FileText,
  Video,
  Bell,
  BarChart3,
  User,
  CheckCircle,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';

interface StudentDashboardProps {
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  activeTab = 'dashboard',
  onSelectTab
}) => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Firebase Hooks - Load real data
  const { assignments, submissions, loading: assignmentsLoading } = useAssignments();
  const { classes, loading: classesLoading } = useClasses();
  const { attendance, loading: attendanceLoading } = useAttendance(
    userProfile?.classId || '',
    new Date().toISOString().split('T')[0]
  );
  const { materials, loading: materialsLoading } = useMaterials();
  const { videos, loading: videosLoading } = useVideos();
  const { announcements, loading: announcementsLoading } = useAnnouncements();

  // Filter data for current student
  const studentAssignments = assignments.filter(a =>
    userProfile?.classId && a.classId === userProfile.classId
  );

  const studentSubmissions = submissions.filter(s =>
    s.studentId === userProfile?.id
  );

  const studentClass = classes.find(c => c.id === userProfile?.classId);

  const studentMaterials = materials.filter(m =>
    userProfile?.classId && m.classId === userProfile.classId
  );

  const studentVideos = videos.filter(v =>
    userProfile?.classId && v.classId === userProfile.classId
  );

  const studentAnnouncements = announcements.filter(a =>
    userProfile?.classId && a.classId === userProfile.classId
  );

  // Calculate real statistics
  const pendingAssignments = studentAssignments.filter(a => {
    const submission = studentSubmissions.find(s => s.assignmentId === a.id);
    return !submission || submission.status !== 'Graded';
  });

  const completedAssignments = studentSubmissions.filter(s => 
    s.status === 'Graded'
  );

  const attendanceRecords = attendance.filter(a => 
    a.studentId === userProfile?.id
  );

  const attendanceRate = attendanceRecords.length > 0
    ? Math.round((attendanceRecords.filter(a => a.status === 'Present' || a.status === 'Late').length / attendanceRecords.length) * 100)
    : 0;

  const avgScore = completedAssignments.length > 0
    ? Math.round(completedAssignments.reduce((sum, s) => sum + (s.marksObtained || 0), 0) / completedAssignments.length)
    : 0;

  // Tab change handler
  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    if (onSelectTab) {
      onSelectTab(tabId);
    }
  };

  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  // Dashboard Overview Tab
  const renderDashboardView = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`rounded-2xl p-6 border ${
        theme === 'dark' ? 'bg-[#0A0A0E] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <h1 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Welcome back, {userProfile?.name}!
        </h1>
        <p className={`text-sm mt-1 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {studentClass ? studentClass.title : 'No class assigned yet'}
        </p>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Total Assignments</p>
              <p className={`text-2xl font-bold mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{studentAssignments.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Pending</p>
              <p className={`text-2xl font-bold mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{pendingAssignments.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Attendance</p>
              <p className={`text-2xl font-bold mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{attendanceRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Avg Score</p>
              <p className={`text-2xl font-bold mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{avgScore}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className={`rounded-xl p-6 border ${
        theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Today's Schedule</h3>
        {studentClass ? (
          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{studentClass.title}</h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {studentClass.schedule?.day} • {studentClass.schedule?.startTime} - {studentClass.schedule?.endTime}
                </p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Mentor: {studentClass.mentorName}</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        ) : (
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            No class assigned yet
          </p>
        )}
      </div>

      {/* Recent Activity - Real Announcements */}
      <div className={`rounded-xl p-6 border ${
        theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Recent Announcements</h3>
        {studentAnnouncements.length === 0 ? (
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            No announcements yet
          </p>
        ) : (
          <div className="space-y-3">
            {studentAnnouncements.slice(0, 3).map(announcement => (
              <div key={announcement.id} className={`p-3 rounded-lg border ${
                theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`font-semibold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{announcement.title}</h4>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{announcement.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Main render with tab navigation
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A0A0E]' : 'bg-gray-50'}`}>
      {/* Tab Navigation */}
      <div className={`border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div className="flex gap-2 p-4 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'my-classes', label: 'My Classes', icon: BookOpen },
            { id: 'schedule', label: "Today's Schedule", icon: Calendar },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'assessments', label: 'Assessments', icon: Award },
            { id: 'attendance', label: 'Attendance', icon: CheckCircle },
            { id: 'materials', label: 'Study Materials', icon: BookOpen },
            { id: 'videos', label: 'Video Library', icon: Video },
            { id: 'announcements', label: 'Announcements', icon: Bell },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'profile', label: 'Profile', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  currentTab === tab.id
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Dashboard Tab */}
        {currentTab === 'dashboard' && renderDashboardView()}

        {/* My Classes Tab */}
        {currentTab === 'my-classes' && (
          <div className="space-y-4">
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>My Classes</h2>
            {studentClass ? (
              <div className={`p-6 rounded-xl border ${
                theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{studentClass.title}</h3>
                <p className={`mt-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{studentClass.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Mentor</p>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{studentClass.mentorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Batch</p>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{studentClass.batchName}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No class assigned yet. Contact your administrator.
              </p>
            )}
          </div>
        )}

        {/* Today's Schedule Tab */}
        {currentTab === 'schedule' && (
          <div className="space-y-4">
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Today's Schedule</h2>
            {renderDashboardView()}
          </div>
        )}

        {/* Assignments Tab - Use existing component */}
        {currentTab === 'assignments' && (
          <StudentAssignments 
            studentId={userProfile?.id || ''}
            classId={userProfile?.classId || ''}
          />
        )}

        {/* Assessments Tab - Use new component */}
        {currentTab === 'assessments' && (
          <StudentAssessments />
        )}

        {/* Attendance Tab - Use existing component */}
        {currentTab === 'attendance' && (
          <StudentAttendance 
            studentId={userProfile?.id || ''}
            classId={userProfile?.classId || ''}
          />
        )}

        {/* Study Materials Tab */}
        {currentTab === 'materials' && (
          <div className="space-y-4">
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Study Materials</h2>
            {materialsLoading ? (
              <p>Loading materials...</p>
            ) : studentMaterials.length === 0 ? (
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No materials available yet
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentMaterials.map(material => (
                  <div key={material.id} className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
                  }`}>
                    <h4 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{material.title}</h4>
                    <p className={`text-sm mt-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{material.description}</p>
                    <div className="mt-3">
                      <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded">
                        {material.type}
                      </span>
                    </div>
                    <button
                      onClick={() => material.url && window.open(material.url, '_blank')}
                      className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video Library Tab */}
        {currentTab === 'videos' && (
          <div className="space-y-4">
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Video Library</h2>
            {videosLoading ? (
              <p>Loading videos...</p>
            ) : studentVideos.length === 0 ? (
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No videos available yet
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentVideos.map(video => (
                  <div key={video.id} className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
                  }`}>
                    <div className="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{video.title}</h4>
                    <p className={`text-sm mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{video.description}</p>
                    <button
                      onClick={() => video.videoUrl && window.open(video.videoUrl, '_blank')}
                      className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Watch Video
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Announcements Tab */}
        {currentTab === 'announcements' && (
          <div className="space-y-4">
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Announcements</h2>
            {announcementsLoading ? (
              <p>Loading announcements...</p>
            ) : studentAnnouncements.length === 0 ? (
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No announcements yet
              </p>
            ) : (
              <div className="space-y-3">
                {studentAnnouncements.map(announcement => (
                  <div key={announcement.id} className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{announcement.title}</h4>
                        <p className={`text-sm mt-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{announcement.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          By {announcement.mentorName} • {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        announcement.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                        announcement.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {announcement.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {currentTab === 'reports' && (
          <div className="space-y-4">
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Performance Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-xl border ${
                theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Assignment Performance</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Total Assignments</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{studentAssignments.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{completedAssignments.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{avgScore}%</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${
                theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Attendance Summary</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Overall Attendance</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{attendanceRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Classes</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{attendanceRecords.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Present</p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{attendanceRecords.filter(a => a.status === 'Present').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {currentTab === 'profile' && (
          <div className="space-y-4">
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>My Profile</h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{userProfile?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{userProfile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Roll Number</p>
                  <p className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{userProfile?.rollNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{userProfile?.departmentName}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
