import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, User, FileText, Settings, 
  HelpCircle, LogOut, Plus, Sun, Plane, MessageSquare, BarChart2,
  ChevronRight, Circle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/EmployeeDashboard.css';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [sessionTime, setSessionTime] = useState('00:34:57');

  useEffect(() => {
    const storedId = localStorage.getItem('employeeId');
    if (storedId) {
      setEmployeeId(storedId);
    } else {
      // default/fallback
      setEmployeeId('EMP-1002');
    }

    // A simple mock timer for effect
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('employeeId');
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
            {employeeId ? employeeId.substring(4, 5) || 'A' : 'A'}
          </div>
          <div className="emp-user-info">
            <div className="name">Alex Rivers</div>
            <div className="role">Senior Architect - {employeeId}</div>
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
            <div className="emp-date">MONDAY, OCT 23</div>
            <h1 className="emp-greeting">Good Morning, Alex.</h1>
            <p className="emp-sub-greeting">You've clocked in <strong>4 hours</strong> today. Your focus session is looking productive.</p>
          </div>
          <div className="emp-weather">
            <Sun className="emp-weather-icon" size={20} fill="#fbbf24" stroke="#fbbf24" />
            72°F Sunny
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
                  Total Hours This Week <Settings size={16} />
                </div>
                <div className="hours-value">32 <span>/ 40</span></div>
                
                <div className="session-info">
                  <div>
                    <div className="session-status">
                      <div className="dot-live"></div> CURRENT SESSION
                    </div>
                    <div className="session-timer">{sessionTime}</div>
                  </div>
                  <div>
                    <span style={{fontSize: '0.9rem', color: 'var(--nexus-text-muted)', display: 'block', marginBottom: '8px'}}>Started at 08:30 AM</span>
                    <button className="end-session-btn">
                      <Circle size={12} fill="var(--nexus-red)"/> End Session
                    </button>
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
                    <div className="activity-icon completed"><ChevronRight size={14}/></div>
                    <div className="activity-details">
                      <h5>Login</h5>
                      <p>08:30 AM</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon current"><Settings size={12}/></div>
                    <div className="activity-details">
                      <h5>Break</h5>
                      <p>12:00 PM</p>
                    </div>
                  </div>
                  <div className="activity-item" style={{opacity: 0.5}}>
                    <div className="activity-icon pending"><Circle size={10} fill="var(--nexus-text-muted)"/></div>
                    <div className="activity-details">
                      <h5>Logout</h5>
                      <p>--:--</p>
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

                <div className="event-item">
                  <div className="event-date-box">
                    <span className="event-month">OCT</span>
                    <span className="event-day">24</span>
                  </div>
                  <div className="event-info">
                    <h5>Project Review</h5>
                    <p>10:30 AM - 11:30 AM</p>
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
