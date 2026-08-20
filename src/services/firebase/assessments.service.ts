/**
 * Assessments Service
 * Handles all Firestore operations for assessments and assessment submissions
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: 'Coding Test' | 'Quiz' | 'Practical Assessment' | 'Project Evaluation';
  mentorId: string;
  mentorName: string;
  classId: string;
  className: string;
  batchName: string;
  totalMarks: number;
  duration: number; // in minutes
  scheduledDate: string;
  dueDate: string;
  instructions?: string;
  questions?: AssessmentQuestion[];
  status: 'Scheduled' | 'Active' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'MCQ' | 'Short Answer' | 'Coding' | 'Essay';
  options?: string[]; // For MCQ
  correctAnswer?: string; // For MCQ
  marks: number;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  answers: AssessmentAnswer[];
  status: 'In Progress' | 'Submitted' | 'Graded';
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  marksAwarded?: number;
}

const ASSESSMENTS_COLLECTION = 'assessments';
const ASSESSMENT_SUBMISSIONS_COLLECTION = 'assessmentSubmissions';

/**
 * Create a new assessment
 */
export const createAssessment = async (
  assessmentData: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    console.log('Creating assessment:', assessmentData);
    const docRef = await addDoc(collection(db, ASSESSMENTS_COLLECTION), {
      ...assessmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Assessment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating assessment:', error);
    throw error;
  }
};

/**
 * Get assessment by ID
 */
export const getAssessmentById = async (assessmentId: string): Promise<Assessment | null> => {
  try {
    const docRef = doc(db, ASSESSMENTS_COLLECTION, assessmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Assessment;
    }
    return null;
  } catch (error) {
    console.error('Error getting assessment:', error);
    throw error;
  }
};

/**
 * Get all assessments for a mentor
 */
export const getAssessmentsByMentor = async (mentorId: string): Promise<Assessment[]> => {
  try {
    const q = query(
      collection(db, ASSESSMENTS_COLLECTION),
      where('mentorId', '==', mentorId)
    );
    
    const querySnapshot = await getDocs(q);
    const assessments: Assessment[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      assessments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Assessment);
    });
    
    // Sort in memory to avoid index requirement
    return assessments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting assessments:', error);
    throw error;
  }
};

/**
 * Get assessments for a class
 */
export const getAssessmentsByClass = async (classId: string): Promise<Assessment[]> => {
  try {
    console.log('getAssessmentsByClass called with classId:', classId);
    
    // Try with orderBy first
    try {
      const q = query(
        collection(db, ASSESSMENTS_COLLECTION),
        where('classId', '==', classId),
        orderBy('scheduledDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const assessments: Assessment[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        assessments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Assessment);
      });
      
      console.log('Successfully fetched assessments with orderBy:', assessments.length);
      return assessments;
    } catch (indexError: any) {
      // If index error, try without orderBy and sort in memory
      console.warn('Index error, trying without orderBy:', indexError.message);
      
      const q = query(
        collection(db, ASSESSMENTS_COLLECTION),
        where('classId', '==', classId)
      );
      
      const querySnapshot = await getDocs(q);
      const assessments: Assessment[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        assessments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Assessment);
      });
      
      // Sort in memory
      assessments.sort((a, b) => 
        new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
      );
      
      console.log('Successfully fetched assessments without orderBy:', assessments.length);
      return assessments;
    }
  } catch (error: any) {
    console.error('Error getting class assessments:', error);
    console.error('Full error:', error);
    throw error;
  }
};

/**
 * Update an assessment
 */
export const updateAssessment = async (
  assessmentId: string,
  updates: Partial<Assessment>
): Promise<void> => {
  try {
    const docRef = doc(db, ASSESSMENTS_COLLECTION, assessmentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating assessment:', error);
    throw error;
  }
};

/**
 * Delete an assessment
 */
export const deleteAssessment = async (assessmentId: string): Promise<void> => {
  try {
    const docRef = doc(db, ASSESSMENTS_COLLECTION, assessmentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting assessment:', error);
    throw error;
  }
};

/**
 * Start an assessment (student)
 */
export const startAssessment = async (
  assessmentId: string,
  studentId: string,
  studentName: string
): Promise<string> => {
  try {
    console.log('Starting assessment:', { assessmentId, studentId });
    
    const submissionData = {
      assessmentId,
      studentId,
      studentName,
      startedAt: new Date().toISOString(),
      answers: [],
      status: 'In Progress',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, ASSESSMENT_SUBMISSIONS_COLLECTION), submissionData);
    
    console.log('Assessment started with submission ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error starting assessment:', error);
    throw error;
  }
};

/**
 * Submit an assessment (student)
 */
export const submitAssessment = async (
  submissionId: string,
  answers: AssessmentAnswer[]
): Promise<void> => {
  try {
    console.log('Submitting assessment:', { submissionId, answersCount: answers.length });
    
    const docRef = doc(db, ASSESSMENT_SUBMISSIONS_COLLECTION, submissionId);
    await updateDoc(docRef, {
      answers,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
      updatedAt: serverTimestamp()
    });
    
    console.log('Assessment submitted successfully');
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
};

/**
 * Get submissions for an assessment
 */
export const getSubmissionsByAssessment = async (assessmentId: string): Promise<AssessmentSubmission[]> => {
  try {
    const q = query(
      collection(db, ASSESSMENT_SUBMISSIONS_COLLECTION),
      where('assessmentId', '==', assessmentId)
    );
    
    const querySnapshot = await getDocs(q);
    const submissions: AssessmentSubmission[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as AssessmentSubmission);
    });
    
    return submissions;
  } catch (error) {
    console.error('Error getting submissions:', error);
    throw error;
  }
};

/**
 * Get student's submission for an assessment
 */
export const getStudentSubmission = async (
  assessmentId: string,
  studentId: string
): Promise<AssessmentSubmission | null> => {
  try {
    const q = query(
      collection(db, ASSESSMENT_SUBMISSIONS_COLLECTION),
      where('assessmentId', '==', assessmentId),
      where('studentId', '==', studentId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as AssessmentSubmission;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting student submission:', error);
    throw error;
  }
};

/**
 * Grade an assessment submission (mentor)
 */
export const gradeAssessmentSubmission = async (
  submissionId: string,
  marksObtained: number,
  feedback: string,
  gradedBy: string
): Promise<void> => {
  try {
    const docRef = doc(db, ASSESSMENT_SUBMISSIONS_COLLECTION, submissionId);
    await updateDoc(docRef, {
      status: 'Graded',
      marksObtained,
      feedback,
      gradedBy,
      gradedAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    throw error;
  }
};

/**
 * Get assessment statistics for a mentor
 */
export const getAssessmentStats = async (mentorId: string): Promise<{
  total: number;
  scheduled: number;
  active: number;
  completed: number;
  thisWeek: number;
}> => {
  try {
    const assessments = await getAssessmentsByMentor(mentorId);
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: assessments.length,
      scheduled: assessments.filter(a => a.status === 'Scheduled').length,
      active: assessments.filter(a => a.status === 'Active').length,
      completed: assessments.filter(a => a.status === 'Completed').length,
      thisWeek: assessments.filter(
        a => new Date(a.createdAt) >= weekAgo
      ).length
    };
  } catch (error) {
    console.error('Error getting assessment stats:', error);
    throw error;
  }
};
