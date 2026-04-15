import React, { useState, useEffect } from 'react';
import { Search, Bell, Upload, Shield, Sparkles, Network, Loader, AlertCircle, CheckCircle, Trash2, Eye, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Employees.css';

const API_URL = 'http://localhost:5000/api';

export default function Employees() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'Senior Architect',
    department: 'Design & Concept'
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const adminName = localStorage.getItem('adminName') || 'Director';
  const employeeId = localStorage.getItem('employeeId') || '';

  // Get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Check admin auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchEmployees();
  }, []);

  // Fetch all employees
  const fetchEmployees = async () => {
    setListLoading(true);
    try {
      const res = await axios.get(`${API_URL}/employees`, getAuthHeaders());
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
      console.error('Failed to fetch employees:', err);
    } finally {
      setListLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create new employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.fullName || !formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Full name, email, and password are required.' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/employees`, formData, getAuthHeaders());
      if (res.data.success) {
        setMessage({ type: 'success', text: `Employee ${res.data.data.employeeId} created successfully!` });
        setFormData({ fullName: '', email: '', password: '', phone: '', role: 'Senior Architect', department: 'Design & Concept' });
        fetchEmployees();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create employee.';
      setMessage({ type: 'error', text: msg });
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`${API_URL}/employees/${id}`, getAuthHeaders());
      setMessage({ type: 'success', text: 'Employee deleted successfully.' });
      fetchEmployees();
      if (selectedEmployee?._id === id) setSelectedEmployee(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete employee.' });
    }
  };

  // Filter employees by search
  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cancel form
  const handleCancel = () => {
    setFormData({ fullName: '', email: '', password: '', phone: '', role: 'Senior Architect', department: 'Design & Concept' });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="employees-layout">
      {/* Top Header */}
      <header className="top-nav">
        <div className="nav-left">
          <h2 className="brand-logo-top">StudioCore</h2>
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/employees" className="active">Employees</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/reports">Reports</Link>
          </div>
        </div>
        <div className="nav-right">
          <button className="icon-btn">
             <Search size={18} />
          </button>
          <button className="icon-btn">
            <Bell size={18} />
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

      {/* Main Content Centered */}
      <main className="employees-content">
         <div className="form-header">
            <h1 className="page-title">New Studio Associate</h1>
            <p className="page-subtitle">Onboard a new member to the Architectural Workspace digital ecosystem.</p>
         </div>

         {/* Status Message */}
         {message.text && (
           <div className={`status-message ${message.type}`} style={{
             display: 'flex',
             alignItems: 'center',
             gap: '10px',
             padding: '14px 20px',
             borderRadius: '12px',
             marginBottom: '24px',
             fontSize: '0.95rem',
             fontWeight: '500',
             background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
             border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
             color: message.type === 'success' ? '#10b981' : '#ef4444',
             maxWidth: '800px',
             margin: '0 auto 24px'
           }}>
             {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
             {message.text}
           </div>
         )}

         <div className="form-card">
            {/* Profile upload section */}
            <div className="profile-upload-section">
               <div className="avatar-placeholder">
                  <div className="avatar-inner">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div className="upload-badge">
                     <Upload size={14} />
                  </div>
               </div>
               <div className="profile-text">
                  <h3>Profile Identity</h3>
                  <p>Recommended: 400×400px. JPG or PNG only.</p>
                  <button className="upload-btn">Upload New Image</button>
               </div>
            </div>

            <form className="onboard-form" onSubmit={handleSubmit}>
               <div className="form-row">
                  <div className="form-group">
                     <label>Full Name</label>
                     <input 
                       type="text" 
                       name="fullName"
                       placeholder="e.g. Julian Amsel" 
                       value={formData.fullName}
                       onChange={handleChange}
                     />
                  </div>
                  <div className="form-group">
                     <label>Email Address</label>
                     <input 
                       type="email"
                       name="email" 
                       placeholder="e.g. j.amsel@studiocore.com"
                       value={formData.email}
                       onChange={handleChange}
                     />
                  </div>
               </div>

               <div className="form-row">
                  <div className="form-group">
                     <label>Account Password</label>
                     <input 
                       type="password"
                       name="password" 
                       placeholder="Temporary Password"
                       value={formData.password}
                       onChange={handleChange}
                     />
                  </div>
                  <div className="form-group">
                     <label>Phone Number</label>
                     <input 
                       type="text"
                       name="phone" 
                       placeholder="+1 (555) 000-0000" 
                       value={formData.phone}
                       onChange={handleChange}
                     />
                  </div>
               </div>

               <div className="form-row">
                  <div className="form-group">
                     <label>Professional Role</label>
                     <div className="select-wrapper">
                        <select name="role" value={formData.role} onChange={handleChange}>
                        
                           <option>Senior Architect</option>
                           <option>Lead Designer</option>
                           <option>Project Manager</option>
                           <option>Junior Architect</option>
                           <option>Interior Designer</option>
                           <option>Engineer</option>
                        </select>
                     </div>
                  </div>
                  <div className="form-group">
                     <label>Department</label>
                     <div className="select-wrapper">
                        <select name="department" value={formData.department} onChange={handleChange}>
                        
                           <option>Design & Concept</option>
                           <option>Engineering</option>
                           <option>Interior Architecture</option>
                           <option>Project Management</option>
                           <option>Administration</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <><Loader size={16} className="spinning" /> Creating...</>
                    ) : (
                      'Add Employee'
                    )}
                  </button>
               </div>
            </form>
         </div>

         {/* ─── EMPLOYEE LIST TABLE ─── */}
         <div className="employee-list-section" style={{
           maxWidth: '800px',
           margin: '40px auto 0',
           width: '100%'
         }}>
           <div style={{
             display: 'flex',
             justifyContent: 'space-between',
             alignItems: 'center',
             marginBottom: '20px'
           }}>
             <h2 style={{
               fontSize: '1.4rem',
               fontWeight: '700',
               color: '#1e293b',
               margin: 0
             }}>All Employees ({employees.length})</h2>
             <div style={{
               position: 'relative',
               width: '260px'
             }}>
               <Search size={16} style={{
                 position: 'absolute',
                 left: '12px',
                 top: '50%',
                 transform: 'translateY(-50%)',
                 color: '#94a3b8'
               }} />
               <input
                 type="text"
                 placeholder="Search employees..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 style={{
                   width: '100%',
                   padding: '10px 14px 10px 38px',
                   borderRadius: '10px',
                   border: '1px solid #e2e8f0',
                   fontSize: '0.9rem',
                   background: '#f8fafc',
                   outline: 'none',
                   transition: 'border-color 0.2s',
                   boxSizing: 'border-box'
                 }}
               />
             </div>
           </div>

           {listLoading ? (
             <div style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               padding: '60px 0',
               color: '#94a3b8'
             }}>
               <Loader size={24} className="spinning" />
               <span style={{ marginLeft: '12px', fontSize: '1rem' }}>Loading employees...</span>
             </div>
           ) : filteredEmployees.length === 0 ? (
             <div style={{
               textAlign: 'center',
               padding: '60px 20px',
               color: '#94a3b8',
               background: '#f8fafc',
               borderRadius: '16px',
               border: '1px dashed #e2e8f0'
             }}>
               <p style={{ fontSize: '1.1rem', margin: '0 0 6px' }}>
                 {searchQuery ? 'No employees match your search.' : 'No employees yet.'}
               </p>
               <p style={{ fontSize: '0.9rem', margin: 0 }}>
                 {searchQuery ? 'Try a different search term.' : 'Create your first employee using the form above.'}
               </p>
             </div>
           ) : (
             <div style={{
               background: '#fff',
               borderRadius: '16px',
               border: '1px solid #e2e8f0',
               overflow: 'hidden',
               boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
             }}>
               <table style={{
                 width: '100%',
                 borderCollapse: 'collapse',
                 fontSize: '0.9rem'
               }}>
                 <thead>
                   <tr style={{
                     background: '#f8fafc',
                     borderBottom: '1px solid #e2e8f0'
                   }}>
                     <th style={thStyle}>ID</th>
                     <th style={thStyle}>Name</th>
                     <th style={thStyle}>Role</th>
                     <th style={thStyle}>Department</th>
                     <th style={thStyle}>Status</th>
                     <th style={{...thStyle, textAlign: 'center'}}>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredEmployees.map((emp) => (
                     <tr key={emp._id} style={{
                       borderBottom: '1px solid #f1f5f9',
                       transition: 'background 0.15s'
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                     >
                       <td style={tdStyle}>
                         <span style={{
                           fontWeight: '600',
                           color: '#6366f1',
                           fontSize: '0.85rem'
                         }}>{emp.employeeId}</span>
                       </td>
                       <td style={tdStyle}>
                         <div>
                           <div style={{ fontWeight: '600', color: '#1e293b' }}>{emp.fullName}</div>
                           <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{emp.email}</div>
                         </div>
                       </td>
                       <td style={tdStyle}>{emp.role}</td>
                       <td style={tdStyle}>{emp.department}</td>
                       <td style={tdStyle}>
                         <span style={{
                           display: 'inline-block',
                           padding: '4px 12px',
                           borderRadius: '20px',
                           fontSize: '0.78rem',
                           fontWeight: '600',
                           background: emp.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                           color: emp.status === 'active' ? '#10b981' : '#ef4444'
                         }}>
                           {emp.status === 'active' ? 'Active' : 'Inactive'}
                         </span>
                       </td>
                       <td style={{...tdStyle, textAlign: 'center'}}>
                         <button
                           onClick={() => setSelectedEmployee(emp)}
                           style={actionBtnStyle}
                           title="View details"
                         >
                           <Eye size={15} />
                         </button>
                         <button
                           onClick={() => handleDelete(emp._id)}
                           style={{...actionBtnStyle, color: '#ef4444'}}
                           title="Delete employee"
                         >
                           <Trash2 size={15} />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
         </div>

         {/* ─── EMPLOYEE DETAIL MODAL ─── */}
         {selectedEmployee && (
           <div style={{
             position: 'fixed',
             top: 0, left: 0, right: 0, bottom: 0,
             background: 'rgba(15,23,42,0.6)',
             backdropFilter: 'blur(4px)',
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             zIndex: 1000
           }} onClick={() => setSelectedEmployee(null)}>
             <div style={{
               background: '#fff',
               borderRadius: '20px',
               padding: '36px',
               maxWidth: '480px',
               width: '90%',
               boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
               position: 'relative'
             }} onClick={(e) => e.stopPropagation()}>
               <button
                 onClick={() => setSelectedEmployee(null)}
                 style={{
                   position: 'absolute',
                   top: '16px', right: '16px',
                   background: '#f1f5f9',
                   border: 'none',
                   borderRadius: '10px',
                   padding: '8px',
                   cursor: 'pointer',
                   color: '#64748b'
                 }}
               >
                 <X size={18} />
               </button>

               <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                 <div style={{
                   width: '72px', height: '72px',
                   borderRadius: '50%',
                   background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   margin: '0 auto 14px',
                   fontSize: '1.6rem', fontWeight: '700', color: '#fff'
                 }}>
                   {selectedEmployee.fullName.charAt(0).toUpperCase()}
                 </div>
                 <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem', color: '#1e293b' }}>{selectedEmployee.fullName}</h2>
                 <span style={{
                   display: 'inline-block',
                   padding: '4px 14px',
                   borderRadius: '20px',
                   fontSize: '0.8rem',
                   fontWeight: '600',
                   background: 'rgba(99,102,241,0.1)',
                   color: '#6366f1'
                 }}>{selectedEmployee.employeeId}</span>
               </div>

               <div style={{ display: 'grid', gap: '14px' }}>
                 {[
                   ['Email', selectedEmployee.email],
                   ['Phone', selectedEmployee.phone || 'Not provided'],
                   ['Role', selectedEmployee.role],
                   ['Department', selectedEmployee.department],
                   ['Status', selectedEmployee.status],
                   ['Joined', new Date(selectedEmployee.joinDate || selectedEmployee.createdAt).toLocaleDateString('en-US', {
                     year: 'numeric', month: 'long', day: 'numeric'
                   })]
                 ].map(([label, value]) => (
                   <div key={label} style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     padding: '10px 16px',
                     background: '#f8fafc',
                     borderRadius: '10px'
                   }}>
                     <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{label}</span>
                     <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>{value}</span>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         )}

         {/* Info Cards */}
         <div className="info-cards">
            <div className="info-card">
               <div className="info-icon">
                  <Shield size={20} />
               </div>
               <h4>Secure Onboarding</h4>
               <p>Employees receive a secure magic link to set up their workspace credentials immediately.</p>
            </div>
            <div className="info-card">
               <div className="info-icon">
                  <Sparkles size={20} />
               </div>
               <h4>Smart Allocation</h4>
               <p>StudioCore automatically assigns default project boards based on the selected department.</p>
            </div>
            <div className="info-card">
               <div className="info-icon">
                  <Network size={20} />
               </div>
               <h4>Team Hierarchy</h4>
               <p>Roles define permission levels for architectural blueprints and sensitive project data.</p>
            </div>
         </div>
      </main>
    </div>
  );
}

// Table styles
const thStyle = {
  padding: '14px 18px',
  textAlign: 'left',
  fontSize: '0.78rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b'
};

const tdStyle = {
  padding: '14px 18px',
  color: '#475569'
};

const actionBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '8px',
  color: '#64748b',
  transition: 'all 0.15s',
  marginRight: '4px'
};
