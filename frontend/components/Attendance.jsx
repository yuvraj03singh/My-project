import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Download, Filter,
  ChevronLeft, ChevronRight, AlertTriangle, Loader, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Attendance.css';

export default function Attendance() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    onTimeRate: 0,
    lateCount: 0,
    totalCount: 0
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const adminName = localStorage.getItem('adminName') || 'Director';
  const employeeId = localStorage.getItem('employeeId') || '';

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [attendance, searchTerm, selectedDate, selectedStatus]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/attendance');
      if (res.data.success) {
        setAttendance(res.data.data);
        calculateStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    if (total === 0) return;
    const late = data.filter(a => a.status === 'Late').length;
    const onTime = total - late;
    setStats({
      onTimeRate: ((onTime / total) * 100).toFixed(1),
      lateCount: late,
      totalCount: total
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-- : --';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
  };

  const applyFilters = () => {
    let filtered = [...attendance];

    // Filter by search term (name or employee ID)
    if (searchTerm.trim()) {
      filtered = filtered.filter(log => {
        const fullName = log.employee?.fullName || '';
        const empId = log.employee?.employeeId || '';
        const searchLower = searchTerm.toLowerCase();
        return fullName.toLowerCase().includes(searchLower) || 
               empId.toLowerCase().includes(searchLower);
      });
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.date).toISOString().split('T')[0];
        return logDate === selectedDate;
      });
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(log => log.status === selectedStatus);
    }

    setFilteredAttendance(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDate('');
    setSelectedStatus('');
    setFilteredAttendance(attendance);
  };

  return (
    <>
      {/* Header */}
      <header className="top-header">
        <div className="header-tabs">
          <a href="#" className="tab active">Overview</a>
          <a href="#" className="tab">Directory</a>
          <a href="#" className="tab">Payroll</a>
        </div>
        
        <div className="header-actions">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search new entries..." 
            />
          </div>
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          <div className="user-profile-container">
            <div className="user-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <img src="https://i.pravatar.cc/150?img=47" alt="Profile" />
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-info">
                  <p className="user-name">{adminName}</p>
                  <p className="user-id">{employeeId}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-btn" onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Attendance Log</h1>
            <p className="page-subtitle">Monitor employee daily active hours and punctuality across departments.</p>
            {(searchTerm || selectedDate || selectedStatus) && (
              <p style={{fontSize: '12px', color: '#ef4444', marginTop: '8px'}}>
                ⚠️ Filters applied ({(searchTerm ? 1 : 0) + (selectedDate ? 1 : 0) + (selectedStatus ? 1 : 0)} active)
              </p>
            )}
          </div>
          <button className="export-btn">
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-box">
            <div className="stat-label">On-Time Presence</div>
            <div className="stat-value text-blue">{stats.onTimeRate}%</div>
          </div>
          <div className="stat-box border-red">
            <div className="stat-label">Late Arrivals</div>
            <div className="stat-value text-red">{stats.lateCount}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Total Logs</div>
            <div className="stat-value text-blue">{stats.totalCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="filter-group flex-2">
            <label>EMPLOYEE SEARCH</label>
            <div className="input-with-icon">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>SELECT DATE</label>
            <div className="input-with-icon">
              <input 
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>STATUS FILTER</label>
            <div className="select-wrapper">
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>
          <button className="apply-filters-btn" onClick={handleClearFilters}>
            <Filter size={16} /> Clear Filters
          </button>
        </div>

        {/* Table */}
        <div className="table-card">
          {loading ? (
            <div className="loading-state">
              <Loader className="spinning" />
              <p>Loading attendance records...</p>
            </div>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>EMPLOYEE NAME</th>
                  <th>ID</th>
                  <th>LOGIN TIME</th>
                  <th>LOGOUT TIME</th>
                  <th>PRESENCE</th>
                  <th>LOGOUT STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((log) => (
                    <tr key={log._id}>
                      <td>
                        <div className="employee-info">
                          <div className="avatar initials bg-blue-light">
                            {getInitials(log.employee?.fullName)}
                          </div>
                          <div>
                            <div className="emp-name">{log.employee?.fullName || 'Unknown'}</div>
                            <div className="emp-role">{log.employee?.role || 'Associate'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="emp-id">{log.employee?.employeeId || 'N/A'}</td>
                      <td>
                        <div className={log.status === 'Late' ? 'highlight-danger' : ''}>
                          {log.status === 'Late' && <AlertTriangle size={14} style={{ marginRight: '4px' }} />}
                          {formatTime(log.loginTime)}
                        </div>
                      </td>
                      <td className="text-muted">{formatTime(log.logoutTime) || '—'}</td>
                      <td>
                        <span className={`badge badge-${log.status.toLowerCase()}`}>
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {log.logoutStatus === 'early' && (
                          <span className="badge badge-early" title="Logged out before 5 PM">
                            ⏪ Early Logout
                          </span>
                        )}
                        {log.logoutStatus === 'overtime' && (
                          <span className="badge badge-overtime" title={`Overtime: ${log.overtimeHours}h`}>
                            ⏱️ Overtime +{log.overtimeHours?.toFixed(1)}h
                          </span>
                        )}
                        {log.logoutStatus === 'ontime' && (
                          <span className="badge badge-ontime">
                            ✓ On Time
                          </span>
                        )}
                        {!log.logoutStatus && (
                          <span className="badge badge-pending" style={{background: '#f3f4f6', color: '#6b7280'}}>
                            Still Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      {attendance.length === 0 ? 'No attendance records found.' : 'No records match your filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          
          <div className="pagination">
            <span className="page-info">Showing {filteredAttendance.length} of {attendance.length} entries</span>
            <div className="page-controls">
              <button className="page-btn"><ChevronLeft size={16} /></button>
              <button className="page-btn active">1</button>
              <button className="page-btn"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
