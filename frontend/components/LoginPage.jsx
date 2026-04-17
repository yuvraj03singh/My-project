import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/LoginPage.css';

const API_URL = 'http://localhost:5000/api';

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

function Button({ children, type = "button", icon: Icon, loading = false, disabled = false }) {
  return (
    <button 
      type={type} 
      className="submit-btn"
      disabled={disabled || loading}
      style={loading ? { opacity: 0.8, cursor: 'not-allowed' } : {}}
    >
      {loading ? (
        <>
          <Loader className="btn-icon spinning" size={18} />
          Signing In...
        </>
      ) : (
        <>
          {children}
          {Icon && <Icon className="btn-icon" />}
        </>
      )}
    </button>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!employeeId || !password) {
      setError('Please enter both ID and password.');
      return;
    }

    const upperID = employeeId.toUpperCase();

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        adminId: upperID,
        password
      });

      if (response.data.success) {
        const { token, adminId, name, email, role } = response.data.data;
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('employeeId', adminId);
        localStorage.setItem('employeeName', name);
        localStorage.setItem('name', name);
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('userRole', role);
        
        if (role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
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

          {/* Error Message */}
          {error && (
            <div className="login-error" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              color: '#ef4444',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            
            <Input 
              id="employeeId"
              label="Employee / Admin ID"
              type="text"
              placeholder="e.g. ADM-001 or EMP-001"
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

            <Button type="submit" icon={ArrowRight} loading={loading}>
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
