import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  X,
  SearchX,
  Inbox,
  FilterX,
  FilePlus
} from 'lucide-react';

export default function AssessmentHistory({ onSelectRecord, onNavigate }) {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const [inspectItem, setInspectItem] = useState(null);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('loan_risk_eval_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        const mockData = [
          {
            refId: 'LN-AI-2026-98124',
            timestamp: 'Today, 11:34 AM',
            formData: { FullName: 'Eleanor Vance', ApplicantIncome: 85000, LoanAmount: 25000, CreditHistory: '1', PropertyArea: 'Urban' },
            result: { prediction: 'No Default', risk_level: 'Low Risk', status: 'Likely Approved', approval_probability: '92.4%', message: 'Low default risk detected.' }
          },
          {
            refId: 'LN-AI-2026-44129',
            timestamp: 'Today, 10:15 AM',
            formData: { FullName: 'Marcus Brodie', ApplicantIncome: 28000, LoanAmount: 85000, CreditHistory: '0', PropertyArea: 'Rural' },
            result: { prediction: 'Default', risk_level: 'High Risk', status: 'High Risk of Default', approval_probability: '28.1%', message: 'Elevated DTI ratio and past adverse credit history.' }
          },
          {
            refId: 'LN-AI-2026-31902',
            timestamp: 'Yesterday, 04:20 PM',
            formData: { FullName: 'Sophia Lin', ApplicantIncome: 120000, LoanAmount: 40000, CreditHistory: '1', PropertyArea: 'Semiurban' },
            result: { prediction: 'No Default', risk_level: 'Low Risk', status: 'Likely Approved', approval_probability: '95.8%', message: 'Prime tier credit profile.' }
          }
        ];
        setHistory(mockData);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all prediction history logs?')) {
      localStorage.removeItem('loan_risk_eval_history');
      setHistory([]);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterTier('ALL');
    setSortBy('NEWEST');
    setCurrentPage(1);
  };

  const filteredHistory = history.filter(item => {
    const isApproved = item.result?.risk_level === 'Low Risk' || item.result?.prediction === 'No Default';
    
    if (filterTier === 'APPROVED' && !isApproved) return false;
    if (filterTier === 'REJECTED' && isApproved) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const ref = (item.refId || '').toLowerCase();
      const name = (item.formData?.FullName || '').toLowerCase();
      const inc = String(item.formData?.ApplicantIncome || item.formData?.Income || '');
      const loan = String(item.formData?.LoanAmount || '');
      
      return ref.includes(term) || name.includes(term) || inc.includes(term) || loan.includes(term);
    }

    return true;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'NEWEST') return 0;
    if (sortBy === 'HIGHEST_LOAN') return (Number(b.formData?.LoanAmount) || 0) - (Number(a.formData?.LoanAmount) || 0);
    if (sortBy === 'HIGHEST_INCOME') return (Number(b.formData?.ApplicantIncome || b.formData?.Income) || 0) - (Number(a.formData?.ApplicantIncome || a.formData?.Income) || 0);
    return 0;
  });

  const totalPages = Math.ceil(sortedHistory.length / ITEMS_PER_PAGE) || 1;
  const paginatedHistory = sortedHistory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="history-card">
      <div className="history-header">
        <div className="policy-title-group">
          <div className="policy-icon">
            <History size={24} />
          </div>
          <div>
            <h2>Prediction History Logs</h2>
            <p>Search, filter, and inspect past machine learning loan evaluations</p>
          </div>
        </div>

        <div className="history-actions">
          <button className="action-btn danger" onClick={handleClearHistory} disabled={history.length === 0}>
            <Trash2 size={15} /> Clear All Logs
          </button>
        </div>
      </div>

      <div className="history-filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by ID, Name, Loan Amount or Income..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button className="btn-icon-xs" onClick={() => setSearchTerm('')} title="Clear Search">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-group-strip">
          <div className="tier-filter-buttons">
            <button
              className={`tier-btn ${filterTier === 'ALL' ? 'active' : ''}`}
              onClick={() => { setFilterTier('ALL'); setCurrentPage(1); }}
            >
              All ({history.length})
            </button>
            <button
              className={`tier-btn ${filterTier === 'APPROVED' ? 'active' : ''}`}
              onClick={() => { setFilterTier('APPROVED'); setCurrentPage(1); }}
            >
              Approved
            </button>
            <button
              className={`tier-btn ${filterTier === 'REJECTED' ? 'active' : ''}`}
              onClick={() => { setFilterTier('REJECTED'); setCurrentPage(1); }}
            >
              Rejected
            </button>
          </div>

          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="NEWEST">Sort: Newest First</option>
            <option value="HIGHEST_LOAN">Sort: Highest Loan</option>
            <option value="HIGHEST_INCOME">Sort: Highest Income</option>
          </select>
        </div>
      </div>

      {paginatedHistory.length === 0 ? (
        history.length === 0 ? (
          <div className="history-empty-card">
            <div className="empty-icon-wrapper">
              <Inbox size={42} />
            </div>
            <h3>No History Logs Available</h3>
            <p>You have not run any loan evaluations in this session. Run your first Machine Learning prediction to track applicant risk profiles.</p>
            {onNavigate && (
              <button type="button" className="btn-primary" onClick={() => onNavigate('form')}>
                <FilePlus size={16} /> Predict Loan Eligibility
              </button>
            )}
          </div>
        ) : (
          <div className="history-empty-card">
            <div className="empty-icon-wrapper warn">
              <SearchX size={42} />
            </div>
            <h3>No Matching Evaluation Records</h3>
            <p>No predictions match your search keyword "<strong>{searchTerm}</strong>" or selected filter options.</p>
            <button type="button" className="action-btn secondary" onClick={resetFilters}>
              <FilterX size={15} /> Clear Search & Filters
            </button>
          </div>
        )
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Prediction ID</th>
                <th>Date / Time</th>
                <th>Applicant Name</th>
                <th>Applicant Income</th>
                <th>Loan Amount</th>
                <th>Credit History</th>
                <th>Prediction</th>
                <th>Probability</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistory.map((item, idx) => {
                const isApproved = item.result?.risk_level === 'Low Risk' || item.result?.prediction === 'No Default';
                return (
                  <tr key={idx}>
                    <td className="ref-cell">{item.refId}</td>
                    <td className="time-cell">{item.timestamp}</td>
                    <td><strong>{item.formData?.FullName || 'Applicant'}</strong></td>
                    <td className="amount-cell">${Number(item.formData?.ApplicantIncome || item.formData?.Income || 0).toLocaleString()}</td>
                    <td className="amount-cell">${Number(item.formData?.LoanAmount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`credit-badge ${item.formData?.CreditHistory === '1' ? 'good' : 'fair'}`}>
                        {item.formData?.CreditHistory === '1' ? 'Clean (1.0)' : 'Adverse (0.0)'}
                      </span>
                    </td>
                    <td>
                      <span className={`risk-pill-sm ${isApproved ? 'low' : 'high'}`}>
                        {isApproved ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                    <td><strong>{item.result?.approval_probability || '85.0%'}</strong></td>
                    <td>
                      <button className="table-view-btn" onClick={() => setInspectItem(item)}>
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-bar">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="pagination-btns">
            <button 
              className="page-btn" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button 
              className="page-btn" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {inspectItem && (
        <div className="modal-overlay" onClick={() => setInspectItem(null)}>
          <div className="modal-card detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setInspectItem(null)}><X size={18} /></button>

            <div className="modal-header-strip">
              <span className="ref-number">{inspectItem.refId}</span>
              <span className={`risk-badge ${inspectItem.result?.risk_level === 'Low Risk' ? 'badge-low' : 'badge-high'}`}>
                {inspectItem.result?.risk_level === 'Low Risk' ? 'Likely Approved' : 'Rejected / High Risk'}
              </span>
            </div>

            <h3>Prediction Record Detail</h3>
            <p className="time-cell">Evaluated on {inspectItem.timestamp}</p>

            <div className="review-grid margin-top">
              <div className="review-card">
                <h4>Applicant Parameters</h4>
                <ul>
                  <li><strong>Full Name:</strong> {inspectItem.formData?.FullName || 'N/A'}</li>
                  <li><strong>Monthly Income:</strong> ${Number(inspectItem.formData?.ApplicantIncome || inspectItem.formData?.Income || 0).toLocaleString()}</li>
                  <li><strong>Co-applicant Income:</strong> ${Number(inspectItem.formData?.CoapplicantIncome || 0).toLocaleString()}</li>
                  <li><strong>Education:</strong> {inspectItem.formData?.Education || 'Graduate'}</li>
                </ul>
              </div>

              <div className="review-card">
                <h4>Loan Request</h4>
                <ul>
                  <li><strong>Loan Amount:</strong> ${Number(inspectItem.formData?.LoanAmount || 0).toLocaleString()}</li>
                  <li><strong>Loan Term:</strong> {inspectItem.formData?.LoanTerm || 36} Months</li>
                  <li><strong>Credit History:</strong> {inspectItem.formData?.CreditHistory === '1' ? 'Clean (1.0)' : 'Adverse (0.0)'}</li>
                  <li><strong>Property Location:</strong> {inspectItem.formData?.PropertyArea || 'Semiurban'}</li>
                </ul>
              </div>
            </div>

            <div className={`message-box margin-top ${inspectItem.result?.risk_level === 'Low Risk' ? 'msg-low' : 'msg-high'}`}>
              <p><strong>Model Decision Summary:</strong> {inspectItem.result?.message}</p>
            </div>

            <div className="modal-footer-actions">
              <button 
                className="btn-primary" 
                onClick={() => {
                  onSelectRecord(inspectItem);
                  setInspectItem(null);
                }}
              >
                Load into Evaluator Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
