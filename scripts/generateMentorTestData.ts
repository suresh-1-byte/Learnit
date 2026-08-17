/**
 * Script to generate sample data for Mentor Portal testing
 * Run with: npm run generate-test-data
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

import { createClass } from '../src/services/firebase/classes.service';
import { markAttendance } from '../src/services/firebase/attendance.service';
import { createAnnouncement } from '../src/services/firebase/announcements.service';

async function generateTestData() {
  console.log('🚀 Starting test data generation...\n');

  try {
    // Get current user (should be logged in as mentor)
    const user = auth.currentUser;
    
    if (!user) {
      console.error('❌ No user logged in. Please login as a mentor first.');
      console.log('   Run: npm run dev, then login at http://localhost:3001');
      process.exit(1);
    }

    console.log(`✅ Logged in as: ${user.email}`);
    console.log(`   User ID: ${user.uid}\n`);

    const mentorId = user.uid;
    const mentorName = user.displayName || 'Test Mentor';

    // Generate sample classes
    console.log('📚 Creating sample classes...');
    
    const class1Id = await createClass({
      title: 'Full-Stack Development Batch A',
      description: 'Enterprise full-stack development with React, Node.js, and Cloud technologies',
      mentorId,
      mentorName,
      schedule: {
        day: 'Monday, Wednesday, Friday',
        startTime: '10:00 AM',
        endTime: '12:00 PM'
      },
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      batchName: 'FSE-2026-A',
      programTitle: 'Full-Stack Software Engineering',
      studentIds: []
    });
    console.log(`   ✓ Created: Full-Stack Development Batch A (ID: ${class1Id})`);

    const class2Id = await createClass({
      title: 'Data Science & AI Batch B',
      description: 'Applied AI, Machine Learning, and Data Engineering fundamentals',
      mentorId,
      mentorName,
      schedule: {
        day: 'Tuesday, Thursday',
        startTime: '2:00 PM',
        endTime: '4:00 PM'
      },
      startDate: '2026-01-15',
      endDate: '2026-07-15',
      batchName: 'AI-ML-2026-B',
      programTitle: 'Applied AI & Machine Learning',
      studentIds: []
    });
    console.log(`   ✓ Created: Data Science & AI Batch B (ID: ${class2Id})`);

    const class3Id = await createClass({
      title: 'Cloud Architecture & DevOps',
      description: 'AWS, Kubernetes, Docker, CI/CD, and modern DevOps practices',
      mentorId,
      mentorName,
      schedule: {
        day: 'Monday, Thursday',
        startTime: '4:00 PM',
        endTime: '6:00 PM'
      },
      startDate: '2026-02-01',
      endDate: '2026-08-01',
      batchName: 'CLOUD-2026-A',
      programTitle: 'Cloud & DevOps Systems',
      studentIds: []
    });
    console.log(`   ✓ Created: Cloud Architecture & DevOps (ID: ${class3Id})\n`);

    // Generate sample announcements
    console.log('📢 Creating sample announcements...');
    
    await createAnnouncement({
      title: 'Welcome to the New Semester!',
      body: 'Hello students! Welcome to the new semester. Please ensure you have all the required software installed. We will start with fundamentals and gradually move to advanced topics. Looking forward to an exciting learning journey!',
      mentorId,
      mentorName,
      targetType: 'All Classes',
      priority: 'High',
      type: 'General'
    });
    console.log('   ✓ Created: Welcome announcement');

    await createAnnouncement({
      title: 'Assignment 1 - React Components Due Next Week',
      body: 'Your first assignment on React Components is due by next Friday. Please submit your GitHub repository link. Make sure to include proper documentation and follow the coding standards discussed in class.',
      mentorId,
      mentorName,
      targetType: 'Specific Class',
      targetClassIds: [class1Id],
      priority: 'High',
      type: 'Assignment'
    });
    console.log('   ✓ Created: Assignment announcement');

    await createAnnouncement({
      title: 'Mid-Term Assessment Schedule',
      body: 'The mid-term assessment will be conducted next month. Topics covered: JavaScript fundamentals, React basics, and Node.js introduction. Prepare well!',
      mentorId,
      mentorName,
      targetType: 'All Classes',
      priority: 'Medium',
      type: 'Exam'
    });
    console.log('   ✓ Created: Assessment announcement');

    await createAnnouncement({
      title: 'Guest Lecture on Cloud Native Architecture',
      body: 'We have arranged a special guest lecture with a Senior Architect from AWS. The session will cover real-world cloud architecture patterns. Date: Next Thursday at 5 PM.',
      mentorId,
      mentorName,
      targetType: 'Specific Class',
      targetClassIds: [class3Id],
      priority: 'Medium',
      type: 'Event'
    });
    console.log('   ✓ Created: Event announcement\n');

    // Note: For materials and videos, we can't generate actual files
    // These would need to be uploaded through the UI
    console.log('ℹ️  Materials and Videos:');
    console.log('   Materials and videos require actual file uploads.');
    console.log('   Please use the UI to upload study materials and recorded videos.\n');

    // Note: For students, we would need to create user accounts
    console.log('ℹ️  Students:');
    console.log('   To add students, you need to:');
    console.log('   1. Create student accounts using Firebase Authentication');
    console.log('   2. Create their Firestore profiles with role: "student"');
    console.log('   3. Assign them to classes using the assignStudentsToClass function\n');

    console.log('✨ Test data generation completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Classes created: 3`);
    console.log(`   • Announcements created: 4`);
    console.log(`   • Students: 0 (create manually or use setupFirebaseAccounts.ts)`);
    console.log(`   • Materials: 0 (upload through UI)`);
    console.log(`   • Videos: 0 (upload through UI)\n`);
    
    console.log('🎯 Next steps:');
    console.log('   1. Login to the app as mentor@test.com');
    console.log('   2. Navigate to the Mentor Dashboard');
    console.log('   3. You should see 3 classes and 4 announcements');
    console.log('   4. Use the UI to add materials, videos, and assignments\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating test data:', error);
    process.exit(1);
  }
}

// Run the script
generateTestData();
