import React, { useState } from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, RefreshCcw, ArrowRight } from 'lucide-react';
import RiskGauge from './RiskGauge';

export default function WhatIfSandbox() {
  const [creditScore, setCreditScore] = useState(620);
  const [income, setIncome] = useState(60000);
  const [loanAmount, setLoanAmount] = useState(45000);
  const [dti, setDti] = useState(0.42);
  const [hasCoSigner, setHasCoSigner] = useState('No');
  const [monthsEmployed, setMonthsEmployed] = useState(18);

  const resetSandbox = () => {
    setCreditScore(620);
    setIncome(60000);
    setLoanAmount(45000);
    setDti(0.42);
    setHasCoSigner('No');
    setMonthsEmployed(18);
  };

  // Approximate Machine Learning Probability Simulation Formula based on feature weights
  const calculateSimulatedRisk = () => {
    let base = 0.50; // Starting baseline

    // Credit score impact: 720+ reduces risk significantly
    base -= (creditScore - 600) * 0.0018;

    // DTI impact: > 0.40 increases risk
    base += (dti - 0.30) * 0.7;

    // LTI impact: Loan / Income > 0.5 increases risk
    const lti = loanAmount / (income || 1);
    base += (lti - 0.4) * 0.25;

    // Co-signer impact
    if (hasCoSigner === 'Yes') {
      base -= 0.18;
    }

    // Employment history impact
    if (monthsEmployed >= 48) {
      base -= 0.08;
    } else if (monthsEmployed < 12) {
      base += 0.10;
    }

    const finalProb = Math.min(Math.max(base * 100, 3.5), 96.5);
    return finalProb;
  };

  const currentRiskProb = calculateSimulatedRisk();
  const isHigh = currentRiskProb >= 50;

  return (
    <div className="sandbox-container">
      <div className="sandbox-header">
        <div className="sandbox-title-group">
          <div className="sandbox-icon">
            <Sparkles size={24} />
          </div>
          <div>
            <h2>What-If Scenario Sandbox & Risk Optimizer</h2>
            <p>Modify applicant variables in real-time to discover path to loan approval</p>
          </div>
        </div>

        <button onClick={resetSandbox} className="action-btn secondary">
          <RefreshCcw size={15} /> Reset Sandbox
        </button>
      </div>

      <div className="sandbox-grid">
        {/* Left: Control Sliders */}
        <div className="sandbox-controls">
          <h3 className="section-heading">Applicant Variable Controls</h3>

          <div className="sandbox-group">
            <div className="slider-label-row">
              <label>Credit Score (300-850)</label>
              <span className={`slider-val ${creditScore >= 700 ? 'text-good' : ''}`}>{creditScore}</span>
            </div>
            <input
              type="range"
              min="300"
              max="850"
              step="5"
              value={creditScore}
              onChange={(e) => setCreditScore(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="sandbox-group">
            <div className="slider-label-row">
              <label>Annual Income ($)</label>
              <span className="slider-val">${income.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="15000"
              max="250000"
              step="5000"
              value={income}
              onChange={(e) => setIncome(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="sandbox-group">
            <div className="slider-label-row">
              <label>Requested Loan Amount ($)</label>
              <span className="slider-val">${loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="200000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="sandbox-group">
            <div className="slider-label-row">
              <label>Debt-to-Income (DTI) Ratio</label>
              <span className={`slider-val ${dti > 0.45 ? 'text-warn' : ''}`}>{(dti * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.01"
              value={dti}
              onChange={(e) => setDti(parseFloat(e.target.value))}
            />
          </div>

          <div className="sandbox-group">
            <div className="slider-label-row">
              <label>Has Co-Signer</label>
              <select
                value={hasCoSigner}
                onChange={(e) => setHasCoSigner(e.target.value)}
                className="sandbox-select"
              >
                <option value="No">No Co-Signer</option>
                <option value="Yes">Yes (Qualified Co-Signer)</option>
              </select>
            </div>
          </div>

          <div className="sandbox-group">
            <div className="slider-label-row">
              <label>Months Employed</label>
              <span className="slider-val">{monthsEmployed} mos</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="6"
              value={monthsEmployed}
              onChange={(e) => setMonthsEmployed(parseInt(e.target.value, 10))}
            />
          </div>
        </div>

        {/* Right: Live Simulated Gauge & Impact Analysis */}
        <div className="sandbox-output">
          <h3 className="section-heading">Simulated Default Risk Meter</h3>

          <RiskGauge score={currentRiskProb} isHighRisk={isHigh} />

          <div className={`sandbox-status-card ${isHigh ? 'high' : 'low'}`}>
            <div className="status-icon">
              {isHigh ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
            </div>
            <div>
              <h4>Simulated Status: {isHigh ? 'High Risk (Default Likely)' : 'Low Risk (Approval Likely)'}</h4>
              <p>
                {isHigh 
                  ? 'Applicant parameters currently exceed default risk tolerance.' 
                  : 'Applicant parameters fall within standard institutional approval guidelines.'}
              </p>
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="optimization-panel">
            <h4><Sparkles size={16} /> Approval Optimization Recommendations</h4>
            <ul className="suggestion-list">
              {hasCoSigner === 'No' && (
                <li onClick={() => setHasCoSigner('Yes')} className="clickable-suggestion">
                  <ArrowRight size={14} /> Add a qualified co-signer <strong>(-18% Risk Reduction)</strong>
                </li>
              )}
              {creditScore < 700 && (
                <li onClick={() => setCreditScore(720)} className="clickable-suggestion">
                  <ArrowRight size={14} /> Improve credit score to 720+ <strong>(-18% Risk Reduction)</strong>
                </li>
              )}
              {loanAmount > 25000 && (
                <li onClick={() => setLoanAmount(25000)} className="clickable-suggestion">
                  <ArrowRight size={14} /> Reduce requested loan amount to $25,000 <strong>(-12% Risk Reduction)</strong>
                </li>
              )}
              {dti > 0.35 && (
                <li onClick={() => setDti(0.30)} className="clickable-suggestion">
                  <ArrowRight size={14} /> Lower DTI ratio to 30% <strong>(-9% Risk Reduction)</strong>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
