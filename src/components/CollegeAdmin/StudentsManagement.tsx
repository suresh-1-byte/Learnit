import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useStudents } from '../../hooks/useStudents';
import { useClasses } from '../../hooks/useClasses';
import { Student } from '../../services/firebase/students.service';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { StudentTable } from './StudentTable';
import { StudentFormModal } from './StudentFormModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { BulkUploadModal } from './BulkUploadModal';
import { AssignToClassModal } from './AssignToClassModal';
import { UserPlus, Upload, Users } from 'lucide-react';

export const StudentsManagement: React.FC = () => {
  const { theme } = useTheme();
  const {
    students,
    loading,
    addStudent,
    updateStudent,
    removeStudent,
    bulkCreateStudents
  } = useStudents();
  const { classes } = useClasses();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Selection state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Handlers
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addStudent(studentData);
    alert('Student added successfully!');
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleEditStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingStudent) return;
    await updateStudent(editingStudent.id, studentData);
    alert('Student updated successfully!');
    setEditingStudent(null);
  };

  const handleDeleteClick = (student: Student) => {
    setDeletingStudent(student);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;

    // Remove student from all classes
    for (const classId of deletingStudent.classIds) {
      const classRef = doc(db, 'classes', classId);
      const classDoc = classes.find(c => c.id === classId);
      if (classDoc) {
        const updatedStudentIds = classDoc.studentIds?.filter(id => id !== deletingStudent.id) || [];
        await updateDoc(classRef, { studentIds: updatedStudentIds });
      }
    }

    // Delete student
    await removeStudent(deletingStudent.id);
    alert('Student deleted successfully!');
    setDeletingStudent(null);
    setShowDeleteDialog(false);
  };

  const handleBulkUpload = async (students: Array<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const results = await bulkCreateStudents(students);
    return results;
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedStudentIds(students.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleAssignToClass = async (studentIds: string[], classId: string) => {
    // Update each student's classIds
    for (const studentId of studentIds) {
      const student = students.find(s => s.id === studentId);
      if (student && !student.classIds.includes(classId)) {
        await updateStudent(studentId, {
          classIds: [...student.classIds, classId]
        });
      }
    }

    // Update class studentIds
    const classRef = doc(db, 'classes', classId);
    const classDoc = classes.find(c => c.id === classId);
    if (classDoc) {
      const existingStudentIds = classDoc.studentIds || [];
      const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id));
      await updateDoc(classRef, {
        studentIds: [...existingStudentIds, ...newStudentIds]
      });
    }

    alert(`${studentIds.length} students assigned to class successfully!`);
    setSelectedStudentIds([]);
  };

  const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 border shadow-lg ${
        theme === 'dark'
          ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]'
          : 'bg-white border-[rgba(0,0,0,0.06)]'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#6366F1]/10">
                <Users className="w-6 h-6 text-[#6366F1]" />
              </div>
              <h1 className={`text-2xl font-black ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Students Management
              </h1>
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>
              Add, edit, and manage student enrollments
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedStudentIds.length > 0 && (
              <button
                onClick={() => setShowAssignModal(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-sm ${
                  theme === 'dark'
                    ? 'bg-[#A855F7] hover:bg-purple-500 text-white'
                    : 'bg-[#A855F7] hover:bg-purple-500 text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                Assign {selectedStudentIds.length} to Class
              </button>
            )}

            <button
              onClick={() => setShowUploadModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#111] hover:bg-[#181818] text-white border-[rgba(255,255,255,0.08)]'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-[rgba(0,0,0,0.06)]'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className={`p-3 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#6366F1]/5 border-[#6366F1]/20'
              : 'bg-[#6366F1]/5 border-[#6366F1]/20'
          }`}>
            <p className="text-xs font-semibold text-[#6366F1]">Total Students</p>
            <p className="text-2xl font-black text-[#6366F1] mt-1">{students.length}</p>
          </div>

          <div className={`p-3 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#10B981]/5 border-[#10B981]/20'
              : 'bg-[#10B981]/5 border-[#10B981]/20'
          }`}>
            <p className="text-xs font-semibold text-[#10B981]">Selected</p>
            <p className="text-2xl font-black text-[#10B981] mt-1">{selectedStudentIds.length}</p>
          </div>

          <div className={`p-3 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#F59E0B]/5 border-[#F59E0B]/20'
              : 'bg-[#F59E0B]/5 border-[#F59E0B]/20'
          }`}>
            <p className="text-xs font-semibold text-[#F59E0B]">Departments</p>
            <p className="text-2xl font-black text-[#F59E0B] mt-1">
              {new Set(students.map(s => s.departmentName)).size}
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#A855F7]/5 border-[#A855F7]/20'
              : 'bg-[#A855F7]/5 border-[#A855F7]/20'
          }`}>
            <p className="text-xs font-semibold text-[#A855F7]">Batches</p>
            <p className="text-2xl font-black text-[#A855F7] mt-1">
              {new Set(students.map(s => s.batchName)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <StudentTable
        students={students}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        selectedStudents={selectedStudentIds}
        onSelectStudent={handleSelectStudent}
        onSelectAll={handleSelectAll}
      />

      {/* Modals */}
      <StudentFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddStudent}
        title="Add New Student"
      />

      <StudentFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingStudent(null);
        }}
        onSave={handleEditStudent}
        editStudent={editingStudent}
        title="Edit Student"
      />

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        student={deletingStudent}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setDeletingStudent(null);
        }}
      />

      <BulkUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleBulkUpload}
      />

      <AssignToClassModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        selectedStudents={selectedStudents}
        onAssign={handleAssignToClass}
      />
    </div>
  );
};
