/**
 * Generate Test Students and Assign to Classes
 * Run: npm run generate-students
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Quick student data
const testStudents = [
  { name: 'Arun Kumar', email: 'arun@test.com', rollNumber: 'CS001', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Priya Sharma', email: 'priya@test.com', rollNumber: 'CS002', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Rahul Verma', email: 'rahul@test.com', rollNumber: 'CS003', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=13' },
  { name: 'Sneha Patel', email: 'sneha@test.com', rollNumber: 'CS004', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=9' },
  { name: 'Vikram Singh', email: 'vikram@test.com', rollNumber: 'CS005', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=15' },
  { name: 'Ananya Reddy', email: 'ananya@test.com', rollNumber: 'CS006', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=10' },
  { name: 'Karthik Raj', email: 'karthik@test.com', rollNumber: 'CS007', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=14' },
  { name: 'Divya Krishna', email: 'divya@test.com', rollNumber: 'CS008', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=16' },
  { name: 'Rohan Gupta', email: 'rohan@test.com', rollNumber: 'CS009', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Meera Iyer', email: 'meera@test.com', rollNumber: 'CS010', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=20' },
  { name: 'Arjun Nair', email: 'arjun@test.com', rollNumber: 'CS011', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=17' },
  { name: 'Kavya Menon', email: 'kavya@test.com', rollNumber: 'CS012', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=23' },
  { name: 'Siddharth Bose', email: 'siddharth@test.com', rollNumber: 'CS013', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=18' },
  { name: 'Ishita Kapoor', email: 'ishita@test.com', rollNumber: 'CS014', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=24' },
  { name: 'Aarav Malhotra', email: 'aarav@test.com', rollNumber: 'CS015', departmentName: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=19' },
];

async function generateStudents() {
  try {
    console.log('🚀 Starting test student generation...\n');

    // Get all classes
    const classesSnapshot = await getDocs(collection(db, 'classes'));
    
    if (classesSnapshot.empty) {
      console.log('❌ No classes found! Please create classes first.');
      process.exit(1);
    }

    const classes = classesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`📚 Found ${classes.length} classes`);
    classes.forEach((cls: any) => console.log(`   - ${cls.title} (${cls.batchName})`));
    console.log();

    // Create students
    const studentIds: string[] = [];
    const firstClass: any = classes[0];
    
    for (const studentData of testStudents) {
      const student = {
        ...studentData,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        batchName: firstClass.batchName,
        programTitle: firstClass.programTitle,
        classIds: [firstClass.id],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'students'), student);
      studentIds.push(docRef.id);
      console.log(`✅ Created: ${student.name} (${student.rollNumber})`);
    }

    // Update first class with student IDs
    await updateDoc(doc(db, 'classes', firstClass.id), {
      studentIds: studentIds,
      updatedAt: serverTimestamp()
    });
    console.log(`\n✅ Updated class "${firstClass.title}" with ${studentIds.length} students`);

    console.log(`\n🎉 Done! Created ${testStudents.length} students and assigned to class.`);
    console.log('\n📝 You can now:');
    console.log('   1. Go to Attendance tab');
    console.log('   2. Select the first class');
    console.log('   3. Mark attendance for 15 students!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

generateStudents();
