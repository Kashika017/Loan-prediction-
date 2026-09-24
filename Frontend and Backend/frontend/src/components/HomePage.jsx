import React from 'react';
import { 
  BrainCircuit, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Database, 
  PieChart, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  FileText, 
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';

export default function HomePage({ onNavigate, stats = {} }) {
  const defaultStats = {
    accuracy: '88.5%',
    predictions: '12,450+',
    features: '16 Features',
    speed: '< 50ms',
    ...stats
  };

  return (
    <div className="home-page">
      {/* Premium Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} className="badge-sparkle" />
              <span>Next-Gen FinTech Risk Intelligence</span>
            </div>
            
            <h1 className="hero-headline">
              Predict Loan Eligibility with <span className="text-gradient">Machine Learning</span>
            </h1>
            
            <p className="hero-subtitle">
              Analyze applicant and financial information and receive an AI-powered loan eligibility prediction in seconds with transparent feature insights.
            </p>
            
            <div className="hero-actions">
              <button className="btn-primary hero-btn" onClick={() => onNavigate('form')}>
                Check Eligibility <ArrowRight size={18} />
              </button>
              <button className="btn-secondary hero-btn" onClick={() => onNavigate('how-it-works')}>
                How It Works
              </button>
            </div>

            <div className="hero-trust-strip">
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>Enterprise ML Security</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>Instant API Inference</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>FCRA Compliant Rules</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-card">
            <div className="visual-header">
              <div className="visual-title-group">
                <BrainCircuit size={22} className="visual-logo" />
                <div>
                  <h4>LoanAI Live Risk Engine</h4>
                  <p>Model: Random Forest Classifier v1.0</p>
                </div>
              </div>
              <span className="live-pulse-tag"><Activity size={12} /> Active</span>
            </div>

            <div className="visual-score-card">
              <div className="score-top">
                <span className="score-label">Sample Prediction Score</span>
                <span className="score-badge approved">Likely Approved</span>
              </div>
              <div className="score-value">87.4%</div>
              <div className="score-subtext">Low Risk of Default &bull; High Credit Score (780)</div>
              
              <div className="hero-progress-bar">
                <div className="hero-progress-fill" style={{ width: '87.4%' }}></div>
              </div>
            </div>

            <div className="visual-metrics-grid">
              <div className="mini-stat">
                <span className="mini-label">DTI Ratio</span>
                <span className="mini-val text-good">0.18 (Optimal)</span>
              </div>
              <div className="mini-stat">
                <span className="mini-label">Income / Loan</span>
                <span className="mini-val">$110K / $25K</span>
              </div>
              <div className="mini-stat">
                <span className="mini-label">Model Confidence</span>
                <span className="mini-val">94.2%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configurable Statistics Cards */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper cyan">
              <Award size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{defaultStats.accuracy}</div>
              <div className="stat-label">Model Accuracy</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper blue">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{defaultStats.predictions}</div>
              <div className="stat-label">Total Predictions</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper purple">
              <Sliders size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{defaultStats.features}</div>
              <div className="stat-label">Analyzed Features</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper green">
              <Zap size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{defaultStats.speed}</div>
              <div className="stat-label">Real-Time Prediction</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works 4-Step Process */}
      <section className="process-section">
        <div className="section-header">
          <span className="section-badge">Workflow</span>
          <h2>How LoanAI Works</h2>
          <p>Streamlined four-step machine learning evaluation pipeline</p>
        </div>

        <div className="process-grid">
          <div className="process-card">
            <div className="step-num">01</div>
            <FileText size={28} className="step-icon" />
            <h3>Enter Applicant Details</h3>
            <p>Input applicant demographic, income, loan request, and credit score parameters into the form.</p>
          </div>

          <div className="process-card">
            <div className="step-num">02</div>
            <Database size={28} className="step-icon" />
            <h3>Process & Scale Data</h3>
            <p>Categorical encoders and StandardScaler normalize numerical and categorical variables in real-time.</p>
          </div>

          <div className="process-card">
            <div className="step-num">03</div>
            <BrainCircuit size={28} className="step-icon" />
            <h3>ML Prediction Engine</h3>
            <p>RandomForest Classifier computes approval probability based on historical training patterns.</p>
          </div>

          <div className="process-card">
            <div className="step-num">04</div>
            <PieChart size={28} className="step-icon" />
            <h3>View Result & Insights</h3>
            <p>Receive immediate risk classification, confidence score, and feature importance SHAP metrics.</p>
          </div>
        </div>
      </section>

      {/* Why LoanAI Cards */}
      <section className="why-section">
        <div className="section-header">
          <span className="section-badge">Key Capabilities</span>
          <h2>Why Choose LoanAI?</h2>
          <p>Built for financial institutions, underwriters, and educational demonstrations</p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon blue"><BrainCircuit size={24} /></div>
            <h3>Machine Learning Powered</h3>
            <p>Trained on thousands of real historical financial records using Ensemble Random Forest trees.</p>
          </div>

          <div className="why-card">
            <div className="why-icon cyan"><Zap size={24} /></div>
            <h3>Fast Sub-Second Inference</h3>
            <p>High-performance FastAPI microservice delivers predictions in under 50 milliseconds.</p>
          </div>

          <div className="why-card">
            <div className="why-icon green"><ShieldCheck size={24} /></div>
            <h3>Data-Driven Accuracy</h3>
            <p>Rigorously evaluates debt-to-income ratios, credit history, income, and loan-to-income metrics.</p>
          </div>

          <div className="why-card">
            <div className="why-icon purple"><PieChart size={24} /></div>
            <h3>Transparent Feature Insights</h3>
            <p>No black-box decisions. View exact feature weights and explainable AI metrics for every score.</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to check your loan eligibility?</h2>
          <p>Get instant AI predictions, detailed risk metrics, and underwriting recommendations in seconds.</p>
          <button className="btn-primary cta-btn" onClick={() => onNavigate('form')}>
            Start Prediction <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
