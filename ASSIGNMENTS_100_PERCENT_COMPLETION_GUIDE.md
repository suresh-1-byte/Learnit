# Assignments Feature - 100% Completion Guide

**Goal:** Complete the Assignments feature end-to-end so mentors and students can create, submit, and grade assignments through the UI.

**Current Status:** 40% Complete (Backend done, UI incomplete)

---

## ✅ What's Already Done

1. **Firebase Service** - `assignments.service.ts` ✅
2. **Custom Hook** - `useAssignments.ts` ✅
3. **MentorDashboard Backend Integration** - ✅
4. **Handler Functions** - `handleCreateAssignment`, `handleGradeSubmission` ✅

---

## 🎯 What Needs to Be Done

### Task 1: Enhanced Assignment Creation Modal
### Task 2: Assignments List Display
### Task 3: View Submissions Modal
### Task 4: Grading Modal
### Task 5: Student Dashboard Integration

---

## 📋 TASK 1: Enhanced Assignment Creation Modal

**Location:** Find where `showCreateAssignmentModal` is rendered in `MentorDashboard.tsx`

**Current State:** Modal probably has only title and due date fields

**What to Add:**

```tsx
{showCreateAssignmentModal && (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border space-y-4 ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className={`flex items-center justify-between pb-2 border-b ${
        theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
      }`}>
        <h3 className="font-bold text-lg">Create New Assignment</h3>
        <button onClick={() => setShowCreateAssignmentModal(false)} className="text-gray-500 hover:text-gray-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleCreateAssignment} className="space-y-4">
        {/* Class Selection - REQUIRED */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Select Class <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedClassForAssignment}
            onChange={(e) => setSelectedClassForAssignment(e.target.value)}
            required
            className={`w-full px-4 py-2.5 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Choose a class...</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.title} - {cls.batchName}
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Title - REQUIRED */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Assignment Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={newAssignmentTitle}
            onChange={(e) => setNewAssignmentTitle(e.target.value)}
            required
            placeholder="e.g., React Component Assignment"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Description - OPTIONAL */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Description
          </label>
          <textarea
            value={newAssignmentDescription}
            onChange={(e) => setNewAssignmentDescription(e.target.value)}
            rows={2}
            placeholder="Brief description of the assignment"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Instructions - OPTIONAL */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Instructions
          </label>
          <textarea
            value={newAssignmentInstructions}
            onChange={(e) => setNewAssignmentInstructions(e.target.value)}
            rows={4}
            placeholder="Detailed instructions for students"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Due Date - REQUIRED */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={newAssignmentDeadline}
            onChange={(e) => setNewAssignmentDeadline(e.target.value)}
            required
            className={`w-full px-4 py-2.5 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Max Marks - OPTIONAL */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Maximum Marks
          </label>
          <input
            type="number"
            value={newAssignmentMaxMarks}
            onChange={(e) => setNewAssignmentMaxMarks(Number(e.target.value))}
            min="1"
            max="1000"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* File Upload - OPTIONAL */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Attachment (Optional)
          </label>
          <input
            type="file"
            onChange={(e) => setNewAssignmentFile(e.target.files?.[0])}
            accept=".pdf,.doc,.docx,.zip"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported: PDF, Word, ZIP (Max 10MB)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setShowCreateAssignmentModal(false);
              setSelectedClassForAssignment('');
              setNewAssignmentTitle('');
              setNewAssignmentDescription('');
              setNewAssignmentInstructions('');
              setNewAssignmentDeadline('2026-08-15');
              setNewAssignmentMaxMarks(100);
              setNewAssignmentFile(undefined);
            }}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={assignmentsLoading}
            className="flex-1 px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {assignmentsLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Assignment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
```

**This modal uses all the state variables we already created!**

---

## 📋 TASK 2: Assignments List Display

**Location:** Create a new section in the assignments tab view

**What to Add:**

```tsx
{/* Assignments List */}
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-bold">Your Assignments</h3>
    <button
      onClick={() => setShowCreateAssignmentModal(true)}
      className="px-4 py-2 bg-[#6366F1] text-white rounded-xl text-sm font-semibold flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      New Assignment
    </button>
  </div>

  {assignmentsLoading ? (
    <div className="text-center py-8">
      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#6366F1]" />
      <p className="text-sm text-gray-500 mt-2">Loading assignments...</p>
    </div>
  ) : assignments.length === 0 ? (
    <div className="text-center py-12 border-2 border-dashed rounded-2xl">
      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
      <p className="text-gray-500 font-semibold">No assignments yet</p>
      <p className="text-sm text-gray-400 mt-1">Create your first assignment to get started</p>
      <button
        onClick={() => setShowCreateAssignmentModal(true)}
        className="mt-4 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-sm"
      >
        Create Assignment
      </button>
    </div>
  ) : (
    <div className="grid gap-4">
      {assignments.map(assignment => (
        <div
          key={assignment.id}
          className={`p-5 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-[#0A0A0A] border-[#1A1A1A]'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-base mb-1">{assignment.title}</h4>
              {assignment.description && (
                <p className="text-sm text-gray-500 mb-2">{assignment.description}</p>
              )}
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {assignment.maxMarks} marks
                </span>
                {assignment.attachmentUrl && (
                  <a
                    href={assignment.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#6366F1] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Attachment
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await fetchSubmissions(assignment.id);
                  setShowSubmissionsModal(true);
                  setSelectedAssignmentForSubmissions(assignment);
                }}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                View Submissions
              </button>
              <button
                onClick={async () => {
                  if (confirm('Delete this assignment?')) {
                    await removeAssignment(assignment.id);
                  }
                }}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

**Add these state variables:**
```typescript
const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] = useState<any>(null);
```

---

## 📋 TASK 3: View Submissions Modal

**What to Add:**

```tsx
{/* View Submissions Modal */}
{showSubmissionsModal && selectedAssignmentForSubmissions && (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div className={`rounded-2xl max-w-4xl w-full p-6 shadow-2xl border space-y-4 ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h3 className="font-bold text-lg">Submissions</h3>
          <p className="text-sm text-gray-500">{selectedAssignmentForSubmissions.title}</p>
        </div>
        <button onClick={() => setShowSubmissionsModal(false)} className="text-gray-500 hover:text-gray-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map(submission => (
              <div
                key={submission.id}
                className={`p-4 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-[#0D0D0D] border-[#222]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{submission.studentName}</p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        submission.status === 'Graded'
                          ? 'bg-green-100 text-green-700'
                          : submission.status === 'Late'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {submission.status}
                      </span>
                      {submission.status === 'Graded' && (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700">
                          {submission.marksObtained}/{selectedAssignmentForSubmissions.maxMarks}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    {submission.status !== 'Graded' && (
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setGradeScore(selectedAssignmentForSubmissions.maxMarks);
                          setGradeFeedback('');
                          setShowGradingModal(true);
                        }}
                        className="px-3 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg text-xs font-semibold"
                      >
                        Grade
                      </button>
                    )}
                  </div>
                </div>
                {submission.feedback && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">Feedback:</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{submission.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
```

**Add state:**
```typescript
const [showGradingModal, setShowGradingModal] = useState(false);
```

---

## 📋 TASK 4: Grading Modal

**What to Add:**

```tsx
{/* Grading Modal */}
{showGradingModal && selectedSubmission && (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A] border-[#1A1A1A] text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b">
        <h3 className="font-bold text-lg">Grade Submission</h3>
        <button onClick={() => setShowGradingModal(false)} className="text-gray-500 hover:text-gray-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm"><span className="font-semibold">Student:</span> {selectedSubmission.studentName}</p>
        <p className="text-sm"><span className="font-semibold">Submitted:</span> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
        <a
          href={selectedSubmission.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#6366F1] hover:underline flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          Download Submission
        </a>
      </div>

      <form onSubmit={handleGradeSubmission} className="space-y-4 pt-4 border-t">
        {/* Marks Input */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Marks Obtained <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={gradeScore}
            onChange={(e) => setGradeScore(Number(e.target.value))}
            min="0"
            max={selectedAssignmentForSubmissions?.maxMarks || 100}
            required
            className={`w-full px-4 py-2.5 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum: {selectedAssignmentForSubmissions?.maxMarks || 100} marks
          </p>
        </div>

        {/* Feedback Textarea */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Feedback
          </label>
          <textarea
            value={gradeFeedback}
            onChange={(e) => setGradeFeedback(e.target.value)}
            rows={4}
            placeholder="Provide feedback to the student..."
            className={`w-full px-4 py-2.5 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-[#0D0D0D] border-[#222] text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowGradingModal(false)}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Submit Grade
          </button>
        </div>
      </form>
    </div>
  </div>
)}
```

---

## 📋 TASK 5: Student Dashboard Integration

**File:** `src/components/Student/StudentDashboard.tsx`

**Add at top:**
```typescript
import { useAssignments } from '../../hooks/useAssignments';
```

**In component:**
```typescript
// Get student's class ID
const studentClassId = userProfile?.classIds?.[0] || '';

// Use assignments hook
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

**Display assignments:**
```tsx
{/* Assignments View */}
<div className="space-y-4">
  <h3 className="text-lg font-bold">My Assignments</h3>
  
  {assignmentsLoading ? (
    <div className="text-center py-8">Loading...</div>
  ) : assignments.length === 0 ? (
    <div className="text-center py-12">No assignments yet</div>
  ) : (
    <div className="grid gap-4">
      {assignments.map(assignment => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onSubmit={handleSubmitAssignment}
        />
      ))}
    </div>
  )}
</div>
```

---

## ✅ Completion Checklist

### Mentor Side:
- [ ] Assignment creation modal with all fields
- [ ] Assignments list display
- [ ] View submissions button working
- [ ] Submissions modal showing all submissions
- [ ] Download submission file button
- [ ] Grade button opens grading modal
- [ ] Grading modal with marks and feedback
- [ ] Submit grade saves to Firebase
- [ ] Delete assignment button working

### Student Side:
- [ ] View assignments for their class
- [ ] See assignment details
- [ ] Download assignment attachment
- [ ] Submit assignment with file upload
- [ ] See submission status
- [ ] View grade and feedback

### Testing:
- [ ] Create assignment → appears in Firebase
- [ ] Student sees assignment immediately
- [ ] Student submits → Mentor sees submission
- [ ] Mentor grades → Student sees grade
- [ ] File uploads work
- [ ] File downloads work
- [ ] No errors in console

---

## 🚀 Quick Implementation

**Estimated Time:** 4-5 hours for complete implementation

**Order:**
1. Task 1 (Modal): 1 hour
2. Task 2 (List): 1 hour
3. Task 3 (Submissions): 1 hour
4. Task 4 (Grading): 30 mins
5. Task 5 (Student): 1.5 hours
6. Testing: 1 hour

---

## 💡 Pro Tip

All the backend code is ready and tested. You're just adding UI forms and displays. The handlers (`handleCreateAssignment`, `handleGradeSubmission`) already work - they just need proper UI to collect the data.

**This is why we did the backend first!** 🎉

---

**Ready to implement? The guide above has EVERYTHING you need!** 🚀
