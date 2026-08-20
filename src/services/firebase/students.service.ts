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
 * Get all students (from users collection with role='student')
 */
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    // Query users collection where role = 'student'
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'student')
    );
    
    const querySnapshot = await getDocs(q);
    const students: Student[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      students.push({
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        rollNumber: data.rollNumber || '',
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        departmentName: data.departmentName || '',
        phone: data.phone || '',
        batchName: data.batchName || '',
        programTitle: data.programTitle || 'General Program',
        classIds: data.classIds || data.classId ? [data.classId] : [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      } as Student);
    });
    
    return students;
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

/**
 * Get students by class ID (from users collection)
 */
export const getStudentsByClass = async (classId: string): Promise<Student[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'student')
    );
    
    const querySnapshot = await getDocs(q);
    const students: Student[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const classIds = data.classIds || (data.classId ? [data.classId] : []);
      
      // Filter by classId
      if (classIds.includes(classId)) {
        students.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          rollNumber: data.rollNumber || '',
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
          departmentName: data.departmentName || '',
          phone: data.phone || '',
          batchName: data.batchName || '',
          programTitle: data.programTitle || 'General Program',
          classIds: classIds,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        } as Student);
      }
    });
    
    return students;
  } catch (error) {
    console.error('Error getting students by class:', error);
    throw error;
  }
};

/**
 * Get student by ID (from users collection)
 */
export const getStudentById = async (studentId: string): Promise<Student | null> => {
  try {
    const docRef = doc(db, 'users', studentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        email: data.email || '',
        rollNumber: data.rollNumber || '',
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        departmentName: data.departmentName || '',
        phone: data.phone || '',
        batchName: data.batchName || '',
        programTitle: data.programTitle || 'General Program',
        classIds: data.classIds || (data.classId ? [data.classId] : []),
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      } as Student;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting student:', error);
    throw error;
  }
};

/**
 * Update student (in users collection)
 */
export const updateStudent = async (
  studentId: string,
  updates: Partial<Student>
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', studentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

/**
 * Delete student (from users collection)
 */
export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', studentId));
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
    const docRef = doc(db, 'users', studentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) throw new Error('Student not found');
    
    const data = docSnap.data();
    const currentClassIds = data.classIds || (data.classId ? [data.classId] : []);
    
    if (!currentClassIds.includes(classId)) {
      await updateDoc(docRef, {
        classIds: [...currentClassIds, classId],
        classId: classId, // Also set primary classId
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error assigning student to class:', error);
    throw error;
  }
};
