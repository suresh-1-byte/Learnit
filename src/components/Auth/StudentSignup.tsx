import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  X,
  AlertCircle,
  Loader2,
  Phone,
  Building,
  Hash,
  Mail
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface StudentSignupProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: (role: UserRole) => void;
  onSwitchToLogin: () => void;
}

export const StudentSignup: React.FC<StudentSignupProps> = ({
  isOpen,
  onClose,
  onSignupSuccess,
  onSwitchToLogin
}) => {
  const { signup } = useAuth();
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    rollNumber: '',
    collegeName: '',
    departmentName: '',
    batchName: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(''); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (!formData.rollNumber.trim()) {
      setError('Please enter your roll number');
      return false;
    }
    
    if (!formData.collegeName.trim()) {
      setError('Please enter your college name');
      return false;
    }
    
    if (!formData.departmentName.trim()) {
      setError('Please enter your department');
      return false;
    }
    
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const profileData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: 'student' as const,
        phone: formData.phone.trim() || undefined,
        rollNumber: formData.rollNumber.trim(),
        collegeName: formData.collegeName.trim(),
        departmentName: formData.departmentName.trim(),
        batchName: formData.batchName.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await signup(formData.email.trim().toLowerCase(), formData.password, profileData);
      
      setSuccess(true);
      
      // Wait 2 seconds then redirect
      setTimeout(() => {
        onSignupSuccess('student');
        onClose();
      }, 2000);
      
    } catch (err: any) {
      setLoading(false);
      
      // Handle Firebase auth errors
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use a stronger password.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-[#0A0A0A] rounded-2xl max-w-md w-full shadow-2xl border border-[#1A1A1A] p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
          <p className="text-[#888] text-sm mb-4">
            Your student account has been created successfully.
          </p>
          <div className="flex items-center justify-center gap-2 text-[#666]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-[#0A0A0A] rounded-2xl max-w-2xl w-full shadow-2xl border border-[#1A1A1A] relative my-8">
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#111] hover:bg-[#222] text-[#888] hover:text-white transition-colors border border-[#222]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#1E1B4B] via-[#111838] to-[#0B0F28] p-8 text-center">
          <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center text-white shadow-xl mx-auto mb-3 overflow-hidden">
            <img src={`/logo.png?v=${Date.now()}`} alt="LearnIT Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">Student Registration</h1>
          <p className="text-xs text-[#AAA] mt-2">Create your student account</p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#888] font-bold block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={loading}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#888] font-bold block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      disabled={loading}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Account Credentials</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#888] font-bold block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#888] font-bold block">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      disabled={loading}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-12 py-2.5 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#888] font-bold block">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      disabled={loading}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-12 py-2.5 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Academic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#888] font-bold block">
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="rollNumber"
                      required
                      disabled={loading}
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g., 2026CS001"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#888] font-bold block">
                    Batch/Year
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="batchName"
                      disabled={loading}
                      value={formData.batchName}
                      onChange={handleChange}
                      placeholder="e.g., 2026-A"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#888] font-bold block">
                  College Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="collegeName"
                    required
                    disabled={loading}
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="Enter your college name"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#888] font-bold block">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="departmentName"
                    required
                    disabled={loading}
                    value={formData.departmentName}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science and Engineering"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] focus:border-[#A855F7] rounded-xl text-sm text-white outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#A855F7] to-[#6366F1] hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Student Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#1A1A1A] text-center">
            <p className="text-xs text-[#666]">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                disabled={loading}
                className="text-[#A855F7] hover:text-purple-400 font-semibold disabled:opacity-50"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
