/**
 * Attendance Service
 * Handles all Firestore operations for attendance tracking
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

const ATTENDANCE_COLLECTION = 'attendance';

/**
 * Mark attendance for a student
 */
export const markAttendance = async (
  attendanceData: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    // Check if attendance already exists for this student on this date
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('studentId', '==', attendanceData.studentId),
      where('classId', '==', attendanceData.classId),
      where('date', '==', attendanceData.date)
    );
    
    const existingDocs = await getDocs(q);
    
    if (!existingDocs.empty) {
      // Update existing attendance
      const existingDoc = existingDocs.docs[0];
      await updateDoc(doc(db, ATTENDANCE_COLLECTION, existingDoc.id), {
        status: attendanceData.status,
        remarks: attendanceData.remarks,
        updatedAt: serverTimestamp()
      });
      return existingDoc.id;
    } else {
      // Create new attendance record
      const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), {
        ...attendanceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

/**
 * Mark attendance for multiple students
 */
export const markBulkAttendance = async (
  attendanceRecords: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>[]
): Promise<string[]> => {
  try {
    const ids: string[] = [];
    
    for (const record of attendanceRecords) {
      const id = await markAttendance(record);
      ids.push(id);
    }
    
    return ids;
  } catch (error) {
    console.error('Error marking bulk attendance:', error);
    throw error;
  }
};

/**
 * Get attendance for a specific class and date
 */
export const getAttendanceByClassAndDate = async (
  classId: string,
  date: string
): Promise<AttendanceRecord[]> => {
  try {
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('classId', '==', classId),
      where('date', '==', date)
    );
    
    const querySnapshot = await getDocs(q);
    const records: AttendanceRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as AttendanceRecord);
    });
    
    return records;
  } catch (error) {
    console.error('Error getting attendance:', error);
    throw error;
  }
};

/**
 * Get attendance history for a student
 */
export const getAttendanceByStudent = async (
  studentId: string,
  classId?: string
): Promise<AttendanceRecord[]> => {
  try {
    let q;
    
    if (classId) {
      q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where('studentId', '==', studentId),
        where('classId', '==', classId),
        orderBy('date', 'desc')
      );
    } else {
      q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where('studentId', '==', studentId),
        orderBy('date', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const records: AttendanceRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      records.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as AttendanceRecord);
    });
    
    return records;
  } catch (error) {
    console.error('Error getting student attendance:', error);
    throw error;
  }
};

/**
 * Get attendance statistics for a student
 */
export const getStudentAttendanceStats = async (
  studentId: string,
  classId?: string
): Promise<{
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}> => {
  try {
    const records = await getAttendanceByStudent(studentId, classId);
    
    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'Present').length,
      absent: records.filter(r => r.status === 'Absent').length,
      late: records.filter(r => r.status === 'Late').length,
      percentage: 0
    };
    
    if (stats.total > 0) {
      stats.percentage = Math.round(((stats.present + stats.late) / stats.total) * 100);
    }
    
    return stats;
  } catch (error) {
    console.error('Error calculating attendance stats:', error);
    throw error;
  }
};

/**
 * Get attendance for a mentor's classes
 */
export const getAttendanceByMentor = async (
  mentorId: string,
  dateFrom?: string,
  dateTo?: string
): Promise<AttendanceRecord[]> => {
  try {
    let q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('mentorId', '==', mentorId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    let records: AttendanceRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as AttendanceRecord);
    });
    
    // Filter by date range if provided
    if (dateFrom) {
      records = records.filter(r => r.date >= dateFrom);
    }
    if (dateTo) {
      records = records.filter(r => r.date <= dateTo);
    }
    
    return records;
  } catch (error) {
    console.error('Error getting mentor attendance:', error);
    throw error;
  }
};
