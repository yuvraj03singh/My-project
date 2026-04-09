import React from 'react';
import { Search, Bell, Upload, Shield, Sparkles, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../css/Employees.css';

export default function Employees() {
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
          </div>
        </div>
        <div className="nav-right">
          <button className="icon-btn">
             <Search size={18} />
          </button>
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <div className="user-profile">
            <img src="https://i.pravatar.cc/150?img=47" alt="Profile" />
          </div>
        </div>
      </header>

      {/* Main Content Centered */}
      <main className="employees-content">
         <div className="form-header">
            <h1 className="page-title">New Studio Associate</h1>
            <p className="page-subtitle">Onboard a new member to the Architectural Workspace digital ecosystem.</p>
         </div>

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

            <form className="onboard-form" onSubmit={(e) => e.preventDefault()}>
               <div className="form-row">
                  <div className="form-group">
                     <label>Full Name</label>
                     <input type="text" placeholder="e.g. Julian Amsel" />
                  </div>
                  <div className="form-group">
                     <label>Email Address</label>
                     <input type="email" defaultValue="j.amsel@studiocore.com" className="filled-input" />
                  </div>
               </div>

               <div className="form-row">
                  <div className="form-group">
                     <label>Phone Number</label>
                     <input type="text" placeholder="+1 (555) 000-0000" className="filled-input" />
                  </div>
                  <div className="form-group">
                     <label>Professional Role</label>
                     <div className="select-wrapper">
                        <select defaultValue="Senior Architect">
                           <option>Senior Architect</option>
                           <option>Lead Designer</option>
                           <option>Project Manager</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="form-row">
                  <div className="form-group full-width">
                     <label>Department</label>
                     <div className="select-wrapper">
                        <select defaultValue="Design & Concept">
                           <option>Design & Concept</option>
                           <option>Engineering</option>
                           <option>Interior Architecture</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="form-actions">
                  <button type="button" className="btn-cancel">Cancel</button>
                  <button type="submit" className="btn-submit">Add Employee</button>
               </div>
            </form>
         </div>

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
