import React, { useState } from 'react';
import {
  Palette,
  LayoutGrid,
  Type,
  Maximize2,
  Sliders,
  Sparkles,
  Check,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  User,
  ShieldCheck,
  Copy,
  ExternalLink,
  Layers,
  Zap,
  Terminal,
  Clock,
  Send,
  Loader2,
  Trash2,
  Edit2
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'typography' | 'buttons' | 'inputs' | 'tables' | 'cards' | 'feedback' | 'wizard'>('tokens');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form states for showcase controls
  const [inputValue, setInputValue] = useState('John Doe');
  const [selectValue, setSelectValue] = useState('active');
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind', 'Node.js']);
  const [tagInput, setTagInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#080808] rounded-2xl p-6 text-white border border-[#1A1A1A] shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono text-[#6366F1] uppercase tracking-wider bg-[#6366F1]/10 px-2.5 py-0.5 rounded border border-[#6366F1]/20">
                UI BLUEPRINT PART 16
              </span>
              <span className="text-xs text-[#AAA] font-medium font-mono">Enterprise Design System</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1">
              LearnIT Component Library & Design Tokens
            </h1>
            <p className="text-xs text-[#888] mt-0.5">
              High-contrast, minimal luxury UI architecture inspired by Linear, Stripe, Vercel & Apple
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-xs font-bold font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 100% WCAG AA Compliant
            </span>
          </div>
        </div>

        {/* System Specs Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-4 border-t border-[#1A1A1A] text-xs">
          <div className="bg-[#111] p-2.5 rounded-xl border border-[#222]">
            <span className="text-[10px] text-[#666] font-mono block">CONTAINER GRID</span>
            <strong className="text-white font-mono">1440px / 12 Col</strong>
          </div>
          <div className="bg-[#111] p-2.5 rounded-xl border border-[#222]">
            <span className="text-[10px] text-[#666] font-mono block">TYPOGRAPHY</span>
            <strong className="text-white font-mono">Inter / System UI</strong>
          </div>
          <div className="bg-[#111] p-2.5 rounded-xl border border-[#222]">
            <span className="text-[10px] text-[#666] font-mono block">SPACING SCALE</span>
            <strong className="text-white font-mono">4px - 128px Rhythmic</strong>
          </div>
          <div className="bg-[#111] p-2.5 rounded-xl border border-[#222]">
            <span className="text-[10px] text-[#666] font-mono block">BORDER RADIUS</span>
            <strong className="text-white font-mono">8px, 12px, 16px, 20px, 24px</strong>
          </div>
          <div className="bg-[#111] p-2.5 rounded-xl border border-[#222]">
            <span className="text-[10px] text-[#666] font-mono block">MAX ANIM DURATION</span>
            <strong className="text-white font-mono">300ms Micro-FX</strong>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-2 overflow-x-auto text-xs">
        {[
          { id: 'tokens', label: 'Design Tokens & Colors', icon: <Palette className="w-4 h-4" /> },
          { id: 'typography', label: 'Typography Scale', icon: <Type className="w-4 h-4" /> },
          { id: 'buttons', label: 'Button System', icon: <Sliders className="w-4 h-4" /> },
          { id: 'inputs', label: 'Form Controls', icon: <Layers className="w-4 h-4" /> },
          { id: 'tables', label: 'Data Tables', icon: <LayoutGrid className="w-4 h-4" /> },
          { id: 'cards', label: 'Card Components', icon: <Maximize2 className="w-4 h-4" /> },
          { id: 'feedback', label: 'Feedback & Toast', icon: <Bell className="w-4 h-4" /> },
          { id: 'wizard', label: 'Form Steppers', icon: <Zap className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#6366F1] text-white shadow-md'
                : 'text-[#888] hover:text-white hover:bg-[#111]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DESIGN TOKENS & COLORS */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          
          {/* Color Palette Grid */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div>
                <h3 className="text-base font-bold text-white">Semantic Color Palette Tokens</h3>
                <p className="text-xs text-[#888]">Click any color card to copy token HEX value to clipboard</p>
              </div>
              {copiedToken && (
                <span className="text-xs text-[#10B981] font-mono font-bold bg-[#10B981]/10 px-3 py-1 rounded-lg border border-[#10B981]/20 animate-in fade-in">
                  Copied {copiedToken}!
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              {[
                { name: 'Primary Indigo', hex: '#6366F1', bg: 'bg-[#6366F1]', text: 'text-white' },
                { name: 'Deep Secondary', hex: '#4F46E5', bg: 'bg-[#4F46E5]', text: 'text-white' },
                { name: 'Success Green', hex: '#10B981', bg: 'bg-[#10B981]', text: 'text-black font-bold' },
                { name: 'Warning Amber', hex: '#F59E0B', bg: 'bg-[#F59E0B]', text: 'text-black font-bold' },
                { name: 'Danger Red', hex: '#EF4444', bg: 'bg-[#EF4444]', text: 'text-white font-bold' },
                { name: 'Sky Info', hex: '#38BDF8', bg: 'bg-[#38BDF8]', text: 'text-black font-bold' },
                { name: 'Canvas Dark', hex: '#080808', bg: 'bg-[#080808] border border-[#222]', text: 'text-white' },
                { name: 'Surface Card', hex: '#0A0A0A', bg: 'bg-[#0A0A0A] border border-[#222]', text: 'text-white' },
                { name: 'Element Fill', hex: '#111111', bg: 'bg-[#111111] border border-[#222]', text: 'text-white' },
                { name: 'Subtle Border', hex: '#1A1A1A', bg: 'bg-[#1A1A1A]', text: 'text-white' },
                { name: 'Muted Text', hex: '#888888', bg: 'bg-[#888888]', text: 'text-black' },
                { name: 'Pure Contrast', hex: '#FFFFFF', bg: 'bg-[#FFFFFF]', text: 'text-black font-bold' }
              ].map((c) => (
                <div
                  key={c.hex}
                  onClick={() => copyToClipboard(c.hex)}
                  className="p-3 rounded-xl bg-[#111] border border-[#222] hover:border-[#444] cursor-pointer transition-all group space-y-2"
                >
                  <div className={`w-full h-12 rounded-lg ${c.bg} flex items-center justify-center text-[10px] ${c.text}`}>
                    {c.hex}
                  </div>
                  <div>
                    <span className="text-white font-bold block">{c.name}</span>
                    <span className="text-[10px] text-[#666] font-mono block group-hover:text-[#6366F1]">
                      Click to copy
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius & Elevation Tokens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Border Radius Standards</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#111] border border-[#222] rounded-[8px] flex justify-between items-center">
                  <span className="text-white font-mono">Small (8px)</span>
                  <span className="text-[#888]">Buttons, Chips, Badges</span>
                </div>
                <div className="p-3 bg-[#111] border border-[#222] rounded-[12px] flex justify-between items-center">
                  <span className="text-white font-mono">Medium (12px)</span>
                  <span className="text-[#888]">Inputs, Tooltips, Dropdowns</span>
                </div>
                <div className="p-3 bg-[#111] border border-[#222] rounded-[16px] flex justify-between items-center">
                  <span className="text-white font-mono">Large (16px)</span>
                  <span className="text-[#888]">Outer Panels, Section Containers</span>
                </div>
                <div className="p-3 bg-[#111] border border-[#222] rounded-[20px] flex justify-between items-center">
                  <span className="text-white font-mono">Cards (20px)</span>
                  <span className="text-[#888]">Primary Content Cards</span>
                </div>
                <div className="p-3 bg-[#111] border border-[#222] rounded-[24px] flex justify-between items-center">
                  <span className="text-white font-mono">Modals (24px)</span>
                  <span className="text-[#888]">Overlay Dialogs & Command Palette</span>
                </div>
              </div>
            </div>

            {/* Spacing Scale Preview */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">System Spacing Scale (Base 4px)</h3>
              <div className="space-y-2 text-xs">
                {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((px) => (
                  <div key={px} className="flex items-center gap-3">
                    <span className="w-12 font-mono text-[#888] text-[11px]">{px}px</span>
                    <div className="bg-[#6366F1] h-3 rounded-full" style={{ width: `${Math.min(px * 3, 280)}px` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TYPOGRAPHY SCALE */}
      {activeTab === 'typography' && (
        <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 space-y-6">
          <div className="pb-3 border-b border-[#1A1A1A]">
            <h3 className="text-base font-bold text-white">Inter / System UI Typography Scale</h3>
            <p className="text-xs text-[#888]">High contrast mathematical scale with explicit optical line heights</p>
          </div>

          <div className="space-y-6 text-white">
            <div className="pb-4 border-b border-[#141414] space-y-1">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase font-bold">H1 Display Heading • 48px / Line Height 1.1</span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">The Modern Enterprise Platform</h1>
            </div>

            <div className="pb-4 border-b border-[#141414] space-y-1">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase font-bold">H2 Section Title • 40px / Line Height 1.2</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Placement & Career Intelligence</h2>
            </div>

            <div className="pb-4 border-b border-[#141414] space-y-1">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase font-bold">H3 Module Title • 32px / Line Height 1.25</span>
              <h3 className="text-2xl font-bold">Department Analytics Dashboard</h3>
            </div>

            <div className="pb-4 border-b border-[#141414] space-y-1">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase font-bold">H4 Card Title • 28px / Line Height 1.3</span>
              <h4 className="text-xl font-bold">Student Progress Matrix</h4>
            </div>

            <div className="pb-4 border-b border-[#141414] space-y-1">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase font-bold">Body Large • 18px / Line Height 1.6</span>
              <p className="text-lg text-[#AAA] leading-relaxed">
                Empower higher education institutions with real-time skill assessment, automated roll call verification, and corporate hiring workflows.
              </p>
            </div>

            <div className="pb-4 border-b border-[#141414] space-y-1">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase font-bold">Body Standard • 16px / Line Height 1.5</span>
              <p className="text-base text-[#888] leading-relaxed">
                All attendance updates and certificate verifications are cryptographically hashed and synced across cloud database shards.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase font-bold">Caption & Footnote • 12px / Monospace</span>
              <p className="text-xs font-mono text-[#666]">
                TIMESTAMP: 2026-08-04 • SYSTEM STATUS: OPERATIONAL • HASH: 0x9f821a4f
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUTTON SYSTEM */}
      {activeTab === 'buttons' && (
        <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 space-y-6">
          <div className="pb-3 border-b border-[#1A1A1A]">
            <h3 className="text-base font-bold text-white">Button Component Variations</h3>
            <p className="text-xs text-[#888]">Micro-interactions, state feedback, and WCAG high-contrast focus targets</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            
            {/* Primary Button */}
            <div className="p-4 bg-[#111] rounded-xl border border-[#222] space-y-3">
              <span className="text-[#888] font-mono text-[10px] font-bold uppercase block">1. PRIMARY ACTION</span>
              <button
                onClick={() => triggerToast('Primary Button Clicked')}
                className="w-full py-2.5 px-4 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                Save Configuration
              </button>
            </div>

            {/* Secondary Button */}
            <div className="p-4 bg-[#111] rounded-xl border border-[#222] space-y-3">
              <span className="text-[#888] font-mono text-[10px] font-bold uppercase block">2. SECONDARY / OUTLINE</span>
              <button
                onClick={() => triggerToast('Secondary Button Clicked')}
                className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#222] text-white border border-[#333] font-bold rounded-xl transition-all"
              >
                Cancel Changes
              </button>
            </div>

            {/* Success Button */}
            <div className="p-4 bg-[#111] rounded-xl border border-[#222] space-y-3">
              <span className="text-[#888] font-mono text-[10px] font-bold uppercase block">3. SUCCESS STATE</span>
              <button
                onClick={() => triggerToast('Success Action Fired')}
                className="w-full py-2.5 px-4 bg-[#10B981] hover:bg-emerald-500 text-black font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Application
              </button>
            </div>

            {/* Danger Button */}
            <div className="p-4 bg-[#111] rounded-xl border border-[#222] space-y-3">
              <span className="text-[#888] font-mono text-[10px] font-bold uppercase block">4. DESTRUCTIVE / DANGER</span>
              <button
                onClick={() => triggerToast('Danger Action Triggered')}
                className="w-full py-2.5 px-4 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Revoke Certificate
              </button>
            </div>

            {/* Loading Spinner State */}
            <div className="p-4 bg-[#111] rounded-xl border border-[#222] space-y-3">
              <span className="text-[#888] font-mono text-[10px] font-bold uppercase block">5. ASYNC LOADING STATE</span>
              <button
                disabled
                className="w-full py-2.5 px-4 bg-[#6366F1]/50 text-white font-bold rounded-xl opacity-80 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin text-white" /> Processing Audit Log...
              </button>
            </div>

            {/* Disabled Button */}
            <div className="p-4 bg-[#111] rounded-xl border border-[#222] space-y-3">
              <span className="text-[#888] font-mono text-[10px] font-bold uppercase block">6. DISABLED STATE</span>
              <button
                disabled
                className="w-full py-2.5 px-4 bg-[#1A1A1A] text-[#555] font-bold rounded-xl border border-[#222] cursor-not-allowed"
              >
                Option Unavailable
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: FORM CONTROLS */}
      {activeTab === 'inputs' && (
        <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 space-y-6 text-xs">
          <div className="pb-3 border-b border-[#1A1A1A]">
            <h3 className="text-base font-bold text-white">Interactive Form Field Components</h3>
            <p className="text-xs text-[#888]">Accessible inputs with focus rings, inline helper text, and tag selector</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Standard Text Field */}
            <div className="space-y-1.5">
              <label className="text-[#888] font-bold block uppercase text-[10px]">Student Full Name</label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2.5 bg-[#111] border border-[#222] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] rounded-xl text-white outline-none transition-all"
              />
              <span className="text-[10px] text-[#666]">Matches official university enrollment record</span>
            </div>

            {/* Select Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[#888] font-bold block uppercase text-[10px]">Account Verification Status</label>
              <select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                className="w-full p-2.5 bg-[#111] border border-[#222] focus:border-[#6366F1] rounded-xl text-white outline-none"
              >
                <option value="active">Active & Verified</option>
                <option value="pending">Pending Document Audit</option>
                <option value="suspended">Suspended Account</option>
              </select>
            </div>

            {/* Tag Selector Component */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[#888] font-bold block uppercase text-[10px]">Skill Competencies (Tag Selector)</label>
              <div className="p-3 bg-[#111] border border-[#222] rounded-xl flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30 rounded-lg font-mono text-xs flex items-center gap-1.5 font-bold">
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                      className="text-[#6366F1] hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Type skill & press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      setTags([...tags, tagInput.trim()]);
                      setTagInput('');
                    }
                  }}
                  className="bg-transparent text-white outline-none text-xs font-mono py-1 flex-1 min-w-[120px]"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: DATA TABLES */}
      {activeTab === 'tables' && (
        <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 space-y-4">
          <div className="pb-3 border-b border-[#1A1A1A]">
            <h3 className="text-base font-bold text-white">Sticky Header Data Table Component</h3>
            <p className="text-xs text-[#888]">Column sorting, status badges, sticky headers, and action rows</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#222]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#111] text-[#888] font-mono text-[10px] uppercase border-b border-[#222]">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Attendance %</th>
                  <th className="p-3">Placement Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414] text-white">
                {[
                  { name: 'Aarav Sharma', dept: 'CSE', att: '96.2%', status: 'Placed (Amazon - 28 LPA)', color: 'text-[#10B981] bg-[#10B981]/10' },
                  { name: 'Priya Verma', dept: 'AI & DS', att: '91.8%', status: 'Interviewing (Microsoft)', color: 'text-[#6366F1] bg-[#6366F1]/10' },
                  { name: 'Rohan Mehta', dept: 'ECE', att: '84.0%', status: 'Eligible for Drive', color: 'text-white bg-[#222]' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#111] transition-colors">
                    <td className="p-3 font-semibold">{row.name}</td>
                    <td className="p-3 text-[#AAA]">{row.dept}</td>
                    <td className="p-3 font-mono font-bold">{row.att}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-[#222] text-[#888] hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CARDS */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* KPI Stat Card */}
          <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#1A1A1A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#888] uppercase font-bold">TOTAL PLACEMENTS</span>
              <span className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center gap-1 font-mono text-[10px] font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
              </span>
            </div>
            <strong className="text-3xl font-extrabold text-white font-mono block">142 Offers</strong>
            <p className="text-[11px] text-[#666]">Average CTC: ₹14.8 LPA across 32 recruiting drives</p>
          </div>

          {/* User Profile Card */}
          <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#1A1A1A] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center font-bold text-white text-sm">
                AS
              </div>
              <div>
                <strong className="text-white block font-bold text-sm">Dr. Aditi Sundaram</strong>
                <span className="text-[11px] text-[#888]">Dean of Academic Affairs</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 rounded-md text-[10px] font-mono font-bold inline-block">
              Super Admin Granted
            </span>
          </div>

          {/* Action Callout Card */}
          <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#1A1A1A] space-y-3 flex flex-col justify-between">
            <div>
              <strong className="text-white font-bold block text-sm">Generate Quarterly Audit Report</strong>
              <p className="text-[11px] text-[#777] mt-1">Export encrypted CSV/PDF statement for NAAC compliance audit.</p>
            </div>
            <button className="w-full py-2 bg-[#6366F1] text-white font-bold rounded-xl text-xs shadow-md">
              Export Audit
            </button>
          </div>

        </div>
      )}

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10B981] text-black font-extrabold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-black" />
          {toastMessage}
        </div>
      )}

    </div>
  );
};
