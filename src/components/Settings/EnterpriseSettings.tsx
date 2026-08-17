import React, { useState } from 'react';
import { UserRole } from '../../types';
import {
  Building2,
  Palette,
  GraduationCap,
  CheckCircle2,
  Award,
  CreditCard,
  Bell,
  Mail,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  HardDrive,
  Cpu,
  History,
  Database,
  Activity,
  Save,
  RotateCcw,
  RefreshCw,
  Check,
  AlertTriangle,
  Lock,
  Upload,
  Globe,
  FileText,
  Key,
  Smartphone,
  Eye,
  Plus,
  Trash2,
  Copy,
  Layers,
  Server,
  Terminal,
  Zap,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface EnterpriseSettingsProps {
  userRole?: UserRole;
}

export const EnterpriseSettings: React.FC<EnterpriseSettingsProps> = ({
  userRole = 'super_admin'
}) => {
  // Sidebar Category Navigation
  const [activeCategory, setActiveCategory] = useState<
    | 'org'
    | 'branding'
    | 'academic'
    | 'attendance'
    | 'certificates'
    | 'payments'
    | 'notifications'
    | 'templates'
    | 'roles'
    | 'security'
    | 'feature_flags'
    | 'storage'
    | 'integrations'
    | 'audit'
    | 'backup'
    | 'logs'
    | 'health'
  >('org');

  // Audit Log State
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [configVersion, setConfigVersion] = useState<number>(1.4);

  // 1. Organization Settings State
  const [orgState, setOrgState] = useState({
    companyName: 'LearnIT Technologies Pvt Ltd',
    legalName: 'LearnIT Higher Ed Systems India Ltd',
    gstNumber: '29AAAAA0000A1Z5',
    address: 'HQ Tech Park, Outer Ring Road, Bangalore, KA - 560103',
    supportEmail: 'admin-support@learnit.edu',
    supportPhone: '+91 (080) 4567-8900',
    website: 'https://learnit.edu'
  });

  // 2. Branding Settings State
  const [brandingState, setBrandingState] = useState({
    primaryColor: '#6366F1',
    secondaryColor: '#10B981',
    watermarkText: 'OFFICIAL LEARNIT PORTAL',
    whiteLabelEnabled: true,
    darkThemeDefault: true
  });

  // 3. Academic Settings State
  const [academicState, setAcademicState] = useState({
    academicYear: '2025-2026',
    currentSemester: 'Odd Semester 2026',
    programDurationMonths: 6,
    passingScore: 40,
    placementCutoffPercentage: 60
  });

  // 4. Attendance Settings State
  const [attendanceState, setAttendanceState] = useState({
    method: 'hybrid', // qr, manual, hybrid
    thresholdPercentage: 75,
    qrExpiryMinutes: 15,
    lateEntryGracePeriodMins: 10
  });

  // 5. Certificate Settings State
  const [certificateState, setCertificateState] = useState({
    prefix: 'LIT-2026',
    autoApproval: true,
    qrVerificationDomain: 'https://verify.learnit.edu'
  });

  // 6. Payment Settings State
  const [paymentState, setPaymentState] = useState({
    currency: 'INR',
    taxPercentage: 18,
    invoicePrefix: 'INV-2026-',
    reminderDaysBeforeDue: 5
  });

  // 7. Feature Flags State
  const [featureFlags, setFeatureFlags] = useState({
    attendanceModule: true,
    certificateModule: true,
    placementModule: true,
    paymentGateway: true,
    assessmentModule: true,
    aiTutorBot: true,
    whatsappAlerts: true,
    multiTenantSupport: true
  });

  // 8. Integrations State
  const [integrations, setIntegrations] = useState([
    { id: 'int_razorpay', name: 'Razorpay Payment Gateway', category: 'Payment', status: 'Connected', key: 'rzp_live_89123' },
    { id: 'int_stripe', name: 'Stripe International', category: 'Payment', status: 'Connected', key: 'pk_live_44122' },
    { id: 'int_zoom', name: 'Zoom Video Classroom', category: 'Classroom', status: 'Connected', key: 'zm_app_77182' },
    { id: 'int_sendgrid', name: 'SendGrid Email API', category: 'Notification', status: 'Connected', key: 'SG.8921829.112' },
    { id: 'int_msg91', name: 'MSG91 WhatsApp Gateway', category: 'Notification', status: 'Connected', key: 'msg_auth_4410' },
    { id: 'int_s3', name: 'AWS S3 Asset Vault', category: 'Storage', status: 'Connected', key: 's3-bucket-learnit-prod' }
  ]);

  // Handle Save Action
  const handleSave = (sectionName: string) => {
    setConfigVersion((prev) => parseFloat((prev + 0.1).toFixed(1)));
    setSaveSuccessMessage(`${sectionName} saved & applied to system audit trail (v${(configVersion + 0.1).toFixed(1)}).`);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  // Block Access for Students and Mentors
  if (userRole === 'student' || userRole === 'mentor') {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-12 text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Restricted to System Administrators</h2>
        <p className="text-xs text-[#888] leading-relaxed">
          The Enterprise Settings & Platform Governance module is restricted to Super Admins and College Administrators. Please contact your institution administrator if you require custom configuration changes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#080808] rounded-2xl p-6 text-white border border-[#1A1A1A] shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono text-[#6366F1] uppercase tracking-wider bg-[#6366F1]/10 px-2.5 py-0.5 rounded border border-[#6366F1]/20">
                NO-CODE SYSTEM GOVERNANCE
              </span>
              <span className="text-xs text-[#AAA] font-medium font-mono">Config Version v{configVersion.toFixed(1)}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1">Enterprise Settings & Platform Configuration</h1>
            <p className="text-xs text-[#888] mt-0.5">
              Manage organization rules, security, integrations, feature flags, and templates without code deployments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-xs font-bold font-mono flex items-center gap-1.5">
              <Check className="w-4 h-4" /> System Healthy
            </span>
            <button
              onClick={() => handleSave('Global Enterprise Settings')}
              className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" /> Save All Configurations
            </button>
          </div>
        </div>

        {saveSuccessMessage && (
          <div className="mt-4 p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl text-xs text-[#10B981] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {saveSuccessMessage}
          </div>
        )}
      </div>

      {/* Main Settings Layout (Sidebar Navigation + Config Content Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Settings Navigation Sidebar */}
        <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-3 space-y-1 text-xs">
          {[
            { id: 'org', label: 'Organization Info', icon: <Building2 className="w-4 h-4" /> },
            { id: 'branding', label: 'Branding & White Label', icon: <Palette className="w-4 h-4" /> },
            { id: 'academic', label: 'Academic & Grading', icon: <GraduationCap className="w-4 h-4" /> },
            { id: 'attendance', label: 'Attendance & Roll Call', icon: <CheckCircle2 className="w-4 h-4" /> },
            { id: 'certificates', label: 'Certificate Verification', icon: <Award className="w-4 h-4" /> },
            { id: 'payments', label: 'Payments & Taxes', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notification Priority', icon: <Bell className="w-4 h-4" /> },
            { id: 'templates', label: 'Email, SMS & WhatsApp', icon: <Mail className="w-4 h-4" /> },
            { id: 'roles', label: 'Roles & Permission Matrix', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'security', label: 'Security & Auth Policy', icon: <Lock className="w-4 h-4" /> },
            { id: 'feature_flags', label: 'Feature Flags', icon: <Sliders className="w-4 h-4" />, badge: '8 Modules' },
            { id: 'storage', label: 'Storage & Upload Limits', icon: <HardDrive className="w-4 h-4" /> },
            { id: 'integrations', label: 'Integrations & API Keys', icon: <Cpu className="w-4 h-4" />, badge: '6 Active' },
            { id: 'audit', label: 'Audit & Compliance Logs', icon: <History className="w-4 h-4" /> },
            { id: 'backup', label: 'Backup & Disaster Recovery', icon: <Database className="w-4 h-4" /> },
            { id: 'logs', label: 'System Event Logs', icon: <Terminal className="w-4 h-4" /> },
            { id: 'health', label: 'Platform Infrastructure Health', icon: <Activity className="w-4 h-4" />, badge: '99.9%' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#6366F1] text-white shadow-md font-bold'
                  : 'text-[#888] hover:text-white hover:bg-[#111]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {cat.icon}
                <span>{cat.label}</span>
              </div>
              {cat.badge && (
                <span className="text-[9px] font-bold bg-[#111] text-[#AAA] border border-[#222] px-1.5 py-0.5 rounded">
                  {cat.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Configuration Panel Content */}
        <div className="lg:col-span-3 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 text-xs space-y-6">
          
          {/* SECTION 1: ORGANIZATION */}
          {activeCategory === 'org' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white">Organization Profile & Entity Details</h3>
                <p className="text-[#888] text-xs">Primary legal business entity details printed on invoices and certificates</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Company Trade Name</label>
                  <input
                    type="text"
                    value={orgState.companyName}
                    onChange={(e) => setOrgState({ ...orgState, companyName: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Legal Registered Entity Name</label>
                  <input
                    type="text"
                    value={orgState.legalName}
                    onChange={(e) => setOrgState({ ...orgState, legalName: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">GST Registration Number</label>
                  <input
                    type="text"
                    value={orgState.gstNumber}
                    onChange={(e) => setOrgState({ ...orgState, gstNumber: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Official Support Email</label>
                  <input
                    type="email"
                    value={orgState.supportEmail}
                    onChange={(e) => setOrgState({ ...orgState, supportEmail: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Registered Address</label>
                  <textarea
                    rows={2}
                    value={orgState.address}
                    onChange={(e) => setOrgState({ ...orgState, address: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A] flex justify-end">
                <button
                  onClick={() => handleSave('Organization Settings')}
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save Organization Info
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: BRANDING */}
          {activeCategory === 'branding' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white">White Label & Visual Identity</h3>
                <p className="text-[#888] text-xs">Configure platform theme colors, watermarks, and white-label portal domains</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Primary Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandingState.primaryColor}
                      onChange={(e) => setBrandingState({ ...brandingState, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={brandingState.primaryColor}
                      onChange={(e) => setBrandingState({ ...brandingState, primaryColor: e.target.value })}
                      className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Secondary Success Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandingState.secondaryColor}
                      onChange={(e) => setBrandingState({ ...brandingState, secondaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={brandingState.secondaryColor}
                      onChange={(e) => setBrandingState({ ...brandingState, secondaryColor: e.target.value })}
                      className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Document Watermark Text</label>
                  <input
                    type="text"
                    value={brandingState.watermarkText}
                    onChange={(e) => setBrandingState({ ...brandingState, watermarkText: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-medium"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#111] border border-[#222] flex items-center justify-between">
                  <div>
                    <strong className="text-white block font-bold">Enable Institutional White-Labeling</strong>
                    <span className="text-[#777] text-[11px]">Allow partner colleges to upload their own logo on student dashboards</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={brandingState.whiteLabelEnabled}
                    onChange={(e) => setBrandingState({ ...brandingState, whiteLabelEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#6366F1] rounded"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A] flex justify-end">
                <button
                  onClick={() => handleSave('Branding Configuration')}
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save Branding Policy
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: ACADEMIC */}
          {activeCategory === 'academic' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white">Academic Calendar & Grading Rules</h3>
                <p className="text-[#888] text-xs">Set active term, minimum passing scores, and placement eligibility thresholds</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Active Academic Year</label>
                  <select
                    value={academicState.academicYear}
                    onChange={(e) => setAcademicState({ ...academicState, academicYear: e.target.value })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white"
                  >
                    <option value="2025-2026">2025 - 2026</option>
                    <option value="2024-2025">2024 - 2025</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Placement Eligibility Cutoff (%)</label>
                  <input
                    type="number"
                    value={academicState.placementCutoffPercentage}
                    onChange={(e) => setAcademicState({ ...academicState, placementCutoffPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A] flex justify-end">
                <button
                  onClick={() => handleSave('Academic Governance Settings')}
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save Academic Rules
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: ATTENDANCE */}
          {activeCategory === 'attendance' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white">Attendance Method & Roll Call Governance</h3>
                <p className="text-[#888] text-xs">Configure QR code validity, late entry grace windows, and mandatory thresholds</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Mandatory Attendance Threshold (%)</label>
                  <input
                    type="number"
                    value={attendanceState.thresholdPercentage}
                    onChange={(e) => setAttendanceState({ ...attendanceState, thresholdPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Dynamic QR Expiry (Minutes)</label>
                  <input
                    type="number"
                    value={attendanceState.qrExpiryMinutes}
                    onChange={(e) => setAttendanceState({ ...attendanceState, qrExpiryMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A] flex justify-end">
                <button
                  onClick={() => handleSave('Attendance Policy')}
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save Attendance Settings
                </button>
              </div>
            </div>
          )}

          {/* SECTION 10: FEATURE FLAGS */}
          {activeCategory === 'feature_flags' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white">Dynamic Platform Feature Flags</h3>
                <p className="text-[#888] text-xs">Toggle system modules on or off instantaneously across all institutions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(featureFlags).map(([key, enabled]) => (
                  <div key={key} className="p-4 rounded-xl bg-[#111] border border-[#222] flex items-center justify-between">
                    <div>
                      <strong className="text-white block capitalize font-bold">{key.replace(/([A-Z])/g, ' $1')}</strong>
                      <span className="text-[#777] text-[11px]">Toggle operational availability</span>
                    </div>
                    <button
                      onClick={() => setFeatureFlags({ ...featureFlags, [key]: !enabled })}
                      className={`px-3 py-1 rounded-lg font-bold font-mono text-[10px] transition-all ${
                        enabled ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                      }`}
                    >
                      {enabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#1A1A1A] flex justify-end">
                <button
                  onClick={() => handleSave('Feature Flags Configuration')}
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                >
                  Apply Feature Toggles
                </button>
              </div>
            </div>
          )}

          {/* SECTION 13: INTEGRATIONS */}
          {activeCategory === 'integrations' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white">Third-Party Service Integrations & API Credentials</h3>
                <p className="text-[#888] text-xs">Payment gateways, video streaming, cloud storage, and communication APIs</p>
              </div>

              <div className="space-y-3">
                {integrations.map((int) => (
                  <div key={int.id} className="p-4 rounded-xl bg-[#111] border border-[#222] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{int.name}</span>
                        <span className="text-[10px] font-mono text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.2 rounded border border-[#6366F1]/20">
                          {int.category}
                        </span>
                      </div>
                      <p className="text-[#777] text-[11px] font-mono mt-1">API Key / Descriptor: {int.key}</p>
                    </div>

                    <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-lg text-[10px] font-bold font-mono">
                      {int.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#1A1A1A] flex justify-end">
                <button
                  onClick={() => handleSave('Integrations Vault')}
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save API Keys
                </button>
              </div>
            </div>
          )}

          {/* SECTION 9: ROLES & PERMISSIONS */}
          {activeCategory === 'roles' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1A1A]">
                <div>
                  <h3 className="text-base font-bold text-white">RBAC Roles & Permission Access Matrix</h3>
                  <p className="text-[#888] text-xs">Define granular Create, Read, Update, Delete (CRUD) permissions across user roles</p>
                </div>
                <button
                  onClick={() => handleSave('Roles & Permission Matrix')}
                  className="px-4 py-1.5 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
                >
                  + Create Custom Role
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#AAA]">
                  <thead className="bg-[#111] text-[#888] uppercase text-[10px] font-mono border-b border-[#222]">
                    <tr>
                      <th className="p-3">Module / Capability</th>
                      <th className="p-3">Super Admin</th>
                      <th className="p-3">College Admin</th>
                      <th className="p-3">Mentor</th>
                      <th className="p-3">Placement Officer</th>
                      <th className="p-3">Student</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A] font-medium">
                    {[
                      { module: 'Dashboard & Core BI', super: 'Full (CRUD)', college: 'Full (CRUD)', mentor: 'Read Only', placement: 'Read Only', student: 'Read Only' },
                      { module: 'Students Management', super: 'Full (CRUD)', college: 'Full (CRUD)', mentor: 'Read/Write', placement: 'Read Only', student: 'Self Only' },
                      { module: 'Mentors Management', super: 'Full (CRUD)', college: 'Full (CRUD)', mentor: 'Self Only', placement: 'None', student: 'None' },
                      { module: 'Attendance Roll Call', super: 'Full (CRUD)', college: 'Full (CRUD)', mentor: 'Mark / Verify', placement: 'Read Only', student: 'QR Check-in' },
                      { module: 'Assignments & Grading', super: 'Full (CRUD)', college: 'Audit Only', mentor: 'Create / Grade', placement: 'None', student: 'Submit Only' },
                      { module: 'Placement Drives & Offers', super: 'Full (CRUD)', college: 'Full (CRUD)', mentor: 'Read Only', placement: 'Full (CRUD)', student: 'Apply / Accept' },
                      { module: 'Certificate Verification', super: 'Full (CRUD)', college: 'Issue / Revoke', mentor: 'Recommend', placement: 'Read Only', student: 'Download PDF' },
                      { module: 'System Settings & API', super: 'Full (CRUD)', college: 'Limited Read', mentor: 'None', placement: 'None', student: 'None' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#111]/50">
                        <td className="p-3 font-bold text-white">{row.module}</td>
                        <td className="p-3 text-[#10B981] font-mono">{row.super}</td>
                        <td className="p-3 text-[#10B981] font-mono">{row.college}</td>
                        <td className="p-3 text-[#F59E0B] font-mono">{row.mentor}</td>
                        <td className="p-3 text-[#6366F1] font-mono">{row.placement}</td>
                        <td className="p-3 text-[#888] font-mono">{row.student}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A] flex justify-end">
                <button
                  onClick={() => handleSave('RBAC Permission Matrix')}
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save Permission Matrix
                </button>
              </div>
            </div>
          )}

          {/* SECTION 10: SECURITY */}
          {activeCategory === 'security' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white">Platform Security & Auth Enforcement</h3>
                <p className="text-[#888] text-xs">Configure MFA policies, session timeouts, password strength, and active device logins</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#111] border border-[#222] space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-white block font-bold">Require Multi-Factor Authentication (MFA)</strong>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#6366F1] rounded" />
                  </div>
                  <p className="text-[#777] text-[11px]">Enforce TOTP authenticator or SMS verification for all admin and mentor logins</p>
                </div>

                <div className="p-4 rounded-xl bg-[#111] border border-[#222] space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-white block font-bold">Session Idle Timeout (Minutes)</strong>
                    <span className="text-xs font-mono text-[#6366F1] font-bold">30 Mins</span>
                  </div>
                  <input type="range" min="15" max="120" defaultValue="30" className="w-full accent-[#6366F1]" />
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Max Failed Login Attempts Before Lockout</label>
                  <select defaultValue="5" className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white">
                    <option value="3">3 Attempts (Strict)</option>
                    <option value="5">5 Attempts (Standard)</option>
                    <option value="10">10 Attempts (Relaxed)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#888] block text-[10px] uppercase font-bold mb-1">Minimum Password Length</label>
                  <input type="number" defaultValue="12" className="w-full p-2.5 bg-[#111] border border-[#222] rounded-xl text-white font-mono" />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A] flex justify-end">
                <button
                  onClick={() => handleSave('Security Policy')}
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                >
                  Apply Security Policy
                </button>
              </div>
            </div>
          )}

          {/* SECTION 11: AUDIT LOGS */}
          {activeCategory === 'audit' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">Immutable Security Audit Logs</h3>
                  <p className="text-[#888] text-xs">Real-time recording of administrative modifications, logins, and API actions</p>
                </div>
                <button className="px-3 py-1.5 bg-[#111] border border-[#222] text-[#AAA] hover:text-white rounded-lg text-xs font-mono">
                  Export Audit CSV
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { user: 'Dr. Rajeshwardas Sharma (Placement Officer)', action: 'Approved Offer Letter for Priya Nair (1SX22CS014)', module: 'Placements', time: '2026-08-04 03:15:00', ip: '192.168.1.104', status: 'SUCCESS' },
                  { user: 'Prof. Rajesh Kumar (Mentor)', action: 'Graded Assignment: Cloud Distributed Systems', module: 'Assignments', time: '2026-08-04 02:40:12', ip: '10.0.4.12', status: 'SUCCESS' },
                  { user: 'Super Admin', action: 'Modified System Security Policy & MFA Grace Period', module: 'Security', time: '2026-08-03 18:22:05', ip: '172.16.0.1', status: 'SUCCESS' },
                  { user: 'System Worker (Cron)', action: 'Executed Automated Database Snapshot Backup', module: 'Backup', time: '2026-08-03 00:00:00', ip: '127.0.0.1', status: 'SUCCESS' }
                ].map((log, i) => (
                  <div key={i} className="p-3 bg-[#111] border border-[#222] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{log.user}</strong>
                        <span className="text-[10px] font-mono text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.2 rounded border border-[#6366F1]/20">{log.module}</span>
                      </div>
                      <p className="text-[#AAA] mt-0.5">{log.action}</p>
                    </div>
                    <div className="text-right text-[11px] font-mono text-[#666]">
                      <span>{log.time}</span>
                      <div className="text-[#10B981]">{log.ip} • {log.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 12: BACKUP & DISASTER RECOVERY */}
          {activeCategory === 'backup' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Database Backup & Disaster Recovery Points</h3>
                  <p className="text-[#888] text-xs">Automated snapshots, point-in-time recovery, and multi-region replication</p>
                </div>
                <button
                  onClick={() => handleSave('Manual On-Demand Database Snapshot')}
                  className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  Trigger On-Demand Backup
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-[#111] border border-[#222] rounded-xl">
                  <span className="text-[#666] text-[10px] uppercase font-bold block">Last Snapshot Taken</span>
                  <span className="text-white font-mono font-bold text-sm">Today at 03:00 AM</span>
                </div>
                <div className="p-4 bg-[#111] border border-[#222] rounded-xl">
                  <span className="text-[#666] text-[10px] uppercase font-bold block">Backup Storage Vault</span>
                  <span className="text-[#10B981] font-mono font-bold text-sm">AWS S3 (Encrypted AES-256)</span>
                </div>
                <div className="p-4 bg-[#111] border border-[#222] rounded-xl">
                  <span className="text-[#666] text-[10px] uppercase font-bold block">Retention Policy</span>
                  <span className="text-white font-mono font-bold text-sm">30 Days Daily + 12 Mo Monthly</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#666] tracking-wider block">Available Restore Points</span>
                {[
                  { name: 'Daily_Auto_Snapshot_2026-08-04.sql.gz', size: '248 MB', status: 'VERIFIED & READY' },
                  { name: 'Daily_Auto_Snapshot_2026-08-03.sql.gz', size: '246 MB', status: 'VERIFIED & READY' },
                  { name: 'Weekly_Full_Backup_2026-08-01.tar.gz', size: '1.2 GB', status: 'ARCHIVED ON S3' }
                ].map((b, i) => (
                  <div key={i} className="p-3 bg-[#111] border border-[#222] rounded-xl flex items-center justify-between text-xs">
                    <span className="font-mono text-white font-bold">{b.name} <span className="text-[#666]">({b.size})</span></span>
                    <button className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#222] text-[#6366F1] font-bold rounded-lg border border-[#333]">
                      Restore Point
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 14: SYSTEM EVENT LOGS */}
          {activeCategory === 'logs' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white">System Runtime & Console Logs</h3>
                <p className="text-[#888] text-xs">Container stdout/stderr streams, API gateway latency logs, and error traces</p>
              </div>

              <div className="p-4 bg-[#050505] border border-[#222] rounded-xl font-mono text-[11px] text-[#A855F7] space-y-1.5 h-64 overflow-y-auto scrollbar-thin">
                <div><span className="text-[#666]">[2026-08-04 03:36:10]</span> <span className="text-[#10B981]">INFO</span> [api-gateway] GET /api/v1/placement/drives 200 OK - 14ms</div>
                <div><span className="text-[#666]">[2026-08-04 03:36:12]</span> <span className="text-[#10B981]">INFO</span> [auth-service] JWT token verified for user_role=placement_officer</div>
                <div><span className="text-[#666]">[2026-08-04 03:36:15]</span> <span className="text-[#10B981]">INFO</span> [cron-worker] Synced 142 student eligibility scores with Cloud SQL</div>
                <div><span className="text-[#666]">[2026-08-04 03:36:20]</span> <span className="text-[#3B82F6]">DEBUG</span> [websocket-server] Broadcasted message update to room `placement_officer_desk`</div>
                <div><span className="text-[#666]">[2026-08-04 03:36:25]</span> <span className="text-[#10B981]">INFO</span> [health-check] Cloud Run worker instance status healthy (CPU: 12%, RAM: 184MB)</div>
              </div>
            </div>
          )}

          {/* SECTION 15: PLATFORM INFRASTRUCTURE HEALTH */}
          {activeCategory === 'health' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white">Cloud Infrastructure & Telemetry Health</h3>
                <p className="text-[#888] text-xs">Monitored services, queue workers, database connectivity, and uptime metrics</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-[#111] border border-[#222] rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-[#666] uppercase font-bold block">Core API Service</span>
                  <span className="text-[#10B981] font-mono font-extrabold text-base">99.98% Uptime</span>
                </div>
                <div className="p-4 bg-[#111] border border-[#222] rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-[#666] uppercase font-bold block">Database Pool</span>
                  <span className="text-[#10B981] font-mono font-extrabold text-base">Active (12ms latency)</span>
                </div>
                <div className="p-4 bg-[#111] border border-[#222] rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-[#666] uppercase font-bold block">Queue Worker Jobs</span>
                  <span className="text-[#6366F1] font-mono font-extrabold text-base">0 Backlog / OK</span>
                </div>
                <div className="p-4 bg-[#111] border border-[#222] rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-[#666] uppercase font-bold block">Storage Bucket</span>
                  <span className="text-[#10B981] font-mono font-extrabold text-base">S3 Connected</span>
                </div>
              </div>
            </div>
          )}

          {/* DEFAULT / FALLBACK FOR OTHER CATEGORIES */}
          {!['org', 'branding', 'academic', 'attendance', 'feature_flags', 'integrations', 'roles', 'security', 'audit', 'backup', 'logs', 'health'].includes(activeCategory) && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#1A1A1A]">
                <h3 className="text-base font-bold text-white capitalize">{activeCategory.replace('_', ' ')} Governance Module</h3>
                <p className="text-[#888] text-xs">Enterprise platform level control matrix and compliance management</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111] border border-[#222] space-y-3 text-xs">
                <div className="flex items-center gap-2 text-[#10B981] font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Policy Enforcement Active
                </div>
                <p className="text-[#AAA] leading-relaxed">
                  All configuration updates in this module are automatically encrypted, timestamped, and propagated across active Cloud Run worker containers.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleSave(activeCategory.toUpperCase())}
                    className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                  >
                    Commit Configuration Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
