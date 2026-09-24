import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, Shield, Info, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { fetchEdaDetails } from '../api';

export default function EdaDetails() {
  const [edaData, setEdaData] = useState({
    dataset_source: "Kaggle Loan Default Prediction Dataset (Banking)",
    raw_records: 255347,
    rows_removed: 0,
    rows_removed_pct: "0.0%",
    final_records: 255347,
    understanding: "Loan Default Prediction is a binary classification dataset designed to predict whether an applicant will default on their credit obligation based on demographic, financial, and credit history features.",
    ideal_ranges: [
      { parameter: "Credit Score", range: "650 - 850 (Clean repayment history)" },
      { parameter: "Debt-to-Income (DTI)", range: "< 0.35 (35% threshold)" },
      { parameter: "Monthly Income", range: "> $4,500 gross income" },
      { parameter: "Loan-to-Income Ratio", range: "< 0.40x annual income" },
      { parameter: "Interest Rate", range: "5.0% - 12.5% prime rate" }
    ]
  });

  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchEdaDetails();
      if (res?.data) setEdaData(res.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="eda-details-container">
      {/* Top Banner Header matching SOP Page 9 layout */}
      <div className="eda-header-strip">
        <div>
          <span className="eda-badge"><Database size={14} /> Dataset Source</span>
          <h2>EDA & Data Preprocessing Details</h2>
          <p className="eda-source-desc">
            The dataset is sourced from Kaggle Loan Default Prediction dataset with <strong>{(edaData.raw_records || 255347).toLocaleString()}</strong> historical records.
          </p>
        </div>
        <button type="button" className="action-btn secondary" onClick={loadData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Refresh Stats
        </button>
      </div>

      {/* 3 Summary Metric Cards: Raw Records, Rows Removed, Final Records */}
      <div className="eda-summary-cards-grid">
        <div className="eda-stat-card">
          <span className="stat-card-label">Raw Records</span>
          <span className="stat-card-sub">Before cleaning</span>
          <div className="stat-card-val">{(edaData.raw_records || 255347).toLocaleString()}</div>
        </div>

        <div className="eda-stat-card">
          <span className="stat-card-label">Rows Removed</span>
          <span className="stat-card-sub">{edaData.rows_removed_pct || '0.0%'} missing/outliers</span>
          <div className="stat-card-val">{(edaData.rows_removed || 0).toLocaleString()}</div>
        </div>

        <div className="eda-stat-card highlight">
          <span className="stat-card-label">Final Clean Records</span>
          <span className="stat-card-sub">Used for model training</span>
          <div className="stat-card-val text-cyan">{(edaData.final_records || 255347).toLocaleString()}</div>
        </div>
      </div>

      {/* Two Column Layout matching SOP Page 9 design */}
      <div className="eda-content-grid">
        {/* Left Column: Understanding & Guidelines */}
        <div className="eda-card-block">
          <h3><Info size={18} /> Understanding Loan Default Prediction</h3>
          <p className="eda-block-text">
            Loan Default Prediction analyzes creditworthiness to assist financial institutions in minimizing risk while maximizing loan approval efficiency.
          </p>
          <ul className="eda-points-list">
            <li><strong>Impact:</strong> Reduces non-performing asset (NPA) exposure by early identification of high-risk applicants.</li>
            <li><strong>Prevention:</strong> Early detection of adverse credit indicators (low FICO score, high DTI ratio, past defaults).</li>
            <li><strong>Model Role:</strong> Machine Learning evaluates historical applicant parameters to calculate default risk probabilities in real time.</li>
          </ul>

          <div className="disclaimer-note-box">
            <Shield size={16} />
            <span>Predictions are designed for risk evaluation decision-support. Final underwriting involves institutional policies.</span>
          </div>
        </div>

        {/* Right Column: Ideal Healthy Ranges */}
        <div className="eda-card-block">
          <h3><SlidersHorizontal size={18} /> Target Feature Healthy Ranges</h3>
          <p className="eda-block-text">Common target ranges observed across low-risk applicants:</p>

          <div className="ranges-table-wrapper">
            <table className="ranges-table">
              <thead>
                <tr>
                  <th>Financial Feature</th>
                  <th>Ideal Target Range</th>
                </tr>
              </thead>
              <tbody>
                {(edaData.ideal_ranges || [
                  { parameter: "Credit Score", range: "650 - 850 (Clean credit history)" },
                  { parameter: "Debt-to-Income (DTI)", range: "< 0.35 (35% threshold)" },
                  { parameter: "Monthly Income", range: "> $4,500 gross income" },
                  { parameter: "Loan-to-Income Ratio", range: "< 0.40x annual income" },
                  { parameter: "Interest Rate", range: "5.0% - 12.5% prime rate" }
                ]).map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.parameter}</strong></td>
                    <td><span className="healthy-chip"><CheckCircle2 size={13} /> {row.range || row.healthy}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
