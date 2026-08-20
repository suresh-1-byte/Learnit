import React, { useState } from 'react';
import { Building2, Lock, Mail, Eye, EyeOff, ArrowRight, X } from 'lucide-react';

interface CollegeAdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const CollegeAdminLogin: React.FC<CollegeAdminLoginProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0A0A0A] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#1A1A1A] relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#111] hover:bg-[#222] text-[#888] hover:text-white transition-colors border border-[#222]"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="p-8 sm:p-10 space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-white shadow-xl overflow-hidden">
              <img src={`/logo.png?v=${Date.now()}`} alt="LearnIT Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">College Administrator Login</h1>
          <p className="text-sm text-[#888] mt-1">Secure portal for college administrators</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#888] font-bold block">
              College Admin ID / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. admin@college.edu"
                className="w-full pl-10 pr-4 py-3 bg-[#111] border border-[#222] focus:border-[#3B82F6] rounded-xl text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#888] font-bold block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 bg-[#111] border border-[#222] focus:border-[#3B82F6] rounded-xl text-sm text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-xs text-[#3B82F6] hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};
