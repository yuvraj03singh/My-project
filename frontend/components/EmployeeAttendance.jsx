import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/EmployeeAttendance.css';

export default function EmployeeAttendance() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalWorkingDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateCount: 0,
    attendancePercentage: 0,
    month: '',
    attendanceMap: {},
    attendanceRecords: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);
  const today = new Date();

  useEffect(() => {
    fetchAttendanceStats();
  }, [currentDate]);

  const fetchAttendanceStats = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 1-indexed
      
      const res = await api.get(`/attendance/stats/month/${year}/${month}`);
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch attendance stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDateStatus = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return stats.attendanceMap[dateKey];
  };

  const getStatusClass = (date) => {
    const status = getDateStatus(date);
    
    // Check if today
    if (date.toDateString() === today.toDateString()) return 'today';
    
    if (!status) {
      // Check if it's a weekend
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend';
      return 'no-data';
    }
    switch (status.status) {
      case 'Present':
        return 'present';
      case 'Late':
        return 'late';
      case 'Absent':
        return 'absent';
      default:
        return 'no-data';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return '#10b981';
      case 'Late':
        return '#f59e0b';
      case 'Absent':
        return '#ef4444';
      default:
        return '#d1d5db';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Present':
        return '✓';
      case 'Late':
        return '⏰';
      case 'Absent':
        return '✕';
      default:
        return '';
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const details = getDateStatus(date);
    setSelectedDayDetails(details);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAttendanceLevel = (percentage) => {
    if (percentage >= 95) return { text: 'Excellent', color: '#059669' };
    if (percentage >= 85) return { text: 'Good', color: '#2563eb' };
    if (percentage >= 75) return { text: 'Satisfactory', color: '#f59e0b' };
    return { text: 'Needs Improvement', color: '#ef4444' };
  };

  const attendanceLevel = getAttendanceLevel(stats.attendancePercentage);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const lastDateOfMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of month
    for (let date = 1; date <= lastDateOfMonth; date++) {
      days.push(new Date(year, month, date));
    }
    
    return days;
  };

  const getDayName = (date) => {
    if (!date) return '';
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return dayNames[date.getDay()];
  };

  return (
    <div className="employee-attendance-container">
      {/* Header */}
      <div className="attendance-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/employee-dashboard')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1>My Attendance</h1>
          <p>Track your attendance and see detailed statistics</p>
        </div>
        <button className="export-btn">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader className="spinning" size={40} />
          <p>Loading attendance data...</p>
        </div>
      ) : (
        <div className="attendance-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card attendance-card">
              <div className="stat-icon percentage-icon">📊</div>
              <div className="stat-details">
                <p className="stat-label">Attendance</p>
                <p className="stat-value">{stats.attendancePercentage}%</p>
                <p className="stat-subtitle" style={{ color: attendanceLevel.color }}>
                  {attendanceLevel.text}
                </p>
              </div>
            </div>

            <div className="stat-card working-days-card">
              <div className="stat-icon working-icon">📅</div>
              <div className="stat-details">
                <p className="stat-label">Working Days</p>
                <p className="stat-value">{stats.totalWorkingDays}</p>
                <p className="stat-subtitle">This month</p>
              </div>
            </div>

            <div className="stat-card present-card">
              <div className="stat-icon present-icon">✓</div>
              <div className="stat-details">
                <p className="stat-label">Present</p>
                <p className="stat-value">{stats.presentDays}</p>
                <p className="stat-subtitle">Days present</p>
              </div>
            </div>

            <div className="stat-card absent-card">
              <div className="stat-icon absent-icon">✕</div>
              <div className="stat-details">
                <p className="stat-label">Absent</p>
                <p className="stat-value">{stats.absentDays}</p>
                <p className="stat-subtitle">Days absent</p>
              </div>
            </div>

            <div className="stat-card late-card">
              <div className="stat-icon late-icon">🕐</div>
              <div className="stat-details">
                <p className="stat-label">Late Arrivals</p>
                <p className="stat-value">{stats.lateCount}</p>
                <p className="stat-subtitle">Times late</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="attendance-main">
            {/* Calendar Section */}
            <div className="calendar-section">
              <div className="calendar-header">
                <button className="nav-btn" onClick={handlePrevMonth}>
                  <ChevronLeft size={20} />
                </button>
                <h2 className="calendar-title">{stats.month}</h2>
                <button className="nav-btn" onClick={handleNextMonth}>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Custom Calendar Grid */}
              <div className="custom-calendar">
                {/* Day Headers */}
                <div className="calendar-weekdays">
                  <div className="weekday-header">SUN</div>
                  <div className="weekday-header">MON</div>
                  <div className="weekday-header">TUE</div>
                  <div className="weekday-header">WED</div>
                  <div className="weekday-header">THU</div>
                  <div className="weekday-header">FRI</div>
                  <div className="weekday-header">SAT</div>
                </div>

                {/* Calendar Days Grid */}
                <div className="calendar-days">
                  {generateCalendarDays().map((date, index) => (
                    <div
                      key={index}
                      className={`calendar-tile ${date ? getStatusClass(date) : 'empty'}`}
                      onClick={() => date && handleDateClick(date)}
                    >
                      {date ? (
                        <div className="tile-content">
                          <div className="tile-day-name">{getDayName(date)}</div>
                          <div className="tile-date">{date.getDate()}</div>
                          {getDateStatus(date) && (
                            <div 
                              className="tile-status" 
                              style={{ backgroundColor: getStatusColor(getDateStatus(date).status) }}
                            >
                              {getStatusText(getDateStatus(date).status)}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                  <span>Present</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span>Late</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                  <span>Absent</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#e5e7eb' }}></div>
                  <span>No Data</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#f3f4f6' }}></div>
                  <span>Weekend</span>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="details-section">
              {selectedDate && selectedDayDetails ? (
                <div className="day-details">
                  <h3 className="details-title">Day Details</h3>
                  <div className="details-date">{formatDate(selectedDate)}</div>
                  
                  <div className="details-info">
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`detail-value status-badge status-${selectedDayDetails.status.toLowerCase()}`}>
                        {selectedDayDetails.status === 'Present' && '✓ Present'}
                        {selectedDayDetails.status === 'Late' && '⏰ Late'}
                        {selectedDayDetails.status === 'Absent' && '✕ Absent'}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Clock In:</span>
                      <span className="detail-value">
                        {formatTime(selectedDayDetails.loginTime)}
                      </span>
                    </div>

                    {selectedDayDetails.logoutTime ? (
                      <>
                        <div className="detail-row">
                          <span className="detail-label">Clock Out:</span>
                          <span className="detail-value">
                            {formatTime(selectedDayDetails.logoutTime)}
                          </span>
                        </div>
                        
                        {selectedDayDetails.overtimeHours > 0 && (
                          <div className="detail-row">
                            <span className="detail-label">Overtime:</span>
                            <span className="detail-value overtime">
                              +{selectedDayDetails.overtimeHours}h
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value">Not clocked out</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-selection">
                  <div className="empty-icon">📋</div>
                  <p>Select a date from the calendar to view details</p>
                </div>
              )}

              {/* Summary Stats */}
              <div className="summary-stats">
                <h3 className="summary-title">Summary</h3>
                
                <div className="summary-item">
                  <div className="summary-label">Working Days</div>
                  <div className="summary-value">{stats.totalWorkingDays}</div>
                </div>

                <div className="summary-item">
                  <div className="summary-label">Present Days</div>
                  <div className="summary-value present">{stats.presentDays}</div>
                </div>

                <div className="summary-item">
                  <div className="summary-label">Absent Days</div>
                  <div className="summary-value absent">{stats.absentDays}</div>
                </div>

                <div className="summary-item">
                  <div className="summary-label">Late Arrivals</div>
                  <div className="summary-value late">{stats.lateCount}</div>
                </div>

                <div className="progress-container">
                  <div className="progress-label">Attendance Progress</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${stats.attendancePercentage}%`,
                        backgroundColor: attendanceLevel.color
                      }}
                    />
                  </div>
                  <div className="progress-text">{stats.attendancePercentage}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Records */}
          {stats.attendanceRecords.length > 0 && (
            <div className="recent-records">
              <h3 className="records-title">Recent Records</h3>
              <div className="records-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Clock In</th>
                      <th>Clock Out</th>
                      <th>Overtime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.attendanceRecords.slice(0, 10).map((record, idx) => (
                      <tr key={idx}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge status-${record.status.toLowerCase()}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>{formatTime(record.loginTime)}</td>
                        <td>{record.logoutTime ? formatTime(record.logoutTime) : '-'}</td>
                        <td>{record.overtimeHours > 0 ? `+${record.overtimeHours}h` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
