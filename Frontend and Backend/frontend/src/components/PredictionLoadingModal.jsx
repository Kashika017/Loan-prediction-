import React from 'react';
import { CheckCircle2, Loader2, Cpu, ShieldCheck, BarChart3, Binary } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: 'Validating Data',
    description: 'Checking applicant inputs, financial parameters, and boundary conditions...',
    icon: ShieldCheck
  },
  {
    id: 2,
    title: 'Processing Features',
    description: 'Normalizing numerical values, encoding categorical variables, computing DTI & LTI ratios...',
    icon: Binary
  },
  {
    id: 3,
    title: 'Running ML Model',
    description: 'Executing Scikit-Learn Random Forest ensemble inference across 100 decision trees...',
    icon: Cpu
  },
  {
    id: 4,
    title: 'Generating Prediction',
    description: 'Calculating confidence probability score & synthesizing explainable AI feature weights...',
    icon: BarChart3
  }
];

export default function PredictionLoadingModal({ currentStepIndex = 0 }) {
  const progressPercent = Math.min(Math.round(((currentStepIndex + 1) / STEPS.length) * 100), 100);

  return (
    <div className="prediction-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="loading-title">
      <div className="prediction-modal-card">
        {/* Modal Header */}
        <div className="prediction-modal-header">
          <div className="ai-chip-badge">
            <span className="pulse-dot"></span>
            AI Inference Pipeline Active
          </div>
          <h3 id="loading-title" className="prediction-modal-title">
            Evaluating Applicant Profile
          </h3>
          <p className="prediction-modal-subtitle">
            Our Machine Learning model is analyzing your loan application parameters in real time.
          </p>
        </div>

        {/* Dynamic Overall Progress Bar */}
        <div className="modal-progress-container">
          <div className="modal-progress-label">
            <span>Pipeline Progress</span>
            <span className="progress-value">{progressPercent}%</span>
          </div>
          <div className="modal-progress-track">
            <div 
              className="modal-progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Steps List */}
        <div className="prediction-steps-list">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;

            let stepStatusClass = 'pending';
            if (isCompleted) stepStatusClass = 'completed';
            if (isActive) stepStatusClass = 'active';

            return (
              <div key={step.id} className={`prediction-step-item ${stepStatusClass}`}>
                <div className="step-icon-wrapper">
                  {isCompleted ? (
                    <div className="step-icon completed-icon">
                      <CheckCircle2 size={20} />
                    </div>
                  ) : isActive ? (
                    <div className="step-icon active-icon">
                      <Loader2 size={20} className="spin-anim" />
                    </div>
                  ) : (
                    <div className="step-icon pending-icon">
                      <Icon size={18} />
                    </div>
                  )}
                </div>

                <div className="step-content">
                  <div className="step-title-row">
                    <span className="step-num">Step 0{step.id}</span>
                    <h4 className="step-title">{step.title}</h4>
                    {isCompleted && <span className="status-badge done">Done</span>}
                    {isActive && <span className="status-badge running">Processing...</span>}
                  </div>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Micro-note */}
        <div className="prediction-modal-footer">
          <Cpu size={14} />
          <span>Powered by Scikit-Learn & FastAPI Neural Engine</span>
        </div>
      </div>
    </div>
  );
}
