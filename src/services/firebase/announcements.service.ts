/**
 * Announcements Service
 * Handles all Firestore operations for announcements
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
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  mentorId: string;
  mentorName: string;
  targetType: 'All Classes' | 'Specific Class' | 'Specific Students';
  targetClassIds?: string[]; // If targetType is 'Specific Class'
  targetStudentIds?: string[]; // If targetType is 'Specific Students'
  priority: 'High' | 'Medium' | 'Low';
  type?: 'General' | 'Assignment' | 'Exam' | 'Event' | 'Important';
  attachmentUrl?: string;
  attachmentName?: string;
  readBy?: string[]; // Array of student IDs who have read it
  createdAt: string;
  updatedAt: string;
}

const ANNOUNCEMENTS_COLLECTION = 'announcements';

/**
 * Create a new announcement
 */
export const createAnnouncement = async (
  announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'readBy'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, ANNOUNCEMENTS_COLLECTION), {
      ...announcementData,
      readBy: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

/**
 * Get announcement by ID
 */
export const getAnnouncementById = async (announcementId: string): Promise<Announcement | null> => {
  try {
    const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, announcementId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Announcement;
    }
    return null;
  } catch (error) {
    console.error('Error getting announcement:', error);
    throw error;
  }
};

/**
 * Get all announcements created by a mentor
 */
export const getAnnouncementsByMentor = async (mentorId: string): Promise<Announcement[]> => {
  try {
    const q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      where('mentorId', '==', mentorId)
    );
    
    const querySnapshot = await getDocs(q);
    const announcements: Announcement[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Announcement);
    });
    
    // Sort in memory to avoid index requirement
    return announcements.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting announcements:', error);
    throw error;
  }
};

/**
 * Get announcements for a specific class
 */
export const getAnnouncementsByClass = async (classId: string): Promise<Announcement[]> => {
  try {
    console.log('getAnnouncementsByClass called with classId:', classId);
    const announcements: Announcement[] = [];
    
    // Try to get announcements for specific class - with fallback
    try {
      const q = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where('targetClassIds', 'array-contains', classId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Announcement);
      });
      console.log('Fetched specific class announcements with orderBy:', announcements.length);
    } catch (indexError: any) {
      console.warn('Index error for specific class, trying without orderBy:', indexError.message);
      // Fallback without orderBy
      const q = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where('targetClassIds', 'array-contains', classId)
      );
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Announcement);
      });
      console.log('Fetched specific class announcements without orderBy:', announcements.length);
    }
    
    // Also get announcements for all classes - with fallback
    try {
      const allClassesQuery = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where('targetType', '==', 'All Classes'),
        orderBy('createdAt', 'desc')
      );
      
      const allClassesSnapshot = await getDocs(allClassesQuery);
      allClassesSnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Announcement);
      });
      console.log('Fetched all classes announcements with orderBy');
    } catch (indexError: any) {
      console.warn('Index error for all classes, trying without orderBy:', indexError.message);
      // Fallback without orderBy
      const allClassesQuery = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where('targetType', '==', 'All Classes')
      );
      
      const allClassesSnapshot = await getDocs(allClassesQuery);
      allClassesSnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Announcement);
      });
      console.log('Fetched all classes announcements without orderBy');
    }
    
    // Remove duplicates and sort by date in memory
    const uniqueAnnouncements = Array.from(
      new Map(announcements.map(a => [a.id, a])).values()
    );
    
    const sorted = uniqueAnnouncements.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    console.log('Total unique announcements after sorting:', sorted.length);
    return sorted;
  } catch (error: any) {
    console.error('Error getting class announcements:', error);
    console.error('Full error:', error);
    throw error;
  }
};

/**
 * Get announcements for a specific student
 */
export const getAnnouncementsByStudent = async (
  studentId: string,
  classIds: string[]
): Promise<Announcement[]> => {
  try {
    console.log('getAnnouncementsByStudent called:', { studentId, classIds });
    const announcements: Announcement[] = [];
    
    // Get announcements targeted to all classes - with fallback
    try {
      const allClassesQuery = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where('targetType', '==', 'All Classes'),
        orderBy('createdAt', 'desc')
      );
      const allClassesSnapshot = await getDocs(allClassesQuery);
      allClassesSnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Announcement);
      });
      console.log('Fetched all classes announcements with orderBy');
    } catch (indexError: any) {
      console.warn('Index error for all classes, trying without orderBy');
      const allClassesQuery = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where('targetType', '==', 'All Classes')
      );
      const allClassesSnapshot = await getDocs(allClassesQuery);
      allClassesSnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Announcement);
      });
      console.log('Fetched all classes announcements without orderBy');
    }
    
    // Get announcements for student's classes
    for (const classId of classIds) {
      try {
        const classQuery = query(
          collection(db, ANNOUNCEMENTS_COLLECTION),
          where('targetClassIds', 'array-contains', classId),
          orderBy('createdAt', 'desc')
        );
        const classSnapshot = await getDocs(classQuery);
        classSnapshot.forEach((doc) => {
          const data = doc.data();
          announcements.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString()
          } as Announcement);
        });
        console.log(`Fetched class ${classId} announcements with orderBy`);
      } catch (indexError: any) {
        console.warn(`Index error for class ${classId}, trying without orderBy`);
        const classQuery = query(
          collection(db, ANNOUNCEMENTS_COLLECTION),
          where('targetClassIds', 'array-contains', classId)
        );
        const classSnapshot = await getDocs(classQuery);
        classSnapshot.forEach((doc) => {
          const data = doc.data();
          announcements.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString()
          } as Announcement);
        });
        console.log(`Fetched class ${classId} announcements without orderBy`);
      }
    }
    
    // Get announcements targeted specifically to this student - with fallback
    try {
      const studentQuery = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where('targetStudentIds', 'array-contains', studentId),
        orderBy('createdAt', 'desc')
      );
      const studentSnapshot = await getDocs(studentQuery);
      studentSnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Announcement);
      });
      console.log('Fetched student-specific announcements with orderBy');
    } catch (indexError: any) {
      console.warn('Index error for student-specific, trying without orderBy');
      const studentQuery = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where('targetStudentIds', 'array-contains', studentId)
      );
      const studentSnapshot = await getDocs(studentQuery);
      studentSnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        } as Announcement);
      });
      console.log('Fetched student-specific announcements without orderBy');
    }
    
    // Remove duplicates and sort by date
    const uniqueAnnouncements = Array.from(
      new Map(announcements.map(a => [a.id, a])).values()
    );
    
    const sorted = uniqueAnnouncements.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    console.log('Total unique student announcements:', sorted.length);
    return sorted;
  } catch (error: any) {
    console.error('Error getting student announcements:', error);
    console.error('Full error:', error);
    throw error;
  }
};

/**
 * Update an announcement
 */
export const updateAnnouncement = async (
  announcementId: string,
  updates: Partial<Announcement>
): Promise<void> => {
  try {
    const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, announcementId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = async (announcementId: string): Promise<void> => {
  try {
    const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, announcementId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

/**
 * Mark announcement as read by a student
 */
export const markAnnouncementAsRead = async (
  announcementId: string,
  studentId: string
): Promise<void> => {
  try {
    const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, announcementId);
    await updateDoc(docRef, {
      readBy: arrayUnion(studentId),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking announcement as read:', error);
    throw error;
  }
};

/**
 * Get unread announcements count for a student
 */
export const getUnreadAnnouncementsCount = async (
  studentId: string,
  classIds: string[]
): Promise<number> => {
  try {
    const announcements = await getAnnouncementsByStudent(studentId, classIds);
    const unreadCount = announcements.filter(
      announcement => !announcement.readBy?.includes(studentId)
    ).length;
    
    return unreadCount;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
};

/**
 * Get announcement statistics for mentor
 */
export const getAnnouncementStats = async (mentorId: string): Promise<{
  total: number;
  high: number;
  medium: number;
  low: number;
  thisWeek: number;
  thisMonth: number;
}> => {
  try {
    const announcements = await getAnnouncementsByMentor(mentorId);
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      total: announcements.length,
      high: announcements.filter(a => a.priority === 'High').length,
      medium: announcements.filter(a => a.priority === 'Medium').length,
      low: announcements.filter(a => a.priority === 'Low').length,
      thisWeek: announcements.filter(
        a => new Date(a.createdAt) >= weekAgo
      ).length,
      thisMonth: announcements.filter(
        a => new Date(a.createdAt) >= monthAgo
      ).length
    };
  } catch (error) {
    console.error('Error getting announcement stats:', error);
    throw error;
  }
};
