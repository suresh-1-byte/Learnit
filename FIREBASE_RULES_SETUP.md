# Firebase Security Rules Setup Guide

This guide will help you configure Firestore and Storage security rules for the LearnIT platform.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created and configured
- Admin access to Firebase Console

## Option 1: Deploy via Firebase CLI (Recommended)

### Step 1: Login to Firebase

```bash
firebase login
```

### Step 2: Initialize Firebase in Your Project

```bash
firebase init
```

Select:
- **Firestore**: Configure security rules and indexes files
- **Storage**: Configure security rules

### Step 3: Use Existing Rules Files

The project already includes:
- `firestore.rules` - Firestore security rules
- `storage.rules` - Storage security rules

### Step 4: Deploy Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Or deploy both at once
firebase deploy --only firestore:rules,storage:rules
```

## Option 2: Manual Setup via Firebase Console

If you prefer to configure rules manually through the Firebase Console:

### Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **learnit-c7e54**
3. Navigate to **Firestore Database** > **Rules**
4. Copy the contents of `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

### Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **learnit-c7e54**
3. Navigate to **Storage** > **Rules**
4. Copy the contents of `storage.rules` file
5. Paste into the rules editor
6. Click **Publish**

## Security Rules Overview

### Firestore Rules Features

✅ **Authentication Required**: All operations require authentication
✅ **Role-Based Access Control**: Different permissions for mentor, student, admin
✅ **Owner Checks**: Users can only modify their own data (with exceptions)
✅ **Resource Protection**: Mentors can only delete/update their own classes, assignments, etc.

### Storage Rules Features

✅ **Authentication Required**: All uploads require authentication
✅ **File Size Limits**: 
   - Regular files: 50MB max
   - Videos: 500MB max
   - Profile images: 5MB max
✅ **Path-Based Security**: Users can only upload to their designated folders
✅ **Read Access**: Authenticated users can read uploaded files

## Firestore Indexes

Some queries require composite indexes. When you see index errors in console:

### Method 1: Auto-Create (Easiest)

1. Run the app and trigger the query that needs an index
2. Check browser console for error message
3. Click the provided link to auto-create the index
4. Wait 2-3 minutes for index to build

### Method 2: Manual Creation

Create these indexes manually in Firebase Console:

**Collection: `attendance`**
- Fields: `mentorId` (Ascending), `date` (Ascending)
- Query scope: Collection

**Collection: `assignments`**
- Fields: `mentorId` (Ascending), `createdAt` (Descending)
- Query scope: Collection

**Collection: `materials`**
- Fields: `mentorId` (Ascending), `createdAt` (Descending)
- Query scope: Collection

**Collection: `videos`**
- Fields: `mentorId` (Ascending), `createdAt` (Descending)
- Query scope: Collection

**Collection: `announcements`**
- Fields: `mentorId` (Ascending), `createdAt` (Descending)
- Query scope: Collection

**Collection: `classes`**
- Fields: `mentorId` (Ascending), `createdAt` (Descending)
- Query scope: Collection

### Method 3: Deploy via firestore.indexes.json

Create `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "attendance",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "mentorId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "assignments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "mentorId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "materials",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "mentorId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "videos",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "mentorId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "announcements",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "mentorId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "classes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "mentorId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Then deploy:

```bash
firebase deploy --only firestore:indexes
```

## Testing Rules

After deploying rules, test them:

### Test 1: Authentication Check
- Try accessing the app without logging in
- Should redirect to login page
- ✅ Pass if redirected

### Test 2: Read Access
- Login as mentor@test.com
- Navigate to Dashboard
- ✅ Pass if data loads

### Test 3: Write Access
- Try creating a new class
- ✅ Pass if class is created successfully

### Test 4: File Upload
- Try uploading a study material
- ✅ Pass if file uploads and URL is saved

### Test 5: Role-Based Access
- Login as student
- Try to create a class (should fail)
- ✅ Pass if operation is denied

## Troubleshooting

### Error: "Missing or insufficient permissions"

**Cause**: Firestore rules denying access
**Solution**: Check if:
1. User is authenticated
2. User has correct role in their profile
3. Rules are deployed correctly

### Error: "Firebase Storage: User does not have permission"

**Cause**: Storage rules denying upload
**Solution**: Check if:
1. User is authenticated
2. File path matches rules pattern
3. File size is within limits
4. Storage rules are deployed

### Error: "The query requires an index"

**Cause**: Composite index not created
**Solution**: 
1. Click the link in error message to auto-create
2. Or manually create index in Firebase Console
3. Wait 2-3 minutes for index to build

### Rules Not Taking Effect

**Solution**:
1. Clear browser cache
2. Refresh the Firebase Console
3. Verify rules are published (check timestamp)
4. Re-deploy rules if needed

## Security Best Practices

✅ **Always require authentication** for sensitive data
✅ **Use role-based access control** for different user types
✅ **Validate file sizes** to prevent abuse
✅ **Limit write access** to resource owners
✅ **Use secure custom claims** for admin operations
✅ **Monitor Firebase Console** for security alerts
✅ **Regularly review and update** rules

## Monitoring

Check rule usage in Firebase Console:

1. Go to **Firestore Database** > **Usage**
2. Monitor read/write operations
3. Check for denied requests
4. Review Security tab for alerts

## Next Steps

After setting up rules:

1. ✅ Deploy Firestore rules
2. ✅ Deploy Storage rules
3. ✅ Create required indexes
4. ✅ Test authentication
5. ✅ Test CRUD operations
6. ✅ Test file uploads
7. ✅ Monitor for errors

## Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules Documentation](https://firebase.google.com/docs/storage/security)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

## Support

If you encounter issues:
1. Check browser console for detailed error messages
2. Review Firebase Console logs
3. Verify environment variables are correct
4. Check that Firebase project is active
