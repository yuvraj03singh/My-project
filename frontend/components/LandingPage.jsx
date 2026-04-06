import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Shield, Users, Globe, CheckCircle2 } from 'lucide-react';
import '../css/LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="nav-brand">StudioCore</Link>
        <div className="nav-links">
          <a href="#" className="nav-link active">Platform</a>
          <a href="#" className="nav-link">Solutions</a>
          <a href="#" className="nav-link">Resources</a>
          <a href="#" className="nav-link">Pricing</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-signin">Sign in</Link>
          <Link to="/login" className="nav-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Build the <br/> <span>Future of Design</span>
          </h1>
          <p className="hero-subtitle">
            A digital studio environment for modern architecture firms. 
            Manage complex workflows with a high-end, 3D architectural workspace.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary">Get Started</Link>
            <button className="btn-secondary">
              <PlayCircle size={20} className="text-primary-blue" />
              Watch Demo
            </button>
          </div>
        </div>
        <div className="hero-visual">
          {/* Placeholder for the 3D Mockup Image from generator */}
           <div className="hero-image-wrapper">
             <img src="/hero_mockup.png" alt="3D Architecture UI" />
           </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <h6 className="trust-title">TRUSTED BY GLOBAL TEAMS</h6>
        <div className="trust-logos">
          <span className="trust-logo">ARC-FORM</span>
          <span className="trust-logo">LEVELS.</span>
          <span className="trust-logo">SPATIAL..</span>
          <span className="trust-logo">GRID+</span>
          <span className="trust-logo">VRTX</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Designed for Excellence</h2>
        <p className="section-subtitle">
          Beyond standard project management, <span>StudioCore</span> leverages architectural logic to manage architect work.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Shield size={24} />
            </div>
            <h3 className="feature-title">Intelligent Analytics</h3>
            <p className="feature-description">
              Deep dive into resource allocation and profitability with data-driven architectural forecasting.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={24} />
            </div>
            <h3 className="feature-title">Resource Planning</h3>
            <p className="feature-description">
              Optimize talent distribution across multiple project phases with our dynamic timeline engine.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Globe size={24} />
            </div>
            <h3 className="feature-title">Global Collaboration</h3>
            <p className="feature-description">
              Connect studios across continents with synchronized asset management and low-latency feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Spatial Management Section */}
      <section className="detail-section">
        <div className="detail-visual">
          <div className="detail-image-wrapper">
             <img src="/detail_mockup.png" alt="Spatial Management Dashboard" />
          </div>
        </div>

        <div className="detail-content">
          <span className="detail-tag">ADVANCED MANAGEMENT</span>
          <h2 className="detail-title">Spatial Management for Modern Teams</h2>
          <p className="detail-description">
            The StudioCore dashboard isn't just a list of tasks - it's a three-dimensional representation of your firm's energy, resources, and trajectory. Experience information density without the clutter.
          </p>
          
          <div className="detail-list">
            <div className="detail-list-item">
              <CheckCircle2 size={24} className="detail-list-icon" />
              <div className="detail-list-text">
                <h4>Multi-Layer Timelines</h4>
                <p>View project phases, employee availability, and milestones in a single fluid view.</p>
              </div>
            </div>
            <div className="detail-list-item">
              <CheckCircle2 size={24} className="detail-list-icon" />
              <div className="detail-list-text">
                <h4>Contextual Feedback</h4>
                <p>Annotate blueprints and 3D models directly within the management flow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Ready to evolve your studio?</h2>
          <p className="cta-subtitle">
            Join the world's most innovative architectural firms using StudioCore to build the structures of tomorrow.
          </p>
          <div className="cta-actions">
            <Link to="/login" className="btn-white">Get Started Now</Link>
            <Link to="/login" className="btn-outline">Request Demo</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">StudioCore</div>
            <p className="footer-description">
              The premier workspace empowering teams for high-performance design representation.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h5>Platform</h5>
              <div className="footer-links">
                <a href="#">Workflow Engine</a>
                <a href="#">Resource Planner</a>
                <a href="#">3D Review Tool</a>
                <a href="#">VR Collaboration</a>
              </div>
            </div>

            <div className="footer-column">
              <h5>Resources</h5>
              <div className="footer-links">
                <a href="#">Case Studies</a>
                <a href="#">Technical Guides</a>
                <a href="#">Architectural Trends</a>
                <a href="#">Help Center</a>
              </div>
            </div>

            <div className="footer-column">
              <h5>Legal</h5>
              <div className="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Settings</a>
                <a href="#">Global Offices</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 StudioCore Architectural Systems. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
