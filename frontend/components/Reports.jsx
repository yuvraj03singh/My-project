import React, { useState, useEffect } from 'react';
import { 
  Bell, LogOut, Search, Download, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../css/Reports.css';

export default function Reports() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const adminName = localStorage.getItem('adminName') || 'Director';
  const employeeId = localStorage.getItem('employeeId') || '';

  useEffect(() => {
    // Auth guard — redirect if not admin
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'admin') {
      navigate('/login');
      return;
    }
  }, [navigate]);

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
      </div>
    </>
  );
}
