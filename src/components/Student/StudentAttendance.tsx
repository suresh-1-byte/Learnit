import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAttendance } from '../../hooks/useAttendance';

export const StudentAttendance: React.FC = () => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const { attendanceRecords, loading, fetchAttendanceByStudent, calculateAttendancePercentage } = useAttendance();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    if (userProfile?.id) {
      fetchAttendanceByStudent(userProfile.id);
      loadAttendancePercentage();
    }
  }, [userProfile?.id]);

  const loadAttendancePercentage = async () => {
    if (userProfile?.id) {
      const percentage = await calculateAttendancePercentage(userProfile.id);
      setAttendancePercentage(percentage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';
      case 'Absent': return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
      case 'Late': return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20';
      default: return 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle className="w-4 h-4" />;
      case 'Absent': return <XCircle className="w-4 h-4" />;
      case 'Late': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const calculateStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'Present').length;
    const late = attendanceRecords.filter(r => r.status === 'Late').length;
    const absent = attendanceRecords.filter(r => r.status === 'Absent').length;
    
    return { total, present, late, absent };
  };

  const stats = calculateStats();

  const getAttendanceStatus = () => {
    if (attendancePercentage >= 90) return { text: 'Excellent', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' };
    if (attendancePercentage >= 75) return { text: 'Good', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' };
    if (attendancePercentage >= 60) return { text: 'Average', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' };
    return { text: 'Below Required', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' };
  };

  const status = getAttendanceStatus();

  // Filter records by selected month/year
  const filteredRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl border p-6 ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>My Attendance</h2>
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
            }`}>Track your attendance and maintain consistency</p>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === 'dark'
                  ? 'bg-[#111] border-[#222] text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === 'dark'
                  ? 'bg-[#111] border-[#222] text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Percentage Card */}
      <div className={`rounded-2xl border p-6 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 border-[#6366F1]/20' 
          : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
      }`}>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-8 border-[#6366F1]/20 flex items-center justify-center">
              <div className="text-center">
                <p className={`text-3xl font-bold ${status.color}`}>
                  {attendancePercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-[#6366F1] font-semibold mt-1">Attendance</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`w-5 h-5 ${status.color}`} />
              <span className={`text-sm font-bold ${status.color}`}>{status.text}</span>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Overall Attendance Status</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
            }`}>
              {attendancePercentage >= 90 
                ? 'Great job! You meet the placement eligibility criteria.'
                : attendancePercentage >= 75
                ? 'Good attendance. Keep it up to meet 90% requirement.'
                : 'Warning: Attendance below 90% may affect placement eligibility.'}
            </p>

            {attendancePercentage < 90 && (
              <div className={`mt-3 p-3 rounded-lg border ${
                theme === 'dark' ? 'bg-[#F59E0B]/10 border-[#F59E0B]/20' : 'bg-amber-50 border-amber-200'
              }`}>
                <p className="text-xs font-semibold text-[#F59E0B] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {(90 - attendancePercentage).toFixed(1)}% more needed for 90% requirement
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#888]' : 'text-gray-600'}`}>
                Late
              </p>
              <p className={`text-xl font-bold text-[#F59E0B]`}>
                {stats.late}
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
      </div>

      {/* Attendance Records */}
      <div className={`rounded-2xl border p-6 ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A] border-[#1A1A1A]' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-base font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Attendance History</h3>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
          </div>
        )}

        {!loading && filteredRecords.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'
          }`}>
            <Calendar className={`w-12 h-12 mx-auto mb-3 ${
              theme === 'dark' ? 'text-[#333]' : 'text-gray-400'
            }`} />
            <p className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-[#64748B]'
            }`}>No attendance records for selected period</p>
          </div>
        )}

        {!loading && filteredRecords.length > 0 && (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className={`p-4 rounded-lg border transition-all ${
                  theme === 'dark'
                    ? 'bg-[#111] border-[#222] hover:border-[#333]'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      record.status === 'Present' ? 'bg-[#10B981]/10' :
                      record.status === 'Late' ? 'bg-[#F59E0B]/10' :
                      'bg-[#EF4444]/10'
                    }`}>
                      {getStatusIcon(record.status)}
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                      {record.remarks && (
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-[#888]' : 'text-gray-600'
                        }`}>{record.remarks}</p>
                      )}
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
