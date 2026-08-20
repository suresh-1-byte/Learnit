import React, { useState } from 'react';
import {
  Calendar,
  Award,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  RefreshCw,
  X
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAssignments } from '../../hooks/useAssignments';

export const StudentAssignments: React.FC = () => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  
  // Get student's class ID (you may need to adjust based on your user profile structure)
  const studentClassId = userProfile?.classIds?.[0] || userProfile?.classId || '';
  
  const {
    assignments,
    loading: assignmentsLoading,
    submitStudentAssignment,
    fetchStudentSubmission
  } = useAssignments(studentClassId);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionFile, setSubmissionFile] = useState<File | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatuses, setSubmissionStatuses] = useState<Record<string, any>>({});

  // Load submission status for each assignment
  React.useEffect(() => {
    if (assignments.length > 0 && userProfile?.id) {
      assignments.forEach(async (assignment) => {
        try {
          const submission = await fetchStudentSubmission(assignment.id, userProfile.id);
          if (submission) {
            setSubmissionStatuses(prev => ({
              ...prev,
              [assignment.id]: submission
            }));
          }
        } catch (error) {
          console.error('Error fetching submission:', error);
        }
      });
    }
  }, [assignments, userProfile?.id]);

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile || !selectedAssignment || !submissionFile) {
      alert('Please select a file to submit');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const submissionData = {
        assignmentId: selectedAssignment.id,
        studentId: userProfile.id,
        studentName: userProfile.name || userProfile.email,
        submittedAt: new Date().toISOString()
      };

      await submitStudentAssignment(submissionData, submissionFile);
      
      // Refresh submission status
      const updatedSubmission = await fetchStudentSubmission(selectedAssignment.id, userProfile.id);
      setSubmissionStatuses(prev => ({
        ...prev,
        [selectedAssignment.id]: updatedSubmission
      }));
      
      // Reset form
      setShowSubmitModal(false);
      setSelectedAssignment(null);
      setSubmissionFile(undefined);
      
      alert('Assignment submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAssignmentStatus = (assignment: any) => {
    const submission = submissionStatuses[assignment.id];
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    
    if (submission) {
      if (submission.status === 'Graded') {
        return {
          label: 'Graded',
          color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          icon: CheckCircle
        };
      } else if (submission.status === 'Late') {
        return {
          label: 'Late Submission',
          color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
          icon: AlertCircle
        };
      } else {
        return {
          label: 'Submitted',
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          icon: CheckCircle
        };
      }
    } else if (dueDate < now) {
      return {
        label: 'Overdue',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        icon: AlertCircle
      };
    } else {
      return {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: Clock
      };
    }
  };

  if (!studentClassId) {
    return (
      <div className={`rounded-2xl border p-12 text-center ${
        theme === 'dark'
          ? 'bg-[#0A0A0A] border-[#1A1A1A]'
          : 'bg-white border-gray-200'
      }`}>
        <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          No class assigned
        </p>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          Please contact your administrator to be assigned to a class
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              My Assignments
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              View and submit your assignments
            </p>
          </div>
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
              Your mentor hasn't assigned any work yet
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {assignments.map(assignment => {
              const status = getAssignmentStatus(assignment);
              const submission = submissionStatuses[assignment.id];
              const StatusIcon = status.icon;

              return (
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
                      <div className="flex items-start gap-3 mb-2">
                        <h4 className={`font-bold text-base flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {assignment.title}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </div>

                      {assignment.description && (
                        <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {assignment.description}
                        </p>
                      )}

                      {assignment.instructions && (
                        <div className={`p-3 rounded-lg mb-3 ${
                          theme === 'dark'
                            ? 'bg-[#0D0D0D] border border-[#222]'
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <p className={`text-xs font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Instructions:
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {assignment.instructions}
                          </p>
                        </div>
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
                            Download Assignment
                          </a>
                        )}
                      </div>

                      {/* Submission Info */}
                      {submission && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-[#0D0D0D] border border-[#222]'
                            : 'bg-blue-50 border border-blue-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <p className={`text-xs font-semibold ${
                              theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                            }`}>
                              Your Submission
                            </p>
                            <a
                              href={submission.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs flex items-center gap-1 ${
                                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                              }`}
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </a>
                          </div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Submitted: {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                          {submission.status === 'Graded' && (
                            <>
                              <p className={`text-sm font-bold mt-2 ${
                                theme === 'dark' ? 'text-green-400' : 'text-green-700'
                              }`}>
                                Grade: {submission.marksObtained}/{assignment.maxMarks}
                              </p>
                              {submission.feedback && (
                                <div className={`mt-2 p-2 rounded ${
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
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  {!submission && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#1A1A1A]">
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmitModal(true);
                        }}
                        className="w-full px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Submit Assignment
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <h3 className="font-bold text-lg">Submit Assignment</h3>
              <button 
                onClick={() => {
                  setShowSubmitModal(false);
                  setSubmissionFile(undefined);
                }} 
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><span className="font-semibold">Assignment:</span> {selectedAssignment.title}</p>
              <p><span className="font-semibold">Due Date:</span> {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">Max Marks:</span> {selectedAssignment.maxMarks}</p>
            </div>

            <form onSubmit={handleSubmitAssignment} className={`space-y-4 pt-4 border-t ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
            }`}>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Upload Your Work <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => setSubmissionFile(e.target.files?.[0])}
                  required
                  accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-[#0D0D0D] border-[#222] text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Supported: PDF, Word, ZIP, Images (Max 10MB)
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmissionFile(undefined);
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
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
