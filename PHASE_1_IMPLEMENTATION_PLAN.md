# Phase 1: Assignments Integration - Implementation Plan

**Date:** August 18, 2026  
**Objective:** Integrate Firebase Assignments service into Mentor and Student Dashboards

---

## Current Situation

### ✅ What's Already Done
1. **assignments.service.ts** - Complete Firebase service with:
   - Create/Read/Update/Delete assignments
   - File upload to Firebase Storage
   - Submit assignment (student)
   - Grade submission (mentor)
   - Get submissions by assignment
   - Get student's specific submission

2. **useAssignments.ts** - Custom React hook (JUST CREATED) with:
   - `fetchMentorAssignments()` - Get all mentor's assignments
   - `fetchClassAssignments()` - Get assignments for a class
   - `addAssignment()` - Create new assignment
   - `updateAssignmentData()` - Edit assignment
   - `removeAssignment()` - Delete assignment
   - `submitStudentAssignment()` - Student submits work
   - `fetchSubmissions()` - Get all submissions for an assignment
   - `gradeStudentSubmission()` - Mentor grades submission
   - Auto-refresh after operations
   - Error handling
   - Loading states

### ❌ What's Missing
1. **MentorDashboard** - Not using useAssignments hook yet
   - Still has empty mock arrays: `const mockAssignmentsList: any[] = []`
   - Assignment creation modal exists but doesn't call Firebase
   - Grading UI exists but doesn't save to Firebase
   - No file upload UI integrated

2. **StudentDashboard** - Not integrated at all
   - Needs to show assignments from Firebase
   - Needs submission UI with file upload
   - Needs to show grades and feedback

---

## Implementation Steps

### Step 1: Integrate useAssignments Hook into MentorDashboard

#### File: `src/components/Mentor/MentorDashboard.tsx`

**Current Code (Line ~170-175):**
```typescript
// Assignments & Grading state
const [assignments, setAssignments] = useState<Assignment[]>([]);
const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
```

**Replace With:**
```typescript
// Import the hook at top
import { useAssignments } from '../../hooks/useAssignments';

// In component body, replace the useState with:
const {
  assignments,
  submissions,
  loading: assignmentsLoading,
  error: assignmentsError,
  addAssignment,
  removeAssignment,
  fetchSubmissions,
  gradeStudentSubmission
} = useAssignments();
```

---

### Step 2: Update handleCreateAssignment Function

**Current Code (Line ~395-415):**
```typescript
const handleCreateAssignment = (e: React.FormEvent) => {
  e.preventDefault();
  if (!newAssignmentTitle) return;

  const newAsg: Assignment = {
    id: `asg_${Date.now()}`,
    batchId: 'batch_1',
    programTitle: 'Full-Stack Software Engineering',
    title: newAssignmentTitle,
    description: 'Implement complete functional service...',
    dueDate: newAssignmentDeadline,
    maxMarks: 100,
    createdDate: new Date().toISOString().split('T')[0],
    submissionsCount: 0,
    totalStudents: 60
  };

  setAssignments([newAsg, ...assignments]);
  setShowCreateAssignmentModal(false);
  setNewAssignmentTitle('');
};
```

**Replace With:**
```typescript
const handleCreateAssignment = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!newAssignmentTitle || !userProfile || !selectedClassForAssignment) {
    alert('Please fill all required fields');
    return;
  }

  try {
    // Get selected class details
    const selectedClass = classes.find(c => c.id === selectedClassForAssignment);
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    const assignmentData = {
      title: newAssignmentTitle,
      description: newAssignmentDescription || 'Complete the assignment as instructed',
      mentorId: userProfile.id,
      mentorName: userProfile.name,
      classId: selectedClassForAssignment,
      dueDate: newAssignmentDeadline,
      maxMarks: newAssignmentMaxMarks || 100,
      instructions: newAssignmentInstructions || ''
    };

    // Create assignment in Firebase
    await addAssignment(assignmentData, newAssignmentFile);
    
    // Reset form
    setShowCreateAssignmentModal(false);
    setNewAssignmentTitle('');
    setNewAssignmentDescription('');
    setNewAssignmentDeadline('');
    setNewAssignmentMaxMarks(100);
    setNewAssignmentInstructions('');
    setNewAssignmentFile(undefined);
    
    alert('Assignment created successfully!');
  } catch (error: any) {
    console.error('Error creating assignment:', error);
    alert('Failed to create assignment: ' + error.message);
  }
};
```

---

### Step 3: Update Grading Function

**Current Code (Line ~326-340):**
```typescript
const handleGradeSubmission = (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedSubmission) return;

  setSubmissions(prev => prev.map(s => {
    if (s.id === selectedSubmission.id) {
      return {
        ...s,
        status: 'Graded',
        marksObtained: gradeScore,
        feedback: gradeFeedback || 'Excellent clean architecture...'
      };
    }
    return s;
  }));

  setSelectedSubmission(null);
};
```

**Replace With:**
```typescript
const handleGradeSubmission = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!selectedSubmission) return;

  try {
    // Save grade to Firebase
    await gradeStudentSubmission(
      selectedSubmission.id,
      gradeScore,
      gradeFeedback || 'Good work!'
    );
    
    // Refresh submissions
    await fetchSubmissions(selectedSubmission.assignmentId);
    
    // Reset form
    setSelectedSubmission(null);
    setGradeScore(95);
    setGradeFeedback('');
    
    alert('Submission graded successfully!');
  } catch (error: any) {
    console.error('Error grading submission:', error);
    alert('Failed to grade submission: ' + error.message);
  }
};
```

---

### Step 4: Add State Variables for Assignment Form

**Add these state variables (around line 170-180):**
```typescript
// Assignment form state
const [selectedClassForAssignment, setSelectedClassForAssignment] = useState<string>('');
const [newAssignmentDescription, setNewAssignmentDescription] = useState('');
const [newAssignmentInstructions, setNewAssignmentInstructions] = useState('');
const [newAssignmentMaxMarks, setNewAssignmentMaxMarks] = useState(100);
const [newAssignmentFile, setNewAssignmentFile] = useState<File | undefined>(undefined);
```

---

### Step 5: Update Assignment Creation Modal

The assignment creation modal needs to be updated to include:
1. Class selection dropdown
2. Description field
3. Instructions field
4. Max marks field
5. File upload input

**Find the modal (search for "Create Assignment Modal") and update it.**

---

### Step 6: Add "View Submissions" Button

When displaying assignments, add a button to view submissions:

```typescript
<button
  onClick={async () => {
    await fetchSubmissions(assignment.id);
    setShowSubmissionsModal(true);
  }}
  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs"
>
  View Submissions ({assignment.submissionsCount || 0})
</button>
```

---

## Step 7: Student Dashboard Integration

### File: `src/components/Student/StudentDashboard.tsx`

**Add at top:**
```typescript
import { useAssignments } from '../../hooks/useAssignments';
```

**In component:**
```typescript
// Get student's class ID from userProfile
const studentClassId = userProfile?.classIds?.[0] || '';

// Use the hook
const {
  assignments,
  loading: assignmentsLoading,
  submitStudentAssignment,
  fetchStudentSubmission
} = useAssignments(studentClassId);
```

**Create submission handler:**
```typescript
const handleSubmitAssignment = async (assignmentId: string, file: File) => {
  if (!userProfile) return;

  try {
    const submissionData = {
      assignmentId,
      studentId: userProfile.id,
      studentName: userProfile.name,
      submittedAt: new Date().toISOString()
    };

    await submitStudentAssignment(submissionData, file);
    alert('Assignment submitted successfully!');
  } catch (error: any) {
    console.error('Error submitting assignment:', error);
    alert('Failed to submit assignment: ' + error.message);
  }
};
```

---

## Required UI Updates

### Mentor Dashboard - Assignment Creation Modal

```typescript
{showCreateAssignmentModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-6 max-w-2xl w-full">
      <h3 className="text-xl font-bold mb-4">Create New Assignment</h3>
      
      <form onSubmit={handleCreateAssignment} className="space-y-4">
        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Class</label>
          <select
            value={selectedClassForAssignment}
            onChange={(e) => setSelectedClassForAssignment(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border"
          >
            <option value="">Choose a class...</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.title} - {cls.batchName}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Assignment Title</label>
          <input
            type="text"
            value={newAssignmentTitle}
            onChange={(e) => setNewAssignmentTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border"
            placeholder="e.g., React Component Assignment"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={newAssignmentDescription}
            onChange={(e) => setNewAssignmentDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border"
            placeholder="Brief description of the assignment"
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium mb-2">Instructions</label>
          <textarea
            value={newAssignmentInstructions}
            onChange={(e) => setNewAssignmentInstructions(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border"
            placeholder="Detailed instructions for students"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Due Date</label>
          <input
            type="date"
            value={newAssignmentDeadline}
            onChange={(e) => setNewAssignmentDeadline(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border"
          />
        </div>

        {/* Max Marks */}
        <div>
          <label className="block text-sm font-medium mb-2">Maximum Marks</label>
          <input
            type="number"
            value={newAssignmentMaxMarks}
            onChange={(e) => setNewAssignmentMaxMarks(Number(e.target.value))}
            min="1"
            max="1000"
            required
            className="w-full px-4 py-2 rounded-lg border"
          />
        </div>

        {/* File Attachment */}
        <div>
          <label className="block text-sm font-medium mb-2">Attachment (Optional)</label>
          <input
            type="file"
            onChange={(e) => setNewAssignmentFile(e.target.files?.[0])}
            className="w-full px-4 py-2 rounded-lg border"
            accept=".pdf,.doc,.docx,.zip"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported: PDF, Word, ZIP files
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowCreateAssignmentModal(false)}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Create Assignment
          </button>
        </div>
      </form>
    </div>
  </div>
)}
```

---

## Testing Checklist

### Mentor Side
- [ ] Create assignment without file attachment
- [ ] Create assignment with file attachment
- [ ] View list of assignments
- [ ] Edit assignment
- [ ] Delete assignment
- [ ] View submissions for an assignment
- [ ] Grade a submission
- [ ] Download student submission file

### Student Side
- [ ] View list of assignments
- [ ] See assignment details (title, description, instructions, due date)
- [ ] Download assignment attachment (if any)
- [ ] Submit assignment with file
- [ ] See submission status (Submitted/Late/Graded)
- [ ] View grade and feedback (if graded)
- [ ] Cannot submit twice

### Cross-Portal Sync
- [ ] Mentor creates assignment → Student sees it immediately
- [ ] Student submits → Mentor sees submission immediately
- [ ] Mentor grades → Student sees grade immediately

---

## Estimated Time

- **Mentor Dashboard Integration:** 3-4 hours
- **Student Dashboard Integration:** 2-3 hours
- **Testing & Bug Fixes:** 2-3 hours
- **Total:** 7-10 hours (1-2 days of work)

---

## Next Steps After Assignments

Once assignments are working:
1. Announcements integration (similar process)
2. Study Materials integration
3. Video Library integration
4. Assessments/Exams (new service needed)

---

## Files to Modify

1. ✅ `src/hooks/useAssignments.ts` (DONE - Already created)
2. ⏳ `src/components/Mentor/MentorDashboard.tsx` (IN PROGRESS)
3. ⏳ `src/components/Student/StudentDashboard.tsx` (TODO)
4. ⏳ Update assignment modal UI (TODO)
5. ⏳ Add submissions modal UI (TODO)

---

## Questions?

Before proceeding with implementation, confirm:
1. Should I start modifying MentorDashboard.tsx now?
2. Do you want to see the changes incrementally or all at once?
3. Should I create a separate branch for this work?

Ready to continue when you are! 🚀
