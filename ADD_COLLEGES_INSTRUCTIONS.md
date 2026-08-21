# 🎓 Add Partner Colleges to Firebase

## 3 Colleges to Add

1. **Gandhi Education Trust** (Davangere, Karnataka)
2. **Davanagere Institute of Advanced Management Studies** (DIAMS)
3. **Dr. C.V. Raman Educational Association** (CV Raman Education)

---

## Option 1: Manually Add via Firebase Console (RECOMMENDED)

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com
2. Select project: **zentrix-learnit**
3. Navigate to **Firestore Database**

### Step 2: Create `colleges` Collection
1. Click "Start collection"
2. Collection ID: `colleges`

### Step 3: Add Gandhi Education Trust
Click "Add document" and enter:

```json
{
  "name": "Gandhi Education Trust",
  "code": "GET",
  "location": "Davangere",
  "state": "Karnataka",
  "logo": "https://firebasestorage.googleapis.com/v0/b/zentrix-learnit.appspot.com/o/college-logos%2Fgandhi-education-trust.png?alt=media",
  "contractStatus": "Active",
  "planTier": "Enterprise",
  "joinedDate": "2014-01-01",
  "totalDepartments": 8,
  "totalStudents": 1200,
  "totalMentors": 45,
  "placementRate": 82.5,
  "annualFee": 500000,
  "contactPerson": "Principal - Gandhi Education Trust",
  "contactEmail": "principal@gandhi.edu.in",
  "establishedYear": 2014,
  "description": "Premier educational institution in Davangere focusing on engineering and management education with strong industry connections.",
  "website": "https://gandhieducationtrust.edu.in",
  "accreditation": ["AICTE", "UGC"],
  "specializations": ["Engineering", "Management", "Computer Science"],
  "facilities": ["Modern Labs", "Library", "Sports Complex", "Hostel"],
  "createdAt": <Timestamp>,
  "updatedAt": <Timestamp>
}
```

### Step 4: Add Davanagere Institute of Advanced Management Studies
Click "Add document" and enter:

```json
{
  "name": "Davanagere Institute of Advanced Management Studies",
  "code": "DIAMS",
  "location": "Davangere",
  "state": "Karnataka",
  "logo": "https://firebasestorage.googleapis.com/v0/b/zentrix-learnit.appspot.com/o/college-logos%2Fdavanagere-institute.png?alt=media",
  "contractStatus": "Active",
  "planTier": "Professional",
  "joinedDate": "2018-06-15",
  "totalDepartments": 6,
  "totalStudents": 800,
  "totalMentors": 32,
  "placementRate": 78.3,
  "annualFee": 350000,
  "contactPerson": "Director - DIAMS",
  "contactEmail": "director@diams.edu.in",
  "establishedYear": 2005,
  "description": "Spurthi Educational Trust affiliated institute specializing in advanced management studies and professional courses.",
  "website": "https://diams.edu.in",
  "accreditation": ["AICTE", "NAAC"],
  "specializations": ["Management", "Business Administration", "Finance"],
  "facilities": ["Computer Labs", "Digital Library", "Seminar Halls", "Placement Cell"],
  "createdAt": <Timestamp>,
  "updatedAt": <Timestamp>
}
```

### Step 5: Add Dr. C.V. Raman Educational Association
Click "Add document" and enter:

```json
{
  "name": "Dr. C.V. Raman Educational Association",
  "code": "CVREA",
  "location": "Karnataka",
  "state": "Karnataka",
  "logo": "https://firebasestorage.googleapis.com/v0/b/zentrix-learnit.appspot.com/o/college-logos%2Fcv-raman-education.png?alt=media",
  "contractStatus": "Active",
  "planTier": "Enterprise",
  "joinedDate": "2016-08-20",
  "totalDepartments": 10,
  "totalStudents": 1500,
  "totalMentors": 55,
  "placementRate": 85.7,
  "annualFee": 600000,
  "contactPerson": "Registrar - Dr. C.V. Raman Educational Association",
  "contactEmail": "registrar@cvrea.edu.in",
  "establishedYear": 2010,
  "description": "Registered Trust dedicated to quality education in engineering, science, and technology with state-of-the-art infrastructure.",
  "website": "https://cvrea.edu.in",
  "accreditation": ["AICTE", "NAAC", "NBA"],
  "specializations": ["Engineering", "Computer Science", "Electronics", "Applied Sciences"],
  "facilities": ["Research Centers", "Innovation Labs", "Sports Complex", "Hostel", "Auditorium"],
  "createdAt": <Timestamp>,
  "updatedAt": <Timestamp>
}
```

**Note**: For `createdAt` and `updatedAt` fields, select "timestamp" type and use current timestamp.

---

## Option 2: Update Script with Correct Credentials

### Step 1: Update Script
Edit `scripts/addPartnerColleges.ts` line 107:

```typescript
// Replace with your actual mentor credentials
await signInWithEmailAndPassword(auth, 'YOUR_MENTOR_EMAIL', 'YOUR_MENTOR_PASSWORD');
```

### Step 2: Run Script
```bash
npm run add-colleges
```

---

## Option 3: Temporarily Allow Anonymous Write (NOT RECOMMENDED)

### Update Firestore Rules
In `firestore.rules`, temporarily add:

```javascript
// Colleges collection (TEMPORARY - for data seeding)
match /colleges/{collegeId} {
  allow read: if isSignedIn();
  allow write: if true; // TEMPORARY - remove after adding colleges
}
```

### Deploy Rules
```bash
firebase deploy --only firestore:rules
```

### Run Script
```bash
npm run add-colleges
```

### Revert Rules
Change back to:
```javascript
allow write: if isMentor();
```

And redeploy:
```bash
firebase deploy --only firestore:rules
```

---

## Verification

After adding colleges, verify in Firebase Console:
1. Navigate to Firestore Database
2. Open `colleges` collection
3. You should see 3 documents:
   - Gandhi Education Trust (GET)
   - Davanagere Institute of Advanced Management Studies (DIAMS)
   - Dr. C.V. Raman Educational Association (CVREA)

---

## College Data Summary

| College | Code | Location | Type | Students | Placement | Est. Year |
|---------|------|----------|------|----------|-----------|-----------|
| Gandhi Education Trust | GET | Davangere | Enterprise | 1,200 | 82.5% | 2014 |
| DIAMS | DIAMS | Davangere | Professional | 800 | 78.3% | 2005 |
| Dr. C.V. Raman Educational Association | CVREA | Karnataka | Enterprise | 1,500 | 85.7% | 2010 |

**Total Students**: 3,500
**Average Placement Rate**: 82.2%

---

## Firebase Rules Already Updated

The `firestore.rules` file has been updated to include colleges collection:

```javascript
// Colleges collection
match /colleges/{collegeId} {
  // Anyone authenticated can read colleges
  allow read: if isSignedIn();
  
  // Only mentors can create/update colleges
  allow create, update: if isMentor();
  
  // Only mentors can delete colleges
  allow delete: if isMentor();
}
```

**Don't forget to deploy the rules**:
```bash
firebase deploy --only firestore:rules
```

---

## Next Steps After Adding Colleges

1. Upload college logos to Firebase Storage (if not using placeholder URLs)
2. Create departments for each college
3. Assign mentors to colleges
4. Assign students to colleges and departments
5. View colleges in the platform's "Partner Colleges" section

---

**Status**: Ready to add colleges
**Files Created**:
- ✅ `scripts/addPartnerColleges.ts` - Script to add colleges
- ✅ `firestore.rules` - Updated with colleges permissions
- ✅ `ADD_COLLEGES_INSTRUCTIONS.md` - This file
