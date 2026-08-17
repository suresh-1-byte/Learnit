import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  variant = 'success',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const variantStyles = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-[#10B981]" />,
      bgColor: 'bg-[#10B981]/10',
      borderColor: 'border-[#10B981]/20',
      textColor: 'text-[#10B981]',
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-[#EF4444]" />,
      bgColor: 'bg-[#EF4444]/10',
      borderColor: 'border-[#EF4444]/20',
      textColor: 'text-[#EF4444]',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
      bgColor: 'bg-[#F59E0B]/10',
      borderColor: 'border-[#F59E0B]/20',
      textColor: 'text-[#F59E0B]',
    },
    info: {
      icon: <Info className="w-5 h-5 text-[#3B82F6]" />,
      bgColor: 'bg-[#3B82F6]/10',
      borderColor: 'border-[#3B82F6]/20',
      textColor: 'text-[#3B82F6]',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
        ${styles.bgColor} ${styles.borderColor}
        transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
      aria-live="polite"
    >
      {styles.icon}
      <span className="text-sm font-medium text-white flex-1">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="p-1 rounded-lg text-[#AAA] hover:text-white hover:bg-[#111] transition-colors"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container and Context
interface ToastItem {
  id: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

let toastIdCounter = 0;
const toastListeners: Set<(toasts: ToastItem[]) => void> = new Set();
let toasts: ToastItem[] = [];

const notifyListeners = () => {
  toastListeners.forEach((listener) => listener([...toasts]));
};

export const toast = {
  success: (message: string, duration?: number) => {
    const id = `toast-${toastIdCounter++}`;
    toasts.push({ id, message, variant: 'success', duration });
    notifyListeners();
    return id;
  },
  error: (message: string, duration?: number) => {
    const id = `toast-${toastIdCounter++}`;
    toasts.push({ id, message, variant: 'error', duration });
    notifyListeners();
    return id;
  },
  warning: (message: string, duration?: number) => {
    const id = `toast-${toastIdCounter++}`;
    toasts.push({ id, message, variant: 'warning', duration });
    notifyListeners();
    return id;
  },
  info: (message: string, duration?: number) => {
    const id = `toast-${toastIdCounter++}`;
    toasts.push({ id, message, variant: 'info', duration });
    notifyListeners();
    return id;
  },
  remove: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  },
  clear: () => {
    toasts = [];
    notifyListeners();
  },
};

export const ToastContainer: React.FC = () => {
  const [currentToasts, setCurrentToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastListeners.add(setCurrentToasts);
    return () => {
      toastListeners.delete(setCurrentToasts);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {currentToasts.map((toastItem) => (
        <div key={toastItem.id} className="pointer-events-auto">
          <Toast
            id={toastItem.id}
            message={toastItem.message}
            variant={toastItem.variant}
            duration={toastItem.duration}
            onClose={toast.remove}
          />
        </div>
      ))}
    </div>
  );
};
