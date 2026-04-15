import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Download, Filter,
  ChevronLeft, ChevronRight, AlertTriangle, Loader,
  LayoutDashboard, Users, Calendar, BarChart2, Settings, HelpCircle, LogOut, Plus
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import '../css/Attendance.css';

export default function Attendance() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    onTimeRate: 0,
    lateCount: 0,
    totalCount: 0
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const adminName = localStorage.getItem('adminName') || 'Director';
  const employeeId = localStorage.getItem('employeeId') || '';

  useEffect(() => {
    fetchAttendance();
  }, []);

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

  return (
    <div className="attendance-layout">
      {/* Top Header */}
      <header className="top-nav">
        <div className="nav-left">
          <h2 className="brand-logo-top">StudioCore</h2>
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/employees">Employees</Link>
            <Link to="/attendance" className="active">Attendance</Link>
            <Link to="/reports">Reports</Link>
          </div>
        </div>
        <div className="nav-right">
          <div className="search-bar-top">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search data..." />
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

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="brand-logo">StudioCore</h2>
          </div>
          
          <div className="sidebar-workspace">
             <div className="workspace-icon">A</div>
             <div className="workspace-text">
               <div className="workspace-title">Architectural</div>
               <div className="workspace-subtitle">Workspace</div>
               <div className="workspace-subsubtitle">MANAGEMENT PORTAL</div>
             </div>
          </div>

          <nav className="sidebar-nav">
            <Link to="/dashboard" className="nav-item">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/employees" className="nav-item">
              <Users size={20} />
              <span>Employees</span>
            </Link>
            <Link to="/attendance" className="nav-item active">
              <Calendar size={20} />
              <span>Attendance</span>
            </Link>
            <Link to="/reports" className="nav-item">
              <BarChart2 size={20} />
              <span>Reports</span>
            </Link>
            <a href="#" className="nav-item">
              <Settings size={20} />
              <span>Settings</span>
            </a>
          </nav>

          <div className="sidebar-footer">
            <button className="new-entry-btn" onClick={() => navigate('/employees')}>
              <Plus size={16} /> New Entry
            </button>
            <a href="#" className="footer-link">
              <HelpCircle size={18} /> Help Center
            </a>
            <a href="#" className="footer-link logout" onClick={(e) => {
              e.preventDefault();
              localStorage.clear();
              navigate('/login');
            }}>
              <LogOut size={18} /> Logout
            </a>
          </div>
        </aside>

        {/* Content */}
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1 className="page-title">Attendance Log</h1>
              <p className="page-subtitle">Monitor employee daily active hours and punctuality across departments.</p>
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
                <input type="text" placeholder="Search by name or ID..." />
              </div>
            </div>
            <div className="filter-group">
              <label>SELECT DATE</label>
              <div className="input-with-icon">
                 <input type="date" />
              </div>
            </div>
            <div className="filter-group">
              <label>STATUS FILTER</label>
              <div className="select-wrapper">
                <select>
                  <option>All Statuses</option>
                  <option>Present</option>
                  <option>Late</option>
                  <option>Absent</option>
                </select>
              </div>
            </div>
            <button className="apply-filters-btn">
              <Filter size={16} /> Apply Filters
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
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length > 0 ? (
                    attendance.map((log) => (
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
                        <td className="text-muted">{formatTime(log.logoutTime)}</td>
                        <td>
                          <span className={`badge badge-${log.status.toLowerCase()}`}>
                            {log.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">No attendance records found for today.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            
            <div className="pagination">
              <span className="page-info">Showing {attendance.length} entries</span>
              <div className="page-controls">
                <button className="page-btn"><ChevronLeft size={16} /></button>
                <button className="page-btn active">1</button>
                <button className="page-btn"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
