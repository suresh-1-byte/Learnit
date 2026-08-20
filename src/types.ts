export type UserRole = 'super_admin' | 'college_admin' | 'mentor' | 'student';

export interface UserProfile {
  id: string; // Firebase UID
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profileImage?: string;
  collegeId?: string;
  collegeName?: string;
  departmentId?: string;
  departmentName?: string;
  classId?: string; // For students - their assigned class/batch
  batchId?: string; // Alternative field name for class
  title?: string;
  phone?: string;
  qualifications?: string;
  skills?: string[];
  assignedPrograms?: string[];
  assignedBatches?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PartnerCollege {
  id: string;
  name: string;
  code: string;
  location: string;
  state: string;
  logo: string;
  contractStatus: 'Active' | 'Pending Renewal' | 'Onboarding';
  planTier: 'Enterprise' | 'Professional' | 'Standard';
  joinedDate: string;
  totalDepartments: number;
  totalStudents: number;
  totalMentors: number;
  placementRate: number; // percentage e.g. 88.5
  annualFee: number;
  contactPerson: string;
  contactEmail: string;
}

export interface Department {
  id: string;
  collegeId: string;
  name: string;
  code: string; // e.g., CSE, ECE, AI-DS
  headOfDepartment: string;
  totalBatches: number;
  totalStudents: number;
}

export interface TrainingProgram {
  id: string;
  title: string;
  code: string;
  category: 'Full Stack Development' | 'Data Science & AI' | 'Cloud & DevOps' | 'Cyber Security' | 'Core Engineering';
  durationWeeks: number;
  totalModules: number;
  totalHours: number;
  description: string;
  enrolledStudentsCount: number;
}

export interface Batch {
  id: string;
  collegeId: string;
  departmentId: string;
  programId: string;
  programTitle: string;
  name: string; // e.g. BATCH-2026-CSE-A
  startDate: string;
  endDate: string;
  mentorId: string;
  mentorName: string;
  studentCount: number;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  averageAttendance: number;
}

export interface Session {
  id: string;
  batchId: string;
  topic: string;
  mentor: string;
  time: string;
  date: string;
  mode: 'Live Interactive Lab' | 'Live Lecture' | 'Recorded' | 'Hybrid';
  status: 'Live Now' | 'Scheduled' | 'Completed' | 'Cancelled';
  attendanceMarked: boolean;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  avatar: string;
  collegeId: string;
  collegeName: string;
  departmentId: string;
  departmentName: string;
  batchId: string;
  batchName: string;
  cgpa: number;
  attendancePct: number;
  feeStatus: 'Paid' | 'Pending' | 'Partial';
  placementStatus: 'Placed' | 'In Process' | 'Not Eligible' | 'Seeking';
  placedCompany?: string;
  packageLPA?: number;
  skills: string[];
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  specialization: string;
  collegeId: string;
  collegeName: string;
  assignedBatchesCount: number;
  totalStudentsMentored: number;
  rating: number;
  experienceYears: number;
}

export interface AttendanceRecord {
  id: string;
  batchId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  markedBy: string;
  remarks?: string;
}

export interface Assignment {
  id: string;
  batchId: string;
  programTitle: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  createdDate: string;
  submissionsCount: number;
  totalStudents: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl: string;
  fileName: string;
  status: 'Graded' | 'Submitted' | 'Overdue';
  marksObtained?: number;
  feedback?: string;
}

export interface LearningMaterial {
  id: string;
  batchId: string;
  programTitle: string;
  title: string;
  description?: string;
  type: 'Video' | 'PDF' | 'Code Sandbox' | 'Slides';
  url: string;
  durationOrPages: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Assessment {
  id: string;
  title: string;
  batchId: string;
  programTitle: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  passPercentage: number;
  status: 'Active' | 'Draft' | 'Completed';
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  collegeName: string;
  programTitle: string;
  issuedDate: string;
  grade: 'Distinction' | 'First Class' | 'Pass';
  verifyUrl: string;
}

// Placement Drive Types
export type PlacementDriveStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Archived';

export interface PlacementDrive {
  id: string;
  companyName: string;
  companyLogo?: string;
  jobRole: string;
  package: string; // e.g., "24.5 LPA"
  location: string;
  driveDate: string;
  eligibility: string;
  description: string;
  requiredSkills: string[];
  status: PlacementDriveStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // Super Admin ID
  approvedBy?: string; // Super Admin ID who approved
  approvedAt?: string;
  rejectionReason?: string;
}

export interface PlacementStatistics {
  totalPlacementRate: string; // Calculated from approved drives
  studentsPlaced: number;
  hiringPartners: number; // Count of unique approved companies
  averagePackage: string; // Calculated from approved drives
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  entityType: 'College Subscription' | 'Student Fee';
  entityName: string;
  collegeName: string;
  amount: number;
  date: string;
  paymentMethod: 'UPI / NetBanking' | 'Corporate Wire' | 'Credit Card';
  status: 'Success' | 'Processing' | 'Failed';
  invoiceUrl: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: UserRole;
  ipAddress: string;
  action: string;
  module: string;
  status: 'Success' | 'Warning' | 'Error';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'urgent';
  roleTarget: UserRole | 'all';
}
