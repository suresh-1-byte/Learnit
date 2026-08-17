/**
 * Custom hook for managing classes
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Class,
  createClass,
  getClassesByMentor,
  updateClass,
  deleteClass,
  getClassById
} from '../services/firebase/classes.service';

export const useClasses = () => {
  const { userProfile } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes when component mounts or user changes
  useEffect(() => {
    if (userProfile?.id) {
      fetchClasses();
    }
  }, [userProfile?.id]);

  const fetchClasses = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching classes for mentor:', userProfile.id);
      const fetchedClasses = await getClassesByMentor(userProfile.id);
      console.log('Fetched classes:', fetchedClasses);
      setClasses(fetchedClasses);
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setError(err.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const addClass = async (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const classId = await createClass(classData);
      await fetchClasses(); // Refresh the list
      return classId;
    } catch (err: any) {
      setError(err.message || 'Failed to create class');
      console.error('Error creating class:', err);
      throw err;
    }
  };

  const updateClassData = async (classId: string, updates: Partial<Class>) => {
    try {
      setError(null);
      await updateClass(classId, updates);
      await fetchClasses(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to update class');
      console.error('Error updating class:', err);
      throw err;
    }
  };

  const removeClass = async (classId: string) => {
    try {
      setError(null);
      await deleteClass(classId);
      await fetchClasses(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to delete class');
      console.error('Error deleting class:', err);
      throw err;
    }
  };

  const getClass = async (classId: string) => {
    try {
      setError(null);
      return await getClassById(classId);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch class');
      console.error('Error fetching class:', err);
      throw err;
    }
  };

  return {
    classes,
    loading,
    error,
    fetchClasses,
    addClass,
    updateClassData,
    removeClass,
    getClass
  };
};
