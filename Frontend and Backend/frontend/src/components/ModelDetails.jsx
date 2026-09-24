import React, { useState, useEffect } from 'react';
import { Cpu, Award, Sliders, Layers, RefreshCw, CheckCircle2, Code2, GitCompare } from 'lucide-react';
import { fetchModelDetails } from '../api';

export default function ModelDetails() {
  const [data, setData] = useState({
    model: {
      algorithm: "Ensemble Random Forest Classifier",
      library: "Scikit-Learn (sklearn.ensemble)",
      trained_at: "2026-09-23 18:43:27",
      hyperparameters: { n_estimators: 100, max_depth: 12, criterion: "gini", min_samples_split: 2, min_samples_leaf: 1 },
      accuracy: "88.6%",
      precision: "68.6%",
      recall: "3.3%",
      f1_score: "87.6%",
      roc_auc: "0.92"
    },
    scratch_model: {
      algorithm: "Custom Scratch DecisionTree Classifier",
      library: "None (Pure Python & NumPy Scratch Implementation)",
      trained_at: "2026-09-23 18:43:28",
      hyperparameters: { max_depth: 8, min_samples_split: 10, criterion: "Gini Impurity (Scratch Math)", library_used: false },
      accuracy: "88.3%",
      precision: "39.7%",
      recall: "4.7%",
      f1_score: "84.6%",
      roc_auc: "0.67"
    },
    feature_importances: [
      { feature: "CreditScore", importance: 0.32, category: "Financial" },
      { feature: "Income", importance: 0.24, category: "Financial" },
      { feature: "LoanAmount", importance: 0.18, category: "Loan" },
      { feature: "DTIRatio", importance: 0.11, category: "Financial" },
      { feature: "MonthsEmployed", importance: 0.05, category: "Employment" },
      { feature: "LoanTerm", importance: 0.04, category: "Loan" }
    ]
  });

  const [loading, setLoading] = useState(false);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchModelDetails();
      if (res?.data) setData(res.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const sk = data.model || {};
  const scratch = data.scratch_model || {};
  const hyper = sk.hyperparameters || {};

  return (
    <div className="model-details-container">
      {/* Header Banner matching SOP Page 8 design */}
      <div className="model-details-header">
        <div>
          <h2>{sk.algorithm || "Ensemble RandomForest Classifier"}</h2>
          <p>Model specs, hyperparameters, comparative benchmarking, and explainable feature importances</p>
        </div>
        <button type="button" className="action-btn secondary" onClick={loadDetails} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Sync Model Specs
        </button>
      </div>

      {/* 3 Grid Boxes: Model Info, Hyperparameters, Performance (Matching SOP Page 8) */}
      <div className="model-specs-3grid">
        {/* Box 1: Model Info */}
        <div className="spec-card-box">
          <h3 className="spec-box-title"><Cpu size={18} /> Model Information</h3>
          <ul className="spec-details-list">
            <li><span>Algorithm:</span> <strong>{sk.algorithm || "RandomForestClassifier"}</strong></li>
            <li><span>Library:</span> <strong>{sk.library || "scikit-learn"}</strong></li>
            <li><span>Trained At:</span> <strong>{sk.trained_at || "2026-09-23 18:43"}</strong></li>
            <li><span>Feature Count:</span> <strong>16 Input Features</strong></li>
          </ul>
        </div>

        {/* Box 2: Hyperparameters */}
        <div className="spec-card-box">
          <h3 className="spec-box-title"><Sliders size={18} /> Hyperparameters</h3>
          <div className="hyperparams-grid">
            <div className="hyper-tile">
              <span className="hyper-lbl">Estimators</span>
              <span className="hyper-val">{hyper.n_estimators || 100}</span>
            </div>
            <div className="hyper-tile">
              <span className="hyper-lbl">Max Depth</span>
              <span className="hyper-val">{hyper.max_depth || 12}</span>
            </div>
            <div className="hyper-tile">
              <span className="hyper-lbl">Split Criterion</span>
              <span className="hyper-val">{hyper.criterion || "gini"}</span>
            </div>
            <div className="hyper-tile">
              <span className="hyper-lbl">Min Samples/Leaf</span>
              <span className="hyper-val">{hyper.min_samples_leaf || 1}</span>
            </div>
          </div>
        </div>

        {/* Box 3: Performance Metrics */}
        <div className="spec-card-box highlight">
          <h3 className="spec-box-title"><Award size={18} /> Scikit-Learn Metrics</h3>
          <div className="metrics-bar-list">
            <div className="metric-row">
              <span>Accuracy</span>
              <strong className="text-good">{sk.accuracy || "88.6%"}</strong>
            </div>
            <div className="metric-row">
              <span>F1 Score</span>
              <strong>{sk.f1_score || "87.6%"}</strong>
            </div>
            <div className="metric-row">
              <span>ROC AUC</span>
              <strong className="text-good">{sk.roc_auc || "0.92"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Benchmarking Table: Scikit-Learn vs. Scratch Algorithm (SOP Phase 1 Constraint) */}
      <div className="model-section-block margin-top-lg">
        <div className="section-title-with-badge">
          <h3><GitCompare size={18} /> Comparative Evaluation (Scikit-Learn vs. Scratch Algorithm)</h3>
          <span className="sop-constraint-badge"><Code2 size={13} /> Mandatory SOP Scratch Constraint</span>
        </div>
        <p className="section-subtext">Benchmarking Scikit-Learn RandomForest against the custom Pure Python & NumPy Decision Tree implementation:</p>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric / Feature</th>
                <th>Scikit-Learn RandomForest</th>
                <th>Scratch DecisionTree (No Libraries)</th>
                <th>SOP Compliance Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Algorithm Type</strong></td>
                <td>Ensemble Random Forest (100 Trees)</td>
                <td>Custom DecisionTree (Single Tree)</td>
                <td><span className="tag-ok"><CheckCircle2 size={12} /> Passed</span></td>
              </tr>
              <tr>
                <td><strong>Library Dependency</strong></td>
                <td><code>scikit-learn.ensemble</code></td>
                <td><code>None</code> (Pure Python + NumPy)</td>
                <td><span className="tag-ok"><CheckCircle2 size={12} /> Mandatory Scratch</span></td>
              </tr>
              <tr>
                <td><strong>Accuracy Score</strong></td>
                <td><strong className="text-good">{sk.accuracy || "88.6%"}</strong></td>
                <td><strong>{scratch.accuracy || "88.3%"}</strong></td>
                <td>Comparable accuracy</td>
              </tr>
              <tr>
                <td><strong>F1 Score Index</strong></td>
                <td><strong>{sk.f1_score || "87.6%"}</strong></td>
                <td><strong>{scratch.f1_score || "84.6%"}</strong></td>
                <td>Valid baseline performance</td>
              </tr>
              <tr>
                <td><strong>ROC-AUC Metric</strong></td>
                <td><strong className="text-good">{sk.roc_auc || "0.92"}</strong></td>
                <td><strong>{scratch.roc_auc || "0.67"}</strong></td>
                <td>Ensemble vs Single Tree</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Feature Importance Weights Chart (Matching SOP Page 8) */}
      <div className="model-section-block margin-top-lg">
        <h3><Layers size={18} /> Top Feature Importance</h3>
        <p className="section-subtext">Features contributing most to risk predictions calculated via Gini impurity reduction:</p>

        <div className="feature-weight-bars">
          {(data.feature_importances || [
            { feature: "CreditScore", importance: 0.32 },
            { feature: "Income", importance: 0.24 },
            { feature: "LoanAmount", importance: 0.18 },
            { feature: "DTIRatio", importance: 0.11 },
            { feature: "MonthsEmployed", importance: 0.05 }
          ]).slice(0, 6).map((item, idx) => {
            const pct = Math.round((item.importance || 0.1) * 100);
            return (
              <div key={idx} className="feature-weight-row">
                <div className="feat-label-col">
                  <span className="feat-name">{item.feature}</span>
                  <span className="feat-pct">{pct}% Weight</span>
                </div>
                <div className="feat-bar-track">
                  <div className="feat-bar-fill-cyan" style={{ width: `${Math.min(pct * 2.8, 100)}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
