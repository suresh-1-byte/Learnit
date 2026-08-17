import React, { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Upload, FileSpreadsheet, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { Student } from '../../services/firebase/students.service';

interface CSVRow {
  name: string;
  email: string;
  rollNumber: string;
  phone: string;
  departmentName: string;
  batchName: string;
  programTitle: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface UploadResults {
  successful: number;
  failed: number;
  errors: Array<{ index: number; reason: string }>;
}

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (students: Array<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<UploadResults>;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<UploadResults | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setSelectedFile(file);
    setUploadResults(null);
    setValidationErrors([]);

    // Parse CSV
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
        validateData(results.data);
      },
      error: (error) => {
        alert('Error parsing CSV: ' + error.message);
      }
    });
  };

  const validateData = (data: CSVRow[]) => {
    const errors: ValidationError[] = [];
    const rollNumbers = new Set<string>();

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because CSV has header and arrays are 0-indexed

      if (!row.name?.trim()) {
        errors.push({ row: rowNum, field: 'name', message: 'Name is required' });
      }

      if (!row.email?.trim()) {
        errors.push({ row: rowNum, field: 'email', message: 'Email is required' });
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(row.email)) {
        errors.push({ row: rowNum, field: 'email', message: 'Invalid email format' });
      }

      if (!row.rollNumber?.trim()) {
        errors.push({ row: rowNum, field: 'rollNumber', message: 'Roll number is required' });
      } else if (rollNumbers.has(row.rollNumber)) {
        errors.push({ row: rowNum, field: 'rollNumber', message: 'Duplicate roll number in file' });
      } else {
        rollNumbers.add(row.rollNumber);
      }

      if (!row.departmentName?.trim()) {
        errors.push({ row: rowNum, field: 'departmentName', message: 'Department is required' });
      }

      if (!row.batchName?.trim()) {
        errors.push({ row: rowNum, field: 'batchName', message: 'Batch is required' });
      }

      if (!row.programTitle?.trim()) {
        errors.push({ row: rowNum, field: 'programTitle', message: 'Program is required' });
      }
    });

    setValidationErrors(errors);
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const studentsToUpload = parsedData
        .filter((_, index) => {
          // Filter out rows with validation errors
          const rowNum = index + 2;
          return !validationErrors.some(e => e.row === rowNum);
        })
        .map(row => ({
          name: row.name.trim(),
          email: row.email.trim(),
          rollNumber: row.rollNumber.trim(),
          phone: row.phone?.trim() || '',
          departmentName: row.departmentName.trim(),
          batchName: row.batchName.trim(),
          programTitle: row.programTitle.trim(),
          classIds: []
        }));

      // Simulate progress (since Firebase doesn't provide progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const results = await onUpload(studentsToUpload);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResults(results);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/student-upload-template.csv';
    link.download = 'student-upload-template.csv';
    link.click();
  };

  const downloadErrorReport = () => {
    if (!uploadResults || uploadResults.errors.length === 0) return;

    const errorRows = uploadResults.errors.map(err => ({
      row: err.index + 2,
      reason: err.reason
    }));

    const csv = Papa.unparse(errorRows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'upload-errors.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setSelectedFile(null);
    setParsedData([]);
    setValidationErrors([]);
    setUploadResults(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const validRows = parsedData.length - validationErrors.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${
          theme === 'dark'
            ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]'
            : 'bg-white border-[rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          theme === 'dark'
            ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]'
            : 'bg-white border-[rgba(0,0,0,0.06)]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#6366F1]/10">
              <Upload className="w-5 h-5 text-[#6366F1]" />
            </div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Bulk Upload Students
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            className={`p-2 rounded-xl transition-all hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'hover:bg-[#111] text-[#888] hover:text-white'
                : 'hover:bg-gray-100 text-[#64748B] hover:text-gray-900'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Template Download */}
          <div className={`p-4 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#6366F1]/5 border-[#6366F1]/20'
              : 'bg-[#6366F1]/5 border-[#6366F1]/20'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  CSV Template
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  Download the template to see the required format and column headers
                </p>
              </div>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all hover:-translate-y-0.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          {!uploadResults && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-[#6366F1] bg-[#6366F1]/5'
                  : theme === 'dark'
                  ? 'border-[rgba(255,255,255,0.08)] hover:border-[#6366F1]/50'
                  : 'border-[rgba(0,0,0,0.06)] hover:border-[#6366F1]/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              <FileSpreadsheet className={`w-16 h-16 mx-auto mb-4 ${
                dragActive ? 'text-[#6366F1]' : theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
              }`} />

              {selectedFile ? (
                <>
                  <p className={`text-sm font-semibold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedFile.name}
                  </p>
                  <p className={`text-xs mb-4 ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>
                    {parsedData.length} rows found
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`text-sm font-semibold text-[#6366F1] hover:underline`}
                  >
                    Choose a different file
                  </button>
                </>
              ) : (
                <>
                  <p className={`text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Drag and drop your CSV file here
                  </p>
                  <p className={`text-xs mb-4 ${
                    theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>
                    or click the button below to browse
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    Choose File
                  </button>
                </>
              )}
            </div>
          )}

          {/* Validation Results */}
          {parsedData.length > 0 && !uploadResults && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-[#10B981]/5 border-[#10B981]/20'
                    : 'bg-[#10B981]/5 border-[#10B981]/20'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs font-semibold text-[#10B981]">Valid Rows</span>
                  </div>
                  <p className="text-2xl font-black text-[#10B981]">{validRows}</p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  validationErrors.length > 0
                    ? theme === 'dark'
                      ? 'bg-[#EF4444]/5 border-[#EF4444]/20'
                      : 'bg-[#EF4444]/5 border-[#EF4444]/20'
                    : theme === 'dark'
                    ? 'bg-[#888]/5 border-[#888]/20'
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className={`w-4 h-4 ${
                      validationErrors.length > 0 ? 'text-[#EF4444]' : theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                    }`} />
                    <span className={`text-xs font-semibold ${
                      validationErrors.length > 0 ? 'text-[#EF4444]' : theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                    }`}>
                      Invalid Rows
                    </span>
                  </div>
                  <p className={`text-2xl font-black ${
                    validationErrors.length > 0 ? 'text-[#EF4444]' : theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>
                    {validationErrors.length}
                  </p>
                </div>
              </div>

              {/* Errors List */}
              {validationErrors.length > 0 && (
                <div className={`p-4 rounded-xl border max-h-64 overflow-y-auto ${
                  theme === 'dark'
                    ? 'bg-[#EF4444]/5 border-[#EF4444]/20'
                    : 'bg-[#EF4444]/5 border-[#EF4444]/20'
                }`}>
                  <p className="text-sm font-semibold text-[#EF4444] mb-3">
                    Validation Errors ({validationErrors.length})
                  </p>
                  <div className="space-y-2">
                    {validationErrors.slice(0, 10).map((error, index) => (
                      <div
                        key={index}
                        className="text-xs text-[#EF4444] flex items-start gap-2"
                      >
                        <span className="font-mono font-semibold shrink-0">Row {error.row}:</span>
                        <span>{error.field} - {error.message}</span>
                      </div>
                    ))}
                    {validationErrors.length > 10 && (
                      <p className="text-xs text-[#EF4444] font-semibold">
                        ... and {validationErrors.length - 10} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-[#6366F1]/5 border-[#6366F1]/20'
                  : 'bg-[#6366F1]/5 border-[#6366F1]/20'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-5 h-5 text-[#6366F1] animate-spin" />
                  <span className="text-sm font-semibold text-[#6366F1]">
                    Uploading students...
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-[#111]' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-full bg-[#6366F1] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className={`text-xs mt-2 text-center ${
                  theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                }`}>
                  {uploadProgress}% complete
                </p>
              </div>
            </div>
          )}

          {/* Upload Results */}
          {uploadResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-[#10B981]/5 border-[#10B981]/20'
                    : 'bg-[#10B981]/5 border-[#10B981]/20'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs font-semibold text-[#10B981]">Successful</span>
                  </div>
                  <p className="text-2xl font-black text-[#10B981]">{uploadResults.successful}</p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  uploadResults.failed > 0
                    ? theme === 'dark'
                      ? 'bg-[#EF4444]/5 border-[#EF4444]/20'
                      : 'bg-[#EF4444]/5 border-[#EF4444]/20'
                    : theme === 'dark'
                    ? 'bg-[#888]/5 border-[#888]/20'
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className={`w-4 h-4 ${
                      uploadResults.failed > 0 ? 'text-[#EF4444]' : theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                    }`} />
                    <span className={`text-xs font-semibold ${
                      uploadResults.failed > 0 ? 'text-[#EF4444]' : theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                    }`}>
                      Failed
                    </span>
                  </div>
                  <p className={`text-2xl font-black ${
                    uploadResults.failed > 0 ? 'text-[#EF4444]' : theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
                  }`}>
                    {uploadResults.failed}
                  </p>
                </div>
              </div>

              {uploadResults.errors.length > 0 && (
                <button
                  onClick={downloadErrorReport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EF4444] hover:bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  Download Error Report
                </button>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          theme === 'dark'
            ? 'border-[rgba(255,255,255,0.08)]'
            : 'border-[rgba(0,0,0,0.06)]'
        }`}>
          <button
            onClick={handleClose}
            disabled={uploading}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-[#111] text-white hover:bg-[#181818]'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploadResults ? 'Close' : 'Cancel'}
          </button>
          {!uploadResults && parsedData.length > 0 && validRows > 0 && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {validRows} Students
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
