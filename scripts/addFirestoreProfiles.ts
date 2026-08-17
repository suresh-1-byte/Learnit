/**
 * Add Firestore User Profiles
 * This script adds user profile documents to Firestore for existing Firebase Auth users
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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

// User profiles configuration
const userProfiles = [
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

async function addFirestoreProfiles() {
  console.log('🚀 Adding Firestore user profiles...\n');

  for (const userConfig of userProfiles) {
    try {
      console.log(`Processing: ${userConfig.email}`);
      
      // Sign in to get the user's UID
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userConfig.email,
        userConfig.password
      );

      const user = userCredential.user;
      console.log(`✅ Signed in successfully with UID: ${user.uid}`);

      // Create/update user profile in Firestore
      const userProfile = {
        id: user.uid,
        ...userConfig.profile
      };

      await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
      console.log(`✅ User profile created/updated in Firestore`);
      console.log(`   Role: ${userConfig.profile.role}\n`);

    } catch (error: any) {
      console.error(`❌ Error processing ${userConfig.email}:`, error.message, '\n');
    }
  }

  console.log('✅ Firestore profiles setup complete!\n');
  console.log('You can now log in with:');
  console.log('─────────────────────────────────────');
  console.log('MENTOR: mentor@test.com / Test@123');
  console.log('STUDENT: student@test.com / Test@123');
  console.log('─────────────────────────────────────\n');
  
  process.exit(0);
}

// Run the setup
addFirestoreProfiles().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
