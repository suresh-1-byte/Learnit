/**
 * Firebase Setup Script
 * This script helps create test mentor and student accounts
 * 
 * HOW TO USE:
 * 1. Make sure you have set up your .env file with Firebase credentials
 * 2. Run: npm run setup-accounts
 * 
 * This will create:
 * - Test mentor account (mentor@test.com / Test@123)
 * - Test student account (student@test.com / Test@123)
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Test accounts configuration
const testAccounts = [
  {
    email: 'mentor@test.com',
    password: 'Test@123',
    profile: {
      name: 'Ananya Deshmukh',
      email: 'mentor@test.com',
      role: 'mentor',
      title: 'Lead Full-Stack & Cloud Architecture Mentor',
      phone: '+91 98765 22222',
      qualifications: 'M.Tech Computer Science (IIT Bombay), AWS Certified Solutions Architect Professional',
      skills: ['React / Next.js', 'Node.js / Express', 'TypeScript', 'Kubernetes', 'Apache Kafka', 'System Design'],
      assignedPrograms: ['Full-Stack Software Engineering', 'Applied AI & Data Engineering', 'Cloud & DevOps Systems'],
      assignedBatches: ['Enterprise Full-Stack 2026-A', 'Applied AI & ML 2026-B', 'Cloud DevOps Architecture 2026-A'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    email: 'student@test.com',
    password: 'Test@123',
    profile: {
      name: 'Arun Kumar',
      email: 'student@test.com',
      role: 'student',
      rollNumber: 'STU-2026-001',
      phone: '+91 98765 11111',
      collegeName: 'Test Engineering College',
      departmentName: 'Computer Science',
      batchName: 'Enterprise Full-Stack 2026-A',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];

async function setupAccounts() {
  console.log('🚀 Starting Firebase account setup...\n');

  for (const account of testAccounts) {
    try {
      console.log(`Creating account for: ${account.email}`);
      
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        account.email,
        account.password
      );

      const user = userCredential.user;
      console.log(`✅ Authentication user created with UID: ${user.uid}`);

      // Create user profile in Firestore
      const userProfile = {
        id: user.uid,
        ...account.profile
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      console.log(`✅ User profile created in Firestore`);
      console.log(`   Email: ${account.email}`);
      console.log(`   Password: ${account.password}`);
      console.log(`   Role: ${account.profile.role}\n`);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Account ${account.email} already exists, skipping...\n`);
      } else {
        console.error(`❌ Error creating account ${account.email}:`, error.message, '\n');
      }
    }
  }

  console.log('✅ Setup complete!\n');
  console.log('Test Accounts Created:');
  console.log('─────────────────────────────────────');
  console.log('MENTOR ACCOUNT');
  console.log('  Email: mentor@test.com');
  console.log('  Password: Test@123');
  console.log('');
  console.log('STUDENT ACCOUNT');
  console.log('  Email: student@test.com');
  console.log('  Password: Test@123');
  console.log('─────────────────────────────────────\n');
  
  process.exit(0);
}

// Run the setup
setupAccounts().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
