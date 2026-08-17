/**
 * Classes Service
 * Handles all Firestore operations for classes/courses
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
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface Class {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  mentorName: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
  startDate: string;
  endDate: string;
  batchName: string;
  programTitle: string;
  studentIds: string[];
  createdAt: string;
  updatedAt: string;
}

const CLASSES_COLLECTION = 'classes';

/**
 * Create a new class
 */
export const createClass = async (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, CLASSES_COLLECTION), {
      ...classData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

/**
 * Get a single class by ID
 */
export const getClassById = async (classId: string): Promise<Class | null> => {
  try {
    const docRef = doc(db, CLASSES_COLLECTION, classId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Class;
    }
    return null;
  } catch (error) {
    console.error('Error getting class:', error);
    throw error;
  }
};

/**
 * Get all classes for a mentor
 */
export const getClassesByMentor = async (mentorId: string): Promise<Class[]> => {
  try {
    const q = query(
      collection(db, CLASSES_COLLECTION),
      where('mentorId', '==', mentorId)
    );
    
    const querySnapshot = await getDocs(q);
    const classes: Class[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      classes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Class);
    });
    
    // Sort in memory instead of using orderBy to avoid index requirement
    return classes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting classes:', error);
    throw error;
  }
};

/**
 * Update a class
 */
export const updateClass = async (classId: string, updates: Partial<Class>): Promise<void> => {
  try {
    const docRef = doc(db, CLASSES_COLLECTION, classId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

/**
 * Delete a class
 */
export const deleteClass = async (classId: string): Promise<void> => {
  try {
    const docRef = doc(db, CLASSES_COLLECTION, classId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
};

/**
 * Assign students to a class
 */
export const assignStudentsToClass = async (classId: string, studentIds: string[]): Promise<void> => {
  try {
    const docRef = doc(db, CLASSES_COLLECTION, classId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentStudents = docSnap.data().studentIds || [];
      const updatedStudents = [...new Set([...currentStudents, ...studentIds])];
      
      await updateDoc(docRef, {
        studentIds: updatedStudents,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error assigning students:', error);
    throw error;
  }
};

/**
 * Remove students from a class
 */
export const removeStudentsFromClass = async (classId: string, studentIds: string[]): Promise<void> => {
  try {
    const docRef = doc(db, CLASSES_COLLECTION, classId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentStudents = docSnap.data().studentIds || [];
      const updatedStudents = currentStudents.filter((id: string) => !studentIds.includes(id));
      
      await updateDoc(docRef, {
        studentIds: updatedStudents,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error removing students:', error);
    throw error;
  }
};
