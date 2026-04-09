import React from 'react';
import { 
  LayoutDashboard, Users, Calendar, BarChart2, Settings, 
  HelpCircle, LogOut, Search, Bell, Download, Filter,
  ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../css/Attendance.css';

export default function Attendance() {
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
          <div className="user-profile">
            <img src="https://i.pravatar.cc/150?img=47" alt="Profile" />
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-workspace">
             <div className="workspace-text">
               <div className="workspace-title">Architectural</div>
               <div className="workspace-subtitle">Workspace</div>
               <div className="workspace-subsubtitle">Management Portal</div>
             </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section">
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
            </div>
          </nav>

          <div className="sidebar-footer">
            <button className="new-entry-btn">
              New Entry
            </button>
            <a href="#" className="footer-link">
              <HelpCircle size={18} /> Help Center
            </a>
            <Link to="/" className="footer-link logout">
              <LogOut size={18} /> Logout
            </Link>
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
              <div className="stat-value text-blue">94.2%</div>
            </div>
            <div className="stat-box border-red">
              <div className="stat-label">Late Arrivals</div>
              <div className="stat-value text-red">12</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Total Active Hours</div>
              <div className="stat-value text-blue">1,240</div>
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
                 <input type="date" defaultValue="2023-10-24" />
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
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>EMPLOYEE NAME</th>
                  <th>ID</th>
                  <th>LOGIN TIME</th>
                  <th>LOGOUT TIME</th>
                  <th>TOTAL HOURS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="employee-info">
                      <div className="avatar initials bg-blue-light">JD</div>
                      <div>
                        <div className="emp-name">Julianne Devis</div>
                        <div className="emp-role">Lead Architect</div>
                      </div>
                    </div>
                  </td>
                  <td className="emp-id">#SC-2041</td>
                  <td>08:52 AM</td>
                  <td>05:30 PM</td>
                  <td>8h 38m</td>
                  <td><span className="badge badge-present">PRESENT</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="employee-info">
                      <div className="avatar initials bg-gray-light">MW</div>
                      <div>
                        <div className="emp-name">Marcus Wright</div>
                        <div className="emp-role">Senior Developer</div>
                      </div>
                    </div>
                  </td>
                  <td className="emp-id">#SC-1988</td>
                  <td>
                    <div className="highlight-danger">
                      <AlertTriangle size={14} /> 09:45 AM
                    </div>
                  </td>
                  <td>06:15 PM</td>
                  <td>8h 30m</td>
                  <td><span className="badge badge-late">LATE</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="employee-info">
                      <div className="avatar initials bg-muted-light">SL</div>
                      <div>
                        <div className="emp-name">Sarah Linn</div>
                        <div className="emp-role">Project Manager</div>
                      </div>
                    </div>
                  </td>
                  <td className="emp-id">#SC-2112</td>
                  <td className="text-muted">-- : --</td>
                  <td className="text-muted">-- : --</td>
                  <td>0h 0m</td>
                  <td><span className="badge badge-absent">ABSENT</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="employee-info">
                      <div className="avatar initials bg-orange-light">AB</div>
                      <div>
                        <div className="emp-name">Alex Bennett</div>
                        <div className="emp-role">Interior Designer</div>
                      </div>
                    </div>
                  </td>
                  <td className="emp-id">#SC-2205</td>
                  <td>08:58 AM</td>
                  <td>
                    <div className="highlight-warning">
                      03:30 PM
                    </div>
                  </td>
                  <td>6h 32m</td>
                  <td><span className="badge badge-present">PRESENT</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="employee-info">
                      <div className="avatar initials bg-blue-light">TO</div>
                      <div>
                        <div className="emp-name">Talia Ortiz</div>
                        <div className="emp-role">3D Visualizer</div>
                      </div>
                    </div>
                  </td>
                  <td className="emp-id">#SC-2311</td>
                  <td>09:05 AM</td>
                  <td>06:05 PM</td>
                  <td>9h 00m</td>
                  <td><span className="badge badge-present">PRESENT</span></td>
                </tr>
              </tbody>
            </table>
            
            <div className="pagination">
              <span className="page-info">Showing 1 to 5 of 24 employees</span>
              <div className="page-controls">
                <button className="page-btn"><ChevronLeft size={16} /></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bottom-widgets">
            <div className="trend-widget">
              <div className="widget-header">
                <h3>Attendance Trend (Past 7 Days)</h3>
                <div className="legend">
                  <span className="legend-item"><span className="dot dot-present"></span> Present</span>
                  <span className="legend-item"><span className="dot dot-late"></span> Late</span>
                </div>
              </div>
              <div className="trend-chart">
                <div className="bar full"></div>
                <div className="bar full"></div>
                <div className="bar full"></div>
                <div className="bar full"></div>
                <div className="bar full"></div>
                <div className="bar full"></div>
                <div className="bar mixed">
                  <div className="mixed-top"></div>
                  <div className="mixed-bottom"></div>
                </div>
              </div>
            </div>

            <div className="policy-widget">
               <span className="policy-tag">POLICY CHECK</span>
               <h4>3 consecutive lates trigger a manager notification automatically.</h4>
               <a href="#">Review Policy Docs</a>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
