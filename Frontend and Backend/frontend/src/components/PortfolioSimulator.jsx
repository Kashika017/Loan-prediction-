import React, { useState } from 'react';
import { Sliders, AlertTriangle, ShieldAlert, BarChart2, CheckCircle2, RotateCcw } from 'lucide-react';

const SAMPLE_PORTFOLIO = [
  { id: 'LN-1001', name: 'Prime Auto Loan', age: 38, income: 95000, loanAmount: 25000, creditScore: 760, dti: 0.22, baseProb: 0.08, purpose: 'Auto' },
  { id: 'LN-1002', name: 'Small Business Expansion', age: 45, income: 140000, loanAmount: 85000, creditScore: 710, dti: 0.35, baseProb: 0.18, purpose: 'Business' },
  { id: 'LN-1003', name: 'Home Renovation', age: 29, income: 62000, loanAmount: 40000, creditScore: 630, dti: 0.42, baseProb: 0.54, purpose: 'Home' },
  { id: 'LN-1004', name: 'Higher Education Refi', age: 24, income: 48000, loanAmount: 20000, creditScore: 680, dti: 0.28, baseProb: 0.25, purpose: 'Education' },
  { id: 'LN-1005', name: 'Subprime Personal Loan', age: 23, income: 28000, loanAmount: 35000, creditScore: 540, dti: 0.65, baseProb: 0.82, purpose: 'Other' },
  { id: 'LN-1006', name: 'Commercial Mortgage Prep', age: 52, income: 210000, loanAmount: 180000, creditScore: 790, dti: 0.19, baseProb: 0.05, purpose: 'Home' },
  { id: 'LN-1007', name: 'Consumer Refinance', age: 34, income: 55000, loanAmount: 30000, creditScore: 610, dti: 0.48, baseProb: 0.61, purpose: 'Other' },
  { id: 'LN-1008', name: 'Tech Startup Loan', age: 31, income: 115000, loanAmount: 90000, creditScore: 720, dti: 0.31, baseProb: 0.22, purpose: 'Business' },
];

export default function PortfolioSimulator() {
  const [rateShock, setRateShock] = useState(0); // +0% to +5%
  const [incomeShock, setIncomeShock] = useState(0); // -0% to -25%
  const [dtiInflation, setDtiInflation] = useState(0); // +0% to +20%

  const resetStressTest = () => {
    setRateShock(0);
    setIncomeShock(0);
    setDtiInflation(0);
  };

  // Calculate stress impact multiplier
  // Base formula: Stressed Prob = Base Prob + (rateShock * 0.04) + (incomeShock * 0.015) + (dtiInflation * 0.012)
  const calculateStressedLoan = (loan) => {
    const stressMultiplier = 1 + (rateShock * 0.08) + (incomeShock * 0.02) + (dtiInflation * 0.015);
    const stressedProb = Math.min(Math.max(loan.baseProb * stressMultiplier, 0), 0.99);
    const isStressedDefault = stressedProb >= 0.50;
    const expectedLoss = loan.loanAmount * stressedProb;

    return {
      ...loan,
      stressedProb,
      isStressedDefault,
      expectedLoss
    };
  };

  const processedLoans = SAMPLE_PORTFOLIO.map(calculateStressedLoan);

  const totalExposure = processedLoans.reduce((sum, item) => sum + item.loanAmount, 0);
  const baseTotalLoss = processedLoans.reduce((sum, item) => sum + (item.loanAmount * item.baseProb), 0);
  const stressedTotalLoss = processedLoans.reduce((sum, item) => sum + item.expectedLoss, 0);
  const lossDelta = stressedTotalLoss - baseTotalLoss;
  const stressedHighRiskCount = processedLoans.filter(l => l.isStressedDefault).length;

  return (
    <div className="portfolio-card">
      <div className="portfolio-header">
        <div className="portfolio-title-group">
          <div className="portfolio-icon">
            <Sliders size={24} />
          </div>
          <div>
            <h2>Macro-Economic Portfolio Stress Tester</h2>
            <p>Simulate portfolio credit loss sensitivity under adverse economic shock scenarios</p>
          </div>
        </div>

        <button onClick={resetStressTest} className="action-btn secondary">
          <RotateCcw size={15} /> Reset Shocks
        </button>
      </div>

      {/* Stress Controls */}
      <div className="stress-controls-panel">
        <h3 className="panel-title">
          <AlertTriangle size={16} /> Economic Stress Scenario Variables
        </h3>

        <div className="controls-grid">
          <div className="slider-group">
            <div className="slider-label-row">
              <span>Interest Rate Shock</span>
              <span className="slider-val text-warn">+{rateShock.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={rateShock}
              onChange={(e) => setRateShock(parseFloat(e.target.value))}
            />
            <span className="slider-hint">Simulates Fed rate hikes & borrowing cost pressure</span>
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span>Income / Macro Downturn</span>
              <span className="slider-val text-warn">-{incomeShock}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={incomeShock}
              onChange={(e) => setIncomeShock(parseInt(e.target.value, 10))}
            />
            <span className="slider-hint">Simulates recessionary wage compression</span>
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span>DTI Inflation Burden</span>
              <span className="slider-val text-warn">+{dtiInflation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={dtiInflation}
              onChange={(e) => setDtiInflation(parseInt(e.target.value, 10))}
            />
            <span className="slider-hint">Simulates cost-of-living debt expansion</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="portfolio-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Portfolio Principal</span>
          <span className="kpi-val">${totalExposure.toLocaleString()}</span>
          <span className="kpi-sub">8 Assessed Loan Assets</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Baseline Expected Loss</span>
          <span className="kpi-val">${Math.round(baseTotalLoss).toLocaleString()}</span>
          <span className="kpi-sub">{((baseTotalLoss / totalExposure) * 100).toFixed(1)}% Base Loss Rate</span>
        </div>

        <div className="kpi-card stressed">
          <span className="kpi-label">Stressed Expected Loss</span>
          <span className="kpi-val text-warn">${Math.round(stressedTotalLoss).toLocaleString()}</span>
          <span className="kpi-sub text-warn">+{((lossDelta / totalExposure) * 100).toFixed(1)}% Risk Delta</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Stressed High Risk Assets</span>
          <span className="kpi-val">{stressedHighRiskCount} / 8</span>
          <span className="kpi-sub">{((stressedHighRiskCount / 8) * 100).toFixed(0)}% Portfolio Default Flag</span>
        </div>
      </div>

      {/* Portfolio Assets Table */}
      <div className="portfolio-table-wrapper">
        <h3 className="section-heading">
          <BarChart2 size={18} /> Asset-Level Stress Sensitivity Matrix
        </h3>
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Asset Description</th>
              <th>Principal ($)</th>
              <th>Credit Score</th>
              <th>Base Default Prob.</th>
              <th>Stressed Default Prob.</th>
              <th>Loss Impact ($)</th>
              <th>Stressed Status</th>
            </tr>
          </thead>
          <tbody>
            {processedLoans.map(loan => (
              <tr key={loan.id}>
                <td className="ref-cell">{loan.id}</td>
                <td><strong>{loan.name}</strong> ({loan.purpose})</td>
                <td className="amount-cell">${loan.loanAmount.toLocaleString()}</td>
                <td>
                  <span className={`credit-badge ${loan.creditScore >= 700 ? 'good' : 'fair'}`}>
                    {loan.creditScore}
                  </span>
                </td>
                <td>{(loan.baseProb * 100).toFixed(1)}%</td>
                <td>
                  <strong className={loan.stressedProb >= 0.5 ? 'text-warn' : ''}>
                    {(loan.stressedProb * 100).toFixed(1)}%
                  </strong>
                </td>
                <td className="amount-cell">${Math.round(loan.expectedLoss).toLocaleString()}</td>
                <td>
                  <span className={`risk-pill-sm ${loan.isStressedDefault ? 'high' : 'low'}`}>
                    {loan.isStressedDefault ? <ShieldAlert size={12} /> : <CheckCircle2 size={12} />}
                    {loan.isStressedDefault ? 'High Risk' : 'Pass'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
