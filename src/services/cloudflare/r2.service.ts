/**
 * Cloudflare R2 Storage Service
 * Handles video uploads and storage using Cloudflare R2
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = import.meta.env.VITE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME || 'learnit-videos';
const R2_PUBLIC_DOMAIN = import.meta.env.VITE_R2_PUBLIC_DOMAIN; // e.g., videos.zentrixlearnit.in

// Initialize S3 Client for R2 (R2 is S3-compatible)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export interface VideoUploadResult {
  videoUrl: string;
  videoKey: string;
  fileName: string;
  fileSize: number;
  duration?: number;
}

/**
 * Upload video to Cloudflare R2
 */
export const uploadVideoToR2 = async (
  file: File,
  videoId: string,
  mentorId: string,
  onProgress?: (progress: number) => void
): Promise<VideoUploadResult> => {
  try {
    // Generate unique key for R2
    const fileExtension = file.name.split('.').pop();
    const videoKey = `videos/${mentorId}/${videoId}/${Date.now()}.${fileExtension}`;

    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: videoKey,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type || 'video/mp4',
      Metadata: {
        uploadedBy: mentorId,
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
      },
    });

    await r2Client.send(uploadCommand);

    // Simulate progress (R2 SDK doesn't provide progress by default)
    if (onProgress) {
      onProgress(100);
    }

    // Construct public URL
    const videoUrl = R2_PUBLIC_DOMAIN 
      ? `https://${R2_PUBLIC_DOMAIN}/${videoKey}`
      : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${videoKey}`;

    return {
      videoUrl,
      videoKey,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (error) {
    console.error('Error uploading video to R2:', error);
    throw new Error('Failed to upload video to Cloudflare R2');
  }
};

/**
 * Get signed URL for video (for private videos)
 */
export const getVideoSignedUrl = async (
  videoKey: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: videoKey,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw new Error('Failed to generate video access URL');
  }
};

/**
 * Delete video from R2
 */
export const deleteVideoFromR2 = async (videoKey: string): Promise<void> => {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: videoKey,
    });

    await r2Client.send(deleteCommand);
  } catch (error) {
    console.error('Error deleting video from R2:', error);
    throw new Error('Failed to delete video from Cloudflare R2');
  }
};

/**
 * Upload video thumbnail to R2
 */
export const uploadThumbnailToR2 = async (
  thumbnailBlob: Blob,
  videoId: string,
  mentorId: string
): Promise<string> => {
  try {
    const thumbnailKey = `thumbnails/${mentorId}/${videoId}/thumb.jpg`;
    
    const arrayBuffer = await thumbnailBlob.arrayBuffer();
    
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: thumbnailKey,
      Body: new Uint8Array(arrayBuffer),
      ContentType: 'image/jpeg',
    });

    await r2Client.send(uploadCommand);

    const thumbnailUrl = R2_PUBLIC_DOMAIN 
      ? `https://${R2_PUBLIC_DOMAIN}/${thumbnailKey}`
      : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${thumbnailKey}`;

    return thumbnailUrl;
  } catch (error) {
    console.error('Error uploading thumbnail to R2:', error);
    throw new Error('Failed to upload thumbnail');
  }
};

/**
 * Get video metadata (duration, resolution) from video file
 */
export const getVideoMetadata = (file: File): Promise<{
  duration: number;
  width: number;
  height: number;
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({
        duration: Math.round(video.duration),
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
};

/**
 * Validate video file
 */
export const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload MP4, WebM, OGG, or MOV files.',
    };
  }

  // Check file size (max 500MB)
  const maxSize = 500 * 1024 * 1024; // 500MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 500MB.',
    };
  }

  return { valid: true };
};
