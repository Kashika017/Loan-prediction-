import React from 'react';
import { 
  BookOpen, 
  BrainCircuit, 
  Database, 
  Code, 
  AlertTriangle,
  Cpu,
  Server,
  Monitor
} from 'lucide-react';

export default function PolicyGuidelines() {
  const techStack = [
    { category: 'Frontend UI', name: 'React 19 + Vite', desc: 'Fast client-side rendering with glassmorphism UI', icon: <Monitor size={20} /> },
    { category: 'Backend API', name: 'Python FastAPI', desc: 'Asynchronous Python web framework on Port 8000', icon: <Server size={20} /> },
    { category: 'Machine Learning', name: 'Scikit-Learn + Pandas', desc: 'Ensemble Random Forest Classifier model', icon: <Cpu size={20} /> },
    { category: 'Data & Persistence', name: 'Local Cache & REST API', desc: 'Secure client history persistence & REST endpoints', icon: <Database size={20} /> }
  ];

  const howItWorksExplainer = [
    { title: 'What is Loan Prediction?', desc: 'Loan prediction uses predictive analytics to assess the probability that a loan applicant will default on their repayments or successfully fulfill their loan terms based on historical financial metrics.' },
    { title: 'How Machine Learning is Used', desc: 'Machine learning algorithms analyze non-linear relationships between applicant income, loan amount, credit score, and debt-to-income ratios that traditional static underwriting tables might miss.' },
    { title: 'Data Processing & Cleaning', desc: 'Raw financial parameters undergo categorical Label Encoding and numerical StandardScaler normalization to ensure impartial, zero-mean feature distribution before model input.' },
    { title: 'Feature Engineering', desc: 'Key financial ratios like Loan-to-Income (LTI) and Debt-to-Income (DTI) are calculated to enhance decision boundary precision.' },
    { title: 'Model Training & Evaluation', desc: 'The Random Forest Ensemble model is trained on thousands of validated loan records, achieving an 88.5% accuracy score and 0.92 ROC-AUC rating.' }
  ];

  return (
    <div className="policy-container">
      <div className="policy-header">
        <div className="policy-title-group">
          <div className="policy-icon">
            <BookOpen size={24} />
          </div>
          <div>
            <h2>How LoanAI Works & Technology Architecture</h2>
            <p>Educational breakdown of machine learning credit risk evaluation and technology stack</p>
          </div>
        </div>
      </div>

      {/* Explainer Grid */}
      <div className="policy-grid">
        {howItWorksExplainer.map((item, idx) => (
          <div key={idx} className="policy-card">
            <span className="card-badge prime-badge"><BrainCircuit size={12} /> Step {idx + 1}</span>
            <h3>{item.title}</h3>
            <p className="policy-desc">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Technology Stack Section */}
      <div className="policy-section">
        <h3 className="section-heading"><Code size={18} /> Technology Stack</h3>
        <p className="section-subtext">Verified technologies powering the LoanAI platform:</p>

        <div className="tech-stack-grid">
          {techStack.map((tech, idx) => (
            <div key={idx} className="tech-tile-card">
              <div className="tech-icon">{tech.icon}</div>
              <div className="tech-info">
                <span className="tech-cat">{tech.category}</span>
                <h4>{tech.name}</h4>
                <p>{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Project Disclaimer */}
      <div className="disclaimer-banner margin-top-lg">
        <AlertTriangle size={22} className="disclaimer-icon" />
        <div>
          <h4>Official Educational & Project Disclaimer</h4>
          <p>
            This system provides a machine-learning-based prediction for educational and informational purposes only. 
            It should not be treated as official financial advice, credit decisioning, or a legal guarantee of loan approval.
          </p>
        </div>
      </div>
    </div>
  );
}
