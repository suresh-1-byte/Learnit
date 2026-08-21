# 🎓 Partner Colleges Setup

## Status: Ready to Add

I've prepared everything needed to add the 3 partner colleges to your LearnIT platform.

---

## 📋 3 Colleges to Add

### 1. Gandhi Education Trust
- **Code**: GET
- **Location**: Davangere, Karnataka
- **Established**: 2014
- **Type**: Enterprise (Davangere • Est. 2014)
- **Students**: 1,200
- **Placement Rate**: 82.5%
- **Departments**: 8
- **Mentors**: 45

### 2. Davanagere Institute of Advanced Management Studies (DIAMS)
- **Code**: DIAMS
- **Location**: Davangere, Karnataka
- **Established**: 2005
- **Type**: Professional (Spurthi Educational Trust)
- **Students**: 800
- **Placement Rate**: 78.3%
- **Departments**: 6
- **Mentors**: 32

### 3. Dr. C.V. Raman Educational Association
- **Code**: CVREA
- **Location**: Karnataka
- **Established**: 2010
- **Type**: Enterprise (Registered Trust)
- **Students**: 1,500
- **Placement Rate**: 85.7%
- **Departments**: 10
- **Mentors**: 55

---

## 📊 Summary Statistics

| Metric | Value |
|--------|-------|
| Total Colleges | 3 |
| Total Students | 3,500 |
| Total Mentors | 132 |
| Average Placement Rate | 82.2% |
| Enterprise Tier | 2 colleges |
| Professional Tier | 1 college |

---

## 📁 Files Created

### 1. `scripts/addPartnerColleges.ts`
TypeScript script to automatically add colleges to Firebase. Contains:
- Firebase initialization
- Authentication logic
- 3 college data objects with complete information
- Error handling and logging

### 2. `colleges-data.json`
Clean JSON file with all college data for easy copying. Perfect for:
- Manual Firebase Console entry
- API testing
- Data verification
- Documentation

### 3. `ADD_COLLEGES_INSTRUCTIONS.md`
Comprehensive guide with 3 methods to add colleges:
- **Option 1**: Manual via Firebase Console (Recommended)
- **Option 2**: Script with mentor credentials
- **Option 3**: Temporary rule modification

### 4. `firestore.rules` (Updated)
Added colleges collection permissions:
```javascript
// Colleges collection
match /colleges/{collegeId} {
  allow read: if isSignedIn();
  allow create, update: if isMentor();
  allow delete: if isMentor();
}
```

### 5. `package.json` (Updated)
Added new script command:
```json
"add-colleges": "tsx scripts/addPartnerColleges.ts"
```

---

## 🚀 How to Add Colleges

### Method 1: Firebase Console (EASIEST - RECOMMENDED)

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com
   - Project: `zentrix-learnit`
   - Navigate to: Firestore Database

2. **Create Collection**
   - Click "Start collection"
   - Collection ID: `colleges`

3. **Add Each College**
   - Open `colleges-data.json` file
   - For each college, click "Add document"
   - Auto-ID: Let Firebase generate
   - Copy/paste fields from JSON
   - For timestamp fields, use current timestamp

4. **Verify**
   - You should see 3 documents in `colleges` collection

### Method 2: Run Script (If you have mentor credentials)

1. **Update credentials** in `scripts/addPartnerColleges.ts` line 107:
   ```typescript
   await signInWithEmailAndPassword(auth, 'your-email@example.com', 'your-password');
   ```

2. **Run script**:
   ```bash
   npm run add-colleges
   ```

3. **Verify** in Firebase Console

### Method 3: Deploy Rules & Run Script

1. **Deploy Firebase rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Temporarily allow write** (see instructions in ADD_COLLEGES_INSTRUCTIONS.md)

3. **Run script** then **revert rules**

---

## ✅ Next Steps After Adding

1. **Upload College Logos**
   - Save the 3 college logo images
   - Upload to Firebase Storage: `/college-logos/`
   - Update logo URLs in each college document

2. **Update Application**
   - Ensure the platform displays colleges correctly
   - Test partner colleges page
   - Verify filtering and search

3. **Add Departments** (Optional)
   - Create departments for each college
   - Link mentors to departments
   - Link students to departments

4. **Test Integration**
   - Check if students can see their college
   - Verify mentors can manage their college
   - Test placement statistics

---

## 🎨 College Logos

The image you provided shows these logos:
- **Gandhi Education Trust**: Red/maroon lotus flower logo
- **DIAMS**: Circular logo with books
- **Dr. C.V. Raman**: Blue shield with lamp of knowledge

Currently using placeholder images. To use actual logos:
1. Save logo images from the provided image
2. Upload to Firebase Storage
3. Update the `logo` field in each college document

---

## 📝 Data Structure

Each college document has:

```typescript
interface PartnerCollege {
  name: string;              // Full college name
  code: string;              // Short code (GET, DIAMS, CVREA)
  location: string;          // City
  state: string;             // State
  logo: string;              // URL to logo image
  contractStatus: string;    // Active/Pending/Onboarding
  planTier: string;          // Enterprise/Professional/Standard
  joinedDate: string;        // ISO date
  totalDepartments: number;  // Count
  totalStudents: number;     // Count
  totalMentors: number;      // Count
  placementRate: number;     // Percentage (0-100)
  annualFee: number;         // In rupees
  contactPerson: string;     // Primary contact name
  contactEmail: string;      // Contact email
  establishedYear: number;   // Year founded
  description: string;       // About the college
  website: string;           // College website URL
  accreditation: string[];   // Array of accreditations
  specializations: string[]; // Array of programs
  facilities: string[];      // Array of facilities
  createdAt: Timestamp;      // Firebase timestamp
  updatedAt: Timestamp;      // Firebase timestamp
}
```

---

## 🔒 Security

Firebase rules are configured to:
- ✅ Allow any authenticated user to **read** colleges
- ✅ Allow only mentors to **create/update** colleges
- ✅ Allow only mentors to **delete** colleges

This ensures data integrity while allowing proper access.

---

## 📞 Support

If you encounter any issues:
1. Check Firebase Console for errors
2. Verify firestore rules are deployed
3. Ensure mentor account has proper permissions
4. Check browser console for errors
5. Verify network connectivity

---

## 🎉 Ready to Go!

All files are prepared and ready. Choose your preferred method above and add the 3 partner colleges to your LearnIT platform!

**Files Location**:
- Scripts: `scripts/addPartnerColleges.ts`
- Data: `colleges-data.json`
- Instructions: `ADD_COLLEGES_INSTRUCTIONS.md`
- Rules: `firestore.rules`

---

**Date Prepared**: August 21, 2026
**Status**: ✅ Ready to Add Colleges
**Method**: Choose from 3 options above
