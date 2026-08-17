import { UserRole } from '../types';
import {
  mockPartnerColleges,
  mockDepartments,
  mockBatches,
  mockStudents,
  mockMentors,
  mockCertificates,
  mockPaymentTransactions,
  mockAttendanceRecords,
  mockSubmissions
} from '../mockData';

// Analytics Data Types
export interface AnalyticsKPI {
  label: string;
  value: string | number;
  trend?: string;
  color?: string;
}

export interface ChartData {
  name: string;
  [key: string]: string | number;
}

export interface AnalyticsData {
  kpis: AnalyticsKPI[];
  charts: {
    [key: string]: ChartData[];
  };
}

// Role-specific data filters
export class AnalyticsService {
  /**
   * Get Super Admin Analytics - Global platform-level data
   */
  static getSuperAdminAnalytics(): AnalyticsData {
    const totalStudents = mockStudents.length;
    const totalMentors = mockMentors.length;
    const totalColleges = mockPartnerColleges.length;
    const totalDepartments = mockDepartments.length;
    const totalBatches = mockBatches.length;
    const totalCertificates = mockCertificates.length;
    const totalRevenue = mockPaymentTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    
    // Calculate placement rate
    const placedStudents = mockStudents.filter(s => s.placementStatus === 'Placed').length;
    const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : '0';
    
    // Calculate average attendance
    const avgAttendance = mockAttendanceRecords.length > 0 
      ? (mockAttendanceRecords.reduce((sum, record) => sum + (record.status === 'Present' ? 1 : 0), 0) / mockAttendanceRecords.length * 100).toFixed(1)
      : '0';

    return {
      kpis: [
        { label: 'Total Students', value: totalStudents, trend: '+24% MoM', color: '#6366F1' },
        { label: 'Total Mentors', value: totalMentors, trend: '+12% MoM', color: '#10B981' },
        { label: 'Partner Colleges', value: totalColleges, trend: '+100% YoY', color: '#A855F7' },
        { label: 'Total Programs', value: totalBatches, trend: '+8% QoQ', color: '#F59E0B' },
        { label: 'Placement Rate', value: `${placementRate}%`, trend: '+5.2% YoY', color: '#10B981' },
        { label: 'Avg Attendance', value: `${avgAttendance}%`, trend: '+1.2% Target', color: '#10B981' },
        { label: 'Total Revenue', value: `₹${(totalRevenue / 10000000).toFixed(2)} Cr`, trend: '+18.5%', color: '#A855F7' },
        { label: 'Certificates Issued', value: totalCertificates, trend: '100% Verified', color: '#6366F1' }
      ],
      charts: {
        enrollment: [
          { name: 'Jan', students: 820, placements: 45 },
          { name: 'Feb', students: 950, placements: 72 },
          { name: 'Mar', students: 1100, placements: 110 },
          { name: 'Apr', students: 1240, placements: 140 },
          { name: 'May', students: 1350, placements: 195 },
          { name: 'Jun', students: 1410, placements: 260 },
          { name: 'Jul', students: totalStudents, placements: placedStudents }
        ],
        collegePerformance: mockPartnerColleges.map(college => ({
          name: college.name,
          students: college.totalStudents,
          placementRate: college.placementRate,
          revenue: college.annualFee
        })),
        departmentPerformance: mockDepartments.map(dept => ({
          name: dept.name,
          students: dept.totalStudents,
          code: dept.code
        }))
      }
    };
  }

  /**
   * Get College Admin Analytics - College-specific data only
   */
  static getCollegeAdminAnalytics(collegeId: string): AnalyticsData {
    // Filter data for specific college
    const collegeStudents = mockStudents.filter(s => s.collegeId === collegeId);
    const collegeMentors = mockMentors.filter(m => m.collegeId === collegeId);
    const collegeBatches = mockBatches.filter(b => b.collegeId === collegeId);
    const collegeDepartments = mockDepartments.filter(d => d.collegeId === collegeId);
    
    const totalStudents = collegeStudents.length;
    const totalMentors = collegeMentors.length;
    const activeBatches = collegeBatches.filter(b => b.status === 'Ongoing').length;
    
    // Calculate college-specific metrics
    const placedStudents = collegeStudents.filter(s => s.placementStatus === 'Placed').length;
    const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : '0';
    
    const collegeAttendance = mockAttendanceRecords.filter(record => 
      collegeStudents.some(s => s.id === record.studentId)
    );
    const avgAttendance = collegeAttendance.length > 0 
      ? (collegeAttendance.reduce((sum, record) => sum + (record.status === 'Present' ? 1 : 0), 0) / collegeAttendance.length * 100).toFixed(1)
      : '0';

    return {
      kpis: [
        { label: 'Total Students', value: totalStudents, trend: '+15% MoM', color: '#6366F1' },
        { label: 'Active Students', value: totalStudents, trend: 'Active', color: '#10B981' },
        { label: 'Total Mentors', value: totalMentors, trend: '+2 New', color: '#A855F7' },
        { label: 'Active Programs', value: activeBatches, trend: 'Ongoing', color: '#F59E0B' },
        { label: 'Attendance Rate', value: `${avgAttendance}%`, trend: '+2.1% Target', color: '#10B981' },
        { label: 'Placement Rate', value: `${placementRate}%`, trend: '+3.5% YoY', color: '#10B981' },
        { label: 'Placed Students', value: placedStudents, trend: 'Active', color: '#6366F1' },
        { label: 'Departments', value: collegeDepartments.length, trend: 'Active', color: '#A855F7' }
      ],
      charts: {
        enrollment: [
          { name: 'Jan', students: Math.floor(totalStudents * 0.6), placements: Math.floor(placedStudents * 0.3) },
          { name: 'Feb', students: Math.floor(totalStudents * 0.7), placements: Math.floor(placedStudents * 0.5) },
          { name: 'Mar', students: Math.floor(totalStudents * 0.8), placements: Math.floor(placedStudents * 0.7) },
          { name: 'Apr', students: Math.floor(totalStudents * 0.9), placements: Math.floor(placedStudents * 0.85) },
          { name: 'May', students: totalStudents, placements: placedStudents }
        ],
        batchPerformance: collegeBatches.map(batch => ({
          name: batch.name,
          students: batch.studentCount,
          attendance: batch.averageAttendance,
          status: batch.status
        })),
        departmentPerformance: collegeDepartments.map(dept => ({
          name: dept.name,
          students: dept.totalStudents,
          code: dept.code
        }))
      }
    };
  }

  /**
   * Get Mentor Analytics - Mentor-specific data only
   */
  static getMentorAnalytics(mentorId: string): AnalyticsData {
    // Filter data for specific mentor
    const mentorBatches = mockBatches.filter(b => b.mentorId === mentorId);
    const mentorStudents = mockStudents.filter(s => 
      mentorBatches.some(b => b.id === s.batchId)
    );
    
    const totalStudentsMentored = mentorStudents.length;
    const activeBatches = mentorBatches.filter(b => b.status === 'Ongoing').length;
    
    // Calculate mentor-specific metrics
    const mentorAttendance = mockAttendanceRecords.filter(record => 
      mentorStudents.some(s => s.id === record.studentId)
    );
    const avgAttendance = mentorAttendance.length > 0 
      ? (mentorAttendance.reduce((sum, record) => sum + (record.status === 'Present' ? 1 : 0), 0) / mentorAttendance.length * 100).toFixed(1)
      : '0';
    
    const mentorSubmissions = mockSubmissions.filter(sub => 
      mentorStudents.some(s => s.id === sub.studentId)
    );
    const submissionRate = mentorStudents.length > 0 
      ? ((mentorSubmissions.length / mentorStudents.length) * 100).toFixed(1) : '0';
    
    const avgPerformance = mentorSubmissions.length > 0 
      ? (mentorSubmissions.reduce((sum, sub) => sum + (sub.marksObtained || 0), 0) / mentorSubmissions.length).toFixed(1)
      : '0';

    const placedStudents = mentorStudents.filter(s => s.placementStatus === 'Placed').length;
    const certificatesIssued = mockCertificates.filter(cert => 
      mentorStudents.some(s => s.id === cert.studentId)
    ).length;

    return {
      kpis: [
        { label: 'Students Mentored', value: totalStudentsMentored, trend: 'Active', color: '#6366F1' },
        { label: 'Active Batches', value: activeBatches, trend: 'Ongoing', color: '#10B981' },
        { label: 'Attendance Rate', value: `${avgAttendance}%`, trend: '+1.5% Target', color: '#10B981' },
        { label: 'Submission Rate', value: `${submissionRate}%`, trend: '+5.2% MoM', color: '#A855F7' },
        { label: 'Avg Performance', value: `${avgPerformance}%`, trend: '+2.3% QoQ', color: '#F59E0B' },
        { label: 'Placed Students', value: placedStudents, trend: 'Active', color: '#10B981' },
        { label: 'Certificates', value: certificatesIssued, trend: 'Issued', color: '#6366F1' },
        { label: 'Materials', value: '24', trend: 'Uploaded', color: '#A855F7' }
      ],
      charts: {
        studentPerformance: mentorStudents.map(student => ({
          name: student.name,
          attendance: student.attendancePct,
          cgpa: student.cgpa,
          placementStatus: student.placementStatus
        })),
        batchPerformance: mentorBatches.map(batch => ({
          name: batch.name,
          students: batch.studentCount,
          attendance: batch.averageAttendance,
          status: batch.status
        })),
        submissionTrend: [
          { name: 'Week 1', submissions: Math.floor(mentorSubmissions.length * 0.4) },
          { name: 'Week 2', submissions: Math.floor(mentorSubmissions.length * 0.6) },
          { name: 'Week 3', submissions: Math.floor(mentorSubmissions.length * 0.8) },
          { name: 'Week 4', submissions: mentorSubmissions.length }
        ]
      }
    };
  }

  /**
   * Get Student Analytics - Student-specific data only
   */
  static getStudentAnalytics(studentId: string): AnalyticsData {
    const student = mockStudents.find(s => s.id === studentId);
    
    if (!student) {
      return {
        kpis: [],
        charts: {}
      };
    }

    const studentAttendance = mockAttendanceRecords.filter(r => r.studentId === studentId);
    const attendancePct = studentAttendance.length > 0 
      ? (studentAttendance.filter(r => r.status === 'Present').length / studentAttendance.length * 100).toFixed(1)
      : student.attendancePct.toString();
    
    const studentSubmissions = mockSubmissions.filter(s => s.studentId === studentId);
    const submissionRate = studentSubmissions.length > 0 ? '100%' : '0%';
    
    const avgScore = studentSubmissions.length > 0 
      ? (studentSubmissions.reduce((sum, sub) => sum + (sub.marksObtained || 0), 0) / studentSubmissions.length).toFixed(1)
      : '0';
    
    const studentCertificates = mockCertificates.filter(c => c.studentId === studentId);
    const courseProgress = '75%'; // Mock value

    return {
      kpis: [
        { label: 'Attendance', value: `${attendancePct}%`, trend: 'Good', color: '#10B981' },
        { label: 'CGPA', value: student.cgpa.toFixed(1), trend: 'Current', color: '#6366F1' },
        { label: 'Assignments', value: `${studentSubmissions.length}`, trend: 'Completed', color: '#A855F7' },
        { label: 'Avg Score', value: `${avgScore}%`, trend: '+3.2% MoM', color: '#F59E0B' },
        { label: 'Course Progress', value: courseProgress, trend: 'On Track', color: '#10B981' },
        { label: 'Certificates', value: studentCertificates.length, trend: 'Earned', color: '#6366F1' },
        { label: 'Placement Status', value: student.placementStatus, trend: 'Active', color: student.placementStatus === 'Placed' ? '#10B981' : '#F59E0B' },
        { label: 'Skills', value: student.skills.length, trend: 'Mastered', color: '#A855F7' }
      ],
      charts: {
        performanceTrend: [
          { name: 'Month 1', score: 75 },
          { name: 'Month 2', score: 82 },
          { name: 'Month 3', score: 85 },
          { name: 'Month 4', score: 88 },
          { name: 'Month 5', score: parseFloat(avgScore) }
        ],
        attendanceTrend: [
          { name: 'Week 1', attendance: 92 },
          { name: 'Week 2', attendance: 88 },
          { name: 'Week 3', attendance: 95 },
          { name: 'Week 4', attendance: parseFloat(attendancePct) }
        ],
        skillProgress: student.skills.map((skill, index) => ({
          name: skill,
          progress: 80 + (index * 5)
        }))
      }
    };
  }

  /**
   * Get analytics based on user role
   */
  static getAnalyticsByRole(role: UserRole, entityId?: string): AnalyticsData {
    switch (role) {
      case 'super_admin':
        return this.getSuperAdminAnalytics();
      case 'college_admin':
        return this.getCollegeAdminAnalytics(entityId || 'clg_001');
      case 'mentor':
        return this.getMentorAnalytics(entityId || 'user_003');
      case 'student':
        return this.getStudentAnalytics(entityId || 'stu_001');
      default:
        return this.getSuperAdminAnalytics();
    }
  }
}
