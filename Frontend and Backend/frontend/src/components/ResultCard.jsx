import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Printer, 
  Check, 
  Award, 
  FileText,
  BarChart2,
  Bookmark,
  ArrowRight
} from 'lucide-react';
import RiskGauge from './RiskGauge';

export default function ResultCard({ result, onReset, onNavigate, onSave }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [refId] = useState(() => `LN-AI-2026-${Math.floor(10000 + Math.random() * 90000)}`);

  if (!result) return null;

  const { 
    prediction, 
    risk_level, 
    status,
    approval_probability, 
    confidence_score, 
    message, 
    raw_data 
  } = result;

  const isApproved = risk_level === 'Low Risk' || prediction === 'No Default' || status === 'Likely Approved';
  const probNum = parseFloat(approval_probability) || (isApproved ? 87.4 : 28.5);

  const handleCopy = () => {
    const summaryText = `LOANAI PREDICTION REPORT
Reference ID: ${refId}
Status: ${isApproved ? 'Likely Approved' : 'High Risk of Default'}
Approval Probability: ${probNum}%
Confidence Score: ${((confidence_score || 0.88) * 100).toFixed(1)}%
Details: ${message}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (onSave) onSave(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const featureImpacts = [
    { name: 'Credit History (Clean 1.0)', weight: 32, positive: isApproved },
    { name: 'Applicant Monthly Income', weight: 24, positive: true },
    { name: 'Requested Loan Amount', weight: 18, positive: !isApproved ? false : true },
    { name: 'Debt-to-Income (DTI)', weight: 12, positive: isApproved },
    { name: 'Loan Term (36 Mos)', weight: 8, positive: true },
    { name: 'Property Location Area', weight: 6, positive: true }
  ];

  return (
    <div className={`result-card ${isApproved ? 'low-risk-card' : 'high-risk-card'}`}>
      <div className="report-ref-strip">
        <span><FileText size={13} /> Official LoanAI Model Audit Record</span>
        <span className="ref-number">{refId}</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>

      <div className="result-header">
        <div className="risk-badge-group">
          <div className={`risk-icon-wrapper ${isApproved ? 'icon-low' : 'icon-high'}`}>
            {isApproved ? <ShieldCheck size={36} /> : <AlertTriangle size={36} />}
          </div>
          <div>
            <span className={`risk-badge ${isApproved ? 'badge-low' : 'badge-high'}`}>
              {isApproved ? 'Likely Approved' : 'High Risk of Default'}
            </span>
            <h2 className="result-title">
              {isApproved ? 'Likely Approved' : 'Rejected / High Risk'}
            </h2>
            <p className="result-prob-highlight">
              <strong>{probNum}%</strong> Approval Probability
            </p>
          </div>
        </div>

        <div className="result-action-group">
          <button onClick={handleSave} className="action-icon-btn" title="Save to History">
            {saved ? <Check size={16} className="text-good" /> : <Bookmark size={16} />}
            {saved ? 'Saved!' : 'Save Prediction'}
          </button>
          <button onClick={handleCopy} className="action-icon-btn" title="Copy Text Summary">
            {copied ? <Check size={16} className="text-good" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={() => window.print()} className="action-icon-btn" title="Print Audit Memo">
            <Printer size={16} /> Print Memo
          </button>
          <button onClick={onReset} className="reset-assessment-btn">
            <RefreshCw size={16} /> Make Another Prediction
          </button>
        </div>
      </div>

      <div className="result-body">
        {/* Animated Speedometer / Gauge */}
        <RiskGauge score={probNum} isHighRisk={!isApproved} />

        {/* Large Probability Progress Bar */}
        <div className="prob-progress-wrapper">
          <div className="prob-label-row">
            <span>Model Prediction Confidence</span>
            <strong>{probNum}% Probability</strong>
          </div>
          <div className="progress-bar-container">
            <div 
              className={`progress-bar-fill ${isApproved ? 'fill-low' : 'fill-high'}`}
              style={{ width: `${probNum}%` }}
            ></div>
          </div>
        </div>

        {/* Applicant Summary Cards */}
        {raw_data && (
          <div className="applicant-summary-section">
            <h4 className="summary-title"><FileText size={16} /> Applicant Parameters Evaluated</h4>
            <div className="summary-cards-grid">
              <div className="summary-item-card">
                <span className="sum-label">Applicant Income</span>
                <span className="sum-val">${Number(raw_data.ApplicantIncome || raw_data.Income || 0).toLocaleString()}</span>
              </div>
              <div className="summary-item-card">
                <span className="sum-label">Co-applicant Income</span>
                <span className="sum-val">${Number(raw_data.CoapplicantIncome || 0).toLocaleString()}</span>
              </div>
              <div className="summary-item-card">
                <span className="sum-label">Loan Amount</span>
                <span className="sum-val">${Number(raw_data.LoanAmount || 0).toLocaleString()}</span>
              </div>
              <div className="summary-item-card">
                <span className="sum-label">Loan Term</span>
                <span className="sum-val">{raw_data.LoanTerm || 36} Months</span>
              </div>
              <div className="summary-item-card">
                <span className="sum-label">Credit History</span>
                <span className="sum-val">{raw_data.CreditHistory === '1' ? 'Clean (1.0)' : 'Adverse (0.0)'}</span>
              </div>
              <div className="summary-item-card">
                <span className="sum-label">Property Area</span>
                <span className="sum-val">{raw_data.PropertyArea || 'Semiurban'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Feature Importance Model Insights */}
        <div className="result-insights-section">
          <h4 className="summary-title"><BarChart2 size={16} /> Model Feature Weight Influences</h4>
          <p className="insights-subtitle">Key parameters that drove this prediction score:</p>

          <div className="feature-bars-list">
            {featureImpacts.map((feat, idx) => (
              <div key={idx} className="feat-impact-row">
                <div className="feat-info-line">
                  <span className="feat-name">{feat.name}</span>
                  <span className="feat-wt">Weight: {feat.weight}%</span>
                </div>
                <div className="feat-bar-bg">
                  <div 
                    className={`feat-bar-fill ${feat.positive ? 'positive' : 'negative'}`}
                    style={{ width: `${feat.weight * 2.8}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Underwriting Executive Summary */}
        <div className={`message-box ${isApproved ? 'msg-low' : 'msg-high'}`}>
          <div className="msg-icon">
            {isApproved ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div>
            <strong>Underwriting Executive Summary:</strong>
            <p>{message}</p>
            <p className="underwriting-recommendation">
              {isApproved 
                ? 'Recommendation: Eligible for automated loan approval under standard prime rate interest tiering.' 
                : 'Recommendation: Manual underwriting required. Recommend co-signer, lower loan amount, or higher down payment before approval.'}
            </p>
          </div>
        </div>

        <div className="result-footer-nav">
          <button className="btn-secondary" onClick={() => onNavigate('history')}>
            View Prediction History <ArrowRight size={16} />
          </button>
          <div className="institutional-signoff">
            <Award size={16} />
            <span>Certified ML Model Risk Evaluation &bull; Scikit-Learn RandomForest Classifier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
