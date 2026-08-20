import React, { useState, useEffect } from 'react';
import {
  Search,
  Command,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Award,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Settings,
  Sparkles,
  ArrowRight,
  X,
  Sliders,
  CheckCircle2,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { UserRole } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  currentRole: UserRole | null;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  currentRole
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allActions = [
    { id: 'dashboard', label: 'Go to Executive Dashboard', category: 'Navigation', icon: <Sparkles className="w-4 h-4 text-[#6366F1]" /> },
    { id: 'analytics', label: 'View Business Intelligence Analytics', category: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-[#10B981]" /> },
    { id: 'colleges', label: 'Manage Partner Colleges & Institutes', category: 'Institutions', icon: <Building2 className="w-4 h-4 text-purple-400" /> },
    { id: 'students', label: 'Search Student Directory & Batches', category: 'Students', icon: <Users className="w-4 h-4 text-cyan-400" /> },
    { id: 'drives', label: 'Manage Campus Placement Drives', category: 'Placements', icon: <Briefcase className="w-4 h-4 text-amber-400" /> },
    { id: 'certificates', label: 'Generate & Verify Certificates', category: 'Engine', icon: <Award className="w-4 h-4 text-indigo-400" /> },
    { id: 'settings', label: 'Enterprise Platform Settings (Part 15)', category: 'System', icon: <Settings className="w-4 h-4 text-[#888]" /> },
    { id: 'design_system', label: 'Enterprise Design System Showcase (Part 16)', category: 'Design System', icon: <Sliders className="w-4 h-4 text-[#6366F1]" /> },
    { id: 'payments', label: 'View Fee Collection & Invoices', category: 'Finance', icon: <CreditCard className="w-4 h-4 text-emerald-400" /> },
    { id: 'audit_logs', label: 'Review Security Audit Logs', category: 'Security', icon: <ShieldCheck className="w-4 h-4 text-[#EF4444]" /> }
  ];

  const filteredActions = allActions.filter((act) =>
    act.label.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase())
  );

  // Enhanced search with keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState(0);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query, filteredActions.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter' && filteredActions.length > 0) {
      e.preventDefault();
      const selectedAction = filteredActions[selectedIndex];
      onSelectTab(selectedAction.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0A0A0A] border border-[#222] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1A1A1A] gap-3">
          <Search className="w-5 h-5 text-[#6366F1]" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search platform modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white placeholder-[#555] text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#1A1A1A] text-[#888] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#141414]">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-[#666] text-xs">
              No matching commands found for "{query}".
            </div>
          ) : (
            filteredActions.map((action, index) => (
              <button
                key={action.id}
                onClick={() => {
                  onSelectTab(action.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors group ${
                  index === selectedIndex
                    ? 'bg-[#1A1A1A] border border-[#6366F1]'
                    : 'hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#111] border border-[#222] group-hover:border-[#333]">
                    {action.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block group-hover:text-[#6366F1] transition-colors">
                      {action.label}
                    </span>
                    <span className="text-[10px] text-[#666] uppercase font-mono font-bold">
                      {action.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#555] font-mono group-hover:text-white">Jump to</span>
                  <div className="w-6 h-6 bg-white rounded-full overflow-hidden flex items-center justify-center">
                    <img src={`/logo.png?v=${Date.now()}`} alt="LearnIT" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 bg-[#080808] border-t border-[#1A1A1A] flex items-center justify-between text-[11px] text-[#666]">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-[#141414] border border-[#222] rounded text-[10px]">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-[#141414] border border-[#222] rounded text-[10px]">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 bg-[#141414] border border-[#222] rounded text-[10px]">ESC</kbd> Close</span>
          </div>
          <span className="text-[#6366F1] font-mono font-bold">LEARNIT ERP v2.4</span>
        </div>
      </div>
    </div>
  );
};
