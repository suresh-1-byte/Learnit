# 🎓 Quick Guide: Add 3 Partner Colleges

## ⚡ Fastest Way: Firebase Console (5 Minutes)

### Step 1: Open Firebase Console
```
https://console.firebase.google.com
```
1. Click on project: **zentrix-learnit**
2. Click **Firestore Database** from left menu
3. Click **Start collection** (if no collections exist) or click `+` to add collection

### Step 2: Create `colleges` Collection
- Collection ID: `colleges`
- Click **Next**

---

## 📝 Copy & Paste These 3 Colleges

### College 1: Gandhi Education Trust

**Auto-generate Document ID** then add these fields:

| Field | Type | Value |
|-------|------|-------|
| name | string | Gandhi Education Trust |
| code | string | GET |
| location | string | Davangere |
| state | string | Karnataka |
| logo | string | https://via.placeholder.com/200x200.png?text=GET |
| contractStatus | string | Active |
| planTier | string | Enterprise |
| joinedDate | string | 2014-01-01 |
| totalDepartments | number | 8 |
| totalStudents | number | 1200 |
| totalMentors | number | 45 |
| placementRate | number | 82.5 |
| annualFee | number | 500000 |
| contactPerson | string | Principal - Gandhi Education Trust |
| contactEmail | string | principal@gandhi.edu.in |
| establishedYear | number | 2014 |
| description | string | Premier educational institution in Davangere focusing on engineering and management education with strong industry connections. |
| website | string | https://gandhieducationtrust.edu.in |
| accreditation | array | ["AICTE", "UGC"] |
| specializations | array | ["Engineering", "Management", "Computer Science"] |
| facilities | array | ["Modern Labs", "Library", "Sports Complex", "Hostel"] |
| createdAt | timestamp | (Click "timestamp" and use current time) |
| updatedAt | timestamp | (Click "timestamp" and use current time) |

---

### College 2: DIAMS

**Auto-generate Document ID** then add these fields:

| Field | Type | Value |
|-------|------|-------|
| name | string | Davanagere Institute of Advanced Management Studies |
| code | string | DIAMS |
| location | string | Davangere |
| state | string | Karnataka |
| logo | string | https://via.placeholder.com/200x200.png?text=DIAMS |
| contractStatus | string | Active |
| planTier | string | Professional |
| joinedDate | string | 2018-06-15 |
| totalDepartments | number | 6 |
| totalStudents | number | 800 |
| totalMentors | number | 32 |
| placementRate | number | 78.3 |
| annualFee | number | 350000 |
| contactPerson | string | Director - DIAMS |
| contactEmail | string | director@diams.edu.in |
| establishedYear | number | 2005 |
| description | string | Spurthi Educational Trust affiliated institute specializing in advanced management studies and professional courses. |
| website | string | https://diams.edu.in |
| accreditation | array | ["AICTE", "NAAC"] |
| specializations | array | ["Management", "Business Administration", "Finance"] |
| facilities | array | ["Computer Labs", "Digital Library", "Seminar Halls", "Placement Cell"] |
| createdAt | timestamp | (Click "timestamp" and use current time) |
| updatedAt | timestamp | (Click "timestamp" and use current time) |

---

### College 3: Dr. C.V. Raman Educational Association

**Auto-generate Document ID** then add these fields:

| Field | Type | Value |
|-------|------|-------|
| name | string | Dr. C.V. Raman Educational Association |
| code | string | CVREA |
| location | string | Karnataka |
| state | string | Karnataka |
| logo | string | https://via.placeholder.com/200x200.png?text=CVREA |
| contractStatus | string | Active |
| planTier | string | Enterprise |
| joinedDate | string | 2016-08-20 |
| totalDepartments | number | 10 |
| totalStudents | number | 1500 |
| totalMentors | number | 55 |
| placementRate | number | 85.7 |
| annualFee | number | 600000 |
| contactPerson | string | Registrar - Dr. C.V. Raman Educational Association |
| contactEmail | string | registrar@cvrea.edu.in |
| establishedYear | number | 2010 |
| description | string | Registered Trust dedicated to quality education in engineering, science, and technology with state-of-the-art infrastructure. |
| website | string | https://cvrea.edu.in |
| accreditation | array | ["AICTE", "NAAC", "NBA"] |
| specializations | array | ["Engineering", "Computer Science", "Electronics", "Applied Sciences"] |
| facilities | array | ["Research Centers", "Innovation Labs", "Sports Complex", "Hostel", "Auditorium"] |
| createdAt | timestamp | (Click "timestamp" and use current time) |
| updatedAt | timestamp | (Click "timestamp" and use current time) |

---

## ✅ Verification

After adding all 3 colleges, you should see:
- **3 documents** in `colleges` collection
- Each with a unique auto-generated ID
- All fields populated correctly

---

## 🎨 Upload College Logos (Optional)

### Step 1: Save Logo Images
From the image you provided, save each college logo.

### Step 2: Upload to Firebase Storage
1. Go to **Storage** in Firebase Console
2. Create folder: `college-logos`
3. Upload 3 logo images:
   - `gandhi-education-trust.png`
   - `davanagere-institute.png`
   - `cv-raman-education.png`

### Step 3: Get Download URLs
1. Click each uploaded image
2. Click "Get download URL"
3. Copy the URL

### Step 4: Update Logo Fields
Go back to Firestore and update the `logo` field for each college with the actual URL.

---

## 🚀 That's It!

Your 3 partner colleges are now in Firebase and will appear in your LearnIT platform!

**Total Time**: ~5 minutes
**Collections Created**: 1 (`colleges`)
**Documents Created**: 3

---

## 📱 Where Will They Appear?

Once added, these colleges will be visible in:
- Partner Colleges page
- College selection dropdowns
- Admin dashboards
- Reports and analytics
- Student/Mentor profiles

---

## 💡 Tips

### Adding Fields in Firebase Console
1. Click "+ Add field"
2. Enter field name
3. Select type (string, number, array, timestamp)
4. Enter value
5. Repeat for all fields

### For Array Fields
1. Select type: **array**
2. Click "+ Add item"
3. Enter each item
4. Add as many items as needed

### For Timestamp Fields
1. Select type: **timestamp**
2. Click the calendar icon
3. Choose current date and time
4. Click OK

---

**Ready?** Open Firebase Console and start adding! 🎓
