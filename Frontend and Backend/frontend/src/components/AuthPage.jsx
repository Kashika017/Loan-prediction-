import React, { useState } from 'react';
import { BrainCircuit, Lock, Mail, User, Check, ArrowRight, Activity, Sparkles } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Underwriting Officer');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const userSession = {
        name: isRegister ? (fullName || 'Risk Analyst') : (email.split('@')[0] || 'Alex Morgan'),
        email: email || 'alex.morgan@loanai.fintech',
        role: role || 'Underwriting Officer'
      };
      onLoginSuccess(userSession);
    }, 600);
  };

  const fillDemoUser = (userType) => {
    if (userType === 'analyst') {
      setEmail('analyst@loanai.fintech');
      setPassword('password123');
      setFullName('Alex Morgan');
      setRole('Underwriting Officer');
    } else if (userType === 'applicant') {
      setEmail('applicant.john@example.com');
      setPassword('password123');
      setFullName('John Doe');
      setRole('Loan Applicant');
    }
  };

  const handleGuestAccess = () => {
    onLoginSuccess({
      name: 'Guest User',
      email: 'guest@loanai.fintech',
      role: 'Guest Analyst'
    });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-page-card">
        {/* Left Side: Login / Register Form */}
        <div className="auth-form-side">
          <div className="auth-brand-logo">
            <div className="logo-icon">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h2 className="brand-title">LoanAI</h2>
              <p className="brand-subtitle">Intelligent Loan Prediction System</p>
            </div>
          </div>

          <div className="auth-header-text">
            <h3>{isRegister ? 'Create Your Account' : 'Sign In to LoanAI'}</h3>
            <p>{isRegister ? 'Register to access ML underwriting risk assessments' : 'Enter your credentials to access the analytics suite'}</p>
          </div>

          <div className="auth-tabs">
            <button 
              type="button" 
              className={`auth-tab ${!isRegister ? 'active' : ''}`}
              onClick={() => setIsRegister(false)}
            >
              Sign In
            </button>
            <button 
              type="button" 
              className={`auth-tab ${isRegister ? 'active' : ''}`}
              onClick={() => setIsRegister(true)}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <>
                <div className="form-group">
                  <label htmlFor="authFullName">Full Name *</label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input 
                      type="text"
                      id="authFullName"
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required={isRegister}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="authRole">Account Role *</label>
                  <select 
                    id="authRole" 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="Underwriting Officer">Underwriting Officer</option>
                    <option value="Risk Analyst">Risk Analyst</option>
                    <option value="Loan Applicant">Loan Applicant</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="authEmailPage">Email Address *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email"
                  id="authEmailPage"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="authPasswordPage">Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input 
                  type="password"
                  id="authPasswordPage"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {!isRegister && (
              <div className="auth-options">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-link-btn">Forgot password?</button>
              </div>
            )}

            <button type="submit" className="submit-btn auth-submit" disabled={loading}>
              {loading ? <div className="spinner"></div> : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In to LoanAI'} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="demo-shortcuts">
            <span className="demo-label">Quick Demo Shortcuts:</span>
            <div className="demo-btns">
              <button type="button" className="demo-chip" onClick={() => fillDemoUser('analyst')}>
                <Check size={12} /> Underwriter Mode
              </button>
              <button type="button" className="demo-chip" onClick={() => fillDemoUser('applicant')}>
                <Check size={12} /> Applicant Mode
              </button>
              <button type="button" className="demo-chip guest" onClick={handleGuestAccess}>
                <Sparkles size={12} /> Continue as Guest
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: FinTech Visual Showcase */}
        <div className="auth-showcase-side">
          <div className="showcase-content">
            <div className="hero-badge">
              <Activity size={14} />
              <span>FastAPI Machine Learning Portal</span>
            </div>

            <h2>Automated Loan Risk Intelligence</h2>
            <p>Trained on thousands of historical financial records using Ensemble Random Forest Decision Trees for accurate default prediction.</p>

            <div className="showcase-features">
              <div className="showcase-feat-item">
                <div className="feat-check"><Check size={14} /></div>
                <div>
                  <strong>Instant Sub-Second Inference</strong>
                  <p>Inference delivered in under 50ms with live probability scoring.</p>
                </div>
              </div>

              <div className="showcase-feat-item">
                <div className="feat-check"><Check size={14} /></div>
                <div>
                  <strong>Explainable AI & Feature Weights</strong>
                  <p>Transparent SHAP feature weights for credit score, DTI, and income.</p>
                </div>
              </div>

              <div className="showcase-feat-item">
                <div className="feat-check"><Check size={14} /></div>
                <div>
                  <strong>Audit History & Analytics Dashboard</strong>
                  <p>Comprehensive logs, search filters, and donut distribution charts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
