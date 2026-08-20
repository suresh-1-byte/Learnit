/**
 * Videos/Recorded Sessions Service
 * Handles all Firestore operations for recorded video lectures
 * Uses Cloudflare R2 for video storage instead of Firebase Storage
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
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import {
  uploadVideoToR2,
  deleteVideoFromR2,
  uploadThumbnailToR2,
  getVideoMetadata,
  validateVideoFile,
  type VideoUploadResult
} from '../cloudflare/r2.service';

export interface Video {
  id: string;
  title: string;
  description?: string;
  classId: string;
  className?: string;
  mentorId: string;
  mentorName: string;
  videoUrl: string;
  videoKey?: string; // R2 storage key for deletion
  thumbnailUrl?: string;
  fileName: string;
  fileSize?: number; // in bytes
  duration?: string; // e.g., "1h 30min" or number in seconds
  topic?: string;
  sessionDate?: string;
  tags?: string[];
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  likes?: number;
}

const VIDEOS_COLLECTION = 'videos';

/**
 * Upload video file to Cloudflare R2 (NOT Firebase Storage)
 */
export const uploadVideoFile = async (
  file: File,
  videoId: string,
  mentorId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; key: string; name: string; size: number; duration?: number }> => {
  try {
    // Validate video file first
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Get video metadata (duration, resolution)
    let metadata;
    try {
      metadata = await getVideoMetadata(file);
    } catch (error) {
      console.warn('Could not extract video metadata:', error);
    }

    // Upload to Cloudflare R2
    const result = await uploadVideoToR2(file, videoId, mentorId, onProgress);
    
    return {
      url: result.videoUrl,
      key: result.videoKey,
      name: result.fileName,
      size: result.fileSize,
      duration: metadata?.duration
    };
  } catch (error) {
    console.error('Error uploading video file to R2:', error);
    throw error;
  }
};

/**
 * Upload thumbnail image to Cloudflare R2
 */
export const uploadThumbnail = async (
  file: File,
  videoId: string,
  mentorId: string
): Promise<string> => {
  try {
    // Convert File to Blob
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    const thumbnailUrl = await uploadThumbnailToR2(blob, videoId, mentorId);
    return thumbnailUrl;
  } catch (error) {
    console.error('Error uploading thumbnail to R2:', error);
    throw error;
  }
};

/**
 * Create a new video (uploads to Cloudflare R2)
 */
export const createVideo = async (
  videoData: Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'videoUrl' | 'fileName' | 'fileSize' | 'viewCount' | 'likes' | 'videoKey'>,
  videoFile: File,
  thumbnailFile?: File
): Promise<string> => {
  try {
    // Create video document first to get ID
    const docRef = await addDoc(collection(db, VIDEOS_COLLECTION), {
      ...videoData,
      viewCount: 0,
      likes: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Upload video file to Cloudflare R2
    const { url, key, name, size, duration } = await uploadVideoFile(videoFile, docRef.id, videoData.mentorId);
    
    const updateData: any = {
      videoUrl: url,
      videoKey: key, // Store R2 key for deletion
      fileName: name,
      fileSize: size
    };

    // Add duration if extracted
    if (duration) {
      // Convert seconds to readable format (e.g., "1h 30min")
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      updateData.duration = hours > 0 
        ? `${hours}h ${minutes}min` 
        : `${minutes}min`;
    }
    
    // Upload thumbnail if provided
    if (thumbnailFile) {
      const thumbnailUrl = await uploadThumbnail(thumbnailFile, docRef.id, videoData.mentorId);
      updateData.thumbnailUrl = thumbnailUrl;
    }
    
    // Update document with file details
    await updateDoc(docRef, updateData);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

/**
 * Get video by ID
 */
export const getVideoById = async (videoId: string): Promise<Video | null> => {
  try {
    const docRef = doc(db, VIDEOS_COLLECTION, videoId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Video;
    }
    return null;
  } catch (error) {
    console.error('Error getting video:', error);
    throw error;
  }
};

/**
 * Get all videos for a mentor
 */
export const getVideosByMentor = async (mentorId: string): Promise<Video[]> => {
  try {
    const q = query(
      collection(db, VIDEOS_COLLECTION),
      where('mentorId', '==', mentorId)
    );
    
    const querySnapshot = await getDocs(q);
    const videos: Video[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Video);
    });
    
    // Sort in memory to avoid index requirement
    return videos.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting videos:', error);
    throw error;
  }
};

/**
 * Get videos for a class
 */
export const getVideosByClass = async (classId: string): Promise<Video[]> => {
  try {
    const q = query(
      collection(db, VIDEOS_COLLECTION),
      where('classId', '==', classId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const videos: Video[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Video);
    });
    
    return videos;
  } catch (error) {
    console.error('Error getting class videos:', error);
    throw error;
  }
};

/**
 * Update a video (uses Cloudflare R2 for video files)
 */
export const updateVideo = async (
  videoId: string,
  updates: Partial<Video>,
  newVideoFile?: File,
  newThumbnailFile?: File
): Promise<void> => {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    const video = await getVideoById(videoId);
    
    if (!video) {
      throw new Error('Video not found');
    }
    
    // Upload new video file if provided
    if (newVideoFile) {
      const { url, key, name, size, duration } = await uploadVideoFile(newVideoFile, videoId, video.mentorId);
      updateData.videoUrl = url;
      updateData.videoKey = key;
      updateData.fileName = name;
      updateData.fileSize = size;

      // Add duration if extracted
      if (duration) {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        updateData.duration = hours > 0 
          ? `${hours}h ${minutes}min` 
          : `${minutes}min`;
      }
      
      // Delete old video file from R2
      if (video.videoKey) {
        try {
          await deleteVideoFromR2(video.videoKey);
        } catch (error) {
          console.warn('Could not delete old video file from R2:', error);
        }
      }
    }
    
    // Upload new thumbnail if provided
    if (newThumbnailFile) {
      const thumbnailUrl = await uploadThumbnail(newThumbnailFile, videoId, video.mentorId);
      updateData.thumbnailUrl = thumbnailUrl;
      
      // Note: Old thumbnail cleanup can be added if needed
    }
    
    const docRef = doc(db, VIDEOS_COLLECTION, videoId);
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

/**
 * Delete a video (removes from Cloudflare R2)
 */
export const deleteVideo = async (videoId: string): Promise<void> => {
  try {
    // Get video to find file keys
    const video = await getVideoById(videoId);
    
    if (video) {
      // Delete video file from Cloudflare R2
      if (video.videoKey) {
        try {
          await deleteVideoFromR2(video.videoKey);
        } catch (error) {
          console.warn('Could not delete video file from R2:', error);
        }
      }
      
      // Note: Thumbnail deletion from R2 can be added if needed
    }
    
    // Delete video document from Firestore
    const docRef = doc(db, VIDEOS_COLLECTION, videoId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

/**
 * Increment view count for a video
 */
export const incrementVideoViewCount = async (videoId: string): Promise<void> => {
  try {
    const video = await getVideoById(videoId);
    if (video) {
      const docRef = doc(db, VIDEOS_COLLECTION, videoId);
      await updateDoc(docRef, {
        viewCount: (video.viewCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
};

/**
 * Like a video
 */
export const likeVideo = async (videoId: string): Promise<void> => {
  try {
    const video = await getVideoById(videoId);
    if (video) {
      const docRef = doc(db, VIDEOS_COLLECTION, videoId);
      await updateDoc(docRef, {
        likes: (video.likes || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error liking video:', error);
    throw error;
  }
};

/**
 * Search videos by title or tags
 */
export const searchVideos = async (
  mentorId: string,
  searchTerm: string
): Promise<Video[]> => {
  try {
    // Get all videos for mentor
    const videos = await getVideosByMentor(mentorId);
    
    // Filter by search term (case-insensitive)
    const term = searchTerm.toLowerCase();
    return videos.filter(video => 
      video.title.toLowerCase().includes(term) ||
      video.description?.toLowerCase().includes(term) ||
      video.topic?.toLowerCase().includes(term) ||
      video.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};
