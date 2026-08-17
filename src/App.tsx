import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AppLayout } from './components/Layout/AppLayout';
// import { SuperAdminDashboard } from './components/SuperAdmin/SuperAdminDashboard'; // Temporarily disabled
import { CollegeAdminDashboard } from './components/CollegeAdmin/CollegeAdminDashboard';
import { MentorDashboard } from './components/Mentor/MentorDashboard';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { CertificateModal } from './components/Shared/CertificateModal';
import { PaymentReceiptModal } from './components/Shared/PaymentReceiptModal';
import { ApiExplorerModal } from './components/Shared/ApiExplorerModal';
import { PublicWebsite } from './components/Public/PublicWebsite';
import { AnalyticsBI } from './components/Analytics/AnalyticsBI';
import { SuperAdminAnalytics } from './components/Analytics/SuperAdminAnalytics';
import { CollegeAdminAnalytics } from './components/Analytics/CollegeAdminAnalytics';
import { MentorAnalytics } from './components/Analytics/MentorAnalytics';
import { StudentAnalytics } from './components/Analytics/StudentAnalytics';
import { EnterpriseSettings } from './components/Settings/EnterpriseSettings';
import { DesignSystemShowcase } from './components/DesignSystem/DesignSystemShowcase';
import { CommandPalette } from './components/Shared/CommandPalette';
import { AuthModal } from './components/Auth/AuthModal';
import { SuperAdminLogin } from './components/Auth/SuperAdminLogin';
import { CollegeAdminLogin } from './components/Auth/CollegeAdminLogin';
import { ToastContainer, SkipToContent, ErrorBoundary } from './components/DesignSystem';
import { mockAuditLogs } from './mockData';
import {
  ShieldAlert,
  X
} from 'lucide-react';

export default function App() {
  const { currentUser, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState<boolean>(false);
  const [showPublicPortal, setShowPublicPortal] = useState<boolean>(false);
  const [showApiModal, setShowApiModal] = useState<boolean>(false);
  const [showCmdPalette, setShowCmdPalette] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showSuperAdminLogin, setShowSuperAdminLogin] = useState<boolean>(false);
  const [showCollegeAdminLogin, setShowCollegeAdminLogin] = useState<boolean>(false);

  const isAuthenticated = !!currentUser && !!userProfile;
  const currentRole = userProfile?.role || null;

  // Show auth modal on load if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      // Check if accessing /admin route for Super Admin login
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true' || window.location.pathname === '/admin') {
        setShowSuperAdminLogin(true);
        // Add noindex meta tag for admin routes
        document.title = 'LearnIT - Super Admin Portal';
        const metaRobots = document.querySelector('meta[name="robots"]');
        if (metaRobots) {
          metaRobots.setAttribute('content', 'noindex, nofollow');
        }
      } else if (window.location.pathname === '/college' || window.location.pathname === '/college-admin') {
        setShowCollegeAdminLogin(true);
        // Add noindex meta tag for college routes
        document.title = 'LearnIT - College Admin Portal';
        const metaRobots = document.querySelector('meta[name="robots"]');
        if (metaRobots) {
          metaRobots.setAttribute('content', 'noindex, nofollow');
        }
      } else {
        setShowAuthModal(true);
        // Reset meta tags for public routes
        document.title = 'LearnIT - Enterprise Academic & Placement SaaS';
        const metaRobots = document.querySelector('meta[name="robots"]');
        if (metaRobots) {
          metaRobots.setAttribute('content', 'index, follow');
        }
      }
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCmdPalette(true);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowCmdPalette(false);
        if (!isAuthenticated) {
          setShowAuthModal(false);
        }
        setShowSuperAdminLogin(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const handleLogin = (role?: UserRole) => {
    // After Firebase authentication, the AuthContext will handle the state
    // This function is now just for closing the modal
    setShowAuthModal(false);
    setShowSuperAdminLogin(false);
    setShowCollegeAdminLogin(false);
    setActiveTab('dashboard');
  };

  const handleCollegeAdminLogin = () => {
    setShowCollegeAdminLogin(false);
    setActiveTab('dashboard');
  };

  const handleSuperAdminLogin = () => {
    setShowSuperAdminLogin(false);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveTab('dashboard');
      setShowAuthModal(true);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderDashboardContent = () => {
    if (!currentRole) {
      return null; // Show nothing until authenticated
    }

    // RBAC Route Guards
    const currentPath = window.location.pathname;
    
    // Super Admin routes
    if (currentPath.startsWith('/admin') && currentRole !== 'super_admin') {
      return (
        <div className="flex items-center justify-center h-screen bg-[#080808] text-white">
          <div className="text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">403 - Access Denied</h2>
            <p className="text-[#888]">This portal is restricted to Super Administrators.</p>
            <button
              onClick={() => {
                window.location.href = '/?admin=true';
              }}
              className="px-6 py-2 bg-[#6366F1] text-white rounded-xl font-semibold"
            >
              Go to Super Admin Login
            </button>
          </div>
        </div>
      );
    }

    // College Admin routes
    if (currentPath.startsWith('/college-admin') && currentRole !== 'college_admin') {
      return (
        <div className="flex items-center justify-center h-screen bg-[#080808] text-white">
          <div className="text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">403 - Access Denied</h2>
            <p className="text-[#888]">This portal is restricted to College Administrators.</p>
            <button
              onClick={() => {
                window.location.href = '/college-admin';
              }}
              className="px-6 py-2 bg-[#3B82F6] text-white rounded-xl font-semibold"
            >
              Go to College Admin Login
            </button>
          </div>
        </div>
      );
    }

    // Mentor routes
    if (currentPath.startsWith('/mentor') && currentRole !== 'mentor') {
      return (
        <div className="flex items-center justify-center h-screen bg-[#080808] text-white">
          <div className="text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">403 - Access Denied</h2>
            <p className="text-[#888]">This portal is restricted to Mentors.</p>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="px-6 py-2 bg-[#6366F1] text-white rounded-xl font-semibold"
            >
              Go to Public Login
            </button>
          </div>
        </div>
      );
    }

    // Student routes
    if (currentPath.startsWith('/student') && currentRole !== 'student') {
      return (
        <div className="flex items-center justify-center h-screen bg-[#080808] text-white">
          <div className="text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">403 - Access Denied</h2>
            <p className="text-[#888]">This portal is restricted to Students.</p>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="px-6 py-2 bg-[#6366F1] text-white rounded-xl font-semibold"
            >
              Go to Public Login
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'reports') {
      // Route to role-specific reports component
      switch (currentRole) {
        case 'super_admin':
          return <SuperAdminAnalytics />;
        case 'college_admin':
          return <CollegeAdminAnalytics collegeId="clg_001" />;
        case 'mentor':
          return <MentorAnalytics mentorId="user_003" />;
        case 'student':
          return <StudentAnalytics studentId="stu_001" />;
        default:
          return <AnalyticsBI userRole={currentRole} />;
      }
    }

    if (activeTab === 'settings') {
      return <EnterpriseSettings userRole={currentRole} />;
    }

    if (activeTab === 'design_system') {
      return <DesignSystemShowcase />;
    }

    if (activeTab === 'public_website') {
      return (
        <PublicWebsite
          onAccessErp={(role) => {
            if (role) {
              setCurrentRole(role);
              setIsAuthenticated(true);
              setActiveTab('dashboard');
            }
          }}
        />
      );
    }

    switch (currentRole) {
      case 'super_admin':
        return (
          <div className="flex items-center justify-center h-screen bg-[#080808] text-white">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
              <p className="text-[#888]">Temporarily disabled due to syntax error.</p>
              <p className="text-xs text-[#666]">Please use Mentor or Student portal for now.</p>
            </div>
          </div>
        );
      case 'college_admin':
        return (
          <CollegeAdminDashboard
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        );
      case 'mentor':
        return (
          <MentorDashboard
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        );
      case 'student':
        return (
          <StudentDashboard
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenCertificateModal={() => setShowCertModal(true)}
            onOpenReceiptModal={() => setShowReceiptModal(true)}
          />
        );
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen text-white selection:bg-[#6366F1] selection:text-white font-sans antialiased dark:bg-[#050505] bg-[#F8FAFC] dark:text-white text-gray-900">
        <SkipToContent />
        
        {/* Show header and sidebar only when authenticated */}
        {isAuthenticated && currentRole && (
          <AppLayout
            header={
              <Header
                currentRole={currentRole}
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                  setSearchTerm(val);
                  setShowCmdPalette(true);
                }}
                onOpenAuditLogs={() => setShowAuditLogsModal(true)}
                onOpenPublicPortal={() => setShowPublicPortal(true)}
                onOpenApiDocs={() => setShowApiModal(true)}
                onLogout={handleLogout}
                onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isMobileMenuOpen={isMobileMenuOpen}
              />
            }
            sidebar={
              <Sidebar
                currentRole={currentRole}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                isMobileOpen={isMobileMenuOpen}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
              />
            }
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuClose={() => setIsMobileMenuOpen(false)}
          >
            {renderDashboardContent()}
          </AppLayout>
        )}

        {/* Show public portal when not authenticated */}
        {!isAuthenticated && (
          <PublicWebsite
            onAccessErp={handleLogin}
          />
        )}

      {/* Certificate Modal */}
      {showCertModal && (
        <CertificateModal onClose={() => setShowCertModal(false)} />
      )}

      {/* Payment Receipt Modal */}
      {showReceiptModal && (
        <PaymentReceiptModal onClose={() => setShowReceiptModal(false)} />
      )}

      {/* Audit Logs System Modal */}
      {showAuditLogsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-[#1A1A1A]">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2 text-[#A855F7] font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-[#A855F7]" /> Enterprise Audit & Security Ledger
              </div>
              <button
                onClick={() => setShowAuditLogsModal(false)}
                className="p-1 rounded-xl text-[#666] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto max-h-96">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-[10px] font-bold uppercase tracking-[0.15em] text-[#555] bg-[#080808]">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">User Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action Event</th>
                    <th className="py-3 px-4">Module</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]">
                  {mockAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#111]">
                      <td className="py-3 px-4 text-[#888] font-mono">{log.timestamp}</td>
                      <td className="py-3 px-4 font-semibold text-white">{log.userEmail}</td>
                      <td className="py-3 px-4 text-[#AAA] capitalize">{log.userRole.replace('_', ' ')}</td>
                      <td className="py-3 px-4 font-medium text-[#CCC]">{log.action}</td>
                      <td className="py-3 px-4 text-[#888]">{log.module}</td>
                      <td className="py-3 px-4 text-[#555] font-mono">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-[#1A1A1A] flex justify-end">
              <button
                onClick={() => setShowAuditLogsModal(false)}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] text-white rounded-xl text-xs font-semibold"
              >
                Close Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public Website Preview Overlay */}
      {showPublicPortal && (
        <div className="fixed inset-0 z-50 bg-[#050505] text-white overflow-y-auto">
          <PublicWebsite
            onAccessErp={(role) => {
              if (role) {
                handleLogin(role);
              }
            }}
            onClose={() => setShowPublicPortal(false)}
          />
        </div>
      )}

      {/* API Architecture Specifications Modal */}
      {showApiModal && (
        <ApiExplorerModal onClose={() => setShowApiModal(false)} />
      )}

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={showCmdPalette}
        onClose={() => setShowCmdPalette(false)}
        onSelectTab={setActiveTab}
        currentRole={currentRole}
      />

      {/* Part 17 Authentication Module Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLogin}
      />

      {/* Super Admin Login Modal (Private) */}
      <SuperAdminLogin
        isOpen={showSuperAdminLogin}
        onClose={() => setShowSuperAdminLogin(false)}
        onLoginSuccess={handleSuperAdminLogin}
      />

      {/* College Admin Login Modal (Private - /college route) */}
      <CollegeAdminLogin
        isOpen={showCollegeAdminLogin}
        onClose={() => setShowCollegeAdminLogin(false)}
        onLoginSuccess={handleCollegeAdminLogin}
      />

      {/* Toast Notifications */}
      <ToastContainer />

    </div>
    </ErrorBoundary>
  );
}
