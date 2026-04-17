import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, User, FileText, Settings, 
  HelpCircle, LogOut, Plus, Sun, Plane, MessageSquare, BarChart2,
  ChevronRight, Circle, Clock, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/EmployeeDashboard.css';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [logoutStatus, setLogoutStatus] = useState(null); // 'early' or 'overtime'
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem('employeeId');
    const storedName = localStorage.getItem('employeeName') || localStorage.getItem('name');
    
    if (storedId) setEmployeeId(storedId);
    if (storedName) setEmployeeName(storedName);

    checkAttendanceStatus();
  }, []);

  // Session timer - only runs when clocked in
  useEffect(() => {
    if (!isClockedIn) return;

    const interval = setInterval(() => {
      setSessionTime(prev => {
        let [hrs, mins, secs] = prev.split(':').map(Number);
        secs++;
        if (secs === 60) { secs = 0; mins++; }
        if (mins === 60) { mins = 0; hrs++; }
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const checkAttendanceStatus = async () => {
    try {
      const res = await api.get('/attendance/me');
      if (res.data.success && res.data.data.length > 0) {
        const today = new Date().toDateString();
        const todayRecord = res.data.data.find(record => new Date(record.date).toDateString() === today);
        
        if (todayRecord) {
          setClockInTime(new Date(todayRecord.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          
          // Check if already clocked out
          if (todayRecord.logoutTime) {
            setIsClockedIn(false);
            setSessionTime('00:00:00');
            setClockOutTime(new Date(todayRecord.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            
            // Set logout status
            if (todayRecord.logoutStatus) {
              setLogoutStatus(todayRecord.logoutStatus);
            }
            if (todayRecord.overtimeHours) {
              setOvertimeHours(todayRecord.overtimeHours);
            }
          } else {
            // Still clocked in - calculate session time
            setIsClockedIn(true);
            const login = new Date(todayRecord.loginTime);
            const diff = Math.floor((new Date() - login) / 1000);
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;
            setSessionTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
          }
        } else {
          // No record for today - user hasn't clocked in
          setIsClockedIn(false);
          setSessionTime('00:00:00');
          setClockInTime(null);
          setClockOutTime(null);
          setLogoutStatus(null);
        }
      }
    } catch (err) {
      console.error('Error checking attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      const res = await api.post('/attendance/clock-in');
      if (res.data.success) {
        setIsClockedIn(true);
        setSessionTime('00:00:00'); // Start with fresh timer
        setClockInTime(new Date(res.data.data.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setClockOutTime(null); // Reset logout time
        setLogoutStatus(null); // Reset logout status
        alert('Clocked in successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    try {
      const res = await api.post('/attendance/clock-out');
      if (res.data.success) {
        setIsClockedIn(false);
        setSessionTime('00:00:00'); // Reset timer when clocking out
        const logoutTime = new Date(res.data.data.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setClockOutTime(logoutTime);
        
        // Determine if early logout or overtime
        const logoutHour = new Date(res.data.data.logoutTime).getHours();
        if (logoutHour < 17) {
          setLogoutStatus('early');
        } else {
          const overtime = logoutHour - 17;
          setOvertimeHours(overtime);
          setLogoutStatus('overtime');
        }
        
        alert(`Clocked out successfully! Status: ${res.data.data.logoutStatus}`);
        
        // Refresh attendance data
        setTimeout(() => checkAttendanceStatus(), 500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clock out');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="emp-dashboard-wrapper">
      <div className="emp-dashboard-container">
        {/* Sidebar */}
        <aside className="emp-sidebar">
          <div className="emp-brand">
            <div className="emp-top-nav-links">
              <a href="#">Nexus Workspace</a>
              <a href="#">Directory</a>
              <a href="#">Resources</a>
            </div>
          </div>

          <div className="emp-user-card">
            <div className="emp-avatar">
              {(employeeName || 'E').charAt(0).toUpperCase()}
            </div>
            <div className="emp-user-info">
              <div className="name">{employeeName || 'Employee'}</div>
              <div className="role">Employee - {employeeId}</div>
            </div>
          </div>

          <nav className="emp-nav-menu">
            <a href="#" className="emp-nav-item active">
              <LayoutDashboard size={18} />
              My Dashboard
            </a>
            <a href="#" className="emp-nav-item">
              <Calendar size={18} />
              My Attendance
            </a>
            <a href="#" className="emp-nav-item">
              <User size={18} />
              My Profile
            </a>
            <a href="#" className="emp-nav-item">
              <FileText size={18} />
              Paystubs
            </a>

            <div className="emp-menu-divider"></div>
          </nav>

          <button className="emp-btn-primary">
            <Plus size={18} /> New Request
          </button>

          <div className="emp-nav-footer">
            <a href="#" className="emp-nav-item">
              <HelpCircle size={18} />
              Support
            </a>
            <a href="#" className="emp-nav-item emp-logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <LogOut size={18} />
              Log Out
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="emp-main">
          <header className="emp-header">
            <div>
              <div className="emp-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}</div>
              <h1 className="emp-greeting">Good Morning, {employeeName ? employeeName.split(' ')[0] : 'there'}.</h1>
              <p className="emp-sub-greeting">
                {isClockedIn 
                  ? `You clocked in at ${clockInTime}. Have a productive day!` 
                  : "You haven't clocked in yet today. Ready to start?"}
              </p>
            </div>
            <div className="emp-weather">
              {isClockedIn ? (
                <div className="clocked-in-badge">
                  <CheckCircle size={16} /> CLOCKED IN
                </div>
              ) : (
                <button className="clock-in-btn-header" onClick={handleClockIn}>
                   <Clock size={18} /> CLOCK IN NOW
                </button>
              )}
            </div>
          </header>

          <div className="emp-content">
            <div className="emp-grid">
              
              <div className="emp-grid-main">
                {/* Attendance Rate */}
                <div className="emp-card attendance-card">
                  <div className="card-title">
                    Attendance Rate <BarChart2 size={16} />
                  </div>
                  <div className="attendance-value">96%</div>
                  <div className="attendance-month">MONTH TO DATE</div>
                </div>

                {/* Total Hours */}
                <div className="emp-card hours-card">
                  <div className="card-title">
                    Session Status <Settings size={16} />
                  </div>
                  <div className="hours-value">{isClockedIn ? 'Active' : 'Offline'}</div>
                  
                  <div className="session-info">
                    <div>
                      <div className="session-status">
                        <div className={isClockedIn ? "dot-live" : "dot-offline"}></div> {isClockedIn ? "CURRENT SESSION" : "PAUSED"}
                      </div>
                      <div className="session-timer">{sessionTime}</div>
                    </div>
                    <div>
                      <span style={{fontSize: '0.9rem', color: 'var(--nexus-text-muted)', display: 'block', marginBottom: '8px'}}>
                        {isClockedIn ? `Started at ${clockInTime}` : 'Not started'}
                      </span>
                      {!isClockedIn ? (
                         <button className="start-session-btn" onClick={handleClockIn}>
                            <Clock size={16} /> Start Session
                         </button>
                      ) : (
                        <button className="end-session-btn" onClick={handleClockOut}>
                          <Circle size={12} fill="var(--nexus-red)"/> End Session
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remaining Leave */}
                <div className="emp-card small-stat-card">
                  <div className="small-stat-icon icon-orange">
                    <Plane size={24} />
                  </div>
                  <div className="small-stat-info">
                    <div className="label">Remaining Leave</div>
                    <div className="val">5 Days</div>
                  </div>
                </div>

                {/* Next Review */}
                <div className="emp-card small-stat-card">
                  <div className="small-stat-icon icon-purple">
                    <MessageSquare size={24} />
                  </div>
                  <div className="small-stat-info">
                    <div className="label">Next Review</div>
                    <div className="val">Dec 15</div>
                  </div>
                </div>

                {/* Punctuality Metric */}
                <div className="emp-card punctuality-card">
                  <div className="card-title">
                    Punctuality Metric 
                    <span style={{fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px'}}><div className="dot-live" style={{background: 'var(--nexus-secondary)'}}></div> Consistency</span>
                  </div>
                  <div className="chart-container">
                    {[40, 50, 45, 60, 30, 80, 50, 48, 55, 60].map((h, i) => (
                      <div key={i} className={`chart-bar ${i === 5 ? 'active' : ''}`} style={{height: `${h}%`}}></div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    <span>10 DAYS AGO</span>
                    <span>TODAY</span>
                  </div>
                </div>
              </div>

              <div className="emp-grid-sidebar">
                {/* Activity Log */}
                <div className="emp-card">
                  <div className="card-title">Activity Log</div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className={`activity-icon ${isClockedIn ? 'completed' : ''}`}><ChevronRight size={14}/></div>
                      <div className="activity-details">
                        <h5>Login/Clock In</h5>
                        <p>{isClockedIn ? clockInTime : '--:--'}</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className={`activity-icon ${clockOutTime ? 'completed' : 'pending'}`}><LogOut size={12}/></div>
                      <div className="activity-details">
                        <h5>Logout/Clock Out</h5>
                        <p>{clockOutTime || '--:--'}</p>
                        {logoutStatus && <p style={{fontSize: '0.8rem', color: logoutStatus === 'early' ? 'var(--nexus-red)' : 'var(--nexus-green)', marginTop: '4px', fontWeight: '600'}}>
                          {logoutStatus === 'early' ? '⏪ Early Logout' : `⏱️ Overtime: ${overtimeHours}h`}
                        </p>}
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon current"><Settings size={12}/></div>
                      <div className="activity-details">
                        <h5>Status</h5>
                        <p>{isClockedIn ? 'Active' : 'Offline'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming */}
                <div className="emp-card">
                  <div className="card-title" style={{marginBottom: '20px'}}>
                    Upcoming <a href="#" style={{fontSize: '0.9rem', color: 'var(--nexus-secondary)', textDecoration: 'none'}}>VIEW CALENDAR</a>
                  </div>
                  
                  <div className="event-item">
                    <div className="event-date-box">
                      <span className="event-month">OCT</span>
                      <span className="event-day">23</span>
                    </div>
                    <div className="event-info">
                      <h5>Design Sync</h5>
                      <p>02:00 PM - 03:00 PM</p>
                    </div>
                    <ChevronRight size={16} color="var(--nexus-text-muted)" style={{marginLeft: 'auto'}}/>
                  </div>
                </div>

                {/* Workspace Insight */}
                <div className="insight-card">
                  <span className="insight-tag">WORKSPACE INSIGHT</span>
                  <h3>Design Studio v2</h3>
                  <p>The new architectural templates are now available in your shared directory.</p>
                  <a href="#">Read Documentation</a>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
