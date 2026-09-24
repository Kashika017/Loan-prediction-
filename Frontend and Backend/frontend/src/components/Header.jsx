import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Activity, 
  FileText, 
  History, 
  BarChart2, 
  Home, 
  Cpu, 
  BarChart3, 
  Moon, 
  Sun,
  UserCheck,
  BookOpen,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Database
} from 'lucide-react';

const TAB_NAMES = {
  home: 'Home & Overview',
  form: 'Predict Loan Eligibility',
  eda: 'Data Insights (EDA Details)',
  'model-info': 'Model Details & Benchmarking',
  dashboard: 'Analytics Dashboard',
  history: 'Prediction History',
  insights: 'Model Insights & Features',
  admin: 'Admin & Model Monitoring',
  'how-it-works': 'How It Works & About'
};

export default function Header({ 
  activeTab, 
  setActiveTab, 
  isBackendOnline, 
  theme, 
  setTheme,
  user,
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="header-brand" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <BrainCircuit size={30} />
          </div>
          <div>
            <div className="breadcrumb-tag">
              <span className="crumb-root">LoanAI System</span>
              <span className="crumb-slash">&rsaquo;</span>
              <span className="crumb-active">{TAB_NAMES[activeTab] || 'Home'}</span>
            </div>
            <h1 className="brand-title">LoanAI</h1>
            <p className="brand-subtitle">Intelligent Loan Prediction System</p>
          </div>
        </div>

        <div className="header-meta">
          {/* Theme Selector */}
          <div className="theme-switcher-pill">
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              title="Dark Theme"
            >
              <Moon size={13} /> Dark
            </button>
            <button
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              title="Light Theme"
            >
              <Sun size={13} /> Light
            </button>
          </div>

          <div className="meta-badge">
            <Cpu size={14} />
            <span>RandomForest v1.0</span>
          </div>

          <div className={`status-pill ${isBackendOnline ? 'online' : 'offline'}`}>
            <Activity size={14} />
            <span>
              {isBackendOnline === null
                ? 'Checking API...'
                : isBackendOnline
                ? 'Backend Online (Port 8000)'
                : 'Backend Server Offline'}
            </span>
          </div>

          {/* User Profile Badge & Sign Out Button */}
          {user && (
            <div className="user-nav-group">
              <div className="user-profile-badge" title={`Role: ${user.role || 'Analyst'}`}>
                <UserCheck size={14} />
                <span>{user.name}</span>
              </div>
              <button className="btn-signout" onClick={onLogout} title="Sign Out">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu Icon */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className={`header-nav-row ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="tab-navigation">
          <button
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            <Home size={15} /> Home
          </button>
          <button
            className={`nav-tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => handleNavClick('form')}
          >
            <FileText size={15} /> Predict Loan
          </button>
          <button
            className={`nav-tab ${activeTab === 'eda' ? 'active' : ''}`}
            onClick={() => handleNavClick('eda')}
          >
            <Database size={15} /> Data Insights
          </button>
          <button
            className={`nav-tab ${activeTab === 'model-info' ? 'active' : ''}`}
            onClick={() => handleNavClick('model-info')}
          >
            <Cpu size={15} /> Model Info
          </button>
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <BarChart3 size={15} /> Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleNavClick('history')}
          >
            <History size={15} /> History
          </button>
          <button
            className={`nav-tab ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => handleNavClick('insights')}
          >
            <BarChart2 size={15} /> Model Insights
          </button>
          <button
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
          >
            <ShieldCheck size={15} /> Admin Monitoring
          </button>
          <button
            className={`nav-tab ${activeTab === 'how-it-works' ? 'active' : ''}`}
            onClick={() => handleNavClick('how-it-works')}
          >
            <BookOpen size={15} /> How It Works
          </button>
        </div>
      </nav>
    </header>
  );
}
