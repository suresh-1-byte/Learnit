/**
 * Design System Components
 * Enterprise-grade reusable UI components for the LearnIT Platform
 */

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { Spinner, PageLoader } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { 
  EmptyState, 
  EmptyStudents, 
  EmptyPrograms, 
  EmptyBatches, 
  EmptyMentors, 
  EmptyColleges, 
  // EmptyPlacements removed - placement-related
  EmptyAssignments, 
  EmptySearchResults, 
  WelcomeEmptyState 
} from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { Form } from './Form';
export type { FormProps, FormField } from './Form';

export { 
  ConfirmDialog, 
  DeleteConfirmDialog, 
  RemoveConfirmDialog, 
  ArchiveConfirmDialog 
} from './ConfirmDialog';
export type { ConfirmDialogProps } from './ConfirmDialog';

export { Toast, ToastContainer, toast } from './Toast';
export type { ToastProps } from './Toast';

export { Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';

export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

export { Table } from './Table';
export type { Column, TableProps } from './Table';

export { Typography } from './Typography';
export type { TypographyProps } from './Typography';

export { StatCard } from './StatCard';
export type { StatCardProps } from './StatCard';

export { Ripple } from './Ripple';
export type { RippleProps } from './Ripple';

export { WelcomeSection } from './WelcomeSection';
export type { WelcomeSectionProps } from './WelcomeSection';

export { ScrollReveal, StaggeredChildren } from './ScrollReveal';
export type { ScrollRevealProps, StaggeredChildrenProps } from './ScrollReveal';

export { SkipToContent } from './SkipToContent';

export { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';

export * from '../../styles/designTokens';
