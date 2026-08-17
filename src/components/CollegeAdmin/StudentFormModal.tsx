import React, { useState, useEffect } from 'react';
import { Student } from '../../services/firebase/students.service';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Loader2, User } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editStudent?: Student | null;
  title: string;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editStudent,
  title
}) => {
  const { theme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    phone: '',
    departmentName: '',
    batchName: '',
    programTitle: '',
    avatar: '',
    classIds: [] as string[]
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (editStudent) {
      setFormData({
        name: editStudent.name,
        email: editStudent.email,
        rollNumber: editStudent.rollNumber,
        phone: editStudent.phone || '',
        departmentName: editStudent.departmentName,
        batchName: editStudent.batchName,
        programTitle: editStudent.programTitle,
        avatar: editStudent.avatar || '',
        classIds: editStudent.classIds || []
      });
    } else {
      setFormData({
        name: '',
        email: '',
        rollNumber: '',
        phone: '',
        departmentName: 'Computer Science',
        batchName: 'BATCH-2026-ALPHA',
        programTitle: 'Full-Stack Software Engineering',
        avatar: '',
        classIds: []
      });
    }
    setErrors({});
  }, [editStudent, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.departmentName) newErrors.departmentName = 'Department is required';
    if (!formData.batchName) newErrors.batchName = 'Batch is required';
    if (!formData.programTitle) newErrors.programTitle = 'Program is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
      setErrors({ submit: 'Failed to save student. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${
          theme === 'dark'
            ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]'
            : 'bg-white border-[rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          theme === 'dark'
            ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]'
            : 'bg-white border-[rgba(0,0,0,0.06)]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#6366F1]/10">
              <User className="w-5 h-5 text-[#6366F1]" />
            </div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'hover:bg-[#111] text-[#888] hover:text-white'
                : 'hover:bg-gray-100 text-[#64748B] hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {errors.submit && (
            <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20">
              <p className="text-sm text-[#EF4444]">{errors.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Full Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all border ${
                  errors.name
                    ? 'border-[#EF4444] focus:border-[#EF4444]'
                    : theme === 'dark'
                    ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white focus:border-[#6366F1]'
                    : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 focus:border-[#6366F1]'
                }`}
                placeholder="Enter student name"
              />
              {errors.name && <p className="mt-1 text-xs text-[#EF4444]">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Email <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all border ${
                  errors.email
                    ? 'border-[#EF4444] focus:border-[#EF4444]'
                    : theme === 'dark'
                    ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white focus:border-[#6366F1]'
                    : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 focus:border-[#6366F1]'
                }`}
                placeholder="student@college.edu"
              />
              {errors.email && <p className="mt-1 text-xs text-[#EF4444]">{errors.email}</p>}
            </div>

            {/* Roll Number */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Roll Number <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => handleChange('rollNumber', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all border ${
                  errors.rollNumber
                    ? 'border-[#EF4444] focus:border-[#EF4444]'
                    : theme === 'dark'
                    ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white focus:border-[#6366F1]'
                    : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 focus:border-[#6366F1]'
                }`}
                placeholder="CS001"
              />
              {errors.rollNumber && <p className="mt-1 text-xs text-[#EF4444]">{errors.rollNumber}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all border ${
                  theme === 'dark'
                    ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white focus:border-[#6366F1]'
                    : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 focus:border-[#6366F1]'
                }`}
                placeholder="+91 9876543210"
              />
            </div>

            {/* Department */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Department <span className="text-[#EF4444]">*</span>
              </label>
              <select
                value={formData.departmentName}
                onChange={(e) => handleChange('departmentName', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all border ${
                  errors.departmentName
                    ? 'border-[#EF4444] focus:border-[#EF4444]'
                    : theme === 'dark'
                    ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white focus:border-[#6366F1]'
                    : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 focus:border-[#6366F1]'
                }`}
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
              {errors.departmentName && <p className="mt-1 text-xs text-[#EF4444]">{errors.departmentName}</p>}
            </div>

            {/* Batch */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Batch <span className="text-[#EF4444]">*</span>
              </label>
              <select
                value={formData.batchName}
                onChange={(e) => handleChange('batchName', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all border ${
                  errors.batchName
                    ? 'border-[#EF4444] focus:border-[#EF4444]'
                    : theme === 'dark'
                    ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white focus:border-[#6366F1]'
                    : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 focus:border-[#6366F1]'
                }`}
              >
                <option value="">Select Batch</option>
                <option value="BATCH-2026-ALPHA">BATCH-2026-ALPHA</option>
                <option value="BATCH-2026-BETA">BATCH-2026-BETA</option>
                <option value="BATCH-2026-GAMMA">BATCH-2026-GAMMA</option>
                <option value="BATCH-2025-ALPHA">BATCH-2025-ALPHA</option>
              </select>
              {errors.batchName && <p className="mt-1 text-xs text-[#EF4444]">{errors.batchName}</p>}
            </div>
          </div>

          {/* Program Title */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Program <span className="text-[#EF4444]">*</span>
            </label>
            <select
              value={formData.programTitle}
              onChange={(e) => handleChange('programTitle', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all border ${
                errors.programTitle
                  ? 'border-[#EF4444] focus:border-[#EF4444]'
                  : theme === 'dark'
                  ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white focus:border-[#6366F1]'
                  : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 focus:border-[#6366F1]'
              }`}
            >
              <option value="">Select Program</option>
              <option value="Full-Stack Software Engineering">Full-Stack Software Engineering</option>
              <option value="Applied AI & LLM Systems">Applied AI & LLM Systems</option>
              <option value="Cloud DevOps & Infrastructure">Cloud DevOps & Infrastructure</option>
              <option value="Tech Product Management">Tech Product Management</option>
              <option value="Data Science & Analytics">Data Science & Analytics</option>
            </select>
            {errors.programTitle && <p className="mt-1 text-xs text-[#EF4444]">{errors.programTitle}</p>}
          </div>

          {/* Avatar URL */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Avatar URL <span className={`text-xs font-normal ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>(optional)</span>
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => handleChange('avatar', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all border ${
                theme === 'dark'
                  ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white focus:border-[#6366F1]'
                  : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 focus:border-[#6366F1]'
              }`}
              placeholder="https://example.com/avatar.jpg"
            />
            <p className={`mt-1 text-xs ${
              theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
            }`}>
              Leave empty to use auto-generated avatar
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t ${
            theme === 'dark'
              ? 'border-[rgba(255,255,255,0.08)]'
              : 'border-[rgba(0,0,0,0.06)]'
          }">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                theme === 'dark'
                  ? 'bg-[#111] text-white hover:bg-[#181818]'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save Student</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
