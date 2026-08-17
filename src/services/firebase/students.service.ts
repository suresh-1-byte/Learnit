/**
 * Students Service - Quick Implementation
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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  avatar?: string;
  departmentName: string;
  phone?: string;
  batchName: string;
  programTitle: string;
  classIds: string[];
  createdAt: string;
  updatedAt: string;
}

const STUDENTS_COLLECTION = 'students';

/**
 * Create a new student
 */
export const createStudent = async (
  studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
      ...studentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

/**
 * Get all students
 */
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
    const students: Student[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      students.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Student);
    });
    
    return students;
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

/**
 * Get students by class ID
 */
export const getStudentsByClass = async (classId: string): Promise<Student[]> => {
  try {
    const q = query(
      collection(db, STUDENTS_COLLECTION),
      where('classIds', 'array-contains', classId)
    );
    
    const querySnapshot = await getDocs(q);
    const students: Student[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      students.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Student);
    });
    
    return students;
  } catch (error) {
    console.error('Error getting students by class:', error);
    throw error;
  }
};

/**
 * Get student by ID
 */
export const getStudentById = async (studentId: string): Promise<Student | null> => {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, studentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Student;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting student:', error);
    throw error;
  }
};

/**
 * Update student
 */
export const updateStudent = async (
  studentId: string,
  updates: Partial<Student>
): Promise<void> => {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

/**
 * Delete student
 */
export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

/**
 * Assign student to class
 */
export const assignStudentToClass = async (
  studentId: string,
  classId: string
): Promise<void> => {
  try {
    const student = await getStudentById(studentId);
    if (!student) throw new Error('Student not found');
    
    if (!student.classIds.includes(classId)) {
      await updateStudent(studentId, {
        classIds: [...student.classIds, classId]
      });
    }
  } catch (error) {
    console.error('Error assigning student to class:', error);
    throw error;
  }
};
