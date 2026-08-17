import React, { useState } from 'react';
import { Student } from '../../services/firebase/students.service';
import { useTheme } from '../../contexts/ThemeContext';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  student: Student | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  student,
  onConfirm,
  onCancel
}) => {
  const { theme } = useTheme();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error('Error deleting student:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl ${
          theme === 'dark'
            ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]'
            : 'bg-white border-[rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark'
            ? 'border-[rgba(255,255,255,0.08)]'
            : 'border-[rgba(0,0,0,0.06)]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#EF4444]/10">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Delete Student
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={deleting}
            className={`p-2 rounded-xl transition-all hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'hover:bg-[#111] text-[#888] hover:text-white'
                : 'hover:bg-gray-100 text-[#64748B] hover:text-gray-900'
            } ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className={`p-4 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#EF4444]/5 border-[#EF4444]/20'
              : 'bg-[#EF4444]/5 border-[#EF4444]/20'
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Are you sure you want to delete this student?
            </p>
            <div className="flex items-center gap-3 mt-3">
              <img
                src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=6366F1&color=fff`}
                alt={student.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <p className={`font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {student.name}
                </p>
                <p className={`text-sm font-mono ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  {student.rollNumber}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#F59E0B]/5 border-[#F59E0B]/20'
              : 'bg-[#F59E0B]/5 border-[#F59E0B]/20'
          }`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
              <div className="text-xs text-[#F59E0B]">
                <p className="font-semibold mb-1">Warning: This action cannot be undone</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Student will be removed from all classes</li>
                  <li>All attendance records will remain (for audit)</li>
                  <li>This cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          theme === 'dark'
            ? 'border-[rgba(255,255,255,0.08)]'
            : 'border-[rgba(0,0,0,0.06)]'
        }`}>
          <button
            onClick={onCancel}
            disabled={deleting}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-[#111] text-white hover:bg-[#181818]'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            } ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#EF4444] hover:bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>Delete Student</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
