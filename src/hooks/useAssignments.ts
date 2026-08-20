/**
 * Custom hook for managing assignments and submissions
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Assignment,
  Submission,
  createAssignment,
  getAssignmentById,
  getAssignmentsByMentor,
  getAssignmentsByClass,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissionsByAssignment,
  getStudentSubmission,
  gradeSubmission
} from '../services/firebase/assignments.service';

export const useAssignments = (classId?: string) => {
  const { userProfile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch assignments when component mounts or dependencies change
  useEffect(() => {
    if (userProfile?.id && userProfile?.role === 'mentor') {
      fetchMentorAssignments();
    } else if (classId) {
      fetchClassAssignments(classId);
    }
  }, [userProfile?.id, userProfile?.role, classId]);

  /**
   * Fetch all assignments created by the mentor
   */
  const fetchMentorAssignments = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching assignments for mentor:', userProfile.id);
      const fetchedAssignments = await getAssignmentsByMentor(userProfile.id);
      console.log('Fetched assignments:', fetchedAssignments);
      setAssignments(fetchedAssignments);
    } catch (err: any) {
      console.error('Error fetching mentor assignments:', err);
      setError(err.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch assignments for a specific class
   */
  const fetchClassAssignments = async (classId: string) => {
    if (!classId) {
      console.log('No classId provided, skipping fetch');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching assignments for class:', classId);
      const fetchedAssignments = await getAssignmentsByClass(classId);
      console.log('Fetched class assignments:', fetchedAssignments);
      console.log('Number of assignments:', fetchedAssignments.length);
      setAssignments(fetchedAssignments);
    } catch (err: any) {
      console.error('Error fetching class assignments:', err);
      console.error('Full error details:', err);
      setError(err.message || 'Failed to fetch class assignments');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new assignment
   */
  const addAssignment = async (
    assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>,
    file?: File
  ) => {
    try {
      setError(null);
      console.log('Creating assignment:', assignmentData);
      const assignmentId = await createAssignment(assignmentData, file);
      console.log('Assignment created with ID:', assignmentId);
      
      // Refresh the assignments list
      if (userProfile?.role === 'mentor') {
        await fetchMentorAssignments();
      } else if (classId) {
        await fetchClassAssignments(classId);
      }
      
      return assignmentId;
    } catch (err: any) {
      setError(err.message || 'Failed to create assignment');
      console.error('Error creating assignment:', err);
      throw err;
    }
  };

  /**
   * Update an existing assignment
   */
  const updateAssignmentData = async (
    assignmentId: string,
    updates: Partial<Assignment>,
    file?: File
  ) => {
    try {
      setError(null);
      console.log('Updating assignment:', assignmentId, updates);
      await updateAssignment(assignmentId, updates, file);
      console.log('Assignment updated successfully');
      
      // Refresh the assignments list
      if (userProfile?.role === 'mentor') {
        await fetchMentorAssignments();
      } else if (classId) {
        await fetchClassAssignments(classId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update assignment');
      console.error('Error updating assignment:', err);
      throw err;
    }
  };

  /**
   * Delete an assignment
   */
  const removeAssignment = async (assignmentId: string) => {
    try {
      setError(null);
      console.log('Deleting assignment:', assignmentId);
      await deleteAssignment(assignmentId);
      console.log('Assignment deleted successfully');
      
      // Refresh the assignments list
      if (userProfile?.role === 'mentor') {
        await fetchMentorAssignments();
      } else if (classId) {
        await fetchClassAssignments(classId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete assignment');
      console.error('Error deleting assignment:', err);
      throw err;
    }
  };

  /**
   * Get a specific assignment by ID
   */
  const getAssignment = async (assignmentId: string) => {
    try {
      setError(null);
      console.log('Fetching assignment:', assignmentId);
      const assignment = await getAssignmentById(assignmentId);
      console.log('Fetched assignment:', assignment);
      return assignment;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assignment');
      console.error('Error fetching assignment:', err);
      throw err;
    }
  };

  /**
   * Submit an assignment (student)
   */
  const submitStudentAssignment = async (
    submissionData: Omit<Submission, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    file: File
  ) => {
    try {
      setError(null);
      console.log('Submitting assignment:', submissionData);
      const submissionId = await submitAssignment(submissionData, file);
      console.log('Assignment submitted with ID:', submissionId);
      
      return submissionId;
    } catch (err: any) {
      setError(err.message || 'Failed to submit assignment');
      console.error('Error submitting assignment:', err);
      throw err;
    }
  };

  /**
   * Fetch all submissions for an assignment
   */
  const fetchSubmissions = async (assignmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching submissions for assignment:', assignmentId);
      const fetchedSubmissions = await getSubmissionsByAssignment(assignmentId);
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
   * Get student's submission for a specific assignment
   */
  const fetchStudentSubmission = async (assignmentId: string, studentId: string) => {
    try {
      setError(null);
      console.log('Fetching student submission:', { assignmentId, studentId });
      const submission = await getStudentSubmission(assignmentId, studentId);
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
  const gradeStudentSubmission = async (
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
      await gradeSubmission(submissionId, marksObtained, feedback, userProfile.name || userProfile.email);
      console.log('Submission graded successfully');
      
      // Optionally refresh submissions if we have an assignment context
      // This allows the UI to update immediately after grading
    } catch (err: any) {
      setError(err.message || 'Failed to grade submission');
      console.error('Error grading submission:', err);
      throw err;
    }
  };

  /**
   * Calculate assignment statistics for a mentor
   */
  const getAssignmentStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: assignments.length,
      thisWeek: assignments.filter(a => new Date(a.createdAt) >= weekAgo).length,
      upcoming: assignments.filter(a => new Date(a.dueDate) > now).length,
      overdue: assignments.filter(a => new Date(a.dueDate) < now).length
    };
  };

  return {
    assignments,
    submissions,
    loading,
    error,
    // Assignment operations
    fetchMentorAssignments,
    fetchClassAssignments,
    addAssignment,
    updateAssignmentData,
    removeAssignment,
    getAssignment,
    // Submission operations
    submitStudentAssignment,
    fetchSubmissions,
    fetchStudentSubmission,
    gradeStudentSubmission,
    // Stats
    getAssignmentStats
  };
};
