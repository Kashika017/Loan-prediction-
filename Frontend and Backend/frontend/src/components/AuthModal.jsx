import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Check } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: isRegister ? (fullName || 'Risk Analyst') : (email.split('@')[0] || 'Alex Morgan'),
        email: email || 'alex.morgan@loanai.fintech',
        role: 'Underwriting Officer'
      });
      onClose();
    }, 600);
  };

  const fillDemoUser = (userType) => {
    if (userType === 'analyst') {
      setEmail('analyst@loanai.fintech');
      setPassword('password123');
      setFullName('Alex Morgan');
    } else {
      setEmail('applicant.john@example.com');
      setPassword('password123');
      setFullName('John Doe');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card auth-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <Shield size={24} />
          </div>
          <h3>{isRegister ? 'Create LoanAI Account' : 'Welcome to LoanAI'}</h3>
          <p>{isRegister ? 'Register for enterprise ML underwriting access' : 'Sign in to access prediction history and analytics'}</p>
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
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input 
                  type="text"
                  id="fullName"
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="authEmail">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input 
                type="email"
                id="authEmail"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="authPassword">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input 
                type="password"
                id="authPassword"
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
            {loading ? <div className="spinner"></div> : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="demo-shortcuts">
          <span className="demo-label">Demo One-Click Sign In:</span>
          <div className="demo-btns">
            <button type="button" className="demo-chip" onClick={() => fillDemoUser('analyst')}>
              <Check size={12} /> Underwriter Mode
            </button>
            <button type="button" className="demo-chip" onClick={() => fillDemoUser('applicant')}>
              <Check size={12} /> Applicant Mode
            </button>
          </div>
        </div>

        <div className="auth-footer-text">
          {isRegister ? (
            <p>Already have an account? <button type="button" className="text-link-btn" onClick={() => setIsRegister(false)}>Sign In</button></p>
          ) : (
            <p>Don't have an account? <button type="button" className="text-link-btn" onClick={() => setIsRegister(true)}>Create one</button></p>
          )}
        </div>
      </div>
    </div>
  );
}
