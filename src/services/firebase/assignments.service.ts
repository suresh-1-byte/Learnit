/**
 * Assignments Service
 * Handles all Firestore operations for assignments and submissions
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../../config/firebase';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  mentorId: string;
  mentorName: string;
  classId: string;
  dueDate: string;
  maxMarks: number;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl: string;
  fileName: string;
  status: 'Submitted' | 'Graded' | 'Late';
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const ASSIGNMENTS_COLLECTION = 'assignments';
const SUBMISSIONS_COLLECTION = 'submissions';

/**
 * Upload assignment attachment to Firebase Storage
 */
export const uploadAssignmentFile = async (
  file: File,
  assignmentId: string
): Promise<{ url: string; name: string }> => {
  try {
    const storageRef = ref(storage, `assignments/${assignmentId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return {
      url,
      name: file.name
    };
  } catch (error) {
    console.error('Error uploading assignment file:', error);
    throw error;
  }
};

/**
 * Create a new assignment
 */
export const createAssignment = async (
  assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>,
  file?: File
): Promise<string> => {
  try {
    // Create assignment document first to get ID
    const docRef = await addDoc(collection(db, ASSIGNMENTS_COLLECTION), {
      ...assignmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Upload file if provided
    if (file) {
      const { url, name } = await uploadAssignmentFile(file, docRef.id);
      await updateDoc(docRef, {
        attachmentUrl: url,
        attachmentName: name
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

/**
 * Get assignment by ID
 */
export const getAssignmentById = async (assignmentId: string): Promise<Assignment | null> => {
  try {
    const docRef = doc(db, ASSIGNMENTS_COLLECTION, assignmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Assignment;
    }
    return null;
  } catch (error) {
    console.error('Error getting assignment:', error);
    throw error;
  }
};

/**
 * Get all assignments for a mentor
 */
export const getAssignmentsByMentor = async (mentorId: string): Promise<Assignment[]> => {
  try {
    const q = query(
      collection(db, ASSIGNMENTS_COLLECTION),
      where('mentorId', '==', mentorId)
    );
    
    const querySnapshot = await getDocs(q);
    const assignments: Assignment[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      assignments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Assignment);
    });
    
    // Sort in memory to avoid index requirement
    return assignments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting assignments:', error);
    throw error;
  }
};

/**
 * Get assignments for a class
 */
export const getAssignmentsByClass = async (classId: string): Promise<Assignment[]> => {
  try {
    console.log('getAssignmentsByClass called with classId:', classId);
    
    // Try with orderBy first
    try {
      const q = query(
        collection(db, ASSIGNMENTS_COLLECTION),
        where('classId', '==', classId),
        orderBy('dueDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const assignments: Assignment[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        assignments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Assignment);
      });
      
      console.log('Successfully fetched assignments with orderBy:', assignments.length);
      return assignments;
    } catch (indexError: any) {
      // If index error, try without orderBy and sort in memory
      console.warn('Index error, trying without orderBy:', indexError.message);
      
      const q = query(
        collection(db, ASSIGNMENTS_COLLECTION),
        where('classId', '==', classId)
      );
      
      const querySnapshot = await getDocs(q);
      const assignments: Assignment[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        assignments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Assignment);
      });
      
      // Sort in memory
      assignments.sort((a, b) => 
        new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      );
      
      console.log('Successfully fetched assignments without orderBy:', assignments.length);
      return assignments;
    }
  } catch (error: any) {
    console.error('Error getting class assignments:', error);
    console.error('Full error:', error);
    throw error;
  }
};

/**
 * Update an assignment
 */
export const updateAssignment = async (
  assignmentId: string,
  updates: Partial<Assignment>,
  file?: File
): Promise<void> => {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    // Upload new file if provided
    if (file) {
      const { url, name } = await uploadAssignmentFile(file, assignmentId);
      updateData.attachmentUrl = url;
      updateData.attachmentName = name;
    }
    
    const docRef = doc(db, ASSIGNMENTS_COLLECTION, assignmentId);
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }
};

/**
 * Delete an assignment
 */
export const deleteAssignment = async (assignmentId: string): Promise<void> => {
  try {
    // Delete attachment from storage if exists
    const assignment = await getAssignmentById(assignmentId);
    if (assignment?.attachmentUrl) {
      try {
        const fileRef = ref(storage, assignment.attachmentUrl);
        await deleteObject(fileRef);
      } catch (error) {
        console.warn('Could not delete attachment file:', error);
      }
    }
    
    // Delete assignment document
    const docRef = doc(db, ASSIGNMENTS_COLLECTION, assignmentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
};

/**
 * Upload submission file to Firebase Storage
 */
export const uploadSubmissionFile = async (
  file: File,
  studentId: string,
  assignmentId: string
): Promise<{ url: string; name: string }> => {
  try {
    const storageRef = ref(storage, `submissions/${assignmentId}/${studentId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return {
      url,
      name: file.name
    };
  } catch (error) {
    console.error('Error uploading submission file:', error);
    throw error;
  }
};

/**
 * Submit an assignment (student)
 */
export const submitAssignment = async (
  submissionData: Omit<Submission, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  file: File
): Promise<string> => {
  try {
    // Upload file first
    const { url, name } = await uploadSubmissionFile(
      file,
      submissionData.studentId,
      submissionData.assignmentId
    );
    
    // Check if assignment is late
    const assignment = await getAssignmentById(submissionData.assignmentId);
    const isLate = assignment && new Date() > new Date(assignment.dueDate);
    
    // Create submission document
    const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
      ...submissionData,
      fileUrl: url,
      fileName: name,
      status: isLate ? 'Late' : 'Submitted',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error;
  }
};

/**
 * Get submissions for an assignment
 */
export const getSubmissionsByAssignment = async (assignmentId: string): Promise<Submission[]> => {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where('assignmentId', '==', assignmentId),
      orderBy('submittedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const submissions: Submission[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Submission);
    });
    
    return submissions;
  } catch (error) {
    console.error('Error getting submissions:', error);
    throw error;
  }
};

/**
 * Grade a submission (mentor)
 */
export const gradeSubmission = async (
  submissionId: string,
  marksObtained: number,
  feedback: string,
  gradedBy: string
): Promise<void> => {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
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
 * Get student's submission for an assignment
 */
export const getStudentSubmission = async (
  assignmentId: string,
  studentId: string
): Promise<Submission | null> => {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where('assignmentId', '==', assignmentId),
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
      } as Submission;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting student submission:', error);
    throw error;
  }
};
