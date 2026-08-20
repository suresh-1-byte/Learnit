import React from 'react';
import {
  Plus,
  X,
  Download,
  Trash2,
  Calendar,
  Award,
  FileText,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AssignmentsManagerProps {
  // Assignment creation modal
  showCreateAssignmentModal: boolean;
  setShowCreateAssignmentModal: (show: boolean) => void;
  handleCreateAssignment: (e: React.FormEvent) => void;
  
  // Form state
  selectedClassForAssignment: string;
  setSelectedClassForAssignment: (value: string) => void;
  newAssignmentTitle: string;
  setNewAssignmentTitle: (value: string) => void;
  newAssignmentDescription: string;
  setNewAssignmentDescription: (value: string) => void;
  newAssignmentInstructions: string;
  setNewAssignmentInstructions: (value: string) => void;
  newAssignmentDeadline: string;
  setNewAssignmentDeadline: (value: string) => void;
  newAssignmentMaxMarks: number;
  setNewAssignmentMaxMarks: (value: number) => void;
  newAssignmentFile: File | undefined;
  setNewAssignmentFile: (file: File | undefined) => void;
  
  // Classes data
  classes: any[];
  
  // Assignments data
  assignments: any[];
  assignmentsLoading: boolean;
  
  // Submissions modal
  showSubmissionsModal: boolean;
  setShowSubmissionsModal: (show: boolean) => void;
  selectedAssignmentForSubmissions: any;
  setSelectedAssignmentForSubmissions: (assignment: any) => void;
  submissions: any[];
  fetchSubmissions: (assignmentId: string) => Promise<void>;
  
  // Grading modal
  showGradingModal: boolean;
  setShowGradingModal: (show: boolean) => void;
  selectedSubmission: any;
  setSelectedSubmission: (submission: any) => void;
  gradeScore: number;
  setGradeScore: (score: number) => void;
  gradeFeedback: string;
  setGradeFeedback: (feedback: string) => void;
  handleGradeSubmission: (e: React.FormEvent) => void;
  
  // Actions
  removeAssignment: (id: string) => Promise<void>;
}

export const AssignmentsManager: React.FC<AssignmentsManagerProps> = ({
  showCreateAssignmentModal,
  setShowCreateAssignmentModal,
  handleCreateAssignment,
  selectedClassForAssignment,
  setSelectedClassForAssignment,
  newAssignmentTitle,
  setNewAssignmentTitle,
  newAssignmentDescription,
  setNewAssignmentDescription,
  newAssignmentInstructions,
  setNewAssignmentInstructions,
  newAssignmentDeadline,
  setNewAssignmentDeadline,
  newAssignmentMaxMarks,
  setNewAssignmentMaxMarks,
  newAssignmentFile,
  setNewAssignmentFile,
  classes,
  assignments,
  assignmentsLoading,
  showSubmissionsModal,
  setShowSubmissionsModal,
  selectedAssignmentForSubmissions,
  setSelectedAssignmentForSubmissions,
  submissions,
  fetchSubmissions,
  showGradingModal,
  setShowGradingModal,
  selectedSubmission,
  setSelectedSubmission,
  gradeScore,
  setGradeScore,
  gradeFeedback,
  setGradeFeedback,
  handleGradeSubmission,
  removeAssignment
}) => {
  const { theme } = useTheme();

  return (
    <>
      {/* Assignments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Your Assignments
          </h3>
          <button
            onClick={() => setShowCreateAssignmentModal(true)}
            className="px-4 py-2 bg-[#6366F1] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#5558E3] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </button>
        </div>

        {assignmentsLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#6366F1]" />
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading assignments...
            </p>
          </div>
        ) : assignments.length === 0 ? (
          <div className={`text-center py-12 border-2 border-dashed rounded-2xl ${
            theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
          }`}>
            <FileText className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No assignments yet
            </p>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Create your first assignment to get started
            </p>
            <button
              onClick={() => setShowCreateAssignmentModal(true)}
              className="mt-4 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-sm hover:bg-[#5558E3] transition-colors"
            >
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {assignments.map(assignment => (
              <div
                key={assignment.id}
                className={`p-5 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-[#0A0A0A] border-[#1A1A1A]'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className={`font-bold text-base mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {assignment.title}
                    </h4>
                    {assignment.description && (
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {assignment.description}
                      </p>
                    )}
                    <div className={`flex flex-wrap gap-3 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {assignment.maxMarks} marks
                      </span>
                      {assignment.attachmentUrl && (
                        <a
                          href={assignment.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#6366F1] hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Attachment
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await fetchSubmissions(assignment.id);
                        setShowSubmissionsModal(true);
                        setSelectedAssignmentForSubmissions(assignment);
                      }}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      View Submissions
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this assignment? This action cannot be undone.')) {
                          await removeAssignment(assignment.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className="font-bold text-lg">Create New Assignment</h3>
              <button 
                onClick={() => setShowCreateAssignmentModal(false)} 
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClassForAssignment}
                  onChange={(e) => setSelectedClassForAssignment(e.target.value)}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Choose a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.title} - {cls.batchName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignment Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Assignment Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  required
                  placeholder="e.g., React Component Assignment"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={newAssignmentDescription}
                  onChange={(e) => setNewAssignmentDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief description of the assignment"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Instructions
                </label>
                <textarea
                  value={newAssignmentInstructions}
                  onChange={(e) => setNewAssignmentInstructions(e.target.value)}
                  rows={4}
                  placeholder="Detailed instructions for students"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newAssignmentDeadline}
                  onChange={(e) => setNewAssignmentDeadline(e.target.value)}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Max Marks */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Maximum Marks
                </label>
                <input
                  type="number"
                  value={newAssignmentMaxMarks}
                  onChange={(e) => setNewAssignmentMaxMarks(Number(e.target.value))}
                  min="1"
                  max="1000"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Attachment (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setNewAssignmentFile(e.target.files?.[0])}
                  accept=".pdf,.doc,.docx,.zip"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Supported: PDF, Word, ZIP (Max 10MB)
                </p>
              </div>

              {/* Buttons */}
              <div className={`flex gap-3 pt-4 border-t ${theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateAssignmentModal(false);
                    setSelectedClassForAssignment('');
                    setNewAssignmentTitle('');
                    setNewAssignmentDescription('');
                    setNewAssignmentInstructions('');
                    setNewAssignmentDeadline('2026-08-15');
                    setNewAssignmentMaxMarks(100);
                    setNewAssignmentFile(undefined);
                  }}
                  className={`flex-1 px-4 py-2 rounded-xl font-semibold ${
                    theme === 'dark'
                      ? 'bg-[#1A1A1A] hover:bg-[#222] text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignmentsLoading}
                  className="flex-1 px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {assignmentsLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Assignment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Submissions Modal */}
      {showSubmissionsModal && selectedAssignmentForSubmissions && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-4xl w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div>
                <h3 className="font-bold text-lg">Submissions</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {selectedAssignmentForSubmissions.title}
                </p>
              </div>
              <button 
                onClick={() => setShowSubmissionsModal(false)} 
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map(submission => (
                    <div
                      key={submission.id}
                      className={`p-4 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-[#0D0D0D] border-[#222]'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {submission.studentName}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Submitted: {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              submission.status === 'Graded'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : submission.status === 'Late'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {submission.status}
                            </span>
                            {submission.status === 'Graded' && (
                              <span className="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                {submission.marksObtained}/{selectedAssignmentForSubmissions.maxMarks}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                              theme === 'dark'
                                ? 'bg-[#1A1A1A] hover:bg-[#222] text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                            }`}
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                          {submission.status !== 'Graded' && (
                            <button
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setGradeScore(selectedAssignmentForSubmissions.maxMarks);
                                setGradeFeedback('');
                                setShowGradingModal(true);
                              }}
                              className="px-3 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg text-xs font-semibold"
                            >
                              Grade
                            </button>
                          )}
                        </div>
                      </div>
                      {submission.feedback && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-yellow-900/20 border border-yellow-900/30'
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                          <p className={`text-xs font-semibold ${
                            theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'
                          }`}>
                            Feedback:
                          </p>
                          <p className={`text-sm mt-1 ${
                            theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
                          }`}>
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className="font-bold text-lg">Grade Submission</h3>
              <button 
                onClick={() => setShowGradingModal(false)} 
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><span className="font-semibold">Student:</span> {selectedSubmission.studentName}</p>
              <p><span className="font-semibold">Submitted:</span> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
              <a
                href={selectedSubmission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6366F1] hover:underline flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Download Submission
              </a>
            </div>

            <form onSubmit={handleGradeSubmission} className={`space-y-4 pt-4 border-t ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              {/* Marks Input */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Marks Obtained <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  min="0"
                  max={selectedAssignmentForSubmissions?.maxMarks || 100}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Maximum: {selectedAssignmentForSubmissions?.maxMarks || 100} marks
                </p>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Feedback
                </label>
                <textarea
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  rows={4}
                  placeholder="Provide feedback to the student..."
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGradingModal(false)}
                  className={`flex-1 px-4 py-2 rounded-xl font-semibold ${
                    theme === 'dark'
                      ? 'bg-[#1A1A1A] hover:bg-[#222] text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
