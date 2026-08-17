import React from 'react';
import { Avatar } from './Avatar';
import { Sparkles, Clock, TrendingUp, Bell } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export interface WelcomeSectionProps {
  userName: string;
  userRole: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  stats?: {
    completedTasks: number;
    pendingTasks: number;
    upcomingDeadlines: number;
  };
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName,
  userRole,
  timeOfDay,
  stats = { completedTasks: 12, pendingTasks: 5, upcomingDeadlines: 2 }
}) => {
  const { theme } = useTheme();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = timeOfDay 
    ? `Good ${timeOfDay}`
    : getGreeting();

  return (
    <div className={`border rounded-2xl p-6 mb-6 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#0A0A0A] to-[#111] border-[#1A1A1A]' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
    }`}>
      {/* Background gradient effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#6366F1]/10 via-[#A855F7]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className={`text-xs font-mono uppercase font-bold tracking-wider mb-1 ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`}>
              {greeting}, {userName}
            </p>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Welcome back to your {userRole} dashboard
            </h2>
          </div>
          <Avatar name={userName} size="lg" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`border rounded-xl p-4 hover:border transition-colors ${
            theme === 'dark' 
              ? 'bg-[#0D0D0D] border-[#1A1A1A] hover:border-[#2A2A2A]' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <span className={`text-[10px] font-mono uppercase ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`}>Completed</span>
            </div>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.completedTasks}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>Tasks this week</p>
          </div>

          <div className={`border rounded-xl p-4 hover:border transition-colors ${
            theme === 'dark' 
              ? 'bg-[#0D0D0D] border-[#1A1A1A] hover:border-[#2A2A2A]' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <span className={`text-[10px] font-mono uppercase ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`}>Pending</span>
            </div>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.pendingTasks}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>Tasks remaining</p>
          </div>

          <div className={`border rounded-xl p-4 hover:border transition-colors ${
            theme === 'dark' 
              ? 'bg-[#0D0D0D] border-[#1A1A1A] hover:border-[#2A2A2A]' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <Bell className="w-4 h-4 text-purple-400" />
              </div>
              <span className={`text-[10px] font-mono uppercase ${theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'}`}>Deadlines</span>
            </div>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.upcomingDeadlines}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'}`}>This week</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#6366F1]" />
            <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Actions</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors">
              View Schedule
            </button>
            <button className={`px-4 py-2 border text-white text-xs font-semibold rounded-xl transition-colors ${
              theme === 'dark' 
                ? 'bg-[#141414] border-[#222] hover:bg-[#1A1A1A]' 
                : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-900'
            }`}>
              Check Notifications
            </button>
            <button className={`px-4 py-2 border text-white text-xs font-semibold rounded-xl transition-colors ${
              theme === 'dark' 
                ? 'bg-[#141414] border-[#222] hover:bg-[#1A1A1A]' 
                : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-900'
            }`}>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
