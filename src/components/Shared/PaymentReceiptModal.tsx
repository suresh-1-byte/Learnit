import React from 'react';
import { PaymentTransaction } from '../../types';
import { mockPaymentTransactions, mockStudents } from '../../mockData';
import { CreditCard, CheckCircle2, Download, Printer, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PaymentReceiptModalProps {
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const txn: PaymentTransaction = mockPaymentTransactions[2];
  const student = mockStudents[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Official Payment Receipt
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-gray-200 text-xs space-y-3">
          <div className="flex justify-between items-start pb-3 border-b border-gray-200">
            <div>
              <p className="font-bold text-gray-900 text-sm">LearnIT HQ Billing</p>
              <p className="text-[11px] text-gray-500">Ref: {txn.transactionRef}</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
              {txn.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-gray-600">
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400">Student Name</span>
              <strong className="text-gray-900">{student.name}</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400">Roll Number</span>
              <strong className="text-gray-900 font-mono">{student.rollNumber}</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400">Payment Date</span>
              <span>{txn.date}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400">Payment Method</span>
              <span>{txn.paymentMethod}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
            <span>Total Amount Paid</span>
            <span className="text-emerald-700 text-base">₹{txn.amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
