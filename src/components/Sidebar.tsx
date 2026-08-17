import React from 'react';
import { UserRole } from '../types';
import { Tooltip } from './DesignSystem';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  UserCheck,
  Briefcase,
  FileCheck,
  Video,
  Award,
  CreditCard,
  BarChart3,
  ShieldAlert,
  Settings,
  CalendarDays,
  CheckCircle,
  Clock,
  Building,
  Sparkles,
  MessageSquare,
  HelpCircle,
  User,
  Bell,
  TrendingUp,
  FileSpreadsheet,
  Sliders,
  Lock,
  Globe,
  X
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  section?: string;
}

interface SidebarProps {
  currentRole: UserRole | null;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { theme } = useTheme();
  
  const getNavItems = (): NavItem[] => {
    if (!currentRole) return [];

    switch (currentRole) {
      case 'super_admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'MAIN' },
          { id: 'placements', label: 'Partners', icon: <Briefcase className="w-4 h-4" />, section: 'MAIN' },
          { id: 'colleges', label: 'Colleges', icon: <Building2 className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'mentors', label: 'Mentors', icon: <UserCheck className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'programs', label: 'Programs', icon: <GraduationCap className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'attendance', label: 'Attendance', icon: <CheckCircle className="w-4 h-4" />, badge: 0, section: 'OPERATIONS' },
          { id: 'assessments', label: 'Assessments', icon: <BarChart3 className="w-4 h-4" />, section: 'OPERATIONS' },
          { id: 'reports', label: 'Reports', icon: <FileSpreadsheet className="w-4 h-4" />, section: 'OPERATIONS' },
          { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: 0, section: 'SYSTEM' },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, section: 'SYSTEM' }
        ];

      case 'college_admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'MAIN' },
          { id: 'placements', label: 'Partners', icon: <Briefcase className="w-4 h-4" />, section: 'MAIN' },
          { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'departments', label: 'Departments', icon: <Building className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'batches', label: 'Batches', icon: <CalendarDays className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'mentors', label: 'Mentors', icon: <UserCheck className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" />, section: 'MAIN' },
          { id: 'attendance', label: 'Attendance', icon: <CheckCircle className="w-4 h-4" />, badge: 0, section: 'ACADEMICS' },
          { id: 'assessments', label: 'Assessments', icon: <BarChart3 className="w-4 h-4" />, section: 'ACADEMICS' },
          { id: 'assignments', label: 'Assignments', icon: <FileCheck className="w-4 h-4" />, badge: 0, section: 'ACADEMICS' },
          { id: 'eligible_students', label: 'Eligible Students', icon: <UserCheck className="w-4 h-4" />, section: 'PLACEMENT' },
          { id: 'reports', label: 'Reports', icon: <FileSpreadsheet className="w-4 h-4" />, section: 'PLACEMENT' },
          { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" />, badge: 0, section: 'COMMUNICATION' },
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, section: 'ACCOUNT' }
        ];

      case 'mentor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'MAIN' },
          { id: 'my_classes', label: 'My Classes', icon: <BookOpen className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'schedule', label: "Today's Schedule", icon: <Clock className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'attendance', label: 'Attendance', icon: <CheckCircle className="w-4 h-4" />, badge: 0, section: 'TEACHING' },
          { id: 'assignments', label: 'Assignments', icon: <FileCheck className="w-4 h-4" />, badge: 0, section: 'TEACHING' },
          { id: 'assessments', label: 'Assessments', icon: <BarChart3 className="w-4 h-4" />, section: 'TEACHING' },
          { id: 'materials', label: 'Study Materials', icon: <FileCheck className="w-4 h-4" />, badge: 0, section: 'TEACHING' },
          { id: 'video_library', label: 'Video Library', icon: <Video className="w-4 h-4" />, badge: 0, section: 'TEACHING' },
          { id: 'reports', label: 'Reports', icon: <FileSpreadsheet className="w-4 h-4" />, section: 'STUDENT OUTCOMES' },
          { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" />, badge: 0, section: 'COMMUNICATION' },
          { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, section: 'COMMUNICATION' },
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, section: 'ACCOUNT' }
        ];

      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'MAIN' },
          { id: 'learning', label: 'My Classes', icon: <BookOpen className="w-4 h-4" />, section: 'MAIN' },
          { id: 'todays_classes', label: "Today's Schedule", icon: <CalendarDays className="w-4 h-4" />, badge: 0, section: 'MAIN' },
          { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" />, section: 'LEARNING' },
          { id: 'assignments', label: 'Assignments', icon: <FileCheck className="w-4 h-4" />, badge: 0, section: 'LEARNING' },
          { id: 'assessments', label: 'Assessments', icon: <BarChart3 className="w-4 h-4" />, section: 'LEARNING' },
          { id: 'study_materials', label: 'Study Materials', icon: <Building className="w-4 h-4" />, badge: 0, section: 'LEARNING' },
          { id: 'video_library', label: 'Video Library', icon: <Video className="w-4 h-4" />, badge: 0, section: 'LEARNING' },
          { id: 'career_profile', label: 'Career Support', icon: <TrendingUp className="w-4 h-4" />, section: 'CAREER' },
          { id: 'reports', label: 'Reports', icon: <FileSpreadsheet className="w-4 h-4" />, section: 'CAREER' },
          { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" />, badge: 0, section: 'COMMUNICATION' },
          { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, section: 'COMMUNICATION' },
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, section: 'ACCOUNT' }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleLabel = (): string => {
    if (!currentRole) return '';
    switch (currentRole) {
      case 'super_admin': return 'Super Admin';
      case 'college_admin': return 'College Admin';
      case 'mentor': return 'Mentor';
      case 'student': return 'Student';
      default: return '';
    }
  };

  const getRoleIcon = (): React.ReactNode => {
    if (!currentRole) return null;
    switch (currentRole) {
      case 'super_admin': return <ShieldAlert className="w-4 h-4" />;
      case 'college_admin': return <Building2 className="w-4 h-4" />;
      case 'mentor': return <GraduationCap className="w-4 h-4" />;
      case 'student': return <User className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <aside className={`w-[280px] h-full border-r flex flex-col overflow-hidden transition-all duration-250 shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#0D0D14] border-[rgba(255,255,255,0.08)] text-[#AAA]' 
        : 'bg-white border-[rgba(0,0,0,0.06)] text-[#64748B]'
    }`}>
      {/* Role Indicator */}
      <div className={`shrink-0 px-4 py-4 border-b flex items-center gap-2 transition-colors duration-250 ${
        theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <span className={`flex-shrink-0 ${theme === 'dark' ? 'text-[#6366F1]' : 'text-[#6366F1]'}`}>
          {getRoleIcon()}
        </span>
        <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {getRoleLabel()}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 flex flex-col space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <Tooltip key={item.id} content={item.label} position="right">
              <motion.button
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile?.();
                }}
                style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-250 h-[44px] relative shrink-0 ${
                  isActive
                    ? theme === 'dark' 
                      ? 'bg-[#6366F1]/10 text-white font-semibold shadow-sm' 
                      : 'bg-[#6366F1]/5 text-gray-900 font-semibold shadow-sm'
                    : theme === 'dark' 
                      ? 'text-[#999] hover:text-white hover:bg-[#14141C] hover:shadow-sm' 
                      : 'text-[#64748B] hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
                }`}
                whileHover={{ x: isActive ? 0 : 2, y: isActive ? 0 : -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-[#6366F1] to-[#A855F7] rounded-r-full shadow-sm"
                    layoutId="activeIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                
                <div className="flex items-center gap-3 flex-1 min-w-0 pl-1">
                  <motion.span
                    className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${isActive ? 'text-[#6366F1]' : theme === 'dark' ? 'text-[#777]' : 'text-[#94A3B8]'}`}
                    animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.span>
                  <motion.span
                    className={`truncate ${isActive ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : (theme === 'dark' ? 'text-[#BBB]' : 'text-[#475569]')}`}
                    animate={{ opacity: isActive ? 1 : 0.85 }}
                  >
                    {item.label}
                  </motion.span>
                </div>
                {item.badge !== undefined && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full transition-all duration-250 ${
                      isActive
                        ? 'bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30 shadow-sm'
                        : theme === 'dark'
                          ? 'bg-[#171720] text-[#888] border border-[#222] hover:shadow-sm'
                          : 'bg-gray-100 text-[#64748B] border border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.button>
            </Tooltip>
          );
        })}
      </nav>

      {/* Fixed Footer */}
      <div className={`shrink-0 p-4 border-t ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <div className={`rounded-xl p-3 border ${
          theme === 'dark' 
            ? 'bg-[#14141C] border-[#222]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className={`text-[11px] font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>LearnIT Cloud v2.4</span>
          </div>
          <p className={`text-[10px] leading-tight ${
            theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'
          }`}>
            Multi-College ERP Engine with Real-Time Placement Automation.
          </p>
        </div>
      </div>
    </aside>
  );
};
