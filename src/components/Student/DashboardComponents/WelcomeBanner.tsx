import React from 'react';
import { Student } from '../../../types';
import { WelcomeSection } from '../../DesignSystem';

interface WelcomeBannerProps {
  student: Student;
  onJoinClass: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ student, onJoinClass }) => (
  <WelcomeSection
    userName={student.name}
    userRole="Student"
    stats={{
      completedTasks: 92,
      pendingTasks: 8,
      upcomingDeadlines: 2
    }}
  />
);
