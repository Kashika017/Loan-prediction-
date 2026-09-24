import React, { useState, useEffect, useRef } from 'react';
import { predictLoanDefault, checkBackendHealth } from './api';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import LoanForm from './components/LoanForm';
import ResultCard from './components/ResultCard';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import AssessmentHistory from './components/AssessmentHistory';
import ModelInsights from './components/ModelInsights';
import EdaDetails from './components/EdaDetails';
import ModelDetails from './components/ModelDetails';
import AdminModelMonitoring from './components/AdminModelMonitoring';
import PolicyGuidelines from './components/PolicyGuidelines';
import PredictionLoadingModal from './components/PredictionLoadingModal';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import './index.css';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState(null);
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme_pref') || 'dark');
  
  // User Authentication Session
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('loanai_user_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [history, setHistory] = useState([]);
  const resultRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme_pref', theme);
  }, [theme]);

  useEffect(() => {
    const verifyHealth = async () => {
      const healthy = await checkBackendHealth();
      setIsBackendOnline(healthy);
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const savedHist = localStorage.getItem('loan_risk_eval_history');
      if (savedHist) setHistory(JSON.parse(savedHist));
    } catch {
      // Ignore
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('loanai_user_session', JSON.stringify(userData));
    setActiveTab('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loanai_user_session');
    setResult(null);
  };

  const saveToHistory = (formData, resData) => {
    try {
      const refId = `LN-AI-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newEntry = {
        refId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formData,
        result: resData
      };
      const updated = [newEntry, ...history.slice(0, 49)];
      setHistory(updated);
      localStorage.setItem('loan_risk_eval_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save assessment to history:', e);
    }
  };

  const handleFormSubmit = async (formData, modelType = 'scikit_learn') => {
    setLoading(true);
    setLoadingStepIndex(0);
    setError(null);
    setResult(null);
    setLastSubmittedFormData(formData);

    const apiPromise = predictLoanDefault(formData, modelType);

    // Multi-step loading experience animation timing
    const stepDelay = 380;
    
    await new Promise(r => setTimeout(r, stepDelay));
    setLoadingStepIndex(1);
    
    await new Promise(r => setTimeout(r, stepDelay));
    setLoadingStepIndex(2);
    
    await new Promise(r => setTimeout(r, stepDelay));
    setLoadingStepIndex(3);

    const response = await apiPromise;
    await new Promise(r => setTimeout(r, 320));

    setLoading(false);
    if (response.success) {
      setResult(response.data);
      saveToHistory(formData, response.data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setError(response.error || 'Failed to generate prediction. Please verify connection to Python Machine Learning backend.');
    }
  };

  const handleRetryPrediction = () => {
    if (lastSubmittedFormData) {
      handleFormSubmit(lastSubmittedFormData);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecordFromHistory = (record) => {
    setResult(record.result);
    setActiveTab('form');
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // IF USER IS NOT LOGGED IN -> SHOW LOGIN / REGISTER GATEWAY FIRST
  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {loading && <PredictionLoadingModal currentStepIndex={loadingStepIndex} />}

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendOnline={isBackendOnline}
        theme={theme}
        setTheme={setTheme}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {!isBackendOnline && isBackendOnline !== null && (
          <div className="warning-banner">
            <AlertCircle size={20} />
            <div>
              <strong>FastAPI Backend Offline:</strong> Running in standalone fallback mode. Start backend with <code>python main.py</code> in <code>backend/</code> for real-time model inference.
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <div className="error-banner-content">
              <AlertCircle size={22} className="error-icon" />
              <div>
                <strong>Prediction Request Error</strong>
                <p>{error}</p>
              </div>
            </div>
            <div className="error-banner-actions">
              {lastSubmittedFormData && (
                <button type="button" className="retry-btn" onClick={handleRetryPrediction}>
                  <RefreshCw size={14} /> Retry Prediction
                </button>
              )}
              <button type="button" className="close-err-btn" onClick={() => setError(null)} aria-label="Dismiss error">
                <XCircle size={18} />
              </button>
            </div>
          </div>
        )}

        <div key={activeTab} className="tab-page-container">
          {/* PAGE 1: HOME / LANDING */}
          {activeTab === 'home' && (
            <HomePage onNavigate={setActiveTab} />
          )}

          {/* PAGE 2 & 3: PREDICT LOAN & RESULT */}
          {activeTab === 'form' && (
            <div className="form-result-wrapper">
              <LoanForm onSubmit={handleFormSubmit} isLoading={loading} />

              <div ref={resultRef}>
                {result && (
                  <ResultCard 
                    result={result} 
                    onReset={handleReset} 
                    onNavigate={setActiveTab}
                    onSave={() => saveToHistory(result.raw_data || {}, result)}
                  />
                )}
              </div>
            </div>
          )}

          {/* PAGE 4: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <ExecutiveDashboard 
              history={history} 
              onSelectRecord={handleSelectRecordFromHistory} 
              onNavigate={setActiveTab}
            />
          )}

          {/* PAGE 5: HISTORY */}
          {activeTab === 'history' && (
            <AssessmentHistory 
              onSelectRecord={handleSelectRecordFromHistory} 
              onNavigate={setActiveTab} 
            />
          )}

          {/* PAGE 6: MODEL INSIGHTS */}
          {activeTab === 'insights' && (
            <ModelInsights />
          )}

          {/* PAGE 6B: EDA DETAILS (SOP PAGE 9) */}
          {activeTab === 'eda' && (
            <EdaDetails />
          )}

          {/* PAGE 6C: MODEL DETAILS (SOP PAGE 8) */}
          {activeTab === 'model-info' && (
            <ModelDetails />
          )}

          {/* PAGE 7: ADMIN & MODEL MONITORING */}
          {activeTab === 'admin' && (
            <AdminModelMonitoring history={history} />
          )}

          {/* PAGE 8: HOW IT WORKS / ABOUT */}
          {activeTab === 'how-it-works' && (
            <PolicyGuidelines />
          )}
        </div>
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
