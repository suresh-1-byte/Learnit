/**
 * Custom hook for managing attendance
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  AttendanceRecord,
  markAttendance,
  markBulkAttendance,
  getAttendanceByClassAndDate,
  getAttendanceByStudent,
  getStudentAttendanceStats,
  getAttendanceByMentor
} from '../services/firebase/attendance.service';

export const useAttendance = (classId?: string, date?: string) => {
  const { userProfile } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance when component mounts or dependencies change
  useEffect(() => {
    if (classId && date) {
      fetchAttendanceByClassAndDate(classId, date);
    }
  }, [classId, date]);

  const fetchAttendanceByClassAndDate = async (classId: string, date: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching attendance for class:', classId, 'date:', date);
      const records = await getAttendanceByClassAndDate(classId, date);
      console.log('Fetched attendance records:', records);
      setAttendance(records);
    } catch (err: any) {
      console.error('Error fetching attendance:', err);
      setError(err.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const markStudentAttendance = async (
    attendanceData: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setError(null);
      const recordId = await markAttendance(attendanceData);
      
      // Refresh attendance for the class and date
      if (classId && date) {
        await fetchAttendanceByClassAndDate(classId, date);
      }
      
      return recordId;
    } catch (err: any) {
      setError(err.message || 'Failed to mark attendance');
      console.error('Error marking attendance:', err);
      throw err;
    }
  };

  const markBulkStudentAttendance = async (
    attendanceRecords: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => {
    try {
      setError(null);
      const ids = await markBulkAttendance(attendanceRecords);
      
      // Refresh attendance for the class and date
      if (classId && date) {
        await fetchAttendanceByClassAndDate(classId, date);
      }
      
      return ids;
    } catch (err: any) {
      setError(err.message || 'Failed to mark bulk attendance');
      console.error('Error marking bulk attendance:', err);
      throw err;
    }
  };

  const fetchStudentAttendance = async (studentId: string, classId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const records = await getAttendanceByStudent(studentId, classId);
      setAttendance(records);
      return records;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch student attendance');
      console.error('Error fetching student attendance:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStats = async (studentId: string, classId?: string) => {
    try {
      setError(null);
      return await getStudentAttendanceStats(studentId, classId);
    } catch (err: any) {
      setError(err.message || 'Failed to get attendance stats');
      console.error('Error getting attendance stats:', err);
      throw err;
    }
  };

  const fetchMentorAttendance = async (dateFrom?: string, dateTo?: string) => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const records = await getAttendanceByMentor(userProfile.id, dateFrom, dateTo);
      setAttendance(records);
      return records;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch mentor attendance');
      console.error('Error fetching mentor attendance:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    attendance,
    loading,
    error,
    markStudentAttendance,
    markBulkStudentAttendance,
    fetchAttendanceByClassAndDate,
    fetchStudentAttendance,
    getStats,
    fetchMentorAttendance
  };
};
