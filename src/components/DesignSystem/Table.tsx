import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  isLoading?: boolean;
  stickyHeader?: boolean;
  pageSize?: number;
}

export function Table<T>({ data, columns, onRowClick, emptyMessage = 'No data available', className = '', isLoading = false, stickyHeader = true, pageSize = 10 }: TableProps<T>) {
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  if (isLoading) {
    return (
      <div className={`rounded-2xl overflow-hidden transition-all duration-250 shadow-lg ${className} ${
        theme === 'dark' 
          ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
          : 'bg-white border-[rgba(0,0,0,0.06)]'
      }`}>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-16 rounded-lg animate-pulse ${
              theme === 'dark' ? 'bg-[#141414]' : 'bg-gray-100'
            }`} />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`rounded-2xl overflow-hidden transition-all duration-250 shadow-lg ${className} ${
        theme === 'dark' 
          ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
          : 'bg-white border-[rgba(0,0,0,0.06)]'
      }`}>
        <div className="p-12 text-center">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
          }`}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-250 shadow-lg ${className} ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className={stickyHeader ? 'sticky top-0 z-10 transition-colors duration-250' : ''}>
            <tr className={`border-b transition-colors duration-250 ${
              theme === 'dark' 
                ? 'bg-[#080808] border-[rgba(255,255,255,0.08)]' 
                : 'bg-gray-50 border-[rgba(0,0,0,0.06)]'
            }`}>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#555]' : 'text-[#64748B]'
                  } ${column.sortable ? 'cursor-pointer hover:text-[#6366F1] transition-colors duration-250' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <span className={`text-[10px] transition-colors duration-250 ${
                        theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                      }`}>
                        {sortConfig?.key === column.key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors duration-250 ${
            theme === 'dark' ? 'divide-[rgba(255,255,255,0.08)]' : 'divide-[rgba(0,0,0,0.06)]'
          }`}>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? `cursor-pointer transition-all duration-250 hover:bg-[rgba(99,102,241,0.05)] ${
                  theme === 'dark' ? 'hover:bg-[rgba(99,102,241,0.05)]' : 'hover:bg-[rgba(99,102,241,0.03)]'
                }` : ''}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className={`px-6 py-4 text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  } ${column.className || ''}`}>
                    {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {paginatedData.map((row, index) => (
          <div
            key={index}
            onClick={() => onRowClick?.(row)}
            className={`rounded-xl p-4 transition-all duration-250 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
              theme === 'dark' 
                ? 'bg-[#111] border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.2)]' 
                : 'bg-gray-50 border-[rgba(0,0,0,0.06)] hover:border-[rgba(99,102,241,0.2)]'
            } ${onRowClick ? 'cursor-pointer' : ''}`}
          >
            {columns.map((column) => (
              <div key={String(column.key)} className="mb-3 last:mb-0">
                <p className={`text-[10px] font-bold uppercase mb-1 ${
                  theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
                }`}>{column.label}</p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                } ${column.className || ''}`}>
                  {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-between px-6 py-4 border-t transition-colors duration-250 ${
          theme === 'dark' ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.06)]'
        }`}>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
          }`}>
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-250 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white hover:bg-[#1A1A1A] hover:border-[rgba(99,102,241,0.2)]' 
                  : 'bg-gray-50 border-[rgba(0,0,0,0.06)] text-gray-900 hover:bg-gray-100 hover:border-[rgba(99,102,241,0.2)]'
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 text-xs font-medium rounded-lg transition-all duration-250 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                  currentPage === i + 1
                    ? 'bg-[#6366F1] text-white shadow-lg'
                    : theme === 'dark' 
                      ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white hover:bg-[#1A1A1A] hover:border-[rgba(99,102,241,0.2)]'
                      : 'bg-gray-50 border-[rgba(0,0,0,0.06)] text-gray-900 hover:bg-gray-100 hover:border-[rgba(99,102,241,0.2)]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-250 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark' 
                  ? 'bg-[#111] border-[rgba(255,255,255,0.08)] text-white hover:bg-[#1A1A1A] hover:border-[rgba(99,102,241,0.2)]' 
                  : 'bg-gray-50 border-[rgba(0,0,0,0.06)] text-gray-900 hover:bg-gray-100 hover:border-[rgba(99,102,241,0.2)]'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
