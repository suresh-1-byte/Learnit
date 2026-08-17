# Learn-It Platform - API Specification

**Version:** 2.0  
**Base URL:** `https://api.learnit.com/v1`  
**Authentication:** Bearer Token (JWT)  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Colleges](#colleges)
3. [Departments](#departments)
4. [Programs](#programs)
5. [Batches](#batches)
6. [Mentors](#mentors)
7. [Students](#students)
8. [Placement Officers](#placement-officers)
9. [Companies](#companies)
10. [Certificates](#certificates)
11. [Payments](#payments)
12. [Reports](#reports)
13. [Attendance](#attendance)
14. [Assignments](#assignments)
15. [Study Materials](#study-materials)
16. [Videos](#videos)
17. [Placements](#placements)
18. [Profile](#profile)
19. [Notifications](#notifications)

---

## Authentication

### Login

**Endpoint:** `POST /auth/login`  
**Auth:** None  
**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "mentor",
      "collegeId": "uuid"
    }
  }
}
```

---

### Logout

**Endpoint:** `POST /auth/logout`  
**Auth:** Required  
**Description:** Invalidate current session

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Refresh Token

**Endpoint:** `POST /auth/refresh`  
**Auth:** None  
**Description:** Refresh access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Colleges

### List Colleges

**Endpoint:** `GET /colleges`  
**Auth:** Super Admin  
**Description:** Get list of all colleges

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `status` (string: active, inactive, suspended)
- `city` (string)
- `state` (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "colleges": [
      {
        "id": "uuid",
        "name": "ABC College",
        "code": "ABC001",
        "address": "123 Main St",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "country": "India",
        "phone": "+91-9876543210",
        "email": "info@abccollege.edu",
        "website": "https://abccollege.edu",
        "logoUrl": "https://...",
        "status": "active",
        "establishedDate": "2010-01-01",
        "totalStudents": 500,
        "totalMentors": 25,
        "totalBatches": 10,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### Create College

**Endpoint:** `POST /colleges`  
**Auth:** Super Admin  
**Description:** Create a new college

**Request Body:**
```json
{
  "name": "ABC College",
  "code": "ABC001",
  "address": "123 Main St",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "country": "India",
  "phone": "+91-9876543210",
  "email": "info@abccollege.edu",
  "website": "https://abccollege.edu",
  "establishedDate": "2010-01-01",
  "description": "A premier training institution"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ABC College",
    "code": "ABC001",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get College Details

**Endpoint:** `GET /colleges/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get detailed information about a college

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ABC College",
    "code": "ABC001",
    "address": "123 Main St",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India",
    "phone": "+91-9876543210",
    "email": "info@abccollege.edu",
    "website": "https://abccollege.edu",
    "logoUrl": "https://...",
    "status": "active",
    "establishedDate": "2010-01-01",
    "description": "A premier training institution",
    "totalStudents": 500,
    "totalMentors": 25,
    "totalBatches": 10,
    "statistics": {
      "departmentCount": 5,
      "programCount": 8,
      "activeBatches": 6,
      "totalRevenue": 5000000
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update College

**Endpoint:** `PUT /colleges/:id`  
**Auth:** Super Admin  
**Description:** Update college information

**Request Body:**
```json
{
  "name": "ABC College Updated",
  "address": "456 New St",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "phone": "+91-9876543211",
  "email": "updated@abccollege.edu",
  "website": "https://abccollege.edu",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ABC College Updated",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update College Status

**Endpoint:** `PUT /colleges/:id/status`  
**Auth:** Super Admin  
**Description:** Update college status

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "inactive",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete College

**Endpoint:** `DELETE /colleges/:id`  
**Auth:** Super Admin  
**Description:** Delete a college (cascade delete)

**Response (200):**
```json
{
  "success": true,
  "message": "College deleted successfully"
}
```

---

### Get College Statistics

**Endpoint:** `GET /colleges/:id/statistics`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get comprehensive college statistics

**Response (200):**
```json
{
  "success": true,
  "data": {
    "collegeId": "uuid",
    "departmentCount": 5,
    "programCount": 8,
    "batchCount": 10,
    "studentCount": 500,
    "mentorCount": 25,
    "activeBatches": 6,
    "completedBatches": 4,
    "totalRevenue": 5000000,
    "placementRate": 85.5,
    "attendanceRate": 92.3
  }
}
```

---

## Departments

### List Departments

**Endpoint:** `GET /departments`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get list of departments

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `collegeId` (uuid) - Super Admin only
- `status` (string: active, inactive)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "departments": [
      {
        "id": "uuid",
        "name": "Computer Science",
        "code": "CS",
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "headId": "uuid",
        "headName": "Dr. John Doe",
        "description": "Computer Science Department",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 30,
      "totalPages": 2
    }
  }
}
```

---

### Create Department

**Endpoint:** `POST /departments`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Create a new department

**Request Body:**
```json
{
  "name": "Computer Science",
  "code": "CS",
  "collegeId": "uuid",
  "headId": "uuid",
  "description": "Computer Science Department"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Computer Science",
    "code": "CS",
    "collegeId": "uuid",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Department Details

**Endpoint:** `GET /departments/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get department details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Computer Science",
    "code": "CS",
    "collegeId": "uuid",
    "collegeName": "ABC College",
    "headId": "uuid",
    "headName": "Dr. John Doe",
    "description": "Computer Science Department",
    "status": "active",
    "programCount": 5,
    "mentorCount": 10,
    "studentCount": 200,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Department

**Endpoint:** `PUT /departments/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Update department information

**Request Body:**
```json
{
  "name": "Computer Science Updated",
  "headId": "uuid",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Computer Science Updated",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete Department

**Endpoint:** `DELETE /departments/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Delete a department

**Response (200):**
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

---

## Programs

### List Programs

**Endpoint:** `GET /programs`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get list of programs

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `collegeId` (uuid) - Super Admin only
- `departmentId` (uuid)
- `status` (string: active, inactive, archived)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "programs": [
      {
        "id": "uuid",
        "name": "Full Stack Development",
        "code": "FSD001",
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "departmentId": "uuid",
        "departmentName": "Computer Science",
        "description": "Full Stack Development Program",
        "durationMonths": 6,
        "feeStructure": {
          "totalFee": 50000,
          "installments": 3
        },
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

---

### Create Program

**Endpoint:** `POST /programs`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Create a new program

**Request Body:**
```json
{
  "name": "Full Stack Development",
  "code": "FSD001",
  "collegeId": "uuid",
  "departmentId": "uuid",
  "description": "Full Stack Development Program",
  "durationMonths": 6,
  "curriculum": [
    {
      "module": "HTML/CSS",
      "duration": 2
    },
    {
      "module": "JavaScript",
      "duration": 4
    }
  ],
  "feeStructure": {
    "totalFee": 50000,
    "installments": 3
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Full Stack Development",
    "code": "FSD001",
    "collegeId": "uuid",
    "departmentId": "uuid",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Program Details

**Endpoint:** `GET /programs/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get program details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Full Stack Development",
    "code": "FSD001",
    "collegeId": "uuid",
    "collegeName": "ABC College",
    "departmentId": "uuid",
    "departmentName": "Computer Science",
    "description": "Full Stack Development Program",
    "durationMonths": 6,
    "curriculum": [
      {
        "module": "HTML/CSS",
        "duration": 2
      }
    ],
    "feeStructure": {
      "totalFee": 50000,
      "installments": 3
    },
    "status": "active",
    "batchCount": 5,
    "studentCount": 150,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Program

**Endpoint:** `PUT /programs/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Update program information

**Request Body:**
```json
{
  "name": "Full Stack Development Updated",
  "description": "Updated description",
  "durationMonths": 8,
  "feeStructure": {
    "totalFee": 60000,
    "installments": 4
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Full Stack Development Updated",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete Program

**Endpoint:** `DELETE /programs/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Delete a program

**Response (200):**
```json
{
  "success": true,
  "message": "Program deleted successfully"
}
```

---

## Batches

### List Batches

**Endpoint:** `GET /batches`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batches)  
**Description:** Get list of batches

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `collegeId` (uuid) - Super Admin only
- `programId` (uuid)
- `status` (string: upcoming, ongoing, completed, cancelled)
- `startDate` (date)
- `endDate` (date)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batches": [
      {
        "id": "uuid",
        "name": "FSD Batch 2024-01",
        "code": "FSD-2024-01",
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "programId": "uuid",
        "programName": "Full Stack Development",
        "startDate": "2024-01-15",
        "endDate": "2024-07-15",
        "capacity": 30,
        "enrolledCount": 28,
        "status": "ongoing",
        "mentorCount": 2,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 40,
      "totalPages": 2
    }
  }
}
```

---

### Create Batch

**Endpoint:** `POST /batches`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Create a new batch

**Request Body:**
```json
{
  "name": "FSD Batch 2024-01",
  "code": "FSD-2024-01",
  "collegeId": "uuid",
  "programId": "uuid",
  "startDate": "2024-01-15",
  "endDate": "2024-07-15",
  "capacity": 30,
  "schedule": {
    "days": ["Monday", "Wednesday", "Friday"],
    "time": "10:00-13:00"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "FSD Batch 2024-01",
    "code": "FSD-2024-01",
    "collegeId": "uuid",
    "programId": "uuid",
    "status": "upcoming",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Batch Details

**Endpoint:** `GET /batches/:id`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch)  
**Description:** Get batch details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "FSD Batch 2024-01",
    "code": "FSD-2024-01",
    "collegeId": "uuid",
    "collegeName": "ABC College",
    "programId": "uuid",
    "programName": "Full Stack Development",
    "departmentName": "Computer Science",
    "startDate": "2024-01-15",
    "endDate": "2024-07-15",
    "capacity": 30,
    "enrolledCount": 28,
    "status": "ongoing",
    "schedule": {
      "days": ["Monday", "Wednesday", "Friday"],
      "time": "10:00-13:00"
    },
    "mentors": [
      {
        "id": "uuid",
        "name": "John Doe",
        "role": "lead"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Batch

**Endpoint:** `PUT /batches/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Update batch information

**Request Body:**
```json
{
  "name": "FSD Batch 2024-01 Updated",
  "capacity": 35,
  "schedule": {
    "days": ["Tuesday", "Thursday", "Saturday"],
    "time": "14:00-17:00"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "FSD Batch 2024-01 Updated",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Batch Status

**Endpoint:** `PUT /batches/:id/status`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Update batch status

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete Batch

**Endpoint:** `DELETE /batches/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Delete a batch

**Response (200):**
```json
{
  "success": true,
  "message": "Batch deleted successfully"
}
```

---

### Assign Mentor to Batch

**Endpoint:** `POST /batches/:id/mentors`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Assign a mentor to a batch

**Request Body:**
```json
{
  "mentorId": "uuid",
  "role": "lead"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "batchId": "uuid",
    "mentorId": "uuid",
    "role": "lead",
    "assignedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Remove Mentor from Batch

**Endpoint:** `DELETE /batches/:id/mentors/:mentorId`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Remove a mentor from a batch

**Response (200):**
```json
{
  "success": true,
  "message": "Mentor removed from batch successfully"
}
```

---

### Get Batch Students

**Endpoint:** `GET /batches/:id/students`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch)  
**Description:** Get students enrolled in a batch

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `status` (string: active, completed, dropped, transferred)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "uuid",
        "studentId": "STU001",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+91-9876543210",
        "enrollmentDate": "2024-01-15",
        "status": "active",
        "attendancePercentage": 92.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 28,
      "totalPages": 2
    }
  }
}
```

---

## Mentors

### List Mentors

**Endpoint:** `GET /mentors`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get list of mentors

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `collegeId` (uuid) - Super Admin only
- `specialization` (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "mentors": [
      {
        "id": "uuid",
        "userId": "uuid",
        "employeeId": "EMP001",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91-9876543210",
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "qualification": "M.Tech",
        "specialization": "Full Stack Development",
        "experienceYears": 5,
        "batchCount": 3,
        "studentCount": 90,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

---

### Create Mentor

**Endpoint:** `POST /mentors`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Create a new mentor

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9876543210",
  "collegeId": "uuid",
  "employeeId": "EMP001",
  "qualification": "M.Tech",
  "specialization": "Full Stack Development",
  "experienceYears": 5,
  "bio": "Experienced full stack developer",
  "joiningDate": "2024-01-01"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "john@example.com",
    "collegeId": "uuid",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Mentor Details

**Endpoint:** `GET /mentors/:id`  
**Auth:** Super Admin, College Admin (own college), Mentor (own profile)  
**Description:** Get mentor details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "collegeId": "uuid",
    "collegeName": "ABC College",
    "qualification": "M.Tech",
    "specialization": "Full Stack Development",
    "experienceYears": 5,
    "bio": "Experienced full stack developer",
    "resumeUrl": "https://...",
    "linkedinUrl": "https://linkedin.com/...",
    "joiningDate": "2024-01-01",
    "batches": [
      {
        "id": "uuid",
        "name": "FSD Batch 2024-01",
        "role": "lead"
      }
    ],
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Mentor

**Endpoint:** `PUT /mentors/:id`  
**Auth:** Super Admin, College Admin (own college), Mentor (own profile)  
**Description:** Update mentor information

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "phone": "+91-9876543211",
  "specialization": "Full Stack & Cloud",
  "experienceYears": 6,
  "bio": "Updated bio"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe Updated",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete Mentor

**Endpoint:** `DELETE /mentors/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Delete a mentor

**Response (200):**
```json
{
  "success": true,
  "message": "Mentor deleted successfully"
}
```

---

### Get Mentor Batches

**Endpoint:** `GET /mentors/:id/batches`  
**Auth:** Super Admin, College Admin (own college), Mentor (own batches)  
**Description:** Get batches assigned to a mentor

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batches": [
      {
        "id": "uuid",
        "name": "FSD Batch 2024-01",
        "code": "FSD-2024-01",
        "programName": "Full Stack Development",
        "role": "lead",
        "status": "ongoing",
        "studentCount": 28
      }
    ]
  }
}
```

---

## Students

### List Students

**Endpoint:** `GET /students`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch students)  
**Description:** Get list of students

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `collegeId` (uuid) - Super Admin only
- `batchId` (uuid)
- `status` (string: active, inactive, suspended)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "uuid",
        "studentId": "STU001",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+91-9876543210",
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "batchId": "uuid",
        "batchName": "FSD Batch 2024-01",
        "programName": "Full Stack Development",
        "qualification": "B.Tech",
        "admissionDate": "2024-01-15",
        "attendancePercentage": 92.5,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "totalPages": 25
    }
  }
}
```

---

### Create Student

**Endpoint:** `POST /students`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Create a new student

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+91-9876543210",
  "collegeId": "uuid",
  "studentId": "STU001",
  "dateOfBirth": "2000-01-01",
  "gender": "female",
  "address": "123 Main St",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "pincode": "600001",
  "parentName": "John Smith",
  "parentPhone": "+91-9876543211",
  "emergencyContact": "+91-9876543212",
  "qualification": "B.Tech",
  "admissionDate": "2024-01-15",
  "batchId": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studentId": "STU001",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "collegeId": "uuid",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Student Details

**Endpoint:** `GET /students/:id`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch student), Student (own profile)  
**Description:** Get student details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studentId": "STU001",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+91-9876543210",
    "collegeId": "uuid",
    "collegeName": "ABC College",
    "dateOfBirth": "2000-01-01",
    "gender": "female",
    "address": "123 Main St",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600001",
    "parentName": "John Smith",
    "parentPhone": "+91-9876543211",
    "emergencyContact": "+91-9876543212",
    "qualification": "B.Tech",
    "admissionDate": "2024-01-15",
    "enrollments": [
      {
        "batchId": "uuid",
        "batchName": "FSD Batch 2024-01",
        "programName": "Full Stack Development",
        "enrollmentDate": "2024-01-15",
        "status": "active",
        "attendancePercentage": 92.5
      }
    ],
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Student

**Endpoint:** `PUT /students/:id`  
**Auth:** Super Admin, College Admin (own college), Student (own profile)  
**Description:** Update student information

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith Updated",
  "phone": "+91-9876543211",
  "address": "456 New St",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "pincode": "600002"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Jane Smith Updated",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete Student

**Endpoint:** `DELETE /students/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Delete a student

**Response (200):**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

### Enroll Student in Batch

**Endpoint:** `POST /students/:id/enrollments`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Enroll a student in a batch

**Request Body:**
```json
{
  "batchId": "uuid",
  "enrollmentDate": "2024-01-15"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studentId": "uuid",
    "batchId": "uuid",
    "enrollmentDate": "2024-01-15",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Placement Officers

### List Placement Officers

**Endpoint:** `GET /placement-officers`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get list of placement officers

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `collegeId` (uuid) - Super Admin only

**Response (200):**
```json
{
  "success": true,
  "data": {
    "placementOfficers": [
      {
        "id": "uuid",
        "userId": "uuid",
        "employeeId": "PO001",
        "name": "Robert Johnson",
        "email": "robert@example.com",
        "phone": "+91-9876543210",
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "designation": "Placement Manager",
        "department": "Training & Placement",
        "experienceYears": 8,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

---

### Create Placement Officer

**Endpoint:** `POST /placement-officers`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Create a new placement officer

**Request Body:**
```json
{
  "email": "robert@example.com",
  "password": "password123",
  "firstName": "Robert",
  "lastName": "Johnson",
  "phone": "+91-9876543210",
  "collegeId": "uuid",
  "employeeId": "PO001",
  "designation": "Placement Manager",
  "department": "Training & Placement",
  "experienceYears": 8,
  "joiningDate": "2024-01-01"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "employeeId": "PO001",
    "name": "Robert Johnson",
    "email": "robert@example.com",
    "collegeId": "uuid",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Placement Officer Details

**Endpoint:** `GET /placement-officers/:id`  
**Auth:** Super Admin, College Admin (own college), Placement Officer (own profile)  
**Description:** Get placement officer details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "employeeId": "PO001",
    "name": "Robert Johnson",
    "email": "robert@example.com",
    "phone": "+91-9876543210",
    "collegeId": "uuid",
    "collegeName": "ABC College",
    "designation": "Placement Manager",
    "department": "Training & Placement",
    "experienceYears": 8,
    "joiningDate": "2024-01-01",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Placement Officer

**Endpoint:** `PUT /placement-officers/:id`  
**Auth:** Super Admin, College Admin (own college), Placement Officer (own profile)  
**Description:** Update placement officer information

**Request Body:**
```json
{
  "firstName": "Robert",
  "lastName": "Johnson Updated",
  "phone": "+91-9876543211",
  "designation": "Senior Placement Manager",
  "experienceYears": 9
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Robert Johnson Updated",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete Placement Officer

**Endpoint:** `DELETE /placement-officers/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Delete a placement officer

**Response (200):**
```json
{
  "success": true,
  "message": "Placement officer deleted successfully"
}
```

---

## Companies

### List Companies

**Endpoint:** `GET /companies`  
**Auth:** Super Admin, College Admin, Placement Officer  
**Description:** Get list of recruiting companies

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `industry` (string)
- `status` (string: active, inactive)
- `city` (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "uuid",
        "name": "Tech Corp",
        "code": "TECH001",
        "industry": "Software",
        "website": "https://techcorp.com",
        "logoUrl": "https://...",
        "city": "Bangalore",
        "state": "Karnataka",
        "contactPerson": "John Doe",
        "contactEmail": "hr@techcorp.com",
        "contactPhone": "+91-9876543210",
        "description": "Leading software company",
        "status": "active",
        "jobCount": 5,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### Create Company

**Endpoint:** `POST /companies`  
**Auth:** Super Admin  
**Description:** Create a new company

**Request Body:**
```json
{
  "name": "Tech Corp",
  "code": "TECH001",
  "industry": "Software",
  "website": "https://techcorp.com",
  "address": "123 Tech Park",
  "city": "Bangalore",
  "state": "Karnataka",
  "country": "India",
  "contactPerson": "John Doe",
  "contactEmail": "hr@techcorp.com",
  "contactPhone": "+91-9876543210",
  "description": "Leading software company"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tech Corp",
    "code": "TECH001",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Company Details

**Endpoint:** `GET /companies/:id`  
**Auth:** Super Admin, College Admin, Placement Officer  
**Description:** Get company details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tech Corp",
    "code": "TECH001",
    "industry": "Software",
    "website": "https://techcorp.com",
    "logoUrl": "https://...",
    "address": "123 Tech Park",
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India",
    "contactPerson": "John Doe",
    "contactEmail": "hr@techcorp.com",
    "contactPhone": "+91-9876543210",
    "description": "Leading software company",
    "status": "active",
    "jobs": [
      {
        "id": "uuid",
        "title": "Software Engineer",
        "status": "active"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Company

**Endpoint:** `PUT /companies/:id`  
**Auth:** Super Admin  
**Description:** Update company information

**Request Body:**
```json
{
  "name": "Tech Corp Updated",
  "contactPerson": "Jane Doe",
  "contactEmail": "hr@techcorp.com",
  "contactPhone": "+91-9876543211",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tech Corp Updated",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete Company

**Endpoint:** `DELETE /companies/:id`  
**Auth:** Super Admin  
**Description:** Delete a company

**Response (200):**
```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

---

### Get Company Jobs

**Endpoint:** `GET /companies/:id/jobs`  
**Auth:** Super Admin, College Admin, Placement Officer  
**Description:** Get job postings for a company

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `status` (string: active, closed, draft)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Software Engineer",
        "description": "Job description",
        "requirements": "Job requirements",
        "salaryRange": "5-10 LPA",
        "location": "Bangalore",
        "employmentType": "full_time",
        "status": "active",
        "postedDate": "2024-01-01",
        "deadlineDate": "2024-02-01",
        "applicationCount": 25
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

## Certificates

### List Certificates

**Endpoint:** `GET /certificates`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get list of certificates

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `studentId` (uuid)
- `batchId` (uuid)
- `status` (string: issued, revoked)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "certificates": [
      {
        "id": "uuid",
        "certificateNumber": "CERT-2024-000001",
        "studentId": "uuid",
        "studentName": "Jane Smith",
        "batchId": "uuid",
        "batchName": "FSD Batch 2024-01",
        "templateId": "uuid",
        "templateName": "Course Completion",
        "issueDate": "2024-07-15",
        "expiryDate": "2027-07-15",
        "status": "issued",
        "verificationCode": "abc123...",
        "pdfUrl": "https://...",
        "createdAt": "2024-07-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### Generate Certificate

**Endpoint:** `POST /certificates`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Generate a certificate for a student

**Request Body:**
```json
{
  "studentId": "uuid",
  "batchId": "uuid",
  "templateId": "uuid",
  "issueDate": "2024-07-15",
  "expiryDate": "2027-07-15"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "certificateNumber": "CERT-2024-000001",
    "studentId": "uuid",
    "batchId": "uuid",
    "templateId": "uuid",
    "issueDate": "2024-07-15",
    "expiryDate": "2027-07-15",
    "status": "issued",
    "verificationCode": "abc123...",
    "pdfUrl": "https://...",
    "createdAt": "2024-07-15T00:00:00Z"
  }
}
```

---

### Get Certificate Details

**Endpoint:** `GET /certificates/:id`  
**Auth:** Super Admin, College Admin (own college), Student (own certificate)  
**Description:** Get certificate details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "certificateNumber": "CERT-2024-000001",
    "studentId": "uuid",
    "studentName": "Jane Smith",
    "studentEmail": "jane@example.com",
    "batchId": "uuid",
    "batchName": "FSD Batch 2024-01",
    "programName": "Full Stack Development",
    "collegeName": "ABC College",
    "templateId": "uuid",
    "templateName": "Course Completion",
    "issueDate": "2024-07-15",
    "expiryDate": "2027-07-15",
    "status": "issued",
    "verificationCode": "abc123...",
    "pdfUrl": "https://...",
    "issuedBy": "John Doe",
    "createdAt": "2024-07-15T00:00:00Z",
    "updatedAt": "2024-07-15T00:00:00Z"
  }
}
```

---

### Verify Certificate

**Endpoint:** `GET /certificates/:id/verify`  
**Auth:** None  
**Description:** Verify certificate authenticity (public endpoint)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "certificate": {
      "certificateNumber": "CERT-2024-000001",
      "studentName": "Jane Smith",
      "batchName": "FSD Batch 2024-01",
      "programName": "Full Stack Development",
      "collegeName": "ABC College",
      "issueDate": "2024-07-15",
      "expiryDate": "2027-07-15",
      "status": "issued"
    }
  }
}
```

---

### Download Certificate

**Endpoint:** `GET /certificates/:id/download`  
**Auth:** Super Admin, College Admin (own college), Student (own certificate)  
**Description:** Download certificate PDF

**Response:** Binary PDF file

---

### Revoke Certificate

**Endpoint:** `PUT /certificates/:id/revoke`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Revoke a certificate

**Request Body:**
```json
{
  "reason": "Certificate revoked due to policy violation"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "revoked",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Payments

### List Payments

**Endpoint:** `GET /payments`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get list of payments

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `search` (string)
- `studentId` (uuid)
- `collegeId` (uuid) - Super Admin only
- `batchId` (uuid)
- `status` (string: pending, completed, failed, refunded)
- `paymentDate` (date)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "uuid",
        "paymentId": "PAY-20240101-000001",
        "studentId": "uuid",
        "studentName": "Jane Smith",
        "batchId": "uuid",
        "batchName": "FSD Batch 2024-01",
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "amount": 50000,
        "paymentDate": "2024-01-15",
        "paymentMethod": "upi",
        "transactionId": "TXN123456",
        "status": "completed",
        "description": "Full course fee",
        "createdAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 200,
      "totalPages": 10
    }
  }
}
```

---

### Create Payment

**Endpoint:** `POST /payments`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Record a payment

**Request Body:**
```json
{
  "studentId": "uuid",
  "batchId": "uuid",
  "collegeId": "uuid",
  "amount": 50000,
  "paymentDate": "2024-01-15",
  "paymentMethod": "upi",
  "transactionId": "TXN123456",
  "description": "Full course fee"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "paymentId": "PAY-20240101-000001",
    "studentId": "uuid",
    "batchId": "uuid",
    "collegeId": "uuid",
    "amount": 50000,
    "status": "completed",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### Get Payment Details

**Endpoint:** `GET /payments/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get payment details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "paymentId": "PAY-20240101-000001",
    "studentId": "uuid",
    "studentName": "Jane Smith",
    "studentEmail": "jane@example.com",
    "batchId": "uuid",
    "batchName": "FSD Batch 2024-01",
    "collegeId": "uuid",
    "collegeName": "ABC College",
    "amount": 50000,
    "paymentDate": "2024-01-15",
    "paymentMethod": "upi",
    "transactionId": "TXN123456",
    "status": "completed",
    "description": "Full course fee",
    "recordedBy": "John Doe",
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### Update Payment

**Endpoint:** `PUT /payments/:id`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Update payment information

**Request Body:**
```json
{
  "status": "completed",
  "transactionId": "TXN123456",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Revenue Analytics

**Endpoint:** `GET /revenue`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get revenue analytics

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)
- `collegeId` (uuid) - Super Admin only
- `groupBy` (string: day, week, month, year)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 5000000,
    "totalPayments": 100,
    "averagePayment": 50000,
    "revenueByPaymentMethod": {
      "upi": 3000000,
      "card": 1500000,
      "bank_transfer": 500000
    },
    "revenueByCollege": [
      {
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "revenue": 3000000
      }
    ],
    "revenueTrend": [
      {
        "date": "2024-01-01",
        "revenue": 500000
      }
    ]
  }
}
```

---

## Reports

### Get College Reports

**Endpoint:** `GET /reports/colleges`  
**Auth:** Super Admin  
**Description:** Get college performance report

**Query Parameters:**
- `collegeId` (uuid, optional)
- `startDate` (date)
- `endDate` (date)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "colleges": [
      {
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "studentCount": 500,
        "mentorCount": 25,
        "batchCount": 10,
        "placementRate": 85.5,
        "revenue": 5000000
      }
    ]
  }
}
```

---

### Get Student Reports

**Endpoint:** `GET /reports/students`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get student statistics report

**Query Parameters:**
- `collegeId` (uuid) - Super Admin only
- `batchId` (uuid)
- `startDate` (date)
- `endDate` (date)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 500,
    "activeStudents": 450,
    "completedStudents": 40,
    "droppedStudents": 10,
    "averageAttendance": 92.5,
    "averageMarks": 85.0
  }
}
```

---

### Get Placement Reports

**Endpoint:** `GET /reports/placements`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get placement statistics report

**Query Parameters:**
- `collegeId` (uuid) - Super Admin only
- `startDate` (date)
- `endDate` (date)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalPlacements": 200,
    "placementRate": 85.5,
    "averagePackage": 5.5,
    "topCompanies": [
      {
        "companyName": "Tech Corp",
        "placements": 20
      }
    ],
    "placementsByRole": [
      {
        "role": "Software Engineer",
        "count": 50
      }
    ]
  }
}
```

---

### Generate Custom Report

**Endpoint:** `POST /reports/custom`  
**Auth:** Super Admin  
**Description:** Generate custom report

**Request Body:**
```json
{
  "templateId": "uuid",
  "parameters": {
    "collegeId": "uuid",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "status": "processing",
    "message": "Report generation started"
  }
}
```

---

### Export Report

**Endpoint:** `GET /reports/:id/export`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Export report

**Query Parameters:**
- `format` (string: pdf, excel, csv)

**Response:** Binary file

---

## Attendance (RBAC Enhanced)

### Mark Attendance

**Endpoint:** `POST /attendance`  
**Auth:** Mentor Only (must be assigned to the batch)  
**Description:** Mark attendance for students in a batch. Only Mentors assigned to the batch can mark attendance.

**Request Body:**
```json
{
  "batchId": "uuid",
  "date": "2024-01-15",
  "sessionId": "uuid",
  "attendance": [
    {
      "studentId": "uuid",
      "status": "present",
      "checkInTime": "09:45",
      "checkOutTime": "17:30",
      "notes": ""
    },
    {
      "studentId": "uuid",
      "status": "absent",
      "notes": "Medical leave"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "attendanceId": "ATT-2024-001",
    "batchId": "uuid",
    "date": "2024-01-15",
    "markedCount": 30,
    "presentCount": 28,
    "absentCount": 2,
    "lateCount": 0,
    "markedBy": "uuid",
    "markedAt": "2024-01-15T10:00:00Z"
  }
}
```

**Error Responses:**
- `403 Forbidden` - User is not a Mentor or not assigned to this batch
- `400 Bad Request` - Invalid attendance data or date

---

### Update Attendance

**Endpoint:** `PUT /attendance/:attendanceId`  
**Auth:** Mentor Only (must be the original marker or assigned to batch)  
**Description:** Update an existing attendance record. Only the marking Mentor or assigned Mentors can update.

**Request Body:**
```json
{
  "status": "present",
  "checkInTime": "09:50",
  "checkOutTime": "17:30",
  "notes": "Correction: Student arrived late"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attendanceId": "ATT-2024-001",
    "previousStatus": "absent",
    "newStatus": "present",
    "updatedBy": "uuid",
    "updatedAt": "2024-01-15T14:00:00Z"
  }
}
```

**Error Responses:**
- `403 Forbidden` - User is not authorized to modify this attendance
- `404 Not Found` - Attendance record not found

---

### Get Batch Attendance

**Endpoint:** `GET /attendance/batch/:batchId`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch)  
**Description:** Get attendance records for a batch. Read-only for College Admin and Super Admin.

**Query Parameters:**
- `startDate` (date, optional)
- `endDate` (date, optional)
- `studentId` (uuid, optional)
- `status` (string: present, absent, late, excused, optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batchId": "uuid",
    "batchName": "FSD Batch 2024-01",
    "mentorId": "uuid",
    "mentorName": "John Doe",
    "attendanceRecords": [
      {
        "attendanceId": "ATT-2024-001",
        "date": "2024-01-15",
        "studentId": "uuid",
        "studentName": "Jane Smith",
        "status": "present",
        "checkInTime": "09:45",
        "checkOutTime": "17:30",
        "markedBy": "John Doe",
        "markedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "summary": {
      "totalDays": 30,
      "presentDays": 28,
      "absentDays": 2,
      "lateDays": 0,
      "attendancePercentage": 93.33
    }
  }
}
```

---

### Get Student Attendance (Own)

**Endpoint:** `GET /attendance/student/me`  
**Auth:** Student Only  
**Description:** Get own attendance records. Students can only view their own attendance analytics.

**Query Parameters:**
- `batchId` (uuid, optional)
- `startDate` (date, optional)
- `endDate` (date, optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "studentId": "uuid",
    "studentName": "Jane Smith",
    "attendanceRecords": [
      {
        "date": "2024-01-15",
        "batchName": "FSD Batch 2024-01",
        "className": "React Fundamentals",
        "status": "present",
        "checkInTime": "09:45",
        "checkOutTime": "17:30"
      }
    ],
    "summary": {
      "totalClasses": 30,
      "presentClasses": 28,
      "absentClasses": 2,
      "lateClasses": 0,
      "attendancePercentage": 93.33,
      "placementEligible": true
    },
    "monthlyTrend": [
      {
        "month": "Jan",
        "attendanceRate": 93.33
      }
    ]
  }
}
```

---

### Get Student Attendance (Admin/Mentor)

**Endpoint:** `GET /attendance/student/:studentId`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch)  
**Description:** Get attendance records for a specific student. Read-only access.

**Query Parameters:**
- `batchId` (uuid, optional)
- `startDate` (date, optional)
- `endDate` (date, optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "studentId": "uuid",
    "studentName": "Jane Smith",
    "attendanceRecords": [
      {
        "date": "2024-01-15",
        "batchName": "FSD Batch 2024-01",
        "status": "present",
        "markedBy": "John Doe",
        "markedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "summary": {
      "totalDays": 30,
      "presentDays": 28,
      "absentDays": 2,
      "attendancePercentage": 93.33
    }
  }
}
```

**Error Responses:**
- `403 Forbidden` - User not authorized to view this student's attendance
- `404 Not Found` - Student not found

---

### Create Attendance Session

**Endpoint:** `POST /attendance/sessions`  
**Auth:** Mentor Only  
**Description:** Create a new attendance session for QR-based attendance marking.

**Request Body:**
```json
{
  "batchId": "uuid",
  "sessionDate": "2024-01-15",
  "startTime": "09:00",
  "endTime": "17:00"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "batchId": "uuid",
    "qrCode": "https://api.learnit.com/qr/session-uuid.png",
    "qrExpiry": "2024-01-15T18:00:00Z",
    "status": "active",
    "createdAt": "2024-01-15T08:55:00Z"
  }
}
```

---

### Close Attendance Session

**Endpoint:** `PUT /attendance/sessions/:sessionId/close`  
**Auth:** Mentor Only (session creator)  
**Description:** Close an active attendance session.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "status": "closed",
    "closedAt": "2024-01-15T17:00:00Z",
    "closedBy": "uuid"
  }
}
```

---

### Get Attendance Audit Log

**Endpoint:** `GET /attendance/audit`  
**Auth:** Super Admin Only  
**Description:** Get attendance audit log for governance and compliance monitoring.

**Query Parameters:**
- `collegeId` (uuid, optional)
- `batchId` (uuid, optional)
- `actionType` (string: marked, edited, corrected, overridden, optional)
- `startDate` (date, optional)
- `endDate` (date, optional)
- `page` (int, default: 1)
- `limit` (int, default: 50)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "auditLogs": [
      {
        "id": "uuid",
        "attendanceId": "ATT-2024-001",
        "actionType": "marked",
        "previousStatus": null,
        "newStatus": "present",
        "performedBy": "John Doe",
        "performedAt": "2024-01-15T10:00:00Z",
        "ipAddress": "192.168.1.100",
        "deviceInfo": "Mozilla/5.0...",
        "reason": "Regular attendance marking"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250
    }
  }
}
```

**Error Responses:**
- `403 Forbidden` - Only Super Admin can access audit logs

---

### Override Attendance (Super Admin)

**Endpoint:** `POST /attendance/:attendanceId/override`  
**Auth:** Super Admin Only  
**Description:** Override attendance status in exceptional cases with documented justification.

**Request Body:**
```json
{
  "status": "present",
  "reason": "Medical emergency - approved exception",
  "justification": "Student provided valid medical certificate"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attendanceId": "ATT-2024-001",
    "previousStatus": "absent",
    "newStatus": "present",
    "overriddenBy": "uuid",
    "overriddenAt": "2024-01-16T09:00:00Z",
    "reason": "Medical emergency - approved exception"
  }
}
```

**Error Responses:**
- `403 Forbidden` - Only Super Admin can override attendance
- `400 Bad Request` - Missing required justification

---

### Get College Attendance Summary

**Endpoint:** `GET /attendance/college/:collegeId/summary`  
**Auth:** Super Admin, College Admin (own college)  
**Description:** Get attendance summary for a college. View-only access.

**Query Parameters:**
- `batchId` (uuid, optional)
- `departmentId` (uuid, optional)
- `startDate` (date, optional)
- `endDate` (date, optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "collegeId": "uuid",
    "collegeName": "ABC College",
    "overallAttendance": 91.5,
    "totalStudents": 240,
    "totalBatches": 8,
    "batchSummaries": [
      {
        "batchId": "uuid",
        "batchName": "FSD Batch 2024-01",
        "mentorName": "John Doe",
        "attendanceRate": 93.3,
        "totalStudents": 30,
        "presentToday": 28,
        "absentToday": 2,
        "lateToday": 0
      }
    ]
  }
}
```

---

### Export Attendance Data

**Endpoint:** `GET /attendance/export`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch)  
**Description:** Export attendance data as CSV/Excel. View-only for College Admin and Super Admin.

**Query Parameters:**
- `batchId` (uuid, optional)
- `studentId` (uuid, optional)
- `startDate` (date, required)
- `endDate` (date, required)
- `format` (string: csv, xlsx, default: csv)

**Response (200):**
Returns file download with appropriate Content-Type header.

---

### Delete Attendance (Soft Delete)

**Endpoint:** `DELETE /attendance/:attendanceId`  
**Auth:** Mentor Only (original marker)  
**Description:** Soft delete an attendance record. Only the original marking Mentor can delete.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attendanceId": "ATT-2024-001",
    "deletedAt": "2024-01-16T10:00:00Z",
    "deletedBy": "uuid"
  }
}
```

**Error Responses:**
- `403 Forbidden` - User is not authorized to delete this attendance
- `404 Not Found` - Attendance record not found

---

## Assignments

### List Assignments

**Endpoint:** `GET /assignments`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch)  
**Description:** Get list of assignments

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `batchId` (uuid)
- `status` (string: active, closed)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "uuid",
        "batchId": "uuid",
        "batchName": "FSD Batch 2024-01",
        "title": "React Project",
        "description": "Build a React application",
        "dueDate": "2024-02-01",
        "totalMarks": 100,
        "attachmentUrl": "https://...",
        "createdBy": "John Doe",
        "createdAt": "2024-01-15T00:00:00Z",
        "submissionCount": 25,
        "gradedCount": 20
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### Create Assignment

**Endpoint:** `POST /assignments`  
**Auth:** Mentor  
**Description:** Create a new assignment

**Request Body:**
```json
{
  "batchId": "uuid",
  "title": "React Project",
  "description": "Build a React application",
  "dueDate": "2024-02-01",
  "totalMarks": 100,
  "attachmentUrl": "https://..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "batchId": "uuid",
    "title": "React Project",
    "dueDate": "2024-02-01",
    "status": "active",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### Get Assignment Details

**Endpoint:** `GET /assignments/:id`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch)  
**Description:** Get assignment details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "batchId": "uuid",
    "batchName": "FSD Batch 2024-01",
    "title": "React Project",
    "description": "Build a React application",
    "dueDate": "2024-02-01",
    "totalMarks": 100,
    "attachmentUrl": "https://...",
    "createdBy": "John Doe",
    "createdAt": "2024-01-15T00:00:00Z",
    "submissions": [
      {
        "studentId": "uuid",
        "studentName": "Jane Smith",
        "submissionDate": "2024-01-30T10:00:00Z",
        "status": "graded",
        "marksObtained": 85,
        "feedback": "Good work"
      }
    ]
  }
}
```

---

### Submit Assignment

**Endpoint:** `POST /assignments/:id/submit`  
**Auth:** Student  
**Description:** Submit an assignment

**Request Body:**
```json
{
  "attachmentUrl": "https://..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "assignmentId": "uuid",
    "studentId": "uuid",
    "submissionDate": "2024-01-30T10:00:00Z",
    "status": "submitted"
  }
}
```

---

### Grade Assignment

**Endpoint:** `PUT /assignments/:id/grade`  
**Auth:** Mentor  
**Description:** Grade an assignment submission

**Request Body:**
```json
{
  "submissionId": "uuid",
  "marksObtained": 85,
  "feedback": "Good work"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "marksObtained": 85,
    "feedback": "Good work",
    "gradedAt": "2024-01-30T11:00:00Z",
    "status": "graded"
  }
}
```

---

## Study Materials

### List Study Materials

**Endpoint:** `GET /materials`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch), Student (enrolled batch)  
**Description:** Get list of study materials

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `batchId` (uuid)
- `search` (string)
- `fileType` (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "uuid",
        "batchId": "uuid",
        "batchName": "FSD Batch 2024-01",
        "title": "React Basics",
        "description": "Introduction to React",
        "fileUrl": "https://...",
        "fileType": "pdf",
        "fileSize": 2048000,
        "uploadedBy": "John Doe",
        "uploadedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### Upload Material

**Endpoint:** `POST /materials`  
**Auth:** Mentor  
**Description:** Upload study material

**Request Body (multipart/form-data):**
```
file: [binary]
batchId: uuid
title: string
description: string
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "batchId": "uuid",
    "title": "React Basics",
    "fileUrl": "https://...",
    "fileType": "pdf",
    "fileSize": 2048000,
    "uploadedAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### Delete Material

**Endpoint:** `DELETE /materials/:id`  
**Auth:** Mentor (own material), Super Admin  
**Description:** Delete study material

**Response (200):**
```json
{
  "success": true,
  "message": "Material deleted successfully"
}
```

---

## Videos

### List Videos

**Endpoint:** `GET /videos`  
**Auth:** Super Admin, College Admin (own college), Mentor (assigned batch), Student (enrolled batch)  
**Description:** Get list of videos

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `batchId` (uuid)
- `search` (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "uuid",
        "batchId": "uuid",
        "batchName": "FSD Batch 2024-01",
        "title": "React Tutorial - Part 1",
        "description": "Introduction to React",
        "videoUrl": "https://...",
        "thumbnailUrl": "https://...",
        "duration": 1800,
        "uploadedBy": "John Doe",
        "uploadedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### Upload Video

**Endpoint:** `POST /videos`  
**Auth:** Mentor  
**Description:** Upload video

**Request Body (multipart/form-data):**
```
video: [binary]
thumbnail: [binary]
batchId: uuid
title: string
description: string
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "batchId": "uuid",
    "title": "React Tutorial - Part 1",
    "videoUrl": "https://...",
    "thumbnailUrl": "https://...",
    "duration": 1800,
    "uploadedAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### Update Video Progress

**Endpoint:** `POST /videos/:id/progress`  
**Auth:** Student  
**Description:** Update video watch progress

**Request Body:**
```json
{
  "progressSeconds": 900,
  "completed": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "videoId": "uuid",
    "studentId": "uuid",
    "progressSeconds": 900,
    "completed": false,
    "lastWatchedAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### Delete Video

**Endpoint:** `DELETE /videos/:id`  
**Auth:** Mentor (own video), Super Admin  
**Description:** Delete video

**Response (200):**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

## Placements

### List Placement Drives

**Endpoint:** `GET /drives`  
**Auth:** Super Admin, College Admin (own college), Placement Officer  
**Description:** Get list of placement drives

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `collegeId` (uuid) - Super Admin only
- `companyId` (uuid)
- `status` (string: upcoming, ongoing, completed, cancelled)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "drives": [
      {
        "id": "uuid",
        "companyId": "uuid",
        "companyName": "Tech Corp",
        "collegeId": "uuid",
        "collegeName": "ABC College",
        "jobId": "uuid",
        "jobTitle": "Software Engineer",
        "driveDate": "2024-02-01",
        "venue": "College Auditorium",
        "status": "upcoming",
        "applicationCount": 25,
        "createdAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 30,
      "totalPages": 2
    }
  }
}
```

---

### Create Placement Drive

**Endpoint:** `POST /drives`  
**Auth:** Placement Officer, College Admin (own college)  
**Description:** Create a placement drive

**Request Body:**
```json
{
  "companyId": "uuid",
  "collegeId": "uuid",
  "jobId": "uuid",
  "driveDate": "2024-02-01",
  "venue": "College Auditorium",
  "description": "Campus recruitment drive"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "companyId": "uuid",
    "collegeId": "uuid",
    "driveDate": "2024-02-01",
    "status": "upcoming",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### List Student Applications

**Endpoint:** `GET /applications`  
**Auth:** Super Admin, College Admin (own college), Placement Officer, Student (own applications)  
**Description:** Get list of job applications

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `studentId` (uuid) - Super Admin, College Admin, Placement Officer
- `jobId` (uuid)
- `status` (string: applied, shortlisted, interview_scheduled, selected, rejected, offered)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "studentId": "uuid",
        "studentName": "Jane Smith",
        "jobId": "uuid",
        "jobTitle": "Software Engineer",
        "companyName": "Tech Corp",
        "driveId": "uuid",
        "appliedDate": "2024-01-15T00:00:00Z",
        "status": "shortlisted",
        "resumeUrl": "https://..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### Apply for Job

**Endpoint:** `POST /applications`  
**Auth:** Student  
**Description:** Apply for a job

**Request Body:**
```json
{
  "jobId": "uuid",
  "driveId": "uuid",
  "resumeUrl": "https://..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studentId": "uuid",
    "jobId": "uuid",
    "status": "applied",
    "appliedDate": "2024-01-15T00:00:00Z"
  }
}
```

---

## Profile

### Get Profile

**Endpoint:** `GET /profile`  
**Auth:** All Roles  
**Description:** Get current user profile

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+91-9876543210",
    "role": "mentor",
    "collegeId": "uuid",
    "collegeName": "ABC College",
    "profileImageUrl": "https://...",
    "status": "active",
    "lastLoginAt": "2024-01-15T10:00:00Z",
    "preferences": {
      "notificationEmail": true,
      "notificationSms": false,
      "notificationPush": true,
      "theme": "dark",
      "language": "en"
    }
  }
}
```

---

### Update Profile

**Endpoint:** `PUT /profile`  
**Auth:** All Roles  
**Description:** Update profile

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "phone": "+91-9876543211",
  "profileImageUrl": "https://..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe Updated",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### Change Password

**Endpoint:** `POST /profile/change-password`  
**Auth:** All Roles  
**Description:** Change password

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Update Notification Preferences

**Endpoint:** `PUT /profile/notifications`  
**Auth:** All Roles  
**Description:** Update notification preferences

**Request Body:**
```json
{
  "notificationEmail": true,
  "notificationSms": false,
  "notificationPush": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notificationEmail": true,
    "notificationSms": false,
    "notificationPush": true,
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

---

## Notifications

### List Notifications

**Endpoint:** `GET /notifications`  
**Auth:** All Roles  
**Description:** Get user notifications

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20)
- `isRead` (boolean)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "title": "Assignment Due",
        "message": "React Project is due tomorrow",
        "type": "warning",
        "isRead": false,
        "actionUrl": "/assignments/uuid",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    },
    "unreadCount": 10
  }
}
```

---

### Mark Notification as Read

**Endpoint:** `PUT /notifications/:id/read`  
**Auth:** All Roles  
**Description:** Mark notification as read

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isRead": true,
    "readAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### Mark All Notifications as Read

**Endpoint:** `PUT /notifications/read-all`  
**Auth:** All Roles  
**Description:** Mark all notifications as read

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing authentication token |
| FORBIDDEN | 403 | User does not have permission |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Request validation failed |
| CONFLICT | 409 | Resource conflict (e.g., duplicate) |
| INTERNAL_ERROR | 500 | Internal server error |

---

## Rate Limiting

- **Default:** 100 requests per minute per user
- **Burst:** 1000 requests per minute per IP
- **Headers:**
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Pagination

All list endpoints support pagination:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Filtering & Sorting

### Common Query Parameters

- `search`: Full-text search
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`
- `status`: Filter by status
- `dateFrom`: Start date filter
- `dateTo`: End date filter

---

## File Upload

### Supported Formats

- **Images:** jpg, jpeg, png, gif, webp (max 5MB)
- **Documents:** pdf, doc, docx (max 10MB)
- **Videos:** mp4, webm (max 500MB)

### Upload Endpoint

```
POST /upload
Content-Type: multipart/form-data
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.learnit.com/...",
    "filename": "file.pdf",
    "size": 1024000,
    "mimeType": "application/pdf"
  }
}
```

---

**End of API Specification**
