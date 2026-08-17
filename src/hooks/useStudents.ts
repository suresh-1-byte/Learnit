/**
 * useStudents Hook - Student Management
 * Provides CRUD operations and state management for students
 */

import { useState, useEffect } from 'react';
import {
  getAllStudents,
  createStudent,
  updateStudent as updateStudentService,
  deleteStudent,
  getStudentsByClass,
  assignStudentToClass,
  Student
} from '../services/firebase/students.service';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all students on mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  // Add new student
  const addStudent = async (
    studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    try {
      const id = await createStudent(studentData);
      const newStudent: Student = {
        ...studentData,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setStudents([newStudent, ...students]);
      return id;
    } catch (err) {
      console.error('Error adding student:', err);
      throw err;
    }
  };

  // Update existing student
  const updateStudent = async (id: string, updates: Partial<Student>): Promise<void> => {
    try {
      await updateStudentService(id, updates);
      setStudents(
        students.map(s =>
          s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
        )
      );
    } catch (err) {
      console.error('Error updating student:', err);
      throw err;
    }
  };

  // Remove student
  const removeStudent = async (id: string): Promise<void> => {
    try {
      await deleteStudent(id);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error removing student:', err);
      throw err;
    }
  };

  // Get students by class
  const loadStudentsByClass = async (classId: string): Promise<Student[]> => {
    try {
      const data = await getStudentsByClass(classId);
      return data;
    } catch (err) {
      console.error('Error loading students by class:', err);
      throw err;
    }
  };

  // Assign student to class
  const assignToClass = async (studentId: string, classId: string): Promise<void> => {
    try {
      await assignStudentToClass(studentId, classId);
      // Update local state
      setStudents(
        students.map(s =>
          s.id === studentId && !s.classIds.includes(classId)
            ? { ...s, classIds: [...s.classIds, classId] }
            : s
        )
      );
    } catch (err) {
      console.error('Error assigning student to class:', err);
      throw err;
    }
  };

  // Bulk create students (for CSV upload)
  const bulkCreateStudents = async (
    studentsData: Array<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<{ successful: number; failed: number; errors: Array<{ index: number; reason: string }> }> => {
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as Array<{ index: number; reason: string }>
    };

    for (let i = 0; i < studentsData.length; i++) {
      try {
        await createStudent(studentsData[i]);
        results.successful++;
      } catch (err) {
        results.failed++;
        results.errors.push({
          index: i,
          reason: (err as Error).message
        });
      }
    }

    // Reload all students after bulk create
    await loadStudents();

    return results;
  };

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    removeStudent,
    loadStudents,
    loadStudentsByClass,
    assignToClass,
    bulkCreateStudents
  };
};
