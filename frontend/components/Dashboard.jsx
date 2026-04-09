import React from 'react';
import { 
  LayoutDashboard, Users, Calendar, BarChart2, Settings, 
  HelpCircle, LogOut, Search, Bell, Plus, ChevronDown, 
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
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
          <Link to="/dashboard" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/employees" className="nav-item">
            <Users size={20} />
            <span>Employees</span>
          </Link>
          <Link to="/attendance" className="nav-item">
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
          <button className="new-entry-btn">
            <Plus size={16} /> New Entry
          </button>
          <a href="#" className="footer-link">
            <HelpCircle size={18} /> Help Center
          </a>
          <a href="/" className="footer-link logout">
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
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
              <input type="text" placeholder="Search members..." />
            </div>
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-profile">
               <img src="https://i.pravatar.cc/150?img=47" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="welcome-section">
             <div className="welcome-text">
                <h1>Workspace Overview</h1>
                <p>Welcome back, Director. You have <span className="highlight">4 new leave requests</span> and 2 missing logs from yesterday.</p>
             </div>
             <div className="welcome-actions">
               <div className="avatar-group">
                 <img src="https://i.pravatar.cc/150?img=11" alt="avatar" />
                 <img src="https://i.pravatar.cc/150?img=12" alt="avatar" />
                 <img src="https://i.pravatar.cc/150?img=13" alt="avatar" />
                 <span className="more-avatars">+12</span>
               </div>
               <button className="filter-btn">
                 Filters <ChevronDown size={14} />
               </button>
             </div>
          </div>

          <div className="stats-grid">
             <div className="stat-card">
                <div className="stat-header">
                   <div className="stat-icon-wrap users-icon"><Users size={20} /></div>
                   <span className="stat-badge positive">+2.5%</span>
                </div>
                <div className="stat-title">Total Employees</div>
                <div className="stat-value">1,248</div>
             </div>
             <div className="stat-card">
                <div className="stat-header">
                   <div className="stat-icon-wrap present-icon"><Users size={20} /></div>
                   <span className="stat-badge neutral">92% rate</span>
                </div>
                <div className="stat-title">Present Today</div>
                <div className="stat-value">1,152</div>
             </div>
             <div className="stat-card">
                <div className="stat-header">
                   <div className="stat-icon-wrap absent-icon"><Users size={20} /></div>
                   <span className="stat-badge warning">Unexcused</span>
                </div>
                <div className="stat-title">Absent</div>
                <div className="stat-value">32</div>
             </div>
             <div className="stat-card">
                <div className="stat-header">
                   <div className="stat-icon-wrap leave-icon"><Calendar size={20} /></div>
                   <span className="stat-badge pending align-right">4 Pending</span>
                </div>
                <div className="stat-title">On Leave</div>
                <div className="stat-value">64</div>
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
                      <div className="activity-item">
                         <img src="https://i.pravatar.cc/150?img=5" alt="Sarah" />
                         <div className="activity-details">
                            <h4>Sarah Jenkins</h4>
                            <p>Logged In &bull; Remote</p>
                         </div>
                         <div className="activity-time">
                            <span>09:42 AM</span>
                            <div className="status-dot green"></div>
                         </div>
                      </div>
                      <div className="activity-item">
                         <img src="https://i.pravatar.cc/150?img=8" alt="Michael" />
                         <div className="activity-details">
                            <h4>Michael Chen</h4>
                            <p>Logged In &bull; Studio A</p>
                         </div>
                         <div className="activity-time">
                            <span>09:15 AM</span>
                            <div className="status-dot green"></div>
                         </div>
                      </div>
                      <div className="activity-item">
                         <img src="https://i.pravatar.cc/150?img=9" alt="Elena" />
                         <div className="activity-details">
                            <h4>Elena Rodriguez</h4>
                            <p>Logged Out &bull; Lunch Break</p>
                         </div>
                         <div className="activity-time">
                            <span>12:30 PM</span>
                            <div className="status-dot gray"></div>
                         </div>
                      </div>
                   </div>
                   <button className="more-activities-btn">
                      <MoreHorizontal size={16} />
                      <span>42 more activities today</span>
                   </button>
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
                {/* Department Health */}
                <div className="health-card">
                   <h3>DEPARTMENT HEALTH</h3>
                   <div className="health-item">
                      <div className="health-labels">
                         <span>Architectural</span>
                         <span>12/12</span>
                      </div>
                      <div className="progress-bar"><div className="fill" style={{width: '100%'}}></div></div>
                   </div>
                   <div className="health-item">
                      <div className="health-labels">
                         <span>Engineering</span>
                         <span>48/52</span>
                      </div>
                      <div className="progress-bar"><div className="fill" style={{width: '92%'}}></div></div>
                   </div>
                   <div className="health-item">
                      <div className="health-labels">
                         <span>Interior Design</span>
                         <span>22/30</span>
                      </div>
                      <div className="progress-bar"><div className="fill" style={{width: '73%'}}></div></div>
                   </div>
                </div>

                {/* Upcoming Office Events */}
                <div className="events-card">
                   <h3>UPCOMING OFFICE EVENTS</h3>
                   <div className="event-item">
                      <div className="event-date">
                         <span className="day">24</span>
                         <span className="month">SEP</span>
                      </div>
                      <div className="event-details">
                         <h4>Studio Townhall</h4>
                         <p>10:00 AM &bull; Main Atrium</p>
                      </div>
                   </div>
                   <div className="event-item">
                      <div className="event-date">
                         <span className="day">28</span>
                         <span className="month">SEP</span>
                      </div>
                      <div className="event-details">
                         <h4>Monthly Review</h4>
                         <p>02:00 PM &bull; Zoom</p>
                      </div>
                   </div>
                </div>

                {/* Workspace View */}
                <div className="workspace-view-card">
                   <div className="video-overlay">
                      <span>WORKSPACE VIEW</span>
                      <h4>Studio 4-B Security Feed</h4>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
