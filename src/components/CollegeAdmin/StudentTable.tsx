import React, { useState, useMemo } from 'react';
import { Student } from '../../services/firebase/students.service';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Filter, ChevronLeft, ChevronRight, Edit, Trash2, Users } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  selectedStudents: string[];
  onSelectStudent: (studentId: string) => void;
  onSelectAll: (selected: boolean) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  loading,
  onEdit,
  onDelete,
  selectedStudents,
  onSelectStudent,
  onSelectAll
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 50;

  // Get unique departments and batches for filters
  const departments = useMemo(() => {
    const depts = new Set(students.map(s => s.departmentName));
    return ['All', ...Array.from(depts)];
  }, [students]);

  const batches = useMemo(() => {
    const batchSet = new Set(students.map(s => s.batchName));
    return ['All', ...Array.from(batchSet)];
  }, [students]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = deptFilter === 'All' || student.departmentName === deptFilter;
      const matchesBatch = batchFilter === 'All' || student.batchName === batchFilter;

      return matchesSearch && matchesDept && matchesBatch;
    });
  }, [students, searchTerm, deptFilter, batchFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const allSelected = currentStudents.length > 0 && currentStudents.every(s => selectedStudents.includes(s.id));

  const handleSelectAll = () => {
    onSelectAll(!allSelected);
  };

  // Empty state
  if (!loading && students.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border ${
        theme === 'dark'
          ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)]'
          : 'bg-white border-[rgba(0,0,0,0.06)]'
      }`}>
        <Users className="w-16 h-16 text-[#6366F1] mb-4" />
        <h3 className={`text-xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          No Students Yet
        </h3>
        <p className={`text-sm mb-6 ${
          theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
        }`}>
          Add your first student to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
          }`} />
          <input
            type="text"
            placeholder="Search by name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all border ${
              theme === 'dark'
                ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#666] focus:border-[#6366F1]'
                : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 placeholder:text-[#64748B] focus:border-[#6366F1]'
            }`}
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => {
            setDeptFilter(e.target.value);
            setCurrentPage(1);
          }}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
            theme === 'dark'
              ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white'
              : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900'
          }`}
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
          ))}
        </select>

        <select
          value={batchFilter}
          onChange={(e) => {
            setBatchFilter(e.target.value);
            setCurrentPage(1);
          }}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
            theme === 'dark'
              ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white'
              : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900'
          }`}
        >
          {batches.map(batch => (
            <option key={batch} value={batch}>{batch === 'All' ? 'All Batches' : batch}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        theme === 'dark'
          ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)]'
          : 'bg-white border-[rgba(0,0,0,0.06)]'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${
              theme === 'dark'
                ? 'bg-[#111] border-[rgba(255,255,255,0.08)]'
                : 'bg-gray-50 border-[rgba(0,0,0,0.06)]'
            }`}>
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-[#333] bg-transparent checked:bg-[#6366F1]"
                  />
                </th>
                <th className={`p-3 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Student
                </th>
                <th className={`p-3 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Roll Number
                </th>
                <th className={`p-3 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Email
                </th>
                <th className={`p-3 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Department
                </th>
                <th className={`p-3 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Batch
                </th>
                <th className={`p-3 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Classes
                </th>
                <th className={`p-3 text-right text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className={`border-b ${
                    theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
                  }`}>
                    <td className="p-3" colSpan={8}>
                      <div className={`h-12 rounded-xl animate-pulse ${
                        theme === 'dark' ? 'bg-[#111]' : 'bg-gray-100'
                      }`} />
                    </td>
                  </tr>
                ))
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                    }`}>
                      No students found matching your filters
                    </p>
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr
                    key={student.id}
                    className={`border-b transition-colors ${
                      theme === 'dark'
                        ? 'border-[rgba(255,255,255,0.08)] hover:bg-[#111]'
                        : 'border-[rgba(0,0,0,0.06)] hover:bg-gray-50'
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => onSelectStudent(student.id)}
                        className="w-4 h-4 rounded border-[#333] bg-transparent checked:bg-[#6366F1]"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=6366F1&color=fff`}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <span className={`font-semibold text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-sm font-mono font-medium ${
                        theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                      }`}>
                        {student.rollNumber}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                      }`}>
                        {student.email}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-[#6366F1]/10 text-[#6366F1]'
                          : 'bg-[#6366F1]/10 text-[#6366F1]'
                      }`}>
                        {student.departmentName}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                      }`}>
                        {student.batchName}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs font-mono font-bold ${
                        theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
                      }`}>
                        {student.classIds.length}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(student)}
                          className={`p-2 rounded-lg transition-all hover:-translate-y-0.5 ${
                            theme === 'dark'
                              ? 'hover:bg-[#111] text-[#888] hover:text-[#6366F1]'
                              : 'hover:bg-gray-100 text-[#64748B] hover:text-[#6366F1]'
                          }`}
                          title="Edit student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(student)}
                          className={`p-2 rounded-lg transition-all hover:-translate-y-0.5 ${
                            theme === 'dark'
                              ? 'hover:bg-[#111] text-[#888] hover:text-[#EF4444]'
                              : 'hover:bg-gray-100 text-[#64748B] hover:text-[#EF4444]'
                          }`}
                          title="Delete student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredStudents.length > studentsPerPage && (
          <div className={`flex items-center justify-between p-4 border-t ${
            theme === 'dark'
              ? 'border-[rgba(255,255,255,0.08)] bg-[#111]'
              : 'border-[rgba(0,0,0,0.06)] bg-gray-50'
          }`}>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:-translate-y-0.5'
                } ${
                  theme === 'dark'
                    ? 'bg-[#0A0A0A] text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? 'bg-[#6366F1] text-white'
                          : theme === 'dark'
                          ? 'bg-[#0A0A0A] text-white hover:bg-[#111]'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:-translate-y-0.5'
                } ${
                  theme === 'dark'
                    ? 'bg-[#0A0A0A] text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
