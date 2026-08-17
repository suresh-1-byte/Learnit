# Student Management System - Design

## Architecture

### Component Structure
```
CollegeAdminDashboard
└── Students Tab (NEW)
    ├── StudentManagementHeader
    │   ├── Search Bar
    │   ├── Filters (Department, Batch)
    │   └── Actions (Add Student, Upload CSV)
    │
    ├── StudentTable
    │   ├── TableHeader (sortable columns)
    │   ├── StudentRow (repeating)
    │   │   ├── Avatar + Name
    │   │   ├── Roll Number
    │   │   ├── Email
    │   │   ├── Department
    │   │   ├── Batch
    │   │   ├── Classes (count)
    │   │   └── Actions (Edit, Delete)
    │   └── Pagination
    │
    ├── AddStudentModal
    │   └── StudentForm
    │
    ├── EditStudentModal
    │   └── StudentForm (pre-filled)
    │
    ├── BulkUploadModal
    │   ├── File Upload Area (drag-drop)
    │   ├── Template Download Link
    │   ├── Progress Bar
    │   └── Results Summary
    │
    ├── AssignToClassModal
    │   ├── Selected Students List
    │   ├── Class Dropdown
    │   └── Assign Button
    │
    └── DeleteConfirmDialog
```

## User Flows

### Flow 1: Add Single Student
1. Click "Add Student" button
2. Modal opens with empty form
3. Fill in: Name, Email, Roll Number, Phone, Department, Batch, Program
4. Click "Save Student"
5. Validation runs (required fields, email format, unique roll)
6. If valid: Save to Firebase → Close modal → Show success → Refresh table
7. If invalid: Show inline errors, keep modal open

### Flow 2: CSV Bulk Upload
1. Click "Upload CSV" button
2. Modal opens with upload area
3. Option A: Drag CSV file into area
4. Option B: Click "Choose File" to browse
5. File selected → Start validation
6. Show validation results:
   - Header check
   - Row-by-row validation
   - Duplicate detection
7. If errors: Display list with row numbers, allow cancel or fix
8. If valid: Click "Upload All"
9. Show progress: "Processing 127 of 500..."
10. On completion:
    - Show "450 successful, 50 failed"
    - Download error report (CSV with failed rows + reason)
    - Close modal
    - Refresh table

### Flow 3: Edit Student
1. Click Edit icon on student row
2. Modal opens with pre-filled form
3. Modify fields as needed
4. Click "Update Student"
5. Validation runs
6. Save to Firebase → Close modal → Show success → Refresh table

### Flow 4: Delete Student
1. Click Delete icon on student row
2. Confirmation dialog: "Delete Arun Kumar (CS001)? This will remove them from all classes."
3. Click "Delete" or "Cancel"
4. If Delete:
   - Remove from Firebase students collection
   - Remove studentId from all classes
   - Show success
   - Refresh table

### Flow 5: Assign to Class
1. Select students via checkboxes (can select multiple)
2. Click "Assign to Class" button (appears when ≥1 selected)
3. Modal opens with:
   - List of selected students
   - Dropdown of all classes
4. Select class from dropdown
5. Click "Assign"
6. Update student.classIds array for each student
7. Update class.studentIds array
8. Show success: "15 students assigned to Full-Stack Dev"
9. Close modal, deselect all, refresh table

## UI Design Specifications

### Color Scheme
- Primary Action: `#6366F1` (Indigo)
- Success: `#10B981` (Green)
- Danger: `#EF4444` (Red)
- Warning: `#F59E0B` (Amber)
- Dark Theme: `#0A0A0E` background, `rgba(255,255,255,0.08)` borders
- Light Theme: `white` background, `rgba(0,0,0,0.06)` borders

### Typography
- Headers: Font black, tracking tight
- Body: Font medium
- Monospace: Roll numbers, counts
- Size: xs (10-11px) for labels, sm/base for content

### Layout
- Rounded corners: `rounded-2xl` for cards, `rounded-xl` for buttons
- Spacing: `gap-3` to `gap-6` between sections
- Shadows: `shadow-sm` to `shadow-lg` based on elevation
- Transitions: `duration-250` for smooth interactions

### Student Table Design
```
┌─────────────────────────────────────────────────────────────────────┐
│  Students (247)              [Search...] [Dept ▼] [Add] [Upload CSV] │
├─────────────────────────────────────────────────────────────────────┤
│ [ ] │ Avatar │ Name          │ Roll    │ Email         │ Dept  │... │
│ [ ] │   👤   │ Arun Kumar    │ CS001   │ arun@test.com │ CSE   │ ✏️ 🗑️│
│ [ ] │   👤   │ Priya Sharma  │ CS002   │ priya@...     │ CSE   │ ✏️ 🗑️│
│ [ ] │   👤   │ Rahul Verma   │ CS003   │ rahul@...     │ CSE   │ ✏️ 🗑️│
│                                                                       │
│                     ← 1 2 3 ... 10 →    50 per page                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Add/Edit Student Form
```
┌─────────────────────────────────┐
│  Add New Student            [×] │
├─────────────────────────────────┤
│  Name *                         │
│  [___________________________]  │
│                                 │
│  Email *                        │
│  [___________________________]  │
│                                 │
│  Roll Number *                  │
│  [___________________________]  │
│                                 │
│  Phone                          │
│  [___________________________]  │
│                                 │
│  Department *    [Dropdown  ▼] │
│  Batch *         [Dropdown  ▼] │
│  Program *       [Dropdown  ▼] │
│                                 │
│  Avatar URL (optional)          │
│  [___________________________]  │
│                                 │
│        [Cancel]  [Save Student] │
└─────────────────────────────────┘
```

### CSV Upload Modal
```
┌─────────────────────────────────────────┐
│  Bulk Upload Students            [×]    │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │    📄 Drag CSV file here          │ │
│  │    or click to browse             │ │
│  │                                   │ │
│  │    [Choose File]                  │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  📥 Download CSV Template               │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ✅ 450 students processed              │
│  ❌ 50 students failed                  │
│                                         │
│  📊 Download Error Report               │
│                                         │
│              [Close]  [Upload All]      │
└─────────────────────────────────────────┘
```

## Data Flow

### Add Student
```
User Input → Validation → Firebase (students collection)
                              ↓
                         Success Toast
                              ↓
                         Refresh Table
```

### CSV Upload
```
CSV File → Parse (papaparse) → Validate Each Row
                                    ↓
                    ┌───────────────┴────────────┐
                Valid Rows                  Invalid Rows
                    ↓                            ↓
          Firebase Batch Write           Error Report
          (500 per batch)                     ↓
                    ↓                    Download CSV
          Success Count
                    ↓
          Refresh Table
```

### Assign to Class
```
Selected Students + Class ID
         ↓
For each student:
  - Add classId to student.classIds
         ↓
Update class.studentIds with all new studentIds
         ↓
Firebase Batch Write
         ↓
Success Toast + Refresh
```

## Technical Implementation

### State Management
```typescript
// Component State
const [students, setStudents] = useState<Student[]>([]);
const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [deptFilter, setDeptFilter] = useState('All');
const [batchFilter, setBatchFilter] = useState('All');
const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [studentsPerPage] = useState(50);

// Modal States
const [showAddModal, setShowAddModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [showUploadModal, setShowUploadModal] = useState(false);
const [showAssignModal, setShowAssignModal] = useState(false);
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

// Form State
const [editingStudent, setEditingStudent] = useState<Student | null>(null);
const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

// Upload State
const [uploadProgress, setUploadProgress] = useState(0);
const [uploadResults, setUploadResults] = useState<{
  successful: number;
  failed: number;
  errors: Array<{row: number; reason: string}>;
} | null>(null);
```

### Custom Hook
```typescript
// src/hooks/useStudents.ts
export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all students
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (err) {
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  // CRUD operations
  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createStudent(studentData);
    const newStudent = { ...studentData, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setStudents([...students, newStudent]);
    return id;
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    await updateStudentService(id, updates);
    setStudents(students.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeStudent = async (id: string) => {
    await deleteStudent(id);
    setStudents(students.filter(s => s.id !== id));
  };

  return { students, loading, error, addStudent, updateStudent, removeStudent };
};
```

### CSV Parsing
```typescript
import Papa from 'papaparse';

interface CSVRow {
  name: string;
  email: string;
  rollNumber: string;
  phone: string;
  departmentName: string;
  batchName: string;
  programTitle: string;
}

const parseCSV = (file: File): Promise<Papa.ParseResult<CSVRow>> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject
    });
  });
};

const validateCSVRow = (row: CSVRow, index: number): string | null => {
  if (!row.name) return `Row ${index}: Name is required`;
  if (!row.email) return `Row ${index}: Email is required`;
  if (!row.rollNumber) return `Row ${index}: Roll Number is required`;
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(row.email)) {
    return `Row ${index}: Invalid email format`;
  }
  return null;
};
```

### Batch Upload
```typescript
const bulkUploadStudents = async (rows: CSVRow[]) => {
  const results = { successful: 0, failed: 0, errors: [] };
  const BATCH_SIZE = 500;
  
  // Process in batches
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    
    for (let j = 0; j < batch.length; j++) {
      const row = batch[j];
      const error = validateCSVRow(row, i + j + 1);
      
      if (error) {
        results.failed++;
        results.errors.push({ row: i + j + 1, reason: error });
        continue;
      }
      
      try {
        await createStudent({
          ...row,
          classIds: []
        });
        results.successful++;
        setUploadProgress(((i + j + 1) / rows.length) * 100);
      } catch (err) {
        results.failed++;
        results.errors.push({ 
          row: i + j + 1, 
          reason: 'Firebase error: ' + (err as Error).message 
        });
      }
    }
  }
  
  return results;
};
```

## Performance Optimizations

1. **Pagination**: Load only 50 students at a time in UI
2. **Virtual Scrolling**: Consider `react-window` for 1000+ students
3. **Debounced Search**: Wait 300ms after typing before filtering
4. **Batch Writes**: Use Firebase batch() for bulk operations
5. **Optimistic Updates**: Update UI immediately, rollback on error
6. **Memoization**: Use `useMemo` for filtered/sorted data

## Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements for success/error
- Focus management in modals
- Color contrast compliance (WCAG AA)

## Error Handling

### Form Validation Errors
- Display inline below each field
- Red border on invalid inputs
- Prevent submission until valid

### Network Errors
- Toast notification: "Failed to save student. Please try again."
- Retry button
- Log error details to console

### CSV Upload Errors
- Show validation summary before upload
- Allow download of error report
- Continue processing valid rows even if some fail
