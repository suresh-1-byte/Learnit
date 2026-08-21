import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
const db = getFirestore(app);
const auth = getAuth(app);

const partnerColleges = [
  {
    name: 'Gandhi Education Trust',
    code: 'GET',
    location: 'Davangere',
    state: 'Karnataka',
    logo: 'https://firebasestorage.googleapis.com/v0/b/zentrix-learnit.appspot.com/o/college-logos%2Fgandhi-education-trust.png?alt=media',
    contractStatus: 'Active',
    planTier: 'Enterprise',
    joinedDate: '2014-01-01',
    totalDepartments: 8,
    totalStudents: 1200,
    totalMentors: 45,
    placementRate: 82.5,
    annualFee: 500000,
    contactPerson: 'Principal - Gandhi Education Trust',
    contactEmail: 'principal@gandhi.edu.in',
    establishedYear: 2014,
    description: 'Premier educational institution in Davangere focusing on engineering and management education with strong industry connections.',
    website: 'https://gandhieducationtrust.edu.in',
    accreditation: ['AICTE', 'UGC'],
    specializations: ['Engineering', 'Management', 'Computer Science'],
    facilities: ['Modern Labs', 'Library', 'Sports Complex', 'Hostel'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: 'Davanagere Institute of Advanced Management Studies',
    code: 'DIAMS',
    location: 'Davangere',
    state: 'Karnataka',
    logo: 'https://firebasestorage.googleapis.com/v0/b/zentrix-learnit.appspot.com/o/college-logos%2Fdavanagere-institute.png?alt=media',
    contractStatus: 'Active',
    planTier: 'Professional',
    joinedDate: '2018-06-15',
    totalDepartments: 6,
    totalStudents: 800,
    totalMentors: 32,
    placementRate: 78.3,
    annualFee: 350000,
    contactPerson: 'Director - DIAMS',
    contactEmail: 'director@diams.edu.in',
    establishedYear: 2005,
    description: 'Spurthi Educational Trust affiliated institute specializing in advanced management studies and professional courses.',
    website: 'https://diams.edu.in',
    accreditation: ['AICTE', 'NAAC'],
    specializations: ['Management', 'Business Administration', 'Finance'],
    facilities: ['Computer Labs', 'Digital Library', 'Seminar Halls', 'Placement Cell'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: 'Dr. C.V. Raman Educational Association',
    code: 'CVREA',
    location: 'Karnataka',
    state: 'Karnataka',
    logo: 'https://firebasestorage.googleapis.com/v0/b/zentrix-learnit.appspot.com/o/college-logos%2Fcv-raman-education.png?alt=media',
    contractStatus: 'Active',
    planTier: 'Enterprise',
    joinedDate: '2016-08-20',
    totalDepartments: 10,
    totalStudents: 1500,
    totalMentors: 55,
    placementRate: 85.7,
    annualFee: 600000,
    contactPerson: 'Registrar - Dr. C.V. Raman Educational Association',
    contactEmail: 'registrar@cvrea.edu.in',
    establishedYear: 2010,
    description: 'Registered Trust dedicated to quality education in engineering, science, and technology with state-of-the-art infrastructure.',
    website: 'https://cvrea.edu.in',
    accreditation: ['AICTE', 'NAAC', 'NBA'],
    specializations: ['Engineering', 'Computer Science', 'Electronics', 'Applied Sciences'],
    facilities: ['Research Centers', 'Innovation Labs', 'Sports Complex', 'Hostel', 'Auditorium'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function addColleges() {
  console.log('🎓 Adding Partner Colleges to Firebase...\n');

  try {
    // Authenticate as mentor (using the mentor account)
    console.log('🔐 Authenticating as mentor...');
    await signInWithEmailAndPassword(auth, 'sureshchitki@gmail.com', 'Chitki@123');
    console.log('✅ Authenticated successfully!\n');

    const collegesRef = collection(db, 'colleges');

    for (const college of partnerColleges) {
      console.log(`📍 Adding: ${college.name}`);
      console.log(`   Location: ${college.location}, ${college.state}`);
      console.log(`   Code: ${college.code}`);
      console.log(`   Plan: ${college.planTier}`);
      console.log(`   Students: ${college.totalStudents}`);
      console.log(`   Placement Rate: ${college.placementRate}%`);
      
      const docRef = await addDoc(collegesRef, college);
      console.log(`   ✅ Added with ID: ${docRef.id}\n`);
    }

    console.log('✅ All 3 partner colleges added successfully!\n');
    console.log('📊 Summary:');
    console.log('   • Gandhi Education Trust (Davangere) - Est. 2014');
    console.log('   • Davanagere Institute of Advanced Management Studies - Est. 2005');
    console.log('   • Dr. C.V. Raman Educational Association - Est. 2010');
    console.log('\n🎉 Total: 3 colleges added to Firebase');

  } catch (error) {
    console.error('❌ Error adding colleges:', error);
    throw error;
  }
}

// Run the script
addColleges()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
