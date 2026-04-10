import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

function Header() {
  return (
    <div className="login-header">
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="logo-icon">A</div>
        <h1 className="login-title" style={{ color: 'var(--dark-text)' }}>Studio Core</h1>
      </Link>
      <p className="login-subtitle">The Architectural Workspace</p>
    </div>
  );
}

function Input({ label, type, placeholder, icon: Icon, id, rightAction, value, onChange }) {
  return (
    <div className="input-group">
      <div className="label-container">
        <label htmlFor={id} className="input-label">
          {label}
        </label>
        {rightAction && rightAction}
      </div>
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon-wrapper">
            <Icon className="input-icon" />
          </div>
        )}
        <input 
          id={id}
          type={type} 
          className={`form-input ${type === 'password' ? 'password-input' : ''}`} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function Checkbox({ id, label }) {
  return (
    <div className="checkbox-container">
      <input 
        id={id} 
        name={id} 
        type="checkbox" 
        className="form-checkbox"
      />
      <label htmlFor={id} className="checkbox-label">
        {label}
      </label>
    </div>
  );
}

function Button({ children, type = "button", icon: Icon }) {
  return (
    <button 
      type={type} 
      className="submit-btn"
    >
      {children}
      {Icon && <Icon className="btn-icon" />}
    </button>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (employeeId) {
      localStorage.setItem('employeeId', employeeId);
      if (employeeId.toUpperCase().startsWith('ADM-') || employeeId.toUpperCase().startsWith('SC-')) {
        navigate('/dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      {/* Outer Card */}
      <div className="login-card">
        
        <Header />

        {/* Inner Form Card */}
        <div className="form-container">
          <h2 className="form-greeting">
            Welcome Back
          </h2>
          <p className="form-description">
            Access your professional design ecosystem.
          </p>

          <form className="login-form" onSubmit={handleLogin}>
            
            <Input 
              id="employeeId"
              label="Employee ID"
              type="text"
              placeholder="e.g. EMP-001"
              icon={Mail}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />

            <Input 
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightAction={
                <a href="#" className="forgot-password">
                  Forgot Password?
                </a>
              }
            />

            <Checkbox 
              id="remember-me" 
              label="Remember Me" 
            />

            <Button type="submit" icon={ArrowRight}>
              Sign In
            </Button>
            
          </form>

          {/* Footer Link */}
          <p className="footer-text">
            New to the studio?{' '}
            <a href="#" className="request-access">
              Request Access
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
