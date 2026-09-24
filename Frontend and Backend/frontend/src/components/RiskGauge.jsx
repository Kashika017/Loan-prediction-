import React from 'react';

export default function RiskGauge({ score = 0 }) {
  // score is between 0 and 100
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  // SVG Gauge calculations (180 degree semi-circle)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half circle arc length
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Needle angle from -90deg to +90deg
  const needleAngle = -90 + (normalizedScore / 100) * 180;

  const getGaugeColor = (val) => {
    if (val < 35) return '#10b981'; // Green (Low Risk)
    if (val < 60) return '#f59e0b'; // Amber (Moderate Risk)
    return '#ff4b72'; // Red (High Risk)
  };

  const currentColor = getGaugeColor(normalizedScore);

  return (
    <div className="risk-gauge-wrapper">
      <div className="gauge-container">
        <svg viewBox="0 0 200 120" className="gauge-svg">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ff4b72" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />

          {/* Center Pivot Circle */}
          <circle cx="100" cy="100" r="7" fill="#ffffff" />
          <circle cx="100" cy="100" r="3" fill="#060913" />

          {/* Animated Needle */}
          <g transform={`rotate(${needleAngle}, 100, 100)`} style={{ transition: 'transform 1s ease-in-out' }}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={currentColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </svg>

        <div className="gauge-score-display">
          <span className="gauge-score-value" style={{ color: currentColor }}>
            {normalizedScore.toFixed(1)}%
          </span>
          <span className="gauge-score-label">Default Risk Index</span>
        </div>
      </div>

      <div className="gauge-risk-scale">
        <span className="scale-item green">0-35% Low</span>
        <span className="scale-item yellow">35-60% Moderate</span>
        <span className="scale-item red">60-100% High</span>
      </div>
    </div>
  );
}
