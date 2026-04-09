import React from 'react';
import { 
  Building, LayoutDashboard, Users, Calendar, BarChart2, FileText,
  HelpCircle, LogOut, Settings, Bell, Search, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../css/Reports.css';

export default function Reports() {
  return (
    <div className="reports-container">
      {/* Sidebar */}
      <aside className="reports-sidebar">
        <div className="sidebar-brand">
           <h2 className="brand-logo-text-blue">Studio Reports</h2>
        </div>
        
        <div className="sidebar-workspace-info">
           <div className="workspace-icon-new">
             <Building size={20} />
           </div>
           <div className="workspace-text-new">
             <div className="workspace-title-new">Corporate HQ</div>
             <div className="workspace-subtitle-new">Enterprise Tier</div>
           </div>
        </div>

        <button className="create-report-btn">
          Create New Report
        </button>

        <nav className="reports-nav">
          <Link to="/dashboard" className="reports-nav-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/employees" className="reports-nav-item">
            <Users size={20} />
            <span>Team</span>
          </Link>
          <Link to="/attendance" className="reports-nav-item">
            <Calendar size={20} />
            <span>Performance</span>
          </Link>
          <Link to="/reports" className="reports-nav-item active">
            <BarChart2 size={20} />
            <span>Reports</span>
          </Link>
          <a href="#" className="reports-nav-item">
            <FileText size={20} />
            <span>Documents</span>
          </a>
        </nav>

        <div className="reports-sidebar-footer">
          <a href="#" className="reports-footer-link">
            <HelpCircle size={18} /> Help Center
          </a>
          <Link to="/" className="reports-footer-link reports-logout">
            <LogOut size={18} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="reports-main-content">
        {/* Header */}
        <header className="reports-top-header">
          <div className="reports-header-tabs">
            <a href="#" className="reports-tab">Analytics</a>
            <a href="#" className="reports-tab">Workforce</a>
            <a href="#" className="reports-tab">Planning</a>
          </div>
          
          <div className="reports-header-actions">
            <button className="reports-icon-btn">
              <Bell size={20} />
            </button>
            <button className="reports-icon-btn">
              <Settings size={20} />
            </button>
            <div className="reports-user-profile">
               <img src="https://i.pravatar.cc/150?img=47" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="reports-page-content">
           <div className="reports-title-section">
              <div className="reports-titles">
                <h1>Performance Reports</h1>
                <p>Strategic insights for Q3 workforce efficiency.</p>
              </div>
              <div className="reports-title-actions">
                <button className="reports-btn-secondary">Export CSV</button>
                <button className="reports-btn-primary">Schedule Report</button>
              </div>
           </div>

           {/* KPI Cards */}
           <div className="reports-kpi-grid">
              <div className="reports-kpi-card">
                 <div className="kpi-background-shape"></div>
                 <div className="kpi-label">AVERAGE PRODUCTIVITY</div>
                 <div className="kpi-value-row">
                    <span className="kpi-value">87.4%</span>
                    <span className="kpi-trend positive">~2.1%</span>
                 </div>
              </div>
              <div className="reports-kpi-card">
                 <div className="kpi-background-shape"></div>
                 <div className="kpi-label">ATTENDANCE RATE</div>
                 <div className="kpi-value-row">
                    <span className="kpi-value">94%</span>
                    <span className="kpi-trend stable">Stable</span>
                 </div>
              </div>
              <div className="reports-kpi-card">
                 <div className="kpi-background-shape"></div>
                 <div className="kpi-label">TURNOVER RATE</div>
                 <div className="kpi-value-row">
                    <span className="kpi-value">4.2%</span>
                    <span className="kpi-trend negative">~0.5%</span>
                 </div>
              </div>
              <div className="reports-kpi-card">
                 <div className="kpi-background-shape"></div>
                 <div className="kpi-label">TOTAL HOURS</div>
                 <div className="kpi-value-row">
                    <span className="kpi-value">12,480</span>
                    <span className="kpi-target">/ 13k target</span>
                 </div>
              </div>
           </div>

           {/* Charts Section */}
           <div className="reports-charts-grid">
              <div className="reports-chart-card trends-card">
                 <div className="chart-header">
                    <h3>Workforce Trends</h3>
                    <div className="chart-legend">
                        <span className="legend-item"><span className="dot dark-blue"></span> Growth</span>
                        <span className="legend-item"><span className="dot light-blue"></span> Attendance</span>
                    </div>
                 </div>
                 
                 <div className="bar-chart-container">
                    <div className="chart-bg-lines">
                       <div className="bg-line"></div>
                       <div className="bg-line"></div>
                       <div className="bg-line"></div>
                       <div className="bg-line"></div>
                    </div>
                    <div className="bar-group-wrapper">
                      <div className="bar-group">
                         <div className="bar light-bar" style={{height: '50%'}}>
                            <div className="bar-top-line" style={{bottom: '50%'}}></div>
                         </div>
                         <span className="bar-label">JAN</span>
                      </div>
                      <div className="bar-group">
                         <div className="bar light-bar" style={{height: '75%'}}>
                            <div className="bar-top-line" style={{bottom: '75%'}}></div>
                         </div>
                         <span className="bar-label">FEB</span>
                      </div>
                      <div className="bar-group">
                         <div className="bar light-bar" style={{height: '25%'}}>
                            <div className="bar-top-line" style={{bottom: '25%'}}></div>
                         </div>
                         <span className="bar-label">MAR</span>
                      </div>
                      <div className="bar-group">
                         <div className="bar light-bar" style={{height: '65%'}}>
                            <div className="bar-top-line" style={{bottom: '65%'}}></div>
                         </div>
                         <span className="bar-label">APR</span>
                      </div>
                      <div className="bar-group">
                         <div className="bar light-bar" style={{height: '45%'}}>
                            <div className="bar-top-line" style={{bottom: '45%'}}></div>
                         </div>
                         <span className="bar-label">MAY</span>
                      </div>
                      <div className="bar-group">
                         <div className="bar light-bar" style={{height: '90%'}}>
                            <div className="bar-top-line" style={{bottom: '90%'}}></div>
                         </div>
                         <span className="bar-label">JUN</span>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="reports-chart-card efficiency-card">
                 <div className="chart-header">
                    <h3>Department Efficiency</h3>
                 </div>
                 <div className="efficiency-bars">
                    <div className="eff-bar-group">
                       <div className="eff-labels">
                         <span>Architectural</span>
                         <span>92%</span>
                       </div>
                       <div className="eff-track"><div className="eff-fill" style={{width: '92%'}}></div></div>
                    </div>
                    <div className="eff-bar-group">
                       <div className="eff-labels">
                         <span>Engineering</span>
                         <span>84%</span>
                       </div>
                       <div className="eff-track"><div className="eff-fill" style={{width: '84%'}}></div></div>
                    </div>
                    <div className="eff-bar-group">
                       <div className="eff-labels">
                         <span>Interior Design</span>
                         <span>78%</span>
                       </div>
                       <div className="eff-track"><div className="eff-fill" style={{width: '78%'}}></div></div>
                    </div>
                 </div>
                 <div className="eff-footer-text">
                    Top performing team this month:<br/>
                    <strong>Architectural Studio B</strong> with a 98%<br/> milestone completion rate.
                 </div>
              </div>
           </div>

           {/* Recent Reports Table */}
           <div className="recent-reports-container">
              <div className="recent-reports-header">
                 <h3>Recent Generated Reports</h3>
                 <div className="reports-search">
                    <Search size={14} className="search-icon-sm" />
                    <input type="text" placeholder="Search reports..." />
                 </div>
              </div>
              
              <div className="reports-table-wrapper">
                 <table className="reports-table">
                    <thead>
                       <tr>
                          <th>REPORT NAME</th>
                          <th>TYPE</th>
                          <th>DATE GENERATED</th>
                          <th>STATUS</th>
                          <th>ACTION</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td>
                             <div className="file-name-cell">
                                <FileText size={16} className="file-icon-blue" />
                                <span className="font-medium">Q3 Performance Audit</span>
                             </div>
                          </td>
                          <td><span className="badge-type">Performance</span></td>
                          <td>Oct 12, 2023</td>
                          <td><span className="status-ready"><span className="dot-green"></span> Ready</span></td>
                          <td><a href="#" className="download-link">Download <Download size={14} /></a></td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
