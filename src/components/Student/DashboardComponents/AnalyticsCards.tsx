import React from 'react';
import { StatCard } from '../../DesignSystem';
import { Student } from '../../../types';
import { Activity, BookOpen, TrendingUp, Award, GraduationCap } from 'lucide-react';

interface AnalyticsCardsProps {
  student: Student;
  certificateCount: number;
  assignmentCompletionRate?: number;
  avgAssessmentScore?: number;
  onViewFullAnalytics: () => void;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ 
  student, 
  certificateCount, 
  assignmentCompletionRate = 92, 
  avgAssessmentScore = 78,
  onViewFullAnalytics 
}) => {
  const attendanceSparkline = [student.attendancePct, student.attendancePct - 3, student.attendancePct - 4, student.attendancePct - 2, student.attendancePct - 1, student.attendancePct - 17, student.attendancePct - 12];
  const learningProgress = Math.round(student.cgpa * 10);
  const learningSparkline = [learningProgress, learningProgress + 4, learningProgress - 12, learningProgress - 19];
  const performanceSparkline = [avgAssessmentScore + 8, avgAssessmentScore + 10, avgAssessmentScore + 4, avgAssessmentScore + 1];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#666]">Performance Analytics</h2>
        <button onClick={onViewFullAnalytics} className="text-[11px] text-[#6366F1] font-semibold hover:underline flex items-center gap-1">
          View Full Analytics
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        <StatCard
          title="Attendance"
          value={`${student.attendancePct}%`}
          change={5}
          changeLabel="vs last week"
          icon={<Activity className="w-4 h-4" />}
          sparkline={attendanceSparkline}
          gradient="green"
        />

        <StatCard
          title="Learning Progress"
          value={`${learningProgress}%`}
          change={8}
          changeLabel="vs last month"
          icon={<BookOpen className="w-4 h-4" />}
          sparkline={learningSparkline}
          gradient="purple"
        />

        <StatCard
          title="Assignments"
          value={`${assignmentCompletionRate}%`}
          change={12}
          changeLabel="graded rate"
          icon={<TrendingUp className="w-4 h-4" />}
          gradient="blue"
        />

        <StatCard
          title="Pending Tasks"
          value={100 - assignmentCompletionRate}
          change={-15}
          changeLabel="vs last week"
          icon={<TrendingUp className="w-4 h-4" />}
          gradient="orange"
        />

        <StatCard
          title="Assessment Avg"
          value={`${avgAssessmentScore}/100`}
          change={3}
          changeLabel="vs last month"
          icon={<TrendingUp className="w-4 h-4" />}
          gradient="purple"
        />

        <StatCard
          title="Placement Ready"
          value={`${learningProgress}/100`}
          change={5}
          changeLabel="profile score"
          icon={<GraduationCap className="w-4 h-4" />}
          gradient="green"
        />

        <StatCard
          title="CGPA"
          value={student.cgpa}
          change={0.1}
          changeLabel="vs last semester"
          icon={<Award className="w-4 h-4" />}
          gradient="purple"
        />
      </div>
    </div>
  );
};
