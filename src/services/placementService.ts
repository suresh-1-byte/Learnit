import { PlacementDrive, PlacementDriveStatus, PlacementStatistics } from '../types';

// In-memory storage for placement drives (replace with actual backend API calls)

// TEMPORARY DEMO DATA — REMOVE WHEN BACKEND PLACEMENT API IS CONNECTED
// This mock data is for UI/client demonstration and testing purposes only
const demoPlacementDrives: PlacementDrive[] = [
  {
    id: 'drive_demo_001',
    companyName: 'Microsoft',
    companyLogo: 'https://img.shields.io/badge/Microsoft-0089D6?style=for-the-badge&logo=microsoft&logoColor=white',
    jobRole: 'Software Engineer Intern',
    package: '₹35,000 / month',
    location: 'Chennai / Remote',
    driveDate: '2026-09-15',
    eligibility: 'B.E / B.Tech / B.Sc Computer Science',
    description: 'Join Microsoft as a Software Engineer Intern and work on cutting-edge technologies. Great opportunity to learn from industry experts while contributing to real-world projects.',
    requiredSkills: ['JavaScript', 'React', 'Python', 'Git'],
    status: 'Approved',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    createdBy: 'demo_admin',
    approvedBy: 'demo_admin',
    approvedAt: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'drive_demo_002',
    companyName: 'Zoho',
    companyLogo: 'https://img.shields.io/badge/Zoho-EA4335?style=for-the-badge&logo=zoho&logoColor=white',
    jobRole: 'Junior Software Developer',
    package: '₹8–12 LPA',
    location: 'Chennai',
    driveDate: '2026-09-20',
    eligibility: 'B.E / B.Tech / MCA / M.Sc Computer Science',
    description: 'Exciting opportunity to join Zoho as a Junior Software Developer. Work on innovative products and grow your career in a dynamic environment.',
    requiredSkills: ['Java', 'C++', 'SQL', 'Problem Solving'],
    status: 'Approved',
    createdAt: '2026-08-02T00:00:00.000Z',
    updatedAt: '2026-08-02T00:00:00.000Z',
    createdBy: 'demo_admin',
    approvedBy: 'demo_admin',
    approvedAt: '2026-08-02T00:00:00.000Z'
  },
  {
    id: 'drive_demo_003',
    companyName: 'TCS',
    companyLogo: 'https://img.shields.io/badge/TCS-007A3D?style=for-the-badge&logo=tcs&logoColor=white',
    jobRole: 'Graduate Software Engineer',
    package: '₹6–8 LPA',
    location: 'Chennai / Bangalore / Pune',
    driveDate: '2026-10-01',
    eligibility: 'B.E / B.Tech / MCA',
    description: 'Start your career with TCS as a Graduate Software Engineer. Work on diverse projects across industries and gain valuable experience.',
    requiredSkills: ['Java', 'Python', 'SQL', 'Communication'],
    status: 'Approved',
    createdAt: '2026-08-03T00:00:00.000Z',
    updatedAt: '2026-08-03T00:00:00.000Z',
    createdBy: 'demo_admin',
    approvedBy: 'demo_admin',
    approvedAt: '2026-08-03T00:00:00.000Z'
  },
  {
    id: 'drive_demo_004',
    companyName: 'Infosys',
    companyLogo: 'https://img.shields.io/badge/Infosys-007BFF?style=for-the-badge&logo=infosys&logoColor=white',
    jobRole: 'Systems Engineer',
    package: '₹5–7 LPA',
    location: 'Chennai / Bangalore / Hyderabad',
    driveDate: '2026-10-10',
    eligibility: 'B.E / B.Tech / MCA / M.Sc CS',
    description: 'Join Infosys as a Systems Engineer and work on enterprise-level solutions. Excellent learning opportunities and career growth prospects.',
    requiredSkills: ['Java', 'Python', 'SQL', 'Cloud Basics'],
    status: 'Approved',
    createdAt: '2026-08-04T00:00:00.000Z',
    updatedAt: '2026-08-04T00:00:00.000Z',
    createdBy: 'demo_admin',
    approvedBy: 'demo_admin',
    approvedAt: '2026-08-04T00:00:00.000Z'
  },
  {
    id: 'drive_demo_005',
    companyName: 'Accenture',
    companyLogo: 'https://img.shields.io/badge/Accenture-A10037?style=for-the-badge&logo=accenture&logoColor=white',
    jobRole: 'Associate Software Engineer',
    package: '₹6–9 LPA',
    location: 'Chennai / Bangalore / Hyderabad',
    driveDate: '2026-10-15',
    eligibility: 'B.E / B.Tech / MCA',
    description: 'Build your career with Accenture as an Associate Software Engineer. Work with global clients and cutting-edge technologies.',
    requiredSkills: ['Java', 'React', 'SQL', 'Cloud'],
    status: 'Approved',
    createdAt: '2026-08-05T00:00:00.000Z',
    updatedAt: '2026-08-05T00:00:00.000Z',
    createdBy: 'demo_admin',
    approvedBy: 'demo_admin',
    approvedAt: '2026-08-05T00:00:00.000Z'
  },
  {
    id: 'drive_demo_006',
    companyName: 'Freshworks',
    companyLogo: 'https://img.shields.io/badge/Freshworks-FF5C36?style=for-the-badge&logo=freshworks&logoColor=white',
    jobRole: 'Frontend Developer Intern',
    package: '₹30,000 / month',
    location: 'Chennai',
    driveDate: '2026-09-25',
    eligibility: 'Final Year Students / Recent Graduates',
    description: 'Join Freshworks as a Frontend Developer Intern. Work on modern web applications and learn from experienced developers in a collaborative environment.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    status: 'Approved',
    createdAt: '2026-08-06T00:00:00.000Z',
    updatedAt: '2026-08-06T00:00:00.000Z',
    createdBy: 'demo_admin',
    approvedBy: 'demo_admin',
    approvedAt: '2026-08-06T00:00:00.000Z'
  }
];

let placementDrives: PlacementDrive[] = [...demoPlacementDrives];

/**
 * Placement Drive Service
 * Handles CRUD operations for placement drives with approval workflow
 */
export class PlacementService {
  /**
   * Get all placement drives (for Super Admin)
   */
  static getAllPlacementDrives(): PlacementDrive[] {
    return [...placementDrives];
  }

  /**
   * Get placement drives by status
   */
  static getPlacementDrivesByStatus(status: PlacementDriveStatus): PlacementDrive[] {
    return placementDrives.filter(drive => drive.status === status);
  }

  /**
   * Get only approved placement drives (for Public Website)
   */
  static getApprovedPlacementDrives(): PlacementDrive[] {
    return placementDrives.filter(drive => drive.status === 'Approved');
  }

  /**
   * Get a single placement drive by ID
   */
  static getPlacementDriveById(id: string): PlacementDrive | undefined {
    return placementDrives.find(drive => drive.id === id);
  }

  /**
   * Create a new placement drive (Super Admin only)
   */
  static createPlacementDrive(drive: Omit<PlacementDrive, 'id' | 'createdAt' | 'updatedAt' | 'status'>): PlacementDrive {
    const newDrive: PlacementDrive = {
      ...drive,
      id: `drive_${Date.now()}`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    placementDrives.push(newDrive);
    return newDrive;
  }

  /**
   * Update an existing placement drive
   */
  static updatePlacementDrive(id: string, updates: Partial<PlacementDrive>): PlacementDrive | null {
    const index = placementDrives.findIndex(drive => drive.id === id);
    if (index === -1) return null;

    placementDrives[index] = {
      ...placementDrives[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return placementDrives[index];
  }

  /**
   * Submit placement drive for approval (Draft -> Pending Approval)
   */
  static submitForApproval(id: string): PlacementDrive | null {
    const drive = placementDrives.find(d => d.id === id);
    if (!drive || drive.status !== 'Draft') return null;

    return this.updatePlacementDrive(id, { status: 'Pending Approval' });
  }

  /**
   * Approve a placement drive (Pending Approval -> Approved)
   */
  static approvePlacementDrive(id: string, approvedBy: string): PlacementDrive | null {
    const drive = placementDrives.find(d => d.id === id);
    if (!drive || drive.status !== 'Pending Approval') return null;

    return this.updatePlacementDrive(id, {
      status: 'Approved',
      approvedBy,
      approvedAt: new Date().toISOString()
    });
  }

  /**
   * Reject a placement drive (Pending Approval -> Rejected)
   */
  static rejectPlacementDrive(id: string, rejectionReason: string): PlacementDrive | null {
    const drive = placementDrives.find(d => d.id === id);
    if (!drive || drive.status !== 'Pending Approval') return null;

    return this.updatePlacementDrive(id, {
      status: 'Rejected',
      rejectionReason
    });
  }

  /**
   * Archive a placement drive (Approved -> Archived)
   */
  static archivePlacementDrive(id: string): PlacementDrive | null {
    const drive = placementDrives.find(d => d.id === id);
    if (!drive || drive.status !== 'Approved') return null;

    return this.updatePlacementDrive(id, { status: 'Archived' });
  }

  /**
   * Delete a placement drive (only Draft or Rejected can be deleted)
   */
  static deletePlacementDrive(id: string): boolean {
    const drive = placementDrives.find(d => d.id === id);
    if (!drive || (drive.status !== 'Draft' && drive.status !== 'Rejected')) return false;

    placementDrives = placementDrives.filter(d => d.id !== id);
    return true;
  }

  /**
   * Calculate placement statistics from approved drives
   */
  static calculatePlacementStatistics(): PlacementStatistics {
    const approvedDrives = this.getApprovedPlacementDrives();

    if (approvedDrives.length === 0) {
      return {
        totalPlacementRate: '—',
        studentsPlaced: 0,
        hiringPartners: 0,
        averagePackage: '—'
      };
    }

    // Count unique companies (hiring partners)
    const uniqueCompanies = new Set(approvedDrives.map(d => d.companyName));
    const hiringPartners = uniqueCompanies.size;

    // Calculate average package from approved drives
    // This is a simplified calculation - in production, this would come from actual student placement data
    const averagePackage = 'Data will be available soon';

    // Students placed would come from actual placement records
    const studentsPlaced = 0;

    // Placement rate would be calculated from actual student data
    const totalPlacementRate = '—';

    return {
      totalPlacementRate,
      studentsPlaced,
      hiringPartners,
      averagePackage
    };
  }

  /**
   * Get placement statistics for Public Website
   */
  static getPublicPlacementStatistics(): PlacementStatistics {
    return this.calculatePlacementStatistics();
  }
}
