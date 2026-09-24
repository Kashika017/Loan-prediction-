import React, { useState } from 'react';
import { 
  RotateCcw, 
  Send, 
  UserCheck, 
  UserX, 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  HelpCircle,
  User,
  CreditCard,
  Home,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Cpu,
  Code2
} from 'lucide-react';

const LOW_RISK_PRESET = {
  FullName: "Sarah Jenkins",
  Age: 42,
  Gender: "Female",
  Married: "Yes",
  Dependents: "0",
  Education: "Master's",
  SelfEmployed: "No",
  ApplicantIncome: 110000,
  CoapplicantIncome: 25000,
  LoanAmount: 25000,
  LoanTerm: 36,
  CreditHistory: "1",
  CreditScore: 780,
  InterestRate: 6.5,
  DTIRatio: 0.18,
  PropertyArea: "Urban",
  HasMortgage: "No",
  HasCoSigner: "Yes",
  LoanPurpose: "Home"
};

const HIGH_RISK_PRESET = {
  FullName: "David Miller",
  Age: 22,
  Gender: "Male",
  Married: "No",
  Dependents: "2",
  Education: "High School",
  SelfEmployed: "Yes",
  ApplicantIncome: 22000,
  CoapplicantIncome: 0,
  LoanAmount: 140000,
  LoanTerm: 60,
  CreditHistory: "0",
  CreditScore: 480,
  InterestRate: 22.5,
  DTIRatio: 0.75,
  PropertyArea: "Rural",
  HasMortgage: "Yes",
  HasCoSigner: "No",
  LoanPurpose: "Other"
};

const INITIAL_FORM = {
  FullName: '',
  Age: '',
  Gender: 'Male',
  Married: 'No',
  Dependents: '0',
  Education: "Bachelor's",
  SelfEmployed: 'No',
  ApplicantIncome: '',
  CoapplicantIncome: '',
  LoanAmount: '',
  LoanTerm: '36',
  CreditHistory: '1',
  CreditScore: '720',
  InterestRate: '8.5',
  DTIRatio: '0.25',
  PropertyArea: 'Semiurban',
  HasMortgage: 'No',
  HasCoSigner: 'No',
  LoanPurpose: 'Auto'
};

export default function LoanForm({ onSubmit, isLoading }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [modelType, setModelType] = useState('scikit_learn');
  const [errors, setErrors] = useState({});
  const [formErrorMsg, setFormErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (formErrorMsg) setFormErrorMsg(null);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.FullName || formData.FullName.trim().length < 2) {
        newErrors.FullName = 'Please enter a valid full name';
      }
      const age = Number(formData.Age);
      if (!formData.Age || isNaN(age) || age < 18 || age > 100) {
        newErrors.Age = 'Age must be between 18 and 100';
      }
    }

    if (step === 2) {
      const inc = Number(formData.ApplicantIncome);
      if (!formData.ApplicantIncome || isNaN(inc) || inc < 1000) {
        newErrors.ApplicantIncome = 'Applicant monthly income must be at least $1,000';
      }
      const loan = Number(formData.LoanAmount);
      if (!formData.LoanAmount || isNaN(loan) || loan < 1000) {
        newErrors.LoanAmount = 'Requested loan amount must be at least $1,000';
      }
      const score = Number(formData.CreditScore);
      if (formData.CreditScore !== '' && (isNaN(score) || score < 300 || score > 850)) {
        newErrors.CreditScore = 'Credit score must be between 300 and 850';
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateAll = () => {
    const allErrors = {};

    if (!formData.FullName || formData.FullName.trim().length < 2) {
      allErrors.FullName = 'Please enter a valid full name';
    }
    const age = Number(formData.Age);
    if (!formData.Age || isNaN(age) || age < 18 || age > 100) {
      allErrors.Age = 'Age must be between 18 and 100';
    }

    const inc = Number(formData.ApplicantIncome);
    if (!formData.ApplicantIncome || isNaN(inc) || inc < 1000) {
      allErrors.ApplicantIncome = 'Applicant monthly income must be at least $1,000';
    }
    const loan = Number(formData.LoanAmount);
    if (!formData.LoanAmount || isNaN(loan) || loan < 1000) {
      allErrors.LoanAmount = 'Requested loan amount must be at least $1,000';
    }
    const score = Number(formData.CreditScore);
    if (formData.CreditScore !== '' && (isNaN(score) || score < 300 || score > 850)) {
      allErrors.CreditScore = 'Credit score must be between 300 and 850';
    }

    setErrors(allErrors);

    if (allErrors.FullName || allErrors.Age) return { isValid: false, stepWithError: 1 };
    if (allErrors.ApplicantIncome || allErrors.LoanAmount || allErrors.CreditScore) return { isValid: false, stepWithError: 2 };

    return { isValid: true, stepWithError: null };
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setFormErrorMsg(null);
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      setFormErrorMsg(`Please resolve the invalid fields in Step ${currentStep} before proceeding.`);
    }
  };

  const handlePrevStep = () => {
    setFormErrorMsg(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, stepWithError } = validateAll();
    if (!isValid) {
      setCurrentStep(stepWithError);
      setFormErrorMsg(`Validation Error: Please review and fix the highlighted fields in Step ${stepWithError}.`);
      return;
    }
    setFormErrorMsg(null);
    onSubmit(formData, modelType);
  };

  const applyPreset = (preset) => {
    setFormData(preset);
    setErrors({});
    setFormErrorMsg(null);
  };

  return (
    <div className="loan-form-card">
      <div className="form-header">
        <div className="form-title-group">
          <h2>Predict Loan Eligibility</h2>
          <p>Multi-section Machine Learning Applicant Evaluation Form</p>
        </div>
        
        <div className="preset-buttons">
          <button
            type="button"
            className="preset-btn low-risk"
            onClick={() => applyPreset(LOW_RISK_PRESET)}
          >
            <UserCheck size={15} /> Sample Prime Applicant
          </button>
          <button
            type="button"
            className="preset-btn high-risk"
            onClick={() => applyPreset(HIGH_RISK_PRESET)}
          >
            <UserX size={15} /> Sample High Risk
          </button>
          <button
            type="button"
            className="preset-btn reset"
            onClick={() => applyPreset(INITIAL_FORM)}
          >
            <RotateCcw size={15} /> Reset Form
          </button>
        </div>
      </div>

      {formErrorMsg && (
        <div className="form-validation-banner">
          <AlertCircle size={18} />
          <span>{formErrorMsg}</span>
        </div>
      )}

      {/* Progress Bar Indicator */}
      <div className="step-progress-bar">
        <div 
          className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
          onClick={() => setCurrentStep(1)}
        >
          <div className="step-circle">{currentStep > 1 ? <CheckCircle size={14} /> : '1'}</div>
          <span className="step-label">Personal Info</span>
        </div>

        <div className="progress-line"></div>

        <div 
          className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
          onClick={() => validateStep(1) && setCurrentStep(2)}
        >
          <div className="step-circle">{currentStep > 2 ? <CheckCircle size={14} /> : '2'}</div>
          <span className="step-label">Financial Info</span>
        </div>

        <div className="progress-line"></div>

        <div 
          className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}
          onClick={() => validateStep(1) && validateStep(2) && setCurrentStep(3)}
        >
          <div className="step-circle">{currentStep > 3 ? <CheckCircle size={14} /> : '3'}</div>
          <span className="step-label">Property Info</span>
        </div>

        <div className="progress-line"></div>

        <div 
          className={`progress-step ${currentStep === 4 ? 'active' : ''}`}
          onClick={() => validateStep(1) && validateStep(2) && setCurrentStep(4)}
        >
          <div className="step-circle">4</div>
          <span className="step-label">Review & Submit</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <div className="form-section">
            <h3 className="section-title"><User size={18} /> 1. Personal Information</h3>
            <div className="grid-3">
              <div className="form-group">
                <label htmlFor="FullName">Full Name *</label>
                <input
                  type="text"
                  id="FullName"
                  name="FullName"
                  placeholder="e.g. Eleanor Vance"
                  value={formData.FullName}
                  onChange={handleChange}
                  className={errors.FullName ? 'input-error' : ''}
                />
                {errors.FullName && <span className="error-text">{errors.FullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="Age">Age (Years) *</label>
                <input
                  type="number"
                  id="Age"
                  name="Age"
                  placeholder="e.g. 34"
                  min="18"
                  max="100"
                  value={formData.Age}
                  onChange={handleChange}
                  className={errors.Age ? 'input-error' : ''}
                />
                {errors.Age && <span className="error-text">{errors.Age}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="Gender">Gender *</label>
                <select id="Gender" name="Gender" value={formData.Gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="Married">Married *</label>
                <select id="Married" name="Married" value={formData.Married} onChange={handleChange}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="Dependents">Dependents *</label>
                <select id="Dependents" name="Dependents" value={formData.Dependents} onChange={handleChange}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="Education">Education Level *</label>
                <select id="Education" name="Education" value={formData.Education} onChange={handleChange}>
                  <option value="Graduate">Graduate / Bachelor's</option>
                  <option value="Not Graduate">High School / Non-Graduate</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="SelfEmployed">Self Employed *</label>
                <select id="SelfEmployed" name="SelfEmployed" value={formData.SelfEmployed} onChange={handleChange}>
                  <option value="No">No (Salaried Employee)</option>
                  <option value="Yes">Yes (Business / Self-Employed)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FINANCIAL INFORMATION */}
        {currentStep === 2 && (
          <div className="form-section">
            <h3 className="section-title"><CreditCard size={18} /> 2. Financial & Credit Information</h3>
            <div className="grid-3">
              <div className="form-group">
                <label htmlFor="ApplicantIncome">Applicant Monthly Income ($) *</label>
                <input
                  type="number"
                  id="ApplicantIncome"
                  name="ApplicantIncome"
                  placeholder="e.g. 55000"
                  value={formData.ApplicantIncome}
                  onChange={handleChange}
                  className={errors.ApplicantIncome ? 'input-error' : ''}
                />
                {errors.ApplicantIncome && <span className="error-text">{errors.ApplicantIncome}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="CoapplicantIncome">Co-applicant Income ($)</label>
                <input
                  type="number"
                  id="CoapplicantIncome"
                  name="CoapplicantIncome"
                  placeholder="e.g. 15000 (optional)"
                  value={formData.CoapplicantIncome}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="LoanAmount">Requested Loan Amount ($) *</label>
                <input
                  type="number"
                  id="LoanAmount"
                  name="LoanAmount"
                  placeholder="e.g. 25000"
                  value={formData.LoanAmount}
                  onChange={handleChange}
                  className={errors.LoanAmount ? 'input-error' : ''}
                />
                {errors.LoanAmount && <span className="error-text">{errors.LoanAmount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="LoanTerm">Loan Term (Months) *</label>
                <select id="LoanTerm" name="LoanTerm" value={formData.LoanTerm} onChange={handleChange}>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                  <option value="120">120 Months (10 Years)</option>
                  <option value="360">360 Months (30 Years)</option>
                </select>
              </div>

              <div className="form-group">
                <div className="label-with-tooltip">
                  <label htmlFor="CreditHistory">Credit History *</label>
                  <HelpCircle size={13} className="tooltip-icon" title="1 = Meets guidelines (No major defaults). 0 = Past default or adverse credit." />
                </div>
                <select id="CreditHistory" name="CreditHistory" value={formData.CreditHistory} onChange={handleChange}>
                  <option value="1">1.0 (Clean Credit History)</option>
                  <option value="0">0.0 (Adverse / No Credit History)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="CreditScore">Credit Score (300-850)</label>
                <input
                  type="number"
                  id="CreditScore"
                  name="CreditScore"
                  placeholder="e.g. 740"
                  value={formData.CreditScore}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="DTIRatio">Debt-to-Income (DTI) Ratio</label>
                <input
                  type="number"
                  id="DTIRatio"
                  name="DTIRatio"
                  step="0.01"
                  placeholder="e.g. 0.25 (25%)"
                  value={formData.DTIRatio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROPERTY INFORMATION */}
        {currentStep === 3 && (
          <div className="form-section">
            <h3 className="section-title"><Home size={18} /> 3. Property & Collateral Information</h3>
            <div className="grid-3">
              <div className="form-group">
                <label htmlFor="PropertyArea">Property Area Location *</label>
                <select id="PropertyArea" name="PropertyArea" value={formData.PropertyArea} onChange={handleChange}>
                  <option value="Urban">Urban</option>
                  <option value="Semiurban">Semiurban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="HasMortgage">Has Existing Mortgage *</label>
                <select id="HasMortgage" name="HasMortgage" value={formData.HasMortgage} onChange={handleChange}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="HasCoSigner">Has Co-Signer *</label>
                <select id="HasCoSigner" name="HasCoSigner" value={formData.HasCoSigner} onChange={handleChange}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="LoanPurpose">Loan Purpose *</label>
                <select id="LoanPurpose" name="LoanPurpose" value={formData.LoanPurpose} onChange={handleChange}>
                  <option value="Auto">Auto Loan</option>
                  <option value="Home">Home Mortgage</option>
                  <option value="Business">Business Expansion</option>
                  <option value="Education">Education</option>
                  <option value="Other">Personal / Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {currentStep === 4 && (
          <div className="form-section">
            <h3 className="section-title"><CheckCircle size={18} /> 4. Review & Select Model Engine</h3>
            <p className="review-intro">Please select the ML algorithm engine and confirm applicant parameters before running prediction.</p>

            {/* Algorithm Selector Box matching SOP Phase 1 Scratch requirement */}
            <div className="algorithm-selector-box">
              <label className="algo-selector-label">Select Inference Engine Model (SOP Phase 1 Constraint):</label>
              <div className="algo-radio-group">
                <button
                  type="button"
                  className={`algo-btn ${modelType === 'scikit_learn' ? 'active' : ''}`}
                  onClick={() => setModelType('scikit_learn')}
                >
                  <Cpu size={16} />
                  <div>
                    <strong>Scikit-Learn RandomForest</strong>
                    <span>Ensemble 100 Trees (88.6% Accuracy)</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`algo-btn ${modelType === 'scratch' ? 'active' : ''}`}
                  onClick={() => setModelType('scratch')}
                >
                  <Code2 size={16} />
                  <div>
                    <strong>Custom Scratch DecisionTree</strong>
                    <span>Pure Python & NumPy (No Libraries)</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="review-grid">
              <div className="review-card">
                <h4>Personal Profile</h4>
                <ul>
                  <li><strong>Full Name:</strong> {formData.FullName || 'Not specified'}</li>
                  <li><strong>Age / Gender:</strong> {formData.Age || '--'} Yrs / {formData.Gender}</li>
                  <li><strong>Marital / Dependents:</strong> {formData.Married === 'Yes' ? 'Married' : 'Single'} ({formData.Dependents} Dependents)</li>
                  <li><strong>Education:</strong> {formData.Education}</li>
                  <li><strong>Self Employed:</strong> {formData.SelfEmployed}</li>
                </ul>
                <button type="button" className="btn-text-sm" onClick={() => setCurrentStep(1)}>Edit Personal</button>
              </div>

              <div className="review-card">
                <h4>Financial Metrics</h4>
                <ul>
                  <li><strong>Applicant Income:</strong> ${Number(formData.ApplicantIncome).toLocaleString() || 0}</li>
                  <li><strong>Co-applicant Income:</strong> ${Number(formData.CoapplicantIncome).toLocaleString() || 0}</li>
                  <li><strong>Requested Loan:</strong> ${Number(formData.LoanAmount).toLocaleString() || 0}</li>
                  <li><strong>Loan Term:</strong> {formData.LoanTerm} Months</li>
                  <li><strong>Credit History / Score:</strong> {formData.CreditHistory === '1' ? 'Clean (1.0)' : 'Adverse (0.0)'} ({formData.CreditScore || 'N/A'})</li>
                </ul>
                <button type="button" className="btn-text-sm" onClick={() => setCurrentStep(2)}>Edit Financial</button>
              </div>

              <div className="review-card">
                <h4>Property & Purpose</h4>
                <ul>
                  <li><strong>Property Location:</strong> {formData.PropertyArea}</li>
                  <li><strong>Existing Mortgage:</strong> {formData.HasMortgage}</li>
                  <li><strong>Co-Signer Guaranteed:</strong> {formData.HasCoSigner}</li>
                  <li><strong>Loan Purpose:</strong> {formData.LoanPurpose}</li>
                </ul>
                <button type="button" className="btn-text-sm" onClick={() => setCurrentStep(3)}>Edit Property</button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Live Telemetry Strip */}
        {formData.ApplicantIncome && formData.LoanAmount && (
          <div className="live-metrics-strip">
            <div className="live-metric-item">
              <span className="live-label"><Calculator size={14} /> Loan-to-Income</span>
              <span className="live-val">
                {(parseFloat(formData.LoanAmount) / (parseFloat(formData.ApplicantIncome) + parseFloat(formData.CoapplicantIncome || 0))).toFixed(2)}x
              </span>
            </div>
            <div className="live-metric-item">
              <span className="live-label"><DollarSign size={14} /> Monthly Income</span>
              <span className="live-val">${Math.round((parseFloat(formData.ApplicantIncome) + parseFloat(formData.CoapplicantIncome || 0)) / 12).toLocaleString()}</span>
            </div>
            <div className="live-metric-item">
              <span className="live-label"><TrendingUp size={14} /> Credit Rating</span>
              <span className={`live-val ${formData.CreditHistory === '1' ? 'text-good' : 'text-warn'}`}>
                {formData.CreditHistory === '1' ? 'Good Standing' : 'Risk Warning'}
              </span>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="form-step-actions">
          {currentStep > 1 && (
            <button type="button" className="btn-secondary" onClick={handlePrevStep}>
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {currentStep < 4 ? (
            <button type="button" className="btn-primary" onClick={handleNextStep}>
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div> Running Model Inference...
                </>
              ) : (
                <>
                  <Send size={18} /> Predict Loan Eligibility
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
