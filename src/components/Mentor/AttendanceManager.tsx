import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, QrCode } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAttendance } from '../../hooks/useAttendance';

interface AttendanceManagerProps {
  selectedClass: any;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({ selectedClass }) => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const { attendanceRecords, loading, markAttendance, fetchAttendanceByClass } = useAttendance();

  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [studentAttendanceList, setStudentAttendanceList] = useState<any[]>([]);

  // Generate QR Code for attendance
  const generateQRCode = () => {
    const sessionId = `${selectedClass?.id}_${Date.now()}`;
    const qrData = JSON.stringify({
      sessionId,
      classId: selectedClass?.id,
      date: new Date().toISOString(),
      mentorId: userProfile?.id
    });
    setQRCodeData(qrData);
    setShowQRCode(true);
  };

  // Initialize student list for manual marking
  const initializeManualMarking = () => {
    // Mock student list - in real app, fetch from class
    const mockStudents = [
      { id: 'st1', name: 'Student 1', rollNumber: 'CS001' },
      { id: 'st2', name: 'Student 2', rollNumber: 'CS002' },
      { id: 'st3', name: 'Student 3', rollNumber: 'CS003' },
    ];
    
    setStudentAttendanceList(mockStudents.map(student => ({
      ...student,
      status: 'Present' as 'Present' | 'Absent' | 'Late'
    })));
    setShowMarkModal(true);
  };

  const handleMarkAttendance = async () => {
    if (!userProfile || !selectedClass) return;

    try {
      // Mark attendance for each student
      for (const student of studentAttendanceList) {
        await markAttendance({
          classId: selectedClass.id,
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          date: selectedDate,
          status: student.status,
          markedBy: userProfile.id,
          markedByName: userProfile.displayName || userProfile.name
        });
      }

      setShowMarkModal(false);
      setStudentAttendanceList([]);
      alert('Attendance marked successfully!');
      
      // Refresh attendance records
      if (selectedClass?.id) {
        fetchAttendanceByClass(selectedClass.id, selectedDate);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    }
  };

  const updateStudentStatus = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setStudentAttendanceList(prev =>
      prev.map(s => s.id === studentId ? { ...s, status } : s)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';
      case 'Absent': return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
      case 'Late': return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20';
      default: return 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20';
    }
  };

  const calculateStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'Present').length;
    const absent = attendanceRecords.filter(r => r.status === 'Absent').length;
    const late = attendanceRecords.filter(r => r.status === 'Late').length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : '0';
    
    return { total, present, absent, late, percentage };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className={`rounded-2xl border p-6 ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Attendance Management</h2>
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>
              {selectedClass ? `Class: ${selectedClass.name}` : 'Select a class to manage attendance'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateQRCode}
              disabled={!selectedClass}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#6366F1] hover:bg-[#5558E3] text-white disabled:bg-[#333] disabled:text-[#666]'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-300 disabled:text-gray-500'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Generate QR
            </button>

            <button
              onClick={initializeManualMarking}
              disabled={!selectedClass}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#10B981] hover:bg-[#059669] text-white disabled:bg-[#333] disabled:text-[#666]'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-300 disabled:text-gray-500'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Mark Manually
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl border p-5 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                Total Records
              </p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                Present
              </p>
              <p className={`text-xl font-bold text-[#10B981]`}>
                {stats.present}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                Absent
              </p>
              <p className={`text-xl font-bold text-[#EF4444]`}>
                {stats.absent}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                Attendance %
              </p>
              <p className={`text-xl font-bold text-[#10B981]`}>
                {stats.percentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className={`rounded-2xl border p-6 ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-base font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Recent Attendance Records</h3>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
          </div>
        )}

        {!loading && attendanceRecords.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
          }`}>
            <Calendar className={`w-12 h-12 mx-auto mb-3 ${
              theme === 'dark' ? 'text-[#333]' : 'text-gray-400'
            }`} />
            <p className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
            }`}>No attendance records yet</p>
          </div>
        )}

        {!loading && attendanceRecords.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={`border-b text-xs font-bold uppercase ${
                  theme === 'dark' 
                    ? 'border-[#1A1A1A] text-[#555] bg-[#080808]' 
                    : 'border-gray-200 text-[#64748B] bg-gray-50'
                }`}>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Marked By</th>
                </tr>
              </thead>
              <tbody className={theme === 'dark' ? 'divide-y divide-[#141414]' : 'divide-y divide-gray-200'}>
                {attendanceRecords.slice(0, 10).map((record) => (
                  <tr key={record.id} className={theme === 'dark' ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}>
                    <td className={`py-3 px-4 font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{record.studentName}</td>
                    <td className={`py-3 px-4 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                    }`}>{record.rollNumber}</td>
                    <td className={`py-3 px-4 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
                    }`}>{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-xs ${
                      theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                    }`}>{record.markedByName || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Marking Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-[#0A0A0A] border border-[#1A1A1A]' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Mark Attendance</h3>

            <div className="mb-4">
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-700'
              }`}>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-[#111] border-[#222] text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div className="space-y-3 mb-6">
              {studentAttendanceList.map((student) => (
                <div key={student.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {student.name}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                        {student.rollNumber}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStudentStatus(student.id, 'Present')}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          student.status === 'Present'
                            ? 'bg-[#10B981] text-white'
                            : theme === 'dark'
                            ? 'bg-[#222] text-[#AAA] hover:bg-[#333]'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => updateStudentStatus(student.id, 'Late')}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          student.status === 'Late'
                            ? 'bg-[#F59E0B] text-white'
                            : theme === 'dark'
                            ? 'bg-[#222] text-[#AAA] hover:bg-[#333]'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => updateStudentStatus(student.id, 'Absent')}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          student.status === 'Absent'
                            ? 'bg-[#EF4444] text-white'
                            : theme === 'dark'
                            ? 'bg-[#222] text-[#AAA] hover:bg-[#333]'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleMarkAttendance}
                className="flex-1 px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-semibold transition-all"
              >
                Save Attendance
              </button>
              <button
                onClick={() => {
                  setShowMarkModal(false);
                  setStudentAttendanceList([]);
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-[#222] hover:bg-[#333] text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 w-full max-w-md ${
            theme === 'dark' ? 'bg-[#0A0A0A] border border-[#1A1A1A]' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Scan QR Code for Attendance</h3>

            <div className={`p-8 rounded-lg mb-4 ${
              theme === 'dark' ? 'bg-white' : 'bg-gray-100'
            }`}>
              <div className="text-center text-6xl">📱</div>
              <p className="text-center text-sm mt-2 text-gray-600">
                QR Code Generation
              </p>
              <p className="text-center text-xs mt-1 text-gray-500">
                Session: {qrCodeData ? JSON.parse(qrCodeData).sessionId.substring(0, 10) + '...' : ''}
              </p>
            </div>

            <button
              onClick={() => setShowQRCode(false)}
              className="w-full px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5558E3] text-white font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
