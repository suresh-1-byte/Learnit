import React from 'react';
import { Plus, Search, Users, FileText, Calendar, GraduationCap, Building2 } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: 'default' | 'no-results' | 'no-data' | 'welcome';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'default',
  className = '',
}) => {
  const defaultIcons = {
    default: <FileText className="w-12 h-12 text-[#666]" />,
    'no-results': <Search className="w-12 h-12 text-[#666]" />,
    'no-data': <Users className="w-12 h-12 text-[#666]" />,
    welcome: <GraduationCap className="w-12 h-12 text-[#6366F1]" />,
  };

  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="mb-4 p-4 bg-[#111] rounded-2xl border border-[#1A1A1A]">
        {displayIcon}
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#666] max-w-md mb-6">{description}</p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {actionLabel}
            </button>
          )}
          
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2 bg-[#141414] border border-[#222] hover:bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl transition-all"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Pre-configured empty states for common use cases

export const EmptyStudents = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<Users className="w-12 h-12 text-[#666]" />}
    title="No Students Yet"
    description="Get started by adding your first student to the system."
    actionLabel="Add Student"
    onAction={onAdd}
  />
);

export const EmptyPrograms = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<GraduationCap className="w-12 h-12 text-[#666]" />}
    title="No Programs Created"
    description="Create your first training program to start managing courses."
    actionLabel="Create Program"
    onAction={onAdd}
  />
);

export const EmptyBatches = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<Calendar className="w-12 h-12 text-[#666]" />}
    title="No Batches Scheduled"
    description="Schedule your first batch to begin training sessions."
    actionLabel="Schedule Batch"
    onAction={onAdd}
  />
);

export const EmptyMentors = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<Users className="w-12 h-12 text-[#666]" />}
    title="No Mentors Assigned"
    description="Add mentors to guide students through their learning journey."
    actionLabel="Add Mentor"
    onAction={onAdd}
  />
);

export const EmptyColleges = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<Building2 className="w-12 h-12 text-[#666]" />}
    title="No Partner Colleges"
    description="Partner with colleges to expand your training network."
    actionLabel="Add College"
    onAction={onAdd}
  />
);

// Placement-related empty state removed - no longer needed
// export const EmptyPlacements = ({ onAdd }: { onAdd?: () => void }) => (
//   <EmptyState
//     icon={<Briefcase className="w-12 h-12 text-[#666]" />}
//     title="No Placement Drives"
//     description="Create placement drives to connect students with opportunities."
//     actionLabel="Create Drive"
//     onAction={onAdd}
//   />
// );

export const EmptyAssignments = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<FileText className="w-12 h-12 text-[#666]" />}
    title="No Assignments"
    description="Create assignments to assess student progress."
    actionLabel="Create Assignment"
    onAction={onAdd}
  />
);

export const EmptySearchResults = ({ onClear }: { onClear?: () => void }) => (
  <EmptyState
    variant="no-results"
    title="No Results Found"
    description="We couldn't find anything matching your search criteria."
    actionLabel="Clear Search"
    onAction={onClear}
  />
);

export const WelcomeEmptyState = ({ onGetStarted }: { onGetStarted?: () => void }) => (
  <EmptyState
    variant="welcome"
    title="Welcome to LearnIT Platform"
    description="Your enterprise learning and placement management system is ready. Get started by setting up your organization."
    actionLabel="Get Started"
    onAction={onGetStarted}
  />
);
