# Cloudflare R2 Video Storage Integration

## ✅ COMPLETED TASKS

### 1. AWS SDK Installation
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```
**Status:** ✅ Installed (122 packages added)

### 2. R2 Service Created
**File:** `src/services/cloudflare/r2.service.ts`

**Functions Implemented:**
- ✅ `uploadVideoToR2()` - Upload video files to Cloudflare R2
- ✅ `getVideoSignedUrl()` - Generate signed URLs for private video access
- ✅ `deleteVideoFromR2()` - Delete videos from R2
- ✅ `uploadThumbnailToR2()` - Upload video thumbnails
- ✅ `getVideoMetadata()` - Extract duration, width, height from video files
- ✅ `validateVideoFile()` - Validate file type and size (max 500MB)

### 3. Environment Variables Added
**Files Updated:**
- ✅ `.env` - Added R2 configuration
- ✅ `.env.example` - Added R2 configuration template

**Variables Added:**
```env
VITE_R2_ACCOUNT_ID=your_r2_account_id_here
VITE_R2_ACCESS_KEY_ID=your_r2_access_key_here
VITE_R2_SECRET_ACCESS_KEY=your_r2_secret_key_here
VITE_R2_BUCKET_NAME=learnit-videos
VITE_R2_PUBLIC_DOMAIN=videos.zentrixlearnit.in
```

### 4. Videos Service Updated
**File:** `src/services/firebase/videos.service.ts`

**Changes Made:**
- ✅ Imported R2 service functions
- ✅ Updated `Video` interface to include `videoKey` for R2 storage key
- ✅ Modified `uploadVideoFile()` to upload to Cloudflare R2 instead of Firebase Storage
- ✅ Modified `uploadThumbnail()` to upload to Cloudflare R2
- ✅ Modified `createVideo()` to use R2 upload with metadata extraction
- ✅ Modified `updateVideo()` to use R2 upload and delete old files
- ✅ Modified `deleteVideo()` to delete from R2 using videoKey
- ✅ Added video duration extraction and conversion to readable format

### 5. SuperAdminDashboard Fixed
**File:** `src/components/SuperAdmin/SuperAdminDashboard.tsx`

**Fix:** Added missing closing `</div>` tag in `renderStudentsView()` function

---

## ⏳ PENDING TASKS

### 1. Fix TypeScript Errors (38 errors in 10 files)

**Critical Errors to Fix:**

#### A. Import.meta.env Type Errors (14 errors)
**Files:**
- `src/config/firebase.ts`
- `src/services/cloudflare/r2.service.ts`

**Fix Needed:** Add type definitions for `import.meta.env`
Create `src/vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Firebase
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  
  // Cloudflare R2
  readonly VITE_R2_ACCOUNT_ID: string
  readonly VITE_R2_ACCESS_KEY_ID: string
  readonly VITE_R2_SECRET_ACCESS_KEY: string
  readonly VITE_R2_BUCKET_NAME: string
  readonly VITE_R2_PUBLIC_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

#### B. MentorDashboard Errors (7 errors)
**File:** `src/components/Mentor/MentorDashboard.tsx`

**Issues:**
1. Line 177: `createAnnouncement` doesn't exist - use `addAnnouncement` instead
2. Line 340: `userProfile?.designation` doesn't exist - use `userProfile?.title` instead
3. Line 504: `selectedClass` is not defined - needs to be declared
4. Line 509: `materialData` missing `mentorName` and `uploadedAt`
5. Line 537: `setAnnouncements` doesn't exist - should use `addAnnouncement` hook
6. Line 2239: `fetchSubmissions` return type mismatch
7. Line 2442: `m.url` doesn't exist - use `m.fileUrl` instead

#### C. Student Components Errors (8 errors)
**Files:**
- `src/components/Student/StudentAnnouncements.tsx`
- `src/components/Student/StudentAssignments.tsx`
- `src/components/Student/StudentDashboard.tsx`

**Issues:**
1. `userProfile?.classId` doesn't exist - needs to be added to UserProfile type
2. `userProfile?.batchId` doesn't exist - needs to be added to UserProfile type
3. `announcement.content` doesn't exist - use `announcement.message` instead
4. `mat.url` doesn't exist - use `mat.fileUrl` instead
5. Missing `fileUrl` and `fileName` in submission data

#### D. Other Errors
- `src/App.tsx`: Missing SuperAdminDashboard import and state variables
- `src/mockData/index.ts`: Missing `createdAt` and `updatedAt` in user profiles
- `src/hooks/useAnnouncements.ts`: `batchId` property doesn't exist
- `src/services/firebase/attendance.service.ts`: Type issues with Firestore data

### 2. Update Mentor Dashboard Video Upload UI

**File:** `src/components/Mentor/MentorDashboard.tsx`

**Required Changes:**
```typescript
// Add video upload state
const [videoTitle, setVideoTitle] = useState('');
const [videoDescription, setVideoDescription] = useState('');
const [videoFile, setVideoFile] = useState<File | null>(null);
const [uploadProgress, setUploadProgress] = useState(0);
const [isUploading, setIsUploading] = useState(false);

// Video upload handler
const handleVideoUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!videoFile || !videoTitle || !userProfile) {
    alert('Please fill all required fields');
    return;
  }

  try {
    setIsUploading(true);
    
    const videoData = {
      title: videoTitle,
      description: videoDescription,
      classId: selectedClass?.id || 'default-class',
      className: selectedClass?.name || 'General',
      mentorId: userProfile.id,
      mentorName: userProfile.displayName,
      uploadedAt: new Date().toISOString()
    };

    await addVideo(videoData, videoFile);
    
    // Reset form
    setVideoTitle('');
    setVideoDescription('');
    setVideoFile(null);
    setShowUploadVideoModal(false);
    setUploadProgress(0);
    
    alert('Video uploaded successfully!');
  } catch (error: any) {
    console.error('Error uploading video:', error);
    alert(`Failed to upload video: ${error.message}`);
  } finally {
    setIsUploading(false);
  }
};
```

### 3. Update Student Dashboard Video Player

**File:** `src/components/Student/StudentDashboard.tsx`

**Required Changes:**
- Import `useVideos()` hook
- Fetch videos using `const { videos, loading } = useVideos(userProfile?.classId)`
- Display videos in Video Library section
- Add video player component with progress tracking
- Call `trackView(videoId)` when video is played

### 4. Configure Cloudflare R2 Credentials

**Steps:**
1. Log in to Cloudflare Dashboard
2. Go to R2 Object Storage
3. Create a new bucket named `learnit-videos`
4. Generate API tokens:
   - Account ID: Found in R2 overview
   - Access Key ID: Create R2 API Token
   - Secret Access Key: Generated with API Token
5. (Optional) Set up custom domain: `videos.zentrixlearnit.in`
6. Update `.env` file with actual credentials

### 5. Add R2 Environment Variables to Vercel

**Steps:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all R2 variables:
   - `VITE_R2_ACCOUNT_ID`
   - `VITE_R2_ACCESS_KEY_ID`
   - `VITE_R2_SECRET_ACCESS_KEY`
   - `VITE_R2_BUCKET_NAME`
   - `VITE_R2_PUBLIC_DOMAIN`
3. Redeploy the application

### 6. Test Video Upload and Playback

**Testing Steps:**
1. **Mentor Portal:**
   - Login as mentor@test.com
   - Go to Video Library section
   - Click "Upload Video"
   - Select a video file (MP4, WebM, or MOV, max 500MB)
   - Enter title and description
   - Click Upload
   - Verify upload progress
   - Check video appears in library

2. **Student Portal:**
   - Login as student@test.com
   - Go to Video Library
   - Verify videos appear from mentor
   - Click play on a video
   - Verify video streams from R2
   - Verify view count increases

3. **Verify R2 Storage:**
   - Check Cloudflare R2 dashboard
   - Verify video files are stored in bucket
   - Verify correct folder structure: `videos/{mentorId}/{videoId}/`

---

## 📋 TECHNICAL DETAILS

### Video Storage Architecture

**Before (Firebase Storage):**
```
Firebase Storage
└── videos/
    └── {mentorId}/
        └── {videoId}/
            ├── video.mp4
            └── thumbnail_video.jpg
```

**After (Cloudflare R2):**
```
Cloudflare R2 Bucket: learnit-videos
├── videos/
│   └── {mentorId}/
│       └── {videoId}/
│           └── {timestamp}.mp4
└── thumbnails/
    └── {mentorId}/
        └── {videoId}/
            └── thumb.jpg
```

### Video Upload Flow

1. **Validation** → Validate file type and size (max 500MB)
2. **Metadata Extraction** → Extract duration, width, height
3. **R2 Upload** → Upload to Cloudflare R2 with progress
4. **Firestore Document** → Create video document with:
   - `videoUrl`: Public or signed URL from R2
   - `videoKey`: R2 storage key for deletion
   - `duration`: Converted to readable format (e.g., "1h 30min")
   - `fileSize`: File size in bytes
   - `fileName`: Original file name
5. **Thumbnail Upload** (optional) → Upload thumbnail to R2

### Benefits of Cloudflare R2

1. **Cost Savings** - No egress fees (vs Firebase Storage)
2. **Better Performance** - Cloudflare's global CDN
3. **Larger Files** - Up to 5GB per file (we limit to 500MB)
4. **S3 Compatible** - Standard API, easy migration
5. **Custom Domain** - Can use `videos.zentrixlearnit.in`

### File Size Limits

- **Videos:** 500MB max (configurable in `validateVideoFile()`)
- **Thumbnails:** No specific limit (typically < 5MB)
- **Supported Formats:** MP4, WebM, OGG, MOV (QuickTime)

---

## 🔧 NEXT STEPS (Priority Order)

1. ✅ **Create `src/vite-env.d.ts`** - Fix import.meta.env type errors
2. ⏳ **Fix MentorDashboard** - Fix all 7 errors
3. ⏳ **Fix Student Components** - Fix all 8 errors
4. ⏳ **Fix Other TypeScript Errors** - Fix remaining errors
5. ⏳ **Build Project** - Verify zero TypeScript errors
6. ⏳ **Configure R2 Credentials** - Get actual Cloudflare R2 credentials
7. ⏳ **Update Mentor Dashboard** - Integrate video upload UI
8. ⏳ **Update Student Dashboard** - Integrate video player
9. ⏳ **Test Locally** - Test video upload and playback
10. ⏳ **Add R2 Variables to Vercel** - Configure production environment
11. ⏳ **Deploy to Production** - Deploy and test live

---

## 📝 TESTING CHECKLIST

### Pre-Deployment Testing
- [ ] TypeScript compilation passes (0 errors)
- [ ] Video upload works in Mentor Portal
- [ ] Video appears in Student Portal
- [ ] Video playback works
- [ ] View count tracking works
- [ ] Video deletion works
- [ ] Thumbnail upload works
- [ ] File size validation works (reject > 500MB)
- [ ] File type validation works (reject non-video files)
- [ ] Duration extraction works
- [ ] Progress indicator works during upload

### Post-Deployment Testing
- [ ] Videos upload to Cloudflare R2 (check R2 dashboard)
- [ ] Videos stream from R2 custom domain
- [ ] Videos are accessible to students
- [ ] Firestore documents created correctly
- [ ] No Firebase Storage charges for videos
- [ ] CDN performance is good

---

## 🚨 IMPORTANT NOTES

1. **DO NOT deploy until all TypeScript errors are fixed**
2. **DO NOT commit R2 credentials to Git** - Use environment variables only
3. **Test with small videos first** (< 50MB) before testing 500MB limit
4. **Monitor R2 usage** - Check Cloudflare dashboard for storage and bandwidth
5. **Set up R2 bucket CORS** if needed for direct browser uploads (currently using server-side upload)
6. **Consider adding video transcoding** in the future for better streaming (HLS/DASH)

---

**Document Created:** August 20, 2026
**Status:** R2 Service Ready, Integration In Progress
**Blocked By:** TypeScript compilation errors (38 errors)
**Priority:** Fix TypeScript errors → Test locally → Deploy

