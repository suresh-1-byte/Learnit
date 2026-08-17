# Learn-It Platform - Product Specification Document

**Version:** 2.0  
**Status:** Production-Ready  
**Last Updated:** August 5, 2026  
**Document Owner:** Lead Product Architect & CTO

---

## Executive Summary

Learn-It Platform is a multi-college Enterprise Resource Planning (ERP) system designed for training institutions with real-time placement automation. The platform provides role-based access control for four primary user roles: Super Admin, College Admin, Mentor, and Student.

### Key Objectives

- Centralized management of partner colleges, departments, programs, and batches
- Streamlined mentor-student assignment and attendance tracking
- Comprehensive assignment and study material management
- Automated certificate generation and payment processing
- Role-based data isolation ensuring security and privacy

---

## Platform Architecture

### Technology Stack

- **Frontend:** React 19, TypeScript, TailwindCSS 4, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Recommended) / MySQL
- **Authentication:** JWT-based with role-based access control (RBAC)
- **File Storage:** Cloud-based (AWS S3 / Google Cloud Storage)
- **Real-time:** WebSocket for live updates (optional)

### System Roles & Permissions

| Role | Access Scope | Primary Responsibilities |
|------|--------------|-------------------------|
| **Super Admin** | Full Platform Access | Manage all colleges, departments, programs, batches, mentors, students, placement officers, companies, certificates, payments, and system reports |
| **College Admin** | Own College Only | Manage departments, programs, batches, mentors, students, attendance, assignments, placements, and fees within their college |
| **Mentor** | Assigned Batches Only | Manage classes, schedules, student attendance, assignments, study materials, and videos for assigned batches |
| **Student** | Personal Data Only | View learning progress, classes, attendance, assignments, study materials, and videos |

---

## Module Specifications

### 1. Partner Colleges (Super Admin)

**Purpose:** Manage all partner training institutions on the platform.

**Features:**
- College registration and onboarding
- College profile management
- College status management (Active/Inactive/Suspended)
- College statistics dashboard
- College-wise data filtering

**Sub Pages:**
- College List View
- College Create/Edit Form
- College Details View
- College Statistics Dashboard

**Actions:**
- Create, Read, Update, Delete (CRUD) colleges
- Activate/Deactivate colleges
- View college statistics
- Filter students/mentors by college

**Permissions:**
- Super Admin: Full access
- Other roles: Read-only (if applicable)

**Workflow:**
1. Super Admin creates college profile
2. College admin is assigned to the college
3. College admin manages their college data
4. Super Admin can view/filter all college data

**Required APIs:**
- `GET /api/colleges` - List all colleges
- `POST /api/colleges` - Create college
- `GET /api/colleges/:id` - Get college details
- `PUT /api/colleges/:id` - Update college
- `DELETE /api/colleges/:id` - Delete college
- `GET /api/colleges/:id/statistics` - Get college statistics
- `PUT /api/colleges/:id/status` - Update college status

**Database Tables:**
```sql
colleges (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  logo_url VARCHAR(500),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  established_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
)
```

**Validation Rules:**
- College code must be unique
- Email must be valid format
- Phone must be valid format
- Name is required
- Status must be one of: active, inactive, suspended

**Notifications:**
- College created notification to Super Admin
- College status change notification to College Admin
- College deletion warning (if associated data exists)

**Audit Logs:**
- Track all CRUD operations on colleges
- Log who created/updated/deleted each college
- Log status changes with timestamps

---

### 2. Department Management (Super Admin)

**Purpose:** Manage academic departments across all colleges.

**Features:**
- Department creation and management
- Department-college association
- Department head assignment
- Department statistics

**Sub Pages:**
- Department List View (with college filter)
- Department Create/Edit Form
- Department Details View

**Actions:**
- CRUD departments
- Assign department to college
- Assign department head
- View department statistics

**Permissions:**
- Super Admin: Full access
- College Admin: View only their college's departments

**Workflow:**
1. Super Admin creates department
2. Department is assigned to a college
3. Department head is assigned
4. College Admin can view their departments

**Required APIs:**
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create department
- `GET /api/departments/:id` - Get department details
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department
- `GET /api/colleges/:college_id/departments` - Get departments by college

**Database Tables:**
```sql
departments (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  head_id UUID REFERENCES users(id),
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(college_id, code)
)
```

**Validation Rules:**
- Department code must be unique within a college
- College must exist
- Department head must be a valid user (mentor/admin)
- Name is required

**Notifications:**
- Department creation notification to College Admin
- Department head assignment notification

**Audit Logs:**
- Track all department CRUD operations
- Log department head changes

---

### 3. Training Programs (Super Admin / College Admin)

**Purpose:** Manage training programs offered by colleges.

**Features:**
- Program creation and management
- Program-department association
- Program duration and curriculum
- Program fee structure

**Sub Pages:**
- Program List View
- Program Create/Edit Form
- Program Details View
- Curriculum Management

**Actions:**
- CRUD programs
- Associate program with department
- Define program curriculum
- Set program fees

**Permissions:**
- Super Admin: Full access across all colleges
- College Admin: Full access for their college only

**Workflow:**
1. Admin creates program
2. Program is assigned to department and college
3. Curriculum is defined
4. Program is associated with batches

**Required APIs:**
- `GET /api/programs` - List all programs
- `POST /api/programs` - Create program
- `GET /api/programs/:id` - Get program details
- `PUT /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Delete program
- `GET /api/colleges/:college_id/programs` - Get programs by college
- `GET /api/departments/:department_id/programs` - Get programs by department

**Database Tables:**
```sql
programs (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  description TEXT,
  duration_months INT NOT NULL,
  curriculum JSONB,
  fee_structure JSONB,
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(college_id, code)
)
```

**Validation Rules:**
- Program code must be unique within a college
- College and department must exist
- Duration must be positive
- Fee structure must be valid JSON

**Notifications:**
- Program creation notification to College Admin
- Program update notification

**Audit Logs:**
- Track all program CRUD operations
- Log curriculum changes

---

### 4. Batch Management (Super Admin / College Admin)

**Purpose:** Manage training batches with schedules and mentor assignments.

**Features:**
- Batch creation and scheduling
- Batch-program association
- Mentor assignment to batches
- Batch capacity management
- Batch status tracking

**Sub Pages:**
- Batch List View
- Batch Create/Edit Form
- Batch Details View
- Batch Schedule View
- Batch Student List

**Actions:**
- CRUD batches
- Assign mentors to batches
- Set batch schedules
- Manage batch capacity
- Track batch status

**Permissions:**
- Super Admin: Full access across all colleges
- College Admin: Full access for their college only
- Mentor: View only assigned batches

**Workflow:**
1. Admin creates batch
2. Batch is assigned to program and college
3. Mentors are assigned to batch
4. Students are enrolled in batch
5. Batch schedule is defined

**Required APIs:**
- `GET /api/batches` - List all batches
- `POST /api/batches` - Create batch
- `GET /api/batches/:id` - Get batch details
- `PUT /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch
- `GET /api/colleges/:college_id/batches` - Get batches by college
- `GET /api/mentors/:mentor_id/batches` - Get batches by mentor
- `POST /api/batches/:id/mentors` - Assign mentor to batch
- `DELETE /api/batches/:id/mentors/:mentor_id` - Remove mentor from batch

**Database Tables:**
```sql
batches (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  capacity INT NOT NULL,
  enrolled_count INT DEFAULT 0,
  status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  schedule JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(college_id, code)
)

batch_mentors (
  id UUID PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role ENUM('lead', 'assistant') DEFAULT 'assistant',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(batch_id, mentor_id)
)
```

**Validation Rules:**
- Batch code must be unique within a college
- Start date must be before end date
- Capacity must be positive
- Program must belong to the same college
- Mentor must be valid user

**Notifications:**
- Batch creation notification to assigned mentors
- Batch schedule update notification
- Batch status change notification

**Audit Logs:**
- Track all batch CRUD operations
- Log mentor assignments
- Log schedule changes

---

### 5. Mentor Directory (Super Admin / College Admin)

**Purpose:** Manage mentor profiles and assignments.

**Features:**
- Mentor profile management
- Mentor-batch assignment
- Mentor availability tracking
- Mentor performance metrics

**Sub Pages:**
- Mentor List View (with college filter)
- Mentor Create/Edit Form
- Mentor Details View
- Mentor Assignment View

**Actions:**
- CRUD mentors
- Assign mentors to batches
- View mentor profile
- Track mentor performance

**Permissions:**
- Super Admin: Full access across all colleges
- College Admin: Full access for their college only
- Mentor: View own profile

**Workflow:**
1. Admin creates mentor profile
2. Mentor is assigned to college
3. Mentor is assigned to batches
4. Mentor manages assigned students

**Required APIs:**
- `GET /api/mentors` - List all mentors
- `POST /api/mentors` - Create mentor
- `GET /api/mentors/:id` - Get mentor details
- `PUT /api/mentors/:id` - Update mentor
- `DELETE /api/mentors/:id` - Delete mentor
- `GET /api/colleges/:college_id/mentors` - Get mentors by college

**Database Tables:**
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('super_admin', 'college_admin', 'mentor', 'student', 'placement_officer') NOT NULL,
  college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
  profile_image_url VARCHAR(500),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

mentor_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE,
  qualification VARCHAR(255),
  specialization VARCHAR(255),
  experience_years INT DEFAULT 0,
  bio TEXT,
  resume_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  joining_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Validation Rules:**
- Email must be unique
- Role must be valid
- College must exist (if assigned)
- Experience must be non-negative

**Notifications:**
- Mentor creation notification
- Mentor assignment notification
- Mentor profile update notification

**Audit Logs:**
- Track all mentor CRUD operations
- Log mentor assignments

---

### 6. Student Directory (Super Admin / College Admin)

**Purpose:** Manage student profiles and enrollments.

**Features:**
- Student profile management
- Student enrollment in batches
- Student academic tracking
- Student college filtering

**Sub Pages:**
- Student List View (with college filter)
- Student Create/Edit Form
- Student Details View
- Student Enrollment View

**Actions:**
- CRUD students
- Enroll students in batches
- View student profile
- Filter students by college

**Permissions:**
- Super Admin: Full access across all colleges
- College Admin: Full access for their college only
- Mentor: View students in assigned batches
- Student: View own profile only

**Workflow:**
1. Admin creates student profile
2. Student is assigned to college
3. Student is enrolled in batch
4. Student accesses learning materials

**Required APIs:**
- `GET /api/students` - List all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/colleges/:college_id/students` - Get students by college
- `GET /api/batches/:batch_id/students` - Get students by batch

**Database Tables:**
```sql
student_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  parent_name VARCHAR(255),
  parent_phone VARCHAR(20),
  emergency_contact VARCHAR(20),
  qualification VARCHAR(255),
  admission_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

student_enrollments (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL,
  status ENUM('active', 'completed', 'dropped', 'transferred') DEFAULT 'active',
  completion_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, batch_id)
)
```

**Validation Rules:**
- Student ID must be unique
- College must exist
- Batch must exist
- Enrollment date must be valid

**Notifications:**
- Student enrollment notification
- Student profile update notification

**Audit Logs:**
- Track all student CRUD operations
- Log enrollments

---

### 7. Campus Placement Officers (Super Admin)

**Purpose:** Manage placement officers across colleges.

**Features:**
- Placement officer profile management
- Placement officer-college assignment
- Placement officer activity tracking

**Sub Pages:**
- Placement Officer List View (with college filter)
- Placement Officer Create/Edit Form
- Placement Officer Details View

**Actions:**
- CRUD placement officers
- Assign placement officers to colleges
- View placement officer profile

**Permissions:**
- Super Admin: Full access
- College Admin: View their college's placement officers

**Workflow:**
1. Super Admin creates placement officer profile
2. Placement officer is assigned to college
3. Placement officer manages placements

**Required APIs:**
- `GET /api/placement-officers` - List all placement officers
- `POST /api/placement-officers` - Create placement officer
- `GET /api/placement-officers/:id` - Get placement officer details
- `PUT /api/placement-officers/:id` - Update placement officer
- `DELETE /api/placement-officers/:id` - Delete placement officer
- `GET /api/colleges/:college_id/placement-officers` - Get placement officers by college

**Database Tables:**
```sql
placement_officer_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  designation VARCHAR(255),
  department VARCHAR(255),
  experience_years INT DEFAULT 0,
  joining_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Validation Rules:**
- Employee ID must be unique
- College must exist
- Experience must be non-negative

**Notifications:**
- Placement officer creation notification
- Assignment notification

**Audit Logs:**
- Track all placement officer CRUD operations

---

### 8. Recruiting Companies (Super Admin)

**Purpose:** Manage companies that recruit students.

**Features:**
- Company profile management
- Company recruitment drives
- Company job postings
- Company statistics

**Sub Pages:**
- Company List View
- Company Create/Edit Form
- Company Details View
- Company Job Postings

**Actions:**
- CRUD companies
- Create job postings
- View company statistics
- Manage recruitment drives

**Permissions:**
- Super Admin: Full access
- College Admin: View companies
- Placement Officer: View and manage companies

**Workflow:**
1. Super Admin creates company profile
2. Company job postings are created
3. Recruitment drives are scheduled
4. Students apply to companies

**Required APIs:**
- `GET /api/companies` - List all companies
- `POST /api/companies` - Create company
- `GET /api/companies/:id` - Get company details
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company
- `GET /api/companies/:id/jobs` - Get company job postings

**Database Tables:**
```sql
companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  industry VARCHAR(255),
  website VARCHAR(255),
  logo_url VARCHAR(500),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

company_jobs (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  salary_range VARCHAR(100),
  location VARCHAR(255),
  employment_type ENUM('full_time', 'part_time', 'contract', 'internship') DEFAULT 'full_time',
  status ENUM('active', 'closed', 'draft') DEFAULT 'draft',
  posted_date DATE,
  deadline_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Validation Rules:**
- Company code must be unique
- Email must be valid
- Name is required

**Notifications:**
- Company creation notification
- Job posting notification

**Audit Logs:**
- Track all company CRUD operations
- Log job postings

---

### 9. Certificate Engine (Super Admin)

**Purpose:** Generate and manage student certificates.

**Features:**
- Certificate template management
- Certificate generation
- Certificate verification
- Certificate download/print

**Sub Pages:**
- Certificate List View
- Certificate Template Management
- Certificate Generation
- Certificate Verification

**Actions:**
- Create certificate templates
- Generate certificates for students
- Verify certificate authenticity
- Download/print certificates

**Permissions:**
- Super Admin: Full access
- College Admin: Generate certificates for their college
- Student: View and download own certificates

**Workflow:**
1. Admin creates certificate template
2. Certificate is generated for completed students
3. Certificate is verified
4. Student downloads certificate

**Required APIs:**
- `GET /api/certificates` - List all certificates
- `POST /api/certificates` - Generate certificate
- `GET /api/certificates/:id` - Get certificate details
- `GET /api/certificates/:id/verify` - Verify certificate
- `GET /api/certificates/:id/download` - Download certificate
- `GET /api/students/:student_id/certificates` - Get student certificates

**Database Tables:**
```sql
certificate_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

certificates (
  id UUID PRIMARY KEY,
  certificate_number VARCHAR(100) UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES certificate_templates(id),
  issue_date DATE NOT NULL,
  expiry_date DATE,
  status ENUM('issued', 'revoked') DEFAULT 'issued',
  verification_code VARCHAR(100) UNIQUE,
  pdf_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Validation Rules:**
- Certificate number must be unique
- Verification code must be unique
- Student and batch must exist
- Issue date must be valid

**Notifications:**
- Certificate generation notification to student
- Certificate revocation notification

**Audit Logs:**
- Track all certificate operations
- Log certificate generation and revocation

---

### 10. Payments & Revenue (Super Admin)

**Purpose:** Manage payments and track revenue.

**Features:**
- Payment tracking
- Revenue analytics
- Invoice generation
- Payment reconciliation

**Sub Pages:**
- Payment List View
- Payment Details View
- Revenue Dashboard
- Invoice Management

**Actions:**
- View payments
- Generate invoices
- Track revenue
- Reconcile payments

**Permissions:**
- Super Admin: Full access
- College Admin: View their college's payments

**Workflow:**
1. Payment is received
2. Payment is recorded
3. Invoice is generated
4. Revenue is tracked

**Required APIs:**
- `GET /api/payments` - List all payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id` - Update payment
- `GET /api/revenue` - Get revenue analytics
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Generate invoice

**Database Tables:**
```sql
payments (
  id UUID PRIMARY KEY,
  payment_id VARCHAR(100) UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method ENUM('cash', 'card', 'upi', 'bank_transfer', 'cheque') NOT NULL,
  transaction_id VARCHAR(100),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

invoices (
  id UUID PRIMARY KEY,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  pdf_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Validation Rules:**
- Payment ID must be unique
- Invoice number must be unique
- Amount must be positive
- Payment method must be valid

**Notifications:**
- Payment received notification
- Invoice generation notification
- Payment overdue notification

**Audit Logs:**
- Track all payment operations
- Log invoice generation

---

### 11. System Reports (Super Admin)

**Purpose:** Generate and view system-wide reports.

**Features:**
- College performance reports
- Student statistics
- Placement statistics
- Revenue reports
- Custom report generation

**Sub Pages:**
- Report Dashboard
- College Reports
- Student Reports
- Placement Reports
- Revenue Reports
- Custom Report Builder

**Actions:**
- View predefined reports
- Generate custom reports
- Export reports (PDF, Excel, CSV)
- Schedule reports

**Permissions:**
- Super Admin: Full access
- College Admin: View their college's reports

**Workflow:**
1. User selects report type
2. Report parameters are set
3. Report is generated
4. Report is exported

**Required APIs:**
- `GET /api/reports/colleges` - College performance report
- `GET /api/reports/students` - Student statistics report
- `GET /api/reports/placements` - Placement statistics report
- `GET /api/reports/revenue` - Revenue report
- `POST /api/reports/custom` - Generate custom report
- `GET /api/reports/:id/export` - Export report

**Database Tables:**
```sql
report_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  query_template TEXT NOT NULL,
  parameters JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

report_schedules (
  id UUID PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES report_templates(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  schedule_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
  recipients TEXT[],
  next_run_at TIMESTAMP,
  last_run_at TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Validation Rules:**
- Report template must be valid
- Schedule must be valid
- Recipients must be valid emails

**Notifications:**
- Scheduled report notification
- Report generation completion

**Audit Logs:**
- Track report generation
- Log report exports

---

### 12. Profile (All Roles)

**Purpose:** Manage user profile settings.

**Features:**
- Profile information management
- Password change
- Profile picture upload
- Notification preferences

**Sub Pages:**
- Profile View
- Profile Edit
- Change Password
- Notification Settings

**Actions:**
- View profile
- Update profile
- Change password
- Upload profile picture
- Manage notification preferences

**Permissions:**
- All roles: Full access to own profile only

**Workflow:**
1. User views profile
2. User updates profile information
3. Changes are saved
4. Profile is updated

**Required APIs:**
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/change-password` - Change password
- `POST /api/profile/upload-image` - Upload profile image
- `GET /api/profile/notifications` - Get notification preferences
- `PUT /api/profile/notifications` - Update notification preferences

**Database Tables:**
- Uses existing `users` table
- Additional `user_preferences` table:

```sql
user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_email BOOLEAN DEFAULT true,
  notification_sms BOOLEAN DEFAULT false,
  notification_push BOOLEAN DEFAULT true,
  theme ENUM('light', 'dark', 'system') DEFAULT 'system',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
)
```

**Validation Rules:**
- Email must be valid
- Password must meet security requirements
- Profile image must be valid format

**Notifications:**
- Profile update confirmation
- Password change confirmation

**Audit Logs:**
- Track profile updates
- Log password changes

---

## College Admin Specific Modules

### 13. Departments (College Admin)

**Purpose:** View and manage departments within own college.

**Features:**
- View department list
- Create/Edit departments
- Assign department heads
- View department statistics

**Permissions:**
- College Admin: Full access for their college only

**Required APIs:**
- `GET /api/college/departments` - Get college departments
- `POST /api/college/departments` - Create department
- `PUT /api/college/departments/:id` - Update department

---

### 14. Programs (College Admin)

**Purpose:** View and manage programs within own college.

**Features:**
- View program list
- Create/Edit programs
- Define curriculum
- Set fee structure

**Permissions:**
- College Admin: Full access for their college only

**Required APIs:**
- `GET /api/college/programs` - Get college programs
- `POST /api/college/programs` - Create program
- `PUT /api/college/programs/:id` - Update program

---

### 15. Batch & Schedule (College Admin)

**Purpose:** View and manage batches within own college.

**Features:**
- View batch list
- Create/Edit batches
- Define schedules
- Assign mentors

**Permissions:**
- College Admin: Full access for their college only

**Required APIs:**
- `GET /api/college/batches` - Get college batches
- `POST /api/college/batches` - Create batch
- `PUT /api/college/batches/:id` - Update batch

---

### 16. Attendance Hub (College Admin)

**Purpose:** View and manage attendance across batches.

**Features:**
- View attendance reports
- Generate attendance summaries
- Track attendance trends

**Permissions:**
- College Admin: Full access for their college only

**Required APIs:**
- `GET /api/college/attendance` - Get college attendance
- `GET /api/college/attendance/:batch_id` - Get batch attendance

---

### 17. Placement Portal (College Admin)

**Purpose:** Manage placement activities within college.

**Features:**
- View placement drives
- Track student placements
- Manage company partnerships

**Permissions:**
- College Admin: Full access for their college only

**Required APIs:**
- `GET /api/college/placements` - Get college placements
- `POST /api/college/placements` - Create placement drive

---

### 18. Fee Collection (College Admin)

**Purpose:** Manage fee collection within college.

**Features:**
- View fee status
- Generate invoices
- Track payments
- Send payment reminders

**Permissions:**
- College Admin: Full access for their college only

**Required APIs:**
- `GET /api/college/fees` - Get college fees
- `POST /api/college/fees/invoices` - Generate invoice

---

## Mentor Specific Modules

### 19. My Classes (Mentor)

**Purpose:** View and manage assigned classes.

**Features:**
- View assigned batches
- View class schedules
- Access student lists
- Manage class materials

**Permissions:**
- Mentor: Access only assigned batches

**Required APIs:**
- `GET /api/mentor/batches` - Get mentor's batches
- `GET /api/mentor/batches/:id/students` - Get batch students

---

### 20. Today's Schedule (Mentor)

**Purpose:** View daily class schedule.

**Features:**
- View today's classes
- View upcoming classes
- Access class details

**Permissions:**
- Mentor: Access only own schedule

**Required APIs:**
- `GET /api/mentor/schedule/today` - Get today's schedule
- `GET /api/mentor/schedule/upcoming` - Get upcoming schedule

---

### 21. Students (Mentor)

**Purpose:** View and manage students in assigned batches.

**Features:**
- View student list
- View student profiles
- Track student progress
- Mark attendance

**Permissions:**
- Mentor: Access only students in assigned batches

**Required APIs:**
- `GET /api/mentor/students` - Get mentor's students
- `GET /api/mentor/students/:id` - Get student details
- `POST /api/mentor/students/:id/attendance` - Mark attendance

---

### 22. Attendance (Mentor)

**Purpose:** Mark and view student attendance.

**Features:**
- Mark daily attendance
- View attendance history
- Generate attendance reports

**Permissions:**
- Mentor: Access only assigned batches

**Required APIs:**
- `POST /api/mentor/attendance` - Mark attendance
- `GET /api/mentor/attendance/:batch_id` - Get batch attendance

---

### 23. Assignments (Mentor)

**Purpose:** Create and manage assignments.

**Features:**
- Create assignments
- View submissions
- Grade assignments
- Provide feedback

**Permissions:**
- Mentor: Access only assigned batches

**Required APIs:**
- `POST /api/mentor/assignments` - Create assignment
- `GET /api/mentor/assignments` - Get assignments
- `PUT /api/mentor/assignments/:id/grade` - Grade assignment

---

### 24. Study Materials (Mentor)

**Purpose:** Upload and manage study materials.

**Features:**
- Upload materials
- Organize materials
- Share with students

**Permissions:**
- Mentor: Access only assigned batches

**Required APIs:**
- `POST /api/mentor/materials` - Upload material
- `GET /api/mentor/materials` - Get materials
- `DELETE /api/mentor/materials/:id` - Delete material

---

### 25. Video Library (Mentor)

**Purpose:** Manage video content for students.

**Features:**
- Upload videos
- Organize videos
- Share with students

**Permissions:**
- Mentor: Access only assigned batches

**Required APIs:**
- `POST /api/mentor/videos` - Upload video
- `GET /api/mentor/videos` - Get videos
- `DELETE /api/mentor/videos/:id` - Delete video

---

## Student Specific Modules

### 26. My Learning (Student)

**Purpose:** View learning progress and enrolled courses.

**Features:**
- View enrolled batches
- Track progress
- View completed courses

**Permissions:**
- Student: Access only own data

**Required APIs:**
- `GET /api/student/batches` - Get student's batches
- `GET /api/student/progress` - Get learning progress

---

### 27. Today's Classes (Student)

**Purpose:** View daily class schedule.

**Features:**
- View today's classes
- View upcoming classes
- Join live classes

**Permissions:**
- Student: Access only own schedule

**Required APIs:**
- `GET /api/student/schedule/today` - Get today's schedule
- `GET /api/student/schedule/upcoming` - Get upcoming schedule

---

### 28. Attendance (Student)

**Purpose:** View personal attendance record.

**Features:**
- View attendance history
- View attendance percentage
- View attendance details

**Permissions:**
- Student: Access only own data

**Required APIs:**
- `GET /api/student/attendance` - Get attendance record

---

### 29. Assignments (Student)

**Purpose:** View and submit assignments.

**Features:**
- View assignments
- Submit assignments
- View grades
- View feedback

**Permissions:**
- Student: Access only own data

**Required APIs:**
- `GET /api/student/assignments` - Get assignments
- `POST /api/student/assignments/:id/submit` - Submit assignment
- `GET /api/student/assignments/:id/feedback` - Get feedback

---

### 30. Study Materials (Student)

**Purpose:** Access study materials.

**Features:**
- View materials
- Download materials
- Search materials

**Permissions:**
- Student: Access only materials from enrolled batches

**Required APIs:**
- `GET /api/student/materials` - Get study materials
- `GET /api/student/materials/:id` - Get material details

---

### 31. Video Library (Student)

**Purpose:** Access video content.

**Features:**
- View videos
- Search videos
- Track video progress

**Permissions:**
- Student: Access only videos from enrolled batches

**Required APIs:**
- `GET /api/student/videos` - Get videos
- `GET /api/student/videos/:id` - Get video details
- `POST /api/student/videos/:id/progress` - Update progress

---

## Database Schema Summary

### Core Tables

1. **users** - User accounts and authentication
2. **user_preferences** - User settings and preferences
3. **colleges** - Partner colleges
4. **departments** - Academic departments
5. **programs** - Training programs
6. **batches** - Training batches
7. **batch_mentors** - Mentor-batch assignments
8. **mentor_profiles** - Mentor specific details
9. **student_profiles** - Student specific details
10. **student_enrollments** - Student-batch enrollments
11. **placement_officer_profiles** - Placement officer details
12. **companies** - Recruiting companies
13. **company_jobs** - Company job postings
14. **certificate_templates** - Certificate templates
15. **certificates** - Issued certificates
16. **payments** - Payment records
17. **invoices** - Invoice records
18. **report_templates** - Report templates
19. **report_schedules** - Scheduled reports

### Additional Tables (for completeness)

20. **attendance_records** - Attendance tracking
21. **assignments** - Assignment details
22. **assignment_submissions** - Student submissions
23. **study_materials** - Study material files
24. **videos** - Video content
25. **placement_drives** - Placement drive events
26. **student_applications** - Job applications
27. **notifications** - System notifications
28. **audit_logs** - System audit trail

---

## API Architecture

### Authentication

All API endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Response Format

Standard API response format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": []
}
```

### Error Handling

Standard error codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Rate Limiting

- 100 requests per minute per user
- 1000 requests per minute per IP

---

## UI/UX Requirements

### Design Principles

- **Minimal Navigation:** Clean, focused navigation
- **Card-Based Design:** Information presented in cards
- **Table Views:** Data displayed in sortable, filterable tables
- **Search & Filters:** Global search and per-module filters
- **Pagination:** All lists paginated (default: 20 items per page)
- **Bulk Actions:** Select multiple items for batch operations
- **Responsive:** Mobile-first design
- **Dark Mode:** System-wide dark mode support
- **Accessibility:** WCAG 2.1 AA compliant

### Page Types

1. **Dashboard Pages:** Overview with key metrics and charts
2. **List Pages:** Table view with search, filters, pagination
3. **Create Pages:** Form for creating new records
4. **Edit Pages:** Form for editing existing records
5. **Detail Pages:** Comprehensive view of single record
6. **Filter Pages:** Advanced filtering interface

### States to Handle

- **Loading States:** Skeleton loaders, spinners
- **Empty States:** No data illustrations, call-to-action
- **Success States:** Success messages, confirmations
- **Error States:** Error messages, retry options
- **Permission Denied:** Access denied screens
- **No Internet:** Offline detection and messaging
- **Session Expired:** Auto-logout with notification
- **Validation Errors:** Form-level and field-level errors

---

## Security Requirements

### Authentication

- JWT-based authentication
- Token expiration: 24 hours
- Refresh token: 7 days
- Password hashing: bcrypt
- Multi-factor authentication (optional)

### Authorization

- Role-based access control (RBAC)
- College-level data isolation
- Batch-level access for mentors
- Personal data access for students

### Data Protection

- Encryption at rest
- Encryption in transit (HTTPS)
- PII data masking
- GDPR compliance (if applicable)

### Audit Trail

- Log all CRUD operations
- Log authentication events
- Log permission changes
- Retain logs for 1 year

---

## Performance Requirements

### Response Times

- API response: < 200ms (p95)
- Page load: < 2 seconds
- Dashboard load: < 3 seconds
- Report generation: < 30 seconds

### Scalability

- Support 10,000+ concurrent users
- Support 100+ colleges
- Support 100,000+ students
- Horizontal scaling capability

---

## Deployment Requirements

### Environments

- **Development:** Local development setup
- **Staging:** Pre-production testing
- **Production:** Live production environment

### Infrastructure

- **Application:** Cloud hosting (AWS/GCP/Azure)
- **Database:** Managed database service
- **Storage:** Object storage for files
- **CDN:** Content delivery for static assets
- **Monitoring:** Application performance monitoring
- **Logging:** Centralized logging

### Backup Strategy

- Daily database backups
- 30-day retention
- Point-in-time recovery
- Disaster recovery plan

---

## Testing Requirements

### Unit Testing

- All business logic
- API endpoints
- Utility functions
- Target coverage: 80%

### Integration Testing

- API integration
- Database operations
- Third-party services

### E2E Testing

- Critical user flows
- Authentication flow
- CRUD operations
- Payment flow

### Performance Testing

- Load testing
- Stress testing
- API performance testing

---

## Consistency Audit Checklist

### Dashboard
- [x] Navigation updated for all roles
- [ ] Dashboard pages created for each role
- [ ] Metrics and KPIs defined
- [ ] Charts and visualizations implemented

### Permissions
- [x] Role definitions updated
- [ ] Permission middleware implemented
- [ ] College-level isolation enforced
- [ ] Batch-level access for mentors
- [ ] Personal data access for students

### Backend
- [ ] API endpoints implemented
- [ ] Authentication middleware
- [ ] Authorization middleware
- [ ] Validation middleware
- [ ] Error handling implemented

### Database
- [ ] Schema created/migrated
- [ ] Relationships defined
- [ ] Indexes created
- [ ] Constraints enforced
- [ ] Seed data prepared

### APIs
- [ ] REST endpoints documented
- [ ] Request/response schemas defined
- [ ] Error codes standardized
- [ ] Rate limiting implemented
- [ ] API versioning strategy

### Navigation
- [x] Sidebar navigation updated
- [ ] Breadcrumbs implemented
- [ ] Search functionality
- [ ] Quick actions

### Reports
- [ ] Report templates created
- [ ] Report generation logic
- [ ] Export functionality
- [ ] Scheduling system

### Notifications
- [ ] Notification system
- [ ] Email templates
- [ ] In-app notifications
- [ ] Notification preferences

### Audit Logs
- [ ] Audit log model
- [ ] Logging middleware
- [ ] Log viewer
- [ ] Log export

---

## Next Steps

1. **Phase 1:** Core Infrastructure
   - Database setup
   - Authentication system
   - Basic API structure

2. **Phase 2:** Super Admin Modules
   - Colleges, Departments, Programs
   - Batches, Mentors, Students
   - Companies, Certificates, Payments

3. **Phase 3:** College Admin Modules
   - Department, Program, Batch management
   - Attendance, Assignments, Placements
   - Fee collection

4. **Phase 4:** Mentor Modules
   - Classes, Schedule, Students
   - Attendance, Assignments, Materials
   - Video library

5. **Phase 5:** Student Modules
   - Learning, Classes, Attendance
   - Assignments, Materials, Videos

6. **Phase 6:** Reports & Analytics
   - System reports
   - Custom reports
   - Analytics dashboard

7. **Phase 7:** Testing & Deployment
   - Unit testing
   - Integration testing
   - E2E testing
   - Production deployment

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 2.0 | Aug 5, 2026 | Complete restructure based on new requirements | Lead Product Architect |
| 1.0 | Previous | Initial version | - |

---

**End of Document**
