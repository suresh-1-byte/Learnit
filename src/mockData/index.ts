import {
  UserProfile,
  NotificationItem,
  PartnerCollege,
  Department,
  TrainingProgram,
  Batch,
  Student,
  Mentor,
  Certificate,
  PaymentTransaction,
  SystemAuditLog,
  AttendanceRecord,
  AssignmentSubmission
} from '../types';

// Mock User Profiles
export const mockUserProfiles: Record<string, UserProfile> = {
  super_admin: {
    id: 'user_001',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@learnit.com',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    title: 'Chief Technology Officer'
  },
  college_admin: {
    id: 'user_002',
    name: 'Prof. James Wilson',
    email: 'james.wilson@stxavier.edu',
    role: 'college_admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    collegeId: 'clg_001',
    collegeName: "St. Xavier's Institute of Technology",
    title: 'Dean of Engineering'
  },
  mentor: {
    id: 'user_003',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@learnit.com',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    collegeId: 'clg_001',
    collegeName: "St. Xavier's Institute of Technology",
    title: 'Senior AI/ML Mentor'
  },
  student: {
    id: 'user_004',
    name: 'Alex Kumar',
    email: 'alex.kumar@stxavier.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    collegeId: 'clg_001',
    collegeName: "St. Xavier's Institute of Technology",
    departmentId: 'dept_001',
    departmentName: 'Computer Science Engineering',
    title: 'Final Year Student'
  }
};

// Mock Notifications
export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_001',
    title: 'New Batch Assignment',
    message: 'You have been assigned as mentor for BATCH-2026-CSE-A starting next week.',
    timestamp: '2 hours ago',
    read: false,
    type: 'info',
    roleTarget: 'mentor'
  },
  {
    id: 'notif_002',
    title: 'Payment Received',
    message: 'Annual subscription payment of ₹1,200,000 received from Bangalore National Institute.',
    timestamp: '5 hours ago',
    read: false,
    type: 'success',
    roleTarget: 'super_admin'
  },
  {
    id: 'notif_003',
    title: 'Attendance Alert',
    message: 'CSE Department attendance dropped below 85% this week. Review required.',
    timestamp: '1 day ago',
    read: true,
    type: 'warning',
    roleTarget: 'college_admin'
  },
  {
    id: 'notif_004',
    title: 'Certificate Issued',
    message: 'Certificate #CERT-88419 has been issued to Alex Kumar for Full Stack Development program.',
    timestamp: '2 days ago',
    read: true,
    type: 'success',
    roleTarget: 'all'
  }
];

// Mock Partner Colleges
export const mockPartnerColleges: PartnerCollege[] = [
  {
    id: 'clg_001',
    name: "St. Xavier's Institute of Technology",
    code: 'SXT',
    location: 'Mumbai',
    state: 'Maharashtra',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=150&q=80',
    contractStatus: 'Active',
    planTier: 'Enterprise',
    joinedDate: '2024-01-15',
    totalDepartments: 6,
    totalStudents: 2400,
    totalMentors: 24,
    placementRate: 92.5,
    annualFee: 1200000,
    contactPerson: 'Prof. James Wilson',
    contactEmail: 'james.wilson@stxavier.edu'
  },
  {
    id: 'clg_002',
    name: 'Bangalore National Institute',
    code: 'BNI',
    location: 'Bangalore',
    state: 'Karnataka',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=150&q=80',
    contractStatus: 'Active',
    planTier: 'Enterprise',
    joinedDate: '2024-02-20',
    totalDepartments: 8,
    totalStudents: 3200,
    totalMentors: 32,
    placementRate: 88.0,
    annualFee: 1500000,
    contactPerson: 'Dr. Kavita Menon',
    contactEmail: 'kavita.menon@bni.edu'
  },
  {
    id: 'clg_003',
    name: 'Delhi College of Engineering',
    code: 'DCE',
    location: 'Delhi',
    state: 'Delhi',
    logo: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=150&q=80',
    contractStatus: 'Active',
    planTier: 'Professional',
    joinedDate: '2024-03-10',
    totalDepartments: 5,
    totalStudents: 1800,
    totalMentors: 18,
    placementRate: 85.5,
    annualFee: 900000,
    contactPerson: 'Er. Alok Srivastava',
    contactEmail: 'alok.srivastava@dce.edu'
  },
  {
    id: 'clg_004',
    name: 'Pune Engineering Academy',
    code: 'PEA',
    location: 'Pune',
    state: 'Maharashtra',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=150&q=80',
    contractStatus: 'Pending Renewal',
    planTier: 'Standard',
    joinedDate: '2023-06-01',
    totalDepartments: 4,
    totalStudents: 1200,
    totalMentors: 12,
    placementRate: 78.0,
    annualFee: 600000,
    contactPerson: 'Prof. Suresh Nair',
    contactEmail: 'suresh.nair@pea.edu'
  }
];

// Mock Departments
export const mockDepartments: Department[] = [
  {
    id: 'dept_001',
    collegeId: 'clg_001',
    name: 'Computer Science Engineering',
    code: 'CSE',
    headOfDepartment: 'Dr. Priya Sharma',
    totalBatches: 4,
    totalStudents: 480
  },
  {
    id: 'dept_002',
    collegeId: 'clg_001',
    name: 'Electronics & Communication',
    code: 'ECE',
    headOfDepartment: 'Dr. Rajesh Verma',
    totalBatches: 3,
    totalStudents: 360
  },
  {
    id: 'dept_003',
    collegeId: 'clg_002',
    name: 'Artificial Intelligence & Data Science',
    code: 'AI-DS',
    headOfDepartment: 'Dr. Anand Patel',
    totalBatches: 3,
    totalStudents: 420
  },
  {
    id: 'dept_004',
    collegeId: 'clg_003',
    name: 'Mechanical Engineering',
    code: 'ME',
    headOfDepartment: 'Prof. Sunil Kumar',
    totalBatches: 4,
    totalStudents: 480
  }
];

// Mock Training Programs
export const mockTrainingPrograms: TrainingProgram[] = [
  {
    id: 'prog_001',
    title: 'Full Stack Development',
    code: 'FSD-2026',
    category: 'Full Stack Development',
    durationWeeks: 24,
    totalModules: 12,
    totalHours: 120,
    description: 'Comprehensive full-stack development covering React, Node.js, databases, and cloud deployment.',
    enrolledStudentsCount: 850
  },
  {
    id: 'prog_002',
    title: 'Data Science & AI',
    code: 'DSAI-2026',
    category: 'Data Science & AI',
    durationWeeks: 20,
    totalModules: 10,
    totalHours: 100,
    description: 'Machine learning, deep learning, and data engineering with Python and TensorFlow.',
    enrolledStudentsCount: 620
  },
  {
    id: 'prog_003',
    title: 'Cloud & DevOps',
    code: 'CDO-2026',
    category: 'Cloud & DevOps',
    durationWeeks: 16,
    totalModules: 8,
    totalHours: 80,
    description: 'AWS, Docker, Kubernetes, CI/CD pipelines and infrastructure as code.',
    enrolledStudentsCount: 480
  },
  {
    id: 'prog_004',
    title: 'Cyber Security',
    code: 'SEC-2026',
    category: 'Cyber Security',
    durationWeeks: 18,
    totalModules: 9,
    totalHours: 90,
    description: 'Network security, ethical hacking, penetration testing and security compliance.',
    enrolledStudentsCount: 340
  }
];

// Mock Batches
export const mockBatches: Batch[] = [
  {
    id: 'batch_001',
    collegeId: 'clg_001',
    departmentId: 'dept_001',
    programId: 'prog_001',
    programTitle: 'Full Stack Development',
    name: 'BATCH-2026-CSE-A',
    startDate: '2026-01-15',
    endDate: '2026-07-15',
    mentorId: 'user_003',
    mentorName: 'Dr. Emily Rodriguez',
    studentCount: 45,
    status: 'Ongoing',
    averageAttendance: 92.5
  },
  {
    id: 'batch_002',
    collegeId: 'clg_002',
    departmentId: 'dept_003',
    programId: 'prog_002',
    programTitle: 'Data Science & AI',
    name: 'BATCH-2026-AI-B',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    mentorId: 'user_005',
    mentorName: 'Dr. Michael Foster',
    studentCount: 52,
    status: 'Ongoing',
    averageAttendance: 88.0
  },
  {
    id: 'batch_003',
    collegeId: 'clg_003',
    departmentId: 'dept_004',
    programId: 'prog_003',
    programTitle: 'Cloud & DevOps',
    name: 'BATCH-2026-DEV-A',
    startDate: '2026-03-01',
    endDate: '2026-06-15',
    mentorId: 'user_006',
    mentorName: 'Prof. Lisa Chang',
    studentCount: 38,
    status: 'Upcoming',
    averageAttendance: 0
  }
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'stu_001',
    name: 'Alex Kumar',
    rollNumber: 'SXT2024001',
    email: 'alex.kumar@stxavier.edu',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    collegeId: 'clg_001',
    collegeName: "St. Xavier's Institute of Technology",
    departmentId: 'dept_001',
    departmentName: 'Computer Science Engineering',
    batchId: 'batch_001',
    batchName: 'BATCH-2026-CSE-A',
    cgpa: 8.5,
    attendancePct: 92,
    feeStatus: 'Paid',
    placementStatus: 'Placed',
    placedCompany: 'Microsoft',
    packageLPA: 22,
    skills: ['React', 'Node.js', 'Python', 'AWS']
  },
  {
    id: 'stu_002',
    name: 'Priya Sharma',
    rollNumber: 'BNI2024001',
    email: 'priya.sharma@bni.edu',
    phone: '+91 98765 43211',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    collegeId: 'clg_002',
    collegeName: 'Bangalore National Institute',
    departmentId: 'dept_003',
    departmentName: 'Artificial Intelligence & Data Science',
    batchId: 'batch_002',
    batchName: 'BATCH-2026-AI-B',
    cgpa: 9.0,
    attendancePct: 95,
    feeStatus: 'Paid',
    placementStatus: 'In Process',
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Analysis']
  },
  {
    id: 'stu_003',
    name: 'Rahul Verma',
    rollNumber: 'DCE2024001',
    email: 'rahul.verma@dce.edu',
    phone: '+91 98765 43212',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    collegeId: 'clg_003',
    collegeName: 'Delhi College of Engineering',
    departmentId: 'dept_004',
    departmentName: 'Mechanical Engineering',
    batchId: 'batch_003',
    batchName: 'BATCH-2026-DEV-A',
    cgpa: 7.8,
    attendancePct: 85,
    feeStatus: 'Pending',
    placementStatus: 'Seeking',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Linux']
  },
  {
    id: 'stu_004',
    name: 'Sneha Patel',
    rollNumber: 'SXT2024002',
    email: 'sneha.patel@stxavier.edu',
    phone: '+91 98765 43213',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    collegeId: 'clg_001',
    collegeName: "St. Xavier's Institute of Technology",
    departmentId: 'dept_001',
    departmentName: 'Computer Science Engineering',
    batchId: 'batch_001',
    batchName: 'BATCH-2026-CSE-A',
    cgpa: 8.2,
    attendancePct: 88,
    feeStatus: 'Partial',
    placementStatus: 'In Process',
    skills: ['React', 'TypeScript', 'MongoDB', 'GraphQL']
  },
  {
    id: 'stu_005',
    name: 'Vikram Singh',
    rollNumber: 'PEA2024001',
    email: 'vikram.singh@pea.edu',
    phone: '+91 98765 43214',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    collegeId: 'clg_004',
    collegeName: 'Pune Engineering Academy',
    departmentId: 'dept_002',
    departmentName: 'Electronics & Communication',
    batchId: 'batch_001',
    batchName: 'BATCH-2026-CSE-A',
    cgpa: 7.5,
    attendancePct: 82,
    feeStatus: 'Pending',
    placementStatus: 'Not Eligible',
    skills: ['IoT', 'Embedded Systems', 'C++', 'Python']
  }
];

// Mock Mentors
export const mockMentors: Mentor[] = [
  {
    id: 'user_003',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@learnit.com',
    phone: '+91 98765 11111',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    specialization: 'AI/ML & Full Stack',
    collegeId: 'clg_001',
    collegeName: "St. Xavier's Institute of Technology",
    assignedBatchesCount: 3,
    totalStudentsMentored: 145,
    rating: 4.8,
    experienceYears: 12
  },
  {
    id: 'user_005',
    name: 'Dr. Michael Foster',
    email: 'michael.foster@learnit.com',
    phone: '+91 98765 11112',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    specialization: 'Data Science & Analytics',
    collegeId: 'clg_002',
    collegeName: 'Bangalore National Institute',
    assignedBatchesCount: 2,
    totalStudentsMentored: 98,
    rating: 4.7,
    experienceYears: 10
  },
  {
    id: 'user_006',
    name: 'Prof. Lisa Chang',
    email: 'lisa.chang@learnit.com',
    phone: '+91 98765 11113',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    specialization: 'Cloud & DevOps',
    collegeId: 'clg_003',
    collegeName: 'Delhi College of Engineering',
    assignedBatchesCount: 2,
    totalStudentsMentored: 76,
    rating: 4.9,
    experienceYears: 8
  }
];

// Mock Certificates
export const mockCertificates: Certificate[] = [
  {
    id: 'cert_001',
    certificateNumber: 'LIT-88419-VERIFIED',
    studentId: 'stu_001',
    studentName: 'Alex Kumar',
    collegeName: "St. Xavier's Institute of Technology",
    programTitle: 'Full Stack Development',
    issuedDate: '2026-07-20',
    grade: 'Distinction',
    verifyUrl: 'https://learnit.com/verify/LIT-88419-VERIFIED'
  },
  {
    id: 'cert_002',
    certificateNumber: 'LIT-88420-VERIFIED',
    studentId: 'stu_002',
    studentName: 'Priya Sharma',
    collegeName: 'Bangalore National Institute',
    programTitle: 'Data Science & AI',
    issuedDate: '2026-06-30',
    grade: 'First Class',
    verifyUrl: 'https://learnit.com/verify/LIT-88420-VERIFIED'
  },
  {
    id: 'cert_003',
    certificateNumber: 'LIT-88421-VERIFIED',
    studentId: 'stu_004',
    studentName: 'Sneha Patel',
    collegeName: "St. Xavier's Institute of Technology",
    programTitle: 'Full Stack Development',
    issuedDate: '2026-07-15',
    grade: 'Pass',
    verifyUrl: 'https://learnit.com/verify/LIT-88421-VERIFIED'
  }
];

// Mock Payment Transactions
export const mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: 'txn_001',
    transactionRef: 'TXN-2026-001',
    entityType: 'College Subscription',
    entityName: 'Enterprise Tier - Annual',
    collegeName: "St. Xavier's Institute of Technology",
    amount: 1200000,
    date: '2026-01-15',
    paymentMethod: 'Corporate Wire',
    status: 'Success',
    invoiceUrl: 'https://learnit.com/invoices/TXN-2026-001.pdf'
  },
  {
    id: 'txn_002',
    transactionRef: 'TXN-2026-002',
    entityType: 'College Subscription',
    entityName: 'Enterprise Tier - Annual',
    collegeName: 'Bangalore National Institute',
    amount: 1500000,
    date: '2026-02-20',
    paymentMethod: 'Corporate Wire',
    status: 'Success',
    invoiceUrl: 'https://learnit.com/invoices/TXN-2026-002.pdf'
  },
  {
    id: 'txn_003',
    transactionRef: 'TXN-2026-003',
    entityType: 'Student Fee',
    entityName: 'Full Stack Development Program',
    collegeName: "St. Xavier's Institute of Technology",
    amount: 45000,
    date: '2026-01-20',
    paymentMethod: 'UPI / NetBanking',
    status: 'Success',
    invoiceUrl: 'https://learnit.com/invoices/TXN-2026-003.pdf'
  },
  {
    id: 'txn_004',
    transactionRef: 'TXN-2026-004',
    entityType: 'College Subscription',
    entityName: 'Professional Tier - Annual',
    collegeName: 'Delhi College of Engineering',
    amount: 900000,
    date: '2026-03-10',
    paymentMethod: 'Corporate Wire',
    status: 'Processing',
    invoiceUrl: 'https://learnit.com/invoices/TXN-2026-004.pdf'
  }
];

// Mock Audit Logs
export const mockAuditLogs: SystemAuditLog[] = [
  {
    id: 'log_001',
    timestamp: '2026-08-04 14:32:15',
    userEmail: 'sarah.chen@learnit.com',
    userRole: 'super_admin',
    ipAddress: '192.168.1.100',
    action: 'Created new college partner',
    module: 'College Management',
    status: 'Success'
  },
  {
    id: 'log_002',
    timestamp: '2026-08-04 13:45:22',
    userEmail: 'james.wilson@stxavier.edu',
    userRole: 'college_admin',
    ipAddress: '192.168.1.101',
    action: 'Updated batch schedule',
    module: 'Batch Management',
    status: 'Success'
  },
  {
    id: 'log_003',
    timestamp: '2026-08-04 12:30:45',
    userEmail: 'emily.rodriguez@learnit.com',
    userRole: 'mentor',
    ipAddress: '192.168.1.102',
    action: 'Marked student attendance',
    module: 'Attendance',
    status: 'Success'
  },
  {
    id: 'log_004',
    timestamp: '2026-08-04 11:15:33',
    userEmail: 'alex.kumar@stxavier.edu',
    userRole: 'student',
    ipAddress: '192.168.1.103',
    action: 'Submitted assignment',
    module: 'Assignments',
    status: 'Success'
  },
  {
    id: 'log_005',
    timestamp: '2026-08-04 10:05:18',
    userEmail: 'sarah.chen@learnit.com',
    userRole: 'super_admin',
    ipAddress: '192.168.1.100',
    action: 'Failed login attempt',
    module: 'Authentication',
    status: 'Error'
  }
];

// Mock Attendance Records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att_001',
    batchId: 'batch_001',
    studentId: 'stu_001',
    studentName: 'Alex Kumar',
    rollNumber: 'SXT2024001',
    date: '2026-08-04',
    status: 'Present',
    markedBy: 'Dr. Emily Rodriguez',
    remarks: 'On time'
  },
  {
    id: 'att_002',
    batchId: 'batch_001',
    studentId: 'stu_004',
    studentName: 'Sneha Patel',
    rollNumber: 'SXT2024002',
    date: '2026-08-04',
    status: 'Late',
    markedBy: 'Dr. Emily Rodriguez',
    remarks: 'Arrived 15 minutes late'
  },
  {
    id: 'att_003',
    batchId: 'batch_002',
    studentId: 'stu_002',
    studentName: 'Priya Sharma',
    rollNumber: 'BNI2024001',
    date: '2026-08-04',
    status: 'Present',
    markedBy: 'Dr. Michael Foster',
    remarks: ''
  }
];

// Mock Assignment Submissions
export const mockSubmissions: AssignmentSubmission[] = [
  {
    id: 'sub_001',
    assignmentId: 'asn_001',
    studentId: 'stu_001',
    studentName: 'Alex Kumar',
    submittedAt: '2026-08-03 23:45:00',
    fileUrl: 'https://learnit.com/submissions/asn_001_alex_kumar.zip',
    fileName: 'react_project.zip',
    status: 'Graded',
    marksObtained: 85,
    feedback: 'Excellent implementation of React hooks. Good component structure.'
  },
  {
    id: 'sub_002',
    assignmentId: 'asn_001',
    studentId: 'stu_004',
    studentName: 'Sneha Patel',
    submittedAt: '2026-08-04 01:30:00',
    fileUrl: 'https://learnit.com/submissions/asn_001_sneha_patel.zip',
    fileName: 'react_project.zip',
    status: 'Submitted',
    marksObtained: undefined,
    feedback: undefined
  },
  {
    id: 'sub_003',
    assignmentId: 'asn_002',
    studentId: 'stu_002',
    studentName: 'Priya Sharma',
    submittedAt: '2026-08-02 18:00:00',
    fileUrl: 'https://learnit.com/submissions/asn_002_priya_sharma.ipynb',
    fileName: 'ml_model.ipynb',
    status: 'Graded',
    marksObtained: 92,
    feedback: 'Outstanding model accuracy. Great data preprocessing.'
  }
];
