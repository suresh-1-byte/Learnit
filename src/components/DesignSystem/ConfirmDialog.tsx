import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <Trash2 className="w-6 h-6 text-[#EF4444]" />,
      iconBg: 'bg-[#EF4444]/10',
      confirmVariant: 'danger' as const,
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />,
      iconBg: 'bg-[#F59E0B]/10',
      confirmVariant: 'secondary' as const,
    },
    info: {
      icon: <AlertTriangle className="w-6 h-6 text-[#3B82F6]" />,
      iconBg: 'bg-[#3B82F6]/10',
      confirmVariant: 'primary' as const,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#AAA] hover:text-white hover:bg-[#111] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center mb-4`}>
          {styles.icon}
        </div>

        {/* Content */}
        <h3 id="confirm-dialog-title" className="text-lg font-bold text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-[#888] mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            fullWidth
          >
            {cancelLabel}
          </Button>
          <Button
            variant={styles.confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            fullWidth
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Pre-configured confirmation dialogs for common use cases

export const DeleteConfirmDialog: React.FC<Omit<ConfirmDialogProps, 'title' | 'variant' | 'confirmLabel'>> = (props) => (
  <ConfirmDialog
    title="Delete Item"
    confirmLabel="Delete"
    variant="danger"
    {...props}
  />
);

export const RemoveConfirmDialog: React.FC<Omit<ConfirmDialogProps, 'title' | 'variant' | 'confirmLabel'>> = (props) => (
  <ConfirmDialog
    title="Remove Item"
    confirmLabel="Remove"
    variant="warning"
    {...props}
  />
);

export const ArchiveConfirmDialog: React.FC<Omit<ConfirmDialogProps, 'title' | 'variant' | 'confirmLabel'>> = (props) => (
  <ConfirmDialog
    title="Archive Item"
    confirmLabel="Archive"
    variant="info"
    {...props}
  />
);
