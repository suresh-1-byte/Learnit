/**
 * Create Firestore User Profiles Directly
 * Run this after creating users in Firebase Console Authentication
 * 
 * INSTRUCTIONS:
 * 1. Make sure mentor@test.com and student@test.com exist in Firebase Authentication
 * 2. Update the UIDs below with the actual UIDs from Firebase Console
 * 3. Run: npm run create-profiles
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
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

// User credentials - we'll sign in to get their UIDs
const users = [
  {
    email: 'mentor@test.com',
    password: 'Test@123',
    profileData: {
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
    profileData: {
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

async function createFirestoreProfiles() {
  console.log('🚀 Creating Firestore user profiles...\n');
  console.log('NOTE: This will try to sign in with Test@123 password\n');

  for (const user of users) {
    try {
      console.log(`Processing: ${user.email}`);
      
      // Try to sign in to get the UID
      try {
        const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
        const firebaseUser = userCredential.user;
        
        console.log(`✅ Signed in successfully`);
        console.log(`   UID: ${firebaseUser.uid}`);

        // Create profile document
        const profile = {
          id: firebaseUser.uid,
          ...user.profileData
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), profile);
        console.log(`✅ Profile document created in Firestore`);
        console.log(`   Role: ${user.profileData.role}\n`);

        // Sign out
        await signOut(auth);

      } catch (authError: any) {
        if (authError.code === 'auth/wrong-password') {
          console.log(`⚠️  Password 'Test@123' doesn't work for ${user.email}`);
          console.log(`   Please reset password in Firebase Console to: Test@123`);
          console.log(`   Or update the password in this script\n`);
        } else {
          throw authError;
        }
      }

    } catch (error: any) {
      console.error(`❌ Error:`, error.message, '\n');
    }
  }

  console.log('✅ Process complete!\n');
  console.log('If successful, you can now log in with:');
  console.log('─────────────────────────────────────');
  console.log('MENTOR: mentor@test.com / Test@123');
  console.log('STUDENT: student@test.com / Test@123');
  console.log('─────────────────────────────────────\n');
  
  process.exit(0);
}

// Run the setup
createFirestoreProfiles().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
