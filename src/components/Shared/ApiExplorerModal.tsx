import React, { useState } from 'react';
import {
  Code,
  Globe,
  Lock,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Layers,
  ShieldCheck,
  Zap,
  Server,
  FileText,
  X,
  Search,
  Filter,
  Activity
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ApiExplorerModalProps {
  onClose: () => void;
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  group: string;
  description: string;
  roleRequired: string;
  requestExample?: object;
  responseExample: object;
}

const apiEndpoints: ApiEndpoint[] = [
  // Authentication
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    group: 'Authentication',
    description: 'Authenticate user and generate short-lived Access Token & Refresh Token',
    roleRequired: 'Public',
    requestExample: {
      email: 'admin@learnit.edu',
      password: '••••••••••••',
      rememberMe: true
    },
    responseExample: {
      success: true,
      message: 'Authentication successful.',
      data: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dXlkLTEyMyIsInJvbGUiOiJzdXBlcl9hZG1pbiJ9...',
        refreshToken: 'd39f4e21a812bc8f92a10123984',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'admin@learnit.edu',
          role: 'super_admin',
          name: 'HQ Operations Lead'
        }
      },
      meta: { timestamp: '2026-08-04T00:00:00Z', version: 'v1.0' }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/colleges',
    group: 'Partner Colleges',
    description: 'Fetch paginated list of institutional partner engineering colleges with active tier status',
    roleRequired: 'Super Admin, College Admin',
    responseExample: {
      success: true,
      message: 'Colleges fetched successfully.',
      data: [
        {
          id: 'col-9901-uuid',
          code: 'SXIT-2026',
          name: "St. Xavier's Institute of Technology",
          location: 'Mumbai, MH',
          tier: 'Enterprise',
          totalStudents: 1450,
          placementRate: 94.2,
          contractStatus: 'Active'
        }
      ],
      meta: { page: 1, limit: 20, totalRecords: 48, totalPages: 3 }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/attendance/qr-scan',
    group: 'Attendance Engine',
    description: 'Validate dynamic time-bound QR code & record student geo-verified attendance',
    roleRequired: 'Student',
    requestExample: {
      qrPayload: 'LIT-QR-SESSION-998821',
      studentId: 'STU-2026-8801',
      deviceToken: 'dev-token-9002'
    },
    responseExample: {
      success: true,
      message: 'Attendance recorded successfully.',
      data: {
        attendanceId: 'att-uuid-7712',
        sessionName: 'Full-Stack React & Node System Design',
        status: 'PRESENT',
        markedAt: '2026-08-04T09:15:02Z'
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/certificates/generate',
    group: 'Certificates & Verification',
    description: 'Issue tamper-evident cryptographically signed digital certificate with QR verification code',
    roleRequired: 'College Admin, Mentor',
    requestExample: {
      studentId: 'STU-2026-8801',
      trainingProgramId: 'prog-fullstack-01',
      issueDate: '2026-08-04'
    },
    responseExample: {
      success: true,
      message: 'Certificate issued successfully.',
      data: {
        certificateNumber: 'LIT-2026-CERT-9042',
        verificationUrl: 'https://learnit.edu/verify/LIT-2026-CERT-9042',
        qrCodeUrl: 'https://cdn.learnit.edu/qr/cert-9042.png',
        status: 'ACTIVE'
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/payments/process',
    group: 'Payments & Receipts',
    description: 'Process institutional batch subscription payment & generate instant GST compliance receipt',
    roleRequired: 'College Admin, Student',
    requestExample: {
      studentId: 'STU-2026-8801',
      amount: 45000,
      paymentMode: 'UPI_RAZORPAY',
      transactionRef: 'TXN-998811200'
    },
    responseExample: {
      success: true,
      message: 'Payment processed and receipt generated.',
      data: {
        paymentNumber: 'PAY-2026-8890',
        receiptNumber: 'RCP-2026-00412',
        status: 'SUCCESS',
        amountPaid: 45000,
        pdfDownloadUrl: 'https://cdn.learnit.edu/receipts/RCP-2026-00412.pdf'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/audit-logs',
    group: 'Security & Audit',
    description: 'Query enterprise immutable audit trail for security events and privilege modifications',
    roleRequired: 'Super Admin',
    responseExample: {
      success: true,
      message: 'Audit trail retrieved.',
      data: [
        {
          id: 'audit-uuid-1',
          timestamp: '2026-08-04T00:12:10Z',
          userEmail: 'superadmin@learnit.edu',
          action: 'PARTNER_COLLEGE_ONBOARDED',
          module: 'Colleges',
          ipAddress: '103.21.124.9'
        }
      ],
      meta: { page: 1, limit: 10, totalRecords: 240 }
    }
  },
  {
    method: 'GET',
    path: '/health',
    group: 'System Observability',
    description: 'Primary platform operational health check endpoint for Cloud Run container ingress probes',
    roleRequired: 'Public',
    responseExample: {
      status: 'healthy',
      version: 'v1.0.0',
      database: 'connected (PostgreSQL 16)',
      redisCache: 'active',
      uptimeSeconds: 84920
    }
  }
];

export const ApiExplorerModal: React.FC<ApiExplorerModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(apiEndpoints[0]);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'openapi' | 'tester'>('endpoints');
  const [copied, setCopied] = useState(false);
  const [testExecuting, setTestExecuting] = useState(false);
  const [testResponse, setTestResponse] = useState<object | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTest = () => {
    setTestExecuting(true);
    setTimeout(() => {
      setTestResponse(selectedEndpoint.responseExample);
      setTestExecuting(false);
    }, 400);
  };

  const filteredEndpoints = apiEndpoints.filter(
    (ep) =>
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const methodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30';
      case 'POST':
        return 'bg-[#6366F1]/20 text-[#6366F1] border-[#6366F1]/30';
      case 'PUT':
      case 'PATCH':
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30';
      case 'DELETE':
        return 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30';
      default:
        return 'bg-[#888]/20 text-[#888] border-[#888]/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col border shadow-2xl overflow-hidden ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
          : 'bg-white border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-[#1A1A1A] bg-[#080808]' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#6366F1]/20 border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1]">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-bold text-base ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>LearnIT Enterprise REST API Specifications</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  Part 7 Standard • /api/v1
                </span>
              </div>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`}>Versioned, JSON-formatted, JWT protected enterprise endpoints</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Nav Tabs */}
            <div className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${
              theme === 'dark' 
                ? 'bg-[#111] border-[#222]' 
                : 'bg-gray-100 border-gray-200'
            }`}>
              <button
                onClick={() => setActiveTab('endpoints')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'endpoints' 
                    ? theme === 'dark' ? 'bg-[#222] text-white' : 'bg-white text-gray-900 shadow-sm' 
                    : theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Endpoints Directory
              </button>
              <button
                onClick={() => setActiveTab('tester')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'tester' 
                    ? theme === 'dark' ? 'bg-[#222] text-white' : 'bg-white text-gray-900 shadow-sm' 
                    : theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                API Console
              </button>
              <button
                onClick={() => setActiveTab('openapi')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'openapi' 
                    ? theme === 'dark' ? 'bg-[#222] text-white' : 'bg-white text-gray-900 shadow-sm' 
                    : theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                OpenAPI Spec
              </button>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-[#666] hover:text-white hover:bg-[#1A1A1A]' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'endpoints' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Left List */}
              <div className={`w-80 border-r flex flex-col p-4 gap-3 ${
                theme === 'dark' 
                  ? 'border-[#1A1A1A] bg-[#070707]' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="relative">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                    theme === 'dark' ? 'text-[#555]' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Filter endpoints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-hidden ${
                      theme === 'dark' 
                        ? 'bg-[#0D0D0D] border-[#222] text-white placeholder-[#555] focus:border-[#6366F1]' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-400'
                    }`}
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {filteredEndpoints.map((ep) => (
                    <button
                      key={ep.path + ep.method}
                      onClick={() => {
                        setSelectedEndpoint(ep);
                        setTestResponse(null);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                        selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method
                          ? theme === 'dark' 
                            ? 'bg-[#141414] border-[#6366F1]/50 shadow-md' 
                            : 'bg-indigo-50 border-indigo-300 shadow-md'
                          : theme === 'dark' 
                            ? 'border-[#181818] bg-[#0A0A0A] hover:bg-[#111]' 
                            : 'border-gray-200 bg-white hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${methodColor(ep.method)}`}>
                          {ep.method}
                        </span>
                        <span className={`text-[10px] font-medium ${
                          theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
                        }`}>{ep.group}</span>
                      </div>
                      <p className={`text-xs font-mono truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{ep.path}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Detail Pane */}
              <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${
                theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-gray-50'
              }`}>
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase ${methodColor(selectedEndpoint.method)}`}>
                      {selectedEndpoint.method}
                    </span>
                    <h3 className={`text-lg font-mono font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{selectedEndpoint.path}</h3>
                  </div>
                  <p className={`text-xs mt-2 ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>{selectedEndpoint.description}</p>
                  <div className={`mt-3 flex items-center gap-4 text-xs ${
                    theme === 'dark' ? 'text-[#666]' : 'text-gray-500'
                  }`}>
                    <span className={`flex items-center gap-1.5 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    }`}>
                      <Lock className="w-3.5 h-3.5 text-[#A855F7]" /> Access Role: <strong className={`font-normal ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{selectedEndpoint.roleRequired}</strong>
                    </span>
                    <span className={`flex items-center gap-1.5 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    }`}>
                      <Globe className="w-3.5 h-3.5 text-[#10B981]" /> Headers: <code className={`text-[11px] px-1.5 py-0.5 rounded ${
                        theme === 'dark' ? 'bg-[#141414] text-[#CCC]' : 'bg-gray-200 text-gray-700'
                      }`}>Authorization: Bearer &lt;JWT&gt;</code>
                    </span>
                  </div>
                </div>

                {/* Request Payload */}
                {selectedEndpoint.requestExample && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        theme === 'dark' ? 'text-[#777]' : 'text-gray-500'
                      }`}>Sample Request Body (JSON)</span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(selectedEndpoint.requestExample, null, 2))}
                        className="text-[11px] text-[#6366F1] flex items-center gap-1 hover:underline"
                      >
                        {copied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />} Copy JSON
                      </button>
                    </div>
                    <pre className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto ${
                      theme === 'dark' 
                        ? 'bg-[#050505] border-[#1A1A1A] text-[#A855F7]' 
                        : 'bg-gray-900 border-gray-300 text-purple-400'
                    }`}>
                      {JSON.stringify(selectedEndpoint.requestExample, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Response Schema */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-[#777]' : 'text-gray-500'
                    }`}>Standard Response (Part 7 Format)</span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(selectedEndpoint.responseExample, null, 2))}
                      className="text-[11px] text-[#6366F1] flex items-center gap-1 hover:underline"
                    >
                      {copied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />} Copy Response
                    </button>
                  </div>
                  <pre className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto ${
                    theme === 'dark' 
                      ? 'bg-[#050505] border-[#1A1A1A] text-[#10B981]' 
                      : 'bg-gray-900 border-gray-300 text-emerald-400'
                    }`}>
                    {JSON.stringify(selectedEndpoint.responseExample, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tester' && (
            <div className={`flex-1 p-6 overflow-y-auto space-y-6 ${
              theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-gray-50'
            }`}>
              <div className={`flex items-center justify-between pb-4 border-b ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200'
              }`}>
                <div>
                  <h3 className={`font-bold text-base ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>API Request Runner</h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>Simulate REST endpoint execution against mock enterprise response engines</p>
                </div>
                <button
                  onClick={handleRunTest}
                  disabled={testExecuting}
                  className="px-5 py-2.5 bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> {testExecuting ? 'Executing...' : 'Send Request'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>Select Endpoint Target</label>
                  <select
                    value={selectedEndpoint.path}
                    onChange={(e) => {
                      const ep = apiEndpoints.find((x) => x.path === e.target.value);
                      if (ep) setSelectedEndpoint(ep);
                    }}
                    className={`w-full rounded-xl p-3 text-xs font-mono ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-[#222] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {apiEndpoints.map((ep) => (
                      <option key={ep.path} value={ep.path}>
                        {ep.method} {ep.path} ({ep.group})
                      </option>
                    ))}
                  </select>

                  <label className={`text-xs font-bold block pt-2 ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>Authorization Bearer Token</label>
                  <input
                    type="text"
                    value="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dXlkLTEyMyIsInJvbGUiOiJzdXBlcl9hZG1pbiJ9..."
                    readOnly
                    className={`w-full rounded-xl p-3 text-xs font-mono ${
                      theme === 'dark' 
                        ? 'bg-[#080808] border-[#1C1C1C] text-[#888]' 
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                    }`}
                  />
                </div>

                <div className="space-y-3">
                  <span className={`text-xs font-bold block ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>HTTP Status Verification</span>
                  <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                    theme === 'dark' 
                      ? 'bg-[#080808] border-[#1A1A1A] text-[#888]' 
                      : 'bg-gray-100 border-gray-200 text-gray-600'
                  }`}>
                    <div className={`flex justify-between ${
                      theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                    }`}>
                      <span>Expected Status:</span> <strong className="text-[#10B981]">200 OK / 201 Created</strong>
                    </div>
                    <div className={`flex justify-between ${
                      theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                    }`}>
                      <span>Rate Limit Window:</span> <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>100 req / min (Redis)</strong>
                    </div>
                    <div className={`flex justify-between ${
                      theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                    }`}>
                      <span>Data Protection:</span> <strong className="text-[#A855F7]">Tenant Isolated (PG RLS)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {testResponse && (
                <div className="space-y-2 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Live Response Payload (200 OK)
                  </span>
                  <pre className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto ${
                    theme === 'dark' 
                      ? 'bg-[#050505] border-[#10B981]/30 text-[#10B981]' 
                      : 'bg-gray-900 border-emerald-300 text-emerald-400'
                  }`}>
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'openapi' && (
            <div className={`flex-1 p-6 overflow-y-auto font-mono text-xs space-y-4 ${
              theme === 'dark' ? 'bg-[#050505] text-[#CCC]' : 'bg-gray-900 text-gray-300'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-700'
              }`}>
                <span className={`text-xs font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-100'
                }`}>OpenAPI v3.0.3 Generated Specification (YAML)</span>
                <button
                  onClick={() => handleCopy(`openapi: 3.0.3\ninfo:\n  title: LearnIT Enterprise API\n  version: 1.0.0`)}
                  className={`px-3 py-1 text-xs rounded-lg flex items-center gap-1 ${
                    theme === 'dark' 
                      ? 'bg-[#1A1A1A] hover:bg-[#222] text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Copy className="w-3 h-3" /> Copy Spec
                </button>
              </div>
              <pre className={`leading-relaxed ${
                theme === 'dark' ? 'text-[#888]' : 'text-gray-400'
              }`}>
{`openapi: 3.0.3
info:
  title: LearnIT Platform Enterprise REST API
  description: High-throughput, multi-tenant academic ERP & placement automation API
  version: 1.0.0
servers:
  - url: https://learnit.edu/api/v1
    description: Production Cloud Run Cluster
paths:
  /auth/login:
    post:
      summary: User authentication
      responses:
        '200':
          description: Successful authentication
  /colleges:
    get:
      summary: List partner engineering institutions
      security:
        - BearerAuth: []
  /attendance/qr-scan:
    post:
      summary: Submit QR code attendance verification
  /certificates/generate:
    post:
      summary: Issue verifiable digital certificate
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
          theme === 'dark' 
            ? 'border-[#1A1A1A] bg-[#080808] text-[#666]' 
            : 'border-gray-200 bg-gray-50 text-gray-500'
        }`}>
          <span className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#6366F1]" /> Base Route: <code className={`font-mono px-1.5 py-0.5 rounded ${
              theme === 'dark' ? 'text-white bg-[#111]' : 'text-gray-900 bg-gray-200'
            }`}>/api/v1</code>
          </span>
          <span>All API outputs follow strict RFC 7807 & Part 7 Master Specification</span>
        </div>

      </div>
    </div>
  );
};
