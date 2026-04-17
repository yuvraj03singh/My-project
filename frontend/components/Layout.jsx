import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Calendar, BarChart2, Settings, 
  HelpCircle, LogOut, Search, Bell, Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const adminName = localStorage.getItem('adminName') || 'Director';
  const employeeId = localStorage.getItem('employeeId') || '';

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Persistent Sidebar */}
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
          <button className="new-entry-btn" onClick={() => navigate('/employees')}>
            <Plus size={16} /> New Entry
          </button>
          <a href="#" className="footer-link">
            <HelpCircle size={18} /> Help Center
          </a>
          <a href="#" className="footer-link logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
