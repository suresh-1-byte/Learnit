import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface MentorLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
  onSwitchToSignup?: () => void;
}

export const MentorLogin: React.FC<MentorLoginProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToSignup
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { profile } = await login(email, password);
      
      // Verify the user is a mentor
      if (profile.role !== 'mentor') {
        setError('Access denied. This portal is for mentors only.');
        setLoading(false);
        return;
      }

      // Success - redirect to mentor dashboard
      onLoginSuccess('mentor');
      onClose();
    } catch (err: any) {
      setLoading(false);
      
      // Handle Firebase auth errors
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0A0A0A] rounded-2xl max-w-md w-full shadow-2xl border border-[#1A1A1A] relative overflow-hidden">
      {/* Close Modal Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#111] hover:bg-[#222] text-[#888] hover:text-white transition-colors border border-[#222]"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E1B4B] via-[#111838] to-[#0B0F28] p-8 sm:p-10 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none bg-white flex items-center justify-center text-white shadow-xl mx-auto mb-3 sm:mb-4 overflow-hidden">
          <img src="/logo.png" alt="LearnIT Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Mentor Portal</h1>
        <p className="text-[10px] sm:text-xs text-[#AAA] mt-1 sm:mt-2">Faculty Access • Teaching & Assessment</p>
      </div>

      {/* Form */}
      <div className="p-8 sm:p-10 space-y-4 sm:space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#888] font-bold block">
              Mentor Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#888] font-bold block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#A855F7] to-[#6366F1] hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Access Mentor Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-3 sm:pt-4 border-t border-[#1A1A1A] text-center">
          {onSwitchToSignup && (
            <p className="text-xs text-[#666] mb-3">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                disabled={loading}
                className="text-[#6366F1] hover:text-indigo-400 font-semibold disabled:opacity-50"
              >
                Sign up here
              </button>
            </p>
          )}
          <p className="text-[10px] sm:text-[11px] text-[#666]">
            Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};
