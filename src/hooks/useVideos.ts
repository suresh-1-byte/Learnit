/**
 * Custom hook for managing recorded videos
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Video,
  createVideo,
  getVideosByMentor,
  getVideosByClass,
  updateVideo,
  deleteVideo,
  incrementVideoViewCount,
  likeVideo,
  searchVideos
} from '../services/firebase/videos.service';

export const useVideos = (classId?: string) => {
  const { userProfile } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos when component mounts or dependencies change
  useEffect(() => {
    if (userProfile?.id) {
      fetchVideos();
    }
  }, [userProfile?.id, classId]);

  const fetchVideos = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let fetchedVideos: Video[];
      if (classId) {
        fetchedVideos = await getVideosByClass(classId);
      } else {
        fetchedVideos = await getVideosByMentor(userProfile.id);
      }
      
      setVideos(fetchedVideos);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async (
    videoData: Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'videoUrl' | 'fileName' | 'fileSize' | 'viewCount' | 'likes'>,
    videoFile: File,
    thumbnailFile?: File
  ) => {
    try {
      setError(null);
      const videoId = await createVideo(videoData, videoFile, thumbnailFile);
      await fetchVideos(); // Refresh the list
      return videoId;
    } catch (err: any) {
      setError(err.message || 'Failed to create video');
      console.error('Error creating video:', err);
      throw err;
    }
  };

  const updateVideoData = async (
    videoId: string,
    updates: Partial<Video>,
    newVideoFile?: File,
    newThumbnailFile?: File
  ) => {
    try {
      setError(null);
      await updateVideo(videoId, updates, newVideoFile, newThumbnailFile);
      await fetchVideos(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to update video');
      console.error('Error updating video:', err);
      throw err;
    }
  };

  const removeVideo = async (videoId: string) => {
    try {
      setError(null);
      await deleteVideo(videoId);
      await fetchVideos(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to delete video');
      console.error('Error deleting video:', err);
      throw err;
    }
  };

  const trackView = async (videoId: string) => {
    try {
      await incrementVideoViewCount(videoId);
      // Update local state
      setVideos(prev => prev.map(v => 
        v.id === videoId 
          ? { ...v, viewCount: (v.viewCount || 0) + 1 }
          : v
      ));
    } catch (err: any) {
      console.error('Error tracking view:', err);
      // Don't throw error for view tracking
    }
  };

  const like = async (videoId: string) => {
    try {
      await likeVideo(videoId);
      // Update local state
      setVideos(prev => prev.map(v => 
        v.id === videoId 
          ? { ...v, likes: (v.likes || 0) + 1 }
          : v
      ));
    } catch (err: any) {
      console.error('Error liking video:', err);
      throw err;
    }
  };

  const search = async (searchTerm: string) => {
    if (!userProfile?.id) return [];
    
    try {
      setError(null);
      const results = await searchVideos(userProfile.id, searchTerm);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to search videos');
      console.error('Error searching videos:', err);
      return [];
    }
  };

  return {
    videos,
    loading,
    error,
    fetchVideos,
    addVideo,
    updateVideoData,
    removeVideo,
    trackView,
    like,
    search
  };
};
