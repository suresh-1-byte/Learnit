/**
 * Custom hook for managing announcements
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Announcement,
  createAnnouncement,
  getAnnouncementsByMentor,
  getAnnouncementsByClass,
  getAnnouncementsByStudent,
  updateAnnouncement,
  deleteAnnouncement,
  markAnnouncementAsRead,
  getUnreadAnnouncementsCount,
  getAnnouncementStats
} from '../services/firebase/announcements.service';

export const useAnnouncements = (classId?: string) => {
  const { userProfile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch announcements when component mounts or dependencies change
  useEffect(() => {
    if (userProfile?.id) {
      fetchAnnouncements();
      if (userProfile.role === 'student') {
        fetchUnreadCount();
      }
    }
  }, [userProfile?.id, userProfile?.role, classId]);

  const fetchAnnouncements = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let fetchedAnnouncements: Announcement[];
      
      if (userProfile.role === 'student') {
        // For students, get announcements based on their classes
        const classIds = [userProfile.classId || userProfile.batchId || ''];
        fetchedAnnouncements = await getAnnouncementsByStudent(userProfile.id, classIds);
      } else if (classId) {
        // For mentors viewing a specific class
        fetchedAnnouncements = await getAnnouncementsByClass(classId);
      } else {
        // For mentors viewing all their announcements
        fetchedAnnouncements = await getAnnouncementsByMentor(userProfile.id);
      }
      
      setAnnouncements(fetchedAnnouncements);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch announcements');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userProfile?.id || userProfile.role !== 'student') return;
    
    try {
      const classIds = [userProfile.classId || userProfile.batchId || ''];
      const count = await getUnreadAnnouncementsCount(userProfile.id, classIds);
      setUnreadCount(count);
    } catch (err: any) {
      console.error('Error fetching unread count:', err);
    }
  };

  const addAnnouncement = async (
    announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'readBy'>
  ) => {
    try {
      setError(null);
      const announcementId = await createAnnouncement(announcementData);
      await fetchAnnouncements(); // Refresh the list
      return announcementId;
    } catch (err: any) {
      setError(err.message || 'Failed to create announcement');
      console.error('Error creating announcement:', err);
      throw err;
    }
  };

  const updateAnnouncementData = async (
    announcementId: string,
    updates: Partial<Announcement>
  ) => {
    try {
      setError(null);
      await updateAnnouncement(announcementId, updates);
      await fetchAnnouncements(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to update announcement');
      console.error('Error updating announcement:', err);
      throw err;
    }
  };

  const removeAnnouncement = async (announcementId: string) => {
    try {
      setError(null);
      await deleteAnnouncement(announcementId);
      await fetchAnnouncements(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to delete announcement');
      console.error('Error deleting announcement:', err);
      throw err;
    }
  };

  const markAsRead = async (announcementId: string) => {
    if (!userProfile?.id) return;
    
    try {
      await markAnnouncementAsRead(announcementId, userProfile.id);
      // Update local state
      setAnnouncements(prev => prev.map(a => 
        a.id === announcementId 
          ? { ...a, readBy: [...(a.readBy || []), userProfile.id] }
          : a
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Error marking as read:', err);
      throw err;
    }
  };

  const getStats = async () => {
    if (!userProfile?.id) return null;
    
    try {
      const stats = await getAnnouncementStats(userProfile.id);
      return stats;
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      return null;
    }
  };

  return {
    announcements,
    loading,
    error,
    unreadCount,
    fetchAnnouncements,
    addAnnouncement,
    updateAnnouncementData,
    removeAnnouncement,
    markAsRead,
    getStats
  };
};
