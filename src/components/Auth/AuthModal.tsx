import React, { useState } from 'react';
import { GraduationCap, BookOpen, User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { MentorLogin } from './MentorLogin';
import { StudentLogin } from './StudentLogin';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
}

type AuthView = 'role_selection' | 'mentor_login' | 'student_login';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const { theme } = useTheme();
  const [authView, setAuthView] = useState<AuthView>('role_selection');

  if (!isOpen) return null;

  const handleRoleSelect = (role: 'student' | 'mentor') => {
    if (role === 'mentor') {
      setAuthView('mentor_login');
    } else {
      setAuthView('student_login');
    }
  };

  const handleBackToRoles = () => {
    setAuthView('role_selection');
  };

  // If showing mentor or student login, render those components
  if (authView === 'mentor_login') {
    return (
      <MentorLogin
        isOpen={true}
        onClose={() => {
          setAuthView('role_selection');
          onClose();
        }}
        onLoginSuccess={onLoginSuccess}
      />
    );
  }

  if (authView === 'student_login') {
    return (
      <StudentLogin
        isOpen={true}
        onClose={() => {
          setAuthView('role_selection');
          onClose();
        }}
        onLoginSuccess={onLoginSuccess}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border relative ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-colors border ${
            theme === 'dark' 
              ? 'bg-[#111] hover:bg-[#222] text-[#888] hover:text-white border-[#222]' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 border-gray-300'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Role Selection View */}
        <div className="p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center text-white shadow-xl overflow-hidden">
                <img src="/logo.png" alt="LearnIT Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>LearnIT</h1>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Sign in to your account</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h2 className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Select your role</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleRoleSelect('student')}
                className={`p-4 rounded-xl text-left font-semibold transition-all border flex items-center gap-3 ${
                  theme === 'dark' 
                    ? 'bg-[#111] text-[#888] border-[#222] hover:text-white hover:border-[#6366F1]' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:text-gray-900 hover:border-indigo-400'
                }`}
              >
                <div className="w-12 h-12 rounded-none bg-[#6366F1]/10 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-[#6366F1]" />
                </div>
                <div>
                  <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Student</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-[#666]' : 'text-gray-500'}`}>Access courses & resources</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect('mentor')}
                className={`p-4 rounded-xl text-left font-semibold transition-all border flex items-center gap-3 ${
                  theme === 'dark' 
                    ? 'bg-[#111] text-[#888] border-[#222] hover:text-white hover:border-[#6366F1]' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:text-gray-900 hover:border-indigo-400'
                }`}
              >
                <div className="w-12 h-12 rounded-none bg-[#A855F7]/10 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-[#A855F7]" />
                </div>
                <div>
                  <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Mentor</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-[#666]' : 'text-gray-500'}`}>Guide students</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
