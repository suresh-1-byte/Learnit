import React from 'react';
import { Certificate } from '../../types';
import { mockCertificates, mockStudents } from '../../mockData';
import { Award, QrCode, Download, Printer, CheckCircle2, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CertificateModalProps {
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const cert: Certificate = mockCertificates[0];
  const student = mockStudents[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-gray-100 relative animate-in zoom-in-95">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Award className="w-5 h-5 text-indigo-600" /> Official Verified Certificate
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Certificate
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Printable frame) */}
        <div className="mt-6 p-8 rounded-2xl border-4 border-indigo-900/10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white text-center relative shadow-xl overflow-hidden">
          
          <div className="absolute top-4 left-4 text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
            LearnIT Platform HQ
          </div>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-slate-950 shadow-md">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-serif font-bold tracking-tight text-amber-200 mt-4">
            CERTIFICATE OF EXCELLENCE
          </h1>

          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-sans">
            This is to certify that
          </p>

          <h2 className="text-2xl font-bold text-white mt-2 font-serif tracking-wide">{student.name}</h2>
          
          <p className="text-xs text-slate-300 mt-1 font-mono">{student.rollNumber} • {student.collegeName}</p>

          <p className="text-xs text-slate-300 mt-4 max-w-md mx-auto leading-relaxed">
            has successfully completed the comprehensive training curriculum with distinction grade, demonstrating mastery in microservice architecture, modern web development, and cloud deployments.
          </p>

          <h3 className="text-base font-bold text-indigo-200 mt-3 font-sans">
            {cert.programTitle}
          </h3>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800 text-xs items-center">
            <div className="text-left">
              <span className="block text-[9px] uppercase font-bold text-slate-500">Issued On</span>
              <span className="text-slate-200 font-semibold">{cert.issuedDate}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white p-1 rounded-lg">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
              <span className="text-[9px] text-indigo-300 mt-1 font-mono">LIT-88419-VERIFIED</span>
            </div>

            <div className="text-right">
              <span className="block text-[9px] uppercase font-bold text-slate-500">Grade Score</span>
              <span className="text-emerald-400 font-extrabold">{cert.grade}</span>
            </div>
          </div>

        </div>

        <p className="text-center text-[11px] text-gray-400 mt-4">
          Verified on LearnIT HQ Global Registry. SHA-256 Signature Hash: 0x9a8f2e1b4...
        </p>

      </div>
    </div>
  );
};
