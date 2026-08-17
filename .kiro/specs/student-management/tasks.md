# Student Management System - Implementation Tasks

## Phase 1: Setup & Dependencies (15 min)
- [ ] **Task 1.1**: Install papaparse for CSV parsing
  - Run: `npm install papaparse`
  - Run: `npm install --save-dev @types/papaparse`
  - Verify installation in package.json

- [ ] **Task 1.2**: Deploy Firebase security rules
  - Run: `firebase deploy --only firestore:rules`
  - OR manually update in Firebase Console
  - Test: Run `npm run generate-students` to verify permissions

- [ ] **Task 1.3**: Create useStudents custom hook
  - File: `src/hooks/useStudents.ts`
  - Functions: Load, add, update, remove students
  - Return: students array, loading, error states, CRUD functions

## Phase 2: Student Table View (45 min)
- [ ] **Task 2.1**: Add "Students" tab to CollegeAdminDashboard
  - Add tab button in navigation
  - Wire up activeTab state
  - Create placeholder content area

- [ ] **Task 2.2**: Create StudentTable component
  - File: `src/components/CollegeAdmin/StudentTable.tsx`
  - Display: Avatar, Name, Roll, Email, Department, Batch, Classes count
  - Actions: Edit and Delete buttons per row
  - Empty state: "No students yet. Add your first student!"

- [ ] **Task 2.3**: Implement search functionality
  - Search bar in header
  - Filter by: name, roll number, email
  - Debounce input (300ms)
  - Real-time filtering

- [ ] **Task 2.4**: Implement filters
  - Department dropdown filter
  - Batch dropdown filter
  - "All" option for each filter
  - Combine with search

- [ ] **Task 2.5**: Implement pagination
  - Show 50 students per page
  - Previous/Next buttons
  - Page numbers (1, 2, 3, ...)
  - Show total count: "Showing 1-50 of 247"

- [ ] **Task 2.6**: Implement multi-select checkboxes
  - Checkbox column in table
  - "Select All" checkbox in header
  - Track selected student IDs
  - Show "Assign to Class" button when ≥1 selected

## Phase 3: Add Student (30 min)
- [ ] **Task 3.1**: Create AddStudentModal component
  - File: `src/components/CollegeAdmin/AddStudentModal.tsx`
  - Modal with form
  - Close button (X)

- [ ] **Task 3.2**: Create StudentForm component
  - Fields: Name*, Email*, Roll*, Phone, Department*, Batch*, Program*, Avatar URL
  - Field validation (required, email format)
  - Form state management

- [ ] **Task 3.3**: Implement form validation
  - Required field checks
  - Email regex validation
  - Duplicate roll number check
  - Show inline errors

- [ ] **Task 3.4**: Implement save functionality
  - Call createStudent from students.service
  - Show loading state on button
  - Success: Close modal, show toast, refresh table
  - Error: Show error message, keep modal open

- [ ] **Task 3.5**: Add "Add Student" button to header
  - Primary blue button
  - Opens AddStudentModal
  - Icon: UserPlus

## Phase 4: Edit Student (20 min)
- [ ] **Task 4.1**: Create EditStudentModal component
  - File: `src/components/CollegeAdmin/EditStudentModal.tsx`
  - Reuse StudentForm component
  - Pre-fill with existing student data

- [ ] **Task 4.2**: Wire up Edit button in table
  - Click edit icon → Open EditStudentModal
  - Pass student data to modal
  - Pre-populate form fields

- [ ] **Task 4.3**: Implement update functionality
  - Call updateStudent from students.service
  - Show loading state
  - Success: Close modal, show toast, refresh table
  - Error: Show error, keep modal open

## Phase 5: Delete Student (15 min)
- [ ] **Task 5.1**: Create DeleteConfirmDialog component
  - File: `src/components/CollegeAdmin/DeleteConfirmDialog.tsx`
  - Show student name and roll number
  - Warning: "This will remove them from all classes"
  - Buttons: Cancel (gray), Delete (red)

- [ ] **Task 5.2**: Implement delete functionality
  - Call deleteStudent from students.service
  - Remove from all classes (update class.studentIds)
  - Show loading state
  - Success: Close dialog, show toast, refresh table
  - Error: Show error message

- [ ] **Task 5.3**: Wire up Delete button in table
  - Click delete icon → Open DeleteConfirmDialog
  - Pass student data
  - Confirm before deleting

## Phase 6: CSV Bulk Upload (60 min)
- [ ] **Task 6.1**: Create BulkUploadModal component
  - File: `src/components/CollegeAdmin/BulkUploadModal.tsx`
  - File upload area (drag-drop and browse)
  - Template download link
  - Progress bar
  - Results summary

- [ ] **Task 6.2**: Create CSV template file
  - File: `public/student-upload-template.csv`
  - Headers: name,email,rollNumber,phone,departmentName,batchName,programTitle
  - Include 2-3 example rows
  - Implement download functionality

- [ ] **Task 6.3**: Implement file upload UI
  - Drag-and-drop area
  - File input (hidden, triggered by button)
  - Accept only .csv files
  - Show selected filename

- [ ] **Task 6.4**: Implement CSV parsing
  - Use papaparse to parse file
  - Extract headers and rows
  - Validate headers match template
  - Convert to Student objects

- [ ] **Task 6.5**: Implement row validation
  - Validate each row before upload
  - Check: required fields, email format, phone format
  - Check for duplicate roll numbers (within file)
  - Collect all errors with row numbers

- [ ] **Task 6.6**: Display validation results
  - Show count: "450 valid, 50 invalid"
  - Show error list with row numbers and reasons
  - Option to proceed with valid rows only
  - Option to cancel and fix CSV

- [ ] **Task 6.7**: Implement bulk create
  - Process valid rows in batches (500 max per batch)
  - Show progress: "Processing 127 of 500..."
  - Use Firebase batch writes for performance
  - Handle errors gracefully (continue on failure)

- [ ] **Task 6.8**: Display upload results
  - Success count: "450 students created"
  - Failure count: "50 failed"
  - Download error report (CSV with failed rows + reason)
  - Close button to dismiss

- [ ] **Task 6.9**: Add "Upload CSV" button to header
  - Secondary button (next to Add Student)
  - Opens BulkUploadModal
  - Icon: FileSpreadsheet

## Phase 7: Assign to Class (30 min)
- [ ] **Task 7.1**: Create AssignToClassModal component
  - File: `src/components/CollegeAdmin/AssignToClassModal.tsx`
  - Display list of selected students
  - Class dropdown (load all classes)
  - Assign button

- [ ] **Task 7.2**: Implement class dropdown
  - Fetch all classes from Firebase
  - Display: Class title (batch name)
  - Allow single selection

- [ ] **Task 7.3**: Implement assign functionality
  - For each student: Add classId to student.classIds array
  - Update class.studentIds with new student IDs
  - Use batch writes for performance
  - Prevent duplicate assignments

- [ ] **Task 7.4**: Show "Assign to Class" button
  - Only visible when ≥1 student selected
  - Show count: "Assign 15 students to class"
  - Opens AssignToClassModal

- [ ] **Task 7.5**: Implement success feedback
  - Toast: "15 students assigned to Full-Stack Dev"
  - Clear selection after assign
  - Refresh table to show updated class counts

## Phase 8: Polish & Testing (30 min)
- [ ] **Task 8.1**: Add loading states
  - Table loading: Skeleton rows
  - Form saving: Button spinner
  - CSV uploading: Progress bar
  - Deleting: Button disabled with spinner

- [ ] **Task 8.2**: Add empty states
  - No students: Friendly message + "Add Student" CTA
  - No search results: "No students found matching '[query]'"
  - No classes for assignment: "Create classes first"

- [ ] **Task 8.3**: Add error handling
  - Network errors: Toast with retry option
  - Validation errors: Inline form errors
  - Firebase errors: User-friendly messages
  - CSV errors: Detailed error report

- [ ] **Task 8.4**: Test all features
  - Add student manually → Verify in Firebase
  - Edit student → Verify changes saved
  - Delete student → Verify removed from Firebase and classes
  - Upload CSV with 100 rows → Verify all created
  - Upload CSV with errors → Verify error report
  - Assign 10 students to class → Verify in class roster
  - Search, filter, pagination → Verify works smoothly
  - Dark/light theme → Verify styling correct

- [ ] **Task 8.5**: Performance testing
  - Upload 500 students via CSV → Should complete in <30s
  - Load table with 1000 students → Should display smoothly
  - Search with 1000 students → Results should appear instantly

- [ ] **Task 8.6**: Accessibility audit
  - Tab through all interactive elements
  - Test with screen reader
  - Check color contrast
  - Verify ARIA labels

## Phase 9: Documentation (15 min)
- [ ] **Task 9.1**: Create user guide
  - File: `docs/STUDENT_MANAGEMENT_GUIDE.md`
  - How to add students manually
  - How to bulk upload via CSV
  - How to assign students to classes
  - CSV template format explanation

- [ ] **Task 9.2**: Update README
  - Add Student Management to features list
  - Add CSV upload instructions
  - Add screenshots (optional)

- [ ] **Task 9.3**: Create CSV template documentation
  - Explain each column
  - Provide examples
  - List validation rules

## Estimation
- **Phase 1 (Setup)**: 15 minutes
- **Phase 2 (Table View)**: 45 minutes
- **Phase 3 (Add Student)**: 30 minutes
- **Phase 4 (Edit Student)**: 20 minutes
- **Phase 5 (Delete Student)**: 15 minutes
- **Phase 6 (CSV Upload)**: 60 minutes
- **Phase 7 (Assign to Class)**: 30 minutes
- **Phase 8 (Polish & Testing)**: 30 minutes
- **Phase 9 (Documentation)**: 15 minutes

**Total Estimated Time**: 4 hours

## Success Criteria
- ✅ College Admin can add students manually via form
- ✅ College Admin can view all students in searchable/filterable table
- ✅ College Admin can edit student details
- ✅ College Admin can delete students
- ✅ College Admin can upload 500+ students via CSV in <30 seconds
- ✅ CSV validation catches all errors before upload
- ✅ Error report downloadable for failed CSV rows
- ✅ Multi-select and assign students to classes
- ✅ All operations persist to Firebase
- ✅ UI matches existing design (no visual changes)
- ✅ Dark/light theme support
- ✅ Mobile responsive
