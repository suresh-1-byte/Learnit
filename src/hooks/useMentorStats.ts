/**
 * Custom hook for mentor dashboard statistics
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getClassesByMentor } from '../services/firebase/classes.service';
import { getAttendanceByMentor } from '../services/firebase/attendance.service';
import { getAssignmentsByMentor, getSubmissionsByAssignment } from '../services/firebase/assignments.service';
import { getMaterialsByMentor } from '../services/firebase/materials.service';
import { getVideosByMentor } from '../services/firebase/videos.service';
import { getAnnouncementsByMentor } from '../services/firebase/announcements.service';

export interface MentorStats {
  totalStudents: number;
  totalClasses: number;
  todaysAttendance: number;
  assignmentsPending: number;
  assignmentsReviewed: number;
  avgPerformance: number;
  avgAttendance: number;
  materialsUploaded: number;
  videosUploaded: number;
  announcementsSent: number;
}

export const useMentorStats = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<MentorStats>({
    totalStudents: 0,
    totalClasses: 0,
    todaysAttendance: 0,
    assignmentsPending: 0,
    assignmentsReviewed: 0,
    avgPerformance: 0,
    avgAttendance: 0,
    materialsUploaded: 0,
    videosUploaded: 0,
    announcementsSent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.id) {
      fetchStats();
    }
  }, [userProfile?.id]);

  const fetchStats = async () => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [classes, assignments, todaysAttendance, materials, videos, announcements] = await Promise.all([
        getClassesByMentor(userProfile.id),
        getAssignmentsByMentor(userProfile.id),
        getAttendanceByMentor(
          userProfile.id,
          new Date().toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        ),
        getMaterialsByMentor(userProfile.id),
        getVideosByMentor(userProfile.id),
        getAnnouncementsByMentor(userProfile.id)
      ]);

      // Calculate total students (unique across all classes)
      const allStudentIds = new Set<string>();
      classes.forEach(cls => {
        cls.studentIds?.forEach(id => allStudentIds.add(id));
      });

      // Calculate assignment statistics
      let totalSubmissions = 0;
      let gradedSubmissions = 0;
      let totalMarks = 0;

      for (const assignment of assignments) {
        const submissions = await getSubmissionsByAssignment(assignment.id);
        totalSubmissions += submissions.length;
        
        const graded = submissions.filter(s => s.status === 'Graded');
        gradedSubmissions += graded.length;
        
        graded.forEach(s => {
          if (s.marksObtained && assignment.maxMarks) {
            totalMarks += (s.marksObtained / assignment.maxMarks) * 100;
          }
        });
      }

      // Calculate today's attendance percentage
      let attendancePercentage = 0;
      if (todaysAttendance.length > 0) {
        const present = todaysAttendance.filter(a => 
          a.status === 'Present' || a.status === 'Late'
        ).length;
        attendancePercentage = Math.round((present / todaysAttendance.length) * 100);
      }

      // Calculate average performance
      const avgPerformance = gradedSubmissions > 0 
        ? Math.round(totalMarks / gradedSubmissions)
        : 0;

      setStats({
        totalStudents: allStudentIds.size,
        totalClasses: classes.length,
        todaysAttendance: attendancePercentage,
        assignmentsPending: totalSubmissions - gradedSubmissions,
        assignmentsReviewed: gradedSubmissions,
        avgPerformance,
        avgAttendance: 0, // Will calculate separately
        materialsUploaded: materials.length,
        videosUploaded: videos.length,
        announcementsSent: announcements.length
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};
