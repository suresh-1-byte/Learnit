import React from 'react';
import { BookOpen, Video, FileCheck, Play, Zap } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface QuickActionsProps {
  onContinueLearning: () => void;
  onJoinClass: () => void;
  onOpenAssignment: () => void;
  onWatchVideo: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onContinueLearning,
  onJoinClass,
  onOpenAssignment,
  onWatchVideo
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-2xl border p-5 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#14141C] border-[#1A1A1A]' : 'bg-white border-gray-200'
    }`}>
    <div className="flex items-center gap-2 mb-4">
      <Zap className="w-4 h-4 text-[#F59E0B]" />
      <h2 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <button onClick={onContinueLearning} className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
        theme === 'dark' 
          ? 'bg-[#171720] hover:bg-[#1B1B26] border-[#222] text-white' 
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
      }`}>
        <BookOpen className="w-5 h-5 text-[#6366F1]" />
        <span>Continue Learning</span>
      </button>
      <button onClick={onJoinClass} className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
        theme === 'dark' 
          ? 'bg-[#171720] hover:bg-[#1B1B26] border-[#222] text-white' 
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
      }`}>
        <Video className="w-5 h-5 text-[#10B981]" />
        <span>Join Today's Class</span>
      </button>
      <button onClick={onOpenAssignment} className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
        theme === 'dark' 
          ? 'bg-[#171720] hover:bg-[#1B1B26] border-[#222] text-white' 
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
      }`}>
        <FileCheck className="w-5 h-5 text-[#F59E0B]" />
        <span>Open Assignment</span>
      </button>
      <button onClick={onWatchVideo} className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition-colors ${
        theme === 'dark' 
          ? 'bg-[#171720] hover:bg-[#1B1B26] border-[#222] text-white' 
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
      }`}>
        <Play className="w-5 h-5 text-[#EC4899]" />
        <span>Watch Last Video</span>
      </button>
    </div>
  </div>
  );
};
