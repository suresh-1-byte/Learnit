# Student Management System - Requirements

## Overview
Production-ready student management system for College Admin to manage students at scale, replacing script-based workflows with a complete UI solution.

## User Stories

### Core CRUD Operations
1. **As a College Admin**, I want to add students manually via a form, so I can enroll individual students quickly
2. **As a College Admin**, I want to view all students in a searchable table, so I can find and review student information
3. **As a College Admin**, I want to edit student details, so I can update information when changes occur
4. **As a College Admin**, I want to delete students, so I can remove incorrect entries or graduated students

### Bulk Operations
5. **As a College Admin**, I want to upload 500+ students via CSV file, so I can handle mass enrollment efficiently
6. **As a College Admin**, I want to see upload progress and validation errors, so I know what succeeded or failed
7. **As a College Admin**, I want to download a CSV template, so I know the exact format required

### Class Management
8. **As a College Admin**, I want to assign students to classes, so students appear in mentor rosters
9. **As a College Admin**, I want to assign multiple students to a class at once, so I can batch assign
10. **As a College Admin**, I want to remove students from classes, so I can handle transfers or drops

## Features

### 1. Student Form (Manual Entry)
- **Fields**: Name, Email, Roll Number, Phone, Department, Batch, Program, Avatar URL (optional)
- **Validation**: Required fields, email format, unique roll number
- **Success**: Show confirmation, add to table immediately
- **Error Handling**: Display validation errors inline

### 2. Student Table/List View
- **Display**: All students with key info (avatar, name, roll, email, department, batch)
- **Search**: By name, roll number, or email
- **Filter**: By department, batch, program
- **Sort**: By name, roll number, created date
- **Pagination**: 50 students per page
- **Actions**: Edit and Delete buttons per row

### 3. Edit Student
- **Trigger**: Click edit button on student row
- **UI**: Same form as add, pre-filled with existing data
- **Save**: Update Firebase and refresh table
- **Cancel**: Close modal without changes

### 4. Delete Student
- **Trigger**: Click delete button
- **Confirmation**: "Are you sure? This will remove [Name] from all classes"
- **Action**: Delete from Firebase, remove from all class rosters
- **Feedback**: Success message after deletion

### 5. CSV Bulk Upload
- **Upload Button**: Prominent "Upload CSV" button
- **File Selection**: File picker for .csv files only
- **Template Download**: "Download Template" link
- **Validation**: 
  - Check headers match template
  - Validate each row (required fields, formats)
  - Check for duplicate roll numbers
- **Progress**: Show "Processing 250 of 500..."
- **Results**: 
  - Success count
  - Error list with row numbers and reasons
  - Option to download error report
- **Performance**: Handle 500+ students smoothly

### 6. Assign to Class
- **UI**: Select students (checkboxes) + Select class (dropdown) + Assign button
- **Multi-select**: Assign multiple students at once
- **Validation**: Prevent duplicate assignments
- **Feedback**: "15 students assigned to Full-Stack Dev"

### 7. Student Detail View (Optional)
- **Trigger**: Click student name/row
- **Display**: Full student info + assigned classes + attendance stats
- **Actions**: Edit, Delete, Manage Classes

## Acceptance Criteria

### Manual Add
- ✅ Form validates all required fields
- ✅ Unique roll number enforced
- ✅ Student appears in table immediately after save
- ✅ Firebase document created successfully

### CSV Upload
- ✅ Handles 500+ students without timeout
- ✅ Validates all rows before processing
- ✅ Shows clear error messages with row numbers
- ✅ Template CSV downloadable
- ✅ Progress indicator during upload
- ✅ All valid students created even if some fail

### Table View
- ✅ Loads all students from Firebase
- ✅ Search works in real-time
- ✅ Filters work independently
- ✅ Pagination shows correct counts
- ✅ Edit/Delete buttons functional

### Assign to Class
- ✅ Multi-select works smoothly
- ✅ Class dropdown shows all classes
- ✅ Assignment updates both student.classIds and class.studentIds
- ✅ Success feedback shown
- ✅ Changes reflected immediately

## Technical Requirements

### Frontend
- React components in `src/components/CollegeAdmin/`
- TypeScript for type safety
- Existing UI theme (dark/light mode support)
- Responsive design (mobile, tablet, desktop)
- File upload with drag-and-drop
- CSV parsing library (e.g., papaparse)

### Backend
- Firebase Firestore for storage
- Use existing `students.service.ts`
- Extend with bulk operations if needed
- Update class rosters when assigning students
- Batch writes for performance

### Data Model
```typescript
interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  phone: string;
  avatar?: string;
  departmentName: string;
  batchName: string;
  programTitle: string;
  classIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

### CSV Template Format
```csv
name,email,rollNumber,phone,departmentName,batchName,programTitle
Arun Kumar,arun@test.com,CS001,+91 9876543210,Computer Science,BATCH-2026-ALPHA,Full-Stack Software Engineering
Priya Sharma,priya@test.com,CS002,+91 9876543211,Computer Science,BATCH-2026-ALPHA,Full-Stack Software Engineering
```

## Non-Functional Requirements

### Performance
- CSV upload: Process 500 students in < 30 seconds
- Table load: Display 1000+ students with pagination
- Search: Results within 100ms
- Batch operations: Use Firebase batch writes (max 500 per batch)

### Usability
- Intuitive UI matching existing design
- Clear error messages
- Loading states for all async operations
- Success/failure feedback
- Keyboard shortcuts (Ctrl+S to save form, Esc to close modal)

### Security
- Firebase rules: Only college_admin and super_admin can manage students
- Validate all inputs server-side
- Prevent SQL/NoSQL injection
- Rate limiting on bulk uploads

### Reliability
- Handle network failures gracefully
- Retry failed Firebase writes
- Validate data before saving
- Rollback on batch upload failures

## Out of Scope (Future Phases)
- Student portal/dashboard
- Student authentication
- Bulk edit existing students
- Import from other systems (beyond CSV)
- Student photo upload
- Email notifications to students

## Dependencies
- ✅ Firebase SDK already installed
- ✅ `students.service.ts` already exists
- ✅ `CollegeAdminDashboard.tsx` exists (needs student tab added)
- ⚠️ Need CSV parsing library: `papaparse`
- ⚠️ Need to deploy Firestore rules for permissions

## Success Metrics
- College Admin can add 500 students in < 2 minutes via CSV
- Zero data loss during bulk uploads
- 100% validation accuracy
- Table loads < 2 seconds for 1000 students
- Edit/Delete operations < 1 second
