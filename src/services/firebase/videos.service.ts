/**
 * Videos/Recorded Sessions Service
 * Handles all Firestore operations for recorded video lectures
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

export interface Video {
  id: string;
  title: string;
  description?: string;
  classId: string;
  className?: string;
  mentorId: string;
  mentorName: string;
  videoUrl: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize?: number; // in bytes
  duration?: string; // e.g., "1h 30min"
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
 * Upload video file to Firebase Storage
 */
export const uploadVideoFile = async (
  file: File,
  videoId: string,
  mentorId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; name: string; size: number }> => {
  try {
    const storageRef = ref(storage, `videos/${mentorId}/${videoId}/${file.name}`);
    
    // For large files, you might want to use uploadBytesResumable for progress tracking
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return {
      url,
      name: file.name,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading video file:', error);
    throw error;
  }
};

/**
 * Upload thumbnail image
 */
export const uploadThumbnail = async (
  file: File,
  videoId: string,
  mentorId: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, `videos/${mentorId}/${videoId}/thumbnail_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw error;
  }
};

/**
 * Create a new video
 */
export const createVideo = async (
  videoData: Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'videoUrl' | 'fileName' | 'fileSize' | 'viewCount' | 'likes'>,
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
    
    // Upload video file to Storage
    const { url, name, size } = await uploadVideoFile(videoFile, docRef.id, videoData.mentorId);
    
    const updateData: any = {
      videoUrl: url,
      fileName: name,
      fileSize: size
    };
    
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
 * Update a video
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
      const { url, name, size } = await uploadVideoFile(newVideoFile, videoId, video.mentorId);
      updateData.videoUrl = url;
      updateData.fileName = name;
      updateData.fileSize = size;
      
      // Delete old video file from storage
      if (video.videoUrl) {
        try {
          const oldFileRef = ref(storage, video.videoUrl);
          await deleteObject(oldFileRef);
        } catch (error) {
          console.warn('Could not delete old video file:', error);
        }
      }
    }
    
    // Upload new thumbnail if provided
    if (newThumbnailFile) {
      const thumbnailUrl = await uploadThumbnail(newThumbnailFile, videoId, video.mentorId);
      updateData.thumbnailUrl = thumbnailUrl;
      
      // Delete old thumbnail from storage
      if (video.thumbnailUrl) {
        try {
          const oldThumbRef = ref(storage, video.thumbnailUrl);
          await deleteObject(oldThumbRef);
        } catch (error) {
          console.warn('Could not delete old thumbnail:', error);
        }
      }
    }
    
    const docRef = doc(db, VIDEOS_COLLECTION, videoId);
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

/**
 * Delete a video
 */
export const deleteVideo = async (videoId: string): Promise<void> => {
  try {
    // Get video to find file URLs
    const video = await getVideoById(videoId);
    
    if (video) {
      // Delete video file from storage
      if (video.videoUrl) {
        try {
          const fileRef = ref(storage, video.videoUrl);
          await deleteObject(fileRef);
        } catch (error) {
          console.warn('Could not delete video file:', error);
        }
      }
      
      // Delete thumbnail from storage
      if (video.thumbnailUrl) {
        try {
          const thumbRef = ref(storage, video.thumbnailUrl);
          await deleteObject(thumbRef);
        } catch (error) {
          console.warn('Could not delete thumbnail:', error);
        }
      }
    }
    
    // Delete video document
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
