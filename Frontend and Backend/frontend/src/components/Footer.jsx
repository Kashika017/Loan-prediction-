import React from 'react';
import { BrainCircuit, Code, BookOpen, Lock, Home, FileText, BarChart3, History } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const handleNav = (tab) => {
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="enterprise-footer">
      <div className="footer-grid">
        {/* Column 1: Brand & Description */}
        <div className="footer-col brand-col">
          <div className="footer-brand" onClick={() => handleNav('home')} style={{ cursor: 'pointer' }}>
            <div className="footer-logo">
              <BrainCircuit size={22} />
            </div>
            <span className="footer-title">LoanAI</span>
          </div>
          <p className="footer-desc">
            Intelligent Loan Prediction System combining Machine Learning analytics with modern FinTech decision support.
          </p>
          <div className="footer-security-pill">
            <Lock size={13} />
            <span>Encrypted ML Inference Endpoint</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Platform Navigation</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => handleNav('home')} className="footer-link-btn">
                <Home size={13} /> Home / Landing
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('form')} className="footer-link-btn">
                <FileText size={13} /> Predict Loan
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('dashboard')} className="footer-link-btn">
                <BarChart3 size={13} /> Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('history')} className="footer-link-btn">
                <History size={13} /> History Logs
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('insights')} className="footer-link-btn">
                <Code size={13} /> Model Insights
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('how-it-works')} className="footer-link-btn">
                <BookOpen size={13} /> How It Works
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Tech Stack & Architecture */}
        <div className="footer-col">
          <h4 className="footer-heading">Technology Stack</h4>
          <ul className="footer-tech-list">
            <li><span>Frontend:</span> <strong>React 19 + Vite</strong></li>
            <li><span>Backend API:</span> <strong>Python FastAPI</strong></li>
            <li><span>ML Framework:</span> <strong>Scikit-Learn</strong></li>
            <li><span>Algorithm:</span> <strong>RandomForest Classifier</strong></li>
          </ul>
        </div>

        {/* Column 4: Compliance & Regulatory Notice */}
        <div className="footer-col">
          <h4 className="footer-heading">Project Disclaimer</h4>
          <p className="footer-legal">
            This system provides a machine-learning-based prediction for educational and informational demonstration purposes. It should not be treated as financial advice or a legal guarantee of loan approval.
          </p>
        </div>
      </div>

      <div className="footer-bottom-strip">
        <p>&copy; {new Date().getFullYear()} LoanAI – Intelligent Loan Prediction System &bull; All Rights Reserved</p>
        <div className="footer-version-tag">
          <span>v2.0 FinTech Build</span>
        </div>
      </div>
    </footer>
  );
}
