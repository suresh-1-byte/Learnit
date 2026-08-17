import React, { useState, useEffect } from 'react';
import { Student } from '../../services/firebase/students.service';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Loader2, Users, BookOpen } from 'lucide-react';
import { useClasses } from '../../hooks/useClasses';

interface AssignToClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents: Student[];
  onAssign: (studentIds: string[], classId: string) => Promise<void>;
}

export const AssignToClassModal: React.FC<AssignToClassModalProps> = ({
  isOpen,
  onClose,
  selectedStudents,
  onAssign
}) => {
  const { theme } = useTheme();
  const { classes, loading: loadingClasses } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [isOpen, classes]);

  const handleAssign = async () => {
    if (!selectedClassId) return;

    try {
      setAssigning(true);
      const studentIds = selectedStudents.map(s => s.id);
      await onAssign(studentIds, selectedClassId);
      onClose();
    } catch (error) {
      console.error('Error assigning students:', error);
      alert('Failed to assign students. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  const selectedClass = classes.find(c => c.id === selectedClassId);

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
              <Users className="w-5 h-5 text-[#6366F1]" />
            </div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Assign Students to Class
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={assigning}
            className={`p-2 rounded-xl transition-all hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'hover:bg-[#111] text-[#888] hover:text-white'
                : 'hover:bg-gray-100 text-[#64748B] hover:text-gray-900'
            } ${assigning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selected Students */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Selected Students ({selectedStudents.length})
            </label>
            <div className={`max-h-64 overflow-y-auto rounded-xl border ${
              theme === 'dark'
                ? 'bg-[#111] border-[rgba(255,255,255,0.08)]'
                : 'bg-gray-50 border-[rgba(0,0,0,0.06)]'
            }`}>
              <div className="p-3 space-y-2">
                {selectedStudents.map(student => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0A0A0A] hover:bg-[#141414]'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=6366F1&color=fff`}
                      alt={student.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {student.name}
                      </p>
                      <p className={`text-xs font-mono ${
                        theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                      }`}>
                        {student.rollNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-[#6366F1]/10 text-[#6366F1]'
                          : 'bg-[#6366F1]/10 text-[#6366F1]'
                      }`}>
                        {student.departmentName}
                      </span>
                      {student.classIds.length > 0 && (
                        <span className={`text-xs font-mono font-semibold ${
                          theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                        }`}>
                          {student.classIds.length} classes
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Class Selection */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Select Class <span className="text-[#EF4444]">*</span>
            </label>

            {loadingClasses ? (
              <div className={`p-4 rounded-xl border text-center ${
                theme === 'dark'
                  ? 'bg-[#111] border-[rgba(255,255,255,0.08)]'
                  : 'bg-gray-50 border-[rgba(0,0,0,0.06)]'
              }`}>
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#6366F1]" />
                <p className={`text-sm mt-2 ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Loading classes...
                </p>
              </div>
            ) : classes.length === 0 ? (
              <div className={`p-8 rounded-xl border text-center ${
                theme === 'dark'
                  ? 'bg-[#111] border-[rgba(255,255,255,0.08)]'
                  : 'bg-gray-50 border-[rgba(0,0,0,0.06)]'
              }`}>
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-[#6366F1]" />
                <p className={`text-sm font-semibold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  No Classes Found
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Create a class first before assigning students
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    theme === 'dark'
                      ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white focus:border-[#6366F1]'
                      : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 focus:border-[#6366F1]'
                  }`}
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.title} - {cls.batchName}
                    </option>
                  ))}
                </select>

                {/* Selected Class Preview */}
                {selectedClass && (
                  <div className={`p-4 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-[#6366F1]/5 border-[#6366F1]/20'
                      : 'bg-[#6366F1]/5 border-[#6366F1]/20'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#6366F1]/10">
                        <BookOpen className="w-4 h-4 text-[#6366F1]" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {selectedClass.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={`${
                            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                          }`}>
                            {selectedClass.batchName}
                          </span>
                          <span className={`${
                            theme === 'dark' ? 'text-[#666]' : 'text-[#94A3B8]'
                          }`}>•</span>
                          <span className={`${
                            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                          }`}>
                            {selectedClass.programTitle}
                          </span>
                          <span className={`${
                            theme === 'dark' ? 'text-[#666]' : 'text-[#94A3B8]'
                          }`}>•</span>
                          <span className="font-mono font-semibold text-[#6366F1]">
                            {selectedClass.studentIds?.length || 0} students enrolled
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info Message */}
          <div className={`p-4 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#F59E0B]/5 border-[#F59E0B]/20'
              : 'bg-[#F59E0B]/5 border-[#F59E0B]/20'
          }`}>
            <p className="text-xs text-[#F59E0B]">
              <span className="font-semibold">Note:</span> Students can be assigned to multiple classes. This will add them to the selected class without removing them from existing classes.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          theme === 'dark'
            ? 'border-[rgba(255,255,255,0.08)]'
            : 'border-[rgba(0,0,0,0.06)]'
        }`}>
          <button
            onClick={onClose}
            disabled={assigning}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-[#111] text-white hover:bg-[#181818]'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            } ${assigning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={assigning || !selectedClassId || classes.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                Assign {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
