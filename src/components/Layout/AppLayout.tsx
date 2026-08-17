import React, { ReactNode, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface AppLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  header,
  sidebar,
  children,
  isMobileMenuOpen = false,
  onMobileMenuClose
}) => {
  const { theme } = useTheme();
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0B0B10]' : 'bg-[#F8FAFC]'
    }`}>
      {/* Header - Fixed height, always at top */}
      <div className="shrink-0 h-[72px]">
        {header}
      </div>

      {/* Main Body - Flex container for sidebar and content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar - Fixed width, independent scroll */}
        <div className="hidden md:flex md:flex-col md:w-[280px] md:shrink-0">
          {sidebar}
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
              onClick={onMobileMenuClose}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-[280px] md:hidden animate-in slide-in-from-left duration-300 ease-out">
              {sidebar}
            </div>
          </>
        )}

        {/* Main Content - Takes remaining width, independent scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
