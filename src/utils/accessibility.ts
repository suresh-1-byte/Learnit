/**
 * Accessibility Utilities
 * Enterprise-grade accessibility helpers for the LearnIT Platform
 */

/**
 * Generate a unique ID for ARIA attributes
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Trap focus within a container (for modals, drawers, etc.)
 */
export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTab);

  // Focus the first element
  if (firstElement) {
    firstElement.focus();
  }

  return () => {
    container.removeEventListener('keydown', handleTab);
  };
};

/**
 * Announce a message to screen readers
 */
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Check if an element is visible
 */
export const isVisible = (element: HTMLElement): boolean => {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusable = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(focusable).filter((el) => isVisible(el as HTMLElement)) as HTMLElement[];
};

/**
 * Move focus to the next focusable element
 */
export const moveFocus = (direction: 'next' | 'previous', container?: HTMLElement) => {
  const activeElement = document.activeElement as HTMLElement;
  const focusableElements = container 
    ? getFocusableElements(container)
    : getFocusableElements(document.body);
  
  const currentIndex = focusableElements.indexOf(activeElement);
  
  if (currentIndex === -1) {
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    return;
  }

  let nextIndex;
  if (direction === 'next') {
    nextIndex = (currentIndex + 1) % focusableElements.length;
  } else {
    nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
  }

  focusableElements[nextIndex].focus();
};

/**
 * Handle Escape key press
 */
export const onEscape = (callback: () => void) => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback();
    }
  };

  document.addEventListener('keydown', handleEscape);

  return () => {
    document.removeEventListener('keydown', handleEscape);
  };
};
