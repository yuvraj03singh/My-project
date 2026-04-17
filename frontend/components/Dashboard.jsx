import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Search, Bell, ChevronDown, 
  MoreHorizontal, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Dashboard.css';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [adminName, setAdminName] = useState('Director');
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, onLeave: 0 });
  const [todayActivity, setTodayActivity] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Auth guard — redirect if not admin
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'admin') {
      navigate('/login');
      return;
    }

    const storedId = localStorage.getItem('employeeId');
    const storedName = localStorage.getItem('adminName');
    if (storedId) setEmployeeId(storedId);
    if (storedName) setAdminName(storedName);

    // Fetch real stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch employees
        axios.get(`${API_URL}/employees`, headers)
          .then(res => {
            if (res.data.success) {
              setTotalEmployees(res.data.total || 0);
              setRecentEmployees(res.data.data || []);
            }
          })
          .catch(err => console.error('Employees fetch error:', err));

        // Fetch dashboard stats
        axios.get(`${API_URL}/attendance/stats`, headers)
          .then(res => {
            if (res.data.success) {
              setStats(res.data.data);
              if (res.data.data.total !== undefined) {
                setTotalEmployees(res.data.data.total);
              }
            }
          })
          .catch(err => console.error('Stats fetch error:', err));

        // Fetch attendance logs for activity
        axios.get(`${API_URL}/attendance`, headers)
          .then(res => {
            if (res.data.success) {
              const todayStr = new Date().toDateString();
              const todaysLogs = res.data.data.filter(log => {
                if (!log.date) return false;
                // Using toDateString() for reliable local date comparison
                return new Date(log.date).toDateString() === todayStr;
              });
              setTodayActivity(todaysLogs);
            }
          })
          .catch(err => console.error('Attendance fetch error:', err));

      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      }
    };
    fetchStats();
  }, []);

  const filteredEmployees = recentEmployees.filter(emp => 
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="welcome-section">
             <div className="welcome-text">
                <h1>Workspace Overview</h1>
                <p>Welcome back, <span className="highlight">{adminName}</span> ({employeeId}). Your dashboard is currently monitoring <span className="highlight">{totalEmployees} active entries</span>.</p>
             </div>
             <div className="welcome-actions">
               <button className="filter-btn">
                 Filters <ChevronDown size={14} />
               </button>
             </div>
          </div>

          <div className="stats-grid">
             <div className="stat-card">
                <div className="stat-header">
                   <div className="stat-icon-wrap users-icon"><Users size={20} /></div>
                </div>
                <div className="stat-title">Total Employees</div>
                <div className="stat-value">{totalEmployees}</div>
             </div>
             <div className="stat-card">
                <div className="stat-header">
                   <div className="stat-icon-wrap present-icon"><Users size={20} /></div>
                </div>
                <div className="stat-title">Present Today</div>
                <div className="stat-value">{stats.present}</div>
             </div>
             <div className="stat-card">
                <div className="stat-header">
                   <div className="stat-icon-wrap absent-icon"><Users size={20} /></div>
                </div>
                <div className="stat-title">Absent</div>
                <div className="stat-value">{stats.absent}</div>
             </div>
             <div className="stat-card">
                <div className="stat-header">
                   <div className="stat-icon-wrap leave-icon"><Calendar size={20} /></div>
                </div>
                <div className="stat-title">On Leave</div>
                <div className="stat-value">{stats.onLeave}</div>
             </div>
          </div>

          <div className="main-grid">
             <div className="grid-left">
                {/* Today's Activity */}
                <div className="activity-card">
                   <div className="card-header">
                     <h3>Today's Activity</h3>
                     <a href="#" className="view-all">View All Logs</a>
                   </div>
                   <div className="activity-list">
                       {todayActivity.length > 0 ? (
                         todayActivity.slice(0, 5).map(log => (
                           <div className="activity-item" key={log._id}>
                              <div className="activity-avatar" style={{
                                 width: '40px', height: '40px', borderRadius: '50%',
                                 background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                                 color: '#fff', fontWeight: 'bold', flexShrink: 0, fontSize: '1.2rem'
                              }}>
                                {log.employee?.fullName?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <div className="activity-details">
                                 <h4>{log.employee?.fullName || 'Unknown'}</h4>
                                 <p>{log.status} &bull; {log.employee?.department || 'General'}</p>
                              </div>
                              <div className="activity-time">
                                 <span style={{fontSize: '0.75rem', color: '#9ca3af', marginRight: '6px'}}>
                                   {new Date(log.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </span>
                                 <div className={`status-dot ${log.status === 'Present' ? 'green' : 'orange'}`}></div>
                              </div>
                           </div>
                         ))
                       ) : (
                         <p style={{padding: '1rem', color: '#6b7280', fontSize: '0.9rem'}}>No login activity for today.</p>
                       )}
                    </div>

                   {filteredEmployees.length > 5 ? (
                     <button className="more-activities-btn" onClick={() => navigate('/employees')}>
                        <MoreHorizontal size={16} />
                        <span>{filteredEmployees.length - 5} more entries</span>
                     </button>
                   ) : (
                     <button className="more-activities-btn" onClick={() => navigate('/employees')} style={{visibility: filteredEmployees.length > 0 ? 'visible' : 'hidden'}}>
                        <span>View all employees</span>
                     </button>
                   )}
                </div>

                {/* Design Dept Peak */}
                <div className="peak-card">
                   <div className="peak-content">
                      <h3>Design Dept. Peak</h3>
                      <p>Attendance reached 98% this morning.<br/>The highest in the current quarter.</p>
                   </div>
                   <div className="peak-score">
                      <h2>98%</h2>
                      <span>PERFORMANCE SCORE</span>
                   </div>
                </div>
             </div>

             <div className="grid-right">
                {/* Cards removed as requested to show only existing data */}
                <div className="health-card">
                   <h3>SYSTEM INSIGHT</h3>
                   <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                     No additional alerts or health reports at this time.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </>
    );
  }
