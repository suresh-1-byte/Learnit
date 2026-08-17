import React from 'react';
import { Activity, FileCheck, CheckCircle, Award, Download } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface ActivityItem {
  icon: React.ReactNode;
  title: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-2xl border p-5 space-y-4 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#14141C] border-[#1A1A1A]' : 'bg-white border-gray-200'
    }`}>
    <div className={`flex items-center justify-between pb-3 border-b ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-[#6366F1]" />
        <h2 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
      </div>
    </div>

    <div className="space-y-3">
      {activities.map((activity, idx) => (
        <div key={idx} className={`p-3 rounded-xl border flex items-start gap-3 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#171720] border-[#222]' : 'bg-gray-50 border-gray-200'
        }`}>
          {activity.icon}
          <div>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{activity.title}</p>
            <p className={`text-[10px] ${theme === 'dark' ? 'text-[#999]' : 'text-[#64748B]'}`}>{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};
