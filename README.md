# LearnIT Platform

Enterprise SaaS Academic & Placement Management System

## Overview

LearnIT is a comprehensive platform that connects engineering colleges with real industry mentors and modern curriculum. The platform includes:

- **Student Portal**: Track attendance, assignments, materials, and placement opportunities
- **Mentor Portal**: Manage classes, track attendance, share materials and videos
- **College Admin Portal**: Manage students, view analytics, coordinate placements
- **Super Admin Portal**: Manage partner colleges, mentors, and system-wide analytics
- **Public Website**: Showcase programs, partnerships, and company information

## Features

- 🔐 Firebase Authentication & Real-time Database
- 📊 Real-time Analytics & Dashboards
- 📱 Fully Responsive Design (Mobile, Tablet, Desktop)
- 🌓 Dark/Light Theme Support
- 🎨 Modern UI with Framer Motion Animations
- ♿ WCAG Accessibility Compliant
- 📈 Live Data Synchronization

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

## Prerequisites

- Node.js (v16 or higher)
- npm or bun
- Firebase account

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/suresh-1-byte/Learnit.git
   cd Learnit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:3000`

## Project Structure

```
learn-it-platform/
├── src/
│   ├── components/         # React components
│   │   ├── Auth/          # Authentication components
│   │   ├── Student/       # Student portal components
│   │   ├── Mentor/        # Mentor portal components
│   │   ├── CollegeAdmin/  # College admin components
│   │   ├── SuperAdmin/    # Super admin components
│   │   ├── Public/        # Public website components
│   │   └── Shared/        # Shared components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Firebase services
│   ├── types.ts           # TypeScript type definitions
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── docs/                  # Documentation
└── scripts/               # Utility scripts
```

## Test Credentials

**Mentor Login**:
- Email: `mentor@test.com`
- Password: `Test@123`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [Start Here](./START_HERE.md)
- [Public Website Updates](./PUBLIC_WEBSITE_UPDATES.md)
- [Leadership Team Update](./LEADERSHIP_TEAM_UPDATE.md)

## Recent Updates

### Public Website Content (August 18, 2026)
- ✅ Updated Executive Leadership Team (Sivan, Suresh, Vijay, Mohan Ram)
- ✅ Refreshed Resources & Blogs with future-focused content
- ✅ Updated Contact information with Zentrix headquarters details

### Mentor Portal (Firebase Integration)
- ✅ Real-time class management (CRUD operations)
- ✅ Attendance tracking with Firebase
- ✅ Materials and video management
- ✅ Live dashboard with 12 real-time metrics

### Student Management System
- ✅ Add/Edit/Delete students
- ✅ CSV bulk upload (500+ students)
- ✅ Search & filter functionality
- ✅ Batch assign students to classes

## Contributing

This is a private project. For any questions or issues, please contact the development team.

## License

Proprietary - All rights reserved by Zentrix

## Contact

**Company**: Zentrix  
**Address**: No. 10, Park Road, 2nd Street, Maduravoyal, Chennai, Tamil Nadu - 600095, India  
**Phone**: +91 7200575426  
**Email**: zentrix.coo@gmail.com  
**Hours**: 9:00 AM – 5:00 PM

---

Built with ❤️ by the Zentrix Team
