import React from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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

function Input({ label, type, placeholder, icon: Icon, id, rightAction }) {
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

          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            
            <Input 
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@architectural.com"
              icon={Mail}
            />

            <Input 
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
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
