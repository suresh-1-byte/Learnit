/**
 * Custom hook for managing assessments and assessment submissions
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Assessment,
  AssessmentSubmission,
  AssessmentAnswer,
  createAssessment,
  getAssessmentById,
  getAssessmentsByMentor,
  getAssessmentsByClass,
  updateAssessment,
  deleteAssessment,
  startAssessment,
  submitAssessment,
  getSubmissionsByAssessment,
  getStudentSubmission,
  gradeAssessmentSubmission,
  getAssessmentStats
} from '../services/firebase/assessments.service';

export const useAssessments = (classId?: string) => {
  const { userProfile } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch assessments when component mounts or dependencies change
  useEffect(() => {
    if (userProfile?.id && userProfile?.role === 'mentor') {
      fetchMentorAssessments();
    } else if (classId) {
      fetchClassAssessments(classId);
    } else {
      setLoading(false);
    }
  }, [userProfile?.id, userProfile?.role, classId]);

  /**
   * Fetch all assessments created by the mentor
   */
  const fetchMentorAssessments = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching assessments for mentor:', userProfile.id);
      const fetchedAssessments = await getAssessmentsByMentor(userProfile.id);
      console.log('Fetched assessments:', fetchedAssessments);
      setAssessments(fetchedAssessments);
    } catch (err: any) {
      console.error('Error fetching mentor assessments:', err);
      setError(err.message || 'Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch assessments for a specific class
   */
  const fetchClassAssessments = async (classId: string) => {
    if (!classId) {
      console.log('No classId provided, skipping fetch');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching assessments for class:', classId);
      const fetchedAssessments = await getAssessmentsByClass(classId);
      console.log('Fetched class assessments:', fetchedAssessments);
      console.log('Number of assessments:', fetchedAssessments.length);
      setAssessments(fetchedAssessments);
    } catch (err: any) {
      console.error('Error fetching class assessments:', err);
      console.error('Full error details:', err);
      setError(err.message || 'Failed to fetch class assessments');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new assessment
   */
  const addAssessment = async (
    assessmentData: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setError(null);
      console.log('Creating assessment:', assessmentData);
      const assessmentId = await createAssessment(assessmentData);
      console.log('Assessment created with ID:', assessmentId);
      
      // Refresh the assessments list
      if (userProfile?.role === 'mentor') {
        await fetchMentorAssessments();
      } else if (classId) {
        await fetchClassAssessments(classId);
      }
      
      return assessmentId;
    } catch (err: any) {
      setError(err.message || 'Failed to create assessment');
      console.error('Error creating assessment:', err);
      throw err;
    }
  };

  /**
   * Update an existing assessment
   */
  const updateAssessmentData = async (
    assessmentId: string,
    updates: Partial<Assessment>
  ) => {
    try {
      setError(null);
      console.log('Updating assessment:', assessmentId, updates);
      await updateAssessment(assessmentId, updates);
      console.log('Assessment updated successfully');
      
      // Refresh the assessments list
      if (userProfile?.role === 'mentor') {
        await fetchMentorAssessments();
      } else if (classId) {
        await fetchClassAssessments(classId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update assessment');
      console.error('Error updating assessment:', err);
      throw err;
    }
  };

  /**
   * Delete an assessment
   */
  const removeAssessment = async (assessmentId: string) => {
    try {
      setError(null);
      console.log('Deleting assessment:', assessmentId);
      await deleteAssessment(assessmentId);
      console.log('Assessment deleted successfully');
      
      // Refresh the assessments list
      if (userProfile?.role === 'mentor') {
        await fetchMentorAssessments();
      } else if (classId) {
        await fetchClassAssessments(classId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete assessment');
      console.error('Error deleting assessment:', err);
      throw err;
    }
  };

  /**
   * Get a specific assessment by ID
   */
  const getAssessment = async (assessmentId: string) => {
    try {
      setError(null);
      console.log('Fetching assessment:', assessmentId);
      const assessment = await getAssessmentById(assessmentId);
      console.log('Fetched assessment:', assessment);
      return assessment;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assessment');
      console.error('Error fetching assessment:', err);
      throw err;
    }
  };

  /**
   * Start an assessment (student)
   */
  const startStudentAssessment = async (assessmentId: string) => {
    if (!userProfile?.id || !userProfile?.name) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      console.log('Starting assessment:', assessmentId);
      const submissionId = await startAssessment(
        assessmentId,
        userProfile.id,
        userProfile.name
      );
      console.log('Assessment started with submission ID:', submissionId);
      return submissionId;
    } catch (err: any) {
      setError(err.message || 'Failed to start assessment');
      console.error('Error starting assessment:', err);
      throw err;
    }
  };

  /**
   * Submit an assessment (student)
   */
  const submitStudentAssessment = async (
    submissionId: string,
    answers: AssessmentAnswer[]
  ) => {
    try {
      setError(null);
      console.log('Submitting assessment:', submissionId);
      await submitAssessment(submissionId, answers);
      console.log('Assessment submitted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to submit assessment');
      console.error('Error submitting assessment:', err);
      throw err;
    }
  };

  /**
   * Fetch all submissions for an assessment
   */
  const fetchSubmissions = async (assessmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching submissions for assessment:', assessmentId);
      const fetchedSubmissions = await getSubmissionsByAssessment(assessmentId);
      console.log('Fetched submissions:', fetchedSubmissions);
      setSubmissions(fetchedSubmissions);
      return fetchedSubmissions;
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setError(err.message || 'Failed to fetch submissions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get student's submission for a specific assessment
   */
  const fetchStudentSubmission = async (assessmentId: string, studentId: string) => {
    try {
      setError(null);
      console.log('Fetching student submission:', { assessmentId, studentId });
      const submission = await getStudentSubmission(assessmentId, studentId);
      console.log('Fetched student submission:', submission);
      return submission;
    } catch (err: any) {
      console.error('Error fetching student submission:', err);
      setError(err.message || 'Failed to fetch student submission');
      throw err;
    }
  };

  /**
   * Grade a submission (mentor)
   */
  const gradeSubmission = async (
    submissionId: string,
    marksObtained: number,
    feedback: string
  ) => {
    if (!userProfile?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      console.log('Grading submission:', { submissionId, marksObtained, feedback });
      await gradeAssessmentSubmission(
        submissionId,
        marksObtained,
        feedback,
        userProfile.name || userProfile.email
      );
      console.log('Submission graded successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to grade submission');
      console.error('Error grading submission:', err);
      throw err;
    }
  };

  /**
   * Calculate assessment statistics for a mentor
   */
  const getStats = async () => {
    if (!userProfile?.id) return null;

    try {
      const stats = await getAssessmentStats(userProfile.id);
      return stats;
    } catch (err: any) {
      console.error('Error getting assessment stats:', err);
      return null;
    }
  };

  return {
    assessments,
    submissions,
    loading,
    error,
    // Assessment operations
    fetchMentorAssessments,
    fetchClassAssessments,
    addAssessment,
    updateAssessmentData,
    removeAssessment,
    getAssessment,
    // Student operations
    startStudentAssessment,
    submitStudentAssessment,
    fetchStudentSubmission,
    // Submission operations
    fetchSubmissions,
    gradeSubmission,
    // Stats
    getStats
  };
};
