import React, { useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  NotificationItem
} from '../types';
import {
  mockUserProfiles,
  mockNotifications
} from '../mockData';
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  BookOpen,
  User,
  Bell,
  Search,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Info,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { Avatar, Tooltip } from './DesignSystem';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentRole: UserRole | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenAuditLogs?: () => void;
  onOpenPublicPortal?: () => void;
  onOpenApiDocs?: () => void;
  onLogout?: () => void;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  searchTerm,
  onSearchChange,
  onOpenAuditLogs,
  onOpenPublicPortal,
  onOpenApiDocs,
  onLogout,
  onMobileMenuToggle,
  isMobileMenuOpen = false
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const currentUser: UserProfile = currentRole ? mockUserProfiles[currentRole] : mockUserProfiles['student'];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#notif-bell-btn') && !target.closest('#notif-menu')) {
        setShowNotifMenu(false);
      }
    };

    if (showNotifMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifMenu]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Enhanced search functionality
  const handleSearchFocus = () => {
    if (searchTerm.length > 0) {
      // Trigger command palette when search is focused and has content
      onSearchChange(searchTerm);
    }
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-[rgba(13,13,20,0.85)]' : 'bg-[rgba(255,255,255,0.85)]'} border-b backdrop-blur-xl h-[72px] transition-all duration-250 shadow-lg ${
      theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
    }`}>
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <Tooltip content="Toggle menu">
            <button
              onClick={onMobileMenuToggle}
              className={`md:hidden p-2 rounded-lg transition-all duration-250 hover:-translate-y-0.5 ${
                theme === 'dark' ? 'text-[#AAA] hover:text-white hover:bg-[#14141C] hover:shadow-sm' : 'text-[#64748B] hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </Tooltip>

          <div 
            onClick={onOpenPublicPortal} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-none bg-white flex items-center justify-center text-white shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-250 overflow-hidden">
              <img src="/logo.png" alt="LearnIT Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-bold tracking-tight text-lg leading-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>LearnIT</span>
                <span className="bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">ERP</span>
              </div>
              <p className={`text-[11px] font-medium leading-tight mt-0.5 ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`}>Enterprise Platform</p>
            </div>
          </div>

          <div className={`hidden md:block h-6 w-[1px] mx-1 transition-colors duration-250 ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.08)]' : 'bg-[rgba(0,0,0,0.06)]'}`}></div>

          {/* Current Role Display (Read-only) */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all duration-250 shadow-sm ${
            theme === 'dark' ? 'bg-[#14141C] border-[rgba(255,255,255,0.08)]' : 'bg-gray-50 border-[rgba(0,0,0,0.06)]'
          }`}>
            <span className="flex items-center gap-1.5">
              {currentRole === 'super_admin' && <ShieldCheck className="w-4 h-4 text-purple-600" />}
              {currentRole === 'college_admin' && <Building2 className="w-4 h-4 text-blue-600" />}
              {currentRole === 'mentor' && <BookOpen className="w-4 h-4 text-emerald-600" />}
              {currentRole === 'student' && <User className="w-4 h-4 text-cyan-600" />}
              <span className={`font-semibold capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currentRole ? currentRole.replace('_', ' ') : 'Dashboard'}</span>
            </span>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative group">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#6366F1] transition-colors duration-250 ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`} />
            <input
              type="text"
              placeholder="Search programs, students, drives, reports..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={handleSearchFocus}
              className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-lg focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all duration-250 group-focus-within:bg-opacity-80 shadow-sm ${
                theme === 'dark' 
                  ? 'bg-[#14141C] border-[rgba(255,255,255,0.08)] text-white placeholder-[#666] group-focus-within:bg-[#171720] group-focus-within:shadow-md' 
                  : 'bg-gray-50 border-[rgba(0,0,0,0.06)] text-gray-900 placeholder-[#64748B] group-focus-within:bg-gray-100 group-focus-within:shadow-md'
              }`}
            />
            <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded-md border group-focus-within:hidden transition-colors duration-250 ${
              theme === 'dark' ? 'text-[#777] bg-[#171720] border-[rgba(255,255,255,0.08)]' : 'text-[#64748B] bg-gray-100 border-[rgba(0,0,0,0.06)]'
            }`}>
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <Tooltip content={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <button
              onClick={toggleTheme}
              className={`relative p-2 rounded-lg transition-all duration-250 hover:-translate-y-0.5 ${
                theme === 'dark' 
                  ? 'text-[#AAA] hover:text-white hover:bg-[#14141C] hover:shadow-sm' 
                  : 'text-[#64748B] hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
              }`}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-[#6366F1]" />
              ) : (
                <Sun className="w-4 h-4 text-[#F59E0B]" />
              )}
            </button>
          </Tooltip>
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <Tooltip content="Notifications">
              <button
                id="notif-bell-btn"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className={`relative p-2 rounded-lg transition-all duration-250 hover:-translate-y-0.5 ${
                  theme === 'dark' 
                    ? 'text-[#AAA] hover:text-white hover:bg-[#14141C] hover:shadow-sm' 
                    : 'text-[#64748B] hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
                )}
              </button>
            </Tooltip>

            {showNotifMenu && (
              <div
                id="notif-menu"
                className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 transition-all duration-250 ${
                  theme === 'dark' 
                    ? 'bg-[#0D0D14] border-[rgba(255,255,255,0.08)]' 
                    : 'bg-white border-[rgba(0,0,0,0.06)]'
                }`}
              >
                <div className={`flex items-center justify-between pb-2 border-b transition-colors duration-250 ${theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'}`}>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-[#6366F1] font-medium hover:underline transition-colors duration-250"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className={`divide-y max-h-72 overflow-y-auto mt-2 transition-colors duration-250 ${theme === 'dark' ? 'divide-[rgba(255,255,255,0.08)]' : 'divide-[rgba(0,0,0,0.06)]'}`}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`py-2 text-xs flex items-start gap-2.5 cursor-pointer rounded-lg transition-all duration-250 ${
                        !n.read 
                          ? theme === 'dark' 
                            ? 'bg-[#171720] p-2 border border-[rgba(255,255,255,0.08)] shadow-sm' 
                            : 'bg-gray-50 p-2 border border-[rgba(0,0,0,0.06)] shadow-sm'
                          : ''
                      } ${theme === 'dark' ? 'hover:bg-[#14141C]' : 'hover:bg-gray-50'}`}
                    >
                      {n.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />}
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />}
                      {n.type === 'info' && <Info className="w-4 h-4 text-[#6366F1] shrink-0 mt-0.5" />}
                      {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{n.title}</p>
                        <p className={`text-[11px] leading-relaxed mt-0.5 ${theme === 'dark' ? 'text-[#999]' : 'text-[#64748B]'}`}>{n.message}</p>
                        <span className={`text-[10px] mt-1 inline-block ${theme === 'dark' ? 'text-[#666]' : 'text-[#94A3B8]'}`}>{n.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info & Logout */}
          <div className={`flex items-center gap-2 pl-2 border-l transition-colors duration-250 ${theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'}`}>
            <Tooltip content="Logout">
              <button
                onClick={onLogout}
                className={`p-2 rounded-lg transition-all duration-250 hover:-translate-y-0.5 ${
                  theme === 'dark' 
                    ? 'text-[#AAA] hover:text-white hover:bg-[#14141C] hover:shadow-sm' 
                    : 'text-[#64748B] hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
                }`}
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </Tooltip>

            <div className="flex items-center gap-2 p-1">
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="md"
              />
              <div className="hidden sm:block text-left">
                <p className={`text-xs font-semibold leading-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currentUser.name}</p>
                <p className={`text-[10px] truncate max-w-[130px] leading-tight mt-0.5 ${theme === 'dark' ? 'text-[#777]' : 'text-[#64748B]'}`}>
                  {currentUser.title || currentUser.email}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
