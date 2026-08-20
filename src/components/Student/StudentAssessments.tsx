import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  Play,
  Send
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAssessments } from '../../hooks/useAssessments';
import { Assessment, AssessmentAnswer } from '../../services/firebase/assessments.service';

export const StudentAssessments: React.FC = () => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  
  // Get student's class ID
  const studentClassId = userProfile?.classId || userProfile?.batchId || '';
  
  // Debug logging
  React.useEffect(() => {
    console.log('StudentAssessments - userProfile:', userProfile);
    console.log('StudentAssessments - studentClassId:', studentClassId);
  }, [userProfile, studentClassId]);
  
  const {
    assessments,
    loading: assessmentsLoading,
    startStudentAssessment,
    submitStudentAssessment,
    fetchStudentSubmission
  } = useAssessments(studentClassId);

  const [submissionStatuses, setSubmissionStatuses] = useState<Record<string, any>>({});
  const [takingAssessment, setTakingAssessment] = useState<Assessment | null>(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string>('');
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load submission status for each assessment
  useEffect(() => {
    if (assessments.length > 0 && userProfile?.id) {
      assessments.forEach(async (assessment) => {
        try {
          const submission = await fetchStudentSubmission(assessment.id, userProfile.id);
          if (submission) {
            setSubmissionStatuses(prev => ({
              ...prev,
              [assessment.id]: submission
            }));
          }
        } catch (error) {
          console.error('Error fetching submission:', error);
        }
      });
    }
  }, [assessments, userProfile?.id]);

  const getAssessmentStatus = (assessment: Assessment) => {
    const submission = submissionStatuses[assessment.id];
    const dueDate = new Date(assessment.dueDate);
    const now = new Date();
    
    if (submission) {
      if (submission.status === 'Graded') {
        return {
          label: 'Graded',
          color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          icon: CheckCircle
        };
      } else if (submission.status === 'Submitted') {
        return {
          label: 'Submitted',
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          icon: CheckCircle
        };
      } else {
        return {
          label: 'In Progress',
          color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
          icon: Clock
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

  const handleStartAssessment = async (assessment: Assessment) => {
    try {
      setIsSubmitting(true);
      const submissionId = await startStudentAssessment(assessment.id);
      setCurrentSubmissionId(submissionId);
      setTakingAssessment(assessment);
      // Initialize empty answers
      if (assessment.questions) {
        setAnswers(assessment.questions.map(q => ({
          questionId: q.id,
          answer: ''
        })));
      }
    } catch (error: any) {
      console.error('Error starting assessment:', error);
      alert('Failed to start assessment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!currentSubmissionId) return;

    try {
      setIsSubmitting(true);
      await submitStudentAssessment(currentSubmissionId, answers);
      
      // Refresh submission status
      if (userProfile && takingAssessment) {
        const updatedSubmission = await fetchStudentSubmission(takingAssessment.id, userProfile.id);
        setSubmissionStatuses(prev => ({
          ...prev,
          [takingAssessment.id]: updatedSubmission
        }));
      }
      
      setTakingAssessment(null);
      setCurrentSubmissionId('');
      setAnswers([]);
      
      alert('Assessment submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId ? { ...a, answer } : a
    ));
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

  // If currently taking an assessment, show the assessment interface
  if (takingAssessment) {
    return (
      <div className="space-y-4">
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {takingAssessment.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {takingAssessment.duration} minutes
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              {takingAssessment.totalMarks} marks
            </span>
          </div>
          
          {takingAssessment.instructions && (
            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'dark' ? 'bg-[#111] border border-[#222]' : 'bg-gray-50 border border-gray-200'
            }`}>
              <p className="text-sm">{takingAssessment.instructions}</p>
            </div>
          )}

          <div className="space-y-6">
            {takingAssessment.questions?.map((question, idx) => (
              <div key={question.id} className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="font-bold text-blue-500">Q{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="font-medium mb-2">{question.question}</p>
                    <p className="text-xs text-gray-500">Marks: {question.marks}</p>
                  </div>
                </div>

                {question.type === 'MCQ' && question.options ? (
                  <div className="space-y-2 ml-8">
                    {question.options.map((option, optIdx) => (
                      <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers.find(a => a.questionId === question.id)?.answer === option}
                          onChange={(e) => updateAnswer(question.id, e.target.value)}
                          className="w-4 h-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={4}
                    value={answers.find(a => a.questionId === question.id)?.answer || ''}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className={`w-full ml-8 p-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-[#0D0D0D] border-[#333] text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setTakingAssessment(null)}
              className={`px-6 py-2 rounded-xl font-semibold ${
                theme === 'dark'
                  ? 'bg-[#1A1A1A] text-white hover:bg-[#222]'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitAssessment}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Assessment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main assessments list view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            My Assessments
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            View and take your scheduled assessments
          </p>
        </div>
      </div>

      {assessmentsLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#6366F1]" />
          <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading assessments...
          </p>
        </div>
      ) : assessments.length === 0 ? (
        <div className={`text-center py-12 border-2 border-dashed rounded-2xl ${
          theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
        }`}>
          <FileText className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No assessments yet
          </p>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Your mentor hasn't scheduled any assessments yet
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {assessments.map(assessment => {
            const status = getAssessmentStatus(assessment);
            const submission = submissionStatuses[assessment.id];
            const StatusIcon = status.icon;

            return (
              <div
                key={assessment.id}
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
                        {assessment.title}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </div>

                    {assessment.description && (
                      <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {assessment.description}
                      </p>
                    )}

                    <div className={`flex flex-wrap gap-3 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Due: {new Date(assessment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {assessment.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {assessment.totalMarks} marks
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold">
                        {assessment.type}
                      </span>
                    </div>

                    {/* Submission Info */}
                    {submission && submission.status === 'Graded' && (
                      <div className={`mt-3 p-3 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-green-900/20 border border-green-900/30'
                          : 'bg-green-50 border border-green-200'
                      }`}>
                        <p className={`text-sm font-bold ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-700'
                        }`}>
                          Score: {submission.marksObtained}/{assessment.totalMarks}
                        </p>
                        {submission.feedback && (
                          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                            Feedback: {submission.feedback}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Start Button */}
                {!submission && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#1A1A1A]">
                    <button
                      onClick={() => handleStartAssessment(assessment)}
                      className="w-full px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Start Assessment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
