/**
 * Demo Data Generator for Learn It Platform
 * Generates realistic enterprise demo data for client demonstrations
 */

const firstNames = [
  'Aarav', 'Advait', 'Aditya', 'Akshay', 'Amol', 'Ananya', 'Aniket', 'Anirudh', 'Anish', 'Anuj',
  'Arjun', 'Aryan', 'Atharv', 'Aviral', 'Ayush', 'Bhavya', 'Chaitanya', 'Darshan', 'Deepak', 'Devansh',
  'Dhruv', 'Diya', 'Divya', 'Gaurav', 'Gautam', 'Harsh', 'Hrithik', 'Ishaan', 'Ishita', 'Jai',
  'Kabir', 'Kairav', 'Karthik', 'Kavya', 'Khushi', 'Kiran', 'Krishna', 'Kunal', 'Laksh', 'Madhav',
  'Manav', 'Manish', 'Mayank', 'Meera', 'Mohan', 'Neha', 'Nikhil', 'Nirav', 'Nishant', 'Nitin',
  'Pari', 'Pranav', 'Pranshu', 'Pratik', 'Priya', 'Pulkit', 'Rahul', 'Raj', 'Rajat', 'Rakesh',
  'Raman', 'Ravi', 'Ritvik', 'Rohan', 'Rohit', 'Ruchi', 'Sachin', 'Sahil', 'Samarth', 'Sankalp',
  'Sanskriti', 'Sara', 'Sarthak', 'Saurabh', 'Shreya', 'Shreyas', 'Siddharth', 'Soham', 'Sourav', 'Sruti',
  'Suman', 'Surya', 'Tanvi', 'Tarun', 'Tejas', 'Trisha', 'Uday', 'Utkarsh', 'Vansh', 'Varun',
  'Vedant', 'Veer', 'Vikram', 'Vikrant', 'Vinay', 'Vinit', 'Viraj', 'Vishal', 'Yash', 'Yuvraj'
];

const mentorFirstNames = [
  'Dr.', 'Prof.', 'Prof. Dr.', 'Assistant Prof.', 'Associate Prof.'
];

const lastNames = [
  'Agarwal', 'Ahluwalia', 'Ahuja', 'Anand', 'Apte', 'Arora', 'Awasthi', 'Bajaj', 'Bakshi', 'Balasubramanian',
  'Bansal', 'Barman', 'Basu', 'Bedi', 'Bhat', 'Bhatia', 'Bhatt', 'Biswas', 'Bose', 'Chakrabarti',
  'Chakraborty', 'Chandra', 'Chatterjee', 'Chauhan', 'Chopra', 'Das', 'Dass', 'Dayal', 'De', 'Desai',
  'Deshmukh', 'Dewan', 'Dey', 'Dixit', 'Dubey', 'Dutta', 'Gaba', 'Gade', 'Gandhi', 'Garg',
  'Gaur', 'Ghosh', 'Goel', 'Gokhale', 'Gopal', 'Gopalakrishnan', 'Goswami', 'Goyal', 'Gupta', 'Hegde',
  'Iyer', 'Jain', 'Jain', 'Jha', 'Joshi', 'Kapoor', 'Kaur', 'Khanna', 'Khatri', 'Kohli',
  'Krishna', 'Krishnamurthy', 'Kulkarni', 'Kumar', 'Kumari', 'Kundu', 'Lal', 'Madhavan', 'Mahajan', 'Maheshwari',
  'Malhotra', 'Malik', 'Marar', 'Mehta', 'Menon', 'Mishra', 'Mohan', 'Mukherjee', 'Murthy', 'Nair',
  'Narain', 'Narayanan', 'Natarajan', 'Nayak', 'Nigam', 'Pai', 'Pandey', 'Pandit', 'Parekh', 'Parikh',
  'Patel', 'Patil', 'Pillai', 'Prakash', 'Prasad', 'Puri', 'Rai', 'Rajan', 'Rajguru', 'Raju',
  'Ramakrishnan', 'Raman', 'Ramanathan', 'Ramesh', 'Rao', 'Rastogi', 'Rath', 'Rathi', 'Reddy', 'Rout',
  'Roy', 'Sachdev', 'Sagar', 'Sahai', 'Sahni', 'Saini', 'Saksena', 'Saman', 'Sampath', 'Sandeep',
  'Sanghvi', 'Sankaran', 'Santosh', 'Saran', 'Sarin', 'Sarma', 'Sarraf', 'Saxena', 'Sen', 'Sengupta',
  'Shah', 'Shankar', 'Sharma', 'Shenoy', 'Shetty', 'Shinde', 'Shukla', 'Singh', 'Singhal', 'Sinha',
  'Sivakumar', 'Sodhi', 'Sood', 'Soni', 'Srinivas', 'Srinivasan', 'Subramanian', 'Sundaram', 'Suresh', 'Swaminathan',
  'Talwar', 'Tanwar', 'Tata', 'Tewari', 'Thakkar', 'Thakur', 'Thomas', 'Tiwari', 'Tripathi', 'Trivedi',
  'Tyagi', 'Udupa', 'Ullal', 'Upadhyay', 'Vaidya', 'Vaishnav', 'Varma', 'Varma', 'Vashisht', 'Vats',
  'Venkat', 'Venkatesh', 'Venkatesh', 'Verma', 'Vijay', 'Vijayakumar', 'Vikram', 'Vishwakarma', 'Yadav', 'Yadav'
];

const departments = [
  { id: 'dept_1', code: 'CSE', name: 'Computer Science & Engineering' },
  { id: 'dept_2', code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
  { id: 'dept_3', code: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
  { id: 'dept_4', code: 'IT', name: 'Information Technology' },
  { id: 'dept_5', code: 'ECE', name: 'Electronics & Communication' },
  { id: 'dept_6', code: 'EEE', name: 'Electrical & Electronics' },
  { id: 'dept_7', code: 'MECH', name: 'Mechanical Engineering' },
  { id: 'dept_8', code: 'CIVIL', name: 'Civil Engineering' },
  { id: 'dept_9', code: 'CHEM', name: 'Chemical Engineering' },
  { id: 'dept_10', code: 'BIO', name: 'Biotechnology' }
];

const skills = [
  'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript',
  'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
  'Data Science', 'Data Analysis', 'Pandas', 'NumPy', 'Matplotlib', 'Tableau',
  'DevOps', 'CI/CD', 'Jenkins', 'GitLab', 'GitHub Actions', 'CircleCI',
  'System Design', 'Microservices', 'REST APIs', 'GraphQL', 'gRPC',
  'Mobile Development', 'React Native', 'Flutter', 'iOS', 'Android',
  'Cyber Security', 'Network Security', 'Penetration Testing', 'Cryptography',
  'Cloud Computing', 'Serverless', 'Lambda Functions', 'Edge Computing',
  'Blockchain', 'Web3', 'Smart Contracts', 'Solidity',
  'IoT', 'Embedded Systems', 'Arduino', 'Raspberry Pi',
  'AutoCAD', 'SolidWorks', 'ANSYS', 'CATIA', 'MATLAB', 'Simulink'
];

const placementStatuses = ['Placed', 'In Process', 'Seeking', 'Not Eligible'];
const feeStatuses = ['Paid', 'Pending', 'Partial'];
const companies = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Adobe', 'Salesforce',
  'Oracle', 'IBM', 'Deloitte', 'Accenture', 'TCS', 'Infosys', 'Wipro', 'HCL',
  'Cognizant', 'Tech Mahindra', 'L&T Infotech', 'Mindtree', 'Mphasis', 'Zoho',
  'Freshworks', 'BrowserStack', 'Postman', 'Razorpay', 'PhonePe', 'Paytm',
  'Flipkart', 'Amazon', 'Swiggy', 'Zomato', 'Ola', 'Uber', 'BYJU\'s'
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateStudent(id: number, collegeId: string, collegeName: string, batchId: string, batchName: string): any {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const department = randomItem(departments);
  const year = randomInt(2024, 2026);
  const rollNum = randomInt(1, 150);
  
  const cgpa = randomFloat(6.5, 9.8, 2);
  const attendance = randomFloat(75, 98, 1);
  const placementStatus = cgpa >= 8.0 ? randomItem(placementStatuses) : 'Not Eligible';
  
  let placedCompany: string | undefined;
  let packageLPA: number | undefined;
  
  if (placementStatus === 'Placed') {
    placedCompany = randomItem(companies);
    packageLPA = randomFloat(6, 32, 1);
  }
  
  const studentSkills = randomItems(skills, randomInt(4, 8));
  
  return {
    id: `std_${id}`,
    name: `${firstName} ${lastName}`,
    rollNumber: `${year}-${department.code}-${String(rollNum).padStart(3, '0')}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@${collegeName.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.edu`,
    phone: `+91 ${randomInt(90000, 99999)} ${randomInt(10000, 99999)}`,
    avatar: `https://images.unsplash.com/photo-${randomInt(1500000000000, 1600000000000)}?auto=format&fit=crop&w=250&q=80`,
    collegeId,
    collegeName,
    departmentId: department.id,
    departmentName: department.name,
    batchId,
    batchName,
    cgpa,
    attendancePct: attendance,
    feeStatus: randomItem(feeStatuses),
    placementStatus,
    placedCompany,
    packageLPA,
    skills: studentSkills
  };
}

function generateStudents(count: number): any[] {
  const students = [];
  const colleges = [
    { id: 'clg_1', name: "St. Xavier's Institute of Technology" },
    { id: 'clg_2', name: 'Anna University Affiliated College' },
    { id: 'clg_3', name: 'SRM Institute of Science and Technology' }
  ];
  
  const batches = [
    { id: 'batch_1', name: 'BATCH-2026-CSE-ALPHA' },
    { id: 'batch_2', name: 'BATCH-2026-AIDS-BETA' },
    { id: 'batch_3', name: 'BATCH-2026-IT-GAMMA' },
    { id: 'batch_4', name: 'BATCH-2026-AIML-DELTA' },
    { id: 'batch_5', name: 'BATCH-2026-ECE-EPSILON' },
    { id: 'batch_6', name: 'BATCH-2026-MECH-ZETA' }
  ];
  
  for (let i = 1; i <= count; i++) {
    const college = randomItem(colleges);
    const batch = randomItem(batches);
    students.push(generateStudent(i, college.id, college.name, batch.id, batch.name));
  }
  
  return students;
}

function generateAttendanceRecords(studentCount: number): any[] {
  const records = [];
  const statuses: ('Present' | 'Absent' | 'Late')[] = ['Present', 'Absent', 'Late'];
  const batches = ['batch_1', 'batch_2', 'batch_3', 'batch_4', 'batch_5', 'batch_6'];
  
  // Generate daily attendance for 90 days
  for (let i = 1; i <= studentCount; i++) {
    for (let day = 1; day <= 90; day++) {
      const date = new Date(2026, 3, day); // Starting from April 2026
      date.setDate(date.getDate() + day);
      
      // Skip weekends
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      records.push({
        id: `att_${records.length + 1}`,
        batchId: randomItem(batches),
        studentId: `std_${i}`,
        studentName: `Student ${i}`,
        rollNumber: `2026-CSE-${String(i).padStart(3, '0')}`,
        date: date.toISOString().split('T')[0],
        status: randomItem(statuses),
        markedBy: randomItem(['Ananya Deshmukh', 'Prof. Vikram Singh', 'Dr. Priya Natarajan']),
        remarks: Math.random() > 0.9 ? randomItem(['Medical leave', 'Family emergency', 'Late due to transport']) : undefined
      });
    }
  }
  
  return records;
}

function generateAssignmentSubmissions(studentCount: number): any[] {
  const submissions = [];
  const assignments = [
    { id: 'asn_1', title: 'React Todo App', dueDate: '2026-02-15' },
    { id: 'asn_2', title: 'Node.js REST API', dueDate: '2026-03-20' },
    { id: 'asn_3', title: 'Database Design Project', dueDate: '2026-04-25' },
    { id: 'asn_4', title: 'Machine Learning Model', dueDate: '2026-05-30' },
    { id: 'asn_5', title: 'Cloud Deployment', dueDate: '2026-06-15' }
  ];
  const batches = ['batch_1', 'batch_2', 'batch_3', 'batch_4', 'batch_5', 'batch_6'];
  const programs = ['Enterprise Full Stack Engineering & Cloud Architecture', 'Applied AI, Large Language Models & MLOps', 'DevOps Infrastructure & Kubernetes Security'];
  
  for (let i = 1; i <= studentCount; i++) {
    for (const assignment of assignments) {
      const isSubmitted = Math.random() > 0.15;
      const isLate = isSubmitted && Math.random() > 0.7;
      
      if (isSubmitted) {
        submissions.push({
          id: `sub_${submissions.length + 1}`,
          assignmentId: assignment.id,
          studentId: `std_${i}`,
          studentName: `Student ${i}`,
          submittedAt: isLate 
            ? new Date(new Date(assignment.dueDate).getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : new Date(new Date(assignment.dueDate).getTime() - randomInt(1, 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          fileUrl: `/submissions/std_${i}_${assignment.id}.zip`,
          fileName: `${assignment.title.replace(/\s+/g, '_')}_std_${i}.zip`,
          status: 'Graded',
          marksObtained: randomInt(60, 100),
          feedback: randomItem(['Excellent work!', 'Good effort', 'Needs improvement', 'Well documented', 'Great implementation'])
        });
      } else {
        submissions.push({
          id: `sub_${submissions.length + 1}`,
          assignmentId: assignment.id,
          studentId: `std_${i}`,
          studentName: `Student ${i}`,
          submittedAt: '',
          fileUrl: '',
          fileName: '',
          status: 'Overdue',
          marksObtained: undefined,
          feedback: undefined
        });
      }
    }
  }
  
  return submissions;
}

function generateAssessments(studentCount: number): any[] {
  const assessments = [];
  const assessmentTypes = ['MCQ', 'Practical', 'Coding', 'Offline Test'];
  const batches = ['batch_1', 'batch_2', 'batch_3', 'batch_4', 'batch_5', 'batch_6'];
  const programs = ['Enterprise Full Stack Engineering & Cloud Architecture', 'Applied AI, Large Language Models & MLOps', 'DevOps Infrastructure & Kubernetes Security'];
  
  for (let i = 1; i <= studentCount; i++) {
    for (let j = 1; j <= 4; j++) {
      const type = randomItem(assessmentTypes);
      const score = randomInt(35, 100);
      
      assessments.push({
        id: `asm_${assessments.length + 1}`,
        batchId: randomItem(batches),
        programTitle: randomItem(programs),
        title: `${type} Assessment ${j}`,
        totalQuestions: randomInt(20, 50),
        durationMinutes: randomInt(30, 120),
        totalMarks: 100,
        passPercentage: 40,
        status: 'Completed'
      });
    }
  }
  
  return assessments;
}

function generateMentors(count: number): any[] {
  const mentors = [];
  const specializations = [
    'Full Stack Development', 'Cloud Architecture', 'DevOps & CI/CD',
    'Machine Learning & AI', 'Data Science', 'Mobile Development',
    'Cyber Security', 'Blockchain', 'IoT & Embedded Systems',
    'Database Administration', 'System Design', 'Microservices'
  ];
  const colleges = [
    { id: 'clg_1', name: "St. Xavier's Institute of Technology" },
    { id: 'clg_2', name: 'Anna University Affiliated College' },
    { id: 'clg_3', name: 'SRM Institute of Science and Technology' }
  ];
  
  for (let i = 1; i <= count; i++) {
    const title = randomItem(mentorFirstNames);
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const college = randomItem(colleges);
    
    mentors.push({
      id: `usr_mentor_${i}`,
      name: `${title} ${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@learnit.hq`,
      phone: `+91 ${randomInt(90000, 99999)} ${randomInt(10000, 99999)}`,
      avatar: `https://images.unsplash.com/photo-${randomInt(1500000000000, 1600000000000)}?auto=format&fit=crop&w=250&q=80`,
      specialization: randomItem(specializations),
      collegeId: college.id,
      collegeName: college.name,
      assignedBatchesCount: randomInt(1, 4),
      totalStudentsMentored: randomInt(50, 200),
      rating: randomFloat(4.0, 5.0, 1),
      experienceYears: randomInt(3, 15)
    });
  }
  
  return mentors;
}

function generateCertificates(studentCount: number): any[] {
  const certificates = [];
  const programs = [
    'Enterprise Full Stack Engineering & Cloud Architecture',
    'Applied AI, Large Language Models & MLOps',
    'DevOps Infrastructure & Kubernetes Security',
    'Data Science & Analytics',
    'Cyber Security & Network Defense'
  ];
  
  // Generate certificates for students with CGPA >= 8.0
  for (let i = 1; i <= studentCount; i++) {
    const shouldHaveCertificate = Math.random() > 0.4; // 60% chance
    
    if (shouldHaveCertificate) {
      certificates.push({
        id: `cert_${certificates.length + 1}`,
        certificateNumber: `LIT-2026-${randomInt(10000, 99999)}`,
        studentId: `std_${i}`,
        studentName: `Student ${i}`,
        collegeName: randomItem(["St. Xavier's Institute of Technology", 'Anna University Affiliated College', 'SRM Institute of Science and Technology']),
        programTitle: randomItem(programs),
        issuedDate: new Date(2026, randomInt(0, 7), randomInt(1, 28)).toISOString().split('T')[0],
        verifyUrl: `https://learnit.hq/verify/LIT-2026-${randomInt(10000, 99999)}`
      });
    }
  }
  
  return certificates;
}

function generatePaymentTransactions(count: number): any[] {
  const transactions = [];
  const entityTypes = ['College Subscription', 'Student Fee', 'Enterprise License', 'Training Program'];
  const statuses = ['Completed', 'Pending', 'Failed', 'Refunded'];
  const colleges = ['clg_1', 'clg_2', 'clg_3'];
  
  for (let i = 1; i <= count; i++) {
    const amount = randomFloat(50000, 2000000, 0);
    
    transactions.push({
      id: `txn_${transactions.length + 1}`,
      entityType: randomItem(entityTypes),
      entityId: randomItem(colleges),
      entityName: randomItem(["St. Xavier's Institute of Technology", 'Anna University Affiliated College', 'SRM Institute of Science and Technology']),
      amount: amount,
      currency: 'INR',
      status: randomItem(statuses),
      paymentMethod: randomItem(['UPI', 'Bank Transfer', 'Credit Card', 'Net Banking']),
      transactionDate: new Date(2026, randomInt(0, 7), randomInt(1, 28)).toISOString().split('T')[0],
      invoiceNumber: `INV-${2026}-${String(randomInt(1000, 9999)).padStart(4, '0')}`
    });
  }
  
  return transactions;
}

function generateNotifications(count: number): any[] {
  const notifications = [];
  const types = ['urgent', 'warning', 'success', 'info'];
  const roleTargets = ['all', 'student', 'mentor', 'college_admin', 'super_admin'];
  
  const titles = [
    'System Maintenance Scheduled',
    'Assignment Graded',
    'New College Renewal Due',
    'New Assessment Available',
    'Batch Attendance Updated',
    'Payment Received',
    'New Learning Material Uploaded',
    'Certificate Issued',
    'Batch Schedule Changed',
    'Mentor Assignment Updated',
    'Fee Payment Reminder',
    'Course Content Updated'
  ];
  
  const messages = [
    'Platform maintenance scheduled for Aug 15, 2026 from 2:00 AM to 4:00 AM.',
    'Mentor graded your submission with excellent marks.',
    'College contract renewal due in 14 days.',
    'Mid-Term assessment is now available for practice.',
    'Attendance for BATCH has been marked for today.',
    'Subscription payment received successfully.',
    'New lecture material is now available.',
    'Certificate has been issued successfully.',
    'Batch schedule has been updated.',
    'Mentor assignment has been updated.',
    'Fee payment due date is approaching.',
    'Course content has been updated with new modules.'
  ];
  
  for (let i = 1; i <= count; i++) {
    notifications.push({
      id: `notif_${i}`,
      title: randomItem(titles),
      message: randomItem(messages),
      timestamp: `${randomInt(1, 59)} ${randomItem(['mins', 'hours', 'days'])} ago`,
      read: Math.random() > 0.4,
      type: randomItem(types),
      roleTarget: randomItem(roleTargets)
    });
  }
  
  return notifications;
}

// Generate the data
console.log('Generating demo data...');
const students = generateStudents(300);
const attendanceRecords = generateAttendanceRecords(300);
const assignmentSubmissions = generateAssignmentSubmissions(300);
const assessments = generateAssessments(300);
const mentors = generateMentors(25);
const certificates = generateCertificates(300);
const paymentTransactions = generatePaymentTransactions(50);
const notifications = generateNotifications(25);

console.log('Students:', students.length);
console.log('Attendance Records:', attendanceRecords.length);
console.log('Assignment Submissions:', assignmentSubmissions.length);
console.log('Assessments:', assessments.length);
console.log('Mentors:', mentors.length);
console.log('Certificates:', certificates.length);
console.log('Payment Transactions:', paymentTransactions.length);
console.log('Notifications:', notifications.length);

// Write to JSON file for easier handling
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'generatedStudents.json'),
  JSON.stringify(students, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'generatedAttendance.json'),
  JSON.stringify(attendanceRecords, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'generatedSubmissions.json'),
  JSON.stringify(assignmentSubmissions, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'generatedAssessments.json'),
  JSON.stringify(assessments, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'generatedMentors.json'),
  JSON.stringify(mentors, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'generatedCertificates.json'),
  JSON.stringify(certificates, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'generatedPayments.json'),
  JSON.stringify(paymentTransactions, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'generatedNotifications.json'),
  JSON.stringify(notifications, null, 2)
);

console.log('\nData written to src/data/ directory');
console.log('Files generated:');
console.log('- generatedStudents.json');
console.log('- generatedAttendance.json');
console.log('- generatedSubmissions.json');
console.log('- generatedAssessments.json');
console.log('- generatedMentors.json');
console.log('- generatedCertificates.json');
console.log('- generatedPayments.json');
console.log('- generatedNotifications.json');

export {
  generateStudents,
  generateAttendanceRecords,
  generateAssignmentSubmissions,
  generateAssessments,
  generateMentors,
  generateCertificates,
  generatePaymentTransactions,
  generateNotifications
};
